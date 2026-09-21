import React from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { COUPLE_DATA } from '../data/weddingData';
import { CoupleData } from '../types';

interface AnnouncementSectionProps {
  onScrollNext: () => void;
  couple?: CoupleData;
}

export const AnnouncementSection: React.FC<AnnouncementSectionProps> = ({ onScrollNext, couple }) => {
  const activeCouple = couple || COUPLE_DATA;
  return (
    <section
      id="announcementSection"
      className="px-4 py-8 flex flex-col items-center justify-center relative overflow-hidden"
    >
      <div className="w-full max-w-[420px] rounded-3xl bg-[#fffdf9] p-6 sm:p-8 shadow-[4px_5px_0px_#4a4238] border-2 border-[#4a4238] relative flex flex-col items-center text-center">
        {/* Floating subtle doodle stars */}
        <div className="absolute top-4 left-5 text-[#211b12] select-none text-[16px] font-bold opacity-75">
          ✦
        </div>
        <div className="absolute top-10 right-6 text-[#211b12] select-none text-[18px] font-bold opacity-75">
          ✧
        </div>
        <div className="absolute bottom-16 left-6 text-[#211b12] select-none text-[14px] font-bold opacity-60">
          ★
        </div>
        <div className="absolute bottom-14 right-6 text-[#211b12] select-none text-[16px] font-bold opacity-70">
          ✦
        </div>

        {/* LOCKET ILLUSTRATION CONTAINER */}
        <div className="relative flex flex-col items-center w-full max-w-[320px] pt-1 pb-3">
          {/* Hand-Drawn Ribbon Bow SVG */}
          <svg
            className="w-40 sm:w-44 h-24 text-[#211b12] filter drop-shadow-[0_1px_0_rgba(74,66,56,0.15)]"
            viewBox="0 0 200 110"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Center Knot */}
            <ellipse cx="100" cy="48" rx="8" ry="10" fill="#fffdf9" strokeWidth="3.2" />
            <path d="M96 44 C98 42, 102 42, 104 44" strokeWidth="2.2" />
            <path d="M96 52 C98 54, 102 54, 104 52" strokeWidth="2.2" />

            {/* Left Bow Loop */}
            <path
              d="M93 45 C75 25, 45 18, 32 30 C18 42, 35 68, 92 53"
              fill="#fffdf9"
              strokeWidth="3.2"
            />
            {/* Left Loop Crease */}
            <path d="M85 47 C65 38, 48 35, 42 42" strokeWidth="2" strokeDasharray="1 0" />
            <path d="M40 38 C32 46, 42 60, 68 56" strokeWidth="2" />

            {/* Right Bow Loop */}
            <path
              d="M107 45 C125 25, 155 18, 168 30 C182 42, 165 68, 108 53"
              fill="#fffdf9"
              strokeWidth="3.2"
            />
            {/* Right Loop Crease */}
            <path d="M115 47 C135 38, 152 35, 158 42" strokeWidth="2" strokeDasharray="1 0" />
            <path d="M160 38 C168 46, 158 60, 132 56" strokeWidth="2" />

            {/* Left Ribbon Tail */}
            <path
              d="M95 56 C85 70, 70 80, 52 86 C48 87, 44 85, 42 81 C44 79, 58 74, 68 64 C76 56, 85 52, 92 52"
              fill="#fffdf9"
              strokeWidth="3"
            />

            {/* Right Ribbon Tail */}
            <path
              d="M105 56 C115 70, 130 80, 148 86 C152 87, 156 85, 158 81 C156 79, 142 74, 132 64 C124 56, 115 52, 108 52"
              fill="#fffdf9"
              strokeWidth="3"
            />

            {/* Hanging Ring / Bail loop */}
            <ellipse cx="100" cy="65" rx="5" ry="7" fill="#fffdf9" strokeWidth="3" />
            <path d="M100 72 L100 80" strokeWidth="3" />
          </svg>

          {/* THE DUAL HEART OPEN LOCKET */}
          <div className="relative flex items-center justify-center -mt-6 gap-0">
            {/* Center connector hinge SVG */}
            <svg
              className="absolute left-1/2 -translate-x-1/2 top-10 w-6 h-12 text-[#211b12] z-20 pointer-events-none"
              viewBox="0 0 24 48"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <rect x="8" y="10" width="8" height="6" rx="2" fill="#fffdf9" />
              <rect x="8" y="26" width="8" height="6" rx="2" fill="#fffdf9" />
              <line x1="12" y1="6" x2="12" y2="38" strokeWidth="2" />
            </svg>

            {/* LEFT HEART: SITI (BRIDE) */}
            <div className="relative -rotate-[14deg] hover:-rotate-[10deg] transition-transform duration-300 origin-top-right z-10 mr-[-6px]">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 p-1.5 bg-[#fffdf9] rounded-2xl border-[3.5px] border-[#211b12] shadow-[3px_3px_0px_#4a4238] flex items-center justify-center group overflow-hidden">
                {/* SVG Heart Mask Container */}
                <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                  <svg
                    className="w-full h-full text-[#211b12]"
                    viewBox="0 0 100 100"
                    fill="none"
                  >
                    <defs>
                      <clipPath id="locket-heart-left">
                        <path d="M50,88 C40,78 12,56 12,32 C12,18 24,10 36,10 C44,10 48,16 50,20 C52,16 56,10 64,10 C76,10 88,18 88,32 C88,56 60,78 50,88 Z" />
                      </clipPath>
                    </defs>
                    {/* Background Heart Fill */}
                    <path
                      d="M50,88 C40,78 12,56 12,32 C12,18 24,10 36,10 C44,10 48,16 50,20 C52,16 56,10 64,10 C76,10 88,18 88,32 C88,56 60,78 50,88 Z"
                      fill="#f9f0e0"
                      stroke="#211b12"
                      strokeWidth="6"
                    />
                  </svg>

                  {/* Clipped Image: Siti */}
                  <img
                    src={activeCouple.bride.image}
                    alt={activeCouple.bride.name}
                    className="absolute inset-0 w-full h-full object-cover scale-110"
                    style={{
                      clipPath:
                        'path("M50,88 C40,78 12,56 12,32 C12,18 24,10 36,10 C44,10 48,16 50,20 C52,16 56,10 64,10 C76,10 88,18 88,32 C88,56 60,78 50,88 Z")',
                    }}
                  />

                  {/* Inner Heart Hand-drawn Ink Contour */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none text-[#211b12]"
                    viewBox="0 0 100 100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M50,88 C40,78 12,56 12,32 C12,18 24,10 36,10 C44,10 48,16 50,20 C52,16 56,10 64,10 C76,10 88,18 88,32 C88,56 60,78 50,88 Z" />
                    {/* Double outline sketch accent */}
                    <path
                      d="M48,82 C40,73 18,54 18,34 C18,22 27,16 36,16 C43,16 46,20 48,24"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                      opacity="0.6"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* RIGHT HEART: AHMAD (GROOM) */}
            <div className="relative rotate-[10deg] hover:rotate-[6deg] transition-transform duration-300 origin-top-left z-10 ml-[-6px]">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 p-1.5 bg-[#fffdf9] rounded-2xl border-[3.5px] border-[#211b12] shadow-[3px_3px_0px_#4a4238] flex items-center justify-center group overflow-hidden">
                {/* SVG Heart Mask Container */}
                <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                  <svg
                    className="w-full h-full text-[#211b12]"
                    viewBox="0 0 100 100"
                    fill="none"
                  >
                    <defs>
                      <clipPath id="locket-heart-right">
                        <path d="M50,88 C40,78 12,56 12,32 C12,18 24,10 36,10 C44,10 48,16 50,20 C52,16 56,10 64,10 C76,10 88,18 88,32 C88,56 60,78 50,88 Z" />
                      </clipPath>
                    </defs>
                    {/* Background Heart Fill */}
                    <path
                      d="M50,88 C40,78 12,56 12,32 C12,18 24,10 36,10 C44,10 48,16 50,20 C52,16 56,10 64,10 C76,10 88,18 88,32 C88,56 60,78 50,88 Z"
                      fill="#f9f0e0"
                      stroke="#211b12"
                      strokeWidth="6"
                    />
                  </svg>

                  {/* Clipped Image: Ahmad */}
                  <img
                    src={activeCouple.groom.image}
                    alt={activeCouple.groom.name}
                    className="absolute inset-0 w-full h-full object-cover scale-110"
                    style={{
                      clipPath:
                        'path("M50,88 C40,78 12,56 12,32 C12,18 24,10 36,10 C44,10 48,16 50,20 C52,16 56,10 64,10 C76,10 88,18 88,32 C88,56 60,78 50,88 Z")',
                    }}
                  />

                  {/* Inner Heart Hand-drawn Ink Contour */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none text-[#211b12]"
                    viewBox="0 0 100 100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M50,88 C40,78 12,56 12,32 C12,18 24,10 36,10 C44,10 48,16 50,20 C52,16 56,10 64,10 C76,10 88,18 88,32 C88,56 60,78 50,88 Z" />
                    {/* Double outline sketch accent */}
                    <path
                      d="M52,82 C60,73 82,54 82,34 C82,22 73,16 64,16 C57,16 54,20 52,24"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                      opacity="0.6"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CHUNKY HAND-LETTERED DISPLAY TEXT */}
        <div className="mt-4 flex flex-col items-center select-none">
          <span
            className="text-[42px] sm:text-[52px] font-black text-[#211b12] tracking-wider leading-[1.02] font-heading"
            style={{
              textShadow: '1px 1px 0px rgba(74,66,56,0.3)',
              letterSpacing: '0.04em',
            }}
          >
            WE'RE
          </span>
          <span
            className="text-[44px] sm:text-[56px] font-black text-[#211b12] tracking-wider leading-[1.02] font-heading mt-0.5"
            style={{
              textShadow: '1px 1px 0px rgba(74,66,56,0.3)',
              letterSpacing: '0.04em',
            }}
          >
            GETTING
          </span>
          <span
            className="text-[46px] sm:text-[60px] font-black text-[#cc3a63] tracking-wider leading-[1.02] font-heading mt-0.5"
            style={{
              textShadow: '1px 1px 0px rgba(74,66,56,0.3)',
              letterSpacing: '0.04em',
            }}
          >
            MARRIED!
          </span>
        </div>

        {/* Subtitle / Couple Name Tag */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f9f0e0] border border-[#4a4238] shadow-[2px_2px_0px_#4a4238]">
          <Sparkles className="w-3.5 h-3.5 text-[#cc3a63]" />
          <span className="text-[13px] font-bold text-[#211b12]">
            {activeCouple.groom.name} &amp; {activeCouple.bride.name}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#cc3a63]" />
        </div>

        {/* Scroll Down Indicator to Quote & Full Schedule */}
        <button
          onClick={onScrollNext}
          className="mt-6 inline-flex flex-col items-center text-[#7a7065] hover:text-[#cc3a63] transition-colors cursor-pointer group"
          aria-label="Lihat detail undangan"
        >
          <span className="text-[11px] font-bold tracking-wider uppercase group-hover:underline">
            Buka Rangkaian Doa &amp; Acara
          </span>
          <div className="mt-1 w-8 h-8 rounded-full bg-[#f9f0e0] border border-[#4a4238] flex items-center justify-center shadow-[1px_2px_0px_#4a4238] group-hover:translate-y-0.5 transition-transform">
            <ChevronDown className="w-4 h-4 text-[#211b12] animate-bounce" />
          </div>
        </button>
      </div>
    </section>
  );
};
