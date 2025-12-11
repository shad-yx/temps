/**
 * CinematicPlayer.js
 * Runtime system for playing cinematic sequences in DEADDAY Visual Novel Engine
 *
 * Features:
 * - Timeline-based animation system with keyframes
 * - Layer management (backgrounds, characters, effects, text)
 * - Transition effects (fade, slide, zoom, etc.)
 * - Audio sync and control
 * - Camera movements and effects
 * - Text/dialogue display with typewriter effect
 * - Choice/branching system integration
 * - Event system for triggering game state changes
 */

export class CinematicPlayer extends Phaser.Scene {
    constructor() {
        super({ key: 'CinematicPlayer' });

        // Playback state
        this.isPlaying = false;
        this.isPaused = false;
        this.currentTime = 0;
        this.playbackSpeed = 1.0;

        // Timeline data
        this.timeline = null;
        this.layers = new Map();
        this.activeKeyframes = [];

        // Audio
        this.audioTracks = new Map();
        this.currentMusic = null;

        // Text/dialogue
        this.textContainer = null;
        this.currentDialogue = null;
        this.typewriterActive = false;

        // Choices
        this.choiceContainer = null;
        this.currentChoices = null;

        // Camera effects
        this.cameraEffects = {
            shake: false,
            zoom: 1.0,
            rotation: 0
        };

        // Callbacks
        this.onComplete = null;
        this.onChoice = null;
        this.onEvent = null;
    }

    init(data) {
        this.cinematicId = data.cinematicId;
        this.onComplete = data.onComplete;
        this.onChoice = data.onChoice;
        this.onEvent = data.onEvent;
    }

    async create() {
        console.log('[CinematicPlayer] Initializing cinematic:', this.cinematicId);

        // Setup scene
        this.setupLayers();
        this.setupUI();
        this.setupInput();

        // Load cinematic data
        await this.loadCinematic(this.cinematicId);

        // Start playback
        this.play();
    }

    setupLayers() {
        // Create layer containers in order (back to front)
        const layerOrder = [
            'background',
            'background-effects',
            'characters-back',
            'characters-mid',
            'characters-front',
            'foreground-effects',
            'foreground',
            'overlay',
            'ui'
        ];

        layerOrder.forEach((layerName, index) => {
            const container = this.add.container(0, 0);
            container.setDepth(index * 100);
            this.layers.set(layerName, {
                container,
                elements: new Map()
            });
        });

        console.log('[CinematicPlayer] Layers created:', this.layers.size);
    }

    setupUI() {
        const uiLayer = this.layers.get('ui').container;

        // Text container (for dialogue)
        this.textContainer = this.add.container(0, 0);
        this.textContainer.setDepth(9000);

        const textBox = this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height - 150,
            this.cameras.main.width - 100,
            200,
            0x000000,
            0.8
        );

