/**
 * Animal.js
 * Represents a farm animal that produces collectible products
 * Based on Hayday mechanics: passive production with max capacity
 */

import { GameConfig } from '../config/GameConfig.js';

export class Animal {
  constructor(scene, x, y, animalType) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.animalType = animalType; // 'CHICKEN', 'COW', or 'SHEEP'

    // Get config for this animal type
    this.config = GameConfig.ANIMALS[animalType];

    // Production state
    this.products = []; // Array of AnimalProduct entities
    this.productionTimer = null;
    this.isProducing = false;

    // Visual elements
    this.container = null;
    this.sprite = null;
    this.nameLabel = null;

    // Dragging state
    this.isDragging = false;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;

    this.create();
    this.startProduction();
  }

  /**
   * Create visual representation
   */
  create() {
    // Container to hold all visual elements
    this.container = this.scene.add.container(this.x, this.y);

    // Determine sprite key based on type and corruption
    let spriteKey = this.animalType.toLowerCase(); // 'chicken', 'cow', 'sheep'

    // Check if sprite exists in cache, otherwise use placeholder graphics
    const hasSprite = this.scene.textures.exists(spriteKey);
    console.log(`[Animal] Creating ${this.animalType}: Sprite '${spriteKey}' exists? ${hasSprite}`);

    if (hasSprite) {
      // USE SPRITE (your custom art)
      console.log(`[Animal] Using sprite for ${this.animalType}`);
      this.bodySprite = this.scene.add.sprite(0, 0, spriteKey);
      this.bodySprite.setScale(0.8); // Adjust scale to fit (change this if too big/small)
      this.container.add(this.bodySprite);

    } else {
      // FALLBACK: Use placeholder graphics if sprite not loaded
      console.warn(`[Animal] Sprite '${spriteKey}' not found, using placeholder graphics`);

      // Animal body (placeholder: rounded rectangle)
      const body = this.scene.add.graphics();
      body.fillStyle(this.config.color, 1);
      body.fillRoundedRect(-25, -30, 50, 60, 10);
      body.lineStyle(3, 0x000000, 1);
      body.strokeRoundedRect(-25, -30, 50, 60, 10);

      // Head (circle on top)
      const head = this.scene.add.circle(0, -45, 18, this.config.color);
      head.setStrokeStyle(3, 0x000000);

      // Eyes
      const eye1 = this.scene.add.circle(-8, -48, 3, 0x000000);
      const eye2 = this.scene.add.circle(8, -48, 3, 0x000000);

      // Type-specific features
      if (this.animalType === 'CHICKEN') {
        // Beak
        const beak = this.scene.add.triangle(0, -40, -5, 0, 5, 0, 0, 8, 0xFFAA00);
        beak.setStrokeStyle(2, 0x000000);
        this.container.add(beak);

        // Comb
        const comb = this.scene.add.graphics();
        comb.fillStyle(0xFF0000, 1);
        comb.fillTriangle(-3, -58, 0, -65, 3, -58);
        comb.lineStyle(1, 0x000000, 1);
        comb.strokeTriangle(-3, -58, 0, -65, 3, -58);
        this.container.add(comb);

      } else if (this.animalType === 'COW') {
        // Spots
        const spot1 = this.scene.add.circle(-10, -10, 8, 0x000000, 0.4);
        const spot2 = this.scene.add.circle(12, 5, 10, 0x000000, 0.4);
        this.container.add([spot1, spot2]);

        // Horns
        const horn1 = this.scene.add.graphics();
        horn1.lineStyle(3, 0x000000, 1);
        horn1.lineBetween(-12, -58, -18, -65);
        const horn2 = this.scene.add.graphics();
        horn2.lineStyle(3, 0x000000, 1);
        horn2.lineBetween(12, -58, 18, -65);
        this.container.add([horn1, horn2]);

      } else if (this.animalType === 'SHEEP') {
        // Fluffy wool texture (small circles)
        const wool = this.scene.add.graphics();
        wool.fillStyle(0xFFFFFF, 0.6);
        for (let i = 0; i < 5; i++) {
          const angle = (Math.PI * 2 * i) / 5;
          wool.fillCircle(Math.cos(angle) * 15, Math.sin(angle) * 15 - 5, 8);
        }
        this.container.add(wool);
      }

      // Add elements to container
      this.container.add([body, head, eye1, eye2]);
    }

    // Name label
    this.nameLabel = this.scene.add.text(0, 40, this.animalType, {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      backgroundColor: '#000000',
      padding: { x: 4, y: 2 },
    });
    this.nameLabel.setOrigin(0.5);
    this.container.add(this.nameLabel);

    // Production status indicator (small circle below name)
    this.statusIndicator = this.scene.add.circle(0, 55, 5, 0x00FF00);
    this.statusIndicator.setStrokeStyle(1, 0x000000);
    this.container.add(this.statusIndicator);

    // Idle animation (gentle bobbing)
    this.scene.tweens.add({
      targets: this.container,
      y: this.y + 5,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Make draggable
    this.setupDragging();
  }

  /**
   * Setup drag and drop behavior
   */
  setupDragging() {
    // Create an invisible interactive zone
    const hitArea = this.scene.add.rectangle(0, 0, 60, 90, 0x000000, 0);
    hitArea.setInteractive({ draggable: true, useHandCursor: true });
    this.container.add(hitArea);

    hitArea.on('pointerover', () => {
      if (!this.isDragging) {
        this.scene.tweens.add({
          targets: this.container,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 100,
        });
      }
    });

    hitArea.on('pointerout', () => {
      if (!this.isDragging) {
        this.scene.tweens.add({
          targets: this.container,
          scaleX: 1,
          scaleY: 1,
          duration: 100,
        });
      }
    });

    hitArea.on('dragstart', (pointer) => {
      this.isDragging = true;
      this.dragOffsetX = pointer.x - this.container.x;
      this.dragOffsetY = pointer.y - this.container.y;

      this.scene.tweens.add({
        targets: this.container,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 100,
      });

      // Stop production while dragging
      this.stopProduction();
    });

    hitArea.on('drag', (pointer, dragX, dragY) => {
      this.container.x = pointer.x - this.dragOffsetX;
      this.container.y = pointer.y - this.dragOffsetY;
    });

    hitArea.on('dragend', () => {
      this.isDragging = false;

      this.scene.tweens.add({
        targets: this.container,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
      });

      // Check if sold to truck
      if (this.scene.inputManager && this.scene.inputManager.checkTruckOverlap(this.container)) {
        this.sell();
      } else {
        // Snap back to original position
        this.scene.tweens.add({
          targets: this.container,
          x: this.x,
          y: this.y,
          duration: 200,
          ease: 'Back.easeOut',
          onComplete: () => {
            // Resume production
            this.startProduction();
          },
        });
      }
    });
  }

  /**
   * Start passive production
   */
  startProduction() {
    if (this.isProducing) return;

    // Only produce if under max capacity
    if (this.products.length >= this.config.maxProducts) {
      this.updateStatusIndicator(false);
      return;
    }

    this.isProducing = true;
    this.updateStatusIndicator(true);

    this.productionTimer = this.scene.time.addEvent({
      delay: this.config.productionTime,
      callback: () => this.produceProduct(),
      loop: false,
    });
  }

  /**
   * Stop production
   */
  stopProduction() {
    if (this.productionTimer) {
      this.productionTimer.remove();
      this.productionTimer = null;
    }
    this.isProducing = false;
    this.updateStatusIndicator(false);
  }

  /**
   * Produce a product
   * Note: Product creation is handled by AnimalManager
   * This method just does the visual effects
   */
  produceProduct() {
    // Check if at max capacity
    if (this.products.length >= this.config.maxProducts) {
      this.stopProduction();
      return;
    }

    // Production animation
    this.scene.tweens.add({
      targets: this.container,
      scaleX: 1.15,
      scaleY: 1.15,
      duration: 150,
      yoyo: true,
    });

    // Particle effect
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6;
      const particle = this.scene.add.circle(
        this.container.x,
        this.container.y - 50,
        3,
        0xFFD700
      );
      this.scene.tweens.add({
        targets: particle,
        x: particle.x + Math.cos(angle) * 25,
        y: particle.y + Math.sin(angle) * 25,
        alpha: 0,
        duration: 400,
        onComplete: () => particle.destroy(),
      });
    }

    // NOTE: AnimalManager will add the product to this.products array
    // Continue production check happens after product is added
  }

  /**
   * Remove a product from tracking (when sold/collected)
   */
  removeProduct(product) {
    const index = this.products.indexOf(product);
    if (index > -1) {
      this.products.splice(index, 1);
    }

    // Resume production if was at max
    if (this.products.length < this.config.maxProducts && !this.isProducing) {
      this.startProduction();
    }
  }

  /**
   * Update status indicator color
   */
  updateStatusIndicator(isProducing) {
    const color = isProducing ? 0x00FF00 : 0xFF0000;
    this.statusIndicator.setFillStyle(color);

    if (isProducing) {
      // Pulse animation when producing
      this.scene.tweens.add({
        targets: this.statusIndicator,
        alpha: 0.3,
        duration: 500,
        yoyo: true,
        repeat: -1,
      });
    } else {
      // Stop pulse
      this.scene.tweens.killTweensOf(this.statusIndicator);
      this.statusIndicator.setAlpha(1);
    }
  }

  /**
   * Sell this animal
   */
  sell() {
    const value = this.config.sellValue;

    // Add cash
    if (this.scene.debtManager) {
      this.scene.debtManager.addCash(value);
    }

    // Popup text
    const popup = this.scene.add.text(
      this.container.x,
      this.container.y - 50,
      `+$${value}`,
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
        this.container.x,
        this.container.y,
        6,
        0xFFD700
      );
      this.scene.tweens.add({
        targets: particle,
        x: particle.x + Math.cos(angle) * 50,
        y: particle.y + Math.sin(angle) * 50,
        alpha: 0,
        scaleX: 0.2,
        scaleY: 0.2,
        duration: 500,
        ease: 'Power2',
        onComplete: () => particle.destroy(),
      });
    }

    // Destroy this animal
    this.destroy();
  }

  /**
   * Get animal data for saving/transfer
   */
  getData() {
    return {
      type: this.animalType,
      x: this.x,
      y: this.y,
      productCount: this.products.length,
      sellValue: this.config.sellValue,
    };
  }

  /**
   * Clean up
   */
  destroy() {
    this.stopProduction();

    // Destroy all products
    this.products.forEach(product => {
      if (product.destroy) {
        product.destroy();
      }
    });
    this.products = [];

    // Destroy container
    if (this.container) {
      this.container.destroy();
    }
  }

  /**
   * Update method (called each frame if needed)
   */
  update() {
    // Future: Add behavior updates here if needed
  }
}
