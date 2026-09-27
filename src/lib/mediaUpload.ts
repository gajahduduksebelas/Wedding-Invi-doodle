import { supabase, isSupabaseConfigured } from './supabaseClient';
import { newUuid } from './utils';

export const MEDIA_BUCKET = 'wedding-media';

// Uploaded files already sent to Storage, keyed by their data: URL, so a
// re-run of the save (e.g. after a debounce restart) doesn't upload twice.
const uploadedCache = new Map<string, string>();

const extensionFor = (mime: string, fileName?: string) => {
  const fromName = fileName?.match(/\.([a-z0-9]{2,5})$/i)?.[1];
  if (fromName) return fromName.toLowerCase();
  const sub = mime.split('/')[1] || 'bin';
  if (sub === 'jpeg') return 'jpg';
  if (sub === 'mpeg') return 'mp3';
  if (sub === 'quicktime') return 'mov';
  return sub.replace(/[^a-z0-9]/gi, '') || 'bin';
};

const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

const uploadBlob = async (blob: Blob, fileName?: string): Promise<string> => {
  const mime = blob.type || 'application/octet-stream';
  const folder = mime.split('/')[0] || 'file';
  const path = `${folder}/${newUuid()}.${extensionFor(mime, fileName)}`;

  const { error } = await supabase!.storage
    .from(MEDIA_BUCKET)
    .upload(path, blob, { contentType: mime, cacheControl: '31536000', upsert: false });
  if (error) throw error;

  return supabase!.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
};

/**
 * Stores an uploaded photo / song / video and returns the URL to save in the
 * settings. With Supabase this is a public Storage URL, so the settings row
 * stays small and every guest can load the file; in local-only mode (no
 * Supabase configured) it falls back to an inline data: URL.
 */
export const uploadMedia = async (file: Blob, fileName?: string): Promise<string> => {
  if (!isSupabaseConfigured || !supabase) return blobToDataUrl(file);
  return uploadBlob(file, fileName ?? (file instanceof File ? file.name : undefined));
};

const uploadDataUrl = async (dataUrl: string): Promise<string> => {
  const cached = uploadedCache.get(dataUrl);
  if (cached) return cached;
  const blob = await (await fetch(dataUrl)).blob();
  const url = await uploadBlob(blob);
  uploadedCache.set(dataUrl, url);
  return url;
};

/**
 * Safety net for data: URLs that still end up in the settings (content saved
 * by older versions of the CMS, or a URL pasted by hand): moves each one to
 * Supabase Storage and replaces it with its public URL. Returns the same
 * object (by reference) when nothing needed uploading.
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
