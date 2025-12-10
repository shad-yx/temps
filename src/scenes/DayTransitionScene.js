/**
 * DayTransitionScene.js
 * Shows stats between days and gives player a moment to breathe
 */

import { GameConfig } from '../config/GameConfig.js';

export class DayTransitionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DayTransitionScene' });
  }

  init(data) {
    this.previousDay = data.previousDay || 1;
    this.nextDay = data.nextDay || 2;
    this.cashEarned = data.cashEarned || 0;
    this.debtPaid = data.debtPaid || 0;
    this.remainingCash = data.remainingCash || 0;
    this.nextDebt = data.nextDebt || 0;
    this.farmToxicity = data.farmToxicity || 0;
    this.cropsHarvested = data.cropsHarvested || 0;
  }

  create() {
    // Semi-transparent overlay
    const overlay = this.add.rectangle(
      0,
      0,
      GameConfig.SCREEN.WIDTH,
      GameConfig.SCREEN.HEIGHT,
      0x000000,
      0.8
    );
    overlay.setOrigin(0);

    // Day complete banner
    const banner = this.add.text(
      GameConfig.SCREEN.WIDTH / 2,
      100,
      `DAY ${this.previousDay} COMPLETE!`,
      {
        fontSize: '64px',
        fontFamily: 'Georgia, serif',
        color: '#FFD700',
        stroke: '#000000',
        strokeThickness: 6,
        fontStyle: 'bold',
      }
    );
    banner.setOrigin(0.5);

    // Animate banner
    banner.setScale(0);
    this.tweens.add({
      targets: banner,
      scaleX: 1,
      scaleY: 1,
      duration: 500,
      ease: 'Back.easeOut',
    });

    // Stats panel
    const panelX = GameConfig.SCREEN.WIDTH / 2;
    const panelY = 250;
    const lineHeight = 50;

    // Stats background
    const statsBg = this.add.graphics();
    statsBg.fillStyle(0x1A1A1A, 0.9);
    statsBg.fillRoundedRect(panelX - 300, panelY - 30, 600, 320, 15);
    statsBg.lineStyle(4, 0x444444, 1);
    statsBg.strokeRoundedRect(panelX - 300, panelY - 30, 600, 320, 15);

    // Cash earned
    this.createStatLine(
      panelX,
      panelY,
      'Cash Earned:',
      `$${this.cashEarned}`,
      this.cashEarned > 0 ? '#00FF00' : '#FFFFFF'
    );

    // Debt paid
    this.createStatLine(
      panelX,
      panelY + lineHeight,
      'Debt Paid:',
      `$${this.debtPaid}`,
      '#FF6666'
    );

    // Remaining cash
    this.createStatLine(
      panelX,
      panelY + lineHeight * 2,
      'Remaining Cash:',
      `$${this.remainingCash}`,
      this.remainingCash > 0 ? '#FFD700' : '#999999'
    );

    // Crops harvested
    this.createStatLine(
      panelX,
      panelY + lineHeight * 3,
      'Crops Harvested:',
      `${this.cropsHarvested}`,
      '#AAFFAA'
    );

    // Farm toxicity
    const toxicityColor = this.farmToxicity > 80 ? '#FF0000' :
                          this.farmToxicity > 40 ? '#FFAA00' : '#00FF00';
    this.createStatLine(
      panelX,
      panelY + lineHeight * 4,
      'Farm Toxicity:',
      `${this.farmToxicity}/160`,
      toxicityColor
    );

    // Divider
    const divider = this.add.graphics();
    divider.lineStyle(2, 0x666666, 1);
    divider.lineBetween(
      panelX - 280,
      panelY + lineHeight * 5 + 20,
      panelX + 280,
      panelY + lineHeight * 5 + 20
    );

    // Next day info
    const nextDayText = this.add.text(
      panelX,
      panelY + lineHeight * 5 + 50,
      `NEXT: DAY ${this.nextDay}`,
      {
        fontSize: '32px',
        fontFamily: 'Georgia, serif',
        color: '#FFD700',
        stroke: '#000000',
        strokeThickness: 4,
        fontStyle: 'bold',
      }
    );
    nextDayText.setOrigin(0.5);

    // Next debt
    const nextDebtText = this.add.text(
      panelX,
      panelY + lineHeight * 5 + 95,
      `Debt Due: $${this.nextDebt}`,
      {
        fontSize: '28px',
        fontFamily: 'Georgia, serif',
        color: '#FF4444',
        stroke: '#000000',
        strokeThickness: 3,
        fontStyle: 'bold',
      }
    );
    nextDebtText.setOrigin(0.5);

    // Warning if cash < next debt
    if (this.remainingCash < this.nextDebt) {
      const warningText = this.add.text(
        panelX,
        panelY + lineHeight * 5 + 130,
        '⚠ WARNING: Not enough cash! ⚠',
        {
          fontSize: '20px',
          fontFamily: 'Arial',
          color: '#FF0000',
          fontStyle: 'bold',
        }
      );
      warningText.setOrigin(0.5);

      // Pulse animation
      this.tweens.add({
        targets: warningText,
        alpha: 0.3,
        duration: 500,
        yoyo: true,
        repeat: -1,
      });
    }

    // Continue button
    this.createContinueButton();

    // Auto-continue after 5 seconds (optional)
    this.time.delayedCall(10000, () => {
      if (this.scene.isActive('DayTransitionScene')) {
        this.continueToNextDay();
      }
    });
  }

  /**
   * Create a stat line with label and value
   */
  createStatLine(x, y, label, value, valueColor = '#FFFFFF') {
    const labelText = this.add.text(x - 250, y, label, {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#CCCCCC',
    });
    labelText.setOrigin(0, 0.5);

    const valueText = this.add.text(x + 250, y, value, {
      fontSize: '28px',
      fontFamily: 'Georgia, serif',
      color: valueColor,
      stroke: '#000000',
      strokeThickness: 3,
      fontStyle: 'bold',
    });
    valueText.setOrigin(1, 0.5);

    // Animate values counting up
    if (value.startsWith('$')) {
      const amount = parseInt(value.replace(/[$,]/g, ''));
      this.countUpAnimation(valueText, 0, amount, 800, '$');
    } else if (!isNaN(parseInt(value))) {
      const num = parseInt(value.split('/')[0]);
      this.countUpAnimation(valueText, 0, num, 800, '', value.includes('/') ? '/' + value.split('/')[1] : '');
    }
  }

  /**
   * Count-up animation for numbers
   */
  countUpAnimation(textObject, start, end, duration, prefix = '', suffix = '') {
    let current = start;
    const increment = (end - start) / (duration / 16); // ~60fps

    const timer = this.time.addEvent({
      delay: 16,
      repeat: Math.floor(duration / 16),
      callback: () => {
        current += increment;
        if (current >= end) {
          current = end;
          timer.remove();
        }
        textObject.setText(`${prefix}${Math.floor(current)}${suffix}`);
      },
    });
  }

  /**
   * Create continue button
   */
  createContinueButton() {
    const buttonX = GameConfig.SCREEN.WIDTH / 2;
    const buttonY = 620;

    const buttonBg = this.add.rectangle(buttonX, buttonY, 300, 70, 0x2E7D32);
    buttonBg.setStrokeStyle(4, 0x4CAF50);

    const buttonText = this.add.text(buttonX, buttonY, 'CONTINUE', {
      fontSize: '32px',
      fontFamily: 'Georgia, serif',
      color: '#FFFFFF',
      fontStyle: 'bold',
    });
    buttonText.setOrigin(0.5);

    // Make interactive
    buttonBg.setInteractive({ useHandCursor: true });

    buttonBg.on('pointerover', () => {
      buttonBg.setFillStyle(0x388E3C);
      this.tweens.add({
        targets: [buttonBg, buttonText],
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 100,
      });
    });

    buttonBg.on('pointerout', () => {
      buttonBg.setFillStyle(0x2E7D32);
      this.tweens.add({
        targets: [buttonBg, buttonText],
        scaleX: 1,
        scaleY: 1,
        duration: 100,
      });
    });

    buttonBg.on('pointerdown', () => {
      this.tweens.add({
        targets: [buttonBg, buttonText],
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 50,
        yoyo: true,
        onComplete: () => this.continueToNextDay(),
      });
    });

    // Pulse animation
    this.tweens.add({
      targets: buttonBg,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  /**
   * Continue to next day
   */
  continueToNextDay() {
    // Fade out
    this.cameras.main.fadeOut(300, 0, 0, 0);

    this.time.delayedCall(300, () => {
      this.scene.stop('DayTransitionScene');
      this.scene.resume('GameScene');
    });
  }
}
