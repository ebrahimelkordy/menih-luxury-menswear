'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { CompanySettings } from '@/lib/types';
import { StructuralLine } from './StructuralLine';
import { TechnicalMarker } from './TechnicalMarker';
import { Phone, Mail, MessageCircle, MapPin } from 'lucide-react';

interface ContactCTAProps {
  settings: CompanySettings;
}

export function ContactCTA({ settings }: ContactCTAProps) {
  return (
    <section id="contact" className="relative py-24 md:py-40 bg-concrete-50/50">
      <div className="section-padding-lg">
        {/* Section marker */}
        <div className="flex items-center gap-3 mb-12 md:mb-20">
          <TechnicalMarker number="06" label="CONTACT" />
          <StructuralLine className="flex-1 max-w-32" />
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-8">
          {/* Large CTA */}
          <motion.div
            className="col-span-12 lg:col-span-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-display text-display-lg font-bold tracking-tightest text-graphite leading-[0.9]">
              {settings.final_cta_title.split(' ').slice(0, -1).join(' ')}
              <br />
              <span className="text-safety">{settings.final_cta_title.split(' ').slice(-1)[0]}</span>
            </h2>

            <p className="mt-8 max-w-lg text-sm md:text-base text-foreground/60 leading-relaxed">
              {settings.final_cta_description}
            </p>

            <Link
              href={settings.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}` : settings.email ? `mailto:${settings.email}` : '/#contact'}
              className="group mt-10 inline-flex items-center gap-4 border-b-2 border-foreground pb-2 hover:border-safety transition-colors duration-300"
            >
              <span className="tech-label font-medium text-base group-hover:text-safety transition-colors">
                {settings.final_cta_button}
              </span>
              <span className="inline-block w-8 h-px bg-foreground group-hover:bg-safety group-hover:w-14 transition-all duration-300" />
            </Link>
          </motion.div>

          {/* Contact info */}
          <motion.div
            className="col-span-12 lg:col-span-4 self-end"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="space-y-0">
              {settings.address && (
                <div className="flex items-center justify-between py-4 border-t border-foreground/10">
                  <span className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-foreground/40" />
                    <span className="tech-label-sm text-foreground/40">LOCATION</span>
                  </span>
                  <span className="text-sm text-foreground/70 text-right max-w-[60%]">
                    {settings.address}
                  </span>
                </div>
              )}
              {settings.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-4 border-t border-foreground/10 group"
                >
                  <span className="flex items-center gap-3">
                    <MessageCircle className="w-4 h-4 text-foreground/40 group-hover:text-safety transition-colors" />
                    <span className="tech-label-sm text-foreground/40">WHATSAPP</span>
                  </span>
                  <span className="text-sm text-foreground/70 group-hover:text-safety transition-colors">
                    {settings.whatsapp}
                  </span>
                </a>
              )}
              {settings.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center justify-between py-4 border-t border-foreground/10 group"
                >
                  <span className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-foreground/40 group-hover:text-safety transition-colors" />
                    <span className="tech-label-sm text-foreground/40">PHONE</span>
                  </span>
                  <span className="text-sm text-foreground/70 group-hover:text-safety transition-colors">
                    {settings.phone}
                  </span>
                </a>
              )}
              {settings.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center justify-between py-4 border-t border-b border-foreground/10 group"
                >
                  <span className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-foreground/40 group-hover:text-safety transition-colors" />
                    <span className="tech-label-sm text-foreground/40">EMAIL</span>
                  </span>
                  <span className="text-sm text-foreground/70 group-hover:text-safety transition-colors">
                    {settings.email}
                  </span>
                </a>
              )}
              {!settings.phone && !settings.email && !settings.whatsapp && (
                <div className="py-8 border-t border-b border-foreground/10 text-center">
                  <p className="tech-label-sm text-foreground/30">
                    CONTACT INFO COMING SOON
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Map embed */}
        {settings.map_embed_url && (
          <motion.div
            className="mt-16 md:mt-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block w-1.5 h-1.5 bg-safety" />
              <span className="tech-label-sm text-foreground/40">LOCATION MAP</span>
              <StructuralLine className="flex-1 max-w-32" />
            </div>
            <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden border border-foreground/10">
              {/* Frame markers */}
              <div className="absolute -top-px -left-px w-4 h-px bg-safety z-10" />
              <div className="absolute -top-px -left-px h-4 w-px bg-safety z-10" />
              <div className="absolute -bottom-px -right-px w-4 h-px bg-safety z-10" />
              <div className="absolute -bottom-px -right-px h-4 w-px bg-safety z-10" />
              <iframe
                src={settings.map_embed_url}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(40%) contrast(1.05)' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Al-Kordy Contracting location map"
              />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
