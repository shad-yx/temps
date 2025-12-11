/**
 * UnifiedBuilder.js
 * After Effects-style unified timeline builder
 * Drag-drop templates, edit inline, map entire game flow
 */

export class UnifiedBuilder {
  constructor() {
    this.sequence = [];
    this.currentIteration = null;
    this.selectedTemplateIndex = null;
    this.draggedPaletteType = null;
  }

  init() {
    this.container = document.getElementById('unified-builder');
    if (!this.container) {
      console.error('[UnifiedBuilder] Container not found');
      return;
    }

    this.render();
    this.setupEventHandlers();
    this.loadDefaultIteration();
  }

  async loadDefaultIteration() {
    try {
      const iteration = await window.DEADDAY.persistence.loadIteration('Default Game');
      this.currentIteration = iteration;
      this.sequence = iteration.sequence || [];
      this.render();
    } catch (error) {
      console.log('[UnifiedBuilder] No default iteration, creating new');
      this.currentIteration = {
        name: 'New Game',
        sequence: [],
        globalState: { toxicityLevel: 0, cash: 0, day: 1 }
      };
      this.sequence = [];
      this.render();
    }
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="builder-container">
        <!-- Left: Template Palette -->
        <div class="builder-palette">
          <h3>📦 Template Palette</h3>
          <div class="palette-items">
            <div class="palette-item" draggable="true" data-type="cinematic">
              <div class="palette-icon">🎬</div>
              <div class="palette-label">Cinematic</div>
              <div class="palette-desc">Visual novel scene</div>
            </div>
            <div class="palette-item" draggable="true" data-type="gameplay">
              <div class="palette-icon">🎮</div>
              <div class="palette-label">Gameplay</div>
              <div class="palette-desc">Farming cycle</div>
            </div>
            <div class="palette-item" draggable="true" data-type="collection">
              <div class="palette-icon">💰</div>
              <div class="palette-label">Collection</div>
              <div class="palette-desc">Selling/Payment</div>
            </div>
          </div>
        </div>

        <!-- Center: Timeline Flow -->
        <div class="builder-timeline">
          <div class="timeline-header">
            <h2>🎞️ Game Flow Timeline</h2>
            <div class="timeline-controls">
              <button id="save-iteration-btn" class="btn btn-primary">💾 Save</button>
              <button id="play-iteration-btn" class="btn btn-success">▶ Play</button>
            </div>
          </div>

          <div class="timeline-sequence" id="timeline-sequence">
            ${this.renderSequence()}
          </div>

          <div class="drop-zone" id="drop-zone">
            <div class="drop-zone-text">👆 Drag templates here to build your game flow</div>
          </div>
        </div>

        <!-- Right: Template Editor -->
        <div class="builder-editor" id="builder-editor">
          ${this.renderEditor()}
        </div>
      </div>
    `;

    this.setupDragDrop();
  }

  renderSequence() {
    if (this.sequence.length === 0) {
      return '<div class="sequence-empty">No templates yet. Drag from palette to start!</div>';
    }

    return this.sequence.map((item, index) => {
      const selected = index === this.selectedTemplateIndex ? 'selected' : '';
      const icon = item.type === 'cinematic' ? '🎬' :
                   item.type === 'gameplay' ? '🎮' : '💰';

      return `
        <div class="sequence-block ${selected}" data-index="${index}">
          <div class="sequence-number">${index + 1}</div>
          <div class="sequence-icon">${icon}</div>
          <div class="sequence-info">
            <div class="sequence-type">${item.type}</div>
            <div class="sequence-name">${item.name || item.templateId}</div>
          </div>
          <div class="sequence-actions">
            <button class="btn-small btn-edit" data-index="${index}">✏️</button>
            <button class="btn-small btn-delete" data-index="${index}">🗑️</button>
          </div>
        </div>
      `;
    }).join('');
  }

  renderEditor() {
    if (this.selectedTemplateIndex === null) {
      return `
        <div class="editor-empty">
          <div class="editor-empty-icon">👈</div>
          <h3>Select a template to edit</h3>
          <p>Click on any template block in the timeline to edit its properties</p>
        </div>
      `;
    }

    const template = this.sequence[this.selectedTemplateIndex];

    switch (template.type) {
      case 'cinematic':
        return this.renderCinematicEditor(template);
      case 'gameplay':
        return this.renderGameplayEditor(template);
      case 'collection':
        return this.renderCollectionEditor(template);
      default:
        return '<div>Unknown template type</div>';
    }
  }

  renderCinematicEditor(template) {
    return `
      <div class="editor-panel">
        <h3>🎬 Cinematic Editor</h3>

        <div class="form-group" style="margin-bottom: 20px;">
          <button class="btn btn-success btn-block" id="open-visual-editor-btn" style="font-size: 16px; padding: 12px;">
            🎨 Open Visual Editor
          </button>
          <small style="color: #888; display: block; margin-top: 8px; text-align: center;">
            Drag &amp; drop assets like After Effects
          </small>
        </div>

        <hr style="border-color: #333; margin: 20px 0;">
        <p style="text-align: center; color: #666; font-size: 13px;">— OR use quick form below —</p>
        <hr style="border-color: #333; margin: 20px 0;">

        <div class="form-group">
          <label>Name</label>
          <input type="text" class="form-control" id="cinematic-name"
                 value="${template.name || 'Untitled Cinematic'}" />
        </div>

        <div class="form-group">
          <label>Background Image</label>
          <select class="form-control" id="cinematic-bg">
            <option value="assets/backgrounds/farm_normal.png">Farm - Normal</option>
            <option value="assets/backgrounds/farm_toxic1.png">Farm - Toxic Level 1</option>
            <option value="assets/backgrounds/farm_toxic2.png">Farm - Toxic Level 2</option>
            <option value="assets/backgrounds/farm_toxic3.png">Farm - Toxic Level 3</option>
            <option value="assets/backgrounds/office.png">Office Interior</option>
            <option value="assets/backgrounds/night.png">Night Scene</option>
          </select>
        </div>

        <div class="form-group">
          <label>Character</label>
          <select class="form-control" id="cinematic-character">
            <option value="">None</option>
            <option value="assets/characters/protagonist.png">Protagonist</option>
            <option value="assets/characters/collector.png">Debt Collector</option>
            <option value="assets/characters/stranger.png">Stranger</option>
          </select>
        </div>

        <div class="form-group">
          <label>Character Position</label>
          <select class="form-control" id="cinematic-char-pos">
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>

        <div class="form-group">
          <label>Dialogue Text</label>
          <textarea class="form-control" id="cinematic-dialogue" rows="4"
                    placeholder="Enter dialogue text...">${template.dialogue || ''}</textarea>
        </div>

        <div class="form-group">
          <label>Speaker Name</label>
          <input type="text" class="form-control" id="cinematic-speaker"
                 value="${template.speaker || ''}" placeholder="Character name" />
        </div>

        <div class="form-group">
          <label>Duration (seconds)</label>
          <input type="number" class="form-control" id="cinematic-duration"
                 value="${(template.duration || 5000) / 1000}" min="1" max="60" />
        </div>

        <div class="form-group">
          <label>Background Music</label>
          <select class="form-control" id="cinematic-music">
            <option value="">None</option>
            <option value="assets/audio/intro_theme.mp3">Intro Theme</option>
            <option value="assets/audio/gameplay_ambient.mp3">Gameplay Ambient</option>
            <option value="assets/audio/tension.mp3">Tension</option>
            <option value="assets/audio/ending.mp3">Ending Theme</option>
          </select>
        </div>

        <button class="btn btn-primary btn-block" id="save-template-btn">💾 Save Changes</button>
      </div>
    `;
  }

  renderGameplayEditor(template) {
    return `
      <div class="editor-panel">
        <h3>🎮 Gameplay Editor</h3>

        <div class="form-group">
          <label>Name</label>
          <input type="text" class="form-control" id="gameplay-name"
                 value="${template.name || 'Farm Cycle'}" />
        </div>

        <div class="form-group">
          <label>Cycle Duration (seconds)</label>
          <input type="number" class="form-control" id="gameplay-duration"
                 value="${(template.duration || 60000) / 1000}" min="10" max="300" />
        </div>

        <div class="form-group">
          <label>Starting Background</label>
          <select class="form-control" id="gameplay-bg-start">
            <option value="assets/backgrounds/farm_normal.png">Farm - Normal</option>
            <option value="assets/backgrounds/farm_toxic1.png">Farm - Toxic Level 1</option>
            <option value="assets/backgrounds/farm_toxic2.png">Farm - Toxic Level 2</option>
            <option value="assets/backgrounds/farm_toxic3.png">Farm - Toxic Level 3</option>
          </select>
        </div>

        <div class="form-group">
          <label>Toxicity Threshold for BG Change</label>
          <input type="number" class="form-control" id="gameplay-toxicity-threshold"
                 value="${template.toxicityThreshold || 30}" min="1" max="100" />
          <small>When toxicity exceeds this, background gets worse</small>
        </div>

        <div class="form-group">
          <label>Next Background (when threshold reached)</label>
          <select class="form-control" id="gameplay-bg-next">
            <option value="assets/backgrounds/farm_toxic1.png">Farm - Toxic Level 1</option>
            <option value="assets/backgrounds/farm_toxic2.png">Farm - Toxic Level 2</option>
            <option value="assets/backgrounds/farm_toxic3.png">Farm - Toxic Level 3</option>
          </select>
        </div>

        <div class="form-group">
          <label>Grid Size</label>
          <div style="display: flex; gap: 10px;">
            <input type="number" class="form-control" id="gameplay-rows"
                   value="${template.gridRows || 5}" min="3" max="8" placeholder="Rows" />
            <input type="number" class="form-control" id="gameplay-cols"
                   value="${template.gridCols || 5}" min="3" max="8" placeholder="Cols" />
          </div>
        </div>

        <div class="form-group">
          <label>Starting Cash</label>
          <input type="number" class="form-control" id="gameplay-cash"
                 value="${template.startingCash || 0}" min="0" />
        </div>

        <button class="btn btn-primary btn-block" id="save-template-btn">💾 Save Changes</button>
      </div>
    `;
  }

  renderCollectionEditor(template) {
    return `
      <div class="editor-panel">
        <h3>💰 Collection Editor</h3>

        <div class="form-group">
          <label>Name</label>
          <input type="text" class="form-control" id="collection-name"
                 value="${template.name || 'Payment Scene'}" />
        </div>

        <div class="form-group">
          <label>Background</label>
          <select class="form-control" id="collection-bg">
            <option value="assets/backgrounds/office.png">Office Interior</option>
            <option value="assets/backgrounds/farm_normal.png">Farm</option>
            <option value="assets/backgrounds/night.png">Night Scene</option>
          </select>
        </div>

        <div class="form-group">
          <label>Collector Character</label>
          <select class="form-control" id="collection-character">
            <option value="assets/characters/collector.png">Debt Collector</option>
            <option value="assets/characters/stranger.png">Stranger</option>
          </select>
        </div>

        <div class="form-group">
          <label>Debt Amount Mode</label>
          <select class="form-control" id="collection-mode">
            <option value="fixed">Fixed Amount</option>
            <option value="multiply">Multiply Previous</option>
            <option value="random">Random Range</option>
          </select>
        </div>

        <div class="form-group">
          <label>Debt Amount</label>
          <input type="number" class="form-control" id="collection-debt"
                 value="${template.debtAmount || 100}" min="1" />
        </div>

        <div class="form-group">
          <label>Collector Dialogue</label>
          <textarea class="form-control" id="collection-dialogue" rows="3"
                    placeholder="What does the collector say?">${template.dialogue || 'Time to pay up.'}</textarea>
        </div>

        <button class="btn btn-primary btn-block" id="save-template-btn">💾 Save Changes</button>
      </div>
    `;
  }

  setupEventHandlers() {
    // Save iteration
    document.getElementById('save-iteration-btn')?.addEventListener('click', () => {
      this.saveIteration();
    });

    // Play iteration
    document.getElementById('play-iteration-btn')?.addEventListener('click', () => {
      this.playIteration();
    });

    // Sequence block clicks
    this.container.addEventListener('click', (e) => {
      // Edit button
      if (e.target.classList.contains('btn-edit')) {
        const index = parseInt(e.target.dataset.index);
        this.selectTemplate(index);
      }

      // Delete button
      if (e.target.classList.contains('btn-delete')) {
        const index = parseInt(e.target.dataset.index);
        this.deleteTemplate(index);
      }

      // Block selection
      if (e.target.closest('.sequence-block')) {
        const block = e.target.closest('.sequence-block');
        const index = parseInt(block.dataset.index);
        this.selectTemplate(index);
      }

      // Save template
      if (e.target.id === 'save-template-btn') {
        this.saveCurrentTemplate();
      }

      // Open visual editor
      if (e.target.id === 'open-visual-editor-btn') {
        this.openVisualEditor();
      }
    });
  }

  async openVisualEditor() {
    if (this.selectedTemplateIndex === null) return;

    const template = this.sequence[this.selectedTemplateIndex];

    if (template.type !== 'cinematic') {
      alert('Visual editor only available for cinematic templates');
      return;
    }

    // Import Visual Cinematic Editor
    const { VisualCinematicEditor } = await import('./VisualCinematicEditor.js');

    // Create full-screen overlay
    const overlay = document.createElement('div');
    overlay.id = 'visual-editor-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: #0a0a0a;
      z-index: 10000;
    `;

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕ Close Visual Editor';
    closeBtn.style.cssText = `
      position: absolute;
      top: 10px;
      right: 20px;
      z-index: 10001;
      background: #f44336;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    `;

    closeBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
      this.render(); // Refresh builder to show any changes
    });

    overlay.appendChild(closeBtn);

    // Create editor container
    const editorContainer = document.createElement('div');
    editorContainer.id = 'visual-editor-container';
    editorContainer.style.cssText = 'width: 100%; height: 100%;';
    overlay.appendChild(editorContainer);

    document.body.appendChild(overlay);

    // Initialize visual editor
    const visualEditor = new VisualCinematicEditor(
      editorContainer,
      template,
      (updatedTemplate) => {
        // Save callback
        console.log('Template updated:', updatedTemplate);
        this.saveToLocalStorage();
      }
    );

    visualEditor.render();
  }

  setupDragDrop() {
    // Palette items draggable
    const paletteItems = document.querySelectorAll('.palette-item');
    paletteItems.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        this.draggedPaletteType = e.target.dataset.type;
        e.dataTransfer.effectAllowed = 'copy';
      });
    });

    // Drop zone
    const dropZone = document.getElementById('drop-zone');
    const timelineSequence = document.getElementById('timeline-sequence');

    [dropZone, timelineSequence].forEach(zone => {
      zone?.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        zone.classList.add('drag-over');
      });

      zone?.addEventListener('dragleave', () => {
        zone.classList.remove('drag-over');
      });

      zone?.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');

        if (this.draggedPaletteType) {
          this.addTemplate(this.draggedPaletteType);
          this.draggedPaletteType = null;
        }
      });
    });
  }

  async addTemplate(type) {
    const template = {
      type: type,
      templateId: `${type}_${Date.now()}`,
      name: `New ${type}`,
      duration: type === 'gameplay' ? 60000 : 5000,
    };

    // Add type-specific defaults
    if (type === 'cinematic') {
      template.background = 'assets/backgrounds/farm_normal.png';
      template.dialogue = '';
      template.speaker = '';
    } else if (type === 'gameplay') {
      template.gridRows = 5;
      template.gridCols = 5;
      template.startingCash = 0;
      template.toxicityThreshold = 30;
    } else if (type === 'collection') {
      template.debtAmount = 100;
      template.debtMode = 'fixed';
      template.dialogue = 'Time to pay up.';
    }

    this.sequence.push(template);
    this.render();

    // Auto-select the new template
    this.selectTemplate(this.sequence.length - 1);
  }

  selectTemplate(index) {
    this.selectedTemplateIndex = index;
    this.render();
  }

  deleteTemplate(index) {
    if (confirm('Delete this template from the sequence?')) {
      this.sequence.splice(index, 1);
      if (this.selectedTemplateIndex === index) {
        this.selectedTemplateIndex = null;
      }
      this.render();
    }
  }

  saveCurrentTemplate() {
    if (this.selectedTemplateIndex === null) return;

    const template = this.sequence[this.selectedTemplateIndex];

    if (template.type === 'cinematic') {
      template.name = document.getElementById('cinematic-name').value;
      template.background = document.getElementById('cinematic-bg').value;
      template.character = document.getElementById('cinematic-character').value;
      template.characterPosition = document.getElementById('cinematic-char-pos').value;
      template.dialogue = document.getElementById('cinematic-dialogue').value;
      template.speaker = document.getElementById('cinematic-speaker').value;
      template.duration = parseInt(document.getElementById('cinematic-duration').value) * 1000;
      template.music = document.getElementById('cinematic-music').value;
    } else if (template.type === 'gameplay') {
      template.name = document.getElementById('gameplay-name').value;
      template.duration = parseInt(document.getElementById('gameplay-duration').value) * 1000;
      template.backgroundStart = document.getElementById('gameplay-bg-start').value;
      template.toxicityThreshold = parseInt(document.getElementById('gameplay-toxicity-threshold').value);
      template.backgroundNext = document.getElementById('gameplay-bg-next').value;
      template.gridRows = parseInt(document.getElementById('gameplay-rows').value);
      template.gridCols = parseInt(document.getElementById('gameplay-cols').value);
      template.startingCash = parseInt(document.getElementById('gameplay-cash').value);
    } else if (template.type === 'collection') {
      template.name = document.getElementById('collection-name').value;
      template.background = document.getElementById('collection-bg').value;
      template.character = document.getElementById('collection-character').value;
      template.debtMode = document.getElementById('collection-mode').value;
      template.debtAmount = parseInt(document.getElementById('collection-debt').value);
      template.dialogue = document.getElementById('collection-dialogue').value;
    }

    console.log('[UnifiedBuilder] Template saved:', template);
    alert('Template saved! ✓');
    this.render();
  }

  async saveIteration() {
    if (!this.currentIteration) {
      this.currentIteration = { name: 'New Game' };
    }

    this.currentIteration.sequence = this.sequence;
    this.currentIteration.lastModified = new Date().toISOString();

    try {
      await window.DEADDAY.persistence.saveIteration(this.currentIteration);
      console.log('[UnifiedBuilder] Iteration saved:', this.currentIteration.name);
      alert('Game saved! ✓');
    } catch (error) {
      console.error('[UnifiedBuilder] Save failed:', error);
      alert('Save failed! Check console.');
    }
  }

  async playIteration() {
    if (this.sequence.length === 0) {
      alert('Add templates to the timeline first!');
      return;
    }

    await this.saveIteration();

    // Hide editor, show game
    window.EditorUI.hide();

    // Start playing from first template
    const firstTemplate = this.sequence[0];
    this.startTemplate(firstTemplate, 0);
  }

  startTemplate(template, index) {
    console.log('[UnifiedBuilder] Starting template:', template.type, index);

    // Store sequence in global state for next template navigation
    window.DEADDAY.currentSequence = this.sequence;
    window.DEADDAY.currentSequenceIndex = index;

    if (template.type === 'cinematic') {
      this.startCinematic(template);
    } else if (template.type === 'gameplay') {
      this.startGameplay(template);
    } else if (template.type === 'collection') {
      this.startCollection(template);
    }
  }

  startCinematic(template) {
    // Use DialogueScene for simple cinematics
    window.DEADDAY.game.scene.start('DialogueScene', {
      background: template.background,
      character: template.character,
      dialogue: template.dialogue,
      speaker: template.speaker,
      duration: template.duration,
      onComplete: () => this.nextTemplate()
    });
  }

  startGameplay(template) {
    // Start GameScene
    window.DEADDAY.game.scene.start('GameScene', {
      duration: template.duration,
      gridRows: template.gridRows,
      gridCols: template.gridCols,
      backgroundStart: template.backgroundStart,
      toxicityThreshold: template.toxicityThreshold,
      backgroundNext: template.backgroundNext,
      onComplete: () => this.nextTemplate()
    });
  }

  startCollection(template) {
    // Start PaymentScene
    window.DEADDAY.game.scene.start('PaymentScene', {
      background: template.background,
      character: template.character,
      debtAmount: template.debtAmount,
      debtMode: template.debtMode,
      dialogue: template.dialogue,
      onComplete: () => this.nextTemplate()
    });
  }

  nextTemplate() {
    const nextIndex = (window.DEADDAY.currentSequenceIndex || 0) + 1;

    if (nextIndex < window.DEADDAY.currentSequence.length) {
      const nextTemplate = window.DEADDAY.currentSequence[nextIndex];
      this.startTemplate(nextTemplate, nextIndex);
    } else {
      // End of sequence
      console.log('[UnifiedBuilder] Sequence complete!');
      window.DEADDAY.game.scene.start('MenuScene');
    }
  }
}
