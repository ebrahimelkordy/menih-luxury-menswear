import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { sendOrderNotificationEmail, sendTestEmail, getEmailServiceStatus } from './emailService.js';

dotenv.config();

// Sanitize DATABASE_URL and environment variables
if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_URL
    .replace(/^\uFEFF/, '')
    .trim()
    .replace(/^["']|["']$/g, '');
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ----------------- Categories API -----------------
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const { name, nameAr, slug, description, descriptionAr, image, displayOrder } = req.body;
    const cleanSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const category = await prisma.category.create({
      data: {
        name,
        nameAr,
        slug: cleanSlug,
        description: description || '',
        descriptionAr: descriptionAr || '',
        image: image || '',
        displayOrder: Number(displayOrder || 0),
      },
    });
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, nameAr, description, descriptionAr, image, displayOrder } = req.body;
    const category = await prisma.category.update({
      where: { id },
      data: { name, nameAr, description, descriptionAr, image, displayOrder },
    });
    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// ----------------- Products API -----------------
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        variants: {
          orderBy: { displayOrder: 'asc' },
        },
        category: true,
      },
      orderBy: { displayOrder: 'asc' },
    });

    // Format to match frontend structure
    const formatted = products.map((p) => ({
      id: p.id,
      handle: p.handle,
      title: p.title,
      titleAr: p.titleAr,
      price: p.price,
      compareAtPrice: p.compareAtPrice || undefined,
      category: p.category.slug,
      categoryAr: p.category.nameAr,
      fabric: p.fabric,
      fabricAr: p.fabricAr,
      sizes: p.sizes,
      rating: p.rating,
      reviewsCount: p.reviewsCount,
      featured: p.featured,
      description: p.description,
      descriptionAr: p.descriptionAr,
      opacity: p.opacity,
      opacityAr: p.opacityAr,
      weight: p.weight,
      dimensions: p.dimensions,
      variants: p.variants.map((v) => ({
        id: v.id,
        name: v.name,
        nameAr: v.nameAr,
        colorHex: v.colorHex,
        colorFamily: v.colorFamily,
        image: v.image,
        inStock: v.inStock,
      })),
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:handle', async (req, res) => {
  try {
    const { handle } = req.params;
    const p = await prisma.product.findUnique({
      where: { handle },
      include: {
        variants: {
          orderBy: { displayOrder: 'asc' },
        },
        category: true,
      },
    });

    if (!p) return res.status(404).json({ error: 'Product not found' });

    res.json({
      id: p.id,
      handle: p.handle,
      title: p.title,
      titleAr: p.titleAr,
      price: p.price,
      compareAtPrice: p.compareAtPrice || undefined,
      category: p.category.slug,
      categoryAr: p.category.nameAr,
      fabric: p.fabric,
      fabricAr: p.fabricAr,
      sizes: p.sizes,
      rating: p.rating,
      reviewsCount: p.reviewsCount,
      featured: p.featured,
      description: p.description,
      descriptionAr: p.descriptionAr,
      opacity: p.opacity,
      opacityAr: p.opacityAr,
      weight: p.weight,
      dimensions: p.dimensions,
      variants: p.variants.map((v) => ({
        id: v.id,
        name: v.name,
        nameAr: v.nameAr,
        colorHex: v.colorHex,
        colorFamily: v.colorFamily,
        image: v.image,
        inStock: v.inStock,
      })),
    });
  } catch (error) {
    console.error('Error fetching product by handle:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const {
      title, titleAr, handle, categorySlug, price, compareAtPrice,
      fabric, fabricAr, sizes, description, descriptionAr, featured,
      opacityAr, variants
    } = req.body;

    const category = await prisma.category.findUnique({
      where: { slug: categorySlug || 'thobe' },
    });

    if (!category) {
      return res.status(400).json({ error: 'Category not found' });
    }

    const cleanHandle = handle || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const createdProduct = await prisma.product.create({
      data: {
        title,
        titleAr,
        handle: cleanHandle,
        categoryId: category.id,
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        fabric: fabric || '',
        fabricAr: fabricAr || '',
        sizes: Array.isArray(sizes) ? sizes : ['Standard'],
        description: description || '',
        descriptionAr: descriptionAr || '',
        featured: Boolean(featured),
        opacityAr: opacityAr || '',
      },
    });

    if (Array.isArray(variants) && variants.length > 0) {
      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
        await prisma.productVariant.create({
          data: {
            productId: createdProduct.id,
            name: v.name,
            nameAr: v.nameAr,
            colorHex: v.colorHex,
            colorFamily: v.colorFamily || 'neutral',
            image: v.image || '',
            inStock: v.inStock ?? true,
            displayOrder: i + 1,
          },
        });
      }
    }

    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, titleAr, handle, categorySlug, price, compareAtPrice,
      fabric, fabricAr, sizes, description, descriptionAr, featured,
      opacityAr, variants
    } = req.body;

    let categoryId: string | undefined;
    if (categorySlug) {
      const cat = await prisma.category.findUnique({ where: { slug: categorySlug } });
      if (cat) categoryId = cat.id;
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        title,
        titleAr,
        handle,
        categoryId,
        price: price !== undefined ? Number(price) : undefined,
        compareAtPrice: compareAtPrice !== undefined ? (compareAtPrice ? Number(compareAtPrice) : null) : undefined,
        fabric,
        fabricAr,
        sizes: Array.isArray(sizes) ? sizes : undefined,
        description,
        descriptionAr,
        featured: featured !== undefined ? Boolean(featured) : undefined,
        opacityAr,
      },
    });

    if (Array.isArray(variants)) {
      await prisma.productVariant.deleteMany({ where: { productId: id } });
      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
        await prisma.productVariant.create({
          data: {
            productId: id,
            name: v.name,
            nameAr: v.nameAr,
            colorHex: v.colorHex,
            colorFamily: v.colorFamily || 'neutral',
            image: v.image || '',
            inStock: v.inStock ?? true,
            displayOrder: i + 1,
          },
        });
      }
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ----------------- Orders API -----------------
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const {
      customerName, customerPhone, customerEmail, customerCity, customerAddress,
      items, subtotal, bundleDiscount, total, paymentMethod, notes
    } = req.body;

    const count = await prisma.order.count();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const orderNumber = `MENIH-${dateStr}-${String(count + 1).padStart(4, '0')}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerPhone,
        customerEmail,
        customerCity,
        customerAddress,
        items,
        subtotal: Number(subtotal),
        bundleDiscount: Number(bundleDiscount || 0),
        total: Number(total),
        paymentMethod: paymentMethod || 'cod',
        notes,
      },
    });

    // Send email notification to Admin (Resend / Mock fallback)
    sendOrderNotificationEmail(order).catch((mailErr) => {
      console.error('[ORDER EMAIL NOTIFICATION ERROR]:', mailErr);
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// ----------------- Email System API -----------------
app.get('/api/email-status', (req, res) => {
  try {
    const status = getEmailServiceStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get email status' });
  }
});

app.post('/api/test-email', async (req, res) => {
  try {
    const { targetEmail, apiKey } = req.body;
    const result = await sendTestEmail(targetEmail, apiKey);
    res.json(result);
  } catch (error: any) {
    console.error('Error sending test email:', error);
    res.status(500).json({ error: error?.message || 'Failed to send test email' });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.order.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// ----------------- Site Settings API -----------------
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: 'current' },
    });

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: { id: 'current' },
      });
    }

    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const data = req.body;
    delete data.id;
    delete data.updatedAt;

    const settings = await prisma.siteSettings.upsert({
      where: { id: 'current' },
      update: data,
      create: { id: 'current', ...data },
    });

    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// ----------------- Testimonials API -----------------
app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

app.post('/api/testimonials', async (req, res) => {
  try {
    const { name, nameAr, city, cityAr, review, reviewAr, rating, image, displayOrder } = req.body;
    const created = await prisma.testimonial.create({
      data: { name, nameAr, city, cityAr, review, reviewAr, rating: Number(rating || 5), image, displayOrder },
    });
    res.status(201).json(created);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

app.put('/api/testimonials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, nameAr, city, cityAr, review, reviewAr, rating, image, displayOrder } = req.body;
    const updated = await prisma.testimonial.update({
      where: { id },
      data: { name, nameAr, city, cityAr, review, reviewAr, rating: Number(rating || 5), image, displayOrder },
    });
    res.json(updated);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

app.delete('/api/testimonials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.testimonial.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

// ----------------- Admin Auth Verification -----------------
app.post('/api/admin/verify', (req, res) => {
  const { passcode } = req.body;
  const adminPassword = (process.env.ADMIN_PASSWORD || 'menih2026')
    .replace(/^\uFEFF/, '')
    .trim()
    .replace(/^["']|["']$/g, '');
  
  if (passcode === adminPassword) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: 'Invalid passcode' });
  }
});

app.listen(PORT, () => {
  console.log(`⚡ MENIH API Server running with Prisma on http://localhost:${PORT}`);
});
