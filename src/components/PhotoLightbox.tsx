import React, { useEffect } from 'react';
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

  return (
    <div className="fixed inset-0 z-50 bg-[#211b12]/85 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Tutup preview foto"
        className="absolute top-4 right-4 p-2 rounded-full bg-white/90 text-[#211b12] hover:bg-white shadow-[2px_2px_0px_#4a4238] border border-[#4a4238] transition-all z-10"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Container */}
      <div className="relative max-w-[500px] w-full flex flex-col items-center">
        <div className="w-full bg-white p-3.5 rounded-2xl shadow-[5px_6px_0px_#4a4238] border-2 border-[#4a4238] overflow-hidden">
          <div className="w-full max-h-[65vh] rounded-xl overflow-hidden bg-[#f9f0e0]">
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-full object-contain mx-auto"
            />
          </div>

          <div className="flex items-center justify-between mt-3 px-1">
            <div>
              <h4 className="text-[17px] font-bold text-[#cc3a63] font-heading">
                {photo.title}
              </h4>
              <p className="text-[12px] font-medium text-[#7a7065] mt-0.5">
                Foto {currentIndex + 1} dari {photos.length}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                aria-label="Foto sebelumnya"
                className="p-2 rounded-full bg-[#f9f0e0] hover:bg-[#edd9bf] text-[#2b2620] border border-[#4a4238] shadow-[1px_2px_0px_#4a4238] active:translate-y-0.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Foto berikutnya"
                className="p-2 rounded-full bg-[#f9f0e0] hover:bg-[#edd9bf] text-[#2b2620] border border-[#4a4238] shadow-[1px_2px_0px_#4a4238] active:translate-y-0.5 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
