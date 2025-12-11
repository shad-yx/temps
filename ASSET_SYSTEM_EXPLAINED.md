# 🎨 Asset System & Cinematic Editor - How It Works

## 📁 Folder Structure

```
temps/
├── assets/
│   ├── images/          ← Drop your PNG, JPG files here
│   │   ├── backgrounds/
│   │   ├── characters/
│   │   └── objects/
│   ├── audio/           ← Drop your MP3, WAV files here
│   │   ├── music/
│   │   ├── sfx/
│   │   └── voice/
│   └── fonts/           ← Drop your TTF, WOFF files here
├── builder.html         ← Your game builder
├── game.html            ← Your game player
└── game.json            ← Exported game data
```

---

## 🎬 How Cinematic Editor Works

### 1. Asset Library (Left Panel)
- **Browse** all your assets from `assets/` folder
- **Filter** by type: images, audio, fonts
- **Drag** any asset onto the viewport canvas

### 2. Visual Viewport (Center)
- **1280x720** canvas showing your scene
- **Drag assets** to position them
- **Resize** with handles (corners)
- **Rotate** if needed
- **Real-time preview** of what players will see

### 3. Timeline (Bottom)
- **Asset layers** stacked (like Photoshop layers)
- **Duration bars** showing when asset appears/disappears
- **Playhead** to scrub through time
- **Keyframes** for animations (optional)

### 4. Properties Panel (Right)
- **Position**: X, Y coordinates
- **Size**: Width, Height
- **Rotation**: Degrees
- **Opacity**: 0-100%
- **Timing**: Start time, Duration
- **Z-Index**: Layer order (front/back)

---

## 💾 How Data Gets Saved

### Builder → Export

When you click **"Export Game"**, the system saves to `game.json`:

```json
{
  "name": "My Game",
  "sequence": [
    {
      "type": "cinematic",
      "name": "Intro Scene",
      "duration": 5000,
      "assets": [
        {
          "id": "bg_1",
          "type": "image",
          "path": "assets/images/backgrounds/farm.png",
          "x": 0,
          "y": 0,
          "width": 1280,
          "height": 720,
          "zIndex": 0,
          "startTime": 0,
          "duration": 5000
        },
        {
          "id": "char_1",
          "type": "image",
          "path": "assets/images/characters/farmer.png",
          "x": 200,
          "y": 150,
          "width": 400,
          "height": 500,
          "zIndex": 1,
          "startTime": 0,
          "duration": 5000
        },
        {
          "id": "dialogue_1",
          "type": "text",
          "content": "Welcome to my farm!",
          "x": 640,
          "y": 600,
          "fontSize": 24,
          "color": "#FFFFFF",
          "zIndex": 2,
          "startTime": 1000,
          "duration": 4000
        },
        {
          "id": "music_1",
          "type": "audio",
          "path": "assets/audio/music/intro.mp3",
          "startTime": 0,
          "duration": 5000,
          "volume": 0.7
        }
      ]
    }
  ]
}
```

---

## 🎮 How Game Plays It

### Game.html Loads game.json

1. **Reads** the sequence array
2. For each **cinematic template**:
   - Creates Phaser scene
   - Loads all asset paths
   - Positions assets at X, Y coordinates
   - Sets z-index for layering
   - Plays audio at specified times
   - Shows text with timing

3. **Timeline Player**:
   - Starts at time 0ms
   - At 0ms: Show background + character
   - At 1000ms: Show dialogue text
   - At 5000ms: End scene, move to next template

---

## 🔄 Complete Workflow

### Step 1: Add Assets
```
1. Create folders in assets/
2. Drag/drop your images → assets/images/
3. Drag/drop your audio → assets/audio/
4. Drag/drop your fonts → assets/fonts/
```

### Step 2: Build Scene in Editor
```
1. Open builder.html
2. Drag CINEMATIC template to timeline
3. Click to open visual editor
4. From asset library (left), drag assets onto canvas:
   - Background image → position at (0, 0)
   - Character image → position at (200, 150)
   - Text box → position at (640, 600)
5. Adjust timing in timeline:
   - Background: 0s - 5s
   - Character: 0s - 5s
   - Dialogue: 1s - 5s
6. Preview by clicking PLAY button
7. Save when done
```

### Step 3: Export
```
1. Click "📦 Export Game"
2. Saves game.json with:
   - All asset paths
   - All positions (x, y)
   - All timings (startTime, duration)
   - All properties (size, color, etc.)
```

