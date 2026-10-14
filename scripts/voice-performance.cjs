// PLUMPY — how every line should be *performed* (emotion + sounds), for ElevenLabs v3.
// v3 reads "audio tags" in square brackets: [laughs] makes the voice laugh, [whispers] makes it whisper.
// The on-screen captions keep the original text (e.g. "lol"); only the audio changes.

// ---------------------------------------------------------------- speech fixes (every model)
// things a voice would read out wrong
const SAY = [
  [/\b4am\b/g, 'four a.m.'],
  [/\bStudio 513\b/g, 'Studio five-thirteen'],
  [/\b2017\b/g, 'twenty seventeen'],
  [/\b4K\b/g, 'four K'],
  [/\bstack to 20\b/g, 'stack to twenty'],
  [/\b19 tall\b/g, 'nineteen tall'],
  [/\brn\b/g, 'right now'],
  [/^gm\./, 'gee em.'],
];
const speak = (t) => SAY.reduce((s, [re, to]) => s.replace(re, to), t);

// ---------------------------------------------------------------- action tags -> sounds a voice can make
// (actions a voice can't perform, like "[throws everything]", are dropped)
const TAG_MAP = {
  puff: 'exhales', 'exhales babies': 'exhales', slurp: 'slurps', sob: 'sobs', snore: 'snoring', nom: 'chewing', chomp: 'chomps',
  crunch: 'crunching', burp: 'burps', yawn: 'yawns', twitch: 'twitchy', tumbles: 'yelps', 'sus look': 'suspicious', sniff: 'sniffs',
  'sips juice box': 'slurps', sigh: 'sighs', hiss: 'hisses', cough: 'coughs', mumbles: 'mumbles', roars: 'roars',
  'blows on the tower': 'blows air', 'blowing air': 'blows air', 'slow clap': 'sarcastic',
  whoosh: '', thud: '', 'throws everything': '', squish: '', snap: '', saws: '', riff: '', clack: '', boom: '', 'beep beep': '',
  'air guitar': '', 'VR beeps': '', crack: '', 'cracks knuckles': '',
  // the old one-size-fits-all tags are replaced per character below
  'evil laugh': null, dramatically: null, groans: null,
};
const mapTags = (t) => t.replace(/\[([^\]]+)\]/g, (m, x) => {
  if (!(x in TAG_MAP)) return m;
  const to = TAG_MAP[x];
  return to ? `[${to}]` : '';
}).replace(/\s{2,}/g, ' ').trim();

// laughs written as words -> real laughs (only when there are other words left to say)
function laughs(t) {
  let s = t
    .replace(/\blol\.?/gi, '[laughs]')
    .replace(/\blmao\.?/gi, '[laughs harder]')
    .replace(/\bha(ha)+\.?/gi, '[laughs maniacally]')
    .replace(/\bhe(he)+[.!]?/gi, '[giggles]')
    .replace(/\bzzz\b\.*/gi, '[snoring]')
    .replace(/\bgurgle\./gi, '[gurgles]')
    .replace(/\s{2,}/g, ' ').trim();
  return /[a-z]{2,}/i.test(s.replace(/\[[^\]]*\]/g, '')) ? s : t; // never leave a line with no words
}

