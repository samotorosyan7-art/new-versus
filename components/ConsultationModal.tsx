'use client';
import { useEffect, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const t = useTranslations('ConsultationModal');
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setSubmitted(false);
    setError(false);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: 'Consultation Request', name, email, phone, description }),
      });

      if (res.ok) {
        setSubmitted(true);
        setName('');
        setEmail('');
        setPhone('');
        setDescription('');
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className={`consult-overlay${isOpen ? ' open' : ''}`}
      onClick={onClose}
      aria-hidden={!isOpen}
    >
      <div
        className="consult-modal"
        role="dialog"
        aria-modal="true"
        aria-label={t('title')}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="consult-close" onClick={onClose} aria-label={t('close')}>
          ×
        </button>

        {submitted ? (
          <div className="consult-success">
            <div className="consult-success-icon">✓</div>
            <p className="consult-success-title">{t('received')}</p>
            <p className="consult-success-sub">{t('confirmation')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="consult-title">{t('title')}</h2>
            <p className="consult-subtitle">{t('subtitle')}</p>

            <input
              className="intake-input"
              type="text"
              required
              placeholder={t('placeholderName')}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="intake-input"
              type="email"
              required
              placeholder={t('placeholderEmail')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="intake-input"
              type="tel"
              placeholder={t('placeholderPhone')}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <textarea
              className="intake-input consult-textarea"
              required
              placeholder={t('placeholderMessage')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {error && <p className="consult-error">{t('error')}</p>}

            <button type="submit" className="intake-submit" disabled={isLoading}>
              {isLoading ? t('sending') : t('submit')}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
