import React, { useState } from 'react';
import { Send, MessageSquareHeart, Heart, Sparkles, UserPlus, Minus, Plus } from 'lucide-react';
import { Wish } from '../types';

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
  const [name, setName] = useState(guestName || '');
  const [status, setStatus] = useState<'Hadir' | 'Masih Ragu' | 'Tidak Hadir'>('Hadir');
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);

    const newWish: Wish = {
      id: `w-${Date.now()}`,
      name: name.trim(),
      status,
      message: message.trim(),
      createdAt: 'Baru saja',
      guestCount,
    };

    setTimeout(() => {
      onAddWish(newWish);
      setMessage('');
      setIsSubmitting(false);
      onShowToast('Konfirmasi & ucapan berhasil dikirim! Terima kasih ✨');
    }, 300);
  };

  return (
    <section id="rsvpSection" className="px-4 py-4 flex flex-col items-center">
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-[3px_4px_0px_#4a4238] border-2 border-[#4a4238] flex flex-col gap-4">
        <div className="text-center">
          <span className="text-[12px] font-bold text-[#cc3a63] tracking-widest uppercase block">
            RSVP &amp; Doa
          </span>
          <h2 className="text-[26px] font-bold text-[#2b2620] font-heading mt-0.5">
            Konfirmasi Kehadiran
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" id="rsvpForm">
          {/* Guest Name */}
          <div>
            <label className="text-[13px] font-bold text-[#2b2620] block mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#fff7eb] border border-[#e6dac5] text-[#2b2620] text-[14px] font-medium outline-none focus:border-[#cc3a63] focus:bg-white transition-all shadow-inner"
            />
          </div>

          {/* Attendance Status */}
          <div>
            <label className="text-[13px] font-bold text-[#2b2620] block mb-1">
              Status Kehadiran
            </label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'Hadir' | 'Masih Ragu' | 'Tidak Hadir')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#fff7eb] border border-[#e6dac5] text-[#2b2620] text-[14px] font-bold outline-none focus:border-[#cc3a63] focus:bg-white transition-all shadow-inner appearance-none cursor-pointer"
              >
                <option value="Hadir">✨ Pasti Hadir</option>
                <option value="Masih Ragu">🤔 Masih Ragu / Diusahakan</option>
                <option value="Tidak Hadir">💌 Maaf, Belum Bisa Hadir</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#7a7065]">
                <Sparkles className="w-4 h-4 text-[#cc3a63]" />
              </div>
            </div>
          </div>

          {/* Guest Count Stepper */}
          {status !== 'Tidak Hadir' && (
            <div>
              <label className="text-[13px] font-bold text-[#2b2620] block mb-1">
                Jumlah Tamu
              </label>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setGuestCount((prev) => Math.max(1, prev - 1))}
                  className="w-10 h-10 rounded-full bg-[#f9f0e0] hover:bg-[#edd9bf] text-[#2b2620] font-bold flex items-center justify-center border border-[#4a4238] shadow-[1px_2px_0px_#4a4238] active:translate-y-0.5 cursor-pointer"
                  aria-label="Kurangi jumlah tamu"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex-1 text-center font-heading text-[18px] font-bold text-[#2b2620] py-1.5 bg-[#fff7eb] rounded-xl border border-[#e6dac5]">
                  {guestCount} Orang
                </div>
                <button
                  type="button"
                  onClick={() => setGuestCount((prev) => Math.min(5, prev + 1))}
                  className="w-10 h-10 rounded-full bg-[#f9f0e0] hover:bg-[#edd9bf] text-[#2b2620] font-bold flex items-center justify-center border border-[#4a4238] shadow-[1px_2px_0px_#4a4238] active:translate-y-0.5 cursor-pointer"
                  aria-label="Tambah jumlah tamu"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Wishes & Prayers Textarea */}
          <div>
            <label className="text-[13px] font-bold text-[#2b2620] block mb-1">
              Ucapan &amp; Doa Restu
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan ucapan dan doa hangat untuk kedua mempelai..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#fff7eb] border border-[#e6dac5] text-[#2b2620] text-[14px] font-medium outline-none focus:border-[#cc3a63] focus:bg-white transition-all shadow-inner resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 w-full py-3 rounded-full bg-[#cc3a63] text-white text-[15px] font-bold shadow-[3px_4px_0px_#4a4238] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#4a4238] hover:bg-[#b83358] transition-all flex items-center justify-center gap-2 border border-[#4a4238] cursor-pointer disabled:opacity-60"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Mengirim...' : 'Kirim Konfirmasi'}</span>
          </button>
        </form>

        {/* Live Wishes Stream */}
        <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-[#e6dac5]">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-[#524348] flex items-center gap-1.5">
              <MessageSquareHeart className="w-4 h-4 text-[#cc3a63]" />
              <span>Ucapan Doa Terkini ({wishes.length})</span>
            </span>
            <span className="text-[11px] font-semibold text-[#51582f] flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Live
            </span>
          </div>

          <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1">
            {wishes.map((wish) => (
              <div
                key={wish.id}
                className="rounded-xl bg-[#fff7eb] p-3 shadow-sm border border-[#e6dac5] text-left transition-all animate-in fade-in"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-[#cc3a63]">
                      {wish.name}
                    </span>
                    {wish.guestCount && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-[#f9f0e0] rounded text-[#524348] border border-[#e6dac5]">
                        +{wish.guestCount}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      wish.status === 'Hadir'
                        ? 'bg-[#a2ab73] text-[#2b2620]'
                        : wish.status === 'Masih Ragu'
                        ? 'bg-[#f9f0e0] text-[#2b2620] border border-[#a2ab73]/50'
                        : 'bg-[#cc3a63]/15 text-[#cc3a63]'
                    }`}
                  >
                    {wish.status}
                  </span>
                </div>
                <p className="text-[13px] text-[#2b2620] mt-1.5 leading-snug italic font-medium">
                  "{wish.message}"
                </p>
                <span className="text-[10px] text-[#847279] mt-1.5 block">
                  {wish.createdAt}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
