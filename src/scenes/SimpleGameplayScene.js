/**
 * SimpleGameplayScene.js
 * Plays gameplay templates from the builder with FULL farming mechanics
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

export class SimpleGameplayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SimpleGameplayScene' });
    }

    init(data) {
        this.template = data.template;
        this.onComplete = data.onComplete;
        this.hasCompleted = false;
    }

    create() {
        console.log('[SimpleGameplayScene] Playing:', this.template.name);
        console.log('[SimpleGameplayScene] Template data:', this.template);

        // Set background color (can be driven by template later)
        this.cameras.main.setBackgroundColor('#1a1a1a');

        // Show background label from template
        if (this.template.backgroundStart) {
            this.add.text(640, 20, `Background: ${this.template.backgroundStart}`, {
                fontSize: '14px',
                color: '#666'
            }).setOrigin(0.5).setDepth(1000);
        }

        // Initialize ALL game systems (just like GameScene)
        this.farmManager = new FarmManager(this);
        this.debtManager = new DebtManager(this);
        this.inputManager = new InputManager(this);
        this.serumManager = new SerumManager(this);
        this.animalManager = new AnimalManager(this);
        this.truckManager = new TruckManager(this);

        // Override grid size from template if provided
        if (this.template.gridRows && this.template.gridCols) {
            console.log(`[SimpleGameplayScene] Using template grid: ${this.template.gridRows}x${this.template.gridCols}`);
            // FarmManager will need to read from template - we can pass it
            this.farmManager.templateGridRows = this.template.gridRows;
            this.farmManager.templateGridCols = this.template.gridCols;
        }

        // Create systems in proper order
        this.serumManager.create();
        this.farmManager.create();
        this.inputManager.create();
        this.debtManager.create();

        // Create animal enclosures
        this.animalManager.createEnclosures();

        // Create truck manager
        this.truckManager.create();

        // Pass Crop class to tiles for spawning
        this.cropClass = Crop;

        // Create UI
        this.hud = new HUD(this);
        this.hud.create();

        this.modeToggle = new ModeToggle(this);
        this.modeToggle.create();

        // Create stats panel
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

        // Template-driven timer (if duration specified)
        if (this.template.duration) {
            const durationMs = this.template.duration;
            console.log(`[SimpleGameplayScene] Template duration: ${durationMs}ms (${durationMs/1000}s)`);

            // Create countdown timer display
            this.timeLeft = durationMs / 1000;
            this.timerText = this.add.text(640, 50, `Time: ${this.timeLeft.toFixed(1)}s`, {
                fontSize: '24px',
                fontFamily: 'Georgia, serif',
                color: '#4CAF50',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5).setDepth(1000);

            // Update timer every 100ms
            this.time.addEvent({
                delay: 100,
                callback: () => {
                    this.timeLeft -= 0.1;
                    if (this.timeLeft <= 0) {
                        this.timeLeft = 0;
                    }
                    this.timerText.setText(`Time: ${this.timeLeft.toFixed(1)}s`);
                },
                loop: true
            });

            // Auto-complete after duration
            this.time.delayedCall(durationMs, () => {
                this.complete();
            });
        } else {
            // No duration - gameplay runs indefinitely (can add manual exit button)
            console.log('[SimpleGameplayScene] No duration set - running indefinitely');
        }

        // Show toxicity threshold if specified in template
        if (this.template.toxicityThreshold !== undefined) {
            this.add.text(640, 680, `Toxicity Threshold: ${this.template.toxicityThreshold}%`, {
                fontSize: '14px',
                color: '#ff6666'
            }).setOrigin(0.5).setDepth(1000);
        }

        console.log('[SimpleGameplayScene] All systems initialized - gameplay active!');
    }

    update(time, delta) {
        // Update all systems (just like GameScene)
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

    complete() {
        if (this.hasCompleted) return;
        this.hasCompleted = true;

        console.log('[SimpleGameplayScene] Gameplay complete - moving to next template');

        // Fade out
        this.cameras.main.fadeOut(500);

        // Cleanup and move to next template
        this.time.delayedCall(500, () => {
            // Cleanup systems
            this.cleanup();

            // Call onComplete callback
            if (this.onComplete) {
                this.onComplete();
            }
        });
    }

    cleanup() {
        console.log('[SimpleGameplayScene] Cleaning up systems...');

        if (this.farmManager) this.farmManager.destroy();
        if (this.debtManager) this.debtManager.destroy();
        if (this.inputManager) this.inputManager.destroy();
        if (this.serumManager) this.serumManager.destroy();
        if (this.animalManager) this.animalManager.destroy();
        if (this.truckManager) this.truckManager.destroy();
        if (this.hud) this.hud.destroy();
        if (this.modeToggle) this.modeToggle.destroy();
        if (this.statsPanel) this.statsPanel.destroy();
        if (this.dog) this.dog.destroy();

        // Clear events
        this.events.removeAllListeners();
    }

    /**
     * Cleanup when scene shuts down
     */
    shutdown() {
        this.cleanup();
    }
}
