import { PowerShell } from 'node-powershell';
import { z } from 'zod';

/**
 * Execute a file system command safely
 */
async function executeFileCommand(command) {
  const ps = new PowerShell({
    executableOptions: {
      '-ExecutionPolicy': 'Bypass',
      '-NoProfile': true,
    }
  });
  
  try {
    const result = await ps.invoke(command);
    return {
      success: true,
      output: result.raw || 'Command executed successfully.',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  } finally {
    await ps.dispose();
  }
}

/**
 * Register file system tools
 */
export function registerFileTools(server) {

  // Enhanced directory listing
  server.tool(
    'list-directory',
    'List contents of a directory with detailed information',
    {
      path: z.string().describe('Directory path to list'),
      detailed: z.boolean().optional().default(false).describe('Show detailed information (like ls -la)'),
      filter: z.string().optional().describe('Optional file filter pattern (e.g., "*.txt", "*.ps1")')
    },
    async ({ path, detailed, filter }) => {
      try {
        let command = `Get-ChildItem -Path "${path}"`;
        if (filter) {
          command += ` -Filter "${filter}"`;
        }
        command += ' -ErrorAction SilentlyContinue';
        
        if (detailed) {
          command += ` | Select-Object Mode, LastWriteTime, Length, Name, FullName | ConvertTo-Json`;
        } else {
          command += ` | Select-Object Name, @{Name="Type";Expression={if($_.PSIsContainer){"Directory"}else{"File"}}}, LastWriteTime | ConvertTo-Json`;
        }
        
        const result = await executeFileCommand(command);
        
        if (result.success) {
          const detailLevel = detailed ? 'Detailed' : 'Simple';
          return {
            content: [{
              type: 'text',
              text: `📁 **Directory Listing** (${detailLevel})\\n\\n📍 Path: ${path}\\n${filter ? `🔍 Filter: ${filter}` : ''}\\n\\n\`\`\`json\\n${result.output}\\n\`\`\`\\n\\n📅 Retrieved: ${result.timestamp}`
            }]
          };
        } else {
          return {
            content: [{
              type: 'text',
              text: `❌ Failed to list directory:\\n\\nPath: ${path}\\nError: ${result.error}`
            }],
            isError: true
          };
        }
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `💥 Unexpected error listing directory: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );

  // File information tool
  server.tool(
    'get-file-info',
    'Get detailed information about a file or directory',
    {
      path: z.string().describe('Path to the file or directory')
    },
    async ({ path }) => {
      try {
        const command = `
          $item = Get-Item -Path "${path}" -ErrorAction SilentlyContinue
          if ($item) {
            $info = @{
              'Name' = $item.Name
              'FullName' = $item.FullName
              'Type' = if ($item.PSIsContainer) { "Directory" } else { "File" }
              'Size' = if ($item.PSIsContainer) { "N/A" } else { "$([math]::Round($item.Length / 1KB, 2)) KB" }
              'Created' = $item.CreationTime
              'Modified' = $item.LastWriteTime
              'Accessed' = $item.LastAccessTime
              'Attributes' = $item.Attributes
              'Extension' = if ($item.PSIsContainer) { "N/A" } else { $item.Extension }
            }
            if (-not $item.PSIsContainer -and $item.Length -gt 1MB) {
              $info.Size = "$([math]::Round($item.Length / 1MB, 2)) MB"
            }
            if (-not $item.PSIsContainer -and $item.Length -gt 1GB) {
              $info.Size = "$([math]::Round($item.Length / 1GB, 2)) GB"
            }
            $info | ConvertTo-Json
          } else {
            Write-Error "File or directory not found: ${path}"
          }
        `;
        
        const result = await executeFileCommand(command);
        
        if (result.success) {
          return {
            content: [{
              type: 'text',
              text: `📄 **File Information**\\n\\n📍 Path: ${path}\\n\\n\`\`\`json\\n${result.output}\\n\`\`\`\\n\\n📅 Retrieved: ${result.timestamp}`
            }]
          };
        } else {
          return {
            content: [{
              type: 'text',
              text: `❌ Failed to get file information:\\n\\nPath: ${path}\\nError: ${result.error}`
            }],
            isError: true
          };
        }
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `💥 Unexpected error getting file info: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );

  // Search files tool
  server.tool(
    'search-files',
    'Search for files and directories matching a pattern',
    {
      searchPath: z.string().describe('Directory path to search in'),
      pattern: z.string().describe('Search pattern (supports wildcards like *.txt, *config*)'),
      recursive: z.boolean().optional().default(true).describe('Search recursively in subdirectories'),
      limit: z.number().optional().default(50).describe('Maximum number of results to return')
    },
    async ({ searchPath, pattern, recursive, limit }) => {
      try {
        let command = `Get-ChildItem -Path "${searchPath}" -Filter "${pattern}"`;
        if (recursive) {
          command += ' -Recurse';
        }
        command += ` -ErrorAction SilentlyContinue | Select-Object -First ${limit} Name, FullName, @{Name="Type";Expression={if($_.PSIsContainer){"Directory"}else{"File"}}}, LastWriteTime | ConvertTo-Json`;
        
        const result = await executeFileCommand(command);
        
        if (result.success) {
          return {
            content: [{
              type: 'text',
              text: `🔍 **File Search Results** (Max ${limit})\\n\\n📍 Search Path: ${searchPath}\\n🔎 Pattern: ${pattern}\\n📂 Recursive: ${recursive}\\n\\n\`\`\`json\\n${result.output}\\n\`\`\`\\n\\n📅 Retrieved: ${result.timestamp}`
            }]
          };
        } else {
          return {
            content: [{
              type: 'text',
              text: `❌ Failed to search files:\\n\\nPath: ${searchPath}\\nPattern: ${pattern}\\nError: ${result.error}`
            }],
            isError: true
          };
        }
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `💥 Unexpected error searching files: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );
}
