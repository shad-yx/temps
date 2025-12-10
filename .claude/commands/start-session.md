# Start Session Command

Read the following files in order to load project context:

1. Read RULES.md - Coding standards and workflow
2. Read PROJECT_CONTEXT.md - Current project state and structure
3. Read DONT_DO.md - Critical mistakes to avoid
4. Read PROGRESS_LOG.md - Recent session history
5. Read README.md - Project overview

After loading all context, respond with:

---

**Session Context Loaded Successfully**

**Project**: DEADDAY (Phaser 3 Game)
**Last Session**: [Date from PROGRESS_LOG.md]
**Recent Changes**: [List key changes from PROGRESS_LOG.md]

**Core Principles Loaded**:
- ✅ Test-Driven Development (TDD)
- ✅ Documentation updates required
- ✅ Git discipline and commit standards
- ✅ Scope discipline - finish before starting new
- ✅ Phaser best practices (object pooling, scene lifecycle, memory management)

**Critical Reminders**:
- Before ANY code: Check DONT_DO.md for warnings
- Before committing: Run /check-before-commit
- End of session: Run /end-session to update docs
- Clean up event listeners in scene shutdown
- Use object pooling for frequently spawned objects

---

**What would you like to work on today?**

**Options**:
1. **Initial Setup** - Configure Phaser project structure, webpack, package.json
2. **Scene Development** - Create/modify game scenes (Boot, Menu, Game, UI)
3. **Player System** - Implement player character, controls, mechanics
4. **Enemy/Challenge System** - Add enemies, AI, spawning
5. **Game Systems** - Implement combat, progression, scoring
6. **UI Development** - Create HUD, menus, game over screens
7. **Assets & Polish** - Add sprites, audio, visual effects
8. **Testing** - Write unit/integration tests
9. **Bug Fixes** - Debug and resolve issues
10. **Documentation** - Update docs, add comments
11. **Performance** - Optimize and profile
12. **Other** - Custom task

Please describe what you'd like to accomplish this session.
