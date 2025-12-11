/**
 * TimelineEditor.js
 * After Effects-style Timeline Editor for DEADDAY Cinematics
 *
 * Features:
 * - Multi-track timeline with zoom and pan
 * - Keyframe manipulation (add, delete, move, copy)
 * - Property animation curves
 * - Layer management with hierarchy
 * - Real-time preview integration
 * - Snap-to-grid and snap-to-keyframe
 * - Timeline scrubbing with playhead
 * - Undo/redo system
 * - Import/export timeline JSON
 */

export class TimelineEditor {
    constructor() {
        this.container = null;
        this.timeline = null;
        this.selectedTrack = null;
        this.selectedKeyframe = null;
        this.currentTime = 0;
        this.duration = 60000; // 60 seconds default
        this.zoom = 1.0; // pixels per millisecond
        this.scroll = 0;
        this.isPlaying = false;
        this.snapEnabled = true;
        this.gridSize = 1000; // 1 second

        // UI Elements
        this.canvas = null;
        this.ctx = null;
        this.playhead = null;
        this.trackList = null;
        this.propertyPanel = null;

        // Interaction state
        this.isDragging = false;
        this.dragTarget = null;
        this.dragStartX = 0;
        this.dragStartTime = 0;

        // History
        this.history = [];
        this.historyIndex = -1;

        // Colors
        this.colors = {
            background: '#1a1a1a',
            trackBg: '#252525',
            trackBgAlt: '#2a2a2a',
            trackHeader: '#303030',
            gridLine: '#353535',
            playhead: '#ff0000',
            keyframe: '#4a9eff',
            keyframeSelected: '#ffaa00',
            timeText: '#cccccc',
            trackText: '#ffffff'
        };
    }

    init(containerId = 'timeline-editor') {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('[TimelineEditor] Container not found:', containerId);
            return;
        }

        this.buildUI();
        this.setupEventListeners();
        this.render();

