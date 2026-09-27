import React, { useState, useEffect } from 'react';
import { HeroSection } from './components/HeroSection';
import { AnnouncementSection } from './components/AnnouncementSection';
import { QuoteSection } from './components/QuoteSection';
import { CoupleSection } from './components/CoupleSection';
import { CountdownAndEvents } from './components/CountdownAndEvents';
import { LoveStorySection } from './components/LoveStorySection';
import { GallerySection } from './components/GallerySection';
import { LiveStreamSection } from './components/LiveStreamSection';
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
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (
        page === 'cms' ||
        params.has('cms') ||
        hash === '#cms' ||
        path.endsWith('/cms')
      ) {
        return 'cms';
      }
    }
    return 'invitation';
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [activeTab, setActiveTab] = useState('invite');
  const wasPlayingBeforeVideoRef = React.useRef(false);
  const isVideoActiveRef = React.useRef(false);
  const isPlayingRef = React.useRef(false);

  // Sync isPlayingRef with isPlaying
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);
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

  // Dynamic document title based on bride and groom name
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const groomNick = couple.groom.nickname || 'Arga';
      const brideNick = couple.bride.nickname || 'Kirana';
      document.title = `${brideNick} & ${groomNick} — Undangan Pernikahan`;
    }
  }, [couple.groom.nickname, couple.bride.nickname]);

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
      wasPlayingBeforeVideoRef.current = false;
      showToast('⏸️ Musik Dijeda', 'pause');
    } else {
      setIsPlaying(true);
      wasPlayingBeforeVideoRef.current = true;
      showToast('🎵 Memutar Musik', 'music');
    }
  };

  // Autoplay video and pause music in Gallery section, resume when scrolling to other sections
  const handleVideoActiveChange = (isVideoActive: boolean) => {
    isVideoActiveRef.current = isVideoActive;
    if (isVideoActive) {
      if (isPlayingRef.current) {
        wasPlayingBeforeVideoRef.current = true;
        setIsPlaying(false);
        showToast('🎬 Memutar Video (Musik Dijeda)', 'pause');
      }
    } else {
      // User scrolled away to another section
      if (wasPlayingBeforeVideoRef.current) {
        setIsPlaying(true);
        wasPlayingBeforeVideoRef.current = false;
        showToast('🎵 Melanjutkan Musik', 'music');
      }
    }
  };

  const handleOpenInvitation = () => {
    setIsOpened(true);
    wasPlayingBeforeVideoRef.current = true;
    if (!isPlaying) {
      setIsPlaying(true);
      showToast('🎵 Memutar Musik', 'music');
    }
    setTimeout(() => {
      const homeElement = document.getElementById('home');
      if (homeElement) {
        homeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const handleAddWish = (newWish: Wish) => {
    setWishes((prev) => [newWish, ...prev]);
  };

  // Observe active section for bottom navigation tab sync
  useEffect(() => {
    if (currentView !== 'invitation') return;

    const scrollContainer = document.getElementById('invitationScrollContainer');

    const handleScroll = () => {
      const scrollPos = (scrollContainer ? scrollContainer.scrollTop : window.scrollY) + 260;
      const gift = document.getElementById('gift');
      const rsvp = document.getElementById('rsvp');
      const stream = document.getElementById('stream');
      const gallery = document.getElementById('gallery');
      const story = document.getElementById('story');
      const acara = document.getElementById('acara');
      const saveDate = document.getElementById('save-date');
      const mempelai = document.getElementById('mempelai');
      const home = document.getElementById('home');

      if (gift && scrollPos >= gift.offsetTop) {
        setActiveTab('gift');
      } else if (rsvp && scrollPos >= rsvp.offsetTop) {
        setActiveTab('rsvp');
      } else if (gallery && scrollPos >= gallery.offsetTop) {
        setActiveTab('gallery');
      } else if (story && scrollPos >= story.offsetTop) {
        setActiveTab('story');
      } else if ((acara && scrollPos >= acara.offsetTop) || (saveDate && scrollPos >= saveDate.offsetTop)) {
        setActiveTab('acara');
      } else if (mempelai && scrollPos >= mempelai.offsetTop) {
        setActiveTab('mempelai');
      } else {
        setActiveTab('home');
      }
    };

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [currentView, isOpened]);

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
      url.searchParams.delete('view');
      url.searchParams.delete('cms');
      if (url.hash.toLowerCase() === '#cms') {
        url.hash = '';
      }
      window.history.pushState({}, '', url);
    }
  };

  // Listen to popstate or hashchange for back/forward and direct hash navigation
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page') || params.get('view');
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      const isCms =
        page === 'cms' ||
        params.has('cms') ||
        hash === '#cms' ||
        path.endsWith('/cms');
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
    <div className="h-dvh w-full bg-[#FAF7EE] text-[#181818] overflow-hidden flex flex-col items-center relative selection:bg-[#FBE8E6] selection:text-[#B4533C]">
      {/* Toast Alert */}
      <Toast message={toast.message} isVisible={toast.isVisible} type={toast.type} />

      {/* Floating Audio Mini-FAB */}
      <AudioPlayer
        audioUrl={couple.audioUrl || COUPLE_DATA.audioUrl}
        isPlaying={isPlaying}
        onToggle={handleToggleMusic}
        visibleButton={isOpened}
      />

      {/* 1 Scroll Each Section Container (Mobile Snap Container) */}
      <div
        id="invitationScrollContainer"
        className="w-full h-full overflow-y-auto mobile-snap-container flex flex-col items-center"
      >
        {/* Cover / Hero Gate */}
        <HeroSection
          guestName={guestName}
          onUpdateGuestName={setGuestName}
          onOpenInvitation={handleOpenInvitation}
          couple={couple}
          isOpened={isOpened}
        />

        {/* Invitation Sections - rendered seamlessly once opened */}
        {isOpened && (
          <div className="w-full max-w-[460px] flex flex-col items-center">
            {/* 2. Hand-Drawn Locket Announcement: "KITA AKAN MENIKAH!" */}
            <AnnouncementSection
              onScrollNext={() => {
                document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' });
              }}
              couple={couple}
            />

            {/* 3. Quranic Blessing Greeting (#quote) */}
            <QuoteSection />

            {/* 4. The Happy Couple (#mempelai) */}
            <CoupleSection couple={couple} />

            {/* 5. Save The Date & Detail Acara (#save-date, #acara) */}
            <CountdownAndEvents couple={couple} events={events} />

            {/* 6. Love Story Timeline (#story) */}
            <LoveStorySection stories={couple.loveStory} />

            {/* 7. Gallery & Video (#gallery) */}
            <GallerySection
              photos={photos}
              videoUrl={videoConfig.embedUrl}
              onVideoActiveChange={handleVideoActiveChange}
            />

            {/* 8. Live Streaming (#stream) */}
            <LiveStreamSection config={couple.liveStream} />

            {/* 9. Amplop Digital & Kado (#gift) */}
            <GiftSection
              onShowToast={showToast}
              banks={banks}
              giftAddress={giftAddress}
            />

            {/* 10. RSVP & Doa Restu (#rsvp, #wishes) */}
            <RsvpSection
              wishes={wishes}
              guestName={guestName}
              onAddWish={handleAddWish}
              onShowToast={(msg) => showToast(msg, 'success')}
            />

            {/* 11. Closing Thanks & Footer (#closing) */}
            <ClosingSection couple={couple} />
          </div>
        )}
      </div>

      {/* Fixed Bottom Navigation Bar */}
      {isOpened && (
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId)}
        />
      )}
    </div>
  );
}
