'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import type { ProcessStage } from '@/lib/types';
import { StructuralLine } from './StructuralLine';
import { TechnicalMarker } from './TechnicalMarker';

interface ProcessProps {
  stages: ProcessStage[];
}

const FALLBACK_IMAGES: Record<string, string> = {
  'Engineering': 'https://images.pexels.com/photos/3818947/pexels-photo-3818947.jpeg?auto=compress&cs=tinysrgb&h=500&w=700',
  'Fabrication': 'https://images.pexels.com/photos/30790482/pexels-photo-30790482.jpeg?auto=compress&cs=tinysrgb&h=500&w=700',
  'Quality Control': 'https://images.pexels.com/photos/14275052/pexels-photo-14275052.jpeg?auto=compress&cs=tinysrgb&h=500&w=700',
  'Transport': 'https://images.pexels.com/photos/8014692/pexels-photo-8014692.jpeg?auto=compress&cs=tinysrgb&h=500&w=700',
  'Installation': 'https://images.pexels.com/photos/10682523/pexels-photo-10682523.jpeg?auto=compress&cs=tinysrgb&h=500&w=700',
};

const DEFAULT_IMG = 'https://images.pexels.com/photos/17167905/pexels-photo-17167905.jpeg?auto=compress&cs=tinysrgb&h=500&w=700';

export function Process({ stages }: ProcessProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const lineScale = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

  return (
    <section id="process" ref={containerRef} className="relative py-24 md:py-40 bg-graphite text-concrete overflow-hidden">
      <div className="section-padding-lg">
        {/* Section marker */}
        <div className="flex items-center gap-3 mb-12 md:mb-20">
          <TechnicalMarker number="05" label="PROCESS" variant="orange" />
          <div className="flex-1 max-w-32 h-px bg-concrete/15" />
        </div>

        <h2 className="font-display text-display-md font-medium tracking-tightest text-concrete leading-[0.9] mb-16 md:mb-24">
          THE BUILD.
        </h2>

        {/* Process line + stages */}
        <div className="relative">
          {/* Vertical structural line */}
          <motion.div
            className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-safety origin-top"
            style={{ scaleY: lineScale }}
          />

          <div className="space-y-0">
            {stages.map((stage, i) => {
              const img = stage.image_url || FALLBACK_IMAGES[stage.name] || DEFAULT_IMG;
              return (
                <motion.div
                  key={stage.id}
                  className="relative grid grid-cols-12 gap-4 md:gap-8 items-center py-8 md:py-12 border-b border-concrete/10 last:border-b-0"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Node on the line */}
                  <div className="absolute left-4 md:left-8 -translate-x-1/2 w-3 h-3 bg-safety rounded-full" />

                  {/* Number */}
                  <div className="col-span-3 md:col-span-2 pl-10 md:pl-16">
                    <span className="font-display text-3xl md:text-5xl font-bold tracking-tightest text-safety tech-number">
                      {stage.number}
                    </span>
                  </div>

                  {/* Name + description */}
                  <div className="col-span-9 md:col-span-5">
                    <h3 className="font-display text-xl md:text-3xl font-medium tracking-tight text-concrete mb-2">
                      {stage.name.toUpperCase()}
                    </h3>
                    <p className="text-sm text-concrete/50 leading-relaxed max-w-md">
                      {stage.description}
                    </p>
                  </div>

                  {/* Image */}
                  <div className="col-span-12 md:col-span-5">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={stage.name}
                        className="w-full h-full object-cover grayscale contrast-[1.1] brightness-[0.95]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-graphite/30" />
                      <div className="absolute bottom-2 left-2 tech-label-sm text-concrete/60">
                        STAGE {stage.number}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
