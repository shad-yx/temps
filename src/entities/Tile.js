/**
 * Tile.js
 * Individual farm tile with isometric rendering
 * Handles state, toxicity, and visual representation
 */

import { GameConfig } from '../config/GameConfig.js';

export class Tile {
  constructor(scene, gridX, gridY) {
    this.scene = scene;
    this.gridX = gridX;
    this.gridY = gridY;

    // Calculate isometric position
    const pos = this.gridToIso(gridX, gridY);
    this.isoX = pos.x;
    this.isoY = pos.y;

    // Tile properties
    this.state = GameConfig.TILE_STATE.EMPTY;
    this.toxicity = 0;
    this.corruptionLevel = 0; // 0-10: visual corruption progression

    // Graphics objects
    this.graphics = scene.add.graphics();
    this.seedSprite = null;
    this.cropSprite = null;
    this.labelText = null;
    this.corruptionOverlay = null; // Dark/blood overlay for corruption

    // Growth timer
    this.growthTimer = null;

    // Render initial tile
    this.render();
    this.setInteractive(true);
  }

  /**
   * Convert grid coordinates to isometric screen position
   */
  gridToIso(gridX, gridY) {
    const tileW = GameConfig.GRID.TILE_WIDTH;
    const tileH = GameConfig.GRID.TILE_HEIGHT;
    const originX = GameConfig.GRID.ORIGIN_X;
    const originY = GameConfig.GRID.ORIGIN_Y;

    return {
      x: (gridX - gridY) * (tileW / 2) + originX,
      y: (gridX + gridY) * (tileH / 2) + originY,
    };
  }

  /**
   * Get tile color based on toxicity level
   */
  getTileColor() {
    if (this.toxicity <= GameConfig.TOXICITY.HEALTHY_MAX) {
      return GameConfig.COLORS.TILE_HEALTHY;
    } else if (this.toxicity <= GameConfig.TOXICITY.SICK_MAX) {
      return GameConfig.COLORS.TILE_SICK;
    } else {
      return GameConfig.COLORS.TILE_DEAD;
    }
  }

  /**
   * Get darker shade for depth faces
   */
  getTileDarkColor() {
    if (this.toxicity <= GameConfig.TOXICITY.HEALTHY_MAX) {
      return GameConfig.COLORS.TILE_HEALTHY_DARK;
    } else if (this.toxicity <= GameConfig.TOXICITY.SICK_MAX) {
      return GameConfig.COLORS.TILE_SICK_DARK;
    } else {
      return GameConfig.COLORS.TILE_DEAD_DARK;
    }
  }

  /**
   * Render isometric tile with depth and enhanced visuals
   */
  render() {
    this.graphics.clear();

    const tileW = GameConfig.GRID.TILE_WIDTH;
    const tileH = GameConfig.GRID.TILE_HEIGHT;
    const depth = GameConfig.GRID.TILE_DEPTH;
    const x = this.isoX;
    const y = this.isoY;

    const color = this.getTileColor();
    const darkColor = this.getTileDarkColor();

    // Draw shadow/depth
    this.graphics.fillStyle(0x000000, 0.3);
    this.graphics.fillEllipse(x, y + tileH + depth, tileW * 0.7, tileH * 0.3);

    // Draw right depth face with gradient effect
    this.graphics.fillStyle(darkColor, 1);
    this.graphics.beginPath();
    this.graphics.moveTo(x, y);
    this.graphics.lineTo(x + tileW / 2, y + tileH / 2);
    this.graphics.lineTo(x + tileW / 2, y + tileH / 2 + depth);
    this.graphics.lineTo(x, y + depth);
    this.graphics.closePath();
    this.graphics.fillPath();

    // Draw left depth face (darker)
    this.graphics.fillStyle(darkColor, 0.7);
    this.graphics.beginPath();
    this.graphics.moveTo(x, y);
    this.graphics.lineTo(x - tileW / 2, y + tileH / 2);
    this.graphics.lineTo(x - tileW / 2, y + tileH / 2 + depth);
    this.graphics.lineTo(x, y + depth);
    this.graphics.closePath();
    this.graphics.fillPath();

    // Draw top face (diamond) with gradient
    this.graphics.fillStyle(color, 1);
    this.graphics.beginPath();
    this.graphics.moveTo(x, y);                          // Top point
    this.graphics.lineTo(x + tileW / 2, y + tileH / 2); // Right point
    this.graphics.lineTo(x, y + tileH);                  // Bottom point
    this.graphics.lineTo(x - tileW / 2, y + tileH / 2); // Left point
    this.graphics.closePath();
    this.graphics.fillPath();

    // Add highlight on top (brighter center using simple white overlay)
    this.graphics.fillStyle(0xFFFFFF, 0.2);
    this.graphics.fillEllipse(x, y + tileH / 3, tileW * 0.4, tileH * 0.2);

    // Draw corruption overlay if corrupted
    if (this.corruptionLevel > 0) {
      this.renderCorruptionOverlay();
    }

    // Draw outline with enhanced thickness
    this.graphics.lineStyle(3, 0x000000, 0.6);
    this.graphics.beginPath();
    this.graphics.moveTo(x, y);
    this.graphics.lineTo(x + tileW / 2, y + tileH / 2);
    this.graphics.lineTo(x, y + tileH);
    this.graphics.lineTo(x - tileW / 2, y + tileH / 2);
    this.graphics.closePath();
    this.graphics.strokePath();

    // Update label if exists
    if (this.labelText) {
      this.labelText.setText(`${this.toxicity}`);
    }
  }

