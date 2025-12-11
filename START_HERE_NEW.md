# ✨ NEW SYSTEM - START HERE

## 🎯 What Changed?

I've **completely separated** the builder from the game!

---

## 🚀 Two Apps Now

### 1. **BUILDER** 🔨
**URL:** http://127.0.0.1:8000/builder.html

**What it does:**
- YOU create the game here
- Drag & drop templates
- Edit properties
- Export game.json

**This is YOUR tool for development**

### 2. **GAME** 🎮
**URL:** http://127.0.0.1:8000/game.html

**What it does:**
- PLAYERS play here
- Loads game.json
- Plays your sequence
- No editing, just playing

**This is what you distribute**

---

## ⚡ Quick Workflow

```
Step 1: Open builder.html
  ↓
Step 2: Drag templates (🎬 🎮 💰)
  ↓
Step 3: Click blocks to edit
  ↓
Step 4: Click "Export Game" button
  ↓
Step 5: Save game.json to root folder
  ↓
Step 6: Open game.html
  ↓
Step 7: Your game plays!
```

---

## 🎬 Try It Now (30 seconds)

### Create a Simple Game

1. **Open builder:**
   ```
   http://127.0.0.1:8000/builder.html
   ```

2. **Drag 3 templates:**
   - Drag **🎬 Cinematic**
   - Drag **🎮 Gameplay**
   - Drag **💰 Collection**

3. **Edit first template:**
   - Click the first block (🎬)
   - Change dialogue to: "Hello world!"
   - Click "Save Changes"

4. **Export:**
   - Click **"📦 Export Game"** (top right)
   - Browser downloads `game.json`
   - Save it to the project root folder

5. **Play:**
   ```
   http://127.0.0.1:8000/game.html
   ```
   Your game runs!

---

## 📦 The Export Button

### What It Does
- Creates `game.json` file
- Contains ALL your templates
- Contains sequence order
- This is your **playable game**

### Where to Put It
```
temps/
├── builder.html
├── game.html
├── game.json          ← PUT IT HERE (root folder)
└── assets/
```

### When to Use It
- After creating templates
- When you want to test final version
- When you're ready to share game
- Anytime you make changes

---

## 🧪 Testing Workflow

### Quick Test (During Dev)
1. In builder, click **"▶ Test Game"**
2. New tab opens automatically
3. Plays current state
4. Close tab, make changes, test again

### Final Test (Before Export)
1. Review all templates
2. Click **"📦 Export Game"**
3. Save game.json
4. Open game.html
5. Play through completely

---

## 📁 What Each File Does

### builder.html
- **For:** You (the developer)
- **Purpose:** Create games
- **Features:** Drag, edit, export
- **Saves to:** IndexedDB (your workspace)

### game.html
- **For:** Players
- **Purpose:** Play games
- **Features:** Load, play, restart
- **Loads from:** game.json

### game.json
- **For:** Distribution
- **Purpose:** Your game data
- **Contains:** All templates + sequence
- **Created by:** Export button in builder

---

## 🎨 Assets Still Work

Put all assets in `assets/` folder:

```
assets/
├── backgrounds/
├── characters/
└── audio/
```

The builder dropdowns already have the right paths!

---

## 💾 Your Work is Saved

### Builder Auto-Saves
- Templates save to IndexedDB
- Your work persists in browser
- Refresh builder.html to continue

### Export When Ready
- Click export to create game.json
- This is separate from auto-save
- Export = finalize for players

---

## 🔄 Development Cycle

```
Day 1:
  Builder → Create 5 templates → Test → Export

Day 2:
  Builder → Add more → Replace assets → Export

Final:
  Builder → Polish → Export → Distribute game.html + game.json
```

---

## 📖 Full Documentation

- **HOW_TO_USE.md** - Complete step-by-step guide
- **UNIFIED_BUILDER_GUIDE.md** - Builder tutorial
- **assets/ASSET_REFERENCE.md** - Asset specifications

---

## ✅ Checklist

### First Time Setup
- [x] Server running (http://127.0.0.1:8000)
- [ ] Open builder.html
- [ ] Drag a template
- [ ] Click it to edit
- [ ] Export game.json
- [ ] Open game.html
- [ ] See it play

### Every Time You Work
- [ ] Open builder.html
- [ ] Make changes
- [ ] Click "Test Game" to preview
- [ ] When happy, click "Export Game"
- [ ] Save game.json to root
- [ ] Verify in game.html

---

## 🎯 Key Points

1. **Builder = Your tool** (create)
2. **Game = Player experience** (play)
3. **game.json = Your export** (distribute)
4. **Assets folder = All content** (unified)

---

## 🚀 You're Ready!

### To CREATE games:
👉 **http://127.0.0.1:8000/builder.html**

### To PLAY games:
👉 **http://127.0.0.1:8000/game.html**

### Simple as:
```
Builder → Export → game.json → Play
```

That's the new system! Much cleaner, much simpler.

**Go try it now! 🎮**
