# Specs

This project is built with **spec-driven development (SDD)**. Every feature starts as a
Markdown spec in this folder, before any code is written. The spec is the contract between
the person asking for the feature, the person (or agent) building it, and the reviewer.

## The loop

1. **Write the spec.** Requirements, acceptance criteria, edge cases, and what must not be touched.
2. **Plan.** Break the spec into small, reviewable steps. An AI agent can draft the plan, a human reviews it.
3. **Implement step by step.** Each step is checked against the spec, not against "it looks fine".
4. **Verify.** Every acceptance criterion maps to a test (unit, e2e, or a CI gate). The spec lists them.
5. **Close the loop.** When behaviour changes, the spec changes in the same pull request.

## Index

| #   | Spec                                                  | Status      |
| --- | ----------------------------------------------------- | ----------- |
| 000 | [Overview and architecture](./000-overview.md)        | Implemented |
| 001 | [Content model](./001-content-model.md)               | Implemented |
| 002 | [Internationalization](./002-i18n.md)                 | Implemented |
| 003 | [Interactive chart block](./003-interactive-chart.md) | Implemented |
| 004 | [Generative design](./004-generative-design.md)       | Implemented |
| 005 | [Content QA tool](./005-content-qa.md)                | Implemented |
| 006 | [Quality gates](./006-quality-gates.md)               | Implemented |

New specs start from [`_template.md`](./_template.md).

## Conventions

- Requirements are numbered `R1`, `R2`, ... and acceptance criteria `AC1`, `AC2`, ...
- Each acceptance criterion names the test that proves it, so a reviewer can jump from the
  spec straight to the evidence.
- "Do not touch" lists the parts of the system a change must leave alone. It keeps both humans
  and agents from "improving" things nobody asked to change.
