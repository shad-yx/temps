/**
 * MenuScene.js
 * Main menu - Boot screen with DEADDAY title
 * Two options: PLAY or BUILD
 */

import { GameConfig } from '../config/GameConfig.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    console.log('[MenuScene] Initializing main menu');

    // Dark background
    this.cameras.main.setBackgroundColor('#0a0a0a');

    // Title: DEADDAY
    const title = this.add.text(
      GameConfig.SCREEN.WIDTH / 2,
      200,
      'DEADDAY',
      {
        fontSize: '96px',
        fontFamily: 'Georgia, serif',
        color: '#8B0000',
        stroke: '#000000',
        strokeThickness: 8,
        fontStyle: 'bold',
      }
    );
    title.setOrigin(0.5);

    // Subtitle
    const subtitle = this.add.text(
      GameConfig.SCREEN.WIDTH / 2,
      290,
      'Visual Novel Engine',
      {
        fontSize: '24px',
        fontFamily: 'Georgia, serif',
        color: '#888888',
        stroke: '#000000',
        strokeThickness: 3,
      }
    );
    subtitle.setOrigin(0.5);

    // Fade in title
    title.setAlpha(0);
    subtitle.setAlpha(0);

    this.tweens.add({
      targets: [title, subtitle],
      alpha: 1,
      duration: 1000,
      ease: 'Power2',
      delay: 300,
    });

    // Wait a moment, then show buttons
    this.time.delayedCall(1500, () => {
      this.createButtons();
    });
  }

  /**
   * Create PLAY and BUILD buttons
   */
  createButtons() {
    const centerX = GameConfig.SCREEN.WIDTH / 2;
    const startY = 420;
    const spacing = 100;

    // PLAY button
    const playButton = this.createButton(
      centerX,
      startY,
      'PLAY',
      0x4CAF50,
      0x66BB6A,
      () => this.onPlayClicked()
    );

    // BUILD button
    const buildButton = this.createButton(
      centerX,
      startY + spacing,
      'BUILD',
      0x2196F3,
      0x42A5F5,
      () => this.onBuildClicked()
    );

    // Fade in buttons
    playButton.bg.setAlpha(0);
    playButton.text.setAlpha(0);
    buildButton.bg.setAlpha(0);
    buildButton.text.setAlpha(0);

    this.tweens.add({
      targets: [playButton.bg, playButton.text, buildButton.bg, buildButton.text],
      alpha: 1,
      duration: 500,
      ease: 'Power2',
    });

    // Add idle pulse animation to buttons
    this.tweens.add({
      targets: [playButton.bg, playButton.text],
      scaleX: 1.02,
      scaleY: 1.02,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.tweens.add({
      targets: [buildButton.bg, buildButton.text],
      scaleX: 1.02,
      scaleY: 1.02,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 750, // Offset from play button
    });
  }

  /**
   * Create a button with background and text
   */
  createButton(x, y, label, color, hoverColor, callback) {
    // Button background
    const bg = this.add.rectangle(x, y, 300, 60, color);
    bg.setStrokeStyle(3, 0xFFFFFF);

    // Button text
    const text = this.add.text(x, y, label, {
      fontSize: '32px',
      fontFamily: 'Georgia, serif',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 4,
      fontStyle: 'bold',
    });
    text.setOrigin(0.5);

    // Make interactive
    bg.setInteractive({ useHandCursor: true });

    bg.on('pointerover', () => {
      bg.setFillStyle(hoverColor);
      this.tweens.add({
        targets: [bg, text],
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 100,
      });
    });

    bg.on('pointerout', () => {
      bg.setFillStyle(color);
      this.tweens.add({
        targets: [bg, text],
        scaleX: 1,
        scaleY: 1,
        duration: 100,
      });
    });

    bg.on('pointerdown', callback);

    return { bg, text };
  }

  /**
   * PLAY button clicked - go to iteration selector
   */
  onPlayClicked() {
    console.log('[MenuScene] PLAY clicked');

    // Fade out
    this.cameras.main.fadeOut(300);

    this.cameras.main.once('camerafadeoutcomplete', () => {
      // For now, start the existing game
      // TODO: Replace with IterationSelectScene
      this.scene.start('DialogueScene', {
        dialogueKey: 'intro',
        nextScene: 'GameScene',
        nextSceneData: {},
      });
    });
  }

  /**
   * BUILD button clicked - go to editor
   */
  onBuildClicked() {
    console.log('[MenuScene] BUILD clicked');

    // Fade out
    this.cameras.main.fadeOut(300);

    this.cameras.main.once('camerafadeoutcomplete', () => {
      // Show Unified Builder
      if (window.EditorUI) {
        window.EditorUI.show();
      } else {
        alert('Builder not ready yet. Wait a moment and try again.');
        this.cameras.main.fadeIn(300);
      }
    });
  }
}
