import { useState, useEffect } from 'react';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminOverviewTab } from '@/components/admin/AdminOverviewTab';
import { AdminOrdersTab } from '@/components/admin/AdminOrdersTab';
import { AdminProductsTab } from '@/components/admin/AdminProductsTab';
import { AdminCategoriesTab } from '@/components/admin/AdminCategoriesTab';
import { AdminContentTab } from '@/components/admin/AdminContentTab';
import { AdminSettingsTab } from '@/components/admin/AdminSettingsTab';

interface AdminPageProps {
  initialTab?: string;
}

export function AdminPage({ initialTab = 'overview' }: AdminPageProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('ezar_admin_auth') === 'authenticated';
  });
  const [currentTab, setCurrentTab] = useState<string>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setCurrentTab(initialTab);
    }
  }, [initialTab]);

  const handleLogout = () => {
    localStorage.removeItem('ezar_admin_auth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <AdminLayout
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      onLogout={handleLogout}
    >
      {currentTab === 'overview' && <AdminOverviewTab onNavigateTab={setCurrentTab} />}
      {currentTab === 'orders' && <AdminOrdersTab />}
      {currentTab === 'products' && <AdminProductsTab />}
      {currentTab === 'categories' && <AdminCategoriesTab />}
      {currentTab === 'cms' && <AdminContentTab />}
      {currentTab === 'settings' && <AdminSettingsTab />}
    </AdminLayout>
  );
}
