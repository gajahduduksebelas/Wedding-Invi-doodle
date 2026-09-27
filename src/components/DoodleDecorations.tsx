import React from 'react';
import { DOODLE_ASSETS } from '../data/weddingData';

export const DoodleHeart: React.FC<{
  className?: string;
  fill?: string;
  stroke?: string;
  size?: number;
}> = ({
  className = '',
  fill = 'none',
  stroke = '#00AEE0',
  size = 24,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block pointer-events-none ${className}`}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export const DoodleStar: React.FC<{
  className?: string;
  color?: string;
  size?: number;
}> = ({ className = '', color = '#FED636', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`inline-block pointer-events-none ${className}`}
    style={{ color }}
  >
    <path d="M12 2l2.4 6.6L21 11l-5.3 4.2L17.4 22 12 18.2 6.6 22l1.7-6.8L3 11l6.6-2.4L12 2z" />
  </svg>
);

export const DoodleSparkle: React.FC<{
  className?: string;
  color?: string;
  size?: number;
}> = ({ className = '', color = '#00AEE0', size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`inline-block pointer-events-none ${className}`}
    style={{ color }}
  >
    <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
  </svg>
);

export const DoodleArrow: React.FC<{
  className?: string;
  text?: string;
  direction?: 'left' | 'right' | 'down';
  color?: string;
}> = ({ className = '', text, direction = 'right', color = '#0284C7' }) => (
  <div className={`inline-flex items-center gap-1.5 pointer-events-none select-none ${className}`}>
    {direction === 'left' && (
      <svg width="28" height="24" viewBox="0 0 32 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M28 4C24 16 12 18 4 14M4 14L10 8M4 14L9 20" />
      </svg>
    )}
    {text && (
      <span
        className="font-handdrawn text-[17px] leading-none"
        style={{ color, fontFamily: '"DeliciousHandrawn-Regular", "Delicious Handrawn", cursive' }}
      >
        {text}
      </span>
    )}
    {direction === 'right' && (
      <svg width="28" height="24" viewBox="0 0 32 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4C8 16 20 18 28 14M28 14L22 8M28 14L23 20" />
      </svg>
    )}
    {direction === 'down' && (
      <svg width="24" height="28" viewBox="0 0 24 32" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4C14 10 16 20 12 28M12 28L6 22M12 28L18 22" />
      </svg>
    )}
  </div>
);

export const DoodleFlower: React.FC<{
  className?: string;
  color?: string;
  size?: number;
}> = ({ className = '', color = '#00AEE0', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block pointer-events-none ${className}`}
  >
    <circle cx="16" cy="16" r="3.5" fill="#FED636" stroke="#1E293B" />
    <path d="M16 6C13.5 6 13.5 12.5 16 12.5C18.5 12.5 18.5 6 16 6Z" fill="#E0F2FE" />
    <path d="M16 26C13.5 26 13.5 19.5 16 19.5C18.5 19.5 18.5 26 16 26Z" fill="#E0F2FE" />
    <path d="M6 16C6 13.5 12.5 13.5 12.5 16C12.5 18.5 6 18.5 6 16Z" fill="#E0F2FE" />
    <path d="M26 16C26 13.5 19.5 13.5 19.5 16C19.5 18.5 26 18.5 26 16Z" fill="#E0F2FE" />
  </svg>
);

export const WashiTape: React.FC<{
  className?: string;
  color?: string;
  tilt?: string;
}> = ({
  className = '',
  color = 'rgba(186, 230, 253, 0.9)',
  tilt = '-rotate-2',
}) => (
  <div
    className={`washi-tape ${tilt} ${className}`}
    style={{ backgroundColor: color }}
    aria-hidden="true"
  />
);

