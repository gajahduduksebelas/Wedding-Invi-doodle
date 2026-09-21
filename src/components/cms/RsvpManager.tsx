import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  CheckCircle2,
  HelpCircle,
  XCircle,
  Search,
  Trash2,
  Copy,
  Users,
  RotateCcw,
  Check,
} from 'lucide-react';
import { Wish } from '../../types';
import { INITIAL_WISHES } from '../../data/weddingData';

interface RsvpManagerProps {
  wishes: Wish[];
  onUpdateWishes: (wishes: Wish[]) => void;
  onShowToast: (message: string, type?: 'success' | 'copy') => void;
}

export const RsvpManager: React.FC<RsvpManagerProps> = ({
  wishes,
  onUpdateWishes,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Hadir' | 'Masih Ragu' | 'Tidak Hadir'>('all');
  const [copied, setCopied] = useState(false);

  // Metrics
  const totalWishes = wishes.length;
  const hadirCount = wishes.filter((w) => w.status === 'Hadir').length;
  const raguCount = wishes.filter((w) => w.status === 'Masih Ragu').length;
  const tidakHadirCount = wishes.filter((w) => w.status === 'Tidak Hadir').length;
  const totalPax = wishes.reduce((sum, w) => {
    if (w.status === 'Hadir') {
      return sum + (w.guestCount || 1);
    }
    return sum;
  }, 0);

  // Filtered
  const filteredWishes = useMemo(() => {
    return wishes.filter((w) => {
      const matchSearch =
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' ? true : w.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [wishes, searchQuery, statusFilter]);

  const handleDeleteWish = (id: string, name: string) => {
    if (confirm(`Hapus ucapan dari "${name}"?`)) {
      onUpdateWishes(wishes.filter((w) => w.id !== id));
      onShowToast(`Ucapan dari "${name}" dihapus.`);
    }
  };

  const handleCopySummary = () => {
    const lines = [
      `📊 REKAP KEHADIRAN & DOA RESTU (RSVP)`,
      `Total Responden: ${totalWishes}`,
      `Konfirmasi Hadir: ${hadirCount} orang (Total Estimasi Porsi: ${totalPax} Pax)`,
      `Masih Ragu: ${raguCount} orang`,
      `Tidak Hadir: ${tidakHadirCount} orang`,
      `-----------------------------------------`,
      `DAFTAR TAMU HADIR:`,
      ...wishes
        .filter((w) => w.status === 'Hadir')
        .map((w, idx) => `${idx + 1}. ${w.name} (${w.guestCount || 1} pax) - "${w.message}"`),
    ];

    const text = lines.join('\n');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopied(true);
    onShowToast('Rekap kehadiran disalin ke clipboard! 📋', 'copy');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetWishes = () => {
    if (confirm('Reset daftar ucapan ke data contoh bawaan?')) {
      onUpdateWishes(INITIAL_WISHES);
      onShowToast('Daftar ucapan di-reset.');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[960px] mx-auto pb-12">
      {/* Header & Metrics */}
      <div className="rounded-2xl bg-white p-5 sm:p-6 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#fcecf0] text-[#cc3a63] text-[11px] font-bold border border-[#cc3a63]/20 uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            Buku Tamu &amp; RSVP
          </span>
          <h2 className="text-[24px] sm:text-[28px] font-bold text-[#2b2620] font-heading mt-1">
            Rekap Konfirmasi Kehadiran Tamu
          </h2>
          <p className="text-[13px] text-[#7a7065] mt-1">
            Pantau jumlah tamu yang mengonfirmasi hadir, porsi katering yang dibutuhkan, dan pesan doa restu dari para tamu.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#cc3a63] hover:bg-[#b52d53] text-white text-[12px] font-bold shadow-[2px_2px_0px_#4a4238] border border-[#4a4238] active:translate-y-0.5 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>Salin Rekap Tamu</span>
          </button>
          <button
            type="button"
            onClick={handleResetWishes}
            className="p-2 rounded-xl bg-[#f9f0e0] hover:bg-[#edd9bf] text-[#2b2620] border border-[#4a4238] cursor-pointer"
            title="Reset ke ucapan awal"
          >
            <RotateCcw className="w-4 h-4 text-[#7a7065]" />
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-white p-4 border-2 border-[#4a4238] shadow-[2px_3px_0px_#4a4238]">
          <span className="text-[11px] font-bold text-[#7a7065] block uppercase">Total Respon</span>
          <span className="text-[26px] font-bold text-[#2b2620] font-heading mt-0.5 block">
            {totalWishes}
          </span>
          <span className="text-[10px] text-[#7a7065]">Ucapan masuk</span>
        </div>

        <div className="rounded-xl bg-[#f0f3e3] p-4 border-2 border-[#4a4238] shadow-[2px_3px_0px_#4a4238]">
          <span className="text-[11px] font-bold text-[#51582f] block uppercase">Pasti Hadir</span>
          <span className="text-[26px] font-bold text-[#51582f] font-heading mt-0.5 block">
            {hadirCount} <span className="text-[14px] font-normal">({totalPax} Pax)</span>
          </span>
          <span className="text-[10px] text-[#51582f]">Estimasi porsi katering</span>
        </div>

        <div className="rounded-xl bg-[#fff7eb] p-4 border-2 border-[#4a4238] shadow-[2px_3px_0px_#4a4238]">
          <span className="text-[11px] font-bold text-[#966b2d] block uppercase">Masih Ragu</span>
          <span className="text-[26px] font-bold text-[#966b2d] font-heading mt-0.5 block">
            {raguCount}
          </span>
          <span className="text-[10px] text-[#966b2d]">Perlu konfirmasi ulang</span>
        </div>

        <div className="rounded-xl bg-[#fcecf0] p-4 border-2 border-[#4a4238] shadow-[2px_3px_0px_#4a4238]">
          <span className="text-[11px] font-bold text-[#cc3a63] block uppercase">Tidak Hadir</span>
          <span className="text-[26px] font-bold text-[#cc3a63] font-heading mt-0.5 block">
            {tidakHadirCount}
          </span>
          <span className="text-[10px] text-[#cc3a63]">Kirim doa jarak jauh</span>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="rounded-2xl bg-white p-5 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-[#7a7065] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pengirim atau isi ucapan..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[12px] text-[#2b2620] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-6 flex items-center gap-1.5">
            {(['all', 'Hadir', 'Masih Ragu', 'Tidak Hadir'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#cc3a63] text-white border-[#cc3a63]'
                    : 'bg-[#f9f0e0] text-[#2b2620] border-[#4a4238]'
                }`}
              >
                {st === 'all' ? 'Semua' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Wishes List */}
        <div className="flex flex-col gap-3 mt-2">
          {filteredWishes.length > 0 ? (
            filteredWishes.map((w) => {
              const isHadir = w.status === 'Hadir';
              const isRagu = w.status === 'Masih Ragu';

              return (
                <div
                  key={w.id}
                  className="rounded-xl bg-[#fdfaf5] p-3.5 border-2 border-[#4a4238] shadow-[1px_2px_0px_#4a4238] flex items-start justify-between gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-[14px] text-[#2b2620]">{w.name}</h4>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isHadir
                            ? 'bg-[#f0f3e3] text-[#51582f] border border-[#a2ab73]'
                            : isRagu
                            ? 'bg-[#fff7eb] text-[#966b2d] border border-[#ecd9be]'
                            : 'bg-[#fcecf0] text-[#cc3a63] border border-[#f5ccd7]'
                        }`}
                      >
                        {w.status}
                        {isHadir && w.guestCount && (
                          <span className="font-mono">({w.guestCount} org)</span>
                        )}
                      </span>
                      <span className="text-[10px] text-[#7a7065]">{w.createdAt}</span>
                    </div>

                    <p className="text-[12px] text-[#524348] mt-1.5 leading-relaxed font-sans">
                      "{w.message}"
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteWish(w.id, w.name)}
                    className="p-1.5 text-[#cc3a63] hover:bg-[#fcecf0] rounded-lg cursor-pointer shrink-0"
                    title="Hapus ucapan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-[#7a7065] text-[13px]">
              Tidak ada ucapan yang cocok dengan pencarian.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
