export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import puppeteer, { Browser } from 'puppeteer-core';

// Persistent singleton — launched once and reused across requests to avoid cold-start overhead
let browserInstance: Browser | null = null;

/**
 * Returns a connected Puppeteer browser instance, launching one if needed.
 * Reuses a module-level singleton to avoid spinning up Chrome on every request.
 *
 * Returns:
 *   A connected Puppeteer Browser instance.
 */
async function getBrowser() {
  if (browserInstance && browserInstance.connected) return browserInstance;
  browserInstance = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });
  return browserInstance;
}

// In-memory screenshot cache to debounce rapid identical requests
let cachedScreenshot: ArrayBuffer | null = null;
let cachedKey = '';
let lastCapture = 0;
const CACHE_DURATION = 10_000;

/**
 * Captures a JPEG screenshot of the portfolio page at the requested viewport size.
 * Uses an in-memory cache keyed by dimensions with a 10-second TTL.
 * Appends ?screenshot=1 to the target URL so the page can render a static
 * placeholder instead of triggering a recursive capture.
 *
 * Args:
 *   request: Incoming Next.js request with optional `w` and `h` search params.
 *
 * Returns:
 *   A Response containing the JPEG screenshot buffer, or a 500 JSON error.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const w = Math.min(Math.max(parseInt(searchParams.get('w') || '1280'), 800), 3840);
  const h = Math.min(Math.max(parseInt(searchParams.get('h') || '960'), 600), 2160);
  const cacheKey = `${w}x${h}`;
  const now = Date.now();

  // Serve cached screenshot if dimensions match and TTL has not expired
  if (cachedScreenshot && cachedKey === cacheKey && now - lastCapture < CACHE_DURATION) {
    return new Response(cachedScreenshot, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=10',
      },
    });
  }

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });

    await page.goto(`http://localhost:3000?screenshot=1&nocache=${Date.now()}`, {
      waitUntil: 'domcontentloaded',
      timeout: 10000,
    });

    // Short delay to let CSS animations and fonts settle before capture
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
        'Cache-Control': 'public, max-age=10',
      },
    });
  } catch (error) {
    console.error('[Screenshot API] Error:', error);
    // Reset the singleton so the next request launches a fresh instance
    browserInstance = null;
    return NextResponse.json(
      { error: 'Screenshot capture failed' },
      { status: 500 }
    );
  }
}
