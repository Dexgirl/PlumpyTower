# PLUMPY: voice script

711 lines (603 different ones) · 21 voices · recorded with ElevenLabs v3, so every line is acted, not just read

Words in [brackets] are acting directions: [laughs] makes the voice laugh, [whispers] makes it whisper. They are not spoken. The game's on-screen text stays the same (it still says "lol"); only the voice acts it out.

🔊 marks a real sound effect mixed into the line (a stomach growl, bones rattling, a saw...). They are made once with ElevenLabs Sound Effects and placed on the right word.

Every line has an ID. The recording kit names each audio file `<ID>.mp3` for you (for example `w1_0.mp3`). To re-take one line:  `node scripts/make-voices.mjs redo <ID>`.

## The cast

Design the 3 starred voices at least (Narrator, Plumpy, The Bear). Any voice you don't design gets one of ElevenLabs' built-in voices when you run `voices --fallback`.

### Plumpy  ⭐ design this one
*the hero (always the Chog you play as)* · 62 lines

**Save it in ElevenLabs with exactly this name:** `Plumpy`

**Voice Design prompt:** A small, round, always-hungry cartoon creature with a high, squeaky but deadpan voice. Speaks slowly and flatly, unimpressed by everything, with sudden bursts of excitement about food. Young, cute, a little nasal. Clear studio audio.

**Preview text:** four a.m. stomach growling. time for a snack. the plate is... empty? there is a note. ugh. no rocket. no plan. we stack ourselves to the moon.

**Test line, as acted:** [sleepy] four a.m. [yawns] stomach growling. time for a snack. [confused] the plate is... empty? there is a note. [groans] ugh. [determined] no rocket. no plan. we stack ourselves to the moon.

### The Bear  ⭐ design this one
*the villain (the bear market)* · 42 lines

**Save it in ElevenLabs with exactly this name:** `The Bear`

**Voice Design prompt:** A huge, smug cartoon villain bear with a very deep, gravelly, booming voice. Speaks slowly and mockingly, loves his own jokes and chuckles a lot. Theatrical and over the top. Clear studio audio.

**Preview text:** lol. lmao. i took every snack in the chog world to the purple moon. and i locked your little friends in cages. sell. SELL. hahaha.

**Test line, as acted:** [laughs] i took every snack in the chog world to the purple moon. [smug] and i locked your little friends in cages. [menacing] sell. SELL. [laughs maniacally]

### Narrator  ⭐ design this one
*reads the story before the game ("How Plumpy got plump")* · 7 lines

**Save it in ElevenLabs with exactly this name:** `Narrator`

**Voice Design prompt:** A warm, playful storybook narrator with a friendly, clear mid-range voice. Speaks like reading a bedtime story to kids: gentle, a little mysterious, with a smile in the voice and small dramatic pauses. Clear studio audio.

**Preview text:** Chog World. Every night the Purple Moon rains crumbs, and the Chogs stack up to catch them. One night, a star fell instead.

**Test line, as acted:** [warmly] Chog World. Every night, the Purple Moon rains crumbs... and the Chogs stack up to catch them. [mysteriously] One night... a star fell instead.

### Common Chog
*caged Commons (levels 1-14)* · 84 lines

**Save it in ElevenLabs with exactly this name:** `Common Chog`

**Voice Design prompt:** A tiny, excitable cartoon critter with a bright, high, bubbly voice. Talks fast, giggles, very energetic and very grateful. Clear studio audio.

**Preview text:** get me out of here! this cage smells like pickles! oh my gosh, you did it, you actually knocked him off! i am free! where are the snacks?

**Test line, as acted:** [panicked] get me out of here! this cage smells like pickles! [gasps] oh my gosh, you did it, you actually knocked him off! [excited] i am free! where are the snacks?

### Uncommon Chog
*caged Uncommons (levels 15-26)* · 72 lines

**Save it in ElevenLabs with exactly this name:** `Uncommon Chog`

**Voice Design prompt:** A laid-back cartoon critter with a smooth, relaxed, slightly raspy young voice. Talks like a cool skater kid: unbothered, confident, a bit sarcastic. Clear studio audio.

**Preview text:** yeah, i knew you would come. took you long enough though. that cage was mid, no cap. alright, stack me up, i was born for this.

**Test line, as acted:** [unimpressed] yeah, i knew you would come. took you long enough though. that cage was mid, no cap. [confidently] alright, stack me up, i was born for this.

### Skull Chog
*caged Rare Skulls (levels 27-36)* · 60 lines

**Save it in ElevenLabs with exactly this name:** `Skull Chog`

**Voice Design prompt:** A small spooky skeleton creature with a dry, raspy, whispery voice and a hint of echo. Slow and dramatic, a little creepy but friendly. Clear studio audio.

**Preview text:** i have waited in the dark for so long. my bones... thank you. all of them. the dead rise, and they stack. rattle, rattle.

**Test line, as acted:** [spooky] i have waited in the dark for so long. my bones... thank you. all of them. [ominously] the dead rise, and they stack. rattle, rattle.

### Radioactive Chog
*caged Epic Radioactives (levels 37-44)* · 48 lines

**Save it in ElevenLabs with exactly this name:** `Radioactive Chog`

**Voice Design prompt:** A hyperactive radioactive cartoon creature with a fast, buzzy, slightly glitchy high voice. Jittery and excitable, talks in quick bursts. Clear studio audio.

**Preview text:** warning, warning, radioactive chog released! my atoms are vibrating! i stick to everything, including you now. ten out of ten, would glow again!

**Test line, as acted:** [hyper] warning, warning, radioactive chog released! my atoms are vibrating! i stick to everything, including you now. ten out of ten, would glow again!

### Chog Scream
*Legendary, level 45* · 6 lines

**Save it in ElevenLabs with exactly this name:** `Chog Scream`

**Voice Design prompt:** A panicked cartoon creature that screams a lot: high-pitched, shrill and frantic, like it is permanently terrified, but secretly sweet. Clear studio audio.

**Preview text:** AAAAAAAAAAH! sorry. sorry. that means hello. AAAAH! that means thank you. i only have one setting and it is screaming.

**Test line, as acted:** [screaming] AAAAAAAAAAH! [suddenly calm] sorry. sorry. that means hello. [screaming] AAAAH! [suddenly calm] that means thank you. i only have one setting and it is screaming.

### Grim
*Legendary, level 46* · 6 lines

**Save it in ElevenLabs with exactly this name:** `Grim`

**Voice Design prompt:** A calm grim-reaper cartoon creature with a very low, slow, hollow and ominous voice. Speaks softly and seriously, never in a hurry. Clear studio audio.

**Preview text:** i do not fear the cage. the cage fears me. death took a holiday today. so i will take the tower instead. lead the way.

**Test line, as acted:** [deep and slow] i do not fear the cage. the cage fears me. death took a holiday today. so i will take the tower instead. lead the way.

### Chogbomination
*Legendary, level 47* · 6 lines

**Save it in ElevenLabs with exactly this name:** `Chogbomination`

**Voice Design prompt:** A gross zombie cartoon creature with a wet, gurgling, croaky voice. Slow and sloppy, but oddly sweet and polite. Clear studio audio.

**Preview text:** i was a normal chog once. then i ate the forbidden snack. now i am... like this. but i am free. and i am yours. gurgle.

**Test line, as acted:** [gloomy] i was a normal chog once. then i ate the forbidden snack. now i am... like this. [warmly] but i am free. and i am yours. [gurgles]

### Blaze
*Legendary, level 48* · 6 lines

**Save it in ElevenLabs with exactly this name:** `Blaze`

**Voice Design prompt:** A hot-headed fiery cartoon creature with a loud, energetic, crackling young voice. Always hyped, shouts a lot, very competitive. Clear studio audio.

**Preview text:** this cage is getting HOT and i am the reason! i am out and i am ON FIRE! let us burn this tower all the way to the moon!

**Test line, as acted:** [fired up] this cage is getting HOT and i am the reason! i am out and i am ON FIRE! let us burn this tower all the way to the moon!

### Burning Skully
*Legendary, level 49* · 6 lines

**Save it in ElevenLabs with exactly this name:** `Burning Skully`

**Voice Design prompt:** A flaming skeleton cartoon creature with a crackly, raspy, mid-low voice and a slight echo. Cool, dramatic, a bit of a show-off. Clear studio audio.

**Preview text:** skeleton. on fire. in a cage. you knew what to do. flaming bones, at your service. the bear is going to feel the heat.

**Test line, as acted:** [fierce] skeleton. on fire. in a cage. you knew what to do. [proudly] flaming bones, at your service. the bear is going to feel the heat.

### Midas
*Legendary, level 50 (the final prize)* · 6 lines

**Save it in ElevenLabs with exactly this name:** `Midas`

**Voice Design prompt:** A rich, posh, golden cartoon creature with a smooth, refined, upper-class British voice. Slow, smug and elegant, like old money. Clear studio audio.

**Preview text:** everything i touch turns to gold. except that dreadful cage, apparently. free at last. darling, everything i stack turns to gold.

**Test line, as acted:** [haughty] everything i touch turns to gold. except that dreadful cage, apparently. [smugly] free at last. darling, everything i stack turns to gold.

### Villain: Gremlin
*NFT villains: DROOLCORE, LASER QUANT, PINEAPPLE PUFF, GLASS MOUCH, JESTERMAXXER, TWEAKIN' SNAKE, SUS JEET, NOVAH, RAGE ROCKET, VILLAIN ERA* · 60 lines

**Save it in ElevenLabs with exactly this name:** `Villain: Gremlin`

**Voice Design prompt:** A small chaotic cartoon gremlin villain with a high, raspy, giggly voice. Talks fast, cackles between words, mischievous and smug, internet-brained teenager energy. Clear studio audio.

**Preview text:** sorry, busy. i am aura farming. this chog was free aura, so i took it. hehehe. minus a thousand aura!

**Test line, as acted:** [giggles] sorry, busy. i am aura farming. this chog was free aura, so i took it. [cackles] minus a thousand aura!

### Villain: Menace
*NFT villains: CRASHOUT KAPYSH, COMRADE ROT, FANUM SHARK, CHOPPED CHAD, CHROME BONES, DETECTIVE 4K, TOOTHPICK ONI, THE CHOG OPP, IT'S SO OVER, THE FORGOTTEN* · 60 lines

**Save it in ElevenLabs with exactly this name:** `Villain: Menace`

**Voice Design prompt:** A huge menacing cartoon villain with a very deep, gravelly, rumbling voice. Slow, dramatic pauses, theatrical evil laugh, every word lands heavy. Clear studio audio.

**Preview text:** you broke six cages? cool. i am the seventh. and i am furious. i do not calm down. i level up.

**Test line, as acted:** [menacing] you broke six cages? cool. i am the seventh. and i am FURIOUS. [growls] i do not calm down. i level up.

### Villain: Bot
*NFT villains: SLIPPY ZORP, NPC-5391, DECKHAND DEATHBOT, BUILT-DIFF BETTY* · 24 lines

**Save it in ElevenLabs with exactly this name:** `Villain: Bot`

