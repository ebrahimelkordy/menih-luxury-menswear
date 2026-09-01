/**
 * Email Service — powered by Resend
 * Retrieves the API key from the encrypted DB store, then sends transactional emails
 * to both customers (Order Confirmation) and admins (New Order Alerts).
 */
import { Resend } from 'resend';
import { prisma } from './prisma';
import { decrypt } from './encryption';
import type { CartItem } from './types';

// ─── Key Retrieval ────────────────────────────────────────────────────────────

async function getResendClient(): Promise<Resend> {
  const secret = await prisma.appSecrets.findUnique({
    where: { key: 'resend_api_key' },
  });

  if (!secret) {
    throw new Error('Resend API key not configured. Please add it in the Dashboard → Settings.');
  }

  const apiKey = decrypt({
    value: secret.value,
    iv: secret.iv,
    authTag: secret.authTag,
  });

  return new Resend(apiKey);
}

// ─── Helper for Sender Email ──────────────────────────────────────────────────

async function getSenderEmail(): Promise<string> {
  try {
    const customSender = await prisma.appSecrets.findUnique({
      where: { key: 'resend_from_email' },
    });
    if (customSender && customSender.value) {
      return customSender.value;
    }
  } catch {}
  return process.env.RESEND_FROM_EMAIL || 'EZAR Luxury <onboarding@resend.dev>';
}

// ─── Price Formatter ─────────────────────────────────────────────────────────

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
  }).format(amount);
}

// ─── Customer Order Confirmation HTML Template ───────────────────────────────

