
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

export const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    title: 'Kenya’s New Education Reform: What Parents Need to Know',
    slug: 'kenya-education-reform-2024',
    content: 'The Ministry of Education has announced a major overhaul of the current curriculum, focusing on digital literacy and vocational skills from a younger age. Education experts suggest this shift will bridge the gap between academic theory and industry demands. However, teachers unions have raised concerns about the implementation timeline and resource allocation in rural schools...',
    excerpt: 'The Ministry of Education has announced a major overhaul of the current curriculum, focusing on digital literacy.',
    category: 'Education',
    featuredImage: 'https://picsum.photos/id/1/800/600',
    author: 'James Mwangi',
    publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    isPublished: true,
    isTrending: true,
    tags: ['Education', 'Reform', 'Kenya']
  },
  {
    id: '2',
    title: 'Regional Trade Boost as Border Formalities Ease',
    slug: 'regional-trade-boost-formalities',
    content: 'Economic analysts are optimistic as new trade protocols come into effect across the East African region. The removal of non-tariff barriers is expected to increase the volume of cross-border trade by at least 15% in the next quarter. Small-scale traders have already reported smoother transitions at the Namanga border post...',
    excerpt: 'Economic analysts are optimistic as new trade protocols come into effect across the East African region.',
    category: 'Business',
    featuredImage: 'https://picsum.photos/id/2/800/600',
    author: 'Sarah Omolo',
    publishedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    isPublished: true,
    isTrending: false,
    tags: ['Business', 'Trade', 'EAC']
  },
  {
    id: '3',
    title: 'Local Sports: Grassroots Tournament Discovers New Talents',
    slug: 'local-sports-tournament-talents',
    content: 'A local football tournament organized in Kisumu has unearthed several promising young athletes. Scouts from major clubs were present as the finals saw a thrilling 3-2 victory for the "Lakeside Warriors". The tournament coordinator emphasized the importance of investing in youth facilities to nurture these raw talents further...',
    excerpt: 'A local football tournament organized in Kisumu has unearthed several promising young athletes.',
    category: 'Sports',
    featuredImage: 'https://picsum.photos/id/3/800/600',
    author: 'Kevin Odhiambo',
    publishedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    isPublished: true,
    isTrending: true,
    tags: ['Sports', 'Kisumu', 'Football']
  }
];
