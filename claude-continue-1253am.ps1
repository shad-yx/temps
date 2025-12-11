# Scheduled agent - sends "continue" to Claude chat at 12:58 AM
Add-Type -AssemblyName System.Windows.Forms

$code = @'
[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern bool SetForegroundWindow(IntPtr hWnd);
[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern void SetCursorPos(int X, int Y);
[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo);
'@
Add-Type -MemberDefinition $code -Name Win32 -Namespace System -ErrorAction SilentlyContinue

$TargetHour = 0
$TargetMinute = 58

Write-Host "Agent waiting... Will execute at 12:58 AM"

while ($true) {
    $now = Get-Date
    
    if ($now.Hour -eq $TargetHour -and $now.Minute -eq $TargetMinute) {
        Write-Host "========== EXECUTING AT 12:58 AM ==========="
        Write-Host ""
        
        Write-Host "Step 1: Focus VS Code..."
        $vscode = Get-Process -Name "Code" -ErrorAction SilentlyContinue
        if ($vscode) { 
            [System.Win32]::SetForegroundWindow($vscode[0].MainWindowHandle) | Out-Null
            Start-Sleep -Milliseconds 500
            Write-Host "VS Code focused" 
        }
        
        Write-Host "Step 2: Move to textbox (500, 680)..."
        [System.Win32]::SetCursorPos(500, 680)
        Start-Sleep -Milliseconds 300
        Write-Host "Mouse positioned"
        
        Write-Host "Step 3: Triple-click textbox..."
        for ($i = 0; $i -lt 3; $i++) {
            [System.Win32]::mouse_event(2, 0, 0, 0, 0)
            Start-Sleep -Milliseconds 50
            [System.Win32]::mouse_event(4, 0, 0, 0, 0)
            Start-Sleep -Milliseconds 100
        }
        Start-Sleep -Milliseconds 500
        Write-Host "Triple-clicked"
        
        Write-Host "Step 4: Type 'continue'..."
        [System.Windows.Forms.SendKeys]::SendWait("continue")
        Start-Sleep -Milliseconds 300
        Write-Host "Typed"
        
        Write-Host "Step 5: Press ENTER..."
        [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
        Start-Sleep -Milliseconds 600
        Write-Host "Sent!"
        
        Write-Host ""
        Write-Host "========== COMPLETE ==========="
        Write-Host "Continue command sent to Claude"
        Write-Host ""
        
        Start-Sleep -Seconds 2
        exit
    }
    
    Start-Sleep -Seconds 5
}
