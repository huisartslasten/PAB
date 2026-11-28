# PacoGO Curriculum — Generic Engine Audit after A1, B1 and FR2

Status: candidate architecture refinement
Datum: 2026-11-01

## 1. Purpose

Three vertical prototypes are used as an architecture stress test:
- A1 — Getallen representeren en verbinden
- B1 — Optellen
- FR2 — Breukequivalentie herkennen en gebruiken

The question is not whether these skills are empirically validated. The question is whether one generic engine can process structurally different skills without embedding hidden skill-specific curriculum logic.

## 2. Shared invariant chain

All three prototypes can be represented by:

CURRICULUM
→ SKILL
→ DEVELOPMENT MODEL
→ DEVELOPMENT
→ CLAIM
→ EVIDENCE TARGET
→ TASK MODEL
→ TASK INSTANCE
→ PERFORMANCE / OBSERVATION
→ EVIDENCE
→ EVIDENCE ASSESSMENT
→ DEVELOPMENTAL INFERENCE
→ MASTERY INFERENCE
→ DECISION
→ NEXT ACTION
→ NEW EVIDENCE

This chain is retained as the generic runtime architecture.

## 3. What is genuinely generic

### 3.1 Static curriculum objects
Generic:
- skill identity
- candidate development definitions
- developmental claims
- evidence targets
- task models
- complexity dimensions
- candidate prerequisites
- cross-skill relations
- mastery scope/criteria

The actual content of these objects is skill-specific; the object types are generic.

### 3.2 Dynamic learner objects
Generic:
- student
- task instance
- performance
- observation
- evidence
- evidence assessment
- developmental inference
- mastery state
- decision
- next action

The engine should not contain separate A1/B1/FR2 data structures.

### 3.3 Evidence assessment
The same generic dimensions apply:
- relevance
- quality
- coverage
- independence
- variation
- contradiction
- alternative explanations

The weighting or interpretation may differ by claim and must therefore live in curriculum/model configuration rather than hard-coded engine rules.

### 3.4 Developmental inference
Generic engine responsibility:
1. collect relevant evidence;
2. evaluate evidence according to configured claim/evidence rules;
3. compare observed evidence patterns with candidate development profiles;
4. preserve uncertainty and contradiction;
5. produce an inference with scope and confidence/status.

The engine must not contain statements such as “two correct equivalent fractions means D2” unless this is supplied as a curriculum/evidence rule.

### 3.5 Mastery
Generic engine responsibility:
- maintain mastery state;
- apply configured mastery criteria;
- distinguish insufficient evidence from not mastered;
- check contradiction;
- keep mastery claim/scope/time bound;
- revise state when new evidence arrives.

### 3.6 Decision / next action
Generic decision engine should ask:
- What is currently supported?
- What remains uncertain?
- What evidence is missing?
- Which next observation would reduce the most important uncertainty?
- Which eligible task models can generate that evidence?
- Are there instructional constraints or prerequisites?

The output is a next-action selection, not merely “give an easier/harder task.”

## 4. What must remain curriculum-specific

These must not be generalized into hard-coded engine logic:

- definition of a skill;
- meaning of each development;
- claim wording;
- evidence target definitions;
- mapping from observable behavior to evidence;
- task-model definitions;
- interpretation of strategies;
- what constitutes meaningful explanation;
- prerequisite hypotheses;
- development-specific mastery conditions;
- cross-skill relations;
- domain-specific alternative explanations.

Therefore:

ENGINE = generic reasoning/processing infrastructure.
CURRICULUM = domain/skill knowledge and interpretation rules.

## 5. Critical architecture finding

The first major abstraction boundary is now clear:

### Curriculum Registry
Stores what the system believes a skill/development/claim/evidence target/task model is.

### Evidence Engine
Converts observations into claim-relative evidence assessments according to configured rules.

### Development Engine
Builds developmental inferences from evidence patterns.

