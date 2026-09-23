import React, { useState } from 'react';
import { Send, User, Clock, Sparkles, Heart } from 'lucide-react';
import { Wish } from '../types';
import { DOODLE_ASSETS } from '../data/weddingData';

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
      {/* 1. CARD RSVP (FULL-PAGE MOBILE FRIENDLY)                     */}
      {/* ============================================================ */}
      <section
        id="rsvp"
        className="min-h-dvh w-full px-4 py-8 flex flex-col items-center justify-center relative overflow-hidden"
      >
        {/* Floating Random Doodle Assets */}
        <img
          src={DOODLE_ASSETS.giftMail}
          alt=""
          aria-hidden="true"
          className="absolute top-5 left-3 w-14 sm:w-16 h-14 sm:h-16 object-contain pointer-events-none opacity-85 animate-doodle-float z-10"
        />
        <img
          src={DOODLE_ASSETS.envelopes}
          alt=""
          aria-hidden="true"
          className="absolute top-5 right-3 w-14 sm:w-16 h-14 sm:h-16 object-contain pointer-events-none opacity-85 animate-doodle-slow z-10"
        />
        <img
          src={DOODLE_ASSETS.rings}
          alt=""
          aria-hidden="true"
          className="absolute bottom-5 left-3 w-12 sm:w-14 h-12 sm:h-14 object-contain pointer-events-none opacity-85 animate-doodle-sway z-10"
        />
        <img
          src={DOODLE_ASSETS.heartArrow}
          alt=""
          aria-hidden="true"
          className="absolute bottom-5 right-3 w-12 sm:w-14 h-12 sm:h-14 object-contain pointer-events-none opacity-85 animate-doodle-bob z-10"
        />

        <div className="absolute top-1/2 left-4 text-[#cc3a63]/30 pointer-events-none animate-doodle-pulse">
          <Heart className="w-4 h-4 fill-current" />
        </div>
        <div className="absolute top-1/2 right-4 text-[#8b965f]/40 pointer-events-none animate-doodle-pulse">
          <Sparkles className="w-5 h-5" />
        </div>

        <div className="w-full max-w-[400px] rounded-3xl bg-white/95 p-6 sm:p-7 shadow-[0_12px_40px_rgba(74,66,56,0.08)] flex flex-col items-center text-center relative z-20 my-auto overflow-hidden">
          {/* Top Washi Tape */}
          <div
            className="absolute -top-3 w-28 h-6 cd-tape-pink -rotate-1 rounded-xs shadow-xs pointer-events-none"
            aria-hidden="true"
          />

          <header className="cd-heading cd-heading-coral mb-1 mt-1">
            <span>Konfirmasi kehadiran</span>
            <h2>RSVP</h2>
            <i aria-hidden="true" />
          </header>

          <p className="text-[12.5px] text-[#524348] mb-4 font-sans">
            Konfirmasi kehadiran Anda dengan mengisi form berikut
          </p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 text-left">
            {/* Nama */}
            <div>
              <label className="text-[11.5px] font-bold text-[#2b2620] block mb-1">
                Nama
              </label>
              <input
                type="text"
                required
                maxLength={80}
                value={rsvpName}
                onChange={(e) => setRsvpName(e.target.value)}
                placeholder="Masukkan nama lengkap Anda"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#4a4238]/30 bg-[#fffdf9] text-[13px] font-medium text-[#2b2620] focus:outline-none focus:border-[#cc3a63]"
              />
            </div>

            {/* Konfirmasi Kehadiran */}
            <div>
              <label className="text-[11.5px] font-bold text-[#2b2620] block mb-1">
                Konfirmasi Kehadiran
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Hadir', 'Masih Ragu', 'Tidak Hadir'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st)}
                    className={`py-2 px-1 rounded-xl text-[11.5px] font-bold cursor-pointer transition-all ${
                      status === st
                        ? 'bg-[#cc3a63] text-white shadow-xs'
                        : 'bg-[#f9f0e0] text-[#2b2620] hover:bg-[#edd9bf]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Jumlah Tamu jika hadir */}
            {status === 'Hadir' && (
              <div>
                <label className="text-[11.5px] font-bold text-[#2b2620] block mb-1">
                  Jumlah Tamu
                </label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#4a4238]/30 bg-[#fffdf9] text-[13px] font-medium text-[#2b2620] focus:outline-none focus:border-[#cc3a63]"
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
              <label className="text-[11.5px] font-bold text-[#2b2620] block mb-1">
                Ucapan &amp; Doa
              </label>
              <textarea
                required
                rows={2}
                maxLength={500}
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                placeholder="Tuliskan ucapan dan doa restu..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#4a4238]/30 bg-[#fffdf9] text-[13px] font-medium text-[#2b2620] focus:outline-none focus:border-[#cc3a63] resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-full bg-[#cc3a63] text-white font-bold text-[13.5px] shadow-[0_4px_14px_rgba(204,58,99,0.3)] hover:bg-[#b52f53] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Mengirim...' : 'Kirim RSVP & Ucapan'}</span>
            </button>
          </form>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. CARD WISHES / UCAPAN DAN DOA (FULL-PAGE MOBILE FRIENDLY)  */}
      {/* ============================================================ */}
      <section
        id="wishes"
        className="min-h-dvh w-full px-4 py-8 flex flex-col items-center justify-center relative overflow-hidden"
      >
        {/* Floating Random Doodle Assets */}
        <img
          src={DOODLE_ASSETS.loveBirds}
          alt=""
          aria-hidden="true"
          className="absolute top-5 left-3 w-14 sm:w-16 h-14 sm:h-16 object-contain pointer-events-none opacity-85 animate-doodle-float z-10"
        />
        <img
          src={DOODLE_ASSETS.heartBalloons}
          alt=""
          aria-hidden="true"
          className="absolute top-5 right-3 w-16 sm:w-20 h-16 sm:h-20 object-contain pointer-events-none opacity-85 animate-doodle-slow z-10"
        />
        <img
          src={DOODLE_ASSETS.toast}
          alt=""
          aria-hidden="true"
          className="absolute bottom-5 left-3 w-12 sm:w-14 h-12 sm:h-14 object-contain pointer-events-none opacity-85 animate-doodle-bob z-10"
        />
        <img
          src={DOODLE_ASSETS.bells}
          alt=""
          aria-hidden="true"
          className="absolute bottom-5 right-3 w-12 sm:w-14 h-12 sm:h-14 object-contain pointer-events-none opacity-85 animate-doodle-sway z-10"
        />

        <div className="w-full max-w-[400px] rounded-3xl bg-white/95 p-6 sm:p-7 shadow-[0_12px_40px_rgba(74,66,56,0.08)] flex flex-col items-center text-center relative z-20 my-auto overflow-hidden">
          {/* Top Washi Tape */}
          <div
            className="absolute -top-3 w-28 h-6 cd-tape-sage rotate-1 rounded-xs shadow-xs pointer-events-none"
            aria-hidden="true"
          />

          <header className="cd-heading cd-heading-sage mb-2 mt-1">
            <span>Doa terbaik</span>
            <h2>Ucapan dan Doa</h2>
            <i aria-hidden="true" />
          </header>

          <p className="text-[12.5px] text-[#524348] mb-4 font-sans">
            Doa tulus dari para sahabat dan kerabat tercinta ({wishes.length} ucapan)
          </p>

          {/* Wishes List */}
          <div className="w-full flex flex-col gap-3 max-h-[360px] overflow-y-auto pr-1 text-left">
            {wishes.map((w) => (
              <div
                key={w.id}
                className="p-3.5 rounded-2xl bg-[#fffdf9] border border-[#4a4238]/15 shadow-2xs flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#cc3a63]" />
                    <strong className="text-[13px] text-[#2b2620] font-heading font-bold">
                      {w.name}
                    </strong>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      w.status === 'Hadir'
                        ? 'bg-[#f0f3e3] text-[#51582f] border-[#a2ab73]'
                        : w.status === 'Tidak Hadir'
                        ? 'bg-[#fde8e8] text-[#9b1c1c] border-[#f8b4b4]'
                        : 'bg-[#fef08a]/40 text-[#854d0e] border-[#fef08a]'
                    }`}
                  >
                    {w.status}
                  </span>
                </div>

                <p className="text-[12.5px] text-[#524348] leading-relaxed font-sans mt-0.5">
                  {w.message}
                </p>

                <div className="flex items-center gap-1 text-[10.5px] text-[#7a7065] mt-1">
                  <Clock className="w-3 h-3" />
                  <span>{w.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
