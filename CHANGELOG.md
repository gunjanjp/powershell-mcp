# Changelog

All notable changes to the PowerShell MCP Server project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-06-06

### 🎉 Major Enhancement Release
This release transforms the PowerShell MCP Server from a basic tool into a comprehensive Windows system management solution.

### ✨ Added - New Features

#### **Enhanced Architecture**
- **Modular Design**: Restructured codebase with organized `src/`, `scripts/`, `examples/`, and `test/` directories
- **Multiple Tool Categories**: PowerShell execution, system monitoring, and file operations
- **Professional Project Structure**: Following industry best practices for Node.js projects

#### **New PowerShell Tools**
- `execute-powershell-script` - Execute PowerShell script files with parameters and working directory support
- `create-powershell-script` - Create new PowerShell scripts with specified content and executable permissions

#### **System Monitoring Tools**
- `get-system-info` - Comprehensive Windows system information including hardware, OS, and performance metrics
- `get-process-list` - Enhanced process monitoring with CPU/memory usage, sorting, and filtering options
- `get-service-status` - Windows services status monitoring with name and status filtering
- `check-disk-space` - Disk space usage analysis for all drives or specific drives

#### **File System Tools**
- `list-directory` - Enhanced directory listing with detailed information, filtering, and pattern matching
- `get-file-info` - Detailed file and directory metadata including size, dates, and attributes
- `search-files` - Recursive file search with pattern matching and result limiting

#### **Automated Setup System**
- **Auto-Fix Tool** (`npm run fix`) - One-command setup that handles everything automatically
- **Interactive Setup** (`npm run setup`) - Guided configuration with validation and testing
- **Safe Configuration Merging** - Preserves existing Claude Desktop MCP server configurations
- **Comprehensive Diagnostics** (`npm run diagnose`) - System health checks and troubleshooting

#### **Professional Tooling**
- **NPM Scripts**: Complete set of management commands (start, setup, fix, test, diagnose)
- **Health Checks**: Built-in PowerShell and system validation
- **Configuration Management**: Automatic Claude Desktop integration with validation
- **CI/CD Pipeline**: GitHub Actions workflow for automated testing

#### **Documentation and Examples**
- **Professional README**: Comprehensive documentation with usage examples and troubleshooting
- **Example Scripts**: Ready-to-use PowerShell scripts for common tasks
- **API Documentation**: Detailed tool reference with parameters and return formats
- **Development Guide**: Contributing guidelines and development setup instructions

### 🔧 Enhanced - Improvements

#### **Original Tool Enhancements**
- `execute-powershell` now supports optional working directory parameter
- Enhanced error handling with detailed error messages and context
- Improved output formatting with emojis and structured information
- Better session management with automatic disposal

#### **Security and Reliability**
- **Input Validation**: All tools use Zod schemas for parameter validation
- **Error Handling**: Comprehensive try-catch blocks with user-friendly error messages
- **Session Management**: Proper PowerShell session cleanup to prevent resource leaks
- **Configuration Safety**: Safe merging of Claude Desktop configurations

#### **User Experience**
- **Rich Output Formatting**: JSON responses with timestamps, emojis, and structured data
- **Detailed Logging**: Comprehensive logging with context and diagnostic information
- **Progress Indicators**: Visual feedback during setup and operations
- **Professional Messages**: Consistent, helpful messaging throughout the application

### 📋 Technical Improvements

#### **Codebase Organization**
- **Modular Architecture**: Separated tools into logical modules (`powershell-tools.js`, `system-tools.js`, `file-tools.js`)
- **Utility Functions**: Centralized system utilities and configuration management
- **ES Modules**: Modern JavaScript with proper import/export structure
- **Code Reusability**: Shared functions for common operations

#### **Configuration Management**
- **Cross-Platform Paths**: Proper handling of Windows, macOS, and Linux configuration paths
- **Validation System**: Configuration validation and health checking
- **Backup and Recovery**: Safe configuration updates with error recovery

#### **Development Infrastructure**
- **GitHub Actions**: Automated testing on Windows with multiple Node.js versions
- **NPM Package Configuration**: Professional package.json with proper metadata
- **File Structure**: Organized project structure following Node.js best practices
- **Documentation**: Comprehensive README, examples, and inline code documentation

### 🛠️ Project Structure Changes

#### **New Directory Structure**
```
powershell-mcp/
├── src/                    # Source code (NEW)
│   ├── server.js          # Enhanced main server
│   ├── tools/             # Tool implementations (NEW)
│   └── utils/             # Utility modules (NEW)
├── scripts/               # Setup and utility scripts (NEW)
├── examples/              # Example PowerShell scripts (NEW)
├── test/                  # Test files and documentation (NEW)
├── .github/workflows/     # CI/CD configuration (NEW)
└── [existing files]       # README, CHANGELOG, LICENSE, package.json
```

