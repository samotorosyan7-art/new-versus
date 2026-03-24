'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/navigation';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const t = useTranslations('Nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const langRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => setOpen(false);

  const onLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as any });
    setLangOpen(false);
  };

  const languages = [
    { code: 'en', label: 'en', flag: '🇬🇧' },
    { code: 'hy', label: 'հայ', flag: '🇦🇲' },
    { code: 'ru', label: 'рус', flag: '🇷🇺' }
  ];

  const currentLang = languages.find(l => l.code === locale) || languages[0];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <>
      <nav>
        <Link href="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src="/Logo.png"
            alt="Vache Simonyan"
            width={180}
            height={60}
            style={{ objectFit: 'contain' }}
            priority
          />
        </Link>

        {/* Desktop Menu */}
        <div className="nav-desktop-links">
          <Link href="/">{t('home')}</Link>
          <Link href="/about">{t('philosophy')}</Link>
          <Link href="/practice-areas">{t('practiceAreas')}</Link>
          <Link href="/insights">{t('insights')}</Link>
          <Link href="/contact">{t('contact')}</Link>
        </div>

        <div className="nav-controls">
          <div className="lang-switcher" ref={langRef}>
            <button 
              className="lang-trigger" 
              onClick={() => setLangOpen(!langOpen)}
              aria-label="Select Language"
            >
              <span className="lang-flag">{currentLang.flag}</span>
              <span className="lang-label">{currentLang.label}</span>
              <span className="lang-caret">▼</span>
            </button>
            {langOpen && (
              <div className="lang-dropdown">
                {languages.map((l) => (
                  <button 
                    key={l.code} 
                    className={`lang-option${l.code === locale ? ' active' : ''}`}
                    onClick={() => onLanguageChange(l.code)}
                  >
                    <span className="lang-flag">{l.flag}</span>
                    <span className="lang-label">{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className={`hamburger${open ? ' open' : ''}`}
            id="hamburger"
            aria-label="Menu"
            onClick={() => setOpen(!open)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <div className={`menu-overlay${open ? ' open' : ''}`} id="menuOverlay">
        <div className="menu-links">
          <Link href="/" onClick={closeMenu}>{t('home')}</Link>
          <Link href="/about" onClick={closeMenu}>{t('philosophy')}</Link>
          <Link href="/practice-areas" onClick={closeMenu}>{t('practiceAreas')}</Link>
          <Link href="/insights" onClick={closeMenu}>{t('insights')}</Link>
          <Link href="/contact" onClick={closeMenu}>{t('contact')}</Link>
        </div>
      </div>
    </>
  );
}
