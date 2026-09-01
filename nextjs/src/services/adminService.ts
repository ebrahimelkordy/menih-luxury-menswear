import {
  fetchSiteSettings, updateSiteSettingsApi,
  fetchTestimonials, saveTestimonialApi, deleteTestimonialApi,
  fetchOrders, updateOrderStatusApi, deleteOrderApi,
  saveProductApi, deleteProductApi
} from './apiClient';
import {
  products as localProducts,
  categories as localCategories,
  heroImages,
  type Product,
  type Category,
  type ProductVariant,
} from './mockData';

export interface SiteSettings {
  logoUrl?: string;
  brandName: string;
  brandNameAr: string;
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
  goldBannerText: string;
  goldBannerTextAr: string;
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
  contactEmail: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  address: string;
  addressAr: string;
  mixMatchCategories: string[];
}

export const defaultSiteSettings: SiteSettings = {
  logoUrl: '',
  brandName: 'EZAR',
  brandNameAr: 'إزار',
  heroTitle: 'The Prestige of\nArabian Dignity',
  heroTitleAr: 'هيبة الأصالة\nوالوقار والتميز',
  heroTagline: 'Ezar — Luxury Arabian Menswear',
  heroTaglineAr: 'إزار — أزياء رجالية عربية فاخرة',
  heroSubtitle: 'Bespoke thobes, royal ceremonial bishts, premium woven shemaghs & aged Dehn El Oud — crafted with precision for the modern gentleman.',
  heroSubtitleAr: 'ثياب مخيطة خصيصاً، بشت ملكي للمناسبات، أشمغة فاخرة ودهن العود الكمبودي المعتق — صُممت بدقة متناهية للرجل الأصيل.',
  heroImage: heroImages.thobeGandoura || '/images/thobe-gandoura.jpg',
  heroCtaText: 'Explore Collection',
  heroCtaTextAr: 'استكشف المجموعات',
  marqueeText: 'EZAR LUXURY • BESPOKE ARABIAN TAILORING • 100% GIZA COTTON • AGED CAMBODIAN OUD',
  marqueeTextAr: 'إزار • تفصيل ملكي فاخر • قطن مصري جيزة ٩٤ • دهن عود كمبودي معتق • شحن لكافة المحافظات',
  goldBannerText: 'Bespoke Royal Tailoring • Free Luxury Shipping on Orders Over 2,000 EGP • Perfect Fit Guarantee',
  goldBannerTextAr: 'تفصيل ملكي مخصص • شحن مجاني لكافة المحافظات للطلبات الأكثر من ٢٠٠٠ ج.م • ضمان استبدال وتعديل المقاس',
  editorialQuote: 'Prestige and dignity are not merely about appearance — they are reflections of values and heritage. Every piece at Ezar is crafted to command presence worthy of your status and legacy.',
  editorialQuoteAr: 'الوقار والهيبة ليسا مجرد مظهر، بل انعكاس للأصالة والمكانة. في إزار، نصيغ كل خيط ليعكس فخامتكم وحضوركم المهيب في كل محفل.',
  quoteAuthor: 'Ezar Master Tailor',
  quoteAuthorAr: 'كبير خياطي إزار',
  promoCode: 'EZAR10',
  promoDiscountPercent: 10,
  bundleDiscountPercent: 15,
  freeShippingThreshold: 2000,
  flatShippingRate: 150,
  contactPhone: '+20 100 000 0000',
  contactWhatsapp: '+20 100 000 0000',
  contactEmail: 'concierge@ezar.com',
  instagramUrl: 'https://instagram.com',
  facebookUrl: 'https://facebook.com',
  tiktokUrl: 'https://tiktok.com',
  address: 'Sultan Hussein St., Heliopolis, Cairo, Egypt',
  addressAr: 'شارع السلطان حسين، مصر الجديدة، القاهرة، جمهورية مصر العربية',
  mixMatchCategories: ['thobe', 'shemagh', 'bisht', 'accessories', 'fragrances'],
};

