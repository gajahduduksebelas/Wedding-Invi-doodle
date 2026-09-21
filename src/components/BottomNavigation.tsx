import React from 'react';
import { Mail, Calendar, MessageSquareHeart, Gift } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: 'invite', label: 'Undangan', targetId: 'heroSection', icon: Mail },
    { id: 'schedule', label: 'Acara', targetId: 'scheduleSection', icon: Calendar },
    { id: 'doodles', label: 'RSVP', targetId: 'rsvpSection', icon: MessageSquareHeart },
    { id: 'registry', label: 'Kado', targetId: 'giftSection', icon: Gift },
  ];

  const handleTabClick = (tabId: string, targetId: string) => {
    onTabChange(tabId);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-[#fff7eb]/95 backdrop-blur-lg border-t border-[#e6dac5] shadow-[0_-2px_12px_rgba(74,66,56,0.06)]">
      <div className="max-w-[460px] mx-auto flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id, tab.targetId)}
              className={`flex flex-col items-center justify-center w-16 h-12 transition-all cursor-pointer ${
                isActive
                  ? 'text-[#cc3a63] font-bold scale-105'
                  : 'text-[#7a7065] hover:text-[#2b2620] font-semibold'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[11px] mt-1 tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
