"""Music bed + sound effects for the explainers, synthesised from nothing.

    python scripts/gen-audio.py

Writes public/music/bed.wav and public/sfx/*.wav. Everything is generated
here, so there is no licence to track and no stock library to credit: change a
number, re-run, re-render.

The bed is built to sit UNDER a voice: no lead melody, nothing in 1-4 kHz for
long (that is where speech intelligibility lives), a pad that breathes on the
beat so the edit has a pulse to cut against. The composition ducks it further
while words are being spoken.
"""
import os
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rng = np.random.default_rng(7)


def write(path, x):
    import wave
    x = np.asarray(x, dtype=np.float64)
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    peak = np.max(np.abs(x)) or 1.0
    x = x / peak * 0.89  # -1 dBFS ceiling
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())
    print(f"{os.path.relpath(path, ROOT)}  {len(x) / SR:.2f}s")


def lp(x, hz, order=2):
    return sosfilt(butter(order, hz, "low", fs=SR, output="sos"), x, axis=0)


def hp(x, hz, order=2):
    return sosfilt(butter(order, hz, "high", fs=SR, output="sos"), x, axis=0)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x, axis=0)


def env(n, a, d, curve=4.0):
    """Attack/decay envelope over n samples (seconds for a, d)."""
    t = np.arange(n) / SR
    att = np.clip(t / max(a, 1e-4), 0, 1)
    dec = np.exp(-np.maximum(t - a, 0) * curve / max(d, 1e-4))
    return att * dec


def reverb(x, seconds=2.2, wet=0.25):
    n = int(SR * seconds)
    ir = rng.standard_normal((n, 2)) * np.exp(-np.linspace(0, 7, n))[:, None]
    ir = lp(ir, 6000)
    mono = x if x.ndim == 2 else np.stack([x, x], 1)
    tail = np.stack([fftconvolve(mono[:, c], ir[:, c])[: len(mono)] for c in range(2)], 1)
    tail /= np.max(np.abs(tail)) or 1
    return mono * (1 - wet) + tail * wet * np.max(np.abs(mono))


def note(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def saw_stack(freq, n, detune=0.12, voices=5):
    t = np.arange(n) / SR
    out = np.zeros((n, 2))
    for v in range(voices):
        cents = (v - (voices - 1) / 2) * detune * 100 / ((voices - 1) / 2 or 1)
        f = freq * 2 ** (cents / 1200)
        ph = rng.random()
        s = 2 * ((t * f + ph) % 1) - 1
        pan = 0.5 + 0.4 * (v / (voices - 1) - 0.5)
        out[:, 0] += s * (1 - pan)
        out[:, 1] += s * pan
    return out / voices


# ---------------------------------------------------------------- music bed
BPM = 96
BEAT = 60 / BPM
BARS = 24                  # 24 bars at 96 = 60 s, longer than any explainer
LEN = int(SR * BEAT * 4 * BARS)

# Am9 - Fmaj7 - Cmaj7 - G6, voiced low and close: warm, unresolved, not sad.
CHORDS = [
    [45, 52, 55, 59, 60],
    [41, 48, 52, 55, 57],
    [48, 52, 55, 59, 62],
    [43, 50, 55, 59, 64],
]

music = np.zeros((LEN, 2))
bar_n = int(SR * BEAT * 4)

# pad: detuned saws through a low-pass that opens slowly over the piece
for b in range(BARS):
    chord = CHORDS[b % 4]
    seg = np.zeros((bar_n, 2))
    for m in chord[1:]:
        seg += saw_stack(note(m), bar_n) * 0.22
    cutoff = 700 + 900 * (0.5 - 0.5 * np.cos(np.pi * min(b / 12, 1)))
    seg = lp(seg, cutoff, 2)
    fade = np.minimum(1, np.minimum(np.arange(bar_n), bar_n - np.arange(bar_n)) / (SR * 0.03))
    music[b * bar_n:(b + 1) * bar_n] += seg * fade[:, None]

# the breathe: pad ducks on every beat — the pulse the cuts sit on
beat_n = int(SR * BEAT)
duck = np.ones(LEN)
for k in range(0, LEN, beat_n):
    m = min(beat_n, LEN - k)
    duck[k:k + m] = 1 - 0.55 * np.exp(-np.arange(m) / (SR * 0.12))
music *= duck[:, None]

# sub bass: chord root, one note per half bar, soft sine
t_all = np.arange(LEN) / SR
for b in range(BARS):
    root = CHORDS[b % 4][0] - 12
    for half in range(2):
        s = b * bar_n + half * bar_n // 2
        n = bar_n // 2
        tt = np.arange(n) / SR
        tone = np.sin(2 * np.pi * note(root) * tt) * env(n, 0.01, 0.9, 2.5)
        music[s:s + n] += tone[:, None] * 0.55

# kick on 1 and 3, from bar 2 — the first bar is the pad alone, so the
# video can open quietly
def kick(n=int(SR * 0.4)):
    tt = np.arange(n) / SR
    f = 48 + 90 * np.exp(-tt * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.35, 5)

K = kick()
for b in range(1, BARS):
    for beat in (0, 2):
        s = b * bar_n + beat * beat_n
        music[s:s + len(K)] += K[:, None][: LEN - s] * 0.8

# hats: swung 8ths, band-passed noise, quiet — texture, not drums
def hat(n=int(SR * 0.06)):
    return bp(rng.standard_normal(n), 7000, 14000) * env(n, 0.001, 0.05, 6)

H = hat()
swing = 0.08 * BEAT
for b in range(2, BARS):
    for e in range(8):
        s = int(b * bar_n + e * beat_n / 2 + (swing if e % 2 else 0) * SR)
        if s + len(H) < LEN:
            g = 0.12 if e % 2 else 0.18
            music[s:s + len(H)] += np.stack([H * g * 0.8, H * g], 1)

# pluck: one sparse figure every two bars, high and short — a glint, not a tune
def pluck(freq, n=int(SR * 0.5)):
    tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * tt) + 0.3 * np.sin(2 * np.pi * freq * 2 * tt)
    return s * env(n, 0.002, 0.45, 6)

