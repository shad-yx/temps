/**
 * AssetBrowser.js
 * Asset management with thumbnails and drag-drop
 */

export class AssetBrowser {
  constructor() {
    this.assets = {
      backgrounds: [],
      characters: [],
      props: [],
      audio: []
    };
    this.currentCategory = 'backgrounds';
  }

  /**
   * Initialize asset browser
   */
  init() {
    this.container = document.getElementById('asset-browser');
    if (!this.container) {
      console.error('[AssetBrowser] Container not found');
      return;
    }

    this.render();
  }

  /**
   * Render asset browser UI
   */
  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="asset-browser-header">
        <h3>Assets</h3>
        <button id="upload-asset-btn" class="btn btn-sm">📤 Upload</button>
      </div>

      <div class="asset-categories">
        <button class="category-btn ${this.currentCategory === 'backgrounds' ? 'active' : ''}"
                data-category="backgrounds">🏞️ Backgrounds</button>
        <button class="category-btn ${this.currentCategory === 'characters' ? 'active' : ''}"
                data-category="characters">👤 Characters</button>
        <button class="category-btn ${this.currentCategory === 'props' ? 'active' : ''}"
                data-category="props">📦 Props</button>
        <button class="category-btn ${this.currentCategory === 'audio' ? 'active' : ''}"
                data-category="audio">🔊 Audio</button>
      </div>

      <div class="asset-search">
        <input type="text" id="asset-search-input" placeholder="Search or paste path..." />
      </div>

      <div class="asset-grid">
        ${this.renderAssets()}
      </div>

      <input type="file" id="asset-upload-input" accept="image/*,audio/*" multiple style="display:none" />
    `;

    this.attachEventListeners();
  }

  /**
   * Render asset grid
   */
  renderAssets() {
    const categoryAssets = this.assets[this.currentCategory] || [];

    if (categoryAssets.length === 0) {
      return `
        <div class="empty-assets">
          <p>No ${this.currentCategory} yet</p>
          <p>Upload files or paste asset paths</p>
        </div>
      `;
    }

    return categoryAssets.map(asset => `
      <div class="asset-item" draggable="true" data-path="${asset.path}">
        <div class="asset-thumbnail">
          ${asset.type === 'image' ?
            `<img src="${asset.path}" alt="${asset.name}" />` :
            `<div class="audio-icon">🔊</div>`
          }
        </div>
        <div class="asset-name">${asset.name}</div>
      </div>
    `).join('');
  }

  /**
   * Add asset manually (paste path)
   */
  addAsset(path, category) {
    const name = path.split('/').pop();
    const type = this.getAssetType(path);

    const asset = { path, name, type };

    if (!this.assets[category]) {
      this.assets[category] = [];
    }

    // Check if already exists
    if (this.assets[category].some(a => a.path === path)) {
      console.log('[AssetBrowser] Asset already exists:', path);
      return;
    }

    this.assets[category].push(asset);
    this.render();

    console.log(`[AssetBrowser] Added asset to ${category}:`, path);
  }

  /**
   * Upload assets
   */
  uploadAssets(files) {
    for (const file of files) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const path = e.target.result; // Data URL
        const category = this.getCategory(file.type);
        this.addAsset(path, category);
      };

      reader.readAsDataURL(file);
    }
  }

  /**
   * Get category from MIME type
   */
  getCategory(mimeType) {
    if (mimeType.startsWith('image/')) {
      return 'backgrounds'; // Default, user can recategorize
    } else if (mimeType.startsWith('audio/')) {
      return 'audio';
    }
    return 'props';
  }

  /**
   * Get asset type from path
   */
  getAssetType(path) {
    const ext = path.split('.').pop().toLowerCase();
    const imageExts = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
    const audioExts = ['mp3', 'wav', 'ogg'];

    if (imageExts.includes(ext)) return 'image';
    if (audioExts.includes(ext)) return 'audio';
    return 'unknown';
  }

  /**
   * Switch category
   */
  switchCategory(category) {
    this.currentCategory = category;
    this.render();
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Upload button
    const uploadBtn = document.getElementById('upload-asset-btn');
    const uploadInput = document.getElementById('asset-upload-input');

    if (uploadBtn && uploadInput) {
      uploadBtn.addEventListener('click', () => {
        uploadInput.click();
      });

      uploadInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          this.uploadAssets(e.target.files);
        }
      });
    }

    // Category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchCategory(e.target.dataset.category);
      });
    });

    // Search input - manual path entry
    const searchInput = document.getElementById('asset-search-input');
    if (searchInput) {
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const path = e.target.value.trim();
          if (path) {
            this.addAsset(path, this.currentCategory);
            e.target.value = '';
          }
        }
      });
    }

    // Make assets draggable
    document.querySelectorAll('.asset-item').forEach(item => {
      item.addEventListener('dragstart', (e) => {
        const path = e.target.closest('.asset-item').dataset.path;
        e.dataTransfer.setData('assetPath', path);
        e.dataTransfer.effectAllowed = 'copy';
        console.log('[AssetBrowser] Dragging asset:', path);
      });
    });
  }

  /**
   * Get all assets
   */
  getAllAssets() {
    return this.assets;
  }

  /**
   * Search assets
   */
  searchAssets(query) {
    // TODO: Implement search filtering
    console.log('[AssetBrowser] Search:', query);
  }
}
