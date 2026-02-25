import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cmsService } from '../../services/cmsService';
import { supabase } from '../../services/supabase';
import { Post } from '../../types';
import { 
  LayoutDashboard, 
  FileText, 
  Plus, 
  LogOut, 
  ExternalLink, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  Globe,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';

const AdminDashboard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/admin');
        return;
      }

      try {
        const allPosts = await cmsService.getPosts();
        setPosts(allPosts);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetch();
  }, [navigate]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      await cmsService.deletePost(id);
      const allPosts = await cmsService.getPosts();
      setPosts(allPosts);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('nikwetu_auth');
    navigate('/admin');
  };

  // Helper to handle snake_case from DB vs camelCase in types
  const getPostStatus = (p: any) => ({
    isPublished: p.is_published ?? p.isPublished,
    isTrending: p.is_trending ?? p.isTrending,
    publishedAt: p.published_at ?? p.publishedAt,
    featuredImage: p.featured_image ?? p.featuredImage
  });

  const stats = {
    total: posts.length,
    published: posts.filter(p => getPostStatus(p).isPublished).length,
    drafts: posts.filter(p => !getPostStatus(p).isPublished).length,
    trending: posts.filter(p => getPostStatus(p).isTrending).length
  };

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="text-primary animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex-shrink-0 hidden lg:flex flex-col p-8 sticky top-0 h-screen">
        <div className="mb-12 flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <LayoutDashboard size={24} className="text-white" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tighter uppercase block leading-none">News</span>
            <span className="text-primary font-bold text-[10px] tracking-widest uppercase">Admin Panel</span>
          </div>
        </div>
        
        <nav className="flex-grow space-y-2">
          <Link to="/admin/dashboard" className="flex items-center gap-3 bg-primary text-white px-4 py-4 rounded-2xl font-bold shadow-lg shadow-primary/20">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/admin/editor" className="flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
            <Plus size={20} /> Create Story
          </Link>
          <Link to="/admin/domain" className="flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
            <Globe size={20} /> Domain Settings
          </Link>
          <Link to="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
            <ExternalLink size={20} /> View Website
          </Link>
        </nav>

        <button 
          onClick={handleLogout}
          title="Sign out of admin panel"
          className="mt-auto flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-slate-500 hover:bg-red-500/10 hover:text-red-500 transition-all"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-slate-500 font-medium">Manage your news content.</p>
              <span className="text-slate-300">•</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Live Database</span>
            </div>
          </div>
          <Link to="/admin/editor" className="bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all flex items-center gap-2 uppercase tracking-widest text-sm">
            <Plus size={20} /> New Story
          </Link>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Stories", value: stats.total, icon: <FileText />, color: "bg-blue-500" },
            { label: "Published", value: stats.published, icon: <CheckCircle />, color: "bg-green-500" },
            { label: "Drafts", value: stats.drafts, icon: <Clock />, color: "bg-amber-500" },
            { label: "Trending", value: stats.trending, icon: <TrendingUp />, color: "bg-primary" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-4"
            >
              <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-current/20`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                <p className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Content Table */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recent Content</h3>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search stories..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 pl-12 pr-4 py-3 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all" 
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-8 py-5">Story Details</th>
                  <th className="px-8 py-5">Category</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Published At</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPosts.map(post => {
                  const data = getPostStatus(post);

                  return (
                    <tr key={post.id} className="hover:bg-gray-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 shadow-sm bg-gray-100">
                            {data.featuredImage && (
                              <img src={data.featuredImage} alt="" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <p className="font-bold text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">{post.title}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">by {post.author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-black bg-slate-100 px-3 py-1.5 rounded-lg text-slate-600 uppercase tracking-wider">{post.category}</span>
                      </td>
                      <td className="px-8 py-6">
                        {data.isPublished ? (
                          <span className="inline-flex items-center gap-2 text-green-600 text-[10px] font-black uppercase tracking-widest bg-green-50 px-3 py-1.5 rounded-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-amber-600 text-[10px] font-black uppercase tracking-widest bg-amber-50 px-3 py-1.5 rounded-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Draft
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-slate-500">
                          {data.publishedAt ? new Date(data.publishedAt).toLocaleDateString() : 'Not published'}
                        </p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <Link 
                            to={`/article/${post.slug}`} 
                            title="View article"
                            className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                          >
                            <Eye size={18} />
                          </Link>
                          <Link 
                            to={`/admin/editor/${post.id}`} 
                            title="Edit article"
                            className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          >
                            <Edit size={18} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(post.id)} 
                            title="Delete article"
                            className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;