#!/usr/bin/env node

import { PowerShell } from 'node-powershell';

console.log('🔍 Testing PowerShell MCP Server Components...\n');

// Test 1: PowerShell availability
console.log('Test 1: PowerShell Health Check');
try {
  const ps = new PowerShell({
    executableOptions: {
      '-ExecutionPolicy': 'Bypass',
      '-NoProfile': true,
    }
  });
  
  const result = await ps.invoke('Write-Output "PowerShell is working!"');
  console.log(`✅ PowerShell is available: ${result.raw.trim()}`);
  await ps.dispose();
} catch (error) {
  console.log(`❌ PowerShell test failed: ${error.message}`);
  process.exit(1);
}

// Test 2: Zod import
console.log('\nTest 2: Zod Import Check');
try {
  const { z } = await import('zod');
  console.log('✅ Zod is available');
} catch (error) {
  console.log(`❌ Zod import failed: ${error.message}`);
  process.exit(1);
}

// Test 3: MCP SDK import
console.log('\nTest 3: MCP SDK Import Check');
try {
  const { McpServer } = await import('@modelcontextprotocol/sdk/server/mcp.js');
  const { StdioServerTransport } = await import('@modelcontextprotocol/sdk/server/stdio.js');
  console.log('✅ MCP SDK is available');
} catch (error) {
  console.log(`❌ MCP SDK import failed: ${error.message}`);
  process.exit(1);
}

// Test 4: Simple server creation (without connecting)
console.log('\nTest 4: Server Creation Test');
try {
  const { McpServer } = await import('@modelcontextprotocol/sdk/server/mcp.js');
  const { z } = await import('zod');
  
  const server = new McpServer({
    name: 'test-server',
    version: '1.0.0',
  });
  
  server.tool(
    'test-tool',
    'A test tool',
    {
      message: z.string().describe('Test message')
    },
    async ({ message }) => {
      return {
        content: [{
          type: 'text',
          text: `Test response: ${message}`
        }]
      };
    }
  );
  
  console.log('✅ Server creation and tool registration successful');
} catch (error) {
  console.log(`❌ Server creation failed: ${error.message}`);
  process.exit(1);
}

// Test 5: PowerShell system command
console.log('\nTest 5: PowerShell System Command Test');
try {
  const ps = new PowerShell({
    executableOptions: {
      '-ExecutionPolicy': 'Bypass',
      '-NoProfile': true,
    }
  });
  
  const result = await ps.invoke('Get-Date');
  console.log(`✅ PowerShell system command works: ${result.raw.trim()}`);
  await ps.dispose();
} catch (error) {
  console.log(`❌ PowerShell system command failed: ${error.message}`);
  process.exit(1);
}

// Test 6: PowerShell JSON output
console.log('\nTest 6: PowerShell JSON Output Test');
try {
  const ps = new PowerShell({
    executableOptions: {
      '-ExecutionPolicy': 'Bypass',
      '-NoProfile': true,
    }
  });
  
  const result = await ps.invoke('Get-Date | ConvertTo-Json');
  console.log(`✅ PowerShell JSON output works`);
  console.log(`   Sample output: ${result.raw.substring(0, 100)}...`);
  await ps.dispose();
} catch (error) {
  console.log(`❌ PowerShell JSON test failed: ${error.message}`);
  process.exit(1);
}

console.log('\n🎉 All tests passed! The PowerShell MCP Server should work correctly.');
console.log('\n💡 Next steps:');
console.log('   1. Test the simplified server: node src/server-simple.js');
console.log('   2. Test the full server: node src/server.js');
console.log('   3. Configure Claude Desktop to use the server');
console.log('   4. Test with Claude Desktop application');
