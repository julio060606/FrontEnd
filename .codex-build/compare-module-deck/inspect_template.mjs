import { FileBlob, PresentationFile } from "@oai/artifact-tool";

const source = "C:/Users/folli/.codex/plugins/cache/openai-curated-remote/openai-templates/0.1.1/skills/artifact-template-simple-light-mode/assets/reference.pptx";
const presentation = await PresentationFile.importPptx(await FileBlob.load(source));
console.log(`slides=${presentation.slides.items.length}`);
console.log(`size=${JSON.stringify(presentation.slideSize)}`);
console.log(`masters=${presentation.masters.items.length}`);
console.log((await presentation.inspect({
  kind: "slide,textbox,shape,image,layout,notes",
  maxChars: 30000,
})).ndjson);