// ---------------------------------------------------------------- hand-directed lines (main cast + specials)
const PERF = {
  // story
  n_origin_1: '[warmly] Chog World. Every night, the Purple Moon rains crumbs... and the Chogs stack up to catch them.',
  n_origin_2: '[mysteriously] One night... a star fell instead.',
  n_origin_3: '[gently amused] The skinniest Chog in Chog World. Every gust blew Plumpy off the tower.',
  n_origin_4: '[playfully] So Plumpy ate. Every rug that got pulled. Every dip.',
  n_origin_5: '[with wonder] Too round to stack. But a Chog born from a star... can float.',
  n_origin_6: '[ominously] Then the Bear came. He stole every crumb, caged fifty Chogs... and hired fifty NFT villains to guard them.',
  n_origin_7: '[hopeful] Every caged Chog is a real Chog Genesis NFT. [determined] Time to bring them home.',

  // world intros
  w1_0: '[sleepy] four a.m. [yawns] stomach growling. time for a snack.',
  w1_1: '[confused] the plate is... empty?? [gasps] there is a note.',
  w1_2: '[laughs] i took every snack to the Purple Moon. [smug] and i locked fifty of your friends in cages.',
  w1_3: '[smug] oh, and i hired fifty villains from every chain to guard them. one per cage. [chuckles] good luck.',
  w1_4: '[determined] no rocket. no plan. we stack ourselves up there, knock every villain off its perch... and free everyone.',
  w2_0: '[mischievously] i left the freezer door open. [chuckles] enjoy the ice rink.',
  w2_1: '[shivering] my feet are cold. my belly is empty. [deadpan] i am not okay.',
  w3_0: '[blows air] hoo. HOOOOOOO.',
  w3_1: '[disgusted] that is not wind. that is a bear... breathing on us. disgusting.',
  w4_0: '[deadpan] clouds. i ate one. it tasted like nothing.',
  w4_1: '[mocking] up here everything floats. good luck landing anything, fatty.',
  w4_2: '[offended] he called me fatty. [determined] i will land PERFECTLY. out of spite.',
  w5_0: '[proudly] meet my goons. Paper Hands. [laughs] they sell everything.',
  w5_1: '[outraged] they are dumping on the tower. on PURPOSE.',
  w5_2: '[panicked] hold. HOLD!',
  w6_0: '[shouting] Rugzilla! do the thing!',
  w6_1: '[panicked] not the rug. ANYTHING but the rug!',
  w7_0: '[sarcastic] you actually made it. for SNACKS. respect.',
  w7_1: '[menacing] but the moon... is MINE.',
  w7_2: '[ominously] pointy heads. your time is coming.',
  w8_0: '[greedy] last cage. the shiny one. [whispers] my boss guards it himself.',
  w8_1: '[roars] RAAAAAWR!',
  w8_2: '[heroic] we stack to twenty. then a pointy Chog plants the flag. for snacks. for the cages. [shouting] for chog world!',

  // level intros
  l2_say: '[laughs] three chogs tall? on that plate? [laughs harder]',
  l3_say: '[smug] i only land perfect. it is a lifestyle.',
  l4_say: '[smug] i swapped your plate for a saucer. [chuckles] good luck.',
  l5_say: '[deadpan] pointy heads cannot hold anyone up. but they make great flagpoles.',
  l6_say: '[whining] i have been starving for five levels. [shouting] FEED ME.',
  l7_say: '[annoyed] fine. you got past the kitchen. [growls] the fridge is MINE.',
  l9_say: '[urgently] the hot one. use the hot one first. melt the plate.',
  l10_say: '[mocking] perfect landings? on ice? [chuckles] i will wait.',
  l12_say: '[smug] i put everyone on a diet. no fat chogs today.',
  l13_say: '[smug] only round heads allowed on my ice. [giggles]',
  l14_say: '[chewing] i am eating your plate. one bite per drop.',
  l16_say: '[urgently] the windproof one. bring the windproof one.',
  l17_say: '[taunting] tick tock. tick tock.',
  l19_say: '[innocently] i sawed off one leg of the table. oops.',
  l20_say: '[mischievously] i choose your chogs now. [giggles]',
  l21_say: '[blows air] HOOOOOOOOOO.',
  l24_say: '[whispers] i cannot see. i can only feel. [deadpan] and i feel hungry.',
  l25_say: '[smug] my waiter will carry your tower. [chuckles] he is clumsy.',
  l27_say: '[mischievously] i gave plumpy an energy drink.',
  l31_say: '[growls] i cranked the diner gravity. sit DOWN.',
  l34_say: '[disgusted] commons? in MY diner? no.',
  l35_say: '[laughs] the diner freezer broke. everything is ice. and my goons are selling.',
  l40_say: '[ominously] only the scary ones tonight.',
  l42_say: '[shouting] Rugzilla! ALL the rugs!',
  l44_say: '[confused] the moon is made of ice?? i thought it was grape jelly.',
  l45_say: '[chewing] moon cheese plate. [satisfied] delicious.',
  l49_say: '[focused] practice run. nineteen tall... then a pointy head on top.',

  // ending
  end_0: '[stunned] ...you planted a flag. on MY moon.',
  end_1: '[happily] the moon is grape jelly. there is enough for everyone.',
  end_2: '[shyly] ...can i have some?',
  end_3: '[warmly] chog world order. everybody eats. [chuckles] even bears.',
  end_4: '[whispers] wait. what is that... behind the moon?',

  // Plumpy in game
  p_idle_0: '[bored] tap when i am over the tower. make no mistakes.',
  p_idle_1: '[whining] feed me first. i am starving.',
  p_idle_2: '[deadpan] the plate is small. i am not.',
  p_combo_0: '[focused] i am locked in.',
  p_combo_1: '[smug] perfect. obviously.',
  p_combo_2: '[proudly] call me... the stack whisperer.',
  p_combo_3: '[excited] combo. say it with me. COMBO!',
  p_drop_0: '[gleeful] wheeeeee!',
  p_drop_1: '[excited] here i gooo!',
  p_drop_2: '[nervous] catch me!',
  p_drop_3: '[sings] i believe i can fly... [deadpan] i cannot.',
  p_land_0: '[giggles] squish.',
  p_land_1: '[sighs happily] comfy.',
  p_land_2: "[whispers] don't. move.",
  p_land_3: '[whispers] nobody breathe.',
  p_land_4: '[confidently] we stack.',
  p_record_0: '[nervously] new record. i am scared of heights.',
  p_record_1: '[giggles] we are so high right now.',
  p_record_2: '[whispers] tallest tower yet. do not sneeze.',
  p_feed_0: '[burps] tasted like a rug pull.',
  p_feed_1: '[munching] more. MORE!',
  p_feed_2: '[chewing] that coin went to zero... and so did my diet.',
  p_feed_3: '[contented] i can feel my belly expanding.',
  p_full_0: '[burps] i am full. i am literally round.',
  p_diet_0: '[betrayed] salad?? betrayal.',
  p_fall_0: '[shouting] YOU MADE A MISTAKE.',
  p_crash_rug: '[frustrated] RUGGED. the market made a mistake.',
  p_crash_bite: '[outraged] the bear ATE the plate. not our fault.',
  p_crash_freeze: '[sighs] frozen liquidity. we slid. not our fault.',
  p_crash_fud: '[annoyed] the FUD got us. not our fault.',
  p_crash_sell: '[sighs] paper hands sold the tower. not your fault.',
  p_close: '[sighs] we were SO close. again.',
  p_hello: '[deadpan] hi. i am plumpy. feed me.',
  p_stairs: "[excited] enough floating. stairs: built. let's go!",
  p_origin_2: "[shyly] hi. i'm plumpy. i'm new here.",
  p_origin_3: '[screams] whoaaaa!',
  p_origin_4: '[satisfied] bought the dip. [chewing] ate the dip.',
  p_origin_5: '[confidently] i carry. you tap. we stack.',
  p_origin_7: "[determined] let's go get them back.",

  // the Bear in game
  bear_sell: '[laughs] sell. SELL. [laughs maniacally]',
  bear_rug: '[shouting] Rugzilla. NOW!',
  bear_pump: '[annoyed] who is buying?? stop that.',
  bear_whale: '[groans] a whale?? ugh.',
  bear_freeze: '[mischievously] i froze the liquidity. slide, chogs.',
  bear_fud: '[blows air] have you heard? chog is going to zero. HOOOO.',
  bear_final: '[menacing] the cage is cracking... but i have one more candle.',
  bear_slow: '[laughs] too slow. plumpy let go.',
  bear_pick: '[mischievously] this one. i pick this one. [giggles]',
  bear_origin: '[growls] every crumb... is mine.',

  // caged / freed Chogs with something special going on
  l5_jar: '[snoring] ... [sleepily] is it... snack time...? [snoring]',
  l5_free: "[excited] free chog! free chog! [calming down] okay i'm calm. i'm calm.",
  l13_jar: "[nervous] it's just a penguin in a pillowcase. it's just a penguin in a pill- [screams] AAAA!",
  l14_free: "[excited] i'm free! i'm FREE! [calming down] okay. where are the snacks.",
  l17_free: "[trying to stay cool] free. cool. very cool. i'm cool.",
  l45_jar: '[screaming] AAAAAAA! he crunches the plate like a cookie! AAAA! [suddenly calm] that means help.',
  l45_free: '[screaming] AAAAAAAAA! [suddenly calm] that means thank you.',
  l46_jar: "[ominously] i am death itself. [annoyed] he painted 'NO CHOGS' on my cage. rude.",
  l46_free: "[deep and slow] death took a holiday. i'll take the tower.",
  l47_jar: "[gurgles] [gloomy] he says 'it's so over' every five minutes. i've been over since the forbidden snack.",
  l47_free: "[gurgling] i'm free... i'm gross... [warmly] i'm yours.",
  l48_jar: "[agitated] he goes BOO every time i doze off. i'm on FIRE and still jumpy.",
  l48_free: "[fired up] i'm out and i'm ON FIRE. let's burn this tower up!",
  l49_jar: "[annoyed] unc keeps saying flaming skeletons weren't a thing in twenty seventeen. i'm a thing NOW.",
  l49_free: '[proudly] flaming bones, at your service.',
  l50_jar: "[haughty] darling, he's older than gold. [whispers] and he smells like it.",
  l50_free: '[smugly] free at last. everything i stack turns to gold.',

  // villains knocked off their perch: match the line, not just the character
  v7_down: '[roars in pain] this... is a... CRASH OUT!',
  v12_down: '[weakly] the revolution... is cancelled...',
  v14_down: '[yelling in pain] brain... FREEZE!',
  v19_down: '[yelling] TIMBERRR... [realizing] wait, that\'s me...',
  v23_down: '[sleepily] five more minutes...',
  v31_down: '[groans in pain] encore... cancelled...',
  v35_down: '[groans in pain] my deductions... were wrong...',
  v38_down: '[sighs] finally... something real...',
  v41_down: '[sighs] at least... i fell... alone...',
  v42_down: '[groans in pain] my toothpick...',
  v46_down: '[grudgingly] fine... chogs are... kinda ok...',
  v47_down: '[weakly] ...we\'re... so back...?',
  v50_down: '[fading] ...remember... me...',


  // a real sound effect plays here now (see CUES), so the voice doesn't fake it
  v8_intro: "[giggles] hiii! i froze your friend. it's giving... snow globe.",
  v8_spit1: '[cheerfully] go, babies!',
  v14_intro: "[menacing] this plate is mine now. that's the fanum tax, little chog.",
  v14_spit1: '[shouting] go, babies.',
  v45_intro: '[giggles] every skrump was cute. then i entered my villain era. tasty plate.',
  v45_spit1: '[cackles] go!',
  v31_spit1: '[shouting] go, babies!',
  v30_spit1: "[hollering] comin' through!",
  v49_spit1: '[hollering] spawning.',
  v15_down: "[whining] oh no. i'm... shattered.",
  v2_down: '[groans] my keys! who took my...',
  // villain lines with sounds in them
  v5_spit1: '[exhales] puff puff... go, babies.',
  v16_spit1: '[cheerfully] whoosh! babies!',
  v39_spit1: '[cackles] boom! babies!',
  v23_spit0: '[sleepily] dozelings... go... [snoring]',
  v23_spit1: '[snoring] spit... [snoring]',
  v27_spit1: '[hisses] hehehe!',
  v7_spit1: '[roars] RAAAH! spit fire!',
  v13_intro: "[whispers] boooo. i'm a ghost. don't look under the sheet. [creepy giggle] round heads only tonight.",
  v21_intro: '[cackles] mwahaha! a skinless witch with a pizza and a storm. what could go right?',
  v48_intro: '[whispers] boooo. three perfects in a row, or i haunt your combo forever. [creepy laugh] boooo.',
};

