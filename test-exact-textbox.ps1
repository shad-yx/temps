# IMMEDIATE TEST - Click exactly where the red box is
# This clicks the Claude chat input textbox and types "continue"

Add-Type -AssemblyName System.Windows.Forms

Write-Host "========== IMMEDIATE TEST - EXACT TEXT BOX LOCATION ==========="
Write-Host ""
Write-Host "Target: The red box text input area in Claude chat"
Write-Host ""
Write-Host "Starting in 2 seconds... CLICK THE CHAT INPUT AREA NOW!"
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

# Based on your red box, the textbox appears to be around (500, 680)
Write-Host "Step 1: Moving mouse to text box input (500, 680)..."
[System.Win32]::SetCursorPos(500, 680)
Start-Sleep -Milliseconds 400
Write-Host "✓ Mouse at text box"

Write-Host "Step 2: Clicking to focus the text box..."
[System.Win32]::mouse_event(2, 0, 0, 0, 0)  # Down
Start-Sleep -Milliseconds 80
[System.Win32]::mouse_event(4, 0, 0, 0, 0)  # Up
Start-Sleep -Milliseconds 400
Write-Host "✓ Clicked - text box should be selected"

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
