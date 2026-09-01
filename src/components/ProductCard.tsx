import { useState } from 'react';
import { Plus, Star, Eye } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { type Product } from '@/services/mockData';
import { useRouter } from '@/router';
import { LazyImage } from '@/components/LazyImage';

export function ProductCard({ product }: { product: Product }) {
  const { lang, formatPrice, setQuickAddProduct } = useApp();
  const { navigate } = useRouter();
  const [hoveredVariant, setHoveredVariant] = useState(0);

  const variantsList = product.variants || [];
  const variant = variantsList[hoveredVariant] || variantsList[0] || { image: '', colorHex: '#1A1615', inStock: true };
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.compareAtPrice!) * 100)
    : 0;

  return (
    <div
      className="group cursor-pointer"
      onClick={() => navigate({ name: 'product', handle: product.handle })}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-cream rounded-xl hover-zoom">
        <LazyImage
          src={variant.image}
          alt={lang === 'ar' ? product.titleAr : product.title}
          className="editorial-image"
        />

        {/* Top-left badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <span className="px-2.5 py-1 bg-terracotta text-ivory text-[10px] font-bold rounded-full tracking-wide">
              -{discountPercent}%
            </span>
          )}
          {product.featured && (
            <span className="px-2.5 py-1 bg-espresso/90 backdrop-blur-sm text-ivory text-[10px] font-semibold rounded-full tracking-wide">
              {lang === 'ar' ? 'مميز' : 'Featured'}
            </span>
          )}
          {!variant.inStock && (
            <span className="px-2.5 py-1 bg-ivory/90 backdrop-blur-sm text-espresso text-[10px] font-semibold rounded-full">
              {lang === 'ar' ? 'غير متوفر' : 'Sold Out'}
            </span>
          )}
        </div>

        {/* Quick view button — slides in from top */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate({ name: 'product', handle: product.handle });
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-ivory/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400 hover:bg-espresso hover:text-ivory shadow-md"
          style={{ transform: 'translateY(-8px)', transitionDelay: '0.05s' }}
          aria-label="Quick view"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Quick Add bar — slides up from bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-espresso/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400"
          style={{ transform: 'translateY(100%)' }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickAddProduct(product.id);
            }}
            className="w-full py-2.5 bg-ivory text-espresso text-xs font-semibold rounded-full magnetic-btn flex items-center justify-center gap-1.5 hover:bg-cream"
          >
            <Plus className="w-3.5 h-3.5" />
            {lang === 'ar' ? 'إضافة سريعة' : 'Quick Add'}
          </button>
        </div>

        {/* Variant swatch dots — always visible, hide when quick-add bar shows */}
        {variantsList.length > 1 && (
          <div className="absolute bottom-3 left-3 flex gap-1.5 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
            {variantsList.slice(0, 5).map((v, i) => (
              <button
                key={v.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setHoveredVariant(i);
                }}
                className={`w-4 h-4 rounded-full border-2 transition-all ${
                  hoveredVariant === i ? 'border-ivory scale-125' : 'border-ivory/60'
                }`}
                style={{ backgroundColor: v.colorHex }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-3.5 px-0.5">
        <div className="flex items-center gap-1.5 mb-1">
          <Star className="w-3 h-3 fill-terracotta text-terracotta" />
          <span className="text-xs text-espresso/50">{product.rating}</span>
          <span className="text-xs text-espresso/30">·</span>
          <span className="text-xs text-espresso/40">{product.reviewsCount}</span>
        </div>
        <h3 className="text-sm font-medium text-espresso leading-snug line-clamp-2 group-hover:text-terracotta transition-colors">
          {lang === 'ar' ? product.titleAr : product.title}
        </h3>
        <p className="text-xs text-espresso/40 mt-1">
          {lang === 'ar' ? product.fabricAr : product.fabric}
        </p>

        {/* Color dots */}
        <div className="flex gap-1 mt-2">
          {variantsList.slice(0, 5).map((v) => (
            <div
              key={v.id}
              className="w-3 h-3 rounded-full border border-cream"
              style={{ backgroundColor: v.colorHex }}
            />
          ))}
          {variantsList.length > 5 && (
            <span className="text-[10px] text-espresso/30 ml-0.5">+{variantsList.length - 5}</span>
          )}
        </div>

        <div className="flex items-baseline gap-2 mt-2.5">
          <span className="text-sm font-semibold text-espresso">{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className="text-xs text-espresso/30 line-through">{formatPrice(product.compareAtPrice!)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
