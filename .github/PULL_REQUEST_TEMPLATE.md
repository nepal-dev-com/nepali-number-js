## What this changes

<!-- One or two sentences. Link the issue. -->

## ADR

<!-- Every feature and functional change needs an approved ADR first (AGENTS.md §2), and so does
     any change to what a function returns. Link it, or say why none is needed: a bug fix that
     restores documented behaviour, tests, a typo, or documentation of existing behaviour. -->

## Checklist

- [ ] The ADR is **Approved**, or this change needs none (above).
- [ ] If a consumer can observe the change, its API reference is updated, with example outputs copied from a run of the built package, and the semver impact is stated.
- [ ] No Nepali spelling, word form or rounding rule was guessed. Open questions are asked here.
- [ ] Tests cover the happy path and the obvious failures.
- [ ] `README.md`, `AGENTS.md`, the skills and the ADR index match the change.
- [ ] No dependency was added, or its ADR is approved.
- [ ] `bun run type-check`, `bun run test` and `bun run build` pass locally; CI runs them again.

<!-- The title is a Conventional Commit (fix:, feat:, feat!:, docs:, test:, chore:). The prefix
     decides the next version number. -->
