// ===================== LEVELS-START =====================
// 7 worlds x 7 levels + the Bear. Every level frees one real Chog Genesis NFT from a villain's cage.
// rules: ice, wind (strength x), gravity, clawFast, clawWild, events + every, plateW, shrink (units per drop),
//        moving {amp, period}, tilt (radians), fog, diet (everyone skinny), random (the Bear picks who drops),
//        timer (seconds per drop), only {tier: min tier rank} | {shape}
// goals: height | perfects | combo | survive (events + min height) | flag (height, then a pointy on top)
// story rule: every Chog drops once per round; when the whole squad has dropped, everyone goes again. Freed Chogs add variety + powers.
// rugs: how many rugs you can feed in a level (bellies reset every level)
const WORLDS = [
  { id: 1, name: 'The Snack Plate', theme: 'kitchen', twist: 'Learn the ropes',
    intro: [['plumpy', '4am. stomach growling. time for a snack.'], ['plumpy', 'the plate is... empty?? there is a note.'], ['bear', 'lol. i took every snack to the Purple Moon. and i locked 50 of your friends in cages. — The Bear'], ['bear', 'oh, and i hired 50 villains from every chain to guard them. one per cage. good luck.'], ['plumpy', 'no rocket. no plan. we stack ourselves up there, knock every villain off its perch and free everyone.']] },
  { id: 2, name: 'Fridge Top', theme: 'ice', twist: 'Ice: everything slides',
    intro: [['bear', 'i left the freezer door open. enjoy the ice rink.'], ['plumpy', 'my feet are cold. my belly is empty. i am not okay.']] },
  { id: 3, name: 'The Open Window', theme: 'wind', twist: 'Wind: gusts shove the tower',
    intro: [['bear', '*blows on the tower* hoo. hoooooo.'], ['plumpy', 'that is not wind. that is a bear breathing on us. disgusting.']] },
  { id: 4, name: 'Cloud Buffet', theme: 'clouds', twist: 'Moon gravity, fog and a moving plate',
    intro: [['plumpy', 'clouds. i ate one. it tasted like nothing.'], ['bear', 'up here everything floats. good luck landing anything, fatty.'], ['plumpy', 'he called me fatty. i will land PERFECTLY out of spite.']] },
  { id: 5, name: 'Orbit Diner', theme: 'orbit', twist: 'Paper Hands sell-offs',
    intro: [['bear', 'meet my goons. Paper Hands. they sell everything.'], ['plumpy', 'they are dumping on the tower. on PURPOSE.'], ['plumpy', 'hold. HOLD.']] },
  { id: 6, name: "Rugzilla's Lair", theme: 'rug', twist: 'Rug pulls tip the plate',
    intro: [['bear', 'Rugzilla. do the thing.'], ['plumpy', 'not the rug. ANYTHING but the rug.']] },
  { id: 7, name: 'The Purple Moon', theme: 'moon', twist: 'Everything at once',
    intro: [['bear', 'you actually made it. for SNACKS. respect.'], ['bear', 'but the moon is MINE. *cracks knuckles*'], ['plumpy', 'pointy heads. your time is coming.']] },
  { id: 8, name: 'The Bear', theme: 'boss', twist: 'Final boss',
    intro: [['bear', 'last cage. the shiny one. my boss guards it himself.'], ['bear', '*throws everything*'], ['plumpy', 'we stack to 20. then a pointy Chog plants the flag. for snacks. for the cages. for chog world.']] },
];

