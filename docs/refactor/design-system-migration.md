# PacoGO — Design System Migration Inventory

Status: form controls verified green on TEST; file/remove controls are next
Branch: `refactor/professional-v1`

## Purpose

Phase 1 centralizes shared visual primitives one responsibility at a time, with a single canonical owner and no compatibility bridge.

## PAB Change Intake

Goal: centralize shared visual primitives without breaking the working PacoGO runtime.

Change type: architecture/refactor.

Repository: `PAB`.

Test branch: `refactor/professional-v1`.

## PAB Architecture Gate

### Canonical owners

- Page shell: `src/components/page-template.js`
- Navigation: `src/components/page-navigation.js`
- Management shell: `src/features/management/management-shell.js`
- Generic visual primitives: `src/components/design-system.js` / `src/components/design-system.css`
- Page-template-specific shell styling: `src/components/page-template.css`

### Form-control decision

Generic text, date, time, file-input, select and textarea presentation is a Design System responsibility. Page Template must not own generic form-control styling.

The migration keeps feature/domain behavior in its existing owner; this cutover changes only the shared visual ownership boundary.

### Legacy/local implementation removed

- generic form-control selectors were removed from `src/components/page-template.css`;
- their canonical styling is now in `src/components/design-system.css`;
- no compatibility stylesheet or re-export was introduced.

### Patchwork check

No fallback, bridge, duplicate owner, page-specific copy or temporary bypass was introduced.

## Current inventory

| Responsibility | Canonical owner | Status |
|---|---|---|
| Dropdown | Design System | Migrated |
| Design tokens | Design System | Migrated |
| Generic buttons | Design System | Migrated |
| Generic cards | Design System | Migrated |
| Form controls | Design System | **Migrated and verified green** |
| File/remove controls | Page Template | Parked for next cutover |

## PAB Implementation Plan

The form-control implementation and full regression are complete on TEST. File/remove controls are the next Design System migration unit.

The sequence remains:

1. dropdown — migrated;
2. design tokens — migrated;
3. generic buttons — migrated;
4. generic cards — migrated;
5. form controls — migrated and verified green;
6. file/remove controls — next.

Each migration is direct and single-owner. No bridge or duplicate implementation is permitted.

## PAB Verification Gate

Source-level ownership checks are locked in `src/components/design-system.test.js`:

- form-control primitives exist in Design System;
- generic input/date/time/textarea/select styling no longer exists in Page Template.

The full PacoGO regression workflow on `refactor/professional-v1` passed for the form-control cutover.

## Next architecture gate

Before touching file/remove controls, inventory their current selectors and consumers separately. Do not absorb `.paco-template-file-button`, `.paco-template-file-input` or `.paco-template-remove-button` into the generic form-control migration merely because they are visually related; their ownership must be decided as the next migration unit.
