'use client';
import { useState, useEffect } from 'react';
import { slugify } from '@/lib/slugify';

const LOCALES = ['en', 'hy', 'ru'] as const;
type Locale = typeof LOCALES[number];
const LOCALE_LABELS: Record<Locale, string> = { en: 'English', hy: 'Armenian', ru: 'Russian' };

type CaseSummary = {
  slug: string;
  title: string;
  date: string;
  order: number | null;
  image: string;
  locales: { locale: Locale; exists: boolean }[];
};

type TranslationDraft = {
  title: string;
  excerpt: string;
  content: string;
};

const emptyDraft = (): TranslationDraft => ({ title: '', excerpt: '', content: '' });
const emptyDrafts = (): Record<Locale, TranslationDraft> => ({ en: emptyDraft(), hy: emptyDraft(), ru: emptyDraft() });
const noLocales = (): Record<Locale, boolean> => ({ en: false, hy: false, ru: false });

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');

  // Case list state
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [isLoadingCases, setIsLoadingCases] = useState(false);

  // Editor state — one case at a time, with a draft per locale tab
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [caseSlug, setCaseSlug] = useState('');
  const [slugLocked, setSlugLocked] = useState(false);
  const [caseImage, setCaseImage] = useState('');
  const [caseOrder, setCaseOrder] = useState('');
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [pendingImagePreview, setPendingImagePreview] = useState('');
  const [activeLocale, setActiveLocale] = useState<Locale>('en');
  const [drafts, setDrafts] = useState<Record<Locale, TranslationDraft>>(emptyDrafts());
  const [caseLocalesExist, setCaseLocalesExist] = useState<Record<Locale, boolean>>(noLocales());
  const [isLoadingCase, setIsLoadingCase] = useState(false);
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedCode = localStorage.getItem('adminAuthCode');
    if (savedCode) {
      attemptLogin(savedCode);
    }
  }, []);

  // Validates the password against the server (not a client-side constant),
  // since the real password lives in ADMIN_PASSWORD on the server.
  const attemptLogin = async (pass: string): Promise<boolean> => {
    setIsLoadingCases(true);
    try {
      const res = await fetch('/api/admin/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass }),
      });
      const data = await res.json();
      if (res.ok) {
        setCases(data.cases || []);
        setIsLoggedIn(true);
        localStorage.setItem('adminAuthCode', pass);
        setIsLoadingCases(false);
        return true;
      }
    } catch {
      // Error validating login
    }
    setIsLoadingCases(false);
    return false;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await attemptLogin(password);
    if (!ok) alert('Invalid credentials');
  };

  const selectCase = async (summary: CaseSummary) => {
    if (status === 'Saving...') return;
    setStatus('Loading case...');
    setIsLoadingCase(true);
    setSelectedSlug(summary.slug);
    setCaseSlug(summary.slug);
    setSlugLocked(true); // existing case: title edits must never silently change the slug
    setCaseImage('');
    setCaseOrder('');
    clearPendingImage();
    setDrafts(emptyDrafts());
    setCaseLocalesExist(noLocales());

    const pass = localStorage.getItem('adminAuthCode') || '';
    const existingLocales = summary.locales.filter((l) => l.exists).map((l) => l.locale);

    try {
      const results = await Promise.all(
        existingLocales.map(async (locale) => {
          const res = await fetch('/api/admin/single', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: pass, fileName: `${summary.slug}.${locale}.mdx` }),
          });
          const data = await res.json();
          return { locale, ok: res.ok, data };
        })
      );

      const nextDrafts = emptyDrafts();
      const nextExist = noLocales();
      let sharedImage = '';
      let sharedOrder = '';
      for (const r of results) {
        if (!r.ok) continue;
        nextDrafts[r.locale] = {
          title: r.data.title,
          excerpt: r.data.excerpt,
          content: r.data.content,
        };
        nextExist[r.locale] = true;
        if (!sharedImage && r.data.image) sharedImage = r.data.image;
        if (!sharedOrder && (r.data.order === 0 || r.data.order)) sharedOrder = String(r.data.order);
      }
      setDrafts(nextDrafts);
      setCaseLocalesExist(nextExist);
      setCaseImage(sharedImage);
      setCaseOrder(sharedOrder);
      setActiveLocale(existingLocales[0] || 'en');
      setStatus('');
    } catch {
      setStatus('Failed to load.');
    }
    setIsLoadingCase(false);
  };

  const handleNew = () => {
    setSelectedSlug(null);
    setCaseSlug('');
    setSlugLocked(false);
    setCaseImage('');
    clearPendingImage();
    setActiveLocale('en');
    setDrafts(emptyDrafts());
    setCaseLocalesExist(noLocales());
    setStatus('New case mode.');
  };

  const updateDraft = (patch: Partial<TranslationDraft>) => {
    setDrafts((prev) => ({ ...prev, [activeLocale]: { ...prev[activeLocale], ...patch } }));
  };

  const handleTitleChange = (value: string) => {
    updateDraft({ title: value });
    // The slug is the case's canonical URL, so it's always derived from the English
    // title specifically — not whichever locale tab happens to be open — so it stays
    // a stable, readable Latin URL regardless of which language gets filled in first.
    if (!slugLocked && activeLocale === 'en') {
      setCaseSlug(slugify(value));
    }
  };

  const handleSlugChange = (value: string) => {
    setSlugLocked(true);
    setCaseSlug(value);
  };

  // The image file is only staged locally — it's uploaded to the server as part of
  // the single "Save Case" action, not as its own separate server action.
  const clearPendingImage = () => {
    setPendingImageFile(null);
    setPendingImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return '';
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;

    clearPendingImage();
    setPendingImageFile(file);
    setPendingImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    clearPendingImage();
    setCaseImage('');
  };

  const handleDeleteCase = async () => {
    if (!selectedSlug) return;
    const existingLocales = LOCALES.filter((l) => caseLocalesExist[l]);
    const label = existingLocales.map((l) => l.toUpperCase()).join(', ') || 'no saved translations';
    if (!confirm(`Delete this entire case (${label})? This cannot be undone.`)) return;

    if (existingLocales.length === 0) {
      handleNew();
      return;
    }

    setStatus('Deleting...');
    const pass = localStorage.getItem('adminAuthCode') || '';
    const slugToDelete = selectedSlug;
    try {
      // Deletes every translation as one request/commit, so removing a case
      // triggers a single deploy instead of one per translation.
      const res = await fetch('/api/admin/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass, fileNames: existingLocales.map((l) => `${slugToDelete}.${l}.mdx`) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(`❌ Error: ${data.error}`);
        return;
      }
      setStatus('Deleted successfully.');
      // Drop it from the sidebar immediately — in production the list endpoint reads
      // the local filesystem, which still shows the deleted case until the site redeploys.
      setCases((prev) => prev.filter((c) => c.slug !== slugToDelete));
      handleNew();
    } catch {
      setStatus('❌ Network error while deleting.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = slugify(caseSlug);

    if (!finalSlug) {
      setStatus('❌ Error: set a title or slug before saving.');
      return;
    }

    // Save every locale tab that's been filled in, not just the one currently active.
    const localesToSave = LOCALES.filter((l) => drafts[l].title.trim() !== '');
    if (localesToSave.length === 0) {
      setStatus('❌ Error: fill in at least one language before saving.');
      return;
    }
    for (const l of localesToSave) {
      const d = drafts[l];
      if (!d.excerpt.trim() || !d.content.trim()) {
        setStatus(`❌ Error: ${LOCALE_LABELS[l]} is missing an excerpt or content.`);
        return;
      }
    }

    if (selectedSlug && finalSlug !== selectedSlug) {
      const ok = confirm(
        `This will move every translation of this case from "/${selectedSlug}" to "/${finalSlug}" and leave a redirect behind for the old URL. Continue?`
      );
      if (!ok) return;
    }

    setIsSaving(true);
    setStatus('Saving...');
    const pass = localStorage.getItem('adminAuthCode') || '';

    try {
      const translations: Record<string, TranslationDraft> = {};
      for (const l of localesToSave) translations[l] = drafts[l];

      // Image, all locale translations, and any rename/redirect bookkeeping go in
      // a single request so production writes land as one GitHub commit — one
      // deploy per case save instead of one per file.
      const formData = new FormData();
      formData.append('password', pass);
      formData.append('slug', finalSlug);
      formData.append('previousSlug', selectedSlug || '');
      formData.append('image', caseImage);
      formData.append('order', caseOrder);
      formData.append('translations', JSON.stringify(translations));
      if (pendingImageFile) formData.append('file', pendingImageFile);

      const res = await fetch('/api/admin/save', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        setStatus(`❌ Error: ${data.error}`);
        setIsSaving(false);
        return;
      }

      setStatus('✅ ' + data.message);
      setSelectedSlug(finalSlug);
      setCaseSlug(finalSlug);
      setSlugLocked(true);
      setCaseImage(data.image);
      // Don't switch the preview to the new remote URL yet — in production the upload
      // lands via a GitHub commit and isn't actually live until the site redeploys
      // (~1-2 min), so showing it immediately would 404. Keep showing the local
      // preview for the rest of this session; it'll load from the server next time.
      setPendingImageFile(null);
      const finalLocalesExist = { ...caseLocalesExist };
      localesToSave.forEach((l) => { finalLocalesExist[l] = true; });
      setCaseLocalesExist(finalLocalesExist);

      // Update the sidebar entry from what was just saved instead of re-fetching —
      // in production the list endpoint reads the local filesystem, which won't
      // reflect this save until the site redeploys, so a fetch here would make the
      // new/edited case briefly vanish or look stale.
      const preferredDraft = drafts.en.title.trim() ? drafts.en : drafts.hy.title.trim() ? drafts.hy : drafts.ru;
      const parsedOrder = caseOrder !== '' ? Number(caseOrder) : NaN;
      const summary: CaseSummary = {
        slug: finalSlug,
        title: preferredDraft.title.trim() || finalSlug,
        date: new Date().toISOString().split('T')[0],
        order: Number.isNaN(parsedOrder) ? null : parsedOrder,
        image: data.image || '',
        locales: LOCALES.map((l) => ({ locale: l, exists: !!finalLocalesExist[l] })),
      };
      setCases((prev) => {
        const next = [...prev.filter((c) => c.slug !== selectedSlug && c.slug !== finalSlug), summary];
        next.sort((a, b) => {
          const ao = a.order ?? Number.POSITIVE_INFINITY;
          const bo = b.order ?? Number.POSITIVE_INFINITY;
          if (ao !== bo) return ao - bo;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        return next;
      });
    } catch {
      setStatus('❌ Network error while saving.');
    }
    setIsSaving(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthCode');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', padding: '40px', background: 'var(--surface)', borderRadius: 'var(--radius-lg)' }}>
        <h1 style={{ marginBottom: '24px', fontFamily: 'var(--font-serif)' }}>Admin Access</h1>
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

  const draft = drafts[activeLocale];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* SIDEBAR */}
      <div style={{ width: '320px', borderRight: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', margin: 0 }}>Cases</h2>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px' }}>Logout</button>
          </div>
          <button onClick={handleNew} className="primary-btn" style={{ width: '100%', padding: '12px', fontSize: '11px' }}>+ Add New Case</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {isLoadingCases ? <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Loading...</p> : null}
          {cases.map(c => (
            <div
              key={c.slug}
              onClick={() => selectCase(c)}
              style={{ cursor: 'pointer', background: selectedSlug === c.slug ? 'var(--accent-dim)' : 'var(--bg)', border: '1px solid var(--border)', padding: '16px', borderRadius: 'var(--radius-sm)', marginBottom: '12px', transition: 'background 0.2s', display: 'flex', gap: '12px' }}
            >
              {c.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.image} alt="" style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }} />
              ) : null}
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                  {c.locales.map(({ locale, exists }) => (
                    <span key={locale} style={{ fontSize: '9px', fontWeight: 'bold', padding: '2px 5px', borderRadius: '3px', color: exists ? 'var(--accent)' : 'var(--text-muted)', background: exists ? 'var(--accent-dim)' : 'transparent', border: exists ? 'none' : '1px solid var(--border)' }}>
                      {locale.toUpperCase()}
                    </span>
                  ))}
                  {c.order !== null ? <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>#{c.order}</span> : null}
                </div>
                <div style={{ fontWeight: '600', fontSize: '14px', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EDITOR */}
      <div style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>
            {selectedSlug ? 'Edit Case' : 'Draft New Case'}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px', whiteSpace: 'nowrap' }}>/cases/</span>
            <input
              value={caseSlug}
              onChange={e => handleSlugChange(e.target.value)}
              className="intake-input"
              style={{ marginBottom: 0, padding: '8px 10px', fontSize: '13px', fontFamily: 'monospace' }}
              placeholder="url-slug"
            />
            {selectedSlug ? (
              <button type="button" onClick={handleDeleteCase} style={{ background: 'none', border: 'none', color: '#ff4444', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                Delete case
              </button>
            ) : null}
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px' }}>Case Image (shared across all languages)</label>
            {(pendingImagePreview || caseImage) ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pendingImagePreview || caseImage} alt="" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }} />
                <button type="button" onClick={handleRemoveImage} style={{ background: 'none', border: 'none', color: '#ff4444', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Remove image
                </button>
              </div>
            ) : null}
            <input
              type="file" accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageSelect} disabled={isSaving}
              className="intake-input" style={{ marginBottom: 0 }}
            />
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '6px' }}>
              {pendingImageFile ? 'Selected — will upload when you save.' : 'Shown at the top of the case page in every language. JPEG, PNG, WEBP, or GIF, under 1MB.'}
            </p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px' }}>Display Order (shared across all languages)</label>
            <input
              type="number" value={caseOrder} onChange={e => setCaseOrder(e.target.value)}
              className="intake-input" placeholder="e.g. 1 — lower numbers appear first" style={{ marginBottom: 0 }}
            />
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '6px' }}>
              Controls the order on the Cases page. Lower numbers appear first; leave blank to fall back to newest-first.
            </p>
          </div>

          {/* LOCALE TABS */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '32px', borderBottom: '1px solid var(--border)' }}>
            {LOCALES.map(locale => (
              <button
                key={locale}
                type="button"
                onClick={() => setActiveLocale(locale)}
                style={{
                  padding: '10px 18px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeLocale === locale ? '2px solid var(--accent)' : '2px solid transparent',
                  color: activeLocale === locale ? 'var(--accent)' : 'var(--text-muted)',
                }}
              >
                {LOCALE_LABELS[locale]} {caseLocalesExist[locale] ? '●' : '○'}
              </button>
            ))}
          </div>

          {isLoadingCase ? <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Loading translations...</p> : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px' }}>Article Title ({LOCALE_LABELS[activeLocale]})</label>
                <input
                  type="text" value={draft.title} onChange={e => handleTitleChange(e.target.value)}
                  className="intake-input" placeholder="The title of your case study" style={{ marginBottom: 0 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px' }}>Short Excerpt (shows in grid)</label>
                <input
                  type="text" value={draft.excerpt} onChange={e => updateDraft({ excerpt: e.target.value })}
                  className="intake-input" placeholder="A one sentence summary..." style={{ marginBottom: 0 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px' }}>Main Content (Supports Markdown)</label>
                <textarea
                  value={draft.content} onChange={e => updateDraft({ content: e.target.value })}
                  className="intake-input" rows={18} placeholder="Write your full article here. Use ## for headers and *italic* or **bold** for styling." style={{ marginBottom: 0, resize: 'vertical', fontFamily: 'monospace' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                <button type="submit" className="primary-btn" disabled={isSaving}>
                  Save Case
                </button>
                {status && <span style={{ fontWeight: 'bold', color: status.includes('❌') ? '#ff4444' : 'var(--accent)', fontSize: '14px' }}>{status}</span>}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
