-- Migration: Create site_settings and testimonials tables for MENIH Admin Dashboard

-- 1. Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id text PRIMARY KEY DEFAULT 'current',
  hero_title text DEFAULT 'The Prestige of\nArabian Dignity',
  hero_title_ar text DEFAULT 'هيبة الأصالة\nوالوقار والتميز',
  hero_tagline text DEFAULT 'Maison Menih — Luxury Arabian Menswear',
  hero_tagline_ar text DEFAULT 'دار المنيع — أزياء رجالية عربية فاخرة',
  hero_subtitle text DEFAULT 'Bespoke thobes, royal ceremonial bishts, premium woven shemaghs & aged Dehn El Oud — crafted with precision for the modern gentleman.',
  hero_subtitle_ar text DEFAULT 'ثياب مخيطة خصيصاً، بشت ملكي للمناسبات، أشمغة فاخرة ودهن العود الكمبودي المعتق — صُممت بدقة متناهية للرجل الأصيل.',
  hero_image text DEFAULT '/images/hero-arabian-man.jpg',
  hero_cta_text text DEFAULT 'Explore Collection',
  hero_cta_text_ar text DEFAULT 'استكشف المجموعات',
  marquee_text text DEFAULT 'MENIH LUXURY • BESPOKE ARABIAN TAILORING • 100% GIZA COTTON • AGED CAMBODIAN OUD',
  marquee_text_ar text DEFAULT 'دار المنيع • تفصيل ملكي فاخر • قطن مصري جيزة ٩٤ • دهن عود كمبودي معتق • شحن لكافة المحافظات',
  editorial_quote text DEFAULT 'Prestige and dignity are not merely about appearance — they are reflections of values and heritage. Every piece at Maison Menih is crafted to command presence worthy of your status and legacy.',
  editorial_quote_ar text DEFAULT 'الهيبة والوقار ليسا مجرد مظهر — بل هما تعبير عن المبادئ والأصالة. كل قطعة في دار المنيع صُممت لتمنح حضوراً مهيباً يليق بمكانتك وتراثك العريق.',
  quote_author text DEFAULT 'Founder, Maison Menih',
  quote_author_ar text DEFAULT 'المؤسس، دار المنيع',
  promo_code text DEFAULT 'MENIH10',
  promo_discount_percent int DEFAULT 10,
  bundle_discount_percent int DEFAULT 15,
  free_shipping_threshold int DEFAULT 1500,
  flat_shipping_rate int DEFAULT 50,
  contact_phone text DEFAULT '+20 100 000 0000',
  contact_whatsapp text DEFAULT '+20 100 000 0000',
  instagram_url text DEFAULT 'https://instagram.com',
  updated_at timestamptz DEFAULT now()
);

-- Insert default row if not exists
INSERT INTO site_settings (id) VALUES ('current') ON CONFLICT (id) DO NOTHING;

-- 2. Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_ar text NOT NULL,
  city text NOT NULL,
  city_ar text NOT NULL,
  review text NOT NULL,
  review_ar text NOT NULL,
  rating int DEFAULT 5,
  image text DEFAULT '/images/bisht-royal.jpg',
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Allow public read & write for site_settings and testimonials in this setup
CREATE POLICY "Allow public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public update site_settings" ON site_settings FOR UPDATE USING (true);
CREATE POLICY "Allow public insert site_settings" ON site_settings FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public all testimonials" ON testimonials FOR ALL USING (true);

-- Also ensure products, categories, orders allow full updates from admin dashboard
DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow public all products" ON products;
  CREATE POLICY "Allow public all products" ON products FOR ALL USING (true);

  DROP POLICY IF EXISTS "Allow public all variants" ON product_variants;
  CREATE POLICY "Allow public all variants" ON product_variants FOR ALL USING (true);

  DROP POLICY IF EXISTS "Allow public all categories" ON categories;
  CREATE POLICY "Allow public all categories" ON categories FOR ALL USING (true);

  DROP POLICY IF EXISTS "Allow public all orders" ON orders;
  CREATE POLICY "Allow public all orders" ON orders FOR ALL USING (true);
EXCEPTION
  WHEN undefined_table THEN NULL;
END $$;
