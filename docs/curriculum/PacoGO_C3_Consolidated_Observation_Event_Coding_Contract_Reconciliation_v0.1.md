> **SUPERSEDED FOR LEARNER-RUNTIME ARCHITECTURE — HUMAN CODER MODEL WITHDRAWN.** The reconciliation below assumes coder records, multiple independent coders and adjudication. Those are not learner-runtime components. PacoGO is the single operational assessor. Reconcile the model to one raw learner observation plus zero or more PacoGO target-specific assessments, with explicit assessment-rule/version provenance. Do not infer a need for human reviewers from the current schema mismatch.

# PacoGO C3 — Consolidated Observation, Event and Coding Contract Reconciliation v0.1

Status: Design reconciliation / candidate / not approved for implementation  
Date: 2026-11-05  
Branch: `refactor/professional-v1`  
Verified starting commit: `931953c5771ec95fa8672ce5b7e2e16e954914ac`  
Full Regression: #2999 / run ID `42035877949` GREEN on that exact commit

## 1. Purpose and scope

This document consolidates the current candidate contracts for raw response episodes, task support conditions, help-seeking and delivered-support events, target-specific C3 assessments, schema cardinality and historical compatibility.

It is a reconciliation artifact, not an approved canonical schema or codebook. It does not authorise runtime, registry, catalogue, learner-state, persistence or Supabase changes.

Fixed boundaries:
- Curriculum meanings, SLO mapping, claims, evidence-target meanings, development ordering and mastery criteria do not change here.
- Raw learner responses and event history must remain auditable.
- C3 assessment is separate from raw observation and from later inference/mastery.
- A task model's target list is an opportunity specification, not proof that every target was elicited or demonstrated.
- Multiple target assessments from one response do not create multiple independent observations.

## 2. Source inventory and conflict map

Reviewed on the current branch:
- `PacoGO_C3_Canonical_Codebook_Reconciliation_Proposal_v0.2.md`
- `PacoGO_C3_Evidence_Coding_Specification_v0.1.md`
- `PacoGO_Evidence_Coding_Manual_v0.1.md`
- `PacoGO_Empirical_Observation_Schema_v0.1.json`
- `PacoGO_Pilot_DataSchema_v0.2.json`
- `PacoGO_Task_Support_Conditions_and_Independence_Contract_v0.1.md`
- `PacoGO_Task_Support_Condition_C3_Addendum_v0.1.md`
- `PacoGO_C3_Descriptive_Coding_Reliability_Layer_v0.1.md`
- `PacoGO_FR2_Task_Evidence_Alignment_Specification_v0.1.md`

The source documents are candidate specifications with different purposes and maturity. No one source is silently promoted to canonical status by this reconciliation.

### 2.1 Material inconsistencies

