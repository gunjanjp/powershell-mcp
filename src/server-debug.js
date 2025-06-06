#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { PowerShell } from 'node-powershell';

// Enhanced logging for Claude Desktop debugging
const log = (level, message) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] [${level}] ${message}`);
};

log('INFO', 'PowerShell MCP Server starting with enhanced debugging...');

// Create an MCP server instance
const server = new McpServer({
  name: 'powershell-mcp',
  version: '1.1.1',
});

log('INFO', 'MCP Server instance created');

// Basic PowerShell execution tool
server.tool(
  'execute-powershell',
  'Executes a PowerShell command and returns the output',
  {
    command: z.string().describe('The PowerShell command to execute.')
  },
  async ({ command }) => {
    log('INFO', `Executing PowerShell command: ${command}`);
    
    try {
      const ps = new PowerShell({
        executableOptions: {
          '-ExecutionPolicy': 'Bypass',
          '-NoProfile': true,
        }
      });

      const result = await ps.invoke(command);
      await ps.dispose();

      log('INFO', 'PowerShell command executed successfully');
      
      return {
        content: [{
          type: 'text',
          text: result.raw || 'Command executed successfully with no output.'
        }]
      };

    } catch (error) {
      log('ERROR', `PowerShell execution failed: ${error.message}`);
      
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

log('INFO', 'PowerShell tool registered');

// Simple system info tool
server.tool(
  'get-system-info',
  'Get basic Windows system information',
  {},
  async () => {
    log('INFO', 'Getting system information');
    
    try {
      const ps = new PowerShell({
        executableOptions: {
          '-ExecutionPolicy': 'Bypass',
          '-NoProfile': true,
        }
      });

      const result = await ps.invoke('Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion | ConvertTo-Json');
      await ps.dispose();

      log('INFO', 'System information retrieved successfully');
      
      return {
        content: [{
          type: 'text',
          text: `System Information:\n\n${result.raw}`
        }]
      };

    } catch (error) {
      log('ERROR', `System info failed: ${error.message}`);
      
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

log('INFO', 'System info tool registered');

// Set up the transport and start listening
log('INFO', 'Setting up transport...');
const transport = new StdioServerTransport();

log('INFO', 'Connecting to transport...');
await server.connect(transport);

log('INFO', 'PowerShell MCP Server is running and ready for Claude Desktop!');
log('INFO', 'Available tools: execute-powershell, get-system-info');

// Keep the process alive and log any unexpected exits
process.on('exit', (code) => {
  log('INFO', `Process exiting with code: ${code}`);
});

process.on('uncaughtException', (error) => {
  log('ERROR', `Uncaught exception: ${error.message}`);
  log('ERROR', `Stack: ${error.stack}`);
});

process.on('unhandledRejection', (reason, promise) => {
  log('ERROR', `Unhandled rejection at: ${promise}, reason: ${reason}`);
});
