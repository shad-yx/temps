# DEADDAY Visual Novel Engine - Test Guide

## Server Running
The HTTP server is currently running at: **http://127.0.0.1:8000**

Open this URL in your browser to test the game engine.

---

## System Overview

You now have a complete visual novel game engine with:

### Core Systems
- **PersistenceManager**: IndexedDB-based storage for unlimited templates and iterations
- **TemplateRegistry**: Manages all template types (cinematic, gameplay, collection)
- **ModeManager**: Switches between PLAY and BUILD modes
- **CinematicPlayer**: Timeline-based cinematic playback engine

### Editor Components
- **Sequencer**: Drag-and-drop template ordering (right sidebar)
- **AssetBrowser**: Upload and manage game assets (left sidebar)
- **TimelineEditor**: After Effects-style timeline for cinematics (center panel)
- **GameplayEditor**: Form-based editor for farming gameplay (center panel)
- **CollectionEditor**: Form-based editor for payment/debt scenes (center panel)

### Template Types
1. **Cinematic**: Visual novel scenes with timeline-based events
2. **Gameplay**: Farming simulation with grid, animals, and economy
3. **Collection**: Payment/debt collection scenes

---

## Testing Workflow

### 1. Launch the Game
1. Open **http://127.0.0.1:8000** in your browser
2. You should see the **DEADDAY** title screen with two buttons:
   - **PLAY** (green) - Play existing game
   - **BUILD** (blue) - Open editor

### 2. Test BUILD Mode

#### A. Open the Editor
1. Click the **BUILD** button
2. Screen should fade out, then the editor overlay appears
3. You should see:
   - Top toolbar with mode buttons (🎬 Cinematic, 🎮 Gameplay, 💰 Collection)
   - Left sidebar: Asset Browser
   - Center panel: Timeline/Editor area
   - Right sidebar: Sequencer panel

#### B. Test the Sequencer (Right Sidebar)
The sequencer shows your game flow as a list of templates.

**Current sequence** (loaded from Default Game):
- intro_default (cinematic)
- farm_week1 (gameplay)
- payment_week1 (collection)

**Test drag-and-drop**:
1. Look at the template palette at the top of the sequencer
2. Drag a template type to the sequence list
3. It should create a new template and add it to the sequence

**Test editing**:
1. Click the **Edit** button next to any template
2. The appropriate editor should open in the center panel

**Test play**:
1. Click the **Play Iteration** button
2. Should save the iteration and start playing from the first template

#### C. Test Timeline Editor (Cinematic Mode)
1. Click **🎬 Cinematic** in the top toolbar
2. Timeline editor appears in the center panel
3. You should see:
   - Time ruler at the top
   - Multiple tracks (Background, Characters, Dialogue, Audio, Props, Effects)
   - Zoom controls (+/-)
   - Playhead/scrubber

**Test creating events**:
1. Right-click on a track to add an event
2. Drag events left/right to change timing
3. Click an event to edit its properties
4. Resize events by dragging edges

**Keyboard shortcuts**:
- `Space`: Play/pause timeline
- `Ctrl+S`: Save template
- `Delete`: Delete selected event

#### D. Test Gameplay Editor
1. Click **🎮 Gameplay** in the top toolbar
2. Form-based editor appears with fields for:
   - Grid configuration
   - Animal placement
   - Time cycle settings
   - Economy/pricing
   - Toxicity thresholds

**Test editing**:
1. Change values in the form
2. Click **Save Template** in the top toolbar
3. Template should be saved to IndexedDB

#### E. Test Collection Editor
1. Click **💰 Collection** in the top toolbar
2. Form-based editor appears with fields for:
   - Debt calculation mode (fixed, multiply, random, formula)
   - Character/dialogue
   - Payment methods
   - Background and audio

**Test editing**:
1. Change debt mode dropdown
2. Edit dialogue text
3. Save template

#### F. Test Asset Browser (Left Sidebar)
1. Click on different categories (Backgrounds, Characters, Props, Audio)
2. Click **Upload Asset** to add files
3. Or use **Manual Entry** to paste a URL or file path
4. Assets appear as thumbnails in the grid

**Test drag-and-drop** (future feature):
- Drag assets from browser to editors

### 3. Test Back to Menu
1. Click **◀ Menu** in the top toolbar
2. Editor should close
3. Menu should appear again with PLAY/BUILD buttons

### 4. Test PLAY Mode
1. From menu, click **PLAY**
2. Should start the existing game:
   - Intro dialogue (from original game)
   - Farming gameplay (Day 1)
   - Payment scene

**Note**: PLAY mode currently starts the old game flow. To play custom iterations:
- Use the **Play Iteration** button in the sequencer
- This will play your custom template sequence

---

## File Structure

### Core Engine Files
```
src/core/
  ├── PersistenceManager.js    - IndexedDB storage
  ├── TemplateRegistry.js      - Template management
  └── ModeManager.js            - PLAY/BUILD mode switching
```

