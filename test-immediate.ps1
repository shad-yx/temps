# Immediate Test - Executes RIGHT NOW
# This will test if the command can be sent to Claude

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

Write-Host "========== IMMEDIATE TEST ==========="
Write-Host "Testing command input to Claude right now..."
Write-Host ""

# Find VS Code
$vscode = Get-Process -Name "Code" -ErrorAction SilentlyContinue
if (-not $vscode) {
    Write-Host "❌ VS Code not found!"
    exit 1
}

Write-Host "✓ Found VS Code (PID: $($vscode.Id))"

# Get window
$hwnd = $vscode.MainWindowHandle
Write-Host "✓ Window handle: $hwnd"

if ($hwnd -eq 0) {
    Write-Host "❌ Could not get window handle!"
    exit 1
}

# Use P/Invoke to bring window to front
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

Write-Host "Bringing VS Code to front..."
[System.Win32]::ShowWindow($hwnd, 5) | Out-Null
[System.Win32]::SetForegroundWindow($hwnd) | Out-Null

Start-Sleep -Milliseconds 1000
Write-Host "✓ VS Code window is now in focus"

Write-Host ""
Write-Host "Now sending 'continue' command..."
Write-Host ""

# Click on chat input (right side, bottom area)
Write-Host "Step 1: Clicking on chat input area..."
[System.Win32]::SetCursorPos(1300, 680)
Start-Sleep -Milliseconds 300
[System.Win32]::mouse_event(2, 0, 0, 0, 0)  # Left mouse down
Start-Sleep -Milliseconds 50
[System.Win32]::mouse_event(4, 0, 0, 0, 0)  # Left mouse up
Start-Sleep -Milliseconds 500
Write-Host "✓ Clicked"

# Type the command
Write-Host "Step 2: Typing 'continue'..."
foreach ($char in "continue".ToCharArray()) {
    [System.Windows.Forms.SendKeys]::SendWait($char)
    Start-Sleep -Milliseconds 100
}
Write-Host "✓ Typed"

Start-Sleep -Milliseconds 500

# Press Enter
Write-Host "Step 3: Pressing Enter..."
[System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
Write-Host "✓ Sent!"

Write-Host ""
Write-Host "========== TEST COMPLETE ==========="
Write-Host "If you saw 'continue' appear in the Claude chat, it worked!"
Write-Host ""

Start-Sleep -Seconds 3
