import React, { useEffect } from 'react';

interface EnvelopeOpeningProps {
  groomName: string;
  brideName: string;
  onDone: () => void;
}

// Total length of the sequence in index.css (.envelope-*) — keep in sync.
const DURATION_MS = 2300;

/**
 * Full-screen envelope that opens when the guest taps "Buka Undangan": the
 * flap swings up, the letter rises out, then everything zooms and fades to
 * reveal the invitation that is already rendered underneath.
 */
export const EnvelopeOpening: React.FC<EnvelopeOpeningProps> = ({ groomName, brideName, onDone }) => {
  useEffect(() => {
    const timer = window.setTimeout(onDone, DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="envelope-overlay fixed inset-0 z-[60] flex items-center justify-center" aria-hidden="true">
      <div className="envelope-stage">
        <div className="envelope">
          {/* back of the envelope */}
          <div className="envelope-back" />

          {/* the letter, tucked inside */}
          <div className="envelope-letter">
            <span className="font-allura text-[22px] text-[#B4533C] leading-none">Undangan Pernikahan</span>
            <span className="font-delicious text-[30px] leading-tight text-[#181818] uppercase tracking-wide mt-1">
              {groomName} &amp; {brideName}
            </span>
            <svg viewBox="0 0 100 12" className="w-16 h-2.5 mt-1 overflow-visible">
              <path
                d="M3 6.5C18 3.5 32 8.5 48 5.5C64 3 78 8 97 6"
                stroke="#B4533C"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* front pocket */}
          <svg className="envelope-front" viewBox="0 0 280 190" preserveAspectRatio="none">
            <path d="M2 30 L140 118 L278 30 L278 176 Q278 188 266 188 L14 188 Q2 188 2 176 Z" fill="#EFE3C6" />
            <path d="M2 188 L112 100 M278 188 L168 100" stroke="#181818" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
            <path d="M2 30 L140 118 L278 30 L278 176 Q278 188 266 188 L14 188 Q2 188 2 176 Z" fill="none" stroke="#181818" strokeWidth="3" strokeLinejoin="round" />
          </svg>

          {/* flap with a wax heart seal */}
          <div className="envelope-flap">
            {/* Reaches just past the pocket's V so the letter can't show between them */}
            <svg viewBox="0 0 280 132" preserveAspectRatio="none" className="w-full h-full">
              <path d="M3 3 L3 34 L140 128 L277 34 L277 3 Z" fill="#E8D7B0" stroke="#181818" strokeWidth="3" strokeLinejoin="round" />
            </svg>
            <span className="envelope-seal">
              <svg viewBox="-14 -14 28 28" className="w-full h-full">
                <circle r="12" fill="#B4533C" stroke="#181818" strokeWidth="2.2" />
                <path d="M0 -1 C-2.5 -5 -8 -3 -5 1.5 L0 6 L5 1.5 C8 -3 2.5 -5 0 -1 Z" fill="#FFFFFF" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
