// PLUMPY — download the pictures for the 50 NFT villains (one per level).
//
//   node scripts/build-villains.mjs get <batch>   download + shrink 10 villain pictures per batch (batch 0..4)
//   node scripts/build-villains.mjs pack          bundle them into data/villain-pack.json (send that file to Claude)
//
// Needs: Node 18+ and sharp (you already installed it: npm i sharp).
// Safe to re-run: pictures already saved in villains/img/ are skipped.
// Optional: OPENSEA_API_KEY=... if OpenSea ever starts asking for a key.

import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';

// level order: L1 first ... L50 last (the boss)
const VILLAINS = [
  ['skrump2958', 'monad', '0xb0dad798c80e40dd6b8e8545074c6a5b7b97d2c0', '2958'],
  ['chewy163', 'monad', '0xe1ddf619bb352e6eb25367be99606be02836cbbc', '163'],
  ['r3t205', 'monad', '0x200723a706de0013316e5cd8eba2b3f53dd90c29', '205'],
  ['monafuku653', 'monad', '0xb6f9ba0511edced7491b06f33201b494575017eb', '653'],
  ['skrump2948', 'monad', '0xb0dad798c80e40dd6b8e8545074c6a5b7b97d2c0', '2948'],
  ['bearish4744', 'abstract', '0x516dc288e26b34557f68ea1c1ff13576eff8a168', '4744'],
  ['kapysh62', 'monad', '0x6602fdcf8553671a9cba9f8765ab5f4d0bc8e66e', '62'],
  ['lilpudgy13790', 'ethereum', '0x524cab2ec69124574082676e6f654a18df49a048', '13790'],
  ['pudgy7460', 'ethereum', '0xbd3531da5cf5857e7cfaa92426877b022e612cf8', '7460'],
  ['daks2948', 'monad', '0x9f8514cebee138b61806d4651f51d26c8098b463', '2948'],
  ['chewy833', 'monad', '0xe1ddf619bb352e6eb25367be99606be02836cbbc', '833'],
  ['mayc66', 'ethereum', '0x60e4d786628fea6478f785a6d7e704777c86a7c6', '66'],
  ['pudgy5678', 'ethereum', '0xbd3531da5cf5857e7cfaa92426877b022e612cf8', '5678'],
  ['kapysh239', 'monad', '0x6602fdcf8553671a9cba9f8765ab5f4d0bc8e66e', '239'],
  ['mouch806', 'monad', '0x54b8048a30919e64c678d5decef5fd8c20f836ff', '806'],
  ['axie11935654', 'ronin', '0x32950db2a7164ae833121501c797d79e7b79d74c', '11935654'],
  ['madlads5391', 'solana', '', 'GjmivzYyFBFpMdCAjJ1DTK8gr5F32hpyLLvQH9eANt3e'],
  ['molandak390', 'monad', '0x36982448e77658b8f58f4665696e3173d1e696c2', '390'],
  ['mayc6519', 'ethereum', '0x60e4d786628fea6478f785a6d7e704777c86a7c6', '6519'],
  ['bearish6399', 'abstract', '0x516dc288e26b34557f68ea1c1ff13576eff8a168', '6399'],
  ['sfpunk707', 'ethereum', '0x271142d962b65e7939e1d55e7fca03910c829498', '707'],
  ['axie11426741', 'ronin', '0x32950db2a7164ae833121501c797d79e7b79d74c', '11426741'],
  ['azuki1748', 'ethereum', '0xed5af388653567af2f388e6224dc7c4b3241c544', '1748'],
  ['betty19', 'ethereum', '0xed53a9291dc5a1f2183924511402c159a9dbb333', '21300050019'],
  ['mayc2151', 'ethereum', '0x60e4d786628fea6478f785a6d7e704777c86a7c6', '2151'],
  ['milady6745', 'ethereum', '0x5af0d9827e0c53e4799bb226655a1de152a425a5', '6745'],
  ['madlads6955', 'solana', '', '3gGWuL8s1PDeeRLdSzirzL68rYQvzHqAuXP8eMAmNefE'],
  ['mouch1151', 'monad', '0x54b8048a30919e64c678d5decef5fd8c20f836ff', '1151'],
  ['r3t505', 'monad', '0x200723a706de0013316e5cd8eba2b3f53dd90c29', '505'],
  ['chewy1407', 'monad', '0xe1ddf619bb352e6eb25367be99606be02836cbbc', '1407'],
  ['argo8764', 'ethereum', '0x387c41b0b2f1128de44db1bcf8baad085f26392c', '8764'],
  ['betty23', 'ethereum', '0xed53a9291dc5a1f2183924511402c159a9dbb333', '21300020023'],
  ['daks867', 'monad', '0x9f8514cebee138b61806d4651f51d26c8098b463', '867'],
  ['betty24', 'ethereum', '0xed53a9291dc5a1f2183924511402c159a9dbb333', '21300070024'],
  ['madlads723', 'solana', '', '7G1NVrjcCYaXmeYTZBDejD1c4LVk81Swoq94imwP1TEu'],
  ['molandak3061', 'monad', '0x36982448e77658b8f58f4665696e3173d1e696c2', '3061'],
  ['daks513', 'monad', '0x9f8514cebee138b61806d4651f51d26c8098b463', '513'],
  ['r3t806', 'monad', '0x200723a706de0013316e5cd8eba2b3f53dd90c29', '806'],
  ['daks2609', 'monad', '0x9f8514cebee138b61806d4651f51d26c8098b463', '2609'],
  ['argo6511', 'ethereum', '0x387c41b0b2f1128de44db1bcf8baad085f26392c', '6511'],
  ['daks1000', 'monad', '0x9f8514cebee138b61806d4651f51d26c8098b463', '1000'],
  ['azuki9453', 'ethereum', '0xed5af388653567af2f388e6224dc7c4b3241c544', '9453'],
  ['kapysh218', 'monad', '0x6602fdcf8553671a9cba9f8765ab5f4d0bc8e66e', '218'],
  ['madlads5176', 'solana', '', '64u7itH9F6nFyikZEoMBKivZPLuZAKJt2Vkxfa6oNySp'],
  ['skrump2643', 'monad', '0xb0dad798c80e40dd6b8e8545074c6a5b7b97d2c0', '2643'],
  ['mouch1320', 'monad', '0x54b8048a30919e64c678d5decef5fd8c20f836ff', '1320'],
  ['argo3615', 'ethereum', '0x387c41b0b2f1128de44db1bcf8baad085f26392c', '3615'],
  ['skrump2831', 'monad', '0xb0dad798c80e40dd6b8e8545074c6a5b7b97d2c0', '2831'],
  ['v1punk5103', 'ethereum', '0x282bdd42f4eb70e7a9d9f40c8fea0825b7f68c5d', '5103'],
  ['blokyz16', 'ethereum', '0x86ffb7988913e85a5a07d459a5165ab1273cfe62', '16'],
];

