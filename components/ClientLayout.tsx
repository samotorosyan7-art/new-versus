'use client';
import { useEffect } from 'react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Scroll reveal
  useEffect(() => {
    const reveals = document.querySelectorAll<HTMLElement>('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Smooth internal link scroll
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      
      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      
      const id = href.slice(1);
      if (!id) return;
      
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    };
    
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return <>{children}</>;
}
