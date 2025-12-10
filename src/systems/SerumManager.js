/**
 * SerumManager.js
 * Manages Water/Serum mode toggle and visual effects
 * Handles toxicity overlay and cursor changes
 */

import { GameConfig } from '../config/GameConfig.js';

export class SerumManager {
  constructor(scene) {
    this.scene = scene;
    this.currentMode = GameConfig.MODE.WATER;
    this.toxicityOverlay = null;
  }

  /**
   * Initialize serum manager
   */
  create() {
    // Create toxicity overlay (green tint)
    this.createToxicityOverlay();

    console.log('[SerumManager] Initialized in WATER mode');
  }

  /**
   * Create toxicity overlay graphics
   */
  createToxicityOverlay() {
    this.toxicityOverlay = this.scene.add.graphics();
    this.toxicityOverlay.setDepth(999); // High depth to overlay everything
    this.toxicityOverlay.setAlpha(0); // Start invisible
  }

  /**
   * Toggle between WATER and SERUM modes
   */
  toggleMode() {
    if (this.currentMode === GameConfig.MODE.WATER) {
      this.currentMode = GameConfig.MODE.SERUM;
      console.log('[SerumManager] Switched to SERUM mode');
    } else {
      this.currentMode = GameConfig.MODE.WATER;
      console.log('[SerumManager] Switched to WATER mode');
    }

    // Emit event
    this.scene.events.emit('mode-changed', this.currentMode);

    // Update cursor
    this.updateCursor();
  }

  /**
   * Get current mode
   */
  getCurrentMode() {
    return this.currentMode;
  }

  /**
   * Get growth duration based on current mode
   */
  getGrowthDuration() {
    return this.currentMode === GameConfig.MODE.SERUM
      ? GameConfig.TIMING.SERUM_GROW_TIME
      : GameConfig.TIMING.NORMAL_GROW_TIME;
  }

  /**
   * Check if current mode applies serum
   */
  appliesSerum() {
    return this.currentMode === GameConfig.MODE.SERUM;
  }

  /**
   * Update cursor based on mode
   */
  updateCursor() {
    if (this.currentMode === GameConfig.MODE.SERUM) {
      this.scene.input.setDefaultCursor('crosshair');
      // In a real game, we'd set a custom red cursor image
    } else {
      this.scene.input.setDefaultCursor('default');
    }
  }

  /**
   * Update toxicity overlay based on total farm toxicity
   */
  updateToxicityOverlay(totalToxicity) {
    if (!this.toxicityOverlay) return;

    // Calculate opacity based on toxicity
    // Max toxicity = 16 tiles * 10 = 160
    const maxPossibleToxicity = GameConfig.GRID.ROWS * GameConfig.GRID.COLS * GameConfig.TOXICITY.MAX;
    const opacity = Math.min(totalToxicity / maxPossibleToxicity, 0.5); // Cap at 50% opacity

    // Clear and redraw overlay
    this.toxicityOverlay.clear();
    this.toxicityOverlay.fillStyle(GameConfig.COLORS.TOXICITY_TINT, opacity);
    this.toxicityOverlay.fillRect(
      0,
      0,
      GameConfig.SCREEN.WIDTH,
      GameConfig.SCREEN.HEIGHT
    );
  }

  /**
   * Update (called each frame)
   */
  update() {
    // Update toxicity overlay
    if (this.scene.farmManager) {
      const totalToxicity = this.scene.farmManager.getTotalToxicity();
      this.updateToxicityOverlay(totalToxicity);
    }
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.toxicityOverlay) this.toxicityOverlay.destroy();
  }
}