**Voice Design prompt:** A glitchy robot villain with a flat, metallic, clipped monotone voice. Speaks in short robotic phrases with odd pauses, deadpan and cold, a bit funny. Clear studio audio.

**Preview text:** countdown started. four seconds per chog. i have infinite seconds. you do not. tick tock. i do not stop.

**Test line, as acted:** [robotic] countdown started. four seconds per chog. i have infinite seconds. you do not. tick tock. i do not stop.

### Villain: Diva
*NFT villains: SHORTCAKE SUPREME, GHOSTED BETTY, DELULU MILADY, SLAY QUEEN BETTY* · 24 lines

**Save it in ElevenLabs with exactly this name:** `Villain: Diva`

**Voice Design prompt:** A sassy, dramatic diva villain with a bright, confident young female voice. Valley-girl drawl, eye-roll energy, sweet on the surface and savage underneath. Clear studio audio.

**Preview text:** welcome to my prom. it is vip only. commons? ew. wait outside, sweetie. not on the list? not in the tower.

**Test line, as acted:** [sassy] welcome to my prom. it is vip only. commons? ew. wait outside, sweetie. [laughs mockingly] not on the list? not in the tower.

### Villain: Bro
*NFT villains: KEYMASTER CHEW, BIG BACK EGGBERT, RODEO WADDLES, DUMP TRUCK DALE, SLIMEBEARD, DISCO KOI, UNC V1* · 42 lines

**Save it in ElevenLabs with exactly this name:** `Villain: Bro`

**Voice Design prompt:** A loud, overconfident cartoon bro villain with a husky young male voice and a light country drawl. Big personality, laughs at his own jokes, a bit dumb but very sure of himself. Clear studio audio.

**Preview text:** yeehaw, partner. this here chog is under arrest for bein too snackable. no keys. no chog. no cap.

**Test line, as acted:** [chuckles] yeehaw, partner. this here chog is under arrest for bein too snackable. [smug] no keys. no chog. no cap.

### Villain: Creep
*NFT villains: TRICK OR SHEET, HEXA SLICE, SLEEPMAXXER, MOODSWING, DIOR BONES, ENOLA, BOO SKRUMP* · 42 lines

**Save it in ElevenLabs with exactly this name:** `Villain: Creep`

**Voice Design prompt:** A creepy, whispery villain voice, airy and breathy with a soft echo. Slow and unsettling but playful, like a ghost telling a joke. Clear studio audio.

**Preview text:** boooo. three perfects in a row, or i haunt your combo forever. miss once, and you are ghosted.

**Test line, as acted:** [whispers] boooo. three perfects in a row, or i haunt your combo forever. [creepy laugh] miss once, and you are ghosted.

### Villain: Cutie
*NFT villains: FROSTY POOKIE, PEANUT GALE, FLUFFY BLADES* · 18 lines

**Save it in ElevenLabs with exactly this name:** `Villain: Cutie`

**Voice Design prompt:** A super cute, high-pitched, baby-like villain voice. Sweet and bubbly with little giggles, but secretly evil. Talks like a tiny mascot who just froze your friend. Clear studio audio.

**Preview text:** hiii! i froze your friend. it is giving snow globe. too cute to catch. too cold to care. hehe!

**Test line, as acted:** [giggles] hiii! i froze your friend. it is giving snow globe. [sweetly] too cute to catch. too cold to care. [giggles]

### Villain: Regal
*NFT villains: BITCOINAPARTE, SIGMA DAK, CAPTAIN NATA, KING DARIUS, GALAXY BRAIN* · 30 lines

**Save it in ElevenLabs with exactly this name:** `Villain: Regal`

**Voice Design prompt:** A pompous royal villain with a refined, theatrical, mid-low British voice. Grand, slow and self-important, like an emperor reading his own legend. Clear studio audio.

**Preview text:** i conquered the arctic with one coin and a hat. your chog is next. short king. long position. cold heart.

**Test line, as acted:** [proudly] i conquered the arctic with one coin and a hat. your chog is next. [grandly] short king. long position. cold heart.

## All lines


### World 1 intro

| ID | Voice | Line, as acted |
|---|---|---|
| `w1_0` | Plumpy | [sleepy] four a.m. [yawns] stomach growling. time for a snack.<br>🔊 stomach growl (just before "time") |
| `w1_1` | Plumpy | [confused] the plate is... empty?? [gasps] there is a note. |
| `w1_2` | The Bear | [laughs] i took every snack to the Purple Moon. [smug] and i locked fifty of your friends in cages. |
| `w1_3` | The Bear | [smug] oh, and i hired fifty villains from every chain to guard them. one per cage. [chuckles] good luck. |
| `w1_4` | Plumpy | [determined] no rocket. no plan. we stack ourselves up there, knock every villain off its perch... and free everyone. |

### World 2 intro

| ID | Voice | Line, as acted |
|---|---|---|
| `w2_0` | The Bear | [mischievously] i left the freezer door open. [chuckles] enjoy the ice rink. |
| `w2_1` | Plumpy | [shivering] my feet are cold. my belly is empty. [deadpan] i am not okay. |

### World 3 intro

| ID | Voice | Line, as acted |
|---|---|---|
| `w3_0` | The Bear | [blows air] hoo. HOOOOOOO.<br>🔊 wind blow (on "hoo") |
| `w3_1` | Plumpy | [disgusted] that is not wind. that is a bear... breathing on us. disgusting. |

### World 4 intro

| ID | Voice | Line, as acted |
|---|---|---|
| `w4_0` | Plumpy | [deadpan] clouds. i ate one. it tasted like nothing. |
| `w4_1` | The Bear | [mocking] up here everything floats. good luck landing anything, fatty. |
| `w4_2` | Plumpy | [offended] he called me fatty. [determined] i will land PERFECTLY. out of spite. |

### World 5 intro

| ID | Voice | Line, as acted |
|---|---|---|
| `w5_0` | The Bear | [proudly] meet my goons. Paper Hands. [laughs] they sell everything. |
| `w5_1` | Plumpy | [outraged] they are dumping on the tower. on PURPOSE. |
| `w5_2` | Plumpy | [panicked] hold. HOLD! |

### World 6 intro

| ID | Voice | Line, as acted |
|---|---|---|
| `w6_0` | The Bear | [shouting] Rugzilla! do the thing! |
| `w6_1` | Plumpy | [panicked] not the rug. ANYTHING but the rug! |

### World 7 intro

| ID | Voice | Line, as acted |
|---|---|---|
| `w7_0` | The Bear | [sarcastic] you actually made it. for SNACKS. respect.<br>🔊 slow clap (first) |
| `w7_1` | The Bear | [menacing] but the moon... is MINE.<br>🔊 knuckle crack (after) |
| `w7_2` | Plumpy | [ominously] pointy heads. your time is coming. |

### World 8 intro

| ID | Voice | Line, as acted |
|---|---|---|
| `w8_0` | The Bear | [greedy] last cage. the shiny one. [whispers] my boss guards it himself. |
| `w8_1` | The Bear | [roars] RAAAAAWR!<br>🔊 junk crash (after) |
| `w8_2` | Plumpy | [heroic] we stack to twenty. then a pointy Chog plants the flag. for snacks. for the cages. [shouting] for chog world! |

### Level 1

| ID | Voice | Line, as acted |
|---|---|---|
| `l1_jar` | Common Chog | [pleading] he drools on the bars and calls it 'aura'. please help.<br>🔊 drool drip (just before "and") |
| `v1_intro` | Villain: Gremlin | [giggles] sorry, busy. i'm aura farming. this chog was free aura, so i took it. [slurps] |
| `v1_hook` | Villain: Gremlin | [mischievously] Minus a thousand aura. Plus one Chog. |
| `v1_spit0` | Villain: Gremlin | [cackles] go, little drools. drip on everything.<br>🔊 drool drip (on "drip") |
| `v1_spit1` | Villain: Gremlin | [cackles] sadge? nah. SPIT. |
| `v1_down` | Villain: Gremlin | [whining] my aura... it went negative... [sobs] |
| `v1_gloat` | Villain: Gremlin | [cackles] you fell? minus a thousand aura. |
| `f1_0` | Common Chog | [excited] shades on, villain gone!<br>🔊 laser pew (after) |
| `f1_1` | Common Chog | [excited] thunder cap, lightning slap!<br>🔊 thunder (after) |
| `f1_2` | Common Chog | [excited] aura check: villain's a wreck! |
| `f1_3` | Common Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l1_free` | Common Chog | [relieved] finally. my legs work. mostly. |

### Level 2

| ID | Voice | Line, as acted |
|---|---|---|
| `l2_say` | The Bear | [laughs] three chogs tall? on that plate? [laughs harder] |
| `l2_jar` | Common Chog | [whiny] he's been jangling those keys for six hours. i'd rather be stacked.<br>🔊 keys jangle (just before "for") |
| `v2_intro` | Villain: Bro | [chuckles] yeehaw. this here chog's under arrest. the charge? bein' too snackable. |
| `v2_hook` | Villain: Bro | [smug] No keys. No Chog. No cap.<br>🔊 keys jangle (just before "No") |
| `v2_spit0` | Villain: Bro | [hollering] deputies! lock somethin' up! |
| `v2_spit1` | Villain: Bro | [hollering] go jingle, lil' ones! |
| `v2_down` | Villain: Bro | [groans] my keys! who took my...<br>🔊 tumble thud (after) |
| `v2_gloat` | Villain: Bro | [chuckles] case closed, partner. |
| `f2_0` | Common Chog | [excited] tears of rage, off the stage! |
| `f2_1` | Common Chog | [excited] honk honk, villain conked!<br>🔊 clown honk (after) |
| `f2_2` | Common Chog | [excited] aura check: villain's a wreck! |
| `f2_3` | Common Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l2_free` | Common Chog | [relieved] i was in there for days. or minutes. it felt like days. |

### Level 3

