# PacoGO target architecture

## Current state

The application is currently concentrated in a very large `index.html` containing markup, CSS, application state, feature logic, and Supabase interactions. The current behavior is the source of truth for the refactor.

## Target structure

```text
PacoGO/
├── index.html                 # thin application shell
├── src/
│   ├── app.js                # application bootstrap
│   ├── config/
│   │   └── environment.js
│   ├── core/
│   │   ├── state.js
│   │   ├── router.js
│   │   └── events.js
│   ├── services/
│   │   ├── supabase.js
│   │   ├── auth.js
│   │   └── storage.js
│   ├── components/
│   │   ├── header.js
│   │   ├── sidebar.js
│   │   ├── right-sidebar.js
│   │   ├── modal.js
│   │   └── lesson-card.js
│   ├── features/
│   │   ├── dashboard/
│   │   ├── agenda/
│   │   ├── lessons/
│   │   ├── wordtrainer/
│   │   ├── beheer/
│   │   ├── photo-lessons/
│   │   └── recovery/
│   ├── utils/
│   │   ├── dates.js
│   │   ├── text.js
│   │   └── dom.js
│   └── styles/
│       ├── tokens.css
│       ├── base.css
│       ├── layout.css
│       ├── components.css
│       └── features/
└── supabase/
    └── migrations/
```

## Rules for the new architecture

### 1. Features own their behavior

Agenda logic belongs to `features/agenda`, lesson editor logic to `features/lessons`, and Wordtrainer logic to `features/wordtrainer`.

### 2. Services own external access

Feature modules should not scatter raw Supabase calls throughout UI handlers. Database and Storage access should move behind small service functions.

### 3. Components are reusable

Header, sidebars, cards, dialogs and common controls should have one implementation instead of many near-duplicates.

### 4. CSS has one source of truth

Global dimensions, typography, colors, spacing and common controls belong to shared styles. Feature-specific styling stays with the feature.

### 5. No hidden redesign

The refactor is not an excuse to change PacoGO's UX. Visual or behavioral changes require a separate explicit decision.

### 6. Small migrations

A module is extracted only after its dependencies are understood. Each extraction should leave the application runnable.

### 7. Legacy code remains until verified

Old implementations are not deleted merely because a new module exists. Removal happens only after the replacement is verified.
