import React from 'react';
import { LoveStoryItem } from '../types';
import { DoodleBigHeartOutline, SectionHeading } from './DoodleIcons';
import { DoodleScatter } from './DoodleScatter';

interface LoveStorySectionProps {
  stories?: LoveStoryItem[];
}

export const LoveStorySection: React.FC<LoveStorySectionProps> = ({ stories }) => {
  const defaultStories: LoveStoryItem[] = [
    {
      id: 'story-1',
      stepNumber: 1,
      label: 'AWAL CERITA',
      title: 'Pertama kali bertemu',
      text: 'Kisah kami dimulai tanpa rencana. Sebuah perkenalan membawa kami pada banyak percakapan, pertemuan, dan momen sederhana yang perlahan terasa istimewa.',
    },
    {
      id: 'story-2',
      stepNumber: 2,
      label: 'LAMARAN',
      title: 'Menjalin cerita',
      text: 'Setelah melewati berbagai perjalanan bersama, kami semakin yakin untuk membawa hubungan ini menuju masa depan. Di hadapan keluarga, kami menyampaikan niat dan mengikat komitmen untuk melangkah bersama.',
    },
    {
      id: 'story-3',
      stepNumber: 3,
      label: 'PERNIKAHAN',
      title: 'Menuju babak baru',
      text: 'Dengan penuh syukur, kami tiba pada awal perjalanan baru. Bukan sebagai akhir dari kisah cinta, tetapi sebagai permulaan untuk tumbuh, berbagi, dan membangun kehidupan bersama.',
    },
  ];

  const activeStories = stories && stories.length > 0 ? stories : defaultStories;

  // Background colors per step matching IMG_2713.PNG
  const stepColors = [
    'bg-[#F7DCD7]', // Peach / blush
    'bg-[#DCE9DB]', // Sage / mint
    'bg-[#F4C9C1]', // Dusty rose
  ];

  return (
    <section
      id="story"
      aria-label="Kisah Cinta"
      className="mobile-snap-section w-full px-4 py-6 flex flex-col items-center justify-center relative isolate overflow-hidden select-none"
    >
      <DoodleScatter seed="story" prefer={['heartArrow', 'holdingHands', 'loveLetter']} />

      {/* Floating Big Heart Doodle on Right */}
      <div className="absolute top-8 right-2 z-10 pointer-events-none opacity-85">
        <DoodleBigHeartOutline className="w-18 sm:w-22 h-auto" />
      </div>

      <div className="w-full max-w-[400px] flex flex-col items-center relative z-20 my-auto animate-doodle-in">
        <SectionHeading
          subheadline="Bab demi bab"
          headline="LOVE STORY"
          subheadlineColor="#B4533C"
          headlineColor="#181818"
          underlineColor="#B4533C"
          className="mb-3.5"
        />

        {/* Timeline Container */}
        <div className="w-full relative pl-7 pr-1 space-y-3.5">
          {/* Vertical dashed timeline line */}
          <div className="absolute left-[11px] top-3 bottom-5 w-0.5 border-l-2 border-dashed border-[#181818]" />

          {activeStories.map((item, idx) => {
            const cardBg = stepColors[idx % stepColors.length];

            return (
              <article key={item.id || idx} className="relative flex items-start group">
                {/* Step Number Circle Badge */}
                <div className="absolute -left-7 top-2.5 w-6 h-6 rounded-full bg-[#B4533C] text-white border-[1.5px] border-[#181818] shadow-xs flex items-center justify-center text-[11px] font-bold z-10">
                  {item.stepNumber || idx + 1}
                </div>

                {/* Story Card */}
                <div
                  className={`w-full rounded-[20px] border-[2px] border-[#181818] shadow-[4px_4px_0px_#181818] p-3.5 sm:p-4 ${cardBg} relative`}
                >
                  <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#181818] block mb-0.5">
                    {item.label}
                  </span>
                  <h3 className="font-serif text-[15.5px] sm:text-[17px] font-bold text-[#181818] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[12px] text-[#24211e] mt-1 leading-relaxed font-normal">
                    {item.text}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