const LEVEL_DEFS = [
  // ---- World 1: The Snack Plate ----
  { name: 'Midnight Snack', twist: 'Learn the drop', goal: { type: 'height', value: 3 }, drops: 6, stars: { drops: 4, perfects: 1 }, rules: {},
    tip: 'Tap when Plumpy is right over the plate. Land dead centre for a PERFECT.', outro: 'cage one: cracked. we have a friend.' },
  { name: 'Crumb Trail', twist: 'Stack 3', goal: { type: 'height', value: 3 }, drops: 6, stars: { drops: 4, perfects: 1 }, rules: {},
    say: ['bear', 'three chogs tall? on that plate? lol.'], tip: 'Every Chog drops once per round, then the whole squad goes again. Pick who drops next in the tray. Every cage you break adds one more Chog to your squad.', outro: 'three tall. the crumbs lead up.' },
  { name: 'Bullseye', twist: 'Land a PERFECT', goal: { type: 'perfects', value: 1, minHeight: 4 }, drops: 10, stars: { drops: 7, perfects: 2 }, rules: {},
    say: ['plumpy', 'i only land perfect. it is a lifestyle.'], tip: 'A PERFECT lands dead centre on the Chog below. The ring turns green when you are on target. Royal Chogs (👑) get a wider zone.', outro: 'bullseye. i am a sniper.' },
  { name: 'Saucer', twist: 'TINY PLATE', goal: { type: 'height', value: 4 }, drops: 8, stars: { drops: 5, perfects: 1 }, rules: { plateW: 140 },
    say: ['bear', 'i swapped your plate for a saucer. good luck.'], tip: 'The plate is tiny. Anything off-centre falls off the edge.', outro: 'saucer conquered.' },
  { name: 'Hat Check', twist: 'FLAG: pointy head on top', goal: { type: 'flag', value: 4 }, drops: 8, stars: { drops: 5, perfects: 1 }, rules: {},
    say: ['plumpy', 'pointy heads cannot hold anyone up. but they make great flagpoles.'], tip: 'Stack 4 tall, then drop a pointy-head Chog on top. Nothing can sit on a pointy head, so save them for last.', outro: 'flag planted. tiny moon practice.' },
  { name: 'Big Appetite', twist: 'FEED TO WIN', goal: { type: 'height', value: 5 }, drops: 9, stars: { drops: 6, perfects: 1 }, rules: { plateW: 170 },
    say: ['plumpy', 'i have been starving for five levels. FEED ME.'], tip: 'Feed a rug before you drop. Fat Chogs are wider and heavier, so the tower gets steadier.', outro: 'belly full. tower tall.' },
  { name: 'Bear Crumbs', twist: 'FINALE: 5 tall on a small plate', goal: { type: 'height', value: 5 }, drops: 9, stars: { drops: 6, perfects: 1 }, rules: { plateW: 160 }, badge: 'Snack Hunter',
    say: ['bear', 'fine. you got past the kitchen. the fridge is MINE.'], tip: 'Five tall. Feed your base Chogs so the bottom is wide.', outro: 'kitchen cleared. that hot one we freed looks useful for the fridge.' },
  // ---- World 2: Fridge Top ----
  { name: 'Freezer Burn', twist: 'ICE: everything slides', goal: { type: 'height', value: 5 }, drops: 9, stars: { drops: 6, perfects: 1 }, rules: { ice: true },
    tip: 'On ice everything slides off everything. Hot Chogs (🔥) never freeze and melt the ice they land on.', outro: 'brrr. five tall on ice.' },
  { name: 'Ice Rink', twist: 'ICE', goal: { type: 'height', value: 6 }, drops: 10, stars: { drops: 8, perfects: 1 }, rules: { ice: true },
    say: ['plumpy', 'the hot one. use the hot one first. melt the plate.'], tip: 'Drop a Hot Chog (🔥) first: it melts the plate under it.', outro: 'the ice is melting. so is the bear.' },
  { name: 'Slush Puppy', twist: 'ICE + PERFECTS', goal: { type: 'perfects', value: 2, minHeight: 6 }, drops: 12, stars: { drops: 10, perfects: 2 }, rules: { ice: true },
    say: ['bear', 'perfect landings? on ice? i will wait.'], tip: 'Land 2 PERFECT drops. Off-centre Chogs slide right off.', outro: 'perfect on ice. figure skater behaviour.' },
  { name: 'Fridge Magnet', twist: 'ICE + TINY PLATE', goal: { type: 'height', value: 6 }, drops: 10, stars: { drops: 8, perfects: 1 }, rules: { ice: true, plateW: 160 },
    tip: 'A small icy plate. Fat Chogs grip better.', outro: 'stuck the landing. like a magnet.' },
  { name: 'Diet Day', twist: 'DIET: every Chog drops skinny', goal: { type: 'height', value: 7 }, drops: 11, stars: { drops: 9, perfects: 1 }, rules: { ice: true, diet: true },
    say: ['bear', 'i put everyone on a diet. no fat chogs today.'], tip: 'Every Chog drops skinny today, no matter what it ate. Skinny Chogs are light and wobbly.', outro: 'survived diet day. barely. i need a snack.' },
  { name: 'Snowball', twist: 'ROUND HEADS ONLY', goal: { type: 'height', value: 7 }, drops: 11, stars: { drops: 9, perfects: 1 }, rules: { ice: true, only: { shape: 'round' }, every: 5 }, final: 'pump',
    say: ['bear', 'only round heads allowed on my ice. hehe.'], tip: 'Only round-head Chogs can drop. Round tops are slippery. Land soft and centred.', outro: 'round on round on ice. physics is crying.' },
  { name: 'Brain Freeze', twist: 'FINALE: ice + the Bear bites the plate', goal: { type: 'height', value: 8 }, drops: 13, stars: { drops: 10, perfects: 2 }, rules: { ice: true, shrink: 4 }, final: 'pump', badge: 'Brain Freeze',
    say: ['bear', '*nom* i am eating your plate. one bite per drop.'], tip: 'The Bear bites the plate after every drop. Build fast and build centred.', outro: 'brain freeze. worth it.' },
  // ---- World 3: The Open Window ----
  { name: 'Draft', twist: 'WIND', goal: { type: 'height', value: 8 }, drops: 13, stars: { drops: 10, perfects: 2 }, rules: { wind: 0.7 },
    tip: 'A GUST warning flashes before every gust. Drop in the calm between them.', outro: 'a light breeze. we laughed.' },
  { name: 'Gust Bust', twist: 'WIND', goal: { type: 'height', value: 8 }, drops: 13, stars: { drops: 10, perfects: 2 }, rules: { wind: 0.7 },
    say: ['plumpy', 'the windproof one. bring the windproof one.'], tip: 'Windproof Chogs (🌬️) ignore gusts. Fat Chogs barely notice them.', outro: 'the bear ran out of breath. we did not.' },
  { name: 'Hurry Up', twist: 'TIMER: 4 seconds per drop', goal: { type: 'height', value: 9 }, drops: 14, stars: { drops: 11, perfects: 2 }, rules: { wind: 0.8, timer: 4 },
    say: ['bear', 'tick tock. tick tock.'], tip: 'Plumpy lets go by itself after 4 seconds. No waiting out the gusts.', outro: 'speedrun.' },
  { name: 'Kite Season', twist: 'WIND + PERFECTS', goal: { type: 'perfects', value: 2, minHeight: 9 }, drops: 16, stars: { drops: 13, perfects: 3 }, rules: { wind: 0.6 },
    tip: 'Land 2 PERFECT drops while the wind blows.', outro: 'perfect in a hurricane. legendary.' },
  { name: 'Wonky Table', twist: 'TILTED PLATE', goal: { type: 'height', value: 9 }, drops: 14, stars: { drops: 11, perfects: 2 }, rules: { wind: 0.6, tilt: 0.016 },
    say: ['bear', 'i sawed off one leg of the table. oops.'], tip: 'The plate leans. Everything wants to slide downhill.', outro: 'we stood on a slope. like mountain goats.' },
  { name: "Bear's Choice", twist: 'RANDOM: the Bear picks who drops', goal: { type: 'height', value: 10 }, drops: 15, stars: { drops: 12, perfects: 2 }, rules: { wind: 0.35, random: true },
    say: ['bear', 'i choose your chogs now. hehe.'], tip: 'You do not pick. The Bear picks a random Chog from your squad for every drop (never a pointy one, he is not THAT mean).', outro: 'any chog. any time. we adapt.' },
  { name: 'The Big Blow', twist: 'FINALE: storm', goal: { type: 'height', value: 10 }, drops: 15, stars: { drops: 12, perfects: 2 }, rules: { wind: 0.65 }, badge: 'Windbreaker',
    say: ['bear', 'HOOOOOOOOOO.'], tip: 'The strongest wind yet. Windproof and fat Chogs only, if you are smart.', outro: 'storm survived. the window is shut.' },
  // ---- World 4: Cloud Buffet ----
  { name: 'Fluff', twist: 'MOON GRAVITY', goal: { type: 'height', value: 10 }, drops: 15, stars: { drops: 12, perfects: 2 }, rules: { gravity: 0.45 },
    tip: 'Low gravity: Chogs drift down slowly. Tap a little early.', outro: 'floaty. fun. weird.' },
  { name: 'Cloud Nine', twist: 'FAST PLUMPY + PERFECTS', goal: { type: 'perfects', value: 3, minHeight: 11 }, drops: 18, stars: { drops: 15, perfects: 3 }, rules: { gravity: 0.45, clawFast: 1.25 },
    tip: 'Low gravity and a faster Plumpy. Land 3 PERFECT drops.', outro: 'cloud nine. well, three.' },
  { name: 'Fog Bank', twist: 'FOG: no landing guide', goal: { type: 'height', value: 11 }, drops: 16, stars: { drops: 13, perfects: 2 }, rules: { fog: true },
    say: ['plumpy', 'i cannot see. i can only feel. and i feel hungry.'], tip: 'Fog hides the landing guide. Trust your eyes. Floaty Chogs (☁️) are easier to time.', outro: 'flew blind. landed anyway.' },
  { name: 'Sky Waiter', twist: 'MOVING PLATE', goal: { type: 'height', value: 11 }, drops: 16, stars: { drops: 13, perfects: 2 }, rules: { moving: { amp: 20, period: 420 } }, final: 'pump',
    say: ['bear', 'my waiter will carry your tower. he is clumsy.'], tip: 'The plate slides back and forth. The tower rides along. Plumpy follows it.', outro: 'tipped the waiter. not literally.' },
  { name: 'Combo Cloud', twist: 'COMBO x2', goal: { type: 'combo', value: 2, minHeight: 12 }, drops: 20, stars: { drops: 17, perfects: 3 }, rules: { gravity: 0.6 },
    tip: 'Land 2 PERFECT drops in a row. One miss resets the combo.', outro: 'combo. say it with me. COMBO.' },
  { name: 'Sugar Rush', twist: 'SUGAR RUSH: Plumpy keeps changing speed', goal: { type: 'height', value: 12 }, drops: 18, stars: { drops: 15, perfects: 2 }, rules: { clawWild: true },
    say: ['bear', 'i gave plumpy an energy drink.'], tip: 'Plumpy speeds up and slows down. Watch the rhythm before you tap.', outro: 'sugar rush: over. we survived.' },
  { name: 'The Buffet', twist: 'FINALE: fog + moon gravity', goal: { type: 'height', value: 12 }, drops: 18, stars: { drops: 15, perfects: 2 }, rules: { gravity: 0.5, fog: true }, badge: 'Cloud Eater',
    tip: 'Twelve tall in the fog, floating. Breathe.', outro: 'the buffet is ours. clouds still taste like nothing.' },
  // ---- World 5: Orbit Diner ----
  { name: 'Paper Hands', twist: 'SELL-OFF every 3rd drop', goal: { type: 'height', value: 13 }, drops: 19, stars: { drops: 16, perfects: 3 }, rules: { events: ['sell'], every: 3 },
    tip: 'After every 3rd drop the Paper Hands sell and the tower shakes. Chill Chogs (🧊) ignore it.', outro: 'paper hands. diamond tower.' },
  { name: 'Dump Truck', twist: 'SELL-OFF every 2nd drop', goal: { type: 'height', value: 13 }, drops: 19, stars: { drops: 16, perfects: 3 }, rules: { events: ['sell'], every: 2 },
    tip: 'Build wide. A fat base takes the shaking.', outro: 'they dumped. we held.' },
  { name: 'Heavy Metal', twist: 'HEAVY GRAVITY', goal: { type: 'height', value: 13 }, drops: 19, stars: { drops: 16, perfects: 3 }, rules: { gravity: 1.5 },
    say: ['bear', 'i cranked the diner gravity. sit DOWN.'], tip: 'Gravity is cranked up. Chogs fall fast and slam down. Tap a little late.', outro: 'heavy. but so are we.' },
  { name: 'Conveyor Belt', twist: 'MOVING PLATE + SELL-OFFS', goal: { type: 'height', value: 14 }, drops: 20, stars: { drops: 17, perfects: 3 }, rules: { moving: { amp: 14, period: 480 }, events: ['sell'], every: 4 },
    tip: 'The plate slides and the Paper Hands sell. Keep it short and centred.', outro: 'order up. one tower, extra shaky.' },
  { name: 'Diamond Hands', twist: 'SURVIVE 2 SELL-OFFS', goal: { type: 'survive', value: 2, minHeight: 14 }, drops: 21, stars: { drops: 18, perfects: 3 }, rules: { events: ['sell'], every: 2 },
    tip: 'Keep 4+ Chogs standing through 2 sell-offs.', outro: 'diamond hands. certified.' },
  { name: 'VIP Booth', twist: 'UNCOMMON OR RARER ONLY', goal: { type: 'height', value: 14 }, drops: 20, stars: { drops: 17, perfects: 3 }, rules: { only: { tier: 1 }, events: ['sell'], every: 3 },
    say: ['bear', 'commons? in MY diner? no.'], tip: 'Commons wait outside. Uncommon, Rare, Epic or Legendary only.', outro: 'vip tower. velvet rope.' },
  { name: 'Last Orders', twist: 'FINALE: frozen diner + sell-offs', goal: { type: 'height', value: 15 }, drops: 21, stars: { drops: 18, perfects: 3 }, rules: { events: ['sell'], every: 3, ice: true }, final: 'pump', badge: 'Diamond Hands',
    say: ['bear', 'the diner freezer broke. everything is ice. and my goons are selling.'], tip: 'Fifteen tall on ICE with sell-offs every 3rd drop. Hot (🔥) and Chill (🧊) Chogs are gold here.', outro: 'the diner is closed. we ate everything.' },
  // ---- World 6: Rugzilla's Lair ----
  { name: 'Rug Burn', twist: 'RUG PULL every 3rd drop', goal: { type: 'survive', value: 1, minHeight: 15 }, drops: 22, stars: { drops: 19, perfects: 3 }, rules: { events: ['rug'], every: 3 },
    tip: 'Every 3rd drop Rugzilla pulls the rug and the plate tips. Radioactive Chogs (☢️) stick where they land.', outro: 'first rug survived. scary.' },
  { name: 'Shag Carpet', twist: 'RUG PULLS', goal: { type: 'height', value: 15 }, drops: 21, stars: { drops: 18, perfects: 3 }, rules: { events: ['rug'], every: 3 },
    tip: 'Fifteen tall through the rug pulls. Keep the tower centred.', outro: 'the carpet is gone. we stand.' },
  { name: 'Tilt-a-Whirl', twist: 'TILTED PLATE + RUGS', goal: { type: 'survive', value: 2, minHeight: 16 }, drops: 24, stars: { drops: 20, perfects: 3 }, rules: { tilt: 0.015, events: ['rug'], every: 3 },
    tip: 'The plate already leans, and then the rug gets pulled.', outro: 'dizzy. but standing.' },
  { name: 'Rug & Pump', twist: 'RUGS + PUMPS take turns', goal: { type: 'height', value: 16 }, drops: 23, stars: { drops: 19, perfects: 3 }, rules: { events: ['rug', 'pump'], every: 2 },
    tip: 'Pumps bring moon gravity for 6 seconds. Rugs tip the plate. They take turns.', outro: 'up and down. like the chart.' },
  { name: 'Skull Squad', twist: 'RARE OR RARER ONLY', goal: { type: 'height', value: 17 }, drops: 24, stars: { drops: 20, perfects: 3 }, rules: { only: { tier: 2 }, events: ['rug'], every: 3 },
    say: ['bear', 'only the scary ones tonight.'], tip: 'Only Rare, Epic and Legendary Chogs. Skulls (🦴) are heavy.', outro: 'skulls stack. who knew.' },
  { name: 'Magic Carpet', twist: 'MOVING PLATE + RUGS', goal: { type: 'height', value: 17 }, drops: 24, stars: { drops: 20, perfects: 3 }, rules: { moving: { amp: 16, period: 480 }, events: ['rug'], every: 3 },
    tip: 'The plate slides, then the rug gets pulled.', outro: 'the rug moved. we did not.' },
  { name: "Rugzilla's Lair", twist: 'FINALE: rug every 2nd drop', goal: { type: 'survive', value: 3, minHeight: 17 }, drops: 25, stars: { drops: 21, perfects: 3 }, rules: { events: ['rug'], every: 2 }, badge: 'Rug Survivor',
    say: ['bear', 'Rugzilla. ALL the rugs.'], tip: 'Survive 3 rug pulls with 4+ Chogs standing.', outro: 'the rug is gone. Rugzilla is crying.' },
  // ---- World 7: The Purple Moon ----
  { name: 'Launch Pad', twist: 'PUMPS + SELL-OFFS', goal: { type: 'height', value: 18 }, drops: 25, stars: { drops: 22, perfects: 4 }, rules: { events: ['pump', 'sell'], every: 3, gravity: 0.7 },
    tip: 'Lighter gravity, pumps and sell-offs. Eighteen tall.', outro: 'liftoff.' },
  { name: 'Moon Ice', twist: 'ICE + MOON GRAVITY', goal: { type: 'height', value: 18 }, drops: 25, stars: { drops: 22, perfects: 4 }, rules: { ice: true, gravity: 0.55 },
    say: ['plumpy', 'the moon is made of ice?? i thought it was grape jelly.'], tip: 'Frozen moon rock and floaty gravity. Everything slides, slowly.', outro: 'moon ice in my belly button.' },
  { name: 'Crater', twist: 'HEAVY GRAVITY + BITES', goal: { type: 'height', value: 18 }, drops: 25, stars: { drops: 22, perfects: 4 }, rules: { gravity: 1.4, shrink: 6 },
    say: ['bear', '*nom* moon cheese plate. delicious.'], tip: 'Heavy gravity, and the Bear bites the plate after every drop.', outro: 'climbed out of the crater.' },
  { name: 'Solar Wind', twist: 'WIND + TILTED PLATE', goal: { type: 'height', value: 19 }, drops: 26, stars: { drops: 23, perfects: 4 }, rules: { wind: 0.2, tilt: 0.006 },
    tip: 'Gusts and a leaning plate.', outro: 'the sun sneezed. we held.' },
  { name: 'Dark Side', twist: 'FOG + SELL-OFFS + RUGS', goal: { type: 'height', value: 19 }, drops: 26, stars: { drops: 23, perfects: 4 }, rules: { fog: true, events: ['sell', 'rug'], every: 4 }, final: 'pump',
    tip: 'No landing guide. Sell-offs and rugs take turns.', outro: 'the dark side has snacks too.' },
  { name: 'Moon Combo', twist: 'COMBO x3', goal: { type: 'combo', value: 3, minHeight: 19 }, drops: 28, stars: { drops: 25, perfects: 5 }, rules: { gravity: 0.7 },
    tip: 'Three PERFECT drops in a row. Royal Chogs (👑) make it easier.', outro: 'four in a row. on the moon.' },
  { name: "Bear's Doorstep", twist: 'FLAG: plant it at 19 tall', goal: { type: 'flag', value: 19 }, drops: 26, stars: { drops: 23, perfects: 4 }, rules: { events: ['rug'], every: 4 }, final: 'sell',
    say: ['plumpy', 'practice run. 19 tall, then a pointy head on top.'], tip: 'Reach 19 Chogs tall, then drop a pointy-head Chog on top. It is the flagpole.', outro: 'knock knock, bear.' },
  // ---- The Bear ----
  { name: 'The Bear', twist: 'BOSS: the Bear throws everything', goal: { type: 'flag', value: 20 }, drops: 28, stars: { drops: 24, perfects: 4 }, rules: { events: ['sell', 'pump', 'rug'], every: 3 }, badge: 'Moonwalker',
    tip: 'Reach 20 tall through sell-offs, pumps and rug pulls. Then a pointy Chog plants the flag.', outro: 'FLAG PLANTED. the moon is grape jelly.',
    ending: [['bear', '...you planted a flag. on MY moon.'], ['plumpy', 'the moon is grape jelly. there is enough for everyone.'], ['bear', '...can i have some?'], ['plumpy', 'chog world order. everybody eats. even bears.'], ['plumpy', 'wait. what is that... behind the moon?']] },
];

