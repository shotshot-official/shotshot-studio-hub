import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SHOTSHOT STUDIO HUB — 4-Person Multidisciplinary Creative Team',
  description: 'Internal hub and multi-brand side project matrix for the SHOTSHOT 4-person creative team powered by Next.js 15 and Notion API.',
  openGraph: {
    title: 'SHOTSHOT STUDIO HUB',
    description: '4-Person Creative Team Core Capabilities & Multi-Brand Portfolio Matrix.',
    type: 'website',
    locale: 'en_US',
    siteName: 'SHOTSHOT Studio Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SHOTSHOT STUDIO HUB',
    description: '4-Person Creative Team Core Capabilities & Multi-Brand Portfolio Matrix.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-neutral-800 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
