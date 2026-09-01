import { useState } from 'react';
import {
  LayoutDashboard, ShoppingBag, Package, Layers, Sparkles,
  Settings, LogOut, Store, Menu, X, ShieldCheck, ChevronLeft
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export function AdminLayout({ currentTab, onTabChange, onLogout, children }: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'نظرة عامة وإحصائيات', icon: LayoutDashboard },
    { id: 'orders', label: 'الطلبات والمبيعات', icon: ShoppingBag },
    { id: 'products', label: 'المنتجات والمخزون', icon: Package },
    { id: 'categories', label: 'الأقسام والتصنيفات', icon: Layers },
    { id: 'cms', label: 'محتوى وصور الهيرو', icon: Sparkles },
    { id: 'settings', label: 'إعدادات المتجر والخصومات', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-espresso text-ivory flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 bg-espresso-light border-l border-terracotta/20 flex-col justify-between p-6 sticky top-0 h-screen z-30">
        <div>
          {/* Brand */}
          <div className="flex items-center gap-3 pb-6 border-b border-ivory/10">
            <div className="w-11 h-11 rounded-2xl bg-terracotta/15 border border-terracotta/40 flex items-center justify-center text-terracotta shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-serif text-lg font-bold tracking-wide text-ivory">إزار</div>
              <div className="text-[10px] text-terracotta font-mono uppercase tracking-wider">لوحة الإدارة الملكية</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-terracotta text-espresso shadow-lg font-bold'
                      : 'text-ivory/70 hover:text-ivory hover:bg-ivory/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronLeft className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-ivory/10 space-y-2">
          <a
            href="#/"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-ivory/70 hover:text-ivory hover:bg-ivory/5 transition-all"
          >
            <Store className="w-4 h-4 text-terracotta" />
            <span>زيارة المتجر الرئيسي</span>
          </a>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="lg:hidden bg-espresso-light border-b border-terracotta/20 px-5 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-terracotta/15 flex items-center justify-center text-terracotta">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-serif text-sm font-bold text-ivory">لوحة الإدارة • إزار</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-ivory/10 rounded-xl text-ivory"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-espresso-light border-b border-terracotta/20 p-5 space-y-2 animate-fade-down z-30">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive ? 'bg-terracotta text-espresso font-bold' : 'text-ivory/70 hover:bg-ivory/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="pt-3 border-t border-ivory/10 flex justify-between">
              <a href="#/" className="text-xs text-terracotta flex items-center gap-1.5 py-2">
                <Store className="w-4 h-4" />
                المتجر الرئيسي
              </a>
              <button onClick={onLogout} className="text-xs text-red-400 py-2">
                تسجيل الخروج
              </button>
            </div>
          </div>
        )}

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

