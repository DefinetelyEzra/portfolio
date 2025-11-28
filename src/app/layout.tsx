import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AudioProvider } from '@/components/ui/AudioProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "aa-ezra | portfolio",
  description: "Created with TypeScript + React",
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#f3f4f6' },
      { media: '(prefers-color-scheme: dark)', color: '#000000' }
    ],
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon2.ico" />
        {/* Preconnect to external resources if needed */}
        {/* <link rel="preconnect" href="https://fonts.googleapis.com" /> */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AudioProvider>
          {children}
        </AudioProvider>
      </body>
    </html>
  );
}