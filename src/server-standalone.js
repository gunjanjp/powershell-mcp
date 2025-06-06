import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { PowerShell } from 'node-powershell';

// CRITICAL FIX: Use stderr for logging (stdout reserved for JSON-RPC)
const log = (message) => {
  console.error(`[PowerShell MCP Standalone] ${message}`);
};

log('Starting PowerShell MCP Server (Standalone)...');

// Create an MCP server instance
const server = new McpServer({
  name: 'powershell-mcp',
  version: '1.1.1',
});

// Basic PowerShell execution tool - EXACTLY like the working original
server.tool(
  'execute-powershell',
  'Executes a PowerShell command and returns the output',
  {
    command: z.string().describe('The PowerShell command or script path to execute.')
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
      
      // Ensure the PowerShell session is properly closed
      await ps.dispose();

      log('Command executed successfully');
      
      return {
        content: [{
          type: 'text',
          text: result.raw || 'Command executed successfully with no output.'
        }]
      };

    } catch (error) {
      log(`PowerShell execution failed: ${error.message}`);
      
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

// Simple system info tool
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
      log(`System info failed: ${error.message}`);
      
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

log('Tools registered');

// Set up the transport and start listening
const transport = new StdioServerTransport();
await server.connect(transport);

log('PowerShell MCP Server is running and ready for Claude!');
