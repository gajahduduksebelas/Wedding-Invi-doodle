#!/usr/bin/env python3
"""Generates the invitation's built-in doodle illustrations as SVG files.

These replace the third-party sample images the template originally linked
to. Everything shares the invitation palette (ink, cream, terracotta, blush,
sage, butter) and a slightly wobbly "hand-drawn" line via an SVG filter.

Run from the repo root:  python3 scripts/generate-doodle-assets.py
Output: public/assets/{doodle,couple,gallery}/*.svg
"""
from pathlib import Path
import random
import re

OUT = Path(__file__).resolve().parent.parent / "public" / "assets"

INK = "#181818"
CREAM = "#FAF7EE"
PAPER = "#FFFDF8"
TERRA = "#B4533C"
BLUSH = "#F7C6BA"
BLUSH_LIGHT = "#FBE8E6"
SAGE = "#C6E2CB"
SAGE_DARK = "#4E6B47"
BUTTER = "#EAD69B"
SAND = "#EFE3C6"
SKY = "#D8E8F0"
SKIN = "#F2CDAE"
CHEEK = "#F29C8F"
HAIR_DARK = "#2B2522"
HAIR_BROWN = "#5B3A29"
SUIT = "#34405A"
SW = 3  # main stroke width

LINE = f'stroke="{INK}" stroke-width="{SW}" stroke-linecap="round" stroke-linejoin="round"'


def _dedupe_stroke_width(markup):
    # LINE carries a default stroke-width; shapes that pass their own keep the
    # last one (a duplicate attribute makes the SVG invalid).
    def fix(tag):
        t = tag.group(0)
        widths = re.findall(r' stroke-width="[^"]*"', t)
        for w in widths[:-1]:
            t = t.replace(w, "", 1)
        return t
    return re.sub(r"<[^>]+>", fix, markup)


def svg(w, h, body, title):
    body = _dedupe_stroke_width(body)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" aria-label="{title}">
<title>{title}</title>
<defs>
  <filter id="wobble" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2"/>
  </filter>
  <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse">
    <circle cx="2" cy="2" r="1.1" fill="{INK}" opacity="0.08"/>
  </pattern>
