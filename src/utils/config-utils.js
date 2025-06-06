import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get Claude Desktop configuration file path
 */
export function getClaudeConfigPath() {
  const homeDir = os.homedir();
  
  switch (os.platform()) {
    case 'win32':
      return path.join(homeDir, 'AppData', 'Roaming', 'Claude', 'claude_desktop_config.json');
    case 'darwin':
      return path.join(homeDir, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
    case 'linux':
      return path.join(homeDir, '.config', 'Claude', 'claude_desktop_config.json');
    default:
      throw new Error(`Unsupported platform: ${os.platform()}`);
  }
}

/**
 * Get the absolute path to the server.js file
 */
export function getServerPath() {
  return path.resolve(__dirname, '..', 'server.js');
}

/**
 * Read existing Claude configuration or create default
 */
export async function readClaudeConfig() {
  const configPath = getClaudeConfigPath();
  
  try {
    const data = await fs.readFile(configPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return default config
      return {
        mcpServers: {}
      };
    }
    throw error;
  }
}

/**
 * Write Claude configuration
 */
export async function writeClaudeConfig(config) {
  const configPath = getClaudeConfigPath();
  const configDir = path.dirname(configPath);
  
  // Ensure directory exists
  await fs.mkdir(configDir, { recursive: true });
  
  // Write configuration with proper formatting
  await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf8');
  
  return configPath;
}

/**
 * Add PowerShell MCP server to Claude configuration
 */
export async function addPowerShellMCPServer() {
  try {
    const config = await readClaudeConfig();
    const serverPath = getServerPath();
    
    // Add or update PowerShell MCP server configuration
    config.mcpServers.powershell = {
      command: 'node',
      args: [serverPath],
      env: {}
    };
    
    const configPath = await writeClaudeConfig(config);
    
    return {
      success: true,
      configPath,
      serverPath,
      message: 'PowerShell MCP Server configuration added successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Remove PowerShell MCP server from Claude configuration
 */
export async function removePowerShellMCPServer() {
  try {
    const config = await readClaudeConfig();
    
    if (config.mcpServers && config.mcpServers.powershell) {
      delete config.mcpServers.powershell;
      const configPath = await writeClaudeConfig(config);
      
      return {
        success: true,
        configPath,
        message: 'PowerShell MCP Server configuration removed successfully'
      };
    } else {
      return {
        success: true,
        message: 'PowerShell MCP Server was not configured'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Validate current configuration
 */
export async function validateConfiguration() {
  try {
    const config = await readClaudeConfig();
    const serverPath = getServerPath();
    
    const validation = {
      configExists: true,
      serverConfigured: !!(config.mcpServers && config.mcpServers.powershell),
      serverPathExists: false,
      nodeAvailable: false
    };
    
    // Check if server file exists
    try {
      await fs.access(serverPath);
      validation.serverPathExists = true;
    } catch {
      validation.serverPathExists = false;
    }
    
    // Check if Node.js is available
    try {
      const { spawn } = await import('child_process');
      const child = spawn('node', ['--version'], { stdio: 'pipe' });
      await new Promise((resolve, reject) => {
        child.on('close', (code) => {
          validation.nodeAvailable = code === 0;
          resolve();
        });
        child.on('error', reject);
      });
    } catch {
      validation.nodeAvailable = false;
    }
    
    return {
      success: true,
      validation,
      configPath: getClaudeConfigPath(),
      serverPath
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
