# Final Agent - Reliable Direct Input Method
# Assumes VS Code is the active window at trigger time

$LogFile = "$PSScriptRoot\claude-continue-final.log"
$TargetHour = 0
$TargetMinute = 30

function Log-Message {
    param([string]$Message)
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "[$Timestamp] $Message"
    Write-Host $LogEntry
    Add-Content -Path $LogFile -Value $LogEntry -Force
}

function Send-ContinueCommand {
    try {
        Log-Message "🚀 EXECUTING: Sending 'continue' command..."
        
        Add-Type -AssemblyName System.Windows.Forms
        
        # Just send the keys directly
        Log-Message "Typing 'continue'..."
        [System.Windows.Forms.SendKeys]::SendWait("continue")
        Start-Sleep -Milliseconds 300
        
        Log-Message "Pressing Enter..."
        [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
        Start-Sleep -Milliseconds 500
        
        Log-Message "✅ SUCCESS! Command sent!"
        return $true
        
    } catch {
        Log-Message "❌ Error: $_"
        return $false
    }
}

function Main {
    Log-Message "=========================================="
    Log-Message "🤖 Claude Continue Agent - FINAL VERSION"
    Log-Message "Target: 00:30 AM (12:30 AM)"
    Log-Message "=========================================="
    Log-Message "Keep VS Code in focus for this to work!"
    Log-Message ""
    
    $lastExecutedDate = $null
    
    while ($true) {
        $Now = Get-Date
        $CurrentHour = $Now.Hour
        $CurrentMinute = $Now.Minute
        $CurrentSecond = $Now.Second
        
        # Display time every 30 seconds
        if ($CurrentSecond -eq 0 -and $CurrentMinute % 2 -eq 0) {
            Log-Message "Waiting... Current time: $($Now.ToString('HH:mm:ss'))"
        }
        
        # Check if we've reached target time
        if ($CurrentHour -eq $TargetHour -and $CurrentMinute -eq $TargetMinute) {
            $ExecutionDate = $Now.Date.ToString("yyyy-MM-dd")
            
            if ($lastExecutedDate -ne $ExecutionDate) {
                Log-Message ""
                Log-Message "🎯 TARGET TIME REACHED: $($Now.ToString('HH:mm:ss'))"
                Log-Message ""
                
                $success = Send-ContinueCommand
                
                if ($success) {
                    Log-Message "✅ MISSION COMPLETE! Agent will exit."
                    $lastExecutedDate = $ExecutionDate
                    Start-Sleep -Seconds 3
                    exit 0
                }
            }
        }
        
        Start-Sleep -Seconds 1
    }
}

Main
