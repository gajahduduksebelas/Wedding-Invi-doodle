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
import { CmsDashboard } from './components/cms/CmsDashboard';
import {
  COUPLE_DATA,
  EVENTS_DATA,
  BANK_ACCOUNTS,
  GALLERY_PHOTOS,
  INITIAL_WISHES,
  DEFAULT_VIDEO_CONFIG,
  DEFAULT_GIFT_ADDRESS,
} from './data/weddingData';
import { INITIAL_WA_GUESTS } from './data/whatsappData';
import {
  Wish,
  VideoConfig,
  CoupleData,
  EventDetail,
  BankAccount,
  GalleryPhoto,
  WhatsAppGuest,
} from './types';

export default function App() {
  // Current view: 'invitation' or 'cms'
  const [currentView, setCurrentView] = useState<'invitation' | 'cms'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page') || params.get('view');
      if (page === 'cms' || window.location.hash === '#cms') {
        return 'cms';
      }
    }
    return 'invitation';
  });

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

  // 1. Couple Profile State
  const [couple, setCouple] = useState<CoupleData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ahmad_siti_couple');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return COUPLE_DATA;
  });

  // 2. Events Schedule State
  const [events, setEvents] = useState<EventDetail[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ahmad_siti_events');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return EVENTS_DATA;
  });

  // 3. Video configuration
  const [videoConfig, setVideoConfig] = useState<VideoConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ahmad_siti_video_config');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return DEFAULT_VIDEO_CONFIG;
  });

  // 4. Bank Accounts
  const [banks, setBanks] = useState<BankAccount[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ahmad_siti_banks');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return BANK_ACCOUNTS;
  });

  // 5. Physical Gift Address
  const [giftAddress, setGiftAddress] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ahmad_siti_gift_address');
      if (saved) return saved;
    }
    return DEFAULT_GIFT_ADDRESS;
  });

  // 6. Gallery Photos
  const [photos, setPhotos] = useState<GalleryPhoto[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ahmad_siti_photos');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return GALLERY_PHOTOS;
  });

  // 7. Wishes / RSVP
  const [wishes, setWishes] = useState<Wish[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ahmad_siti_wishes');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return INITIAL_WISHES;
  });

  // 8. WhatsApp Blaster Guest List
  const [waGuests, setWaGuests] = useState<WhatsAppGuest[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ahmad_siti_wa_guests');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return INITIAL_WA_GUESTS;
  });

  // Guest name initialization for recipient (from URL query param or default)
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

  // Persistence to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ahmad_siti_couple', JSON.stringify(couple));
    }
  }, [couple]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ahmad_siti_events', JSON.stringify(events));
    }
  }, [events]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ahmad_siti_video_config', JSON.stringify(videoConfig));
    }
  }, [videoConfig]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ahmad_siti_banks', JSON.stringify(banks));
    }
  }, [banks]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ahmad_siti_gift_address', giftAddress);
    }
  }, [giftAddress]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ahmad_siti_photos', JSON.stringify(photos));
    }
  }, [photos]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ahmad_siti_wishes', JSON.stringify(wishes));
    }
  }, [wishes]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ahmad_siti_wa_guests', JSON.stringify(waGuests));
    }
  }, [waGuests]);

  const showToast = (
    message: string,
    type: 'success' | 'music' | 'pause' | 'copy' = 'success'
  ) => {
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
    if (currentView !== 'invitation') return;

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
  }, [currentView]);

  // Switch view handlers
  const handleSwitchToCms = () => {
    setCurrentView('cms');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const url = new URL(window.location.href);
      url.searchParams.set('page', 'cms');
      window.history.pushState({}, '', url);
    }
  };

  const handleSwitchToInvitation = () => {
    setCurrentView('invitation');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const url = new URL(window.location.href);
      url.searchParams.delete('page');
      window.history.pushState({}, '', url);
    }
  };

  // Listen to popstate or hashchange for back/forward and direct hash navigation
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const isCms = params.get('page') === 'cms' || window.location.hash === '#cms';
      setCurrentView(isCms ? 'cms' : 'invitation');
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // If viewing CMS Dashboard
  if (currentView === 'cms') {
    return (
      <div className="min-h-screen bg-[#fff7eb]">
        <Toast message={toast.message} isVisible={toast.isVisible} type={toast.type} />
        <CmsDashboard
          couple={couple}
          events={events}
          videoConfig={videoConfig}
          banks={banks}
          photos={photos}
          giftAddress={giftAddress}
          wishes={wishes}
          waGuests={waGuests}
          onSaveCoupleAndEvents={(newCouple, newEvents) => {
            setCouple(newCouple);
            setEvents(newEvents);
          }}
          onSaveVideoConfig={(newConfig) => setVideoConfig(newConfig)}
          onSaveBanksAndAddress={(newBanks, newAddress) => {
            setBanks(newBanks);
            setGiftAddress(newAddress);
          }}
          onSavePhotos={(newPhotos) => setPhotos(newPhotos)}
          onUpdateWishes={(newWishes) => setWishes(newWishes)}
          onUpdateWaGuests={(newGuests) => setWaGuests(newGuests)}
          onSwitchToInvitation={handleSwitchToInvitation}
          onShowToast={showToast}
        />
      </div>
    );
  }

  // Otherwise, render the romantic, doodle-styled wedding invitation for invitees
  return (
    <div className="min-h-screen bg-[#fff7eb] text-[#2b2620] flex flex-col items-center relative selection:bg-[#fcecf0] selection:text-[#cc3a63]">
      {/* Toast Alert */}
      <Toast message={toast.message} isVisible={toast.isVisible} type={toast.type} />

      {/* Floating Audio Mini-FAB */}
      <AudioPlayer
        audioUrl={couple.audioUrl || COUPLE_DATA.audioUrl}
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
          couple={couple}
        />

        {/* 2. Hand-Drawn Locket Announcement: "WE'RE GETTING MARRIED!" */}
        <AnnouncementSection
          onScrollNext={() => {
            document.getElementById('quoteSection')?.scrollIntoView({ behavior: 'smooth' });
          }}
          couple={couple}
        />

        {/* 3. Quranic Blessing Greeting */}
        <QuoteSection />

        {/* 4. The Happy Couple */}
        <CoupleSection couple={couple} />

        {/* 5. Save The Date & Countdown */}
        <CountdownAndEvents couple={couple} events={events} />

        {/* 6. Video Section (Before Photo Gallery) */}
        <VideoSection videoConfig={videoConfig} />

        {/* 7. Love Story & Photo Gallery */}
        <GallerySection photos={photos} />

        {/* 8. Amplop Digital (Wedding Gift) */}
        <GiftSection
          onShowToast={showToast}
          banks={banks}
          giftAddress={giftAddress}
        />

        {/* 9. RSVP & Doa Restu */}
        <RsvpSection
          wishes={wishes}
          guestName={guestName}
          onAddWish={handleAddWish}
          onShowToast={(msg) => showToast(msg, 'success')}
        />

        {/* 10. Closing Thanks & Footer with discreet CMS link */}
        <ClosingSection couple={couple} onOpenCms={handleSwitchToCms} />
      </main>

      {/* Fixed Bottom Navigation Bar */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId)}
      />
    </div>
  );
}
