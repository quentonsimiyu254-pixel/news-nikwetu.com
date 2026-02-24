
import React from 'react';
import Layout from '../components/Layout';
import { motion } from 'motion/react';
import { Newspaper, Users, Globe, Award, ChevronRight } from 'lucide-react';

const About: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-20">
        {/* Hero */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
            <Newspaper size={14} /> Our Story
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-none tracking-tighter">
            Voice of the <span className="text-primary">People.</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            News Nikwetu is Kenya's premier digital news destination, committed to delivering accurate, unbiased, and timely reporting to our readers across the globe.
          </p>
        </motion.section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-gray-100">
          <div className="text-center space-y-1">
            <p className="text-4xl font-black text-slate-900 tracking-tighter">10M+</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Monthly Readers</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-4xl font-black text-slate-900 tracking-tighter">50+</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Journalists</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-4xl font-black text-slate-900 tracking-tighter">24/7</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Reporting</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-4xl font-black text-slate-900 tracking-tighter">15</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Awards Won</p>
          </div>
        </section>

        {/* Mission */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tight">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed">
              In an era of misinformation, News Nikwetu stands as a beacon of truth. We believe in the power of journalism to transform society, hold leaders accountable, and give a voice to the voiceless.
            </p>
            <ul className="space-y-4">
              {[
                { icon: <Users size={20} />, title: "Community Focused", desc: "We tell stories that matter to local communities." },
                { icon: <Globe size={20} />, title: "Global Perspective", desc: "Connecting local events to global trends." },
                { icon: <Award size={20} />, title: "Excellence in Reporting", desc: "Adhering to the highest journalistic standards." }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="bg-primary/10 text-primary p-2 rounded-lg shrink-0 h-fit">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl rotate-3">
            <img 
              src="https://picsum.photos/seed/news/800/1000" 
              alt="Newsroom" 
              className="w-full h-auto"
              referrerPolicy="no-referrer"
            />
          </div>
        </section>

        {/* Team */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black uppercase tracking-tight">Meet the Editorial Team</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Our team of experienced editors and journalists work around the clock to bring you the news.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Sarah Omolo", role: "Editor-in-Chief", img: "https://picsum.photos/seed/sarah/400/400" },
              { name: "James Mwangi", role: "Senior Political Reporter", img: "https://picsum.photos/seed/james/400/400" },
              { name: "Kevin Odhiambo", role: "Head of Sports", img: "https://picsum.photos/seed/kevin/400/400" }
            ].map((member, i) => (
              <div key={i} className="group space-y-4 text-center">
                <div className="aspect-square rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">{member.name}</h4>
                  <p className="text-sm font-bold text-primary uppercase tracking-widest">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-900 rounded-3xl p-12 text-center text-white space-y-6">
          <h2 className="text-3xl font-black uppercase tracking-tight">Want to join our team?</h2>
          <p className="text-slate-400 max-w-xl mx-auto">We are always looking for talented journalists and storytellers to join our growing family.</p>
          <button className="btn-primary">View Careers</button>
        </section>
      </div>
    </Layout>
  );
};

export default About;
