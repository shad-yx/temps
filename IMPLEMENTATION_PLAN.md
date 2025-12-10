# HAYDAY - Implementation Plan
*Created: 2025-12-08*
*Status: Planning Phase*

---

## Project Overview

**Game Name**: HAYDAY (formerly DEADDAY)
**Genre**: Isometric Farming Sim / Psychological Horror
**Engine**: Phaser 3 (JavaScript)
**Target**: Browser-based game
**Development Approach**: Rapid prototype with placeholder graphics

---

## Core Concept

A farming game where the player must generate profit to pay exponentially increasing debt. The twist: using "Serum" (toxic fertilizer) speeds up growth but degrades soil, creating a desperate cycle.

---

## Technical Architecture

### File Structure
```
DEADDAY/
├── .claude/                      # Claude Code config
├── PP/                          # Existing Phaser setup (reference)
├── src/
│   ├── scenes/
│   │   ├── GameScene.js        # Main gameplay scene
│   │   ├── GameOverScene.js    # End state screen
│   │   └── EndingScene.js      # Special ending (selling self)
│   ├── systems/
│   │   ├── FarmManager.js      # Grid & tile management
│   │   ├── DebtManager.js      # Economy & debt tracking
│   │   ├── InputManager.js     # Drag & drop physics
│   │   └── SerumManager.js     # Water/Serum toggle & effects
│   ├── entities/
│   │   ├── Tile.js             # Individual farm tile
│   │   ├── Crop.js             # Draggable crop product
│   │   ├── Dog.js              # Sellable dog asset
│   │   ├── Fence.js            # Sellable fence asset (future)
│   │   └── Player.js           # Sellable player avatar (future)
│   ├── ui/
│   │   ├── HUD.js              # Top UI bar (cash, day, timer, debt)
│   │   └── ModeToggle.js       # Water/Serum toggle button
│   ├── config/
│   │   └── GameConfig.js       # Constants, debt curve, prices
│   └── main.js                 # Entry point
├── index.html                   # HTML wrapper
└── [Documentation files]
```

---

## Phase 1: Core Systems (Priority)

### 1.1 Game Configuration (`src/config/GameConfig.js`)
**Purpose**: Centralize all game constants

**Constants to Define**:
```javascript
// Grid
GRID_ROWS: 4
GRID_COLS: 4
TILE_WIDTH: 100          // Isometric tile width
TILE_HEIGHT: 50          // Isometric tile height
TILE_DEPTH: 20           // Visual depth for 3D effect

// Timing
DAY_DURATION: 60         // seconds
NORMAL_GROW_TIME: 5      // seconds
SERUM_GROW_TIME: 0.5     // seconds

// Toxicity
TOXICITY_PER_SERUM: 2
TOXICITY_HEALTHY_MAX: 3
TOXICITY_SICK_MAX: 7
TOXICITY_DEAD_MIN: 8

// Economy
DEBT_CURVE: [0, 100, 250, 650, 2500, 10000]  // Day 0-5
PRICE_CROP_HEALTHY: 10
PRICE_CROP_SICK: 2
PRICE_DOG: 500
PRICE_FENCE: 15
PRICE_PLAYER_SELF: 999999

// Colors (for placeholder graphics)
COLOR_TILE_HEALTHY: 0x8B4513   // Brown
COLOR_TILE_SICK: 0xCCCC00      // Yellow
COLOR_TILE_DEAD: 0x808080      // Grey
COLOR_SEED: 0xFFFF00           // Yellow
COLOR_CROP_HEALTHY: 0x00FF00   // Green
COLOR_CROP_SICK: 0xAAAA00      // Dim green
COLOR_TRUCK: 0xFF0000          // Red
COLOR_DOG: 0x8B4513            // Brown
```

---

### 1.2 Tile Entity (`src/entities/Tile.js`)
**Purpose**: Individual farm tile with state and toxicity

**Properties**:
- `gridX`, `gridY` (grid position 0-3)
- `isoX`, `isoY` (isometric screen position)
- `state`: `EMPTY`, `PLANTED`, `RIPE`, `DEAD`
- `toxicity`: 0-10
- `graphics`: Phaser.GameObjects.Graphics (for rendering)
- `growthTimer`: Phaser.Time.TimerEvent (if planted)
- `seedSprite`: Phaser.GameObjects.Shape (visual indicator)
- `cropSprite`: Phaser.GameObjects.Shape (visual indicator)

