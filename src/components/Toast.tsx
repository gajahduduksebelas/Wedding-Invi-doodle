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
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#a2ab73] text-[#2b2620] shadow-[3px_4px_0px_#4a4238] border-2 border-[#4a4238]">
        {type === 'music' && <Music className="w-4 h-4 text-[#2b2620]" />}
        {type === 'pause' && <PauseCircle className="w-4 h-4 text-[#2b2620]" />}
        {type === 'copy' && <Copy className="w-4 h-4 text-[#2b2620]" />}
        {type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#2b2620]" />}
        <span className="text-[13px] font-bold tracking-wide">{message}</span>
      </div>
    </div>
  );
};
