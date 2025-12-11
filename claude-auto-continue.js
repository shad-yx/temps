const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Configuration
const TARGET_HOUR = 4;
const TARGET_MINUTE = 0;
const CHECK_INTERVAL = 60000; // Check every minute
const LOG_FILE = path.join(__dirname, 'claude-continue.log');

function log(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  console.log(logEntry);
  fs.appendFileSync(LOG_FILE, logEntry);
}

function getCurrentTime() {
  return new Date();
}

function shouldExecute(now) {
  return now.getHours() === TARGET_HOUR && now.getMinutes() === TARGET_MINUTE;
}

function sendContinueCommand() {
  try {
    log('🚀 Executing: Sending "continue" command to Claude...');
    
    // Method: Use xdotool on Linux/Mac or SendInput simulation on Windows
    // For Windows, we'll use PowerShell to simulate typing
    const psCommand = `
      Add-Type -AssemblyName System.Windows.Forms
      [System.Windows.Forms.SendKeys]::SendWait('continue')
      [System.Windows.Forms.SendKeys]::SendWait('{ENTER}')
    `;
    
    const powershell = spawn('powershell.exe', ['-Command', psCommand], {
      stdio: 'pipe'
    });

    powershell.on('error', (err) => {
      log(`❌ Error sending command: ${err.message}`);
    });

    powershell.on('close', (code) => {
      if (code === 0) {
        log('✅ Command sent successfully!');
      } else {
        log(`⚠️  PowerShell exited with code: ${code}`);
      }
    });

  } catch (error) {
    log(`❌ Error: ${error.message}`);
  }
}

function main() {
  log('='.repeat(60));
  log('🤖 Claude Auto-Continue Agent Started');
  log(`⏰ Watching for 4:00 AM daily to send "continue" command`);
  log('='.repeat(60));

  let lastExecution = null;

  setInterval(() => {
    const now = getCurrentTime();
    
    // Check if it's 4 AM and we haven't executed in the last minute
    if (shouldExecute(now)) {
      const executionKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
      
      if (lastExecution !== executionKey) {
        log(`⏰ Time: ${now.toLocaleTimeString()} - EXECUTING NOW!`);
        sendContinueCommand();
        lastExecution = executionKey; // Prevent duplicate executions today
      }
    }
  }, CHECK_INTERVAL);

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    log('⛔ Agent shutting down...');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    log('⛔ Agent terminated...');
    process.exit(0);
  });
}

main();
