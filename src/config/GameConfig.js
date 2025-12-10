/**
 * GameConfig.js
 * Centralized configuration for HAYDAY game
 * All constants and game balance values
 */

export const GameConfig = {
  // Grid Configuration
  GRID: {
    ROWS: 4,
    COLS: 4,
    TILE_WIDTH: 100,      // Isometric tile width
    TILE_HEIGHT: 50,      // Isometric tile height
    TILE_DEPTH: 20,       // Visual depth for 3D effect
    ORIGIN_X: 650,        // Grid center X position (moved right to center)
    ORIGIN_Y: 300,        // Grid center Y position (moved down slightly)
  },

  // Timing Configuration
  TIMING: {
    DAY_DURATION: 60,           // seconds per day (OLD - kept for compatibility)
    TRUCK_VISIT_INTERVAL: 10000, // milliseconds (10 seconds per truck visit)
    VISITS_PER_WEEK: 7,         // 7 truck visits = 1 week
    NORMAL_GROW_TIME: 5000,     // milliseconds (5 seconds)
    SERUM_GROW_TIME: 500,       // milliseconds (0.5 seconds)
  },

  // Toxicity Configuration
  TOXICITY: {
    PER_SERUM: 2,          // Toxicity added per serum use
    HEALTHY_MAX: 3,        // 0-3: Healthy
    SICK_MAX: 7,           // 4-7: Sick
    DEAD_MIN: 8,           // 8-10: Dead
    MAX: 10,               // Maximum toxicity value
  },

  // Economy Configuration
  ECONOMY: {
    STARTING_CASH: 0,
    DEBT_CURVE: [0, 100, 250, 650, 2500, 10000],  // Debt per day (index = day)
    PRICES: {
      CROP_HEALTHY: 10,
      CROP_SICK: 2,
      DOG: 500,
      FENCE: 15,
      PLAYER_SELF: 999999,
      // Animal products
      EGG: 15,
      MILK: 25,
      WOOL: 20,
      // Animals (sell price)
      CHICKEN: 100,
      COW: 200,
      SHEEP: 150,
    },
  },

  // Animal Configuration
  ANIMALS: {
    CHICKEN: {
      type: 'CHICKEN',
      productType: 'EGG',
      productionTime: 8000,   // 8 seconds (faster for testing)
      productValue: 20,       // Increased value
      maxProducts: 5,         // More products allowed
      color: 0xFFFFFF,        // White
      sellValue: 150,         // Higher sell price
    },
    COW: {
      type: 'COW',
      productType: 'MILK',
      productionTime: 10000,  // 10 seconds
      productValue: 35,       // Increased value
      maxProducts: 5,
      color: 0x8B4513,        // Brown
      sellValue: 250,
    },
    SHEEP: {
      type: 'SHEEP',
      productType: 'WOOL',
      productionTime: 9000,   // 9 seconds
      productValue: 30,       // Increased value
      maxProducts: 5,
      color: 0xE0E0E0,        // Light grey
      sellValue: 200,
    },
  },

  // Colors (Placeholder Graphics)
  COLORS: {
    // Tile colors based on toxicity
    TILE_HEALTHY: 0x8B4513,      // Brown (healthy soil)
    TILE_SICK: 0xCCCC00,         // Yellow (sick soil)
    TILE_DEAD: 0x808080,         // Grey (dead soil)

    // Tile depth shading (darker versions)
    TILE_HEALTHY_DARK: 0x5C2E0A,
    TILE_SICK_DARK: 0x999900,
    TILE_DEAD_DARK: 0x4A4A4A,

    // Entity colors
    SEED: 0xFFFF00,              // Yellow
    CROP_HEALTHY: 0x00FF00,      // Green
    CROP_SICK: 0xAAAA00,         // Dim yellow-green

    // UI colors
    TRUCK: 0xFF0000,             // Red
    DOG: 0x8B4513,               // Brown

    // Mode colors
    WATER_MODE: 0xFFFFFF,        // White
    SERUM_MODE: 0xFF0000,        // Red

    // Screen effects
    TOXICITY_TINT: 0x00FF00,     // Green tint
  },

  // Tile States
  TILE_STATE: {
    EMPTY: 'EMPTY',
    PLANTED: 'PLANTED',
    RIPE: 'RIPE',
    DEAD: 'DEAD',
  },

  // Growth Modes
  MODE: {
    WATER: 'WATER',
    SERUM: 'SERUM',
  },

  // Screen Dimensions
  SCREEN: {
    WIDTH: 1280,
    HEIGHT: 720,
  },

  // UI Positions
  UI: {
    HUD_Y: 30,                    // Top bar Y position
    HUD_PADDING: 20,              // Padding from edges
    TOGGLE_Y: 680,                // Mode toggle Y position
    TRUCK_X: 150,                 // Truck zone X position (LEFT side)
    TRUCK_Y: 300,                 // Truck zone Y position
    TRUCK_WIDTH: 180,             // Truck zone width
    TRUCK_HEIGHT: 300,            // Truck zone height
    DOG_X: 100,                   // Dog starting X position
    DOG_Y: 600,                   // Dog starting Y position
  },

  // Text Styles
  TEXT_STYLES: {
    HUD: {
      fontSize: '28px',
      fontFamily: 'Georgia, serif',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 4,
      fontStyle: 'bold',
    },
    HUD_LARGE: {
      fontSize: '32px',
      fontFamily: 'Georgia, serif',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 4,
      fontStyle: 'bold',
    },
    BUTTON: {
      fontSize: '24px',
      fontFamily: 'Georgia, serif',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 3,
      fontStyle: 'bold',
    },
    GAME_OVER: {
      fontSize: '96px',
      fontFamily: 'Georgia, serif',
      color: '#FF0000',
      stroke: '#8B0000',
      strokeThickness: 8,
      fontStyle: 'bold',
    },
    GAME_OVER_SMALL: {
      fontSize: '36px',
      fontFamily: 'Georgia, serif',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 4,
    },
    TOOLTIP: {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      backgroundColor: '#000000CC',
      padding: { x: 10, y: 5 },
    },
    PRICE: {
      fontSize: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 4,
      fontStyle: 'bold',
    },
  },
};