| Concern | Existing alternatives | Reconciliation finding |
|---|---|---|
| Observation target cardinality | Pilot_DataSchema v0.2 has singular `evidence_target_id`; Empirical Observation Schema v0.1 has `evidence_target_ids` array | One raw observation must be representable once and linked to zero, one or multiple separately justified target assessments. Exact wire format remains undecided. |
| Coding record cardinality | Pilot_DataSchema v0.2 embeds one `coding_record`; C3 v0.2 describes target-specific assessment and coder provenance | A single embedded record cannot fully represent multiple targets, multiple independent coders, coding rounds and adjudication without nested/repeated structures. |
| Target relation | C3 specification uses `direct/partial/indirect/none`; Manual uses `MATCH/MISMATCH/UNCLEAR`; C3 v0.2 separates task-instance alignment from response-to-target relation | These are not safely interchangeable. Keep task alignment and response relation as distinct judgements. |
| Evidence status | C3 v0.2: `PRESENT/ABSENT/INDETERMINATE/NOT_CODED/NOT_APPLICABLE`; Manual has four statuses and no explicit `NOT_APPLICABLE` | Preserve the richer distinction as a candidate; approval and exact scope still required. |
| Process availability | C3 specification uses `present/absent/ambiguous/not_collected`; empirical schema has process status in raw observation; C3 v0.2 separates raw availability from target evidence status | Collection availability is raw provenance; process interpretation is target-specific coding. They must not share one field. |
| Quality | C3 specification proposes five numeric levels; Manual proposes three; Pilot_DataSchema allows unrestricted number | No scale can be selected from current evidence. Anchors and coder discrimination study are prerequisites. |
| Prompt/independence | C3 specification uses prompt exposure levels; Manual/Pilot schema use `INDEPENDENT/PROMPTED/DEPENDENT/UNKNOWN`; C3 v0.2 requires raw assistance events then target-specific judgement | Prompt level and independence judgement are not the same variable. Preserve actual events; do not translate prompt level mechanically. |
| Contradiction | Boolean in Pilot_DataSchema; C3 v0.2 proposes a target-specific status with rationale | Boolean loses indeterminate/not-coded/not-applicable and provenance distinctions. Exact approved representation remains open. |
| Workflow readiness | C3 specification defines readiness states | These describe coding/study readiness, not learner evidence and must not be stored as target evidence status. |

No historical values should be mechanically translated into proposed vocabulary. Historical records must retain the schema/codebook version under which they were created.

## 3. Proposed conceptual record architecture

The following is a conceptual separation of record responsibilities, not a final JSON schema or database design.

### 3.1 Task definition and administered task instance

The versioned task definition holds the planned condition and intended evidence opportunities:
- task-definition ID and version;
- task model and curriculum registry version;
- planned target opportunities;
- actual prompt/instruction/representation/language content presented;
- planned support condition, provisionally `supported_practice` or `independent_performance`.

The administered task instance records what was actually presented and whether administration departed from the definition. Planned configuration must not be treated as proof of what occurred.

### 3.2 Raw response episode

Proposed unit: one administered task-instance response episode, including ordered attempts and interaction events belonging to that episode.

One click, edit, retry or help request is an event inside the episode, not automatically a new observation. A separately administered task instance is a separate episode/observation. A pre-specified contrast-set or bundle identifier may link episodes for comparison.

Preserve, where available:
- stable observation and task-instance identifiers;
- pseudonymous learner, session, study and wave references;
- exact task, registry, task-definition, instrument and collector versions;
- actual presented instructions, items, options, representations and language;
- raw response and response modality;
- objectively scorable performance plus scoring-rule version;
- ordered attempts and interaction events;
- process-collection availability and technical/data-quality events;
- provenance and timestamps.

Raw observations are immutable. Corrections or reinterpretations create linked, versioned records; they do not overwrite the original response/event history.

### 3.3 Support and assistance event stream

Keep these as distinct event concepts:
1. help requested by the learner;
2. support offered by PacoGO;
3. support actually delivered/displayed;
4. support declined or dismissed;
5. independent attempt ended/abandoned;
6. separate supported attempt started.

A request is not delivery. An offer is not delivery. A displayed support is not necessarily target-relevant support. Each event should retain timestamp/order, actor/source, event type and relevant content or standardised support identifier. Delivered support should additionally preserve enough detail to judge whether it exposed or materially supported target reasoning.

Neutral interface/task-management clarification must be distinguishable from target-relevant mathematical assistance. The operational boundary requires explicit examples and coder testing; it is not settled here.

If an independent-performance attempt is followed by supported practice, preserve the independent episode and create a distinct supported episode. Do not merge or overwrite them.

### 3.4 Target-specific C3 assessment

One raw observation may be assessed against multiple evidence targets only where each target relationship is separately justified.

