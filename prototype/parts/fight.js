// ===================== FIGHT-START =====================
// Fight mode: when you clear a level, Plumpy climbs the tower you built (every block left a step), smashes the cage,
// and the Chog you just freed fights the villain that caged it. Its moves come from its own NFT traits and powers.
// Each move: name, a rhyme it shouts, an effect (how it looks) and a sound.
// fx: fire ice goo bolt laser coin wind bone magic heart bubble water smoke rainbow slap scream

// [test, name, rhyme, fx, colour]. Tested against "Key: value" strings of the Chog's traits, first match wins per trait.
const MOVE_RULES = [
  // legends (1:1s) get their own signature
  [/Chog Scream/, 'MEGA SCREAM', 'AAAAAAAAAAAAA!', 'scream', '#ffffff'],
  [/Grim/, 'REAPER SWING', 'your time is up.', 'bone', '#b9a3ff'],
  [/Chogbomination/, 'ABOMINATION HUG', 'hug me, villain... forever.', 'goo', '#7cff6b'],
  [/Blaze/, 'INFERNO', 'burn it ALL down!', 'fire', '#ff7a1a'],
  [/Burning Skully/, 'SKULL FIREBALL', 'flaming bones, coming home!', 'fire', '#ff5a1f'],
  [/Midas/, 'MIDAS TOUCH', 'everything i touch turns to KO.', 'coin', '#ffd23f'],
  // eyes
  [/Eyes: (Green|Purple|fire) laser/i, 'LASER GLARE', 'laser eyes, villain fries!', 'laser', '#ff3b3b'],
  [/Eyes: .*(Glass|visor)/i, 'SHADES BEAM', 'shades on, villain gone!', 'laser', '#63e2e6'],
  [/Eyes: Heart/i, 'LOVE TAP', 'love tap, villain takes a nap!', 'heart', '#ff4f9a'],
  [/Eyes: .*(Crying|Tear)/i, 'TEAR TSUNAMI', 'tears of rage, off the stage!', 'water', '#5aaaff'],
  [/Eyes: Clown/i, 'CLOWN STARE', 'clown eyes, big surprise!', 'rainbow', '#ff4f9a'],
  [/Eyes: (Angry|Thug)/i, 'ANGRY STARE', 'angry eyes, villain cries!', 'slap', '#e3263f'],
  // heads
  [/Head: Thunder/i, 'THUNDER CAP', 'thunder cap, lightning slap!', 'bolt', '#ffe14d'],
  [/Head: .*(horn|Horny)/i, 'HORN CHARGE', 'horns down, out of town!', 'slap', '#e3263f'],
  [/Head: Wizard/i, 'WIZARD BLAST', 'hocus pocus, lose your focus!', 'magic', '#b48cff'],
  [/Head: .*(Crown|wreath|Diamond|Thorn)/i, 'ROYAL SMACK', 'bow to the crown, villain goes down!', 'magic', '#ffd700'],
  [/Head: .*(BTC|Buttcoin)/i, 'BITCOIN BONK', 'number go up, villain go down!', 'coin', '#f7931a'],
  [/Head: ETH/i, 'GAS FEE PUNCH', 'gas fee? paid by thee!', 'bolt', '#8c8cff'],
  [/Head: Dollar/i, 'DOLLAR DROP', 'make it rain, feel the pain!', 'coin', '#2fbf71'],
  [/Head: 10k TPS/i, '10K TPS FLURRY', 'ten thousand hits per second!', 'slap', '#63e2e6'],
  [/Head: WAGMI/i, 'WAGMI WAVE', "we're all gonna make it. you're not.", 'water', '#7b5cf0'],
  [/Head: .*(Choggie|Mon |MEGA Chog|MCGA|Mon Beanie)/i, 'CHOG POWER', "chog power, villain's final hour!", 'magic', '#7b5cf0'],
  [/Head: .*(Japan|Bandana|Head Wrap)/i, 'NINJA CHOP', 'ninja chop, villain drop!', 'slap', '#ffffff'],
  [/Head: Plumber/i, 'PIPE STOMP', 'pipe down! stomp town!', 'slap', '#e3263f'],
  [/Head: Taped Banana/i, 'BANANA BONK', 'banana bonk! villain, honk!', 'slap', '#ffe14d'],
  [/Head: Mafia/i, 'MAFIA SLAP', 'mafia slap, take a nap!', 'slap', '#1b1024'],
  [/Head: Russian/i, 'WINTER WALLOP', "winter's here, villain, fear!", 'ice', '#bfe6ff'],
  [/Head: Durag/i, 'WAVE CHECK', 'wave check! villain wrecked!', 'water', '#5aaaff'],
  [/Head: Clown/i, 'HONK ATTACK', 'honk honk, villain conked!', 'rainbow', '#ff4f9a'],
  [/Head: .*Peace/i, 'PEACE OUT', 'peace out, villain, lights out!', 'heart', '#ff4f9a'],
  [/Head: .*Star/i, 'STAR STRIKE', 'catch a star, fall too far!', 'magic', '#ffe14d'],
  [/Head: .*(Cap|Beanie|Hat|Bucket)/i, 'CAP SLAP', 'cap on tight, villain, goodnight!', 'slap', '#ff4f9a'],
  // auras
  [/Aura: .*(Burning|Fiery|Fire)/i, 'FLAME AURA', 'feel the heat, admit defeat!', 'fire', '#ff7a1a'],
  [/Aura: Wind/i, 'TORNADO SPIN', 'gust of air, villain? where?', 'wind', '#e8f6ff'],
  [/Aura: Smoke/i, 'SMOKE BOMB', 'smoke screen, villain unseen!', 'smoke', '#cfc6e8'],
  [/Aura: .*(Cool|Aqua)/i, 'BRAIN FREEZE', 'freeze! say please!', 'ice', '#8fd8ff'],
  [/Aura: .*Royal/i, 'ROYAL AURA', 'bow to the crown, villain goes down!', 'magic', '#ffd700'],
  [/Aura: .*(Rose|Pink Mist)/i, 'ROSE THORNS', "roses are red, villain's in bed!", 'heart', '#ff6f91'],
  [/Aura: /i, 'AURA BURST', "aura check: villain's a wreck!", 'magic', '#c79bff'],
  // mouths
  [/Mouth: Bubblegum/i, 'BUBBLEGUM BOMB', 'bubblegum pop, villain flop!', 'bubble', '#ff9ad5'],
  [/Mouth: Gold Tooth/i, 'GOLD GRILL BITE', 'gold tooth bite, lights out tonight!', 'coin', '#ffd23f'],
  [/Mouth: Rainbow Puke/i, 'RAINBOW SPEW', 'rainbow spew, all over you!', 'rainbow', '#ff4f9a'],
  [/Mouth: BTC Coin/i, 'COIN SPIT', 'coin spit, villain quit!', 'coin', '#f7931a'],
  [/Mouth: Drooling/i, 'DROOL FLOOD', "drool flood, villain's mud!", 'water', '#7ff0e8'],
  [/Mouth: Clown/i, 'HONK ATTACK', 'honk honk, villain conked!', 'rainbow', '#ff4f9a'],
  // accessories
  [/Accessory: Fwog/i, 'FWOG FRIEND', "fwog friend, villain's end!", 'goo', '#7cff6b'],
  [/Accessory: Cigar/i, 'CIGAR SMOKE', "cigar smoke, villain's broke!", 'smoke', '#cfc6e8'],
  [/Accessory: (Coin|SB)/i, 'COIN TOSS', 'heads i win, tails you lose!', 'coin', '#ffd23f'],
  [/Accessory: Green Candle/i, 'GREEN CANDLE PUMP', 'green candle pump, villain dump!', 'bolt', '#2fbf71'],
  [/Accessory: Heart/i, 'LOVE TAP', 'love tap, villain takes a nap!', 'heart', '#ff4f9a'],
  // body
  [/Body: Wizard/i, 'WIZARD BLAST', 'hocus pocus, lose your focus!', 'magic', '#b48cff'],
  [/Body: Fire/i, 'FLAME AURA', 'feel the heat, admit defeat!', 'fire', '#ff7a1a'],
  [/Body: .*143 Jersey/i, 'SLAM DUNK', "slam dunk, villain's sunk!", 'slap', '#ffc93c'],
  [/Body: .*(CEO|Tuxedo|tuxedo|Gangster)/i, 'CEO SLAP', "you're fired!", 'coin', '#ffd23f'],
  [/Body: Hawaiian/i, 'ALOHA SLAP', 'aloha, villain! goodbye-a!', 'slap', '#2fbf71'],
  [/Body: Squid Game/i, 'RED LIGHT KO', 'red light... KO light!', 'laser', '#e3263f'],
  [/Body: (Gojo|Guko|Sci Fi)/i, 'SPIRIT BLAST', "spirit blast, villain's past!", 'magic', '#63e2e6'],
  [/Body: Glitch/i, 'GLITCH HIT', 'glitch in the code, villain explode!', 'laser', '#63e2e6'],
  [/Body: Duck Float/i, 'DUCK DIVE', 'quack attack, villain flat on its back!', 'water', '#ffe14d'],
  // bases
  [/Base: Skull/i, 'BONE RATTLE', "bone zone! villain's thrown!", 'bone', '#ffffff'],
  [/Base: Radioactive/i, 'GOO NUKE', 'goo nuke! villain, puke!', 'goo', '#7cff6b'],
];
// powers always count too (they come from Base / Aura / Accessory)
const POWER_MOVES = {
  hot: ['HOT BELLY SLAM', 'hot, hot, hot! take that shot!', 'fire', '#ff7a1a'],
  chill: ['CHILL PILL', "chill pill, villain's still!", 'ice', '#8fd8ff'],
  sticky: ['GOO ON YOU', "goo on you, now you're glued!", 'goo', '#7cff6b'],
  heavy: ['BONE CRUSHER', 'sticks and stones break villain bones!', 'bone', '#ffffff'],
  royal: ['ROYAL SMACK', 'bow to the crown, villain goes down!', 'magic', '#ffd700'],
  floaty: ['CLOUD PUNCH', 'float like a cloud, hit like a crowd!', 'smoke', '#ffffff'],
  soft: ['PILLOW FRIGHT', 'pillow fight? pillow FRIGHT!', 'heart', '#ffd6ea'],
  golden: ['MAKE IT RAIN', 'make it rain, feel the pain!', 'coin', '#ffd23f'],
  windproof: ['TORNADO SPIN', 'gust of air, villain? where?', 'wind', '#e8f6ff'],
};
const BASIC_MOVE = ['BELLY BUMP', 'belly bump, villain slump!', 'slap', '#ff4f9a'];
const FINISHER = ['STACK ATTACK', 'from the plate to the moon. villain, you are DOOMED!', 'rainbow', '#ffc93c'];
// the sound each kind of move makes
const FX_SOUNDS = { fire: ['sizzle', 'rumble'], ice: ['freeze'], goo: ['squish'], bolt: ['zap', 'zap'], laser: ['zap'], coin: ['coin', 'coin'], wind: ['wind'], bone: ['chop', 'chop'],
  magic: ['levelup'], heart: ['quest'], bubble: ['pop', 'pop'], water: ['splat', 'wind'], smoke: ['fud'], rainbow: ['star'], slap: ['chop', 'boing'], scream: ['siren'] };

