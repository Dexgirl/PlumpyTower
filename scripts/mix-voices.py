#!/usr/bin/env python3
"""PLUMPY: turn the ElevenLabs voice pack into finished game clips.

For every recorded line: trim the silence, place its sound effects (on a word, before, after or
under the line, using the word timings ElevenLabs sent back), even out the loudness, soft-limit
the peaks, fade the edges, and encode a small mp3.

usage:
  python3 -I scripts/mix-voices.py voice-pack.json [voice-pack-2.json ...] --script voice/voice-script.json \
      --out build/voices [--preview preview.mp3] [--kbps 48]
"""
import argparse, base64, json, re, subprocess, sys
import numpy as np

SR = 44100
TARGET_RMS_DB = -16.5     # speech level of every finished clip (active parts), about -17 LUFS
CEIL = 0.87               # peak ceiling after the soft limiter (about -1.2 dBFS, room for mp3 overshoot)
SFX_REL = 0.85            # a sound effect at vol 1 sits a little under the voice


def decode(b):
    p = subprocess.run(['ffmpeg', '-v', 'error', '-i', 'pipe:0', '-f', 'f32le', '-ac', '1', '-ar', str(SR), 'pipe:1'],
                       input=b, capture_output=True, check=True)
    return np.frombuffer(p.stdout, dtype=np.float32).astype(np.float64)


def encode(x, path, kbps):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-i', 'pipe:0',
                    '-c:a', 'libmp3lame', '-b:a', f'{kbps}k', path], input=x.astype(np.float32).tobytes(), check=True)


def data_uri(u):
    return base64.b64decode(u.split(',', 1)[1])


def active_rms(x, frame=1024):
    n = len(x) // frame
    if n == 0:
        return float(np.sqrt(np.mean(x ** 2)) + 1e-9)
    r = np.sqrt((x[:n * frame].reshape(n, frame) ** 2).mean(1))
    thr = max(r.max() * 0.12, 10 ** (-48 / 20))
    act = r[r >= thr]
    return float(np.sqrt((act ** 2).mean()) + 1e-9) if len(act) else float(r.mean() + 1e-9)


def bounds(x, thr_db=-46, pad_in=0.03, pad_out=0.06):
    idx = np.where(np.abs(x) > 10 ** (thr_db / 20))[0]
    if not len(idx):
        return 0, len(x)
    return max(0, idx[0] - int(pad_in * SR)), min(len(x), idx[-1] + int(pad_out * SR))


def fade(x, ms_in=5, ms_out=30):
    x = x.copy()
    a, b = min(len(x), int(ms_in * SR / 1000)), min(len(x), int(ms_out * SR / 1000))
    if a:
        x[:a] *= np.linspace(0, 1, a)
    if b:
        x[-b:] *= np.linspace(1, 0, b)
    return x


def soft_limit(x, t=0.75):
    y = x.copy()
    m = np.abs(y) > t
    y[m] = np.sign(y[m]) * (t + (1 - t) * np.tanh((np.abs(y[m]) - t) / (1 - t)))
    pk = np.abs(y).max() if len(y) else 0
    return y * (CEIL / pk) if pk > CEIL else y


def words_of(text):
    return [w.strip("'") for w in re.split(r"[^A-Za-z0-9']+", re.sub(r'\[[^\]]*\]', ' ', text)) if w.strip("'")]


def word_time(cue, words, text, dur):
    """seconds into the (untrimmed) clip where cue['at'] is said, or None"""
    target, n = cue['at'].lower(), cue.get('n', 1)
    if words:
        hits = [w for w in words if w[0].lower() == target]
        if len(hits) >= n:
            return hits[n - 1][1], 'timed'
    # no timings: estimate from where the word sits in the text
    ws = words_of(text)
    total = sum(len(w) + 1 for w in ws) or 1
    pos, seen = 0, 0
    for w in ws:
        if w.lower() == target:
            seen += 1
            if seen == n:
                return 0.1 + (pos / total) * max(0.1, dur - 0.2), 'estimated'
        pos += len(w) + 1
    return None, 'missing'


def envelope(x, hop=0.01):
    h = int(hop * SR)
    n = len(x) // h
    return np.sqrt((x[:n * h].reshape(n, h) ** 2).mean(1)) if n else np.zeros(1)


def snap_onset(env, t, win=0.35, hop=0.01):
    """nearest point near t where speech starts after a quieter moment (timings from v3 can drift)"""
    thr = env.max() * 0.15
    lo, hi = max(1, int((t - win) / hop)), min(len(env) - 1, int((t + win) / hop))
    best = None
    for i in range(lo, hi):
        if env[i] >= thr and env[i - 1] < thr and (best is None or abs(i * hop - t) < abs(best - t)):
            best = i * hop
    return best if best is not None else t


def quiet_point(env, t, back=0.45, hop=0.01):
    """the quietest moment just before t (the pause before a word): where a gap can open"""
    lo, hi = max(0, int((t - back) / hop)), max(1, int(t / hop))
    seg = env[lo:hi]
    return (lo + int(np.argmin(seg))) * hop if len(seg) else t


