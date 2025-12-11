# IMMEDIATE TEST - Force focus and triple-click
Add-Type -AssemblyName System.Windows.Forms

Write-Host "========== IMMEDIATE TEST - FORCE FOCUS ==========="
Write-Host ""
Write-Host "Method: VS Code focus, triple-click, type, enter"
Write-Host ""
Write-Host "Starting in 2 seconds..."
Write-Host ""

Start-Sleep -Seconds 2

Write-Host "EXECUTING NOW!"
Write-Host ""

$code = @"
[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern IntPtr GetForegroundWindow();

[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern bool SetForegroundWindow(IntPtr hWnd);

[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern void SetCursorPos(int X, int Y);

[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo);
"@
Add-Type -MemberDefinition $code -Name Win32 -Namespace System -ErrorAction SilentlyContinue

Write-Host "Step 1: Bringing VS Code to foreground..."
$vscode = Get-Process -Name "Code" -ErrorAction SilentlyContinue
if ($vscode) {
    [System.Win32]::SetForegroundWindow($vscode.MainWindowHandle) | Out-Null
    Start-Sleep -Milliseconds 500
    Write-Host "✓ VS Code focused"
}

Write-Host "Step 2: Moving mouse to textbox (500, 680)..."
[System.Win32]::SetCursorPos(500, 680)
Start-Sleep -Milliseconds 400
Write-Host "✓ Mouse at textbox"

Write-Host "Step 3: TRIPLE CLICKING to select textbox..."
for ($i = 0; $i -lt 3; $i++) {
    [System.Win32]::mouse_event(2, 0, 0, 0, 0)
    Start-Sleep -Milliseconds 50
    [System.Win32]::mouse_event(4, 0, 0, 0, 0)
    Start-Sleep -Milliseconds 100
}
Start-Sleep -Milliseconds 500
Write-Host "✓ TRIPLE CLICKED - Textbox focused"

Write-Host "Step 4: Typing 'continue'..."
[System.Windows.Forms.SendKeys]::SendWait("continue")
Start-Sleep -Milliseconds 400
Write-Host "✓ Typed continue"

Write-Host "Step 5: Pressing ENTER..."
[System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
Start-Sleep -Milliseconds 600
Write-Host "✓ ENTERED!"

Write-Host ""
Write-Host "========== TEST COMPLETE ==========="
Write-Host ""

Start-Sleep -Seconds 2
