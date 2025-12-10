/**
 * InputManager.js
 * Handles drag & drop physics and truck zone
 * Manages selling of draggable items
 */

import { GameConfig } from '../config/GameConfig.js';

export class InputManager {
  constructor(scene) {
    this.scene = scene;
    this.truckZone = null;
    this.truckGraphics = null;
  }

  /**
   * Create truck zone and enable drag system
   */
  create() {
    this.createTruckZone();
    console.log('[InputManager] Truck zone created');
  }

  /**
   * Create visual truck zone
   */
  createTruckZone() {
    const x = GameConfig.UI.TRUCK_X;
    const y = GameConfig.UI.TRUCK_Y;
    const width = GameConfig.UI.TRUCK_WIDTH;
    const height = GameConfig.UI.TRUCK_HEIGHT;

    // Create graphics for visual representation
    this.truckGraphics = this.scene.add.graphics();
    this.truckGraphics.fillStyle(GameConfig.COLORS.TRUCK, 0.3);
    this.truckGraphics.fillRect(
      x - width / 2,
      y - height / 2,
      width,
      height
    );
    this.truckGraphics.lineStyle(4, GameConfig.COLORS.TRUCK, 1);
    this.truckGraphics.strokeRect(
      x - width / 2,
      y - height / 2,
      width,
      height
    );

    // Add label
    const truckLabel = this.scene.add.text(x, y, 'TRUCK\nDROP HERE\nTO SELL', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center',
    });
    truckLabel.setOrigin(0.5);

    // Create collision zone (invisible)
    this.truckZone = this.scene.add.zone(x, y, width, height);
    this.truckZone.setRectangleDropZone(width, height);

    // Store bounds for overlap check
    this.truckBounds = {
      left: x - width / 2,
      right: x + width / 2,
      top: y - height / 2,
      bottom: y + height / 2,
    };
  }

  /**
   * Check if object overlaps truck zone
   */
  checkTruckOverlap(object) {
    const objX = object.x;
    const objY = object.y;
    const bounds = this.truckBounds;

    return (
      objX >= bounds.left &&
      objX <= bounds.right &&
      objY >= bounds.top &&
      objY <= bounds.bottom
    );
  }

  /**
   * Register a draggable object (for future use if needed)
   */
  registerDraggable(object, value) {
    // Currently handled by individual entities
    // This method can be used for Dog, Fence, Player assets
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.truckGraphics) this.truckGraphics.destroy();
    if (this.truckZone) this.truckZone.destroy();
  }
}
