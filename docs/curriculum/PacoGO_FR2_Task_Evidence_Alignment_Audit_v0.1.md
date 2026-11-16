# PacoGO FR2 — Task/Evidence Alignment Audit v0.1

Status: engineering and curriculum-contract audit; design-only  
Branch: `refactor/professional-v1`  
Reviewed baseline: `4ca239fb27febc9d9f09922873f451dc1e7effb2`  
Latest verified Full Regression at review: #2883, GREEN  
Scope: FR2-T01–T05, curriculum registry v0.2, pilot task set v0.1, C3 evidence coding contract, C4 discriminating task set, Fraction Learning Interface and controller/runtime.

## 1. Purpose and boundary

This audit checks whether the current FR2 browser tasks, task-set metadata, registry task models and evidence-coding contract describe the same intended observations.

It does not validate FR2 development ordering, change claims/evidence targets, approve learner-data collection, or authorize mastery-rule changes. All browser examples remain synthetic technical fixtures.

**Decision:** retain the five pages as technical interface demonstrations, but do not treat their generated observations as pilot-ready coded evidence. Resolve the task/evidence and raw-observation/coding boundaries before collecting or interpreting real learner data.

## 2. Task-by-task alignment

| Task | Current pilot task mapping | Current interface behaviour | Alignment finding |
|---|---|---|---|
| FR2-T01 | FR2.D1 / C1 / ET1 / TM1; explanation required | Area-model target and area-model options; selected answer plus raw explanation | ET1 is a recognition target. The explanation is useful process data, but it is not separately mapped to ET3. This can remain intentional only if the task documentation says explanation is supplementary for this task, not evidence that C2 has been assessed. |
| FR2-T02 | FR2.D1 / C1 / ET1 / TM1; explanation required | Symbolic target and symbolic options; selected answer plus raw explanation | Same distinction as T01. A required text field proves only that text was entered, not that the explanation is mathematically meaningful. Do not score explanation quality from presence. |
| FR2-T03 | FR2.D2 / C2 / ET3 / TM2; explanation required | Area-model target and symbolic options; cross-representation selection and raw explanation | The registry defines FR2.TM2 with ET3 **and ET4**, while this task instance names ET3 only. Decide whether this task is intended to assess changed-representation stability (ET4), or only a single explanation sample (ET3). Do not add ET4 by assumption. |
| FR2-T04 | FR2.D1 / C1 / ET1 / TM1; marked as a countertask | Grid area-model target and symbolic options; raw explanation | The registry defines FR2.TM5 with ET2 and ET6, and the C4 FR2-D1 discriminators use TM1/TM5 and ET1/ET2. This task is currently registered as TM1/ET1, so its countertask purpose is not represented in its evidence mapping. A changed grid surface alone does not establish that the task distinguishes superficial similarity or captures contradictory reasoning. |
| FR2-T05 | FR2.D2 / C2 / ET3 / TM2; marked as a countertask; response process required | Area-model target and symbolic options; short Dutch prompt plus free-text explanation | The interface configuration is structurally the same mixed-representation pattern as T03. The task set describes low-language transfer, but the page still uses Dutch text and requires free-text explanation. The controller records `context.language: "nl"`; it does not record the learner's actual explanation language or a distinct language condition. The registry's TM2 also includes ET4, which the task instance does not name. |

## 3. Cross-document contract mismatches

### 3.1 Task model versus task-instance evidence targets

The registry task models describe broader evidence coverage than some task instances:

- FR2.TM2: ET3 + ET4; FR2-T03 and FR2-T05 currently name ET3 only.
- FR2.TM5: ET2 + ET6; FR2-T04 currently names TM1 + ET1 instead.
- C4 FR2-D1 discriminators specify ET1 + ET2 and use TM1/TM5 contrasts; the current FR2-T04 instance does not implement that mapping.

A task model may define a family of evidence opportunities, while a task instance may collect only a subset. That distinction must be explicit and versioned. It must not be silently resolved by changing IDs in a page.

### 3.2 One observation currently carries only one evidence-target ID