  /**
   * Make tile interactive
   */
  setInteractive(enabled) {
    if (enabled) {
      const x = this.isoX;
      const y = this.isoY;
      const tileW = GameConfig.GRID.TILE_WIDTH;
      const tileH = GameConfig.GRID.TILE_HEIGHT;

      // Create a polygon relative to the tile's isometric position
      this.graphics.setInteractive(
        new Phaser.Geom.Polygon([
          x, y,                          // Top point
          x + tileW / 2, y + tileH / 2, // Right point
          x, y + tileH,                  // Bottom point
          x - tileW / 2, y + tileH / 2, // Left point
        ]),
        Phaser.Geom.Polygon.Contains
      );

      this.graphics.on('pointerdown', () => this.handleClick());
      this.graphics.on('pointerover', () => this.graphics.setAlpha(0.8));
      this.graphics.on('pointerout', () => this.graphics.setAlpha(1));
    } else {
      this.graphics.disableInteractive();
    }
  }

  /**
   * Handle tile click
   */
  handleClick() {
    console.log(`[Tile ${this.gridX},${this.gridY}] Clicked! State: ${this.state}, Toxicity: ${this.toxicity}`);

    if (this.state === GameConfig.TILE_STATE.EMPTY && !this.isDead()) {
      this.plantSeed();
    } else if (this.state === GameConfig.TILE_STATE.RIPE) {
      this.harvest();
    } else {
      console.log(`[Tile ${this.gridX},${this.gridY}] Cannot interact - State: ${this.state}, Dead: ${this.isDead()}`);
    }
  }

  /**
   * Plant seed on this tile
   */
  plantSeed() {
    console.log(`[Tile ${this.gridX},${this.gridY}] Planting seed...`);
    this.state = GameConfig.TILE_STATE.PLANTED;

    // Create seed visual with animation
    this.seedSprite = this.scene.add.circle(
      this.isoX,
      this.isoY + GameConfig.GRID.TILE_HEIGHT / 2 - 20,
      0,
      GameConfig.COLORS.SEED
    );
    this.seedSprite.setStrokeStyle(2, 0x000000);

    // Animate seed planting (pop in)
    this.scene.tweens.add({
      targets: this.seedSprite,
      radius: 8,
      y: this.isoY + GameConfig.GRID.TILE_HEIGHT / 2,
      duration: 300,
      ease: 'Back.easeOut',
    });

    // Pulse animation while growing
    this.scene.tweens.add({
      targets: this.seedSprite,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });

    // Get growth duration from SerumManager
    const duration = this.scene.serumManager.getGrowthDuration();
    console.log(`[Tile ${this.gridX},${this.gridY}] Growth duration: ${duration}ms`);

    // Apply serum toxicity if in serum mode
    if (this.scene.serumManager.appliesSerum()) {
      console.log(`[Tile ${this.gridX},${this.gridY}] Applying serum toxicity +${GameConfig.TOXICITY.PER_SERUM}`);
      this.addToxicity(GameConfig.TOXICITY.PER_SERUM);

      // Visual effect for serum application
      const serumParticle = this.scene.add.circle(
        this.isoX,
        this.isoY + GameConfig.GRID.TILE_HEIGHT / 2,
        10,
        0xFF0000,
        0.6
      );
      this.scene.tweens.add({
        targets: serumParticle,
        scaleX: 2,
        scaleY: 2,
        alpha: 0,
        duration: 500,
        onComplete: () => serumParticle.destroy(),
      });
    }

    // Start growth timer
    this.startGrowth(duration);

    // Emit event
    this.scene.events.emit('tile-planted', this);
  }

  /**
   * Start growth timer
   */
  startGrowth(duration) {
    this.growthTimer = this.scene.time.delayedCall(duration, () => {
      this.ripen();
    });
  }

