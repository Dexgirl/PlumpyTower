// ===================== VOICES-START =====================
// Every spoken line in the game has an ID. Recorded clips (from ElevenLabs etc.) are looked up by ID;
// anything without a clip falls back to the browser's speech, or babble.

// The voice cast. "design" is a ready-made prompt for ElevenLabs Voice Design.
const CAST = {
  plumpy: { name: 'Plumpy', role: 'the hero (always the Chog you play as)',
    design: 'A small, round, always-hungry cartoon creature with a high, squeaky but deadpan voice. Speaks slowly and flatly, unimpressed by everything, with sudden bursts of excitement about food. Young, cute, a little nasal. Clear studio audio.',
    sample: 'four a.m. stomach growling. time for a snack. the plate is... empty? there is a note. ugh. no rocket. no plan. we stack ourselves to the moon.' },
  bear: { name: 'The Bear', role: 'the villain (the bear market)',
    design: 'A huge, smug cartoon villain bear with a very deep, gravelly, booming voice. Speaks slowly and mockingly, loves his own jokes and chuckles a lot. Theatrical and over the top. Clear studio audio.',
    sample: 'lol. lmao. i took every snack in the chog world to the purple moon. and i locked your little friends in cages. sell. SELL. hahaha.' },
  narrator: { name: 'Narrator', role: 'reads the story before the game ("How Plumpy got plump")',
    design: 'A warm, playful storybook narrator with a friendly, clear mid-range voice. Speaks like reading a bedtime story to kids: gentle, a little mysterious, with a smile in the voice and small dramatic pauses. Clear studio audio.',
    sample: 'Chog World. Every night the Purple Moon rains crumbs, and the Chogs stack up to catch them. One night, a star fell instead.' },
  chog_common: { name: 'Common Chog', role: 'caged Commons (levels 1-14)',
    design: 'A tiny, excitable cartoon critter with a bright, high, bubbly voice. Talks fast, giggles, very energetic and very grateful. Clear studio audio.',
    sample: 'get me out of here! this cage smells like pickles! oh my gosh, you did it, you actually knocked him off! i am free! where are the snacks?' },
  chog_cool: { name: 'Uncommon Chog', role: 'caged Uncommons (levels 15-26)',
    design: 'A laid-back cartoon critter with a smooth, relaxed, slightly raspy young voice. Talks like a cool skater kid: unbothered, confident, a bit sarcastic. Clear studio audio.',
    sample: 'yeah, i knew you would come. took you long enough though. that cage was mid, no cap. alright, stack me up, i was born for this.' },
  chog_skull: { name: 'Skull Chog', role: 'caged Rare Skulls (levels 27-36)',
    design: 'A small spooky skeleton creature with a dry, raspy, whispery voice and a hint of echo. Slow and dramatic, a little creepy but friendly. Clear studio audio.',
    sample: 'i have waited in the dark for so long. my bones... thank you. all of them. the dead rise, and they stack. rattle, rattle.' },
  chog_toxic: { name: 'Radioactive Chog', role: 'caged Epic Radioactives (levels 37-44)',
    design: 'A hyperactive radioactive cartoon creature with a fast, buzzy, slightly glitchy high voice. Jittery and excitable, talks in quick bursts. Clear studio audio.',
    sample: 'warning, warning, radioactive chog released! my atoms are vibrating! i stick to everything, including you now. ten out of ten, would glow again!' },
  legend_scream: { name: 'Chog Scream', role: 'Legendary, level 45',
    design: 'A panicked cartoon creature that screams a lot: high-pitched, shrill and frantic, like it is permanently terrified, but secretly sweet. Clear studio audio.',
    sample: 'AAAAAAAAAAH! sorry. sorry. that means hello. AAAAH! that means thank you. i only have one setting and it is screaming.' },
  legend_grim: { name: 'Grim', role: 'Legendary, level 46',
    design: 'A calm grim-reaper cartoon creature with a very low, slow, hollow and ominous voice. Speaks softly and seriously, never in a hurry. Clear studio audio.',
    sample: 'i do not fear the cage. the cage fears me. death took a holiday today. so i will take the tower instead. lead the way.' },
  legend_abom: { name: 'Chogbomination', role: 'Legendary, level 47',
    design: 'A gross zombie cartoon creature with a wet, gurgling, croaky voice. Slow and sloppy, but oddly sweet and polite. Clear studio audio.',
    sample: 'i was a normal chog once. then i ate the forbidden snack. now i am... like this. but i am free. and i am yours. gurgle.' },
  legend_blaze: { name: 'Blaze', role: 'Legendary, level 48',
    design: 'A hot-headed fiery cartoon creature with a loud, energetic, crackling young voice. Always hyped, shouts a lot, very competitive. Clear studio audio.',
    sample: 'this cage is getting HOT and i am the reason! i am out and i am ON FIRE! let us burn this tower all the way to the moon!' },
  legend_skully: { name: 'Burning Skully', role: 'Legendary, level 49',
    design: 'A flaming skeleton cartoon creature with a crackly, raspy, mid-low voice and a slight echo. Cool, dramatic, a bit of a show-off. Clear studio audio.',
    sample: 'skeleton. on fire. in a cage. you knew what to do. flaming bones, at your service. the bear is going to feel the heat.' },
  legend_midas: { name: 'Midas', role: 'Legendary, level 50 (the final prize)',
    design: 'A rich, posh, golden cartoon creature with a smooth, refined, upper-class British voice. Slow, smug and elegant, like old money. Clear studio audio.',
    sample: 'everything i touch turns to gold. except that dreadful cage, apparently. free at last. darling, everything i stack turns to gold.' },
};
for (const [k, vv] of Object.entries(VILLAIN_VOICES)) {
  CAST[`v_${k}`] = { name: vv.name, role: 'NFT villains: ' + VILLAINS.filter((v) => v.voice === k).map((v) => v.name).join(', '), design: vv.design, sample: vv.sample };
}

