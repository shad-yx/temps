/**
 * NightCycleScene.js
 * Night cycle scene for story events, "Man" visits, and debt payment
 * Triggered after 7 truck visits (1 week)
 */

import { GameConfig } from '../config/GameConfig.js';

export class NightCycleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'NightCycleScene' });
  }

  /**
   * Initialize with data from GameScene
   */
  init(data) {
    this.week = data.week || 1;
    this.totalVisits = data.totalVisits || 7;
    this.currentCash = data.currentCash || 0;
    this.debtDue = data.debtDue || 0;
    this.farmCorruption = data.farmCorruption || 0; // Total corruption level
    this.playerCorruption = data.playerCorruption || 0; // MC deterioration level

    console.log(`[NightCycleScene] Week ${this.week} ended. Cash: $${this.currentCash}, Debt: $${this.debtDue}`);
  }

  create() {
    // Dark background (night)
    this.cameras.main.setBackgroundColor('#0D0D1A');

    // Add vignette effect
    const vignette = this.add.graphics();
    vignette.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0, 0.8, 0.8, 0);
    vignette.fillRect(0, 0, GameConfig.SCREEN.WIDTH, GameConfig.SCREEN.HEIGHT);

    // Title: "WEEK X - NIGHT"
    const weekTitle = this.add.text(
      GameConfig.SCREEN.WIDTH / 2,
      80,
      `WEEK ${this.week} - NIGHT`,
      {
        fontSize: '64px',
        fontFamily: 'Georgia, serif',
        color: '#8B0000',
        stroke: '#000000',
        strokeThickness: 6,
        fontStyle: 'bold',
      }
    );
    weekTitle.setOrigin(0.5);

    // Fade in title
    weekTitle.setAlpha(0);
    this.tweens.add({
      targets: weekTitle,
      alpha: 1,
      duration: 1000,
      ease: 'Power2',
    });

    // Create dialogue area
    this.createDialogueBox();

    // Start night sequence
    this.time.delayedCall(1500, () => {
      this.startNightSequence();
    });
  }

  /**
   * Create dialogue box UI
   */
  createDialogueBox() {
    const boxY = 500;
    const boxHeight = 150;

    // Dialogue box background
    this.dialogueBox = this.add.graphics();
    this.dialogueBox.fillStyle(0x1A1A1A, 0.9);
    this.dialogueBox.fillRoundedRect(
      50,
      boxY,
      GameConfig.SCREEN.WIDTH - 100,
      boxHeight,
      10
    );
    this.dialogueBox.lineStyle(3, 0x8B0000, 1);
    this.dialogueBox.strokeRoundedRect(
      50,
      boxY,
      GameConfig.SCREEN.WIDTH - 100,
      boxHeight,
      10
    );

    // Speaker name
    this.speakerText = this.add.text(
      70,
      boxY + 10,
      '',
      {
        fontSize: '24px',
        fontFamily: 'Arial, sans-serif',
        color: '#FF0000',
        fontStyle: 'bold',
      }
    );

    // Dialogue text
    this.dialogueText = this.add.text(
      70,
      boxY + 45,
      '',
      {
        fontSize: '20px',
        fontFamily: 'Georgia, serif',
        color: '#FFFFFF',
        wordWrap: { width: GameConfig.SCREEN.WIDTH - 140 },
      }
    );

    // Continue prompt
    this.continuePrompt = this.add.text(
      GameConfig.SCREEN.WIDTH - 100,
      boxY + boxHeight - 25,
      '[ SPACE ]',
      {
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        color: '#666666',
      }
    );
    this.continuePrompt.setOrigin(1, 0.5);
    this.continuePrompt.setVisible(false);
  }

  /**
   * Start the night sequence (dialogue, events, debt check)
   */
  startNightSequence() {
    console.log('[NightCycleScene] Starting night sequence...');

    // Define dialogue for this week
    const weekDialogues = this.getWeekDialogues();

    // Show dialogues sequentially
    this.showDialogueSequence(weekDialogues, () => {
      // After dialogues, check debt payment
      this.checkDebtPayment();
    });
  }

  /**
   * Get dialogue content for current week
   */
  getWeekDialogues() {
    // TODO: Expand with full story dialogue based on week number
    const dialogues = {
      1: [
        { speaker: 'The Man', text: 'Week one complete. I trust you\'ve made good progress?' },
        { speaker: 'The Man', text: 'The spray is working well, isn\'t it? Remarkable yields...' },
        { speaker: 'The Man', text: 'Remember: debt must be paid. Weekly. No exceptions.' },
      ],
      2: [
        { speaker: 'The Man', text: 'Week two. You\'re looking... different.' },
        { speaker: 'The Man', text: 'The spray does have certain... side effects. Nothing to worry about.' },
        { speaker: 'The Man', text: 'Your debt has increased, naturally. Commission, you understand.' },
      ],
      3: [
        { speaker: 'The Man', text: 'Have you noticed the crops? The soil? The animals?' },
        { speaker: 'The Man', text: 'All perfectly normal. Keep using the spray.' },
        { speaker: 'The Man', text: 'I\'ll need more this week. Much more.' },
      ],
    };

    return dialogues[this.week] || [
      { speaker: 'The Man', text: 'Week ' + this.week + '. Time to pay what you owe.' },
      { speaker: 'The Man', text: 'The farm is... thriving. In its own way.' },
    ];
  }

  /**
   * Show sequence of dialogues with SPACE to continue
   */
  showDialogueSequence(dialogues, onComplete) {
    let currentIndex = 0;

    const showNext = () => {
      if (currentIndex >= dialogues.length) {
        // All dialogues shown
        onComplete();
        return;
      }

      const dialogue = dialogues[currentIndex];
      this.showDialogue(dialogue.speaker, dialogue.text, () => {
        currentIndex++;
        showNext();
      });
    };

    showNext();
  }

  /**
   * Show a single dialogue with typewriter effect
   */
  showDialogue(speaker, text, onComplete) {
    this.speakerText.setText(speaker);
    this.dialogueText.setText('');
    this.continuePrompt.setVisible(false);

    // Typewriter effect
    let charIndex = 0;
    const typeSpeed = 30; // ms per character

    const typeTimer = this.time.addEvent({
      delay: typeSpeed,
      callback: () => {
        this.dialogueText.setText(text.substring(0, charIndex + 1));
        charIndex++;

        if (charIndex >= text.length) {
          typeTimer.remove();
          this.continuePrompt.setVisible(true);

          // Wait for SPACE press
          const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
          spaceKey.once('down', () => {
            onComplete();
          });
        }
      },
      repeat: text.length - 1,
    });
  }

  /**
   * Check if player can pay debt
   */
  checkDebtPayment() {
    console.log(`[NightCycleScene] Checking debt payment. Cash: $${this.currentCash}, Debt: $${this.debtDue}`);

    // Clear dialogue box
    this.dialogueBox.clear();
    this.speakerText.setText('');
    this.dialogueText.setText('');
    this.continuePrompt.setVisible(false);

    // Show debt payment UI
    const debtText = this.add.text(
      GameConfig.SCREEN.WIDTH / 2,
      250,
      `DEBT DUE: $${this.debtDue}`,
      {
        fontSize: '48px',
        fontFamily: 'Georgia, serif',
        color: '#FF0000',
        stroke: '#000000',
        strokeThickness: 5,
        fontStyle: 'bold',
      }
    );
    debtText.setOrigin(0.5);

    const cashText = this.add.text(
      GameConfig.SCREEN.WIDTH / 2,
      320,
      `YOUR CASH: $${this.currentCash}`,
      {
        fontSize: '36px',
        fontFamily: 'Georgia, serif',
        color: '#FFD700',
        stroke: '#000000',
        strokeThickness: 4,
      }
    );
    cashText.setOrigin(0.5);

    this.time.delayedCall(2000, () => {
      if (this.currentCash >= this.debtDue) {
        this.debtPaid();
      } else {
        this.debtUnpaid();
      }
    });
  }

  /**
   * Player successfully paid debt
   */
  debtPaid() {
    console.log('[NightCycleScene] Debt paid successfully');

    const paidText = this.add.text(
      GameConfig.SCREEN.WIDTH / 2,
      400,
      'DEBT PAID',
      {
        fontSize: '56px',
        fontFamily: 'Georgia, serif',
        color: '#00FF00',
        stroke: '#000000',
        strokeThickness: 5,
        fontStyle: 'bold',
      }
    );
    paidText.setOrigin(0.5);
    paidText.setAlpha(0);

    this.tweens.add({
      targets: paidText,
      alpha: 1,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 500,
      ease: 'Back.easeOut',
    });

    // Return to game after delay
    this.time.delayedCall(2000, () => {
      this.returnToGame();
    });
  }

  /**
   * Player failed to pay debt
   */
  debtUnpaid() {
    console.log('[NightCycleScene] Debt unpaid - Game Over');

    const failedText = this.add.text(
      GameConfig.SCREEN.WIDTH / 2,
      400,
      'DEBT UNPAID',
      {
        fontSize: '56px',
        fontFamily: 'Georgia, serif',
        color: '#FF0000',
        stroke: '#000000',
        strokeThickness: 5,
        fontStyle: 'bold',
      }
    );
    failedText.setOrigin(0.5);
    failedText.setAlpha(0);

    this.tweens.add({
      targets: failedText,
      alpha: 1,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 500,
      ease: 'Back.easeOut',
    });

    // Transition to Game Over
    this.time.delayedCall(2000, () => {
      this.scene.start('GameOverScene', {
        week: this.week,
        cash: this.currentCash,
        debt: this.debtDue,
        reason: 'Failed to pay weekly debt',
      });
    });
  }

  /**
   * Return to GameScene for next week
   */
  returnToGame() {
    console.log('[NightCycleScene] Returning to game...');

    // TODO: Update game state (increase debt, corruption, etc.)
    const newCash = this.currentCash - this.debtDue;
    const newDebt = this.calculateNextWeekDebt();

    // Resume GameScene
    this.scene.resume('GameScene');
    this.scene.stop('NightCycleScene');

    // Emit event to update game state
    const gameScene = this.scene.get('GameScene');
    if (gameScene && gameScene.events) {
      gameScene.events.emit('week-started', {
        week: this.week + 1,
        cash: newCash,
        debt: newDebt,
      });
    }
  }

  /**
   * Calculate debt for next week (exponential increase)
   */
  calculateNextWeekDebt() {
    // Base debt increases exponentially
    const baseIncrease = this.debtDue * 1.5; // 50% increase per week
    const commission = this.debtDue * 0.2; // 20% commission
    return Math.floor(baseIncrease + commission);
  }
}
