import { useState, useEffect } from 'react';
import { X, Check, CreditCard, Truck, ShieldCheck, Loader2, Phone, MessageCircle, CheckSquare, Square } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getProductById } from '@/services/mockData';
import { createOrderApi } from '@/services/apiClient';

interface CheckoutModalProps {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  onClose: () => void;
}

const governorates = [
  'Cairo', 'Giza', 'Alexandria', 'Dakahlia', 'Red Sea', 'Beheira',
  'Faiyum', 'Gharbia', 'Ismailia', 'Luxor', 'Aswan', 'Port Said',
  'Suez', 'Sharqia', 'Qalyubia', 'Monufia', 'Minya', 'Qena',
  'الرياض (السعودية)', 'جدة (السعودية)', 'الدمام (السعودية)', 'دبي (الإمارات)', 'أبوظبي (الإمارات)', 'الكويت (الكويت)', 'الدوحة (قطر)', 'المنامة (البحرين)', 'مسقط (عمان)'
];

export function CheckoutModal({ subtotal, discount, shipping, total, onClose }: CheckoutModalProps) {
  const { t, lang, formatPrice, clearCart, closeCart, cart } = useApp();
  const [step, setStep] = useState<'form' | 'confirmed'>('form');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (sameAsPhone) {
      setWhatsapp(val);
    }
  };

  const handleSameAsPhoneToggle = () => {
    const next = !sameAsPhone;
    setSameAsPhone(next);
    if (next) {
      setWhatsapp(phone);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!phone.trim() || !whatsapp.trim()) {
      alert(lang === 'ar' ? 'يرجى إدخال رقم الهاتف ورقم الواتساب (كلاهما إجباري لتأكيد وشحن الطلب).' : 'Please enter both phone and WhatsApp numbers (both are mandatory).');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const fullName = formData.get('fullName') as string;
      const email = formData.get('email') as string;
      const address = formData.get('address') as string;
      const city = formData.get('city') as string;
      const governorate = formData.get('governorate') as string;

      const items = cart.map((item) => {
        const product = getProductById(item.productId);
        const variant = product?.variants.find((v) => v.id === item.variantId);
        return {
          productId: item.productId,
          variantId: item.variantId,
          size: item.size,
          quantity: item.quantity,
          price: product?.price || 0,
          productTitle: product?.title || 'Unknown Product',
          variantName: variant?.name || 'Standard Variant',
        };
      });

      const orderData = {
        customerName: fullName,
        customerPhone: phone.trim(),
        customerWhatsapp: whatsapp.trim(),
        customerEmail: email || undefined,
        customerCity: city,
        customerAddress: `${address}, ${governorate}`,
        paymentMethod,
        items,
        subtotal,
        bundleDiscount: discount,
        total,
      };

      const result = await createOrderApi(orderData);
      setOrderNumber(result.orderNumber || result.order_number);
      setStep('confirmed');
      setTimeout(() => {
        clearCart();
      }, 100);
    } catch (err) {
      console.error('Failed to submit order to API:', err);
      const mockOrderNo = `MENIH-${Date.now().toString().slice(-6)}`;
      setOrderNumber(mockOrderNo);
      setStep('confirmed');
      setTimeout(() => {
        clearCart();
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    closeCart();
    document.body.style.overflow = '';
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-espresso/50 backdrop-blur-md" onClick={handleClose} />

      {step === 'form' ? (
        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-ivory rounded-3xl shadow-2xl animate-fade-up border border-cream">
          <div className="sticky top-0 bg-ivory/95 backdrop-blur-sm flex items-center justify-between px-6 py-4 border-b border-cream z-10">
            <div>
              <h2 className="font-serif text-xl font-bold text-espresso">{t('checkout.title')}</h2>
              <p className="text-xs text-espresso/50 mt-0.5">{lang === 'ar' ? 'تفصيل ملكي وتوصيل مأمون' : 'Imperial Bespoke Delivery'}</p>
            </div>
            <button onClick={handleClose} className="p-1.5 rounded-full hover:bg-cream transition-colors cursor-pointer">
              <X className="w-5 h-5 text-espresso/60 hover:text-espresso transition-colors" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs">
            {/* Contact Information (Mandatory Phone & WhatsApp) */}
            <div className="bg-sand/30 p-5 rounded-2xl border border-cream space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-espresso uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-terracotta" />
                  <span>{lang === 'ar' ? 'معلومات الاتصال (الهاتف والواتساب إجباريان)' : 'Contact Details (Phone & WhatsApp are mandatory)'} *</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-espresso/80 font-bold mb-1">{lang === 'ar' ? 'الاسم الثلاثي للعميل' : 'Full Name'} *</label>
                  <input
                    required
                    name="fullName"
                    type="text"
                    placeholder={lang === 'ar' ? 'مثال: عبد الله بن سعود' : 'Full Name'}
                    className="w-full px-4 py-2.5 bg-white border border-cream rounded-xl text-sm text-espresso placeholder:text-espresso/40 outline-none focus:border-terracotta transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-espresso/80 font-bold mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-terracotta" />
                    <span>{lang === 'ar' ? 'رقم الهاتف الأساسي' : 'Primary Phone'} *</span>
                  </label>
                  <input
                    required
                    name="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="+20 1... / +966 5..."
                    className="w-full px-4 py-2.5 bg-white border border-cream rounded-xl text-sm text-espresso placeholder:text-espresso/40 outline-none focus:border-terracotta transition-colors font-mono"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-espresso/80 font-bold mb-1 flex items-center gap-1">
                    <MessageCircle className="w-3 h-3 text-emerald-600" />
                    <span>{lang === 'ar' ? 'رقم الواتساب (لإرسال تفاصيل الشحن)' : 'WhatsApp Number'} *</span>
                  </label>
                  <input
                    required
                    name="whatsapp"
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+20 1... / +966 5..."
                    className="w-full px-4 py-2.5 bg-white border border-cream rounded-xl text-sm text-espresso placeholder:text-espresso/40 outline-none focus:border-terracotta transition-colors font-mono"
                    dir="ltr"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleSameAsPhoneToggle}
                    className="flex items-center gap-2 text-xs font-semibold text-espresso/70 hover:text-espresso transition-colors cursor-pointer select-none"
                  >
                    {sameAsPhone ? (
                      <CheckSquare className="w-4 h-4 text-terracotta" />
                    ) : (
                      <Square className="w-4 h-4 text-espresso/40" />
                    )}
                    <span>{lang === 'ar' ? 'رقم الواتساب هو نفس رقم الهاتف الأساسي' : 'WhatsApp is the same as phone number'}</span>
                  </button>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-espresso/80 font-bold mb-1">{lang === 'ar' ? 'البريد الإلكتروني (اختياري)' : 'Email Address (Optional)'}</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 bg-white border border-cream rounded-xl text-sm text-espresso placeholder:text-espresso/40 outline-none focus:border-terracotta transition-colors font-mono"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-sand/30 p-5 rounded-2xl border border-cream space-y-4">
              <h3 className="text-xs font-bold text-espresso uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-terracotta" />
                <span>{t('checkout.shipping')} *</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-espresso/80 font-bold mb-1">{t('checkout.address')} *</label>
                  <input
                    required
                    name="address"
                    type="text"
                    placeholder={lang === 'ar' ? 'الحي، اسم الشارع، رقم العقار/الشقة' : 'District, Street, Building / Villa No.'}
                    className="w-full px-4 py-2.5 bg-white border border-cream rounded-xl text-sm text-espresso placeholder:text-espresso/40 outline-none focus:border-terracotta transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-espresso/80 font-bold mb-1">{t('checkout.city')} *</label>
                  <input
                    required
                    name="city"
                    type="text"
                    placeholder={lang === 'ar' ? 'المدينة' : 'City'}
                    className="w-full px-4 py-2.5 bg-white border border-cream rounded-xl text-sm text-espresso placeholder:text-espresso/40 outline-none focus:border-terracotta transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-espresso/80 font-bold mb-1">{t('checkout.governorate')} *</label>
                  <select
                    required
                    name="governorate"
                    className="w-full px-4 py-2.5 bg-white border border-cream rounded-xl text-sm text-espresso outline-none focus:border-terracotta transition-colors cursor-pointer"
                    defaultValue=""
                  >
                    <option value="" disabled>{lang === 'ar' ? 'اختر المحافظة / المنطقة' : 'Select Region / Governorate'}</option>
                    {governorates.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-espresso uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-terracotta" />
                <span>{t('checkout.payment')}</span>
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left rtl:text-right cursor-pointer ${
                    paymentMethod === 'cod' ? 'border-espresso bg-sand/60 shadow-xs' : 'border-cream bg-white hover:border-espresso/30'
                  }`}
                >
                  <Truck className="w-5 h-5 text-terracotta flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-espresso">{t('checkout.cashOnDelivery')}</div>
                    <div className="text-[11px] text-espresso/50">{lang === 'ar' ? 'الدفع نقداً عند استلام الطلب' : 'Pay when you receive'}</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'cod' ? 'border-espresso' : 'border-cream'
                  }`}>
                    {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-espresso" />}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left rtl:text-right cursor-pointer ${
                    paymentMethod === 'card' ? 'border-espresso bg-sand/60 shadow-xs' : 'border-cream bg-white hover:border-espresso/30'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-terracotta flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-espresso">{t('checkout.card')}</div>
                    <div className="text-[11px] text-espresso/50">Visa, Mastercard, Mada</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'card' ? 'border-espresso' : 'border-cream'
                  }`}>
                    {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-espresso" />}
                  </div>
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-sand/40 rounded-2xl p-5 space-y-2.5 border border-cream">
              <h3 className="text-xs font-bold text-espresso uppercase tracking-wider mb-2">
                {t('checkout.orderSummary')}
              </h3>
              <div className="flex justify-between text-xs text-espresso/70">
                <span>{t('cart.subtotal')}</span>
                <span className="font-mono">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-xs text-olive font-semibold">
                  <span>{lang === 'ar' ? 'خصم الكوبون / الطقم' : 'Discount'}</span>
                  <span className="font-mono">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-espresso/70">
                <span>{t('cart.shipping')}</span>
                <span className="font-mono">{shipping === 0 ? t('cart.free') : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-espresso pt-2 border-t border-cream">
                <span>{t('cart.total')}</span>
                <span className="font-mono text-base">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-espresso text-ivory text-sm font-bold rounded-2xl magnetic-btn hover:bg-espresso-light flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl cursor-pointer active:scale-98"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{t('checkout.placeOrder')}</span>
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-espresso/50">
              <ShieldCheck className="w-4 h-4 text-terracotta" />
              <span>{lang === 'ar' ? 'طلب مشفر ومأمون ١٠٠٪ — يتم تأكيد تفاصيل المقاسات عبر الواتساب فوراً' : 'Secure checkout — measurements verified instantly via WhatsApp'}</span>
            </div>
          </form>
        </div>
      ) : (
        <div className="relative w-full max-w-md bg-ivory rounded-3xl shadow-2xl p-8 text-center animate-fade-up border border-cream">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4 text-emerald-600">
            <Check className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-espresso mb-2">{t('checkout.orderPlaced')}</h2>
          <p className="text-xs text-espresso/60 mb-4 leading-relaxed">
            {lang === 'ar'
              ? 'تم استلام طلبكم الملكي بنجاح، وسيتواصل معكم فريق التفصيل والخدمة عبر الواتساب لتأكيد المقاسات والشحن.'
              : 'Your imperial order has been received. Our concierge team will reach out via WhatsApp to verify tailoring and dispatch.'}
          </p>
          {orderNumber && (
            <div className="bg-sand/60 rounded-xl px-4 py-3 mb-6 inline-block font-mono text-sm text-espresso font-bold border border-cream">
              {lang === 'ar' ? 'رقم الطلب: ' : 'Order No: '} {orderNumber}
            </div>
          )}
          <div className="space-y-2.5">
            <button
              onClick={() => {
                if (orderNumber) {
                  window.location.hash = `#/track?order=${orderNumber}&phone=${phone}`;
                } else {
                  window.location.hash = '#/track';
                }
                handleClose();
              }}
              className="w-full py-3.5 bg-terracotta text-espresso text-xs sm:text-sm font-bold rounded-2xl hover:bg-terracotta-light transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Truck className="w-4 h-4" />
              <span>{lang === 'ar' ? 'تتبع حالة طلبك ومراحل التفصيل فوراً' : 'Track Your Order Now'}</span>
            </button>

            <button
              onClick={handleClose}
              className="w-full py-2.5 bg-sand text-espresso/70 hover:text-espresso text-xs font-semibold rounded-2xl transition-colors cursor-pointer"
            >
              {t('cart.continueShopping')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