// ---------------------------------------------------------------- per-character defaults
const VILLAIN = {
  //        intro            hook              spit (command)      knocked down        gloat (you fell)
  gremlin: ['[giggles]',     '[mischievously]', '[cackles]',        '[whining]',        '[cackles]'],
  bro:     ['[chuckles]',    '[smug]',          '[hollering]',      '[groans]',         '[chuckles]'],
  diva:    ['[sassy]',       '[sassy]',         '[bossy]',          '[gasps]',          '[laughs mockingly]'],
  menace:  ['[menacing]',    '[growls]',        '[shouting]',       '[roars in pain]',  '[laughs darkly]'],
  cute:    ['[giggles]',     '[sweetly]',       '[cheerfully]',     '[whimpers]',       '[giggles]'],
  regal:   ['[proudly]',     '[grandly]',       '[commanding]',     '[gasps]',          '[laughs smugly]'],
  creep:   ['[whispers]',    '[whispers]',      '[whispers]',       '[wails]',          '[creepy laugh]'],
  bot:     ['[robotic]',     '[robotic]',       '[robotic]',        '[glitching]',      '[robotic laugh]'],
};
const SLOT = { intro: 0, hook: 1, spit0: 2, spit1: 2, down: 3, gloat: 4 };
const CHOG = {
  //            caged            freed           fight move
  chog_common: ['[whiny]',        '[relieved]',   '[excited]'],
  chog_cool:   ['[unimpressed]',  '[chill]',      '[confidently]'],
  chog_skull:  ['[spooky]',       '[spooky]',     '[growls]'],
  chog_toxic:  ['[hyper]',        '[hyper]',      '[hyper]'],
};
const LEGEND_FIGHT = { legend_scream: '[screaming]', legend_grim: '[deep and slow]', legend_abom: '[growls]', legend_blaze: '[fired up]', legend_skully: '[fierce]', legend_midas: '[haughty]' };

