import { defineConfig } from "@rslib/core";
import { pluginPublint } from "rsbuild-plugin-publint";

export default defineConfig({
  lib: [
    {
      format: "esm",
      syntax: "es2023",
      dts: { bundle: true },
      source: {
        entry: {
          index: "./src/index.ts",
          loader: "./src/loader.ts",
        },
      },
    },
  ],
  tools: {
    rspack: {
      externals: [
        { typescript: "commonjs typescript" },
        "typia/lib/transform",
      ],
    },
  },
  plugins: [
    pluginPublint(),
  ],
});
