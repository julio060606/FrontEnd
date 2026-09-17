import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { FileBlob, PresentationFile } from "@oai/artifact-tool";

const workspaceDir = "C:/Users/folli/OneDrive/Documentos/Repositories/ChasquiFly/FrontEnd";
const SKILL_DIR = "C:/Users/folli/.codex/plugins/cache/openai-primary-runtime/presentations/26.905.11957/skills/presentations";
const templatePath = "C:/Users/folli/.codex/plugins/cache/openai-curated-remote/openai-templates/0.1.1/skills/artifact-template-simple-light-mode/assets/reference.pptx";
const buildDir = path.join(workspaceDir, ".codex-build/compare-module-deck");
const capturesDir = path.join(buildDir, "code-captures");
const finalPath = path.join(workspaceDir, "output/Modulo_compare_analisis_tecnico.pptx");
const family = "Arial";

const { finalizePresentation } = await import(pathToFileURL(
  path.join(SKILL_DIR, "container_tools/artifact_tool_utils.mjs"),
).href);

const presentation = await PresentationFile.importPptx(await FileBlob.load(templatePath));

// Retain the source theme, master and first slide. Remove unused template examples.
for (let index = presentation.slides.items.length - 1; index >= 1; index -= 1) {
  presentation.slides.items[index].delete();
}

const COLORS = {
  ink: "#111827",
  body: "#374151",
  muted: "#6B7280",
  rule: "#D1D5DB",
  accent: "#0EA5E9",
  accentSoft: "#E0F2FE",
  white: "#FFFFFF",
};

const addText = (slide, text, position, options = {}) => {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position,
    fill: "none",
    line: { fill: "none", width: 0 },
  });
  shape.text = text;
  shape.text.style = {
    typeface: family,
    fontSize: options.fontSize ?? 20,
    bold: options.bold ?? false,
    color: options.color ?? COLORS.body,
    autoFit: options.autoFit ?? "shrinkText",
    verticalAlignment: options.verticalAlignment ?? "top",
    alignment: options.alignment ?? "left",
  };
  return shape;
};

const addLine = (slide, left, top, width, color = COLORS.rule, weight = 1) => {
  slide.shapes.add({
    geometry: "line",
    position: { left, top, width, height: 0 },
    fill: "none",
    line: { style: "solid", fill: color, width: weight },
  });
};

const addImage = async (slide, fileName, position, alt) => {
  const blob = await fs.readFile(path.join(capturesDir, fileName));
  slide.images.add({
    blob,
    contentType: "image/png",
    alt,
    fit: "contain",
    position,
  });
};

const addExplanation = (slide, x, mechanism, result) => {
  addText(slide, "MECÁNICA", { left: x, top: 456, width: 580, height: 22 }, {
    fontSize: 15, bold: true, color: COLORS.accent,
  });
  addText(slide, mechanism, { left: x, top: 478, width: 580, height: 62 }, {
    fontSize: 18, color: COLORS.body,
  });
  addText(slide, "RESULTADO", { left: x, top: 548, width: 580, height: 22 }, {
    fontSize: 15, bold: true, color: COLORS.accent,
  });
  addText(slide, result, { left: x, top: 570, width: 580, height: 65 }, {
    fontSize: 18, color: COLORS.body,
  });
};

const addFooter = (slide, slideNumber) => {
  addText(slide, "ChasquiFly · módulo compare", { left: 40, top: 678, width: 360, height: 18 }, {
    fontSize: 12, color: COLORS.muted,
  });
  addText(slide, String(slideNumber).padStart(2, "0"), { left: 1190, top: 678, width: 50, height: 18 }, {
    fontSize: 12, color: COLORS.muted, alignment: "right",
  });
};

const first = presentation.slides.items[0];
first.shapes.deleteAll();
first.background.fill = COLORS.white;
addText(first, "CHASQUIFLY · US06", { left: 42, top: 48, width: 420, height: 28 }, {
  fontSize: 17, color: COLORS.muted,
});
addText(first, "Módulo compare", { left: 42, top: 195, width: 1030, height: 82 }, {
  fontSize: 58, bold: false, color: "#000000", autoFit: "none",
});
addText(first, "Lectura técnica de componentes, estado, reglas de comparación y recomendación", {
  left: 42, top: 306, width: 900, height: 72,
}, { fontSize: 24, color: COLORS.body });
addLine(first, 42, 426, 1160, COLORS.rule, 1);
addText(first, "React · TypeScript · Material UI", { left: 42, top: 457, width: 520, height: 30 }, {
  fontSize: 18, color: COLORS.muted,
});
addText(first, "2 fragmentos clave por clase", { left: 850, top: 457, width: 352, height: 30 }, {
  fontSize: 18, color: COLORS.accent, alignment: "right",
});
first.speakerNotes.textFrame.setText(
  "Fuente: código del repositorio ChasquiFly FrontEnd, rama feature/US06-compare-flights, commit baa333f.",
);

