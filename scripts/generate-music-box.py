#!/usr/bin/env python3
"""Synthesizes the invitation's default background music: a music-box
arrangement of Pachelbel's Canon in D (a public-domain composition), written
to public/assets/music/canon-in-d-music-box.mp3.

Requires: pip install numpy lameenc
Run from the repo root:  python3 scripts/generate-music-box.py
"""
from pathlib import Path
import numpy as np
import lameenc

SR = 32000
BPM = 66
BEAT = 60.0 / BPM
OUT = Path(__file__).resolve().parent.parent / "public" / "assets" / "music" / "canon-in-d-music-box.mp3"

NOTE_INDEX = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}


def freq(name):
    pitch, octave = name[:-1], int(name[-1])
    midi = 12 * (octave + 1) + NOTE_INDEX[pitch]
    return 440.0 * 2 ** ((midi - 69) / 12)


def music_box(f, dur=2.6, vel=1.0):
    """Plucked metal-comb tone: a few slightly inharmonic partials with a
    sharp attack and exponential decay (higher partials die faster)."""
    t = np.arange(int(SR * dur)) / SR
    partials = [(1.0, 1.0, 1.0), (2.0, 0.35, 1.8), (3.02, 0.12, 3.0), (5.4, 0.05, 5.0)]
    y = np.zeros_like(t)
    for ratio, amp, decay_mul in partials:
        y += amp * np.sin(2 * np.pi * f * ratio * t) * np.exp(-t * 1.7 * decay_mul)
    attack = np.minimum(1.0, t / 0.004)
    return vel * y * attack


def soft_bass(f, dur, vel=1.0):
    t = np.arange(int(SR * (dur + 1.2))) / SR
    y = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t)
    env = np.minimum(1.0, t / 0.06) * np.exp(-t * 0.9)
    return vel * y * env


# Ground bass (one chord per two beats) and the chord tones for arpeggios.
BASS = ["D3", "A2", "B2", "F#2", "G2", "D2", "G2", "A2"]
ARPEGGIO = [
    ["D4", "F#4", "A4", "F#4"], ["C#4", "E4", "A4", "E4"], ["D4", "F#4", "B4", "F#4"], ["C#4", "F#4", "A4", "F#4"],
    ["D4", "G4", "B4", "G4"], ["D4", "F#4", "A4", "F#4"], ["D4", "G4", "B4", "G4"], ["C#4", "E4", "A4", "E4"],
]
# Variation 1: the famous half-note line.
MELODY_HALF = ["F#5", "E5", "D5", "C#5", "B4", "A4", "B4", "C#5"]
# Variation 2: two notes per chord.
MELODY_QUARTER = ["D5", "F#5", "A5", "G5", "F#5", "D5", "F#5", "E5", "D5", "B4", "D5", "A5", "G5", "B5", "A5", "G5"]

CYCLE_BEATS = 16


def render():
    cycles = 4
    total = int(SR * (cycles * CYCLE_BEATS * BEAT + 3))
    mix = np.zeros(total)

    def add(sig, at_beat, gain):
        start = int(at_beat * BEAT * SR)
        end = min(total, start + len(sig))
        mix[start:end] += gain * sig[: end - start]

    for c in range(cycles):
        base = c * CYCLE_BEATS
        for i, note in enumerate(BASS):
            add(soft_bass(freq(note), 2 * BEAT), base + 2 * i, 0.22)
            for j, a in enumerate(ARPEGGIO[i]):
                vel = 0.85 if j == 0 else 0.7
                add(music_box(freq(a), 1.8, vel), base + 2 * i + 0.5 * j, 0.16 if c else 0.2)
        if c in (1, 3):
            for i, m in enumerate(MELODY_HALF):
                add(music_box(freq(m), 3.0), base + 2 * i, 0.34)
                if c == 3:  # octave doubling on the last pass
                    add(music_box(freq(m[:-1] + str(int(m[-1]) + 1)), 2.4, 0.7), base + 2 * i, 0.14)
        if c == 2:
            for i, m in enumerate(MELODY_QUARTER):
                add(music_box(freq(m), 2.4), base + i, 0.32)

    # Gentle room: a couple of quiet echoes.
    for delay, g in ((0.11, 0.22), (0.23, 0.14), (0.37, 0.08)):
        d = int(delay * SR)
        mix[d:] += g * mix[:-d].copy()

    # Trim to the loop length (the tail of the last cycle rings into the
    # start when the <audio loop> restarts) and fade the very edges.
    loop_len = int(SR * cycles * CYCLE_BEATS * BEAT)
    tail = mix[loop_len:loop_len + int(SR * 1.5)]
    mix = mix[:loop_len]
    mix[: len(tail)] += tail * np.linspace(1, 0, len(tail))
    fade = int(SR * 0.02)
    mix[:fade] *= np.linspace(0, 1, fade)
    mix[-fade:] *= np.linspace(1, 0, fade)

    mix /= np.max(np.abs(mix)) + 1e-9
    return (mix * 0.85 * 32767).astype(np.int16)


def main():
    pcm = render()
    enc = lameenc.Encoder()
    enc.set_bit_rate(96)
    enc.set_in_sample_rate(SR)
    enc.set_channels(1)
    enc.set_quality(2)
    data = enc.encode(pcm.tobytes()) + enc.flush()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_bytes(data)
    print(f"wrote {OUT.relative_to(OUT.parents[3])}: {len(pcm) / SR:.1f}s, {len(data) / 1024:.0f} KB")


if __name__ == "__main__":
    main()
