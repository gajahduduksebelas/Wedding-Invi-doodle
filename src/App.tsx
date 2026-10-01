import React, { useState, useEffect } from 'react';
import { HeroSection } from './components/HeroSection';
import { AnnouncementSection } from './components/AnnouncementSection';
import { QuoteSection } from './components/QuoteSection';
import { CoupleSection } from './components/CoupleSection';
import { CountdownAndEvents } from './components/CountdownAndEvents';
import { LoveStorySection } from './components/LoveStorySection';
import { GallerySection } from './components/GallerySection';
import { LiveStreamSection } from './components/LiveStreamSection';
import { GiftSection } from './components/GiftSection';
import { RsvpSection } from './components/RsvpSection';
import { ClosingSection } from './components/ClosingSection';
import { DressCodeSection } from './components/DressCodeSection';
import { useSectionMotion } from './lib/useSectionMotion';
import { SettingsShape, buildPatch, applyPatch, mergeRemote, cloneSettings } from './lib/settingsSync';
import { EnvelopeOpening } from './components/EnvelopeOpening';
import { BottomNavigation } from './components/BottomNavigation';
import { AudioPlayer, startBackgroundMusicFromGesture } from './components/AudioPlayer';
import { Toast } from './components/Toast';
import { CmsDashboard } from './components/cms/CmsDashboard';
import { CmsAuthGate } from './components/cms/CmsAuthGate';
import {
  COUPLE_DATA,
  EVENTS_DATA,
  BANK_ACCOUNTS,
  GALLERY_PHOTOS,
  INITIAL_WISHES,
  DEFAULT_VIDEO_CONFIG,
  DEFAULT_GIFT_ADDRESS,
  DEFAULT_DRESS_CODE,
} from './data/weddingData';
import { INITIAL_WA_GUESTS } from './data/whatsappData';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';
import { uploadInlineMedia } from './lib/mediaUpload';
import { isUuid, newUuid, readCache, writeCache } from './lib/utils';
import {
  Wish,
  VideoConfig,
  CoupleData,
  EventDetail,
  BankAccount,
  GalleryPhoto,
  WhatsAppGuest,
  SaveStatus,
  DressCodeConfig,
} from './types';

