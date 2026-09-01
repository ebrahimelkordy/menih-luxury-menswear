'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import type { CompanySettings } from '@/lib/types';

interface HeroProps {
  settings: CompanySettings;
}

const HERO_IMAGE = 'https://images.pexels.com/photos/27757293/pexels-photo-27757293.jpeg?auto=compress&cs=tinysrgb&h=900&w=700';

export function Hero({ settings }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20">
      {/* Background structural grid - very subtle */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 right-0 top-1/3 h-px bg-foreground/5" />
        <div className="absolute left-0 right-0 top-2/3 h-px bg-foreground/5" />
        <div className="absolute top-0 bottom-0 left-1/4 w-px bg-foreground/5" />
        <div className="absolute top-0 bottom-0 left-3/4 w-px bg-foreground/5" />
      </div>

      <div className="section-padding-lg w-full">
        <div className="grid grid-cols-12 gap-4 md:gap-6 items-center min-h-[80vh]">
          {/* Left: Typography block */}
          <motion.div
            style={{ y: textY, opacity }}
            className="col-span-12 md:col-span-7 lg:col-span-8 relative z-10"
          >
            {/* Top marker line */}
            <motion.div
              className="flex items-center gap-3 mb-8 md:mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <span className="inline-block w-1.5 h-1.5 bg-safety" />
              <span className="tech-label-sm">AL-KORDY CONTRACTING</span>
              <span className="flex-1 max-w-[60px] h-px bg-foreground/20" />
              <span className="tech-label-sm text-foreground/40">EST. METAL CONSTRUCTION</span>
            </motion.div>

            {/* Display typography */}
            <div className="space-y-0">
              <motion.h1
                className="font-display font-bold tracking-tightest text-graphite leading-[0.85] text-[clamp(3.5rem,13vw,11rem)]"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {settings.hero_title}
              </motion.h1>
              <motion.div
                className="flex items-center gap-4 md:gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <motion.div
                  className="h-[2px] bg-safety origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  style={{ width: 'clamp(2rem, 8vw, 6rem)' }}
                />
                <motion.h1
                  className="font-display font-bold tracking-tightest text-graphite leading-[0.85] text-[clamp(3.5rem,13vw,11rem)]"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  {settings.hero_title_second}
                </motion.h1>
              </motion.div>
            </div>

            {/* Subtitle */}
            <motion.p
              className="mt-8 md:mt-10 max-w-md text-sm md:text-base text-foreground/60 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              {settings.hero_subtitle}
            </motion.p>

            {/* CTA */}
            <motion.div
              className="mt-8 md:mt-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.15 }}
            >
              <Link
                href="/#contact"
                className="group inline-flex items-center gap-3 border-b-2 border-foreground pb-1 hover:border-safety transition-colors duration-300"
              >
                <span className="tech-label-sm font-medium group-hover:text-safety transition-colors">
                  {settings.hero_cta}
                </span>
                <span className="inline-block w-6 h-px bg-foreground group-hover:bg-safety group-hover:w-10 transition-all duration-300" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Image block with structural frame */}
          <motion.div
            className="col-span-12 md:col-span-5 lg:col-span-4 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.div
              style={{ y: imageY }}
              className="relative aspect-[3/4] overflow-hidden"
            >
              {/* Structural frame lines */}
              <div className="absolute -top-2 -left-2 w-4 h-px bg-safety z-10" />
              <div className="absolute -top-2 -left-2 h-4 w-px bg-safety z-10" />
              <div className="absolute -bottom-2 -right-2 w-4 h-px bg-safety z-10" />
              <div className="absolute -bottom-2 -right-2 h-4 w-px bg-safety z-10" />

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={HERO_IMAGE}
                alt="Welding in an industrial steel fabrication workshop"
                className="w-full h-full object-cover grayscale-[20%]"
                loading="eager"
              />
              <div className="absolute inset-0 bg-graphite/10" />
            </motion.div>

            {/* Technical annotation */}
            <motion.div
              className="absolute -bottom-12 left-0 flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.3 }}
            >
              <span className="tech-label-sm text-safety">FIG.01</span>
              <span className="tech-label-sm text-foreground/40">WORKSHOP — WELDING</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom info bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.4 }}
      >
        <div className="section-padding-lg">
          <div className="h-px bg-foreground/10" />
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-6">
              <span className="tech-label-sm text-foreground/40">SCROLL</span>
              <span className="inline-block w-12 h-px bg-foreground/20" />
            </div>
            <div className="hidden md:flex items-center gap-6">
              <span className="tech-label-sm text-foreground/40">01 / MATERIAL</span>
              <span className="tech-label-sm text-foreground/40">02 / ENGINEERING</span>
              <span className="tech-label-sm text-foreground/40">03 / STRUCTURE</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
