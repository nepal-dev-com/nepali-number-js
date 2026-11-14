---
name: nepali-number-adr-workflow
description: "Read before proposing, writing, revising or approving an ADR for nepali-number, and before changing anything a consumer can observe (an export, option, default, output string or published shape). Holds the five workflow steps in full, from Proposed to Approved, and the public API reference every API-changing ADR ships: signature, options, example outputs, semver impact."
---

# nepali-number-adr-workflow

Part of this repository's working agreement (ADR-0011): as binding as `AGENTS.md`, which holds the rules every task needs. The text below is the depth of the `AGENTS.md` sections named in each heading; a `§N` in it is a section of `AGENTS.md`. Links are relative to this file; a path that starts with `user-guide/` or `maintainer-guide/` is relative to `docs/docs.nepal-dev.com/content/nepali-number/`.

## First

- No library code before the owner approves the ADR. Write it, set `Status: Proposed`, add the index row, and stop.
- Approval is explicit, and only the owner gives it. Never mark an ADR approved on your own.
- An approved ADR's Decision section is never edited. Supersede it.
- An ADR that changes what a consumer can import or observe ships its `user-guide/dev/api/` page in the same change.

## The workflow (`AGENTS.md` §2)

1. **Propose.** Start from [`docs/_templates/adr.md`](../../../docs/_templates/adr.md) and write
   `maintainer-guide/adr/ADR-NNNN-kebab-title.mdx`, in the page format of §8, using the *next free number* from
   [`maintainer-guide/adr/index.mdx`](../../../docs/docs.nepal-dev.com/content/nepali-number/maintainer-guide/adr/index.mdx). Set **`Status: Proposed`** and add the index
   row straight away, so ADRs in flight cannot collide on a number.
   **If the change touches the public API, write its reference in the same change**
   ([ADR-0008](../../../docs/docs.nepal-dev.com/content/nepali-number/maintainer-guide/adr/ADR-0008-public-api-changes-ship-their-reference.mdx)): the affected
   `user-guide/dev/api/<domain>.mdx` page, with the signature, defaults and example outputs the change
   will produce. See *Public API reference* below.
2. **Stop.** Do not write library code. Tell the owner the ADR, and its API reference if it has
   one, are ready for review.
3. **Revise** in place while the owner has feedback — status stays `Proposed`.
4. **On explicit approval only:** set `Status: Approved`, fill `Approved by:` with
   `[@puncoz](https://github.com/puncoz)` and `Approved on: <date>`, update the index row, *then* implement.
5. **Never** edit an approved ADR's Decision section. Supersede it with a new ADR and
   cross-link both files.

## Public API reference — required with every ADR that changes the API

[ADR-0008](../../../docs/docs.nepal-dev.com/content/nepali-number/maintainer-guide/adr/ADR-0008-public-api-changes-ship-their-reference.mdx). An ADR that adds or
changes anything a consumer can import or observe ships the updated `user-guide/dev/api/<domain>.mdx`,
and the two are reviewed together. For each affected export it shows:

- **the signature** exactly as it will appear in `dist/nepali-number.d.ts`;
- **every option and default**;
- **example outputs** — typical input, English and Nepali digits, zero, negative, decimal,
  large (≥ 1 crore), and invalid input — as the code will produce them;
- **the semver impact**: patch, minor or major, and why
  ([`maintainer-guide/release/versioning.mdx`](../../../docs/docs.nepal-dev.com/content/nepali-number/maintainer-guide/release/versioning.mdx)).

Not needed for a change no consumer can observe. Unsure whether one could? Write it.
Template: [`docs/_templates/api.md`](../../../docs/_templates/api.md).