**Methods**:
- `constructor(scene, gridX, gridY)`
- `render()` - Draw isometric tile with depth based on toxicity
- `plantSeed()` - Change state to PLANTED, show seed visual
- `startGrowth(duration)` - Start timer for growth
- `ripen()` - Change state to RIPE, update visual
- `harvest()` - Spawn draggable Crop, reset to EMPTY
- `addToxicity(amount)` - Increase toxicity, update color
- `getHealthStatus()` - Return: 'healthy', 'sick', or 'dead'
- `updateVisuals()` - Refresh tile color based on toxicity
- `setInteractive(enabled)` - Enable/disable pointer events

**Isometric Rendering**:
```
Tile shape (diamond with depth):
     /\
    /  \
   /____\
   \    /
    \  /
     \/
```
- Top face: diamond shape
- Depth faces: darker shades for 3D effect
- Color varies by toxicity level

**Interaction**:
- `pointerdown` event:
  - If `EMPTY` and not `DEAD`: Call `FarmManager.plantOnTile(this)`
  - If `RIPE`: Call `this.harvest()`

---

### 1.3 Crop Entity (`src/entities/Crop.js`)
**Purpose**: Draggable harvest product

**Properties**:
- `value`: Sell price (based on health status)
- `isHealthy`: boolean
- `sprite`: Phaser.GameObjects.Rectangle or Shape
- `originalX`, `originalY`: Position to snap back to
- `isDragging`: boolean

**Methods**:
- `constructor(scene, x, y, isHealthy)`
- `enableDrag()` - Set up drag events
- `onDragStart()` - Store original position
- `onDrag(pointer, dragX, dragY)` - Update position
- `onDragEnd()` - Check overlap with TruckZone or snap back
- `sell()` - Trigger sale, destroy self

**Visual**:
- Healthy: Green square (20x20)
- Sick: Dim yellow square (20x20)
- Label with price above it

---

### 1.4 FarmManager System (`src/systems/FarmManager.js`)
**Purpose**: Manage 4x4 grid of tiles

**Properties**:
- `scene`: Reference to GameScene
- `tiles`: 2D array [4][4] of Tile objects
- `gridOriginX`, `gridOriginY`: Screen position of grid center

**Methods**:
- `constructor(scene)`
- `create()` - Initialize 4x4 grid, create all Tile objects
- `getTile(gridX, gridY)` - Get tile at grid position
- `getTileAtPosition(worldX, worldY)` - Get tile at screen position
- `plantOnTile(tile)` - Handle planting logic
- `harvestTile(tile)` - Spawn Crop entity from tile
- `getTotalToxicity()` - Sum of all tiles' toxicity
- `getGridToIso(gridX, gridY)` - Convert grid coords to isometric screen position
- `update(delta)` - Called each frame (for animations if needed)

**Grid Layout** (isometric):
```
    [0,0] [0,1] [0,2] [0,3]
       [1,0] [1,1] [1,2] [1,3]
          [2,0] [2,1] [2,2] [2,3]
             [3,0] [3,1] [3,2] [3,3]
```

**Isometric Conversion**:
```javascript
isoX = (gridX - gridY) * (TILE_WIDTH / 2) + originX
isoY = (gridX + gridY) * (TILE_HEIGHT / 2) + originY
```

---

### 1.5 DebtManager System (`src/systems/DebtManager.js`)
**Purpose**: Track cash, debt, day progression, and timer

**Properties**:
- `scene`: Reference to GameScene
- `cash`: Current money
- `currentDay`: Day number (starts at 1)
- `currentDebt`: Debt due today
- `dayTimer`: Countdown timer (60s)
- `debtCurve`: Array of debt values

**Methods**:
- `constructor(scene)`
- `create()` - Initialize values
- `addCash(amount)` - Increase cash
- `getCurrentDebt()` - Return debt for current day
- `checkDayEnd()` - Called when timer hits 0
- `advanceDay()` - Increment day, update debt, reset timer
- `gameOver()` - Trigger game over scene
- `update(delta)` - Update timer countdown
- `getTimeRemaining()` - Return seconds left in day

**Day End Logic**:
```javascript
checkDayEnd() {
  if (cash >= currentDebt) {
    cash -= currentDebt;
    advanceDay();
  } else {
    // Continue playing but debt accumulates
    // OR trigger game over (based on clarification)
    gameOver();
  }
}
```

**CLARIFICATION NEEDED**: User said "if not u still harvest and sell but debt goes up"
- **Interpretation**: If you can't pay, game continues but debt compounds?
- **OR**: Immediate game over?

