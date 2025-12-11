# IMMEDIATE TEST - Click textbox, type "continue", press enter
# This will test the exact sequence needed

Add-Type -AssemblyName System.Windows.Forms

Write-Host "========== IMMEDIATE TEST ==========="
Write-Host ""
Write-Host "Sequence:"
Write-Host "1. LEFT CLICK on textbox at (500, 680)"
Write-Host "2. Type 'continue'"
Write-Host "3. Press Enter"
Write-Host ""
Write-Host "Starting in 2 seconds..."
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

Write-Host "Step 1: Moving mouse to (500, 680)..."
[System.Win32]::SetCursorPos(500, 680)
Start-Sleep -Milliseconds 300
Write-Host "✓ Mouse positioned"

Write-Host "Step 2: LEFT CLICK..."
# Left mouse button click
[System.Win32]::mouse_event(2, 0, 0, 0, 0)  # LEFTDOWN
Start-Sleep -Milliseconds 100
[System.Win32]::mouse_event(4, 0, 0, 0, 0)  # LEFTUP
Start-Sleep -Milliseconds 500
Write-Host "✓ LEFT CLICKED - Textbox should be focused"

Write-Host "Step 3: Typing 'continue'..."
[System.Windows.Forms.SendKeys]::SendWait("continue")
Start-Sleep -Milliseconds 400
Write-Host "✓ Typed 'continue'"

Write-Host "Step 4: Pressing ENTER..."
[System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
Start-Sleep -Milliseconds 600
Write-Host "✓ ENTERED - Message should be sent!"

Write-Host ""
Write-Host "========== TEST COMPLETE ==========="
Write-Host "Did 'continue' appear in Claude chat?"
Write-Host ""

Start-Sleep -Seconds 2
