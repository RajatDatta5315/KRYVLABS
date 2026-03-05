/**
 * KRYVLABS Cloudflare Worker + D1 Backend
 * Deploy: npx wrangler deploy
 * Set secret: npx wrangler secret put OPENAI_API_KEY
 * Set secret: npx wrangler secret put JWT_SECRET
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

function err(msg, status = 400) {
  return json({ error: msg }, status);
}

// Simple JWT using Web Crypto
async function signToken(payload, secret) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }));
  const data = `${header}.${body}`;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return `${data}.${btoa(String.fromCharCode(...new Uint8Array(sig)))}`;
}

async function verifyToken(token, secret) {
  try {
    const [header, body, sig] = token.split('.');
    const data = `${header}.${body}`;
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    const sigBytes = Uint8Array.from(atob(sig), c => c.charCodeAt(0));
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(data));
    if (!valid) return null;
    const payload = JSON.parse(atob(body));
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch { return null; }
}

async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

async function getUser(request, env) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.replace('Bearer ', '');
  if (!token) return null;
  return verifyToken(token, env.JWT_SECRET || 'kryvlabs-secret');
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    if (method === 'OPTIONS') return new Response(null, { headers: CORS });

    // ── AUTH ──────────────────────────────────────────────
    if (path === '/auth/signup' && method === 'POST') {
      const { email, password } = await request.json();
      if (!email || !password) return err('Email and password required');
      const hash = await hashPassword(password);
      const id = crypto.randomUUID();
      try {
        await env.DB.prepare('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)')
          .bind(id, email.toLowerCase(), hash).run();
        const token = await signToken({ id, email }, env.JWT_SECRET || 'kryvlabs-secret');
        return json({ token, user: { id, email } });
      } catch (e) {
        return err('Email already exists', 409);
      }
    }

    if (path === '/auth/signin' && method === 'POST') {
      const { email, password } = await request.json();
      const hash = await hashPassword(password);
      const user = await env.DB.prepare('SELECT * FROM users WHERE email = ? AND password_hash = ?')
        .bind(email.toLowerCase(), hash).first();
      if (!user) return err('Invalid credentials', 401);
      const token = await signToken({ id: user.id, email: user.email }, env.JWT_SECRET || 'kryvlabs-secret');
      return json({ token, user: { id: user.id, email: user.email } });
    }

    // ── AGENTS ────────────────────────────────────────────
    if (path === '/agents' && method === 'GET') {
      const user = await getUser(request, env);
      if (!user) return err('Unauthorized', 401);
      const { results } = await env.DB.prepare('SELECT * FROM agents WHERE owner_id = ? ORDER BY created_at DESC')
        .bind(user.id).all();
      return json(results);
    }

    if (path === '/agents' && method === 'POST') {
      const user = await getUser(request, env);
      if (!user) return err('Unauthorized', 401);
      const { name, model, system_prompt } = await request.json();
      if (!name) return err('Name required');
      const id = crypto.randomUUID();
      await env.DB.prepare('INSERT INTO agents (id, owner_id, name, model, system_prompt) VALUES (?, ?, ?, ?, ?)')
        .bind(id, user.id, name, model || 'gpt-4o', system_prompt || '').run();
      const agent = await env.DB.prepare('SELECT * FROM agents WHERE id = ?').bind(id).first();
      return json(agent, 201);
    }

    if (path.startsWith('/agents/') && method === 'DELETE') {
      const user = await getUser(request, env);
      if (!user) return err('Unauthorized', 401);
      const id = path.split('/')[2];
      await env.DB.prepare('DELETE FROM agents WHERE id = ? AND owner_id = ?').bind(id, user.id).run();
      return json({ deleted: true });
    }

    // ── TASKS ─────────────────────────────────────────────
    if (path.startsWith('/tasks/') && method === 'GET') {
      const user = await getUser(request, env);
      if (!user) return err('Unauthorized', 401);
      const agentId = path.split('/')[2];
      const { results } = await env.DB.prepare('SELECT * FROM tasks WHERE agent_id = ? AND owner_id = ? ORDER BY created_at DESC LIMIT 20')
        .bind(agentId, user.id).all();
      return json(results);
    }

    if (path === '/tasks' && method === 'POST') {
      const user = await getUser(request, env);
      if (!user) return err('Unauthorized', 401);
      const { agent_id, instruction } = await request.json();
      const agent = await env.DB.prepare('SELECT * FROM agents WHERE id = ? AND owner_id = ?')
        .bind(agent_id, user.id).first();
      if (!agent) return err('Agent not found', 404);

      const taskId = crypto.randomUUID();
      await env.DB.prepare('INSERT INTO tasks (id, agent_id, owner_id, instruction, status) VALUES (?, ?, ?, ?, ?)')
        .bind(taskId, agent_id, user.id, instruction, 'pending').run();

      // Run AI async (don't await — fire and forget, update DB when done)
      env.ctx?.waitUntil(runAgentTask(taskId, agent, instruction, env));

      const task = await env.DB.prepare('SELECT * FROM tasks WHERE id = ?').bind(taskId).first();
      return json(task, 201);
    }

    // ── KNOWLEDGE ─────────────────────────────────────────
    if (path === '/knowledge' && method === 'GET') {
      const user = await getUser(request, env);
      if (!user) return err('Unauthorized', 401);
      const { results } = await env.DB.prepare('SELECT id, content, created_at FROM knowledge WHERE owner_id = ? ORDER BY created_at DESC')
        .bind(user.id).all();
      return json(results);
    }

    if (path === '/knowledge' && method === 'POST') {
      const user = await getUser(request, env);
      if (!user) return err('Unauthorized', 401);
      const { content } = await request.json();
      const id = crypto.randomUUID();
      await env.DB.prepare('INSERT INTO knowledge (id, owner_id, content) VALUES (?, ?, ?)')
        .bind(id, user.id, content).run();
      return json({ id, content }, 201);
    }

    if (path.startsWith('/knowledge/') && method === 'DELETE') {
      const user = await getUser(request, env);
      if (!user) return err('Unauthorized', 401);
      const id = path.split('/')[2];
      await env.DB.prepare('DELETE FROM knowledge WHERE id = ? AND owner_id = ?').bind(id, user.id).run();
      return json({ deleted: true });
    }

    // ── PUBLISH TO KRIYEX ─────────────────────────────────
    if (path === '/publish' && method === 'POST') {
      const user = await getUser(request, env);
      if (!user) return err('Unauthorized', 401);
      const body = await request.json();
      // Forward to KRIYEX marketplace
      const res = await fetch('https://kriyex.kryv.network/api/agents/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({ ok: res.ok }));
      return json(data, res.status);
    }

    return err('Not found', 404);
  }
};

// ── AI TASK RUNNER ────────────────────────────────────────
async function runAgentTask(taskId, agent, instruction, env) {
  try {
    await env.DB.prepare('UPDATE tasks SET status = ?, progress = ? WHERE id = ?')
      .bind('processing', 10, taskId).run();
    await env.DB.prepare('UPDATE agents SET status = ? WHERE id = ?')
      .bind('working', agent.id).run();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: agent.model || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: agent.system_prompt || 'You are a helpful AI assistant.' },
          { role: 'user', content: instruction },
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) throw new Error(`OpenAI error: ${response.status}`);
    const data = await response.json();
    const result = data.choices[0].message.content;

    await env.DB.prepare('UPDATE tasks SET status = ?, progress = ?, result = ? WHERE id = ?')
      .bind('completed', 100, JSON.stringify({ content: result }), taskId).run();
    await env.DB.prepare('UPDATE agents SET status = ? WHERE id = ?')
      .bind('idle', agent.id).run();
  } catch (e) {
    await env.DB.prepare('UPDATE tasks SET status = ?, progress = ? WHERE id = ?')
      .bind('failed', 0, taskId).run();
    await env.DB.prepare('UPDATE agents SET status = ? WHERE id = ?')
      .bind('idle', agent.id).run();
  }
}
