/**
 * ModeManager.js
 * Manages PLAY vs BUILD mode switching
 */

export class ModeManager {
  constructor() {
    this.currentMode = 'PLAY'; // 'PLAY' or 'BUILD'
    this.currentIteration = null;
  }

  /**
   * Switch to PLAY mode
   */
  switchToPlay(iterationName) {
    this.currentMode = 'PLAY';
    this.currentIteration = iterationName;
    console.log(`[ModeManager] Switched to PLAY mode: ${iterationName}`);
  }

  /**
   * Switch to BUILD mode
   */
  switchToBuild(iterationName) {
    this.currentMode = 'BUILD';
    this.currentIteration = iterationName;
    console.log(`[ModeManager] Switched to BUILD mode: ${iterationName}`);
  }

  /**
   * Check if in PLAY mode
   */
  isPlayMode() {
    return this.currentMode === 'PLAY';
  }

  /**
   * Check if in BUILD mode
   */
  isBuildMode() {
    return this.currentMode === 'BUILD';
  }

  /**
   * Get current mode
   */
  getMode() {
    return this.currentMode;
  }

  /**
   * Get current iteration name
   */
  getCurrentIteration() {
    return this.currentIteration;
  }
}
