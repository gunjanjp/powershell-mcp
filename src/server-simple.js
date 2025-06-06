import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { PowerShell } from 'node-powershell';

console.log('🚀 Starting PowerShell MCP Server...');

// Create an MCP server instance
const server = new McpServer({
  name: 'powershell-mcp-server',
  version: '1.1.0',
});

// Basic PowerShell execution tool
server.tool(
  'execute-powershell',
  'Execute a PowerShell command',
  {
    command: z.string().describe('The PowerShell command to execute')
  },
  async ({ command }) => {
    console.log(`📝 Executing PowerShell command: ${command}`);
    
    const ps = new PowerShell({
      executableOptions: {
        '-ExecutionPolicy': 'Bypass',
        '-NoProfile': true,
      }
    });
    
    try {
      const result = await ps.invoke(command);
      console.log('✅ Command executed successfully');
      
      return {
        content: [{
          type: 'text',
          text: `✅ Command executed successfully\n\nOutput:\n${result.raw || 'Command completed with no output.'}`
        }]
      };
    } catch (error) {
      console.log(`❌ Command failed: ${error.message}`);
      
      return {
        content: [{
          type: 'text',
          text: `❌ PowerShell command failed:\n\nError: ${error.message}`
        }],
        isError: true
      };
    } finally {
      await ps.dispose();
    }
  }
);

// System info tool
server.tool(
  'get-system-info',
  'Get basic Windows system information',
  {},
  async () => {
    console.log('📊 Getting system information...');
    
    const ps = new PowerShell({
      executableOptions: {
        '-ExecutionPolicy': 'Bypass',
        '-NoProfile': true,
      }
    });
    
    try {
      const result = await ps.invoke('Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion, TotalPhysicalMemory | ConvertTo-Json');
      console.log('✅ System info retrieved successfully');
      
      return {
        content: [{
          type: 'text',
          text: `🖥️ System Information\n\n\`\`\`json\n${result.raw}\n\`\`\``
        }]
      };
    } catch (error) {
      console.log(`❌ System info failed: ${error.message}`);
      
      return {
        content: [{
          type: 'text',
          text: `❌ Failed to get system information: ${error.message}`
        }],
        isError: true
      };
    } finally {
      await ps.dispose();
    }
  }
);

// Set up transport and start listening
const transport = new StdioServerTransport();
await server.connect(transport);

console.log('🎉 PowerShell MCP Server is running and ready for Claude!');
console.log('📝 Available tools:');
console.log('   - execute-powershell: Execute PowerShell commands');
console.log('   - get-system-info: Get Windows system information');
