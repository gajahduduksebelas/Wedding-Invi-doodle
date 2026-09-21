import React from 'react';

export const QuoteSection: React.FC = () => {
  return (
    <section id="quoteSection" className="px-4 py-4 flex flex-col items-center">
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-[3px_4px_0px_#4a4238] border-2 border-[#4a4238] text-center relative">
        {/* Decorative Doodle Flourish SVG */}
        <div className="flex justify-center mb-3">
          <svg
            className="w-36 h-6 text-[#cc3a63]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2.5"
            viewBox="0 0 160 24"
          >
            <path d="M8 12 Q24 2 40 12 T72 12 T104 12 T136 12 Q152 22 156 12" />
            <circle cx="80" cy="12" fill="currentColor" r="3.5" />
          </svg>
        </div>

        <p className="text-[14px] text-[#2b2620] leading-relaxed italic font-medium">
          "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan
          pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung
          dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa
          kasih dan sayang."
        </p>

        <span className="inline-block mt-3 px-3.5 py-1 rounded-full bg-[#f9f0e0] text-[13px] text-[#2b2620] font-bold border border-[#a2ab73]/60">
          QS. Ar-Rum: 21
        </span>
      </div>
    </section>
  );
};
