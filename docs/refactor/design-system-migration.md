# PacoGO — Design System Migration Inventory

Status: preparation / no runtime cutover
Branch: `refactor/professional-v1`

## Purpose

This document is the migration gate for Phase 1, item 4 (Design System). Existing shared UI remains at its current canonical owner until all consumers for a component have been identified and the new owner is ready for a controlled cutover.

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
- Shared visual primitives: currently distributed in `src/components/page-template.js` and `src/components/page-template.css`; future canonical owner is the Design System.

### 2. Current implementation

`page-template.js` still owns `createPacoDropdown()` and the page-template CSS still owns the generic visual tokens, cards, buttons, form controls and file/remove controls.

The current branch does **not** contain a live `design-system.js` owner. The earlier dropdown cutover was reverted to keep the runtime green.

### 3. Shared consumers

The affected primitives are shared by page/feature runtime code and browser/test consumers. The previous attempted dropdown cutover demonstrated that at least one runtime consumer still imported the dropdown from `page-template.js`.

The exact consumer set must be completed from the TEST branch before any runtime ownership change. Default-branch code search is not considered sufficient evidence for this inventory because it does not search the TEST branch reliably.

### 4. Architectural destination

The Design System is the future canonical owner for generic visual primitives. Page Template remains responsible for page composition and shell structure.

### 5. Legacy/local implementation to remove

After each successful cutover, the corresponding implementation must be removed from `page-template.js` / `page-template.css`. No compatibility export remains behind.

### 6. Patchwork check

The migration must not introduce:

- compatibility re-exports;
- fallback imports;
- duplicate runtime implementations;
- bridges between old and new owners;
- page-specific copies;
- temporary redirects or bypasses.

## Migration rule

For each shared UI responsibility:

1. inventory the current owner;
2. inventory every runtime consumer and test consumer;
3. define the future canonical owner;
4. prepare the future owner without changing runtime ownership;
5. migrate all consumers directly;
6. run the full regression;
7. only after green verification remove the old implementation.

No compatibility re-export, fallback, bridge, duplicate runtime implementation, or page-specific workaround is permitted.

## Current inventory

| Responsibility | Current canonical owner | Future canonical owner | Consumer inventory | Status |
|---|---|---|---|---|
| Dropdown | `src/components/page-template.js` | Design System | Incomplete; known runtime dependency remains | Parked |
| Generic buttons | `src/components/page-template.css` | Design System | Not yet complete | Parked |
| Generic cards | `src/components/page-template.css` | Design System | Not yet complete | Parked |
| Form controls | `src/components/page-template.css` | Design System | Not yet complete | Parked |
| File/remove controls | `src/components/page-template.css` | Design System | Not yet complete | Parked |
| Design tokens | `src/components/page-template.css` | Design System | Not yet complete | Parked |

## Known architectural boundary

`src/components/page-template.js` remains the canonical page-shell owner. It may temporarily contain shared visual primitives that have not yet completed their Design System migration. This is an explicit migration state, not a second ownership model.

The Design System must own generic visual primitives. Pages and feature modules should consume those primitives rather than define competing implementations.

## PAB Implementation Plan

The next implementation unit is **not** a runtime cutover. First complete the TEST-branch consumer inventory for the dropdown and generic CSS primitives. Only then perform a direct, single-owner migration for one primitive at a time, with regression verification after each ownership move.

This keeps PacoGO working throughout the migration and avoids building a dormant duplicate implementation.

## Cutover gate

A component may leave its current owner only when:

- all consumers are identified;
- the future owner is implemented and tested;
- all consumers are migrated directly;
- no old-owner import remains;
- full regression is green;
- the old implementation can be removed without a compatibility bridge.

## Current decision

The previous dropdown cutover was reverted because a runtime consumer still depended on the Page Template export. The dropdown therefore remains parked at its current owner until the TEST-branch consumer inventory is complete.
