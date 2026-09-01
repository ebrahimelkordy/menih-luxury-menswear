'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import type { ProjectImage } from '@/lib/types';

interface ProjectGalleryProps {
  images: ProjectImage[];
}

export function ProjectGallery({ images }: ProjectGalleryProps) {
  const nonMain = images.filter((img) => !img.is_main);

  if (nonMain.length === 0) return null;

  return (
    <section className="section-padding-lg py-12 md:py-20 border-t border-foreground/10">
      <div className="flex items-center gap-3 mb-10">
        <span className="inline-block w-1.5 h-1.5 bg-safety" />
        <span className="tech-label-sm">GALLERY</span>
      </div>

      {/* Mosaic grid */}
      <div className="grid grid-cols-12 gap-3 md:gap-4">
        {nonMain.map((img, i) => {
          // Vary sizes for editorial composition
          const spanClass =
            i % 5 === 0
              ? 'col-span-12 md:col-span-8 aspect-[16/10]'
              : i % 3 === 0
                ? 'col-span-12 md:col-span-4 aspect-[3/4]'
                : i % 2 === 0
                  ? 'col-span-6 md:col-span-6 aspect-[4/3]'
                  : 'col-span-6 md:col-span-6 aspect-[4/3]';

          return (
            <motion.div
              key={img.id}
              className={cn('relative overflow-hidden', spanClass)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt || `Gallery image ${i + 1}`}
                className="w-full h-full object-cover grayscale contrast-[1.1] brightness-[0.95] hover:grayscale-0 hover:contrast-100 hover:brightness-100 transition-all duration-700"
                loading="lazy"
              />
              <div className="absolute bottom-2 left-2 tech-label-sm text-concrete/70 bg-graphite/40 px-2 py-1">
                FIG.{String(i + 2).padStart(2, '0')}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
