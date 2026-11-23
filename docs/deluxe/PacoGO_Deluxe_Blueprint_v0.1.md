# PacoGO Deluxe — Technical Blueprint v0.1

**Status:** Working architecture baseline — ready for review, not an implementation authorization  
**Date:** 23 November 2026  
**Repository:** `huisartslasten/PAB`  
**Development branch:** `refactor/professional-v1`  
**LIVE:** `main` — must remain untouched

---

## 1. Purpose

PacoGO Deluxe is the next experience layer of the existing PacoGO platform. It is not a replacement application, a separate learning platform, or a collection of unrelated games.

**PacoGO is the platform and the engines. Worlds, stories, quests, games and learner experiences run on top of it.**

The platform must support learning, practice, assessment, games, interactive objects, stories and a navigable digital world while preserving the existing PacoGO application and its data.

The learner, Paco and the world may evolve over time. The underlying learning content, curriculum logic and learner evidence must not need to be rebuilt when the presentation changes.

## 2. Binding design principles

1. **CONTENT != PRESENTATION != ENGINE.** Content describes what is learned or experienced; presentation describes how it is shown; engines own behavior and rules.
2. **One canonical owner.** Every responsibility has one authoritative module and one source of truth.
3. **Reuse before creation.** Existing PacoGO modules and contracts are inspected and reused where they already own the responsibility.
4. **Additive integration.** Deluxe is introduced alongside existing functionality. No big-bang replacement.
5. **Curriculum integrity.** Existing SLO goals, curriculum registry, claims, tasks, evidence targets, mastery rules and learner state are not redefined by Deluxe.
6. **Learner identity continuity.** Reuse existing accounts, student identities and learner-profile links. Do not create a parallel identity system.
7. **Experience is not age.** Age may be contextual information, but does not automatically select or force a presentation profile.
8. **Configurable, versioned definitions.** World, story, quest, interaction and experience definitions must be data/configuration-driven where appropriate, with explicit schema versions and validation.
9. **Testable boundaries.** Engine contracts and cross-engine flows must be testable independently of visual rendering.
10. **No speculative infrastructure.** Do not build all future engines or database tables in advance. Design extension points now; implement only what the first vertical slice needs.

## 3. Repository audit — verified starting point

The following findings were checked against the selected DEV branch.

### 3.1 Branch and repository

- Repository: `huisartslasten/PAB`
- DEV: `refactor/professional-v1`
- DEV HEAD at audit: `9019c5de85febc09e88493c26a5a91b7f9c2b67e`
- HEAD commit date: 23 November 2026
- LIVE `main` HEAD at audit: `9ddb18aaafec265f2239bb68b05723468c5607f9`
- GitHub compare reports DEV 1,873 commits ahead and 17 behind main, with diverged history.

**Branch rule:** do not merge, rebase, reset or force-push as part of this Blueprint work. The selected DEV branch remains the working base. The divergence must be understood before any future synchronization with LIVE.

No code, database, branch or workflow was changed during the audit. No full regression was run. The combined commit-status endpoint returned no status entries, so this audit does not claim CI is green.

### 3.2 Existing application architecture

The repository already has these established layers:

- `src/core/` — application state, routing, auth, app context, student registry and shared runtime concerns.
- `src/services/` — Supabase and domain service boundaries.
- `src/components/` — shared page shell, navigation, design-system primitives and reusable UI.
- `src/features/` — domain features including lessons, practice, challenges, curriculum, learning material, agenda, management and others.
- `pacogo-engine/` — curriculum/evidence/development/mastery/decision engine modules and Learning Interface controllers.
- `supabase/migrations/` — existing schema history.
- `docs/curriculum/`, `docs/refactor/`, `docs/engineering/` and `docs/decisions/` — existing documentation owners.

The root `index.html` redirects to `auth.html`. `src/README.md` identifies the professional application structure as the target architecture and describes an additive, feature-by-feature migration strategy.

