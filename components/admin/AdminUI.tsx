'use client';

import { cn } from '@/lib/utils';
import { Loader2, Inbox } from 'lucide-react';
import { ReactNode } from 'react';

export function LoadingState({ label = 'LOADING' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <Loader2 className="w-5 h-5 animate-spin text-foreground/40 mx-auto" />
        <div className="mt-3 tech-label-sm text-foreground/40">{label}</div>
      </div>
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Inbox className="w-8 h-8 text-foreground/20 mb-4" />
      <h3 className="font-display text-lg font-medium text-foreground/60">{title}</h3>
      {description && <p className="mt-2 text-sm text-foreground/40 max-w-sm">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="bg-white border border-foreground/10 p-5">
      <div className="tech-label-sm text-foreground/40 mb-2">{label}</div>
      <div className={cn('font-display text-3xl font-bold tech-number', accent ? 'text-safety' : 'text-graphite')}>
        {value}
      </div>
    </div>
  );
}

export function AdminButton({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'danger' | 'ghost';
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}) {
  const variants = {
    primary: 'bg-graphite text-concrete hover:bg-safety',
    outline: 'border border-foreground/20 text-graphite hover:border-safety hover:text-safety',
    danger: 'bg-transparent text-red-600 border border-red-200 hover:bg-red-50',
    ghost: 'text-foreground/60 hover:text-safety',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 text-sm transition-colors disabled:opacity-50',
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
}

export function AdminInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="tech-label-sm text-foreground/50 block mb-2">{label}{required && <span className="text-safety"> *</span>}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-white border border-foreground/15 px-3 py-2 text-sm text-graphite focus:border-safety focus:outline-none transition-colors"
      />
    </div>
  );
}

export function AdminTextarea({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="tech-label-sm text-foreground/50 block mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full bg-white border border-foreground/15 px-3 py-2 text-sm text-graphite focus:border-safety focus:outline-none transition-colors resize-y"
      />
    </div>
  );
}

export function AdminToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-10 h-5 transition-colors',
          checked ? 'bg-safety' : 'bg-foreground/20'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 w-4 h-4 bg-white transition-transform',
            checked && 'translate-x-5'
          )}
        />
      </button>
      <span className="text-sm text-graphite">{label}</span>
    </label>
  );
}
