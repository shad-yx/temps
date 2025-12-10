# 🎨 ASSET INTEGRATION GUIDE - DEADDAY

Complete guide for replacing placeholder graphics with your custom assets.

---

## 📁 RECOMMENDED DIRECTORY STRUCTURE

```
DEADDAY/
├── assets/
│   ├── images/
│   │   ├── entities/
│   │   │   ├── animals/
│   │   │   │   ├── chicken.png
│   │   │   │   ├── chicken_corrupted.png
│   │   │   │   ├── cow.png
│   │   │   │   ├── cow_corrupted.png
│   │   │   │   ├── sheep.png
│   │   │   │   └── sheep_corrupted.png
│   │   │   ├── products/
│   │   │   │   ├── egg.png
│   │   │   │   ├── egg_corrupted.png
│   │   │   │   ├── milk.png
│   │   │   │   ├── milk_brown.png
│   │   │   │   ├── milk_black.png
│   │   │   │   ├── milk_bloody.png
│   │   │   │   ├── wool.png
│   │   │   │   └── wool_corrupted.png
│   │   │   ├── crops/
│   │   │   │   ├── seed.png
│   │   │   │   ├── seed_corrupted.png
│   │   │   │   ├── crop_healthy.png
│   │   │   │   ├── crop_sick.png
│   │   │   │   └── crop_rotten.png
│   │   │   └── dog.png
│   │   ├── characters/
│   │   │   ├── player/
│   │   │   │   ├── player_normal.png
│   │   │   │   ├── player_stage1.png (slight deterioration)
│   │   │   │   ├── player_stage2.png
│   │   │   │   ├── player_stage3.png
│   │   │   │   └── player_stage4.png (severe corruption)
│   │   │   └── the_man/
│   │   │       ├── the_man_portrait.png
│   │   │       ├── the_man_silhouette.png
│   │   │       └── the_man_full.png
│   │   ├── environment/
│   │   │   ├── tiles/
│   │   │   │   ├── tile_healthy.png
│   │   │   │   ├── tile_sick.png
│   │   │   │   └── tile_dead.png
│   │   │   ├── truck.png
│   │   │   └── farm_background.png
│   │   └── ui/
│   │       ├── buttons/
│   │       │   ├── btn_water.png
│   │       │   ├── btn_serum.png
│   │       │   ├── btn_pay_cash.png
│   │       │   └── btn_continue.png
│   │       ├── panels/
│   │       │   ├── dialogue_box.png
│   │       │   ├── hud_background.png
│   │       │   └── truck_zone.png
│   │       └── icons/
│   │           ├── icon_cash.png
│   │           ├── icon_debt.png
│   │           └── icon_timer.png
│   ├── audio/ (for future)
│   │   ├── music/
│   │   └── sfx/
│   └── fonts/ (for future)
└── src/
```

---

## 🔧 HOW TO LOAD ASSETS IN PHASER

### Step 1: Create a Preloader Scene

Create this file: `src/scenes/PreloadScene.js`

