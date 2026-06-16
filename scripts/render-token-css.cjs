const fs   = require('node:fs');
const path = require('node:path');
const ts   = require('typescript');

const ROOT      = path.resolve(__dirname, '..');
const OUT_DIR   = path.join(ROOT, 'src/app/tokens');

require.extensions['.ts'] = function renderTokenTs(module, filename) {
  const source = fs.readFileSync(filename, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: filename,
  });
  module._compile(outputText, filename);
};

const { generateFoundationCss, generateSemanticCss, generateComponentCss } =
  require('../src/lib/generateTokenCss.ts');

fs.mkdirSync(OUT_DIR, { recursive: true });

const layers = [
  { file: 'foundation.css', css: generateFoundationCss() },
  { file: 'semantic.css',   css: generateSemanticCss()   },
  { file: 'component.css',  css: generateComponentCss()  },
];

for (const { file, css } of layers) {
  const outPath = path.join(OUT_DIR, file);
  fs.writeFileSync(outPath, css);
  console.log(`Rendered token CSS: ${path.relative(ROOT, outPath)}`);
}
