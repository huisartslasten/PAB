# PacoGO — Design System Migration Inventory

Status: dropdown cutover completed; remaining primitives parked pending consumer inventory
Branch: `refactor/professional-v1`

## Purpose

This document is the migration gate for Phase 1, item 4 (Design System). Shared visual primitives are migrated one responsibility at a time, with a single canonical owner and no compatibility bridge.

## PAB Change Intake

Goal: finish Phase 1 by centralizing shared visual primitives without breaking the working PacoGO runtime.

Change type: architecture/refactor.

Affected area: shared UI primitives currently coupled to the Page Template.

Repository: `PAB`.

Test branch: `refactor/professional-v1`.

## PAB Architecture Gate

### 1. Canonical owners

- Page shell: `src/components/page-template.js`
- Navigation: `src/components/page-navigation.js`
- Management shell: `src/features/management/management-shell.js`
- Generic visual primitives: `src/components/design-system.js` / `src/components/design-system.css`
- Page-template-specific shell styling remains in `src/components/page-template.css`.

### 2. Current implementation

The first migrated primitive is the shared PacoGO dropdown. Its canonical owner is now the Design System. Page Template no longer exports or implements `createPacoDropdown()`.

The Design System currently contains:

- `createPacoDropdown()` in `src/components/design-system.js`;
- dropdown styling in `src/components/design-system.css`.

`src/components/page-template.css` loads the Design System stylesheet so existing page-template consumers receive the same visual styling without introducing feature-specific imports.

### 3. Shared consumers

The confirmed runtime consumer for the dropdown is:

- `src/features/practice/memory/view.js` — imports `createPacoDropdown()` directly from the Design System and uses it for the Memory timing selector.

The previous attempted cutover had missed this consumer because the current implementation lives under `src/features/practice/memory`, not the older lessons location.

### 4. Architectural destination

The Design System owns generic visual primitives. Page Template remains responsible for page composition and shell structure.

Concrete components such as `PacoTile`, activity cards, navigation, editor controls and management-specific UI remain their own component/feature responsibilities and are not converted into generic Design System primitives merely because they are visual.

### 5. Legacy/local implementation removed

For the dropdown cutover:

- `createPacoDropdown()` was removed from `src/components/page-template.js`;
- `.paco-dropdown*` styling was removed from `src/components/page-template.css`;
- no compatibility re-export remains in Page Template.

### 6. Patchwork check

The migration introduces no:

- compatibility re-export;
- fallback import;
- duplicate runtime implementation;
- bridge between old and new owners;
- page-specific copy;
- temporary redirect or bypass.

## Migration rule

For each shared UI responsibility:

1. inventory the current owner;
2. inventory every runtime consumer and test consumer;
3. define the future canonical owner;
4. prepare the future owner without changing unrelated ownership;
5. migrate all consumers directly;
6. run the full regression;
7. only after green verification remove the old implementation.

## Current inventory

| Responsibility | Current canonical owner | Consumer inventory | Status |
|---|---|---|---|
| Dropdown | Design System | Memory runtime + Design System tests | **Migrated; verification pending** |
| Generic buttons | `src/components/page-template.css` | Not yet complete | Parked |
| Generic cards | `src/components/page-template.css` | Not yet complete | Parked |
| Form controls | `src/components/page-template.css` | Not yet complete | Parked |
| File/remove controls | `src/components/page-template.css` | Not yet complete | Parked |
| Design tokens | `src/components/page-template.css` | Not yet complete | Parked |

## PAB Implementation Plan

The next implementation unit is the verification of the dropdown cutover. Once the full regression is green, continue with the next primitive only after its TEST-branch consumer inventory is complete.

The order remains:

1. dropdown — migrated;
2. design tokens;
3. generic buttons;
4. generic cards;
5. form controls;
6. file/remove controls.

Each migration is direct and single-owner. No bridge or duplicate implementation is permitted.

## PAB Verification Gate

For the dropdown cutover, the source-level architecture checks are complete:

- Memory imports the new Design System owner;
- Page Template no longer exports `createPacoDropdown()`;
- dropdown styling no longer resides in `page-template.css`;
- the Design System has dedicated runtime and stylesheet ownership;
- dedicated dropdown tests were added.

The repository's full-regression workflow is configured to run on pushes to `refactor/professional-v1`, but no workflow run is currently visible for the latest commit. Therefore the full regression is **not claimed green** yet.

## Current decision

The dropdown ownership migration is implemented on TEST and is the only primitive moved in this unit. The next step is verification. No further Design System primitive should be migrated until this cutover has a green full regression.
