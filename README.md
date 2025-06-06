# PowerShell MCP Server

A comprehensive Model Context Protocol (MCP) server that enables Claude and other LLM applications to execute PowerShell commands, scripts, and perform advanced system operations on Windows systems.

## 🌟 **Key Features**

- **🔧 Multiple PowerShell Tools**: Execute commands, scripts, and system operations
- **🖥️ System Monitoring**: Comprehensive system information, process monitoring, and performance metrics
- **📁 File Operations**: Advanced file system operations, searching, and management
- **⚙️ Auto-Configuration**: One-command setup with Claude Desktop integration
- **🛡️ Security**: Safe execution with configurable policies and input validation
- **📊 Rich Output**: Formatted JSON responses with timestamps and detailed information
- **🔍 Diagnostics**: Built-in health checks and troubleshooting tools

## 🛠️ **Available Tools**

### PowerShell Execution
- `execute-powershell` - Execute PowerShell commands with optional working directory
- `execute-powershell-script` - Run PowerShell script files with parameters
- `create-powershell-script` - Create new PowerShell scripts with specified content

### System Information
- `get-system-info` - Comprehensive Windows system information and hardware details
- `get-process-list` - Running processes with CPU and memory usage, sortable and filterable
- `get-service-status` - Windows services status with filtering options
- `check-disk-space` - Disk space usage for all drives or specific drives

### File System Operations
- `list-directory` - Enhanced directory listing with filtering and detailed information
- `get-file-info` - Detailed file and directory metadata
- `search-files` - Recursive file search with pattern matching

## 📋 **Prerequisites**

- **Windows** 10/11 or Windows Server 2016+
- **Node.js** 18.0.0 or higher
- **PowerShell** 5.1+ (Windows PowerShell) or PowerShell Core 7+
- **Claude Desktop** or other MCP-compatible application

## 🚀 **Quick Start**

### Option 1: Automated Setup (Recommended)
```bash
# Clone the repository
git clone https://github.com/gunjanjp/powershell-mcp.git
cd powershell-mcp

# One-command setup - installs dependencies and configures everything
npm run fix
```

### Option 2: Manual Setup
```bash
# Clone and install
git clone https://github.com/gunjanjp/powershell-mcp.git
cd powershell-mcp
npm install

# Configure manually
npm run setup install

# Restart Claude Desktop
```

### Option 3: Step-by-Step Setup
```bash
# Install dependencies
npm install

# Check system requirements
npm run diagnose

# Install server configuration
npm run setup install

# Validate setup
npm run test
```

## ⚙️ **Configuration**

The server automatically configures Claude Desktop by adding this configuration to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "powershell": {
      "command": "node",
      "args": ["C:/path/to/powershell-mcp/src/server.js"],
      "env": {}
    }
  }
}
```

**Configuration file locations:**
- **Windows**: `%APPDATA%\\Claude\\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

## 📖 **Usage Examples**

### Basic Commands
Ask Claude:
- *"Check my system information"*
- *"Show me the top 10 processes by CPU usage"*
- *"What's my disk space usage?"*
- *"Execute PowerShell: Get-Date"*

### Advanced Operations
Ask Claude:
- *"Create a PowerShell script to backup my Documents folder to D:\\Backups"*
- *"Search for all .log files in C:\\Windows\\System32"*
- *"Show me Windows services that are stopped"*
- *"List files in my Downloads folder with detailed information"*
- *"Get information about the file C:\\Windows\\System32\\notepad.exe"*

### System Monitoring
Ask Claude:
- *"Show me processes using more than 500MB of memory"*
- *"Check the status of services containing 'Windows'"*
- *"Get detailed system information including uptime and hardware specs"*

### Script Development
Ask Claude:
- *"Create a PowerShell script to monitor disk space and alert if any drive is below 10% free"*
- *"Write a script to list all files modified in the last 24 hours"*
- *"Generate a system health report script"*

## 🛠️ **Development and Scripts**

### Available npm Scripts
```bash
# Server operations
npm start                 # Start the MCP server
npm run fix              # Auto-setup everything (recommended)
npm run setup install   # Install server configuration
npm run setup uninstall # Remove server configuration

# Testing and diagnostics
npm test                 # Validate configuration
npm run diagnose         # Run comprehensive diagnostics
npm run check-health     # Check PowerShell health
npm run setup validate  # Validate current setup

# Utilities
npm run setup help       # Show setup tool help
```

### Manual Server Start
```bash
# Start server directly
node src/server.js

# Start with debug output
DEBUG=* node src/server.js
```

## 📁 **Project Structure**

```
powershell-mcp/
├── src/                          # Source code
│   ├── server.js                 # Main MCP server
│   ├── tools/                    # Tool implementations
│   │   ├── powershell-tools.js   # PowerShell execution tools
│   │   ├── system-tools.js       # System information tools
│   │   └── file-tools.js         # File system tools
│   └── utils/                    # Utility modules
│       ├── system-utils.js       # System utilities
│       └── config-utils.js       # Configuration management
├── scripts/                      # Setup and utility scripts
│   ├── setup.js                  # Interactive setup tool
│   └── auto-fix.js              # Automated setup
├── examples/                     # Example PowerShell scripts
│   ├── system-info.ps1          # System information script
│   ├── process-monitor.ps1      # Process monitoring script
│   └── backup-utility.ps1       # File backup utility
├── test/                        # Test files and documentation
├── .github/workflows/           # CI/CD configuration
├── README.md                    # This documentation
├── CHANGELOG.md                 # Version history
├── LICENSE                      # MIT License
└── package.json                 # npm configuration
```

