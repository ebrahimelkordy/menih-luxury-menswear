import { useState, useEffect, useRef } from 'react';
import { Search, ShoppingBag, Menu, Globe, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { categories } from '@/services/mockData';
import { useRouter, type Route } from '@/router';

export function Header() {
  const { t, lang, toggleLang, currency, setCurrency, cartCount, openCart, openSearch, openMenu, isRTL } = useApp();
  const { navigate } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const currencyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setCurrencyOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const go = (r: Route) => {
    navigate(r);
    document.body.style.overflow = '';
  };

  return (
    <>


      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled ? 'frosted-header shadow-[0_1px_20px_rgba(26,22,21,0.06)]' : 'bg-ivory/95 backdrop-blur-md border-b border-cream/50'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-10">
          <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? 'h-16' : 'h-20'}`}>
            
            {/* Left Section: Mobile Menu Trigger & Desktop Navigation */}
            <div className="flex items-center gap-3 lg:gap-6 flex-1 justify-start min-w-0">
              <button
                onClick={openMenu}
                className="lg:hidden p-2 -ml-1 text-espresso rounded-xl hover:bg-cream/60 transition-colors no-tap-highlight"
                aria-label={t('nav.menu')}
              >
                <Menu className="w-5 h-5" />
              </button>

              <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
                <button
                  onClick={() => go({ name: 'shop' })}
                  className="text-sm font-medium text-espresso link-underline whitespace-nowrap py-1"
                >
                  {t('nav.collections')}
                </button>
                {categories.slice(0, 3).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => go({ name: 'shop', category: cat.id })}
                    className="text-sm font-medium text-espresso/70 hover:text-espresso transition-colors link-underline whitespace-nowrap py-1"
                  >
                    {lang === 'ar' ? cat.nameAr : cat.name}
                  </button>
                ))}
                <button
                  onClick={() => go({ name: 'mix-match' })}
                  className="text-sm font-medium text-terracotta hover:text-terracotta-dark transition-colors link-underline whitespace-nowrap py-1"
                >
                  ✦ {t('nav.mixMatch')}
                </button>
              </nav>
            </div>

            {/* Center Section: Brand Identity */}
            <div className="flex-shrink-0 px-2 text-center">
              <button
                onClick={() => go({ name: 'home' })}
                className="flex flex-col items-center no-tap-highlight group"
              >
                <span className="font-serif text-lg sm:text-2xl font-bold tracking-[0.25em] text-espresso leading-none group-hover:text-terracotta transition-colors">
                  MENIH
                </span>
                <span className="text-[8px] sm:text-[9px] tracking-[0.25em] sm:tracking-[0.3em] text-terracotta uppercase mt-0.5 font-medium">
                  {lang === 'ar' ? 'المنيع للرجال' : 'Luxury Menswear'}
                </span>
              </button>
            </div>

            {/* Right Section: Utility Actions */}
            <div className="flex items-center gap-1.5 sm:gap-3 flex-1 justify-end">
              {/* Language Switcher */}
              <button
                onClick={toggleLang}
                className="flex items-center gap-1 text-xs font-semibold text-espresso/80 hover:text-espresso transition-colors no-tap-highlight px-2 py-1.5 rounded-lg hover:bg-cream/50"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="font-sans">{lang === 'en' ? 'العربية' : 'EN'}</span>
              </button>

              {/* Currency Selector (Desktop only) */}
              <div ref={currencyRef} className="relative hidden md:block">
                <button
                  onClick={() => setCurrencyOpen((p) => !p)}
                  className="text-xs font-medium text-espresso/80 hover:text-espresso transition-colors no-tap-highlight px-2 py-1.5 rounded-lg hover:bg-cream/50 font-mono"
                >
                  {currency}
                </button>
                {currencyOpen && (
                  <div className={`absolute top-full mt-2 ${isRTL ? 'left-0' : 'right-0'} glass-panel rounded-xl py-1 min-w-[80px] shadow-xl border border-cream z-50`}>
                    {(['EGP', 'USD'] as const).map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCurrency(c);
                          setCurrencyOpen(false);
                        }}
                        className={`block w-full text-left px-3 py-1.5 text-xs hover:bg-cream transition-colors ${
                          currency === c ? 'text-espresso font-semibold' : 'text-espresso/60'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Track Order Direct Button */}
              <button
                onClick={() => navigate({ name: 'track' })}
                className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-espresso/70 hover:text-espresso transition-colors no-tap-highlight px-2.5 py-1.5 rounded-lg hover:bg-cream/50"
                title={lang === 'ar' ? 'تتبع حالة طلبك' : 'Track Order'}
              >
                <Truck className="w-3.5 h-3.5 text-terracotta" />
                <span className="hidden lg:inline">{lang === 'ar' ? 'تتبع الطلب' : 'Track'}</span>
              </button>

              {/* Search Modal Trigger */}
              <button
                onClick={openSearch}
                className="p-2 text-espresso/80 hover:text-espresso transition-colors no-tap-highlight rounded-xl hover:bg-cream/50"
                aria-label={t('nav.search')}
              >
                <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>

              {/* Shopping Bag Drawer Trigger */}
              <button
                onClick={openCart}
                className="relative p-2 text-espresso/80 hover:text-espresso transition-colors no-tap-highlight rounded-xl hover:bg-cream/50"
                aria-label={t('nav.cart')}
              >
                <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-terracotta text-ivory text-[9px] font-bold rounded-full flex items-center justify-center animate-fade-in shadow-md">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </header>
    </>
  );
}

