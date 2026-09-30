import React, { useState } from 'react';
import { Mail, Music, Edit3, Check } from 'lucide-react';
import { CoupleData } from '../types';
import {
  DoodleFlyingBird,
  DoodleHeartBalloons,
  DoodleDiamondRing,
  DoodleGiftBox,
  DoodleKissingBirds,
  DoodleBotanicalBranch,
} from './DoodleIcons';
import { DOODLE_ASSETS } from '../data/weddingData';

const Sparkle: React.FC<{ className?: string; color?: string }> = ({ className = '', color = '#181818' }) => (
  <svg viewBox="-10 -10 20 20" className={`absolute ${className}`} aria-hidden="true">
    <path d="M0 -9 C0.9 -2.5 2.5 -0.9 9 0 C2.5 0.9 0.9 2.5 0 9 C-0.9 2.5 -2.5 0.9 -9 0 C-2.5 -0.9 -0.9 -2.5 0 -9 Z" fill={color} />
  </svg>
);

// Hand-drawn trimmings around the cover card: a tilted dashed frame, a dashed
// flight path ending in a heart, and a few sparkles. Kept sparse on purpose.
const CoverTrimmings: React.FC = () => (
  <div className="absolute inset-0 z-10 pointer-events-none" aria-hidden="true">
    {/* Dashed frame, slightly tilted behind the card */}
    <div className="absolute -inset-3.5 rounded-[36px] border-2 border-dashed border-[#B4533C]/55 -rotate-[1.6deg]" />

    {/* Dashed loop trailing off the bottom-left corner, ending in a heart */}
    <svg viewBox="0 0 90 70" className="absolute -left-4 -bottom-[60px] w-[68px] h-[53px] overflow-visible">
      <path
        d="M78 6 C62 22 30 10 26 30 C23 45 44 50 40 36 C37 26 18 34 12 52"
        fill="none"
        stroke="#181818"
        strokeOpacity="0.6"
        strokeWidth="2"
        strokeDasharray="5 6"
        strokeLinecap="round"
      />
      <path d="M10 60 C6 55 1 57 3 62 L10 68 L17 62 C19 57 14 55 10 60 Z" fill="#B4533C" stroke="#181818" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>

    <Sparkle className="-top-8 left-6 w-4 h-4" />
    <Sparkle className="-top-4 left-12 w-2.5 h-2.5" color="#B4533C" />
    <Sparkle className="top-[42%] -right-5 w-3.5 h-3.5" color="#B4533C" />
    <Sparkle className="-bottom-9 right-10 w-4 h-4" />
    <span className="absolute -bottom-6 right-4 w-1.5 h-1.5 rounded-full bg-[#181818]/60" />
    <span className="absolute top-[30%] -left-6 w-1.5 h-1.5 rounded-full bg-[#B4533C]" />
  </div>
);

// Bunting strung across the top of the cover. Flags hang from a sagging string.
const FLAG_COLORS = ['#F7C6BA', '#C6E2CB', '#EAD69B', '#B4533C', '#EFE3C6'];
const BUNTING_W = 400;
const buntingY = (x: number) => 6 + 22 * Math.sin((Math.PI * x) / BUNTING_W);
const buntingFlags = Array.from({ length: 11 }, (_, i) => {
  const x = 22 + i * 35.6;
  const y = buntingY(x);
  const tilt = (Math.atan(((22 * Math.PI) / BUNTING_W) * Math.cos((Math.PI * x) / BUNTING_W)) * 180) / Math.PI;
  return { x, y, tilt, color: FLAG_COLORS[i % FLAG_COLORS.length] };
});

const CoverBunting: React.FC = () => (
  <svg
    viewBox={`0 0 ${BUNTING_W} 52`}
    className="absolute top-0 left-0 w-full h-auto z-10 pointer-events-none"
    aria-hidden="true"
  >
    <path
      d={`M0 ${buntingY(0)} Q${BUNTING_W / 2} ${buntingY(BUNTING_W / 2) * 2 - 6} ${BUNTING_W} ${buntingY(BUNTING_W)}`}
      fill="none"
      stroke="#181818"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    {buntingFlags.map((f, i) => (
      <path
        key={i}
        d="M-9 0 L9 0 L0 17 Z"
        transform={`translate(${f.x.toFixed(1)} ${f.y.toFixed(1)}) rotate(${f.tilt.toFixed(1)})`}
        fill={f.color}
        stroke="#181818"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    ))}
  </svg>
);