### 3.3 Existing canonical owners — do not duplicate

| Responsibility | Existing owner | Boundary |
|---|---|---|
| Application state, startup and routing | `src/core/` | Platform/application runtime |
| Student roster identity | `src/core/student-registry.js` and existing learner-link service | Existing identity |
| Supabase client selection | `src/services/supabase-client.js` | Existing TEST/LIVE project configuration |
| Lesson content and lesson workflows | `src/features/lessons/` | Existing lesson domain |
| Learning-material elements | `src/features/learning-material/element-registry.js` | Existing text/image learning-material elements |
| Practice game catalogue | `src/services/game-catalog.js` | Canonical game definitions |
| Practice mode facade | `src/features/practice/practice-domain.js` | Delegates game catalogue ownership; not a second registry |
| Shared practice question cycle | `src/features/practice/question-session.js` | Question sequencing |
| Practice game shell candidate | `src/features/practice/practice-game-template.js` | Existing shared practice layout; adoption/consumer coverage needs a separate audit |
| Challenge definitions | `src/features/challenges/challenge-registry.js` | Separate challenge domain; currently includes Millionaire |
| Challenge difficulty | `src/features/challenges/challenge-difficulty.js` | Challenge difficulty policy |
| Curriculum execution | `pacogo-engine/curriculum-registry.js` and related engine modules | Curriculum evidence, inference, mastery and next action |
| Curriculum persistence | Existing curriculum services and Supabase schema | Existing learner evidence/state |
| Generic visual primitives | `src/components/design-system.js` | UI primitives, not world/game domain layout |
| Generic Paco page shell | `src/components/page-template.js` | Application page structure, not world scenes |

Important clarification: `src/features/lessons/learning-experience-registry.js` describes lesson content kinds and available practice modes. It is **not** the proposed Deluxe Experience Profile registry or Experience Engine.

### 3.4 Existing game catalogue

`src/services/game-catalog.js` is the canonical game catalogue and currently defines **10 active games**. The older refactor handoff says nine; that count is stale and must be corrected when that handoff is next updated.

Do not create another game catalogue inside Deluxe. Deluxe may launch or host a game, but game identity and metadata remain owned by the existing catalogue unless a future Architecture Gate explicitly changes that boundary.

### 3.5 Existing curriculum and learning system

The curriculum engine already owns the chain:

`curriculum → skill → development → claim → task → learner performance → evidence → evidence assessment → inference → mastery → next action → learner state → validation`

The current curriculum specification and registry are candidate technical infrastructure. Technical execution is not empirical validation.

Deluxe must call the existing curriculum/learning boundaries when a world, story or game activity is a curriculum task. It must not implement its own mastery, curriculum progression, evidence interpretation or SLO mapping.

The existing exercise-build protocol remains authoritative for new curriculum exercises. Deluxe does not bypass it.

### 3.6 Existing persistence

The repository contains existing migrations for lesson content, games and game results, game access/unlocks, curriculum registry versions, student evidence, longitudinal state and learner-profile links.

The existing Supabase client selects the configured TEST project for non-LIVE hosts and the configured LIVE project for the production host.

**No new Supabase project, schema migration, data conversion or automatic student-data migration is part of the initial Deluxe foundation.** Repository migrations do not, by themselves, prove which migrations are currently applied to either hosted database; that requires a separate read-only environment check before any database operation.

### 3.7 Deluxe capabilities not found in the audited feature structure

No dedicated Deluxe feature owner was found for:

- World / location / scene model and runtime
- Generic object interaction system
- Story model and story progression
- Quest definitions and objective progression
- Learner Experience Profiles and profile selection
- Cross-domain Deluxe event contracts

These are legitimate new architecture areas. They must be added without taking over existing lesson, curriculum, game-catalogue, challenge, identity or persistence responsibilities.

---

## 4. Target conceptual architecture

