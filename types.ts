
export type Category = 'Politics' | 'Education' | 'Business' | 'Sports' | 'Entertainment' | 'Local News';

export interface ArticleComment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
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
  excerpt: string;
  category: Category;
  featuredImage: string;
  author: string;
  publishedAt: string;
  isPublished: boolean;
  isTrending: boolean;
  tags: string[];
  comments?: ArticleComment[];
}

export interface User {
  id: string;
  username: string;
  role: 'admin';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}