const IMG_DIR = path.resolve('villains/img');
const PACK = path.resolve('data/villain-pack.json');
const BATCH = 10;
const SIZE = 200;
const GATEWAYS = ['https://ipfs.filebase.io/ipfs/', 'https://gateway.pinata.cloud/ipfs/', 'https://ipfs.io/ipfs/', 'https://dweb.link/ipfs/'];
const UA = { 'user-agent': 'Mozilla/5.0 (plumpy-villains)', accept: 'application/json,image/*,*/*' };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const exists = (p) => access(p).then(() => true, () => false);

async function get(url, asJson) {
  const headers = { ...UA };
  if (process.env.OPENSEA_API_KEY && url.includes('api.opensea.io')) headers['x-api-key'] = process.env.OPENSEA_API_KEY;
  for (let attempt = 0; attempt < 5; attempt++) {
    let res;
    try { res = await fetch(url, { headers, signal: AbortSignal.timeout(30000) }); }
    catch (e) { await sleep(2000 * (attempt + 1)); continue; }
    if (res.status === 429) { const s = Number(res.headers.get('retry-after')) || 4 * (attempt + 1); console.log(`    busy, waiting ${s}s...`); await sleep(s * 1000); continue; }
    if (res.status >= 500) { await sleep(2000 * (attempt + 1)); continue; }
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${new URL(url).host}`);
    return asJson ? res.json() : Buffer.from(await res.arrayBuffer());
  }
  throw new Error(`gave up on ${new URL(url).host}`);
}

async function imageUrl([, chain, contract, id]) {
  if (chain === 'solana') {
    const m = await get(`https://api-mainnet.magiceden.dev/v2/tokens/${id}`, true);
    return m.image || (m.properties && m.properties.files && m.properties.files[0] && m.properties.files[0].uri);
  }
  const m = await get(`https://api.opensea.io/api/v2/metadata/${chain}/${contract}/${id}`, true);
  return m.image || m.image_url;
}

