import { useState, useEffect } from 'react';
import {
  Search, Package, Truck, CheckCircle2, Clock, AlertCircle,
  Phone, MessageCircle, MapPin, Calendar, ArrowRight, ShieldCheck, RefreshCw
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getAdminOrders, getSiteSettings, type AdminOrder, type SiteSettings, defaultSiteSettings } from '@/services/adminService';
import { useRouter } from '@/router';

export function TrackOrderPage() {
  const { t, lang, formatPrice } = useApp();
  const { navigate } = useRouter();

  const [orderNumberInput, setOrderNumberInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [foundOrder, setFoundOrder] = useState<AdminOrder | null>(null);
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    getSiteSettings().then(setSettings);

    // Read URL hash params if navigated with ?order=...
    const hash = window.location.hash;
    if (hash.includes('?')) {
      const queryParams = new URLSearchParams(hash.split('?')[1]);
      const orderParam = queryParams.get('order');
      const phoneParam = queryParams.get('phone');
      if (orderParam) {
        setOrderNumberInput(orderParam);
        if (phoneParam) setPhoneInput(phoneParam);
        executeSearch(orderParam, phoneParam || '');
      }
    }
  }, []);

  const executeSearch = async (orderNo: string, phone: string) => {
    if (!orderNo.trim()) return;
    setLoading(true);
    setSearched(true);

    try {
      const allOrders = await getAdminOrders();
      const cleanOrderNo = orderNo.trim().toUpperCase();
      const cleanPhone = phone.trim().replace(/[^0-9]/g, '');

      const match = allOrders.find((o) => {
        const matchNo = o.orderNumber.toUpperCase() === cleanOrderNo;
        if (!matchNo) return false;
        if (!cleanPhone) return true;

        const oPhone = o.customerPhone.replace(/[^0-9]/g, '');
        const oWa = (o.customerWhatsapp || '').replace(/[^0-9]/g, '');
        return oPhone.includes(cleanPhone) || oWa.includes(cleanPhone) || cleanPhone.includes(oPhone);
      });

      setFoundOrder(match || null);
    } catch (err) {
      console.error('Error tracking order:', err);
      setFoundOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(orderNumberInput, phoneInput);
  };

  const steps = [
    { key: 'pending', title: 'تم استلام الطلب', titleEn: 'Order Received', desc: 'تم تسجيل تفاصيل طلبك بنجاح وجاري مراجعة المقاسات', icon: Clock },
    { key: 'processing', title: 'قيد التفصيل والتجهيز', titleEn: 'Tailoring & Preparation', desc: 'يقوم خياطو الدار بقص وحياكة القطعة بعناية فائقة', icon: Package },
    { key: 'shipped', title: 'تم الشحن مع المندوب', titleEn: 'Out for Delivery', desc: 'الطلب في طريقه إليك مع خدمة التوصيل المعتمدة', icon: Truck },
    { key: 'delivered', title: 'تم التسليم بنجاح', titleEn: 'Delivered', desc: 'نتمنى أن تنال إعجابكم وتتشرف الدار بخدمتكم دائماً', icon: CheckCircle2 },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'pending': return 0;
      case 'processing': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const currentStepIdx = foundOrder ? getStepIndex(foundOrder.status) : 0;

  const getWhatsAppConciergeLink = () => {
    const wa = (settings.contactWhatsapp || '+201000000000').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `مرحباً خدمة عملاء إزار، أود الاستفسار عن تفاصيل وموعد توصيل طلبي رقم (${foundOrder?.orderNumber || orderNumberInput}).`
    );
    return `https://wa.me/${wa}?text=${text}`;
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-10 max-w-4xl mx-auto space-y-8 animate-fade-up">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand border border-cream text-xs font-semibold text-espresso">
          <Truck className="w-3.5 h-3.5 text-terracotta" />
          <span>{lang === 'ar' ? 'الاستعلام الفوري عن الشحنات والمقاسات' : 'Real-time Order & Tailoring Tracking'}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso">
          {lang === 'ar' ? 'تتبع حالة طلبك الملكي' : 'Track Your Imperial Order'}
        </h1>
        <p className="text-xs sm:text-sm text-espresso/60 max-w-xl mx-auto leading-relaxed">
          {lang === 'ar'
            ? 'لا تحتاج إلى تسجيل حساب أو كلمة مرور. أدخل رقم طلبك ورقم هاتفك للاطلاع الفوري على مرحلة التفصيل وموعد التسليم.'
            : 'No login or password required. Enter your order number and phone to track your bespoke tailoring and delivery progress.'}
        </p>
      </div>

      {/* Search Box */}
      <div className="bg-ivory border border-cream rounded-3xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-espresso mb-1.5">
                {lang === 'ar' ? 'رقم الطلب (Order Number)' : 'Order Number'} *
              </label>
              <input
                type="text"
                required
                value={orderNumberInput}
                onChange={(e) => setOrderNumberInput(e.target.value.toUpperCase())}
                placeholder="مثال: MENIH-849201"
                className="w-full px-4 py-3 bg-sand/30 border border-cream rounded-xl text-sm font-mono font-bold text-espresso placeholder:text-espresso/40 outline-none focus:border-terracotta transition-colors uppercase tracking-wider"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-espresso mb-1.5">
                {lang === 'ar' ? 'رقم الهاتف أو الواتساب المسجل' : 'Phone / WhatsApp Number'}
              </label>
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="+20 1... / +966 5..."
                className="w-full px-4 py-3 bg-sand/30 border border-cream rounded-xl text-sm font-mono text-espresso placeholder:text-espresso/40 outline-none focus:border-terracotta transition-colors"
                dir="ltr"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-espresso text-ivory text-xs sm:text-sm font-bold rounded-2xl hover:bg-espresso-light transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-98"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-terracotta" />
                <span>{lang === 'ar' ? 'جاري البحث عن الشحنة...' : 'Searching...'}</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 text-terracotta" />
                <span>{lang === 'ar' ? 'استعلام عن حالة الطلب' : 'Track Order Status'}</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Result Display */}
      {searched && (
        <>
          {foundOrder ? (
            <div className="bg-ivory border border-cream rounded-3xl p-6 sm:p-8 shadow-md space-y-8 animate-fade-in">
              {/* Order Top Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cream">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xl font-bold text-espresso">{foundOrder.orderNumber}</span>
                    <span className="px-3 py-1 bg-sand border border-cream text-espresso text-xs font-semibold rounded-full">
                      {foundOrder.items.length} {lang === 'ar' ? 'قطع' : 'items'}
                    </span>
                  </div>
                  <div className="text-xs text-espresso/50 mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'تاريخ الطلب:' : 'Date:'} {new Date(foundOrder.createdAt).toLocaleDateString('ar-EG', { dateStyle: 'long' })}</span>
                  </div>
                </div>

                <div className="text-left rtl:text-right sm:text-right rtl:sm:text-left">
                  <div className="text-xs text-espresso/50">{lang === 'ar' ? 'إجمالي الطلب' : 'Total'}</div>
                  <div className="text-xl font-bold text-espresso font-mono">{formatPrice(foundOrder.total)}</div>
                </div>
              </div>

              {/* Status Stepper Timeline */}
              {foundOrder.status === 'cancelled' ? (
                <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-700 text-xs">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-sm">{lang === 'ar' ? 'تم إلغاء هذا الطلب' : 'Order Cancelled'}</div>
                    <div className="text-[11px] opacity-80 mt-0.5">{lang === 'ar' ? 'يرجى التواصل مع خدمة العملاء إذا كنت تعتقد أن هناك خطأ.' : 'Please contact support if needed.'}</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-xs font-bold text-espresso uppercase tracking-wider">
                    {lang === 'ar' ? 'مراحل تنفيذ وشحن طلبك' : 'Delivery Timeline'}
                  </h3>

                  <div className="relative">
                    {/* Stepper on Desktop/Tablet */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                      {steps.map((step, idx) => {
                        const isDone = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;

                        return (
                          <div
                            key={step.key}
                            className={`relative p-4 rounded-2xl border transition-all ${
                              isCurrent
                                ? 'bg-espresso text-ivory border-espresso shadow-lg scale-102'
                                : isDone
                                ? 'bg-sand/60 text-espresso border-cream'
                                : 'bg-cream/20 text-espresso/40 border-cream/50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                                isCurrent
                                  ? 'bg-terracotta text-espresso'
                                  : isDone
                                  ? 'bg-espresso text-ivory'
                                  : 'bg-cream text-espresso/40'
                              }`}>
                                <step.icon className="w-4 h-4" />
                              </div>
                              <span className="text-[10px] font-bold font-mono">0{idx + 1}</span>
                            </div>

                            <div className="font-bold text-xs sm:text-sm leading-snug">
                              {lang === 'ar' ? step.title : step.titleEn}
                            </div>
                            <p className={`text-[11px] mt-1 leading-relaxed ${
                              isCurrent ? 'text-ivory/70' : isDone ? 'text-espresso/60' : 'text-espresso/30'
                            }`}>
                              {step.desc}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Items & Shipping Address Details */}
              <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-cream text-xs">
                {/* Items */}
                <div className="space-y-3">
                  <h4 className="font-bold text-espresso uppercase tracking-wider">{lang === 'ar' ? 'تفاصيل المشتريات' : 'Order Items'}</h4>
                  <div className="space-y-2">
                    {foundOrder.items.map((item, i) => (
                      <div key={i} className="p-3 bg-sand/30 rounded-xl border border-cream flex items-center justify-between">
                        <div>
                          <div className="font-bold text-espresso">{item.productTitle}</div>
                          <div className="text-[11px] text-espresso/50 mt-0.5">
                            {item.variantName && <span>{item.variantName} · </span>}
                            {item.size && <span>{item.size} · </span>}
                            <span>{lang === 'ar' ? `الكمية: ${item.quantity}` : `Qty: ${item.quantity}`}</span>
                          </div>
                        </div>
                        <div className="font-bold text-espresso font-mono">{formatPrice(item.price * item.quantity)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping info */}
                <div className="space-y-3">
                  <h4 className="font-bold text-espresso uppercase tracking-wider">{lang === 'ar' ? 'عنوان وتفاصيل التوصيل' : 'Shipping Destination'}</h4>
                  <div className="p-4 bg-sand/30 rounded-xl border border-cream space-y-2.5">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-terracotta mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-espresso">{foundOrder.customerName}</div>
                        <div className="text-espresso/70 mt-0.5">{foundOrder.customerCity} — {foundOrder.customerAddress}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-espresso/70 pt-2 border-t border-cream/80">
                      <Phone className="w-3.5 h-3.5 text-terracotta" />
                      <span dir="ltr" className="font-mono">{foundOrder.customerPhone}</span>
                    </div>
                  </div>

                  {/* Concierge Action */}
                  <a
                    href={getWhatsAppConciergeLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'محادثة المندوب / الاستفسار عبر الواتساب' : 'Chat with Concierge via WhatsApp'}</span>
                  </a>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-ivory border border-cream rounded-3xl p-8 text-center space-y-3 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-espresso">
                {lang === 'ar' ? 'لم يتم العثور على طلب مطابق' : 'No Matching Order Found'}
              </h3>
              <p className="text-xs text-espresso/60 max-w-md mx-auto leading-relaxed">
                {lang === 'ar'
                  ? 'يرجى التأكد من كتابة رقم الطلب بالشكل الصحيح (مثال: MENIH-849201) أو التواصل معنا مباشرة عبر الواتساب للمساعدة الفورية.'
                  : 'Please check your order number or reach out via WhatsApp for immediate support.'}
              </p>
              <div className="pt-2">
                <a
                  href={getWhatsAppConciergeLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-500 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'المساعدة عبر واتساب الدار' : 'Help via WhatsApp'}</span>
                </a>
              </div>
            </div>
          )}
        </>
      )}

      {/* Trust & Guarantee */}
      <div className="p-6 bg-sand/30 rounded-3xl border border-cream flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-espresso text-ivory flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-5 h-5 text-terracotta" />
          </div>
          <div>
            <div className="text-xs font-bold text-espresso">{lang === 'ar' ? 'ضمان المقاس الملكي والاستبدال المفتوح' : 'Bespoke Fit Guarantee'}</div>
            <div className="text-[11px] text-espresso/50 mt-0.5">{lang === 'ar' ? 'تعديل مجاني أو استبدال كامل في حال وجود أي ملاحظة على المقاس.' : 'Complimentary adjustments if needed.'}</div>
          </div>
        </div>

        <button
          onClick={() => navigate({ name: 'shop' })}
          className="text-xs font-bold text-espresso hover:text-terracotta transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>{lang === 'ar' ? 'متابعة التسوق واستكشاف المجموعات' : 'Continue Shopping'}</span>
          <ArrowRight className="w-3.5 h-3.5 flip-rtl" />
        </button>
      </div>
    </div>
  );
}

