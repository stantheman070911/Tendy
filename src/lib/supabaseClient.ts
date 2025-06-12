// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase' // This file will be generated next

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and anon key are required.");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);