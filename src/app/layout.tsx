import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import type { Viewport } from "next";
import ZoomLock from "@/components/ui/ZoomLock";


// Disables user-initiated zoom to protect the fixed-dimension bento-grid canvas on mobile.
export const viewport: Viewport = {
  colorScheme: 'only light',
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Primary sans-serif UI font (variable token: --font-geist-sans).
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Monospace font for code and terminal elements (variable token: --font-geist-mono).
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Page-level SEO metadata including Open Graph, Twitter card, canonical URL, and crawler directives.
export const metadata: Metadata = {
  metadataBase: new URL('https://kylianmalartre.com'),
  title: 'Kylian Malartre | Full-stack Explorer',
  description: 'Interactive portfolio of Kylian Malartre, Computer Science student at UBx.',
  
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  other: {
    google: "notranslate",
  },

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
    <html lang="en" translate='no'>
      <head>
        {/* Google Fonts for MargauxCard (Outfit + Lora) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased notranslate`}
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