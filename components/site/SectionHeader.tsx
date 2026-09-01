import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  number?: string;
  label?: string;
  title?: string;
  className?: string;
  align?: 'left' | 'center';
}

export function SectionHeader({
  number,
  label,
  title,
  className,
  align = 'left',
}: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-3', align === 'center' && 'items-center text-center', className)}>
      {(number || label) && (
        <div className="flex items-center gap-3">
          {number && <span className="tech-label text-safety">{number}</span>}
          {label && <span className="tech-label">{label}</span>}
        </div>
      )}
      {title && (
        <h2 className="font-display text-display-sm font-medium tracking-tightest text-graphite">
          {title}
        </h2>
      )}
    </div>
  );
}
