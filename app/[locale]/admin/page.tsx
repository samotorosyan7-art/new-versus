'use client';
import { useState, useEffect } from 'react';

type PostMeta = {
  fileName: string;
  title: string;
  date: string;
  tag: string;
  locale: string;
};

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  
  // Post List State
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  // Editor State
  const [editingFileName, setEditingFileName] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [locale, setLocale] = useState('en');
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Check localStorage on mount
    const savedCode = localStorage.getItem('adminAuthCode');
    if (savedCode === 'admin1211') {
      setIsLoggedIn(true);
      fetchPosts('admin1211');
    }
  }, []);

  const fetchPosts = async (pass: string) => {
    setIsLoadingPosts(true);
    try {
      const res = await fetch('/api/admin/list', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ password: pass })
      });
      const data = await res.json();
      if (res.ok) setPosts(data.posts || []);
      // Error fetching list
    } catch {
      // Error fetching list
    }
    setIsLoadingPosts(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin1211' || password === 'admin') { // Keeping username/pass prompt simple
      localStorage.setItem('adminAuthCode', 'admin1211');
      setIsLoggedIn(true);
      fetchPosts('admin1211');
    } else {
      alert('Invalid credentials');
    }
  };

  const loadPost = async (fileName: string, postLocale: string) => {
    if (status === 'Saving...') return;
    setStatus('Loading post...');
    const pass = localStorage.getItem('adminAuthCode') || '';
    
    try {
      const res = await fetch('/api/admin/single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass, fileName })
      });
      const data = await res.json();
      if (res.ok) {
        setTitle(data.title);
        setExcerpt(data.excerpt);
        setContent(data.content);
        setLocale(postLocale);
        setEditingFileName(fileName);
        setStatus('Loaded successfully.');
      }
    } catch {
      setStatus('Failed to load.');
    }
  };

  const handleNew = () => {
    setEditingFileName(null);
    setTitle('');
    setExcerpt('');
    setContent('');
    setLocale('en');
    setStatus('New article mode.');
  }

  const handleDelete = async (fileName: string) => {
    if (!confirm('Are you sure you want to delete this file completely?')) return;
    setStatus('Deleting...');
    const pass = localStorage.getItem('adminAuthCode') || '';
    
    try {
      const res = await fetch('/api/admin/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass, fileName })
      });
      if (res.ok) {
        setStatus('Deleted successfully.');
        if (editingFileName === fileName) handleNew();
        fetchPosts(pass);
      }
    } catch {
      setStatus('Failed to delete.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Saving...');
    const pass = localStorage.getItem('adminAuthCode') || '';
    
    try {
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, excerpt, content, password: pass, locale, oldFileName: editingFileName 
        }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus('✅ ' + data.message);
        fetchPosts(pass);
        // Reset to new if it was a new post so we don't accidentally make duplicates if they change topic entirely
        // But if they just saved, we should keep it open.
        const safeSlug = title.toLowerCase().trim().replace(/[^\w\s\u0530-\u058F\u0400-\u04FF-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '') || 'new-article';
        setEditingFileName(`${safeSlug}.${locale}.mdx`);
      } else {
        setStatus('❌ Error: ' + data.error);
      }
    } catch (err) {
      setStatus('❌ Network error while saving.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthCode');
    setIsLoggedIn(false);
  }

  if (!isLoggedIn) {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', padding: '40px', background: 'var(--surface)', borderRadius: 'var(--radius-lg)' }}>
        <h1 style={{ marginBottom: '24px', fontFamily: 'var(--font-playfair)' }}>Admin Access</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input 
            type="password" 
            placeholder="System Password" 
            value={password} onChange={e => setPassword(e.target.value)} 
            className="intake-input" style={{ marginBottom: 0 }}
          />
          <button type="submit" className="primary-btn" style={{ width: '100%' }}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* SIDEBAR */}
      <div style={{ width: '320px', borderRight: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontFamily: 'var(--font-playfair)', margin: 0 }}>Articles</h2>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px' }}>Logout</button>
          </div>
          <button onClick={handleNew} className="primary-btn" style={{ width: '100%', padding: '12px', fontSize: '11px' }}>+ Compose New</button>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {isLoadingPosts ? <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Loading...</p> : null}
          {posts.map(post => (
            <div key={post.fileName} style={{ background: editingFileName === post.fileName ? 'var(--accent-dim)' : 'var(--bg)', border: '1px solid var(--border)', padding: '16px', borderRadius: 'var(--radius-sm)', marginBottom: '12px', transition: 'background 0.2s', position: 'relative' }}>
              <div 
                style={{ cursor: 'pointer' }}
                onClick={() => loadPost(post.fileName, post.locale)}
              >
                <div style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase' }}>{post.locale.toUpperCase()} · {post.date}</div>
                <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '8px', lineHeight: 1.3 }}>{post.title}</div>
              </div>
              <button 
                onClick={() => handleDelete(post.fileName)}
                style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'none', border: 'none', color: '#ff4444', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* EDITOR */}
      <div style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '8px', fontFamily: 'var(--font-playfair)' }}>
            {editingFileName ? 'Edit Article' : 'Draft New Article'}
          </h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '14px' }}>
            {editingFileName ? `Editing: ${editingFileName}` : 'Editing: Unsaved Draft'}
          </p>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px' }}>Language Locale</label>
              <select value={locale} onChange={e => setLocale(e.target.value)} className="intake-input" style={{ marginBottom: 0, padding: '12px' }}>
                <option value="en">English (EN)</option>
                <option value="hy">Armenian (HY)</option>
                <option value="ru">Russian (RU)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px' }}>Article Title</label>
              <input 
                required type="text" value={title} onChange={e => setTitle(e.target.value)} 
                className="intake-input" placeholder="The title of your case study" style={{ marginBottom: 0 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px' }}>Short Excerpt (shows in grid)</label>
              <input 
                required type="text" value={excerpt} onChange={e => setExcerpt(e.target.value)} 
                className="intake-input" placeholder="A one sentence summary..." style={{ marginBottom: 0 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px' }}>Main Content (Supports Markdown)</label>
              <textarea 
                required value={content} onChange={e => setContent(e.target.value)} 
                className="intake-input" rows={18} placeholder="Write your full article here. Use ## for headers and *italic* or **bold** for styling." style={{ marginBottom: 0, resize: 'vertical', fontFamily: 'monospace' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <button type="submit" className="primary-btn">
                {editingFileName ? 'Update Article' : 'Publish Article'}
              </button>
              {status && <span style={{ fontWeight: 'bold', color: status.includes('❌') ? '#ff4444' : 'var(--accent)', fontSize: '14px' }}>{status}</span>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
