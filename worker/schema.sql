-- Run with: npx wrangler d1 execute kryvlabs-db --file=schema.sql

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  model TEXT DEFAULT 'gpt-4o' NOT NULL,
  system_prompt TEXT,
  status TEXT DEFAULT 'idle' CHECK (status IN ('idle', 'working', 'training', 'offline')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  agent_id TEXT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  instruction TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  progress INTEGER DEFAULT 0,
  result TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS knowledge (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL
);
