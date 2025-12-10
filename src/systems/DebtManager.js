/**
 * DebtManager.js
 * Manages economy, debt tracking, and day progression
 * Handles timer countdown and game over conditions
 */

import { GameConfig } from '../config/GameConfig.js';

export class DebtManager {
  constructor(scene) {
    this.scene = scene;
    this.cash = GameConfig.ECONOMY.STARTING_CASH;
    this.currentDay = 1;
    this.currentDebt = GameConfig.ECONOMY.DEBT_CURVE[1]; // Day 1 debt
    this.timeRemaining = GameConfig.TIMING.DAY_DURATION;
    this.debtCurve = GameConfig.ECONOMY.DEBT_CURVE;
    this.timerEvent = null;
  }

  /**
   * Initialize debt manager
   */
  create() {
    // Start day timer
    this.startDayTimer();

    // Listen for sell events
    this.scene.events.on('item-sold', (value, type) => {
      this.addCash(value);
      console.log(`[DebtManager] Sold ${type} for $${value}. Cash: $${this.cash}`);
    });

    console.log(`[DebtManager] Day ${this.currentDay} started. Debt: $${this.currentDebt}`);
  }

  /**
   * Start day countdown timer
   */
  startDayTimer() {
    this.timeRemaining = GameConfig.TIMING.DAY_DURATION;

    // Create timer event that runs every second
    this.timerEvent = this.scene.time.addEvent({
      delay: 1000, // 1 second
      callback: () => {
        this.timeRemaining--;

        if (this.timeRemaining <= 0) {
          this.checkDayEnd();
        }
      },
      loop: true,
    });
  }

  /**
   * Add cash
   */
  addCash(amount) {
    this.cash += amount;
    this.scene.events.emit('cash-updated', this.cash);
  }

  /**
   * Get current debt for current day
   */
  getCurrentDebt() {
    return this.currentDebt;
  }

  /**
   * Get time remaining in seconds
   */
  getTimeRemaining() {
    return Math.max(0, this.timeRemaining);
  }

  /**
   * Check day end conditions - transition to payment scene
   */
  checkDayEnd() {
    // Stop timer
    if (this.timerEvent) {
      this.timerEvent.remove();
      this.timerEvent = null;
    }

    console.log(`[DebtManager] Day ${this.currentDay} ended. Cash: $${this.cash}, Debt: $${this.currentDebt}`);

    // Transition to payment scene where player must pay
    this.scene.scene.pause('GameScene');
    this.scene.scene.launch('PaymentScene', {
      currentDay: this.currentDay,
      currentCash: this.cash,
      debtDue: this.currentDebt,
      harvestedCrops: [], // TODO: Pass actual harvested crops
      animals: this.scene.animalManager ? this.scene.animalManager.getAnimalsData() : [],
      products: this.scene.animalManager ? this.scene.animalManager.getProductsData() : [],
      farmToxicity: this.scene.farmManager.getTotalToxicity(),
    });
  }

  /**
   * Advance to next day
   */
  advanceDay() {
    this.currentDay++;

    // Update debt from curve
    if (this.currentDay < this.debtCurve.length) {
      this.currentDebt = this.debtCurve[this.currentDay];
    } else {
      // Beyond defined curve - extrapolate or set to max
      this.currentDebt = this.debtCurve[this.debtCurve.length - 1] * 2;
    }

    console.log(`[DebtManager] Advanced to Day ${this.currentDay}. New debt: $${this.currentDebt}`);

    // Emit event
    this.scene.events.emit('day-advanced', this.currentDay);

    // Restart timer
    this.startDayTimer();
  }

  /**
   * Trigger game over
   */
  gameOver() {
    console.log('[DebtManager] GAME OVER - Cannot pay debt');
    this.scene.events.emit('game-over', {
      day: this.currentDay,
      cash: this.cash,
      debt: this.currentDebt,
    });

    // Transition to Game Over scene
    this.scene.scene.start('GameOverScene', {
      day: this.currentDay,
      cash: this.cash,
      debt: this.currentDebt,
    });
  }

  /**
   * Update (called each frame)
   */
  update(delta) {
    // Timer is handled by time event, no per-frame updates needed
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.timerEvent) {
      this.timerEvent.remove();
      this.timerEvent = null;
    }
    this.scene.events.off('item-sold');
  }
}