The target is a coordinated set of bounded systems, not one giant engine.

```text
                         PACOGO PLATFORM
                               |
        +----------------------+----------------------+
        |                      |                      |
   EXISTING CORE          EXISTING LEARNING       DELUXE EXPERIENCE
   identity/auth          lessons/content         orchestration
   routing/state          curriculum engine       experience profiles
   shared services        practice/games           world/scenes
        |                      |                   interaction
        |                      |                   story/quests
        +----------------------+----------------------+
                               |
                       SHARED CONTRACTS
              content / activity / interaction / event
                   presentation / result / progress
                               |
                      PERSISTENCE BOUNDARIES
                 existing Supabase + future additions
                  only after contracts are proven
```

### 4.1 Existing Core — remains authoritative

Owns application startup, authentication, learner identity, navigation, shared application state and established service access.

Deluxe consumes these capabilities. It does not create a second app shell, auth system, student registry or database client.

### 4.2 Learning Engine — reuse existing learning owners

The phrase “Learning Engine” in Deluxe describes the learner-facing orchestration of learning activities, not a replacement curriculum engine.

Responsibilities:
- resolve a learning activity and its content/task contract;
- start a practice or assessment session through the correct existing owner;
- pass responses to the correct controller/runtime;
- return the result in a stable result contract;
- allow the existing curriculum engine to process curriculum observations where applicable.

It does not own SLO definitions, mastery thresholds, evidence inference or curriculum learner state.

### 4.3 Interaction Engine — generic interaction contract

Owns reusable interaction mechanics that can be used by scenes, objects, story nodes, quests and activities.

Initial interaction families may include:
- activate/select;
- inspect/examine;
- drag/drop;
- use/combine;
- collect;
- choose/respond;
- open a dialogue;
- launch an activity.

The engine defines interaction lifecycle and emits typed outcomes/events. It does not own the domain rules of a specific game, curriculum correctness or story meaning.

### 4.4 World Model and World Runtime

The World Model defines:
- worlds;
- locations;
- scenes;
- scene entities;
- characters;
- objects;
- scene entry/exit and availability conditions.

A scene is a place/context. It is not a story chapter or a quest.

The runtime loads and presents a scene from a definition and the current learner/world state. A 2D/2.5D presentation is the initial visual direction; the data model must not depend on one rendering library or one visual style.

### 4.5 Story Engine

Owns narrative structure and progression:
- story;
- chapter/sequence;
- story beat;
- dialogue node;
- narrative choice;
- story conditions and consequences.

A story can reference a world location or scene, but it does not own that scene. A story can start a quest or learning activity, but it does not implement their mechanics.

### 4.6 Quest Engine

Owns mission/objective progression:
- quest definition;
- objective definitions;
- prerequisites;
- activation conditions;
- completion conditions;
- reward references;
- current quest state.

A quest can request an interaction or launch a learning activity. It must not duplicate the learning task or determine curriculum mastery itself.

### 4.7 Game Engine and Game Registry

The existing `src/services/game-catalog.js` remains the canonical game catalogue. Existing game runtimes continue to own unique mechanics, scoring, turns and win conditions.

Deluxe may provide a world/quest context for launching a game and receiving its result. It must not create a parallel game ID namespace or duplicate existing game definitions.

The existing Practice Game Template and game runtimes require their own later integration audit. That work is not a prerequisite for inventing a second game catalogue.

### 4.8 Progress Engine — two distinct progress domains

Keep two kinds of progress separate:

**Learning progress**
- curriculum evidence;
- development/inference;
- mastery;
- next learning action;
- learner curriculum state.

This remains with `pacogo-engine/` and its existing persistence services.

**Experience progress**
- visited scenes;
- collected objects;
- story position;
- quest/objective status;
- game participation;
- experience rewards and achievements.

Deluxe may own experience progress, but it must not reinterpret it as academic mastery. A reward, completed quest or game score is not proof of a curriculum claim.

