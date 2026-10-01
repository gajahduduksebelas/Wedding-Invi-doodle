import React, { useState, useRef } from 'react';
import { useDraftReporter } from '../../lib/useDraftReporter';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Sparkles,
  Upload,
  Crop,
  MoveLeft,
  MoveRight,
  SlidersHorizontal,
} from 'lucide-react';
import { GalleryPhoto } from '../../types';
import { GALLERY_PHOTOS } from '../../data/weddingData';
import { ImageCropperModal, PHOTO_ASPECTS } from './ImageCropperModal';

interface GalleryEditorProps {
  photos: GalleryPhoto[];
  onSave: (newPhotos: GalleryPhoto[]) => void;
  onShowToast: (message: string) => void;
  onDraftChange?: (draft: GalleryPhoto[] | null) => void;
}

export const GalleryEditor: React.FC<GalleryEditorProps> = ({
  photos,
  onSave,
  onShowToast,
  onDraftChange,
}) => {
  const [photoList, setPhotoList] = useState<GalleryPhoto[]>(photos);
  useDraftReporter(photoList, photos, onDraftChange);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Cropper Modal State
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [cropperInitialImage, setCropperInitialImage] = useState<string>('');
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Open cropper for a new file from device
  const handleTriggerUpload = () => {
    setEditingPhotoId(null);
    setCropperInitialImage('');
    setIsCropperOpen(true);
  };

  // Open cropper to edit / re-crop an existing photo
  const handleEditCropExisting = (photo: GalleryPhoto) => {
    setEditingPhotoId(photo.id);
    setCropperInitialImage(photo.src);
    setIsCropperOpen(true);
  };

  // Handle direct file pick from quick upload input
  const handleQuickFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditingPhotoId(null);
          setCropperInitialImage(event.target.result as string);
          setIsCropperOpen(true);
        }
      };
      reader.readAsDataURL(file);
      // Reset input value so same file can be selected again
      e.target.value = '';
    }
  };

  // Callback from ImageCropperModal
  const handleCropComplete = (croppedDataUrl: string) => {
    if (editingPhotoId) {
      // Update existing photo
      setPhotoList((prev) =>
        prev.map((p) => (p.id === editingPhotoId ? { ...p, src: croppedDataUrl } : p))
      );
      onShowToast('Foto berhasil diperbarui dan dipotong! ✨');
    } else {
      // Add as new photo
      const newPhoto: GalleryPhoto = {
        id: `photo-${Date.now()}`,
        src: croppedDataUrl,
        title: newPhotoTitle.trim() || `Momen Bahagia #${photoList.length + 1}`,
        alt: newPhotoTitle.trim() || 'Foto prewedding',
        rotation: Math.random() > 0.5 ? 'rotate-1' : '-rotate-1',
      };
      setPhotoList((prev) => [newPhoto, ...prev]);
      setNewPhotoTitle('');
      onShowToast('Foto baru berhasil diupload & ditambahkan! 📸');
    }
    setEditingPhotoId(null);
  };

  const handleAddViaUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;

    const newPhoto: GalleryPhoto = {
      id: `photo-${Date.now()}`,
      src: newPhotoUrl.trim(),
      title: newPhotoTitle.trim() || `Momen Bahagia #${photoList.length + 1}`,
      alt: newPhotoTitle.trim() || 'Foto prewedding',
      rotation: Math.random() > 0.5 ? 'rotate-1' : '-rotate-1',
    };

    setPhotoList([newPhoto, ...photoList]);
    setNewPhotoUrl('');
    setNewPhotoTitle('');
    setShowUrlInput(false);
    onShowToast('Foto dari URL berhasil ditambahkan!');
  };

  const handleRemovePhoto = (id: string) => {
    if (confirm('Hapus foto ini dari galeri pernikahan?')) {
      setPhotoList(photoList.filter((p) => p.id !== id));
      onShowToast('Foto dihapus.');
    }
  };

  const handleMovePhoto = (index: number, direction: 'left' | 'right') => {
    const newIdx = direction === 'left' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= photoList.length) return;

    const updated = [...photoList];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIdx, 0, moved);
    setPhotoList(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(photoList);
    onShowToast('Galeri foto berhasil disimpan! 📸');
  };

  const handleReset = () => {
    if (confirm('Kembalikan galeri ke koleksi foto bawaan?')) {
      setPhotoList(GALLERY_PHOTOS);
      onSave(GALLERY_PHOTOS);
      onShowToast('Galeri di-reset ke foto bawaan.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-[960px] mx-auto pb-24">
      {/* 1. Header Card with Title & Quick Action Buttons */}
      <div className="rounded-2xl bg-white p-4 sm:p-6 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#fcecf0] text-[#cc3a63] text-[11px] font-bold border border-[#cc3a63]/20 uppercase tracking-wider">
            <ImageIcon className="w-3.5 h-3.5" />
            Galeri Album Prewedding
          </span>
          <h2 className="text-[20px] sm:text-[26px] font-bold text-[#2b2620] font-heading mt-1">
            Kelola Foto Galeri ({photoList.length})
          </h2>
          <p className="text-[12px] sm:text-[13px] text-[#7a7065] mt-0.5">
            Upload langsung dari HP atau kamera, potong (crop) rasio pas, dan atur tata letak album.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#f9f0e0] hover:bg-[#edd9bf] text-[#2b2620] text-[12px] font-bold border border-[#4a4238] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#7a7065]" />
            <span>Reset</span>
          </button>
          <button
            type="submit"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#cc3a63] hover:bg-[#b52d53] text-white text-[13px] font-bold shadow-[2px_2px_0px_#4a4238] border border-[#4a4238] active:translate-y-0.5 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan ({photoList.length})</span>
          </button>
        </div>
      </div>

      {/* 2. Direct Upload & Crop Action Banner (Mobile-Optimized) */}
      <div className="rounded-2xl bg-[#fffdfa] p-4 sm:p-5 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-[15px] sm:text-[16px] font-bold text-[#2b2620] font-heading flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-[#cc3a63]" />
              Tambah Foto dari Galeri / Kamera
            </h3>
            <p className="text-[12px] text-[#7a7065]">
              Pilih foto dari galeri HP, lalu sesuaikan zoom &amp; potongan rasio 3:4 — sama dengan kotak foto di galeri undangan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTriggerUpload}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#51582f] hover:bg-[#434926] text-white text-[13px] font-bold shadow-[2px_2px_0px_#4a4238] border border-[#4a4238] active:scale-95 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload &amp; Crop Foto</span>
            </button>

            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="px-3.5 py-3 rounded-xl bg-[#f9f0e0] hover:bg-[#edd9bf] text-[#2b2620] text-[12px] font-bold border border-[#4a4238] cursor-pointer"
              title="Gunakan link URL foto jika ada"
            >
              {showUrlInput ? 'Tutup URL' : 'Link URL'}
            </button>
          </div>
        </div>

        {/* Hidden direct file input for instant file selection */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleQuickFileChange}
          className="hidden"
        />

        {/* Optional Manual URL Input Collapsible */}
        {showUrlInput && (
          <div className="pt-3 border-t border-[#e6dac5] grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            <div className="sm:col-span-8">
              <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
                URL Gambar Foto Online (JPG/PNG)
              </label>
              <input
                type="url"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-white text-[13px] font-mono focus:outline-none"
              />
            </div>
            <div className="sm:col-span-4 flex items-end">
              <button
                type="button"
                onClick={handleAddViaUrl}
                className="w-full py-2.5 rounded-xl bg-[#cc3a63] hover:bg-[#b52d53] text-white text-[12px] font-bold flex items-center justify-center gap-1 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambahkan URL</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Photo List Grid (Responsive Cards) */}
      <div className="rounded-2xl bg-white p-4 sm:p-5 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#e6dac5]">
          <div>
            <h3 className="text-[16px] font-bold text-[#2b2620] font-heading">
              Daftar Foto Album Aktif
            </h3>
            <span className="text-[11px] text-[#7a7065]">
              Ketuk &apos;Crop&apos; pada foto untuk mengubah potongan atau perbesar zoom
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#f0f3e3] text-[#51582f] text-[11px] font-bold border border-[#a2ab73]">
            {photoList.length} Foto
          </span>
        </div>

        {photoList.length === 0 ? (
          <div className="py-12 text-center text-[#7a7065] flex flex-col items-center justify-center gap-3">
            <ImageIcon className="w-12 h-12 text-[#a2ab73] opacity-60" />
            <p className="text-[14px] font-bold text-[#2b2620]">Belum ada foto di galeri</p>
            <p className="text-[12px] max-w-[280px]">
              Ketuk tombol &apos;Upload &amp; Crop Foto&apos; di atas untuk menambahkan kenangan manis prewedding Anda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {photoList.map((photo, index) => (
              <div
                key={photo.id}
                className="rounded-2xl bg-[#fffdfa] p-2 sm:p-2.5 border-2 border-[#4a4238] shadow-[2px_3px_0px_#4a4238] relative flex flex-col gap-2 group transition-all"
              >
                {/* Image Aspect Box: same 3:4 tile as the invitation gallery */}
                <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-[#f9f0e0] border border-[#e6dac5] relative">
                  <img
                    src={photo.src}
                    alt={photo.alt || photo.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Order Tag */}
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold backdrop-blur-xs">
                    #{index + 1}
                  </div>

                  {/* Top Right Quick Delete */}
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(photo.id)}
                    className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
                    title="Hapus foto ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Caption / Title input */}
                <div>
                  <input
                    type="text"
                    value={photo.title || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPhotoList((prev) =>
                        prev.map((p) => (p.id === photo.id ? { ...p, title: val } : p))
                      );
                    }}
                    placeholder={`Foto #${index + 1}`}
                    className="w-full px-2 py-1 rounded-lg border border-[#e6dac5] bg-white text-[11px] font-bold text-[#2b2620] focus:outline-none focus:border-[#cc3a63]"
                  />
                </div>

                {/* Card Action Buttons (Crop & Reorder) */}
                <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#f0e6d6]">
                  {/* Edit / Crop Button */}
                  <button
                    type="button"
                    onClick={() => handleEditCropExisting(photo)}
                    className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-[#f9f0e0] hover:bg-[#edd9bf] text-[#2b2620] text-[11px] font-bold border border-[#4a4238] active:scale-95 transition-all cursor-pointer"
                    title="Potong atau perbesar foto ini"
                  >
                    <Crop className="w-3 h-3 text-[#cc3a63]" />
                    <span>Crop</span>
                  </button>

                  {/* Left / Right Sort */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMovePhoto(index, 'left')}
                      className="w-6 h-6 rounded-md bg-white disabled:opacity-30 border border-[#d8c8b4] flex items-center justify-center text-[#7a7065] hover:text-[#2b2620] cursor-pointer"
                      title="Geser ke kiri"
                    >
                      <MoveLeft className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={index === photoList.length - 1}
                      onClick={() => handleMovePhoto(index, 'right')}
                      className="w-6 h-6 rounded-md bg-white disabled:opacity-30 border border-[#d8c8b4] flex items-center justify-center text-[#7a7065] hover:text-[#2b2620] cursor-pointer"
                      title="Geser ke kanan"
                    >
                      <MoveRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Sticky Floating Mobile Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-[#fffdfa]/95 backdrop-blur-md border-t-2 border-[#4a4238] flex items-center justify-between gap-2 max-w-[960px] mx-auto sm:hidden">
        <button
          type="button"
          onClick={handleTriggerUpload}
          className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl bg-[#51582f] text-white text-[12px] font-bold border border-[#4a4238] active:scale-95 transition-all"
        >
          <Upload className="w-4 h-4" />
          <span>+ Upload</span>
        </button>
        <button
          type="submit"
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#cc3a63] text-white text-[13px] font-bold shadow-[2px_2px_0px_#4a4238] border border-[#4a4238] active:scale-95 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Galeri ({photoList.length})</span>
        </button>
      </div>

      {/* 5. Image Cropper Modal */}
      <ImageCropperModal
        isOpen={isCropperOpen}
        onClose={() => setIsCropperOpen(false)}
        initialImage={cropperInitialImage}
        onCropComplete={handleCropComplete}
        targetAspectRatio={PHOTO_ASPECTS.gallery}
        previewLabel="Kotak foto di Galeri"
        title={editingPhotoId ? 'Potong / Edit Foto Galeri' : 'Upload & Crop Foto Baru'}
      />
    </form>
  );
};
