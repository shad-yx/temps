# DEADDAY

A Phaser 3 game project.

---

## What is DEADDAY?

[Describe your game's genre, core concept, and unique features here]

**Genre**: [Action, Platformer, Roguelike, etc.]
**Core Mechanic**: [Describe the main gameplay loop]
**Theme**: [Art style, setting, tone]

---

## Current Status

**Phase**: Initial Development Setup
**Version**: 0.0.1
**Progress**: 🟥🟥🟥⬜⬜⬜⬜⬜⬜⬜ 0%

### What's Implemented
- [x] Development environment and documentation
- [ ] Basic Phaser project structure
- [ ] Core game loop
- [ ] Player character
- [ ] [Add items as they're completed]

### What's Next
- [ ] Set up Phaser project structure
- [ ] Create initial scenes (Boot, Menu, Game)
- [ ] Implement player character with basic controls
- [ ] [Add upcoming tasks]

---

## Core Features

### Planned Features
- [ ] **[Feature 1]**: [Description]
- [ ] **[Feature 2]**: [Description]
- [ ] **[Feature 3]**: [Description]

### Stretch Goals
- [ ] **[Feature]**: [Description]
- [ ] **[Feature]**: [Description]

---

## How to Run

### Prerequisites
- Node.js (version X.X.X or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone [repository-url]
cd DEADDAY

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Run linter
```

---

## Project Structure

```
DEADDAY/
├── .claude/                    # Claude Code configuration
│   ├── commands/               # Slash commands
│   └── settings.local.json     # Local settings
│
├── src/                        # Source code
│   ├── scenes/                 # Phaser scenes
│   │   ├── BootScene.js
│   │   ├── MenuScene.js
│   │   └── GameScene.js
│   ├── entities/               # Game objects (Player, Enemy, etc.)
│   ├── systems/                # Game systems (Combat, Inventory, etc.)
│   ├── ui/                     # UI components
│   ├── utils/                  # Helper functions and constants
│   ├── config/                 # Game configuration
│   └── main.js                 # Entry point
│
├── assets/                     # Game assets
│   ├── images/                 # Sprites, backgrounds, UI
│   ├── audio/                  # Sound effects and music
│   ├── fonts/                  # Custom fonts
│   └── data/                   # JSON data files
│
├── tests/                      # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── public/                     # Static files
│   └── index.html
│
├── RULES.md                    # Coding standards and conventions
├── PROJECT_CONTEXT.md          # Living project documentation
├── DONT_DO.md                  # Anti-patterns and lessons learned
├── PROGRESS_LOG.md             # Session-by-session changelog
├── README.md                   # This file
├── package.json
└── [build configuration files]
```

---

## Documentation

- **[RULES.md](RULES.md)** - Coding standards, testing guidelines, git conventions
- **[PROJECT_CONTEXT.md](PROJECT_CONTEXT.md)** - Current project state, architecture, decisions
- **[DONT_DO.md](DONT_DO.md)** - Anti-patterns and mistakes to avoid
- **[PROGRESS_LOG.md](PROGRESS_LOG.md)** - Detailed session history and progress

---

## Development Workflow

### Starting a Session
```bash
# In Claude Code, run:
/start-session
```
This loads all project context and recent changes.

### Ending a Session
```bash
# In Claude Code, run:
/end-session
```
This updates all documentation with your changes.

### Before Committing
```bash
# In Claude Code, run:
/check-before-commit
```
This runs pre-commit checks to ensure code quality.

---

## Technology Stack

- **Game Engine**: Phaser 3.x
- **Language**: JavaScript (or TypeScript)
- **Build Tool**: [Webpack/Vite/Rollup]
- **Testing**: [Jest/Mocha/etc.]
- **Version Control**: Git

---

## Controls

[Document game controls here once implemented]

**Keyboard**:
- Arrow Keys / WASD: [Action]
- Space: [Action]
- E: [Action]

**Mouse**:
- Left Click: [Action]
- Right Click: [Action]

---

## Roadmap

### Phase 1: Core Gameplay (MVP)
- [ ] Basic game loop
- [ ] Player character with controls
- [ ] [Core mechanic implementation]
- [ ] Win/lose conditions
- [ ] Basic UI

### Phase 2: Content & Polish
- [ ] Multiple levels/stages
- [ ] Enemy variety
- [ ] Power-ups/upgrades
- [ ] Visual polish
- [ ] Audio implementation

### Phase 3: Advanced Features
- [ ] [Feature 1]
- [ ] [Feature 2]
- [ ] [Feature 3]

### Phase 4: Release
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] Bug fixing
- [ ] Final polish
- [ ] Deployment

---

## Contributing

[If applicable, add contribution guidelines]

---

## Credits

**Development**: [Your name/team]
**Art**: [Artist names or asset sources]
**Audio**: [Composer names or audio sources]
**Tools**: Phaser 3, [other tools]

---

## License

[Specify license - MIT, GPL, All Rights Reserved, etc.]

---

*Last Updated: 2025-12-08*