### 4.9 Event Engine — typed communication, not a second database

Defines versioned events through which bounded modules communicate.

An event contract should carry, where applicable:
- event type and schema version;
- event ID;
- actor/learner reference;
- source module;
- timestamp;
- world/scene/story/quest/activity context;
- typed payload.

Examples:
- `scene.entered`
- `object.inspected`
- `interaction.completed`
- `quest.activated`
- `quest.objective.completed`
- `activity.started`
- `activity.completed`
- `game.completed`
- `story.choice.selected`

Events are communication facts, not automatic commands. Consumers decide whether an event is relevant to their own state. Event persistence, retries and delivery guarantees are later design decisions; do not introduce a global event database in the first prototype.

### 4.10 Experience Engine and Experience Profiles

Owns presentation preferences and experience configuration, such as:
- visual theme and density;
- Paco visibility/prominence;
- animation intensity;
- story/adventure intensity;
- amount of game-like framing;
- interface complexity;
- tone and feedback presentation;
- progress/reward presentation.

A profile is a presentation configuration, not a learner identity, curriculum level or ability estimate.

Selection principles:
- learner preference is explicit and changeable;
- age may inform suggestions but never forces a profile;
- a learner can switch profiles without losing lessons, progress, evidence or world state;
- the same activity and learning rules remain available across profiles;
- the Experience Engine cannot change answer correctness, evidence requirements or mastery rules.

---

## 5. Canonical domain model — conceptual contracts

The following objects describe boundaries, not a final database schema.

| Object | Meaning | Canonical owner |
|---|---|---|
| Content Definition | The learning/experience material itself | Existing content owner or a future explicit content contract |
| Activity Definition | A reusable thing the learner is asked to do | Learning/practice domain |
| Task Model / Task Instance | Curriculum task definition and concrete instance | Existing curriculum engine/contracts |
| Interaction Definition | How a user interacts with an object/activity | Interaction Engine |
| Presentation Definition | How an activity or scene is rendered | Experience/presentation layer |
| World Definition | A navigable world and its structure | World Model |
| Scene Definition | A place/context within a world | World Model |
| Story Definition | Narrative sequence and choices | Story Engine |
| Quest Definition | Mission and objective structure | Quest Engine |
| Experience Profile | Presentation preferences/configuration | Experience Engine |
| Learning Evidence | Observable learner performance and evidence | Existing curriculum engine |
| Experience State | World/story/quest state | Deluxe Progress boundary |
| Domain Event | A versioned fact emitted by a module | Event contracts |

### 5.1 Reuse rule

A single activity/content definition can be referenced by multiple contexts:

```text
                 ONE CONTENT / ACTIVITY
                          |
          +---------------+---------------+
          |               |               |
      LESSON VIEW      FLASHCARDS        GAME
          |               |               |
          +---------------+---------------+
                          |
                    STORY / QUEST
                          |
                    WORLD RESPONSE
```

The context may supply framing, instructions, visuals and consequences. It may not fork the underlying content or curriculum task into separately maintained copies.

### 5.2 Stable identity and versioning

Definitions need stable IDs that are independent of presentation, scene or profile. Changes to a definition should be versionable without silently changing the identity of an existing learner record.

Do not encode group/year, visual theme, engine name or a curriculum claim into a generic activity ID.

Exact ID formats and version lifecycle must be specified in the relevant contract before implementation.

---

## 6. Main runtime flow

A representative flow for the “closed bridge” example:

1. The learner enters a scene.
2. The World Runtime renders the bridge object from the scene definition.
3. The learner activates or inspects the bridge.
4. The Interaction Engine resolves the interaction definition and emits a typed outcome.
5. The Story/Quest owner determines that a learning activity is required.
6. The Learning boundary resolves the existing activity/task and starts it through the correct existing practice or curriculum runtime.
7. The learner responds.
8. The existing learning/curriculum owner evaluates the response and records the appropriate result/evidence.
9. The activity completion result is returned as a stable result contract.
10. The Quest owner evaluates its own objective condition.
11. The World Runtime receives the resulting experience-state change and updates the scene (for example, the bridge becomes open).
12. The Event boundary publishes the relevant facts for other interested modules.

