// Builds voice/voice-script.json, voice/voices.json and voice/VOICE-SCRIPT.md from the game data.
//   node scripts/build-voice-script.cjs
const fs = require('fs');
const { perform, plain, SAMPLE_PERF, SFX, cuesFor } = require('./voice-performance.cjs');
const P = '/home/claude/plumpy/prototype/parts/';
const api = new Function('const Matter = {};\n' + fs.readFileSync(P + 'physics.js', 'utf8') + '\n' + fs.readFileSync(P + 'levels.js', 'utf8') + '\n' + fs.readFileSync(P + 'villains.js', 'utf8') + '\n' + fs.readFileSync(P + 'fight.js', 'utf8') + '\n' + fs.readFileSync(P + 'voicelines.js', 'utf8') + '\n; return { buildLevels, buildVoiceScript, CAST, VOICE_TAGS };')();
const pack = JSON.parse(fs.readFileSync('/home/claude/plumpy/data/plumpy-pack.json', 'utf8'));
const byToken = Object.fromEntries(pack.chogs.map((c) => [c.token, c]));
const levels = api.buildLevels();
const lines = api.buildVoiceScript(levels, byToken);
// clean text for recording: drop the "— The Bear" signature; *action* -> v3 tag or plain word
const forV2 = (t) => t.replace(/\s*—\s*The Bear\s*$/, '').replace(/\*([^*\s]+)\*/g, '$1').replace(/\s*\*[^*]+\*\s*/g, ' ').replace(/\$CHOG/g, 'CHOG').trim();
const forV3 = (id, t) => { const tag = api.VOICE_TAGS[id] ? api.VOICE_TAGS[id] + ' ' : ''; return (tag + t.replace(/\s*—\s*The Bear\s*$/, '').replace(/\*([^*]+)\*/g, '[$1]').replace(/\$CHOG/g, 'CHOG')).trim(); };
// raw v3 text keeps the *actions* as [tags] but not the old one-size-fits-all VOICE_TAGS; voice-performance.cjs directs every line
const rawV3 = (t) => t.replace(/\s*—\s*The Bear\s*$/, '').replace(/\*([^*]+)\*/g, '[$1]').replace(/\$CHOG/g, 'CHOG').trim();
const out = lines.map((l) => {
  const base = { id: l.id, voice: l.voice, where: l.where, text: forV2(l.text), text_v3: rawV3(l.text) };
  const cues = cuesFor(base);
  return { id: l.id, voice: l.voice, where: l.where, text: plain(base), text_v3: perform(base), ...(cues.length ? { sfx: cues } : {}) };
});
for (const l of out) { if (!l.text || !l.text_v3.replace(/\[[^\]]*\]/g, '').trim()) throw new Error('empty line ' + l.id); }
// every cue must name a known sound and a word that is really in the line
const SPOT = new Set(['before', 'after', 'under']);
for (const l of out) for (const c of l.sfx || []) {
  if (!SFX[c.sfx]) throw new Error(`${l.id}: unknown sound ${c.sfx}`);
  if (SPOT.has(c.at)) continue;
  const words = l.text_v3.replace(/\[[^\]]*\]/g, ' ').split(/[^A-Za-z0-9']+/).map((w) => w.replace(/^'+|'+$/g, '')).filter(Boolean);
  const hits = words.filter((w) => w.toLowerCase() === c.at.toLowerCase()).length;
  if (hits < (c.n || 1)) throw new Error(`${l.id}: cue word "${c.at}" (#${c.n || 1}) not in: ${l.text_v3}`);
}
const sfxLib = Object.fromEntries(Object.entries(SFX).map(([k, [prompt, sec]]) => [k, { prompt, seconds: sec }]));
const usedSfx = new Set(out.flatMap((l) => (l.sfx || []).map((c) => c.sfx)));
for (const k of Object.keys(sfxLib)) if (!usedSfx.has(k)) throw new Error('sound never used: ' + k);
console.log('sound effects', Object.keys(sfxLib).length, '| seconds', Object.values(sfxLib).reduce((a, x) => a + x.seconds, 0).toFixed(1), '| lines with sounds', out.filter((l) => l.sfx).length);
const ids = new Set(); for (const l of out) { if (ids.has(l.id)) throw new Error('dup ' + l.id); ids.add(l.id); }
const voices = Object.fromEntries(Object.entries(api.CAST).map(([k, c]) => [k, { name: c.name, role: c.role, design: c.design, sample: c.sample, voice_id: 'PASTE_VOICE_ID_HERE' }]));
for (const k of Object.keys(api.CAST)) if (!SAMPLE_PERF[k]) throw new Error('no performed sample for ' + k);
fs.writeFileSync('/home/claude/plumpy/voice/voice-script.json', JSON.stringify({ version: 3, samples: SAMPLE_PERF, sfx: sfxLib, lines: out }, null, 1));
fs.writeFileSync('/home/claude/plumpy/voice/voices.json', JSON.stringify(voices, null, 2));
const chars = out.reduce((n, l) => n + l.text.length, 0), chars3 = out.reduce((n, l) => n + l.text_v3.length, 0);
const uniq = new Map(); for (const l of out) { const k = l.voice + '|' + l.text_v3; if (!uniq.has(k)) uniq.set(k, l.text_v3.length); }
const chars3u = [...uniq.values()].reduce((x, y) => x + y, 0);
const sampleChars = Object.values(SAMPLE_PERF).reduce((x, t) => x + t.length, 0);
console.log('unique v3 lines', uniq.size, '| unique v3 chars', chars3u, '| v3 sample chars', sampleChars);
const per = {}; for (const l of out) per[l.voice] = (per[l.voice] || 0) + 1;
console.log('lines', out.length, '| chars', chars, '| chars v3', chars3, '| per voice', JSON.stringify(per));
// readable script
let md = `# PLUMPY: voice script\n\n${out.length} lines (${uniq.size} different ones) · ${Object.keys(voices).length} voices · recorded with ElevenLabs v3, so every line is acted, not just read\n\nWords in [brackets] are acting directions: [laughs] makes the voice laugh, [whispers] makes it whisper. They are not spoken. The game's on-screen text stays the same (it still says "lol"); only the voice acts it out.\n\n🔊 marks a real sound effect mixed into the line (a stomach growl, bones rattling, a saw...). They are made once with ElevenLabs Sound Effects and placed on the right word.\n\nEvery line has an ID. The recording kit names each audio file \`<ID>.mp3\` for you (for example \`w1_0.mp3\`). To re-take one line:  \`node scripts/make-voices.mjs redo <ID>\`.\n\n## The cast\n\nDesign the 3 starred voices at least (Narrator, Plumpy, The Bear). Any voice you don't design gets one of ElevenLabs' built-in voices when you run \`voices --fallback\`.\n\n`;
const MUST = ['narrator', 'plumpy', 'bear'];
for (const [k, v] of Object.entries(voices)) md += `### ${v.name}${MUST.includes(k) ? '  ⭐ design this one' : ''}\n*${v.role}* · ${out.filter((l) => l.voice === k).length} lines\n\n**Save it in ElevenLabs with exactly this name:** \`${v.name}\`\n\n**Voice Design prompt:** ${v.design}\n\n**Preview text:** ${v.sample}\n\n**Test line, as acted:** ${SAMPLE_PERF[k]}\n\n`;
md += `## All lines\n\n`;
let lastWhere = null;
const groupOf = (w) => w.startsWith('Level') ? w.replace(/:.*$/, '').replace(' intro', '') : w.startsWith('In game') ? 'In game' : w;
for (const l of out) {
  const g = groupOf(l.where);
  if (g !== lastWhere) { md += `\n### ${g}\n\n| ID | Voice | Line, as acted |\n|---|---|---|\n`; lastWhere = g; }
  const snd = (l.sfx || []).map((c) => `🔊 ${c.sfx.replace(/_/g, ' ')}${c.at === 'before' ? ' (first)' : c.at === 'after' ? ' (after)' : c.at === 'under' ? ' (underneath)' : ` ${c.insert ? `(just before "${c.at}")` : `(on "${c.at}")`}`}`).join(' · ');
  md += `| \`${l.id}\` | ${voices[l.voice].name} | ${l.text_v3.replace(/\|/g, '/')}${snd ? `<br>${snd}` : ''} |\n`;
}
fs.writeFileSync('/home/claude/plumpy/voice/VOICE-SCRIPT.md', md);
