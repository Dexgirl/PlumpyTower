// PLUMPY — build the roster of 50 trapped Chogs (one per level) + the 3 starters.
//
//   node scripts/build-roster.mjs pick            choose the Chogs, print collection stats -> data/roster.json
//   node scripts/build-roster.mjs images <batch>  download + shrink art, 10 Chogs per batch (batch 0..5)
//   node scripts/build-roster.mjs pack            bundle traits + art into data/plumpy-pack.json
//
// Needs: data/meta/*.json from fetch-meta.mjs, and `npm i sharp` for the images step.
// Safe to re-run: images already saved in data/img/ are skipped.

import { readdir, readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';

const META_DIR = path.resolve('data/meta');
const IMG_DIR = path.resolve('data/img');
const ROSTER = path.resolve('data/roster.json');
const PACK = path.resolve('data/plumpy-pack.json');
const STARTERS = [4, 1, 9];          // tokens behind CHOG #1465, #1462, #1470 (the 3 in the prototype)
const LEVELS = 50;
const BATCH = 10;
const SIZE = 256;                    // px, square
const GATEWAYS = (process.env.IPFS_GATEWAY ||
  'https://ipfs.filebase.io/ipfs/,https://gateway.pinata.cloud/ipfs/,https://ipfs.io/ipfs/,https://dweb.link/ipfs/')
  .split(',').map((g) => g.trim()).filter(Boolean).map((g) => (g.endsWith('/') ? g : g + '/'));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const exists = (p) => access(p).then(() => true, () => false);
const trait = (m, k) => (m.attributes.find((a) => a.trait_type === k) || {}).value ?? null;

// same rule the game uses
// tuned to the real Genesis Head list: horns / thorns / crowns / wizard hats / diamond = pointy,
// caps + hats = flat, everything else (bare head, beanies, headbands, wigs, helmets) = round
function headShape(head) {
  const s = String(head || '').toLowerCase();
  if (/horn|thorn|crown|wizard hat|diamond|spike|cone|party|unicorn|mohawk|witch|pointy/.test(s)) return 'pointy';
  if (/cap|hat|bucket|beret|visor|plumber/.test(s)) return 'flat';
  return 'round';
}

async function loadAll() {
  const files = (await readdir(META_DIR)).filter((f) => f.endsWith('.json'));
  const all = [];
  for (const f of files) {
    const m = JSON.parse(await readFile(path.join(META_DIR, f), 'utf8'));
    if (m && m.tokenId != null && Array.isArray(m.attributes)) all.push(m);
  }
  return all.sort((a, b) => a.tokenId - b.tokenId);
}

// deterministic shuffle so the same roster comes out every time
function shuffle(arr, seed) {
  let s = seed >>> 0;
  const rnd = () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

const slim = (m) => ({
  token: m.tokenId,
  num: Number(String(m.name || '').replace(/\D+/g, '')) || null,
  name: m.name,
  image: m.image,
  traits: Object.fromEntries(m.attributes.map((a) => [a.trait_type, a.value])),
  shape: headShape(trait(m, 'Head')),
});

// ---------------- pick ----------------
async function pick() {
  const all = await loadAll();
  console.log(`loaded ${all.length} Chogs`);

  // tiers ranked from most common to rarest
  const tierCount = {};
  for (const m of all) { const t = trait(m, 'Tier') || '(none)'; tierCount[t] = (tierCount[t] || 0) + 1; }
  const tiers = Object.entries(tierCount).sort((a, b) => b[1] - a[1]).map(([t]) => t);
  console.log('\nTIERS (common -> rare):', tiers.map((t) => `${t} ${tierCount[t]}`).join(' · '));

  const shapeCount = { flat: 0, round: 0, pointy: 0 };
  const heads = {};
  for (const m of all) { const h = trait(m, 'Head') || '(none)'; heads[h] = (heads[h] || 0) + 1; shapeCount[headShape(h)]++; }
  console.log('SHAPES:', Object.entries(shapeCount).map(([k, v]) => `${k} ${v}`).join(' · '));
  console.log('\nHEAD values -> shape (paste this whole block back to Claude):');
  for (const [h, n] of Object.entries(heads).sort((a, b) => b[1] - a[1])) console.log(`  ${headShape(h).padEnd(6)} ${String(n).padStart(4)}  ${h}`);
  for (const k of ['Aura', 'Accessory', 'Form', 'Base']) {
    const c = {}; for (const m of all) { const v = trait(m, k) || '(none)'; c[v] = (c[v] || 0) + 1; }
    console.log(`${k.toUpperCase()}:`, Object.entries(c).sort((a, b) => b[1] - a[1]).map(([v, n]) => `${v} ${n}`).join(' · '));
  }

  // level slots: rarer tiers later in the story
  const plan = [14, 12, 10, 8, 6];                 // levels per tier rank, sums to 50
  const pool = shuffle(all.filter((m) => !STARTERS.includes(m.tokenId)), 1969);
  const used = new Set(), usedHeads = new Set();
  const levels = [];
  let carry = 0;
  for (let r = 0; r < plan.length; r++) {
    const want = plan[r] + carry;
    const tier = tiers[Math.min(r, tiers.length - 1)];
    const cands = pool.filter((m) => (trait(m, 'Tier') || '(none)') === tier && !used.has(m.tokenId));
    // prefer new Head values, and make sure every tier band includes pointy heads (flag levels need them)
    const pointyWanted = Math.max(1, Math.round(want * 0.2));
    const picked = [];
    for (const wantPointy of [true, false]) {
      for (const m of cands) {
        if (picked.length >= want) break;
        if (used.has(m.tokenId)) continue;
        const isPointy = headShape(trait(m, 'Head')) === 'pointy';
        if (wantPointy && (!isPointy || picked.filter((p) => headShape(trait(p, 'Head')) === 'pointy').length >= pointyWanted)) continue;
        if (usedHeads.has(trait(m, 'Head')) && cands.length > want * 3) continue;
        picked.push(m); used.add(m.tokenId); usedHeads.add(trait(m, 'Head'));
      }
    }
    for (const m of cands) { if (picked.length >= want) break; if (!used.has(m.tokenId)) { picked.push(m); used.add(m.tokenId); } }
    carry = want - picked.length;                    // not enough in this tier? push the gap to the next band
    for (const m of picked) levels.push({ ...slim(m), tier, tierRank: r });
  }
  levels.forEach((c, i) => { c.level = i + 1; });

  const starters = all.filter((m) => STARTERS.includes(m.tokenId)).map(slim);
  await writeFile(ROSTER, JSON.stringify({ tiers, starters, levels }, null, 2));

  console.log('\nSTARTERS (real traits):');
  for (const c of starters) console.log(`  token ${c.token} = ${c.name} · ${c.traits.Tier} · Head: ${c.traits.Head} (${c.shape}) · Side: ${c.traits.Side}`);
  console.log(`\nROSTER: ${levels.length} trapped Chogs written to data/roster.json`);
  const byTier = {}; for (const c of levels) byTier[c.tier] = (byTier[c.tier] || 0) + 1;
  console.log('  per tier:', Object.entries(byTier).map(([t, n]) => `${t} ${n}`).join(' · '));
  const sh = { flat: 0, round: 0, pointy: 0 }; for (const c of levels) sh[c.shape]++;
  console.log('  shapes:', Object.entries(sh).map(([k, v]) => `${k} ${v}`).join(' · '));
  console.log(`\nNext: npm i sharp   then   node scripts/build-roster.mjs images 0   (batches 0..${Math.ceil((levels.length + starters.length) / BATCH) - 1})`);
}

// ---------------- images ----------------
function ipfsPath(uri) {
  if (!uri) return null;
  if (uri.startsWith('ipfs://')) return uri.slice(7).replace(/^ipfs\//, '');
  const m = uri.match(/\/ipfs\/(.+)$/); return m ? m[1] : null;
}
const rest = new Map();
let gi = 0;
async function download(uri) {
  const p = ipfsPath(uri);
  if (!p) throw new Error(`not an IPFS link: ${uri}`);
  let lastErr;
  for (let attempt = 0; attempt < 14; attempt++) {
    const now = Date.now();
    let g = null;
    for (let i = 0; i < GATEWAYS.length; i++) { const c = GATEWAYS[(gi + i) % GATEWAYS.length]; if ((rest.get(c) || 0) <= now) { g = c; gi = (gi + i + 1) % GATEWAYS.length; break; } }
    if (!g) { await sleep(Math.max(500, Math.min(...GATEWAYS.map((c) => rest.get(c) || 0)) - now)); continue; }
    try {
      const res = await fetch(g + p, { signal: AbortSignal.timeout(30000) });
      if (!res.ok) { const e = new Error(`HTTP ${res.status}`); e.status = res.status; e.ra = Number(res.headers.get('retry-after')) || 0; throw e; }
      return Buffer.from(await res.arrayBuffer());
    } catch (e) {
      lastErr = e;
      const ms = e.status === 429 ? (e.ra || 30) * 1000 : 8000;
      if ((rest.get(g) || 0) < Date.now()) console.log(`  ${new URL(g).host} ${e.status === 429 ? 'rate-limited' : 'failed (' + e.message + ')'} -> resting ${Math.round(ms / 1000)}s`);
      rest.set(g, Date.now() + ms);
      await sleep(400);
    }
  }
  throw new Error(`download failed: ${lastErr && lastErr.message}`);
}

async function images(batch) {
  let sharp;
  try { sharp = (await import('sharp')).default; } catch (e) { console.error('sharp is missing. Run:  npm i sharp'); process.exit(1); }
  const roster = JSON.parse(await readFile(ROSTER, 'utf8'));
  const list = [...roster.starters, ...roster.levels];
  const slice = list.slice(batch * BATCH, batch * BATCH + BATCH);
  if (!slice.length) { console.log(`batch ${batch} is empty: all done. Next: node scripts/build-roster.mjs pack`); return; }
  await mkdir(IMG_DIR, { recursive: true });
  console.log(`images batch ${batch}: ${slice.length} Chogs (${batch * BATCH + 1}-${batch * BATCH + slice.length} of ${list.length})`);
  let ok = 0, skipped = 0; const failed = [];
  for (const c of slice) {
    const out = path.join(IMG_DIR, `${c.token}.webp`);
    if (await exists(out)) { skipped++; continue; }
    try {
      const buf = await download(c.image);
      await sharp(buf).resize(SIZE, SIZE, { fit: 'cover' }).webp({ quality: 80 }).toFile(out);
      ok++; console.log(`  ✓ token ${c.token} (${c.name})`);
      await sleep(300);
    } catch (e) { failed.push(c.token); console.log(`  ✗ token ${c.token}: ${e.message}`); }
  }
  console.log(`\nsaved ${ok} · already had ${skipped} · failed ${failed.length}${failed.length ? ' -> re-run this same batch' : ''}`);
  const total = Math.ceil(list.length / BATCH);
  if (!failed.length) console.log(batch + 1 < total ? `Next: node scripts/build-roster.mjs images ${batch + 1}` : 'All batches done. Next: node scripts/build-roster.mjs pack');
  process.exitCode = failed.length ? 1 : 0;
}

// ---------------- pack ----------------
async function pack() {
  const roster = JSON.parse(await readFile(ROSTER, 'utf8'));
  const list = [...roster.starters.map((c) => ({ ...c, starter: true })), ...roster.levels];
  const missing = [];
  const out = [];
  for (const c of list) {
    const f = path.join(IMG_DIR, `${c.token}.webp`);
    if (!(await exists(f))) { missing.push(c.token); continue; }
    const img = 'data:image/webp;base64,' + (await readFile(f)).toString('base64');
    out.push({ token: c.token, num: c.num, name: c.name, traits: c.traits, shape: c.shape, tier: c.tier || c.traits.Tier, tierRank: c.tierRank ?? null, level: c.level ?? null, starter: Boolean(c.starter), img });
  }
  if (missing.length) { console.log(`missing art for tokens: ${missing.join(', ')}  -> run the images batches again first`); process.exitCode = 1; return; }
  await writeFile(PACK, JSON.stringify({ tiers: roster.tiers, chogs: out }));
  const kb = Math.round(JSON.stringify(out).length / 1024);
  console.log(`packed ${out.length} Chogs into data/plumpy-pack.json (${kb} KB). Send that file to Claude.`);
}

const [cmd, arg] = process.argv.slice(2);
if (cmd === 'pick') await pick();
else if (cmd === 'images') await images(Number(arg || 0));
else if (cmd === 'pack') await pack();
else console.log('Usage: node scripts/build-roster.mjs pick | images <batch> | pack');
