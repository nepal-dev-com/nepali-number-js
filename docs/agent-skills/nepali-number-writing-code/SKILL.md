---
name: nepali-number-writing-code
description: "Read before writing or changing anything under src/ in nepali-number, tests included: a new export, a bug fix, a refactor, a test. Holds the import, typing and domain-direction rules, the steps for adding a new export (implement, options, re-export, test, document, verify), and the code style in full: comments explain why, braces on every branch, TSDoc on every export."
---

# nepali-number-writing-code

Part of this repository's working agreement (ADR-0011): as binding as `AGENTS.md`, which holds the rules every task needs. The text below is the depth of the `AGENTS.md` sections named in each heading; a `§N` in it is a section of `AGENTS.md`. Links are relative to this file; a path that starts with `user-guide/` or `maintainer-guide/` is relative to `docs/docs.nepal-dev.com/content/nepali-number/`.

## First

- An approved ADR comes before any functional change (§2), and the package invariants hold for every line (§6).
- Language data lives in `src/constants.ts`. Domain code never hardcodes Devanagari.
- Explicit return types on every export; no `any`; `@/` imports; dependencies between domains point one way.
- Tests and docs are part of the same change.

## Package rules (`AGENTS.md` §5)

- **Read the installed tool, not recall.** tsdown is pre-1.0 and changes between minors;
  check `node_modules/tsdown/` and the emitted `dist/` before asserting how it behaves.
- **Use `@/` imports inside `src/`**, never relative paths across domains. Never import from
  `dist/` in source or tests.
- **Explicit return types on every export** — `isolatedDeclarations` refuses to build without
  them. Exported constants carry an explicit type annotation too.
- **No `any`, no `// @ts-ignore`, no `// @ts-expect-error` without a reason.** Index access
  returns `T | undefined`: guard it or fall back (`NEPALI_WORDS[n] || ""`), as the existing code
  does.
- **Dependencies between domains point one way**, as drawn in
  [`maintainer-guide/architecture/system.mdx`](../../../docs/docs.nepal-dev.com/content/nepali-number/maintainer-guide/architecture/system.mdx): `constants` ← `conversion` ←
  `formatting` ← `utils` ← `words` ← `currency`. A new import that points back up, or creates a
  cycle, needs an ADR.

## Adding a new export (after the ADR is approved)

1. **Pick the domain** that fits semantically. A new domain is its own ADR decision.
2. **Implement** in `src/<domain>/<domain>.ts` as an arrow function `export const name = (…): T =>`,
   with a verb-led name (`toNepaliX`, `formatX`, `parseX`, `isX`, `detectX`), an explicit return
   type, and TSDoc (§7). Language data goes in `src/constants.ts`, never inline.
3. **Options** get an interface in `src/<domain>/types.ts`; every field optional, defaults
   applied by destructuring in the function signature.
4. **Re-export.** Domain `index.ts` files use `export * from "./<domain>"`; a new domain also adds
   `export * from "@/<domain>"` to `src/nepali-number.ts`. A public type must also be
   re-exported (`export type * from "./types"`) — today's `index.ts` files do not do this, which
   is why the existing option types are unreachable for consumers.
5. **Test** in `src/<domain>/<domain>.test.ts`, importing from `"."` (§ ADR-0007 for coverage).
6. **Document** in `user-guide/dev/api/<domain>.mdx` and the README's API summary.
7. **Verify**: `bun run type-check`, `bun run test`, `bun run build`, then load the built CJS
   file with `node` and check the new export's outputs match the docs.

## Code style (`AGENTS.md` §7)

[ADR-0003](../../../docs/docs.nepal-dev.com/content/nepali-number/maintainer-guide/adr/ADR-0003-code-comment-policy.mdx). **Comments explain *why*. The code
explains *what*. If the code is self-explanatory, write no comment at all.**

A comment is warranted only when the reasoning, trade-off, edge case or constraint cannot be
recovered from the code: why a workaround exists, why this approach beat the obvious one, why a
value is hardcoded, a non-obvious language rule (an irregular ordinal, why 1–4 are exceptions),
a floating-point or Unicode constraint.

```ts
// Bad — restates what is visible
// remove commas
const cleaned = input.replace(/,/g, "")

// Good — states what the code cannot
// \d only matches ASCII digits, so Nepali input must be converted before grouping.
```

- **Prefer a reference to an ADR over prose** (`// Ordinals 1–4 are irregular — ADR-00NN.`).
- **Keep them short** — a line or two, directly above what they explain. No paragraphs, no
  banners, no `=====` section headers.
- **Confusing code is not a comment problem.** Rewrite it.
- **Every branch takes a block.** `if`, `else`, `for`, `while` and `do` bodies are braced even
  for a single statement. There is no linter yet, so this is enforced in review; the ADR that
  adopts a linter turns on `curly: ["error", "all"]`.
- **Every export carries TSDoc** — a one-line summary, `@param` for each parameter, `@returns`
  including the safe default for invalid input, and an `@example`. It is emitted into
  `dist/nepali-number.d.ts` and is what consumers read in their editor. Several exports in
  `currency`, `words` and `utils` lack it today; add it when you touch them.
- **Configuration files may describe what a key does** (`tsconfig.json`, `tsdown.config.ts`,
  `bunfig.toml`, CI workflows), still briefly, still linking the ADR that governs the value.
- **Existing code is not rewritten to match** unless the change already touches it.
