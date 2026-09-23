import React from 'react';
import { ChevronDown, Heart, Sparkles } from 'lucide-react';
import { COUPLE_DATA, DOODLE_ASSETS } from '../data/weddingData';
import { CoupleData } from '../types';

interface AnnouncementSectionProps {
  onScrollNext: () => void;
  couple?: CoupleData;
}

export const AnnouncementSection: React.FC<AnnouncementSectionProps> = ({ onScrollNext, couple }) => {
  const activeCouple = couple || COUPLE_DATA;
  const groomNickname = activeCouple.groom.nickname || 'Arga';
  const brideNickname = activeCouple.bride.nickname || 'Kirana';
  const weddingDate = activeCouple.weddingDate || 'Minggu, 14 Februari 2027';

  return (
    <section
      id="home"
      aria-label="Pembuka"
      className="min-h-dvh w-full px-4 py-8 flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Floating Random Doodle Assets */}
      <img
        src={DOODLE_ASSETS.loveBirds}
        alt=""
        aria-hidden="true"
        className="absolute top-4 left-3 w-16 sm:w-20 h-16 sm:h-20 object-contain pointer-events-none opacity-90 animate-doodle-float z-10"
      />
      <img
        src={DOODLE_ASSETS.heartBalloons}
        alt=""
        aria-hidden="true"
        className="absolute top-5 right-3 w-16 sm:w-20 h-16 sm:h-20 object-contain pointer-events-none opacity-90 animate-doodle-slow z-10"
      />
      <img
        src={DOODLE_ASSETS.toast}
        alt=""
        aria-hidden="true"
        className="absolute bottom-6 left-4 w-12 sm:w-14 h-12 sm:h-14 object-contain pointer-events-none opacity-85 animate-doodle-bob z-10"
      />
      <img
        src={DOODLE_ASSETS.bells}
        alt=""
        aria-hidden="true"
        className="absolute bottom-6 right-4 w-12 sm:w-14 h-12 sm:h-14 object-contain pointer-events-none opacity-85 animate-doodle-sway z-10"
      />

      {/* Floating Sparkles & Hearts */}
      <div className="absolute top-1/4 right-8 text-[#cc3a63]/40 pointer-events-none animate-doodle-pulse">
        <Heart className="w-4 h-4 fill-current" />
      </div>
      <div className="absolute bottom-1/4 left-8 text-[#8b965f]/50 pointer-events-none animate-doodle-pulse">
        <Sparkles className="w-5 h-5" />
      </div>

      {/* Central Borderless Paper Card */}
      <div className="w-full max-w-[400px] rounded-3xl bg-white/95 p-6 sm:p-8 shadow-[0_12px_40px_rgba(74,66,56,0.08)] relative z-20 flex flex-col items-center text-center my-auto">
        {/* Top Washi Tape */}
        <div
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 cd-tape-pink rotate-1 rounded-xs shadow-xs pointer-events-none"
          aria-hidden="true"
        />

        {/* DUEL HEART LOCKET WITH LOVE BORDER */}
        <div className="relative w-[280px] h-[160px] sm:w-[310px] sm:h-[180px] flex items-center justify-center mt-1 mb-2">
          {/* Left Heart Photo: Bride */}
          <div className="absolute left-6 sm:left-7 top-4 sm:top-5 w-[110px] h-[110px] sm:w-[125px] sm:h-[125px] rounded-full overflow-hidden bg-[#f9f0e0] shadow-md -rotate-6">
            <img
              src={activeCouple.bride.image}
              alt={activeCouple.bride.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Heart Photo: Groom */}
          <div className="absolute right-6 sm:right-7 top-4 sm:top-5 w-[110px] h-[110px] sm:w-[125px] sm:h-[125px] rounded-full overflow-hidden bg-[#f9f0e0] shadow-md rotate-6">
            <img
              src={activeCouple.groom.image}
              alt={activeCouple.groom.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Overlay Love-Border Hand-drawn Doodle Frame */}
          <img
            src={DOODLE_ASSETS.loveBorder}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10 filter drop-shadow-[0_4px_8px_rgba(74,66,56,0.12)]"
          />
        </div>

        {/* Big Display Copy: KITA AKAN MENIKAH! */}
        <div className="mt-2 flex flex-col items-center select-none">
          <h2 className="text-[34px] sm:text-[42px] font-black text-[#2b2620] tracking-tight leading-[1.08] font-heading">
            KITA AKAN<br />MENIKAH!
          </h2>
          <p className="text-[20px] sm:text-[22px] font-bold text-[#cc3a63] font-heading mt-1.5">
            {groomNickname} &amp; {brideNickname}
          </p>
          <div className="mt-2.5 px-4 py-1.5 rounded-full bg-[#f9f0e0] text-[13px] font-bold text-[#2b2620] shadow-xs">
            <strong>{weddingDate}</strong>
          </div>
        </div>

        {/* Scroll Next CTA */}
        <button
          onClick={onScrollNext}
          className="mt-6 inline-flex flex-col items-center text-[#7a7065] hover:text-[#cc3a63] transition-colors cursor-pointer group"
          aria-label="Lihat detail doa dan acara"
        >
          <span className="text-[11px] font-bold tracking-wider uppercase group-hover:underline">
            Rangkaian Doa &amp; Acara
          </span>
          <div className="mt-1 w-8 h-8 rounded-full bg-[#f9f0e0] flex items-center justify-center shadow-xs group-hover:translate-y-0.5 transition-transform">
            <ChevronDown className="w-4 h-4 text-[#211b12] animate-bounce" />
          </div>
        </button>
      </div>
    </section>
  );
};
