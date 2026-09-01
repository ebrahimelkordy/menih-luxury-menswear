import { Resend } from 'resend';

export interface OrderEmailItem {
  id?: string;
  title?: string;
  titleAr?: string;
  price?: number;
  quantity?: number;
  size?: string;
  selectedVariant?: {
    name?: string;
    nameAr?: string;
    colorHex?: string;
    image?: string;
  };
  image?: string;
}

export interface OrderEmailPayload {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  customerCity: string;
  customerAddress: string;
  items: OrderEmailItem[] | any;
  subtotal: number;
  bundleDiscount?: number;
  total: number;
  paymentMethod?: string;
  notes?: string | null;
  createdAt?: Date | string;
}

/**
 * Check if the provided or environment Resend API key is valid and not a placeholder.
 */
export function isLiveResendKey(key?: string): boolean {
  const k = key || process.env.RESEND_API_KEY;
  if (!k) return false;
  const trimmed = k.trim();
  return trimmed.startsWith('re_') && trimmed.length > 20 && !trimmed.includes('mock') && !trimmed.includes('fake') && !trimmed.includes('123456');
}

/**
 * Returns current email system status.
 */
export function getEmailServiceStatus() {
  const hasKey = isLiveResendKey();
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@maison-manie.com';
  const senderEmail = process.env.SENDER_EMAIL || 'Maison Manie <onboarding@resend.dev>';

  return {
    isConfigured: hasKey,
    mode: hasKey ? ('resend' as const) : ('mock' as const),
    adminEmail,
    senderEmail,
    provider: hasKey ? 'Resend Live API' : 'Mock / Sandbox Mode (Simulated)',
  };
}

/**
 * Generate a luxury HTML email template for new orders.
 */
