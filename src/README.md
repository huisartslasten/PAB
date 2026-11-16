# PacoGO — professional application structure

This directory is the target architecture for the V4.78+ refactor.

## Rules

- `index.html` remains the current runtime until a replacement module has been verified.
- `legacy/index-v4.78.html` is the immutable fallback copy for this refactor branch.
- No Supabase schema changes are part of the structural refactor unless explicitly required later.
- Feature behavior and visual layout are preserved before improvements are introduced.
- Each migrated feature should be independently testable before the old implementation is removed.

## Target layers

- `core/` — application state, routing, startup and shared contracts.
- `services/` — Supabase/Auth/Storage access; UI code should not contain raw database plumbing.
- `components/` — reusable visual building blocks such as sidebars, banners, cards and modals.
- `features/` — business functionality grouped by domain: lessons, agenda, wordtrainer, photo lessons and management.
- `styles/` — centralized design tokens, layout and component styling.
- `utils/` — pure helpers such as normalization, escaping, dates and formatting.

## Migration strategy

1. Inventory and freeze current behavior.
2. Extract pure utilities.
3. Extract infrastructure/services.
4. Extract reusable UI components.
5. Move one feature at a time behind the same public behavior.
6. Run regression checks after every feature migration.
7. Only then remove the corresponding legacy implementation.
