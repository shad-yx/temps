/**
 * VisualCinematicEditor.js
 * Visual editor for building cinematic scenes with drag-and-drop assets
 * Like After Effects / Canva for game scenes
 */

export class VisualCinematicEditor {
    constructor(container, template, onSave) {
        this.container = container;
        this.template = template;
        this.onSave = onSave;

        // Initialize assets array if not exists
        if (!this.template.assets) {
            this.template.assets = [];
        }

        // Editor state
        this.selectedAsset = null;
        this.isDragging = false;
        this.isResizing = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.playheadTime = 0;
        this.isPlaying = false;
        this.zoom = 1.0;
        this.gridSnap = true;
        this.gridSize = 20;

        // Canvas dimensions (game resolution)
        this.canvasWidth = 1280;
        this.canvasHeight = 720;

        this.assetIdCounter = 1;
    }

    render() {
        this.container.innerHTML = `
            <div class="visual-editor">
                <!-- Header Toolbar -->
                <div class="editor-toolbar">
                    <div class="toolbar-section">
                        <button class="btn-icon" id="undo-btn" title="Undo">↶</button>
                        <button class="btn-icon" id="redo-btn" title="Redo">↷</button>
                    </div>

                    <div class="toolbar-section">
                        <label>Zoom:</label>
                        <select id="zoom-select">
                            <option value="0.25">25%</option>
                            <option value="0.5">50%</option>
                            <option value="0.75">75%</option>
                            <option value="1" selected>100%</option>
                            <option value="1.5">150%</option>
                            <option value="2">200%</option>
                        </select>
                    </div>

                    <div class="toolbar-section">
                        <label>
                            <input type="checkbox" id="grid-snap" ${this.gridSnap ? 'checked' : ''}>
                            Snap to Grid
                        </label>
                        <label>Grid Size:</label>
                        <input type="number" id="grid-size" value="${this.gridSize}" min="5" max="50" style="width: 60px;">
                    </div>

                    <div class="toolbar-section">
                        <button class="btn-primary" id="add-text-btn">+ Add Text</button>
                        <button class="btn-primary" id="add-shape-btn">+ Add Shape</button>
                    </div>

                    <div class="toolbar-section">
                        <button class="btn-success" id="preview-btn">▶ Preview</button>
                        <button class="btn-success" id="save-btn">💾 Save Scene</button>
                    </div>
                </div>

                <!-- Main Editor Area -->
                <div class="editor-main">
                    <!-- Asset Library (Left) -->
                    <div class="asset-library">
                        <div class="panel-header">Asset Library</div>
                        <div class="asset-tabs">
                            <button class="tab-btn active" data-tab="images">Images</button>
                            <button class="tab-btn" data-tab="audio">Audio</button>
                            <button class="tab-btn" data-tab="fonts">Fonts</button>
                        </div>
                        <div class="asset-list" id="asset-list">
                            <div class="asset-help">
                                <p>📁 Add assets to:</p>
                                <p><code>assets/images/</code></p>
                                <p><code>assets/audio/</code></p>
                                <p><code>assets/fonts/</code></p>
                                <p><br>Then refresh this editor.</p>
                            </div>
                        </div>
                        <button class="btn-secondary" id="refresh-assets-btn" style="width: 100%; margin-top: 10px;">
                            🔄 Refresh Assets
                        </button>
                    </div>

                    <!-- Viewport (Center) -->
                    <div class="viewport-container">
                        <div class="viewport-header">
                            <span>Cinematic Viewport (1280x720)</span>
                            <span class="viewport-info">Playhead: ${this.playheadTime}ms</span>
                        </div>
                        <div class="viewport-canvas-wrapper" id="viewport-wrapper">
                            <canvas id="viewport-canvas"
                                    width="${this.canvasWidth}"
                                    height="${this.canvasHeight}">
                            </canvas>
                            <div class="viewport-overlay" id="viewport-overlay">
                                <!-- Selection handles rendered here -->
                            </div>
                        </div>
                        <div class="viewport-help">
                            Drag assets from library onto canvas | Click to select | Drag to move | Delete key to remove
                        </div>
                    </div>

                    <!-- Properties Panel (Right) -->
                    <div class="properties-panel">
                        <div class="panel-header">Properties</div>
                        <div id="properties-content" class="properties-content">
                            <p style="color: #888; padding: 20px;">
                                Select an asset to edit properties
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Timeline (Bottom) -->
                <div class="timeline-container">
                    <div class="timeline-header">
                        <span>Timeline</span>
                        <div class="timeline-controls">
                            <button class="btn-icon" id="play-timeline-btn">▶</button>
                            <button class="btn-icon" id="stop-timeline-btn">■</button>
                            <label>Duration:</label>
                            <input type="number" id="total-duration" value="${this.template.duration || 5000}" min="1000" step="1000" style="width: 80px;">
                            <span>ms</span>
                        </div>
                    </div>
                    <div class="timeline-content" id="timeline-content">
                        <div class="timeline-ruler" id="timeline-ruler">
                            <!-- Time markers -->
                        </div>
                        <div class="timeline-playhead" id="timeline-playhead" style="left: 0px;"></div>
                        <div class="timeline-layers" id="timeline-layers">
                            <!-- Asset layers rendered here -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupCanvas();
        this.setupEventListeners();
        this.loadAssetLibrary('images');
        this.renderViewport();
        this.renderTimeline();
    }

    setupCanvas() {
        this.canvas = document.getElementById('viewport-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.overlay = document.getElementById('viewport-overlay');
    }

    setupEventListeners() {
        // Zoom
        document.getElementById('zoom-select').addEventListener('change', (e) => {
            this.zoom = parseFloat(e.target.value);
            this.renderViewport();
        });

        // Grid snap
        document.getElementById('grid-snap').addEventListener('change', (e) => {
            this.gridSnap = e.target.checked;
        });

        document.getElementById('grid-size').addEventListener('change', (e) => {
            this.gridSize = parseInt(e.target.value);
            this.renderViewport();
        });

        // Add text button
        document.getElementById('add-text-btn').addEventListener('click', () => {
            this.addTextAsset();
        });

        // Add shape button
        document.getElementById('add-shape-btn').addEventListener('click', () => {
            this.addShapeAsset();
        });

        // Save button
        document.getElementById('save-btn').addEventListener('click', () => {
            this.saveTemplate();
        });

        // Preview button
        document.getElementById('preview-btn').addEventListener('click', () => {
            this.previewScene();
        });

        // Timeline controls
        document.getElementById('play-timeline-btn').addEventListener('click', () => {
            this.playTimeline();
        });

        document.getElementById('stop-timeline-btn').addEventListener('click', () => {
            this.stopTimeline();
        });

        document.getElementById('total-duration').addEventListener('change', (e) => {
            this.template.duration = parseInt(e.target.value);
            this.renderTimeline();
        });

        // Asset tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.loadAssetLibrary(e.target.dataset.tab);
            });
        });

        // Refresh assets
        document.getElementById('refresh-assets-btn').addEventListener('click', () => {
            const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
            this.loadAssetLibrary(activeTab);
        });

        // Canvas interactions
        this.canvas.addEventListener('mousedown', (e) => this.handleCanvasMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleCanvasMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleCanvasMouseUp(e));

        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Delete' && this.selectedAsset) {
                this.deleteSelectedAsset();
            }
        });

        // Drag and drop from asset library
        this.setupDragAndDrop();
    }

    setupDragAndDrop() {
        // Make canvas a drop target
        this.canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });

        this.canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            const assetPath = e.dataTransfer.getData('text/plain');
            const assetType = e.dataTransfer.getData('asset-type');

            if (assetPath) {
                const rect = this.canvas.getBoundingClientRect();
                const x = (e.clientX - rect.left) / this.zoom;
                const y = (e.clientY - rect.top) / this.zoom;

                this.addAssetFromPath(assetPath, assetType, x, y);
            }
        });
    }

    async loadAssetLibrary(type) {
        const assetList = document.getElementById('asset-list');
        assetList.innerHTML = '<div class="loading">Scanning assets folder...</div>';

        try {
            // Call server API to scan assets folder
            const response = await fetch('http://127.0.0.1:8000/api/scan-assets');

            if (!response.ok) {
                throw new Error('Failed to scan assets');
            }

            const scannedAssets = await response.json();

            // Map type names
            const typeMap = {
                'images': 'images',
                'audio': 'audio',
                'fonts': 'fonts'
            };

            const assets = scannedAssets[typeMap[type]] || [];

            if (assets.length === 0) {
                assetList.innerHTML = `
                    <div class="asset-help">
                        <p>No ${type} found.</p>
                        <p><br>Add files to:</p>
                        <p><code>assets/${type}/</code></p>
                        <p><br>Then click Refresh.</p>
                    </div>
                `;
                return;
            }

            assetList.innerHTML = assets.map(asset => `
                <div class="asset-item" draggable="true"
                     data-path="${asset.path}"
                     data-type="${type}">
                    <div class="asset-icon">${this.getAssetIcon(type)}</div>
                    <div class="asset-name" title="${asset.path}">${asset.name}</div>
                </div>
            `).join('');

            console.log(`[AssetLibrary] Loaded ${assets.length} ${type}`);

            // Make assets draggable
            document.querySelectorAll('.asset-item').forEach(item => {
                item.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', item.dataset.path);
                    e.dataTransfer.setData('asset-type', item.dataset.type);
                    e.dataTransfer.effectAllowed = 'copy';
                });
            });

        } catch (error) {
            console.error('[AssetLibrary] Failed to load assets:', error);
            assetList.innerHTML = `
                <div class="asset-help" style="color: #ff6666;">
                    <p>⚠️ Error loading assets</p>
                    <p><br>${error.message}</p>
                    <p><br>Make sure server is running:</p>
                    <p><code>node server.js</code></p>
                </div>
            `;
        }
    }


    getAssetIcon(type) {
        const icons = {
            images: '🖼️',
            audio: '🔊',
            fonts: '🔤'
        };
        return icons[type] || '📄';
    }

    addAssetFromPath(path, type, x, y) {
        const asset = {
            id: `asset_${this.assetIdCounter++}`,
            type: type === 'images' ? 'image' : type === 'audio' ? 'audio' : 'font',
            path: path,
            x: this.snapToGrid(x),
            y: this.snapToGrid(y),
            width: type === 'images' ? 400 : 0,
            height: type === 'images' ? 300 : 0,
            rotation: 0,
            opacity: 1.0,
            zIndex: this.template.assets.length,
            startTime: 0,
            duration: this.template.duration || 5000
        };

        this.template.assets.push(asset);
        this.selectedAsset = asset;
        this.renderViewport();
        this.renderTimeline();
        this.renderProperties();
    }

    addTextAsset() {
        const asset = {
            id: `text_${this.assetIdCounter++}`,
            type: 'text',
            content: 'New Text',
            x: 640,
            y: 360,
            fontSize: 32,
            fontFamily: 'Georgia',
            color: '#FFFFFF',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 2,
            zIndex: this.template.assets.length,
            startTime: 0,
            duration: this.template.duration || 5000,
            opacity: 1.0
        };

        this.template.assets.push(asset);
        this.selectedAsset = asset;
        this.renderViewport();
        this.renderTimeline();
        this.renderProperties();
    }

    addShapeAsset() {
        const asset = {
            id: `shape_${this.assetIdCounter++}`,
            type: 'shape',
            shapeType: 'rectangle',
            x: 640,
            y: 360,
            width: 200,
            height: 100,
            color: '#4CAF50',
            opacity: 1.0,
            zIndex: this.template.assets.length,
            startTime: 0,
            duration: this.template.duration || 5000
        };

        this.template.assets.push(asset);
        this.selectedAsset = asset;
        this.renderViewport();
        this.renderTimeline();
        this.renderProperties();
    }

    snapToGrid(value) {
        if (!this.gridSnap) return Math.round(value);
        return Math.round(value / this.gridSize) * this.gridSize;
    }

    renderViewport() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Draw background
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Draw grid
        if (this.gridSnap) {
            this.drawGrid();
        }

        // Sort assets by z-index
        const sortedAssets = [...this.template.assets].sort((a, b) => a.zIndex - b.zIndex);

        // Draw each asset that's visible at current playhead time
        sortedAssets.forEach(asset => {
            if (this.playheadTime >= asset.startTime &&
                this.playheadTime < asset.startTime + asset.duration) {
                this.drawAsset(asset);
            }
        });

        // Draw selection if asset selected
        if (this.selectedAsset) {
            this.drawSelection(this.selectedAsset);
        }
    }

    drawGrid() {
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;

        // Vertical lines
        for (let x = 0; x <= this.canvasWidth; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvasHeight);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y <= this.canvasHeight; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvasWidth, y);
            this.ctx.stroke();
        }
    }

    drawAsset(asset) {
        this.ctx.save();
        this.ctx.globalAlpha = asset.opacity;

        if (asset.type === 'image') {
            // Draw placeholder for image
            this.ctx.fillStyle = '#4a4a4a';
            this.ctx.fillRect(asset.x, asset.y, asset.width, asset.height);

            this.ctx.fillStyle = '#888';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(asset.path.split('/').pop(),
                            asset.x + asset.width/2,
                            asset.y + asset.height/2);
        }
        else if (asset.type === 'text') {
            this.ctx.fillStyle = asset.color;
            this.ctx.font = `${asset.fontSize}px ${asset.fontFamily}`;
            this.ctx.textAlign = asset.align;

            if (asset.stroke && asset.strokeThickness) {
                this.ctx.strokeStyle = asset.stroke;
                this.ctx.lineWidth = asset.strokeThickness;
                this.ctx.strokeText(asset.content, asset.x, asset.y);
            }

            this.ctx.fillText(asset.content, asset.x, asset.y);
        }
        else if (asset.type === 'shape') {
            this.ctx.fillStyle = asset.color;
            if (asset.shapeType === 'rectangle') {
                this.ctx.fillRect(asset.x - asset.width/2,
                                 asset.y - asset.height/2,
                                 asset.width, asset.height);
            }
        }

        this.ctx.restore();
    }

    drawSelection(asset) {
        this.ctx.strokeStyle = '#4CAF50';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);

        if (asset.type === 'image' || asset.type === 'shape') {
            let x = asset.type === 'shape' ? asset.x - asset.width/2 : asset.x;
            let y = asset.type === 'shape' ? asset.y - asset.height/2 : asset.y;
            this.ctx.strokeRect(x, y, asset.width, asset.height);

            // Draw resize handles
            this.drawHandle(x, y);
            this.drawHandle(x + asset.width, y);
            this.drawHandle(x, y + asset.height);
            this.drawHandle(x + asset.width, y + asset.height);
        } else if (asset.type === 'text') {
            // Measure text bounds (approximate)
            this.ctx.font = `${asset.fontSize}px ${asset.fontFamily}`;
            const metrics = this.ctx.measureText(asset.content);
            const width = metrics.width;
            const height = asset.fontSize;

            this.ctx.strokeRect(asset.x - width/2, asset.y - height, width, height);
        }

        this.ctx.setLineDash([]);
    }

    drawHandle(x, y) {
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.fillRect(x - 4, y - 4, 8, 8);
    }

    handleCanvasMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.zoom;
        const y = (e.clientY - rect.top) / this.zoom;

        // Check if clicking on an asset
        const clickedAsset = this.getAssetAtPoint(x, y);

        if (clickedAsset) {
            this.selectedAsset = clickedAsset;
            this.isDragging = true;
            this.dragStartX = x - clickedAsset.x;
            this.dragStartY = y - clickedAsset.y;
            this.renderViewport();
            this.renderProperties();
        } else {
            this.selectedAsset = null;
            this.renderViewport();
            this.renderProperties();
        }
    }

    handleCanvasMouseMove(e) {
        if (!this.isDragging || !this.selectedAsset) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.zoom;
        const y = (e.clientY - rect.top) / this.zoom;

        this.selectedAsset.x = this.snapToGrid(x - this.dragStartX);
        this.selectedAsset.y = this.snapToGrid(y - this.dragStartY);

        this.renderViewport();
        this.renderProperties();
    }

    handleCanvasMouseUp(e) {
        this.isDragging = false;
        this.isResizing = false;
    }

    getAssetAtPoint(x, y) {
        // Check in reverse z-order (top to bottom)
        const sortedAssets = [...this.template.assets].sort((a, b) => b.zIndex - a.zIndex);

        for (const asset of sortedAssets) {
            // Skip if not visible at current time
            if (this.playheadTime < asset.startTime ||
                this.playheadTime >= asset.startTime + asset.duration) {
                continue;
            }

            if (asset.type === 'image' || asset.type === 'shape') {
                let ax = asset.type === 'shape' ? asset.x - asset.width/2 : asset.x;
                let ay = asset.type === 'shape' ? asset.y - asset.height/2 : asset.y;

                if (x >= ax && x <= ax + asset.width &&
                    y >= ay && y <= ay + asset.height) {
                    return asset;
                }
            } else if (asset.type === 'text') {
                // Approximate text bounds
                const width = asset.content.length * (asset.fontSize * 0.6);
                const height = asset.fontSize;

                if (x >= asset.x - width/2 && x <= asset.x + width/2 &&
                    y >= asset.y - height && y <= asset.y) {
                    return asset;
                }
            }
        }

        return null;
    }

    deleteSelectedAsset() {
        if (!this.selectedAsset) return;

        const index = this.template.assets.indexOf(this.selectedAsset);
        if (index > -1) {
            this.template.assets.splice(index, 1);
            this.selectedAsset = null;
            this.renderViewport();
            this.renderTimeline();
            this.renderProperties();
        }
    }

    renderProperties() {
        const panel = document.getElementById('properties-content');

        if (!this.selectedAsset) {
            panel.innerHTML = '<p style="color: #888; padding: 20px;">Select an asset to edit properties</p>';
            return;
        }

        const asset = this.selectedAsset;

        let html = `
            <div class="property-group">
                <label>Asset ID:</label>
                <input type="text" value="${asset.id}" disabled>
            </div>
        `;

        // Position
        html += `
            <div class="property-group">
                <label>Position X:</label>
                <input type="number" id="prop-x" value="${asset.x}" step="${this.gridSize}">
            </div>
            <div class="property-group">
                <label>Position Y:</label>
                <input type="number" id="prop-y" value="${asset.y}" step="${this.gridSize}">
            </div>
        `;

        // Size (for images and shapes)
        if (asset.type === 'image' || asset.type === 'shape') {
            html += `
                <div class="property-group">
                    <label>Width:</label>
                    <input type="number" id="prop-width" value="${asset.width}" min="10">
                </div>
                <div class="property-group">
                    <label>Height:</label>
                    <input type="number" id="prop-height" value="${asset.height}" min="10">
                </div>
            `;
        }

        // Text-specific
        if (asset.type === 'text') {
            html += `
                <div class="property-group">
                    <label>Content:</label>
                    <textarea id="prop-content" rows="3">${asset.content}</textarea>
                </div>
                <div class="property-group">
                    <label>Font Size:</label>
                    <input type="number" id="prop-fontsize" value="${asset.fontSize}" min="8" max="200">
                </div>
                <div class="property-group">
                    <label>Font Family:</label>
                    <input type="text" id="prop-fontfamily" value="${asset.fontFamily}">
                </div>
                <div class="property-group">
                    <label>Color:</label>
                    <input type="color" id="prop-color" value="${asset.color}">
                </div>
            `;
        }

        // Timing
        html += `
            <div class="property-group">
                <label>Start Time (ms):</label>
                <input type="number" id="prop-starttime" value="${asset.startTime}" min="0" step="100">
            </div>
            <div class="property-group">
                <label>Duration (ms):</label>
                <input type="number" id="prop-duration" value="${asset.duration}" min="100" step="100">
            </div>
        `;

        // Opacity & Z-index
        html += `
            <div class="property-group">
                <label>Opacity:</label>
                <input type="range" id="prop-opacity" value="${asset.opacity}" min="0" max="1" step="0.1">
                <span id="opacity-value">${Math.round(asset.opacity * 100)}%</span>
            </div>
            <div class="property-group">
                <label>Z-Index (Layer):</label>
                <input type="number" id="prop-zindex" value="${asset.zIndex}" min="0">
            </div>
        `;

        html += `
            <div class="property-group">
                <button class="btn-danger" id="delete-asset-btn">🗑️ Delete Asset</button>
            </div>
        `;

        panel.innerHTML = html;

        // Attach event listeners for property changes
        this.attachPropertyListeners();
    }

    attachPropertyListeners() {
        const bindProp = (id, prop, parser = parseFloat) => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', (e) => {
                    this.selectedAsset[prop] = parser(e.target.value);
                    this.renderViewport();
                    if (id === 'prop-opacity') {
                        document.getElementById('opacity-value').textContent =
                            Math.round(this.selectedAsset.opacity * 100) + '%';
                    }
                });
            }
        };

        bindProp('prop-x', 'x');
        bindProp('prop-y', 'y');
        bindProp('prop-width', 'width');
        bindProp('prop-height', 'height');
        bindProp('prop-fontsize', 'fontSize');
        bindProp('prop-starttime', 'startTime');
        bindProp('prop-duration', 'duration');
        bindProp('prop-opacity', 'opacity');
        bindProp('prop-zindex', 'zIndex');

        const contentEl = document.getElementById('prop-content');
        if (contentEl) {
            contentEl.addEventListener('input', (e) => {
                this.selectedAsset.content = e.target.value;
                this.renderViewport();
            });
        }

        const fontFamilyEl = document.getElementById('prop-fontfamily');
        if (fontFamilyEl) {
            fontFamilyEl.addEventListener('input', (e) => {
                this.selectedAsset.fontFamily = e.target.value;
                this.renderViewport();
            });
        }

        const colorEl = document.getElementById('prop-color');
        if (colorEl) {
            colorEl.addEventListener('input', (e) => {
                this.selectedAsset.color = e.target.value;
                this.renderViewport();
            });
        }

        const deleteBtn = document.getElementById('delete-asset-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.deleteSelectedAsset());
        }
    }

    renderTimeline() {
        const timeline = document.getElementById('timeline-layers');
        const totalDuration = this.template.duration || 5000;

        if (this.template.assets.length === 0) {
            timeline.innerHTML = '<div style="padding: 20px; color: #888;">No assets yet. Drag from library!</div>';
            return;
        }

        const sortedAssets = [...this.template.assets].sort((a, b) => b.zIndex - a.zIndex);

        timeline.innerHTML = sortedAssets.map(asset => {
            const startPercent = (asset.startTime / totalDuration) * 100;
            const widthPercent = (asset.duration / totalDuration) * 100;

            return `
                <div class="timeline-layer ${asset === this.selectedAsset ? 'selected' : ''}">
                    <div class="layer-name">${asset.id}</div>
                    <div class="layer-track">
                        <div class="layer-bar"
                             style="left: ${startPercent}%; width: ${widthPercent}%;"
                             data-asset-id="${asset.id}">
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Render ruler
        this.renderTimelineRuler();
    }

