import React from 'react';
import { COUPLE_DATA, DEFAULT_COVER_IMAGE } from '../data/weddingData';
import { CoupleData } from '../types';
import { DoodleHeartBalloons } from './DoodleIcons';
import { TornPaperEdge } from './PaperEdge';

interface AnnouncementSectionProps {
  onScrollNext: () => void;
  couple?: CoupleData;
}

export const AnnouncementSection: React.FC<AnnouncementSectionProps> = ({ couple }) => {
  const activeCouple = couple || COUPLE_DATA;
  const groomName = activeCouple.groom.nickname || 'Rendra';
  const brideName = activeCouple.bride.nickname || 'Naya';
  const weddingDate = activeCouple.weddingDate || 'Minggu, 14 Februari 2027';
  const coverImage = activeCouple.coverImage || DEFAULT_COVER_IMAGE;

  return (
    <section
      id="home"
      aria-label="Pembuka Undangan"
      className="mobile-snap-section w-full flex flex-col items-center justify-start! relative overflow-hidden select-none"
    >
      {/* Cover photo: the top half of the screen, cropped 1:1 in the CMS,
          with paper grain and a torn-paper edge into the page below. */}
      <div className="relative w-full max-w-[460px] shrink-0">
        <div className="paper-grain w-full aspect-square max-h-[50dvh] overflow-hidden bg-[#EFE3C6]">
          <img
            src={coverImage}
            alt={`${groomName} & ${brideName}`}
            className="w-full h-full object-cover animate-cover-in"
          />
        </div>
        <TornPaperEdge className="absolute left-0 right-0 -bottom-px z-10" />
      </div>

      <div className="relative w-full max-w-[380px] px-4 flex flex-col items-center text-center z-20 my-auto animate-doodle-in">
        {/* Heart balloons tucked beside the title */}
        <div className="absolute -top-8 right-1 z-10 pointer-events-none">
          <DoodleHeartBalloons className="w-12 sm:w-14 h-auto" />
        </div>

        {/* Display Title: KAMI AKAN MENIKAH! */}
        <h1 className="font-delicious text-[44px] sm:text-[50px] leading-[0.95] text-[#181818] tracking-wide uppercase">
          KAMI AKAN
          <br />
          MENIKAH!
        </h1>
        <p className="font-allura text-[32px] sm:text-[36px] text-[#B4533C] mt-2 leading-none">
          {groomName} &amp; {brideName}
        </p>

        {/* Date Pill Badge */}
        <div className="mt-4 px-5 py-2 rounded-full bg-[#EFE3C6] border-[2px] border-[#181818] shadow-[3.5px_3.5px_0px_#181818] text-[13.5px] font-bold text-[#181818]">
          {weddingDate}
        </div>
      </div>
    </section>
  );
};
