
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { cmsService } from '../../services/cmsService';
import { CATEGORIES } from '../../constants';
import { Post, Category } from '../../types';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Image as ImageIcon, 
  Settings, 
  Tag, 
  Type, 
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Upload,
  X as CloseIcon,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

const PostEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'Local News' as Category,
    featuredImage: 'https://picsum.photos/seed/news/1200/800',
    author: 'Admin',
    isPublished: true,
    isTrending: false,
    tagsString: ''
  });

  useEffect(() => {
    const auth = localStorage.getItem('nikwetu_auth');
    if (!auth) {
      navigate('/admin');
      return;
    }

    const fetchPost = async () => {
      if (id) {
        const post = await cmsService.getPostById(id);
        if (post) {
          setFormData({
            title: post.title,
            content: post.content,
            excerpt: post.excerpt,
            category: post.category,
            featuredImage: post.featuredImage,
            author: post.author,
            isPublished: post.isPublished,
            isTrending: post.isTrending || false,
            tagsString: post.tags.join(', ')
          });
        }
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleFile = (file: File) => {
    setImageError(null);

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setImageError('Please upload a valid image (JPEG, PNG, WebP, or GIF).');
      return;
    }

    // Check size (2MB limit for LocalStorage stability)
    if (file.size > 2 * 1024 * 1024) {
      setImageError('Image is too large. Please upload an image under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFormData(prev => ({ ...prev, featuredImage: result }));
    };
    reader.onerror = () => {
      setImageError('Failed to read the image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const postData = {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      category: formData.category,
      featuredImage: formData.featuredImage,
      author: formData.author,
      isPublished: formData.isPublished,
      isTrending: formData.isTrending,
      tags: formData.tagsString.split(',').map(t => t.trim()).filter(t => t !== '')
    };

    try {
      if (id) {
        await cmsService.updatePost(id, postData);
      } else {
        await cmsService.createPost(postData);
      }
      navigate('/admin/dashboard');
    } catch (err) {
      alert('Failed to save story. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-slate-900 text-white px-6 py-5 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to="/admin/dashboard" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all">
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
              onClick={() => navigate('/admin/dashboard')}
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-400 hover:text-white transition-colors"
            >
              Discard
            </button>
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="bg-primary text-white px-8 py-2.5 rounded-xl font-black text-sm hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 disabled:opacity-50 flex items-center gap-2 uppercase tracking-widest"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : <Save size={18} />}
              {id ? 'Update Story' : 'Publish Story'}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Editor */}
          <div className="lg:col-span-8 space-y-8">
            {/* Title Input */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Type size={14} className="text-primary" /> Headline
              </div>
              <textarea 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter a compelling headline..."
                className="w-full text-4xl font-black text-slate-900 placeholder:text-gray-200 border-none outline-none resize-none h-32 leading-tight tracking-tight"
                required
              />
            </div>

            {/* Content Tabs */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex border-b border-gray-50">
                <button 
                  onClick={() => setActiveTab('content')}
                  className={`px-8 py-5 text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'content' ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Story Content
                </button>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`px-8 py-5 text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  SEO & Settings
                </button>
              </div>

              <div className="p-10">
                {activeTab === 'content' ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-2">
                        {['B', 'I', 'H2', 'H3', 'Quote', 'Link'].map(tool => (
                          <button key={tool} type="button" className="w-10 h-10 bg-gray-50 rounded-xl text-xs font-black hover:bg-primary hover:text-white transition-all">{tool}</button>
                        ))}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Sparkles size={14} className="text-primary" /> Markdown Supported
                      </div>
                    </div>
                    <textarea 
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      placeholder="Start writing your story..."
                      className="w-full min-h-[600px] text-lg text-slate-700 leading-relaxed border-none outline-none resize-none"
                      required
                    />
                  </div>
                ) : (
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Excerpt / Summary</label>
                      <textarea 
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        placeholder="A short summary for social media and card previews..."
                        className="w-full h-32 p-6 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-slate-600 font-medium"
                        required
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tags (Comma separated)</label>
                      <div className="relative">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="text" 
                          name="tagsString"
                          value={formData.tagsString}
                          onChange={handleChange}
                          placeholder="politics, breaking, nairobi"
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Settings size={14} className="text-primary" /> Story Settings
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-gray-50 px-4 py-4 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-bold text-slate-700"
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Author</label>
                  <input 
                    type="text" 
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full bg-gray-50 px-4 py-4 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-bold text-slate-700"
                    required
                  />
                </div>

                <div className="space-y-4 pt-4">
                  <label className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl cursor-pointer group hover:bg-primary/5 transition-colors">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        name="isPublished"
                        checked={formData.isPublished}
                        onChange={handleChange}
                        className="w-6 h-6 accent-primary rounded-lg"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-tight text-slate-900">Published</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visible to public</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl cursor-pointer group hover:bg-primary/5 transition-colors">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        name="isTrending"
                        checked={formData.isTrending}
                        onChange={handleChange}
                        className="w-6 h-6 accent-primary rounded-lg"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-tight text-slate-900">Trending</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Show in trending sections</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <ImageIcon size={14} className="text-primary" /> Featured Image
                </div>
                {formData.featuredImage && (
                  <button 
                    onClick={() => {
                      setFormData(prev => ({ ...prev, featuredImage: '' }));
                      setImageError(null);
                    }}
                    className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:text-red-700 transition-colors flex items-center gap-1"
                  >
                    <CloseIcon size={12} /> Remove
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                {imageError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold"
                  >
                    <AlertCircle size={16} />
                    {imageError}
                  </motion.div>
                )}
                
                {!formData.featuredImage ? (
                  <div 
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`aspect-video rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 cursor-pointer p-6 text-center ${
                      dragActive 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 bg-gray-50 hover:border-primary/50 hover:bg-gray-100/50'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400">
                      <Upload size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">Click or drag image to upload</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">PNG, JPG up to 10MB</p>
                    </div>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="relative group aspect-video rounded-3xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50">
                    <img src={formData.featuredImage} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white text-slate-900 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xl"
                      >
                        <Upload size={14} /> Change Image
                      </button>
                    </div>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
