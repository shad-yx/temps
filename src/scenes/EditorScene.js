/**
 * EditorScene.js
 * Phaser scene for previewing cinematics, gameplay, and collections in the editor
 *
 * Features:
 * - Real-time cinematic preview with CinematicPlayer
 * - Gameplay mechanics testing
 * - Visual feedback for template editing
 * - Hot-reload support for template changes
 */

import { CinematicPlayer } from '../runtime/CinematicPlayer.js';

export class EditorScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EditorScene' });

        this.previewMode = null; // 'cinematic', 'gameplay', 'collection'
        this.currentTemplate = null;
        this.previewElements = [];
    }

    init(data) {
        this.previewMode = data.mode || 'cinematic';
        this.currentTemplate = data.template;

        console.log('[EditorScene] Initializing preview:', this.previewMode);
    }

    create() {
        // Setup preview environment
        this.setupPreviewEnvironment();

        // Load and display preview based on mode
        this.loadPreview();

        // Setup editor controls
        this.setupEditorControls();
    }

    setupPreviewEnvironment() {
        // Clear scene
        this.cameras.main.setBackgroundColor('#1a1a1a');

        // Add grid for reference (can be toggled)
        this.showGrid = true;
        this.gridGraphics = this.add.graphics();
        this.drawGrid();

        // Add reference guides
        this.guidesGraphics = this.add.graphics();

        // Add preview label
        this.previewLabel = this.add.text(10, 10, `PREVIEW MODE: ${this.previewMode.toUpperCase()}`, {
            fontFamily: 'Arial',
            fontSize: '14px',
            color: '#ffcc00',
            backgroundColor: '#000000',
            padding: { x: 8, y: 4 }
        }).setDepth(10000);
    }

    drawGrid() {
        if (!this.showGrid || !this.gridGraphics) return;

        this.gridGraphics.clear();
        this.gridGraphics.lineStyle(1, 0x333333, 0.5);

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const gridSize = 50;

        // Vertical lines
        for (let x = 0; x <= width; x += gridSize) {
            this.gridGraphics.beginPath();
            this.gridGraphics.moveTo(x, 0);
            this.gridGraphics.lineTo(x, height);
            this.gridGraphics.strokePath();
        }

        // Horizontal lines
        for (let y = 0; y <= height; y += gridSize) {
            this.gridGraphics.beginPath();
            this.gridGraphics.moveTo(0, y);
            this.gridGraphics.lineTo(width, y);
            this.gridGraphics.strokePath();
        }

        // Center cross
        this.gridGraphics.lineStyle(2, 0xffcc00, 0.7);
        this.gridGraphics.beginPath();
        this.gridGraphics.moveTo(width / 2, 0);
        this.gridGraphics.lineTo(width / 2, height);
        this.gridGraphics.strokePath();

        this.gridGraphics.beginPath();
        this.gridGraphics.moveTo(0, height / 2);
        this.gridGraphics.lineTo(width, height / 2);
        this.gridGraphics.strokePath();
    }

    loadPreview() {
        if (!this.currentTemplate) {
            this.showPlaceholder();
            return;
        }

        switch (this.previewMode) {
            case 'cinematic':
                this.previewCinematic();
                break;
            case 'gameplay':
                this.previewGameplay();
                break;
            case 'collection':
                this.previewCollection();
                break;
        }
    }

    previewCinematic() {
        console.log('[EditorScene] Previewing cinematic:', this.currentTemplate.id);

        // Clear existing preview
        this.clearPreview();

        // Start cinematic player in preview mode
        this.scene.launch('CinematicPlayer', {
            cinematicId: this.currentTemplate.id,
            onComplete: () => {
                console.log('[EditorScene] Cinematic preview complete');
            },
            onChoice: (choice) => {
                console.log('[EditorScene] Choice made:', choice);
            },
            onEvent: (event, data) => {
                console.log('[EditorScene] Event triggered:', event, data);
            }
        });

        // Note: In a real implementation, you'd pass the template data directly
        // instead of loading from file
    }

    previewGameplay() {
        console.log('[EditorScene] Previewing gameplay:', this.currentTemplate.id);

        this.clearPreview();

        const template = this.currentTemplate;

        // Preview gameplay mechanics
        this.add.text(
            this.cameras.main.width / 2,
            100,
            `Gameplay Template: ${template.name || template.id}`,
            {
                fontFamily: 'Arial',
                fontSize: '24px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        // Show gameplay properties
        let y = 200;
        const props = [
            `Day Duration: ${template.dayDuration || 'N/A'}ms`,
            `Initial Money: $${template.initialMoney || 0}`,
            `Debt Target: $${template.debtTarget || 0}`,
            `Animal Types: ${template.animalTypes?.length || 0}`,
            `Crop Types: ${template.cropTypes?.length || 0}`,
            `Events: ${template.events?.length || 0}`
        ];

        props.forEach(prop => {
            this.add.text(100, y, prop, {
                fontFamily: 'Arial',
                fontSize: '16px',
                color: '#cccccc'
            });
            y += 30;
        });

        // Visualize animals if available
        if (template.animalTypes) {
            this.visualizeAnimals(template.animalTypes);
        }
    }

    visualizeAnimals(animalTypes) {
        const startX = 100;
        const startY = 400;
        const spacing = 120;

        animalTypes.forEach((animal, index) => {
            const x = startX + (index % 5) * spacing;
            const y = startY + Math.floor(index / 5) * spacing;

            // Animal placeholder
            const rect = this.add.rectangle(x, y, 80, 80, 0x4a9eff, 0.5);
            rect.setStrokeStyle(2, 0x4a9eff);

            // Animal name
            this.add.text(x, y + 50, animal.name, {
                fontFamily: 'Arial',
                fontSize: '12px',
                color: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);

            this.previewElements.push(rect);
        });
    }

    previewCollection() {
        console.log('[EditorScene] Previewing collection:', this.currentTemplate.id);

        this.clearPreview();

        const template = this.currentTemplate;

        // Collection preview
        this.add.text(
            this.cameras.main.width / 2,
            100,
            `Collection Template: ${template.name || template.id}`,
            {
                fontFamily: 'Arial',
                fontSize: '24px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        // Show collection properties
        let y = 200;
        const props = [
            `Type: ${template.type || 'N/A'}`,
            `Day: ${template.day || 'N/A'}`,
            `Amount Required: $${template.amountRequired || 0}`,
            `Grace Period: ${template.gracePeriod || 0} days`,
            `Consequences: ${template.consequences?.length || 0}`
        ];

        props.forEach(prop => {
            this.add.text(100, y, prop, {
                fontFamily: 'Arial',
                fontSize: '16px',
                color: '#cccccc'
            });
            y += 30;
        });

        // Visualize collection sequence
        if (template.consequences) {
            this.visualizeConsequences(template.consequences);
        }
    }

    visualizeConsequences(consequences) {
        const startY = 350;
        const spacing = 60;

        this.add.text(100, startY - 30, 'Consequences:', {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#ffcc00',
            fontStyle: 'bold'
        });

        consequences.forEach((consequence, index) => {
            const y = startY + index * spacing;

            // Consequence box
            const bg = this.add.rectangle(100, y, 600, 50, 0x333333, 0.8);
            bg.setOrigin(0, 0);

            // Consequence text
            this.add.text(110, y + 10, `Day ${consequence.day}: ${consequence.description}`, {
                fontFamily: 'Arial',
                fontSize: '14px',
                color: '#ffffff'
            });

            this.previewElements.push(bg);
        });
    }

    showPlaceholder() {
        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'No template loaded\nCreate or select a template to preview',
            {
                fontFamily: 'Arial',
                fontSize: '20px',
                color: '#666666',
                align: 'center'
            }
        ).setOrigin(0.5);
    }

    clearPreview() {
        // Destroy all preview elements
        this.previewElements.forEach(element => {
            if (element && element.destroy) {
                element.destroy();
            }
        });
        this.previewElements = [];

        // Stop cinematic player if running
        if (this.scene.isActive('CinematicPlayer')) {
            this.scene.stop('CinematicPlayer');
        }
    }

    setupEditorControls() {
        // Keyboard controls for editor
        this.input.keyboard.on('keydown-G', () => {
            this.showGrid = !this.showGrid;
            if (this.showGrid) {
                this.drawGrid();
            } else {
                this.gridGraphics.clear();
            }
        });

        this.input.keyboard.on('keydown-R', () => {
            // Reload preview
            this.loadPreview();
        });

        this.input.keyboard.on('keydown-ESC', () => {
            // Exit preview mode
            this.exitPreview();
        });

        // Add control hints
        this.add.text(10, this.cameras.main.height - 80,
            'Controls:\n[G] Toggle Grid  [R] Reload  [ESC] Exit Preview',
            {
                fontFamily: 'Arial',
                fontSize: '12px',
                color: '#888888',
                backgroundColor: '#000000',
                padding: { x: 8, y: 4 }
            }
        ).setDepth(10000);
    }

    reloadTemplate(template) {
        this.currentTemplate = template;
        this.loadPreview();
        console.log('[EditorScene] Template reloaded');
    }

    exitPreview() {
        console.log('[EditorScene] Exiting preview');

        // Return to editor UI
        if (window.EditorUI) {
            window.EditorUI.show();
        }

        this.scene.stop();
    }

    update(time, delta) {
        // Update preview if needed
    }
}
