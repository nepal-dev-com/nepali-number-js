---
name: nepali-number-docs-duties
description: "Read before adding or editing a page in the documentation submodule or README.md for nepali-number, and before finishing any implementation. Holds the documentation tracks (user-guide/dev, user-guide/v2, maintainer-guide), the two kinds of document, which documents a change requires before building (API reference, limitations, architecture, guides, release, security), and the files to check before declaring work complete."
---

# nepali-number-docs-duties

Part of this repository's working agreement (ADR-0011): as binding as `AGENTS.md`, which holds the rules every task needs. The text below is the depth of the `AGENTS.md` sections named in each heading; a `§N` in it is a section of `AGENTS.md`. Links are relative to this file; a path that starts with `user-guide/` or `maintainer-guide/` is relative to `docs/docs.nepal-dev.com/content/nepali-number/`.

## First

- Before changing anything in the submodule, read `docs/docs.nepal-dev.com/PROJECT_AGENTS.md` and the skills it names.
- New and changed behaviour is written in `user-guide/dev/`. A released line keeps describing its version.
- Living documents are snapshots: what is no longer true is deleted, not annotated.
- Every example output is real: run it against the built package before writing it down.
- Never commit, push or switch branches inside the submodule.

## The tracks (`AGENTS.md` §8)

| Track | Folder under `content/nepali-number/` | Holds |
|---|---|---|
| **User guide** | `user-guide/dev/` | User docs for unreleased work on `main`: getting started, `guides/`, `api/`. **New and changed behaviour is written here.** |
| **User guide** | `user-guide/v2/` | The released 2.x line, marked `latest`. It keeps describing its version: only mistakes are corrected. |
| **Maintainer guide** | `maintainer-guide/` | `adr/`, `architecture/`, `release/`, `security/`. Not versioned: describes `main`. |

The owner commits inside the submodule and moves its pointer; agents list the files they
changed there and hand over the commands in `PROJECT_AGENTS.md` §10.

### Two kinds of document

| Kind | Where | Rule |
|---|---|---|
| **Decisions** | `maintainer-guide/adr/` | Immutable once approved. Superseded, never edited. |
| **Living documents** | `README.md`, the User guide and everything else in `maintainer-guide/` | Describe the package **as it stands right now**, and are edited in place. |

### Write before building

With the change's ADR, before implementation — then update during the build if the design
moves.

| Document | Directory | Required when |
|---|---|---|
| **API reference** | `user-guide/dev/api/` | **Any change a consumer can observe (§2, ADR-0008)** |
| Limitations | `user-guide/dev/api/limitations.mdx` | A limitation is found, fixed, or introduced |
| Architecture | `maintainer-guide/architecture/` | A new domain, a new cross-domain import, or a change to the build, formats or `exports` map |
| Guides | `user-guide/dev/guides/` | A new way to use the package, a new runtime, or a breaking change that needs a migration path |
| Versioning / releasing | `maintainer-guide/release/` | The semver policy, CI, or release process changes |
| Security | `maintainer-guide/security/` | The change touches the supply chain, CI secrets, publishing, or adds input handling worth its own analysis |

Judgement applies — a small change may need none of them. **If it is unclear whether one is
required, write it.** Start from [`docs/_templates/`](../../../docs/_templates/), and write the page as
`.mdx` with a `title` and a `description`.

**Every diagram is Mermaid and Archify together**: a Mermaid fence inside a `<Diagram>`, with its
Archify view in the submodule's `diagrams/nepali-number/`. No binary or externally hosted images.

### Always check these

| File | Update when |
|---|---|
| `user-guide/dev/api/` | An export's signature, default, output or limitation changes. An implementation is **not complete** while the reference contradicts it. |
| `README.md` | What the package does, how to install or import it, or its API summary changes. README is what npm shows. |
| `AGENTS.md` (this file) | The way work is done changes — conventions, commands, structure, rules, stack |
| `maintainer-guide/adr/index.mdx` | An ADR is written or changes status — keep the index and the next free number accurate |