Important: the quest may require completion of an activity, but it cannot decide that the learner has mastered the underlying curriculum goal. The world reaction is based on the activity result contract and the quest's own rule, not on duplicated curriculum logic.

---

## 7. Compatibility with existing PacoGO

### 7.1 Additive integration

- Existing pages, lessons, practice modes, tests and management flows remain operational.
- Deluxe is introduced as an additional experience entry point.
- Existing authentication and student selection are reused.
- Existing content and curriculum records remain in their current owners.
- Existing games remain registered through `src/services/game-catalog.js`.
- Existing challenge definitions remain in `src/features/challenges/challenge-registry.js`.
- Existing learner evidence and curriculum state remain in their existing persistence boundary.

### 7.2 Adapters

An adapter is allowed only where a real contract mismatch exists between an existing owner and a new consumer.

Before introducing one:
1. identify the existing canonical owner;
2. identify the exact mismatch;
3. prove that the consumer cannot use the existing contract directly;
4. define one adapter owner and its lifecycle;
5. test it;
6. prevent a second source of truth.

No speculative compatibility layer or generic “Deluxe bridge” should be built before a concrete integration requires it.

### 7.3 Data and database safety

- No new Supabase project.
- No schema migration in the initial foundation.
- No automatic conversion of old lesson, game, learner or student records.
- No deletion or renaming of existing tables/columns.
- No direct database calls from scene components or UI handlers.
- Existing services remain the database access boundary.
- Any future Deluxe persistence design must identify ownership, RLS/security, retention, versioning and compatibility before a migration is proposed.

---

## 8. Proposed code/document placement

The existing repository structure remains authoritative. Do not create a parallel top-level application or move the curriculum engine into Deluxe.

Documentation:
- `docs/deluxe/PacoGO_Deluxe_Blueprint_v0.1.md` — this document.
- Future ADRs under `docs/decisions/`.
- Repo handoff remains under `docs/refactor/PACOGO_HANDOFF.md`; update it when implementation or binding architecture decisions change.

Potential future feature boundary, subject to a dedicated Architecture Gate:

```text
src/features/deluxe/
  runtime/       # composition and lifecycle
  world/         # world/scene definitions and runtime
  interaction/   # generic interaction contracts and dispatch
  story/         # narrative definitions and progression
  quests/        # quest definitions and objectives
  experience/    # profiles and presentation configuration
  events/        # typed event contracts/dispatch, if not owned centrally
```

This is a proposed feature boundary, not permission to create all these folders immediately. The first implementation plan must verify imports, ownership and consumer boundaries against the actual repository.

Do not put generic curriculum execution in this folder. Do not duplicate the existing game catalogue, challenge registry, lesson content model or application core.

---

## 9. Delivery phases

### Phase 0 — Repository and branch baseline
- Confirm DEV HEAD and compare state.
- Preserve `main`.
- Understand the 1,873-ahead / 17-behind branch divergence before any future sync.
- Identify the current regression workflow and establish a verified baseline before code changes.

### Phase 1 — Blueprint and architecture decisions
- Review this Blueprint.
- Resolve engine boundaries and object relationships.
- Record only durable architectural decisions as ADRs.
- Keep unknowns explicit; do not fill them with guessed schemas.

### Phase 2 — Minimal contracts
- Define versioned contracts for Content Reference, Activity, Interaction, Presentation, Result and Domain Event as required by the first vertical slice.
- Reuse existing lesson/task/result/evidence contracts where they already fit.
- Add contract tests.
- No new database schema.

