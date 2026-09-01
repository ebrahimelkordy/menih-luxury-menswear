import { useState, useEffect, useMemo } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, Tag, Truck, Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getProductById, getVariantById, products, freeShippingThreshold } from '@/services/mockData';
import { CheckoutModal } from './CheckoutModal';

export function CartDrawer() {
  const {
    isCartOpen, closeCart, cart, cartSubtotal, cartCount, t, lang, formatPrice,
    removeFromCart, updateQuantity, addToCart,
  } = useApp();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen]);

  // Upsell items: Iqal + Cufflinks
  const upsellItems = useMemo(() => {
    return products.filter((p) => p.id === 'p11' || p.id === 'p12').slice(0, 2);
  }, []);

  const discount = promoApplied ? Math.round(cartSubtotal * 0.1) : 0;
  const remaining = Math.max(0, freeShippingThreshold - cartSubtotal);
  const shippingFree = remaining === 0;
  const shippingCost = shippingFree || cartCount === 0 ? 0 : 50;
  const total = cartSubtotal - discount + shippingCost;

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'MENIH10') {
      setPromoApplied(true);
      setPromoError(false);
    } else {
      setPromoError(true);
      setPromoApplied(false);
    }
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60]">
        <div className="absolute inset-0 bg-espresso/40 backdrop-blur-sm" onClick={closeCart} />
        <div className="absolute top-0 bottom-0 right-0 w-full max-w-md bg-ivory shadow-2xl flex flex-col animate-slide-in-right">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-cream">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-espresso" />
              <span className="font-serif text-lg font-semibold text-espresso">{t('cart.title')}</span>
              {cartCount > 0 && <span className="text-sm text-espresso/40">({cartCount})</span>}
            </div>
            <button onClick={closeCart} className="p-1">
              <X className="w-5 h-5 text-espresso/60 hover:text-espresso transition-colors" />
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-cream/50 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-espresso/30" />
              </div>
              <p className="font-serif text-lg text-espresso mb-1">{t('cart.empty')}</p>
              <p className="text-sm text-espresso/50 mb-6">{t('cart.emptySub')}</p>
              <button
                onClick={closeCart}
                className="px-6 py-3 bg-espresso text-ivory text-sm font-medium rounded-full magnetic-btn"
              >
                {t('cart.continueShopping')}
              </button>
            </div>
          ) : (
            <>
              {/* Free Shipping Progress */}
              <div className="px-5 py-3 bg-cream/30 border-b border-cream/50">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-4 h-4 text-terracotta flex-shrink-0" />
                  <p className="text-xs text-espresso/70">
                    {shippingFree
                      ? t('cart.freeShippingAchieved')
                      : t('cart.freeShippingProgress', {
                          amount: formatPrice(remaining),
                        })}
                  </p>
                </div>
                <div className="h-1.5 bg-cream rounded-full overflow-hidden">
                  <div
                    className="h-full bg-terracotta rounded-full transition-all duration-700 ease-spring"
                    style={{ width: `${Math.min(100, (cartSubtotal / freeShippingThreshold) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {cart.map((item, index) => {
                  const product = getProductById(item.productId);
                  const variant = getVariantById(item.productId, item.variantId);
                  if (!product || !variant) return null;

                  return (
                    <div key={`${item.productId}-${item.variantId}-${item.size}-${index}`} className="flex gap-4 group">
                      <div className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-cream">
                        <img src={variant.image} alt="" className="editorial-image" loading="lazy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-medium text-espresso leading-tight">
                            {lang === 'ar' ? product.titleAr : product.title}
                          </h4>
                          <button
                            onClick={() => removeFromCart(index)}
                            className="p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-espresso/40 hover:text-terracotta transition-colors" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div
                            className="w-3 h-3 rounded-full border border-cream"
                            style={{ backgroundColor: variant.colorHex }}
                          />
                          <span className="text-xs text-espresso/50">
                            {lang === 'ar' ? variant.nameAr : variant.name}
                          </span>
                        </div>
                        <div className="text-xs text-espresso/50 mt-0.5">{item.size}</div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-cream rounded-full">
                            <button
                              onClick={() => updateQuantity(index, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-espresso/60 hover:text-espresso transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-medium text-espresso">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(index, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center text-espresso/60 hover:text-espresso transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-sm font-semibold text-espresso">
                            {formatPrice(product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Upsell */}
                <div className="pt-4 border-t border-cream/50">
                  <p className="text-xs font-semibold text-espresso/60 uppercase tracking-wider mb-3">
                    {t('cart.upsellTitle')}
                  </p>
                  <div className="space-y-2">
                    {upsellItems.map((p) => {
                      const v = p.variants[0];
                      const inCart = cart.some((i) => i.productId === p.id);
                      return (
                        <button
                          key={p.id}
                          disabled={inCart}
                          onClick={() => addToCart({ productId: p.id, variantId: v.id, size: p.sizes[0], quantity: 1 })}
                          className="flex items-center gap-3 w-full p-2 rounded-xl border border-cream/60 hover:border-terracotta/30 hover:bg-cream/20 transition-all group disabled:opacity-40"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-cream">
                            <img src={v.image} alt="" className="editorial-image" loading="lazy" />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <div className="text-xs font-medium text-espresso truncate">
                              {lang === 'ar' ? p.titleAr : p.title}
                            </div>
                            <div className="text-xs text-espresso/50">{formatPrice(p.price)}</div>
                          </div>
                          {inCart ? (
                            <Check className="w-4 h-4 text-olive" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-espresso text-ivory flex items-center justify-center group-hover:bg-terracotta transition-colors">
                              <Plus className="w-4 h-4" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-cream px-5 py-4 space-y-3">
                {/* Promo Code */}
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 border border-cream rounded-full">
                    <Tag className="w-4 h-4 text-espresso/40 flex-shrink-0" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => { setPromoCode(e.target.value); setPromoError(false); }}
                      placeholder={t('cart.promoCode')}
                      className="flex-1 bg-transparent text-xs text-espresso placeholder:text-espresso/30 outline-none"
                    />
                  </div>
                  <button
                    onClick={applyPromo}
                    className="px-4 py-2 bg-espresso text-ivory text-xs font-medium rounded-full magnetic-btn"
                  >
                    {t('cart.applyCode')}
                  </button>
                </div>
                {promoError && <p className="text-xs text-terracotta">Invalid code. Try "TASNEEM10"</p>}
                {promoApplied && <p className="text-xs text-olive flex items-center gap-1"><Check className="w-3 h-3" /> 10% discount applied!</p>}
                <p className="text-[10px] text-espresso/30">Demo code: TASNEEM10</p>

                {/* Totals */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-sm text-espresso/70">
                    <span>{t('cart.subtotal')}</span>
                    <span>{formatPrice(cartSubtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-olive">
                      <span>Discount (10%)</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-espresso/70">
                    <span>{t('cart.shipping')}</span>
                    <span>{shippingCost === 0 ? t('cart.free') : formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-espresso pt-1 border-t border-cream/50">
                    <span>{t('cart.total')}</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setCheckoutOpen(true)}
                  className="w-full py-3.5 bg-espresso text-ivory text-sm font-semibold rounded-full magnetic-btn hover:bg-espresso-light"
                >
                  {t('cart.checkout')} →
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {checkoutOpen && (
        <CheckoutModal
          subtotal={cartSubtotal}
          discount={discount}
          shipping={shippingCost}
          total={total}
          onClose={() => setCheckoutOpen(false)}
        />
      )}
    </>
  );
}
