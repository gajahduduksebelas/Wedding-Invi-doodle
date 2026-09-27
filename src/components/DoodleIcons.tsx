import React from 'react';

// Signature Hand-drawn Underline Squiggle
export const DoodleUnderline: React.FC<{ color?: string; className?: string }> = ({
  color = '#B4533C',
  className = 'w-24 h-3 mx-auto mt-0.5',
}) => (
  <svg
    viewBox="0 0 100 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M3 6.5C18 3.5 32 8.5 48 5.5C64 3 78 8 97 6"
      stroke={color}
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Unified Section Heading matching IMG_2713.PNG style
interface SectionHeadingProps {
  subheadline: string;
  headline: string;
  subheadlineColor?: string;
  headlineColor?: string;
  underlineColor?: string;
  className?: string;
  subheadlineClassName?: string;
  headlineClassName?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  subheadline,
  headline,
  subheadlineColor = '#B4533C',
  headlineColor = '#181818',
  underlineColor = '#B4533C',
  className = 'mb-4',
  subheadlineClassName = 'text-[28px] sm:text-[32px] leading-tight',
  headlineClassName = 'text-[36px] sm:text-[42px] leading-none tracking-wide uppercase',
}) => {
  return (
    <div className={`flex flex-col items-center text-center select-none ${className}`}>
      <span
        className={`font-allura ${subheadlineClassName}`}
        style={{ color: subheadlineColor }}
      >
        {subheadline}
      </span>
      <h2
        className={`font-delicious ${headlineClassName}`}
        style={{ color: headlineColor }}
      >
        {headline}
      </h2>
      <DoodleUnderline color={underlineColor} />
    </div>
  );
};

// 1. Flying Bird with ribbon in beak (Top Left in Hero / Footer)
export const DoodleFlyingBird: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg
    viewBox="0 0 80 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Body & Wings */}
    <path
      d="M28 38C22 34 16 38 12 42C10 44 8 46 6 44C4 42 6 38 10 34C16 28 26 26 34 30C40 22 48 14 58 10C62 8 66 10 64 14C60 22 52 30 46 34C52 34 60 36 66 40C70 42 72 46 68 48C62 50 52 46 44 42C40 50 32 56 22 58C18 58 16 54 18 50C22 46 26 42 28 38Z"
      stroke="#181818"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#FAF7EE"
    />
    {/* Head & Beak */}
    <path
      d="M34 30C32 26 33 21 37 18C41 15 46 16 48 20C48 23 46 26 43 28"
      stroke="#181818"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <path
      d="M48 20L54 19L47 23"
      stroke="#181818"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#181818"
    />
    {/* Eye */}
    <circle cx="41" cy="20" r="1.8" fill="#181818" />
    {/* Branch / ribbon twig dangling */}
    <path
      d="M48 22C46 28 42 34 38 40"
      stroke="#181818"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M42 31C44 29 48 29 49 31C48 33 44 33 42 31Z"
      stroke="#181818"
      strokeWidth="1.8"
      fill="#FAF7EE"
    />
  </svg>
);

// 2. Heart Balloons with curling string (Top Right)
export const DoodleHeartBalloons: React.FC<{ className?: string }> = ({ className = 'w-16 h-28' }) => (
  <svg
    viewBox="0 0 70 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Balloon 1 (Top Left) */}
    <path
      d="M26 36C26 36 12 28 12 18C12 10 18 6 24 10C27 12 28 15 28 15C28 15 29 12 32 10C38 6 44 10 44 18C44 28 30 36 30 36L28 38L26 36Z"
      stroke="#181818"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#FAF7EE"
    />
    {/* Tie */}
    <path d="M26 38L30 38L28 42Z" fill="#181818" stroke="#181818" strokeWidth="1.5" />
    
    {/* Balloon 2 (Right slightly lower) */}
    <path
      d="M46 54C46 54 34 46 34 38C34 31 39 27 44 30C47 32 48 34 48 34C48 34 49 32 52 30C57 27 62 31 62 38C62 46 50 54 50 54L48 56L46 54Z"
      stroke="#181818"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#FAF7EE"
    />
    <path d="M46 56L50 56L48 60Z" fill="#181818" stroke="#181818" strokeWidth="1.5" />

    {/* Strings */}
    <path
      d="M28 42C28 55 35 68 38 82C40 94 36 104 38 114"
      stroke="#181818"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M48 60C48 72 44 84 42 98C41 106 43 112 42 116"
      stroke="#181818"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Bow on string */}
    <path
      d="M34 94C30 92 30 96 34 96C38 96 38 92 34 94Z"
      stroke="#181818"
      strokeWidth="2"
    />
  </svg>
);

