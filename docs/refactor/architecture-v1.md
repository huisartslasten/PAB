# PacoGO professional refactor — architecture V1

## Current state

V4.78 is a working monolith: `index.html` contains the application markup, a large CSS layer and the majority of the application JavaScript. The repository also contains standalone photo-upload/storage code and Supabase migrations.

## Target state

```text
PacoGO/
├── index.html                 # thin application shell
├── src/
│   ├── core/                  # state, startup, routing/contracts
│   ├── services/              # Supabase/Auth/Storage/data boundaries
│   ├── components/            # reusable UI
│   ├── features/
│   │   ├── lessons/           # lesson list/editor/player
│   │   ├── agenda/            # agenda/import/calendar
│   │   ├── wordtrainer/       # practice/evaluation
│   │   ├── photo-lessons/     # photo -> lesson
│   │   └── management/        # parent/admin/recovery
│   ├── styles/                # design system and feature CSS
│   └── utils/                 # pure helpers
├── assets/
├── legacy/                    # temporary migration fallback
└── supabase/migrations/       # database schema history
```

## Boundaries

### Core
Owns navigation/application state. It must not contain feature-specific database queries.

### Services
Own all direct Supabase calls. Features call service methods such as `listAll()`, `updateLesson()`, `archive()` and `restore()` instead of constructing queries throughout UI handlers.

### Components
Own reusable visual patterns: Paco banners, LB/MV/RB/BB shell, buttons, lesson cards, sidebars and modals.

### Features
Own domain behavior. A change to Wordtrainer should not require editing agenda code; a change to agenda import should not require editing lesson-editor internals.

### Styles
Own design tokens and layout rules. Repeated V4.x override blocks should gradually be consolidated here after visual regression checks.

## Migration policy

The refactor is additive first. The V4.78 runtime remains the reference implementation until each migrated area passes its regression checklist. A module is not considered migrated merely because a new file exists; the old behavior must be replaced by the module and verified.

No database tables are renamed or removed as part of this structural work.
