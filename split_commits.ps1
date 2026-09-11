Set-Location -Path "C:\Users\E_$AM30\FrontEnd"

Write-Host "1. Retrocediendo el historial de commits (sin tocar el código)..."
git fetch origin
git reset origin/dev

Write-Host "2. Creando los 7 commits atomizados..."
git add src/types/flight.types.ts
git commit -m "feat(types): agregar interfaces de vuelos (US04)"

git add src/modules/flights/components/FlightSearchForm.tsx
git commit -m "feat(flights): crear formulario principal de busqueda (US04)"

git add src/modules/flights/components/SearchSummaryBar.tsx
git commit -m "feat(flights): crear barra de resumen de busqueda (US04)"

git add src/modules/flights/services/flight.service.mock.ts
git commit -m "feat(flights): implementar mock service para busqueda (US04)"

git add src/modules/home/pages/Home.tsx
git commit -m "feat(home): integrar consumo de mock en la vista home (US04)"

git add src/modules/flights/pages/SearchResultsPage.tsx
git commit -m "feat(flights): actualizar pagina de resultados (US04)"

git add package.json package-lock.json
git commit -m "chore: actualizar configuraciones y dependencias (US04)"

Write-Host "3. Forzando la actualizacion en GitHub..."
git push --force origin feature/US04-flight-search-form

Write-Host "¡Listo! El Pull Request ahora deberia mostrar tus 7 commits."
