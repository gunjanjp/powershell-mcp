# Changelog

All notable changes to the PowerShell MCP Server project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2025-06-06

### 🐛 Critical Bug Fix Release
This release resolves the critical Claude Desktop integration issue and significantly improves project structure and efficiency.

### 🔧 Fixed - Critical Issues

#### **Claude Desktop JSON Parsing Error - RESOLVED**
- **Issue**: `Unexpected token 'P', "PowerShell"... is not valid JSON` error preventing Claude Desktop integration
- **Root Cause**: Console.log output was being sent to stdout (JSON-RPC communication channel)
- **Solution**: Changed all logging to use `console.error` (stderr) to preserve stdout for JSON-RPC only
- **Impact**: Claude Desktop integration now works perfectly without JSON parsing errors

#### **MCP Protocol Compliance**
- **Fixed**: Proper separation of logging (stderr) and JSON-RPC communication (stdout)
- **Enhanced**: Error handling and logging throughout all server files
- **Improved**: MCP protocol compliance for better stability

### 🧹 Major Project Cleanup

#### **Streamlined File Structure**
- **Removed Redundant Files**: Eliminated 16+ duplicate and redundant files
  - `src/server-fixed.js`, `src/server-debug.js`, `src/server-simple.js`, `src/server-standalone.js`
  - `claude_desktop_config_fixed.json` and duplicate configuration files  
  - `check-claude-config.bat`, `diagnose-errors.bat`, `minimal-test.js`
  - `setup-claude-config.bat`, `test-fixed-server.bat`, `server-backup.js`
- **Consolidated Functionality**: All features moved to single efficient `src/server.js`
- **Clean Architecture**: Focused project structure with only essential files

#### **Simplified Setup Process**
- **Single Setup Script**: `setup.bat` provides one-command installation
- **Streamlined Configuration**: `claude_desktop_config.json` points to main server
- **Updated Documentation**: `README.md` reflects current clean structure
- **Simplified NPM Scripts**: Reduced to essential commands only

### ✨ Enhanced - Efficiency Improvements

#### **Optimized Server Architecture**
- **Single Server File**: `src/server.js` contains all functionality with proper stderr logging
- **Improved Performance**: Reduced file I/O and startup time
- **Better Maintainability**: Single source of truth for server functionality
- **Enhanced Reliability**: Consolidated error handling and logging

#### **Updated Configuration**
- **Main Entry Point**: `src/server.js` (consolidated from multiple server files)
- **Package.json**: Updated to v1.1.1 with streamlined scripts
- **Claude Desktop Config**: Simplified configuration pointing to main server
- **Documentation**: Updated README.md focused on current architecture

### 📋 Technical Improvements

#### **Logging Architecture**
- **Stderr Logging**: All debug/info messages properly routed to stderr
- **Clean Stdout**: Reserved exclusively for JSON-RPC communication
- **Proper Error Handling**: Enhanced error logging with context and timestamps
- **MCP Compliance**: Full adherence to MCP protocol communication standards

#### **Development Workflow**
- **Simplified Testing**: Single server testing with `npm test`
- **One-Command Setup**: `setup.bat` handles complete installation
- **Clean Git History**: Organized commits with comprehensive change documentation
- **Improved Diagnostics**: `diagnose.bat` for troubleshooting when needed

### 🎯 Project Structure - Before vs After

#### **Before v1.1.1 (Cluttered)**
```
powershell-mcp/
├── src/
│   ├── server.js
│   ├── server-fixed.js          ← REMOVED
│   ├── server-debug.js          ← REMOVED
│   ├── server-simple.js         ← REMOVED
│   ├── server-standalone.js     ← REMOVED
│   └── tools/
├── server-backup.js             ← REMOVED
├── claude_desktop_config_fixed.json ← REMOVED
├── 8+ redundant batch files     ← REMOVED
└── Multiple duplicate configs   ← REMOVED
```

#### **After v1.1.1 (Clean)**
```
powershell-mcp/
├── src/
│   ├── server.js               ← SINGLE MAIN SERVER (with stderr fix)
│   ├── tools/                  ← Tool implementations
│   └── utils/                  ← Utility modules
├── setup.bat                   ← ONE-CLICK SETUP
├── claude_desktop_config.json  ← SINGLE CONFIG
├── Essential docs and configs only
└── Clean, focused structure
```

### 🚀 Migration and Compatibility

#### **Seamless Migration**
- **Backward Compatible**: Existing installations continue to work
- **Auto-Update**: `setup.bat` updates configuration to use main server
- **No Breaking Changes**: All existing functionality preserved and enhanced
- **Improved Reliability**: Better error handling and stability

#### **Claude Desktop Integration**
- **Fixed Configuration**: Points to efficient `src/server.js`
- **Resolved Errors**: No more JSON parsing issues
- **Enhanced Stability**: Proper MCP protocol compliance
- **Better Performance**: Reduced startup time and resource usage

### 🎉 User Experience Improvements

#### **Simplified Setup**
- **One Script**: `setup.bat` handles everything automatically
- **Clear Instructions**: Updated README with current setup process
- **Better Diagnostics**: Improved error messages and troubleshooting
- **Faster Setup**: Reduced setup time and complexity

#### **Enhanced Reliability**
- **Stable Operation**: Fixed Claude Desktop communication issues
- **Better Error Handling**: Comprehensive error reporting and recovery
- **Improved Logging**: Clear, contextual log messages for troubleshooting
- **Consistent Performance**: Optimized server architecture

### 🛠️ Development Impact

#### **Cleaner Codebase**
- **Reduced Complexity**: Single server file vs multiple variants
- **Better Maintainability**: Easier to understand and modify
- **Improved Testing**: Simplified testing with single server target
- **Enhanced Documentation**: Focused on current architecture

#### **Efficient Development Workflow**
- **Faster Builds**: Reduced file processing and dependencies
- **Simpler Debugging**: Single file to debug vs multiple variants
- **Clear Architecture**: Well-defined structure and responsibilities
- **Better Version Control**: Clean git history with meaningful commits

---

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
- **v1.1.1**: Critical bug fix and project cleanup release 🔧

---

## Contributing

Please see our [Contributing Guidelines](README.md#contributing) for information on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
