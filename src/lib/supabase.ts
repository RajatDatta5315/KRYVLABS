// STUB — Supabase has been replaced with Cloudflare D1 Worker (src/lib/api-client.ts)
// This file exists only so old imports don't break the build.
// All actual data operations use api-client.ts
export const supabase = {
  from: () => ({ select: () => ({ eq: () => ({ order: () => ({ data: [], error: null }) }) }), insert: () => ({ error: null }), delete: () => ({ eq: () => ({ error: null }) }), update: () => ({ eq: () => ({ error: null }) }) }),
  auth: { getUser: async () => ({ data: { user: null } }), signOut: async () => {}, onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }), getSession: async () => ({ data: { session: null } }) },
  storage: { from: () => ({ upload: async () => ({ error: new Error('Use D1 Worker') }), getPublicUrl: () => ({ data: { publicUrl: '' } }) }) },
  functions: { invoke: async () => ({ data: null, error: new Error('Use D1 Worker') }) },
  channel: () => ({ on: () => ({ subscribe: () => {} }) }),
  removeChannel: () => {},
};