| ID | Voice | Line, as acted |
|---|---|---|
| `l3_say` | Plumpy | [smug] i only land perfect. it is a lifestyle. |
| `l3_jar` | Common Chog | [whiny] he lasered my cage and missed. twice. he says it's 'priced in'.<br>🔊 laser pew (just before "and") |
| `v3_intro` | Villain: Gremlin | [giggles] i backtested your tower. it fails one hundred percent of the time. trust the chart. |
| `v3_hook` | Villain: Gremlin | [mischievously] Laser eyes. Zero misses. Zero chill.<br>🔊 laser pew (just before "Zero") |
| `v3_spit0` | Villain: Gremlin | [cackles] deploying micro-lasers. pew pew.<br>🔊 laser pew (on "pew") |
| `v3_spit1` | Villain: Gremlin | [cackles] the chart says: spit. |
| `v3_down` | Villain: Gremlin | [whining] the backtest... lied to me... |
| `v3_gloat` | Villain: Gremlin | [cackles] called it. screenshot that. |
| `f3_0` | Common Chog | [excited] shades on, villain gone!<br>🔊 laser pew (after) |
| `f3_1` | Common Chog | [excited] hocus pocus, lose your focus! |
| `f3_2` | Common Chog | [excited] aura check: villain's a wreck! |
| `f3_3` | Common Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l3_free` | Common Chog | [relieved] thank you. i will stack until i drop. literally. |

### Level 4

| ID | Voice | Line, as acted |
|---|---|---|
| `l4_say` | The Bear | [smug] i swapped your plate for a saucer. [chuckles] good luck. |
| `l4_jar` | Common Chog | [panicked] she put a bow on my cage and called it 'plating'. i'm not dessert! |
| `v4_intro` | Villain: Diva | [sassy] welcome to Monafuku. tonight's special: one chog, served on a saucer. |
| `v4_hook` | Villain: Diva | [sassy] Cute café. Tiny plates. Zero refunds. |
| `v4_spit0` | Villain: Diva | [bossy] sprinkles, go! decorate everything. |
| `v4_spit1` | Villain: Diva | [bossy] service, please. |
| `v4_down` | Villain: Diva | [gasps] my whipped cream... is ruined... |
| `v4_gloat` | Villain: Diva | [laughs mockingly] dropped your order? no tip for you. |
| `f4_0` | Common Chog | [excited] cap on tight, villain, goodnight! |
| `f4_1` | Common Chog | [excited] quack attack, villain flat on its back! |
| `f4_2` | Common Chog | [excited] belly bump, villain slump! |
| `f4_3` | Common Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l4_free` | Common Chog | [relieved] freedom tastes like grape jelly. |

### Level 5

| ID | Voice | Line, as acted |
|---|---|---|
| `l5_say` | Plumpy | [deadpan] pointy heads cannot hold anyone up. but they make great flagpoles. |
| `l5_jar` | Common Chog | [snoring] ... [sleepily] is it... snack time...? [snoring] |
| `v5_intro` | Villain: Gremlin | [exhales] you need a pointy head to plant a flag. i have the pointiest hat. checkmate.<br>🔊 smoke puff (first) |
| `v5_hook` | Villain: Gremlin | [mischievously] No hat, no flag. No flag, no Chog. |
| `v5_spit0` | Villain: Gremlin | [cackles] puff puff, little clouds.<br>🔊 smoke puff (on "puff") |
| `v5_spit1` | Villain: Gremlin | [exhales] puff puff... go, babies.<br>🔊 smoke puff (on "puff") |
| `v5_down` | Villain: Gremlin | [whining] my teddy! somebody save my teddy! |
| `v5_gloat` | Villain: Gremlin | [cackles] skill issue. [exhales]<br>🔊 smoke puff (after) |
| `f5_0` | Common Chog | [excited] love tap, villain takes a nap! |
| `f5_1` | Common Chog | [excited] aura check: villain's a wreck! |
| `f5_2` | Common Chog | [excited] you're fired! |
| `f5_3` | Common Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l5_free` | Common Chog | [excited] free chog! free chog! [calming down] okay i'm calm. i'm calm. |

### Level 6

| ID | Voice | Line, as acted |
|---|---|---|
| `l6_say` | Plumpy | [whining] i have been starving for five levels. [shouting] FEED ME. |
| `l6_jar` | Common Chog | [whiny] he ate my snacks. then my lunch. now he's looking at ME. |
| `v6_intro` | Villain: Bro | [chuckles] uncle Bear said guard the chog. he never said i couldn't lick it. |
| `v6_hook` | Villain: Bro | [smug] I eat first. You eat never. |
| `v6_spit0` | Villain: Bro | [hollering] yolks, go steal their crumbs! |
| `v6_spit1` | Villain: Bro | [burps] reinforcements. |
| `v6_down` | Villain: Bro | [groans] nooo! my egg! it's... scrambled... |
| `v6_gloat` | Villain: Bro | [chuckles] more snacks for the big back. |
| `f6_0` | Common Chog | [excited] catch a star, fall too far! |
| `f6_1` | Common Chog | [excited] freeze! say please! |
| `f6_2` | Common Chog | [excited] red light... KO light! |
| `f6_3` | Common Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l6_free` | Common Chog | [excited] fresh air! it smells like rugs out here. i love it. |

### Level 7

| ID | Voice | Line, as acted |
|---|---|---|
| `l7_say` | The Bear | [annoyed] fine. you got past the kitchen. [growls] the fridge is MINE. |
| `l7_jar` | Common Chog | [whiny] he breathes fire when he's mad. he's ALWAYS mad.<br>🔊 fire breath (just before "he's") |
| `v7_intro` | Villain: Menace | [menacing] you broke six cages? COOL. i'm the seventh. and i'm FURIOUS. |
| `v7_hook` | Villain: Menace | [growls] I don't calm down. I level up. |
| `v7_spit0` | Villain: Menace | [shouting] hatchlings! BURN IT!<br>🔊 fire breath (on "BURN") |
| `v7_spit1` | Villain: Menace | [roars] RAAAH! spit fire!<br>🔊 fire breath (on "fire") |
| `v7_down` | Villain: Menace | [roars in pain] this... is a... CRASH OUT! |
| `v7_gloat` | Villain: Menace | [laughs darkly] told you. dragons don't lose. |
| `f7_0` | Common Chog | [excited] peace out, villain, lights out! |
| `f7_1` | Common Chog | [excited] feel the heat, admit defeat!<br>🔊 fire breath (after) |
| `f7_2` | Common Chog | [excited] gold tooth bite, lights out tonight!<br>🔊 big chomp (after) |
| `f7_3` | Common Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l7_free` | Common Chog | [excited] you did it! you knocked that villain flat! hero behaviour. |

### Level 8

| ID | Voice | Line, as acted |
|---|---|---|
| `l8_jar` | Common Chog | [whiny] it's so cold my tears are ice cubes. cute ones, but still. |
| `v8_intro` | Villain: Cutie | [giggles] hiii! i froze your friend. it's giving... snow globe.<br>🔊 straw slurp (first) |
| `v8_hook` | Villain: Cutie | [sweetly] Too cute to catch. Too cold to care. |
| `v8_spit0` | Villain: Cutie | [cheerfully] snowflakes! make it slippy! |
| `v8_spit1` | Villain: Cutie | [cheerfully] go, babies!<br>🔊 straw slurp (first) |
| `v8_down` | Villain: Cutie | [whimpers] my juice box... it froze... |
| `v8_gloat` | Villain: Cutie | [giggles] slipped? aww. cute. |
| `f8_0` | Common Chog | [excited] shades on, villain gone!<br>🔊 laser pew (after) |
| `f8_1` | Common Chog | [excited] horns down, out of town! |
| `f8_2` | Common Chog | [excited] belly bump, villain slump! |
| `f8_3` | Common Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l8_free` | Common Chog | [relieved] squad. i have a squad now. |

### Level 9

| ID | Voice | Line, as acted |
|---|---|---|
| `l9_say` | Plumpy | [urgently] the hot one. use the hot one first. melt the plate. |
| `l9_jar` | Common Chog | [whiny] okay the ice rodeo slaps. but i want OUT. |
| `v9_intro` | Villain: Bro | [chuckles] howdy. welcome to the ice rodeo. stay on eight seconds. nobody does. |
| `v9_hook` | Villain: Bro | [smug] Eight seconds on ice. Nobody lasts. |
| `v9_spit0` | Villain: Bro | [hollering] giddy-up, little wranglers! |
| `v9_spit1` | Villain: Bro | [hollering] yeehaw, babies! |
| `v9_down` | Villain: Bro | [groans] bucked off... by a chog... |
| `v9_gloat` | Villain: Bro | [chuckles] two seconds. a record... for losing. |
| `f9_0` | Common Chog | [excited] laser eyes, villain fries!<br>🔊 laser pew (after) |
| `f9_1` | Common Chog | [excited] winter's here, villain, fear! |
| `f9_2` | Common Chog | [excited] red light... KO light! |
| `f9_3` | Common Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l9_free` | Common Chog | [relieved] out of the cage and into the tower. let's go. |

### Level 10

| ID | Voice | Line, as acted |
|---|---|---|
| `l10_say` | The Bear | [mocking] perfect landings? on ice? [chuckles] i will wait. |
| `l10_jar` | Common Chog | [pleading] he says he's not short, he's 'early'. please get me out. |
| `v10_intro` | Villain: Regal | [proudly] i conquered the arctic with one coin and a hat. your chog is next. |
| `v10_hook` | Villain: Regal | [grandly] Short king. Long position. Cold heart. |
| `v10_spit0` | Villain: Regal | [commanding] soldiers! march on the page! |
| `v10_spit1` | Villain: Regal | [commanding] for the empire! spit! |
| `v10_down` | Villain: Regal | [gasps] this... is my Waterloo... |
| `v10_gloat` | Villain: Regal | [laughs smugly] liquidated. like all my enemies. |
| `f10_0` | Common Chog | [excited] laser eyes, villain fries!<br>🔊 laser pew (after) |
| `f10_1` | Common Chog | [excited] ninja chop, villain drop! |
| `f10_2` | Common Chog | [excited] aura check: villain's a wreck! |
| `f10_3` | Common Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l10_free` | Common Chog | [relieved] i'm out. put me on the tower. i'm ready. |

### Level 11

| ID | Voice | Line, as acted |
|---|---|---|
| `l11_jar` | Common Chog | [whiny] he mopped my cage four times. cleanest prison in the galaxy.<br>🔊 mop squeak (just before "cleanest") |
| `v11_intro` | Villain: Bot | [robotic] beep. i am the janitor. i wax the fridge. i wax the plate. i wax your hopes.<br>🔊 robot beep (on "beep") |
| `v11_hook` | Villain: Bot | [robotic] Caution: wet floor. Caution: me. |
| `v11_spit0` | Villain: Bot | [robotic] spray bottles, deploy! |
| `v11_spit1` | Villain: Bot | [robotic] squeegee squad, go! |
| `v11_down` | Villain: Bot | [glitching] slipped... on my own... floor... |
| `v11_gloat` | Villain: Bot | [robotic laugh] clean-up on aisle you. |
| `f11_0` | Common Chog | [excited] shades on, villain gone!<br>🔊 laser pew (after) |
| `f11_1` | Common Chog | [excited] wave check! villain wrecked! |
| `f11_2` | Common Chog | [excited] aura check: villain's a wreck! |
| `f11_3` | Common Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l11_free` | Common Chog | [relieved] no more pickle smell. thank you, truly. |

### Level 12

| ID | Voice | Line, as acted |
|---|---|---|
| `l12_say` | The Bear | [smug] i put everyone on a diet. no fat chogs today. |
| `l12_jar` | Common Chog | [whiny] he put me on rations. one crumb. per WEEK. |
| `v12_intro` | Villain: Menace | [menacing] comrade. in this freezer everyone is skinny. equally. forever. |
| `v12_hook` | Villain: Menace | [growls] Your snacks? Our snacks. Your Chog? Our Chog. |
| `v12_spit0` | Villain: Menace | [shouting] comrades! seize the page! |
| `v12_spit1` | Villain: Menace | [shouting] workers of the page, unite! |
| `v12_down` | Villain: Menace | [weakly] the revolution... is cancelled... |
| `v12_gloat` | Villain: Menace | [laughs darkly] the tower belongs to the people. the people are me. |
| `f12_0` | Common Chog | [excited] laser eyes, villain fries!<br>🔊 laser pew (after) |
| `f12_1` | Common Chog | [excited] chog power, villain's final hour! |
| `f12_2` | Common Chog | [excited] aura check: villain's a wreck! |
| `f12_3` | Common Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l12_free` | Common Chog | [relieved] i owe you a snack. a big one. |

