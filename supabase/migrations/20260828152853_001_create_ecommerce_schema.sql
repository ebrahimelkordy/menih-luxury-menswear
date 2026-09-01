/*
# Create MENIH Luxury Islamic Menswear E-Commerce Schema

## Overview
Complete e-commerce backend for a men's Islamic luxury fashion store.
Single-tenant (no auth) — anyone can browse the catalog and place orders.

## New Tables

1. **categories** — Product categories (Thobes, Shemagh, Bisht, Accessories, Fragrances)
   - `id` (uuid PK)
   - `slug` (text, unique) — URL-safe identifier
   - `name` (text) — English name
   - `name_ar` (text) — Arabic name
   - `description` (text) — English description
   - `description_ar` (text) — Arabic description
   - `image` (text) — Hero image URL
   - `display_order` (int) — Sort order
   - `created_at` (timestamptz)

2. **products** — Catalog products
   - `id` (uuid PK)
   - `handle` (text, unique) — URL-safe slug
   - `category_id` (uuid FK → categories)
   - `title` (text) — English title
   - `title_ar` (text) — Arabic title
   - `price` (int) — Price in EGP
   - `compare_at_price` (int, nullable) — Original price for discount display
   - `fabric` (text) — Fabric/material name
   - `fabric_ar` (text) — Arabic fabric name
   - `sizes` (text[]) — Available sizes
   - `rating` (numeric) — Average rating
   - `reviews_count` (int) — Number of reviews
   - `description` (text) — English description
   - `description_ar` (text) — Arabic description
   - `featured` (bool) — Show on homepage
   - `opacity` (text) — Opacity/transparency info
   - `opacity_ar` (text) — Arabic opacity info
   - `weight` (text) — Weight description
   - `dimensions` (text) — Dimensions description
   - `display_order` (int) — Sort order
   - `created_at` (timestamptz)

3. **product_variants** — Color/style variants per product
   - `id` (uuid PK)
   - `product_id` (uuid FK → products ON DELETE CASCADE)
   - `name` (text) — Variant name (e.g., "Cloud White")
   - `name_ar` (text) — Arabic variant name
   - `color_hex` (text) — Hex color code
   - `color_family` (text) — neutral/warm/cool/earth/bold
   - `image` (text) — Image URL for this variant
   - `in_stock` (bool) — Whether this variant is in stock
   - `display_order` (int) — Sort order
   - `created_at` (timestamptz)

4. **orders** — Customer orders
   - `id` (uuid PK)
   - `order_number` (text, unique) — Human-readable order number
   - `customer_name` (text)
   - `customer_phone` (text)
   - `customer_email` (text, nullable)
   - `customer_city` (text)
   - `customer_address` (text)
   - `items` (jsonb) — Array of {productId, variantId, size, quantity, price}
   - `subtotal` (int) — Pre-discount total
   - `bundle_discount` (int) — Discount amount
   - `total` (int) — Final total
   - `status` (text) — pending/confirmed/shipped/delivered/cancelled
   - `notes` (text, nullable)
   - `created_at` (timestamptz)

5. **order_items** — Normalized line items (also stored as JSONB in orders for convenience)
   - `id` (uuid PK)
   - `order_id` (uuid FK → orders ON DELETE CASCADE)
   - `product_id` (uuid FK → products)
   - `variant_id` (uuid FK → product_variants)
   - `product_title` (text) — Snapshot at order time
   - `variant_name` (text) — Snapshot at order time
   - `size` (text)
   - `quantity` (int)
   - `unit_price` (int)
   - `created_at` (timestamptz)

## Security

- **categories**: RLS enabled, public read (anon + authenticated), no writes from frontend
- **products**: RLS enabled, public read (anon + authenticated), no writes from frontend
- **product_variants**: RLS enabled, public read (anon + authenticated), no writes from frontend
- **orders**: RLS enabled, public INSERT (anyone can place an order), public SELECT (order lookup by order_number), no UPDATE/DELETE from frontend
- **order_items**: RLS enabled, public INSERT (created with order), public SELECT, no UPDATE/DELETE from frontend

## Important Notes

1. This is a single-tenant catalog — no user accounts or auth required
2. Orders are placed by guest customers (name, phone, address only)
3. Product/variant data is managed via the database, not the frontend
4. Order numbers are auto-generated as MENIH-YYYYMMDD-XXXX
5. All prices are stored as integers (EGP)
6. The `items` JSONB on orders is a denormalized snapshot for quick display; `order_items` is the normalized version
*/

-- ===== CATEGORIES =====
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  name_ar text NOT NULL,
  description text,
  description_ar text,
  image text,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

-- ===== PRODUCTS =====
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  handle text UNIQUE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  title_ar text NOT NULL,
  price int NOT NULL DEFAULT 0,
  compare_at_price int,
  fabric text,
  fabric_ar text,
  sizes text[] DEFAULT '{}',
  rating numeric DEFAULT 5.0,
  reviews_count int DEFAULT 0,
  description text,
  description_ar text,
  featured boolean DEFAULT false,
  opacity text,
  opacity_ar text,
  weight text,
  dimensions text,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

-- ===== PRODUCT VARIANTS =====
CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name text NOT NULL,
  name_ar text NOT NULL,
  color_hex text NOT NULL DEFAULT '#1A1615',
  color_family text NOT NULL DEFAULT 'neutral',
  image text,
  in_stock boolean DEFAULT true,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_variants" ON product_variants;
CREATE POLICY "public_read_variants" ON product_variants FOR SELECT
  TO anon, authenticated USING (true);

-- ===== ORDERS =====
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  customer_city text NOT NULL,
  customer_address text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]',
  subtotal int NOT NULL DEFAULT 0,
  bundle_discount int NOT NULL DEFAULT 0,
  total int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_orders" ON orders;
CREATE POLICY "public_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_read_orders" ON orders;
CREATE POLICY "public_read_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

-- ===== ORDER ITEMS =====
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  variant_id uuid REFERENCES product_variants(id),
  product_title text NOT NULL,
  variant_name text NOT NULL,
  size text NOT NULL,
  quantity int NOT NULL DEFAULT 1,
  unit_price int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_order_items" ON order_items;
CREATE POLICY "public_insert_order_items" ON order_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_read_order_items" ON order_items;
CREATE POLICY "public_read_order_items" ON order_items FOR SELECT
  TO anon, authenticated USING (true);

-- ===== INDEXES =====
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- ===== AUTO-GENERATE ORDER NUMBER =====
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  date_part text;
  seq_part text;
  next_seq int;
BEGIN
  date_part := to_char(now(), 'YYYYMMDD');
  
  SELECT COALESCE(MAX(seq_num), 0) + 1 INTO next_seq
  FROM (
    SELECT CAST(SUBSTRING(order_number FROM 14) AS int) AS seq_num
    FROM orders
    WHERE order_number LIKE 'MENIH-' || date_part || '-%'
  ) sub;
  
  seq_part := lpad(next_seq::text, 4, '0');
  RETURN 'MENIH-' || date_part || '-' || seq_part;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