// 3. Dual Heart Lockets with Big Ribbon Bow (Header of Invitation)
export const DoodleDualHeartLocket: React.FC<{
  groomImg: string;
  brideImg: string;
  className?: string;
}> = ({ groomImg, brideImg, className = 'w-full max-w-[340px] mx-auto' }) => (
  <div className={`relative flex flex-col items-center ${className}`}>
    {/* Big Ribbon Bow at the top */}
    <svg
      viewBox="0 0 280 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[240px] sm:w-[270px] h-auto -mb-6 z-20 pointer-events-none"
      aria-hidden="true"
    >
      {/* Center Knot */}
      <ellipse
        cx="140"
        cy="28"
        rx="10"
        ry="8"
        stroke="#181818"
        strokeWidth="2.8"
        fill="#FAF7EE"
      />
      {/* Left Loop */}
      <path
        d="M132 26C115 12 85 8 72 20C60 30 70 44 95 40C115 37 130 32 132 26Z"
        stroke="#181818"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#FAF7EE"
      />
      {/* Left inner fold */}
      <path
        d="M102 24C92 28 88 34 94 36"
        stroke="#181818"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Right Loop */}
      <path
        d="M148 26C165 12 195 8 208 20C220 30 210 44 185 40C165 37 150 32 148 26Z"
        stroke="#181818"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#FAF7EE"
      />
      {/* Right inner fold */}
      <path
        d="M178 24C188 28 192 34 186 36"
        stroke="#181818"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Left Tail dangling to left heart */}
      <path
        d="M134 34C120 48 100 58 85 75"
        stroke="#181818"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      {/* Right Tail dangling to right heart */}
      <path
        d="M146 34C160 48 180 58 195 75"
        stroke="#181818"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </svg>

    {/* Connected Twin Heart Frames */}
    <div className="relative flex items-center justify-center gap-2 sm:gap-4 z-10">
      {/* Left Heart Locket (Groom) */}
      <div className="relative w-[130px] h-[130px] sm:w-[145px] sm:h-[145px] flex items-center justify-center -rotate-6">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        >
          <path
            d="M50 88C50 88 10 65 10 35C10 18 24 10 37 14C43 16 47 21 50 25C53 21 57 16 63 14C76 10 90 18 90 35C90 65 50 88 50 88Z"
            fill="none"
            stroke="#181818"
            strokeWidth="3.2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
        {/* Masked photo inside heart */}
        <div
          className="w-[92%] h-[92%] overflow-hidden bg-[#FAF7EE] shadow-sm flex items-center justify-center"
          style={{
            clipPath:
              'path("M 50 88 C 50 88 10 65 10 35 C 10 18 24 10 37 14 C 43 16 47 21 50 25 C 53 21 57 16 63 14 C 76 10 90 18 90 35 C 90 65 50 88 50 88 Z")',
          }}
        >
          <img
            src={groomImg}
            alt="Groom"
            className="w-full h-full object-cover scale-110 translate-y-1"
          />
        </div>
      </div>

      {/* Right Heart Locket (Bride) */}
      <div className="relative w-[130px] h-[130px] sm:w-[145px] sm:h-[145px] flex items-center justify-center rotate-6">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        >
          <path
            d="M50 88C50 88 10 65 10 35C10 18 24 10 37 14C43 16 47 21 50 25C53 21 57 16 63 14C76 10 90 18 90 35C90 65 50 88 50 88Z"
            fill="none"
            stroke="#181818"
            strokeWidth="3.2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
        {/* Masked photo inside heart */}
        <div
          className="w-[92%] h-[92%] overflow-hidden bg-[#FAF7EE] shadow-sm flex items-center justify-center"
          style={{
            clipPath:
              'path("M 50 88 C 50 88 10 65 10 35 C 10 18 24 10 37 14 C 43 16 47 21 50 25 C 53 21 57 16 63 14 C 76 10 90 18 90 35 C 90 65 50 88 50 88 Z")',
          }}
        >
          <img
            src={brideImg}
            alt="Bride"
            className="w-full h-full object-cover scale-110 translate-y-1"
          />
        </div>
      </div>
    </div>
  </div>
);

