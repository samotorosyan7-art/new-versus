'use client';
import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const countries = [
  { flag: '🇦🇲', name: 'Armenia', dial: '+374' },
  { flag: '🇺🇸', name: 'United States', dial: '+1' },
  { flag: '🇬🇧', name: 'United Kingdom', dial: '+44' },
  { flag: '🇷🇺', name: 'Russia', dial: '+7' },
  { flag: '🇩🇪', name: 'Germany', dial: '+49' },
  { flag: '🇫🇷', name: 'France', dial: '+33' },
  { flag: '🇮🇹', name: 'Italy', dial: '+39' },
  { flag: '🇪🇸', name: 'Spain', dial: '+34' },
  { flag: '🇵🇱', name: 'Poland', dial: '+48' },
  { flag: '🇺🇦', name: 'Ukraine', dial: '+380' },
  { flag: '🇬🇪', name: 'Georgia', dial: '+995' },
  { flag: '🇦🇿', name: 'Azerbaijan', dial: '+994' },
  { flag: '🇹🇷', name: 'Turkey', dial: '+90' },
  { flag: '🇮🇷', name: 'Iran', dial: '+98' },
  { flag: '🇮🇱', name: 'Israel', dial: '+972' },
  { flag: '🇸🇦', name: 'Saudi Arabia', dial: '+966' },
  { flag: '🇦🇪', name: 'UAE', dial: '+971' },
  { flag: '🇮🇳', name: 'India', dial: '+91' },
  { flag: '🇨🇳', name: 'China', dial: '+86' },
  { flag: '🇯🇵', name: 'Japan', dial: '+81' },
  { flag: '🇰🇷', name: 'South Korea', dial: '+82' },
  { flag: '🇸🇬', name: 'Singapore', dial: '+65' },
  { flag: '🇦🇺', name: 'Australia', dial: '+61' },
  { flag: '🇨🇦', name: 'Canada', dial: '+1' },
  { flag: '🇧🇷', name: 'Brazil', dial: '+55' },
  { flag: '🇲🇽', name: 'Mexico', dial: '+52' },
  { flag: '🇳🇱', name: 'Netherlands', dial: '+31' },
  { flag: '🇧🇪', name: 'Belgium', dial: '+32' },
  { flag: '🇨🇭', name: 'Switzerland', dial: '+41' },
  { flag: '🇦🇹', name: 'Austria', dial: '+43' },
  { flag: '🇸🇪', name: 'Sweden', dial: '+46' },
  { flag: '🇳🇴', name: 'Norway', dial: '+47' },
  { flag: '🇩🇰', name: 'Denmark', dial: '+45' },
  { flag: '🇫🇮', name: 'Finland', dial: '+358' },
  { flag: '🇵🇹', name: 'Portugal', dial: '+351' },
  { flag: '🇬🇷', name: 'Greece', dial: '+30' },
  { flag: '🇷🇴', name: 'Romania', dial: '+40' },
  { flag: '🇨🇿', name: 'Czech Republic', dial: '+420' },
  { flag: '🇭🇺', name: 'Hungary', dial: '+36' },
  { flag: '🇷🇸', name: 'Serbia', dial: '+381' },
  { flag: '🇧🇬', name: 'Bulgaria', dial: '+359' },
  { flag: '🇭🇷', name: 'Croatia', dial: '+385' },
  { flag: '🇸🇰', name: 'Slovakia', dial: '+421' },
  { flag: '🇱🇹', name: 'Lithuania', dial: '+370' },
  { flag: '🇱🇻', name: 'Latvia', dial: '+371' },
  { flag: '🇪🇪', name: 'Estonia', dial: '+372' },
  { flag: '🇰🇿', name: 'Kazakhstan', dial: '+7' },
  { flag: '🇺🇿', name: 'Uzbekistan', dial: '+998' },
  { flag: '🇲🇩', name: 'Moldova', dial: '+373' },
  { flag: '🇧🇾', name: 'Belarus', dial: '+375' },
  { flag: '🇿🇦', name: 'South Africa', dial: '+27' },
  { flag: '🇳🇬', name: 'Nigeria', dial: '+234' },
  { flag: '🇪🇬', name: 'Egypt', dial: '+20' },
  { flag: '🇲🇦', name: 'Morocco', dial: '+212' },
  { flag: '🇦🇷', name: 'Argentina', dial: '+54' },
  { flag: '🇨🇱', name: 'Chile', dial: '+56' },
  { flag: '🇨🇴', name: 'Colombia', dial: '+57' },
  { flag: '🇵🇪', name: 'Peru', dial: '+51' },
  { flag: '🇻🇳', name: 'Vietnam', dial: '+84' },
  { flag: '🇹🇭', name: 'Thailand', dial: '+66' },
  { flag: '🇵🇭', name: 'Philippines', dial: '+63' },
  { flag: '🇮🇩', name: 'Indonesia', dial: '+62' },
  { flag: '🇲🇾', name: 'Malaysia', dial: '+60' },
  { flag: '🇵🇰', name: 'Pakistan', dial: '+92' },
  { flag: '🇧🇩', name: 'Bangladesh', dial: '+880' },
  { flag: '🇳🇿', name: 'New Zealand', dial: '+64' },
];

