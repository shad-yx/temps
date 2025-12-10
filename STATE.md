# HAYDAY - Current State Document

**Last Updated**: 2025-12-08 17:45
**Version**: 0.4.0 - Animal Production System
**Status**: Core gameplay functional, payment system working, animal mechanics implemented

---

## 🎮 WHAT WORKS (Completed Features)

### Core Gameplay Loop ✅
- **Planting**: Click empty tiles to plant seeds (free, instant)
- **Growing**: Seeds grow over time
  - Water mode: 5 seconds (safe)
  - Serum mode: 0.5 seconds (+2 toxicity to tile)
- **Harvesting**: Click ripe crops to create draggable product
- **Selling**: Drag crops/assets to truck zone to convert to cash
- **Debt System**: 60-second timer, must pay debt or game over

### Grid & Tiles ✅
- 4x4 isometric grid with depth rendering
- Tile states: EMPTY, PLANTED, RIPE, DEAD
- Toxicity system (0-10):
  - 0-3: Healthy (green, full price)
  - 4-7: Sick (yellow, 80% reduced value)
  - 8-10: Dead (grey, cannot plant)
- Shadow/depth effects under tiles
- Highlight gradients on tile surfaces
- Visual color changes based on toxicity

### Economy ✅
- Starting cash: $0
- Debt curve: [$100, $250, $650, $2,500, $10,000]
- Crop prices:
  - Healthy: $10
  - Sick: $2
- Dog asset: $500 (one-time sale)
- **Cash carries over** between days (debt is subtracted, remainder kept)

### UI/UX ✅
- **HUD**: Color-coded panels
  - Green: Cash (animates on change)
  - Blue: Day & Timer
  - Red: Debt (pulses when cash < debt and time low)
- **Mode Toggle**: Water/Serum with visual feedback
  - Icon pulse animation
  - Subtitle showing [SAFE] or [TOXIC]
  - Particle burst on mode switch
  - Screen shake effect
- **Timer Warning**: Pulses red when ≤10 seconds

### Visual Polish ✅
- **Planting Animation**: Seeds pop in with bounce, pulse while growing
- **Growth Animation**: Seed transforms to crop with sparkles
- **Crop Idle**: Crops bob up/down when ripe
- **Serum Effect**: Red particle burst when applying serum
- **Drag Feedback**:
  - Shadow appears under dragged items
  - Scale up + rotation while dragging
  - Green highlight when over truck zone
  - Smooth snap-back if not sold
- **Selling Animation**:
  - "+$X" popup floats up
  - Gold particle burst (8 particles)
  - Item shrinks and fades out

### Toxicity Visual Effects ✅
- Green screen tint increases with total farm toxicity
- Opacity scales with toxicity sum (not average)
- Maximum 50% opacity at full toxicity

### Animal Production System ✅
- **3 Animal Enclosures**: Fixed positions on left side of farm
- **Animal Types**: Chicken, Cow, Sheep (each with unique appearance)
- **Starting Animal**: 1 chicken in first enclosure
- **Passive Production**:
  - Chicken: Produces eggs every 15 seconds ($15 each)
  - Cow: Produces milk every 20 seconds ($25 each)
  - Sheep: Produces wool every 18 seconds ($20 each)
- **Production Mechanics**:
  - Products spawn above animal as draggable items
  - Max 3 products per animal (stops producing when full)
  - Resumes production when products are collected/sold
  - Status indicator (green = producing, red = full)
- **Draggable Animals**: Can drag animals to truck to sell
  - Chicken: $100, Cow: $200, Sheep: $150
- **Visual Features**:
  - Type-specific appearance (beaks, horns, wool texture)
  - Idle bobbing animation
  - Production particle effects
  - Enclosure backgrounds with fencing

### Animal Products ✅
- **Draggable Items**: Eggs, milk bottles, wool bundles
- **Unique Graphics**: Each product type has distinct appearance
- **Selling**: Drag to truck zone like crops
- **Animations**: Spawn animation, idle float, sell particles

### Payment Scene Integration ✅
- Animals appear in payment inventory
- Animal products can be sold during payment
- Simplified animal representation (circles with type letter)
- Price labels show sell value
- Drag and drop to payment zone

---

## 🚧 IN PROGRESS

### Testing & Polish
- Test animal production in browser
- Verify payment scene receives animal data correctly
- Balance production timers and prices

---

## ❌ WHAT DOESN'T WORK YET (Planned Features)

### Critical Missing Features

#### 1. Day Transition Screen (Optional - PaymentScene covers this)
**Status**: Implemented but unused (using PaymentScene instead)
**Note**: DayTransitionScene.js exists but PaymentScene provides better interactive experience

