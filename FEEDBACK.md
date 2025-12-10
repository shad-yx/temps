# FEEDBACK LOOP - Mandatory Status Checks

**Purpose**: After EVERY code change, modification, addition, or fix, Claude MUST ask the user for feedback before proceeding.

**Last Updated**: 2025-12-08 (Initial Creation)

---

## 📋 FEEDBACK PROCESS (MANDATORY)

### After Each Code Change Cycle:

1. **Claude completes code changes**
2. **Claude asks user these questions:**
   - ✅ What's working now?
   - ❌ What's broken?
   - 🔧 What needs fixing?
   - 🔄 What needs changing?
   - ➕ What's missing?
3. **User tests and responds**
4. **Claude records feedback below**
5. **Repeat until cycle is complete**

---

## 🔄 FEEDBACK HISTORY

### Cycle 1: Animal System Fixes (2025-12-08)

**Changes Made:**
- Added cow to starting animals
- Raised product spawn position (y - 100)
- Changed products/crops to click-to-sell (removed dragging)
- Added "PAY WITH CASH" button to PaymentScene

**Status:** AWAITING USER FEEDBACK

**Questions for User:**
1. ✅ **What's working?**
   - [ ] Do you see chicken and cow in enclosures?
   - [ ] Do eggs appear higher above chicken?
   - [ ] Does clicking eggs/milk sell them instantly?
   - [ ] Does clicking crops sell them instantly?
   - [ ] Does "PAY WITH CASH" button appear?
   - [ ] Does the button work when clicked?

2. ❌ **What's broken?**
   - [ ] Any console errors?
   - [ ] Animals not appearing?
   - [ ] Products not spawning?
   - [ ] Click to sell not working?
   - [ ] Button not functioning?

3. 🔧 **What needs fixing?**
   - [ ] Production timers too fast/slow?
   - [ ] Prices too high/low?
   - [ ] Button position wrong?
   - [ ] Visual issues?

4. 🔄 **What needs changing?**
   - [ ] Economy balance?
   - [ ] Animation speeds?
   - [ ] UI positioning?

5. ➕ **What's missing?**
   - [ ] Hayday mechanics not matching?
   - [ ] Expected features missing?

**User Response:**

✅ **What's Working:**
- Chickens visible on farm
- Instant sell works when clicking products/crops
- Pay with cash button appears

❌ **What's Broken:**
- Eggs stopped appearing after first batch
- Cannot use cash AND products together to pay debt (only one works)
- Animal section layout needs improvement

🔧 **What Needs Fixing:**
1. Fix payment scene to allow selling items AND using cash together
2. Eggs production stopped working
3. Improve animal section UI/layout
4. Add more starting animals
5. Fix animal economy system
6. Improve overall UI/UX (research game UI best practices)

🔄 **What Needs Changing:**
- UI layout across entire game
- Animal production system reliability
- Payment flexibility (mixed payment methods)

---

## 📝 NOTES

- This document gets updated after EVERY change cycle
- User must confirm what's working before moving to next change
- No document updates (STATE.md, etc.) until user confirms
- Keep feedback history for tracking progress

---

## 🎯 NEXT CYCLE

### Cycle 2: Economy & UI Fixes (2025-12-08)

**Changes Made:**
1. **Mixed Payment Support** - Can now sell items AND use cash together to pay debt
2. **All 3 Animals Start** - Chicken, Cow, AND Sheep now appear at game start
3. **Improved Economy**:
   - Faster production times (8-10 seconds)
   - Higher product values ($20-35)
   - Higher sell values ($150-250)
   - Max products increased to 5 per animal
4. **Better PaymentScene UI**:
   - Cleaner inventory header with background
   - Better label positioning
   - More compact spacing
   - "CLICK TO SELL" instruction added

**Status:** AWAITING USER FEEDBACK

**Questions for User:**
1. ✅ **What's working now?**
   - [ ] Can you sell items AND use cash to pay debt?
   - [ ] Do all 3 animals appear (Chicken, Cow, Sheep)?
   - [ ] Are eggs/milk/wool producing correctly?
   - [ ] Is the PaymentScene UI better organized?
   - [ ] Is the economy more balanced?

2. ❌ **What's still broken?**
   - [ ] Production still stopping?
   - [ ] UI still cluttered?
   - [ ] Console errors?

3. 🔧 **What still needs fixing?**
   - [ ] Production timers?
   - [ ] UI layout?
   - [ ] Economy balance?

4. 🔄 **What needs changing?**
   - [ ] More/fewer starting animals?
   - [ ] Different pricing?
   - [ ] Better UI organization?

**User Response:**

✅ **What's Working:**
- Harvest system works perfectly
- Payment system works - can sell items AND use cash
- All 3 animals visible at start
- Products producing on Day 1

❌ **What's Broken:**
- **CRITICAL: Animals stop producing after Day 1** - No eggs/milk/wool on Day 2+

🔧 **What Needs Fixing:**
1. Animals need to resume production when GameScene resumes from PaymentScene

---

### Cycle 3: Fix Animal Production Persistence (2025-12-08)

