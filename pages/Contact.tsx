
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { cmsService } from '../services/cmsService';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await cmsService.submitContact(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Header */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
            <MessageSquare size={14} /> Get in Touch
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-none tracking-tighter">
            We'd love to hear <span className="text-primary">from you.</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Have a news tip, a question, or feedback? Reach out to us and our team will get back to you as soon as possible.
          </p>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-8">
              <h2 className="text-3xl font-black uppercase tracking-tight">Contact Information</h2>
              <div className="space-y-6">
                {[
                  { icon: <Mail />, title: "Email Us", value: "info@newsnikwetu.co.ke", desc: "For general inquiries and tips." },
                  { icon: <Phone />, title: "Call Us", value: "+254 743 638486", desc: "Available Mon-Fri, 8am-5pm." },
                  { icon: <MapPin />, title: "Visit Us", value: "Nikwetu Plaza, Nairobi", desc: "Main editorial headquarters." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-primary text-white p-3 rounded-xl h-fit">
                      {item.icon}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <p className="text-primary font-black tracking-tight">{item.value}</p>
                      <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-6">
              <h3 className="text-xl font-bold">Follow Our Coverage</h3>
              <p className="text-slate-400 text-sm">Stay connected with us on social media for real-time news updates.</p>
              <div className="flex gap-4">
                {['FB', 'TW', 'IG', 'YT'].map(social => (
                  <a key={social} href="#" className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center font-black text-xs hover:bg-primary transition-colors">
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-6"
                >
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={40} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black">Message Sent!</h3>
                    <p className="text-slate-500">Thank you for reaching out. We'll get back to you shortly.</p>
                  </div>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="btn-outline"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="John Doe"
                        className="input-field"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</label>
                      <input 
                        required
                        type="email" 
                        placeholder="john@example.com"
                        className="input-field"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Subject</label>
                    <input 
                      required
                      type="text" 
                      placeholder="How can we help?"
                      className="input-field"
                      value={formData.subject}
                      onChange={e => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Message</label>
                    <textarea 
                      required
                      rows={6}
                      placeholder="Your message here..."
                      className="input-field resize-none"
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>
                  <button 
                    disabled={loading}
                    type="submit" 
                    className="w-full btn-primary py-4 flex items-center justify-center gap-2 group"
                  >
                    {loading ? "Sending..." : (
                      <>
                        Send Message <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
