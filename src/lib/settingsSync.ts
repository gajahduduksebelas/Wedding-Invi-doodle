/**
 * Field-level syncing for the single settings row, so two admins can edit the
 * CMS at the same time on different devices without overwriting each other.
 *
 *  - Saving sends only what changed since the last sync (`buildPatch`); the
 *    database merges it (`patch_site_settings`: object columns merge their
 *    top-level keys, list/text columns are replaced).
 *  - Changes from the other device arrive over Realtime and are merged in
 *    (`mergeRemote`) everywhere except where this device has unsaved edits.
 *  - A CMS editor's draft is merged onto the latest data (`mergeEdit`), so it
 *    only carries the fields the admin actually changed in that editor.
 */

export interface SettingsShape {
  couple: Record<string, unknown>;
  events: unknown[];
  banks: unknown[];
  photos: unknown[];
  video_config: Record<string, unknown>;
  gift_address: string;
  dress_code: Record<string, unknown>;
}

export type SettingsColumn = keyof SettingsShape;

export const SETTINGS_COLUMNS: SettingsColumn[] = [
  'couple',
  'events',
  'banks',
  'photos',
  'video_config',
  'gift_address',
  'dress_code',
];

/** Columns whose top-level keys are merged individually. */
const OBJECT_COLUMNS = new Set<SettingsColumn>(['couple', 'video_config', 'dress_code']);

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const clone = <T,>(v: T): T => (v === undefined ? v : JSON.parse(JSON.stringify(v)));
const isObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

export const cloneSettings = (s: SettingsShape): SettingsShape => clone(s);

/** The parts of `current` that differ from `synced`, ready for `patch_site_settings`. */
export function buildPatch(current: SettingsShape, synced: SettingsShape | null): Partial<SettingsShape> | null {
  if (!synced) return clone(current);
  const patch: Record<string, unknown> = {};
  for (const col of SETTINGS_COLUMNS) {
    const cur = current[col];
    const old = synced[col];
    if (same(cur, old)) continue;
    if (OBJECT_COLUMNS.has(col) && isObject(cur) && isObject(old)) {
      const keys: Record<string, unknown> = {};
      for (const k of Object.keys(cur)) if (!same(cur[k], old[k])) keys[k] = cur[k];
      // A removed key is sent as null so the merge doesn't keep the old value.
      for (const k of Object.keys(old)) if (!(k in cur)) keys[k] = null;
      if (Object.keys(keys).length) patch[col] = clone(keys);
    } else {
      patch[col] = clone(cur);
    }
  }
  return Object.keys(patch).length ? (patch as Partial<SettingsShape>) : null;
}

/** `synced` after the database accepted `patch`. */
export function applyPatch(synced: SettingsShape | null, patch: Partial<SettingsShape>): SettingsShape | null {
  if (!synced) return null;
  const next = clone(synced);
  for (const col of Object.keys(patch) as SettingsColumn[]) {
    const val = patch[col];
    if (OBJECT_COLUMNS.has(col) && isObject(val)) {
      const merged = { ...(next[col] as Record<string, unknown>) };
      for (const [k, v] of Object.entries(val)) {
        if (v === null) delete merged[k];
        else merged[k] = clone(v);
      }
      (next as unknown as Record<string, unknown>)[col] = merged;
    } else {
      (next as unknown as Record<string, unknown>)[col] = clone(val);
    }
  }
  return next;
}

/**
 * Merge a settings row that another device saved. Anything this device hasn't
 * changed since the last sync takes the remote value; unsaved local edits
 * (per column, or per key in object columns) are kept and will be saved.
 */
export function mergeRemote(
  local: SettingsShape,
  synced: SettingsShape | null,
  remote: SettingsShape
): { next: SettingsShape; synced: SettingsShape; changed: SettingsColumn[] } {
  const next = clone(local);
  const changed: SettingsColumn[] = [];
  for (const col of SETTINGS_COLUMNS) {
    const rem = remote[col];
    if (rem === undefined || rem === null) continue;
    const loc = local[col];
    const base = synced ? synced[col] : undefined;
    let value: unknown;
    if (OBJECT_COLUMNS.has(col) && isObject(loc) && isObject(rem)) {
      const merged: Record<string, unknown> = { ...loc };
      const baseObj = isObject(base) ? base : {};
      for (const k of new Set([...Object.keys(rem), ...Object.keys(loc)])) {
        const locallyEdited = synced && !same(loc[k], baseObj[k]);
        if (locallyEdited) continue;
        if (k in rem) merged[k] = clone(rem[k]);
        else delete merged[k];
      }
      value = merged;
    } else {
      const locallyEdited = synced && !same(loc, base);
      value = locallyEdited ? loc : clone(rem);
    }
    if (!same(value, loc)) {
      (next as unknown as Record<string, unknown>)[col] = value;
      changed.push(col);
    }
  }
  return { next, synced: clone(remote), changed };
}

/**
 * Apply a CMS editor's draft on top of the latest value: only what the admin
 * changed in the editor (compared to what the editor started from) is taken
 * from the draft. Objects merge per top-level key; anything else is replaced
 * only if it was changed.
 */
export function mergeEdit<T>(base: T, draft: T, latest: T): T {
  if (isObject(base) && isObject(draft) && isObject(latest)) {
    const out: Record<string, unknown> = { ...latest };
    for (const k of new Set([...Object.keys(draft), ...Object.keys(base)])) {
      if (same(draft[k], base[k])) continue;
      if (k in draft) out[k] = draft[k];
      else delete out[k];
    }
    return out as T;
  }
  return same(draft, base) ? latest : draft;
}
