# 📦 Export Checklist - Make Sure Your Game Loads!

## ✅ Step-by-Step Checklist

### 1. Build Your Game in Builder
- [ ] Open http://127.0.0.1:8000/builder.html
- [ ] Drag templates from palette (🎬 🎮 💰)
- [ ] Click each template to edit
- [ ] Save changes in editor

### 2. Export the Game
- [ ] Click **"📦 Export Game"** button (top right)
- [ ] Alert shows: "✅ Game Exported!"
- [ ] Browser downloads **game.json**

### 3. Place game.json in Root Folder
- [ ] Find downloaded **game.json** (usually in Downloads folder)
- [ ] Move/copy it to project root folder

**IMPORTANT: The file must be here:**
```
temps/
├── builder.html
├── game.html
├── game.json        ← PUT IT HERE! (same level as game.html)
├── assets/
└── src/
```

**NOT here:**
```
❌ temps/src/game.json
❌ temps/editor/game.json
❌ Downloads/game.json
```

### 4. Open the Game
- [ ] Open http://127.0.0.1:8000/game.html
- [ ] Press **Ctrl+Shift+R** (hard refresh)
- [ ] Check browser console (F12)
- [ ] Look for message: `📦 GAME LOADED FROM: game.json (EXPORTED)`

### 5. Verify It's Your Game
Check the console output:
```
[GamePlayer] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[GamePlayer] 📦 GAME LOADED FROM: game.json (EXPORTED)
[GamePlayer] 🎮 Game: My Game
[GamePlayer] 📝 Templates: 3
[GamePlayer] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

If it says `default.json (FALLBACK)`, you didn't place game.json correctly!

---

## 🐛 Troubleshooting

### Problem: Game shows old default game

**Cause:** game.json not in root folder OR browser cache

**Fix:**
1. Check game.json is in root folder (same level as game.html)
2. Hard refresh: **Ctrl+Shift+R**
3. Check browser console - what does it say it loaded from?
4. If it says `default.json`, game.json isn't found

### Problem: Export button does nothing

**Cause:** No templates in sequence

**Fix:**
1. Drag at least one template from palette
2. Click it to edit
3. Then export

### Problem: Downloaded game.json but game doesn't load it

**Cause:** File in wrong location OR wrong filename

**Fix:**
1. Make sure filename is exactly **game.json** (not game(1).json)
2. Make sure it's in root folder
3. Check file size - should be >100 bytes
4. Open game.json in text editor - should have your templates

### Problem: Console says "localStorage (TEST MODE)"

**Cause:** You used "Test Game" button, not playing from game.json

**Fix:**
This is fine for testing! But to play final version:
1. Export game.json
2. Place in root folder
3. Open game.html directly (not via Test Game button)
4. Hard refresh

---

## 📊 Console Debug Guide

### When you open game.html, console should show:

#### ✅ CORRECT (Playing your exported game):
```
[GamePlayer] Loading game data...
[GamePlayer] ✓ Loaded from game.json
[GamePlayer] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[GamePlayer] 📦 GAME LOADED FROM: game.json (EXPORTED)
[GamePlayer] 🎮 Game: My Game
[GamePlayer] 📝 Templates: 5
[GamePlayer] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### ⚠️ TEST MODE (Quick preview via Test Game button):
```
[GamePlayer] No game.json found, trying localStorage...
[GamePlayer] ✓ Loaded from localStorage (test mode)
[GamePlayer] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[GamePlayer] 📦 GAME LOADED FROM: localStorage (TEST MODE)
[GamePlayer] 🎮 Game: My Game
[GamePlayer] 📝 Templates: 5
[GamePlayer] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
This is fine for testing, but not the final version!

#### ❌ WRONG (Playing default game):
```
[GamePlayer] No game.json found, trying localStorage...
[GamePlayer] ⚠ Loading default.json - You should export from builder!
[GamePlayer] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[GamePlayer] 📦 GAME LOADED FROM: default.json (FALLBACK)
[GamePlayer] 🎮 Game: Default Game
[GamePlayer] 📝 Templates: 7
[GamePlayer] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
This means game.json is missing! Export and place it in root.

---

## 🎯 Quick Reference

### Builder Console (when you export)
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 EXPORTING GAME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎮 Game Name: My Game
📝 Templates: 3
🗓️ Exported: 2025-12-11T...

📋 Template Sequence:
  1. cinematic - "Intro"
  2. gameplay - "Farm Day 1"
  3. collection - "Payment"

💾 Saving to:
  1. Download → game.json (place in root folder)
  2. localStorage → for Test Game button
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### File Structure (Correct)
```
temps/
├── builder.html        # Create games here
├── game.html           # Play games here
├── game.json           # ← YOUR EXPORTED GAME (must be here!)
├── phaser.js
├── assets/
├── editor/
└── src/
```

---

## ✨ Success Checklist

- [ ] Exported game.json from builder
- [ ] Placed game.json in root folder (same level as game.html)
- [ ] Opened game.html
- [ ] Hard refreshed (Ctrl+Shift+R)
- [ ] Console shows "game.json (EXPORTED)"
- [ ] Loading screen shows your game name
- [ ] Game plays your custom sequence
- [ ] Not the default 7-template game

If all checked ✅ - **YOU'RE DONE!** Your game is working!

---

## 🚀 Final Test

1. Build something simple in builder (1-3 templates)
2. Export game.json
3. Place in root folder
4. Open game.html
5. Console should show YOUR templates playing
6. Not the default game

That's it! 🎮
