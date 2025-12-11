# ✨ UNIFIED BUILDER - READY TO USE!

## 🎉 What You Have Now

I've completely restructured the editor into a **streamlined, After Effects-style unified builder**!

---

## 🚀 Quick Start

### Open Now:
👉 **http://127.0.0.1:8000**

### Steps:
1. Click **BUILD** button
2. See 3-panel interface:
   - **Left**: Template palette (🎬 🎮 💰)
   - **Center**: Game flow timeline
   - **Right**: Template editor
3. **Drag** templates from palette
4. **Click** blocks to edit
5. **Save** and **Play**

---

## ✅ What's New

### Old System (Removed)
- ❌ Separate editors (Timeline, Gameplay, Collection)
- ❌ Mode switching buttons
- ❌ Confusing navigation
- ❌ Hard to see overall game flow

### New Unified Builder
- ✅ **One interface** for everything
- ✅ **Drag-and-drop** templates like After Effects
- ✅ **Visual game flow** - see your entire game as blocks
- ✅ **Inline editing** - click any block to edit
- ✅ **Simple workflow** - Drag → Click → Edit → Save → Play

---

## 🎨 Interface Overview

```
┌─────────────────────────────────────────────────────┐
│  ◀ Menu   DEADDAY - Unified Builder                │
├──────────┬──────────────────────┬───────────────────┤
│          │                      │                   │
│ 📦 PALETTE│  🎞️ GAME FLOW         │  ✏️ EDITOR        │
│          │                      │                   │
│ Template │  Your game as        │  Edit selected    │
│ types to │  visual blocks       │  template here    │
│ drag     │  (numbered 1,2,3...) │                   │
│          │                      │                   │
│ 🎬 Cinematic│  Click blocks      │  Form fields for  │
│ 🎮 Gameplay │  to edit them      │  each property    │
│ 💰 Collection│                    │                   │
│          │  Controls:           │  Save Changes     │
│          │  💾 Save  ▶ Play     │  button           │
│          │                      │                   │
└──────────┴──────────────────────┴───────────────────┘
```

---

## 📖 How It Works

### 1. Build Game Flow (Center Panel)
- Drag templates from left palette
- Drop into center timeline
- See your game as numbered blocks
- Reorder by deleting and re-adding (drag reorder coming soon)

### 2. Edit Templates (Right Panel)
- Click any block in center
- Right panel shows editable properties
- Change values
- Click "Save Changes"

### 3. Template Types

#### 🎬 Cinematic
Visual novel scenes with:
- Background image
- Character (protagonist, collector, stranger)
- Dialogue text
- Speaker name
- Duration (seconds)
- Background music

#### 🎮 Gameplay
Farming cycles with:
- Duration (how long cycle lasts)
- Grid size (rows × cols for animals)
- Starting background
- Toxicity threshold (when background changes)
- Next background (gets progressively worse)

#### 💰 Collection
Payment/selling scenes with:
- Background
- Collector character
- Debt amount
- Debt mode (fixed, multiply, random)
- Dialogue

---

## 🗂️ Assets System

### Single Unified Folder
All assets now in: `assets/`

```
assets/
├── backgrounds/
│   ├── farm_normal.png
│   ├── farm_toxic1.png
│   ├── farm_toxic2.png
│   ├── farm_toxic3.png
│   ├── office.png
│   └── night.png
├── characters/
│   ├── protagonist.png
│   ├── collector.png
│   └── stranger.png
└── audio/
    ├── intro_theme.mp3
    ├── gameplay_ambient.mp3
    ├── tension.mp3
    └── ending.mp3
```

**See `assets/ASSET_REFERENCE.md` for complete list and specs.**

---

## 🎮 Default Game Included

The builder loads with a sample game (7 templates):

1. **Opening Scene** (cinematic)
   - "This is it... my new farm."

2. **Week 1 - Farm** (gameplay)
   - 60 seconds
   - Background: farm_normal → farm_toxic1

3. **Week 1 - Payment** (collection)
   - $100 debt

4. **Week 2 Begins** (cinematic)
   - "The land doesn't look right."

5. **Week 2 - Farm** (gameplay)
   - Background: farm_toxic1 → farm_toxic2

6. **Week 2 - Payment** (collection)
   - $150 debt

7. **Ending - The Cost** (cinematic)
   - "Everything is dead..."

**You can edit any of these or start fresh!**

---

## 💡 Quick Examples

### Example 1: Simple Loop Game
```
Drag: 🎬 Cinematic
Edit: "Day begins"

Drag: 🎮 Gameplay
Edit: 30 seconds, farm_normal

Drag: 💰 Collection
Edit: $50 debt

Repeat for Day 2, 3, 4... each time:
- Increase gameplay duration
- Progress to more toxic backgrounds
- Increase debt amount
```

### Example 2: Story-Driven
```
Act 1:
🎬 Intro → 🎮 Tutorial → 🎬 Meet collector → 💰 First payment

Act 2:
🎬 Pressure → 🎮 Hard decisions → 💰 Higher debt

Act 3:
🎬 Breaking point → 🎮 Last stand → 💰 Final payment → 🎬 Ending
```

---

## 🔧 Key Features

### Drag & Drop
- Grab templates from palette (left)
- Drop into timeline (center)
- Creates new template automatically

### Inline Editing
- Click any block to select it (green border)
- Right panel shows all properties
- Make changes
- Click "Save Changes"

