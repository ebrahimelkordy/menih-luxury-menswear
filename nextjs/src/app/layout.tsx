import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'MENIH — إزار للملابس الرجالية الفاخرة', template: '%s — إزار' },
  description: 'ثياب مخيطة خصيصاً، بشوت ملكية، أشمغة فاخرة ودهن عود كمبودي معتق. Bespoke Arabian menswear crafted for the modern gentleman.',
  keywords: ['ثياب فاخرة', 'بشت ملكي', 'عباءة رجالي', 'luxury thobe', 'Arabian menswear', 'MENIH'],
  openGraph: {
    siteName: 'إزار | MENIH Luxury',
    locale: 'ar_EG',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Amiri:ital,wght@0,400;0,700;1,400&family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

