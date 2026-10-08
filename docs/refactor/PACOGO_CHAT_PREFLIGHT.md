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
7. Inspect the current canonical PacoGO page template before creating or changing a page.
8. Identify the relevant architectural owner/boundary before implementation.

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
- Work in small, controlled changes.

## After every meaningful update

Before calling an update complete:

1. Re-run the visual/functional invariant checks against the complete page.
2. Run the relevant tests/browser proof actually required by the change.
3. Verify the exact GitHub branch and resulting HEAD/state.
4. Update the relevant handoff/checkpoint when required.
5. Only after verification, provide the user with the exact pull/update instructions.
6. Report what changed, verification status, and confirm `main`/LIVE was not modified.

## Failure rule

If a new implementation violates one of these invariants, stop and correct the boundary/template usage before continuing. Do not rationalize the violation as a minor visual detail.

**Core principle:** The template determines the form. The page determines the content. Every chat must verify both before implementation and again after implementation.
