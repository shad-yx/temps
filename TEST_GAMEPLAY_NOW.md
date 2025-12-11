# 🎮 TEST GAMEPLAY MECHANICS NOW!

## Quick Test (2 Minutes)

### Step 1: Open Builder
1. Go to: http://127.0.0.1:8000/builder.html
2. You should see the unified builder interface

### Step 2: Create Quick Gameplay Test
1. **Drag** a **Gameplay** template block to the timeline
2. **Click** the block to edit it
3. **Set values**:
   - Name: "Farm Test"
   - Grid Rows: 5
   - Grid Cols: 5
   - Duration: 20000 (20 seconds for quick test)
   - Toxicity Threshold: 50
4. **Click "Save Changes"**

### Step 3: Export Game
1. **Click "📦 Export Game"** button at top
2. **Save** the file as `game.json` in the root `temps` folder
   - Location: `C:\Users\shady\OneDrive\Documents\phaser\temps\game.json`
3. Console should show: "Game exported successfully!"

### Step 4: Play Your Game
1. Go to: http://127.0.0.1:8000/game.html
2. **Hard refresh**: Press **Ctrl+Shift+R**
3. **Open console**: Press **F12** (Chrome DevTools)

### Step 5: Watch Console
You should see:
```
[GamePlayer] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[GamePlayer] 📦 GAME LOADED FROM: game.json (EXPORTED)
[GamePlayer] 🎮 Game: My Game
[GamePlayer] 📝 Templates: 1
[GamePlayer] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[GamePlayer] Playing template 1/1: gameplay
[GamePlayer] Playing GAMEPLAY: Farm Test

[SimpleGameplayScene] Playing: Farm Test
[SimpleGameplayScene] Template data: {type: "gameplay", name: "Farm Test", ...}
[SimpleGameplayScene] Using template grid: 5x5
[SimpleGameplayScene] Template duration: 20000ms (20s)
[SimpleGameplayScene] All systems initialized - gameplay active!

[FarmManager] Creating farm grid...
[FarmManager] Grid created: 5x5
[AnimalManager] Creating enclosures...
[SerumManager] Initialized
[TruckManager] Created
[HUD] Created
[ModeToggle] Created
[StatsPanel] Created
[Dog] Created
```

### Step 6: Test Gameplay Mechanics

**YOU SHOULD NOW SEE:**

✅ **5x5 farm grid** with interactive tiles
✅ **Countdown timer** at top (20.0s → 0.0s)
✅ **HUD** showing cash, toxicity, time
✅ **Mode toggle** buttons (plant, spray, etc.)
✅ **Stats panel** on right side
✅ **Dog sprite** you can drag around
✅ **Animal enclosures** on the sides

**TRY THESE ACTIONS:**

1. **Plant Crops**:
   - Click a tile in the grid
   - A crop placeholder should appear
   - It will grow over time

2. **Drag Dog**:
   - Click and drag the dog sprite
   - It should move with your mouse

3. **Toggle Modes**:
   - Click the mode toggle buttons
   - Should switch between plant/spray modes

4. **Watch Timer**:
   - Timer counts down from 20.0s
   - At 0.0s, scene auto-completes
   - Shows "THE END" screen

5. **Check Cash**:
   - HUD should show starting cash ($100)
   - Harvest crops to earn money

---

## Full Test (Create a Complete Game)

### Create 3-Template Sequence

#### Template 1: Cinematic Intro
1. Drag **Cinematic** to timeline
2. Edit:
   - Name: "Welcome"
   - Dialogue: "Welcome to the farm! Let's get started..."
   - Speaker: "Farmer"
   - Duration: 5000 (5 seconds)
3. Save Changes

#### Template 2: Gameplay
1. Drag **Gameplay** to timeline
2. Edit:
   - Name: "Day 1 Farming"
   - Grid: 5x5
   - Duration: 30000 (30 seconds)
   - Toxicity Threshold: 30
3. Save Changes

#### Template 3: Collection
1. Drag **Collection** to timeline
2. Edit:
   - Name: "First Payment"
   - Debt: $50
   - Dialogue: "Time to pay your debt!"
3. Save Changes

### Export and Play
1. Click "📦 Export Game"
2. Save as `game.json` in root
3. Open game.html and refresh (Ctrl+Shift+R)

### Expected Flow
1. **Shows intro dialogue** (5s) → Click or wait
2. **Farm gameplay** (30s) with full mechanics
3. **Payment screen** with $50 debt → Click PAY
4. **THE END screen**

**ALL YOUR TEMPLATES EXECUTING!**

---

## Console Debug Checklist

When testing, verify console shows:

### ✅ Game Loading
```
[GamePlayer] 📦 GAME LOADED FROM: game.json (EXPORTED)
```
**NOT** "default.json (FALLBACK)" - that means game.json not found

### ✅ Template Playing
```
[GamePlayer] Playing GAMEPLAY: Farm Test
[SimpleGameplayScene] Playing: Farm Test
```
Shows YOUR template name

### ✅ Systems Initialized
```
[SimpleGameplayScene] All systems initialized - gameplay active!
[FarmManager] Grid created: 5x5
[AnimalManager] Creating enclosures...
[SerumManager] Initialized
```
All managers created

