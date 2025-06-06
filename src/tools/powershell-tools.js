import { PowerShell } from 'node-powershell';
import { z } from 'zod';

/**
 * Create and configure a PowerShell instance
 */
function createPowerShellInstance() {
  return new PowerShell({
    executableOptions: {
      '-ExecutionPolicy': 'Bypass',
      '-NoProfile': true,
    }
  });
}

/**
 * Execute a PowerShell command safely
 */
async function executePowerShellCommand(command, workingDirectory = null) {
  const ps = createPowerShellInstance();
  
  try {
    if (workingDirectory) {
      await ps.invoke(`Set-Location -Path "${workingDirectory}"`);
    }
    
    const result = await ps.invoke(command);
    return {
      success: true,
      output: result.raw || 'Command executed successfully with no output.',
      workingDirectory: workingDirectory || 'Default'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      workingDirectory: workingDirectory || 'Default'
    };
  } finally {
    await ps.dispose();
  }
}

/**
 * Register PowerShell-related tools
 */
export function registerPowerShellTools(server) {
  
  // Enhanced PowerShell command execution
  server.tool(
    'execute-powershell',
    'Execute a PowerShell command with optional working directory',
    {
      command: z.string().describe('The PowerShell command to execute'),
      workingDirectory: z.string().optional().describe('Optional working directory for command execution')
    },
    async ({ command, workingDirectory }) => {
      try {
        const result = await executePowerShellCommand(command, workingDirectory);
        
        if (result.success) {
          return {
            content: [{
              type: 'text',
              text: `✅ Command executed successfully\n\nOutput:\n${result.output}\n\nWorking Directory: ${result.workingDirectory}`
            }]
          };
        } else {
          return {
            content: [{
              type: 'text',
              text: `❌ PowerShell command failed:\n\nError: ${result.error}\n\nWorking Directory: ${result.workingDirectory}`
            }],
            isError: true
          };
        }
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `💥 Unexpected error executing PowerShell command: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );

  // PowerShell script execution
  server.tool(
    'execute-powershell-script',
    'Execute a PowerShell script file with optional parameters',
    {
      scriptPath: z.string().describe('Path to the PowerShell script file (.ps1)'),
      parameters: z.array(z.string()).optional().describe('Optional parameters to pass to the script'),
      workingDirectory: z.string().optional().describe('Optional working directory for script execution')
    },
    async ({ scriptPath, parameters = [], workingDirectory }) => {
      try {
        let command = `& "${scriptPath}"`;
        if (parameters.length > 0) {
          command += ` ${parameters.map(p => `"${p}"`).join(' ')}`;
        }
        
        const result = await executePowerShellCommand(command, workingDirectory);
        
        if (result.success) {
          return {
            content: [{
              type: 'text',
              text: `✅ Script executed successfully\n\nScript: ${scriptPath}\nParameters: ${parameters.join(', ') || 'None'}\n\nOutput:\n${result.output}\n\nWorking Directory: ${result.workingDirectory}`
            }]
          };
        } else {
          return {
            content: [{
              type: 'text',
              text: `❌ PowerShell script failed:\n\nScript: ${scriptPath}\nError: ${result.error}\n\nWorking Directory: ${result.workingDirectory}`
            }],
            isError: true
          };
        }
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `💥 Unexpected error executing PowerShell script: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );

  // Create PowerShell script
  server.tool(
    'create-powershell-script',
    'Create a new PowerShell script file with specified content',
    {
      scriptPath: z.string().describe('Path where to create the PowerShell script (.ps1)'),
      content: z.string().describe('PowerShell script content'),
      executable: z.boolean().optional().default(true).describe('Make the script executable (default: true)')
    },
    async ({ scriptPath, content, executable }) => {
      try {
        const createCommand = `
          $content = @'
${content}
'@
          Set-Content -Path "${scriptPath}" -Value $content -Encoding UTF8
          if (${executable}) {
            Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
          }
          Write-Output "Script created successfully at: ${scriptPath}"
        `;
        
        const result = await executePowerShellCommand(createCommand);
        
        if (result.success) {
          return {
            content: [{
              type: 'text',
              text: `✅ PowerShell script created successfully\n\nLocation: ${scriptPath}\nExecutable: ${executable}\n\nResult: ${result.output}`
            }]
          };
        } else {
          return {
            content: [{
              type: 'text',
              text: `❌ Failed to create PowerShell script:\n\nError: ${result.error}`
            }],
            isError: true
          };
        }
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `💥 Unexpected error creating PowerShell script: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );
}
