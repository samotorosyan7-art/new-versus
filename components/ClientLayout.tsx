'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import PageTransition from './PageTransition';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Scroll reveal — re-run on every navigation
  useEffect(() => {
    // Small delay so page transition finishes first
    const delay = setTimeout(() => {
      const reveals = document.querySelectorAll<HTMLElement>('.reveal');
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      );
      reveals.forEach((el) => observer.observe(el));

      // Safety fallback: show all after 4s
      const timer = setTimeout(() => {
        document.querySelectorAll('.reveal:not(.visible)').forEach((el) =>
          el.classList.add('visible')
        );
      }, 4000);

      return () => {
        observer.disconnect();
        clearTimeout(timer);
      };
    }, 350); // match transition duration

    return () => clearTimeout(delay);
  }, [pathname]);

  // Smooth internal link scroll
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href?.startsWith('#')) return;
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

  return <PageTransition>{children}</PageTransition>;
}
