// UKit's active users, live: the devices that put their push token back in the last fourteen
// days (each one does every seven), testers left out, in hundreds. UKit's database does the
// counting and the rounding (public.parc_actif_arrondi(), on the reference count of its
// docs/mesure.md) and lets nothing else out, so this function holds no secret: it calls with the
// publishable key, public by design. The count under-counts: a device with notifications off is
// not in it.
//
// Vercel's CDN keeps each answer an hour; a warm instance also keeps the last one ten minutes, so
// that requests the CDN does not cache still ask the database at most that often.

const TIMEOUT_MS = 5000;
const KEEP_MS = 10 * 60_000;
const CACHED = 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400';

let kept = null;    // { active, at }

const answer = (body, status, cache) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': cache },
});

// Two kinds of failure; the page keeps the figure written in it either way. One may pass by itself
// (the database slow, busy or down): retry. The other needs a hand (configuration missing, key
// refused, function absent, an answer that is not a count): it will fail the same way until someone
// looks, so it says so in the log. The CDN keeps a failure a minute, no more: enough to spare the
// database a visit per page view, short enough to see a repair at once.
const failed = (code, retry, detail) => {
  console.error(`active-users: ${code} (${retry ? 'will pass by itself' : 'needs a hand'})`, detail ?? '');
  return answer({ error: code, retry }, retry ? 503 : 500, 'public, max-age=0, s-maxage=60');
};

function target() {
  const base = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!base || !key) return null;
  try {
    return { url: new URL('/rest/v1/rpc/parc_actif_arrondi', base), key };
  } catch {
    return null;
  }
}

export default {
  async fetch(request) {
    // One question, one cached answer: a query string would make the CDN keep a copy per string.
    if (request.method !== 'GET' || new URL(request.url).search !== '') {
      return answer({ error: 'not_found' }, 404, 'no-store');
    }
    if (kept && Date.now() - kept.at < KEEP_MS) return answer({ active: kept.active }, 200, CACHED);

    const asked = target();
    if (!asked) return failed('not_configured', false);

    let reply;
    try {
      reply = await fetch(asked.url, { headers: { apikey: asked.key }, signal: AbortSignal.timeout(TIMEOUT_MS) });
    } catch (error) {
      return failed('unreachable', true, error?.name);
    }
    if (!reply.ok) {
      const passing = reply.status === 429 || reply.status >= 500;
      return failed(passing ? 'busy' : 'refused', passing, reply.status);
    }
    let active;
    try {
      active = await reply.json();
    } catch {
      return failed('unreadable', false);
    }
    if (!Number.isSafeInteger(active) || active < 0 || active % 100 !== 0) return failed('unreadable', false);

    kept = { active, at: Date.now() };
    return answer({ active }, 200, CACHED);
  },
};
