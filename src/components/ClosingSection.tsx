import React from 'react';
import { CoupleData } from '../types';
import { Doodle, DoodleScatter } from './DoodleScatter';

interface ClosingSectionProps {
  couple?: CoupleData;
}

export const ClosingSection: React.FC<ClosingSectionProps> = ({ couple }) => {
  const groomNickname = couple?.groom.nickname || 'Arga';
  const brideNickname = couple?.bride.nickname || 'Kirana';
  const weddingDate = couple?.weddingDate || 'Minggu, 14 Februari 2027';

  return (
    <div className="mobile-snap-section w-full flex flex-col items-center select-none justify-center px-4 py-6 relative isolate overflow-hidden">
      <DoodleScatter seed="closing" prefer={['doves', 'heartBalloons', 'weddingCake', 'giftBox']} />

      {/* ============================================================ */}
      {/* 1. CLOSING SECTION                                           */}
      {/* ============================================================ */}
      <section
        id="closing"
        aria-label="Penutup"
        className="w-full max-w-[400px] flex flex-col items-center justify-center text-center relative my-auto animate-doodle-in"
      >
        <div className="w-full flex flex-col items-center relative z-20">
          {/* The couple walking off together */}
          <div className="mb-1">
            <Doodle name="coupleWalking" alt="" className="w-28 sm:w-32 h-auto" />
          </div>

          {/* "Terima kasih" in Allura */}
          <p className="font-allura text-[36px] sm:text-[42px] text-[#B4533C] leading-none mb-1">
            Terima kasih
          </p>

          <p className="text-[12px] sm:text-[12.5px] text-stone-700 max-w-[330px] leading-relaxed my-2 font-normal">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
          </p>

          {/* Couple Names */}
          <h2 className="font-serif text-[26px] sm:text-[30px] font-normal text-[#B4533C] mt-1">
            {groomNickname} &amp; {brideNickname}
          </h2>

          <p className="font-serif text-[12px] text-stone-600">
            {weddingDate}
          </p>

          {/* Just married! */}
          <Doodle name="weddingCar" className="w-36 sm:w-40 h-auto mt-3 -rotate-2" />

          {/* Bottom Card in Sand/Mustard tone matching IMG_2713.PNG */}
          <div className="w-full rounded-[24px] bg-[#EBD9A0] border-[2px] border-[#181818] shadow-[5px_5px_0px_#181818] p-5 mt-3 flex flex-col items-center text-center">
            {/* Pill Tag */}
            <div className="px-3.5 py-0.5 rounded-full bg-white border-[1.5px] border-[#181818] text-[11px] font-black text-[#181818] mb-2">
              #{groomNickname}&amp;{brideNickname}
            </div>

            <p className="text-[13.5px] font-black text-[#181818]">
              {groomNickname} &amp; {brideNickname} Wedding Celebration
            </p>

            {/* Subtext in Allura cursive */}
            <p className="font-allura text-[22px] sm:text-[24px] text-[#B4533C] mt-1 leading-snug">
              Dibuat oleh Fadly dan Anna dengan cinta dan senyuman
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
