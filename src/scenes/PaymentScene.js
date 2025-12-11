/**
 * PaymentScene.js
 * Interactive payment screen where player must pay commission/rent
 * Can sell produce and animals to meet debt obligation
 */

import { GameConfig } from '../config/GameConfig.js';

export class PaymentScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PaymentScene' });
  }

  init(data) {
    this.currentDay = data.currentDay || 1;
    this.currentCash = data.currentCash || 0;
    this.debtDue = data.debtDue || 100;
    this.harvestedCrops = data.harvestedCrops || []; // Array of crop objects
    this.animals = data.animals || []; // Array of animal objects
    this.products = data.products || []; // Array of animal product objects (eggs, milk, wool)
    this.farmToxicity = data.farmToxicity || 0;

    this.totalPaid = 0;
    this.itemsSold = [];
  }

  create() {
    // Background
    this.cameras.main.setBackgroundColor('#2C1810');

    // Add dark vignette
    const vignette = this.add.graphics();
    vignette.fillStyle(0x000000, 0.6);
    vignette.fillRect(0, 0, GameConfig.SCREEN.WIDTH, GameConfig.SCREEN.HEIGHT);

    // Commission Officer character (placeholder)
    this.createOfficer();

    // Speech bubble
    this.createSpeechBubble();

    // Payment UI
    this.createPaymentPanel();

    // Inventory (draggable items)
    this.createInventory();

    // Payment zone (where you drag items to sell)
    this.createPaymentZone();

    // Pay with cash button
    this.createPayCashButton();

    // Add "Can't Pay" button (for when player has no options)
    this.createCantPayButton();

    // Check if player can even afford the debt
    this.checkIfAffordable();
  }

  /**
   * Create commission officer character
   */
  createOfficer() {
    const officerX = 200;
    const officerY = 300;

    // Simple placeholder: Rectangle with face
    const body = this.add.rectangle(officerX, officerY, 80, 120, 0x333333);
    body.setStrokeStyle(3, 0x000000);

    const head = this.add.circle(officerX, officerY - 80, 40, 0xFFDBB0);
    head.setStrokeStyle(3, 0x000000);

    // Hat (represents authority)
    const hat = this.add.rectangle(officerX, officerY - 120, 60, 20, 0x8B0000);
    hat.setStrokeStyle(2, 0x000000);

    // Eyes (stern look)
    const eye1 = this.add.circle(officerX - 12, officerY - 85, 4, 0x000000);
    const eye2 = this.add.circle(officerX + 12, officerY - 85, 4, 0x000000);

    // Idle animation (tapping foot impatiently)
    this.tweens.add({
      targets: [body, head, hat, eye1, eye2],
      y: '+=5',
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Label
    const nameTag = this.add.text(officerX, officerY + 80, 'OFFICER', {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      backgroundColor: '#000000',
      padding: { x: 5, y: 2 },
    });
    nameTag.setOrigin(0.5);
  }

  /**
   * Create speech bubble with dialogue
   */
  createSpeechBubble() {
    const bubbleX = 350;
    const bubbleY = 200;

    // Bubble background
    const bubble = this.add.graphics();
    bubble.fillStyle(0xFFFFFF, 0.95);
    bubble.fillRoundedRect(bubbleX, bubbleY, 300, 120, 15);
    bubble.lineStyle(3, 0x000000, 1);
    bubble.strokeRoundedRect(bubbleX, bubbleY, 300, 120, 15);

    // Bubble pointer
    bubble.fillTriangle(
      bubbleX - 20, bubbleY + 60,
      bubbleX, bubbleY + 50,
      bubbleX, bubbleY + 70
    );
    bubble.lineStyle(3, 0x000000, 1);
    bubble.strokeTriangle(
      bubbleX - 20, bubbleY + 60,
      bubbleX, bubbleY + 50,
      bubbleX, bubbleY + 70
    );

    // Dialogue text
    const dialogue = this.add.text(
      bubbleX + 150,
      bubbleY + 60,
      `Time to pay up!\nDAY ${this.currentDay} Commission:\n$${this.debtDue}`,
      {
        fontSize: '20px',
        fontFamily: 'Arial',
        color: '#000000',
        align: 'center',
        lineSpacing: 8,
      }
    );
    dialogue.setOrigin(0.5);

    // Change dialogue based on cash
    if (this.currentCash >= this.debtDue) {
      dialogue.setText(`You have enough!\nPay $${this.debtDue}\nor sell items.`);
      dialogue.setColor('#006600');
    } else {
      dialogue.setText(`You're short $${this.debtDue - this.currentCash}!\nSell items to pay!`);
      dialogue.setColor('#CC0000');
    }
  }

  /**
   * Create payment status panel
   */
  createPaymentPanel() {
    const panelX = GameConfig.SCREEN.WIDTH / 2;
    const panelY = 80;

    // Panel background
    const panel = this.add.graphics();
    panel.fillStyle(0x1A1A1A, 0.9);
    panel.fillRoundedRect(panelX - 250, panelY - 40, 500, 80, 10);
    panel.lineStyle(3, 0xFFD700, 1);
    panel.strokeRoundedRect(panelX - 250, panelY - 40, 500, 80, 10);

    // Current cash
    this.cashText = this.add.text(panelX - 200, panelY - 15, `Cash: $${this.currentCash}`, {
      fontSize: '24px',
      fontFamily: 'Georgia, serif',
      color: '#00FF00',
      stroke: '#000000',
      strokeThickness: 3,
    });

    // Debt due
    this.debtText = this.add.text(panelX - 200, panelY + 15, `Debt: $${this.debtDue}`, {
      fontSize: '24px',
      fontFamily: 'Georgia, serif',
      color: '#FF4444',
      stroke: '#000000',
      strokeThickness: 3,
    });

    // Total paid so far
    this.paidText = this.add.text(panelX + 50, panelY, `Paid: $0`, {
      fontSize: '28px',
      fontFamily: 'Georgia, serif',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 3,
      fontStyle: 'bold',
    });

    // Pay with cash button (if have enough cash)
    if (this.currentCash >= this.debtDue) {
      this.createPayCashButton();
    }
  }

  /**
   * Create pay with cash button
   */
  createPayCashButton() {
    const buttonX = GameConfig.SCREEN.WIDTH - 150;
    const buttonY = 80;

    const button = this.add.rectangle(buttonX, buttonY, 200, 50, 0x2E7D32);
    button.setStrokeStyle(3, 0x4CAF50);

    const buttonText = this.add.text(buttonX, buttonY, 'PAY CASH', {
      fontSize: '24px',
      fontFamily: 'Georgia, serif',
      color: '#FFFFFF',
      fontStyle: 'bold',
    });
    buttonText.setOrigin(0.5);

    button.setInteractive({ useHandCursor: true });

    button.on('pointerover', () => {
      button.setFillStyle(0x388E3C);
      this.tweens.add({ targets: [button, buttonText], scaleX: 1.05, scaleY: 1.05, duration: 100 });
    });

    button.on('pointerout', () => {
      button.setFillStyle(0x2E7D32);
      this.tweens.add({ targets: [button, buttonText], scaleX: 1, scaleY: 1, duration: 100 });
    });

    button.on('pointerdown', () => {
      this.payWithCash();
    });
  }

  /**
   * Create inventory of sellable items
   */
  createInventory() {
    const inventoryY = 550;
    let currentX = 100;
    const spacing = 80;

    // Inventory header with better styling
    const headerBg = this.add.rectangle(
      GameConfig.SCREEN.WIDTH / 2,
      400,
      600,
      50,
      0x000000,
      0.7
    );

    const label = this.add.text(GameConfig.SCREEN.WIDTH / 2, 400, 'INVENTORY - CLICK TO SELL', {
      fontSize: '22px',
      fontFamily: 'Arial, sans-serif',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 4,
      fontStyle: 'bold',
    });
    label.setOrigin(0.5);

    // Section label for crops
    if (this.harvestedCrops.length > 0) {
      const cropLabel = this.add.text(currentX, 480, 'CROPS:', {
        fontSize: '16px',
        fontFamily: 'Arial',
        color: '#88FF88',
        fontStyle: 'bold',
      });
      cropLabel.setOrigin(0, 0.5);
    }

    // Display harvested crops
    this.harvestedCrops.forEach((cropData, i) => {
      if (currentX > GameConfig.SCREEN.WIDTH - 400) return; // Don't overflow

      const crop = this.add.rectangle(
        currentX,
        inventoryY,
        40,
        40,
        cropData.isHealthy ? 0x00FF00 : 0xAAAA00
      );
      crop.setStrokeStyle(2, 0x000000);
      crop.setInteractive({ draggable: true });
      crop.setData('value', cropData.value || 10);
      crop.setData('type', 'crop');

      const priceLabel = this.add.text(currentX, inventoryY + 30, `$${cropData.value || 10}`, {
        fontSize: '16px',
        fontFamily: 'Arial',
        color: '#FFD700',
        stroke: '#000000',
        strokeThickness: 2,
      });
      priceLabel.setOrigin(0.5);

      this.setupDrag(crop, priceLabel);
      currentX += spacing;
    });

    // Add some spacing between sections
    if (this.harvestedCrops.length > 0 && this.animals.length > 0) {
      currentX += 50;
    }

    // Section label for animals
    if (this.animals.length > 0) {
      const animalLabel = this.add.text(currentX, 480, 'ANIMALS:', {
        fontSize: '16px',
        fontFamily: 'Arial',
        color: '#FFAA88',
        fontStyle: 'bold',
      });
      animalLabel.setOrigin(0, 0.5);
    }

    // Display animals
    this.animals.forEach((animalData, i) => {
      if (currentX > GameConfig.SCREEN.WIDTH - 400) return; // Don't overflow

      const animalConfig = GameConfig.ANIMALS[animalData.type];

      // Simplified animal representation
      const animal = this.add.circle(
        currentX,
        inventoryY,
        25,
        animalConfig.color
      );
      animal.setStrokeStyle(3, 0x000000);
      animal.setInteractive({ draggable: true });
      animal.setData('value', animalConfig.sellValue);
      animal.setData('type', 'animal');

      // Type label
      const typeLabel = this.add.text(currentX, inventoryY, animalData.type.substring(0, 1), {
        fontSize: '20px',
        fontFamily: 'Arial',
        color: '#000000',
        fontStyle: 'bold',
      });
      typeLabel.setOrigin(0.5);

      const priceLabel = this.add.text(currentX, inventoryY + 40, `$${animalConfig.sellValue}`, {
        fontSize: '16px',
        fontFamily: 'Arial',
        color: '#FFD700',
        stroke: '#000000',
        strokeThickness: 2,
      });
      priceLabel.setOrigin(0.5);

      this.setupDrag(animal, priceLabel, typeLabel);
      currentX += spacing;
    });

    // Add spacing between animals and products
    if (this.animals.length > 0 && this.products.length > 0) {
      currentX += 50;
    }

    // Section label for products
    if (this.products.length > 0) {
      const productLabel = this.add.text(currentX, 480, 'PRODUCTS:', {
        fontSize: '16px',
        fontFamily: 'Arial',
        color: '#FFD700',
        fontStyle: 'bold',
      });
      productLabel.setOrigin(0, 0.5);
    }

    // Display animal products
    this.products.forEach((productData, i) => {
      if (currentX > GameConfig.SCREEN.WIDTH - 400) return; // Don't overflow

      // Simplified product representation
      let productColor;
      let productLabel;

      if (productData.type === 'EGG') {
        productColor = 0xFFFAF0; // White
        productLabel = 'E';
      } else if (productData.type === 'MILK') {
        productColor = 0xFFFFFF; // White
        productLabel = 'M';
      } else if (productData.type === 'WOOL') {
        productColor = 0xFFFAFA; // White
        productLabel = 'W';
      }

      const product = this.add.circle(
        currentX,
        inventoryY,
        20,
        productColor
      );
      product.setStrokeStyle(2, 0x000000);
      product.setInteractive({ draggable: true });
      product.setData('value', productData.value);
      product.setData('type', 'product');

      // Type label
      const typeLabel = this.add.text(currentX, inventoryY, productLabel, {
        fontSize: '16px',
        fontFamily: 'Arial',
        color: '#000000',
        fontStyle: 'bold',
      });
      typeLabel.setOrigin(0.5);

      const priceLabel = this.add.text(currentX, inventoryY + 35, `$${productData.value}`, {
        fontSize: '14px',
        fontFamily: 'Arial',
        color: '#FFD700',
        stroke: '#000000',
        strokeThickness: 2,
      });
      priceLabel.setOrigin(0.5);

      this.setupDrag(product, priceLabel, typeLabel);
      currentX += spacing;
    });

    // If no items available
    if (this.harvestedCrops.length === 0 && this.animals.length === 0 && this.products.length === 0) {
      const emptyText = this.add.text(
        GameConfig.SCREEN.WIDTH / 2,
        inventoryY,
        'No items to sell!\nUse cash to pay debt.',
        {
          fontSize: '20px',
          fontFamily: 'Arial',
          color: '#FF6666',
          align: 'center',
        }
      );
      emptyText.setOrigin(0.5);
    }
  }

  /**
   * Setup drag behavior for item
   */
  setupDrag(item, label, extraLabel = null) {
    const originalX = item.x;
    const originalY = item.y;
    const labelOriginalY = label.y;
    const extraOriginalY = extraLabel ? extraLabel.y : 0;

    item.on('drag', (pointer, dragX, dragY) => {
      item.x = dragX;
      item.y = dragY;
      label.x = dragX;
      label.y = dragY + (extraLabel ? 40 : 30);

      if (extraLabel) {
        extraLabel.x = dragX;
        extraLabel.y = dragY;
      }
    });

    item.on('dragend', () => {
      // Check if over payment zone
      const bounds = this.paymentZone.getBounds();
      if (Phaser.Geom.Rectangle.Contains(bounds, item.x, item.y)) {
        this.sellItem(item, label, extraLabel);
      } else {
        // Snap back
        this.tweens.add({
          targets: item,
          x: originalX,
          y: originalY,
          duration: 200,
          ease: 'Back.easeOut',
        });
        this.tweens.add({
          targets: label,
          x: originalX,
          y: labelOriginalY,
          duration: 200,
          ease: 'Back.easeOut',
        });

        if (extraLabel) {
          this.tweens.add({
            targets: extraLabel,
            x: originalX,
            y: extraOriginalY,
            duration: 200,
            ease: 'Back.easeOut',
          });
        }
      }
    });
  }

  /**
   * Create payment zone (drop area)
   */
  createPaymentZone() {
    const zoneX = GameConfig.SCREEN.WIDTH - 200;
    const zoneY = 450;

    this.paymentZone = this.add.rectangle(zoneX, zoneY, 180, 200, 0x8B0000, 0.6);
    this.paymentZone.setStrokeStyle(4, 0xFF0000);

    const zoneLabel = this.add.text(zoneX, zoneY, 'SELL HERE', {
      fontSize: '24px',
      fontFamily: 'Georgia, serif',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 3,
      fontStyle: 'bold',
    });
    zoneLabel.setOrigin(0.5);

    // Pulse animation
    this.tweens.add({
      targets: this.paymentZone,
      alpha: 0.4,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });
  }

  /**
   * Sell an item
   */
  sellItem(item, label, extraLabel = null) {
    const value = item.getData('value');
    this.totalPaid += value;
    this.currentCash += value;

    // Update display
    this.paidText.setText(`Paid: $${this.totalPaid}`);
    this.cashText.setText(`Cash: $${this.currentCash}`);

    // Particle effect
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6;
      const particle = this.add.circle(item.x, item.y, 5, 0xFFD700);
      this.tweens.add({
        targets: particle,
        x: particle.x + Math.cos(angle) * 40,
        y: particle.y + Math.sin(angle) * 40,
        alpha: 0,
        duration: 400,
        onComplete: () => particle.destroy(),
      });
    }

    // Destroy item
    item.destroy();
    label.destroy();
    if (extraLabel) extraLabel.destroy();

    // Check if debt is paid
    if (this.totalPaid >= this.debtDue) {
      this.debtPaid();
    }
  }

  /**
   * Create pay with cash button
   */
  createPayCashButton() {
    const buttonX = GameConfig.SCREEN.WIDTH / 2;
    const buttonY = 650;

    const button = this.add.rectangle(buttonX, buttonY, 250, 60, 0x4CAF50);
    button.setStrokeStyle(3, 0xFFFFFF);
    button.setInteractive({ useHandCursor: true });

    const buttonText = this.add.text(buttonX, buttonY, 'PAY WITH CASH', {
      fontSize: '24px',
      fontFamily: 'Georgia, serif',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 3,
      fontStyle: 'bold',
    });
    buttonText.setOrigin(0.5);

    button.on('pointerover', () => {
      button.setFillStyle(0x66BB6A);
      this.tweens.add({ targets: [button, buttonText], scaleX: 1.05, scaleY: 1.05, duration: 100 });
    });

    button.on('pointerout', () => {
      button.setFillStyle(0x4CAF50);
      this.tweens.add({ targets: [button, buttonText], scaleX: 1, scaleY: 1, duration: 100 });
    });

    button.on('pointerdown', () => {
      this.payWithCash();
    });
  }

  /**
   * Pay debt with cash directly
   */
  payWithCash() {
    // Calculate how much cash we can use
    const remaining = this.debtDue - this.totalPaid;
    const cashToUse = Math.min(this.currentCash, remaining);

    if (cashToUse > 0) {
      this.currentCash -= cashToUse;
      this.totalPaid += cashToUse;
      this.cashText.setText(`Cash: $${this.currentCash}`);
      this.paidText.setText(`Paid: $${this.totalPaid}`);

      // Check if debt fully paid
      if (this.totalPaid >= this.debtDue) {
        this.time.delayedCall(500, () => {
          this.debtPaid();
        });
      }
    }
  }

  /**
   * Debt successfully paid
   */
  debtPaid() {
    // Success message
    const successText = this.add.text(
      GameConfig.SCREEN.WIDTH / 2,
      GameConfig.SCREEN.HEIGHT / 2,
      'DEBT PAID!',
      {
        fontSize: '72px',
        fontFamily: 'Georgia, serif',
        color: '#00FF00',
        stroke: '#000000',
        strokeThickness: 6,
        fontStyle: 'bold',
      }
    );
    successText.setOrigin(0.5);
    successText.setAlpha(0);

    this.tweens.add({
      targets: successText,
      alpha: 1,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 500,
      ease: 'Back.easeOut',
    });

    // Continue to week-end dialogue after 2 seconds
    this.time.delayedCall(2000, () => {
      this.cameras.main.fadeOut(500);
      this.time.delayedCall(500, () => {
        // Get the GameScene and update its debt manager
        const gameScene = this.scene.get('GameScene');
        if (gameScene && gameScene.debtManager) {
          gameScene.debtManager.cash = this.currentCash;
          // Advance to next day
          gameScene.debtManager.advanceDay();
        }

        console.log(`[PaymentScene] Debt paid! Advancing to next day and resuming GameScene.`);

        // Stop PaymentScene and resume GameScene (don't restart!)
        this.scene.stop('PaymentScene');
        this.scene.resume('GameScene');
      });
    });
  }

  /**
   * Create "Can't Pay" button (triggers debt game over)
   */
  createCantPayButton() {
    const buttonX = GameConfig.SCREEN.WIDTH - 150;
    const buttonY = 150;

    const button = this.add.rectangle(buttonX, buttonY, 200, 50, 0x8B0000);
    button.setStrokeStyle(3, 0xFF0000);

    const buttonText = this.add.text(buttonX, buttonY, "CAN'T PAY", {
      fontSize: '20px',
      fontFamily: 'Georgia, serif',
      color: '#FFFFFF',
      fontStyle: 'bold',
    });
    buttonText.setOrigin(0.5);

    button.setInteractive({ useHandCursor: true });

    button.on('pointerover', () => {
      button.setFillStyle(0xB22222);
      this.tweens.add({ targets: [button, buttonText], scaleX: 1.05, scaleY: 1.05, duration: 100 });
    });

    button.on('pointerout', () => {
      button.setFillStyle(0x8B0000);
      this.tweens.add({ targets: [button, buttonText], scaleX: 1, scaleY: 1, duration: 100 });
    });

    button.on('pointerdown', () => {
      this.triggerDebtGameOver();
    });
  }

  /**
   * Check if player can afford the debt at all
   */
  checkIfAffordable() {
    // Calculate total possible money
    const totalCash = this.currentCash + this.totalPaid;

    // Calculate value of all sellable items
    let inventoryValue = 0;
    this.harvestedCrops.forEach(crop => {
      inventoryValue += crop.value || 10;
    });
    this.products.forEach(product => {
      inventoryValue += product.value || 20;
    });
    // Animals are worth a lot, add if player is desperate
    this.animals.forEach(animal => {
      inventoryValue += 50; // Rough estimate
    });

    const totalAvailable = totalCash + inventoryValue;

    // If player can't possibly pay even by selling everything
    if (totalAvailable < this.debtDue) {
      console.warn(`[PaymentScene] Player cannot afford debt! Available: $${totalAvailable}, Due: $${this.debtDue}`);

      // Auto-trigger warning dialogue after a delay
      this.time.delayedCall(3000, () => {
        this.showInsufficientFundsWarning();
      });
    }
  }

  /**
   * Show warning when funds are insufficient
   */
  showInsufficientFundsWarning() {
    const warningText = this.add.text(
      GameConfig.SCREEN.WIDTH / 2,
      GameConfig.SCREEN.HEIGHT / 2 - 100,
      'NOT ENOUGH MONEY!',
      {
        fontSize: '48px',
        fontFamily: 'Georgia, serif',
        color: '#FF0000',
        stroke: '#000000',
        strokeThickness: 6,
        fontStyle: 'bold',
      }
    );
    warningText.setOrigin(0.5);
    warningText.setAlpha(0);

    this.tweens.add({
      targets: warningText,
      alpha: 1,
      duration: 500,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        warningText.destroy();
      }
    });
  }

  /**
   * Trigger debt game over (slaughter ending)
   */
  triggerDebtGameOver() {
    console.log('[PaymentScene] Triggering debt game over...');

    this.cameras.main.fadeOut(1000, 0, 0, 0);

    this.time.delayedCall(1000, () => {
      // Start debt game over dialogue
      this.scene.start('DialogueScene', {
        dialogueKey: 'debt_game_over',
        nextScene: 'GameOverScene',
        nextSceneData: {
          reason: 'debt',
          message: 'The farm claims another victim...'
        }
      });
    });
  }
}
