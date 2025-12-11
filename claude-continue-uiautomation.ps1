# Claude Continue Agent - UI Automation to find Claude chat input
# Uses accessibility APIs to find the specific Claude chat input box

$LogFile = "$PSScriptRoot\claude-continue-uiautomation.log"
$TargetHour = 0
$TargetMinute = 32

function Log-Message {
    param([string]$Message)
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "[$Timestamp] $Message"
    Write-Host $LogEntry
    Add-Content -Path $LogFile -Value $LogEntry -Force
}

function Find-ClaudeChatInput {
    try {
        Log-Message "Searching for Claude chat input element..."
        
        # Load UI Automation
        [void][System.Reflection.Assembly]::LoadWithPartialName("UIAutomationClient")
        [void][System.Reflection.Assembly]::LoadWithPartialName("UIAutomationTypes")
        
        # Find VS Code window
        $vscodeProcess = Get-Process -Name "Code" -ErrorAction SilentlyContinue
        if (-not $vscodeProcess) {
            Log-Message "❌ VS Code not found"
            return $null
        }
        
        Log-Message "Found VS Code process"
        
        # Get the automation element for VS Code
        $rootElement = [System.Windows.Automation.AutomationElement]::FromHandle($vscodeProcess.MainWindowHandle)
        if (-not $rootElement) {
            Log-Message "❌ Could not get VS Code root element"
            return $null
        }
        
        Log-Message "Got VS Code root element"
        
        # Search for input element with Claude-related properties
        # Look for textbox or editable text elements
        $condition = [System.Windows.Automation.PropertyCondition]::new(
            [System.Windows.Automation.AutomationElement]::ControlTypeProperty,
            [System.Windows.Automation.ControlType]::Edit
        )
        
        $editElements = $rootElement.FindAll([System.Windows.Automation.TreeScope]::Subtree, $condition)
        Log-Message "Found $($editElements.Count) editable elements"
        
        if ($editElements.Count -gt 0) {
            foreach ($elem in $editElements) {
                $name = $elem.GetCurrentPropertyValue([System.Windows.Automation.AutomationElement]::NameProperty)
                Log-Message "Element found: $name"
                
                # Look for Claude-related elements
                if ($name -like "*chat*" -or $name -like "*Claude*" -or $name -like "*input*" -or $name -like "*message*") {
                    Log-Message "✓ Found potential Claude input: $name"
                    return $elem
                }
            }
            
            # If no specific Claude element found, return the last edit element (usually the input)
            Log-Message "✓ Returning last editable element as potential Claude input"
            return $editElements[$editElements.Count - 1]
        }
        
        Log-Message "❌ No editable elements found"
        return $null
        
    } catch {
        Log-Message "❌ Error searching for Claude input: $_"
        return $null
    }
}

function Send-ContinueToClaudeInput {
    try {
        Log-Message "🚀 Finding Claude chat input..."
        
        $claudeElement = Find-ClaudeChatInput
        if (-not $claudeElement) {
            Log-Message "❌ Could not find Claude chat input"
            return $false
        }
        
        Log-Message "✓ Found Claude input element"
        
        # Get the text pattern
        $textPattern = $claudeElement.GetCurrentPattern([System.Windows.Automation.TextPattern]::Pattern)
        if ($textPattern) {
            Log-Message "Element supports text input"
        }
        
        # Try to set focus and get value pattern
        Log-Message "Setting focus to Claude input..."
        $claudeElement.SetFocus()
        Start-Sleep -Milliseconds 500
        
        Log-Message "Getting value pattern..."
        $valuePattern = $claudeElement.GetCurrentPattern([System.Windows.Automation.ValuePattern]::Pattern)
        
        if ($valuePattern) {
            Log-Message "✓ Got value pattern - clearing field..."
            $valuePattern.SetValue("")
            Start-Sleep -Milliseconds 200
            
            Log-Message "Typing 'continue'..."
            $valuePattern.SetValue("continue")
            Start-Sleep -Milliseconds 300
            
            Log-Message "✓ Value set to 'continue'"
        } else {
            Log-Message "⚠️ Could not get value pattern, using keyboard input instead..."
            Add-Type -AssemblyName System.Windows.Forms
            
            # Clear any existing text
            [System.Windows.Forms.SendKeys]::SendWait("^a")
            Start-Sleep -Milliseconds 100
            
            # Type the command
            foreach ($char in "continue".ToCharArray()) {
                [System.Windows.Forms.SendKeys]::SendWait($char)
                Start-Sleep -Milliseconds 50
            }
            Start-Sleep -Milliseconds 300
        }
        
        Log-Message "Sending command (Enter)..."
        Add-Type -AssemblyName System.Windows.Forms
        [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
        Start-Sleep -Milliseconds 500
        
        Log-Message "✅ SUCCESS! 'continue' sent to Claude input"
        return $true
        
    } catch {
        Log-Message "❌ Error: $_"
        Log-Message "Stack: $($_.ScriptStackTrace)"
        return $false
    }
}

function Main {
    Log-Message "=========================================="
    Log-Message "🤖 Claude Continue - UI Automation"
    Log-Message "Target: 00:32 AM (12:32 AM)"
    Log-Message "=========================================="
    Log-Message "Using UI Automation to find Claude chat input"
    Log-Message ""
    
    $lastExecutedDate = $null
    
    while ($true) {
        $Now = Get-Date
        $CurrentHour = $Now.Hour
        $CurrentMinute = $Now.Minute
        $CurrentSecond = $Now.Second
        
        # Display time every 30 seconds
        if ($CurrentSecond -eq 0 -and $CurrentMinute % 1 -eq 0) {
            Log-Message "Waiting... Current time: $($Now.ToString('HH:mm:ss'))"
        }
        
        # Check if we've reached target time
        if ($CurrentHour -eq $TargetHour -and $CurrentMinute -eq $TargetMinute) {
            $ExecutionDate = $Now.Date.ToString("yyyy-MM-dd")
            
            if ($lastExecutedDate -ne $ExecutionDate) {
                Log-Message ""
                Log-Message "🎯 TARGET TIME REACHED: $($Now.ToString('HH:mm:ss'))"
                Log-Message ""
                
                $success = Send-ContinueToClaudeInput
                
                if ($success) {
                    Log-Message "✅ MISSION COMPLETE! Exiting..."
                    $lastExecutedDate = $ExecutionDate
                    Start-Sleep -Seconds 3
                    exit 0
                } else {
                    Log-Message "⚠️ Failed. Retrying in 10 seconds..."
                    Start-Sleep -Seconds 10
                }
            }
        }
        
        Start-Sleep -Seconds 1
    }
}

Main