## 🔧 **Advanced Configuration**

### PowerShell Execution Settings
You can modify PowerShell execution settings in `src/tools/powershell-tools.js`:

```javascript
const ps = new PowerShell({
  executableOptions: {
    '-ExecutionPolicy': 'Bypass',    // Execution policy
    '-NoProfile': true,              // Skip PowerShell profiles
    '-NonInteractive': true,         // Non-interactive mode
    '-WindowStyle': 'Hidden'         // Hidden window
  }
});
```

### Custom Tool Development
Add new tools by creating modules in `src/tools/` and registering them in `src/server.js`:

```javascript
import { registerCustomTools } from './tools/custom-tools.js';
registerCustomTools(server);
```

## 🛡️ **Security Considerations**

- **Execution Policy**: Server runs with `-ExecutionPolicy Bypass` for functionality
- **Input Validation**: All inputs are validated using Zod schemas
- **Session Management**: PowerShell sessions are properly disposed after use
- **Error Handling**: Comprehensive error handling prevents system damage
- **Audit Trail**: All commands are logged with timestamps

**Best Practices:**
- Always review generated scripts before execution
- Use working directories to limit scope
- Test scripts in safe environments first
- Monitor system resources during operations
- Keep the server updated to latest version

## 🐛 **Troubleshooting**

### Common Issues

#### "PowerShell health check failed"
```bash
# Check PowerShell availability
powershell -Command "Get-Host"
pwsh -Command "Get-Host"  # For PowerShell Core

# Check execution policy
Get-ExecutionPolicy
```

#### "MCP server not found"
```bash
# Validate configuration
npm run test

# Reinstall configuration
npm run setup install

# Check paths
npm run diagnose
```

#### "Node.js version error"
```bash
# Check Node.js version (requires 18+)
node --version

# Update Node.js if needed
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm start

# Run comprehensive diagnostics
npm run diagnose

# Check specific components
npm run check-health
```

### Reset Configuration
```bash
# Remove current configuration
npm run setup uninstall

# Clean reinstall
npm run fix
```

## 📊 **Performance Optimization**

### Tips for Better Performance
- Use specific working directories to limit scope
- Filter processes and services when possible
- Limit file search results with the `limit` parameter
- Use PowerShell Core (pwsh) for better performance
- Close Claude Desktop occasionally to free resources

### Resource Monitoring
```bash
# Check system resource usage
npm run diagnose

# Monitor during heavy operations
Get-Process node | Select-Object CPU, WorkingSet
```

## 🤝 **Contributing**

We welcome contributions! Please see our contributing guidelines:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature-name`
3. **Make** your changes and test thoroughly
4. **Add** tests for new functionality
5. **Update** documentation as needed
6. **Commit** your changes: `git commit -am 'Add new feature'`
7. **Push** to the branch: `git push origin feature-name`
8. **Submit** a pull request

### Development Setup
```bash
# Clone your fork
git clone https://github.com/yourusername/powershell-mcp.git
cd powershell-mcp

# Install dependencies
npm install

# Run tests
npm run test

# Test your changes
npm run diagnose
```

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 **Related Projects**

- [Model Context Protocol](https://modelcontextprotocol.io/) - Official MCP specification
- [Claude Desktop](https://claude.ai/) - AI assistant with MCP support
- [MCP SDK TypeScript](https://github.com/modelcontextprotocol/typescript-sdk) - Official TypeScript SDK
- [PowerShell](https://github.com/PowerShell/PowerShell) - PowerShell Core repository

## 🎯 **Roadmap**

### Version 1.2.0 (Planned)
- [ ] PowerShell module management tools
- [ ] Registry operations
- [ ] Network diagnostics tools
- [ ] Scheduled task management
- [ ] Event log analysis tools

### Version 1.3.0 (Future)
- [ ] GUI application automation
- [ ] Database query tools
- [ ] Cloud service integration
- [ ] Advanced security scanning
- [ ] Performance benchmarking tools

## 📞 **Support**

- **Issues**: [GitHub Issues](https://github.com/gunjanjp/powershell-mcp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/gunjanjp/powershell-mcp/discussions)
- **Documentation**: This README and `/examples` directory

## ⭐ **Acknowledgments**

- [Model Context Protocol team](https://modelcontextprotocol.io/) for the excellent MCP specification
- [Anthropic](https://anthropic.com/) for Claude and MCP support
- [PowerShell team](https://github.com/PowerShell/PowerShell) for PowerShell Core
- The open-source community for tools and inspiration

---

**⚠️ Important**: This tool provides direct access to PowerShell commands and system operations. Use responsibly and be aware of the security implications when executing system commands.

Made with ❤️ for the Claude and PowerShell communities