const leadTag = (t) => /^\[[^\]]+\]/.test(t);
const withTag = (tag, t) => (leadTag(t) || !tag ? t : `${tag} ${t}`);

// line: { id, voice, where, text_v3 (raw: original text with *actions* as [tags]) }
function perform(line) {
  if (PERF[line.id]) return PERF[line.id];
  let t = laughs(speak(mapTags(line.text_v3)));
  const id = line.id;
  let m;
  if ((m = id.match(/^v\d+_(intro|hook|spit0|spit1|down|gloat)$/))) {
    const kind = line.voice.replace(/^v_/, '');
    const tags = VILLAIN[kind] || VILLAIN.gremlin;
    // "down" lines often end in a trailing sob/whine already; still lead with the character's pain sound
    return withTag(tags[SLOT[m[1]]], t);
  }
  if (/^l\d+_jar$/.test(id)) {
    if (CHOG[line.voice]) {
      if (/please/i.test(t)) return withTag('[pleading]', t);
      if (/!/.test(t) && line.voice === 'chog_common') return withTag('[panicked]', t);
      return withTag(CHOG[line.voice][0], t);
    }
    return t;
  }
  if (/^l\d+_free$/.test(id)) {
    if (CHOG[line.voice]) {
      if (line.voice === 'chog_common' && /!/.test(t)) return withTag('[excited]', t);
      return withTag(CHOG[line.voice][1], t);
    }
    return t;
  }
  if (/^f\d+_\d+$/.test(id)) {
    if (/STACK ATTACK/.test(line.where)) return withTag('[shouting]', t);
    return withTag(CHOG[line.voice] ? CHOG[line.voice][2] : LEGEND_FIGHT[line.voice] || '[shouting]', t);
  }
  return t;
}

