import React from 'react';
import { DOODLE_ASSETS } from '../data/weddingData';
import { LiveStreamConfig } from '../types';
import { Video, ExternalLink, Sparkles, Heart } from 'lucide-react';

interface LiveStreamSectionProps {
  config?: LiveStreamConfig;
}

export const LiveStreamSection: React.FC<LiveStreamSectionProps> = ({ config }) => {
  const liveUrl = config?.platformUrl || 'https://youtube.com/live/argakirana';
  const liveDate = config?.date || 'Minggu, 14 Februari 2027';
  const liveTime = config?.time || '09:00';
  const liveTz = config?.timezone || 'WIB';

  return (
    <section
      id="stream"
      className="min-h-dvh w-full px-4 py-8 flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Floating Random Doodle Assets */}
      <img
        src={DOODLE_ASSETS.envelopes}
        alt=""
        aria-hidden="true"
        className="absolute top-5 left-3 w-14 sm:w-16 h-14 sm:h-16 object-contain pointer-events-none opacity-85 animate-doodle-slow z-10"
      />
      <img
        src={DOODLE_ASSETS.bells}
        alt=""
        aria-hidden="true"
        className="absolute top-5 right-3 w-14 sm:w-16 h-14 sm:h-16 object-contain pointer-events-none opacity-85 animate-doodle-sway z-10"
      />
      <img
        src={DOODLE_ASSETS.toast}
        alt=""
        aria-hidden="true"
        className="absolute bottom-5 left-3 w-12 sm:w-14 h-12 sm:h-14 object-contain pointer-events-none opacity-85 animate-doodle-bob z-10"
      />
      <img
        src={DOODLE_ASSETS.heartArrow}
        alt=""
        aria-hidden="true"
        className="absolute bottom-5 right-3 w-12 sm:w-14 h-12 sm:h-14 object-contain pointer-events-none opacity-85 animate-doodle-float z-10"
      />

      <div className="absolute top-1/3 left-6 text-[#8b965f]/40 pointer-events-none animate-doodle-pulse">
        <Sparkles className="w-5 h-5" />
      </div>
      <div className="absolute bottom-1/3 right-6 text-[#cc3a63]/30 pointer-events-none animate-doodle-pulse">
        <Heart className="w-4 h-4 fill-current" />
      </div>

      <div className="w-full max-w-[400px] rounded-3xl bg-white/95 p-6 sm:p-8 shadow-[0_12px_40px_rgba(74,66,56,0.08)] flex flex-col items-center text-center relative z-20 my-auto overflow-hidden">
        {/* Top Washi Tape */}
        <div
          className="absolute -top-3 w-28 h-6 cd-tape-sage -rotate-1 rounded-xs shadow-xs pointer-events-none"
          aria-hidden="true"
        />

        {/* Heading Sage */}
        <header className="cd-heading cd-heading-sage mb-3 mt-1">
          <span>Saksikan dari mana saja</span>
          <h2>LIVE STREAMING</h2>
          <i aria-hidden="true" />
        </header>

        <p className="text-[13px] text-[#524348] leading-relaxed mb-4 font-sans">
          Kami mengundang Bapak/Ibu/Saudara/i untuk menyaksikan pernikahan kami secara virtual yang disiarkan langsung melalui tautan di bawah ini.
        </p>

        <div className="px-4 py-1.5 rounded-full bg-[#f0f3e3] text-[12.5px] font-bold text-[#3b411e] mb-5 shadow-xs">
          <strong>{liveDate} · {liveTime} {liveTz}</strong>
        </div>

        <a
          href={liveUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#8b965f] text-white text-[14px] font-bold shadow-[0_4px_14px_rgba(139,150,95,0.35)] hover:bg-[#788350] active:translate-y-0.5 transition-all cursor-pointer"
        >
          <Video className="w-4 h-4" />
          <span>Saksikan Live</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      </div>
    </section>
  );
};
