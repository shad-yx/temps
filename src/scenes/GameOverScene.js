/**
 * GameOverScene.js
 * Displays "FORECLOSED" message when player fails to pay debt
 */

import { GameConfig } from '../config/GameConfig.js';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.finalDay = data.day || 1;
    this.finalCash = data.cash || 0;
    this.finalDebt = data.debt || 0;
  }

  create() {
    // Black background
    this.cameras.main.setBackgroundColor('#000000');

    // "FORECLOSED" title
    const title = this.add.text(
      GameConfig.SCREEN.WIDTH / 2,
      200,
      'FORECLOSED',
      GameConfig.TEXT_STYLES.GAME_OVER
    );
    title.setOrigin(0.5);

    // Day reached
    const dayText = this.add.text(
      GameConfig.SCREEN.WIDTH / 2,
      320,
      `Day ${this.finalDay} Reached`,
      GameConfig.TEXT_STYLES.GAME_OVER_SMALL
    );
    dayText.setOrigin(0.5);

    // Cash info
    const cashText = this.add.text(
      GameConfig.SCREEN.WIDTH / 2,
      380,
      `Cash: $${this.finalCash}`,
      GameConfig.TEXT_STYLES.GAME_OVER_SMALL
    );
    cashText.setOrigin(0.5);

    // Debt info
    const debtText = this.add.text(
      GameConfig.SCREEN.WIDTH / 2,
      420,
      `Debt: $${this.finalDebt}`,
      GameConfig.TEXT_STYLES.GAME_OVER_SMALL
    );
    debtText.setOrigin(0.5);

    // Try Again button
    const buttonBg = this.add.rectangle(
      GameConfig.SCREEN.WIDTH / 2,
      550,
      200,
      60,
      0x444444
    );
    buttonBg.setStrokeStyle(3, 0xFFFFFF);
    buttonBg.setInteractive({ useHandCursor: true });

    const buttonText = this.add.text(
      GameConfig.SCREEN.WIDTH / 2,
      550,
      'Try Again',
      {
        fontSize: '28px',
        fontFamily: 'Arial',
        color: '#FFFFFF',
      }
    );
    buttonText.setOrigin(0.5);

    // Button interactions
    buttonBg.on('pointerdown', () => {
      this.restartGame();
    });

    buttonBg.on('pointerover', () => {
      buttonBg.setFillStyle(0x666666);
    });

    buttonBg.on('pointerout', () => {
      buttonBg.setFillStyle(0x444444);
    });

    // Add subtle animation
    this.tweens.add({
      targets: title,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  /**
   * Restart the game
   */
  restartGame() {
    this.scene.start('GameScene');
  }
}
