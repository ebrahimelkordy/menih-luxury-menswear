import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Clock } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { products, trendingSearches, recentSearches, type Product } from '@/services/mockData';
import { useRouter } from '@/router';

export function SearchModal() {
  const { isSearchOpen, closeSearch, t, lang, formatPrice } = useApp();
  const { navigate } = useRouter();
  const [query, setQuery] = useState('');
  const [localRecent, setLocalRecent] = useState<string[]>(recentSearches);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => { document.body.style.overflow = ''; };
  }, [isSearchOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.titleAr.includes(query) ||
          p.fabric.toLowerCase().includes(q) ||
          p.category.includes(q) ||
          p.variants.some((v) => v.name.toLowerCase().includes(q)),
      )
      .slice(0, 6);
  }, [query]);

  if (!isSearchOpen) return null;

  const handleProductClick = (p: Product) => {
    setLocalRecent((prev) => [query, ...prev.filter((s) => s !== query)].slice(0, 5));
    navigate({ name: 'product', handle: p.handle });
    closeSearch();
  };

  const handleTrending = (term: { en: string; ar: string }) => {
    setQuery(lang === 'ar' ? term.ar : term.en);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center">
      <div className="absolute inset-0 bg-espresso/40 backdrop-blur-md" onClick={closeSearch} />
      <div className="relative w-full max-w-2xl mt-[10vh] mx-4 bg-ivory rounded-2xl shadow-2xl overflow-hidden animate-fade-up">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-cream">
          <Search className="w-5 h-5 text-espresso/40 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="flex-1 bg-transparent text-base text-espresso placeholder:text-espresso/30 outline-none"
          />
          <button onClick={closeSearch} className="p-1">
            <X className="w-5 h-5 text-espresso/60 hover:text-espresso transition-colors" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {/* Results */}
          {query.trim() && results.length > 0 && (
            <div className="p-4">
              <div className="text-xs font-semibold text-espresso/40 uppercase tracking-wider mb-3">
                {t('search.results')} ({results.length})
              </div>
              <div className="space-y-1">
                {results.map((p) => {
                  const variant = p.variants[0];
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleProductClick(p)}
                      className="flex items-center gap-4 w-full text-left p-2 rounded-xl hover:bg-cream/40 transition-colors group"
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-cream">
                        <img src={variant.image} alt="" className="editorial-image" loading="lazy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-espresso truncate">
                          {lang === 'ar' ? p.titleAr : p.title}
                        </div>
                        <div className="text-xs text-espresso/50 mt-0.5">
                          {lang === 'ar' ? p.categoryAr : p.category} · {formatPrice(p.price)}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {p.variants.slice(0, 4).map((v) => (
                          <div
                            key={v.id}
                            className="w-3 h-3 rounded-full border border-cream"
                            style={{ backgroundColor: v.colorHex }}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* No Results */}
          {query.trim() && results.length === 0 && (
            <div className="p-10 text-center">
              <p className="text-espresso/40 text-sm">{t('search.noResults')}</p>
            </div>
          )}

          {/* Trending & Recent (when no query) */}
          {!query.trim() && (
            <div className="p-5 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-terracotta" />
                  <span className="text-xs font-semibold text-espresso/60 uppercase tracking-wider">
                    {t('search.trending')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((term) => (
                    <button
                      key={term.en}
                      onClick={() => handleTrending(term)}
                      className="px-3 py-1.5 rounded-full bg-cream/60 hover:bg-cream text-xs font-medium text-espresso/70 hover:text-espresso transition-colors"
                    >
                      {lang === 'ar' ? term.ar : term.en}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-espresso/40" />
                    <span className="text-xs font-semibold text-espresso/60 uppercase tracking-wider">
                      {t('search.recent')}
                    </span>
                  </div>
                  <button
                    onClick={() => setLocalRecent([])}
                    className="text-xs text-espresso/40 hover:text-espresso transition-colors"
                  >
                    {t('search.clearRecent')}
                  </button>
                </div>
                <div className="space-y-1">
                  {localRecent.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setQuery(s)}
                      className="block w-full text-left px-3 py-2 text-sm text-espresso/60 hover:text-espresso hover:bg-cream/30 rounded-lg transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
