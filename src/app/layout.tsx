import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import type { Viewport } from "next";
import ZoomLock from "@/components/ZoomLock";


export const viewport: Viewport = {
  themeColor: '#5b0a0a',
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Kylian Malartre | Full-stack Explorer',
  description: 'Interactive portfolio of Kylian Malartre, Computer Science student at UBx.',
  
  openGraph: {
    title: 'Kylian Malartre | Full-stack Explorer',
    description: 'Diving into multiple projects across the stack, from web development to AI and low level programming.',
    url: 'https://kylianmalartre.com',
    siteName: 'Kylian Malartre',
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
  },

  alternates: {
    canonical: 'https://kylianmalartre.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

/**
 * Root layout component wrapping every page.
 * Injects global fonts, structured SEO data (JSON-LD), and the zoom-lock guard.
 *
 * Args:
 *   children: Page content rendered inside the layout shell.
 *
 * Returns:
 *   The full HTML document skeleton with global providers.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // Structured data for search engine rich results (Google Knowledge Panel)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Kylian Malartre',
    alternateName: 'KLN',
    jobTitle: 'Software Engineering Student',
    url: 'https://kylianmalartre.com',
    sameAs: [
      'https://github.com/kln-mltre',
    ],
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Université de Bordeaux (UBx)'
    }
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* JSON-LD structured data script for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Prevents zoom to preserve the fixed layout */}
        <ZoomLock />
        {children}
      </body>
    </html>
  );
}