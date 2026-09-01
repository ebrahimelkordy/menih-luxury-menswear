import { useState, useEffect, useMemo } from 'react';
import {
  Star, Plus, Minus, Check, Ruler, Wind, Layers, Weight, ChevronRight,
  Share2, Truck, ShieldCheck, RotateCcw, X, MessageSquare, Send, Award
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getProductByHandle, products } from '@/services/mockData';
import { useRouter } from '@/router';
import { ProductCard } from '@/components/ProductCard';

interface ProductReviewItem {
  id: string;
  name: string;
  city: string;
  rating: number;
  text: string;
  date: string;
  verified?: boolean;
}

const defaultCategoryReviews: Record<string, ProductReviewItem[]> = {
  thobe: [
    { id: 'r1', name: 'عبد الرحمن السبيعي', city: 'الرياض', rating: 5, text: 'خامة القطن الياباني باردة ومريحة جداً في الصيف، والخياطة اليدوية وتفاصيل الياقة ممتازة وتستحق كل ريال.', date: 'منذ ٣ أيام', verified: true },
    { id: 'r2', name: 'هشام الأنصاري', city: 'القاهرة', rating: 5, text: 'أول تجربة تفصيل مع إزار وما شاء الله القماش فخم وثابت والتوصيل سريع مع تغليف ملكي فاخر.', date: 'منذ أسبوع', verified: true },
    { id: 'r3', name: 'محمد الهاجري', city: 'الكويت', rating: 5, text: 'قصة ملكية وأناقة تليق بالمناسبات الرسمية والأعياد. المقاس جاء مضبوطاً بالمللي.', date: 'منذ أسبوعين', verified: true },
  ],
  bisht: [
    { id: 'rb1', name: 'فهد بن خالد آل سعود', city: 'جدة', rating: 5, text: 'البشت النجدي الملكي بزري ألماني مذهب لا يعلى عليه. هيبة ووقار حقيقيان في حفل زفاف العائلة.', date: 'منذ يومين', verified: true },
    { id: 'rb2', name: 'سلطان المنصوري', city: 'أبوظبي', rating: 5, text: 'قماش صوف غاط أول ناعم وخفيف، ودقة حياكة الزري على الياقة والأكمام تدل على احترافية استثنائية.', date: 'منذ ٥ أيام', verified: true },
  ],
  shemagh: [
    { id: 'rs1', name: 'عمر التميمي', city: 'الرياض', rating: 5, text: 'شماغ كشميري فاخر بتطريز ناعم ونقشة متناسقة جداً، يثبت طوال اليوم بدون أي تجعد أو انكماش.', date: 'منذ ٤ أيام', verified: true },
    { id: 'rs2', name: 'خالد الرشيدي', city: 'الدمام', rating: 5, text: 'درجة اللون الأحمر الملكي غنية وخامة الفوال السويسري ممتازة وباردة.', date: 'منذ أسبوع', verified: true },
  ],
  fragrances: [
    { id: 'rf1', name: 'إبراهيم الدوسري', city: 'الخبر', rating: 5, text: 'دهن العود الكمبودي المعتق فواح وثباته استمر معي لأكثر من ٣ أيام في الثوب. نكهة بخورية سويتية نادرة.', date: 'منذ يومين', verified: true },
    { id: 'rf2', name: 'منصور القحطاني', city: 'دبي', rating: 5, text: 'عطر يفرض هيبتك في المجلس، فوحان هادئ وراقٍ جداً وغير مزعج.', date: 'منذ ٦ أيام', verified: true },
  ],
  accessories: [
    { id: 'ra1', name: 'تركي الشمري', city: 'الرياض', rating: 5, text: 'سبحة الكهرمان البولندي رائحتها مميزة والشكة الفضية عيار 925 متينة وصياغتها متقنة.', date: 'منذ ٣ أيام', verified: true },
    { id: 'ra2', name: 'عبد الله العتيبي', city: 'مكة المكرمة', rating: 5, text: 'تحفة فنية فخمة للاقتناء الشخصي أو الإهداء الراقي.', date: 'منذ أسبوع', verified: true },
  ],
};