For now, I'll implement: **Immediate Game Over** (simpler for prototype)

---

### 1.6 InputManager System (`src/systems/InputManager.js`)
**Purpose**: Handle drag & drop physics for entities

**Properties**:
- `scene`: Reference to GameScene
- `draggableObjects`: Array of objects that can be dragged
- `truckZone`: Phaser.GameObjects.Zone (collision area)

**Methods**:
- `constructor(scene)`
- `create()` - Create truck zone
- `registerDraggable(object, value)` - Add object to drag system
- `setupDragEvents(object)` - Attach drag listeners
- `checkTruckOverlap(object)` - Test if object overlaps truck
- `sellObject(object, value)` - Remove object, add cash
- `createTruckZone()` - Visual and collision zone for truck

**Truck Zone**:
- Position: Right side of screen
- Size: ~200x400 pixels
- Visual: Red rectangle with "TRUCK" label
- Acts as drop target for all draggable entities

---

### 1.7 SerumManager System (`src/systems/SerumManager.js`)
**Purpose**: Toggle between Water/Serum modes and visual effects

**Properties**:
- `scene`: Reference to GameScene
- `currentMode`: 'WATER' or 'SERUM'
- `cursorGraphics`: Custom cursor visual
- `toxicityOverlay`: Phaser.GameObjects.Graphics (screen tint)

**Methods**:
- `constructor(scene)`
- `create()` - Set initial mode
- `toggleMode()` - Switch between WATER/SERUM
- `getCurrentMode()` - Return current mode
- `getGrowthDuration()` - Return 5s or 0.5s based on mode
- `appliesSerum()` - Return true if SERUM mode
- `updateCursor()` - Change cursor color (white = water, red = serum)
- `updateToxicityOverlay(totalToxicity)` - Adjust green tint intensity
- `update()` - Called each frame to update effects

**Visual Effects**:
- **Cursor**: Red circle when SERUM active
- **Screen Tint**: Green overlay, opacity = totalToxicity / (GRID_SIZE * 10)
- **Noise Grain**: (Optional for later - complex shader)

---

## Phase 2: Scene Implementation

### 2.1 GameScene (`src/scenes/GameScene.js`)
**Main gameplay scene**

**Lifecycle**:
```javascript
create() {
  // Initialize systems
  this.farmManager = new FarmManager(this);
  this.debtManager = new DebtManager(this);
  this.inputManager = new InputManager(this);
  this.serumManager = new SerumManager(this);

  // Create UI
  this.hud = new HUD(this);
  this.modeToggle = new ModeToggle(this);

  // Create initial assets
  this.dog = new Dog(this, x, y);
  this.inputManager.registerDraggable(this.dog, 500);

  // Start managers
  this.farmManager.create();
  this.debtManager.create();
  this.inputManager.create();
  this.serumManager.create();
}

update(time, delta) {
  this.farmManager.update(delta);
  this.debtManager.update(delta);
  this.serumManager.update();
  this.hud.update();
}
```

**Communication Between Systems**:
- FarmManager needs SerumManager (to get mode/duration when planting)
- FarmManager needs InputManager (to register harvested crops)
- DebtManager needs access to cash (shared via scene or events)
- SerumManager needs FarmManager (to get total toxicity)

**Event System** (to decouple):
```javascript
// Example events
this.events.on('tile-planted', (tile) => {...});
this.events.on('crop-harvested', (crop) => {...});
this.events.on('item-sold', (value) => {...});
this.events.on('day-ended', (day) => {...});
this.events.on('game-over', () => {...});
```

---

### 2.2 GameOverScene (`src/scenes/GameOverScene.js`)
**Purpose**: Display "FORECLOSED" message

**Elements**:
- Black background
- Large red text: "FORECLOSED"
- Smaller text: "Day X reached"
- Smaller text: "Cash: $X | Debt: $X"
- Button: "Try Again" (restart GameScene)

---

### 2.3 EndingScene (`src/scenes/EndingScene.js`)
**Purpose**: Special ending if player sells self

**Elements**:
- Black background
- Text: "You sold yourself for $999,999"
- Text: "But at what cost?"
- Button: "Restart"

---

## Phase 3: UI Components

### 3.1 HUD (`src/ui/HUD.js`)
**Purpose**: Display game stats

**Layout**:
```
┌─────────────────────────────────────────────┐
│ Cash: $150    Day: 2 | Time: 45s    Debt: $250 │
└─────────────────────────────────────────────┘
```

