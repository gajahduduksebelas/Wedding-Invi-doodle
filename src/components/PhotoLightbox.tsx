import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryPhoto } from '../types';

interface PhotoLightboxProps {
  photo: GalleryPhoto | null;
  photos: GalleryPhoto[];
  onClose: () => void;
  onSelectPhoto: (photo: GalleryPhoto) => void;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  photo,
  photos,
  onClose,
  onSelectPhoto,
}) => {
  useEffect(() => {
    if (!photo) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photo, photos]);

  if (!photo) return null;

  const currentIndex = photos.findIndex((p) => p.id === photo.id);

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + photos.length) % photos.length;
    onSelectPhoto(photos[prevIdx]);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % photos.length;
    onSelectPhoto(photos[nextIdx]);
  };

  // Rendered at the page root so it always sits above the bottom nav, even
  // though the gallery section is its own stacking context.
  return createPortal(
    <div className="fixed inset-0 z-50 bg-[#211b12]/85 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Tutup preview foto"
        className="absolute top-4 right-4 p-2 rounded-full bg-white/90 text-[#3A3232] hover:bg-white shadow-md border border-[#E8E0D5] transition-all z-10 cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Main Container */}
      <div className="relative max-w-[500px] w-full flex flex-col items-center">
        <div className="w-full bg-white p-3.5 rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.25)] border border-[#E8E0D5] overflow-hidden">
          <div className="w-full max-h-[65vh] rounded-2xl overflow-hidden bg-[#FBF8F3]">
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-full object-contain mx-auto"
            />
          </div>

          <div className="flex items-center justify-between mt-3 px-1">
            <div>
              <h4 className="text-[17px] font-serif font-semibold text-[#6E1A2D]">
                {photo.title}
              </h4>
              <p className="text-[11.5px] font-sans text-[#756868] mt-0.5">
                Foto {currentIndex + 1} dari {photos.length}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                aria-label="Foto sebelumnya"
                className="p-2 rounded-full bg-[#FBF8F3] hover:bg-[#F7ECEF] text-[#6E1A2D] border border-[#E8E0D5] active:translate-y-0.5 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Foto berikutnya"
                className="p-2 rounded-full bg-[#FBF8F3] hover:bg-[#F7ECEF] text-[#6E1A2D] border border-[#E8E0D5] active:translate-y-0.5 transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
