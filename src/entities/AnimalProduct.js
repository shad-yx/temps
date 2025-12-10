/**
 * AnimalProduct.js
 * Represents a collectible product from animals (eggs, milk, wool)
 * Draggable and sellable like crops
 */

import { GameConfig } from '../config/GameConfig.js';

export class AnimalProduct {
  constructor(scene, x, y, productType, value) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.productType = productType; // 'EGG', 'MILK', or 'WOOL'
    this.value = value;
    this.corruptionLevel = 0; // 0-10: visual corruption progression

    // Visual elements
    this.sprite = null;
    this.priceLabel = null;
    this.shadow = null;

    // Dragging state
    this.isDragging = false;
    this.originalX = x;
    this.originalY = y;

    this.create();
  }

  /**
   * Create visual representation
   */
  create() {
    // Shadow (appears under product)
    this.shadow = this.scene.add.ellipse(this.x, this.y + 15, 30, 10, 0x000000, 0.3);

    // Determine sprite key based on product type
    let spriteKey = this.productType.toLowerCase(); // 'egg', 'milk', 'wool'

    // Check if sprite exists in cache
    const hasSprite = this.scene.textures.exists(spriteKey);
    console.log(`[AnimalProduct] Creating ${this.productType}: Sprite '${spriteKey}' exists? ${hasSprite}`);

    if (hasSprite) {
      // USE SPRITE (your custom art)
      console.log(`[AnimalProduct] Using sprite for ${this.productType}`);
      this.sprite = this.scene.add.sprite(this.x, this.y, spriteKey);
      this.sprite.setScale(0.6); // Adjust scale for products (smaller than animals)

    } else {
      // FALLBACK: Use placeholder graphics
      console.warn(`[AnimalProduct] Sprite '${spriteKey}' not found, using placeholder graphics`);
      this.sprite = this.scene.add.graphics();
      this.sprite.x = this.x;
      this.sprite.y = this.y;

      if (this.productType === 'EGG') {
      // Egg: white oval
      this.sprite.fillStyle(0xFFFAF0, 1);
      this.sprite.fillEllipse(0, 0, 20, 28);
      this.sprite.lineStyle(2, 0xE0D5B7, 1);
      this.sprite.strokeEllipse(0, 0, 20, 28);

      // Slight speckles
      this.sprite.fillStyle(0xD2B48C, 0.3);
      this.sprite.fillCircle(-4, -5, 2);
      this.sprite.fillCircle(3, 2, 2);
      this.sprite.fillCircle(-2, 6, 1.5);

    } else if (this.productType === 'MILK') {
      // Milk: bottle/jug shape
      this.sprite.fillStyle(0xFFFFFF, 1);
      this.sprite.fillRoundedRect(-12, -5, 24, 30, 5);
      this.sprite.lineStyle(2, 0xCCCCCC, 1);
      this.sprite.strokeRoundedRect(-12, -5, 24, 30, 5);

      // Bottle neck
      this.sprite.fillStyle(0xFFFFFF, 1);
      this.sprite.fillRect(-6, -15, 12, 12);
      this.sprite.lineStyle(2, 0xCCCCCC, 1);
      this.sprite.strokeRect(-6, -15, 12, 12);

      // Cap
      this.sprite.fillStyle(0xFF0000, 1);
      this.sprite.fillRect(-7, -17, 14, 4);
      this.sprite.lineStyle(2, 0x000000, 1);
      this.sprite.strokeRect(-7, -17, 14, 4);

      // Label
      this.sprite.fillStyle(0x87CEEB, 0.4);
      this.sprite.fillRect(-8, 0, 16, 10);

    } else if (this.productType === 'WOOL') {
      // Wool: fluffy cloud shape
      this.sprite.fillStyle(0xFFFAFA, 1);

      // Create fluffy appearance with overlapping circles
      const circles = [
        { x: 0, y: 0, r: 10 },
        { x: -8, y: -3, r: 8 },
        { x: 8, y: -3, r: 8 },
        { x: -6, y: 6, r: 7 },
        { x: 6, y: 6, r: 7 },
        { x: 0, y: -8, r: 6 },
      ];

      circles.forEach(c => {
        this.sprite.fillCircle(c.x, c.y, c.r);
      });

      // Outline
      this.sprite.lineStyle(2, 0xE0E0E0, 1);
      circles.forEach(c => {
        this.sprite.strokeCircle(c.x, c.y, c.r);
      });
      }
    }

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
    this.priceLabel.setScale(0);
    this.scene.tweens.add({
      targets: [this.sprite, this.priceLabel],
      scaleX: 1,
      scaleY: 1,
      duration: 300,
      ease: 'Back.easeOut',
    });

    // Idle animation (gentle float)
    this.scene.tweens.add({
      targets: this.sprite,
      y: this.y - 5,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Setup click to sell (no dragging)
    this.setupClickToSell();
  }

  /**
   * Setup click to sell behavior (no dragging)
   */
  setupClickToSell() {
    // Make sprite interactive with a fixed size hitbox
    this.sprite.setInteractive(
      new Phaser.Geom.Circle(0, 0, 30),
      Phaser.Geom.Circle.Contains
    );

    this.sprite.on('pointerover', () => {
      this.scene.tweens.add({
        targets: this.sprite,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 100,
      });
      // Change cursor to pointer
      this.scene.input.setDefaultCursor('pointer');
    });

    this.sprite.on('pointerout', () => {
      this.scene.tweens.add({
        targets: this.sprite,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
      });
      // Reset cursor
      this.scene.input.setDefaultCursor('default');
    });

    // Click to sell
    this.sprite.on('pointerdown', () => {
      this.sell();
    });
  }

  /**
   * Sell this product
   */
  sell() {
    // Increment stats based on product type
    if (this.scene.statsPanel) {
      const statKey = this.productType.toLowerCase() + 's'; // 'egg' → 'eggs'
      this.scene.statsPanel.incrementStat(statKey);
    }

    // Add cash
    if (this.scene.debtManager) {
      this.scene.debtManager.addCash(this.value);
    }

    // Popup text
    const popup = this.scene.add.text(
      this.sprite.x,
      this.sprite.y - 30,
      `+$${this.value}`,
      GameConfig.TEXT_STYLES.PRICE
    );
    popup.setOrigin(0.5);

    this.scene.tweens.add({
      targets: popup,
      y: popup.y - 50,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => popup.destroy(),
    });

    // Particle burst
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const particle = this.scene.add.circle(
        this.sprite.x,
        this.sprite.y,
        5,
        0xFFD700
      );
      this.scene.tweens.add({
        targets: particle,
        x: particle.x + Math.cos(angle) * 40,
        y: particle.y + Math.sin(angle) * 40,
        alpha: 0,
        duration: 400,
        ease: 'Power2',
        onComplete: () => particle.destroy(),
      });
    }

    // Shrink and fade out
    this.scene.tweens.add({
      targets: [this.sprite, this.priceLabel, this.shadow],
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      duration: 300,
      onComplete: () => this.destroy(),
    });
  }

  /**
   * Apply corruption to product (story-driven)
   */
  applyCorruption(amount) {
    this.corruptionLevel = Math.min(this.corruptionLevel + amount, 10);
    console.log(`[AnimalProduct ${this.productType}] Corruption increased to ${this.corruptionLevel}`);

    // Recreate sprite with corrupted visuals
    if (this.sprite) {
      const oldX = this.sprite.x;
      const oldY = this.sprite.y;
      this.sprite.destroy();
      this.sprite = null;

      // Recreate with corruption
      this.createCorruptedProduct(oldX, oldY);
    }
  }

  /**
   * Create corrupted product visuals
   */
  createCorruptedProduct(x, y) {
    this.sprite = this.scene.add.graphics();
    this.sprite.x = x;
    this.sprite.y = y;

    if (this.productType === 'MILK') {
      // Milk corruption stages: White → Brown → Black → Bloody
      let milkColor = 0xFFFFFF; // White (healthy)
      let labelColor = 0x87CEEB; // Light blue label

      if (this.corruptionLevel <= 3) {
        milkColor = 0xD2B48C; // Light brown (early corruption)
      } else if (this.corruptionLevel <= 6) {
        milkColor = 0x8B4513; // Dark brown (moderate corruption)
        labelColor = 0x654321;
      } else if (this.corruptionLevel <= 8) {
        milkColor = 0x1A1A1A; // Black (severe corruption)
        labelColor = 0x000000;
      } else {
        milkColor = 0x8B0000; // Dark red/bloody (critical corruption)
        labelColor = 0x8B0000;
      }

      // Bottle body
      this.sprite.fillStyle(milkColor, 1);
      this.sprite.fillRoundedRect(-12, -5, 24, 30, 5);
      this.sprite.lineStyle(2, 0xCCCCCC, 1);
      this.sprite.strokeRoundedRect(-12, -5, 24, 30, 5);

      // Bottle neck
      this.sprite.fillStyle(milkColor, 1);
      this.sprite.fillRect(-6, -15, 12, 12);
      this.sprite.lineStyle(2, 0xCCCCCC, 1);
      this.sprite.strokeRect(-6, -15, 12, 12);

      // Cap
      this.sprite.fillStyle(0xFF0000, 1);
      this.sprite.fillRect(-7, -17, 14, 4);

      // Label (corrupted color)
      this.sprite.fillStyle(labelColor, 0.4);
      this.sprite.fillRect(-8, 0, 16, 10);

      // Add blood drips if highly corrupted
      if (this.corruptionLevel > 8) {
        for (let i = 0; i < 3; i++) {
          this.sprite.fillStyle(0x8B0000, 0.8);
          this.sprite.fillEllipse(-8 + i * 6, 26, 2, 6);
        }
      }

    } else if (this.productType === 'EGG') {
      // Egg corruption: White → Brown spots → Cracked/rotten
      let eggColor = 0xFFFAF0; // Healthy white
      let speckleColor = 0xD2B48C;

      if (this.corruptionLevel > 5) {
        eggColor = 0xD2B48C; // Brown/rotten
        speckleColor = 0x8B4513;
      }

      this.sprite.fillStyle(eggColor, 1);
      this.sprite.fillEllipse(0, 0, 20, 28);
      this.sprite.lineStyle(2, 0xE0D5B7, 1);
      this.sprite.strokeEllipse(0, 0, 20, 28);

      // Add corruption spots/cracks
      if (this.corruptionLevel > 3) {
        this.sprite.fillStyle(speckleColor, 0.6);
        for (let i = 0; i < this.corruptionLevel; i++) {
          const angle = (Math.PI * 2 * i) / this.corruptionLevel;
          this.sprite.fillCircle(Math.cos(angle) * 6, Math.sin(angle) * 8, 3);
        }
      }

      // Cracks if severe
      if (this.corruptionLevel > 7) {
        this.sprite.lineStyle(2, 0x000000, 0.8);
        this.sprite.beginPath();
        this.sprite.moveTo(0, -10);
        this.sprite.lineTo(3, 0);
        this.sprite.lineTo(-2, 8);
        this.sprite.strokePath();
      }

    } else if (this.productType === 'WOOL') {
      // Wool corruption: White → Grey → Dark/matted
      let woolColor = 0xFFFAFA; // Healthy white
      let outlineColor = 0xE0E0E0;

      if (this.corruptionLevel > 3) {
        woolColor = 0xC0C0C0; // Grey (dirty)
        outlineColor = 0xA0A0A0;
      }
      if (this.corruptionLevel > 6) {
        woolColor = 0x808080; // Dark grey (very dirty/matted)
        outlineColor = 0x606060;
      }

      this.sprite.fillStyle(woolColor, 1);

      // Fluffy circles
      const circles = [
        { x: 0, y: 0, r: 10 },
        { x: -8, y: -3, r: 8 },
        { x: 8, y: -3, r: 8 },
        { x: -6, y: 6, r: 7 },
        { x: 6, y: 6, r: 7 },
        { x: 0, y: -8, r: 6 },
      ];

      circles.forEach(c => {
        this.sprite.fillCircle(c.x, c.y, c.r);
      });

      // Outline
      this.sprite.lineStyle(2, outlineColor, 1);
      circles.forEach(c => {
        this.sprite.strokeCircle(c.x, c.y, c.r);
      });
    }

    // Add shaking/trembling if highly corrupted
    if (this.corruptionLevel > 6) {
      this.scene.tweens.add({
        targets: this.sprite,
        x: this.sprite.x + 1,
        duration: 100,
        yoyo: true,
        repeat: -1,
      });
    }
  }

  /**
   * Get product data for saving/transfer
   */
  getData() {
    return {
      type: this.productType,
      value: this.value,
      x: this.sprite.x,
      y: this.sprite.y,
      corruption: this.corruptionLevel,
    };
  }

  /**
   * Clean up
   */
  destroy() {
    if (this.sprite) this.sprite.destroy();
    if (this.priceLabel) this.priceLabel.destroy();
    if (this.shadow) this.shadow.destroy();
  }
}
