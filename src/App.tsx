import React, { useState, useEffect } from 'react';
import { HeroSection } from './components/HeroSection';
import { AnnouncementSection } from './components/AnnouncementSection';
import { QuoteSection } from './components/QuoteSection';
import { CoupleSection } from './components/CoupleSection';
import { CountdownAndEvents } from './components/CountdownAndEvents';
import { VideoSection } from './components/VideoSection';
import { GallerySection } from './components/GallerySection';
import { GiftSection } from './components/GiftSection';
import { RsvpSection } from './components/RsvpSection';
import { ClosingSection } from './components/ClosingSection';
import { BottomNavigation } from './components/BottomNavigation';
import { AudioPlayer } from './components/AudioPlayer';
import { Toast } from './components/Toast';
import { COUPLE_DATA, INITIAL_WISHES, DEFAULT_VIDEO_CONFIG } from './data/weddingData';
import { Wish, VideoConfig } from './types';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('invite');
  const [toast, setToast] = useState<{
    message: string;
    isVisible: boolean;
    type?: 'success' | 'music' | 'pause' | 'copy';
  }>({
    message: '',
    isVisible: false,
    type: 'success',
  });

  // Video configuration persisted in localStorage
  const [videoConfig, setVideoConfig] = useState<VideoConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ahmad_siti_video_config');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // Fallback to default
        }
      }
    }
    return DEFAULT_VIDEO_CONFIG;
  });

  // Guest name initialization (from URL query param or default)
  const [guestName, setGuestName] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const toParam = params.get('to') || params.get('u') || params.get('guest');
      if (toParam) {
        return decodeURIComponent(toParam).replace(/\+/g, ' ');
      }
    }
    return 'Budi Santoso & Partner';
  });

  // Wishes stored in localStorage
  const [wishes, setWishes] = useState<Wish[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ahmad_siti_wishes');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // Fallback to default
        }
      }
    }
    return INITIAL_WISHES;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ahmad_siti_wishes', JSON.stringify(wishes));
    }
  }, [wishes]);

  const showToast = (message: string, type: 'success' | 'music' | 'pause' | 'copy' = 'success') => {
    setToast({ message, isVisible: true, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, isVisible: false }));
    }, 2600);
  };

  const handleToggleMusic = () => {
    if (isPlaying) {
      setIsPlaying(false);
      showToast('⏸️ Musik Dijeda', 'pause');
    } else {
      setIsPlaying(true);
      showToast('🎵 Memutar Musik', 'music');
    }
  };

  const handleOpenInvitation = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      showToast('🎵 Memutar Musik', 'music');
    }
    const announcementElement = document.getElementById('announcementSection');
    if (announcementElement) {
      announcementElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      const quoteElement = document.getElementById('quoteSection');
      if (quoteElement) {
        quoteElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleAddWish = (newWish: Wish) => {
    setWishes((prev) => [newWish, ...prev]);
  };

  // Observe active section for bottom navigation tab sync
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      const rsvp = document.getElementById('rsvpSection');
      const gift = document.getElementById('giftSection');
      const schedule = document.getElementById('scheduleSection');

      if (rsvp && scrollPos >= rsvp.offsetTop) {
        setActiveTab('doodles');
      } else if (gift && scrollPos >= gift.offsetTop) {
        setActiveTab('registry');
      } else if (schedule && scrollPos >= schedule.offsetTop) {
        setActiveTab('schedule');
      } else {
        setActiveTab('invite');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#fff7eb] text-[#2b2620] flex flex-col items-center relative selection:bg-[#fcecf0] selection:text-[#cc3a63]">
      {/* Toast Alert */}
      <Toast message={toast.message} isVisible={toast.isVisible} type={toast.type} />

      {/* Floating Audio Mini-FAB */}
      <AudioPlayer
        audioUrl={COUPLE_DATA.audioUrl}
        isPlaying={isPlaying}
        onToggle={handleToggleMusic}
      />

      {/* Main Single Column Container */}
      <main className="w-full max-w-[460px] flex flex-col pb-20 pt-4 relative">
        {/* 1. Hero / Unseal Envelope Card */}
        <HeroSection
          guestName={guestName}
          onUpdateGuestName={setGuestName}
          onOpenInvitation={handleOpenInvitation}
        />

        {/* 2. Hand-Drawn Locket Announcement: "WE'RE GETTING MARRIED!" */}
        <AnnouncementSection
          onScrollNext={() => {
            document.getElementById('quoteSection')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 3. Quranic Blessing Greeting */}
        <QuoteSection />

        {/* 4. The Happy Couple */}
        <CoupleSection />

        {/* 5. Save The Date & Countdown */}
        <CountdownAndEvents />

        {/* 6. Video Section (Before Photo Gallery) */}
        <VideoSection videoConfig={videoConfig} />

        {/* 7. Love Story & Photo Gallery */}
        <GallerySection />

        {/* 8. Amplop Digital (Wedding Gift) */}
        <GiftSection onShowToast={showToast} />

        {/* 9. RSVP & Doa Restu */}
        <RsvpSection
          wishes={wishes}
          guestName={guestName}
          onAddWish={handleAddWish}
          onShowToast={(msg) => showToast(msg, 'success')}
        />

        {/* 10. Closing Thanks & Footer */}
        <ClosingSection />
      </main>

      {/* Fixed Bottom Navigation Bar */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId)}
      />
    </div>
  );
}