### ✅ Gameplay Working
```
[Crop] Planted at tile (2, 3)
[Dog] Dragged to position (150, 400)
[FarmManager] Crop harvested, earned $10
```
Interactions logging properly

### ✅ Completion
```
[SimpleGameplayScene] Gameplay complete - moving to next template
[SimpleGameplayScene] Cleaning up systems...
[FarmManager] Destroyed
[AnimalManager] Destroyed
```
Clean shutdown, moves to next template

---

## Troubleshooting

### ❌ Game still shows default game
**Problem**: Console says "default.json (FALLBACK)"

**Fix**:
1. Make sure `game.json` is in the root folder: `temps/game.json`
2. Check filename is exactly `game.json` (not `game(1).json`)
3. Hard refresh: **Ctrl+Shift+R**
4. Clear browser cache

### ❌ No farm grid showing
**Problem**: Just see black screen or placeholder

**Fix**:
1. Check console for errors (F12)
2. Make sure all files saved properly
3. Refresh page
4. Check SimpleGameplayScene.js was updated (should have FarmManager imports)

### ❌ Can't interact with tiles
**Problem**: Grid visible but no clicks working

**Fix**:
1. Check console for InputManager errors
2. Make sure mode is set to "plant" or "spray"
3. Try clicking the mode toggle buttons first
4. Check if InputManager initialized in console

### ❌ Timer not showing
**Problem**: No countdown timer at top

**Fix**:
1. Check that template has `duration` set (should be > 0)
2. Look for timer at top of screen (may need to scroll)
3. Check console for timer creation logs

---

## What Should Work Now

### ✅ Template Creation
- Drag gameplay templates
- Edit all properties
- Save to sequence
- Export to game.json

### ✅ Template Execution
- Game loads game.json
- Creates 5x5 (or custom) grid
- Shows countdown timer
- Initializes ALL systems:
  - FarmManager (crops, grid)
  - AnimalManager (enclosures, production)
  - SerumManager (toxicity spray)
  - InputManager (drag, click)
  - DebtManager (cash, debt)
  - TruckManager (sales)
  - HUD (displays)
  - ModeToggle (mode switching)
  - StatsPanel (stats)
  - Dog (draggable)

### ✅ Farming Mechanics
- Click tiles to plant crops
- Crops grow over time
- Harvest crops for cash
- Place animals in enclosures
- Animals produce eggs/milk
- Collect animal products
- Spray toxicity serum
- Drag dog around
- Switch modes
- Track cash in HUD
- See stats panel

### ✅ Progression
- Timer counts down
- Auto-completes when time expires
- Cleans up all systems
- Moves to next template
- Shows end screen when sequence complete

---

## Expected Behavior

### On First Load
1. Loading screen shows
2. Console logs game.json loading
3. Fade in to gameplay
4. See farm grid
5. See timer countdown
6. See HUD with cash/toxicity
7. See mode toggle buttons
8. See dog sprite

### During Gameplay (20-30s)
1. Click tiles → crops appear
2. Crops grow (visual changes)
3. Mature crops → click to harvest
4. Cash increases when harvesting
5. Drag dog → moves with mouse
6. Toggle mode → buttons highlight
7. Animals in enclosures
8. Timer counts down

### On Completion
1. Timer reaches 0.0s
2. Screen fades out
3. Console: "Gameplay complete"
4. Console: "Cleaning up systems"
5. Moves to next template OR end screen
6. No errors in console
7. Memory cleaned properly

---

## Success Criteria

**YOUR TEST PASSES IF:**

✅ Console shows "game.json (EXPORTED)" - NOT default.json
✅ Console shows YOUR template name "Farm Test"
✅ Console shows "All systems initialized"
✅ You see 5x5 farm grid
✅ You see countdown timer
✅ You can click tiles and see crops
✅ You can drag the dog
✅ You see HUD, mode toggle, stats
✅ Timer counts down to 0
✅ Scene auto-completes
✅ Moves to next template or end screen
✅ No errors in console

**IF ALL ✅ = GAMEPLAY MECHANICS WORK!** 🎉

---

## Quick Commands

### Clear Browser Cache
```
Ctrl+Shift+Delete → Clear browsing data → Cached images and files
```

### Hard Refresh
```
Ctrl+Shift+R  (Windows/Linux)
Cmd+Shift+R   (Mac)
```

### Open Console
```
F12  (Chrome DevTools)
```

### View Game JSON
```
http://127.0.0.1:8000/game.json
```
Should show YOUR templates, not default

---

## Next Steps After Testing

1. **If it works**: Build more complex sequences!
   - Mix cinematics, gameplay, collections
   - Try different grid sizes (3x3, 10x10)
   - Try different durations (10s, 60s, 120s)
   - Add multiple gameplay templates

2. **If there are issues**: Check console for specific errors
   - Post the console error messages
   - Check which system failed to initialize
   - Verify game.json structure

3. **Add assets**: When ready to add real images
   - Put in `assets/` folder
   - Update Simple*Scene.js files to load them
   - Replace placeholders with actual sprites

---

**GO TEST IT NOW!** The full farming mechanics should work! 🌾🐔🚜
