import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({ where: { id: 'current' } });
    if (!settings) {
      settings = await prisma.siteSettings.create({ data: { id: 'current' } });
    }
    return NextResponse.json(settings);
  } catch (err) {
    console.error('Error fetching settings:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    // Explicitly sanitize and convert types to match Prisma schema
    const sanitizedData: Record<string, any> = {};

    // String fields
    const stringFields = [
      'heroTitle', 'heroTitleAr', 'heroTagline', 'heroTaglineAr',
      'heroSubtitle', 'heroSubtitleAr', 'heroImage', 'heroCtaText', 'heroCtaTextAr',
      'marqueeText', 'marqueeTextAr', 'goldBannerText', 'goldBannerTextAr',
      'editorialQuote', 'editorialQuoteAr', 'quoteAuthor', 'quoteAuthorAr',
      'promoCode', 'contactPhone', 'contactWhatsapp', 'contactEmail',
      'instagramUrl', 'facebookUrl', 'tiktokUrl', 'address', 'addressAr',
      'logoUrl', 'brandName', 'brandNameAr'
    ];
    for (const field of stringFields) {
      if (body[field] !== undefined) {
        sanitizedData[field] = String(body[field] ?? '');
      }
    }

    // Integer fields
    const intFields = [
      'promoDiscountPercent', 'bundleDiscountPercent',
      'freeShippingThreshold', 'flatShippingRate'
    ];
    for (const field of intFields) {
      if (body[field] !== undefined) {
        sanitizedData[field] = parseInt(String(body[field]), 10) || 0;
      }
    }

    // Array fields
    if (Array.isArray(body.mixMatchCategories)) {
      sanitizedData.mixMatchCategories = body.mixMatchCategories.filter(Boolean);
    }

    const settings = await prisma.siteSettings.upsert({
      where: { id: 'current' },
      update: sanitizedData,
      create: { id: 'current', ...sanitizedData },
    });
    return NextResponse.json(settings);
  } catch (err) {
    console.error('Error updating settings:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
  }
}