export interface AdminTestimonial {
  id: string;
  name: string;
  nameAr: string;
  city: string;
  cityAr: string;
  review: string;
  reviewAr: string;
  rating: number;
  image?: string;
  displayOrder?: number;
}

export const defaultTestimonials: AdminTestimonial[] = [
  {
    id: '1',
    name: 'Sheikh Fahad Al-Otaibi',
    nameAr: 'الشيخ فهد العتيبي',
    city: 'Riyadh',
    cityAr: 'الرياض',
    review: 'The quality of the bespoke Thobe is unmatched. The Japanese cotton feels incredibly lightweight and breathable in summer, and the collar stitching is flawless.',
    reviewAr: 'جودة التفصيل في الثوب الملكي استثنائية، خامة القطن الياباني باردة جداً في الصيف وتطريز الياقة متقن لأبعد الحدود.',
    rating: 5,
    image: heroImages.thobeSaudi,
    displayOrder: 1,
  },
  {
    id: '2',
    name: 'Eng. Tareq Al-Mansoor',
    nameAr: 'م. طارق المنصور',
    city: 'Dubai',
    cityAr: 'دبي',
    review: 'The Royal Bisht with pure German gold zaree was the centerpiece of my wedding attire. Exceptional craftsmanship and dignified prestige.',
    reviewAr: 'البشت الملكي بزري الذهب الألماني كان محط أنظار الجميع في حفل زفافي. هيبة وأصالة ووقار لا مثيل له.',
    rating: 5,
    image: heroImages.bishtRoyal,
    displayOrder: 2,
  },
  {
    id: '3',
    name: 'Abdulrahman Al-Dawsari',
    nameAr: 'عبد الرحمن الدوسري',
    city: 'Dammam',
    cityAr: 'الدمام',
    review: 'The Mix & Match studio made selecting my outfit incredibly easy. I coordinated the Thobe with a Kashmiri Shawl and Amber Tasbih and saved 15%. A premium shopping experience.',
    reviewAr: 'منسق الأطقم سهل علي الاختيار بشكل كبير، نسقت الثوب مع الشال الكشميري والسبحة الكهرمان وحصلت على خصم ١٥٪. تجربة تسوق فخمة واستثنائية.',
    rating: 5,
    image: heroImages.shemaghKashmiri,
    displayOrder: 3,
  },
];

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerWhatsapp?: string;
  customerEmail?: string;
  customerCity: string;
  customerAddress: string;
  items: Array<{
    productId: string;
    productTitle: string;
    variantName?: string;
    size?: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  bundleDiscount: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod?: string;
  createdAt: string;
}