`createTaskInstance` accepts an array of evidence target IDs, but `createObservation` stores only the first item as `evidence_target_id`. The pilot data schema also defines a singular evidence-target field.

Before any task is mapped to multiple evidence targets, decide whether the data contract should:
- emit one raw observation with a separate, traceable assessment record per target; or
- create distinct target-specific evidence records linked to the same raw observation.

Do not duplicate or discard the response process to make the schema fit.

### 3.3 Raw observation and evidence assessment are not yet separated in the FR2 demo path

The C3 specification says raw correctness and process observations must be coded independently before inference. The current Fraction controller additionally emits:
- `quality` derived directly from correctness;
- `relevant: true`;
- `independent: true`;
- `contradiction: false`.

The registry then consumes those fields in the evidence assessment/inference cycle. This is acceptable only as a clearly labelled synthetic demonstration shortcut; it is not equivalent to the C3 coding procedure. In particular:
- correctness is not the same as evidence quality;
- a non-empty explanation is not proof of value-based reasoning;
- independence must reflect the delivered prompts/assistance;
- contradiction cannot be set false before the explanation/process is assessed;
- target match must be assessed against the actual target, not inferred merely from task association.

No real learner observations should enter this shortcut path as if they were independently coded evidence.

### 3.4 Language-reduced task metadata is incomplete

FR2-T05 needs a pre-specified language condition and data capture that can distinguish:
- language of task instructions;
- language used by the learner;
- response mode (written, spoken, selected, constructed visual, or other);
- whether the task meaning is understood without the language demand the countertask intends to reduce.

The current fixed Dutch context field is not sufficient for that purpose. A language-reduced task should not be called language-independent unless the design and evidence support that claim.

## 4. What is already sound and should be preserved

- The same reusable Fraction interface supports T01–T05.
- Visual target representation and option representation are configurable separately.
- The T04 grid layout changes the target's visual surface without changing the represented fraction.
- The interface preserves raw learner explanation text.
- Required response-process presence is derived from the task-set record.
- Submission is task-bound through the shared browser vertical-slice runtime.
- No automatic mastery promotion is introduced.
- The open ET1-versus-explanation question for T01/T02 remains explicitly unresolved.

These are implementation facts, not evidence that the task measures are valid.

## 5. Decisions required before changing mappings or collecting pilot data

1. **Define the observation/evidence record boundary.** Specify where raw performance ends and where C3 target-match, process, quality, independence, contradiction and alternative-explanation coding begins.
2. **Define target cardinality.** Decide how one response can support multiple evidence targets without losing traceability or double-counting.
3. **Resolve T01/T02 response-process intent.** Decide whether the explanation is supplementary to ET1 or whether a separate task/evidence opportunity is needed for ET3.
4. **Resolve T03/T05 mapping.** Determine whether each task genuinely samples ET4, and if so what observable variation demonstrates that the value relation survives the representation change.
5. **Redesign or remap T04 deliberately.** Specify the contrast that tests superficial similarity and the response pattern that could count as contradictory evidence. Map to ET2/ET6 only if the task actually elicits those observations.
6. **Operationalise T05.** Define the reduced-language condition, response mode, language metadata and comparison condition. Do not rely on a shorter Dutch prompt alone.
7. **Version the resulting task/evidence contract.** Any approved changes to registry, pilot task set, task pages, data schema or coding rules require a new version and a documented rationale.

## 6. Recommended next implementation/research step

Create a versioned **FR2 Task–Evidence Alignment Specification** that resolves items 1–6 above before modifying runtime code or curriculum mappings. Review it against the C3 coding specification, C4 discriminating task set, pilot data schema and the current browser tasks.

After that specification is approved, implement only the necessary contract changes, add tests for raw-observation preservation and evidence-target traceability, and run Full Regression. Do not change Supabase unless the approved persistence/runtime contract genuinely requires it.

## 7. Explicit non-decisions

This audit does not:
- change FR2.D1–D3, FR2.C1–C3 or FR2.ET1–ET6;
- promote FR2 or any task from Candidate;
- infer explanation quality or misconception labels automatically;
- approve live learner data collection through the current synthetic browser demo;
- change mastery thresholds, next-action rules or Supabase schema.
