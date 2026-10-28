# PacoGO — Design System Migration Inventory

Status: generic card cutover implemented on TEST; full regression pending
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

The migrated primitives are now owned by the Design System:

- dropdown runtime and styling in `src/components/design-system.js` / `src/components/design-system.css`;
- generic button primitives in `src/components/design-system.css`;
- generic card surface in `src/components/design-system.css`.

The generic card was previously styled by `src/components/page-template.css` through `.card` and `.paco-template-card`. Those generic card rules were removed from Page Template and moved to the Design System.

`src/components/page-template.css` loads the Design System stylesheet so existing page-template consumers receive the shared primitive without feature-specific imports.

### 3. Shared consumers

Confirmed consumers for the card cutover include:

- existing page-template `.card` consumers, which continue to use the canonical `.card` primitive now owned by the Design System;
- `src/components/activity-card-grid.js`, where activity cards now compose `.card` with `.activity-card`.

Activity-card layout, icon treatment, content hierarchy and interaction remain owned by `activity-card-grid`; only the generic card surface is shared.

### 4. Architectural destination

The Design System owns the generic card surface: padding, border, radius, background, text color, shadow and generic card content defaults.

Concrete components remain their own owners. In particular:

- `PacoTile` remains tile/domain-specific;
- `activity-card-grid` remains activity-card-specific and composes the generic card;
- management student cards remain management-specific because their blue surface and layout are domain-specific;
- navigation, editor controls and other feature UI are not converted merely because they are visually card-like.

### 5. Legacy/local implementation removed

For the generic card cutover:

- generic `.card` styling was removed from `src/components/page-template.css`;
- unused `.paco-template-card` styling was removed from `src/components/page-template.css`;
- the canonical `.card` styling now lives in `src/components/design-system.css`;
- activity cards now explicitly compose the canonical `.card` primitive.

No second card runtime or local generic-card implementation was introduced.

### 6. Patchwork check

The migration introduces no:

- compatibility re-export;
- fallback import;
- duplicate runtime implementation;
- bridge between old and new owners;
- page-specific generic-card copy;
- temporary redirect or bypass.

The feature-specific activity-card rules are retained only where they express activity-card behavior/layout rather than generic card styling.

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
| Dropdown | Design System | Memory runtime + Design System tests | **Migrated** |
| Design tokens | Design System | shared visual consumers | **Migrated** |
| Generic buttons | Design System | shared button consumers + Design System tests | **Migrated** |
| Generic cards | Design System | page-template `.card` consumers + activity cards + Design System tests | **Implemented; verification pending** |
| Form controls | `src/components/page-template.css` | Not yet complete | Parked |
| File/remove controls | `src/components/page-template.css` | Not yet complete | Parked |

## PAB Implementation Plan

The card implementation unit is complete on TEST and is ready for verification.

The order remains:

1. dropdown — migrated;
2. design tokens — migrated;
3. generic buttons — migrated;
4. generic cards — implemented; verify now;
5. form controls — next after green verification;
6. file/remove controls — later.

Each migration is direct and single-owner. No bridge or duplicate implementation is permitted.

## PAB Verification Gate

Source-level checks prepared for the card cutover:

- generic card styling exists in `src/components/design-system.css`;
- generic card styling no longer resides in `src/components/page-template.css`;
- activity cards compose `.card` with `.activity-card`;
- activity-card-specific layout remains in `activity-card-grid.css`;
- dedicated Design System card ownership test was added;
- dedicated activity-card composition test was added.

The final verification is the repository's full regression workflow on `refactor/professional-v1`. It must pass before this card cutover is considered green and before moving to form controls.

## Current decision

Generic Cards are implemented on TEST with a single canonical Design System owner. The next step is the full verification run. No further Design System primitive should be migrated until this cutover has a green full regression.