async function download(url) {
  if (url.startsWith('data:')) {
    const [head, body] = url.split(',');
    return head.includes('base64') ? Buffer.from(body, 'base64') : Buffer.from(decodeURIComponent(body));
  }
  if (url.startsWith('ipfs://') || url.includes('/ipfs/')) {
    const cid = url.replace(/^ipfs:\/\/(ipfs\/)?/, '').replace(/^.*\/ipfs\//, '');
    for (const g of GATEWAYS) { try { return await get(g + cid); } catch (e) { console.log(`    ${new URL(g).host} resting, next gateway...`); } }
    throw new Error('all IPFS gateways failed');
  }
  if (url.includes('seadn.io') && !url.includes('?')) url += '?w=512';
  return get(url);
}

// colours for the lair: background = the picture's corners, accent = its boldest colour
function colours(data, w, h) {
  const px = (x, y) => { const i = (y * w + x) * 4; return [data[i], data[i + 1], data[i + 2], data[i + 3]]; };
  const avg = (pts) => pts.reduce((a, p) => [a[0] + p[0], a[1] + p[1], a[2] + p[2]], [0, 0, 0]).map((v) => Math.round(v / pts.length));
  const corner = [];
  for (const [cx, cy] of [[0, 0], [w - 12, 0], [0, h - 12], [w - 12, h - 12]]) for (let y = cy; y < cy + 12; y++) for (let x = cx; x < cx + 12; x++) corner.push(px(x, y));
  const bg = avg(corner);
  const buckets = new Map();
  for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) {
    const [r, g, b, a] = px(x, y); if (a < 128) continue;
    if (Math.abs(r - bg[0]) + Math.abs(g - bg[1]) + Math.abs(b - bg[2]) < 60) continue;
    const k = ((r >> 5) << 6) | ((g >> 5) << 3) | (b >> 5);
    const e = buckets.get(k) || { n: 0, r: 0, g: 0, b: 0 }; e.n++; e.r += r; e.g += g; e.b += b; buckets.set(k, e);
  }
  let best = null, score = -1, main = null, mainN = -1;
  for (const e of buckets.values()) {
    const c = [e.r / e.n, e.g / e.n, e.b / e.n];
    const sat = Math.max(...c) - Math.min(...c);
    if (e.n * (sat + 20) > score) { score = e.n * (sat + 20); best = c; }
    if (e.n > mainN) { mainN = e.n; main = c; }
  }
  const hex = (c) => '#' + (c || bg).map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
  return { bg: hex(bg), accent: hex(best), main: hex(main) };
}

async function getBatch(batch) {
  let sharp;
  try { sharp = (await import('sharp')).default; } catch (e) { console.error('sharp is missing. Run:  npm i sharp'); process.exit(1); }
  const slice = VILLAINS.slice(batch * BATCH, batch * BATCH + BATCH);
  if (!slice.length) { console.log('Nothing in that batch. Next: node scripts/build-villains.mjs pack'); return; }
  await mkdir(IMG_DIR, { recursive: true });
  console.log(`Batch ${batch}: villains ${batch * BATCH + 1}-${batch * BATCH + slice.length} of ${VILLAINS.length}`);
  const failed = [];
  for (const v of slice) {
    const out = path.join(IMG_DIR, `${v[0]}.webp`);
    if (await exists(out)) { console.log(`  · ${v[0]} already saved`); continue; }
    try {
      const url = await imageUrl(v);
      if (!url) throw new Error('no picture in the metadata');
      const buf = await download(url);
      await sharp(buf, { animated: false }).resize(SIZE, SIZE, { fit: 'cover' }).webp({ quality: 80 }).toFile(out);
      console.log(`  ✓ ${v[0]}`);
      await sleep(400);
    } catch (e) { failed.push(v[0]); console.log(`  ✗ ${v[0]}: ${e.message}`); }
  }
  const total = Math.ceil(VILLAINS.length / BATCH);
  console.log(failed.length ? `\n${failed.length} failed -> run this same batch again in a minute` :
    (batch + 1 < total ? `\nDone. Next: node scripts/build-villains.mjs get ${batch + 1}` : '\nAll batches done. Next: node scripts/build-villains.mjs pack'));
}

async function pack() {
  let sharp;
  try { sharp = (await import('sharp')).default; } catch (e) { console.error('sharp is missing. Run:  npm i sharp'); process.exit(1); }
  const out = {}; const missing = [];
  for (const [key] of VILLAINS) {
    const f = path.join(IMG_DIR, `${key}.webp`);
    if (!(await exists(f))) { missing.push(key); continue; }
    const file = await readFile(f);
    const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    out[key] = { img: 'data:image/webp;base64,' + file.toString('base64'), ...colours(data, info.width, info.height) };
  }
  await mkdir(path.dirname(PACK), { recursive: true });
  await writeFile(PACK, JSON.stringify(out));
  console.log(`Packed ${Object.keys(out).length} of ${VILLAINS.length} villains into data/villain-pack.json (${(JSON.stringify(out).length / 1024).toFixed(0)} KB).`);
  if (missing.length) console.log(`Missing (the game draws a stand-in for these): ${missing.join(', ')}`);
  console.log('Send data/villain-pack.json to Claude.');
}

const [cmd, arg] = process.argv.slice(2);
if (cmd === 'get') await getBatch(Number(arg || 0));
else if (cmd === 'pack') await pack();
else console.log('Usage: node scripts/build-villains.mjs get <batch 0..4> | pack');
