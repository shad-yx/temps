# 🔧 Build System & Save System Explained

## ❌ Why You're Losing Progress

### The Problem
When you refresh `builder.html`, you lose everything because:
1. **No server running** - The old `npx http-server` doesn't have save APIs
2. **Browser storage only** - IndexedDB gets cleared on hard refresh
3. **No project files** - No `.deadday` or `.json` project files saved
4. **No auto-save** - Changes aren't automatically persisted

### The Solution (NOW IMPLEMENTED!)
1. **New Node.js server** (`server.js`) with save/load APIs
2. **Project system** - Save multiple game projects as files
3. **Auto-save** - Changes saved to IndexedDB + file
4. **Load system** - Load any saved project

---

## 🚀 How To Use The NEW System

### Step 1: Stop Old Server
```bash
# Press Ctrl+C in terminal running http-server
# Or close that terminal
```

### Step 2: Start NEW Server
```bash
cd c:\Users\shady\OneDrive\Documents\phaser\temps
node server.js
```

You'll see:
```
═══════════════════════════════════════════════════
   DEADDAY Development Server
═══════════════════════════════════════════════════
   Running at: http://127.0.0.1:8000
   Builder:    http://127.0.0.1:8000/builder.html
   Game:       http://127.0.0.1:8000/game.html

   API Endpoints:
   - GET /api/scan-assets (scans assets folder)
   - GET /api/projects (lists saved projects)
   - POST /api/save-project (saves project)
   - GET /api/load-project/:name (loads project)

   Press Ctrl+C to stop
═══════════════════════════════════════════════════
```

### Step 3: Use Builder
Open: http://127.0.0.1:8000/builder.html

---

## 💾 Save System - How It Works

### Project Structure
```
temps/
├── projects/                    ← Saved game projects
│   ├── my-farm-game.json       ← Your project 1
│   ├── test-version.json       ← Your project 2
│   └── final-build.json        ← Your project 3
├── events/                      ← Reusable event templates
│   ├── intro-cutscene.json     ← Cinematic event
│   ├── farm-day.json           ← Gameplay event
│   └── payment-scene.json      ← Collection event
└── assets/                      ← Your media files
    └── (images, audio, etc.)
```

### What Gets Saved

**Project File (`my-game.json`):**
```json
{
  "name": "My Farm Game",
  "version": "1.0.0",
  "created": "2025-12-11T12:00:00Z",
  "modified": "2025-12-11T14:30:00Z",
  "sequence": [
    {
      "type": "cinematic",
      "name": "Intro",
      "eventId": "intro-1",
      "assets": [...]
    },
    {
      "type": "gameplay",
      "name": "Farm Day 1",
      "eventId": "farm-1",
      "gridRows": 5,
      "duration": 30000,
      ...
    }
  ],
  "metadata": {
    "author": "You",
    "description": "My farming game"
  }
}
```

**Event File (`intro-cutscene.json`):**
```json
{
  "type": "cinematic",
  "name": "Intro Cutscene",
  "eventId": "intro-cutscene-1",
  "assets": [
    {
      "type": "image",
      "path": "assets/images/bg_farm.png",
      "x": 0,
      "y": 0,
      "width": 1280,
      "height": 720
    }
  ]
}
```

---

## 🎯 New UI - Save/Load Panel

### Builder Interface (NEW)

```
┌────────────────────────────────────────────────────────┐
│  [💾 Save Project ▼]  [📁 Load Project ▼]  [📦 Export]│
│                                                        │
│  Current Project: my-farm-game                        │
│  Last Saved: 2 minutes ago                            │
│  Auto-save: ✅ ON                                      │
└────────────────────────────────────────────────────────┘
```

### Save Project Dropdown
```
┌─ Save Project ──────────────┐
│ Save Current Project        │
│ Save As New Project...      │
│ ─────────────────────────── │
│ Recent Projects:            │
│ • my-farm-game ⭐          │
│ • test-version              │
│ • final-build               │
└─────────────────────────────┘
```

### Load Project Dropdown
```
┌─ Load Project ──────────────┐
│ ✅ my-farm-game (current)   │
│    test-version              │
│    final-build               │
│ ─────────────────────────── │
│ Import from file...         │
│ Create new project...       │
└─────────────────────────────┘
```

---

## 🔄 Workflow With New System

