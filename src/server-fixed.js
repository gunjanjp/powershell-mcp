import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { PowerShell } from 'node-powershell';

// CRITICAL: Use stderr for logging, not stdout (stdout is for JSON-RPC only)
const log = (message) => {
  console.error(`[PowerShell MCP] ${new Date().toISOString()} ${message}`);
};

log('Starting PowerShell MCP Server...');

// Create an MCP server instance
const server = new McpServer({
  name: 'powershell-mcp',
  version: '1.1.1',
});

// Basic PowerShell execution tool
server.tool(
  'execute-powershell',
  'Executes a PowerShell command and returns the output',
  {
    command: z.string().describe('The PowerShell command to execute.')
  },
  async ({ command }) => {
    log(`Executing command: ${command}`);
    
    try {
      const ps = new PowerShell({
        executableOptions: {
          '-ExecutionPolicy': 'Bypass',
          '-NoProfile': true,
        }
      });

      const result = await ps.invoke(command);
      await ps.dispose();

      log('Command executed successfully');
      
      return {
        content: [{
          type: 'text',
          text: result.raw || 'Command executed successfully with no output.'
        }]
      };

    } catch (error) {
      log(`PowerShell error: ${error.message}`);
      
      return {
        content: [{
          type: 'text',
          text: `Error executing PowerShell command: ${error.message}`
        }],
        isError: true
      };
    }
  }
);

// System info tool
server.tool(
  'get-system-info',
  'Get basic Windows system information',
  {},
  async () => {
    log('Getting system information');
    
    try {
      const ps = new PowerShell({
        executableOptions: {
          '-ExecutionPolicy': 'Bypass',
          '-NoProfile': true,
        }
      });

      const result = await ps.invoke('Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion | ConvertTo-Json');
      await ps.dispose();

      log('System info retrieved');
      
      return {
        content: [{
          type: 'text',
          text: `System Information:\n\n${result.raw}`
        }]
      };

    } catch (error) {
      log(`System info error: ${error.message}`);
      
      return {
        content: [{
          type: 'text',
          text: `Error getting system information: ${error.message}`
        }],
        isError: true
      };
    }
  }
);

log('Tools registered successfully');

// Set up the transport and start listening
const transport = new StdioServerTransport();
await server.connect(transport);

log('PowerShell MCP Server connected and ready!');

// Error handling
process.on('uncaughtException', (error) => {
  log(`Uncaught exception: ${error.message}`);
});

process.on('unhandledRejection', (reason) => {
  log(`Unhandled rejection: ${reason}`);
});
