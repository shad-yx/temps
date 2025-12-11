/**
 * PersistenceManager.js
 * Handles save/load of iterations and templates using IndexedDB
 * Provides unlimited storage for game projects
 */

export class PersistenceManager {
  constructor() {
    this.dbName = 'DEADDAY_Engine';
    this.dbVersion = 1;
    this.db = null;
  }

  /**
   * Initialize IndexedDB
   */
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('[PersistenceManager] Failed to open IndexedDB');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('[PersistenceManager] IndexedDB initialized');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create object stores (tables)
        if (!db.objectStoreNames.contains('iterations')) {
          db.createObjectStore('iterations', { keyPath: 'name' });
        }

        if (!db.objectStoreNames.contains('templates')) {
          db.createObjectStore('templates', { keyPath: 'id' });
        }

        console.log('[PersistenceManager] Database structure created');
      };
    });
  }

  /**
   * Save iteration (complete game project)
   */
  async saveIteration(iteration) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['iterations'], 'readwrite');
      const store = transaction.objectStore('iterations');

      // Add timestamp
      iteration.lastModified = new Date().toISOString();

      const request = store.put(iteration);

      request.onsuccess = () => {
        console.log(`[PersistenceManager] Saved iteration: ${iteration.name}`);
        resolve();
      };

      request.onerror = () => {
        console.error(`[PersistenceManager] Failed to save iteration: ${iteration.name}`);
        reject(request.error);
      };
    });
  }

  /**
   * Load iteration by name
   */
  async loadIteration(name) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['iterations'], 'readonly');
      const store = transaction.objectStore('iterations');
      const request = store.get(name);

      request.onsuccess = () => {
        if (request.result) {
          console.log(`[PersistenceManager] Loaded iteration: ${name}`);
          resolve(request.result);
        } else {
          reject(new Error(`Iteration not found: ${name}`));
        }
      };

      request.onerror = () => {
        console.error(`[PersistenceManager] Failed to load iteration: ${name}`);
        reject(request.error);
      };
    });
  }

  /**
   * Get list of all saved iterations
   */
  async listIterations() {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['iterations'], 'readonly');
      const store = transaction.objectStore('iterations');
      const request = store.getAll();

      request.onsuccess = () => {
        const iterations = request.result || [];
        console.log(`[PersistenceManager] Found ${iterations.length} iterations`);
        resolve(iterations);
      };

      request.onerror = () => {
        console.error('[PersistenceManager] Failed to list iterations');
        reject(request.error);
      };
    });
  }

  /**
   * Delete iteration
   */
  async deleteIteration(name) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['iterations'], 'readwrite');
      const store = transaction.objectStore('iterations');
      const request = store.delete(name);

      request.onsuccess = () => {
        console.log(`[PersistenceManager] Deleted iteration: ${name}`);
        resolve();
      };

      request.onerror = () => {
        console.error(`[PersistenceManager] Failed to delete iteration: ${name}`);
        reject(request.error);
      };
    });
  }

  /**
   * Save template (cinematic/gameplay/collection config)
   */
  async saveTemplate(template) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['templates'], 'readwrite');
      const store = transaction.objectStore('templates');

      // Add timestamp
      template.lastModified = new Date().toISOString();

      const request = store.put(template);

      request.onsuccess = () => {
        console.log(`[PersistenceManager] Saved template: ${template.id}`);
        resolve();
      };

      request.onerror = () => {
        console.error(`[PersistenceManager] Failed to save template: ${template.id}`);
        reject(request.error);
      };
    });
  }

  /**
   * Load template by ID
   */
  async loadTemplate(id) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['templates'], 'readonly');
      const store = transaction.objectStore('templates');
      const request = store.get(id);

      request.onsuccess = () => {
        if (request.result) {
          console.log(`[PersistenceManager] Loaded template: ${id}`);
          resolve(request.result);
        } else {
          reject(new Error(`Template not found: ${id}`));
        }
      };

      request.onerror = () => {
        console.error(`[PersistenceManager] Failed to load template: ${id}`);
        reject(request.error);
      };
    });
  }

  /**
   * Export iteration as JSON (for sharing/backup)
   */
  async exportIteration(name) {
    try {
      const iteration = await this.loadIteration(name);
      const json = JSON.stringify(iteration, null, 2);

      // Create download link
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}.json`;
      a.click();
      URL.revokeObjectURL(url);

      console.log(`[PersistenceManager] Exported iteration: ${name}`);
    } catch (error) {
      console.error(`[PersistenceManager] Export failed:`, error);
      throw error;
    }
  }

  /**
   * Import iteration from JSON file
   */
  async importIteration(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const iteration = JSON.parse(e.target.result);
          await this.saveIteration(iteration);
          console.log(`[PersistenceManager] Imported iteration: ${iteration.name}`);
          resolve(iteration);
        } catch (error) {
          console.error('[PersistenceManager] Import failed:', error);
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  }

  /**
   * Clear all data (dangerous!)
   */
  async clearAll() {
    if (!confirm('Are you sure you want to delete ALL iterations and templates?')) {
      return;
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['iterations', 'templates'], 'readwrite');

      const iterationsStore = transaction.objectStore('iterations');
      const templatesStore = transaction.objectStore('templates');

      iterationsStore.clear();
      templatesStore.clear();

      transaction.oncomplete = () => {
        console.log('[PersistenceManager] All data cleared');
        resolve();
      };

      transaction.onerror = () => {
        console.error('[PersistenceManager] Failed to clear data');
        reject(transaction.error);
      };
    });
  }
}
