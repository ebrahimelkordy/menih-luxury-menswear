'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/components/admin/AuthContext';
import { AdminShell } from '@/components/admin/AdminShell';
import { Loader2 } from 'lucide-react';

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginRoute = pathname === '/admin/login';

  useEffect(() => {
    if (!loading && !user && !isLoginRoute) {
      router.replace('/admin/login');
    }
  }, [loading, user, router, isLoginRoute]);

  if (isLoginRoute) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-concrete flex items-center justify-center">
        <div className="text-center">
          <div className="h-1.5 w-12 bg-safety mb-4 mx-auto" />
          <Loader2 className="w-5 h-5 animate-spin text-foreground/40 mx-auto" />
          <div className="mt-3 tech-label-sm text-foreground/40">LOADING</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-concrete flex items-center justify-center">
        <div className="text-center">
          <div className="tech-label-sm text-foreground/40">REDIRECTING TO LOGIN...</div>
        </div>
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminGuard>{children}</AdminGuard>
    </AuthProvider>
  );
}