for b in range(4, BARS, 2):
    chord = CHORDS[b % 4]
    for i, (beat, m) in enumerate([(1.5, chord[3] + 12), (2.5, chord[4] + 12), (3.25, chord[2] + 24)]):
        s = int(b * bar_n + beat * beat_n)
        p = pluck(note(m))
        pan = [0.3, 0.7, 0.5][i]
        music[s:s + len(p)] += np.stack([p * (1 - pan), p * pan], 1)[: LEN - s] * 0.12

music = hp(music, 30)
music = reverb(music, 2.6, 0.22)
# keep the speech band clear: a gentle dip at 2.5 kHz
music = music - 0.35 * bp(music, 1800, 3600)
# fade in over the first beat, out over the last bar
fi = np.minimum(1, t_all / BEAT)
fo = np.minimum(1, (LEN / SR - t_all) / (BEAT * 4))
music *= (fi * fo)[:, None]
write(os.path.join(ROOT, "public/music/bed.wav"), np.tanh(music * 1.2))


# ---------------------------------------------------------------- sfx
def sfx(name, x):
    write(os.path.join(ROOT, f"public/sfx/{name}.wav"), x)


def sweep_noise(n, f0, f1, q=0.6):
    """Noise through a band-pass whose centre glides f0 -> f1 (block-wise)."""
    x = rng.standard_normal(n)
    out = np.zeros(n)
    blocks = 64
    edges = np.linspace(0, n, blocks + 1).astype(int)
    for i in range(blocks):
        f = f0 * (f1 / f0) ** (i / (blocks - 1))
        lo, hi = f * (1 - q / 2), min(f * (1 + q / 2), SR / 2 - 100)
        seg = bp(x[max(0, edges[i] - 2048):edges[i + 1]], lo, hi)
        out[edges[i]:edges[i + 1]] = seg[-(edges[i + 1] - edges[i]):]
    return out


# whoosh — the whip pan. Rises then falls, panned left->right.
n = int(SR * 0.42)
w = sweep_noise(n, 300, 5000) * np.sin(np.linspace(0, np.pi, n)) ** 2
pan = np.linspace(0.15, 0.85, n)
sfx("whoosh", np.stack([w * (1 - pan), w * pan], 1))

# slam — the black bar. A body thump plus a papery crack.
n = int(SR * 0.5)
tt = np.arange(n) / SR
thump = np.sin(2 * np.pi * np.cumsum(55 + 120 * np.exp(-tt * 40)) / SR) * env(n, 0.001, 0.4, 6)
crack = hp(rng.standard_normal(n), 2500) * env(n, 0.0005, 0.06, 6)
sfx("slam", reverb(thump * 0.9 + crack * 0.5, 0.8, 0.18))

# punch — back to camera. Short, bright, dry.
n = int(SR * 0.25)
tt = np.arange(n) / SR
click = hp(rng.standard_normal(n), 4000) * env(n, 0.0003, 0.02, 6)
body = np.sin(2 * np.pi * np.cumsum(90 + 200 * np.exp(-tt * 60)) / SR) * env(n, 0.001, 0.18, 6)
sfx("punch", click * 0.6 + body * 0.8)

# ink — a low swell that blooms into the cut
n = int(SR * 0.7)
s = lp(rng.standard_normal(n), 900) * np.linspace(0, 1, n) ** 2.5
s *= np.where(np.arange(n) > n * 0.85, np.linspace(1, 0, n)[::-1] * 0 + np.exp(-(np.arange(n) - n * 0.85) / (SR * 0.03)), 1)
sub = np.sin(2 * np.pi * 42 * np.arange(n) / SR) * np.linspace(0, 1, n) ** 3
sfx("ink", reverb(s * 0.8 + sub * 0.6, 1.2, 0.3))

# thermal — the camera "heats" into animation: a filtered rise into a soft hit
n = int(SR * 0.8)
r = sweep_noise(n, 200, 3000, 0.4) * np.linspace(0, 1, n) ** 3
tone = np.sin(2 * np.pi * np.cumsum(np.linspace(110, 440, n)) / SR) * np.linspace(0, 1, n) ** 4 * 0.4
sfx("thermal", reverb(r + tone, 1.6, 0.3))

# pop — a term landing in the formula. Tiny pitched tick.
n = int(SR * 0.12)
tt = np.arange(n) / SR
p = np.sin(2 * np.pi * 1300 * tt * (1 - tt * 2)) * env(n, 0.0005, 0.08, 7)
sfx("pop", p)

# hit — the answer landing. Pop + low thump + shimmer tail.
n = int(SR * 1.2)
tt = np.arange(n) / SR
low = np.sin(2 * np.pi * np.cumsum(60 + 80 * np.exp(-tt * 30)) / SR) * env(n, 0.001, 0.5, 5)
shim = sum(np.sin(2 * np.pi * f * tt) for f in (1760, 2217, 2637)) / 3 * env(n, 0.003, 1.0, 4) * 0.3
sfx("hit", reverb(low + shim + hp(rng.standard_normal(n), 3000) * env(n, 0.0005, 0.03, 6) * 0.4, 1.8, 0.3))

# type — one keystroke. The composition plays it per word typed.
n = int(SR * 0.05)
k = bp(rng.standard_normal(n), 1500, 6000) * env(n, 0.0002, 0.025, 6)
sfx("type", k)
