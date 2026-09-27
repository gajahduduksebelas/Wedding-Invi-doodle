import React, { useState } from 'react';
import { Heart, Calendar, Clock, MapPin, Music, Sparkles, Save, RotateCcw, Upload, Crop, Video, Eye, EyeOff } from 'lucide-react';
import { CoupleData, EventDetail } from '../../types';
import { COUPLE_DATA, EVENTS_DATA, DEFAULT_GROOM_IMAGE, DEFAULT_BRIDE_IMAGE } from '../../data/weddingData';
import { ImageCropperModal, PHOTO_ASPECTS } from './ImageCropperModal';
import { AudioUploader } from './AudioUploader';
import { useDraftReporter } from '../../lib/useDraftReporter';

interface CoupleEventEditorProps {
  couple: CoupleData;
  events: EventDetail[];
  onSave: (newCouple: CoupleData, newEvents: EventDetail[]) => void;
  onShowToast: (message: string) => void;
  onDraftChange?: (draft: { couple: CoupleData; events: EventDetail[] } | null) => void;
}

export const CoupleEventEditor: React.FC<CoupleEventEditorProps> = ({
  couple,
  events,
  onSave,
  onShowToast,
  onDraftChange,
}) => {
  const [formData, setFormData] = useState<CoupleData>(couple);
  const [eventsData, setEventsData] = useState<EventDetail[]>(events);
  useDraftReporter({ couple: formData, events: eventsData }, { couple, events }, onDraftChange);
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

  const isLiveEnabled = formData.liveStream?.enabled !== false;

  const handleToggleLiveStream = () => {
    const nextState = !isLiveEnabled;
    setFormData((prev) => ({
      ...prev,
      liveStream: {
        enabled: nextState,
        platformUrl: prev.liveStream?.platformUrl || 'https://youtube.com/live/argakirana',
        date: prev.liveStream?.date || prev.weddingDate || 'Minggu, 14 Februari 2027',
        time: prev.liveStream?.time || '09:00',
        timezone: prev.liveStream?.timezone || 'WIB',
      },
    }));
    onShowToast(
      nextState
        ? '🟢 Bagian Live Streaming diaktifkan!'
        : '⚪ Bagian Live Streaming dinonaktifkan (disembunyikan).'
    );
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
                Foto Mempelai Pria (4:5)
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
                src={formData.groom.image || DEFAULT_GROOM_IMAGE}
                alt="Groom avatar"
                className="w-20 aspect-[4/5] rounded-[12px] object-cover border-2 border-[#181818] shadow-sm shrink-0"
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
                Foto Mempelai Wanita (4:5)
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
                src={formData.bride.image || DEFAULT_BRIDE_IMAGE}
                alt="Bride avatar"
                className="w-20 aspect-[4/5] rounded-[12px] object-cover border-2 border-[#181818] shadow-sm shrink-0"
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

      {/* Live Streaming (Virtual Wedding) Settings & Toggle */}
      <div className="rounded-2xl bg-white p-5 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e6dac5]">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-colors ${
                isLiveEnabled
                  ? 'bg-[#F7ECEF] text-[#6E1A2D] border-[#E5C2CB]'
                  : 'bg-gray-100 text-gray-400 border-gray-300'
              }`}
            >
              <Video className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold text-[#2b2620] font-heading">
                  Siaran Langsung (Virtual Wedding)
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                    isLiveEnabled
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-gray-100 text-gray-500 border-gray-300'
                  }`}
                >
                  {isLiveEnabled ? '● Aktif' : '○ Nonaktif'}
                </span>
              </div>
              <p className="text-[12px] text-[#7a7065] mt-0.5">
                Pengaturan bagian Virtual Wedding untuk tamu yang berhalangan hadir secara fisik.
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={handleToggleLiveStream}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold border transition-all cursor-pointer shadow-xs active:translate-y-0.5 ${
              isLiveEnabled
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700'
                : 'bg-[#f0f0f0] hover:bg-[#e4e4e4] text-[#4a4238] border-[#a0988e]'
            }`}
          >
            {isLiveEnabled ? (
              <>
                <Eye className="w-4 h-4" />
                <span>Live Streaming: AKTIF</span>
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                <span>Live Streaming: NONAKTIF</span>
              </>
            )}
          </button>
        </div>

        {/* When Live Stream is enabled */}
        {isLiveEnabled ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
                Tautan / URL Live Streaming (YouTube Live, Zoom, Instagram Live, Meet, dll.)
              </label>
              <input
                type="url"
                value={formData.liveStream?.platformUrl || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    liveStream: {
                      enabled: true,
                      platformUrl: e.target.value,
                      date: prev.liveStream?.date || prev.weddingDate || 'Minggu, 14 Februari 2027',
                      time: prev.liveStream?.time || '09:00',
                      timezone: prev.liveStream?.timezone || 'WIB',
                    },
                  }))
                }
                placeholder="https://youtube.com/live/... atau https://instagram.com/..."
                className="w-full mt-1 px-3 py-2.5 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[13px] font-mono text-[#2b2620] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
                Tanggal Siaran
              </label>
              <input
                type="text"
                value={formData.liveStream?.date || formData.weddingDate || 'Minggu, 14 Februari 2027'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    liveStream: {
                      enabled: true,
                      platformUrl: prev.liveStream?.platformUrl || '',
                      date: e.target.value,
                      time: prev.liveStream?.time || '09:00',
                      timezone: prev.liveStream?.timezone || 'WIB',
                    },
                  }))
                }
                className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[12px] font-semibold text-[#2b2620] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
                  Waktu Mulai
                </label>
                <input
                  type="text"
                  value={formData.liveStream?.time || '09:00'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      liveStream: {
                        enabled: true,
                        platformUrl: prev.liveStream?.platformUrl || '',
                        date: prev.liveStream?.date || prev.weddingDate || 'Minggu, 14 Februari 2027',
                        time: e.target.value,
                        timezone: prev.liveStream?.timezone || 'WIB',
                      },
                    }))
                  }
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[12px] font-semibold text-[#2b2620] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
                  Zona Waktu
                </label>
                <select
                  value={formData.liveStream?.timezone || 'WIB'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      liveStream: {
                        enabled: true,
                        platformUrl: prev.liveStream?.platformUrl || '',
                        date: prev.liveStream?.date || prev.weddingDate || 'Minggu, 14 Februari 2027',
                        time: prev.liveStream?.time || '09:00',
                        timezone: e.target.value,
                      },
                    }))
                  }
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[12px] font-semibold text-[#2b2620] focus:outline-none"
                >
                  <option value="WIB">WIB</option>
                  <option value="WITA">WITA</option>
                  <option value="WIT">WIT</option>
                  <option value="GMT+7">GMT+7</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2 p-3 rounded-xl bg-[#f0f3e3] border border-[#a2ab73] flex items-center justify-between text-[11.5px] text-[#51582f]">
              <span>Bagian Live Streaming akan ditampilkan di website undangan tamu.</span>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 text-center flex flex-col items-center justify-center">
            <EyeOff className="w-8 h-8 text-gray-400 mb-1.5" />
            <p className="text-[13px] font-bold text-gray-700">
              Bagian Live Streaming Sedang Dimatikan
            </p>
            <p className="text-[11.5px] text-gray-500 max-w-[400px] mt-0.5">
              Bagian siaran langsung disembunyikan dan tidak akan muncul di website undangan tamu.
            </p>
          </div>
        )}
      </div>

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
        targetAspectRatio={PHOTO_ASPECTS.couple}
        previewLabel={cropperTarget === 'groom' ? 'Kartu "The Groom"' : 'Kartu "The Bride"'}
        title={
          cropperTarget === 'groom'
            ? 'Upload & Crop Foto Pengantin Pria'
            : 'Upload & Crop Foto Pengantin Wanita'
        }
      />
    </form>
  );
};
