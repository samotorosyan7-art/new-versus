'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/navigation';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
    { code: 'en', label: 'EN', flag: '🇺🇸' },
    { code: 'hy', label: 'ՀԱՅ', flag: '🇦🇲' },
    { code: 'ru', label: 'РУС', flag: '🇷🇺' }
  ];

  const currentLang = languages.find(l => l.code === locale) || languages[0];

  useEffect(() => {
    setMounted(true);
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className={scrolled ? 'scrolled' : ''}>
        {/* Left Links */}
        <div className="nav-desktop-links nav-left">
          <Link href="/protocol">{t('protocol')}</Link>
          <Link href="/practice-areas">{t('practiceAreas')}</Link>
        </div>

        {/* Center Logo */}
        <div className="nav-logo-container">
          <Link href="/" className="nav-logo">
            <Image
              src="/logo.png"
              alt="Vache Simonyan"
              width={220}
              height={80}
              className="logo-img"
              priority
              quality={100}
            />
          </Link>
        </div>

        {/* Right Links & Controls */}
        <div className="nav-controls-group">
          <div className="nav-desktop-links nav-right">
            <Link href="/insights">{t('insights')}</Link>
            <Link href="/contact">{t('contact')}</Link>
          </div>

          <div className="nav-controls">
            {mounted && (
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
            )}

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
        </div>
      </nav>

      <div className={`menu-overlay${open ? ' open' : ''}`} id="menuOverlay">
        <div className="menu-links">
          <Link href="/" onClick={closeMenu}>{t('home')}</Link>
          <Link href="/protocol" onClick={closeMenu}>{t('protocol')}</Link>
          <Link href="/practice-areas" onClick={closeMenu}>{t('practiceAreas')}</Link>
          <Link href="/insights" onClick={closeMenu}>{t('insights')}</Link>
          <Link href="/contact" onClick={closeMenu}>{t('contact')}</Link>
        </div>
      </div>
    </>
  );
}
