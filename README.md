# 🎸 ChordFlow

> **Write chord progressions, hear them played, and learn them on the guitar neck.**

[![Live](https://img.shields.io/badge/Live-chords.newbold.cloud-0a84ff?style=for-the-badge)](https://chords.newbold.cloud)
[![Version](https://img.shields.io/badge/Version-0.77-30d158?style=for-the-badge)](https://github.com/justinnewbold/chordflow)

ChordFlow is a guitar-first songwriting and practice tool. Build a progression,
play it back with bass and drums, and see the shape for every chord on the neck
as it plays. It runs entirely in the browser and installs to your home screen.

---

## Three tabs

The whole app lives behind three destinations, so every feature has one home.

### 🎸 Play — *make music now*
The chord under the playhead is shown as a guitar shape, live, as the
progression plays.

- Live fretboard for the current chord, tap to hear it
- Chord grid with drag-to-reorder, tap to preview, edit in place
- Key, style and tempo; tap tempo; time signatures
- Song sections (Verse / Chorus / Bridge …)
- One-tap **Generate**, with moods, AI variations, templates, presets,
  diatonic helpers, custom chords and melody suggestions folded behind
  *More ways to generate*

### 🎯 Practice — *get better at playing it*
- **Scale Explorer** — 7 scales and modes across 5 tunings on a full neck;
  tap any note to hear it, or play the scale and watch it light up
- **Chord Sheet** — every chord in your song as a guitar diagram
- **Strumming patterns** — Basic, Pop, Folk, Rock, locked to the beat
- **Tuner** — reference pitches for standard tuning
- Practice speed (50–100%), count-in, auto speed-up, A-B loop
- **Learn Songs** — public-domain songs with chords and lyrics
- **Quizzes** — Name That Chord (see a shape), Guess the Chord and Interval
  Recognition (hear it), each with a saved best streak

### 🎛️ Studio — *produce and share it*
- Mixer (chords / bass / master), reverb and delay presets
- Drums, metronome, 14+ instruments
- Arrangement playback through all sections
- Export **MIDI · PDF · WAV · MP3**
- Save locally or to the cloud; share a link, a QR code, or publish

---

## Chord diagrams

Any chord opens as a diagram you can hear, in five views: **guitar**,
**7-string**, **bass**, **piano**, and the **full neck** with every chord tone
mapped. Guitar shapes are generated for any chord — open voicings where they
exist, movable barre shapes everywhere else — with correct fingerings, barres,
and open/muted markers.

Diagrams follow your **tuning** (standard, Drop D, 7-string, bass, 5-string
bass), your **capo**, and **left-handed** if you play that way. Shapes in
alternate tunings are solved from the strings themselves, so a Drop D grip is a
real Drop D grip, not a standard one relabelled. Tuning is one setting shared
with the Scale Explorer, so the neck never means two different things at once.

## On your phone

Installs as a PWA and behaves like a native app: works offline, keeps the screen
awake while playing, shows the progression on the lock screen, survives phone
calls and app switches without losing audio or your work, and auto-saves your
song so it is still there when you come back.

## Tech

Vanilla JS in a single `index.html` · [Tone.js](https://tonejs.github.io/) for
audio · Gemini for AI generation · Vercel hosting.

## License

MIT — use and modify freely.

---

**Made with ❤️ by Justin Newbold** · [🌐 Live](https://chords.newbold.cloud) · [📦 GitHub](https://github.com/justinnewbold/chordflow)
