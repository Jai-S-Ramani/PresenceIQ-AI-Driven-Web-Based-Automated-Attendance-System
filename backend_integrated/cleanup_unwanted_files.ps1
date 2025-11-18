# Cleanup Unwanted Files from Backend
# This script removes temporary files, cache, and utility scripts

Write-Host "Starting cleanup of unwanted files..." -ForegroundColor Green

$rootPath = $PSScriptRoot

# 1. Remove Python cache files and directories
Write-Host "`n[1/5] Removing Python cache files (__pycache__, .pyc, .pyo)..." -ForegroundColor Yellow
$pycacheCount = 0
Get-ChildItem -Path $rootPath -Recurse -Force -Directory -Filter "__pycache__" -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "  Removing: $($_.FullName)" -ForegroundColor DarkGray
    Remove-Item -Path $_.FullName -Recurse -Force -ErrorAction SilentlyContinue
    $pycacheCount++
}
Write-Host "  Removed $pycacheCount __pycache__ directories" -ForegroundColor Green

$pycCount = 0
Get-ChildItem -Path $rootPath -Recurse -Force -File -Include "*.pyc", "*.pyo" -ErrorAction SilentlyContinue | ForEach-Object {
    Remove-Item -Path $_.FullName -Force -ErrorAction SilentlyContinue
    $pycCount++
}
Write-Host "  Removed $pycCount .pyc/.pyo files" -ForegroundColor Green

# 2. Remove database utility scripts (temporary scripts used during setup/debugging)
Write-Host "`n[2/5] Removing database utility scripts..." -ForegroundColor Yellow
$utilityScripts = @(
    "check_db.py",
    "check_django_db.py",
    "check_fk_indexes.py",
    "clear_migrations.py",
    "drop_old_tables.py",
    "drop_sparse_indexes.py",
    "fix_foreign_keys.py",
    "fix_unique_index.py",
    "reset_database.py"
)

$scriptCount = 0
foreach ($script in $utilityScripts) {
    $scriptPath = Join-Path $rootPath $script
    if (Test-Path $scriptPath) {
        Write-Host "  Removing: $script" -ForegroundColor DarkGray
        Remove-Item -Path $scriptPath -Force -ErrorAction SilentlyContinue
        $scriptCount++
    }
}
Write-Host "  Removed $scriptCount utility scripts" -ForegroundColor Green

# 3. Remove log files
Write-Host "`n[3/5] Removing log files..." -ForegroundColor Yellow
$logCount = 0
if (Test-Path (Join-Path $rootPath "logs")) {
    Get-ChildItem -Path (Join-Path $rootPath "logs") -Recurse -Force -File -Include "*.log" -ErrorAction SilentlyContinue | ForEach-Object {
        Write-Host "  Removing: $($_.Name)" -ForegroundColor DarkGray
        Remove-Item -Path $_.FullName -Force -ErrorAction SilentlyContinue
        $logCount++
    }
}
Write-Host "  Removed $logCount log files" -ForegroundColor Green

# 4. Remove pytest cache
Write-Host "`n[4/5] Removing pytest cache..." -ForegroundColor Yellow
$pytestCount = 0
Get-ChildItem -Path $rootPath -Recurse -Force -Directory -Filter ".pytest_cache" -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "  Removing: $($_.FullName)" -ForegroundColor DarkGray
    Remove-Item -Path $_.FullName -Recurse -Force -ErrorAction SilentlyContinue
    $pytestCount++
}
Write-Host "  Removed $pytestCount pytest cache directories" -ForegroundColor Green

# 5. Remove coverage files
Write-Host "`n[5/5] Removing coverage files..." -ForegroundColor Yellow
$coverageCount = 0
Get-ChildItem -Path $rootPath -Recurse -Force -File -Include ".coverage", ".coverage.*" -ErrorAction SilentlyContinue | ForEach-Object {
    Remove-Item -Path $_.FullName -Force -ErrorAction SilentlyContinue
    $coverageCount++
}
Get-ChildItem -Path $rootPath -Recurse -Force -Directory -Filter "htmlcov" -ErrorAction SilentlyContinue | ForEach-Object {
    Remove-Item -Path $_.FullName -Recurse -Force -ErrorAction SilentlyContinue
    $coverageCount++
}
Write-Host "  Removed $coverageCount coverage files/directories" -ForegroundColor Green

# Summary
Write-Host "`n" + "="*60 -ForegroundColor Cyan
Write-Host "Cleanup Summary:" -ForegroundColor Green
Write-Host "  - Python cache: $pycacheCount directories + $pycCount files" -ForegroundColor White
Write-Host "  - Utility scripts: $scriptCount files" -ForegroundColor White
Write-Host "  - Log files: $logCount files" -ForegroundColor White
Write-Host "  - Pytest cache: $pytestCount directories" -ForegroundColor White
Write-Host "  - Coverage files: $coverageCount items" -ForegroundColor White
Write-Host "="*60 -ForegroundColor Cyan
Write-Host "`nCleanup completed successfully!" -ForegroundColor Green
