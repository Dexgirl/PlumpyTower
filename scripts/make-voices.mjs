// PLUMPY — record every character line with ElevenLabs, in small batches.
//
//   node scripts/make-voices.mjs voices            match the voices you saved in ElevenLabs to the cast (fills voice/voices.json)
//   node scripts/make-voices.mjs voices --fallback same, and any role you didn't design gets one of ElevenLabs' built-in voices
//   node scripts/make-voices.mjs check             check key + voices, show how many credits the whole script needs
//   node scripts/make-voices.mjs samples           record one short sample per voice into voice/samples/ (listen before the big run)
//   node scripts/make-voices.mjs samples --again   delete the old samples and record them again
//   node scripts/make-voices.mjs say 0             record batch 0 (25 lines) into voice/audio/<ID>.mp3
//   node scripts/make-voices.mjs say 1-5           record batches 1 to 5, one after the other
//   node scripts/make-voices.mjs redo v12_gloat p_idle_0   delete and re-record just those lines
//   node scripts/make-voices.mjs sfx               make the sound effects (stomach growl, bone rattle, saw...) into voice/sfx/
//   node scripts/make-voices.mjs sfx --again bone_rattle    re-make just those sounds
//   node scripts/make-voices.mjs pack              bundle clips + word timings + sounds into data/voice-pack.json (send it to Claude)
//
// Needs Node 18+ and your API key in THIS terminal (it is never saved to a file):
//   read -rsp "ElevenLabs API key: " ELEVENLABS_API_KEY && export ELEVENLABS_API_KEY && echo
// Optional: ELEVEN_MODEL (default eleven_v3: every line is ACTED, it laughs at [laughs], whispers at [whispers]...
//           eleven_flash_v2_5 costs about half but just reads the lines; eleven_multilingual_v2 same price as v3, no acting tags)
//           ELEVEN_STABILITY (v3 only: 0 = most expressive, 0.5 = natural (default), 1 = steadiest)
//           ELEVEN_FORMAT (default mp3_44100_64: clean enough to polish afterwards)
// Safe to re-run: lines that already have an .mp3 are skipped.
import { readFile, writeFile, mkdir, access, rm } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

