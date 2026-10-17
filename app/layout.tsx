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
  title: 'SHOTSHOT Studio Hub — Creative Studio',
  description: 'Team directory and project index for SHOTSHOT, an independent creative studio working across visual media, software, and storytelling.',
  openGraph: {
    title: 'SHOTSHOT Studio Hub',
    description: 'An independent creative studio working across visual media, software, and storytelling.',
    type: 'website',
    locale: 'en_US',
    siteName: 'SHOTSHOT Studio Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SHOTSHOT Studio Hub',
    description: 'An independent creative studio working across visual media, software, and storytelling.',
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
