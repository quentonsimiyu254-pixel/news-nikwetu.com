import { Post, Category, ContactMessage, ArticleComment, DomainSettings } from '../types';
import { supabase } from './supabase';

// Helper to generate a clean URL slug
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const cmsService = {
  getDomainSettings: async (): Promise<DomainSettings> => {
    const { data, error } = await supabase.from('domain_settings').select('*').limit(1).single();
    
    if (error && error.code !== 'PGRST116') {
      console.warn('Supabase getDomainSettings error', error);
    }

    if (data) return data as DomainSettings;

    const defaultSettings = {
      custom_domain: 'newskikwetu.com',
      is_configured: false,
      dns_provider: 'Not set',
      ssl_status: 'pending',
      last_verified: new Date().toISOString()
    };

    await supabase.from('domain_settings').insert(defaultSettings);
    return defaultSettings as unknown as DomainSettings;
  },

  saveDomainSettings: async (settings: any) => {
    await supabase.from('domain_settings').upsert(settings);
  },

  getPosts: async (): Promise<Post[]> => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('published_at', { ascending: false });
    if (error) {
      console.error('getPosts error', error);
      return [];
    }
    return (data || []) as Post[];
  },

  getPublishedPosts: async (): Promise<Post[]> => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });
    if (error) {
      console.error('getPublishedPosts error', error);
      return [];
    }
    return (data || []) as Post[];
  },

  getPostBySlug: async (slug: string): Promise<Post | null> => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .limit(1)
      .single();
    if (error) {
      console.error('getPostBySlug error', error);
      return null;
    }
    return data as Post;
  },

  getPostById: async (id: string): Promise<Post | null> => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .limit(1)
      .single();
    if (error) {
      console.error('getPostById error', error);
      return null;
    }
    return data as Post;
  },

  getPostsByCategory: async (category: Category): Promise<Post[]> => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('category', category)
      .eq('is_published', true)
      .order('published_at', { ascending: false });
    if (error) {
      console.error('getPostsByCategory error', error);
      return [];
    }
    return (data || []) as Post[];
  },

  createPost: async (postData: any): Promise<Post | null> => {
    const slug = generateSlug(postData.title);
    
    const payload = { 
      title: postData.title,
      content: postData.content,
      excerpt: postData.excerpt,
      category: postData.category,
      featured_image: postData.featuredImage, 
      author: postData.author,
      slug, 
      tags: postData.tags || [],
      published_at: new Date().toISOString(),
      is_published: postData.isPublished ?? false,
      is_trending: postData.isTrending ?? false
    };

    const { data, error } = await supabase.from('posts').insert(payload).select().single();
    if (error) {
      console.error('createPost error', error);
      throw error; // Throw so UI can catch and display error
    }
    return data as Post;
  },

  updatePost: async (id: string, postData: any): Promise<Post | null> => {
    // Explicitly mapping keys to snake_case and removing frontend-only keys like tagsString
    const updatePayload: any = {
      title: postData.title,
      content: postData.content,
      excerpt: postData.excerpt,
      category: postData.category,
      featured_image: postData.featuredImage,
      author: postData.author,
      is_published: postData.isPublished,
      is_trending: postData.isTrending,
      tags: postData.tags || []
    };

    // Only update slug if title changed
    if (postData.title) {
      updatePayload.slug = generateSlug(postData.title);
    }

    const { data, error } = await supabase
      .from('posts')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('updatePost error', error);
      throw error;
    }
    return data as Post;
  },

  deletePost: async (id: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw error;
  },

  searchPosts: async (query: string): Promise<Post[]> => {
    const q = `%${query}%`;
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .or(`title.ilike.${q},content.ilike.${q},category.ilike.${q}`)
      .eq('is_published', true)
      .order('published_at', { ascending: false });
    if (error) {
      console.error('searchPosts error', error);
      return [];
    }
    return (data || []) as Post[];
  },

  getComments: async (postId: string): Promise<ArticleComment[]> => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    if (error) {
      console.error('getComments error', error);
      return [];
    }
    return (data || []) as ArticleComment[];
  },

  addComment: async (postId: string, commentData: any): Promise<ArticleComment | null> => {
    const payload = { 
      content: commentData.content,
      author: commentData.author,
      post_id: postId,
      created_at: new Date().toISOString(), 
      likes: 0, 
      dislikes: 0 
    };
    const { data, error } = await supabase.from('comments').insert(payload).select().single();
    if (error) {
      console.error('addComment error', error);
      return null;
    }
    return data as ArticleComment;
  }
};