import React from 'react';
import { CoupleData } from '../types';
import {
  DoodleKissingBirds,
  DoodleHeartBalloons,
  DoodleGiftBox,
} from './DoodleIcons';

interface ClosingSectionProps {
  couple?: CoupleData;
}

export const ClosingSection: React.FC<ClosingSectionProps> = ({ couple }) => {
  const groomNickname = couple?.groom.nickname || 'Arga';
  const brideNickname = couple?.bride.nickname || 'Kirana';
  const weddingDate = couple?.weddingDate || 'Minggu, 14 Februari 2027';

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* ============================================================ */}
      {/* 1. CLOSING SECTION                                           */}
      {/* ============================================================ */}
      <section
        id="closing"
        aria-label="Penutup"
        className="w-full px-4 pt-10 pb-8 flex flex-col items-center justify-center text-center relative"
      >
        <div className="w-full max-w-[400px] flex flex-col items-center relative z-20">
          {/* Hand-drawn mail doodle */}
          <div className="mb-4">
            <DoodleGiftBox className="w-16 h-auto" />
          </div>

          {/* "Terima kasih" in Allura */}
          <p className="font-allura text-[38px] sm:text-[44px] text-[#B4533C] leading-none mb-1">
            Terima kasih
          </p>

          <p className="text-[13px] text-stone-700 max-w-[330px] leading-relaxed my-3 font-normal">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
          </p>

          {/* Couple Names */}
          <h2 className="font-serif text-[30px] sm:text-[34px] font-normal text-[#B4533C] mt-2">
            {groomNickname} &amp; {brideNickname}
          </h2>

          <p className="font-serif text-[13px] text-stone-600 mt-1">
            {weddingDate}
          </p>

          {/* Kissing Birds and Heart Balloon Doodles */}
          <div className="w-full flex items-center justify-between mt-4 px-2">
            <DoodleKissingBirds className="w-20 sm:w-24 h-auto" />
            <DoodleHeartBalloons className="w-14 sm:w-16 h-auto" />
          </div>

          {/* Bottom Card in Sand/Mustard tone matching IMG_2713.PNG */}
          <div className="w-full rounded-[28px] bg-[#EBD9A0] border-[2.5px] border-[#181818] shadow-[6px_6px_0px_#181818] p-6 mt-4 flex flex-col items-center text-center">
            {/* Pill Tag */}
            <div className="px-4 py-1 rounded-full bg-white border-[2px] border-[#181818] text-[12px] font-black text-[#181818] mb-3">
              #{groomNickname}&amp;{brideNickname}
            </div>

            <p className="text-[14px] font-black text-[#181818]">
              {groomNickname} &amp; {brideNickname} Wedding Celebration
            </p>

            {/* Subtext in Allura cursive */}
            <p className="font-allura text-[24px] sm:text-[26px] text-[#B4533C] mt-2 leading-snug">
              Dibuat dengan cinta, coretan doodle &amp; senyuman
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
