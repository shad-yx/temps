# Don't Do This - Lessons Learned

**Purpose**: This file tracks mistakes, anti-patterns, and failures to prevent repeating them.

**How to Use**:
- ✅ **Check this file when stuck** - Someone may have already tried your approach
- ✅ **Check before risky operations** - See if there are warnings
- ✅ **Add entries immediately when you discover failures** - Don't wait
- ✅ **Reference this in code reviews** - Link to entries when relevant

---

## Entry Template

```markdown
### [Short Descriptive Title]
**Date**: YYYY-MM-DD
**Category**: Architecture | Performance | Logic Bug | UX Failure | Workflow Issue | Phaser-Specific
**Severity**: 🔴 Critical | 🟡 Warning | 🔵 Info

**What We Tried**:
[Describe the approach or implementation]

**Why It Failed**:
[Explain root cause of failure]

**What to Do Instead**:
[Correct approach or solution]

**Related Code/Files**:
- [filename.js:line]
- [Commit hash if applicable]

**How to Detect**:
[Warning signs that you're repeating this mistake]
```

---

## Common Pitfalls (Preemptive)

### Phaser Scene Memory Leaks
**Category**: Phaser-Specific | Performance
**Severity**: 🔴 Critical

**What Goes Wrong**:
Not properly cleaning up event listeners, timers, and tweens when scenes shut down leads to memory leaks and performance degradation.

**Why It Happens**:
Phaser scenes can be stopped and restarted, but event listeners persist if not removed.

**What to Do Instead**:
```javascript
// In scene shutdown method
shutdown() {
  this.events.off('event-name'); // Remove scene events
  this.input.off('pointerdown'); // Remove input events
  if (this.updateTimer) {
    this.updateTimer.remove(); // Remove timers
  }
  if (this.myTween) {
    this.myTween.stop(); // Stop tweens
  }
}
```

**How to Detect**:
- Game slows down after playing multiple rounds
- Memory usage increases over time
- Events fire multiple times when they should fire once

---

### Not Using Object Pooling for Frequent Spawns
**Category**: Performance | Phaser-Specific
**Severity**: 🟡 Warning

**What Goes Wrong**:
Creating and destroying game objects every frame (bullets, particles, enemies) causes garbage collection spikes and frame rate drops.

**Why It Happens**:
`create()` and `destroy()` are expensive operations in Phaser.

**What to Do Instead**:
Use Phaser's Group with `maxSize` for object pooling:
```javascript
// In create()
this.bulletPool = this.physics.add.group({
  classType: Bullet,
  maxSize: 50,
  runChildUpdate: true
});

// When spawning
const bullet = this.bulletPool.get(x, y);
if (bullet) {
  bullet.fire(x, y, direction);
}

// When done (in Bullet class)
onCollision() {
  this.setActive(false);
  this.setVisible(false);
}
```

**How to Detect**:
- FPS drops when many objects spawn
- Stuttering during intense gameplay
- Performance profiler shows high GC time

---

### Mixing Game Logic with Rendering
**Category**: Architecture | Phaser-Specific
**Severity**: 🟡 Warning

**What Goes Wrong**:
Putting game state calculations directly in sprite/scene update methods makes code hard to test and reason about.

**Why It Happens**:
It's convenient to modify game objects directly in update loops.

**What to Do Instead**:
Separate game logic into systems/managers:
```javascript
// ❌ Don't do this
update() {
  this.player.x += this.speed;
  if (this.player.x > 100) {
    this.player.health -= 10;
    this.player.setTint(0xff0000);
  }
}

// ✅ Do this
update() {
  const newState = PlayerSystem.update(this.playerState, delta);
  this.player.applyState(newState);
}
```

**How to Detect**:
- Difficulty writing unit tests
- Update methods over 50 lines
- Can't easily replay or predict game behavior

---

### Hardcoding Values Instead of Using Config
**Category**: Architecture
**Severity**: 🔵 Info

**What Goes Wrong**:
Magic numbers scattered throughout code make balancing and tweaking difficult.

**What to Do Instead**:
```javascript
// ❌ Don't do this
this.player.setVelocity(200);
this.enemy.health = 100;

// ✅ Do this
import { PLAYER_SPEED, ENEMY_HEALTH } from './config/GameBalance';
this.player.setVelocity(PLAYER_SPEED);
this.enemy.health = ENEMY_HEALTH;
```

