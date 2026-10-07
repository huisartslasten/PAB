# PacoGO — Checkpoint 651–660

## Player runtime architecture
- Active branch: `refactor/professional-v1`.
- `main` / LIVE untouched.
- V4.78 remains the behavioral baseline.
- Superseded player runtime/bootstrap modules were removed because they represented a parallel runtime rather than the application-facing player boundary.
- The player entry is the intended application orchestration seam: start → render → DOM submit → next render or finish.

## Current gate
The application-facing player runtime entry must own orchestration only. Grading remains in `test-engine`, DOM extraction in `player-submit-boundary`, and persistence/result sequencing in the existing finish flow.

## Validation
The existing browser proof predates the latest runtime-entry work. No new CI result has yet been established for the latest commits, so this checkpoint does not claim green CI.

## Rule
Do not wire the professional player into legacy V4.78 until the entry contract is focused-tested and browser-proven.
