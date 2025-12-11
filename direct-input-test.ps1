# Direct input test using keyboard simulation
# This bypasses window handles and sends directly to focused window

Add-Type -AssemblyName System.Windows.Forms

Write-Host "========== DIRECT INPUT TEST ==========="
Write-Host ""
Write-Host "Make sure VS Code Claude chat input is FOCUSED in the next 5 seconds!"
Write-Host "The command 'continue' will be sent to whatever window is focused..."
Write-Host ""

# Count down
for ($i = 5; $i -gt 0; $i--) {
    Write-Host "Starting in $i seconds..."
    Start-Sleep -Seconds 1
}

Write-Host ""
Write-Host "SENDING COMMAND NOW!"
Write-Host ""

# Type the command directly
Write-Host "Typing: continue"
[System.Windows.Forms.SendKeys]::SendWait("continue")

Start-Sleep -Milliseconds 300
Write-Host "Pressing Enter..."
[System.Windows.Forms.SendKeys]::SendWait("{ENTER}")

Write-Host ""
Write-Host "✅ Command sent!"
Write-Host ""

Start-Sleep -Seconds 2
