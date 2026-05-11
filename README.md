# typia-rspack-plugin

<p>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/typia-rspack-plugin">
    <img alt="" src="https://img.shields.io/npm/v/typia-rspack-plugin?logo=npm">
  </a>
  <a aria-label="License" href="https://github.com/colinaaa/typia-rspack-plugin/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue" alt="license" />
  </a>
</p>

A Rspack plugin for [typia](https://github.com/samchon/typia) - TypeScript transformer for runtime type checking and validation.

## Why

This plugin is a lightweight Rspack-specific Typia transformer. It wires a local Rspack loader that calls Typia's exported `typia/lib/transform` entry directly, without depending on `unplugin`.

## Usage

Add the plugin to your `rspack.config.js`:

```typescript
import { TypiaRspackPlugin } from "typia-rspack-plugin";

export default {
  plugins: [
    new TypiaRspackPlugin(),
  ],
};
```

### Using with Rslib

If you're using [Rslib](https://github.com/web-infra-dev/rslib), you can add the plugin to your `rslib.config.ts`:

```javascript
import { defineConfig } from "@rslib/core";
import { TypiaRspackPlugin } from "typia-rspack-plugin";

export default defineConfig({
  lib: [
    { format: "esm" },
  ],
  tools: {
    rspack: {
      plugins: [
        new TypiaRspackPlugin(),
      ],
    },
  },
});
```

## Options

```typescript
new TypiaRspackPlugin({
  include: [/\.[cm]?[jt]sx?$/],
  exclude: [/node_modules/],
  enforce: "pre",
  tsconfig: "tsconfig.json",
  typia: {},
});
```

- `include`: files to transform. Defaults to TypeScript and JavaScript files.
- `exclude`: files to skip. Defaults to `node_modules`.
- `enforce`: Rspack loader order, `"pre"` by default.
- `tsconfig`: optional path to the TypeScript config used to create the transform program.
- `typia`: options forwarded to Typia's transformer.

## Development

Build the library:

```bash
pnpm build
```

Build the library in watch mode:

```bash
pnpm dev
```

## License

MIT License - see the [LICENSE](LICENSE) file for details.
