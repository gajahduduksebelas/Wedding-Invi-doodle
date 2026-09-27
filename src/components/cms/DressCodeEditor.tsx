import React, { useState } from 'react';
import { Shirt, Save, RotateCcw, Plus, Trash2, ChevronUp, ChevronDown, Eye, EyeOff, Palette, Ban } from 'lucide-react';
import { DressCodeColor, DressCodeConfig } from '../../types';
import { DEFAULT_DRESS_CODE, DRESS_CODE_PRESETS } from '../../data/weddingData';
import { DressCodeCard } from '../DressCodeSection';
import { useDraftReporter } from '../../lib/useDraftReporter';
import { newUuid } from '../../lib/utils';

interface DressCodeEditorProps {
  dressCode: DressCodeConfig;
  onSave: (config: DressCodeConfig) => void;
  onShowToast: (message: string) => void;
  onDraftChange?: (draft: DressCodeConfig | null) => void;
}

const MAX_COLORS = 8;
const MAX_AVOID = 4;
const HEX_RE = /^#[0-9a-f]{6}$/i;

const inputClass =
  'w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[13px] text-[#2b2620] focus:outline-none focus:ring-2 focus:ring-[#cc3a63]';
const labelClass = 'text-[11px] font-bold text-[#7a7065] block uppercase';
const cardClass = 'rounded-2xl bg-white p-5 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col gap-3';

interface ColorListProps {
  title: string;
  hint: string;
  icon: React.ReactNode;
  colors: DressCodeColor[];
  max: number;
  onChange: (colors: DressCodeColor[]) => void;
}