// plain text for models without tags (Flash / Multilingual v2): fix what would be read out wrong
function plain(line) {
  const fill = { w8_1: 'RAAAAAWR!', v5_spit1: 'puff puff... go, babies.' };
  let t = fill[line.id] || line.text;
  t = speak(t).replace(/\blol\.?/gi, 'ha ha.').replace(/\blmao\.?/gi, 'ha ha ha.').replace(/\(that means/g, '... that means').replace(/\.\)/g, '.');
  return t.trim();
}

// one test line per voice, performed (used by "samples" when you record with v3)
const SAMPLE_PERF = {
  plumpy: '[sleepy] four a.m. [yawns] stomach growling. time for a snack. [confused] the plate is... empty? there is a note. [groans] ugh. [determined] no rocket. no plan. we stack ourselves to the moon.',
  bear: '[laughs] i took every snack in the chog world to the purple moon. [smug] and i locked your little friends in cages. [menacing] sell. SELL. [laughs maniacally]',
  narrator: '[warmly] Chog World. Every night, the Purple Moon rains crumbs... and the Chogs stack up to catch them. [mysteriously] One night... a star fell instead.',
  chog_common: '[panicked] get me out of here! this cage smells like pickles! [gasps] oh my gosh, you did it, you actually knocked him off! [excited] i am free! where are the snacks?',
  chog_cool: '[unimpressed] yeah, i knew you would come. took you long enough though. that cage was mid, no cap. [confidently] alright, stack me up, i was born for this.',
  chog_skull: '[spooky] i have waited in the dark for so long. my bones... thank you. all of them. [ominously] the dead rise, and they stack. rattle, rattle.',
  chog_toxic: '[hyper] warning, warning, radioactive chog released! my atoms are vibrating! i stick to everything, including you now. ten out of ten, would glow again!',
  legend_scream: '[screaming] AAAAAAAAAAH! [suddenly calm] sorry. sorry. that means hello. [screaming] AAAAH! [suddenly calm] that means thank you. i only have one setting and it is screaming.',
  legend_grim: '[deep and slow] i do not fear the cage. the cage fears me. death took a holiday today. so i will take the tower instead. lead the way.',
  legend_abom: '[gloomy] i was a normal chog once. then i ate the forbidden snack. now i am... like this. [warmly] but i am free. and i am yours. [gurgles]',
  legend_blaze: '[fired up] this cage is getting HOT and i am the reason! i am out and i am ON FIRE! let us burn this tower all the way to the moon!',
  legend_skully: '[fierce] skeleton. on fire. in a cage. you knew what to do. [proudly] flaming bones, at your service. the bear is going to feel the heat.',
  legend_midas: '[haughty] everything i touch turns to gold. except that dreadful cage, apparently. [smugly] free at last. darling, everything i stack turns to gold.',
  v_gremlin: '[giggles] sorry, busy. i am aura farming. this chog was free aura, so i took it. [cackles] minus a thousand aura!',
  v_menace: '[menacing] you broke six cages? cool. i am the seventh. and i am FURIOUS. [growls] i do not calm down. i level up.',
  v_bot: '[robotic] countdown started. four seconds per chog. i have infinite seconds. you do not. tick tock. i do not stop.',
  v_diva: '[sassy] welcome to my prom. it is vip only. commons? ew. wait outside, sweetie. [laughs mockingly] not on the list? not in the tower.',
  v_bro: '[chuckles] yeehaw, partner. this here chog is under arrest for bein too snackable. [smug] no keys. no chog. no cap.',
  v_creep: '[whispers] boooo. three perfects in a row, or i haunt your combo forever. [creepy laugh] miss once, and you are ghosted.',
  v_cute: '[giggles] hiii! i froze your friend. it is giving snow globe. [sweetly] too cute to catch. too cold to care. [giggles]',
  v_regal: '[proudly] i conquered the arctic with one coin and a hat. your chog is next. [grandly] short king. long position. cold heart.',
};


