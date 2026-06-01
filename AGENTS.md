# AGENTS.md

## Commands

- **Build:** `pnpm build` (rslib)
- **Test:** `pnpm test` (builds first, then runs `rstest run`)
- **Lint/Format check:** `pnpm dprint check`
- **Format fix:** `pnpm dprint fmt`

There is no separate typecheck script. The tsconfig uses `noEmit: true`; type errors surface during build.

## Architecture

Single ESM package (`"type": "module"`). Two entrypoints built by rslib:

- `src/index.ts` — the `TypiaRspackPlugin` class (registers the loader on the compiler)
- `src/loader.ts` — rspack loader that calls typia's transform

Supporting modules: `src/options.ts` (option types/defaults), `src/transform.ts` (wraps typia's transformer API).

`typescript` and `typia/lib/transform` are externals — not bundled into dist.

## Testing

- Framework: **rstest** (`@rstest/core`) — not Jest or Vitest
- Config: `rstest.config.ts`
- Tests live in `tests/` and import source directly (e.g., `../src/transform`)
- Test fixtures in `tests/fixtures/`
- Tests require `pnpm build` to have run first (the test script handles this)

## Formatting

- **dprint** (not prettier or eslint)
- Config: `.dprint.jsonc` with default settings for all plugins
- Run `pnpm dprint check` before committing

## Toolchain

- Package manager: **pnpm** (corepack, v11.5)
- Node: >=18
- TypeScript: 6.x
- Build: rslib (rspack-based)
