# Agent - Type "continue" in VS Code Terminal
# Clicks in the terminal area and types the command

$LogFile = "$PSScriptRoot\claude-continue-claude-chat.log"
$TargetHour = 0
$TargetMinute = 42

function Log-Message {
    param([string]$Message)
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "[$Timestamp] $Message"
    Write-Host $LogEntry
    Add-Content -Path $LogFile -Value $LogEntry -Force
}

function Send-ContinueToClaude {
    try {
        Log-Message "🚀 Sending 'continue' to Claude chat (NOT terminal)..."
        
        Add-Type -AssemblyName System.Windows.Forms
        
        $code = @"
[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern void SetCursorPos(int X, int Y);

[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo);
"@
        Add-Type -MemberDefinition $code -Name Win32 -Namespace System -ErrorAction SilentlyContinue
        
        # Bring VS Code to foreground
        Log-Message "Step 0: Bringing VS Code to foreground..."
        $vscodeProc = Get-Process -Name "Code" -ErrorAction SilentlyContinue
        if ($vscodeProc) {
            [System.Win32]::SetForegroundWindow($vscodeProc.MainWindowHandle) | Out-Null
            Start-Sleep -Milliseconds 500
            Log-Message "✓ VS Code focused"
        }
        
        # Move mouse to textbox
        Log-Message "Step 1: Moving mouse to textbox (500, 680)..."
        [System.Win32]::SetCursorPos(500, 680)
        Start-Sleep -Milliseconds 300
        Log-Message "✓ Mouse positioned"
        
        # Triple-click to select textbox
        Log-Message "Step 2: TRIPLE CLICKING to select textbox..."
        for ($i = 0; $i -lt 3; $i++) {
            [System.Win32]::mouse_event(2, 0, 0, 0, 0)  # LEFTDOWN
            Start-Sleep -Milliseconds 50
            [System.Win32]::mouse_event(4, 0, 0, 0, 0)  # LEFTUP
            Start-Sleep -Milliseconds 100
        }
        Start-Sleep -Milliseconds 500
        Log-Message "✓ TRIPLE CLICKED - Textbox focused"
        
        # Type "continue"
        Log-Message "Step 3: Typing 'continue'..."
        [System.Windows.Forms.SendKeys]::SendWait("continue")
        Start-Sleep -Milliseconds 400
        Log-Message "✓ Typed 'continue'"
        
        # Press Enter
        Log-Message "Step 4: Pressing ENTER..."
        [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
        Start-Sleep -Milliseconds 600
        Log-Message "✓ ENTERED - Message sent!"
        
        Log-Message "✅ SUCCESS! 'continue' typed in Claude chat!"
        return $true
        
    } catch {
        Log-Message "❌ Error: $_"
        return $false
    }
}

function Main {
    Log-Message "=========================================="
    Log-Message "🤖 Claude Continue - Claude Chat"
    Log-Message "Target: 00:42 AM (12:42 AM)"
    Log-Message "Location: Claude chat textbox (500, 680) - THE RED BOX"
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
                
                $success = Send-ContinueToClaude
                
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
