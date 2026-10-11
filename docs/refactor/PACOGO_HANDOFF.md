# PacoGO — Persistent Technical Handoff

## Project identity
- Repository: `huisartslasten/PAB`
- Active refactor branch: `refactor/professional-v1`
- LIVE branch: `main` — **never touch**.
- Functional parity baseline: TEST V4.78.
- Authoritative source: `backup-test-v478-before-professional-rewrite/index.html`.
- Authoritative source blob: `de4ebcc75b1b333cc985936c86f7c654c818be24`.
- `legacy/index-v4.78.html` is **not** the parity source.

## Mandatory engineering standard
**Before any implementation, read `docs/engineering/PACOGO_ENGINEERING_STANDARD.md`. Its rules are binding for all PacoGO development.**

The Engineering Standard defines how PacoGO must be built. This handoff defines the current technical state. The two documents have different responsibilities and must both be read when starting a new development chat.

## Non-negotiable rules
1. Preserve V4.78 behavior before improving/designing.
2. No visual redesign during parity work.
3. No Supabase schema changes.
4. Lesson editor remains deterministic; no new AI behavior.
5. Do not blindly patch the giant legacy monolith.
6. A module is not migrated until connected and parity-checked.
7. Runtime wiring only after source behavior and focused tests are proven.
8. Do not modify agenda-import unless explicitly requested.
9. Never claim a full `node --test` pass unless actually executed.
10. Work only on `refactor/professional-v1`.
11. **Patching is not an allowed refactor method.** Do not solve architectural or migration problems by adding local fixes, compatibility shims, duplicated logic, or incremental symptom patches.
12. **Legacy code is not a repair surface.** Modify legacy runtime only as a deliberate final integration/removal step after the replacement boundary is source-verified, focused-tested, and runtime-validated.
13. Every proposed change must identify V4.78 source behavior, architectural responsibility, target module/boundary, contract, and parity test.
14. **Refactor Gate:** classify every change as new/refactored architecture or patch/workaround. If workaround, redesign the boundary instead.
15. If an architectural mismatch, missing seam, or failed assumption is discovered, stop and redesign the boundary rather than patching the symptom.
16. Tests must prove contracts and behavior, not merely make the current implementation green. Do not weaken assertions.
17. **Every meaningful update must follow the permanent Engineering Standard, including the readable TEST-version update and the two-code handoff to the user.**

## Permanent work-run procedure
When the user says `oke`, `oke ga door`, or equivalent, continue through multiple logically connected checkpoints/stages in one workrun. Do not artificially stop after every tiny checkpoint. Stop only at a real technical decision, blocker, or unsafe ambiguity.

## Long-term code quality policy
After every meaningful change, review obsolete or redundant functions, variables, imports/exports, event handlers, UI/CSS, compatibility layers, fallback logic, tests, and documentation. A new implementation actually replaces an old implementation when the old implementation is no longer needed.

## Architecture / safety boundaries
- GitHub contains software: source, tests, docs, checkpoints, Git history.
- Supabase contains application data/backend services.
- Supabase Database and Storage remain separate responsibilities.
- Large user files must not be stored in Git/GitHub.
- Supabase TEST and LIVE remain strictly separated.
- `refactor/professional-v1` and `main` remain strictly separated.

