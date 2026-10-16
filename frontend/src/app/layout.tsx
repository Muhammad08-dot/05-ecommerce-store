import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://halden.example.com'),
  title: {
    default: 'Halden — Handmade ceramics, linen and light for the home',
    template: '%s — Halden',
  },
  description:
    'Small-batch stoneware, washed linen and warm lighting, made to be used every day. Considered homewares from a two-person studio in Portland.',
  openGraph: {
    type: 'website',
    siteName: 'Halden',
    title: 'Halden — Handmade homewares',
    description:
      'Small-batch stoneware, washed linen and warm lighting, made to be used every day.',
    images: [
      {
        url:
          'https://images.unsplash.com/photo-1609881583302-61548332039c?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'A clay vessel being shaped on a potter’s wheel',
      },
    ],
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: '#FAF8F5',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