function chogLegend(c) { return (String(c.name || '').split('—')[1] || '').trim(); }
// 3 moves + the finisher for a Chog (always the same for the same Chog)
function movesFor(c) {
  const t = c.traits || {}, out = [], seen = new Set();
  const push = (name, rhyme, fx, col, from) => { if (out.length >= 3 || seen.has(name)) return; seen.add(name); out.push({ name, rhyme, fx, col, from }); };
  const lg = chogLegend(c);
  const facts = [lg ? lg : null, ...['Eyes', 'Head', 'Aura', 'Mouth', 'Accessory', 'Body', 'Base'].map((k) => (t[k] ? `${k}: ${t[k]}` : null))].filter(Boolean);
  for (const f of facts) {
    const r = MOVE_RULES.find(([re]) => re.test(f));
    if (r) push(r[1], r[2], r[3], r[4], f.includes(':') ? f : `1:1 ${f}`);
  }
  for (const p of (typeof chogPowers === 'function' ? chogPowers(c) : [])) if (POWER_MOVES[p]) { const [n, rh, fx, col] = POWER_MOVES[p]; push(n, rh, fx, col, `power: ${p}`); }
  if (out.length < 3) push(BASIC_MOVE[0], BASIC_MOVE[1], BASIC_MOVE[2], BASIC_MOVE[3], 'plump body');
  if (out.length < 3) push('CHOG CHARGE', "chog charge, villain's not so large!", 'slap', '#7b5cf0', 'Form: Chog');
  const fin = lg && out[0] ? { name: out[0].name + ' x STACK ATTACK', rhyme: FINISHER[1], fx: out[0].fx, col: out[0].col, from: 'finisher', finisher: true }
    : { name: FINISHER[0], rhyme: FINISHER[1], fx: FINISHER[2], col: FINISHER[3], from: 'finisher', finisher: true };
  return { moves: out, finisher: fin };
}
// ===================== FIGHT-END =====================
