# Claude Continue Agent - Targeted VS Code Window
# Finds VS Code window, then clicks Claude chat input within it

$LogFile = "$PSScriptRoot\claude-continue-vscode.log"
$TargetHour = 0
$TargetMinute = 39

function Log-Message {
    param([string]$Message)
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "[$Timestamp] $Message"
    Write-Host $LogEntry
    Add-Content -Path $LogFile -Value $LogEntry -Force
}

function Send-ContinueToVSCode {
    try {
        Log-Message "🚀 Starting VS Code targeted method..."
        
        Add-Type -AssemblyName System.Windows.Forms
        Add-Type -AssemblyName System.Drawing
        
        # P/Invoke for window and mouse control
        $code = @"
[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);

[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern bool SetForegroundWindow(IntPtr hWnd);

[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);

[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern void SetCursorPos(int X, int Y);

[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo);

[System.Runtime.InteropServices.StructLayout(System.Runtime.InteropServices.LayoutKind.Sequential)]
public struct RECT {
    public int Left;
    public int Top;
    public int Right;
    public int Bottom;
}
"@
        Add-Type -MemberDefinition $code -Name Win32 -Namespace System -ErrorAction SilentlyContinue
        
        Log-Message "Step 1: Finding VS Code window..."
        $vscodeProcess = Get-Process -Name "Code" -ErrorAction SilentlyContinue
        if (-not $vscodeProcess) {
            Log-Message "❌ VS Code not found"
            return $false
        }
        
        $vscodeHwnd = $vscodeProcess.MainWindowHandle
        Log-Message "✓ Found VS Code (Handle: $vscodeHwnd)"
        
        Log-Message "Step 2: Bringing VS Code to foreground..."
        [System.Win32]::SetForegroundWindow($vscodeHwnd) | Out-Null
        Start-Sleep -Milliseconds 800
        Log-Message "✓ VS Code in foreground"
        
        Log-Message "Step 3: Getting VS Code window position..."
        $rect = New-Object System.Win32.RECT
        [System.Win32]::GetWindowRect($vscodeHwnd, [ref]$rect) | Out-Null
        
        $windowWidth = $rect.Right - $rect.Left
        $windowHeight = $rect.Bottom - $rect.Top
        
        Log-Message "VS Code Window: Position ($($rect.Left), $($rect.Top)) Size ($windowWidth x $windowHeight)"
        
        # Claude chat input is in the right panel, middle area (based on user location)
        # The input field is approximately in the center-right of the screen
        $chatInputX = 1280  # Right panel, center area
        $chatInputY = 400   # Middle of the panel
        
        Log-Message "Step 4: Moving mouse to Claude chat input area..."
        Log-Message "Window: Left=$($rect.Left) Top=$($rect.Top) Width=$windowWidth Height=$windowHeight"
        Log-Message "Target coordinates: ($chatInputX, $chatInputY)"
        
        [System.Win32]::SetCursorPos($chatInputX, $chatInputY)
        Start-Sleep -Milliseconds 500
        Log-Message "✓ Mouse positioned"
        
        Log-Message "Step 5: Clicking on chat input..."
        # Left click
        [System.Win32]::mouse_event(2, 0, 0, 0, 0)  # Down
        Start-Sleep -Milliseconds 100
        [System.Win32]::mouse_event(4, 0, 0, 0, 0)  # Up
        Start-Sleep -Milliseconds 500
        Log-Message "✓ Clicked"
        
        Log-Message "Step 6: Setting clipboard to 'continue'..."
        "continue" | Set-Clipboard
        Start-Sleep -Milliseconds 200
        Log-Message "✓ Clipboard set"
        
        Log-Message "Step 7: Pasting..."
        [System.Windows.Forms.SendKeys]::SendWait("^v")
        Start-Sleep -Milliseconds 500
        Log-Message "✓ Pasted"
        
        Log-Message "Step 8: Pressing Enter..."
        [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
        Start-Sleep -Milliseconds 800
        Log-Message "✓ Sent"
        
        Log-Message "✅ SUCCESS! 'continue' sent to Claude in VS Code!"
        return $true
        
    } catch {
        Log-Message "❌ Error: $_"
        Log-Message "Stack: $($_.ScriptStackTrace)"
        return $false
    }
}

function Main {
    Log-Message "=========================================="
    Log-Message "🤖 Claude Continue - VS Code Targeted"
    Log-Message "Target: 00:39 AM (12:39 AM)"
    Log-Message "=========================================="
    Log-Message "Method: Find VS Code window, click Claude chat input"
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
                
                $success = Send-ContinueToVSCode
                
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
