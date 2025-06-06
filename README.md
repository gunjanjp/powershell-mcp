# PowerShell MCP Server

A Model Context Protocol (MCP) server that enables Claude and other LLM applications to execute PowerShell commands and scripts on Windows systems.

## 🚀 Features

- Execute PowerShell commands directly from Claude
- Support for both PowerShell Core (pwsh) and Windows PowerShell
- Secure execution with configurable execution policies
- Real-time command output and error handling
- Cross-compatible with MCP-enabled applications

## 📋 Prerequisites

- **Node.js** (version 14 or higher)
- **Windows** operating system
- **PowerShell** (Windows PowerShell 5.1+ or PowerShell Core 7+)
- **Claude Desktop** or other MCP-compatible application

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gunjanjp/powershell-mcp.git
   cd powershell-mcp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Verify PowerShell is available:**
   ```bash
   powershell -Command "Get-Host"
   ```

## ⚙️ Configuration

### For Claude Desktop

1. **Locate your Claude configuration file:**
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

2. **Add the PowerShell MCP server to your configuration:**
   ```json
   {
     "mcpServers": {
       "powershell": {
         "command": "node",
         "args": ["C:/path/to/powershell-mcp/server.js"],
         "env": {}
       }
     }
   }
   ```

3. **Update the path** to match your installation directory.

4. **Restart Claude Desktop** to load the new MCP server.

## 🚀 Usage

### Starting the Server

Run the MCP server directly:
```bash
node server.js
```

You should see:
```
PowerShell MCP Server is running. Ready for Claude!
```

### Using with Claude

Once configured, you can ask Claude to execute PowerShell commands:

**Examples:**
- "Check the current date and time"
- "Show me the system information"
- "List running processes"
- "Check disk space usage"
- "Get Windows version details"

**Sample Commands Claude can execute:**
```powershell
Get-Date
Get-ComputerInfo
Get-Process | Sort-Object CPU -Descending | Select-Object -First 10
Get-WmiObject -Class Win32_LogicalDisk | Select-Object DeviceID, Size, FreeSpace
Get-Service | Where-Object {$_.Status -eq "Running"}
```

## 🛡️ Security Considerations

- The server runs with `-ExecutionPolicy Bypass` for functionality
- Always review commands before execution
- Consider running in a restricted environment for production use
- Be cautious with system-modifying commands

## 🔧 Configuration Options

You can modify the PowerShell execution options in `server.js`:

```javascript
const ps = new PowerShell({
  executableOptions: {
    '-ExecutionPolicy': 'Bypass',    // Execution policy
    '-NoProfile': true,              // Skip PowerShell profiles
  }
});
```

## 📁 Project Structure

```
claude-powershell-mcp/
├── server.js              # Main MCP server implementation
├── package.json           # Node.js dependencies and scripts
├── package-lock.json      # Dependency lock file
├── .gitignore             # Git ignore rules
└── README.md              # This documentation
```

## 🐛 Troubleshooting

### Common Issues

1. **"MCP server not found" error:**
   - Verify the path in Claude's configuration file
   - Ensure Node.js is installed and accessible
   - Check that all dependencies are installed (`npm install`)

2. **PowerShell execution errors:**
   - Verify PowerShell is available in your system PATH
   - Check execution policy: `Get-ExecutionPolicy`
   - Try running the server as Administrator if needed

3. **Permission denied errors:**
   - Run Command Prompt/PowerShell as Administrator
   - Check Windows security settings

### Debug Mode

Enable debug logging by modifying the server startup:
```bash
DEBUG=* node server.js
```

## 🔄 Development

### Testing the Server

Test individual PowerShell commands:
```bash
# In another terminal
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d '{"command": "Get-Date"}'
```

### Making Changes

1. Modify `server.js` for functionality changes
2. Update `package.json` for dependency changes
3. Test thoroughly before committing
4. Follow semantic versioning for releases

## 📝 API Reference

### Tool: `execute-powershell`

**Description:** Executes a PowerShell command and returns the output.

**Parameters:**
- `command` (string): The PowerShell command or script to execute

**Returns:**
- `content`: Array with text output from the command
- `isError`: Boolean indicating if an error occurred

**Example:**
```json
{
  "name": "execute-powershell",
  "arguments": {
    "command": "Get-Process | Select-Object -First 5"
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -am 'Add new feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚡ Quick Start Example

After installation and configuration:

1. **Start Claude Desktop**
2. **Ask Claude:** "Can you check my system's current date and time?"
3. **Claude will respond** with the current date/time using the PowerShell MCP server

## 🔗 Related Links

- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Claude Desktop](https://claude.ai/)
- [PowerShell Documentation](https://docs.microsoft.com/en-us/powershell/)
- [Node.js](https://nodejs.org/)

---

**⚠️ Important:** This tool provides direct access to PowerShell commands. Use responsibly and be aware of the security implications when executing system commands.
