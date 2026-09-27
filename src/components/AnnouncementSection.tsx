import React from 'react';
import { COUPLE_DATA } from '../data/weddingData';
import { CoupleData } from '../types';
import {
  DoodleDualHeartLocket,
  DoodleFlyingBird,
  DoodleHeartBalloons,
} from './DoodleIcons';

interface AnnouncementSectionProps {
  onScrollNext: () => void;
  couple?: CoupleData;
}

export const AnnouncementSection: React.FC<AnnouncementSectionProps> = ({ couple }) => {
  const activeCouple = couple || COUPLE_DATA;
  const groomName = activeCouple.groom.nickname || 'Arga';
  const brideName = activeCouple.bride.nickname || 'Kirana';
  const weddingDate = activeCouple.weddingDate || 'Minggu, 14 Februari 2027';

  return (
    <section
      id="home"
      aria-label="Pembuka Undangan"
      className="mobile-snap-section w-full py-6 px-4 flex flex-col items-center justify-center relative overflow-hidden select-none"
    >
      {/* Top Left: Flying Bird Doodle */}
      <div className="absolute top-4 left-3 z-10 pointer-events-none">
        <DoodleFlyingBird className="w-14 sm:w-18 h-auto" />
      </div>

      {/* Top Right: Heart Balloons Doodle */}
      <div className="absolute top-10 right-2 z-10 pointer-events-none">
        <DoodleHeartBalloons className="w-14 sm:w-18 h-auto" />
      </div>

      <div className="w-full max-w-[380px] flex flex-col items-center text-center relative z-20 my-auto animate-doodle-in">
        {/* DUEL HEART LOCKET WITH BOW AT TOP */}
        <DoodleDualHeartLocket
          groomImg={activeCouple.groom.image}
          brideImg={activeCouple.bride.image}
          className="mb-3"
        />

        {/* Display Title: KAMI AKAN MENIKAH! */}
        <div className="flex flex-col items-center mt-1">
          <h1 className="font-delicious text-[44px] sm:text-[50px] leading-[0.95] text-[#181818] tracking-wide uppercase">
            KAMI AKAN<br />MENIKAH!
          </h1>
          <p className="font-allura text-[32px] sm:text-[36px] text-[#B4533C] mt-2 leading-none">
            {groomName} &amp; {brideName}
          </p>

          {/* Date Pill Badge */}
          <div className="mt-4 px-5 py-2 rounded-full bg-[#EFE3C6] border-[2px] border-[#181818] shadow-[3.5px_3.5px_0px_#181818] text-[13.5px] font-bold text-[#181818]">
            {weddingDate}
          </div>
        </div>
      </div>
    </section>
  );
};