// Which real Chog (token ID) is trapped in each level's jar. Rarer Chogs sit deeper in the story.
const JAR_TOKENS = [
  1915, 289, 1380, 1580, 1381, 1936, 1096, 1925, 1622, 906, 413, 122, 438, 120,      // levels 1-14: Common
  1203, 1560, 534, 127, 372, 1047, 1418, 19, 912, 1182, 753, 432,                   // 15-26: Uncommon
  1764, 630, 358, 428, 1447, 1819, 1615, 1354, 400, 1486,                          // 27-36: Rare (Skulls)
  1382, 1280, 1708, 1733, 1730, 1133, 1517, 284,                                   // 37-44: Epic (Radioactive)
  942, 1514, 1002, 561, 900, 1881,                                                 // 45-50: Legendary 1:1s
];
const STARTER_TOKENS = [4, 1, 9];

// what each caged Chog says lives with its villain now (parts/villains.js: captive)

// ---- the $CHOG market: live in every level, and it escalates ----
// New kinds of market weather unlock as the story goes on, events come more often and hit harder,
// and from level 4 a FINAL CANDLE hits once you reach the goal: hold the tower through it to break the cage.
const MARKET_UNLOCKS = [
  { type: 'whale', from: 1 },   // a whale buys: free crumbs (the market is alive)
  { type: 'pump', from: 2 },    // moon gravity for 6 seconds
  { type: 'sell', from: 4 },    // paper hands: the tower shakes
  { type: 'rug', from: 6 },     // Rugzilla tips the plate
  { type: 'freeze', from: 8 },  // liquidity freeze: plate + tower turn to ice for 5 seconds
  { type: 'fud', from: 15 },    // FUD storm: one huge gust
];
const HARMFUL = ['sell', 'rug', 'freeze', 'fud'];
// how tall the tower has to get (the villain's perch sits just above this)
function goalHeight(level) { const g = level.goal; return g.type === 'height' || g.type === 'flag' ? g.value : g.minHeight || 4.5; }
function marketFor(level) {
  const id = level.id, r = level.rules;
  const pool = MARKET_UNLOCKS.filter((u) => id >= u.from && !(u.type === 'freeze' && (r.ice || r.tilt || r.moving || r.wind))).map((u) => u.type);
  const weights = {};
  for (const t of pool) weights[t] = HARMFUL.includes(t) ? 0.6 + id / 40 : Math.max(0.5, 2.4 - id / 15);
  const H = goalHeight(level);
  // taller towers: events come a little less often (about the same number per level) and each one hits a bit softer,
  // because the same shove topples a 12-tall tower far more easily than a 5-tall one
  const every = r.every || Math.max(id <= 30 ? 3 : 2, Math.ceil(H / 3.5));   // a level that names its rhythm ('every 2nd drop') keeps it
  const power = (0.5 + id / 100) * (H > 5 ? Math.pow(5 / H, 0.7) : 1);   // events hit harder every level: 0.51 at level 1 -> 1.0 at the Bear (before the height softening)
  const cycle = r.events || null;                                // signature levels run their own event cycle
  const nasty = pool.filter((t) => HARMFUL.includes(t) && t !== 'fud');
  const sig = (r.events || []).filter((t) => HARMFUL.includes(t));
  const final = id < 4 || level.goal.type === 'survive' ? null : level.final ? level.final : sig.length ? sig[id % sig.length] : nasty.length ? nasty[id % nasty.length] : 'pump';
  const finalMul = 0.8 * Math.min(1, Math.pow(6 / H, 1.5));   // the final candle hits a fully built tall tower a little softer
  return { pool, weights, every, power, cycle, final, finalMul };
}

