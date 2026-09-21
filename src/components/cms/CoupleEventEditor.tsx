import React, { useState } from 'react';
import { Heart, Calendar, Clock, MapPin, Music, Sparkles, Save, RotateCcw, Upload, Crop } from 'lucide-react';
import { CoupleData, EventDetail } from '../../types';
import { COUPLE_DATA, EVENTS_DATA } from '../../data/weddingData';
import { ImageCropperModal } from './ImageCropperModal';
import { AudioUploader } from './AudioUploader';

interface CoupleEventEditorProps {
  couple: CoupleData;
  events: EventDetail[];
  onSave: (newCouple: CoupleData, newEvents: EventDetail[]) => void;
  onShowToast: (message: string) => void;
}

export const CoupleEventEditor: React.FC<CoupleEventEditorProps> = ({
  couple,
  events,
  onSave,
  onShowToast,
}) => {
  const [formData, setFormData] = useState<CoupleData>(couple);
  const [eventsData, setEventsData] = useState<EventDetail[]>(events);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperTarget, setCropperTarget] = useState<'groom' | 'bride'>('groom');

  const handleOpenCropper = (target: 'groom' | 'bride') => {
    setCropperTarget(target);
    setCropperOpen(true);
  };

  const handlePersonCropComplete = (croppedDataUrl: string) => {
    if (cropperTarget === 'groom') {
      setFormData((prev) => ({
        ...prev,
        groom: { ...prev.groom, image: croppedDataUrl },
      }));
      onShowToast('Foto mempelai pria berhasil diupdate & dipotong! 🤵');
    } else {
      setFormData((prev) => ({
        ...prev,
        bride: { ...prev.bride, image: croppedDataUrl },
      }));
      onShowToast('Foto mempelai wanita berhasil diupdate & dipotong! 👰');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, eventsData);
    onShowToast('Data Mempelai & Acara berhasil disimpan! 💍');
  };

  const handleResetDefaults = () => {
    if (confirm('Kembalikan data mempelai & acara ke pengaturan bawaan awal?')) {
      setFormData(COUPLE_DATA);
      setEventsData(EVENTS_DATA);
      onSave(COUPLE_DATA, EVENTS_DATA);
      onShowToast('Data dikembalikan ke default.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-[960px] mx-auto pb-12">
      {/* Top Header */}
      <div className="rounded-2xl bg-white p-5 sm:p-6 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#fcecf0] text-[#cc3a63] text-[11px] font-bold border border-[#cc3a63]/20 uppercase tracking-wider">
            <Heart className="w-3 h-3 fill-current" />
            Pengaturan Mempelai
          </span>
          <h2 className="text-[24px] sm:text-[28px] font-bold text-[#2b2620] font-heading mt-1">
            Data Mempelai &amp; Rangkaian Acara
          </h2>
          <p className="text-[13px] text-[#7a7065] mt-1">
            Ubah nama pengantin, orang tua, tanggal resepsi, lokasi Google Maps, dan lagu latar undangan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
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
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      {/* Groom & Bride Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Groom Form */}
        <div className="rounded-2xl bg-white p-5 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col gap-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#e6dac5]">
            <div className="w-7 h-7 rounded-full bg-[#f0f3e3] text-[#51582f] flex items-center justify-center font-bold text-[12px] border border-[#a2ab73]">
              🤵
            </div>
            <h3 className="text-[16px] font-bold text-[#2b2620] font-heading">
              Data Mempelai Pria (Groom)
            </h3>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
              Nama Lengkap &amp; Gelar
            </label>
            <input
              type="text"
              value={formData.groom.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  groom: { ...formData.groom, name: e.target.value },
                })
              }
              className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[13px] font-bold text-[#2b2620] focus:outline-none focus:ring-2 focus:ring-[#cc3a63]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
                Nama Panggilan
              </label>
              <input
                type="text"
                value={formData.groom.nickname}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    groom: { ...formData.groom, nickname: e.target.value },
                  })
                }
                className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[13px] font-bold text-[#2b2620] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
                Instagram Username
              </label>
              <input
                type="text"
                value={formData.groom.instagram}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    groom: { ...formData.groom, instagram: e.target.value.replace('@', '') },
                  })
                }
                className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[13px] font-mono text-[#2b2620] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
              Keterangan Putra Dari / Orang Tua
            </label>
            <textarea
              rows={2}
              value={formData.groom.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  groom: { ...formData.groom, role: e.target.value },
                })
              }
              className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[12px] text-[#2b2620] focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
                Foto Mempelai Pria (Avatar)
              </label>
              <button
                type="button"
                onClick={() => handleOpenCropper('groom')}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#51582f] text-white text-[11px] font-bold border border-[#4a4238] shadow-xs hover:bg-[#434926] cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>Upload &amp; Crop</span>
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#fdfaf5] border border-[#e6dac5]">
              <img
                src={formData.groom.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'}
                alt="Groom avatar"
                className="w-14 h-14 rounded-full object-cover border-2 border-[#4a4238] shadow-sm shrink-0"
              />
              <div className="flex-1 min-w-0">
                <input
                  type="url"
                  value={formData.groom.image}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      groom: { ...formData.groom, image: e.target.value },
                    })
                  }
                  placeholder="Atau tempel URL foto..."
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#e6dac5] bg-white text-[12px] font-mono text-[#2b2620] focus:outline-none"
                />
                <span className="text-[10px] text-[#7a7065] mt-1 block">
                  Ketuk tombol Upload &amp; Crop untuk memilih langsung dari galeri HP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bride Form */}
        <div className="rounded-2xl bg-white p-5 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col gap-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#e6dac5]">
            <div className="w-7 h-7 rounded-full bg-[#fcecf0] text-[#cc3a63] flex items-center justify-center font-bold text-[12px] border border-[#cc3a63]">
              👰
            </div>
            <h3 className="text-[16px] font-bold text-[#2b2620] font-heading">
              Data Mempelai Wanita (Bride)
            </h3>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
              Nama Lengkap &amp; Gelar
            </label>
            <input
              type="text"
              value={formData.bride.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bride: { ...formData.bride, name: e.target.value },
                })
              }
              className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[13px] font-bold text-[#2b2620] focus:outline-none focus:ring-2 focus:ring-[#cc3a63]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
                Nama Panggilan
              </label>
              <input
                type="text"
                value={formData.bride.nickname}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bride: { ...formData.bride, nickname: e.target.value },
                  })
                }
                className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[13px] font-bold text-[#2b2620] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
                Instagram Username
              </label>
              <input
                type="text"
                value={formData.bride.instagram}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bride: { ...formData.bride, instagram: e.target.value.replace('@', '') },
                  })
                }
                className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[13px] font-mono text-[#2b2620] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
              Keterangan Putri Dari / Orang Tua
            </label>
            <textarea
              rows={2}
              value={formData.bride.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bride: { ...formData.bride, role: e.target.value },
                })
              }
              className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[12px] text-[#2b2620] focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
                Foto Mempelai Wanita (Avatar)
              </label>
              <button
                type="button"
                onClick={() => handleOpenCropper('bride')}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#cc3a63] text-white text-[11px] font-bold border border-[#4a4238] shadow-xs hover:bg-[#b52d53] cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>Upload &amp; Crop</span>
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#fdfaf5] border border-[#e6dac5]">
              <img
                src={formData.bride.image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300'}
                alt="Bride avatar"
                className="w-14 h-14 rounded-full object-cover border-2 border-[#4a4238] shadow-sm shrink-0"
              />
              <div className="flex-1 min-w-0">
                <input
                  type="url"
                  value={formData.bride.image}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bride: { ...formData.bride, image: e.target.value },
                    })
                  }
                  placeholder="Atau tempel URL foto..."
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#e6dac5] bg-white text-[12px] font-mono text-[#2b2620] focus:outline-none"
                />
                <span className="text-[10px] text-[#7a7065] mt-1 block">
                  Ketuk tombol Upload &amp; Crop untuk memilih langsung dari galeri HP
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wedding Date, City & Countdown */}
      <div className="rounded-2xl bg-white p-5 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#e6dac5]">
          <Calendar className="w-5 h-5 text-[#cc3a63]" />
          <h3 className="text-[16px] font-bold text-[#2b2620] font-heading">
            Waktu Pernikahan &amp; Hitung Mundur
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
              Label Tanggal Utama
            </label>
            <input
              type="text"
              value={formData.weddingDate}
              onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[13px] font-bold text-[#2b2620] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
              Kota Acara
            </label>
            <input
              type="text"
              value={formData.weddingCity}
              onChange={(e) => setFormData({ ...formData, weddingCity: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[13px] font-bold text-[#2b2620] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
              Tanggal Target Countdown
            </label>
            <input
              type="datetime-local"
              value={new Date(formData.targetTimestamp - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16)}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  targetTimestamp: new Date(e.target.value).getTime(),
                })
              }
              className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[13px] font-mono text-[#2b2620] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Direct MP3 Audio Uploader & Selector */}
      <AudioUploader
        currentUrl={formData.audioUrl}
        currentFileName={formData.audioFileName}
        currentTitle={formData.audioTitle}
        onChange={(url, fileName, title) =>
          setFormData((prev) => ({
            ...prev,
            audioUrl: url,
            audioFileName: fileName,
            audioTitle: title,
          }))
        }
        onShowToast={onShowToast}
      />

      {/* Events: Akad & Resepsi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {eventsData.map((ev, index) => (
          <div
            key={ev.id}
            className="rounded-2xl bg-white p-5 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col gap-3"
          >
            <div className="flex items-center gap-2 pb-2 border-b border-[#e6dac5]">
              <Clock className="w-5 h-5 text-[#a2ab73]" />
              <h3 className="text-[16px] font-bold text-[#2b2620] font-heading">
                Detail {ev.title}
              </h3>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
                Judul Sesi
              </label>
              <input
                type="text"
                value={ev.title}
                onChange={(e) => {
                  const copy = [...eventsData];
                  copy[index] = { ...copy[index], title: e.target.value };
                  setEventsData(copy);
                }}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[13px] font-bold text-[#2b2620] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
                  Tanggal
                </label>
                <input
                  type="text"
                  value={ev.date}
                  onChange={(e) => {
                    const copy = [...eventsData];
                    copy[index] = { ...copy[index], date: e.target.value };
                    setEventsData(copy);
                  }}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[12px] font-semibold text-[#2b2620] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
                  Waktu
                </label>
                <input
                  type="text"
                  value={ev.time}
                  onChange={(e) => {
                    const copy = [...eventsData];
                    copy[index] = { ...copy[index], time: e.target.value };
                    setEventsData(copy);
                  }}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[12px] font-semibold text-[#2b2620] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
                Nama Tempat / Gedung
              </label>
              <input
                type="text"
                value={ev.locationName}
                onChange={(e) => {
                  const copy = [...eventsData];
                  copy[index] = { ...copy[index], locationName: e.target.value };
                  setEventsData(copy);
                }}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[13px] font-bold text-[#2b2620] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
                Alamat Lengkap
              </label>
              <textarea
                rows={2}
                value={ev.address}
                onChange={(e) => {
                  const copy = [...eventsData];
                  copy[index] = { ...copy[index], address: e.target.value };
                  setEventsData(copy);
                }}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[12px] text-[#2b2620] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
                Link Google Maps
              </label>
              <input
                type="url"
                value={ev.mapsUrl}
                onChange={(e) => {
                  const copy = [...eventsData];
                  copy[index] = { ...copy[index], mapsUrl: e.target.value };
                  setEventsData(copy);
                }}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[12px] font-mono text-[#2b2620] focus:outline-none"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-2">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#cc3a63] hover:bg-[#b52d53] text-white text-[14px] font-bold shadow-[2px_3px_0px_#4a4238] border border-[#4a4238] active:translate-y-0.5 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Data Mempelai &amp; Acara</span>
        </button>
      </div>

      {/* Sticky Mobile Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-[#fffdfa]/95 backdrop-blur-md border-t-2 border-[#4a4238] flex items-center justify-between gap-2 max-w-[960px] mx-auto sm:hidden">
        <button
          type="button"
          onClick={handleResetDefaults}
          className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl bg-[#f9f0e0] text-[#2b2620] text-[12px] font-bold border border-[#4a4238]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
        <button
          type="submit"
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#cc3a63] text-white text-[13px] font-bold shadow-[2px_2px_0px_#4a4238] border border-[#4a4238] active:scale-95 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Perubahan</span>
        </button>
      </div>

      {/* Image Cropper Modal */}
      <ImageCropperModal
        isOpen={cropperOpen}
        onClose={() => setCropperOpen(false)}
        initialImage={cropperTarget === 'groom' ? formData.groom.image : formData.bride.image}
        onCropComplete={handlePersonCropComplete}
        targetAspectRatio="1:1"
        title={
          cropperTarget === 'groom'
            ? 'Upload & Crop Foto Pengantin Pria (1:1)'
            : 'Upload & Crop Foto Pengantin Wanita (1:1)'
        }
      />
    </form>
  );
};
