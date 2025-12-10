/**
 * Crop.js
 * Draggable harvest product that can be sold
 */

import { GameConfig } from '../config/GameConfig.js';

export class Crop {
  constructor(scene, x, y, isHealthy) {
    this.scene = scene;
    this.isHealthy = isHealthy;
    this.value = isHealthy
      ? GameConfig.ECONOMY.PRICES.CROP_HEALTHY
      : GameConfig.ECONOMY.PRICES.CROP_SICK;

    this.originalX = x;
    this.originalY = y;
    this.isDragging = false;

    // Determine sprite key based on health
    let spriteKey = isHealthy ? 'crop_healthy' : 'crop_sick';

    // Check if sprite exists in cache
    const hasSprite = scene.textures.exists(spriteKey);

    if (hasSprite) {
      // USE SPRITE (your custom art)
      this.sprite = scene.add.sprite(x, y, spriteKey);
      this.sprite.setScale(0.5);
    } else {
      // FALLBACK: Use placeholder graphics
      const color = isHealthy
        ? GameConfig.COLORS.CROP_HEALTHY
        : GameConfig.COLORS.CROP_SICK;

      this.sprite = scene.add.rectangle(x, y, 20, 20, color);
      this.sprite.setStrokeStyle(2, 0x000000);
    }

    // Add price label
    this.priceLabel = scene.add.text(x, y - 15, `$${this.value}`, {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 2,
    });
    this.priceLabel.setOrigin(0.5);

    // Enable click to sell
    this.enableClickToSell();
  }

  /**
   * Enable click to sell functionality (no dragging)
   */
  enableClickToSell() {
    this.sprite.setInteractive({ useHandCursor: true });

    this.sprite.on('pointerover', () => {
      this.scene.tweens.add({
        targets: this.sprite,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 100,
      });
    });

    this.sprite.on('pointerout', () => {
      this.scene.tweens.add({
        targets: this.sprite,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
      });
    });

    this.sprite.on('pointerdown', () => {
      this.sell();
    });
  }

  /**
   * Handle drag start
   */
  onDragStart() {
    this.isDragging = true;
    this.sprite.setDepth(1000); // Bring to front
    this.priceLabel.setDepth(1001);

    // Add shadow
    if (!this.shadow) {
      this.shadow = this.scene.add.ellipse(
        this.sprite.x,
        this.sprite.y + 15,
        30,
        10,
        0x000000,
        0.4
      );
      this.shadow.setDepth(999);
    }

    // Scale up animation
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 150,
      ease: 'Back.easeOut',
    });

    // Rotate slightly
    this.scene.tweens.add({
      targets: this.sprite,
      angle: -5,
      duration: 100,
    });
  }

  /**
   * Handle drag movement
   */
  onDrag(pointer, dragX, dragY) {
    this.sprite.x = dragX;
    this.sprite.y = dragY;
    this.priceLabel.x = dragX;
    this.priceLabel.y = dragY - 25;

    // Move shadow
    if (this.shadow) {
      this.shadow.x = dragX;
      this.shadow.y = dragY + 20;
    }

    // Check if over truck zone and highlight
    const inputManager = this.scene.inputManager;
    const baseColor = this.isHealthy
      ? GameConfig.COLORS.CROP_HEALTHY
      : GameConfig.COLORS.CROP_SICK;

    if (inputManager && inputManager.checkTruckOverlap(this.sprite)) {
      this.sprite.setFillStyle(0x00FF00); // Green highlight
    } else {
      this.sprite.setFillStyle(baseColor); // Restore original color
    }
  }

  /**
   * Handle drag end
   */
  onDragEnd() {
    this.isDragging = false;
    this.sprite.setDepth(0);
    this.priceLabel.setDepth(1);

    // Remove shadow
    if (this.shadow) {
      this.shadow.destroy();
      this.shadow = null;
    }

    // Scale back
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 1,
      scaleY: 1,
      angle: 0,
      duration: 150,
    });

    // Check if dropped on truck zone
    const inputManager = this.scene.inputManager;
    if (inputManager && inputManager.checkTruckOverlap(this.sprite)) {
      this.sell();
    } else {
      // Snap back to original position
      const baseColor = this.isHealthy
        ? GameConfig.COLORS.CROP_HEALTHY
        : GameConfig.COLORS.CROP_SICK;
      this.sprite.setFillStyle(baseColor);
      this.snapBack();
    }
  }

  /**
   * Snap back to original position
   */
  snapBack() {
    this.scene.tweens.add({
      targets: [this.sprite, this.priceLabel],
      x: this.originalX,
      y: { from: this.sprite.y, to: this.originalY },
      duration: 200,
      ease: 'Back.easeOut',
      onUpdate: () => {
        this.priceLabel.x = this.sprite.x;
        this.priceLabel.y = this.sprite.y - 15;
      },
    });
  }

  /**
   * Sell this crop
   */
  sell() {
    // Increment stats
    if (this.scene.statsPanel) {
      this.scene.statsPanel.incrementStat('harvests');
    }

    // Emit sell event
    this.scene.events.emit('item-sold', this.value, 'crop');

    // Cash popup animation
    const cashPopup = this.scene.add.text(
      this.sprite.x,
      this.sprite.y,
      `+$${this.value}`,
      {
        fontSize: '32px',
        fontFamily: 'Arial, sans-serif',
        color: '#00FF00',
        stroke: '#000000',
        strokeThickness: 4,
        fontStyle: 'bold',
      }
    );
    cashPopup.setOrigin(0.5);
    cashPopup.setDepth(2000);

    this.scene.tweens.add({
      targets: cashPopup,
      y: cashPopup.y - 80,
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 800,
      ease: 'Power2',
      onComplete: () => cashPopup.destroy(),
    });

    // Particle burst effect
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const particle = this.scene.add.circle(
        this.sprite.x,
        this.sprite.y,
        4,
        0xFFD700,
        1
      );
      particle.setDepth(1500);

      this.scene.tweens.add({
        targets: particle,
        x: particle.x + Math.cos(angle) * 40,
        y: particle.y + Math.sin(angle) * 40,
        alpha: 0,
        duration: 400,
        onComplete: () => particle.destroy(),
      });
    }

    // Shrink and destroy
    this.scene.tweens.add({
      targets: [this.sprite, this.priceLabel],
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      duration: 200,
      onComplete: () => this.destroy(),
    });
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.sprite) this.sprite.destroy();
    if (this.priceLabel) this.priceLabel.destroy();
  }
}