// Plumpy's in-game barks (group -> lines). Clip IDs are p_<group>_<index>.
const GAME_LINES = {
  idle: ['tap when i am over the tower. make no mistakes.', 'feed me first. i am starving.', 'the plate is small. i am not.'],
  combo: ['i am locked in.', 'perfect. obviously.', 'call me the stack whisperer.', 'combo. say it with me. COMBO.'],
  drop: ['wheeeee', 'here i gooo', 'catch me', 'i believe i can fly. i cannot.'],
  land: ['*squish*', 'comfy.', "don't. move.", 'nobody breathe.', 'we stack.'],
  record: ['new record. i am scared of heights.', 'we are so high rn', 'tallest tower yet. do not sneeze.'],
  feed: ['*burp* tasted like a rug pull.', 'more. MORE.', 'that coin went to zero and so did my diet.', 'i can feel my belly expanding.'],
  full: ['i am full. i am literally round.'],
  diet: ['salad?? betrayal.'],
  fall: ['YOU MADE A MISTAKE.'],
};
// The Bear's in-game lines. Clip IDs are bear_<key>.
const BEAR_LINES = {
  sell: 'sell. SELL. hahaha.', rug: 'Rugzilla. NOW.', pump: 'who is buying?? stop that.', whale: 'a whale?? ugh.',
  freeze: 'i froze the liquidity. slide, chogs.', fud: 'have you heard? chog is going to zero. HOOOO.',
  final: 'the cage is cracking... but i have one more candle.', slow: 'too slow. plumpy let go.', pick: 'this one. i pick this one. hehe.',
  origin: 'every crumb is mine.',
};
// Plumpy when the tower falls. Clip IDs are p_crash_<cause>.
const CRASH_LINES = {
  rug: 'RUGGED. the market made a mistake.', bite: 'the bear ATE the plate. not our fault.', freeze: 'frozen liquidity. we slid. not our fault.',
  fud: 'the FUD got us. not our fault.', sell: 'paper hands sold the tower. not your fault.',
};
const MISC_LINES = { p_close: 'we were SO close. again.', p_hello: 'hi. i am plumpy. feed me.', p_stairs: "enough floating. stairs: built. let's go!",
  // the origin story ("How Plumpy got plump"), shown once after the cover
  p_origin_2: "hi. i'm plumpy. i'm new here.", p_origin_3: 'whoaaaa!', p_origin_4: 'bought the dip. ate the dip.', p_origin_5: 'i carry. you tap. we stack.', p_origin_7: "let's go get them back." };

