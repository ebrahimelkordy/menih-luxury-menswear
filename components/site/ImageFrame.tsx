import { cn } from '@/lib/utils';

interface ImageFrameProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  ratio?: 'auto' | 'square' | 'wide' | 'tall' | 'portrait';
  priority?: boolean;
}

export function ImageFrame({
  src,
  alt,
  className,
  imgClassName,
  ratio = 'auto',
  priority = false,
}: ImageFrameProps) {
  const ratioClass =
    ratio === 'square'
      ? 'aspect-square'
      : ratio === 'wide'
        ? 'aspect-[16/10]'
        : ratio === 'tall'
          ? 'aspect-[3/4]'
          : ratio === 'portrait'
            ? 'aspect-[2/3]'
            : '';

  return (
    <div className={cn('relative overflow-hidden bg-graphite/5', ratioClass, className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        className={cn('w-full h-full object-cover grayscale contrast-[1.1] brightness-[0.95] hover:grayscale-0 hover:contrast-100 hover:brightness-100 transition-all duration-700', imgClassName)}
      />
      <div className="absolute inset-0 bg-graphite/5 pointer-events-none transition-opacity duration-700" />
    </div>
  );
}
