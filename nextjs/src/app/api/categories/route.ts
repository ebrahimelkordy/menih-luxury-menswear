import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({ orderBy: { displayOrder: 'asc' } });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, ...data } = await req.json();
    const updated = await prisma.category.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
