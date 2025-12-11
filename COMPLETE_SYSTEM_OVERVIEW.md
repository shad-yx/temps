# 🎮 DEADDAY - Complete System Overview

## 🎯 What You Have Now

A complete game creation system with **TWO separate apps**:

1. **Builder** ([builder.html](http://127.0.0.1:8000/builder.html)) - Create games with templates
2. **Game** ([game.html](http://127.0.0.1:8000/game.html)) - Play exported games

---

## 📦 Project Structure

```
temps/
├── builder.html                  ← Game creation tool
├── game.html                     ← Game player
├── game.json                     ← Exported game data
├── assets/                       ← Your media files
│   ├── images/                   ← Images (backgrounds, characters, objects)
│   ├── audio/                    ← Audio (music, sfx)
│   └── fonts/                    ← Custom fonts
├── editor/
│   ├── UnifiedBuilder.js         ← Main builder logic
│   ├── VisualCinematicEditor.js  ← Visual editor for cinematics
│   └── editor.css                ← Styles
├── src/
│   ├── scenes/
│   │   ├── SimpleCinematicScene.js   ← Plays cinematic templates
│   │   ├── SimpleGameplayScene.js    ← Plays gameplay templates (FULL mechanics!)
│   │   └── SimpleCollectionScene.js  ← Plays collection templates
│   ├── systems/                  ← Game systems (FarmManager, AnimalManager, etc.)
│   ├── entities/                 ← Game objects (Crop, Animal, Dog, etc.)
│   └── ui/                       ← UI components (HUD, ModeToggle, StatsPanel)
└── Documentation:
    ├── ASSET_SYSTEM_EXPLAINED.md     ← How assets work
    ├── VISUAL_EDITOR_GUIDE.md        ← Visual editor guide
    ├── GAMEPLAY_FIXED.md             ← Gameplay mechanics restored
    ├── TEST_GAMEPLAY_NOW.md          ← Testing guide
    └── HOW_TO_USE.md                 ← General workflow
```

---

## 🔄 Complete Workflow

### 1. Setup Assets
```
├── Drop your images in assets/images/
├── Drop your audio in assets/audio/
└── Drop your fonts in assets/fonts/
```

### 2. Build Game in Builder
```
Open builder.html
├── Drag templates to timeline (Cinematic, Gameplay, Collection)
├── Click template to edit
├── For Cinematics: Click "🎨 Open Visual Editor"
│   ├── Drag assets onto canvas
│   ├── Position and resize
│   ├── Set timing in timeline
│   └── Save scene
└── Export game.json
```

### 3. Play Game
```
Open game.html
├── Loads game.json
├── Plays your sequence
│   ├── SimpleCinematicScene executes cinematic templates
│   ├── SimpleGameplayScene executes gameplay templates
│   └── SimpleCollectionScene executes collection templates
└── Shows your game!
```

---

## 🎬 Template Types

### 1. Cinematic Templates
**What:** Visual novel scenes with dialogue, characters, backgrounds

**Editor:**
- **Quick Form** - Simple dropdown menus
- **Visual Editor** - Drag & drop canvas (like After Effects!)

**Visual Editor Features:**
- ✅ 1280x720 canvas viewport
- ✅ Drag assets from library onto canvas
- ✅ Position, resize, layer assets
- ✅ Timeline with timing controls
- ✅ Real-time preview
- ✅ Properties panel for fine-tuning

**How It Plays:**
```javascript
SimpleCinematicScene:
├── Loads all assets from template.assets array
├── Creates sprites at X,Y positions
├── Applies z-index for layering
├── Shows/hides based on startTime and duration
├── Plays audio at specified times
└── Auto-advances after total duration
```

**Data Saved:**
```json
{
  "type": "cinematic",
  "name": "Intro",
  "duration": 5000,
  "assets": [
    {
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
      "type": "text",
      "content": "Welcome!",
      "x": 640,
      "y": 600,
      "fontSize": 32,
      "zIndex": 10,
      "startTime": 1000,
      "duration": 4000
    }
  ]
}
```

### 2. Gameplay Templates
**What:** Farm simulation with full mechanics

**Editor:** Form-based with grid size, duration, toxicity settings

**How It Plays:**
```javascript
SimpleGameplayScene:
├── Initializes ALL game systems:
│   ├── FarmManager (grid, crops)
│   ├── AnimalManager (enclosures, production)
│   ├── SerumManager (toxicity spray)
│   ├── InputManager (drag, click)
│   ├── DebtManager (cash, debt)
│   ├── TruckManager (sales)
│   ├── HUD (UI displays)
│   ├── ModeToggle (mode switching)
│   ├── StatsPanel (statistics)
│   └── Dog (draggable helper)
├── Reads template.gridRows, template.gridCols
├── Creates interactive farm grid
├── Countdown timer from template.duration
└── Auto-completes when time expires
```

**Gameplay Features:**
- ✅ Plant crops on tiles
- ✅ Crops grow over time
- ✅ Harvest for cash
- ✅ Animal enclosures
- ✅ Animal production (eggs, milk)
- ✅ Toxicity spray mechanics
- ✅ Drag dog around
- ✅ Mode toggle (plant/spray)
- ✅ Full HUD with cash/toxicity
- ✅ All interactions working!

**Data Saved:**
```json
{
  "type": "gameplay",
  "name": "Farm Day 1",
  "duration": 30000,
  "gridRows": 5,
  "gridCols": 5,
  "backgroundStart": "farm_normal",
  "backgroundNext": "farm_toxic1",
  "toxicityThreshold": 30
}
```

### 3. Collection Templates
**What:** Debt payment scenes

**Editor:** Form-based with debt amount, dialogue

**How It Plays:**
```javascript
SimpleCollectionScene:
├── Shows debt amount (big $$ display)
├── Shows dialogue
├── Shows character placeholder
├── Creates "PAY DEBT" button
├── Auto-pays after 5 seconds OR on click
└── Transitions to next template
```

**Data Saved:**
```json
{
  "type": "collection",
  "name": "First Payment",
  "debtAmount": 50,
  "dialogue": "Time to pay up!",
  "character": "collector.png",
  "background": "office"
}
```

---

## 💾 Data Flow

### From Builder to Game

```
┌─────────────────────────────────────────────────────┐
│                  BUILDER.HTML                        │
│                                                      │
│  UnifiedBuilder                                     │
│  ├── Drag templates to sequence[]                  │
│  ├── Edit in form editors                          │
│  ├── Edit cinematics in VisualCinematicEditor      │
│  └── Store in IndexedDB (auto-save)                │
│                                                      │
│  [📦 Export Game Button]                           │
│  └── Creates game.json:                            │
│      {                                              │
│        "name": "My Game",                          │
│        "sequence": [                               │
│          { type: "cinematic", assets: [...] },    │
│          { type: "gameplay", gridRows: 5 },       │
│          { type: "collection", debtAmount: 50 }   │
│        ]                                            │
│      }                                              │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
              ┌───────────────┐
              │  game.json    │ ← You save this to root folder
              └───────┬───────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│                   GAME.HTML                          │
│                                                      │
│  GamePlayer Scene                                   │
│  ├── Loads game.json (priority 1)                  │
│  ├── OR localStorage (priority 2)                  │
│  ├── OR default.json (priority 3)                  │
│  └── Plays sequence:                                │
│                                                      │
│  For each template in sequence:                     │
│  ├── if (type === 'cinematic')                     │
│  │   └── Start SimpleCinematicScene                │
│  │       ├── Load assets from template.assets[]    │
│  │       ├── Create sprites at X,Y positions       │
│  │       ├── Apply timing (startTime, duration)    │
│  │       └── Auto-advance when done                │
│  │                                                   │
│  ├── if (type === 'gameplay')                      │
│  │   └── Start SimpleGameplayScene                 │
│  │       ├── Initialize ALL game systems           │
│  │       ├── Create farm grid (template.gridRows)  │
│  │       ├── Show countdown (template.duration)    │
│  │       ├── Enable ALL interactions               │
│  │       └── Complete after duration               │
│  │                                                   │
│  └── if (type === 'collection')                    │
│      └── Start SimpleCollectionScene               │
│          ├── Show debt (template.debtAmount)       │
│          ├── Show dialogue                          │
│          ├── Create PAY button                      │
│          └── Advance on payment                     │
│                                                      │
│  After all templates: Show "THE END"               │
└─────────────────────────────────────────────────────┘
```

---

## 🎨 Visual Cinematic Editor

### Interface

```
┌──────────────────────────────────────────────────────────┐
│  [Undo] [Redo]  [Zoom: 100%]  [Grid ☑]  [+ Text] [Save] │
├──────────┬───────────────────────────┬───────────────────┤
│  ASSETS  │      CANVAS (1280x720)    │    PROPERTIES     │
│          │                           │                   │
│ 🖼️Images│  ┌──────────────────────┐ │  Asset: text_1    │
│ ─────────│  │                      │ │  ───────────────  │
│ farm.png │  │  [Your scene here]   │ │  X: 640           │
│ char.png │  │                      │ │  Y: 600           │
│          │  │  Drag assets here    │ │  Font: 32px       │
│ 🔊Audio  │  │  Click to select     │ │  Color: #FFF      │
│ ─────────│  │  Drag to move        │ │  Start: 1000ms    │
│ theme.mp3│  │                      │ │  Duration: 4000ms │
│          │  └──────────────────────┘ │  Z-Index: 10      │
│          │                           │                   │
├──────────┴───────────────────────────┴───────────────────┤
│              TIMELINE                                     │
│  ┃<─── Playhead                                          │
│  Layer 1: bg.png      [████████████████]                 │
│  Layer 2: character   [████████████████]                 │
│  Layer 3: dialogue    [      ██████████]                 │
│  0ms   1000ms   2000ms   3000ms   4000ms   5000ms        │
└──────────────────────────────────────────────────────────┘
```

### Features

- ✅ **Asset Library** - Browse images/audio/fonts from assets/ folder
- ✅ **Drag & Drop** - Drag assets from library onto canvas
- ✅ **Canvas Viewport** - 1280x720 real-time preview
- ✅ **Selection** - Click assets to select, drag to move
- ✅ **Properties Panel** - Edit position, size, timing, appearance
- ✅ **Timeline** - Layer-based timeline with playback
- ✅ **Preview** - Play button to see scene with timing
- ✅ **Grid Snap** - Snap to grid for perfect alignment
- ✅ **Zoom** - 25% to 200% zoom levels
- ✅ **Add Text** - Create text assets directly
- ✅ **Add Shapes** - Create shape assets for dialogue boxes

---

## 🎮 Gameplay Systems

### All Systems Working in SimpleGameplayScene

```javascript
// Initialized in create()
this.farmManager = new FarmManager(this);      // Grid, tiles, crops
this.debtManager = new DebtManager(this);      // Cash, debt
this.inputManager = new InputManager(this);    // Interactions
this.serumManager = new SerumManager(this);    // Toxicity
this.animalManager = new AnimalManager(this);  // Animals
this.truckManager = new TruckManager(this);    // Sales
this.hud = new HUD(this);                      // UI
this.modeToggle = new ModeToggle(this);        // Modes
this.statsPanel = new StatsPanel(this);        // Stats
this.dog = new Dog(this, x, y);                // Helper

// Updated every frame in update()
this.farmManager.update(delta);
this.debtManager.update(delta);
this.serumManager.update();
this.animalManager.update();
this.truckManager.update(delta);
this.hud.update();
```

### What Players Can Do

**Farming:**
- Click tiles to plant crops
- Crops grow automatically (seed → growing → harvestable)
- Click mature crops to harvest
- Earn cash from harvesting

**Animals:**
- Animals in enclosures
- Produce eggs/milk over time
- Click to collect products
- Earn cash from products

**Toxicity:**
- Toggle spray mode
- Click to spray toxic serum
- Visual feedback on spray
- Affects environment

**Economy:**
- Track cash in HUD
- Debt system active
- Sell products via truck
- Purchase mechanics

**Interactions:**
- Drag dog helper around
- Switch modes (plant, spray, etc.)
- Click grid tiles
- Collect products

---

## 📊 File Locations & Purposes

### Builder Files
- `builder.html` - Entry point for game creation
- `editor/UnifiedBuilder.js` - Main builder logic
- `editor/VisualCinematicEditor.js` - Visual editor
- `editor/editor.css` - All styles

### Game Files
- `game.html` - Entry point for playing
- `src/scenes/SimpleCinematicScene.js` - Cinematic player
- `src/scenes/SimpleGameplayScene.js` - Gameplay player
- `src/scenes/SimpleCollectionScene.js` - Collection player

### Asset Files
- `assets/images/` - Your image files
- `assets/audio/` - Your audio files
- `assets/fonts/` - Your font files

### Data Files
- `game.json` - Exported game (created by builder)
- `src/data/iterations/default.json` - Fallback data

### Documentation
- `ASSET_SYSTEM_EXPLAINED.md` - Asset system deep dive
- `VISUAL_EDITOR_GUIDE.md` - Visual editor tutorial
- `GAMEPLAY_FIXED.md` - Gameplay mechanics explained
- `TEST_GAMEPLAY_NOW.md` - Testing workflow
- `HOW_TO_USE.md` - General guide

---

## ✅ What Works Right Now

### Builder
- ✅ Drag 3 template types to timeline
- ✅ Rearrange templates
- ✅ Edit templates in forms
- ✅ Visual editor for cinematics
- ✅ Save to IndexedDB (auto-save)
- ✅ Export to game.json
- ✅ Download file

### Visual Cinematic Editor
- ✅ Asset library (images/audio/fonts)
- ✅ Drag & drop onto canvas
- ✅ Position assets (X, Y)
- ✅ Resize assets (Width, Height)
- ✅ Layer assets (Z-Index)
- ✅ Set timing (Start Time, Duration)
- ✅ Set appearance (Opacity, Color)
- ✅ Timeline with layers
- ✅ Real-time preview
- ✅ Add text assets
- ✅ Add shape assets
- ✅ Properties panel
- ✅ Grid snapping
- ✅ Zoom controls
- ✅ Save to template

### Game Player
- ✅ Loads game.json
- ✅ Plays cinematic templates with ALL assets
- ✅ Plays gameplay templates with FULL mechanics
- ✅ Plays collection templates
- ✅ Auto-progression through sequence
- ✅ Clean transitions
- ✅ End screen

### Gameplay Mechanics
- ✅ Farm grid (5x5 or custom from template)
- ✅ Crop planting
- ✅ Crop growth
- ✅ Crop harvesting
- ✅ Animal enclosures
- ✅ Animal production
- ✅ Toxicity spray
- ✅ Cash tracking
- ✅ Debt system
- ✅ HUD displays
- ✅ Mode toggle
- ✅ Stats panel
- ✅ Dog dragging
- ✅ All interactions
- ✅ Timer countdown
- ✅ Auto-complete

---

## 🚀 Quick Start

### 1. Start Server (Already Running!)
```
http://127.0.0.1:8000
```

### 2. Add Assets (Optional)
```
Drag your images → assets/images/
Drag your audio → assets/audio/
```

### 3. Build a Test Game
1. Open http://127.0.0.1:8000/builder.html
2. Drag **Cinematic** to timeline
3. Click template → Click **"🎨 Open Visual Editor"**
4. Click **"+ Add Text"** → Type "Hello World!"
5. Click **"💾 Save Scene"** → Close editor
6. Click **"📦 Export Game"** → Save as `game.json`

### 4. Play Your Game
1. Open http://127.0.0.1:8000/game.html
2. Press **Ctrl+Shift+R** (hard refresh)
3. See "Hello World!" appear!

### 5. Add Gameplay
1. Back to builder.html
2. Drag **Gameplay** template
3. Set duration to 20000ms (20 seconds)
4. Export again
5. Play - now you have farming gameplay!

---

## 📚 Documentation Index

**Start Here:**
- `README.md` - Project overview
- `COMPLETE_SYSTEM_OVERVIEW.md` - This file!

**Visual Editor:**
- `VISUAL_EDITOR_GUIDE.md` - Complete guide to visual editor
- `ASSET_SYSTEM_EXPLAINED.md` - How assets flow through system

**Gameplay:**
- `GAMEPLAY_FIXED.md` - Gameplay mechanics restoration
- `TEST_GAMEPLAY_NOW.md` - Testing gameplay templates

**General:**
- `HOW_TO_USE.md` - Builder workflow
- `assets/README.md` - Asset folder guide

---

## 🎯 Summary

You now have a **complete game creation system** with:

### Builder App
- Unified timeline editor
- 3 template types (Cinematic, Gameplay, Collection)
- Visual cinematic editor (drag & drop like After Effects)
- Asset management
- Export to game.json

### Game App
- Template player system
- Full cinematic rendering with assets
- Full gameplay mechanics (farming simulation)
- Collection/payment system
- Sequence playback

### Workflow
```
Add Assets → Build in Builder → Export game.json → Play in Game
```

**Everything works and is ready to use!** 🎉

Start building your game now at:
**http://127.0.0.1:8000/builder.html**
