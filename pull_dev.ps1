Set-Location -Path "C:\Users\E_$AM30\FrontEnd"

Write-Host "Obteniendo los últimos cambios de origin/dev..."
git fetch origin

Write-Host "Intentando mezclar dev en tu rama actual..."
git pull origin dev
