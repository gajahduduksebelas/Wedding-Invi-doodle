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
  const [guestName, setGuestName] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const toParam = params.get('to') || params.get('u') || params.get('guest');
      // URLSearchParams already decodes %xx and '+'; decoding again would
      // throw (and blank the page) on names containing a literal '%'.
      if (toParam) return toParam;
    }
    return 'Budi Santoso & Partner';
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

  // JSON of the settings as last loaded from / saved to Supabase. The save
  // effect compares against it so loading data (or a guest's browser
  // re-rendering it) never triggers a write back to the database.
  const lastSyncedSettingsRef = React.useRef<string | null>(null);
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
        if (rowHasContent) lastSyncedSettingsRef.current = JSON.stringify(loaded);
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
    if (JSON.stringify(settings) === lastSyncedSettingsRef.current) {
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

      const { error } = await supabase!.from('site_settings').upsert({
        id: 1,
        ...settings,
        updated_at: new Date().toISOString(),
      });
      if (error) {
        console.error('[supabase] failed to save settings', error);
        if (!cancelled) setSaveStatus('error');
        showToast('⚠️ Gagal menyimpan perubahan ke server.', 'pause');
        return;
      }
      lastSyncedSettingsRef.current = JSON.stringify(settings);
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

  // WA guest list: diff against the current list, delete removed rows and
  // upsert the rest. Ids created in the browser (sample data, the add form,
  // CSV import) aren't uuids, so they get one before being stored.
  const handleUpdateWaGuests = async (newGuests: WhatsAppGuest[]) => {
    const normalized = newGuests.map((g) => (isUuid(g.id) ? g : { ...g, id: newUuid() }));
    const previous = waGuests;
    setWaGuests(normalized);

    if (!isSupabaseConfigured || !supabase) return;

    const removedIds = previous
      .map((g) => g.id)
      .filter((id) => isUuid(id) && !normalized.some((g) => g.id === id));
    if (removedIds.length > 0) {
      const { error } = await supabase.from('wa_guests').delete().in('id', removedIds);
      if (error) {
        console.error('[supabase] failed to delete wa_guests', error);
        showToast('⚠️ Gagal menghapus tamu dari server.', 'pause');
      }
    }

    if (normalized.length > 0) {
      const { error } = await supabase.from('wa_guests').upsert(
        normalized.map((g) => ({
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

  // Typing on a phone: keep the focused field above the keyboard, turn off
  // section snapping and hide the fixed bottom bar while the keyboard is up.
  useEffect(() => {
    if (currentView !== 'invitation') return;
    const container = document.getElementById('invitationScrollContainer');
    if (!container) return;

    const isTextField = (el: EventTarget | null): el is HTMLElement =>
      el instanceof HTMLTextAreaElement ||
      (el instanceof HTMLInputElement && !['checkbox', 'radio', 'button', 'submit', 'range'].includes(el.type));

    const keepVisible = () => {
      const el = document.activeElement;
      if (!isTextField(el) || !container.contains(el)) return;
      const vv = window.visualViewport;
      const visibleTop = (vv?.offsetTop ?? 0) + 16;
      const visibleBottom = (vv ? vv.offsetTop + vv.height : window.innerHeight) - 16;
      const rect = el.getBoundingClientRect();
      if (rect.bottom > visibleBottom) {
        container.scrollBy({ top: rect.bottom - visibleBottom + 24, behavior: 'smooth' });
      } else if (rect.top < visibleTop) {
        container.scrollBy({ top: rect.top - visibleTop - 24, behavior: 'smooth' });
      }
    };

    let blurTimer: number | undefined;
    const onFocusIn = (e: FocusEvent) => {
      if (!isTextField(e.target)) return;
      window.clearTimeout(blurTimer);
      setIsTyping(true);
      // Wait for the keyboard to finish sliding up before measuring.
      window.setTimeout(keepVisible, 350);
    };
    const onFocusOut = (e: FocusEvent) => {
      if (!isTextField(e.target)) return;
      // Moving between fields fires focusout then focusin; don't flicker.
      blurTimer = window.setTimeout(() => {
        if (!isTextField(document.activeElement)) setIsTyping(false);
      }, 120);
    };

    container.addEventListener('focusin', onFocusIn);
    container.addEventListener('focusout', onFocusOut);
    window.visualViewport?.addEventListener('resize', keepVisible);
    return () => {
      window.clearTimeout(blurTimer);
      container.removeEventListener('focusin', onFocusIn);
      container.removeEventListener('focusout', onFocusOut);
      window.visualViewport?.removeEventListener('resize', keepVisible);
    };
  }, [currentView]);

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
            setCouple(newCouple);
            setEvents(newEvents);
          }}
          onSaveVideoConfig={(newConfig) => setVideoConfig(newConfig)}
          onSaveBanksAndAddress={(newBanks, newAddress) => {
            setBanks(newBanks);
            setGiftAddress(newAddress);
          }}
          onSavePhotos={(newPhotos) => setPhotos(newPhotos)}
          onSaveDressCode={(newDressCode) => setDressCode(newDressCode)}
          onUpdateWishes={handleUpdateWishes}
          onUpdateWaGuests={handleUpdateWaGuests}
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
    <div className="h-dvh w-full bg-[#FAF7EE] text-[#181818] overflow-hidden flex flex-col items-center relative selection:bg-[#FBE8E6] selection:text-[#B4533C]">
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
          onUpdateGuestName={setGuestName}
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
              guestName={guestName}
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