### Step 4: Play
```
1. Open game.html
2. Hard refresh (Ctrl+Shift+R)
3. Game reads game.json
4. SimpleCinematicScene:
   - Loads asset at "assets/images/backgrounds/farm.png"
   - Places at x: 0, y: 0
   - Shows for 5000ms
   - Loads character at x: 200, y: 150
   - Shows dialogue at x: 640, y: 600 after 1000ms
   - Plays audio
   - Auto-advances after total duration
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────┐
│                 BUILDER.HTML                     │
│                                                  │
│  ┌───────────────┐  ┌──────────────────────┐   │
│  │ Asset Library │  │   Visual Viewport    │   │
│  │ (Left Panel)  │  │   (1280x720 Canvas)  │   │
│  │               │  │                      │   │
│  │ 📁 Images     │  │  [Background Image]  │   │
│  │ 📁 Audio      │  │  [Character Sprite]  │   │
│  │ 📁 Fonts      │◄─┼─ Drag & Drop ──────►│   │
│  └───────────────┘  │  [Text Box]         │   │
│                     └──────────────────────┘   │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │           Timeline (Bottom)               │  │
│  │  Layer 1: bg.png     [████████████████]  │  │
│  │  Layer 2: char.png   [████████████████]  │  │
│  │  Layer 3: dialogue   [    ██████████  ]  │  │
│  │                      0s   2s   4s   6s   │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  [📦 Export Game] ────────────────┐             │
└───────────────────────────────────┼─────────────┘
                                    │
                                    ▼
                            ┌───────────────┐
                            │  game.json    │
                            │               │
                            │ {             │
                            │   sequence: [ │
                            │     {         │
                            │       assets: [│
                            │         {...} │
                            │       ]       │
                            │     }         │
                            │   ]           │
                            │ }             │
                            └───────┬───────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────┐
│                  GAME.HTML                       │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │    SimpleCinematicScene (Phaser)         │  │
│  │                                           │  │
│  │  1. Read game.json                       │  │
│  │  2. Load assets from paths               │  │
│  │  3. Create sprites at X,Y positions      │  │
│  │  4. Set z-index for layers               │  │
│  │  5. Play timeline:                       │  │
│  │     - 0ms: Show bg + character           │  │
│  │     - 1000ms: Show dialogue              │  │
│  │     - 5000ms: End scene                  │  │
│  │                                           │  │
│  │  [Rendered Game Scene]                   │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  Player sees: Background + Character + Text     │
│  Player hears: Music playing                    │
│  After duration: Moves to next template         │
└─────────────────────────────────────────────────┘
```

---

## 🎨 Visual Editor Features

### Canvas Viewport
- **Grid overlay** for alignment
- **Rulers** for pixel-perfect positioning
- **Snap to grid** option
- **Zoom** in/out (25%, 50%, 100%, 200%)
- **Pan** by holding spacebar

### Asset Manipulation
- **Click** to select asset
- **Drag** to move
- **Corner handles** to resize
- **Rotation handle** at top
- **Delete** key to remove
- **Duplicate** with Ctrl+D

### Timeline Controls
- **Playhead** - Scrub to any time
- **Play/Pause** button
- **Loop** toggle
- **Speed** control (0.5x, 1x, 2x)
- **Add keyframe** for animations

### Layer System
```
Z-Index:
  10 - UI elements (dialogue boxes)
  5  - Characters
  2  - Mid-ground objects
  1  - Foreground decorations
  0  - Background image
```

---

## 🎯 Example: Building a Scene

### Goal: Create farm intro scene

#### 1. Add Background
- Drag `farm_day.png` from asset library
- Place at (0, 0)
- Resize to 1280x720
- Z-index: 0
- Duration: 0s - 8s

#### 2. Add Character
- Drag `farmer.png`
- Place at (300, 200)
- Size: 400x500
- Z-index: 5
- Duration: 0s - 8s

#### 3. Add Dialogue Box
- Click "Add Text" button
- Type: "Welcome to my farm!"
- Place at (640, 600) - centered at bottom
- Font: 24px Georgia
- Z-index: 10
- Duration: 2s - 8s (appears after 2 seconds)

#### 4. Add Music
- Drag `farm_theme.mp3`
- Volume: 70%
- Duration: 0s - 8s

#### 5. Preview
- Click PLAY in timeline
- Watch scene play in viewport
- Adjust timings as needed

#### 6. Export
- Click "Export Game"
- game.json saves all data

#### 7. Play
- Open game.html
- Scene plays exactly as built!

---

## 📦 What Gets Saved Per Asset

