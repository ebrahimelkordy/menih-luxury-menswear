import { useEffect, useState, useRef } from 'react';
import { ArrowRight, Sparkles, Star, Quote, Eye } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { heroImages, categories, getFeaturedProducts, trendingSearches } from '@/services/mockData';
import { getSiteSettings, getCachedSiteSettings, getAdminTestimonials, type SiteSettings, type TestimonialItem, defaultSiteSettings, defaultTestimonials } from '@/services/adminService';
import { useRouter } from '@/router';
import { ProductCard } from '@/components/ProductCard';
import { MixMatchStudio } from '@/components/MixMatchStudio';
import { LazyImage } from '@/components/LazyImage';

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return y;
}

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
}

export function HomePage() {
  const { t, lang } = useApp();
  const { navigate } = useRouter();
  const scrollY = useScrollY();
  const featured = getFeaturedProducts();

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(getCachedSiteSettings);
  const [testimonialsList, setTestimonialsList] = useState<TestimonialItem[]>(defaultTestimonials);

  useEffect(() => {
    getSiteSettings().then(setSiteSettings);
    getAdminTestimonials().then(setTestimonialsList);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* ===== CINEMATIC HERO ===== */}
      <section className="relative h-screen min-h-[680px] overflow-hidden bg-espresso">
        {/* Parallax background */}
        <div
          className="absolute inset-0 will-change-transform"
          style={{ transform: `translateY(${scrollY * 0.4}px) scale(1.05)` }}
        >
          <LazyImage
            src={siteSettings.heroImage || '/images/thobe-gandoura.jpg'}
            alt=""
            priority={true}
            className="w-full h-full"
            style={{ filter: 'brightness(0.62) contrast(1.08)' }}
          />
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/30 to-espresso/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-espresso/50 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative h-full flex items-center">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-10 w-full">
            <div className="max-w-2xl">
              <div
                className="flex items-center gap-2.5 mb-5 animate-fade-in"
                style={{ animationDelay: '0.15s', opacity: 0 }}
              >
                <div className="h-px w-10 bg-rose-dust" />
                <span className="text-[11px] tracking-[0.3em] uppercase text-rose-dust font-medium">
                  {t('hero.tagline')}
                </span>
              </div>

              <h1
                className="font-serif text-display text-ivory font-semibold leading-[1.02] whitespace-pre-line animate-fade-up"
                style={{ animationDelay: '0.3s', opacity: 0 }}
              >
                {t('hero.title')}
              </h1>

              <p
                className="mt-6 text-base sm:text-lg text-ivory/65 max-w-lg leading-relaxed font-light animate-fade-up"
                style={{ animationDelay: '0.5s', opacity: 0 }}
              >
                {t('hero.subtitle')}
              </p>

              <div
                className="mt-9 flex flex-col sm:flex-row gap-3 animate-fade-up"
                style={{ animationDelay: '0.7s', opacity: 0 }}
              >
                <button
                  onClick={() => navigate({ name: 'shop' })}
                  className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-ivory text-espresso text-sm font-semibold rounded-full magnetic-btn hover:bg-cream"
                >
                  {t('hero.cta')}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => navigate({ name: 'mix-match' })}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-ivory/25 text-ivory text-sm font-semibold rounded-full magnetic-btn hover:bg-ivory/10 backdrop-blur-sm"
                >
                  <Sparkles className="w-4 h-4 text-rose-dust" />
                  {t('hero.ctaSecondary')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '1.2s', opacity: 0 }}>
          <span className="text-[10px] tracking-[0.2em] uppercase text-ivory/40">{lang === 'ar' ? '?????' : 'Scroll'}</span>
          <div className="w-px h-12 bg-gradient-to-b from-ivory/40 to-transparent" />
        </div>
      </section>

      {/* ===== EDITORIAL QUOTE BANNER ===== */}
      <section className="py-24 bg-ivory">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Quote className="w-10 h-10 text-terracotta/30 mx-auto mb-6" />
          <p className="font-serif text-2xl sm:text-3xl lg:text-4xl text-espresso leading-relaxed text-balance italic">
            {lang === 'ar'
              ? '"?????? ??????? ???? ???? ???? — ?? ??? ????? ?? ??????? ????????. ?? ???? ?? ???? ????? ????? ?????? ?????? ???? ??????? ?????? ??????."'
              : '"Prestige and dignity are not merely about appearance — they are reflections of values and heritage. Every piece at Ezar is crafted to command presence worthy of your status and legacy."'}
          </p>
          <div className="mt-6 text-sm text-espresso/40 tracking-wider">
            — {lang === 'ar' ? '??????? ????' : 'Founder, Ezar'}
          </div>
        </div>
      </section>

      {/* ===== SHOP BY CATEGORY — Editorial Grid ===== */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-10 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-px w-8 bg-terracotta" />
              <span className="text-[11px] tracking-[0.25em] uppercase text-terracotta">{lang === 'ar' ? '????' : 'Explore'}</span>
            </div>
            <h2 className="font-serif text-headline font-semibold text-espresso">{t('section.shopByCategory')}</h2>
          </div>
          <button
            onClick={() => navigate({ name: 'shop' })}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-espresso link-underline"
          >
            {lang === 'ar' ? '??? ????' : 'View All'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Asymmetric editorial grid */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-5">
          {/* Large feature — Niqab */}
          <button
            onClick={() => navigate({ name: 'shop', category: categories[0].id })}
            className="group hover-zoom relative overflow-hidden rounded-2xl col-span-2 lg:col-span-6 aspect-[4/5] lg:aspect-[5/6]"
          >
            <LazyImage src={categories[0].image} alt="" className="editorial-image" />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
              <span className="text-[10px] tracking-[0.25em] uppercase text-rose-dust mb-2 block">{lang === 'ar' ? '?????? ?????' : 'Featured Collection'}</span>
              <h3 className="font-serif text-2xl lg:text-3xl font-semibold text-ivory">{lang === 'ar' ? categories[0].nameAr : categories[0].name}</h3>
              <p className="text-sm text-ivory/60 mt-1.5 max-w-xs">{lang === 'ar' ? categories[0].descriptionAr : categories[0].description}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 text-sm text-rose-dust">
                <span>{lang === 'ar' ? '???? ????' : 'Shop Now'}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </button>

          {/* Medium cards */}
          {categories.slice(1, 3).map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate({ name: 'shop', category: cat.id })}
              className="group hover-zoom relative overflow-hidden rounded-2xl col-span-1 lg:col-span-3 aspect-[3/4]"
            >
              <LazyImage src={cat.image} alt="" className="editorial-image" />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-serif text-lg font-semibold text-ivory">{lang === 'ar' ? cat.nameAr : cat.name}</h3>
                <p className="text-xs text-ivory/50 mt-1 line-clamp-1">{lang === 'ar' ? cat.descriptionAr : cat.description}</p>
              </div>
            </button>
          ))}

          {/* Bottom row */}
          {categories.slice(3).map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate({ name: 'shop', category: cat.id })}
              className="group hover-zoom relative overflow-hidden rounded-2xl col-span-1 lg:col-span-6 aspect-[16/9] lg:aspect-[16/7]"
            >
              <LazyImage src={cat.image} alt="" className="editorial-image" />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-7">
                <h3 className="font-serif text-xl lg:text-2xl font-semibold text-ivory">{lang === 'ar' ? cat.nameAr : cat.name}</h3>
                <p className="text-xs text-ivory/50 mt-1">{lang === 'ar' ? cat.descriptionAr : cat.description}</p>
                <div className="mt-2 inline-flex items-center gap-1 text-xs text-rose-dust">
                  <span>{lang === 'ar' ? '????' : 'Shop'}</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <RevealSection>
        <section className="max-w-[1440px] mx-auto px-6 lg:px-10 py-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="h-px w-8 bg-terracotta" />
                <span className="text-[11px] tracking-[0.25em] uppercase text-terracotta">{lang === 'ar' ? '???????' : 'Handpicked'}</span>
              </div>
              <h2 className="font-serif text-headline font-semibold text-espresso">{t('section.featured')}</h2>
              <p className="mt-2 text-sm text-espresso/50">{t('section.featuredSub')}</p>
            </div>
            <button
              onClick={() => navigate({ name: 'shop' })}
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-espresso link-underline"
            >
              {lang === 'ar' ? '??? ????' : 'View All'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {featured.slice(0, 8).map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ===== EDITORIAL SPLIT — The Craft ===== */}
      <RevealSection>
        <section className="bg-espresso text-ivory py-24 lg:py-32 overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Image side */}
              <div className="relative">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden hover-zoom">
                  <LazyImage src={heroImages.thobeGandoura} alt="" className="editorial-image" />
                </div>
                {/* Floating accent image */}
                <div className="absolute -bottom-8 -right-4 lg:-right-8 w-40 h-52 lg:w-56 lg:h-72 rounded-xl overflow-hidden shadow-2xl border-4 border-espresso hidden sm:block animate-float">
                  <LazyImage src={heroImages.tasbihAgateRing} alt="" className="editorial-image" />
                </div>
              </div>

              {/* Text side */}
              <div className="lg:pl-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="h-px w-10 bg-rose-dust" />
                  <span className="text-[11px] tracking-[0.3em] uppercase text-rose-dust">{t('section.editorial')}</span>
                </div>
                <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-ivory text-balance leading-tight">
                  {lang === 'ar'
                    ? '????? ????? ?????? ???? ?????? ?????? ???????'
                    : 'Bespoke tailoring and detailing worthy of presence and status'}
                </h2>
                <p className="mt-5 text-base text-ivory/60 leading-relaxed font-light">
                  {lang === 'ar'
                    ? '???? ?????? ?? ???? ??????? ???? ??????? ?????????? — ?? ???? ??? ?????? ???????? ??????? ???? ?????? ??????? ??????? ???? ????? ?????? ??????. ???? ????? ????? ????? ????? ?? ?????? ?????? ????? ????.'
                    : 'Every piece at Ezar begins with selecting the finest raw materials—premium cold Japanese Toyobo cotton, hand-spun wool, and genuine zaree gold thread. We tailor with patience to deliver a majestic presence worthy of your trust.'}
                </p>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  {[
                    { icon: '?', title: lang === 'ar' ? '????? ??????' : 'Imperial Fabrics', desc: lang === 'ar' ? '??? ?????? ???? ????? ?????' : 'Japanese cotton & natural fine wool' },
                    { icon: '?', title: lang === 'ar' ? '????? ????? ?????' : 'Arabian Craftsmanship', desc: lang === 'ar' ? '????? ???? ????? ?????? ?????' : 'Meticulous details by master tailors' },
                    { icon: '?', title: lang === 'ar' ? '???? ???? ??????' : 'Breathable Comfort', desc: lang === 'ar' ? '????? ???? ???? ????? ?? ?? ???? ?????' : 'Stay fresh and wrinkle-free all day' },
                    { icon: '?', title: lang === 'ar' ? '????? ?????? ????' : 'Imperial Concierge', desc: lang === 'ar' ? '??? ???? ?????? ???? ??? ?????????' : 'Tailored delivery to all governorates' },
                  ].map((f, i) => (
                    <div key={i} className="p-4 bg-ivory/5 rounded-xl border border-ivory/10">
                      <div className="text-terracotta text-lg mb-1.5">{f.icon}</div>
                      <div className="text-sm font-medium text-ivory">{f.title}</div>
                      <div className="text-xs text-ivory/40 mt-0.5">{f.desc}</div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate({ name: 'shop' })}
                  className="mt-8 inline-flex items-center gap-2.5 px-8 py-4 bg-ivory text-espresso text-sm font-semibold rounded-full magnetic-btn"
                >
                  {lang === 'ar' ? '?????? ?????????' : 'Discover the Collection'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ===== MIX & MATCH STUDIO ===== */}
      <RevealSection>
        <section className="bg-sand py-24">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terracotta/10 text-terracotta text-xs font-medium mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                {lang === 'ar' ? '????? ??????? ?????' : 'A Unique Interactive Experience'}
              </div>
              <h2 className="font-serif text-headline font-semibold text-espresso">{t('section.mixMatchTitle')}</h2>
              <p className="mt-3 text-sm text-espresso/50 max-w-lg mx-auto">{t('section.mixMatchSub')}</p>
            </div>
            <MixMatchStudio />
          </div>
        </section>
      </RevealSection>

      {/* ===== DUAL EDITORIAL BANNER ===== */}
      <RevealSection>
        <section className="max-w-[1440px] mx-auto px-6 lg:px-10 py-16">
          <div className="grid md:grid-cols-2 gap-5">
            {/* Banner 1 */}
            <div className="relative aspect-[4/5] md:aspect-[3/4] rounded-2xl overflow-hidden hover-zoom group">
              <LazyImage src={heroImages.bishtRoyal} alt="" className="editorial-image" />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 p-6 lg:p-8">
                <span className="text-[10px] tracking-[0.25em] uppercase text-rose-dust">{lang === 'ar' ? '??? ????' : 'Royal Bisht'}</span>
                <h3 className="font-serif text-xl lg:text-2xl font-semibold text-ivory mt-2">
                  {lang === 'ar' ? '????? ????? ????????? ????????' : 'Ceremonial Robes for Majestic Events'}
                </h3>
                <button
                  onClick={() => navigate({ name: 'shop', category: 'bisht' })}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm text-ivory/80 hover:text-ivory transition-colors"
                >
                  {lang === 'ar' ? '???? ??????' : 'Shop Bisht'}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Banner 2 */}
            <div className="relative aspect-[4/5] md:aspect-[3/4] rounded-2xl overflow-hidden hover-zoom group">
              <LazyImage src={heroImages.oudPerfume} alt="" className="editorial-image" />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 p-6 lg:p-8">
                <span className="text-[10px] tracking-[0.25em] uppercase text-rose-dust">{lang === 'ar' ? '???? ????' : 'Oud & Fragrances'}</span>
                <h3 className="font-serif text-xl lg:text-2xl font-semibold text-ivory mt-2">
                  {lang === 'ar' ? '???? ????? ???? ????? ??????' : 'Aromatic Masterpieces of the House'}
                </h3>
                <button
                  onClick={() => navigate({ name: 'shop', category: 'fragrances' })}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm text-ivory/80 hover:text-ivory transition-colors"
                >
                  {lang === 'ar' ? '???? ?????? ??????' : 'Shop Oud & Perfumes'}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ===== TESTIMONIALS ===== */}
      <RevealSection>
        <section className="max-w-[1440px] mx-auto px-6 lg:px-10 py-16 pb-24">
          <div className="text-center mb-12">
            <div className="flex items-center gap-2.5 mb-3 justify-center">
              <div className="h-px w-8 bg-terracotta" />
              <span className="text-[11px] tracking-[0.25em] uppercase text-terracotta">{lang === 'ar' ? '??????' : 'Testimonials'}</span>
              <div className="h-px w-8 bg-terracotta" />
            </div>
            <h2 className="font-serif text-headline font-semibold text-espresso">{t('section.testimonials')}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonialsList.slice(0, 3).map((review, i) => (
              <div key={review.id || i} className="p-6 bg-cream/20 rounded-2xl border border-cream/40 hover:border-terracotta/20 transition-colors group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-cream">
                    <LazyImage src={review.image || heroImages.bishtRoyal} alt="" className="editorial-image" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-espresso">{lang === 'ar' ? review.nameAr : review.name}</div>
                    <div className="text-xs text-espresso/40">{lang === 'ar' ? review.cityAr : review.city}</div>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(review.rating || 5)].map((_, j) => (
                        <Star key={j} className="w-3 h-3 fill-terracotta text-terracotta" />
                      ))}
                    </div>
                  </div>
                  <Quote className="w-5 h-5 text-terracotta/20 flex-shrink-0" />
                </div>
                <p className="text-sm text-espresso/65 leading-relaxed italic">"{lang === 'ar' ? review.reviewAr : review.review}"</p>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ===== EYE CANDY — Full Width Visual ===== */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <LazyImage
          src={heroImages.heroVeiledMan}
          alt=""
          className="w-full h-full"
          style={{ filter: 'brightness(0.65) contrast(1.1)' }}
        />
        <div className="absolute inset-0 bg-espresso/30 flex items-center justify-center">
          <div className="text-center px-6">
            <Eye className="w-8 h-8 text-ivory/60 mx-auto mb-4" />
            <p className="font-serif text-2xl lg:text-4xl text-ivory italic text-balance max-w-2xl">
              {lang === 'ar'
                ? '?????? ??????? ???? ?? ?????? ??????? ???? ??????'
                : 'Presence and dignity lie in the details of heritage that we weave'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function RevealSection({ children }: { children: React.ReactNode }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 0.8s cubic-bezier(0.25,1,0.5,1), transform 0.8s cubic-bezier(0.25,1,0.5,1)',
      }}
    >
      {children}
    </div>
  );
}