Conceptually, each assessment is linked by:
- observation ID;
- evidence-target ID;
- coder ID / coding round;
- codebook version;
- task-instance alignment judgement;
- response-to-target relation;
- target evidence status;
- objective performance reference (not duplicated as an inferred construct);
- process availability reference and target-specific process interpretation where applicable;
- target-specific independence judgement referencing actual assistance events;
- contradiction judgement and rationale;
- alternative-explanation flags with provenance;
- quality judgement only after its scale and anchors are approved;
- coding timestamp, rationale, review/adjudication and supersession links.

One observation assessed against three targets remains one observation with three target-specific assessments, not three independent observations.

Independent coder records remain immutable. Adjudication is a separate linked resolution. Recoding under a new codebook creates a new record and retains the prior code/version.

## 4. Dimension boundaries to preserve

### 4.1 Task-instance alignment versus response relation

Task alignment asks whether the exact administered task instance afforded a defensible opportunity to observe the target. Candidate vocabulary in C3 v0.2: `ALIGNED`, `PARTIALLY_ALIGNED`, `MISALIGNED`, `UNCLEAR`, `NOT_ASSESSED`.

Response relation asks how this response/process relates to the target. Candidate vocabulary in C3 v0.2: `DIRECT`, `PARTIAL`, `INDIRECT`, `NONE`, `INDETERMINATE`, `NOT_CODED`.

These are separate candidate vocabularies. A correct response to a misaligned task does not repair task alignment. A directly related response may still fail to demonstrate the target.

### 4.2 Collection availability versus evidence status

Raw collection availability describes whether material was collected: candidate states include `COLLECTED`, `NOT_COLLECTED`, `TECHNICAL_FAILURE`, `OBSERVER_UNABLE`, `NOT_APPLICABLE`.

Target evidence status describes what inspected material demonstrates: candidate states `PRESENT`, `ABSENT`, `INDETERMINATE`, `NOT_CODED`, `NOT_APPLICABLE`.

Do not convert missing collection, technical failure or a no-response event automatically into `ABSENT`. A no-response event is an observed event; its target meaning depends on a pre-specified administration/scoring protocol.

### 4.3 Performance versus evidence interpretation

Correctness/performance is objectively scored under a versioned scoring rule. It does not automatically determine target evidence status, quality, independence, contradiction or mastery.

### 4.4 Planned support condition versus observed help versus independence

- Planned support condition describes the task policy before the attempt.
- Help request describes learner behaviour.
- Delivered support describes what PacoGO actually supplied.
- Independence is a target-specific C3 judgement against the target's independence requirement and the observed events.

A request without delivered target-relevant help is not automatically PROMPTED or DEPENDENT. Help-seeking is not failure. Missing/incomplete event capture must not default to INDEPENDENT; the appropriate candidate result is UNKNOWN or otherwise indeterminate under an approved codebook.

### 4.5 Contradiction versus error or assistance

An incorrect answer alone is not automatically contradiction. Missing process is not contradiction. Assistance alone is not contradiction. Contradiction requires specific material that materially conflicts with an otherwise plausible target-specific interpretation, with rationale and provenance.

## 5. Historical compatibility and versioning principles

The current candidate schemas cannot be merged by silently choosing one field layout.

Before any implementation, a versioned compatibility plan must define:
1. separate versions for raw observation schema, task definition/support-condition contract, event vocabulary, C3 codebook and scoring rules;
2. which versions are required on every new record and how exact versions are resolved;
3. whether old records remain readable under their original schemas or use explicit read adapters;
4. how singular historical `evidence_target_id` maps to one target assessment without pretending it represented a multi-target record;
5. how a historical embedded `coding_record` is retained and exposed through a read model without fabricating coder rounds or adjudication history;
6. how historical `MATCH/MISMATCH/UNCLEAR`, quality values, prompt levels and boolean contradiction are displayed without loss;
7. whether and how any recoding is performed as a new linked record, never destructive mutation;
8. how absent legacy `support_condition` is interpreted for future administration versus historical observations.

