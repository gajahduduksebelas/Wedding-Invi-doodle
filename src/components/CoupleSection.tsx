import React from 'react';
import { Heart, Instagram } from 'lucide-react';
import { COUPLE_DATA } from '../data/weddingData';

export const CoupleSection: React.FC = () => {
  return (
    <section id="coupleSection" className="px-4 py-4 flex flex-col items-center">
      <div className="w-full max-w-[420px] flex flex-col gap-4">
        <div className="text-center">
          <span className="text-[12px] font-bold text-[#cc3a63] tracking-widest uppercase block">
            Mempelai Bahagia
          </span>
          <h2 className="text-[26px] font-bold text-[#2b2620] font-heading mt-0.5">
            Dua Hati Bersatu
          </h2>
        </div>

        {/* Groom Card */}
        <div className="rounded-2xl bg-white p-5 shadow-[3px_4px_0px_#4a4238] border-2 border-[#4a4238] flex flex-col items-center text-center relative">
          <div className="w-28 h-28 rounded-full overflow-hidden shadow-[2px_3px_0px_#4a4238] border-2 border-[#4a4238] mb-3 relative bg-[#f9f0e0]">
            <img
              src={COUPLE_DATA.groom.image}
              alt={COUPLE_DATA.groom.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <h3 className="text-[20px] font-bold text-[#cc3a63] font-heading">
            {COUPLE_DATA.groom.name}
          </h3>
          <p className="text-[13px] font-semibold text-[#524348] mt-1 max-w-[260px] leading-snug">
            {COUPLE_DATA.groom.role}
          </p>
          <a
            href={`https://instagram.com/${COUPLE_DATA.groom.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f9f0e0] text-[#2b2620] text-[12px] font-bold shadow-sm border border-[#e6dac5] hover:bg-[#edd9bf] active:scale-95 transition-all"
          >
            <Instagram className="w-3.5 h-3.5 text-[#cc3a63]" />
            <span>@{COUPLE_DATA.groom.instagram}</span>
          </a>
        </div>

        {/* Whimsical Center Connector */}
        <div className="flex items-center justify-center -my-2 z-10">
          <div className="w-10 h-10 rounded-full bg-[#a2ab73] text-white flex items-center justify-center shadow-[2px_2px_0px_#4a4238] border-2 border-[#4a4238] -rotate-6 animate-pulse">
            <Heart className="w-5 h-5 fill-current text-white" />
          </div>
        </div>

        {/* Bride Card */}
        <div className="rounded-2xl bg-white p-5 shadow-[3px_4px_0px_#4a4238] border-2 border-[#4a4238] flex flex-col items-center text-center relative">
          <div className="w-28 h-28 rounded-full overflow-hidden shadow-[2px_3px_0px_#4a4238] border-2 border-[#4a4238] mb-3 relative bg-[#f9f0e0]">
            <img
              src={COUPLE_DATA.bride.image}
              alt={COUPLE_DATA.bride.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <h3 className="text-[20px] font-bold text-[#cc3a63] font-heading">
            {COUPLE_DATA.bride.name}
          </h3>
          <p className="text-[13px] font-semibold text-[#524348] mt-1 max-w-[260px] leading-snug">
            {COUPLE_DATA.bride.role}
          </p>
          <a
            href={`https://instagram.com/${COUPLE_DATA.bride.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f9f0e0] text-[#2b2620] text-[12px] font-bold shadow-sm border border-[#e6dac5] hover:bg-[#edd9bf] active:scale-95 transition-all"
          >
            <Instagram className="w-3.5 h-3.5 text-[#cc3a63]" />
            <span>@{COUPLE_DATA.bride.instagram}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
