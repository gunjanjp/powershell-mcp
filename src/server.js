import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { PowerShell } from 'node-powershell';

// Import tool modules
import { registerPowerShellTools } from './tools/powershell-tools.js';
import { registerSystemTools } from './tools/system-tools.js';
import { registerFileTools } from './tools/file-tools.js';

console.log('🚀 Starting PowerShell MCP Server v1.1.0...');

// Create an MCP server instance
const server = new McpServer({
  name: 'powershell-mcp-server',
  version: '1.1.0',
});

// Register all tool modules
console.log('📦 Registering PowerShell tools...');
registerPowerShellTools(server);

console.log('📦 Registering system monitoring tools...');
registerSystemTools(server);

console.log('📦 Registering file system tools...');
registerFileTools(server);

// Set up transport and start listening
const transport = new StdioServerTransport();
await server.connect(transport);

console.log('🎉 PowerShell MCP Server is running and ready for Claude!');
console.log('📝 Available tools:');
console.log('   PowerShell Execution:');
console.log('   - execute-powershell: Execute PowerShell commands with working directory support');
console.log('   - execute-powershell-script: Run PowerShell script files with parameters');
console.log('   - create-powershell-script: Create new PowerShell scripts');
console.log('   System Monitoring:');
console.log('   - get-system-info: Comprehensive Windows system information');
console.log('   - get-process-list: Running processes with CPU/memory usage and filtering');
console.log('   - get-service-status: Windows services status with filtering');
console.log('   - check-disk-space: Disk space usage for drives');
console.log('   File Operations:');
console.log('   - list-directory: Enhanced directory listing with filtering');
console.log('   - get-file-info: Detailed file and directory metadata');
console.log('   - search-files: Recursive file search with pattern matching');
