import React from 'react';
import { Heart, Settings2 } from 'lucide-react';
import { CoupleData } from '../types';

interface ClosingSectionProps {
  couple?: CoupleData;
  onOpenCms?: () => void;
}

export const ClosingSection: React.FC<ClosingSectionProps> = ({ couple, onOpenCms }) => {
  const groomNickname = couple?.groom.nickname || 'Ahmad';
  const brideNickname = couple?.bride.nickname || 'Siti';

  return (
    <footer className="px-4 pt-4 pb-28 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-[#cc3a63]/15 flex items-center justify-center text-[#cc3a63] mb-2 border border-[#cc3a63]/30 shadow-sm">
        <Heart className="w-6 h-6 fill-current" />
      </div>

      <p className="text-[13px] font-medium text-[#524348] max-w-[300px] leading-relaxed">
        Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
        Bapak/Ibu/Saudara/i berkenan hadir memberikan doa restu.
      </p>

      <div className="mt-3">
        <span className="text-[13px] font-medium text-[#524348] block">
          Kami yang berbahagia,
        </span>
        <p className="text-[22px] font-bold text-[#cc3a63] font-heading mt-0.5">
          {groomNickname} &amp; {brideNickname}
        </p>
      </div>

      <div className="mt-4 flex flex-col items-center gap-2">
        <div className="px-3.5 py-1 rounded-full bg-[#f9f0e0] text-[11px] font-bold text-[#524348] border border-[#e6dac5] shadow-sm">
          Dibuat sendiri oleh Fadly💖
        </div>

        {onOpenCms && (
          <button
            type="button"
            onClick={onOpenCms}
            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] text-[#7a7065] hover:text-[#2b2620] hover:bg-[#edd9bf]/40 transition-colors opacity-70 hover:opacity-100 cursor-pointer"
            title="Kelola Undangan & WhatsApp Blaster"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Panel Pengantin (CMS)</span>
          </button>
        )}
      </div>
    </footer>
  );
};
