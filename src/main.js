/**
 * main.js
 * Entry point for HAYDAY game
 */

import { PreloadScene } from './scenes/PreloadScene.js';
import { DialogueScene } from './scenes/DialogueScene.js';
import { GameScene } from './scenes/GameScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { PaymentScene } from './scenes/PaymentScene.js';
import { NightCycleScene } from './scenes/NightCycleScene.js';
import { GameConfig } from './config/GameConfig.js';

const config = {
  type: Phaser.AUTO,
  title: 'DEADDAY',
  description: 'Isometric Farming Sim / Psychological Horror',
  parent: 'game-container',
  width: GameConfig.SCREEN.WIDTH,
  height: GameConfig.SCREEN.HEIGHT,
  backgroundColor: '#000000',
  pixelArt: false,
  scene: [
    PreloadScene,
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

// Log game start
console.log('[HAYDAY] Game initialized');
