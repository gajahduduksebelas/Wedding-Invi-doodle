import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GALLERY_PHOTOS, DEFAULT_VIDEO_URL, extractYouTubeId } from '../data/weddingData';
import { GalleryPhoto, VideoConfig } from '../types';
import { PhotoLightbox } from './PhotoLightbox';
import { DoodleBouquet, SectionHeading } from './DoodleIcons';
import { Volume2, VolumeX } from 'lucide-react';

interface GallerySectionProps {
  photos?: GalleryPhoto[];
  video?: VideoConfig;
  onVideoActiveChange?: (isActive: boolean) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  photos,
  video,
  onVideoActiveChange,
}) => {
  const activePhotos = photos || GALLERY_PHOTOS;
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const youtubeRef = useRef<HTMLIFrameElement | null>(null);
  const isInViewRef = useRef(false);
  const [isInView, setIsInView] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Same source resolution as the CMS VideoEditor: an explicit sourceType
  // wins, otherwise a stored file/URL means 'upload', else YouTube.
  const sourceType = video?.sourceType || (video?.directVideoUrl ? 'upload' : 'youtube');
  const youtubeId = sourceType === 'youtube' ? extractYouTubeId(video?.youtubeUrl || '') : null;
  const galleryVideoSrc =
    video?.directVideoUrl ||
    video?.embedUrl ||
    DEFAULT_VIDEO_URL;
  const shouldLoop = video?.loop !== false;
  // YouTube iframe player is driven through its postMessage API (enablejsapi=1).
  const sendYoutubeCommand = useCallback((func: string, args: unknown[] = []) => {
    youtubeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args }), '*');
  }, []);

  // Sound on as soon as the video plays. Most phones allow it because the
  // guest already tapped "Buka Undangan"; where the browser still insists on
  // a fresh tap (iOS), the video starts muted and the next tap anywhere on
  // the page turns the sound on.
  const unmuteOnNextTapRef = useRef<(() => void) | null>(null);
  const armUnmuteOnNextTap = useCallback(() => {
    if (unmuteOnNextTapRef.current) return;
    const handler = () => {
      document.removeEventListener('pointerdown', handler, true);
      document.removeEventListener('keydown', handler, true);
      unmuteOnNextTapRef.current = null;
      if (!isInViewRef.current) return;
      if (youtubeRef.current) {
        sendYoutubeCommand('unMute');
        sendYoutubeCommand('setVolume', [100]);
        sendYoutubeCommand('playVideo');
      }
      const vid = videoRef.current;
      if (vid) {
        vid.muted = false;
        setIsMuted(false);
        vid.play().catch(() => {});
      }
    };
    unmuteOnNextTapRef.current = handler;
    document.addEventListener('pointerdown', handler, true);
    document.addEventListener('keydown', handler, true);
  }, [sendYoutubeCommand]);

  useEffect(
    () => () => {
      const handler = unmuteOnNextTapRef.current;
      if (handler) {
        document.removeEventListener('pointerdown', handler, true);
        document.removeEventListener('keydown', handler, true);
      }
    },
    []
  );

  const playVideo = useCallback(() => {
    if (youtubeId) {
      sendYoutubeCommand('playVideo');
      sendYoutubeCommand('unMute');
      sendYoutubeCommand('setVolume', [100]);
      // YouTube can't report whether the unmute was allowed; the next tap
      // re-applies it (harmless if the sound is already on).
      armUnmuteOnNextTap();
      onVideoActiveChange?.(true);
      return;
    }
    const vid = videoRef.current;
    if (!vid) return;

    vid.muted = false;
    setIsMuted(false);
    vid
      .play()
      .then(() => {
        onVideoActiveChange?.(true);
      })
      .catch(() => {
        // Sound blocked by the browser: play muted now, unmute on next tap.
        vid.muted = true;
        setIsMuted(true);
        armUnmuteOnNextTap();
        vid
          .play()
          .then(() => {
            onVideoActiveChange?.(true);
          })
          .catch(() => {});
      });
  }, [onVideoActiveChange, youtubeId, sendYoutubeCommand, armUnmuteOnNextTap]);

  const pauseVideo = useCallback(() => {
    if (youtubeId) sendYoutubeCommand('pauseVideo');
    const vid = videoRef.current;
    if (vid) {
      vid.pause();
    }
    onVideoActiveChange?.(false);
  }, [onVideoActiveChange, youtubeId, sendYoutubeCommand]);

  // Combined IntersectionObserver and container scroll detection
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const scrollContainer = document.getElementById('invitationScrollContainer');

    const handleContainerScroll = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const containerRect = scrollContainer
        ? scrollContainer.getBoundingClientRect()
        : { top: 0, bottom: window.innerHeight };
      const midPoint = (containerRect.top + containerRect.bottom) / 2;

      // Section is active if container midpoint is inside the gallery section
      const isFocused = rect.top <= midPoint && rect.bottom >= midPoint;

      if (isFocused && !isInViewRef.current) {
        isInViewRef.current = true;
        setIsInView(true);
        playVideo();
      } else if (!isFocused && isInViewRef.current) {
        isInViewRef.current = false;
        setIsInView(false);
        pauseVideo();
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            if (!isInViewRef.current) {
              isInViewRef.current = true;
              setIsInView(true);
              playVideo();
            }
          } else if (!entry.isIntersecting || entry.intersectionRatio < 0.25) {
            if (isInViewRef.current) {
              isInViewRef.current = false;
              setIsInView(false);
              pauseVideo();
            }
          }
        });
      },
      {
        threshold: [0.1, 0.25, 0.4, 0.65],
      }
    );

    observer.observe(el);

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleContainerScroll, { passive: true });
    } else {
      window.addEventListener('scroll', handleContainerScroll, { passive: true });
    }

    return () => {
      observer.disconnect();
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleContainerScroll);
      } else {
        window.removeEventListener('scroll', handleContainerScroll);
      }
    };
  }, [playVideo, pauseVideo]);

  return (
    <section
      ref={sectionRef}
      id="gallery"
      aria-label="Galeri Foto dan Video"
      className="mobile-snap-section w-full px-4 py-6 flex flex-col items-center justify-center relative select-none"
    >
      {/* Flower Bouquet Doodle on Right */}
      <div className="absolute top-6 right-2 z-10 pointer-events-none opacity-85">
        <DoodleBouquet className="w-14 sm:w-16 h-auto" />
      </div>

      <div className="w-full max-w-[400px] flex flex-col items-center relative z-20 my-auto animate-doodle-in">
        <SectionHeading
          subheadline="Kenangan dalam gambar"
          headline="GALERI FOTO"
          subheadlineColor="#B4533C"
          headlineColor="#181818"
          underlineColor="#B4533C"
          className="mb-3.5"
        />

        {/* Video Card Player with Auto Play / Pause on View */}
        <div className="w-full rounded-[24px] border-[2px] border-[#181818] shadow-[4px_4px_0px_#181818] overflow-hidden mb-3.5 bg-[#1C1A1A] relative aspect-video flex items-center justify-center">
          {youtubeId ? (
            <iframe
              ref={youtubeRef}
              key={youtubeId}
              className="w-full h-full"
              // Loaded muted so it is allowed to autoplay; playVideo turns the sound on.
              src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&playsinline=1&rel=0&mute=1${
                shouldLoop ? `&loop=1&playlist=${youtubeId}` : ''
              }&origin=${encodeURIComponent(window.location.origin)}`}
              title={video?.title || 'Video Prewedding'}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              // YouTube rejects embeds that arrive without a referrer
              // ("Error 153"), so send the page origin explicitly.
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              onLoad={() => {
                // Play commands sent before the player finished loading are
                // dropped; replay it if the gallery is already on screen.
                if (isInViewRef.current) {
                  setTimeout(playVideo, 400);
                }
              }}
            />
          ) : (
          <>
          <video
            ref={videoRef}
            // key forces the element to reload when the CMS changes the source;
            // <source> src changes alone are ignored by the browser.
            key={galleryVideoSrc}
            className="w-full h-full object-cover"
            controls
            playsInline
            loop={shouldLoop}
            muted={isMuted}
            preload="auto"
            onPlay={() => {
              isInViewRef.current = true;
              onVideoActiveChange?.(true);
            }}
            onPause={() => {
              if (!isInViewRef.current) {
                onVideoActiveChange?.(false);
              }
            }}
          >
            <source src={galleryVideoSrc} />
            <source src="https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-bride-and-groom-holding-each-other-41484-large.mp4" type="video/mp4" />
            Browser Anda tidak mendukung tag video.
          </video>

          {/* Mute / Unmute Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (videoRef.current) {
                const nextMuted = !videoRef.current.muted;
                videoRef.current.muted = nextMuted;
                setIsMuted(nextMuted);
              }
            }}
            className="absolute top-2.5 right-2.5 z-20 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs border border-white/20 text-white text-[11px] font-medium flex items-center gap-1.5 hover:bg-black/80 transition-all cursor-pointer"
            aria-label={isMuted ? 'Aktifkan suara video' : 'Bisukan suara video'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-stone-300" />
                <span>Bisu</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#B4533C]" />
                <span>Suara</span>
              </>
            )}
          </button>
          </>
          )}
        </div>

        {/* Photo Grid Preview: 6 selected photos in viewport with scrollable lightbox */}
        <div className="w-full grid grid-cols-3 gap-2">
          {activePhotos.slice(0, 6).map((photo, idx) => (
            <figure
              key={photo.id || idx}
              onClick={() => setSelectedPhoto(photo)}
              className="relative rounded-[16px] border-[2px] border-[#181818] shadow-[2.5px_2.5px_0px_#181818] overflow-hidden bg-white aspect-[3/4] cursor-pointer group hover:-translate-y-0.5 transition-transform"
            >
              <img
                src={photo.src}
                alt={photo.alt || `Galeri foto ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </figure>
          ))}
        </div>

        <p className="text-[11px] text-stone-600 mt-2 font-medium">
          ✨ Klik foto untuk memperbesar &amp; melihat semua ({activePhotos.length} foto)
        </p>
      </div>

      {/* Lightbox Modal */}
      <PhotoLightbox
        photo={selectedPhoto}
        photos={activePhotos}
        onClose={() => setSelectedPhoto(null)}
        onSelectPhoto={(p) => setSelectedPhoto(p)}
      />
    </section>
  );
};
