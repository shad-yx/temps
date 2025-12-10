# Development Rules and Standards

## Golden Rules

### 1. Test-Driven Development (TDD)
- Write tests before implementing features when possible
- Every bug fix should include a test that would have caught it
- Run tests before committing code
- Maintain test coverage for critical game mechanics

### 2. Documentation Updates
- Update PROJECT_CONTEXT.md when architecture changes
- Update PROGRESS_LOG.md at end of each session
- Add to DONT_DO.md immediately when discovering failures
- Keep README.md current with feature changes

### 3. Git Discipline
- Commit frequently with clear, descriptive messages
- Follow commit message format (see Git Standards below)
- Never commit broken code
- Test before every commit
- Keep commits focused and atomic

### 4. Scope Discipline
- Finish current feature before starting new ones
- Resist feature creep during implementation
- Document future ideas in PROJECT_CONTEXT.md "Open Questions" or README.md "Roadmap"
- One goal per session when possible

---

## Language-Specific Standards

### JavaScript/TypeScript (Phaser)

#### Naming Conventions
- **Classes**: PascalCase (e.g., `PlayerController`, `EnemySpawner`)
- **Functions/Methods**: camelCase (e.g., `updatePosition`, `handleCollision`)
- **Variables**: camelCase (e.g., `playerHealth`, `enemyCount`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_SPEED`, `GAME_WIDTH`)
- **Private properties**: prefix with underscore (e.g., `_internalState`)
- **Phaser scenes**: PascalCase ending in "Scene" (e.g., `GameScene`, `MenuScene`)

#### Code Style
- Use ES6+ features (arrow functions, destructuring, template literals)
- Prefer `const` over `let`, never use `var`
- Use meaningful variable names (avoid single letters except loop counters)
- Maximum line length: 100 characters
- Indentation: 2 or 4 spaces (be consistent)
- Use semicolons consistently
- One statement per line

#### Comments
- Use JSDoc for public methods and classes
- Explain "why" not "what" in comments
- Comment complex game logic, physics calculations, or non-obvious algorithms
- Keep comments up-to-date with code changes
- Remove commented-out code before committing

#### Phaser-Specific
- Keep game logic separate from rendering
- Use Phaser's built-in physics, tweens, and timers
- Properly clean up events, timers, and tweens in scene shutdown
- Use scene data passing for communication between scenes
- Leverage Phaser's game object pooling for performance

#### Pure Functions
- Prefer pure functions where possible (same input = same output)
- Isolate side effects (API calls, DOM manipulation, randomness)
- Keep game state mutations explicit and traceable
- Use pure functions for calculations, data transformations

#### Error Handling
- Validate user input and external data
- Handle Phaser asset loading errors gracefully
- Use try-catch for operations that may fail
- Log errors meaningfully (include context)
- Provide fallbacks for critical operations
- Never let errors crash the game silently

---

## Testing Standards

### File Naming
- Test files: `[filename].test.js` or `[filename].spec.js`
- Place tests adjacent to source files or in `__tests__` directory
- Integration tests: `tests/integration/`
- E2E tests: `tests/e2e/`

### Test Structure
```javascript
describe('Component/Feature Name', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  it('should describe specific behavior', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

### What to Test
- **Critical game mechanics**: player movement, combat, scoring
- **State transitions**: scene changes, game states
- **Edge cases**: boundary values, invalid input, empty states
- **Bug fixes**: every fixed bug gets a regression test
- **Collision detection**: physics interactions
- **UI interactions**: button clicks, menu navigation

### What NOT to Test
- Phaser framework internals
- Third-party libraries
- Trivial getters/setters
- Configuration constants

---

## Git Commit Standards

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Types
- **feat**: New feature (e.g., `feat(player): add double jump mechanic`)
- **fix**: Bug fix (e.g., `fix(enemy): correct collision detection`)
- **docs**: Documentation only (e.g., `docs: update README with new controls`)
- **test**: Adding or updating tests (e.g., `test(combat): add damage calculation tests`)
- **refactor**: Code change that neither fixes bug nor adds feature (e.g., `refactor(scenes): simplify scene initialization`)
- **chore**: Maintenance tasks (e.g., `chore: update dependencies`)
- **perf**: Performance improvements (e.g., `perf(rendering): optimize sprite batching`)
- **style**: Code style changes (formatting, semicolons, etc.)

### Commit Rules
- Keep subject line under 50 characters
- Use imperative mood ("add" not "added" or "adds")
- No period at end of subject
- Separate subject from body with blank line
- Body explains what and why, not how
- Reference issues/tickets in footer

### Examples
```
feat(player): add dash ability with cooldown

Implement dash mechanic that allows player to quickly move short distance.
Includes 2-second cooldown and visual feedback.

Closes #42
```

```
fix(enemy): prevent spawning outside game bounds

Enemies were occasionally spawning off-screen due to incorrect
boundary calculations. Added validation to clamp spawn positions.
```

---

## Performance Rules

### Phaser-Specific Performance
- **Object Pooling**: Reuse game objects (bullets, enemies, particles) instead of create/destroy
- **Texture Atlases**: Use sprite sheets and texture atlases instead of individual images
- **Physics**: Use arcade physics when possible; only use matter.js when necessary
- **Update Loop**: Keep `update()` methods lean; avoid heavy calculations
- **Graphics Objects**: Clear and redraw graphics objects sparingly
- **Tweens**: Reuse tween targets when possible
- **Events**: Always remove event listeners in scene shutdown
- **Containers**: Limit deep nesting of containers

### General Performance
- Avoid premature optimization (profile first)
- Cache expensive calculations
- Debounce/throttle frequent operations
- Use appropriate data structures (Map, Set, Array)
- Minimize DOM manipulation
- Lazy load non-critical assets

---

## Content/Tone Guidelines

### For Satirical/Creative Projects
- Maintain consistent tone and voice
- Document content style in PROJECT_CONTEXT.md
- Keep humor appropriate for target audience
- Balance satire with gameplay
- Test content with others for feedback
- Document content decisions and reasoning

---

## File Organization Rules

### Phaser Project Structure
```
src/
├── scenes/          # Phaser scenes
├── entities/        # Game objects (player, enemies, items)
├── systems/         # Game systems (combat, inventory, progression)
├── ui/              # UI components
├── utils/           # Helper functions, constants
├── config/          # Game configuration
└── assets/          # Asset paths and loading configs

assets/
├── images/
├── sprites/
├── audio/
├── fonts/
└── data/            # JSON data files

tests/
├── unit/
├── integration/
└── e2e/
```

### File Organization
- One class per file
- Group related functionality in folders
- Keep files under 300 lines (refactor if larger)
- Use index.js for folder exports when appropriate
- Name files after their primary export

---

## Debugging Guidelines

### Debugging Process
1. **Reproduce**: Create minimal reproduction case
2. **Isolate**: Narrow down to smallest failing component
3. **Hypothesis**: Form theory about what's wrong
4. **Test**: Verify hypothesis with logs, debugger, tests
5. **Fix**: Implement solution
6. **Verify**: Confirm fix works and doesn't break other things
7. **Document**: Add to DONT_DO.md if lesson learned

### Debugging Tools
- Browser DevTools (breakpoints, console, network)
- Phaser Debug mode and debug graphics
- Console.log strategically (remove before commit)
- Phaser's built-in FPS meter
- Physics debug rendering

### Common Phaser Debugging
- Check scene lifecycle (create, update, shutdown)
- Verify asset loading (check preload completion)
- Inspect game object properties in console
- Use `scene.game.debug` methods
- Check physics body vs sprite positioning
- Verify event listener registration/removal

---

## Accessibility Rules

### Game Accessibility
- Provide configurable controls/key bindings
- Include colorblind-friendly palette options
- Add sound/music volume controls
- Ensure text is readable (size, contrast)
- Provide difficulty options when appropriate
- Add pause functionality
- Consider motion sensitivity (screen shake, flashing)

### Code Accessibility
- Write self-documenting code
- Add comments for complex logic
- Keep functions small and focused
- Use clear, descriptive names
- Follow consistent patterns throughout codebase

---

## Review Checklist

Before any commit, verify:
- [ ] Code follows naming conventions
- [ ] Comments are clear and current
- [ ] Tests pass
- [ ] No console.log or debug code
- [ ] Error handling is in place
- [ ] Performance considerations addressed
- [ ] Documentation updated if needed
- [ ] Git commit message follows format
- [ ] Code is properly formatted
- [ ] No sensitive data in commit

---

*Last Updated: 2025-12-08*