const slides = [
  {
    title: "CompareFlightsPage",
    path: "src/modules/compare/pages/CompareFlightsPage.tsx",
    left: {
      label: "01 · Estado reconstruido desde la URL",
      image: "page-state.png",
      mechanism: "Lee flightA, flightB, selected y priority con useSearchParams. Valida que los identificadores existan y sean distintos antes de cargar datos.",
      result: "La comparación se puede compartir o recargar sin perder el contexto y sin depender de un almacén global.",
    },
    right: {
      label: "02 · Orquestación de componentes",
      image: "page-compose.png",
      mechanism: "Entrega el mismo estado a las tarjetas, la tabla y el banner. Los callbacks del contenedor controlan prioridad y elección.",
      result: "Mantiene una sola fuente de verdad y sincroniza todas las vistas del comparador.",
    },
    notes: "Capturas: CompareFlightsPage.tsx líneas 58-76 y 360-378.",
  },
  {
    title: "ComparisonPrioritySelector",
    path: "src/modules/compare/components/ComparisonPrioritySelector.tsx",
    left: {
      label: "01 · Perfiles tipados",
      image: "priority-options.png",
      mechanism: "PRIORITY_OPTIONS define cuatro criterios y cada value usa el tipo ComparisonPriority. Las props reciben el valor y un callback tipado.",
      result: "Evita prioridades inválidas y centraliza el texto que ve el usuario.",
    },
    right: {
      label: "02 · Selección exclusiva y responsive",
      image: "priority-ui.png",
      mechanism: "Mapea las opciones a ToggleButton y usa un grupo exclusive. El estado seleccionado cambia color y conserva etiquetas ARIA.",
      result: "El usuario activa un solo perfil y la interfaz funciona en móvil y escritorio.",
    },
    notes: "Capturas: ComparisonPrioritySelector.tsx líneas 18-44 y 106-121.",
  },
  {
    title: "CompareHeaderCards",
    path: "src/modules/compare/components/CompareHeaderCards.tsx",
    left: {
      label: "01 · Estado visual derivado",
      image: "header-state.png",
      mechanism: "Compara cada id con recommendedFlightId y selectedFlightId. Esos booleanos controlan ARIA, borde, color y sombra.",
      result: "La tarjeta comunica recomendación y elección tanto visualmente como a lectores de pantalla.",
    },
    right: {
      label: "02 · Precio y acción de elección",
      image: "header-choice.png",
      mechanism: "Muestra el distintivo MÁS BARATO y convierte el botón en un control con aria-pressed. El click devuelve el vuelo al contenedor.",
      result: "El usuario identifica el menor precio y confirma una alternativa sin mezclar lógica de negocio en la tarjeta.",
    },
    notes: "Capturas: CompareHeaderCards.tsx líneas 54-71 y 202-227.",
  },
  {
    title: "CompareSpecsTable",
    path: "src/modules/compare/components/CompareSpecsTable.tsx",
    left: {
      label: "01 · Iconografía semántica",
      image: "spec-icon.png",
      mechanism: "renderIcon traduce flags de dominio en iconos de éxito o ausencia. La función evita repetir SVG y estilos por cada celda.",
      result: "La tabla mantiene un lenguaje visual consistente para beneficios y restricciones.",
    },
    right: {
      label: "02 · Filas generadas desde datos",
      image: "spec-map.png",
      mechanism: "Cada CompareSpecItem aporta texto, resaltado y estado negativo. El render ajusta color y peso sin conocer el factor concreto.",
      result: "Los diez factores se muestran con el mismo componente y admiten nuevos criterios sin duplicar estructura.",
    },
    notes: "Capturas: CompareSpecsTable.tsx líneas 21-42 y 139-156.",
  },
  {
    title: "AIRecommendationBanner",
    path: "src/modules/compare/components/AIRecommendationBanner.tsx",
    left: {
      label: "01 · Acción sobre la recomendación",
      image: "banner-action.png",
      mechanism: "El botón cambia variante y texto según isRecommendedFlightSelected. onSelectRecommended delega la decisión a la página.",
      result: "Permite elegir la sugerencia directamente y confirma el estado sin ejecutar una reserva.",
    },
    right: {
      label: "02 · Puntuaciones comparables",
      image: "banner-score.png",
      mechanism: "Recorre vuelo recomendado y alternativa, muestra score/100 y alimenta LinearProgress con el mismo valor.",
      result: "Convierte el cálculo del servicio en evidencia visual que explica la diferencia entre ambas opciones.",
    },
    notes: "Capturas: AIRecommendationBanner.tsx líneas 95-113 y 129-148.",
  },
  {
    title: "compareService",
    path: "src/services/compareService.ts",
    left: {
      label: "01 · Pesos por prioridad",
      image: "service-weights.png",
      mechanism: "PRIORITY_WEIGHTS asigna porcentajes a precio, duración, escalas, equipaje, comodidad, flexibilidad y puntualidad.",
      result: "La misma pareja de vuelos puede producir otra recomendación cuando cambia la prioridad del usuario.",
    },
    right: {
      label: "02 · Cálculo determinista del ganador",
      image: "service-score.png",
      mechanism: "Compara cada métrica según higherIsBetter, acumula pesos, divide empates y ordena las razones con mayor impacto.",
      result: "Entrega un ganador reproducible, puntuaciones complementarias sobre 100 y motivos verificables.",
    },
    notes: "Capturas: compareService.ts líneas 43-60 y 368-397. El servicio también valida ruta, fecha, moneda y cabina antes de construir la comparación.",
  },
];

