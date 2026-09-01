import { useState, useEffect } from 'react';
import {
  Sparkles, Image as ImageIcon, Type, MessageSquare, Quote,
  Check, Plus, Trash2, Edit, X, Star, Save
} from 'lucide-react';
import {
  getSiteSettings, saveSiteSettings, getAdminTestimonials,
  saveTestimonial, deleteTestimonial, type SiteSettings, type TestimonialItem,
  defaultSiteSettings
} from '@/services/adminService';
import { heroImages } from '@/services/mockData';

export function AdminContentTab() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Testimonial Modal State
  const [isTestiModalOpen, setIsTestiModalOpen] = useState(false);
  const [editingTesti, setEditingTesti] = useState<TestimonialItem | null>(null);
  const [testiForm, setTestiForm] = useState<{
    name: string;
    nameAr: string;
    city: string;
    cityAr: string;
    review: string;
    reviewAr: string;
    rating: number;
    image: string;
  }>({
    name: '',
    nameAr: '',
    city: '',
    cityAr: '',
    review: '',
    reviewAr: '',
    rating: 5,
    image: heroImages.bishtRoyal,
  });

  useEffect(() => {
    Promise.all([getSiteSettings(), getAdminTestimonials()]).then(([s, t]) => {
      setSettings(s);
      setTestimonials(t);
      setLoading(false);
    });
  }, []);



  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSiteSettings(settings);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const openAddTesti = () => {
    setEditingTesti(null);
    setTestiForm({
      name: '',
      nameAr: '',
      city: 'Riyadh',
      cityAr: 'الرياض',
      review: '',
      reviewAr: '',
      rating: 5,
      image: heroImages.bishtRoyal,
    });
    setIsTestiModalOpen(true);
  };

  const openEditTesti = (item: TestimonialItem) => {
    setEditingTesti(item);
    setTestiForm({
      name: item.name,
      nameAr: item.nameAr,
      city: item.city,
      cityAr: item.cityAr,
      review: item.review,
      reviewAr: item.reviewAr,
      rating: item.rating,
      image: item.image || heroImages.bishtRoyal,
    });
    setIsTestiModalOpen(true);
  };

  const handleSaveTesti = async (e: React.FormEvent) => {
    e.preventDefault();
    const saved = await saveTestimonial({
      id: editingTesti?.id,
      ...testiForm,
      displayOrder: editingTesti?.displayOrder || testimonials.length + 1,
    });

    setTestimonials((prev) => {
      const idx = prev.findIndex((t) => t.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [...prev, saved];
    });

    setIsTestiModalOpen(false);
  };

  const handleDeleteTesti = async (id: string) => {
    if (window.confirm('هل تريد بالتأكيد حذف هذا التقييم؟')) {
      await deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const presetImages = [
    { label: 'الثوب والجلابية الملكية (Mannequin Thobe)', path: '/images/thobe-gandoura.jpg' },
    { label: 'البشت النجدي الملكي (Royal Bisht)', path: '/images/bisht-royal.jpg' },
    { label: 'الشماغ والشال الكشميري (Kashmiri Shemagh)', path: '/images/shemagh-kashmiri.jpg' },
    { label: 'دهن العود وعطور الدار (Dehn Oud & Perfume)', path: '/images/oud-perfume.jpg' },
    { label: 'السبحة والنفائس الملكية (Tasbih & Accessories)', path: '/images/tasbih-agate-ring.jpg' },
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-espresso-light/80 border border-terracotta/20 p-5 rounded-3xl shadow-lg">
        <div>
          <h2 className="font-serif text-xl font-bold text-ivory">إدارة نصوص وصور ومحتوى الموقع (CMS)</h2>
          <p className="text-xs text-ivory/50 mt-1">تعديل بنر الهيرو، النصوص الترويجية، شريط الماركي، آراء العملاء والاقتباسات.</p>
        </div>
        {savedFeedback && (
          <div className="px-4 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold rounded-xl flex items-center gap-1.5 animate-fade-in">
            <Check className="w-4 h-4" />
            تم حفظ التعديلات بنجاح!
          </div>
        )}
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8 text-xs">
        {/* 1. Hero Section CMS */}
        <div className="bg-espresso-light/80 border border-terracotta/20 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-ivory/10">
            <div className="w-8 h-8 rounded-xl bg-terracotta/15 flex items-center justify-center text-terracotta">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-ivory">قسم الهيرو الرئيسي (Hero Section)</h3>
              <p className="text-[11px] text-ivory/40">التحكم بالصورة الخلفية، العناوين الرئيسية، وأزرار التوجيه.</p>
            </div>
          </div>

          {/* Hero Image Selection */}
          <div>
            <label className="block text-ivory/70 font-semibold mb-2">صورة خلفية الهيرو (Hero Image)</label>
            <div className="grid sm:grid-cols-3 gap-3 mb-3">
              {presetImages.map((img) => (
                <button
                  key={img.path}
                  type="button"
                  onClick={() => setSettings({ ...settings, heroImage: img.path })}
                  className={`p-2 rounded-2xl border-2 text-right transition-all flex items-center gap-3 cursor-pointer ${
                    settings.heroImage === img.path ? 'border-terracotta bg-terracotta/10 ring-2 ring-terracotta/20' : 'border-ivory/10 bg-espresso hover:border-ivory/30'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-espresso flex-shrink-0">
                    <img src={img.path} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-[11px] font-semibold text-ivory line-clamp-1">{img.label}</div>
                </button>
              ))}
            </div>
            <input
              type="text"
              value={settings.heroImage}
              onChange={(e) => setSettings({ ...settings, heroImage: e.target.value })}
              placeholder="أو أدخل مسار صورة مخصصة..."
              className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory font-mono text-[11px] outline-none focus:border-terracotta"
              dir="ltr"
            />
          </div>

          {/* Hero Titles */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-ivory/70 font-semibold mb-1">العنوان الرئيسي للهيرو (عربي)</label>
              <textarea
                rows={2}
                value={settings.heroTitleAr}
                onChange={(e) => setSettings({ ...settings, heroTitleAr: e.target.value })}
                className="w-full px-4 py-2 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta resize-none font-serif text-sm"
              />
            </div>
            <div>
              <label className="block text-ivory/70 font-semibold mb-1">العنوان الرئيسي للهيرو (English)</label>
              <textarea
                rows={2}
                value={settings.heroTitle}
                onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                className="w-full px-4 py-2 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta resize-none font-serif text-sm text-left"
                dir="ltr"
              />
            </div>
          </div>

          {/* Hero Tagline & Subtitles */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-ivory/70 font-semibold mb-1">الشعار والوصف الترحيبي (عربي)</label>
              <textarea
                rows={3}
                value={settings.heroSubtitleAr}
                onChange={(e) => setSettings({ ...settings, heroSubtitleAr: e.target.value })}
                className="w-full px-4 py-2 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta resize-none"
              />
            </div>
            <div>
              <label className="block text-ivory/70 font-semibold mb-1">الشعار والوصف الترحيبي (English)</label>
              <textarea
                rows={3}
                value={settings.heroSubtitle}
                onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                className="w-full px-4 py-2 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta resize-none text-left"
                dir="ltr"
              />
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-ivory/70 font-semibold mb-1">نص زر الدعوة للإجراء (عربي)</label>
              <input
                type="text"
                value={settings.heroCtaTextAr}
                onChange={(e) => setSettings({ ...settings, heroCtaTextAr: e.target.value })}
                className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta"
              />
            </div>
            <div>
              <label className="block text-ivory/70 font-semibold mb-1">نص زر الدعوة للإجراء (English)</label>
              <input
                type="text"
                value={settings.heroCtaText}
                onChange={(e) => setSettings({ ...settings, heroCtaText: e.target.value })}
                className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta text-left"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* 2. Marquee Ticker CMS */}
        <div className="bg-espresso-light/80 border border-terracotta/20 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-ivory/10">
            <div className="w-8 h-8 rounded-xl bg-terracotta/15 flex items-center justify-center text-terracotta">
              <Type className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-ivory">شريط الإعلانات والماركي المتحرك</h3>
              <p className="text-[11px] text-ivory/40">النصوص الترويجية المتحركة أسفل الهيرو وفي أعلى الصفحة.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-ivory/70 font-semibold mb-1">نص الماركي بالعربية</label>
              <input
                type="text"
                value={settings.marqueeTextAr}
                onChange={(e) => setSettings({ ...settings, marqueeTextAr: e.target.value })}
                className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta"
              />
            </div>
            <div>
              <label className="block text-ivory/70 font-semibold mb-1">نص الشريط الذهبي الترويجي (عربي)</label>
              <input
                type="text"
                value={settings.goldBannerTextAr || ''}
                onChange={(e) => setSettings({ ...settings, goldBannerTextAr: e.target.value })}
                placeholder="تفصيل ملكي مخصص • شحن مجاني للطلبات أكثر من ٢٠٠٠ ج.م"
                className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta"
              />
            </div>
            <div>
              <label className="block text-ivory/70 font-semibold mb-1">نص الشريط الذهبي الترويجي (English)</label>
              <input
                type="text"
                value={settings.goldBannerText || ''}
                onChange={(e) => setSettings({ ...settings, goldBannerText: e.target.value })}
                placeholder="Bespoke Royal Tailoring • Free Luxury Shipping"
                className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta text-left"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-ivory/70 font-semibold mb-1">نص الماركي بالإنجليزية</label>
              <input
                type="text"
                value={settings.marqueeText}
                onChange={(e) => setSettings({ ...settings, marqueeText: e.target.value })}
                className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta text-left"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* 3. Editorial Quote CMS */}
        <div className="bg-espresso-light/80 border border-terracotta/20 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-ivory/10">
            <div className="w-8 h-8 rounded-xl bg-terracotta/15 flex items-center justify-center text-terracotta">
              <Quote className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-ivory">اقتباس وهوية الدار (Editorial Quote)</h3>
              <p className="text-[11px] text-ivory/40">الرسالة الملكية المعروضة في قسم الحرفية بالصفحة الرئيسية.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-ivory/70 font-semibold mb-1">نص الاقتباس (عربي)</label>
              <textarea
                rows={3}
                value={settings.editorialQuoteAr}
                onChange={(e) => setSettings({ ...settings, editorialQuoteAr: e.target.value })}
                className="w-full px-4 py-2 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta resize-none"
              />
            </div>
            <div>
              <label className="block text-ivory/70 font-semibold mb-1">نص الاقتباس (English)</label>
              <textarea
                rows={3}
                value={settings.editorialQuote}
                onChange={(e) => setSettings({ ...settings, editorialQuote: e.target.value })}
                className="w-full px-4 py-2 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta resize-none text-left"
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-ivory/70 font-semibold mb-1">اسم القائل / الصفة (عربي)</label>
              <input
                type="text"
                value={settings.quoteAuthorAr}
                onChange={(e) => setSettings({ ...settings, quoteAuthorAr: e.target.value })}
                className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta"
              />
            </div>
            <div>
              <label className="block text-ivory/70 font-semibold mb-1">اسم القائل / الصفة (English)</label>
              <input
                type="text"
                value={settings.quoteAuthor}
                onChange={(e) => setSettings({ ...settings, quoteAuthor: e.target.value })}
                className="w-full px-4 py-2.5 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta text-left"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* Global Save Button */}
        <div className="flex justify-end sticky bottom-6 z-20">
          <button
            type="submit"
            className="px-8 py-3.5 bg-terracotta text-espresso font-bold text-sm rounded-2xl hover:bg-terracotta-light transition-all flex items-center gap-2 shadow-2xl cursor-pointer"
          >
            <Save className="w-4 h-4" />
            حفظ كافة تعديلات المحتوى
          </button>
        </div>
      </form>

      {/* 4. Testimonials Manager */}
      <div className="bg-espresso-light/80 border border-terracotta/20 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-ivory/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-terracotta/15 flex items-center justify-center text-terracotta">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-ivory">آراء وشهادات العملاء (Testimonials)</h3>
              <p className="text-[11px] text-ivory/40">إضافة وتعديل مراجعات العملاء المعروضة في الصفحة الرئيسية.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={openAddTesti}
            className="px-4 py-2 bg-terracotta text-espresso font-bold text-xs rounded-xl hover:bg-terracotta-light transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            إضافة رأي جديد
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((testi) => (
            <div key={testi.id} className="p-4 bg-espresso/80 border border-ivory/10 rounded-2xl flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-cream flex-shrink-0">
                      <img src={testi.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-semibold text-ivory text-xs">{testi.nameAr}</div>
                      <div className="text-[10px] text-ivory/50">{testi.cityAr}</div>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(testi.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-ivory/70 line-clamp-3 leading-relaxed">
                  "{testi.reviewAr}"
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-ivory/5">
                <button
                  type="button"
                  onClick={() => openEditTesti(testi)}
                  className="p-1.5 bg-ivory/10 hover:bg-terracotta hover:text-espresso rounded-lg text-ivory transition-colors cursor-pointer"
                  title="تعديل الرأي"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteTesti(testi.id)}
                  className="p-1.5 bg-red-500/10 hover:bg-red-500 hover:text-ivory rounded-lg text-red-400 transition-colors cursor-pointer"
                  title="حذف الرأي"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial Add/Edit Modal */}
      {isTestiModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-espresso/85 backdrop-blur-md p-3 sm:p-6 md:p-8 flex items-start justify-center animate-fade-in">
          <div className="relative w-full max-w-lg bg-espresso-light border border-terracotta/40 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-4 sm:my-8 animate-scale-up text-xs">
            {/* Header */}
            <div className="bg-espresso border-b border-ivory/10 px-5 sm:px-6 py-4 flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-ivory">
                {editingTesti ? 'تعديل رأي العميل' : 'إضافة رأي عميل جديد'}
              </h3>
              <button
                type="button"
                onClick={() => setIsTestiModalOpen(false)}
                className="p-1.5 bg-ivory/10 hover:bg-ivory/20 rounded-xl text-ivory cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTesti} className="p-4 sm:p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-ivory/70 font-semibold mb-1">اسم العميل (عربي)</label>
                  <input
                    type="text"
                    required
                    value={testiForm.nameAr}
                    onChange={(e) => setTestiForm({ ...testiForm, nameAr: e.target.value })}
                    className="w-full px-3 py-2 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta"
                  />
                </div>
                <div>
                  <label className="block text-ivory/70 font-semibold mb-1">المدينة (عربي)</label>
                  <input
                    type="text"
                    required
                    value={testiForm.cityAr}
                    onChange={(e) => setTestiForm({ ...testiForm, cityAr: e.target.value })}
                    className="w-full px-3 py-2 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta"
                  />
                </div>
              </div>

              <div>
                <label className="block text-ivory/70 font-semibold mb-1">نص الرأي بالعربية</label>
                <textarea
                  rows={3}
                  required
                  value={testiForm.reviewAr}
                  onChange={(e) => setTestiForm({ ...testiForm, reviewAr: e.target.value })}
                  className="w-full px-3 py-2 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-ivory/70 font-semibold mb-1">التقييم بالنجوم (1-5)</label>
                  <select
                    value={testiForm.rating}
                    onChange={(e) => setTestiForm({ ...testiForm, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-espresso border border-ivory/10 rounded-xl text-ivory outline-none focus:border-terracotta cursor-pointer"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 نجوم)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 نجوم)</option>
                    <option value={3}>⭐⭐⭐ (3 نجوم)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-ivory/70 font-semibold mb-1">مسار صورة القطعة/العميل</label>
                  <input
                    type="text"
                    value={testiForm.image}
                    onChange={(e) => setTestiForm({ ...testiForm, image: e.target.value })}
                    className="w-full px-3 py-2 bg-espresso border border-ivory/10 rounded-xl text-ivory font-mono text-[11px] outline-none focus:border-terracotta"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-4 border-t border-ivory/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTestiModalOpen(false)}
                  className="px-4 py-2 bg-ivory/10 hover:bg-ivory/20 text-ivory rounded-xl font-semibold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-terracotta text-espresso font-bold rounded-xl hover:bg-terracotta-light transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Check className="w-3.5 h-3.5" />
                  حفظ الرأي
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