const defaultAdminOrders: AdminOrder[] = [
  {
    id: 'ord_1',
    orderNumber: 'EZAR-849201',
    customerName: 'الشيخ عبد الله بن فهد آل سعود',
    customerPhone: '+966 50 123 4567',
    customerWhatsapp: '+966 50 123 4567',
    customerEmail: 'abdullah.f@example.com',
    customerCity: 'الرياض',
    customerAddress: 'حي حطين، شارع الأمير تركي بن عبد العزيز، فيلا ٢٤',
    items: [
      { productId: 'thobe-toyobo-royal', productTitle: 'ثوب إزار الملكي — قطن ياباني تويوبو', variantName: 'أبيض لؤلؤي', size: '58L', quantity: 2, price: 1850 },
      { productId: 'bisht-hasawi-gold', productTitle: 'بشت نجدي ملكي — زري ألماني مذهب', variantName: 'أسود فاحم', size: 'Standard', quantity: 1, price: 8500 },
      { productId: 'shemagh-kashmiri-crimson', productTitle: 'شماغ إزار الكشميري المطرز', variantName: 'أحمر ملوكي', size: '58', quantity: 1, price: 950 },
    ],
    subtotal: 13150,
    bundleDiscount: 1972,
    total: 11178,
    status: 'processing',
    paymentMethod: 'card',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'ord_2',
    orderNumber: 'EZAR-849188',
    customerName: 'المستشار هشام الأنصاري',
    customerPhone: '+20 100 889 4411',
    customerWhatsapp: '+20 100 889 4411',
    customerEmail: 'hisham.elansary@example.com',
    customerCity: 'القاهرة',
    customerAddress: 'التجمع الخامس، حي البنفسج، عمارة ٤٨',
    items: [
      { productId: 'thobe-giza-cotton', productTitle: 'جلابية إزار الفاخرة — قطن جيزة ٩٤', variantName: 'بيج كلاسيك', size: '56', quantity: 1, price: 1450 },
      { productId: 'perfume-cambodian-oud', productTitle: 'دهن عود كمبودي معتق — زجاجة كريستال', variantName: 'معتق قديم', size: 'Quarter Tola', quantity: 1, price: 2800 },
    ],
    subtotal: 4250,
    bundleDiscount: 0,
    total: 4250,
    status: 'shipped',
    paymentMethod: 'cod',
    createdAt: new Date(Date.now() - 3600000 * 26).toISOString(),
  },
  {
    id: 'ord_3',
    orderNumber: 'EZAR-849150',
    customerName: 'محمد بن سلطان المنصوري',
    customerPhone: '+971 50 998 7766',
    customerWhatsapp: '+971 50 998 7766',
    customerCity: 'دبي',
    customerAddress: 'نخلة جميرا، فيلا 12B',
    items: [
      { productId: 'tasbih-amber-royal', productTitle: 'سبحة كهرمان بولندي ملكي وفضة ٩٢٥', variantName: 'كهرمان عسلي', size: '33 Beads', quantity: 1, price: 3200 },
    ],
    subtotal: 3200,
    bundleDiscount: 0,
    total: 3200,
    status: 'delivered',
    paymentMethod: 'card',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
];

export function getCachedSiteSettings(): SiteSettings {
  const saved = typeof window !== 'undefined' ? (localStorage.getItem('ezar_site_settings') || localStorage.getItem('menih_site_settings')) : null;
  return saved ? JSON.parse(saved) : defaultSiteSettings;
}

export type TestimonialItem = AdminTestimonial;

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const data = await fetchSiteSettings();
    return { ...defaultSiteSettings, ...data };
  } catch (err) {
    const savedLocal = typeof window !== 'undefined' ? (localStorage.getItem('ezar_site_settings') || localStorage.getItem('menih_site_settings')) : null;
    return savedLocal ? { ...defaultSiteSettings, ...JSON.parse(savedLocal) } : defaultSiteSettings;
  }
}

export async function saveSiteSettings(settings: SiteSettings): Promise<boolean> {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ezar_site_settings', JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('ezar_settings_updated', { detail: settings }));
  }
  try {
    await updateSiteSettingsApi(settings);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ezar_settings_updated', { detail: settings }));
    }
  } catch (err) {
    console.warn('Updated settings locally');
  }
  return true;
}

export async function getAdminTestimonials(): Promise<AdminTestimonial[]> {
  try {
    const data = await fetchTestimonials();
    if (data && data.length > 0) return data;
    const local = typeof window !== 'undefined' ? (localStorage.getItem('ezar_testimonials') || localStorage.getItem('menih_testimonials')) : null;
    return local ? JSON.parse(local) : defaultTestimonials;
  } catch (err) {
    const local = typeof window !== 'undefined' ? (localStorage.getItem('ezar_testimonials') || localStorage.getItem('menih_testimonials')) : null;
    return local ? JSON.parse(local) : defaultTestimonials;
  }
}

