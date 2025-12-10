# Project Cleanup & Housekeeping

Run this periodically to keep the project healthy and organized.

---

## 1. Check for Orphaned Files

**Look for files that shouldn't exist**:

```bash
# List all files in project
ls -la

# Check for common orphaned files
ls *.log
ls .DS_Store
ls Thumbs.db
```

**Files to remove**:
- [ ] Log files (*.log)
- [ ] OS-generated files (.DS_Store, Thumbs.db)
- [ ] Editor backup files (*~, *.swp, *.bak)
- [ ] Old test output files
- [ ] Temporary files (*.tmp)
- [ ] Screenshot/recording files from testing

**Action**: Delete or add to `.gitignore`

---

## 2. Review Dependencies

**Check package.json**:

```bash
npm outdated
```

**Questions**:
- [ ] Are all dependencies still needed?
- [ ] Any unused packages to remove?
- [ ] Any security vulnerabilities? (`npm audit`)
- [ ] Are versions up-to-date (if stable)?

**Clean up**:
```bash
# Remove unused dependencies
npm uninstall [package-name]

# Update dependencies (be careful!)
npm update

# Fix security issues
npm audit fix
```

---

## 3. Clean Debug Code

**Search for debug artifacts**:

```bash
# Search for console.log
grep -r "console.log" src/

# Search for debugger statements
grep -r "debugger" src/

# Search for TODO comments
grep -r "TODO" src/

# Search for FIXME comments
grep -r "FIXME" src/
```

**Review and clean**:
- [ ] Remove or properly log console statements
- [ ] Remove debugger statements
- [ ] Address or document TODOs
- [ ] Fix or document FIXMEs
- [ ] Remove commented-out code blocks

---

## 4. Check File Organization

**Review project structure**:

**Questions**:
- [ ] Are files in the right directories?
- [ ] Any files that should be moved or renamed?
- [ ] Scene files in `src/scenes/`?
- [ ] Entity classes in `src/entities/`?
- [ ] Utilities in `src/utils/`?
- [ ] Game systems in `src/systems/`?

**Phaser-specific organization**:
- [ ] Scenes properly named (e.g., `GameScene.js`, `MenuScene.js`)
- [ ] Assets referenced in `src/config/` or constants file
- [ ] Game configuration centralized
- [ ] Reusable components extracted from scenes

---

## 5. Review Documentation Freshness

**Check documentation files**:

**RULES.md**:
- [ ] Still reflects current conventions?
- [ ] Any new standards to add?
- [ ] Outdated rules to remove/update?

**PROJECT_CONTEXT.md**:
- [ ] "What Exists" section accurate?
- [ ] "What Doesn't Exist Yet" section current?
- [ ] Recent decisions documented?
- [ ] File structure diagram up-to-date?

**DONT_DO.md**:
- [ ] Any new anti-patterns discovered?
- [ ] Old entries still relevant?
- [ ] Severity levels accurate?

**PROGRESS_LOG.md**:
- [ ] All recent sessions logged?
- [ ] Quick stats at bottom accurate?

**README.md**:
- [ ] Project description current?
- [ ] Installation steps work?
- [ ] Feature list reflects reality?
- [ ] Controls documented correctly?
- [ ] Status/progress percentage accurate?

---

## 6. Git Housekeeping

**Check git status**:

```bash
git status
git branch -a
```

**Clean up**:
- [ ] Any uncommitted changes? (Commit or stash)
- [ ] Merged branches to delete?
- [ ] Stale branches to clean up?

```bash
# Delete merged local branches
git branch --merged | grep -v "\*" | xargs -n 1 git branch -d

# See stashes
git stash list

# Clean up old stashes (carefully!)
git stash drop stash@{N}
```

**Check remote sync**:
```bash
git fetch --prune
git status
```

---

## 7. Review .gitignore

**Open .gitignore and verify**:

**Should be ignored**:
- [ ] `node_modules/`
- [ ] Build output (e.g., `dist/`, `build/`)
- [ ] Editor configs (`.vscode/`, `.idea/`)
- [ ] OS files (`.DS_Store`, `Thumbs.db`)
- [ ] Environment files (`.env`, `.env.local`)
- [ ] Log files (`*.log`)
- [ ] Coverage reports (`coverage/`)

