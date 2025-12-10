# Pre-Commit Checklist

Run this before any git commit to ensure code quality and prevent issues.

---

## 1. Test the Project

**Run the application**:
```bash
npm run dev
# or
npm start
```

**Verify**:
- [ ] Project builds without errors
- [ ] Game loads and runs correctly
- [ ] No console errors in browser DevTools
- [ ] Changes work as expected
- [ ] No regressions in existing features

**Run automated tests** (if available):
```bash
npm run test
```
- [ ] All tests pass
- [ ] No new test failures
- [ ] Coverage acceptable for new code

---

## 2. Check Git Status

```bash
git status
```

**Verify**:
- [ ] Review list of modified files - all changes intentional?
- [ ] No unintended files being committed (logs, temp files, IDE configs)
- [ ] No sensitive data (API keys, passwords, tokens)
- [ ] Check for large files that shouldn't be committed

---

## 3. Review Your Changes

```bash
git diff
```

**Code Quality Check**:
- [ ] No debug code (`console.log`, `debugger`, temporary hacks)
- [ ] No commented-out code blocks
- [ ] Code follows RULES.md conventions (naming, style, structure)
- [ ] No hardcoded values that should be in config
- [ ] Proper error handling in place
- [ ] No magic numbers (use named constants)
- [ ] Functions are focused and not too long (< 50 lines ideal)

**Phaser-Specific Check**:
- [ ] Event listeners cleaned up in scene `shutdown()` method
- [ ] Object pooling used for frequently spawned objects
- [ ] No mixing of game logic with rendering
- [ ] Physics body and sprite positions properly synced
- [ ] Assets loaded with error handling
- [ ] Timers and tweens properly managed/removed

**Comments & Documentation**:
- [ ] Complex logic has explanatory comments
- [ ] Public methods have JSDoc (if applicable)
- [ ] Comments explain "why" not "what"
- [ ] No outdated comments

---

## 4. Check for Common Errors

**JavaScript/TypeScript**:
- [ ] Using `===` instead of `==`
- [ ] No array modification during iteration
- [ ] Null/undefined checks where needed (`?.` operator)
- [ ] Async/await or promise chains properly handled
- [ ] No variable shadowing
- [ ] Proper use of `const` vs `let` (never `var`)

**Security**:
- [ ] No XSS vulnerabilities (if handling user input)
- [ ] No code injection risks
- [ ] No eval() or Function() with user data
- [ ] Proper input validation

---

## 5. Documentation Check

**Did you update documentation?**
- [ ] RULES.md (if you changed conventions/standards)
- [ ] PROJECT_CONTEXT.md (if architecture/structure changed)
- [ ] DONT_DO.md (if you discovered anti-patterns)
- [ ] README.md (if user-facing features changed)
- [ ] Code comments (inline documentation)

**Tip**: If unsure, you'll update docs in `/end-session` - but major changes should be documented now.

---

## 6. Verify Content (if applicable)

**For games with narrative/creative content**:
- [ ] Spelling and grammar correct
- [ ] Tone consistent with project style
- [ ] No placeholder text (Lorem Ipsum, TODO messages)
- [ ] Text fits in UI elements
- [ ] Content appropriate for target audience

---

## 7. Commit Message Format

**Review commit message format** (from RULES.md):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `perf`, `style`

**Example**:
```
feat(player): add dash ability with cooldown

Implement dash mechanic allowing quick short-distance movement.
Includes 2-second cooldown timer and visual feedback.

Closes #42
```

**Checklist**:
- [ ] Type is appropriate (feat/fix/docs/test/refactor/chore/perf)
- [ ] Scope is clear (player/enemy/ui/scene/system)
- [ ] Subject is under 50 characters
- [ ] Subject uses imperative mood ("add" not "added" or "adds")
- [ ] Subject doesn't end with period
- [ ] Body explains "what" and "why", not "how" (if needed)
- [ ] References issue numbers if applicable

---

## 8. Verify Working Branch

```bash
git branch
```

**Check**:
- [ ] On correct branch (not accidentally on `main`/`master`)
- [ ] Branch name is descriptive
- [ ] If pushing, branch is tracking remote correctly

---

## 9. Check for Sensitive Data

**Search for common patterns**:
- [ ] No API keys or tokens
- [ ] No passwords or credentials
- [ ] No `.env` files (should be in .gitignore)
- [ ] No database connection strings
- [ ] No personal information

**Files to double-check**:
- Configuration files
- Environment files
- Test fixtures with data

---

## 10. Final Pre-Commit Verification

**Stage your changes**:
```bash
git add [files]
# or
git add .
```

**Review staged changes**:
```bash
git diff --staged
```

**Final checklist**:
- [ ] Only intended files staged
- [ ] Changes reviewed one more time
- [ ] Commit message drafted and ready
- [ ] Tests pass
- [ ] Project runs
- [ ] Documentation updated (if needed)
- [ ] No debug code
- [ ] No sensitive data

---

## Ready to Commit!

If all checks pass:

```bash
git commit -m "type(scope): your commit message"
```

Or with body:
```bash
git commit -m "$(cat <<'EOF'
type(scope): subject line

Body paragraph explaining what and why.

Closes #123
EOF
)"
```

---

## If Checks Fail

**Don't commit yet!**

1. Fix the issues identified
2. Re-run relevant checks
3. Come back to this checklist
4. Only commit when everything passes

---

**Remember**: It's better to take 2 extra minutes now than to debug issues later or clutter git history with "oops" commits.

---

## Post-Commit (Optional)

After committing:
- [ ] Push to remote (if ready): `git push`
- [ ] Verify CI/CD pipeline passes (if applicable)
- [ ] Update issue tracker/project board
- [ ] Notify team members (if collaborative project)

---

*Last Updated: 2025-12-08*
