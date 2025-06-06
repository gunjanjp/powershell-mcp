#!/usr/bin/env node

import { 
  addPowerShellMCPServer, 
  validateConfiguration 
} from '../src/utils/config-utils.js';
import { checkPowerShellHealth } from '../src/utils/system-utils.js';
import { spawn } from 'child_process';

/**
 * Run npm install to ensure dependencies are available
 */
async function ensureDependencies() {
  console.log('📦 Checking dependencies...');
  
  return new Promise((resolve, reject) => {
    const child = spawn('npm', ['install'], { 
      stdio: 'inherit',
      shell: true 
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Dependencies are ready');
        resolve(true);
      } else {
        console.error('❌ Failed to install dependencies');
        resolve(false);
      }
    });
    
    child.on('error', (error) => {
      console.error('💥 Error installing dependencies:', error.message);
      resolve(false);
    });
  });
}

/**
 * Auto-fix and setup PowerShell MCP Server
 */
async function autoFix() {
  console.log('🔧 PowerShell MCP Server Auto-Fix Tool');
  console.log('=====================================');
  console.log('');
  
  try {
    // Step 1: Ensure dependencies
    const depsOk = await ensureDependencies();
    if (!depsOk) {
      console.error('❌ Cannot proceed without dependencies');
      return false;
    }
    console.log('');
    
    // Step 2: Check PowerShell health
    console.log('🔍 Checking PowerShell availability...');
    const health = await checkPowerShellHealth();
    if (!health.healthy) {
      console.error('❌ PowerShell health check failed:', health.message);
      console.log('');
      console.log('💡 Possible solutions:');
      console.log('   - Ensure PowerShell is installed and accessible');
      console.log('   - Check Windows execution policies');
      console.log('   - Run as Administrator if needed');
      return false;
    }
    console.log('✅ PowerShell is working correctly');
    console.log('');
    
    // Step 3: Validate current configuration
    console.log('🔍 Validating current configuration...');
    const validation = await validateConfiguration();
    
    if (validation.success) {
      const v = validation.validation;
      const needsSetup = !v.serverConfigured || !v.serverPathExists || !v.nodeAvailable;
      
      if (!needsSetup) {
        console.log('🎉 PowerShell MCP Server is already configured and ready!');
        console.log('');
        console.log('💡 You can now ask Claude to:');
        console.log('   - "Check system information"');
        console.log('   - "List running processes"');
        console.log('   - "Show disk space usage"');
        console.log('   - "Execute PowerShell commands"');
        return true;
      }
    }
    
    // Step 4: Install/configure the server
    console.log('⚙️ Configuring PowerShell MCP Server for Claude Desktop...');
    const setupResult = await addPowerShellMCPServer();
    
    if (setupResult.success) {
      console.log('✅ PowerShell MCP Server configured successfully!');
      console.log('📁 Configuration file:', setupResult.configPath);
      console.log('🖥️ Server path:', setupResult.serverPath);
      console.log('');
      console.log('🔄 IMPORTANT: Please restart Claude Desktop to apply changes');
      console.log('');
      console.log('🎉 Setup complete! You can now ask Claude to:');
      console.log('   ✨ "Check system information"');
      console.log('   ✨ "List top 10 running processes"');
      console.log('   ✨ "Show disk space usage"');
      console.log('   ✨ "Get Windows service status"');
      console.log('   ✨ "Execute PowerShell: Get-Date"');
      console.log('   ✨ "Search for .txt files in C:\\\\Users"');
      console.log('   ✨ "Create a PowerShell script to backup files"');
      console.log('');
      console.log('📚 For more commands, check the README.md file');
      return true;
    } else {
      console.error('❌ Failed to configure PowerShell MCP Server:', setupResult.error);
      return false;
    }
    
  } catch (error) {
    console.error('💥 Unexpected error during auto-fix:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting steps:');
    console.log('   1. Run "npm run setup diagnose" for detailed diagnostics');
    console.log('   2. Check that Node.js and PowerShell are properly installed');
    console.log('   3. Ensure you have write permissions to Claude config directory');
    console.log('   4. Try running as Administrator');
    return false;
  }
}

// Run auto-fix
autoFix()
  .then((success) => {
    console.log('');
    if (success) {
      console.log('🚀 Auto-fix completed successfully!');
    } else {
      console.log('❌ Auto-fix failed. Please check the errors above.');
      console.log('💡 Try running "npm run setup diagnose" for more information.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error.message);
    process.exit(1);
  });
