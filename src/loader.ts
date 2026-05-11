import process from "node:process";
import type { LoaderOptions } from "./options.js";
import { formatDiagnostic, transformTypia } from "./transform.js";

type LoaderContext = {
  async?: () => (error: Error | null, code?: string) => void;
  context?: string;
  emitWarning?: (warning: Error) => void;
  getOptions?: () => LoaderOptions;
  resourcePath: string;
  rootContext?: string;
};

export default function typiaRspackLoader(
  this: LoaderContext,
  source: string | Buffer,
): void {
  const callback = this.async?.();

  if (callback == null) {
    throw new Error("typia-rspack-plugin loader requires an async loader context.");
  }

  const options = this.getOptions?.() ?? {};
  const sourceText = Buffer.isBuffer(source) ? source.toString("utf8") : source;

  try {
    const code = transformTypia({
      ...options,
      cwd: this.rootContext ?? this.context ?? process.cwd(),
      id: this.resourcePath,
      onDiagnostic: (diagnostic) => {
        this.emitWarning?.(new Error(formatDiagnostic(diagnostic)));
      },
      source: sourceText,
    });

    callback(null, code);
  } catch (error) {
    callback(error instanceof Error ? error : new Error(String(error)));
  }
}
