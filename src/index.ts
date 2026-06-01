import type { Compiler } from "@rspack/core";
import { resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { DEFAULT_EXCLUDE, DEFAULT_INCLUDE, type LoaderOptions, type Options, type RuleCondition } from "./options.js";

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

    const context = compiler.context ?? process.cwd();

    compiler.options.module.rules.push({
      enforce: options.enforce ?? "pre",
      exclude: resolveCondition(options.exclude ?? DEFAULT_EXCLUDE, context),
      loader: fileURLToPath(new URL("./loader.js", import.meta.url)),
      options: loaderOptions,
      test: resolveCondition(options.include ?? DEFAULT_INCLUDE, context),
    });
  }
}

function resolveCondition(condition: RuleCondition, context: string): RuleCondition {
  if (typeof condition === "string") {
    return resolve(context, condition);
  }

  if (Array.isArray(condition)) {
    return condition.map((c) => resolveCondition(c, context));
  }

  return condition;
}

export type { Options };
export { TypiaRspackPlugin };
export default TypiaRspackPlugin;
