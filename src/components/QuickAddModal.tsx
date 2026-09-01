import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getProductById } from '@/services/mockData';
import { LazyImage } from '@/components/LazyImage';

export function QuickAddModal() {
  const { quickAddProductId, setQuickAddProduct, t, lang, formatPrice, addToCart } = useApp();
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);

  useEffect(() => {
    if (quickAddProductId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [quickAddProductId]);

  if (!quickAddProductId) return null;
  const product = getProductById(quickAddProductId);
  if (!product) return null;

  const variantsList = product.variants || [];
  const variant = variantsList[selectedVariant] || variantsList[0] || { image: '', colorHex: '#1A1615', inStock: true, name: '', nameAr: '' };
  const inStock = variant.inStock;

  const handleAdd = () => {
    if (!inStock) return;
    addToCart({
      productId: product.id,
      variantId: variant.id,
      size: (product.sizes || [])[selectedSize] || 'Standard',
      quantity: 1,
    });
    setQuickAddProduct(null);
    setSelectedVariant(0);
    setSelectedSize(0);
  };

  const handleClose = () => {
    setQuickAddProduct(null);
    setSelectedVariant(0);
    setSelectedSize(0);
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="fixed inset-0 bg-espresso/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-lg max-h-[92vh] sm:max-h-[88vh] overflow-y-auto bg-ivory rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-fade-up sm:my-auto">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-2/5 aspect-[4/3] sm:aspect-auto bg-cream">
            <LazyImage src={variant.image} alt="" className="editorial-image" />
          </div>
          <div className="flex-1 p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-serif text-lg font-semibold text-espresso leading-tight">
                  {lang === 'ar' ? product.titleAr : product.title}
                </h3>
                <p className="text-xs text-espresso/50 mt-1">
                  {lang === 'ar' ? product.fabricAr : product.fabric}
                </p>
              </div>
              <button onClick={handleClose} className="p-1 -mt-1">
                <X className="w-5 h-5 text-espresso/60 hover:text-espresso transition-colors" />
              </button>
            </div>

            <p className="text-lg font-semibold text-espresso mt-2">{formatPrice(product.price)}</p>
            {product.compareAtPrice && (
              <span className="text-sm text-espresso/40 line-through ml-2">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}

            {/* Color */}
            <div className="mt-4">
              <p className="text-xs font-medium text-espresso/60 mb-2">{t('product.selectColor')}</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(i)}
                    className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                      selectedVariant === i ? 'border-espresso scale-110' : 'border-cream'
                    }`}
                    style={{ backgroundColor: v.colorHex }}
                    title={lang === 'ar' ? v.nameAr : v.name}
                    disabled={!v.inStock}
                  >
                    {!v.inStock && <div className="absolute inset-0 rounded-full bg-ivory/60" />}
                    {selectedVariant === i && (
                      <Check
                        className="w-3 h-3 absolute inset-0 m-auto"
                        style={{ color: ['#F5F2EE', '#E8D5C0', '#F5F0EB', '#D4C5B0', '#D4AFA6'].includes(v.colorHex) ? '#1A1615' : '#FAF8F5' }}
                      />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-espresso/50 mt-1.5">
                {lang === 'ar' ? variant.nameAr : variant.name}
                {!inStock && <span className="text-terracotta ml-1">· {t('product.outOfStock')}</span>}
              </p>
            </div>

            {/* Size */}
            <div className="mt-3">
              <p className="text-xs font-medium text-espresso/60 mb-2">{t('product.selectSize')}</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(i)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      selectedSize === i
                        ? 'bg-espresso text-ivory border-espresso'
                        : 'bg-transparent text-espresso/60 border-cream hover:border-espresso/30'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAdd}
              disabled={!inStock}
              className="w-full mt-5 py-3 bg-espresso text-ivory text-sm font-semibold rounded-full magnetic-btn disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {inStock ? t('product.addToBag') : t('product.outOfStock')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
