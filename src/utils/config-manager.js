#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import os from 'os';

/**
 * Configuration Manager for Claude Desktop MCP Servers
 * This utility safely manages Claude Desktop configuration without losing existing settings
 */

class ClaudeConfigManager {
  constructor() {
    this.configPath = this.getClaudeConfigPath();
    this.backupDir = path.join(path.dirname(this.configPath), 'backups');
  }

  /**
   * Get Claude Desktop configuration file path
   */
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
   * Create backup of existing configuration
   */
  async createBackup() {
    try {
      // Check if config file exists
      await fs.access(this.configPath);
      
      // Create backup directory
      await fs.mkdir(this.backupDir, { recursive: true });
      
      // Create backup filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(this.backupDir, `claude_desktop_config_backup_${timestamp}.json`);
      
      // Copy existing config to backup
      await fs.copyFile(this.configPath, backupPath);
      
      console.log(`✅ Configuration backed up to: ${backupPath}`);
      return backupPath;
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('ℹ️  No existing configuration found, skipping backup');
        return null;
      }
      throw error;
    }
  }

  /**
   * Read existing configuration
   */
  async readConfig() {
    try {
      const data = await fs.readFile(this.configPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('ℹ️  No existing configuration found, creating new one');
        return { mcpServers: {} };
      }
      throw error;
    }
  }

  /**
   * Write configuration with proper formatting
   */
  async writeConfig(config) {
    const configDir = path.dirname(this.configPath);
    await fs.mkdir(configDir, { recursive: true });
    await fs.writeFile(this.configPath, JSON.stringify(config, null, 2), 'utf8');
  }

  /**
   * Add or update a server configuration
   */
  async addServer(serverName, serverConfig) {
    try {
      // Create backup first
      await this.createBackup();
      
      // Read existing configuration
      const config = await this.readConfig();
      
      // Initialize mcpServers if it doesn't exist
      if (!config.mcpServers) {
        config.mcpServers = {};
      }
      
      // Add or update the server
      const wasExisting = !!config.mcpServers[serverName];
      config.mcpServers[serverName] = serverConfig;
      
      // Write updated configuration
      await this.writeConfig(config);
      
      console.log(`✅ ${wasExisting ? 'Updated' : 'Added'} "${serverName}" server configuration`);
      console.log(`📍 Configuration file: ${this.configPath}`);
      
      return {
        success: true,
        action: wasExisting ? 'updated' : 'added',
        configPath: this.configPath
      };
    } catch (error) {
      console.error(`❌ Failed to add server configuration: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Remove a server configuration
   */
  async removeServer(serverName) {
    try {
      // Create backup first
      await this.createBackup();
      
      // Read existing configuration
      const config = await this.readConfig();
      
      if (config.mcpServers && config.mcpServers[serverName]) {
        delete config.mcpServers[serverName];
        await this.writeConfig(config);
        
        console.log(`✅ Removed "${serverName}" server configuration`);
        return { success: true };
      } else {
        console.log(`ℹ️  Server "${serverName}" was not configured`);
        return { success: true, message: 'Server was not configured' };
      }
    } catch (error) {
      console.error(`❌ Failed to remove server configuration: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * List all configured servers
   */
  async listServers() {
    try {
      const config = await this.readConfig();
      
      if (!config.mcpServers || Object.keys(config.mcpServers).length === 0) {
        console.log('ℹ️  No MCP servers configured');
        return { success: true, servers: {} };
      }
      
      console.log('📋 Configured MCP Servers:');
      for (const [name, serverConfig] of Object.entries(config.mcpServers)) {
        console.log(`  • ${name}:`);
        console.log(`    Command: ${serverConfig.command}`);
        console.log(`    Args: ${JSON.stringify(serverConfig.args)}`);
        if (serverConfig.env && Object.keys(serverConfig.env).length > 0) {
          console.log(`    Environment: ${JSON.stringify(serverConfig.env)}`);
        }
      }
      
      return { success: true, servers: config.mcpServers };
    } catch (error) {
      console.error(`❌ Failed to list servers: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Restore configuration from backup
   */
  async restoreFromBackup(backupPath) {
    try {
      await fs.copyFile(backupPath, this.configPath);
      console.log(`✅ Configuration restored from: ${backupPath}`);
      return { success: true };
    } catch (error) {
      console.error(`❌ Failed to restore configuration: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * List available backups
   */
  async listBackups() {
    try {
      const backups = await fs.readdir(this.backupDir);
      const backupFiles = backups.filter(file => file.startsWith('claude_desktop_config_backup_'));
      
      if (backupFiles.length === 0) {
        console.log('ℹ️  No backups found');
        return { success: true, backups: [] };
      }
      
      console.log('📋 Available backups:');
      for (const backup of backupFiles.sort().reverse()) {
        const backupPath = path.join(this.backupDir, backup);
        const stats = await fs.stat(backupPath);
        console.log(`  • ${backup} (${stats.mtime.toLocaleString()})`);
      }
      
      return { success: true, backups: backupFiles };
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('ℹ️  No backup directory found');
        return { success: true, backups: [] };
      }
      console.error(`❌ Failed to list backups: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Validate configuration
   */
  async validateConfig() {
    try {
      const config = await this.readConfig();
      const validation = {
        configExists: true,
        validFormat: true,
        mcpServersSection: !!config.mcpServers,
        serverCount: config.mcpServers ? Object.keys(config.mcpServers).length : 0,
        servers: {}
      };

      if (config.mcpServers) {
        for (const [name, serverConfig] of Object.entries(config.mcpServers)) {
          validation.servers[name] = {
            hasCommand: !!serverConfig.command,
            hasArgs: !!serverConfig.args,
            argsValid: Array.isArray(serverConfig.args)
          };
        }
      }

      console.log('🔍 Configuration Validation:');
      console.log(`  Config file exists: ${validation.configExists}`);
      console.log(`  Valid JSON format: ${validation.validFormat}`);
      console.log(`  MCP servers section: ${validation.mcpServersSection}`);
      console.log(`  Server count: ${validation.serverCount}`);

      return { success: true, validation };
    } catch (error) {
      console.error(`❌ Configuration validation failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}

// CLI Interface
async function main() {
  const manager = new ClaudeConfigManager();
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'add':
      if (args.length < 5) {
        console.log('Usage: node config-manager.js add <serverName> <command> <arg1> [arg2] ...');
        console.log('Example: node config-manager.js add powershell node D:/claude/claude-powershell-mcp/src/server.js');
        process.exit(1);
      }
      const serverName = args[1];
      const serverCommand = args[2];
      const serverArgs = args.slice(3);
      await manager.addServer(serverName, {
        command: serverCommand,
        args: serverArgs,
        env: {}
      });
      break;

    case 'remove':
      if (args.length < 2) {
        console.log('Usage: node config-manager.js remove <serverName>');
        process.exit(1);
      }
      await manager.removeServer(args[1]);
      break;

    case 'list':
      await manager.listServers();
      break;

    case 'validate':
      await manager.validateConfig();
      break;

    case 'backup':
      await manager.createBackup();
      break;

    case 'list-backups':
      await manager.listBackups();
      break;

    case 'restore':
      if (args.length < 2) {
        console.log('Usage: node config-manager.js restore <backupFileName>');
        console.log('Use "list-backups" to see available backups');
        process.exit(1);
      }
      const backupPath = path.join(manager.backupDir, args[1]);
      await manager.restoreFromBackup(backupPath);
      break;

    default:
      console.log('Claude Desktop Configuration Manager');
      console.log('');
      console.log('Commands:');
      console.log('  add <name> <command> <args...>  Add or update a server configuration');
      console.log('  remove <name>                   Remove a server configuration');
      console.log('  list                           List all configured servers');
      console.log('  validate                       Validate current configuration');
      console.log('  backup                         Create backup of current configuration');
      console.log('  list-backups                   List available backups');
      console.log('  restore <backup>               Restore from backup');
      console.log('');
      console.log('Examples:');
      console.log('  node config-manager.js add powershell node "D:/claude/claude-powershell-mcp/src/server.js"');
      console.log('  node config-manager.js list');
      console.log('  node config-manager.js backup');
      console.log('  node config-manager.js restore claude_desktop_config_backup_2025-06-07T10-30-00-000Z.json');
      break;
  }
}

// Export the class for use in other modules
export default ClaudeConfigManager;

// Run CLI if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
