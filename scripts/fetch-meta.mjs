// PLUMPY — Step 1: pull Chog Genesis metadata from Monad, one batch at a time.
//
// Usage:   node scripts/fetch-meta.mjs <batch>
//          batch 0 = tokens 0-99, batch 1 = 100-199, ... batch 19 = 1900-1999
//
// Safe to re-run: tokens already saved in data/meta/ are skipped.
// No packages needed (Node 18+).
//
// Optional env vars:
//   MONAD_RPC     comma-separated RPC URLs (default: the 4 public Monad RPCs)
//   IPFS_GATEWAY  comma-separated IPFS gateways (default: 6 public gateways, rotated)

import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';

const CONTRACT = '0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763'; // Chog Genesis (Monad)
const RPCS = (process.env.MONAD_RPC ||
  'https://rpc.monad.xyz,https://rpc1.monad.xyz,https://rpc2.monad.xyz,https://rpc3.monad.xyz')
  .split(',').map((s) => s.trim()).filter(Boolean);
const GATEWAYS = (process.env.IPFS_GATEWAY ||
  'https://ipfs.io/ipfs/,https://w3s.link/ipfs/,https://4everland.io/ipfs/,https://ipfs.filebase.io/ipfs/,https://dweb.link/ipfs/,https://gateway.pinata.cloud/ipfs/')
  .split(',').map((s) => s.trim()).filter(Boolean).map((g) => (g.endsWith('/') ? g : g + '/'));
const IPFS_GAP_MS = 300; // at most ~3 IPFS requests per second overall
const BATCH_SIZE = 100;
const CONCURRENCY = 4;
const OUT_DIR = path.resolve('data/meta');

const batch = Number(process.argv[2]);
if (!Number.isInteger(batch) || batch < 0) {
  console.error('Usage: node scripts/fetch-meta.mjs <batch number>   e.g. node scripts/fetch-meta.mjs 0');
  process.exit(1);
}
const FROM = batch * BATCH_SIZE;
const TO = FROM + BATCH_SIZE - 1;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const exists = (p) => access(p).then(() => true, () => false);

// ---------- chain ----------

let rpcIndex = 0;
async function rpc(method, params) {
  let lastErr;
  for (let attempt = 0; attempt < 6; attempt++) {
    const url = RPCS[rpcIndex % RPCS.length];
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
        signal: AbortSignal.timeout(15000),
      });
      if (res.status === 429 || res.status >= 500) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.error) {
        // A revert means the token doesn't exist: report it, don't retry.
        if (/revert/i.test(json.error.message || '') || json.error.code === 3) return { error: json.error };
        throw new Error(`RPC error ${json.error.code}: ${json.error.message}`); // rate limit etc. -> retry
      }
      return { result: json.result };
    } catch (e) {
      lastErr = e;
      rpcIndex++; // rotate to the next RPC if more than one was given
      await sleep(500 * 2 ** attempt);
    }
  }
  throw new Error(`RPC failed after retries: ${lastErr?.message}`);
}

const encodeUint = (n) => BigInt(n).toString(16).padStart(64, '0');

// Decode an ABI-encoded `string` return value.
function decodeString(hex) {
  const h = hex?.startsWith('0x') ? hex.slice(2) : hex || '';
  if (h.length < 128) return null;
  const offset = parseInt(h.slice(0, 64), 16) * 2;
  const len = parseInt(h.slice(offset, offset + 64), 16) * 2;
  return Buffer.from(h.slice(offset + 64, offset + 64 + len), 'hex').toString('utf8');
}

// ---------- metadata ----------

// ipfs://CID/path -> "CID/path" (null if not an IPFS link)
function ipfsPath(uri) {
  if (!uri) return null;
  if (uri.startsWith('ipfs://')) return uri.slice(7).replace(/^ipfs\//, '');
  const m = uri.match(/\/ipfs\/(.+)$/); // already a gateway URL -> reuse its path
  return m ? m[1] : null;
}

function toHttp(uri) {
  if (!uri) return uri;
  const p = ipfsPath(uri);
  if (p) return GATEWAYS[0] + p;
  if (uri.startsWith('ar://')) return 'https://arweave.net/' + uri.slice(5);
  return uri;
}

// --- gateway rotation: a gateway that says "slow down" rests, the others take over ---
const cooldownUntil = new Map(); // gateway -> timestamp
let gwIndex = 0;
let lastIpfsAt = 0;
let pacing = Promise.resolve();

function pickGateway() {
  const now = Date.now();
  for (let i = 0; i < GATEWAYS.length; i++) {
    const g = GATEWAYS[(gwIndex + i) % GATEWAYS.length];
    if ((cooldownUntil.get(g) || 0) <= now) { gwIndex = (gwIndex + i + 1) % GATEWAYS.length; return { g }; }
  }
  const soonest = Math.min(...GATEWAYS.map((g) => cooldownUntil.get(g) || 0));
  return { waitMs: soonest - now };
}

function restGateway(g, ms, why) {
  if ((cooldownUntil.get(g) || 0) < Date.now()) console.log(`  ${new URL(g).host} ${why} -> resting ${Math.round(ms / 1000)}s, using others`);
  cooldownUntil.set(g, Date.now() + ms);
}

// keep overall IPFS traffic gentle
function paceIpfs() {
  pacing = pacing.then(async () => {
    const wait = lastIpfsAt + IPFS_GAP_MS - Date.now();
    if (wait > 0) await sleep(wait);
    lastIpfsAt = Date.now();
  });
  return pacing;
}

async function fetchJsonUrl(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) { const e = new Error(`HTTP ${res.status}`); e.status = res.status; e.retryAfter = Number(res.headers.get('retry-after')) || 0; throw e; }
  return res.json();
}