</defs>
<g filter="url(#wobble)">
{body}
</g>
</svg>
"""


# ---------------------------------------------------------------- primitives

def heart(x, y, s=1.0, fill=TERRA, stroke=True, rot=0):
    d = ("M 0 6 C -8 -4 -20 2 -12 12 L 0 24 L 12 12 C 20 2 8 -4 0 6 Z")
    st = LINE if stroke else 'stroke="none"'
    return f'<path d="{d}" transform="translate({x} {y}) rotate({rot}) scale({s}) translate(0 -12)" fill="{fill}" {st} stroke-width="{SW / s:.2f}"/>'


def sparkle(x, y, s=1.0, color=INK):
    return (f'<path d="M 0 -10 Q 1.5 -1.5 10 0 Q 1.5 1.5 0 10 Q -1.5 1.5 -10 0 Q -1.5 -1.5 0 -10 Z" '
            f'transform="translate({x} {y}) scale({s})" fill="{color}"/>')


def dot(x, y, r=2.2, color=INK, op=1):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{color}" opacity="{op}"/>'


def flower(x, y, s=1.0, petal=BLUSH, center=BUTTER):
    petals = "".join(
        f'<ellipse cx="0" cy="-9" rx="6" ry="9" transform="rotate({a})" fill="{petal}" {LINE} stroke-width="{2.4 / s:.2f}"/>'
        for a in range(0, 360, 72)
    )
    return (f'<g transform="translate({x} {y}) scale({s})">{petals}'
            f'<circle r="5" fill="{center}" {LINE} stroke-width="{2.4 / s:.2f}"/></g>')


def leaf(x, y, s=1.0, rot=0, fill=SAGE):
    return (f'<g transform="translate({x} {y}) rotate({rot}) scale({s})">'
            f'<path d="M 0 0 Q 10 -14 0 -30 Q -10 -14 0 0 Z" fill="{fill}" {LINE} stroke-width="{2.4 / s:.2f}"/>'
            f'<path d="M 0 -3 L 0 -24" stroke="{INK}" stroke-width="{1.6 / s:.2f}" stroke-linecap="round"/></g>')


def sprig(x, y, s=1.0, rot=0):
    parts = [f'<path d="M 0 0 Q 4 -30 0 -60" fill="none" {LINE}/>']
    for i, (dy, side) in enumerate([(-14, 1), (-26, -1), (-38, 1), (-50, -1)]):
        parts.append(leaf(side * 2, dy, 0.55, side * 55))
    return f'<g transform="translate({x} {y}) rotate({rot}) scale({s})">{"".join(parts)}</g>'


def face(x, y, r):
    e = r * 0.42
    return (
        f'<path d="M {x - e - 4} {y + 1} q 4 -4.5 8 0" fill="none" {LINE} stroke-width="2.6"/>'
        f'<path d="M {x + e - 4} {y + 1} q 4 -4.5 8 0" fill="none" {LINE} stroke-width="2.6"/>'
        f'<ellipse cx="{x - e - 3}" cy="{y + 9}" rx="4.5" ry="3" fill="{CHEEK}" opacity="0.75"/>'
        f'<ellipse cx="{x + e + 3}" cy="{y + 9}" rx="4.5" ry="3" fill="{CHEEK}" opacity="0.75"/>'
        f'<path d="M {x - 5} {y + 10} q 5 5 10 0" fill="none" {LINE} stroke-width="2.6"/>'
    )


# ------------------------------------------------------------------ people

def groom(x, y, s=1.0, arm=None):
    """Head centre at (x, y). arm: 'right' reaches right (to hold hands)."""
    r = 24
    g = []
    # body / suit
    g.append(f'<path d="M -30 34 Q -35 80 -36 132 L 36 132 Q 35 80 30 34 Q 0 22 -30 34 Z" fill="{SUIT}" {LINE}/>')
    g.append(f'<path d="M -11 30 L 0 60 L 11 30 Z" fill="#FFFFFF" {LINE} stroke-width="2.4"/>')
    g.append(f'<path d="M 0 60 L 0 128" stroke="{INK}" stroke-width="2" opacity="0.5"/>')
    g.append(f'<path d="M -9 32 L 0 37 L -9 42 Z M 9 32 L 0 37 L 9 42 Z" fill="{TERRA}" {LINE} stroke-width="2"/>')
    g.append(f'<circle cx="22" cy="54" r="3.2" fill="{BLUSH}" {LINE} stroke-width="1.6"/>')  # boutonniere
    if arm == "right":
        g.append(f'<path d="M 26 46 Q 44 70 52 88" fill="none" stroke="{SUIT}" stroke-width="13" stroke-linecap="round"/>')
        g.append(f'<path d="M 26 46 Q 44 70 52 88" fill="none" {LINE} stroke-width="1.5" opacity="0.001"/>')
    # neck + head
    g.append(f'<rect x="-7" y="18" width="14" height="14" rx="5" fill="{SKIN}" {LINE} stroke-width="2.4"/>')
    g.append(f'<circle cx="-24" cy="3" r="5" fill="{SKIN}" {LINE} stroke-width="2.4"/>')
    g.append(f'<circle cx="24" cy="3" r="5" fill="{SKIN}" {LINE} stroke-width="2.4"/>')
    g.append(f'<circle cx="0" cy="0" r="{r}" fill="{SKIN}" {LINE}/>')
    g.append(f'<path d="M -25 0 Q -27 -30 0 -28 Q 27 -30 25 -3 Q 16 -17 2 -15 Q -12 -14 -25 0 Z" fill="{HAIR_DARK}" {LINE}/>')
    g.append(face(0, 2, r))
    return f'<g transform="translate({x} {y}) scale({s})">{"".join(g)}</g>'


def bride(x, y, s=1.0, arm=None, veil=True):
    r = 24
    g = []
    # veil (behind)
    if veil:
        g.append(f'<path d="M -6 -26 Q 40 -10 44 60 Q 46 110 30 140 L 8 140 Q 22 60 -6 -26 Z" fill="#FFFFFF" opacity="0.85" {LINE} stroke-width="2.2"/>')
    # long hair (behind head)
    g.append(f'<path d="M -26 0 Q -30 -30 0 -28 Q 30 -30 26 0 Q 30 30 22 44 L -22 44 Q -30 30 -26 0 Z" fill="{HAIR_BROWN}" {LINE}/>')
    # dress
    g.append(f'<path d="M -24 34 Q 0 26 24 34 Q 26 60 22 70 Q 44 110 52 140 L -52 140 Q -44 110 -22 70 Q -26 60 -24 34 Z" fill="#FFFFFF" {LINE}/>')
    g.append(f'<path d="M -22 68 Q 0 76 22 68" fill="none" stroke="{TERRA}" stroke-width="5" stroke-linecap="round"/>')
    for fx, fy in [(-26, 110), (8, 96), (30, 124), (-6, 128)]:
        g.append(f'<circle cx="{fx}" cy="{fy}" r="3" fill="{BLUSH}" stroke="{INK}" stroke-width="1.4"/>')
    if arm == "left":
        g.append(f'<path d="M -20 46 Q -38 70 -46 88" fill="none" stroke="{SKIN}" stroke-width="10" stroke-linecap="round"/>')
    # neck + head
    g.append(f'<rect x="-6" y="18" width="12" height="14" rx="5" fill="{SKIN}" {LINE} stroke-width="2.4"/>')
    g.append(f'<circle cx="0" cy="0" r="{r}" fill="{SKIN}" {LINE}/>')
    g.append(f'<path d="M -24 -2 Q -22 -28 2 -26 Q 24 -26 25 -4 Q 10 -18 -4 -12 Q -14 -8 -24 -2 Z" fill="{HAIR_BROWN}" {LINE}/>')
    # flower crown
    for i, fx in enumerate([-18, -6, 6, 18]):
        fy = -22 - (3 if i in (1, 2) else 0)
        g.append(f'<circle cx="{fx}" cy="{fy}" r="4.2" fill="{[BLUSH, BUTTER, BLUSH, SAGE][i]}" stroke="{INK}" stroke-width="1.8"/>')
    g.append(face(0, 2, r))
    return f'<g transform="translate({x} {y}) scale({s})">{"".join(g)}</g>'


def hands(x, y, s=1.0):
    return f'<circle cx="{x}" cy="{y}" r="{7 * s}" fill="{SKIN}" {LINE} stroke-width="2.4"/>'


def couple(x, y, s=1.0):
    """Groom left, bride right, holding hands between them. (x, y) = mid-point between heads."""
    return (groom(x - 42 * s, y, s, arm="right") + bride(x + 42 * s, y + 4 * s, s, arm="left")
            + hands(x + 4 * s, y + 90 * s, s))


def bouquet(x, y, s=1.0):
    return (f'<g transform="translate({x} {y}) scale({s})">'
            + leaf(-10, 4, 0.6, -40) + leaf(10, 4, 0.6, 40)
            + flower(-8, -4, 0.55) + flower(8, -6, 0.55, BUTTER, TERRA) + flower(0, -16, 0.55, "#FFFFFF")
            + f'<path d="M -6 8 L 0 26 L 6 8 Z" fill="{SAND}" {LINE} stroke-width="2.2"/></g>')


def paper_bg(w, h, color, pattern=True):
    out = f'<rect width="{w}" height="{h}" fill="{color}"/>'
    if pattern:
        out += f'<rect width="{w}" height="{h}" fill="url(#dots)"/>'
    return out


def scatter(w, h, n, seed, kinds=("heart", "sparkle", "dot"), x_max=None):
    rnd = random.Random(seed)
    out = []
    for _ in range(n):
        x, y = rnd.uniform(18, (x_max or w) - 18), rnd.uniform(18, h * 0.45)
        k = rnd.choice(kinds)
        if k == "heart":
            out.append(heart(x, y, rnd.uniform(0.35, 0.55), rnd.choice([TERRA, BLUSH]), True, rnd.uniform(-20, 20)))
        elif k == "sparkle":
            out.append(sparkle(x, y, rnd.uniform(0.5, 0.9)))
        else:
            out.append(dot(x, y, rnd.uniform(1.6, 2.6)))
    return "".join(out)


def ground(w, h, y, color):
    return (f'<path d="M -10 {y} Q {w * 0.25} {y - 10} {w * 0.5} {y} T {w + 10} {y} L {w + 10} {h + 10} L -10 {h + 10} Z" '
            f'fill="{color}" {LINE}/>')


# ------------------------------------------------------------- assets: misc

def floral_envelope():
    w, h = 200, 150
    b = []
    b.append(f'<rect x="22" y="40" width="156" height="98" rx="10" fill="{PAPER}" {LINE}/>')
    b.append(f'<path d="M 24 44 L 100 98 L 176 44" fill="none" {LINE}/>')
    b.append(f'<path d="M 24 136 L 80 88 M 176 136 L 120 88" fill="none" {LINE} stroke-width="2.4" opacity="0.6"/>')
    b.append(heart(100, 100, 0.8, TERRA))
    # flowers on the top-left corner and a sprig on the right
    b.append(leaf(32, 50, 0.9, -70) + leaf(48, 38, 0.9, -20) + leaf(76, 40, 0.75, 30))
    b.append(flower(40, 40, 1.05) + flower(64, 32, 0.8, BUTTER, TERRA) + flower(26, 66, 0.7, "#FFFFFF"))
    b.append(sprig(170, 60, 0.7, 25))
    b.append(sparkle(150, 22, 0.8) + sparkle(186, 32, 0.5) + dot(128, 20) + dot(14, 96, 1.8))
    return svg(w, h, "".join(b), "Amplop undangan bergambar bunga")


def portrait(kind):
    # 4:5, the ratio of the CoupleSection portrait frame.
    w, h = 320, 400
    b = [paper_bg(w, h, BLUSH_LIGHT if kind == "bride" else SKY)]
    b.append(f'<circle cx="160" cy="190" r="122" fill="{SAND if kind == "groom" else "#FFFFFF"}" {LINE}/>')
    b.append(scatter(w, h, 9, 11 if kind == "groom" else 12))
    b.append(sprig(34, 400, 1.35, -14) + sprig(286, 400, 1.35, 14))
    if kind == "groom":
        b.append(groom(160, 176, 1.4))
    else:
        b.append(bride(160, 176, 1.4))
        b.append(bouquet(160, 326, 1.45))
    b.append(f'<rect x="1.5" y="1.5" width="{w - 3}" height="{h - 3}" fill="none" stroke="{INK}" stroke-width="3"/>')
    label = "Ilustrasi mempelai pria" if kind == "groom" else "Ilustrasi mempelai wanita"
    return svg(w, h, "".join(b), label)


# ----------------------------------------------------------- gallery scenes
W, H = 300, 400


def scene_string_lights():
    b = [paper_bg(W, H, "#2E3350", False)]
    rnd = random.Random(3)
    for _ in range(40):
        b.append(dot(rnd.uniform(0, W), rnd.uniform(0, H * 0.55), rnd.uniform(0.8, 1.8), "#FFFFFF", 0.7))
    b.append(f'<path d="M -10 40 Q 150 120 310 40" fill="none" stroke="{CREAM}" stroke-width="2"/>')
    for i in range(9):
        t = i / 8
        x = -10 + 320 * t
        y = 40 + 80 * 4 * t * (1 - t) * 1.0
        b.append(f'<circle cx="{x}" cy="{y + 8}" r="6" fill="{BUTTER}" stroke="{INK}" stroke-width="2"/>')
        b.append(f'<circle cx="{x}" cy="{y + 8}" r="12" fill="{BUTTER}" opacity="0.25"/>')
    b.append(ground(W, H, 330, SAGE_DARK))
    b.append(couple(150, 205, 0.95))
    return b, "Bergandengan tangan di bawah lampu taman"


def scene_balloon():
    b = [paper_bg(W, H, SKY)]
    b.append(f'<path d="M 30 70 q 20 -18 40 0 q 20 -18 40 0" fill="#FFFFFF" {LINE}/>')
    b.append(f'<path d="M 190 110 q 16 -14 32 0 q 16 -14 32 0" fill="#FFFFFF" {LINE}/>')
    b.append(heart(210, 70, 2.3, TERRA))
    b.append(f'<path d="M 210 118 Q 200 170 188 230" fill="none" {LINE} stroke-width="2"/>')
    b.append(ground(W, H, 340, SAGE))
    b.append(couple(140, 215, 0.95))
    b.append(flower(40, 350, 0.8) + flower(265, 360, 0.7, BUTTER, TERRA))
    return b, "Balon hati di hari yang cerah"


def scene_umbrella():
    b = [paper_bg(W, H, "#DDE3EA")]
    rnd = random.Random(5)
    for _ in range(26):
        x, y = rnd.uniform(0, W), rnd.uniform(0, H * 0.9)
        b.append(f'<path d="M {x} {y} l -4 12" stroke="#7B93A8" stroke-width="2.4" stroke-linecap="round"/>')
    b.append(f'<path d="M 50 150 Q 150 40 250 150 Q 225 132 200 150 Q 175 132 150 150 Q 125 132 100 150 Q 75 132 50 150 Z" fill="{TERRA}" {LINE}/>')
    b.append(f'<path d="M 150 60 L 150 230" {LINE}/>')
    b.append(ground(W, H, 345, "#9FB1C1"))
    b.append(f'<ellipse cx="70" cy="365" rx="34" ry="7" fill="#C9D6E2" {LINE} stroke-width="2"/>')
    b.append(couple(150, 205, 0.9))
    return b, "Berbagi payung saat hujan"


def scene_picnic():
    b = [paper_bg(W, H, BUTTER)]
    b.append(f'<circle cx="240" cy="70" r="30" fill="#FFF3C4" {LINE}/>')
    b.append(ground(W, H, 210, SAGE))
    # checkered blanket
    b.append(f'<path d="M 40 250 L 260 250 L 290 360 L 10 360 Z" fill="#FFFFFF" {LINE}/>')
    for i in range(6):
        x0 = 40 + i * 36.6
        b.append(f'<path d="M {x0} 250 L {x0 + 18} 250 L {10 + i * 46.6 + 23} 360 L {10 + i * 46.6} 360 Z" fill="{BLUSH}" opacity="0.8"/>')
    b.append(f'<path d="M 40 250 L 260 250 L 290 360 L 10 360 Z" fill="none" {LINE}/>')
    # basket
    b.append(f'<path d="M 90 270 L 170 270 L 162 318 L 98 318 Z" fill="{SAND}" {LINE}/>')
    b.append(f'<path d="M 104 270 Q 130 236 156 270" fill="none" {LINE}/>')
    b.append(f'<path d="M 94 286 L 166 286 M 96 302 L 164 302" {LINE} stroke-width="2"/>')
    # teacups
    for cx in (205, 235):
        b.append(f'<path d="M {cx - 12} 300 L {cx + 12} 300 L {cx + 9} 322 L {cx - 9} 322 Z" fill="#FFFFFF" {LINE} stroke-width="2.4"/>')
    b.append(heart(220, 280, 0.45, TERRA))
    b.append(sprig(30, 205, 1.1, -10) + sprig(275, 208, 1.0, 12))
    b.append(scatter(W, H, 5, 21, ("sparkle", "dot")))
    return b, "Piknik berdua"


def scene_ring_box():
    b = [paper_bg(W, H, BLUSH_LIGHT)]
    b.append(f'<path d="M 70 260 L 230 260 L 230 330 Q 150 344 70 330 Z" fill="{TERRA}" {LINE}/>')
    b.append(f'<path d="M 70 260 Q 150 250 230 260 L 230 200 Q 150 180 70 200 Z" fill="#C8674F" {LINE}/>')
    b.append(f'<path d="M 86 262 Q 150 254 214 262 L 214 296 Q 150 306 86 296 Z" fill="#FFFFFF" {LINE}/>')
    b.append(f'<circle cx="150" cy="250" r="24" fill="none" stroke="{INK}" stroke-width="9"/>')
    b.append(f'<circle cx="150" cy="250" r="24" fill="none" stroke="{BUTTER}" stroke-width="5"/>')
    b.append(f'<path d="M 140 222 L 150 206 L 160 222 L 150 234 Z" fill="#FFFFFF" {LINE} stroke-width="2.4"/>')
    b.append(sparkle(118, 196, 1.1) + sparkle(186, 186, 0.8) + sparkle(200, 226, 0.5))
    b.append(scatter(W, H, 8, 31, ("heart", "dot")))
    b.append(f'<text x="150" y="112" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="30" fill="{INK}">Will you?</text>')
    return b, "Kotak cincin lamaran"


def scene_sunset():
    b = [paper_bg(W, H, "#F6C9A6", False)]
    b.append(f'<rect width="{W}" height="140" fill="#F3B38F"/>')
    b.append(f'<circle cx="150" cy="235" r="70" fill="#F7D774" {LINE}/>')
    b.append(f'<path d="M 0 250 L {W} 250 L {W} {H} L 0 {H} Z" fill="#8FB6C9" {LINE}/>')
    for i, y in enumerate((272, 292, 316)):
        b.append(f'<path d="M {40 + i * 20} {y} q 20 -6 40 0 M {170 - i * 10} {y + 6} q 24 -6 48 0" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round"/>')
    b.append(f'<path d="M 0 345 Q 150 322 {W} 345 L {W} {H} L 0 {H} Z" fill="{SAND}" {LINE}/>')
    b.append(f'<g opacity="0.92">{couple(150, 238, 0.72)}</g>')
    b.append(f'<path d="M 40 60 q 8 -8 16 0 q 8 -8 16 0 M 210 90 q 6 -6 12 0 q 6 -6 12 0" fill="none" {LINE} stroke-width="2.4"/>')
    return b, "Senja di tepi pantai"


def scene_coffee():
    b = [paper_bg(W, H, SAND)]
    b.append(f'<rect x="0" y="270" width="{W}" height="130" fill="#C99E7A" {LINE}/>')
    for cx, col in ((105, "#FFFFFF"), (195, BLUSH)):
        b.append(f'<path d="M {cx - 38} 200 L {cx + 38} 200 L {cx + 30} 290 Q {cx} 300 {cx - 30} 290 Z" fill="{col}" {LINE}/>')
        b.append(f'<path d="M {cx + 36} 220 q 26 4 20 30 q -4 16 -24 16" fill="none" {LINE}/>')
        b.append(f'<ellipse cx="{cx}" cy="200" rx="38" ry="8" fill="#7A4E36" {LINE}/>')
        b.append(heart(cx, 245, 0.8, TERRA))
    b.append(f'<path d="M 92 180 q -10 -18 4 -34 q 12 -16 -2 -34 M 206 180 q -10 -18 4 -34 q 12 -16 -2 -34" fill="none" {LINE} stroke-width="2.4" opacity="0.7"/>')
    b.append(f'<ellipse cx="150" cy="330" rx="120" ry="16" fill="#B78963" opacity="0.6"/>')
    b.append(scatter(W, H, 6, 41, ("sparkle", "dot")))
    b.append(f'<text x="150" y="80" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="28" fill="{INK}">just us two</text>')
    return b, "Dua cangkir kopi"


def scene_letter():
    b = [paper_bg(W, H, SAGE)]
    b.append(f'<g transform="rotate(-6 150 230)">'
             f'<rect x="50" y="150" width="200" height="140" rx="10" fill="{PAPER}" {LINE}/>'
             f'<path d="M 52 154 L 150 226 L 248 154" fill="none" {LINE}/>'
             f'{heart(150, 230, 1.1, TERRA)}</g>')
    b.append(flower(62, 140, 1.2) + flower(96, 118, 0.9, BUTTER, TERRA) + leaf(40, 160, 1, -60) + leaf(118, 134, 0.9, 30))
    b.append(flower(236, 300, 1.0, "#FFFFFF") + leaf(262, 300, 0.9, 70))
    b.append(scatter(W, H, 8, 51))
    b.append(f'<text x="150" y="360" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="26" fill="{INK}">with love</text>')
    return b, "Surat cinta dan bunga"


def scene_flower_frame():
    b = [paper_bg(W, H, "#FFFFFF")]
    b.append(f'<path d="M 150 40 C 250 40 270 120 270 210 C 270 310 220 370 150 370 C 80 370 30 310 30 210 C 30 120 50 40 150 40 Z" fill="{BLUSH_LIGHT}" {LINE}/>')
    b.append(couple(150, 185, 0.95))
    for x, y, s, p in [(40, 90, 1.0, BLUSH), (66, 60, 0.8, BUTTER), (262, 330, 1.0, BLUSH), (236, 356, 0.8, "#FFFFFF"), (262, 70, 0.7, SAGE)]:
        b.append(flower(x, y, s, p, TERRA if p == BUTTER else BUTTER))
    b.append(leaf(30, 120, 1, -50) + leaf(92, 50, 0.9, 40) + leaf(276, 300, 1, 50) + leaf(212, 370, 0.9, -80))
    return b, "Potret berdua dalam bingkai bunga"


def scene_calendar():
    b = [paper_bg(W, H, BLUSH)]
    b.append(f'<rect x="50" y="90" width="200" height="220" rx="16" fill="{PAPER}" {LINE}/>')
    b.append(f'<path d="M 50 106 Q 50 90 66 90 L 234 90 Q 250 90 250 106 L 250 140 L 50 140 Z" fill="{TERRA}" {LINE}/>')
    for x in (95, 205):
        b.append(f'<rect x="{x - 6}" y="72" width="12" height="32" rx="6" fill="{SAND}" {LINE} stroke-width="2.4"/>')
    b.append(f'<text x="150" y="125" text-anchor="middle" font-family="Georgia, serif" font-size="20" fill="#FFFFFF" letter-spacing="3">SAVE THE DATE</text>')
    for r in range(4):
        for c in range(5):
            x, y = 78 + c * 36, 170 + r * 34
            if (r, c) == (1, 2):
                b.append(heart(x, y + 2, 1.05, TERRA))
            else:
                b.append(dot(x, y + 2, 3, INK, 0.35))
    b.append(sparkle(262, 80, 1) + sparkle(40, 330, 0.8) + flower(250, 320, 0.9, "#FFFFFF"))
    return b, "Simpan tanggalnya"


def og_art():
    """Artwork for the 1200x630 link preview; the text is added when it is
    rendered to PNG (scripts/render-og-image.cjs) so it uses the web fonts."""
    w, h = 1200, 630
    b = [paper_bg(w, h, CREAM)]
    b.append(f'<path d="M 60 630 C 60 300 150 90 360 90 C 570 90 660 300 660 630 Z" fill="{BLUSH_LIGHT}" {LINE}/>')
    b.append(couple(360, 300, 1.75))
    b.append(sprig(90, 630, 2.2, -14) + sprig(630, 630, 2.2, 14))
    for x, y, sc, pe in [(120, 150, 1.6, BLUSH), (170, 110, 1.1, BUTTER), (600, 160, 1.4, "#FFFFFF"), (560, 120, 1.0, SAGE)]:
        b.append(flower(x, y, sc, pe, TERRA if pe == BUTTER else BUTTER))
    b.append(scatter(w, h, 12, 77, x_max=680))
    b.append(heart(1140, 64, 1.1, TERRA) + heart(724, 560, 0.9, BLUSH) + sparkle(1150, 570, 1.3) + sparkle(716, 70, 1.0))
    b.append(f'<rect x="4" y="4" width="{w - 8}" height="{h - 8}" fill="none" stroke="{INK}" stroke-width="8"/>')
    return svg(w, h, "".join(b), "Undangan pernikahan")


def cover_art():
    """Square (1:1) sample for the home cover photo; no drawn border, since
    the invitation adds a torn-paper edge and grain on top."""
    w = h = 600
    b = [paper_bg(w, h, BLUSH_LIGHT)]
    b.append(f'<circle cx="300" cy="330" r="220" fill="#FFFFFF" {LINE}/>')
    for x, y, sc, pe in [(96, 150, 1.7, BLUSH), (150, 96, 1.2, BUTTER), (505, 170, 1.5, "#FFFFFF"), (455, 110, 1.1, SAGE)]:
        b.append(flower(x, y, sc, pe, TERRA if pe == BUTTER else BUTTER))
    b.append(leaf(70, 210, 1.5, -60) + leaf(540, 230, 1.5, 60))
    b.append(scatter(w, h, 12, 91))
    b.append(couple(300, 300, 1.85))
    b.append(sprig(70, 600, 2.2, -12) + sprig(530, 600, 2.2, 12))
    return svg(w, h, "".join(b), "Ilustrasi sampul: mempelai bergandengan tangan")


SCENES = [
    scene_string_lights, scene_balloon, scene_picnic, scene_umbrella, scene_ring_box,
    scene_sunset, scene_coffee, scene_letter, scene_flower_frame, scene_calendar,
]


def main():
    (OUT / "doodle").mkdir(parents=True, exist_ok=True)
    (OUT / "couple").mkdir(parents=True, exist_ok=True)
    (OUT / "gallery").mkdir(parents=True, exist_ok=True)

    (OUT / "doodle" / "floral-envelope.svg").write_text(floral_envelope())
    (OUT / "couple" / "groom.svg").write_text(portrait("groom"))
    (OUT / "couple" / "bride.svg").write_text(portrait("bride"))
    (OUT / "og-art.svg").write_text(og_art())
    (OUT / "couple" / "cover.svg").write_text(cover_art())

    for i, fn in enumerate(SCENES, start=1):
        body, title = fn()
        body.append(f'<rect x="1.5" y="1.5" width="{W - 3}" height="{H - 3}" fill="none" stroke="{INK}" stroke-width="3"/>')
        (OUT / "gallery" / f"gallery-{i}.svg").write_text(svg(W, H, "".join(body), title))
        print(f"gallery-{i}.svg  {title}")


if __name__ == "__main__":
    main()