// ---------------------------------------------------------------- real sound effects
// Made once with ElevenLabs Sound Effects ("node scripts/make-voices.mjs sfx"), then mixed into the
// lines below at the right word. A mouth can laugh or burp; it can't rattle bones or growl a stomach.
const SFX = {
  stomach_growl:  ['cartoon hungry stomach growling, a long low gurgling rumble, close up', 1.6],
  bone_rattle:    ['dry cartoon skeleton bones rattling and clattering together', 1.2],
  wind_blow:      ['a big cartoon gust of wind blowing past, whoosh', 1.6],
  slow_clap:      ['one person slowly clapping, four sarcastic slow claps, small room', 2.4],
  knuckle_crack:  ['knuckles cracking loudly, crack crack', 0.9],
  junk_crash:     ['a huge pile of pots, plates and furniture crashing and tumbling down, cartoon', 2.2],
  keys_jangle:    ['a big ring of metal keys jangling', 1.4],
  tumble_thud:    ['cartoon character tumbling over and landing with a heavy thud', 1.2],
  laser_pew:      ['two quick retro sci-fi laser blasts, pew pew', 0.8],
  smoke_puff:     ['a soft puff of smoke, short airy whoosh', 0.7],
  fire_breath:    ['a short burst of fire breath, roaring flames whoosh', 1.4],
  straw_slurp:    ['slurping the last drops of a juice box through a straw', 1.1],
  mop_squeak:     ['a wet mop squeaking and sloshing on a shiny floor', 1.2],
  robot_beep:     ['a single cute robot beep', 0.5],
  big_chomp:      ['a big crunchy cartoon bite, chomp', 0.6],
  cookie_crunch:  ['loudly crunching a hard cookie, crunchy bites', 1.0],
  glass_shatter:  ['a pane of glass cracking and shattering', 1.0],
  whoosh:         ['a fast swoosh of air, cartoon whoosh', 0.7],
  clock_tick:     ['a loud clock ticking, tick tock tick tock', 2.0],
  robot_powerdown:['a robot glitching and powering down, electronic failure sound', 1.4],
  hand_saw:       ['a hand saw sawing through a wooden table leg, a few quick strokes', 1.5],
  clown_honk:     ['a clown bicycle horn honking twice, honk honk', 0.8],
  thunder:        ['a thunder clap followed by a low rumble', 2.0],
  truck_reverse:  ['a truck reversing alarm, beep beep beep', 1.4],
  guitar_riff:    ['a short heavy metal electric guitar riff, distorted', 2.0],
  welding:        ['a welding torch sizzling and crackling with sparks', 1.5],
  cartoon_boom:   ['a cartoon explosion, big boom', 1.2],
  button_fizzle:  ['pressing a big plastic button, click, then a tiny sad fizzle', 1.2],
  rocket_launch:  ['small toy rockets launching, fizzing whoosh', 1.2],
  vr_boot:        ['a futuristic headset booting up, rising digital beeps', 1.0],
  plush_squish:   ['a soft plush toy being squished, squishy squeak', 0.5],
  goo_gurgle:     ['thick slimy goo bubbling and gurgling', 1.2],
  star_fall:      ['a magical shooting star falling through the sky, twinkling chimes and a soft whoosh', 2.2],
  munching:       ['a cartoon creature munching food fast, crunchy chewing', 1.4],
  giant_stomps:   ['three giant heavy footsteps, the ground shakes', 2.0],
  cage_creak:     ['a metal cage creaking and cracking under strain', 1.4],
  club_beat:      ['loud club music bass thumping, heard through a wall', 2.5],
  record_scratch: ['a vinyl record scratch, the music stops', 0.8],
  sad_violin:     ['a short sad slow violin melody', 2.5],
  drool_drip:     ['thick slimy drool dripping, wet splats', 1.0],
  bubble_pop:     ['a big bubblegum bubble popping', 0.6],
  coins_rain:     ['a shower of gold coins falling and clinking', 1.4],
  glitch_zap:     ['a digital glitch zap, electronic stutter', 0.8],
};

