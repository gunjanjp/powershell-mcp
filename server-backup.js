import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { PowerShell } from 'node-powershell';

// 1. Create an MCP server instance
const server = new McpServer({
  name: 'powershell-mcp',
  version: '0.3.0',
});

// 2. Define the tool for executing PowerShell commands
server.tool(
  'execute-powershell',
  'Executes a PowerShell command and returns the output',
  {
    command: z.string().describe('The PowerShell command or script path to execute.')
  },
  async ({ command }) => {
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

      return {
        content: [{
          type: 'text',
          text: result.raw || 'Command executed successfully with no output.'
        }]
      };

    } catch (error) {
      console.error(`PowerShell execution failed: ${error.message}`);
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

// 4. Set up the transport and start listening
const transport = new StdioServerTransport();
await server.connect(transport);

console.log('PowerShell MCP Server is running. Ready for Claude!');