export default function App() {
  // Current view: 'invitation' or 'cms'
  const [currentView, setCurrentView] = useState<'invitation' | 'cms'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page') || params.get('view');
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (
        page === 'cms' ||
        params.has('cms') ||
        hash === '#cms' ||
        path.endsWith('/cms')
      ) {
        return 'cms';
      }
    }
    return 'invitation';
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isEnvelopeOpening, setIsEnvelopeOpening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const handleEnvelopeDone = React.useCallback(() => setIsEnvelopeOpening(false), []);
  const [activeTab, setActiveTab] = useState('invite');
  const wasPlayingBeforeVideoRef = React.useRef(false);
  const isVideoActiveRef = React.useRef(false);
  const isPlayingRef = React.useRef(false);

  // Sync isPlayingRef with isPlaying
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);
  const [toast, setToast] = useState<{
    message: string;
    isVisible: boolean;
    type?: 'success' | 'music' | 'pause' | 'copy';
  }>({
    message: '',
    isVisible: false,
    type: 'success',
  });

  // Each slice starts from the localStorage cache (if any), then falls back
  // to the defaults; Supabase data replaces it once loaded (see below).
  const [couple, setCouple] = useState<CoupleData>(() => readCache('ahmad_siti_couple', COUPLE_DATA));
  const [events, setEvents] = useState<EventDetail[]>(() => readCache('ahmad_siti_events', EVENTS_DATA));
  const [videoConfig, setVideoConfig] = useState<VideoConfig>(() =>
    readCache('ahmad_siti_video_config', DEFAULT_VIDEO_CONFIG)
  );
  const [banks, setBanks] = useState<BankAccount[]>(() => readCache('ahmad_siti_banks', BANK_ACCOUNTS));
  const [giftAddress, setGiftAddress] = useState<string>(() =>
    readCache('ahmad_siti_gift_address', DEFAULT_GIFT_ADDRESS, false)
  );
  const [photos, setPhotos] = useState<GalleryPhoto[]>(() => readCache('ahmad_siti_photos', GALLERY_PHOTOS));
  const [dressCode, setDressCode] = useState<DressCodeConfig>(() =>
    readCache('ahmad_siti_dress_code', DEFAULT_DRESS_CODE)
  );
  const [wishes, setWishes] = useState<Wish[]>(() => readCache('ahmad_siti_wishes', INITIAL_WISHES));
  const [waGuests, setWaGuests] = useState<WhatsAppGuest[]>(() =>
    readCache('ahmad_siti_wa_guests', INITIAL_WA_GUESTS)
  );

  // Tracks whether initial data has loaded from Supabase (or we've confirmed
  // we're in local-only mode), so we don't overwrite the database with
  // default/empty state before the real data has arrived.
  const [isDataReady, setIsDataReady] = useState(!isSupabaseConfigured);

  // CMS auth state — backed by a real Supabase session, not a client-side
  // password check. If Supabase isn't configured, the CMS is inaccessible
  // rather than falling open, since there is no way to gate it securely.
  const [isCmsAuthenticated, setIsCmsAuthenticated] = useState(false);
  const [isCheckingCmsAuth, setIsCheckingCmsAuth] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsCheckingCmsAuth(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setIsCmsAuthenticated(!!data.session);
      setIsCheckingCmsAuth(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsCmsAuthenticated(!!session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Guest name initialization for recipient (from URL query param or default)
  const [guestName] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const toParam = params.get('to') || params.get('u') || params.get('guest');
      // URLSearchParams already decodes %xx and '+'; decoding again would
      // throw (and blank the page) on names containing a literal '%'.
      if (toParam) return toParam;
    }
    // Opened without a personal link.
    return 'Tamu Undangan';
  });

  // Dynamic document title based on bride and groom name
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const groomNick = couple.groom.nickname || 'Rendra';
      const brideNick = couple.bride.nickname || 'Naya';
      document.title = `${brideNick} & ${groomNick} — Undangan Pernikahan`;
    }
  }, [couple.groom.nickname, couple.bride.nickname]);

  // --- Loading from Supabase ---
  // Fetches the shared settings row + wishes so every visitor sees the same
  // CMS-edited content and RSVP list, instead of only their own browser's copy.

  // The settings as last loaded from / saved to / received from Supabase. The
  // save effect sends only what differs from it, so loading data (or a guest's
  // browser re-rendering it) never writes back, and two admins editing at the
  // same time only send their own changes (see lib/settingsSync).
  const lastSyncedSettingsRef = React.useRef<SettingsShape | null>(null);
  // Bumped when another device's changes are merged in, so CMS editors
  // without unsaved edits reload them.
  const [remoteRevision, setRemoteRevision] = useState(0);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  // Bumped by the CMS "save all" button to retry a failed save right away.
  const [saveRequest, setSaveRequest] = useState(0);

  const mapWaGuestRow = (g: any): WhatsAppGuest => ({
    id: g.id,
    name: g.name,
    phone: g.phone,
    category: g.category,
    session: g.session,
    status: g.status,
    sentAt: g.sent_at ?? undefined,
    notes: g.notes ?? undefined,
  });

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    let cancelled = false;

    (async () => {
      const [settingsRes, wishRes] = await Promise.all([
        supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
        supabase.from('wishes').select('*').order('created_at', { ascending: false }),
      ]);

      if (cancelled) return;

      if (settingsRes.error) console.error('[supabase] failed to load settings', settingsRes.error);
      if (wishRes.error) console.error('[supabase] failed to load wishes', wishRes.error);

      const settingsRow = settingsRes.data;
      if (settingsRow) {
        const loaded = {
          couple: settingsRow.couple && Object.keys(settingsRow.couple).length > 0 ? settingsRow.couple : couple,
          events: settingsRow.events?.length > 0 ? settingsRow.events : events,
          banks: settingsRow.banks?.length > 0 ? settingsRow.banks : banks,
          photos: settingsRow.photos?.length > 0 ? settingsRow.photos : photos,
          video_config:
            settingsRow.video_config && Object.keys(settingsRow.video_config).length > 0
              ? settingsRow.video_config
              : videoConfig,
          gift_address: settingsRow.gift_address || giftAddress,
          dress_code:
            settingsRow.dress_code && Object.keys(settingsRow.dress_code).length > 0
              ? settingsRow.dress_code
              : dressCode,
        };
        setCouple(loaded.couple);
        setEvents(loaded.events);
        setBanks(loaded.banks);
        setPhotos(loaded.photos);
        setVideoConfig(loaded.video_config);
        setGiftAddress(loaded.gift_address);
        setDressCode(loaded.dress_code);
        // Only mark as synced when the row actually held real content; an
        // empty seeded row should get populated by the first admin session.
        const rowHasContent = settingsRow.couple && Object.keys(settingsRow.couple).length > 0;
        if (rowHasContent) lastSyncedSettingsRef.current = cloneSettings(loaded as SettingsShape);
      }
      if (wishRes.data) {
        setWishes(
          wishRes.data.map((w: any) => ({
            id: w.id,
            name: w.name,
            status: w.status,
            guestCount: w.guest_count,
            message: w.message,
            createdAt: w.created_at,
          }))
        );
      }

      setIsDataReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // The WA guest list is admin-only under RLS, so it can only be read once the
  // admin session exists — including when they log in after the page loaded.
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase || !isCmsAuthenticated) return;
    let cancelled = false;
    supabase
      .from('wa_guests')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error('[supabase] failed to load wa_guests', error);
          return;
        }
        // An empty table on first use keeps the local list; it is written to
        // the database on the admin's first edit.
        if (data && data.length > 0) setWaGuests(data.map(mapWaGuestRow));
      });
    return () => {
      cancelled = true;
    };
  }, [isCmsAuthenticated]);

  // --- Live updates between admin devices ---
  // While logged in to the CMS, changes saved on another device (settings,
  // WhatsApp contacts, new wishes) are merged in within a second or two.
  const latestSettingsRef = React.useRef<SettingsShape | null>(null);
  latestSettingsRef.current = {
    couple,
    events,
    banks,
    photos,
    video_config: videoConfig,
    gift_address: giftAddress,
    dress_code: dressCode,
  } as unknown as SettingsShape;

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase || !isCmsAuthenticated) return;
    const client = supabase;

    const applyRemoteSettings = (row: Record<string, unknown>) => {
      const local = latestSettingsRef.current;
      if (!local || !lastSyncedSettingsRef.current) return;
      const remote = {} as SettingsShape;
      for (const key of ['couple', 'events', 'banks', 'photos', 'video_config', 'gift_address', 'dress_code'] as const) {
        (remote as unknown as Record<string, unknown>)[key] = row[key];
      }
      const { next, synced, changed } = mergeRemote(local, lastSyncedSettingsRef.current, remote);
      lastSyncedSettingsRef.current = synced;
      if (changed.length === 0) return;
      if (changed.includes('couple')) setCouple(next.couple as unknown as CoupleData);
      if (changed.includes('events')) setEvents(next.events as EventDetail[]);
      if (changed.includes('banks')) setBanks(next.banks as BankAccount[]);
      if (changed.includes('photos')) setPhotos(next.photos as GalleryPhoto[]);
      if (changed.includes('video_config')) setVideoConfig(next.video_config as unknown as VideoConfig);
      if (changed.includes('gift_address')) setGiftAddress(next.gift_address);
      if (changed.includes('dress_code')) setDressCode(next.dress_code as unknown as DressCodeConfig);
      setRemoteRevision((n) => n + 1);
    };

    const mapWish = (w: any): Wish => ({
      id: w.id,
      name: w.name,
      status: w.status,
      guestCount: w.guest_count,
      message: w.message,
      createdAt: w.created_at,
    });

    const channel = client
      .channel('cms-live-sync')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'site_settings' }, (payload) =>
        applyRemoteSettings(payload.new as Record<string, unknown>)
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wa_guests' }, (payload) => {
        if (payload.eventType === 'DELETE') {
          const id = (payload.old as { id?: string }).id;
          if (id) setWaGuests((cur) => cur.filter((g) => g.id !== id));
          return;
        }
        const row = mapWaGuestRow(payload.new);
        setWaGuests((cur) => {
          const i = cur.findIndex((g) => g.id === row.id);
          if (i === -1) return [row, ...cur];
          if (JSON.stringify(cur[i]) === JSON.stringify(row)) return cur;
          const next = [...cur];
          next[i] = row;
          return next;
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wishes' }, (payload) => {
        if (payload.eventType === 'DELETE') {
          const id = (payload.old as { id?: string }).id;
          if (id) setWishes((cur) => cur.filter((w) => w.id !== id));
          return;
        }
        if (payload.eventType === 'INSERT') {
          const wish = mapWish(payload.new);
          setWishes((cur) => (cur.some((w) => w.id === wish.id) ? cur : [wish, ...cur]));
        }
      })
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [isCmsAuthenticated]);

  // --- Settings persistence ---
  // Mirror every change to localStorage (offline cache / local-only mode) and,
  // for a logged-in admin, save the settings row to Supabase. Saves are
  // debounced so typing in the CMS doesn't fire one request per keystroke, and
  // done in a single effect so each write carries the latest value of every
  // field. Guests never write here (RLS would reject it anyway).
  useEffect(() => {
    writeCache('ahmad_siti_couple', couple);
    writeCache('ahmad_siti_events', events);
    writeCache('ahmad_siti_video_config', videoConfig);
    writeCache('ahmad_siti_banks', banks);
    writeCache('ahmad_siti_gift_address', giftAddress);
    writeCache('ahmad_siti_photos', photos);
    writeCache('ahmad_siti_dress_code', dressCode);

    if (!isSupabaseConfigured || !supabase || !isDataReady || !isCmsAuthenticated) return;

    const settings = {
      couple,
      events,
      banks,
      photos,
      video_config: videoConfig,
      gift_address: giftAddress,
      dress_code: dressCode,
    };
    if (!buildPatch(settings as unknown as SettingsShape, lastSyncedSettingsRef.current)) {
      // An edit that was undone before its save ran is already in sync.
      setSaveStatus((status) => (status === 'pending' ? 'saved' : status));
      return;
    }

    setSaveStatus('pending');
    let cancelled = false;
    const timer = setTimeout(async () => {
      setSaveStatus('saving');
      let toSave = settings;
      try {
        toSave = await uploadInlineMedia(settings);
      } catch (err) {
        console.error('[supabase] media upload failed', err);
        if (!cancelled) setSaveStatus('error');
        showToast('⚠️ Gagal mengunggah media ke server. Coba lagi.', 'pause');
        return;
      }
      if (cancelled) return;

      if (toSave !== settings) {
        // Swap uploaded data: URLs for their Storage URLs; this re-runs the
        // effect, which then saves the lightweight version.
        setCouple(toSave.couple);
        setEvents(toSave.events);
        setBanks(toSave.banks);
        setPhotos(toSave.photos);
        setVideoConfig(toSave.video_config);
        setGiftAddress(toSave.gift_address);
        setDressCode(toSave.dress_code);
        return;
      }

      // Send only what changed since the last sync; the database merges it
      // into the row, so a partner's concurrent edits elsewhere are kept.
      const current = settings as unknown as SettingsShape;
      const patch = buildPatch(current, lastSyncedSettingsRef.current);
      if (!patch) {
        if (!cancelled) setSaveStatus('saved');
        return;
      }
      const { error } = lastSyncedSettingsRef.current
        ? await supabase!.rpc('patch_site_settings', { patch })
        : // Nothing loaded yet (empty seeded row): write everything once.
          await supabase!.from('site_settings').upsert({ id: 1, ...settings, updated_at: new Date().toISOString() });
      if (error) {
        console.error('[supabase] failed to save settings', error);
        if (!cancelled) setSaveStatus('error');
        showToast('⚠️ Gagal menyimpan perubahan ke server.', 'pause');
        return;
      }
      lastSyncedSettingsRef.current = applyPatch(lastSyncedSettingsRef.current, patch) ?? cloneSettings(current);
      if (!cancelled) setSaveStatus('saved');
    }, 700);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [couple, events, videoConfig, banks, giftAddress, photos, dressCode, isDataReady, isCmsAuthenticated, saveRequest]);

  // Wishes and wa_guests are NOT written here — they live in their own
  // Supabase tables and are written directly at the point of change
  // (handleAddWish for guest RSVPs, CMS handlers for admin edits/deletes),
  // since batch-overwriting a table from local state doesn't scale and would
  // clobber other guests' concurrent RSVP submissions.
  useEffect(() => {
    writeCache('ahmad_siti_wishes', wishes);
  }, [wishes]);

  useEffect(() => {
    writeCache('ahmad_siti_wa_guests', waGuests);
  }, [waGuests]);

  const showToast = (
    message: string,
    type: 'success' | 'music' | 'pause' | 'copy' = 'success'
  ) => {
    setToast({ message, isVisible: true, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, isVisible: false }));
    }, 2600);
  };

  const handleToggleMusic = () => {
    if (isPlaying) {
      setIsPlaying(false);
      wasPlayingBeforeVideoRef.current = false;
      showToast('⏸️ Musik Dijeda', 'pause');
    } else {
      startBackgroundMusicFromGesture();
      setIsPlaying(true);
      wasPlayingBeforeVideoRef.current = true;
      showToast('🎵 Memutar Musik', 'music');
    }
  };

  // Autoplay video and pause music in Gallery section, resume when scrolling to other sections
  const handleVideoActiveChange = (isVideoActive: boolean) => {
    isVideoActiveRef.current = isVideoActive;
    if (isVideoActive) {
      if (isPlayingRef.current) {
        wasPlayingBeforeVideoRef.current = true;
        setIsPlaying(false);
        showToast('🎬 Memutar Video (Musik Dijeda)', 'pause');
      }
    } else {
      // User scrolled away to another section
      if (wasPlayingBeforeVideoRef.current) {
        setIsPlaying(true);
        wasPlayingBeforeVideoRef.current = false;
        showToast('🎵 Melanjutkan Musik', 'music');
      }
    }
  };

  const handleOpenInvitation = () => {
    startBackgroundMusicFromGesture();
    // The envelope animation covers the screen while the invitation renders
    // underneath; guests who prefer reduced motion go straight in.
    const reduceMotion =
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) setIsEnvelopeOpening(true);
    setIsOpened(true);
    wasPlayingBeforeVideoRef.current = true;
    if (!isPlaying) {
      setIsPlaying(true);
      showToast('🎵 Memutar Musik', 'music');
    }
    setTimeout(() => {
      const homeElement = document.getElementById('home');
      if (homeElement) {
        // Jump while hidden behind the envelope; glide when there is none.
        homeElement.scrollIntoView({ behavior: reduceMotion ? 'smooth' : 'instant' });
      }
    }, 60);
  };

  // Returns whether the wish was saved, so the RSVP form can report failures.
  const handleAddWish = async (newWish: Wish): Promise<boolean> => {
    // Optimistic UI update first
    setWishes((prev) => [newWish, ...prev]);

    if (!isSupabaseConfigured || !supabase) return true;

    // newWish.id is a temporary local id used only as a React key — the
    // wishes table's id column is a uuid generated by Postgres. Read the real
    // id back so the admin can delete this wish without reloading.
    const { data, error } = await supabase
      .from('wishes')
      .insert({
        name: newWish.name,
        status: newWish.status,
        guest_count: newWish.guestCount ?? 1,
        message: newWish.message,
      })
      .select('id, created_at')
      .single();

    if (error || !data) {
      console.error('[supabase] failed to save wish', error);
      setWishes((prev) => prev.filter((w) => w.id !== newWish.id));
      return false;
    }

    setWishes((prev) =>
      prev.map((w) => (w.id === newWish.id ? { ...w, id: data.id, createdAt: data.created_at } : w))
    );
    return true;
  };

  // CMS deletes/resets the wishes list by passing a new filtered array —
  // diff against current state and mirror deletions to Supabase.
  const handleUpdateWishes = async (newWishes: Wish[]) => {
    if (isSupabaseConfigured && supabase) {
      // Only rows that exist in the database can be deleted there; the reset
      // button's sample wishes (non-uuid ids) are shown locally only.
      const removedIds = wishes
        .filter((w) => !newWishes.some((nw) => nw.id === w.id))
        .map((w) => w.id)
        .filter(isUuid);
      if (removedIds.length > 0) {
        const { error } = await supabase.from('wishes').delete().in('id', removedIds);
        if (error) {
          console.error('[supabase] failed to delete wishes', error);
          showToast('⚠️ Gagal menghapus ucapan dari server.', 'pause');
          return;
        }
      }
    }
    setWishes(newWishes);
  };

  // WA guest list: only the contacts that actually changed are written (and
  // only removed ones deleted), and the change is applied on top of the latest
  // list, so two admins editing or blasting at the same time on different
  // devices never undo each other's work. Ids created in the browser (sample
  // data, the add form, CSV import) aren't uuids, so they get one first.
  const handleUpdateWaGuests = async (newGuests: WhatsAppGuest[]) => {
    const normalized = newGuests.map((g) => (isUuid(g.id) ? g : { ...g, id: newUuid() }));
    const previous = waGuests;
    const prevById = new Map(previous.map((g) => [g.id, g]));
    const changed = normalized.filter((g) => {
      const before = prevById.get(g.id);
      return !before || JSON.stringify(before) !== JSON.stringify(g);
    });
    const nextIds = new Set(normalized.map((g) => g.id));
    const removedIds = previous.map((g) => g.id).filter((id) => !nextIds.has(id));

    setWaGuests((cur) => {
      const changedById = new Map(changed.map((g) => [g.id, g]));
      const removed = new Set(removedIds);
      const kept = cur.filter((g) => !removed.has(g.id)).map((g) => changedById.get(g.id) ?? g);
      const curIds = new Set(cur.map((g) => g.id));
      const added = changed.filter((g) => !curIds.has(g.id));
      return [...added, ...kept];
    });

    if (!isSupabaseConfigured || !supabase) return;

    const dbRemoved = removedIds.filter(isUuid);
    if (dbRemoved.length > 0) {
      const { error } = await supabase.from('wa_guests').delete().in('id', dbRemoved);
      if (error) {
        console.error('[supabase] failed to delete wa_guests', error);
        showToast('⚠️ Gagal menghapus tamu dari server.', 'pause');
      }
    }

    if (changed.length > 0) {
      const { error } = await supabase.from('wa_guests').upsert(
        changed.map((g) => ({
          id: g.id,
          name: g.name,
          phone: g.phone,
          category: g.category,
          session: g.session,
          status: g.status,
          sent_at: g.sentAt ?? null,
          notes: g.notes ?? null,
        }))
      );
      if (error) {
        console.error('[supabase] failed to save wa_guests', error);
        showToast('⚠️ Gagal menyimpan daftar tamu ke server.', 'pause');
      }
    }
  };

  // Marks a guest as sent only if nobody else has (another device may be
  // blasting the same list). Returns false when the guest was already taken.
  const handleClaimWaGuest = async (guestId: string, sentAt: string): Promise<'ok' | 'taken' | 'error'> => {
    const markLocal = () =>
      setWaGuests((cur) => cur.map((g) => (g.id === guestId ? { ...g, status: 'sent', sentAt } : g)));
    if (!isSupabaseConfigured || !supabase || !isUuid(guestId)) {
      markLocal();
      return 'ok';
    }
    const { data, error } = await supabase
      .from('wa_guests')
      .update({ status: 'sent', sent_at: sentAt })
      .eq('id', guestId)
      .eq('status', 'pending')
      .select('id');
    if (error) {
      console.error('[supabase] failed to claim wa_guest', error);
      return 'error';
    }
    if (!data || data.length === 0) return 'taken';
    markLocal();
    return 'ok';
  };

  // Typing on a phone. The keyboard shrinks the visible screen, and every
  // section is sized to "one screen", so while a field has focus we:
  //  - freeze the screen height (--app-h) so sections keep their layout,
  //  - turn off section snapping and hide the fixed bottom bars,
  //  - keep the focused field above the keyboard,
  //  - close the keyboard if the guest scrolls away from the field,
  // and afterwards undo any page shift the phone made and snap back to the
  // nearest section.
  useEffect(() => {
    if (currentView !== 'invitation') return;
    const container = document.getElementById('invitationScrollContainer');
    if (!container) return;
    const root = document.documentElement;

    const isTextField = (el: EventTarget | null): el is HTMLElement =>
      el instanceof HTMLTextAreaElement ||
      (el instanceof HTMLInputElement && !['checkbox', 'radio', 'button', 'submit', 'range'].includes(el.type));

    const focusedField = () => {
      const el = document.activeElement;
      return isTextField(el) && container.contains(el) ? el : null;
    };

    const visibleArea = () => {
      const vv = window.visualViewport;
      return {
        top: (vv?.offsetTop ?? 0) + 16,
        bottom: (vv ? vv.offsetTop + vv.height : window.innerHeight) - 16,
      };
    };

    let adjusting = false;
    const keepVisible = () => {
      const el = focusedField();
      if (!el) return;
      const { top, bottom } = visibleArea();
      const rect = el.getBoundingClientRect();
      let delta = 0;
      if (rect.bottom > bottom) delta = rect.bottom - bottom + 24;
      else if (rect.top < top) delta = rect.top - top - 24;
      if (delta !== 0) {
        adjusting = true;
        container.scrollBy({ top: delta, behavior: 'smooth' });
        window.setTimeout(() => (adjusting = false), 450);
      }
    };

    // Scrolling well away from the field means the guest is done typing:
    // close the keyboard so the rest of the invitation shows normally.
    const onContainerScroll = () => {
      if (adjusting) return;
      const el = focusedField();
      if (!el) return;
      const { top, bottom } = visibleArea();
      const rect = el.getBoundingClientRect();
      if (rect.bottom < top || rect.top > bottom) el.blur();
    };

    const endTyping = () => {
      // Wait for the keyboard to close before measuring anything.
      window.setTimeout(() => {
        // Undo the page shift the phone made for the keyboard (iOS scrolls
        // the whole page up) and unfreeze the screen height.
        window.scrollTo(0, 0);
        root.style.removeProperty('--app-h');

        // Land on the section the guest scrolled to. This must happen while
        // snapping is still off: turning snapping back on makes the browser
        // jump to the section it was snapped to before typing (the RSVP
        // form), not the one on screen now.
        const containerTop = container.getBoundingClientRect().top;
        let nearestTop = 0;
        let best = Infinity;
        container.querySelectorAll<HTMLElement>('.mobile-snap-section').forEach((section) => {
          const offset = section.getBoundingClientRect().top - containerTop;
          if (Math.abs(offset) < best) {
            best = Math.abs(offset);
            nearestTop = offset;
          }
        });
        if (best < container.clientHeight / 2) {
          container.scrollTo({ top: container.scrollTop + nearestTop, behavior: 'instant' });
        }

        // Snapping and the bottom bars come back on the next frame, once
        // the position above has been applied.
        requestAnimationFrame(() => setIsTyping(false));
      }, 350);
    };

    let blurTimer: number | undefined;
    const onFocusIn = (e: FocusEvent) => {
      if (!isTextField(e.target)) return;
      window.clearTimeout(blurTimer);
      // Freeze the height before the keyboard starts shrinking the screen.
      if (!root.style.getPropertyValue('--app-h')) {
        root.style.setProperty('--app-h', `${container.clientHeight}px`);
      }
      setIsTyping(true);
      // Wait for the keyboard to finish sliding up before measuring.
      window.setTimeout(keepVisible, 350);
    };
    const onFocusOut = (e: FocusEvent) => {
      if (!isTextField(e.target)) return;
      // Moving between fields fires focusout then focusin; don't flicker.
      blurTimer = window.setTimeout(() => {
        if (!focusedField()) endTyping();
      }, 120);
    };

    container.addEventListener('focusin', onFocusIn);
    container.addEventListener('focusout', onFocusOut);
    container.addEventListener('scroll', onContainerScroll, { passive: true });
    window.visualViewport?.addEventListener('resize', keepVisible);
    return () => {
      window.clearTimeout(blurTimer);
      container.removeEventListener('focusin', onFocusIn);
      container.removeEventListener('focusout', onFocusOut);
      container.removeEventListener('scroll', onContainerScroll);
      window.visualViewport?.removeEventListener('resize', keepVisible);
      root.style.removeProperty('--app-h');
    };
  }, [currentView]);

  // Scroll-driven entrances and doodle parallax, rebuilt whenever the set of
  // sections changes (opening the invitation, toggling dress code / stream).
  // Held back while the envelope plays so Home's entrance is actually seen.
  useSectionMotion('invitationScrollContainer', currentView === 'invitation' && !isEnvelopeOpening, [
    isOpened,
    dressCode.enabled,
    couple.liveStream?.enabled,
  ]);

  // Observe active section for bottom navigation tab sync
  useEffect(() => {
    if (currentView !== 'invitation') return;

    const scrollContainer = document.getElementById('invitationScrollContainer');

    const handleScroll = () => {
      // Section tops in scroll-container coordinates. offsetTop can't be used
      // directly: it is relative to the nearest positioned ancestor, not the
      // scroll container, so it drifts from the real scroll position.
      const containerTop = scrollContainer ? scrollContainer.getBoundingClientRect().top : 0;
      const scrollTop = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
      const scrollPos = scrollTop + 260;
      const topOf = (id: string) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top - containerTop + scrollTop : Infinity;
      };

      // Checked bottom-up in page order (… gallery, stream, gift, rsvp,
      // closing): the first section already scrolled past wins. #stream has
      // no tab of its own and stays under "Galeri".
      const tabBySection: [string, string][] = [
        ['rsvp', 'rsvp'],
        ['gift', 'gift'],
        ['gallery', 'gallery'],
        ['story', 'story'],
        ['save-date', 'acara'],
        ['mempelai', 'mempelai'],
      ];
      const match = tabBySection.find(([sectionId]) => scrollPos >= topOf(sectionId));
      setActiveTab(match ? match[1] : 'home');
    };

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [currentView, isOpened]);

  // Switch view handlers
  const handleSwitchToCms = () => {
    setCurrentView('cms');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const url = new URL(window.location.href);
      url.searchParams.set('page', 'cms');
      window.history.pushState({}, '', url);
    }
  };

  const handleSwitchToInvitation = () => {
    setCurrentView('invitation');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const url = new URL(window.location.href);
      url.searchParams.delete('page');
      url.searchParams.delete('view');
      url.searchParams.delete('cms');
      if (url.hash.toLowerCase() === '#cms') {
        url.hash = '';
      }
      window.history.pushState({}, '', url);
    }
  };

  // Listen to popstate or hashchange for back/forward and direct hash navigation
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page') || params.get('view');
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      const isCms =
        page === 'cms' ||
        params.has('cms') ||
        hash === '#cms' ||
        path.endsWith('/cms');
      setCurrentView(isCms ? 'cms' : 'invitation');
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // If viewing CMS Dashboard
  if (currentView === 'cms') {
    if (isCheckingCmsAuth) {
      return (
        <div className="min-h-screen bg-[#F0F9FF] flex items-center justify-center text-[#64748B] text-sm">
          Memeriksa sesi admin...
        </div>
      );
    }

    if (!isCmsAuthenticated) {
      return (
        <div className="min-h-screen bg-[#fff7eb]">
          <Toast message={toast.message} isVisible={toast.isVisible} type={toast.type} />
          <CmsAuthGate
            onSuccess={() => setIsCmsAuthenticated(true)}
            onBackToInvitation={handleSwitchToInvitation}
            onShowToast={showToast}
          />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#fff7eb]">
        <Toast message={toast.message} isVisible={toast.isVisible} type={toast.type} />
        <CmsDashboard
          couple={couple}
          events={events}
          videoConfig={videoConfig}
          banks={banks}
          photos={photos}
          giftAddress={giftAddress}
          dressCode={dressCode}
          wishes={wishes}
          waGuests={waGuests}
          onSaveCoupleAndEvents={(newCouple, newEvents) => {
            // Love Story has its own tab: keep whatever it last saved so an
            // older copy carried in this editor's draft can't overwrite it.
            setCouple((prev) => ({ ...newCouple, loveStory: prev.loveStory }));
            setEvents(newEvents);
          }}
          onSaveLoveStory={(stories) => setCouple((prev) => ({ ...prev, loveStory: stories }))}
          onSaveVideoConfig={(newConfig) => setVideoConfig(newConfig)}
          onSaveBanksAndAddress={(newBanks, newAddress) => {
            setBanks(newBanks);
            setGiftAddress(newAddress);
          }}
          onSavePhotos={(newPhotos) => setPhotos(newPhotos)}
          onSaveDressCode={(newDressCode) => setDressCode(newDressCode)}
          onUpdateWishes={handleUpdateWishes}
          onUpdateWaGuests={handleUpdateWaGuests}
          onClaimWaGuest={handleClaimWaGuest}
          remoteRevision={remoteRevision}
          onSwitchToInvitation={handleSwitchToInvitation}
          onShowToast={showToast}
          saveStatus={saveStatus}
          onRequestSave={() => setSaveRequest((n) => n + 1)}
          onLogout={async () => {
            if (isSupabaseConfigured && supabase) await supabase.auth.signOut();
            setIsCmsAuthenticated(false);
            handleSwitchToInvitation();
          }}
        />
      </div>
    );
  }

  // Otherwise, render the romantic, doodle-styled wedding invitation for invitees
  return (
    <div className="h-[var(--app-h,100dvh)] w-full bg-[#FAF7EE] text-[#181818] overflow-hidden flex flex-col items-center relative selection:bg-[#FBE8E6] selection:text-[#B4533C]">
      {/* Toast Alert */}
      <Toast message={toast.message} isVisible={toast.isVisible} type={toast.type} />

      {isEnvelopeOpening && (
        <EnvelopeOpening
          groomName={couple.groom.nickname || 'Rendra'}
          brideName={couple.bride.nickname || 'Naya'}
          onDone={handleEnvelopeDone}
        />
      )}

      {/* Floating Audio Mini-FAB */}
      <AudioPlayer
        audioUrl={couple.audioUrl || COUPLE_DATA.audioUrl}
        isPlaying={isPlaying}
        onToggle={handleToggleMusic}
        visibleButton={isOpened && !isTyping}
      />

      {/* 1 Scroll Each Section Container (Mobile Snap Container) */}
      <div
        id="invitationScrollContainer"
        className={`w-full h-full overflow-y-auto mobile-snap-container flex flex-col items-center ${
          isTyping ? 'is-typing' : ''
        }`}
      >
        {/* Cover / Hero Gate */}
        <HeroSection
          guestName={guestName}
          onOpenInvitation={handleOpenInvitation}
          couple={couple}
          isOpened={isOpened}
        />

        {/* Invitation Sections - rendered seamlessly once opened */}
        {isOpened && (
          <div className="w-full max-w-[460px] flex flex-col items-center">
            {/* 2. Hand-Drawn Locket Announcement: "KAMI AKAN MENIKAH!" */}
            <AnnouncementSection
              onScrollNext={() => {
                document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' });
              }}
              couple={couple}
            />

            {/* 3. Quranic Blessing Greeting (#quote) */}
            <QuoteSection />

            {/* 4. The Happy Couple (#mempelai) */}
            <CoupleSection couple={couple} />

            {/* 5. Save The Date & Detail Acara (#save-date, #acara) */}
            <CountdownAndEvents couple={couple} events={events} />

            {/* 5b. Dress Code (#dresscode) — hidden when turned off in the CMS */}
            {dressCode.enabled && <DressCodeSection config={dressCode} />}

            {/* 6. Love Story Timeline (#story) */}
            <LoveStorySection stories={couple.loveStory} />

            {/* 7. Gallery & Video (#gallery) */}
            <GallerySection
              photos={photos}
              video={videoConfig}
              onVideoActiveChange={handleVideoActiveChange}
            />

            {/* 8. Live Streaming (#stream) — hidden when turned off in the CMS */}
            {couple.liveStream?.enabled !== false && <LiveStreamSection config={couple.liveStream} />}

            {/* 9. Amplop Digital & Kado (#gift) */}
            <GiftSection
              onShowToast={showToast}
              banks={banks}
              giftAddress={giftAddress}
            />

            {/* 10. RSVP & Doa Restu (#rsvp, #wishes) */}
            <RsvpSection
              wishes={wishes}
              onAddWish={handleAddWish}
              onShowToast={(msg) => showToast(msg, 'success')}
            />

            {/* 11. Closing Thanks & Footer (#closing) */}
            <ClosingSection couple={couple} />
          </div>
        )}
      </div>

      {/* Fixed Bottom Navigation Bar */}
      {isOpened && !isTyping && (
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId)}
        />
      )}
    </div>
  );
}
