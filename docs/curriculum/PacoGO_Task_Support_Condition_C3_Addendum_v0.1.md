# PacoGO — Task Support Condition Addendum to C3 v0.2

Status: Candidate design addendum / not approved for implementation  
Date: 2026-11-05  
Branch: refactor/professional-v1  
Related contract: PacoGO_C3_Canonical_Codebook_Reconciliation_Proposal_v0.2.md  
Verified baseline: Full Regression #2996 GREEN on b3f722ff8390944f1af3db943297bdf0d8ee4747.

## 1. Purpose

C3 reconciliation proposal v0.2 already separates raw assistance exposure from target-specific independence judgement. This addendum identifies one additional layer required by the PacoGO learning product:

**the support condition planned for a task before the learner starts.**

This planned condition is not an assistance event and is not an independence judgement. It defines the support policy under which the task attempt is administered. The observed interaction then records what the learner requested and what PacoGO actually delivered. C3 interprets the resulting evidence against the target's stated requirements.

This addendum complements v0.2. It does not replace its coding model or approve a canonical schema.

## 2. Four-layer model

Keep four separate layers:

1. **Planned task support condition** — the support policy configured in the task definition before presentation.
2. **Help-seeking event** — what the learner requested, and when.
3. **Delivered support event** — what PacoGO actually showed or supplied, and when.
4. **Target-specific C3 independence judgement** — how the observed assistance exposure relates to the independence requirement of the evidence target.

The planned condition must never be used as a substitute for observed event data. A task configured for independent performance does not prove that the learner worked independently. A learner request does not prove that support was delivered.

## 3. Product defaults

### 3.1 Ordinary learning/practice task

This is the default mode unless a task explicitly declares otherwise.

- Help-seeking is permitted and encouraged when the learner needs it.
- The learner may request an explanation, hint, example or clarification.
- Asking for help is not a failure and must not lower the correctness/performance result.
- PacoGO preserves the learner's work and records support actually delivered.
- A supported response can still provide useful evidence for relevant targets, but it must not be described as independent when target-relevant reasoning was supplied.
- Do not assess the learner against an independence condition that was never stated for the task.

### 3.2 Explicit independent-performance task

This mode must be declared and communicated before the learner begins.

- The learner is told that this attempt is to be completed independently, without hints, worked examples or task-directed mathematical assistance.
- The task must not deliver target-relevant help during the independent attempt.
- The learner may ask for help. The request is recorded without treating it as failure.
- If help is delivered, preserve the response and event history, but do not code the affected target as INDEPENDENT.
- The learner may end the independent attempt and continue in supported practice. That continuation is a distinct attempt/response episode and must not overwrite or merge with the independent attempt.
- Neutral interface clarification (for example, how to enter an answer) is distinguished from assistance that supplies target-relevant mathematical reasoning.

The product interaction for a help request during independent performance remains a design choice: either the request pauses/ends the independent attempt before offering support, or the learner explicitly abandons that attempt and starts a supported one. In either design, the help request and delivered support are separate events.

## 4. Relationship to C3 v0.2

C3 v0.2 remains authoritative as the current candidate for the measurement distinctions:

- Raw assistance events record actual assistance, source, timing, content/standardised prompt and target relevance where feasible.
- Independence is judged separately for each evidence target, by reference to observed assistance and that target's independence requirement.
- Candidate labels remain INDEPENDENT, PROMPTED, DEPENDENT and UNKNOWN pending operational anchor approval.
- The PROMPTED versus DEPENDENT boundary remains unresolved; this addendum does not define or select it.
- Assistance alone is not contradiction and does not automatically establish evidence absence.
- Correctness/performance, target evidence status and independence remain separate.
- Missing/incomplete assistance records cannot default to INDEPENDENT.

Additional clarification from this addendum:

- A help request without delivered target-relevant assistance is not automatically PROMPTED or DEPENDENT.
- If the task condition is ordinary supported practice, independence is not an implicit requirement.
- If the task condition is independent performance, the condition establishes what was expected, while event capture establishes what actually happened.
- A delivered neutral interface clarification is not automatically target-relevant assistance; its classification requires an approved operational rule.

## 5. Candidate task-definition field

Conceptual field only; not a final JSON schema:

```json
{
  "support_condition": "supported_practice | independent_performance"
}
```

This intentionally begins with one primary mode. Avoid adding several overlapping flags until real task requirements demonstrate that additional independent dimensions are necessary.

