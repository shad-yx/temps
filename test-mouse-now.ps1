# Immediate Mouse Test - Runs RIGHT NOW
# Test if mouse click method works before 12:34

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

Write-Host "========== IMMEDIATE MOUSE TEST ==========="
Write-Host ""
Write-Host "⚠️  IMPORTANT: Click on the Claude chat input NOW!"
Write-Host "    The agent will click there in 5 seconds"
Write-Host ""

# Countdown
for ($i = 5; $i -gt 0; $i--) {
    Write-Host "Starting in $i seconds..."
    Start-Sleep -Seconds 1
}

Write-Host ""
Write-Host "EXECUTING NOW!"
Write-Host ""

# P/Invoke for mouse control
$code = @"
[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern void SetCursorPos(int X, int Y);

[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo);
"@
Add-Type -MemberDefinition $code -Name Win32 -Namespace System -ErrorAction SilentlyContinue

Write-Host "Step 1: Moving mouse to Claude chat input (1280, 690)..."
[System.Win32]::SetCursorPos(1280, 690)
Start-Sleep -Milliseconds 500
Write-Host "✓ Mouse moved - you should see it on screen"

Write-Host "Step 2: Clicking..."
[System.Win32]::mouse_event(2, 0, 0, 0, 0)  # Mouse down
Start-Sleep -Milliseconds 100
[System.Win32]::mouse_event(4, 0, 0, 0, 0)  # Mouse up
Start-Sleep -Milliseconds 500
Write-Host "✓ Clicked"

Write-Host "Step 3: Selecting all and typing 'continue'..."
[System.Windows.Forms.SendKeys]::SendWait("^a")
Start-Sleep -Milliseconds 100

foreach ($char in "continue".ToCharArray()) {
    [System.Windows.Forms.SendKeys]::SendWait($char)
    Start-Sleep -Milliseconds 80
}
Start-Sleep -Milliseconds 400
Write-Host "✓ Typed 'continue'"

Write-Host "Step 4: Pressing Enter..."
[System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
Start-Sleep -Milliseconds 500
Write-Host "✓ Sent!"

Write-Host ""
Write-Host "========== TEST COMPLETE ==========="
Write-Host "Did you see the mouse move and 'continue' appear in Claude chat?"
Write-Host ""

Start-Sleep -Seconds 3