// Editable list of named colors: native color picker + hex + name, reorder, remove.
const ColorList: React.FC<ColorListProps> = ({ title, hint, icon, colors, max, onChange }) => {
  const update = (index: number, patch: Partial<DressCodeColor>) =>
    onChange(colors.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  const move = (index: number, dir: -1 | 1) => {
    const next = [...colors];
    const [item] = next.splice(index, 1);
    next.splice(index + dir, 0, item);
    onChange(next);
  };

  return (
    <div className={cardClass}>
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#e6dac5]">
        <div className="flex items-center gap-2">
          {icon}
          <div>
            <h3 className="text-[15px] font-bold text-[#2b2620] font-heading leading-tight">{title}</h3>
            <p className="text-[11px] text-[#7a7065]">{hint}</p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-[#7a7065]">
          {colors.length}/{max}
        </span>
      </div>

      {colors.length === 0 && <p className="text-[12px] text-[#7a7065] italic">Belum ada warna.</p>}

      {colors.map((c, i) => (
        <div key={c.id} className="flex items-center gap-2">
          <input
            type="color"
            value={HEX_RE.test(c.hex) ? c.hex : '#ffffff'}
            onChange={(e) => update(i, { hex: e.target.value.toUpperCase() })}
            className="w-11 h-11 shrink-0 rounded-full border-2 border-[#181818] cursor-pointer p-0 overflow-hidden bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-full [&::-moz-color-swatch]:border-none"
            aria-label={`Pilih warna ${c.name || i + 1}`}
          />
          <input
            type="text"
            value={c.name}
            onChange={(e) => update(i, { name: e.target.value })}
            placeholder="Nama warna"
            className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[13px] font-bold text-[#2b2620] focus:outline-none"
          />
          <input
            type="text"
            value={c.hex}
            onChange={(e) => {
              const v = e.target.value.trim();
              update(i, { hex: v.startsWith('#') ? v.toUpperCase() : `#${v.toUpperCase()}` });
            }}
            maxLength={7}
            className={`w-[84px] shrink-0 px-2 py-2 rounded-xl border bg-[#fdfaf5] text-[12px] font-mono text-[#2b2620] focus:outline-none ${
              HEX_RE.test(c.hex) ? 'border-[#4a4238]' : 'border-red-500 bg-red-50'
            }`}
            aria-label="Kode warna hex"
          />
          <div className="flex flex-col">
            <button
              type="button"
              disabled={i === 0}
              onClick={() => move(i, -1)}
              className="p-0.5 text-[#7a7065] hover:text-[#2b2620] disabled:opacity-25 cursor-pointer"
              aria-label="Naikkan"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={i === colors.length - 1}
              onClick={() => move(i, 1)}
              className="p-0.5 text-[#7a7065] hover:text-[#2b2620] disabled:opacity-25 cursor-pointer"
              aria-label="Turunkan"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => onChange(colors.filter((_, idx) => idx !== i))}
            className="p-2 rounded-lg text-[#cc3a63] hover:bg-[#fcecf0] cursor-pointer"
            aria-label="Hapus warna"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      <button
        type="button"
        disabled={colors.length >= max}
        onClick={() => onChange([...colors, { id: newUuid(), name: '', hex: '#D9C3A5' }])}
        className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f0f3e3] hover:bg-[#e3e9cc] text-[#51582f] text-[12px] font-bold border border-[#a2ab73] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        Tambah Warna
      </button>
    </div>
  );
};

export const DressCodeEditor: React.FC<DressCodeEditorProps> = ({ dressCode, onSave, onShowToast, onDraftChange }) => {
  const [form, setForm] = useState<DressCodeConfig>(dressCode);
  useDraftReporter(form, dressCode, onDraftChange);

  const invalidHex = [...form.colors, ...form.avoidColors].some((c) => !HEX_RE.test(c.hex));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (invalidHex) {
      onShowToast('Ada kode warna yang belum valid (format #RRGGBB).');
      return;
    }
    onSave(form);
    onShowToast('Dress code berhasil disimpan! 👗');
  };

  const handleReset = () => {
    if (confirm('Kembalikan dress code ke pengaturan bawaan?')) {
      setForm(DEFAULT_DRESS_CODE);
      onSave(DEFAULT_DRESS_CODE);
      onShowToast('Dress code dikembalikan ke bawaan.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-[960px] mx-auto pb-12">
      {/* Header */}
      <div className="rounded-2xl bg-white p-5 sm:p-6 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#fcecf0] text-[#cc3a63] text-[11px] font-bold border border-[#cc3a63]/20 uppercase tracking-wider">
            <Shirt className="w-3 h-3" />
            Dress Code
          </span>
          <h2 className="text-[24px] sm:text-[28px] font-bold text-[#2b2620] font-heading mt-1">
            Panduan Busana Tamu
          </h2>
          <p className="text-[13px] text-[#7a7065] mt-1">
            Tentukan gaya busana dan palet warna sebagai referensi tamu undangan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
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
            <span>Simpan</span>
          </button>
        </div>
      </div>

      {/* Show / hide on the invitation */}
      <div className="rounded-2xl bg-white p-4 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-bold text-[#2b2620] font-heading">Tampilkan di Undangan</h3>
          <p className="text-[12px] text-[#7a7065]">
            Jika dimatikan, bagian Dress Code tidak muncul di undangan tamu.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setForm((f) => ({ ...f, enabled: !f.enabled }))}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold border transition-all cursor-pointer active:translate-y-0.5 ${
            form.enabled
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700'
              : 'bg-[#f0f0f0] hover:bg-[#e4e4e4] text-[#4a4238] border-[#a0988e]'
          }`}
          aria-pressed={form.enabled}
        >
          {form.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          <span>Dress Code: {form.enabled ? 'AKTIF' : 'NONAKTIF'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
        <div className="flex flex-col gap-6">
          {/* Text */}
          <div className={cardClass}>
            <div>
              <label className={labelClass}>Gaya Busana</label>
              <input
                type="text"
                value={form.attire}
                onChange={(e) => setForm({ ...form, attire: e.target.value })}
                placeholder="mis. Semi Formal · Batik / Kebaya Modern"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Pesan untuk Tamu</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          {/* Presets */}
          <div className={cardClass}>
            <div className="flex items-center gap-2 pb-2 border-b border-[#e6dac5]">
              <Palette className="w-5 h-5 text-[#cc3a63]" />
              <div>
                <h3 className="text-[15px] font-bold text-[#2b2620] font-heading leading-tight">Palet Siap Pakai</h3>
                <p className="text-[11px] text-[#7a7065]">Pilih salah satu, lalu sesuaikan di bawah.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DRESS_CODE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setForm((f) => ({
                      ...f,
                      colors: preset.colors.map((c) => ({ ...c, id: newUuid() })),
                    }));
                    onShowToast(`Palet "${preset.label}" diterapkan 🎨`);
                  }}
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#fdfaf5] hover:bg-[#f9f0e0] border border-[#d8c8b4] hover:border-[#4a4238] text-left cursor-pointer transition-colors"
                >
                  <span className="text-[12px] font-bold text-[#2b2620]">{preset.label}</span>
                  <span className="flex -space-x-1.5 shrink-0">
                    {preset.colors.map((c) => (
                      <span
                        key={c.id}
                        className="w-5 h-5 rounded-full border-[1.5px] border-[#181818]"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <ColorList
            title="Palet Warna Busana"
            hint="Warna yang dianjurkan untuk tamu"
            icon={<Palette className="w-5 h-5 text-[#51582f]" />}
            colors={form.colors}
            max={MAX_COLORS}
            onChange={(colors) => setForm({ ...form, colors })}
          />

          <ColorList
            title="Warna yang Dihindari"
            hint="Ditampilkan dicoret, mis. putih untuk pengantin"
            icon={<Ban className="w-5 h-5 text-[#cc3a63]" />}
            colors={form.avoidColors}
            max={MAX_AVOID}
            onChange={(avoidColors) => setForm({ ...form, avoidColors })}
          />

          {/* Notes */}
          <div className={cardClass}>
            <label className={labelClass}>Catatan (satu per baris)</label>
            <textarea
              rows={4}
              value={form.notes.join('\n')}
              onChange={(e) => setForm({ ...form, notes: e.target.value.split('\n') })}
              onBlur={() => setForm((f) => ({ ...f, notes: f.notes.map((n) => n.trim()).filter(Boolean) }))}
              className={inputClass}
            />
          </div>
        </div>

        {/* Live preview, same component as the invitation */}
        <div className="lg:sticky lg:top-24 flex flex-col gap-2">
          <span className="text-[11px] font-bold text-[#7a7065] uppercase flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            Pratinjau di Undangan
          </span>
          <div
            className={`rounded-3xl bg-[#FAF7EE] border-2 border-[#4a4238] p-4 transition-opacity ${
              form.enabled ? '' : 'opacity-45'
            }`}
          >
            <p className="font-allura text-[26px] text-[#B4533C] text-center leading-none">Busana yang dianjurkan</p>
            <p className="font-delicious text-[30px] text-[#181818] text-center leading-tight mb-3">DRESS CODE</p>
            <DressCodeCard config={form} />
          </div>
          {!form.enabled && (
            <p className="text-[11px] text-[#7a7065] text-center">Sedang dinonaktifkan — tidak tampil di undangan.</p>
          )}
        </div>
      </div>
    </form>
  );
};