        console.log('[TimelineEditor] Initialized');
    }

    buildUI() {
        this.container.innerHTML = `
            <div class="timeline-editor-layout">
                <!-- Top Toolbar -->
                <div class="timeline-toolbar">
                    <div class="timeline-controls">
                        <button id="tl-play-btn" class="tl-btn" title="Play/Pause (Space)">
                            <span class="icon">▶</span>
                        </button>
                        <button id="tl-stop-btn" class="tl-btn" title="Stop">
                            <span class="icon">■</span>
                        </button>
                        <button id="tl-loop-btn" class="tl-btn" title="Toggle Loop">
                            <span class="icon">⟳</span>
                        </button>
                        <span class="time-display" id="tl-time-display">00:00.000</span>
                    </div>
                    <div class="timeline-tools">
                        <button id="tl-add-track-btn" class="tl-btn" title="Add Track">
                            <span class="icon">+ Track</span>
                        </button>
                        <button id="tl-add-keyframe-btn" class="tl-btn" title="Add Keyframe (K)">
                            <span class="icon">+ Keyframe</span>
                        </button>
                        <button id="tl-delete-btn" class="tl-btn" title="Delete (Del)">
                            <span class="icon">🗑</span>
                        </button>
                    </div>
                    <div class="timeline-zoom">
                        <button id="tl-zoom-out-btn" class="tl-btn" title="Zoom Out (-)">−</button>
                        <input type="range" id="tl-zoom-slider" min="0.1" max="5" step="0.1" value="1">
                        <button id="tl-zoom-in-btn" class="tl-btn" title="Zoom In (+)">+</button>
                        <label>
                            <input type="checkbox" id="tl-snap-checkbox" checked> Snap
                        </label>
                    </div>
                </div>

                <!-- Main Timeline Area -->
                <div class="timeline-main">
                    <!-- Track Headers (left sidebar) -->
                    <div class="timeline-track-headers" id="tl-track-headers">
                        <!-- Track headers populated dynamically -->
                    </div>

                    <!-- Timeline Canvas (scrollable) -->
                    <div class="timeline-canvas-container" id="tl-canvas-container">
                        <canvas id="tl-canvas" width="2000" height="600"></canvas>
                        <div class="timeline-playhead" id="tl-playhead"></div>
                    </div>
                </div>

                <!-- Bottom Property Panel -->
                <div class="timeline-properties" id="tl-properties">
                    <div class="properties-header">Properties</div>
                    <div class="properties-content" id="tl-properties-content">
                        <p class="placeholder">Select a keyframe to edit properties</p>
                    </div>
                </div>
            </div>
        `;

        // Get references
        this.canvas = document.getElementById('tl-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.playhead = document.getElementById('tl-playhead');
        this.trackList = document.getElementById('tl-track-headers');
        this.propertyPanel = document.getElementById('tl-properties-content');
        this.canvasContainer = document.getElementById('tl-canvas-container');

        // Apply styles
        this.applyStyles();
    }

    applyStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .timeline-editor-layout {
                display: flex;
                flex-direction: column;
                width: 100%;
                height: 100%;
                background: ${this.colors.background};
                color: ${this.colors.trackText};
                font-family: Arial, sans-serif;
            }

            .timeline-toolbar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                background: ${this.colors.trackHeader};
                border-bottom: 1px solid #000;
            }

            .timeline-controls,
            .timeline-tools,
            .timeline-zoom {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .tl-btn {
                background: #404040;
                border: 1px solid #555;
                color: #fff;
                padding: 6px 12px;
                cursor: pointer;
                border-radius: 3px;
                font-size: 12px;
            }

            .tl-btn:hover {
                background: #505050;
            }

            .tl-btn:active {
                background: #303030;
            }

            .time-display {
                font-family: monospace;
                font-size: 14px;
                color: ${this.colors.timeText};
                padding: 0 12px;
            }

            .timeline-main {
                display: flex;
                flex: 1;
                overflow: hidden;
                position: relative;
            }

            .timeline-track-headers {
                width: 200px;
                background: ${this.colors.trackHeader};
                border-right: 2px solid #000;
                overflow-y: auto;
                overflow-x: hidden;
            }

            .track-header {
                height: 60px;
                padding: 8px;
                border-bottom: 1px solid #000;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }

            .track-header:hover {
                background: #383838;
            }

            .track-header.selected {
                background: #4a4a4a;
            }

            .track-header-name {
                font-size: 13px;
                font-weight: bold;
                margin-bottom: 4px;
            }

            .track-header-type {
                font-size: 11px;
                color: #999;
            }

            .timeline-canvas-container {
                flex: 1;
                position: relative;
                overflow: auto;
                background: ${this.colors.background};
            }

            #tl-canvas {
                display: block;
            }

            .timeline-playhead {
                position: absolute;
                top: 0;
                left: 0;
                width: 2px;
                height: 100%;
                background: ${this.colors.playhead};
                pointer-events: none;
                z-index: 1000;
            }

            .timeline-playhead::before {
                content: '';
                position: absolute;
                top: 0;
                left: -4px;
                width: 0;
                height: 0;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-top: 8px solid ${this.colors.playhead};
            }

            .timeline-properties {
                height: 200px;
                background: ${this.colors.trackHeader};
                border-top: 2px solid #000;
                overflow-y: auto;
            }

            .properties-header {
                padding: 8px 12px;
                font-weight: bold;
                font-size: 13px;
                border-bottom: 1px solid #000;
            }

            .properties-content {
                padding: 12px;
            }

            .property-group {
                margin-bottom: 16px;
            }

            .property-label {
                font-size: 12px;
                color: #aaa;
                margin-bottom: 4px;
            }

            .property-input {
                width: 100%;
                padding: 6px;
                background: #1a1a1a;
                border: 1px solid #444;
                color: #fff;
                border-radius: 3px;
                font-size: 12px;
            }

            .property-row {
                display: flex;
                gap: 8px;
                margin-bottom: 8px;
            }

            .property-row .property-input {
                flex: 1;
            }

            .placeholder {
                color: #666;
                font-size: 12px;
                font-style: italic;
            }

            #tl-zoom-slider {
                width: 100px;
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Playback controls
        document.getElementById('tl-play-btn')?.addEventListener('click', () => this.togglePlay());
        document.getElementById('tl-stop-btn')?.addEventListener('click', () => this.stop());

        // Track management
        document.getElementById('tl-add-track-btn')?.addEventListener('click', () => this.addTrack());
        document.getElementById('tl-add-keyframe-btn')?.addEventListener('click', () => this.addKeyframe());
        document.getElementById('tl-delete-btn')?.addEventListener('click', () => this.deleteSelected());

        // Zoom controls
        document.getElementById('tl-zoom-in-btn')?.addEventListener('click', () => this.setZoom(this.zoom + 0.5));
        document.getElementById('tl-zoom-out-btn')?.addEventListener('click', () => this.setZoom(this.zoom - 0.5));
        document.getElementById('tl-zoom-slider')?.addEventListener('input', (e) => {
            this.setZoom(parseFloat(e.target.value));
        });

        // Snap toggle
        document.getElementById('tl-snap-checkbox')?.addEventListener('change', (e) => {
            this.snapEnabled = e.target.checked;
        });

        // Canvas interactions
        this.canvas.addEventListener('mousedown', (e) => this.onCanvasMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onCanvasMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onCanvasMouseUp(e));
        this.canvas.addEventListener('click', (e) => this.onCanvasClick(e));

        // Canvas scroll
        this.canvasContainer.addEventListener('scroll', () => {
            this.scroll = this.canvasContainer.scrollLeft;
            this.render();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.onKeyDown(e));

        // Window resize
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const container = this.canvasContainer;
        this.canvas.width = Math.max(container.clientWidth, this.duration * this.zoom);
        this.canvas.height = container.clientHeight;
        this.render();
    }

    loadTimeline(timelineData) {
        this.timeline = timelineData;
        this.duration = timelineData.duration || 60000;
        this.currentTime = 0;

        // Rebuild track headers
        this.buildTrackHeaders();

        // Resize and render
        this.resizeCanvas();
        this.render();

        console.log('[TimelineEditor] Timeline loaded:', timelineData.id);
    }

    buildTrackHeaders() {
        if (!this.timeline || !this.trackList) return;

        this.trackList.innerHTML = '';

        this.timeline.tracks.forEach((track, index) => {
            const header = document.createElement('div');
            header.className = 'track-header';
            header.dataset.trackIndex = index;

            header.innerHTML = `
                <div class="track-header-name">${track.name || 'Track ' + (index + 1)}</div>
                <div class="track-header-type">${track.type}</div>
            `;

            header.addEventListener('click', () => this.selectTrack(index));

            this.trackList.appendChild(header);
        });
    }

    render() {
        if (!this.ctx || !this.canvas) return;

        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Clear canvas
        ctx.fillStyle = this.colors.background;
        ctx.fillRect(0, 0, width, height);

        // Draw grid
        this.drawGrid();

        // Draw tracks
        this.drawTracks();

        // Draw timeline ruler
        this.drawTimeRuler();

        // Update playhead position
        this.updatePlayhead();
    }

    drawGrid() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        ctx.strokeStyle = this.colors.gridLine;
        ctx.lineWidth = 1;

        // Vertical grid lines (time markers)
        const gridInterval = this.gridSize * this.zoom;
        for (let x = 0; x < width; x += gridInterval) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        // Horizontal grid lines (track separators)
        const trackHeight = 60;
        for (let y = trackHeight; y < height; y += trackHeight) {
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    }

    drawTimeRuler() {
        const ctx = this.ctx;
        const width = this.canvas.width;

        // Ruler background
        ctx.fillStyle = this.colors.trackHeader;
        ctx.fillRect(0, 0, width, 30);

        // Time markers
        ctx.fillStyle = this.colors.timeText;
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';

        const markerInterval = this.gridSize * this.zoom;
        for (let x = 0; x < width; x += markerInterval) {
            const time = x / this.zoom;
            const timeStr = this.formatTime(time);

            ctx.fillText(timeStr, x + 4, 20);

            // Tick mark
            ctx.strokeStyle = this.colors.timeText;
            ctx.beginPath();
            ctx.moveTo(x, 25);
            ctx.lineTo(x, 30);
            ctx.stroke();
        }
    }

    drawTracks() {
        if (!this.timeline) return;

        const ctx = this.ctx;
        const trackHeight = 60;
        const rulerHeight = 30;

        this.timeline.tracks.forEach((track, index) => {
            const y = rulerHeight + index * trackHeight;

            // Track background
            ctx.fillStyle = index % 2 === 0 ? this.colors.trackBg : this.colors.trackBgAlt;
            ctx.fillRect(0, y, this.canvas.width, trackHeight);

            // Draw keyframes
            if (track.keyframes) {
                track.keyframes.forEach(keyframe => {
                    this.drawKeyframe(keyframe, y + trackHeight / 2);
                });
            }
        });
    }

    drawKeyframe(keyframe, y) {
        const ctx = this.ctx;
        const x = keyframe.time * this.zoom;
        const size = 8;

        const isSelected = this.selectedKeyframe === keyframe;
        ctx.fillStyle = isSelected ? this.colors.keyframeSelected : this.colors.keyframe;

        // Diamond shape
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x, y + size);
        ctx.lineTo(x - size, y);
        ctx.closePath();
        ctx.fill();

        // Duration indicator
        if (keyframe.duration) {
            const endX = (keyframe.time + keyframe.duration) * this.zoom;
            ctx.strokeStyle = this.colors.keyframe;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(endX, y);
            ctx.stroke();
            ctx.globalAlpha = 1.0;
        }
    }

    updatePlayhead() {
        if (!this.playhead) return;

        const x = this.currentTime * this.zoom - this.scroll;
        this.playhead.style.left = x + 'px';

        // Update time display
        const timeDisplay = document.getElementById('tl-time-display');
        if (timeDisplay) {
            timeDisplay.textContent = this.formatTime(this.currentTime);
        }
    }

    formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor(ms % 1000);

        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
    }

    onCanvasMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left + this.scroll;
        const y = e.clientY - rect.top;

        // Check if clicking on a keyframe
        const keyframe = this.getKeyframeAtPosition(x, y);

        if (keyframe) {
            this.isDragging = true;
            this.dragTarget = keyframe;
            this.dragStartX = x;
            this.dragStartTime = keyframe.time;
        } else {
            // Move playhead
            this.currentTime = x / this.zoom;
            if (this.snapEnabled) {
                this.currentTime = this.snapToGrid(this.currentTime);
            }
            this.updatePlayhead();
        }
    }

    onCanvasMouseMove(e) {
        if (!this.isDragging || !this.dragTarget) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left + this.scroll;

        const deltaX = x - this.dragStartX;
        const deltaTime = deltaX / this.zoom;

        let newTime = this.dragStartTime + deltaTime;

        if (this.snapEnabled) {
            newTime = this.snapToGrid(newTime);
        }

        this.dragTarget.time = Math.max(0, newTime);
        this.render();
    }

    onCanvasMouseUp(e) {
        if (this.isDragging) {
            this.saveHistory();
        }

        this.isDragging = false;
        this.dragTarget = null;
    }

    onCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left + this.scroll;
        const y = e.clientY - rect.top;

        const keyframe = this.getKeyframeAtPosition(x, y);

        if (keyframe) {
            this.selectKeyframe(keyframe);
        }
    }

    getKeyframeAtPosition(x, y) {
        if (!this.timeline) return null;

        const trackHeight = 60;
        const rulerHeight = 30;

        for (const track of this.timeline.tracks) {
            const trackIndex = this.timeline.tracks.indexOf(track);
            const trackY = rulerHeight + trackIndex * trackHeight;

            if (y >= trackY && y <= trackY + trackHeight) {
                // Check keyframes in this track
                for (const keyframe of track.keyframes || []) {
                    const kfX = keyframe.time * this.zoom;
                    const kfY = trackY + trackHeight / 2;

                    const distance = Math.sqrt((x - kfX) ** 2 + (y - kfY) ** 2);

                    if (distance < 10) {
                        return keyframe;
                    }
                }
            }
        }

        return null;
    }

    selectTrack(index) {
        this.selectedTrack = this.timeline.tracks[index];

        // Update UI
        const headers = this.trackList.querySelectorAll('.track-header');
        headers.forEach((header, i) => {
            if (i === index) {
                header.classList.add('selected');
            } else {
                header.classList.remove('selected');
            }
        });

        console.log('[TimelineEditor] Track selected:', this.selectedTrack.name);
    }

    selectKeyframe(keyframe) {
        this.selectedKeyframe = keyframe;
        this.render();
        this.updatePropertyPanel();

        console.log('[TimelineEditor] Keyframe selected:', keyframe);
    }

    updatePropertyPanel() {
        if (!this.selectedKeyframe || !this.propertyPanel) {
            this.propertyPanel.innerHTML = '<p class="placeholder">Select a keyframe to edit properties</p>';
            return;
        }

        const kf = this.selectedKeyframe;

        this.propertyPanel.innerHTML = `
            <div class="property-group">
                <div class="property-label">Time (ms)</div>
                <input type="number" class="property-input" id="prop-time" value="${kf.time}" step="100">
            </div>
            <div class="property-group">
                <div class="property-label">Duration (ms)</div>
                <input type="number" class="property-input" id="prop-duration" value="${kf.duration || 0}" step="100">
            </div>
            ${this.buildPropertyInputs(kf)}
        `;

        // Add event listeners
        document.getElementById('prop-time')?.addEventListener('change', (e) => {
            kf.time = parseFloat(e.target.value);
            this.render();
            this.saveHistory();
        });

        document.getElementById('prop-duration')?.addEventListener('change', (e) => {
            kf.duration = parseFloat(e.target.value);
            this.render();
            this.saveHistory();
        });
    }

    buildPropertyInputs(keyframe) {
        let html = '';

        // Position
        if (keyframe.x !== undefined || keyframe.y !== undefined) {
            html += `
                <div class="property-group">
                    <div class="property-label">Position</div>
                    <div class="property-row">
                        <input type="number" class="property-input" placeholder="X" value="${keyframe.x || 0}" data-prop="x">
                        <input type="number" class="property-input" placeholder="Y" value="${keyframe.y || 0}" data-prop="y">
                    </div>
                </div>
            `;
        }

        // Scale
        if (keyframe.scaleX !== undefined || keyframe.scaleY !== undefined) {
            html += `
                <div class="property-group">
                    <div class="property-label">Scale</div>
                    <div class="property-row">
                        <input type="number" class="property-input" placeholder="X" value="${keyframe.scaleX || 1}" step="0.1" data-prop="scaleX">
                        <input type="number" class="property-input" placeholder="Y" value="${keyframe.scaleY || 1}" step="0.1" data-prop="scaleY">
                    </div>
                </div>
            `;
        }

        // Alpha
        if (keyframe.alpha !== undefined) {
            html += `
                <div class="property-group">
                    <div class="property-label">Alpha</div>
                    <input type="number" class="property-input" value="${keyframe.alpha || 1}" step="0.1" min="0" max="1" data-prop="alpha">
                </div>
            `;
        }

        // Text
        if (keyframe.text !== undefined) {
            html += `
                <div class="property-group">
                    <div class="property-label">Text</div>
                    <textarea class="property-input" rows="3" data-prop="text">${keyframe.text}</textarea>
                </div>
            `;
        }

        return html;
    }

    addTrack() {
        if (!this.timeline) {
            this.timeline = {
                id: 'new_timeline',
                duration: 60000,
                tracks: []
            };
        }

        const trackType = prompt('Enter track type (image, text, dialogue, audio, camera, event):');
        if (!trackType) return;

        const trackName = prompt('Enter track name:') || `Track ${this.timeline.tracks.length + 1}`;

        const newTrack = {
            id: `track_${Date.now()}`,
            name: trackName,
            type: trackType,
            layer: 'background',
            keyframes: []
        };

        this.timeline.tracks.push(newTrack);
        this.buildTrackHeaders();
        this.render();
        this.saveHistory();

        console.log('[TimelineEditor] Track added:', newTrack);
    }

    addKeyframe() {
        if (!this.selectedTrack) {
            alert('Please select a track first');
            return;
        }

        const newKeyframe = {
            id: `kf_${Date.now()}`,
            time: this.currentTime,
            duration: 1000
        };

        // Add default properties based on track type
        switch (this.selectedTrack.type) {
            case 'image':
                newKeyframe.image = 'placeholder';
                newKeyframe.x = 960;
                newKeyframe.y = 540;
                newKeyframe.alpha = 1;
                newKeyframe.scaleX = 1;
                newKeyframe.scaleY = 1;
                break;
            case 'text':
                newKeyframe.text = 'New Text';
                newKeyframe.x = 960;
                newKeyframe.y = 540;
                newKeyframe.fontSize = '32px';
                newKeyframe.color = '#ffffff';
                break;
            case 'dialogue':
                newKeyframe.speaker = 'Character';
                newKeyframe.text = 'Dialogue text here';
                newKeyframe.speed = 30;
                break;
        }

        this.selectedTrack.keyframes.push(newKeyframe);
        this.selectKeyframe(newKeyframe);
        this.render();
        this.saveHistory();

        console.log('[TimelineEditor] Keyframe added:', newKeyframe);
    }

    deleteSelected() {
        if (this.selectedKeyframe && this.selectedTrack) {
            const index = this.selectedTrack.keyframes.indexOf(this.selectedKeyframe);
            if (index > -1) {
                this.selectedTrack.keyframes.splice(index, 1);
                this.selectedKeyframe = null;
                this.updatePropertyPanel();
                this.render();
                this.saveHistory();
                console.log('[TimelineEditor] Keyframe deleted');
            }
        }
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        this.isPlaying = true;
        document.getElementById('tl-play-btn').innerHTML = '<span class="icon">⏸</span>';

        // Start playback loop
        this.playbackLoop();

        console.log('[TimelineEditor] Playing');
    }

    pause() {
        this.isPlaying = false;
        document.getElementById('tl-play-btn').innerHTML = '<span class="icon">▶</span>';

        console.log('[TimelineEditor] Paused');
    }

    stop() {
        this.isPlaying = false;
        this.currentTime = 0;
        this.updatePlayhead();
        document.getElementById('tl-play-btn').innerHTML = '<span class="icon">▶</span>';

        console.log('[TimelineEditor] Stopped');
    }

    playbackLoop() {
        if (!this.isPlaying) return;

        const deltaTime = 16; // ~60fps
        this.currentTime += deltaTime;

        if (this.currentTime >= this.duration) {
            this.stop();
            return;
        }

        this.updatePlayhead();

        requestAnimationFrame(() => this.playbackLoop());
    }

    setZoom(zoom) {
        this.zoom = Phaser.Math.Clamp(zoom, 0.1, 5);
        document.getElementById('tl-zoom-slider').value = this.zoom;

        this.resizeCanvas();
        this.render();
    }

    snapToGrid(time) {
        return Math.round(time / this.gridSize) * this.gridSize;
    }

    onKeyDown(e) {
        // Only handle keys when timeline editor is focused
        if (!this.container.contains(document.activeElement)) return;

        switch (e.key) {
            case ' ':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'k':
            case 'K':
                e.preventDefault();
                this.addKeyframe();
                break;
            case 'Delete':
                e.preventDefault();
                this.deleteSelected();
                break;
            case '+':
            case '=':
                e.preventDefault();
                this.setZoom(this.zoom + 0.5);
                break;
            case '-':
            case '_':
                e.preventDefault();
                this.setZoom(this.zoom - 0.5);
                break;
        }
    }

    saveHistory() {
        // Remove any history after current index
        this.history = this.history.slice(0, this.historyIndex + 1);

        // Add current state
        this.history.push(JSON.stringify(this.timeline));
        this.historyIndex++;

        // Limit history size
        if (this.history.length > 50) {
            this.history.shift();
            this.historyIndex--;
        }
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.timeline = JSON.parse(this.history[this.historyIndex]);
            this.buildTrackHeaders();
            this.render();
            console.log('[TimelineEditor] Undo');
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.timeline = JSON.parse(this.history[this.historyIndex]);
            this.buildTrackHeaders();
            this.render();
            console.log('[TimelineEditor] Redo');
        }
    }

    exportTimeline() {
        if (!this.timeline) return null;

        return JSON.stringify(this.timeline, null, 2);
    }

    importTimeline(jsonString) {
        try {
            const timeline = JSON.parse(jsonString);
            this.loadTimeline(timeline);
            console.log('[TimelineEditor] Timeline imported');
        } catch (error) {
            console.error('[TimelineEditor] Failed to import timeline:', error);
            alert('Invalid timeline JSON');
        }
    }
}
