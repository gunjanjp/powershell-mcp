import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { PowerShell } from 'node-powershell';

// Import tool modules
import { registerPowerShellTools } from './tools/powershell-tools.js';
import { registerSystemTools } from './tools/system-tools.js';
import { registerFileTools } from './tools/file-tools.js';

// CRITICAL: Use stderr for logging (stdout reserved for JSON-RPC)
const log = (message) => {
  console.error(`[PowerShell MCP] ${message}`);
};

log('Starting PowerShell MCP Server v1.1.1...');

// Create an MCP server instance
const server = new McpServer({
  name: 'powershell-mcp-server',
  version: '1.1.1',
});

// Register all tool modules
log('Registering PowerShell tools...');
registerPowerShellTools(server);

log('Registering system monitoring tools...');
registerSystemTools(server);

log('Registering file system tools...');
registerFileTools(server);

// Set up transport and start listening
const transport = new StdioServerTransport();
await server.connect(transport);

log('PowerShell MCP Server is running and ready for Claude Desktop!');
log('Available tools:');
log('  PowerShell: execute-powershell, execute-powershell-script, create-powershell-script');
log('  System: get-system-info, get-process-list, get-service-status, check-disk-space');  
log('  Files: list-directory, get-file-info, search-files');

// Error handling
process.on('uncaughtException', (error) => {
  log(`Uncaught exception: ${error.message}`);
});

process.on('unhandledRejection', (reason) => {
  log(`Unhandled rejection: ${reason}`);
});
