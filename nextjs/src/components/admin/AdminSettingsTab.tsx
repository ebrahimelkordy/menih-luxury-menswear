import { useState, useEffect } from 'react';
import {
  Tag, Percent, Truck, Phone, Check, Save, Sparkles, Instagram, MessageCircle,
  Facebook, Mail, MapPin, CheckSquare, Square, Image as ImageIcon, RefreshCw,
  Key, Send, Eye, EyeOff, Trash2, ShieldCheck
} from 'lucide-react';
import { getSiteSettings, saveSiteSettings, type SiteSettings, defaultSiteSettings } from '@/services/adminService';

const availableMixMatchCategories = [
  { id: 'thobe', nameAr: 'الثوب والجلابية (Thobe & Gandoura)' },
  { id: 'shemagh', nameAr: 'الشماغ والشال الكشميري (Shemagh & Shawl)' },
  { id: 'bisht', nameAr: 'البشت والمشلح الملكي (Royal Bisht & Cape)' },
  { id: 'accessories', nameAr: 'السبحة والنفائس الملكية (Amber & Gems)' },
  { id: 'fragrances', nameAr: 'دهن العود وعطور الدار (Aged Oud & Perfumes)' },
];

export function AdminSettingsTab() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [loading, setLoading] = useState(true);
  const [savedFeedback, setSavedFeedback] = useState(false);

  // ── Resend API Key state
  const [resendKey, setResendKey] = useState('');
  const [resendConfigured, setResendConfigured] = useState<boolean | null>(null);
  const [resendSaving, setResendSaving] = useState(false);
  const [resendMsg, setResendMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [showResendKey, setShowResendKey] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testSending, setTestSending] = useState(false);

  useEffect(() => {
    getSiteSettings().then((s) => {
      setSettings(s);
      setLoading(false);
    });
    // Check if Resend key is already configured
    fetch('/api/secrets/resend-key')
      .then((r) => r.json())
      .then((d) => setResendConfigured(d.configured ?? false))
      .catch(() => setResendConfigured(false));
  }, []);

  const handleSaveResendKey = async () => {
    if (!resendKey.startsWith('re_')) {
      setResendMsg({ type: 'err', text: 'المفتاح يجب أن يبدأ بـ re_' });
      return;
    }
    setResendSaving(true);
    setResendMsg(null);
    try {
      const res = await fetch('/api/secrets/resend-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: resendKey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResendConfigured(true);
      setResendKey('');
      setResendMsg({ type: 'ok', text: '✅ تم حفظ المفتاح بشكل مشفر بنجاح' });
    } catch (err) {
      setResendMsg({ type: 'err', text: err instanceof Error ? err.message : 'فشل الحفظ' });
    } finally {
      setResendSaving(false);
    }
  };

  const handleDeleteResendKey = async () => {
    if (!confirm('هل أنت متأكد من حذف مفتاح Resend؟ لن تُرسل إيميلات تلقائية بعد الحذف.')) return;
    try {
      await fetch('/api/secrets/resend-key', { method: 'DELETE' });
      setResendConfigured(false);
      setResendMsg({ type: 'ok', text: 'تم حذف المفتاح' });
    } catch {
      setResendMsg({ type: 'err', text: 'فشل الحذف' });
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail) return;
    setTestSending(true);
    setResendMsg(null);
    try {
      const res = await fetch('/api/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResendMsg({ type: 'ok', text: `📧 تم إرسال إيميل تجريبي إلى ${testEmail}` });
    } catch (err) {
      setResendMsg({ type: 'err', text: err instanceof Error ? err.message : 'فشل الإرسال' });
    } finally {
      setTestSending(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSiteSettings(settings);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  const toggleCategory = (catId: string) => {
    const current = settings.mixMatchCategories || ['thobe', 'shemagh', 'bisht', 'accessories', 'fragrances'];
    const exists = current.includes(catId);
    let updated: string[];
    if (exists) {
      if (current.length === 1) {
        alert('يجب الإبقاء على فئة واحدة على الأقل داخل منسق الأطقم.');
        return;
      }
      updated = current.filter((c) => c !== catId);
    } else {
      updated = [...current, catId];
    }
    setSettings({ ...settings, mixMatchCategories: updated });
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-espresso-light/80 border border-terracotta/20 p-5 rounded-3xl shadow-lg">
        <div>
          <h2 className="font-serif text-xl font-bold text-ivory">إعدادات العلامة التجارية واللوجو والمتجر</h2>
          <p className="text-xs text-ivory/50 mt-1">التحكم في اللوجو، اسم البراند، فئات منسق الأطقم، نسب الخصم، ووسائل التواصل المباشر.</p>
        </div>
        {savedFeedback && (
          <div className="px-4 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold rounded-xl flex items-center gap-1.5 animate-fade-in">
            <Check className="w-4 h-4" />
            تم حفظ الإعدادات وتحديث اللوجو بنجاح!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* 0. Brand Identity & Logo Customizer */}
        <div className="bg-espresso-light/80 border border-terracotta/20 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-ivory/10">
            <div className="w-8 h-8 rounded-xl bg-terracotta/15 flex items-center justify-center text-terracotta">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-ivory">شعار المتجر وهوية العلامة التجارية (Brand Logo)</h3>
              <p className="text-[11px] text-ivory/40">تعديل رابط اللوجو وصورة الشعار واسم البراند باللغتين العربية والإنجليزية.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {/* Live Logo Preview Box */}
            <div className="p-4 bg-espresso/90 rounded-2xl border border-ivory/10 flex flex-col items-center justify-center text-center space-y-3">
              <div className="text-xs font-semibold text-ivory/70">المعاينة الحية للوجو في الموقع:</div>
              <div className="w-full h-28 bg-espresso-dark/80 rounded-xl border border-terracotta/30 flex items-center justify-center p-3 relative overflow-hidden">
                {settings.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt="Logo Preview"
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="font-serif text-2xl font-bold tracking-[0.25em] text-terracotta leading-none">
                      {settings.brandName || 'EZAR'}
                    </span>
                    <span className="text-[9px] tracking-[0.3em] text-ivory/80 uppercase mt-1">
                      {settings.brandNameAr || 'إزار'}
                    </span>
                  </div>
                )}
              </div>
              <div className="text-[10px] text-ivory/40">يظهر اللوجو في أعلى شريط التنقل بالموقع وفي القائمة الجانبية للموبايل.</div>
            </div>

            {/* Logo URL and Presets */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-ivory/80 font-semibold mb-1">
                  رابط صورة اللوجو (Logo Image URL):
                </label>
                <input
                  type="text"
                  value={settings.logoUrl || ''}
                  onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                  placeholder="مثال: /images/ezar_logo.jpg أو رابط خارجي https://..."
                  className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory text-xs outline-none focus:border-terracotta font-mono"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, logoUrl: '/images/ezar_logo.jpg' })}
                  className="px-3 py-1.5 bg-terracotta/20 hover:bg-terracotta/30 text-terracotta border border-terracotta/30 rounded-xl text-[11px] font-semibold transition-all cursor-pointer"
                >
                  ✨ لوجو إزار الذهبي المولد (/images/ezar_logo.jpg)
                </button>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, logoUrl: '' })}
                  className="px-3 py-1.5 bg-espresso hover:bg-espresso-light text-ivory/70 border border-ivory/10 rounded-xl text-[11px] font-semibold transition-all cursor-pointer"
                >
                  🖋️ استخدام اللوجو النصي (Typography Logo)
                </button>
              </div>

              {/* Brand Names */}
              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-ivory/70 font-semibold mb-1">اسم العلامة التجارية (English)</label>
                  <input
                    type="text"
                    value={settings.brandName || 'EZAR'}
                    onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-espresso border border-ivory/10 rounded-xl text-ivory text-xs font-semibold outline-none focus:border-terracotta"
                  />
                </div>
                <div>
                  <label className="block text-ivory/70 font-semibold mb-1">اسم العلامة التجارية (العربية)</label>
                  <input
                    type="text"
                    value={settings.brandNameAr || 'إزار'}
                    onChange={(e) => setSettings({ ...settings, brandNameAr: e.target.value })}
                    className="w-full px-3.5 py-2 bg-espresso border border-ivory/10 rounded-xl text-ivory text-xs font-semibold outline-none focus:border-terracotta"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 1. Mix & Match Studio Categories & Discount */}
        <div className="bg-espresso-light/80 border border-terracotta/20 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-ivory/10">
            <div className="w-8 h-8 rounded-xl bg-terracotta/15 flex items-center justify-center text-terracotta">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-ivory">إعدادات منسق الأطقم الملكي (Mix & Match Studio)</h3>
              <p className="text-[11px] text-ivory/40">تحديد الفئات المتاحة للتركيب ونسبة الخصم المباشر المطبقة على الطقم الكامل.</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-ivory/80 font-semibold">
              الفئات المتاحة في منسق الأطقم (Mix & Match Categories):
            </label>
            <div className="grid sm:grid-cols-2 gap-3">
              {availableMixMatchCategories.map((cat) => {
                const isSelected = (settings.mixMatchCategories || []).includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`p-3.5 rounded-2xl border text-right flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-terracotta bg-terracotta/15 text-ivory shadow-xs'
                        : 'border-ivory/10 bg-espresso/60 text-ivory/50 hover:border-ivory/30'
                    }`}
                  >
                    <span className="font-medium text-xs">{cat.nameAr}</span>
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-terracotta flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-ivory/30 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-espresso/60 rounded-2xl border border-ivory/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-ivory text-xs flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-terracotta" />
                نسبة الخصم المئوية لمنسق الأطقم (%)
              </div>
              <div className="text-[11px] text-ivory/40 mt-0.5">تُخصم هذه النسبة تلقائياً عند شراء العميل لكامل قطع الطقم المنسق.</div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="70"
                value={settings.bundleDiscountPercent}
                onChange={(e) => setSettings({ ...settings, bundleDiscountPercent: Number(e.target.value) })}
                className="w-24 px-3 py-2 bg-espresso border border-ivory/10 rounded-xl text-ivory text-center font-bold text-sm outline-none focus:border-terracotta"
              />
              <span className="text-ivory font-bold text-sm">%</span>
            </div>
          </div>
        </div>

        {/* 2. Promos & Promo Code */}
        <div className="bg-espresso-light/80 border border-terracotta/20 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-ivory/10">
            <div className="w-8 h-8 rounded-xl bg-terracotta/15 flex items-center justify-center text-terracotta">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-ivory">كوبون الخصم العام (Promo Code)</h3>
              <p className="text-[11px] text-ivory/40">تفعيل كود الخصم الترويجي وقيمة الخصم في حقيبة التسوق.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-ivory/70 font-semibold mb-1">كود الخصم الفعال (Promo Code)</label>
              <input
                type="text"
                value={settings.promoCode}
                onChange={(e) => setSettings({ ...settings, promoCode: e.target.value.toUpperCase() })}
                placeholder="مثال: EZAR10"
                className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-terracotta font-mono font-bold text-sm tracking-wider uppercase outline-none focus:border-terracotta"
              />
            </div>
            <div>
              <label className="block text-ivory/70 font-semibold mb-1">نسبة الخصم المئوية للكوبون (%)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={settings.promoDiscountPercent}
                onChange={(e) => setSettings({ ...settings, promoDiscountPercent: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory font-bold text-sm outline-none focus:border-terracotta"
              />
            </div>
          </div>
        </div>

        {/* 3. Shipping Rates */}
        <div className="bg-espresso-light/80 border border-terracotta/20 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-ivory/10">
            <div className="w-8 h-8 rounded-xl bg-terracotta/15 flex items-center justify-center text-terracotta">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-ivory">إعدادات الشحن والتوصيل</h3>
              <p className="text-[11px] text-ivory/40">تحديد قيمة الشحن الثابت والحد الأدنى للشحن المجاني الملكي.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-ivory/70 font-semibold mb-1">سعر الشحن الثابت (ج.م / ر.س)</label>
              <input
                type="number"
                value={settings.flatShippingRate}
                onChange={(e) => setSettings({ ...settings, flatShippingRate: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory text-sm font-semibold outline-none focus:border-terracotta"
              />
            </div>
            <div>
              <label className="block text-ivory/70 font-semibold mb-1">الحد الأدنى للشحن المجاني (ج.م / ر.س)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory text-sm font-semibold outline-none focus:border-terracotta"
              />
            </div>
          </div>
        </div>

        {/* 4. Social & Contact Information */}
        <div className="bg-espresso-light/80 border border-terracotta/20 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-ivory/10">
            <div className="w-8 h-8 rounded-xl bg-terracotta/15 flex items-center justify-center text-terracotta">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-ivory">معلومات التواصل والحسابات الرسمية</h3>
              <p className="text-[11px] text-ivory/40">تظهر هذه الروابط والأرقام تلقائياً في الفوتر وصفحة خدمة العملاء والواتساب العائم.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-ivory/70 font-semibold mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-terracotta" />
                رقم هاتف خدمة العملاء
              </label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                placeholder="+20 100 000 0000"
                className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory text-xs outline-none focus:border-terracotta font-mono"
              />
            </div>
            <div>
              <label className="block text-ivory/70 font-semibold mb-1 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                رقم الواتساب الرسمي (WhatsApp)
              </label>
              <input
                type="text"
                value={settings.contactWhatsapp}
                onChange={(e) => setSettings({ ...settings, contactWhatsapp: e.target.value })}
                placeholder="+20 100 000 0000"
                className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory text-xs outline-none focus:border-terracotta font-mono"
              />
            </div>
            <div>
              <label className="block text-ivory/70 font-semibold mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-terracotta" />
                البريد الإلكتروني للدار
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                placeholder="concierge@ezar.com"
                className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory text-xs outline-none focus:border-terracotta font-mono"
              />
            </div>
            <div>
              <label className="block text-ivory/70 font-semibold mb-1 flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                رابط حساب الإنستغرام (Instagram)
              </label>
              <input
                type="url"
                value={settings.instagramUrl}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/ezar"
                className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory text-xs outline-none focus:border-terracotta font-mono"
              />
            </div>
            <div>
              <label className="block text-ivory/70 font-semibold mb-1 flex items-center gap-1.5">
                <Facebook className="w-3.5 h-3.5 text-blue-400" />
                رابط صفحة الفيسبوك (Facebook)
              </label>
              <input
                type="url"
                value={settings.facebookUrl}
                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                placeholder="https://facebook.com/ezar"
                className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory text-xs outline-none focus:border-terracotta font-mono"
              />
            </div>
            <div>
              <label className="block text-ivory/70 font-semibold mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-terracotta" />
                العنوان والمقر بالعربية
              </label>
              <input
                type="text"
                value={settings.addressAr}
                onChange={(e) => setSettings({ ...settings, addressAr: e.target.value })}
                placeholder="شارع السلطان حسين، مصر الجديدة، القاهرة"
                className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory text-xs outline-none focus:border-terracotta"
              />
            </div>
          </div>
        </div>

        {/* Submit Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3.5 bg-terracotta text-espresso text-sm font-bold rounded-2xl hover:bg-terracotta-light transition-all flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>حفظ الإعدادات وتحديث اللوجو فوراً</span>
          </button>
        </div>
      </form>

      {/* ─── Resend Email Service Section ─────────────────────────────────── */}
      <div className="bg-espresso-light/80 border border-terracotta/20 p-6 rounded-3xl shadow-lg space-y-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Mail className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-ivory font-bold text-sm">خدمة الإيميل — Resend</h3>
            <p className="text-ivory/40 text-xs">يُرسل إيميل تأكيد تلقائي للعميل عند كل طلب جديد</p>
          </div>
          {resendConfigured === true && (
            <div className="mr-auto flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              مُكوَّن ومُشفَّر
            </div>
          )}
          {resendConfigured === false && (
            <div className="mr-auto px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-300 text-xs font-semibold">
              غير مُكوَّن
            </div>
          )}
        </div>

        {/* Key Input */}
        <div className="space-y-2">
          <label className="text-ivory/70 text-xs font-semibold flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-terracotta" />
            {resendConfigured ? 'تحديث مفتاح Resend API' : 'إضافة مفتاح Resend API'}
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={showResendKey ? 'text' : 'password'}
                value={resendKey}
                onChange={(e) => setResendKey(e.target.value)}
                placeholder="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory text-xs outline-none focus:border-terracotta font-mono pr-10"
              />
              <button
                type="button"
                onClick={() => setShowResendKey(!showResendKey)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/40 hover:text-ivory/80 transition-colors cursor-pointer"
              >
                {showResendKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <button
              type="button"
              onClick={handleSaveResendKey}
              disabled={resendSaving || !resendKey}
              className="px-4 py-2.5 bg-terracotta text-espresso text-xs font-bold rounded-xl hover:bg-terracotta-light transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {resendSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              حفظ مشفر
            </button>
            {resendConfigured && (
              <button
                type="button"
                onClick={handleDeleteResendKey}
                className="px-3 py-2.5 bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold rounded-xl hover:bg-red-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <p className="text-ivory/30 text-[10px]">المفتاح يُخزَّن مشفراً بـ AES-256 ولا يظهر أبداً في قاعدة البيانات بصيغته الأصلية.</p>
        </div>

        {/* Test Email */}
        {resendConfigured && (
          <div className="space-y-2 border-t border-ivory/10 pt-4">
            <label className="text-ivory/70 text-xs font-semibold flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-blue-400" />
              إرسال إيميل تجريبي للتأكد من الاتصال
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory text-xs outline-none focus:border-blue-400 font-mono"
              />
              <button
                type="button"
                onClick={handleTestEmail}
                disabled={testSending || !testEmail}
                className="px-4 py-2.5 bg-blue-600/80 text-ivory text-xs font-bold rounded-xl hover:bg-blue-500 transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {testSending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                اختبار
              </button>
            </div>
          </div>
        )}

        {/* Feedback */}
        {resendMsg && (
          <div className={`px-4 py-2.5 rounded-xl text-xs font-semibold animate-fade-in ${
            resendMsg.type === 'ok'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {resendMsg.text}
          </div>
        )}
      </div>
    </div>
  );
}
