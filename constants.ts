
import { Post, Category } from './types';

// Environment-driven values (Vite exposes vars prefixed with VITE_)
export const APP_TITLE = import.meta.env.VITE_APP_TITLE || 'News Nikwetu';
export const API_URL = import.meta.env.VITE_API_URL || '';
export const GA_ID = import.meta.env.VITE_GA_ID || '';

export const CATEGORIES: Category[] = [
  'Politics',
  'Education',
  'Business',
  'Sports',
  'Entertainment',
  'Local News'
];

