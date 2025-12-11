/**
 * main.js
 * Entry point for DEADDAY Visual Novel Engine
 */

import { MenuScene } from './scenes/MenuScene.js';
import { PreloadScene } from './scenes/PreloadScene.js';
import { DialogueScene } from './scenes/DialogueScene.js';
import { GameScene } from './scenes/GameScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { PaymentScene } from './scenes/PaymentScene.js';
import { NightCycleScene } from './scenes/NightCycleScene.js';
import { EditorScene } from './scenes/EditorScene.js';
import { CinematicPlayer } from './runtime/CinematicPlayer.js';
import { GameConfig } from './config/GameConfig.js';
import { PersistenceManager } from './core/PersistenceManager.js';
import { TemplateRegistry } from './core/TemplateRegistry.js';
import { ModeManager } from './core/ModeManager.js';

const config = {
  type: Phaser.AUTO,
  title: 'DEADDAY',
  description: 'Visual Novel Engine',
  parent: 'game-container',
  width: GameConfig.SCREEN.WIDTH,
  height: GameConfig.SCREEN.HEIGHT,
  backgroundColor: '#000000',
  pixelArt: false,
  scene: [
    MenuScene,           // NEW: Boot into menu first
    PreloadScene,
    EditorScene,         // Editor preview scene
    CinematicPlayer,     // Cinematic playback system
    DialogueScene,
    GameScene,
    PaymentScene,
    NightCycleScene,
    GameOverScene,
  ],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
};

// Create game instance
const game = new Phaser.Game(config);

// Initialize core engine systems
const initializeEngine = async () => {
  try {
    console.log('[DEADDAY Engine] Initializing...');

    // Initialize PersistenceManager
    const persistence = new PersistenceManager();
    await persistence.init();

    // Initialize TemplateRegistry
    const templateRegistry = new TemplateRegistry(persistence);

    // Initialize ModeManager
    const modeManager = new ModeManager();

    // Make managers globally accessible
    window.DEADDAY = {
      persistence,
      templateRegistry,
      modeManager,
      game,
    };

    console.log('[DEADDAY Engine] Initialization complete');
    console.log('[DEADDAY Engine] Systems available at window.DEADDAY');

    // Load default iteration if none exist
    try {
      const iterations = await persistence.listIterations();
      if (iterations.length === 0) {
        console.log('[DEADDAY Engine] No iterations found, creating default...');

        // Load default iteration from JSON file
        const response = await fetch('src/data/iterations/default.json');
        const defaultIteration = await response.json();
        await persistence.saveIteration(defaultIteration);

        console.log('[DEADDAY Engine] Default iteration created');
      }
    } catch (error) {
      console.warn('[DEADDAY Engine] Failed to load default iteration:', error);
    }

  } catch (error) {
    console.error('[DEADDAY Engine] Initialization failed:', error);
    alert('Failed to initialize game engine. Please refresh the page.');
  }
};

// Initialize engine when game is ready
game.events.once('ready', initializeEngine);

console.log('[DEADDAY Engine] Game initialized');
