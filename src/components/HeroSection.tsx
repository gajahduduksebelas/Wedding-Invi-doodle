import React, { useState } from 'react';
import { Heart, Mail, Music, Edit3, Check } from 'lucide-react';

interface HeroSectionProps {
  guestName: string;
  onUpdateGuestName: (newName: string) => void;
  onOpenInvitation: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  guestName,
  onUpdateGuestName,
  onOpenInvitation,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(guestName);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      onUpdateGuestName(tempName.trim());
    }
    setIsEditing(false);
  };

  return (
    <section id="heroSection" className="relative px-4 py-6 flex flex-col items-center overflow-hidden">
      {/* Decorative Floating SVGs / Botanicals */}
      <svg
        className="absolute -top-2 left-3 w-16 h-16 text-[#cc3a63]/25 pointer-events-none"
        fill="currentColor"
        viewBox="0 0 100 100"
      >
        <path d="M50 10 C55 30 75 45 90 50 C70 55 55 75 50 90 C45 70 25 55 10 50 C30 45 45 25 50 10 Z" />
      </svg>
      <svg
        className="absolute top-12 right-2 w-12 h-12 text-[#a2ab73]/60 pointer-events-none rotate-12"
        fill="currentColor"
        viewBox="0 0 100 100"
      >
        <path d="M50 15 L60 38 L85 40 L65 58 L72 82 L50 68 L28 82 L35 58 L15 40 L40 38 Z" />
      </svg>

      <div className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-[4px_5px_0px_#4a4238] border-2 border-[#4a4238] relative flex flex-col items-center text-center">
        {/* Washi Tape Decor Top */}
        <div
          className="absolute -top-3.5 w-28 h-7 bg-[#a2ab73] -rotate-2 rounded-sm shadow-sm flex items-center justify-center border border-[#88915b]"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.3) 5px, rgba(255,255,255,0.3) 10px)' }}
        />

        {/* Badge Header */}
        <div className="mt-3 mb-2 flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#f9f0e0] border border-[#e6dac5]">
          <Heart className="w-3.5 h-3.5 text-[#cc3a63] fill-current" />
          <span className="text-[11px] font-bold text-[#2b2620] tracking-widest uppercase">
            The Wedding Celebration
          </span>
        </div>

        {/* Couple Big Title */}
        <h1 className="text-[30px] sm:text-[34px] font-bold text-[#cc3a63] tracking-tight leading-tight mt-1 font-heading">
          Ahmad &amp; Siti
        </h1>
        <p className="text-[14px] font-semibold text-[#7a7065] mt-0.5">
          Sabtu, 01 Januari 2027 • Jakarta
        </p>

        {/* Envelope Doodle Illustration */}
        <div className="relative my-4 w-44 h-36 flex items-center justify-center">
          <div className="w-40 h-32 rounded-xl bg-[#f9f0e0] border-2 border-[#4a4238] flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
            {/* Flap triangle */}
            <div className="absolute top-0 w-0 h-0 border-l-[78px] border-l-transparent border-r-[78px] border-r-transparent border-t-[50px] border-t-[#cc3a63]/25" />

            {/* Wax seal heart icon */}
            <div className="w-12 h-12 rounded-full bg-[#cc3a63] flex items-center justify-center text-white shadow-[2px_2px_0px_#4a4238] z-10 animate-bounce">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <span className="text-[12px] font-bold text-[#2b2620] mt-2 z-10 tracking-wide">
              Undangan Spesial
            </span>
          </div>
        </div>

        {/* Guest Card Badge */}
        <div className="w-full rounded-xl bg-[#f9f0e0] p-3 shadow-sm border border-[#e6dac5] my-1 relative group">
          <span className="text-[11px] font-bold text-[#7a7065] block uppercase tracking-wider">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </span>

          {isEditing ? (
            <form onSubmit={handleSaveName} className="flex items-center gap-1.5 mt-1 justify-center">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                autoFocus
                className="text-[15px] font-bold text-[#2b2620] bg-white px-2.5 py-1 rounded-md border border-[#cc3a63] text-center focus:outline-none w-full max-w-[240px]"
              />
              <button
                type="submit"
                className="p-1.5 rounded-md bg-[#cc3a63] text-white hover:bg-[#b22b51]"
                title="Simpan"
              >
                <Check className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
              <h2 className="text-[18px] font-bold text-[#2b2620] font-heading">
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

          <span className="text-[12px] font-bold text-[#51582f] block mt-0.5">
            di Tempat
          </span>
        </div>

        {/* Open Invitation CTA */}
        <button
          onClick={onOpenInvitation}
          id="openInvitationBtn"
          className="mt-4 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#cc3a63] text-white text-[15px] font-bold shadow-[3px_4px_0px_#4a4238] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#4a4238] hover:bg-[#b22b51] transition-all w-full cursor-pointer"
        >
          <Mail className="w-5 h-5" />
          <span>Buka Undangan</span>
        </button>

        <p className="text-[12px] font-semibold text-[#7a7065] mt-2.5 flex items-center justify-center gap-1.5">
          <Music className="w-3.5 h-3.5 text-[#cc3a63]" />
          <span>🎵 Putar musik latar otomatis saat dibuka</span>
        </p>

      </div>
    </section>
  );
};
