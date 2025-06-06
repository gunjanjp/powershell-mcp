import { PowerShell } from 'node-powershell';

/**
 * Get basic system information
 */
export async function getSystemInfo() {
  const ps = new PowerShell({
    executableOptions: {
      '-ExecutionPolicy': 'Bypass',
      '-NoProfile': true,
    }
  });
  
  try {
    const result = await ps.invoke('Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion');
    const lines = result.raw.split('\n').filter(line => line.trim());
    
    return {
      os: 'Windows',
      version: lines.length > 0 ? lines[0].replace(/\s+/g, ' ').trim() : 'Unknown'
    };
  } catch (error) {
    return {
      os: 'Windows',
      version: 'Unknown'
    };
  } finally {
    await ps.dispose();
  }
}

/**
 * Get PowerShell version information
 */
export async function getPowerShellVersion() {
  const ps = new PowerShell({
    executableOptions: {
      '-ExecutionPolicy': 'Bypass',
      '-NoProfile': true,
    }
  });
  
  try {
    const result = await ps.invoke('$PSVersionTable.PSVersion');
    return result.raw.trim() || 'Unknown';
  } catch (error) {
    return 'Unknown';
  } finally {
    await ps.dispose();
  }
}

/**
 * Check if PowerShell is available and working
 */
export async function checkPowerShellHealth() {
  try {
    const ps = new PowerShell({
      executableOptions: {
        '-ExecutionPolicy': 'Bypass',
        '-NoProfile': true,
      }
    });
    
    const result = await ps.invoke('Write-Output "PowerShell Health Check OK"');
    await ps.dispose();
    
    return {
      healthy: true,
      message: result.raw.trim()
    };
  } catch (error) {
    return {
      healthy: false,
      message: error.message
    };
  }
}

/**
 * Get Windows-specific configuration information
 */
export async function getWindowsConfig() {
  const ps = new PowerShell({
    executableOptions: {
      '-ExecutionPolicy': 'Bypass',
      '-NoProfile': true,
    }
  });
  
  try {
    const result = await ps.invoke(`
      $config = @{
        'PowerShell Edition' = $PSVersionTable.PSEdition
        'PowerShell Version' = $PSVersionTable.PSVersion.ToString()
        'Execution Policy' = Get-ExecutionPolicy
        'OS Architecture' = $env:PROCESSOR_ARCHITECTURE
        'User Profile' = $env:USERPROFILE
        'Computer Name' = $env:COMPUTERNAME
        'Domain' = $env:USERDOMAIN
        'Current User' = $env:USERNAME
      }
      $config | ConvertTo-Json
    `);
    
    return JSON.parse(result.raw);
  } catch (error) {
    return {
      error: error.message
    };
  } finally {
    await ps.dispose();
  }
}
