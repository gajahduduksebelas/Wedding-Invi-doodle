import React, { useState } from 'react';
import {
  Send,
  Heart,
  Calendar,
  Film,
  Landmark,
  Image as ImageIcon,
  Users,
  Eye,
  ExternalLink,
  Copy,
  Sparkles,
  ArrowLeft,
  Settings2,
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
  const [activeTab, setActiveTab] = useState<
    'wa-blaster' | 'couple-event' | 'video' | 'gifts' | 'gallery' | 'rsvp'
  >('wa-blaster');

  const pendingWaCount = waGuests.filter((g) => g.status === 'pending').length;

  const handleCopyCmsLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}${window.location.pathname}?page=cms`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).catch(() => {});
      }
      onShowToast('Tautan langsung ke halaman CMS disalin! 📋', 'copy');
    }
  };

  return (
    <div className="min-h-screen bg-[#fff7eb] text-[#2b2620] flex flex-col font-sans">
      {/* 1. Master Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#fffdfa]/95 backdrop-blur-md border-b-2 border-[#4a4238] shadow-sm px-4 py-3">
        <div className="max-w-[1040px] mx-auto flex items-center justify-between gap-3">
          {/* Logo & Wedding Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onSwitchToInvitation}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f9f0e0] hover:bg-[#edd9bf] text-[#2b2620] text-[12px] font-bold border border-[#4a4238] shadow-[1px_2px_0px_#4a4238] active:translate-y-0.5 transition-all cursor-pointer"
              title="Kembali ke halaman undangan tamu"
            >
              <ArrowLeft className="w-4 h-4 text-[#cc3a63]" />
              <span className="hidden sm:inline">Lihat Undangan Tamu</span>
              <span className="sm:hidden">Undangan</span>
            </button>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] sm:text-[18px] font-bold text-[#cc3a63] font-heading leading-none">
                  {couple.groom.nickname} &amp; {couple.bride.nickname}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#f0f3e3] text-[#51582f] text-[10px] font-bold border border-[#a2ab73]">
                  Panel CMS
                </span>
              </div>
              <span className="text-[11px] text-[#7a7065] hidden sm:inline">
                Sistem Manajemen Undangan &amp; WhatsApp Blaster
              </span>
            </div>
          </div>

          {/* Quick Right Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCmsLink}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-[#f9f0e0] text-[#2b2620] text-[11px] font-bold border border-[#4a4238] shadow-[1px_2px_0px_#4a4238] cursor-pointer"
              title="Salin link khusus CMS ini (?page=cms)"
            >
              <Copy className="w-3.5 h-3.5 text-[#a2ab73]" />
              <span className="hidden md:inline">Salin Link CMS</span>
            </button>

            <button
              type="button"
              onClick={onSwitchToInvitation}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#cc3a63] hover:bg-[#b52d53] text-white text-[12px] font-bold shadow-[2px_2px_0px_#4a4238] border border-[#4a4238] active:translate-y-0.5 transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Undangan</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Navigation Tabs Bar */}
      <nav className="bg-[#f9f0e0] border-b border-[#4a4238] px-3 sm:px-4 py-2 sticky top-[57px] z-30 overflow-x-auto scrollbar-none shadow-xs">
        <div className="max-w-[1040px] mx-auto flex items-center gap-1.5 min-w-max">
          {/* Tab 1: WA Blaster */}
          <button
            type="button"
            onClick={() => setActiveTab('wa-blaster')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold border transition-all cursor-pointer ${
              activeTab === 'wa-blaster'
                ? 'bg-[#cc3a63] text-white border-[#4a4238] shadow-[2px_2px_0px_#4a4238]'
                : 'bg-white hover:bg-[#fff7eb] text-[#2b2620] border-[#d8c8b4]'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>WhatsApp Blaster</span>
            {pendingWaCount > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'wa-blaster'
                    ? 'bg-white text-[#cc3a63]'
                    : 'bg-[#cc3a63] text-white'
                }`}
              >
                {pendingWaCount}
              </span>
            )}
          </button>

          {/* Tab 2: Mempelai & Acara */}
          <button
            type="button"
            onClick={() => setActiveTab('couple-event')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold border transition-all cursor-pointer ${
              activeTab === 'couple-event'
                ? 'bg-[#cc3a63] text-white border-[#4a4238] shadow-[2px_2px_0px_#4a4238]'
                : 'bg-white hover:bg-[#fff7eb] text-[#2b2620] border-[#d8c8b4]'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Mempelai &amp; Acara</span>
          </button>

          {/* Tab 3: Galeri Foto */}
          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold border transition-all cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-[#cc3a63] text-white border-[#4a4238] shadow-[2px_2px_0px_#4a4238]'
                : 'bg-white hover:bg-[#fff7eb] text-[#2b2620] border-[#d8c8b4]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Galeri Foto ({photos.length})</span>
          </button>

          {/* Tab 4: Video Prewedding */}
          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold border transition-all cursor-pointer ${
              activeTab === 'video'
                ? 'bg-[#cc3a63] text-white border-[#4a4238] shadow-[2px_2px_0px_#4a4238]'
                : 'bg-white hover:bg-[#fff7eb] text-[#2b2620] border-[#d8c8b4]'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Video Prewedding</span>
          </button>

          {/* Tab 5: Rekening & Kado */}
          <button
            type="button"
            onClick={() => setActiveTab('gifts')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold border transition-all cursor-pointer ${
              activeTab === 'gifts'
                ? 'bg-[#cc3a63] text-white border-[#4a4238] shadow-[2px_2px_0px_#4a4238]'
                : 'bg-white hover:bg-[#fff7eb] text-[#2b2620] border-[#d8c8b4]'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Rekening &amp; Kado</span>
          </button>

          {/* Tab 6: Buku Tamu & RSVP */}
          <button
            type="button"
            onClick={() => setActiveTab('rsvp')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold border transition-all cursor-pointer ${
              activeTab === 'rsvp'
                ? 'bg-[#cc3a63] text-white border-[#4a4238] shadow-[2px_2px_0px_#4a4238]'
                : 'bg-white hover:bg-[#fff7eb] text-[#2b2620] border-[#d8c8b4]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Buku Tamu &amp; RSVP</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'rsvp'
                  ? 'bg-white text-[#cc3a63]'
                  : 'bg-[#f0f3e3] text-[#51582f]'
              }`}
            >
              {wishes.length}
            </span>
          </button>
        </div>
      </nav>

      {/* 3. Main Content View Area */}
      <main className="flex-1 p-3.5 sm:p-6 pb-28 sm:pb-12 max-w-[1040px] w-full mx-auto">
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

        {activeTab === 'gallery' && (
          <GalleryEditor
            photos={photos}
            onSave={onSavePhotos}
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

      {/* 4. Footer */}
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