#### 2. Improved Dragging
**Status**: Functional but can be better
**Improvements Needed**:
- Snap-to-grid when near valid drop zones
- Visual indicator for valid drop zones (highlight/glow)
- Smoother physics (momentum, easing)
- Touch/mobile support
- Multi-select option (drag multiple crops at once?)

#### 3. Enhanced UI/UX Features
**Status**: Basic UI exists, needs more QoL
**Missing Features**:
- **Tooltips**: Hover over tiles/items to see info
  - Tile: Toxicity level, state, growth time remaining
  - Crop: Value, health status
  - Animals: Production status, time until next product
- **Keyboard Shortcuts**:
  - Space: Toggle Water/Serum
  - H: Harvest all ripe crops (auto-collect)
  - P: Pause game
  - R: Restart game
- **Progress Bar**: Visual growth timer on planted tiles
- **Mini-map**: Overview of farm toxicity (color-coded grid)
- **Tutorial**: First-time player guidance
- **Settings Menu**: Volume, graphics quality, controls
- **Sound Effects**: Planting, harvesting, selling, mode toggle, timer warning
- **Background Music**: Ambient farm music, tension music when time low

#### 4. Expanded Game Mechanics

##### Fertilizer & Upgrades
- **Normal Fertilizer**: Speeds growth (3s) without toxicity ($5)
- **Soil Treatment**: Reduce toxicity by 1-2 points ($20)
- **Tile Upgrades**: Increase yield or reduce toxicity gain
- **Time Extensions**: Buy extra 10 seconds for $50

##### Multiple Crops
- Different crop types with varying:
  - Growth times
  - Sell prices
  - Toxicity resistance
- Seed shop to buy crop types

##### Weather System
- Rain: Auto-waters all crops (speeds growth)
- Drought: Crops grow slower
- Storm: Random tiles gain toxicity

##### Progression & Unlocks
- Unlock new tiles (expand farm)
- Unlock new animals
- Unlock upgrades
- Achievements/badges

---

## 📁 FILE STRUCTURE

```
DEADDAY/
├── .claude/
│   ├── commands/
│   │   ├── start-session.md
│   │   ├── end-session.md
│   │   ├── check-before-commit.md
│   │   └── cleanup.md
│   └── settings.local.json
├── src/
│   ├── config/
│   │   └── GameConfig.js          ✅ All constants
│   ├── entities/
│   │   ├── Tile.js                ✅ Farm tiles
│   │   ├── Crop.js                ✅ Draggable crops
│   │   ├── Dog.js                 ✅ Sellable dog
│   │   ├── Animal.js              ✅ Animal entities with production
│   │   ├── AnimalProduct.js       ✅ Draggable products (eggs/milk/wool)
│   │   └── Player.js              ❌ Optional
│   ├── systems/
│   │   ├── FarmManager.js         ✅ Grid management
│   │   ├── DebtManager.js         ✅ Economy & timer
│   │   ├── InputManager.js        ✅ Drag & drop
│   │   ├── SerumManager.js        ✅ Mode toggle
│   │   └── AnimalManager.js       ✅ Animal tracking & enclosures
│   ├── ui/
│   │   ├── HUD.js                 ✅ Stats display
│   │   ├── ModeToggle.js          ✅ Water/Serum button
│   │   ├── DayTransitionScene.js  ✅ Day stats (unused, using PaymentScene)
│   │   ├── Tooltip.js             ❌ NOT CREATED
│   │   └── SettingsMenu.js        ❌ NOT CREATED
│   ├── scenes/
│   │   ├── GameScene.js           ✅ Main gameplay
│   │   ├── GameOverScene.js       ✅ End screen
│   │   ├── PaymentScene.js        ✅ Interactive payment screen
│   │   ├── DayTransitionScene.js  ✅ Day stats (unused)
│   │   └── MenuScene.js           ❌ Optional
│   └── main.js                    ✅ Entry point
├── assets/                        ❌ No custom assets yet
├── index.html                     ✅ Working
├── RULES.md                       ✅ Coding standards
├── PROJECT_CONTEXT.md             ✅ Project overview
├── DONT_DO.md                     ✅ Anti-patterns
├── PROGRESS_LOG.md                ✅ Session history
├── IMPLEMENTATION_PLAN.md         ✅ Original plan
├── STATE.md                       ✅ This file
└── README.md                      ✅ Project info
```

---

## 🎯 IMMEDIATE NEXT STEPS (Priority Order)

### Priority 1: Testing & Bug Fixes
1. Test animal production system in browser
2. Verify animals produce products correctly
3. Test payment scene with animals
4. Check if data transfers correctly between scenes
5. Balance production timers and prices
6. Remove debug console.logs

### Priority 2: UI/UX Polish
1. Add tooltips on hover (tile info, animal status)
2. Add keyboard shortcuts (Space toggle, H harvest all)
3. Add growth progress bars on tiles
4. Add production progress indicators on animals
5. Add sound effects (optional)

