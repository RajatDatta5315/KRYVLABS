#!/bin/bash
# Run these commands in order from inside the KRYVLABS folder
# The database is already created. Just run these:

cd "$(dirname "$0")"  # this moves you into the worker/ folder

# 1. Run the schema (creates tables)
npx wrangler d1 execute kryvlabs-db --remote --file=schema.sql

# 2. Set your OpenAI key
npx wrangler secret put OPENAI_API_KEY --name kryvlabs-api

# 3. Set a JWT secret (type any random password when prompted)
npx wrangler secret put JWT_SECRET --name kryvlabs-api

# 4. Deploy the worker
npx wrangler deploy

# 5. Copy the worker URL shown at the end
#    It will look like: https://kryvlabs-api.YOUR-NAME.workers.dev
#    Add it to Vercel env vars as: VITE_API_URL = <that URL>
