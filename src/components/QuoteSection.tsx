import React from 'react';
import { SectionHeading } from './DoodleIcons';
import { Doodle, DoodleScatter } from './DoodleScatter';

export const QuoteSection: React.FC = () => {
  return (
    <section
      id="quote"
      aria-label="Kutipan Pernikahan"
      className="mobile-snap-section w-full px-4 py-6 flex flex-col items-center justify-center relative isolate overflow-hidden select-none"
    >
      <DoodleScatter seed="quote" prefer={['doves', 'rose', 'loveLetter']} feature="rings" />

      <div className="w-full max-w-[400px] relative pt-6 my-auto animate-doodle-in">
        {/* Ring box perched on top center */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <Doodle name="ringBox" className="w-16 h-auto" />
        </div>

        {/* Card Container */}
        <div className="w-full doodle-card p-6 sm:p-8 text-center flex flex-col items-center relative z-20 pt-10">
          <SectionHeading
            subheadline="Dengan cinta"
            headline="WITH LOVE"
            subheadlineColor="#3E5B3D"
            headlineColor="#181818"
            underlineColor="#181818"
            className="mb-4"
          />

          <blockquote className="font-serif text-[14px] sm:text-[14.5px] text-[#24211e] leading-relaxed text-center px-1 font-normal">
            “Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.”
          </blockquote>

          <p className="mt-4 text-[13px] font-bold text-[#B4533C] tracking-wide">
            (Qs. Ar-Rum : 21)
          </p>
        </div>
      </div>
    </section>
  );
};
