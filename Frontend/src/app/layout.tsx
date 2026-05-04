import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IGETAM by Qelliot — Free Video Downloader',
  description: 'Download videos from YouTube, TikTok, Instagram, Facebook, X and Vimeo. No login. No ads. Free forever.',
  keywords: ['video downloader', 'youtube downloader', 'tiktok downloader', 'instagram downloader', 'free', 'no login'],
  openGraph: {
    title: 'IGETAM by Qelliot',
    description: 'Download any video. No login required.',
    type: 'website',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#07070f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>{children}</body>
    </html>
  );
}