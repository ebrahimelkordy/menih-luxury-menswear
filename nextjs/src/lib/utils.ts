export function formatPrice(amount: number, currency = 'EGP'): string {
  if (currency === 'EGP') return `${amount.toLocaleString('ar-EG')} ج.م`;
  return `$${(amount / 50).toFixed(0)}`;
}

export function generateOrderNumber(count: number): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `MENIH-${dateStr}-${String(count + 1).padStart(4, '0')}`;
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
