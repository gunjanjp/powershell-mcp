#!/usr/bin/env node

import { 
  addPowerShellMCPServer, 
  removePowerShellMCPServer, 
  validateConfiguration,
  getClaudeConfigPath,
  getServerPath
} from '../src/utils/config-utils.js';
import { checkPowerShellHealth, getWindowsConfig } from '../src/utils/system-utils.js';

/**
 * Display help information
 */
function showHelp() {
  console.log(`
🚀 PowerShell MCP Server Setup Tool

Usage: npm run setup [command]

Commands:
  install     - Install and configure PowerShell MCP Server for Claude Desktop
  uninstall   - Remove PowerShell MCP Server configuration from Claude Desktop
  validate    - Validate current configuration and system requirements
  diagnose    - Run comprehensive system diagnostics
  help        - Show this help message

Examples:
  npm run setup install
  npm run setup validate
  npm run setup diagnose
  
For automatic setup: npm run fix
`);
}

/**
 * Install PowerShell MCP Server
 */
async function install() {
  console.log('🚀 Installing PowerShell MCP Server...');
  
  try {
    // Check PowerShell health
    console.log('🔍 Checking PowerShell availability...');
    const health = await checkPowerShellHealth();
    if (!health.healthy) {
      console.error('❌ PowerShell health check failed:', health.message);
      return false;
    }
    console.log('✅ PowerShell is working correctly');
    
    // Add to Claude configuration
    console.log('⚙️ Configuring Claude Desktop...');
    const result = await addPowerShellMCPServer();
    
    if (result.success) {
      console.log('✅ PowerShell MCP Server installed successfully!');
      console.log('📁 Configuration file:', result.configPath);
      console.log('🖥️ Server path:', result.serverPath);
      console.log('');
      console.log('🔄 Please restart Claude Desktop to apply changes');
      console.log('');
      console.log('💡 You can now ask Claude to:');
      console.log('   - "Check system information"');
      console.log('   - "List running processes"');
      console.log('   - "Show disk space usage"');
      console.log('   - "Execute PowerShell commands"');
      return true;
    } else {
      console.error('❌ Installation failed:', result.error);
      return false;
    }
  } catch (error) {
    console.error('💥 Unexpected error during installation:', error.message);
    return false;
  }
}

/**
 * Uninstall PowerShell MCP Server
 */
async function uninstall() {
  console.log('🗑️ Uninstalling PowerShell MCP Server...');
  
  try {
    const result = await removePowerShellMCPServer();
    
    if (result.success) {
      console.log('✅ PowerShell MCP Server uninstalled successfully!');
      if (result.configPath) {
        console.log('📁 Updated configuration file:', result.configPath);
      }
      console.log('🔄 Please restart Claude Desktop to apply changes');
      return true;
    } else {
      console.error('❌ Uninstallation failed:', result.error);
      return false;
    }
  } catch (error) {
    console.error('💥 Unexpected error during uninstallation:', error.message);
    return false;
  }
}

/**
 * Validate configuration
 */
async function validate() {
  console.log('🔍 Validating PowerShell MCP Server configuration...');
  
  try {
    const result = await validateConfiguration();
    
    if (result.success) {
      const v = result.validation;
      
      console.log('📋 Validation Results:');
      console.log(`   ✅ Configuration file exists: ${v.configExists ? 'Yes' : 'No'}`);
      console.log(`   ${v.serverConfigured ? '✅' : '❌'} Server configured in Claude: ${v.serverConfigured ? 'Yes' : 'No'}`);
      console.log(`   ${v.serverPathExists ? '✅' : '❌'} Server file exists: ${v.serverPathExists ? 'Yes' : 'No'}`);
      console.log(`   ${v.nodeAvailable ? '✅' : '❌'} Node.js available: ${v.nodeAvailable ? 'Yes' : 'No'}`);
      console.log('');
      console.log('📁 Paths:');
      console.log(`   Configuration: ${result.configPath}`);
      console.log(`   Server: ${result.serverPath}`);
      
      const allValid = v.configExists && v.serverConfigured && v.serverPathExists && v.nodeAvailable;
      if (allValid) {
        console.log('');
        console.log('🎉 All validations passed! PowerShell MCP Server is ready to use.');
      } else {
        console.log('');
        console.log('⚠️ Some validations failed. Run "npm run setup install" to fix issues.');
      }
      
      return allValid;
    } else {
      console.error('❌ Validation failed:', result.error);
      return false;
    }
  } catch (error) {
    console.error('💥 Unexpected error during validation:', error.message);
    return false;
  }
}

/**
 * Run comprehensive diagnostics
 */
async function diagnose() {
  console.log('🔬 Running comprehensive diagnostics...');
  console.log('');
  
  try {
    // System information
    console.log('🖥️ System Information:');
    const config = await getWindowsConfig();
    if (config.error) {
      console.log('   ❌ Failed to get system info:', config.error);
    } else {
      Object.entries(config).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`);
      });
    }
    console.log('');
    
    // PowerShell health
    console.log('⚡ PowerShell Health:');
    const health = await checkPowerShellHealth();
    console.log(`   Status: ${health.healthy ? '✅ Healthy' : '❌ Unhealthy'}`);
    console.log(`   Message: ${health.message}`);
    console.log('');
    
    // Configuration validation
    console.log('⚙️ Configuration Status:');
    await validate();
    
    console.log('');
    console.log('🔧 Paths:');
    console.log(`   Claude Config: ${getClaudeConfigPath()}`);
    console.log(`   Server Path: ${getServerPath()}`);
    console.log(`   Current Directory: ${process.cwd()}`);
    console.log(`   Node.js Version: ${process.version}`);
    console.log(`   Platform: ${process.platform}`);
    console.log(`   Architecture: ${process.arch}`);
    
    return true;
  } catch (error) {
    console.error('💥 Unexpected error during diagnostics:', error.message);
    return false;
  }
}

/**
 * Main setup function
 */
async function main() {
  const command = process.argv[2] || 'help';
  
  switch (command.toLowerCase()) {
    case 'install':
      return await install();
    case 'uninstall':
      return await uninstall();
    case 'validate':
      return await validate();
    case 'diagnose':
      return await diagnose();
    case 'help':
    default:
      showHelp();
      return true;
  }
}

// Run the setup tool
main()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error.message);
    process.exit(1);
  });
