# 🚀 How To Start The New Server

## ⚠️ IMPORTANT: Switch to New Server

The old `npx http-server` doesn't have:
- ❌ Asset scanning
- ❌ Save/load APIs
- ❌ Project management

The NEW `server.js` has:
- ✅ Real asset folder scanning
- ✅ Save/load projects
- ✅ Auto-save
- ✅ Multiple projects

## 🔄 Step 1: Stop Old Server

If you have `npx http-server` running:

```bash
# Press Ctrl+C in that terminal
# OR close the terminal window
```

## ▶️ Step 2: Start New Server

```bash
# Navigate to project folder
cd c:\Users\shady\OneDrive\Documents\phaser\temps

# Start new server
node server.js
```

You should see:

```
═══════════════════════════════════════════════════
   🎮 DEADDAY Development Server v2.0
═══════════════════════════════════════════════════
   Running at: http://127.0.0.1:8000

   🎨 Builder:  http://127.0.0.1:8000/builder.html
   🎬 Game:     http://127.0.0.1:8000/game.html

   📁 Features:
   ✅ Real asset folder scanning
   ✅ Project save/load system
   ✅ Auto-save (every 30s)
   ✅ Multiple project support

   🔌 API Endpoints:
   - GET  /api/scan-assets
   - GET  /api/projects
   - POST /api/save-project
   - GET  /api/load-project/:name

   Press Ctrl+C to stop
═══════════════════════════════════════════════════
```

## ✅ Step 3: Verify It's Working

Open browser:
- Builder: http://127.0.0.1:8000/builder.html
- Game: http://127.0.0.1:8000/game.html

Check server console - you should see:
```
[GET] /builder.html
[GET] /editor/UnifiedBuilder.js
[GET] /api/scan-assets
[API] Scanned 5 assets
```

## 🐛 Troubleshooting

### "Port 8000 is already in use"

**Problem:** Old server still running

**Fix:**
```bash
# Windows
npx kill-port 8000

# Then start new server
node server.js
```

### "node: command not found"

**Problem:** Node.js not installed

**Fix:**
1. Download from: https://nodejs.org/
2. Install Node.js
3. Restart terminal
4. Try again: `node server.js`

### "Cannot find module"

**Problem:** Running from wrong folder

**Fix:**
```bash
# Make sure you're in temps folder
cd c:\Users\shady\OneDrive\Documents\phaser\temps

# Check you see server.js
dir server.js

# Then start
node server.js
```

## 📝 Daily Workflow

### Every Time You Work on Your Game:

1. **Open terminal**
   ```bash
   cd c:\Users\shady\OneDrive\Documents\phaser\temps
   node server.js
   ```

2. **Open browser**
   - Go to: http://127.0.0.1:8000/builder.html

3. **Work on your game**
   - Changes auto-save every 30 seconds
   - Click "💾 Save Project" to save manually
   - Assets refresh automatically

4. **When done**
   - Press Ctrl+C in terminal to stop server
   - Your progress is saved in `projects/` folder!

## ✅ What's Fixed Now

### Asset System
- ✅ Scans `assets/` folder in real-time
- ✅ Click "🔄 Refresh Assets" to reload
- ✅ Drag & drop any image/audio you add
- ✅ No need to edit code!

### Save System
- ✅ Projects saved to `projects/*.json` files
- ✅ Load any saved project
- ✅ Switch between projects
- ✅ NO MORE LOSING PROGRESS!

### Next Steps
- See `BUILD_SYSTEM_EXPLAINED.md` for full details
- See `VISUAL_EDITOR_GUIDE.md` for editor usage
