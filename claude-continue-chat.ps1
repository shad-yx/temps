# Claude Continue Agent - Targeted Chat Input
# Clicks directly on the Claude chat input and sends "continue"

$LogFile = "$PSScriptRoot\claude-continue-chat.log"
$TargetHour = 0
$TargetMinute = 27

function Log-Message {
    param([string]$Message)
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss.fff"
    $LogEntry = "[$Timestamp] $Message"
    Write-Host $LogEntry
    Add-Content -Path $LogFile -Value $LogEntry -Force
}

function Send-ContinueCommand {
    try {
        Log-Message "🚀 EXECUTING: Targeting Claude chat input..."
        
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
        
        # P/Invoke for window control
        $code = @"
[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern bool SetForegroundWindow(IntPtr hWnd);
[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern void SetCursorPos(int X, int Y);
[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo);
"@
        Add-Type -MemberDefinition $code -Name Win32 -Namespace System -ErrorAction SilentlyContinue
        
        Log-Message "Activating VS Code window..."
        [System.Win32]::ShowWindow($mainWindow, 5) | Out-Null
        [System.Win32]::SetForegroundWindow($mainWindow) | Out-Null
        Start-Sleep -Milliseconds 1000
        Log-Message "✓ Window activated"
        
        # Click on the chat input area (approximate center-bottom of VS Code)
        # The chat input is typically at the bottom of the right panel
        Log-Message "Clicking on chat input area..."
        
        # Move mouse to approximate chat input location (bottom right area)
        # Standard VS Code layout: chat panel is on the right, input at bottom
        [System.Win32]::SetCursorPos(1300, 680)
        Start-Sleep -Milliseconds 300
        
        # Simulate left mouse click (LEFTUP = 4, LEFTDOWN = 2)
        [System.Win32]::mouse_event(2, 0, 0, 0, 0)  # Mouse down
        Start-Sleep -Milliseconds 50
        [System.Win32]::mouse_event(4, 0, 0, 0, 0)  # Mouse up
        Start-Sleep -Milliseconds 500
        
        Log-Message "✓ Clicked on chat input"
        
        # Ensure the input field is focused and clear
        Log-Message "Clearing input field..."
        [System.Windows.Forms.SendKeys]::SendWait("^a")  # Ctrl+A to select all
        Start-Sleep -Milliseconds 100
        
        # Type the command slowly for reliability
        Log-Message "Typing 'continue' into chat input..."
        foreach ($char in "continue".ToCharArray()) {
            [System.Windows.Forms.SendKeys]::SendWait($char)
            Start-Sleep -Milliseconds 80
        }
        
        Start-Sleep -Milliseconds 400
        Log-Message "✓ Text entered"
        
        # Press Enter to send
        Log-Message "Pressing Enter to send command..."
        [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
        Start-Sleep -Milliseconds 1000
        
        Log-Message "✅ SUCCESS! 'continue' command sent to Claude chat!"
        return $true
        
    } catch {
        Log-Message "❌ Error: $_"
        Log-Message "Stack: $($_.ScriptStackTrace)"
        return $false
    }
}

function Main {
    Log-Message "=========================================="
    Log-Message "🤖 Claude Continue Agent - Chat Input Targeted"
    Log-Message "Target: 00:27 AM (12:27 AM)"
    Log-Message "=========================================="
    
    $lastExecutedDate = $null
    $CheckInterval = 1000
    
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
            
            if ($lastExecutedDate -ne $ExecutionDate) {
                Log-Message ""
                Log-Message "🎯 TARGET TIME REACHED! $($Now.ToString('HH:mm:ss'))"
                Log-Message ""
                
                $success = Send-ContinueCommand
                
                if ($success) {
                    Log-Message ""
                    Log-Message "✅ MISSION COMPLETE!"
                    Log-Message "Exiting agent..."
                    $lastExecutedDate = $ExecutionDate
                    Start-Sleep -Seconds 2
                    exit 0
                } else {
                    Log-Message "⚠️ Retrying in 5 seconds..."
                    Start-Sleep -Milliseconds 5000
                }
            }
        }
        
        Start-Sleep -Milliseconds $CheckInterval
    }
}

Main
