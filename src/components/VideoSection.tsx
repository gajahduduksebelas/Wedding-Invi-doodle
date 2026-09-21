import React from 'react';
import { ExternalLink, Video, Film, Sparkles, Volume2 } from 'lucide-react';
import { VideoConfig } from '../types';
import { extractYouTubeId } from '../data/weddingData';

interface VideoSectionProps {
  videoConfig: VideoConfig;
}

export const VideoSection: React.FC<VideoSectionProps> = ({ videoConfig }) => {
  const videoId = extractYouTubeId(videoConfig.youtubeUrl);

  return (
    <section id="videoSection" className="px-4 py-4 flex flex-col items-center">
      <div className="w-full max-w-[420px] flex flex-col gap-4">
        {/* Section Header */}
        <div className="text-center relative">
          <span className="text-[12px] font-bold text-[#cc3a63] tracking-widest uppercase block">
            Video Cinematic
          </span>
          <h2 className="text-[26px] font-bold text-[#2b2620] font-heading mt-0.5">
            {videoConfig.title || 'Kisah Kasih Kita'}
          </h2>
          <p className="text-[13px] font-medium text-[#524348] mt-1 max-w-[320px] mx-auto leading-relaxed">
            {videoConfig.subtitle || 'Menyimpan kenangan dan cerita indah dalam bingkai visual.'}
          </p>
        </div>

        {/* Video Card Container */}
        <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-[3px_4px_0px_#4a4238] border-2 border-[#4a4238] flex flex-col gap-3 relative">
          {/* Decorative washi tape banner on card top-right */}
          <div className="absolute -top-3 right-4 w-24 h-6 bg-[#a2ab73] rotate-2 rounded-sm shadow-sm border border-[#88915b] flex items-center justify-center pointer-events-none">
            <span className="text-[10px] font-bold text-white tracking-wider uppercase">
              🎬 Our Story
            </span>
          </div>

          {/* Film Reel decorative header bar */}
          <div className="flex items-center justify-between px-1 pt-1 pb-0.5 text-[#847279]">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#524348]">
              <Film className="w-3.5 h-3.5 text-[#cc3a63]" />
              <span>Teaser Prewedding Video</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#51582f] font-bold">
              <Sparkles className="w-3 h-3" />
              <span>Full HD</span>
            </div>
          </div>

          {/* 16:9 Responsive Video Frame with Autoplay */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-[#4a4238] bg-[#211b12] shadow-inner flex items-center justify-center">
            {videoId ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1&loop=1&playlist=${videoId}`}
                title={videoConfig.title || 'Wedding Prewedding Video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="p-6 text-center text-white flex flex-col items-center justify-center gap-2">
                <Video className="w-10 h-10 text-[#a2ab73] opacity-80" />
                <p className="text-[13px] font-bold">Video Pernikahan Segera Hadir</p>
              </div>
            )}
          </div>

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-between gap-2 pt-1">
            {videoId ? (
              <a
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f9f0e0] text-[#2b2620] text-[11px] font-bold border border-[#e6dac5] hover:bg-[#edd9bf] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#cc3a63]" />
                <span>Buka di YouTube</span>
              </a>
            ) : (
              <span className="text-[11px] text-[#7a7065] italic">Format video YouTube</span>
            )}

            <span className="text-[11px] text-[#7a7065] font-medium flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-[#a2ab73]" />
              <span>Ketuk untuk suara</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