#### **Migration from v1.0.0**
- Original `server.js` functionality preserved and enhanced in `src/server.js`
- All dependencies maintained with added `zod` for validation
- Backward compatibility maintained for existing Claude Desktop configurations

### 🎯 Use Cases Enabled

#### **System Administration**
- Complete system monitoring and diagnostics
- Process and service management
- Disk space monitoring and alerts
- Hardware inventory and reporting

#### **File Management**
- Advanced file system operations
- Bulk file processing and organization
- Search and discovery operations
- Backup and maintenance scripts

#### **Development Workflow**
- Script creation and testing
- System setup automation
- Development environment management
- CI/CD integration possibilities

#### **Automation and Monitoring**
- Automated system health checks
- Resource usage monitoring
- Alert and notification systems
- Scheduled maintenance tasks

### 🚀 Performance and Compatibility

#### **Requirements Updated**
- **Node.js**: Minimum version 18.0.0 (updated from 14+)
- **Windows**: Windows 10/11 or Server 2016+ officially supported
- **PowerShell**: 5.1+ or PowerShell Core 7+ with enhanced detection

#### **Performance Optimizations**
- **Efficient Session Management**: Proper PowerShell session lifecycle
- **Resource Monitoring**: Built-in resource usage tracking
- **Optimized Tool Execution**: Reduced overhead and faster response times
- **Memory Management**: Proper cleanup and garbage collection

### 📚 Documentation

#### **Enhanced Documentation**
- **Comprehensive README**: 200+ lines of detailed documentation
- **API Reference**: Complete tool documentation with examples
- **Setup Guides**: Multiple installation methods with troubleshooting
- **Security Guidelines**: Best practices and security considerations
- **Contributing Guide**: Development setup and contribution guidelines

#### **Example Content**
- **System Information Script**: Complete system reporting
- **Process Monitor Script**: Advanced process monitoring with parameters
- **Backup Utility Script**: Professional backup solution with compression
- **Usage Examples**: Real-world usage scenarios with Claude

### 🔄 Migration Guide

#### **Upgrading from v1.0.0**
1. **Backup Configuration**: Current setup will be preserved
2. **Update Dependencies**: Run `npm install` to get new dependencies
3. **Update Entry Point**: Main server moved to `src/server.js`
4. **Reconfigure Claude**: Run `npm run fix` for automatic update
5. **Test Setup**: Run `npm run test` to validate

#### **Configuration Changes**
- Main entry point changed from `server.js` to `src/server.js`
- New NPM scripts available for management
- Enhanced configuration validation and health checks

---

## [1.0.0] - 2025-06-06

### 🎉 Initial Release
This is the first stable release of PowerShell MCP Server.

### ✨ Added
- **Core Functionality**
  - PowerShell command execution through Model Context Protocol (MCP)
  - Support for both Windows PowerShell and PowerShell Core
  - Real-time command output and error handling
  - Automatic PowerShell session cleanup and disposal
  - Secure execution with configurable execution policies

- **MCP Integration**
  - Full MCP SDK v1.12.1 compatibility
  - `execute-powershell` tool implementation
  - Proper MCP content format responses
  - Error handling with `isError` flag support

- **Documentation**
  - Comprehensive README.md with installation guide
  - Step-by-step Claude Desktop configuration
  - Usage examples and sample commands
  - API reference documentation
  - Troubleshooting section
  - Security considerations and best practices

- **Project Setup**
  - Node.js project structure with proper package.json
  - MIT License for maximum open source compatibility
  - Comprehensive .gitignore for Node.js projects
  - Repository metadata and links
  - Keywords for package discoverability

### 🛡️ Security
- Execution policy set to 'Bypass' for functionality
- PowerShell profiles disabled (`-NoProfile`) for security
- Proper session disposal to prevent resource leaks
- Input validation through Zod schema

### 📋 Technical Details
- **Node.js**: ES Modules (type: "module")
- **Dependencies**: 
  - @modelcontextprotocol/sdk: ^1.12.1
  - node-powershell: ^5.0.1
- **Minimum Requirements**: Node.js 14+, Windows OS, PowerShell 5.1+

### 🎯 Use Cases
- System administration through Claude
- Automated Windows management
- PowerShell script execution via LLM
- System monitoring and diagnostics
- Development workflow automation

---

## Version History Summary

### Development Phases
- **v0.1.0**: Initial MCP server structure (development)
- **v0.2.0**: Fixed MCP SDK API compatibility (development)  
- **v0.3.0**: Fixed PowerShell library integration (development)
- **v1.0.0**: First stable release with MIT license 🚀
- **v1.1.0**: Major enhancement release with comprehensive tooling 🎉

---

## Contributing

Please see our [Contributing Guidelines](README.md#contributing) for information on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