export function MobileMenu() {
  const { isMenuOpen, closeMenu, t, lang, toggleLang, currency, setCurrency } = useApp();
  const { navigate } = useRouter();

  if (!isMenuOpen) return null;

  const go = (r: Route) => {
    navigate(r);
    closeMenu();
    document.body.style.overflow = '';
  };

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-espresso/50 backdrop-blur-sm animate-fade-in" onClick={closeMenu} />

      {/* Drawer */}
      <div className="relative w-4/5 max-w-sm h-full bg-ivory shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cream">
          <div>
            <span className="font-serif text-xl font-bold tracking-[0.2em] text-espresso">MENIH</span>
            <span className="block text-[9px] tracking-[0.25em] text-terracotta uppercase">
              {lang === 'ar' ? 'المنيع للرجال' : 'Luxury Menswear'}
            </span>
          </div>
          <button onClick={closeMenu} className="p-2 rounded-full hover:bg-cream transition-colors" aria-label={t('nav.close')}>
            <X className="w-5 h-5 text-espresso" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          <button
            onClick={() => go({ name: 'home' })}
            className="block w-full text-left font-serif text-lg font-medium text-espresso hover:text-terracotta transition-colors"
          >
            {lang === 'ar' ? 'الرئيسية' : 'Home'}
          </button>

          <button
            onClick={() => go({ name: 'shop' })}
            className="block w-full text-left font-serif text-lg font-medium text-espresso hover:text-terracotta transition-colors"
          >
            {t('nav.collections')}
          </button>

          <div className="pt-2 pb-2 pl-3 space-y-3 border-l-2 border-cream">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => go({ name: 'shop', category: cat.id })}
                className="block w-full text-left text-sm text-espresso/70 hover:text-espresso transition-colors"
              >
                {lang === 'ar' ? cat.nameAr : cat.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => go({ name: 'mix-match' })}
            className="block w-full text-left font-serif text-lg font-medium text-terracotta hover:text-terracotta-dark transition-colors"
          >
            ✦ {t('nav.mixMatch')}
          </button>

          <button
            onClick={() => go({ name: 'track' })}
            className="block w-full text-left font-serif text-base font-medium text-espresso/80 hover:text-espresso transition-colors pt-2"
          >
            {lang === 'ar' ? 'تتبع حالة طلبك' : 'Track Your Order'}
          </button>

          <button
            onClick={() => go({ name: 'contact' })}
            className="block w-full text-left font-serif text-base font-medium text-espresso/80 hover:text-espresso transition-colors"
          >
            {lang === 'ar' ? 'التواصل والاستقبال الملكي' : 'Royal Concierge & Contact'}
          </button>

          <button
            onClick={() => go({ name: 'admin' })}
            className="block w-full text-left font-serif text-sm font-medium text-espresso/40 hover:text-espresso transition-colors pt-4 border-t border-cream"
          >
            {lang === 'ar' ? 'بوابة الإدارة' : 'Admin Portal'}
          </button>
        </nav>

        {/* Footer Settings */}
        <div className="p-6 border-t border-cream bg-sand/30 flex items-center justify-between">
          <button
            onClick={toggleLang}
            className="flex items-center gap-2 text-xs font-semibold text-espresso hover:text-terracotta transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>{lang === 'en' ? 'العربية' : 'English'}</span>
          </button>

          <div className="flex gap-2">
            {(['EGP', 'USD'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  currency === c
                    ? 'bg-espresso text-ivory font-semibold'
                    : 'bg-cream text-espresso/60 hover:text-espresso'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
