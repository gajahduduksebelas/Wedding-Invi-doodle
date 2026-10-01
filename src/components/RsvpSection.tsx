import React, { useState } from 'react';
import { Send, User, Clock } from 'lucide-react';
import { Wish } from '../types';
import { SectionHeading } from './DoodleIcons';
import { formatWishTime } from '../lib/utils';
import { DoodleScatter } from './DoodleScatter';

interface RsvpSectionProps {
  wishes: Wish[];
  onAddWish: (newWish: Wish) => Promise<boolean>;
  onShowToast: (message: string) => void;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({
  wishes,
  onAddWish,
  onShowToast,
}) => {
  // Starts empty: guests type their own name.
  const [rsvpName, setRsvpName] = useState('');
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

    onAddWish(newWish).then((saved) => {
      setIsSubmitting(false);
      if (saved) {
        setWishText('');
        onShowToast('Terima kasih atas konfirmasi dan ucapan doanya! ✨');
      } else {
        // Message is kept in the form so the guest can simply retry.
        onShowToast('Maaf, ucapan gagal terkirim. Silakan coba lagi.');
      }
    });
  };

  return (
    <>
      {/* ============================================================ */}
      {/* 1. RSVP SECTION                                              */}
      {/* ============================================================ */}
      <section
        id="rsvp"
        aria-label="Konfirmasi Kehadiran"
        className="mobile-snap-section w-full px-4 py-6 flex flex-col items-center justify-center relative isolate overflow-hidden select-none"
      >
        <DoodleScatter seed="rsvp" prefer={['loveLetter', 'wineGlasses']} />

        <div className="w-full max-w-[400px] flex flex-col items-center my-auto animate-doodle-in">
          <SectionHeading
            subheadline="Konfirmasi kehadiran"
            headline="RSVP"
            subheadlineColor="#B4533C"
            headlineColor="#181818"
            underlineColor="#B4533C"
            className="mb-1.5"
          />

          <p className="text-[12.5px] text-stone-700 text-center max-w-[340px] leading-relaxed mb-4 font-normal">
            Konfirmasi kehadiran Anda dengan mengisi form berikut
          </p>

          <div className="w-full doodle-card p-5 sm:p-6 relative">
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 text-left">
              {/* Nama */}
              <div>
                <label className="text-[11.5px] font-bold text-[#181818] block mb-0.5">
                  Nama
                </label>
                <input
                  type="text"
                  required
                  maxLength={80}
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  // Keep the phone's saved contact name out of it: guests type
                  // the name they want shown with their wish.
                  name="rsvp-guest-name"
                  autoComplete="off"
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full px-3 py-2 rounded-xl border-[2px] border-[#181818] bg-white text-[12.5px] font-medium text-[#181818] focus:outline-none focus:bg-[#FAF7EE] shadow-[2px_2px_0px_#181818]"
                />
              </div>

              {/* Status Kehadiran */}
              <div>
                <label className="text-[11.5px] font-bold text-[#181818] block mb-0.5">
                  Konfirmasi Kehadiran
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Hadir', 'Masih Ragu', 'Tidak Hadir'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatus(st)}
                      className={`py-1.5 px-1 rounded-xl text-[11px] font-bold cursor-pointer transition-all border-[1.5px] border-[#181818] ${
                        status === st
                          ? 'bg-[#B4533C] text-white shadow-[2.5px_2.5px_0px_#181818]'
                          : 'bg-[#FAF7EE] text-[#181818] hover:bg-[#efe8d8] shadow-[1px_1px_0px_#181818]'
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
                  <label className="text-[11.5px] font-bold text-[#181818] block mb-0.5">
                    Jumlah Tamu
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border-[2px] border-[#181818] bg-white text-[12.5px] font-medium text-[#181818] focus:outline-none shadow-[2px_2px_0px_#181818]"
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
                <label className="text-[11.5px] font-bold text-[#181818] block mb-0.5">
                  Ucapan &amp; Doa
                </label>
                <textarea
                  required
                  rows={2}
                  maxLength={500}
                  value={wishText}
                  onChange={(e) => setWishText(e.target.value)}
                  placeholder="Tuliskan ucapan dan doa restu..."
                  className="w-full px-3 py-1.5 rounded-xl border-[2px] border-[#181818] bg-white text-[12.5px] font-medium text-[#181818] focus:outline-none focus:bg-[#FAF7EE] shadow-[2px_2px_0px_#181818] resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-full bg-[#B4533C] text-white font-bold text-[13px] border-[2px] border-[#181818] shadow-[3px_3px_0px_#181818] hover:bg-[#a04630] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                <Send className="w-3.5 h-3.5" />
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
        className="mobile-snap-section w-full px-4 py-6 flex flex-col items-center justify-center relative isolate overflow-hidden select-none"
      >
        <DoodleScatter seed="wishes" prefer={['doves', 'heartBalloons']} />

        <div className="w-full max-w-[400px] flex flex-col items-center my-auto animate-doodle-in">
          <SectionHeading
            subheadline="Doa terbaik"
            headline="UCAPAN DAN DOA"
            subheadlineColor="#3E5B3D"
            headlineColor="#181818"
            underlineColor="#3E5B3D"
            className="mb-1.5"
          />

          <p className="text-[12.5px] text-stone-700 text-center max-w-[340px] leading-relaxed mb-4 font-normal">
            Sampaikan ucapan &amp; doa terbaik anda
          </p>

          <div className="w-full doodle-card p-4 sm:p-5 relative">
            <div className="w-full flex flex-col gap-2.5 max-h-[340px] overflow-y-auto pr-1 text-left">
              {wishes.map((w) => (
                <div
                  key={w.id}
                  className="p-3 rounded-2xl bg-[#FAF7EE] border-[1.5px] border-[#181818] shadow-[2px_2px_0px_#181818] flex flex-col gap-0.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3 h-3 text-[#B4533C]" />
                      <strong className="text-[12px] text-[#181818] font-bold">
                        {w.name}
                      </strong>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold border-[1px] border-[#181818] ${
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

                  <p className="text-[11.5px] text-[#24211e] leading-relaxed font-normal mt-0.5">
                    {w.message}
                  </p>

                  <div className="flex items-center gap-1 text-[9.5px] text-stone-500 mt-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{formatWishTime(w.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