// The narrator reads the story's captions before the game. Clip IDs are n_origin_<panel>.
const ORIGIN_NARRATION = [
  'Chog World. Every night the Purple Moon rains crumbs, and the Chogs stack up to catch them.',
  'One night, a star fell instead.',
  'The skinniest Chog in Chog World. Every gust blew Plumpy off the tower.',
  'So Plumpy ate. Every rug that got pulled. Every dip.',
  'Too round to stack. But a Chog born from a star can float.',
  'Then the Bear came. He stole every crumb, caged 50 Chogs and hired 50 NFT villains to guard them.',
  'Every caged Chog is a real Chog Genesis NFT. Time to bring them home.',
];

// What each freed Chog says when its cage breaks. Clip IDs are l<level>_free.
const FREE_LINES = {
  Common: ["i'm free! i'm FREE! okay. where are the snacks.", 'thank you. i will stack until i drop. literally.', 'fresh air! it smells like rugs out here. i love it.',
    "out of the cage and into the tower. let's go.", 'i owe you a snack. a big one.', 'finally. my legs work. mostly.', 'freedom tastes like grape jelly.',
    'you did it! you knocked that villain flat! hero behaviour.', "i'm out. put me on the tower. i'm ready.", 'the bear is going to be SO mad. good.',
    'i was in there for days. or minutes. it felt like days.', "free chog! free chog! okay i'm calm. i'm calm.", 'squad. i have a squad now.', 'no more pickle smell. thank you, truly.'],
  Uncommon: ["yeah. i knew you'd come. took you long enough.", "free. cool. very cool. i'm cool.", "let's run it. me, you, the tower.", 'that cage was mid. this squad is not.',
    "appreciate you. now let's go get the bear.", 'out of the cage. into the alpha.', "i'm free and i'm hungry. classic.", 'stack me up. i was born for this.',
    'the bear thought he could hold me. he could not.', "gm. it's a good morning now.", "no cap, you're a legend.", 'free at last. wagmi.'],
  Rare: ['the dead rise. and they stack.', 'my bones thank you. all of them.', 'free... at last... rattle rattle.', 'i have been waiting in the dark. now i stack.',
    'skull squad, reporting for duty.', 'the cage could not hold my bones.', "heavy bones. strong tower. let's go.", 'i felt nothing in there. now i feel... hungry.',
    'you freed a skeleton. bold move.', 'the bear will hear my bones rattle.'],
  Epic: ["i'm GLOWING with gratitude. literally glowing.", 'free! free! my atoms are vibrating!', "warning: radioactive chog released. stand back. or don't.",
    'i stick to everything. including this squad.', 'half-life of a cage: zero. you did that.', "i'm free and i'm sticky. let's stack.", 'the goo is with you now.', 'ten out of ten would glow again.'],
};
const LEGEND_FREE = {
  'Chog Scream': 'AAAAAAAAA! (that means thank you.)', Grim: "death took a holiday. i'll take the tower.", Chogbomination: "i'm free... i'm gross... i'm yours.",
  Blaze: "i'm out and i'm ON FIRE. let's burn this tower up!", 'Burning Skully': 'flaming bones, at your service.', Midas: 'free at last. everything i stack turns to gold.',
};
const LEGEND_VOICE = { 'Chog Scream': 'legend_scream', Grim: 'legend_grim', Chogbomination: 'legend_abom', Blaze: 'legend_blaze', 'Burning Skully': 'legend_skully', Midas: 'legend_midas' };
const TIER_VOICE = { Common: 'chog_common', Uncommon: 'chog_cool', Rare: 'chog_skull', Epic: 'chog_toxic', Legendary: 'legend_midas' };
function legendOf(chog) { return (String(chog.name || '').split('—')[1] || '').trim(); }
function voiceKeyFor(chog) { const lg = legendOf(chog); return LEGEND_VOICE[lg] || TIER_VOICE[(chog.traits && chog.traits.Tier) || 'Common'] || 'chog_common'; }
function freeLineFor(level, chog) {
  const lg = legendOf(chog);
  if (LEGEND_FREE[lg]) return LEGEND_FREE[lg];
  const pool = FREE_LINES[(chog.traits && chog.traits.Tier) || 'Common'] || FREE_LINES.Common;
  return pool[(level.id * 5) % pool.length];
}

