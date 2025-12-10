# End Session Command

Before ending this session, let's update all documentation to ensure continuity for the next session.

---

## Documentation Update Checklist

Please review and confirm updates for each file:

### 1. PROJECT_CONTEXT.md
**Question**: Did we make any changes to:
- Project structure or file organization?
- Core systems or architecture?
- Features (new/modified/removed)?
- Game configuration or constants?
- Known issues or technical limitations?
- Dependencies or external libraries?

**Action**: If YES to any above, read PROJECT_CONTEXT.md and suggest specific updates to:
- "What Exists" section
- "What Doesn't Exist Yet" section
- "Key Decisions Made" section
- "Core Mechanics / Architecture" section
- "Open Questions" section (if resolved or new questions arise)

---

### 2. DONT_DO.md
**Question**: Did we:
- Make any mistakes during this session?
- Discover any anti-patterns or problematic approaches?
- Learn something the hard way (performance issue, bug, etc.)?
- Encounter a workflow or approach that should be avoided?
- Find a Phaser-specific gotcha or pitfall?

**Action**: If YES to any above, suggest new entries for DONT_DO.md with:
- Date: [Today's date]
- Category: Architecture | Performance | Logic Bug | UX Failure | Workflow Issue | Phaser-Specific
- Severity: 🔴 Critical | 🟡 Warning | 🔵 Info
- What We Tried
- Why It Failed
- What to Do Instead
- Related Code/Files
- How to Detect (warning signs)

---

### 3. PROGRESS_LOG.md
**Required**: Update session entry with complete information:

**Session Header**:
- Session number: [Next sequential number]
- Date: [Today's date]
- Duration: [Estimate time spent]
- Goal: [Primary objective statement]
- Status: ✅ Completed | 🔄 Partial | ⛔ Blocked

**What Was Done**:
- [x] Completed task 1
- [x] Completed task 2
- [ ] Started but not finished task 3

**What Works**:
- Feature/system that was successfully implemented and tested
- Another working feature with description

**What Doesn't Work / Blockers**:
- Bug/issue description with details
- Blocker description and what's needed to unblock
- Leave empty if none

**Decisions Made**:
Document any architectural or design decisions:
- **[Decision Topic]**: Decision made, reasoning, alternatives considered

**Tests Written**:
- [ ] Test description (file: path/to/test.spec.js)
- Leave empty if no tests added

**Files Modified**:
- `path/to/file.js` - Brief description of changes
- `path/to/another.js` - What was modified

**Git Commits** (if any):
- `commit-hash` - type(scope): commit message
- List all commits made this session

**Next Session Goals**:
1. Priority 1: [Most important next task]
2. Priority 2: [Secondary task]
3. If time permits: [Nice-to-have task]

**Notes/Learnings**:
- Key insight or learning from this session
- Reminder for future sessions
- Links to useful resources discovered
- Performance notes or observations

**Action**: Read PROGRESS_LOG.md and suggest the complete new session entry.

---

### 4. README.md (if needed)
**Question**: Did we change:
- Core features or game mechanics?
- How to run the project (new commands, dependencies)?
- Project structure or file organization?
- Installation or setup requirements?
- Game controls or user-facing functionality?
- Project status or completion percentage?

**Action**: If YES to any above, suggest specific updates to README.md sections.

---

## Session Summary

After reviewing all documentation, provide a brief summary:

---

**📊 Session Summary**

**Session Date**: [Today's date]
**Session Number**: [Number]
**Duration**: [Estimate]

**Main Accomplishments**:
- [Key achievement 1]
- [Key achievement 2]
- [Key achievement 3]

**Project Status**: [X]% complete | [Current phase]

**Files Changed**: [Count] files modified
**Commits Made**: [Count] commits
**Tests Added**: [Count] tests

**Blockers/Issues**:
- [Issue 1 or "None"]
- [Issue 2 or "None"]

**Next Session Priorities**:
1. [Top priority]
2. [Second priority]
3. [Third priority]

**Documentation Updates Required**:
- [ ] PROJECT_CONTEXT.md - [Brief note on what needs updating]
- [ ] DONT_DO.md - [Brief note or "No updates needed"]
- [ ] PROGRESS_LOG.md - [Always needs session entry]
- [ ] README.md - [Brief note or "No updates needed"]

---

**Would you like me to proceed with updating the documentation files, or would you prefer to review and modify the suggestions first?**

---

## Important Reminders

Before you go:
- [ ] All code changes committed with proper messages
- [ ] Tests passing (if applicable)
- [ ] No debug code or console.logs left in
- [ ] Documentation updates planned or completed
- [ ] Next session has clear starting point
