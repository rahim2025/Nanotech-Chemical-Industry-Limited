# PowerShell script to restart the Nanotech Chemical Industry backend server

# Navigate to backend directory
$backendPath = Join-Path -Path $PSScriptRoot -ChildPath "backend"
Set-Location -Path $backendPath

# Check for existing Node.js processes running index.js
$nodeProcesses = Get-Process | Where-Object { $_.Name -eq "node" } | 
                 ForEach-Object { $_ | Add-Member -NotePropertyName CommandLine -NotePropertyValue (Get-CimInstance -Class Win32_Process -Filter "ProcessId = $($_.Id)" | Select-Object -ExpandProperty CommandLine) -PassThru } | 
                 Where-Object { $_.CommandLine -like "*index.js*" }

# Kill existing processes if found
if ($nodeProcesses) {
    Write-Host "Stopping existing Node.js processes..."
    $nodeProcesses | ForEach-Object { Stop-Process -Id $_.Id -Force }
}

# Start the server in production mode
Write-Host "Starting server in production mode..."
$env:NODE_ENV = "production"
Start-Process -FilePath "node" -ArgumentList "src/index.js" -NoNewWindow

Write-Host "Server restart complete!"
Write-Host "Visit https://api.nanotechchemical.com to verify it's working"
