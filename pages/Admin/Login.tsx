import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper, Lock, User, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
// FIXED: Path updated to reach services from pages/Admin/
import { supabase } from '../../services/supabase'; 

const Login: React.FC = () => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Authenticate with Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) throw authError;

      if (data.user) {
        // Supabase manages the session in cookies/localStorage automatically.
        // We set this flag just for your existing route guards.
        localStorage.setItem('nikwetu_auth', 'true');
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      // Friendly error handling for common Supabase issues
      const message = err.message === 'Invalid login credentials' 
        ? 'Invalid email or password. Please try again.' 
        : err.message;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -ml-48 -mt-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -mr-48 -mb-48"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden relative z-10"
      >
        <div className="bg-primary p-12 text-center text-white space-y-4">
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-md">
            <Newspaper size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Admin Portal</h1>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest">News Nikwetu CMS</p>
          </div>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 md:p-12 space-y-8">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border border-red-100"
            >
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-medium"
                  placeholder="admin@newskikwetu.com"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-primary transition-all shadow-xl shadow-slate-200 hover:shadow-primary/20 uppercase tracking-widest text-sm flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In to Dashboard'}
            </button>
          </div>

          <div className="text-center">
            <button 
              type="button" 
              onClick={() => navigate('/')}
              className="text-slate-400 text-xs font-bold hover:text-primary flex items-center justify-center gap-2 mx-auto transition-colors"
            >
              <ArrowLeft size={14} /> Return to Website
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;