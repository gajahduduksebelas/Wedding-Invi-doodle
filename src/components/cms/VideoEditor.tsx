import React, { useState, useRef } from 'react';
import {
  Video,
  Film,
  Save,
  RotateCcw,
  ExternalLink,
  Sparkles,
  Check,
  Upload,
  Play,
  Trash2,
  Sliders,
} from 'lucide-react';
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
  const [formData, setFormData] = useState<VideoConfig>({
    sourceType: videoConfig.sourceType || (videoConfig.directVideoUrl ? 'upload' : 'youtube'),
    youtubeUrl: videoConfig.youtubeUrl || '',
    directVideoUrl: videoConfig.directVideoUrl || '',
    videoFileName: videoConfig.videoFileName || '',
    title: videoConfig.title || 'Kisah Kasih & Perjalanan Cinta',
    subtitle:
      videoConfig.subtitle ||
      'Cuplikan momen manis, tawa, dan janji suci perjalanan cinta kami.',
    autoplay: videoConfig.autoplay !== false,
    muted: videoConfig.muted !== false,
    loop: videoConfig.loop !== false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const videoId = extractYouTubeId(formData.youtubeUrl);

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Verify video type
      if (!file.type.startsWith('video/')) {
        alert('Pilih berkas video berformat MP4, WEBM, atau MOV.');
        return;
      }

      // Check size (warn if > 40MB for browser storage)
      const sizeMb = file.size / (1024 * 1024);
      if (sizeMb > 50) {
        if (
          !confirm(
            `Ukuran video ini cukup besar (${sizeMb.toFixed(1)} MB). Untuk kecepatan loading tamu yang maksimal, disarankan menggunakan video < 30MB atau tautan YouTube. Lanjutkan?`
          )
        ) {
          return;
        }
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData((prev) => ({
            ...prev,
            sourceType: 'upload',
            directVideoUrl: event.target!.result as string,
            videoFileName: file.name,
          }));
          onShowToast(`Video "${file.name}" berhasil diupload! 🎬`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveDirectVideo = () => {
    setFormData((prev) => ({
      ...prev,
      directVideoUrl: '',
      videoFileName: '',
      sourceType: 'youtube',
    }));
    onShowToast('Video upload dihapus, beralih ke YouTube.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onShowToast('Pengaturan video berhasil disimpan! 🎬');
  };

  const handleApplyPreset = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      sourceType: 'youtube',
      youtubeUrl: url,
    }));
    onShowToast('Preset video diterapkan!');
  };

  const handleReset = () => {
    if (confirm('Kembalikan video ke pengaturan default?')) {
      setFormData(DEFAULT_VIDEO_CONFIG);
      onSave(DEFAULT_VIDEO_CONFIG);
      onShowToast('Video di-reset ke default.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-[960px] mx-auto pb-24">
      {/* 1. Header Card */}
      <div className="rounded-2xl bg-white p-4 sm:p-6 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fcecf0] text-[#cc3a63] text-[11px] font-bold border border-[#cc3a63]/20 uppercase tracking-wider">
            <Film className="w-3.5 h-3.5" />
            Video Prewedding &amp; Teaser
          </span>
          <h2 className="text-[20px] sm:text-[26px] font-bold text-[#2b2620] font-heading mt-1">
            Pengaturan Video
          </h2>
          <p className="text-[12px] sm:text-[13px] text-[#7a7065] mt-0.5">
            Pilih metode video: sematkan video YouTube atau upload video MP4 langsung dari perangkat.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#f9f0e0] hover:bg-[#edd9bf] text-[#2b2620] text-[12px] font-bold border border-[#4a4238] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#7a7065]" />
            <span>Reset</span>
          </button>
          <button
            type="submit"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#cc3a63] hover:bg-[#b52d53] text-white text-[13px] font-bold shadow-[2px_2px_0px_#4a4238] border border-[#4a4238] active:translate-y-0.5 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Video</span>
          </button>
        </div>
      </div>

      {/* 2. Source Type Selector (YouTube vs Upload) */}
      <div className="rounded-2xl bg-white p-4 sm:p-5 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col gap-4">
        <label className="text-[12px] font-bold text-[#7a7065] uppercase">
          Pilih Sumber Video
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, sourceType: 'youtube' })}
            className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col gap-1 ${
              formData.sourceType === 'youtube'
                ? 'bg-[#fcecf0] border-[#cc3a63] text-[#cc3a63] shadow-[1px_2px_0px_#cc3a63]'
                : 'bg-[#fffdfa] border-[#e6dac5] text-[#2b2620] hover:bg-[#f9f0e0]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[13px]">🎬 Link YouTube</span>
              {formData.sourceType === 'youtube' && <Check className="w-4 h-4 text-[#cc3a63]" />}
            </div>
            <span className="text-[11px] text-[#7a7065]">Standar, Shorts, atau youtu.be</span>
          </button>

          <button
            type="button"
            onClick={() => setFormData({ ...formData, sourceType: 'upload' })}
            className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col gap-1 ${
              formData.sourceType === 'upload'
                ? 'bg-[#f0f3e3] border-[#a2ab73] text-[#51582f] shadow-[1px_2px_0px_#a2ab73]'
                : 'bg-[#fffdfa] border-[#e6dac5] text-[#2b2620] hover:bg-[#f9f0e0]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[13px]">📁 Upload Video (MP4)</span>
              {formData.sourceType === 'upload' && <Check className="w-4 h-4 text-[#51582f]" />}
            </div>
            <span className="text-[11px] text-[#7a7065]">Dari galeri ponsel / komputer</span>
          </button>

          <button
            type="button"
            onClick={() => setFormData({ ...formData, sourceType: 'direct' })}
            className={`col-span-2 sm:col-span-1 p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col gap-1 ${
              formData.sourceType === 'direct'
                ? 'bg-[#f9f0e0] border-[#4a4238] text-[#2b2620] shadow-[1px_2px_0px_#4a4238]'
                : 'bg-[#fffdfa] border-[#e6dac5] text-[#2b2620] hover:bg-[#f9f0e0]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[13px]">🔗 Link Video Langsung</span>
              {formData.sourceType === 'direct' && <Check className="w-4 h-4 text-[#2b2620]" />}
            </div>
            <span className="text-[11px] text-[#7a7065]">URL Google Drive / Cloud MP4</span>
          </button>
        </div>
      </div>

      {/* 3. Main Editor & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Inputs */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* If YouTube Selected */}
          {formData.sourceType === 'youtube' && (
            <div className="rounded-2xl bg-white p-4 sm:p-5 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
                  URL Video YouTube *
                </label>
                <input
                  type="url"
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                  className="w-full mt-1 px-3 py-2.5 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[13px] font-mono text-[#2b2620] focus:outline-none"
                />
                <p className="text-[11px] text-[#7a7065] mt-1">
                  ID terdeteksi: <span className="font-mono font-bold text-[#cc3a63]">{videoId || 'Belum ada ID valid'}</span>
                </p>
              </div>

              {/* Preset buttons */}
              <div>
                <label className="text-[11px] font-bold text-[#7a7065] block uppercase mb-1.5">
                  Pilihan Contoh Video Prewedding
                </label>
                <div className="flex flex-col gap-1.5">
                  {PRESET_VIDEOS.map((p) => (
                    <button
                      key={p.url}
                      type="button"
                      onClick={() => handleApplyPreset(p.url)}
                      className={`text-left px-3.5 py-2.5 rounded-xl text-[12px] font-bold border transition-all cursor-pointer flex items-center justify-between ${
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
            </div>
          )}

          {/* If Direct Upload Selected */}
          {formData.sourceType === 'upload' && (
            <div className="rounded-2xl bg-white p-4 sm:p-5 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#7a7065] block uppercase mb-1.5">
                  Unggah Video Prewedding dari Perangkat
                </label>

                {formData.directVideoUrl ? (
                  <div className="p-4 rounded-xl bg-[#f0f3e3] border-2 border-[#a2ab73] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg bg-white border border-[#a2ab73] flex items-center justify-center text-[#51582f]">
                        <Film className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[13px] font-bold text-[#2b2620] block truncate max-w-[220px]">
                          {formData.videoFileName || 'Video Prewedding Terupload'}
                        </span>
                        <span className="text-[11px] text-[#51582f] font-medium">
                          Video siap diputar di undangan tamu
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-white text-[#2b2620] text-[11px] font-bold border border-[#4a4238] hover:bg-[#edd9bf] cursor-pointer"
                      >
                        Ganti Video
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveDirectVideo}
                        className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                        title="Hapus video upload"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#a2ab73] bg-[#fdfaf5] hover:bg-[#f0f3e3] rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center gap-2.5 text-center cursor-pointer transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#f0f3e3] border border-[#a2ab73] flex items-center justify-center text-[#51582f]">
                      <Upload className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#2b2620]">
                        Ketuk untuk Pilih Berkas Video (MP4 / WebM)
                      </p>
                      <p className="text-[11px] text-[#7a7065] mt-0.5">
                        Pilih klip prewedding dari galeri HP atau laptop Anda
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-[#51582f] text-[11px] font-bold border border-[#a2ab73]">
                      Pilih Video
                    </span>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/ogg,video/quicktime"
                  onChange={handleVideoFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* If Direct URL Selected */}
          {formData.sourceType === 'direct' && (
            <div className="rounded-2xl bg-white p-4 sm:p-5 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col gap-3">
              <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
                URL File Video MP4 Langsung
              </label>
              <input
                type="url"
                value={formData.directVideoUrl || ''}
                onChange={(e) => setFormData({ ...formData, directVideoUrl: e.target.value })}
                placeholder="https://example.com/video-prewedding.mp4"
                className="w-full px-3 py-2.5 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[13px] font-mono text-[#2b2620] focus:outline-none"
              />
              <p className="text-[11px] text-[#7a7065]">
                Dapat berupa link file MP4 hosting pribadi, Supabase, Firebase Storage, atau Cloudinary.
              </p>
            </div>
          )}

          {/* Titles & Playback Settings */}
          <div className="rounded-2xl bg-white p-4 sm:p-5 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col gap-4">
            <div>
              <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
                Judul Bagian Video di Undangan
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full mt-1 px-3 py-2.5 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[13px] font-bold text-[#2b2620] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
                Deskripsi Singkat / Subtitle
              </label>
              <textarea
                rows={2}
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[12px] text-[#2b2620] focus:outline-none"
              />
            </div>

            {/* Playback Toggles */}
            <div className="pt-2 border-t border-[#e6dac5] flex flex-col gap-2">
              <span className="text-[11px] font-bold text-[#7a7065] uppercase">
                Opsi Pemutaran Otomatis (Autoplay)
              </span>

              <label className="flex items-center justify-between p-2 rounded-xl bg-[#fdfaf5] border border-[#e6dac5] cursor-pointer">
                <span className="text-[12px] font-medium text-[#2b2620]">
                  Putar otomatis saat tamu membuka (Autoplay)
                </span>
                <input
                  type="checkbox"
                  checked={formData.autoplay !== false}
                  onChange={(e) => setFormData({ ...formData, autoplay: e.target.checked })}
                  className="w-4 h-4 accent-[#cc3a63]"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-[#fdfaf5] border border-[#e6dac5] cursor-pointer">
                <span className="text-[12px] font-medium text-[#2b2620]">
                  Ulangi video terus menerus (Loop)
                </span>
                <input
                  type="checkbox"
                  checked={formData.loop !== false}
                  onChange={(e) => setFormData({ ...formData, loop: e.target.checked })}
                  className="w-4 h-4 accent-[#cc3a63]"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Live Preview */}
        <div className="lg:col-span-5 rounded-2xl bg-white p-4 sm:p-5 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#e6dac5]">
            <h3 className="text-[15px] font-bold text-[#2b2620] font-heading">
              Pratinjau Pemutar
            </h3>
            {formData.sourceType === 'youtube' && formData.youtubeUrl && (
              <a
                href={formData.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-[#cc3a63] hover:underline inline-flex items-center gap-1"
              >
                <span>Buka YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="w-full aspect-video rounded-xl overflow-hidden border-2 border-[#4a4238] bg-[#211b12] flex items-center justify-center shadow-inner">
            {formData.sourceType === 'upload' || formData.sourceType === 'direct' ? (
              formData.directVideoUrl ? (
                <video
                  src={formData.directVideoUrl}
                  controls
                  playsInline
                  autoPlay={false}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-white p-4 flex flex-col items-center gap-2">
                  <Film className="w-8 h-8 text-[#a2ab73]" />
                  <p className="text-[12px] font-bold">Pilih berkas video untuk melihat preview</p>
                </div>
              )
            ) : videoId ? (
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
                <p className="text-[12px] font-bold">Masukkan URL YouTube valid</p>
              </div>
            )}
          </div>

          <div className="rounded-xl bg-[#f9f0e0] p-3 border border-[#e6dac5] text-[11px] text-[#524348]">
            <span className="font-bold text-[#2b2620] block mb-0.5">Info Pemutaran Tamu:</span>
            Video akan diputar dalam bingkai cinematic 16:9 yang responsif di semua ukuran layar smartphone dan tablet.
          </div>
        </div>
      </div>

      {/* 4. Sticky Mobile Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-[#fffdfa]/95 backdrop-blur-md border-t-2 border-[#4a4238] flex items-center justify-between gap-2 max-w-[960px] mx-auto sm:hidden">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl bg-[#f9f0e0] text-[#2b2620] text-[12px] font-bold border border-[#4a4238]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
        <button
          type="submit"
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#cc3a63] text-white text-[13px] font-bold shadow-[2px_2px_0px_#4a4238] border border-[#4a4238] active:scale-95 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Video</span>
        </button>
      </div>
    </form>
  );
};
