# Plumpy and the Purple Moon

A tower-stacking story game for **Chogathon 2026**, starring the real **Chog Genesis** NFTs on Monad.

**Play:** https://dexgirl.github.io/PlumpyTower/ (works in any modern browser on phone or computer, and installs as an app)

The Bear stole every crumb in Chog World, caged 50 Chogs and hired 50 NFT villains to guard them. Plumpy, a Chog born from a fallen star, carries your squad up to each cage: you drop Chogs to build a tower to the line, knock the villain off its perch and free the caged Chog. Every caged Chog is a real Chog Genesis NFT, and once freed it joins your squad.

No wallet, no sign-in, no approvals. Ever.

## What's in it

- **50 levels in 8 worlds**, each with its own twist (ice, wind, moon gravity, a moving or tilted plate, fog, the Bear biting the plate, diet days, drop timers) and a boss fight against a real NFT villain.
- **Your squad is real NFTs.** Each Chog's traits decide how it stacks: the head sets the top shape (flat, round or pointy), rarity sets the weight, and the base, aura and accessory give powers such as sticky goo, windproof, golden crumbs or a wider PERFECT zone.
- **The $CHOG market moves the tower.** Pumps, whale buys, sell pressure, rug pulls, liquidity freezes and FUD storms hit mid-level, with a warning first.
- **A fully voiced cast.** 711 acted lines across 21 voices (made with ElevenLabs v3), plus 43 sound effects placed on the words they belong to: Plumpy's stomach growls, skeleton Chogs' bones rattle, the Bear slow-claps.
- **A narrated story** before you play, a hands-on practice mode for levels 1 and 2, and a written guide.
- **Plays like an app.** It installs to the home screen (Android, iPhone, desktop), works offline once loaded, and saves progress on the device. A save code moves progress between devices.

## Tech stack

Plain HTML, CSS and JavaScript in a single page, with no framework and no build server needed to play.

- **Physics:** Matter.js.
- **Drawing:** Canvas 2D. The Chogs' plush bodies and heads are drawn from their NFT traits; the villains are their real NFT images, cut out.
- **Audio:** the Web Audio API synthesizes the music and sound effects; the recorded voices play from per-level files.
- **Voices:** ElevenLabs v3 (Voice Design, text to speech with audio tags, sound effects), mixed with ffmpeg and numpy.
- **Web app:** a manifest plus a service worker for offline play and home-screen install.
- **Hosting:** GitHub Pages.

## Repository

| Folder | What it holds |
|---|---|
| `docs/` | The live site (what GitHub Pages serves): `index.html`, the app manifest, the service worker, icons, and the voice files (`voices/L1.json` to `L50.json` for each level, `W1` to `W8` for world intros, `core.json` for in-game lines). |
| `prototype/` | The game source. `plumpy.src.html` is the shell and game; `parts/` holds physics, levels, villains, fight, mounts and voice lines. `build.py` assembles everything; `build_site.py` makes the web app. |
| `data/` | The Chog roster (`plumpy-pack.json`, from the Chog Genesis collection), villain pictures and cut-outs, and cover art. |
| `voice/` | The voice script (`VOICE-SCRIPT.md`, every line as acted), the ElevenLabs recording kit's README, and loudness tweaks. |
| `scripts/` | Tools: roster and villain builders, the ElevenLabs recording kit (`make-voices.mjs`), the acting directions (`voice-performance.cjs`) and the mixer (`mix-voices.py`). |

### Build it yourself

```bash
cd prototype
python3 build.py      # writes prototype/plumpy.html and ../site/ (copy site/ to docs/ to publish)
```

## Credits

- Chog Genesis NFTs belong to their holders; the game links each one to its OpenSea page.
- The story theme is an original arrangement of *Korobeiniki*, a 19th-century Russian folk song in the public domain.
- Voices and sound effects were generated with ElevenLabs.