```javascript
export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    // Loading bar (optional)
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    // === LOAD ALL ASSETS HERE ===

    // Animals
    this.load.image('chicken', 'assets/images/entities/animals/chicken.png');
    this.load.image('chicken_corrupted', 'assets/images/entities/animals/chicken_corrupted.png');
    this.load.image('cow', 'assets/images/entities/animals/cow.png');
    this.load.image('cow_corrupted', 'assets/images/entities/animals/cow_corrupted.png');
    this.load.image('sheep', 'assets/images/entities/animals/sheep.png');
    this.load.image('sheep_corrupted', 'assets/images/entities/animals/sheep_corrupted.png');

    // Products
    this.load.image('egg', 'assets/images/entities/products/egg.png');
    this.load.image('egg_corrupted', 'assets/images/entities/products/egg_corrupted.png');
    this.load.image('milk', 'assets/images/entities/products/milk.png');
    this.load.image('milk_brown', 'assets/images/entities/products/milk_brown.png');
    this.load.image('milk_black', 'assets/images/entities/products/milk_black.png');
    this.load.image('milk_bloody', 'assets/images/entities/products/milk_bloody.png');
    this.load.image('wool', 'assets/images/entities/products/wool.png');
    this.load.image('wool_corrupted', 'assets/images/entities/products/wool_corrupted.png');

    // Crops
    this.load.image('seed', 'assets/images/entities/crops/seed.png');
    this.load.image('seed_corrupted', 'assets/images/entities/crops/seed_corrupted.png');
    this.load.image('crop_healthy', 'assets/images/entities/crops/crop_healthy.png');
    this.load.image('crop_sick', 'assets/images/entities/crops/crop_sick.png');
    this.load.image('crop_rotten', 'assets/images/entities/crops/crop_rotten.png');

    // Dog
    this.load.image('dog', 'assets/images/entities/dog.png');

    // Characters
    this.load.image('the_man_portrait', 'assets/images/characters/the_man/the_man_portrait.png');

    // Environment
    this.load.image('truck', 'assets/images/environment/truck.png');
    this.load.image('tile_healthy', 'assets/images/environment/tiles/tile_healthy.png');
    this.load.image('tile_sick', 'assets/images/environment/tiles/tile_sick.png');
    this.load.image('tile_dead', 'assets/images/environment/tiles/tile_dead.png');

    // UI
    this.load.image('btn_water', 'assets/images/ui/buttons/btn_water.png');
    this.load.image('btn_serum', 'assets/images/ui/buttons/btn_serum.png');
    this.load.image('btn_pay_cash', 'assets/images/ui/buttons/btn_pay_cash.png');
  }

  create() {
    // Start the game
    this.scene.start('GameScene');
  }
}
```

### Step 2: Register PreloadScene in main.js

Update `src/main.js`:
```javascript
import { PreloadScene } from './scenes/PreloadScene.js'; // ADD THIS

scene: [
  PreloadScene,  // ADD THIS FIRST
  GameScene,
  PaymentScene,
  NightCycleScene,
  GameOverScene,
],
```

---

## 📝 FILES TO MODIFY FOR EACH ASSET TYPE

### 🐔 **1. ANIMALS (Chicken, Cow, Sheep)**

**File:** `src/entities/Animal.js`

**Current Code (Line 35-65):** Uses `this.scene.add.graphics()` to draw shapes

**How to Replace:**
```javascript
// FIND THIS (around line 35):
createVisual() {
  // Draw animal body (circle)
  this.bodyGraphics = this.scene.add.graphics();
  this.bodyGraphics.fillStyle(this.config.color, 1);
  this.bodyGraphics.fillCircle(0, 0, 20);
  // ... more graphics code
}

// REPLACE WITH:
createVisual() {
  // Determine which sprite to use
  let spriteKey = this.config.type.toLowerCase(); // 'chicken', 'cow', or 'sheep'

  if (this.corruptionLevel > 5) {
    spriteKey += '_corrupted'; // 'chicken_corrupted'
  }

  // Create sprite instead of graphics
  this.bodySprite = this.scene.add.sprite(0, 0, spriteKey);
  this.bodySprite.setScale(0.5); // Adjust scale to fit
  this.container.add(this.bodySprite);

  // Remove all graphics code
}
```

**Asset Requirements:**
- **Dimensions:** 64x64 or 128x128 pixels (PNG with transparency)
- **Variants:** Normal + Corrupted version for each animal
- **Files needed:**
  - `chicken.png`, `chicken_corrupted.png`
  - `cow.png`, `cow_corrupted.png`
  - `sheep.png`, `sheep_corrupted.png`

---

### 🥚 **2. ANIMAL PRODUCTS (Eggs, Milk, Wool)**

**File:** `src/entities/AnimalProduct.js`

**Current Code (Line 38-101):** Uses `this.scene.add.graphics()` to draw shapes

**How to Replace:**
```javascript
// FIND THIS (around line 38):
create() {
  this.sprite = this.scene.add.graphics();

  if (this.productType === 'EGG') {
    this.sprite.fillStyle(0xFFFAF0, 1);
    this.sprite.fillEllipse(0, 0, 20, 28);
    // ...
  }
}

// REPLACE WITH:
create() {
  // Determine sprite key based on type and corruption
  let spriteKey = this.productType.toLowerCase(); // 'egg', 'milk', 'wool'

  if (this.productType === 'MILK') {
    // Milk has multiple corruption stages
    if (this.corruptionLevel > 8) spriteKey = 'milk_bloody';
    else if (this.corruptionLevel > 6) spriteKey = 'milk_black';
    else if (this.corruptionLevel > 3) spriteKey = 'milk_brown';
  } else if (this.corruptionLevel > 5) {
    spriteKey += '_corrupted';
  }

  this.sprite = this.scene.add.sprite(this.x, this.y, spriteKey);
  this.sprite.setScale(0.8);

  // Keep the rest (shadow, price label, animations)
}
```

