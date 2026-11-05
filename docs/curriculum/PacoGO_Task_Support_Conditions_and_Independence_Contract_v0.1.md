# PacoGO — Task Support Conditions and Independence Contract v0.1

Status: candidate design-only; no runtime or registry changes approved.
Date: 2026-11-05
Branch: refactor/professional-v1
Baseline: Full Regression #2994 GREEN on aabcf83e81887e89c1c1f79445ac8115a62efe95.

## Decision

Ordinary learning/practice tasks permit help-seeking by default. A task may explicitly declare an independent-performance condition. The task condition is declared before the learner starts; actual help requests and actual assistance are captured as separate events. C3 codes the resulting evidence. A task label alone never proves independence.

## Rules

### Ordinary learning/practice
- The learner may request explanation, hints or examples.
- Help-seeking is a legitimate learning action, not a failure.
- Preserve the response, correctness, strategy and event history.
- Record assistance actually delivered. Do not code target-relevant supported performance as independent.

### Independent-performance task
- Tell the learner before the attempt that the task is to be completed without hints, worked examples or task-directed assistance.
- Record a help request separately from assistance delivered.
- A request alone does not prove that help was received.
- If target-relevant help is delivered, preserve the performance but do not code it as independent for the affected target.
- If the learner switches to supported practice, create a distinct supported attempt; do not merge it with or overwrite the independent attempt.
- Neutral interface clarification must be distinguished from mathematical assistance that supplies target reasoning.

## Four distinct concepts

1. Planned task support condition.
2. Learner help request.
3. Support actually delivered, including type/content reference and timing.
4. C3-coded independence assessment for a specified evidence target.

Do not collapse these into one boolean.

## C3 coding

Retain the candidate categories already used in the Evidence Coding Manual: INDEPENDENT, PROMPTED, DEPENDENT and UNKNOWN.

- INDEPENDENT requires sufficient event data showing no target-relevant assistance was delivered.
- PROMPTED means a prompt materially supported the target response.
- DEPENDENT means the response relied on direct assistance or supplied target reasoning.
- UNKNOWN means support exposure or event capture is incomplete or ambiguous.

A help request without delivered target-relevant assistance is not automatically PROMPTED or DEPENDENT. It remains a help-seeking event. Ordinary supported practice should not be judged against an unstated independence requirement. Missing event data must never default to INDEPENDENT.

## Proposed task metadata

Conceptual only; final field names and schema require C3 reconciliation:

- support mode: supported_practice | independent_performance
- help request policy: allowed | ends_independent_attempt
- target assistance policy: permitted | prohibited

An independent-performance condition implies that target-relevant assistance is prohibited during that attempt. Whether a help request immediately ends the attempt or pauses it is a product decision still to specify. The request and any delivered support must always be recorded separately.

## Evidence and inference boundaries

- Preserve raw correctness, response, strategy, process and ordered interaction events regardless of help use.
- Do not discard a response because the learner asked for help.
- Do not convert supported correctness into independent evidence.
- Do not treat help-seeking as a negative mastery judgement.
- Assess evidence targets separately where support may affect them differently.
- One observation remains one observation even if assessed against multiple targets.
- Mastery rules remain unchanged. Whether prompted evidence can contribute is target/claim-specific and must be specified before inference.

## B1 / ET7

B1.ET7 remains unresolved: it exists under C3 but is not mapped by any of the six B1 task models. This proposal clarifies the operational conditions but does not attach ET7 to TM4, invent a task model or remove ET7.

The next curriculum decision must explicitly choose whether ET7 remains a B1 evidence target, becomes a cross-cutting C3 coding dimension, or requires an explicit task-model relationship. This proposal does not decide that registry question.

## Existing blockers before implementation

1. addition-controller.js hardcodes independent=true, prompt_level=none and hints=0 without capturing the actual support conditions. These values cannot support independence claims.
2. interaction-contract.js emits singular evidence_target_id; Empirical_Observation_Schema v0.1 uses evidence_target_ids; Pilot_DataSchema v0.2 uses singular target fields. Reconcile this pre-existing schema mismatch before implementation.
3. C3 Evidence Coding Specification v0.1, Evidence Coding Manual v0.1 and Pilot_DataSchema v0.2 use different independence/prompt vocabularies. Reconcile a canonical versioned codebook and schema before deriving codes from events.
4. B1 catalogue tests require task evidence target IDs to exactly match the selected task model. This proposal does not weaken that contract.
5. The current B1 learner UI does not yet expose a complete help-request/support-delivery interaction. Metadata alone is not implementation.

## Future acceptance criteria

- Default learner-practice tasks permit help-seeking.
- Independent tasks communicate their condition before the attempt.
- Help requests and delivered support are separate immutable events.
- Support type/content reference and timing are captured sufficiently to assess target relevance.
- A request without target assistance is not automatically coded as prompted/dependent.
- Target-relevant assistance prevents independent coding for the affected target.
- Responses remain preserved; supported continuation is a separate attempt.
- Incomplete event capture yields UNKNOWN, not INDEPENDENT.
- No controller hardcodes independence, prompt level or zero hints without event evidence.
- C3 assessment, raw observation and mastery remain separate.
- Version/history compatibility and schema mismatches are resolved before persistence changes.
- Tests cover help requested but not delivered, neutral UI clarification, target hint delivered, worked example, declined help, abandoned independent attempt, supported continuation and incomplete event capture.

## Non-goals

No changes to B1 curriculum objects, ET7 mapping, task models, mastery thresholds, catalogue, runtime, learner data or Supabase are approved by this document. It does not infer ability or motivation from help-seeking frequency and does not require learners to avoid asking for help.

## Next step

Reconcile the canonical C3 codebook and observation/event schema, then make the explicit B1.ET7 curriculum-contract decision. Only after those decisions and a fresh Full Regression check should implementation be designed.