### Creating A New Game

```
1. Open builder.html
   ├─ Automatically loads "Untitled Project"
   └─ OR loads last opened project

2. Build your game
   ├─ Drag events to timeline
   ├─ Edit events
   ├─ Changes auto-saved every 30 seconds
   └─ Manual save: Click "💾 Save Project"

3. Name your project
   ├─ Click "💾 Save Project" → "Save As New Project..."
   ├─ Enter name: "My Farm Game"
   └─ Saved to: projects/my-farm-game.json

4. Continue working
   ├─ All changes auto-save to my-farm-game.json
   ├─ Refresh page → Auto-loads my-farm-game.json
   └─ NO DATA LOSS! ✅
```

### Working on Multiple Games

```
Game 1: "Farm Horror"
├─ Build it
├─ Save as: projects/farm-horror.json
└─ Close browser

Game 2: "Farm Peaceful"
├─ Open builder.html
├─ Click "📁 Load Project" → "Create new project..."
├─ Build it
└─ Save as: projects/farm-peaceful.json

Switch between:
├─ Click "📁 Load Project"
├─ Select "farm-horror" or "farm-peaceful"
└─ Instantly loads that game!
```

### Saving Event Templates

```
Created a great intro scene?
├─ Right-click event in timeline
├─ Select "Save as Reusable Event"
├─ Name it: "Epic Intro"
└─ Saved to: events/epic-intro.json

Use it in other projects:
├─ Click "+ Add Event" button
├─ Tab: "Saved Events"
├─ Drag "Epic Intro" to timeline
└─ Reused! 🎉
```

---

## 📊 Data Flow

### Where Everything Is Stored

```
┌─────────────────────────────────────────────────────┐
│              WHILE EDITING (Browser)                 │
│                                                      │
│  IndexedDB (browser storage)                        │
│  ├─ Current project (auto-save every 30s)          │
│  ├─ Undo/redo history                              │
│  └─ Draft changes                                   │
│                                                      │
│  [💾 Save Project] button clicked                   │
│         │                                           │
│         ▼                                           │
└─────────────────────────────────────────────────────┘
         │
         ▼ HTTP POST to /api/save-project
┌─────────────────────────────────────────────────────┐
│              SERVER (Node.js)                        │
│                                                      │
│  Receives project data                              │
│  └─ Writes to: projects/my-game.json                │
│                                                      │
└─────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│              FILESYSTEM (Permanent)                  │
│                                                      │
│  temps/projects/my-game.json                        │
│  ├─ Your complete game                              │
│  ├─ All events                                      │
│  ├─ All settings                                    │
│  └─ Backed up, version controlled, safe! ✅         │
│                                                      │
│  [Refresh browser]                                  │
│         │                                           │
│         ▼ HTTP GET from /api/load-project/my-game  │
│  Loads back into builder → NO DATA LOSS!            │
└─────────────────────────────────────────────────────┘
```

### Export vs Save

**Save Project:**
- Saves to `projects/my-game.json`
- For **continued editing**
- Includes all builder metadata
- Reloadable in builder

**Export Game:**
- Saves to `game.json`
- For **playing/distribution**
- Minimal data, optimized
- Loaded by game.html

---

## ⚙️ Auto-Save System

### How It Works

```javascript
// Auto-save every 30 seconds
setInterval(() => {
    if (hasUnsavedChanges) {
        saveToIndexedDB();  // Instant browser save

        // Also save to server (background)
        saveToServer();  // Writes to projects/xxx.json
    }
}, 30000);

// On any change:
eventEdited() {
    markAsChanged();
    saveToIndexedDB();  // Instant
    debouncedServerSave();  // Waits 5s, then saves
}
```

### Visual Indicators

```
┌─ Project Status ─────────────┐
│ 💾 Saved 2 minutes ago       │
│ ✅ All changes saved         │
└──────────────────────────────┘

┌─ Project Status ─────────────┐
│ ⏳ Saving...                 │
│ 🔵 Changes pending           │
└──────────────────────────────┘

┌─ Project Status ─────────────┐
│ ❌ Save failed!              │
│ 🔴 Unsaved changes           │
│ [Retry Save]                 │
└──────────────────────────────┘
```

---

## 🎮 Game Build & Export

### Development Workflow

