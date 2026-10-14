// ===================== MOUNTS =====================
// Story mode: the plate your tower stands on rides on the villain's pet (VILLAIN_MOUNT in villains.js).
// 10 creature types, recoloured with each villain's colours and dressed with their own decorations.
// Drawn in "plate space": x = 0 under the plate's centre, y = 0 at the plate's underside, y = D on the lair floor.
// When the plate tips, the top of the creature follows it and the feet stay on the floor (the body bends in between).
// Mounts.draw(g, spec, state) draws the creature and returns the front layer (hands/claws over the plate rim), drawn after the plate.
const Mounts = (() => {
  const INK = '#1b1024', TAU = Math.PI * 2;
  const MOUTH = '#5a1530', TONGUE = '#ff7aa8', SWEAT = '#9fe3ff', GOLD = '#ffcf3a';
  const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const hex = (a) => '#' + a.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, t) => { const A = rgb(a), B = rgb(b); return hex(A.map((v, i) => v + (B[i] - v) * t)); };
  const shade = (h, k) => hex(rgb(h).map((v) => (k > 0 ? v + (255 - v) * k : v * (1 + k))));
  const rgba = (h, a) => `rgba(${rgb(h).join(',')},${a})`;
  const dist = (a, b) => { const A = rgb(a), B = rgb(b); return Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]); };
  const luma = (h) => { const [r, g, b] = rgb(h); return (r * 0.3 + g * 0.59 + b * 0.11) / 255; };
  const hash = (i, s = 1) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const TYPES = {
    slime: { emoji: '🫠', word: 'slime' },
    turtle: { emoji: '🐢', word: 'turtle' },
    crab: { emoji: '🦀', word: 'crab' },
    golem: { emoji: '🗿', word: 'golem' },
    walrus: { emoji: '🦭', word: 'walrus' },
    snail: { emoji: '🐌', word: 'snail' },
    beetle: { emoji: '🪲', word: 'beetle' },
    whale: { emoji: '🐋', word: 'sky whale', float: true },
    cloud: { emoji: '☁️', word: 'cloud', float: true },
    mech: { emoji: '🤖', word: 'mech' },
  };

  function palette(type, acc, body, d) {
    let main = { golem: mix('#9a93aa', acc, 0.3), walrus: mix('#b48a76', acc, 0.32), snail: mix('#f6e6d2', acc, 0.32), cloud: mix('#ffffff', acc, 0.2), mech: mix('#b9bdcc', acc, 0.2) }[type] || acc;
    if (d.has('void')) main = '#2c1c52';
    let sec = body && dist(body, main) > 70 && luma(body) > 0.14 && luma(body) < 0.9 ? body : shade(acc, type === 'snail' ? -0.2 : -0.4);
    if (type === 'golem' || type === 'mech') sec = shade(main, -0.3);
    if (d.has('pumpkin')) sec = '#ff8a2a';
    if (d.has('crust')) sec = '#ffcf6b';
    return { main, dark: shade(main, -0.3), deep: shade(main, -0.6), light: shade(main, 0.45), sec, secDark: shade(sec, -0.32), acc, glow: luma(acc) > 0.45 ? acc : shade(acc, 0.4), belly: mix(main, '#fff4e4', 0.55) };
  }

  // a mount for one villain: entry = [type, name, decorations]
  function spec(key, entry, acc, cutBody, idx) {
    const [type, name, deco = ''] = entry;
    const d = new Set(deco.split(/\s+/).filter(Boolean));
    const hat = [...d].find((x) => x.startsWith('hat:'));
    return { key, type, name, d, hat: hat ? hat.slice(4) : null, face: -1, col: palette(type, acc, cutBody, d), seed: idx * 7.31, emoji: TYPES[type].emoji, word: TYPES[type].word };
  }

  // ---------- the bending pen: every point goes through map() ----------
  function pen(g, st, sp) {
    const top = st.plateY + 18, D = st.ground - top, a = st.angle || 0, ca = Math.cos(a), sa = Math.sin(a);
    const pvx = st.cx, pvy = st.plateY + 9, flip = sp.face, sq = st.squash || 0, float = Boolean(TYPES[sp.type].float);
    const wAt = (y) => (float || y <= 0 ? 1 : y >= D ? 0 : 1 - y / D);
    const map = (x, y) => {
      x *= flip;
      if (sq) x *= 1 + sq * Math.sin(Math.PI * clamp(y / D, 0, 1));
      const ux = st.cx + x, uy = top + y, w = wAt(y);
      if (!w || !a) return [ux, uy];
      const dx = ux - pvx, dy = uy - pvy;
      return [ux + (pvx + dx * ca - dy * sa - ux) * w, uy + (pvy + dx * sa + dy * ca - uy) * w];
    };
    const P = {
      g, D, flip, map, st, sp,
      m(x, y) { const p = map(x, y); g.moveTo(p[0], p[1]); },
      l(x, y) { const p = map(x, y); g.lineTo(p[0], p[1]); },
      q(x1, y1, x, y) { const a1 = map(x1, y1), p = map(x, y); g.quadraticCurveTo(a1[0], a1[1], p[0], p[1]); },
      c(x1, y1, x2, y2, x, y) { const a1 = map(x1, y1), a2 = map(x2, y2), p = map(x, y); g.bezierCurveTo(a1[0], a1[1], a2[0], a2[1], p[0], p[1]); },
      arc(x, y, rx, ry, a0 = 0, a1 = TAU, cont = false) {
        const n = Math.max(6, Math.ceil((Math.abs(a1 - a0) / TAU) * 36));
        for (let i = 0; i <= n; i++) { const th = a0 + ((a1 - a0) * i) / n, p = map(x + Math.cos(th) * rx, y + Math.sin(th) * ry); if (i || cont) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); }
      },
      fs(fill, lw = 3, col = INK) { if (fill) { g.fillStyle = fill; g.fill(); } if (lw) { g.lineWidth = lw; g.strokeStyle = col; g.stroke(); } },
      shape(path, fill, lw = 3.4) { g.beginPath(); path(); g.closePath(); P.fs(fill, lw); },
      ell(x, y, rx, ry, fill, lw = 3) { g.beginPath(); P.arc(x, y, Math.max(0.3, rx), Math.max(0.3, ry)); g.closePath(); P.fs(fill, lw); },
      poly(pts, fill, lw = 3) { g.beginPath(); pts.forEach(([x, y], i) => (i ? P.l(x, y) : P.m(x, y))); g.closePath(); P.fs(fill, lw); },
      line(pts, col, lw) { g.beginPath(); pts.forEach(([x, y], i) => (i ? P.l(x, y) : P.m(x, y))); g.strokeStyle = col; g.lineWidth = lw; g.stroke(); },
      curve(x0, y0, x1, y1, x, y, col, lw) { g.beginPath(); P.m(x0, y0); P.q(x1, y1, x, y); g.strokeStyle = col; g.lineWidth = lw; g.stroke(); },
      limb(pts, w, col) { P.line(pts, INK, w + 5.5); P.line(pts, col, w); },
      rrPath(x, y, w, h, r) {
        r = Math.min(r, w / 2, h / 2);
        P.m(x + r, y); P.l(x + w - r, y); P.arc(x + w - r, y + r, r, r, -Math.PI / 2, 0, true); P.l(x + w, y + h - r);
        P.arc(x + w - r, y + h - r, r, r, 0, Math.PI / 2, true); P.l(x + r, y + h); P.arc(x + r, y + h - r, r, r, Math.PI / 2, Math.PI, true);
        P.l(x, y + r); P.arc(x + r, y + r, r, r, Math.PI, Math.PI * 1.5, true);
      },
      rr(x, y, w, h, r, fill, lw = 3) { g.beginPath(); P.rrPath(x, y, w, h, r); g.closePath(); P.fs(fill, lw); },
      text(s, x, y, size, col, outline) {
        const p = map(x, y);
        g.save(); g.translate(p[0], p[1]); g.rotate(a * wAt(y)); g.font = `900 ${size}px Nunito, "Arial Rounded MT Bold", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
        if (outline) { g.lineWidth = 3; g.strokeStyle = outline; g.strokeText(s, 0, 0); }
        g.fillStyle = col; g.fillText(s, 0, 0); g.restore();
      },
      clip(path, draw) { g.save(); g.beginPath(); path(); g.closePath(); g.clip(); draw(); g.restore(); },
      star(x, y, r, n, fill, lw = 2, inner = 0.45, rot = -Math.PI / 2) {
        g.beginPath();
        for (let i = 0; i < n * 2; i++) { const rr = i % 2 ? r * inner : r, th = rot + (i * Math.PI) / n; i ? P.l(x + Math.cos(th) * rr, y + Math.sin(th) * rr) : P.m(x + Math.cos(th) * rr, y + Math.sin(th) * rr); }
        g.closePath(); P.fs(fill, lw);
      },
    };
    return P;
  }

  // feet step in pairs when the plate slides (st.walk = stride phase, st.speed = 0..1)
  const stepOf = (st, i, stride = 9, lift = 8) => { const ph = st.walk + i * Math.PI; return { dx: Math.sin(ph) * stride * st.speed, up: Math.max(0, -Math.cos(ph)) * lift * st.speed }; };
  const T = (st) => (st.reduce ? 0 : st.t);

  // ---------- face: eyes + mouth, with moods ----------
  // moods: idle · wince (a PERFECT landed on it) · strain (tall tower) · startled (market event / last candle) · scared (villain falling)
  //        laugh (your tower fell) · dizzy (villain beaten)
  function face(P, st, sp, x, y, s, o = {}) {
    const d = sp.d, mood = st.mood, t = T(st), g = P.g;
    const big = mood === 'startled' || mood === 'scared';
    const er = 6.2 * s * (big ? 1.2 : 1) * (o.eye || 1);
    const eyes = o.eyes || (o.side ? [[x - 1 * s, y + 0.5 * s], [x + 11 * s, y]] : [[x - 10.5 * s, y], [x + 10.5 * s, y]]);
    const lx = clamp((st.look ? st.look.x : 0) * P.flip, -1, 1), ly = st.look ? st.look.y : -0.5;
    const shiv = mood === 'scared' && !st.reduce ? Math.sin(st.t / 26) * 0.9 : 0;
    const asleep = d.has('asleep') && mood === 'idle';
    const closed = (st.blink || asleep) && !['laugh', 'wince', 'dizzy'].includes(mood);
    if (o.brows || mood === 'scared' || mood === 'strain') {
      const k = (o.brows === 'angry' && mood !== 'scared' && mood !== 'strain' ? 1 : -1) * er * 0.38;
      eyes.forEach(([ex, ey], i) => { const inner = i === 0 ? 1 : -1, by = ey - er * 1.6; P.line([[ex + shiv - inner * er * 0.95, by - k], [ex + shiv + inner * er * 0.95, by + k]], INK, 2.6 * Math.max(0.8, s * 0.8)); });
    }
    eyes.forEach(([ex, ey], i) => {
      ex += shiv;
      const r = er * (o.side && i === 0 ? 0.86 : 1), lw = 2.3 * Math.max(0.85, s * 0.85);
      if (d.has('eyepatch') && i === 0) {
        P.line([[ex - r * 1.6, ey - r * 1.5], [ex + r * 3.2, ey - r * 0.4]], INK, 2);
        P.ell(ex, ey, r * 1.05, r * 1.0, INK, 0); return;
      }
      if (mood === 'laugh') { P.line([[ex - r, ey + r * 0.35], [ex, ey - r * 0.6], [ex + r, ey + r * 0.35]], INK, lw + 0.4); return; }
      if (mood === 'wince') { const k = i === 0 ? 1 : -1; P.line([[ex - k * r * 0.8, ey - r * 0.75], [ex + k * r * 0.7, ey], [ex - k * r * 0.8, ey + r * 0.75]], INK, lw + 0.4); return; }
      if (mood === 'dizzy') {
        g.beginPath();
        for (let j = 0; j <= 22; j++) { const th = (j / 22) * TAU * 1.8 + t / 140, rr = (r * j) / 22; j ? P.l(ex + Math.cos(th) * rr, ey + Math.sin(th) * rr) : P.m(ex, ey); }
        g.strokeStyle = INK; g.lineWidth = 2; g.stroke(); return;
      }
      if (closed) { P.curve(ex - r, ey, ex, ey + r * 0.7, ex + r, ey, INK, lw + 0.3); return; }
      if (d.has('laser')) P.ell(ex, ey, r * 1.7, r * 1.7, 'rgba(255,40,40,0.28)', 0);
      P.ell(ex, ey, r, r * 1.1, o.white || '#ffffff', lw);
      const pr = r * (big ? 0.34 : 0.55), px = ex + lx * r * 0.36, py = ey + ly * r * 0.36;
      P.ell(px, py, pr, pr * 1.06, d.has('laser') ? '#ff2b2b' : INK, 0);
      P.ell(px - pr * 0.35, py - pr * 0.42, pr * 0.34, pr * 0.34, '#ffffff', 0);
      if (d.has('sleepy') || (mood === 'strain' && i === eyes.length - 1)) { g.beginPath(); P.arc(ex, ey, r + 0.7, r * 1.1 + 0.7, Math.PI, TAU); g.closePath(); P.fs(o.lid || sp.col.main, lw); }
    });
    if (d.has('shades') && mood !== 'dizzy') {
      const [a, b] = [eyes[0], eyes[eyes.length - 1]], r = er * 1.1;
      P.rr(a[0] - r * 1.25, a[1] - r * 0.85, b[0] - a[0] + r * 2.5, r * 1.6, 2.5, INK, 0);
      P.rr(a[0] - r * 0.7, a[1] - r * 0.55, r * 0.5, r * 0.4, 0.5, '#ffffff', 0); P.rr(b[0] - r * 0.7, b[1] - r * 0.55, r * 0.5, r * 0.4, 0.5, '#ffffff', 0);
    }
    // mouth
    const [mx, my] = o.mouth || (o.side ? [x + 9 * s, y + 11 * s] : [x, y + 11 * s]);
    const ms = s * (o.mouthK || 1), mlw = 2.4 * Math.max(0.85, s * 0.8);
    if (mood === 'laugh') {
      g.beginPath(); P.m(mx - 7 * ms, my - 1.5 * ms); P.l(mx + 7 * ms, my - 1.5 * ms); P.q(mx + 7 * ms, my + 9 * ms, mx, my + 9 * ms); P.q(mx - 7 * ms, my + 9 * ms, mx - 7 * ms, my - 1.5 * ms); g.closePath(); P.fs(MOUTH, mlw);
      P.ell(mx, my + 6 * ms, 3.6 * ms, 2.2 * ms, TONGUE, 0);
      if (Math.floor(t / 320) % 2 === 0) P.text('HA', x + (o.side ? 26 : 30) * s, y - 14 * s, 11 + 3 * s, '#ffffff', INK);
    } else if (mood === 'startled') P.ell(mx, my + 2 * ms, 3 * ms, 3.8 * ms, MOUTH, mlw);
    else if (mood === 'wince') {
      P.rr(mx - 7 * ms, my - 1 * ms, 14 * ms, 7 * ms, 2.5 * ms, '#ffffff', mlw);
      P.line([[mx - 2.3 * ms, my - ms], [mx - 2.3 * ms, my + 6 * ms]], INK, 1.4); P.line([[mx + 2.3 * ms, my - ms], [mx + 2.3 * ms, my + 6 * ms]], INK, 1.4);
    } else if (mood === 'scared' || mood === 'strain' || mood === 'dizzy') P.line([[mx - 7 * ms, my + 2 * ms], [mx - 3.5 * ms, my], [mx, my + 2 * ms], [mx + 3.5 * ms, my], [mx + 7 * ms, my + 2 * ms]], INK, mlw);
    else if (asleep) P.ell(mx, my + 1.5 * ms, 2.4 * ms, 2 * ms, MOUTH, mlw * 0.8);
    else { g.beginPath(); P.m(mx - 6 * ms, my); P.q(mx, my + 6 * ms, mx + 6 * ms, my); g.strokeStyle = INK; g.lineWidth = mlw; g.stroke(); }
    if (d.has('teeth') && mood !== 'laugh' && mood !== 'wince') for (const k of [-1, 1]) P.poly([[mx + k * 4.6 * ms, my + 1.2 * ms], [mx + k * 3 * ms, my + 6 * ms], [mx + k * 1.3 * ms, my + 2.3 * ms]], '#ffffff', 1.4);
    if (d.has('drool') && mood !== 'scared') { const L = 3 + ((t / 45) % 16) * ms; P.line([[mx + 5 * ms, my + 1 * ms], [mx + 5 * ms, my + L]], 'rgba(200,250,255,0.9)', 2.6); P.ell(mx + 5 * ms, my + L + 1.5, 2.4, 3, '#c8faff', 1.4); }
    if (mood !== 'scared' && mood !== 'dizzy' && o.blush !== false) for (const [ex, ey] of o.side ? [eyes[1]] : eyes) P.ell(ex + (o.side ? 3 * s : 0), ey + er * 1.45, er * 0.75, er * 0.4, 'rgba(255,110,160,0.45)', 0);
    if (d.has('tear') || mood === 'scared' || mood === 'strain') { // tear / sweat drop
      const [ex, ey] = d.has('tear') && mood !== 'strain' && mood !== 'scared' ? [eyes[0][0], eyes[0][1] + er * 1.2 + ((t / 70) % 8)] : [x + (o.side ? 22 : 20) * s, y - 8 * s + ((t / 60) % 7)];
      g.beginPath(); P.m(ex, ey - 4.5 * s); P.q(ex + 3.4 * s, ey + 1 * s, ex, ey + 3.2 * s); P.q(ex - 3.4 * s, ey + 1 * s, ex, ey - 4.5 * s); g.closePath(); P.fs(SWEAT, 1.5);
    }
    if (asleep || d.has('sleepy')) { const k = (t / 1800) % 1; P.text('z', x + 22 * s + k * 10, y - 12 * s - k * 22, 10 + k * 6, rgba('#ffffff', 1 - k), rgba(INK, 0.6 * (1 - k))); }
    if (mood === 'dizzy') for (let j = 0; j < 3; j++) { const th = t / 260 + (j * TAU) / 3; P.star(x + Math.cos(th) * 16 * s, y - 16 * s + Math.sin(th) * 4 * s, 4 * s, 5, GOLD, 1.3); }
  }

  // ---------- hats (side-on heads only): x, y = top of the head ----------
  function hat(P, kind, x, y, s, sp) {
    const c = sp.col, g = P.g;
    if (kind === 'cowboy') {
      P.ell(x, y + 1 * s, 17 * s, 3.6 * s, '#c4834a', 2.4);
      P.poly([[x - 8 * s, y + 1 * s], [x - 9 * s, y - 11 * s], [x - 3 * s, y - 13 * s], [x, y - 10 * s], [x + 3 * s, y - 13 * s], [x + 9 * s, y - 11 * s], [x + 8 * s, y + 1 * s]], '#b0713a', 2.4);
      P.line([[x - 8.4 * s, y - 2.5 * s], [x + 8.4 * s, y - 2.5 * s]], c.acc, 2.6 * s);
    } else if (kind === 'bicorne') {
      g.beginPath(); P.m(x - 19 * s, y + 1 * s); P.q(x, y - 27 * s, x + 19 * s, y + 1 * s); P.q(x, y - 5 * s, x - 19 * s, y + 1 * s); g.closePath(); P.fs('#2a2342', 2.4);
      P.curve(x - 15 * s, y - 2 * s, x, y - 19 * s, x + 15 * s, y - 2 * s, GOLD, 1.8);
      P.ell(x + 2 * s, y - 8 * s, 3.4 * s, 3.4 * s, c.acc, 1.6);
    } else if (kind === 'witch') {
      P.ell(x, y + 1 * s, 16 * s, 3.6 * s, '#3a2458', 2.4);
      g.beginPath(); P.m(x - 8 * s, y); P.q(x - 4 * s, y - 15 * s, x + 11 * s, y - 25 * s); P.q(x + 2 * s, y - 12 * s, x + 8 * s, y); g.closePath(); P.fs('#3a2458', 2.4);
      P.line([[x - 7.6 * s, y - 2.5 * s], [x + 7.8 * s, y - 2.5 * s]], c.acc, 2.4 * s);
    } else if (kind === 'crown') {
      P.poly([[x - 10 * s, y + 1 * s], [x - 11 * s, y - 11 * s], [x - 5 * s, y - 5 * s], [x, y - 14 * s], [x + 5 * s, y - 5 * s], [x + 11 * s, y - 11 * s], [x + 10 * s, y + 1 * s]], GOLD, 2.2);
      P.ell(x, y - 3 * s, 2.2 * s, 2.2 * s, '#ff4f9a', 1.3);
    } else if (kind === 'beanie') {
      g.beginPath(); P.m(x - 11 * s, y + 2 * s); P.q(x - 11 * s, y - 13 * s, x, y - 13 * s); P.q(x + 11 * s, y - 13 * s, x + 11 * s, y + 2 * s); g.closePath(); P.fs(c.acc, 2.4);
      for (let k = -2; k <= 2; k++) P.line([[x + k * 4 * s, y - 1 * s], [x + k * 4.4 * s, y - 10 * s + Math.abs(k) * 1.5 * s]], rgba(INK, 0.25), 1.4);
      P.rr(x - 12 * s, y - 1 * s, 24 * s, 6 * s, 3 * s, '#ffffff', 2.2);
      P.ell(x + 1 * s, y - 15 * s, 4.4 * s, 4.4 * s, '#ffffff', 2.2);
    } else if (kind === 'fedora') {
      P.ell(x, y + 1 * s, 15 * s, 3.4 * s, '#6b5a4a', 2.4);
      g.beginPath(); P.m(x - 8 * s, y); P.l(x - 7 * s, y - 10 * s); P.q(x, y - 6 * s, x + 7 * s, y - 10 * s); P.l(x + 8 * s, y); g.closePath(); P.fs('#6b5a4a', 2.4);
      P.line([[x - 7.8 * s, y - 2.5 * s], [x + 7.8 * s, y - 2.5 * s]], '#2b2420', 2.6 * s);
    }
  }

  // ---------- body decorations, painted inside the body outline ----------
  function decoBody(P, st, sp, path, box) {
    const c = sp.col, d = sp.d, [x0, y0, x1, y1] = box, W = x1 - x0, H = y1 - y0, t = T(st);
    const R = (i, k) => hash(i + sp.seed, k);
    const inside = (fn) => P.clip(path, fn);
    if (d.has('spots')) inside(() => { for (let i = 0; i < 11; i++) P.ell(x0 + W * R(i, 1), y0 + H * R(i, 2), 3.5 + 4 * R(i, 3), 3 + 3.4 * R(i, 4), rgba(shade(sp.type === 'turtle' ? c.sec : c.main, -0.5), 0.75), 0); });
    if (d.has('confetti')) inside(() => { const C = ['#ff4f9a', '#ffc93c', '#63e2e6', '#7b5cf0', '#2fbf71']; for (let i = 0; i < 16; i++) { const x = x0 + W * R(i, 1), y = y0 + H * R(i, 2); P.poly([[x - 3, y - 1.5], [x + 3, y - 2.5], [x + 3, y + 1.5], [x - 3, y + 2.5]], C[i % 5], 0); } });
    if (d.has('stripes')) inside(() => { for (let x = x0 - H; x < x1 + H; x += 15) P.line([[x, y1 + 6], [x + H * 0.5, y0 - 6]], rgba('#ffffff', 0.55), 5); });
    if (d.has('hazard')) inside(() => { for (let x = x0 - H, i = 0; x < x1 + H; x += 12, i++) P.line([[x, y1 - 4], [x + 9, y1 - 14]], i % 2 ? INK : '#ffd23f', 6.5); });
    if (d.has('stars')) inside(() => {
      P.ell((x0 + x1) / 2, (y0 + y1) / 2, W, H, rgba('#120a2e', d.has('void') ? 0 : 0.35), 0);
      for (let i = 0; i < 14; i++) { const k = 0.5 + 0.5 * Math.sin(t / 420 + i * 2.3); P.star(x0 + W * R(i, 1), y0 + H * R(i, 2), 1.4 + 2.6 * k * R(i, 3), 4, '#ffffff', 0, 0.35); }
    });
    if (d.has('glass')) inside(() => {
      P.ell((x0 + x1) / 2, (y0 + y1) / 2, W, H, 'rgba(255,255,255,0.2)', 0);
      for (let i = 0; i < 6; i++) { const x = x0 + W * (0.1 + 0.8 * R(i, 1)); P.line([[x, y0 - 4], [x + 10 - 20 * R(i, 2), y0 + H * 0.5], [x + 14 - 28 * R(i, 3), y1 + 4]], 'rgba(255,255,255,0.75)', 1.8); }
    });
    if (d.has('barnacles')) inside(() => { for (let i = 0; i < 9; i++) { const x = x0 + W * R(i, 1), y = y0 + H * (0.35 + 0.65 * R(i, 2)); P.ell(x, y, 3 + 2 * R(i, 3), 3 + 2 * R(i, 3), '#e6e0d4', 1.6); P.ell(x, y, 1.2, 1.2, INK, 0); } });
    if (d.has('patches')) inside(() => { for (let i = 0; i < 5; i++) P.ell(x0 + W * R(i, 5), y0 + H * R(i, 6), 6 + 6 * R(i, 7), 4 + 4 * R(i, 8), 'rgba(176,96,40,0.6)', 0); });
    if (d.has('moss')) inside(() => { for (let i = 0; i < 9; i++) P.ell(x0 + (W * (i + 0.5)) / 9, y0 + 3 + 4 * R(i, 9), 8 + 4 * R(i, 3), 6 + 3 * R(i, 4), i % 2 ? '#5fbf5a' : '#4aa64a', 0); });
    if (d.has('crack')) inside(() => { P.line([[x0 + W * 0.2, y0], [x0 + W * 0.26, y0 + H * 0.25], [x0 + W * 0.18, y0 + H * 0.4], [x0 + W * 0.25, y0 + H * 0.6]], INK, 2.2); P.line([[x1 - W * 0.15, y1], [x1 - W * 0.22, y1 - H * 0.3], [x1 - W * 0.14, y1 - H * 0.45]], INK, 2.2); });
    if (d.has('magma')) inside(() => {
      const pulse = 0.6 + 0.4 * Math.sin(t / 300);
      const cracks = [[[x0 + W * 0.15, y0], [x0 + W * 0.25, y0 + H * 0.3], [x0 + W * 0.18, y0 + H * 0.55], [x0 + W * 0.3, y1]], [[x1 - W * 0.12, y0 + H * 0.1], [x1 - W * 0.25, y0 + H * 0.4], [x1 - W * 0.16, y1]]];
      for (const cr of cracks) { P.line(cr, rgba('#ff5a1f', pulse), 6); P.line(cr, '#ffe066', 2.2); }
    });
    if (d.has('runes')) inside(() => { const RU = ['ᚠ', 'ᛟ', 'ᚱ', 'ᚷ']; RU.forEach((r, i) => P.text(r, x0 + W * (0.2 + i * 0.2), y1 - H * 0.2, 12, rgba(c.glow, 0.65 + 0.35 * Math.sin(t / 500 + i)))); });
    if (d.has('gold')) { P.g.save(); P.g.beginPath(); path(); P.g.closePath(); P.g.clip(); P.g.beginPath(); path(); P.g.closePath(); P.g.lineWidth = 8; P.g.strokeStyle = GOLD; P.g.stroke(); P.g.restore(); P.shape(path, null, 3.4); }
    if (d.has('star')) P.star((x0 + x1) / 2, y0 + H * 0.62, 10, 5, '#e3263f', 2.2);
    if (d.has('rip')) { P.text('RIP', (x0 + x1) / 2, y0 + H * 0.72, 13, rgba(INK, 0.55)); }
    if (d.has('chart')) { const bx = x0 + W * 0.62, by = y0 + H * 0.62; P.line([[bx - 14, by + 6], [bx - 6, by - 2], [bx, by + 3], [bx + 12, by - 10]], '#2fbf71', 3.6); P.poly([[bx + 13, by - 11], [bx + 6, by - 10], [bx + 12, by - 4]], '#2fbf71', 1.4); }
    if (d.has('badge')) P.star(x0 + W * 0.36, y0 + H * 0.5, 9, 6, GOLD, 2, 0.55);
    if (d.has('bolts')) for (const [x, y] of [[x0 + 8, y0 + 8], [x1 - 8, y0 + 8], [x0 + 8, y1 - 10], [x1 - 8, y1 - 10]]) P.ell(x, y, 2.6, 2.6, '#e8e9f0', 1.4);
    if (d.has('boba')) inside(() => { for (let i = 0; i < 12; i++) P.ell(x0 + W * (0.1 + 0.8 * R(i, 1)), y1 - 6 - H * 0.32 * R(i, 2), 4, 4, '#3b2418', 0); });
    if (d.has('fruit')) inside(() => { for (let i = 0; i < 5; i++) { const x = x0 + W * (0.15 + 0.7 * R(i, 3)), y = y0 + H * (0.45 + 0.4 * R(i, 4)), col = ['#ff9a3c', '#ff4f6a', '#ffe14d'][i % 3]; P.ell(x, y, 6, 6, col, 1.4); P.line([[x - 4, y], [x + 4, y]], 'rgba(255,255,255,0.8)', 1.2); P.line([[x, y - 4], [x, y + 4]], 'rgba(255,255,255,0.8)', 1.2); } });
  }

  // little things around the body (outside the outline)
  function decoAround(P, st, sp, box) {
    const c = sp.col, d = sp.d, [x0, y0, x1, y1] = box, t = T(st), W = x1 - x0;
    if (d.has('bow')) {
      const bx = x0 + W * 0.2, by = y0 + 10, col = '#ff4f9a';
      P.poly([[bx, by], [bx - 11, by - 7], [bx - 11, by + 7]], col, 2); P.poly([[bx, by], [bx + 11, by - 7], [bx + 11, by + 7]], col, 2); P.ell(bx, by, 3.4, 3.4, shade(col, -0.2), 2);
    }
    if (d.has('flame')) for (const [x, k] of [[x0 + 4, -1], [x1 - 4, 1]]) for (let j = 0; j < 3; j++) {
      const h = 16 + Math.sin(t / 120 + j * 2 + k) * 4 - j * 3, bx = x + k * j * 4, by = y0 + 18 + j * 9;
      P.poly([[bx - 5, by], [bx + k * 9, by - h * 0.55], [bx + k * 2, by - h], [bx + 5, by - 2]], j % 2 ? '#ffd23f' : '#ff6a00', 1.6);
    }
    if (d.has('horns')) for (const k of [-1, 1]) { const bx = k < 0 ? x0 + 10 : x1 - 10; P.poly([[bx - 6 * k, y0 + 14], [bx + 16 * k, y0 - 2], [bx + 4 * k, y0 + 24]], '#fff1c9', 2.4); }
    if (d.has('bubbles')) for (let i = 0; i < 5; i++) {
      const k = ((t / 2600 + i / 5) % 1), x = (i % 2 ? x1 : x0) + (i % 2 ? 6 : -6) + Math.sin(t / 400 + i) * 5, y = y0 + 50 - k * 60;
      P.ell(x, y, 3 + i % 3 * 1.5, 3 + i % 3 * 1.5, rgba('#ffffff', 0.25 * (1 - k)), 1.3); P.ell(x - 1.2, y - 1.2, 1, 1, rgba('#ffffff', 0.9 * (1 - k)), 0);
    }
    if (d.has('puffs')) for (let i = 0; i < 4; i++) {
      const k = ((t / 3000 + i / 4) % 1), x = (i % 2 ? x1 + 6 : x0 - 6) + (i % 2 ? 1 : -1) * k * 16, y = y0 + 40 - k * 46;
      P.ell(x, y, 5 + k * 10, 4 + k * 8, rgba('#d9c6ff', 0.6 * (1 - k)), 0);
    }
  }

  // contact shadow on the floor (world space)
  function floorShadow(P, st, w, a = 0.2) { const g = P.g; g.fillStyle = `rgba(20,10,40,${a})`; g.beginPath(); g.ellipse(st.cx, st.ground + 1, w, 6, 0, 0, TAU); g.fill(); }

  // ---------- the creatures ----------
  const DRAW = {
    slime(P, st, sp, hw) {
      const c = sp.col, D = P.D, t = T(st), sp1 = 1 + st.speed * 3;
      const wob = (i) => Math.sin((t * sp1) / 260 + i * 1.7) * 3;
      const tw = hw * 0.7, bw = hw * 0.94;
      P.ell(0, D - 1, bw + 10, 6.5, c.dark, 2.6);   // goo spread on the floor
      const path = () => { P.m(-tw, -3); P.l(tw, -3); P.c(tw + 24 + wob(1), 26, bw + 8 + wob(2), 62, bw, D - 2); P.q(0, D + 4, -bw, D - 2); P.c(-bw - 8 - wob(3), 62, -tw - 24 - wob(4), 26, -tw, -3); };
      P.shape(path, c.main);
      P.clip(path, () => { P.ell(0, D + 12, bw * 1.15, 34, rgba(c.dark, 0.45), 0); for (let i = 0; i < 4; i++) { const by = 84 - ((t / 30 + i * 23) % 70); P.ell(-hw * 0.48 + i * hw * 0.32, by, 2.5 + (i % 2) * 2, 2.5 + (i % 2) * 2, rgba('#ffffff', 0.4), 0); } });
      decoBody(P, st, sp, path, [-bw, 0, bw, D]);
      P.shape(path, null, 3.4);
      P.ell(-hw * 0.46, 18, 12, 6.5, 'rgba(255,255,255,0.55)', 0); P.ell(-hw * 0.28, 11, 4, 3, 'rgba(255,255,255,0.75)', 0);
      for (const k of [-1, 1]) { const L = 10 + Math.sin(t / 500 + k) * 3; P.shape(() => { P.m(k * tw * 0.55 - 5, 0); P.q(k * tw * 0.55, L + 8, k * tw * 0.55 + 5, 0); }, c.main, 0); }
      decoAround(P, st, sp, [-bw, 0, bw, D]);
      face(P, st, sp, 0, 36, 1.35);
      return null;
    },

    turtle(P, st, sp, hw) {
      const c = sp.col, D = P.D, t = T(st);
      const leg = (fx, i, col) => { const s = stepOf(st, i); const x = fx * hw + s.dx; P.rr(x - 11, 52, 22, D - 52 - s.up, 9, col, 3); P.line([[x - 5, D - 4 - s.up], [x - 5, D - 1 - s.up]], INK, 1.6); P.line([[x + 1, D - 4 - s.up], [x + 1, D - 1 - s.up]], INK, 1.6); };
      leg(-0.6, 1, c.dark); leg(0.32, 0, c.dark);
      P.poly([[-0.84 * hw, 56], [-0.98 * hw - 8, 70], [-0.8 * hw, 68]], c.main, 3);
      const hx = 0.84 * hw, hy = 42 + Math.sin(t / 700) * 1.5;
      P.limb([[0.5 * hw, 56], [hx - 8, hy + 6]], 18, c.main);
      P.ell(hx, hy, 19, 16, c.main, 3);
      leg(-0.44, 0, c.main); leg(0.5, 1, c.main);
      const shell = () => { P.m(-0.86 * hw, 60); P.c(-0.88 * hw, 2, -0.5 * hw, -5, -0.1 * hw, -5); P.c(0.32 * hw, -5, 0.66 * hw, 2, 0.64 * hw, 60); };
      P.shape(shell, c.sec);
      const sx = -0.11 * hw, hexs = [[-16, 14], [16, 14], [26, 34], [16, 52], [-16, 52], [-26, 34]].map(([x, y]) => [sx + x, y]);
      P.clip(shell, () => {
        P.poly(hexs, shade(c.sec, 0.15), 2.4);
        for (const [x, y] of hexs) P.line([[x, y], [sx + (x - sx) * 3, 34 + (y - 34) * 3]], c.secDark, 2.4);
        P.ell(-0.4 * hw, 14, 10, 5, 'rgba(255,255,255,0.35)', 0);
      });
      decoBody(P, st, sp, shell, [-0.86 * hw, -5, 0.64 * hw, 60]);
      P.shape(shell, null, 3.4);
      if (sp.d.has('crust')) { P.rr(-0.92 * hw, 54, 1.6 * hw, 14, 7, '#e8a95a', 3); for (let x = -0.88 * hw; x < 0.66 * hw; x += 10) P.ell(x, 61, 3.4, 4.6, '#f6c57e', 1.4); }
      else P.rr(-0.92 * hw, 54, 1.6 * hw, 13, 6.5, c.secDark, 3);
      decoAround(P, st, sp, [-0.86 * hw, -5, 0.64 * hw, 60]);
      if (sp.d.has('sprout')) { P.limb([[hx - 2, hy - 15], [hx - 4, hy - 26]], 2, '#3d8a3a'); P.ell(hx - 10, hy - 27, 6, 3.4, '#5fbf5a', 1.8); P.ell(hx + 2, hy - 29, 6, 3.4, '#5fbf5a', 1.8); }
      face(P, st, sp, hx - 2, hy - 2, 0.95, { side: true });
      if (sp.hat) hat(P, sp.hat, hx + 1, hy - 14, 0.95, sp);
      return null;
    },

    walrus(P, st, sp, hw) {
      const c = sp.col, D = P.D, t = T(st), scoot = Math.sin(st.walk) * 4 * st.speed;
      P.shape(() => { P.m(-0.8 * hw, D - 4); P.q(-1.0 * hw, D - 22 + scoot, -1.1 * hw, D - 12); P.q(-1.0 * hw, D - 2, -1.1 * hw, D + 2); P.q(-0.9 * hw, D + 2, -0.8 * hw, D); }, c.dark, 3);
      const body = () => { P.m(-0.86 * hw, D); P.c(-1.0 * hw, 36, -0.6 * hw, -5, -0.1 * hw, -5); P.c(0.4 * hw, -5, 0.94 * hw, 4, 0.92 * hw, 50); P.c(0.92 * hw, 80, 0.74 * hw, D, 0.5 * hw, D); };
      P.shape(body, c.main);
      P.clip(body, () => { P.ell(0.16 * hw, D + 8, 0.7 * hw, 30, c.belly, 0); for (let i = 0; i < 3; i++) P.curve(0.3 * hw + i * 7, 14, 0.36 * hw + i * 7, 34, 0.32 * hw + i * 7, 52, rgba(INK, 0.22), 2); });
      decoBody(P, st, sp, body, [-0.9 * hw, -5, 0.92 * hw, D]);
      P.shape(body, null, 3.4);
      P.ell(0.24 * hw + scoot, D - 6, 18, 7, c.dark, 3);
      decoAround(P, st, sp, [-0.9 * hw, -5, 0.92 * hw, D]);
      const fx = 0.62 * hw;
      face(P, st, sp, fx, 26, 0.9, { side: true, mouth: [0.82 * hw, 62], blush: false });
      // whisker pads, nose and tusks
      P.ell(0.76 * hw, 52, 11, 9, c.belly, 2.6); P.ell(0.9 * hw, 52, 11, 9, c.belly, 2.6);
      P.ell(0.83 * hw, 44, 6, 4.5, shade(c.main, -0.5), 2);
      for (const [x, y] of [[0.72, 50], [0.76, 55], [0.88, 50], [0.92, 55], [0.82, 53]]) P.ell(x * hw, y, 1, 1, INK, 0);
      const open = st.mood === 'laugh' ? 4 : 0;
      P.poly([[0.75 * hw - 3, 59], [0.74 * hw, 86 + open], [0.75 * hw + 4, 59]], '#fff7e3', 2.2);
      P.poly([[0.89 * hw - 3, 59], [0.9 * hw, 84 + open], [0.89 * hw + 4, 59]], '#fff7e3', 2.2);
      if (sp.hat) hat(P, sp.hat, fx + 4, 10, 1, sp);
      return null;
    },

    snail(P, st, sp, hw) {
      const c = sp.col, D = P.D, t = T(st), ext = Math.max(0, Math.sin(st.walk)) * 6 * st.speed;
      if (st.speed > 0.05) P.ell(-0.35 * hw, D, 0.75 * hw, 3, 'rgba(255,255,255,0.4)', 0);
      const foot = () => { P.m(-0.98 * hw, D); P.q(-0.92 * hw, 78, -0.5 * hw, 76); P.l(0.55 * hw, 74); P.q(0.68 * hw + ext, 68, 0.72 * hw + ext, 46); P.c(0.74 * hw + ext, 30, 0.98 * hw + ext, 30, 0.98 * hw + ext, 50); P.q(1.0 * hw + ext, 72, 0.86 * hw + ext, D); };
      P.shape(foot, c.main);
      P.clip(foot, () => P.ell(0, D + 2, hw * 1.2, 8, rgba(c.dark, 0.5), 0));
      const hx = 0.85 * hw + ext, sway = Math.sin(t / 520) * 3;
      const eyes = [[hx - 15 + sway, 12], [hx + 5 + sway, 9]];
      P.limb([[hx - 6, 38], eyes[0]], 4.5, c.main); P.limb([[hx + 4, 37], eyes[1]], 4.5, c.main);
      // shell
      const sx = -0.16 * hw, sy = 38, rx = 0.52 * hw, ry = 44;
      const shell = () => P.arc(sx, sy, rx, ry);
      P.shape(shell, c.sec);
      P.clip(shell, () => {
        if (sp.d.has('pumpkin')) for (let k = -2; k <= 2; k++) P.curve(sx + k * rx * 0.34, sy - ry, sx + k * rx * 0.6, sy, sx + k * rx * 0.34, sy + ry, c.secDark, 2.4);
        P.ell(sx + rx * 0.2, sy + ry * 0.7, rx, ry * 0.5, rgba(c.secDark, 0.45), 0);
      });
      decoBody(P, st, sp, shell, [sx - rx, sy - ry, sx + rx, sy + ry]);
      if (!sp.d.has('pumpkin')) {
        P.g.beginPath();
        for (let j = 0; j <= 70; j++) { const k = 1 - j / 70, th = (j / 70) * TAU * 2.4 + 0.8, x = sx + Math.cos(th) * rx * 0.86 * k, y = sy + Math.sin(th) * ry * 0.86 * k; j ? P.l(x, y) : P.m(x, y); }
        P.g.strokeStyle = c.secDark; P.g.lineWidth = 3.4; P.g.stroke();
      }
      P.shape(shell, null, 3.4);
      P.ell(sx - rx * 0.45, sy - ry * 0.5, 8, 4.5, 'rgba(255,255,255,0.45)', 0);
      decoAround(P, st, sp, [sx - rx, sy - ry + 6, sx + rx, sy + ry]);
      face(P, st, sp, hx, 46, 0.85, { eyes, mouth: [hx + 6, 56] });
      if (sp.hat) hat(P, sp.hat, hx - 4, 33, 0.9, sp);
      return null;
    },

    beetle(P, st, sp, hw) {
      const c = sp.col, D = P.D, legCol = shade(c.main, -0.62), headCol = shade(c.main, -0.35);
      const XS = [-0.48, -0.02, 0.4];
      const leg = (fx, i, col, far) => { const s = stepOf(st, i, 8, 7), x = fx * hw + (far ? 8 : 0); P.limb([[x, 56], [x - 13 + s.dx * 0.5, 70 - s.up * 0.6], [x - 5 + s.dx, D - s.up]], 4.2, col); };
      XS.forEach((fx, i) => leg(fx, i + 1, shade(legCol, 0.18), true));
      P.ell(-0.12 * hw, 58, 0.68 * hw, 10, legCol, 3);
      const hx = 0.8 * hw, hy = 45;
      if (!sp.hat) P.shape(() => { P.m(hx - 4, 42); P.q(hx + 0.22 * hw, 36, hx + 0.3 * hw, 4); P.q(hx + 0.12 * hw, 28, hx + 12, 48); }, headCol, 3);
      P.line([[hx + 8, 36], [hx + 18, 24], [hx + 27, 25]], INK, 2.2);
      P.ell(hx, hy, 21, 18, headCol, 3);
      const shell = () => { P.m(-0.88 * hw, 60); P.c(-0.9 * hw, -6, 0.66 * hw, -8, 0.64 * hw, 54); P.q(-0.1 * hw, 66, -0.88 * hw, 60); };
      P.shape(shell, c.main);
      P.clip(shell, () => P.ell(-0.1 * hw, 66, 0.9 * hw, 22, rgba(c.dark, 0.5), 0));
      decoBody(P, st, sp, shell, [-0.88 * hw, -6, 0.66 * hw, 62]);
      P.shape(shell, null, 3.4);
      P.curve(-0.84 * hw, 46, -0.1 * hw, 28, 0.6 * hw, 36, rgba(INK, 0.4), 2);
      P.curve(-0.6 * hw, 16, -0.3 * hw, 4, 0.1 * hw, 5, 'rgba(255,255,255,0.6)', 4);
      P.ell(0.6 * hw, 44, 0.15 * hw, 17, c.dark, 3);
      decoAround(P, st, sp, [-0.88 * hw, -6, 0.66 * hw, 62]);
      XS.forEach((fx, i) => leg(fx, i, legCol, false));
      face(P, st, sp, hx - 3, hy - 3, 1.0, { side: true, lid: headCol });
      if (sp.hat) hat(P, sp.hat, hx + 1, hy - 17, 0.95, sp);
      return null;
    },

    whale(P, st, sp, hw) {
      const c = sp.col, D = P.D, t = T(st), flap = Math.sin(t / 380) * 7;
      floorShadow(P, st, hw * 0.62, 0.16);
      for (let i = 0; i < 3; i++) { const k = ((t / 1600 + i / 3) % 1); P.star(-0.3 * hw + i * 0.3 * hw, 92 - k * 20, 2.4 * (1 - k) + 0.5, 4, rgba('#ffffff', 0.8 * (1 - k)), 0); }
      if (sp.d.has('disco')) {
        P.line([[0, 58], [0, 74]], INK, 1.6);
        P.ell(0, 82, 9, 9, '#cfd3e6', 2.2);
        P.clip(() => P.arc(0, 82, 9, 9), () => { for (let k = -2; k <= 2; k++) { P.line([[-10, 82 + k * 4], [10, 82 + k * 4]], rgba(INK, 0.35), 1); P.line([[k * 4 + ((t / 90) % 4), 72], [k * 4 + ((t / 90) % 4), 92]], rgba(INK, 0.35), 1); } });
        for (let i = 0; i < 4; i++) { const th = t / 500 + i * 1.6; P.star(Math.cos(th) * 26, 82 + Math.sin(th) * 8, 3, 4, ['#ff4f9a', '#63e2e6', '#ffc93c', '#ffffff'][i], 0); }
      }
      P.poly([[-0.76 * hw, 30], [-1.08 * hw, 6 + flap], [-0.96 * hw, 28 + flap * 0.4], [-1.1 * hw, 48 + flap], [-0.76 * hw, 40]], c.dark, 3);
      const body = () => { P.m(-0.82 * hw, 36); P.c(-0.6 * hw, 2, -0.3 * hw, -5, 0.3 * hw, -5); P.c(0.92 * hw, -5, 1.02 * hw, 28, 0.95 * hw, 42); P.c(0.82 * hw, 66, 0.1 * hw, 70, -0.3 * hw, 58); P.q(-0.6 * hw, 50, -0.82 * hw, 36); };
      P.shape(body, c.main);
      P.clip(body, () => { P.ell(0.2 * hw, 76, 0.85 * hw, 28, c.belly, 0); for (let i = 0; i < 4; i++) P.line([[-0.2 * hw + i * 0.24 * hw, 54 - i * 2], [-0.1 * hw + i * 0.24 * hw, 66]], rgba(INK, 0.25), 2); });
      decoBody(P, st, sp, body, [-0.82 * hw, -5, 1.0 * hw, 66]);
      P.shape(body, null, 3.4);
      P.ell(-0.2 * hw, 14, 16, 5, 'rgba(255,255,255,0.35)', 0);
      P.poly([[0.1 * hw, 52], [0.3 * hw, 52], [0.12 * hw, 70 + flap * 0.5]], c.dark, 3);
      decoAround(P, st, sp, [-0.82 * hw, -5, 1.0 * hw, 66]);
      face(P, st, sp, 0.6 * hw, 24, 1.15, { side: true, mouth: [0.8 * hw, 41], mouthK: 1.3 });
      return null;
    },

    cloud(P, st, sp, hw) {
      const c = sp.col, D = P.D, t = T(st);
      floorShadow(P, st, hw * 0.6, 0.14);
      if (sp.d.has('ghost')) P.shape(() => { P.m(-0.42 * hw, 46); P.q(-0.3 * hw, 74, -0.08 * hw + Math.sin(t / 400) * 8, 92); P.q(0.08 * hw, 74, 0.2 * hw, 80 + Math.sin(t / 330) * 5); P.q(0.36 * hw, 66, 0.42 * hw, 46); }, c.main, 3.2);
      else if (!sp.d.has('stars')) for (let i = 0; i < 4; i++) { const k = ((t / 900 + i / 4) % 1), x = -0.5 * hw + i * 0.33 * hw; P.ell(x, 58 + k * 36, 1.6, 3.2, rgba(SWEAT, 0.8 * (1 - k)), 0); }
      else for (let i = 0; i < 5; i++) { const k = ((t / 1400 + i / 5) % 1); P.star(-0.55 * hw + i * 0.28 * hw, 60 + k * 34, 3.4 * (1 - k * 0.6), 4, rgba('#fff3a8', 1 - k), 0, 0.35); }
      const PUFFS = [[-0.8, 18, 16], [0.8, 18, 16], [-0.46, 18, 26], [0.46, 18, 26], [0, 18, 30], [-0.66, 34, 24], [0.66, 34, 24], [-0.34, 42, 26], [0.34, 42, 26], [0, 46, 28]];
      const pts = PUFFS.map(([fx, y, r], i) => [fx * hw, y, r + Math.sin(t / 600 + i) * 1.2]);
      for (const [x, y, r] of pts) P.ell(x, y, r, r, null, 6.8);
      const union = () => { for (const [x, y, r] of pts) { P.arc(x, y, r, r); P.g.closePath(); } };
      P.g.beginPath(); union(); P.g.fillStyle = c.main; P.g.fill();
      P.g.save(); P.g.beginPath(); union(); P.g.clip();
      P.ell(0, 76, hw * 1.1, 30, rgba(c.dark, 0.3), 0);
      P.g.restore();
      decoBody(P, st, sp, union, [-hw, -6, hw, 74]);
      for (const [x, y, r] of pts.slice(2, 5)) P.curve(x - r * 0.5, y - r * 0.35, x - r * 0.2, y - r * 0.62, x + r * 0.2, y - r * 0.6, 'rgba(255,255,255,0.8)', 2.6);
      decoAround(P, st, sp, [-hw, 0, hw, 70]);
      face(P, st, sp, 0, 32, 1.2, sp.d.has('ghost') ? { brows: 'angry' } : {});
      return null;
    },

    crab(P, st, sp, hw, PWh) {
      const c = sp.col, D = P.D, t = T(st), legCol = c.dark;
      for (const side of [-1, 1]) for (let i = 0; i < 3; i++) {
        const s = stepOf(st, i + (side > 0 ? 1 : 0), 7, 7);
        const kx = side * (0.9 + i * 0.13) * hw, ky = 26 + i * 7 - s.up * 0.6, fx = side * (1.0 + i * 0.16) * hw + s.dx, fy = D - s.up;
        P.limb([[side * (0.56 + i * 0.08) * hw, 36 + i * 5], [kx, ky], [fx, fy - 6]], 5.4, legCol);
        P.poly([[fx - 3, fy - 8], [fx + 3, fy - 8], [fx + side * 2, fy]], legCol, 2);
      }
      for (const side of [-1, 1]) P.limb([[side * 0.5 * hw, 40], [side * (hw + 8), 46], [side * (PWh + 12), 6]], 9, c.main);
      const shell = () => { P.m(-0.82 * hw, 28); P.c(-0.82 * hw, -14, 0.82 * hw, -14, 0.82 * hw, 28); P.c(0.82 * hw, 64, -0.82 * hw, 64, -0.82 * hw, 28); };
      P.shape(shell, c.main);
      P.clip(shell, () => { P.ell(0, 62, hw, 24, rgba(c.dark, 0.45), 0); });
      decoBody(P, st, sp, shell, [-0.82 * hw, -6, 0.82 * hw, 54]);
      P.shape(shell, null, 3.4);
      for (let k = -3; k <= 3; k++) P.ell(k * 0.2 * hw, 12 + Math.abs(k) * 2.4, 3, 2, 'rgba(255,255,255,0.4)', 0);
      decoAround(P, st, sp, [-0.82 * hw, -6, 0.82 * hw, 54]);
      const eyes = [[-15, 14], [15, 14]];
      P.limb([[-9, 30], eyes[0]], 5, c.main); P.limb([[9, 30], eyes[1]], 5, c.main);
      face(P, st, sp, 0, 26, 1.1, { eyes, mouth: [0, 38] });
      return () => {
        const snap = st.mood === 'startled' || st.mood === 'laugh' ? Math.abs(Math.sin(t / 110)) * 6 : 0;
        for (const side of [-1, 1]) {
          const ex = side * PWh;
          P.shape(() => { P.m(side * (PWh + 6), -18); P.q(side * (PWh + 4), -32 - snap, side * (PWh - 14), -24 - snap); P.q(side * (PWh - 4), -22 - snap * 0.5, side * (PWh + 2), -14); }, c.main, 3);
          P.ell(side * (PWh + 15), -5, 15, 16, c.main, 3);
          P.shape(() => { P.m(side * (PWh + 8), 6); P.q(side * (PWh - 2), 14 + snap * 0.5, ex - side * 8, 9 + snap * 0.5); P.q(side * (PWh + 2), 4, side * (PWh + 6), 0); }, c.main, 3);
          P.ell(side * (PWh + 20), -10, 3.4, 3.4, 'rgba(255,255,255,0.55)', 0);
        }
      };
    },

    golem(P, st, sp, hw, PWh) {
      const c = sp.col, D = P.D, stone = c.main;
      for (const [side, i] of [[-1, 0], [1, 1]]) {
        const s = stepOf(st, i, 6, 9), x = side * 0.36 * hw + s.dx;
        P.rr(x - 15, 60, 30, D - 70 - s.up, 6, c.dark, 3.2);
        P.rr(x - 19, D - 13 - s.up, 38, 13, 4, stone, 3.2);
      }
      for (const side of [-1, 1]) P.limb([[side * 0.7 * hw, 22], [side * (hw + 14), 36], [side * (PWh + 6), 0]], 15, c.dark);
      for (const side of [-1, 1]) {
        P.ell(side * 0.78 * hw, 18, 18, 16, stone, 3.2);
        if (sp.d.has('castle')) for (let k = -1; k <= 1; k++) P.rr(side * 0.78 * hw + k * 11 - 4, -1, 8, 8, 1.5, stone, 2.2);
      }
      const body = () => { P.m(-0.66 * hw, -4); P.l(0.66 * hw, -4); P.l(0.74 * hw, 22); P.l(0.62 * hw, 66); P.l(0.3 * hw, 72); P.l(-0.3 * hw, 72); P.l(-0.62 * hw, 66); P.l(-0.74 * hw, 22); };
      P.shape(body, stone);
      P.clip(body, () => {
        P.line([[-0.74 * hw, 46], [0.74 * hw, 48]], c.dark, 2.2); P.line([[-0.1 * hw, 46], [-0.14 * hw, 72]], c.dark, 2.2); P.line([[0.32 * hw, -4], [0.28 * hw, 14]], c.dark, 2.2);
        P.ell(0.3 * hw, 74, 0.7 * hw, 18, rgba(c.dark, 0.5), 0);
      });
      decoBody(P, st, sp, body, [-0.74 * hw, -4, 0.74 * hw, 72]);
      P.shape(body, null, 3.4);
      if (sp.d.has('band')) { P.line([[-0.7 * hw, 10], [0.7 * hw, 10]], INK, 11); P.line([[-0.7 * hw, 10], [0.7 * hw, 10]], c.acc, 7); const f = Math.sin(T(st) / 200) * 4; P.limb([[0.64 * hw, 10], [0.86 * hw, 18 + f], [0.98 * hw, 14 + f * 1.5]], 4, c.acc); }
      decoAround(P, st, sp, [-0.74 * hw, -4, 0.74 * hw, 72]);
      face(P, st, sp, 0, 32, 1.1, { brows: 'angry', white: c.glow });
      return () => {
        for (const side of [-1, 1]) {
          const x = side * (PWh + 1);
          P.rr(x - 12, -24, 24, 30, 7, stone, 3.2);
          for (let k = 0; k < 2; k++) P.line([[x - 7 + k * 8, -24], [x - 7 + k * 8, -16]], c.dark, 2);
        }
      };
    },

    mech(P, st, sp, hw, PWh) {
      const c = sp.col, D = P.D, t = T(st), metal = c.main;
      if (sp.d.has('treads')) {
        P.rr(-0.62 * hw, 68, 1.24 * hw, 31, 15, '#3a3448', 3.2);
        for (let k = 0; k < 4; k++) { const x = -0.44 * hw + k * 0.29 * hw; P.ell(x, 84, 9, 9, '#8c8aa0', 2.2); const th = st.walk * 2 + k; P.line([[x - Math.cos(th) * 7, 84 - Math.sin(th) * 7], [x + Math.cos(th) * 7, 84 + Math.sin(th) * 7]], INK, 1.6); }
      } else for (const [side, i] of [[-1, 0], [1, 1]]) {
        const s = stepOf(st, i, 7, 8), kx = side * 0.32 * hw + s.dx * 0.5, ax = side * 0.24 * hw + s.dx;
        P.limb([[side * 0.2 * hw, 60], [kx, 80 - s.up * 0.6], [ax, D - 9 - s.up]], 7, c.dark);
        P.ell(kx, 80 - s.up * 0.6, 5.5, 5.5, metal, 2.2);
        P.rr(ax - 15, D - 10 - s.up, 30, 10, 3, metal, 3);
      }
      for (const side of [-1, 1]) { P.limb([[side * 0.6 * hw, 16], [side * (hw + 10), 28], [side * (PWh + 4), 0]], 9, c.dark); P.ell(side * (hw + 10), 28, 6, 6, metal, 2.2); }
      P.rr(-0.26 * hw, 52, 0.52 * hw, 16, 4, c.dark, 3);
      const body = () => P.rrPath(-0.64 * hw, -5, 1.28 * hw, 62, 12);
      P.shape(body, metal);
      P.clip(body, () => { P.line([[-0.64 * hw, 47], [0.64 * hw, 47]], rgba(INK, 0.35), 2); P.ell(0, 66, 0.9 * hw, 14, rgba(c.dark, 0.5), 0); });
      decoBody(P, st, sp, body, [-0.64 * hw, -5, 0.64 * hw, 57]);
      P.shape(body, null, 3.4);
      const blink = Math.floor(t / 500) % 2;
      P.ell(-0.52 * hw, 50, 3, 3, blink ? c.glow : shade(c.glow, -0.5), 1.4); P.ell(-0.43 * hw, 50, 3, 3, blink ? shade(c.glow, -0.5) : '#ff4f6a', 1.4);
      decoAround(P, st, sp, [-0.64 * hw, -5, 0.64 * hw, 57]);
      // screen face
      const sx = -0.4 * hw, sw = 0.8 * hw;
      P.rr(sx, 8, sw, 34, 8, '#1d1630', 3);
      const mood = st.mood, G = c.glow, red = sp.d.has('laser');
      const lx = clamp((st.look ? st.look.x : 0) * P.flip, -1, 1) * 3;
      for (const [i, k] of [[0, -1], [1, 1]]) {
        const ex = k * 0.17 * hw + (mood === 'idle' || mood === 'strain' ? lx : 0), ey = 21, col = red && i === 1 ? '#ff2b2b' : G;
        if (mood === 'laugh') P.line([[ex - 5, ey + 3], [ex, ey - 3], [ex + 5, ey + 3]], col, 3);
        else if (mood === 'wince') P.line([[ex - k * 4, ey - 5], [ex + k * 4, ey], [ex - k * 4, ey + 5]], col, 3);
        else if (mood === 'dizzy') { P.line([[ex - 4, ey - 4], [ex + 4, ey + 4]], col, 3); P.line([[ex + 4, ey - 4], [ex - 4, ey + 4]], col, 3); }
        else if (mood === 'startled' || mood === 'scared') { P.g.beginPath(); P.arc(ex, ey, 5.5, 5.5); P.g.closePath(); P.g.strokeStyle = col; P.g.lineWidth = 2.6; P.g.stroke(); }
        else if (mood === 'strain' || st.blink) P.line([[ex - 5, ey], [ex + 5, ey]], col, 3);
        else P.rr(ex - 3.5, ey - 5, 7, 10, 3, col, 0);
      }
      if (mood === 'laugh') P.rr(-8, 30, 16, 7, 3, G, 0);
      else if (mood === 'startled') P.ell(0, 33, 3, 3, G, 0);
      else if (mood === 'scared' || mood === 'strain' || mood === 'dizzy') P.line([[-8, 34], [-4, 31], [0, 34], [4, 31], [8, 34]], G, 2.2);
      else { P.g.beginPath(); P.m(-6, 31); P.q(0, 37, 6, 31); P.g.strokeStyle = G; P.g.lineWidth = 2.4; P.g.stroke(); }
      if (mood === 'laugh' && Math.floor(t / 320) % 2 === 0) P.text('HA', 0.62 * hw, 0, 13, '#ffffff', INK);
      if (mood === 'scared' || mood === 'strain') P.text('!', 0.54 * hw, 12, 14, '#ffd23f', INK);
      return () => {
        for (const side of [-1, 1]) {
          const x = side * (PWh + 2);
          P.rr(x - 9, -23, 18, 30, 4, metal, 3);
          P.ell(x, -8, 2.6, 2.6, '#e8e9f0', 1.4);
        }
      };
    },
  };

  // draw the mount (everything under and behind the plate). Returns the front layer, drawn after the plate.
  // st: { cx, plateY, angle, PW (plate width now), B (plate width at the start), ground, t, walk, speed, squash, mood, look, blink, reduce }
  function draw(g, sp, st) {
    const hw = st.B / 2, PWh = st.PW / 2;
    const P = pen(g, st, sp);
    g.save(); g.lineJoin = 'round'; g.lineCap = 'round';
    if (!TYPES[sp.type].float) floorShadow(P, st, hw * 1.02, 0.2);
    let front = null;
    try { front = DRAW[sp.type](P, st, sp, hw, PWh); } finally { g.restore(); }
    return front ? () => { g.save(); g.lineJoin = 'round'; g.lineCap = 'round'; try { front(); } finally { g.restore(); } } : null;
  }

  // a little picture of the mount holding a plate, for cards (cv = a canvas element)
  function thumb(cv, sp, o = {}) {
    const g = cv.getContext('2d'), W = cv.width, H = cv.height, k = Math.min(W / 270, H / 150);
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H);
    g.setTransform(k, 0, 0, k, W / 2 - 135 * k, 0);
    const st = { cx: 135, plateY: 16, angle: 0, PW: 196, B: 196, ground: 16 + 118, t: o.t || 0, walk: 0, speed: 0, squash: 0, mood: o.mood || 'idle', look: { x: 0, y: -0.5 }, blink: false, reduce: true };
    g.fillStyle = 'rgba(27,16,36,0.12)'; g.fillRect(-200, st.ground, 700, 40);
    const front = draw(g, sp, st);
    g.lineWidth = 3.4; g.strokeStyle = INK; g.fillStyle = '#fffbff';
    g.beginPath(); if (g.roundRect) g.roundRect(135 - 98, 16, 196, 18, 9); else g.rect(135 - 98, 16, 196, 18); g.fill(); g.stroke();
    if (front) front();
    g.setTransform(1, 0, 0, 1, 0, 0);
  }

  return { TYPES, spec, draw, thumb, palette };
})();
// ===================== MOUNTS-END =====================
