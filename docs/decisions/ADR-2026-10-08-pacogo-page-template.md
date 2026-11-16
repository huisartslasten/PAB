# ADR: PacoGO canonical page template

- **Status:** Accepted
- **Scope:** `refactor/professional-v1`
- **Date:** 2026-10-08

## Decision

PacoGO introduces one canonical **Page Template** as the default structural shell for normal pages.

The default structure is:

1. full-width PacoGO Aruba hero/banner;
2. page area with a left sidebar;
3. middle field without a right sidebar;
4. a page header at the top of the middle field;
5. page-specific content below the page header.

The template preserves the current PacoGO visual language: Baloo 2 / Nunito typography, current blue/yellow palette, rounded cards, spacing, borders, shadows, and the existing Aruba hero asset.

The template is the **default**, not an absolute constraint. A future page may intentionally use a different structure when its functional or UX requirements justify the deviation.

## Context

The current application contains pages with related but not identical layout structures. The goal is to establish the visual and structural contract first, before migrating existing pages. This prevents page-by-page reinterpretation of the PacoGO design.

## Alternatives considered

### Keep page-specific layouts
Rejected. This preserves the inconsistency the refactor is intended to remove.

### Force every page into one identical layout
Rejected. This would make the template unnecessarily rigid and could harm future UX, especially for interfaces such as games or focused practice modes.

### Canonical default template with deliberate exceptions
Selected. This provides consistency by default while retaining a controlled architectural escape hatch for genuinely different page types.

## Consequences

- New normal pages have a clear default shell.
- Existing pages can be migrated into the shell later without designing the shell during each migration.
- The right sidebar is no longer part of the canonical template.
- Page-specific content remains owned by the page/feature, not by the shell.
- Intentional template deviations must be explicit rather than accidental.
