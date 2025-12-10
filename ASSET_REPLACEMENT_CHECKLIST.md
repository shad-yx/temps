# 🎯 ASSET REPLACEMENT CHECKLIST

Quick reference for replacing placeholders with your custom assets.

---

## 📦 WHEN YOU ADD AN ASSET, DO THESE 3 STEPS:

1. **Place the image file** in the correct folder
2. **Uncomment the load line** in `PreloadScene.js`
3. **Update the code** in the appropriate file (see below)

---

## 🐔 ANIMALS (Chicken, Cow, Sheep)

### Step 1: Add your files
```
assets/images/entities/animals/
├── chicken.png
├── chicken_corrupted.png
├── cow.png
├── cow_corrupted.png
├── sheep.png
└── sheep_corrupted.png
```

### Step 2: Uncomment in PreloadScene.js (Lines 15-20)
```javascript
this.load.image('chicken', 'assets/images/entities/animals/chicken.png');
this.load.image('chicken_corrupted', 'assets/images/entities/animals/chicken_corrupted.png');
// ... etc
```

### Step 3: Edit src/entities/Animal.js

**Find:** Line 35-65 (the `createVisual()` method with graphics code)

**Replace with:**
```javascript
createVisual() {
  // Determine sprite based on corruption
  let spriteKey = this.config.type.toLowerCase(); // 'chicken', 'cow', 'sheep'

  if (this.corruptionLevel > 5) {
    spriteKey += '_corrupted';
  }

  // Create sprite instead of graphics
  this.bodySprite = this.scene.add.sprite(0, 0, spriteKey);
  this.bodySprite.setScale(0.8); // Adjust this to make animal bigger/smaller
  this.container.add(this.bodySprite);

  // Keep the rest of the code (labels, etc.)
}
```

**Also add corruption update method around Line 100:**
```javascript
updateVisuals() {
  if (!this.bodySprite) return;

  // Switch sprite when corruption changes
  let spriteKey = this.config.type.toLowerCase();
  if (this.corruptionLevel > 5) spriteKey += '_corrupted';

  this.bodySprite.setTexture(spriteKey);
}
```

---

## 🥚 ANIMAL PRODUCTS (Eggs, Milk, Wool)

### Step 1: Add your files
```
assets/images/entities/products/
├── egg.png
├── egg_corrupted.png
├── milk.png
├── milk_brown.png
├── milk_black.png
├── milk_bloody.png
├── wool.png
└── wool_corrupted.png
```

### Step 2: Uncomment in PreloadScene.js (Lines 23-30)

### Step 3: Edit src/entities/AnimalProduct.js

**Find:** Line 38-101 (the `create()` method)

**Replace the sprite creation section with:**
```javascript
create() {
  // Shadow
  this.shadow = this.scene.add.ellipse(this.x, this.y + 15, 30, 10, 0x000000, 0.3);

  // Determine sprite based on type and corruption
  let spriteKey = this.productType.toLowerCase(); // 'egg', 'milk', 'wool'

  if (this.productType === 'MILK') {
    if (this.corruptionLevel > 8) spriteKey = 'milk_bloody';
    else if (this.corruptionLevel > 6) spriteKey = 'milk_black';
    else if (this.corruptionLevel > 3) spriteKey = 'milk_brown';
  } else if (this.corruptionLevel > 5) {
    spriteKey += '_corrupted';
  }

  // Create sprite
  this.sprite = this.scene.add.sprite(this.x, this.y, spriteKey);
  this.sprite.setScale(0.8);

  // Price label
  this.priceLabel = this.scene.add.text(
    this.x,
    this.y + 25,
    `$${this.value}`,
    GameConfig.TEXT_STYLES.PRICE
  );
  this.priceLabel.setOrigin(0.5);
  this.priceLabel.setFontSize('16px');

  // Spawn animation
  this.sprite.setScale(0);
  this.scene.tweens.add({
    targets: this.sprite,
    scaleX: 0.8,
    scaleY: 0.8,
    duration: 300,
    ease: 'Back.easeOut',
  });

  // Idle float animation
  this.scene.tweens.add({
    targets: this.sprite,
    y: this.y - 5,
    duration: 1200,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut',
  });

  // Setup click to sell
  this.setupClickToSell();
}
```

**Delete or comment out:** The entire `createCorruptedProduct()` method (Lines 344-476) - no longer needed!

