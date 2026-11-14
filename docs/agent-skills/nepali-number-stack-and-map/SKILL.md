---
name: nepali-number-stack-and-map
description: "Read before looking for where something lives in nepali-number, and before touching package.json, tsconfig, tsdown, bunfig, dependencies, the build, CI or the release workflow. Holds the current state of the package (version, exports, tests), what is installed today concern by concern, and the full repository map."
---

# nepali-number-stack-and-map

Part of this repository's working agreement (ADR-0011): as binding as `AGENTS.md`, which holds the rules every task needs. The text below is the depth of the `AGENTS.md` sections named in each heading; a `§N` in it is a section of `AGENTS.md`. Links are relative to this file; a path that starts with `user-guide/` or `maintainer-guide/` is relative to `docs/docs.nepal-dev.com/content/nepali-number/`.

## First

- Read the installed tool, not recall: check `node_modules/tsdown/`, `node_modules/typescript/` and the emitted `dist/` before asserting how a tool behaves.
- No runtime dependency may be added. A dev dependency, or any change to build, test, CI or release tooling, needs an approved ADR.
- Never edit `dist/` or `coverage/`, and never edit `sample/`.

## Current state (`AGENTS.md` §1)

**Current state:** `package.json` is at `2.0.0`, but npm's `latest` is still **1.0.3** — no
2.x has been published, and the release workflow cannot publish yet
([`maintainer-guide/release/releasing.mdx`](../../../docs/docs.nepal-dev.com/content/nepali-number/maintainer-guide/release/releasing.mdx#current-gaps)). 21 functions are exported across five domains
(conversion, formatting, words, currency, utils). The option and result types
(`FormatOptions`, `CurrencyOptions`, `NumberSystem`) exist in `src/*/types.ts` but are **not**
re-exported, so consumers cannot import them yet. 162 tests pass, 13 of them the check on this working agreement in `src/agent-docs.test.ts`; `bun run type-check` and
`bun run build` are clean. Every function and line is covered except three unreachable
fallbacks in `src/words/words.ts`.

## What is installed today (`AGENTS.md` §5)

What is installed **today** (verified from `package.json`, the lockfile and the config files):

| Concern | In the repo |
|---|---|
| Language | TypeScript **5.9.3**, `strict` plus `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`, `noPropertyAccessFromIndexSignature`, `noImplicitOverride`, `isolatedDeclarations`; `@/*` → `src/*`; `include` is `src` and `tsdown.config.ts` only (ADR-0010) |
| Module system | `"type": "module"`; `module: "Preserve"`, `moduleResolution: "bundler"`, `verbatimModuleSyntax` |
| Bundler | **tsdown 0.15.12** (rolldown), `tsdown.config.ts`: entry `src/nepali-number.ts`, formats ESM + CJS + IIFE + UMD, minified, `.d.ts` + `.d.cts`, global name `nepaliNumber` |
| Testing | `bun test` with coverage always on and the test root set to `src` (`bunfig.toml`, text + lcov to `coverage/`); tests beside the code as `*.test.ts` |
| Runtime dependencies | **None**, and none may be added (§6) |
| Dev dependencies | `typescript`, `tsdown`, `@types/bun`, `del-cli` |
| Package manager | Bun (1.4.4 locally; CI uses `latest`); `bun.lock` is committed |
| CI | `.github/workflows/ci.yml`: type-check, test, build on Node 20 / 22 / 24; Codecov upload; pack-and-require smoke test |
| Release | `.github/workflows/release.yml`: runs `bun run release` after CI passes on `main`, `beta`, `alpha` — see [`maintainer-guide/release/releasing.mdx`](../../../docs/docs.nepal-dev.com/content/nepali-number/maintainer-guide/release/releasing.mdx) for its current gaps |
| Linting / formatting | **None installed.** Adopting one is a tooling ADR |

## Repository map (`AGENTS.md` §10)

```
.
├── AGENTS.md              # this working agreement (CLAUDE.md imports it)
├── CLAUDE.md              # → @AGENTS.md
├── README.md              # consumer-facing overview — npm shows this page
├── LICENSE                # MIT
├── docs/
│   ├── agent-skills/      # this repository's own skills, nepali-number-<topic>/SKILL.md (ADR-0011)
│   ├── _templates/        # a starting point for each document type
│   └── docs.nepal-dev.com/  # git submodule: the Nepal Dev Verse documentation site (§8)
│       ├── PROJECT_AGENTS.md         # the rules for writing documentation there
│       ├── content/nepali-number/
│       │   ├── index.mdx             # the overview
│       │   ├── user-guide/dev/       # user docs for main: getting started, guides/, api/
│       │   ├── user-guide/v2/        # user docs for the released 2.x line
│       │   └── maintainer-guide/     # adr/, architecture/, release/, security/
│       └── diagrams/nepali-number/   # each diagram's Archify view and its source
├── .claude/skills/        # a link to each skill in docs/agent-skills/, for Claude Code
├── .agents/skills/        # the same links, for tools that read that folder
├── src/
│   ├── nepali-number.ts   # public barrel — the only build entry
│   ├── constants.ts       # digits, words, ordinals, scales — all language data
│   ├── agent-docs.test.ts # checks AGENTS.md, the skills and their links (ADR-0011)
│   ├── conversion/        # toNepali, toEnglish, parseNepaliNumber, convert
│   ├── formatting/        # formatNepaliNumber, addNepaliCommas, removeFormatting; FormatOptions
│   ├── words/             # toNepaliWords, toEnglishWords, toNepaliOrdinal, toDecimalWord
│   ├── currency/          # toNepaliCurrency, toNepaliCurrencyWords; CurrencyOptions
│   └── utils/             # normalize, detection, validation, padZeros, roundNepali; NumberSystem
├── .gitmodules            # the documentation submodule
├── .github/workflows/     # ci.yml, release.yml
├── package.json           # exports map, scripts, files: ["dist"]
├── tsconfig.json          # strict; isolatedDeclarations; @/* → src/*; includes src only
├── tsdown.config.ts       # ESM + CJS + IIFE + UMD, global nepaliNumber
├── bunfig.toml            # coverage always on; test root src
├── dist/                  # generated by `bun run build` — git-ignored, never edited
└── sample/                # reference material from another project — not part of the package
```

Each domain folder holds `<domain>.ts`, `<domain>.test.ts`, `index.ts`, and `types.ts` when the
domain exports a type.
