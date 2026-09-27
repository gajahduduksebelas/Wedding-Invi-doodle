import React from 'react';
import { CheckCircle2, Music, PauseCircle, Copy } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  type?: 'success' | 'music' | 'pause' | 'copy';
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, type = 'success' }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6E1A2D] text-white shadow-[0_8px_25px_rgba(110,26,45,0.28)] border border-[#8B263E]/40">
        {type === 'music' && <Music className="w-4 h-4 text-white/90" />}
        {type === 'pause' && <PauseCircle className="w-4 h-4 text-white/90" />}
        {type === 'copy' && <Copy className="w-4 h-4 text-white/90" />}
        {type === 'success' && <CheckCircle2 className="w-4 h-4 text-white/90" />}
        <span className="text-[12.5px] font-sans font-medium tracking-wide">{message}</span>
      </div>
    </div>
  );
};