// Optional ElevenLabs v3 "audio tags" per line ID (added in front of the text when you record with eleven_v3).
const VOICE_TAGS = {
  w1_2: '[laughs]', w2_0: '[mischievously]', w4_1: '[mocking]', w5_0: '[proudly]', w6_0: '[shouting]', w7_0: '[slow clap]',
  w8_0: '[greedy]', w8_1: '[roars]', end_0: '[stunned]', end_2: '[shyly]', end_4: '[whispers]',
  p_fall: '[shouting]', bear_sell: '[evil laugh]', bear_rug: '[shouting]', bear_pump: '[annoyed]', bear_whale: '[groans]', bear_freeze: '[mischievously]', bear_fud: '[blowing air]',
  bear_final: '[menacing]', bear_slow: '[laughs]', bear_pick: '[giggles]', p_close: '[sighs]', p_record_0: '[nervously]', p_combo_3: '[excited]',
};

const VILLAIN_TAGS = { gremlin: '[giggles]', menace: '[menacing]', bot: '[robotic]', diva: '[sassy]', bro: '[laughs]', creep: '[whispers]', cute: '[giggles]', regal: '[proudly]' };
VILLAINS.forEach((v, i) => { const id = i + 1; VOICE_TAGS[`v${id}_intro`] = VILLAIN_TAGS[v.voice]; VOICE_TAGS[`v${id}_hook`] = '[dramatically]'; VOICE_TAGS[`v${id}_down`] = '[groans]'; VOICE_TAGS[`v${id}_gloat`] = '[evil laugh]'; });

// Build the full recording script from the game data: [{ id, voice, text, where }]
function buildVoiceScript(levels, byToken) {
  const out = [];
  const add = (id, voice, text, where) => out.push({ id, voice, text: String(text), where });
  const who2voice = (who, chog) => (who === 'bear' ? 'bear' : who === 'jar' ? voiceKeyFor(chog) : 'plumpy');
  WORLDS.forEach((W) => W.intro.forEach(([who, text], i) => add(`w${W.id}_${i}`, who2voice(who), text, `World ${W.id} intro`)));
  for (const L of levels) {
    const jc = byToken[L.jar];
    if (L.say) add(`l${L.id}_say`, who2voice(L.say[0], jc), L.say[1], `Level ${L.id} intro`);
    const vl = villainOf(L);
    add(`l${L.id}_jar`, voiceKeyFor(jc), vl.captive.line, `Level ${L.id}: the caged Chog`);
    const vk = `v_${vl.voice}`, vw = `Level ${L.id}: ${vl.name}`;
    add(`v${L.id}_intro`, vk, vl.lines.intro, vw); add(`v${L.id}_hook`, vk, vl.lines.hook, vw);
    vl.lines.spit.forEach((t, i) => add(`v${L.id}_spit${i}`, vk, t, vw));
    add(`v${L.id}_down`, vk, vl.lines.down, vw); add(`v${L.id}_gloat`, vk, vl.lines.gloat, vw);
    // fight mode: the freed Chog shouts a rhyme with every move (3 moves + the finisher)
    if (typeof movesFor === 'function') { const mv = movesFor(jc); [...mv.moves, mv.finisher].forEach((m, i) => add(`f${L.id}_${i}`, voiceKeyFor(jc), m.rhyme, `Level ${L.id}: fight (${m.name})`)); }
    add(`l${L.id}_free`, voiceKeyFor(jc), freeLineFor(L, jc), `Level ${L.id}: the Chog is freed`);
    if (L.ending) L.ending.forEach(([who, text], i) => add(`end_${i}`, who2voice(who), text, 'Ending'));
  }
  for (const [g, lines] of Object.entries(GAME_LINES)) lines.forEach((t, i) => add(`p_${g}_${i}`, 'plumpy', t, `In game: ${g}`));
  for (const [k, t] of Object.entries(BEAR_LINES)) add(`bear_${k}`, 'bear', t, 'In game: the Bear');
  for (const [k, t] of Object.entries(CRASH_LINES)) add(`p_crash_${k}`, 'plumpy', t, 'In game: the tower falls');
  for (const [k, t] of Object.entries(MISC_LINES)) add(k, 'plumpy', t, 'In game');
  ORIGIN_NARRATION.forEach((t, i) => add(`n_origin_${i + 1}`, 'narrator', t, 'Story: the narrator'));
  return out;
}
// ===================== VOICES-END =====================