**Elements**:
- Text objects (Phaser.GameObjects.Text)
- Update each frame from DebtManager

**Methods**:
- `constructor(scene)`
- `create()` - Position text elements
- `update()` - Refresh values from systems

---

### 3.2 ModeToggle (`src/ui/ModeToggle.js`)
**Purpose**: Button to switch Water/Serum

**Layout**:
```
Bottom center:
┌─────────────────┐
│  Mode: [WATER]  │  ← Clickable button
└─────────────────┘
or
┌─────────────────┐
│  Mode: SERUM    │  ← Red background
└─────────────────┘
```

**Interaction**:
- Click to toggle
- Visual changes:
  - WATER: White background
  - SERUM: Red background

---

## Phase 4: Entities (Sellable Assets)

### 4.1 Dog Entity (`src/entities/Dog.js`)
**Purpose**: Sellable asset ($500)

**Visual**: Brown rectangle (60x40) with "DOG" text label

**Properties**:
- `value`: 500
- `sprite`: Rectangle
- `isDraggable`: true

**Placement**: Somewhere on the farm (not on grid) - e.g., bottom-left corner

---

### 4.2 Fence Entity (`src/entities/Fence.js`)
**(FUTURE - Optional for prototype)**

**Visual**: Small rectangle with "FENCE" label
**Value**: $15

---

### 4.3 Player Entity (`src/entities/Player.js`)
**(FUTURE - Optional for prototype)**

**Visual**: Small circle or avatar shape
**Value**: $999,999
**Behavior**: When sold, trigger EndingScene

---

## Implementation Order (Step-by-Step)

### Step 1: Setup & Config
- [ ] Update `index.html` (copy from PP or create new)
- [ ] Create `src/config/GameConfig.js`
- [ ] Update `src/main.js` with game config

### Step 2: Core Tile System
- [ ] Create `src/entities/Tile.js`
- [ ] Implement isometric rendering with depth
- [ ] Test: Render single tile, verify appearance

### Step 3: Farm Grid
- [ ] Create `src/systems/FarmManager.js`
- [ ] Generate 4x4 grid of tiles
- [ ] Test: All 16 tiles render in isometric layout

### Step 4: Planting & Growth
- [ ] Implement `Tile.plantSeed()`
- [ ] Implement `Tile.startGrowth(duration)`
- [ ] Implement `Tile.ripen()`
- [ ] Test: Click empty tile → seed appears → crop ripens after timer

### Step 5: Harvest & Drag
- [ ] Create `src/entities/Crop.js`
- [ ] Implement drag behavior
- [ ] Implement `Tile.harvest()` to spawn Crop
- [ ] Test: Click ripe tile → draggable crop appears

### Step 6: Selling System
- [ ] Create `src/systems/InputManager.js`
- [ ] Create Truck Zone (visual + collision)
- [ ] Implement `sellObject()` logic
- [ ] Test: Drag crop to truck → crop disappears, cash increases

### Step 7: Economy System
- [ ] Create `src/systems/DebtManager.js`
- [ ] Implement day timer (60s countdown)
- [ ] Implement `checkDayEnd()` logic
- [ ] Test: Timer reaches 0 → debt check → day advances or game over

### Step 8: Serum System
- [ ] Create `src/systems/SerumManager.js`
- [ ] Implement mode toggle
- [ ] Integrate with tile planting (toxicity increase)
- [ ] Implement toxicity visual effects (tile color, screen tint)
- [ ] Test: Toggle serum → plant crops → toxicity increases → tiles change color

### Step 9: UI
- [ ] Create `src/ui/HUD.js`
- [ ] Create `src/ui/ModeToggle.js`
- [ ] Test: All stats display correctly and update

### Step 10: GameScene Integration
- [ ] Create `src/scenes/GameScene.js`
- [ ] Integrate all systems
- [ ] Test full gameplay loop

### Step 11: Dog Asset
- [ ] Create `src/entities/Dog.js`
- [ ] Place on screen, make draggable
- [ ] Test: Drag dog to truck → $500 added

### Step 12: Game Over
- [ ] Create `src/scenes/GameOverScene.js`
- [ ] Trigger from DebtManager
- [ ] Test: Fail to pay debt → Game Over screen

### Step 13: Polish & Bug Fixes
- [ ] Test complete gameplay loop (multiple days)
- [ ] Fix any visual glitches
- [ ] Ensure all systems communicate properly
- [ ] Test edge cases (e.g., selling all crops, running out of tiles)

