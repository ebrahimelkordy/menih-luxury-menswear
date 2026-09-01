import './globals.css';
import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono, Noto_Kufi_Arabic } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
});

const notoKufi = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  variable: '--font-arabic',
  display: 'swap',
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kordycontracting.com'),
  title: {
    default: 'Al-Kordy Contracting — Metal Construction & Steel Fabrication',
    template: '%s — Al-Kordy Contracting',
  },
  description:
    'Metal construction and steel fabrication built with precision, discipline and experience. From material to structure.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Al-Kordy Contracting',
    title: 'Al-Kordy Contracting — From Material to Structure',
    description: 'Metal construction and steel fabrication built with precision, discipline and experience.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Al-Kordy Contracting — From Material to Structure',
    description: 'Metal construction and steel fabrication built with precision, discipline and experience.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} ${notoKufi.variable}`}>
      <body className="font-sans bg-concrete text-graphite antialiased">
        {children}
      </body>
    </html>
  );
}
