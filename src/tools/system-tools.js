import { PowerShell } from 'node-powershell';
import { z } from 'zod';

/**
 * Execute a system command safely
 */
async function executeSystemCommand(command) {
  const ps = new PowerShell({
    executableOptions: {
      '-ExecutionPolicy': 'Bypass',
      '-NoProfile': true,
    }
  });
  
  try {
    const result = await ps.invoke(command);
    return {
      success: true,
      output: result.raw || 'Command executed successfully.',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  } finally {
    await ps.dispose();
  }
}

/**
 * Register system information and monitoring tools
 */
export function registerSystemTools(server) {

  // Comprehensive system information
  server.tool(
    'get-system-info',
    'Get comprehensive Windows system information including hardware, OS, and performance metrics',
    {},
    async () => {
      try {
        const command = `
          $computerInfo = Get-ComputerInfo
          $osInfo = Get-WmiObject -Class Win32_OperatingSystem
          $cpuInfo = Get-WmiObject -Class Win32_Processor
          $memInfo = Get-WmiObject -Class Win32_PhysicalMemory | Measure-Object -Property Capacity -Sum
          
          $systemInfo = @{
            'Computer Name' = $computerInfo.WindowsProductName
            'OS Version' = $computerInfo.WindowsVersion
            'Build Number' = $computerInfo.WindowsBuildLabEx
            'Total RAM (GB)' = [math]::Round($memInfo.Sum / 1GB, 2)
            'CPU Name' = ($cpuInfo | Select-Object -First 1).Name
            'CPU Cores' = ($cpuInfo | Measure-Object -Property NumberOfCores -Sum).Sum
            'CPU Logical Processors' = ($cpuInfo | Measure-Object -Property NumberOfLogicalProcessors -Sum).Sum
            'System Uptime' = (Get-Date) - [Management.ManagementDateTimeConverter]::ToDateTime($osInfo.LastBootUpTime)
            'Current User' = $env:USERNAME
            'Computer Domain' = $computerInfo.CsDomain
            'TimeZone' = $computerInfo.TimeZone
            'Last Boot Time' = [Management.ManagementDateTimeConverter]::ToDateTime($osInfo.LastBootUpTime)
          }
          
          $systemInfo | ConvertTo-Json -Depth 2
        `;
        
        const result = await executeSystemCommand(command);
        
        if (result.success) {
          return {
            content: [{
              type: 'text',
              text: `🖥️ **System Information**\n\n\`\`\`json\n${result.output}\n\`\`\`\n\n📅 Retrieved: ${result.timestamp}`
            }]
          };
        } else {
          return {
            content: [{
              type: 'text',
              text: `❌ Failed to get system information:\n\n${result.error}`
            }],
            isError: true
          };
        }
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `💥 Unexpected error getting system info: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );

  // Process list with CPU and memory usage
  server.tool(
    'get-process-list',
    'Get list of running processes with CPU and memory usage, optionally filtered by name',
    {
      processName: z.string().optional().describe('Optional process name filter'),
      sortBy: z.enum(['CPU', 'Memory', 'Name']).optional().default('CPU').describe('Sort processes by CPU, Memory, or Name'),
      limit: z.number().optional().default(10).describe('Maximum number of processes to return (default: 10)')
    },
    async ({ processName, sortBy, limit }) => {
      try {
        let command = 'Get-Process';
        if (processName) {
          command += ` -Name "*${processName}*" -ErrorAction SilentlyContinue`;
        }
        
        command += ` | Sort-Object ${sortBy === 'Memory' ? 'WorkingSet' : sortBy} -Descending | Select-Object -First ${limit} Name, Id, CPU, @{Name="Memory(MB)";Expression={[math]::Round($_.WorkingSet / 1MB, 2)}}, ProcessName | ConvertTo-Json`;
        
        const result = await executeSystemCommand(command);
        
        if (result.success) {
          return {
            content: [{
              type: 'text',
              text: `📊 **Running Processes** (Top ${limit}, sorted by ${sortBy})${processName ? `\n\n🔍 Filter: "${processName}"` : ''}\n\n\`\`\`json\n${result.output}\n\`\`\`\n\n📅 Retrieved: ${result.timestamp}`
            }]
          };
        } else {
          return {
            content: [{
              type: 'text',
              text: `❌ Failed to get process list:\n\n${result.error}`
            }],
            isError: true
          };
        }
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `💥 Unexpected error getting process list: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );

  // Windows service status
  server.tool(
    'get-service-status',
    'Get Windows service status, optionally filtered by service name or status',
    {
      serviceName: z.string().optional().describe('Optional service name filter'),
      status: z.enum(['Running', 'Stopped', 'All']).optional().default('All').describe('Filter by service status')
    },
    async ({ serviceName, status }) => {
      try {
        let command = 'Get-Service';
        if (serviceName) {
          command += ` -Name "*${serviceName}*" -ErrorAction SilentlyContinue`;
        }
        
        if (status !== 'All') {
          command += ` | Where-Object {$_.Status -eq "${status}"}`;
        }
        
        command += ' | Select-Object Name, Status, StartType, DisplayName | Sort-Object Name | ConvertTo-Json';
        
        const result = await executeSystemCommand(command);
        
        if (result.success) {
          return {
            content: [{
              type: 'text',
              text: `🔧 **Windows Services**${serviceName ? `\n\n🔍 Filter: "${serviceName}"` : ''}\n📊 Status: ${status}\n\n\`\`\`json\n${result.output}\n\`\`\`\n\n📅 Retrieved: ${result.timestamp}`
            }]
          };
        } else {
          return {
            content: [{
              type: 'text',
              text: `❌ Failed to get service status:\n\n${result.error}`
            }],
            isError: true
          };
        }
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `💥 Unexpected error getting service status: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );

  // Disk space information
  server.tool(
    'check-disk-space',
    'Check disk space usage for all drives or a specific drive',
    {
      drive: z.string().optional().describe('Optional drive letter (e.g., "C:", "D:") to check specific drive')
    },
    async ({ drive }) => {
      try {
        let command = 'Get-WmiObject -Class Win32_LogicalDisk';
        if (drive) {
          command += ` | Where-Object {$_.DeviceID -eq "${drive.toUpperCase()}"}`;
        }
        
        command += ` | Select-Object DeviceID, @{Name="Size(GB)";Expression={[math]::Round($_.Size / 1GB, 2)}}, @{Name="FreeSpace(GB)";Expression={[math]::Round($_.FreeSpace / 1GB, 2)}}, @{Name="UsedSpace(GB)";Expression={[math]::Round(($_.Size - $_.FreeSpace) / 1GB, 2)}}, @{Name="PercentFree";Expression={[math]::Round(($_.FreeSpace / $_.Size) * 100, 2)}}, FileSystem, VolumeName | ConvertTo-Json`;
        
        const result = await executeSystemCommand(command);
        
        if (result.success) {
          return {
            content: [{
              type: 'text',
              text: `💾 **Disk Space Usage**${drive ? `\n\n🔍 Drive: ${drive}` : '\n📊 All Drives'}\n\n\`\`\`json\n${result.output}\n\`\`\`\n\n📅 Retrieved: ${result.timestamp}`
            }]
          };
        } else {
          return {
            content: [{
              type: 'text',
              text: `❌ Failed to check disk space:\n\n${result.error}`
            }],
            isError: true
          };
        }
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `💥 Unexpected error checking disk space: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );
}
