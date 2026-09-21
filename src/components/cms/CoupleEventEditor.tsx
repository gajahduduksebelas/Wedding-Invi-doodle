import React, { useState } from 'react';
import { Heart, Calendar, Clock, MapPin, Music, Sparkles, Save, RotateCcw } from 'lucide-react';
import { CoupleData, EventDetail } from '../../types';
import { COUPLE_DATA, EVENTS_DATA } from '../../data/weddingData';

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
            <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
              Foto URL Mempelai Pria
            </label>
            <input
              type="url"
              value={formData.groom.image}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  groom: { ...formData.groom, image: e.target.value },
                })
              }
              className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[12px] font-mono text-[#2b2620] focus:outline-none"
            />
            {formData.groom.image && (
              <div className="mt-2 flex items-center gap-2">
                <img
                  src={formData.groom.image}
                  alt="Groom"
                  className="w-10 h-10 rounded-full object-cover border border-[#4a4238]"
                />
                <span className="text-[11px] text-[#7a7065]">Pratinjau foto pengantin pria</span>
              </div>
            )}
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
            <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
              Foto URL Mempelai Wanita
            </label>
            <input
              type="url"
              value={formData.bride.image}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bride: { ...formData.bride, image: e.target.value },
                })
              }
              className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[12px] font-mono text-[#2b2620] focus:outline-none"
            />
            {formData.bride.image && (
              <div className="mt-2 flex items-center gap-2">
                <img
                  src={formData.bride.image}
                  alt="Bride"
                  className="w-10 h-10 rounded-full object-cover border border-[#4a4238]"
                />
                <span className="text-[11px] text-[#7a7065]">Pratinjau foto pengantin wanita</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Wedding Date, City, Countdown & Audio */}
      <div className="rounded-2xl bg-white p-5 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#e6dac5]">
          <Calendar className="w-5 h-5 text-[#cc3a63]" />
          <h3 className="text-[16px] font-bold text-[#2b2620] font-heading">
            Waktu Pernikahan, Hitung Mundur &amp; Musik Latar
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

        <div>
          <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
            Audio Background Music URL (.mp3)
          </label>
          <input
            type="url"
            value={formData.audioUrl}
            onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[12px] font-mono text-[#2b2620] focus:outline-none"
          />
        </div>
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
    </form>
  );
};
