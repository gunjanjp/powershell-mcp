# Changelog

All notable changes to the PowerShell MCP Server project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

## Version History

### Development Phases
- **v0.1.0**: Initial MCP server structure (development)
- **v0.2.0**: Fixed MCP SDK API compatibility (development)  
- **v0.3.0**: Fixed PowerShell library integration (development)
- **v1.0.0**: First stable release with MIT license 🚀

---

## Contributing

Please see our [Contributing Guidelines](README.md#contributing) for information on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