export default function IntakeForm() {
  const t = useTranslations('IntakeForm');
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search)
  );

  const goToStep = (n: number) => setStep(n);

  const selectCategory = (cat: string) => {
    setCategory(cat);
    goToStep(1);
  };

  const openDropdown = () => {
    setDropdownOpen(true);
    setSearch('');
    setTimeout(() => searchRef.current?.focus(), 50);
  };

  const closeDropdown = () => setDropdownOpen(false);

  const toggleDropdown = () => (dropdownOpen ? closeDropdown() : openDropdown());

  const handleSelectCountry = (c: typeof countries[0]) => {
    setSelectedCountry(c);
    closeDropdown();
    phoneRef.current?.focus();
  };

  const submitForm = async () => {
    setIsLoading(true);
    const fullPhone = `${selectedCountry.dial} ${phoneRef.current?.value || ''}`.trim();

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, name, email, phone: fullPhone, description })
      });
      if (res.ok) {
        goToStep(2);
      } else {
        // Failed to submit
      }
    } catch (e) {
      // Error in submission
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <section id="intake">
      <div className="intake-copy reveal">
        <p className="section-label">{t('label')}</p>
        <h2 className="intake-question">
          {t.rich('question', {
            br: () => <br />
          })}
        </h2>
        <p className="intake-sub">{t('sub')}</p>
      </div>

      <div className="intake-form-side reveal reveal-delay-2">
        <div className="step-indicator">
          <div className={`step-dot${step === 0 ? ' active' : ''}`}></div>
          <div className={`step-dot${step === 1 ? ' active' : ''}`}></div>
          <div className={`step-dot${step === 2 ? ' active' : ''}`}></div>
        </div>

        {/* Step 0 */}
        <div className={`intake-step${step === 0 ? ' active' : ''}`}>
          <p style={{ fontSize: '13px', color: 'var(--faint)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px' }}>
            {t('selectMatter')}
          </p>
          <div className="intake-buttons">
            <button className="intake-btn" onClick={() => selectCategory(t('categories.business'))}>
              {t('categories.business')}
            </button>
            <button className="intake-btn" onClick={() => selectCategory(t('categories.litigation'))}>
              {t('categories.litigation')}
            </button>
            <button className="intake-btn" onClick={() => selectCategory(t('categories.advisory'))}>
              {t('categories.advisory')}
            </button>
          </div>
        </div>

        {/* Step 1 */}
        <div className={`intake-step${step === 1 ? ' active' : ''}`}>
          <p style={{ fontSize: '13px', color: 'var(--faint)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px' }}>
            {category}
          </p>
          <input className="intake-input" type="text" placeholder={t('placeholderDesc')} value={description} onChange={(e) => setDescription(e.target.value)} />
          <input className="intake-input" type="text" placeholder={t('placeholderName')} value={name} onChange={(e) => setName(e.target.value)} />
          <input className="intake-input" type="email" placeholder={t('placeholderEmail')} value={email} onChange={(e) => setEmail(e.target.value)} />

          <div className="phone-input-wrapper" ref={wrapperRef}>
            <button type="button" className="country-select-btn" onClick={toggleDropdown}>
              <span className="country-flag">{selectedCountry.flag}</span>
              <span className="country-dial">{selectedCountry.dial}</span>
              <span className="country-caret">▼</span>
            </button>
            <div className={`country-dropdown${dropdownOpen ? ' open' : ''}`}>
              <input
                ref={searchRef}
                type="text"
                className="country-search-input"
                placeholder={t('searchCountry')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div>
                {filteredCountries.map((c, i) => (
                  <div key={i} className="country-option" onClick={() => handleSelectCountry(c)}>
                    <span className="opt-flag">{c.flag}</span>
                    <span className="opt-name">{c.name}</span>
                    <span className="opt-dial">{c.dial}</span>
                  </div>
                ))}
              </div>
            </div>
            <input ref={phoneRef} type="tel" className="phone-number-input" placeholder={t('placeholderPhone')} />
          </div>

          <button className="intake-submit" onClick={submitForm} disabled={isLoading}>
            {isLoading ? '...' : t('continue')}
          </button>
          <br />
          <button className="intake-back" onClick={() => goToStep(0)}>← {t('back')}</button>
        </div>

        {/* Step 2 */}
        <div className={`intake-step${step === 2 ? ' active' : ''}`}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ width: '48px', height: '48px', border: '1px solid var(--copper)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <span style={{ color: 'var(--copper)', fontSize: '20px' }}>✓</span>
            </div>
            <p style={{ fontFamily: "var(--font-playfair), serif", fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>
              {t('received')}
            </p>
            <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(245,240,232,0.6)' }}>
              {t('confirmation')}
            </p>
          </div>
          <button className="intake-back" onClick={() => goToStep(0)}>← {t('startOver')}</button>
        </div>
      </div>
    </section>
  );
}
