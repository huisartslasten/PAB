# PacoGO — Adaptive Instruction Layer Architecture Specification v0.1

Status: design proposal; not yet approved for runtime implementation
Date: 2026-11-12
Branch: `refactor/professional-v1`
Scope: reusable instructional-method selection and configuration across Learning Interfaces
Baseline: current curriculum handoff and implemented Fraction Learning Interface

## 1. Purpose

Define the architecture boundary needed before PacoGO implements method-specific teaching or feedback inside a Learning Interface.

The Adaptive Instruction Layer selects and configures *how* an existing curriculum objective is explained and practised. It does not define *what* the learner must learn, create curriculum skills, assess formal evidence, infer mastery, or choose developmental progression.

This layer must support differences between schools, teachers and learners without assuming one universal instructional procedure.

## 2. Governing separation

Keep four concerns distinct:

1. **Curriculum objective** — the registered skill, development, claim, task and evidence contract. It remains authoritative and is not rewritten by instructional preferences.
2. **Instructional method profile** — a sourced description of the method, terminology, notation and procedure used in a particular learning context.
3. **Instruction configuration** — the selected explanation, representation, examples, sequence, prompts and feedback rules for one learning episode.
4. **Learning Interface** — the reusable pedagogical instrument that renders and captures learner interaction. It must not own method provenance or curriculum decisions.

The dependency direction is:

`curriculum/task contract → instructional selection → interface configuration → learner interaction`

Observed learner interaction may inform a request for confirmation, but it must not silently establish which method the school teaches.

## 3. Method profile and provenance

A method profile must include, at minimum:

- stable profile identifier and version;
- applicable subject/domain and topic scope;
- method name as supplied or confirmed;
- procedural steps, including ordering where relevant;
- notation and terminology;
- representations and worked-example conventions;
- known constraints or exceptions;
- source type and source reference;
- who confirmed or supplied it (where available);
- confirmation date and review status;
- confidence/status: `confirmed`, `provisional`, or `unknown`.

Supported source types should include parent confirmation, teacher confirmation, school-provided workbook/material, and other explicitly identified sources. A photographed board or worksheet can establish what appears in that material; it does not by itself prove that the method is exclusive or universally required.

Never infer a confirmed profile from a learner's answer pattern. Preserve source material and provenance rather than paraphrasing uncertain procedure into a false school rule.

If profiles conflict, preserve both sources and mark the applicable method as unresolved until the conflict is clarified. Do not silently choose the newest or most convenient method.

## 4. Selection rules

Selection is scoped to the learner, school/class context (when known), topic and learning episode.

- A confirmed, applicable profile may configure instruction.
- A provisional profile may be used only with its uncertainty visible to the parent/teacher and without claiming school alignment.
- An unknown or conflicting profile must not trigger a guessed school-specific procedure.
- When method is unknown, use a method-neutral conceptual explanation and visual representation that preserves mathematical meaning, or request confirmation if the choice materially changes the steps taught.
- The selected method and the reason for selection must be inspectable.
- Curriculum objective and mathematical validity remain invariant across method profiles.

The selector must return an explicit outcome, not silently fall back:

- `selected_confirmed`
- `selected_provisional`
- `conceptual_fallback_unknown`
- `confirmation_required_conflict`
- `unsupported_method`

## 5. Instruction configuration contract

A configuration should be immutable for the duration of one instructional episode and contain:

- curriculum/task reference (resolved by the existing curriculum runtime, never invented by this layer);
- selected method profile ID/version or explicit unknown/fallback state;
- learning objective expressed in learner-facing language;
- representation sequence and renderer settings;
- example parameters and worked-example visibility;
- learner action sequence and input types;
- hint/feedback policy;
- simplification policy (learner-controlled when requested or required; never silently perform it for the learner);
- language, terminology and accessibility labels;
- provenance references and selection outcome.

The configuration is pedagogical presentation data. It must not contain inferred mastery, evidence quality, development order or an instruction to award formal credit.

## 6. Relationship to diagnostic and learner data

The formative fraction diagnostic may identify observed response patterns and raw intermediate values. These may support a *candidate instructional need*, but a classification such as `invalid_relation`, `arithmetic_error` or `dependent_consistent` is not by itself a stable learner trait or proof of a specific misconception.

The instructional selector must therefore:

- retain the distinction between raw response and diagnostic classification;
- avoid translating a single response into a permanent learner profile;
- use the earliest independently observed difficulty as a tentative routing signal only where the diagnostic contract supports it;
- preserve uncertainty and allow parent/teacher override;
- avoid formal evidence, inference, mastery, next-action or learner-state writes unless a separately approved contract explicitly authorises them.

