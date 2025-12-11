# DEADDAY - Asset Reference

This file lists all placeholder assets used by the Unified Builder.

## Backgrounds

### Farm Backgrounds (Progression)
- **farm_normal.png** - Normal farm, sunny day
  - Size: 1280x720
  - Colors: Green (#4CAF50), Brown (#8D6E63)
  - Use: Starting state, toxicity 0-29

- **farm_toxic1.png** - Slightly toxic farm
  - Size: 1280x720
  - Colors: Yellow-green (#9CCC65), Dead grass (#795548)
  - Use: Toxicity 30-59

- **farm_toxic2.png** - Moderately toxic farm
  - Size: 1280x720
  - Colors: Yellowish (#FDD835), Brown decay (#5D4037)
  - Use: Toxicity 60-89

- **farm_toxic3.png** - Heavily toxic farm
  - Size: 1280x720
  - Colors: Dead yellow (#F9A825), Black decay (#212121)
  - Use: Toxicity 90+

### Interior Backgrounds
- **office.png** - Office interior for debt collection
  - Size: 1280x720
  - Colors: Gray walls (#616161), Wood desk (#6D4C41)

- **night.png** - Night scene exterior
  - Size: 1280x720
  - Colors: Dark blue (#1A237E), Black shadows (#000000)

## Characters

### Main Characters
- **protagonist.png** - Player character
  - Size: 400x800
  - Style: Silhouette or simple sprite
  - Position: Left/Center/Right

- **collector.png** - Debt collector character
  - Size: 400x800
  - Style: Intimidating figure
  - Expression: Neutral threatening

- **stranger.png** - Generic NPC
  - Size: 400x800
  - Style: Mysterious figure

## Props
(Not currently used, but available for future cinematics)

## Audio

### Music Tracks
- **intro_theme.mp3** - Opening theme
  - Style: Somber, atmospheric
  - Duration: 60-90 seconds

- **gameplay_ambient.mp3** - Gameplay background
  - Style: Tense, repetitive
  - Duration: 3-5 minutes (loopable)

- **tension.mp3** - Debt collection scene
  - Style: Threatening, uncomfortable
  - Duration: 60 seconds

- **ending.mp3** - Ending theme
  - Style: Melancholic or hopeful
  - Duration: 60-90 seconds

## UI Elements
(Currently using Phaser's built-in rendering)

---

## How to Replace Placeholders

1. Create your asset files with the exact filenames listed above
2. Place them in the appropriate subfolder:
   - `assets/backgrounds/` for backgrounds
   - `assets/characters/` for characters
   - `assets/props/` for props
   - `assets/audio/` for music/sound

3. The Unified Builder will automatically use your assets

4. Recommended formats:
   - Images: PNG with transparency
   - Audio: MP3 or OGG

---

## Quick Placeholder Creation

### Option 1: Use solid colors in Photoshop/GIMP
1. Create 1280x720 canvas
2. Fill with gradient or solid color
3. Add text label
4. Export as PNG

### Option 2: Use online tools
- placekitten.com
- placeholder.com
- Any image editor

### Option 3: Use existing game art
- Grab screenshots from reference games
- Use free asset packs (OpenGameArt, itch.io)

---

## Current Game Flow Example

```
1. Cinematic (Intro)
   - Background: farm_normal.png
   - Character: protagonist.png
   - Dialogue: "This is it... my new farm."
   - Music: intro_theme.mp3

2. Gameplay (Farm Cycle 1)
   - Background starts: farm_normal.png
   - Changes to: farm_toxic1.png (when toxicity > 30)
   - Duration: 60 seconds
   - Grid: 5x5 animal placements

3. Collection (Week 1 Payment)
   - Background: office.png
   - Character: collector.png
   - Debt: $100
   - Music: tension.mp3

4. Cinematic (Week 1 End)
   - Background: night.png
   - Dialogue: "I made it through... but at what cost?"

5. Gameplay (Farm Cycle 2)
   - Background starts: farm_toxic1.png
   - Changes to: farm_toxic2.png
   - Duration: 60 seconds

... and so on
```

---

## Asset Optimization Tips

- Keep background images under 500KB for web performance
- Use compressed audio (MP3 at 128kbps is fine)
- Characters with transparency work best
- Consider 2x versions for high-DPI displays