**Also update:** `createCorruptedProduct()` method (Line 344-476)

**Asset Requirements:**
- **Dimensions:** 32x32 or 64x64 pixels
- **Files needed:**
  - `egg.png`, `egg_corrupted.png`
  - `milk.png`, `milk_brown.png`, `milk_black.png`, `milk_bloody.png`
  - `wool.png`, `wool_corrupted.png`

---

### 🌾 **3. CROPS & SEEDS**

**File:** `src/entities/Tile.js`

**Seed (Line 200-226):**
```javascript
// FIND THIS:
plantSeed() {
  this.seedSprite = this.scene.add.circle(
    this.isoX,
    this.isoY + GameConfig.GRID.TILE_HEIGHT / 2 - 20,
    0,
    GameConfig.COLORS.SEED
  );
}

// REPLACE WITH:
plantSeed() {
  let seedKey = 'seed';
  if (this.corruptionLevel > 5) seedKey = 'seed_corrupted';

  this.seedSprite = this.scene.add.sprite(
    this.isoX,
    this.isoY + GameConfig.GRID.TILE_HEIGHT / 2 - 20,
    seedKey
  );
  this.seedSprite.setScale(0.5);
  // Keep animations
}
```

**Crop (Line 294-317):**
```javascript
// FIND THIS:
ripen() {
  const cropColor = this.isSick()
    ? GameConfig.COLORS.CROP_SICK
    : GameConfig.COLORS.CROP_HEALTHY;

  this.cropSprite = this.scene.add.rectangle(..., cropColor);
}

// REPLACE WITH:
ripen() {
  let cropKey = 'crop_healthy';
  if (this.corruptionLevel > 6) cropKey = 'crop_rotten';
  else if (this.isSick()) cropKey = 'crop_sick';

  this.cropSprite = this.scene.add.sprite(
    this.isoX,
    this.isoY + GameConfig.GRID.TILE_HEIGHT / 2 - 10,
    cropKey
  );
  // Keep animations
}
```

**Asset Requirements:**
- **Dimensions:** 32x32 or 64x64 pixels
- **Files needed:**
  - `seed.png`, `seed_corrupted.png`
  - `crop_healthy.png`, `crop_sick.png`, `crop_rotten.png`

---

### 🐕 **4. DOG**

**File:** `src/entities/Dog.js`

**Current Code (Line 19-32):** Uses graphics

**How to Replace:**
```javascript
// FIND THIS (around line 19):
create() {
  this.sprite = this.scene.add.graphics();
  this.sprite.fillStyle(GameConfig.COLORS.DOG, 1);
  this.sprite.fillCircle(0, 0, 25);
  // ...
}

// REPLACE WITH:
create() {
  this.sprite = this.scene.add.sprite(this.x, this.y, 'dog');
  this.sprite.setInteractive({ draggable: true });

  // Add price label (keep existing code)
}
```

**Asset Requirements:**
- **Dimensions:** 64x64 or 128x128 pixels
- **File:** `dog.png`

---

### 🚚 **5. TRUCK**

**File:** `src/systems/TruckManager.js`

**Current Code (Line 78-97):** Uses `drawTruck()` graphics method

**How to Replace:**
```javascript
// FIND THIS (around line 64):
createTruckZone() {
  // ... existing zone code ...

  // Truck sprite placeholder (simple truck shape)
  this.truckSprite = this.scene.add.graphics();
  this.drawTruck(x, y);
}

// REPLACE WITH:
createTruckZone() {
  // ... existing zone code ...

  // Load truck sprite
  this.truckSprite = this.scene.add.sprite(x, y, 'truck');
  this.truckSprite.setScale(0.8); // Adjust to fit zone
}

// DELETE the entire drawTruck() method (Line 78-97)
```

**Asset Requirements:**
- **Dimensions:** 200x150 pixels (landscape)
- **File:** `truck.png`
- **Style:** Side view of delivery truck

---

### 🎭 **6. "THE MAN" CHARACTER**

**File:** `src/scenes/NightCycleScene.js`

**Add portrait next to dialogue (after Line 122):**