const KEY = (process.env.ELEVENLABS_API_KEY || '').trim();
const BASE = (process.env.ELEVEN_BASE || 'https://api.elevenlabs.io').replace(/\/$/, '');
const MODEL = process.env.ELEVEN_MODEL || 'eleven_v3';
let FORMAT = process.env.ELEVEN_FORMAT || 'mp3_44100_64';
const BATCH = 25;
const SCRIPT = path.resolve('voice/voice-script.json');
const VOICES = path.resolve('voice/voices.json');
const AUDIO = path.resolve('voice/audio');
const SAMPLES = path.resolve('voice/samples');
const SFXDIR = path.resolve('voice/sfx');
const PAUSE = Number(process.env.ELEVEN_PAUSE ?? 300); // ms between requests, to be gentle with the API
const SFX_PER_SEC = 40; // ElevenLabs charges about 40 credits per second of sound effect
const PACK = path.resolve('data/voice-pack.json');
const V3 = /^eleven_v[34]/.test(MODEL); // models that act out [audio tags]
const STAB = [0, 0.5, 1].includes(Number(process.env.ELEVEN_STABILITY)) ? Number(process.env.ELEVEN_STABILITY) : 0.5;
const HALF = /flash|turbo/.test(MODEL);
// built-in ElevenLabs voices to use for a role you didn't design (first one your account has wins)
const FALLBACK = {
  narrator: ['Alice', 'Matilda', 'Charlotte', 'Laura', 'Sarah', 'George'],
  plumpy: ['Lily', 'Jessica', 'Laura', 'Aria', 'Alice'],
  bear: ['Bill', 'Brian', 'George', 'Daniel', 'Roger'],
  chog_common: ['Jessica', 'Laura', 'Lily', 'Aria'],
  chog_cool: ['Liam', 'Will', 'Charlie', 'Eric'],
  chog_skull: ['Callum', 'River', 'Chris'],
  chog_toxic: ['Charlie', 'Will', 'Liam'],
  legend_scream: ['Jessica', 'Laura', 'Aria'],
  legend_grim: ['Brian', 'Bill', 'Daniel'],
  legend_abom: ['Callum', 'Bill', 'Chris'],
  legend_blaze: ['Liam', 'Will', 'Charlie'],
  legend_skully: ['Callum', 'Roger', 'Chris'],
  legend_midas: ['George', 'Daniel', 'Charlotte'],
  v_gremlin: ['Charlie', 'Will', 'Liam'],
  v_menace: ['Bill', 'Brian', 'Daniel'],
  v_bot: ['River', 'Eric', 'Roger'],
  v_diva: ['Charlotte', 'Sarah', 'Aria'],
  v_bro: ['Chris', 'Will', 'Eric'],
  v_creep: ['Callum', 'River', 'Roger'],
  v_cute: ['Lily', 'Jessica', 'Laura'],
  v_regal: ['George', 'Daniel', 'Brian'],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const exists = (p) => access(p).then(() => true, () => false);
const loadJson = async (p) => JSON.parse(await readFile(p, 'utf8'));
const needKey = () => { if (!KEY) { console.error('No API key in this terminal. First run:\n  read -rsp "ElevenLabs API key: " ELEVENLABS_API_KEY && export ELEVENLABS_API_KEY && echo'); process.exit(1); } };
const api = (p, opts = {}) => fetch(BASE + p, { ...opts, headers: { 'xi-api-key': KEY, ...(opts.headers || {}) }, signal: AbortSignal.timeout(90000) });
const textOf = (l) => (V3 ? l.text_v3 : l.text);
const hasId = (c) => c && c.voice_id && !String(c.voice_id).startsWith('PASTE');
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');

async function listVoices() {
  const res = await api('/v1/voices');
  if (res.status === 401) { console.error('The API key was rejected (401). Copy it again from elevenlabs.io > Developers > API Keys.'); process.exit(1); }
  if (!res.ok) { console.error(`Could not list voices: HTTP ${res.status} ${(await res.text()).slice(0, 300)}`); process.exit(1); }
  return (await res.json()).voices || [];
}

// role hints, used to pick a built-in voice by its labels when none of the names above exist on your account
const HINT = {
  narrator: 'female middle warm', plumpy: 'female young', bear: 'male old deep', chog_common: 'female young', chog_cool: 'male young casual',
  chog_skull: 'male raspy', chog_toxic: 'male young energetic', legend_scream: 'female young', legend_grim: 'male old deep',
  legend_abom: 'male deep', legend_blaze: 'male young energetic', legend_skully: 'male raspy', legend_midas: 'male middle',
  v_gremlin: 'male young', v_menace: 'male deep', v_bot: 'male neutral', v_diva: 'female confident', v_bro: 'male young casual',
  v_creep: 'male raspy', v_cute: 'female young', v_regal: 'male middle deep',
};
const firstWord = (s) => String(s).trim().split(/[^A-Za-z0-9]+/)[0].toLowerCase();
const shortName = (s) => String(s).split(/\s+[-–—|]\s+/)[0].trim();

function pickBuiltIn(k, builtins, used) {
  const uses = (v) => used.get(v.voice_id) || 0;
  // 1) the named voices for this role (ElevenLabs names look like "Sarah - Mature, Reassuring", so match the first word)
  const named = (FALLBACK[k] || []).map((n) => builtins.find((v) => firstWord(v.name) === n.toLowerCase())).filter(Boolean);
  if (named.length) return named.find((v) => !uses(v)) || named[0];
  // 2) otherwise score every built-in voice by its labels (gender, age, description)
  const want = (HINT[k] || '').split(' ').filter(Boolean);
  let best = null, bestScore = -1e9;
  for (const v of builtins) {
    const L = v.labels || {};
    const bag = [L.gender, L.age, L.description, L.use_case, L.descriptive, v.name].join(' ').toLowerCase();
    let sc = -1.5 * uses(v);
    for (const w of want) {
      if (w === 'male' || w === 'female') sc += String(L.gender || '').toLowerCase() === w ? 4 : (bag.includes(w === 'male' ? ' male' : 'female') ? 1 : 0);
      else if (w === 'middle') sc += /middle/.test(bag) ? 2 : 0;
      else sc += bag.includes(w) ? 2 : 0;
    }
    if (sc > bestScore) { best = v; bestScore = sc; }
  }
  return best;
}

async function voices(useFallback) {
  needKey();
  const cast = await loadJson(VOICES);
  const list = await listVoices();
  console.log(`Your ElevenLabs account has ${list.length} voices.\n`);
  let mine = 0, fb = 0;
  const missing = [];
  const designed = new Set();
  const found = {};
  for (const [k, c] of Object.entries(cast)) {
    const hit = list.find((v) => norm(v.name) === norm(c.name)) || list.find((v) => norm(v.name).startsWith(norm(c.name)));
    if (hit) { found[k] = hit; designed.add(hit.voice_id); }
  }
  let builtins = list.filter((v) => !designed.has(v.voice_id) && v.category === 'premade');
  if (!builtins.length) builtins = list.filter((v) => !designed.has(v.voice_id));
  const used = new Map();
  for (const [k, c] of Object.entries(cast)) {
    const hit = found[k];
    if (hit) { c.voice_id = hit.voice_id; c.using = hit.name; mine++; console.log(`  ✓ ${c.name.padEnd(18)} your voice "${hit.name}"`); continue; }
    if (useFallback && builtins.length) {
      const v = pickBuiltIn(k, builtins, used);
      if (v) {
        used.set(v.voice_id, (used.get(v.voice_id) || 0) + 1);
        c.voice_id = v.voice_id; c.using = shortName(v.name) + ' (built-in)'; fb++;
        console.log(`  ~ ${c.name.padEnd(18)} built-in voice "${shortName(v.name)}"`); continue;
      }
    }
    if (!hasId(c)) missing.push(c.name);
    console.log(`  ✗ ${c.name.padEnd(18)} not found${hasId(c) ? ' (keeping the ID already in voices.json)' : ''}`);
  }
  await writeFile(VOICES, JSON.stringify(cast, null, 2));
  console.log(`\n${mine} designed voices, ${fb} built-in voices${missing.length ? `, ${missing.length} still missing: ${missing.join(', ')}` : ''}.`);
  if (missing.length) console.log(useFallback ? 'Design those in ElevenLabs (save them with exactly those names), or paste a voice ID into voice/voices.json.' : 'Design them in ElevenLabs with exactly those names, or run:  node scripts/make-voices.mjs voices --fallback');
  else console.log('Next:  node scripts/make-voices.mjs check');
}

async function check() {
  const script = await loadJson(SCRIPT);
  const { lines } = script;
  const lib = script.sfx || {};
  const cast = await loadJson(VOICES);
  const missing = Object.values(cast).filter((c) => !hasId(c)).map((c) => c.name);
  const seen = new Set(); let chars = 0, charsLeft = 0;
  for (const l of lines) {
    const k = l.voice + '|' + textOf(l);
    if (seen.has(k)) continue;
    seen.add(k); chars += textOf(l).length;
    if (!(await exists(path.join(AUDIO, `${l.id}.mp3`)))) charsLeft += textOf(l).length;
  }
  const credits = Math.round(HALF ? chars / 2 : chars), creditsLeft = Math.round(HALF ? charsLeft / 2 : charsLeft);
  let done = 0; for (const l of lines) if (await exists(path.join(AUDIO, `${l.id}.mp3`))) done++;
  let sfxDone = 0, sfxSecLeft = 0;
  for (const [k, x] of Object.entries(lib)) { if (await exists(path.join(SFXDIR, `${k}.mp3`))) sfxDone++; else sfxSecLeft += x.seconds; }
  const sfxCredits = Math.round(sfxSecLeft * SFX_PER_SEC);
  console.log(`Script: ${lines.length} lines (${seen.size} different ones; repeats are copied, not paid twice).`);
  console.log(`Model: ${MODEL}${V3 ? ' (acted: laughs, whispers, screams...)' : ' (read out, no acting)'} · about ${credits} credits for the whole script.`);
  console.log(`Lines recorded: ${done} of ${lines.length}. Batches: 0 to ${Math.ceil(lines.length / BATCH) - 1} (${BATCH} lines each).`);
  if (Object.keys(lib).length) console.log(`Sound effects: ${sfxDone} of ${Object.keys(lib).length} made${sfxSecLeft ? ` · about ${sfxCredits} credits for the rest  ->  node scripts/make-voices.mjs sfx` : ''}.`);
  console.log(missing.length ? `Missing voices: ${missing.join(', ')}  ->  node scripts/make-voices.mjs voices --fallback` : `All ${Object.keys(cast).length} voices are set.`);
  if (!KEY) { console.log('No API key set in this terminal yet.'); return; }
  const res = await api('/v1/user/subscription').catch(() => null);
  if (res && res.ok) {
    const s = await res.json(); const left = (s.character_limit || 0) - (s.character_count || 0);
    const need = creditsLeft + sfxCredits;
    console.log(`Your plan: ${s.tier || '?'} · credits left this month: ${left}`);
    if (left < need) console.log(`Heads up: what's left needs about ${need} credits. Record in batches; top up or wait for the monthly reset to finish.`);
    else console.log(`Enough credits for what's left (about ${need}), with about ${left - need} to spare for re-takes.`);
  } else if (res && res.status === 401) console.log('Could not read your credits (401). If "voices" worked, the key is fine: it just has no "User: Read" permission. Recording still works.');
  else console.log('Could not read your credits (that is fine, recording still works).');
}

function apiError(res, msg) {
  if (/quota|credit|limit_reached|insufficient/i.test(msg)) { console.error(`\nOut of credits: ${msg.slice(0, 200)}\nEverything made so far is saved. Top up (or wait for the monthly reset) and re-run the same command.`); process.exit(2); }
  if (res.status === 401 && /permission|missing_permissions|not allowed/i.test(msg)) { console.error(`\nYour API key is missing a permission: ${msg.slice(0, 240)}\nOn elevenlabs.io > Developers > API Keys, edit the key (or make a new one) and switch that permission to Access.`); process.exit(1); }
  if (res.status === 401) { console.error('The API key was rejected (401).'); process.exit(1); }
}

// word timings from ElevenLabs' character timings: [[word, start, end], ...] (audio tags in [brackets] are skipped)
function wordsFrom(al) {
  if (!al || !Array.isArray(al.characters)) return null;
  const out = []; let w = '', ws = 0, we = 0, inTag = false;
  const flush = () => { const t = w.replace(/^'+|'+$/g, ''); if (t) out.push([t, Math.round(ws * 100) / 100, Math.round(we * 100) / 100]); w = ''; };
  al.characters.forEach((ch, i) => {
    if (ch === '[') { flush(); inTag = true; return; }
    if (ch === ']') { inTag = false; return; }
    if (inTag) return;
    if (/[A-Za-z0-9']/.test(ch)) { if (!w) ws = al.character_start_times_seconds[i]; w += ch; we = al.character_end_times_seconds[i]; } else flush();
  });
  flush();
  return out;
}

let TIMESTAMPS = true; // ask for word timings too (same price); switched off if the model doesn't offer them
async function tts(voiceId, text) {
  const settings = !V3 ? { stability: 0.35, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true }
    : MODEL.startsWith('eleven_v4') ? { stability: STAB, similarity_boost: 0.8 } : { stability: STAB };
  const body = { text, model_id: MODEL, voice_settings: settings };
  for (let attempt = 0; attempt < 6; attempt++) {
    let res;
    const url = `/v1/text-to-speech/${voiceId}${TIMESTAMPS ? '/with-timestamps' : ''}?output_format=${FORMAT}`;
    try {
      res = await api(url, { method: 'POST', headers: { 'content-type': 'application/json', accept: TIMESTAMPS ? 'application/json' : 'audio/mpeg' }, body: JSON.stringify(body) });
    } catch (e) { console.log(`    network problem (${e.message}), retrying...`); await sleep(3000 * (attempt + 1)); continue; }
    if (res.ok) {
      if (!TIMESTAMPS) return { audio: Buffer.from(await res.arrayBuffer()), words: null };
      const j = await res.json();
      return { audio: Buffer.from(j.audio_base64 || '', 'base64'), words: wordsFrom(j.alignment) || wordsFrom(j.normalized_alignment) };
    }
    const msg = await res.text();
    apiError(res, msg);
    if (res.status === 429) { const wait = (Number(res.headers.get('retry-after')) || 5 * (attempt + 1)) * 1000; console.log(`    busy (429), waiting ${Math.round(wait / 1000)}s...`); await sleep(wait); continue; }
    if (/output_format/i.test(msg) && FORMAT !== 'mp3_44100_64') { console.log(`    ${FORMAT} is not allowed on this plan, switching to mp3_44100_64`); FORMAT = 'mp3_44100_64'; continue; }
    if (TIMESTAMPS && res.status >= 400 && res.status < 500) { console.log(`    word timings not available here (HTTP ${res.status}), recording without them`); TIMESTAMPS = false; continue; }
    if (res.status >= 500) { await sleep(3000 * (attempt + 1)); continue; }
    throw new Error(`HTTP ${res.status}: ${msg.slice(0, 300)}`);
  }
  throw new Error('gave up after 6 tries');
}

// the same line said by the same voice is recorded once, then copied (saves credits)
let TWINS = null;
async function twinsOf(l) {
  if (!TWINS) {
    TWINS = new Map();
    for (const x of (await loadJson(SCRIPT)).lines) { const k = x.voice + '|' + textOf(x); if (!TWINS.has(k)) TWINS.set(k, []); TWINS.get(k).push(x.id); }
  }
  return (TWINS.get(l.voice + '|' + textOf(l)) || []).filter((id) => id !== l.id);
}

async function recordLines(list, cast, label, { reuse = true } = {}) {
  await mkdir(AUDIO, { recursive: true });
  let ok = 0, skipped = 0, copied = 0; const failed = [];
  for (const l of list) {
    const out = path.join(AUDIO, `${l.id}.mp3`), outT = path.join(AUDIO, `${l.id}.json`);
    if (await exists(out)) { skipped++; continue; }
    if (reuse) {
      let twin = null;
      for (const id of await twinsOf(l)) if (await exists(path.join(AUDIO, `${id}.mp3`))) { twin = id; break; }
      if (twin) {
        await writeFile(out, await readFile(path.join(AUDIO, `${twin}.mp3`)));
        if (await exists(path.join(AUDIO, `${twin}.json`))) await writeFile(outT, await readFile(path.join(AUDIO, `${twin}.json`)));
        copied++; console.log(`  = ${l.id.padEnd(14)} same line as ${twin}, copied (free)`); continue;
      }
    }
    const c = cast[l.voice];
    if (!hasId(c)) { failed.push(l.id); console.log(`  ✗ ${l.id}: no voice set for "${c ? c.name : l.voice}" yet`); continue; }
    try {
      const { audio, words } = await tts(c.voice_id, textOf(l));
      if (!audio.length) throw new Error('empty audio came back');
      await writeFile(out, audio);
      if (words) await writeFile(outT, JSON.stringify({ model: MODEL, words }));
      else await rm(outT, { force: true });
      ok++; console.log(`  ✓ ${l.id.padEnd(14)} ${c.name.padEnd(18)} "${textOf(l).slice(0, 56)}"`);
      await sleep(PAUSE);
    } catch (e) { failed.push(l.id); console.log(`  ✗ ${l.id}: ${e.message}`); }
  }
  console.log(`${label}: saved ${ok} · copied ${copied} · already had ${skipped} · failed ${failed.length}${failed.length ? ` (${failed.slice(0, 8).join(', ')}) -> re-run the same command` : ''}`);
  return failed.length;
}

async function say(arg) {
  needKey();
  const { lines } = await loadJson(SCRIPT);
  const cast = await loadJson(VOICES);
  const total = Math.ceil(lines.length / BATCH);
  const m = /^(\d+)(?:-(\d+))?$/.exec(String(arg || '0'));
  if (!m) { console.log('Usage: say 3   or   say 3-7'); return; }
  const from = Number(m[1]), to = Math.min(total - 1, Number(m[2] ?? m[1]));
  if (from > total - 1) { console.log(`There are only batches 0 to ${total - 1}. Next: node scripts/make-voices.mjs pack`); return; }
  let fails = 0;
  for (let b = from; b <= to; b++) {
    const slice = lines.slice(b * BATCH, b * BATCH + BATCH);
    console.log(`\nBatch ${b} of ${total - 1}: lines ${b * BATCH + 1}-${b * BATCH + slice.length} of ${lines.length} · ${MODEL}`);
    fails += await recordLines(slice, cast, `Batch ${b}`);
  }
  if (!fails) console.log(to + 1 < total ? `\nNext:  node scripts/make-voices.mjs say ${to + 1}${to + 1 < total - 1 ? `-${Math.min(total - 1, to + 5)}` : ''}` : '\nAll batches done. Next:  node scripts/make-voices.mjs pack');
}

async function redo(ids) {
  needKey();
  if (!ids.length) { console.log('Usage: redo <ID> [<ID> ...]   (IDs are in voice/VOICE-SCRIPT.md)'); return; }
  const { lines } = await loadJson(SCRIPT);
  const cast = await loadJson(VOICES);
  const list = lines.filter((l) => ids.includes(l.id));
  const unknown = ids.filter((id) => !lines.some((l) => l.id === id));
  if (unknown.length) console.log(`Not in the script: ${unknown.join(', ')}`);
  for (const l of list) { await rm(path.join(AUDIO, `${l.id}.mp3`), { force: true }); await rm(path.join(AUDIO, `${l.id}.json`), { force: true }); }
  await recordLines(list, cast, 'Re-recorded', { reuse: false });
}

async function samples(again) {
  needKey();
  const cast = await loadJson(VOICES);
  const script = await loadJson(SCRIPT);
  const acted = (V3 && script.samples) || {};
  await mkdir(SAMPLES, { recursive: true });
  if (again) for (const k of Object.keys(cast)) await rm(path.join(SAMPLES, `${k}.mp3`), { force: true });
  console.log(`Recording one sample per voice into voice/samples/ (${MODEL})`);
  const was = TIMESTAMPS; TIMESTAMPS = false;
  for (const [k, c] of Object.entries(cast)) {
    if (!hasId(c)) { console.log(`  ✗ ${c.name}: no voice set yet`); continue; }
    const out = path.join(SAMPLES, `${k}.mp3`);
    if (await exists(out)) { console.log(`  · ${c.name} (already there)`); continue; }
    try { await writeFile(out, (await tts(c.voice_id, acted[k] || c.sample)).audio); console.log(`  ✓ ${c.name.padEnd(18)} -> voice/samples/${k}.mp3`); await sleep(PAUSE); }
    catch (e) { console.log(`  ✗ ${c.name}: ${e.message}`); }
  }
  TIMESTAMPS = was;
  console.log('\nListen to them in Windows:  (cd voice/samples && explorer.exe .)\nDon\'t like one? Pick or design another voice in ElevenLabs, run  voices  again, delete that sample file and run  samples  again.');
}

// ---------------------------------------------------------------- sound effects
async function makeSound(prompt, seconds) {
  const body = { text: prompt, duration_seconds: seconds, prompt_influence: 0.6 };
  for (let attempt = 0; attempt < 6; attempt++) {
    let res;
    try { res = await api('/v1/sound-generation?output_format=mp3_44100_128', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'audio/mpeg' }, body: JSON.stringify(body) }); }
    catch (e) { console.log(`    network problem (${e.message}), retrying...`); await sleep(3000 * (attempt + 1)); continue; }
    if (res.ok) return { audio: Buffer.from(await res.arrayBuffer()), cost: Number(res.headers.get('character-cost')) || 0 };
    const msg = await res.text();
    apiError(res, msg);
    if (res.status === 429) { const wait = (Number(res.headers.get('retry-after')) || 5 * (attempt + 1)) * 1000; console.log(`    busy (429), waiting ${Math.round(wait / 1000)}s...`); await sleep(wait); continue; }
    if (res.status >= 500) { await sleep(3000 * (attempt + 1)); continue; }
    throw new Error(`HTTP ${res.status}: ${msg.slice(0, 300)}`);
  }
  throw new Error('gave up after 6 tries');
}

async function sfx(args) {
  needKey();
  const lib = (await loadJson(SCRIPT)).sfx || {};
  const again = args.includes('--again');
  const only = args.filter((a) => !a.startsWith('--'));
  const unknown = only.filter((k) => !lib[k]);
  if (unknown.length) console.log(`Not a sound in the script: ${unknown.join(', ')}  (the list is in voice/voice-script.json, under "sfx")`);
  await mkdir(SFXDIR, { recursive: true });
  const todo = Object.entries(lib).filter(([k]) => !only.length || only.includes(k));
  if (again) for (const [k] of todo) await rm(path.join(SFXDIR, `${k}.mp3`), { force: true });
  let made = 0, had = 0, spent = 0; const failed = [];
  console.log(`Making ${todo.length} sound effects into voice/sfx/ (about ${SFX_PER_SEC} credits per second of sound)`);
  for (const [k, x] of todo) {
    const out = path.join(SFXDIR, `${k}.mp3`);
    if (await exists(out)) { had++; continue; }
    try {
      const { audio, cost } = await makeSound(x.prompt, x.seconds);
      await writeFile(out, audio); made++; spent += cost;
      console.log(`  ✓ ${k.padEnd(16)} ${x.seconds}s  "${x.prompt.slice(0, 60)}"`);
      await sleep(PAUSE);
    } catch (e) { failed.push(k); console.log(`  ✗ ${k}: ${e.message}`); }
  }
  console.log(`Sound effects: made ${made} · already had ${had} · failed ${failed.length}${spent ? ` · used ${spent} credits` : ''}${failed.length ? ` (${failed.join(', ')}) -> re-run the same command` : ''}`);
  if (!failed.length) console.log('Listen in Windows:  (cd voice/sfx && explorer.exe .)   Don\'t like one? node scripts/make-voices.mjs sfx --again <name>');
}

// ---------------------------------------------------------------- pack for Claude
const PART_MAX = 20 * 1048576; // keep each file under ~20 MB so it uploads
async function pack() {
  const script = await loadJson(SCRIPT);
  const { lines } = script;
  const clips = {}, same = {}, align = {}, sounds = {}; const missing = [];
  const byAudio = new Map();
  for (const l of lines) {
    const f = path.join(AUDIO, `${l.id}.mp3`);
    if (!(await exists(f))) { missing.push(l.id); continue; }
    const buf = await readFile(f);
    const key = createHash('sha256').update(buf).digest('hex');
    if (byAudio.has(key)) same[l.id] = byAudio.get(key);
    else { byAudio.set(key, l.id); clips[l.id] = 'data:audio/mpeg;base64,' + buf.toString('base64'); }
    const t = path.join(AUDIO, `${l.id}.json`);
    if (await exists(t)) { try { align[l.id] = JSON.parse(await readFile(t, 'utf8')).words; } catch {} }
  }
  for (const k of Object.keys(script.sfx || {})) {
    const f = path.join(SFXDIR, `${k}.mp3`);
    if (await exists(f)) sounds[k] = 'data:audio/mpeg;base64,' + (await readFile(f)).toString('base64');
  }
  await mkdir(path.dirname(PACK), { recursive: true });
  for (const f of ['voice-pack.json', 'voice-pack-2.json', 'voice-pack-3.json', 'voice-pack-4.json']) await rm(path.join(path.dirname(PACK), f), { force: true });
  // split the clips into parts that each stay under PART_MAX
  const parts = [{}]; let size = 0;
  const base = JSON.stringify({ v: 3, model: MODEL, format: FORMAT, same, align, sfx: sounds }).length;
  size = base;
  for (const [id, uri] of Object.entries(clips)) {
    if (size + uri.length > PART_MAX && Object.keys(parts[parts.length - 1]).length) { parts.push({}); size = 0; }
    parts[parts.length - 1][id] = uri; size += uri.length + id.length + 6;
  }
  const names = [];
  for (let i = 0; i < parts.length; i++) {
    const name = i === 0 ? 'voice-pack.json' : `voice-pack-${i + 1}.json`;
    const doc = i === 0 ? { v: 3, model: MODEL, format: FORMAT, parts: parts.length, part: 1, clips: parts[0], same, align, sfx: sounds } : { v: 3, parts: parts.length, part: i + 1, clips: parts[i] };
    const json = JSON.stringify(doc);
    await writeFile(path.join(path.dirname(PACK), name), json);
    names.push(`${name} (${(json.length / 1048576).toFixed(1)} MB)`);
  }
  const recorded = lines.length - missing.length;
  console.log(`Packed ${recorded} of ${lines.length} lines (${Object.keys(clips).length} different recordings), word timings for ${Object.keys(align).length}, and ${Object.keys(sounds).length} of ${Object.keys(script.sfx || {}).length} sound effects.`);
  console.log(`Files: ${names.join(', ')}`);
  if (missing.length) console.log(`Not recorded yet (the game uses the browser voice for these): ${missing.slice(0, 15).join(', ')}${missing.length > 15 ? ` and ${missing.length - 15} more` : ''}`);
  console.log(`Open the folder in Windows:  (cd data && explorer.exe .)   then drag ${names.length > 1 ? 'all the voice-pack files' : 'voice-pack.json'} into your chat with Claude.`);
}

const [cmd, ...rest] = process.argv.slice(2);
if (cmd === 'voices') await voices(rest.includes('--fallback'));
else if (cmd === 'check') await check();
else if (cmd === 'samples') await samples(rest.includes('--again'));
else if (cmd === 'say') await say(rest[0]);
else if (cmd === 'redo') await redo(rest);
else if (cmd === 'sfx') await sfx(rest);
else if (cmd === 'pack') await pack();
else console.log('Usage: node scripts/make-voices.mjs voices [--fallback] | check | samples [--again] | sfx [--again] [names] | say <batch or from-to> | redo <IDs> | pack');
