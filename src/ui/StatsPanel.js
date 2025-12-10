/**
 * StatsPanel.js
 * Top-right stats panel showing harvest/product counts
 */

import { GameConfig } from '../config/GameConfig.js';

export class StatsPanel {
  constructor(scene) {
    this.scene = scene;

    // Stats tracking
    this.stats = {
      harvests: 0,
      eggs: 0,
      milk: 0,
      wool: 0,
    };

    // UI elements
    this.container = null;
    this.labels = {};

    this.create();
  }

  /**
   * Create stats panel UI
   */
  create() {
    const x = GameConfig.SCREEN.WIDTH - 20; // Right side
    const y = 100; // Top area

    // Container for all stats
    this.container = this.scene.add.container(x, y);

    // Background panel
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x000000, 0.7);
    bg.fillRoundedRect(-150, -20, 140, 200, 8);
    bg.lineStyle(3, 0x8B4513, 1);
    bg.strokeRoundedRect(-150, -20, 140, 200, 8);
    this.container.add(bg);

    // Title
    const title = this.scene.add.text(-80, 0, 'STATS', {
      fontSize: '18px',
      fontFamily: 'Georgia, serif',
      color: '#FFD700',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);
    this.container.add(title);

    // Stat labels (vertical list)
    const statConfig = [
      { key: 'harvests', label: 'Harvests:', color: '#90EE90', icon: '🌾' },
      { key: 'eggs', label: 'Eggs:', color: '#FFFACD', icon: '🥚' },
      { key: 'milk', label: 'Milk:', color: '#F0F8FF', icon: '🥛' },
      { key: 'wool', label: 'Wool:', color: '#F5F5DC', icon: '🐑' },
    ];

    statConfig.forEach((stat, index) => {
      const yPos = 35 + (index * 40);

      // Stat label with icon
      const label = this.scene.add.text(-130, yPos, `${stat.icon} ${stat.label}`, {
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        color: stat.color,
        fontStyle: 'bold',
      });
      label.setOrigin(0, 0.5);
      this.container.add(label);

      // Stat value
      const value = this.scene.add.text(-30, yPos, '0', {
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        color: '#FFFFFF',
        stroke: '#000000',
        strokeThickness: 2,
        fontStyle: 'bold',
      });
      value.setOrigin(0, 0.5);
      this.container.add(value);

      // Store reference
      this.labels[stat.key] = value;
    });

    console.log('[StatsPanel] Created stats panel');
  }

  /**
   * Increment a stat
   */
  incrementStat(statKey) {
    if (this.stats.hasOwnProperty(statKey)) {
      this.stats[statKey]++;
      this.updateDisplay(statKey);
      console.log(`[StatsPanel] ${statKey}: ${this.stats[statKey]}`);
    }
  }

  /**
   * Update display for a specific stat
   */
  updateDisplay(statKey) {
    if (this.labels[statKey]) {
      this.labels[statKey].setText(this.stats[statKey].toString());
    }
  }

  /**
   * Get all stats
   */
  getStats() {
    return { ...this.stats };
  }

  /**
   * Reset all stats
   */
  reset() {
    Object.keys(this.stats).forEach(key => {
      this.stats[key] = 0;
      this.updateDisplay(key);
    });
    console.log('[StatsPanel] Stats reset');
  }

  /**
   * Update method (called each frame if needed)
   */
  update() {
    // No per-frame updates needed
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.container) {
      this.container.destroy();
    }
  }
}
