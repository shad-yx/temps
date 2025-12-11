/**
 * Sequencer.js
 * Drag-and-drop template sequencer for building game flow
 * Like a flowchart/timeline of templates
 */

export class Sequencer {
  constructor() {
    this.currentIteration = null;
    this.sequence = [];
  }

  /**
   * Initialize sequencer UI
   */
  init() {
    this.container = document.getElementById('sequencer-panel');
    if (!this.container) {
      console.error('[Sequencer] Container not found');
      return;
    }

    this.render();
    this.setupDragDrop();
  }

  /**
   * Load iteration into sequencer
   */
  async loadIteration(iterationName) {
    try {
      const iteration = await window.DEADDAY.persistence.loadIteration(iterationName);
      this.currentIteration = iteration;
      this.sequence = iteration.sequence || [];
      this.render();
      console.log(`[Sequencer] Loaded iteration: ${iterationName}`);
    } catch (error) {
      console.error('[Sequencer] Failed to load iteration:', error);
    }
  }

  /**
   * Render sequencer UI
   */
  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="sequencer-header">
        <h2>Game Sequence</h2>
        <div class="sequencer-actions">
          <button id="save-iteration-btn" class="btn btn-primary">💾 Save</button>
          <button id="play-iteration-btn" class="btn btn-success">▶ Play</button>
          <button id="new-iteration-btn" class="btn btn-secondary">+ New</button>
        </div>
      </div>

      <div class="sequencer-templates">
        <h3>Template Palette</h3>
        <div class="template-palette">
          <div class="template-item" draggable="true" data-type="cinematic">
            🎬 Cinematic
          </div>
          <div class="template-item" draggable="true" data-type="gameplay">
            🎮 Gameplay
          </div>
          <div class="template-item" draggable="true" data-type="collection">
            💰 Collection
          </div>
        </div>
      </div>

      <div class="sequencer-flow">
        <h3>Sequence Flow</h3>
        <div id="sequence-list" class="sequence-list">
          ${this.renderSequence()}
        </div>
        <div class="drop-zone" id="drop-zone">
          Drop templates here to add to sequence
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  /**
   * Render sequence items
   */
  renderSequence() {
    if (this.sequence.length === 0) {
      return '<div class="empty-message">No templates yet. Drag from palette to start.</div>';
    }

    return this.sequence.map((item, index) => `
      <div class="sequence-item" data-index="${index}">
        <div class="sequence-item-header">
          <span class="sequence-number">${index + 1}</span>
          <span class="sequence-type">${this.getIcon(item.type)} ${item.type}</span>
          <div class="sequence-actions">
            <button class="btn-icon edit-template" data-index="${index}">✏️</button>
            <button class="btn-icon delete-template" data-index="${index}">🗑️</button>
          </div>
        </div>
        <div class="sequence-item-info">
          ID: ${item.templateId || 'New Template'}
        </div>
      </div>
    `).join('');
  }

  /**
   * Get icon for template type
   */
  getIcon(type) {
    const icons = {
      cinematic: '🎬',
      gameplay: '🎮',
      collection: '💰'
    };
    return icons[type] || '📄';
  }

