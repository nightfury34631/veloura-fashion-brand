# GitHub Auto-Sync Script for Fashion Brand
# Automatically detects file changes, commits them, and pushes to GitHub.

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "   GitHub Auto-Sync is Active" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Watching for file changes in: $PSScriptRoot"
Write-Host "Press Ctrl+C at any time to stop auto-sync.`n"

# Verify remote configuration
$remote = git remote get-url origin 2>$null
if (-not $remote) {
    Write-Host "[ERROR] No GitHub remote repository configured yet!" -ForegroundColor Red
    Write-Host "Please set your GitHub URL first:" -ForegroundColor Yellow
    Write-Host "  git remote add origin https://github.com/<your-username>/<your-repo-name>.git" -ForegroundColor Yellow
    Write-Host "`nThen run this script again."
    pause
    exit 1
}

Write-Host "Connected remote: $remote" -ForegroundColor Green
Write-Host "Monitoring changes... (will auto-push whenever you save files)`n" -ForegroundColor Gray

while ($true) {
    Start-Sleep -Seconds 4
    
    # Check if there are any working tree changes
    $status = git status --porcelain
    if ($status) {
        # Debounce to allow multiple quick saves
        Start-Sleep -Seconds 2
        
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Write-Host "[$timestamp] Changes detected! Syncing with GitHub..." -ForegroundColor Yellow
        
        git add -A
        $commitResult = git commit -m "Auto-sync update: $timestamp" 2>&1
        
        $pushResult = git push origin main 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[$timestamp] Successfully pushed changes to GitHub!" -ForegroundColor Green
        } else {
            Write-Host "[$timestamp] Push encountered an issue: $pushResult" -ForegroundColor Red
        }
        Write-Host ""
    }
}
