import type { Compiler } from "@rspack/core";
import { fileURLToPath } from "node:url";
import { DEFAULT_EXCLUDE, DEFAULT_INCLUDE, type LoaderOptions, type Options } from "./options.js";

class TypiaRspackPlugin {
  #options: Options;

  constructor(options: Options = {}) {
    this.#options = options;
  }

  apply(compiler: Compiler): void {
    const options = this.#options;
    const loaderOptions: LoaderOptions = {
      tsconfig: options.tsconfig,
      typia: options.typia,
    };

    compiler.options.module.rules.push({
      enforce: options.enforce ?? "pre",
      exclude: options.exclude ?? DEFAULT_EXCLUDE,
      loader: fileURLToPath(new URL("./loader.js", import.meta.url)),
      options: loaderOptions,
      test: options.include ?? DEFAULT_INCLUDE,
    });
  }
}

export type { Options };
export { TypiaRspackPlugin };
export default TypiaRspackPlugin;
