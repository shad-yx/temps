# Claude One-Time Continue Agent - Tonight at 12:21 AM
# This will run once tonight and exit

$LogFile = "$PSScriptRoot\claude-continue-1221am.log"
$TargetHour = 0
$TargetMinute = 21

function Log-Message {
    param([string]$Message)
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "[$Timestamp] $Message"
    Write-Host $LogEntry
    Add-Content -Path $LogFile -Value $LogEntry
}

function Send-ContinueCommand {
    try {
        Log-Message "🚀 EXECUTING: Sending 'continue' to Claude..."
        
        Add-Type -AssemblyName System.Windows.Forms
        
        # Make sure window is active and type the command
        [System.Windows.Forms.SendKeys]::SendWait("continue")
        [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
        
        Log-Message "✅ Command sent! Claude should continue developing..."
        return $true
    } catch {
        Log-Message "❌ Error: $_"
        return $false
    }
}

function Main {
    Log-Message "=========================================="
    Log-Message "🤖 Claude One-Time Continue Agent"
    Log-Message "⏰ Waiting for 12:21 AM tonight..."
    Log-Message "=========================================="
    
    $CheckInterval = 5 # Check every 5 seconds for accuracy
    $Executed = $false
    
    while (-not $Executed) {
        $Now = Get-Date
        
        # Check if current time is 12:21 AM
        if ($Now.Hour -eq $TargetHour -and $Now.Minute -eq $TargetMinute) {
            Log-Message "⏰ Time reached: $($Now.ToString('yyyy-MM-dd HH:mm:ss'))"
            $success = Send-ContinueCommand
            
            if ($success) {
                Log-Message "Mission accomplished! Agent will now exit."
                Start-Sleep -Seconds 2
                exit 0
            }
        }
        
        Start-Sleep -Seconds $CheckInterval
    }
}

Main
