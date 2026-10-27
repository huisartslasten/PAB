# PacoGO — Design System Migration Inventory

Status: preparation / no runtime cutover
Branch: `refactor/professional-v1`

## Purpose

This document is the migration gate for Phase 1, item 4 (Design System). Existing shared UI remains at its current canonical owner until all consumers for a component have been identified and the new owner is ready for a controlled cutover.

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
| Dropdown | `src/components/page-template.js` | Design System | Not yet complete | Parked |
| Generic buttons | `src/components/page-template.css` | Design System | Not yet complete | Parked |
| Generic cards | `src/components/page-template.css` | Design System | Not yet complete | Parked |
| Form controls | `src/components/page-template.css` | Design System | Not yet complete | Parked |
| File/remove controls | `src/components/page-template.css` | Design System | Not yet complete | Parked |
| Design tokens | `src/components/page-template.css` | Design System | Not yet complete | Parked |

## Known architectural boundary

`src/components/page-template.js` remains the canonical page-shell owner. It may temporarily contain shared visual primitives that have not yet completed their Design System migration. This is an explicit migration state, not a second ownership model.

The Design System must own generic visual primitives. Pages and feature modules should consume those primitives rather than define competing implementations.

## Cutover gate

A component may leave its current owner only when:

- all consumers are identified;
- the future owner is implemented and tested;
- all consumers are migrated directly;
- no old-owner import remains;
- full regression is green;
- the old implementation can be removed without a compatibility bridge.

## Current decision

The previous dropdown cutover was reverted because a runtime consumer still depended on the Page Template export. The dropdown therefore remains parked at its current owner until the consumer inventory is complete.
