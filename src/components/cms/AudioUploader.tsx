import React, { useState, useRef, useEffect } from 'react';
import { MEDIA_BUCKET, uploadMedia } from '../../lib/mediaUpload';
import { DEFAULT_AUDIO_URL } from '../../data/weddingData';
import {
  Music,
  Upload,
  Play,
  Pause,
  RotateCcw,
  Link as LinkIcon,
  Sparkles,
  Volume2,
  VolumeX,
  FileAudio,
  Check,
  Disc,
} from 'lucide-react';

interface AudioPreset {
  id: string;
  title: string;
  artist: string;
  genre: string;
  url: string;
}

const PRESET_TRACKS: AudioPreset[] = [
  {
    id: 'music-box-canon',
    title: 'Canon in D (Music Box)',
    artist: 'Lagu Bawaan Undangan',
    genre: 'Kotak Musik Manis',
    url: DEFAULT_AUDIO_URL,
  },
  {
    id: 'canon-in-d',
    title: 'Canon in D (Pachelbel)',
    artist: 'Classical Romance Strings',
    genre: 'Klasik Elegan',
    url: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_c35fef6070.mp3?filename=canon-in-d-major-romantic-125608.mp3',
  },
  {
    id: 'wedding-love',
    title: 'Warm Piano & Cello Melody',
    artist: 'Sweet Wedding Ballad',
    genre: 'Piano Syahdu',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=wedding-love-18342.mp3',
  },
];

