# 🎨 Visual Cinematic Editor - Complete Guide

## 🚀 Quick Start

### Step 1: Open Builder
1. Go to: http://127.0.0.1:8000/builder.html
2. Drag a **Cinematic** template to the timeline
3. Click the template block to select it

### Step 2: Open Visual Editor
1. In the right panel, click **"🎨 Open Visual Editor"** button
2. Full-screen visual editor opens (like After Effects!)

### Step 3: Add Your Assets First!
Before using the editor, add your media files:

```
temps/
└── assets/
    ├── images/
    │   ├── backgrounds/
    │   │   ├── farm_day.png
    │   │   └── office.png
    │   ├── characters/
    │   │   ├── farmer.png
    │   │   └── collector.png
    │   └── objects/
    │       └── truck.png
    ├── audio/
    │   ├── music/
    │   │   └── theme.mp3
    │   └── sfx/
    │       └── door_open.wav
    └── fonts/
        └── (optional custom fonts)
```

### Step 4: Build Your Scene
1. **Drag assets** from left panel onto canvas
2. **Position** them by dragging
3. **Resize** using corner handles
4. **Adjust timing** in timeline at bottom
5. **Edit properties** in right panel
6. **Preview** by clicking ▶ Play button
7. **Save** when done

---

## 🎬 Interface Layout

```
┌─────────────────────────────────────────────────────────┐
│  [Undo] [Redo]  [Zoom] [Grid] [+ Add Text] [▶ Preview] │ ← Toolbar
├──────────┬──────────────────────────┬───────────────────┤
│  ASSET   │                          │    PROPERTIES     │
│ LIBRARY  │      1280x720 CANVAS     │      PANEL        │
│          │                          │                   │
│ 🖼️Images│  [Your scene shows here] │  Position X: 300  │
│ 🔊Audio  │                          │  Position Y: 200  │
│ 🔤Fonts  │  Drag assets here        │  Width: 400       │
│          │  Click to select         │  Height: 300      │
│ [Drag]   │  Drag to move            │  Opacity: 100%    │
│ [Drop]   │  Resize with handles     │  Z-Index: 5       │
│          │                          │  Start: 0ms       │
│          │                          │  Duration: 5000ms │
├──────────┴──────────────────────────┴───────────────────┤
│              TIMELINE (Layer-based)                      │
│  [━━━━━━━━━━━━━━━━━━━━━━] Playhead                     │
│  Layer 1: bg.png     [████████████████]                 │
│  Layer 2: char.png   [████████████████]                 │
│  Layer 3: dialogue   [    ██████]                       │
│  0ms    1000ms   2000ms   3000ms   4000ms   5000ms      │
└──────────────────────────────────────────────────────────┘
```

---

## 📁 How Assets Work

### Adding Assets

**1. Create folder structure:**
```bash
cd temps/assets
mkdir -p images/backgrounds images/characters images/objects
mkdir -p audio/music audio/sfx
```

**2. Drop your files:**
- PNG/JPG → `images/`
- MP3/WAV → `audio/`
- TTF/WOFF → `fonts/`

**3. In Visual Editor:**
- Click **"🔄 Refresh Assets"** button
- Assets appear in library tabs
- Drag onto canvas!

### Asset Paths Saved
When you drag `farmer.png` from the library:
```json
{
  "id": "asset_1",
  "type": "image",
  "path": "assets/images/characters/farmer.png",
  "x": 300,
  "y": 200,
  "width": 400,
  "height": 500
}
```

This path is saved in `game.json` and loaded during gameplay!

---

## 🎨 Canvas Viewport

### What You See
- **1280x720 canvas** (game resolution)
- **Grid overlay** (if enabled)
- **Your assets** positioned in real-time
- **Selection handles** when asset selected

### Controls

| Action | How |
|--------|-----|
| **Add asset** | Drag from library |
| **Select asset** | Click on it |
| **Move asset** | Drag while selected |
| **Resize** | Drag corner handles |
| **Delete** | Select + press DELETE key |
| **Deselect** | Click empty space |

### Snap to Grid
- Enable: Check "Snap to Grid" in toolbar
- Grid size: Adjust in toolbar (20px default)
- Helps align assets perfectly!

