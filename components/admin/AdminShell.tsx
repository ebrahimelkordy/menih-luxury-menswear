'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FolderKanban, Wrench, GitBranch, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from './AuthContext';

const NAV_ITEMS = [
  { href: '/admin', label: 'OVERVIEW', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'PROJECTS', icon: FolderKanban },
  { href: '/admin/capabilities', label: 'CAPABILITIES', icon: Wrench },
  { href: '/admin/process', label: 'PROCESS', icon: GitBranch },
  { href: '/admin/settings', label: 'SETTINGS', icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-concrete-50 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-40 h-screen w-60 bg-graphite text-concrete flex flex-col transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Top bar */}
        <div className="h-1.5 bg-safety" />

        {/* Logo */}
        <div className="px-5 py-6 border-b border-concrete/10">
          <Link href="/admin" className="font-display text-xl font-bold tracking-tightest text-concrete">
            KORDY
          </Link>
          <div className="tech-label-sm text-concrete/40 mt-1">PROJECT CONTROL</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-5 py-3 text-sm transition-colors relative',
                  isActive(item.href)
                    ? 'text-safety bg-concrete/5'
                    : 'text-concrete/50 hover:text-concrete hover:bg-concrete/5'
                )}
              >
                {isActive(item.href) && <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-safety" />}
                <Icon className="w-4 h-4" />
                <span className="tech-label-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-concrete/10 p-5 space-y-3">
          <Link
            href="/"
            className="block tech-label-sm text-concrete/40 hover:text-safety transition-colors"
          >
            ← VIEW WEBSITE
          </Link>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 tech-label-sm text-concrete/40 hover:text-safety transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            SIGN OUT
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-graphite/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-5 py-4 bg-graphite text-concrete sticky top-0 z-30">
          <Link href="/admin" className="font-display text-lg font-bold tracking-tightest">
            KORDY
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <main className="flex-1 p-5 md:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
