
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cmsService } from '../../services/cmsService';
import { DomainSettings as IDomainSettings } from '../../types';
import { 
  ArrowLeft, 
  Globe, 
  ShieldCheck, 
  Server, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Save
} from 'lucide-react';
import { motion } from 'motion/react';

const DomainSettings: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [settings, setSettings] = useState<IDomainSettings | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem('nikwetu_auth');
    if (!auth) {
      navigate('/admin');
      return;
    }
    setSettings(cmsService.getDomainSettings());
  }, [navigate]);

  const handleSave = () => {
    if (settings) {
      setLoading(true);
      cmsService.saveDomainSettings(settings);
      setTimeout(() => {
        setLoading(false);
        alert('Domain settings updated successfully!');
      }, 500);
    }
  };

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      if (settings) {
        const updated = {
          ...settings,
          isConfigured: true,
          sslStatus: 'active' as const,
          lastVerified: new Date().toISOString()
        };
        setSettings(updated);
        cmsService.saveDomainSettings(updated);
      }
      setVerifying(false);
    }, 2000);
  };

  if (!settings) return null;

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
              <h1 className="text-xl font-black uppercase tracking-tight leading-none">Domain Settings</h1>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                <Link to="/admin/dashboard" className="hover:text-primary">Dashboard</Link>
                <ChevronRight size={10} />
                <span className="text-primary">Domain</span>
              </div>
            </div>
          </div>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="bg-primary text-white px-8 py-2.5 rounded-xl font-black text-sm hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 disabled:opacity-50 flex items-center gap-2 uppercase tracking-widest"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : <Save size={18} />}
            Save Changes
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* Domain Status Card */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-start gap-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${settings.isConfigured ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                <Globe size={32} />
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{settings.customDomain}</h2>
                <div className="flex items-center gap-2">
                  {settings.isConfigured ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-green-600 uppercase tracking-widest">
                      <CheckCircle2 size={14} /> Fully Configured
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-600 uppercase tracking-widest">
                      <AlertCircle size={14} /> Setup Required
                    </span>
                  )}
                  <span className="text-slate-300">•</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last verified: {new Date(settings.lastVerified).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={handleVerify}
              disabled={verifying}
              className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {verifying ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              Verify DNS
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Configuration Form */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Server size={14} className="text-primary" /> Domain Config
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Custom Domain</label>
                <input 
                  type="text" 
                  value={settings.customDomain}
                  onChange={(e) => setSettings({ ...settings, customDomain: e.target.value })}
                  className="w-full bg-gray-50 px-4 py-4 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-bold text-slate-700"
                  placeholder="e.g. example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">DNS Provider</label>
                <input 
                  type="text" 
                  value={settings.dnsProvider}
                  onChange={(e) => setSettings({ ...settings, dnsProvider: e.target.value })}
                  className="w-full bg-gray-50 px-4 py-4 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-bold text-slate-700"
                  placeholder="e.g. GoDaddy, Namecheap"
                />
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <ShieldCheck size={14} className="text-primary" /> Security & SSL
            </div>
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-tight text-slate-900">SSL Certificate</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Automatic via Let's Encrypt</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  settings.sslStatus === 'active' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {settings.sslStatus}
                </span>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-xs font-black uppercase tracking-tight text-slate-900 mb-2">Security Headers</p>
                <div className="flex flex-wrap gap-2">
                  {['HSTS', 'X-Frame', 'X-Content'].map(h => (
                    <span key={h} className="px-2 py-1 bg-white border border-gray-100 rounded-lg text-[9px] font-bold text-slate-500">{h}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DNS Instructions */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white space-y-8">
          <div className="space-y-2">
            <h3 className="text-2xl font-black uppercase tracking-tight">DNS Configuration</h3>
            <p className="text-slate-400 text-sm">Point your domain to our servers by adding these records to your DNS provider.</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-slate-800 rounded-2xl border border-slate-700">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Type</p>
                <p className="font-mono font-bold text-primary">A</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Host</p>
                <p className="font-mono font-bold">@</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Value</p>
                <p className="font-mono font-bold">76.76.21.21</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-slate-800 rounded-2xl border border-slate-700">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Type</p>
                <p className="font-mono font-bold text-primary">CNAME</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Host</p>
                <p className="font-mono font-bold">www</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Value</p>
                <p className="font-mono font-bold">cname.newskikwetu.com</p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-2 text-xs font-bold text-slate-400">
            <ExternalLink size={14} />
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="hover:text-white transition-colors underline underline-offset-4">
              View full deployment documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainSettings;
