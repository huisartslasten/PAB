# PacoGO Engineering Standard

**Status:** Permanent and binding
**Applies to:** `refactor/professional-v1` and all future PacoGO development work
**LIVE:** `main` — never modify during normal development

This document defines how PacoGO is developed. It is not a suggestion or a checklist that may be ignored when inconvenient. Future developers, contributors, and AI development chats must follow it.

## 1. Source of truth and startup

Before any implementation:

1. Confirm repository: `huisartslasten/PAB`.
2. Confirm active development branch: `refactor/professional-v1`.
3. Confirm `main` is LIVE and must not be touched.
4. Read `docs/refactor/PACOGO_HANDOFF.md`.
5. Read this document in full when starting a new chat or development session.
6. Inspect the actual repository state before making assumptions.
7. Identify the relevant architectural owner and boundary before coding.

The handoff describes **where PacoGO is**. This document describes **how PacoGO must be built**.

## 2. Branch discipline

- Normal development happens only on `refactor/professional-v1`.
- `main` is LIVE and must never be modified as part of normal development.
- Do not create temporary, backup, test, recovery, or duplicate branches unless there is a documented technical reason and the branch can be removed when its purpose is complete.
- Never force-push or rewrite history as a shortcut.

## 3. Architecture before implementation

For every meaningful feature or architectural change, determine before coding:

- the exact goal;
- the existing behavior or contract;
- the canonical owner;
- the target module or boundary;
- data and runtime flow;
- affected dependencies;
- what must remain unchanged;
- required tests;
- cleanup/removal that will be required.

Do not start by adding code to the most convenient file.

## 4. One canonical owner

Every responsibility must have one clear canonical owner.

Do not create parallel implementations, duplicate services, competing runtime paths, or multiple sources of truth for the same behavior.

When an existing implementation is replaced, the old implementation must be removed once the replacement is proven.

## 5. No patch culture

Patching is not an architectural strategy.

Do not solve structural problems with:

- local symptom fixes;
- compatibility shims;
- duplicated logic;
- hidden fallbacks;
- special-case exceptions;
- temporary code that becomes permanent;
- edits to legacy code merely to make a new path work.

If the boundary is wrong, stop and redesign the boundary.

## 6. Legacy code

Legacy code is not a repair surface.

A legacy implementation may be touched only when it is part of a deliberate, proven integration or removal step. First establish the replacement boundary, prove it with focused tests, validate runtime behavior, and then remove superseded ownership.

Do not blindly patch the legacy monolith.

## 7. Scope discipline

A feature must have a defined scope.

If unrelated problems are discovered during implementation:

- fix them only when they are required for the feature or correctness of the boundary;
- otherwise record them separately and do not silently expand the feature.

Do not let one feature become an uncontrolled refactor.

## 8. Tests are contracts

Tests must prove intended behavior and architectural contracts, not merely make the current implementation green.

- Never weaken an assertion just to pass.
- Add or update tests when behavior changes.
- Preserve regression coverage.
- Run the relevant focused tests before integration.
- Run the full regression gate when required by the change.
- Never claim a test passed unless it was actually executed.

## 9. Mandatory cleanup

After every meaningful change, explicitly review for:

- obsolete functions;
- duplicate logic;
- unused variables;
- unused imports/exports;
- obsolete event handlers;
- obsolete UI/CSS;
- compatibility layers;
- fallback paths;
- stale tests;
- stale documentation.

A new implementation is not considered a replacement while the old implementation is unnecessarily alive.

## 10. Architecture decisions

Important architectural decisions must be recorded as short Architecture Decision Records under `docs/decisions/`.

An ADR should state:

- the decision;
- the context/problem;
- the alternatives considered;
- why the chosen approach was selected;
- important consequences.

Do not create an ADR for trivial UI or implementation details.

## 11. Definition of DONE

A meaningful feature is not DONE merely because it works locally.

DONE means, as applicable:

1. intended behavior implemented;
2. correct architectural owner established;
3. integration completed;
4. relevant tests added/updated and passing;
5. regression checks completed;
6. obsolete implementation removed;
7. cleanup completed;
8. documentation updated where necessary;
9. working tree is clean;
10. CI/security gates required for the change are green;
11. the readable TEST version has been updated and verified;
12. the user has received the two required post-update codes.

## 12. Mandatory readable TEST version

After **every completed update**, the readable TEST version shown in the TEST application must be updated to identify the build the user is actually reviewing.

The version is a communication and verification anchor, not merely cosmetic text.

Before reporting the update as complete:

- update the readable TEST version;
- verify that the new version is actually visible in TEST;
- report the exact TEST version to the user.

Never report an update as complete while the TEST version still identifies an older build.

## 13. Mandatory two-code handoff

After **every completed update**, the developer must provide the user with the two required codes/instructions used in the established PacoGO workflow:

1. **Push code:** the exact command/code needed to push the completed update to the correct GitHub branch (`refactor/professional-v1`).
2. **TEST/site code:** the exact command/code needed to update, refresh, or publish the TEST site/runtime so the user can review the completed build.

These must be given after the update, together with:

- a short summary of what changed;
- the exact readable TEST version now active;
- the tests/regression status;
- confirmation that `main`/LIVE was not modified.

If the update is not actually ready for handoff, do not present the two codes as a completed delivery.

## 14. New-chat protocol

Every new development chat must begin from the repository state, not from memory alone.

Required sequence:

1. Confirm repository and branch.
2. Read `docs/refactor/PACOGO_HANDOFF.md`.
3. Read `docs/engineering/PACOGO_ENGINEERING_STANDARD.md`.
4. Inspect the actual current repository state.
5. Identify the relevant existing owner/boundary.
6. State the implementation plan before making a meaningful architectural change.
7. Build only within these rules.

A new chat must not assume that an earlier chat's description of the codebase is still accurate without checking the repository.

## 15. AI/developer behavior rule

The developer is responsible for protecting the architecture, even when the requested shortcut would be faster.

If a requested approach would introduce a patch, duplicate ownership, architectural debt, or an unsafe boundary, the developer must say so and propose the correct architectural solution instead of silently implementing the shortcut.

The developer must never trade long-term cleanliness for short-term convenience without an explicit architectural decision.

## 16. The core rule

> **PacoGO may never grow faster than we can understand and maintain it.**

The goal is not merely a working application. The goal is a codebase that remains understandable, testable, reproducible, and safe to extend months and years from now.
