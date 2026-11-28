# PacoGO C8 — Student Model / Learning Status Protocol v0.1

## Purpose

C8 defines the temporal student model that sits between individual C6/C7 decisions and later learner-facing orchestration. It records how evidence-backed development decisions relate over time without inventing new mastery or developmental-ordering claims.

## Position in the chain

`curriculum → skill → development → claim → task → performance → evidence → evidence assessment → inference → C6 mastery decision → C7 next-action decision → C8 temporal learner model`

C8 is a temporal state layer. It does not replace C6 or C7.

## Core principles

1. C8 consumes explicit, already validated decision outputs.
2. C8 preserves the identity of learner, claim, development, scope and time window.
3. C8 keeps the complete decision history needed to understand change over time.
4. C8 distinguishes current status from historical status.
5. C8 may describe temporal patterns in the supplied record, but must not convert them into unsupported mastery, prerequisite, developmental-ordering or automatic-advancement claims.
6. Missing observations remain missing; absence of evidence is not evidence of absence.
7. Contradictory or insufficient evidence remains visible in the temporal record.
8. C8 does not mutate runtime learner state, promote registry entries, or select a new action.

## C8 input contract

A learner development record requires:

- `learner_id`
- `claim_id`
- `development_id`
- `scope_id`
- `observations[]`

Each observation contains:

- `observation_id`
- `observed_at`
- `mastery_state` from C6
- `next_action` from C7
- `evidence_state`
- `supporting_evidence_ids`

The observation list is ordered by `observed_at` by the engine; caller order is not trusted.

## Temporal summary

C8 returns:

- `observation_count`
- `first_observed_at`
- `last_observed_at`
- `current_mastery_state` — the latest supplied C6 state, not a new inference
- `current_next_action` — the latest supplied C7 action, not a new decision
- `mastery_state_counts`
- `evidence_state_counts`
- `contradictory_observation_count`
- `insufficient_evidence_observation_count`
- `distinct_observed_mastery_states`
- `temporal_coverage` with first/last observation and span in days when both dates are valid

## Temporal interpretation

C8 exposes only descriptive temporal summaries. It does not label a learner as improving, declining, ready, behind, advanced, or mastered beyond the explicit latest C6 state.

A later model may use C8 as input for longitudinal validation or product orchestration, but such use must be separately specified and tested.

## Boundaries

C8 must not:

- create a C6 mastery decision;
- override a C6 state;
- infer developmental ordering;
- infer prerequisites;
- select a next action;
- automatically advance a learner;
- write runtime learner state;
- promote a curriculum registry candidate;
- collapse contradictory observations into a single hidden truth.

## Required invariants

- Empty observation history is valid and returns `NOT_ASSESSED` as the current state.
- Observation IDs must be unique.
- Dates must be valid ISO timestamps.
- Observations must have consistent learner/claim/development/scope identity through the parent record.
- C6 mastery states are preserved exactly.
- C7 actions are preserved exactly.
- The latest observation is determined by timestamp, never array position.
- The output must retain enough information to audit the temporal summary back to source observations.

## Status

C8 v0.1 is an engine contract and temporal student-model layer. It is not a production runtime learner database schema.