The existing v2 diagnostic local-storage contract remains unchanged.

## 7. Fraction scope and curriculum boundary

The current candidate curriculum registry contains FR2 — *Breukequivalentie herkennen en gebruiken* — as the only registered fraction-related skill found in the v0.6 candidate registry.

FR2 must remain limited to its registered objective and evidence contract. The fact that FR2.D3 describes functional use of equivalence for calculating does not authorise PacoGO to place all fraction addition, subtraction, mixed-number conversion or simplification objectives under FR2.

The current F1–F4 diagnostic samples:
- equivalent fraction scaling;
- common-denominator construction in addition and subtraction;
- numerator conversion;
- addition/subtraction after conversion;
- conditional mixed-number conversion and subtraction.

These are formative diagnostic episodes, not newly registered curriculum skills or formal evidence targets.

Before building full teaching sequences for these operations, the curriculum work must identify the appropriate SLO-aligned skill/development/claim/task contracts or explicitly keep the activity as non-formal, provisional practice pending that work. Do not invent registry IDs or formal mappings in interface code.

## 8. Learning Interface integration

The Adaptive Instruction Layer configures the existing reusable interface; it does not fork a separate interface for every method or skill.

For Fraction, keep the current three-layer separation:
- pedagogical/function configuration;
- interaction/state/evidence capture;
- visual/rendering.

The Fraction renderer may support multiple representations, but the instructional method determines which are pedagogically appropriate for the episode. Renderer capability alone is not evidence that a method or curriculum objective is supported.

The same architecture should later serve Number Line, Clock, Measurement and Ratio. Method profiles must be domain-scoped; a fraction procedure must not leak into another interface.

## 9. Practice episode and progression

A practice episode should be assembled from:
1. an objective and scope approved for the episode;
2. an instruction configuration selected under §4;
3. a short explanation/model where needed;
4. learner-controlled worked steps;
5. independent practice without revealing future answers;
6. formative feedback that explains the mathematical relation without misrepresenting the school's method;
7. an optional unaided check clearly distinguished from formal assessment.

A correct response can complete a practice item, but it must not automatically create formal mastery. Repeated practice completion is not a substitute for the C1–C9 evidence, inference and mastery contracts.

Practice state must remain separate from diagnostic state and formal learner state. Any persistence design must be learner-isolated, versioned and non-destructive; no Supabase change is presumed.

## 10. Open decisions before implementation

1. Confirm which current school method and terminology Zyon is expected to use for common denominators, addition/subtraction and mixed numbers. Record the exact source and what it does and does not establish.
2. Decide whether method profiles are initially parent-managed only or require a teacher/school source workflow.
3. Define the minimum profile schema and conflict-resolution workflow.
4. Identify the curriculum/SLO mapping for fraction operations beyond FR2, or explicitly approve a non-formal practice scope while curriculum research continues.
5. Define how diagnostic classifications route to *tentative instructional needs* without creating learner traits or formal next-action decisions.
6. Specify hint levels and the boundary between guided practice, independent practice, tussentoets and toets.
7. Decide the minimum interaction/event data required for practice progress without expanding formal evidence contracts.
8. Review the diagnostic's actual visual presentation in PacoGO TEST before using it with Zyon. Automated browser regression is not a substitute for this review.

## 11. Non-goals and prohibitions

This specification does not authorise:
- changes to FR2 or any other curriculum registry entry;
- new formal claims, evidence targets or task models;
- changes to C1–C9, mastery or next-action rules;
- automatic school-method inference from learner responses;
- automatic simplification or completion of learner steps;
- reuse of synthetic browser observations as real learner evidence;
- changes to Supabase schema, RPCs or RLS;
- a separate bespoke Fraction interface for each skill or method.

## 12. Proposed implementation sequence

1. Review and approve this architecture specification.
2. Confirm the school method/profile source and settle the open decisions in §10.
3. Design a pure, testable method-profile validator and selector; test confirmed, provisional, unknown, conflicting and unsupported cases.
4. Design an immutable instructional configuration contract independent of DOM/rendering.
5. Integrate configuration with the reusable Fraction interface without changing curriculum/evidence boundaries.
6. Define the correct curriculum scope for fraction-operation practice before adding formal task bindings.
7. Add guided and independent practice episodes, with learner-controlled simplification and distinct help policies.
8. Verify the complete learner route in PacoGO TEST and run Full Regression on every bounded implementation and documentation change.

**Approval status:** proposal only. No runtime implementation is authorised by this document alone.
