# 🎮 DEADDAY - How to Use the New System

## 🎯 What Changed?

Your project is now **completely separated** into two distinct apps:

### 1. **BUILDER** (builder.html)
- Where **YOU** create the game
- Drag & drop templates
- Edit properties
- Export the final game

### 2. **GAME** (game.html)
- What **PLAYERS** play
- Loads exported game data
- Plays the sequence you created
- No editing, just playing

---

## 🚀 Quick Start

### Step 1: Open the Builder
```
http://127.0.0.1:8000/builder.html
```

### Step 2: Create Your Game
1. **Drag** templates from left palette (🎬 🎮 💰)
2. **Click** blocks to edit them
3. **Save** changes in the editor

### Step 3: Export
1. Click **"📦 Export Game"** button (top right)
2. Browser downloads **game.json**
3. Place **game.json** in the root folder (same location as game.html)

### Step 4: Play Your Game
```
http://127.0.0.1:8000/game.html
```

Your game will load and play!

---

## 📁 File Structure

```
temps/
├── builder.html          ← Open this to CREATE games
├── game.html             ← Open this to PLAY games
├── game.json             ← YOUR exported game (place here)
│
├── assets/               ← Put all your assets here
│   ├── backgrounds/
│   ├── characters/
│   └── audio/
│
├── editor/               ← Builder code (don't touch)
│   ├── UnifiedBuilder.js
│   └── editor.css
│
├── src/                  ← Game runtime (don't touch)
│   ├── scenes/
│   ├── core/
│   └── config/
│
└── phaser.js             ← Game engine (don't touch)
```

---

## 🎨 Complete Workflow

### Development Workflow (You)

```
1. Open builder.html
   ↓
2. Drag templates into timeline
   ↓
3. Click each block to edit
   - Set backgrounds
   - Write dialogue
   - Configure gameplay
   ↓
4. Click "Test Game" button
   (Opens game.html in new tab with current state)
   ↓
5. Test if it works
   ↓
6. Go back to builder, make changes
   ↓
7. When happy, click "Export Game"
   ↓
8. Save game.json to root folder
   ↓
9. Refresh game.html to play final version
```

### Player Workflow (Others)

```
1. Open game.html
   ↓
2. Game loads game.json
   ↓
3. Plays your sequence from start to finish
   ↓
4. Shows "THE END" screen
   ↓
5. Can click to restart
```

---

## 🔧 Builder Controls

### Top Toolbar
- **📦 Export Game** - Downloads game.json
- **▶ Test Game** - Opens game in new tab (quick test)

### Left Panel - Template Palette
- **🎬 Cinematic** - Drag for story scenes
- **🎮 Gameplay** - Drag for farming cycles
- **💰 Collection** - Drag for payment scenes

### Center Panel - Game Flow
- Shows all templates as numbered blocks
- Click any block to edit it
- Click 🗑️ to delete a template

### Right Panel - Template Editor
- Shows when you click a block
- Edit all properties
- Click "Save Changes" when done

---

## 📦 Assets Management

### Where to Put Assets

```
assets/
├── backgrounds/
│   ├── farm_normal.png
│   ├── farm_toxic1.png
│   ├── farm_toxic2.png
│   ├── farm_toxic3.png
│   ├── office.png
│   └── night.png
│
├── characters/
│   ├── protagonist.png
│   ├── collector.png
│   └── stranger.png
│
└── audio/
    ├── intro_theme.mp3
    ├── gameplay_ambient.mp3
    ├── tension.mp3
    └── ending.mp3
```

### Asset Paths in Builder

When editing templates, use paths like:
- `assets/backgrounds/farm_normal.png`
- `assets/characters/protagonist.png`
- `assets/audio/intro_theme.mp3`

The dropdowns in the builder already have these paths!

---

## 🎬 Template Types Explained

### Cinematic Template
**What it does:** Shows a visual novel scene

**Properties:**
- **Name** - Your reference (e.g., "Opening Scene")
- **Background** - Select from dropdown
- **Character** - Select character sprite
- **Character Position** - left/center/right
- **Dialogue** - What they say
- **Speaker** - Character name shown
- **Duration** - How many seconds it shows
- **Music** - Background music

**Example:**
```
Name: "Farm Introduction"
Background: assets/backgrounds/farm_normal.png
Character: assets/characters/protagonist.png
Position: left
Dialogue: "This is it... my new farm."
Speaker: "You"
Duration: 5 seconds
```

### Gameplay Template
**What it does:** Runs a farming gameplay cycle

**Properties:**
- **Name** - Your reference (e.g., "Week 1 - Farm")
- **Duration** - How long the cycle lasts
- **Grid Size** - Rows × Cols for animal placement
- **Starting Background** - Initial background
- **Toxicity Threshold** - When background changes
- **Next Background** - Background after threshold
- **Starting Cash** - Money at start of cycle

**Example:**
```
Name: "Week 1 Farm"
Duration: 60 seconds
Grid: 5 × 5
Start BG: assets/backgrounds/farm_normal.png
Toxicity: 30
Next BG: assets/backgrounds/farm_toxic1.png
```

### Collection Template
**What it does:** Shows payment/selling scene

**Properties:**
- **Name** - Your reference (e.g., "Week 1 Payment")
- **Background** - Scene background
- **Character** - Debt collector sprite
- **Debt Amount** - How much to pay
- **Debt Mode** - fixed/multiply/random
- **Dialogue** - What collector says

**Example:**
```
Name: "First Payment"
Background: assets/backgrounds/office.png
Character: assets/characters/collector.png
Debt: $100
Mode: fixed
Dialogue: "Time to pay up. $100. Now."
```

---

## 💡 Example Game Structures

### Simple 3-Template Game

