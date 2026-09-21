import React, { useState, useMemo } from 'react';
import {
  Send,
  Plus,
  Trash2,
  Copy,
  Check,
  Search,
  ExternalLink,
  MessageSquare,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  FileSpreadsheet,
  HelpCircle,
  Eye,
  Sliders,
  Share2,
} from 'lucide-react';
import { WhatsAppGuest, CoupleData, EventDetail } from '../../types';
import {
  DEFAULT_WA_TEMPLATES,
  formatWhatsAppPhone,
  generateGuestUrl,
  composeWhatsAppMessage,
  buildWhatsAppLink,
  WhatsAppTemplateItem,
} from '../../data/whatsappData';

interface WhatsappBlasterProps {
  guests: WhatsAppGuest[];
  onUpdateGuests: (guests: WhatsAppGuest[]) => void;
  couple: CoupleData;
  events: EventDetail[];
  onShowToast: (message: string, type?: 'success' | 'copy') => void;
}

export const WhatsappBlaster: React.FC<WhatsappBlasterProps> = ({
  guests,
  onUpdateGuests,
  couple,
  events,
  onShowToast,
}) => {
  // Active template state
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('formal');
  const [customTemplateText, setCustomTemplateText] = useState<string>(
    () => DEFAULT_WA_TEMPLATES[0].text
  );

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'sent'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Add Single Guest Form
  const [singleName, setSingleName] = useState('');
  const [singlePhone, setSinglePhone] = useState('');
  const [singleCategory, setSingleCategory] = useState<WhatsAppGuest['category']>('Sahabat');
  const [singleSession, setSingleSession] = useState<WhatsAppGuest['session']>('Resepsi');
  const [singleNotes, setSingleNotes] = useState('');

  // Bulk Import Form
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');

  // Active preview guest (for chat preview)
  const [previewGuestIndex, setPreviewGuestIndex] = useState(0);

  // Copied indicator
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Couple details for placeholders
  const coupleName = `${couple.groom.nickname} & ${couple.bride.nickname}`;
  const weddingDate = couple.weddingDate;
  const weddingLocation = events[1]?.locationName || events[0]?.locationName || 'Jakarta';

  // Metrics
  const totalGuests = guests.length;
  const sentCount = guests.filter((g) => g.status === 'sent').length;
  const pendingCount = totalGuests - sentCount;
  const progressPercent = totalGuests > 0 ? Math.round((sentCount / totalGuests) * 100) : 0;

  // Next pending guest for queue blasting
  const nextPendingGuest = useMemo(() => {
    return guests.find((g) => g.status === 'pending');
  }, [guests]);

  // Handle template selection
  const handleSelectTemplate = (template: WhatsAppTemplateItem) => {
    setSelectedTemplateId(template.id);
    setCustomTemplateText(template.text);
    onShowToast(`Template "${template.name}" dipilih! ✨`);
  };

  // Add single guest
  const handleAddSingleGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleName.trim()) {
      onShowToast('Nama tamu tidak boleh kosong');
      return;
    }

    const newGuest: WhatsAppGuest = {
      id: `g-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: singleName.trim(),
      phone: singlePhone.trim(),
      category: singleCategory,
      session: singleSession,
      status: 'pending',
      notes: singleNotes.trim(),
    };

    onUpdateGuests([newGuest, ...guests]);
    setSingleName('');
    setSinglePhone('');
    setSingleNotes('');
    onShowToast(`Tamu "${newGuest.name}" berhasil ditambahkan! 🎉`);
  };

  // Bulk import guests
  const handleBulkImport = () => {
    if (!bulkText.trim()) return;

    const lines = bulkText.split('\n');
    const newItems: WhatsAppGuest[] = [];

    lines.forEach((line) => {
      const cleanLine = line.trim();
      if (!cleanLine) return;

      // Support comma, tab, or dash separation: Name, Phone, Category
      const parts = cleanLine.includes(',')
        ? cleanLine.split(',')
        : cleanLine.includes('\t')
        ? cleanLine.split('\t')
        : cleanLine.split('-');

      const name = parts[0]?.trim();
      const phone = parts[1]?.trim() || '';
      const cat = (parts[2]?.trim() as WhatsAppGuest['category']) || 'Sahabat';

      if (name) {
        newItems.push({
          id: `g-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name,
          phone,
          category: ['Keluarga', 'Sahabat', 'VIP', 'Rekan Kerja', 'Tetangga', 'Umum'].includes(cat)
            ? cat
            : 'Sahabat',
          session: 'Resepsi',
          status: 'pending',
        });
      }
    });

    if (newItems.length > 0) {
      onUpdateGuests([...newItems, ...guests]);
      setBulkText('');
      setIsBulkOpen(false);
      onShowToast(`Berhasil menambahkan ${newItems.length} tamu sekaligus! 🚀`);
    } else {
      onShowToast('Format teks tidak valid. Silakan gunakan format: Nama, Nomor HP');
    }
  };

  // Load sample bulk text
  const handleLoadSampleBulk = () => {
    setBulkText(
      `Bpk. Dr. H. Faisal Anwar, 081234567890, VIP\nIbu Hj. Siti Nurjanah, 085712345678, Keluarga\nBudi Santoso & Keluarga, 081987654321, Sahabat\nDimas Prasetyo, S.Kom., 081398765432, Rekan Kerja\nAnisa Rahmawati, 087812345678, Sahabat`
    );
  };

  // Blast single guest via WhatsApp
  const handleBlastGuest = (guest: WhatsAppGuest) => {
    const personalizedLink = generateGuestUrl(guest.name);
    const message = composeWhatsAppMessage(customTemplateText, {
      nama: guest.name,
      link: personalizedLink,
      pasangan: coupleName,
      tanggal: weddingDate,
      lokasi: weddingLocation,
      sesi: guest.session,
    });

    const waUrl = buildWhatsAppLink(guest.phone, message);

    // Open WhatsApp Web / App
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    // Mark as sent
    const updated = guests.map((g) =>
      g.id === guest.id
        ? {
            ...g,
            status: 'sent' as const,
            sentAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          }
        : g
    );
    onUpdateGuests(updated);
    onShowToast(`Undangan untuk ${guest.name} dibuka di WhatsApp! 📲`);
  };

  // Toggle sent status
  const handleToggleStatus = (guestId: string) => {
    const updated = guests.map((g) => {
      if (g.id === guestId) {
        const nextStatus = g.status === 'sent' ? 'pending' : 'sent';
        return {
          ...g,
          status: nextStatus as 'pending' | 'sent',
          sentAt: nextStatus === 'sent' ? 'Manual' : undefined,
        };
      }
      return g;
    });
    onUpdateGuests(updated);
  };

  // Delete guest
  const handleDeleteGuest = (guestId: string, guestName: string) => {
    if (confirm(`Hapus tamu "${guestName}" dari daftar blast?`)) {
      onUpdateGuests(guests.filter((g) => g.id !== guestId));
      onShowToast(`Tamu "${guestName}" dihapus.`);
    }
  };

  // Copy message
  const handleCopyMessage = (guest: WhatsAppGuest) => {
    const link = generateGuestUrl(guest.name);
    const msg = composeWhatsAppMessage(customTemplateText, {
      nama: guest.name,
      link,
      pasangan: coupleName,
      tanggal: weddingDate,
      lokasi: weddingLocation,
      sesi: guest.session,
    });

    if (navigator.clipboard) {
      navigator.clipboard.writeText(msg).catch(() => {});
    }
    setCopiedId(`msg-${guest.id}`);
    onShowToast(`Pesan WhatsApp untuk ${guest.name} disalin! 📋`, 'copy');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Copy guest personal URL
  const handleCopyLink = (guest: WhatsAppGuest) => {
    const link = generateGuestUrl(guest.name);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).catch(() => {});
    }
    setCopiedId(`link-${guest.id}`);
    onShowToast(`Link undangan untuk ${guest.name} disalin! 🔗`, 'copy');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Mark all as sent or pending
  const handleMarkAllSent = () => {
    if (confirm('Tandai SEMUA tamu sebagai "Sudah Terkirim"?')) {
      const updated = guests.map((g) => ({
        ...g,
        status: 'sent' as const,
        sentAt: 'Semua',
      }));
      onUpdateGuests(updated);
      onShowToast('Semua tamu ditandai sudah dikirim! ✅');
    }
  };

  const handleResetStatus = () => {
    if (confirm('Reset status pengiriman semua tamu ke "Belum Terkirim"?')) {
      const updated = guests.map((g) => ({
        ...g,
        status: 'pending' as const,
        sentAt: undefined,
      }));
      onUpdateGuests(updated);
      onShowToast('Status semua tamu di-reset.');
    }
  };

  // Filtered list
  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      const matchesSearch =
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.phone.includes(searchQuery) ||
        (g.notes && g.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === 'all' ? true : g.status === statusFilter;

      const matchesCat =
        categoryFilter === 'all' ? true : g.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCat;
    });
  }, [guests, searchQuery, statusFilter, categoryFilter]);

  // Current preview guest for chat bubble
  const activeGuestForPreview =
    guests.length > 0
      ? guests[Math.min(previewGuestIndex, guests.length - 1)]
      : {
          id: 'sample',
          name: 'Bpk. Budi Santoso & Partner',
          phone: '081234567890',
          category: 'Sahabat' as const,
          session: 'Resepsi' as const,
          status: 'pending' as const,
        };

  const previewMessageText = composeWhatsAppMessage(customTemplateText, {
    nama: activeGuestForPreview.name,
    link: generateGuestUrl(activeGuestForPreview.name),
    pasangan: coupleName,
    tanggal: weddingDate,
    lokasi: weddingLocation,
    sesi: activeGuestForPreview.session,
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-[960px] mx-auto pb-12">
      {/* 1. Header & Summary Stats */}
      <div className="rounded-2xl bg-white p-5 sm:p-6 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fcecf0] text-[#cc3a63] text-[11px] font-bold border border-[#cc3a63]/20 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              WhatsApp Invitation Blaster
            </span>
            <h2 className="text-[24px] sm:text-[28px] font-bold text-[#2b2620] font-heading mt-1">
              Sebar Undangan Otomatis ke WhatsApp
            </h2>
            <p className="text-[13px] text-[#7a7065] mt-1 max-w-[620px]">
              Kirim undangan pernikahan personal dengan 1-klik via WhatsApp. Nama tamu otomatis
              tertera di salam pembuka dan link undangan khusus (<code className="bg-[#f9f0e0] px-1 py-0.5 rounded text-[#2b2620]">?to=Nama</code>).
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsBulkOpen(!isBulkOpen)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#f9f0e0] hover:bg-[#edd9bf] text-[#2b2620] text-[12px] font-bold border border-[#4a4238] shadow-[2px_2px_0px_#4a4238] active:translate-y-0.5 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#cc3a63]" />
              <span>{isBulkOpen ? 'Tutup Import' : 'Import Banyak Tamu'}</span>
            </button>
          </div>
        </div>

        {/* Metric Cards & Progress Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-[#e6dac5]">
          <div className="rounded-xl bg-[#f9f0e0] p-3 border border-[#e6dac5]">
            <span className="text-[11px] font-bold text-[#7a7065] block uppercase">Total Tamu</span>
            <span className="text-[22px] font-bold text-[#2b2620] font-heading mt-0.5 block">
              {totalGuests}
            </span>
          </div>
          <div className="rounded-xl bg-[#f0f3e3] p-3 border border-[#d6dcbc]">
            <span className="text-[11px] font-bold text-[#51582f] block uppercase">Sudah Dikirim</span>
            <span className="text-[22px] font-bold text-[#51582f] font-heading mt-0.5 block">
              {sentCount}
            </span>
          </div>
          <div className="rounded-xl bg-[#fff7eb] p-3 border border-[#ecd9be]">
            <span className="text-[11px] font-bold text-[#966b2d] block uppercase">Belum Dikirim</span>
            <span className="text-[22px] font-bold text-[#966b2d] font-heading mt-0.5 block">
              {pendingCount}
            </span>
          </div>
          <div className="rounded-xl bg-[#fcecf0] p-3 border border-[#f5ccd7]">
            <span className="text-[11px] font-bold text-[#cc3a63] block uppercase">Progress Blast</span>
            <span className="text-[22px] font-bold text-[#cc3a63] font-heading mt-0.5 block">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Progress bar visual */}
        <div className="w-full bg-[#f9f0e0] rounded-full h-2.5 mt-3 overflow-hidden border border-[#e6dac5]">
          <div
            className="bg-[#cc3a63] h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 2. AUTO-BLAST QUEUE: Next Guest in Line */}
      {nextPendingGuest ? (
        <div className="rounded-2xl bg-[#f0f3e3] p-5 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#a2ab73] text-[#2b2620] flex items-center justify-center font-bold text-[16px] shadow-sm border border-[#4a4238] shrink-0 mt-0.5">
              🚀
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#51582f] uppercase tracking-wider block">
                Antrean Blast Berikutnya
              </span>
              <h3 className="text-[18px] font-bold text-[#2b2620] font-heading">
                {nextPendingGuest.name}
              </h3>
              <p className="text-[12px] text-[#524348]">
                Nomor: <span className="font-mono font-bold">{nextPendingGuest.phone || '(Belum ada nomor)'}</span> • Kategori: <span className="font-semibold">{nextPendingGuest.category}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleBlastGuest(nextPendingGuest)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#cc3a63] hover:bg-[#b52d53] text-white text-[13px] font-bold shadow-[2px_2px_0px_#4a4238] border border-[#4a4238] active:translate-y-0.5 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Kirim via WhatsApp Sekarang</span>
            </button>
            <button
              type="button"
              onClick={() => handleToggleStatus(nextPendingGuest.id)}
              className="px-3 py-2.5 rounded-xl bg-white hover:bg-[#f9f0e0] text-[#2b2620] text-[12px] font-bold border border-[#4a4238] shadow-[1px_2px_0px_#4a4238] cursor-pointer"
              title="Tandai terkirim tanpa membuka WhatsApp"
            >
              Tandai Terkirim
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#f0f3e3] p-4 border-2 border-[#4a4238] shadow-[2px_3px_0px_#4a4238] flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-[#51582f] shrink-0" />
          <div>
            <h4 className="text-[14px] font-bold text-[#2b2620]">Semua Undangan Telah Terkirim! 🎉</h4>
            <p className="text-[12px] text-[#524348]">
              Hebat! Tidak ada lagi tamu dalam antrean pending. Anda dapat menambahkan tamu baru di bawah ini.
            </p>
          </div>
        </div>
      )}

      {/* 3. Bulk Import Drawer / Collapsible Form */}
      {isBulkOpen && (
        <div className="rounded-2xl bg-white p-5 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238]">
          <div className="flex items-center justify-between pb-3 border-b border-[#e6dac5]">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-[#cc3a63]" />
              <h3 className="text-[16px] font-bold text-[#2b2620] font-heading">
                Import Banyak Tamu Sekaligus (Batch / CSV)
              </h3>
            </div>
            <button
              type="button"
              onClick={handleLoadSampleBulk}
              className="text-[11px] font-bold text-[#cc3a63] hover:underline cursor-pointer"
            >
              + Muat Contoh Format
            </button>
          </div>

          <p className="text-[12px] text-[#7a7065] mt-2">
            Salin dan tempel daftar nama tamu dari Excel, spreadsheet, atau catatan. Format tiap baris:{' '}
            <code className="bg-[#f9f0e0] px-1 rounded text-[#2b2620] font-mono">
              Nama Tamu, Nomor WhatsApp, Kategori
            </code>
          </p>

          <textarea
            rows={5}
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder="Contoh:&#10;Budi Santoso & Istri, 081234567890, VIP&#10;Dimas Setiawan, 085712345678, Sahabat&#10;Keluarga Bpk. Hendra, 081987654321, Keluarga"
            className="w-full mt-2.5 p-3 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[13px] font-mono focus:outline-none focus:ring-2 focus:ring-[#cc3a63]"
          />

          <div className="flex items-center justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={() => setIsBulkOpen(false)}
              className="px-3 py-1.5 rounded-lg border border-[#4a4238] text-[12px] font-bold text-[#2b2620] hover:bg-[#f9f0e0]"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleBulkImport}
              className="px-4 py-1.5 rounded-lg bg-[#cc3a63] text-white text-[12px] font-bold shadow-sm hover:bg-[#b52d53] cursor-pointer"
            >
              Import ke Antrean Blast
            </button>
          </div>
        </div>
      )}

      {/* 4. Two Columns: Template & Live WhatsApp Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Template Customizer (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-white p-5 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#cc3a63]" />
              <h3 className="text-[17px] font-bold text-[#2b2620] font-heading">
                Template Pesan WhatsApp
              </h3>
            </div>
            <span className="text-[11px] font-bold text-[#7a7065]">Dapat Diedit</span>
          </div>

          {/* Template Preset Chips */}
          <div className="flex flex-wrap gap-2">
            {DEFAULT_WA_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => handleSelectTemplate(tmpl)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                  selectedTemplateId === tmpl.id
                    ? 'bg-[#cc3a63] text-white border-[#cc3a63] shadow-sm'
                    : 'bg-[#f9f0e0] text-[#2b2620] border-[#4a4238] hover:bg-[#edd9bf]'
                }`}
              >
                {tmpl.name}
              </button>
            ))}
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              rows={11}
              value={customTemplateText}
              onChange={(e) => setCustomTemplateText(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[13px] font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#cc3a63]"
            />
          </div>

          {/* Dynamic Placeholders Helper */}
          <div className="rounded-xl bg-[#f9f0e0] p-3 border border-[#e6dac5] text-[11px]">
            <span className="font-bold text-[#2b2620] block mb-1">Tag Variabel Otomatis:</span>
            <div className="flex flex-wrap gap-1.5">
              {['{nama}', '{link}', '{pasangan}', '{tanggal}', '{lokasi}', '{sesi}'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setCustomTemplateText((prev) => `${prev} ${tag}`)}
                  className="px-2 py-0.5 rounded bg-white text-[#cc3a63] font-mono font-bold border border-[#e6dac5] hover:border-[#cc3a63]"
                  title={`Klik untuk masukkan ${tag}`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-[#7a7065] mt-1.5">
              Tag di atas akan otomatis digantikan sesuai nama dan nomor tamu saat mengirim.
            </p>
          </div>
        </div>

        {/* Right: Live WhatsApp Chat Bubble Preview (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-white p-5 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#e6dac5]">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#a2ab73]" />
              <h3 className="text-[15px] font-bold text-[#2b2620] font-heading">
                Pratinjau Chat WhatsApp
              </h3>
            </div>
            {guests.length > 0 && (
              <select
                value={previewGuestIndex}
                onChange={(e) => setPreviewGuestIndex(Number(e.target.value))}
                className="text-[11px] font-bold text-[#2b2620] bg-[#f9f0e0] border border-[#4a4238] rounded-md px-2 py-0.5 focus:outline-none cursor-pointer max-w-[140px] truncate"
              >
                {guests.map((g, idx) => (
                  <option key={g.id} value={idx}>
                    {g.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Authentic WhatsApp Bubble Card */}
          <div className="w-full rounded-xl bg-[#eae6df] p-3.5 border border-[#d1cbbf] shadow-inner relative flex flex-col justify-end min-h-[340px] overflow-hidden">
            {/* WhatsApp Header bar */}
            <div className="bg-[#075e54] text-white px-3 py-2 rounded-lg flex items-center gap-2 mb-3 shadow-sm">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-[12px]">
                💍
              </div>
              <div className="flex-1 overflow-hidden">
                <span className="text-[12px] font-bold block truncate">
                  {coupleName}
                </span>
                <span className="text-[10px] text-white/80 block">online</span>
              </div>
            </div>

            {/* Chat Bubble */}
            <div className="relative self-end max-w-[90%] bg-[#dcf8c6] text-[#111] p-3 rounded-lg shadow-sm border border-[#c4e3ad] text-[12px] leading-relaxed font-sans whitespace-pre-wrap select-text">
              {previewMessageText}
              <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-[#707c74]">
                <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="text-[#34b7f1] font-bold">✓✓</span>
              </div>
            </div>

            <div className="mt-3 text-center">
              <span className="text-[10px] text-[#7a7065] italic">
                Pratinjau tampilan di layar WhatsApp penerima
              </span>
            </div>
          </div>

          {/* Quick Copy active preview */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleCopyMessage(activeGuestForPreview)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#f9f0e0] hover:bg-[#edd9bf] text-[#2b2620] text-[11px] font-bold border border-[#4a4238] cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-[#cc3a63]" />
              <span>Salin Teks Pesan</span>
            </button>
            <button
              type="button"
              onClick={() => handleCopyLink(activeGuestForPreview)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#f9f0e0] hover:bg-[#edd9bf] text-[#2b2620] text-[11px] font-bold border border-[#4a4238] cursor-pointer"
              title="Salin tautan saja"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#a2ab73]" />
              <span>Salin Link</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Quick Add Single Guest Form */}
      <div className="rounded-2xl bg-white p-5 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238]">
        <div className="flex items-center gap-2 mb-3">
          <Plus className="w-5 h-5 text-[#cc3a63]" />
          <h3 className="text-[16px] font-bold text-[#2b2620] font-heading">
            Tambah Tamu Satuan
          </h3>
        </div>

        <form onSubmit={handleAddSingleGuest} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-4">
            <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
              Nama Tamu *
            </label>
            <input
              type="text"
              required
              value={singleName}
              onChange={(e) => setSingleName(e.target.value)}
              placeholder="Contoh: Bpk. Rahmat & Rekan"
              className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[13px] font-bold text-[#2b2620] focus:outline-none focus:ring-2 focus:ring-[#cc3a63]"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
              Nomor WhatsApp
            </label>
            <input
              type="text"
              value={singlePhone}
              onChange={(e) => setSinglePhone(e.target.value)}
              placeholder="0812xxxx atau 62812xxxx"
              className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[13px] font-mono text-[#2b2620] focus:outline-none focus:ring-2 focus:ring-[#cc3a63]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
              Kategori
            </label>
            <select
              value={singleCategory}
              onChange={(e) => setSingleCategory(e.target.value as WhatsAppGuest['category'])}
              className="w-full mt-1 px-2.5 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[12px] font-bold text-[#2b2620] focus:outline-none"
            >
              <option value="Sahabat">Sahabat</option>
              <option value="Keluarga">Keluarga</option>
              <option value="VIP">VIP</option>
              <option value="Rekan Kerja">Rekan Kerja</option>
              <option value="Tetangga">Tetangga</option>
              <option value="Umum">Umum</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
              Sesi
            </label>
            <select
              value={singleSession}
              onChange={(e) => setSingleSession(e.target.value as WhatsAppGuest['session'])}
              className="w-full mt-1 px-2.5 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[12px] font-bold text-[#2b2620] focus:outline-none"
            >
              <option value="Resepsi">Resepsi</option>
              <option value="Akad & Resepsi">Akad &amp; Resepsi</option>
              <option value="Akad Saja">Akad Saja</option>
            </select>
          </div>

          <div className="sm:col-span-1 flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#cc3a63] hover:bg-[#b52d53] text-white font-bold text-[13px] shadow-[2px_2px_0px_#4a4238] border border-[#4a4238] flex items-center justify-center cursor-pointer active:translate-y-0.5"
              title="Tambah Tamu"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* 6. Guest List Table with Filters & Action Buttons */}
      <div className="rounded-2xl bg-white p-5 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#cc3a63]" />
            <h3 className="text-[18px] font-bold text-[#2b2620] font-heading">
              Daftar Tamu Undangan ({filteredGuests.length})
            </h3>
          </div>

          {/* Bulk table actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleMarkAllSent}
              className="px-3 py-1.5 rounded-lg bg-[#f0f3e3] hover:bg-[#e2e7cb] text-[#51582f] text-[11px] font-bold border border-[#a2ab73] cursor-pointer"
            >
              Tandai Semua Terkirim
            </button>
            <button
              type="button"
              onClick={handleResetStatus}
              className="px-3 py-1.5 rounded-lg bg-[#f9f0e0] hover:bg-[#edd9bf] text-[#7a7065] text-[11px] font-bold border border-[#e6dac5] cursor-pointer"
            >
              Reset Status
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-[#7a7065] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, nomor HP, atau catatan..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[12px] text-[#2b2620] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-4 flex items-center gap-1">
            {(['all', 'pending', 'sent'] as const).map((st) => (
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
                {st === 'all' ? 'Semua' : st === 'pending' ? 'Belum' : 'Terkirim'}
              </button>
            ))}
          </div>

          <div className="sm:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-1.5 px-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[11px] font-bold text-[#2b2620] focus:outline-none"
            >
              <option value="all">Semua Kategori</option>
              <option value="VIP">VIP</option>
              <option value="Sahabat">Sahabat</option>
              <option value="Keluarga">Keluarga</option>
              <option value="Rekan Kerja">Rekan Kerja</option>
              <option value="Tetangga">Tetangga</option>
              <option value="Umum">Umum</option>
            </select>
          </div>
        </div>

        {/* Table / List */}
        <div className="overflow-x-auto mt-2 -mx-5 px-5">
          <table className="w-full text-left text-[12px] border-collapse min-w-[620px]">
            <thead>
              <tr className="border-b-2 border-[#4a4238] text-[#7a7065] font-bold uppercase text-[10px]">
                <th className="py-2.5 px-2">Nama Tamu</th>
                <th className="py-2.5 px-2">Nomor WA</th>
                <th className="py-2.5 px-2">Kategori</th>
                <th className="py-2.5 px-2 text-center">Status</th>
                <th className="py-2.5 px-2 text-right">Aksi Blast</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0e6d6]">
              {filteredGuests.length > 0 ? (
                filteredGuests.map((g) => {
                  const isSent = g.status === 'sent';
                  const isCopiedMsg = copiedId === `msg-${g.id}`;
                  const isCopiedLnk = copiedId === `link-${g.id}`;

                  return (
                    <tr
                      key={g.id}
                      className="hover:bg-[#fbf7f0] transition-colors group"
                    >
                      <td className="py-2.5 px-2 font-bold text-[#2b2620]">
                        <div className="flex flex-col">
                          <span className="text-[13px]">{g.name}</span>
                          {g.notes && (
                            <span className="text-[10px] text-[#7a7065] italic font-normal">
                              {g.notes}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-2.5 px-2 font-mono text-[#524348]">
                        {g.phone || <span className="text-[#a89b91] italic">-</span>}
                      </td>

                      <td className="py-2.5 px-2">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f9f0e0] text-[#2b2620] border border-[#e6dac5]">
                          {g.category}
                        </span>
                      </td>

                      <td className="py-2.5 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(g.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                            isSent
                              ? 'bg-[#f0f3e3] text-[#51582f] border border-[#a2ab73]'
                              : 'bg-[#fff7eb] text-[#966b2d] border border-[#ecd9be]'
                          }`}
                          title="Klik untuk ubah status"
                        >
                          {isSent ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-[#51582f]" />
                              <span>Terkirim</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 text-[#966b2d]" />
                              <span>Belum</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-2.5 px-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1-Click WhatsApp Blast */}
                          <button
                            type="button"
                            onClick={() => handleBlastGuest(g)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#25d366] hover:bg-[#20ba5a] text-white text-[11px] font-bold shadow-sm transition-all cursor-pointer"
                            title="Kirim Pesan WhatsApp"
                          >
                            <Send className="w-3 h-3" />
                            <span>Kirim WA</span>
                          </button>

                          {/* Copy Message */}
                          <button
                            type="button"
                            onClick={() => handleCopyMessage(g)}
                            className="p-1.5 rounded-lg bg-[#f9f0e0] hover:bg-[#edd9bf] text-[#2b2620] border border-[#e6dac5] cursor-pointer"
                            title="Salin teks pesan"
                          >
                            {isCopiedMsg ? (
                              <Check className="w-3.5 h-3.5 text-[#51582f]" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-[#cc3a63]" />
                            )}
                          </button>

                          {/* Copy URL */}
                          <button
                            type="button"
                            onClick={() => handleCopyLink(g)}
                            className="p-1.5 rounded-lg bg-[#f9f0e0] hover:bg-[#edd9bf] text-[#2b2620] border border-[#e6dac5] cursor-pointer"
                            title="Salin tautan unik (?to=...)"
                          >
                            {isCopiedLnk ? (
                              <Check className="w-3.5 h-3.5 text-[#51582f]" />
                            ) : (
                              <ExternalLink className="w-3.5 h-3.5 text-[#a2ab73]" />
                            )}
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteGuest(g.id, g.name)}
                            className="p-1.5 rounded-lg text-[#cc3a63] hover:bg-[#fcecf0] transition-colors cursor-pointer"
                            title="Hapus tamu"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#7a7065]">
                    Tidak ada data tamu yang cocok dengan pencarian / filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
