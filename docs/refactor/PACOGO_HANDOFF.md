# PacoGO — Persistent Technical Handoff

## Project identity
- Repository: `huisartslasten/PAB`
- Active refactor branch: `refactor/professional-v1`
- LIVE branch: `main` — **never touch**.
- Functional parity baseline: TEST V4.78.
- Authoritative source: `backup-test-v478-before-professional-rewrite/index.html`.
- Authoritative source blob: `de4ebcc75b1b333cc985936c86f7c654c818be24`.
- `legacy/index-v4.78.html` is **not** the parity source.

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
11. **Patching is not an allowed refactor method.** Do not solve architectural or migration problems by adding local fixes, exceptions, compatibility shims, duplicated logic, or incremental edits to make the current structure merely work.
12. **Legacy code is not a repair surface.** Do not modify `index.html` or other legacy runtime code to compensate for an incomplete refactor. Legacy changes are permitted only as a deliberate, final integration/removal step after the replacement boundary has been source-verified, focused-tested, and runtime-validated.
13. Every proposed change must first identify its V4.78 source behavior, architectural responsibility, target module/boundary, contract, and parity test. If that cannot be stated clearly, stop before coding.
14. **Refactor Gate:** before implementation, explicitly classify the change as either (a) new/refactored architecture or (b) patch/workaround. If it is (b), do not implement it; redesign the affected boundary instead.
15. If an architectural mismatch, missing seam, or failed assumption is discovered, **stop and redesign the boundary** rather than patching the symptom. A blocked step is preferable to a workaround.
16. Tests must prove contracts and behavior, not merely make the current implementation green. Do not weaken assertions or broaden accepted outcomes just to accommodate an uncertain implementation.

## Long-term code quality and architecture policy
PacoGO must not only be professionally structured during the current refactor, but also remain structurally maintainable and consistent over the long term.

After every meaningful change, functional correctness must be checked together with whether obsolete or redundant parts left behind by earlier implementations are still present. This includes functions, variables, imports, exports, event handlers, UI/CSS, compatibility layers, fallback logic, tests, and documentation.

The principle is:

**A new implementation actually replaces an old implementation when the old implementation is no longer needed.**

For successive changes X → Y → Z, completion means not only establishing that Z works correctly, but also removing obsolete parts of X and Y where they are no longer required.

PacoGO should also periodically receive a broader architecture and codebase review to detect architectural drift early. This may include checking for:
- duplicate implementations;
- unused code and dependencies;
- obsolete code paths;
- modules that are too large or have too broad a responsibility;
- unclear module boundaries;
- unwanted dependencies;
- outdated tests and documentation;
- inconsistencies in UI/CSS;
- compliance with GitHub/Supabase separation;
- compliance with TEST/LIVE separation.

The long-term goal is that a future major refactor should ideally not require reconstruction of the entire application, but instead be a targeted architecture review with focused improvements to individual components where needed.

**This is a long-term principle and will be refined further later. It does not change or redesign the current refactor procedure at this time.**

## Architecture / safety boundaries
- **GitHub and Supabase are strictly separated responsibilities.**
- GitHub contains the software: source code, tests, documentation, checkpoints, and Git history.
- Supabase contains application data and backend services.
- Within Supabase, **Database and Storage remain strictly separated**:
  - Database = structured data, relationships, lessons, results, agenda data, and other relational/application records.
  - Storage = user files such as photos, videos, audio, and other binary files.
- Large user files must not be stored in Git/GitHub.
- **Supabase TEST and Supabase LIVE must remain strictly separated**, just as `refactor/professional-v1` and `main` remain separated.
- The refactor must not break, blur, or implicitly mix these boundaries.

## Save-flow architecture
The professional lesson-save path is now composed of explicit boundaries for editor row collection, editor round-trip, save model normalization, validation, dictation-only spelling checking, local test-calendar synchronization, deterministic persistence, post-persistence outcome resolution, runtime authorization/editor extraction, runtime preparation, execution request construction, runtime orchestration, application effects, runtime integration, runtime entry, and browser bootstrap.

The classic-script runtime bridge exposes the V4.78 application dependencies without moving production data ownership into the modules. The runtime facade is explicit and has no timeout, fallback to legacy save, or duplicate execution.

