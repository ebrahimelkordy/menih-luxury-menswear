import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding MENIH Luxury Islamic Menswear (Expanded Dataset) to PostgreSQL via Prisma...');

  // 1. Categories
  const categoriesData = [
    {
      slug: 'thobe',
      name: 'Thobes & Gandouras',
      nameAr: 'الثياب والجلابيات الملكية',
      description: 'Bespoke Egyptian Giza cotton thobes & royal Moroccan gold embroidered Gandouras',
      descriptionAr: 'ثياب مفصلة من قطن الجيزة المصري الفاخر وجلابيات مغربية ملكية مطرزة بالصيفة',
      image: '/images/thobe-gandoura.jpg',
      displayOrder: 1,
    },
    {
      slug: 'shemagh',
      name: 'Shemaghs & Kashmiri Shawls',
      nameAr: 'الأشمغة والشيلان الكشميرية',
      description: 'Imperial red jacquard shemaghs and authentic hand-embroidered Kashmiri pashminas',
      descriptionAr: 'أشمغة ملكية بنقش الجاكار وشيلان صوف كشميري باشمينا مطرزة يدوياً',
      image: '/images/shemagh-kashmiri.jpg',
      displayOrder: 2,
    },
    {
      slug: 'bisht',
      name: 'Royal Bishts & Capes',
      nameAr: 'البشوت والأردية الملكية',
      description: 'Handcrafted Najdi ceremonial Bishts with 24k gold zaree & royal winter capes',
      descriptionAr: 'مشالح وبشوت ملكية محاكة بزري الذهب عيار 24 وأردية جوخ شتوية',
      image: '/images/bisht-royal.jpg',
      displayOrder: 3,
    },
    {
      slug: 'fragrances',
      name: 'Maison Oud & Perfumes',
      nameAr: 'عطور الدار والعود المعتق',
      description: '15-year aged pure Cambodian Oud oil, Imperial Amber, and Taif rose extraits',
      descriptionAr: 'دهن عود كمبودي ملكي معتق 15 عاماً، وعطور العنبر السلطاني والورد الطائفي',
      image: '/images/oud-perfume.jpg',
      displayOrder: 4,
    },
    {
      slug: 'accessories',
      name: 'Heritage Gems & Tasbih',
      nameAr: 'النفائس والسبح الكهرمان',
      description: 'Natural Baltic amber prayer beads, handcrafted Yemeni agate rings & 24k gold cufflinks',
      descriptionAr: 'سبح كهرمان بلطيقي أصيل، خواتم عقيق يماني يدوي من الفضة 925، وأزرار كبك مذهبة',
      image: '/images/tasbih-agate-ring.jpg',
      displayOrder: 5,
    },
  ];

  const categoryMap: Record<string, string> = {};

  for (const cat of categoriesData) {
    const upserted = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap[cat.slug] = upserted.id;
  }

  console.log('Categories seeded.');

  // 2. Expanded Products Catalog
  const productsData = [
    // ── THOBES & GANDOURAS ──
    {
      handle: 'imperial-emirati-thobe-crown',
      categorySlug: 'thobe',
      title: 'Imperial Emirati Thobe — Crown Edition',
      titleAr: 'ثوب إماراتي سلطاني — إصدار التاج الفاخر',
      price: 3600,
      compareAtPrice: 4200,
      fabric: 'Japanese Toyobo Cotton & Silk Cord',
      fabricAr: 'قطن تويوبو الياباني الفاخر مع طربوش حريري',
      sizes: ['56M', '58L', '60L', '62XL'],
      rating: 5.0,
      reviewsCount: 142,
      featured: true,
      description: 'Bespoke imperial Emirati thobe tailored from cold Japanese Toyobo cotton. Features a handcrafted pure silk tarboush tassel, seamless neckline, and relaxed royal drape.',
      descriptionAr: 'ثوب إماراتي ملكي مفصل من أجود خيوط قطن تويوبو الياباني البارد المقاوم للتجعد، مزين بطربوش حريري نقي منسوج يدوياً ليمنحك وقاراً مهيباً وراحة طوال اليوم.',
      variants: [
        { name: 'Pristine Pearl White', nameAr: 'أبيض لؤلؤي ناصع', colorHex: '#F8F9FA', colorFamily: 'neutral', image: '/images/hero-arabian-man.jpg', inStock: true },
        { name: 'Royal Cream Ivory', nameAr: 'كريمي عاجي ملكي', colorHex: '#F0EAE1', colorFamily: 'neutral', image: '/images/thobe-gandoura.jpg', inStock: true },
      ],
    },
    {
      handle: 'royal-moroccan-gandoura-gold-sfifa',
      categorySlug: 'thobe',
      title: 'Royal Moroccan Gandoura — Pure Gold Sfifa',
      titleAr: 'جلابية مغربية ملكية — مطرزة بالصيفة الذهبية',
      price: 4900,
      compareAtPrice: 5600,
      fabric: 'Fine Wool & Hand-Spun Gold Thread',
      fabricAr: 'صوف رقيق فاخر وخيوط صيفة مذهبة بالعقاد الحريرية',
      sizes: ['M (56)', 'L (58)', 'XL (60)', 'XXL (62)'],
      rating: 5.0,
      reviewsCount: 98,
      featured: true,
      description: 'Handcrafted Moroccan Gandoura from the Fez artisan quarters. Tailored with genuine gold-threaded sfifa borders, silk handmade aqqad buttons, and an imperial hoodless silhouette for ceremonial prestige.',
      descriptionAr: 'جلابية مغربية ملوكية فاخرة مصممة بأيدي كبار الحرفيين، مطرزة بالصيفة الذهبية اليدوية وعقاد الحرير الخالص، تمنحك إطلالة فريدة ومتميزة في المناسبات الكبرى والاحتفالات.',
      variants: [
        { name: 'Imperial Obsidian & Gold', nameAr: 'أسود فحمي بالذهب الملكي', colorHex: '#1A1615', colorFamily: 'bold', image: '/images/thobe-gandoura.jpg', inStock: true },
        { name: 'Emerald Green & Gold', nameAr: 'أخضر زمردي بالذهب', colorHex: '#1C3A27', colorFamily: 'bold', image: '/images/thobe-gandoura.jpg', inStock: true },
      ],
    },
    {
      handle: 'egyptian-giza-94-bespoke-thobe',
      categorySlug: 'thobe',
      title: 'Egyptian Giza 94 Cotton Thobe — Tailored Cut',
      titleAr: 'ثوب سحابي من قطن الجيزة المصري ٩٤ الفاخر',
      price: 2950,
      compareAtPrice: 3400,
      fabric: '100% Egyptian Giza 94 Extra Long Staple Cotton',
      fabricAr: '١٠٠٪ قطن مصري جيزة ٩٤ طويل التيلة فائق النعومة',
      sizes: ['54S', '56M', '58L', '60L', '62XL'],
      rating: 4.9,
      reviewsCount: 174,
      featured: true,
      description: 'The pinnacle of Egyptian cotton craftsmanship. Woven from genuine extra-long staple Giza 94 cotton for unmatched breathability, silky hand-feel, and crisp silhouette.',
      descriptionAr: 'أرقى ما أبدعته الأيدي المصرية من أنقى أقطان العالم (جيزة ٩٤). نسيج يجمع بين النعومة الفائقة والبرودة واللمعة الحريرية الطبيعية التي تدوم مع الغسيل.',
      variants: [
        { name: 'Pure Snow White', nameAr: 'أبيض ناصع مثلج', colorHex: '#FFFFFF', colorFamily: 'neutral', image: '/images/thobe-gandoura.jpg', inStock: true },
        { name: 'Desert Dune Beige', nameAr: 'بيج رملي صحراوي', colorHex: '#D8CAB8', colorFamily: 'earth', image: '/images/hero-arabian-man.jpg', inStock: true },
      ],
    },
    {
      handle: 'kuwaiti-prestige-crepe-thobe',
      categorySlug: 'thobe',
      title: 'Kuwaiti Prestige Crepe Thobe — Formal Edition',
      titleAr: 'ثوب كويتي رسمي من قماش الكريب الياباني المنسدل',
      price: 3400,
      compareAtPrice: 3900,
      fabric: 'Premium Japanese Double-Twist Crepe',
      fabricAr: 'كريب ياباني فاخر ثنائي الخيوط عالي الانسيابية',
      sizes: ['56M', '58L', '60L', '62XL'],
      rating: 5.0,
      reviewsCount: 89,
      featured: false,
      description: 'Classic Kuwaiti cut with rounded collar, clean cuffs, and weighted Japanese crepe that resists wrinkles and falls in clean architectural lines.',
      descriptionAr: 'قصة كويتية راقية بياقة دائرية محكمة وقماش كريب ياباني ذو وزن مثالي يمنح الثوب هيبة واستقامة لا تتأثر بحركة اليوم.',
      variants: [
        { name: 'Light Oyster Grey', nameAr: 'رمادي صخري فاتح', colorHex: '#D1CECB', colorFamily: 'neutral', image: '/images/thobe-gandoura.jpg', inStock: true },
        { name: 'Warm Alabaster', nameAr: 'أبيض عاجي دافئ', colorHex: '#FAF5ED', colorFamily: 'neutral', image: '/images/hero-arabian-man.jpg', inStock: true },
      ],
    },
    {
      handle: 'moroccan-djellaba-ouazzania-wool',
      categorySlug: 'thobe',
      title: 'Moroccan Royal Djellaba — Handwoven Atlas Wool',
      titleAr: 'جلابة مغربية وزانية ملكية — صوف الأطلس الحر المحاك يدوياً',
      price: 5400,
      compareAtPrice: 6200,
      fabric: '100% Handwoven Natural Mountain Wool',
      fabricAr: '١٠٠٪ صوف جبلي وزاني نقي محاك يدوياً بنول تقليدي',
      sizes: ['L (58)', 'XL (60)', 'XXL (62)'],
      rating: 5.0,
      reviewsCount: 67,
      featured: false,
      description: 'Masterpiece winter Djellaba handwoven in the Rif mountains of Ouazzane. Features the iconic royal hood, handmade silk aqqad, and soft insulating texture.',
      descriptionAr: 'تحفة شتوية أصيلة منسوجة على الأنوال التراثية في مدينة وزان، تجمع بين دفء الصوف الأطلسي الطبيعي والقب الملكي المطرز بخيوط الحرير الخالص.',
      variants: [
        { name: 'Natural Sand Wool', nameAr: 'صوف بيج رملي طبيعي', colorHex: '#CBBFA8', colorFamily: 'earth', image: '/images/thobe-gandoura.jpg', inStock: true },
      ],
    },

    // ── SHEMAGHS & SHAWLS ──
    {
      handle: 'menih-royal-red-jacquard-shemagh',
      categorySlug: 'shemagh',
      title: 'Maison Menih Royal Red Jacquard Shemagh',
      titleAr: 'شماغ المنيع الملكي الأحمر — نقش جاكار مذهب',
      price: 1450,
      compareAtPrice: 1750,
      fabric: '100% Fine Combed Egyptian Cotton',
      fabricAr: '١٠٠٪ قطن مصري ممشط فائق النقاء وثابت النقشة',
      sizes: ['55', '58', '60', '62'],
      rating: 5.0,
      reviewsCount: 310,
      featured: true,
      description: 'Classic crimson red and snow-white jacquard woven shemagh with weighted golden thread edges. Holds a razor-sharp royal peak throughout the day.',
      descriptionAr: 'شماغ أحمر ملكي كلاسيكي منسوج بنقشة الجاكار الغنية وخيوط قطنية نقية 100%، يضمن ترسيمة ثابتة ووقاراً لا يضاهى طوال اليوم.',
      variants: [
        { name: 'Imperial Crimson Red', nameAr: 'أحمر ملوكي كلاسيكي', colorHex: '#8B1E2D', colorFamily: 'bold', image: '/images/shemagh-kashmiri.jpg', inStock: true },
      ],
    },
    {
      handle: 'kashmiri-pashmina-embroidered-shawl',
      categorySlug: 'shemagh',
      title: 'Hand-Embroidered Himalayan Pashmina Shawl',
      titleAr: 'شال كشميري باشمينا صوف نقي — تطريز يدوي',
      price: 5200,
      compareAtPrice: 6000,
      fabric: '100% Himalayan Grade-A Pashmina Wool',
      fabricAr: '١٠٠٪ صوف باشمينا هيمالايان نقي منسوج يدوياً',
      sizes: ['One Size (140x140cm)'],
      rating: 5.0,
      reviewsCount: 86,
      featured: true,
      description: 'Exquisite authentic Kashmiri winter shawl spun from raw Grade-A pashmina wool. Embellished with needlework sozni embroidery along the borders.',
      descriptionAr: 'شال شتوي فاخر منسوج من صوف الباشمينا الكشميري النقي، محبوك بتطريز الإبرة اليدوي الدقيق على الحواف ليوفر دفئاً ملكياً خفيف الوزن.',
      variants: [
        { name: 'Natural Sand & Gold', nameAr: 'رملي دافئ بتطريز ذهبي', colorHex: '#C5A880', colorFamily: 'earth', image: '/images/shemagh-kashmiri.jpg', inStock: true },
        { name: 'Midnight Charcoal', nameAr: 'رمادي فحمي ملكي', colorHex: '#2B2B2B', colorFamily: 'bold', image: '/images/shemagh-kashmiri.jpg', inStock: true },
      ],
    },
    {
      handle: 'swiss-cotton-voile-white-ghutra',
      categorySlug: 'shemagh',
      title: 'Swiss Cotton Voile White Royal Ghutra',
      titleAr: 'غترة ويل سويسرية بيضاء — إصدار الشيوخ',
      price: 1250,
      compareAtPrice: 1500,
      fabric: '100% Swiss Cotton Voile',
      fabricAr: 'قطن ويل سويسري فائق الخفة والنعومة',
      sizes: ['54', '56', '58', '60'],
      rating: 4.9,
      reviewsCount: 165,
      featured: false,
      description: 'Ultra-lightweight Swiss cotton voile white ghutra designed for hot climates. Imparts an effortless, breezy drape with pure white radiance.',
      descriptionAr: 'غترة بيضاء ملوكية منسوجة في سويسرا من أندر خيوط القطن الخفيف البارد، تنسدل بانسيابية مذهلة لراحة مطلقة في الأيام المشمسة.',
      variants: [
        { name: 'Glacier Pure White', nameAr: 'أبيض ثلجي نقي', colorHex: '#FFFFFF', colorFamily: 'neutral', image: '/images/shemagh-kashmiri.jpg', inStock: true },
      ],
    },
    {
      handle: 'desert-falcon-cashmere-shawl',
      categorySlug: 'shemagh',
      title: 'Falcon Heritage Cashmere Shawl — Gold Thread Weave',
      titleAr: 'شال صوف كشميري بنقشة الصقر — خيوط ذهبية',
      price: 4800,
      compareAtPrice: 5500,
      fabric: '100% Pure Mongolian Cashmere',
      fabricAr: '١٠٠٪ كشمير منغولي فائق النعومة مدمج بحواشي مذهبة',
      sizes: ['Standard (135x135cm)'],
      rating: 5.0,
      reviewsCount: 43,
      featured: false,
      description: 'Warm cashmere shawl with deep camel and bronze heritage motifs, designed for winter evening majlises and high-profile receptions.',
      descriptionAr: 'شال كشميري بلون الجمل الدافئ محلى بنقوش عربية تراثية تمنح الإطلالة فخامة ودفئاً استثنائياً في الأمسيات الشتوية والمجالس.',
      variants: [
        { name: 'Royal Camel & Bronze', nameAr: 'بني جملي ببرونز', colorHex: '#8C6747', colorFamily: 'earth', image: '/images/shemagh-kashmiri.jpg', inStock: true },
      ],
    },

    // ── BISHTS & CAPES ──
    {
      handle: 'royal-najdi-bisht-24k-gold-zaree',
      categorySlug: 'bisht',
      title: 'Royal Najdi Ceremonial Bisht — 24K Gold Zaree',
      titleAr: 'بشت نجدي ملكي فاخر — مطرز بزري الذهب عيار ٢٤',
      price: 7900,
      compareAtPrice: 9200,
      fabric: 'Fine Japanese Summer Wool & 24K Gold Zaree',
      fabricAr: 'صوف ياباني صيفي فائق النعومة مع قصب زري ألماني مذهب عيار ٢٤',
      sizes: ['27 (Small)', '28 (Standard)', '29 (Tall)', '30 (Extra Tall)'],
      rating: 5.0,
      reviewsCount: 72,
      featured: true,
      description: 'The master ceremonial attire of Arabian dignitaries. Hand-tailored in the traditional Najdi pattern with heavy German 24K gold zaree embroidery.',
      descriptionAr: 'قمة الفخامة والوقار العربي للمناسبات الرسمية والأعراس. مشلح نجدي ملكي مشغول يدوياً بقصب الزري الذهبي الألماني عيار 24 ليمنح حضورك هيبة استثنائية.',
      variants: [
        { name: 'Imperial Onyx Black', nameAr: 'أسود ملكي بالذهب', colorHex: '#1A1615', colorFamily: 'bold', image: '/images/bisht-royal.jpg', inStock: true },
        { name: 'Royal Camel Brown', nameAr: 'بني جملي مذهب', colorHex: '#6E472A', colorFamily: 'earth', image: '/images/bisht-royal.jpg', inStock: true },
      ],
    },
    {
      handle: 'imperial-winter-wool-cape-overcoat',
      categorySlug: 'bisht',
      title: 'Imperial Winter Wool Cape — Velvet Collar',
      titleAr: 'رداء جوخ شتوي ملكي — كيب صوف بياقة مخملية',
      price: 6400,
      compareAtPrice: 7200,
      fabric: 'Heavy English Broadcloth Wool & Velvet Trim',
      fabricAr: 'صوف جوخ إنجليزي ثقيل مع ياقة مخملية حريرية',
      sizes: ['Medium', 'Large', 'X-Large'],
      rating: 5.0,
      reviewsCount: 54,
      featured: false,
      description: 'A stately winter cape crafted from heavy English broadcloth wool, lined with satin and finished with a rich black velvet collar.',
      descriptionAr: 'رداء شتوي مهيب للمجالس والأمسيات الباردة، محاك من أفخر أصواف الجوخ الإنجليزية المبطنة بالساتان مع ياقة مخملية تمنح الدفء والأناقة.',
      variants: [
        { name: 'Midnight Jet Black', nameAr: 'أسود داكن وياقة مخمل', colorHex: '#111111', colorFamily: 'bold', image: '/images/bisht-royal.jpg', inStock: true },
      ],
    },
    {
      handle: 'hashemite-royal-bisht-camel',
      categorySlug: 'bisht',
      title: 'Hashemite Summer Bisht — Hand-Spun Camel Hair',
      titleAr: 'مشلح صيفي هاشمي — وبر إبل حر منسوج يدوياً',
      price: 8500,
      compareAtPrice: 9800,
      fabric: 'Fine Natural Camel Hair & German Gold Thread',
      fabricAr: 'وبر إبل صيفي نادر فائق الخفة مع درب ملكي مطرز بالذهب',
      sizes: ['28 (Standard)', '29 (Tall)'],
      rating: 5.0,
      reviewsCount: 39,
      featured: false,
      description: 'Lightweight ceremonial bisht crafted from rare raw camel hair, renowned for its golden luster and breathability in grand formal events.',
      descriptionAr: 'مشلح ملكي صيفي فاخر من وبر الإبل الطبيعي الخفيف، يتألق بدرب زري ألماني عريض يعكس الأصالة والمكانة الرفيعة.',
      variants: [
        { name: 'Golden Camel Hair', nameAr: 'وبر جملي مذهب طبيعي', colorHex: '#9C7A58', colorFamily: 'earth', image: '/images/bisht-royal.jpg', inStock: true },
      ],
    },

    // ── FRAGRANCES & OUDS ──
    {
      handle: 'aged-cambodian-oud-oil-15-years',
      categorySlug: 'fragrances',
      title: 'Aged Wild Cambodian Oud Oil — 15 Years Reserve',
      titleAr: 'دهن عود كمبودي ملكي معتق ١٥ عاماً — نخب أول',
      price: 4200,
      compareAtPrice: 5000,
      fabric: '100% Pure Wild Cambodian Agarwood Oil',
      fabricAr: '١٠٠٪ دهن عود كمبودي بري بيور معتق بدرجة خشبية بلسمية',
      sizes: ['1/4 Tola (3g)', '1/2 Tola (6g)', '1 Full Tola (12g)'],
      rating: 5.0,
      reviewsCount: 198,
      featured: true,
      description: 'Extracted from ancient wild agarwood trees in Koh Kong, aged for 15 years in darkness. Opens with sweet balsamic incense notes that deepen into rich leather and sweet amber.',
      descriptionAr: 'خلاصة أشجار العود البرية العتيقة في غابات كوه كونغ، معتق بعناية فائقة لمدة 15 عاماً. يتميز برائحة بلسمية بخورية سويتية ذات ثبات أسطوري وفواحان ملوكي.',
      variants: [
        { name: '15-Year Reserve Tola', nameAr: 'تولة دهن عود معتق نخب أول', colorHex: '#4A2511', colorFamily: 'earth', image: '/images/oud-perfume.jpg', inStock: true },
      ],
    },
    {
      handle: 'imperial-amber-musk-extrait-de-parfum',
      categorySlug: 'fragrances',
      title: 'Imperial Amber & Taif Rose Extrait de Parfum',
      titleAr: 'عطر العنبر السلطاني والورد الطائفي — إكستري دو بارفان',
      price: 3100,
      compareAtPrice: 3600,
      fabric: 'Extrait de Parfum (35% Oil Concentration)',
      fabricAr: 'تركيز عطري نقي ٣٥٪ مع زيوت عطرية نادرة',
      sizes: ['100ml / 3.4 oz'],
      rating: 4.9,
      reviewsCount: 120,
      featured: false,
      description: 'A sovereign fragrance blending Baltic fossilized amber, first-harvest Taif rose, and smoky sandalwood. Presented in a hand-cut obsidian crystal flacon.',
      descriptionAr: 'توليفة عطرية آسرة تمزج بين دفء العنبر السلطاني وعبير الورد الطائفي المقطر مع خشب الصندل، في زجاجة كريستال سوداء بحروف عربية مذهبة.',
      variants: [
        { name: 'Obsidian Gold Bottle 100ml', nameAr: 'زجاجة كريستال سوداء 100 مل', colorHex: '#2A1810', colorFamily: 'earth', image: '/images/oud-perfume.jpg', inStock: true },
      ],
    },
    {
      handle: 'taif-rose-first-distillation-oil',
      categorySlug: 'fragrances',
      title: 'Royal Taif Rose Oil — First Harvest Distillation',
      titleAr: 'دهن ورد طائفي عرائسي — قطفة أولى ملكية',
      price: 3500,
      compareAtPrice: 4100,
      fabric: '100% Pure First-Harvest Rosa Damascena Trigintipetala',
      fabricAr: 'دهن ورد طائفي أصيل مقطر على الحطب بنقاء تام',
      sizes: ['1/4 Tola (3g)', '1/2 Tola (6g)'],
      rating: 5.0,
      reviewsCount: 77,
      featured: false,
      description: 'Pure oil extracted from thousands of early morning Taif rose petals. Radiates a fresh, opulent floral warmth with extraordinary sillage.',
      descriptionAr: 'خلاصة آلاف بتلات الورد الطائفي المقطوفة في ساعات الفجر الأولى بمزارع الهدا، يتميز بنقاء ساحر ورائحة مخملية تفوح هيبة وأناقة.',
      variants: [
        { name: 'Pure Taif Rose Flacon', nameAr: 'تولة ورد طائفي نقي', colorHex: '#B33951', colorFamily: 'bold', image: '/images/oud-perfume.jpg', inStock: true },
      ],
    },

    // ── ACCESSORIES & GEMS ──
    {
      handle: 'baltic-natural-amber-prayer-beads-tasbih',
      categorySlug: 'accessories',
      title: 'Natural Baltic Amber Royal Tasbih — 925 Silver Tassel',
      titleAr: 'سبحة كهرمان بلطيقي حر طبيعي — شاهد وكركوشة فضة ٩٢٥',
      price: 3800,
      compareAtPrice: 4400,
      fabric: 'Natural Baltic Amber & 925 Sterling Silver',
      fabricAr: 'كهرمان بلطيقي طبيعي برائحة صنوبرية زكية وفضة عيار ٩٢٥',
      sizes: ['33 Beads (11mm)', '45 Beads (10mm)', '99 Beads (8mm)'],
      rating: 5.0,
      reviewsCount: 112,
      featured: true,
      description: 'Crafted from 33 calibrated translucent honey Baltic amber beads that release a subtle pine aroma with handling. Finished with an intricately woven 925 sterling silver tassel.',
      descriptionAr: 'سبحة كهرمان ملكية مكونة من 33 حبة متناسقة ذات لمعة عسلية دافئة تفوح برائحة الصنوبر الطبيعية عند الفرك، متوجة بشاهد مسبوك وكركوشة من الفضة الإسترليني 925.',
      variants: [
        { name: 'Honey Amber & Silver', nameAr: 'كهرمان عسلي شفاف وفضة', colorHex: '#D4AF37', colorFamily: 'warm', image: '/images/tasbih-agate-ring.jpg', inStock: true },
      ],
    },
    {
      handle: 'handcrafted-yemeni-red-agate-silver-ring',
      categorySlug: 'accessories',
      title: 'Handcrafted Yemeni Red Agate Silver Ring',
      titleAr: 'خاتم فضة ٩٢٥ يدوي الصياغة — مرصع بعقيق يماني كبدي أصيل',
      price: 2450,
      compareAtPrice: 2900,
      fabric: 'Solid 925 Sterling Silver & Natural Yemeni Agate',
      fabricAr: 'فضة إسترليني مصمتة ٩٢٥ وحجر عقيق يماني طبيعي نقي',
      sizes: ['US 8 (18mm)', 'US 9 (19mm)', 'US 10 (20mm)', 'US 11 (21mm)'],
      rating: 5.0,
      reviewsCount: 88,
      featured: false,
      description: 'An authentic cabochon cut natural Yemeni red/liver agate gemstone mounted on a heavy hand-carved 925 sterling silver band with Arabic arabesque motifs.',
      descriptionAr: 'صياغة يدوية أصيلة من الفضة الإسترليني الثقيلة بنقوش إسلامية بديعة، يتوسطها فص عقيق يماني كبدي طبيعي ذو لمعة زجاجية ونقاء استثنائي.',
      variants: [
        { name: 'Deep Crimson Agate & Silver', nameAr: 'عقيق كبدي داكن وفضة مصمتة', colorHex: '#5C1D24', colorFamily: 'bold', image: '/images/tasbih-agate-ring.jpg', inStock: true },
      ],
    },
    {
      handle: '24k-gold-plated-islamic-cufflinks',
      categorySlug: 'accessories',
      title: '24K Gold Plated Islamic Geometric Cufflinks',
      titleAr: 'أزرار كبك مذهبة عيار ٢٤ — زخارف هندسية إسلامية',
      price: 1850,
      compareAtPrice: 2200,
      fabric: 'Solid Brass Plated with 24K Pure Gold',
      fabricAr: 'نحاس مصمت مطلي بذهب خالص عيار ٢٤ مقاوم للخدش',
      sizes: ['Standard Cufflink Size'],
      rating: 4.8,
      reviewsCount: 65,
      featured: false,
      description: 'Exquisite cufflinks inspired by Andalusian octagonal tile geometry, plated in 24k yellow gold with matte textured inlays.',
      descriptionAr: 'كبك ملوكي فاخر مستوحى من الهندسة الأندلسية، مطلي بطبقة سميكة من الذهب عيار 24 ليضفي لمسة رفيعة على أساور الثياب في المناسبات.',
      variants: [
        { name: 'Polished 24K Gold & Onyx', nameAr: 'ذهب أصفر 24 وعقيق أسود', colorHex: '#E5C158', colorFamily: 'warm', image: '/images/tasbih-agate-ring.jpg', inStock: true },
      ],
    },
    {
      handle: 'damascene-hand-carved-silver-cufflinks',
      categorySlug: 'accessories',
      title: 'Damascene Silver Cufflinks — Natural Lapis Lazuli',
      titleAr: 'أزرار كبك فضة دمشقية عيار ٩٢٥ — حجر لازورد أزرق طبيعي',
      price: 2100,
      compareAtPrice: 2500,
      fabric: '925 Sterling Silver & Natural Lapis Lazuli',
      fabricAr: 'فضة إسترليني دمشقية منقوشة يدوياً مع حجر لازورد ملكي',
      sizes: ['Standard Cufflink Size'],
      rating: 4.9,
      reviewsCount: 52,
      featured: false,
      description: 'Handcrafted silver cufflinks inlaid with vibrant royal blue lapis lazuli, displaying gold pyrite flecks that sparkle under event chandeliers.',
      descriptionAr: 'كبك فاخر مشغول يدوياً من الفضة الدمشقية المعتقة، يتوسطه حجر اللازورد الأزرق الطبيعي بنقاط الذهب البيريتي المتلألئة.',
      variants: [
        { name: 'Royal Blue Lapis & Silver', nameAr: 'لازورد أزرق ملكي وفضة', colorHex: '#1B3F8B', colorFamily: 'bold', image: '/images/tasbih-agate-ring.jpg', inStock: true },
      ],
    },
  ];

  for (let i = 0; i < productsData.length; i++) {
    const p = productsData[i];
    const categoryId = categoryMap[p.categorySlug];

    if (!categoryId) {
      console.warn(`Category ${p.categorySlug} not found. Skipping product ${p.handle}`);
      continue;
    }

    const createdProduct = await prisma.product.upsert({
      where: { handle: p.handle },
      update: {
        categoryId,
        title: p.title,
        titleAr: p.titleAr,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        fabric: p.fabric,
        fabricAr: p.fabricAr,
        sizes: p.sizes,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        featured: p.featured,
        description: p.description,
        descriptionAr: p.descriptionAr,
        displayOrder: i + 1,
      },
      create: {
        handle: p.handle,
        categoryId,
        title: p.title,
        titleAr: p.titleAr,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        fabric: p.fabric,
        fabricAr: p.fabricAr,
        sizes: p.sizes,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        featured: p.featured,
        description: p.description,
        descriptionAr: p.descriptionAr,
        displayOrder: i + 1,
      },
    });

    await prisma.productVariant.deleteMany({ where: { productId: createdProduct.id } });

    for (let j = 0; j < p.variants.length; j++) {
      const v = p.variants[j];
      await prisma.productVariant.create({
        data: {
          productId: createdProduct.id,
          name: v.name,
          nameAr: v.nameAr,
          colorHex: v.colorHex,
          colorFamily: v.colorFamily,
          image: v.image,
          inStock: v.inStock,
          displayOrder: j + 1,
        },
      });
    }
  }

  console.log('Expanded Products & Variants seeded successfully.');

  // 3. Site Settings
  await prisma.siteSettings.upsert({
    where: { id: 'current' },
    update: {},
    create: {
      id: 'current',
      heroTitle: 'The Prestige of\nArabian Dignity',
      heroTitleAr: 'هيبة الأصالة\nوالوقار والتميز',
      heroTagline: 'Maison Menih — Luxury Arabian Menswear',
      heroTaglineAr: 'دار المنيع — أزياء رجالية عربية فاخرة',
      heroSubtitle: 'Bespoke thobes, royal ceremonial bishts, premium woven shemaghs & aged Dehn El Oud — crafted with precision for the modern gentleman.',
      heroSubtitleAr: 'ثياب مخيطة خصيصاً، بشت ملكي للمناسبات، أشمغة فاخرة ودهن العود الكمبودي المعتق — صُممت بدقة متناهية للرجل الأصيل.',
      heroImage: '/images/hero-arabian-man.jpg',
      heroCtaText: 'Explore Collection',
      heroCtaTextAr: 'استكشف المجموعات',
      marqueeText: 'MENIH LUXURY • BESPOKE ARABIAN TAILORING • 100% GIZA COTTON • AGED CAMBODIAN OUD',
      marqueeTextAr: 'دار المنيع • تفصيل ملكي فاخر • قطن مصري جيزة ٩٤ • دهن عود كمبودي معتق • شحن لكافة المحافظات',
      editorialQuote: 'Prestige and dignity are not merely about appearance — they are reflections of values and heritage. Every piece at Maison Menih is crafted to command presence worthy of your status and legacy.',
      editorialQuoteAr: 'الهيبة والوقار ليسا مجرد مظهر — بل هما تعبير عن المبادئ والأصالة. كل قطعة في دار المنيع صُممت لتمنح حضوراً مهيباً يليق بمكانتك وتراثك العريق.',
      quoteAuthor: 'Founder, Maison Menih',
      quoteAuthorAr: 'المؤسس، دار المنيع',
      promoCode: 'MENIH10',
      promoDiscountPercent: 10,
      bundleDiscountPercent: 15,
      freeShippingThreshold: 1500,
      flatShippingRate: 50,
      contactPhone: '+20 100 000 0000',
      contactWhatsapp: '+20 100 000 0000',
      instagramUrl: 'https://instagram.com/menih_luxury',
    },
  });

  // 4. Expanded Testimonials
  const testimonials = [
    {
      name: 'Abu Fahad Al-Otaibi',
      nameAr: 'أبو فهد العتيبي',
      city: 'Riyadh',
      cityAr: 'الرياض',
      review: 'The Royal Najdi Bisht is beyond description! The German zaree embroidery is amazing and the details are highly refined. Excellent client services and packaging.',
      reviewAr: 'البشت النجدي الملكي يفوق الوصف! خياطة الزري الألماني مذهلة والتفاصيل دقيقة للغاية. خدمة عملاء راقية وتوصيل سريع وتغليف فاخر.',
      rating: 5,
      image: '/images/bisht-royal.jpg',
      displayOrder: 1,
    },
    {
      name: 'Khalid Bin Abdulaziz',
      nameAr: 'خالد بن عبد العزيز',
      city: 'Jeddah',
      cityAr: 'جدة',
      review: 'The Moroccan Gandoura and Giza 94 thobe are exceptionally regal and comfortable. The Cambodian Oud is long-lasting.',
      reviewAr: 'الجلابية المغربية وثوب جيزة 94 في غاية الفخامة والراحة. دهن العود الكمبودي ممتاز وثابت لأيام.',
      rating: 5,
      image: '/images/thobe-gandoura.jpg',
      displayOrder: 2,
    },
    {
      name: 'Abdulrahman Al-Dawsari',
      nameAr: 'عبد الرحمن الدوسري',
      city: 'Dammam',
      cityAr: 'الدمام',
      review: 'The Mix & Match studio made selecting my outfit incredibly easy. I coordinated the Thobe with a Kashmiri Shawl and Amber Tasbih and saved 15%. A premium shopping experience.',
      reviewAr: 'منسق الأطقم سهل علي الاختيار بشكل كبير، نسقت الثوب مع الشال الكشميري والسبحة الكهرمان وحصلت على خصم ١٥٪. تجربة تسوق فخمة واستثنائية.',
      rating: 5,
      image: '/images/shemagh-kashmiri.jpg',
      displayOrder: 3,
    },
    {
      name: 'Eng. Tareq Mansour',
      nameAr: 'م. طارق منصور',
      city: 'Cairo',
      cityAr: 'القاهرة',
      review: 'Bespoke tailoring of Giza 94 cotton is unrivaled. Perfect fit, crisp drape, and regal packaging. Proud of this Egyptian luxury brand.',
      reviewAr: 'تفصيل قطن جيزة 94 لا يُعلى عليه. قصة مظبوطة بالمللي، قماش بارد وناعم، وتغليف هدايا يليق بكبار الشخصيات. فخور بوجود دار أزياء بهذا المستوى في مصر.',
      rating: 5,
      image: '/images/hero-arabian-man.jpg',
      displayOrder: 4,
    },
  ];

  await prisma.testimonial.deleteMany();
  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }

  console.log('✨ All expanded MENIH data successfully seeded into live PostgreSQL database!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
