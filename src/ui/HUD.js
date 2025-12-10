/**
 * HUD.js
 * Heads-up display showing game stats
 * Cash, Day, Timer, Debt
 */

import { GameConfig } from '../config/GameConfig.js';

export class HUD {
  constructor(scene) {
    this.scene = scene;
    this.cashText = null;
    this.dayText = null;
    this.timerText = null;
    this.debtText = null;
    this.cashBg = null;
    this.debtBg = null;
    this.centerBg = null;
    this.lastCash = 0;
    this.lastTime = 60;
  }

  /**
   * Create HUD elements
   */
  create() {
    const y = GameConfig.UI.HUD_Y;
    const padding = GameConfig.UI.HUD_PADDING;

    // Add semi-transparent background bar
    const barHeight = 60;
    const topBar = this.scene.add.graphics();
    topBar.fillStyle(0x000000, 0.7);
    topBar.fillRect(0, 0, GameConfig.SCREEN.WIDTH, barHeight);
    topBar.setDepth(999);

    // Cash panel (left) with background
    this.cashBg = this.scene.add.graphics();
    this.cashBg.fillStyle(0x2E7D32, 0.8);
    this.cashBg.fillRoundedRect(padding, y - 25, 180, 50, 10);
    this.cashBg.lineStyle(3, 0x4CAF50, 1);
    this.cashBg.strokeRoundedRect(padding, y - 25, 180, 50, 10);
    this.cashBg.setDepth(1000);

    this.cashText = this.scene.add.text(
      padding + 90,
      y,
      'Cash: $0',
      GameConfig.TEXT_STYLES.HUD
    );
    this.cashText.setOrigin(0.5, 0.5);
    this.cashText.setDepth(1001);

    // Center panel (day and timer)
    this.centerBg = this.scene.add.graphics();
    this.centerBg.fillStyle(0x1565C0, 0.8);
    this.centerBg.fillRoundedRect(
      GameConfig.SCREEN.WIDTH / 2 - 150,
      y - 25,
      300,
      50,
      10
    );
    this.centerBg.lineStyle(3, 0x42A5F5, 1);
    this.centerBg.strokeRoundedRect(
      GameConfig.SCREEN.WIDTH / 2 - 150,
      y - 25,
      300,
      50,
      10
    );
    this.centerBg.setDepth(1000);

    this.dayText = this.scene.add.text(
      GameConfig.SCREEN.WIDTH / 2 - 50,
      y,
      'Day: 1',
      GameConfig.TEXT_STYLES.HUD
    );
    this.dayText.setOrigin(0.5, 0.5);
    this.dayText.setDepth(1001);

    this.timerText = this.scene.add.text(
      GameConfig.SCREEN.WIDTH / 2 + 50,
      y,
      '60s',
      GameConfig.TEXT_STYLES.HUD
    );
    this.timerText.setOrigin(0.5, 0.5);
    this.timerText.setDepth(1001);

    // Debt panel (right)
    this.debtBg = this.scene.add.graphics();
    this.debtBg.fillStyle(0xC62828, 0.8);
    this.debtBg.fillRoundedRect(
      GameConfig.SCREEN.WIDTH - padding - 200,
      y - 25,
      200,
      50,
      10
    );
    this.debtBg.lineStyle(3, 0xF44336, 1);
    this.debtBg.strokeRoundedRect(
      GameConfig.SCREEN.WIDTH - padding - 200,
      y - 25,
      200,
      50,
      10
    );
    this.debtBg.setDepth(1000);

    this.debtText = this.scene.add.text(
      GameConfig.SCREEN.WIDTH - padding - 100,
      y,
      'Debt: $100',
      GameConfig.TEXT_STYLES.HUD
    );
    this.debtText.setOrigin(0.5, 0.5);
    this.debtText.setDepth(1001);
  }

  /**
   * Update HUD values
   */
  update() {
    if (!this.scene.debtManager) return;

    const debtManager = this.scene.debtManager;

    // Update cash with animation
    const currentCash = debtManager.cash;
    if (currentCash !== this.lastCash) {
      this.cashText.setText(`$${currentCash}`);
      this.animateCashChange(currentCash > this.lastCash);
      this.lastCash = currentCash;
    }

    // Update day
    this.dayText.setText(`Day ${debtManager.currentDay}`);

    // Update timer with color change
    const timeRemaining = debtManager.getTimeRemaining();
    this.timerText.setText(`${timeRemaining}s`);

    // Change timer color when low
    if (timeRemaining <= 10 && timeRemaining > 0) {
      this.timerText.setColor('#FF0000');
      if (timeRemaining % 2 === 0) {
        this.timerText.setScale(1.2);
      } else {
        this.timerText.setScale(1.0);
      }
    } else {
      this.timerText.setColor('#FFFFFF');
      this.timerText.setScale(1.0);
    }

    this.lastTime = timeRemaining;

    // Update debt
    const debt = debtManager.getCurrentDebt();
    this.debtText.setText(`Debt: $${debt}`);

    // Visual warning if cash < debt
    if (currentCash < debt && timeRemaining <= 15) {
      this.debtBg.clear();
      this.debtBg.fillStyle(0x8B0000, 0.9);
      this.debtBg.fillRoundedRect(
        GameConfig.SCREEN.WIDTH - 220,
        5,
        200,
        50,
        10
      );
      this.debtBg.lineStyle(4, 0xFF0000, 1);
      this.debtBg.strokeRoundedRect(
        GameConfig.SCREEN.WIDTH - 220,
        5,
        200,
        50,
        10
      );
    }
  }

  /**
   * Animate cash change
   */
  animateCashChange(isIncrease) {
    const color = isIncrease ? 0x00FF00 : 0xFF0000;

    this.scene.tweens.add({
      targets: this.cashText,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 100,
      yoyo: true,
      onComplete: () => {
        this.cashText.setScale(1);
      },
    });

    // Flash background
    this.cashBg.clear();
    this.cashBg.fillStyle(color, 0.6);
    this.cashBg.fillRoundedRect(20, 5, 180, 50, 10);
    this.cashBg.lineStyle(3, 0x4CAF50, 1);
    this.cashBg.strokeRoundedRect(20, 5, 180, 50, 10);

    this.scene.time.delayedCall(150, () => {
      this.cashBg.clear();
      this.cashBg.fillStyle(0x2E7D32, 0.8);
      this.cashBg.fillRoundedRect(20, 5, 180, 50, 10);
      this.cashBg.lineStyle(3, 0x4CAF50, 1);
      this.cashBg.strokeRoundedRect(20, 5, 180, 50, 10);
    });
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.cashText) this.cashText.destroy();
    if (this.dayText) this.dayText.destroy();
    if (this.timerText) this.timerText.destroy();
    if (this.debtText) this.debtText.destroy();
    if (this.cashBg) this.cashBg.destroy();
    if (this.debtBg) this.debtBg.destroy();
    if (this.centerBg) this.centerBg.destroy();
  }
}
