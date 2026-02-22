export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import puppeteer, { Browser } from 'puppeteer-core';
// @ts-ignore
import chromium from '@sparticuz/chromium';

// Singleton browser instance — reused across invocations to avoid repeated cold-start overhead.
let browserInstance: Browser | null = null;

/**
 * Returns a connected Puppeteer browser instance, launching one if none is active.
 * Uses a local Chrome executable in development and Sparticuz Chromium in production
 * to remain within Vercel's serverless deployment constraints.
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

  browserInstance = await puppeteer.launch({
    args: isDev ? ['--no-sandbox', '--disable-setuid-sandbox'] : chromium.args,
    defaultViewport: chromium.defaultViewport,
    // Local path is only valid in development; Sparticuz resolves its own binary in production.
    executablePath: isDev ? '/usr/bin/google-chrome' : await chromium.executablePath(),
    headless: isDev ? true : chromium.headless,
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
 * Captures a JPEG screenshot of the portfolio homepage at the requested viewport dimensions,
 * with an in-memory TTL cache to prevent redundant browser renders.
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

  // Serve the cached buffer when dimensions match and the TTL has not expired.
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

    // Derive the target URL from the incoming request host to support both local and Vercel deployments without hardcoding.
    const host = request.headers.get('host') || 'localhost:3000';
    // HTTP is enforced locally because the dev server has no TLS certificate; production always uses HTTPS.
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const targetUrl = `${protocol}://${host}?screenshot=1&nocache=${Date.now()}`;

    await page.goto(targetUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 8000, // Kept below Vercel's 10 s serverless function limit to prevent silent timeouts.
    });

    // Allow CSS transitions and web fonts to settle before the capture.
    await new Promise(r => setTimeout(r, 300));

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
    return NextResponse.json(
      { error: 'Screenshot capture failed' },
      { status: 500 }
    );
  }
}