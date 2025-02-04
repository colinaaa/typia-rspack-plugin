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

This plugin is a lightweight alternative to using the full `unplugin-typia` package. While `unplugin-typia` supports multiple bundlers (Webpack, Vite, Rollup, etc.), this plugin is specifically designed for Rspack users. By only including the Rspack-specific code, we can significantly reduce the installation size and dependencies.

If you're using Rspack as your bundler and typia for runtime type checking, this plugin provides the same functionality as `unplugin-typia` but with a smaller footprint.

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

The plugin accepts all options supported by `@ryoppippi/unplugin-typia`. For detailed options, please refer to the [`unplugin-typia` documentation](https://github.com/ryoppippi/unplugin-typia).

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
