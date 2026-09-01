import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { variants: { orderBy: { displayOrder: 'asc' } }, category: true },
      orderBy: { displayOrder: 'asc' },
    });
    const formatted = products.map((p) => ({
      id: p.id,
      handle: p.handle,
      title: p.title,
      titleAr: p.titleAr,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
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
    return NextResponse.json(formatted);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { categorySlug, variants, ...data } = body;
    const category = await prisma.category.findUnique({ where: { slug: categorySlug || 'thobe' } });
    if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 400 });
    const product = await prisma.product.create({
      data: { ...data, categoryId: category.id, price: Number(data.price) },
    });
    if (Array.isArray(variants)) {
      for (let i = 0; i < variants.length; i++) {
        await prisma.productVariant.create({ data: { ...variants[i], productId: product.id, displayOrder: i + 1 } });
      }
    }
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
