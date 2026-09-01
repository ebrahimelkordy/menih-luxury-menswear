import { useState } from 'react';

interface LazyImageProps {
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  onClick?: () => void;
}

export function LazyImage({
  src,
  alt = '',
  className = '',
  style,
  priority = false,
  onClick,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-espresso/20 ${className}`}
      onClick={onClick}
    >
      {/* Subtle luxury placeholder background while image is loading */}
      {!isLoaded && !priority && (
        <div className="absolute inset-0 bg-gradient-to-br from-espresso/30 via-terracotta/5 to-cream/10 z-0" />
      )}

      {/* Optimized Native Image with Hardware-Accelerated Transition */}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setIsLoaded(true)}
        style={style}
        className={`w-full h-full object-cover transition-all duration-500 ease-out z-10 ${
          priority || isLoaded
            ? 'opacity-100 filter blur-0 scale-100'
            : 'opacity-0 filter blur-sm scale-[1.02]'
        }`}
      />
    </div>
  );
}