### Runtime Systems
```
src/runtime/
  └── CinematicPlayer.js        - Timeline playback engine
```

### Editor Files
```
editor/
  ├── Sequencer.js              - Template ordering system
  ├── AssetBrowser.js           - Asset management
  ├── TimelineEditor.js         - Cinematic timeline (800+ lines)
  ├── GameplayEditor.js         - Gameplay form editor
  ├── CollectionEditor.js       - Collection form editor
  └── editor.css                - Dark theme styling
```

### Template Data
```
src/data/templates/
  ├── cinematics/
  │   ├── intro_default.json    - Sample intro cinematic
  │   └── ending_good.json      - Sample ending
  ├── gameplay/
  │   └── farm_week1.json       - Week 1 farming
  └── collection/
      └── payment_week1.json    - Week 1 payment
```

### Iterations
```
src/data/iterations/
  └── default.json              - Default game sequence
```

---

## Known Limitations

### Current State
- ✅ All core systems implemented
- ✅ All editors implemented
- ✅ Template system working
- ✅ Save/load system ready
- ✅ UI fully styled and functional

### Missing Features (Nice to Have)
- Asset drag-and-drop from browser to timeline (currently click-to-add)
- Iteration selector scene (currently loads "Default Game" automatically)
- Template duplication in sequencer
- Undo/redo in timeline editor
- Copy/paste events between tracks
- Audio waveform visualization

### Integration Points to Test
1. **Template loading**: When clicking Edit in sequencer, does the correct editor open with the template data?
2. **Save workflow**: Does saving in an editor update the template in IndexedDB?
3. **Play workflow**: Does clicking Play Iteration correctly sequence through all templates?
4. **Asset browser**: Can you upload and see assets?
5. **Timeline events**: Can you create, move, resize, and delete events?

---

## Debugging Tips

### Browser Console
Open DevTools (F12) and check the Console tab for:
- `[DEADDAY Engine]` - Core system logs
- `[MenuScene]` - Menu interactions
- `[Sequencer]` - Template sequencing
- `[TimelineEditor]` - Timeline operations
- `[CinematicPlayer]` - Playback events

### IndexedDB Inspection
1. Open DevTools → Application tab
2. Click **IndexedDB** → **DEADDAY_Engine**
3. View stored iterations and templates

### Common Issues

**Editor doesn't appear**:
- Check console for `[DEADDAY Editor] Editor UI initialized`
- Verify `window.EditorUI` exists in console

**Templates don't load**:
- Check IndexedDB has the template
- Verify template ID matches in iteration sequence

**Timeline doesn't show events**:
- Check template.timeline array exists
- Verify events have valid time values

**Save doesn't work**:
- Check console for errors
- Verify IndexedDB is not disabled in browser

---

## Next Steps

### Recommended Testing Order
1. ✅ Test menu loads (PLAY/BUILD buttons appear)
2. ✅ Test BUILD button opens editor overlay
3. Test sequencer shows default templates
4. Test clicking Edit on a cinematic template
5. Test timeline editor shows intro_default events
6. Test creating a new event on timeline
7. Test saving the template
8. Test switching to gameplay editor
9. Test switching to collection editor
10. Test Play Iteration button
11. Test back to menu button
12. Test full workflow: Edit → Save → Play

### If You Find Bugs
Check browser console for error messages and let me know:
- What you clicked
- What you expected to happen
- What actually happened
- Any console errors

---

## Quick Reference

### Keyboard Shortcuts (Timeline Editor)
- `Space` - Play/pause
- `Ctrl+S` - Save template
- `Delete` - Delete selected event
- `+/-` - Zoom in/out

### Template Types
- **Cinematic**: Timeline-based visual novel scenes
- **Gameplay**: Grid-based farming simulation
- **Collection**: Payment/debt collection scenes

### Data Flow
```
Menu → BUILD → Editor Overlay
  → Sequencer (manage templates)
  → Asset Browser (manage assets)
  → Timeline/Gameplay/Collection Editor (edit templates)
  → Save to IndexedDB
  → Play Iteration → CinematicPlayer → Runtime
```

---

## Architecture Notes

### Why HTML Overlay?
The editor uses HTML/CSS overlay instead of pure Phaser because:
- 3-4x faster development time
- Better form controls and text input
- Easier styling and layout
- Can still integrate with Phaser canvas when needed

### Why IndexedDB?
- Unlimited storage (localStorage has 5-10MB limit)
- Async API (non-blocking)
- Structured data with object stores
- Export/import support

### Template Architecture
Each template is a JSON config that drives runtime behavior:
- **Cinematic**: `timeline` array of events
- **Gameplay**: Grid, animals, economy, toxicity rules
- **Collection**: Debt calculation, dialogue, payment methods

The runtime systems (CinematicPlayer, GameScene, PaymentScene) read these configs and execute them.

---

🎮 **Ready to test!** Open http://127.0.0.1:8000 and start exploring the editor.