interface AudioUploaderProps {
  currentUrl: string;
  currentFileName?: string;
  currentTitle?: string;
  onChange: (url: string, fileName?: string, title?: string) => void;
  onShowToast: (msg: string) => void;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({
  currentUrl,
  currentFileName,
  currentTitle,
  onChange,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'presets' | 'url'>('upload');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(currentUrl);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync external url input if prop changes
  useEffect(() => {
    setUrlInput(currentUrl);
  }, [currentUrl]);

  // Handle audio time & duration events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [currentUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Playback error:', err);
          onShowToast('Gagal memutar audio. Pastikan format file didukung.');
          setIsPlaying(false);
        });
    }
  };

  const handleFile = (file: File) => {
    // Check if it is an audio file
    const isAudio =
      file.type.startsWith('audio/') ||
      file.name.toLowerCase().endsWith('.mp3') ||
      file.name.toLowerCase().endsWith('.wav') ||
      file.name.toLowerCase().endsWith('.m4a') ||
      file.name.toLowerCase().endsWith('.ogg');

    if (!isAudio) {
      onShowToast('Format file harus berupa audio (.mp3, .wav, .m4a, .ogg)');
      return;
    }

    // Size warning if > 12MB
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 15) {
      onShowToast('Ukuran file terlalu besar (>15MB). Disarankan MP3 di bawah 10MB.');
      return;
    }

    const cleanTitle = file.name.replace(/\.[^/.]+$/, '');

    // Upload straight to storage and keep only its URL: a multi-MB song held
    // inline (base64) overflowed the browser cache and bloated the settings.
    setIsUploading(true);
    onShowToast(`Mengunggah "${file.name}" (${sizeInMB.toFixed(1)} MB)... ⏳`);
    uploadMedia(file, file.name)
      .then((url) => {
        onChange(url, file.name, cleanTitle);
        setIsPlaying(false);
        onShowToast(`Lagu "${file.name}" berhasil diunggah! Jangan lupa simpan. 🎵`);
      })
      .catch((err) => {
        console.error('[audio] upload failed', err);
        onShowToast('Gagal mengunggah file MP3. Periksa koneksi lalu coba lagi.');
      })
      .finally(() => setIsUploading(false));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectPreset = (preset: AudioPreset) => {
    onChange(preset.url, undefined, preset.title);
    setIsPlaying(false);
    onShowToast(`Lagu preset "${preset.title}" dipilih! 🎶`);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) {
      onShowToast('URL audio tidak boleh kosong.');
      return;
    }
    onChange(urlInput.trim(), undefined, 'Lagu Kustom dari URL');
    setIsPlaying(false);
    onShowToast('URL audio berhasil diperbarui! 🔗');
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === Infinity) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Uploads start as data: URLs and are moved to Supabase Storage on save.
  const isUploadedDataUrl =
    currentUrl.startsWith('data:audio') || currentUrl.includes(`/${MEDIA_BUCKET}/`);
  const activeDisplayName =
    currentFileName ||
    currentTitle ||
    (isUploadedDataUrl
      ? 'File Audio Kustom (Hasil Upload)'
      : PRESET_TRACKS.find((p) => p.url === currentUrl)?.title || 'Lagu Pernikahan');

  return (
    <div className="rounded-2xl bg-white p-5 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col gap-4">
      {/* Hidden Audio Player for Preview */}
      <audio
        ref={audioRef}
        src={currentUrl}
        preload="metadata"
        muted={isMuted}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#e6dac5]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#fcecf0] text-[#cc3a63] flex items-center justify-center border border-[#cc3a63]/20">
            <Music className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-[#2b2620] font-heading">
              Musik Latar Undangan (Audio MP3)
            </h3>
            <p className="text-[11px] text-[#7a7065]">
              Diputar otomatis saat tamu membuka undangan dengan tombol kendali musik.
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#f0f3e3] text-[#51582f] border border-[#a2ab73] self-start sm:self-auto">
          {isUploadedDataUrl ? 'File MP3 Sendiri' : 'Musik Online'}
        </span>
      </div>

      {/* Active Track Status & Live Preview Bar */}
      <div className="rounded-xl bg-[#fdfaf5] p-3.5 border border-[#e6dac5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={togglePlay}
            className={`w-11 h-11 rounded-full flex items-center justify-center border border-[#4a4238] shadow-xs cursor-pointer shrink-0 transition-transform active:scale-95 ${
              isPlaying ? 'bg-[#cc3a63] text-white animate-pulse' : 'bg-white hover:bg-[#fff7eb] text-[#2b2620]'
            }`}
            title={isPlaying ? 'Jeda Lagu' : 'Putar Musik'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-0.5 fill-current text-[#cc3a63]" />}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-[#2b2620] truncate block">
                {activeDisplayName}
              </span>
              {isPlaying && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#cc3a63]">
                  <Disc className="w-3 h-3 animate-spin" />
                  Memutar
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#7a7065] font-mono mt-0.5">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
              {currentFileName && (
                <span className="text-[10px] bg-[#f9f0e0] px-1.5 py-0.2 rounded border border-[#e6dac5] truncate max-w-[150px]">
                  {currentFileName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-lg bg-white border border-[#e6dac5] text-[#7a7065] hover:text-[#2b2620] cursor-pointer"
            title={isMuted ? 'Buka Suara' : 'Bisukan'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#cc3a63]" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => handleSelectPreset(PRESET_TRACKS[0])}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#f9f0e0] border border-[#e6dac5] text-[11px] font-bold text-[#7a7065] cursor-pointer"
            title="Kembalikan ke lagu romantis bawaan"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>
        </div>
      </div>

      {/* Tabs Selector: Upload vs Presets vs URL */}
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
          <span>Upload File MP3 Langsung</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
            activeTab === 'presets'
              ? 'bg-[#cc3a63] text-white shadow-xs'
              : 'text-[#2b2620] hover:bg-white/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pilihan Lagu Romantis</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
            activeTab === 'url'
              ? 'bg-[#cc3a63] text-white shadow-xs'
              : 'text-[#2b2620] hover:bg-white/60'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Link / URL Eksternal</span>
        </button>
      </div>

      {/* 1. Tab Content: Direct MP3 Upload */}
      {activeTab === 'upload' && (
        <div className="flex flex-col gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/mp3,audio/mpeg,audio/wav,audio/ogg,audio/m4a,audio/*,.mp3"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            aria-busy={isUploading}
            className={`rounded-2xl p-6 border-2 border-dashed transition-all flex ${
              isUploading ? 'cursor-wait opacity-70' : 'cursor-pointer'
            } flex-col items-center justify-center gap-2 text-center ${
              isDragging
                ? 'border-[#cc3a63] bg-[#fcecf0]'
                : 'border-[#4a4238]/40 hover:border-[#cc3a63] bg-[#fdfaf5] hover:bg-[#fff9fa]'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-[#fcecf0] text-[#cc3a63] flex items-center justify-center border border-[#cc3a63]/30">
              <FileAudio className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#2b2620]">
                Klik untuk memilih file MP3 dari HP / Laptop
              </p>
              <p className="text-[11px] text-[#7a7065] mt-0.5">
                atau seret dan lepas file audio Anda ke area ini (Mendukung format MP3, WAV, M4A)
              </p>
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#51582f] text-white text-[11px] font-bold shadow-xs mt-1">
              <Upload className={`w-3.5 h-3.5 ${isUploading ? 'animate-bounce' : ''}`} />
              {isUploading ? 'Mengunggah...' : 'Pilih File MP3'}
            </span>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-xl bg-[#fff7eb] border border-[#ecd9be] text-[11px] text-[#966b2d]">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong>Tips Lagu Pernikahan:</strong> Unggah file MP3 dengan ukuran di bawah <strong>8 MB</strong> agar tamu undangan di smartphone dapat memutar musik secara instan tanpa menunggu buffer lama.
            </div>
          </div>
        </div>
      )}

      {/* 2. Tab Content: Curated Presets */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {PRESET_TRACKS.map((preset) => {
            const isSelected = currentUrl === preset.url;
            return (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'border-[#cc3a63] bg-[#fcecf0]/40 shadow-xs'
                    : 'border-[#e6dac5] bg-[#fdfaf5] hover:bg-white hover:border-[#4a4238]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#51582f]">
                      {preset.genre}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-[#cc3a63]" />}
                  </div>
                  <h4 className="text-[13px] font-bold text-[#2b2620] mt-1 leading-snug">
                    {preset.title}
                  </h4>
                  <p className="text-[11px] text-[#7a7065]">{preset.artist}</p>
                </div>

                <button
                  type="button"
                  className={`w-full py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                    isSelected
                      ? 'bg-[#cc3a63] text-white border-[#cc3a63]'
                      : 'bg-white text-[#2b2620] border-[#d8c8b4] hover:bg-[#f9f0e0]'
                  }`}
                >
                  {isSelected ? 'Lagu Terpilih' : 'Gunakan Lagu Ini'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Tab Content: External URL */}
      {activeTab === 'url' && (
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold text-[#7a7065] block uppercase">
            URL / Tautan File Audio Langsung (.mp3)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://domain.com/musik-wedding.mp3"
              className="flex-1 px-3 py-2 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[12px] font-mono text-[#2b2620] focus:outline-none focus:ring-2 focus:ring-[#cc3a63]"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-4 py-2 rounded-xl bg-[#cc3a63] text-white text-[12px] font-bold border border-[#4a4238] shadow-xs hover:bg-[#b52d53] cursor-pointer"
            >
              Terapkan
            </button>
          </div>
          <span className="text-[10px] text-[#7a7065]">
            Pastikan tautan dapat diakses secara publik dan berakhiran ekstensi audio seperti <code>.mp3</code> atau link streaming audio direct.
          </span>
        </div>
      )}
    </div>
  );
};
