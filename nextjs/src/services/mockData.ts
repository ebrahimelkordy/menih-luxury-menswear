export type Category = 'thobe' | 'shemagh' | 'bisht' | 'fragrances' | 'accessories';

export interface ProductVariant {
  id: string;
  name: string;
  nameAr: string;
  colorHex: string;
  colorFamily: 'neutral' | 'warm' | 'cool' | 'earth' | 'bold';
  image: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  title: string;
  titleAr: string;
  handle: string;
  price: number;
  compareAtPrice?: number;
  category: Category;
  categoryAr: string;
  fabric: string;
  fabricAr: string;
  sizes: string[];
  variants: ProductVariant[];
  rating: number;
  reviewsCount: number;
  description: string;
  descriptionAr: string;
  featured: boolean;
  opacity: string;
  opacityAr: string;
  weight: string;
  dimensions: string;
}

export interface CartItem {
  productId: string;
  variantId: string;
  size: string;
  quantity: number;
  addedAt?: number;
}

// Curated high-luxury editorial images generated specifically for EZAR
const img = {
  heroVeiledMan: '/images/hero-arabian-man.jpg',
  thobeGandoura: '/images/thobe-gandoura.jpg',
  bishtRoyal: '/images/bisht-royal.jpg',
  shemaghKashmiri: '/images/shemagh-kashmiri.jpg',
  oudPerfume: '/images/oud-perfume.jpg',
  tasbihAgateRing: '/images/tasbih-agate-ring.jpg',

  // Fallbacks & Category mapping
  thobeEmirati: '/images/hero-arabian-man.jpg',
  thobeKuwaiti: '/images/thobe-gandoura.jpg',
  thobeSaudi: '/images/thobe-gandoura.jpg',
  gandouraMoroccan: '/images/thobe-gandoura.jpg',

  bishtRoyalBlack: '/images/bisht-royal.jpg',
  bishtSandGold: '/images/bisht-royal.jpg',
  capeWoolWinter: '/images/bisht-royal.jpg',

  shemaghClassicRed: '/images/shemagh-kashmiri.jpg',
  ghutraSwissWhite: '/images/shemagh-kashmiri.jpg',
  shawlKashmiri: '/images/shemagh-kashmiri.jpg',

  fragranceOud: '/images/oud-perfume.jpg',
  fragranceAmber: '/images/oud-perfume.jpg',
  fragranceMusk: '/images/oud-perfume.jpg',

  accessoryTasbih: '/images/tasbih-agate-ring.jpg',
  accessoryRing: '/images/tasbih-agate-ring.jpg',
  accessoryCufflinks: '/images/tasbih-agate-ring.jpg',
  accessoryIqal: '/images/hero-arabian-man.jpg',
};

export const heroImages = img;

const v = (id: string, name: string, nameAr: string, hex: string, family: ProductVariant['colorFamily'], image: string, inStock = true): ProductVariant => ({
  id, name, nameAr, colorHex: hex, colorFamily: family, image, inStock,
});

