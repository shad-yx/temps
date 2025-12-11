# Mouse Position Tracker
# Move your mouse to the Claude chat input and note the coordinates shown

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$code = @"
[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern void GetCursorPos(out POINT lpPoint);

[System.Runtime.InteropServices.StructLayout(System.Runtime.InteropServices.LayoutKind.Sequential)]
public struct POINT {
    public int X;
    public int Y;
}
"@

Add-Type -MemberDefinition $code -Name Win32Utils -Namespace System -ErrorAction SilentlyContinue

Write-Host "=========================================="
Write-Host "🖱️  MOUSE POSITION TRACKER"
Write-Host "=========================================="
Write-Host ""
Write-Host "Instructions:"
Write-Host "1. Move your mouse to the Claude chat input box"
Write-Host "2. The coordinates will update in real-time below"
Write-Host "3. When you're at the exact spot, note the X and Y values"
Write-Host "4. Press Ctrl+C to stop"
Write-Host ""
Write-Host "Real-time coordinates:"
Write-Host ""

$lastX = -1
$lastY = -1

while ($true) {
    $point = New-Object System.Win32Utils.POINT
    [System.Win32Utils]::GetCursorPos([ref]$point)
    
    if ($point.X -ne $lastX -or $point.Y -ne $lastY) {
        Write-Host -NoNewLine "`rX: $($point.X.ToString().PadLeft(4))  Y: $($point.Y.ToString().PadLeft(4))"
        $lastX = $point.X
        $lastY = $point.Y
    }
    
    Start-Sleep -Milliseconds 100
}
