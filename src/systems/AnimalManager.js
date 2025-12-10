/**
 * AnimalManager.js
 * Manages all farm animals and their production
 */

import { GameConfig } from '../config/GameConfig.js';
import { Animal } from '../entities/Animal.js';
import { AnimalProduct } from '../entities/AnimalProduct.js';

export class AnimalManager {
  constructor(scene) {
    this.scene = scene;
    this.animals = []; // All active animals
    this.products = []; // All active products

    // Make AnimalProduct available to Animal class
    this.scene.AnimalProduct = AnimalProduct;
  }

  /**
   * Create animal enclosures with starting animals
   */
  createEnclosures() {
    console.log('[AnimalManager] Creating enclosures...');

    // Fixed enclosure positions (BOTTOM-LEFT horizontal layout)
    const enclosurePositions = [
      { x: 120, y: 680, type: 'CHICKEN' },
      { x: 280, y: 680, type: 'COW' },
      { x: 440, y: 680, type: 'SHEEP' },
    ];

    // Create enclosure backgrounds
    enclosurePositions.forEach((pos, index) => {
      this.createEnclosureBackground(pos.x, pos.y, index);
    });

    // Add starting animals (all 3 types)
    console.log('[AnimalManager] Adding starting animals...');
    this.addAnimal(enclosurePositions[0].x, enclosurePositions[0].y, 'CHICKEN');
    this.addAnimal(enclosurePositions[1].x, enclosurePositions[1].y, 'COW');
    this.addAnimal(enclosurePositions[2].x, enclosurePositions[2].y, 'SHEEP');

    // Store enclosure positions for future use
    this.enclosures = enclosurePositions;
    console.log('[AnimalManager] Enclosures created successfully');
  }

  /**
   * Create visual background for enclosure
   */
  createEnclosureBackground(x, y, index) {
    // Fence/pen background (SMALLER for horizontal layout)
    const bg = this.scene.add.graphics();
    bg.lineStyle(4, 0x8B4513, 1);
    bg.strokeRoundedRect(x - 60, y - 40, 120, 80, 8);

    // Fill with lighter color
    bg.fillStyle(0x654321, 0.3);
    bg.fillRoundedRect(x - 60, y - 40, 120, 80, 8);

    // Ground texture (dirt)
    bg.fillStyle(0x8B6F47, 0.5);
    bg.fillRoundedRect(x - 55, y + 10, 110, 25, 5);

    // Add some hay/straw details
    for (let i = 0; i < 5; i++) {
      const hayX = x - 40 + Math.random() * 80;
      const hayY = y - 50 + Math.random() * 100;
      bg.lineStyle(2, 0xF4A460, 0.6);
      bg.lineBetween(hayX - 5, hayY, hayX + 5, hayY);
    }

    // Enclosure label (bottom of pen for horizontal layout)
    const label = this.scene.add.text(x, y + 50, `PEN ${index + 1}`, {
      fontSize: '12px',
      fontFamily: 'Arial',
      color: '#8B4513',
      fontStyle: 'bold',
    });
    label.setOrigin(0.5);

    // Add purchase button (if no animal in this enclosure yet)
    // Will be implemented later when player can buy animals
  }

  /**
   * Add an animal to the farm
   */
  addAnimal(x, y, animalType) {
    const animal = new Animal(this.scene, x, y, animalType);
    this.animals.push(animal);
    console.log(`[AnimalManager] Added ${animalType} at (${x}, ${y}). Total animals: ${this.animals.length}`);

    // Connect product creation to manager
    const originalProduce = animal.produceProduct.bind(animal);
    animal.produceProduct = () => {
      // Check capacity before producing
      if (animal.products.length >= animal.config.maxProducts) {
        animal.stopProduction();
        return;
      }

      // Run visual effects
      originalProduce();

      // Create AnimalProduct and add to manager
      const product = new AnimalProduct(
        this.scene,
        animal.container.x,
        animal.container.y - 100,
        animal.config.productType,
        animal.config.productValue
      );

      this.products.push(product);
      animal.products.push(product);
      console.log(`[AnimalManager] ${animalType} produced ${animal.config.productType}. Total products: ${this.products.length}`);

      // Connect product removal
      const originalDestroy = product.destroy.bind(product);
      product.destroy = () => {
        this.removeProduct(product);
        animal.removeProduct(product);
        originalDestroy();
      };

      // Continue production if not at max
      if (animal.products.length < animal.config.maxProducts) {
        animal.startProduction();
      } else {
        animal.stopProduction();
      }
    };

    return animal;
  }

