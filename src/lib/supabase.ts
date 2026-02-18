import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Use console.error instead of throwing an error to prevent a hard crash
  // This allows the UI to load and show a more graceful failure state
  console.error("CRITICAL: Supabase URL and Anon Key are not defined in .env file.");
  console.error("Please create a .env file from .env.example and add your Supabase credentials.");
}

export const supabase = createClient<Database>(supabaseUrl!, supabaseAnonKey!)