export async function saveTestimonial(item: Partial<AdminTestimonial> & { name: string; review: string }): Promise<AdminTestimonial> {
  try {
    const res = await saveTestimonialApi(item);
    return res;
  } catch (err) {
    const current = await getAdminTestimonials();
    const id = item.id || `test_${Date.now()}`;
    const fullItem: AdminTestimonial = {
      name: item.name,
      nameAr: item.nameAr || item.name,
      city: item.city || '',
      cityAr: item.cityAr || item.city || '',
      review: item.review,
      reviewAr: item.reviewAr || item.review,
      rating: item.rating || 5,
      image: item.image,
      id,
      displayOrder: item.displayOrder ?? current.length + 1,
    };
    const updated = current.some((t) => t.id === id)
      ? current.map((t) => (t.id === id ? fullItem : t))
      : [...current, fullItem];
    if (typeof window !== 'undefined') localStorage.setItem('ezar_testimonials', JSON.stringify(updated));
    return fullItem;
  }
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  try {
    await deleteTestimonialApi(id);
  } catch (err) {
    console.warn('Deleted locally');
  }
  const current = await getAdminTestimonials();
  const updated = current.filter((t) => t.id !== id);
  if (typeof window !== 'undefined') localStorage.setItem('ezar_testimonials', JSON.stringify(updated));
  return true;
}

export async function getAdminOrders(): Promise<AdminOrder[]> {
  try {
    const data = await fetchOrders();
    if (data && data.length > 0) return data;
    const localOrders = typeof window !== 'undefined' ? (localStorage.getItem('ezar_local_orders') || localStorage.getItem('menih_local_orders')) : null;
    return localOrders ? JSON.parse(localOrders) : defaultAdminOrders;
  } catch (err) {
    const localOrders = typeof window !== 'undefined' ? (localStorage.getItem('ezar_local_orders') || localStorage.getItem('menih_local_orders')) : null;
    return localOrders ? JSON.parse(localOrders) : defaultAdminOrders;
  }
}

export async function updateOrderStatus(orderId: string, status: AdminOrder['status']): Promise<boolean> {
  try {
    await updateOrderStatusApi(orderId, status);
  } catch (err) {
    console.warn('Updated order status locally');
  }
  const localOrders = typeof window !== 'undefined' ? localStorage.getItem('ezar_local_orders') : null;
  if (localOrders) {
    const parsed: AdminOrder[] = JSON.parse(localOrders);
    const updated = parsed.map((o) => (o.id === orderId ? { ...o, status } : o));
    localStorage.setItem('ezar_local_orders', JSON.stringify(updated));
  }
  return true;
}

export async function deleteOrder(orderId: string): Promise<boolean> {
  try {
    await deleteOrderApi(orderId);
  } catch (err) {
    console.warn('Deleted order locally');
  }
  return true;
}

export async function saveProduct(
  productData: Partial<Product> & { title: string; titleAr: string; category: Category },
  variants: Array<Omit<ProductVariant, 'id'> & { id?: string }>,
  isEdit = false
): Promise<Product> {
  try {
    const payload = {
      ...productData,
      categorySlug: productData.category,
      variants,
    };
    const saved = await saveProductApi(payload, isEdit);
    return saved;
  } catch (err) {
    console.warn('Fallback product save');
    const id = productData.id || `p_${Date.now()}`;
    const handle = productData.handle || productData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const fullProduct: Product = {
      id,
      title: productData.title,
      titleAr: productData.titleAr,
      handle,
      price: productData.price || 1500,
      compareAtPrice: productData.compareAtPrice,
      category: productData.category,
      categoryAr: localCategories.find((c) => c.id === productData.category)?.nameAr || 'ثوب فاخر',
      fabric: productData.fabric || '',
      fabricAr: productData.fabricAr || '',
      sizes: productData.sizes || ['Standard'],
      variants: variants as ProductVariant[],
      rating: 5.0,
      reviewsCount: 1,
      description: productData.description || '',
      descriptionAr: productData.descriptionAr || '',
      featured: productData.featured ?? false,
      opacity: productData.opacity || '',
      opacityAr: productData.opacityAr || '',
      weight: productData.weight || '',
      dimensions: productData.dimensions || '',
    };
    return fullProduct;
  }
}

export async function deleteProduct(productId: string): Promise<boolean> {
  try {
    await deleteProductApi(productId);
  } catch (err) {
    console.warn('Deleted locally');
  }
  const idx = localProducts.findIndex((p) => p.id === productId);
  if (idx >= 0) {
    localProducts.splice(idx, 1);
  }
  return true;
};
