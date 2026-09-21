import React, { useState, useRef } from 'react';
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  Plus,
  Trash2,
  Users,
  Sparkles,
} from 'lucide-react';
import { WhatsAppGuest } from '../../types';

export const CSV_TEMPLATE_CONTENT = `Nama Tamu,Nomor WhatsApp,Kategori,Sesi,Catatan
Bpk. Dr. H. Faisal Anwar & Istri,081234567890,VIP,Akad & Resepsi,Keluarga Besar Pengantin
Ibu Hj. Siti Nurjanah,085712345678,Keluarga,Akad & Resepsi,Tante Mempelai Wanita
Budi Santoso & Keluarga,081987654321,Sahabat,Resepsi,Teman Kuliah ITB
Dimas Prasetyo, S.Kom.,081398765432,Rekan Kerja,Resepsi,Tim Engineering Kantor
Anisa Rahmawati & Partner,087812345678,Sahabat,Resepsi,Sahabat SMA
Bpk. RT 04 H. Suwardi,081299887766,Tetangga,Resepsi,Ketua RT Lingkungan
Drs. H. Bambang Irawan,082155443322,Umum,Resepsi,Kolega Orang Tua`;

export const downloadGuestCsvTemplate = () => {
  // UTF-8 BOM (\uFEFF) ensures Excel and Google Sheets correctly parse commas, semicolons, and accents
  const blob = new Blob(['\uFEFF' + CSV_TEMPLATE_CONTENT], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'template_daftar_tamu_undangan.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Robust CSV Line Parser that handles quoted commas
export const parseCsvLine = (line: string, delimiter: string = ','): string[] => {
  const result: string[] = [];
  let current = '';
  let insideQuote = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      insideQuote = !insideQuote;
    } else if (char === delimiter && !insideQuote) {
      result.push(current.trim().replace(/^["']|["']$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^["']|["']$/g, ''));
  return result;
};

// Smart Delimiter Detection (handles comma, semicolon, tab, pipe)
export const detectDelimiter = (text: string): string => {
  const firstLine = text.split(/\r?\n/)[0] || '';
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;
  const pipeCount = (firstLine.match(/\|/g) || []).length;

  if (semicolonCount > commaCount && semicolonCount >= 1) return ';';
  if (tabCount > commaCount && tabCount >= 1) return '\t';
  if (pipeCount > commaCount && pipeCount >= 1) return '|';
  return ',';
};

interface ParsedCandidate {
  id: string;
  name: string;
  phone: string;
  category: WhatsAppGuest['category'];
  session: WhatsAppGuest['session'];
  notes?: string;
  isDuplicate: boolean;
}

interface GuestCsvImporterProps {
  isOpen: boolean;
  onClose: () => void;
  existingGuests: WhatsAppGuest[];
  onImport: (newGuests: WhatsAppGuest[]) => void;
  onShowToast: (message: string) => void;
}

export const GuestCsvImporter: React.FC<GuestCsvImporterProps> = ({
  isOpen,
  onClose,
  existingGuests,
  onImport,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rawText, setRawText] = useState('');
  const [parsedCandidates, setParsedCandidates] = useState<ParsedCandidate[]>([]);
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Process raw text or uploaded CSV into candidate list
  const processCsvContent = (content: string, sourceName?: string) => {
    if (!content.trim()) {
      setParsedCandidates([]);
      return;
    }

    const lines = content
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      setParsedCandidates([]);
      return;
    }

    const delimiter = detectDelimiter(content);
    const firstRowCols = parseCsvLine(lines[0], delimiter).map((c) => c.toLowerCase());

    // Check if first row is a header
    const isHeaderRow = firstRowCols.some(
      (c) =>
        c.includes('nama') ||
        c.includes('name') ||
        c.includes('tamu') ||
        c.includes('guest') ||
        c.includes('nomor') ||
        c.includes('phone') ||
        c.includes('telepon') ||
        c.includes('kategori')
    );

    let nameIdx = 0;
    let phoneIdx = 1;
    let catIdx = 2;
    let sessionIdx = 3;
    let notesIdx = 4;

    if (isHeaderRow) {
      firstRowCols.forEach((col, idx) => {
        if (col.includes('nama') || col.includes('name') || col.includes('tamu') || col.includes('guest')) {
          nameIdx = idx;
        } else if (col.includes('phone') || col.includes('nomor') || col.includes('telepon') || col.includes('hp') || col.includes('wa')) {
          phoneIdx = idx;
        } else if (col.includes('kategori') || col.includes('category') || col.includes('grup') || col.includes('group')) {
          catIdx = idx;
        } else if (col.includes('sesi') || col.includes('session') || col.includes('acara')) {
          sessionIdx = idx;
        } else if (col.includes('catatan') || col.includes('note') || col.includes('pesan') || col.includes('keterangan')) {
          notesIdx = idx;
        }
      });
    }

    const dataLines = isHeaderRow ? lines.slice(1) : lines;
    const existingNamesSet = new Set(existingGuests.map((g) => g.name.toLowerCase().trim()));

    const candidates: ParsedCandidate[] = [];

    dataLines.forEach((line) => {
      const cols = parseCsvLine(line, delimiter);
      const name = cols[nameIdx]?.trim();
      if (!name) return;

      const rawPhone = cols[phoneIdx]?.trim() || '';
      // Clean phone number: remove non-numeric chars except leading '+'
      const cleanPhone = rawPhone.replace(/[^\d+]/g, '');

      const rawCat = cols[catIdx]?.trim() || 'Sahabat';
      const validCategories: WhatsAppGuest['category'][] = [
        'Keluarga',
        'Sahabat',
        'VIP',
        'Rekan Kerja',
        'Tetangga',
        'Umum',
      ];
      const matchedCat = validCategories.find(
        (c) => c.toLowerCase() === rawCat.toLowerCase()
      ) || 'Sahabat';

      const rawSession = cols[sessionIdx]?.trim() || 'Resepsi';
      let session: WhatsAppGuest['session'] = 'Resepsi';
      if (rawSession.toLowerCase().includes('akad') && rawSession.toLowerCase().includes('resepsi')) {
        session = 'Akad & Resepsi';
      } else if (rawSession.toLowerCase().includes('akad')) {
        session = 'Akad Saja';
      }

      const notes = cols[notesIdx]?.trim() || undefined;
      const isDuplicate = existingNamesSet.has(name.toLowerCase());

      candidates.push({
        id: `guest-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name,
        phone: cleanPhone,
        category: matchedCat,
        session,
        notes,
        isDuplicate,
      });
    });

    setParsedCandidates(candidates);
    if (sourceName) setFileName(sourceName);
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv') && !file.type.includes('csv') && !file.type.includes('text')) {
      onShowToast('Format file harus berupa .csv (Comma Separated Values)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = (e.target?.result as string) || '';
      processCsvContent(content, file.name);
      onShowToast(`File "${file.name}" terbaca! Silakan periksa daftar tamu.`);
    };
    reader.onerror = () => {
      onShowToast('Gagal membaca file CSV.');
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleManualTextChange = (text: string) => {
    setRawText(text);
    processCsvContent(text, 'Input Manual Teks');
  };

  const handleLoadSample = () => {
    setRawText(CSV_TEMPLATE_CONTENT);
    processCsvContent(CSV_TEMPLATE_CONTENT, 'Contoh Template CSV');
    onShowToast('Contoh data berhasil dimuat!');
  };

  const handleExecuteImport = () => {
    if (parsedCandidates.length === 0) {
      onShowToast('Tidak ada data tamu yang valid untuk di-import.');
      return;
    }

    const finalCandidates = skipDuplicates
      ? parsedCandidates.filter((c) => !c.isDuplicate)
      : parsedCandidates;

    if (finalCandidates.length === 0) {
      onShowToast('Semua tamu pada file sudah ada di daftar (duplikat).');
      return;
    }

    const newGuests: WhatsAppGuest[] = finalCandidates.map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      category: c.category,
      session: c.session,
      status: 'pending',
      notes: c.notes,
    }));

    onImport(newGuests);
    onShowToast(`Sukses meng-import ${newGuests.length} tamu ke antrean blast WhatsApp! 🚀`);
    onClose();
  };

  const totalValid = parsedCandidates.length;
  const duplicateCount = parsedCandidates.filter((c) => c.isDuplicate).length;
  const willImportCount = skipDuplicates ? totalValid - duplicateCount : totalValid;

  return (
    <div className="rounded-2xl bg-white p-5 sm:p-6 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col gap-4 animate-in fade-in duration-200">
      {/* Top Title & Close Bar */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#e6dac5]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#f0f3e3] text-[#51582f] flex items-center justify-center border border-[#a2ab73] shadow-xs">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[18px] font-bold text-[#2b2620] font-heading">
              Import Tamu Undangan via CSV / Spreadsheet
            </h3>
            <p className="text-[12px] text-[#7a7065]">
              Unggah file CSV dari Microsoft Excel, Google Sheets, atau tempel daftar nama langsung.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-[#f9f0e0] text-[#7a7065] hover:text-[#2b2620] cursor-pointer"
          title="Tutup Panel Import"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Template Download Banner / Quick Action */}
      <div className="rounded-xl bg-[#fdfaf5] p-3.5 border border-[#e6dac5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#cc3a63] text-white flex items-center justify-center shrink-0 mt-0.5">
            <Download className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[12px] font-bold text-[#2b2620] block">
              Butuh Format Standar Excel?
            </span>
            <span className="text-[11px] text-[#7a7065] block">
              Unduh template CSV resmi dengan kolom nama, nomor WhatsApp, kategori, dan sesi acara.
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            downloadGuestCsvTemplate();
            onShowToast('Template CSV berhasil diunduh! 📄 Silakan buka di Excel / Sheets.');
          }}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#51582f] hover:bg-[#434926] text-white text-[12px] font-bold border border-[#4a4238] shadow-xs cursor-pointer active:scale-95 transition-all shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Unduh Template CSV (.csv)</span>
        </button>
      </div>

      {/* Tabs: Upload File CSV vs Manual Paste */}
      <div className="flex items-center gap-1.5 p-1 bg-[#f9f0e0] rounded-xl border border-[#e6dac5]">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
            activeTab === 'upload'
              ? 'bg-[#cc3a63] text-white shadow-xs'
              : 'text-[#2b2620] hover:bg-white/60'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload File CSV (.csv)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('manual')}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
            activeTab === 'manual'
              ? 'bg-[#cc3a63] text-white shadow-xs'
              : 'text-[#2b2620] hover:bg-white/60'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Salin &amp; Tempel Teks (Batch)</span>
        </button>
      </div>

      {/* Tab 1: Upload File CSV */}
      {activeTab === 'upload' && (
        <div className="flex flex-col gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv,application/vnd.ms-excel"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`rounded-2xl p-7 border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-2.5 text-center ${
              dragActive
                ? 'border-[#cc3a63] bg-[#fcecf0]'
                : 'border-[#4a4238]/40 hover:border-[#cc3a63] bg-[#fdfaf5] hover:bg-[#fff9fa]'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-[#fcecf0] text-[#cc3a63] flex items-center justify-center border border-[#cc3a63]/30">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#2b2620]">
                Klik untuk memilih file CSV dari HP / Komputer
              </p>
              <p className="text-[11px] text-[#7a7065] mt-0.5">
                atau seret dan lepas file spreadsheet .csv Anda ke area ini
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#cc3a63] text-white text-[11px] font-bold shadow-xs">
              <Upload className="w-3.5 h-3.5" />
              Pilih File CSV
            </span>
          </div>
        </div>
      )}

      {/* Tab 2: Manual Textarea */}
      {activeTab === 'manual' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-[#7a7065] uppercase">
              Tempel Baris Tamu (Nama, Nomor HP, Kategori)
            </label>
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-[11px] font-bold text-[#cc3a63] hover:underline cursor-pointer"
            >
              + Muat Contoh Teks
            </button>
          </div>
          <textarea
            rows={5}
            value={rawText}
            onChange={(e) => handleManualTextChange(e.target.value)}
            placeholder="Contoh:&#10;Budi Santoso & Istri, 081234567890, VIP, Akad & Resepsi&#10;Dimas Setiawan, 085712345678, Sahabat, Resepsi&#10;Keluarga Bpk. Hendra, 081987654321, Keluarga, Resepsi"
            className="w-full p-3 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[12px] font-mono focus:outline-none focus:ring-2 focus:ring-[#cc3a63]"
          />
        </div>
      )}

      {/* Parsed Candidates Preview Table */}
      {parsedCandidates.length > 0 && (
        <div className="rounded-xl bg-[#fdfaf5] p-4 border border-[#e6dac5] flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#e6dac5]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#51582f]" />
              <span className="text-[13px] font-bold text-[#2b2620]">
                Pratinjau Hasil Pembacaan ({parsedCandidates.length} Tamu Terdeteksi)
              </span>
            </div>

            {fileName && (
              <span className="text-[11px] font-mono text-[#7a7065] bg-white px-2 py-0.5 rounded border border-[#e6dac5] truncate max-w-[200px]">
                {fileName}
              </span>
            )}
          </div>

          {/* Duplicates Notice & Toggle */}
          {duplicateCount > 0 && (
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#fff7eb] border border-[#ecd9be] text-[11px] text-[#966b2d]">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  Ditemukan <strong>{duplicateCount} tamu</strong> dengan nama yang sudah ada di daftar.
                </span>
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer select-none font-bold">
                <input
                  type="checkbox"
                  checked={skipDuplicates}
                  onChange={(e) => setSkipDuplicates(e.target.checked)}
                  className="rounded text-[#cc3a63] focus:ring-[#cc3a63]"
                />
                <span>Lewati Duplikat</span>
              </label>
            </div>
          )}

          {/* Compact Preview Table (Up to 8 items shown) */}
          <div className="overflow-x-auto max-h-[220px] rounded-lg border border-[#e6dac5] bg-white">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead className="bg-[#f9f0e0] sticky top-0 border-b border-[#e6dac5] text-[#7a7065] font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2 px-3">No</th>
                  <th className="py-2 px-3">Nama Tamu</th>
                  <th className="py-2 px-3">No. WhatsApp</th>
                  <th className="py-2 px-3">Kategori</th>
                  <th className="py-2 px-3">Sesi</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0e6d6]">
                {parsedCandidates.map((c, idx) => (
                  <tr
                    key={c.id}
                    className={`hover:bg-[#fdfaf5] ${
                      c.isDuplicate && skipDuplicates ? 'opacity-40 line-through bg-gray-50' : ''
                    }`}
                  >
                    <td className="py-1.5 px-3 font-mono text-[#7a7065]">{idx + 1}</td>
                    <td className="py-1.5 px-3 font-bold text-[#2b2620]">{c.name}</td>
                    <td className="py-1.5 px-3 font-mono text-[#524348]">
                      {c.phone || <span className="text-[#a89b91] italic">-</span>}
                    </td>
                    <td className="py-1.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f9f0e0] text-[#2b2620] border border-[#e6dac5]">
                        {c.category}
                      </span>
                    </td>
                    <td className="py-1.5 px-3 text-[#7a7065]">{c.session}</td>
                    <td className="py-1.5 px-3">
                      {c.isDuplicate ? (
                        <span className="text-[10px] font-bold text-[#cc3a63]">Duplikat</span>
                      ) : (
                        <span className="text-[10px] font-bold text-[#51582f]">Siap</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Confirm Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                setParsedCandidates([]);
                setFileName(null);
                setRawText('');
              }}
              className="text-[12px] font-bold text-[#cc3a63] hover:underline cursor-pointer"
            >
              Bersihkan / Ulangi
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl border border-[#4a4238] text-[12px] font-bold text-[#2b2620] hover:bg-[#f9f0e0] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteImport}
                disabled={willImportCount === 0}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#cc3a63] hover:bg-[#b52d53] text-white text-[12px] font-bold shadow-[2px_2px_0px_#4a4238] border border-[#4a4238] cursor-pointer active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                <span>Import {willImportCount} Tamu ke Antrean</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
