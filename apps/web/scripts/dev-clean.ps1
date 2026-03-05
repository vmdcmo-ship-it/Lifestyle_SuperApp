# Chay lai dev server tu dau - fix loi middleware-manifest.json
# Dung: .\scripts\dev-clean.ps1

Write-Host "Dang dong process Next.js tren port 3000, 3001, 3002..." -ForegroundColor Yellow
Get-NetTCPConnection -LocalPort 3000,3001,3002 -ErrorAction SilentlyContinue | ForEach-Object {
    Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
}
Start-Sleep -Seconds 2

Write-Host "Xoa thu muc .next..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

Write-Host "Khoi dong dev server..." -ForegroundColor Green
npm run dev