// 4. Diamond Ring Doodle perched on top of "WITH LOVE" card
export const DoodleDiamondRing: React.FC<{ className?: string }> = ({ className = 'w-18 h-18' }) => (
  <svg
    viewBox="0 0 70 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Diamond Gem */}
    <path
      d="M26 22L35 10L44 22L35 28L26 22Z"
      stroke="#181818"
      strokeWidth="2.4"
      strokeLinejoin="round"
      strokeLinecap="round"
      fill="#FAF7EE"
    />
    <path d="M35 10V28" stroke="#181818" strokeWidth="2" strokeLinecap="round" />
    <path d="M29 18H41" stroke="#181818" strokeWidth="1.8" strokeLinecap="round" />
    
    {/* Ring Band */}
    <ellipse
      cx="35"
      cy="42"
      rx="18"
      ry="18"
      stroke="#181818"
      strokeWidth="2.8"
      fill="#FAF7EE"
    />
    <ellipse
      cx="35"
      cy="42"
      rx="12"
      ry="12"
      stroke="#181818"
      strokeWidth="2.4"
      fill="#FFFFFF"
    />
    {/* Sparkle accents */}
    <path d="M18 12L21 16M49 12L46 16M35 4V7" stroke="#181818" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 5. Botanical Leaf Branch (Bride & Groom left side)
export const DoodleBotanicalBranch: React.FC<{ className?: string }> = ({ className = 'w-10 h-28' }) => (
  <svg
    viewBox="0 0 50 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M28 115C26 85 24 55 22 10"
      stroke="#181818"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    {/* Leaves */}
    <path
      d="M24 24C16 20 12 26 18 30C22 32 23 28 24 24Z"
      stroke="#181818"
      strokeWidth="2"
      fill="#FAF7EE"
    />
    <path
      d="M23 44C30 40 34 46 28 50C24 52 23 48 23 44Z"
      stroke="#181818"
      strokeWidth="2"
      fill="#FAF7EE"
    />
    <path
      d="M25 64C17 60 13 66 19 70C23 72 24 68 25 64Z"
      stroke="#181818"
      strokeWidth="2"
      fill="#FAF7EE"
    />
    <path
      d="M26 84C33 80 37 86 31 90C27 92 26 88 26 84Z"
      stroke="#181818"
      strokeWidth="2"
      fill="#FAF7EE"
    />
    <path
      d="M22 10C20 4 24 2 26 6C28 9 26 11 22 10Z"
      stroke="#181818"
      strokeWidth="2"
      fill="#FAF7EE"
    />
  </svg>
);

// 6. Hanging Calendar with Heart (Save The Date top-right)
export const DoodleCalendar: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg
    viewBox="0 0 70 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Calendar Page Outline */}
    <rect
      x="14"
      y="16"
      width="44"
      height="46"
      rx="6"
      stroke="#181818"
      strokeWidth="2.5"
      fill="#FFFFFF"
    />
    {/* Top Binder Line */}
    <line x1="14" y1="28" x2="58" y2="28" stroke="#181818" strokeWidth="2.2" />
    
    {/* Binder Rings */}
    <line x1="22" y1="12" x2="22" y2="18" stroke="#181818" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="32" y1="12" x2="32" y2="18" stroke="#181818" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="42" y1="12" x2="42" y2="18" stroke="#181818" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="50" y1="12" x2="50" y2="18" stroke="#181818" strokeWidth="2.5" strokeLinecap="round" />

    {/* Heart in center of date */}
    <path
      d="M36 48C36 48 26 40 26 34C26 31 28 29 31 30C33 31 35 33 36 34C37 33 39 31 41 30C44 29 46 31 46 34C46 40 36 48 36 48Z"
      stroke="#181818"
      strokeWidth="2.2"
      fill="#B4533C"
    />
  </svg>
);

