# IMMEDIATE TEST - Runs RIGHT NOW
# Clicks in Claude chat and types "continue"

Add-Type -AssemblyName System.Windows.Forms

Write-Host "========== IMMEDIATE TEST - CLAUDE CHAT ==========="
Write-Host ""
Write-Host "This will:"
Write-Host "1. Click in the Claude chat area (right panel)"
Write-Host "2. Type 'continue'"
Write-Host "3. Press Enter"
Write-Host ""
Write-Host "Starting in 2 seconds... KEEP VSCODE VISIBLE!"
Write-Host ""

Start-Sleep -Seconds 2

Write-Host "EXECUTING NOW!"
Write-Host ""

$code = @"
[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern void SetCursorPos(int X, int Y);

[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo);
"@
Add-Type -MemberDefinition $code -Name Win32 -Namespace System -ErrorAction SilentlyContinue

Write-Host "Step 1: Moving mouse to Claude chat input area..."
Write-Host "Clicking at (1280, 400) - the Claude chat area"
[System.Win32]::SetCursorPos(1280, 400)
Start-Sleep -Milliseconds 400
Write-Host "✓ Mouse at position"

Write-Host "Step 2: Clicking..."
[System.Win32]::mouse_event(2, 0, 0, 0, 0)  # Down
Start-Sleep -Milliseconds 80
[System.Win32]::mouse_event(4, 0, 0, 0, 0)  # Up
Start-Sleep -Milliseconds 400
Write-Host "✓ Clicked"

Write-Host "Step 3: Typing 'continue'..."
foreach ($char in "continue".ToCharArray()) {
    [System.Windows.Forms.SendKeys]::SendWait($char)
    Start-Sleep -Milliseconds 100
}
Start-Sleep -Milliseconds 400
Write-Host "✓ Typed: continue"

Write-Host "Step 4: Pressing Enter to send..."
[System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
Start-Sleep -Milliseconds 600
Write-Host "✓ Sent!"

Write-Host ""
Write-Host "========== TEST COMPLETE ==========="
Write-Host "Did 'continue' appear in the Claude chat?"
Write-Host ""

Start-Sleep -Seconds 2