let slideNumber = 2;
for (const item of slides) {
  const slide = presentation.slides.add({ layoutId: "/ppt/slideLayouts/slideLayout8.xml" });
  slide.background.fill = COLORS.white;
  addText(slide, item.title, { left: 40, top: 30, width: 780, height: 48 }, {
    fontSize: 36, color: "#000000", autoFit: "none",
  });
  addText(slide, item.path, { left: 40, top: 80, width: 940, height: 24 }, {
    fontSize: 15, color: COLORS.muted,
  });
  addLine(slide, 40, 112, 1200, COLORS.rule, 1);

  addText(slide, item.left.label, { left: 40, top: 122, width: 580, height: 24 }, {
    fontSize: 17, bold: true, color: COLORS.ink,
  });
  addText(slide, item.right.label, { left: 660, top: 122, width: 580, height: 24 }, {
    fontSize: 17, bold: true, color: COLORS.ink,
  });
  await addImage(slide, item.left.image, { left: 40, top: 148, width: 580, height: 296 }, `${item.title}, primer fragmento clave`);
  await addImage(slide, item.right.image, { left: 660, top: 148, width: 580, height: 296 }, `${item.title}, segundo fragmento clave`);
  addExplanation(slide, 40, item.left.mechanism, item.left.result);
  addExplanation(slide, 660, item.right.mechanism, item.right.result);
  addFooter(slide, slideNumber);
  slide.speakerNotes.textFrame.setText(
    `${item.notes}\nFuente: código del repositorio ChasquiFly FrontEnd, commit baa333f.`,
  );
  slideNumber += 1;
}

const stagingDir = path.join(workspaceDir, ".codex-finalizer");
await fs.mkdir(stagingDir, { recursive: true });
await fs.mkdir(path.dirname(finalPath), { recursive: true });
const candidatePath = path.join(stagingDir, "compare-module-candidate.pptx");
await (await PresentationFile.exportPptx(presentation)).save(candidatePath);

const result = await finalizePresentation({
  explicitTotalSlideCount: 7,
  requiredNativeTableOwnerSlides: [],
  requiredNativeChartOwnerSlides: [],
  workspaceDir,
  candidatePath,
  finalPath,
  pythonExecutable: "C:/Users/folli/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe",
  integrityValidatorPath: path.join(SKILL_DIR, "container_tools/inspect_presentation_package_integrity.py"),
  layoutValidatorPath: path.join(SKILL_DIR, "container_tools/inspect_presentation_layout_geometry.py"),
  layoutArgs: [
    "--expected-slide-size-emu", "12192000,6858000",
    "--validate-bullet-geometry",
    "--validate-heading-fit",
  ],
  requiredNativeTableOwnerSlides: [],
  fontPolicy: { basis: "design", families: [family] },
  verifyArtifactToolImport: true,
  receiptPath: path.join(stagingDir, "Modulo_compare_analisis_tecnico.validation.json"),
});

console.log(JSON.stringify({ finalPath, result }, null, 2));
