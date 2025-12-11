# 🎬 DEADDAY Unified Builder - Quick Guide

## ✨ What Changed?

The editor has been completely redesigned into a **unified After Effects-style builder**!

### Before vs After

**Before** ❌
- Multiple separate editors (Timeline, Gameplay, Collection)
- Mode switching buttons
- Confusing navigation
- Hard to see game flow

**After** ✅
- **One unified interface**
- **Drag-and-drop templates** from palette
- **Click blocks to edit inline**
- **Visual game flow** like a timeline
- **Much simpler workflow**

---

## 🚀 Quick Start (30 seconds)

### 1. Open the Builder
- Go to **http://127.0.0.1:8000**
- Click **BUILD** button
- You'll see the unified builder with 3 panels

### 2. The Interface

```
┌─────────────────────────────────────────────────────────┐
│  ◀ Menu    DEADDAY - Unified Builder                   │
├───────────┬─────────────────────────┬───────────────────┤
│           │                         │                   │
│  📦 PALETTE │   🎞️ GAME FLOW          │  ✏️ EDITOR        │
│           │                         │                   │
│  🎬 Cinematic│  1 🎬 Opening Scene    │  Select a        │
│  🎮 Gameplay │  2 🎮 Week 1 - Farm     │  template to     │
│  💰 Collection│  3 💰 Week 1 - Payment  │  edit it         │
│           │  4 🎬 Week 2 Begins     │                   │
│  Drag →   │  5 🎮 Week 2 - Farm     │  ← Properties    │
│  these    │  6 💰 Week 2 - Payment  │     show here    │
│           │  7 🎬 Ending            │                   │
│           │                         │                   │
│           │  💾 Save  ▶ Play        │                   │
└───────────┴─────────────────────────┴───────────────────┘
```

---

## 📖 How to Use

### Step 1: Build Your Game Flow

**Drag templates from the left palette to the center timeline:**

1. **🎬 Cinematic** - Dialogue scenes, cutscenes
2. **🎮 Gameplay** - Farming cycles (the main gameplay)
3. **💰 Collection** - Payment/selling scenes

**Example flow:**
```
Intro (cinematic)
  ↓
Farm Week 1 (gameplay)
  ↓
Payment (collection)
  ↓
Week 2 Intro (cinematic)
  ↓
Farm Week 2 (gameplay)
  ↓
...and so on
```

### Step 2: Edit Each Template

**Click any block in the center timeline** to edit it in the right panel.

#### Editing a Cinematic
- **Name**: "Opening Scene"
- **Background**: Choose from farm backgrounds
- **Character**: Protagonist, Collector, etc.
- **Dialogue**: Write what they say
- **Speaker**: Character name
- **Duration**: How long it shows (seconds)
- **Music**: Background music

#### Editing Gameplay
- **Name**: "Week 1 - Farm"
- **Duration**: How long the farming cycle lasts
- **Grid Size**: 5x5 (or change it)
- **Starting Background**: farm_normal.png
- **Toxicity Threshold**: When background changes (e.g., 30)
- **Next Background**: farm_toxic1.png (gets worse)

#### Editing Collection
- **Name**: "Week 1 - Payment"
- **Background**: Office interior
- **Character**: Debt collector
- **Debt Amount**: $100
- **Debt Mode**: Fixed, Multiply, or Random
- **Dialogue**: What the collector says

### Step 3: Save & Play

1. **💾 Save** - Saves your game to browser storage
2. **▶ Play** - Plays your complete game from start to finish

---

## 🎯 Workflow Example

### Create a Simple Game (5 minutes)

1. **Drag 🎬 Cinematic** to timeline
   - Click it
   - Name: "Intro"
   - Dialogue: "Welcome to my farm..."
   - Click Save Changes

2. **Drag 🎮 Gameplay** to timeline
   - Click it
   - Name: "Day 1"
   - Duration: 30 seconds (for testing)
   - Click Save Changes

3. **Drag 💰 Collection** to timeline
   - Click it
   - Name: "Sell Crops"
   - Debt: $50
   - Click Save Changes

4. **Click 💾 Save** at top

5. **Click ▶ Play** to test

Done! You just built a game!

---

## 🎨 Assets

All asset paths are in `assets/` folder:

### Backgrounds
- `assets/backgrounds/farm_normal.png` - Green farm
- `assets/backgrounds/farm_toxic1.png` - Slightly toxic
- `assets/backgrounds/farm_toxic2.png` - More toxic
- `assets/backgrounds/farm_toxic3.png` - Very toxic
- `assets/backgrounds/office.png` - Payment room
- `assets/backgrounds/night.png` - Night scene

### Characters
- `assets/characters/protagonist.png` - Player
- `assets/characters/collector.png` - Debt collector
- `assets/characters/stranger.png` - NPC

