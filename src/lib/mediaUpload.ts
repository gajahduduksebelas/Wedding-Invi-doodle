import { supabase, isSupabaseConfigured } from './supabaseClient';
import { newUuid } from './utils';

export const MEDIA_BUCKET = 'wedding-media';

// Uploaded files already sent to Storage, keyed by their data: URL, so a
// re-run of the save (e.g. after a debounce restart) doesn't upload twice.
const uploadedCache = new Map<string, string>();

const extensionFor = (mime: string) => {
  const sub = mime.split('/')[1] || 'bin';
  if (sub === 'jpeg') return 'jpg';
  if (sub === 'mpeg') return 'mp3';
  if (sub === 'quicktime') return 'mov';
  return sub.replace(/[^a-z0-9]/gi, '') || 'bin';
};

const uploadDataUrl = async (dataUrl: string): Promise<string> => {
  const cached = uploadedCache.get(dataUrl);
  if (cached) return cached;

  const blob = await (await fetch(dataUrl)).blob();
  const mime = blob.type || 'application/octet-stream';
  const folder = mime.split('/')[0] || 'file';
  const path = `${folder}/${newUuid()}.${extensionFor(mime)}`;

  const { error } = await supabase!.storage
    .from(MEDIA_BUCKET)
    .upload(path, blob, { contentType: mime, cacheControl: '31536000', upsert: false });
  if (error) throw error;

  const { data } = supabase!.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  uploadedCache.set(dataUrl, data.publicUrl);
  return data.publicUrl;
};

/**
 * The CMS editors read uploaded photos/audio/video as base64 data: URLs.
 * Storing those inline bloats the settings row (every guest downloads it) and
 * overflows localStorage, so before saving we move each one to Supabase
 * Storage and replace it with its public URL. Returns the same object
 * (by reference) when nothing needed uploading.
 */
export const uploadInlineMedia = async <T>(value: T): Promise<T> => {
  if (!isSupabaseConfigured || !supabase) return value;

  const walk = async (node: unknown): Promise<unknown> => {
    if (typeof node === 'string') {
      return node.startsWith('data:') ? uploadDataUrl(node) : node;
    }
    if (Array.isArray(node)) {
      const next = await Promise.all(node.map(walk));
      return next.some((v, i) => v !== node[i]) ? next : node;
    }
    if (node && typeof node === 'object') {
      const entries = await Promise.all(
        Object.entries(node).map(async ([k, v]) => [k, await walk(v)] as const)
      );
      const changed = entries.some(([k, v]) => v !== (node as Record<string, unknown>)[k]);
      return changed ? Object.fromEntries(entries) : node;
    }
    return node;
  };

  return (await walk(value)) as T;
};