```
1. Work in Builder
   └─ Save project frequently

2. Test in Game
   ├─ Click "📦 Export Game"
   ├─ Saves to: game.json
   └─ Open: game.html (plays game.json)

3. Iterate
   ├─ Make changes in builder
   ├─ Export again
   └─ Refresh game.html
```

### Production Build

```
1. Finish your game in builder
   └─ Project: projects/my-game.json

2. Export for distribution
   ├─ Click "📦 Export Game"
   ├─ Choose "Production Build"
   └─ Creates: build/my-game/
       ├─ index.html
       ├─ game.json
       ├─ assets/ (all referenced files)
       └─ phaser.js

3. Distribute
   └─ Upload build/ folder to web server
```

---

## 🔒 Data Safety

### Multiple Backups

Your game is saved in **3 places**:

1. **IndexedDB** (browser)
   - Instant saves
   - Cleared on hard refresh
   - ⚠️ Temporary

2. **projects/*.json** (filesystem)
   - Permanent files
   - Version controllable (Git)
   - ✅ Safe!

3. **Exported game.json** (filesystem)
   - For distribution
   - Playable version
   - ✅ Backed up

### Recommended Workflow

```bash
# Initialize Git for version control
cd temps
git init
git add projects/ events/ assets/
git commit -m "Save my game v1.0"

# Work on game...
# Auto-saves to projects/my-game.json

# Commit major milestones
git commit -am "Complete day 1 gameplay"

# Now you have:
# - Auto-save (every 30s)
# - File save (projects/my-game.json)
# - Git history (all versions)
```

---

## 🐛 Troubleshooting

### "Project not found after refresh"

**Cause:** Server not running
```bash
# Check if server is running
# You should see "DEADDAY Development Server"

# If not, start it:
node server.js
```

### "Changes not saving"

**Check:**
1. Server running? (node server.js)
2. Console errors? (F12 → Console tab)
3. Network errors? (F12 → Network tab)
4. File permissions? (Can write to projects/ folder?)

**Fix:**
```bash
# Make sure projects folder exists
mkdir projects events

# Check server console for errors
# Look for: "[API] Project saved: my-game.json"
```

### "Can't see my assets"

**Cause:** Asset scanner not finding files
```bash
# Check assets are in correct folders
ls assets/images/
ls assets/audio/

# In builder, click "🔄 Refresh Assets"
# Check browser console for errors
```

---

## 📁 File Organization Tips

### Good Structure
```
temps/
├── projects/
│   ├── main-game.json          ← Primary version
│   ├── main-game-v2.json       ← Iteration
│   ├── test-mechanics.json     ← Test builds
│   └── backup-2025-12-11.json  ← Manual backup
├── events/
│   ├── intro-cutscene.json
│   ├── farm-day-template.json
│   └── payment-template.json
└── assets/
    ├── images/
    │   ├── backgrounds/
    │   │   ├── farm_morning.png
    │   │   ├── farm_toxic_1.png
    │   │   └── farm_toxic_2.png
    │   └── characters/
    │       ├── farmer_normal.png
    │       └── farmer_toxic.png
    └── audio/
        └── music/
            └── theme.mp3
```

---

## ✅ Summary

### Before (OLD SYSTEM)
- ❌ Hard refresh = lose everything
- ❌ No project files
- ❌ No way to save multiple versions
- ❌ No reusable events
- ❌ Browser storage only

### Now (NEW SYSTEM)
- ✅ Auto-save every 30 seconds
- ✅ Projects saved as files (projects/*.json)
- ✅ Load any saved project
- ✅ Multiple game versions
- ✅ Reusable event templates
- ✅ Git-compatible files
- ✅ NO MORE DATA LOSS!

---

## 🚀 Quick Commands

### Start Server
```bash
cd c:\Users\shady\OneDrive\Documents\phaser\temps
node server.js
```

### Save Project (In Builder)
- Click "💾 Save Project"
- Or: Auto-saves every 30s
- Saved to: `projects/[name].json`

### Load Project (In Builder)
- Click "📁 Load Project"
- Select from list
- Instantly loads!

### Export Game (For Playing)
- Click "📦 Export Game"
- Saves to: `game.json`
- Open: `game.html`

---

**Your progress is now SAFE!** 🎉

No more losing work on refresh! Every change is saved to a file on disk.