```javascript
createDialogueBox() {
  // ... existing dialogue box code ...

  // ADD THIS after creating dialogue box:
  this.characterPortrait = this.scene.add.sprite(
    150, // Left side of screen
    boxY + boxHeight / 2,
    'the_man_portrait'
  );
  this.characterPortrait.setScale(0.8);
  this.characterPortrait.setOrigin(0.5);
}
```

**Asset Requirements:**
- **Dimensions:** 256x256 or 512x512 pixels
- **Files:**
  - `the_man_portrait.png` - Portrait for dialogue
  - `the_man_silhouette.png` (optional) - Mysterious silhouette version
- **Style:** Ominous, mysterious character

---

### 🏞️ **7. FARM TILES**

**File:** `src/entities/Tile.js`

**Current Code (Line 82-147):** Uses `graphics.fillStyle()` to draw isometric diamond

**How to Replace:**
```javascript
// FIND THIS (around line 82):
render() {
  this.graphics.clear();

  const color = this.getTileColor();
  this.graphics.fillStyle(color, 1);
  // ... draws diamond shape
}

// REPLACE WITH:
render() {
  // Determine tile sprite based on health
  let tileKey = 'tile_healthy';
  if (this.isDead()) tileKey = 'tile_dead';
  else if (this.isSick()) tileKey = 'tile_sick';

  // Clear old graphics
  if (this.tileSprite) this.tileSprite.destroy();

  // Create tile sprite
  this.tileSprite = this.scene.add.sprite(
    this.isoX,
    this.isoY,
    tileKey
  );

  // Keep corruption overlay rendering
  if (this.corruptionLevel > 0) {
    this.renderCorruptionOverlay();
  }
}
```

**Asset Requirements:**
- **Dimensions:** 100x50 pixels (isometric diamond shape)
- **Files:**
  - `tile_healthy.png` - Brown/healthy soil
  - `tile_sick.png` - Yellowish sick soil
  - `tile_dead.png` - Grey dead soil
- **Important:** Must be isometric (diamond shaped), not top-down square

---

### 🔘 **8. UI BUTTONS**

**File:** `src/ui/ModeToggle.js` (Water/Serum button)

**Current Code (Line 24-54):** Uses `this.scene.add.rectangle()`

**How to Replace:**
```javascript
// FIND THIS (around line 24):
create() {
  const buttonBg = this.scene.add.rectangle(
    GameConfig.SCREEN.WIDTH / 2,
    GameConfig.UI.TOGGLE_Y,
    200, 60,
    0x4CAF50
  );
}

// REPLACE WITH:
create() {
  const x = GameConfig.SCREEN.WIDTH / 2;
  const y = GameConfig.UI.TOGGLE_Y;

  // Water button sprite
  this.waterButton = this.scene.add.sprite(x - 60, y, 'btn_water');
  this.waterButton.setInteractive({ useHandCursor: true });
  this.waterButton.on('pointerdown', () => this.toggleMode());

  // Serum button sprite
  this.serumButton = this.scene.add.sprite(x + 60, y, 'btn_serum');
  this.serumButton.setInteractive({ useHandCursor: true });
  this.serumButton.on('pointerdown', () => this.toggleMode());

  // Highlight current mode
  this.updateButtonStates();
}

updateButtonStates() {
  if (this.scene.serumManager.getCurrentMode() === 'WATER') {
    this.waterButton.setTint(0xFFFFFF); // Bright
    this.serumButton.setTint(0x666666); // Dimmed
  } else {
    this.waterButton.setTint(0x666666);
    this.serumButton.setTint(0xFFFFFF);
  }
}
```

**File:** `src/scenes/PaymentScene.js` (Pay with Cash button - Line 389-420)

```javascript
// FIND THIS:
createPayCashButton() {
  const button = this.add.rectangle(buttonX, buttonY, 250, 60, 0x4CAF50);
}

// REPLACE WITH:
createPayCashButton() {
  const button = this.add.sprite(buttonX, buttonY, 'btn_pay_cash');
  button.setInteractive({ useHandCursor: true });

  // Keep the text overlay
  const buttonText = this.add.text(buttonX, buttonY, 'PAY WITH CASH', ...);
}
```