**Update applyCorruption()** to just change texture:
```javascript
applyCorruption(amount) {
  this.corruptionLevel = Math.min(this.corruptionLevel + amount, 10);

  // Change sprite texture
  let spriteKey = this.productType.toLowerCase();
  if (this.productType === 'MILK') {
    if (this.corruptionLevel > 8) spriteKey = 'milk_bloody';
    else if (this.corruptionLevel > 6) spriteKey = 'milk_black';
    else if (this.corruptionLevel > 3) spriteKey = 'milk_brown';
  } else if (this.corruptionLevel > 5) {
    spriteKey += '_corrupted';
  }

  if (this.sprite) {
    this.sprite.setTexture(spriteKey);
  }
}
```

---

## 🌾 CROPS & SEEDS

### Step 1: Add your files
```
assets/images/entities/crops/
├── seed.png
├── seed_corrupted.png
├── crop_healthy.png
├── crop_sick.png
└── crop_rotten.png
```

### Step 2: Uncomment in PreloadScene.js (Lines 33-37)

### Step 3: Edit src/entities/Tile.js

**SEED - Find:** Line 200-226 (`plantSeed()` method)

**Replace:**
```javascript
plantSeed() {
  console.log(`[Tile ${this.gridX},${this.gridY}] Planting seed...`);
  this.state = GameConfig.TILE_STATE.PLANTED;

  // Determine seed sprite
  let seedKey = this.corruptionLevel > 5 ? 'seed_corrupted' : 'seed';

  // Create seed sprite
  this.seedSprite = this.scene.add.sprite(
    this.isoX,
    this.isoY + GameConfig.GRID.TILE_HEIGHT / 2,
    seedKey
  );
  this.seedSprite.setScale(0.5);

  // Spawn animation
  this.scene.tweens.add({
    targets: this.seedSprite,
    scaleX: 0.7,
    scaleY: 0.7,
    duration: 300,
    ease: 'Back.easeOut',
  });

  // Pulse animation
  this.scene.tweens.add({
    targets: this.seedSprite,
    scaleX: 0.8,
    scaleY: 0.8,
    duration: 1000,
    yoyo: true,
    repeat: -1,
  });

  // Get growth duration and start
  const duration = this.scene.serumManager.getGrowthDuration();
  if (this.scene.serumManager.appliesSerum()) {
    this.addToxicity(GameConfig.TOXICITY.PER_SERUM);
  }
  this.startGrowth(duration);
  this.scene.events.emit('tile-planted', this);
}
```

**CROP - Find:** Line 273-352 (`ripen()` method)

**Replace:**
```javascript
ripen() {
  console.log(`[Tile ${this.gridX},${this.gridY}] Crop ripened!`);
  this.state = GameConfig.TILE_STATE.RIPE;

  // Remove seed sprite
  if (this.seedSprite) {
    this.scene.tweens.add({
      targets: this.seedSprite,
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        if (this.seedSprite) {
          this.seedSprite.destroy();
          this.seedSprite = null;
        }
      },
    });
  }

  // Determine crop sprite based on health
  let cropKey = 'crop_healthy';
  if (this.corruptionLevel > 6) cropKey = 'crop_rotten';
  else if (this.isSick()) cropKey = 'crop_sick';

  // Create crop sprite
  this.cropSprite = this.scene.add.sprite(
    this.isoX,
    this.isoY + GameConfig.GRID.TILE_HEIGHT / 2,
    cropKey
  );
  this.cropSprite.setScale(0.6);

  // Grow animation
  this.scene.tweens.add({
    targets: this.cropSprite,
    scaleX: 0.8,
    scaleY: 0.8,
    duration: 400,
    ease: 'Back.easeOut',
  });

  // Idle bob animation
  this.scene.tweens.add({
    targets: this.cropSprite,
    y: this.cropSprite.y - 5,
    duration: 800,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut',
  });

  // Sparkles (keep this effect)
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 * i) / 5;
    const dist = 20;
    const sparkle = this.scene.add.circle(
      this.isoX + Math.cos(angle) * dist,
      this.isoY + GameConfig.GRID.TILE_HEIGHT / 2 + Math.sin(angle) * dist,
      3,
      0xFFFF00,
      1
    );
    this.scene.tweens.add({
      targets: sparkle,
      alpha: 0,
      scaleX: 0,
      scaleY: 0,
      duration: 600,
      delay: i * 50,
      onComplete: () => sparkle.destroy(),
    });
  }

  this.scene.events.emit('crop-ripened', this);
}
```

