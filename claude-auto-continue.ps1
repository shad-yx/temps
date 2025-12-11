# Claude Auto-Continue Agent (PowerShell Version)
# Runs continuously and sends "continue" at 4 AM

$LogFile = "$PSScriptRoot\claude-continue.log"
$TargetHour = 4
$TargetMinute = 0
$CheckInterval = 60 # seconds

function Log-Message {
    param([string]$Message)
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "[$Timestamp] $Message"
    Write-Host $LogEntry
    Add-Content -Path $LogFile -Value $LogEntry
}

function Send-ContinueCommand {
    try {
        Log-Message "🚀 Sending 'continue' command to Claude..."
        
        # Simulate typing "continue" + Enter
        Add-Type -AssemblyName System.Windows.Forms
        
        # Ensure VS Code window is focused (activate it first)
        $vscodeProcess = Get-Process -Name "Code" -ErrorAction SilentlyContinue
        if ($vscodeProcess) {
            # Bring window to focus
            [System.Windows.Forms.SendKeys]::SendWait("continue")
            [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
            Log-Message "✅ Command sent successfully!"
        } else {
            Log-Message "⚠️  VS Code not running. Waiting for next attempt..."
        }
    } catch {
        Log-Message "❌ Error: $_"
    }
}

function Main {
    Log-Message "=========================================="
    Log-Message "🤖 Claude Auto-Continue Agent Started"
    Log-Message "⏰ Target time: 4:00 AM daily"
    Log-Message "=========================================="
    
    $LastExecutionDate = $null
    
    while ($true) {
        $Now = Get-Date
        
        # Check if current time is 4:00 AM
        if ($Now.Hour -eq $TargetHour -and $Now.Minute -eq $TargetMinute) {
            $CurrentDate = $Now.Date.ToString("yyyy-MM-dd")
            
            # Only execute once per day
            if ($LastExecutionDate -ne $CurrentDate) {
                Log-Message "⏰ Time: $($Now.ToString('yyyy-MM-dd HH:mm:ss')) - EXECUTING!"
                Send-ContinueCommand
                $LastExecutionDate = $CurrentDate
                
                # Sleep for 61 seconds to avoid duplicate execution
                Start-Sleep -Seconds 61
            }
        }
        
        # Check every minute
        Start-Sleep -Seconds $CheckInterval
    }
}

# Run the agent
Main