### Level 13

| ID | Voice | Line, as acted |
|---|---|---|
| `l13_say` | The Bear | [smug] only round heads allowed on my ice. [giggles] |
| `l13_jar` | Common Chog | [nervous] it's just a penguin in a pillowcase. it's just a penguin in a pill- [screams] AAAA! |
| `v13_intro` | Villain: Creep | [whispers] boooo. i'm a ghost. don't look under the sheet. [creepy giggle] round heads only tonight. |
| `v13_hook` | Villain: Creep | [whispers] Trick or treat? I'm the trick. You're the treat. |
| `v13_spit0` | Villain: Creep | [whispers] boo-lets, haunt the page! |
| `v13_spit1` | Villain: Creep | [whispers] trick! trick! trick! |
| `v13_down` | Villain: Creep | [wails] my sheet! you saw my flippers! |
| `v13_gloat` | Villain: Creep | [creepy laugh] tricked ya. happy Chogtober. |
| `f13_0` | Common Chog | [excited] bow to the crown, villain goes down! |
| `f13_1` | Common Chog | [excited] bubblegum pop, villain flop!<br>🔊 bubble pop (after) |
| `f13_2` | Common Chog | [excited] belly bump, villain slump! |
| `f13_3` | Common Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l13_free` | Common Chog | [relieved] the bear is going to be SO mad. good. |

### Level 14

| ID | Voice | Line, as acted |
|---|---|---|
| `l14_say` | The Bear | [chewing] i am eating your plate. one bite per drop.<br>🔊 big chomp (first) |
| `l14_jar` | Common Chog | [panicked] he takes 'tax bites' out of the plate. i think i'm next. i'm the tax!<br>🔊 big chomp (just before "out") |
| `v14_intro` | Villain: Menace | [menacing] this plate is mine now. that's the fanum tax, little chog.<br>🔊 big chomp (first) |
| `v14_hook` | Villain: Menace | [growls] Fanum tax. One bite. Every drop.<br>🔊 big chomp (just before "Every") |
| `v14_spit0` | Villain: Menace | [shouting] sharklets, tax their crumbs! |
| `v14_spit1` | Villain: Menace | [shouting] go, babies.<br>🔊 big chomp (first) |
| `v14_down` | Villain: Menace | [yelling in pain] brain... FREEZE! |
| `v14_gloat` | Villain: Menace | [laughs darkly] taxed. and collected. |
| `f14_0` | Common Chog | [excited] make it rain, feel the pain!<br>🔊 coins rain (after) |
| `f14_1` | Common Chog | [excited] aura check: villain's a wreck! |
| `f14_2` | Common Chog | [excited] gold tooth bite, lights out tonight!<br>🔊 big chomp (after) |
| `f14_3` | Common Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l14_free` | Common Chog | [excited] i'm free! i'm FREE! [calming down] okay. where are the snacks. |

### Level 15

| ID | Voice | Line, as acted |
|---|---|---|
| `l15_jar` | Uncommon Chog | [unimpressed] every flap shatters something. lowkey iconic. still, let me out.<br>🔊 glass shatter (just before "lowkey") |
| `v15_intro` | Villain: Gremlin | [giggles] bzzz. i'm made of glass. one flap and the draft takes your tower. bzz. |
| `v15_hook` | Villain: Gremlin | [mischievously] Fragile? Yes. Breakable? Never. |
| `v15_spit0` | Villain: Gremlin | [cackles] shardlings, sparkle! |
| `v15_spit1` | Villain: Gremlin | [cackles] bzz bzz, babies. |
| `v15_down` | Villain: Gremlin | [whining] oh no. i'm... shattered.<br>🔊 glass shatter (just before "shattered") |
| `v15_gloat` | Villain: Gremlin | [cackles] bzz. that's what glass houses do. |
| `f15_0` | Uncommon Chog | [confidently] number go up, villain go down! |
| `f15_1` | Uncommon Chog | [confidently] gust of air, villain? where?<br>🔊 wind blow (after) |
| `f15_2` | Uncommon Chog | [confidently] heads i win, tails you lose! |
| `f15_3` | Uncommon Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l15_free` | Uncommon Chog | [chill] that cage was mid. this squad is not. |

### Level 16

| ID | Voice | Line, as acted |
|---|---|---|
| `l16_say` | Plumpy | [urgently] the windproof one. bring the windproof one. |
| `l16_jar` | Uncommon Chog | [unimpressed] my fur's doing a wind tunnel ad. not mad at it. kinda mad at it. |
| `v16_intro` | Villain: Cutie | [giggles] ronin beast, reporting! three feathers, two horns, zero chill. WHOOSH.<br>🔊 whoosh (on "WHOOSH") |
| `v16_hook` | Villain: Cutie | [sweetly] Small beast. Big breath. Bye tower. |
| `v16_spit0` | Villain: Cutie | [cheerfully] gustlings, blow it away!<br>🔊 wind blow (after) |
| `v16_spit1` | Villain: Cutie | [cheerfully] whoosh! babies!<br>🔊 whoosh (on "whoosh") |
| `v16_down` | Villain: Cutie | [whimpers] out of... breath... |
| `v16_gloat` | Villain: Cutie | [giggles] blown away. like your hopes.<br>🔊 whoosh (just before "like") |
| `f16_0` | Uncommon Chog | [confidently] clown eyes, big surprise! |
| `f16_1` | Uncommon Chog | [confidently] number go up, villain go down! |
| `f16_2` | Uncommon Chog | [confidently] coin spit, villain quit!<br>🔊 coins rain (after) |
| `f16_3` | Uncommon Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l16_free` | Uncommon Chog | [chill] the bear thought he could hold me. he could not. |

### Level 17

| ID | Voice | Line, as acted |
|---|---|---|
| `l17_say` | The Bear | [taunting] tick tock. tick tock.<br>🔊 clock tick (underneath) |
| `l17_jar` | Uncommon Chog | [unimpressed] he counts down from four. out loud. all day. i'm cooked. |
| `v17_intro` | Villain: Bot | [robotic] COUNTDOWN STARTED. four seconds per chog. i have infinite seconds. you do not. |
| `v17_hook` | Villain: Bot | [robotic] Tick tock. I don't stop. You flop.<br>🔊 clock tick (underneath) |
| `v17_spit0` | Villain: Bot | [robotic] DEPLOYING UNITS. tick. tock. |
| `v17_spit1` | Villain: Bot | [robotic] UNIT SPAWN. HA. HA. |
| `v17_down` | Villain: Bot | [glitching] SYSTEM... FAILURE... bzzt.<br>🔊 robot powerdown (on "FAILURE") |
| `v17_gloat` | Villain: Bot | [robotic laugh] time's up. human error detected. |
| `f17_0` | Uncommon Chog | [confidently] ten thousand hits per second! |
| `f17_1` | Uncommon Chog | [confidently] honk honk, villain conked!<br>🔊 clown honk (after) |
| `f17_2` | Uncommon Chog | [confidently] cigar smoke, villain's broke!<br>🔊 smoke puff (after) |
| `f17_3` | Uncommon Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l17_free` | Uncommon Chog | [trying to stay cool] free. cool. very cool. i'm cool. |

### Level 18

| ID | Voice | Line, as acted |
|---|---|---|
| `l18_jar` | Uncommon Chog | [unimpressed] he keeps calling me his pawn. i'm at LEAST a knight, bro. |
| `v18_intro` | Villain: Regal | [proudly] you play checkers. i play chess. in a hurricane. with wings. |
| `v18_hook` | Villain: Regal | [grandly] Three moves ahead. Checkmate, Chog. |
| `v18_spit0` | Villain: Regal | [commanding] pawns, advance! |
| `v18_spit1` | Villain: Regal | [commanding] sacrifice the babies. it's strategy. |
| `v18_down` | Villain: Regal | [gasps] ...not stalemate... checkmate... |
| `v18_gloat` | Villain: Regal | [laughs smugly] gg. no re. |
| `f18_0` | Uncommon Chog | [confidently] cap on tight, villain, goodnight! |
| `f18_1` | Uncommon Chog | [confidently] gust of air, villain? where?<br>🔊 wind blow (after) |
| `f18_2` | Uncommon Chog | [confidently] belly bump, villain slump! |
| `f18_3` | Uncommon Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l18_free` | Uncommon Chog | [chill] i'm free and i'm hungry. classic. |

### Level 19

| ID | Voice | Line, as acted |
|---|---|---|
| `l19_say` | The Bear | [innocently] i sawed off one leg of the table. oops. |
| `l19_jar` | Uncommon Chog | [unimpressed] he sawed the table leg and called it 'rustic'. that's not rustic, that's sabotage. |
| `v19_intro` | Villain: Menace | [menacing] oops. one leg shorter. now everything slides downhill. like your bags.<br>🔊 hand saw (first) |
| `v19_hook` | Villain: Menace | [growls] Timber! Your table's chopped. So are you. |
| `v19_spit0` | Villain: Menace | [shouting] splinters, go! |
| `v19_spit1` | Villain: Menace | [shouting] TIMBER, babies! |
| `v19_down` | Villain: Menace | [yelling] TIMBERRR... [realizing] wait, that's me... |
| `v19_gloat` | Villain: Menace | [laughs darkly] chopped. told ya. |
| `f19_0` | Uncommon Chog | [confidently] number go up, villain go down! |
| `f19_1` | Uncommon Chog | [confidently] glitch in the code, villain explode!<br>🔊 glitch zap (after) |
| `f19_2` | Uncommon Chog | [confidently] belly bump, villain slump! |
| `f19_3` | Uncommon Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l19_free` | Uncommon Chog | [chill] free at last. wagmi. |

### Level 20

| ID | Voice | Line, as acted |
|---|---|---|
| `l20_say` | The Bear | [mischievously] i choose your chogs now. [giggles] |
| `l20_jar` | Uncommon Chog | [unimpressed] he juggles me when he's bored. i'm not a prop. i'm a whole chog. |
| `v20_intro` | Villain: Gremlin | [giggles] uncle Bear lets me pick your chogs today. eeny, meeny... chaos. |
| `v20_hook` | Villain: Gremlin | [mischievously] Pick a Chog, any Chog... not that one. |
| `v20_spit0` | Villain: Gremlin | [cackles] clowns, go flip stuff! |
| `v20_spit1` | Villain: Gremlin | [cackles] honk honk, babies!<br>🔊 clown honk (on "honk") |
| `v20_down` | Villain: Gremlin | [whining] the joke... was on... me? |
| `v20_gloat` | Villain: Gremlin | [cackles] HONK. you're the punchline.<br>🔊 clown honk (on "HONK") |
| `f20_0` | Uncommon Chog | [confidently] angry eyes, villain cries! |
| `f20_1` | Uncommon Chog | [confidently] chog power, villain's final hour! |
| `f20_2` | Uncommon Chog | [confidently] smoke screen, villain unseen!<br>🔊 smoke puff (after) |
| `f20_3` | Uncommon Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l20_free` | Uncommon Chog | [chill] appreciate you. now let's go get the bear. |

