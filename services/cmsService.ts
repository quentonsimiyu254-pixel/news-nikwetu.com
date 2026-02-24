
import { Post, Category, ContactMessage, ArticleComment, DomainSettings } from '../types';
import { INITIAL_POSTS } from '../constants';

const STORAGE_KEY = 'news_nikwetu_posts';
const MESSAGES_KEY = 'news_nikwetu_messages';
const DOMAIN_KEY = 'news_nikwetu_domain';

export const cmsService = {
  getDomainSettings: (): DomainSettings => {
    const stored = localStorage.getItem(DOMAIN_KEY);
    if (!stored) {
      const defaultSettings: DomainSettings = {
        customDomain: 'newskikwetu.com',
        isConfigured: false,
        dnsProvider: 'Not set',
        sslStatus: 'pending',
        lastVerified: new Date().toISOString()
      };
      cmsService.saveDomainSettings(defaultSettings);
      return defaultSettings;
    }
    return JSON.parse(stored);
  },

  saveDomainSettings: (settings: DomainSettings) => {
    localStorage.setItem(DOMAIN_KEY, JSON.stringify(settings));
  },

  getPosts: (): Post[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      cmsService.savePosts(INITIAL_POSTS);
      return INITIAL_POSTS;
    }
    return JSON.parse(stored);
  },

  getPublishedPosts: (): Post[] => {
    return cmsService.getPosts().filter(p => p.isPublished).sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  },

  getPostBySlug: (slug: string): Post | undefined => {
    return cmsService.getPosts().find(p => p.slug === slug);
  },

  getPostById: (id: string): Post | undefined => {
    return cmsService.getPosts().find(p => p.id === id);
  },

  getPostsByCategory: (category: Category): Post[] => {
    return cmsService.getPublishedPosts().filter(p => p.category === category);
  },

  savePosts: (posts: Post[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  },

  createPost: (postData: Omit<Post, 'id' | 'slug' | 'publishedAt'>): Post => {
    const posts = cmsService.getPosts();
    const id = Math.random().toString(36).substr(2, 9);
    const slug = postData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const newPost: Post = {
      ...postData,
      id,
      slug,
      publishedAt: new Date().toISOString()
    };
    cmsService.savePosts([newPost, ...posts]);
    return newPost;
  },

  updatePost: (id: string, postData: Partial<Post>): Post => {
    const posts = cmsService.getPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Post not found');
    
    // Auto-update slug if title changes
    if (postData.title) {
        postData.slug = postData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }

    posts[index] = { ...posts[index], ...postData };
    cmsService.savePosts(posts);
    return posts[index];
  },

  deletePost: (id: string) => {
    const posts = cmsService.getPosts();
    const filtered = posts.filter(p => p.id !== id);
    cmsService.savePosts(filtered);
  },

  searchPosts: (query: string): Post[] => {
    const q = query.toLowerCase();
    return cmsService.getPublishedPosts().filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.content.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  },

  getComments: (postId: string): ArticleComment[] => {
    const posts = cmsService.getPosts();
    const post = posts.find(p => p.id === postId);
    return post?.comments || [];
  },

  addComment: (postId: string, commentData: Omit<ArticleComment, 'id' | 'postId' | 'createdAt' | 'likes' | 'dislikes'>): ArticleComment => {
    const posts = cmsService.getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) throw new Error('Post not found');

    const newComment: ArticleComment = {
      ...commentData,
      id: Math.random().toString(36).substr(2, 9),
      postId,
      createdAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0
    };

    if (!posts[postIndex].comments) {
      posts[postIndex].comments = [];
    }
    posts[postIndex].comments!.push(newComment);
    cmsService.savePosts(posts);
    return newComment;
  },

  voteComment: (postId: string, commentId: string, type: 'like' | 'dislike'): void => {
    const posts = cmsService.getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return;

    const commentIndex = posts[postIndex].comments?.findIndex(c => c.id === commentId);
    if (commentIndex === undefined || commentIndex === -1) return;

    if (type === 'like') {
      posts[postIndex].comments![commentIndex].likes += 1;
    } else {
      posts[postIndex].comments![commentIndex].dislikes += 1;
    }

    cmsService.savePosts(posts);
  },

  submitContact: async (message: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<void> => {
    const messages = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
    messages.push({
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    });
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  }
};
