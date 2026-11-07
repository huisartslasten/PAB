# PacoGO — G3 to O6 v0.3 Traceability and Gap Review v0.1

Status: **design reconciliation; no executable tests or implementation authorization**  
Date: 2026-11-07  
Branch: `refactor/professional-v1`  
O6 baseline: `PacoGO_Operational_Assessment_Contract_v0.3.md`  
G3 source: `PacoGO_G3_Operational_Assessment_Rule_Verification_Specification_v0.1.md`

## 1. Purpose

This review checks whether all 40 candidate G3 vectors are traceable to the consolidated O6 v0.3 contract, identifies where expected results depend on a task/target-specific anchor or a separate gate, and prevents executable tests from asserting decisions that O6 has not yet frozen.

This is a design consistency check only. It does not approve O6, close G2/G3/G5/G6, create executable tests, or authorize runtime/persistence work.

## 2. Traceability

| G3 case(s) | O6 v0.3 section(s) | Traceability result | Constraint before executable test |
|---|---|---|---|
| G3-001–005 | §4, §9 | Direct | Rule applicability and execution reason must be explicit in each fixture. |
| G3-006–010 | §5.1–5.2, §9 | Direct | Fixture must state the exact target criterion and the actual task-instance actions captured. |
| G3-011–013 | §5.3, §5.5, §9 | Direct | Scoring-rule version and component-level scoring must be explicit; mixed results must retain component provenance. |
| G3-014 | §5.3, §5.5, §9 | Direct | Preserve raw `NO_RESPONSE`; do not create a task-general exception. |
| G3-015 | §5.3, §5.5 | Direct | The fixture must distinguish an uninterpretable response from a missing response. |
| G3-016–017 | §5.4–5.5, §9 | Direct | Declare which process streams are required by the exact task/target contract. If this is unknown, the test is blocked rather than guessed. |
| G3-018–019 | §5.5, §9 | Direct, with strict preconditions | Fixture must demonstrate valid elicitation, sufficient capture, inspectability and completed rule execution before asserting ABSENT/PRESENT. |
| G3-020–026 | §5.6, §1, §9 | Direct, with target anchors | Each fixture must name the target-required learner operation and identify the exact support content actually delivered. Request/offer/dismissal must remain distinct from delivery. |
| G3-027–029 | §1, §5.6, §9 | Direct | Distinguish content-help request from neutral interface clarification; preserve the request boundary and create a separate supported continuation. |
| G3-030–033 | §5.7, §9 | Direct | A contradiction fixture must cite the conflicting response/process material and the target interpretation it contradicts. |
| G3-034–035 | §2, §6, §9 | Direct | Verify one observation with multiple target assessments and reject target-opportunity inference from task-model metadata alone. |
| G3-036 | §3, §7, §9 | Direct | Verify logical provenance fields only; do not prescribe a physical schema or ID format. |
| G3-037–039 | §7, §9 | Dependent on G6/G9 identity contract | Test the logical replay/conflict/reassessment behavior only after canonical identity and payload semantics are approved. No provisional ID algorithm. |
| G3-040 | §7, §9 | Dependent on O5 | Test immutable snapshot exclusion using the approved O5 cutoff semantics; do not invent cutoff fields. |
| A1-1–A1-3 | §6, §5.1–5.6 | Direct, target-specific | Use existing A1 target/task definitions; do not infer mapping from co-display or change target mappings. |
| B1-1–B1-4 | §6, §5.1–5.7 | Direct, target-specific | Keep ET1/ET3/ET4/ET5 distinct; preserve ET7 as unmapped; do not create a new task-model association. |
| FR2-1–FR2-4 | §6, §5.1–5.7 | Direct, target-specific | Recognition and same-value reasoning remain separate; text presence and wrong selection alone are not reasoning/contradiction. |
| C6 M2 profile | §5.8, §10 | Direct as descriptive profile; downstream mapping remains open | Verify component preservation and no score. Exact M1/M2 input mapping remains G5. |

## 3. G3 cases that must remain blocked until dependent contracts are frozen

The following are not defects in the logical O6 model. They are explicit dependencies that prevent tests from guessing:

1. **Task/target-specific elicitation and required process streams:** every task/target contract must name what action/process is required and what streams must be captured. A generic O6 label cannot supply missing curriculum/task semantics.
2. **PROMPTED versus DEPENDENT anchors:** generic behavioral boundaries are defined in O6 §5.6. The concrete mathematical operation and exact support content must be bound to each target/task before that target's executable fixture can assert a label.
3. **Partial alignment:** only targets with explicitly separable, pre-specified components may use PARTIALLY_ALIGNED. Do not create component definitions in O6 or G3.
4. **Replay/conflict/reassessment:** G6/G9 must define canonical assessment identity, immutable payload comparison and linked reassessment identity.
5. **Snapshot cutoff:** O5 remains authoritative; G3 must consume its approved event-time and assessment-availability semantics.
6. **C6 M1/M2 mapping:** O6 supplies a structured adequacy profile, but G5 must reconcile exact use with existing C6 gate meanings.
7. **Quality:** v0.3 intentionally rejects an unanchored scalar/ordinal quality score. If a future product/research requirement needs a distinct quality construct, it requires a separate construct definition and approval; it is not a hidden G3 test dimension.

For any blocked dependency, the expected behavior is a contract/configuration blocker or an explicit unknown state, not a guessed learner result.

## 4. Required G3 test-suite organization

Once G2/O6 is frozen, organize executable contract tests into independent suites:

1. applicability and execution control;
2. task-instance alignment and response relation;
3. objective performance and scoring provenance;
4. process availability, no-response and strict evidence status;
5. help request, delivered support and target-specific independence;
6. Tussentoets/Toets termination and supported continuation;
7. observation-local contradiction;
8. multi-target cardinality and evidence-count non-inflation;
9. provenance and reassessment;
10. O5 snapshot availability cutoff;
11. A1/B1/FR2 domain-preservation anchors;
12. C6 M2 adequacy-profile preservation (without deciding G5 mapping).

Every test must assert both the expected result and prohibited shortcuts. Examples:
- `CORRECT` + `INDETERMINATE` evidence is possible;
- `INCORRECT` + contradiction `ABSENT` is possible;
- `PROMPTED` + evidence `PRESENT` is possible;
- one observation may have two target assessments but remains one observation;
- content-help request during independent assessment ends the attempt incomplete even when no support is delivered;
- neutral answer-entry clarification does not itself end the independent attempt.

## 5. G2 acceptance boundary

O6 v0.3 is now the consolidated working contract. This review shows the G3 candidate vectors can be traced to it without changing curriculum meanings. It does not convert the earlier working-baseline direction into final approval of every O6 category.

Before G2 closes, the owner must accept this exact v0.3 contract as the versioned operational assessment contract, or request specific revisions. This is the only remaining owner decision at this stage; it is not a request to reopen the already-confirmed Oefenen/Tussentoets/Toets product policy.

## 6. Gate disposition

- G2/O6: OPEN pending acceptance of exact v0.3.
- G3: candidate vectors reconciled; OPEN pending G2 freeze and executable contract tests.
- G5: OPEN; exact C3-to-C6–C9 mapping, including M1/M2, remains separate.
- G6/G9: OPEN; identity and idempotency details remain separate.
- O5: remains authoritative for snapshot and availability cutoff.
- No runtime, executable tests, registry, task catalogue, learner state, database, SQL/RPC/RLS, Supabase or learner data changed.
- LIVE `main` untouched.