**Phaser-specific**:
- [ ] Build output directory
- [ ] Compiled assets (if generated)
- [ ] Local config overrides

**Action**: Add missing patterns or remove unnecessary ones

---

## 8. Asset Organization

**Check assets directory**:

```bash
ls -R assets/
```

**Questions**:
- [ ] Assets organized by type (images/, sprites/, audio/, fonts/)?
- [ ] Unused assets to remove?
- [ ] Asset naming consistent?
- [ ] Large files properly optimized?
- [ ] Sprite sheets generated (if using texture packer)?

**Phaser-specific**:
- [ ] Texture atlases up-to-date?
- [ ] Asset manifest/loading config current?
- [ ] Audio files in appropriate format (mp3/ogg)?
- [ ] Images compressed for web?

---

## 9. Code Quality Check

**Run linter (if configured)**:
```bash
npm run lint
# or
npm run lint:fix
```

**Check for**:
- [ ] Consistent code style
- [ ] No linting errors
- [ ] No linting warnings (or acceptable warnings documented)

**Run formatter (if configured)**:
```bash
npm run format
# or
npx prettier --write src/
```

---

## 10. Verify Tests

**Run test suite**:
```bash
npm test
```

**Questions**:
- [ ] All tests passing?
- [ ] Any skipped tests to address?
- [ ] Test coverage acceptable?
- [ ] Old/obsolete tests to remove?
- [ ] New features without tests?

**Generate coverage report** (if configured):
```bash
npm run test:coverage
```

---

## 11. Performance Check

**Run the game and check**:
- [ ] FPS stable at 60?
- [ ] Memory usage reasonable?
- [ ] No memory leaks (play for a while, check DevTools Memory tab)?
- [ ] Asset loading time acceptable?
- [ ] Scene transitions smooth?

**Profile if needed**:
- [ ] Use browser DevTools Performance tab
- [ ] Check for long tasks or jank
- [ ] Identify bottlenecks

---

## 12. Dependency Security

**Check for vulnerabilities**:

```bash
npm audit
```

**Review and fix**:
- [ ] Critical vulnerabilities addressed
- [ ] High vulnerabilities addressed
- [ ] Moderate vulnerabilities reviewed
- [ ] Low vulnerabilities acceptable or fixed

```bash
# Auto-fix if possible
npm audit fix

# Manual updates if needed
npm update [package-name]
```

---

## 13. Build Verification

**Test production build**:

```bash
npm run build
```

**Verify**:
- [ ] Build completes without errors
- [ ] Build output size reasonable
- [ ] Built game runs correctly
- [ ] No console errors in production build
- [ ] Assets load properly

---

## 14. Documentation TODOs

**Search for documentation gaps**:

```bash
grep -r "TODO" *.md
grep -r "TBD" *.md
grep -r "\[TBD\]" *.md
```

**Address**:
- [ ] Fill in placeholder content
- [ ] Update TBD sections
- [ ] Complete unfinished documentation

---

## Summary Checklist

After cleanup, verify:

- [ ] No orphaned or temporary files
- [ ] Dependencies reviewed and updated
- [ ] Debug code removed
- [ ] Files properly organized
- [ ] Documentation current and accurate
- [ ] Git history clean
- [ ] .gitignore comprehensive
- [ ] Assets organized and optimized
- [ ] Code style consistent (linted)
- [ ] Tests passing
- [ ] No performance issues
- [ ] No security vulnerabilities
- [ ] Production build works

---

## Cleanup Frequency Recommendations

**Daily/Per Session**:
- Remove debug code before commits
- Update PROGRESS_LOG.md

**Weekly**:
- Review and clean up branches
- Check for TODO/FIXME comments
- Verify documentation accuracy

**Monthly**:
- Full cleanup pass using this checklist
- Update dependencies
- Run security audit
- Performance profiling

**Before Major Milestones**:
- Complete cleanup
- Documentation review
- Test coverage check
- Production build verification

---

*Last Updated: 2025-12-08*
