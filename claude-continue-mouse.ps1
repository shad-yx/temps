# Claude Continue Agent - Visual Mouse/Click Method
# Moves mouse to Claude chat input, clicks it, and types there

$LogFile = "$PSScriptRoot\claude-continue-mouse.log"
$TargetHour = 0
$TargetMinute = 34

function Log-Message {
    param([string]$Message)
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "[$Timestamp] $Message"
    Write-Host $LogEntry
    Add-Content -Path $LogFile -Value $LogEntry -Force
}

function Send-ContinueWithMouse {
    try {
        Log-Message "🚀 Starting mouse-based input..."
        
        Add-Type -AssemblyName System.Windows.Forms
        Add-Type -AssemblyName System.Drawing
        
        # P/Invoke for mouse control
        $code = @"
[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern void SetCursorPos(int X, int Y);

[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo);
"@
        Add-Type -MemberDefinition $code -Name Win32 -Namespace System -ErrorAction SilentlyContinue
        
        # Claude chat input is typically at the bottom right of VS Code
        # We'll move to that location
        Log-Message "Step 1: Moving mouse to Claude chat input area..."
        Log-Message "Target position: X=1280, Y=690 (bottom right area of VS Code)"
        
        [System.Win32]::SetCursorPos(1280, 690)
        Start-Sleep -Milliseconds 300
        Log-Message "✓ Mouse moved"
        
        Log-Message "Step 2: Clicking on the input area..."
        # Left mouse button down
        [System.Win32]::mouse_event(2, 0, 0, 0, 0)
        Start-Sleep -Milliseconds 100
        # Left mouse button up
        [System.Win32]::mouse_event(4, 0, 0, 0, 0)
        Start-Sleep -Milliseconds 500
        Log-Message "✓ Clicked"
        
        Log-Message "Step 3: Selecting all text in the field..."
        [System.Windows.Forms.SendKeys]::SendWait("^a")
        Start-Sleep -Milliseconds 100
        Log-Message "✓ Selected"
        
        Log-Message "Step 4: Typing 'continue'..."
        $continue = "continue"
        foreach ($char in $continue.ToCharArray()) {
            [System.Windows.Forms.SendKeys]::SendWait($char)
            Start-Sleep -Milliseconds 80
        }
        Start-Sleep -Milliseconds 400
        Log-Message "✓ Typed 'continue'"
        
        Log-Message "Step 5: Pressing Enter..."
        [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
        Start-Sleep -Milliseconds 800
        Log-Message "✓ Pressed Enter"
        
        Log-Message "✅ SUCCESS! Command sent with mouse click method!"
        return $true
        
    } catch {
        Log-Message "❌ Error: $_"
        Log-Message "Stack: $($_.ScriptStackTrace)"
        return $false
    }
}

function Main {
    Log-Message "=========================================="
    Log-Message "🤖 Claude Continue - Mouse Click Method"
    Log-Message "Target: 00:34 AM (12:34 AM)"
    Log-Message "=========================================="
    Log-Message "Method: Click on chat input, type, and send"
    Log-Message ""
    
    $lastExecutedDate = $null
    
    while ($true) {
        $Now = Get-Date
        $CurrentHour = $Now.Hour
        $CurrentMinute = $Now.Minute
        $CurrentSecond = $Now.Second
        
        # Display time every 30 seconds
        if ($CurrentSecond -eq 0 -and $CurrentMinute % 1 -eq 0) {
            Log-Message "Status: Waiting... Time: $($Now.ToString('HH:mm:ss'))"
        }
        
        # Check if we've reached target time
        if ($CurrentHour -eq $TargetHour -and $CurrentMinute -eq $TargetMinute) {
            $ExecutionDate = $Now.Date.ToString("yyyy-MM-dd")
            
            if ($lastExecutedDate -ne $ExecutionDate) {
                Log-Message ""
                Log-Message "🎯 TARGET TIME REACHED: $($Now.ToString('HH:mm:ss'))"
                Log-Message "=========================================="
                Log-Message ""
                
                $success = Send-ContinueWithMouse
                
                if ($success) {
                    Log-Message ""
                    Log-Message "✅ MISSION COMPLETE!"
                    Log-Message "Agent exiting..."
                    $lastExecutedDate = $ExecutionDate
                    Start-Sleep -Seconds 3
                    exit 0
                } else {
                    Log-Message ""
                    Log-Message "⚠️ Failed. Retrying in 15 seconds..."
                    Start-Sleep -Seconds 15
                }
            }
        }
        
        Start-Sleep -Seconds 1
    }
}

Main
