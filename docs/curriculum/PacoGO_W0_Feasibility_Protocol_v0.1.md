# PacoGO W0 Feasibility Protocol v0.1

Status: Candidate / design-only / synthetic fixture

## Purpose

W0 is a technical and measurement-feasibility run before the first empirical pilot. It checks whether the planned task, interaction, observation, coding and analysis chain can be executed without silently losing provenance or inventing developmental conclusions.

## W0 checks

1. Task-instance registration is complete and linked to the pilot task set.
2. Observation provenance is complete from learner/session/wave through task instance and registry version.
3. Required observation fields can be exported deterministically.
4. Interaction events and response payloads remain raw observations rather than inferred mastery states.
5. C3 coding records can be entered independently by two coders and remain separate.
6. Coding dimensions required by the protocol are representable without adjudication overwriting the original codes.
7. The analysis pipeline can execute on the fixture and produce a descriptive report plus C4 measurement gate.
8. Missing or incomplete evidence is surfaced as a feasibility limitation rather than converted into a positive curriculum conclusion.

## Synthetic fixture rule

W0 uses synthetic data only. No real learner data, production learner state or Supabase persistence is required. The fixture is deliberately small and is not a curriculum validation sample.

## Success criteria

W0 is technically feasible only when all structural checks pass and the end-to-end pipeline returns a deterministic result. W0 does not require C4 readiness and does not authorize registry promotion, mastery-rule changes, developmental ordering inference or causal conclusions.

## Expected outcome

The expected successful W0 state is `FEASIBLE_FOR_W1_PROTOCOL`, while the analytical result remains descriptive and the curriculum registry remains Candidate.