// where each sound goes. at: a word in the line (the sound starts there), or
//   'before' (sound first, the voice comes in on its tail), 'after' (right after the voice), 'under' (quietly under the whole line)
// n: which time the word appears (default 1) · lead: start this many seconds before the word · vol: 0..1
// insert: open a short gap in the voice just before the word and play the sound there, in the clear
const CUES = {
  // story
  n_origin_2: [{ sfx: 'star_fall', at: 'star', lead: 0.7, vol: 0.75 }],
  n_origin_3: [{ sfx: 'wind_blow', at: 'blew', insert: true, vol: 0.7 }],
  n_origin_4: [{ sfx: 'munching', at: 'Every', insert: true, vol: 0.7 }],
  n_origin_6: [{ sfx: 'giant_stomps', at: 'before', vol: 0.8 }],
  // Plumpy and the Bear
  w1_0: [{ sfx: 'stomach_growl', at: 'time', insert: true }],
  w3_0: [{ sfx: 'wind_blow', at: 'hoo', vol: 0.7 }],
  l21_say: [{ sfx: 'wind_blow', at: 'HOOOOOOOOOO', vol: 0.7 }],
  bear_fud: [{ sfx: 'wind_blow', at: 'HOOOO', vol: 0.7 }],
  w7_0: [{ sfx: 'slow_clap', at: 'before' }],
  w7_1: [{ sfx: 'knuckle_crack', at: 'after' }],
  w8_1: [{ sfx: 'junk_crash', at: 'after' }],
  l14_say: [{ sfx: 'big_chomp', at: 'before' }],
  l45_say: [{ sfx: 'big_chomp', at: 'before' }],
  p_crash_bite: [{ sfx: 'big_chomp', at: 'not', insert: true }],
  bear_final: [{ sfx: 'cage_creak', at: 'but', insert: true }],
  p_land_0: [{ sfx: 'plush_squish', at: 'before' }],
  p_origin_4: [{ sfx: 'munching', at: 'after', vol: 0.8 }],
  // caged Chogs
  l1_jar: [{ sfx: 'drool_drip', at: 'and', insert: true }],
  l2_jar: [{ sfx: 'keys_jangle', at: 'for', insert: true }],
  l3_jar: [{ sfx: 'laser_pew', at: 'and', insert: true }],
  l7_jar: [{ sfx: 'fire_breath', at: "he's", n: 2, insert: true, vol: 0.7 }],
  l11_jar: [{ sfx: 'mop_squeak', at: 'cleanest', insert: true }],
  l14_jar: [{ sfx: 'big_chomp', at: 'out', insert: true }],
  l15_jar: [{ sfx: 'glass_shatter', at: 'lowkey', insert: true, vol: 0.7 }],
  l17_say: [{ sfx: 'clock_tick', at: 'under', vol: 0.5 }],
  l21_jar: [{ sfx: 'thunder', at: 'which', insert: true, vol: 0.7 }],
  l27_jar: [{ sfx: 'bone_rattle', at: 'from', insert: true }],
  l29_jar: [{ sfx: 'bone_rattle', at: 'rattle', n: 1 }, { sfx: 'bone_rattle', at: 'rattle', n: 2 }],
  l31_jar: [{ sfx: 'guitar_riff', at: 'on', insert: true, vol: 0.7 }],
  l32_jar: [{ sfx: 'welding', at: 'the', insert: true, vol: 0.7 }],
  l37_jar: [{ sfx: 'club_beat', at: 'under', vol: 0.4 }],
  l38_jar: [{ sfx: 'sad_violin', at: 'under', vol: 0.4 }],
  l39_jar: [{ sfx: 'cartoon_boom', at: 'then', insert: true, vol: 0.7 }],
  l40_jar: [{ sfx: 'smoke_puff', at: 'honestly', insert: true }],
  l43_jar: [{ sfx: 'button_fizzle', at: 'it', insert: true, vol: 0.7 }],
  l45_jar: [{ sfx: 'cookie_crunch', at: 'AAAA', insert: true }],
  l47_jar: [{ sfx: 'goo_gurgle', at: 'before' }],
  l47_free: [{ sfx: 'goo_gurgle', at: 'before', vol: 0.6 }],
  // freed skeletons: the bones rattle
  l27_free: [{ sfx: 'bone_rattle', at: 'after', vol: 0.8 }], l29_free: [{ sfx: 'bone_rattle', at: 'after', vol: 0.8 }],
  l31_free: [{ sfx: 'bone_rattle', at: 'after', vol: 0.8 }], l33_free: [{ sfx: 'bone_rattle', at: 'after', vol: 0.8 }],
  l35_free: [{ sfx: 'bone_rattle', at: 'after', vol: 0.8 }],
  l28_free: [{ sfx: 'bone_rattle', at: 'and', insert: true, vol: 0.8 }], l30_free: [{ sfx: 'bone_rattle', at: 'and', insert: true, vol: 0.8 }],
  l32_free: [{ sfx: 'bone_rattle', at: 'and', insert: true, vol: 0.8 }], l34_free: [{ sfx: 'bone_rattle', at: 'and', insert: true, vol: 0.8 }],
  l36_free: [{ sfx: 'bone_rattle', at: 'and', insert: true, vol: 0.8 }],
  // villains
  v1_spit0: [{ sfx: 'drool_drip', at: 'drip', vol: 0.7 }],
  v2_hook: [{ sfx: 'keys_jangle', at: 'No', n: 2, insert: true }],
  v2_down: [{ sfx: 'tumble_thud', at: 'after' }],
  v3_hook: [{ sfx: 'laser_pew', at: 'Zero', insert: true }],
  v3_spit0: [{ sfx: 'laser_pew', at: 'pew' }],
  v5_intro: [{ sfx: 'smoke_puff', at: 'before', vol: 0.7 }],
  v5_spit0: [{ sfx: 'smoke_puff', at: 'puff' }],
  v5_spit1: [{ sfx: 'smoke_puff', at: 'puff' }],
  v5_gloat: [{ sfx: 'smoke_puff', at: 'after' }],
  v7_spit0: [{ sfx: 'fire_breath', at: 'BURN' }],
  v7_spit1: [{ sfx: 'fire_breath', at: 'fire' }],
  v8_intro: [{ sfx: 'straw_slurp', at: 'before' }],
  v8_spit1: [{ sfx: 'straw_slurp', at: 'before' }],
  v11_intro: [{ sfx: 'robot_beep', at: 'beep', vol: 0.7 }],
  v14_intro: [{ sfx: 'big_chomp', at: 'before' }],
  v14_hook: [{ sfx: 'big_chomp', at: 'Every', insert: true }],
  v14_spit1: [{ sfx: 'big_chomp', at: 'before' }],
  v15_down: [{ sfx: 'glass_shatter', at: 'shattered', insert: true }],
  v16_intro: [{ sfx: 'whoosh', at: 'WHOOSH' }],
  v16_spit0: [{ sfx: 'wind_blow', at: 'after', vol: 0.8 }],
  v16_spit1: [{ sfx: 'whoosh', at: 'whoosh' }],
  v16_gloat: [{ sfx: 'whoosh', at: 'like', insert: true }],
  v17_hook: [{ sfx: 'clock_tick', at: 'under', vol: 0.5 }],
  v17_down: [{ sfx: 'robot_powerdown', at: 'FAILURE', lead: 0.2 }],
  v19_intro: [{ sfx: 'hand_saw', at: 'before' }],
  v20_spit1: [{ sfx: 'clown_honk', at: 'honk' }],
  v20_gloat: [{ sfx: 'clown_honk', at: 'HONK' }],
  v23_down: [{ sfx: 'tumble_thud', at: 'after', vol: 0.7 }],
  v30_hook: [{ sfx: 'truck_reverse', at: "That's", insert: true, vol: 0.7 }],
  v30_spit1: [{ sfx: 'truck_reverse', at: 'before', vol: 0.7 }],
  v31_intro: [{ sfx: 'guitar_riff', at: 'before', vol: 0.7 }],
  v31_spit1: [{ sfx: 'guitar_riff', at: 'before', vol: 0.7 }],
  v37_down: [{ sfx: 'record_scratch', at: 'before' }],
  v39_hook: [{ sfx: 'cartoon_boom', at: 'boom' }],
  v39_spit1: [{ sfx: 'cartoon_boom', at: 'boom' }],
  v39_gloat: [{ sfx: 'cartoon_boom', at: 'boom' }],
  v40_intro: [{ sfx: 'smoke_puff', at: 'before', vol: 0.7 }],
  v40_spit0: [{ sfx: 'smoke_puff', at: 'puff' }],
  v43_spit0: [{ sfx: 'rocket_launch', at: 'launch' }],
  v45_intro: [{ sfx: 'cookie_crunch', at: 'tasty', lead: 0.9 }],
  v45_spit1: [{ sfx: 'cookie_crunch', at: 'before' }],
  v49_spit1: [{ sfx: 'vr_boot', at: 'before', vol: 0.7 }],
};
// fight moves that make a sound: it lands right as the shout ends
const MOVE_SFX = {
  'HONK ATTACK': 'clown_honk', 'LASER GLARE': 'laser_pew', 'SHADES BEAM': 'laser_pew', 'THUNDER CAP': 'thunder',
  'BONE RATTLE': 'bone_rattle', 'BONE CRUSHER': 'bone_rattle', 'SMOKE BOMB': 'smoke_puff', 'CIGAR SMOKE': 'smoke_puff',
  'TORNADO SPIN': 'wind_blow', 'FLAME AURA': 'fire_breath', INFERNO: 'fire_breath', 'SKULL FIREBALL': 'fire_breath', 'HOT BELLY SLAM': 'fire_breath',
  'GOO NUKE': 'cartoon_boom', 'GLITCH HIT': 'glitch_zap', 'BUBBLEGUM BOMB': 'bubble_pop', 'MAKE IT RAIN': 'coins_rain', 'DOLLAR DROP': 'coins_rain',
  'COIN SPIT': 'coins_rain', 'GOLD GRILL BITE': 'big_chomp', 'BANANA BONK': 'clown_honk', 'DROOL FLOOD': 'drool_drip', 'GOO ON YOU': 'goo_gurgle',
};
function cuesFor(line) {
  if (CUES[line.id]) return CUES[line.id];
  if (/^f\d+_\d+$/.test(line.id)) {
    const mv = (line.where.match(/fight \((.*)\)$/) || [])[1] || '';
    if (/x STACK ATTACK|^STACK ATTACK$/.test(mv)) return [];
    if (MOVE_SFX[mv]) return [{ sfx: MOVE_SFX[mv], at: 'after', vol: 0.8 }];
  }
  return [];
}

module.exports = { perform, plain, SAMPLE_PERF, PERF, SFX, CUES, cuesFor };
