import { cn } from '@/lib/utils';

interface TechnicalMarkerProps {
  number?: string;
  label?: string;
  className?: string;
  variant?: 'default' | 'orange' | 'outline';
}

export function TechnicalMarker({
  number,
  label,
  className,
  variant = 'default',
}: TechnicalMarkerProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span
        className={cn(
          'inline-block w-1.5 h-1.5',
          variant === 'orange' ? 'bg-safety' : variant === 'outline' ? 'border border-foreground/40' : 'bg-foreground'
        )}
      />
      {number && <span className="tech-label-sm">{number}</span>}
      {label && <span className="tech-label-sm">{label}</span>}
    </div>
  );
}
