import { cn } from '@/lib/utils';

interface StructuralLineProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: 'thin' | 'thick' | 'orange';
  className?: string;
  animated?: boolean;
  delay?: number;
}

export function StructuralLine({
  orientation = 'horizontal',
  thickness = 'thin',
  className,
  animated = false,
  delay = 0,
}: StructuralLineProps) {
  const baseClass =
    thickness === 'thick'
      ? 'bg-foreground h-0.5'
      : thickness === 'orange'
        ? 'bg-safety h-[2px]'
        : 'bg-foreground/15 h-px';

  const orientationClass = orientation === 'vertical' ? 'w-px h-full' : 'w-full';

  if (animated) {
    return (
      <div
        className={cn('overflow-hidden', orientationClass, className)}
        style={{ [orientation === 'vertical' ? 'height' : 'width']: '100%' }}
      >
        <div
          className={cn(baseClass, orientationClass)}
          style={{
            transformOrigin: 'left center',
            animation: `line-extend 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s forwards`,
            transform: 'scaleX(0)',
          }}
        />
      </div>
    );
  }

  return <div className={cn(baseClass, orientationClass, className)} />;
}
