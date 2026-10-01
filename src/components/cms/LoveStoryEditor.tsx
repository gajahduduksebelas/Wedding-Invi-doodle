import React, { useState } from 'react';
import { BookHeart, Save, RotateCcw, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { LoveStoryItem } from '../../types';
import { COUPLE_DATA } from '../../data/weddingData';
import { LoveStoryTimeline } from '../LoveStorySection';
import { useDraftReporter } from '../../lib/useDraftReporter';
import { newUuid } from '../../lib/utils';

interface LoveStoryEditorProps {
  stories: LoveStoryItem[];
  onSave: (stories: LoveStoryItem[]) => void;
  onShowToast: (message: string) => void;
  onDraftChange?: (draft: LoveStoryItem[] | null) => void;
}

const MAX_CHAPTERS = 6;
const MAX_TEXT = 320;

const inputClass =
  'w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[13px] text-[#2b2620] focus:outline-none focus:ring-2 focus:ring-[#cc3a63]';
const labelClass = 'text-[11px] font-bold text-[#7a7065] block uppercase';
const cardClass = 'rounded-2xl bg-white p-5 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col gap-3';

const DEFAULT_STORIES = COUPLE_DATA.loveStory || [];

// Step numbers always follow the list order.
const numbered = (items: LoveStoryItem[]) => items.map((s, i) => ({ ...s, stepNumber: i + 1 }));

export const LoveStoryEditor: React.FC<LoveStoryEditorProps> = ({ stories, onSave, onShowToast, onDraftChange }) => {
  const saved = numbered(stories.length > 0 ? stories : DEFAULT_STORIES);
  const [form, setForm] = useState<LoveStoryItem[]>(saved);
  useDraftReporter(form, saved, onDraftChange);

  const update = (index: number, patch: Partial<LoveStoryItem>) =>
    setForm((items) => items.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  const move = (index: number, dir: -1 | 1) =>
    setForm((items) => {
      const next = [...items];
      const [item] = next.splice(index, 1);
      next.splice(index + dir, 0, item);
      return numbered(next);
    });
  const remove = (index: number) => setForm((items) => numbered(items.filter((_, i) => i !== index)));
  const add = () =>
    setForm((items) =>
      numbered([...items, { id: newUuid(), stepNumber: items.length + 1, label: '', title: '', text: '' }]),
    );

  const untitled = form.findIndex((s) => !s.title.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (untitled !== -1) {
      onShowToast(`Bab ${untitled + 1} belum punya judul.`);
      return;
    }
    onSave(numbered(form));
    onShowToast('Love story berhasil disimpan! 💕');
  };

  const handleReset = () => {
    if (confirm('Kembalikan love story ke cerita bawaan?')) {
      const defaults = numbered(DEFAULT_STORIES);
      setForm(defaults);
      onSave(defaults);
      onShowToast('Love story dikembalikan ke bawaan.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-[960px] mx-auto pb-12">
      {/* Header */}
      <div className="rounded-2xl bg-white p-5 sm:p-6 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#fcecf0] text-[#cc3a63] text-[11px] font-bold border border-[#cc3a63]/20 uppercase tracking-wider">
            <BookHeart className="w-3 h-3" />
            Love Story
          </span>
          <h2 className="text-[24px] sm:text-[28px] font-bold text-[#2b2620] font-heading mt-1">Kisah Cinta Kami</h2>
          <p className="text-[13px] text-[#7a7065] mt-1">
            Tulis bab-bab perjalanan kalian. Urutan di sini sama dengan urutan di undangan.
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

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
        {/* Chapters */}
        <div className="flex flex-col gap-4">
          {form.map((story, i) => (
            <div key={story.id} className={cardClass}>
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#e6dac5]">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#B4533C] text-white border-[1.5px] border-[#181818] flex items-center justify-center text-[12px] font-bold">
                    {i + 1}
                  </span>
                  <h3 className="text-[15px] font-bold text-[#2b2620] font-heading leading-tight">Bab {i + 1}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                    className="p-1.5 rounded-lg text-[#7a7065] hover:text-[#2b2620] hover:bg-[#f9f0e0] disabled:opacity-25 cursor-pointer"
                    aria-label="Naikkan bab"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={i === form.length - 1}
                    onClick={() => move(i, 1)}
                    className="p-1.5 rounded-lg text-[#7a7065] hover:text-[#2b2620] hover:bg-[#f9f0e0] disabled:opacity-25 cursor-pointer"
                    aria-label="Turunkan bab"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={form.length <= 1}
                    onClick={() => remove(i)}
                    className="p-1.5 rounded-lg text-[#cc3a63] hover:bg-[#fcecf0] disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="Hapus bab"
                    title={form.length <= 1 ? 'Minimal satu bab' : 'Hapus bab'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-3">
                <div>
                  <label className={labelClass}>Label</label>
                  <input
                    type="text"
                    value={story.label}
                    onChange={(e) => update(i, { label: e.target.value })}
                    placeholder="mis. Awal Cerita"
                    maxLength={30}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Judul</label>
                  <input
                    type="text"
                    value={story.title}
                    onChange={(e) => update(i, { title: e.target.value })}
                    placeholder="mis. Pertama kali bertemu"
                    maxLength={60}
                    className={`${inputClass} ${!story.title.trim() ? 'border-red-400' : ''}`}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-baseline justify-between">
                  <label className={labelClass}>Cerita</label>
                  <span className="text-[10.5px] font-mono text-[#7a7065]">
                    {story.text.length}/{MAX_TEXT}
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={story.text}
                  onChange={(e) => update(i, { text: e.target.value })}
                  maxLength={MAX_TEXT}
                  placeholder="Ceritakan momen ini…"
                  className={inputClass}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            disabled={form.length >= MAX_CHAPTERS}
            onClick={add}
            className="self-start inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#f0f3e3] hover:bg-[#e3e9cc] text-[#51582f] text-[12px] font-bold border border-[#a2ab73] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Bab ({form.length}/{MAX_CHAPTERS})
          </button>
        </div>

        {/* Live preview */}
        <div className="lg:sticky lg:top-24 flex flex-col gap-2">
          <span className="text-[11px] font-bold text-[#7a7065] uppercase tracking-wider">Pratinjau di undangan</span>
          <div className="rounded-[28px] bg-[#FAF7EE] border-2 border-[#4a4238] p-4 pt-5">
            <p className="text-center font-allura text-[24px] text-[#B4533C] leading-none">Bab demi bab</p>
            <p className="text-center font-serif text-[26px] text-[#181818] tracking-wide mb-3">LOVE STORY</p>
            <LoveStoryTimeline stories={form} />
          </div>
          {form.length > 3 && (
            <p className="text-[11px] text-[#7a7065]">
              Tip: lebih dari 3 bab membuat bagian ini lebih panjang dari satu layar ponsel — tamu cukup menggulir.
            </p>
          )}
        </div>
      </div>
    </form>
  );
};
