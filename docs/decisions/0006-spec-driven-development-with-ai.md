# 0006: Specs first, AI drafts, a human reviews

- **Status:** Accepted
- **Docs:** [`docs/specs`](../specs), [`AGENTS.md`](../../AGENTS.md),
  [pull request template](../../.github/pull_request_template.md)

## Context

I build with AI coding agents. They are fast, but they drift: they solve a slightly different
problem, touch code nobody asked them to touch, or call a feature done because it looks done.

## Options

1. **Prompt and review the diff.** Quick for small changes, but the review happens against an
   intent that was never written down.
2. **Spec-driven development.** A short Markdown spec comes first: requirements, acceptance
   criteria, edge cases and a "Do not touch" list. The agent drafts a plan from it, I review the
   plan, and the implementation is checked against the spec, step by step.

## Decision

Option 2 for every feature and every behavior change. Each acceptance criterion names the test
that proves it, so a reviewer can go from the spec straight to the evidence. `AGENTS.md` tells
any coding agent how to work in this repository, and the pull request template asks which spec a
change implements.

## Consequences

- Reviews discuss the spec, not the diff, and scope creep is visible as a spec change.
- Agents stay inside the "Do not touch" boundaries.
- Writing the spec takes time up front. Small fixes skip it, but a fix that changes behavior
  updates the spec in the same change, as the [sideways scroll fix](../postmortems/2026-11-26-sideways-scroll.md) did.

## Revisit when

Specs start restating the code. A spec that only repeats the implementation is a sign the
feature was too small to need one.
