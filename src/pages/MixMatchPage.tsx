import { Sparkles, ShoppingBag } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { MixMatchStudio } from '@/components/MixMatchStudio';

export function MixMatchPage() {
  const { t, lang } = useApp();

  return (
    <div className="min-h-screen">
      {/* Hero header */}
      <div className="relative bg-espresso text-ivory py-16 lg:py-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(178,122,104,0.3), transparent 50%), radial-gradient(circle at 80% 30%, rgba(106,107,82,0.2), transparent 50%)',
          }}
        />
        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ivory/10 text-rose-dust text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            {lang === 'ar' ? 'تجربة تسوق تفاعلية فريدة' : 'A Unique Interactive Shopping Experience'}
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-semibold text-ivory text-balance leading-tight">
            {t('section.mixMatchTitle')}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-ivory/60 max-w-xl mx-auto leading-relaxed font-light">
            {lang === 'ar'
              ? 'صمم طقمك الملكي الكامل بنفسك — اختر الثوب أو الجلابية، الشماغ أو الشال، البشت، النفائس والسبح الكهرمان، ودهن العود المعتق مع تناسق ألوان حي. وفّر ١٥٪ عند اقتناء الطقم كاملاً.'
              : 'Design your complete imperial set — choose your Thobe, Shemagh, Royal Bisht, Amber Tasbih, and Aged Cambodian Oud with live color harmony. Save 15% on the full set.'}
          </p>

          {/* Quick guide steps */}
          <div className="mt-8 flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {(lang === 'ar'
              ? [
                  { num: '١', text: 'الثوب والجلابية' },
                  { num: '٢', text: 'الشماغ والشال' },
                  { num: '٣', text: 'البشت الملكي' },
                  { num: '٤', text: 'النفائس والسبح' },
                  { num: '٥', text: 'دهن العود وعطور الدار' },
                ]
              : [
                  { num: '1', text: 'Thobe' },
                  { num: '2', text: 'Shemagh' },
                  { num: '3', text: 'Royal Bisht' },
                  { num: '4', text: 'Amber & Gems' },
                  { num: '5', text: 'Maison Oud' },
                ]
            ).map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-rose-dust/20 text-rose-dust flex items-center justify-center text-xs font-semibold">
                  {step.num}
                </div>
                <span className="text-xs text-ivory/70 font-medium">{step.text}</span>
                {i < 4 && <span className="text-ivory/20 mx-1">→</span>}
              </div>
            ))}
          </div>

          {/* Savings highlight */}
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-olive/20 text-olive-light text-sm font-semibold border border-olive/30">
            <ShoppingBag className="w-4 h-4" />
            {lang === 'ar' ? 'وفّر ١٥٪ تلقائياً على الطقم الكامل' : 'Save 15% automatically on the complete set'}
          </div>
        </div>
      </div>

      {/* Studio */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <MixMatchStudio />
      </div>
    </div>
  );
}
