Set-Location -Path "C:\Users\E_$AM30\FrontEnd"

# Resolver conflictos manteniendo nuestros archivos (Deleted by us -> agregarlos)
git add src/types/flight.types.ts
git commit -m "feat(types): agregar interfaces de vuelos (US04)"

git add src/modules/flights/components/FlightSearchForm.tsx
git commit -m "feat(flights): crear formulario principal de busqueda (US04)"

git add src/modules/flights/components/SearchSummaryBar.tsx
git commit -m "feat(flights): crear barra de resumen de busqueda (US04)"

git add src/modules/flights/services/
git commit -m "feat(flights): implementar mock service para busqueda (US04)"

git add src/modules/home/pages/Home.tsx
git commit -m "feat(home): integrar consumo de mock en la vista home (US04)"

git add src/modules/flights/pages/SearchResultsPage.tsx
git commit -m "feat(flights): actualizar pagina de resultados (US04)"

git add package.json pnpm-lock.yaml pnpm-workspace.yaml
git commit -m "chore: actualizar configuraciones y dependencias (US04)"

# Subir a Github
git push origin feature/US04-flight-search-form