### Level 21

| ID | Voice | Line, as acted |
|---|---|---|
| `l21_say` | The Bear | [blows air] HOOOOOOOOOO.<br>🔊 wind blow (on "HOOOOOOOOOO") |
| `l21_jar` | Uncommon Chog | [unimpressed] she cackles every time it thunders. which is every second.<br>🔊 thunder (just before "which") |
| `v21_intro` | Villain: Creep | [cackles] mwahaha! a skinless witch with a pizza and a storm. what could go right? |
| `v21_hook` | Villain: Creep | [whispers] Hold the anchovies. Unleash the storm. |
| `v21_spit0` | Villain: Creep | [whispers] slices, fly! |
| `v21_spit1` | Villain: Creep | [whispers] hex hex, little crusts! |
| `v21_down` | Villain: Creep | [wails] i'm melting... no wait, that's the cheese... |
| `v21_gloat` | Villain: Creep | [creepy laugh] delivered: one fallen tower. no tip needed. |
| `f21_0` | Uncommon Chog | [confidently] chog power, villain's final hour! |
| `f21_1` | Uncommon Chog | [confidently] smoke screen, villain unseen!<br>🔊 smoke puff (after) |
| `f21_2` | Uncommon Chog | [confidently] drool flood, villain's mud!<br>🔊 drool drip (after) |
| `f21_3` | Uncommon Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l21_free` | Uncommon Chog | [chill] gee em. it's a good morning now. |

### Level 22

| ID | Voice | Line, as acted |
|---|---|---|
| `l22_jar` | Uncommon Chog | [unimpressed] the clouds are cotton candy. i licked one. no regrets. |
| `v22_intro` | Villain: Cutie | [giggles] floaty floaty! in my garden gravity is a suggestion and chogs are snacks. |
| `v22_hook` | Villain: Cutie | [sweetly] Soft tail. Sharp horns. Sweet revenge. |
| `v22_spit0` | Villain: Cutie | [cheerfully] sproutlings, bloop bloop! |
| `v22_spit1` | Villain: Cutie | [cheerfully] float, babies! |
| `v22_down` | Villain: Cutie | [whimpers] my cotton candy... dissolving... |
| `v22_gloat` | Villain: Cutie | [giggles] sweet. sweet defeat. yours. |
| `f22_0` | Uncommon Chog | [confidently] pipe down! stomp town! |
| `f22_1` | Uncommon Chog | [confidently] drool flood, villain's mud!<br>🔊 drool drip (after) |
| `f22_2` | Uncommon Chog | [confidently] belly bump, villain slump! |
| `f22_3` | Uncommon Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l22_free` | Uncommon Chog | [chill] let's run it. me, you, the tower. |

### Level 23

| ID | Voice | Line, as acted |
|---|---|---|
| `l23_jar` | Uncommon Chog | [unimpressed] she fell asleep holding my cage. i'm scared to wake her up. |
| `v23_intro` | Villain: Creep | [yawns] shh. i'm sleepmaxxing. plumpy is fast because i dream fast. |
| `v23_hook` | Villain: Creep | [whispers] Eyes closed. Still faster than you. |
| `v23_spit0` | Villain: Creep | [sleepily] dozelings... go... [snoring] |
| `v23_spit1` | Villain: Creep | [snoring] spit... [snoring] |
| `v23_down` | Villain: Creep | [sleepily] five more minutes...<br>🔊 tumble thud (after) |
| `v23_gloat` | Villain: Creep | [mumbles] ...told you... in my dream... |
| `f23_0` | Uncommon Chog | [confidently] we're all gonna make it. you're not. |
| `f23_1` | Uncommon Chog | [confidently] smoke screen, villain unseen!<br>🔊 smoke puff (after) |
| `f23_2` | Uncommon Chog | [confidently] bubblegum pop, villain flop!<br>🔊 bubble pop (after) |
| `f23_3` | Uncommon Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l23_free` | Uncommon Chog | [chill] stack me up. i was born for this. |

### Level 24

| ID | Voice | Line, as acted |
|---|---|---|
| `l24_say` | Plumpy | [whispers] i cannot see. i can only feel. [deadpan] and i feel hungry. |
| `l24_jar` | Uncommon Chog | [unimpressed] she keeps texting me 'u up?' i'm in a cage. obviously i'm up. |
| `v24_intro` | Villain: Diva | [sassy] heyyy. i ghosted my last crush. now i'm ghosting your tower. can't see me? |
| `v24_hook` | Villain: Diva | [sassy] Left on read. Lost in the fog. |
| `v24_spit0` | Villain: Diva | [bossy] lil boos, slide into their DMs. |
| `v24_spit1` | Villain: Diva | [bossy] seen. spit. |
| `v24_down` | Villain: Diva | [gasps] you... saw me? nobody sees me... |
| `v24_gloat` | Villain: Diva | [laughs mockingly] ghosted. don't text back. |
| `f24_0` | Uncommon Chog | [confidently] chog power, villain's final hour! |
| `f24_1` | Uncommon Chog | [confidently] feel the heat, admit defeat!<br>🔊 fire breath (after) |
| `f24_2` | Uncommon Chog | [confidently] bubblegum pop, villain flop!<br>🔊 bubble pop (after) |
| `f24_3` | Uncommon Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l24_free` | Uncommon Chog | [chill] yeah. i knew you'd come. took you long enough. |

### Level 25

| ID | Voice | Line, as acted |
|---|---|---|
| `l25_say` | The Bear | [smug] my waiter will carry your tower. [chuckles] he is clumsy. |
| `l25_jar` | Uncommon Chog | [unimpressed] he rocks the boat on purpose. i've been seasick for three days. |
| `v25_intro` | Villain: Bot | [robotic] ahoy. i serve the drinks. i steer the ship. badly. the plate rocks. so do you. |
| `v25_hook` | Villain: Bot | [robotic] Rock the boat. Drop the Chog. |
| `v25_spit0` | Villain: Bot | [robotic] bilge bots, overboard! |
| `v25_spit1` | Villain: Bot | [robotic] bloop. bots away. |
| `v25_down` | Villain: Bot | [glitching] man... overboard... it's me... |
| `v25_gloat` | Villain: Bot | [robotic laugh] you sank. i'm still bored. |
| `f25_0` | Uncommon Chog | [confidently] clown eyes, big surprise! |
| `f25_1` | Uncommon Chog | [confidently] chog power, villain's final hour! |
| `f25_2` | Uncommon Chog | [confidently] bubblegum pop, villain flop!<br>🔊 bubble pop (after) |
| `f25_3` | Uncommon Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l25_free` | Uncommon Chog | [chill] out of the cage. into the alpha. |

### Level 26

| ID | Voice | Line, as acted |
|---|---|---|
| `l26_jar` | Uncommon Chog | [unimpressed] she rated my outfit a C. i'm literally in a cage. what did she expect. |
| `v26_intro` | Villain: Diva | [sniffs] your drip is a C-minus. combos are the only drip that counts. |
| `v26_hook` | Villain: Diva | [sassy] Cry pretty. Combo or cope. |
| `v26_spit0` | Villain: Diva | [bossy] lil miladies, go cry on things. |
| `v26_spit1` | Villain: Diva | [sobs] go, babies. |
| `v26_down` | Villain: Diva | [gasps] my mascara... it's so over... |
| `v26_gloat` | Villain: Diva | [laughs mockingly] mid combo. mid tower. mid you. |
| `f26_0` | Uncommon Chog | [confidently] clown eyes, big surprise! |
| `f26_1` | Uncommon Chog | [confidently] chog power, villain's final hour! |
| `f26_2` | Uncommon Chog | [confidently] feel the heat, admit defeat!<br>🔊 fire breath (after) |
| `f26_3` | Uncommon Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l26_free` | Uncommon Chog | [chill] no cap, you're a legend. |

### Level 27

| ID | Voice | Line, as acted |
|---|---|---|
| `l27_say` | The Bear | [mischievously] i gave plumpy an energy drink. |
| `l27_jar` | Skull Chog | [spooky] he chugged nine energy drinks. my bones are rattling from the vibrations.<br>🔊 bone rattle (just before "from") |
| `v27_intro` | Villain: Gremlin | [twitchy] WHAT. oh. you. i spiked plumpy's coffee. it's tweaking. so am i. |
| `v27_hook` | Villain: Gremlin | [mischievously] Shook, not stirred. Wired, not tired. |
| `v27_spit0` | Villain: Gremlin | [cackles] snakelets, GO GO GO! |
| `v27_spit1` | Villain: Gremlin | [hisses] hehehe! |
| `v27_down` | Villain: Gremlin | [whining] crashing... from my sugar high... |
| `v27_gloat` | Villain: Gremlin | [cackles] fock it. you lost. |
| `f27_0` | Skull Chog | [growls] laser eyes, villain fries!<br>🔊 laser pew (after) |
| `f27_1` | Skull Chog | [growls] cap on tight, villain, goodnight! |
| `f27_2` | Skull Chog | [growls] roses are red, villain's in bed! |
| `f27_3` | Skull Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l27_free` | Skull Chog | [spooky] the cage could not hold my bones.<br>🔊 bone rattle (after) |

### Level 28

| ID | Voice | Line, as acted |
|---|---|---|
| `l28_jar` | Skull Chog | [spooky] he smells like custard. i have no stomach. and yet... i'm hungry. |
| `v28_intro` | Villain: Regal | [proudly] behold! a pastry with a cape and burning eyes. welcome to my buffet of fog. |
| `v28_hook` | Villain: Regal | [grandly] Crispy outside. Evil inside. Bussin'. |
| `v28_spit0` | Villain: Regal | [commanding] tartlets, assemble! |
| `v28_spit1` | Villain: Regal | [commanding] custard rain! go! |
| `v28_down` | Villain: Regal | [gasps] my crust... crumbled... |
| `v28_gloat` | Villain: Regal | [laughs smugly] dessert is served. you're the leftovers. |
| `f28_0` | Skull Chog | [growls] hocus pocus, lose your focus! |
| `f28_1` | Skull Chog | [growls] freeze! say please! |
| `f28_2` | Skull Chog | [growls] bone zone! villain's thrown!<br>🔊 bone rattle (after) |
| `f28_3` | Skull Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l28_free` | Skull Chog | [spooky] the dead rise. and they stack.<br>🔊 bone rattle (just before "and") |

### Level 29

