import React, { useEffect, useRef, useState } from 'react';
import { DEFAULT_AUDIO_URL } from '../data/weddingData';

export const BACKGROUND_MUSIC_ID = 'backgroundMusic';

/**
 * iOS/Safari only allow audio that starts synchronously inside a tap handler;
 * starting it later from an effect is blocked. Call this from the click
 * handler itself (the effect below still keeps state in sync).
 */
export const startBackgroundMusicFromGesture = () => {
  const audio = document.getElementById(BACKGROUND_MUSIC_ID) as HTMLAudioElement | null;
  audio?.play().catch(() => {});
};

interface AudioPlayerProps {
  audioUrl: string;
  isPlaying: boolean;
  onToggle: () => void;
  onPlaySuccess?: () => void;
  visibleButton?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  isPlaying,
  onToggle,
  onPlaySuccess,
  visibleButton = true,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioError, setAudioError] = useState(false);

  // Fallback acoustic chime melody synthesizer if network audio fails to load
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<number | null>(null);

  const startRomanticSynth = () => {
    if (synthIntervalRef.current) return;
    try {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtxClass();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const notes = [293.66, 369.99, 440.0, 587.33, 659.25, 739.99, 880.0, 587.33];
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
          gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.25);
        } catch {}
      }, 750);
    } catch {}
  };

  const stopRomanticSynth = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
      try {
        audioCtxRef.current.suspend();
      } catch {}
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio
        .play()
        .then(() => {
          setAudioError(false);
          onPlaySuccess?.();
        })
        .catch(() => {
          // If mp3 blocked or failed, run gentle chime synth
          setAudioError(true);
          startRomanticSynth();
        });
    } else {
      audio.pause();
      stopRomanticSynth();
    }
    // audioUrl: a new song (e.g. loaded from the database after the page
    // opened) resets the element, so playback has to be started again.
  }, [isPlaying, audioUrl]);

  useEffect(() => {
    return () => {
      stopRomanticSynth();
    };
  }, []);

  return (
    <>
      <audio
        id={BACKGROUND_MUSIC_ID}
        ref={audioRef}
        src={audioUrl || DEFAULT_AUDIO_URL}
        loop
        preload="metadata"
        onError={() => setAudioError(true)}
      />

      {/* Cute-Doodle Floating Music Toggle Button */}
      {visibleButton && (
        <button
          type="button"
          onClick={onToggle}
          aria-label={isPlaying ? 'Hentikan musik' : 'Putar musik'}
          aria-pressed={isPlaying}
          className={`fixed bottom-20 right-4 z-40 w-11 h-11 rounded-full border-[2px] border-[#181818] flex items-center justify-center shadow-[3.5px_3.5px_0px_#181818] transition-all cursor-pointer ${
            isPlaying
              ? 'bg-[#B4533C] text-white animate-spin-slow'
              : 'bg-[#FAF7EE] text-[#181818] hover:bg-white'
          }`}
        >
          <span className="w-5 h-5 flex items-center justify-center" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <path
                d="M9.5 7.7 17 5.8v7.15M9.5 7.7v7.15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <ellipse
                cx="7.3"
                cy="15.5"
                rx="2.4"
                ry="1.75"
                transform="rotate(-18 7.3 15.5)"
                fill="currentColor"
              />
              <ellipse
                cx="14.8"
                cy="13.6"
                rx="2.4"
                ry="1.75"
                transform="rotate(-18 14.8 13.6)"
                fill="currentColor"
              />
            </svg>
          </span>
        </button>
      )}
    </>
  );
};
