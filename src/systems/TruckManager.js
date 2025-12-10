/**
 * TruckManager.js
 * Manages truck visits every 10 seconds for accelerated selling
 * Replaces old day/night cycle with truck visit system
 */

import { GameConfig } from '../config/GameConfig.js';

export class TruckManager {
  constructor(scene) {
    this.scene = scene;
    this.truckVisitInterval = 10000; // 10 seconds per truck visit
    this.currentVisit = 0;
    this.truckTimer = null;
    this.timeUntilTruck = this.truckVisitInterval / 1000; // Track seconds

    // Visual elements
    this.truckZone = null;
    this.truckSprite = null;
    this.visitText = null;
    this.timerText = null;

    // Week tracking (7 visits = 1 week = night cycle)
    this.visitsPerWeek = 7;
  }

  /**
   * Initialize truck system
   */
  create() {
    console.log('[TruckManager] Initializing truck system...');

    // Create truck zone on right side
    this.createTruckZone();

    // Start truck timer
    this.startTruckTimer();

    console.log('[TruckManager] Truck visits every 10 seconds. Week ends after 7 visits.');
  }

  /**
   * Create visual truck zone
   */
  createTruckZone() {
    const x = GameConfig.UI.TRUCK_X;
    const y = GameConfig.UI.TRUCK_Y;
    const width = GameConfig.UI.TRUCK_WIDTH;
    const height = GameConfig.UI.TRUCK_HEIGHT;

    // Truck zone background (dashed border)
    this.truckZone = this.scene.add.graphics();
    this.truckZone.lineStyle(4, 0xFFD700, 1);
    this.truckZone.strokeRect(x - width / 2, y - height / 2, width, height);

    // Add "TRUCK ZONE" label at top
    const label = this.scene.add.text(x, y - height / 2 - 20, 'TRUCK ZONE', {
      fontSize: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 3,
      fontStyle: 'bold',
    });
    label.setOrigin(0.5);

    // Truck sprite placeholder (simple truck shape)
    this.truckSprite = this.scene.add.graphics();
    this.drawTruck(x, y);

    // Visit counter
    this.visitText = this.scene.add.text(x, y + height / 2 + 30, 'VISIT: 0/7', {
      fontSize: '24px',
      fontFamily: 'Georgia, serif',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 4,
      fontStyle: 'bold',
    });
    this.visitText.setOrigin(0.5);

    // Countdown timer
    this.timerText = this.scene.add.text(x, y + height / 2 + 60, 'NEXT: 10s', {
      fontSize: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 3,
    });
    this.timerText.setOrigin(0.5);
  }

  /**
   * Draw simple truck graphic
   */
  drawTruck(x, y) {
    this.truckSprite.clear();

    // Truck body
    this.truckSprite.fillStyle(0xFF0000, 1);
    this.truckSprite.fillRect(x - 60, y - 40, 100, 60);
    this.truckSprite.lineStyle(3, 0x8B0000, 1);
    this.truckSprite.strokeRect(x - 60, y - 40, 100, 60);

    // Truck cabin
    this.truckSprite.fillStyle(0xFF0000, 1);
    this.truckSprite.fillRect(x + 40, y - 30, 30, 50);
    this.truckSprite.lineStyle(3, 0x8B0000, 1);
    this.truckSprite.strokeRect(x + 40, y - 30, 30, 50);

    // Windshield
    this.truckSprite.fillStyle(0x87CEEB, 0.6);
    this.truckSprite.fillRect(x + 45, y - 25, 20, 20);

    // Wheels
    this.truckSprite.fillStyle(0x000000, 1);
    this.truckSprite.fillCircle(x - 40, y + 25, 12);
    this.truckSprite.fillCircle(x + 20, y + 25, 12);

    // Wheel rims
    this.truckSprite.fillStyle(0x808080, 1);
    this.truckSprite.fillCircle(x - 40, y + 25, 6);
    this.truckSprite.fillCircle(x + 20, y + 25, 6);
  }

