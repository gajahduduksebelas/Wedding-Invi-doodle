import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Upload,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  Check,
  Sparkles,
  Crop,
  Sliders,
  Image as ImageIcon,
} from 'lucide-react';

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedDataUrl: string, metadata?: { width: number; height: number }) => void;
  initialImage?: string;
  title?: string;
  targetAspectRatio?: '4:5' | '1:1' | '16:9' | '3:4' | 'free';
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  onClose,
  onCropComplete,
  initialImage = '',
  title = 'Upload & Edit / Crop Foto',
  targetAspectRatio = '4:5',
}) => {
  const [imageSrc, setImageSrc] = useState<string>(initialImage);
  const [aspectRatio, setAspectRatio] = useState<'4:5' | '1:1' | '16:9' | '3:4' | 'free'>(
    targetAspectRatio
  );
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [filterMode, setFilterMode] = useState<'normal' | 'warm' | 'vintage' | 'bw'>('normal');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Sync initial image when opened
  useEffect(() => {
    if (isOpen) {
      if (initialImage) {
        setImageSrc(initialImage);
      }
      setZoom(1);
      setRotation(0);
      setFlipH(false);
      setPan({ x: 0, y: 0 });
      setFilterMode('normal');
      setAspectRatio(targetAspectRatio);
    }
  }, [isOpen, initialImage, targetAspectRatio]);

  // Handle direct file upload from user device (mobile gallery / camera / desktop)
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Pilih file gambar berformat JPG, PNG, atau WEBP.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageSrc(e.target.result as string);
        setZoom(1);
        setPan({ x: 0, y: 0 });
        setRotation(0);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Drag / Pan handlers (touch and mouse)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile phones
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Ratio aspect calculation
  const getAspectNumeric = () => {
    switch (aspectRatio) {
      case '1:1':
        return 1;
      case '4:5':
        return 4 / 5;
      case '16:9':
        return 16 / 9;
      case '3:4':
        return 3 / 4;
      default:
        return 4 / 5;
    }
  };

  // Perform client-side Canvas rendering to generate cropped image data URL
  const handleGenerateCrop = async () => {
    if (!imageSrc) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageSrc;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Destination crop dimensions
      let targetWidth = 900;
      let targetHeight = 1125; // default 4:5

      if (aspectRatio === '1:1') {
        targetWidth = 800;
        targetHeight = 800;
      } else if (aspectRatio === '16:9') {
        targetWidth = 1080;
        targetHeight = 608;
      } else if (aspectRatio === '3:4') {
        targetWidth = 900;
        targetHeight = 1200;
      } else if (aspectRatio === 'free') {
        targetWidth = img.naturalWidth || 800;
        targetHeight = img.naturalHeight || 1000;
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Canvas context not available');

      // Apply Filter
      if (filterMode === 'warm') {
        ctx.filter = 'contrast(105%) saturate(120%) sepia(15%)';
      } else if (filterMode === 'vintage') {
        ctx.filter = 'contrast(95%) saturate(85%) sepia(35%)';
      } else if (filterMode === 'bw') {
        ctx.filter = 'grayscale(100%) contrast(115%)';
      }

      ctx.save();

      // Center transformations
      ctx.translate(targetWidth / 2, targetHeight / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      if (flipH) {
        ctx.scale(-1, 1);
      }

      // Draw Image with Pan & Zoom relative to viewport scale
      // Calculate viewport vs canvas ratio
      const viewportEl = containerRef.current;
      const viewportWidth = viewportEl ? viewportEl.clientWidth : 320;
      const viewportHeight = viewportEl ? viewportEl.clientHeight : 400;

      const scaleMultiplier = targetWidth / viewportWidth;

      // Draw dimensions scaled
      const scaledWidth = img.naturalWidth * zoom * (targetWidth / (img.naturalWidth || targetWidth));
      const scaledHeight = img.naturalHeight * zoom * (targetHeight / (img.naturalHeight || targetHeight));

      const drawX = pan.x * scaleMultiplier - scaledWidth / 2;
      const drawY = pan.y * scaleMultiplier - scaledHeight / 2;

      ctx.drawImage(img, drawX, drawY, scaledWidth, scaledHeight);
      ctx.restore();

      // Export as clean JPEG Data URL (quality 0.9 for fast loading & great clarity)
      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
      onCropComplete(croppedDataUrl, { width: targetWidth, height: targetHeight });
      onClose();
    } catch (err) {
      console.error('Error cropping image:', err);
      // Fallback: return original image if canvas failed (e.g. CORS)
      onCropComplete(imageSrc);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#fffdfa] rounded-3xl border-2 border-[#4a4238] shadow-[4px_6px_0px_#4a4238] w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-[#e6dac5] bg-[#f9f0e0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#fcecf0] text-[#cc3a63] flex items-center justify-center border border-[#cc3a63]/30">
              <Crop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#2b2620] font-heading leading-tight">
                {title}
              </h3>
              <p className="text-[11px] text-[#7a7065]">
                Upload dari perangkat &amp; sesuaikan potongan gambar
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#edd9bf] border border-[#4a4238] flex items-center justify-center text-[#2b2620] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex flex-col gap-4">
          {/* File Upload Zone */}
          {!imageSrc ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#a2ab73] bg-[#fdfaf5] hover:bg-[#f0f3e3] rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-[#f0f3e3] border-2 border-[#a2ab73] flex items-center justify-center text-[#51582f] shadow-sm">
                <Upload className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#2b2620]">
                  Pilih Foto dari Galeri / Kamera HP
                </p>
                <p className="text-[12px] text-[#7a7065] mt-1">
                  Ketuk di sini atau seret file gambar (JPG, PNG, WEBP)
                </p>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-[#51582f] text-[11px] font-bold border border-[#a2ab73] shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Pilih Berkas Foto
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Replace / Upload Different Photo Button */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#7a7065] uppercase">
                  Area Pemotongan Foto
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#cc3a63] hover:underline cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  <span>Ganti File Foto</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="hidden"
                />
              </div>

              {/* Interactive Cropper Viewport */}
              <div
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                  aspectRatio: getAspectNumeric(),
                }}
                className="w-full max-h-[360px] mx-auto rounded-2xl border-2 border-[#4a4238] bg-[#211b12] relative overflow-hidden flex items-center justify-center shadow-inner cursor-grab active:cursor-grabbing select-none"
              >
                {/* Image under transform */}
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt="Crop preview"
                  draggable={false}
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg) scaleX(${flipH ? -1 : 1})`,
                    filter:
                      filterMode === 'warm'
                        ? 'contrast(105%) saturate(120%) sepia(15%)'
                        : filterMode === 'vintage'
                        ? 'contrast(95%) saturate(85%) sepia(35%)'
                        : filterMode === 'bw'
                        ? 'grayscale(100%) contrast(115%)'
                        : 'none',
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                  }}
                  className="max-w-none pointer-events-none origin-center"
                />

                {/* Grid Overlay Guides */}
                <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/30">
                  <div className="border-r border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-b border-white/20" />
                  <div className="border-r border-white/20" />
                  <div className="border-r border-white/20" />
                  <div />
                </div>

                {/* Tip Badge */}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs pointer-events-none">
                  👆 Geser untuk posisikan
                </div>
              </div>

              {/* Aspect Ratio Selector Pills */}
              <div>
                <label className="text-[11px] font-bold text-[#7a7065] block uppercase mb-1.5">
                  Rasio Potongan (Aspect Ratio)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: '4:5', label: '4:5 (Galeri)', desc: 'Vertikal' },
                    { id: '1:1', label: '1:1 (Persegi)', desc: 'Avatar' },
                    { id: '16:9', label: '16:9 (Landscape)', desc: 'Cinematic' },
                    { id: '3:4', label: '3:4 (Potret)', desc: 'Klasik' },
                  ].map((ratio) => (
                    <button
                      key={ratio.id}
                      type="button"
                      onClick={() => setAspectRatio(ratio.id as any)}
                      className={`py-1.5 px-2 rounded-xl text-center border transition-all cursor-pointer ${
                        aspectRatio === ratio.id
                          ? 'bg-[#cc3a63] text-white border-[#4a4238] shadow-[1px_2px_0px_#4a4238] font-bold'
                          : 'bg-[#fdfaf5] hover:bg-[#f9f0e0] text-[#2b2620] border-[#d8c8b4] font-medium'
                      }`}
                    >
                      <span className="text-[11px] block">{ratio.id}</span>
                      <span className="text-[9px] opacity-80 block">{ratio.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Zoom & Rotation Controls Bar */}
              <div className="bg-[#f9f0e0] p-3 rounded-2xl border border-[#e6dac5] flex flex-col gap-2.5">
                {/* Zoom Slider */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-[#524348] min-w-[48px] flex items-center gap-1">
                    <ZoomIn className="w-3.5 h-3.5" />
                    Zoom
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
                    className="w-7 h-7 rounded-lg bg-white border border-[#4a4238] flex items-center justify-center text-[12px] font-bold active:scale-95 cursor-pointer shadow-xs"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min="0.6"
                    max="2.5"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1 accent-[#cc3a63] cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.min(2.5, z + 0.15))}
                    className="w-7 h-7 rounded-lg bg-white border border-[#4a4238] flex items-center justify-center text-[12px] font-bold active:scale-95 cursor-pointer shadow-xs"
                  >
                    +
                  </button>
                  <span className="text-[11px] font-mono font-bold text-[#7a7065] w-9 text-right">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>

                {/* Transform Buttons (Rotate, Flip, Reset) */}
                <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#e6dac5]">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setRotation((r) => (r - 90) % 360)}
                      className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#fff7eb] border border-[#4a4238] text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                      title="Putar 90° ke kiri"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#7a7065]" />
                      <span className="hidden sm:inline">-90°</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRotation((r) => (r + 90) % 360)}
                      className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#fff7eb] border border-[#4a4238] text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                      title="Putar 90° ke kanan"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-[#7a7065]" />
                      <span className="hidden sm:inline">+90°</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFlipH((f) => !f)}
                      className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-xs ${
                        flipH
                          ? 'bg-[#cc3a63] text-white border-[#4a4238]'
                          : 'bg-white hover:bg-[#fff7eb] text-[#2b2620] border-[#4a4238]'
                      }`}
                      title="Cermin Horizontal"
                    >
                      <FlipHorizontal className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Cermin</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setZoom(1);
                      setPan({ x: 0, y: 0 });
                      setRotation(0);
                      setFlipH(false);
                      setFilterMode('normal');
                    }}
                    className="text-[11px] text-[#7a7065] hover:text-[#2b2620] font-semibold underline cursor-pointer"
                  >
                    Reset Posisi
                  </button>
                </div>
              </div>

              {/* Tone / Color Filter Selector */}
              <div>
                <label className="text-[11px] font-bold text-[#7a7065] block uppercase mb-1">
                  Sentuhan Nuansa Warna
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'normal', label: 'Asli', bg: 'bg-white' },
                    { id: 'warm', label: 'Warm', bg: 'bg-[#fff5eb]' },
                    { id: 'vintage', label: 'Vintage', bg: 'bg-[#f6eee3]' },
                    { id: 'bw', label: 'B & W', bg: 'bg-[#ececec]' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFilterMode(f.id as any)}
                      className={`py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                        filterMode === f.id
                          ? 'bg-[#51582f] text-white border-[#4a4238] shadow-[1px_2px_0px_#4a4238]'
                          : `${f.bg} text-[#2b2620] border-[#d8c8b4] hover:border-[#4a4238]`
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 py-3.5 border-t border-[#e6dac5] bg-[#f9f0e0] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#edd9bf] text-[#2b2620] text-[12px] font-bold border border-[#4a4238] cursor-pointer"
          >
            Batal
          </button>

          <button
            type="button"
            disabled={!imageSrc || isProcessing}
            onClick={handleGenerateCrop}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#cc3a63] hover:bg-[#b52d53] disabled:opacity-50 text-white text-[13px] font-bold shadow-[2px_2px_0px_#4a4238] border border-[#4a4238] active:translate-y-0.5 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{isProcessing ? 'Memproses Potongan...' : 'Crop & Terapkan Foto'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
