# System Information Script
# Usage: Ask Claude to "Execute PowerShell script: examples/system-info.ps1"

Write-Host "=== Comprehensive System Information ===" -ForegroundColor Green
Write-Host ""

# Basic system info
Write-Host "--- Basic System Info ---" -ForegroundColor Yellow
$computerInfo = Get-ComputerInfo
Write-Host "Computer Name: $($computerInfo.CsName)"
Write-Host "OS: $($computerInfo.WindowsProductName)"
Write-Host "Version: $($computerInfo.WindowsVersion)"
Write-Host "Build: $($computerInfo.WindowsBuildLabEx)"
Write-Host ""

# Hardware info
Write-Host "--- Hardware Information ---" -ForegroundColor Yellow
$cpu = Get-WmiObject -Class Win32_Processor | Select-Object -First 1
Write-Host "CPU: $($cpu.Name)"
Write-Host "Cores: $($cpu.NumberOfCores)"
Write-Host "Logical Processors: $($cpu.NumberOfLogicalProcessors)"

$memory = Get-WmiObject -Class Win32_PhysicalMemory | Measure-Object -Property Capacity -Sum
$totalRAM = [math]::Round($memory.Sum / 1GB, 2)
Write-Host "Total RAM: $totalRAM GB"
Write-Host ""

# Disk information
Write-Host "--- Disk Information ---" -ForegroundColor Yellow
$disks = Get-WmiObject -Class Win32_LogicalDisk
foreach ($disk in $disks) {
    $size = [math]::Round($disk.Size / 1GB, 2)
    $free = [math]::Round($disk.FreeSpace / 1GB, 2)
    $percent = [math]::Round(($disk.FreeSpace / $disk.Size) * 100, 2)
    Write-Host "Drive $($disk.DeviceID) - Size: $size GB, Free: $free GB ($percent% free)"
}
Write-Host ""

# Network adapters
Write-Host "--- Network Adapters ---" -ForegroundColor Yellow
$adapters = Get-NetAdapter | Where-Object {$_.Status -eq "Up"}
foreach ($adapter in $adapters) {
    Write-Host "Adapter: $($adapter.Name) - Status: $($adapter.Status)"
}
Write-Host ""

# Uptime
Write-Host "--- System Uptime ---" -ForegroundColor Yellow
$os = Get-WmiObject -Class Win32_OperatingSystem
$uptime = (Get-Date) - [Management.ManagementDateTimeConverter]::ToDateTime($os.LastBootUpTime)
Write-Host "System Uptime: $($uptime.Days) days, $($uptime.Hours) hours, $($uptime.Minutes) minutes"
Write-Host "Last Boot Time: $([Management.ManagementDateTimeConverter]::ToDateTime($os.LastBootUpTime))"

Write-Host ""
Write-Host "=== System Information Complete ===" -ForegroundColor Green
