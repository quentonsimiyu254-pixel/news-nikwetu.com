
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import NewsCard from '../components/NewsCard';
import Sidebar from '../components/Sidebar';
import { cmsService } from '../services/cmsService';
import { Post } from '../types';
import { motion } from 'motion/react';
import { Search as SearchIcon, ArrowLeft } from 'lucide-react';

const SearchResults: React.FC = () => {
  const location = useLocation();
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const query = new URLSearchParams(location.search).get('q') || '';

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      if (query) {
        const searchResults = await cmsService.searchPosts(query);
        setResults(searchResults);
      }
      setLoading(false);
    };
    fetchResults();
  }, [query]);

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-12"
          >
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <SearchIcon size={24} />
                <span className="text-sm font-black uppercase tracking-widest">Search Results</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                Showing results for <span className="text-primary italic">"{query}"</span>
              </h1>
              <p className="text-slate-500 font-medium">
                We found {results.length} stories matching your search criteria.
              </p>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {results.length > 0 ? (
                results.map(post => <NewsCard key={post.id} post={post} variant="vertical" />)
              ) : (
                !loading && (
                  <div className="col-span-full py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm space-y-6">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                      <SearchIcon size={32} className="text-slate-300" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-slate-900 text-xl font-bold">No results found</p>
                      <p className="text-slate-500 max-w-sm mx-auto">We couldn't find any stories matching your search. Try different keywords or browse our categories.</p>
                    </div>
                    <Link to="/" className="btn-primary inline-flex items-center gap-2">
                      <ArrowLeft size={18} /> Back to Homepage
                    </Link>
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

export default SearchResults;
