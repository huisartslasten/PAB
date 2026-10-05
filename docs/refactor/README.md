# PacoGO Professional Refactor

## Safety rules

- LIVE/main is untouched.
- The exact working TEST V4.78 state is preserved in `backup-test-v478-before-professional-rewrite`.
- This refactor is developed on `refactor/professional-v1`.
- Existing functionality is the specification. Refactoring must not silently redesign behavior.
- Database migrations are not changed as part of the structural refactor unless a concrete dependency requires it.

## Goal

Transform the current monolithic PacoGO front end into a maintainable modular application while preserving the existing UI, routes/views, lesson behavior, agenda behavior, authentication, Supabase data flows, storage/photo functionality, and other existing features.

## Migration strategy

1. Inventory the current application.
2. Establish stable shared configuration and design tokens.
3. Extract services and utilities without changing behavior.
4. Extract reusable UI components.
5. Extract feature modules one domain at a time.
6. Introduce a modular application entry point.
7. Run regression checks against the V4.78 behavior.
8. Only after verification, promote the refactor into TEST.

## Important

The original `index.html` is intentionally retained during the migration. It is the fallback implementation until the modular version has been verified.
