import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Upload,
  ZoomIn,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  Check,
  Sparkles,
  Crop,
  Eye,
} from 'lucide-react';
import { uploadMedia } from '../../lib/mediaUpload';

export type CropAspect = '4:3' | '3:4' | '4:5' | '1:1' | '16:9';

// Aspect ratios of the frames the invitation actually shows photos in, so a
// crop made in the CMS appears exactly as framed here.
export const PHOTO_ASPECTS = {
  couple: '4:5', // CoupleSection portrait frame (aspect-[4/5])
  gallery: '3:4', // GallerySection grid tiles (aspect-[3/4])
  cover: '1:1', // AnnouncementSection (#home) cover photo
} as const satisfies Record<string, CropAspect>;

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Receives the stored URL of the cropped photo (a data: URL in local-only mode). */
  onCropComplete: (croppedUrl: string, metadata?: { width: number; height: number }) => void;
  initialImage?: string;
  title?: string;
  targetAspectRatio?: CropAspect;
  /** Where the photo appears on the invitation, shown above the live preview. */
  previewLabel?: string;
}

type FilterMode = 'normal' | 'warm' | 'vintage' | 'bw';

const FILTERS: Record<FilterMode, string> = {
  normal: 'none',
  warm: 'contrast(105%) saturate(120%) sepia(15%)',
  vintage: 'contrast(95%) saturate(85%) sepia(35%)',
  bw: 'grayscale(100%) contrast(115%)',
};

const MAX_ZOOM = 4;
// Longest side of the exported photo, in pixels.
const OUTPUT_LONG_SIDE = 1440;