export function generateOrderHtmlTemplate(order: OrderEmailPayload, isAdmin: boolean = true): string {
  const itemsList: OrderEmailItem[] = Array.isArray(order.items)
    ? order.items
    : typeof order.items === 'string'
    ? JSON.parse(order.items)
    : [];

  const dateStr = order.createdAt
    ? new Date(order.createdAt).toLocaleString('ar-EG', { dateStyle: 'full', timeStyle: 'short' })
    : new Date().toLocaleString('ar-EG', { dateStyle: 'full', timeStyle: 'short' });

  const paymentText = order.paymentMethod === 'card' ? '💳 بطاقة ائتمانية / دفع إلكتروني' : '💵 الدفع عند الاستلام (COD)';

  const itemsRows = itemsList
    .map((item) => {
      const title = item.titleAr || item.title || 'قطعة فاخرة';
      const color = item.selectedVariant?.nameAr || item.selectedVariant?.name || '';
      const size = item.size ? `المقاس: ${item.size}` : '';
      const variantInfo = [color, size].filter(Boolean).join(' • ');
      const qty = item.quantity || 1;
      const unitPrice = item.price ? `${item.price.toLocaleString('ar-EG')} ج.م` : '';
      const itemTotal = item.price ? `${(item.price * qty).toLocaleString('ar-EG')} ج.م` : '';
      const imgUrl = item.selectedVariant?.image || item.image || '';

      return `
      <tr style="border-bottom: 1px solid #2e2620;">
        <td style="padding: 14px 10px; width: 60px; vertical-align: middle;">
          ${
            imgUrl
              ? `<img src="${imgUrl}" alt="${title}" width="54" height="54" style="border-radius: 8px; object-fit: cover; border: 1px solid #c5a880; display: block;" />`
              : `<div style="width: 50px; height: 50px; background-color: #27201a; border-radius: 8px; border: 1px solid #3d3128; text-align: center; line-height: 50px; font-size: 20px;">👑</div>`
          }
        </td>
        <td style="padding: 14px 10px; vertical-align: middle;">
          <div style="font-size: 14px; font-weight: bold; color: #f5f0eb; line-height: 1.4;">${title}</div>
          ${variantInfo ? `<div style="font-size: 12px; color: #c5a880; margin-top: 3px;">${variantInfo}</div>` : ''}
          <div style="font-size: 11px; color: #a89f91; margin-top: 2px;">الكمية: ${qty} × ${unitPrice}</div>
        </td>
        <td style="padding: 14px 10px; text-align: left; vertical-align: middle; font-size: 14px; font-weight: bold; color: #d4af37; font-family: monospace;">
          ${itemTotal}
        </td>
      </tr>
    `;
    })
    .join('');

  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>طلب جديد - دار المَنِيع</title>
</head>
<body style="margin: 0; padding: 0; background-color: #120e0b; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #e6dfd5; direction: rtl; text-align: right;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #1a1511; border: 1px solid #3d3128; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    
    <!-- Top Luxury Header -->
    <div style="background: linear-gradient(135deg, #1f1813 0%, #2e231b 100%); padding: 30px 24px; text-align: center; border-bottom: 2px solid #c5a880;">
      <div style="font-size: 26px; font-weight: bold; letter-spacing: 4px; color: #fdfaf6; margin-bottom: 4px; font-family: 'Playfair Display', Georgia, serif;">
        MANIE
      </div>
      <div style="font-size: 11px; letter-spacing: 3px; color: #c5a880; text-transform: uppercase; font-weight: 600;">
        دار المَنِيع الفاخرة — MAISON MANIE
      </div>
      <div style="display: inline-block; margin-top: 14px; padding: 6px 16px; background-color: rgba(197, 168, 128, 0.15); border: 1px solid #c5a880; border-radius: 30px; font-size: 12px; color: #d4af37; font-weight: bold;">
        ${isAdmin ? '👑 إشعار طلب شراء جديد للإدارة' : '✨ تم تأكيد طلبك الملكي بنجاح'}
      </div>
    </div>

    <!-- Order Header Info Card -->
    <div style="padding: 24px;">
      <div style="background-color: #241c16; border-radius: 12px; padding: 16px 20px; border: 1px solid #3d3128; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="font-size: 12px; color: #a89f91;">رقم الطلب:</td>
            <td style="font-size: 14px; font-weight: bold; color: #d4af37; text-align: left; font-family: monospace;">${order.orderNumber}</td>
          </tr>
          <tr>
            <td style="font-size: 12px; color: #a89f91; padding-top: 8px;">تاريخ الطلب:</td>
            <td style="font-size: 12px; color: #f5f0eb; text-align: left; padding-top: 8px;">${dateStr}</td>
          </tr>
          <tr>
            <td style="font-size: 12px; color: #a89f91; padding-top: 8px;">طريقة الدفع:</td>
            <td style="font-size: 12px; color: #f5f0eb; text-align: left; padding-top: 8px;">${paymentText}</td>
          </tr>
        </table>
      </div>

      <!-- Customer Details -->
      <div style="margin-bottom: 24px;">
        <div style="font-size: 14px; font-weight: bold; color: #c5a880; border-bottom: 1px solid #3d3128; padding-bottom: 8px; margin-bottom: 12px;">
          👤 بيانات العميل والشحن والتوصيل
        </div>
        <table style="width: 100%; font-size: 13px; line-height: 1.8; color: #e6dfd5;">
          <tr>
            <td style="color: #a89f91; width: 110px;">الاسم الكامل:</td>
            <td style="font-weight: bold; color: #ffffff;">${order.customerName}</td>
          </tr>
          <tr>
            <td style="color: #a89f91;">رقم الهاتف:</td>
            <td style="font-weight: bold; color: #d4af37; direction: ltr; text-align: right;">${order.customerPhone}</td>
          </tr>
          ${
            order.customerEmail
              ? `<tr><td style="color: #a89f91;">البريد الإلكتروني:</td><td>${order.customerEmail}</td></tr>`
              : ''
          }
          <tr>
            <td style="color: #a89f91;">المدينة / المحافظة:</td>
            <td>${order.customerCity}</td>
          </tr>
          <tr>
            <td style="color: #a89f91;">العنوان بالتفصيل:</td>
            <td>${order.customerAddress}</td>
          </tr>
          ${
            order.notes
              ? `<tr><td style="color: #a89f91;">ملاحظات العميل:</td><td style="color: #e5a880; font-style: italic;">${order.notes}</td></tr>`
              : ''
          }
        </table>
      </div>

      <!-- Order Items -->
      <div style="margin-bottom: 24px;">
        <div style="font-size: 14px; font-weight: bold; color: #c5a880; border-bottom: 1px solid #3d3128; padding-bottom: 8px; margin-bottom: 12px;">
          🛍️ تفاصيل المنتجات والقطع المطلوبة (${itemsList.length})
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          ${itemsRows}
        </table>
      </div>

      <!-- Financial Summary -->
      <div style="background-color: #241c16; border-radius: 12px; padding: 18px 20px; border: 1px solid #3d3128; margin-bottom: 24px;">
        <table style="width: 100%; font-size: 13px; line-height: 2;">
          <tr>
            <td style="color: #a89f91;">المجموع الفرعي:</td>
            <td style="text-align: left; color: #f5f0eb; font-family: monospace;">${order.subtotal.toLocaleString('ar-EG')} ج.م</td>
          </tr>
          ${
            order.bundleDiscount && order.bundleDiscount > 0
              ? `
          <tr>
            <td style="color: #4ade80;">خصم الطقم المتناسق (Mix & Match):</td>
            <td style="text-align: left; color: #4ade80; font-family: monospace;">-${order.bundleDiscount.toLocaleString('ar-EG')} ج.م</td>
          </tr>`
              : ''
          }
          <tr>
            <td style="color: #a89f91;">الشحن والتوصيل:</td>
            <td style="text-align: left; color: #4ade80;">مجاني (Complimentary)</td>
          </tr>
          <tr style="border-top: 1px solid #3d3128;">
            <td style="font-size: 16px; font-weight: bold; color: #ffffff; padding-top: 8px;">الإجمالي الكلي:</td>
            <td style="font-size: 18px; font-weight: bold; color: #d4af37; text-align: left; padding-top: 8px; font-family: monospace;">
              ${order.total.toLocaleString('ar-EG')} ج.م
            </td>
          </tr>
        </table>
      </div>

      <!-- Action Button -->
      ${
        isAdmin
          ? `
      <div style="text-align: center; margin: 30px 0 10px;">
        <a href="https://project-self-omega-65.vercel.app/admin" style="display: inline-block; background-color: #c5a880; color: #1a1511; font-weight: bold; font-size: 13px; text-decoration: none; padding: 12px 28px; border-radius: 12px; box-shadow: 0 4px 15px rgba(197, 168, 128, 0.3);">
          👑 فتح لوحة تحكم الدار لإدارة الطلب
        </a>
      </div>`
          : `
      <div style="text-align: center; margin: 30px 0 10px;">
        <a href="https://project-self-omega-65.vercel.app" style="display: inline-block; background-color: #c5a880; color: #1a1511; font-weight: bold; font-size: 13px; text-decoration: none; padding: 12px 28px; border-radius: 12px;">
          زيارة دار المَنِيع
        </a>
      </div>`
      }

    </div>

    <!-- Footer -->
    <div style="background-color: #14100c; padding: 20px; text-align: center; border-top: 1px solid #2e2620; font-size: 11px; color: #70685e;">
      <p style="margin: 0 0 6px;">دار المَنِيع للأزياء العربية والرجالية الفاخرة — القاهرة، مصر</p>
      <p style="margin: 0; color: #524b43;">© ${new Date().getFullYear()} Maison Manie. جميع الحقوق محفوظة.</p>
    </div>

  </div>
</body>
</html>
  `.trim();
}

/**
 * Send order notification email (uses Resend if live key provided, otherwise executes mock simulated dispatch).
 */
export async function sendOrderNotificationEmail(order: OrderEmailPayload, customAdminEmail?: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = customAdminEmail || process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@maison-manie.com';
  const sender = process.env.SENDER_EMAIL || 'Maison Manie <onboarding@resend.dev>';
  const subject = `👑 طلب جديد رقم [${order.orderNumber}] — دار المَنِيع (${order.total.toLocaleString('ar-EG')} ج.م)`;
  const html = generateOrderHtmlTemplate(order, true);

  // If live key is configured, send via real Resend API
  if (isLiveResendKey(apiKey)) {
    try {
      const resend = new Resend(apiKey);
      const data = await resend.emails.send({
        from: sender,
        to: adminEmail,
        subject,
        html,
      });

      console.log(`[EMAIL LIVE SENT] ✅ Resend Email sent successfully to ${adminEmail}, ID:`, data);
      return { success: true, mode: 'resend', messageId: data.data?.id, to: adminEmail };
    } catch (err: any) {
      console.error('[EMAIL LIVE ERROR] ❌ Resend sending failed:', err);
      // Fallback to simulated log if API fails
      return { success: false, mode: 'resend', error: err?.message || String(err) };
    }
  }

  // Otherwise, run in Mock / Sandbox Mode
  const mockMsgId = `mock_resend_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  console.log('\n======================================================');
  console.log('✉️  [MOCK EMAIL NOTIFICATION — SIMULATED / SANDBOX MODE]');
  console.log('======================================================');
  console.log(`To (Admin):    ${adminEmail}`);
  console.log(`Sender:        ${sender}`);
  console.log(`Subject:       ${subject}`);
  console.log(`Order Number:  ${order.orderNumber}`);
  console.log(`Customer:      ${order.customerName} (${order.customerPhone})`);
  console.log(`Destination:   ${order.customerCity} — ${order.customerAddress}`);
  console.log(`Total Amount:  ${order.total.toLocaleString('en-US')} EGP (${order.paymentMethod || 'cod'})`);
  console.log(`Message ID:    ${mockMsgId}`);
  console.log('Status:        ✅ Simulated successfully (Waiting for RESEND_API_KEY)');
  console.log('======================================================\n');

  return {
    success: true,
    mode: 'mock',
    messageId: mockMsgId,
    to: adminEmail,
    note: 'Simulated dispatch in Mock Mode. Set RESEND_API_KEY in .env when ready.',
  };
}

