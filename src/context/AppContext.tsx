import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Language, Currency } from '@/i18n/translations';
import { translate } from '@/i18n/translations';
import type { CartItem } from '@/services/mockData';
import { fetchCategories, fetchProducts } from '@/services/apiClient';
import {
  products,
  categories,
  getProductById,
  getVariantById,
  formatPrice as formatPriceRaw,
  bundleDiscount,
  freeShippingThreshold,
} from '@/services/mockData';

interface AppContextValue {
  // Language & Currency
  lang: Language;
  setLang: (l: Language) => void;
  toggleLang: () => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  isRTL: boolean;
  t: (key: string, params?: Record<string, string>) => string;
  formatPrice: (price: number) => string;

  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  // Search
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;

  // Mobile Menu
  isMenuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;

  // Quick Add Modal
  quickAddProductId: string | null;
  setQuickAddProduct: (id: string | null) => void;

  // DB State
  dbLoaded: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('EGP');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [quickAddProductId, setQuickAddProductId] = useState<string | null>(null);
  const [dbLoaded, setDbLoaded] = useState(false);

  const isRTL = lang === 'ar';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [lang, isRTL]);

  useEffect(() => {
    async function initDatabase() {
      try {
        // 1. Fetch categories from live Prisma API
        const apiCats = await fetchCategories();
        if (apiCats && apiCats.length > 0) {
          categories.length = 0;
          categories.push(...apiCats);
        }

        // 2. Fetch products from live Prisma API
        const apiProds = await fetchProducts();
        if (apiProds && apiProds.length > 0) {
          products.length = 0;
          products.push(...apiProds);
        }

        console.log('⚡ Connected to PostgreSQL via Prisma API and synced products.');
      } catch (err) {
        console.warn('Prisma API initializing with fallback:', err);
      } finally {
        setDbLoaded(true);
      }
    }

    initDatabase();
  }, []);

  const setLang = useCallback((l: Language) => setLangState(l), []);
  const toggleLang = useCallback(() => setLangState((p) => (p === 'en' ? 'ar' : 'en')), []);

  const t = useCallback(
    (key: string, params?: Record<string, string>) => translate(key, lang, params),
    [lang],
  );

  const formatPrice = useCallback((price: number) => formatPriceRaw(price, currency), [currency]);

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.productId === item.productId && i.variantId === item.variantId && i.size === item.size,
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + item.quantity,
        };
        return updated;
      }
      return [...prev, { ...item, addedAt: Date.now() }];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateQuantity = useCallback((index: number, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], quantity };
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartSubtotal = cart.reduce((sum, item) => {
    const product = getProductById(item.productId);
    if (!product) return sum;
    return sum + product.price * item.quantity;
  }, 0);

  const value: AppContextValue = {
    lang,
    setLang,
    toggleLang,
    currency,
    setCurrency,
    isRTL,
    t,
    formatPrice,
    cart,
    cartCount,
    cartSubtotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    isSearchOpen,
    openSearch: () => setIsSearchOpen(true),
    closeSearch: () => setIsSearchOpen(false),
    isMenuOpen,
    openMenu: () => setIsMenuOpen(true),
    closeMenu: () => setIsMenuOpen(false),
    quickAddProductId,
    setQuickAddProduct: setQuickAddProductId,
    dbLoaded,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export { products, getProductById, getVariantById, bundleDiscount, freeShippingThreshold };