const aspectValue = (aspect: CropAspect) => {
  const [w, h] = aspect.split(':').map(Number);
  return w / h;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  onClose,
  onCropComplete,
  initialImage = '',
  title = 'Upload & Edit / Crop Foto',
  targetAspectRatio = PHOTO_ASPECTS.gallery,
  previewLabel = 'Tampilan di undangan',
}) => {
  const aspect = aspectValue(targetAspectRatio);

  const [imageSrc, setImageSrc] = useState<string>(initialImage);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  // Set when an image from another site can be shown but not exported
  // (the canvas is blocked by the browser's cross-origin rules).
  const [isTainted, setIsTainted] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [frame, setFrame] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [filterMode, setFilterMode] = useState<FilterMode>('normal');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imgElRef = useRef<HTMLImageElement | null>(null);
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const gestureRef = useRef<{
    startPan: { x: number; y: number };
    startPoint: { x: number; y: number };
    startZoom: number;
    startDistance: number;
  } | null>(null);

  const resetTransform = () => {
    setZoom(1);
    setRotation(0);
    setFlipH(false);
    setPan({ x: 0, y: 0 });
  };

  // Reset whenever the modal opens.
  useEffect(() => {
    if (!isOpen) return;
    setImageSrc(initialImage);
    resetTransform();
    setFilterMode('normal');
  }, [isOpen, initialImage]);

  // Load the image to learn its natural size. Remote images are requested
  // with CORS so they can be exported; if the server doesn't allow that, show
  // them anyway and explain that they need to be uploaded as a file instead.
  useEffect(() => {
    setNatural(null);
    setIsTainted(false);
    setLoadError(false);
    imgElRef.current = null;
    if (!imageSrc) return;

    let cancelled = false;
    const load = (withCors: boolean) => {
      const img = new Image();
      if (withCors && !imageSrc.startsWith('data:') && !imageSrc.startsWith('blob:')) {
        img.crossOrigin = 'anonymous';
      }
      img.onload = () => {
        if (cancelled) return;
        imgElRef.current = img;
        setIsTainted(!withCors && !imageSrc.startsWith('data:') && !imageSrc.startsWith('blob:'));
        setNatural({ w: img.naturalWidth, h: img.naturalHeight });
      };
      img.onerror = () => {
        if (cancelled) return;
        if (withCors) load(false);
        else setLoadError(true);
      };
      img.src = imageSrc;
    };
    load(true);
    return () => {
      cancelled = true;
    };
  }, [imageSrc]);

  // Track the crop frame's rendered size (it is responsive).
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const update = () => setFrame({ w: el.clientWidth, h: el.clientHeight });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isOpen, imageSrc]);

  // --- Geometry ---------------------------------------------------------
  // The image always covers the frame: at zoom 1 its shorter side (after
  // rotation) exactly fills the frame, like CSS object-fit: cover. Pan is the
  // offset of the image centre from the frame centre, in frame pixels, and
  // is clamped so no empty edge can show.
  const quarterTurn = rotation % 180 !== 0;
  const baseW = natural ? (quarterTurn ? natural.h : natural.w) : 1;
  const baseH = natural ? (quarterTurn ? natural.w : natural.h) : 1;
  const coverScale = natural && frame.w ? Math.max(frame.w / baseW, frame.h / baseH) : 1;

  const clampPan = useCallback(
    (p: { x: number; y: number }, z: number) => {
      const scale = coverScale * z;
      const maxX = Math.max(0, (baseW * scale - frame.w) / 2);
      const maxY = Math.max(0, (baseH * scale - frame.h) / 2);
      return { x: clamp(p.x, -maxX, maxX), y: clamp(p.y, -maxY, maxY) };
    },
    [coverScale, baseW, baseH, frame.w, frame.h]
  );

  const effectivePan = clampPan(pan, zoom);
  const scale = coverScale * zoom;

  const setZoomClamped = (next: number) => setZoom(clamp(next, 1, MAX_ZOOM));

  // Draws the image in any frame size; `ratio` scales frame pixels to it.
  const imageStyle = (ratio: number): React.CSSProperties => ({
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: natural ? natural.w * scale * ratio : 0,
    height: natural ? natural.h * scale * ratio : 0,
    maxWidth: 'none',
    transform: `translate(-50%, -50%) translate(${effectivePan.x * ratio}px, ${
      effectivePan.y * ratio
    }px) rotate(${rotation}deg) scaleX(${flipH ? -1 : 1})`,
    filter: FILTERS[filterMode],
    transition: isDragging ? 'none' : 'transform 0.08s ease-out',
  });

  // --- Pointer gestures (mouse, touch, pen): drag to pan, pinch to zoom --
  const beginGesture = () => {
    const points = [...pointersRef.current.values()];
    const [a, b] = points;
    gestureRef.current = {
      startPan: effectivePan,
      startPoint: a,
      startZoom: zoom,
      startDistance: b ? Math.hypot(a.x - b.x, a.y - b.y) : 0,
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!natural) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setIsDragging(true);
    beginGesture();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointersRef.current.has(e.pointerId) || !gestureRef.current) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const points = [...pointersRef.current.values()];
    const g = gestureRef.current;

    if (points.length >= 2 && g.startDistance > 0) {
      const distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      setZoomClamped(g.startZoom * (distance / g.startDistance));
    } else {
      setPan({
        x: g.startPan.x + (points[0].x - g.startPoint.x),
        y: g.startPan.y + (points[0].y - g.startPoint.y),
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    pointersRef.current.delete(e.pointerId);
    // Store the clamped pan so the next drag starts where the image is.
    setPan(effectivePan);
    if (pointersRef.current.size === 0) {
      setIsDragging(false);
      gestureRef.current = null;
    } else {
      beginGesture();
    }
  };

  // Mouse wheel / trackpad zoom (needs a non-passive listener to stop the
  // page from scrolling).
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((z) => clamp(z * Math.exp(-e.deltaY * 0.0015), 1, MAX_ZOOM));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [isOpen, imageSrc]);

  // --- File selection -----------------------------------------------------
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Pilih file gambar berformat JPG, PNG, atau WEBP.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageSrc(e.target.result as string);
        resetTransform();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) handleFileSelect(e.target.files[0]);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]);
  };

  // --- Export ---------------------------------------------------------------
  // Renders exactly what the frame shows (same geometry as imageStyle) onto a
  // canvas at output resolution, then uploads it.
  const handleApplyCrop = async () => {
    const img = imgElRef.current;
    if (!img || !natural || !frame.w) return;
    if (isTainted) {
      alert(
        'Foto dari tautan luar ini tidak bisa dipotong karena dibatasi oleh situs asalnya. Silakan unggah file foto dari perangkat Anda.'
      );
      return;
    }
    setIsProcessing(true);

    try {
      const outW = aspect >= 1 ? OUTPUT_LONG_SIDE : Math.round(OUTPUT_LONG_SIDE * aspect);
      const outH = aspect >= 1 ? Math.round(OUTPUT_LONG_SIDE / aspect) : OUTPUT_LONG_SIDE;
      const k = outW / frame.w;

      const canvas = document.createElement('canvas');
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      ctx.imageSmoothingQuality = 'high';
      ctx.filter = FILTERS[filterMode];
      ctx.translate(outW / 2 + effectivePan.x * k, outH / 2 + effectivePan.y * k);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, 1);
      const drawW = natural.w * scale * k;
      const drawH = natural.h * scale * k;
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Export failed'))), 'image/jpeg', 0.9)
      );
      const url = await uploadMedia(blob, 'photo.jpg');
      onCropComplete(url, { width: outW, height: outH });
      onClose();
    } catch (err) {
      console.error('Error cropping image:', err);
      alert('Gagal memproses / mengunggah foto. Periksa koneksi lalu coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const previewWidth = aspect >= 1 ? 200 : 150;
  const previewRatio = frame.w ? previewWidth / frame.w : 0;

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
                Rasio {targetAspectRatio} — sama persis dengan bingkai foto di undangan
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

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex flex-col gap-4">
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
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#7a7065] uppercase">
                  Area Pemotongan ({targetAspectRatio})
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#cc3a63] hover:underline cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  <span>Ganti File Foto</span>
                </button>
              </div>

              {/* Crop frame: exactly the invitation's aspect ratio */}
              <div
                ref={frameRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{
                  aspectRatio: String(aspect),
                  // Portrait frames are limited by height so they fit on screen.
                  width: aspect >= 1 ? '100%' : `min(100%, calc(46vh * ${aspect}))`,
                  touchAction: 'none',
                }}
                className="mx-auto rounded-2xl border-2 border-[#4a4238] bg-[#211b12] relative overflow-hidden shadow-inner cursor-grab active:cursor-grabbing select-none"
              >
                {natural && (
                  <img src={imageSrc} alt="Crop preview" draggable={false} style={imageStyle(1)} className="pointer-events-none" />
                )}
                {!natural && !loadError && (
                  <div className="absolute inset-0 flex items-center justify-center text-white/70 text-[12px]">
                    Memuat foto…
                  </div>
                )}
                {loadError && (
                  <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-white/80 text-[12px]">
                    Foto tidak dapat dimuat. Silakan pilih file lain.
                  </div>
                )}

                {/* Rule-of-thirds guides */}
                <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className={`border-white/25 ${i % 3 !== 2 ? 'border-r' : ''} ${i < 6 ? 'border-b' : ''}`}
                    />
                  ))}
                </div>

                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs pointer-events-none">
                  👆 Geser · 🤏 cubit / scroll untuk zoom
                </div>
              </div>

              {isTainted && (
                <p className="text-[11px] text-[#966b2d] bg-[#fff7eb] border border-[#ecd9be] rounded-xl p-2.5">
                  Foto ini berasal dari tautan luar sehingga tidak bisa dipotong. Ketuk
                  &nbsp;<strong>Ganti File Foto</strong> untuk mengunggah dari perangkat.
                </p>
              )}

              {/* Live preview styled like the invitation's photo frame */}
              {natural && previewRatio > 0 && (
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF7EE] border border-[#e6dac5]">
                  <div
                    className="relative overflow-hidden rounded-[16px] border-[2px] border-[#181818] shadow-[2.5px_2.5px_0px_#181818] bg-white shrink-0"
                    style={{ width: previewWidth, aspectRatio: String(aspect) }}
                  >
                    <img src={imageSrc} alt="" draggable={false} style={imageStyle(previewRatio)} />
                  </div>
                  <div className="text-[11px] text-[#7a7065] leading-snug">
                    <span className="flex items-center gap-1 font-bold text-[#2b2620] text-[12px]">
                      <Eye className="w-3.5 h-3.5 text-[#cc3a63]" />
                      {previewLabel}
                    </span>
                    Beginilah foto akan terlihat di undangan tamu.
                  </div>
                </div>
              )}

              {/* Zoom & Rotation Controls */}
              <div className="bg-[#f9f0e0] p-3 rounded-2xl border border-[#e6dac5] flex flex-col gap-2.5">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-[#524348] min-w-[48px] flex items-center gap-1">
                    <ZoomIn className="w-3.5 h-3.5" />
                    Zoom
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomClamped(zoom - 0.15)}
                    className="w-7 h-7 rounded-lg bg-white border border-[#4a4238] flex items-center justify-center text-[12px] font-bold active:scale-95 cursor-pointer shadow-xs"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min="1"
                    max={MAX_ZOOM}
                    step="0.01"
                    value={zoom}
                    onChange={(e) => setZoomClamped(parseFloat(e.target.value))}
                    className="flex-1 accent-[#cc3a63] cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => setZoomClamped(zoom + 0.15)}
                    className="w-7 h-7 rounded-lg bg-white border border-[#4a4238] flex items-center justify-center text-[12px] font-bold active:scale-95 cursor-pointer shadow-xs"
                  >
                    +
                  </button>
                  <span className="text-[11px] font-mono font-bold text-[#7a7065] w-10 text-right">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>

                <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#e6dac5]">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setRotation((r) => (r + 270) % 360)}
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
                      resetTransform();
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
                      onClick={() => setFilterMode(f.id as FilterMode)}
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
            disabled={!natural || isProcessing || isTainted}
            onClick={handleApplyCrop}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#cc3a63] hover:bg-[#b52d53] disabled:opacity-50 text-white text-[13px] font-bold shadow-[2px_2px_0px_#4a4238] border border-[#4a4238] active:translate-y-0.5 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4" />
            <span>{isProcessing ? 'Memproses & Mengunggah...' : 'Crop & Terapkan Foto'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
