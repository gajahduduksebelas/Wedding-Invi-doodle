import { next } from '@vercel/functions';

/**
 * Link previews (WhatsApp, Telegram, Facebook, …) read the page's meta tags
 * without running the app, so they never see data saved in the CMS. For those
 * preview bots only, this Vercel Routing Middleware fills the title and
 * description from the live settings (couple names, wedding date) and, for
 * personal links (?to=Name), greets the guest. Real visitors get the static
 * page untouched, and any failure falls back to it as well.
 */

declare const process: { env: Record<string, string | undefined> };

export const config = {
  matcher: '/',
};

const PREVIEW_BOTS =
  /whatsapp|facebookexternalhit|facebot|twitterbot|telegrambot|slackbot|discordbot|linkedinbot|skypeuripreview|pinterest|applebot|googlebot|bingbot|embedly|vkshare|line\/|kakaotalk|viber|snapchat|bot\b|crawler|spider|preview/i;

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Sets the content of <meta property|name="key"> (all occurrences). */
const setMeta = (html: string, key: string, value: string) =>
  html.replace(
    new RegExp(`(<meta\\s+(?:property|name)="${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\s+content=")[^"]*(")`, 'g'),
    `$1${escapeHtml(value)}$2`,
  );

interface Person {
  nickname?: string;
  name?: string;
}

async function loadCouple(): Promise<{ bride?: Person; groom?: Person; weddingDate?: string } | null> {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2500);
  try {
    const res = await fetch(`${url}/rest/v1/site_settings?id=eq.1&select=couple`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as { couple?: { bride?: Person; groom?: Person; weddingDate?: string } }[];
    return rows[0]?.couple ?? null;
  } finally {
    clearTimeout(timer);
  }
}

export function buildPreviewHtml(
  html: string,
  couple: { bride?: Person; groom?: Person; weddingDate?: string },
  guest: string | null,
  pageUrl: string,
) {
  const bride = couple.bride?.nickname?.trim();
  const groom = couple.groom?.nickname?.trim();
  const names = bride && groom ? `${bride} & ${groom}` : null;
  const date = couple.weddingDate?.trim();
  if (!names && !date) return html;

  const title = `${names ?? 'Undangan'} — Undangan Pernikahan`;
  const body = `Dengan penuh sukacita, ${names ?? 'kami'} mengundang Anda ke hari bahagia kami${date ? ` — ${date}` : ''}.`;
  const description = guest ? `Kepada Yth. ${guest} — ${body}` : body;

  let out = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
  for (const key of ['og:title', 'twitter:title']) out = setMeta(out, key, title);
  for (const key of ['description', 'og:description', 'twitter:description']) out = setMeta(out, key, description);
  out = setMeta(out, 'og:url', pageUrl);
  return out;
}

export default async function middleware(request: Request) {
  const ua = request.headers.get('user-agent') || '';
  if (request.method !== 'GET' || !PREVIEW_BOTS.test(ua)) return next();

  try {
    const url = new URL(request.url);
    const [page, couple] = await Promise.all([
      fetch(new URL('/index.html', url)).then((r) => (r.ok ? r.text() : null)),
      loadCouple(),
    ]);
    if (!page || !couple) return next();

    const guest = url.searchParams.get('to')?.trim().slice(0, 80) || null;
    const html = buildPreviewHtml(page, couple, guest, url.toString());
    return new Response(html, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        // Short shared cache so CMS changes show up in new previews within a minute.
        'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch {
    return next();
  }
}