Proposed semantics:
- Missing field in legacy task definitions: interpret as `supported_practice` for learner-facing operational practice, unless an existing versioned task contract explicitly states otherwise.
- `supported_practice`: help requests and target-relevant assistance are permitted; capture delivered support.
- `independent_performance`: communicate the condition before the attempt; target-relevant help is not delivered within that attempt.

Backward compatibility must be explicit and versioned. Do not silently reinterpret historical pilot tasks or persisted observations.

## 6. Candidate interaction events

These are conceptual event types, not approved runtime names:

- help requested by learner;
- support option offered by PacoGO;
- support actually delivered;
- support declined/dismissed;
- independent attempt ended/abandoned;
- separate supported attempt started.

Every delivered support event should preserve, where feasible, source, timestamp, support type, content or prompt identifier, and whether the content exposed or materially supported target reasoning. The learner's request is recorded even if support is not delivered.

Do not infer a request from a support display or infer delivered support from a request.

## 7. Evidence and learner treatment

- Asking for help must never by itself be treated as incorrect performance, lack of ability, low mastery or a negative learner trait.
- Do not use help-seeking frequency as a proxy for motivation, ability or developmental status.
- Preserve correctness and raw response irrespective of support.
- Supported evidence remains available for target-specific interpretation; it is simply not independent evidence when target-relevant help materially supplied the reasoning.
- A separate independent attempt can be used when the curriculum claim genuinely requires independent performance.
- Mastery thresholds and aggregation rules do not change through this addendum. Whether supported evidence contributes to a given target/mastery decision remains governed by the approved target-specific rules.

## 8. B1 / ET7 boundary

This support-condition model clarifies how PacoGO can administer ordinary supported practice and explicit independent-performance tasks. It does not resolve the registry-level ET7 issue.

B1.ET7 currently exists under B1.C3 but is absent from all six B1 task models. Therefore:

- Do not add ET7 to TM4 by assumption.
- Do not create a new B1 task model without a separate curriculum-contract decision.
- Do not remove ET7 by assumption.
- Do not claim that setting `support_condition=independent_performance` alone creates valid ET7 evidence.

The next B1 decision must explicitly establish whether ET7 is an operational B1 evidence target with a task-model relationship, a cross-cutting C3 coding dimension, or another clearly defined construct. This addendum supports the operational conditions but does not decide that curriculum meaning.

## 9. Implementation blockers and required reconciliation

Before runtime implementation:

1. Reconcile the canonical raw observation and target-assessment cardinality. Current runtime emits singular `evidence_target_id`; Empirical Observation Schema v0.1 specifies `evidence_target_ids`; Pilot DataSchema v0.2 uses singular target/coding fields.
2. Reconcile C3 prompt/independence vocabulary and publish operational anchors, especially PROMPTED versus DEPENDENT.
3. Define target-relevance criteria for assistance and distinguish neutral interface support from target-relevant mathematical assistance.
4. Define immutable event ordering and the boundary between an independent attempt and a supported continuation.
5. Decide how legacy task definitions without a support condition are interpreted, without rewriting historical observations.
6. Resolve the B1.ET7 curriculum/task-model contract before any ET7 claim is emitted.
7. Only after the above, design the versioned task, event and observation contracts and their tests.

No Supabase migration is implied. Persistence changes are considered only if the approved runtime contract genuinely requires them.

## 10. Acceptance criteria for a future implementation

- Ordinary practice defaults to help permitted.
- Explicit independent-performance tasks communicate the condition before the attempt.
- Help request and support delivery are distinct ordered events.
- A request without delivered support does not automatically invalidate independence.
- Delivered target-relevant help prevents an independent judgement for the affected target.
- Neutral interface clarification is not automatically treated as mathematical help.
- Correctness and raw response are preserved after help.
- Supported continuation is a separate attempt/observation.
- Missing event data yields UNKNOWN, not assumed INDEPENDENT.
- Independence is assessed only where the target/task contract requires it.
- No changes are made to curriculum mastery criteria through this support-condition feature.
- Historical observations retain their original task/schema/codebook versions.

## 11. Non-goals

This addendum does not approve a canonical C3 codebook/schema, select the PROMPTED/DEPENDENT boundary, change B1 curriculum definitions or ET7 mapping, change task models or mastery rules, author learner catalogue tasks, implement runtime behaviour, or authorize learner-data/Supabase changes.

## 12. Next step

Complete the C3 codebook and observation-schema reconciliation, including the event representation and target-specific assessment linkage. Then resolve B1.ET7 explicitly. Only after those contract decisions and a fresh Full Regression check should implementation begin.