### Priority 3: Additional Animals
1. Add UI for purchasing animals
2. Implement buyAnimal() functionality
3. Add animal purchase buttons near enclosures
4. Balance animal prices vs. production value

### Priority 4: Expand Mechanics
1. Add multiple crop types with different values
2. Add fertilizer/upgrade system
3. Add soil treatment to reduce toxicity
4. Add weather system (optional)

---

## 🐛 KNOWN ISSUES

### Fixed
- ✅ Phaser Color.GetRed() error (replaced with white overlay)
- ✅ Tile interactive hitbox not working (fixed polygon coordinates)
- ✅ clearTint/setTint not working on Rectangle (switched to setFillStyle)

### Active
- ⚠️ Money DOES carry over but user reported it doesn't (needs verification)
- ⚠️ No pause between days (feels rushed)
- ⚠️ Dragging can be finicky on small objects

---

## 💡 DESIGN DECISIONS LOG

### Decision 1: Immediate Game Over on Debt Failure
**Date**: 2025-12-08
**Decision**: If cash < debt at timer=0, immediate game over (no debt accumulation)
**Reasoning**: Simpler for prototype, clearer fail state
**Alternative**: Let debt accumulate (rejected for complexity)

### Decision 2: Cash Carries Over
**Date**: 2025-12-08
**Decision**: After paying debt, remaining cash persists to next day
**Reasoning**: Player progression feels rewarding, allows saving up
**Implementation**: Line 93 in DebtManager.js: `this.cash -= this.currentDebt`

### Decision 3: Toxicity Sum (Not Average)
**Date**: 2025-12-08
**Decision**: Screen tint based on SUM of all tile toxicity
**Reasoning**: User specifically requested sum, not average
**Max Toxicity**: 16 tiles × 10 = 160 max

### Decision 4: Serum Mode Toggle (Not Per-Tile)
**Date**: 2025-12-08
**Decision**: Global mode toggle instead of per-tile watering
**Reasoning**: Faster gameplay, clearer interaction
**Alternative**: Click tile, then choose water/serum (rejected as too slow)

### Decision 5: Placeholder Graphics Only
**Date**: 2025-12-08
**Decision**: Use geometric shapes (rectangles, circles) for all graphics
**Reasoning**: Rapid prototyping, user will provide art later
**Status**: Works well, user satisfied

---

## 🎨 ART STYLE NOTES

### Current (Placeholders)
- Tiles: Brown/yellow/grey isometric diamonds with depth
- Seeds: Yellow circles
- Crops: Green/yellow-green squares with bobbing animation
- Dog: Brown rectangle with "DOG" label
- Truck: Red rectangle zone
- UI: Color-coded panels (green/blue/red)

### Planned (User Will Provide)
- Farm tiles: Dirt texture with grass edges
- Crops: Vegetable sprites (corn, wheat, tomatoes)
- Animals: Cute farm animal sprites
- Products: Eggs, milk, wool sprites
- UI: Hand-drawn/pixel art style
- Background: Pastoral farm scenery

---

## 🔧 TECHNICAL NOTES

### Performance
- Target: 60 FPS
- Current: Stable at 60 FPS (tested with all 16 tiles planted)
- Potential bottlenecks:
  - Particle effects (limit to 10-20 concurrent)
  - Tween animations (clean up completed tweens)
  - Graphics redraws (cache when possible)

### Browser Compatibility
- Tested: Chrome (working)
- Not tested: Firefox, Safari, Edge, Mobile

### Phaser Version
- Using: Phaser 3.x (from PP/phaser.js)
- Notes: Some methods differ from docs (clearTint doesn't exist on Rectangle)

---

## 📊 GAME BALANCE OBSERVATIONS

### Too Easy
- Day 1 debt ($100) very achievable
- Serum mode makes it trivial (10 crops in 5s = $100)

### Too Hard
- Day 4-5 debt ($2,500, $10,000) nearly impossible
- Not enough tiles to generate required income
- Toxicity accumulation limits replayability

### Suggestions for Balance
1. Increase tile count (4x4 → 5x5 or 6x6)
2. Add animals for passive income
3. Add crop variety (higher value crops)
4. Reduce debt curve steepness
5. Add upgrades/fertilizer options

---

## 🔄 UPDATE PROTOCOL

**When making changes, UPDATE THIS FILE with:**
1. What was changed (file, system, feature)
2. Why it was changed
3. What now works / doesn't work
4. New decisions made
5. New bugs introduced / fixed

**At end of each session:**
1. Update "Last Updated" timestamp
2. Update Version number if significant
3. Move completed items from "doesn't work" to "works"
4. Add new issues to "known issues"
5. Update priority list

---

*This document is the source of truth for project state. Reference it at start of every session.*
