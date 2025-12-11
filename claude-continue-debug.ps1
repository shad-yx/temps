# Claude Continue Agent - Debug Version for 12:23 AM
# This will click on Claude chat and send "continue"

$LogFile = "$PSScriptRoot\claude-continue-debug.log"
$TargetHour = 0
$TargetMinute = 23

function Log-Message {
    param([string]$Message)
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "[$Timestamp] $Message"
    Write-Host $LogEntry
    Add-Content -Path $LogFile -Value $LogEntry
}

function Send-ContinueCommand {
    try {
        Log-Message "🚀 STEP 1: Finding VS Code window..."
        Add-Type -AssemblyName System.Windows.Forms
        Add-Type -AssemblyName System.Drawing
        
        # Get all windows
        $processes = Get-Process | Where-Object { $_.ProcessName -eq "Code" -or $_.ProcessName -eq "code" }
        Log-Message "Found processes: $($processes.Count) VS Code instance(s)"
        
        if ($processes.Count -eq 0) {
            Log-Message "❌ VS Code not found! Make sure it's running."
            return $false
        }
        
        Log-Message "🚀 STEP 2: Activating VS Code window..."
        $mainWindow = $processes[0].MainWindowHandle
        Log-Message "Window handle: $mainWindow"
        
        # Activate the window using SetForegroundWindow
        [System.Runtime.InteropServices.Marshal]::GetDelegateForFunctionPointer(
            [System.Runtime.InteropServices.Marshal]::GetProcAddress(
                [System.Runtime.InteropServices.Marshal]::LoadLibrary('user32.dll'),
                'SetForegroundWindow'
            ),
            [type]'delegate int(IntPtr)'
        ).Invoke($mainWindow) | Out-Null
        
        Start-Sleep -Milliseconds 500
        Log-Message "✓ VS Code window activated"
        
        Log-Message "🚀 STEP 3: Typing 'continue' command..."
        # Type the command
        [System.Windows.Forms.SendKeys]::SendWait("continue")
        Start-Sleep -Milliseconds 200
        
        Log-Message "🚀 STEP 4: Pressing Enter..."
        # Press Enter
        [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
        Start-Sleep -Milliseconds 500
        
        Log-Message "✅ SUCCESS! Command sent to Claude!"
        return $true
        
    } catch {
        Log-Message "❌ Error: $_"
        Log-Message "Stack trace: $($_.ScriptStackTrace)"
        return $false
    }
}

function Main {
    Log-Message "=========================================="
    Log-Message "🤖 Claude Continue Agent - DEBUG MODE"
    Log-Message "Target Time: 12:23 AM"
    Log-Message "Current Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    Log-Message "=========================================="
    
    $CheckInterval = 2 # Check every 2 seconds
    
    while ($true) {
        $Now = Get-Date
        $TimeStr = $Now.ToString("HH:mm:ss")
        
        # Check if current time is 12:23 AM
        if ($Now.Hour -eq $TargetHour -and $Now.Minute -eq $TargetMinute) {
            Log-Message "⏰ TARGET TIME REACHED! $TimeStr"
            Log-Message "Executing command..."
            
            $success = Send-ContinueCommand
            
            if ($success) {
                Log-Message "✅ Mission accomplished!"
                Log-Message "Agent will exit now."
                Start-Sleep -Seconds 2
                exit 0
            } else {
                Log-Message "⚠️ Command failed, retrying..."
                Start-Sleep -Seconds 5
            }
        }
        
        Start-Sleep -Seconds $CheckInterval
    }
}

Main
