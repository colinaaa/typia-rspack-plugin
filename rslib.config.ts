import { defineConfig } from "@rslib/core";
import { pluginPublint } from "rsbuild-plugin-publint";

export default defineConfig({
  lib: [
    { format: "esm", syntax: "es2023", dts: { bundle: true } },
  ],
  tools: {
    rspack: {
      externals: [
        { typescript: "commonjs typescript" },
        "svelte/compiler",
      ],
    },
  },
  plugins: [
    pluginPublint(),
  ],
});
