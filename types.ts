export type Category = 'Politics' | 'Education' | 'Business' | 'Sports' | 'Entertainment' | 'Local News';

export interface ArticleComment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string; // ISO String from Supabase
  likes: number;
  dislikes: number;
}

export interface DomainSettings {
  customDomain: string;
  isConfigured: boolean;
  dnsProvider: string;
  sslStatus: 'pending' | 'active' | 'expired';
  lastVerified: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string; // Optional: Some drafts might not have excerpts yet
  category: Category;
  featuredImage?: string; // Optional: Image might be broken or missing
  author: string;
  publishedAt: string | null; // CRITICAL: Drafts from Supabase will have null dates
  isPublished: boolean;
  isTrending: boolean;
  tags: string[];
  comments?: ArticleComment[];
  // Added created_at as a fallback for the "Safe Date" logic we built
  created_at?: string; 
}

export interface User {
  id: string;
  username: string;
  email?: string; // Helpful for admin/auth scenarios
  role: 'admin';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  isRead?: boolean; // Useful for the admin dashboard logic
}