The browser-proof fixture uses isolated test doubles and never connects to real Supabase application data.

## Save flow parity contract
The proven V4.78 save flow is:
1. parent authorization
2. editor draft extraction
3. collect editor items
4. validation
5. dictation spelling check when applicable
6. persistence
7. persistence error → `Opslaan mislukt: ...` and stop
8. success → `currentSubject`, clear `currentLesson`, reload lessons
9. resolve saved lesson and add/update/remove local test-calendar entry from `testDate`
10. refresh test calendar/sidebar
11. success message

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
- 461–470: canonical model → execution request boundary; test source added but not executed
- 471–480: runtime orchestration seam source-verified/focused-tested; 5 passed/0 failed isolated harness
- 481–490: application-effects boundary source-mapped/focused-tested; 4 passed/0 failed isolated harness
- 491–500: application integration contract added/focused-tested; 4 passed/0 failed isolated harness
- 501–510: application integration payload ownership hardened; isolated harness 2 passed/0 failed
- 511–520: ES-module/classic-script runtime bridge corrected; explicit bootstrap/readiness boundary added; save invocation timing source-verified; synchronous runtime facade added; source-level seam guard added; browser execution still pending
- 521–530: runtime dependency ordering hardened; DOM/DB dependencies deferred past authorization; editor answer fallback corrected; save-request input contract tightened; focused professional gate executed at 70 passed/0 failed; browser execution still pending
- 531–540: standalone `lesson-write-service` contract promoted into the professional executable gate; GitHub Actions executed **76 passed / 0 failed / 0 skipped**; no production patch or weakened assertion; browser execution still pending
- 541–550: controlled Playwright browser-proof boundary added; first fixture run failed during initialization; production code was not patched; fixture boundary was corrected
- 551–560: **controlled browser proof closed and legacy V4.78 `saveLesson()` deliberately removed from `index.html`**; source-contract guard added; one-time removal gate succeeded; migration workflow removed immediately

## Current state
The browser-runtime validation gate is closed and the legacy monolithic `saveLesson()` implementation has now been removed from `index.html` on `refactor/professional-v1`.

The proven public save entry is now exclusively:

**classic `window.saveLesson` facade → single bootstrap readiness promise → installed runtime entry → explicit V4.78 bridge → authorization → editor DOM extraction → deterministic item collection → validation → write service → reload/outcome → calendar/sidebar/message effects.**

The post-removal `index.html` blob is `5ddbef244116b844f0089e3d392f7024f5f90624`.

A source-contract test in `test/lesson-save-runtime-source-contract.test.js` now fails if `index.html` ever regains either `async function saveLesson()` or `function saveLesson()`.

The one-time removal workflow succeeded as run `37504724654` and was then deleted. It is not part of the permanent runtime architecture.

### Validation status
- Pre-removal professional Node gate: **76 passed / 0 failed / 0 skipped**.
- Controlled browser proof before removal: **success**, run `37496386784`.
- One-time legacy removal gate: **success**, run `37504724654`.
- Post-removal professional Node gate: **must be green on the post-removal documentation commit before this checkpoint is considered fully closed**.
- Post-removal browser proof: **must be green on the post-removal documentation commit before this checkpoint is considered fully closed**.

The first browser attempt failed at fixture runtime initialization. The fixture was corrected at its own boundary and the second run passed. The legacy removal was then performed only after that browser proof existed. No production fallback or patch was introduced.

## Next gate
Once the post-removal Node gate and browser proof are green, inspect the next remaining legacy-runtime ownership boundary. Do not perform unrelated cleanup, visual redesign, schema changes, agenda-import changes, or new lesson-editor AI work.

If the next source audit exposes an architectural mismatch, stop and redesign the boundary rather than patching the legacy monolith.

## Safety
- `main`/LIVE untouched.
- No Supabase schema changes.
- No real Supabase data access from the browser proof.
- No agenda-import changes.
- No lesson-editor AI behavior added.
- No visual redesign.

## New-chat procedure
At every new chat: confirm repo/branch, read this handoff and latest checkpoint, inspect actual repository state, compare relevant behavior against authoritative V4.78, continue from the current gate, never touch `main`, and only claim tests that were actually executed. At checkpoint completion update both this handoff and `docs/refactor/step-X-Y.md`; keep historical checkpoint files.