        this.dialogueText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height - 150,
            '',
            {
                fontFamily: 'Arial',
                fontSize: '24px',
                color: '#ffffff',
                align: 'center',
                wordWrap: { width: this.cameras.main.width - 150 }
            }
        ).setOrigin(0.5, 0.5);

        this.speakerText = this.add.text(
            100,
            this.cameras.main.height - 230,
            '',
            {
                fontFamily: 'Arial',
                fontSize: '20px',
                color: '#ffcc00',
                fontStyle: 'bold'
            }
        );

        this.textContainer.add([textBox, this.dialogueText, this.speakerText]);
        this.textContainer.setVisible(false);

        // Choice container
        this.choiceContainer = this.add.container(0, 0);
        this.choiceContainer.setDepth(9100);
        this.choiceContainer.setVisible(false);

        // Skip indicator
        this.skipIndicator = this.add.text(
            this.cameras.main.width - 120,
            20,
            'SPACE to skip',
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                color: '#ffffff',
                alpha: 0.5
            }
        ).setDepth(9200);
    }

    setupInput() {
        // Space to skip/advance
        this.input.keyboard.on('keydown-SPACE', () => {
            if (this.currentDialogue && this.typewriterActive) {
                this.completeTypewriter();
            } else if (this.currentDialogue) {
                this.advanceDialogue();
            }
        });

        // ESC to pause/resume
        this.input.keyboard.on('keydown-ESC', () => {
            this.togglePause();
        });

        // Debug controls
        if (window.DEADDAY?.modeManager?.isDevelopment()) {
            this.input.keyboard.on('keydown-R', () => this.restart());
            this.input.keyboard.on('keydown-LEFT', () => this.seek(this.currentTime - 1000));
            this.input.keyboard.on('keydown-RIGHT', () => this.seek(this.currentTime + 1000));
        }
    }

    async loadCinematic(cinematicId) {
        try {
            // Try to load from template registry
            const template = await window.DEADDAY.templateRegistry.getTemplate('cinematics', cinematicId);

            if (template) {
                this.timeline = template;
            } else {
                // Fallback to JSON file
                const response = await fetch(`src/data/templates/cinematics/${cinematicId}.json`);
                this.timeline = await response.json();
            }

            console.log('[CinematicPlayer] Timeline loaded:', this.timeline);

            // Preload assets
            await this.preloadAssets();

        } catch (error) {
            console.error('[CinematicPlayer] Failed to load cinematic:', error);
            this.exitToScene(this.timeline?.fallbackScene || 'MenuScene');
        }
    }

    async preloadAssets() {
        const assets = this.timeline.assets || {};

        // Load images
        if (assets.images) {
            for (const [key, path] of Object.entries(assets.images)) {
                if (!this.textures.exists(key)) {
                    this.load.image(key, path);
                }
            }
        }

        // Load audio
        if (assets.audio) {
            for (const [key, path] of Object.entries(assets.audio)) {
                if (!this.cache.audio.exists(key)) {
                    this.load.audio(key, path);
                }
            }
        }

        // Start loading
        if (this.load.isLoading() || this.load.list.size > 0) {
            return new Promise((resolve) => {
                this.load.once('complete', resolve);
                this.load.start();
            });
        }
    }

    play() {
        if (this.isPlaying) return;

        this.isPlaying = true;
        this.isPaused = false;

        console.log('[CinematicPlayer] Starting playback');

        // Start background music if specified
        if (this.timeline.music) {
            this.playMusic(this.timeline.music);
        }
    }

    pause() {
        if (!this.isPlaying || this.isPaused) return;

        this.isPaused = true;

        // Pause all audio
        this.audioTracks.forEach(track => track.pause());

        console.log('[CinematicPlayer] Paused at', this.currentTime);
    }

    resume() {
        if (!this.isPaused) return;

        this.isPaused = false;

        // Resume audio
        this.audioTracks.forEach(track => track.resume());

        console.log('[CinematicPlayer] Resumed');
    }

    togglePause() {
        if (this.isPaused) {
            this.resume();
        } else {
            this.pause();
        }
    }

    stop() {
        this.isPlaying = false;
        this.isPaused = false;

        // Stop all audio
        this.audioTracks.forEach(track => {
            track.stop();
            track.destroy();
        });
        this.audioTracks.clear();

        console.log('[CinematicPlayer] Stopped');
    }

    restart() {
        this.stop();
        this.currentTime = 0;
        this.clearAllLayers();
        this.play();
    }

    seek(time) {
        this.currentTime = Phaser.Math.Clamp(time, 0, this.timeline.duration || 60000);
        console.log('[CinematicPlayer] Seeking to', this.currentTime);

        // Re-evaluate timeline at new time
        this.evaluateTimeline();
    }

    update(time, delta) {
        if (!this.isPlaying || this.isPaused) return;

        // Advance timeline
        this.currentTime += delta * this.playbackSpeed;

        // Process timeline
        this.processTimeline(delta);

        // Check for completion
        if (this.timeline.duration && this.currentTime >= this.timeline.duration) {
            this.complete();
        }
    }

    processTimeline(delta) {
        if (!this.timeline.tracks) return;

        // Process each track
        for (const track of this.timeline.tracks) {
            this.processTrack(track, delta);
        }
    }

    processTrack(track, delta) {
        // Find active keyframes for current time
        const activeKeyframes = track.keyframes.filter(kf => {
            const startTime = kf.time;
            const endTime = kf.time + (kf.duration || 0);
            return this.currentTime >= startTime && this.currentTime <= endTime;
        });

        // Process each active keyframe
        for (const keyframe of activeKeyframes) {
            this.processKeyframe(track, keyframe);
        }

        // Check for keyframes that just started
        const newKeyframes = track.keyframes.filter(kf => {
            return Math.abs(this.currentTime - kf.time) < 50; // Within 50ms
        });

        for (const keyframe of newKeyframes) {
            this.startKeyframe(track, keyframe);
        }
    }

    startKeyframe(track, keyframe) {
        console.log('[CinematicPlayer] Starting keyframe:', track.type, keyframe);

        switch (track.type) {
            case 'image':
                this.addImage(track, keyframe);
                break;
            case 'text':
                this.showText(keyframe);
                break;
            case 'dialogue':
                this.showDialogue(keyframe);
                break;
            case 'choice':
                this.showChoices(keyframe);
                break;
            case 'audio':
                this.playAudio(keyframe);
                break;
            case 'camera':
                this.applyCameraEffect(keyframe);
                break;
            case 'event':
                this.triggerEvent(keyframe);
                break;
        }
    }

    processKeyframe(track, keyframe) {
        // Update ongoing animations
        const progress = (this.currentTime - keyframe.time) / (keyframe.duration || 1);

        if (track.type === 'image') {
            this.updateImageAnimation(track, keyframe, progress);
        } else if (track.type === 'camera') {
            this.updateCameraAnimation(keyframe, progress);
        }
    }

    addImage(track, keyframe) {
        const layer = this.layers.get(track.layer || 'background');
        if (!layer) return;

        // Create sprite
        const sprite = this.add.sprite(
            keyframe.x || 0,
            keyframe.y || 0,
            keyframe.image
        );

        sprite.setOrigin(keyframe.originX || 0.5, keyframe.originY || 0.5);
        sprite.setAlpha(keyframe.alpha || 1);
        sprite.setScale(keyframe.scaleX || 1, keyframe.scaleY || 1);
        sprite.setRotation(keyframe.rotation || 0);
        sprite.setDepth(keyframe.depth || 0);

        // Apply blend mode if specified
        if (keyframe.blendMode) {
            sprite.setBlendMode(keyframe.blendMode);
        }

        // Store element
        layer.elements.set(keyframe.id || `element_${Date.now()}`, sprite);
        layer.container.add(sprite);

        // Apply entrance animation
        if (keyframe.entrance) {
            this.applyEntrance(sprite, keyframe.entrance);
        }
    }

    updateImageAnimation(track, keyframe, progress) {
        const layer = this.layers.get(track.layer || 'background');
        if (!layer) return;

        const element = layer.elements.get(keyframe.id);
        if (!element) return;

        // Interpolate properties
        if (keyframe.animation) {
            const anim = keyframe.animation;
            const easing = this.getEasingFunction(anim.easing || 'linear');
            const t = easing(progress);

            if (anim.x !== undefined) {
                element.x = Phaser.Math.Linear(keyframe.x, anim.x, t);
            }
            if (anim.y !== undefined) {
                element.y = Phaser.Math.Linear(keyframe.y, anim.y, t);
            }
            if (anim.alpha !== undefined) {
                element.alpha = Phaser.Math.Linear(keyframe.alpha || 1, anim.alpha, t);
            }
            if (anim.scaleX !== undefined) {
                element.scaleX = Phaser.Math.Linear(keyframe.scaleX || 1, anim.scaleX, t);
            }
            if (anim.scaleY !== undefined) {
                element.scaleY = Phaser.Math.Linear(keyframe.scaleY || 1, anim.scaleY, t);
            }
            if (anim.rotation !== undefined) {
                element.rotation = Phaser.Math.Linear(keyframe.rotation || 0, anim.rotation, t);
            }
        }
    }

    applyEntrance(sprite, entrance) {
        switch (entrance.type) {
            case 'fade':
                sprite.setAlpha(0);
                this.tweens.add({
                    targets: sprite,
                    alpha: entrance.targetAlpha || 1,
                    duration: entrance.duration || 500,
                    ease: entrance.easing || 'Linear'
                });
                break;

            case 'slide':
                const startX = sprite.x + (entrance.offsetX || 0);
                const startY = sprite.y + (entrance.offsetY || 0);
                sprite.setPosition(startX, startY);
                this.tweens.add({
                    targets: sprite,
                    x: sprite.x - (entrance.offsetX || 0),
                    y: sprite.y - (entrance.offsetY || 0),
                    duration: entrance.duration || 500,
                    ease: entrance.easing || 'Cubic.easeOut'
                });
                break;

            case 'zoom':
                sprite.setScale(entrance.startScale || 0);
                this.tweens.add({
                    targets: sprite,
                    scaleX: entrance.targetScaleX || 1,
                    scaleY: entrance.targetScaleY || 1,
                    duration: entrance.duration || 500,
                    ease: entrance.easing || 'Back.easeOut'
                });
                break;
        }
    }

    showDialogue(keyframe) {
        this.currentDialogue = keyframe;
        this.textContainer.setVisible(true);

        // Set speaker name
        if (keyframe.speaker) {
            this.speakerText.setText(keyframe.speaker);
            this.speakerText.setVisible(true);
        } else {
            this.speakerText.setVisible(false);
        }

        // Start typewriter effect
        this.startTypewriter(keyframe.text, keyframe.speed || 50);

        // Pause playback if specified
        if (keyframe.pausePlayback !== false) {
            this.pause();
        }
    }

    showText(keyframe) {
        const layer = this.layers.get('ui');

        const text = this.add.text(
            keyframe.x || this.cameras.main.width / 2,
            keyframe.y || this.cameras.main.height / 2,
            keyframe.text,
            {
                fontFamily: keyframe.fontFamily || 'Arial',
                fontSize: keyframe.fontSize || '32px',
                color: keyframe.color || '#ffffff',
                align: keyframe.align || 'center',
                wordWrap: keyframe.wordWrap
            }
        ).setOrigin(keyframe.originX || 0.5, keyframe.originY || 0.5);

        layer.elements.set(keyframe.id || `text_${Date.now()}`, text);
        layer.container.add(text);

        if (keyframe.entrance) {
            this.applyEntrance(text, keyframe.entrance);
        }
    }

    startTypewriter(text, speed) {
        this.typewriterActive = true;
        this.dialogueText.setText('');

        let index = 0;
        const timer = this.time.addEvent({
            delay: speed,
            callback: () => {
                if (index < text.length) {
                    this.dialogueText.setText(text.substring(0, index + 1));
                    index++;
                } else {
                    timer.destroy();
                    this.typewriterActive = false;
                }
            },
            loop: true
        });

        this.currentTypewriterTimer = timer;
    }

    completeTypewriter() {
        if (this.currentTypewriterTimer) {
            this.currentTypewriterTimer.destroy();
            this.currentTypewriterTimer = null;
        }

        if (this.currentDialogue) {
            this.dialogueText.setText(this.currentDialogue.text);
        }

        this.typewriterActive = false;
    }

    advanceDialogue() {
        this.textContainer.setVisible(false);
        this.currentDialogue = null;

        // Resume playback if it was paused
        if (this.isPaused) {
            this.resume();
        }
    }

    showChoices(keyframe) {
        this.pause();

        this.currentChoices = keyframe.choices;
        this.choiceContainer.removeAll(true);
        this.choiceContainer.setVisible(true);

        const startY = this.cameras.main.height / 2 - (keyframe.choices.length * 60) / 2;

        keyframe.choices.forEach((choice, index) => {
            const y = startY + index * 60;

            const bg = this.add.rectangle(
                this.cameras.main.width / 2,
                y,
                600,
                50,
                0x333333
            ).setInteractive();

            const text = this.add.text(
                this.cameras.main.width / 2,
                y,
                choice.text,
                {
                    fontFamily: 'Arial',
                    fontSize: '20px',
                    color: '#ffffff'
                }
            ).setOrigin(0.5, 0.5);

            bg.on('pointerover', () => {
                bg.setFillStyle(0x555555);
            });

            bg.on('pointerout', () => {
                bg.setFillStyle(0x333333);
            });

            bg.on('pointerdown', () => {
                this.selectChoice(choice);
            });

            this.choiceContainer.add([bg, text]);
        });
    }

    selectChoice(choice) {
        console.log('[CinematicPlayer] Choice selected:', choice);

        this.choiceContainer.setVisible(false);
        this.currentChoices = null;

        // Trigger callback
        if (this.onChoice) {
            this.onChoice(choice);
        }

        // Handle choice effects
        if (choice.nextCinematic) {
            this.loadCinematic(choice.nextCinematic).then(() => {
                this.restart();
            });
        } else if (choice.event) {
            this.triggerEvent({ event: choice.event, data: choice.data });
        }

        this.resume();
    }

    playAudio(keyframe) {
        const audio = this.sound.add(keyframe.audio);

        audio.play({
            volume: keyframe.volume || 1,
            loop: keyframe.loop || false
        });

        this.audioTracks.set(keyframe.id || keyframe.audio, audio);
    }

    playMusic(musicKey) {
        if (this.currentMusic) {
            this.currentMusic.stop();
        }

        this.currentMusic = this.sound.add(musicKey);
        this.currentMusic.play({
            volume: 0.7,
            loop: true
        });
    }

    applyCameraEffect(keyframe) {
        const camera = this.cameras.main;

        if (keyframe.effect === 'shake') {
            camera.shake(
                keyframe.duration || 500,
                keyframe.intensity || 0.01
            );
        } else if (keyframe.effect === 'fade') {
            camera.fadeIn(keyframe.duration || 1000, 0, 0, 0);
        } else if (keyframe.effect === 'flash') {
            camera.flash(keyframe.duration || 500);
        } else if (keyframe.effect === 'pan') {
            this.tweens.add({
                targets: camera,
                scrollX: keyframe.x || 0,
                scrollY: keyframe.y || 0,
                duration: keyframe.duration || 1000,
                ease: keyframe.easing || 'Cubic.easeInOut'
            });
        } else if (keyframe.effect === 'zoom') {
            this.tweens.add({
                targets: camera,
                zoom: keyframe.zoom || 1,
                duration: keyframe.duration || 1000,
                ease: keyframe.easing || 'Cubic.easeInOut'
            });
        }
    }

    updateCameraAnimation(keyframe, progress) {
        // Continuous camera updates
    }

    triggerEvent(keyframe) {
        console.log('[CinematicPlayer] Event triggered:', keyframe.event);

        if (this.onEvent) {
            this.onEvent(keyframe.event, keyframe.data);
        }

        // Handle built-in events
        if (keyframe.event === 'exit') {
            this.exitToScene(keyframe.data?.scene || 'MenuScene');
        }
    }

    evaluateTimeline() {
        // Rebuild scene state at current time
        this.clearAllLayers();

        // TODO: Implement full timeline evaluation
    }

    clearAllLayers() {
        this.layers.forEach(layer => {
            layer.elements.forEach(element => element.destroy());
            layer.elements.clear();
        });
    }

    getEasingFunction(easingName) {
        const easings = {
            'linear': t => t,
            'easeIn': t => t * t,
            'easeOut': t => t * (2 - t),
            'easeInOut': t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
        };

        return easings[easingName] || easings.linear;
    }

    complete() {
        console.log('[CinematicPlayer] Cinematic complete');

        this.stop();

        if (this.onComplete) {
            this.onComplete();
        }

        // Exit to next scene
        if (this.timeline.nextScene) {
            this.exitToScene(this.timeline.nextScene);
        } else {
            this.exitToScene('MenuScene');
        }
    }

    exitToScene(sceneName) {
        this.stop();
        this.scene.start(sceneName);
    }
}