// ---- 3 ways to play every level (Degen + Speedrun unlock once the cage is broken) ----
const MODES = {
  normal: { name: 'Normal', icon: '🗝️', blurb: 'Knock the villain off and free the Chog.', crumbs: 1 },
  degen: { name: 'Degen', icon: '🎰', blurb: 'Market goes crazy: events come twice as often, hit 20% harder, one rug less, and the final candle is always nasty.', crumbs: 2, badge: 'Degen' },
  speed: { name: 'Speedrun', icon: '⏱️', blurb: 'Plumpy lets go by itself after 3 seconds, and you get 2 fewer drops.', crumbs: 1.5, badge: 'Speedrunner' },
};
function withMode(level, mode) {
  if (!mode || mode === 'normal') return level;
  const L = Object.assign({}, level, { mode, rules: Object.assign({}, level.rules), market: Object.assign({}, level.market, { weights: Object.assign({}, level.market.weights) }), stars: Object.assign({}, level.stars) });
  if (mode === 'degen') {
    L.market.every = Math.max(1, L.market.every - 1);
    L.market.power = L.market.power * 1.2;
    for (const t of HARMFUL) if (L.market.weights[t]) L.market.weights[t] *= 2;
    L.rugs = Math.max(0, L.rugs - 1);
    if (L.goal.type !== 'survive') L.market.final = L.market.pool.includes('rug') ? 'rug' : 'sell';
  }
  if (mode === 'speed') {
    L.rules.timer = Math.min(L.rules.timer || 99, 3);
    const need = (L.goal.value || 2) + (L.goal.type === 'flag' ? 2 : 1);
    L.drops = Math.max(need, L.drops - 2);
    L.stars.drops = Math.min(L.stars.drops, L.drops);
  }
  return L;
}

