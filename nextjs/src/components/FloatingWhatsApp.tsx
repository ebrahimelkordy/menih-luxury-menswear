import { useState, useEffect } from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getSiteSettings, type SiteSettings, defaultSiteSettings } from '@/services/adminService';

export function FloatingWhatsApp() {
  const { lang, isRTL } = useApp();
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);

  const whatsappClean = (settings.contactWhatsapp || '+20 100 000 0000').replace(/\D/g, '');
  const greeting = encodeURIComponent(
    lang === 'ar'
      ? '?????? ???? ??????? ???????? ???????? ??? ????????? ?? ????? ??? ?? ??? ????.'
      : 'Hello Ezar Luxury Menswear, I would like to inquire about a bespoke order or collection.'
  );

  return (
    <aside
      aria-label={lang === 'ar' ? '???????? ???????? ??? ????????' : 'Live WhatsApp Chat'}
      className={`fixed bottom-6 z-40 transition-all duration-300 ${
        isRTL ? 'left-6' : 'right-6'
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <a
        href={`https://wa.me/${whatsappClean}?text=${greeting}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-3 px-4 py-3 bg-[#128C7E] hover:bg-[#075E54] text-white rounded-full shadow-[0_8px_25px_rgba(18,140,126,0.35)] hover:shadow-[0_12px_30px_rgba(18,140,126,0.5)] transition-all duration-300 active:scale-95 cursor-pointer border border-white/20"
        aria-label={lang === 'ar' ? '????? ???? ??? ????????' : 'Chat with us on WhatsApp'}
      >
        {/* Pulsing indicator ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 group-hover:opacity-60 animate-ping -z-10" />

        {/* WhatsApp Icon */}
        <div className="relative flex items-center justify-center">
          <MessageCircle className="w-5 h-5 fill-current text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-300 rounded-full border border-[#128C7E]" />
        </div>

        {/* Text / Label */}
        <div className="hidden sm:flex flex-col text-left rtl:text-right">
          <span className="text-[10px] uppercase tracking-wider text-white/80 font-medium leading-none">
            {lang === 'ar' ? '??????? ??????' : 'Royal Concierge'}
          </span>
          <span className="text-xs font-bold text-white leading-tight mt-0.5">
            {lang === 'ar' ? '????? ??? ????????' : 'Chat on WhatsApp'}
          </span>
        </div>

        <Sparkles className="w-3.5 h-3.5 text-amber-300 opacity-80 group-hover:rotate-12 transition-transform hidden sm:block" />
      </a>
    </aside>
  );
}