### Visual Progression
- See entire game flow at once
- Numbered blocks (1, 2, 3...)
- Icons show type (🎬 🎮 💰)
- Names show purpose

### Save & Play
- **💾 Save** - Saves to browser (IndexedDB)
- **▶ Play** - Runs entire game from start
- Persists across browser refreshes

---

## 📚 Documentation

### Main Guides
- **UNIFIED_BUILDER_GUIDE.md** - Complete tutorial
- **assets/ASSET_REFERENCE.md** - All asset specs
- **NEW_BUILDER_READY.md** (this file) - Overview

### Legacy Docs (Reference Only)
- START_HERE.md
- IMPLEMENTATION_SUMMARY.md
- EDITOR_TEST_GUIDE.md

---

## 🎯 Workflow

### Standard Workflow
```
1. Open http://127.0.0.1:8000
2. Click BUILD
3. See default game (7 templates)

Option A - Edit Existing:
4. Click any block
5. Change properties
6. Click "Save Changes"
7. Click 💾 Save
8. Click ▶ Play to test

Option B - Start Fresh:
4. Delete all templates (click 🗑️ on each)
5. Drag new templates from palette
6. Edit each one
7. Save and Play

Option C - Expand Default:
4. Keep existing templates
5. Drag new ones to add more
6. Edit as needed
7. Save and Play
```

---

## 🎨 Creating Assets

### Placeholder Method (Quick)
1. Create 1280×720 PNG with solid color
2. Add text label
3. Save as: `assets/backgrounds/my_bg.png`
4. Builder picks it up automatically

### Colors for Toxicity Progression
- **farm_normal**: Green #4CAF50
- **farm_toxic1**: Yellow-green #9CCC65
- **farm_toxic2**: Yellow #FDD835
- **farm_toxic3**: Dead yellow #F9A825

### Character Sprites
- Size: 400×800 PNG
- Transparent background
- Simple silhouettes work great
- Save in `assets/characters/`

### Audio (Optional)
- MP3 format
- Loop for gameplay music
- Save in `assets/audio/`

---

## 🐛 Known Limitations

### Current Version Doesn't Have:
- ❌ Drag to reorder templates (use delete/re-add)
- ❌ Duplicate template button (copy values manually)
- ❌ Undo/redo
- ❌ Template preview thumbnails
- ❌ Asset drag-drop (select from dropdown)

### These Work Perfectly:
- ✅ Drag templates from palette
- ✅ Click to edit inline
- ✅ Save/load iterations
- ✅ Play complete sequences
- ✅ Multiple template types
- ✅ Asset selection from dropdowns

---

## 🚀 Next Steps for You

### Phase 1: Learn the Builder (10 minutes)
1. Open builder
2. Click through default templates
3. Edit one template (change dialogue)
4. Save and play

### Phase 2: Customize (30 minutes)
1. Edit all templates to your story
2. Change backgrounds to match progression
3. Adjust durations for pacing
4. Test full playthrough

### Phase 3: Expand (1-2 hours)
1. Add more templates
2. Create branching paths (future feature)
3. Add your own assets
4. Polish dialogue and timing

### Phase 4: Finalize (ongoing)
1. Replace placeholder assets with real art
2. Add sound effects
3. Balance difficulty
4. Playtest and iterate

---

## 🎓 Tips for Success

### 1. Start Simple
- Test with 3 templates first
- Make sure workflow feels good
- Then expand

### 2. Use Descriptive Names
- "Week 1 - Farm" not "gameplay_1"
- "Opening Scene" not "cinematic_1"
- Helps when you have 20+ templates

### 3. Test Constantly
- Save after every change
- Play often to catch issues
- Short durations during development (10-20 sec)

### 4. Think in Sequences
- Plan game flow on paper first
- Intro → Cycle → Payment → Repeat
- Build logical narrative progression

### 5. Escalate Smartly
- Start easy (low debt, normal farm)
- Each cycle slightly harder
- Visual progression matches difficulty

---

## 📊 Technical Details

### File Structure
```
UnifiedBuilder.js - Main builder (600+ lines)
  - Drag-drop from palette
  - Visual timeline rendering
  - Inline form editing
  - Save/load iterations
  - Play sequence execution

editor.css - Updated styles
  - 3-column builder layout
  - Palette, timeline, editor panels
  - Drag-drop visual feedback

index.html - Simplified overlay
  - Single unified-builder div
  - Removed old editor panels

default.json - 7 sample templates
  - Full game structure
  - All properties filled in
```

### Data Flow
```
Palette → Drag
  ↓
Timeline → Click block
  ↓
Editor → Edit properties
  ↓
Save → IndexedDB
  ↓
Play → Phaser scenes
```

---

## 🎉 You're All Set!

Everything is ready to go:
- ✅ Unified builder built
- ✅ 7-template sample game included
- ✅ Asset reference guide
- ✅ Complete documentation
- ✅ Server running at http://127.0.0.1:8000

**Just open the link and click BUILD!**

Have fun creating your game! 🎮

---

## 💬 Quick Help

**Q: Builder doesn't appear**
A: Refresh page, wait 2 seconds, try again

**Q: Can't edit template**
A: Make sure it's selected (green border)

**Q: Play doesn't work**
A: Add at least one template, save first

**Q: How to add more templates?**
A: Drag from left palette, as many as you want

**Q: How to reorder?**
A: Delete and re-add (drag reorder coming soon)

**Q: Where are my saves?**
A: IndexedDB in browser (F12 → Application → IndexedDB)

---

🎬 **Ready to build? Let's go!**
