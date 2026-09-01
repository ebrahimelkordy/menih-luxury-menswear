export type Language = 'en' | 'ar';
export type Currency = 'EGP' | 'USD';

export interface Translation {
  [key: string]: { en: string; ar: string };
}

export const translations: Translation = {
  // Navigation
  'nav.collections': { en: 'Collections', ar: 'المجموعات' },
  'nav.chiffon': { en: 'Thobes & Gandouras', ar: 'ثياب وجلابيات' },
  'nav.cottonModal': { en: 'Shemaghs & Kashmiri Shawls', ar: 'أشمغة وشيلان' },
  'nav.niqab': { en: 'Royal Bishts & Capes', ar: 'بشوت وأردية' },
  'nav.accessories': { en: 'Gems & Tasbih', ar: 'نفائس وسبح' },
  'nav.clothing': { en: 'Oud & Fragrances', ar: 'عطور وعود' },
  'nav.mixMatch': { en: 'Mix & Match Studio', ar: 'منسق الأطقم' },
  'nav.search': { en: 'Search', ar: 'بحث' },
  'nav.cart': { en: 'Cart', ar: 'السلة' },
  'nav.menu': { en: 'Menu', ar: 'القائمة' },
  'nav.close': { en: 'Close', ar: 'إغلاق' },
  'nav.account': { en: 'Account', ar: 'حسابي' },
  'nav.wishlist': { en: 'Wishlist', ar: 'المفضلة' },

  // Hero
  'hero.tagline': { en: 'Maison Manie — Luxury Arabian Menswear', ar: 'دار المَنِيع — أزياء رجالية عربية فاخرة' },
  'hero.title': { en: 'The Prestige of\nArabian Dignity', ar: 'هيبة الأصالة\nوالوقار والتميز' },
  'hero.subtitle': {
    en: 'Bespoke thobes, royal ceremonial bishts, premium woven shemaghs & aged Dehn El Oud — crafted with precision for the modern gentleman.',
    ar: 'ثياب مخيطة خصيصاً، بشت ملكي للمناسبات، أشمغة فاخرة ودهن العود الكمبودي المعتق — صُممت بدقة متناهية للرجل الأصيل.',
  },
  'hero.cta': { en: 'Explore Collection', ar: 'استكشف المجموعات' },
  'hero.ctaSecondary': { en: 'Mix & Match Studio', ar: 'منسق الأطقم التفاعلي' },

  // Sections
  'section.featured': { en: 'Masterpieces', ar: 'روائع المجموعة' },
  'section.featuredSub': { en: 'Curated designs reflecting status and prestige', ar: 'مختارات مصممة خصيصاً لتعكس الهيبة والمكانة' },
  'section.shopByCategory': { en: 'The Imperial Collections', ar: 'المجموعات الفاخرة' },
  'section.shopByCategorySub': { en: 'Explore our tailored heritage collections', ar: 'استكشف مجموعاتنا المصممة بعناية فائقة' },
   'section.testimonials': { en: 'The Gentlemen of Manie', ar: 'مجتمع دار المَنِيع' },
  'section.newsletter': { en: 'Join the House', ar: 'انضم للدار' },
  'section.newsletterSub': {
    en: 'Subscribe to receive invitations to private catalog releases, seasonal collections, and heritage guides',
    ar: 'اشترك لتتلقى دعوات خاصة لإطلاق المجموعات الحصرية، الكتالوجات الموسمية وأدلة الأناقة',
  },

  // Product
  'product.addToBag': { en: 'Add to Bag', ar: 'أضف للسلة' },
  'product.quickAdd': { en: 'Quick Add', ar: 'إضافة سريعة' },
  'product.selectSize': { en: 'Select Size', ar: 'اختر المقاس' },
  'product.selectColor': { en: 'Select Color', ar: 'اختر اللون' },
  'product.sizeGuide': { en: 'Size Guide', ar: 'دليل المقاسات' },
  'product.fabric': { en: 'Material', ar: 'الخامة والنسيج' },
  'product.opacity': { en: 'Finish', ar: 'اللمسة النهائية' },
  'product.weight': { en: 'Weight', ar: 'الوزن' },
  'product.dimensions': { en: 'Length / Dimensions', ar: 'الطول / الأبعاد' },
  'product.reviews': { en: 'Reviews', ar: 'التقييمات' },
  'product.inStock': { en: 'In Stock', ar: 'متوفر' },
  'product.outOfStock': { en: 'Out of Stock', ar: 'غير متوفر' },
  'product.sale': { en: 'Exclusive Offer', ar: 'عرض خاص' },
  'product.new': { en: 'New', ar: 'جديد' },
  'product.fabricSensor': { en: 'Material Touch', ar: 'ملمس القماش' },
  'product.viewDetails': { en: 'View Details', ar: 'عرض التفاصيل' },
  'product.relatedProducts': { en: 'You May Also Appreciate', ar: 'قد ينال إعجابك أيضاً' },
  'product.shareOn': { en: 'Share', ar: 'مشاركة' },
  'product.freeShipping': { en: 'Complimentary shipping across Egypt', ar: 'شحن مجاني لكافة أنحاء مصر' },

  // PLP / Filters
  'filter.title': { en: 'Filters', ar: 'الفلترة والفرز' },
  'filter.color': { en: 'Color Tone', ar: 'درجة اللون' },
  'filter.material': { en: 'Fabric Type', ar: 'نوع القماش' },
  'filter.size': { en: 'Size', ar: 'المقاس' },
  'filter.price': { en: 'Price Range', ar: 'نطاق السعر' },
  'filter.inStock': { en: 'In Stock Only', ar: 'المتوفر فقط' },
  'filter.clearAll': { en: 'Clear All', ar: 'مسح الكل' },
  'filter.apply': { en: 'Apply Filters', ar: 'تطبيق الفلاتر' },
  'filter.results': { en: 'results', ar: 'نتيجة' },
  'filter.sortBy': { en: 'Sort by', ar: 'ترتيب حسب' },
  'sort.featured': { en: 'Featured', ar: 'مميز' },
  'sort.priceLow': { en: 'Price: Low to High', ar: 'السعر: من الأقل' },
  'sort.priceHigh': { en: 'Price: High to Low', ar: 'السعر: من الأعلى' },
  'sort.rating': { en: 'Top Rated', ar: 'الأعلى تقييماً' },
  'sort.newest': { en: 'Newest Releases', ar: 'الأحدث إصداراً' },

  // Cart
  'cart.title': { en: 'Your Selection', ar: 'حقيبة المشتريات' },
  'cart.empty': { en: 'Your selection is empty', ar: 'قائمة اختيارك فارغة' },
  'cart.emptySub': { en: 'Explore our collections and discover pieces worthy of distinction', ar: 'اكتشف مجموعاتنا واجد القطع التي تليق بمقامك' },
  'cart.continueShopping': { en: 'Continue Browsing', ar: 'متابعة التصفح' },
  'cart.subtotal': { en: 'Subtotal', ar: 'المجموع الفرعي' },
  'cart.shipping': { en: 'Shipping', ar: 'الشحن' },
  'cart.free': { en: 'Complimentary', ar: 'مجاني' },
  'cart.total': { en: 'Total Amount', ar: 'الإجمالي الكلي' },
  'cart.checkout': { en: 'Proceed to Checkout', ar: 'إتمام الطلب' },
  'cart.freeShippingProgress': { en: 'Add {amount} more for Complimentary Shipping', ar: 'أضف {amount} للحصول على شحن مجاني' },
  'cart.freeShippingAchieved': { en: 'Complimentary Shipping unlocked!', ar: 'حصلت على شحن مجاني!' },
  'cart.promoCode': { en: 'Invitation Code', ar: 'كود الدعوة / الخصم' },
  'cart.applyCode': { en: 'Apply', ar: 'تطبيق' },
  'cart.upsellTitle': { en: 'Complete Your Look', ar: 'أكمل هيبتك وطقمك' },
  'cart.removeItem': { en: 'Remove', ar: 'إزالة' },
  'cart.qty': { en: 'Qty', ar: 'الكمية' },
  'cart.bundleDiscount': { en: 'Studio Coordinate Saving (15%)', ar: 'خصم الطقم المتناسق (١٥٪)' },

  // Mix & Match
  'mix.scarf': { en: 'Thobe & Gandoura', ar: 'الثوب أو الجلابية' },
  'mix.bandana': { en: 'Heritage Gems & Tasbih', ar: 'النفائس والسبح' },
  'mix.niqab': { en: 'Shemagh & Kashmiri Shawl', ar: 'الشماغ أو الشال الكشميري' },
  'mix.pin': { en: 'Maison Perfume & Oud', ar: 'عطور الدار ودهن العود' },
  'mix.optional': { en: 'Optional', ar: 'اختياري' },
  'mix.addSetToCart': { en: 'Add Coordinate Set to Bag', ar: 'أضف الطقم كاملاً للحقيبة' },
  'mix.bundleSave': { en: 'Save 15% as a coordinate set', ar: 'وفر ١٥٪ كطقم متكامل' },
  'mix.colorHarmony': { en: 'Color Tone Harmony', ar: 'تناسق درجات الألوان' },
  'mix.reset': { en: 'Reset Selection', ar: 'إعادة التعيين' },
  'mix.setTotal': { en: 'Coordinate Set Total', ar: 'إجمالي الطقم' },
  'mix.yourSelection': { en: 'Your Coordinate Set', ar: 'طقمك المنسق' },

  // Search
  'search.placeholder': { en: 'Search for thobes, bishts, shemaghs, oud...', ar: 'ابحث عن ثياب، بشت، أشمغة، دهن عود...' },
  'search.trending': { en: 'Prestige Searches', ar: 'الأكثر طلباً ورواجاً' },
  'search.recent': { en: 'Your Recent Searches', ar: 'عمليات البحث الأخيرة' },
  'search.results': { en: 'Masterpieces found', ar: 'القطع المتاحة' },
  'search.noResults': { en: 'No masterpieces match your query', ar: 'لا توجد نتائج مطابقة' },
  'search.clearRecent': { en: 'Clear', ar: 'مسح' },

  // Checkout
  'checkout.title': { en: 'Secure Checkout', ar: 'إتمام الطلب بأمان' },
  'checkout.contact': { en: 'Contact Details', ar: 'معلومات الاتصال والطلب' },
  'checkout.shipping': { en: 'Delivery Destination', ar: 'العنوان ومكان الشحن' },
  'checkout.payment': { en: 'Payment Option', ar: 'طريقة الدفع' },
  'checkout.placeOrder': { en: 'Confirm Order & Place Request', ar: 'تأكيد وحفظ الطلب' },
  'checkout.orderPlaced': { en: 'Order Successfully Placed', ar: 'تم تأكيد طلبك بنجاح' },
  'checkout.orderMessage': {
    en: 'Thank you for choosing Maison Manie. Your order has been recorded in our system. A concierge will call you to arrange delivery.',
    ar: 'شكرًا لاختيارك دار المَنِيع. تم تسجيل طلبك بنجاح في نظامنا، وسيتصل بك منسق الدار لتأكيد تفاصيل وموعد التوصيل الفاخر.',
  },
  'checkout.cashOnDelivery': { en: 'Cash on Delivery', ar: 'الدفع عند الاستلام' },
  'checkout.card': { en: 'Credit / Debit Card (Secure)', ar: 'بطاقة ائتمانية / خصم مباشر' },
  'checkout.fullName': { en: 'Full Name', ar: 'الاسم الكامل' },
  'checkout.phone': { en: 'Contact Phone Number', ar: 'رقم الهاتف للتواصل' },
  'checkout.email': { en: 'Email Address (Optional)', ar: 'البريد الإلكتروني (اختياري)' },
  'checkout.address': { en: 'Delivery Address Details', ar: 'تفاصيل العنوان بالتحديد' },
  'checkout.city': { en: 'City / District', ar: 'المدينة / الحي' },
  'checkout.governorate': { en: 'Governorate', ar: 'المحافظة' },
  'checkout.orderSummary': { en: 'Request Summary', ar: 'ملخص الطلب' },

  // Footer
  'footer.about': { en: 'Maison Manie', ar: 'عن دار المَنِيع' },
  'footer.aboutText': {
    en: 'Maison Manie is an elite Egyptian luxury house for Arabian and Islamic menswear. Crafting bespoke thobes, ceremonial royal bishts, and premium woven shemaghs with absolute dedication since 2018. For the gentleman who commands presence and dignity.',
    ar: 'دار المَنِيع هي دار مصرية رائدة للأزياء العربية والإسلامية الفاخرة للرجال. نصنع الثياب المطرزة، البشت الملكي، والأشمغة الفاخرة المنسوجة يدوياً بكامل التفاني منذ ٢٠١٨. للرجل الذي يتميز بالوقار ويفرض هيبته في كل محفل.',
  },
  'footer.shop': { en: 'Collections', ar: 'تسوق حسب الفئة' },
  'footer.help': { en: 'Client Services', ar: 'خدمة العملاء' },
  'footer.connect': { en: 'Connect with the House', ar: 'تواصل مع الدار' },
  'footer.shipping': { en: 'Delivery & Tailoring', ar: 'الشحن والتفصيل الحصري' },
  'footer.sizeGuide': { en: 'Measurement Guide', ar: 'دليل المقاسات والطول' },
  'footer.faq': { en: 'Concierge FAQ', ar: 'الأسئلة الشائعة' },
  'footer.contact': { en: 'Contact the House', ar: 'اتصل بنا' },
  'footer.privacy': { en: 'Privacy Charter', ar: 'ميثاق الخصوصية' },
  'footer.terms': { en: 'Terms of Service', ar: 'شروط الخدمة والتعامل' },
  'footer.rights': { en: 'All rights reserved.', ar: 'جميع الحقوق محفوظة.' },
  'footer.newsletterPlaceholder': { en: 'Enter your email for private invites', ar: 'أدخل بريدك الإلكتروني لتلقي دعوات خاصة' },
  'footer.newsletterCta': { en: 'Subscribe', ar: 'اشترك بالدار' },
  'footer.madeInEgypt': { en: 'Crafted with pride and prestige in Egypt', ar: 'صُنع بكل فخر وهيبة في مصر' },

  // Generic
  'common.currency': { en: 'Currency', ar: 'العملة' },
  'common.language': { en: 'Language', ar: 'اللغة' },
  'common.english': { en: 'English', ar: 'English' },
  'common.arabic': { en: 'العربية', ar: 'العربية' },
  'common.from': { en: 'from', ar: 'من' },
  'common.loading': { en: 'Loading...', ar: 'جاري التحميل...' },
};

export function translate(key: string, lang: Language, params?: Record<string, string>): string {
  const entry = translations[key];
  if (!entry) return key;
  let text = entry[lang] || entry.en;
  if (params) {
    Object.entries(params).forEach(([k, val]) => {
      text = text.replace(`{${k}}`, val);
    });
  }
  return text;
}
