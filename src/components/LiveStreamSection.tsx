import React from 'react';
import { LiveStreamConfig } from '../types';
import { DoodleOverlappingEnvelopes, SectionHeading } from './DoodleIcons';

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
      aria-label="Siaran Langsung"
      className="w-full px-4 py-8 flex flex-col items-center justify-center select-none"
    >
      {/* Mint green backdrop container matching IMG_2713.PNG */}
      <div className="w-full max-w-[400px] rounded-[30px] bg-[#D7E7DD] p-4 sm:p-5 relative pt-10">
        {/* Overlapping Envelopes Doodle at top center */}
        <div className="absolute -top-6 left-6 sm:left-8 z-30 pointer-events-none">
          <DoodleOverlappingEnvelopes className="w-18 sm:w-20 h-auto" />
        </div>

        {/* Card Body */}
        <div className="w-full doodle-card p-6 sm:p-7 flex flex-col items-center text-center relative z-20">
          <SectionHeading
            subheadline="Saksikan dari mana saja"
            headline="LIVE STREAMING"
            subheadlineColor="#2C4233"
            headlineColor="#181818"
            underlineColor="#181818"
            className="mb-3"
          />

          <p className="text-[13px] text-stone-700 leading-relaxed mb-4 font-normal max-w-[300px]">
            Kami mengundang Bapak/Ibu/Saudara/i untuk menyaksikan pernikahan kami secara virtual yang disiarkan langsung melalui media sosial di bawah ini
          </p>

          <p className="text-[13.5px] font-bold text-[#181818] mb-5">
            {liveDate} · {liveTime} {liveTz}
          </p>

          <a
            href={liveUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center px-8 py-2.5 rounded-full bg-[#EFE6CF] border-[2px] border-[#181818] shadow-[3.5px_3.5px_0px_#181818] text-[#181818] text-[13px] font-bold hover:bg-[#e4dac1] active:translate-y-0.5 transition-all cursor-pointer"
          >
            <span>Saksikan Live</span>
          </a>
        </div>
      </div>
    </section>
  );
};
