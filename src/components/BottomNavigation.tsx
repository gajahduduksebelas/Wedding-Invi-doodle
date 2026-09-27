import React from 'react';
import { Home, Users, Calendar, BookOpen, Image, MessageSquareHeart, Gift } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: 'home', label: 'Home', targetId: 'home', icon: Home },
    { id: 'mempelai', label: 'Mempelai', targetId: 'mempelai', icon: Users },
    { id: 'acara', label: 'Acara', targetId: 'save-date', icon: Calendar },
    { id: 'story', label: 'Cerita', targetId: 'story', icon: BookOpen },
    { id: 'gallery', label: 'Galeri', targetId: 'gallery', icon: Image },
    { id: 'gift', label: 'Kado', targetId: 'gift', icon: Gift },
    { id: 'rsvp', label: 'RSVP', targetId: 'rsvp', icon: MessageSquareHeart },
  ];

  const handleTabClick = (tabId: string, targetId: string) => {
    onTabChange(tabId);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-[#FAF7EE]/95 backdrop-blur-md border-t-2 border-[#181818] shadow-[0_-2px_8px_rgba(24,24,24,0.08)]">
      <div className="max-w-[460px] mx-auto flex items-center justify-around h-15 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id, tab.targetId)}
              className={`flex flex-col items-center justify-center flex-1 h-12 transition-all cursor-pointer ${
                isActive
                  ? 'text-[#B4533C] font-bold scale-105'
                  : 'text-stone-500 hover:text-[#181818] font-semibold'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight font-sans">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
