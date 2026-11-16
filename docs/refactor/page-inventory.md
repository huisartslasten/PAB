# PacoGO — complete page inventory

Branch: `refactor/professional-v1`
Repository: `huisartslasten/PAB`

This inventory covers every root-level HTML page in the refactor branch. The route registry is the canonical runtime mapping; the page shell is owned by `src/components/page-template.js` for registered app routes.

## Ownership model

- **Page Template** owns the shared page shell/composition.
- **Feature runtimes/modules** own page behavior and domain logic.
- **Design System** owns generic visual primitives/tokens.
- **Domain components** keep domain-specific composition such as lesson tiles, activity cards, student cards, editors, calendars and game boards.
- **Legacy pages are not patched into the new architecture.** They are candidates for removal or later rebuild after reference/dependency checks.

## Complete page matrix

| Page | Runtime / owner | Template | Route CSS | Status |
|---|---|---|---|---|
| `index.html` | entry redirect | none; redirects to auth | none | Entry only |
| `auth.html` | auth runtime | Page Template mounted explicitly | inline auth styling | Active auth entry |
| `dashboard.html` | dashboard runtime | Page Template | `dashboard.css` | Active |
| `lessons.html` | lessons runtime | Page Template | `lesson-list.css` | Active |
| `lesson-choice.html` | lesson choice runtime | Page Template | `lesson-context-view.css`, `lesson-choice.css` | Active |
| `lesson-view.html` | lesson view runtime | Page Template | `lesson-view.css` | Active |
| `lesson-learning.html` | lesson learning runtime | Page Template | `lesson-learning-view.css` | Active |
| `learning-material.html` | learning material view runtime | Page Template | `lesson-learning-view.css` | Active |
| `questions.html` | questions runtime | Page Template | `questions.css` | Active |
| `test.html` | test runtime | Page Template | `lesson-context-view.css`, `practice-page.css`, `test.css` | Active |
| `lesson-editor.html` | lesson editor runtime | Page Template | `lesson-editor.css` | Active |
| `learning-material-editor.html` | learning material editor runtime | Page Template | `lesson-editor.css`, `learning-material/editor.css` | Active |
| `oefenen.html` | practice menu runtime | Page Template | `lesson-context-view.css`, `practice-menu.css` | Active |
| `oefentoets.html` | practice test runtime | Page Template | `lesson-context-view.css`, `practice-page.css` | Active |
| `games.html` | games runtime | Page Template | `lesson-context-view.css`, `games.css` | Active |
| `skills.html` | skills runtime | Page Template | none | Active |
| `double-or-nothing.html` | game page runtime | Page Template | shared lesson/practice CSS + game CSS | Active |
| `millionaire.html` | game page runtime | Page Template | shared lesson/practice CSS + game CSS | Active |
| `memory.html` | game page runtime | Page Template | shared lesson/practice CSS + game CSS | Active |
| `flash-question.html` | flash game runtime | Page Template | shared lesson/practice CSS + flash CSS | Active |
| `tic-tac-toe.html` | tic-tac-toe runtime | Page Template | shared lesson/practice CSS + tic-tac-toe CSS | Active |
| `drop4.html` | Drop4 runtime | Page Template | shared lesson/practice CSS + Drop4 CSS | Active |
| `connect-the-dots.html` | Connect-the-Dots runtime | Page Template | shared lesson/practice CSS + game CSS | Active |
| `word-reveal.html` | Word Reveal runtime | Page Template | shared lesson/practice CSS + game CSS | Active |
| `word-chase.html` | Word Chase runtime | Page Template | shared lesson/practice CSS + game CSS | Active |
| `lexo.html` | Lexo runtime | Page Template | shared lesson/practice CSS + game CSS | Active |
| `flashcards-template.html` | Flashcards runtime | Page Template | shared lesson CSS + flashcards CSS | Active |
| `agenda.html` | Agenda runtime | Page Template | `agenda.css` | Active |
| `month-calendar.html` | Month Calendar runtime | Page Template | `month-calendar.css` | Active |
| `test-history.html` | Test History runtime | Page Template | `management-support.css` | Active |
| `management.html` | Management runtime | Page Template | `management-support.css` | Canonical management |
| `challenge-settings.html` | Challenge configuration runtime | Page Template | `management-support.css`, `challenge-configuration.css` | Active management feature |
| `skill-create.html` | Skill creation runtime | Page Template | `management-support.css` | Active management feature |
| `skill-editor.html` | Skill editor runtime | Page Template | `management-support.css` | Active management feature |
| `archive.html` | Archive runtime | Page Template | `management-support.css` | Active management feature |
| `feedback.html` | Feedback runtime | Page Template | `management-support.css` | **Legacy — later remove/rebuild** |
| `creator.html` | Creator runtime | Page Template | `management-support.css`, `creator.css` | Active auxiliary management |
| `photo-phone.html` | standalone legacy page | none | inline CSS | **Legacy — rebuild later** |
| `photo-upload.html` | standalone legacy page | none | inline CSS / old upload endpoint | **Legacy — rebuild later** |

## Page groups

### Core learning flow

`dashboard.html` → `lessons.html` → `lesson-choice.html` → `lesson-view.html` / `lesson-learning.html` → `questions.html` / `test.html` → result handling inside the lesson runtime.

### Learning material

`learning-material.html` and `learning-material-editor.html` are owned by the learning-material feature; they use the shared Page Template rather than a local page shell.

### Practice and games

`oefenen.html`, `oefentoets.html`, `games.html`, `skills.html` and all individual game pages are registered in `src/app/routes.js` and use the shared Page Template. Game-specific CSS remains feature-owned.

### Agenda

`agenda.html` owns the agenda page composition; agenda import/review behavior is part of the agenda feature rather than a separate root HTML page. `month-calendar.html` is the separate calendar view.

### Management

`management.html` is the canonical management page. Student switching, lesson management, archive/recovery and related management tools are feature-owned. There is **no separate root-level HTML page named as a second "beheer console"** in the current refactor tree.

`challenge-settings.html`, `skill-create.html`, `skill-editor.html`, `archive.html`, `test-history.html` and `creator.html` are separate registered management routes, not copies of the management shell.

### Legacy / rebuild candidates

- `feedback.html`: explicitly retained in the current route registry but designated by the project decision as old functionality to discard and rebuild later.
- `photo-phone.html`: standalone legacy implementation; do not patch/migrate into Page Template.
- `photo-upload.html`: standalone legacy implementation using an old upload endpoint; do not patch/migrate into Page Template.
- `tools/*v453-v476*.sh`: separate legacy tooling signals; not page implementations and not removed as part of this inventory.

## Architecture gate result

The page inventory is now complete at the root HTML/runtime level:

- 39 root-level HTML pages identified.
- 35 are registered application routes.
- `index.html` is the entry redirect.
- `auth.html` is the explicit authentication entry and mounts the shared Page Template.
- 2 standalone photo pages are legacy/rebuild candidates.
- `feedback.html` is a registered legacy/rebuild candidate.
- No second dedicated beheer-console HTML page was found.

No page-specific workaround, fallback, duplicate runtime or second page shell is introduced by this inventory.