// 7. Toasting Champagne Flutes (Akad Nikah)
export const DoodleToastGlasses: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg
    viewBox="0 0 70 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Left Glass */}
    <g transform="rotate(16 30 35)">
      <path
        d="M26 14H36L34 32C34 36 32 38 31 38C30 38 28 36 28 32L26 14Z"
        stroke="#181818"
        strokeWidth="2.2"
        strokeLinejoin="round"
        fill="#FAF7EE"
      />
      <line x1="31" y1="38" x2="31" y2="52" stroke="#181818" strokeWidth="2.2" strokeLinecap="round" />
      <ellipse cx="31" cy="52" rx="7" ry="2" stroke="#181818" strokeWidth="2.2" fill="#181818" />
    </g>

    {/* Right Glass */}
    <g transform="rotate(-16 42 35)">
      <path
        d="M36 14H46L44 32C44 36 42 38 41 38C40 38 38 36 38 32L36 14Z"
        stroke="#181818"
        strokeWidth="2.2"
        strokeLinejoin="round"
        fill="#FAF7EE"
      />
      <line x1="41" y1="38" x2="41" y2="52" stroke="#181818" strokeWidth="2.2" strokeLinecap="round" />
      <ellipse cx="41" cy="52" rx="7" ry="2" stroke="#181818" strokeWidth="2.2" fill="#181818" />
    </g>

    {/* Clink sparks */}
    <circle cx="36" cy="18" r="1.5" fill="#181818" />
    <circle cx="34" cy="12" r="1" fill="#181818" />
    <circle cx="39" cy="13" r="1.2" fill="#181818" />
  </svg>
);

// 8. Wedding Bells with Bow (Resepsi)
export const DoodleWeddingBells: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg
    viewBox="0 0 70 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Ribbon Bow on top */}
    <ellipse cx="35" cy="18" rx="4" ry="3" stroke="#181818" strokeWidth="2" fill="#181818" />
    <path
      d="M32 18C25 12 20 18 24 22C28 24 31 20 32 18Z"
      stroke="#181818"
      strokeWidth="2"
      fill="#FAF7EE"
    />
    <path
      d="M38 18C45 12 50 18 46 22C42 24 39 20 38 18Z"
      stroke="#181818"
      strokeWidth="2"
      fill="#FAF7EE"
    />

    {/* Left Bell */}
    <g transform="rotate(-10 30 35)">
      <path
        d="M26 24C28 22 36 22 38 24C38 34 42 42 45 46H19C22 42 26 34 26 24Z"
        stroke="#181818"
        strokeWidth="2.2"
        strokeLinejoin="round"
        fill="#FAF7EE"
      />
      <circle cx="32" cy="48" r="3" stroke="#181818" strokeWidth="2" fill="#181818" />
    </g>

    {/* Right Bell */}
    <g transform="rotate(12 40 38)">
      <path
        d="M34 26C36 24 44 24 46 26C46 36 50 44 53 48H27C30 44 34 36 34 26Z"
        stroke="#181818"
        strokeWidth="2.2"
        strokeLinejoin="round"
        fill="#FAF7EE"
      />
      <circle cx="40" cy="50" r="3" stroke="#181818" strokeWidth="2" fill="#181818" />
    </g>
  </svg>
);

// 9. Big Heart Outline Doodle (Love Story)
export const DoodleBigHeartOutline: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M50 82C50 82 14 58 14 30C14 16 26 8 38 12C44 14 47 18 50 22C53 18 56 14 62 12C74 8 86 16 86 30C86 58 50 82 50 82Z"
      stroke="#181818"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      opacity="0.85"
    />
  </svg>
);

// 10. Flower Bouquet (Galeri Foto)
export const DoodleBouquet: React.FC<{ className?: string }> = ({ className = 'w-18 h-20' }) => (
  <svg
    viewBox="0 0 70 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Flowers at top */}
    <circle cx="35" cy="22" r="7" stroke="#181818" strokeWidth="2.2" fill="#FAF7EE" />
    <circle cx="24" cy="28" r="6" stroke="#181818" strokeWidth="2.2" fill="#FAF7EE" />
    <circle cx="46" cy="28" r="6" stroke="#181818" strokeWidth="2.2" fill="#FAF7EE" />
    <circle cx="35" cy="34" r="6.5" stroke="#181818" strokeWidth="2.2" fill="#FAF7EE" />
    
    {/* Flower centers */}
    <circle cx="35" cy="22" r="2" fill="#181818" />
    <circle cx="24" cy="28" r="1.8" fill="#181818" />
    <circle cx="46" cy="28" r="1.8" fill="#181818" />
    <circle cx="35" cy="34" r="1.8" fill="#181818" />

    {/* Stems bundle tied */}
    <path d="M28 42L35 68M35 42V68M42 42L35 68" stroke="#181818" strokeWidth="2.4" strokeLinecap="round" />
    {/* Bow on stems */}
    <ellipse cx="35" cy="52" rx="4" ry="3" stroke="#181818" strokeWidth="2" fill="#181818" />
    <path d="M31 52C26 48 24 54 28 56M39 52C44 48 46 54 42 56" stroke="#181818" strokeWidth="2" fill="none" />
  </svg>
);