| ID | Voice | Line, as acted |
|---|---|---|
| `l29_jar` | Skull Chog | [spooky] he sold my bones twice. bought them back higher. rattle... rattle...<br>🔊 bone rattle (on "rattle") · 🔊 bone rattle (on "rattle") |
| `v29_intro` | Villain: Gremlin | [suspicious] i sell every third block. don't ask why. it's... strategy. |
| `v29_hook` | Villain: Gremlin | [mischievously] Paper hands. Sus eyes. I sell, you cry. |
| `v29_spit0` | Villain: Gremlin | [cackles] jeets, dump it! |
| `v29_spit1` | Villain: Gremlin | [cackles] sell sell sell, babies! |
| `v29_down` | Villain: Gremlin | [whining] sold the bottom... again... |
| `v29_gloat` | Villain: Gremlin | [cackles] sold. bought back higher. still won. |
| `f29_0` | Skull Chog | [growls] horns down, out of town! |
| `f29_1` | Skull Chog | [growls] roses are red, villain's in bed! |
| `f29_2` | Skull Chog | [growls] bone zone! villain's thrown!<br>🔊 bone rattle (after) |
| `f29_3` | Skull Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l29_free` | Skull Chog | [spooky] the cage could not hold my bones.<br>🔊 bone rattle (after) |

### Level 30

| ID | Voice | Line, as acted |
|---|---|---|
| `l30_jar` | Skull Chog | [spooky] he dumps a truckload every two drops. my skull is full of gravel. |
| `v30_intro` | Villain: Bro | [chuckles] clocked in. i dump every two drops. nothin' personal. it's my shift. |
| `v30_hook` | Villain: Bro | [smug] Beep beep. That's the sound of your bags.<br>🔊 truck reverse (just before "That's") |
| `v30_spit0` | Villain: Bro | [hollering] crew, unload! |
| `v30_spit1` | Villain: Bro | [hollering] comin' through!<br>🔊 truck reverse (first) |
| `v30_down` | Villain: Bro | [groans] workplace... accident... |
| `v30_gloat` | Villain: Bro | [chuckles] shift's over. tower's dumped. |
| `f30_0` | Skull Chog | [growls] gas fee? paid by thee! |
| `f30_1` | Skull Chog | [growls] bow to the crown, villain goes down! |
| `f30_2` | Skull Chog | [growls] you're fired! |
| `f30_3` | Skull Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l30_free` | Skull Chog | [spooky] the dead rise. and they stack.<br>🔊 bone rattle (just before "and") |

### Level 31

| ID | Voice | Line, as acted |
|---|---|---|
| `l31_say` | The Bear | [growls] i cranked the diner gravity. sit DOWN. |
| `l31_jar` | Skull Chog | [spooky] a fellow skeleton. playing air guitar. on my cage. i respect it.<br>🔊 guitar riff (just before "on") |
| `v31_intro` | Villain: Menace | [menacing] gravity's cranked to eleven. sit DOWN. this is heavy metal.<br>🔊 guitar riff (first) |
| `v31_hook` | Villain: Menace | [growls] Heavy bones. Heavy metal. Heavy L. |
| `v31_spit0` | Villain: Menace | [shouting] headbangers, mosh! |
| `v31_spit1` | Villain: Menace | [shouting] go, babies!<br>🔊 guitar riff (first) |
| `v31_down` | Villain: Menace | [groans in pain] encore... cancelled... |
| `v31_gloat` | Villain: Menace | [laughs darkly] that's what heavy sounds like. |
| `f31_0` | Skull Chog | [growls] bow to the crown, villain goes down! |
| `f31_1` | Skull Chog | [growls] smoke screen, villain unseen!<br>🔊 smoke puff (after) |
| `f31_2` | Skull Chog | [growls] spirit blast, villain's past! |
| `f31_3` | Skull Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l31_free` | Skull Chog | [spooky] the cage could not hold my bones.<br>🔊 bone rattle (after) |

### Level 32

| ID | Voice | Line, as acted |
|---|---|---|
| `l32_jar` | Skull Chog | [spooky] she welds my cage while humming. the sparks tickle my ribs.<br>🔊 welding (just before "the") |
| `v32_intro` | Villain: Bot | [robotic] assembly line online. i build towers. then i tip them. built different. |
| `v32_hook` | Villain: Bot | [robotic] Built different. Breaks you. |
| `v32_spit0` | Villain: Bot | [robotic] rivets, roll out! |
| `v32_spit1` | Villain: Bot | [robotic] conveyor babies, go! |
| `v32_down` | Villain: Bot | [glitching] malfunction... reassembling... later... |
| `v32_gloat` | Villain: Bot | [robotic laugh] quality control: you failed. |
| `f32_0` | Skull Chog | [growls] mafia slap, take a nap! |
| `f32_1` | Skull Chog | [growls] bow to the crown, villain goes down! |
| `f32_2` | Skull Chog | [growls] bone zone! villain's thrown!<br>🔊 bone rattle (after) |
| `f32_3` | Skull Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l32_free` | Skull Chog | [spooky] the dead rise. and they stack.<br>🔊 bone rattle (just before "and") |

### Level 33

| ID | Voice | Line, as acted |
|---|---|---|
| `l33_jar` | Skull Chog | [pleading] he's never sold anything. including me. please... someone... list me. |
| `v33_intro` | Villain: Regal | [proudly] i am a one of one. i do not sell. i do not fold. survive my sell-offs, if you can. |
| `v33_hook` | Villain: Regal | [grandly] One of one. Never sold. Never folding. |
| `v33_spit0` | Villain: Regal | [commanding] heirs, go forth! |
| `v33_spit1` | Villain: Regal | [commanding] royal guard, sparkle! |
| `v33_down` | Villain: Regal | [gasps] a king... felled by a CHOG? |
| `v33_gloat` | Villain: Regal | [laughs smugly] kneel. diamond hands only. |
| `f33_0` | Skull Chog | [growls] horns down, out of town! |
| `f33_1` | Skull Chog | [growls] smoke screen, villain unseen!<br>🔊 smoke puff (after) |
| `f33_2` | Skull Chog | [growls] bone zone! villain's thrown!<br>🔊 bone rattle (after) |
| `f33_3` | Skull Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l33_free` | Skull Chog | [spooky] the cage could not hold my bones.<br>🔊 bone rattle (after) |

### Level 34

| ID | Voice | Line, as acted |
|---|---|---|
| `l34_say` | The Bear | [disgusted] commons? in MY diner? no. |
| `l34_jar` | Skull Chog | [spooky] she made me wear a corsage. on my ribcage. i'm a hostage with a corsage. |
| `v34_intro` | Villain: Diva | [sassy] welcome to my prom. VIP only. commons? ew. wait outside, sweetie. |
| `v34_hook` | Villain: Diva | [sassy] Not on the list? Not in the tower. |
| `v34_spit0` | Villain: Diva | [bossy] my court! go slay! |
| `v34_spit1` | Villain: Diva | [bossy] kiss kiss, babies. |
| `v34_down` | Villain: Diva | [gasps] my crown... my night... ruined... |
| `v34_gloat` | Villain: Diva | [laughs mockingly] she ate. you didn't. |
| `f34_0` | Skull Chog | [growls] cap on tight, villain, goodnight! |
| `f34_1` | Skull Chog | [growls] feel the heat, admit defeat!<br>🔊 fire breath (after) |
| `f34_2` | Skull Chog | [growls] hocus pocus, lose your focus! |
| `f34_3` | Skull Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l34_free` | Skull Chog | [spooky] the dead rise. and they stack.<br>🔊 bone rattle (just before "and") |

### Level 35

| ID | Voice | Line, as acted |
|---|---|---|
| `l35_say` | The Bear | [laughs] the diner freezer broke. everything is ice. and my goons are selling. |
| `l35_jar` | Skull Chog | [spooky] he narrates everything. 'the skull sighed.' i didn't sigh. i have no lungs. |
| `v35_intro` | Villain: Menace | [menacing] rain on the diner window. a frozen floor. a chog in a cage. and you... a suspect. |
| `v35_hook` | Villain: Menace | [growls] Case closed. You're caught in four K. |
| `v35_spit0` | Villain: Menace | [shouting] informants, tail them. |
| `v35_spit1` | Villain: Menace | [exhales] go, babies. |
| `v35_down` | Villain: Menace | [groans in pain] my deductions... were wrong... |
| `v35_gloat` | Villain: Menace | [laughs darkly] elementary. you fell. |
| `f35_0` | Skull Chog | [growls] angry eyes, villain cries! |
| `f35_1` | Skull Chog | [growls] ninja chop, villain drop! |
| `f35_2` | Skull Chog | [growls] roses are red, villain's in bed! |
| `f35_3` | Skull Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l35_free` | Skull Chog | [spooky] the cage could not hold my bones.<br>🔊 bone rattle (after) |

### Level 36

| ID | Voice | Line, as acted |
|---|---|---|
| `l36_jar` | Skull Chog | [spooky] he stole the rug, the plate and my femur. then he winked. |
| `v36_intro` | Villain: Bro | [chuckles] arr! a pirate, a ninja AND a slime. every third drop, i yank the rug. arr! |
| `v36_hook` | Villain: Bro | [smug] Yo ho, yo ho, the rug's gotta go! |
| `v36_spit0` | Villain: Bro | [hollering] swabbies, plunder! |
| `v36_spit1` | Villain: Bro | [hollering] arr, little slimes! |
| `v36_down` | Villain: Bro | [groans] abandon... ship... |
| `v36_gloat` | Villain: Bro | [chuckles] yo ho! rugged ya! |
| `f36_0` | Skull Chog | [growls] laser eyes, villain fries!<br>🔊 laser pew (after) |
| `f36_1` | Skull Chog | [growls] banana bonk! villain, honk!<br>🔊 clown honk (after) |
| `f36_2` | Skull Chog | [growls] feel the heat, admit defeat!<br>🔊 fire breath (after) |
| `f36_3` | Skull Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l36_free` | Skull Chog | [spooky] the dead rise. and they stack.<br>🔊 bone rattle (just before "and") |

### Level 37

| ID | Voice | Line, as acted |
|---|---|---|
| `l37_jar` | Radioactive Chog | [hyper] the music goes HARD in here. my atoms are dancing. still kidnapped though!<br>🔊 club beat (underneath) |
| `v37_intro` | Villain: Bro | [chuckles] welcome to Studio five-thirteen. the carpet's shag, there's a koi on my head, and the rug... pulls. |
| `v37_hook` | Villain: Bro | [smug] Disco never died. Your tower will. |
| `v37_spit0` | Villain: Bro | [hollering] koi kids, boogie! |
| `v37_spit1` | Villain: Bro | [hollering] strut, babies! |
| `v37_down` | Villain: Bro | [groans] the music... stopped...<br>🔊 record scratch (first) |
| `v37_gloat` | Villain: Bro | [chuckles] groovy. you fell on beat. |
| `f37_0` | Radioactive Chog | [hyper] ninja chop, villain drop! |
| `f37_1` | Radioactive Chog | [hyper] gust of air, villain? where?<br>🔊 wind blow (after) |
| `f37_2` | Radioactive Chog | [hyper] slam dunk, villain's sunk! |
| `f37_3` | Radioactive Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l37_free` | Radioactive Chog | [hyper] free! free! my atoms are vibrating! |

### Level 38

| ID | Voice | Line, as acted |
|---|---|---|
| `l38_jar` | Radioactive Chog | [hyper] he plays one sad song on loop. i'm glowing... sadly.<br>🔊 sad violin (underneath) |
| `v38_intro` | Villain: Creep | [whispers] it's not a phase. the plate leans because the world is tilted. like my heart. |
| `v38_hook` | Villain: Creep | [whispers] My mood swings. So does your plate. |
| `v38_spit0` | Villain: Creep | [whispers] sad babies, go cry somewhere. |
| `v38_spit1` | Villain: Creep | [sighs] spit. |
| `v38_down` | Villain: Creep | [sighs] finally... something real... |
| `v38_gloat` | Villain: Creep | [creepy laugh] you fell. same. |
| `f38_0` | Radioactive Chog | [hyper] smoke screen, villain unseen!<br>🔊 smoke puff (after) |
| `f38_1` | Radioactive Chog | [hyper] goo nuke! villain, puke!<br>🔊 cartoon boom (after) |
| `f38_2` | Radioactive Chog | [hyper] goo on you, now you're glued!<br>🔊 goo gurgle (after) |
| `f38_3` | Radioactive Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l38_free` | Radioactive Chog | [hyper] the goo is with you now. |

