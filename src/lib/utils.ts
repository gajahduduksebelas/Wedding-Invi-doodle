const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUuid = (value: unknown): value is string =>
  typeof value === 'string' && UUID_RE.test(value);

// crypto.randomUUID only exists in secure contexts (https / localhost), so
// fall back to getRandomValues when the dev server is opened over a LAN IP.
export const newUuid = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

// localStorage is only an offline cache here. It is capped at ~5 MB and throws
// when full (or in some private-browsing modes), which must never crash the app.
export const readCache = <T>(key: string, fallback: T, parse = true): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const saved = localStorage.getItem(key);
    if (saved === null) return fallback;
    return parse ? JSON.parse(saved) : (saved as unknown as T);
  } catch {
    return fallback;
  }
};

export const writeCache = (key: string, value: unknown) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  } catch (err) {
    console.warn(`[cache] could not write "${key}" to localStorage`, err);
  }
};

// Wishes from the database carry an ISO timestamp; sample/optimistic ones
// already hold display text such as "Baru saja", which is shown as-is.
export const formatWishTime = (value: string): string => {
  if (!/^\d{4}-\d{2}-\d{2}T/.test(value)) return value;
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return value;
  const minutes = Math.floor((Date.now() - time) / 60000);
  if (minutes < 1) return 'Baru saja';
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  return new Date(time).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

/**
 * True when Supabase rejected a request because of the login it carried
 * (expired or revoked JWT) rather than the request itself.
 */
export const isAuthRejected = (error: { code?: string; message?: string } | null | undefined): boolean =>
  !!error && (/^PGRST30[0-3]$/.test(error.code || '') || /jwt|token/i.test(error.message || ''));
