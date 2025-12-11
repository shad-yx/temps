# 📁 Assets Folder

## Folder Structure

```
assets/
├── images/
│   ├── backgrounds/     ← Full-screen background images (1280x720)
│   ├── characters/      ← Character sprites
│   └── objects/         ← Props, items, decorations
├── audio/
│   ├── music/           ← Background music tracks
│   └── sfx/             ← Sound effects
└── fonts/               ← Custom font files (optional)
```

## How to Add Assets

### 1. Images
**Drag and drop your PNG/JPG files into:**
- `images/backgrounds/` - Full-screen backgrounds
- `images/characters/` - Character sprites
- `images/objects/` - Props and decorations

**Recommended sizes:**
- Backgrounds: 1280x720 (or larger, will be scaled)
- Characters: 400x500 typical
- Objects: Varies

### 2. Audio
**Drag and drop your MP3/WAV files into:**
- `audio/music/` - Background music
- `audio/sfx/` - Sound effects

**Recommended:**
- Format: MP3 or WAV
- Size: < 5MB per file
- Sample rate: 44100 Hz

### 3. Fonts (Optional)
**Drag and drop TTF/WOFF files into:**
- `fonts/` - Custom fonts

**Note:** Web-safe fonts (Georgia, Arial, etc.) work automatically without files.

## Usage in Visual Editor

1. Open Visual Cinematic Editor
2. Click **"🔄 Refresh Assets"** button
3. Switch between tabs: Images / Audio / Fonts
4. **Drag assets onto canvas** to use them!

## Asset Naming Tips

**Good names:**
- `bg_farm_morning.png`
- `char_farmer_talking.png`
- `music_intro_theme.mp3`

**Bad names:**
- `image1.png`
- `untitled.mp3`
- `pic.jpg`

## Example Assets

This folder structure is ready for your custom assets!

**Example workflow:**
1. Create/find your farm background image → Save as `farm_day.png`
2. Copy to `assets/images/backgrounds/farm_day.png`
3. Open Visual Editor → Refresh Assets → Drag onto canvas!

## File Paths in game.json

When you export, paths are saved like:
```json
{
  "path": "assets/images/backgrounds/farm_day.png"
}
```

These paths are loaded by game.html during gameplay.

## Important Notes

- ✅ All paths are relative to the root `temps` folder
- ✅ Subfolders help organize assets
- ✅ Assets are loaded on-demand during gameplay
- ⚠️ Large files (>10MB) may slow loading
- ⚠️ Use compressed formats (optimized PNG/JPG, MP3)

## Quick Start

**Don't have assets yet?**
1. Start with placeholder colors/shapes
2. Use "+ Add Text" and "+ Add Shape" buttons in Visual Editor
3. Build your scene layout first
4. Replace placeholders with real assets later

**Ready to start!** 🎨
