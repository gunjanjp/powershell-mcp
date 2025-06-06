# PowerShell MCP Server Examples

This directory contains example scripts and usage scenarios for the PowerShell MCP Server.

## Example Scripts

### 1. System Information Script
```powershell
# system-info.ps1
Write-Host "=== System Information ===" -ForegroundColor Green
Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion, TotalPhysicalMemory, CsProcessors
```

### 2. Process Monitor Script  
```powershell
# process-monitor.ps1
Write-Host "=== Top 10 Processes by CPU Usage ===" -ForegroundColor Green
Get-Process | Sort-Object CPU -Descending | Select-Object -First 10 Name, CPU, WorkingSet
```

### 3. Disk Space Check Script
```powershell
# disk-check.ps1
Write-Host "=== Disk Space Usage ===" -ForegroundColor Green
Get-WmiObject -Class Win32_LogicalDisk | Select-Object DeviceID, @{Name="Size(GB)";Expression={[math]::Round($_.Size / 1GB, 2)}}, @{Name="FreeSpace(GB)";Expression={[math]::Round($_.FreeSpace / 1GB, 2)}}, @{Name="PercentFree";Expression={[math]::Round(($_.FreeSpace / $_.Size) * 100, 2)}}
```

## Usage Examples with Claude

### Basic Commands
Ask Claude:
- "Execute PowerShell: Get-Date"
- "Check system information"
- "List top 10 running processes"
- "Show disk space usage"

### Advanced Commands
Ask Claude:
- "Create a PowerShell script to backup my Documents folder"
- "Search for all .log files in C:\\Windows\\System32"
- "Get the status of Windows services containing 'Windows'"
- "Execute a PowerShell script to clean temporary files"

### File Operations
Ask Claude:
- "List files in my Downloads folder"
- "Get information about a specific file"
- "Search for PowerShell scripts in my project directory"

### System Monitoring
Ask Claude:
- "Show me processes using more than 100MB of memory"
- "Check which services are stopped"
- "Get detailed system information including uptime"

## Security Considerations

When using these examples, remember:
- Always review generated scripts before execution
- Be cautious with system-modifying commands
- Test scripts in a safe environment first
- Understand the potential impact of each command

## Custom Script Creation

You can ask Claude to create custom PowerShell scripts for:
- File backup and organization
- System monitoring and alerts
- Automated maintenance tasks
- Data processing and reporting
- Network diagnostics
- Performance monitoring

## Best Practices

1. **Start Simple**: Begin with basic commands and gradually build complexity
2. **Review Output**: Always check command results before proceeding
3. **Use Parameters**: Leverage the working directory and parameter options
4. **Error Handling**: Pay attention to error messages and troubleshoot accordingly
5. **Documentation**: Keep track of useful scripts for future reference