## Checkpoint history
- 241–250: player navigation
- 251–270: completion package
- 271–290: authoritative completion/persistence + runtime boundary
- 291–300: bootstrap seam
- 301–310: runtime/persistence tested
- 311–320: lesson service boundaries
- 321–330: save persistence extracted
- 331–340: `collectItems()` reconstructed
- 341–350: `sort_order` parity fix
- 351–360: editor round-trip
- 361–370: save model/write boundary
- 371–380: `saveLesson()` call-site mapping
- 381–390: validation isolated/tested
- 391–400: dictation spellcheck boundary source-verified/focused-tested
- 401–410: local test-calendar boundary source-verified/focused-tested
- 411–420: post-save outcome source-verified/focused-tested
- 421–430: save coordinator source-verified/focused-tested
- 431–440: parent auth + editor-state adapter source-verified/focused-tested
- 441–450: runtime draft → canonical save model source-verified/focused-tested
- 451–460: save preparation seam source-verified/focused-tested
- 461–470: canonical model → execution request boundary
- 471–480: runtime orchestration seam source-verified/focused-tested
- 481–490: application-effects boundary source-mapped/focused-tested
- 491–500: application integration contract added/focused-tested
- 501–510: application integration payload ownership hardened
- 511–520: ES-module/classic-script runtime bridge corrected; explicit bootstrap/readiness boundary added
- 521–530: runtime dependency ordering hardened; editor fallback and save-request contracts tightened
- 531–540: professional executable gate promoted
- 541–550: controlled Playwright browser-proof boundary added
- 551–560: controlled browser proof closed; legacy V4.78 `saveLesson()` deliberately removed from `index.html`
- 561–570: lesson recovery/delete/archive/restore boundary extracted and legacy implementations removed
- 571–580: guest lesson access boundary extracted and legacy implementation removed
- 581–590: photo-to-lesson creation boundary extracted and legacy removal completed
- 591–600: test-attempt persistence/runtime boundary extracted
- 601–610: lesson-loading runtime boundary extracted
- 611–620: lesson-order service/runtime boundary extracted
- 621–630: player/test-result source audit; canonical test engine aligned to V4.78 grading
- 631–640: exact V4.78 DOM submission boundary extracted and browser-tested
- 641–650: application-facing player runtime entry added
- 651–660: superseded player runtime path removed; player architecture reduced to one application-facing path
- 661–670: player runtime entry integrated into the actual V4.78 application; legacy player ownership deliberately removed after proof
- 671–680: final maintained Node/Vitest/browser regression gate green; professional player refactor closed
- 681–690: professional Agenda source audit, domain/runtime boundaries, import/review separation, application integration, legacy Agenda removal, and final regression gate green
- 691–700: canonical page-template TEST-version ownership added; OEFENEN now receives its readable TEST badge from the shared template
- 701–710: canonical practice pages cleaned of dead submenu controls; Flashcards navigation made explicit; browser contract added for canonical OEFENEN/Flashcards shell
- 711–720: canonical LESSONS page boundary integrated; canonical lesson choice/test/view/questions pages added; grading/audio service boundaries composed; lesson-choice routing no longer falls back to `index.html`; full regression gate green on the resulting TEST head
- 721+: V4.78 lesson-view/questions presentation parity reconstructed at canonical feature boundaries; focused contracts added; full regression gate green on TEST head `3f9d22319b86023c6e1c32abd34f7d6653ff1886`

## Current state — Professional V1 CLOSED
Professional V1 consists of the completed Player and Agenda refactor blocks on `refactor/professional-v1`.

### Professional Player — CLOSED
The professional player runtime is fully integrated.

Canonical modules include:
- `src/features/lessons/test-engine.js`
- `src/features/lessons/player-runtime-entry.js`
- `src/features/lessons/player-runtime-composition.js`
- `src/features/lessons/player-runtime-adapter.js`
- `src/features/lessons/player-submit-boundary.js`
- `src/features/lessons/player-attempt.js`
- `src/features/lessons/player-finish-flow.js`
- `src/features/lessons/player-result.js`
- `src/features/lessons/player-result-view.js`
- `src/features/lessons/player-result-renderer.js`
- `src/features/lessons/player-persistence-model.js`
- `src/features/lessons/player-persistence.js`
- `src/features/lessons/player-screen-boundary.js`
- `src/features/lessons/player-test-view.js`
- `src/features/lessons/player-runtime-bootstrap.js`

The legacy player implementation is no longer the owner of test execution.

### Player validation
- GitHub Actions run `37582525522`
- Node regression: **success**
- Vitest regression: **success**
- Browser regression: **success**
- Validated HEAD at that run: `9836dec5e55cc5a8c4f3af0d2972bfdb2ce1ab28`

### Professional Agenda — CLOSED
The professional Agenda boundary is integrated and replaces legacy Agenda runtime ownership.

Canonical Agenda areas include:
- `src/features/agenda/agenda-domain.js`
- `src/features/agenda/date-normalization.js`
- `src/features/agenda/read-service.js`
- `src/features/agenda/runtime.js`
- `src/features/agenda/runtime-entry.js`
- `src/features/agenda/custom-actions.js`
- `src/features/agenda/custom-storage.js`
- `src/features/agenda/test-calendar.js`
- `src/features/agenda/import-pipeline.js`
- `src/features/agenda/review.js`
- `src/features/agenda/merge.js`
- `src/features/agenda/persistence.js`

The deterministic Agenda read path is separated from AI/media import. Import follows candidate → review → storage and does not become part of deterministic rendering merely because AI produced a candidate.

The V4.78 agenda composition and duplicate semantics were source-verified before integration.

