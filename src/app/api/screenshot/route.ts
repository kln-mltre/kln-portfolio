export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import puppeteer, { Browser } from 'puppeteer-core';
// @ts-ignore
import chromium from '@sparticuz/chromium';

// Singleton browser instance reused across invocations to avoid repeated cold-start overhead.
let browserInstance: Browser | null = null;

/**
 * Returns a connected Puppeteer browser instance, launching one if none is active.
 * Selects a local Chrome binary in development and Sparticuz Chromium in production
 * to satisfy Vercel's serverless read-only filesystem constraints.
 *
 * Args:
 *   None.
 *
 * Returns:
 *   A connected Puppeteer Browser instance.
 */
async function getBrowser() {
  if (browserInstance && browserInstance.connected) return browserInstance;

  const isDev = process.env.NODE_ENV === 'development';

  if (!isDev) {
    (chromium as any).setGraphicsMode = false;
  }

  browserInstance = await puppeteer.launch({
      args: isDev ? ['--no-sandbox', '--disable-setuid-sandbox'] : (chromium as any).args,
      defaultViewport: isDev ? { width: 1280, height: 960 } : (chromium as any).defaultViewport,
      executablePath: isDev ? '/usr/bin/google-chrome' : await (chromium as any).executablePath(),
      headless: isDev ? true : (chromium as any).headless,
    });
  
  return browserInstance;
}

// In-memory screenshot cache to avoid redundant browser renders on repeated requests.
let cachedScreenshot: ArrayBuffer | null = null;
let cachedKey = '';
let lastCapture = 0;
const CACHE_DURATION = 3600_000;

/**
 * GET handler for the screenshot API route.
 * Renders the portfolio homepage via headless browser and returns a JPEG screenshot
 * at the requested viewport dimensions. Results are held in an in-memory TTL cache
 * to prevent redundant browser renders within the same deployment instance.
 *
 * Args:
 *   request: Incoming Next.js request. Accepts optional `w` and `h` query parameters
 *            for viewport width and height, each clamped to safe bounds.
 *
 * Returns:
 *   A Response containing the raw JPEG image buffer, or a JSON error payload on failure.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const w = Math.min(Math.max(parseInt(searchParams.get('w') || '1280'), 800), 3840);
  const h = Math.min(Math.max(parseInt(searchParams.get('h') || '960'), 600), 2160);
  const cacheKey = `${w}x${h}`;
  const now = Date.now();

  if (cachedScreenshot && cachedKey === cacheKey && now - lastCapture < CACHE_DURATION) {
    return new Response(cachedScreenshot, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  }

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });

    // Derive target host from the request to avoid hardcoding and handle all deployment environments.
    const host = request.headers.get('host') || 'localhost:3000';

    // Matches localhost and common RFC 1918 ranges; HTTP is used locally because the dev server has no TLS certificate.
    const isLocal = host.includes('localhost') || host.startsWith('172.') || host.startsWith('192.') || host.startsWith('10.') || host.includes('127.0.0.1');
    const protocol = isLocal ? 'http' : 'https';
    
    const targetUrl = `${protocol}://${host}?screenshot=1&nocache=${Date.now()}`;

    await page.goto(targetUrl, {
      waitUntil: 'networkidle2',
      timeout: 9000, // Kept below Vercel's 10 s function limit to prevent silent timeouts.
    });

    // Allow CSS transitions and web fonts to settle before the capture.
    await new Promise(r => setTimeout(r, 1500));

    const screenshot = await page.screenshot({
      type: 'jpeg',
      quality: 85,
      fullPage: true,
    });

    await page.close();

    const bytes = new Uint8Array(screenshot);
    cachedScreenshot = bytes.buffer as ArrayBuffer;
    cachedKey = cacheKey;
    lastCapture = now;

    return new Response(bytes.buffer as ArrayBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('[Screenshot API] Error:', error);
    // Reset the singleton so the next request launches a fresh, healthy browser instance.
    browserInstance = null;
    return NextResponse.json({ error: 'Screenshot capture failed' }, { status: 500 });
  }
}