// ---- the daily $CHOG mood: changes every midnight (in the real game it comes from the live $CHOG daily candle) ----
const MOODS = [
  { id: 'bull', name: 'Bull Day', icon: '🟢', text: 'pumps and whales everywhere, +1 rug every level', crumbs: 1.25, w: { pump: 3, whale: 3 }, rugs: 1, power: 0.9 },
  { id: 'bear', name: 'Bear Day', icon: '🔴', text: 'sell-offs and rug pulls everywhere, and they hit harder', crumbs: 2, w: { sell: 2.5, rug: 2.5 }, power: 1.12 },
  { id: 'ice', name: 'Ice Age', icon: '❄️', text: 'liquidity freezes everywhere', crumbs: 1.5, w: { freeze: 3 } },
  { id: 'fud', name: 'FUD Day', icon: '🌪️', text: 'FUD storms everywhere, even in early levels', crumbs: 1.5, w: { fud: 3 }, addFud: true },
  { id: 'whale', name: 'Whale Watch', icon: '🐋', text: 'whales everywhere, and every whale feeds you a rug', crumbs: 1.25, w: { whale: 4 }, whaleRug: true },
  { id: 'crab', name: 'Crab Market', icon: '🦀', text: 'sideways day: only the final candle, no other market events', crumbs: 1, quiet: true },
];
function dayHash(day, salt) { let h = 2166136261 ^ salt; for (const ch of day) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0; return h; }
function moodFor(day) { return MOODS[dayHash(day, 77) % MOODS.length]; }
function applyMood(level, mood) {
  if (!mood) return level;
  const L = Object.assign({}, level, { mood: mood.id, market: Object.assign({}, level.market, { weights: Object.assign({}, level.market.weights), pool: level.market.pool.slice() }) });
  if (mood.addFud && level.id >= 4 && !L.market.pool.includes('fud')) { L.market.pool.push('fud'); L.market.weights.fud = 0.6 + level.id / 40; }
  for (const [t, k] of Object.entries(mood.w || {})) if (L.market.weights[t]) L.market.weights[t] *= k;
  if (mood.power) L.market.power *= mood.power;
  if (mood.rugs && !L.rules.diet) L.rugs += mood.rugs;
  if (mood.quiet && !L.market.cycle) L.market.quiet = true;   // signature levels keep their own events
  return L;
}
// today's bounty: one level + mode you have unlocked, triple crumbs
function bountyFor(day, frontier, clearedIds) {
  const h = dayHash(day, 991);
  const id = 1 + (h % Math.max(1, frontier));
  const cleared = clearedIds.includes(id);
  const mode = cleared ? ['normal', 'degen', 'speed'][(h >>> 8) % 3] : 'normal';
  return { id, mode };
}

