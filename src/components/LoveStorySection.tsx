import React from 'react';
import { DOODLE_ASSETS } from '../data/weddingData';
import { LoveStoryItem } from '../types';
import { Sparkles, Heart } from 'lucide-react';

interface LoveStorySectionProps {
  stories?: LoveStoryItem[];
}

export const LoveStorySection: React.FC<LoveStorySectionProps> = ({ stories }) => {
  const defaultStories: LoveStoryItem[] = [
    {
      id: 'story-1',
      stepNumber: 1,
      label: 'Awal Cerita',
      title: 'Pertama kali bertemu',
      text: 'Kisah kami dimulai tanpa rencana. Sebuah perkenalan membawa kami pada banyak percakapan, pertemuan, dan momen sederhana yang perlahan terasa istimewa.',
    },
    {
      id: 'story-2',
      stepNumber: 2,
      label: 'Lamaran',
      title: 'Menjalin cerita',
      text: 'Setelah melewati berbagai perjalanan bersama, kami semakin yakin untuk membawa hubungan ini menuju masa depan. Di hadapan keluarga, kami menyampaikan niat dan mengikat komitmen untuk melangkah bersama.',
    },
    {
      id: 'story-3',
      stepNumber: 3,
      label: 'Pernikahan',
      title: 'Menuju babak baru',
      text: 'Dengan penuh syukur, kami tiba pada awal perjalanan baru. Bukan sebagai akhir dari kisah cinta, tetapi sebagai permulaan untuk tumbuh, berbagi, dan membangun kehidupan bersama.',
    },
  ];

  const activeStories = stories && stories.length > 0 ? stories : defaultStories;

  return (
    <section
      id="story"
      className="min-h-dvh w-full px-4 py-8 flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Floating Random Doodle Assets */}
      <img
        src={DOODLE_ASSETS.heartArrow}
        alt=""
        aria-hidden="true"
        className="absolute top-5 left-3 w-14 sm:w-16 h-14 sm:h-16 object-contain pointer-events-none opacity-85 animate-doodle-float z-10"
      />
      <img
        src={DOODLE_ASSETS.envelopes}
        alt=""
        aria-hidden="true"
        className="absolute top-6 right-3 w-14 sm:w-16 h-14 sm:h-16 object-contain pointer-events-none opacity-85 animate-doodle-slow z-10"
      />
      <img
        src={DOODLE_ASSETS.bouquet}
        alt=""
        aria-hidden="true"
        className="absolute bottom-5 left-3 w-12 sm:w-14 h-12 sm:h-14 object-contain pointer-events-none opacity-85 animate-doodle-bob z-10"
      />
      <img
        src={DOODLE_ASSETS.rings}
        alt=""
        aria-hidden="true"
        className="absolute bottom-5 right-3 w-12 sm:w-14 h-12 sm:h-14 object-contain pointer-events-none opacity-85 animate-doodle-sway z-10"
      />

      <div className="absolute top-1/3 right-6 text-[#cc3a63]/30 pointer-events-none animate-doodle-pulse">
        <Heart className="w-4 h-4 fill-current" />
      </div>
      <div className="absolute bottom-1/3 left-6 text-[#8b965f]/40 pointer-events-none animate-doodle-pulse">
        <Sparkles className="w-5 h-5" />
      </div>

      <div className="w-full max-w-[420px] flex flex-col items-center relative z-20 my-auto">
        {/* Heading Coral */}
        <header className="cd-heading cd-heading-coral mb-4">
          <span>Bab demi bab</span>
          <h2>LOVE STORY</h2>
          <i aria-hidden="true" />
        </header>

        {/* Timeline Container (Border-free clean paper cards) */}
        <div className="w-full relative pl-6 pr-2 space-y-4">
          {/* Sketched dashed vertical line */}
          <div className="absolute left-[29px] top-4 bottom-6 w-0.5 border-l-2 border-dashed border-[#4a4238]/30" />

          {activeStories.map((item, idx) => (
            <article
              key={item.id || idx}
              className="relative flex items-start gap-3.5 group"
            >
              {/* Step Number Dot */}
              <div className="w-7 h-7 rounded-full bg-[#cc3a63] text-white font-bold text-[12.5px] flex items-center justify-center shadow-xs shrink-0 z-10 font-heading">
                {item.stepNumber || idx + 1}
              </div>

              {/* Note Card */}
              <div className="flex-1 bg-white/95 rounded-2xl p-4 shadow-[0_8px_25px_rgba(74,66,56,0.06)] relative">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#cc3a63] block mb-0.5 font-sans">
                  {item.label}
                </span>
                <h3 className="text-[16px] font-bold text-[#2b2620] font-heading leading-tight">
                  {item.title}
                </h3>
                <p className="text-[12.5px] text-[#524348] mt-1 leading-relaxed font-sans">
                  {item.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