### Audio
- `assets/audio/intro_theme.mp3`
- `assets/audio/gameplay_ambient.mp3`
- `assets/audio/tension.mp3`
- `assets/audio/ending.mp3`

**See `assets/ASSET_REFERENCE.md` for full list and how to create placeholders.**

---

## 🎮 Game Flow Design Tips

### Classic Visual Novel Structure
```
🎬 Intro
🎮 Gameplay
💰 Collection
🎬 Story beat
🎮 Gameplay (harder)
💰 Collection
🎬 Ending
```

### Loop Structure (Endless mode)
```
🎬 Day intro
🎮 Farm cycle
💰 Sell crops
(repeat, getting harder)
```

### Chapter-Based
```
🎬 Chapter 1 intro
🎮 Farm - Week 1
💰 Payment 1
🎬 Chapter 1 end

🎬 Chapter 2 intro
🎮 Farm - Week 2
💰 Payment 2
🎬 Chapter 2 end
```

---

## ⚡ Pro Tips

### 1. **Start Simple**
- Make a 3-template game first (cinematic → gameplay → collection)
- Test it with ▶ Play
- Then expand

### 2. **Use Meaningful Names**
- "Week 1 - Farm" is better than "gameplay_1"
- Helps when you have 20+ templates

### 3. **Test Often**
- Click Save after each change
- Use Play to test the full flow
- Catch issues early

### 4. **Background Progression**
- Start with `farm_normal.png`
- Each gameplay cycle, use the next toxic level
- Creates visual progression

### 5. **Debt Escalation**
- Week 1: $100
- Week 2: $150
- Week 3: $250
- Makes game harder over time

### 6. **Short Durations for Testing**
- Use 10-20 seconds for gameplay during development
- Change to 60+ seconds for final game

---

## 🔧 Editing Features

### Reorder Templates
- **Currently**: Can't drag to reorder (coming soon)
- **Workaround**: Delete and re-add in correct order

### Delete Templates
- Click 🗑️ button on any template block
- Confirms before deleting

### Duplicate Templates
- **Currently**: No duplicate button
- **Workaround**: Create new template, copy values manually

---

## 💡 Common Patterns

### Pattern 1: Daily Loop
```javascript
For each day:
  🎬 Morning intro (dialogue about day #)
  🎮 Farm cycle (gets progressively toxic)
  💰 Evening payment (debt increases)
  🎬 Night reflection (story development)
```

### Pattern 2: Weekly Progression
```javascript
Week 1:
  🎬 Intro
  🎮 Farm (normal → toxic1)
  💰 Easy payment ($100)

Week 2:
  🎬 Things getting worse
  🎮 Farm (toxic1 → toxic2)
  💰 Harder payment ($200)

Week 3:
  🎬 Breaking point
  🎮 Farm (toxic2 → toxic3)
  💰 Impossible payment ($500)
  🎬 Ending (good or bad based on choices)
```

### Pattern 3: Story-Driven
```javascript
Act 1: Setup
  🎬 Arrival at farm
  🎮 First day (tutorial-like)
  🎬 Meet the collector
  💰 First payment

Act 2: Escalation
  🎬 Pressure builds
  🎮 Hard decisions
  💰 Increasing debt
  🎬 Turning point

Act 3: Resolution
  🎬 Final confrontation
  🎮 Last chance
  💰 Final payment
  🎬 Ending (multiple possible)
```

---

## 🐛 Troubleshooting

### Builder doesn't appear
- Refresh page (Ctrl+R)
- Check console (F12) for errors
- Wait 2 seconds after page load

### Templates don't save
- Check IndexedDB is enabled in browser
- Check console for errors
- Try saving iteration manually

### Play button doesn't work
- Make sure you have at least one template
- Click Save first
- Check console for template errors

### Can't edit template
- Make sure it's selected (green border)
- Try clicking it again
- Refresh builder if stuck

---

## 📊 Default Game Included

The builder comes with a sample game already built:

1. **Opening Scene** - "This is it... my new farm."
2. **Week 1 - Farm** - 60 seconds of farming
3. **Week 1 - Payment** - Pay $100
4. **Week 2 Begins** - "The land doesn't look right."
5. **Week 2 - Farm** - Farming with toxic background
6. **Week 2 - Payment** - Pay $150
7. **Ending** - "Everything is dead..."

**You can:**
- Play it as-is to see how it works
- Edit any template to customize
- Delete templates you don't want
- Add more templates for longer game

---

## 🎓 Next Steps

1. **Play the default game** - See how it works
2. **Edit one template** - Change dialogue or duration
3. **Add a new template** - Drag from palette
4. **Build your own story** - Delete all and start fresh
5. **Add real assets** - Replace placeholders with your art

---

## 🚀 You're Ready!

Open **http://127.0.0.1:8000**, click **BUILD**, and start creating!

The builder is designed to be intuitive - just drag, click, edit, save, play.

**Have fun building your game!** 🎮
