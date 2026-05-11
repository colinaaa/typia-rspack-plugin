import { expect, test } from "@rstest/core";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { formatDiagnostic, transformTypia } from "../src/transform";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

test("returns source unchanged when it does not reference typia", () => {
  const source = "export const value = 1;\n";

  expect(transformTypia({
    cwd: root,
    id: resolve(root, "tests/fixtures/plain.ts"),
    source,
    tsconfig: "tsconfig.json",
  })).toBe(source);
});

test("transforms typia.is into executable runtime validation", async () => {
  const id = resolve(root, "tests/fixtures/typia-is.ts");
  const source = readFileSync(id, "utf8");
  const diagnostics: string[] = [];

  const code = transformTypia({
    cwd: root,
    id,
    onDiagnostic: (diagnostic) => diagnostics.push(formatDiagnostic(diagnostic)),
    source,
    tsconfig: "tsconfig.json",
  });

  expect(diagnostics).toEqual([]);
  expect(code).not.toContain("typia.is");
  expect(code).toContain("typeof input.name");
  expect(code).toContain("typeof input.age");

  const mod = await import(`data:text/javascript,${encodeURIComponent(code)}`);

  expect(mod.check({ age: 30, name: "Ada" })).toBe(true);
  expect(mod.check({ age: "30", name: "Ada" })).toBe(false);
  expect(mod.check(null)).toBe(false);
});

test("reports a Typia diagnostic when strict mode is disabled", () => {
  const id = resolve(root, "tests/fixtures/typia-is.ts");
  const source = readFileSync(id, "utf8");
  const diagnostics: string[] = [];

  const code = transformTypia({
    cwd: root,
    id,
    onDiagnostic: (diagnostic) => diagnostics.push(formatDiagnostic(diagnostic)),
    source,
    tsconfig: "tests/fixtures/tsconfig-loose.json",
  });

  expect(diagnostics).toEqual(["strict mode is required."]);
  expect(code).not.toContain("typia.is");
});

test("reports a Typia diagnostic when createIs misses its generic argument", () => {
  const id = resolve(root, "tests/fixtures/typia-create-is-missing-generic.ts");
  const source = readFileSync(id, "utf8");
  const diagnostics: string[] = [];

  const code = transformTypia({
    cwd: root,
    id,
    onDiagnostic: (diagnostic) => diagnostics.push(formatDiagnostic(diagnostic)),
    source,
    tsconfig: "tsconfig.json",
  });

  expect(diagnostics).toHaveLength(1);
  expect(diagnostics[0]).toContain("generic argument is not specified.");
  expect(code).toContain("typia.createIs()");
});

test("throws a readable error when tsconfig cannot be read", () => {
  const cwd = mkdtempSync(join(tmpdir(), "typia-rspack-transform-"));
  const id = resolve(cwd, "input.ts");

  writeFileSync(id, "import typia from \"typia\";\nexport const check = typia.createIs();\n");

  try {
    let thrown: unknown;

    try {
      transformTypia({
        cwd,
        id,
        source: readFileSync(id, "utf8"),
        tsconfig: "missing-tsconfig.json",
      });
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(Error);
    expect((thrown as Error).message).toContain("Unable to read tsconfig file:");
    expect((thrown as Error).message).toContain("missing-tsconfig.json");
  } finally {
    rmSync(cwd, { force: true, recursive: true });
  }
});

test("formats diagnostics with message fallback when line lookup fails", () => {
  const diagnostic: ts.Diagnostic = {
    category: ts.DiagnosticCategory.Error,
    code: 1005,
    file: {
      fileName: "C:/tmp/tsconfig.json",
      getLineAndCharacterOfPosition() {
        throw new Error("path separator mismatch");
      },
    } as unknown as ts.SourceFile,
    length: 0,
    messageText: "'}' expected.",
    start: 0,
  };

  expect(formatDiagnostic(diagnostic)).toBe("'}' expected.");
});
