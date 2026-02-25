import { Category } from './types';

// Bypass TypeScript error for Vite environment variables
const env = (import.meta as any).env;

// Environment-driven values
export const APP_TITLE = env.VITE_APP_TITLE || 'News Nikwetu';
export const API_URL = env.VITE_API_URL || '';
export const GA_ID = env.VITE_GA_ID || '';

// Supabase config (handy to have here if you reference them elsewhere)
export const SUPABASE_URL = env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || '';

export const CATEGORIES: Category[] = [
  'Politics',
  'Education',
  'Business',
  'Sports',
  'Entertainment',
  'Local News'
];