---

## Open Questions & Decisions Needed

### Q1: Debt Accumulation vs Immediate Game Over
**User said**: "if not u still harvest and sell but debt goes up"

**Options**:
- A) Game continues, unpaid debt carries over to next day (debt compounds)
- B) Immediate game over when timer hits 0 and cash < debt

**Current Plan**: Option B (simpler for prototype)
**ACTION ITEM**: Confirm with user

### Q2: Multiple Crops in Flight
Can the player harvest multiple crops and have several draggable crop objects on screen at once?
- Assume: **YES** (more interesting gameplay)

### Q3: Tile State After Harvest
After harvesting, does tile immediately return to EMPTY state?
- Assume: **YES** (can replant immediately)

### Q4: Toxicity Decay
Does toxicity decrease over time or is it permanent?
- Spec says nothing about decay
- Assume: **PERMANENT** (fits horror theme)

### Q5: Serum Mode Persistence
When switching to SERUM mode, does it stay active until toggled back?
- Assume: **YES** (manual toggle)

---

## Testing Checklist

### Core Mechanics
- [ ] Plant seed on empty tile
- [ ] Seed grows to ripe crop (normal water: 5s)
- [ ] Seed grows to ripe crop (serum: 0.5s)
- [ ] Harvest ripe crop → spawns draggable product
- [ ] Drag crop to truck → sells for correct price
- [ ] Healthy crop sells for $10
- [ ] Sick crop sells for $2

### Toxicity System
- [ ] Using serum adds +2 toxicity to tile
- [ ] Tile color changes: green → yellow → grey
- [ ] Sick tile (4-7 toxicity) reduces crop value
- [ ] Dead tile (8-10 toxicity) cannot be planted
- [ ] Screen tint increases with total toxicity

### Economy & Timer
- [ ] Timer counts down from 60s
- [ ] Cash increases when selling items
- [ ] At timer = 0, debt is checked
- [ ] If cash >= debt: day advances, debt increases
- [ ] If cash < debt: game over screen appears
- [ ] Debt curve follows spec (100, 250, 650, 2500, 10000)

### Assets
- [ ] Dog can be dragged to truck
- [ ] Dog sells for $500
- [ ] Dog disappears after selling

### UI
- [ ] Cash display updates correctly
- [ ] Day display shows current day
- [ ] Timer display shows seconds remaining
- [ ] Debt display shows debt due today
- [ ] Mode toggle switches between WATER/SERUM
- [ ] Mode toggle changes button color

### Edge Cases
- [ ] Cannot plant on dead tile
- [ ] Cannot plant on already planted tile
- [ ] Crop snaps back if not dropped on truck
- [ ] Multiple crops can exist simultaneously
- [ ] Game over screen has working restart button

---

## Visual Reference (ASCII Art)

### Game Screen Layout
```
┌──────────────────────────────────────────────────┐
│ Cash: $150    Day: 2 | Time: 45s     Debt: $250  │ ← HUD
├──────────────────────────────────────────────────┤
│                                                   │
│           [ISOMETRIC FARM GRID]        ┌────────┐│
│              4x4 Tiles                 │        ││
│                                        │ TRUCK  ││
│                                        │        ││
│     [DOG]                              │  ZONE  ││
│                                        │        ││
│                                        └────────┘│
│                                                   │
│              [ Mode: WATER ]                      │ ← Toggle
└──────────────────────────────────────────────────┘
```

### Isometric Tile (With Depth)
```
     /────\      ← Top face (color varies by toxicity)
    /      \
   /────────\
   │        │    ← Depth faces (darker shade)
   │        │
   \────────/
```

---

## Risk Assessment

### High Risk
- **Isometric rendering complexity**: May need iteration to look good
- **Drag & drop physics**: Overlap detection must be reliable
- **Timer synchronization**: Ensure timer doesn't drift

### Medium Risk
- **Toxicity visual effects**: Screen tint might be too subtle or too intense
- **Game balance**: Debt curve might be too easy/hard

### Low Risk
- **UI elements**: Straightforward text rendering
- **Scene transitions**: Standard Phaser scene management

---

## Next Steps

1. **Get user confirmation** on open questions (especially debt accumulation)
2. **Begin Step 1**: Setup project structure
3. **Build incrementally**: Test each system before moving to next
4. **Iterate on visuals**: Placeholder graphics can be refined once mechanics work

---

*This plan will be updated as development progresses and decisions are made.*
