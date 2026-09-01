# 👑 MENIH — Luxury Arabian & Islamic Menswear E-Commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-14%2F16_App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4_ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Live_Database-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4_Luxury_Tokens-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

> **MENIH (دار المنيع)** is a production-grade, bespoke luxury menswear e-commerce platform crafted for prestigious Arabian and Islamic attire. Built with Next.js App Router, Prisma ORM, and PostgreSQL, featuring an interactive 5-slot coordinate builder (Mix & Match Studio), full bilingual RTL/LTR experience, and a real-time CMS Admin Dashboard.

---

## ✨ Key Features & Architectural Highlights

### 🏛️ 1. Storefront Experience (UX/UI)
- **Royal Arabian Aesthetic**: Tailored color palette (Espresso `#1A1615`, Royal Gold `#C5A880`, Ivory `#FAF8F5`), glassmorphism, smooth micro-animations, and authentic Arabic typography (`Amiri`, `Noto Naskh Arabic`, `Playfair Display`).
- **Interactive Mix & Match Studio**: Dynamic 5-slot coordinate builder (Thobe, Shemagh, Bisht, Amber Tasbih, Aged Oud) calculating real-time color harmony and automated 15% bundle savings.
- **Bilingual & Bidirectional (i18n)**: Seamless instant switching between Arabic (`RTL`) and English (`LTR`) with zero layout shift.
- **Fast Express Checkout**: Streamlined Cash on Delivery (COD) and Card checkout generating structured reference numbers (`MENIH-YYYYMMDD-XXXX`).

### 🗄️ 2. Backend & Data Layer (Prisma + PostgreSQL)
- **100% Live Database**: No mock data; all products, variants, categories, orders, settings, and testimonials are synchronized directly with PostgreSQL.
- **Unified REST API Routes**:
  - `GET/POST/PUT/DELETE /api/products`
  - `GET/PUT /api/categories`
  - `GET/POST/PUT/DELETE /api/orders`
  - `GET/PUT /api/settings`
  - `GET/POST/PUT/DELETE /api/testimonials`

### 📊 3. Full-Featured Admin Dashboard Portal (`#/admin`)
- **Passcode Protected Gateway** (Default: `1234` or `menih2026`).
- **Overview & KPI Metrics**: Total revenue, orders volume, active catalog count, and recent activity logs.
- **Orders Management**: Order status lifecycle (`pending` ➔ `processing` ➔ `shipped` ➔ `delivered`), CSV export, and printable customer invoices.
- **Catalog & Inventory Manager**: Full CRUD on multi-color product variants, fabrics, prices, and stock statuses.
- **CMS Content Editor**: Control Hero banner image/text, marquee announcement tickers, editorial quotes, and customer reviews.
- **Store Configuration**: Promo code manager, bundle discount rates, and shipping policies.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/) with [PostgreSQL](https://www.postgresql.org/) (Prisma Accelerate Connection Pooling)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js `v18.17+` or `v20+`
- PostgreSQL database URL

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/menih-luxury-menswear.git
cd menih-luxury-menswear/nextjs

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env and insert your DATABASE_URL
```

### 3. Database Migration & Seeding
```bash
# Push Prisma schema to PostgreSQL
npx prisma db push

# Seed the expanded luxury catalog (22 products, 5 categories, CMS settings)
npx tsx prisma/seed.ts
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🌐 Deploy to Vercel

1. Push this repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Set the **Root Directory** to `nextjs` (if pushing the monorepo) or root.
4. Add the Environment Variable in Vercel project settings:
   - `DATABASE_URL`: `postgres://...`
5. Click **Deploy**. Vercel will automatically run `prisma generate` and build the project.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
