import React, { useState } from 'react';
import { Mail, Music, Edit3, Check, Heart, Sparkles } from 'lucide-react';
import { CoupleData } from '../types';
import { DOODLE_ASSETS } from '../data/weddingData';

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
      className={`w-full bg-white relative flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ${
        isOpened
          ? 'min-h-[92vh] py-8'
          : 'min-h-dvh h-dvh py-3 px-3.5'
      }`}
    >
      {/* ============================================================ */}
      {/* FLOATING DOODLE ASSETS IN FRONT OF BLANK WHITE BACKGROUND    */}
      {/* ============================================================ */}

      {/* 1. Top-Left: Love Birds holding ribbon */}
      <div className="absolute top-2 sm:top-5 left-2 sm:left-6 z-20 pointer-events-none animate-doodle-float">
        <img
          src={DOODLE_ASSETS.loveBirds}
          alt=""
          aria-hidden="true"
          className="w-16 sm:w-20 h-16 sm:h-20 object-contain drop-shadow-[2px_3px_0px_rgba(74,66,56,0.12)]"
        />
      </div>

      {/* 2. Top-Right: Heart Balloons Bouquet */}
      <div className="absolute top-3 sm:top-5 right-2 sm:right-6 z-20 pointer-events-none animate-doodle-slow">
        <img
          src={DOODLE_ASSETS.heartBalloons}
          alt=""
          aria-hidden="true"
          className="w-16 sm:w-22 h-16 sm:h-22 object-contain drop-shadow-[2px_3px_0px_rgba(74,66,56,0.12)]"
        />
      </div>

      {/* 3. Middle-Left: Golden Wedding Rings Doodle */}
      <div className="hidden xs:block absolute top-[28%] left-1 sm:left-4 z-20 pointer-events-none animate-doodle-sway">
        <img
          src={DOODLE_ASSETS.rings}
          alt=""
          aria-hidden="true"
          className="w-11 sm:w-14 h-11 sm:h-14 object-contain -rotate-12 drop-shadow-[1px_2px_0px_rgba(74,66,56,0.1)]"
        />
      </div>

      {/* 4. Middle-Right: Flying Love Envelopes */}
      <div className="hidden xs:block absolute top-[30%] right-1 sm:right-4 z-20 pointer-events-none animate-doodle-bob">
        <img
          src={DOODLE_ASSETS.envelopes}
          alt=""
          aria-hidden="true"
          className="w-12 sm:w-15 h-12 sm:h-15 object-contain rotate-12 drop-shadow-[1px_2px_0px_rgba(74,66,56,0.1)]"
        />
      </div>

      {/* 5. Bottom-Left: Bridal Flower Bouquet */}
      <div className="absolute bottom-3 sm:bottom-6 left-2 sm:left-6 z-20 pointer-events-none animate-doodle-bob">
        <img
          src={DOODLE_ASSETS.bouquet}
          alt=""
          aria-hidden="true"
          className="w-14 sm:w-18 h-14 sm:h-18 object-contain -rotate-6 drop-shadow-[2px_2px_0px_rgba(74,66,56,0.12)]"
        />
      </div>

      {/* 6. Bottom-Right: Cupid's Heart Arrow */}
      <div className="absolute bottom-3 sm:bottom-6 right-2 sm:right-6 z-20 pointer-events-none animate-doodle-float">
        <img
          src={DOODLE_ASSETS.heartArrow}
          alt=""
          aria-hidden="true"
          className="w-14 sm:w-18 h-14 sm:h-18 object-contain rotate-6 drop-shadow-[2px_2px_0px_rgba(74,66,56,0.12)]"
        />
      </div>

      {/* 7. Subtle Clinking Champagne Toast in Background Corner */}
      <div className="hidden sm:block absolute bottom-24 left-10 z-10 pointer-events-none opacity-80 animate-doodle-slow">
        <img
          src={DOODLE_ASSETS.toast}
          alt=""
          aria-hidden="true"
          className="w-12 h-12 object-contain"
        />
      </div>

      {/* 8. Subtle Wedding Bells in Background Corner */}
      <div className="hidden sm:block absolute bottom-24 right-10 z-10 pointer-events-none opacity-80 animate-doodle-sway">
        <img
          src={DOODLE_ASSETS.bells}
          alt=""
          aria-hidden="true"
          className="w-12 h-12 object-contain"
        />
      </div>

      {/* Scattered Whimsical Hand-Drawn Doodle SVG Accents */}
      <div className="absolute top-[18%] left-[18%] text-[#f8b4c4] pointer-events-none animate-doodle-pulse">
        <Sparkles className="w-5 h-5" />
      </div>
      <div className="absolute top-[16%] right-[20%] text-[#cc3a63] pointer-events-none animate-doodle-pulse">
        <Heart className="w-4 h-4 fill-[#fcecf0]" />
      </div>
      <div className="absolute bottom-[20%] left-[22%] text-[#b8c596] pointer-events-none animate-doodle-pulse">
        <Sparkles className="w-4 h-4" />
      </div>
      <div className="absolute bottom-[18%] right-[22%] text-[#cc3a63] pointer-events-none animate-doodle-pulse">
        <Heart className="w-4 h-4 fill-[#fcecf0]" />
      </div>

      {/* ============================================================ */}
      {/* CENTRAL DOODLE INVITATION CARD (Border-free clean paper card) */}
      {/* ============================================================ */}
      <div className="w-full max-w-[390px] rounded-3xl bg-[#fffdf9] p-5 sm:p-6 shadow-[0_12px_40px_rgba(74,66,56,0.08)] relative z-30 flex flex-col items-center text-center my-auto transition-transform duration-300">
        
        {/* Washi Tape Decor Top (Signature Cute Doodle look) */}
        <div
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 h-7 cd-tape-pink -rotate-1 rounded-xs shadow-xs pointer-events-none"
          aria-hidden="true"
        />

        {/* Header Eyebrow */}
        <div className="flex items-center justify-center gap-1.5 mt-1 text-[#cc3a63]">
          <Heart className="w-3 h-3 fill-[#cc3a63]" />
          <span className="text-[11px] sm:text-[12px] font-bold tracking-widest uppercase font-heading">
            Undangan Pernikahan
          </span>
          <Heart className="w-3 h-3 fill-[#cc3a63]" />
        </div>

        {/* Couple Big Callout Heading */}
        <h1 className="text-[30px] sm:text-[36px] font-black text-[#2b2620] tracking-tight leading-[1.1] mt-1.5 font-heading">
          {groomNickname} &amp; {brideNickname}
        </h1>

        {/* Date Pill Badge */}
        <div className="mt-1 px-3.5 py-0.5 rounded-full bg-[#f9f0e0] text-[11.5px] sm:text-[12px] font-bold text-[#7a7065] shadow-xs">
          {displayDate}
        </div>

        {/* Central Floral Envelope Graphic */}
        <div className="relative my-2 sm:my-3 w-40 sm:w-44 h-32 sm:h-36 flex items-center justify-center">
          <img
            src={DOODLE_ASSETS.floralEnvelope}
            alt="Amplop Undangan"
            className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(74,66,56,0.12)] hover:scale-105 transition-transform"
          />
        </div>

        {/* Guest Recipient Scrapbook Frame */}
        <div className="w-full rounded-2xl bg-[#f9f0e0]/80 p-3 sm:p-3.5 shadow-xs my-0.5 relative group">
          <span className="text-[10px] sm:text-[10.5px] font-bold text-[#7a7065] block uppercase tracking-wider">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </span>

          {isEditing ? (
            <form onSubmit={handleSaveName} className="flex items-center gap-1.5 mt-1 justify-center">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                autoFocus
                className="text-[15px] font-bold text-[#2b2620] bg-white px-2.5 py-1 rounded-lg border-2 border-[#cc3a63] text-center focus:outline-none w-full max-w-[240px]"
              />
              <button
                type="submit"
                className="p-1.5 rounded-lg bg-[#cc3a63] text-white hover:bg-[#b22b51] cursor-pointer shadow-xs"
                title="Simpan"
              >
                <Check className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
              <h2 className="text-[17px] sm:text-[19px] font-bold text-[#2b2620] font-heading leading-tight">
                {guestName}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setTempName(guestName);
                  setIsEditing(true);
                }}
                className="p-1 text-[#847279] hover:text-[#cc3a63] transition-colors rounded cursor-pointer"
                title="Ubah nama tamu"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <span className="text-[11px] font-bold text-[#6b7742] block mt-0.5">
            di Tempat
          </span>
        </div>

        {/* Primary CTA: BUKA UNDANGAN */}
        <button
          onClick={onOpenInvitation}
          id="openInvitationBtn"
          className="mt-3.5 sm:mt-4 inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#cc3a63] text-white text-[15px] sm:text-[16px] font-extrabold shadow-[0_6px_20px_rgba(204,58,99,0.35)] hover:bg-[#b52f53] active:translate-y-0.5 transition-all w-full cursor-pointer group"
        >
          <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Buka Undangan</span>
        </button>

        {/* Music notice subtext */}
        <p className="text-[11px] sm:text-[11.5px] font-medium text-[#7a7065] mt-2 flex items-center justify-center gap-1.5">
          <Music className="w-3.5 h-3.5 text-[#cc3a63] animate-pulse" />
          <span>Putar musik latar otomatis saat dibuka</span>
        </p>
      </div>
    </section>
  );
};
