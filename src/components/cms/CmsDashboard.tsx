import React, { useState, useRef, useEffect } from 'react';
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
  Video,
  KeyRound,
  LogOut,
  Lock,
} from 'lucide-react';
import {
  CoupleData,
  EventDetail,
  VideoConfig,
  BankAccount,
  GalleryPhoto,
  Wish,
  WhatsAppGuest,
} from '../../types';
import { WhatsappBlaster } from './WhatsappBlaster';
import { CoupleEventEditor } from './CoupleEventEditor';
import { VideoEditor } from './VideoEditor';
import { GiftsEditor } from './GiftsEditor';
import { GalleryEditor } from './GalleryEditor';
import { RsvpManager } from './RsvpManager';
import { PasswordManager } from './PasswordManager';

type CmsTabId = 'wa-blaster' | 'couple-event' | 'gallery' | 'video' | 'gifts' | 'rsvp' | 'password';

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
  wishes: Wish[];
  waGuests: WhatsAppGuest[];
  onSaveCoupleAndEvents: (newCouple: CoupleData, newEvents: EventDetail[]) => void;
  onSaveVideoConfig: (newConfig: VideoConfig) => void;
  onSaveBanksAndAddress: (newBanks: BankAccount[], newAddress: string) => void;
  onSavePhotos: (newPhotos: GalleryPhoto[]) => void;
  onUpdateWishes: (newWishes: Wish[]) => void;
  onUpdateWaGuests: (newGuests: WhatsAppGuest[]) => void;
  onSwitchToInvitation: () => void;
  onShowToast: (message: string, type?: 'success' | 'copy') => void;
  onLogout?: () => void;
}

export const CmsDashboard: React.FC<CmsDashboardProps> = ({
  couple,
  events,
  videoConfig,
  banks,
  photos,
  giftAddress,
  wishes,
  waGuests,
  onSaveCoupleAndEvents,
  onSaveVideoConfig,
  onSaveBanksAndAddress,
  onSavePhotos,
  onUpdateWishes,
  onUpdateWaGuests,
  onSwitchToInvitation,
  onShowToast,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<CmsTabId>('wa-blaster');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const tabButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const isLiveStreamEnabled = couple.liveStream?.enabled !== false;

  const handleQuickToggleLiveStream = () => {
    const nextState = !isLiveStreamEnabled;
    const updatedCouple: CoupleData = {
      ...couple,
      liveStream: {
        enabled: nextState,
        platformUrl: couple.liveStream?.platformUrl || 'https://youtube.com/live/argakirana',
        date: couple.liveStream?.date || couple.weddingDate || 'Minggu, 14 Februari 2027',
        time: couple.liveStream?.time || '09:00',
        timezone: couple.liveStream?.timezone || 'WIB',
      },
    };
    onSaveCoupleAndEvents(updatedCouple, events);
    onShowToast(
      nextState
        ? '🟢 Bagian Live Streaming AKTIF (ditampilkan di undangan)'
        : '⚪ Bagian Live Streaming NONAKTIF (disembunyikan dari tamu)',
      'success'
    );
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      setPasswordError('Password tidak boleh kosong.');
      return;
    }
    if (newPassword.trim().length < 4) {
      setPasswordError('Password minimal 4 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('wedding_cms_password', newPassword.trim());
    }
    setIsPasswordModalOpen(false);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    onShowToast('🔒 Kata sandi CMS berhasil diperbarui!', 'success');
  };

  const handleLogout = () => {
    if (confirm('Kunci CMS dan keluar ke halaman undangan?')) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('wedding_cms_authenticated');
        localStorage.removeItem('wedding_cms_authenticated');
      }
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
              onClick={onSwitchToInvitation}
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
            {/* Quick Live Stream Turn On/Off Toggle */}
            <button
              type="button"
              onClick={handleQuickToggleLiveStream}
              className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-[10.5px] sm:text-[11px] font-bold border-2 shadow-[1px_1.5px_0px_#1E293B] active:translate-y-0.5 transition-all cursor-pointer ${
                isLiveStreamEnabled
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-500 hover:bg-emerald-100'
                  : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200'
              }`}
              title="Nyalakan / Matikan bagian Live Streaming di undangan"
            >
              <Video className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Live:</span>
              <span className="font-extrabold">{isLiveStreamEnabled ? 'ON' : 'OFF'}</span>
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
            couple={couple}
            events={events}
            onShowToast={onShowToast}
          />
        )}

        {activeTab === 'couple-event' && (
          <CoupleEventEditor
            couple={couple}
            events={events}
            onSave={onSaveCoupleAndEvents}
            onShowToast={onShowToast}
          />
        )}

        {activeTab === 'gallery' && (
          <GalleryEditor
            photos={photos}
            onSave={onSavePhotos}
            onShowToast={onShowToast}
          />
        )}

        {activeTab === 'video' && (
          <VideoEditor
            videoConfig={videoConfig}
            onSave={onSaveVideoConfig}
            onShowToast={onShowToast}
          />
        )}

        {activeTab === 'gifts' && (
          <GiftsEditor
            banks={banks}
            giftAddress={giftAddress}
            onSave={onSaveBanksAndAddress}
            onShowToast={onShowToast}
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
