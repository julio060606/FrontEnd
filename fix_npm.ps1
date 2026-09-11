Set-Location -Path "C:\Users\E_$AM30\FrontEnd"

Write-Host "1. Eliminando archivos de PNPM..."
Remove-Item -Path "pnpm-lock.yaml" -ErrorAction SilentlyContinue
Remove-Item -Path "pnpm-workspace.yaml" -ErrorAction SilentlyContinue
git rm pnpm-lock.yaml pnpm-workspace.yaml --ignore-unmatch

Write-Host "2. Instalando dependencias con NPM (esto puede tardar unos segundos)..."
npm install

Write-Host "3. Guardando los cambios en Git..."
git add package.json package-lock.json
git commit -m "chore: cambiar gestor de paquetes de pnpm a npm para evitar conflictos con dev"

Write-Host "4. Subiendo los cambios a GitHub..."
git push origin feature/US04-flight-search-form

Write-Host "¡Todo listo! PNPM ha sido eliminado y NPM está configurado."
