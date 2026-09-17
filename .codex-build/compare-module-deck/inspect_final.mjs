import { FileBlob, PresentationFile } from "@oai/artifact-tool";
const p = await PresentationFile.importPptx(await FileBlob.load("C:/Users/folli/OneDrive/Documentos/Repositories/ChasquiFly/FrontEnd/output/Modulo_compare_analisis_tecnico.pptx"));
console.log((await p.inspect({kind:"slide,textbox,image",search:"MECÁNICA|RESULTADO|CompareHeaderCards",maxChars:20000})).ndjson);
