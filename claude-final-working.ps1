# Final Working Agent - Clipboard Paste at Exact Coordinates
# Click at (1280, 400), paste "continue" from clipboard, send

$LogFile = "$PSScriptRoot\claude-final-working.log"
$TargetHour = 0
$TargetMinute = 41

function Log-Message {
    param([string]$Message)
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "[$Timestamp] $Message"
    Write-Host $LogEntry
    Add-Content -Path $LogFile -Value $LogEntry -Force
}

function Send-ContinueCommand {
    try {
        Log-Message "🚀 Sending 'continue' command..."
        
        Add-Type -AssemblyName System.Windows.Forms
        
        $code = @"
[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern void SetCursorPos(int X, int Y);

[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo);
"@
        Add-Type -MemberDefinition $code -Name Win32 -Namespace System -ErrorAction SilentlyContinue
        
        # Move to Claude chat input location (user-specified)
        Log-Message "Step 1: Moving mouse to (1280, 400)..."
        [System.Win32]::SetCursorPos(1280, 400)
        Start-Sleep -Milliseconds 400
        Log-Message "✓ Mouse positioned"
        
        # Triple-click to select any existing text
        Log-Message "Step 2: Triple-clicking to select text..."
        for ($i = 0; $i -lt 3; $i++) {
            [System.Win32]::mouse_event(2, 0, 0, 0, 0)  # Down
            Start-Sleep -Milliseconds 40
            [System.Win32]::mouse_event(4, 0, 0, 0, 0)  # Up
            Start-Sleep -Milliseconds 60
        }
        Start-Sleep -Milliseconds 300
        Log-Message "✓ Triple-clicked"
        
        # Copy "continue" to clipboard
        Log-Message "Step 3: Setting clipboard..."
        "continue" | Set-Clipboard
        Start-Sleep -Milliseconds 200
        Log-Message "✓ Clipboard ready"
        
        # Paste
        Log-Message "Step 4: Pasting from clipboard..."
        [System.Windows.Forms.SendKeys]::SendWait("^v")
        Start-Sleep -Milliseconds 400
        Log-Message "✓ Pasted 'continue'"
        
        # Send with Enter
        Log-Message "Step 5: Pressing Enter..."
        [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
        Start-Sleep -Milliseconds 600
        Log-Message "✓ Sent!"
        
        Log-Message "✅ SUCCESS! 'continue' command sent!"
        return $true
        
    } catch {
        Log-Message "❌ Error: $_"
        return $false
    }
}

function Main {
    Log-Message "=========================================="
    Log-Message "🤖 Claude Continue - Final Working Version"
    Log-Message "Target: 00:41 AM (12:41 AM)"
    Log-Message "Location: (1280, 400) - Claude chat input"
    Log-Message "=========================================="
    
    $lastExecutedDate = $null
    
    while ($true) {
        $Now = Get-Date
        
        if ($Now.Hour -eq $TargetHour -and $Now.Minute -eq $TargetMinute) {
            $ExecutionDate = $Now.Date.ToString("yyyy-MM-dd")
            
            if ($lastExecutedDate -ne $ExecutionDate) {
                Log-Message ""
                Log-Message "🎯 TARGET TIME: $($Now.ToString('HH:mm:ss'))"
                Log-Message ""
                
                $success = Send-ContinueCommand
                
                if ($success) {
                    Log-Message ""
                    Log-Message "✅ COMPLETE! Exiting..."
                    $lastExecutedDate = $ExecutionDate
                    Start-Sleep -Seconds 3
                    exit 0
                } else {
                    Log-Message "Retrying in 15 seconds..."
                    Start-Sleep -Seconds 15
                }
            }
        }
        
        Start-Sleep -Seconds 1
    }
}

Main
