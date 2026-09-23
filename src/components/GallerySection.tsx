import React, { useState } from 'react';
import { GALLERY_PHOTOS, DOODLE_ASSETS } from '../data/weddingData';
import { GalleryPhoto } from '../types';
import { PhotoLightbox } from './PhotoLightbox';
import { ZoomIn, Sparkles, Heart } from 'lucide-react';

interface GallerySectionProps {
  photos?: GalleryPhoto[];
  videoUrl?: string;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ photos, videoUrl }) => {
  const activePhotos = photos || GALLERY_PHOTOS;
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  const galleryVideoSrc = videoUrl || 'https://dev.janjiharmoni.id/themes/shared/gallery-video.webm';

  return (
    <section
      id="gallery"
      className="min-h-dvh w-full px-4 py-8 flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Floating Random Doodle Assets */}
      <img
        src={DOODLE_ASSETS.bouquet}
        alt=""
        aria-hidden="true"
        className="absolute top-5 left-3 w-14 sm:w-16 h-14 sm:h-16 object-contain pointer-events-none opacity-85 animate-doodle-bob z-10"
      />
      <img
        src={DOODLE_ASSETS.heartBalloons}
        alt=""
        aria-hidden="true"
        className="absolute top-5 right-3 w-16 sm:w-20 h-16 sm:h-20 object-contain pointer-events-none opacity-85 animate-doodle-slow z-10"
      />
      <img
        src={DOODLE_ASSETS.loveBirds}
        alt=""
        aria-hidden="true"
        className="absolute bottom-5 left-3 w-12 sm:w-14 h-12 sm:h-14 object-contain pointer-events-none opacity-85 animate-doodle-float z-10"
      />
      <img
        src={DOODLE_ASSETS.toast}
        alt=""
        aria-hidden="true"
        className="absolute bottom-5 right-3 w-12 sm:w-14 h-12 sm:h-14 object-contain pointer-events-none opacity-85 animate-doodle-sway z-10"
      />

      <div className="absolute top-1/2 left-3 text-[#cc3a63]/30 pointer-events-none animate-doodle-pulse">
        <Heart className="w-4 h-4 fill-current" />
      </div>
      <div className="absolute top-1/2 right-3 text-[#8b965f]/40 pointer-events-none animate-doodle-pulse">
        <Sparkles className="w-5 h-5" />
      </div>

      <div className="w-full max-w-[420px] flex flex-col items-center relative z-20 my-auto">
        {/* Heading Coral */}
        <header className="cd-heading cd-heading-coral mb-3">
          <span>Kenangan dalam gambar</span>
          <h2>GALERI FOTO</h2>
          <i aria-hidden="true" />
        </header>

        {/* Gallery Video Player (Border-free clean shadow) */}
        <div className="w-full rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(74,66,56,0.12)] mb-5 bg-black">
          <video
            className="w-full aspect-video object-cover"
            controls
            preload="metadata"
            playsInline
          >
            <source src={galleryVideoSrc} type="video/webm" />
            <source src="https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-bride-and-groom-holding-each-other-41484-large.mp4" type="video/mp4" />
            Browser Anda tidak mendukung tag video.
          </video>
        </div>

        {/* Playful Scrapbook Polaroid Grid (Border-free, subtle drop shadows) */}
        <div className="w-full grid grid-cols-2 gap-3.5">
          {activePhotos.map((photo, idx) => {
            const isTiltLeft = idx % 2 === 0;
            const tiltClass = isTiltLeft
              ? '-rotate-1 hover:rotate-0'
              : 'rotate-1 hover:rotate-0';

            return (
              <figure
                key={photo.id || idx}
                onClick={() => setSelectedPhoto(photo)}
                className={`relative rounded-2xl bg-white/95 p-2 sm:p-2.5 shadow-[0_8px_25px_rgba(74,66,56,0.08)] ${tiltClass} transition-all duration-200 cursor-pointer group`}
              >
                <div className="w-full h-36 sm:h-40 rounded-xl overflow-hidden relative bg-[#f9f0e0]">
                  <img
                    src={photo.src}
                    alt={photo.alt || `Galeri foto ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="p-2 rounded-full bg-white text-[#cc3a63] shadow-md">
                      <ZoomIn className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </figure>
            );
          })}
        </div>
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
