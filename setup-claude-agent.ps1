# Setup script to create Windows Task Scheduler entry for Claude Auto-Continue Agent

$ScriptPath = Join-Path $PSScriptRoot "claude-auto-continue.ps1"
$TaskName = "ClaudeAutoContinueAgent"
$LogPath = Join-Path $PSScriptRoot "logs"

# Create logs directory
if (-not (Test-Path $LogPath)) {
    New-Item -ItemType Directory -Path $LogPath -Force | Out-Null
    Write-Host "✓ Created logs directory"
}

Write-Host ""
Write-Host "========================================"
Write-Host "Claude Auto-Continue Agent - Setup"
Write-Host "========================================"
Write-Host ""

# Check if task already exists
$ExistingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($ExistingTask) {
    Write-Host "Removing existing scheduled task..."
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
    Write-Host "✓ Removed old task"
}

# Create new scheduled task
Write-Host "Creating new scheduled task..."
Write-Host ""

$Action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$ScriptPath`""

$Trigger = New-ScheduledTaskTrigger -AtStartup

$Settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -RunOnlyIfNetworkAvailable:$false

$Principal = New-ScheduledTaskPrincipal `
    -UserId (whoami) `
    -RunLevel Highest

$Task = Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $Action `
    -Trigger $Trigger `
    -Settings $Settings `
    -Principal $Principal `
    -Force

if ($Task) {
    Write-Host "✓ Scheduled task created successfully!"
    Write-Host ""
    Write-Host "Task Details:"
    Write-Host "  Name: $TaskName"
    Write-Host "  Trigger: At System Startup"
    Write-Host "  Script: $ScriptPath"
    Write-Host "  Logs: $LogPath"
    Write-Host ""
    Write-Host "Starting the agent now..."
    
    # Start the script in background
    Start-Process powershell.exe -ArgumentList "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$ScriptPath`"" -WindowStyle Hidden
    
    Write-Host "✓ Agent started!"
    Write-Host ""
    Write-Host "========================================"
    Write-Host "Setup Complete!"
    Write-Host "========================================"
    Write-Host ""
    Write-Host "The agent will:"
    Write-Host "  • Run automatically at system startup"
    Write-Host "  • Check time every minute"
    Write-Host "  • Send 'continue' at 4:00 AM daily"
    Write-Host "  • Log all activities"
    Write-Host ""
    Write-Host "To check logs:"
    Write-Host "  Get-Content '$LogPath\claude-continue.log' -Tail 20"
    Write-Host ""
} else {
    Write-Host "❌ Failed to create scheduled task"
}
