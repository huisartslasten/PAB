# PacoGO professional refactor — checkpoint

## Baseline
- Reference runtime: TEST V4.78
- LIVE/main is outside this refactor
- Immutable fallback: `legacy/index-v4.78.html`

## Five completed structural steps
1. Architecture cleanup: duplicate sidebar implementation removed; `src/components/sidebar.js` is the extracted sidebar component.
2. Lesson boundary: lesson mapping separated from rendering in `src/features/lessons/lesson-mapper.js`.
3. Agenda boundary: deterministic normalization, matching and date helpers in `src/features/agenda/agenda-domain.js`.
4. Wordtrainer boundary: deterministic evaluation in `src/features/wordtrainer/evaluator.js`; no AI behavior added.
5. Photo lesson boundary + composition root: photo session state isolated and `src/app/bootstrap.js` composes services without changing the legacy runtime.

## Safety gate
These modules are additive and are not automatically mounted into V4.78. The working site therefore remains behaviorally protected while parity testing proceeds.

## Next gate
Wire one feature at a time, compare against V4.78, then remove its legacy implementation. No Supabase schema change is part of this structural refactor.