### Image Asset
```json
{
  "id": "asset_123",
  "type": "image",
  "path": "assets/images/characters/farmer.png",
  "x": 300,
  "y": 200,
  "width": 400,
  "height": 500,
  "rotation": 0,
  "opacity": 1.0,
  "zIndex": 5,
  "startTime": 0,
  "duration": 8000
}
```

### Text Asset
```json
{
  "id": "text_456",
  "type": "text",
  "content": "Welcome to my farm!",
  "x": 640,
  "y": 600,
  "fontSize": 24,
  "fontFamily": "Georgia",
  "color": "#FFFFFF",
  "align": "center",
  "zIndex": 10,
  "startTime": 2000,
  "duration": 6000
}
```

### Audio Asset
```json
{
  "id": "audio_789",
  "type": "audio",
  "path": "assets/audio/music/farm_theme.mp3",
  "volume": 0.7,
  "loop": false,
  "startTime": 0,
  "duration": 8000
}
```

---

## 🎮 How SimpleCinematicScene Uses This

```javascript
create() {
    // Read template.assets array
    const assets = this.template.assets;

    // Sort by z-index
    assets.sort((a, b) => a.zIndex - b.zIndex);

    // Create each asset
    assets.forEach(asset => {
        if (asset.type === 'image') {
            // Load and display image
            const img = this.add.image(asset.x, asset.y, asset.path);
            img.setDisplaySize(asset.width, asset.height);
            img.setDepth(asset.zIndex);
            img.setAlpha(asset.opacity);
            img.setRotation(asset.rotation);

            // Schedule visibility
            if (asset.startTime > 0) {
                img.setVisible(false);
                this.time.delayedCall(asset.startTime, () => {
                    img.setVisible(true);
                });
            }

            // Schedule hide
            this.time.delayedCall(asset.startTime + asset.duration, () => {
                img.setVisible(false);
            });
        }

        if (asset.type === 'text') {
            // Create text
            const text = this.add.text(asset.x, asset.y, asset.content, {
                fontSize: asset.fontSize + 'px',
                fontFamily: asset.fontFamily,
                color: asset.color,
                align: asset.align
            });
            text.setOrigin(0.5);
            text.setDepth(asset.zIndex);

            // Timing
            if (asset.startTime > 0) {
                text.setVisible(false);
                this.time.delayedCall(asset.startTime, () => {
                    text.setVisible(true);
                });
            }
        }

        if (asset.type === 'audio') {
            // Play audio at specified time
            this.time.delayedCall(asset.startTime, () => {
                this.sound.play(asset.path, {
                    volume: asset.volume,
                    loop: asset.loop
                });
            });
        }
    });

    // Total scene duration
    const totalDuration = this.template.duration || 5000;
    this.time.delayedCall(totalDuration, () => {
        this.onComplete();
    });
}
```

---

## 🔄 Interactive Workflow

### Real-time Editing
1. **Drag asset** in viewport
2. System **auto-saves** position to template
3. **Preview** shows updated position
4. **No export needed** for preview
5. **Export** when ready to play in game

### Live Preview
- Click **PLAY** button
- Viewport plays scene with timing
- See exactly what players will see
- **Pause** at any time to adjust
- **Scrub** timeline to jump to specific moment

---

## 🎯 Summary

### Where Assets Live
- **Physical files**: `assets/` folder
- **Asset paths**: Saved in `game.json`
- **Actual images/audio**: Loaded from paths during gameplay

### Where Data Lives
- **Builder state**: Browser IndexedDB (auto-save while editing)
- **Exported game**: `game.json` file
- **Player state**: Loaded from `game.json` into Phaser scenes

### How It Connects
1. **You**: Drag `farmer.png` into assets folder
2. **Builder**: Shows in asset library
3. **You**: Drag onto viewport, position at (300, 200)
4. **Builder**: Saves to template: `{path: "assets/images/farmer.png", x: 300, y: 200}`
5. **Export**: Writes to game.json
6. **Game**: Reads game.json, loads farmer.png, displays at (300, 200)

### Control You Have
- **Full control** over position (X, Y)
- **Full control** over size (Width, Height)
- **Full control** over timing (Start, Duration)
- **Full control** over layering (Z-index)
- **Full control** over appearance (Opacity, Rotation, Color)

### What's Automatic
- Asset loading/preloading
- Timeline playback
- Scene transitions
- Memory cleanup

---

## 🚀 Next: Implementation

I'll now build:
1. **Asset browser** with folder structure
2. **Visual viewport** with drag/drop canvas
3. **Timeline editor** with layer controls
4. **Properties panel** for fine-tuning
5. **Real-time preview** system
6. **Updated SimpleCinematicScene** to render all this

Ready to build! 🎨
