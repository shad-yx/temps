# Claude Continue Agent - Clipboard Paste Method
# Uses clipboard to paste "continue" into Claude chat

$LogFile = "$PSScriptRoot\claude-continue-clipboard.log"
$TargetHour = 0
$TargetMinute = 36

function Log-Message {
    param([string]$Message)
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "[$Timestamp] $Message"
    Write-Host $LogEntry
    Add-Content -Path $LogFile -Value $LogEntry -Force
}

function Send-ContinueWithClipboard {
    try {
        Log-Message "🚀 Starting clipboard paste method..."
        
        Add-Type -AssemblyName System.Windows.Forms
        
        # P/Invoke for mouse control
        $code = @"
[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern void SetCursorPos(int X, int Y);

[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo);

[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern bool SetForegroundWindow(IntPtr hWnd);
"@
        Add-Type -MemberDefinition $code -Name Win32 -Namespace System -ErrorAction SilentlyContinue
        
        # Find VS Code
        $vscode = Get-Process -Name "Code" -ErrorAction SilentlyContinue
        if ($vscode) {
            Log-Message "Bringing VS Code to foreground..."
            [System.Win32]::SetForegroundWindow($vscode.MainWindowHandle) | Out-Null
            Start-Sleep -Milliseconds 500
        }
        
        Log-Message "Step 1: Moving mouse to Claude chat input..."
        [System.Win32]::SetCursorPos(1280, 690)
        Start-Sleep -Milliseconds 400
        Log-Message "✓ Mouse moved"
        
        Log-Message "Step 2: Triple-clicking to select all text in input..."
        # Triple click to select all text in the field
        [System.Win32]::mouse_event(2, 0, 0, 0, 0)  # Down
        Start-Sleep -Milliseconds 50
        [System.Win32]::mouse_event(4, 0, 0, 0, 0)  # Up
        Start-Sleep -Milliseconds 80
        
        [System.Win32]::mouse_event(2, 0, 0, 0, 0)  # Down
        Start-Sleep -Milliseconds 50
        [System.Win32]::mouse_event(4, 0, 0, 0, 0)  # Up
        Start-Sleep -Milliseconds 80
        
        [System.Win32]::mouse_event(2, 0, 0, 0, 0)  # Down
        Start-Sleep -Milliseconds 50
        [System.Win32]::mouse_event(4, 0, 0, 0, 0)  # Up
        
        Start-Sleep -Milliseconds 300
        Log-Message "✓ Triple-clicked"
        
        Log-Message "Step 3: Copying 'continue' to clipboard..."
        # Put "continue" on clipboard
        "continue" | Set-Clipboard
        Start-Sleep -Milliseconds 200
        Log-Message "✓ Clipboard set"
        
        Log-Message "Step 4: Pasting from clipboard..."
        # Paste from clipboard
        [System.Windows.Forms.SendKeys]::SendWait("^v")
        Start-Sleep -Milliseconds 500
        Log-Message "✓ Pasted 'continue'"
        
        Log-Message "Step 5: Pressing Enter to send..."
        [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
        Start-Sleep -Milliseconds 800
        Log-Message "✓ Pressed Enter"
        
        Log-Message "✅ SUCCESS! Command sent via clipboard paste!"
        return $true
        
    } catch {
        Log-Message "❌ Error: $_"
        Log-Message "Stack: $($_.ScriptStackTrace)"
        return $false
    }
}

function Main {
    Log-Message "=========================================="
    Log-Message "🤖 Claude Continue - Clipboard Paste"
    Log-Message "Target: 00:36 AM (12:36 AM)"
    Log-Message "=========================================="
    Log-Message "Method: Triple-click, paste from clipboard, Enter"
    Log-Message ""
    
    $lastExecutedDate = $null
    
    while ($true) {
        $Now = Get-Date
        $CurrentHour = $Now.Hour
        $CurrentMinute = $Now.Minute
        $CurrentSecond = $Now.Second
        
        # Display time
        if ($CurrentSecond -eq 0) {
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
                
                $success = Send-ContinueWithClipboard
                
                if ($success) {
                    Log-Message ""
                    Log-Message "✅ MISSION COMPLETE!"
                    Log-Message "Exiting..."
                    $lastExecutedDate = $ExecutionDate
                    Start-Sleep -Seconds 3
                    exit 0
                } else {
                    Log-Message ""
                    Log-Message "⚠️ Failed. Retrying in 20 seconds..."
                    Start-Sleep -Seconds 20
                }
            }
        }
        
        Start-Sleep -Seconds 1
    }
}

Main
