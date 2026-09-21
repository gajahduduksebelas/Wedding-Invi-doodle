import React, { useState } from 'react';
import { Video, Film, Save, RotateCcw, ExternalLink, Sparkles, Check } from 'lucide-react';
import { VideoConfig } from '../../types';
import { DEFAULT_VIDEO_CONFIG, PRESET_VIDEOS, extractYouTubeId } from '../../data/weddingData';

interface VideoEditorProps {
  videoConfig: VideoConfig;
  onSave: (newConfig: VideoConfig) => void;
  onShowToast: (message: string) => void;
}

export const VideoEditor: React.FC<VideoEditorProps> = ({
  videoConfig,
  onSave,
  onShowToast,
}) => {
  const [formData, setFormData] = useState<VideoConfig>(videoConfig);
  const videoId = extractYouTubeId(formData.youtubeUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onShowToast('Video YouTube berhasil disimpan! 🎬');
  };

  const handleApplyPreset = (url: string) => {
    setFormData((prev) => ({ ...prev, youtubeUrl: url }));
    onShowToast('Preset video diterapkan!');
  };

  const handleReset = () => {
    setFormData(DEFAULT_VIDEO_CONFIG);
    onSave(DEFAULT_VIDEO_CONFIG);
    onShowToast('Video di-reset ke default.');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-[960px] mx-auto pb-12">
      <div className="rounded-2xl bg-white p-5 sm:p-6 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#fcecf0] text-[#cc3a63] text-[11px] font-bold border border-[#cc3a63]/20 uppercase tracking-wider">
            <Film className="w-3.5 h-3.5" />
            Video Prewedding
          </span>
          <h2 className="text-[24px] sm:text-[28px] font-bold text-[#2b2620] font-heading mt-1">
            Pengaturan Video YouTube
          </h2>
          <p className="text-[13px] text-[#7a7065] mt-1">
            Semua link YouTube (standar, tautan pendek youtu.be, atau shorts) otomatis disematkan
            dan diputar secara otomatis di halaman tamu.
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
            <span>Simpan Video</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Video Settings (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-white p-5 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col gap-4">
          <div>
            <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
              URL Video YouTube *
            </label>
            <input
              type="url"
              required
              value={formData.youtubeUrl}
              onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/..."
              className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[13px] font-mono text-[#2b2620] focus:outline-none focus:ring-2 focus:ring-[#cc3a63]"
            />
            <p className="text-[11px] text-[#7a7065] mt-1">
              ID Video terdeteksi: <span className="font-mono font-bold text-[#cc3a63]">{videoId || 'Belum valid'}</span>
            </p>
          </div>

          {/* Preset Buttons */}
          <div>
            <label className="text-[11px] font-bold text-[#7a7065] block uppercase mb-1.5">
              Pilihan Preset Video Contoh
            </label>
            <div className="flex flex-col gap-2">
              {PRESET_VIDEOS.map((p) => (
                <button
                  key={p.url}
                  type="button"
                  onClick={() => handleApplyPreset(p.url)}
                  className={`text-left px-3.5 py-2 rounded-xl text-[12px] font-bold border transition-all cursor-pointer flex items-center justify-between ${
                    formData.youtubeUrl === p.url
                      ? 'bg-[#f0f3e3] text-[#51582f] border-[#a2ab73]'
                      : 'bg-[#f9f0e0] text-[#2b2620] border-[#4a4238] hover:bg-[#edd9bf]'
                  }`}
                >
                  <span>{p.label}</span>
                  {formData.youtubeUrl === p.url && <Check className="w-4 h-4 text-[#51582f]" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
              Judul Video di Undangan
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[13px] font-bold text-[#2b2620] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
              Deskripsi Singkat / Subtitle
            </label>
            <textarea
              rows={3}
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[12px] text-[#2b2620] focus:outline-none"
            />
          </div>
        </div>

        {/* Right: Live Player Preview (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-white p-5 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#e6dac5]">
            <h3 className="text-[15px] font-bold text-[#2b2620] font-heading">
              Pratinjau Pemutar Video
            </h3>
            {formData.youtubeUrl && (
              <a
                href={formData.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-[#cc3a63] hover:underline inline-flex items-center gap-1"
              >
                <span>Buka di YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="w-full aspect-video rounded-xl overflow-hidden border-2 border-[#4a4238] bg-[#211b12] flex items-center justify-center shadow-inner">
            {videoId ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                title={formData.title || 'Wedding Video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <div className="text-center text-white p-4 flex flex-col items-center gap-2">
                <Video className="w-8 h-8 text-[#a2ab73]" />
                <p className="text-[12px] font-bold">Masukkan URL YouTube valid untuk melihat preview</p>
              </div>
            )}
          </div>

          <div className="rounded-xl bg-[#f9f0e0] p-3 border border-[#e6dac5] text-[11px] text-[#524348]">
            <span className="font-bold text-[#2b2620] block mb-0.5">Catatan Pemutaran:</span>
            Di layar tamu, video akan otomatis diputar tanpa suara (muted autoplay) sesuai kebijakan browser modern, dan tamu dapat menyalakan suara dengan mengetuk tombol volume.
          </div>
        </div>
      </div>
    </form>
  );
};
