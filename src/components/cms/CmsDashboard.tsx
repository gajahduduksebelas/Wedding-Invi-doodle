import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import {
  Send,
  Heart,
  Film,
  Landmark,
  Image as ImageIcon,
  Users,
  Eye,
  Copy,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  X,
  Check,
  ShieldCheck,
  KeyRound,
  LogOut,
  Lock,
  Shirt,
  BookHeart,
  Save,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import {
  CoupleData,
  EventDetail,
  VideoConfig,
  BankAccount,
  GalleryPhoto,
  Wish,
  WhatsAppGuest,
  SaveStatus,
  DressCodeConfig,
  LoveStoryItem,
} from '../../types';
import { WhatsappBlaster } from './WhatsappBlaster';
import { CoupleEventEditor } from './CoupleEventEditor';
import { VideoEditor } from './VideoEditor';
import { GiftsEditor } from './GiftsEditor';
import { GalleryEditor } from './GalleryEditor';
import { RsvpManager } from './RsvpManager';
import { PasswordManager } from './PasswordManager';
import { DressCodeEditor } from './DressCodeEditor';
import { LoveStoryEditor } from './LoveStoryEditor';
import { AdminAccounts } from './AdminAccounts';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { COUPLE_DATA } from '../../data/weddingData';
import { mergeEdit } from '../../lib/settingsSync';

type CmsTabId = 'wa-blaster' | 'couple-event' | 'dresscode' | 'lovestory' | 'gallery' | 'video' | 'gifts' | 'rsvp' | 'password';

interface TabItem {
  id: CmsTabId;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeHighlight?: boolean;
}

interface CmsDashboardProps {
  couple: CoupleData;
  events: EventDetail[];
  videoConfig: VideoConfig;
  banks: BankAccount[];
  photos: GalleryPhoto[];
  giftAddress: string;
  dressCode: DressCodeConfig;
  wishes: Wish[];
  waGuests: WhatsAppGuest[];
  onSaveCoupleAndEvents: (newCouple: CoupleData, newEvents: EventDetail[]) => void;
  onSaveVideoConfig: (newConfig: VideoConfig) => void;
  onSaveBanksAndAddress: (newBanks: BankAccount[], newAddress: string) => void;
  onSavePhotos: (newPhotos: GalleryPhoto[]) => void;
  onSaveDressCode: (config: DressCodeConfig) => void;
  onSaveLoveStory: (stories: LoveStoryItem[]) => void;
  onUpdateWishes: (newWishes: Wish[]) => void;
  onUpdateWaGuests: (newGuests: WhatsAppGuest[]) => void;
  onClaimWaGuest?: (guestId: string, sentAt: string) => Promise<'ok' | 'taken' | 'error'>;
  /** Increases whenever another device's changes were merged in. */
  remoteRevision?: number;
  onSwitchToInvitation: () => void;
  onShowToast: (message: string, type?: 'success' | 'copy') => void;
  onLogout?: () => void;
  saveStatus?: SaveStatus;
  onRequestSave?: () => void;
}

// Tabs whose editors keep a local draft until saved.
type DraftTabId = 'couple-event' | 'dresscode' | 'lovestory' | 'gallery' | 'video' | 'gifts';

const DRAFT_TAB_LABELS: Record<DraftTabId, string> = {
  'couple-event': 'Mempelai & Acara',
  dresscode: 'Dress Code',
  lovestory: 'Love Story',
  gallery: 'Galeri',
  video: 'Video',
  gifts: 'Kado',
};

// Runs onMount once, before the browser paints, each time it (re)mounts.
const EditorShell: React.FC<{ onMount: () => void; children: React.ReactNode }> = ({ onMount, children }) => {
  useLayoutEffect(() => {
    onMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <>{children}</>;
};

export const CmsDashboard: React.FC<CmsDashboardProps> = ({
  couple,
  events,
  videoConfig,
  banks,
  photos,
  giftAddress,
  dressCode,
  wishes,
  waGuests,
  onSaveCoupleAndEvents,
  onSaveVideoConfig,
  onSaveBanksAndAddress,
  onSavePhotos,
  onSaveDressCode,
  onSaveLoveStory,
  onUpdateWishes,
  onUpdateWaGuests,
  onClaimWaGuest,
  remoteRevision = 0,
  onSwitchToInvitation,
  onShowToast,
  onLogout,
  saveStatus = 'idle',
  onRequestSave,
}) => {
  const [activeTab, setActiveTab] = useState<CmsTabId>('wa-blaster');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const tabButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // --- Unsaved edits (autosave + global save) ---
  // Each editor reports its unsaved draft; we keep a "commit" function per
  // tab that pushes that draft into the app state (which the app then saves
  // to the database). Drafts are committed automatically when switching
  // tabs, leaving the CMS or hiding the browser tab, and all at once by the
  // global save button.
  const draftCommitsRef = useRef<Partial<Record<DraftTabId, () => void>>>({});
  const [dirtyTabs, setDirtyTabs] = useState<DraftTabId[]>([]);

  const setDraft = useCallback((tab: DraftTabId, commit: (() => void) | null) => {
    if (commit) draftCommitsRef.current[tab] = commit;
    else delete draftCommitsRef.current[tab];
    setDirtyTabs((prev) => {
      const has = prev.includes(tab);
      if (commit && !has) return [...prev, tab];
      if (!commit && has) return prev.filter((t) => t !== tab);
      return prev;
    });
  }, []);

  // Returns the labels of the tabs that were saved (empty if nothing was dirty).
  const commitDrafts = useCallback((): string[] => {
    const pending = Object.entries(draftCommitsRef.current) as [DraftTabId, () => void][];
    if (pending.length === 0) return [];
    draftCommitsRef.current = {};
    setDirtyTabs([]);
    pending.forEach(([, commit]) => commit());
    return pending.map(([tab]) => DRAFT_TAB_LABELS[tab]);
  }, []);

  // --- Editing at the same time on two devices ---
  // Each editor works on a copy of the data from when it opened (its "base").
  // Saving merges only what the admin changed in that editor onto the latest
  // data (which may already hold the partner's changes), and editors with no
  // unsaved edits reload when the partner's changes arrive.
  const latestRef = useRef({ couple, events, dressCode, videoConfig, banks, giftAddress, photos });
  latestRef.current = { couple, events, dressCode, videoConfig, banks, giftAddress, photos };

  type EditorValue = {
    'couple-event': { couple: CoupleData; events: EventDetail[] };
    dresscode: DressCodeConfig;
    lovestory: LoveStoryItem[];
    gallery: GalleryPhoto[];
    video: VideoConfig;
    gifts: { banks: BankAccount[]; address: string };
  };
  const snapshot = useCallback(<K extends DraftTabId>(tab: K): EditorValue[K] => {
    const l = latestRef.current;
    const values: EditorValue = {
      'couple-event': { couple: l.couple, events: l.events },
      dresscode: l.dressCode,
      lovestory: l.couple.loveStory || [],
      gallery: l.photos,
      video: l.videoConfig,
      gifts: { banks: l.banks, address: l.giftAddress },
    };
    return JSON.parse(JSON.stringify(values[tab]));
  }, []);

  const baseRef = useRef<Partial<{ [K in DraftTabId]: EditorValue[K] }>>({});
  const [editorRev, setEditorRev] = useState<Record<DraftTabId, number>>({
    'couple-event': 0,
    dresscode: 0,
    lovestory: 0,
    gallery: 0,
    video: 0,
    gifts: 0,
  });
  const dirtyTabsRef = useRef(dirtyTabs);
  dirtyTabsRef.current = dirtyTabs;

  // Partner's changes arrived: reload every editor that has nothing unsaved.
  useEffect(() => {
    if (remoteRevision === 0) return;
    setEditorRev((prev) => {
      const next = { ...prev };
      (Object.keys(next) as DraftTabId[]).forEach((tab) => {
        if (!dirtyTabsRef.current.includes(tab)) next[tab] += 1;
      });
      return next;
    });
  }, [remoteRevision]);

  const saveEditor = useCallback(
    <K extends DraftTabId>(tab: K, draft: EditorValue[K]) => {
      const base = baseRef.current[tab] as EditorValue[K] | undefined;
      const latest = snapshot(tab);
      let merged: EditorValue[K] = draft;
      if (base !== undefined) {
        if (tab === 'couple-event') {
          const b = base as EditorValue['couple-event'];
          const d = draft as EditorValue['couple-event'];
          const l = latest as EditorValue['couple-event'];
          merged = { couple: mergeEdit(b.couple, d.couple, l.couple), events: mergeEdit(b.events, d.events, l.events) } as EditorValue[K];
        } else if (tab === 'gifts') {
          const b = base as EditorValue['gifts'];
          const d = draft as EditorValue['gifts'];
          const l = latest as EditorValue['gifts'];
          merged = { banks: mergeEdit(b.banks, d.banks, l.banks), address: mergeEdit(b.address, d.address, l.address) } as EditorValue[K];
        } else {
          merged = mergeEdit(base, draft, latest);
        }
      }

      switch (tab) {
        case 'couple-event': {
          const v = merged as EditorValue['couple-event'];
          onSaveCoupleAndEvents(v.couple, v.events);
          break;
        }
        case 'dresscode':
          onSaveDressCode(merged as EditorValue['dresscode']);
          break;
        case 'lovestory':
          onSaveLoveStory(merged as EditorValue['lovestory']);
          break;
        case 'gallery':
          onSavePhotos(merged as EditorValue['gallery']);
          break;
        case 'video':
          onSaveVideoConfig(merged as EditorValue['video']);
          break;
        case 'gifts': {
          const v = merged as EditorValue['gifts'];
          onSaveBanksAndAddress(v.banks, v.address);
          break;
        }
      }

      if (JSON.stringify(merged) !== JSON.stringify(draft)) {
        // The partner's changes were folded in: reopen the editor on the
        // merged result so it shows them (nothing of ours is lost — it's saved).
        setEditorRev((prev) => ({ ...prev, [tab]: prev[tab] + 1 }));
      } else {
        baseRef.current[tab] = JSON.parse(JSON.stringify(draft));
      }
    },
    [snapshot, onSaveCoupleAndEvents, onSaveDressCode, onSaveLoveStory, onSavePhotos, onSaveVideoConfig, onSaveBanksAndAddress]
  );

  const shellFor = (tab: DraftTabId, editor: React.ReactNode) => (
    <EditorShell
      key={`${tab}:${editorRev[tab]}`}
      onMount={() => {
        baseRef.current[tab] = snapshot(tab) as never;
      }}
    >
      {editor}
    </EditorShell>
  );

  const handleSaveAll = () => {
    const saved = commitDrafts();
    onRequestSave?.();
    onShowToast(
      saved.length > 0 ? `💾 Menyimpan: ${saved.join(', ')}` : '💾 Menyimpan ulang semua data...',
      'success'
    );
  };

  // Autosave when the admin switches to another browser tab / app, closes the
  // laptop lid, etc.
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') commitDrafts();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [commitDrafts]);

  // Warn before closing/reloading while something is still unsaved.
  const hasUnsavedWork = dirtyTabs.length > 0 || saveStatus === 'pending' || saveStatus === 'saving';
  useEffect(() => {
    if (!hasUnsavedWork) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      commitDrafts();
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [hasUnsavedWork, commitDrafts]);

  const handleLeaveToInvitation = () => {
    commitDrafts();
    onSwitchToInvitation();
  };

  const handleSaveNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      setPasswordError('Password tidak boleh kosong.');
      return;
    }
    if (newPassword.trim().length < 6) {
      setPasswordError('Password minimal 6 karakter (persyaratan Supabase Auth).');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setPasswordError('Supabase belum dikonfigurasi — tidak dapat mengubah kata sandi.');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword.trim() });
    if (error) {
      setPasswordError(error.message);
      return;
    }

    setIsPasswordModalOpen(false);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    onShowToast('🔒 Kata sandi CMS berhasil diperbarui!', 'success');
  };

  const handleLogout = () => {
    if (confirm('Kunci CMS dan keluar ke halaman undangan?')) {
      commitDrafts();
      if (onLogout) {
        onLogout();
      } else {
        onSwitchToInvitation();
      }
      onShowToast('🔒 Anda telah keluar dari CMS.', 'success');
    }
  };

  const pendingWaCount = waGuests.filter((g) => g.status === 'pending').length;

  const tabs: TabItem[] = [
    {
      id: 'wa-blaster',
      label: 'WhatsApp Blaster',
      shortLabel: 'WA Blaster',
      description: 'Kirim link undangan personal massal ke WhatsApp tamu',
      icon: Send,
      badge: pendingWaCount > 0 ? `${pendingWaCount} antre` : undefined,
      badgeHighlight: pendingWaCount > 0,
    },
    {
      id: 'couple-event',
      label: 'Mempelai & Acara',
      shortLabel: 'Mempelai',
      description: 'Biodata pasangan, tanggal, akad, resepsi & peta lokasi',
      icon: Heart,
    },
    {
      id: 'dresscode',
      label: 'Dress Code',
      shortLabel: 'Dress Code',
      description: 'Gaya busana & palet warna referensi untuk tamu',
      icon: Shirt,
      badge: dressCode.enabled ? undefined : 'Nonaktif',
    },
    {
      id: 'lovestory',
      label: 'Love Story',
      shortLabel: 'Love Story',
      description: 'Bab-bab kisah cinta yang tampil di timeline undangan',
      icon: BookHeart,
      // Falls back to the built-in chapters the invitation shows when none are saved.
      badge: `${couple.loveStory?.length || COUPLE_DATA.loveStory?.length || 0} bab`,
    },
    {
      id: 'gallery',
      label: 'Galeri Foto',
      shortLabel: 'Galeri',
      description: 'Album foto kenangan, prewedding & love story',
      icon: ImageIcon,
      badge: `${photos.length}`,
    },
    {
      id: 'video',
      label: 'Video Prewedding',
      shortLabel: 'Video',
      description: 'YouTube embed & pengaturan video cinematic pengantin',
      icon: Film,
    },
    {
      id: 'gifts',
      label: 'Rekening & Kado',
      shortLabel: 'Kado & Bank',
      description: 'Nomor rekening amplop digital & alamat kirim kado fisik',
      icon: Landmark,
      badge: `${banks.length}`,
    },
    {
      id: 'rsvp',
      label: 'Buku Tamu & RSVP',
      shortLabel: 'RSVP & Doa',
      description: 'Pesan ucapan doa restu tamu & konfirmasi kehadiran',
      icon: Users,
      badge: `${wishes.length}`,
    },
    {
      id: 'password',
      label: 'Keamanan & Kata Sandi',
      shortLabel: 'Kata Sandi',
      description: 'Ubah password akses CMS dan instruksi URL tersembunyi /#cms',
      icon: KeyRound,
      badge: 'Bawaan: admin123',
    },
  ];

  const currentTabIndex = tabs.findIndex((t) => t.id === activeTab);
  const currentTab = tabs[currentTabIndex] || tabs[0];

  const handlePrevTab = () => {
    if (currentTabIndex > 0) {
      handleSelectTab(tabs[currentTabIndex - 1].id);
    }
  };

  const handleNextTab = () => {
    if (currentTabIndex < tabs.length - 1) {
      handleSelectTab(tabs[currentTabIndex + 1].id);
    }
  };

  const handleSelectTab = (tabId: CmsTabId) => {
    if (tabId !== activeTab) {
      const saved = commitDrafts();
      if (saved.length > 0) {
        onShowToast(`✅ Perubahan ${saved.join(', ')} disimpan otomatis`, 'success');
      }
    }
    setActiveTab(tabId);
    setIsMobileDrawerOpen(false);
    // Smooth scroll the tab button into center view
    setTimeout(() => {
      const btn = tabButtonRefs.current[tabId];
      if (btn) {
        btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }, 50);
  };

  // Scroll active tab into view on initial mount
  useEffect(() => {
    const btn = tabButtonRefs.current[activeTab];
    if (btn) {
      btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, []);

  const handleCopyCmsLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}${window.location.pathname}#cms`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).catch(() => {});
      }
      onShowToast('Tautan URL rahasia /#cms disalin! Simpan tautan ini untuk membuka admin.', 'copy');
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F9FF] text-[#1E293B] flex flex-col font-sans relative selection:bg-[#FEF9C3] selection:text-[#0284C7]">
      {/* 1. Mobile-Friendly Header Section */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-[#1E293B] shadow-xs px-3 sm:px-4 py-2.5">
        <div className="max-w-[1040px] mx-auto flex items-center justify-between gap-2">
          {/* Left: Branding & Back to Preview */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={handleLeaveToInvitation}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#1E293B] text-[11px] sm:text-[12px] font-bold border-2 border-[#1E293B] shadow-[1px_1.5px_0px_#1E293B] active:translate-y-0.5 transition-all cursor-pointer shrink-0"
              title="Kembali ke tampilan undangan tamu"
            >
              <Eye className="w-3.5 h-3.5 text-[#00AEE0]" />
              <span className="hidden xs:inline">Lihat Undangan</span>
              <span className="xs:hidden">Undangan</span>
            </button>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-[14px] sm:text-[17px] font-bold text-[#00AEE0] font-heading truncate">
                  {couple.groom.nickname} &amp; {couple.bride.nickname}
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-[#FEF9C3] text-[#D97706] text-[9px] font-bold border border-[#FED636] shrink-0">
                  CMS
                </span>
              </div>
              <span className="text-[10px] text-[#64748B] truncate hidden sm:block">
                Pengaturan Undangan &amp; WhatsApp Blaster
              </span>
            </div>
          </div>

          {/* Right: Quick Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Global Save: commits every tab's unsaved edits and shows the
                database save status */}
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={saveStatus === 'saving' && dirtyTabs.length === 0}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[10.5px] sm:text-[11.5px] font-bold border-2 border-[#1E293B] shadow-[1px_1.5px_0px_#1E293B] active:translate-y-0.5 transition-all cursor-pointer disabled:cursor-wait ${
                dirtyTabs.length > 0
                  ? 'bg-[#cc3a63] text-white hover:bg-[#b52d53]'
                  : saveStatus === 'error'
                  ? 'bg-red-50 text-red-700 hover:bg-red-100'
                  : saveStatus === 'pending' || saveStatus === 'saving'
                  ? 'bg-[#FEF9C3] text-[#92400E]'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
              title="Simpan semua perubahan di semua tab"
            >
              {dirtyTabs.length > 0 ? (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>
                    Simpan<span className="hidden sm:inline"> Semua</span> ({dirtyTabs.length})
                  </span>
                </>
              ) : saveStatus === 'pending' || saveStatus === 'saving' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan…</span>
                </>
              ) : saveStatus === 'error' ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>
                    Gagal<span className="hidden sm:inline"> · Coba Lagi</span>
                  </span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Tersimpan</span>
                </>
              )}
            </button>

            {/* Change Password Tab Button */}
            <button
              type="button"
              onClick={() => handleSelectTab('password')}
              className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-[10.5px] sm:text-[11px] font-bold border-2 border-[#1E293B] shadow-[1px_1.5px_0px_#1E293B] active:translate-y-0.5 transition-all cursor-pointer ${
                activeTab === 'password'
                  ? 'bg-[#FED636] text-[#1E293B]'
                  : 'bg-white hover:bg-[#F0F9FF] text-[#1E293B]'
              }`}
              title="Kelola kata sandi akses CMS"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#00AEE0]" />
              <span className="hidden lg:inline">Password</span>
            </button>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-white hover:bg-red-50 hover:text-red-700 text-[#1E293B] text-[10.5px] sm:text-[11px] font-bold border-2 border-[#1E293B] shadow-[1px_1.5px_0px_#1E293B] active:translate-y-0.5 transition-all cursor-pointer"
              title="Kunci dan keluar dari CMS"
            >
              <LogOut className="w-3.5 h-3.5 text-red-600" />
              <span className="hidden sm:inline">Keluar</span>
            </button>

            {/* Copy CMS Link Button */}
            <button
              type="button"
              onClick={handleCopyCmsLink}
              className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#F0F9FF] text-[#1E293B] text-[11px] font-bold border-2 border-[#1E293B] shadow-[1px_1.5px_0px_#1E293B] active:translate-y-0.5 transition-all cursor-pointer"
              title="Salin tautan URL rahasia CMS (/#cms)"
            >
              <Copy className="w-3.5 h-3.5 text-[#00AEE0]" />
              <span>Salin /#cms</span>
            </button>

            {/* Menu Drawer Toggle on Mobile */}
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="sm:hidden inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#00AEE0] text-white text-[11px] font-bold border-2 border-[#1E293B] shadow-[1px_1.5px_0px_#1E293B] active:translate-y-0.5 transition-all cursor-pointer"
              title="Buka daftar menu lengkap CMS"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Mobile Quick Switch Strip */}
      <div className="sm:hidden bg-[#F0F9FF] border-b border-[#BAE6FD] px-3 py-1.5 flex items-center justify-between gap-2 z-30">
        {/* Prev Tab Arrow */}
        <button
          type="button"
          onClick={handlePrevTab}
          disabled={currentTabIndex === 0}
          className={`p-1.5 rounded-lg border border-[#1E293B]/30 flex items-center justify-center min-w-[36px] min-h-[36px] transition-all ${
            currentTabIndex === 0
              ? 'opacity-30 cursor-not-allowed bg-transparent'
              : 'bg-white hover:bg-[#F0F9FF] shadow-xs cursor-pointer active:scale-95'
          }`}
          title="Ke menu sebelumnya"
        >
          <ChevronLeft className="w-4 h-4 text-[#1E293B]" />
        </button>

        {/* Center: Current Module Indicator Button */}
        <button
          type="button"
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex-1 py-1.5 px-3 rounded-xl bg-white border border-[#BAE6FD] shadow-xs flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[#F0F9FF] transition-colors min-h-[36px]"
        >
          <currentTab.icon className="w-3.5 h-3.5 text-[#00AEE0] shrink-0" />
          <span className="text-[12px] font-bold text-[#1E293B] truncate">
            {currentTab.label}
          </span>
          {currentTab.badge && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold shrink-0 ${
                currentTab.badgeHighlight
                  ? 'bg-[#00AEE0] text-white'
                  : 'bg-[#FEF9C3] text-[#D97706]'
              }`}
            >
              {currentTab.badge}
            </span>
          )}
          <ChevronDown className="w-3.5 h-3.5 text-[#64748B] ml-0.5 shrink-0" />
        </button>

        {/* Next Tab Arrow */}
        <button
          type="button"
          onClick={handleNextTab}
          disabled={currentTabIndex === tabs.length - 1}
          className={`p-1.5 rounded-lg border border-[#1E293B]/30 flex items-center justify-center min-w-[36px] min-h-[36px] transition-all ${
            currentTabIndex === tabs.length - 1
              ? 'opacity-30 cursor-not-allowed bg-transparent'
              : 'bg-white hover:bg-[#F0F9FF] shadow-xs cursor-pointer active:scale-95'
          }`}
          title="Ke menu berikutnya"
        >
          <ChevronRight className="w-4 h-4 text-[#1E293B]" />
        </button>
      </div>

      {/* 3. Smooth Auto-Centering Pill Tabs Bar */}
      <nav className="bg-white border-b-2 border-[#1E293B] px-2 sm:px-4 py-2 sticky top-[88px] sm:top-[56px] z-20 shadow-xs relative">
        {/* Subtle left & right gradient scroll indicators */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-white to-transparent z-10 sm:hidden" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-l from-white to-transparent z-10 sm:hidden" />

        <div className="max-w-[1040px] mx-auto flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-0.5 px-1 scroll-smooth">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabButtonRefs.current[tab.id] = el;
                }}
                type="button"
                onClick={() => handleSelectTab(tab.id)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-[11.5px] sm:text-[12px] font-bold border-2 transition-all cursor-pointer min-h-[42px] touch-manipulation ${
                  isActive
                    ? 'bg-[#00AEE0] text-white border-[#1E293B] shadow-[2px_2px_0px_#1E293B] scale-[1.02]'
                    : 'bg-[#F0F9FF] hover:bg-white text-[#1E293B] border-[#BAE6FD] active:scale-95'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#64748B]'}`} />
                <span className="whitespace-nowrap">{tab.label}</span>
                {dirtyTabs.includes(tab.id as DraftTabId) && (
                  <span
                    className="w-2 h-2 rounded-full bg-[#cc3a63] ring-2 ring-white"
                    title="Ada perubahan yang belum disimpan"
                    aria-label="belum disimpan"
                  />
                )}
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold whitespace-nowrap ${
                      isActive
                        ? 'bg-white text-[#00AEE0]'
                        : tab.badgeHighlight
                        ? 'bg-[#00AEE0] text-white'
                        : 'bg-[#FEF9C3] text-[#D97706]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 4. Main Content Area */}
      <main className="flex-1 p-3 sm:p-6 pb-28 sm:pb-12 max-w-[1040px] w-full mx-auto">
        {activeTab === 'wa-blaster' && (
          <WhatsappBlaster
            guests={waGuests}
            onUpdateGuests={onUpdateWaGuests}
            onClaimGuest={onClaimWaGuest}
            couple={couple}
            events={events}
            onShowToast={onShowToast}
          />
        )}

        {activeTab === 'couple-event' &&
          shellFor(
            'couple-event',
            <CoupleEventEditor
              couple={couple}
              events={events}
              onSave={(c, e) => saveEditor('couple-event', { couple: c, events: e })}
              onShowToast={onShowToast}
              onDraftChange={(draft) =>
                setDraft('couple-event', draft && (() => saveEditor('couple-event', { couple: draft.couple, events: draft.events })))
              }
            />
          )}

        {activeTab === 'dresscode' &&
          shellFor(
            'dresscode',
            <DressCodeEditor
              dressCode={dressCode}
              onSave={(v) => saveEditor('dresscode', v)}
              onShowToast={onShowToast}
              onDraftChange={(draft) => setDraft('dresscode', draft && (() => saveEditor('dresscode', draft)))}
            />
          )}

        {activeTab === 'lovestory' &&
          shellFor(
            'lovestory',
            <LoveStoryEditor
              stories={couple.loveStory || []}
              onSave={(v) => saveEditor('lovestory', v)}
              onShowToast={onShowToast}
              onDraftChange={(draft) => setDraft('lovestory', draft && (() => saveEditor('lovestory', draft)))}
            />
          )}

        {activeTab === 'gallery' &&
          shellFor(
            'gallery',
            <GalleryEditor
              photos={photos}
              onSave={(v) => saveEditor('gallery', v)}
              onShowToast={onShowToast}
              onDraftChange={(draft) => setDraft('gallery', draft && (() => saveEditor('gallery', draft)))}
            />
          )}

        {activeTab === 'video' &&
          shellFor(
            'video',
            <VideoEditor
              videoConfig={videoConfig}
              onSave={(v) => saveEditor('video', v)}
              onShowToast={onShowToast}
              onDraftChange={(draft) => setDraft('video', draft && (() => saveEditor('video', draft)))}
            />
          )}

        {activeTab === 'gifts' &&
          shellFor(
            'gifts',
            <GiftsEditor
              banks={banks}
              giftAddress={giftAddress}
              onSave={(b, a) => saveEditor('gifts', { banks: b, address: a })}
              onShowToast={onShowToast}
              onDraftChange={(draft) =>
                setDraft('gifts', draft && (() => saveEditor('gifts', { banks: draft.banks, address: draft.address })))
              }
            />
          )}

        {activeTab === 'rsvp' && (
          <RsvpManager
            wishes={wishes}
            onUpdateWishes={onUpdateWishes}
            onShowToast={onShowToast}
          />
        )}

        {activeTab === 'password' && (
          <div className="max-w-[800px] mx-auto mb-6">
            <AdminAccounts onShowToast={onShowToast} />
          </div>
        )}

        {activeTab === 'password' && (
          <PasswordManager
            onShowToast={onShowToast}
            onLogout={onLogout}
            onSwitchToInvitation={onSwitchToInvitation}
          />
        )}
      </main>

      {/* 5. Mobile Fixed Bottom Navigation Dock (1-thumb fast switching) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-[#1E293B] shadow-[0_-3px_12px_rgba(30,41,59,0.08)] px-2 py-1.5">
        <div className="flex items-center justify-around max-w-[460px] mx-auto">
          {/* Item 1: WA Blaster */}
          <button
            type="button"
            onClick={() => handleSelectTab('wa-blaster')}
            className={`flex flex-col items-center justify-center w-14 h-12 rounded-lg transition-all relative ${
              activeTab === 'wa-blaster'
                ? 'text-[#00AEE0] font-bold scale-105'
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            <Send className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 tracking-tight">Blaster</span>
            {pendingWaCount > 0 && (
              <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-[#00AEE0] ring-1 ring-white" />
            )}
          </button>

          {/* Item 2: Mempelai */}
          <button
            type="button"
            onClick={() => handleSelectTab('couple-event')}
            className={`flex flex-col items-center justify-center w-14 h-12 rounded-lg transition-all ${
              activeTab === 'couple-event'
                ? 'text-[#00AEE0] font-bold scale-105'
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 tracking-tight">Mempelai</span>
          </button>

          {/* Item 3: Galeri */}
          <button
            type="button"
            onClick={() => handleSelectTab('gallery')}
            className={`flex flex-col items-center justify-center w-14 h-12 rounded-lg transition-all ${
              activeTab === 'gallery'
                ? 'text-[#00AEE0] font-bold scale-105'
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 tracking-tight">Galeri</span>
          </button>

          {/* Item 4: RSVP */}
          <button
            type="button"
            onClick={() => handleSelectTab('rsvp')}
            className={`flex flex-col items-center justify-center w-14 h-12 rounded-lg transition-all ${
              activeTab === 'rsvp'
                ? 'text-[#00AEE0] font-bold scale-105'
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 tracking-tight">RSVP</span>
          </button>

          {/* Item 5: Password / Keamanan */}
          <button
            type="button"
            onClick={() => handleSelectTab('password')}
            className={`flex flex-col items-center justify-center w-14 h-12 rounded-lg transition-all ${
              activeTab === 'password'
                ? 'text-[#00AEE0] font-bold scale-105'
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 tracking-tight">Password</span>
          </button>

          {/* Item 6: Semua Menu */}
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="flex flex-col items-center justify-center w-14 h-12 rounded-lg text-[#1E293B] hover:text-[#00AEE0] transition-all"
          >
            <LayoutGrid className="w-4 h-4 text-[#00AEE0]" />
            <span className="text-[10px] mt-0.5 font-bold tracking-tight">Semua</span>
          </button>
        </div>
      </div>

      {/* 6. Mobile Navigation Drawer / Modal (All Modules at a glance) */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          <div className="relative w-full max-w-[500px] bg-white rounded-t-3xl sm:rounded-2xl border-t-2 sm:border-2 border-[#1E293B] shadow-2xl p-4 sm:p-5 max-h-[85vh] flex flex-col z-10 animate-in slide-in-from-bottom duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#BAE6FD]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#00AEE0]/10 flex items-center justify-center text-[#00AEE0] border border-[#BAE6FD]">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#1E293B]">
                    Pilih Menu CMS
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    Pilih bagian yang ingin dikelola
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#1E293B] hover:bg-[#E0F2FE] cursor-pointer"
                title="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Secret URL Card Notice */}
            <div className="mt-3 p-2.5 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 min-w-0">
                <ShieldCheck className="w-4 h-4 text-[#00AEE0] shrink-0" />
                <span className="text-[#1E293B] truncate font-medium">
                  Akses URL rahasia: <strong>/#cms</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyCmsLink}
                className="px-2 py-1 rounded-lg bg-white text-[#0284C7] font-bold border border-[#BAE6FD] shadow-xs hover:bg-[#F0F9FF] shrink-0 cursor-pointer text-[10px]"
              >
                Salin
              </button>
            </div>

            {/* Menu Items List */}
            <div className="mt-3 overflow-y-auto space-y-2 max-h-[50vh] pr-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleSelectTab(tab.id)}
                    className={`w-full p-3 rounded-xl border-2 text-left flex items-center justify-between gap-3 transition-all cursor-pointer min-h-[56px] ${
                      isActive
                        ? 'bg-[#00AEE0] text-white border-[#1E293B] shadow-[2px_2px_0px_#1E293B]'
                        : 'bg-[#F0F9FF] hover:bg-white text-[#1E293B] border-[#BAE6FD]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-white text-[#00AEE0] border border-[#BAE6FD]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[13px] font-bold leading-tight truncate">
                          {tab.label}
                        </span>
                        <span
                          className={`text-[11px] leading-tight truncate mt-0.5 ${
                            isActive ? 'text-white/80' : 'text-[#64748B]'
                          }`}
                        >
                          {tab.description}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {tab.badge && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isActive
                              ? 'bg-white text-[#00AEE0]'
                              : tab.badgeHighlight
                              ? 'bg-[#00AEE0] text-white'
                              : 'bg-[#FEF9C3] text-[#D97706]'
                          }`}
                        >
                          {tab.badge}
                        </span>
                      )}
                      {isActive && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions in Modal */}
            <div className="mt-3 pt-3 border-t border-[#BAE6FD] flex items-center gap-2">
              <button
                type="button"
                onClick={onSwitchToInvitation}
                className="flex-1 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-white text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Eye className="w-4 h-4 text-[#BAE6FD]" />
                <span>Lihat Undangan Tamu</span>
              </button>
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-white border border-[#1E293B] text-[#1E293B] text-[12px] font-bold hover:bg-[#F0F9FF] cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6.5. Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-2 border-[#1E293B] shadow-[4px_6px_0px_#1E293B] max-w-[400px] w-full p-5 sm:p-6 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#BAE6FD]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E0F2FE] text-[#00AEE0] flex items-center justify-center border border-[#BAE6FD]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#1E293B] font-heading">
                    Ganti Kata Sandi CMS
                  </h3>
                  <span className="text-[11px] text-[#64748B] block">
                    Kunci akses aman untuk halaman admin
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setPasswordError('');
                }}
                className="p-1 rounded-lg hover:bg-gray-100 text-[#64748B] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewPassword} className="mt-4 flex flex-col gap-3.5">
              <div>
                <label className="text-[11px] font-bold text-[#64748B] uppercase block mb-1">
                  Kata Sandi Baru
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  placeholder="Minimal 4 karakter..."
                  autoFocus
                  className="w-full px-3 py-2 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] text-[13px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#00AEE0]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#64748B] uppercase block mb-1">
                  Ulangi Kata Sandi Baru
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  placeholder="Ketik ulang password..."
                  className="w-full px-3 py-2 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] text-[13px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#00AEE0]"
                />
              </div>

              {passwordError && (
                <p className="text-[11.5px] text-red-600 font-semibold">{passwordError}</p>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordModalOpen(false);
                    setPasswordError('');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#1E293B] text-[12px] font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#00AEE0] hover:bg-[#0298D4] text-white text-[12px] font-bold shadow-[2px_2px_0px_#1E293B] border-2 border-[#1E293B] active:translate-y-0.5 cursor-pointer"
                >
                  Simpan Kata Sandi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Footer */}
      <footer className="bg-white border-t-2 border-[#1E293B] py-4 px-4 text-center text-[12px] text-[#64748B]">
        <div className="max-w-[1040px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Panel CMS Pengantin • <strong>{couple.groom.nickname} &amp; {couple.bride.nickname}</strong>
          </span>
          <button
            type="button"
            onClick={onSwitchToInvitation}
            className="text-[#00AEE0] font-bold hover:underline cursor-pointer"
          >
            ← Kembali ke Halaman Undangan Tamu
          </button>
        </div>
      </footer>
    </div>
  );
};
