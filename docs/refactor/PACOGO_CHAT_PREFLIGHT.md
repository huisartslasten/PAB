# PacoGO — Mandatory Chat Pre-Flight

This document is binding for every new PacoGO development chat on `refactor/professional-v1`.

## Before any implementation

Every new chat MUST complete this checklist before building, editing, or committing code:

1. Read `docs/refactor/PACOGO_HANDOFF.md`.
2. Read `docs/engineering/PACOGO_ENGINEERING_STANDARD.md`.
3. Verify repository: `huisartslasten/PAB`.
4. Verify branch/environment: `refactor/professional-v1`.
5. Confirm `main` is LIVE and must not be touched.
6. Inspect the actual current repository state, current HEAD, and relevant source files. Do not rely on memory or assumptions from another chat.
7. Complete **PAB CHANGE INTAKE**: establish the requested outcome, affected functionality/domains, change type, repository, branch, and environment without choosing an implementation location yet.
8. Complete **PAB ARCHITECTURE GATE**: establish canonical owner, current implementation, shared users, correct change location, replacement/removal, and the patch/duplicate-ownership check.
9. Complete **PAB IMPLEMENTATION PLAN** before changing code.
10. Inspect the current canonical PacoGO page template before creating or changing a page.

No code may be changed before steps 1–9 are complete for a meaningful change.

## Development flow

Every meaningful change follows:

**PAB CHANGE INTAKE → PAB ARCHITECTURE GATE → PAB IMPLEMENTATION PLAN → IMPLEMENTATION → PAB VERIFICATION GATE → FINAL VERIFICATION**

A small, obvious, urgent, or local change does not bypass this flow.

## Visual invariants

The complete rendered page must be checked, not only individual components.

- The canonical PacoGO hero/template must be used.
- Typography, spacing, colors, radii, navigation, and surfaces must follow the current template.
- No visible content may sit directly on the PacoGO blue background unless that element is intentionally part of the blue background.
- Every visible content group must live on an approved PacoGO light/white surface or an explicitly approved component surface.
- Do not create a giant white wrapper around the whole middle field merely to satisfy the surface rule.
- A page is not visually compliant just because its individual cards/components look correct; the complete composition must be inspected.

## Functional/architectural invariants

- Do not unnecessarily change existing functionality.
- No new AI behavior unless explicitly requested.
- No Supabase schema changes unless explicitly requested.
- Preserve established architectural boundaries and contracts.
- Do not patch symptoms with local workarounds, duplicated logic, or compatibility shims.
- Do not create a second implementation when a canonical shared owner exists.
- Work in small, controlled changes.

## After every meaningful update

Before calling an update complete:

1. Complete the **PAB VERIFICATION GATE** against the complete page/flow and relevant shared consumers.
2. Run the relevant tests/browser proof actually required by the change.
3. Verify the exact GitHub branch and resulting HEAD/state.
4. Verify architecture/ownership checks required by the change.
5. Update the relevant handoff/checkpoint when required.
6. Complete **FINAL VERIFICATION**, including TEST readability/version checks and confirmation that `main`/LIVE was not modified.
7. Only after verification, provide the user with the exact pull/update instructions.
8. Report what changed and verification status honestly.

## Failure rule

If a new implementation violates one of these invariants, stop and correct the boundary/template usage before continuing. Do not rationalize the violation as a minor detail and do not make a fallback or local exception to get a green test.

**Core principle:** The template determines the form. The page determines the content. The canonical owner determines shared behavior. Every chat must verify all three before implementation and again after implementation.
