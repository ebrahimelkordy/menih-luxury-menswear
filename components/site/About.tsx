'use client';

import { motion } from 'framer-motion';
import type { CompanySettings } from '@/lib/types';
import { StructuralLine } from './StructuralLine';
import { TechnicalMarker } from './TechnicalMarker';

interface AboutProps {
  settings: CompanySettings;
}

const ABOUT_IMAGE = 'https://images.pexels.com/photos/31318408/pexels-photo-31318408.jpeg?auto=compress&cs=tinysrgb&h=900&w=700';

export function About({ settings }: AboutProps) {
  return (
    <section id="about" className="relative py-24 md:py-40 overflow-hidden">
      <div className="section-padding-lg">
        {/* Section marker */}
        <div className="flex items-center gap-3 mb-12 md:mb-20">
          <TechnicalMarker number="02" label="ABOUT" />
          <StructuralLine className="flex-1 max-w-32" />
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-8">
          {/* Large statement */}
          <motion.div
            className="col-span-12 lg:col-span-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-display text-display-md font-medium tracking-tightest text-graphite leading-[0.9]">
              BUILT AROUND
              <br />
              <span className="text-safety">PRECISION.</span>
            </h2>
          </motion.div>

          {/* Image */}
          <motion.div
            className="col-span-12 lg:col-span-4 lg:row-start-2 lg:row-span-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <div className="absolute -top-2 -right-2 w-4 h-px bg-safety z-10" />
              <div className="absolute -top-2 -right-2 h-4 w-px bg-safety z-10" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ABOUT_IMAGE}
                alt="Welder focused on steel fabrication work"
                className="w-full h-full object-cover grayscale-[15%]"
                loading="lazy"
              />
            </div>
            <div className="mt-3 flex items-center gap-3">
              <span className="tech-label-sm text-safety">FIG.02</span>
              <span className="tech-label-sm text-foreground/40">FABRICATION — WELDING</span>
            </div>
          </motion.div>

          {/* Company info grid */}
          <motion.div
            className="col-span-12 lg:col-span-4 lg:row-start-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p className="text-sm md:text-base text-foreground/60 leading-relaxed max-w-md">
              {settings.about}
            </p>

            <div className="mt-10 space-y-0">
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-foreground/10">
                <span className="tech-label-sm text-foreground/40">COMPANY</span>
                <span className="text-sm text-foreground/80">{settings.company_name}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-foreground/10">
                <span className="tech-label-sm text-foreground/40">FIELD</span>
                <span className="text-sm text-foreground/80">METAL CONSTRUCTION</span>
              </div>
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-foreground/10">
                <span className="tech-label-sm text-foreground/40">LOCATION</span>
                <span className="text-sm text-foreground/80">{settings.address || 'EGYPT'}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-foreground/10">
                <span className="tech-label-sm text-foreground/40">STATUS</span>
                <span className="text-sm text-foreground/80 flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 bg-safety rounded-full" />
                  ACTIVE
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
