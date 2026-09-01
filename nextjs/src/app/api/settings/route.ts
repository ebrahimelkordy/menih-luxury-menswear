import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({ where: { id: 'current' } });
    if (!settings) {
      settings = await prisma.siteSettings.create({ data: { id: 'current' } });
    }
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    delete body.id;
    delete body.updatedAt;
    const settings = await prisma.siteSettings.upsert({
      where: { id: 'current' },
      update: body,
      create: { id: 'current', ...body },
    });
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
