"""Code-synthesized single BGM + auto-synced SFX for each rendered video.
python3 audio.py id1 id2 ...  (reads out/<id>.mp4 + out/<id>.json, writes final/<id>.mp4)
"""
import sys, os, json, subprocess, hashlib
import numpy as np
D = os.path.dirname(os.path.abspath(__file__)); SR = 44100
os.makedirs(f"{D}/final", exist_ok=True); os.makedirs(f"{D}/wav", exist_ok=True)

def mtof(n): return 440.0 * 2 ** ((n - 69) / 12)
def env_ad(n, a, d):
    a = max(1, int(a * SR)); e = np.exp(-np.arange(n) / (d * SR)); e[:a] *= np.linspace(0, 1, a); return e
def lp(x, cut):
    a = np.exp(-2 * np.pi * cut / SR); y = np.empty_like(x); s = 0.0
    for i in range(len(x)): s = (1 - a) * x[i] + a * s; y[i] = s
    return y
def lp_fast(x, cut):  # vectorized one-pole via lfilter-like cumulative trick (scipy-free approx using FFT)
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= 1 / np.sqrt(1 + (f / cut) ** 4); return np.fft.irfft(X, len(x))
def hp_fast(x, cut):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= (f / cut) ** 2 / np.sqrt(1 + (f / cut) ** 4); return np.fft.irfft(X, len(x))
def add(buf, x, at):
    i = int(at * SR)
    if i >= len(buf): return
    x = x[: len(buf) - i]; buf[i:i + len(x)] += x

# ---------- instruments ----------
def pluck(f, dur, bright=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    x = sum((0.6 ** k) * np.sin(2 * np.pi * f * (k + 1) * t) for k in range(4)) * env_ad(n, .004, .25 * bright)
    return x * .5
def keys(f, dur):  # soft electric-piano
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t + .6 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 3)) * env_ad(n, .01, .9)
    return x * .35
