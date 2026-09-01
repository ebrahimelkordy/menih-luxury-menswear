/**
 * API Route: /api/email/test
 * POST — sends a test email to verify the Resend configuration
 */
import { NextResponse } from 'next/server';
import { sendTestEmail } from '@/lib/emailService';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    }

    const result = await sendTestEmail(email);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Test email sent to ${email}` });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
