/**
 * KRYVLABS API Client
 * Works with Cloudflare D1 Worker OR falls back to demo mode
 */

const BASE = import.meta.env.VITE_API_URL || '';

// Token stored in memory (not localStorage for security)
let _token: string | null = null;
let _user: any = null;

export function getToken() { return _token; }
export function getUser() { return _user; }
export function setAuth(token: string, user: any) { _token = token; _user = user; }
export function clearAuth() { _token = null; _user = null; }

async function req(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (_token) headers['Authorization'] = `Bearer ${_token}`;
  const res = await fetch(`${BASE}${path}`, { ...options, headers: { ...headers, ...(options.headers as any) } });
  if (!res.ok) {
    const e = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(e.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  // Auth
  signup: (email: string, password: string) =>
    req('/auth/signup', { method: 'POST', body: JSON.stringify({ email, password }) }),
  signin: (email: string, password: string) =>
    req('/auth/signin', { method: 'POST', body: JSON.stringify({ email, password }) }),

  // Agents
  getAgents: () => req('/agents'),
  createAgent: (data: { name: string; model: string; system_prompt: string }) =>
    req('/agents', { method: 'POST', body: JSON.stringify(data) }),
  deleteAgent: (id: string) => req(`/agents/${id}`, { method: 'DELETE' }),

  // Tasks
  getTasks: (agentId: string) => req(`/tasks/${agentId}`),
  createTask: (agentId: string, instruction: string) =>
    req('/tasks', { method: 'POST', body: JSON.stringify({ agent_id: agentId, instruction }) }),

  // Knowledge
  getKnowledge: () => req('/knowledge'),
  addKnowledge: (content: string) =>
    req('/knowledge', { method: 'POST', body: JSON.stringify({ content }) }),
  deleteKnowledge: (id: string) => req(`/knowledge/${id}`, { method: 'DELETE' }),

  // Publish
  publish: (data: any) =>
    req('/publish', { method: 'POST', body: JSON.stringify(data) }),
};
