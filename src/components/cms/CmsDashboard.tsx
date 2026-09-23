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

type CmsTabId = 'wa-blaster' | 'couple-event' | 'gallery' | 'video' | 'gifts' | 'rsvp';

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
}) => {
  const [activeTab, setActiveTab] = useState<CmsTabId>('wa-blaster');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const tabButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

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
      const url = `${window.location.origin}${window.location.pathname}?page=cms`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).catch(() => {});
      }
      onShowToast('Tautan URL khusus CMS disalin! Simpan tautan ini untuk membuka admin.', 'copy');
    }
  };

  return (
    <div className="min-h-screen bg-[#fff7eb] text-[#2b2620] flex flex-col font-sans relative">
      {/* 1. Mobile-Friendly Header Section */}
      <header className="sticky top-0 z-40 bg-[#fffdfa]/95 backdrop-blur-md border-b-2 border-[#4a4238] shadow-xs px-3 sm:px-4 py-2.5">
        <div className="max-w-[1040px] mx-auto flex items-center justify-between gap-2">
          {/* Left: Branding & Back to Preview */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={onSwitchToInvitation}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#f9f0e0] hover:bg-[#edd9bf] text-[#2b2620] text-[11px] sm:text-[12px] font-bold border border-[#4a4238] shadow-[1px_1.5px_0px_#4a4238] active:translate-y-0.5 transition-all cursor-pointer shrink-0"
              title="Kembali ke tampilan undangan tamu"
            >
              <Eye className="w-3.5 h-3.5 text-[#cc3a63]" />
              <span className="hidden xs:inline">Lihat Undangan</span>
              <span className="xs:hidden">Undangan</span>
            </button>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-[14px] sm:text-[17px] font-bold text-[#cc3a63] font-heading truncate">
                  {couple.groom.nickname} &amp; {couple.bride.nickname}
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-[#f0f3e3] text-[#51582f] text-[9px] font-bold border border-[#a2ab73]/50 shrink-0">
                  CMS
                </span>
              </div>
              <span className="text-[10px] text-[#7a7065] truncate hidden sm:block">
                Pengaturan Undangan &amp; WhatsApp Blaster
              </span>
            </div>
          </div>

          {/* Right: Quick Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Copy CMS Link Button */}
            <button
              type="button"
              onClick={handleCopyCmsLink}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white hover:bg-[#f9f0e0] text-[#2b2620] text-[11px] font-bold border border-[#4a4238] shadow-[1px_1.5px_0px_#4a4238] active:translate-y-0.5 transition-all cursor-pointer"
              title="Salin tautan URL rahasia CMS (?page=cms)"
            >
              <Copy className="w-3.5 h-3.5 text-[#a2ab73]" />
              <span className="hidden md:inline">Salin Link CMS</span>
              <span className="md:hidden text-[10px]">Salin URL</span>
            </button>

            {/* Menu Drawer Toggle on Mobile */}
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="sm:hidden inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#cc3a63] text-white text-[11px] font-bold border border-[#4a4238] shadow-[1px_1.5px_0px_#4a4238] active:translate-y-0.5 transition-all cursor-pointer"
              title="Buka daftar menu lengkap CMS"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Mobile Quick Section Switcher Bar (Alternative smooth navigation on mobile) */}
      <div className="sm:hidden bg-[#f3e9d8] border-b border-[#4a4238] px-2 py-1.5 flex items-center justify-between gap-1 shadow-xs sticky top-[51px] z-30">
        {/* Prev Tab Arrow */}
        <button
          type="button"
          onClick={handlePrevTab}
          disabled={currentTabIndex === 0}
          className={`p-1.5 rounded-lg border border-[#4a4238]/30 flex items-center justify-center min-w-[36px] min-h-[36px] transition-all ${
            currentTabIndex === 0
              ? 'opacity-30 cursor-not-allowed bg-transparent'
              : 'bg-white hover:bg-[#fff7eb] shadow-xs cursor-pointer active:scale-95'
          }`}
          title="Ke menu sebelumnya"
        >
          <ChevronLeft className="w-4 h-4 text-[#4a4238]" />
        </button>

        {/* Center Active Tab Trigger Button */}
        <button
          type="button"
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#4a4238] shadow-[1px_1.5px_0px_#4a4238] min-h-[36px] cursor-pointer active:translate-y-0.5 transition-all text-left truncate"
        >
          <currentTab.icon className="w-4 h-4 text-[#cc3a63] shrink-0" />
          <span className="text-[12px] font-bold text-[#2b2620] truncate">
            {currentTab.label}
          </span>
          {currentTab.badge && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold shrink-0 ${
                currentTab.badgeHighlight
                  ? 'bg-[#cc3a63] text-white'
                  : 'bg-[#f0f3e3] text-[#51582f]'
              }`}
            >
              {currentTab.badge}
            </span>
          )}
          <ChevronDown className="w-3.5 h-3.5 text-[#7a7065] ml-0.5 shrink-0" />
        </button>

        {/* Next Tab Arrow */}
        <button
          type="button"
          onClick={handleNextTab}
          disabled={currentTabIndex === tabs.length - 1}
          className={`p-1.5 rounded-lg border border-[#4a4238]/30 flex items-center justify-center min-w-[36px] min-h-[36px] transition-all ${
            currentTabIndex === tabs.length - 1
              ? 'opacity-30 cursor-not-allowed bg-transparent'
              : 'bg-white hover:bg-[#fff7eb] shadow-xs cursor-pointer active:scale-95'
          }`}
          title="Ke menu berikutnya"
        >
          <ChevronRight className="w-4 h-4 text-[#4a4238]" />
        </button>
      </div>

      {/* 3. Smooth Auto-Centering Pill Tabs Bar */}
      <nav className="bg-[#f9f0e0] border-b border-[#4a4238] px-2 sm:px-4 py-2 sticky top-[88px] sm:top-[56px] z-20 shadow-xs relative">
        {/* Subtle left & right gradient scroll indicators */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-[#f9f0e0] to-transparent z-10 sm:hidden" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-l from-[#f9f0e0] to-transparent z-10 sm:hidden" />

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
                className={`shrink-0 inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-[11.5px] sm:text-[12px] font-bold border transition-all cursor-pointer min-h-[42px] touch-manipulation ${
                  isActive
                    ? 'bg-[#cc3a63] text-white border-[#4a4238] shadow-[2px_2px_0px_#4a4238] scale-[1.02]'
                    : 'bg-white hover:bg-[#fff7eb] text-[#2b2620] border-[#d8c8b4] active:scale-95'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#7a7065]'}`} />
                <span className="whitespace-nowrap">{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold whitespace-nowrap ${
                      isActive
                        ? 'bg-white text-[#cc3a63]'
                        : tab.badgeHighlight
                        ? 'bg-[#cc3a63] text-white'
                        : 'bg-[#f0f3e3] text-[#51582f]'
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
      </main>

      {/* 5. Mobile Fixed Bottom Navigation Dock (1-thumb fast switching) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fffdfa]/95 backdrop-blur-md border-t-2 border-[#4a4238] shadow-[0_-3px_12px_rgba(74,66,56,0.08)] px-2 py-1.5">
        <div className="flex items-center justify-around max-w-[460px] mx-auto">
          {/* Item 1: WA Blaster */}
          <button
            type="button"
            onClick={() => handleSelectTab('wa-blaster')}
            className={`flex flex-col items-center justify-center w-14 h-12 rounded-lg transition-all relative ${
              activeTab === 'wa-blaster'
                ? 'text-[#cc3a63] font-bold scale-105'
                : 'text-[#7a7065] hover:text-[#2b2620]'
            }`}
          >
            <Send className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 tracking-tight">Blaster</span>
            {pendingWaCount > 0 && (
              <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-[#cc3a63] ring-1 ring-white" />
            )}
          </button>

          {/* Item 2: Mempelai */}
          <button
            type="button"
            onClick={() => handleSelectTab('couple-event')}
            className={`flex flex-col items-center justify-center w-14 h-12 rounded-lg transition-all ${
              activeTab === 'couple-event'
                ? 'text-[#cc3a63] font-bold scale-105'
                : 'text-[#7a7065] hover:text-[#2b2620]'
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
                ? 'text-[#cc3a63] font-bold scale-105'
                : 'text-[#7a7065] hover:text-[#2b2620]'
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
                ? 'text-[#cc3a63] font-bold scale-105'
                : 'text-[#7a7065] hover:text-[#2b2620]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 tracking-tight">RSVP</span>
          </button>

          {/* Item 5: Semua Menu */}
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="flex flex-col items-center justify-center w-14 h-12 rounded-lg text-[#2b2620] hover:text-[#cc3a63] transition-all"
          >
            <LayoutGrid className="w-4 h-4 text-[#a2ab73]" />
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

          <div className="relative w-full max-w-[500px] bg-[#fffdfa] rounded-t-3xl sm:rounded-2xl border-t-2 sm:border-2 border-[#4a4238] shadow-2xl p-4 sm:p-5 max-h-[85vh] flex flex-col z-10 animate-in slide-in-from-bottom duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#e6dac5]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#cc3a63]/10 flex items-center justify-center text-[#cc3a63] border border-[#cc3a63]/30">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#2b2620]">
                    Pilih Menu CMS
                  </h3>
                  <p className="text-[11px] text-[#7a7065]">
                    Pilih bagian yang ingin dikelola
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f9f0e0] border border-[#d8c8b4] flex items-center justify-center text-[#2b2620] hover:bg-[#edd9bf] cursor-pointer"
                title="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Secret URL Card Notice */}
            <div className="mt-3 p-2.5 rounded-xl bg-[#f0f3e3] border border-[#a2ab73] flex items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 min-w-0">
                <ShieldCheck className="w-4 h-4 text-[#51582f] shrink-0" />
                <span className="text-[#3b411e] truncate font-medium">
                  Akses URL rahasia: <strong>?page=cms</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyCmsLink}
                className="px-2 py-1 rounded-lg bg-white text-[#3b411e] font-bold border border-[#a2ab73] shadow-2xs hover:bg-[#fff7eb] shrink-0 cursor-pointer text-[10px]"
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
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer min-h-[56px] ${
                      isActive
                        ? 'bg-[#cc3a63] text-white border-[#4a4238] shadow-[2px_2px_0px_#4a4238]'
                        : 'bg-[#fff7eb] hover:bg-white text-[#2b2620] border-[#e6dac5]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-white text-[#cc3a63] border border-[#d8c8b4]'
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
                            isActive ? 'text-white/80' : 'text-[#7a7065]'
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
                              ? 'bg-white text-[#cc3a63]'
                              : tab.badgeHighlight
                              ? 'bg-[#cc3a63] text-white'
                              : 'bg-[#f0f3e3] text-[#51582f]'
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
            <div className="mt-3 pt-3 border-t border-[#e6dac5] flex items-center gap-2">
              <button
                type="button"
                onClick={onSwitchToInvitation}
                className="flex-1 py-2.5 rounded-xl bg-[#2b2620] hover:bg-[#433c33] text-white text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Eye className="w-4 h-4 text-[#f0f3e3]" />
                <span>Lihat Undangan Tamu</span>
              </button>
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-white border border-[#4a4238] text-[#2b2620] text-[12px] font-bold hover:bg-[#f9f0e0] cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Footer */}
      <footer className="bg-white border-t-2 border-[#4a4238] py-4 px-4 text-center text-[12px] text-[#7a7065]">
        <div className="max-w-[1040px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Panel CMS Pengantin • <strong>{couple.groom.nickname} &amp; {couple.bride.nickname}</strong>
          </span>
          <button
            type="button"
            onClick={onSwitchToInvitation}
            className="text-[#cc3a63] font-bold hover:underline cursor-pointer"
          >
            ← Kembali ke Halaman Undangan Tamu
          </button>
        </div>
      </footer>
    </div>
  );
};