### Phase 3 — First vertical slice
Build one small but real experience:
- one scene;
- one interactive object;
- one interaction;
- one existing learning activity/content item;
- one activity result;
- one quest/objective condition;
- one visible world response.

The same underlying activity must remain usable outside the world context. No duplicated question, answer validation or curriculum logic.

### Phase 4 — Experience Profile proof
- Add two clearly different presentation configurations.
- Switch between them without changing content, activity, learner identity, evidence or progress.
- Verify that preference is explicit and reversible.

### Phase 5 — Expand the world/story/quest system
Only after the vertical slice is stable:
- more scenes and objects;
- story sequences and dialogue;
- reusable quest objectives;
- object inventory/collection where required;
- additional interaction types.

### Phase 6 — Games and broader learning integration
- Integrate existing games through their canonical catalogue and result contracts.
- Reuse the learning activity/task boundary.
- Do not refactor all existing games as a prerequisite for the first world prototype.

### Phase 7 — Controlled platform integration
- Accessibility, performance and responsive behavior.
- Persistence only where required and designed.
- Full regression and security review.
- Update the persistent repo handoff.
- Retire superseded code only after verified replacement.

---

## 10. First vertical-slice acceptance criteria

The first prototype is successful only when all are true:

1. It runs inside the existing PacoGO application and reuses existing authentication/student context.
2. A scene is loaded from a definition rather than being hardcoded as a single one-off page.
3. An object uses the generic interaction contract.
4. The interaction can launch an existing learning activity through its canonical owner.
5. The activity uses the existing response/evaluation path.
6. The result is returned without duplicating curriculum or mastery rules.
7. A quest/objective can respond to the result.
8. The world visibly changes as a consequence.
9. The same activity remains usable in a non-world presentation.
10. Tests cover the contracts and the complete flow.
11. Existing PacoGO behavior remains intact.
12. No new Supabase project or unapproved schema migration is introduced.

---

## 11. Explicit non-goals for the initial build

- Full 3D or a Roblox-like environment.
- Rebuilding the existing PacoGO application shell.
- Rebuilding the curriculum engine or Learning Interfaces.
- Rewriting all existing games.
- Building every proposed engine at once.
- Creating a new student identity or progress system.
- Migrating old student or lesson data.
- Adding speculative database tables.
- Forcing presentation changes based on age.
- Replacing the existing app before the Deluxe path is proven.

---

## 12. Open decisions to resolve before implementation

1. Exact contract and ownership of reusable Content vs Activity vs Task references, based on the actual existing lesson and curriculum models.
2. Whether the first world scene definitions should be source-controlled JSON modules or another existing configuration format.
3. The smallest event contract needed for the first vertical slice and whether dispatch belongs inside the Deluxe runtime or a shared core owner.
4. The minimum persistent experience state required by the first prototype; keep it local/in-memory if persistence is not yet necessary.
5. Exact Experience Profile schema and preference storage, without using age as a forced selector.
6. Exact route/entry point and feature gating for the first Deluxe experience.

These are bounded design decisions, not reasons to restart the global architecture discussion.

---

## 13. Development rules

All implementation must follow:
- `docs/engineering/PACOGO_ENGINEERING_STANDARD.md`
- `docs/engineering/pab-extensibility-rule.md`
- `docs/refactor/PACOGO_HANDOFF.md`
- relevant curriculum and exercise-build protocols where learning tasks are involved.

Mandatory flow:

**PAB CHANGE INTAKE → PAB ARCHITECTURE GATE → PAB IMPLEMENTATION PLAN → IMPLEMENTATION → PAB VERIFICATION GATE → FINAL VERIFICATION**

No code change before the six-point Architecture Gate. No patchwork, duplicate owner, hidden fallback or page-specific workaround. Never report tests as green unless actually executed.

**Current status:** repository audit completed at the read-only level; Blueprint v0.1 recorded. No application code, Supabase schema, student data, branch history or LIVE resources were modified.