def mix_line(line, voice, words, sfx, notes, gain_db=0.0):
    a, b = bounds(voice)
    v = voice[a:b]
    shift = a / SR                                   # word timings move by the trimmed lead-in
    v = v * (10 ** (TARGET_RMS_DB / 20) / active_rms(v))
    cues = line.get('sfx', [])
    env = envelope(v)
    # "insert" cues open a gap in the voice before their word, so the sound plays in the clear
    gaps = []
    for c in cues:
        if c.get('insert') and c['sfx'] in sfx:
            wt, how = word_time(c, words, line['text_v3'], len(voice) / SR)
            if wt is None:
                notes.append(f"{line['id']}: word '{c['at']}' not found for a gap"); continue
            cut = quiet_point(env, snap_onset(env, wt - shift))
            gaps.append((cut, len(sfx[c['sfx']]) / SR + 0.12, c))
    gaps.sort(key=lambda g: g[0])
    pieces, prev, moved = [], 0, 0.0
    gap_at = {}
    for cut, glen, c in gaps:
        i = int(cut * SR)
        pieces += [v[prev:i], np.zeros(int(glen * SR))]
        gap_at[id(c)] = cut + moved + 0.06
        moved += glen; prev = i
    if gaps:
        pieces.append(v[prev:])
        v = np.concatenate(pieces)
    def later(t):                                    # a time in the original voice -> after the gaps
        return t + sum(g for cut, g, _ in gaps if cut <= t)
    vdur = len(v) / SR
    layers = []                                      # (start seconds, signal)
    placed = []
    vstart = 0.0
    for c in cues:                                   # sounds that play first push the voice later
        if c['at'] == 'before' and c['sfx'] in sfx:
            s = sfx[c['sfx']]
            vstart = max(vstart, len(s) / SR - min(0.35, 0.4 * len(s) / SR))
    for c in cues:
        s = sfx.get(c['sfx'])
        if s is None:
            notes.append(f"{line['id']}: sound {c['sfx']} missing")
            continue
        vol = c.get('vol', 0.45 if c['at'] == 'under' else 0.8)
        s = s * (10 ** (TARGET_RMS_DB / 20) / active_rms(s)) * vol * SFX_REL
        if c['at'] == 'before':
            t = vstart - (len(s) / SR - min(0.35, 0.4 * len(s) / SR))
        elif c['at'] == 'after':
            t = vstart + vdur - 0.12
        elif c['at'] == 'under':
            reps = int(np.ceil((vdur + 0.3) * SR / len(s)))
            s = np.tile(s, reps)[:int((vdur + 0.3) * SR)]
            s = fade(s, 40, 300)
            t = vstart
        elif id(c) in gap_at:
            t = vstart + gap_at[id(c)]
        else:
            wt, how = word_time(c, words, line['text_v3'], len(voice) / SR)
            if wt is None:
                notes.append(f"{line['id']}: word '{c['at']}' not found, sound put at the start")
                wt, how = shift, 'missing'
            w0 = snap_onset(env, wt - shift)
            t = vstart + later(w0) - c.get('lead', 0.12)
            if how == 'estimated':
                notes.append(f"{line['id']}: no word timings, '{c['at']}' placed by estimate")
        layers.append((t, fade(s, 4, 60)))
        placed.append([c['sfx'], c['at']])
    start = min([0.0] + [t for t, _ in layers])      # a sound may start before the voice
    off = -start
    end = max([vstart + vdur] + [t + len(s) / SR for t, s in layers]) + off
    out = np.zeros(int(np.ceil(end * SR)) + 1)
    i = int(round((vstart + off) * SR)); out[i:i + len(v)] += v
    for t, s in layers:
        i = int(round((t + off) * SR)); out[i:i + len(s)] += s[:len(out) - i]
    for k, (t, _) in enumerate(layers):
        placed[k].append(round(t + off, 2))
    placed.append(['voice', 'start', round(vstart + off, 2)])
    line['_placed'] = placed
    if gain_db > 0:                                  # lift a sparse line before limiting
        out *= 10 ** (gain_db / 20)
    out = soft_limit(out)
    if gain_db < 0:                                  # trim a hot line after limiting (mp3 overshoot)
        out *= 10 ** (gain_db / 20)
    return fade(out, 4, 40)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('packs', nargs='+')
    ap.add_argument('--script', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--preview')
    ap.add_argument('--kbps', type=int, default=48)
    ap.add_argument('--only', nargs='*')
    ap.add_argument('--boost', default='{}', help='JSON {id: dB} for lines that sound quiet (sparse lines: a cackle, a snore)')
    args = ap.parse_args()
    import os
    os.makedirs(args.out, exist_ok=True)
    script = json.load(open(args.script))
    clips, same, align, sfx_uris = {}, {}, {}, {}
    for p in args.packs:
        d = json.load(open(p))
        clips.update(d.get('clips', {}))
        same.update(d.get('same', {}))
        align.update(d.get('align', {}))
        sfx_uris.update(d.get('sfx', {}))
    sfx = {}
    for k, u in sfx_uris.items():
        s = decode(data_uri(u))
        a, b = bounds(s, -50, 0.0, 0.05)
        sfx[k] = s[a:b] if b > a else s
    boost = json.loads(args.boost)
    notes, report, preview = [], {}, []
    for line in script['lines']:
        lid = line['id']
        if args.only and lid not in args.only:
            continue
        src = lid if lid in clips else same.get(lid)
        if not src or src not in clips:
            continue
        voice = decode(data_uri(clips[src]))
        x = mix_line(line, voice, align.get(lid) or align.get(src), sfx, notes, boost.get(lid, 0.0))
        path = f"{args.out}/{lid}.mp3"
        encode(x, path, args.kbps)
        report[lid] = {'seconds': round(len(x) / SR, 2), 'sounds': [c['sfx'] for c in line.get('sfx', [])], 'placed': line.get('_placed', [])}
        if args.preview:
            preview += [x, np.zeros(int(0.55 * SR))]
    if args.preview and preview:
        encode(np.concatenate(preview), args.preview, 96)
    json.dump({'clips': report, 'notes': notes, 'sounds': sorted(sfx)}, open(f"{args.out}/report.json", 'w'), indent=1)
    print(f"mixed {len(report)} clips -> {args.out}  ({sum(len(r['sounds']) for r in report.values())} sounds placed)")
    for n in notes:
        print('  note:', n)


if __name__ == '__main__':
    main()
