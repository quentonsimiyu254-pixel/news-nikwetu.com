import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { cmsService } from '../../services/cmsService';
import { supabase } from '../../services/supabase';
import { CATEGORIES } from '../../constants';
import { Post, Category } from '../../types';
import { 
  ArrowLeft, 
  Save, 
  Image as ImageIcon, 
  Settings, 
  Tag, 
  Type, 
  ChevronRight,
  Sparkles,
  Upload,
  X as CloseIcon,
  AlertCircle,
  Loader2,
  Globe
} from 'lucide-react';

const PostEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(id ? true : false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');
  const [dragActive, setDragActive] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'Local News' as Category,
    featuredImage: '',
    author: 'Admin',
    isPublished: true,
    isTrending: false,
    tagsString: ''
  });

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/admin');
        return;
      }

      if (id) {
        try {
          const post = await cmsService.getPostById(id);
          if (post) {
            setFormData({
              title: post.title,
              content: post.content,
              excerpt: post.excerpt || '',
              category: post.category,
              featuredImage: (post as any).featured_image ?? post.featuredImage ?? '',
              author: post.author,
              isPublished: (post as any).is_published ?? post.isPublished,
              isTrending: (post as any).is_trending ?? post.isTrending ?? false,
              tagsString: post.tags?.join(', ') || ''
            });
          }
        } catch (err) {
          console.error("Failed to fetch post:", err);
        } finally {
          setFetching(false);
        }
      }
    };

    checkAuthAndFetch();
  }, [id, navigate]);

  const handleFile = (file: File) => {
    setImageError(null);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (!validTypes.includes(file.type)) {
      setImageError('Please upload JPEG, PNG, or WebP.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData(prev => ({ ...prev, featuredImage: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert("Title and Content are required.");
      return;
    }

    setLoading(true);
    const tags = formData.tagsString.split(',').map(t => t.trim()).filter(t => t !== '');
    const postData = { ...formData, tags };

    try {
      if (id) {
        await cmsService.updatePost(id, postData);
      } else {
        await cmsService.createPost(postData);
      }
      navigate('/admin/dashboard');
    } catch (err: any) {
      alert(err.message || 'Error saving story.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="text-primary animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-slate-900 text-white px-6 py-5 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to="/admin/dashboard" title="Back to Dashboard" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight leading-none">
                {id ? 'Edit Story' : 'New Story'}
              </h1>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                <Link to="/admin/dashboard" className="hover:text-primary">Dashboard</Link>
                <ChevronRight size={10} />
                <span className="text-primary">Editor</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-400 hover:text-white transition-colors"
            >
              Discard
            </button>
            <button 
              type="submit"
              form="editor-form"
              disabled={loading}
              className="bg-primary text-white px-8 py-2.5 rounded-xl font-black text-sm hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 disabled:opacity-50 flex items-center gap-2 uppercase tracking-widest"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {id ? 'Update' : 'Publish'}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <form id="editor-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-4">
              <label htmlFor="post-title" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Type size={14} className="text-primary" /> Headline
              </label>
              <textarea 
                id="post-title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter a compelling headline..."
                className="w-full text-4xl font-black text-slate-900 placeholder:text-gray-200 border-none outline-none resize-none h-32 leading-tight tracking-tight"
                required
              />
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex border-b border-gray-50">
                {(['content', 'settings'] as const).map(tab => (
                  <button 
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-5 text-sm font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {tab === 'content' ? 'Story Content' : 'SEO & Settings'}
                  </button>
                ))}
              </div>

              <div className="p-10">
                {activeTab === 'content' ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-2">
                        {['B', 'I', 'H2', 'Quote'].map(tool => (
                          <button key={tool} type="button" className="w-10 h-10 bg-gray-50 rounded-xl text-xs font-black hover:bg-primary hover:text-white transition-all">{tool}</button>
                        ))}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Sparkles size={14} className="text-primary" /> Rich Text Editor
                      </div>
                    </div>
                    <label htmlFor="post-content" className="sr-only">Story Content</label>
                    <textarea 
                      id="post-content"
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      placeholder="Start writing your story..."
                      className="w-full min-h-[500px] text-lg text-slate-700 leading-relaxed border-none outline-none resize-none"
                      required
                    />
                  </div>
                ) : (
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <label htmlFor="post-excerpt" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Excerpt / Summary</label>
                      <textarea 
                        id="post-excerpt"
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        placeholder="Brief summary for previews..."
                        className="w-full h-32 p-6 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-slate-600 font-medium"
                      />
                    </div>
                    <div className="space-y-4">
                      <label htmlFor="post-tags" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tags (Comma separated)</label>
                      <div className="relative">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          id="post-tags"
                          type="text" 
                          name="tagsString"
                          value={formData.tagsString}
                          onChange={handleChange}
                          placeholder="politics, breaking, etc."
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium"
                        />
                      </div>
                    </div>
                    <div className="p-6 bg-slate-900 rounded-3xl space-y-3">
                        <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
                            <Globe size={12} /> URL Slug Preview
                        </div>
                        <code className="text-slate-400 text-xs break-all">
                            newskikwetu.com/news/{formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')}
                        </code>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Settings size={14} className="text-primary" /> Story Metadata
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="post-category" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Category</label>
                  <select 
                    id="post-category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-gray-50 px-4 py-4 rounded-2xl border border-gray-100 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="post-author" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Author Name</label>
                  <input 
                    id="post-author"
                    type="text" 
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full bg-gray-50 px-4 py-4 rounded-2xl border border-gray-100 font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 outline-none"
                    required
                  />
                </div>

                <div className="space-y-3 pt-4">
                  {/* Fixed Trending/Published labels for Axe */}
                  <label htmlFor="isPublished" className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/10">
                    <input 
                      id="isPublished"
                      type="checkbox" 
                      name="isPublished"
                      title="Published status"
                      checked={formData.isPublished}
                      onChange={handleChange}
                      className="w-5 h-5 accent-primary rounded-lg"
                    />
                    <div>
                      <p className="text-sm font-black uppercase tracking-tight text-slate-900">Published</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visible to public</p>
                    </div>
                  </label>

                  <label htmlFor="isTrending" className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/10">
                    <input 
                      id="isTrending"
                      type="checkbox" 
                      name="isTrending"
                      title="Trending status"
                      checked={formData.isTrending}
                      onChange={handleChange}
                      className="w-5 h-5 accent-primary rounded-lg"
                    />
                    <div>
                      <p className="text-sm font-black uppercase tracking-tight text-slate-900">Trending</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Feature on homepage</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                <div className="flex items-center gap-2"><ImageIcon size={14} className="text-primary" /> Banner Image</div>
                {formData.featuredImage && (
                  <button type="button" onClick={() => setFormData(p => ({ ...p, featuredImage: '' }))} className="text-red-500 hover:text-red-700 flex items-center gap-1 font-black">
                    <CloseIcon size={12} /> Clear
                  </button>
                )}
              </div>
              
              <div 
                className={`aspect-video rounded-3xl border-2 border-dashed overflow-hidden flex items-center justify-center cursor-pointer transition-all ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => { e.preventDefault(); setDragActive(false); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }}
                onClick={() => fileInputRef.current?.click()}
                aria-label="Upload featured image"
                title="Featured Image Upload"
              >
                {formData.featuredImage ? (
                  <img src={formData.featuredImage} alt="Post Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <Upload size={24} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Click or Drag Image</p>
                  </div>
                )}
              </div>
              {imageError && <div className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle size={12}/> {imageError}</div>}
              <input 
                ref={fileInputRef} 
                type="file" 
                id="featured-image-upload"
                accept="image/jpeg,image/png,image/webp" 
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} 
                className="hidden" 
                title="File Upload"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostEditor;