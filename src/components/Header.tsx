import { useState, useEffect, useRef } from 'react';
import { Search, ShoppingBag, Menu, Globe, X, Truck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { categories } from '@/services/mockData';
import { useRouter, type Route } from '@/router';
import { getSiteSettings, getCachedSiteSettings, type SiteSettings, defaultSiteSettings } from '@/services/adminService';

export function Header() {
  const { t, lang, toggleLang, currency, setCurrency, cartCount, openCart, openSearch, openMenu, isRTL } = useApp();
  const { navigate } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(getCachedSiteSettings);
  const currencyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getSiteSettings().then(setSiteSettings);
  }, []);

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
          scrolled ? 'frosted-header shadow-[0_1px_20px_rgba(26,22,21,0.06)]' : 'bg-ivory/0'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className={`flex items-center justify-between gap-4 transition-all duration-500 ${scrolled ? 'h-16' : 'h-20'}`}>
            {/* Left Section: Mobile Menu Button + Concise Nav Links */}
            <div className="flex items-center gap-4 xl:gap-6 min-w-0">
              <button
                onClick={openMenu}
                className="lg:hidden p-1.5 -ml-1.5 text-espresso hover:text-terracotta transition-colors flex-shrink-0 no-tap-highlight cursor-pointer"
                aria-label={t('nav.menu')}
              >
                <Menu className="w-6 h-6" />
              </button>

              <nav className="hidden lg:flex items-center gap-4 xl:gap-6 whitespace-nowrap flex-shrink-0">
                <button
                  onClick={() => go({ name: 'shop' })}
                  className="text-xs xl:text-sm font-semibold text-espresso hover:text-terracotta transition-colors link-underline tracking-wide cursor-pointer"
                >
                  {t('nav.all')}
                </button>
                <button
                  onClick={() => go({ name: 'shop', category: 'thobe' })}
                  className="text-xs xl:text-sm font-medium text-espresso/80 hover:text-espresso transition-colors link-underline cursor-pointer"
                >
                  {lang === 'ar' ? 'ثياب ملكية' : 'Thobes'}
                </button>
                <button
                  onClick={() => go({ name: 'shop', category: 'shemagh' })}
                  className="text-xs xl:text-sm font-medium text-espresso/80 hover:text-espresso transition-colors link-underline cursor-pointer"
                >
                  {lang === 'ar' ? 'أشمغة وغتر' : 'Shemaghs'}
                </button>
                <button
                  onClick={() => go({ name: 'shop', category: 'bisht' })}
                  className="text-xs xl:text-sm font-medium text-espresso/80 hover:text-espresso transition-colors link-underline cursor-pointer"
                >
                  {lang === 'ar' ? 'بشت ملكي' : 'Royal Bisht'}
                </button>
              </nav>
            </div>

            {/* Center Section: Mathematically Centered Luxury Logo */}
            <div className="flex justify-center px-4 flex-shrink-0">
              <button
                onClick={() => go({ name: 'home' })}
                className="flex flex-col items-center no-tap-highlight cursor-pointer group py-1"
              >
                {siteSettings.logoUrl ? (
                  <img
                    src={siteSettings.logoUrl}
                    alt={siteSettings.brandName || 'EZAR'}
                    className="h-10 sm:h-12 md:h-14 w-auto object-contain rounded-md transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <>
                    <span className="font-serif text-xl sm:text-2xl xl:text-3xl font-bold tracking-[0.25em] text-espresso leading-none group-hover:text-terracotta transition-colors">
                      {siteSettings.brandName || 'EZAR'}
                    </span>
                    <span className="text-[8px] sm:text-[9px] xl:text-[10px] tracking-[0.3em] text-terracotta uppercase mt-1 whitespace-nowrap font-medium">
                      {lang === 'ar' ? (siteSettings.brandNameAr || 'إزار للأزياء الفاخرة') : 'Ezar Luxury Menswear'}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Right Section: Mix & Match + Language + Tools */}
            <div className="flex items-center justify-end gap-2.5 sm:gap-4 xl:gap-5 flex-shrink-0">
              {/* Mix & Match Link on Desktop */}
              <button
                onClick={() => go({ name: 'mix-match' })}
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 bg-terracotta/10 hover:bg-terracotta/20 text-terracotta border border-terracotta/30 text-xs font-bold rounded-full transition-all whitespace-nowrap cursor-pointer"
              >
                <span>✨ {t('nav.mixMatch')}</span>
              </button>

              {/* Language Switcher */}
              <button
                onClick={toggleLang}
                className="flex items-center gap-1.5 text-xs font-semibold text-espresso/80 hover:text-espresso transition-colors no-tap-highlight px-2 py-1.5 rounded-xl hover:bg-cream/50 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-terracotta" />
                <span className="tracking-wide">{lang === 'en' ? 'العربية' : 'EN'}</span>
              </button>

              {/* Currency Dropdown */}
              <div ref={currencyRef} className="relative hidden sm:block">
                <button
                  onClick={() => setCurrencyOpen((p) => !p)}
                  className="text-xs font-semibold text-espresso/80 hover:text-espresso transition-colors no-tap-highlight px-2 py-1.5 rounded-xl hover:bg-cream/50 cursor-pointer"
                >
                  {currency}
                </button>
                {currencyOpen && (
                  <div className={`absolute top-full mt-2 ${isRTL ? 'left-0' : 'right-0'} glass-panel rounded-xl py-1 min-w-[90px] shadow-xl z-50`}>
                    {(['EGP', 'USD'] as const).map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCurrency(c);
                          setCurrencyOpen(false);
                        }}
                        className={`block w-full text-left px-3 py-1.5 text-xs hover:bg-cream/50 transition-colors cursor-pointer ${
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
                className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-espresso/70 hover:text-espresso transition-colors no-tap-highlight px-2.5 py-1.5 rounded-lg hover:bg-cream/50 cursor-pointer"
                title={lang === 'ar' ? 'تتبع حالة طلبك' : 'Track Order'}
              >
                <Truck className="w-3.5 h-3.5 text-terracotta" />
                <span className="hidden lg:inline">{lang === 'ar' ? 'تتبع الطلب' : 'Track'}</span>
              </button>

              {/* Search Modal Trigger */}
              <button
                onClick={openSearch}
                className="p-2 text-espresso/80 hover:text-espresso transition-colors no-tap-highlight rounded-xl hover:bg-cream/50 cursor-pointer"
                aria-label={t('nav.search')}
              >
                <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>

              {/* Bag Button */}
              <button
                onClick={openCart}
                className="relative p-2 text-espresso hover:text-terracotta transition-colors no-tap-highlight rounded-xl hover:bg-cream/50 cursor-pointer"
                aria-label={t('nav.cart')}
              >
                <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-terracotta text-espresso text-[9px] font-black rounded-full flex items-center justify-center animate-scale-in shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu siteSettings={siteSettings} />
    </>
  );
}

export function MobileMenu({ siteSettings }: { siteSettings?: SiteSettings }) {
  const { isMenuOpen, closeMenu, t, lang } = useApp();
  const { navigate } = useRouter();
  const [settings, setSettings] = useState<SiteSettings>(siteSettings || getCachedSiteSettings);

  useEffect(() => {
    if (!siteSettings) {
      getSiteSettings().then(setSettings);
    }
  }, [siteSettings]);

  if (!isMenuOpen) return null;

  const go = (r: Route) => {
    navigate(r);
    closeMenu();
    document.body.style.overflow = '';
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-espresso/30 backdrop-blur-sm" onClick={closeMenu} />
      <div className="absolute top-0 bottom-0 left-0 w-[85%] max-w-sm bg-ivory shadow-2xl flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between p-5 border-b border-cream">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt={settings.brandName || 'EZAR'} className="h-9 w-auto object-contain" />
          ) : (
            <span className="font-serif text-lg font-bold text-espresso">{settings.brandName || 'EZAR'}</span>
          )}
          <button onClick={closeMenu} className="p-1 cursor-pointer">
            <X className="w-5 h-5 text-espresso" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-1">
            <button
              onClick={() => go({ name: 'shop' })}
              className="block w-full text-left py-3 text-base font-medium text-espresso border-b border-cream/50 cursor-pointer"
            >
              {t('nav.collections')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => go({ name: 'shop', category: cat.id })}
                className="flex items-center gap-4 w-full text-left py-3 border-b border-cream/50 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 hover-zoom">
                  <img src={cat.image} alt="" className="editorial-image" loading="lazy" />
                </div>
                <div>
                  <div className="text-sm font-medium text-espresso">
                    {lang === 'ar' ? cat.nameAr : cat.name}
                  </div>
                  <div className="text-xs text-espresso/50 mt-0.5">
                    {lang === 'ar' ? cat.descriptionAr : cat.description}
                  </div>
                </div>
              </button>
            ))}
            <button
              onClick={() => go({ name: 'mix-match' })}
              className="block w-full text-left py-3 text-base font-medium text-terracotta border-b border-cream/50 cursor-pointer"
            >
              {t('nav.mixMatch')}
            </button>
            <button
              onClick={() => go({ name: 'track' })}
              className="block w-full text-left py-3 text-base font-medium text-espresso/80 border-b border-cream/50 cursor-pointer"
            >
              {lang === 'ar' ? '📦 تتبع حالة شحنتك' : '📦 Track Your Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