  /**
   * Setup drag and drop
   */
  setupDragDrop() {
    const palette = this.container.querySelectorAll('.template-item');
    const dropZone = this.container.querySelector('#drop-zone');
    const sequenceList = this.container.querySelector('#sequence-list');

    // Make palette items draggable
    palette.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('templateType', e.target.dataset.type);
        e.dataTransfer.effectAllowed = 'copy';
      });
    });

    // Drop zone
    [dropZone, sequenceList].forEach(zone => {
      if (!zone) return;

      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        zone.classList.add('drag-over');
      });

      zone.addEventListener('dragleave', () => {
        zone.classList.remove('drag-over');
      });

      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');

        const type = e.dataTransfer.getData('templateType');
        if (type) {
          this.addTemplate(type);
        }
      });
    });
  }

  /**
   * Add template to sequence
   */
  async addTemplate(type) {
    // Create new template
    const template = window.DEADDAY.templateRegistry.createTemplate(type, `New ${type}`);

    // Save template
    await window.DEADDAY.templateRegistry.saveTemplate(template);

    // Add to sequence
    this.sequence.push({
      type: type,
      templateId: template.id
    });

    this.render();
    console.log(`[Sequencer] Added ${type} template:`, template.id);
  }

  /**
   * Delete template from sequence
   */
  deleteTemplate(index) {
    if (confirm(`Delete template ${index + 1}?`)) {
      this.sequence.splice(index, 1);
      this.render();
    }
  }

  /**
   * Edit template - open appropriate editor
   */
  editTemplate(index) {
    const item = this.sequence[index];
    if (!item) return;

    console.log(`[Sequencer] Editing template:`, item);

    // Switch to appropriate editor
    switch (item.type) {
      case 'cinematic':
        window.EditorUI.switchToTimelineEditor(item.templateId);
        break;
      case 'gameplay':
        window.EditorUI.switchToGameplayEditor(item.templateId);
        break;
      case 'collection':
        window.EditorUI.switchToCollectionEditor(item.templateId);
        break;
    }
  }

  /**
   * Save iteration
   */
  async saveIteration() {
    const name = this.currentIteration?.name || prompt('Enter iteration name:');
    if (!name) return;

    const iteration = {
      name: name,
      version: '1.0.0',
      sequence: this.sequence,
      globalState: this.currentIteration?.globalState || {
        toxicityLevel: 0,
        cash: 0,
        day: 1,
        variables: {}
      }
    };

    try {
      await window.DEADDAY.persistence.saveIteration(iteration);
      this.currentIteration = iteration;
      alert(`Saved: ${name}`);
      console.log(`[Sequencer] Saved iteration: ${name}`);
    } catch (error) {
      console.error('[Sequencer] Save failed:', error);
      alert('Failed to save iteration');
    }
  }

  /**
   * Play iteration (test mode)
   */
  async playIteration() {
    if (this.sequence.length === 0) {
      alert('Add templates to sequence first!');
      return;
    }

    if (!this.currentIteration?.name) {
      alert('Save iteration first!');
      return;
    }

    // Save first
    await this.saveIteration();

    // Switch to play mode
    window.DEADDAY.modeManager.switchToPlay(this.currentIteration.name);

    // Hide editor, start game
    window.EditorUI.hide();

    // Start first template in sequence
    const firstTemplate = this.sequence[0];
    this.startTemplate(firstTemplate, 0);
  }

  /**
   * Start template playback
   */
  startTemplate(templateItem, index) {
    const sceneKey = this.getSceneKey(templateItem.type);

    window.DEADDAY.game.scene.start(sceneKey, {
      templateId: templateItem.templateId,
      sequenceIndex: index,
      totalSequence: this.sequence
    });
  }

  /**
   * Get Phaser scene key for template type
   */
  getSceneKey(type) {
    const sceneMap = {
      cinematic: 'CinematicPlayer',
      gameplay: 'GameplayRunner',
      collection: 'CollectionRunner'
    };
    return sceneMap[type] || 'GameScene';
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Save button
    const saveBtn = document.getElementById('save-iteration-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveIteration());
    }

    // Play button
    const playBtn = document.getElementById('play-iteration-btn');
    if (playBtn) {
      playBtn.addEventListener('click', () => this.playIteration());
    }

    // New iteration button
    const newBtn = document.getElementById('new-iteration-btn');
    if (newBtn) {
      newBtn.addEventListener('click', () => {
        const name = prompt('New iteration name:');
        if (name) {
          this.currentIteration = { name, sequence: [] };
          this.sequence = [];
          this.render();
        }
      });
    }

    // Edit buttons
    document.querySelectorAll('.edit-template').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.editTemplate(index);
      });
    });

    // Delete buttons
    document.querySelectorAll('.delete-template').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.deleteTemplate(index);
      });
    });
  }

  /**
   * Move template up/down in sequence
   */
  moveTemplate(index, direction) {
    if (direction === 'up' && index > 0) {
      [this.sequence[index], this.sequence[index - 1]] =
        [this.sequence[index - 1], this.sequence[index]];
      this.render();
    } else if (direction === 'down' && index < this.sequence.length - 1) {
      [this.sequence[index], this.sequence[index + 1]] =
        [this.sequence[index + 1], this.sequence[index]];
      this.render();
    }
  }
}