// Dashed hand-drawn ground line along the bottom of the cover.
const CoverGround: React.FC = () => (
  <svg
    viewBox="0 0 400 20"
    preserveAspectRatio="none"
    className="absolute bottom-[26px] left-0 w-full h-5 z-10 pointer-events-none"
    aria-hidden="true"
  >
    <path
      d="M-4 11 C40 5 70 15 110 10 C150 5 180 14 220 10 C260 6 300 15 340 9 C365 6 385 11 404 9"
      fill="none"
      stroke="#181818"
      strokeOpacity="0.55"
      strokeWidth="2"
      strokeDasharray="8 7"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);

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
      className="mobile-snap-section w-full bg-[#FAF7EE] relative flex flex-col items-center justify-center overflow-hidden py-4 px-3.5 select-none"
    >
      {/* Page decoration: bunting across the top, a dashed ground line along
          the bottom, and doodles in the space above and below the card.
          Kept to a phone-width column so it stays together on desktop. */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] pointer-events-none">
      <CoverBunting />
      <div className="absolute top-14 left-3 z-10 pointer-events-none animate-doodle-float">
        <DoodleFlyingBird className="w-14 sm:w-18 h-auto" />
      </div>
      <div className="absolute top-12 right-3 z-10 pointer-events-none">
        <DoodleHeartBalloons className="w-12 sm:w-16 h-auto" />
      </div>
      <Sparkle className="top-[88px] left-[38%] w-3 h-3 [@media(max-height:700px)]:hidden" color="#B4533C" />
      <Sparkle className="top-[118px] right-[30%] w-4 h-4 [@media(max-height:700px)]:hidden" />

      <CoverGround />
      <div className="absolute bottom-[34px] left-4 z-10 pointer-events-none">
        <DoodleDiamondRing className="w-11 sm:w-13 h-auto" />
      </div>
      <div className="absolute bottom-[36px] left-1/2 -translate-x-1/2 z-10 pointer-events-none [@media(max-height:700px)]:hidden">
        <DoodleKissingBirds className="w-18 h-auto" />
      </div>
      <div className="absolute bottom-[34px] right-4 z-10 pointer-events-none">
        <DoodleGiftBox className="w-11 sm:w-13 h-auto" />
      </div>
      <div className="absolute bottom-[30px] left-[22%] z-10 pointer-events-none opacity-80 -rotate-12 [@media(max-height:700px)]:hidden">
        <DoodleBotanicalBranch className="w-6 h-auto" />
      </div>
      <div className="absolute bottom-[30px] right-[22%] z-10 pointer-events-none opacity-80 rotate-12 -scale-x-100 [@media(max-height:700px)]:hidden">
        <DoodleBotanicalBranch className="w-6 h-auto" />
      </div>
      </div>

      {/* Central Cover Invitation Card, framed by a few doodled trimmings */}
      <div className="relative w-[calc(100%-1.75rem)] max-w-[340px] my-auto animate-doodle-in">
        <CoverTrimmings />

      <div className="w-full doodle-card px-5 pt-8 pb-5 relative z-20 flex flex-col items-center text-center">
        {/* Pink washi tape across the top-left corner */}
        <div
          className="absolute -top-1.5 -left-6 w-24 h-5 cd-tape-pink -rotate-[28deg] rounded-xs pointer-events-none"
          aria-hidden="true"
        />

        {/* Floral envelope tucked over the top-right corner */}
        <div className="absolute -top-12 -right-5 w-[108px] h-[88px] rotate-[9deg] pointer-events-none">
          <img
            src={DOODLE_ASSETS.floralEnvelope}
            alt="Amplop Undangan"
            className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(24,24,24,0.15)] animate-doodle-bob"
          />
        </div>

        {/* Couple names in Delicious Handrawn */}
        <h1 className="font-delicious text-[36px] sm:text-[40px] text-[#181818] tracking-wide uppercase leading-tight">
          {groomNickname} &amp; {brideNickname}
        </h1>
        <svg viewBox="0 0 100 12" className="w-20 h-3 mt-0.5 mb-3 overflow-visible" aria-hidden="true">
          <path d="M3 6.5C18 3.5 32 8.5 48 5.5C64 3 78 8 97 6" stroke="#B4533C" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>

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
      </div>
    </section>
  );
};