**Delete or simplify:** `corruptSeed()` and `corruptCrop()` methods (Lines 487-529) - just change texture instead:
```javascript
corruptSeed() {
  if (!this.seedSprite) return;
  this.seedSprite.setTexture('seed_corrupted');
}

corruptCrop() {
  if (!this.cropSprite) return;
  let cropKey = 'crop_healthy';
  if (this.corruptionLevel > 6) cropKey = 'crop_rotten';
  else if (this.isSick()) cropKey = 'crop_sick';
  this.cropSprite.setTexture(cropKey);
}
```

---

## 🐕 DOG

### Step 1: Add file
```
assets/images/entities/dog.png
```

### Step 2: Uncomment in PreloadScene.js (Line 40)

### Step 3: Edit src/entities/Dog.js

**Find:** Line 19-32 (`create()` method)

**Replace:**
```javascript
create() {
  // Create dog sprite instead of graphics
  this.sprite = this.scene.add.sprite(this.x, this.y, 'dog');
  this.sprite.setScale(0.8);
  this.sprite.setInteractive({ draggable: true });

  // Price label (keep existing code below)
  this.priceLabel = this.scene.add.text(
    this.x,
    this.y + 40,
    `$${this.price}`,
    GameConfig.TEXT_STYLES.PRICE
  );
  this.priceLabel.setOrigin(0.5);

  // Setup drag events (keep existing code)
  this.setupDragEvents();
}
```

---

## 🚚 TRUCK

### Step 1: Add file
```
assets/images/environment/truck.png
```

### Step 2: Uncomment in PreloadScene.js (Line 56)

### Step 3: Edit src/systems/TruckManager.js

**Find:** Line 64-97 (`createTruckZone()` and `drawTruck()` methods)

**Replace createTruckZone() section:**
```javascript
createTruckZone() {
  const x = GameConfig.UI.TRUCK_X;
  const y = GameConfig.UI.TRUCK_Y;
  const width = GameConfig.UI.TRUCK_WIDTH;
  const height = GameConfig.UI.TRUCK_HEIGHT;

  // Truck zone background
  this.truckZone = this.scene.add.graphics();
  this.truckZone.lineStyle(4, 0xFFD700, 1);
  this.truckZone.strokeRect(x - width / 2, y - height / 2, width, height);

  // Label
  const label = this.scene.add.text(x, y - height / 2 - 20, 'TRUCK ZONE', {
    fontSize: '20px',
    fontFamily: 'Arial, sans-serif',
    color: '#FFD700',
    stroke: '#000000',
    strokeThickness: 3,
    fontStyle: 'bold',
  });
  label.setOrigin(0.5);

  // Truck sprite (CHANGED FROM GRAPHICS)
  this.truckSprite = this.scene.add.sprite(x, y, 'truck');
  this.truckSprite.setScale(0.8); // Adjust to fit zone

  // Visit counter and timer (keep existing code)
  this.visitText = this.scene.add.text(x, y + height / 2 + 30, 'VISIT: 0/7', {...});
  this.timerText = this.scene.add.text(x, y + height / 2 + 60, 'NEXT: 10s', {...});
}
```

**Delete:** The entire `drawTruck()` method (Lines 78-97) - no longer needed!

---

## 🎭 "THE MAN" CHARACTER

### Step 1: Add file
```
assets/images/characters/the_man/the_man_portrait.png
```

### Step 2: Uncomment in PreloadScene.js (Line 45)

### Step 3: Edit src/scenes/NightCycleScene.js

**Find:** Line 103 (after creating dialogue box)

**Add after `createDialogueBox()` method:**
```javascript
createDialogueBox() {
  const boxY = 500;
  const boxHeight = 150;

  // Dialogue box background
  this.dialogueBox = this.add.graphics();
  // ... existing code ...

  // ADD THIS: Character portrait
  this.characterPortrait = this.add.sprite(150, boxY + boxHeight / 2, 'the_man_portrait');
  this.characterPortrait.setScale(0.6);
  this.characterPortrait.setOrigin(0.5);
  this.characterPortrait.setAlpha(0.8); // Slightly transparent for mystery

  // Existing speaker text and dialogue text code...
}
```

---

## 🔘 UI BUTTONS

### Step 1: Add files
```
assets/images/ui/buttons/
├── btn_water.png
├── btn_serum.png
└── btn_pay_cash.png
```

### Step 2: Uncomment in PreloadScene.js (Lines 68-71)

### Step 3A: Edit src/ui/ModeToggle.js

**Find:** Line 24-54 (`create()` method)

