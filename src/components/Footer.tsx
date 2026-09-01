import { useState, useEffect } from 'react';
import { Instagram, Facebook, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { categories } from '@/services/mockData';
import { getSiteSettings, type SiteSettings, defaultSiteSettings } from '@/services/adminService';
import { useRouter } from '@/router';

export function Footer() {
  const { t, lang } = useApp();
  const { navigate } = useRouter();
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);

  const whatsappClean = (settings.contactWhatsapp || '+20 100 000 0000').replace(/\D/g, '');

  return (
    <footer className="bg-espresso text-ivory mt-20 border-t border-ivory/10">
      {/* Links */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-4">
          <div>
            <span className="font-serif text-2xl font-bold tracking-[0.25em] text-ivory">MENIH</span>
            <span className="block text-[9px] tracking-[0.3em] text-terracotta uppercase font-medium mt-0.5">
              {lang === 'ar' ? 'المنيع للرجال' : 'Luxury Menswear'}
            </span>
          </div>
          <p className="text-xs text-ivory/60 leading-relaxed max-w-xs">
            {t('footer.aboutText')}
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs text-ivory/50">
            <MapPin className="w-3.5 h-3.5 text-terracotta flex-shrink-0" />
            <span>{lang === 'ar' ? (settings.addressAr || settings.address) : settings.address}</span>
          </div>
          <p className="text-[10px] text-terracotta font-medium tracking-wider uppercase">
            ✦ {t('footer.madeInEgypt')} ✦
          </p>
        </div>

        {/* Shop Collections */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-ivory/80 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
            {t('footer.shop')}
          </h4>
          <ul className="space-y-2.5">
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => navigate({ name: 'shop', category: cat.id })}
                  className="text-xs sm:text-sm text-ivory/60 hover:text-ivory transition-colors"
                >
                  {lang === 'ar' ? cat.nameAr : cat.name}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => navigate({ name: 'mix-match' })}
                className="text-xs sm:text-sm text-terracotta/90 hover:text-terracotta transition-colors font-medium flex items-center gap-1"
              >
                <span>✦</span>
                <span>{t('nav.mixMatch')}</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Client Services & Help */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-ivory/80 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
            {t('footer.help')}
          </h4>
          <ul className="space-y-2.5 text-xs sm:text-sm">
            <li>
              <button
                onClick={() => navigate({ name: 'track' })}
                className="text-terracotta hover:underline transition-colors font-semibold text-left"
              >
                {lang === 'ar' ? 'تتبع حالة طلبك وشحنتك' : 'Track Your Order'}
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate({ name: 'contact' })}
                className="text-ivory/60 hover:text-ivory transition-colors font-medium text-left"
              >
                {lang === 'ar' ? 'خدمة الاستقبال والتواصل الملكي' : 'Royal Concierge & Contact'}
              </button>
            </li>
            <li>
              <a href={`https://wa.me/${whatsappClean}`} target="_blank" rel="noopener noreferrer" className="text-ivory/60 hover:text-ivory transition-colors">
                {lang === 'ar' ? 'المساعدة الفورية عبر الواتساب' : 'Instant WhatsApp Help'}
              </a>
            </li>
            <li>
              <span className="text-ivory/40">{t('footer.shipping')} ({lang === 'ar' ? 'شحن فوري مأمون' : 'Secure Express'})</span>
            </li>
            <li>
              <span className="text-ivory/40">{t('footer.sizeGuide')} ({lang === 'ar' ? 'تفصيل مخصص' : 'Bespoke Tailoring'})</span>
            </li>
          </ul>
        </div>

        {/* Connect & Social */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-ivory/80 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
            {t('footer.connect')}
          </h4>
          <div className="flex gap-2.5 mb-5">
            {settings.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-ivory/10 hover:bg-terracotta hover:text-espresso flex items-center justify-center transition-all cursor-pointer"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {settings.facebookUrl && (
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-ivory/10 hover:bg-terracotta hover:text-espresso flex items-center justify-center transition-all cursor-pointer"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}
            <a
              href={`https://wa.me/${whatsappClean}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-ivory/10 hover:bg-emerald-500 hover:text-ivory flex items-center justify-center transition-all cursor-pointer"
              title="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            {settings.contactEmail && (
              <a
                href={`mailto:${settings.contactEmail}`}
                className="w-9 h-9 rounded-xl bg-ivory/10 hover:bg-terracotta hover:text-espresso flex items-center justify-center transition-all cursor-pointer"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
          </div>
          <div className="space-y-1 text-xs text-ivory/50">
            <div className="flex items-center gap-2 font-mono" dir="ltr">
              <Phone className="w-3.5 h-3.5 text-terracotta flex-shrink-0" />
              <span>{settings.contactPhone}</span>
            </div>
            <div className="flex items-center gap-2 font-mono" dir="ltr">
              <Mail className="w-3.5 h-3.5 text-terracotta flex-shrink-0" />
              <span>{settings.contactEmail}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-ivory/10">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-ivory/40">
            © {new Date().getFullYear()} Ezar. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate({ name: 'contact' })}
              className="text-xs text-ivory/40 hover:text-ivory/70 transition-colors cursor-pointer"
            >
              {lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </button>
            <span className="text-ivory/20">•</span>
            <button
              onClick={() => navigate({ name: 'admin' })}
              className="text-xs text-terracotta/80 hover:text-terracotta transition-colors flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>{lang === 'ar' ? 'بوابة الإدارة' : 'Admin Portal'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
