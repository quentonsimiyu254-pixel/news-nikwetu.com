
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import NewsCard from '../components/NewsCard';
import { cmsService } from '../services/cmsService';
import { Post, Category as CategoryType } from '../types';
import { CATEGORIES } from '../constants';
import { motion } from 'motion/react';
import { ChevronRight, Filter } from 'lucide-react';

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      if (categoryName) {
        setLoading(true);
        // Find exact category matching the slug or name
        const match = CATEGORIES.find(c => c.toLowerCase() === categoryName.toLowerCase() || c === categoryName);
        if (match) {
          const categoryPosts = await cmsService.getPostsByCategory(match as CategoryType);
          setPosts(categoryPosts);
        }
        setLoading(false);
      }
    };
    fetchPosts();
    window.scrollTo(0, 0);
  }, [categoryName]);

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Header */}
            <div className="bg-slate-900 rounded-3xl p-10 md:p-16 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-3xl rounded-full -mr-32 -mt-32"></div>
              <div className="relative z-10 space-y-4">
                <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <Link to="/" className="hover:text-white transition-colors">Home</Link>
                  <ChevronRight size={10} />
                  <span className="text-primary">Category</span>
                </nav>
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                  {categoryName}
                </h1>
                <p className="text-slate-400 max-w-xl text-lg font-medium leading-relaxed">
                  Discover the latest stories, in-depth reporting, and expert analysis in the world of {categoryName}.
                </p>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
              <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                <Filter size={18} className="text-primary" />
                <span>Showing {posts.length} stories</span>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.length > 0 ? (
                posts.map(post => <NewsCard key={post.id} post={post} variant="vertical" />)
              ) : (
                !loading && (
                  <div className="col-span-full py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-slate-400 text-lg font-medium mb-6">No stories published in this category yet.</p>
                    <Link to="/" className="btn-primary">Back to Homepage</Link>
                  </div>
                )
              )}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-28">
            <Sidebar />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
