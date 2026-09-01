import { Sparkles, ShoppingBag } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { MixMatchStudio } from '@/components/MixMatchStudio';

export function MixMatchPage() {
  const { t, lang } = useApp();

  return (
    <div className="min-h-screen">
      {/* Hero header */}
      <div className="relative bg-espresso text-ivory py-8 sm:py-12 lg:py-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(178,122,104,0.3), transparent 50%), radial-gradient(circle at 80% 30%, rgba(106,107,82,0.2), transparent 50%)',
          }}
        />
        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ivory/10 text-rose-dust text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {lang === 'ar' ? 'منسق الأطقم الملكي التفاعلي' : 'Interactive Imperial Coordinate Studio'}
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-semibold text-ivory text-balance leading-tight">
            {t('section.mixMatchTitle')}
          </h1>
          <p className="mt-2.5 text-xs sm:text-sm text-ivory/60 max-w-xl mx-auto leading-relaxed font-light hidden sm:block">
            {lang === 'ar'
              ? 'صمم طقمك الملكي الكامل بنفسك — اختر الثوب، الشماغ، البشت، السبح، والعود مع خصم فوري ١٥٪ كطقم متكامل.'
              : 'Design your complete imperial set — choose your Thobe, Shemagh, Royal Bisht, Amber Tasbih, and Aged Cambodian Oud with live color harmony and 15% discount.'}
          </p>

          {/* Savings highlight */}
          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-olive/20 text-olive-light text-xs font-semibold border border-olive/30">
            <ShoppingBag className="w-3.5 h-3.5" />
            {lang === 'ar' ? 'وفّر ١٥٪ تلقائياً على الطقم الكامل' : 'Save 15% automatically on the complete set'}
          </div>
        </div>
      </div>

      {/* Studio */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
        <MixMatchStudio />
      </div>
    </div>
  );
}
