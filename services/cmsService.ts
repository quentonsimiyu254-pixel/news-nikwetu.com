
import { Post, Category, ContactMessage, ArticleComment, DomainSettings } from '../types';
import { supabase } from './supabase';

export const cmsService = {
  getDomainSettings: async (): Promise<DomainSettings> => {
    const { data, error } = await supabase.from('domain_settings').select('*').limit(1).single();
    if (error && error.code !== 'PGRST116') {
      console.warn('Supabase getDomainSettings error', error);
    }

    if (data) return data as DomainSettings;

    const defaultSettings: DomainSettings = {
      customDomain: 'newskikwetu.com',
      isConfigured: false,
      dnsProvider: 'Not set',
      sslStatus: 'pending',
      lastVerified: new Date().toISOString()
    };

    await supabase.from('domain_settings').insert(defaultSettings);
    return defaultSettings;
  },

  saveDomainSettings: async (settings: DomainSettings) => {
    await supabase.from('domain_settings').upsert(settings);
  },

  getPosts: async (): Promise<Post[]> => {
    const { data, error } = await supabase.from<Post>('posts').select('*').order('publishedAt', { ascending: false });
    if (error) {
      console.error('getPosts error', error);
      return [];
    }
    return (data || []) as Post[];
  },

  getPublishedPosts: async (): Promise<Post[]> => {
    const { data, error } = await supabase.from<Post>('posts').select('*').eq('isPublished', true).order('publishedAt', { ascending: false });
    if (error) {
      console.error('getPublishedPosts error', error);
      return [];
    }
    return (data || []) as Post[];
  },

  getPostBySlug: async (slug: string): Promise<Post | null> => {
    const { data, error } = await supabase.from<Post>('posts').select('*').eq('slug', slug).limit(1).single();
    if (error) {
      console.error('getPostBySlug error', error);
      return null;
    }
    return data as Post;
  },

  getPostById: async (id: string): Promise<Post | null> => {
    const { data, error } = await supabase.from<Post>('posts').select('*').eq('id', id).limit(1).single();
    if (error) {
      console.error('getPostById error', error);
      return null;
    }
    return data as Post;
  },

  getPostsByCategory: async (category: Category): Promise<Post[]> => {
    const { data, error } = await supabase.from<Post>('posts').select('*').eq('category', category).eq('isPublished', true).order('publishedAt', { ascending: false });
    if (error) {
      console.error('getPostsByCategory error', error);
      return [];
    }
    return (data || []) as Post[];
  },

  createPost: async (postData: Omit<Post, 'id' | 'slug' | 'publishedAt'>): Promise<Post | null> => {
    const slug = postData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const payload = { ...postData, slug, publishedAt: new Date().toISOString() };
    const { data, error } = await supabase.from<Post>('posts').insert(payload).select().single();
    if (error) {
      console.error('createPost error', error);
      return null;
    }
    return data as Post;
  },

  updatePost: async (id: string, postData: Partial<Post>): Promise<Post | null> => {
    if (postData.title) {
      (postData as any).slug = postData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }
    const { data, error } = await supabase.from<Post>('posts').update(postData).eq('id', id).select().single();
    if (error) {
      console.error('updatePost error', error);
      return null;
    }
    return data as Post;
  },

  deletePost: async (id: string) => {
    await supabase.from('posts').delete().eq('id', id);
  },

  searchPosts: async (query: string): Promise<Post[]> => {
    const q = `%${query}%`;
    const { data, error } = await supabase.from<Post>('posts').select('*').or(`title.ilike.${q},content.ilike.${q},category.ilike.${q}`).eq('isPublished', true).order('publishedAt', { ascending: false });
    if (error) {
      console.error('searchPosts error', error);
      return [];
    }
    return (data || []) as Post[];
  },

  getComments: async (postId: string): Promise<ArticleComment[]> => {
    const { data, error } = await supabase.from<ArticleComment>('comments').select('*').eq('postId', postId).order('createdAt', { ascending: true });
    if (error) {
      console.error('getComments error', error);
      return [];
    }
    return (data || []) as ArticleComment[];
  },

  addComment: async (
    postId: string,
    commentData: Omit<ArticleComment, 'id' | 'postId' | 'createdAt' | 'likes' | 'dislikes'>
  ): Promise<ArticleComment | null> => {
    const payload = { ...commentData, postId, createdAt: new Date().toISOString(), likes: 0, dislikes: 0 };
    const { data, error } = await supabase.from<ArticleComment>('comments').insert(payload).select().single();
    if (error) {
      console.error('addComment error', error);
      return null;
    }
    return data as ArticleComment;
  },

  voteComment: async (postId: string, commentId: string, type: 'like' | 'dislike'): Promise<void> => {
    const field = type === 'like' ? 'likes' : 'dislikes';
    // Fetch, increment and update to avoid race conditions consider using DB function
    const { data: existing, error: fetchErr } = await supabase.from<ArticleComment>('comments').select('*').eq('id', commentId).limit(1).single();
    if (fetchErr || !existing) {
      console.error('voteComment fetch error', fetchErr);
      return;
    }
    const updated = { [field]: (existing as any)[field] + 1 };
    const { error: updateErr } = await supabase.from('comments').update(updated).eq('id', commentId);
    if (updateErr) console.error('voteComment update error', updateErr);
  },

  submitContact: async (message: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<void> => {
    const payload = { ...message, createdAt: new Date().toISOString() } as any;
    const { error } = await supabase.from('messages').insert(payload);
    if (error) console.error('submitContact error', error);
  }
};