### Zoom
- Select zoom level in toolbar
- 25%, 50%, 75%, 100%, 150%, 200%
- Canvas stays 1280x720 (game size doesn't change)

---

## 🎯 Adding Different Asset Types

### 1. Background Image

**Drag image from library:**
- Place at X: 0, Y: 0
- Resize to 1280x720 (full screen)
- Set Z-Index: 0 (bottom layer)
- Duration: 0ms to scene end

**Properties:**
```
Position X: 0
Position Y: 0
Width: 1280
Height: 720
Z-Index: 0
Start Time: 0ms
Duration: 5000ms
Opacity: 100%
```

### 2. Character Sprite

**Drag character image:**
- Place at X: 200-400 (left/center/right)
- Typical size: 400x500
- Set Z-Index: 5 (above background)
- Duration: When character appears

**Example positions:**
- Left: X = 200
- Center: X = 640
- Right: X = 1080

### 3. Text / Dialogue

**Click "+ Add Text" button:**
- Auto-creates text asset
- Edit content in properties panel
- Position at bottom: Y = 600
- Center horizontally: X = 640

**Properties:**
```
Content: "Welcome to my farm!"
Font Size: 24
Font Family: Georgia
Color: #FFFFFF
Align: center
Stroke: #000000 (outline)
Stroke Thickness: 2
```

### 4. Audio / Music

**Drag audio file from library:**
- Appears in timeline (no visual on canvas)
- Set volume in properties
- Set when it starts playing
- Set duration

**Properties:**
```
Path: assets/audio/music/theme.mp3
Volume: 70% (0.7)
Start Time: 0ms (plays immediately)
Duration: 5000ms
Loop: false
```

### 5. Shapes (Optional)

**Click "+ Add Shape" button:**
- Creates rectangle/circle
- Use for dialogue boxes
- Use for overlays/masks

**Example dialogue box:**
```
Type: rectangle
X: 640 (center)
Y: 600
Width: 1200
Height: 150
Color: #000000
Opacity: 80%
Z-Index: 9 (below text)
```

---

## ⏱️ Timeline System

### Understanding Layers
Each asset gets a layer in timeline:
- **Layer name** shows asset ID
- **Color bar** shows when asset is visible
- **Position** shows start time
- **Width** shows duration

### Timeline Controls

| Button | Function |
|--------|----------|
| **▶** | Play preview |
| **■** | Stop playback |
| **Duration** | Total scene length |

### Setting Timing

**Start Time:**
- When asset appears
- 0ms = immediately
- 1000ms = after 1 second

**Duration:**
- How long asset stays visible
- Example: 5000ms = 5 seconds

**Example Timeline:**
```
Background:  [████████████████████] 0ms - 5000ms (always visible)
Character:   [████████████████████] 0ms - 5000ms (always visible)
Dialogue:    [          ██████████] 2000ms - 5000ms (appears after 2s)
Music:       [████████████████████] 0ms - 5000ms (plays throughout)
```

### Playhead
- **Green vertical line** shows current time
- **Drag** to scrub through scene
- **Play** to see animation
- Assets appear/disappear based on timing!

---

## 🔧 Properties Panel

### Common Properties (All Assets)

```
Position X:    Horizontal position (0-1280)
Position Y:    Vertical position (0-720)
Opacity:       Transparency (0-100%)
Z-Index:       Layer order (0=back, 10=front)
Start Time:    When asset appears (milliseconds)
Duration:      How long visible (milliseconds)
```

### Image-Specific

```
Width:         Image width in pixels
Height:        Image height in pixels
Rotation:      Degrees (0-360) [coming soon]
```

### Text-Specific

```
Content:       The actual text
Font Size:     Size in pixels (8-200)
Font Family:   Font name (Georgia, Arial, etc.)
Color:         Text color (#FFFFFF = white)
Align:         left, center, right
Stroke:        Outline color
Stroke Thickness: Outline width
```

### Audio-Specific

```
Path:          File path (auto-set)
Volume:        0.0 to 1.0 (0% to 100%)
Loop:          true/false [coming soon]
```

---

## 💾 How Data Is Saved

### What Gets Saved

When you click **"💾 Save Scene"**:

```javascript
template.assets = [
  {
    id: "asset_1",
    type: "image",
    path: "assets/images/backgrounds/farm.png",
    x: 0,
    y: 0,
    width: 1280,
    height: 720,
    zIndex: 0,
    startTime: 0,
    duration: 5000,
    opacity: 1.0
  },
  {
    id: "text_1",
    type: "text",
    content: "Welcome!",
    x: 640,
    y: 600,
    fontSize: 32,
    color: "#FFFFFF",
    zIndex: 10,
    startTime: 1000,
    duration: 4000
  }
]
```

### Where It's Saved

1. **While editing**: Auto-saved to template object (in memory)
2. **Click Save**: Saves to IndexedDB (browser storage)
3. **Export Game**: Saves to `game.json` file

### Export Flow

```
Visual Editor → Template Object → UnifiedBuilder → Export → game.json
```

---

## 🎮 How Game.html Uses This

### SimpleCinematicScene Reads Assets

```javascript
create() {
    const assets = this.template.assets;

    // Sort by z-index (back to front)
    assets.sort((a, b) => a.zIndex - b.zIndex);

    // Create each asset
    assets.forEach(asset => {
        if (asset.type === 'image') {
            // Load image at specified path
            const img = this.load.image(asset.id, asset.path);

            // Position it
            const sprite = this.add.image(asset.x, asset.y);
            sprite.setDisplaySize(asset.width, asset.height);
            sprite.setDepth(asset.zIndex);
            sprite.setAlpha(asset.opacity);

            // Timing
            if (asset.startTime > 0) {
                sprite.setVisible(false);
                this.time.delayedCall(asset.startTime, () => {
                    sprite.setVisible(true);
                });
            }

            // Hide after duration
            this.time.delayedCall(
                asset.startTime + asset.duration,
                () => sprite.setVisible(false)
            );
        }

        if (asset.type === 'text') {
            // Create text
            const text = this.add.text(asset.x, asset.y, asset.content, {
                fontSize: asset.fontSize + 'px',
                fontFamily: asset.fontFamily,
                color: asset.color
            });
            text.setOrigin(0.5);
            text.setDepth(asset.zIndex);

            // Apply timing
            // ...
        }

        if (asset.type === 'audio') {
            this.time.delayedCall(asset.startTime, () => {
                this.sound.play(asset.path, {
                    volume: asset.volume
                });
            });
        }
    });
}
```

**Result:** Your scene plays EXACTLY as you built it!

---

## 🎬 Example: Building a Complete Scene

### Goal: Intro Cutscene

**Assets needed:**
- `farm_morning.png` (background)
- `farmer.png` (character)
- `theme.mp3` (music)

### Steps:

#### 1. Add Background
- Drag `farm_morning.png` onto canvas
- Position: X=0, Y=0
- Resize: 1280x720
- Z-Index: 0
- Start: 0ms, Duration: 8000ms

#### 2. Add Character
- Drag `farmer.png` onto canvas
- Position: X=300, Y=150
- Keep size: 400x500
- Z-Index: 5
- Start: 0ms, Duration: 8000ms

#### 3. Add Dialogue
- Click "+ Add Text"
- Content: "Another day on the farm..."
- Position: X=640, Y=600
- Font Size: 28
- Color: #FFFFFF
- Z-Index: 10
- Start: 2000ms (appears after 2 seconds)
- Duration: 6000ms

#### 4. Add Music
- Drag `theme.mp3` from audio tab
- Volume: 0.7 (70%)
- Start: 0ms
- Duration: 8000ms

#### 5. Preview
- Click **▶ Play** in timeline
- Watch scene play with timing
- Adjust as needed

#### 6. Save
- Click **"💾 Save Scene"**
- Close visual editor
- Click **"📦 Export Game"** in builder
- Save `game.json`

#### 7. Play
- Open `game.html`
- Watch your cutscene! 🎬

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Delete** | Remove selected asset |
| **Ctrl+D** | Duplicate selected asset (coming soon) |
| **Ctrl+Z** | Undo (coming soon) |
| **Ctrl+Y** | Redo (coming soon) |
| **Space** | Pan canvas (coming soon) |

---

## 🎯 Z-Index Layer Guide

Use this as a guide for layering:

```
Z-Index 0:   Background images
Z-Index 1:   Background decorations
Z-Index 2:   Mid-ground objects
Z-Index 5:   Characters
Z-Index 8:   Foreground objects
Z-Index 9:   Dialogue box backgrounds
Z-Index 10:  Text and UI elements
Z-Index 15:  Special effects
```

---

## 🔄 Workflow Example

### Complete Workflow: From Assets to Playable Game

```
1. Add Assets
   └─ Copy farm.png to assets/images/backgrounds/
   └─ Copy farmer.png to assets/images/characters/
   └─ Copy theme.mp3 to assets/audio/music/

2. Open Builder (builder.html)
   └─ Drag Cinematic template
   └─ Click template block

3. Open Visual Editor
   └─ Click "🎨 Open Visual Editor" button
   └─ Click "🔄 Refresh Assets"

4. Build Scene
   └─ Drag farm.png → Position at (0,0), size 1280x720
   └─ Drag farmer.png → Position at (300,200)
   └─ Add Text → "Welcome!" at (640,600)
   └─ Drag theme.mp3 → Set volume 70%

5. Set Timing
   └─ Background: 0ms - 6000ms
   └─ Character: 0ms - 6000ms
   └─ Text: 1000ms - 6000ms (appears after 1s)
   └─ Music: 0ms - 6000ms

6. Preview
   └─ Click ▶ Play
   └─ Watch scene play
   └─ Adjust timing/positions as needed

7. Save & Close
   └─ Click "💾 Save Scene"
   └─ Click "✕ Close Visual Editor"

8. Export
   └─ Click "📦 Export Game" in builder
   └─ Save as game.json in root folder

9. Play
   └─ Open game.html
   └─ Hard refresh (Ctrl+Shift+R)
   └─ Watch your scene play! 🎉
```

---

## 🐛 Troubleshooting

### Assets not showing in library
- Make sure files are in `assets/` folder
- Click "🔄 Refresh Assets" button
- Check console (F12) for errors

### Can't drag assets
- Make sure you're clicking and holding
- Cursor should change to "grabbing"
- Drop only works on canvas area

### Asset disappeared
- Check timeline - might be outside current playhead time
- Check opacity - might be set to 0%
- Check z-index - might be behind other assets

### Preview not working
- Make sure total duration is set (default 5000ms)
- Check console for errors
- Make sure at least one asset exists

### Changes not saved in game
- Did you click "💾 Save Scene" in visual editor?
- Did you click "📦 Export Game" in builder?
- Did you save game.json to root folder?
- Did you hard refresh (Ctrl+Shift+R) game.html?

---

## 🎨 Tips & Best Practices

### Performance
- Keep scenes under 10-15 assets for best performance
- Use compressed images (PNG/JPG optimized)
- Keep audio files small (MP3 < 5MB)

### Organization
- Name assets clearly: `bg_farm_day.png` not `image1.png`
- Group related assets in subfolders
- Use consistent naming convention

### Timing
- Start with round numbers: 0ms, 1000ms, 2000ms
- Typical dialogue: 3000-5000ms per line
- Background music: Match scene duration

### Layering
- Always set background to Z-Index: 0
- Characters typically Z-Index: 5
- UI/text typically Z-Index: 10
- Use gaps (0, 5, 10) so you can insert layers later

### Testing
- Preview frequently while building
- Test in actual game (export + play)
- Test on different browsers
- Clear cache if seeing old versions

---

## 📊 Data Structure Reference

### Complete Asset Schema

```typescript
interface Asset {
  // Required
  id: string;              // Unique ID: "asset_1", "text_1", etc.
  type: 'image' | 'text' | 'audio' | 'shape';
  zIndex: number;          // Layer order
  startTime: number;       // When asset appears (ms)
  duration: number;        // How long visible (ms)
  opacity: number;         // 0.0 to 1.0

  // Position (images, text, shapes)
  x?: number;              // X coordinate
  y?: number;              // Y coordinate

  // Size (images, shapes)
  width?: number;
  height?: number;

  // Image-specific
  path?: string;           // "assets/images/..."
  rotation?: number;       // Degrees

  // Text-specific
  content?: string;        // The text
  fontSize?: number;       // Size in px
  fontFamily?: string;     // Font name
  color?: string;          // Hex color
  align?: 'left' | 'center' | 'right';
  stroke?: string;         // Outline color
  strokeThickness?: number; // Outline width

  // Audio-specific
  volume?: number;         // 0.0 to 1.0
  loop?: boolean;

  // Shape-specific
  shapeType?: 'rectangle' | 'circle';
}
```

---

## 🚀 What's Next?

Future enhancements planned:
- ✅ Drag & drop assets (DONE)
- ✅ Timeline with playback (DONE)
- ✅ Real-time preview (DONE)
- ⏳ Keyframe animations (position, opacity, scale)
- ⏳ Asset rotation controls
- ⏳ Copy/paste/duplicate assets
- ⏳ Multi-select assets
- ⏳ Undo/Redo history
- ⏳ Asset templates library
- ⏳ Audio waveform visualization
- ⏳ Export as video preview

---

## ✅ Summary

**You now have:**
- Full visual editor for cinematics
- Drag & drop asset management
- Real-time canvas preview
- Timeline-based sequencing
- Property editing
- Export to playable game

**Build cinematic scenes like a pro!** 🎬

For more info, see:
- `ASSET_SYSTEM_EXPLAINED.md` - Deep dive into data flow
- `HOW_TO_USE.md` - General builder guide
- `TEST_GAMEPLAY_NOW.md` - Gameplay testing guide
