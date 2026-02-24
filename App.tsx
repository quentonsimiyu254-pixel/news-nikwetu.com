
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Article from './pages/Article';
import CategoryPage from './pages/Category';
import SearchResults from './pages/Search';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import PostEditor from './pages/Admin/PostEditor';
import DomainSettings from './pages/Admin/DomainSettings';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Frontend Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/article/:slug" element={<Article />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<div className="p-10">Privacy Policy Content</div>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/editor" element={<PostEditor />} />
        <Route path="/admin/editor/:id" element={<PostEditor />} />
        <Route path="/admin/domain" element={<DomainSettings />} />
      </Routes>
    </Router>
  );
};

export default App;
