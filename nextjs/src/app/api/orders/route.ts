import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOrderNumber } from '@/lib/utils';
import { sendOrderConfirmationEmail, sendAdminNewOrderNotification } from '@/lib/emailService';
import type { CartItem } from '@/lib/types';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(orders);
  } catch (err) {
    console.error('[Orders GET Error]:', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const count = await prisma.order.count();
    const orderNumber = generateOrderNumber(count);

    const subtotal = Math.round(Number(body.subtotal) || 0);
    const bundleDiscount = Math.round(Number(body.bundleDiscount) || 0);
    const total = Math.round(Number(body.total) || (subtotal - bundleDiscount));

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: body.customerName || 'عميل إزار',
        customerPhone: body.customerPhone || '',
        customerWhatsapp: body.customerWhatsapp || body.customerPhone || '',
        customerEmail: body.customerEmail || null,
        customerCity: body.customerCity || '',
        customerAddress: body.customerAddress || '',
        items: body.items || [],
        subtotal,
        bundleDiscount,
        total,
        paymentMethod: body.paymentMethod || 'cod',
        notes: body.notes || null,
      },
    });

    console.log(`[Orders API] Created order #${orderNumber} successfully in DB!`);

    const emailPayload = {
      orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerWhatsapp: order.customerWhatsapp,
      customerEmail: order.customerEmail,
      customerCity: order.customerCity,
      customerAddress: order.customerAddress,
      items: (order.items as unknown as CartItem[]) || [],
      subtotal,
      bundleDiscount,
      total,
      paymentMethod: order.paymentMethod,
      notes: order.notes,
    };

    // 1. 🚨 Send Instant Admin Notification Email
    sendAdminNewOrderNotification(emailPayload).catch((err) => {
      console.error('[Orders API] Admin alert email failed:', err);
    });

    // 2. 📨 Send Customer Confirmation Email (if provided)
    if (order.customerEmail) {
      sendOrderConfirmationEmail(emailPayload).catch((err) => {
        console.error('[Orders API] Customer email failed:', err);
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Orders POST Exception]:', message, err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