**How to Detect**:
- Lots of numeric literals in code
- Hard to tweak game feel
- Different parts of code use slightly different values for "same" thing

---

### Not Handling Asset Loading Errors
**Category**: Logic Bug | Phaser-Specific
**Severity**: 🟡 Warning

**What Goes Wrong**:
Game crashes or shows blank screen if assets fail to load (network issues, wrong paths, etc.).

**What to Do Instead**:
```javascript
// In BootScene preload()
this.load.on('loaderror', (file) => {
  console.error('Error loading asset:', file.key);
  // Show error message to user
  // Load fallback asset
});

this.load.on('complete', () => {
  // Verify critical assets loaded
  if (!this.textures.exists('player')) {
    this.scene.start('ErrorScene');
    return;
  }
  this.scene.start('MenuScene');
});
```

---

### Forgetting Physics Body vs Sprite Position
**Category**: Logic Bug | Phaser-Specific
**Severity**: 🟡 Warning

**What Goes Wrong**:
Setting `sprite.x` doesn't update physics body, and vice versa, causing desyncs.

**What to Do Instead**:
```javascript
// ❌ Don't mix these
this.player.x = 100; // Moves sprite but not physics body
this.player.body.x = 100; // Moves physics body but not sprite

// ✅ Do this
this.player.setPosition(100, 100); // Syncs both
// or
this.player.setVelocity(vx, vy); // Let physics move it
```

---

### Not Testing on Target Devices/Browsers
**Category**: Workflow Issue | UX Failure
**Severity**: 🟡 Warning

**What Goes Wrong**:
Game works perfectly on development machine but has issues on target platform (performance, input, rendering).

**What to Do Instead**:
- Test on actual mobile devices if targeting mobile
- Test in multiple browsers (Chrome, Firefox, Safari)
- Use browser dev tools device emulation
- Test on lower-end hardware
- Add FPS counter and performance monitoring

---

## Git / Workflow Pitfalls

### Committing Without Testing
**Category**: Workflow Issue
**Severity**: 🔴 Critical

**What Goes Wrong**:
Breaking changes get committed and pushed, blocking other work.

**What to Do Instead**:
1. Run the game and test your changes
2. Run automated tests if available
3. Use `/check-before-commit` command
4. Only then commit

---

### Vague Commit Messages
**Category**: Workflow Issue
**Severity**: 🔵 Info

**What Goes Wrong**:
Messages like "fix", "update", "changes" make git history useless.

**What to Do Instead**:
Follow the format in RULES.md:
```
feat(player): add dash ability with cooldown
fix(enemy): prevent spawning outside bounds
refactor(scenes): simplify scene transitions
```

---

## JavaScript/TypeScript Common Mistakes

### Using == Instead of ===
**Category**: Logic Bug
**Severity**: 🔵 Info

**What Goes Wrong**:
Type coercion causes unexpected behavior (`0 == "0"` is true, `0 == false` is true).

**What to Do Instead**:
Always use `===` and `!==` for equality checks.

---

### Modifying Arrays While Iterating
**Category**: Logic Bug
**Severity**: 🟡 Warning

**What Goes Wrong**:
```javascript
// ❌ This skips elements
this.enemies.forEach((enemy, index) => {
  if (enemy.isDead) {
    this.enemies.splice(index, 1); // Modifies array during iteration
  }
});
```

**What to Do Instead**:
```javascript
// ✅ Filter to new array
this.enemies = this.enemies.filter(enemy => !enemy.isDead);

// Or iterate backwards
for (let i = this.enemies.length - 1; i >= 0; i--) {
  if (this.enemies[i].isDead) {
    this.enemies.splice(i, 1);
  }
}
```

---

### Not Handling Null/Undefined
**Category**: Logic Bug
**Severity**: 🟡 Warning

**What Goes Wrong**:
`Cannot read property 'x' of undefined` errors crash the game.

**What to Do Instead**:
```javascript
// Use optional chaining and nullish coalescing
const health = player?.stats?.health ?? 100;

// Validate before use
if (!player || !player.active) return;
```

---

## Discovered Failures (Session-Specific)

*Entries will be added here as you encounter issues during development*

---

**Last Updated**: 2025-12-08

*Keep this file updated! Future you will thank present you.*