async function loadJson(uri) {
  if (uri.startsWith('data:')) {
    const comma = uri.indexOf(',');
    const head = uri.slice(5, comma);
    const body = uri.slice(comma + 1);
    const text = head.includes('base64') ? Buffer.from(body, 'base64').toString('utf8') : decodeURIComponent(body);
    return JSON.parse(text);
  }

  const p = ipfsPath(uri);
  if (!p) { // plain https / arweave link
    let lastErr;
    for (let attempt = 0; attempt < 5; attempt++) {
      try { return await fetchJsonUrl(toHttp(uri)); } catch (e) { lastErr = e; await sleep(800 * 2 ** attempt); }
    }
    throw new Error(`metadata fetch failed (${uri}): ${lastErr?.message}`);
  }

  let lastErr;
  for (let attempt = 0; attempt < 12; attempt++) {
    const pick = pickGateway();
    if (pick.waitMs) { await sleep(pick.waitMs); continue; }
    await paceIpfs();
    try {
      return await fetchJsonUrl(pick.g + p);
    } catch (e) {
      lastErr = e;
      if (e.status === 429) restGateway(pick.g, (e.retryAfter || 30) * 1000, 'rate-limited');
      else restGateway(pick.g, 10000, `failed (${e.message})`);
    }
  }
  throw new Error(`metadata fetch failed (ipfs://${p}): ${lastErr?.message}`);
}

async function fetchToken(id) {
  const file = path.join(OUT_DIR, `${id}.json`);
  if (await exists(file)) return 'skipped';

  const r = await rpc('eth_call', [{ to: CONTRACT, data: '0xc87b56dd' + encodeUint(id) }, 'latest']); // tokenURI(id)
  if (r.error) return 'missing';
  const tokenURI = decodeString(r.result);
  if (!tokenURI) return 'missing';

  const meta = await loadJson(tokenURI);
  const image = meta.image ?? meta.image_url ?? null;
  const out = {
    tokenId: id,
    name: meta.name ?? null,
    tokenURI: tokenURI.startsWith('data:') ? '(onchain data URI)' : tokenURI,
    image: image && image.startsWith('data:') ? '(onchain data URI)' : image,
    imageHttp: image && !image.startsWith('data:') ? toHttp(image) : null,
    imageIsOnchain: Boolean(image && image.startsWith('data:')),
    attributes: meta.attributes ?? [],
    extraKeys: Object.keys(meta).filter((k) => !['name', 'image', 'image_url', 'attributes'].includes(k)),
  };
  await writeFile(file, JSON.stringify(out, null, 2));
  return { saved: out };
}

// ---------- run ----------

await mkdir(OUT_DIR, { recursive: true });
console.log(`PLUMPY fetch · batch ${batch} · tokens ${FROM}-${TO} · ${RPCS.length} RPCs · ${GATEWAYS.length} IPFS gateways`);

const ids = Array.from({ length: TO - FROM + 1 }, (_, i) => FROM + i);
const stats = { saved: 0, skipped: 0, missing: [], failed: [] };
let sample = null;
let next = 0;
let done = 0;

async function worker() {
  while (next < ids.length) {
    const id = ids[next++];
    try {
      const s = await fetchToken(id);
      if (s === 'skipped') stats.skipped++;
      else if (s === 'missing') stats.missing.push(id);
      else { stats.saved++; sample ??= s.saved; }
    } catch (e) {
      stats.failed.push(id);
      console.error(`  #${id} failed: ${e.message}`);
    }
    done++;
    if (done % 10 === 0) process.stdout.write(`  ${done}/${ids.length}\n`);
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

console.log('\n---- RESULT ----');
console.log(`saved: ${stats.saved} · already had: ${stats.skipped} · not minted: ${stats.missing.length} · failed: ${stats.failed.length}`);
if (stats.missing.length) console.log(`not minted / no tokenURI: ${stats.missing.join(', ')}`);
if (stats.failed.length) console.log(`FAILED (just re-run this same batch): ${stats.failed.join(', ')}`);

if (sample) {
  console.log('\n---- SAMPLE (paste this back to Claude) ----');
  console.log(JSON.stringify(sample, null, 2));
}
process.exit(stats.failed.length ? 1 : 0);
