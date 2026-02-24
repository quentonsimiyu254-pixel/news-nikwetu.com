
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Newspaper, LogIn, ChevronRight, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white py-2 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="hidden md:flex gap-4">
            <span>{new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="text-slate-400">|</span>
            <span>Nairobi, Kenya</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/admin" className="flex items-center gap-1 hover:text-primary transition-colors">
              <LogIn size={12} />
              Admin Login
            </Link>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/2048px-BMW.svg.png" 
                alt="BMW Logo" 
                className="w-12 h-12 object-contain group-hover:scale-110 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col leading-tight">
                <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">News</span>
                <span className="text-primary font-bold text-sm tracking-widest uppercase -mt-1">Nikwetu</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <Link 
                  key={cat} 
                  to={`/category/${cat}`}
                  className="text-sm font-bold uppercase tracking-wider text-slate-600 hover:text-primary transition-colors"
                >
                  {cat}
                </Link>
              ))}
              <div className="relative group">
                <button className="text-sm font-bold uppercase tracking-wider text-slate-600 hover:text-primary flex items-center gap-1">
                  More <ChevronRight size={14} className="rotate-90" />
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  {CATEGORIES.slice(5).map((cat) => (
                    <Link 
                      key={cat} 
                      to={`/category/${cat}`}
                      className="block px-4 py-2 text-sm text-slate-600 hover:bg-gray-50 hover:text-primary font-medium"
                    >
                      {cat}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link to="/about" className="block px-4 py-2 text-sm text-slate-600 hover:bg-gray-50 hover:text-primary font-medium">About Us</Link>
                  <Link to="/contact" className="block px-4 py-2 text-sm text-slate-600 hover:bg-gray-50 hover:text-primary font-medium">Contact</Link>
                </div>
              </div>
            </nav>

            {/* Search and Mobile Menu Button */}
            <div className="flex items-center gap-4">
              <form onSubmit={handleSearch} className="hidden md:flex relative">
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-100 border-none rounded-full py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-primary w-48 lg:w-64 transition-all"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary">
                  <Search size={18} />
                </button>
              </form>
              <button 
                className="lg:hidden text-slate-900 p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-xs bg-white z-50 lg:hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 flex justify-between items-center border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/2048px-BMW.svg.png" 
                    alt="BMW Logo" 
                    className="w-8 h-8 object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-lg font-black uppercase tracking-tighter">Nikwetu</span>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 space-y-8">
                {/* Prominent Search Bar */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Search News</label>
                  <form onSubmit={handleSearch} className="relative">
                    <input
                      type="text"
                      placeholder="Search for stories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-100 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl py-4 pl-5 pr-12 text-sm outline-none transition-all font-medium"
                    />
                    <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-primary">
                      <Search size={20} />
                    </button>
                  </form>
                </div>

                {/* Categories */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Categories</label>
                  <nav className="grid grid-cols-1 gap-1">
                    {CATEGORIES.map((cat, i) => (
                      <motion.div
                        key={cat}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link
                          to={`/category/${cat}`}
                          className="flex items-center justify-between px-4 py-3 text-base font-bold uppercase tracking-wider text-slate-700 hover:bg-primary/5 hover:text-primary rounded-xl transition-all group"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {cat}
                          <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                </div>

                {/* Secondary Links */}
                <div className="pt-8 border-t border-gray-100 space-y-4">
                  <Link 
                    to="/about" 
                    className="block px-4 py-2 text-base font-medium text-slate-600 hover:text-primary transition-colors" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About Us
                  </Link>
                  <Link 
                    to="/contact" 
                    className="block px-4 py-2 text-base font-medium text-slate-600 hover:text-primary transition-colors" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  <Link 
                    to="/admin" 
                    className="flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm uppercase tracking-widest justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn size={16} /> Admin Portal
                  </Link>
                </div>
              </div>

              {/* Socials in Menu */}
              <div className="p-6 border-t border-gray-100 flex justify-center gap-6">
                <a href="https://facebook.com" className="text-slate-400 hover:text-primary transition-colors"><Facebook size={20} /></a>
                <a href="https://twitter.com" className="text-slate-400 hover:text-primary transition-colors"><Twitter size={20} /></a>
                <a href="https://instagram.com" className="text-slate-400 hover:text-primary transition-colors"><Instagram size={20} /></a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="space-y-6">
              <Link to="/" className="flex items-center gap-3">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/2048px-BMW.svg.png" 
                  alt="BMW Logo" 
                  className="w-10 h-10 object-contain"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col leading-tight">
                  <span className="text-xl font-black tracking-tighter uppercase">News</span>
                  <span className="text-primary font-bold text-xs tracking-widest uppercase -mt-1">Nikwetu</span>
                </div>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed">
                News Nikwetu is Kenya's leading digital news platform, delivering breaking news, in-depth analysis, and local stories that matter to you.
              </p>
              <div className="flex gap-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-primary transition-colors" title="Facebook"><Facebook size={18} /></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-primary transition-colors" title="Twitter"><Twitter size={18} /></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-primary transition-colors" title="Instagram"><Instagram size={18} /></a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-primary transition-colors" title="YouTube"><Youtube size={18} /></a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 border-l-4 border-primary pl-3">Categories</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                {CATEGORIES.slice(0, 6).map(cat => (
                  <li key={cat}>
                    <Link to={`/category/${cat}`} className="hover:text-white transition-colors flex items-center gap-2">
                      <ChevronRight size={12} className="text-primary" /> {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 border-l-4 border-primary pl-3">Quick Links</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/admin" className="hover:text-white transition-colors">Admin Portal</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 border-l-4 border-primary pl-3">Newsletter</h4>
              <p className="text-slate-400 text-sm mb-4">Subscribe to get the latest updates delivered to your inbox.</p>
              <form className="flex flex-col gap-2">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="bg-slate-800 border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary"
                />
                <button className="bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors text-sm">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
            <p>© {new Date().getFullYear()} News Nikwetu. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-white">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link to="/privacy" className="hover:text-white">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