def pad(f, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    x = sum(((2 * ((f * d * t) % 1) - 1)) for d in (1, 1.004, .996)) / 3
    e = np.minimum(1, t / .6) * np.minimum(1, (dur - t) / .6).clip(0)
    return lp_fast(x, 1400) * e * .22
def bass(f, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.tanh(1.6 * np.sin(2 * np.pi * f * t)) * env_ad(n, .005, .35)
    return x * .45
def square(f, dur, duty=.5, vol=.18):
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.where((f * t) % 1 < duty, 1.0, -1.0) * env_ad(n, .002, .12)
    return x * vol
def kick():
    n = int(.4 * SR); t = np.arange(n) / SR; f = 45 + 90 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * .9
def hat(r):
    n = int(.06 * SR); return hp_fast(r.standard_normal(n), 7000) * np.exp(-np.arange(n) / SR * 70) * .12
def clap(r):
    n = int(.22 * SR); x = r.standard_normal(n); x = hp_fast(lp_fast(x, 3000), 900); return x * np.exp(-np.arange(n) / SR * 18) * .35

def reverb(x, mix=.22):
    y = np.zeros_like(x)
    for dl, g in ((.0297, .7), (.0371, .68), (.0411, .66), (.0437, .64)):
        d = int(dl * SR); b = np.zeros_like(x); b[:] = x
        for k in range(1, 7):
            if d * k >= len(x): break
            b[d * k:] += x[:-d * k] * g ** k
        y += b
    y = lp_fast(y / 4, 6000)
    return x * (1 - mix) + y * mix

# ---------- BGM per style ----------
SCALES = {"maj": [0, 2, 4, 5, 7, 9, 11], "min": [0, 2, 3, 5, 7, 8, 10]}
def chord(root, scale, deg, octave=60):
    sc = SCALES[scale]; return [octave + root + sc[(deg + k) % 7] + 12 * ((deg + k) // 7) for k in (0, 2, 4)]

def bgm(style, dur, seed):
    r = np.random.default_rng(seed); n = int(dur * SR); mix = np.zeros(n)
    root = int(r.integers(0, 12)); root = root - 12 if root > 6 else root
    if style == "motion":
        bpm, scale, prog = 116, "maj", [0, 4, 5, 3]
    elif style == "explainer":
        bpm, scale, prog = 88, "maj", [0, 5, 3, 4]
    elif style == "3d":
        bpm, scale, prog = 76, "min", [0, 5, 2, 6]
    else:
        bpm, scale, prog = 132, "maj", [0, 3, 4, 0]
    beat = 60 / bpm; bar = beat * 4; drums = []
    nb = int(np.ceil(dur / bar)) + 1
    for b in range(nb):
        deg = prog[b % 4]; ch = chord(root, scale, deg); t0 = b * bar
        if style == "3d":
            for m in ch: add(mix, pad(mtof(m - 12), bar + .6), t0)
            add(mix, bass(mtof(ch[0] - 24), bar) * .7, t0)
            for k in range(8):
                if r.random() < .55: add(mix, keys(mtof(ch[k % 3] + 12), beat * 1.5) * .45, t0 + k * beat / 2)
            for k in range(4): drums.append((t0 + k * beat, "kick" if k % 2 == 0 else None))
        elif style == "interactive":
            for k in range(16):
                m = ch[k % 3] + 12 + (12 if k % 8 >= 6 else 0); add(mix, square(mtof(m), beat / 4 * .9, .25, .12), t0 + k * beat / 4)
            for k in range(4): add(mix, square(mtof(ch[0] - 12), beat * .9, .5, .14), t0 + k * beat)
            for k in range(4): drums.append((t0 + k * beat, "kick" if k % 2 == 0 else "clap"))
            for k in range(8): drums.append((t0 + k * beat / 2, "hat"))
        elif style == "explainer":
            for m in ch + [ch[0] + 11]: add(mix, keys(mtof(m), bar * .95) * .6, t0)
            for k in range(4): add(mix, bass(mtof(ch[0] - 24 + (7 if k == 2 else 0)), beat * .9) * .8, t0 + k * beat)
            for k in range(4): drums.append((t0 + k * beat, "kick" if k in (0, 2) else "clap"))
            for k in range(8): drums.append((t0 + k * beat / 2 + (beat * .08 if k % 2 else 0), "hat"))
        else:
            for m in ch: add(mix, pad(mtof(m), bar) * .6, t0)
            for k in range(8):
                m = ch[[0, 1, 2, 1, 2, 0, 1, 2][k]] + 12; add(mix, pluck(mtof(m), beat * .8), t0 + k * beat / 2)
            for k in range(8): add(mix, bass(mtof(ch[0] - 24), beat / 2 * .9) * .8, t0 + k * beat / 2)
            for k in range(4): drums.append((t0 + k * beat, "kick"))
            for k in (1, 3): drums.append((t0 + k * beat, "clap"))
            for k in range(8): drums.append((t0 + k * beat / 2 + beat / 4, "hat"))
    rr = np.random.default_rng(seed + 1); K = kick()
    for at, kind in drums:
        if kind is None or at >= dur: continue
        add(mix, K if kind == "kick" else clap(rr) if kind == "clap" else hat(rr), at)
    mix = reverb(mix, .25 if style in ("3d", "explainer") else .15)
    t = np.arange(n) / SR; mix *= np.minimum(1, t / .5) * np.minimum(1, (dur - t) / 1.2).clip(0)
    return mix

# ---------- SFX ----------
def sfx(kind, r):
    if kind == "pop":
        n = int(.12 * SR); t = np.arange(n) / SR; f = 500 + 900 * (1 - np.exp(-t * 40)); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 30) * .5
    if kind == "whoosh":
        n = int(.45 * SR); t = np.arange(n) / SR; x = r.standard_normal(n); x = lp_fast(hp_fast(x, 400), 3500); e = np.sin(np.pi * t / .45) ** 2; return x * e * .35
    if kind == "blip":
        a = square(880, .06, .5, .3); b = square(1320, .08, .5, .3); return np.concatenate([a, b])
    if kind == "tick":
        n = int(.03 * SR); return hp_fast(r.standard_normal(n), 2500) * np.exp(-np.arange(n) / SR * 150) * .4
    return np.zeros(10)

def motion_peaks(path, dur):
    w, h = 90, 160
    p = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", path, "-vf", f"scale={w}:{h},format=gray", "-f", "rawvideo", "-"], capture_output=True)
    fr = np.frombuffer(p.stdout, np.uint8).reshape(-1, h, w).astype(np.float32)
    d = np.abs(np.diff(fr, axis=0)).mean(axis=(1, 2)); d = np.concatenate([[0], d])
    sm = np.convolve(d, np.ones(3) / 3, "same"); med = np.median(sm) + 1e-3; cap = int(round(dur / 1.5)); peaks = []
    for i in np.argsort(-sm):
        t = i / 30
        if t < .6 or t > dur - .8 or sm[i] < med * 1.6 or sm[i] < .35: continue
        if all(abs(t - p) >= .8 for p in peaks): peaks.append(t)
        if len(peaks) >= cap: break
    peaks.sort()
    return peaks

BGM = "/home/claude/promo-tools/rank-video/bgm.m4a"; SFXD = "/home/claude/sfx"
def load(path):
    p = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True)
    return np.frombuffer(p.stdout, np.float32).astype(np.float64)
BG = load(BGM); BG /= max(1e-6, np.abs(BG).max())
SAMPLES = {k: load(f"{SFXD}/{k}.wav") for k in ["whoosh", "select_001", "select_003", "drop_002", "maximize_003", "pluck_001", "pluck_002", "confirmation_001", "confirmation_002", "switch5", "click_002"]}
for k in SAMPLES: SAMPLES[k] /= max(1e-6, np.abs(SAMPLES[k]).max())
KINDS = {"motion": ["whoosh", "drop_002", "select_003"], "explainer": ["pluck_001", "select_001", "pluck_002"], "3d": ["whoosh", "maximize_003"], "interactive": ["confirmation_001", "select_003", "switch5"]}
GAIN = {"whoosh": .55, "click_002": .5}

for id in sys.argv[1:]:
    meta = json.load(open(f"{D}/out/{id}.json", encoding="utf-8")); dur = float(meta["dur"]); cat = meta["cat"]
    seed = int(hashlib.md5(id.encode()).hexdigest()[:8], 16); n = int(dur * SR)
    span = len(BG) / SR - dur - .2; off = int((seed % 1000) / 1000 * max(0, span) * SR)
    music = BG[off:off + n].copy(); music = np.pad(music, (0, max(0, n - len(music))))
    t = np.arange(n) / SR; music *= np.minimum(1, t / .4) * np.minimum(1, (dur - t) / 1.2).clip(0)
    fx = np.zeros(n); peaks = motion_peaks(f"{D}/out/{id}.mp4", dur); ks = KINDS[cat]
    for i, pt in enumerate(peaks):
        k = ks[i % len(ks)]; add(fx, SAMPLES[k] * GAIN.get(k, .42), pt - (.1 if k == "whoosh" else 0))
    out = music * .6 + fx
    out = out / max(1e-6, np.abs(out).max()) * .89
    st = np.stack([out, out], 1)
    wav = f"{D}/wav/{id}.wav"; import wave
    with wave.open(wav, "wb") as wf:
        wf.setnchannels(2); wf.setsampwidth(2); wf.setframerate(SR); wf.writeframes((st * 32767).astype("<i2").tobytes())
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{D}/out/{id}.mp4", "-i", wav, "-map", "0:v", "-map", "1:a", "-c:v", "copy",
                    "-af", "loudnorm=I=-16:TP=-1.5", "-c:a", "aac", "-b:a", "128k", "-ar", "44100", "-shortest", "-movflags", "+faststart", f"{D}/final/{id}.mp4"], check=True)
    print(id, cat, "sfx", len(peaks), "off", round(off / SR, 1), flush=True)
