# Dialogue System Guide - DEADDAY

## 📖 Overview

The DEADDAY visual novel system is **completely modular**. You can easily add new dialogue scenes, characters, and cinematics by editing a single JSON file.

**No coding required** - just edit `DialogueData.json` and add your story!

---

## 🎬 How It Works

### **Game Flow:**

```
Game Start
    ↓
PreloadScene (loads assets)
    ↓
DialogueScene (key: 'intro')  ← 12 pages of intro story
    ↓
GameScene (gameplay - week 1)
    ↓
PaymentScene (pay debt)
    ↓
DialogueScene (key: 'week_end_1')  ← Night dialogue
    ↓
GameScene (gameplay - week 2)
    ↓
(loop continues...)
```

### **Key Files:**

| File | Purpose |
|------|---------|
| `src/data/DialogueData.js` | **ALL dialogue content** (edit this!) |
| `src/scenes/DialogueScene.js` | Reusable scene that displays dialogue |
| `src/scenes/PreloadScene.js` | Starts intro cinematic |
| `src/scenes/PaymentScene.js` | Triggers week-end dialogues |

---

## 📝 Adding New Dialogue

### **Step 1: Edit DialogueData.js**

Open `src/data/DialogueData.js` and add a new entry inside the `DialogueData` object:

```javascript
export const DialogueData = {
  // ... existing scenes ...

  "my_new_scene": {
    "background": "farm_night",
    "pages": [
      {
        "character": "protagonist",
        "portrait": "protagonist_worried",
        "text": "This is my dialogue text...",
        "position": "left"
      },
      {
        "character": "the_man",
        "portrait": "the_man_smile",
        "text": "This is The Man's response...",
        "position": "right"
      }
    ]
  }
};
```

### **Step 2: Trigger It From Code**

In any scene, call:

```javascript
this.scene.start('DialogueScene', {
  dialogueKey: 'my_new_scene',
  nextScene: 'GameScene', // Where to go after
  nextSceneData: {}       // Optional data to pass
});
```

**That's it!** Your new dialogue will play.

---

## 📋 Dialogue Format

### **Structure:**

```json
{
  "dialogue_key": {
    "background": "background_name",
    "pages": [
      {
        "character": "character_id",
        "portrait": "portrait_filename",
        "text": "What they say",
        "position": "left/right/center"
      }
    ]
  }
}
```

---

## 🎨 Field Reference

### **`background`** (string)

Which background to show. Current options:

