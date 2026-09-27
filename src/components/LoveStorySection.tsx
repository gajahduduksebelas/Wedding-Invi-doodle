import React from 'react';
import { LoveStoryItem } from '../types';
import { DoodleBigHeartOutline, SectionHeading } from './DoodleIcons';

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
      className="w-full px-4 py-10 flex flex-col items-center justify-center relative select-none"
    >
      {/* Floating Big Heart Doodle on Right */}
      <div className="absolute top-10 right-2 z-10 pointer-events-none opacity-85">
        <DoodleBigHeartOutline className="w-20 sm:w-24 h-auto" />
      </div>

      <div className="w-full max-w-[400px] flex flex-col items-center relative z-20">
        <SectionHeading
          subheadline="Bab demi bab"
          headline="LOVE STORY"
          subheadlineColor="#B4533C"
          headlineColor="#181818"
          underlineColor="#B4533C"
          className="mb-6"
        />

        {/* Timeline Container */}
        <div className="w-full relative pl-8 pr-1 space-y-6">
          {/* Vertical dashed timeline line */}
          <div className="absolute left-[13px] top-4 bottom-6 w-0.5 border-l-2 border-dashed border-[#181818]" />

          {activeStories.map((item, idx) => {
            const cardBg = stepColors[idx % stepColors.length];

            return (
              <article key={item.id || idx} className="relative flex items-start group">
                {/* Step Number Circle Badge */}
                <div className="absolute -left-8 top-3 w-7 h-7 rounded-full bg-[#B4533C] text-white border-[2px] border-[#181818] shadow-xs flex items-center justify-center text-[12px] font-bold z-10">
                  {item.stepNumber || idx + 1}
                </div>

                {/* Story Card */}
                <div
                  className={`w-full rounded-[24px] border-[2.5px] border-[#181818] shadow-[5px_5px_0px_#181818] p-5 ${cardBg} relative`}
                >
                  <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#181818] block mb-1">
                    {item.label}
                  </span>
                  <h3 className="font-serif text-[18px] sm:text-[19px] font-bold text-[#181818] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-[#24211e] mt-2 leading-relaxed font-normal">
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
