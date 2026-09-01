'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Project } from '@/lib/types';
import { StructuralLine } from './StructuralLine';
import { TechnicalMarker } from './TechnicalMarker';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ProjectRegisterProps {
  projects: Project[];
}

const FALLBACK_IMAGES = [
  'https://images.pexels.com/photos/31197870/pexels-photo-31197870.jpeg?auto=compress&cs=tinysrgb&h=500&w=700',
  'https://images.pexels.com/photos/9092855/pexels-photo-9092855.jpeg?auto=compress&cs=tinysrgb&h=500&w=700',
  'https://images.pexels.com/photos/13261149/pexels-photo-13261149.jpeg?auto=compress&cs=tinysrgb&h=500&w=700',
  'https://images.pexels.com/photos/32239084/pexels-photo-32239084.jpeg?auto=compress&cs=tinysrgb&h=500&w=700',
  'https://images.pexels.com/photos/3818947/pexels-photo-3818947.jpeg?auto=compress&cs=tinysrgb&h=500&w=700',
  'https://images.pexels.com/photos/10682523/pexels-photo-10682523.jpeg?auto=compress&cs=tinysrgb&h=500&w=700',
];

export function ProjectRegister({ projects }: ProjectRegisterProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (projects.length === 0) {
    return (
      <section id="projects" className="relative py-24 md:py-40">
        <div className="section-padding-lg">
          <div className="flex items-center gap-3 mb-12 md:mb-20">
            <TechnicalMarker number="04" label="PROJECTS" />
            <StructuralLine className="flex-1 max-w-32" />
          </div>
          <h2 className="font-display text-display-md font-medium tracking-tightest text-graphite">
            PROJECT
            <br />
            <span className="text-foreground/30">REGISTER.</span>
          </h2>
          <div className="mt-12 border-t border-foreground/10 py-12 text-center">
            <p className="text-sm text-foreground/40">
              NO PUBLISHED PROJECTS YET.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="relative py-24 md:py-40">
      <div className="section-padding-lg">
        {/* Section marker */}
        <div className="flex items-center gap-3 mb-12 md:mb-20">
          <TechnicalMarker number="04" label="PROJECTS" />
          <StructuralLine className="flex-1 max-w-32" />
        </div>

        <div className="grid grid-cols-12 gap-6 mb-12 md:mb-16">
          <h2 className="col-span-12 md:col-span-8 font-display text-display-md font-medium tracking-tightest text-graphite leading-[0.9]">
            PROJECT
            <br />
            <span className="text-foreground/30">REGISTER.</span>
          </h2>
          <div className="col-span-12 md:col-span-4 md:text-right self-end">
            <span className="tech-label-sm text-foreground/40">
              {projects.length.toString().padStart(2, '0')} — PROJECTS ON RECORD
            </span>
          </div>
        </div>

        {/* Register table header */}
        <div className="hidden md:grid grid-cols-12 gap-4 pb-3 border-b-2 border-foreground/20">
          <span className="col-span-1 tech-label-sm text-foreground/40">№</span>
          <span className="col-span-4 tech-label-sm text-foreground/40">PROJECT</span>
          <span className="col-span-2 tech-label-sm text-foreground/40">CATEGORY</span>
          <span className="col-span-2 tech-label-sm text-foreground/40">WEIGHT</span>
          <span className="col-span-2 tech-label-sm text-foreground/40">YEAR</span>
          <span className="col-span-1 tech-label-sm text-foreground/40 text-right">→</span>
        </div>

        {/* Project rows */}
        <div className="relative">
          {projects.map((project, i) => {
            const isHovered = hoveredIndex === i;
            const projectNumber = (i + 1).toString().padStart(3, '0');
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className="group block border-b border-foreground/10"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="grid grid-cols-12 gap-4 items-center py-5 md:py-7 transition-all duration-300 relative"
                    style={{ paddingLeft: isHovered ? '1.5rem' : '0' }}
                  >
                    {/* Hover orange bar */}
                    <span className={cn(
                      'absolute left-0 top-1/2 -translate-y-1/2 h-0 w-1 bg-safety transition-all duration-300',
                      isHovered ? 'h-8' : 'h-0'
                    )} />

                    <span className="col-span-2 md:col-span-1 tech-number tech-label-sm text-safety font-mono">
                      {projectNumber}
                    </span>
                    <span className={cn(
                      'col-span-10 md:col-span-4 font-display text-lg md:text-2xl lg:text-3xl font-medium tracking-tight transition-colors duration-300',
                      isHovered ? 'text-graphite' : 'text-foreground/60 group-hover:text-graphite'
                    )}>
                      {project.title.toUpperCase()}
                    </span>
                    <span className="hidden md:block col-span-2 text-sm text-foreground/40">
                      {project.category || '—'}
                    </span>
                    <span className="hidden md:block col-span-2 text-sm text-foreground/40 tech-number font-mono">
                      {project.weight ? project.weight : '—'}
                    </span>
                    <span className="hidden md:block col-span-2 text-sm text-foreground/40 tech-number font-mono">
                      {project.year || '—'}
                    </span>
                    <span className={cn(
                      'hidden md:block col-span-1 text-right text-lg transition-all duration-300',
                      isHovered ? 'text-safety translate-x-0' : 'text-foreground/20 -translate-x-2'
                    )}>
                      →
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Floating preview image — desktop only */}
        <div className="hidden lg:block fixed right-8 top-1/2 -translate-y-1/2 w-72 h-96 pointer-events-none z-30">
          {projects.map((project, i) => {
            const isHovered = hoveredIndex === i;
            const img = FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
            return (
              <div
                key={project.id}
                className={cn(
                  'absolute inset-0 overflow-hidden transition-all duration-500',
                  isHovered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={project.title} className="w-full h-full object-cover grayscale contrast-[1.1] brightness-[0.95]" />
                <div className="absolute inset-0 bg-graphite/20" />
                <div className="absolute -top-2 -left-2 w-4 h-px bg-safety" />
                <div className="absolute -top-2 -left-2 h-4 w-px bg-safety" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