export function ProductPage({ handle }: { handle: string }) {
  const { t, lang, formatPrice, addToCart } = useApp();
  const { navigate } = useRouter();

  const product = getProductByHandle(handle);

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showFabricSensor, setShowFabricSensor] = useState(false);
  const [stickyBarVisible, setStickyBarVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  // Reviews State
  const [reviews, setReviews] = useState<ProductReviewItem[]>([]);
  const [showAddReview, setShowAddReview] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewCity, setReviewCity] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    setSelectedVariantIdx(0);
    setSelectedSizeIdx(0);
    setQuantity(1);
    setShowAddReview(false);
    setReviewSuccess(false);

    if (product) {
      const stored = localStorage.getItem(`ezar_reviews_${product.id}`);
      if (stored) {
        setReviews(JSON.parse(stored));
      } else {
        const catReviews = defaultCategoryReviews[product.category] || defaultCategoryReviews.thobe;
        setReviews(catReviews);
      }
    }
  }, [handle, product]);

  useEffect(() => {
    const onScroll = () => {
      setStickyBarVisible(window.scrollY > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  const avgRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return 5.0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return Number((total / reviews.length).toFixed(1));
  }, [reviews]);

  if (!product) {
    return (
      <div className="max-w-md mx-auto py-32 text-center">
        <p className="text-espresso/50">المنتج غير متوفر</p>
        <button
          onClick={() => navigate({ name: 'shop' })}
          className="mt-4 px-6 py-3 bg-espresso text-ivory text-sm font-semibold rounded-full cursor-pointer"
        >
          {t('cart.continueShopping')}
        </button>
      </div>
    );
  }

  const variant = product.variants[selectedVariantIdx] || product.variants[0];
  const inStock = variant?.inStock ?? true;
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  const handleAdd = () => {
    if (!inStock) return;
    addToCart({
      productId: product.id,
      variantId: variant.id,
      size: product.sizes[selectedSizeIdx] || product.sizes[0] || 'Standard',
      quantity,
    });
  };

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewText.trim()) return;

    const newRev: ProductReviewItem = {
      id: `rev_${Date.now()}`,
      name: reviewAuthor.trim(),
      city: reviewCity.trim() || (lang === 'ar' ? 'الرياض' : 'Riyadh'),
      rating: reviewRating,
      text: reviewText.trim(),
      date: lang === 'ar' ? 'الآن' : 'Just now',
      verified: true,
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);
    localStorage.setItem(`ezar_reviews_${product.id}`, JSON.stringify(updated));

    setReviewAuthor('');
    setReviewCity('');
    setReviewText('');
    setReviewRating(5);
    setShowAddReview(false);
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  return (
    <div className="pt-4">
      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 mb-6">
        <div className="flex items-center gap-1.5 text-xs text-espresso/40">
          <button onClick={() => navigate({ name: 'home' })} className="hover:text-espresso transition-colors">
            {lang === 'ar' ? 'الرئيسية' : 'Home'}
          </button>
          <ChevronRight className="w-3 h-3 flip-rtl" />
          <button
            onClick={() => navigate({ name: 'shop', category: product.category })}
            className="hover:text-espresso transition-colors"
          >
            {lang === 'ar' ? product.categoryAr : product.category}
          </button>
          <ChevronRight className="w-3 h-3 flip-rtl" />
          <span className="text-espresso/70 truncate">{lang === 'ar' ? product.titleAr : product.title}</span>
        </div>
      </div>

      {/* Main Product */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-cream shadow-sm">
              <img
                key={variant.id}
                src={variant.image}
                alt={lang === 'ar' ? product.titleAr : product.title}
                className="editorial-image animate-fade-in"
              />
              {hasDiscount && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-terracotta text-ivory text-xs font-semibold rounded-full shadow-md">
                  -{Math.round((1 - product.price / product.compareAtPrice!) * 100)}%
                </span>
              )}
            </div>

            {/* Variant thumbnail strip */}
            <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
              {product.variants.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariantIdx(i)}
                  className={`flex-shrink-0 w-20 h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedVariantIdx === i ? 'border-espresso ring-2 ring-terracotta/30' : 'border-cream opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={v.image} alt="" className="editorial-image" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="lg:py-2 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-terracotta font-semibold uppercase tracking-wider">
                  {lang === 'ar' ? product.categoryAr : product.category}
                </span>
                <span className="text-espresso/20">·</span>
                <span className="text-xs text-espresso/50">{lang === 'ar' ? product.fabricAr : product.fabric}</span>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-espresso leading-tight">
                {lang === 'ar' ? product.titleAr : product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2.5 mt-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(avgRating) ? 'fill-terracotta text-terracotta' : 'text-cream fill-cream'}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-espresso font-mono">{avgRating}</span>
                <span className="text-xs text-espresso/40">({reviews.length} {lang === 'ar' ? 'تقييم موثق' : 'reviews'})</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-1 border-t border-cream/60">
              <span className="text-2xl sm:text-3xl font-bold text-espresso font-mono">{formatPrice(product.price)}</span>
              {hasDiscount && (
                <span className="text-base text-espresso/30 line-through font-mono">{formatPrice(product.compareAtPrice!)}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-espresso/70 leading-relaxed font-light">
              {lang === 'ar' ? product.descriptionAr : product.description}
            </p>

            {/* Color Swatches */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-espresso uppercase tracking-wider">{t('product.selectColor')}</span>
                <span className="text-xs font-medium text-terracotta">
                  {lang === 'ar' ? variant.nameAr : variant.name}
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantIdx(i)}
                    disabled={!v.inStock}
                    className={`relative w-10 h-10 rounded-full border-2 transition-all cursor-pointer disabled:opacity-30 ${
                      selectedVariantIdx === i ? 'border-espresso ring-2 ring-espresso/20 scale-105' : 'border-cream hover:border-espresso/30'
                    }`}
                    style={{ backgroundColor: v.colorHex }}
                    title={lang === 'ar' ? v.nameAr : v.name}
                  >
                    {!v.inStock && <div className="absolute inset-0 rounded-full bg-ivory/60" />}
                    {selectedVariantIdx === i && (
                      <Check
                        className="w-4 h-4 absolute inset-0 m-auto"
                        style={{
                          color: ['#F5F2EE', '#E8D5C0', '#F5F0EB', '#D4C5B0', '#D4AFA6', '#E8D5CE', '#FFFFFF'].includes(v.colorHex.toUpperCase()) ? '#1A1615' : '#FAF8F5',
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
              {!inStock && (
                <p className="text-xs text-terracotta mt-2 font-medium">{t('product.outOfStock')}</p>
              )}
            </div>

            {/* Size */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-espresso uppercase tracking-wider">{t('product.selectSize')}</span>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="flex items-center gap-1 text-xs text-terracotta hover:underline cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>{t('product.sizeGuide')}</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSizeIdx(i)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all cursor-pointer ${
                      selectedSizeIdx === i
                        ? 'bg-espresso text-ivory border-espresso shadow-xs'
                        : 'bg-white text-espresso/70 border-cream hover:border-espresso/30'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to Bag */}
            <div className="flex gap-3 pt-2">
              <div className="flex items-center border-2 border-cream rounded-2xl bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-11 flex items-center justify-center text-espresso/60 hover:text-espresso transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-espresso font-mono">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-11 flex items-center justify-center text-espresso/60 hover:text-espresso transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAdd}
                disabled={!inStock}
                className="flex-1 py-3.5 bg-espresso text-ivory text-sm font-bold rounded-2xl magnetic-btn hover:bg-espresso-light disabled:opacity-40 disabled:cursor-not-allowed shadow-lg cursor-pointer active:scale-98"
              >
                {inStock ? (lang === 'ar' ? 'إضافة إلى حقيبة التسوق' : 'Add to Bag') : t('product.outOfStock')} · {formatPrice(product.price * quantity)}
              </button>
            </div>

            {/* Fabric Sensor Toggle */}
            <div className="border border-cream rounded-2xl overflow-hidden bg-sand/20">
              <button
                onClick={() => setShowFabricSensor((p) => !p)}
                className="w-full flex items-center justify-between p-4 hover:bg-cream/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-terracotta/15 flex items-center justify-center text-terracotta">
                    <Wind className="w-4 h-4" />
                  </div>
                  <div className="text-left rtl:text-right">
                    <div className="text-xs font-bold text-espresso">{t('product.fabricSensor')}</div>
                    <div className="text-[11px] text-espresso/50">{lang === 'ar' ? product.opacityAr : product.opacity}</div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-espresso/40 transition-transform ${showFabricSensor ? 'rotate-90' : ''} flip-rtl`} />
              </button>
              {showFabricSensor && (
                <div className="px-4 pb-4 pt-2 space-y-3 border-t border-cream/50 animate-fade-in text-xs">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-white rounded-xl border border-cream">
                      <Layers className="w-4 h-4 text-terracotta mx-auto mb-1" />
                      <div className="text-[10px] text-espresso/50 uppercase tracking-wider">{t('product.opacity')}</div>
                      <div className="text-xs font-semibold text-espresso mt-0.5">{lang === 'ar' ? product.opacityAr : product.opacity}</div>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-cream">
                      <Weight className="w-4 h-4 text-terracotta mx-auto mb-1" />
                      <div className="text-[10px] text-espresso/50 uppercase tracking-wider">{t('product.weight')}</div>
                      <div className="text-xs font-semibold text-espresso mt-0.5">{product.weight}</div>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-cream">
                      <Ruler className="w-4 h-4 text-terracotta mx-auto mb-1" />
                      <div className="text-[10px] text-espresso/50 uppercase tracking-wider">{t('product.dimensions')}</div>
                      <div className="text-xs font-semibold text-espresso mt-0.5">{product.dimensions}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Truck, label: t('product.freeShipping') },
                { icon: RotateCcw, label: lang === 'ar' ? 'إرجاع واستبدال سلس' : '14-day Returns' },
                { icon: ShieldCheck, label: lang === 'ar' ? 'جودة وأصالة مضمونة' : 'Quality Guaranteed' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-1.5 p-3 bg-cream/30 rounded-xl border border-cream/60">
                  <item.icon className="w-4 h-4 text-terracotta" />
                  <span className="text-[10px] text-espresso/70 font-medium leading-tight">{item.label}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Tabs: Details / Reviews */}
        <div className="mt-16 max-w-4xl">
          <div className="flex gap-8 border-b border-cream mb-8">
            {(['details', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-bold transition-colors relative cursor-pointer ${
                  activeTab === tab ? 'text-espresso' : 'text-espresso/40 hover:text-espresso'
                }`}
              >
                {tab === 'details' ? (lang === 'ar' ? 'مواصفات القطعة والتفصيل' : 'Details & Specs') : `${lang === 'ar' ? 'آراء وتقييمات العملاء' : 'Customer Reviews'} (${reviews.length})`}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-espresso rounded-full" />
                )}
              </button>
            ))}
          </div>

          {activeTab === 'details' && (
            <div className="space-y-6 animate-fade-in text-xs sm:text-sm">
              <p className="text-espresso/70 leading-relaxed font-light">
                {lang === 'ar' ? product.descriptionAr : product.description}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <DetailRow label={t('product.fabric')} value={lang === 'ar' ? product.fabricAr : product.fabric} />
                <DetailRow label={t('product.opacity')} value={lang === 'ar' ? product.opacityAr : product.opacity} />
                <DetailRow label={t('product.weight')} value={product.weight} />
                <DetailRow label={t('product.dimensions')} value={product.dimensions} />
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-fade-in">
              {/* Reviews Summary Header */}
              <div className="p-6 bg-sand/40 rounded-3xl border border-cream flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="font-serif text-4xl font-bold text-espresso font-mono leading-none">{avgRating}</div>
                    <div className="flex gap-0.5 mt-1 justify-center">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-3.5 h-3.5 fill-terracotta text-terracotta" />
                      ))}
                    </div>
                    <div className="text-[10px] text-espresso/50 mt-1">{reviews.length} {lang === 'ar' ? 'مراجعة موثقة' : 'ratings'}</div>
                  </div>
                  <div className="h-10 w-px bg-cream/80 hidden sm:block" />
                  <div>
                    <div className="text-xs font-bold text-espresso">{lang === 'ar' ? 'تقييمات موثقة من عملاء إزار' : 'Verified Noble Customer Reviews'}</div>
                    <div className="text-[11px] text-espresso/60 mt-0.5">{lang === 'ar' ? '١٠٠٪ من التقييمات صادرة عن تجارب شراء حقيقية.' : '100% genuine customer reviews.'}</div>
                  </div>
                </div>

                <button
                  onClick={() => setShowAddReview((p) => !p)}
                  className="px-5 py-2.5 bg-espresso text-ivory text-xs font-bold rounded-xl hover:bg-espresso-light transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-terracotta" />
                  <span>{showAddReview ? (lang === 'ar' ? 'إغلاق النموذج' : 'Close Form') : (lang === 'ar' ? 'أضف تقييمك وتجربتك' : 'Write a Review')}</span>
                </button>
              </div>

              {/* Add Review Form */}
              {showAddReview && (
                <form onSubmit={handleAddReviewSubmit} className="p-6 bg-white rounded-3xl border border-terracotta/30 shadow-md space-y-4 text-xs animate-fade-down">
                  <div className="flex items-center justify-between border-b border-cream pb-3">
                    <h4 className="font-serif text-base font-bold text-espresso flex items-center gap-2">
                      <Star className="w-4 h-4 text-terracotta fill-terracotta" />
                      <span>{lang === 'ar' ? 'كتابة تقييم جديد للقطعة' : 'Add Your Experience'}</span>
                    </h4>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-espresso font-bold mb-1">{lang === 'ar' ? 'الاسم الكريم' : 'Your Name'} *</label>
                      <input
                        type="text"
                        required
                        value={reviewAuthor}
                        onChange={(e) => setReviewAuthor(e.target.value)}
                        placeholder={lang === 'ar' ? 'مثال: عبد الله السبيعي' : 'e.g. Abdullah'}
                        className="w-full px-3.5 py-2.5 bg-sand/30 border border-cream rounded-xl text-espresso outline-none focus:border-terracotta"
                      />
                    </div>
                    <div>
                      <label className="block text-espresso font-bold mb-1">{lang === 'ar' ? 'المدينة / الدولة' : 'City / Country'}</label>
                      <input
                        type="text"
                        value={reviewCity}
                        onChange={(e) => setReviewCity(e.target.value)}
                        placeholder={lang === 'ar' ? 'الرياض / القاهرة' : 'Riyadh / Cairo'}
                        className="w-full px-3.5 py-2.5 bg-sand/30 border border-cream rounded-xl text-espresso outline-none focus:border-terracotta"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-espresso font-bold mb-1">{lang === 'ar' ? 'التقييم بالنجوم' : 'Rating'}</label>
                    <div className="flex gap-2 items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 cursor-pointer transition-transform hover:scale-110"
                        >
                          <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-terracotta text-terracotta' : 'text-cream fill-cream'}`} />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-espresso font-mono mr-2">{reviewRating} / 5</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-espresso font-bold mb-1">{lang === 'ar' ? 'نص المراجعة والتجربة' : 'Review Text'} *</label>
                    <textarea
                      rows={3}
                      required
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder={lang === 'ar' ? 'اكتب رأيك الصادق في جودة القماش والتفصيل والتوصيل...' : 'Share your experience about fabric, tailoring and delivery...'}
                      className="w-full px-3.5 py-2.5 bg-sand/30 border border-cream rounded-xl text-espresso outline-none focus:border-terracotta resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddReview(false)}
                      className="px-4 py-2 bg-cream text-espresso rounded-xl font-semibold cursor-pointer hover:bg-sand"
                    >
                      {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-terracotta text-espresso font-bold rounded-xl hover:bg-terracotta-light transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'نشر التقييم فوراً' : 'Submit Review'}</span>
                    </button>
                  </div>
                </form>
              )}

              {reviewSuccess && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2 animate-fade-in">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'ar' ? 'شكراً لك! تم تسجيل ونشر تقييمك بنجاح.' : 'Thank you! Your review has been submitted and published.'}</span>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="p-5 bg-white rounded-2xl border border-cream/70 shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-espresso text-ivory flex items-center justify-center text-xs font-bold">
                          {r.name[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-espresso">{r.name}</span>
                            {r.verified && (
                              <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-semibold flex items-center gap-1">
                                <Award className="w-3 h-3" />
                                {lang === 'ar' ? 'مشتري موثق' : 'Verified'}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-espresso/40">{r.city}</div>
                        </div>
                      </div>
                      <span className="text-[11px] text-espresso/40">{r.date}</span>
                    </div>

                    <div className="flex gap-0.5">
                      {[...Array(r.rating)].map((_, j) => (
                        <Star key={j} className="w-3.5 h-3.5 fill-terracotta text-terracotta" />
                      ))}
                    </div>

                    <p className="text-xs sm:text-sm text-espresso/75 leading-relaxed font-light">
                      "{r.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="font-serif text-xl font-semibold text-espresso mb-6">{t('product.relatedProducts')}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Size Guide Popover */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-espresso/40 backdrop-blur-sm" onClick={() => setShowSizeGuide(false)} />
          <div className="relative w-full max-w-md bg-ivory rounded-2xl shadow-2xl p-6 animate-fade-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-semibold text-espresso">{t('product.sizeGuide')}</h3>
              <button onClick={() => setShowSizeGuide(false)} className="p-1 cursor-pointer">
                <X className="w-5 h-5 text-espresso/60" />
              </button>
            </div>
            <div className="space-y-3">
              {product.sizes.map((size, i) => (
                <div key={size} className={`p-4 rounded-xl border-2 ${i === selectedSizeIdx ? 'border-espresso bg-cream/20' : 'border-cream'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-espresso">{size}</span>
                    {i === selectedSizeIdx && <Check className="w-4 h-4 text-espresso" />}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: lang === 'ar' ? 'الطول' : 'Length', value: size.includes('65') || size.includes('Standard') ? '65 cm' : size.includes('83') || size.includes('Large') ? '83 cm' : '70 cm' },
                      { label: lang === 'ar' ? 'العرض' : 'Width', value: size.includes('180') ? '180 cm' : size.includes('200') ? '200 cm' : '190 cm' },
                      { label: lang === 'ar' ? 'الوزن' : 'Weight', value: product.weight.replace(/[()]/g, '') },
                    ].map((d, j) => (
                      <div key={j}>
                        <div className="text-[10px] text-espresso/40 uppercase tracking-wider">{d.label}</div>
                        <div className="text-xs font-medium text-espresso mt-0.5">{d.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Add to Bag Bar (Mobile) */}
      {stickyBarVisible && (
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden frosted-header border-t border-cream p-3 animate-fade-up">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-cream">
              <img src={variant.image} alt="" className="editorial-image" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-espresso truncate">
                {lang === 'ar' ? product.titleAr : product.title}
              </div>
              <div className="text-sm font-bold text-espresso font-mono">{formatPrice(product.price * quantity)}</div>
            </div>
            <button
              onClick={handleAdd}
              disabled={!inStock}
              className="px-5 py-2.5 bg-espresso text-ivory text-xs font-bold rounded-full magnetic-btn disabled:opacity-40 cursor-pointer"
            >
              {t('product.addToBag')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3.5 bg-sand/30 rounded-xl border border-cream/70">
      <div className="text-[10px] text-espresso/40 uppercase tracking-wider mb-1 font-semibold">{label}</div>
      <div className="text-xs sm:text-sm font-semibold text-espresso">{value}</div>
    </div>
  );
}

