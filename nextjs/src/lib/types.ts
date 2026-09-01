export type Language = 'en' | 'ar';
export type Currency = 'EGP' | 'USD';

export interface ProductVariant {
  id: string;
  name: string;
  nameAr: string;
  colorHex: string;
  colorFamily: string;
  image: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  title: string;
  titleAr: string;
  handle: string;
  price: number;
  compareAtPrice?: number | null;
  category: string;
  categoryAr?: string;
  fabric: string;
  fabricAr: string;
  sizes: string[];
  variants: ProductVariant[];
  rating: number;
  reviewsCount: number;
  description: string;
  descriptionAr: string;
  featured: boolean;
  opacity?: string;
  opacityAr?: string;
  weight?: string;
  dimensions?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  image: string;
  displayOrder: number;
}

export interface CartItem {
  productId: string;
  productTitle: string;
  productTitleAr: string;
  variantId: string;
  variantName: string;
  variantNameAr: string;
  variantImage: string;
  colorHex: string;
  size: string;
  price: number;
  quantity: number;
}

export interface SiteSettings {
  id?: string;
  heroTitle: string;
  heroTitleAr: string;
  heroTagline: string;
  heroTaglineAr: string;
  heroSubtitle: string;
  heroSubtitleAr: string;
  heroImage: string;
  heroCtaText: string;
  heroCtaTextAr: string;
  marqueeText: string;
  marqueeTextAr: string;
  editorialQuote: string;
  editorialQuoteAr: string;
  quoteAuthor: string;
  quoteAuthorAr: string;
  promoCode: string;
  promoDiscountPercent: number;
  bundleDiscountPercent: number;
  freeShippingThreshold: number;
  flatShippingRate: number;
  contactPhone: string;
  contactWhatsapp: string;
  instagramUrl: string;
}

export interface Testimonial {
  id: string;
  name: string;
  nameAr: string;
  city: string;
  cityAr: string;
  review: string;
  reviewAr: string;
  rating: number;
  image: string;
  displayOrder: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerCity: string;
  customerAddress: string;
  items: CartItem[];
  subtotal: number;
  bundleDiscount: number;
  total: number;
  status: string;
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}
