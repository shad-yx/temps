# Claude Continue Agent - IMMEDIATE TEST VERSION
# This will run RIGHT NOW so we can test it

$LogFile = "$PSScriptRoot\claude-continue-test.log"

function Log-Message {
    param([string]$Message)
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "[$Timestamp] $Message"
    Write-Host $LogEntry
    Add-Content -Path $LogFile -Value $LogEntry -Force
}

function Send-ContinueCommand {
    try {
        Log-Message "========== STARTING COMMAND EXECUTION =========="
        
        Log-Message "STEP 1: Loading assemblies..."
        Add-Type -AssemblyName System.Windows.Forms
        Add-Type -AssemblyName System.Drawing
        Log-Message "✓ Assemblies loaded"
        
        Log-Message "STEP 2: Finding VS Code..."
        $vscodeProcesses = @()
        $vscodeProcesses += Get-Process -Name "Code" -ErrorAction SilentlyContinue
        $vscodeProcesses += Get-Process -Name "code" -ErrorAction SilentlyContinue
        
        Log-Message "Found $($vscodeProcesses.Count) VS Code process(es)"
        
        if ($vscodeProcesses.Count -eq 0) {
            Log-Message "❌ ERROR: VS Code not running!"
            return $false
        }
        
        Log-Message "STEP 3: Getting window handle..."
        $mainWindow = $vscodeProcesses[0].MainWindowHandle
        Log-Message "Window handle: $mainWindow"
        
        if ($mainWindow -eq 0) {
            Log-Message "❌ ERROR: Could not get window handle!"
            return $false
        }
        
        Log-Message "STEP 4: Activating VS Code window..."
        [System.Reflection.Assembly]::LoadWithPartialName("System.Windows.Forms") | Out-Null
        
        # Use P/Invoke to set foreground window
        $code = @"
[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern bool SetForegroundWindow(IntPtr hWnd);
"@
        Add-Type -MemberDefinition $code -Name Win32 -Namespace System
        [System.Win32]::SetForegroundWindow($mainWindow) | Out-Null
        
        Start-Sleep -Milliseconds 1000
        Log-Message "✓ VS Code window activated"
        
        Log-Message "STEP 5: Clearing any existing input..."
        [System.Windows.Forms.SendKeys]::SendWait("^a")  # Select all
        Start-Sleep -Milliseconds 100
        [System.Windows.Forms.SendKeys]::SendWait("{DELETE}")  # Delete
        Start-Sleep -Milliseconds 100
        
        Log-Message "STEP 6: Typing 'continue'..."
        [System.Windows.Forms.SendKeys]::SendWait("continue")
        Start-Sleep -Milliseconds 500
        Log-Message "✓ Typed 'continue'"
        
        Log-Message "STEP 7: Pressing Enter..."
        [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
        Start-Sleep -Milliseconds 500
        Log-Message "✓ Pressed Enter"
        
        Log-Message "========== SUCCESS! =========="
        Log-Message "The 'continue' command has been sent to Claude!"
        return $true
        
    } catch {
        Log-Message "❌ EXCEPTION ERROR: $_"
        Log-Message "Stack trace: $($_.ScriptStackTrace)"
        return $false
    }
}

# Run immediately
Log-Message "=========================================="
Log-Message "🤖 Claude Continue Agent - IMMEDIATE TEST"
Log-Message "Current Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Log-Message "=========================================="

$success = Send-ContinueCommand

if ($success) {
    Log-Message ""
    Log-Message "✅ TEST COMPLETE - Command was sent!"
} else {
    Log-Message ""
    Log-Message "❌ TEST FAILED - Check the log above"
}

Log-Message "Agent exiting..."
Start-Sleep -Seconds 3
exit 0
