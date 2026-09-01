import Link from 'next/link';
import type { CompanySettings } from '@/lib/types';
import { StructuralLine } from './StructuralLine';

interface FooterProps {
  settings: CompanySettings;
}

const FOOTER_LINKS = [
  { href: '/#projects', label: 'PROJECTS' },
  { href: '/#capabilities', label: 'CAPABILITIES' },
  { href: '/#process', label: 'PROCESS' },
  { href: '/#about', label: 'ABOUT' },
  { href: '/#contact', label: 'CONTACT' },
];

export function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-graphite text-concrete">
      {/* Top structural line */}
      <div className="h-0.5 bg-safety" />

      <div className="section-padding-lg py-16 md:py-24">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand block */}
          <div className="md:col-span-5">
            <div className="font-display text-4xl md:text-5xl font-bold tracking-tightest">
              KORDY
            </div>
            <div className="mt-1 font-arabic text-lg text-concrete/60" dir="rtl">
              {settings.company_name_ar}
            </div>
            <div className="mt-6 tech-label-sm text-concrete/40 max-w-xs">
              {settings.company_name.toUpperCase()} — METAL CONSTRUCTION &amp; STEEL FABRICATION
            </div>
            {settings.address && (
              <div className="mt-8 tech-label-sm text-concrete/50">
                LOCATION
                <div className="mt-1 text-sm text-concrete/70 normal-case tracking-normal">
                  {settings.address}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <div className="tech-label-sm text-concrete/40 mb-6">NAVIGATION</div>
            <ul className="space-y-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-concrete/70 hover:text-safety transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <div className="tech-label-sm text-concrete/40 mb-6">CONTACT</div>
            <div className="space-y-3">
              {settings.phone && (
                <div>
                  <div className="tech-label-sm text-concrete/30">PHONE</div>
                  <a href={`tel:${settings.phone}`} className="text-sm text-concrete/70 hover:text-safety transition-colors">
                    {settings.phone}
                  </a>
                </div>
              )}
              {settings.whatsapp && (
                <div>
                  <div className="tech-label-sm text-concrete/30">WHATSAPP</div>
                  <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-concrete/70 hover:text-safety transition-colors">
                    {settings.whatsapp}
                  </a>
                </div>
              )}
              {settings.email && (
                <div>
                  <div className="tech-label-sm text-concrete/30">EMAIL</div>
                  <a href={`mailto:${settings.email}`} className="text-sm text-concrete/70 hover:text-safety transition-colors">
                    {settings.email}
                  </a>
                </div>
              )}
              <div className="flex gap-4 pt-2">
                {settings.facebook && <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="tech-label-sm text-concrete/50 hover:text-safety transition-colors">FACEBOOK</a>}
                {settings.instagram && <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="tech-label-sm text-concrete/50 hover:text-safety transition-colors">INSTAGRAM</a>}
                {settings.linkedin && <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="tech-label-sm text-concrete/50 hover:text-safety transition-colors">LINKEDIN</a>}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-concrete/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="tech-label-sm text-concrete/40">
            © {new Date().getFullYear()} {settings.company_name.toUpperCase()} — ALL RIGHTS RESERVED
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="tech-label-sm text-concrete/30 hover:text-safety transition-colors">
              ADMIN
            </Link>
            <span className="tech-label-sm text-concrete/20">|</span>
            <span className="tech-label-sm text-concrete/30">EGYPT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
