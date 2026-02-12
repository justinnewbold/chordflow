# ChordFlow Roadmap

## Current Version: 0.72

---

## 🎯 Quick Wins

### More Instruments
- [x] ~~Drums/Percussion patterns~~ ✅ v0.72 (full drum kit per genre)
- [x] Cello, Viola ✅ v0.67
- [x] Flute, Clarinet, Saxophone ✅ v0.67
- [x] Ukulele ✅ v0.67
- [x] Banjo ✅ v0.67
- [x] Harmonica ✅ v0.67

### Playback Enhancements
- [x] Strum patterns for guitar ✅ v0.67
- [x] Arpeggio mode ✅ v0.67
- [x] Swing/shuffle feel ✅ v0.68
- [x] Different time signatures (3/4, 6/8) ✅ v0.68

### More Genres
- [x] Metal, Punk ✅ v0.67
- [x] Reggae ✅ v0.67
- [x] Latin/Bossa Nova ✅ v0.67
- [x] Gospel ✅ v0.67
- [x] Lo-fi/Chill ✅ v0.67

---

## 🎨 UI/UX Improvements

### Chord Diagrams
- [x] Bass tab diagrams ✅ v0.68
- [x] 7-string guitar diagrams ✅ v0.71
- [x] Piano keyboard visualization ✅ v0.68

### Visual Enhancements
- [x] Visual metronome - animated beat indicator ✅ v0.70
- [x] Flash screen on downbeat option ✅ v0.70
- [x] Dark/Light theme toggle ✅ v0.71
- [x] Animated transitions (chord cards, sections, sheets) ✅ v0.72
- [x] Responsive desktop layout (4-column grid, wide content) ✅ v0.72

---

## 🔧 Power Features

### Chord Editing
- [x] Custom chord input - type any chord manually ✅ v0.70
- [x] Add/edit individual chords in progression ✅ v0.70
- [x] Inline chord editing (double-click to edit/delete) ✅ v0.72
- [x] Undo for delete chord (with toast) ✅ v0.72

### AI Enhancements
- [x] Chord substitutions - AI suggest alternatives ✅ v0.70
- [x] "Make it jazzy" / "Simplify" buttons ✅ v0.70
- [x] Melody suggestion (AI + fallback) ✅ v0.72
- [x] Chord progression preset library (15 famous progressions) ✅ v0.72

### Practice Mode
- [x] Gradually speed up tempo ✅ v0.71
- [x] Loop specific section ✅ v0.71
- [x] A-B repeat ✅ v0.71
- [x] Drum patterns per genre (kick/snare/hihat) ✅ v0.72
- [x] Song arrangement playback (all sections in order) ✅ v0.72

### Sharing
- [x] Share progression via link ✅ v0.71
- [x] QR code to share ✅ v0.72

### Export
- [x] Enhanced PDF with scale degrees and all sections ✅ v0.72
- [x] MP3/WebM audio export ✅ v0.72

---

## 📱 Mobile-Specific

- [x] Haptic feedback on beat ✅ v0.72
- [x] Lock screen / background audio (Media Session API) ✅ v0.72
- [x] Offline mode (PWA enhancements) ✅ v0.71

---

## 🎓 Learning Features

### Music Theory
- [x] Show scale degrees (I, IV, V, vi) ✅ v0.70
- [x] Explain why chords work together ✅ v0.70

### Ear Training
- [x] Guess the chord game ✅ v0.71
- [x] Interval recognition ✅ v0.71

---

## ✅ Completed

### v0.72
- [x] Drum Patterns: Genre-specific kick/snare/hihat using MembraneSynth/NoiseSynth
- [x] Inline Chord Editing: Double-click any chord to edit, swap, or delete
- [x] Song Arrangement Playback: Play through all sections (Verse → Chorus → Bridge)
- [x] Melody Suggestion: AI-powered melody ideas with audio playback
- [x] Chord Preset Library: 15 famous progressions (Pachelbel, 12-bar blues, etc.)
- [x] Enhanced PDF Export: Scale degrees, all sections, and chord notes
- [x] MP3/Audio Export: Record and download via WebM
- [x] Responsive Desktop Layout: 4-column grids, wider content, centered sheets
- [x] Undo for Delete Chord: Toast notification with undo button
- [x] Animated Transitions: Chord card enter animations, smooth section switching
- [x] QR Code Share: Canvas-rendered QR code for sharing progressions
- [x] Haptic Feedback: navigator.vibrate() on beat for mobile
- [x] Lock Screen Audio: Media Session API for background playback controls

### v0.71
- [x] Practice Mode: Auto speed-up tempo (+3/+5/+10 BPM per loop)
- [x] A-B Loop: Set start/end points to loop a section
- [x] Dark/Light theme toggle with full CSS variable theming
- [x] Ear Training: Guess the chord game with scoring and streaks
- [x] Interval Recognition: Name the interval between two notes
- [x] Share progression via URL (encode chords, key, genre, tempo)
- [x] 7-string guitar chord diagrams
- [x] Enhanced PWA: offline caching of app shell, stale-while-revalidate

### v0.70
- [x] Fix Learn Songs rendering (renderLearnSongs / filterSongs)
- [x] Song Player View with lyrics, play-along, and load-to-editor
- [x] Custom chord input (add individual chords or set all at once)
- [x] Scale degree labels on chord cards (I, IV, V, vi etc.)
- [x] Music theory hints (explains why chords work together)
- [x] Visual metronome with animated beat indicator
- [x] Flash screen on downbeat
- [x] "Make it Jazzy" / "Simplify" AI chord transformation buttons

### v0.69
- [x] Learn Songs feature with 20 public domain songs

### v0.68
- [x] Time signatures (4/4, 3/4, 6/8)
- [x] Swing/shuffle slider
- [x] Piano keyboard chord visualization
- [x] Bass tab chord diagrams

### v0.67
- [x] +12 instruments (cello, viola, trumpet, trombone, flute, clarinet, sax, ukulele, banjo, harmonica, marimba, kalimba)
- [x] +7 genres (metal, punk, lofi, gospel, reggae, latin, country)
- [x] Block/Strum/Arpeggio play modes

### v0.66
- [x] 7-String Guitar
- [x] 4-String Bass
- [x] 5-String Bass
- [x] Synth Bass
- [x] Brass
- [x] Instrument categories

### v0.65
- [x] Enhanced instrument sounds (FMSynth, AMSynth)
- [x] Distinct tones per instrument

### v0.64
- [x] Reverb/Delay effects
- [x] Drag-and-drop chord reordering
- [x] WAV export
