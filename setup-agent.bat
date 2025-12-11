@echo off
REM Claude Auto-Continue Agent Setup
REM This script sets up automatic "continue" command at 4 AM

setlocal enabledelayedexpansion

echo.
echo ======================================
echo Claude Auto-Continue Agent Setup
echo ======================================
echo.

REM Get the directory where this script is located
set "SCRIPT_DIR=%~dp0"
set "AGENT_FILE=%SCRIPT_DIR%claude-auto-continue.js"
set "LOG_DIR=%SCRIPT_DIR%logs"

REM Create logs directory
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

echo Step 1: Creating Windows Task Scheduler entry...
echo.

REM Create task to run the agent at startup and keep it running
powershell.exe -Command ^
  "^& { ^
    $taskName = 'ClaudeAutoContinueAgent'; ^
    $action = New-ScheduledTaskAction -Execute 'node.exe' -Argument '\"%AGENT_FILE%\"'; ^
    $trigger = New-ScheduledTaskTrigger -AtStartup; ^
    $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable; ^
    $principal = New-ScheduledTaskPrincipal -UserId (whoami) -RunLevel Highest; ^
    ^
    if (Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue) { ^
      Unregister-ScheduledTask -TaskName $taskName -Confirm:$false; ^
      Write-Host 'Removed existing task'; ^
    } ^
    ^
    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Force; ^
    Write-Host 'Task created successfully!'; ^
  }"

echo.
echo Step 2: Starting the agent...
echo.

REM Start the agent in background
start "Claude Auto-Continue Agent" node.exe "%AGENT_FILE%"

echo.
echo ======================================
echo Setup Complete!
echo ======================================
echo.
echo The agent is now running and will:
echo - Check the time every minute
echo - At 4:00 AM, send "continue" to Claude
echo - Run automatically at system startup
echo.
echo Logs: %LOG_DIR%\claude-continue.log
echo.
pause