export const DoodleSquiggle: React.FC<{
  className?: string;
  color?: string;
}> = ({ className = '', color = '#00AEE0' }) => (
  <svg
    width="60"
    height="12"
    viewBox="0 0 60 12"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block pointer-events-none opacity-60 ${className}`}
  >
    <path d="M2 6 Q 8 1, 14 6 T 26 6 T 38 6 T 50 6 T 58 6" />
  </svg>
);

/**
 * FloatingDoodles: Randomly scattered whimsical doodle stickers across the background
 * of any section to bring up the standout cute doodle theme!
 */
export const FloatingDoodles: React.FC<{
  preset?: 'hero' | 'announcement' | 'couple' | 'events' | 'story' | 'gallery' | 'gift' | 'rsvp' | 'closing';
}> = ({ preset = 'hero' }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 select-none" aria-hidden="true">
      {/* Top Left Scattered Doodle */}
      {preset === 'hero' && (
        <>
          <div className="absolute top-4 left-3 sm:left-6 opacity-75 animate-doodle-float">
            <img src={DOODLE_ASSETS.bouquet} alt="" className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-sm" />
          </div>
          <div className="absolute top-10 right-3 sm:right-6 opacity-85 animate-doodle-slow">
            <img src={DOODLE_ASSETS.floralEnvelope} alt="" className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-sm" />
          </div>
          <div className="absolute bottom-16 left-3 opacity-70 animate-doodle-sway">
            <img src={DOODLE_ASSETS.rings} alt="" className="w-14 h-14 object-contain" />
          </div>
          <div className="absolute bottom-12 right-4 opacity-75 animate-doodle-bob">
            <img src={DOODLE_ASSETS.loveBirds} alt="" className="w-14 h-14 object-contain" />
          </div>
          <div className="absolute top-1/4 left-1/12 opacity-50">
            <DoodleSparkle size={18} color="#00AEE0" className="animate-spin-slow" />
          </div>
          <div className="absolute top-1/3 right-1/12 opacity-60">
            <DoodleStar size={16} color="#FED636" className="animate-pulse" />
          </div>
          <div className="absolute bottom-1/3 left-2 opacity-50">
            <DoodleHeart size={20} fill="#E0F2FE" stroke="#00AEE0" className="rotate-12" />
          </div>
          <div className="absolute bottom-1/4 right-3 opacity-60">
            <DoodleHeart size={16} fill="#FEF9C3" stroke="#F5B700" className="-rotate-12" />
          </div>
        </>
      )}

      {preset === 'announcement' && (
        <>
          <div className="absolute top-4 left-3 opacity-80 animate-doodle-float">
            <img src={DOODLE_ASSETS.loveBirds} alt="" className="w-16 h-16 object-contain" />
          </div>
          <div className="absolute top-4 right-3 opacity-80 animate-doodle-slow">
            <img src={DOODLE_ASSETS.envelopes} alt="" className="w-16 h-16 object-contain" />
          </div>
          <div className="absolute bottom-8 left-4 opacity-60 animate-doodle-sway">
            <img src={DOODLE_ASSETS.heartArrow} alt="" className="w-12 h-12 object-contain" />
          </div>
          <div className="absolute bottom-10 right-4 opacity-65 animate-doodle-bob">
            <DoodleFlower size={26} color="#00AEE0" />
          </div>
          <div className="absolute top-1/2 left-2 opacity-40">
            <DoodleStar size={18} color="#FED636" />
          </div>
          <div className="absolute top-1/3 right-2 opacity-50">
            <DoodleSparkle size={20} color="#0284C7" />
          </div>
        </>
      )}

      {preset === 'couple' && (
        <>
          <div className="absolute top-4 left-4 opacity-75 animate-doodle-slow">
            <img src={DOODLE_ASSETS.heartBalloons} alt="" className="w-16 h-16 object-contain" />
          </div>
          <div className="absolute top-6 right-3 opacity-80 animate-doodle-float">
            <img src={DOODLE_ASSETS.rings} alt="" className="w-14 h-14 object-contain" />
          </div>
          <div className="absolute bottom-10 left-3 opacity-60 animate-doodle-bob">
            <img src={DOODLE_ASSETS.bouquet} alt="" className="w-14 h-14 object-contain" />
          </div>
          <div className="absolute bottom-12 right-4 opacity-70 animate-doodle-sway">
            <img src={DOODLE_ASSETS.loveBirds} alt="" className="w-14 h-14 object-contain" />
          </div>
          <div className="absolute top-2/5 right-2 opacity-50">
            <DoodleHeart size={18} fill="#FEF9C3" stroke="#F5B700" className="rotate-45" />
          </div>
        </>
      )}

      {preset === 'events' && (
        <>
          <div className="absolute top-5 left-3 opacity-85 animate-doodle-float">
            <img src={DOODLE_ASSETS.calendar} alt="" className="w-16 h-16 object-contain" />
          </div>
          <div className="absolute top-6 right-4 opacity-75 animate-doodle-slow">
            <img src={DOODLE_ASSETS.bells} alt="" className="w-14 h-14 object-contain" />
          </div>
          <div className="absolute bottom-12 left-4 opacity-70 animate-doodle-sway">
            <img src={DOODLE_ASSETS.rings} alt="" className="w-14 h-14 object-contain" />
          </div>
          <div className="absolute bottom-14 right-3 opacity-80 animate-doodle-bob">
            <img src={DOODLE_ASSETS.toast} alt="" className="w-14 h-14 object-contain" />
          </div>
          <div className="absolute top-1/2 left-2 opacity-50">
            <DoodleSparkle size={18} color="#00AEE0" />
          </div>
        </>
      )}

      {preset === 'story' && (
        <>
          <div className="absolute top-5 left-3 opacity-75 animate-doodle-float">
            <img src={DOODLE_ASSETS.heartArrow} alt="" className="w-14 h-14 object-contain" />
          </div>
          <div className="absolute top-6 right-3 opacity-80 animate-doodle-slow">
            <img src={DOODLE_ASSETS.loveBirds} alt="" className="w-14 h-14 object-contain" />
          </div>
          <div className="absolute bottom-10 right-4 opacity-75 animate-doodle-sway">
            <img src={DOODLE_ASSETS.envelopes} alt="" className="w-14 h-14 object-contain" />
          </div>
          <div className="absolute top-1/3 right-1 opacity-50">
            <DoodleHeart size={20} fill="#E0F2FE" stroke="#00AEE0" />
          </div>
        </>
      )}

      {preset === 'gallery' && (
        <>
          <div className="absolute top-4 left-3 opacity-80 animate-doodle-slow">
            <img src={DOODLE_ASSETS.toast} alt="" className="w-14 h-14 object-contain" />
          </div>
          <div className="absolute top-5 right-3 opacity-85 animate-doodle-float">
            <img src={DOODLE_ASSETS.heartBalloons} alt="" className="w-16 h-16 object-contain" />
          </div>
          <div className="absolute bottom-10 left-3 opacity-70 animate-doodle-bob">
            <DoodleFlower size={26} color="#00AEE0" />
          </div>
          <div className="absolute bottom-12 right-4 opacity-75 animate-doodle-sway">
            <img src={DOODLE_ASSETS.rings} alt="" className="w-14 h-14 object-contain" />
          </div>
          <div className="absolute top-1/2 right-2 opacity-50">
            <DoodleStar size={18} color="#FED636" />
          </div>
        </>
      )}

      {preset === 'gift' && (
        <>
          <div className="absolute top-5 left-4 opacity-80 animate-doodle-float">
            <img src={DOODLE_ASSETS.giftMail} alt="" className="w-16 h-16 object-contain" />
          </div>
          <div className="absolute top-6 right-3 opacity-75 animate-doodle-slow">
            <img src={DOODLE_ASSETS.envelopes} alt="" className="w-14 h-14 object-contain" />
          </div>
          <div className="absolute bottom-10 left-3 opacity-70 animate-doodle-sway">
            <img src={DOODLE_ASSETS.heartBalloons} alt="" className="w-14 h-14 object-contain" />
          </div>
          <div className="absolute bottom-12 right-4 opacity-60 animate-doodle-bob">
            <DoodleSparkle size={20} color="#FED636" />
          </div>
        </>
      )}

      {preset === 'rsvp' && (
        <>
          <div className="absolute top-4 left-3 opacity-80 animate-doodle-slow">
            <img src={DOODLE_ASSETS.envelopes} alt="" className="w-16 h-16 object-contain" />
          </div>
          <div className="absolute top-5 right-4 opacity-85 animate-doodle-float">
            <img src={DOODLE_ASSETS.bouquet} alt="" className="w-16 h-16 object-contain" />
          </div>
          <div className="absolute bottom-10 left-4 opacity-70 animate-doodle-bob">
            <img src={DOODLE_ASSETS.loveBirds} alt="" className="w-14 h-14 object-contain" />
          </div>
          <div className="absolute bottom-12 right-3 opacity-65 animate-doodle-sway">
            <DoodleHeart size={22} fill="#E0F2FE" stroke="#00AEE0" />
          </div>
        </>
      )}

      {preset === 'closing' && (
        <>
          <div className="absolute top-4 left-4 opacity-80 animate-doodle-float">
            <img src={DOODLE_ASSETS.floralBanner} alt="" className="w-20 h-14 object-contain" />
          </div>
          <div className="absolute top-5 right-4 opacity-80 animate-doodle-slow">
            <img src={DOODLE_ASSETS.toast} alt="" className="w-14 h-14 object-contain" />
          </div>
          <div className="absolute bottom-14 left-4 opacity-75 animate-doodle-sway">
            <img src={DOODLE_ASSETS.heartBalloons} alt="" className="w-16 h-16 object-contain" />
          </div>
          <div className="absolute bottom-14 right-4 opacity-80 animate-doodle-bob">
            <img src={DOODLE_ASSETS.loveBirds} alt="" className="w-14 h-14 object-contain" />
          </div>
        </>
      )}
    </div>
  );
};
