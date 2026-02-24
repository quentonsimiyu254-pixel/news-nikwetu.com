
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import NewsCard from '../components/NewsCard';
import Sidebar from '../components/Sidebar';
import { cmsService } from '../services/cmsService';
import { Post } from '../types';
import { motion } from 'motion/react';
import { ArrowRight, TrendingUp, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const allPosts = await cmsService.getPublishedPosts();
      setPosts(allPosts);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading News...</p>
        </div>
      </Layout>
    );
  }

  const latest = posts.slice(0, 6);
  const trending = posts.filter(p => p.isTrending).slice(0, 4);
  const remaining = posts.slice(6);

  return (
    <Layout>
      <div className="space-y-16">
        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Latest News */}
          <div className="lg:col-span-8 space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-slate-900 p-2 rounded-lg">
                  <Zap className="text-white" size={20} />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight">Latest News</h2>
              </div>
              <div className="space-y-8">
                {latest.map(post => (
                  <NewsCard key={post.id} post={post} variant="horizontal" />
                ))}
              </div>
            </section>

            {/* In-Feed Ad Placeholder */}
            <div className="bg-gray-100 border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center">
              <span className="text-gray-400 font-black uppercase tracking-[0.3em] text-xs">Advertisement Space</span>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-28">
              <Sidebar />
            </div>
          </div>
        </div>

        {/* Trending Grid */}
        <section className="pt-8 border-t border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <TrendingUp className="text-white" size={20} />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Trending Stories</h2>
            </div>
            <Link to="/search" className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trending.map(post => (
              <NewsCard key={post.id} post={post} variant="vertical" />
            ))}
          </div>
        </section>

        {remaining.length > 0 && (
          <section className="pt-8 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {remaining.map(post => (
                <NewsCard key={post.id} post={post} variant="vertical" />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default Home;
