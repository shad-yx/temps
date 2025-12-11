/**
 * SimpleCinematicScene.js
 * Plays cinematic templates from the builder
 */

export class SimpleCinematicScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SimpleCinematicScene' });
    }

    init(data) {
        this.template = data.template;
        this.onComplete = data.onComplete;
    }

    create() {
        console.log('[SimpleCinematicScene] Playing:', this.template.name);

        // Black background
        this.cameras.main.setBackgroundColor('#000000');

        // Load and show background if specified
        if (this.template.background) {
            this.add.rectangle(0, 0, 1280, 720, 0x1a1a1a).setOrigin(0);

            // Show background name as placeholder (since we may not have the actual image)
            const bgLabel = this.add.text(640, 100, `Background: ${this.template.background}`, {
                fontSize: '16px',
                color: '#666',
                align: 'center'
            });
            bgLabel.setOrigin(0.5);
        }

        // Show character if specified
        if (this.template.character) {
            // Character placeholder
            const charBox = this.add.rectangle(
                this.template.characterPosition === 'left' ? 200 :
                this.template.characterPosition === 'right' ? 1080 : 640,
                360,
                200,
                400,
                0x4a4a4a
            );
            charBox.setOrigin(0.5);

            const charLabel = this.add.text(charBox.x, charBox.y,
                `${this.template.character.split('/').pop().split('.')[0]}`, {
                fontSize: '14px',
                color: '#888'
            });
            charLabel.setOrigin(0.5);
        }

        // Dialogue box at bottom
        const dialogueBox = this.add.rectangle(640, 600, 1200, 160, 0x000000, 0.8);
        dialogueBox.setOrigin(0.5);

        // Speaker name
        if (this.template.speaker) {
            const speakerText = this.add.text(80, 540, this.template.speaker, {
                fontSize: '24px',
                fontFamily: 'Georgia, serif',
                color: '#4CAF50',
                fontStyle: 'bold'
            });
        }

        // Dialogue text
        const dialogueText = this.add.text(80, 580, this.template.dialogue || '', {
            fontSize: '20px',
            fontFamily: 'Georgia, serif',
            color: '#FFFFFF',
            wordWrap: { width: 1120 }
        });

        // Continue indicator
        const continueText = this.add.text(1200, 660, 'Press SPACE or CLICK to continue', {
            fontSize: '16px',
            color: '#888'
        });
        continueText.setOrigin(1, 1);

        // Blinking arrow
        this.tweens.add({
            targets: continueText,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Auto-advance after duration OR on input
        const duration = this.template.duration || 5000;

        // Input handlers
        this.input.keyboard.on('keydown-SPACE', () => this.advance());
        this.input.on('pointerdown', () => this.advance());

        // Auto-advance timer
        this.time.delayedCall(duration, () => {
            this.advance();
        });

        this.hasAdvanced = false;
    }

    advance() {
        if (this.hasAdvanced) return;
        this.hasAdvanced = true;

        this.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => {
            if (this.onComplete) {
                this.onComplete();
            }
        });
    }
}
