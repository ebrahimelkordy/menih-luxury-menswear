import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOrderNumber } from '@/lib/utils';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const count = await prisma.order.count();
    const orderNumber = generateOrderNumber(count);
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        customerWhatsapp: body.customerWhatsapp || body.customerPhone,
        customerEmail: body.customerEmail,
        customerCity: body.customerCity,
        customerAddress: body.customerAddress,
        items: body.items,
        subtotal: Number(body.subtotal),
        bundleDiscount: Number(body.bundleDiscount || 0),
        total: Number(body.total),
        paymentMethod: body.paymentMethod || 'cod',
        notes: body.notes,
      },
    });
    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
