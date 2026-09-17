import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const workspace = "C:/Users/folli/OneDrive/Documentos/Repositories/ChasquiFly/FrontEnd";
const outputDir = path.join(workspace, ".codex-build/compare-module-deck/code-captures");
await fs.mkdir(outputDir, { recursive: true });

const snippets = [
  { id: "page-state", file: "src/modules/compare/pages/CompareFlightsPage.tsx", start: 58, end: 76, focus: [59, 60, 61, 66, 74] },
  { id: "page-compose", file: "src/modules/compare/pages/CompareFlightsPage.tsx", start: 360, end: 378, focus: [361, 364, 370, 376, 378] },
  { id: "priority-options", file: "src/modules/compare/components/ComparisonPrioritySelector.tsx", start: 18, end: 44, focus: [20, 25, 30, 35, 42, 43] },
  { id: "priority-ui", file: "src/modules/compare/components/ComparisonPrioritySelector.tsx", start: 106, end: 121, focus: [106, 109, 110, 116, 117, 118] },
  { id: "header-state", file: "src/modules/compare/components/CompareHeaderCards.tsx", start: 54, end: 71, focus: [55, 56, 61, 67, 68] },
  { id: "header-choice", file: "src/modules/compare/components/CompareHeaderCards.tsx", start: 202, end: 227, focus: [202, 205, 212, 215, 217, 226] },
  { id: "spec-icon", file: "src/modules/compare/components/CompareSpecsTable.tsx", start: 21, end: 42, focus: [21, 22, 28, 33, 37] },
  { id: "spec-map", file: "src/modules/compare/components/CompareSpecsTable.tsx", start: 139, end: 156, focus: [141, 145, 147, 150, 155] },
  { id: "banner-action", file: "src/modules/compare/components/AIRecommendationBanner.tsx", start: 95, end: 113, focus: [95, 97, 100, 101, 109] },
  { id: "banner-score", file: "src/modules/compare/components/AIRecommendationBanner.tsx", start: 129, end: 148, focus: [129, 136, 142, 145, 147, 148] },
  { id: "service-weights", file: "src/services/compareService.ts", start: 43, end: 60, focus: [43, 44, 45, 53, 54] },
  { id: "service-score", file: "src/services/compareService.ts", start: 368, end: 397, focus: [368, 372, 378, 385, 391, 394] },
];

const escapeHtml = (value) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const browser = await chromium.launch({ headless: true });
for (const snippet of snippets) {
  const sourcePath = path.join(workspace, snippet.file);
  const lines = (await fs.readFile(sourcePath, "utf8")).replaceAll("\r\n", "\n").split("\n");
  const rows = [];
  for (let number = snippet.start; number <= snippet.end; number += 1) {
    const code = lines[number - 1] ?? "";
    rows.push(`<div class="line${snippet.focus.includes(number) ? " focus" : ""}"><span class="number">${number}</span><span class="code">${escapeHtml(code)}</span></div>`);
  }
  const contentHeight = 72 + rows.length * 22 + 26;
  const page = await browser.newPage({
    viewport: { width: 1040, height: contentHeight },
    deviceScaleFactor: 2,
  });
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
    *{box-sizing:border-box} html,body{margin:0;background:#eef2f7;font-family:"Cascadia Mono","Consolas",monospace}
    .window{margin:18px;border-radius:15px;overflow:hidden;background:#0f172a;box-shadow:0 14px 34px rgba(15,23,42,.22);border:1px solid #263349}
    .bar{height:54px;display:flex;align-items:center;gap:14px;padding:0 20px;background:#182237;border-bottom:1px solid #2a3850;color:#cbd5e1;font-size:14px}
    .dots{display:flex;gap:7px}.dot{width:11px;height:11px;border-radius:50%}.red{background:#fb7185}.yellow{background:#fbbf24}.green{background:#34d399}
    .path{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.lang{margin-left:auto;color:#7dd3fc;font-weight:700}
    .codebox{padding:13px 0 16px}.line{height:22px;display:flex;align-items:center;color:#dbeafe;font-size:14px;line-height:22px;white-space:pre}
    .line.focus{background:linear-gradient(90deg,rgba(14,165,233,.20),rgba(14,165,233,.05));border-left:4px solid #38bdf8}
    .number{width:62px;padding-right:15px;text-align:right;color:#64748b;user-select:none;flex:none}.focus .number{width:58px;color:#7dd3fc}
    .code{padding-left:15px}.focus .code{color:#f8fafc}
  </style></head><body><div class="window"><div class="bar"><div class="dots"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span></div><span class="path">${escapeHtml(snippet.file)} · líneas ${snippet.start}-${snippet.end}</span><span class="lang">TSX</span></div><div class="codebox">${rows.join("")}</div></div></body></html>`);
  await page.screenshot({ path: path.join(outputDir, `${snippet.id}.png`), fullPage: true });
  await page.close();
}
await browser.close();
console.log(`Generated ${snippets.length} code captures in ${outputDir}`);