### Level 39

| ID | Voice | Line, as acted |
|---|---|---|
| `l39_jar` | Radioactive Chog | [hyper] she keeps exploding! then UN-exploding! my atoms can't keep up!<br>🔊 cartoon boom (just before "then") |
| `v39_intro` | Villain: Gremlin | [giggles] i'm a supernova. i pump so bright you'll go blind. then i dump. [giggles] |
| `v39_hook` | Villain: Gremlin | [mischievously] I pump. I dump. I go boom.<br>🔊 cartoon boom (on "boom") |
| `v39_spit0` | Villain: Gremlin | [cackles] stardust, scatter! |
| `v39_spit1` | Villain: Gremlin | [cackles] boom! babies!<br>🔊 cartoon boom (on "boom") |
| `v39_down` | Villain: Gremlin | [whining] collapsing... into a black hole... |
| `v39_gloat` | Villain: Gremlin | [cackles] boom. you're stardust now.<br>🔊 cartoon boom (on "boom") |
| `f39_0` | Radioactive Chog | [hyper] horns down, out of town! |
| `f39_1` | Radioactive Chog | [hyper] feel the heat, admit defeat!<br>🔊 fire breath (after) |
| `f39_2` | Radioactive Chog | [hyper] spirit blast, villain's past! |
| `f39_3` | Radioactive Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l39_free` | Radioactive Chog | [hyper] i stick to everything. including this squad. |

### Level 40

| ID | Voice | Line, as acted |
|---|---|---|
| `l40_say` | The Bear | [ominously] only the scary ones tonight. |
| `l40_jar` | Radioactive Chog | [hyper] he vapes blueberry in a purple hat. honestly? glowing review.<br>🔊 smoke puff (just before "honestly") |
| `v40_intro` | Villain: Creep | [exhales] skulls only tonight. no bones, no drip, no entry.<br>🔊 smoke puff (first) |
| `v40_hook` | Villain: Creep | [whispers] Skulls only. Drip mandatory. |
| `v40_spit0` | Villain: Creep | [whispers] skelings, puff puff!<br>🔊 smoke puff (on "puff") |
| `v40_spit1` | Villain: Creep | [whispers] dior babies, go! |
| `v40_down` | Villain: Creep | [wails] my... drip... [coughs] |
| `v40_gloat` | Villain: Creep | [creepy laugh] dripped on you. |
| `f40_0` | Radioactive Chog | [hyper] horns down, out of town! |
| `f40_1` | Radioactive Chog | [hyper] freeze! say please! |
| `f40_2` | Radioactive Chog | [hyper] goo nuke! villain, puke!<br>🔊 cartoon boom (after) |
| `f40_3` | Radioactive Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l40_free` | Radioactive Chog | [hyper] i'm GLOWING with gratitude. literally glowing. |

### Level 41

| ID | Voice | Line, as acted |
|---|---|---|
| `l41_jar` | Radioactive Chog | [hyper] she flies me around on a carpet. no snacks. no wifi. just vibes and wind. |
| `v41_intro` | Villain: Creep | [whispers] my name is 'alone' backwards. i fly alone. and soon your tower falls... alone. |
| `v41_hook` | Villain: Creep | [whispers] Enola is 'alone' backwards. So's your tower. |
| `v41_spit0` | Villain: Creep | [whispers] rug rats, fly! |
| `v41_spit1` | Villain: Creep | [whispers] solo mission, babies. |
| `v41_down` | Villain: Creep | [sighs] at least... i fell... alone... |
| `v41_gloat` | Villain: Creep | [creepy laugh] alone again. as planned. |
| `f41_0` | Radioactive Chog | [hyper] horns down, out of town! |
| `f41_1` | Radioactive Chog | [hyper] feel the heat, admit defeat!<br>🔊 fire breath (after) |
| `f41_2` | Radioactive Chog | [hyper] goo nuke! villain, puke!<br>🔊 cartoon boom (after) |
| `f41_3` | Radioactive Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l41_free` | Radioactive Chog | [hyper] i'm free and i'm sticky. let's stack. |

### Level 42

| ID | Voice | Line, as acted |
|---|---|---|
| `l42_say` | The Bear | [shouting] Rugzilla! ALL the rugs! |
| `l42_jar` | Radioactive Chog | [hyper] one eye. one toothpick. zero chill. i'll glow at him harder. |
| `v42_intro` | Villain: Menace | [menacing] Rugzilla sent me. every second drop, my blade pulls the rug. bow down. |
| `v42_hook` | Villain: Menace | [growls] Bow down, or get swept. |
| `v42_spit0` | Villain: Menace | [shouting] onilings, strike! |
| `v42_spit1` | Villain: Menace | [shouting] go, babies. |
| `v42_down` | Villain: Menace | [groans in pain] my toothpick... |
| `v42_gloat` | Villain: Menace | [laughs darkly] swept. like the floor. |
| `f42_0` | Radioactive Chog | [hyper] horns down, out of town! |
| `f42_1` | Radioactive Chog | [hyper] gust of air, villain? where?<br>🔊 wind blow (after) |
| `f42_2` | Radioactive Chog | [hyper] goo nuke! villain, puke!<br>🔊 cartoon boom (after) |
| `f42_3` | Radioactive Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l42_free` | Radioactive Chog | [hyper] warning: radioactive chog released. stand back. or don't. |

### Level 43

| ID | Voice | Line, as acted |
|---|---|---|
| `l43_jar` | Radioactive Chog | [hyper] he lets me press the launch button! it does nothing! still fun!<br>🔊 button fizzle (just before "it") |
| `v43_intro` | Villain: Gremlin | [giggles] i rage-quit three planets. the moon is next. your chog is my co-pilot now. |
| `v43_hook` | Villain: Gremlin | [mischievously] Earth? Rage-quit. Moon? Mine. |
| `v43_spit0` | Villain: Gremlin | [cackles] probes, launch!<br>🔊 rocket launch (on "launch") |
| `v43_spit1` | Villain: Gremlin | [cackles] three, two, one... SPIT! |
| `v43_down` | Villain: Gremlin | [whining] houston... i am the problem... |
| `v43_gloat` | Villain: Gremlin | [cackles] mission failed. yours. |
| `f43_0` | Radioactive Chog | [hyper] bow to the crown, villain goes down! |
| `f43_1` | Radioactive Chog | [hyper] feel the heat, admit defeat!<br>🔊 fire breath (after) |
| `f43_2` | Radioactive Chog | [hyper] goo nuke! villain, puke!<br>🔊 cartoon boom (after) |
| `f43_3` | Radioactive Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l43_free` | Radioactive Chog | [hyper] ten out of ten would glow again. |

### Level 44

| ID | Voice | Line, as acted |
|---|---|---|
| `l44_say` | Plumpy | [confused] the moon is made of ice?? i thought it was grape jelly. |
| `l44_jar` | Radioactive Chog | [hyper] he says i'm 'just stardust in a cage'. deep. still a cage. |
| `v44_intro` | Villain: Regal | [proudly] i am the cosmos in a windsor tie. the moon is ice because i thought it so. |
| `v44_hook` | Villain: Regal | [grandly] I contain multitudes. You contain mistakes. |
| `v44_spit0` | Villain: Regal | [commanding] comets, go! |
| `v44_spit1` | Villain: Regal | [commanding] big bang, babies. |
| `v44_down` | Villain: Regal | [gasps] the universe... expanding... away from me... |
| `v44_gloat` | Villain: Regal | [laughs smugly] galaxy brain. you? asteroid brain. |
| `f44_0` | Radioactive Chog | [hyper] horns down, out of town! |
| `f44_1` | Radioactive Chog | [hyper] gust of air, villain? where?<br>🔊 wind blow (after) |
| `f44_2` | Radioactive Chog | [hyper] spirit blast, villain's past! |
| `f44_3` | Radioactive Chog | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l44_free` | Radioactive Chog | [hyper] half-life of a cage: zero. you did that. |

### Level 45

| ID | Voice | Line, as acted |
|---|---|---|
| `l45_say` | The Bear | [chewing] moon cheese plate. [satisfied] delicious.<br>🔊 big chomp (first) |
| `l45_jar` | Chog Scream | [screaming] AAAAAAA! he crunches the plate like a cookie! AAAA! [suddenly calm] that means help.<br>🔊 cookie crunch (just before "AAAA") |
| `v45_intro` | Villain: Gremlin | [giggles] every skrump was cute. then i entered my villain era. tasty plate.<br>🔊 cookie crunch (on "tasty") |
| `v45_hook` | Villain: Gremlin | [mischievously] Not a phase. A villain era. |
| `v45_spit0` | Villain: Gremlin | [cackles] lil evils, chew! |
| `v45_spit1` | Villain: Gremlin | [cackles] go!<br>🔊 cookie crunch (first) |
| `v45_down` | Villain: Gremlin | [whining] my era... is over... |
| `v45_gloat` | Villain: Gremlin | [cackles] villain wins. as is tradition. |
| `f45_0` | Chog Scream | [screaming] AAAAAAAAAAAAA! |
| `f45_1` | Chog Scream | [screaming] belly bump, villain slump! |
| `f45_2` | Chog Scream | [screaming] chog charge, villain's not so large! |
| `f45_3` | Chog Scream | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l45_free` | Chog Scream | [screaming] AAAAAAAAA! [suddenly calm] that means thank you. |

### Level 46

| ID | Voice | Line, as acted |
|---|---|---|
| `l46_jar` | Grim | [ominously] i am death itself. [annoyed] he painted 'NO CHOGS' on my cage. rude. |
| `v46_intro` | Villain: Menace | [menacing] a solar flare with demon wings and a ninja on my shoulder. i hate chogs. ALL of them. |
| `v46_hook` | Villain: Menace | [growls] Hater by nature. Opp by choice. |
| `v46_spit0` | Villain: Menace | [shouting] opplings, burn it! |
| `v46_spit1` | Villain: Menace | [shouting] go hate, babies! |
| `v46_down` | Villain: Menace | [grudgingly] fine... chogs are... kinda ok... |
| `v46_gloat` | Villain: Menace | [laughs darkly] L. ratio. tower fell. |
| `f46_0` | Grim | [deep and slow] your time is up. |
| `f46_1` | Grim | [deep and slow] sticks and stones break villain bones!<br>🔊 bone rattle (after) |
| `f46_2` | Grim | [deep and slow] belly bump, villain slump! |
| `f46_3` | Grim | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l46_free` | Grim | [deep and slow] death took a holiday. i'll take the tower. |

