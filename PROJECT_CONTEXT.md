# Project Context - DEADDAY

*Last Updated: 2025-12-08*

---

## Project Description

**DEADDAY** is a [describe your game genre and core concept here - e.g., "top-down zombie survival roguelike" or "2D platformer with time manipulation mechanics"].

**Current Status**: Initial setup phase

**Technology Stack**:
- Phaser 3.x (game framework)
- JavaScript/TypeScript
- [Additional tools/libraries as needed]

---

## What Exists

### Files/Structure
```
DEADDAY/
├── Documentation (newly created)
│   ├── RULES.md
│   ├── PROJECT_CONTEXT.md (this file)
│   ├── DONT_DO.md
│   ├── PROGRESS_LOG.md
│   └── README.md
└── [List other existing files/directories]
```

### Features Implemented
*Nothing yet - project just starting*

- [ ] Basic Phaser setup
- [ ] First scene
- [ ] Player character
- [ ] [Add features as they're built]

---

## What Doesn't Exist Yet

### Core Systems Needed
- [ ] Game initialization and configuration
- [ ] Scene management (Menu, Game, GameOver, etc.)
- [ ] Player character with controls
- [ ] Core gameplay mechanics
- [ ] Enemy/obstacle system
- [ ] Scoring/progression system
- [ ] Audio system
- [ ] Asset loading and management

### Features Planned
*Document planned features here as they're discussed*

---

## Key Decisions Made

### [Decision Date: 2025-12-08]
**Topic**: Development Environment Setup
**Decision**: Implemented comprehensive documentation structure with RULES.md, PROJECT_CONTEXT.md, DONT_DO.md, and PROGRESS_LOG.md
**Reasoning**: Maintain project context across sessions, track progress, and avoid repeating mistakes
**Alternatives Considered**: Minimal documentation approach (rejected for long-term maintainability)

---

## Core Mechanics / Architecture

### Game Architecture
*To be defined - document as you build*

**Planned Scenes**:
- [ ] BootScene - Initial asset loading
- [ ] MenuScene - Main menu
- [ ] GameScene - Core gameplay
- [ ] UIScene - Persistent UI overlay
- [ ] GameOverScene - End screen

### Core Systems
*Document architecture decisions here*

**Player System**:
- [ ] Movement mechanics: [describe]
- [ ] Combat/interaction: [describe]
- [ ] Health/inventory: [describe]

**Enemy/Challenge System**:
- [ ] [Describe enemy AI, spawning, behavior]

**Progression System**:
- [ ] [Describe scoring, upgrades, difficulty scaling]

---

## File Structure

### Current Structure
```
DEADDAY/
├── .claude/
│   ├── commands/        # Slash commands
│   └── settings.local.json
├── src/
│   ├── scenes/          # Phaser scenes
│   ├── entities/        # Game objects
│   ├── systems/         # Game systems
│   ├── ui/              # UI components
│   ├── utils/           # Helpers and constants
│   ├── config/          # Configuration
│   └── main.js          # Entry point
├── assets/
│   ├── images/
│   ├── sprites/
│   ├── audio/
│   └── data/
├── tests/
├── public/              # Static files
├── RULES.md
├── PROJECT_CONTEXT.md
├── DONT_DO.md
├── PROGRESS_LOG.md
├── README.md
├── package.json
└── [build configs]
```

---

## Development Workflow

### Session Start Protocol
1. Run `/start-session` to load all documentation context
2. Review PROGRESS_LOG.md for last session's work
3. Check DONT_DO.md for critical reminders
4. Identify session goal from "Next Session Goals" or new user request

### Before Coding
1. Check DONT_DO.md for relevant warnings
2. Review RULES.md for applicable standards
3. If uncertain about approach, check PROJECT_CONTEXT.md for established patterns
4. Write tests first when implementing new features (TDD)

### During Coding
1. Follow RULES.md conventions strictly
2. Commit frequently with proper messages
3. Test after each meaningful change
4. Document decisions in code comments
5. Update documentation if structure/architecture changes

### Before Committing
1. Run `/check-before-commit` command
2. Review all changes with git diff
3. Run tests and verify they pass
4. Check for debug code or console.logs
5. Verify commit message follows format
6. Ensure no sensitive data in commit

### Session End Protocol
1. Run `/end-session` command
2. Update PROGRESS_LOG.md with session entry
3. Update PROJECT_CONTEXT.md if anything structural changed
4. Add to DONT_DO.md if mistakes were made
5. Commit documentation updates
6. Push changes to remote (if applicable)

---

## Immediate Next Steps

### Priority 1: Initial Setup
- [ ] Set up basic Phaser project structure
- [ ] Configure webpack/build system
- [ ] Create initial game configuration
- [ ] Set up BootScene and MenuScene
- [ ] Add placeholder assets

### Priority 2: Core Gameplay
- [ ] Implement player character with basic movement
- [ ] Add game world/level
- [ ] Implement core mechanic [specify]
- [ ] Add basic UI elements

### Priority 3: Polish & Features
- [ ] [Define based on core gameplay needs]

---

## Open Questions

### Design Questions
- [ ] What is the core gameplay loop?
- [ ] What is the win/lose condition?
- [ ] What is the art style/theme?
- [ ] Target platform (web, desktop, mobile)?
- [ ] Multiplayer or single-player?

### Technical Questions
- [ ] Use TypeScript or JavaScript?
- [ ] Which Phaser physics engine (Arcade vs Matter.js)?
- [ ] Asset pipeline and tools?
- [ ] Deployment strategy?

### Content Questions
- [ ] Tone and atmosphere?
- [ ] Story/narrative elements?
- [ ] Audio requirements?

---

## Dependencies

### Core Dependencies
```json
{
  "phaser": "^3.x.x",
  // Add others as installed
}
```

### Development Dependencies
```json
{
  // Testing framework
  // Build tools
  // Linters/formatters
}
```

### External Tools
- Asset creation: [Aseprite, Photoshop, etc.]
- Audio: [Audacity, BFXR, etc.]
- Level design: [Tiled, custom tools]

---

## Success Criteria

### MVP (Minimum Viable Product)
- [ ] Game boots and runs without errors
- [ ] Player can control character
- [ ] Core gameplay loop is functional and fun
- [ ] Clear win/lose conditions
- [ ] Basic UI (score, health, etc.)
- [ ] Audio feedback

### Version 1.0
- [ ] Polished gameplay
- [ ] Complete asset set
- [ ] Multiple levels/difficulty progression
- [ ] Balanced difficulty
- [ ] Complete UI/UX
- [ ] Music and sound effects
- [ ] Game tested and bug-free

### Stretch Goals
- [ ] Additional game modes
- [ ] Achievements/unlockables
- [ ] Leaderboards
- [ ] Mobile version
- [ ] [Other goals]

---

## Notes

### Performance Targets
- Target FPS: 60
- Max load time: [specify]
- Memory budget: [specify]

### Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (if applicable)

---

*Update this file whenever architecture changes, decisions are made, or structure evolves.*
