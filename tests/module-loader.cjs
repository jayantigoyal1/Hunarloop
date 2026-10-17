const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

function loader() {
  const cache = new Map();
  return function load(file) {
    const fullPath = path.resolve(__dirname, "..", file);
    if (cache.has(fullPath)) return cache.get(fullPath).exports;
    const module = { exports: {} };
    cache.set(fullPath, module);
    const code = ts.transpileModule(fs.readFileSync(fullPath, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
    const localRequire = (name) => name.startsWith("@/") ? load(`src/${name.slice(2)}.ts`) : require(name);
    new Function("require", "module", "exports", code)(localRequire, module, module.exports);
    return module.exports;
  };
}

function memoryStorage() {
  const items = new Map();
  return { getItem: (key) => items.get(key) ?? null, setItem: (key, value) => items.set(key, value), removeItem: (key) => items.delete(key) };
}

module.exports = { loader, memoryStorage };