### Level 47

| ID | Voice | Line, as acted |
|---|---|---|
| `l47_jar` | Chogbomination | [gurgles] [gloomy] he says 'it's so over' every five minutes. i've been over since the forbidden snack.<br>🔊 goo gurgle (first) |
| `v47_intro` | Villain: Menace | [menacing] ...the dark side. no light. no guide. no hope. it's so over. |
| `v47_hook` | Villain: Menace | [growls] It's so over. It was always over. |
| `v47_spit0` | Villain: Menace | [shouting] ...shades... go. |
| `v47_spit1` | Villain: Menace | [shouting] ...rise. |
| `v47_down` | Villain: Menace | [weakly] ...we're... so back...? |
| `v47_gloat` | Villain: Menace | [laughs darkly] ...over. |
| `f47_0` | Chogbomination | [growls] hug me, villain... forever. |
| `f47_1` | Chogbomination | [growls] belly bump, villain slump! |
| `f47_2` | Chogbomination | [growls] chog charge, villain's not so large! |
| `f47_3` | Chogbomination | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l47_free` | Chogbomination | [gurgling] i'm free... i'm gross... [warmly] i'm yours.<br>🔊 goo gurgle (first) |

### Level 48

| ID | Voice | Line, as acted |
|---|---|---|
| `l48_jar` | Blaze | [agitated] he goes BOO every time i doze off. i'm on FIRE and still jumpy. |
| `v48_intro` | Villain: Creep | [whispers] boooo. three perfects in a row, or i haunt your combo forever. [creepy laugh] boooo. |
| `v48_hook` | Villain: Creep | [whispers] Miss once and you're ghosted. |
| `v48_spit0` | Villain: Creep | [whispers] wisps, haunt! |
| `v48_spit1` | Villain: Creep | [whispers] booooo, babies. |
| `v48_down` | Villain: Creep | [wails] i'm... dead... again... |
| `v48_gloat` | Villain: Creep | [creepy laugh] boo. you're ghosted. |
| `f48_0` | Blaze | [fired up] burn it ALL down!<br>🔊 fire breath (after) |
| `f48_1` | Blaze | [fired up] hot, hot, hot! take that shot!<br>🔊 fire breath (after) |
| `f48_2` | Blaze | [fired up] belly bump, villain slump! |
| `f48_3` | Blaze | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l48_free` | Blaze | [fired up] i'm out and i'm ON FIRE. let's burn this tower up! |

### Level 49

| ID | Voice | Line, as acted |
|---|---|---|
| `l49_say` | Plumpy | [focused] practice run. nineteen tall... then a pointy head on top. |
| `l49_jar` | Burning Skully | [annoyed] unc keeps saying flaming skeletons weren't a thing in twenty seventeen. i'm a thing NOW. |
| `v49_intro` | Villain: Bro | [chuckles] minted before you were born, kid. twenty seventeen. the Bear's door? i'm the bouncer. |
| `v49_hook` | Villain: Bro | [smug] Been here since twenty seventeen. You're late. |
| `v49_spit0` | Villain: Bro | [hollering] pixels, go! |
| `v49_spit1` | Villain: Bro | [hollering] spawning.<br>🔊 vr boot (first) |
| `v49_down` | Villain: Bro | [groans] unc... is cooked... |
| `v49_gloat` | Villain: Bro | [chuckles] skill issue. since twenty seventeen. |
| `f49_0` | Burning Skully | [fierce] flaming bones, coming home!<br>🔊 fire breath (after) |
| `f49_1` | Burning Skully | [fierce] hot, hot, hot! take that shot!<br>🔊 fire breath (after) |
| `f49_2` | Burning Skully | [fierce] sticks and stones break villain bones!<br>🔊 bone rattle (after) |
| `f49_3` | Burning Skully | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l49_free` | Burning Skully | [proudly] flaming bones, at your service. |

### Level 50

| ID | Voice | Line, as acted |
|---|---|---|
| `l50_jar` | Midas | [haughty] darling, he's older than gold. [whispers] and he smells like it. |
| `v50_intro` | Villain: Menace | [menacing] ...the Bear works for me. i was here before the moon. before the cages. before you. |
| `v50_hook` | Villain: Menace | [growls] Untouched. Unbroken. Unforgotten. |
| `v50_spit0` | Villain: Menace | [shouting] fossils... awaken. |
| `v50_spit1` | Villain: Menace | [shouting] the ancient ones rise. |
| `v50_down` | Villain: Menace | [fading] ...remember... me... |
| `v50_gloat` | Villain: Menace | [laughs darkly] ...forget you. |
| `f50_0` | Midas | [haughty] everything i touch turns to KO. |
| `f50_1` | Midas | [haughty] make it rain, feel the pain!<br>🔊 coins rain (after) |
| `f50_2` | Midas | [haughty] belly bump, villain slump! |
| `f50_3` | Midas | [shouting] from the plate to the moon. villain, you are DOOMED! |
| `l50_free` | Midas | [smugly] free at last. everything i stack turns to gold. |

### Ending

| ID | Voice | Line, as acted |
|---|---|---|
| `end_0` | The Bear | [stunned] ...you planted a flag. on MY moon. |
| `end_1` | Plumpy | [happily] the moon is grape jelly. there is enough for everyone. |
| `end_2` | The Bear | [shyly] ...can i have some? |
| `end_3` | Plumpy | [warmly] chog world order. everybody eats. [chuckles] even bears. |
| `end_4` | Plumpy | [whispers] wait. what is that... behind the moon? |

### In game

| ID | Voice | Line, as acted |
|---|---|---|
| `p_idle_0` | Plumpy | [bored] tap when i am over the tower. make no mistakes. |
| `p_idle_1` | Plumpy | [whining] feed me first. i am starving. |
| `p_idle_2` | Plumpy | [deadpan] the plate is small. i am not. |
| `p_combo_0` | Plumpy | [focused] i am locked in. |
| `p_combo_1` | Plumpy | [smug] perfect. obviously. |
| `p_combo_2` | Plumpy | [proudly] call me... the stack whisperer. |
| `p_combo_3` | Plumpy | [excited] combo. say it with me. COMBO! |
| `p_drop_0` | Plumpy | [gleeful] wheeeeee! |
| `p_drop_1` | Plumpy | [excited] here i gooo! |
| `p_drop_2` | Plumpy | [nervous] catch me! |
| `p_drop_3` | Plumpy | [sings] i believe i can fly... [deadpan] i cannot. |
| `p_land_0` | Plumpy | [giggles] squish.<br>🔊 plush squish (first) |
| `p_land_1` | Plumpy | [sighs happily] comfy. |
| `p_land_2` | Plumpy | [whispers] don't. move. |
| `p_land_3` | Plumpy | [whispers] nobody breathe. |
| `p_land_4` | Plumpy | [confidently] we stack. |
| `p_record_0` | Plumpy | [nervously] new record. i am scared of heights. |
| `p_record_1` | Plumpy | [giggles] we are so high right now. |
| `p_record_2` | Plumpy | [whispers] tallest tower yet. do not sneeze. |
| `p_feed_0` | Plumpy | [burps] tasted like a rug pull. |
| `p_feed_1` | Plumpy | [munching] more. MORE! |
| `p_feed_2` | Plumpy | [chewing] that coin went to zero... and so did my diet. |
| `p_feed_3` | Plumpy | [contented] i can feel my belly expanding. |
| `p_full_0` | Plumpy | [burps] i am full. i am literally round. |
| `p_diet_0` | Plumpy | [betrayed] salad?? betrayal. |
| `p_fall_0` | Plumpy | [shouting] YOU MADE A MISTAKE. |
| `bear_sell` | The Bear | [laughs] sell. SELL. [laughs maniacally] |
| `bear_rug` | The Bear | [shouting] Rugzilla. NOW! |
| `bear_pump` | The Bear | [annoyed] who is buying?? stop that. |
| `bear_whale` | The Bear | [groans] a whale?? ugh. |
| `bear_freeze` | The Bear | [mischievously] i froze the liquidity. slide, chogs. |
| `bear_fud` | The Bear | [blows air] have you heard? chog is going to zero. HOOOO.<br>🔊 wind blow (on "HOOOO") |
| `bear_final` | The Bear | [menacing] the cage is cracking... but i have one more candle.<br>🔊 cage creak (just before "but") |
| `bear_slow` | The Bear | [laughs] too slow. plumpy let go. |
| `bear_pick` | The Bear | [mischievously] this one. i pick this one. [giggles] |
| `bear_origin` | The Bear | [growls] every crumb... is mine. |
| `p_crash_rug` | Plumpy | [frustrated] RUGGED. the market made a mistake. |
| `p_crash_bite` | Plumpy | [outraged] the bear ATE the plate. not our fault.<br>🔊 big chomp (just before "not") |
| `p_crash_freeze` | Plumpy | [sighs] frozen liquidity. we slid. not our fault. |
| `p_crash_fud` | Plumpy | [annoyed] the FUD got us. not our fault. |
| `p_crash_sell` | Plumpy | [sighs] paper hands sold the tower. not your fault. |
| `p_close` | Plumpy | [sighs] we were SO close. again. |
| `p_hello` | Plumpy | [deadpan] hi. i am plumpy. feed me. |
| `p_stairs` | Plumpy | [excited] enough floating. stairs: built. let's go! |
| `p_origin_2` | Plumpy | [shyly] hi. i'm plumpy. i'm new here. |
| `p_origin_3` | Plumpy | [screams] whoaaaa! |
| `p_origin_4` | Plumpy | [satisfied] bought the dip. [chewing] ate the dip.<br>🔊 munching (after) |
| `p_origin_5` | Plumpy | [confidently] i carry. you tap. we stack. |
| `p_origin_7` | Plumpy | [determined] let's go get them back. |

### Story: the narrator

| ID | Voice | Line, as acted |
|---|---|---|
| `n_origin_1` | Narrator | [warmly] Chog World. Every night, the Purple Moon rains crumbs... and the Chogs stack up to catch them. |
| `n_origin_2` | Narrator | [mysteriously] One night... a star fell instead.<br>🔊 star fall (on "star") |
| `n_origin_3` | Narrator | [gently amused] The skinniest Chog in Chog World. Every gust blew Plumpy off the tower.<br>🔊 wind blow (just before "blew") |
| `n_origin_4` | Narrator | [playfully] So Plumpy ate. Every rug that got pulled. Every dip.<br>🔊 munching (just before "Every") |
| `n_origin_5` | Narrator | [with wonder] Too round to stack. But a Chog born from a star... can float. |
| `n_origin_6` | Narrator | [ominously] Then the Bear came. He stole every crumb, caged fifty Chogs... and hired fifty NFT villains to guard them.<br>🔊 giant stomps (first) |
| `n_origin_7` | Narrator | [hopeful] Every caged Chog is a real Chog Genesis NFT. [determined] Time to bring them home. |
