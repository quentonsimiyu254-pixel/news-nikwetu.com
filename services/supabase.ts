import { createClient } from '@supabase/supabase-js';

// Use type casting to 'any' to stop TypeScript from complaining about .env
const env = (import.meta as any).env;

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    'CONNECTION ERROR: Supabase environment variables are missing. ' +
    'Check Vercel Dashboard -> Settings -> Environment Variables.'
  );
}

// Create a single supabase client for entire app
export const supabase = createClient(
  SUPABASE_URL || '', 
  SUPABASE_ANON_KEY || ''
);