The task-support addendum proposes defaulting a missing legacy task-definition field to supported practice for learner-facing operational practice, subject to versioned backward-compatibility review. This must not be used to retroactively claim that historical attempts were administered under a known support condition. Historical condition should be marked unknown unless contemporaneous evidence establishes it.

No migration, backfill, Supabase change or runtime adapter is authorised by this design document.

## 6. Decisions still required before a canonical contract can be approved

| ID | Decision | Why it remains open | Required decision evidence |
|---|---|---|---|
| D1 | Canonical observation/assessment cardinality and record boundaries | Existing schemas conflict on singular versus array target linkage and embedded versus separate coding records | Approved conceptual ER/record model plus representative single- and multi-target examples |
| D2 | Exact task-alignment and response-relation vocabularies | Historical terms conflate distinct questions | Blinded anchor cases and explicit coder instructions |
| D3 | Evidence status and process-availability vocabulary | Older documents collapse or omit states | Missingness/no-response/technical-failure anchor cases |
| D4 | Quality scale and anchors | Three- and five-level scales conflict; no calibration evidence | Coder discrimination exercise, category distribution and feasibility findings |
| D5 | PROMPTED versus DEPENDENT boundary | Labels lack tested operational thresholds | Observable assistance anchors, including minimal cue, strategy cue, worked example and answer disclosure |
| D6 | Target relevance of support and neutral clarification boundary | Support content may affect targets differently | Target-specific examples and coding exercises |
| D7 | Contradiction representation | Boolean cannot express all candidate statuses and rationale | Anchor cases and explicit contradiction rationale contract |
| D8 | Coding rounds, coder cardinality and adjudication | Current reliability implementation has limitations | Study-specific coder assignment and reporting design |
| D9 | Task support-condition semantics and attempt boundary | Independent attempt followed by supported practice needs exact lifecycle rules | Product interaction decision and event sequence examples |
| D10 | Historical compatibility/read strategy | Existing pilot data may use different schemas and vocabularies | Inventory of persisted records and explicit non-destructive compatibility plan |

These decisions must not be resolved by implementation convenience or by changing tests to fit a preferred schema.

## 7. Proposed order of resolution

1. Approve the conceptual observation unit and cardinality (D1).
2. Freeze the distinctions between raw collection, task alignment, response relation, evidence status and performance (D2–D3).
3. Define assistance event and target-relevance anchors, then resolve PROMPTED/DEPENDENT (D5–D6).
4. Decide contradiction representation and quality anchors (D4, D7).
5. Define coder-round/adjudication and reliability reporting against the selected study design (D8).
6. Approve task support-condition lifecycle and attempt boundaries (D9).
7. Inventory historical records and approve a non-destructive version-compatibility plan (D10).
8. Publish a versioned canonical codebook and schema only after the above decisions are explicit and internally consistent.
9. Then design runtime changes and test coverage. Re-run Full Regression before implementation and after the change. Persistence/Supabase is considered only if the approved runtime contract demonstrably requires it.

## 8. Explicit non-decisions

This reconciliation does not:
- decide whether B1.ET7 remains a distinct curriculum evidence target, becomes a cross-cutting coding dimension or receives a task-model relationship;
- map ET7 to TM4 or invent TM7;
- change B1 registry versions, catalogue tasks, task-model mappings or mastery rules;
- change any A1, B1 or FR2 curriculum claim or evidence-target meaning;
- choose a quality scale, PROMPTED/DEPENDENT threshold, reliability statistic or threshold;
- approve a canonical schema, codebook or event names;
- authorise runtime, learner-state, persistence, migration or Supabase changes;
- claim empirical reliability, validity or scientific validation.

## 9. Next gate

Review this reconciliation as a design proposal. The next separate curriculum decision is B1.ET7. Only after both the measurement contract and ET7 role are explicitly resolved should a concrete B1 task-coverage/runtime slice be designed. Keep the practical learner objective in view: build useful, valid addition practice without manufacturing independence evidence or weakening the curriculum contract.