  /**
   * Remove an animal (when sold or destroyed)
   */
  removeAnimal(animal) {
    const index = this.animals.indexOf(animal);
    if (index > -1) {
      this.animals.splice(index, 1);
    }
  }

  /**
   * Remove a product from tracking
   */
  removeProduct(product) {
    const index = this.products.indexOf(product);
    if (index > -1) {
      this.products.splice(index, 1);
    }
  }

  /**
   * Get all animals data for payment scene
   */
  getAnimalsData() {
    const data = this.animals.map(animal => animal.getData());
    console.log(`[AnimalManager] getAnimalsData: ${data.length} animals`);
    return data;
  }

  /**
   * Get all products data for payment scene
   */
  getProductsData() {
    const data = this.products.map(product => product.getData());
    console.log(`[AnimalManager] getProductsData: ${data.length} products`);
    return data;
  }

  /**
   * Get total value of all animals
   */
  getTotalAnimalValue() {
    return this.animals.reduce((sum, animal) => {
      return sum + animal.config.sellValue;
    }, 0);
  }

  /**
   * Get total value of all products
   */
  getTotalProductValue() {
    return this.products.reduce((sum, product) => {
      return sum + product.value;
    }, 0);
  }

  /**
   * Clear all animals (when starting new day)
   */
  clearAnimals() {
    this.animals.forEach(animal => animal.destroy());
    this.animals = [];
  }

  /**
   * Clear all products (when starting new day)
   */
  clearProducts() {
    this.products.forEach(product => product.destroy());
    this.products = [];
  }

  /**
   * Update method (called each frame)
   */
  update() {
    // Update all animals
    this.animals.forEach(animal => {
      if (animal.update) {
        animal.update();
      }
    });

    // Clean up destroyed products
    this.products = this.products.filter(product => {
      return product.sprite && product.sprite.scene;
    });
  }

  /**
   * Pause all animal production (for payment screen)
   */
  pauseProduction() {
    this.animals.forEach(animal => animal.stopProduction());
  }

  /**
   * Resume all animal production (after payment screen)
   */
  resumeProduction() {
    this.animals.forEach(animal => {
      if (animal.products.length < animal.config.maxProducts) {
        animal.startProduction();
      }
    });
  }

  /**
   * Get animal count by type
   */
  getAnimalCount(animalType) {
    return this.animals.filter(a => a.animalType === animalType).length;
  }

  /**
   * Get total animal count
   */
  getTotalAnimalCount() {
    return this.animals.length;
  }

  /**
   * Get available enclosure slots
   */
  getAvailableEnclosures() {
    const occupiedSlots = this.animals.map(a => ({
      x: a.x,
      y: a.y,
    }));

    return this.enclosures.filter(enclosure => {
      return !occupiedSlots.some(slot =>
        Math.abs(slot.x - enclosure.x) < 10 &&
        Math.abs(slot.y - enclosure.y) < 10
      );
    });
  }

  /**
   * Buy a new animal (if player has cash)
   */
  buyAnimal(animalType) {
    const config = GameConfig.ANIMALS[animalType];
    const available = this.getAvailableEnclosures();

    if (available.length === 0) {
      console.log('[AnimalManager] No available enclosures');
      return false;
    }

    // Check if player has enough cash
    if (this.scene.debtManager && this.scene.debtManager.cash >= config.sellValue) {
      // Deduct cash
      this.scene.debtManager.addCash(-config.sellValue);

      // Add animal to first available enclosure
      const slot = available[0];
      this.addAnimal(slot.x, slot.y, slot.type);

      console.log(`[AnimalManager] Purchased ${animalType} for $${config.sellValue}`);
      return true;
    } else {
      console.log(`[AnimalManager] Not enough cash to buy ${animalType}`);
      return false;
    }
  }

  /**
   * Clean up
   */
  destroy() {
    this.clearAnimals();
    this.clearProducts();
  }
}
