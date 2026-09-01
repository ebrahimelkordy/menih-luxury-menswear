/**
 * API Route: /api/secrets/resend-key
 * GET  — returns whether a key is configured (never returns the actual key)
 * POST — encrypts and saves (or updates) the Resend API key
 * DELETE — removes the Resend API key
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { encrypt } from '@/lib/encryption';

const SECRET_KEY = 'resend_api_key';

export async function GET() {
  try {
    const secret = await prisma.appSecrets.findUnique({ where: { key: SECRET_KEY } });
    return NextResponse.json({
      configured: !!secret,
      updatedAt: secret?.updatedAt ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { apiKey } = await req.json();
    if (!apiKey || typeof apiKey !== 'string' || !apiKey.startsWith('re_')) {
      return NextResponse.json({ error: 'Invalid Resend API key format' }, { status: 400 });
    }

    const encrypted = encrypt(apiKey);

    await prisma.appSecrets.upsert({
      where: { key: SECRET_KEY },
      update: {
        value: encrypted.value,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
      },
      create: {
        key: SECRET_KEY,
        value: encrypted.value,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
      },
    });

    return NextResponse.json({ success: true, message: 'Resend API key saved securely' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await prisma.appSecrets.deleteMany({ where: { key: SECRET_KEY } });
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
