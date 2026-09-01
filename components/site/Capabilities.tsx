'use client';

import { motion } from 'framer-motion';
import type { Capability } from '@/lib/types';
import { StructuralLine } from './StructuralLine';
import { TechnicalMarker } from './TechnicalMarker';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Image from 'next/image';

interface CapabilitiesProps {
  capabilities: Capability[];
}

const FALLBACK_IMAGES: Record<string, string> = {
  'Structural Steel': 'https://images.pexels.com/photos/32239084/pexels-photo-32239084.jpeg?auto=compress&cs=tinysrgb&h=600&w=500',
  'Steel Fabrication': 'https://images.pexels.com/photos/36003962/pexels-photo-36003962.jpeg?auto=compress&cs=tinysrgb&h=600&w=500',
  'Metal Construction': 'https://images.pexels.com/photos/9092855/pexels-photo-9092855.jpeg?auto=compress&cs=tinysrgb&h=600&w=500',
  'Installation': 'https://images.pexels.com/photos/3818947/pexels-photo-3818947.jpeg?auto=compress&cs=tinysrgb&h=600&w=500',
  'Custom Fabrication': 'https://images.pexels.com/photos/29565382/pexels-photo-29565382.jpeg?auto=compress&cs=tinysrgb&h=600&w=500',
  'Industrial Structures': 'https://images.pexels.com/photos/13261149/pexels-photo-13261149.jpeg?auto=compress&cs=tinysrgb&h=600&w=500',
};

const DEFAULT_IMG = 'https://images.pexels.com/photos/31197870/pexels-photo-31197870.jpeg?auto=compress&cs=tinysrgb&h=600&w=500';

export function Capabilities({ capabilities }: CapabilitiesProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const active = capabilities.find((c) => c.id === activeId) ?? null;
  const activeImage = active
    ? active.image_url || FALLBACK_IMAGES[active.name] || DEFAULT_IMG
    : null;

  return (
    <section id="capabilities" className="relative py-24 md:py-40 bg-concrete-50/50">
      <div className="section-padding-lg">
        {/* Section marker */}
        <div className="flex items-center gap-3 mb-12 md:mb-20">
          <TechnicalMarker number="03" label="CAPABILITIES" />
          <StructuralLine className="flex-1 max-w-32" />
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-12">
          {/* Left: Register list */}
          <div className="col-span-12 lg:col-span-7 xl:col-span-8">
            <h2 className="font-display text-display-sm font-medium tracking-tightest text-graphite mb-10 md:mb-16">
              WHAT WE
              <br />
              <span className="text-foreground/30">BUILD.</span>
            </h2>

            <div className="space-y-0">
              {capabilities.map((cap, i) => {
                const isActive = cap.id === activeId;
                return (
                  <motion.div
                    key={cap.id}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                  >
                    <div
                      className="group relative border-t border-foreground/10 last:border-b cursor-pointer transition-all duration-300"
                      onMouseEnter={() => setActiveId(cap.id)}
                      onMouseLeave={() => setActiveId(null)}
                      onClick={() => setActiveId(isActive ? null : cap.id)}
                    >
                      <div className="grid grid-cols-12 items-center py-5 md:py-6 gap-4 transition-all duration-300"
                        style={{ paddingLeft: isActive ? '1rem' : '0' }}
                      >
                        <span className="col-span-2 md:col-span-1 tech-label-sm font-mono text-safety tech-number">
                          {cap.number}
                        </span>
                        <span className={cn(
                          'col-span-7 md:col-span-5 font-display text-xl md:text-2xl lg:text-3xl font-medium tracking-tight transition-all duration-300',
                          isActive ? 'text-graphite' : 'text-foreground/50 group-hover:text-foreground/80'
                        )}>
                          {cap.name.toUpperCase()}
                        </span>
                        <span className={cn(
                          'hidden md:block col-span-5 text-sm text-foreground/40 leading-snug transition-all duration-300 overflow-hidden',
                          isActive ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'
                        )}>
                          {cap.description}
                        </span>
                        <span className={cn(
                          'col-span-3 md:col-span-1 justify-self-end tech-label-sm transition-colors duration-300',
                          isActive ? 'text-safety' : 'text-foreground/30'
                        )}>
                          {isActive ? 'OPEN' : '→'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right: Active image panel — desktop */}
          <div className="hidden lg:block col-span-5 xl:col-span-4 sticky top-24 self-start">
            <div className="relative aspect-[4/5] overflow-hidden bg-graphite/5">
              {capabilities.map((cap) => {
                const img = cap.image_url || FALLBACK_IMAGES[cap.name] || DEFAULT_IMG;
                const isActive = cap.id === activeId;
                return (
                  <div
                    key={cap.id}
                    className={cn(
                      'absolute inset-0 transition-all duration-500',
                      isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={cap.name} className="w-full h-full object-cover grayscale contrast-[1.1] brightness-[0.95]" loading="lazy" />
                    <div className="absolute inset-0 bg-graphite/20" />
                  </div>
                );
              })}
              {/* Default state */}
              {!active && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="tech-label-sm text-foreground/30 mb-2">SELECT A CAPABILITY</div>
                    <div className="w-12 h-px bg-foreground/20 mx-auto" />
                  </div>
                </div>
              )}
              {/* Frame markers */}
              <div className="absolute -top-2 -left-2 w-4 h-px bg-safety z-10" />
              <div className="absolute -top-2 -left-2 h-4 w-px bg-safety z-10" />
              <div className="absolute -bottom-2 -right-2 w-4 h-px bg-safety z-10" />
              <div className="absolute -bottom-2 -right-2 h-4 w-px bg-safety z-10" />
            </div>
            {active && (
              <div className="mt-3 flex items-center gap-3">
                <span className="tech-label-sm text-safety">{active.number}</span>
                <span className="tech-label-sm text-foreground/40">{active.name.toUpperCase()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