**Asset Requirements:**
- **Dimensions:** 128x64 pixels (rectangular buttons)
- **Files:**
  - `btn_water.png` - Water mode button
  - `btn_serum.png` - Serum mode button (red/ominous)
  - `btn_pay_cash.png` - Pay with cash button
- **States:** Can create separate files for hover/pressed states if needed

---

## ⚙️ RECOMMENDED ASSET SPECIFICATIONS

### General Guidelines:
- **Format:** PNG with transparency (alpha channel)
- **Color depth:** 32-bit RGBA
- **Style:** Consistent art style across all assets
- **Naming:** lowercase, underscores for spaces

### Size Guide:
| Asset Type | Recommended Size | Notes |
|------------|------------------|-------|
| Animals | 128x128px | Can scale down in code |
| Products | 64x64px | Small items |
| Crops/Seeds | 64x64px | Will be scaled 0.5-0.8 |
| Tiles | 100x50px | **Must be isometric diamond** |
| Dog | 128x128px | Draggable, needs good visibility |
| Truck | 200x150px | Landscape orientation |
| Character Portraits | 512x512px | High detail for close-ups |
| Buttons | 128x64px | Rectangular |
| Icons | 32x32px or 64x64px | Small UI elements |

---

## 🎨 OPTIONAL: SPRITE SHEETS & ANIMATIONS

If you want animated sprites (walking animals, growing crops), use sprite sheets:

**Example: Animated Chicken**

1. Create sprite sheet: `chicken_spritesheet.png` (512x128px = 4 frames of 128x128)

2. Load in PreloadScene:
```javascript
this.load.spritesheet('chicken', 'assets/images/entities/animals/chicken_spritesheet.png', {
  frameWidth: 128,
  frameHeight: 128
});
```

3. Use in Animal.js:
```javascript
this.bodySprite = this.scene.add.sprite(0, 0, 'chicken');
this.scene.anims.create({
  key: 'chicken_idle',
  frames: this.scene.anims.generateFrameNumbers('chicken', { start: 0, end: 3 }),
  frameRate: 8,
  repeat: -1
});
this.bodySprite.play('chicken_idle');
```

---

## 📋 ASSET CHECKLIST

Copy this to track your progress:

### Animals & Products:
- [ ] chicken.png
- [ ] chicken_corrupted.png
- [ ] cow.png
- [ ] cow_corrupted.png
- [ ] sheep.png
- [ ] sheep_corrupted.png
- [ ] egg.png
- [ ] egg_corrupted.png
- [ ] milk.png
- [ ] milk_brown.png
- [ ] milk_black.png
- [ ] milk_bloody.png
- [ ] wool.png
- [ ] wool_corrupted.png

### Crops:
- [ ] seed.png
- [ ] seed_corrupted.png
- [ ] crop_healthy.png
- [ ] crop_sick.png
- [ ] crop_rotten.png

### Characters:
- [ ] dog.png
- [ ] the_man_portrait.png

### Environment:
- [ ] truck.png
- [ ] tile_healthy.png
- [ ] tile_sick.png
- [ ] tile_dead.png

### UI:
- [ ] btn_water.png
- [ ] btn_serum.png
- [ ] btn_pay_cash.png

---

## 🚀 QUICK START WORKFLOW

1. **Create the folders** as shown in directory structure
2. **Create PreloadScene.js** with asset loading code
3. **Add your first asset** (start with something simple like `dog.png`)
4. **Test loading:**
   - Run game
   - Check browser console for "Failed to load" errors
   - Fix paths if needed
5. **Replace placeholder code** one file at a time
6. **Repeat** for each asset type

---

## 🐛 TROUBLESHOOTING

**Asset not showing:**
- Check browser console (F12) for 404 errors
- Verify file path matches exactly (case-sensitive)
- Make sure PreloadScene runs before GameScene
- Check image dimensions aren't 0x0

**Asset too big/small:**
- Use `.setScale()` in code: `sprite.setScale(0.5)` = 50% size

**Transparent backgrounds not working:**
- Save as PNG-24 with alpha channel
- Check "Transparency" is enabled in export settings

---

## 📞 NEED HELP?

Check these files for reference:
- **Animal loading:** `src/entities/Animal.js`
- **Product loading:** `src/entities/AnimalProduct.js`
- **Tile loading:** `src/entities/Tile.js`
- **Asset preloading:** `src/scenes/PreloadScene.js` (you'll create this)

When assets are ready, replace one category at a time and test!
