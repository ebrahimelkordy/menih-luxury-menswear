export function formatPrice(amount: number, currency = 'EGP'): string {
  if (currency === 'EGP') return `${amount.toLocaleString('ar-EG')} ج.م`;
  return `$${(amount / 50).toFixed(0)}`;
}

export function generateOrderNumber(count?: number): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const countSuffix = count !== undefined ? String(count + 1).padStart(3, '0') : '';
  return `EZAR-${dateStr}-${countSuffix ? countSuffix + '-' : ''}${randomSuffix}`;
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
