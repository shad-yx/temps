/**
 * ModeToggle.js
 * Button to toggle between WATER and SERUM modes
 */

import { GameConfig } from '../config/GameConfig.js';

export class ModeToggle {
  constructor(scene) {
    this.scene = scene;
    this.button = null;
    this.buttonText = null;
    this.background = null;
    this.icon = null;
  }

  /**
   * Create mode toggle button
   */
  create() {
    const x = GameConfig.SCREEN.WIDTH / 2;
    const y = GameConfig.UI.TOGGLE_Y;

    // Create background with gradient effect
    this.background = this.scene.add.rectangle(
      x,
      y,
      240,
      60,
      GameConfig.COLORS.WATER_MODE,
      0.9
    );
    this.background.setStrokeStyle(4, 0x000000);
    this.background.setDepth(1000);

    // Add inner border for depth
    this.innerBorder = this.scene.add.rectangle(
      x,
      y,
      232,
      52,
      0x000000,
      0
    );
    this.innerBorder.setStrokeStyle(2, 0xFFFFFF, 0.3);
    this.innerBorder.setDepth(1000);

    // Create icon (droplet for water, flask for serum)
    this.icon = this.scene.add.circle(x - 80, y, 12, 0x4FC3F7);
    this.icon.setDepth(1001);
    this.icon.setStrokeStyle(2, 0x000000);

    // Create button text
    this.buttonText = this.scene.add.text(
      x,
      y,
      'WATER',
      GameConfig.TEXT_STYLES.BUTTON
    );
    this.buttonText.setOrigin(0.5);
    this.buttonText.setDepth(1001);

    // Add subtitle
    this.subtitle = this.scene.add.text(
      x + 70,
      y,
      '[SAFE]',
      {
        fontSize: '14px',
        fontFamily: 'Arial',
        color: '#AAAAAA',
        fontStyle: 'bold',
      }
    );
    this.subtitle.setOrigin(0.5);
    this.subtitle.setDepth(1001);

    // Make interactive
    this.background.setInteractive({ useHandCursor: true });

    this.background.on('pointerdown', () => {
      this.toggleMode();
    });

    this.background.on('pointerover', () => {
      this.scene.tweens.add({
        targets: [this.background, this.innerBorder],
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100,
      });
    });

    this.background.on('pointerout', () => {
      this.scene.tweens.add({
        targets: [this.background, this.innerBorder],
        scaleX: 1,
        scaleY: 1,
        duration: 100,
      });
    });

    // Idle pulse animation for icon
    this.scene.tweens.add({
      targets: this.icon,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  /**
   * Toggle mode
   */
  toggleMode() {
    if (this.scene.serumManager) {
      this.scene.serumManager.toggleMode();
      this.updateVisual();

      // Click animation
      this.scene.tweens.add({
        targets: [this.background, this.innerBorder, this.buttonText, this.subtitle, this.icon],
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 50,
        yoyo: true,
      });

      // Screen shake effect
      this.scene.cameras.main.shake(100, 0.002);
    }
  }

  /**
   * Update button visual based on current mode
   */
  updateVisual() {
    const mode = this.scene.serumManager.getCurrentMode();

    if (mode === GameConfig.MODE.SERUM) {
      // Serum mode - RED/TOXIC
      this.background.setFillStyle(GameConfig.COLORS.SERUM_MODE, 0.9);
      this.buttonText.setText('SERUM');
      this.buttonText.setColor('#FFFF00'); // Yellow text
      this.subtitle.setText('[TOXIC]');
      this.subtitle.setColor('#FF0000');

      // Change icon to flask shape (triangle)
      this.icon.setFillStyle(0xFF0000);
      this.icon.setStrokeStyle(3, 0x000000);

      // Pulse effect for danger
      this.scene.tweens.add({
        targets: this.background,
        alpha: 0.7,
        duration: 300,
        yoyo: true,
        repeat: 2,
      });

      // Particle effect
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6;
        const particle = this.scene.add.circle(
          this.background.x,
          this.background.y,
          4,
          0xFF0000,
          0.8
        );
        particle.setDepth(999);

        this.scene.tweens.add({
          targets: particle,
          x: particle.x + Math.cos(angle) * 50,
          y: particle.y + Math.sin(angle) * 50,
          alpha: 0,
          duration: 500,
          onComplete: () => particle.destroy(),
        });
      }
    } else {
      // Water mode - SAFE/BLUE
      this.background.setFillStyle(GameConfig.COLORS.WATER_MODE, 0.9);
      this.buttonText.setText('WATER');
      this.buttonText.setColor('#FFFFFF'); // White text
      this.subtitle.setText('[SAFE]');
      this.subtitle.setColor('#AAAAAA');

      // Change icon back to droplet
      this.icon.setFillStyle(0x4FC3F7);
      this.icon.setStrokeStyle(2, 0x000000);

      // Gentle fade
      this.scene.tweens.add({
        targets: this.background,
        alpha: 1,
        duration: 300,
      });
    }
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.background) this.background.destroy();
    if (this.innerBorder) this.innerBorder.destroy();
    if (this.buttonText) this.buttonText.destroy();
    if (this.subtitle) this.subtitle.destroy();
    if (this.icon) this.icon.destroy();
  }
}
