/**
 * GameScene.js
 * Main gameplay scene - integrates all systems
 */

import { GameConfig } from '../config/GameConfig.js';
import { FarmManager } from '../systems/FarmManager.js';
import { DebtManager } from '../systems/DebtManager.js';
import { InputManager } from '../systems/InputManager.js';
import { SerumManager } from '../systems/SerumManager.js';
import { AnimalManager } from '../systems/AnimalManager.js';
import { TruckManager } from '../systems/TruckManager.js';
import { HUD } from '../ui/HUD.js';
import { ModeToggle } from '../ui/ModeToggle.js';
import { StatsPanel } from '../ui/StatsPanel.js';
import { Crop } from '../entities/Crop.js';
import { Dog } from '../entities/Dog.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {
    this.resumeFromPayment = data.resumeFromPayment || false;
    this.resumeCash = data.currentCash || null;
    this.resumeDay = data.currentDay || null;
  }

  create() {
    console.log('[GameScene] Initializing...');

    // Set background color
    this.cameras.main.setBackgroundColor('#1a1a1a');

    // If resuming from payment/dialogue, restore state
    if (this.resumeFromPayment) {
      console.log(`[GameScene] Resuming after dialogue. Cash: $${this.resumeCash}, Day: ${this.resumeDay}`);
    }

    // Initialize systems
    this.farmManager = new FarmManager(this);
    this.debtManager = new DebtManager(this);
    this.inputManager = new InputManager(this);
    this.serumManager = new SerumManager(this);
    this.animalManager = new AnimalManager(this);
    this.truckManager = new TruckManager(this);

    // Create systems
    this.serumManager.create();
    this.farmManager.create();
    this.inputManager.create();
    this.debtManager.create();

    // Create animal enclosures
    this.animalManager.createEnclosures();

    // Create truck manager (NEW accelerated system)
    this.truckManager.create();

    // Pass Crop class to tiles for spawning
    this.cropClass = Crop;

    // Create UI
    this.hud = new HUD(this);
    this.hud.create();

    this.modeToggle = new ModeToggle(this);
    this.modeToggle.create();

    // Create stats panel (NEW)
    this.statsPanel = new StatsPanel(this);
    this.statsPanel.create();

    // Create dog asset
    this.dog = new Dog(
      this,
      GameConfig.UI.DOG_X,
      GameConfig.UI.DOG_Y
    );

    // Enable drag input
    this.input.setDraggable(this.dog.sprite);

    // Listen for scene resume (when coming back from PaymentScene or NightCycleScene)
    this.events.on('resume', () => {
      console.log('[GameScene] Scene resumed');

      // Restart animal production
      if (this.animalManager) {
        this.animalManager.resumeProduction();
      }

      // Resume truck timer
      if (this.truckManager) {
        this.truckManager.resumeTimer();
      }
    });

    // Listen for week-started event (from NightCycleScene)
    this.events.on('week-started', (data) => {
      console.log(`[GameScene] Week ${data.week} started. Cash: $${data.cash}, Debt: $${data.debt}`);

      // Update game state with new week data
      if (this.debtManager) {
        this.debtManager.cash = data.cash;
        this.debtManager.currentDebt = data.debt;
      }

      // Reset truck manager for new week
      if (this.truckManager) {
        this.truckManager.resetForNewWeek();
      }
    });

    console.log('[GameScene] Initialization complete');
  }

  update(time, delta) {
    // Update all systems
    if (this.farmManager) {
      this.farmManager.update(delta);
    }

    if (this.debtManager) {
      this.debtManager.update(delta);
    }

    if (this.serumManager) {
      this.serumManager.update();
    }

    if (this.animalManager) {
      this.animalManager.update();
    }

    if (this.truckManager) {
      this.truckManager.update(delta);
    }

    if (this.hud) {
      this.hud.update();
    }
  }

  /**
   * Cleanup when scene shuts down
   */
  shutdown() {
    console.log('[GameScene] Shutting down...');

    if (this.farmManager) this.farmManager.destroy();
    if (this.debtManager) this.debtManager.destroy();
    if (this.inputManager) this.inputManager.destroy();
    if (this.serumManager) this.serumManager.destroy();
    if (this.animalManager) this.animalManager.destroy();
    if (this.truckManager) this.truckManager.destroy();
    if (this.hud) this.hud.destroy();
    if (this.modeToggle) this.modeToggle.destroy();
    if (this.dog) this.dog.destroy();

    // Clear all events
    this.events.removeAllListeners();
  }
}
