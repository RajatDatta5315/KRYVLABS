# KRYVLABS Worker — Cloudflare D1 Backend

## Setup (5 minutes)

### 1. Install Wrangler
```bash
npm install -g wrangler
wrangler login
```

### 2. Create D1 Database
```bash
npx wrangler d1 create kryvlabs-db
```
Copy the `database_id` from output → paste into `wrangler.toml`

### 3. Run Schema
```bash
npx wrangler d1 execute kryvlabs-db --file=schema.sql
```

### 4. Set Secrets
```bash
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put JWT_SECRET   # any random string
```

### 5. Deploy
```bash
npx wrangler deploy
```
Your API will be live at: `https://kryvlabs-api.YOUR_SUBDOMAIN.workers.dev`

### 6. Update KRYVLABS Frontend
In Vercel → KRYVLABS project → Environment Variables:
```
VITE_API_URL = https://kryvlabs-api.YOUR_SUBDOMAIN.workers.dev
```
Remove the Supabase env vars — no longer needed.

## Endpoints
- POST /auth/signup — Register
- POST /auth/signin — Login  
- GET  /agents — List my agents
- POST /agents — Create agent
- DELETE /agents/:id — Delete agent
- GET  /tasks/:agentId — List tasks
- POST /tasks — Create + execute task
- GET  /knowledge — List knowledge
- POST /knowledge — Add knowledge entry
- DELETE /knowledge/:id — Remove entry
- POST /publish — Publish agent to KRIYEX