function buildOrderConfirmationHtml(order: {
  orderNumber: string;
  customerName: string;
  items: CartItem[];
  subtotal: number;
  bundleDiscount: number;
  total: number;
  paymentMethod: string;
  customerAddress: string;
  customerCity: string;
}): string {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:14px 10px; border-bottom:1px solid #f0ebe4; font-family: 'Segoe UI', Arial, sans-serif;">
          <div style="font-weight:700; color:#1a1208; font-size:14px;">${item.productTitleAr || item.productTitle}</div>
          <div style="font-size:12px; color:#8b7355; margin-top:4px;">${item.variantNameAr || item.variantName} • المقاس: ${item.size}</div>
        </td>
        <td style="padding:14px 10px; border-bottom:1px solid #f0ebe4; text-align:center; color:#5c4a32; font-weight:600;">${item.quantity}</td>
        <td style="padding:14px 10px; border-bottom:1px solid #f0ebe4; text-align:left; color:#1a1208; font-weight:700;">${formatPrice(item.price * item.quantity)}</td>
      </tr>
    `,
    )
    .join('');

  const paymentLabel =
    order.paymentMethod === 'cod'
      ? 'الدفع عند الاستلام'
      : order.paymentMethod === 'instapay'
        ? 'إنستاباي'
        : order.paymentMethod;

  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>تأكيد طلبك — إزار</title>
</head>
<body style="margin:0;padding:0;background:#f7f4ef;font-family:'Segoe UI',Arial,sans-serif;direction:rtl;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f4ef;padding:40px 15px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 6px 30px rgba(0,0,0,0.07);border:1px solid #e8e0d5;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0E0C0B 0%,#261D1A 100%);padding:45px 32px;text-align:center;border-bottom:3px solid #c5a880;">
              <div style="font-family:Georgia,serif;font-size:36px;font-weight:700;color:#c5a880;letter-spacing:0.15em;">إزار</div>
              <div style="font-size:11px;color:#d4b78e;letter-spacing:0.35em;margin-top:6px;text-transform:uppercase;">EZAR LUXURY • BESPOKE ARABIAN TAILORING</div>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:36px 32px 20px;text-align:center;">
              <div style="font-size:24px;color:#1a1208;font-weight:700;font-family:Georgia,serif;">أهلاً بك، ${order.customerName} 👑</div>
              <div style="font-size:14px;color:#8b7355;margin-top:10px;line-height:1.8;">
                نسعد باختيارك لدار <strong>إزار</strong>. تم استلام وتأكيد طلبك بنجاح وجارٍ تجهيزه بعناية فائقة وتغليفه الملكي.
              </div>
              <div style="display:inline-block;margin-top:18px;padding:9px 24px;background:#f7f4ef;border-radius:100px;font-size:13px;color:#1a1208;font-weight:700;border:1px solid #e2d7c7;">
                رقم الطلب: <span style="color:#b3874b;">#${order.orderNumber}</span>
              </div>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding:10px 32px 20px;">
              <div style="font-size:13px;font-weight:700;color:#1a1208;margin-bottom:10px;">📋 تفاصيل المنتجات المختارة:</div>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <thead>
                  <tr style="background:#f7f4ef;border-radius:8px;">
                    <th style="padding:10px 10px;text-align:right;font-size:12px;color:#8b7355;font-weight:700;">المنتج والتفصيل</th>
                    <th style="padding:10px 10px;text-align:center;font-size:12px;color:#8b7355;font-weight:700;">الكمية</th>
                    <th style="padding:10px 10px;text-align:left;font-size:12px;color:#8b7355;font-weight:700;">السعر</th>
                  </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
              </table>
            </td>
          </tr>

          <!-- Order Summary -->
          <tr>
            <td style="padding:0 32px 25px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px dashed #d9cfc1;padding-top:15px;">
                <tr>
                  <td style="padding:6px 0;color:#8b7355;font-size:13px;">المجموع الفرعي</td>
                  <td style="padding:6px 0;text-align:left;color:#8b7355;font-size:13px;font-weight:600;">${formatPrice(order.subtotal)}</td>
                </tr>
                ${
                  order.bundleDiscount > 0
                    ? `<tr>
                  <td style="padding:6px 0;color:#2e7d32;font-size:13px;font-weight:600;">خصم الباقة الملكية (15%)</td>
                  <td style="padding:6px 0;text-align:left;color:#2e7d32;font-size:13px;font-weight:700;">- ${formatPrice(order.bundleDiscount)}</td>
                </tr>`
                    : ''
                }
                <tr>
                  <td style="padding:6px 0;color:#8b7355;font-size:13px;">الشحن والتوصيل الفاخر</td>
                  <td style="padding:6px 0;text-align:left;color:#2e7d32;font-size:13px;font-weight:700;">مجاني ✦</td>
                </tr>
                <tr style="border-top:2px solid #c5a880;">
                  <td style="padding:14px 0 6px;font-size:17px;font-weight:800;color:#1a1208;font-family:Georgia,serif;">المجموع الإجمالي</td>
                  <td style="padding:14px 0 6px;text-align:left;font-size:18px;font-weight:800;color:#b3874b;">${formatPrice(order.total)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Delivery Info -->
          <tr>
            <td style="padding:0 32px 30px;">
              <div style="background:#f7f4ef;border-radius:12px;padding:20px 24px;border:1px solid #e8decb;">
                <div style="font-size:13px;font-weight:700;color:#1a1208;margin-bottom:10px;">📦 بيانات الشحن والاستلام</div>
                <div style="font-size:13px;color:#5c4a32;line-height:2;">
                  <div>🏠 <strong>العنوان:</strong> ${order.customerAddress}، ${order.customerCity}</div>
                  <div>💳 <strong>طريقة الدفع:</strong> ${paymentLabel}</div>
                </div>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0E0C0B;padding:30px 32px;text-align:center;">
              <div style="color:#c5a880;font-size:12px;letter-spacing:0.2em;font-weight:600;">دار إزار للأزياء الرجالية الفاخرة</div>
              <div style="color:#8b7355;font-size:11px;margin-top:6px;">نسعد بخدمتكم دائماً • خدمة العملاء: concierge@ezar.com</div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// ─── Admin New Order Notification HTML Template ──────────────────────────────

function buildAdminNotificationHtml(order: {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerWhatsapp?: string | null;
  customerEmail?: string | null;
  customerCity: string;
  customerAddress: string;
  items: CartItem[];
  subtotal: number;
  bundleDiscount: number;
  total: number;
  paymentMethod: string;
  notes?: string | null;
}): string {
  const cleanPhone = (order.customerWhatsapp || order.customerPhone).replace(/[^0-9+]/g, '');
  const waNumber = cleanPhone.startsWith('0') ? '20' + cleanPhone.slice(1) : cleanPhone.replace('+', '');

  const itemsRows = order.items
    .map(
      (item) => `
      <tr style="border-bottom:1px solid #332722;">
        <td style="padding:12px 10px; color:#FAF7F2;">
          <div style="font-weight:700; font-size:14px; color:#C5A880;">${item.productTitleAr || item.productTitle}</div>
          <div style="font-size:12px; color:#A89485; margin-top:3px;">اللون: ${item.variantNameAr || item.variantName} | المقاس: ${item.size}</div>
        </td>
        <td style="padding:12px 10px; text-align:center; color:#FAF7F2; font-weight:700; font-size:14px;">×${item.quantity}</td>
        <td style="padding:12px 10px; text-align:left; color:#FAF7F2; font-weight:700;">${formatPrice(item.price * item.quantity)}</td>
      </tr>
    `,
    )
    .join('');

  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>إشعار طلب جديد — إدارة إزار</title>
</head>
<body style="margin:0;padding:0;background:#0E0C0B;font-family:'Segoe UI',Arial,sans-serif;direction:rtl;color:#FAF7F2;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0E0C0B;padding:30px 15px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#1A1615;border-radius:16px;overflow:hidden;border:1px solid #C5A880;box-shadow:0 8px 32px rgba(0,0,0,0.5);">

          <!-- Top Urgent Alert Banner -->
          <tr>
            <td style="background:#C5A880;padding:16px 24px;text-align:center;color:#0E0C0B;">
              <div style="font-size:18px;font-weight:800;letter-spacing:0.05em;">🚨 إشعار بطلب جديد وارد للمتجر!</div>
              <div style="font-size:12px;font-weight:600;margin-top:2px;">رقم الطلب: #${order.orderNumber} • القيمة: ${formatPrice(order.total)}</div>
            </td>
          </tr>

          <!-- Customer Contact Card -->
          <tr>
            <td style="padding:28px 28px 15px;">
              <div style="font-size:14px;font-weight:700;color:#C5A880;margin-bottom:12px;">👤 بيانات العميل والتوصيل:</div>
              <div style="background:#241E1C;border-radius:12px;padding:18px 20px;border:1px solid #3D322D;">
                <table width="100%" cellpadding="6" cellspacing="0" style="font-size:13px;color:#FAF7F2;">
                  <tr>
                    <td style="color:#A89485;width:100px;font-weight:600;">الاسم:</td>
                    <td style="font-weight:700;color:#FFFFFF;font-size:15px;">${order.customerName}</td>
                  </tr>
                  <tr>
                    <td style="color:#A89485;font-weight:600;">الهاتف:</td>
                    <td><a href="tel:${order.customerPhone}" style="color:#C5A880;font-weight:700;text-decoration:none;font-family:monospace;font-size:14px;">${order.customerPhone}</a></td>
                  </tr>
                  ${
                    order.customerEmail
                      ? `<tr>
                    <td style="color:#A89485;font-weight:600;">البريد:</td>
                    <td><a href="mailto:${order.customerEmail}" style="color:#C5A880;text-decoration:none;">${order.customerEmail}</a></td>
                  </tr>`
                      : ''
                  }
                  <tr>
                    <td style="color:#A89485;font-weight:600;">المدينة:</td>
                    <td style="font-weight:600;">${order.customerCity}</td>
                  </tr>
                  <tr>
                    <td style="color:#A89485;font-weight:600;">العنوان:</td>
                    <td style="font-weight:600;line-height:1.6;">${order.customerAddress}</td>
                  </tr>
                  <tr>
                    <td style="color:#A89485;font-weight:600;">طريقة الدفع:</td>
                    <td style="color:#4ADE80;font-weight:700;">${order.paymentMethod === 'cod' ? 'الدفع عند الاستلام (COD)' : order.paymentMethod}</td>
                  </tr>
                  ${
                    order.notes
                      ? `<tr>
                    <td style="color:#A89485;font-weight:600;">ملاحظات:</td>
                    <td style="color:#FBBF24;font-style:italic;">${order.notes}</td>
                  </tr>`
                      : ''
                  }
                </table>

                <!-- Quick Action Buttons -->
                <div style="margin-top:16px;padding-top:14px;border-top:1px solid #3D322D;display:flex;gap:10px;">
                  <a href="https://wa.me/${waNumber}" target="_blank" style="display:inline-block;padding:9px 18px;background:#25D366;color:#FFFFFF;border-radius:8px;font-size:12px;font-weight:700;text-decoration:none;margin-left:8px;">
                    💬 مراسلة واتساب فوراً
                  </a>
                  <a href="tel:${order.customerPhone}" style="display:inline-block;padding:9px 18px;background:#3B82F6;color:#FFFFFF;border-radius:8px;font-size:12px;font-weight:700;text-decoration:none;">
                    📞 اتصال بالعميل
                  </a>
                </div>
              </div>
            </td>
          </tr>

          <!-- Items Ordered Table -->
          <tr>
            <td style="padding:10px 28px 20px;">
              <div style="font-size:14px;font-weight:700;color:#C5A880;margin-bottom:10px;">📦 المنتجات المطلوبة:</div>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#241E1C;border-radius:12px;overflow:hidden;border:1px solid #3D322D;">
                <thead>
                  <tr style="background:#2E2724;">
                    <th style="padding:10px 10px;text-align:right;font-size:12px;color:#A89485;">المنتج</th>
                    <th style="padding:10px 10px;text-align:center;font-size:12px;color:#A89485;">الكمية</th>
                    <th style="padding:10px 10px;text-align:left;font-size:12px;color:#A89485;">السعر</th>
                  </tr>
                </thead>
                <tbody>${itemsRows}</tbody>
              </table>
            </td>
          </tr>

          <!-- Total Summary -->
          <tr>
            <td style="padding:0 28px 25px;">
              <table width="100%" cellpadding="6" cellspacing="0" style="background:#241E1C;border-radius:12px;padding:12px 18px;border:1px solid #3D322D;">
                <tr>
                  <td style="color:#A89485;font-size:13px;">المجموع الفرعي:</td>
                  <td style="text-align:left;color:#FAF7F2;font-size:13px;font-weight:600;">${formatPrice(order.subtotal)}</td>
                </tr>
                ${
                  order.bundleDiscount > 0
                    ? `<tr>
                  <td style="color:#4ADE80;font-size:13px;">خصم الباقة:</td>
                  <td style="text-align:left;color:#4ADE80;font-size:13px;font-weight:700;">- ${formatPrice(order.bundleDiscount)}</td>
                </tr>`
                    : ''
                }
                <tr style="border-top:1px solid #3D322D;">
                  <td style="padding-top:10px;font-size:16px;font-weight:800;color:#C5A880;">إجمالي الطلب المطلوب تحصيله:</td>
                  <td style="padding-top:10px;text-align:left;font-size:18px;font-weight:800;color:#C5A880;">${formatPrice(order.total)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0E0C0B;padding:18px 28px;text-align:center;border-top:1px solid #3D322D;">
              <div style="color:#A89485;font-size:11px;">هذا إشعار تلقائي صادر من نظام متجر إزار (EZAR) لإدارة الطلبات.</div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// ─── Send Functions ───────────────────────────────────────────────────────────

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerWhatsapp?: string | null;
  customerEmail?: string | null;
  customerCity: string;
  customerAddress: string;
  items: CartItem[];
  subtotal: number;
  bundleDiscount: number;
  total: number;
  paymentMethod: string;
  notes?: string | null;
}

/**
 * Send order confirmation email to the customer.
 */
export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<{ success: boolean; error?: string }> {
  try {
    if (!data.customerEmail) {
      return { success: false, error: 'No customer email provided' };
    }

    const resend = await getResendClient();
    const fromEmail = await getSenderEmail();
    const html = buildOrderConfirmationHtml(data as any);

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: data.customerEmail,
      subject: `✅ تم تأكيد طلبك #${data.orderNumber} — إزار للأزياء الفاخرة`,
      html,
    });

    if (error) {
      console.error('[EmailService] Customer email error:', error);
      return { success: false, error: error.message };
    }

    console.log(`[EmailService] Customer confirmation sent to ${data.customerEmail}`);
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[EmailService] Customer email exception:', message);
    return { success: false, error: message };
  }
}