/**
 * Send test email to verify settings.
 */
export async function sendTestEmail(targetEmail?: string, keyOverride?: string) {
  const apiKey = keyOverride || process.env.RESEND_API_KEY;
  const to = targetEmail || process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@maison-manie.com';
  const sender = process.env.SENDER_EMAIL || 'Maison Manie <onboarding@resend.dev>';

  const dummyOrder: OrderEmailPayload = {
    orderNumber: `TEST-${Date.now().toString().slice(-4)}`,
    customerName: 'تجربة إشعار الإدارة (Test Admin)',
    customerPhone: '+20 100 123 4567',
    customerEmail: to,
    customerCity: 'القاهرة / التجمع الخامس',
    customerAddress: 'فيلا 14، شارع التسعين الشمالي',
    subtotal: 5800,
    bundleDiscount: 870,
    total: 4930,
    paymentMethod: 'cod',
    notes: 'إشعار تجريبي لاختبار قالب البريد الإلكتروني ونظام الإشعارات الفوري.',
    items: [
      {
        title: 'Bespoke Royal Thobe',
        titleAr: 'ثوب ملكي مطرز من قطن الجيزة ٩٤',
        price: 2600,
        quantity: 1,
        size: '56L',
        selectedVariant: { nameAr: 'أبيض لؤلؤي ناصع', name: 'Imperial White', colorHex: '#FFFFFF' },
      },
      {
        title: 'Imperial Crimson Jacquard Shemagh',
        titleAr: 'شماغ المنيع الملكي نقش جاكار كشميري',
        price: 3200,
        quantity: 1,
        size: '58',
        selectedVariant: { nameAr: 'عنابي ملكي كلاسيك', name: 'Crimson Red', colorHex: '#8B1E2D' },
      },
    ],
  };

  if (isLiveResendKey(apiKey)) {
    try {
      const resend = new Resend(apiKey);
      const data = await resend.emails.send({
        from: sender,
        to,
        subject: `👑 [تجربة] إشعار بريد إلكتروني تجريبي — دار المَنِيع`,
        html: generateOrderHtmlTemplate(dummyOrder, true),
      });

      return { success: true, mode: 'resend', messageId: data.data?.id, to };
    } catch (err: any) {
      return { success: false, mode: 'resend', error: err?.message || String(err) };
    }
  }

  const mockMsgId = `mock_test_${Date.now()}`;
  console.log(`[MOCK TEST EMAIL] ✉️ Sent test notification to ${to}, Mock ID: ${mockMsgId}`);
  return {
    success: true,
    mode: 'mock',
    messageId: mockMsgId,
    to,
    message: 'تم إرسال الإيميل التجريبي في وضع المحاكاة بنجاح (Mock Mode)!',
  };
}
