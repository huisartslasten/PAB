# PacoGO Curriculum — Current Handoff

## 1. Project position

PacoGO is being developed as a learning/curriculum platform. The curriculum engine is the scientific decision layer; the learner-facing product and visual learning interfaces are built later on top of it.

Current working branch:
- `refactor/professional-v1`
- `main` / LIVE must not be touched.

## 2. Mandatory engineering workflow

Before every build step:
1. Check Full Regression.
2. If green, proceed.
3. If red, stop building.
4. Isolate the exact root cause.
5. Determine whether the cause is code, test, architecture contract, data/schema, or CI/environment.
6. Never guess and never patch around the symptom.
7. Design the proper underlying solution.
8. Implement.
9. Run Full Regression again.
10. Continue only when green.

Tests must never be changed merely to make a regression green. A test is changed only when it is demonstrably incorrect or when an intentional contract change has been correctly designed and implemented.

## 3. Completed scientific curriculum engine

C1–C9 are complete.

### C1 — Pilot / claim validation design
- Claim is the primary validation unit.
- Feasibility, discriminating and longitudinal phases are separated.
- Claims, evidence, task models, coding and exclusions are pre-specified.

### C2 — Student data model
Core chain:
`learner/context → task instance → interaction/observation → evidence assessment → inference → decision`

### C3 — Evidence coding
Evidence coding covers target match, performance, process, evidence quality, contradiction, prompting/independence, alternatives and reliability.

### C4 — Discriminating tasks
- 19 discriminating tasks over 10 developments.
- Model families M0–M4.
- Measurement/readiness gates prevent premature developmental inference.

### C5 — Developmental ordering
Ordering is distinguished from sequence, temporal precedence, prediction, prerequisite and causality. Alternatives, measurement invariance, longitudinal designs and model comparison are explicit. C5 remains candidate/design evidence; it does not automatically promote registry structure or mastery rules.

### C6 — Mastery decision
Mastery is claim-specific, development-specific, scope-specific and time-bounded.

Seven gates:
1. relevance
2. quality
3. coverage
4. stability
5. independence
6. variation
7. contradiction control

Possible outcomes:
- `MASTERED`
- `NOT YET MASTERED`
- `INSUFFICIENT EVIDENCE`
- `CONTRADICTORY`
- `NOT ASSESSED`

C6 does not automatically promote registry entries, write runtime mastery, infer developmental ordering or select the next action.

### C7 — Next-action decision
C7 separates two ordering domains:
- `prerequisite_ordering_state`
- `next_development_ordering_state`

Prerequisite uncertainty must not block prerequisite assessment merely because next-development ordering is uncertain.

Decision order:
1. general evidence/mastery/alternative gates
2. prerequisite candidate
3. only if prerequisite is supported: next-development candidate
4. produce the allowed next action or hold state

### C8 — Student model / learning status over time
C8 connects evidence/mastery decisions to a learner-state representation over time. It preserves the distinction between observed evidence, inference, mastery state and decision. C8 does not turn a single observation into permanent truth and does not bypass C6/C7 evidence requirements.

### C9 — Validation / chain integrity
C9 validates the complete vertical decision chain and makes the C6→C9 boundary explicit. Claim selection is explicit when a multi-claim C6 result enters the C8/C9 layer; C8/C9 must not silently choose an arbitrary claim.

## 4. First complete vertical prototype

The first vertical prototype now exists as an executable/tested chain:

`curriculum → skill → development → claim → discriminating task → learner performance → evidence → evidence assessment → C5 ordering → C6 mastery → C7 next action → C8 learner state → C9 validation`

First concrete curriculum slice:
- A1 — Getallen representeren en verbinden
- D1 — Representational meaning
- Claim: `A1.C1`

This is the scientific/engine vertical slice. It is not yet a learner-facing lesson or polished visual interface.

## 5. Candidate curriculum registry

### A1 — Getallen representeren en verbinden
Developments:
- D1 Representational meaning
- D2 Mapping
- D3 Coordination

