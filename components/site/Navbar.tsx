'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/#projects', label: 'PROJECTS' },
  { href: '/#capabilities', label: 'CAPABILITIES' },
  { href: '/#process', label: 'PROCESS' },
  { href: '/#about', label: 'ABOUT' },
  { href: '/#contact', label: 'CONTACT' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-concrete/95 backdrop-blur-sm'
            : 'bg-transparent'
        )}
      >
        <div className="section-padding">
          <div
            className={cn(
              'flex items-center justify-between transition-all duration-300',
              scrolled ? 'h-14' : 'h-20'
            )}
          >
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-3" aria-label="Kordy home">
              <span className="font-display text-xl font-bold tracking-tightest text-graphite">
                KORDY
              </span>
              <span className="hidden sm:block w-8 h-px bg-safety transition-all duration-300 group-hover:w-12" />
              <span className="hidden sm:block tech-label-sm text-foreground/40">
                CONTRACTING
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="tech-label-sm text-foreground/60 hover:text-foreground transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-safety transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Mobile toggle */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-2 -mr-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <span className={cn('block w-6 h-px bg-graphite transition-all duration-300', mobileOpen && 'rotate-45 translate-y-[3px]')} />
              <span className={cn('block w-6 h-px bg-graphite transition-all duration-300', mobileOpen && 'opacity-0')} />
              <span className={cn('block w-6 h-px bg-graphite transition-all duration-300', mobileOpen && '-rotate-45 -translate-y-[3px]')} />
            </button>
          </div>
        </div>

        {/* Bottom beam line */}
        <div className="section-padding">
          <div className={cn('h-px bg-foreground/10 transition-all duration-500', scrolled ? 'opacity-100' : 'opacity-0')} />
        </div>
      </header>

      {/* Mobile full-screen nav */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-concrete md:hidden transition-all duration-500 flex flex-col',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <div className="h-20" />
        <div className="h-px bg-foreground/10 section-padding" />
        <nav className="flex-1 flex flex-col justify-center section-padding-lg gap-0" aria-label="Mobile navigation">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-baseline gap-4 py-5 border-b border-foreground/8"
              style={{
                transform: mobileOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: mobileOpen ? 1 : 0,
                transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.08}s`,
              }}
            >
              <span className="tech-label-sm text-safety w-8">0{i + 1}</span>
              <span className="font-display text-3xl font-medium tracking-tight text-graphite group-hover:text-safety transition-colors">
                {link.label}
              </span>
            </Link>
          ))}
        </nav>
        <div className="section-padding-lg pb-8">
          <div className="tech-label-sm text-foreground/40">
            AL-KORDY CONTRACTING — EGYPT
          </div>
        </div>
      </div>
    </>
  );
}
