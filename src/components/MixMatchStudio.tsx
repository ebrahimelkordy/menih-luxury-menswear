import { useState, useMemo, useEffect } from 'react';
import {
  RefreshCw, Sparkles, Check, ArrowRight, ShoppingBag,
  Shirt, Crown, ChevronRight
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { products, getProductById } from '@/services/mockData';
import { getSiteSettings, type SiteSettings, defaultSiteSettings } from '@/services/adminService';

export type SlotType = 'thobe' | 'shemagh' | 'bisht' | 'accessories' | 'fragrances';

export interface Slot {
  type: SlotType;
  label: string;
  labelAr: string;
  optional: boolean;
  icon: typeof Shirt;
  step: number;
}

const defaultSlotDefs: Record<SlotType, { label: string; labelAr: string; optional: boolean; icon: typeof Shirt }> = {
  thobe: { label: 'Thobe & Gandoura', labelAr: 'الثوب والجلابية', optional: false, icon: Shirt },
  shemagh: { label: 'Shemagh & Shawl', labelAr: 'الشماغ والشال', optional: false, icon: Crown },
  bisht: { label: 'Royal Bisht & Cape', labelAr: 'البشت الملكي', optional: true, icon: Crown },
  accessories: { label: 'Amber & Gems', labelAr: 'السبحة والنفائس', optional: true, icon: Sparkles },
  fragrances: { label: 'Aged Oud & Perfume', labelAr: 'دهن العود وعطور الدار', optional: true, icon: Sparkles },
};

interface SlotSelection {
  productId: string;
  variantIdx: number;
  sizeIdx: number;
}

type Selections = Partial<Record<SlotType, SlotSelection | null>>;

const lightColors = ['#F5F2EE', '#E8D5C0', '#F5F0EB', '#D4C5B0', '#D4AFA6', '#E8D5CE', '#C4A47C', '#C0C0C8', '#FFFFFF', '#F8F9FA'];

export function MixMatchStudio() {
  const { t, lang, formatPrice, addToCart, openCart } = useApp();
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);

  const activeSlotKeys = (settings.mixMatchCategories && settings.mixMatchCategories.length > 0
    ? (settings.mixMatchCategories as SlotType[])
    : (['thobe', 'shemagh', 'bisht', 'accessories', 'fragrances'] as SlotType[])
  ).filter((k) => defaultSlotDefs[k]);

  const slots: Slot[] = useMemo(() => {
    return activeSlotKeys.map((key, idx) => ({
      type: key,
      label: defaultSlotDefs[key].label,
      labelAr: defaultSlotDefs[key].labelAr,
      optional: defaultSlotDefs[key].optional,
      icon: defaultSlotDefs[key].icon,
      step: idx + 1,
    }));
  }, [activeSlotKeys]);

  const getInitialSelections = (): Selections => {
    const init: Selections = {};
    activeSlotKeys.forEach((key) => {
      const p = products.find((prod) => prod.category === key);
      if (p) {
        init[key] = { productId: p.id, variantIdx: 0, sizeIdx: 0 };
      } else {
        init[key] = null;
      }
    });
    return init;
  };

  const [selections, setSelections] = useState<Selections>(getInitialSelections);
  const [activeSlot, setActiveSlot] = useState<SlotType>('thobe');
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    if (slots.length > 0 && !slots.some((s) => s.type === activeSlot)) {
      setActiveSlot(slots[0].type);
    }
  }, [slots, activeSlot]);

  useEffect(() => {
    setSelections((prev) => {
      const next = { ...prev };
      let changed = false;
      slots.forEach((slot) => {
        const currentSel = next[slot.type];
        const prod = currentSel ? getProductById(currentSel.productId) : null;
        if (!prod) {
          const fallback = products.find((p) => p.category === slot.type);
          if (fallback) {
            next[slot.type] = { productId: fallback.id, variantIdx: 0, sizeIdx: 0 };
            changed = true;
          }
        }
      });
      return changed ? next : prev;
    });
  }, [products, slots]);

  const activeSlotData = slots.find((s) => s.type === activeSlot) || slots[0] || {
    type: 'thobe' as SlotType,
    label: 'Thobe',
    labelAr: 'الثوب',
    optional: false,
    icon: Shirt,
    step: 1,
  };
  
  const activeProducts = useMemo(() => {
    return products.filter((p) => p.category === activeSlot);
  }, [products, activeSlot]);

  const currentSelection = selections[activeSlot];
  const currentProduct = currentSelection ? getProductById(currentSelection.productId) : (activeProducts[0] || null);

  const selectedCount = Object.values(selections).filter(Boolean).length;
  const requiredSlots = slots.filter((s) => !s.optional);
  const requiredSelected = requiredSlots.filter((s) => selections[s.type]).length;
  const isComplete = requiredSelected === requiredSlots.length;

  const selectedColors = useMemo(() => {
    return Object.values(selections)
      .filter((s): s is SlotSelection => Boolean(s))
      .map((s) => {
        const p = getProductById(s.productId);
        return p?.variants[s.variantIdx]?.colorHex;
      })
      .filter(Boolean);
  }, [selections]);

  const harmonyScore = useMemo(() => {
    if (selectedColors.length < 2) return 100;
    const families = Object.values(selections)
      .filter((s): s is SlotSelection => Boolean(s))
      .map((s) => {
        const p = getProductById(s.productId);
        return p?.variants[s.variantIdx]?.colorFamily;
      })
      .filter(Boolean);
    const unique = new Set(families);
    if (unique.size <= 2) return 98;
    if (unique.size === 3) return 85;
    return 70;
  }, [selections, selectedColors]);

  const setTotal = useMemo(() => {
    return Object.values(selections)
      .filter((s): s is SlotSelection => Boolean(s))
      .reduce((sum, s) => {
        const p = getProductById(s.productId);
        return sum + (p?.price || 0);
      }, 0);
  }, [selections]);

  const discountPercent = settings.bundleDiscountPercent || 15;
  const bundlePrice = Math.round(setTotal * (1 - discountPercent / 100));
  const savings = setTotal - bundlePrice;

  const selectProduct = (productId: string) => {
    setSelections((prev) => ({
      ...prev,
      [activeSlot]: { productId, variantIdx: 0, sizeIdx: 0 },
    }));
  };

  const selectVariant = (idx: number) => {
    if (!currentSelection) return;
    setSelections((prev) => ({
      ...prev,
      [activeSlot]: { ...currentSelection, variantIdx: idx },
    }));
  };

  const selectSize = (idx: number) => {
    if (!currentSelection) return;
    setSelections((prev) => ({
      ...prev,
      [activeSlot]: { ...currentSelection, sizeIdx: idx },
    }));
  };

  const toggleSlot = (slot: SlotType) => {
    setSelections((prev) => {
      if (prev[slot]) {
        return { ...prev, [slot]: null };
      }
      const firstProd = products.find((p) => p.category === slot);
      return { ...prev, [slot]: firstProd ? { productId: firstProd.id, variantIdx: 0, sizeIdx: 0 } : null };
    });
  };

  const goNext = () => {
    const currentStep = activeSlotData.step;
    if (currentStep < slots.length) {
      const nextSlot = slots.find((s) => s.step === currentStep + 1);
      if (nextSlot) setActiveSlot(nextSlot.type);
    }
  };

  const reset = () => {
    setSelections(getInitialSelections());
    if (slots.length > 0) setActiveSlot(slots[0].type);
  };

  const addSetToCart = () => {
    Object.values(selections).forEach((sel) => {
      if (!sel) return;
      const p = getProductById(sel.productId);
      if (!p) return;
      addToCart({
        productId: sel.productId,
        variantId: p.variants[sel.variantIdx]?.id || p.variants[0]?.id,
        size: p.sizes[sel.sizeIdx] || p.sizes[0] || 'Standard',
        quantity: 1,
      });
    });
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
      openCart();
    }, 1000);
  };

  const harmonyLabel = harmonyScore >= 90
    ? (lang === 'ar' ? 'تناسق ملوكي ممتاز' : 'Imperial Harmony')
    : harmonyScore >= 75
    ? (lang === 'ar' ? 'تناسق كلاسيكي أنيق' : 'Classic Match')
    : (lang === 'ar' ? 'تشكيلة متميزة' : 'Distinguished Mix');

  const progressPct = slots.length > 0 ? (selectedCount / slots.length) * 100 : 100;

  return (
    <div className="w-full max-w-full mx-auto space-y-6 pb-24 lg:pb-0 px-2 sm:px-0">
      
      {/* ── MOBILE HORIZONTAL CATEGORY SLOTS STEPPER (Centered on Mobile) ── */}
      <div className="w-full bg-ivory/95 backdrop-blur-md py-3 border-y border-cream/70 lg:hidden shadow-xs">
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto scrollbar-none px-2 py-1">
          {slots.map((slot) => {
            const sel = selections[slot.type];
            const p = sel ? getProductById(sel.productId) : null;
            const variant = p && sel ? p.variants[sel.variantIdx] : null;
            const isActive = activeSlot === slot.type;

            return (
              <button
                key={slot.type}
                onClick={() => setActiveSlot(slot.type)}
                className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-espresso text-ivory shadow-sm ring-2 ring-terracotta/40'
                    : sel
                    ? 'bg-cream text-espresso border border-cream hover:bg-sand'
                    : 'bg-ivory text-espresso/40 border border-dashed border-cream'
                }`}
              >
                {variant ? (
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-ivory/40 flex-shrink-0"
                    style={{ backgroundColor: variant.colorHex }}
                  />
                ) : (
                  <slot.icon className="w-3.5 h-3.5 flex-shrink-0" />
                )}
                <span>{lang === 'ar' ? slot.labelAr : slot.label}</span>
                {sel && <Check className="w-3 h-3 text-terracotta" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── MAIN STUDIO GRID ── */}
      <div className="grid lg:grid-cols-[380px_1fr_340px] gap-6 items-start">

        {/* ===== COL 1: Visual Set Preview (Desktop Sticky / Mobile Responsive) ===== */}
        <div className="order-2 lg:order-1 w-full">
          <div className="bg-ivory rounded-2xl border border-cream overflow-hidden lg:sticky lg:top-24 shadow-sm">
            {/* Preview Header */}
            <div className="px-5 py-4 border-b border-cream flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-terracotta" />
                <span className="text-sm font-semibold text-espresso">
                  {lang === 'ar' ? 'معاينة الطقم الملكي المنسق' : 'Imperial Set Preview'}
                </span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-cream rounded-full text-espresso">
                {selectedCount}/{slots.length} {lang === 'ar' ? 'قطع' : 'items'}
              </span>
            </div>

            {/* Main Active Garment Preview */}
            <div className="p-4 sm:p-5 bg-gradient-to-b from-sand to-cream/20">
              <div className="relative aspect-[4/4] rounded-2xl overflow-hidden shadow-md border border-cream group">
                {currentProduct && currentSelection ? (
                  <>
                    <img
                      src={currentProduct.variants[currentSelection.variantIdx]?.image || currentProduct.variants[0]?.image}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/20 to-transparent" />
                    
                    {/* Badge */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                      <span className="px-2.5 py-1 bg-espresso/80 backdrop-blur-md text-ivory text-xs font-medium rounded-full border border-ivory/10 flex items-center gap-1.5">
                        <activeSlotData.icon className="w-3.5 h-3.5 text-terracotta" />
                        {lang === 'ar' ? activeSlotData.labelAr : activeSlotData.label}
                      </span>
                      <span className="px-2.5 py-1 bg-terracotta text-ivory text-xs font-bold rounded-full shadow-sm">
                        {formatPrice(currentProduct.price)}
                      </span>
                    </div>

                    {/* Title & Selection */}
                    <div className="absolute bottom-3 left-3 right-3 text-ivory">
                      <div className="font-serif text-base font-semibold leading-snug">
                        {lang === 'ar' ? currentProduct.titleAr : currentProduct.title}
                      </div>
                      <div className="text-xs text-ivory/80 mt-1 flex items-center justify-between">
                        <span>{lang === 'ar' ? currentProduct.variants[currentSelection.variantIdx]?.nameAr : currentProduct.variants[currentSelection.variantIdx]?.name}</span>
                        <span className="text-[10px] bg-ivory/20 px-2 py-0.5 rounded-full font-mono">{currentProduct.sizes[currentSelection.sizeIdx] || currentProduct.sizes[0]}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-cream/40">
                    <ShoppingBag className="w-12 h-12 text-espresso/20 mb-3" />
                    <p className="text-sm font-medium text-espresso/60">
                      {lang === 'ar' ? 'اختر قطعة لتظهر في المعاينة' : 'Select an item to preview'}
                    </p>
                  </div>
                )}
              </div>

              {/* Slot Mini Coordinated Preview */}
              <div className="mt-4 grid grid-cols-5 gap-2">
                {slots.map((s) => {
                  const sel = selections[s.type];
                  const p = sel ? getProductById(sel.productId) : null;
                  const variant = p && sel ? p.variants[sel.variantIdx] : null;
                  const isActive = activeSlot === s.type;

                  return (
                    <button
                      key={s.type}
                      onClick={() => setActiveSlot(s.type)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        isActive
                          ? 'border-terracotta ring-2 ring-terracotta/30 scale-105 shadow-md z-10'
                          : sel
                          ? 'border-cream/80 hover:border-espresso/30 opacity-90'
                          : 'border-dashed border-cream bg-cream/30 opacity-60'
                      }`}
                      title={lang === 'ar' ? s.labelAr : s.label}
                    >
                      {sel && variant ? (
                        <>
                          <img src={variant.image} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-espresso/20 hover:bg-transparent transition-colors" />
                          <div
                            className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-ivory shadow-xs"
                            style={{ backgroundColor: variant.colorHex }}
                          />
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-espresso/30">
                          <s.icon className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Harmony and Progress Bar */}
            <div className="px-5 py-4 border-t border-cream space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-espresso/70">{lang === 'ar' ? 'تناسق الألوان والمواد' : 'Color & Fabric Harmony'}</span>
                <span className="text-olive">{harmonyLabel} ({harmonyScore}%)</span>
              </div>
              <div className="h-2 bg-cream rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-terracotta to-olive rounded-full transition-all duration-700 ease-spring"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ===== COL 2: Interactive Product & Customization Selector ===== */}
        <div className="order-1 lg:order-2 space-y-5 w-full">
          {/* Active Category Header */}
          <div className="bg-ivory rounded-2xl border border-cream p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-espresso text-ivory flex items-center justify-center shadow-xs">
                  <activeSlotData.icon className="w-5 h-5 text-terracotta" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-espresso">
                    {lang === 'ar' ? activeSlotData.labelAr : activeSlotData.label}
                  </h3>
                  <p className="text-xs text-espresso/50">
                    {lang === 'ar' ? 'الخطوة' : 'Step'} {activeSlotData.step} {lang === 'ar' ? `من ${slots.length}` : `of ${slots.length}`}
                  </p>
                </div>
              </div>

              {activeSlotData.optional && (
                <button
                  onClick={() => toggleSlot(activeSlot)}
                  className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${
                    currentSelection
                      ? 'bg-cream text-espresso hover:bg-sand'
                      : 'bg-espresso text-ivory'
                  }`}
                >
                  {currentSelection ? (lang === 'ar' ? 'استبعاد القطعة' : 'Exclude') : (lang === 'ar' ? 'تضمين القطعة' : 'Include')}
                </button>
              )}
            </div>

            {/* Product Design Options List (Cards) */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-espresso uppercase tracking-wider block">
                {lang === 'ar' ? 'اختر التصميم والقماش' : 'Select Design & Fabric'}
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {activeProducts.map((p) => {
                  const isSelected = currentSelection?.productId === p.id;
                  const firstVar = p.variants[0];

                  return (
                    <div
                      key={p.id}
                      onClick={() => selectProduct(p.id)}
                      className={`cursor-pointer rounded-2xl p-3.5 border-2 transition-all flex gap-3 items-center ${
                        isSelected
                          ? 'border-espresso bg-sand/60 shadow-md ring-1 ring-espresso/20'
                          : 'border-cream bg-white hover:border-espresso/30'
                      }`}
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                        <img src={firstVar?.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-espresso leading-snug truncate">
                          {lang === 'ar' ? p.titleAr : p.title}
                        </h4>
                        <p className="text-[11px] text-espresso/60 truncate mt-0.5">
                          {lang === 'ar' ? p.fabricAr : p.fabric}
                        </p>
                        <div className="text-xs font-bold text-espresso mt-1 font-mono">
                          {formatPrice(p.price)}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-espresso text-ivory flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customization Options (Variants & Sizes) */}
            {currentProduct && currentSelection && (
              <div className="mt-6 pt-6 border-t border-cream space-y-5">
                {/* Color Variants Swatches */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold text-espresso uppercase tracking-wider">
                      {lang === 'ar' ? 'اللون الملكي' : 'Color'}
                    </span>
                    <span className="text-xs font-medium text-terracotta">
                      {lang === 'ar' ? currentProduct.variants[currentSelection.variantIdx]?.nameAr : currentProduct.variants[currentSelection.variantIdx]?.name}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {currentProduct.variants.map((v, i) => {
                      const isVarSelected = currentSelection.variantIdx === i;

                      return (
                        <button
                          key={v.id}
                          onClick={() => selectVariant(i)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 transition-all ${
                            isVarSelected
                              ? 'border-espresso bg-espresso text-ivory shadow-xs scale-105'
                              : 'border-cream bg-white text-espresso/70 hover:border-espresso/40'
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shadow-inner flex-shrink-0"
                            style={{ backgroundColor: v.colorHex }}
                          />
                          <span className="text-xs font-medium">
                            {lang === 'ar' ? v.nameAr : v.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Size Selector */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold text-espresso uppercase tracking-wider">
                      {lang === 'ar' ? 'المقاس / الطول' : 'Size / Length'}
                    </span>
                    <span className="text-xs font-medium text-espresso/50">
                      {currentProduct.sizes[currentSelection.sizeIdx] || currentProduct.sizes[0]}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {currentProduct.sizes.map((s, idx) => {
                      const isSizeSelected = currentSelection.sizeIdx === idx;
                      return (
                        <button
                          key={s}
                          onClick={() => selectSize(idx)}
                          className={`px-3.5 py-1.5 text-xs rounded-xl font-medium transition-all ${
                            isSizeSelected
                              ? 'bg-espresso text-ivory font-bold shadow-xs'
                              : 'bg-white border border-cream text-espresso/70 hover:border-espresso'
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Next Step Shortcut */}
                {activeSlotData.step < slots.length && (
                  <button
                    onClick={goNext}
                    className="w-full py-3 rounded-xl bg-sand hover:bg-cream text-espresso font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>{lang === 'ar' ? 'الانتقال للقطعة التالية' : 'Next Step'}</span>
                    <ChevronRight className="w-4 h-4 flip-rtl" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ===== COL 3: Set Summary & Checkout Trigger (Desktop) ===== */}
        <div className="order-3 hidden lg:block w-full">
          <div className="bg-ivory rounded-2xl border border-cream overflow-hidden sticky top-24 shadow-sm">
            {/* Header */}
            <div className="px-5 py-4 border-b border-cream">
              <h3 className="font-serif text-base font-bold text-espresso">{t('mix.yourSelection')}</h3>
              <p className="text-xs text-espresso/50 mt-0.5">
                {lang === 'ar' ? `طقمك الملكي المنسق مع خصم فوري ${discountPercent}٪` : `Your coordinated set with instant ${discountPercent}% discount`}
              </p>
            </div>

            {/* List of Selected Items */}
            <div className="p-4 space-y-3 max-h-[340px] overflow-y-auto">
              {slots.map((slot) => {
                const sel = selections[slot.type];
                const p = sel ? getProductById(sel.productId) : null;
                const v = p && sel ? p.variants[sel.variantIdx] : null;

                return (
                  <div
                    key={slot.type}
                    onClick={() => setActiveSlot(slot.type)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                      activeSlot === slot.type
                        ? 'border-espresso bg-sand/60'
                        : 'border-cream/60 bg-white hover:border-cream'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg bg-cream overflow-hidden flex-shrink-0">
                      {v ? (
                        <img src={v.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-espresso/30">
                          <slot.icon className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-espresso truncate">
                        {lang === 'ar' ? slot.labelAr : slot.label}
                      </div>
                      <div className="text-[11px] text-espresso/60 truncate">
                        {p ? (lang === 'ar' ? p.titleAr : p.title) : (lang === 'ar' ? 'غير مختار' : 'Not selected')}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-espresso font-mono">
                      {p ? formatPrice(p.price) : '—'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Totals & Add to Bag */}
            <div className="p-5 border-t border-cream bg-sand/30 space-y-3">
              <div className="flex justify-between text-xs text-espresso/60">
                <span>{lang === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span className="line-through font-mono">{formatPrice(setTotal)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm font-bold text-espresso">{t('cart.bundleDiscount')} ({discountPercent}%)</span>
                  <span className="block text-[10px] text-olive font-bold">{t('mix.bundleSave')}</span>
                </div>
                <span className="text-xl font-extrabold text-espresso font-mono">{formatPrice(bundlePrice)}</span>
              </div>

              {savings > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-olive bg-olive/10 font-bold rounded-xl px-3 py-2 border border-olive/20">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span>{lang === 'ar' ? `وفرت ${formatPrice(savings)} كطقم متكامل` : `Saved ${formatPrice(savings)}`}</span>
                </div>
              )}

              <button
                onClick={addSetToCart}
                disabled={!isComplete || addedFeedback}
                className={`w-full py-4 text-sm font-bold rounded-full magnetic-btn flex items-center justify-center gap-2 transition-all shadow-md ${
                  addedFeedback
                    ? 'bg-olive text-ivory'
                    : isComplete
                    ? 'bg-espresso text-ivory hover:bg-espresso-light active:scale-98'
                    : 'bg-cream text-espresso/40 cursor-not-allowed'
                }`}
              >
                {addedFeedback ? (
                  <>
                    <Check className="w-4 h-4" />
                    {lang === 'ar' ? 'تمت إضافة الطقم للحقيبة!' : 'Added!'}
                  </>
                ) : isComplete ? (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    {t('mix.addSetToCart')}
                    <ArrowRight className="w-4 h-4 flip-rtl" />
                  </>
                ) : (
                  <span>{lang === 'ar' ? `اختر (${requiredSlots.length - requiredSelected} متبقٍ)` : 'Complete selection'}</span>
                )}
              </button>

              <button
                onClick={reset}
                className="w-full py-1.5 text-xs text-espresso/40 hover:text-espresso transition-colors flex items-center justify-center gap-1 font-medium cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{t('mix.reset')}</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ── MOBILE FIXED BOTTOM STICKY BAR (Centered & Responsive) ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-ivory/95 backdrop-blur-xl border-t border-cream shadow-[0_-4px_30px_rgba(26,22,21,0.12)] px-4 py-3 pb-6">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-espresso/50 line-through font-mono">{formatPrice(setTotal)}</span>
              <span className="text-[10px] bg-olive/15 text-olive font-bold px-1.5 py-0.5 rounded">-{discountPercent}%</span>
            </div>
            <div className="text-base font-extrabold text-espresso font-mono leading-tight">{formatPrice(bundlePrice)}</div>
          </div>

          <button
            onClick={addSetToCart}
            disabled={!isComplete || addedFeedback}
            className={`flex-1 py-3.5 px-4 text-xs sm:text-sm font-bold rounded-full flex items-center justify-center gap-2 shadow-lg transition-all ${
              addedFeedback
                ? 'bg-olive text-ivory'
                : isComplete
                ? 'bg-espresso text-ivory active:scale-95'
                : 'bg-cream text-espresso/40 cursor-not-allowed'
            }`}
          >
            {addedFeedback ? (
              <>
                <Check className="w-4 h-4" />
                {lang === 'ar' ? 'تمت الإضافة!' : 'Added!'}
              </>
            ) : isComplete ? (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>{t('mix.addSetToCart')}</span>
              </>
            ) : (
              <span>{lang === 'ar' ? `اختر (${requiredSlots.length - requiredSelected} متبقٍ)` : 'Complete'}</span>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
