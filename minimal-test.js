#!/usr/bin/env node

console.log('🧪 PowerShell MCP Minimal Test Suite');
console.log('=====================================\n');

// Test 1: Basic imports
console.log('Test 1: Testing imports...');
try {
  console.log('  → Importing MCP SDK...');
  const { McpServer } = await import('@modelcontextprotocol/sdk/server/mcp.js');
  console.log('  ✅ MCP SDK imported successfully');
  
  console.log('  → Importing StdioServerTransport...');
  const { StdioServerTransport } = await import('@modelcontextprotocol/sdk/server/stdio.js');
  console.log('  ✅ StdioServerTransport imported successfully');
  
  console.log('  → Importing Zod...');
  const { z } = await import('zod');
  console.log('  ✅ Zod imported successfully');
  
  console.log('  → Importing node-powershell...');
  const { PowerShell } = await import('node-powershell');
  console.log('  ✅ node-powershell imported successfully');
  
} catch (error) {
  console.log(`  ❌ Import failed: ${error.message}`);
  console.log(`  📋 Stack: ${error.stack}`);
  process.exit(1);
}

// Test 2: PowerShell basic functionality
console.log('\nTest 2: Testing PowerShell basic functionality...');
try {
  const { PowerShell } = await import('node-powershell');
  
  const ps = new PowerShell({
    executableOptions: {
      '-ExecutionPolicy': 'Bypass',
      '-NoProfile': true,
    }
  });
  
  console.log('  → PowerShell instance created');
  
  const result = await ps.invoke('Write-Output "Test successful"');
  console.log(`  ✅ PowerShell test result: ${result.raw.trim()}`);
  
  await ps.dispose();
  console.log('  ✅ PowerShell session disposed properly');
  
} catch (error) {
  console.log(`  ❌ PowerShell test failed: ${error.message}`);
  console.log(`  📋 Stack: ${error.stack}`);
  process.exit(1);
}

// Test 3: MCP Server creation
console.log('\nTest 3: Testing MCP Server creation...');
try {
  const { McpServer } = await import('@modelcontextprotocol/sdk/server/mcp.js');
  const { z } = await import('zod');
  
  const server = new McpServer({
    name: 'test-server',
    version: '1.0.0',
  });
  
  console.log('  ✅ MCP Server created successfully');
  
  // Test tool registration
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
  
  console.log('  ✅ Tool registered successfully');
  
} catch (error) {
  console.log(`  ❌ MCP Server test failed: ${error.message}`);
  console.log(`  📋 Stack: ${error.stack}`);
  process.exit(1);
}

// Test 4: File system checks
console.log('\nTest 4: File system checks...');
try {
  const fs = await import('fs/promises');
  
  console.log('  → Checking src directory...');
  const srcStats = await fs.stat('src');
  console.log(`  ✅ src directory exists (${srcStats.isDirectory() ? 'directory' : 'file'})`);
  
  console.log('  → Checking node_modules...');
  const nmStats = await fs.stat('node_modules');
  console.log(`  ✅ node_modules exists (${nmStats.isDirectory() ? 'directory' : 'file'})`);
  
  console.log('  → Checking package.json...');
  const pkgStats = await fs.stat('package.json');
  console.log(`  ✅ package.json exists (${pkgStats.isFile() ? 'file' : 'directory'})`);
  
} catch (error) {
  console.log(`  ❌ File system check failed: ${error.message}`);
  // Don't exit on this error, just warn
}

console.log('\n🎉 All critical tests passed!');
console.log('\n💡 Try running the standalone server:');
console.log('   node src/server-standalone.js');
