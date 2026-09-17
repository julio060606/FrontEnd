import { FileBlob, PresentationFile } from "@oai/artifact-tool";
const source = "C:/Users/folli/.codex/plugins/cache/openai-curated-remote/openai-templates/0.1.1/skills/artifact-template-simple-light-mode/assets/reference.pptx";
const p = await PresentationFile.importPptx(await FileBlob.load(source));
console.log(await p.help("delete remove slide collection", { maxChars: 12000 }));
console.log("slide keys", Object.getOwnPropertyNames(Object.getPrototypeOf(p.slides)));
console.log("item keys", Object.getOwnPropertyNames(Object.getPrototypeOf(p.slides.items[0])));