  /**
   * Ripen crop
   */
  ripen() {
    console.log(`[Tile ${this.gridX},${this.gridY}] Crop ripened! Sick: ${this.isSick()}`);
    this.state = GameConfig.TILE_STATE.RIPE;

    // Animate seed transforming to crop
    if (this.seedSprite) {
      this.scene.tweens.add({
        targets: this.seedSprite,
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        duration: 200,
        onComplete: () => {
          if (this.seedSprite) {
            this.seedSprite.destroy();
            this.seedSprite = null;
          }
        },
      });
    }

    // Create crop visual with animation
    const cropColor = this.isSick()
      ? GameConfig.COLORS.CROP_SICK
      : GameConfig.COLORS.CROP_HEALTHY;

    this.cropSprite = this.scene.add.rectangle(
      this.isoX,
      this.isoY + GameConfig.GRID.TILE_HEIGHT / 2 - 10,
      0,
      0,
      cropColor
    );
    this.cropSprite.setStrokeStyle(3, 0x000000);

    // Grow animation
    this.scene.tweens.add({
      targets: this.cropSprite,
      width: 22,
      height: 22,
      y: this.isoY + GameConfig.GRID.TILE_HEIGHT / 2,
      duration: 400,
      ease: 'Back.easeOut',
    });

    // Idle bob animation
    this.scene.tweens.add({
      targets: this.cropSprite,
      y: this.isoY + GameConfig.GRID.TILE_HEIGHT / 2 - 3,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Sparkle effect when ripe
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 * i) / 5;
      const dist = 20;
      const sparkle = this.scene.add.circle(
        this.isoX + Math.cos(angle) * dist,
        this.isoY + GameConfig.GRID.TILE_HEIGHT / 2 + Math.sin(angle) * dist,
        3,
        0xFFFF00,
        1
      );
      this.scene.tweens.add({
        targets: sparkle,
        alpha: 0,
        scaleX: 0,
        scaleY: 0,
        duration: 600,
        delay: i * 50,
        onComplete: () => sparkle.destroy(),
      });
    }

    // Emit event
    this.scene.events.emit('crop-ripened', this);
  }

  /**
   * Harvest crop - spawn draggable Crop entity
   */
  harvest() {
    console.log(`[Tile ${this.gridX},${this.gridY}] Harvesting crop...`);

    // Remove crop visual
    if (this.cropSprite) {
      this.cropSprite.destroy();
      this.cropSprite = null;
    }

    // Spawn draggable crop entity
    const Crop = this.scene.cropClass; // Will be set by GameScene
    if (!Crop) {
      console.error(`[Tile ${this.gridX},${this.gridY}] Crop class not found!`);
      return;
    }

    const isHealthy = !this.isSick();
    console.log(`[Tile ${this.gridX},${this.gridY}] Creating crop entity, healthy: ${isHealthy}`);

    const crop = new Crop(
      this.scene,
      this.isoX,
      this.isoY + GameConfig.GRID.TILE_HEIGHT / 2 - 30,
      isHealthy
    );

    // Reset tile to empty
    this.state = GameConfig.TILE_STATE.EMPTY;

    // Emit event
    this.scene.events.emit('tile-harvested', this, crop);
  }

  /**
   * Add toxicity to tile
   */
  addToxicity(amount) {
    this.toxicity = Math.min(this.toxicity + amount, GameConfig.TOXICITY.MAX);
    this.updateVisuals();

    // Check if tile died
    if (this.isDead() && this.state !== GameConfig.TILE_STATE.DEAD) {
      this.state = GameConfig.TILE_STATE.DEAD;
      // Clear any growing crops
      if (this.seedSprite) {
        this.seedSprite.destroy();
        this.seedSprite = null;
      }
      if (this.cropSprite) {
        this.cropSprite.destroy();
        this.cropSprite = null;
      }
      if (this.growthTimer) {
        this.growthTimer.remove();
        this.growthTimer = null;
      }
    }
  }

