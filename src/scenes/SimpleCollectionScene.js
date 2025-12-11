/**
 * SimpleCollectionScene.js
 * Plays collection/payment templates from the builder
 */

export class SimpleCollectionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SimpleCollectionScene' });
    }

    init(data) {
        this.template = data.template;
        this.onComplete = data.onComplete;
    }

    create() {
        console.log('[SimpleCollectionScene] Playing:', this.template.name);

        // Dark background
        this.cameras.main.setBackgroundColor('#1a1a1a');

        // Background label
        const bgText = this.add.text(640, 30, `Background: ${this.template.background || 'office'}`, {
            fontSize: '14px',
            color: '#666'
        }).setOrigin(0.5);

        // Title
        const title = this.add.text(640, 100, 'PAYMENT DUE', {
            fontSize: '48px',
            fontFamily: 'Georgia, serif',
            color: '#ff4444',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Collector character placeholder
        if (this.template.character) {
            const charBox = this.add.rectangle(640, 300, 200, 400, 0x4a4a4a);
            charBox.setOrigin(0.5);

            const charLabel = this.add.text(640, 300,
                this.template.character.split('/').pop().split('.')[0], {
                fontSize: '16px',
                color: '#888'
            }).setOrigin(0.5);
        }

        // Debt amount
        const debtAmount = this.template.debtAmount || 100;
        const debtText = this.add.text(640, 480, `$${debtAmount}`, {
            fontSize: '72px',
            fontFamily: 'Georgia, serif',
            color: '#4CAF50',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Dialogue box
        const dialogueBox = this.add.rectangle(640, 600, 1200, 120, 0x000000, 0.8);
        dialogueBox.setOrigin(0.5);

        const dialogue = this.add.text(640, 600, this.template.dialogue || 'Time to pay up.', {
            fontSize: '20px',
            fontFamily: 'Georgia, serif',
            color: '#FFFFFF',
            wordWrap: { width: 1100 },
            align: 'center'
        }).setOrigin(0.5);

        // Payment button
        const payButton = this.add.rectangle(640, 680, 300, 50, 0x4CAF50);
        payButton.setInteractive({ useHandCursor: true });

        const payButtonText = this.add.text(640, 680, 'PAY DEBT', {
            fontSize: '24px',
            fontFamily: 'Georgia, serif',
            color: '#FFFFFF',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Button hover effect
        payButton.on('pointerover', () => {
            payButton.setFillStyle(0x66BB6A);
        });

        payButton.on('pointerout', () => {
            payButton.setFillStyle(0x4CAF50);
        });

        // Pay button click
        payButton.on('pointerdown', () => {
            this.pay();
        });

        // Auto-pay after 5 seconds if no input
        this.time.delayedCall(5000, () => {
            this.pay();
        });

        this.hasPaid = false;
    }

    pay() {
        if (this.hasPaid) return;
        this.hasPaid = true;

        console.log('[SimpleCollectionScene] Payment made');

        // Flash effect
        this.cameras.main.flash(300, 76, 175, 80);

        this.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => {
            if (this.onComplete) {
                this.onComplete();
            }
        });
    }
}
