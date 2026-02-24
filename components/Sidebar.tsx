
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { Post } from '../types';
import { cmsService } from '../services/cmsService';
import { CATEGORIES } from '../constants';

const Sidebar: React.FC = () => {
  const [trending, setTrending] = useState<Post[]>([]);

  useEffect(() => {
    const fetchTrending = async () => {
      const posts = await cmsService.getPublishedPosts();
      setTrending(posts.filter(p => p.isTrending).slice(0, 5));
    };
    fetchTrending();
  }, []);

  return (
    <aside className="space-y-10">
      {/* Trending Section */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-primary" size={20} />
          <h3 className="text-xl font-bold uppercase tracking-tight">Trending Now</h3>
        </div>
        <div className="space-y-6">
          {trending.map((post, index) => (
            <Link 
              key={post.id} 
              to={`/article/${post.slug}`}
              className="group flex gap-4 items-start"
            >
              <span className="text-3xl font-black text-gray-200 group-hover:text-primary transition-colors leading-none">
                0{index + 1}
              </span>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  {post.category}
                </span>
                <h4 className="text-sm font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-slate-900 text-white p-6 rounded-2xl">
        <h3 className="text-lg font-bold mb-6 border-l-4 border-primary pl-3">Browse Categories</h3>
        <div className="grid grid-cols-1 gap-2">
          {CATEGORIES.map(cat => (
            <Link 
              key={cat} 
              to={`/category/${cat}`}
              className="flex justify-between items-center py-2 text-slate-400 hover:text-white transition-colors group"
            >
              <span className="text-sm font-medium">{cat}</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter Widget */}
      <section className="bg-primary/5 border border-primary/10 p-6 rounded-2xl text-center">
        <h3 className="text-lg font-bold mb-2">Weekly Roundup</h3>
        <p className="text-slate-600 text-sm mb-4">Get the most important stories of the week delivered to your inbox.</p>
        <form className="space-y-2">
          <input 
            type="email" 
            placeholder="Email address" 
            className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
          />
          <button className="w-full bg-slate-900 text-white font-bold py-2 rounded-lg hover:bg-slate-800 transition-colors text-sm">
            Join Newsletter
          </button>
        </form>
      </section>
    </aside>
  );
};

export default Sidebar;