  /**
   * Render corruption overlay on tile
   */
  renderCorruptionOverlay() {
    const x = this.isoX;
    const y = this.isoY;
    const tileW = GameConfig.GRID.TILE_WIDTH;
    const tileH = GameConfig.GRID.TILE_HEIGHT;

    // Corruption colors: dark veins → bloody patches
    const corruptionAlpha = Math.min(this.corruptionLevel / 10, 0.7);

    if (this.corruptionLevel <= 3) {
      // Stage 1: Dark veins (greenish-black)
      this.graphics.lineStyle(2, 0x0D1F0D, corruptionAlpha);
      for (let i = 0; i < 3; i++) {
        const startX = x - tileW / 4 + Math.random() * (tileW / 2);
        const startY = y + Math.random() * tileH;
        this.graphics.beginPath();
        this.graphics.moveTo(startX, startY);
        this.graphics.lineTo(startX + Math.random() * 20 - 10, startY + Math.random() * 20);
        this.graphics.strokePath();
      }
    } else if (this.corruptionLevel <= 6) {
      // Stage 2: Brown patches (rot)
      this.graphics.fillStyle(0x3D2B1F, corruptionAlpha);
      for (let i = 0; i < 2; i++) {
        const patchX = x - tileW / 4 + Math.random() * (tileW / 2);
        const patchY = y + tileH / 4 + Math.random() * (tileH / 2);
        this.graphics.fillCircle(patchX, patchY, 8 + Math.random() * 5);
      }
    } else {
      // Stage 3: Bloody/dark red corruption
      this.graphics.fillStyle(0x8B0000, corruptionAlpha * 0.8);
      this.graphics.beginPath();
      this.graphics.moveTo(x, y);
      this.graphics.lineTo(x + tileW / 2, y + tileH / 2);
      this.graphics.lineTo(x, y + tileH);
      this.graphics.lineTo(x - tileW / 2, y + tileH / 2);
      this.graphics.closePath();
      this.graphics.fillPath();

      // Blood drips
      for (let i = 0; i < 3; i++) {
        const dripX = x - tileW / 4 + Math.random() * (tileW / 2);
        const dripY = y + tileH / 2;
        this.graphics.fillStyle(0x8B0000, corruptionAlpha);
        this.graphics.fillEllipse(dripX, dripY, 3, 8);
      }
    }
  }

  /**
   * Apply corruption to tile (story-driven)
   */
  applyCorruption(amount) {
    this.corruptionLevel = Math.min(this.corruptionLevel + amount, 10);
    console.log(`[Tile ${this.gridX},${this.gridY}] Corruption increased to ${this.corruptionLevel}`);
    this.render();

    // If crop is growing/ripe, corrupt it too
    if (this.state === GameConfig.TILE_STATE.PLANTED && this.seedSprite) {
      this.corruptSeed();
    } else if (this.state === GameConfig.TILE_STATE.RIPE && this.cropSprite) {
      this.corruptCrop();
    }
  }

  /**
   * Visually corrupt a growing seed
   */
  corruptSeed() {
    if (!this.seedSprite) return;

    // Change seed color to darker/rotten
    this.seedSprite.setFillStyle(0x4A3C1F, 1);
    this.seedSprite.setStrokeStyle(2, 0x000000, 1);

    // Stop pulse animation, add shaking instead
    this.scene.tweens.killTweensOf(this.seedSprite);
    this.scene.tweens.add({
      targets: this.seedSprite,
      x: this.seedSprite.x + 2,
      duration: 100,
      yoyo: true,
      repeat: -1,
    });
  }

  /**
   * Visually corrupt a ripe crop
   */
  corruptCrop() {
    if (!this.cropSprite) return;

    // Change crop color to rotten/spoiled
    let corruptColor = 0x8B4513; // Brown (early corruption)
    if (this.corruptionLevel > 6) {
      corruptColor = 0x3D2B1F; // Dark brown/black (severe)
    }

    this.cropSprite.setFillStyle(corruptColor, 1);
    this.cropSprite.setStrokeStyle(3, 0x000000, 1);

    // Stop idle bob, add decay droop
    this.scene.tweens.killTweensOf(this.cropSprite);
    this.scene.tweens.add({
      targets: this.cropSprite,
      y: this.cropSprite.y + 5,
      scaleY: 0.8,
      duration: 500,
      ease: 'Power2',
    });
  }

  /**
   * Update visuals based on current state
   */
  updateVisuals() {
    this.render();
  }

  /**
   * Get health status
   */
  getHealthStatus() {
    if (this.toxicity <= GameConfig.TOXICITY.HEALTHY_MAX) {
      return 'healthy';
    } else if (this.toxicity <= GameConfig.TOXICITY.SICK_MAX) {
      return 'sick';
    } else {
      return 'dead';
    }
  }

  /**
   * Check if tile is sick
   */
  isSick() {
    return this.toxicity > GameConfig.TOXICITY.HEALTHY_MAX &&
           this.toxicity <= GameConfig.TOXICITY.SICK_MAX;
  }

  /**
   * Check if tile is dead
   */
  isDead() {
    return this.toxicity >= GameConfig.TOXICITY.DEAD_MIN;
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.graphics) this.graphics.destroy();
    if (this.seedSprite) this.seedSprite.destroy();
    if (this.cropSprite) this.cropSprite.destroy();
    if (this.labelText) this.labelText.destroy();
    if (this.growthTimer) this.growthTimer.remove();
  }
}