### Mastery Engine
Builds mastery states from configured mastery criteria.

### Decision Engine
Selects the next informative/appropriate action from the current learner state and available task models.

### Student Model
Stores the evolving evidence and inferences for one learner.

### Validation Layer
Compares these model decisions with observed longitudinal data and alternative models.

## 6. Minimal generic data contract

### Skill
- skill_id
- name
- definition
- status

### Development
- development_id
- skill_id
- definition
- candidate_order/status

### Claim
- claim_id
- development_id
- claim_definition

### EvidenceTarget
- evidence_target_id
- claim_id
- observable_definition

### TaskModel
- task_model_id
- evidence_target_ids
- complexity_profile
- required_inputs
- scoring/observation specification

### TaskInstance
- task_instance_id
- task_model_id
- generated parameters
- actual complexity profile

### Performance
- task_instance_id
- response
- correctness
- process data
- timing
- hints/attempts

### Evidence
- evidence_id
- performance/observation source
- claim_id
- evidence_target_id

### EvidenceAssessment
- relevance
- quality
- coverage contribution
- independence
- variation contribution
- contradiction
- alternative explanation

### DevelopmentalInference
- student_id
- development_id
- status
- supporting evidence
- contradictory evidence
- scope
- uncertainty

### MasteryState
- student_id
- claim/development scope
- status
- supporting evidence
- contradiction
- time validity

### Decision
- reason
- uncertainty targeted
- candidate actions
- selected action

### NextAction
- action_type
- task_model_id or instruction_id
- rationale
- expected evidence

## 7. What the engine must never infer directly

Never hard-code:

correct answer → development level
harder task → higher development
high score → mastery
age → development
number of attempts → development
response time → development
one task → mastery
same task repeated → evidence coverage
lack of practice → inability
verbal weakness → conceptual weakness

These relationships must either be explicitly configured as evidence hypotheses or empirically investigated.

## 8. Generic next-action algorithm — candidate

1. Identify active skill/claims in scope.
2. Retrieve current developmental evidence profile.
3. Identify supported, uncertain, contradictory and insufficient claims.
4. Determine the highest-priority information gap.
5. Retrieve task models capable of producing the missing evidence.
6. Filter for prerequisites, learner constraints and appropriate complexity.
7. Rank candidate actions by expected information gain plus instructional relevance.
8. Select one action.
9. Execute task and record observation.
10. Update evidence and inferences.
11. Re-evaluate mastery.
12. Repeat.

“Information gain” is currently a design concept, not yet a validated numerical metric.

## 9. Three-prototype result

A1, B1 and FR2 differ in construct type:
- A1: representational/structural
- B1: operational
- FR2: relational/conceptual

Yet the same engine objects and processing sequence remain usable.

This is meaningful architectural evidence for generality of the model, but it is NOT empirical evidence that the curriculum constructs or developmental classifications are valid.

## 10. Architecture decision

KEEP the generic vertical architecture.

Do NOT create:
- A1 engine
- B1 engine
- FR2 engine

Instead create:
- one generic curriculum registry;
- one generic evidence pipeline;
- one generic development inference service;
- one generic mastery service;
- one generic decision service;
- skill-specific configuration/data.

## 11. Remaining unresolved questions before coding

1. How exactly are evidence rules represented as machine-readable configuration?
2. How are contradictory evidence and alternative explanations represented?
3. How is uncertainty represented without inventing a false precision score?
4. How does the decision engine rank multiple valid next actions?
5. How are cross-skill evidence contributions handled without double counting?
6. How are longitudinal updates represented?
7. How does empirical validation replace candidate rules later?
8. How is explainability generated for learner/parent without exposing internal technical complexity?

## 12. Next phase

The vertical prototype phase has established the candidate abstraction boundary.

Next: design the **machine-readable curriculum specification** for one skill, including development, claims, evidence targets, task models, evidence rules, mastery rules and next-action rules.

Only after that should the first real engine code be implemented.
