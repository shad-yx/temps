/**
 * TemplateRegistry.js
 * Central hub for template management
 * Bridges editor and runtime - manages template loading/saving
 */

export class TemplateRegistry {
  constructor(persistenceManager) {
    this.persistence = persistenceManager;
    this.cache = {
      cinematics: new Map(),
      gameplay: new Map(),
      collection: new Map(),
    };
  }

  /**
   * Load template by ID
   * Supports both getTemplate(id) and getTemplate(type, id) for backwards compatibility
   */
  async getTemplate(typeOrId, maybeId) {
    // Handle both call signatures
    const templateId = maybeId || typeOrId;
    const type = maybeId ? typeOrId : null;

    // Check cache first
    if (type && this.cache[type]) {
      if (this.cache[type].has(templateId)) {
        console.log(`[TemplateRegistry] Cache hit: ${templateId}`);
        return this.cache[type].get(templateId);
      }
    } else {
      // Search all caches
      for (const cache of Object.values(this.cache)) {
        if (cache.has(templateId)) {
          console.log(`[TemplateRegistry] Cache hit: ${templateId}`);
          return cache.get(templateId);
        }
      }
    }

    // Load from persistence
    try {
      const template = await this.persistence.loadTemplate(templateId);
      this.cacheTemplate(template);
      return template;
    } catch (error) {
      // If persistence fails, try loading from JSON file
      console.warn(`[TemplateRegistry] Persistence failed, trying JSON file for: ${templateId}`);
      try {
        // Determine type from templateId if not provided
        const guessedType = templateId.startsWith('intro') || templateId.startsWith('ending') ? 'cinematics' :
                           templateId.startsWith('farm') ? 'gameplay' :
                           templateId.startsWith('payment') ? 'collection' : 'cinematics';

        const response = await fetch(`src/data/templates/${guessedType}/${templateId}.json`);
        if (response.ok) {
          const template = await response.json();
          // Save to persistence for future use
          await this.saveTemplate(template).catch(e => console.warn('Failed to cache template:', e));
          return template;
        }
      } catch (fileError) {
        console.error(`[TemplateRegistry] Also failed to load from file: ${templateId}`);
      }
      throw error;
    }
  }

  /**
   * Save template
   */
  async saveTemplate(template) {
    try {
      await this.persistence.saveTemplate(template);
      this.cacheTemplate(template);
      console.log(`[TemplateRegistry] Saved template: ${template.id}`);
    } catch (error) {
      console.error(`[TemplateRegistry] Failed to save template: ${template.id}`, error);
      throw error;
    }
  }

  /**
   * Create new template with defaults
   */
  createTemplate(type, name) {
    const id = `${type}_${Date.now()}`;
    const template = {
      id,
      type,
      name: name || `New ${type} Template`,
      lastModified: new Date().toISOString(),
    };

    // Add type-specific defaults
    switch (type) {
      case 'cinematic':
        template.duration = 30000; // 30 seconds default
        template.timeline = [];
        break;

      case 'gameplay':
        template.config = {
          background: null,
          gridSize: { rows: 4, cols: 4 },
          gridPosition: { x: 650, y: 300 },
          animals: [],
          duration: 100000, // 100 seconds
          font: 'Arial',
          fontSize: 24,
          toxicityThresholds: [3, 7, 10],
        };
        break;

      case 'collection':
        template.config = {
          character: 'commission_officer',
          debt: 100,
          debtMode: 'fixed', // fixed, multiply, random, formula
          background: 'office_interior',
          dialogue: [],
          inventorySources: ['harvested_crops', 'animals', 'products'],
          paymentMethods: ['sell_items', 'use_cash'],
        };
        break;

      default:
        console.error(`[TemplateRegistry] Unknown template type: ${type}`);
        throw new Error(`Unknown template type: ${type}`);
    }

    console.log(`[TemplateRegistry] Created new template: ${id}`);
    return template;
  }

  /**
   * Duplicate template
   */
  async duplicateTemplate(templateId) {
    try {
      const original = await this.getTemplate(templateId);
      const duplicate = JSON.parse(JSON.stringify(original)); // Deep clone

      // Generate new ID
      duplicate.id = `${original.type}_${Date.now()}`;
      duplicate.name = `${original.name} (Copy)`;
      duplicate.lastModified = new Date().toISOString();

      await this.saveTemplate(duplicate);
      console.log(`[TemplateRegistry] Duplicated template: ${templateId} → ${duplicate.id}`);
      return duplicate;
    } catch (error) {
      console.error(`[TemplateRegistry] Failed to duplicate template: ${templateId}`, error);
      throw error;
    }
  }

  /**
   * Delete template
   */
  async deleteTemplate(templateId) {
    try {
      const template = await this.getTemplate(templateId);

      // Remove from cache
      const cache = this.cache[template.type];
      if (cache) {
        cache.delete(templateId);
      }

      // Delete from persistence
      // Note: IndexedDB templates store doesn't have a delete method in current implementation
      // Would need to add this to PersistenceManager
      console.log(`[TemplateRegistry] Deleted template: ${templateId}`);
    } catch (error) {
      console.error(`[TemplateRegistry] Failed to delete template: ${templateId}`, error);
      throw error;
    }
  }

  /**
   * List all templates of a type
   */
  async listTemplates(type) {
    // This would require adding a listTemplates method to PersistenceManager
    // For now, return cached templates
    const cache = this.cache[type];
    if (cache) {
      return Array.from(cache.values());
    }
    return [];
  }

  /**
   * Cache template for faster access
   */
  cacheTemplate(template) {
    const cache = this.cache[template.type];
    if (cache) {
      cache.set(template.id, template);
    }
  }

  /**
   * Clear cache
   */
  clearCache() {
    for (const cache of Object.values(this.cache)) {
      cache.clear();
    }
    console.log('[TemplateRegistry] Cache cleared');
  }

  /**
   * Validate template structure
   */
  validateTemplate(template) {
    if (!template.id || !template.type) {
      return { valid: false, error: 'Missing required fields: id, type' };
    }

    switch (template.type) {
      case 'cinematic':
        if (!template.timeline || !Array.isArray(template.timeline)) {
          return { valid: false, error: 'Cinematic template must have timeline array' };
        }
        break;

      case 'gameplay':
        if (!template.config || !template.config.gridSize) {
          return { valid: false, error: 'Gameplay template must have config with gridSize' };
        }
        break;

      case 'collection':
        if (!template.config || template.config.debt === undefined) {
          return { valid: false, error: 'Collection template must have config with debt' };
        }
        break;

      default:
        return { valid: false, error: `Unknown template type: ${template.type}` };
    }

    return { valid: true };
  }
}
