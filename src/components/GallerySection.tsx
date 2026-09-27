import React, { useState } from 'react';
import { GALLERY_PHOTOS } from '../data/weddingData';
import { GalleryPhoto } from '../types';
import { PhotoLightbox } from './PhotoLightbox';
import { DoodleBouquet, SectionHeading } from './DoodleIcons';
import { Play } from 'lucide-react';

interface GallerySectionProps {
  photos?: GalleryPhoto[];
  videoUrl?: string;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ photos, videoUrl }) => {
  const activePhotos = photos || GALLERY_PHOTOS;
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const galleryVideoSrc = videoUrl || 'https://dev.janjiharmoni.id/themes/shared/gallery-video.webm';

  return (
    <section
      id="gallery"
      aria-label="Galeri Foto dan Video"
      className="w-full px-4 py-10 flex flex-col items-center justify-center relative select-none"
    >
      {/* Flower Bouquet Doodle on Right */}
      <div className="absolute top-8 right-2 z-10 pointer-events-none opacity-85">
        <DoodleBouquet className="w-16 sm:w-18 h-auto" />
      </div>

      <div className="w-full max-w-[400px] flex flex-col items-center relative z-20">
        <SectionHeading
          subheadline="Kenangan dalam gambar"
          headline="GALERI FOTO"
          subheadlineColor="#B4533C"
          headlineColor="#181818"
          underlineColor="#B4533C"
          className="mb-5"
        />

        {/* Video Card Player */}
        <div className="w-full rounded-[28px] border-[2.5px] border-[#181818] shadow-[6px_6px_0px_#181818] overflow-hidden mb-5 bg-[#1C1A1A] relative aspect-video flex items-center justify-center">
          {isVideoPlaying ? (
            <video
              className="w-full h-full object-cover"
              controls
              autoPlay
              playsInline
            >
              <source src={galleryVideoSrc} type="video/webm" />
              <source src="https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-bride-and-groom-holding-each-other-41484-large.mp4" type="video/mp4" />
              Browser Anda tidak mendukung tag video.
            </video>
          ) : (
            <div
              onClick={() => setIsVideoPlaying(true)}
              className="w-full h-full relative cursor-pointer group flex items-center justify-center bg-[#1C1A1A]"
            >
              {/* Play Button Icon */}
              <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-xs border-[2px] border-white/60 flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:bg-white/25 transition-all">
                <Play className="w-7 h-7 fill-white translate-x-0.5" />
              </div>
            </div>
          )}
        </div>

        {/* Photo Grid: 2 columns, exactly like IMG_2713.PNG */}
        <div className="w-full grid grid-cols-2 gap-3.5">
          {activePhotos.map((photo, idx) => (
            <figure
              key={photo.id || idx}
              onClick={() => setSelectedPhoto(photo)}
              className="relative rounded-[20px] border-[2.5px] border-[#181818] shadow-[4px_4px_0px_#181818] overflow-hidden bg-white aspect-[3/4] cursor-pointer group hover:-translate-y-0.5 transition-transform"
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
