# PowerShell MCP Server Tests

This directory contains test files for the PowerShell MCP Server.

## Test Structure

### Automated Tests
- `test-server.js` - Basic server functionality tests
- `test-tools.js` - Tool registration and execution tests
- `test-config.js` - Configuration management tests

### Manual Testing

#### Quick Test Commands
```bash
# Test server health
npm run check-health

# Validate configuration
npm run test

# Run full diagnostics
npm run diagnose

# Test setup process
npm run setup validate
```

#### PowerShell Integration Tests
```powershell
# Test basic PowerShell execution
node -e "
import('./src/utils/system-utils.js').then(m => 
  m.checkPowerShellHealth().then(r => 
    console.log('PowerShell Health:', JSON.stringify(r, null, 2))
  )
)"

# Test system info retrieval
node -e "
import('./src/utils/system-utils.js').then(m => 
  m.getSystemInfo().then(r => 
    console.log('System Info:', JSON.stringify(r, null, 2))
  )
)"
```

## Test Scenarios

### 1. Server Startup Test
- Verify server starts without errors
- Check all tools are registered
- Validate MCP protocol compliance

### 2. Tool Execution Tests
- Test `execute-powershell` with basic commands
- Test `get-system-info` functionality
- Test `list-directory` operations
- Test error handling for invalid commands

### 3. Configuration Tests
- Test Claude Desktop config generation
- Test config file validation
- Test safe merging of existing configurations

### 4. Security Tests
- Test PowerShell execution policies
- Test input validation and sanitization
- Test error handling for security violations

### 5. Integration Tests
- Test with Claude Desktop integration
- Test multi-tool workflows
- Test script execution scenarios

## Running Tests

### Automated Testing (CI/CD)
The GitHub Actions workflow automatically runs tests on:
- Windows Server latest
- Node.js versions 18.x, 20.x, 21.x
- Multiple PowerShell versions

### Manual Testing
```bash
# Install and run all tests
npm install
npm run test

# Run specific test categories
npm run check-health     # PowerShell health check
npm run diagnose         # Full system diagnostics
npm run setup validate   # Configuration validation
```

### Test Coverage Areas
- ✅ PowerShell availability and health
- ✅ Node.js compatibility (18+)
- ✅ MCP tool registration
- ✅ Configuration file management
- ✅ Error handling and validation
- ✅ Windows platform compatibility
- ✅ Example script execution

## Contributing Tests

When adding new features:
1. Add corresponding test cases
2. Update this README with new test procedures
3. Ensure tests pass in CI/CD pipeline
4. Include both positive and negative test cases

## Test Data

Test scripts use safe, read-only operations:
- System information queries
- File system browsing (read-only)
- Process and service listing
- Non-destructive PowerShell commands

No tests modify system state or require administrative privileges.