/**
 * Send Admin New Order Notification alert with full customer data and quick actions.
 */
export async function sendAdminNewOrderNotification(data: OrderEmailData): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Get Admin email from SiteSettings or fallback
    let adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'ebrahimkordy0@gmail.com';
    try {
      const settings = await prisma.siteSettings.findUnique({ where: { id: 'current' } });
      if (settings?.contactEmail && settings.contactEmail.includes('@')) {
        adminEmail = settings.contactEmail;
      }
    } catch {}

    const resend = await getResendClient();
    const fromEmail = await getSenderEmail();
    const html = buildAdminNotificationHtml(data);

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `🚨 طلب جديد #${data.orderNumber} من ${data.customerName} (${formatPrice(data.total)})`,
      html,
    });

    if (error) {
      console.error('[EmailService] Admin notification error:', error);
      return { success: false, error: error.message };
    }

    console.log(`[EmailService] Admin notification sent successfully to ${adminEmail}`);
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[EmailService] Admin notification exception:', message);
    return { success: false, error: message };
  }
}

/**
 * Test the Resend connection by sending a test email.
 */
export async function sendTestEmail(toEmail: string): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = await getResendClient();
    const fromEmail = await getSenderEmail();

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: '✅ اتصال Resend يعمل بنجاح — إزار (EZAR)',
      html: `
        <div style="font-family: Arial, sans-serif; direction: rtl; padding: 32px; background: #0E0C0B; color: #FAF7F2; border-radius: 12px; border: 1px solid #C5A880;">
          <h1 style="color: #C5A880; font-family: Georgia, serif; margin: 0 0 10px 0;">إزار | EZAR</h1>
          <h2 style="color: #E6D5C3; margin-top: 0;">🎉 تم الاتصال بنجاح!</h2>
          <p style="color: #FAF7F2; font-size: 15px; line-height: 1.8;">
            خدمة الإيميل تعمل الآن بشكل سليم ومربوطة مع Resend ومشفرة بقواعد البيانات.
          </p>
          <div style="margin-top: 20px; padding: 12px 18px; background: rgba(197, 168, 128, 0.15); border-radius: 8px;">
            <span style="font-size: 13px; color: #C5A880;">تم الإرسال بنجاح إلى: ${toEmail}</span>
          </div>
        </div>
      `,
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: message };
  }
}