```
1. 🎬 Intro
   "Welcome to the farm..."

2. 🎮 Farm
   60 seconds of gameplay

3. 💰 Payment
   Pay $100
```

### Weekly Loop (7 templates)

```
1. 🎬 Week 1 Intro
2. 🎮 Week 1 Farm (normal → toxic1)
3. 💰 Week 1 Payment ($100)

4. 🎬 Week 2 Intro
5. 🎮 Week 2 Farm (toxic1 → toxic2)
6. 💰 Week 2 Payment ($150)

7. 🎬 Ending
```

### Story-Driven (10+ templates)

```
1. 🎬 Arrival at farm
2. 🎮 First day (tutorial)
3. 🎬 Meet the collector
4. 💰 First payment
5. 🎬 Pressure builds
6. 🎮 Harder decisions
7. 💰 Higher debt
8. 🎬 Breaking point
9. 🎮 Last stand
10. 💰 Final payment
11. 🎬 Ending (good or bad)
```

---

## 🔄 Testing Workflow

### Quick Test (During Development)

1. **In builder.html:**
   - Make changes to templates
   - Click **"▶ Test Game"** button
   - New tab opens with game.html
   - Plays current state (from localStorage)

2. **Test it:**
   - See if dialogue makes sense
   - Check if backgrounds look right
   - Test gameplay duration

3. **Go back to builder:**
   - Close game tab
   - Make adjustments
   - Test again

### Final Export (When Done)

1. **In builder.html:**
   - Review all templates
   - Make final tweaks
   - Click **"📦 Export Game"**

2. **Save file:**
   - Browser downloads **game.json**
   - Move it to project root folder
   - Overwrite old game.json if exists

3. **Test final version:**
   - Open **game.html**
   - Refresh if already open
   - Game loads from game.json
   - Play through completely

---

## 🐛 Troubleshooting

### Problem: Builder shows empty

**Solution:**
- Refresh page (Ctrl+R)
- Check browser console (F12)
- Make sure you opened builder.html, not game.html

### Problem: "Export Game" downloads but game doesn't load

**Solution:**
- Make sure game.json is in the ROOT folder (same level as game.html)
- Check the file name is exactly **game.json** (not game(1).json)
- Refresh game.html after placing the file

### Problem: Test Game shows error "No Game Found"

**Solution:**
- Add at least one template in builder first
- Try using "Test Game" button instead of opening game.html directly
- Clear browser cache and try again

### Problem: Assets don't show (broken images)

**Solution:**
- Check asset paths in builder match actual file locations
- Make sure files are in `assets/` folder
- Verify file extensions (.png, .mp3, etc.)
- Use lowercase filenames

### Problem: Game plays default game, not my game

**Solution:**
- Click "Export Game" in builder
- Save game.json to root folder
- Refresh game.html (Ctrl+Shift+R)
- Make sure game.json is not empty

---

## 📝 Pro Tips

### 1. **Name Your Templates Clearly**
- ✅ "Week 1 - Farm Intro"
- ❌ "cinematic_1"

### 2. **Test Often**
- Don't build 20 templates then test
- Build 2-3, test, repeat

### 3. **Use Short Durations During Development**
- Set gameplay to 10 seconds while testing
- Change to 60+ seconds for final version

### 4. **Keep Assets Organized**
- Use descriptive filenames
- farm_normal.png, farm_toxic1.png, etc.

### 5. **Save Backups**
- Export game.json often
- Keep old versions (game_v1.json, game_v2.json)

### 6. **Progression is Key**
- Each cycle should be harder
- Increase debt amounts
- Progress background toxicity
- Make it feel like degradation

---

## 🎯 Your Iteration Workflow

### Day 1 (Today)
1. Open builder.html
2. Create 3-5 templates
3. Test with "Test Game"
4. Export game.json
5. Verify game.html works

### Day 2 (Tomorrow)
1. Open builder.html
2. Add more templates
3. Replace placeholder assets with real art
4. Test full playthrough
5. Export final game.json

### Final Polish
1. Add music/sounds
2. Balance difficulty
3. Polish dialogue
4. Test multiple times
5. Final export

---

## 📊 What Each File Does

### builder.html
- Standalone builder app
- No Phaser, just pure HTML/JS
- Loads UnifiedBuilder.js
- Saves to IndexedDB for your work
- Exports to game.json for players

### game.html
- Standalone game player
- Loads Phaser
- Reads game.json
- Plays sequence
- Shows end screen

### game.json
- Your exported game data
- Contains all templates
- Contains sequence order
- Read by game.html

### assets/
- Your game content
- Images, audio, etc.
- Referenced by templates
- Loaded by game.html

---

## ✅ Checklist

### Before You Start
- [ ] Server running (http://127.0.0.1:8000)
- [ ] Builder opens (builder.html)
- [ ] Game opens (game.html)

### Create Your Game
- [ ] Drag templates into timeline
- [ ] Edit each template properties
- [ ] Add backgrounds from assets
- [ ] Write all dialogue
- [ ] Set durations

### Test & Export
- [ ] Click "Test Game" to preview
- [ ] Make adjustments
- [ ] Click "Export Game"
- [ ] Save game.json to root folder

### Final Verification
- [ ] Open game.html
- [ ] Game loads successfully
- [ ] Plays from start to finish
- [ ] Reaches end screen
- [ ] All assets load correctly

---

## 🚀 You're Ready!

**To create games:**
👉 **http://127.0.0.1:8000/builder.html**

**To play games:**
👉 **http://127.0.0.1:8000/game.html**

**Workflow:**
```
Builder → Drag/Edit → Export → Place game.json → Play
```

That's it! Build your game, export it, and it's ready to play!

Good luck! 🎮