**Replace:**
```javascript
create() {
  const x = GameConfig.SCREEN.WIDTH / 2;
  const y = GameConfig.UI.TOGGLE_Y;

  // Water button sprite
  this.waterButton = this.scene.add.sprite(x - 70, y, 'btn_water');
  this.waterButton.setInteractive({ useHandCursor: true });
  this.waterButton.on('pointerdown', () => {
    this.scene.serumManager.setMode(GameConfig.MODE.WATER);
    this.updateButtonStates();
  });

  // Serum button sprite
  this.serumButton = this.scene.add.sprite(x + 70, y, 'btn_serum');
  this.serumButton.setInteractive({ useHandCursor: true });
  this.serumButton.on('pointerdown', () => {
    this.scene.serumManager.setMode(GameConfig.MODE.SERUM);
    this.updateButtonStates();
  });

  // Labels on top of buttons
  this.waterLabel = this.scene.add.text(x - 70, y, 'WATER', {
    fontSize: '18px',
    fontFamily: 'Arial',
    color: '#FFFFFF',
    stroke: '#000000',
    strokeThickness: 3,
  });
  this.waterLabel.setOrigin(0.5);

  this.serumLabel = this.scene.add.text(x + 70, y, 'SERUM', {
    fontSize: '18px',
    fontFamily: 'Arial',
    color: '#FFFFFF',
    stroke: '#000000',
    strokeThickness: 3,
  });
  this.serumLabel.setOrigin(0.5);

  this.updateButtonStates();
}

updateButtonStates() {
  if (this.scene.serumManager.getCurrentMode() === GameConfig.MODE.WATER) {
    this.waterButton.setTint(0xFFFFFF); // Bright
    this.serumButton.setTint(0x666666); // Dimmed
  } else {
    this.waterButton.setTint(0x666666);
    this.serumButton.setTint(0xFFFFFF);
  }
}
```

### Step 3B: Edit src/scenes/PaymentScene.js

**Find:** Line 389-420 (`createPayCashButton()` method)

**Replace:**
```javascript
createPayCashButton() {
  const buttonX = GameConfig.SCREEN.WIDTH / 2;
  const buttonY = 650;

  // Button sprite
  this.payCashButton = this.add.sprite(buttonX, buttonY, 'btn_pay_cash');
  this.payCashButton.setInteractive({ useHandCursor: true });

  // Text overlay
  const buttonText = this.add.text(buttonX, buttonY, 'PAY WITH CASH', {
    fontSize: '24px',
    fontFamily: 'Georgia, serif',
    color: '#FFFFFF',
    stroke: '#000000',
    strokeThickness: 3,
    fontStyle: 'bold',
  });
  buttonText.setOrigin(0.5);

  this.payCashButton.on('pointerdown', () => {
    this.payWithCash();
  });
}
```

---

## ✅ TESTING YOUR ASSETS

After adding each asset:

1. **Check PreloadScene.js** - Make sure the line is uncommented
2. **Run the game** - Watch the loading bar
3. **Check browser console (F12)** - Look for errors like:
   - `Failed to load: chicken` = Wrong file path
   - `404 Not Found` = File doesn't exist
4. **In-game** - Check if the asset appears correctly
5. **Scale adjustment** - Use `.setScale(0.5)` to make bigger/smaller

---

## 🎨 ASSET SPECS REMINDER

| Type | Size | Format |
|------|------|--------|
| Animals | 128x128px | PNG |
| Products | 64x64px | PNG |
| Crops/Seeds | 64x64px | PNG |
| Dog | 128x128px | PNG |
| Truck | 200x150px | PNG |
| Character Portrait | 512x512px | PNG |
| Buttons | 128x64px | PNG |
| Icons | 64x64px | PNG |

All with **transparent backgrounds** (alpha channel)!

---

## 📝 PROGRESS TRACKER

Check off as you complete each asset:

- [ ] Chicken (normal + corrupted)
- [ ] Cow (normal + corrupted)
- [ ] Sheep (normal + corrupted)
- [ ] Egg (normal + corrupted)
- [ ] Milk (4 stages: normal, brown, black, bloody)
- [ ] Wool (normal + corrupted)
- [ ] Seed (normal + corrupted)
- [ ] Crop (3 states: healthy, sick, rotten)
- [ ] Dog
- [ ] Truck
- [ ] The Man portrait
- [ ] Water button
- [ ] Serum button
- [ ] Pay Cash button

**You're all set! Start with 1-2 simple assets to test the workflow.**
