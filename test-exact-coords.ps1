# Immediate test - runs RIGHT NOW with exact coordinates
# This will test if clicking at (1280, 400) and typing works

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

Write-Host "========== IMMEDIATE TEST - EXACT COORDINATES ==========="
Write-Host ""
Write-Host "This test will:"
Write-Host "1. Click at coordinates X=1280, Y=400 (where you pointed)"
Write-Host "2. Type 'continue'"
Write-Host "3. Press Enter"
Write-Host ""
Write-Host "Starting in 3 seconds... CLICK ON THE CLAUDE CHAT NOW!"
Write-Host ""

Start-Sleep -Seconds 3

Write-Host "EXECUTING NOW!"
Write-Host ""

$code = @"
[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern void SetCursorPos(int X, int Y);

[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo);
"@
Add-Type -MemberDefinition $code -Name Win32 -Namespace System -ErrorAction SilentlyContinue

Write-Host "Step 1: Moving to (1280, 400)..."
[System.Win32]::SetCursorPos(1280, 400)
Start-Sleep -Milliseconds 500
Write-Host "✓ Mouse at target"

Write-Host "Step 2: Clicking..."
[System.Win32]::mouse_event(2, 0, 0, 0, 0)  # Down
Start-Sleep -Milliseconds 100
[System.Win32]::mouse_event(4, 0, 0, 0, 0)  # Up
Start-Sleep -Milliseconds 500
Write-Host "✓ Clicked"

Write-Host "Step 3: Typing 'continue'..."
foreach ($char in "continue".ToCharArray()) {
    [System.Windows.Forms.SendKeys]::SendWait($char)
    Start-Sleep -Milliseconds 100
}
Start-Sleep -Milliseconds 300
Write-Host "✓ Typed"

Write-Host "Step 4: Pressing Enter..."
[System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
Start-Sleep -Milliseconds 500
Write-Host "✓ Sent!"

Write-Host ""
Write-Host "========== TEST COMPLETE ==========="
Write-Host "Did you see 'continue' appear in Claude chat?"
Write-Host ""

Start-Sleep -Seconds 3
