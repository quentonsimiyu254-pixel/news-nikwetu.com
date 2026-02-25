import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Post } from '../types';
import { formatDistanceToNow, isValid } from 'date-fns';

interface NewsCardProps {
  post: Post;
  variant?: 'horizontal' | 'vertical' | 'compact' | 'featured';
}

const NewsCard: React.FC<NewsCardProps> = ({ post, variant = 'vertical' }) => {
  // Helper to prevent "Invalid time value" crash
  const safeFormatDistance = (dateValue: any) => {
    try {
      // Fallback for different naming conventions (camelCase vs snake_case)
      const rawDate = dateValue || (post as any).created_at || (post as any).published_at;
      const date = new Date(rawDate);
      
      if (!rawDate || !isValid(date)) {
        return 'Recently';
      }
      return `${formatDistanceToNow(date)} ago`;
    } catch (error) {
      return 'Recently';
    }
  };

  if (variant === 'featured') {
    return (
      <Link 
        to={`/article/${post.slug}`}
        className="group relative block w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl"
      >
        <img 
          src={post.featuredImage} 
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-3xl">
          <div className="flex gap-3 mb-4">
            <span className="bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">
              {post.category}
            </span>
            {post.isTrending && (
              <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">
                Trending
              </span>
            )}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          <div className="flex items-center gap-6 text-slate-300 text-sm">
            <div className="flex items-center gap-2">
              <User size={14} className="text-primary" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-primary" />
              <span>{safeFormatDistance(post.publishedAt)}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Link 
        to={`/article/${post.slug}`}
        className="group flex flex-col md:flex-row gap-6 p-4 bg-white rounded-2xl border border-gray-100 hover:border-primary/20 hover:shadow-lg transition-all"
      >
        <div className="w-full md:w-1/3 aspect-[4/3] rounded-xl overflow-hidden shrink-0">
          <img 
            src={post.featuredImage} 
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col justify-center space-y-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            {post.category}
          </span>
          <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-4 text-slate-400 text-xs pt-2">
            <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
            <span className="flex items-center gap-1"><Calendar size={12} /> {safeFormatDistance(post.publishedAt)}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link 
        to={`/article/${post.slug}`}
        className="group flex gap-4 items-center py-4 border-b border-gray-100 last:border-0"
      >
        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
          <img 
            src={post.featuredImage} 
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="space-y-1">
          <span className="text-[9px] font-black uppercase tracking-widest text-primary">
            {post.category}
          </span>
          <h4 className="text-sm font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h4>
        </div>
      </Link>
    );
  }

  return (
    <div className="group flex flex-col h-full bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all">
      <Link to={`/article/${post.slug}`} className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={post.featuredImage} 
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-primary text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
            {post.category}
          </span>
        </div>
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-4">
          <span className="flex items-center gap-1"><User size={12} className="text-primary" /> {post.author}</span>
          <span className="flex items-center gap-1"><Calendar size={12} className="text-primary" /> {safeFormatDistance(post.publishedAt)}</span>
        </div>
        <Link to={`/article/${post.slug}`}>
          <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-slate-500 text-sm line-clamp-3 mb-6 leading-relaxed">
          {post.excerpt}
        </p>
        <div className="mt-auto">
          <Link 
            to={`/article/${post.slug}`}
            className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all"
          >
            Read Story <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;