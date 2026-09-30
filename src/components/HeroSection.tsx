import React, { useState } from 'react';
import { Mail, Music, Edit3, Check } from 'lucide-react';
import { CoupleData } from '../types';
import { DOODLE, DoodleScatter } from './DoodleScatter';

interface HeroSectionProps {
  guestName: string;
  onUpdateGuestName: (newName: string) => void;
  onOpenInvitation: () => void;
  couple?: CoupleData;
  isOpened?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  guestName,
  onUpdateGuestName,
  onOpenInvitation,
  couple,
  isOpened = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(guestName);

  const groomNickname = couple?.groom.nickname || 'Arga';
  const brideNickname = couple?.bride.nickname || 'Kirana';
  const displayDate = couple?.weddingDate || 'Minggu, 14 Februari 2027';

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      onUpdateGuestName(tempName.trim());
    }
    setIsEditing(false);
  };

  return (
    <section
      id="heroSection"
      aria-label="Cover Undangan"
      className="mobile-snap-section w-full bg-[#FAF7EE] relative isolate flex flex-col items-center justify-center overflow-hidden py-4 px-3.5 select-none"
    >
      <DoodleScatter seed="hero" prefer={['heartBalloons', 'doves', 'diamondRing', 'giftBox']} />

      {/* Central Cover Invitation Card */}
      <div className="w-full max-w-[380px] doodle-card p-5 sm:p-7 relative z-20 flex flex-col items-center text-center my-auto animate-doodle-in">
        {/* Pink Washi Tape at Top Center */}
        <div
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 sm:w-32 h-5 sm:h-6 cd-tape-pink -rotate-1 rounded-xs pointer-events-none"
          aria-hidden="true"
        />

        {/* Eyebrow in Allura */}
        <span className="font-allura text-[26px] sm:text-[28px] text-[#B4533C] leading-none mt-1">
          Undangan Pernikahan
        </span>

        {/* Big Couple Callout in Delicious Handrawn */}
        <h1 className="font-delicious text-[38px] sm:text-[44px] text-[#181818] tracking-wide uppercase leading-tight mt-1">
          {groomNickname} &amp; {brideNickname}
        </h1>

        {/* Date Pill Badge */}
        <div className="mt-1 px-4 py-1.5 rounded-full bg-[#EFE3C6] border-[1.5px] border-[#181818] shadow-[2.5px_2.5px_0px_#181818] text-[12px] font-bold text-[#181818]">
          {displayDate}
        </div>

        {/* Central Floral Envelope Graphic */}
        <div className="relative my-2 sm:my-3 w-36 sm:w-40 h-28 sm:h-32 flex items-center justify-center">
          <img
            src={DOODLE.floralEnvelope}
            alt="Amplop Undangan"
            className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(24,24,24,0.15)] animate-doodle-bob"
          />
        </div>

        {/* Guest Recipient Scrapbook Frame */}
        <div className="w-full rounded-2xl bg-[#FAF7EE] border-[2px] border-[#181818] shadow-[2.5px_2.5px_0px_#181818] p-3 sm:p-3.5 my-1 relative">
          <span className="text-[10px] font-bold text-stone-600 block uppercase tracking-wider">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </span>

          {isEditing ? (
            <form onSubmit={handleSaveName} className="flex items-center gap-1.5 mt-1 justify-center">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                autoFocus
                className="text-[14px] font-bold text-[#181818] bg-white px-2 py-1 rounded-lg border-[1.5px] border-[#B4533C] text-center focus:outline-none w-full max-w-[220px]"
              />
              <button
                type="submit"
                className="p-1.5 rounded-lg bg-[#B4533C] text-white hover:bg-[#a04630] cursor-pointer"
                title="Simpan"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
              <h2 className="font-serif text-[17px] sm:text-[18px] font-bold text-[#181818] leading-tight">
                {guestName}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setTempName(guestName);
                  setIsEditing(true);
                }}
                className="p-1 text-stone-500 hover:text-[#B4533C] transition-colors rounded cursor-pointer"
                title="Ubah nama tamu"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <span className="text-[11px] font-bold text-[#3E5B3D] block mt-0.5">
            di Tempat
          </span>
        </div>

        {/* Primary CTA: BUKA UNDANGAN */}
        <button
          onClick={onOpenInvitation}
          id="openInvitationBtn"
          className="mt-3.5 inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-full bg-[#B4533C] text-white text-[15px] font-bold border-[2px] border-[#181818] shadow-[4px_4px_0px_#181818] hover:bg-[#a04630] active:translate-y-0.5 transition-all w-full cursor-pointer"
        >
          <Mail className="w-4.5 h-4.5" />
          <span>Buka Undangan</span>
        </button>

        {/* Music notice subtext */}
        <p className="text-[11px] font-medium text-stone-600 mt-2 flex items-center justify-center gap-1.5">
          <Music className="w-3.5 h-3.5 text-[#B4533C] animate-pulse" />
          <span>Putar musik latar otomatis saat dibuka</span>
        </p>
      </div>
    </section>
  );
};
