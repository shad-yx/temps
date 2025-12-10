/**
 * PreloadScene.js
 * Preloads all game assets before starting the game
 */

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    // Create loading bar UI
    this.createLoadingBar();

    // === LOAD ALL ASSETS ===
    // Note: Comment out assets you haven't created yet to avoid 404 errors

    console.log('[PreloadScene] Starting asset load...');

    // Animals
    this.load.image('chicken', 'assets/images/entities/animals/chicken.png');
    // this.load.image('chicken_corrupted', 'assets/images/entities/animals/chicken_corrupted.png');
     this.load.image('cow', 'assets/images/entities/animals/cow.png');
    // this.load.image('cow_corrupted', 'assets/images/entities/animals/cow_corrupted.png');
     this.load.image('sheep', 'assets/images/entities/animals/sheep.png');
    // this.load.image('sheep_corrupted', 'assets/images/entities/animals/sheep_corrupted.png');

    // Products
    // this.load.image('egg', 'assets/images/entities/products/egg.png');
    // this.load.image('egg_corrupted', 'assets/images/entities/products/egg_corrupted.png');
    // this.load.image('milk', 'assets/images/entities/products/milk.png');
    // this.load.image('milk_brown', 'assets/images/entities/products/milk_brown.png');
    // this.load.image('milk_black', 'assets/images/entities/products/milk_black.png');
    // this.load.image('milk_bloody', 'assets/images/entities/products/milk_bloody.png');
    // this.load.image('wool', 'assets/images/entities/products/wool.png');
    // this.load.image('wool_corrupted', 'assets/images/entities/products/wool_corrupted.png');

    // Crops
    // this.load.image('seed', 'assets/images/entities/crops/seed.png');
    // this.load.image('seed_corrupted', 'assets/images/entities/crops/seed_corrupted.png');
    // this.load.image('crop_healthy', 'assets/images/entities/crops/crop_healthy.png');
    // this.load.image('crop_sick', 'assets/images/entities/crops/crop_sick.png');
    // this.load.image('crop_rotten', 'assets/images/entities/crops/crop_rotten.png');

    // Dog
    // this.load.image('dog', 'assets/images/entities/dog.png');

    // Characters
    // this.load.image('the_man_portrait', 'assets/images/characters/the_man/the_man_portrait.png');
    // this.load.image('the_man_silhouette', 'assets/images/characters/the_man/the_man_silhouette.png');
    // this.load.image('player_normal', 'assets/images/characters/player/player_normal.png');
    // this.load.image('player_stage1', 'assets/images/characters/player/player_stage1.png');
    // this.load.image('player_stage2', 'assets/images/characters/player/player_stage2.png');
    // this.load.image('player_stage3', 'assets/images/characters/player/player_stage3.png');
    // this.load.image('player_stage4', 'assets/images/characters/player/player_stage4.png');

    // Environment
    // this.load.image('truck', 'assets/images/environment/truck.png');
    // this.load.image('tile_healthy', 'assets/images/environment/tiles/tile_healthy.png');
    // this.load.image('tile_sick', 'assets/images/environment/tiles/tile_sick.png');
    // this.load.image('tile_dead', 'assets/images/environment/tiles/tile_dead.png');
    // this.load.image('farm_background', 'assets/images/environment/farm_background.png');

    // UI Buttons
    // this.load.image('btn_water', 'assets/images/ui/buttons/btn_water.png');
    // this.load.image('btn_serum', 'assets/images/ui/buttons/btn_serum.png');
    // this.load.image('btn_pay_cash', 'assets/images/ui/buttons/btn_pay_cash.png');
    // this.load.image('btn_continue', 'assets/images/ui/buttons/btn_continue.png');

    // UI Panels
    // this.load.image('dialogue_box', 'assets/images/ui/panels/dialogue_box.png');
    // this.load.image('hud_background', 'assets/images/ui/panels/hud_background.png');
    // this.load.image('truck_zone', 'assets/images/ui/panels/truck_zone.png');

    // UI Icons
    // this.load.image('icon_cash', 'assets/images/ui/icons/icon_cash.png');
    // this.load.image('icon_debt', 'assets/images/ui/icons/icon_debt.png');
    // this.load.image('icon_timer', 'assets/images/ui/icons/icon_timer.png');

    // Audio (for future)
    // this.load.audio('bgm_day', 'assets/audio/music/day_theme.mp3');
    // this.load.audio('bgm_night', 'assets/audio/music/night_theme.mp3');
    // this.load.audio('sfx_sell', 'assets/audio/sfx/sell.mp3');
    // this.load.audio('sfx_plant', 'assets/audio/sfx/plant.mp3');

    console.log('[PreloadScene] Assets loading started');
  }

  /**
   * Create loading bar with progress indicator
   */
  createLoadingBar() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Title
    const titleText = this.add.text(width / 2, height / 2 - 100, 'DEADDAY', {
      fontSize: '64px',
      fontFamily: 'Georgia, serif',
      color: '#8B0000',
      stroke: '#000000',
      strokeThickness: 6,
      fontStyle: 'bold',
    });
    titleText.setOrigin(0.5);

    // Subtitle
    const subtitleText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      fontSize: '24px',
      fontFamily: 'Arial, sans-serif',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 3,
    });
    subtitleText.setOrigin(0.5);

    // Progress bar background
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    // Progress bar
    const progressBar = this.add.graphics();

    // Percentage text
    const percentText = this.add.text(width / 2, height / 2, '0%', {
      fontSize: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#FFFFFF',
      fontStyle: 'bold',
    });
    percentText.setOrigin(0.5);

    // Update progress bar as assets load
    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xFFFFFF, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
      percentText.setText(parseInt(value * 100) + '%');
    });

    // Clean up when complete
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      percentText.destroy();
      titleText.destroy();
      subtitleText.destroy();
    });

    // Log file loading
    this.load.on('filecomplete', (key, type, data) => {
      console.log(`[PreloadScene] ✓ Loaded: ${key} (${type})`);
    });

    this.load.on('loaderror', (file) => {
      console.error(`[PreloadScene] ✗ Failed to load: ${file.key} from ${file.url}`);
    });
  }

  create() {
    console.log('[PreloadScene] Assets loaded successfully');

    // Wait a moment for visual feedback, then start intro cinematic
    this.time.delayedCall(500, () => {
      this.scene.start('DialogueScene', {
        dialogueKey: 'intro',
        nextScene: 'GameScene',
        nextSceneData: {}
      });
    });
  }
}
