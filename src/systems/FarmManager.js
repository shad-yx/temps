/**
 * FarmManager.js
 * Manages 4x4 grid of farm tiles
 * Handles tile creation, interaction, and toxicity tracking
 */

import { GameConfig } from '../config/GameConfig.js';
import { Tile } from '../entities/Tile.js';

export class FarmManager {
  constructor(scene) {
    this.scene = scene;
    this.tiles = [];
  }

  /**
   * Create 4x4 grid of tiles
   */
  create() {
    for (let row = 0; row < GameConfig.GRID.ROWS; row++) {
      this.tiles[row] = [];
      for (let col = 0; col < GameConfig.GRID.COLS; col++) {
        const tile = new Tile(this.scene, row, col);
        this.tiles[row][col] = tile;
      }
    }

    console.log('[FarmManager] Created 4x4 grid');
  }

  /**
   * Get tile at grid position
   */
  getTile(gridX, gridY) {
    if (gridX >= 0 && gridX < GameConfig.GRID.ROWS &&
        gridY >= 0 && gridY < GameConfig.GRID.COLS) {
      return this.tiles[gridX][gridY];
    }
    return null;
  }

  /**
   * Get total toxicity across all tiles
   */
  getTotalToxicity() {
    let total = 0;
    for (let row = 0; row < GameConfig.GRID.ROWS; row++) {
      for (let col = 0; col < GameConfig.GRID.COLS; col++) {
        total += this.tiles[row][col].toxicity;
      }
    }
    return total;
  }

  /**
   * Get all tiles as flat array
   */
  getAllTiles() {
    const allTiles = [];
    for (let row = 0; row < GameConfig.GRID.ROWS; row++) {
      for (let col = 0; col < GameConfig.GRID.COLS; col++) {
        allTiles.push(this.tiles[row][col]);
      }
    }
    return allTiles;
  }

  /**
   * Update (called each frame)
   */
  update(delta) {
    // No per-frame updates needed currently
    // Tile timers are handled by Phaser's time system
  }

  /**
   * Cleanup
   */
  destroy() {
    for (let row = 0; row < GameConfig.GRID.ROWS; row++) {
      for (let col = 0; col < GameConfig.GRID.COLS; col++) {
        if (this.tiles[row][col]) {
          this.tiles[row][col].destroy();
        }
      }
    }
    this.tiles = [];
  }
}
