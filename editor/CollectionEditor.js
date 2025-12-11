/**
 * CollectionEditor.js
 * Form-based editor for debt collection templates in DEADDAY
 *
 * Features:
 * - Edit debt collection parameters
 * - Configure collection sequences
 * - Set up consequences and escalations
 * - Define collector visits and dialogues
 * - Manage payment requirements
 */

export class CollectionEditor {
    constructor() {
        this.container = null;
        this.currentTemplate = null;
        this.isDirty = false;

        // Callbacks
        this.onSave = null;
        this.onCancel = null;
    }

    init(containerId = 'collection-editor') {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('[CollectionEditor] Container not found:', containerId);
            return;
        }

        this.buildUI();
        this.setupEventListeners();

        console.log('[CollectionEditor] Initialized');
    }

    buildUI() {
        this.container.innerHTML = `
            <div class="collection-editor">
                <div class="editor-header">
                    <h2>Collection Template Editor</h2>
                    <div class="header-actions">
                        <button id="col-new-btn" class="btn">New</button>
                        <button id="col-load-btn" class="btn">Load</button>
                        <button id="col-save-btn" class="btn btn-primary">Save</button>
                    </div>
                </div>

                <div class="editor-content">
                    <form id="collection-form">
                        <!-- Basic Info -->
                        <section class="form-section">
                            <h3>Basic Information</h3>
                            <div class="form-group">
                                <label>Template ID</label>
                                <input type="text" id="col-id" name="id" required>
                            </div>
                            <div class="form-group">
                                <label>Template Name</label>
                                <input type="text" id="col-name" name="name" required>
                            </div>
                            <div class="form-group">
                                <label>Description</label>
                                <textarea id="col-description" name="description" rows="3"></textarea>
                            </div>
                        </section>

                        <!-- Collection Settings -->
                        <section class="form-section">
                            <h3>Collection Settings</h3>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Collection Type</label>
                                    <select id="col-type" name="type">
                                        <option value="recurring">Recurring</option>
                                        <option value="one-time">One-time</option>
                                        <option value="escalating">Escalating</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Trigger Day</label>
                                    <input type="number" id="col-day" name="day" value="3" min="1">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Amount Required ($)</label>
                                    <input type="number" id="col-amount" name="amountRequired" value="500" min="0">
                                </div>
                                <div class="form-group">
                                    <label>Grace Period (days)</label>
                                    <input type="number" id="col-grace" name="gracePeriod" value="1" min="0">
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Recurrence Interval (days)</label>
                                <input type="number" id="col-interval" name="recurrenceInterval" value="7" min="1">
                                <small style="color: #888;">Only applies to recurring collections</small>
                            </div>
                        </section>

                        <!-- Collector Profile -->
                        <section class="form-section">
                            <h3>Collector Profile</h3>
                            <div class="form-group">
                                <label>Collector Name</label>
                                <input type="text" id="col-collector-name" name="collectorName" value="Mr. Black">
                            </div>
                            <div class="form-group">
                                <label>Collector Image Key</label>
                                <input type="text" id="col-collector-image" name="collectorImage" value="collector_default">
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Threat Level</label>
                                    <select id="col-threat-level" name="threatLevel">
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="extreme">Extreme</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Personality Type</label>
                                    <select id="col-personality" name="personality">
                                        <option value="professional">Professional</option>
                                        <option value="threatening">Threatening</option>
                                        <option value="friendly">Friendly (Deceptive)</option>
                                        <option value="psychotic">Psychotic</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        <!-- Dialogues -->
                        <section class="form-section">
                            <h3>Collection Dialogues</h3>
                            <div id="col-dialogues-list"></div>
                            <button type="button" id="col-add-dialogue-btn" class="btn btn-secondary">+ Add Dialogue</button>
                        </section>

                        <!-- Consequences -->
                        <section class="form-section">
                            <h3>Consequences & Escalations</h3>
                            <div id="col-consequences-list"></div>
                            <button type="button" id="col-add-consequence-btn" class="btn btn-secondary">+ Add Consequence</button>
                        </section>

                        <!-- Payment Options -->
                        <section class="form-section">
                            <h3>Payment Options</h3>
                            <div class="form-group">
                                <label>
                                    <input type="checkbox" id="col-partial-payment" name="allowPartialPayment">
                                    Allow Partial Payment
                                </label>
                            </div>
                            <div class="form-group">
                                <label>Minimum Payment Percentage</label>
                                <input type="number" id="col-min-payment" name="minimumPaymentPercentage" value="50" min="0" max="100">
                            </div>
                            <div class="form-group">
                                <label>
                                    <input type="checkbox" id="col-negotiable" name="negotiable">
                                    Negotiable Terms
                                </label>
                            </div>
                        </section>

                        <!-- Special Conditions -->
                        <section class="form-section">
                            <h3>Special Conditions</h3>
                            <div class="form-group">
                                <label>Success Event ID (optional)</label>
                                <input type="text" id="col-success-event" name="successEvent" placeholder="event_id">
                                <small style="color: #888;">Event triggered when payment is made in full</small>
                            </div>
                            <div class="form-group">
                                <label>Failure Event ID (optional)</label>
                                <input type="text" id="col-failure-event" name="failureEvent" placeholder="event_id">
                                <small style="color: #888;">Event triggered when payment is missed</small>
                            </div>
                            <div class="form-group">
                                <label>Game Over Threshold</label>
                                <input type="number" id="col-game-over" name="gameOverThreshold" value="3" min="1">
                                <small style="color: #888;">Number of missed payments before game over</small>
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
            .collection-editor {
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
                color: #ff6b6b;
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

            .form-group input[type="checkbox"] {
                width: auto;
                margin-right: 8px;
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
            .form-group textarea:focus,
            .form-group select:focus {
                outline: none;
                border-color: #ff6b6b;
            }

            .form-group small {
                display: block;
                margin-top: 4px;
                font-size: 11px;
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
                background: #ff6b6b;
                border-color: #ff6b6b;
            }

            .btn-primary:hover {
                background: #ff7b7b;
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
                color: #ff6b6b;
            }

            .list-item-actions {
                display: flex;
                gap: 4px;
            }

            .list-item-actions button {
                padding: 4px 8px;
                font-size: 11px;
            }

            .list-item-content {
                font-size: 12px;
                color: #aaa;
                line-height: 1.4;
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Header buttons
        document.getElementById('col-new-btn')?.addEventListener('click', () => this.newTemplate());
        document.getElementById('col-load-btn')?.addEventListener('click', () => this.loadTemplate());
        document.getElementById('col-save-btn')?.addEventListener('click', () => this.saveTemplate());

        // Add buttons
        document.getElementById('col-add-dialogue-btn')?.addEventListener('click', () => this.addDialogue());
        document.getElementById('col-add-consequence-btn')?.addEventListener('click', () => this.addConsequence());

        // Form changes
        const form = document.getElementById('collection-form');
        form?.addEventListener('input', () => {
            this.isDirty = true;
        });
    }

    newTemplate() {
        if (this.isDirty && !confirm('Unsaved changes will be lost. Continue?')) {
            return;
        }

        this.currentTemplate = {
            id: 'new_collection',
            name: 'New Collection Template',
            description: '',
            type: 'recurring',
            day: 3,
            amountRequired: 500,
            gracePeriod: 1,
            recurrenceInterval: 7,
            collectorName: 'Mr. Black',
            collectorImage: 'collector_default',
            threatLevel: 'medium',
            personality: 'professional',
            dialogues: [],
            consequences: [],
            allowPartialPayment: false,
            minimumPaymentPercentage: 50,
            negotiable: false,
            successEvent: '',
            failureEvent: '',
            gameOverThreshold: 3
        };

        this.populateForm();
        this.isDirty = false;

        console.log('[CollectionEditor] New template created');
    }

    async loadTemplate() {
        if (this.isDirty && !confirm('Unsaved changes will be lost. Continue?')) {
            return;
        }

        // Get available templates
        const templates = await window.DEADDAY.templateRegistry.listTemplates('collection');

        if (templates.length === 0) {
            alert('No collection templates found');
            return;
        }

        // Show selection dialog
        const templateId = prompt('Enter template ID:\n' + templates.map(t => `- ${t}`).join('\n'));

        if (templateId) {
            const template = await window.DEADDAY.templateRegistry.getTemplate('collection', templateId);
            if (template) {
                this.currentTemplate = template;
                this.populateForm();
                this.isDirty = false;
                console.log('[CollectionEditor] Template loaded:', templateId);
            } else {
                alert('Template not found');
            }
        }
    }

    populateForm() {
        if (!this.currentTemplate) return;

        // Basic info
        document.getElementById('col-id').value = this.currentTemplate.id || '';
        document.getElementById('col-name').value = this.currentTemplate.name || '';
        document.getElementById('col-description').value = this.currentTemplate.description || '';

        // Collection settings
        document.getElementById('col-type').value = this.currentTemplate.type || 'recurring';
        document.getElementById('col-day').value = this.currentTemplate.day || 3;
        document.getElementById('col-amount').value = this.currentTemplate.amountRequired || 500;
        document.getElementById('col-grace').value = this.currentTemplate.gracePeriod || 1;
        document.getElementById('col-interval').value = this.currentTemplate.recurrenceInterval || 7;

        // Collector profile
        document.getElementById('col-collector-name').value = this.currentTemplate.collectorName || 'Mr. Black';
        document.getElementById('col-collector-image').value = this.currentTemplate.collectorImage || 'collector_default';
        document.getElementById('col-threat-level').value = this.currentTemplate.threatLevel || 'medium';
        document.getElementById('col-personality').value = this.currentTemplate.personality || 'professional';

        // Payment options
        document.getElementById('col-partial-payment').checked = this.currentTemplate.allowPartialPayment || false;
        document.getElementById('col-min-payment').value = this.currentTemplate.minimumPaymentPercentage || 50;
        document.getElementById('col-negotiable').checked = this.currentTemplate.negotiable || false;

        // Special conditions
        document.getElementById('col-success-event').value = this.currentTemplate.successEvent || '';
        document.getElementById('col-failure-event').value = this.currentTemplate.failureEvent || '';
        document.getElementById('col-game-over').value = this.currentTemplate.gameOverThreshold || 3;

        // Lists
        this.renderDialoguesList();
        this.renderConsequencesList();
    }

    renderDialoguesList() {
        const container = document.getElementById('col-dialogues-list');
        container.innerHTML = '';

        if (!this.currentTemplate.dialogues || this.currentTemplate.dialogues.length === 0) {
            container.innerHTML = '<p style="color: #666; font-style: italic;">No dialogues defined</p>';
            return;
        }

        this.currentTemplate.dialogues.forEach((dialogue, index) => {
            const item = document.createElement('div');
            item.className = 'list-item';
            item.innerHTML = `
                <div class="list-item-header">
                    <span class="list-item-title">${dialogue.trigger || 'Dialogue ' + (index + 1)}</span>
                    <div class="list-item-actions">
                        <button class="btn btn-secondary" onclick="window.collectionEditor.editDialogue(${index})">Edit</button>
                        <button class="btn btn-danger" onclick="window.collectionEditor.removeDialogue(${index})">Delete</button>
                    </div>
                </div>
                <div class="list-item-content">
                    ${dialogue.text?.substring(0, 100) || 'No text'}${dialogue.text?.length > 100 ? '...' : ''}
                </div>
            `;
            container.appendChild(item);
        });
    }

    renderConsequencesList() {
        const container = document.getElementById('col-consequences-list');
        container.innerHTML = '';

        if (!this.currentTemplate.consequences || this.currentTemplate.consequences.length === 0) {
            container.innerHTML = '<p style="color: #666; font-style: italic;">No consequences defined</p>';
            return;
        }

        this.currentTemplate.consequences.forEach((consequence, index) => {
            const item = document.createElement('div');
            item.className = 'list-item';
            item.innerHTML = `
                <div class="list-item-header">
                    <span class="list-item-title">Day ${consequence.day || '?'} - ${consequence.type || 'Unknown'}</span>
                    <div class="list-item-actions">
                        <button class="btn btn-secondary" onclick="window.collectionEditor.editConsequence(${index})">Edit</button>
                        <button class="btn btn-danger" onclick="window.collectionEditor.removeConsequence(${index})">Delete</button>
                    </div>
                </div>
                <div class="list-item-content">
                    ${consequence.description || 'No description'}
                </div>
            `;
            container.appendChild(item);
        });
    }

    addDialogue() {
        const dialogue = {
            id: `dialogue_${Date.now()}`,
            trigger: 'arrival',
            text: 'Time to pay up.',
            speaker: this.currentTemplate.collectorName || 'Collector'
        };

        if (!this.currentTemplate.dialogues) {
            this.currentTemplate.dialogues = [];
        }

        this.currentTemplate.dialogues.push(dialogue);
        this.renderDialoguesList();
        this.isDirty = true;
    }

    addConsequence() {
        const consequence = {
            id: `consequence_${Date.now()}`,
            day: 1,
            type: 'warning',
            description: 'First warning',
            effects: []
        };

        if (!this.currentTemplate.consequences) {
            this.currentTemplate.consequences = [];
        }

        this.currentTemplate.consequences.push(consequence);
        this.renderConsequencesList();
        this.isDirty = true;
    }

    editDialogue(index) {
        const dialogue = this.currentTemplate.dialogues[index];
        const newText = prompt('Edit dialogue text:', dialogue.text);
        if (newText !== null) {
            dialogue.text = newText;
            this.renderDialoguesList();
            this.isDirty = true;
        }
    }

    editConsequence(index) {
        const consequence = this.currentTemplate.consequences[index];
        const newDesc = prompt('Edit consequence description:', consequence.description);
        if (newDesc !== null) {
            consequence.description = newDesc;
            this.renderConsequencesList();
            this.isDirty = true;
        }
    }

    removeDialogue(index) {
        if (confirm('Delete this dialogue?')) {
            this.currentTemplate.dialogues.splice(index, 1);
            this.renderDialoguesList();
            this.isDirty = true;
        }
    }

    removeConsequence(index) {
        if (confirm('Delete this consequence?')) {
            this.currentTemplate.consequences.splice(index, 1);
            this.renderConsequencesList();
            this.isDirty = true;
        }
    }

    async saveTemplate() {
        // Gather form data
        const formData = new FormData(document.getElementById('collection-form'));
        const template = {};

        for (let [key, value] of formData.entries()) {
            // Convert numbers
            if (['day', 'amountRequired', 'gracePeriod', 'recurrenceInterval',
                 'minimumPaymentPercentage', 'gameOverThreshold'].includes(key)) {
                template[key] = parseInt(value);
            }
            // Convert booleans
            else if (['allowPartialPayment', 'negotiable'].includes(key)) {
                template[key] = value === 'on';
            }
            else {
                template[key] = value;
            }
        }

        // Add checkboxes that might not be in formData
        template.allowPartialPayment = document.getElementById('col-partial-payment').checked;
        template.negotiable = document.getElementById('col-negotiable').checked;

        // Add lists
        template.dialogues = this.currentTemplate.dialogues || [];
        template.consequences = this.currentTemplate.consequences || [];

        // Save to registry
        try {
            await window.DEADDAY.templateRegistry.saveTemplate('collection', template.id, template);
            this.isDirty = false;
            alert('Template saved successfully!');
            console.log('[CollectionEditor] Template saved:', template.id);
        } catch (error) {
            console.error('[CollectionEditor] Save failed:', error);
            alert('Failed to save template: ' + error.message);
        }
    }
}

// Make globally accessible for inline event handlers
window.collectionEditor = new CollectionEditor();
