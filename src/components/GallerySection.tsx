import React, { useState } from 'react';
import { GALLERY_PHOTOS } from '../data/weddingData';
import { GalleryPhoto } from '../types';
import { PhotoLightbox } from './PhotoLightbox';
import { ZoomIn } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  return (
    <section id="gallerySection" className="px-4 py-4 flex flex-col items-center">
      <div className="w-full max-w-[420px] flex flex-col gap-4">
        <div className="text-center">
          <span className="text-[12px] font-bold text-[#cc3a63] tracking-widest uppercase block">
            Galeri Foto
          </span>
          <h2 className="text-[26px] font-bold text-[#2b2620] font-heading mt-0.5">
            Momen Bahagia
          </h2>
        </div>

        {/* Playful Scrapbook Polaroid Grid */}
        <div className="grid grid-cols-2 gap-3.5">
          {GALLERY_PHOTOS.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className={`group relative rounded-xl bg-white p-2 shadow-[2px_3px_0px_#4a4238] border-2 border-[#4a4238] ${photo.rotation} hover:rotate-0 hover:scale-[1.03] transition-all duration-200 cursor-pointer`}
            >
              <div className="w-full h-36 rounded-md overflow-hidden relative bg-[#f9f0e0]">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="p-1.5 rounded-full bg-white/90 text-[#cc3a63] shadow-sm">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <PhotoLightbox
        photo={selectedPhoto}
        photos={GALLERY_PHOTOS}
        onClose={() => setSelectedPhoto(null)}
        onSelectPhoto={(p) => setSelectedPhoto(p)}
      />
    </section>
  );
};
