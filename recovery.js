#!/usr/bin/env node

/**
 * Configuration Recovery and Management Tool
 * This tool helps recover and properly manage Claude Desktop configurations
 * when previous setups may have overwritten existing configurations
 */

import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ConfigurationRecovery {
  constructor() {
    this.configPath = this.getClaudeConfigPath();
    this.backupDir = path.join(path.dirname(this.configPath), 'backups');
    this.projectBackupDir = path.join(__dirname, 'config-backups');
  }

  getClaudeConfigPath() {
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
   * Scan for potential configuration backups in various locations
   */
  async findPotentialBackups() {
    const possibleLocations = [
      this.backupDir,
      this.projectBackupDir,
      path.join(__dirname, '..', 'backups'),
      path.join(os.homedir(), 'Desktop'),
      path.join(os.homedir(), 'Downloads'),
      path.join('D:', 'claude'),
    ];

    const foundBackups = [];

    for (const location of possibleLocations) {
      try {
        const files = await fs.readdir(location);
        const configFiles = files.filter(file => 
          file.includes('claude') && 
          file.includes('config') && 
          (file.endsWith('.json') || file.includes('backup'))
        );

        for (const file of configFiles) {
          const fullPath = path.join(location, file);
          try {
            const stats = await fs.stat(fullPath);
            if (stats.isFile()) {
              foundBackups.push({
                path: fullPath,
                name: file,
                location,
                modified: stats.mtime,
                size: stats.size
              });
            }
          } catch (error) {
            // Skip files we can't access
          }
        }
      } catch (error) {
        // Skip directories we can't access
      }
    }

    return foundBackups.sort((a, b) => b.modified - a.modified);
  }

  /**
   * Read and analyze a configuration file
   */
  async analyzeConfig(configPath) {
    try {
      const content = await fs.readFile(configPath, 'utf8');
      const config = JSON.parse(content);

      const analysis = {
        valid: true,
        hasMcpServers: !!config.mcpServers,
        serverCount: config.mcpServers ? Object.keys(config.mcpServers).length : 0,
        servers: config.mcpServers ? Object.keys(config.mcpServers) : [],
        rawConfig: config
      };

      return analysis;
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  /**
   * Display current configuration status
   */
  async displayCurrentStatus() {
    console.log('🔍 Current Configuration Status');
    console.log('==============================');
    console.log();

    try {
      console.log(`📍 Configuration file: ${this.configPath}`);
      
      const currentAnalysis = await this.analyzeConfig(this.configPath);
      
      if (currentAnalysis.valid) {
        console.log('✅ Current configuration is valid JSON');
        console.log(`📊 MCP servers section: ${currentAnalysis.hasMcpServers ? 'Present' : 'Missing'}`);
        console.log(`🔢 Server count: ${currentAnalysis.serverCount}`);
        
        if (currentAnalysis.servers.length > 0) {
          console.log('📋 Configured servers:');
          for (const server of currentAnalysis.servers) {
            console.log(`  • ${server}`);
          }
        } else {
          console.log('⚠️  No MCP servers configured');
        }
      } else {
        console.log('❌ Current configuration is invalid or missing');
        console.log(`   Error: ${currentAnalysis.error}`);
      }
    } catch (error) {
      console.log('❌ Could not read current configuration');
      console.log(`   Error: ${error.message}`);
    }

    console.log();
  }

  /**
   * Search for and display potential backup configurations
   */
  async findAndDisplayBackups() {
    console.log('🔍 Searching for Configuration Backups');
    console.log('=======================================');
    console.log();

    const backups = await this.findPotentialBackups();

    if (backups.length === 0) {
      console.log('❌ No potential backup configurations found');
      console.log();
      console.log('💡 Suggestions:');
      console.log('  • Check your Downloads folder for any saved configs');
      console.log('  • Look for files with "claude", "config", or "backup" in the name');
      console.log('  • Check if you have any recent JSON files that might be configs');
      return [];
    }

    console.log(`✅ Found ${backups.length} potential backup configuration(s):`);
    console.log();

    for (let i = 0; i < backups.length; i++) {
      const backup = backups[i];
      console.log(`${i + 1}. ${backup.name}`);
      console.log(`   📍 Location: ${backup.location}`);
      console.log(`   📅 Modified: ${backup.modified.toLocaleString()}`);
      console.log(`   📏 Size: ${backup.size} bytes`);

      // Analyze the backup
      const analysis = await this.analyzeConfig(backup.path);
      if (analysis.valid) {
        console.log(`   ✅ Valid JSON with ${analysis.serverCount} MCP server(s)`);
        if (analysis.servers.length > 0) {
          console.log(`   📋 Servers: ${analysis.servers.join(', ')}`);
        }
      } else {
        console.log(`   ❌ Invalid or unreadable`);
      }
      console.log();
    }

    return backups;
  }

  /**
   * Merge configurations intelligently
   */
  async mergeConfigurations(baseConfig, additionalConfig) {
    const merged = JSON.parse(JSON.stringify(baseConfig)); // Deep clone

    // Ensure mcpServers section exists
    if (!merged.mcpServers) {
      merged.mcpServers = {};
    }

    // Merge additional servers
    if (additionalConfig.mcpServers) {
      for (const [serverName, serverConfig] of Object.entries(additionalConfig.mcpServers)) {
        if (merged.mcpServers[serverName]) {
          console.log(`⚠️  Server "${serverName}" exists in both configs - keeping existing version`);
        } else {
          merged.mcpServers[serverName] = serverConfig;
          console.log(`✅ Added server "${serverName}" from backup`);
        }
      }
    }

    return merged;
  }

  /**
   * Interactive recovery process
   */
  async interactiveRecovery() {
    console.log('🔧 Interactive Configuration Recovery');
    console.log('====================================');
    console.log();

    // Show current status
    await this.displayCurrentStatus();

    // Find backups
    const backups = await this.findAndDisplayBackups();

    if (backups.length === 0) {
      console.log('❌ No backups found to recover from');
      return false;
    }

    // In a real interactive scenario, you'd prompt the user
    // For now, let's provide options to restore or merge
    console.log('💡 Recovery Options:');
    console.log('  1. restore <number> - Restore a specific backup');
    console.log('  2. merge <number> - Merge a backup with current config');
    console.log('  3. show <number> - Show contents of a backup');
    console.log();
    console.log('Example commands:');
    console.log('  node recovery.js restore 1');
    console.log('  node recovery.js merge 2');
    console.log('  node recovery.js show 1');

    return backups;
  }

  /**
   * Restore from a specific backup
   */
  async restoreFromBackup(backupIndex, backups) {
    if (backupIndex < 1 || backupIndex > backups.length) {
      console.log('❌ Invalid backup number');
      return false;
    }

    const backup = backups[backupIndex - 1];
    console.log(`🔄 Restoring from: ${backup.name}`);

    try {
      // Create backup of current config first
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const currentBackupPath = path.join(this.projectBackupDir, `current_config_backup_${timestamp}.json`);
      
      await fs.mkdir(this.projectBackupDir, { recursive: true });
      
      try {
        await fs.copyFile(this.configPath, currentBackupPath);
        console.log(`📦 Current config backed up to: ${currentBackupPath}`);
      } catch (error) {
        console.log('ℹ️  No current config to backup');
      }

      // Restore the backup
      await fs.copyFile(backup.path, this.configPath);
      console.log('✅ Configuration restored successfully');

      // Verify the restored config
      const analysis = await this.analyzeConfig(this.configPath);
      if (analysis.valid) {
        console.log(`✅ Restored config is valid with ${analysis.serverCount} server(s)`);
      } else {
        console.log('⚠️  Restored config may have issues');
      }

      return true;
    } catch (error) {
      console.log(`❌ Failed to restore configuration: ${error.message}`);
      return false;
    }
  }

  /**
   * Merge a backup with current configuration
   */
  async mergeWithBackup(backupIndex, backups) {
    if (backupIndex < 1 || backupIndex > backups.length) {
      console.log('❌ Invalid backup number');
      return false;
    }

    const backup = backups[backupIndex - 1];
    console.log(`🔀 Merging with: ${backup.name}`);

    try {
      // Read current config
      let currentConfig;
      try {
        currentConfig = await this.analyzeConfig(this.configPath);
        if (!currentConfig.valid) {
          currentConfig = { rawConfig: { mcpServers: {} } };
        } else {
          currentConfig = currentConfig.rawConfig;
        }
      } catch (error) {
        currentConfig = { mcpServers: {} };
      }

      // Read backup config
      const backupAnalysis = await this.analyzeConfig(backup.path);
      if (!backupAnalysis.valid) {
        console.log('❌ Backup configuration is invalid');
        return false;
      }

      // Create backup of current state
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const currentBackupPath = path.join(this.projectBackupDir, `pre_merge_backup_${timestamp}.json`);
      
      await fs.mkdir(this.projectBackupDir, { recursive: true });
      
      try {
        await fs.copyFile(this.configPath, currentBackupPath);
        console.log(`📦 Current config backed up to: ${currentBackupPath}`);
      } catch (error) {
        console.log('ℹ️  No current config to backup');
      }

      // Merge configurations
      console.log('🔀 Merging configurations...');
      const mergedConfig = await this.mergeConfigurations(currentConfig, backupAnalysis.rawConfig);

      // Write merged configuration
      const configDir = path.dirname(this.configPath);
      await fs.mkdir(configDir, { recursive: true });
      await fs.writeFile(this.configPath, JSON.stringify(mergedConfig, null, 2), 'utf8');

      console.log('✅ Configurations merged successfully');

      // Display merged result
      const finalAnalysis = await this.analyzeConfig(this.configPath);
      console.log(`📊 Final configuration has ${finalAnalysis.serverCount} server(s):`);
      for (const server of finalAnalysis.servers) {
        console.log(`  • ${server}`);
      }

      return true;
    } catch (error) {
      console.log(`❌ Failed to merge configurations: ${error.message}`);
      return false;
    }
  }

  /**
   * Show contents of a backup
   */
  async showBackup(backupIndex, backups) {
    if (backupIndex < 1 || backupIndex > backups.length) {
      console.log('❌ Invalid backup number');
      return false;
    }

    const backup = backups[backupIndex - 1];
    console.log(`📄 Contents of: ${backup.name}`);
    console.log('='.repeat(50));

    try {
      const content = await fs.readFile(backup.path, 'utf8');
      console.log(content);
      console.log('='.repeat(50));

      const analysis = await this.analyzeConfig(backup.path);
      if (analysis.valid) {
        console.log(`📊 This backup contains ${analysis.serverCount} MCP server(s)`);
      }

      return true;
    } catch (error) {
      console.log(`❌ Failed to read backup: ${error.message}`);
      return false;
    }
  }

  /**
   * Add PowerShell MCP server to current config safely
   */
  async addPowerShellServer() {
    console.log('➕ Adding PowerShell MCP Server to Configuration');
    console.log('================================================');

    const serverPath = path.resolve(__dirname, 'src', 'server.js');
    
    try {
      // Read current config
      let currentConfig;
      try {
        const analysis = await this.analyzeConfig(this.configPath);
        currentConfig = analysis.valid ? analysis.rawConfig : { mcpServers: {} };
      } catch (error) {
        currentConfig = { mcpServers: {} };
      }

      // Create backup
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(this.projectBackupDir, `before_powershell_add_${timestamp}.json`);
      
      await fs.mkdir(this.projectBackupDir, { recursive: true });
      
      try {
        await fs.copyFile(this.configPath, backupPath);
        console.log(`📦 Current config backed up to: ${backupPath}`);
      } catch (error) {
        console.log('ℹ️  No current config to backup');
      }

      // Ensure mcpServers section exists
      if (!currentConfig.mcpServers) {
        currentConfig.mcpServers = {};
      }

      // Add PowerShell server
      const wasExisting = !!currentConfig.mcpServers.powershell;
      currentConfig.mcpServers.powershell = {
        command: 'node',
        args: [serverPath],
        env: {}
      };

      // Write updated configuration
      const configDir = path.dirname(this.configPath);
      await fs.mkdir(configDir, { recursive: true });
      await fs.writeFile(this.configPath, JSON.stringify(currentConfig, null, 2), 'utf8');

      console.log(`✅ ${wasExisting ? 'Updated' : 'Added'} PowerShell MCP Server configuration`);
      console.log(`📍 Server path: ${serverPath}`);

      // Show final status
      const finalAnalysis = await this.analyzeConfig(this.configPath);
      console.log(`📊 Configuration now has ${finalAnalysis.serverCount} server(s):`);
      for (const server of finalAnalysis.servers) {
        console.log(`  • ${server}`);
      }

      return true;
    } catch (error) {
      console.log(`❌ Failed to add PowerShell server: ${error.message}`);
      return false;
    }
  }
}

// CLI Interface
async function main() {
  const recovery = new ConfigurationRecovery();
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'status':
        await recovery.displayCurrentStatus();
        break;

      case 'scan':
      case 'find':
        await recovery.findAndDisplayBackups();
        break;

      case 'interactive':
        const backups = await recovery.interactiveRecovery();
        if (backups && backups.length > 0) {
          console.log(`Found ${backups.length} potential backups. Use other commands to restore or merge.`);
        }
        break;

      case 'restore':
        if (!args[1]) {
          console.log('Usage: node recovery.js restore <backup_number>');
          console.log('Use "node recovery.js scan" to see available backups');
          process.exit(1);
        }
        const backupsForRestore = await recovery.findPotentialBackups();
        const restoreIndex = parseInt(args[1]);
        await recovery.restoreFromBackup(restoreIndex, backupsForRestore);
        break;

      case 'merge':
        if (!args[1]) {
          console.log('Usage: node recovery.js merge <backup_number>');
          console.log('Use "node recovery.js scan" to see available backups');
          process.exit(1);
        }
        const backupsForMerge = await recovery.findPotentialBackups();
        const mergeIndex = parseInt(args[1]);
        await recovery.mergeWithBackup(mergeIndex, backupsForMerge);
        break;

      case 'show':
        if (!args[1]) {
          console.log('Usage: node recovery.js show <backup_number>');
          console.log('Use "node recovery.js scan" to see available backups');
          process.exit(1);
        }
        const backupsForShow = await recovery.findPotentialBackups();
        const showIndex = parseInt(args[1]);
        await recovery.showBackup(showIndex, backupsForShow);
        break;

      case 'add-powershell':
        await recovery.addPowerShellServer();
        break;

      default:
        console.log('Claude Desktop Configuration Recovery Tool');
        console.log('==========================================');
        console.log();
        console.log('This tool helps recover configurations that may have been');
        console.log('overwritten during previous MCP server installations.');
        console.log();
        console.log('Commands:');
        console.log('  status           Show current configuration status');
        console.log('  scan             Find potential configuration backups');
        console.log('  interactive      Run interactive recovery process');
        console.log('  restore <n>      Restore from backup number n');
        console.log('  merge <n>        Merge backup n with current config');
        console.log('  show <n>         Show contents of backup n');
        console.log('  add-powershell   Safely add PowerShell MCP server');
        console.log();
        console.log('Examples:');
        console.log('  node recovery.js status');
        console.log('  node recovery.js scan');
        console.log('  node recovery.js restore 1');
        console.log('  node recovery.js merge 2');
        console.log('  node recovery.js add-powershell');
        console.log();
        console.log('🔍 Start with "status" to see your current configuration');
        console.log('🔍 Then use "scan" to find any backup configurations');
        break;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default ConfigurationRecovery;
