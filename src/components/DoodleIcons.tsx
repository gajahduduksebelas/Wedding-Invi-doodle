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
    className={`${className} overflow-visible`}
    aria-hidden="true"
  >
    <path
      d="M3 6.5C18 3.5 32 8.5 48 5.5C64 3 78 8 97 6"
      stroke={color}
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-draw-underline"
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