  /**
   * Start truck visit timer
   */
  startTruckTimer() {
    this.timeUntilTruck = this.truckVisitInterval / 1000;

    // Create timer that counts down every second
    this.truckTimer = this.scene.time.addEvent({
      delay: 1000, // 1 second
      callback: () => {
        this.timeUntilTruck--;

        // Update UI
        this.timerText.setText(`NEXT: ${this.timeUntilTruck}s`);

        // Flash when close
        if (this.timeUntilTruck <= 3) {
          this.timerText.setColor('#FF0000');
        } else {
          this.timerText.setColor('#FFD700');
        }

        if (this.timeUntilTruck <= 0) {
          this.onTruckArrives();
        }
      },
      loop: true,
    });
  }

  /**
   * Called when truck arrives (every 10 seconds)
   */
  onTruckArrives() {
    this.currentVisit++;

    console.log(`[TruckManager] Truck arrived! Visit ${this.currentVisit}/${this.visitsPerWeek}`);

    // Update visit counter
    const visitInWeek = ((this.currentVisit - 1) % this.visitsPerWeek) + 1;
    this.visitText.setText(`VISIT: ${visitInWeek}/7`);

    // Truck arrival animation (bounce)
    this.scene.tweens.add({
      targets: this.truckSprite,
      y: this.truckSprite.y - 20,
      duration: 200,
      yoyo: true,
      ease: 'Bounce.easeOut',
    });

    // Reset timer
    this.timeUntilTruck = this.truckVisitInterval / 1000;

    // Check if week ended (7 visits)
    if (this.currentVisit % this.visitsPerWeek === 0) {
      this.onWeekEnds();
    }

    // Emit event for other systems
    this.scene.events.emit('truck-arrived', {
      visit: this.currentVisit,
      weekVisit: visitInWeek,
    });
  }

  /**
   * Called when week ends (after 7 truck visits)
   */
  onWeekEnds() {
    const week = Math.floor(this.currentVisit / this.visitsPerWeek);
    console.log(`[TruckManager] Week ${week} ended! Triggering night cycle...`);

    // Stop truck timer
    if (this.truckTimer) {
      this.truckTimer.paused = true;
    }

    // Emit week-end event
    this.scene.events.emit('week-ended', {
      week: week,
      totalVisits: this.currentVisit,
    });

    // Trigger NightCycleScene
    this.scene.scene.pause('GameScene');
    this.scene.scene.launch('NightCycleScene', {
      week: week,
      totalVisits: this.currentVisit,
      currentCash: this.scene.debtManager ? this.scene.debtManager.cash : 0,
      debtDue: this.calculateWeeklyDebt(week),
      farmCorruption: this.scene.farmManager ? this.scene.farmManager.getTotalToxicity() : 0,
      playerCorruption: 0, // TODO: Track player deterioration
    });
  }

  /**
   * Calculate debt due for a given week
   */
  calculateWeeklyDebt(week) {
    // Week 1: $500, Week 2: $1000, Week 3: $2000, etc. (exponential)
    return Math.floor(500 * Math.pow(1.5, week - 1));
  }

  /**
   * Get current visit number
   */
  getCurrentVisit() {
    return this.currentVisit;
  }

  /**
   * Get visit within current week (1-7)
   */
  getWeekVisit() {
    return ((this.currentVisit - 1) % this.visitsPerWeek) + 1;
  }

  /**
   * Get current week number
   */
  getCurrentWeek() {
    return Math.ceil(this.currentVisit / this.visitsPerWeek);
  }

  /**
   * Pause truck timer
   */
  pauseTimer() {
    if (this.truckTimer) {
      this.truckTimer.paused = true;
    }
  }

  /**
   * Resume truck timer (after night cycle)
   */
  resumeTimer() {
    if (this.truckTimer) {
      this.truckTimer.paused = false;
    }
    console.log('[TruckManager] Timer resumed after night cycle');
  }

  /**
   * Reset for new week (called when night cycle ends)
   */
  resetForNewWeek() {
    // Reset timer but keep visit count
    this.timeUntilTruck = this.truckVisitInterval / 1000;
    this.resumeTimer();
    console.log(`[TruckManager] New week started. Visit ${this.currentVisit}`);
  }

  /**
   * Update (called each frame)
   */
  update(delta) {
    // Timer is handled by time event
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.truckTimer) {
      this.truckTimer.remove();
      this.truckTimer = null;
    }
    if (this.truckZone) this.truckZone.destroy();
    if (this.truckSprite) this.truckSprite.destroy();
    if (this.visitText) this.visitText.destroy();
    if (this.timerText) this.timerText.destroy();
  }
}