### Agenda validation
- GitHub Actions run `37619910344`
- Job `112787254934` (`agenda-cutover-and-regression`)
- Node regression: **success**
- Vitest regression: **success**
- Browser regression: **success**
- Legacy Agenda runtime removal/bridge verification: **success**

## Current TEST page-template state
- Current readable TEST version: **V5.14**.
- TEST version is owned by `src/components/page-template.js`, not by an individual page or integration script.
- The canonical template renders `PacoGO TEST V5.14` in its hero for every page that mounts the template.
- `src/components/page-template.css` owns the badge presentation.
- Canonical LESSONS, Leskeuze, Toets, Les bekijken and Vragen maken pages mount the same template.
- No per-page TEST-version patch should be added.

## Current lesson-page audit
### Green before the current navigation change
- `refactor/professional-v1` is the active branch.
- `main` remains LIVE and untouched.
- Canonical page-template ownership is intact.
- LESSONS is a canonical `lessons.html` page and uses the shared template.
- LESSONS reads through `app.loadLessons()` and the canonical application lesson mapper/visibility boundary.
- LESSONS routes into canonical `lesson-choice.html` rather than the legacy lesson UI.
- Leskeuze derives available actions from `src/features/lessons/choice.js`.
- Leskeuze routes practice, test, view and questions to canonical page boundaries; it has no `index.html` fallback.
- `test.html` reuses the professional player runtime and application-owned grading/audio services rather than owning a second test engine.
- `lesson-view.html` is a canonical presentation page. Its V4.78 presentation contract is derived through the lessons feature boundary; the page does not perform direct Supabase access.
- `questions.html` is a canonical presentation page. Its question-session behavior is owned by the lessons feature boundary; the page does not perform direct Supabase access.
- Shared HTML escaping is owned by `src/core/html.js`.
- Focused parity tests cover the reconstructed lesson-view presentation contract and question-session progression/shuffle contract.
- Full browser coverage includes the canonical test/view/questions shells.
- Full regression run `e80f2a98146a1cce28ad90342943082cec3b8aff` was green before the current navigation change.

### Current navigation boundary under validation
- `lessons.html` now routes its Dashboard navigation to the canonical `dashboard.html?student=...` page instead of the legacy `index.html` shell.
- This change does not replace or invent Agenda/Tests targets; those remain on their existing routes until their canonical targets are source-verified.
- The current change is intentionally limited to the established canonical Dashboard ownership.

### Runtime/parity boundary
- The V4.78 lesson-view/questions parity boundary is source-verified for the reconstructed contracts covered by the focused tests.
- This does **not** claim unverified parity for interactions that are not represented by the V4.78 source contract or current tests.
- Future parity work must extend the canonical feature boundaries rather than restoring legacy `index.html` ownership or adding page-specific fallbacks.

## Final repository state
- Professional V1 closure was followed by the V5.x canonical page architecture work on `refactor/professional-v1`.
- Current TEST code commit under regression: `3b4aab400e24b35167aa0b8f483abc7bfd044b29`.
- Latest verified green TEST head before the current navigation change: `e80f2a98146a1cce28ad90342943082cec3b8aff`.
- The current navigation change is not considered complete until its regression gate is green.

## Dependency hygiene
- `vitest` is pinned to `5.0.3` in `package.json`.
- The committed lockfile is the reproducibility source for CI installation.
- The latest full regression used the committed lockfile and reported zero known dependency vulnerabilities.

## Safety verification
- `main` / LIVE was not modified by the current work.
- No LIVE Supabase changes were made.
- No Supabase schema changes.
- No new AI behavior was introduced into the deterministic lesson editor.
- No runtime compatibility shim or legacy repair patch was introduced.
- Canonical page migration was implemented at the page-template/application/feature boundaries instead of by adding another legacy route or fallback.

## Closure
**Professional V1 is officially closed.**

The Player and Agenda architecture is integrated. The current V5.x work is a subsequent canonical page architecture stage and must not be represented as unfinished Player/Agenda work.

## New-chat procedure — MANDATORY
At every new chat:

1. Confirm repository: `huisartslasten/PAB`.
2. Confirm branch: `refactor/professional-v1`.
3. Confirm `main` is LIVE and must not be touched.
4. Read `docs/engineering/PACOGO_ENGINEERING_STANDARD.md`.
5. Read this handoff before changing code.
6. Verify the current TEST head and current regression status before any implementation.
