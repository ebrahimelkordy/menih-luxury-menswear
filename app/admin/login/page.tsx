'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/admin/AuthContext';
import { Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signInError } = await signIn(email, password);
    setLoading(false);
    if (signInError) {
      setError(signInError);
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-concrete flex flex-col">
      {/* Top structural line */}
      <div className="h-1.5 bg-safety" />

      <div className="flex-1 flex items-center justify-center section-padding-lg">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-12">
            <Link href="/" className="font-display text-2xl font-bold tracking-tightest text-graphite">
              KORDY
            </Link>
            <div className="mt-1 tech-label-sm text-foreground/40">PROJECT CONTROL — ADMIN ACCESS</div>
          </div>

          {/* Structural line */}
          <div className="h-px bg-foreground/15 mb-8" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="tech-label-sm text-foreground/50 block mb-2" htmlFor="email">
                EMAIL
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border-b border-foreground/20 py-2 text-sm text-graphite focus:border-safety focus:outline-none transition-colors"
                placeholder="admin@kordy.com"
              />
            </div>

            <div>
              <label className="tech-label-sm text-foreground/50 block mb-2" htmlFor="password">
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border-b border-foreground/20 py-2 text-sm text-graphite focus:border-safety focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="border-l-2 border-safety px-4 py-3 bg-safety/5">
                <p className="text-sm text-safety">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-graphite text-concrete py-3 hover:bg-safety transition-colors duration-300 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span className="tech-label-sm font-medium">ACCESS DASHBOARD →</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-foreground/10">
            <Link href="/" className="tech-label-sm text-foreground/40 hover:text-safety transition-colors">
              ← BACK TO WEBSITE
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