function buildLevels() {
  const levels = [];
  LEVEL_DEFS.forEach((d, i) => {
    const id = i + 1, world = id === 50 ? 8 : Math.ceil(id / 7), W = WORLDS[world - 1];
    const firstOfWorld = id === 50 || id % 7 === 1;
    const rugs = d.rugs != null ? d.rugs : d.rules.diet ? 0 : (id <= 5 ? 1 : d.badge ? 4 : 3) + Math.max(0, Math.floor((goalHeight(d) - 4) / 3));   // taller levels: more rugs to fatten the base
    const L = Object.assign({ id, world, theme: W.theme, jar: JAR_TOKENS[i], firstOfWorld, worldName: W.name, rugs }, d, { rules: Object.assign({}, d.rules) });
    // tall levels: the twist rules ease off with height (a gust that rocks a 5-tall tower flattens a 15-tall one)
    const Hh = goalHeight(L), k = Hh > 6 ? 6 / Hh : 1;
    if (k < 1) {
      const r = L.rules, e = Math.pow(k, 0.8);
      if (r.wind) r.wind = +(r.wind * e).toFixed(3);
      if (r.tilt) r.tilt = +(r.tilt * e).toFixed(4);
      if (r.moving) r.moving = { amp: Math.max(6, Math.round(r.moving.amp * e)), period: r.moving.period };
      if (r.shrink) r.shrink = Math.max(1, Math.round(r.shrink * k));
      if (r.every) r.every += Math.floor(Hh / 6);   // a named rhythm slows down too; the level text below follows it
    }
    if (L.rules.every) {
      const ord = (n) => n + (n === 2 ? 'nd' : n === 3 ? 'rd' : 'th'), rx = /every (\d(st|nd|rd|th)|other|third|second) drop/;
      L.twist = L.twist.replace(rx, `every ${ord(L.rules.every)} drop`);
      if (L.tip) L.tip = L.tip.replace(rx, `every ${ord(L.rules.every)} drop`).replace(/After every \d(st|nd|rd|th) drop/, `After every ${ord(L.rules.every)} drop`).replace(/Every \d(st|nd|rd|th) drop/, `Every ${ord(L.rules.every)} drop`);
    }
    if (L.tip) L.tip = L.tip.replace(/(\d+)\+ Chogs standing/, `${goalHeight(L)}+ Chogs standing`);
    L.market = marketFor(L);
    levels.push(L);
  });
  return levels;
}
// ===================== LEVELS-END =====================
