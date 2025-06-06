import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { PowerShell } from 'node-powershell';

// Import tool modules
import { registerPowerShellTools } from './tools/powershell-tools.js';
import { registerSystemTools } from './tools/system-tools.js';
import { registerFileTools } from './tools/file-tools.js';
import { getSystemInfo, getPowerShellVersion } from './utils/system-utils.js';

// Create an MCP server instance
const server = new McpServer({
  name: 'powershell-mcp-server',
  version: '1.1.0',
});

// Server information and diagnostics
server.setRequestHandler('initialize', async (request) => {
  const systemInfo = await getSystemInfo();
  const psVersion = await getPowerShellVersion();
  
  console.log('🚀 PowerShell MCP Server starting...');
  console.log(`📊 System: ${systemInfo.os} ${systemInfo.version}`);
  console.log(`⚡ PowerShell: ${psVersion}`);
  console.log(`🔧 Node.js: ${process.version}`);
  
  return {
    protocolVersion: request.params.protocolVersion,
    capabilities: {
      tools: {},
    },
    serverInfo: {
      name: 'powershell-mcp-server',
      version: '1.1.0',
    },
  };
});

// Register all tool modules
registerPowerShellTools(server);
registerSystemTools(server);
registerFileTools(server);

// Set up transport and start listening
const transport = new StdioServerTransport();
await server.connect(transport);

console.log('🎉 PowerShell MCP Server is running and ready for Claude!');
console.log('📝 Available tools: execute-powershell, execute-powershell-script, get-system-info, get-process-list, get-service-status, list-directory, get-file-info, check-disk-space');
