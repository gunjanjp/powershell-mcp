# Backup Utility Script
# Usage: Ask Claude to "Execute PowerShell script: examples/backup-utility.ps1" 
# Parameters: -SourcePath "C:\Users\Username\Documents" -BackupPath "D:\Backups"

param(
    [Parameter(Mandatory=$true)]
    [string]$SourcePath,
    
    [Parameter(Mandatory=$true)]
    [string]$BackupPath,
    
    [string]$FilePattern = "*.*",
    [switch]$IncludeSubdirectories = $true,
    [switch]$CompressBackup = $false
)

Write-Host "=== Backup Utility ===" -ForegroundColor Green
Write-Host ""

try {
    # Validate source path
    if (-not (Test-Path $SourcePath)) {
        Write-Error "Source path does not exist: $SourcePath"
        return
    }
    
    # Create backup directory if it doesn't exist
    if (-not (Test-Path $BackupPath)) {
        Write-Host "Creating backup directory: $BackupPath" -ForegroundColor Yellow
        New-Item -ItemType Directory -Path $BackupPath -Force | Out-Null
    }
    
    # Generate backup folder name with timestamp
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupFolder = Join-Path $BackupPath "Backup_$timestamp"
    New-Item -ItemType Directory -Path $backupFolder -Force | Out-Null
    
    Write-Host "--- Backup Configuration ---" -ForegroundColor Yellow
    Write-Host "Source: $SourcePath"
    Write-Host "Destination: $backupFolder"
    Write-Host "Pattern: $FilePattern"
    Write-Host "Include Subdirectories: $IncludeSubdirectories"
    Write-Host "Compress: $CompressBackup"
    Write-Host ""
    
    # Get files to backup
    Write-Host "Scanning files..." -ForegroundColor Yellow
    if ($IncludeSubdirectories) {
        $files = Get-ChildItem -Path $SourcePath -Filter $FilePattern -Recurse -File -ErrorAction SilentlyContinue
    } else {
        $files = Get-ChildItem -Path $SourcePath -Filter $FilePattern -File -ErrorAction SilentlyContinue
    }
    
    if ($files.Count -eq 0) {
        Write-Warning "No files found matching pattern: $FilePattern"
        return
    }
    
    Write-Host "Found $($files.Count) files to backup" -ForegroundColor Green
    
    # Calculate total size
    $totalSize = ($files | Measure-Object -Property Length -Sum).Sum
    $totalSizeMB = [math]::Round($totalSize / 1MB, 2)
    Write-Host "Total size: $totalSizeMB MB"
    Write-Host ""
    
    # Copy files
    Write-Host "--- Starting Backup ---" -ForegroundColor Yellow
    $copiedCount = 0
    $errorCount = 0
    
    foreach ($file in $files) {
        try {
            # Maintain directory structure
            $relativePath = $file.FullName.Substring($SourcePath.Length + 1)
            $destinationFile = Join-Path $backupFolder $relativePath
            $destinationDir = Split-Path $destinationFile -Parent
            
            # Create directory if needed
            if (-not (Test-Path $destinationDir)) {
                New-Item -ItemType Directory -Path $destinationDir -Force | Out-Null
            }
            
            # Copy file
            Copy-Item -Path $file.FullName -Destination $destinationFile -Force
            $copiedCount++
            
            if ($copiedCount % 100 -eq 0) {
                Write-Host "Copied $copiedCount files..." -ForegroundColor Cyan
            }
            
        } catch {
            Write-Warning "Failed to copy $($file.FullName): $($_.Exception.Message)"
            $errorCount++
        }
    }
    
    Write-Host ""
    Write-Host "--- Backup Summary ---" -ForegroundColor Yellow
    Write-Host "Files copied: $copiedCount"
    Write-Host "Errors: $errorCount"
    Write-Host "Backup location: $backupFolder"
    
    # Compress if requested
    if ($CompressBackup) {
        Write-Host ""
        Write-Host "Creating compressed archive..." -ForegroundColor Yellow
        $zipPath = "$backupFolder.zip"
        
        try {
            Add-Type -AssemblyName System.IO.Compression.FileSystem
            [System.IO.Compression.ZipFile]::CreateFromDirectory($backupFolder, $zipPath)
            
            # Remove uncompressed folder
            Remove-Item -Path $backupFolder -Recurse -Force
            
            $zipSize = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)
            Write-Host "Compressed backup created: $zipPath ($zipSize MB)" -ForegroundColor Green
        } catch {
            Write-Warning "Failed to create zip archive: $($_.Exception.Message)"
        }
    }
    
} catch {
    Write-Error "Backup failed: $($_.Exception.Message)"
}

Write-Host ""
Write-Host "=== Backup Complete ===" -ForegroundColor Green