**Issue Identified:** Animals stop producing after returning from PaymentScene on Day 2+

**Root Cause Analysis:**
- When PaymentScene pauses GameScene, animal timers likely get cleared
- When resuming GameScene, animals don't restart production
- Need to add resume production logic when scene resumes

**Fix Applied:**
- Added `resume` event listener to GameScene
- When scene resumes from PaymentScene, calls `animalManager.resumeProduction()`
- This restarts production for any animals that aren't at max capacity

**Status:** AWAITING USER FEEDBACK

**Questions for User:**
1. ✅ **What's working now?**
   - [ ] Do animals produce on Day 2?
   - [ ] Do animals produce on Day 3+?
   - [ ] Do all 3 animals (Chicken/Cow/Sheep) keep producing?
   - [ ] Does production resume correctly after payment?

2. ❌ **What's still broken?**
   - [ ] Still no production after Day 1?
   - [ ] Only some animals producing?
   - [ ] Console errors?

**User Response:**

✅ **MAJOR NEW DIRECTION - Story & Horror Elements Added**

## 📖 STORY CONCEPT (New!)

**Premise:** "Shady miracle spray" - scientific marvel for increasing yield/produce

**Setup:**
- MC gets evicted, moves to dad's broken farmland
- Sees ad for spray in newspaper
- Man offers resources/animals to start business
- Man demands debt repayment + commission (increases over time)

**Horror Elements:**
- MC deteriorates after each month (becomes less human)
- Using spray corrupts farm output:
  - Crops spoiled
  - Milk: brown → black → bloody
  - Chickens corrupted
  - Farm visuals deteriorate

## 🔄 REVISED TIME STRUCTURE

**Day Cycle (1 week accelerated):**
- Every 10 seconds = 1 truck visit (sell window)
- Activities: harvest, spray, produce, collect

**Night Cycle (weekly):**
- Man visits
- Cinematics and dialogues
- Major sell-off and debt payment
- Story progression

---

### Cycle 4: Accelerated Truck System & Corruption Framework (2025-12-08)

**Changes Made:**
1. **Accelerated Truck System** - Truck visits every 10 seconds (replaces old day cycle)
   - Created `TruckManager.js` system
   - Visual truck zone on right side of screen
   - Visit counter (1-7 per week)
   - Countdown timer showing next truck arrival
   - Week ends after 7 truck visits

2. **Night Cycle Scene** - Story/dialogue system for weekly events
   - Created `NightCycleScene.js` with dialogue system
   - "The Man" character dialogue with typewriter effect
   - Debt payment check at end of each week
   - Exponential debt increase (Week 1: $500, Week 2: $750, etc.)
   - SPACE to continue dialogue mechanic

3. **Corruption Visual Framework** - Horror degradation system
   - **Tile Corruption:**
     - Stage 1 (0-3): Dark veins (greenish-black)
     - Stage 2 (4-6): Brown patches (rot)
     - Stage 3 (7-10): Bloody/dark red corruption with drips
   - **Crop Corruption:**
     - Seeds turn rotten brown with shaking animation
     - Crops turn brown/black and droop when corrupted
   - **Animal Product Corruption:**
     - **Milk:** White → Brown → Black → Bloody (with blood drips)
     - **Eggs:** White → Brown spots → Cracked/rotten
     - **Wool:** White → Grey → Dark grey/matted
   - All corrupted items shake/tremble at high corruption levels

4. **Updated Game Config:**
   - Added `TRUCK_VISIT_INTERVAL: 10000` (10 seconds)
   - Added `VISITS_PER_WEEK: 7` constant

5. **Integrated Systems:**
   - TruckManager triggers NightCycleScene after 7 visits
   - NightCycleScene checks debt and returns to GameScene if paid
   - Game Over if debt unpaid
   - Truck timer resumes when returning to game

**Status:** AWAITING USER FEEDBACK

**Questions for User:**
1. ✅ **What's working now?**
   - [ ] Does truck arrive every 10 seconds?
   - [ ] Does visit counter show 1-7 correctly?
   - [ ] Does night cycle trigger after 7 visits?
   - [ ] Does dialogue system work (SPACE to continue)?
   - [ ] Can you test corruption visuals (methods ready, need trigger)?

2. ❌ **What's still broken?**
   - [ ] Truck system issues?
   - [ ] Night cycle not triggering?
   - [ ] Dialogue glitches?
   - [ ] Console errors?

3. 🔧 **What needs fixing?**
   - [ ] Truck timer speed (too fast/slow)?
   - [ ] Debt amounts (too high/low)?
   - [ ] Dialogue pacing?
   - [ ] Visual corruption effects?

4. 🔄 **What needs changing?**
   - [ ] Story dialogue content?
   - [ ] Corruption progression rate?
   - [ ] Weekly debt scaling?

5. ➕ **Next Steps:**
   - [ ] Test if animals still produce correctly with new truck system
   - [ ] Add trigger for corruption (spray usage, time-based, etc.)
   - [ ] Expand dialogue for more weeks
   - [ ] Add player character deterioration visuals
   - [ ] Implement "Man" character sprite

**User Response:**