Claims:
- A1.C1 / A1.D1
- A1.C2 / A1.D2

### B1 — Optellen
Developments:
- D1 Samenvoegen begrijpen
- D2 Optelling als getalrelatie uitvoeren
- D3 Strategisch en flexibel optellen
- D4 Geïntegreerd optellen

Claims:
- B1.C1 / B1.D1
- B1.C2 / B1.D2

### FR2 — Breukequivalentie herkennen en gebruiken
Developments:
- D1 Equivalentie herkennen
- D2 Equivalentie verklaren
- D3 Equivalentie functioneel gebruiken

Claims:
- FR2.C1 / FR2.D1
- FR2.C2 / FR2.D2

All registry entries remain candidate status. They are not empirically promoted merely because they exist in the registry.

## 6. What comes next

The scientific engine does not need another C-layer immediately. The next work is curriculum generalisation and substantive curriculum content.

Planned order:
1. Complete/deepen A1 as the first reference skill/curriculum slice.
2. Generalise the architecture with B1.
3. Generalise again with FR2.
4. Expand the curriculum into concrete mathematical domains such as number lines, clocks, fractions, measurement, quantities and ratios.
5. Build the Learning Interface System.

B1 and FR2 do not need to be rebuilt at the same depth as A1. A1 is the construction/proof case; B1 and FR2 primarily test whether the same engine generalises across different mathematical domains.

## 7. Learning Interface System — architectural direction

Important product decision:

PacoGO should not create a separate fixed “lesson” for every mathematical topic. Instead, build reusable, high-quality Learning Interfaces that skills can compose.

Examples:
- Number Line Interface
- Clock Interface
- Fraction Interface
- Quantity / Number Representation Interface
- Measurement Interface
- Ratio Interface

One skill may use multiple interfaces. One interface may be reused by many skills.

Conceptually:

`skill → development → required interaction forms → Learning Interface(s) → task/evidence`

The interfaces must be designed as learning instruments, not generic widgets. They should support interaction, feedback, state and evidence capture while remaining reusable across skills.

## 8. PacoGO Deluxe / Upper Tier constraint

The Learning Interface System must be Deluxe-ready from the beginning.

Do not build polished interfaces in a way that later requires rebuilding them for the PacoGO Deluxe / Upper Tier world.

Separate:
- pedagogical/function layer: state, interactions, learner actions, outputs/evidence
- visual/rendering layer: PacoGO visual language, animation, presentation, themes and future Deluxe integration

The same learning interface should be capable of being presented inside the future PacoGO Deluxe visual shell without changing the underlying curriculum logic.

PacoGO Deluxe is intentionally later. First establish the curriculum engine, curriculum content and reusable Learning Interface System correctly.

## 9. Supabase

C6–C9 did not require Supabase schema/runtime changes. The work remains in the curriculum/engine and validation layers. Supabase should only be changed when a real persistence/runtime contract requires it.

## 10. Latest verified regression state

Latest completed Full Regression:
- Run: `2730`
- Commit: `0c32eccaae7041e82b8031a3938b9b2bfb1b8056`
- Message: `Curriculum: complete C6 to C9 vertical prototype test`
- Branch: `refactor/professional-v1`
- Status: **GREEN**

Verified green stages included:
- curriculum engine regression
- architecture boundary tests
- maintained Node regression
- maintained Vitest regression
- browser regression
- working-tree cleanliness

A subsequent handoff-document commit may trigger the next Full Regression; that regression must be checked before any further build work.

## 11. Current mental model

The project is now best understood as three layers:

`CURRICULUM / SCIENTIFIC ENGINE`
→ determines what the learner needs and what evidence means

`LEARNING INTERFACE SYSTEM`
→ provides reusable, beautiful, interactive learning instruments

`PACOGO DELUXE / UPPER TIER`
→ later provides the larger visual world in which those learning instruments live

The intended strategy is:

**build the brain → prove the vertical chain → build the reusable learning instruments → then build the larger Deluxe world.**
