import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  isPlaying: boolean;
  onToggle: () => void;
  onPlaySuccess?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  isPlaying,
  onToggle,
  onPlaySuccess,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<number | null>(null);

  // Fallback romantic chime melody generator using Web Audio API
  const startRomanticSynth = () => {
    if (synthIntervalRef.current) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtxClass();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      // Romantic acoustic chord progression frequencies: D Major / B Minor
      const notes = [293.66, 369.99, 440.0, 587.33, 659.25, 739.99, 880.0, 587.33, 440.0, 369.99];
      let noteIdx = 0;

      synthIntervalRef.current = window.setInterval(() => {
        if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
        try {
          const ctx = audioCtxRef.current;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(notes[noteIdx % notes.length], ctx.currentTime);
          noteIdx++;

          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.25);
        } catch {
          // Ignore synth glitch
        }
      }, 700);
    } catch {
      // Audio context not allowed
    }
  };

  const stopRomanticSynth = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
      audioCtxRef.current.suspend().catch(() => {});
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            onPlaySuccess?.();
          })
          .catch(() => {
            // If browser blocks audio URL, fallback to Web Audio
            startRomanticSynth();
          });
      }
    } else {
      audio.pause();
      stopRomanticSynth();
    }

    return () => {
      stopRomanticSynth();
    };
  }, [isPlaying, onPlaySuccess]);

  return (
    <>
      <audio ref={audioRef} src={audioUrl} loop preload="auto" />
      <div className="fixed bottom-20 right-4 z-40">
        <button
          id="audioToggleBtn"
          onClick={onToggle}
          aria-label="Putar atau jeda musik latar"
          className={`flex items-center gap-2 px-3 py-2 rounded-full shadow-[3px_4px_0px_#4a4238] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#4a4238] transition-all border border-[#4a4238] cursor-pointer ${
            isPlaying
              ? 'bg-[#fff7eb] text-[#cc3a63]'
              : 'bg-white text-[#524348]'
          }`}
        >
          <div className="relative flex items-center justify-center w-6 h-6">
            {isPlaying ? (
              <Pause className="w-5 h-5 text-[#cc3a63] animate-pulse" />
            ) : (
              <Play className="w-5 h-5 text-[#7a7065] fill-current" />
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-bold text-[#2b2620]">
              {isPlaying ? 'Jeda Musik' : 'Putar Musik'}
            </span>
            {isPlaying && (
              <div className="flex items-end gap-0.5 h-3.5 w-3" id="soundWavesVisual">
                <span className="w-0.5 bg-[#cc3a63] rounded-full wave-bar-1 h-3" />
                <span className="w-0.5 bg-[#cc3a63] rounded-full wave-bar-2 h-2" />
                <span className="w-0.5 bg-[#cc3a63] rounded-full wave-bar-3 h-3.5" />
              </div>
            )}
          </div>
        </button>
      </div>
    </>
  );
};