// 11. Overlapping Mail Envelopes (Live Streaming)
export const DoodleOverlappingEnvelopes: React.FC<{ className?: string }> = ({ className = 'w-18 h-18' }) => (
  <svg
    viewBox="0 0 70 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Back Envelope */}
    <g transform="rotate(-12 30 28)">
      <rect x="10" y="14" width="36" height="24" rx="3" stroke="#181818" strokeWidth="2.2" fill="#FAF7EE" />
      <path d="M10 14L28 28L46 14" stroke="#181818" strokeWidth="2.2" strokeLinejoin="round" />
    </g>
    {/* Front Envelope */}
    <g transform="rotate(8 38 34)">
      <rect x="22" y="20" width="38" height="26" rx="3" stroke="#181818" strokeWidth="2.4" fill="#FFFFFF" />
      <path d="M22 20L41 35L60 20" stroke="#181818" strokeWidth="2.4" strokeLinejoin="round" />
      {/* Heart seal */}
      <path
        d="M41 38C41 38 37 34 37 31C37 29.5 38.5 28.5 40 29.2C40.5 29.5 41 30 41 30.5C41 30 41.5 29.5 42 29.2C43.5 28.5 45 29.5 45 31C45 34 41 38 41 38Z"
        fill="#B4533C"
      />
    </g>
  </svg>
);

// 12. Kissing Love Birds (Footer / Closing)
export const DoodleKissingBirds: React.FC<{ className?: string }> = ({ className = 'w-24 h-16' }) => (
  <svg
    viewBox="0 0 100 55"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Left Bird */}
    <path
      d="M12 34C16 30 24 30 30 33C33 28 39 26 44 29C46 30 47 32 47 34L51 34L47 36C45 42 38 46 30 45C22 44 16 38 12 34Z"
      stroke="#181818"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#FAF7EE"
    />
    <circle cx="41" cy="31" r="1.5" fill="#181818" />
    <path d="M28 35C24 37 22 41 24 43" stroke="#181818" strokeWidth="1.8" />

    {/* Right Bird */}
    <path
      d="M88 34C84 30 76 30 70 33C67 28 61 26 56 29C54 30 53 32 53 34L49 34L53 36C55 42 62 46 70 45C78 44 84 38 88 34Z"
      stroke="#181818"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#FAF7EE"
    />
    <circle cx="59" cy="31" r="1.5" fill="#181818" />
    <path d="M72 35C76 37 78 41 76 43" stroke="#181818" strokeWidth="1.8" />

    {/* Little love heart between beaks */}
    <path
      d="M50 20C50 20 46 16 46 13C46 11 48 9.5 49.5 10.5C50 11 50 11.5 50 11.5C50 11.5 50 11 50.5 10.5C52 9.5 54 11 54 13C54 16 50 20 50 20Z"
      stroke="#181818"
      strokeWidth="1.8"
      fill="#B4533C"
    />
  </svg>
);

// 13. Gift Envelope with bow (RSVP & Gift section)
export const DoodleGiftBox: React.FC<{ className?: string }> = ({ className = 'w-18 h-18' }) => (
  <svg
    viewBox="0 0 70 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Box body */}
    <rect x="16" y="28" width="38" height="32" rx="4" stroke="#181818" strokeWidth="2.4" fill="#FFFFFF" />
    {/* Box lid */}
    <rect x="13" y="22" width="44" height="10" rx="3" stroke="#181818" strokeWidth="2.4" fill="#FAF7EE" />
    {/* Ribbon Vertical */}
    <line x1="35" y1="22" x2="35" y2="60" stroke="#181818" strokeWidth="2.4" />
    {/* Bow on top */}
    <ellipse cx="35" cy="18" rx="4" ry="3" stroke="#181818" strokeWidth="2" fill="#181818" />
    <path d="M31 18C24 10 18 16 25 20C29 22 31 19 31 18Z" stroke="#181818" strokeWidth="2" fill="#FAF7EE" />
    <path d="M39 18C46 10 52 16 45 20C41 22 39 19 39 18Z" stroke="#181818" strokeWidth="2" fill="#FAF7EE" />
  </svg>
);
