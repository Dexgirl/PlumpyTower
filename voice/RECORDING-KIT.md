# Plumpy voice kit (ElevenLabs)

You will:

1. Make the voices on the ElevenLabs website.
2. Record all 711 lines with a few terminal commands in WSL.
3. Send Claude one file: `voice-pack.json`.

The script: 711 lines (604 different ones), 21 voices. It's recorded with ElevenLabs **v3**, so every line is acted, not just read: the Bear really laughs where the game says "lol", ghosts whisper, the scream Chog screams. The [brackets] in `voice/VOICE-SCRIPT.md` are those acting directions. Every line and every Voice Design prompt is in that file.

Your API key never goes in a file or in the chat. You type it into your terminal only.

---

## Step 0: unpack the kit in WSL

```bash
cd ~
cp /mnt/c/Users/YOUR_WINDOWS_NAME/Downloads/plumpy-voice-kit.zip .
unzip plumpy-voice-kit.zip
cd plumpy-voice-kit
node -v
```

- Don't know your Windows name? Run `ls /mnt/c/Users`.
- If `unzip` is missing: `sudo apt install -y unzip`.
- `node -v` must say v18 or higher. If it doesn't, install Node 20:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 20
```

## Step 1: make the voices (ElevenLabs website)

Open `voice/VOICE-SCRIPT.md`. Every voice has a **Voice Design prompt**, a **Preview text** and the **exact name** to save it under.

1. On elevenlabs.io go to **Voices**, then **Create / Add a new voice**, then **Voice Design**. The menu names can differ slightly.
2. Paste the voice's prompt. Use its Preview text as the sample text, then click **Generate**.
3. Listen to the previews, keep the best one, and **save it with exactly the name shown**: `Narrator`, `Plumpy`, `The Bear`, `Villain: Gremlin`, and so on.

Short on time or voice slots? Make at least the 3 starred ones: **Narrator, Plumpy and The Bear**. The kit fills every other role with one of ElevenLabs' built-in voices. Each plan has a limit on how many custom voices you can save.

## Step 2: give the kit your API key (this terminal only)

1. On ElevenLabs, open **Developers** (or your profile), then **API Keys**, then **Create**. Allow **Text to Speech** (Access), **Sound Effects** (Access), **Voices** (Read) and **User** (Access).
2. Copy the key.
3. In the WSL terminal, run this line, paste the key and press Enter. Nothing shows while you paste; that's on purpose.

```bash
read -rsp "ElevenLabs API key: " ELEVENLABS_API_KEY && export ELEVENLABS_API_KEY && echo
```

The key is forgotten when you close this terminal. In a new terminal, run the line again.

## Step 3: connect the voices and check credits

```bash
node scripts/make-voices.mjs voices --fallback
node scripts/make-voices.mjs check
```

- `voices` shows which voice each role will use: ✓ is your design, ~ is a built-in voice.
- `check` shows the line count, the characters needed and your credits left.

## Step 4: listen to the cast first (21 short samples)

```bash
node scripts/make-voices.mjs samples --again
(cd voice/samples && explorer.exe .)
```

Don't like one? Design or pick another voice in ElevenLabs, then run `voices --fallback` again. Delete that sample's file and run `samples` again.

## Step 5: make the sound effects

Some lines describe a sound a voice can't make: Plumpy's stomach growling, the Skull Chog's bones rattling, the saw, glass shattering, a clown horn. The kit makes those 43 sounds once with ElevenLabs Sound Effects (about 2,300 credits), and Claude mixes each one into its line on the right word. 🔊 in `voice/VOICE-SCRIPT.md` shows where.

```bash
node scripts/make-voices.mjs sfx
(cd voice/sfx && explorer.exe .)
```

If it says your key is missing a permission: on ElevenLabs, edit the key (Developers > API Keys) and set **Sound Effects** to **Access**, or make a new key with it and run the `read -rsp` line again. Don't like a sound? `node scripts/make-voices.mjs sfx --again bone_rattle`

## Step 5b: record, in batches

There are 29 batches of 25 lines each, numbered 0 to 28. Start with one batch and listen to a few files in `voice/audio`:

```bash
node scripts/make-voices.mjs say 0
```

Then do the rest in chunks. Each command prints the next one.

```bash
node scripts/make-voices.mjs say 1-6
node scripts/make-voices.mjs say 7-13
node scripts/make-voices.mjs say 14-20
node scripts/make-voices.mjs say 21-28
```

- It's safe to stop and re-run. Lines already recorded are skipped.
- If you run out of credits, it stops cleanly. Top up, then run the same command again.
- To re-take a line you don't like, use its ID from VOICE-SCRIPT.md: `node scripts/make-voices.mjs redo v12_gloat`

## Step 6: pack and send to Claude

```bash
node scripts/make-voices.mjs pack
(cd data && explorer.exe .)
```

Drag `voice-pack.json` into the chat. If the clips are big, `pack` splits them into `voice-pack.json`, `voice-pack-2.json`... (each under 20 MB): send all of them.

The pack also carries the word timings ElevenLabs sends back (so each sound lands on its word) and the sound effects.

If the upload is refused for size, send the clips as a zip instead:

```bash
zip -r plumpy-voices.zip voice/audio
(explorer.exe .)
```

Then send `plumpy-voices.zip`. If `zip` is missing: `sudo apt install -y zip`.

---

## Which model?

The kit records with **v3** unless you choose otherwise. Keep one model for the whole run, so every line sounds consistent.

| Model | How to choose it | Notes |
|---|---|---|
| v3 (default) | nothing to do (or `export ELEVEN_MODEL=eleven_v3`) | acts every line: laughs, whispers, screams, sighs. About 1 credit per character: roughly 31,600 for everything, samples included |
| Flash v2.5 | `export ELEVEN_MODEL=eleven_flash_v2_5` | about half the credits, but it just reads the lines (it would say "lol" instead of laughing) |

Want even more drama from v3? `export ELEVEN_STABILITY=0` (more expressive, sometimes a bit wild). `ELEVEN_STABILITY=1` is the calmest.

Repeated lines (the same line said by the same voice in different levels) are recorded once and copied for free.

`check` always shows your real credit balance.

Licence: check that your ElevenLabs plan allows the use you want (some plans are non-commercial or need a credit to ElevenLabs).

## What Claude does with the file

- Checks every clip is there.
- Mixes each sound effect into its line, on the right word.
- Trims the silence and evens out the loudness.
- Tunes Plumpy and the Bear if they need more character.
- Packs the clips so phones only load the voices they need.
- Publishes the new version of the game.
