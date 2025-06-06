#!/usr/bin/env node

/**
 * PowerShell MCP Server Setup Script
 * This script safely installs and configures the PowerShell MCP Server for Claude Desktop
 * It preserves existing configurations and creates backups
 */

import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import ClaudeConfigManager from './utils/config-manager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PowerShellMCPInstaller {
  constructor() {
    this.projectRoot = path.resolve(__dirname);
    this.serverPath = path.join(this.projectRoot, 'src', 'server.js');
    this.configManager = new ClaudeConfigManager();
  }

  /**
   * Run a command and return promise
   */
  runCommand(command, args, options = {}) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, { 
        stdio: 'inherit',
        shell: true,
        ...options 
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          resolve(code);
        } else {
          reject(new Error(`Command failed with exit code ${code}`));
        }
      });
      
      child.on('error', reject);
    });
  }

  /**
   * Check if Node.js is available
   */
  async checkNodeJS() {
    try {
      await this.runCommand('node', ['--version'], { stdio: 'pipe' });
      console.log('✅ Node.js is available');
      return true;
    } catch (error) {
      console.error('❌ Node.js is not available or not in PATH');
      console.error('   Please install Node.js from https://nodejs.org/');
      return false;
    }
  }

  /**
   * Check if PowerShell is available
   */
  async checkPowerShell() {
    try {
      await this.runCommand('powershell', ['-Command', 'Write-Output "PowerShell Test"'], { stdio: 'pipe' });
      console.log('✅ PowerShell is available');
      return true;
    } catch (error) {
      console.error('❌ PowerShell is not available');
      console.error('   PowerShell should be available on Windows by default');
      return false;
    }
  }

  /**
   * Install dependencies
   */
  async installDependencies() {
    console.log('📦 Installing dependencies...');
    try {
      await this.runCommand('npm', ['install'], { cwd: this.projectRoot });
      console.log('✅ Dependencies installed successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to install dependencies:', error.message);
      return false;
    }
  }

  /**
   * Test the server
   */
  async testServer() {
    console.log('🧪 Testing PowerShell MCP Server...');
    try {
      const testPath = path.join(this.projectRoot, 'test-server.js');
      await this.runCommand('node', [testPath], { cwd: this.projectRoot });
      console.log('✅ Server test completed successfully');
      return true;
    } catch (error) {
      console.error('❌ Server test failed:', error.message);
      return false;
    }
  }

  /**
   * Configure Claude Desktop
   */
  async configureClaudeDesktop() {
    console.log('⚙️ Configuring Claude Desktop...');
    
    try {
      // Create backup of existing configuration
      await this.configManager.createBackup();
      
      // Add PowerShell MCP server configuration
      const result = await this.configManager.addServer('powershell', {
        command: 'node',
        args: [this.serverPath],
        env: {}
      });
      
      if (result.success) {
        console.log('✅ Claude Desktop configuration updated successfully');
        console.log('📍 Server configured at:', this.serverPath);
        return true;
      } else {
        console.error('❌ Failed to configure Claude Desktop:', result.error);
        return false;
      }
    } catch (error) {
      console.error('❌ Configuration error:', error.message);
      return false;
    }
  }

  /**
   * Display final instructions
   */
  displayInstructions() {
    console.log('');
    console.log('🎉 PowerShell MCP Server Setup Complete!');
    console.log('');
    console.log('📋 Next Steps:');
    console.log('  1. Restart Claude Desktop application');
    console.log('  2. The PowerShell tools should now be available in Claude');
    console.log('  3. Try asking Claude to: "List the processes running on my system"');
    console.log('');
    console.log('🔧 Available Tools:');
    console.log('  • execute-powershell: Run PowerShell commands');
    console.log('  • execute-powershell-script: Run PowerShell scripts');
    console.log('  • create-powershell-script: Create new PowerShell scripts');
    console.log('  • get-system-info: Get system information');
    console.log('  • get-process-list: List running processes');
    console.log('  • get-service-status: Check Windows services');
    console.log('  • check-disk-space: Check disk usage');
    console.log('  • list-directory: Browse directories');
    console.log('  • get-file-info: Get file information');
    console.log('  • search-files: Search for files');
    console.log('');
    console.log('🛠️ Management Commands:');
    console.log('  • Test server: node test-server.js');
    console.log('  • Manual config: node src/utils/config-manager.js list');
    console.log('  • View backups: node src/utils/config-manager.js list-backups');
    console.log('  • Restore config: node src/utils/config-manager.js restore <backup>');
    console.log('');
    console.log('❓ Troubleshooting:');
    console.log('  • Check configuration: node src/utils/config-manager.js validate');
    console.log('  • Restart Claude Desktop after any configuration changes');
    console.log('  • Run diagnostics: node diagnose.bat');
  }

  /**
   * Main installation process
   */
  async install() {
    console.log('🚀 PowerShell MCP Server Installation');
    console.log('=====================================');
    console.log('');
    
    // Pre-flight checks
    console.log('🔍 Running pre-flight checks...');
    
    const nodeOK = await this.checkNodeJS();
    if (!nodeOK) return false;
    
    const powershellOK = await this.checkPowerShell();
    if (!powershellOK) return false;
    
    // Install dependencies
    const depsOK = await this.installDependencies();
    if (!depsOK) return false;
    
    // Test server
    const testOK = await this.testServer();
    if (!testOK) {
      console.log('⚠️ Server test failed, but continuing with installation...');
    }
    
    // Configure Claude Desktop
    const configOK = await this.configureClaudeDesktop();
    if (!configOK) return false;
    
    // Show final instructions
    this.displayInstructions();
    
    return true;
  }

  /**
   * Uninstall the server
   */
  async uninstall() {
    console.log('🗑️ Uninstalling PowerShell MCP Server...');
    
    try {
      // Create backup before removal
      await this.configManager.createBackup();
      
      // Remove server configuration
      const result = await this.configManager.removeServer('powershell');
      
      if (result.success) {
        console.log('✅ PowerShell MCP Server removed from Claude Desktop configuration');
        console.log('ℹ️ Project files are preserved. You can delete the project directory manually if desired.');
        return true;
      } else {
        console.error('❌ Failed to remove server configuration:', result.error);
        return false;
      }
    } catch (error) {
      console.error('❌ Uninstall error:', error.message);
      return false;
    }
  }

  /**
   * Repair installation
   */
  async repair() {
    console.log('🔧 Repairing PowerShell MCP Server installation...');
    
    // Re-run the installation process
    return await this.install();
  }
}

// CLI Interface
async function main() {
  const installer = new PowerShellMCPInstaller();
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'install':
      const success = await installer.install();
      process.exit(success ? 0 : 1);
      break;

    case 'uninstall':
      const removed = await installer.uninstall();
      process.exit(removed ? 0 : 1);
      break;

    case 'repair':
      const repaired = await installer.repair();
      process.exit(repaired ? 0 : 1);
      break;

    case 'test':
      const tested = await installer.testServer();
      process.exit(tested ? 0 : 1);
      break;

    default:
      console.log('PowerShell MCP Server Installer');
      console.log('');
      console.log('Commands:');
      console.log('  install    Install and configure the PowerShell MCP Server');
      console.log('  uninstall  Remove the PowerShell MCP Server configuration');
      console.log('  repair     Repair the installation');
      console.log('  test       Test the server functionality');
      console.log('');
      console.log('Examples:');
      console.log('  node setup.js install');
      console.log('  node setup.js test');
      console.log('  node setup.js uninstall');
      break;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default PowerShellMCPInstaller;
