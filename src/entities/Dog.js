/**
 * Dog.js
 * Sellable dog asset worth $500
 * Can be dragged to truck and sold
 */

import { GameConfig } from '../config/GameConfig.js';

export class Dog {
  constructor(scene, x, y) {
    this.scene = scene;
    this.value = GameConfig.ECONOMY.PRICES.DOG;
    this.originalX = x;
    this.originalY = y;
    this.isDragging = false;

    // Check if dog sprite exists in cache
    const hasSprite = scene.textures.exists('dog');

    if (hasSprite) {
      // USE SPRITE (your custom art)
      this.sprite = scene.add.sprite(x, y, 'dog');
      this.sprite.setScale(0.8);
    } else {
      // FALLBACK: Use placeholder graphics
      this.sprite = scene.add.rectangle(x, y, 60, 40, GameConfig.COLORS.DOG);
      this.sprite.setStrokeStyle(3, 0x000000);
    }

    // Add label
    this.label = scene.add.text(x, y, 'DOG', {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 2,
    });
    this.label.setOrigin(0.5);

    // Add price label
    this.priceLabel = scene.add.text(x, y - 30, `$${this.value}`, {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#FFFF00',
      stroke: '#000000',
      strokeThickness: 3,
    });
    this.priceLabel.setOrigin(0.5);

    // Enable drag
    this.enableDrag();
  }

  /**
   * Enable drag functionality
   */
  enableDrag() {
    this.sprite.setInteractive({ draggable: true, useHandCursor: true });

    this.sprite.on('dragstart', () => {
      this.onDragStart();
    });

    this.sprite.on('drag', (pointer, dragX, dragY) => {
      this.onDrag(pointer, dragX, dragY);
    });

    this.sprite.on('dragend', () => {
      this.onDragEnd();
    });
  }

  /**
   * Handle drag start
   */
  onDragStart() {
    this.isDragging = true;
    this.sprite.setAlpha(0.7);
    this.sprite.setDepth(1000);
    this.label.setDepth(1001);
    this.priceLabel.setDepth(1001);
  }

  /**
   * Handle drag movement
   */
  onDrag(pointer, dragX, dragY) {
    this.sprite.x = dragX;
    this.sprite.y = dragY;
    this.label.x = dragX;
    this.label.y = dragY;
    this.priceLabel.x = dragX;
    this.priceLabel.y = dragY - 30;
  }

  /**
   * Handle drag end
   */
  onDragEnd() {
    this.isDragging = false;
    this.sprite.setAlpha(1);
    this.sprite.setDepth(0);
    this.label.setDepth(1);
    this.priceLabel.setDepth(1);

    // Check if dropped on truck zone
    const inputManager = this.scene.inputManager;
    if (inputManager && inputManager.checkTruckOverlap(this.sprite)) {
      this.sell();
    } else {
      // Snap back to original position
      this.snapBack();
    }
  }

  /**
   * Snap back to original position
   */
  snapBack() {
    this.scene.tweens.add({
      targets: [this.sprite, this.label, this.priceLabel],
      x: this.originalX,
      y: { from: this.sprite.y, to: this.originalY },
      duration: 200,
      ease: 'Back.easeOut',
      onUpdate: () => {
        this.label.x = this.sprite.x;
        this.label.y = this.sprite.y;
        this.priceLabel.x = this.sprite.x;
        this.priceLabel.y = this.sprite.y - 30;
      },
    });
  }

  /**
   * Sell the dog
   */
  sell() {
    // Emit sell event
    this.scene.events.emit('item-sold', this.value, 'dog');

    console.log(`[Dog] Sold for $${this.value}`);

    // Destroy self
    this.destroy();
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.sprite) this.sprite.destroy();
    if (this.label) this.label.destroy();
    if (this.priceLabel) this.priceLabel.destroy();
  }
}
