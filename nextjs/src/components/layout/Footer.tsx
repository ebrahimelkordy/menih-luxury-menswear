'use client';

import Link from 'next/link';
import { ExternalLink, Phone, MessageCircle } from 'lucide-react';
import type { SiteSettings } from '@/lib/types';
import { useApp } from '@/context/AppContext';

export default function Footer({ settings }: { settings: SiteSettings | null }) {
  const { lang, isRTL } = useApp();

  return (
    <footer className="bg-espresso text-ivory pt-16 pb-8">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-light tracking-[0.2em] mb-2">MENIH</h3>
            <p className="text-[9px] tracking-[0.3em] text-gold uppercase mb-4">Maison Luxury</p>
            <p className="text-ivory/60 text-sm leading-relaxed max-w-xs">
              {lang === 'ar'
                ? 'دار للأزياء الرجالية الفاخرة المستوحاة من عراقة التراث العربي الأصيل.'
                : 'A house of luxury Arabian menswear rooted in heritage and crafted for the modern gentleman.'}
            </p>
            <div className="flex gap-4 mt-6">
              {settings?.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-ivory/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {settings?.contactWhatsapp && (
                <a href={`https://wa.me/${settings.contactWhatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-ivory/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
              {settings?.contactPhone && (
                <a href={`tel:${settings.contactPhone}`}
                  className="w-9 h-9 rounded-full border border-ivory/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                  <Phone className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-gold mb-4">
              {lang === 'ar' ? 'المجموعات' : 'Collections'}
            </h4>
            <ul className="space-y-2 text-sm text-ivory/60">
              {[
                { href: '/shop/thobe', ar: 'الثياب', en: 'Thobes' },
                { href: '/shop/shemagh', ar: 'الأشمغة', en: 'Shemaghs' },
                { href: '/shop/bisht', ar: 'البشوت', en: 'Bishts' },
                { href: '/shop/fragrances', ar: 'العطور', en: 'Fragrances' },
                { href: '/shop/accessories', ar: 'الإكسسوارات', en: 'Accessories' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-gold transition-colors">
                    {isRTL ? l.ar : l.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Admin */}
          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-gold mb-4">
              {lang === 'ar' ? 'الدار' : 'The House'}
            </h4>
            <ul className="space-y-2 text-sm text-ivory/60">
              <li>
                <Link href="/mix-match" className="hover:text-gold transition-colors">
                  {lang === 'ar' ? 'منسق الأطقم' : 'Mix & Match Studio'}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-gold transition-colors text-ivory/30 text-xs">
                  {lang === 'ar' ? 'بوابة الإدارة' : 'Admin Portal'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ivory/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-ivory/30 text-xs">
            © {new Date().getFullYear()} إزار — MENIH Luxury. {lang === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.
          </p>
          <p className="text-gold/40 text-xs tracking-widest">
            {lang === 'ar' ? 'صُنع في مصر بعناية وأصالة' : 'Crafted in Egypt with Heritage & Pride'}
          </p>
        </div>
      </div>
    </footer>
  );
}

