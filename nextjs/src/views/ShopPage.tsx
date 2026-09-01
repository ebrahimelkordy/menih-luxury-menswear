import { useState, useMemo, useEffect } from 'react';
import { SlidersHorizontal, LayoutGrid, Rows3, X, Check, ChevronDown } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import {
  products, categories, fabricTypes, colorFamilyLabels,
  type Category, type ProductVariant,
} from '@/services/mockData';
import { useRouter } from '@/router';
import { ProductCard } from '@/components/ProductCard';

type SortOption = 'featured' | 'priceLow' | 'priceHigh' | 'rating' | 'newest';
type GridLayout = 'editorial' | 'compact';

export function ShopPage({ category }: { category?: string }) {
  const { t, lang, formatPrice } = useApp();
  const { navigate } = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(category);
  const [colorFamilies, setColorFamilies] = useState<Set<string>>(new Set());
  const [materials, setMaterials] = useState<Set<string>>(new Set());
  const [sizes, setSizes] = useState<Set<string>>(new Set());
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>('featured');
  const [gridLayout, setGridLayout] = useState<GridLayout>('editorial');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  useEffect(() => {
    setSelectedCategory(category);
  }, [category]);

  const allSizes = useMemo(() => {
    const s = new Set<string>();
    products.forEach((p) => p.sizes.forEach((sz) => s.add(sz)));
    return Array.from(s);
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (colorFamilies.size > 0) {
      result = result.filter((p) =>
        p.variants.some((v) => colorFamilies.has(v.colorFamily)),
      );
    }
    if (materials.size > 0) {
      result = result.filter((p) => materials.has(p.fabric));
    }
    if (sizes.size > 0) {
      result = result.filter((p) => p.sizes.some((s) => sizes.has(s)));
    }
    if (inStockOnly) {
      result = result.filter((p) => p.variants.some((v) => v.inStock));
    }
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sort) {
      case 'priceLow':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.reverse();
        break;
      default:
        result.sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return result;
  }, [selectedCategory, colorFamilies, materials, sizes, inStockOnly, priceRange, sort]);

  const activeFilterCount =
    colorFamilies.size + materials.size + sizes.size + (inStockOnly ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0);

  const toggleSet = (set: Set<string>, value: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  };

  const clearAll = () => {
    setColorFamilies(new Set());
    setMaterials(new Set());
    setSizes(new Set());
    setInStockOnly(false);
    setPriceRange([0, 10000]);
  };

  const activeCategory = categories.find((c) => c.id === selectedCategory);

  const sortOptions: { id: SortOption; label: string }[] = [
    { id: 'featured', label: t('sort.featured') },
    { id: 'priceLow', label: t('sort.priceLow') },
    { id: 'priceHigh', label: t('sort.priceHigh') },
    { id: 'rating', label: t('sort.rating') },
    { id: 'newest', label: t('sort.newest') },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-espresso/40 mb-3">
          <button onClick={() => navigate({ name: 'home' })} className="hover:text-espresso transition-colors">
            {lang === 'ar' ? 'الرئيسية' : 'Home'}
          </button>
          <span>/</span>
          <span className="text-espresso/70">
            {activeCategory ? (lang === 'ar' ? activeCategory.nameAr : activeCategory.name) : (lang === 'ar' ? 'كل المنتجات' : 'All Products')}
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-espresso">
          {activeCategory ? (lang === 'ar' ? activeCategory.nameAr : activeCategory.name) : (lang === 'ar' ? 'المجموعة' : 'The Collection')}
        </h1>
        {activeCategory && (
          <p className="mt-2 text-sm text-espresso/50">
            {lang === 'ar' ? activeCategory.descriptionAr : activeCategory.description}
          </p>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2 mb-6">
        <button
          onClick={() => { setSelectedCategory(undefined); navigate({ name: 'shop' }); }}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            !selectedCategory ? 'bg-espresso text-ivory' : 'bg-cream/40 text-espresso/60 hover:bg-cream/60'
          }`}
        >
          {lang === 'ar' ? 'الكل' : 'All'}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCategory(cat.id); navigate({ name: 'shop', category: cat.id }); }}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat.id ? 'bg-espresso text-ivory' : 'bg-cream/40 text-espresso/60 hover:bg-cream/60'
            }`}
          >
            {lang === 'ar' ? cat.nameAr : cat.name}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <button
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 px-4 py-2 border border-cream rounded-full text-sm font-medium text-espresso hover:border-espresso/30 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {t('filter.title')}
          {activeFilterCount > 0 && (
            <span className="bg-espresso text-ivory text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-espresso/40 hidden sm:block">
            {filtered.length} {t('filter.results')}
          </span>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setShowSort((p) => !p)}
              className="flex items-center gap-1.5 text-sm text-espresso/70 hover:text-espresso transition-colors"
            >
              {t('filter.sortBy')}: <span className="font-medium">{sortOptions.find((s) => s.id === sort)?.label}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {showSort && (
              <div className="absolute top-full mt-2 right-0 glass-panel rounded-xl py-1 min-w-[180px] shadow-lg z-30">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => { setSort(opt.id); setShowSort(false); }}
                    className={`flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-cream/40 transition-colors ${
                      sort === opt.id ? 'text-espresso font-medium' : 'text-espresso/60'
                    }`}
                  >
                    {opt.label}
                    {sort === opt.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grid Toggle */}
          <div className="hidden sm:flex items-center gap-1 border border-cream rounded-full p-0.5">
            <button
              onClick={() => setGridLayout('editorial')}
              className={`p-1.5 rounded-full transition-colors ${gridLayout === 'editorial' ? 'bg-espresso text-ivory' : 'text-espresso/40'}`}
            >
              <Rows3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridLayout('compact')}
              className={`p-1.5 rounded-full transition-colors ${gridLayout === 'compact' ? 'bg-espresso text-ivory' : 'text-espresso/40'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {Array.from(colorFamilies).map((f) => (
            <FilterChip key={f} label={lang === 'ar' ? colorFamilyLabels[f as ProductVariant['colorFamily']].ar : colorFamilyLabels[f as ProductVariant['colorFamily']].en} onRemove={() => toggleSet(colorFamilies, f, setColorFamilies)} />
          ))}
          {Array.from(sizes).map((s) => (
            <FilterChip key={s} label={s} onRemove={() => toggleSet(sizes, s, setSizes)} />
          ))}
          {inStockOnly && (
            <FilterChip label={t('filter.inStock')} onRemove={() => setInStockOnly(false)} />
          )}
          <button onClick={clearAll} className="text-xs text-terracotta hover:underline">
            {t('filter.clearAll')}
          </button>
        </div>
      )}

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-espresso/40 text-sm mb-4">{t('search.noResults')}</p>
          <button onClick={clearAll} className="px-6 py-2.5 bg-espresso text-ivory text-sm font-semibold rounded-full">
            {t('filter.clearAll')}
          </button>
        </div>
      ) : (
        <div className={gridLayout === 'editorial' ? 'grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6' : 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4'}>
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {/* Filter Drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-espresso/40 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="absolute top-0 bottom-0 left-0 w-full max-w-sm bg-ivory shadow-2xl flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between px-5 py-4 border-b border-cream">
              <h3 className="font-serif text-lg font-semibold text-espresso">{t('filter.title')}</h3>
              <button onClick={() => setShowFilters(false)} className="p-1">
                <X className="w-5 h-5 text-espresso/60" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Color Family */}
              <FilterSection title={t('filter.color')}>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(colorFamilyLabels).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => toggleSet(colorFamilies, key, setColorFamilies)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium border-2 transition-all ${
                        colorFamilies.has(key) ? 'border-espresso bg-cream/20' : 'border-cream'
                      }`}
                    >
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: val.hex }} />
                      {lang === 'ar' ? val.ar : val.en}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Material */}
              <FilterSection title={t('filter.material')}>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {fabricTypes.filter((f) => f.id !== 'all').map((f) => (
                    <label key={f.id} className="flex items-center gap-2.5 cursor-pointer py-1.5">
                      <button
                        onClick={() => toggleSet(materials, f.id, setMaterials)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          materials.has(f.id) ? 'border-espresso bg-espresso' : 'border-cream'
                        }`}
                      >
                        {materials.has(f.id) && <Check className="w-3 h-3 text-ivory" />}
                      </button>
                      <span className="text-sm text-espresso/70">{lang === 'ar' ? f.nameAr : f.name}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Size */}
              <FilterSection title={t('filter.size')}>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleSet(sizes, s, setSizes)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${
                        sizes.has(s) ? 'border-espresso bg-cream/20' : 'border-cream'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Price */}
              <FilterSection title={t('filter.price')}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-espresso/60">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10000}
                    step={100}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </FilterSection>

              {/* In Stock */}
              <FilterSection title="">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium text-espresso">{t('filter.inStock')}</span>
                  <button
                    onClick={() => setInStockOnly((p) => !p)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${inStockOnly ? 'bg-espresso' : 'bg-cream'}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-ivory transition-all ${inStockOnly ? 'left-0.5' : 'left-5'}`} />
                  </button>
                </label>
              </FilterSection>
            </div>

            <div className="border-t border-cream p-4 flex gap-3">
              <button
                onClick={clearAll}
                className="flex-1 py-2.5 border border-cream rounded-full text-sm font-medium text-espresso/60 hover:border-espresso/30 transition-colors"
              >
                {t('filter.clearAll')}
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 py-2.5 bg-espresso text-ivory rounded-full text-sm font-semibold magnetic-btn"
              >
                {t('filter.apply')} ({filtered.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cream/40 rounded-full text-xs font-medium text-espresso">
      {label}
      <button onClick={onRemove} className="p-0.5">
        <X className="w-3 h-3 text-espresso/50" />
      </button>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  if (!title) return <div>{children}</div>;
  return (
    <div>
      <h4 className="text-xs font-semibold text-espresso/60 uppercase tracking-wider mb-3">{title}</h4>
      {children}
    </div>
  );
}
