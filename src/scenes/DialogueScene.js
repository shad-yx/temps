/**
 * DialogueScene.js
 * Reusable visual novel style dialogue/cinematic scene
 * Modular - just load different dialogue data to show different stories
 */

import { DialogueData } from '../data/DialogueData.js';

export class DialogueScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DialogueScene' });
  }

  /**
   * Initialize scene with dialogue key
   * Call from other scenes: this.scene.start('DialogueScene', { dialogueKey: 'intro', nextScene: 'GameScene' });
   */
  init(data) {
    this.dialogueKey = data.dialogueKey || 'intro';
    this.nextScene = data.nextScene || 'GameScene';
    this.nextSceneData = data.nextSceneData || {};

    // Load dialogue data
    this.dialogueData = DialogueData[this.dialogueKey];

    if (!this.dialogueData) {
      console.error(`[DialogueScene] Dialogue key '${this.dialogueKey}' not found!`);
      this.dialogueData = { background: 'farm_day', pages: [] };
    }

    this.currentPage = 0;
    this.isTransitioning = false;

    console.log(`[DialogueScene] Loaded '${this.dialogueKey}' with ${this.dialogueData.pages.length} pages`);
  }

  create() {
    // Set background color
    this.cameras.main.setBackgroundColor('#000000');

    // Create background image (placeholder for now)
    this.createBackground();

    // Create dialogue UI elements
    this.createDialogueBox();
    this.createPortraits();
    this.createText();
    this.createControls();

    // Show first page
    this.showPage(this.currentPage);

    // Click/Space to advance
    this.input.on('pointerdown', () => this.nextPage());
    this.input.keyboard.on('keydown-SPACE', () => this.nextPage());
    this.input.keyboard.on('keydown-ENTER', () => this.nextPage());
  }

  /**
   * Create background (placeholder)
   */
  createBackground() {
    // Placeholder background
    const bgColor = this.getBackgroundColor(this.dialogueData.background);

    this.background = this.add.rectangle(
      640, 360,
      1280, 720,
      bgColor
    );
    this.background.setDepth(0);

    // Background label (so you know which bg should be here)
    this.bgLabel = this.add.text(640, 360,
      `[BG: ${this.dialogueData.background}]`,
      {
        fontSize: '24px',
        color: '#666666',
        fontFamily: 'Arial'
      }
    );
    this.bgLabel.setOrigin(0.5);
    this.bgLabel.setDepth(1);
    this.bgLabel.setAlpha(0.5);
  }

  /**
   * Get background color based on scene name
   */
  getBackgroundColor(bgName) {
    const colors = {
      'farm_exterior': 0x8B7355,
      'farm_night': 0x1a1a2e,
      'farm_night_corrupted': 0x2d0a1f,
      'farm_night_dark': 0x0a0a0a,
      'farm_day': 0x87CEEB,
    };
    return colors[bgName] || 0x333333;
  }

  /**
   * Create dialogue box
   */
  createDialogueBox() {
    const boxHeight = 200;
    const boxY = 720 - boxHeight;

    // Dialogue box background
    this.dialogueBoxBg = this.add.graphics();
    this.dialogueBoxBg.fillStyle(0x000000, 0.85);
    this.dialogueBoxBg.fillRect(0, boxY, 1280, boxHeight);
    this.dialogueBoxBg.lineStyle(4, 0xFFFFFF, 1);
    this.dialogueBoxBg.strokeRect(0, boxY, 1280, boxHeight);
    this.dialogueBoxBg.setDepth(10);
  }

  /**
   * Create portrait containers
   */
  createPortraits() {
    // Left portrait (protagonist usually)
    this.leftPortrait = this.add.container(150, 300);
    this.leftPortrait.setDepth(5);

    // Placeholder portrait
    this.leftPortraitBg = this.add.rectangle(0, 0, 200, 300, 0x444444);
    this.leftPortraitBg.setStrokeStyle(3, 0xFFFFFF);
    this.leftPortraitLabel = this.add.text(0, 0, '[Portrait]', {
      fontSize: '16px',
      color: '#FFFFFF',
      fontFamily: 'Arial'
    });
    this.leftPortraitLabel.setOrigin(0.5);

    this.leftPortrait.add([this.leftPortraitBg, this.leftPortraitLabel]);
    this.leftPortrait.setVisible(false);

    // Right portrait (The Man, others)
    this.rightPortrait = this.add.container(1130, 300);
    this.rightPortrait.setDepth(5);

    this.rightPortraitBg = this.add.rectangle(0, 0, 200, 300, 0x444444);
    this.rightPortraitBg.setStrokeStyle(3, 0xFFFFFF);
    this.rightPortraitLabel = this.add.text(0, 0, '[Portrait]', {
      fontSize: '16px',
      color: '#FFFFFF',
      fontFamily: 'Arial'
    });
    this.rightPortraitLabel.setOrigin(0.5);

    this.rightPortrait.add([this.rightPortraitBg, this.rightPortraitLabel]);
    this.rightPortrait.setVisible(false);
  }

  /**
   * Create text elements
   */
  createText() {
    // Character name
    this.nameText = this.add.text(50, 530, '', {
      fontSize: '24px',
      fontFamily: 'Georgia, serif',
      color: '#FFD700',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    });
    this.nameText.setDepth(11);

    // Dialogue text
    this.dialogueText = this.add.text(50, 570, '', {
      fontSize: '20px',
      fontFamily: 'Georgia, serif',
      color: '#FFFFFF',
      wordWrap: { width: 1180 },
      lineSpacing: 8,
    });
    this.dialogueText.setDepth(11);

    // Continue indicator
    this.continueIndicator = this.add.text(1230, 700, '▼', {
      fontSize: '24px',
      color: '#FFD700',
    });
    this.continueIndicator.setOrigin(1, 1);
    this.continueIndicator.setDepth(11);

    // Animate continue indicator
    this.tweens.add({
      targets: this.continueIndicator,
      alpha: 0.3,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });
  }

  /**
   * Create controls hint
   */
  createControls() {
    this.controlsText = this.add.text(640, 710,
      'Click or press SPACE to continue',
      {
        fontSize: '16px',
        fontFamily: 'Arial',
        color: '#888888',
      }
    );
    this.controlsText.setOrigin(0.5, 1);
    this.controlsText.setDepth(11);
  }

  /**
   * Show specific dialogue page
   */
  showPage(pageIndex) {
    if (pageIndex >= this.dialogueData.pages.length) {
      this.endDialogue();
      return;
    }

    const page = this.dialogueData.pages[pageIndex];

    // Update character name
    const characterNames = {
      'narrator': '',
      'protagonist': 'You',
      'the_man': 'The Man',
      'commission_officer': 'Commission Officer',
    };
    this.nameText.setText(characterNames[page.character] || page.character);

    // Update dialogue text
    this.dialogueText.setText(page.text);

    // Show/hide portraits based on position
    this.leftPortrait.setVisible(false);
    this.rightPortrait.setVisible(false);

    if (page.portrait && page.position === 'left') {
      this.leftPortrait.setVisible(true);
      this.leftPortraitLabel.setText(`[${page.portrait}]`);

      // Highlight active portrait
      this.leftPortraitBg.setFillStyle(0x666666);
    }

    if (page.portrait && page.position === 'right') {
      this.rightPortrait.setVisible(true);
      this.rightPortraitLabel.setText(`[${page.portrait}]`);

      // Highlight active portrait
      this.rightPortraitBg.setFillStyle(0x666666);
    }

    if (page.position === 'center') {
      // Center text (narrator)
      this.dialogueText.setAlign('center');
      this.dialogueText.setOrigin(0.5, 0);
      this.dialogueText.setPosition(640, 570);
    } else {
      // Left-align text (character speaking)
      this.dialogueText.setAlign('left');
      this.dialogueText.setOrigin(0, 0);
      this.dialogueText.setPosition(50, 570);
    }

    console.log(`[DialogueScene] Page ${pageIndex + 1}/${this.dialogueData.pages.length}: ${page.character}`);
  }

  /**
   * Advance to next page
   */
  nextPage() {
    if (this.isTransitioning) return;

    this.currentPage++;

    if (this.currentPage >= this.dialogueData.pages.length) {
      this.endDialogue();
    } else {
      this.showPage(this.currentPage);
    }
  }

  /**
   * End dialogue and transition to next scene
   */
  endDialogue() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    console.log(`[DialogueScene] Ending. Transitioning to '${this.nextScene}'`);

    // Fade out
    this.cameras.main.fadeOut(500, 0, 0, 0);

    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(this.nextScene, this.nextSceneData);
    });
  }

  /**
   * Update (not needed for now)
   */
  update() {
    // No per-frame updates needed
  }
}
