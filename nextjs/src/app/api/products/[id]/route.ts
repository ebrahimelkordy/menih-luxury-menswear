import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // Try handle first, then id
    const product = await prisma.product.findFirst({
      where: { OR: [{ handle: id }, { id }] },
      include: { variants: { orderBy: { displayOrder: 'asc' } }, category: true },
    });
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({
      ...product,
      category: product.category.slug,
      categoryAr: product.category.nameAr,
    });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { categorySlug, variants, ...data } = body;
    let categoryId: string | undefined;
    if (categorySlug) {
      const cat = await prisma.category.findUnique({ where: { slug: categorySlug } });
      if (cat) categoryId = cat.id;
    }
    const updated = await prisma.product.update({
      where: { id },
      data: { ...data, categoryId, price: data.price ? Number(data.price) : undefined },
    });
    if (Array.isArray(variants)) {
      await prisma.productVariant.deleteMany({ where: { productId: id } });
      for (let i = 0; i < variants.length; i++) {
        await prisma.productVariant.create({ data: { ...variants[i], productId: id, displayOrder: i + 1 } });
      }
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
