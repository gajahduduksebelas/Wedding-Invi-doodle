import React, { useState } from 'react';
import { Image, Plus, Trash2, Save, RotateCcw, Sparkles } from 'lucide-react';
import { GalleryPhoto } from '../../types';
import { GALLERY_PHOTOS } from '../../data/weddingData';

interface GalleryEditorProps {
  photos: GalleryPhoto[];
  onSave: (newPhotos: GalleryPhoto[]) => void;
  onShowToast: (message: string) => void;
}

export const GalleryEditor: React.FC<GalleryEditorProps> = ({
  photos,
  onSave,
  onShowToast,
}) => {
  const [photoList, setPhotoList] = useState<GalleryPhoto[]>(photos);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoTitle, setNewPhotoTitle] = useState('');

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;

    const newPhoto: GalleryPhoto = {
      id: `photo-${Date.now()}`,
      src: newPhotoUrl.trim(),
      title: newPhotoTitle.trim() || 'Momen Bahagia',
      alt: newPhotoTitle.trim() || 'Foto Prewedding Ahmad & Siti',
      rotation: Math.random() > 0.5 ? 'rotate-1' : '-rotate-1',
    };

    setPhotoList([...photoList, newPhoto]);
    setNewPhotoUrl('');
    setNewPhotoTitle('');
    onShowToast('Foto baru berhasil ditambahkan!');
  };

  const handleRemovePhoto = (id: string) => {
    if (confirm('Hapus foto ini dari galeri?')) {
      setPhotoList(photoList.filter((p) => p.id !== id));
      onShowToast('Foto dihapus.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(photoList);
    onShowToast('Galeri foto berhasil disimpan! 📸');
  };

  const handleReset = () => {
    setPhotoList(GALLERY_PHOTOS);
    onSave(GALLERY_PHOTOS);
    onShowToast('Galeri di-reset ke foto bawaan.');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-[960px] mx-auto pb-12">
      <div className="rounded-2xl bg-white p-5 sm:p-6 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#fcecf0] text-[#cc3a63] text-[11px] font-bold border border-[#cc3a63]/20 uppercase tracking-wider">
            <Image className="w-3.5 h-3.5" />
            Galeri Foto Prewedding
          </span>
          <h2 className="text-[24px] sm:text-[28px] font-bold text-[#2b2620] font-heading mt-1">
            Kelola Foto Galeri ({photoList.length})
          </h2>
          <p className="text-[13px] text-[#7a7065] mt-1">
            Tambah, ganti, atau hapus koleksi foto kenangan yang ditampilkan di scrapbook album undangan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#f9f0e0] hover:bg-[#edd9bf] text-[#2b2620] text-[12px] font-bold border border-[#4a4238] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#7a7065]" />
            <span>Reset Bawaan</span>
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#cc3a63] hover:bg-[#b52d53] text-white text-[13px] font-bold shadow-[2px_2px_0px_#4a4238] border border-[#4a4238] active:translate-y-0.5 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Galeri</span>
          </button>
        </div>
      </div>

      {/* Add Photo Form */}
      <div className="rounded-2xl bg-white p-5 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238]">
        <h3 className="text-[16px] font-bold text-[#2b2620] font-heading mb-3">
          + Tambah Foto Baru ke Galeri
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8">
            <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
              URL Gambar Foto (JPG/PNG) *
            </label>
            <input
              type="url"
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-... atau link foto hosting"
              className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[13px] font-mono focus:outline-none"
            />
          </div>
          <div className="sm:col-span-3">
            <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
              Judul / Caption (Opsional)
            </label>
            <input
              type="text"
              value={newPhotoTitle}
              onChange={(e) => setNewPhotoTitle(e.target.value)}
              placeholder="Contoh: Senja Bersama"
              className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[13px] focus:outline-none"
            />
          </div>
          <div className="sm:col-span-1 flex items-end">
            <button
              type="button"
              onClick={handleAddPhoto}
              className="w-full py-2.5 rounded-xl bg-[#cc3a63] hover:bg-[#b52d53] text-white flex items-center justify-center font-bold shadow-sm cursor-pointer"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="rounded-2xl bg-white p-5 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col gap-4">
        <h3 className="text-[17px] font-bold text-[#2b2620] font-heading">
          Foto Yang Ditampilkan Saat Ini
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photoList.map((photo, index) => (
            <div
              key={photo.id}
              className="rounded-xl bg-[#fdfaf5] p-2 border-2 border-[#4a4238] shadow-[2px_3px_0px_#4a4238] relative flex flex-col gap-2 group"
            >
              <div className="w-full aspect-[4/5] rounded-lg overflow-hidden bg-[#f9f0e0] relative">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(photo.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 opacity-90 transition-opacity cursor-pointer"
                  title="Hapus foto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="px-1">
                <span className="text-[11px] font-bold text-[#2b2620] block truncate">
                  #{index + 1} {photo.title || 'Foto'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};
