# PacoGO — Design System Migration Inventory

Status: form controls verified green on TEST; file/remove control gate completed
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

### File/remove architecture decision

The file/remove gate found no active standalone `.paco-template-file-button`, `.paco-template-file-input` or `.paco-template-remove-button` implementation to migrate.

The responsibilities are already covered by the canonical primitives:

- file input presentation belongs to the generic form-control primitive in `src/components/design-system.css`;
- remove actions belong to the generic button primitive, using its danger variant where appropriate;
- feature-specific upload, storage or deletion behavior remains with its existing feature/service owner.

No new file/remove primitive is introduced because there is no second active visual owner to consolidate. This avoids creating a duplicate abstraction merely to satisfy the migration checklist.

### Legacy/local implementation removed

- generic form-control selectors were removed from `src/components/page-template.css`;
- their canonical styling is now in `src/components/design-system.css`;
- no standalone file/remove selector implementation was found in the TEST branch;
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
| File/remove controls | Design System primitives + feature owners | **Architecture gate completed; no standalone migration required** |

## PAB Implementation Plan

The form-control implementation and full regression are complete on TEST. The file/remove architecture gate is now complete without an implementation change: file inputs remain part of the generic form-control primitive, remove actions remain part of the generic button primitive, and feature behavior remains in its domain owner.

The sequence is now:

1. dropdown — migrated;
2. design tokens — migrated;
3. generic buttons — migrated;
4. generic cards — migrated;
5. form controls — migrated and verified green;
6. file/remove controls — architecture gate completed; no separate migration required.

Each migration is direct and single-owner. No bridge or duplicate implementation is permitted.

## PAB Verification Gate

Source-level ownership checks are locked in `src/components/design-system.test.js`:

- form-control primitives exist in Design System;
- generic input/date/time/textarea/select styling no longer exists in Page Template.

The file/remove inventory additionally verified that the previously queued standalone selectors are absent from the TEST branch, so no migration code was required.

The full PacoGO regression workflow on `refactor/professional-v1` passed for the form-control cutover.

## Next architecture gate

Phase 1 file/remove work is closed. The next design-system migration unit must be selected from an actual active responsibility; do not create a new primitive solely because an old checklist item exists.
