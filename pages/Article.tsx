
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import NewsCard from '../components/NewsCard';
import Comments from '../components/Comments';
import { cmsService } from '../services/cmsService';
import { Post } from '../types';
import { motion } from 'motion/react';
import { Calendar, User, Share2, Facebook, Twitter, Link as LinkIcon, ArrowLeft, MessageSquare, Mail } from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

const Article: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [related, setRelated] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (slug) {
        setLoading(true);
        const p = await cmsService.getPostBySlug(slug);
        if (p) {
          setPost(p);
          const allPosts = await cmsService.getPublishedPosts();
          const relatedPosts = allPosts
            .filter(rp => rp.category === p.category && rp.id !== p.id)
            .slice(0, 3);
          setRelated(relatedPosts);
        }
        setLoading(false);
      }
    };
    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = post?.title || '';
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'email':
        const subject = encodeURIComponent(text);
        const body = encodeURIComponent(`Check out this article: ${text}\n\n${url}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        break;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="text-center py-24 space-y-6">
          <h2 className="text-4xl font-black">Story Not Found</h2>
          <p className="text-slate-500">The article you are looking for might have been moved or deleted.</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={18} /> Back to Homepage
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <motion.article 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="text-slate-200">/</span>
              <Link to={`/category/${post.category}`} className="hover:text-primary transition-colors">{post.category}</Link>
            </nav>

            {/* Header */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-gray-100">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                      {post.author[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{post.author}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reporter</p>
                    </div>
                  </div>
                  <div className="hidden sm:block h-8 w-px bg-gray-100"></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Published</span>
                    <span className="text-sm font-medium text-slate-600">{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</span>
                  </div>
                  <div className="hidden sm:block h-8 w-px bg-gray-100"></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Comments</span>
                    <span className="text-sm font-medium text-slate-600">{cmsService.getComments(post.id).length}</span>
                  </div>
                  <div className="hidden sm:block h-8 w-px bg-gray-100"></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Read Time</span>
                    <span className="text-sm font-medium text-slate-600">{Math.ceil((post.content.split(/\s+/).length) / 200)} min</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => handleShare('facebook')} className="p-2 bg-slate-100 rounded-lg hover:bg-[#1877F2] hover:text-white transition-all" title="Share on Facebook"><Facebook size={18} /></button>
                  <button onClick={() => handleShare('twitter')} className="p-2 bg-slate-100 rounded-lg hover:bg-black hover:text-white transition-all" title="Share on Twitter"><Twitter size={18} /></button>
                  <button onClick={() => handleShare('email')} className="p-2 bg-slate-100 rounded-lg hover:bg-primary hover:text-white transition-all" title="Share via Email"><Mail size={18} /></button>
                  <button onClick={() => handleShare('copy')} className="p-2 bg-slate-100 rounded-lg hover:bg-primary hover:text-white transition-all" title="Copy Link"><LinkIcon size={18} /></button>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <img 
                src={post.featuredImage} 
                alt={post.title} 
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto lg:mx-0">
              <div className="markdown-body">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-8 border-t border-gray-100">
              {post.tags.map(tag => (
                <span key={tag} className="bg-gray-100 text-slate-600 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Comments Section */}
            <Comments postId={post.id} />

            {/* Related Stories */}
            {related.length > 0 && (
              <section className="pt-16 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="bg-primary p-2 rounded-lg">
                    <MessageSquare className="text-white" size={20} />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Related Stories</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {related.map(rp => (
                    <NewsCard key={rp.id} post={rp} variant="vertical" />
                  ))}
                </div>
              </section>
            )}
          </motion.article>
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

export default Article;