| Value | Description | Color |
|-------|-------------|-------|
| `farm_exterior` | Daytime farm | Brown (#8B7355) |
| `farm_day` | Bright day | Sky blue (#87CEEB) |
| `farm_night` | Night scene | Dark blue (#1a1a2e) |
| `farm_night_corrupted` | Corrupted night | Purple-black (#2d0a1f) |
| `farm_night_dark` | Pitch black | (#0a0a0a) |

**To add custom backgrounds:**
1. Place image in `assets/images/backgrounds/`
2. Load in PreloadScene.js: `this.load.image('my_bg', 'path/to/image.png')`
3. Use key in DialogueData.json: `"background": "my_bg"`

---

### **`character`** (string)

Who is speaking. Determines name display.

| Value | Display Name |
|-------|--------------|
| `narrator` | (no name shown) |
| `protagonist` | "You" |
| `the_man` | "The Man" |
| `commission_officer` | "Commission Officer" |

**To add new characters:**

Edit `DialogueScene.js` line ~160:

```javascript
const characterNames = {
  'narrator': '',
  'protagonist': 'You',
  'the_man': 'The Man',
  'your_character': 'Your Character Name',  // ← Add here
};
```

---

### **`portrait`** (string or null)

Which character portrait to show.

**Current placeholders:**
- `protagonist_neutral`
- `protagonist_worried`
- `protagonist_tired`
- `protagonist_scared`
- `protagonist_corrupted_1`
- `the_man_smile`
- `the_man_neutral`
- `the_man_sinister`
- `the_man_angry`

**To add real portraits:**

1. **Create portrait image** (recommended: 200x300px PNG with transparency)
2. **Place in:** `assets/images/characters/portraits/`
3. **Load in PreloadScene.js:**
```javascript
this.load.image('protagonist_happy', 'assets/images/characters/portraits/protagonist_happy.png');
```
4. **Update DialogueScene.js** to use real image instead of placeholder

---

### **`text`** (string)

What the character says. Can be multiple paragraphs.

**Tips:**
- Keep under 200 characters per page for readability
- Use `...` for pauses/suspense
- Break long speeches into multiple pages

**Example:**

```json
{
  "text": "The farm is changing. Every day, things get worse. I need to get out of here..."
}
```

---

### **`position`** (string)

Where the dialogue appears:

| Value | Effect |
|-------|--------|
| `left` | Portrait on left, text left-aligned (protagonist usually) |
| `right` | Portrait on right, text left-aligned (other characters) |
| `center` | No portrait, text centered (narrator/thoughts) |

---

## 📚 Example Dialogues

### **Example 1: Simple Conversation**

```json
{
  "example_talk": {
    "background": "farm_day",
    "pages": [
      {
        "character": "protagonist",
        "portrait": "protagonist_neutral",
        "text": "Hey, I need to ask you something.",
        "position": "left"
      },
      {
        "character": "the_man",
        "portrait": "the_man_smile",
        "text": "Of course. What is it?",
        "position": "right"
      },
      {
        "character": "protagonist",
        "portrait": "protagonist_worried",
        "text": "What's really in that spray you gave me?",
        "position": "left"
      },
      {
        "character": "the_man",
        "portrait": "the_man_sinister",
        "text": "...You'll find out soon enough.",
        "position": "right"
      }
    ]
  }
}
```

### **Example 2: Narrator Scene**

```json
{
  "example_narration": {
    "background": "farm_night",
    "pages": [
      {
        "character": "narrator",
        "portrait": null,
        "text": "Three months have passed since you arrived at the farm.",
        "position": "center"
      },
      {
        "character": "narrator",
        "portrait": null,
        "text": "The crops are dying. The animals are changing. And so are you.",
        "position": "center"
      }
    ]
  }
}
```

### **Example 3: Inner Monologue**

```json
{
  "example_thoughts": {
    "background": "farm_night_dark",
    "pages": [
      {
        "character": "protagonist",
        "portrait": "protagonist_tired",
        "text": "I can't sleep. Every time I close my eyes, I see those creatures.",
        "position": "left"
      },
      {
        "character": "narrator",
        "portrait": null,
        "text": "Your hands tremble as you look at them in the moonlight.",
        "position": "center"
      },
      {
        "character": "protagonist",
        "portrait": "protagonist_scared",
        "text": "What's happening to me?",
        "position": "left"
      }
    ]
  }
}
```

---

## 🔗 Triggering Dialogues

### **From PreloadScene (Game Start):**

```javascript
// In PreloadScene.js create() method:
this.scene.start('DialogueScene', {
  dialogueKey: 'intro',
  nextScene: 'GameScene'
});
```

### **From PaymentScene (After Paying Debt):**

```javascript
// In PaymentScene.js debtPaid() method:
const weekNumber = Math.floor((this.currentDay - 1) / 7) + 1;
let dialogueKey = 'week_end_' + weekNumber;

this.scene.start('DialogueScene', {
  dialogueKey: dialogueKey,
  nextScene: 'GameScene'
});
```

### **From GameScene (Any Time):**

```javascript
// Example: Trigger dialogue when player clicks something
this.myButton.on('pointerdown', () => {
  this.scene.start('DialogueScene', {
    dialogueKey: 'special_event',
    nextScene: 'GameScene',
    nextSceneData: { someValue: 123 }
  });
});
```

---

## 🎮 Current Dialogue Keys

These are the dialogue scenes already in the game:

| Key | When It Plays | Pages |
|-----|---------------|-------|
| `intro` | Game start (after PreloadScene) | 12 |
| `week_end_1` | After week 1 payment | 6 |
| `week_end_2` | After week 2 payment | 3 |
| `week_end_3` | After week 3+ payment | 3 |
| `debt_game_over` | When player can't pay debt | 6 |
| `insufficient_funds` | Warning when low on money | 4 |

---

## 🛠️ Advanced: Dynamic Dialogue

### **Branching Based on Game State:**

You can change which dialogue plays based on player actions:

```javascript
// In PaymentScene.js:
let dialogueKey;

if (this.farmToxicity > 50) {
  dialogueKey = 'high_corruption_ending';
} else if (this.currentCash > 1000) {
  dialogueKey = 'wealthy_farmer_scene';
} else {
  dialogueKey = 'normal_week_end';
}

this.scene.start('DialogueScene', {
  dialogueKey: dialogueKey,
  nextScene: 'GameScene'
});
```

### **Passing Data to Next Scene:**

```javascript
this.scene.start('DialogueScene', {
  dialogueKey: 'some_scene',
  nextScene: 'GameScene',
  nextSceneData: {
    newQuest: true,
    itemReceived: 'magic_key',
    cashBonus: 500
  }
});
```

In GameScene, retrieve with:

```javascript
init(data) {
  if (data.newQuest) {
    console.log('Starting new quest!');
  }
  if (data.cashBonus) {
    this.debtManager.addCash(data.cashBonus);
  }
}
```

---

## 📸 Adding Real Character Portraits

### **1. Create Your Art**

**Recommended specs:**
- **Size**: 200x300px (portrait orientation)
- **Format**: PNG with transparency
- **Expression variations**: neutral, happy, sad, angry, etc.

### **2. Export & Place Files**

```
assets/images/characters/portraits/
├── protagonist_neutral.png
├── protagonist_happy.png
├── protagonist_sad.png
├── the_man_neutral.png
├── the_man_smile.png
└── the_man_angry.png
```

### **3. Load in PreloadScene.js**

```javascript
// In preload() method:
this.load.image('protagonist_neutral', 'assets/images/characters/portraits/protagonist_neutral.png');
this.load.image('the_man_smile', 'assets/images/characters/portraits/the_man_smile.png');
// ... add all portraits
```

### **4. Update DialogueScene.js**

Replace placeholder portrait code (lines ~115-145) with:

```javascript
if (page.portrait && page.position === 'left') {
  this.leftPortrait.setVisible(true);

  // Remove placeholder, add real sprite
  if (this.leftPortraitSprite) this.leftPortraitSprite.destroy();

  this.leftPortraitSprite = this.scene.add.sprite(0, 0, page.portrait);
  this.leftPortrait.add(this.leftPortraitSprite);
}
```

---

## 🎨 Adding Custom Backgrounds

### **1. Create Background Image**

**Recommended specs:**
- **Size**: 1280x720px (game resolution)
- **Format**: PNG or JPG
- **Style**: Match game aesthetic

### **2. Place File**

```
assets/images/backgrounds/
├── my_custom_background.png
└── another_scene.png
```

### **3. Load in PreloadScene.js**

```javascript
// In preload() method:
this.load.image('my_bg', 'assets/images/backgrounds/my_custom_background.png');
```

### **4. Update DialogueScene.js**

In `createBackground()` method, replace placeholder with:

```javascript
createBackground() {
  const bgKey = this.dialogueData.background;

  if (this.textures.exists(bgKey)) {
    // Use real background image
    this.background = this.add.image(640, 360, bgKey);
    this.background.setDisplaySize(1280, 720);
  } else {
    // Fallback to colored rectangle
    const bgColor = this.getBackgroundColor(bgKey);
    this.background = this.add.rectangle(640, 360, 1280, 720, bgColor);
  }
}
```

### **5. Use in DialogueData.json**

```json
{
  "my_scene": {
    "background": "my_bg",
    "pages": [...]
  }
}
```

---

## ⚙️ Customizing Dialogue Appearance

### **Text Styles:**

Edit `DialogueScene.js` lines ~173-186:

```javascript
this.dialogueText = this.add.text(50, 570, '', {
  fontSize: '20px',           // ← Change size
  fontFamily: 'Georgia, serif', // ← Change font
  color: '#FFFFFF',           // ← Change color
  wordWrap: { width: 1180 },
  lineSpacing: 8,             // ← Line spacing
});
```

### **Dialogue Box:**

Edit `DialogueScene.js` lines ~99-108:

```javascript
createDialogueBox() {
  const boxHeight = 200;  // ← Change height
  const boxY = 720 - boxHeight;

  this.dialogueBoxBg.fillStyle(0x000000, 0.85);  // ← Color & opacity
  this.dialogueBoxBg.fillRect(0, boxY, 1280, boxHeight);
  this.dialogueBoxBg.lineStyle(4, 0xFFFFFF, 1);  // ← Border
}
```

### **Text Speed (Typewriter Effect):**

Not currently implemented, but you can add it by:

1. Storing full text in a variable
2. Using a timer to reveal characters one by one
3. Updating `this.dialogueText.setText()` each frame

---

## 🐛 Troubleshooting

### **"Dialogue key not found"**

**Error:** `[DialogueScene] Dialogue key 'my_scene' not found!`

**Fix:** Check spelling in `DialogueData.json`. Key names are case-sensitive.

---

### **Portrait not showing**

**Possible causes:**
1. Portrait key misspelled in DialogueData.json
2. Image not loaded in PreloadScene.js
3. Image file missing from assets folder

**Fix:** Check console for 404 errors. Verify file path.

---

### **Background is wrong color**

**Fix:** Edit `getBackgroundColor()` method in DialogueScene.js to add your background key:

```javascript
getBackgroundColor(bgName) {
  const colors = {
    'farm_exterior': 0x8B7355,
    'your_new_bg': 0xFF00FF,  // ← Add here
  };
  return colors[bgName] || 0x333333;
}
```

---

### **Dialogue won't advance**

**Fix:** Make sure you're clicking or pressing SPACE. Check browser console for errors.

---

## 📋 Quick Reference

### **Add New Dialogue (3 Steps):**

1. **Edit** `DialogueData.json` - Add new entry
2. **Trigger** from code - Call `scene.start('DialogueScene', {...})`
3. **Test** - Reload game and play through

### **Add New Character:**

1. **Edit** `DialogueScene.js` - Add to `characterNames` object
2. **Create** portraits (optional)
3. **Use** in DialogueData.json with `"character": "new_character"`

### **Add New Background:**

1. **Create** image (1280x720px)
2. **Place** in `assets/images/backgrounds/`
3. **Load** in PreloadScene.js
4. **Use** in DialogueData.json with `"background": "my_bg"`

---

## 🎯 Best Practices

### **Writing Dialogue:**

✅ **DO:**
- Keep pages under 200 characters
- Use `...` for dramatic pauses
- Break long monologues into multiple pages
- Mix narrator and character dialogue

❌ **DON'T:**
- Write 500-character walls of text
- Forget to test your dialogue in-game
- Use special characters that break JSON (`"` without escaping)

### **Organizing Dialogues:**

**Group related scenes:**

```json
{
  "week_1_intro": {...},
  "week_1_middle": {...},
  "week_1_end": {...},
  "week_2_intro": {...},
  ...
}
```

### **File Structure:**

```
src/data/
├── DialogueData.json       ← Main dialogue file
├── DialogueData_Week1.json ← (Optional) Split by chapter
└── DialogueData_Week2.json
```

You can load multiple JSON files if DialogueData.json gets too large.

---

## 📖 Example: Full Week Cycle

Here's a complete example of all dialogues for one week:

```json
{
  "week_4_start": {
    "background": "farm_day",
    "pages": [
      {
        "character": "narrator",
        "portrait": null,
        "text": "Week 4. The transformation is almost complete.",
        "position": "center"
      }
    ]
  },

  "week_4_payment": {
    "background": "farm_night",
    "pages": [
      {
        "character": "the_man",
        "portrait": "the_man_smile",
        "text": "You're doing well. Very well indeed.",
        "position": "right"
      },
      {
        "character": "protagonist",
        "portrait": "protagonist_corrupted_1",
        "text": "I don't feel well. What have you done to me?",
        "position": "left"
      },
      {
        "character": "the_man",
        "portrait": "the_man_neutral",
        "text": "I gave you exactly what you needed. Success.",
        "position": "right"
      }
    ]
  }
}
```

---

**That's everything!** You now have a fully modular dialogue system. Just edit JSON files to add new story content.

**Last Updated:** 2025-12-09
