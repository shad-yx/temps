/**
 * GameplayEditor.js
 * Form-based editor for gameplay templates in DEADDAY
 *
 * Features:
 * - Edit game mechanics parameters
 * - Configure animal and crop types
 * - Set up day/night cycle timing
 * - Define random events
 * - Manage debt and economy settings
 */

export class GameplayEditor {
    constructor() {
        this.container = null;
        this.currentTemplate = null;
        this.isDirty = false;

        // Callbacks
        this.onSave = null;
        this.onCancel = null;
    }

    init(containerId = 'gameplay-editor') {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('[GameplayEditor] Container not found:', containerId);
            return;
        }

        this.buildUI();
        this.setupEventListeners();

        console.log('[GameplayEditor] Initialized');
    }

    buildUI() {
        this.container.innerHTML = `
            <div class="gameplay-editor">
                <div class="editor-header">
                    <h2>Gameplay Template Editor</h2>
                    <div class="header-actions">
                        <button id="gp-new-btn" class="btn">New</button>
                        <button id="gp-load-btn" class="btn">Load</button>
                        <button id="gp-save-btn" class="btn btn-primary">Save</button>
                    </div>
                </div>

                <div class="editor-content">
                    <form id="gameplay-form">
                        <!-- Basic Info -->
                        <section class="form-section">
                            <h3>Basic Information</h3>
                            <div class="form-group">
                                <label>Template ID</label>
                                <input type="text" id="gp-id" name="id" required>
                            </div>
                            <div class="form-group">
                                <label>Template Name</label>
                                <input type="text" id="gp-name" name="name" required>
                            </div>
                            <div class="form-group">
                                <label>Description</label>
                                <textarea id="gp-description" name="description" rows="3"></textarea>
                            </div>
                        </section>

                        <!-- Game Timing -->
                        <section class="form-section">
                            <h3>Time & Cycles</h3>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Day Duration (ms)</label>
                                    <input type="number" id="gp-day-duration" name="dayDuration" value="180000" step="1000">
                                </div>
                                <div class="form-group">
                                    <label>Night Duration (ms)</label>
                                    <input type="number" id="gp-night-duration" name="nightDuration" value="60000" step="1000">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Max Days</label>
                                    <input type="number" id="gp-max-days" name="maxDays" value="30" min="1">
                                </div>
                                <div class="form-group">
                                    <label>Start Day</label>
                                    <input type="number" id="gp-start-day" name="startDay" value="1" min="1">
                                </div>
                            </div>
                        </section>

                        <!-- Economy -->
                        <section class="form-section">
                            <h3>Economy Settings</h3>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Initial Money ($)</label>
                                    <input type="number" id="gp-initial-money" name="initialMoney" value="500" min="0">
                                </div>
                                <div class="form-group">
                                    <label>Total Debt ($)</label>
                                    <input type="number" id="gp-debt-target" name="debtTarget" value="10000" min="0">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Daily Interest Rate (%)</label>
                                    <input type="number" id="gp-interest-rate" name="interestRate" value="2" step="0.1" min="0">
                                </div>
                                <div class="form-group">
                                    <label>Collection Start Day</label>
                                    <input type="number" id="gp-collection-start" name="collectionStartDay" value="3" min="1">
                                </div>
                            </div>
                        </section>

                        <!-- Animals -->
                        <section class="form-section">
                            <h3>Animal Types</h3>
                            <div id="gp-animals-list"></div>
                            <button type="button" id="gp-add-animal-btn" class="btn btn-secondary">+ Add Animal</button>
                        </section>

                        <!-- Crops -->
                        <section class="form-section">
                            <h3>Crop Types</h3>
                            <div id="gp-crops-list"></div>
                            <button type="button" id="gp-add-crop-btn" class="btn btn-secondary">+ Add Crop</button>
                        </section>

                        <!-- Random Events -->
                        <section class="form-section">
                            <h3>Random Events</h3>
                            <div id="gp-events-list"></div>
                            <button type="button" id="gp-add-event-btn" class="btn btn-secondary">+ Add Event</button>
                        </section>

                        <!-- Difficulty Modifiers -->
                        <section class="form-section">
                            <h3>Difficulty Modifiers</h3>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Product Value Multiplier</label>
                                    <input type="number" id="gp-product-mult" name="productValueMultiplier" value="1.0" step="0.1" min="0">
                                </div>
                                <div class="form-group">
                                    <label>Animal Cost Multiplier</label>
                                    <input type="number" id="gp-cost-mult" name="animalCostMultiplier" value="1.0" step="0.1" min="0">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Production Speed Multiplier</label>
                                    <input type="number" id="gp-speed-mult" name="productionSpeedMultiplier" value="1.0" step="0.1" min="0">
                                </div>
                                <div class="form-group">
                                    <label>Event Frequency Multiplier</label>
                                    <input type="number" id="gp-event-mult" name="eventFrequencyMultiplier" value="1.0" step="0.1" min="0">
                                </div>
                            </div>
                        </section>
                    </form>
                </div>
            </div>
        `;

        this.applyStyles();
    }

    applyStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .gameplay-editor {
                height: 100%;
                display: flex;
                flex-direction: column;
                background: #1a1a1a;
                color: #fff;
            }

            .editor-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px;
                background: #252525;
                border-bottom: 2px solid #000;
            }

            .editor-header h2 {
                margin: 0;
                font-size: 18px;
                font-weight: bold;
            }

            .header-actions {
                display: flex;
                gap: 8px;
            }

            .editor-content {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
            }

            .form-section {
                background: #252525;
                padding: 20px;
                margin-bottom: 20px;
                border-radius: 4px;
                border: 1px solid #333;
            }

            .form-section h3 {
                margin: 0 0 16px 0;
                font-size: 16px;
                color: #4a9eff;
                border-bottom: 1px solid #333;
                padding-bottom: 8px;
            }

            .form-group {
                margin-bottom: 16px;
            }

            .form-group label {
                display: block;
                margin-bottom: 6px;
                font-size: 13px;
                color: #ccc;
            }

            .form-group input,
            .form-group textarea,
            .form-group select {
                width: 100%;
                padding: 8px;
                background: #1a1a1a;
                border: 1px solid #444;
                color: #fff;
                border-radius: 3px;
                font-size: 13px;
            }

            .form-group input:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: #4a9eff;
            }

            .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }

            .btn {
                padding: 8px 16px;
                background: #404040;
                border: 1px solid #555;
                color: #fff;
                cursor: pointer;
                border-radius: 3px;
                font-size: 13px;
            }

            .btn:hover {
                background: #505050;
            }

            .btn-primary {
                background: #4a9eff;
                border-color: #4a9eff;
            }

            .btn-primary:hover {
                background: #5aa9ff;
            }

            .btn-secondary {
                background: #2a2a2a;
                border-color: #444;
            }

            .btn-danger {
                background: #ff4444;
                border-color: #ff4444;
            }

            .list-item {
                background: #1a1a1a;
                padding: 12px;
                margin-bottom: 8px;
                border-radius: 3px;
                border: 1px solid #333;
            }

            .list-item-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }

            .list-item-title {
                font-weight: bold;
                color: #4a9eff;
            }

            .list-item-actions {
                display: flex;
                gap: 4px;
            }

            .list-item-actions button {
                padding: 4px 8px;
                font-size: 11px;
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Header buttons
        document.getElementById('gp-new-btn')?.addEventListener('click', () => this.newTemplate());
        document.getElementById('gp-load-btn')?.addEventListener('click', () => this.loadTemplate());
        document.getElementById('gp-save-btn')?.addEventListener('click', () => this.saveTemplate());

        // Add buttons
        document.getElementById('gp-add-animal-btn')?.addEventListener('click', () => this.addAnimal());
        document.getElementById('gp-add-crop-btn')?.addEventListener('click', () => this.addCrop());
        document.getElementById('gp-add-event-btn')?.addEventListener('click', () => this.addEvent());

        // Form changes
        const form = document.getElementById('gameplay-form');
        form?.addEventListener('input', () => {
            this.isDirty = true;
        });
    }

    newTemplate() {
        if (this.isDirty && !confirm('Unsaved changes will be lost. Continue?')) {
            return;
        }

        this.currentTemplate = {
            id: 'new_gameplay',
            name: 'New Gameplay Template',
            description: '',
            dayDuration: 180000,
            nightDuration: 60000,
            maxDays: 30,
            startDay: 1,
            initialMoney: 500,
            debtTarget: 10000,
            interestRate: 2,
            collectionStartDay: 3,
            animalTypes: [],
            cropTypes: [],
            events: [],
            productValueMultiplier: 1.0,
            animalCostMultiplier: 1.0,
            productionSpeedMultiplier: 1.0,
            eventFrequencyMultiplier: 1.0
        };

        this.populateForm();
        this.isDirty = false;

        console.log('[GameplayEditor] New template created');
    }

    async loadTemplate() {
        if (this.isDirty && !confirm('Unsaved changes will be lost. Continue?')) {
            return;
        }

        // Get available templates
        const templates = await window.DEADDAY.templateRegistry.listTemplates('gameplay');

        if (templates.length === 0) {
            alert('No gameplay templates found');
            return;
        }

        // Show selection dialog
        const templateId = prompt('Enter template ID:\n' + templates.map(t => `- ${t}`).join('\n'));

        if (templateId) {
            const template = await window.DEADDAY.templateRegistry.getTemplate('gameplay', templateId);
            if (template) {
                this.currentTemplate = template;
                this.populateForm();
                this.isDirty = false;
                console.log('[GameplayEditor] Template loaded:', templateId);
            } else {
                alert('Template not found');
            }
        }
    }

    populateForm() {
        if (!this.currentTemplate) return;

        // Basic info
        document.getElementById('gp-id').value = this.currentTemplate.id || '';
        document.getElementById('gp-name').value = this.currentTemplate.name || '';
        document.getElementById('gp-description').value = this.currentTemplate.description || '';

        // Timing
        document.getElementById('gp-day-duration').value = this.currentTemplate.dayDuration || 180000;
        document.getElementById('gp-night-duration').value = this.currentTemplate.nightDuration || 60000;
        document.getElementById('gp-max-days').value = this.currentTemplate.maxDays || 30;
        document.getElementById('gp-start-day').value = this.currentTemplate.startDay || 1;

        // Economy
        document.getElementById('gp-initial-money').value = this.currentTemplate.initialMoney || 500;
        document.getElementById('gp-debt-target').value = this.currentTemplate.debtTarget || 10000;
        document.getElementById('gp-interest-rate').value = this.currentTemplate.interestRate || 2;
        document.getElementById('gp-collection-start').value = this.currentTemplate.collectionStartDay || 3;

        // Difficulty
        document.getElementById('gp-product-mult').value = this.currentTemplate.productValueMultiplier || 1.0;
        document.getElementById('gp-cost-mult').value = this.currentTemplate.animalCostMultiplier || 1.0;
        document.getElementById('gp-speed-mult').value = this.currentTemplate.productionSpeedMultiplier || 1.0;
        document.getElementById('gp-event-mult').value = this.currentTemplate.eventFrequencyMultiplier || 1.0;

        // Lists
        this.renderAnimalsList();
        this.renderCropsList();
        this.renderEventsList();
    }

    renderAnimalsList() {
        const container = document.getElementById('gp-animals-list');
        container.innerHTML = '';

        if (!this.currentTemplate.animalTypes || this.currentTemplate.animalTypes.length === 0) {
            container.innerHTML = '<p style="color: #666; font-style: italic;">No animals defined</p>';
            return;
        }

        this.currentTemplate.animalTypes.forEach((animal, index) => {
            const item = document.createElement('div');
            item.className = 'list-item';
            item.innerHTML = `
                <div class="list-item-header">
                    <span class="list-item-title">${animal.name || 'Unnamed Animal'}</span>
                    <div class="list-item-actions">
                        <button class="btn btn-secondary" onclick="window.gameplayEditor.editAnimal(${index})">Edit</button>
                        <button class="btn btn-danger" onclick="window.gameplayEditor.removeAnimal(${index})">Delete</button>
                    </div>
                </div>
                <div style="font-size: 11px; color: #999;">
                    Cost: $${animal.cost || 0} | Product: ${animal.productType || 'N/A'} | Value: $${animal.productValue || 0}
                </div>
            `;
            container.appendChild(item);
        });
    }

    renderCropsList() {
        const container = document.getElementById('gp-crops-list');
        container.innerHTML = '';

        if (!this.currentTemplate.cropTypes || this.currentTemplate.cropTypes.length === 0) {
            container.innerHTML = '<p style="color: #666; font-style: italic;">No crops defined</p>';
            return;
        }

        this.currentTemplate.cropTypes.forEach((crop, index) => {
            const item = document.createElement('div');
            item.className = 'list-item';
            item.innerHTML = `
                <div class="list-item-header">
                    <span class="list-item-title">${crop.name || 'Unnamed Crop'}</span>
                    <div class="list-item-actions">
                        <button class="btn btn-secondary" onclick="window.gameplayEditor.editCrop(${index})">Edit</button>
                        <button class="btn btn-danger" onclick="window.gameplayEditor.removeCrop(${index})">Delete</button>
                    </div>
                </div>
                <div style="font-size: 11px; color: #999;">
                    Grow Time: ${crop.growTime || 0}ms | Value: $${crop.value || 0}
                </div>
            `;
            container.appendChild(item);
        });
    }

    renderEventsList() {
        const container = document.getElementById('gp-events-list');
        container.innerHTML = '';

        if (!this.currentTemplate.events || this.currentTemplate.events.length === 0) {
            container.innerHTML = '<p style="color: #666; font-style: italic;">No events defined</p>';
            return;
        }

        this.currentTemplate.events.forEach((event, index) => {
            const item = document.createElement('div');
            item.className = 'list-item';
            item.innerHTML = `
                <div class="list-item-header">
                    <span class="list-item-title">${event.name || 'Unnamed Event'}</span>
                    <div class="list-item-actions">
                        <button class="btn btn-secondary" onclick="window.gameplayEditor.editEvent(${index})">Edit</button>
                        <button class="btn btn-danger" onclick="window.gameplayEditor.removeEvent(${index})">Delete</button>
                    </div>
                </div>
                <div style="font-size: 11px; color: #999;">
                    Probability: ${event.probability || 0}% | Type: ${event.type || 'N/A'}
                </div>
            `;
            container.appendChild(item);
        });
    }

    addAnimal() {
        const animal = {
            id: `animal_${Date.now()}`,
            name: 'New Animal',
            cost: 100,
            productType: 'generic',
            productValue: 50,
            productionTime: 30000
        };

        if (!this.currentTemplate.animalTypes) {
            this.currentTemplate.animalTypes = [];
        }

        this.currentTemplate.animalTypes.push(animal);
        this.renderAnimalsList();
        this.isDirty = true;
    }

    addCrop() {
        const crop = {
            id: `crop_${Date.now()}`,
            name: 'New Crop',
            growTime: 60000,
            value: 30
        };

        if (!this.currentTemplate.cropTypes) {
            this.currentTemplate.cropTypes = [];
        }

        this.currentTemplate.cropTypes.push(crop);
        this.renderCropsList();
        this.isDirty = true;
    }

    addEvent() {
        const event = {
            id: `event_${Date.now()}`,
            name: 'New Event',
            type: 'random',
            probability: 10,
            description: 'Event description'
        };

        if (!this.currentTemplate.events) {
            this.currentTemplate.events = [];
        }

        this.currentTemplate.events.push(event);
        this.renderEventsList();
        this.isDirty = true;
    }

    removeAnimal(index) {
        if (confirm('Delete this animal?')) {
            this.currentTemplate.animalTypes.splice(index, 1);
            this.renderAnimalsList();
            this.isDirty = true;
        }
    }

    removeCrop(index) {
        if (confirm('Delete this crop?')) {
            this.currentTemplate.cropTypes.splice(index, 1);
            this.renderCropsList();
            this.isDirty = true;
        }
    }

    removeEvent(index) {
        if (confirm('Delete this event?')) {
            this.currentTemplate.events.splice(index, 1);
            this.renderEventsList();
            this.isDirty = true;
        }
    }

    async saveTemplate() {
        // Gather form data
        const formData = new FormData(document.getElementById('gameplay-form'));
        const template = {};

        for (let [key, value] of formData.entries()) {
            // Convert numbers
            if (['dayDuration', 'nightDuration', 'maxDays', 'startDay', 'initialMoney',
                 'debtTarget', 'interestRate', 'collectionStartDay'].includes(key)) {
                template[key] = parseInt(value);
            } else if (['productValueMultiplier', 'animalCostMultiplier',
                        'productionSpeedMultiplier', 'eventFrequencyMultiplier'].includes(key)) {
                template[key] = parseFloat(value);
            } else {
                template[key] = value;
            }
        }

        // Add lists
        template.animalTypes = this.currentTemplate.animalTypes || [];
        template.cropTypes = this.currentTemplate.cropTypes || [];
        template.events = this.currentTemplate.events || [];

        // Save to registry
        try {
            await window.DEADDAY.templateRegistry.saveTemplate('gameplay', template.id, template);
            this.isDirty = false;
            alert('Template saved successfully!');
            console.log('[GameplayEditor] Template saved:', template.id);
        } catch (error) {
            console.error('[GameplayEditor] Save failed:', error);
            alert('Failed to save template: ' + error.message);
        }
    }
}

// Make globally accessible for inline event handlers
window.gameplayEditor = new GameplayEditor();
