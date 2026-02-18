import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

// The '!' non-null assertion is now safe because App.tsx checks for these variables before this client is ever used.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