    renderTimelineRuler() {
        const ruler = document.getElementById('timeline-ruler');
        const totalDuration = this.template.duration || 5000;
        const steps = 10;

        let html = '';
        for (let i = 0; i <= steps; i++) {
            const time = (totalDuration / steps) * i;
            const percent = (i / steps) * 100;
            html += `<div class="time-marker" style="left: ${percent}%;">${Math.round(time)}ms</div>`;
        }

        ruler.innerHTML = html;
    }

    playTimeline() {
        if (this.isPlaying) return;

        this.isPlaying = true;
        this.playheadTime = 0;
        const totalDuration = this.template.duration || 5000;
        const startTime = Date.now();

        const animate = () => {
            if (!this.isPlaying) return;

            const elapsed = Date.now() - startTime;
            this.playheadTime = elapsed;

            if (this.playheadTime >= totalDuration) {
                this.stopTimeline();
                return;
            }

            // Update playhead position
            const playhead = document.getElementById('timeline-playhead');
            const percent = (this.playheadTime / totalDuration) * 100;
            playhead.style.left = percent + '%';

            // Update viewport info
            document.querySelector('.viewport-info').textContent =
                `Playhead: ${Math.round(this.playheadTime)}ms`;

            this.renderViewport();
            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }

    stopTimeline() {
        this.isPlaying = false;
        this.playheadTime = 0;
        document.getElementById('timeline-playhead').style.left = '0%';
        document.querySelector('.viewport-info').textContent = 'Playhead: 0ms';
        this.renderViewport();
    }

    previewScene() {
        alert('Preview will open scene in a modal window (to be implemented)');
    }

    saveTemplate() {
        // Template is already being modified by reference
        // Just need to trigger parent save
        if (this.onSave) {
            this.onSave(this.template);
        }

        alert('Cinematic scene saved! Click "Export Game" to save to game.json');
    }
}
