# Claude Continue Agent - System Time Aware
# Syncs with system clock and triggers at exact time

$LogFile = "$PSScriptRoot\claude-continue-system-time.log"
$TargetHour = 0
$TargetMinute = 25

function Log-Message {
    param([string]$Message)
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss.fff"
    $LogEntry = "[$Timestamp] $Message"
    Write-Host $LogEntry
    Add-Content -Path $LogFile -Value $LogEntry -Force
}

function Send-ContinueCommand {
    try {
        Log-Message "🚀 EXECUTING: Sending 'continue' command..."
        
        Add-Type -AssemblyName System.Windows.Forms
        Add-Type -AssemblyName System.Drawing
        
        # Find VS Code
        $vscodeProcesses = @()
        $vscodeProcesses += Get-Process -Name "Code" -ErrorAction SilentlyContinue
        $vscodeProcesses += Get-Process -Name "code" -ErrorAction SilentlyContinue
        
        Log-Message "Found $($vscodeProcesses.Count) VS Code instance(s)"
        
        if ($vscodeProcesses.Count -eq 0) {
            Log-Message "❌ VS Code not running!"
            return $false
        }
        
        $mainWindow = $vscodeProcesses[0].MainWindowHandle
        Log-Message "Window handle: $mainWindow"
        
        if ($mainWindow -eq 0) {
            Log-Message "❌ Could not get window handle!"
            return $false
        }
        
        # Activate window
        $code = @"
[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern bool SetForegroundWindow(IntPtr hWnd);
[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
"@
        Add-Type -MemberDefinition $code -Name Win32 -Namespace System -ErrorAction SilentlyContinue
        
        Log-Message "Activating VS Code window..."
        [System.Win32]::ShowWindow($mainWindow, 5) | Out-Null
        [System.Win32]::SetForegroundWindow($mainWindow) | Out-Null
        
        Start-Sleep -Milliseconds 800
        Log-Message "✓ Window activated"
        
        # Click on chat input area to ensure focus
        Log-Message "Clicking on chat input..."
        [System.Windows.Forms.SendKeys]::SendWait(" ")
        [System.Windows.Forms.SendKeys]::SendWait("{BACKSPACE}")
        Start-Sleep -Milliseconds 200
        
        # Type the command
        Log-Message "Typing 'continue'..."
        foreach ($char in "continue".ToCharArray()) {
            [System.Windows.Forms.SendKeys]::SendWait($char)
            Start-Sleep -Milliseconds 50
        }
        Start-Sleep -Milliseconds 300
        
        # Press Enter
        Log-Message "Pressing Enter..."
        [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
        
        Start-Sleep -Milliseconds 500
        Log-Message "✅ SUCCESS! 'continue' command sent to Claude!"
        return $true
        
    } catch {
        Log-Message "❌ Error: $_"
        return $false
    }
}

function Main {
    Log-Message "=========================================="
    Log-Message "🤖 Claude Continue Agent - SYSTEM TIME SYNC"
    Log-Message "Target: 00:25 AM (12:25 AM)"
    Log-Message "=========================================="
    
    # Check every second for precision
    $lastExecutedDate = $null
    $CheckInterval = 1000  # Check every 1 second
    
    while ($true) {
        $Now = Get-Date
        $CurrentHour = $Now.Hour
        $CurrentMinute = $Now.Minute
        $CurrentSecond = $Now.Second
        
        # Display current time every 10 seconds
        if ($CurrentSecond -eq 0) {
            Log-Message "Current System Time: $($Now.ToString('HH:mm:ss'))"
        }
        
        # Check if we've reached the target time
        if ($CurrentHour -eq $TargetHour -and $CurrentMinute -eq $TargetMinute) {
            $ExecutionDate = $Now.Date.ToString("yyyy-MM-dd")
            
            # Execute only once per day at this time
            if ($lastExecutedDate -ne $ExecutionDate) {
                Log-Message ""
                Log-Message "🎯 TARGET TIME REACHED! $($Now.ToString('HH:mm:ss'))"
                Log-Message ""
                
                $success = Send-ContinueCommand
                
                if ($success) {
                    Log-Message ""
                    Log-Message "✅ MISSION COMPLETE!"
                    Log-Message "Agent will now exit."
                    $lastExecutedDate = $ExecutionDate
                    Start-Sleep -Seconds 3
                    exit 0
                } else {
                    Log-Message "⚠️ Retrying..."
                    Start-Sleep -Milliseconds 2000
                }
            }
        }
        
        Start-Sleep -Milliseconds $CheckInterval
    }
}

Main
