import React, { useState } from 'react';
import { Send, User, Clock } from 'lucide-react';
import { Wish } from '../types';
import { SectionHeading } from './DoodleIcons';

interface RsvpSectionProps {
  wishes: Wish[];
  guestName: string;
  onAddWish: (newWish: Wish) => void;
  onShowToast: (message: string) => void;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({
  wishes,
  guestName,
  onAddWish,
  onShowToast,
}) => {
  const [rsvpName, setRsvpName] = useState(guestName || '');
  const [status, setStatus] = useState<'Hadir' | 'Masih Ragu' | 'Tidak Hadir'>('Hadir');
  const [guestCount, setGuestCount] = useState(1);
  const [wishText, setWishText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim() || !wishText.trim()) return;

    setIsSubmitting(true);

    const newWish: Wish = {
      id: `w-${Date.now()}`,
      name: rsvpName.trim(),
      status,
      message: wishText.trim(),
      createdAt: 'Baru saja',
      guestCount,
    };

    setTimeout(() => {
      onAddWish(newWish);
      setWishText('');
      setIsSubmitting(false);
      onShowToast('Terima kasih atas konfirmasi dan ucapan doanya! ✨');
    }, 300);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* ============================================================ */}
      {/* 1. RSVP SECTION                                              */}
      {/* ============================================================ */}
      <section
        id="rsvp"
        aria-label="Konfirmasi Kehadiran"
        className="w-full px-4 py-8 flex flex-col items-center justify-center select-none"
      >
        <div className="w-full max-w-[400px] flex flex-col items-center">
          <SectionHeading
            subheadline="Konfirmasi kehadiran"
            headline="RSVP"
            subheadlineColor="#B4533C"
            headlineColor="#181818"
            underlineColor="#B4533C"
            className="mb-2"
          />

          <p className="text-[13px] text-stone-700 text-center max-w-[340px] leading-relaxed mb-6 font-normal">
            Konfirmasi kehadiran Anda dengan mengisi form berikut
          </p>

          <div className="w-full doodle-card p-6 sm:p-7 relative">
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3.5 text-left">
              {/* Nama */}
              <div>
                <label className="text-[12px] font-bold text-[#181818] block mb-1">
                  Nama
                </label>
                <input
                  type="text"
                  required
                  maxLength={80}
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full px-3.5 py-2.5 rounded-xl border-[2px] border-[#181818] bg-white text-[13px] font-medium text-[#181818] focus:outline-none focus:bg-[#FAF7EE] shadow-[2px_2px_0px_#181818]"
                />
              </div>

              {/* Status Kehadiran */}
              <div>
                <label className="text-[12px] font-bold text-[#181818] block mb-1">
                  Konfirmasi Kehadiran
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Hadir', 'Masih Ragu', 'Tidak Hadir'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatus(st)}
                      className={`py-2 px-1 rounded-xl text-[11.5px] font-bold cursor-pointer transition-all border-[2px] border-[#181818] ${
                        status === st
                          ? 'bg-[#B4533C] text-white shadow-[3px_3px_0px_#181818]'
                          : 'bg-[#FAF7EE] text-[#181818] hover:bg-[#efe8d8] shadow-[1.5px_1.5px_0px_#181818]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Jumlah Tamu */}
              {status === 'Hadir' && (
                <div>
                  <label className="text-[12px] font-bold text-[#181818] block mb-1">
                    Jumlah Tamu
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border-[2px] border-[#181818] bg-white text-[13px] font-medium text-[#181818] focus:outline-none shadow-[2px_2px_0px_#181818]"
                  >
                    <option value={1}>1 Orang</option>
                    <option value={2}>2 Orang</option>
                    <option value={3}>3 Orang</option>
                    <option value={4}>4 Orang</option>
                  </select>
                </div>
              )}

              {/* Ucapan & Doa */}
              <div>
                <label className="text-[12px] font-bold text-[#181818] block mb-1">
                  Ucapan &amp; Doa
                </label>
                <textarea
                  required
                  rows={2}
                  maxLength={500}
                  value={wishText}
                  onChange={(e) => setWishText(e.target.value)}
                  placeholder="Tuliskan ucapan dan doa restu..."
                  className="w-full px-3.5 py-2 rounded-xl border-[2px] border-[#181818] bg-white text-[13px] font-medium text-[#181818] focus:outline-none focus:bg-[#FAF7EE] shadow-[2px_2px_0px_#181818] resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-full bg-[#B4533C] text-white font-bold text-[13.5px] border-[2px] border-[#181818] shadow-[3.5px_3.5px_0px_#181818] hover:bg-[#a04630] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Mengirim...' : 'Kirim RSVP & Ucapan'}</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. UCAPAN DAN DOA SECTION                                    */}
      {/* ============================================================ */}
      <section
        id="wishes"
        aria-label="Daftar Ucapan dan Doa"
        className="w-full px-4 py-8 flex flex-col items-center justify-center select-none"
      >
        <div className="w-full max-w-[400px] flex flex-col items-center">
          <SectionHeading
            subheadline="Doa terbaik"
            headline="UCAPAN DAN DOA"
            subheadlineColor="#3E5B3D"
            headlineColor="#181818"
            underlineColor="#3E5B3D"
            className="mb-2"
          />

          <p className="text-[13px] text-stone-700 text-center max-w-[340px] leading-relaxed mb-6 font-normal">
            Sampaikan ucapan &amp; doa terbaik anda
          </p>

          <div className="w-full doodle-card p-5 sm:p-6 relative">
            <div className="w-full flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1 text-left">
              {wishes.map((w) => (
                <div
                  key={w.id}
                  className="p-3.5 rounded-2xl bg-[#FAF7EE] border-[1.5px] border-[#181818] shadow-[2.5px_2.5px_0px_#181818] flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#B4533C]" />
                      <strong className="text-[13px] text-[#181818] font-bold">
                        {w.name}
                      </strong>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border-[1.5px] border-[#181818] ${
                        w.status === 'Hadir'
                          ? 'bg-[#DCE9DB] text-[#2C4233]'
                          : w.status === 'Tidak Hadir'
                          ? 'bg-[#F7DCD7] text-[#8C2C1C]'
                          : 'bg-[#EBD9A0] text-[#5C4511]'
                      }`}
                    >
                      {w.status}
                    </span>
                  </div>

                  <p className="text-[12.5px] text-[#24211e] leading-relaxed font-normal mt-0.5">
                    {w.message}
                  </p>

                  <div className="flex items-center gap-1 text-[10px] text-stone-500 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{w.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