export const products: Product[] = [
  // 1. Thobes & Gandouras
  {
    id: 'p1',
    title: 'Imperial Emirati Thobe — Crown Edition',
    titleAr: 'ثوب إماراتي سلطاني — إصدار التاج الفاخر',
    handle: 'imperial-emirati-thobe-crown',
    price: 3600,
    compareAtPrice: 4200,
    category: 'thobe',
    categoryAr: 'ثوب فاخر',
    fabric: 'Japanese Toyobo Cotton & Silk Cord',
    fabricAr: 'قطن تويوبو الياباني الفاخر مع طربوش حريري',
    sizes: ['56M', '58L', '60L', '62XL'],
    opacity: 'Silky Matte Finish',
    opacityAr: 'مظهر مطفي حريري مانع للشفافية',
    weight: 'Mid-weight (280g)',
    dimensions: 'Tarboush length: 35cm',
    rating: 5.0,
    reviewsCount: 142,
    featured: true,
    description: 'Bespoke imperial Emirati thobe tailored from cold Japanese Toyobo cotton. Features a handcrafted pure silk tarboush tassel, seamless neckline, and relaxed royal drape.',
    descriptionAr: 'ثوب إماراتي ملكي مفصل من أجود خيوط قطن تويوبو الياباني البارد المقاوم للتجعد، مزين بطربوش حريري نقي منسوج يدوياً ليمنحك وقاراً مهيباً وراحة طوال اليوم.',
    variants: [
      v('p1-v1', 'Pristine Pearl White', 'أبيض لؤلؤي ناصع', '#F8F9FA', 'neutral', img.heroVeiledMan),
      v('p1-v2', 'Royal Cream Ivory', 'كريمي عاجي ملكي', '#F0EAE1', 'neutral', img.thobeGandoura),
    ],
  },
  {
    id: 'p2',
    title: 'Royal Moroccan Gandoura — Gold Sfifa Embroidery',
    titleAr: 'جلابية مغربية ملكية — مطرزة بالصيفة الذهبية',
    handle: 'royal-moroccan-gandoura-gold-sfifa',
    price: 3900,
    compareAtPrice: 4500,
    category: 'thobe',
    categoryAr: 'جلابية مغربية',
    fabric: 'Fine Wool & Hand-Spun Gold Thread',
    fabricAr: 'صوف فاخر وصيفة ذهبية صقيلة',
    sizes: ['58L', '60L', '62XL', '64XXL'],
    opacity: 'Opaque Velvet Touch',
    opacityAr: 'قماش ساتر فاخر بملمس مخملي',
    weight: 'Heavy-weight (380g)',
    dimensions: 'Full Length, Wide Sleeves',
    rating: 5.0,
    reviewsCount: 98,
    featured: true,
    description: 'Authentic royal Moroccan Gandoura hand-embroidered by master artisans in Fes with genuine gold sfifa braid and traditional aqqad buttons. An imperial masterpiece for gatherings and Friday prayers.',
    descriptionAr: 'جلابية مغربية سلطانية محاكة يدوياً بأيدي حرفيي فاس بأفخم تطريزات الصيفة الذهبية والخرط والعقاد الحريرية. قطعة استثنائية لأصحاب الذوق الرفيع في المناسبات وصلاة الجمعة.',
    variants: [
      v('p2-v1', 'Imperial Black & Gold', 'أسود ملكي بالذهب', '#1A1615', 'bold', img.thobeGandoura),
      v('p2-v2', 'Desert Sand & Gold', 'رملي ملكي بالذهب', '#D4AF37', 'warm', img.thobeGandoura),
    ],
  },
  {
    id: 'p3',
    title: 'Bespoke Egyptian Giza Thobe — Nile Pure Staple',
    titleAr: 'ثوب سحابي قطن مصري — قطن جيزة 94 طويل التيلة',
    handle: 'bespoke-egyptian-giza-thobe',
    price: 2800,
    compareAtPrice: 3200,
    category: 'thobe',
    categoryAr: 'ثوب فاخر',
    fabric: '100% Egyptian Giza 94 Extra Long Staple Cotton',
    fabricAr: '١٠٠٪ قطن مصري جيزة 94 طويل التيلة نقي',
    sizes: ['56M', '58L', '60L', '62XL'],
    opacity: 'Crisp Breathable Weave',
    opacityAr: 'نسيج انسيابي فائق البرودة والتهوية',
    weight: 'Light-weight (210g)',
    dimensions: 'Tailored Slim Fit',
    rating: 4.9,
    reviewsCount: 114,
    featured: false,
    description: 'Tailored from the world-renowned Egyptian Giza 94 extra-long staple cotton. Extremely breathable, incredibly soft on the skin, with French cuffed sleeves for custom cufflinks.',
    descriptionAr: 'مفصل من أفخر أقطان العالم (جيزة 94 طويل التيلة). نعومة فائقة تضاهي الحرير، تبريد طبيعي للجسم، وأكمام كبك فرنسية جاهزة للكبكات المذهبة.',
    variants: [
      v('p3-v1', 'Snow White', 'أبيض ناصع', '#FFFFFF', 'neutral', img.thobeGandoura),
      v('p3-v2', 'Ice Blue Tint', 'أزرق ثلجي فاتح', '#E3E8EC', 'cool', img.thobeGandoura),
    ],
  },

  // 2. Shemaghs & Shawls
  {
    id: 'p4',
    title: 'EZAR Royal Crimson Jacquard Shemagh',
    titleAr: 'شماغ إزار الملكي الأحمر — جاكار إمبراطوري',
    handle: 'ezar-royal-crimson-jacquard-shemagh',
    price: 1450,
    compareAtPrice: 1750,
    category: 'shemagh',
    categoryAr: 'شماغ ملكي',
    fabric: '100% Fine Combed Egyptian Cotton',
    fabricAr: '١٠٠٪ قطن مصري ممشط عالي النقاء',
    sizes: ['55', '58', '60'],
    opacity: 'High Density Jacquard Weave',
    opacityAr: 'نسيج جاكار كثيف متطابق الأطراف',
    weight: 'Mid-weight (160g)',
    dimensions: '58 x 58 inches',
    rating: 5.0,
    reviewsCount: 230,
    featured: true,
    description: 'The definitive royal red shemagh crafted from long-staple cotton with tight jacquard geometric weaves. Edges are laser-aligned to ensure perfect symmetrical draping and crease retention.',
    descriptionAr: 'شماغ إزار الكلاسيكي الأحمر المنسوج بأعلى درجات الدقة والجاكار المتقن. حواف متطابقة بالملليمتر وتطريز حريري يمنحك ثباتاً ورسمة شماغ مثالية طوال اليوم.',
    variants: [
      v('p4-v1', 'Imperial Crimson & White', 'أحمر ملوكي وأبيض ناصع', '#8B1E2D', 'bold', img.shemaghKashmiri),
    ],
  },
  {
    id: 'p5',
    title: 'Imperial Kashmiri Pashmina Shawl — Hand Embroidered',
    titleAr: 'شال كشميري باشمينا شتوي — تطريز يدوي أصيل',
    handle: 'imperial-kashmiri-pashmina-shawl',
    price: 4800,
    compareAtPrice: 5600,
    category: 'shemagh',
    categoryAr: 'شال كشميري',
    fabric: '100% Himalayan Grade-A Pashmina Wool',
    fabricAr: '١٠٠٪ صوف باشمينا هيمالاي أصيل نخب أول',
    sizes: ['58 x 58 inches'],
    opacity: 'Supreme Thermal Warmth & Softness',
    opacityAr: 'دفء استثنائي ونعومة حريرية خفيفة الوزن',
    weight: 'Feather-weight Warm (180g)',
    dimensions: '140 x 140 cm',
    rating: 5.0,
    reviewsCount: 86,
    featured: true,
    description: 'Rare hand-spun Kashmiri Pashmina shawl, hand-embroidered with classic paisley royal arabesques by master craftsmen. Delivers unmatched regal warmth and elegance in winter gatherings.',
    descriptionAr: 'شال صوف باشمينا أصيل مغزول ومطرز يدوياً بنقشات الكشمير الملكية العريقة. يمنح حضوراً دافئاً ومهيباً للغاية في المناسبات والأمسيات الشتوية الفاخرة.',
    variants: [
      v('p5-v1', 'Burgundy & Gold Paisley', 'عنابي دافئ مع تطريز ذهبي', '#5C1D24', 'warm', img.shemaghKashmiri),
      v('p5-v2', 'Royal Camel Brown', 'جملي ملكي مطرز', '#967140', 'earth', img.shemaghKashmiri),
    ],
  },
  {
    id: 'p6',
    title: 'Swiss Voile Imperial White Ghutra',
    titleAr: 'غترة سويسرية بيضاء ويل سوبر — نعومة الحرير',
    handle: 'swiss-voile-imperial-white-ghutra',
    price: 1200,
    category: 'shemagh',
    categoryAr: 'غترة فاخرة',
    fabric: '100% Swiss Cotton Voile',
    fabricAr: '١٠٠٪ قطن ويل سويسري نقي',
    sizes: ['54', '56', '58'],
    opacity: 'Semi-sheer Ethereal Flow',
    opacityAr: 'انسياب هوائي حريري فائق الخفة',
    weight: 'Ultra-light (95g)',
    dimensions: '56 x 56 inches',
    rating: 4.9,
    reviewsCount: 92,
    featured: false,
    description: 'Ethereal Swiss Voile ghutra woven to whisper-thin perfection. Cool, crisp, and pure white to complete your formal coordinate look with effortless dignity.',
    descriptionAr: 'غترة ويل سويسرية بيضاء ناصعة، خفيفة كالنسيم وناعمة كالحرير، تمنح إطلالتك نقاءً وهدوءاً ساحراً.',
    variants: [
      v('p6-v1', 'Pure Brilliant White', 'أبيض ناصع نقي', '#FFFFFF', 'neutral', img.shemaghKashmiri),
    ],
  },

  // 3. Royal Bisht & Capes
  {
    id: 'p7',
    title: 'Najdi Royal Ceremonial Bisht — 24K Gold German Zaree',
    titleAr: 'بشت نجدي ملكي فاخر — زري ألماني مذهب عيار 24',
    handle: 'najdi-royal-ceremonial-gold-bisht',
    price: 7900,
    compareAtPrice: 9200,
    category: 'bisht',
    categoryAr: 'بشت ملكي',
    fabric: 'Fine Japanese Summer Wool & 24K Gold Zaree',
    fabricAr: 'غاط صوف ياباني فاخر وزري ألماني مذهب عيار 24',
    sizes: ['27 (Short)', '28 (Standard)', '29 (Tall)', '30 (Extra Tall)'],
    opacity: 'Majestic Sheer Drape',
    opacityAr: 'قماش غاط صيفي خفيف ساتر بوقار',
    weight: 'Light Ceremonial (450g)',
    dimensions: 'Custom tailored length & neckline',
    rating: 5.0,
    reviewsCount: 76,
    featured: true,
    description: 'The pinnacle of Arabian prestige. Woven from superfine Japanese wool and adorned with authentic German 24K gold-plated zaree embroidery along the neckline and cuffs. Worn for weddings, Eid, and high state events.',
    descriptionAr: 'قمة الفخامة والهيبة العربية. مشلح نجدي ملكي بخياطة يدوية دقيقة وزري ألماني مذهب عيار 24 لا يبهت مع الزمن. صُمم للمناسبات الكبرى والأعياد وحفلات الزفاف الملكية.',
    variants: [
      v('p7-v1', 'Imperial Royal Black', 'أسود ملكي بالزري الذهبي', '#0D0B0A', 'bold', img.bishtRoyal),
      v('p7-v2', 'Desert Honey Sand', 'سكري / رملي بالزري الذهبي', '#D9C5A0', 'warm', img.bishtRoyal),
    ],
  },
  {
    id: 'p8',
    title: 'Royal Winter Wool & Velvet Cape / Burnous',
    titleAr: 'برنس ورداء جوخ ملكي شتوي — مطرز بالزري الأصيل',
    handle: 'royal-winter-wool-velvet-cape',
    price: 6500,
    compareAtPrice: 7500,
    category: 'bisht',
    categoryAr: 'رداء وبرنس شتوي',
    fabric: 'Heavy English Broadcloth Wool & Velvet Trim',
    fabricAr: 'جوخ إنجليزي ثقيل نقي وأطراف مخملية مطرزة',
    sizes: ['Standard Royal Fit (58-62)'],
    opacity: 'Heavy Opaque Windproof',
    opacityAr: 'قماش جوخ كثيف عازل للبرودة تماماً',
    weight: 'Heavy Winter Robe (1.2kg)',
    dimensions: 'Full Floor Length',
    rating: 5.0,
    reviewsCount: 54,
    featured: false,
    description: 'A majestic winter outer cape crafted from heavyweight English wool with ornate Arabesque gold braid embroidery and a royal tassel hood. Keeps you effortlessly warm and impeccably commanding in the coldest evenings.',
    descriptionAr: 'رداء وبرنس شتوي فاخر من الجوخ الإنجليزي الثقيل المبطن، مطرز بالزخارف الأندلسية والمشرقية الأصيلة مع كركوشة حريرية. يمنحك دفئاً مطلقاً وحضوراً أسطورياً.',
    variants: [
      v('p8-v1', 'Midnight Black Gold', 'أسود ملكي مطرز بالذهب', '#121010', 'bold', img.bishtRoyal),
      v('p8-v2', 'Imperial Navy & Silver', 'كحلي ليلي بالزري الفضي', '#1A2332', 'cool', img.bishtRoyal),
    ],
  },

  // 4. Fragrances & Aged Oud
  {
    id: 'p9',
    title: '15-Year Aged Pure Cambodian Dehn El Oud',
    titleAr: 'دهن عود كمبودي ملكي معتق ١٥ سنة — نقي ١٠٠٪',
    handle: '15-year-aged-cambodian-dehn-el-oud',
    price: 4200,
    compareAtPrice: 4800,
    category: 'fragrances',
    categoryAr: 'دهن عود فاخر',
    fabric: '100% Pure Wild Cambodian Agarwood Oil',
    fabricAr: 'خلاصة أشجار العود الكمبودي البري النادر (تعتيق ١٥ عاماً)',
    sizes: ['1/4 Tola (3ml)', '1/2 Tola (6ml)', '1 Full Tola (12ml)'],
    opacity: 'Deep Amber Viscous Nectar',
    opacityAr: 'قوام عسلي لزج وكثيف برائحة بخورية عميقة',
    weight: 'Tola Crystal Bottle',
    dimensions: 'Hand-cut Crystal & Gold Flacon',
    rating: 5.0,
    reviewsCount: 168,
    featured: true,
    description: 'Pure, wild, 15-year vintage Cambodian Oud extracted by traditional steam distillation. Deeply woody, leathery, and sweetly balsamic with an intoxicating sillage that endures on fabrics for days.',
    descriptionAr: 'دهن عود كمبودي بري معتق لمدة ١٥ عاماً في أوانٍ فخارية معتمة. نكهة خشبية بخورية سويتية آسرة، فوحان وثبات ممتد لعدة أيام على الثياب والغتر.',
    variants: [
      v('p9-v1', 'Aged Royal Dark Cambodian', 'دهن عود معتق نخب أول', '#4A2511', 'earth', img.oudPerfume),
    ],
  },
  {
    id: 'p10',
    title: 'Ezar Imperial Amber & Taif Rose Extrait',
    titleAr: 'عطر إزار السلطاني — العنبر والمسك والورد الطائفي',
    handle: 'maison-ezar-imperial-amber-taif-rose',
    price: 3400,
    compareAtPrice: 3900,
    category: 'fragrances',
    categoryAr: 'عطر فاخر',
    fabric: 'Extrait de Parfum (35% Oil Concentration)',
    fabricAr: 'تركيز زيت عطري نقي ٣٥٪ (Extrait de Parfum)',
    sizes: ['100ml / 3.4 fl oz'],
    opacity: 'Golden Obsidian Bottle',
    opacityAr: 'زجاجة كريستال أوبسيديان داكنة بغطاء مذهب',
    weight: 'Heavy Glass Flacon (620g)',
    dimensions: 'Luxury Wooden Box & Velvet Lining',
    rating: 4.9,
    reviewsCount: 124,
    featured: true,
    description: 'An opulent symphony of golden amber, warm white musk, rare Taif rose, and precious Indian sandalwood. Designed for the gentleman whose scent commands the room before he speaks.',
    descriptionAr: 'توليفة عطرية ملكية تجمع فخامة العنبر الذهبي، المسك الأبيض الصافي، تقطير الورد الطائفي الجبلي، وخشب الصندل الميسوري. عطر يترك أثراً لا يُنسى في كل مجلس.',
    variants: [
      v('p10-v1', 'Imperial Black & Gold Flacon', 'زجاجة ملكية مذهبة 100 مل', '#1A1615', 'warm', img.oudPerfume),
    ],
  },

  // 5. Authentic Accessories & Gemstones
  {
    id: 'p11',
    title: 'Imperial Translucent Amber Tasbih — 925 Silver Tassel',
    titleAr: 'سبحة كهرمان ملكية فاخرة — شاهد وتمليكة فضة ٩٢٥',
    handle: 'imperial-amber-tasbih-silver-tassel',
    price: 3600,
    compareAtPrice: 4200,
    category: 'accessories',
    categoryAr: 'سبحة ملكية',
    fabric: 'Natural Baltic Amber & 925 Sterling Silver',
    fabricAr: 'حجر كهرمان بلطيقي طبيعي وفضة إسترليني ٩٢٥',
    sizes: ['33 Beads (12mm)', '99 Beads (8mm)'],
    opacity: 'Translucent Honey Amber Glow',
    opacityAr: 'خراطة برميلية ناعمة بلون العسل الصافي',
    weight: 'Solid Gemstone (65g)',
    dimensions: '33 Beads, 12mm diameter',
    rating: 5.0,
    reviewsCount: 95,
    featured: true,
    description: 'Hand-carved translucent golden amber prayer beads featuring natural inclusions and an intoxicating pine resonance. Finished with an intricately woven 925 sterling silver tassel.',
    descriptionAr: 'سبحة كهرمان طبيعي فاخرة بلون العسل الذهبي، ملمس انسيابي دافئ وتمليكة وشاهد محاك يدوياً من الفضة الإسترليني عيار ٩٢٥. تحفة حقيقية تزداد قيمة مع الزمن.',
    variants: [
      v('p11-v1', 'Golden Honey Amber', 'كهرمان ذهبي عسلي شفاف', '#E5A93C', 'warm', img.tasbihAgateRing),
    ],
  },
  {
    id: 'p12',
    title: 'Handcrafted 925 Sterling Silver Yemeni Agate Ring',
    titleAr: 'خاتم فضة ٩٢٥ مرصع بعقيق يماني كبدي أصيل',
    handle: 'handcrafted-silver-yemeni-agate-ring',
    price: 2200,
    category: 'accessories',
    categoryAr: 'خاتم فضة وعقيق',
    fabric: 'Solid 925 Sterling Silver & Natural Yemeni Agate',
    fabricAr: 'فضة إسترليني ثقيلة عيار ٩٢٥ وعقيق يماني كبدي طبيعي',
    sizes: ['US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    opacity: 'Deep Crimson Cabochon',
    opacityAr: 'حجر عقيق يماني كبدي نقي بلمعة زجاجية',
    weight: 'Heavy Silver (16g)',
    dimensions: 'Cabochon 18x13mm',
    rating: 5.0,
    reviewsCount: 88,
    featured: false,
    description: 'A bespoke heavyweight 925 sterling silver ring featuring traditional Ottoman engraved filigree, crowned with a natural deep crimson Yemeni Agate (عقيق يماني كبدي) mined from the mountains of Sanaa.',
    descriptionAr: 'صياغة يدوية متقنة من الفضة الإسترليني الثقيلة بنقوش عربية أصيلة، يتوسطها فص عقيق يماني كبدي طبيعي نقي مستخرج من جبال اليمن الشقيقة.',
    variants: [
      v('p12-v1', 'Oxidized Silver & Deep Crimson', 'فضة معتقة مع عقيق كبدي', '#800000', 'bold', img.tasbihAgateRing),
    ],
  },
  {
    id: 'p13',
    title: '24K Gold-Plated Islamic Geometric Cufflinks',
    titleAr: 'أزرار كبك مذهبة عيار ٢٤ — زخارف هندسية إسلامية',
    handle: '24k-gold-plated-islamic-geometric-cufflinks',
    price: 1600,
    category: 'accessories',
    categoryAr: 'كبكات مذهبة',
    fabric: 'Solid Brass Plated with 24K Pure Gold',
    fabricAr: 'نحاس صلب مطلي بذهب خالص عيار ٢٤ مقاوم للخدش',
    sizes: ['Standard Cuff Size'],
    opacity: 'Brushed & Polished Gold Dual Finish',
    opacityAr: 'تشطيب مزدوج لامع ومطفي غير قابل للبهتان',
    weight: 'Pair (22g)',
    dimensions: '18mm Octagonal Face',
    rating: 4.9,
    reviewsCount: 79,
    featured: false,
    description: 'Octagonal luxury cufflinks engraved with Islamic geometric star patterns and finished in 24K yellow gold. The quintessential finishing touch for French cuffed bespoke thobes.',
    descriptionAr: 'أزرار كبك ثمانية الأضلاع مستوحاة من الزخارف النجمية الإسلامية ومطلية بالذهب الخالص عيار ٢٤. اللمسة الختامية الأنيقة لأكمام الثوب الملكي.',
    variants: [
      v('p13-v1', 'Imperial Yellow Gold', 'ذهب أصفر ملكي عيار ٢٤', '#C5A880', 'warm', img.tasbihAgateRing),
    ],
  },
];

export interface CategoryInfo {
  id: Category;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  image: string;
}

export const categories: CategoryInfo[] = [
  {
    id: 'thobe',
    name: 'Thobes & Gandouras',
    nameAr: 'الثياب والجلابيات الملكية',
    description: 'Bespoke Egyptian Giza cotton thobes & royal Moroccan gold embroidered Gandouras',
    descriptionAr: 'ثياب مفصلة من قطن الجيزة المصري الفاخر وجلابيات مغربية ملكية مطرزة بالصيفة',
    image: img.thobeGandoura,
  },
  {
    id: 'shemagh',
    name: 'Shemaghs & Kashmiri Shawls',
    nameAr: 'الأشمغة والشيلان الكشميرية',
    description: 'Imperial red jacquard shemaghs and authentic hand-embroidered Kashmiri pashminas',
    descriptionAr: 'أشمغة ملكية بنقش الجاكار وشيلان صوف كشميري باشمينا مطرزة يدوياً',
    image: img.shemaghKashmiri,
  },
  {
    id: 'bisht',
    name: 'Royal Bishts & Capes',
    nameAr: 'البشوت والأردية الملكية',
    description: 'Handcrafted Najdi ceremonial Bishts with 24k gold zaree & royal winter capes',
    descriptionAr: 'مشالح وبشوت ملكية محاكة بزري الذهب عيار 24 وأردية جوخ شتوية',
    image: img.bishtRoyal,
  },
  {
    id: 'fragrances',
    name: 'Maison Oud & Perfumes',
    nameAr: 'عطور الدار والعود المعتق',
    description: '15-year aged pure Cambodian Oud oil, Imperial Amber, and Taif rose extraits',
    descriptionAr: 'دهن عود كمبودي ملكي معتق 15 عاماً، وعطور العنبر السلطاني والورد الطائفي',
    image: img.oudPerfume,
  },
  {
    id: 'accessories',
    name: 'Heritage Gems & Tasbih',
    nameAr: 'النفائس والسبح الكهرمان',
    description: 'Imperial amber & faturan prayer beads, 925 sterling silver Yemeni agate rings, & gold cufflinks',
    descriptionAr: 'سبح كهرمان وفاتوران ملكية، خواتم فضة 925 مرصعة بعقيق يماني كبدي، وكبكات مذهبة',
    image: img.tasbihAgateRing,
  },
];

export const bundleDiscount = 0.85;

export function formatPrice(price: number, currency: 'EGP' | 'USD' = 'EGP', lang: 'en' | 'ar' = 'ar'): string {
  if (currency === 'USD') {
    return `$${Math.round(price / 50)}`;
  }
  return lang === 'ar' ? `${price.toLocaleString('ar-EG')} ج.م` : `${price.toLocaleString('en-US')} EGP`;
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export const colorFamilyLabels: Record<string, { en: string; ar: string; hex: string }> = {
  neutral: { en: 'Neutrals & Whites', ar: 'أبيض وحيادي', hex: '#F8F9FA' },
  warm: { en: 'Royal Gold & Amber', ar: 'ذهبي وعنبر', hex: '#D4AF37' },
  cool: { en: 'Silver & Ice Navy', ar: 'فضي وكحلي', hex: '#1A2332' },
  earth: { en: 'Desert Sand & Oud Earth', ar: 'رملي وعودي', hex: '#4A2511' },
  bold: { en: 'Imperial Black & Crimson', ar: 'أسود وعنابي', hex: '#8B1E2D' },
};

export const fabricTypes = [
  { id: 'all', name: 'All Materials', nameAr: 'جميع الخامات' },
  { id: 'Japanese Toyobo Cotton & Silk Cord', name: 'Japanese Toyobo Cotton', nameAr: 'قطن تويوبو الياباني' },
  { id: 'Fine Wool & Hand-Spun Gold Thread', name: 'Fine Wool & Gold Thread', nameAr: 'صوف فاخر وصيفة ذهبية' },
  { id: '100% Egyptian Giza 94 Extra Long Staple Cotton', name: 'Egyptian Giza 94 Cotton', nameAr: 'قطن جيزة مصري 94' },
  { id: '100% Fine Combed Egyptian Cotton', name: 'Combed Egyptian Cotton', nameAr: 'قطن مصري ممشط' },
  { id: '100% Himalayan Grade-A Pashmina Wool', name: 'Himalayan Pashmina Wool', nameAr: 'صوف باشمينا كشميري' },
  { id: '100% Swiss Cotton Voile', name: 'Swiss Cotton Voile', nameAr: 'قطن ويل سويسري' },
  { id: 'Fine Japanese Summer Wool & 24K Gold Zaree', name: 'Japanese Summer Wool & 24K Zaree', nameAr: 'صوف ياباني وزري ألماني' },
  { id: 'Heavy English Broadcloth Wool & Velvet Trim', name: 'English Wool & Velvet', nameAr: 'جوخ إنجليزي ومخمل' },
  { id: '100% Pure Wild Cambodian Agarwood Oil', name: 'Cambodian Oud Oil', nameAr: 'دهن عود كمبودي معتق' },
  { id: 'Extrait de Parfum (35% Oil Concentration)', name: 'Extrait de Parfum', nameAr: 'خلاصة عطرية نقية' },
  { id: 'Natural Baltic Amber & 925 Sterling Silver', name: 'Baltic Amber & 925 Silver', nameAr: 'كهرمان طبيعي وفضة' },
  { id: 'Solid 925 Sterling Silver & Natural Yemeni Agate', name: '925 Silver & Yemeni Agate', nameAr: 'فضة 925 وعقيق يماني' },
  { id: 'Solid Brass Plated with 24K Pure Gold', name: '24K Gold Plated Brass', nameAr: 'نحاس مطلي بذهب 24' },
];

export const trendingSearches = [
  { en: 'Moroccan Gandoura', ar: 'جلابية مغربية' },
  { en: 'Egyptian Giza Thobe', ar: 'ثوب قطن مصري' },
  { en: 'Kashmiri Shawl', ar: 'شال كشميري' },
  { en: 'Royal Najdi Bisht', ar: 'بشت نجدي مذهب' },
  { en: 'Cambodian Oud Oil', ar: 'دهن عود كمبودي' },
  { en: 'Amber Tasbih', ar: 'سبحة كهرمان' },
  { en: 'Yemeni Agate Ring', ar: 'خاتم عقيق يماني' },
];

export const recentSearches = [
  'جلابية مغربية بالصيفة',
  'ثوب إماراتي ملكي',
  'دهن عود معتق',
  'شال كشميري باشمينا',
  'سبحة كهرمان ملكية',
];

export const freeShippingThreshold = 1500;

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductByHandle(handle: string): Product | undefined {
  return products.find((p) => p.handle === handle);
}

export function getVariantById(productId: string, variantId: string): ProductVariant | undefined {
  const product = getProductById(productId);
  return product?.variants.find((v) => v.id === variantId);
}
