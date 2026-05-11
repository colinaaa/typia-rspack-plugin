import { dirname, resolve } from "node:path";
import process from "node:process";
import ts from "typescript";
import { transform as typiaTransform } from "typia/lib/transform";
import type { LoaderOptions } from "./options.js";

type TransformOptions = LoaderOptions & {
  cwd?: string;
  id: string;
  onDiagnostic?: (diagnostic: ts.Diagnostic) => void;
  source: string;
};

const compilerOptionsCache = new Map<string, ts.CompilerOptions>();
const printer = ts.createPrinter();

export function formatDiagnostic(diagnostic: ts.Diagnostic): string {
  const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");

  if (diagnostic.file == null || diagnostic.start == null) {
    return message;
  }

  let position: ts.LineAndCharacter;

  try {
    position = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
  } catch {
    return message;
  }

  return `${diagnostic.file.fileName}:${position.line + 1}:${position.character + 1} - ${message}`;
}

export function transformTypia(options: TransformOptions): string {
  const source = options.source;

  if (!source.includes("typia")) {
    return source;
  }

  const id = resolve(options.id);
  const compilerOptions = getCompilerOptions(options);
  const sourceFile = ts.createSourceFile(
    id,
    source,
    compilerOptions.target ?? ts.ScriptTarget.ES2020,
    true,
  );
  const host = createCompilerHost(id, source, sourceFile, compilerOptions);
  const program = ts.createProgram([id], compilerOptions, host);
  const diagnostics: ts.Diagnostic[] = [];
  const transformer = typiaTransform(program, options.typia, {
    addDiagnostic(diagnostic) {
      options.onDiagnostic?.(diagnostic);
      return diagnostics.push(diagnostic);
    },
  });
  const result = ts.transform(
    sourceFile,
    [transformer],
    {
      ...compilerOptions,
      inlineSources: true,
      sourceMap: true,
    },
  );

  try {
    return transpileTypeScript(
      printer.printFile(result.transformed[0] ?? sourceFile),
      id,
      compilerOptions,
    );
  } finally {
    result.dispose();
  }
}

function transpileTypeScript(
  source: string,
  fileName: string,
  compilerOptions: ts.CompilerOptions,
): string {
  return ts.transpileModule(source, {
    compilerOptions: {
      ...compilerOptions,
      declaration: false,
      declarationMap: false,
      inlineSources: false,
      module: ts.ModuleKind.ESNext,
      noEmit: false,
      sourceMap: false,
    },
    fileName,
  }).outputText;
}

function getCompilerOptions(options: TransformOptions): ts.CompilerOptions {
  const cwd = options.cwd ?? process.cwd();
  const tsconfigPath = options.tsconfig == null
    ? ts.findConfigFile(cwd, ts.sys.fileExists, "tsconfig.json")
    : resolve(cwd, options.tsconfig);

  if (tsconfigPath == null) {
    return {
      module: ts.ModuleKind.ESNext,
      strict: true,
      target: ts.ScriptTarget.ES2020,
    };
  }

  const cached = compilerOptionsCache.get(tsconfigPath);

  if (cached != null) {
    return cached;
  }

  const config = ts.readConfigFile(tsconfigPath, ts.sys.readFile);

  if (config.error != null) {
    throw new Error(formatDiagnostic(config.error));
  }

  const parsed = ts.parseJsonConfigFileContent(
    config.config,
    ts.sys,
    dirname(tsconfigPath),
  );

  if (parsed.errors.length > 0) {
    throw new Error(parsed.errors.map(formatDiagnostic).join("\n"));
  }

  compilerOptionsCache.set(tsconfigPath, parsed.options);

  return parsed.options;
}

function createCompilerHost(
  id: string,
  source: string,
  sourceFile: ts.SourceFile,
  compilerOptions: ts.CompilerOptions,
): ts.CompilerHost {
  const host = ts.createCompilerHost(compilerOptions);
  const getSourceFile = host.getSourceFile.bind(host);

  host.fileExists = (fileName) => resolve(fileName) === id || ts.sys.fileExists(fileName);
  host.readFile = (fileName) => resolve(fileName) === id ? source : ts.sys.readFile(fileName);
  host.getSourceFile = (fileName, languageVersion, onError, shouldCreateNewSourceFile) => {
    if (resolve(fileName) === id) {
      return sourceFile;
    }

    return getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile);
  };

  return host;
}
