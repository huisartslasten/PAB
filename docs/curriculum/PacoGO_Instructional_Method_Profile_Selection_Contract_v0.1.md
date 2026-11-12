# PacoGO — Instructional Method Profile and Selection Contract v0.1

Status: design proposal; not approved for runtime implementation
Date: 2026-11-12
Branch: `refactor/professional-v1`
Parent: `PacoGO_Adaptive_Instruction_Layer_Architecture_Specification_v0.1.md`

## 1. Purpose

Specify the minimum data contract and deterministic selection behaviour for instructional method profiles. This contract records what a school, teacher or parent has actually supplied; it does not infer a teaching method from learner performance.

This is a design artefact only. It introduces no runtime storage, learner data, curriculum mapping or Supabase change.

## 2. Core entities

### 2.1 Method profile

A method profile is a versioned, domain-scoped description of an instructional approach.

Required fields:

| Field | Meaning |
|---|---|
| `profile_id` | Stable identifier, unique within its owning context |
| `version` | Positive integer, incremented when instructional meaning changes |
| `status` | `confirmed`, `provisional`, `unknown`, or `superseded` |
| `domain` | Controlled domain identifier, e.g. `fractions` |
| `topic_scope` | Explicit topics to which the profile applies |
| `method_label` | Human-readable name; must not imply more certainty than the source |
| `steps` | Ordered procedural description, expressed as observable instructional steps |
| `representations` | Supported representations and their intended role |
| `notation` | Symbols, layout and terminology used by the source |
| `constraints` | Known exceptions, prerequisites and limitations |
| `sources` | One or more provenance records |
| `created_at` | Creation timestamp |
| `reviewed_at` | Last review timestamp, nullable |
| `review_note` | What was checked and what remains uncertain |

A profile with status `unknown` is a typed absence marker, not a fabricated profile. It must not contain invented steps.

### 2.2 Provenance record

Each source record contains:

- `source_id`: stable identifier;
- `source_type`: `parent_confirmation`, `teacher_confirmation`, `school_material`, `workbook`, `classroom_observation`, or `other`;
- `source_reference`: file/document reference or a concise description; never a fabricated URL;
- `observed_content`: factual description of what the source shows or states;
- `scope_supported`: the exact topic and context supported by the source;
- `limitations`: what the source does not establish;
- `provided_by`: optional role/name label, only when appropriate;
- `captured_at`: date the source was supplied;
- `confirmation_level`: `direct_confirmation`, `material_observation`, or `unconfirmed_report`.

A photograph of a board is normally `material_observation`; it can document the displayed procedure. It is not automatically direct confirmation that the procedure is mandatory, exclusive or used for every related topic.

### 2.3 Selection request

A selection request is episode-scoped and includes:

- learner context key (opaque; no direct identifying data in the profile);
- domain and topic;
- requested learning objective/task reference supplied by the curriculum runtime;
- applicable school/class context, if known;
- available profile IDs and versions;
- explicit parent/teacher override, if supplied;
- whether the episode requires school-method alignment.

The selector must not search learner response history to invent or upgrade a method profile.

### 2.4 Selection result

Return:

- `outcome`: one of the outcomes in §3;
- `profile_id` and `profile_version`, nullable;
- `reason_code`;
- `applicable_scope`;
- `source_ids`;
- `requires_confirmation`;
- `method_alignment_claim`: `confirmed`, `provisional`, or `not_claimed`.

The result is inspectable and deterministic for the same request and profile set.

## 3. Deterministic selector outcomes

The selector must apply these rules in order:

1. Reject malformed profiles, unsupported domain/topic scope and invalid versions as `unsupported_method`; do not partially apply them.
2. If an explicit authorised override selects one applicable profile, select it and preserve the override provenance. An override cannot make an unsupported profile mathematically valid or expand its topic scope.
3. If multiple applicable profiles make materially conflicting procedural claims and no explicit override resolves the conflict, return `confirmation_required_conflict`.
4. If exactly one applicable profile is `confirmed` and its provenance supports the requested scope, return `selected_confirmed`.
5. If exactly one applicable profile is `provisional`, return `selected_provisional`; method alignment must remain labelled provisional.
6. If no applicable profile exists, return `conceptual_fallback_unknown` unless the request explicitly requires school-method alignment, in which case request confirmation.
7. A `superseded` profile is never selected by default. It remains available for audit/history.

Do not resolve conflict by newest timestamp, majority vote, frequency of learner responses or convenience.

## 4. Conflict definition

A conflict exists when two sources prescribe incompatible instructional choices for the same topic and context, such that selecting one changes the learner-facing procedure or expected notation.

Differences that are mathematically equivalent and both permitted by the supplied sources are not automatically conflicts. Record the difference and source scope. If the sources do not say whether alternatives are accepted, mark the relationship unresolved rather than deciding on their behalf.

## 5. Fraction-specific profile capture

For Zyon's current fraction work, capture separately whether the source addresses:

- equivalent fraction construction;
- common-denominator selection;
- addition after conversion;
- subtraction after conversion;
- mixed-number to improper-fraction conversion;
- simplification and when it is expected;
- final-answer notation.

Do not assume that one source covers all seven topics. Each topic requires explicit scope support.

The supplied classroom examples demonstrate a product-denominator procedure and whole-number × denominator + numerator conversion in the photographed material. Until direct confirmation or broader school material is supplied, record this as observed material, not as an exclusive school rule.

## 6. Privacy and data minimisation

- Store only the information needed to select and explain an instructional configuration.
- Keep learner identity outside reusable method profiles; use an opaque context reference at selection time.
- Do not store unnecessary names, school identifiers or sensitive family details in provenance.
- Keep source references access-controlled under the applicable project data policy.
- A method profile is instructional context, not a learner ability or diagnostic label.

## 7. Validation requirements for a future pure selector

Before runtime integration, implement unit tests for at least:

1. one applicable confirmed profile;
2. one applicable provisional profile;
3. no profile and no school-alignment requirement;
4. no profile with school-alignment requirement;
5. two conflicting confirmed profiles;
6. explicit authorised override resolving a conflict;
7. unsupported topic scope;
8. malformed or incomplete profile;
9. superseded profile only;
10. mathematically equivalent alternatives that are not a conflict;
11. source scope narrower than the requested topic;
12. deterministic repeated selection with identical inputs.

Tests must verify that the selector never upgrades provisional or observed material to confirmed, never invents profile steps, never changes curriculum/task identity, and never writes learner mastery/evidence state.

## 8. Open decisions

1. Which role is authorised to confirm a school method in the initial product: parent, teacher, or either with distinct authority labels?
2. Does an explicit parent override select a home-practice method only, or may it override a school-alignment requirement? The default proposed here is that it cannot claim school alignment without a school/teacher source.
3. What source retention and access rules apply to photographs or workbook uploads?
4. What exact topics and procedures does the current school expect for Zyon? The available board examples do not settle exclusivity or full topic coverage.
5. What is the approved SLO curriculum scope for fraction operations beyond FR2?

## 9. Implementation gate

This contract may proceed to a pure validator/selector implementation only after the parent architecture proposal is reviewed and the authority/override decisions in §8 are resolved. No interface changes, learner-data writes, curriculum registry changes, formal evidence changes or Supabase changes are authorised here.

**Approval status:** proposal only.
