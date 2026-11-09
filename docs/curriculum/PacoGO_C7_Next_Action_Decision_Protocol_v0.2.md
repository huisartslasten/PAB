# PacoGO Curriculum — C7 Next-Action Decision Protocol v0.2

Status: candidate protocol
Datum: 2026-11-02

## 1. Doel

C7 specificeert hoe PacoGO uit expliciet vastgelegde leerstatus, evidence en gevalideerde ontwikkelingsinformatie een kandidaat voor de volgende leeractie kan formuleren.

C7 is geen runtime-instructieregel. Het is een empirisch te toetsen beslisprotocol dat de overgang maakt van **wat weten we over de leerling?** naar **welke volgende ontwikkeling of actie is op basis daarvan verantwoord om te onderzoeken?**

## 2. Fundament

C7 gebruikt alleen expliciete informatie uit eerdere curriculumlagen:

- curriculumclaim en development-context;
- actuele evidence en evidencekwaliteit;
- C6 mastery-uitkomst;
- C5 ontwikkelingsordening als die empirisch ondersteund is;
- expliciete alternatieve hypotheses;
- scope en tijdvenster;
- bekende beperkingen of contradicties.

C7 mag geen ontbrekende informatie invullen en mag geen ontwikkelingsvolgorde afleiden die niet door de voorafgaande onderzoekslaag wordt ondersteund.

## 3. Kandidaatacties

Een C7-beslissing mag alleen kiezen uit expliciet beschikbare kandidaat-acties:

- `REASSESS_CURRENT_DEVELOPMENT`
- `PRACTICE_CURRENT_DEVELOPMENT`
- `ASSESS_PREREQUISITE_DEVELOPMENT`
- `ASSESS_NEXT_DEVELOPMENT`
- `PRACTICE_NEXT_DEVELOPMENT`
- `HOLD_FOR_MORE_EVIDENCE`

De lijst is geen universele instructieset. De beschikbare kandidaten worden per curriculumcontext vooraf bepaald.

## 4. Expliciete state-domeinen

C7 behandelt ordering van een prerequisite en ordering naar een volgende development als **twee verschillende informatievelden**.

### `prerequisite_ordering_state`

Geeft uitsluitend aan wat bekend is over de ordering-hypothese die nodig is om een prerequisite-assessment verantwoord te maken.

### `next_development_ordering_state`

Geeft uitsluitend aan wat bekend is over de ordering-hypothese die nodig is om een next-development actie verantwoord te maken.

Deze velden mogen niet worden samengevoegd tot één generieke `ordering_state`. Onzekerheid over de volgende development mag een kandidaat voor prerequisite-assessment niet blokkeren wanneer de prerequisite-ordering zelf voldoende basis biedt voor die kandidaat.

## 5. Beslisgates

### A1 — State validity

De actuele leerstatus moet volledig en intern consistent zijn.

### A2 — Evidence sufficiency

Er moet voldoende bruikbare evidence zijn om een actie te rechtvaardigen. Onvoldoende evidence mag niet worden omgezet in een schijnbaar zekere actie.

### A3 — Mastery interpretation

De C6-uitkomst moet expliciet worden meegenomen. `MASTERED`, `NOT YET MASTERED`, `INSUFFICIENT EVIDENCE`, `CONTRADICTORY` en `NOT ASSESSED` mogen niet als synoniemen worden behandeld.

### A4 — Developmental ordering support

A4 wordt **actie-specifiek** toegepast:

- voor `ASSESS_PREREQUISITE_DEVELOPMENT` wordt alleen `prerequisite_ordering_state` beoordeeld;
- voor `ASSESS_NEXT_DEVELOPMENT` en `PRACTICE_NEXT_DEVELOPMENT` wordt alleen `next_development_ordering_state` beoordeeld.

`NOT_ASSESSED`, `UNCERTAIN` en `NOT_SUPPORTED` blokkeren alleen de actie waarvoor die specifieke ordering nodig is.

### A5 — Alternative explanation control

Wanneer meerdere verklaringen voor de actuele prestatie plausibel blijven, moet de actie de onzekerheid adresseren in plaats van deze te negeren.

### A6 — Action fit

De kandidaatactie moet passen bij de actuele claim, development, scope en beschikbare evidence. Assess-vs-practice wordt uitsluitend bepaald door expliciete action policy.

### A7 — Safety / authorization boundary

C7 formuleert uitsluitend een kandidaatactie. Het mag geen leerlingstatus, curriculumregistry, masterystatus of runtime-opdracht muteren.

## 6. Beslisarchitectuur

De technische beslisarchitectuur bestaat uit twee fasen.

### Fase 1 — algemene gates

```text
insufficient evidence
→ HOLD

mastery niet bruikbaar
→ HOLD

alternatives niet beoordeeld / unresolved
→ HOLD of REASSESS volgens expliciete policy

current development niet mastered
→ current-development candidate
```

### Fase 2 — candidate-specifieke ordering

```text
MASTERED
    ↓
prerequisite candidate
    ├─ prerequisite ordering UNCERTAIN
    │    → ASSESS_PREREQUISITE_DEVELOPMENT / HOLD
    ├─ prerequisite ordering NOT_ASSESSED
    │    → ASSESS_PREREQUISITE_DEVELOPMENT / HOLD
    ├─ prerequisite ordering NOT_SUPPORTED
    │    → HOLD
    └─ prerequisite ordering SUPPORTED
         → evaluate next-development candidate

next-development candidate
    ├─ next ordering NOT_ASSESSED
    ├─ next ordering NOT_SUPPORTED
    ├─ next ordering UNCERTAIN
    │    → HOLD
    └─ next ordering SUPPORTED
         → ASSESS_NEXT_DEVELOPMENT / PRACTICE_NEXT_DEVELOPMENT
```

De kernregel is dat een gate alleen de kandidaatactie blokkeert waarvoor die gate relevant is.

## 7. C6 → C7 handoff

De C6-uitkomst is de bron voor de mastery-state van C7. C7 mag de mastery-state niet opnieuw berekenen of reconstrueren uit onderliggende scores.

De C6 → C7 adapter mag uitsluitend een gevalideerde C6-uitkomst doorgeven wanneer de C6-safetygrenzen actief blijven:

- `registry_promotion_allowed = false`;
- `runtime_mastery_write_allowed = false`;
- `developmental_ordering_inference_allowed = false`;
- `automatic_next_action_allowed = false`.

De adapter geeft orderinginformatie expliciet en gescheiden door als:

- `prerequisite_ordering_state`;
- `next_development_ordering_state`.

De adapter leidt deze waarden niet af uit C6.

## 8. Owner-approved Stage C decision-record boundary

**Owner decision, 2026-11-08:** a C7 next-action decision is a distinct immutable logical record with its own identity. It is not the C6 evaluation record and must reference the exact committed C6 evaluation it consumes.

The C7 decision record preserves:
- its own C7 decision identity;
- the exact C6 evaluation identity/reference;
- the unchanged complete six-part branch identity;
- the exact immutable decision snapshot reference carried by C6;
- the exact C6 mastery outcome consumed, without recomputation;
- C7's explicit candidate set, decision result/trace and applicable action-policy/protocol provenance.

C7 may be committed only after the exact C6 evaluation it consumes has been durably committed. If the C7 write fails, the C6 evaluation remains committed and unchanged. A later C7 retry must consume that same C6 evaluation; it must not rerun C6, replace its result or rewrite its history.

C6 and C7 are separate ordered atomic record writes within O7's existing decision-evaluation idempotency boundary. They do not create additional top-level O7 boundaries and are not one shared indivisible C6/C7 write unit. O7's same-identity/same-payload replay and same-identity/different-payload integrity-conflict rule applies independently to each immutable record.

**Still open:** final field names and physical identity namespaces/uniqueness, canonical payload equality details, physical keys/tables, transaction technology, retry/concurrency mechanics and persistence implementation. This section does not select them.

## 9. Eerste verticale C6 → C7 slice

```text
C6 mastery assessment
        ↓
C6 mastery_state_by_claim
        ↓
C6 safety-boundary validation
        ↓
C7 input adapter
        ↓
algemene C7 gates
        ↓
prerequisite candidate gate
        ↓
next-development candidate gate
        ↓
C7 decision trace
        ↓
candidate next-action
```

Minimaal moet worden aangetoond dat:

1. `MASTERED + prerequisite_ordering NOT_ASSESSED + next ordering UNCERTAIN` kan leiden tot `ASSESS_PREREQUISITE_DEVELOPMENT` wanneer de action policy dit toestaat;
2. `MASTERED + prerequisite ordering SUPPORTED + next ordering UNCERTAIN` geen next-development actie oplevert;
3. `MASTERED + prerequisite ordering SUPPORTED + next ordering SUPPORTED` uitsluitend via expliciete action policy naar assess/practice next kan leiden;
4. niet-mastered C6-uitkomsten geen next-development advancement opleveren;
5. C7 geen runtime-state muteert.

**Belangrijke contractkwalificatie bij deze eerste slice:** de illustratieve lookup `mastery_state_by_claim` is claim-keyed en draagt op zichzelf niet de volledige zesdelige branch-identiteit, snapshotreferentie en C6-evaluatie-identiteit. Deze slice is daarom geen canonieke C6→C7-adapter-specificatie en mag niet rechtstreeks als implementatiecontract worden gebruikt. G5/G7 moeten de canonieke adapter en de relatie tot de bestaande claim-keyed prototypepaden expliciet reconciliëren. De owner-approved recordgrens in §8 en de exacte lineage-eisen blijven leidend; er wordt hier geen runtimepad gekozen.

## 10. Belangrijke grens

C7 is geen aanbevelingsalgoritme dat zelfstandig nieuwe onderwijsstappen bedenkt.

C7 mag:

- expliciete state combineren;
- expliciete candidate actions vergelijken;
- relevante gates per kandidaat toepassen;
- redenen en gebruikte evidence zichtbaar maken;
- een deterministische kandidaatactie opleveren;
- de interne coherentie van de decision trace controleren.

C7 mag niet:

- een ontbrekende development verzinnen;
- een prerequisite aannemen zonder relevante ordering-support;
- mastery opnieuw berekenen buiten C6;
- een verborgen score of drempel gebruiken;
- automatisch een leerling laten doorgaan;
- runtime-state muteren.

## 11. Empirische vragen

C7 moet later empirisch worden getoetst op onder meer:

- voorspellende waarde van de gekozen next-action;
- foutieve escalatie naar volgende developments;
- gemiste prerequisites;
- effect van onzekerheid en contradicties;
- vergelijking van alternatieve action policies;
- leerlinguitkomsten na de voorgestelde actie.

C7 claimt daarom nog geen optimale pedagogische policy.

## G5-S3 — Official logical Stage C identity field names

**Owner decision: approved 2026-11-08.** The official logical field names are:

- `decision_snapshot_id` — identity/reference for the immutable decision snapshot;
- `c6_evaluation_id` — identity/reference for the immutable C6 mastery evaluation;
- `c7_decision_id` — identity/reference for the immutable C7 next-action decision.

O8's `evaluation_id` is the generic historical/source term for the C6 evaluation identity; it is not a second identity and must be interpreted as `c6_evaluation_id` in the reconciled cross-stage logical contract. C7's own decision identity is distinct and is named `c7_decision_id`.

This approval standardizes **logical field names only**. It does not decide physical ID formats, generation, namespaces or uniqueness scopes, database columns/keys/tables, serialization, hashing, storage, transactions, retry/concurrency mechanics or persistence APIs. Those remain assigned to their existing G6/G9/G8/G10 gates.

This decision resolves only G5's logical field-naming item. It does not close G5, G6 or G9; does not alter the approved Stage C record/write boundary; and does not authorize runtime, tests, schema, SQL/RPC/RLS, database or Supabase changes. G12 remains NOT AUTHORIZED.

## G5-S4 — C7 HOLD vocabulary: source-reconciled clarification

**Finding: source-derived; no separate owner policy decision is required for the current C7 v0.2 contract.**

The active C7 v0.2 candidate-action list (§3) defines exactly six candidate actions. Its only hold action is `HOLD_FOR_MORE_EVIDENCE`. The unqualified word `HOLD` appears in §6's explanatory decision-flow sketches; it is not defined there as a separate candidate action, decision-result enum, or persisted status.

This interpretation is corroborated by the existing C7 v0.2 validation matrix and maintained engine contract:
- `PacoGO_C7_Decision_Test_Matrix_v0.1.json` (matrix version 0.2) expresses each hold scenario as `expected.candidate_action = HOLD_FOR_MORE_EVIDENCE`;
- `pacogo-engine/c7-contracts.js` defines `HOLD_FOR_MORE_EVIDENCE` as the only hold candidate;
- `pacogo-engine/c7-next-action-decision.js` emits that candidate for insufficient evidence, unusable/unassessed mastery, unsupported/uncertain ordering and unauthorized next actions;
- maintained C7 tests assert the exact candidate value; they do not define or accept a separate `HOLD` candidate;
- C8 v0.2 stores the exact C7 output in `next_action`, without reinterpretation.

**Reconciled meaning:** in C7 v0.2 explanatory flow prose, `HOLD` is shorthand for selecting the explicit candidate action `HOLD_FOR_MORE_EVIDENCE`. It is not a seventh action, separate terminal status, or alternative serialized value. The decision reason and gate continue to explain why that candidate was selected. When a C7 output is recorded or passed downstream, the exact candidate value `HOLD_FOR_MORE_EVIDENCE` is preserved.

This clarification does not change the action policy, candidate set, gate behavior, decision reasons, C6 mastery outcomes, C8 descriptive authority or C9 validation authority. It does not authorize runtime/test changes, schema, SQL/RPC/RLS, persistence or Supabase work. Existing engine and test artifacts were inspected read-only; no code or tests were changed.

**G5 effect:** the HOLD vocabulary ambiguity is resolved at the logical contract level by the active protocol, validation matrix and maintained engine/test evidence. G5 remains OPEN for its other reconciliation deliverables. G6/G9 remain OPEN; G12 remains NOT AUTHORIZED.

## G5-S5 — C6→C7 adapter ownership and prototype-path audit

**Status: read-only source audit; canonical adapter ownership remains OPEN.**

### Existing source paths inspected

1. `pacogo-engine/c6-c7-adapter.js` exports `validateC6SafetyBoundary` and `createC7InputFromC6`. It selects `c6Result.mastery_state_by_claim[options.claim_id]`, requires caller-supplied C7 context, and checks the supplied current development against the selected C6 result.
2. `pacogo-engine/c7-from-c6.js` exports `validateC6ResultForC7` and `buildC7InputFromC6`. It also selects `c6_result.mastery_state_by_claim[claim_id]`, but derives current development from the selected C6 result. It separately validates ordering/alternative states before building the C7 input.
3. Both paths enforce the existing C6 safety flags and construct the same general claim/development-keyed C7 input shape. They are distinct modules with overlapping adapter responsibility and different function/input contracts.
4. The maintained tests for each adapter exercise the corresponding path. `c6-c7-vertical-slice.test.js` and `c8-c9-real-vertical-slice.test.js` exercise `buildC7InputFromC6` from `c7-from-c6.js`. This proves test-fixture usage, not production runtime ownership.
5. `pacogo-engine/c8-c9-adapter.js` is a separate downstream bridge. It accepts either a claim-keyed C6 result plus claim ID or an already normalized claim result, then checks claim/development alignment and maps the C7 `candidate_action` to C8's `next_action`. It does not establish canonical six-part branch/snapshot/C6/C7 identity lineage.

### Contract gap established

The current C6 engine result exposes `mastery_state_by_claim` and safety flags, but no immutable `decision_snapshot_id`, `c6_evaluation_id` or complete six-part branch envelope. The current C7 engine output similarly contains claim/development, candidate action, reason, gate, supporting evidence and safety flags, but no `c7_decision_id` or exact upstream lineage references.

Therefore neither existing C6→C7 adapter can be designated the canonical Stage C adapter merely because its tests pass. Both are claim-keyed prototype paths, consistent with the explicit non-canonical warning in C7 v0.2 §9. The downstream C8/C9 adapter is also a prototype bridge, not a canonical lineage adapter.

### Ownership boundary and recommendation

- **G5 owns** the logical C6→C7 input/output envelope and exact lineage requirements, under the already approved Stage C record boundary and official names `decision_snapshot_id`, `c6_evaluation_id`, `c7_decision_id`.
- **G7 owns** consumer compatibility, inventory of existing call paths, and any explicit deprecation/transition plan. G7 must not choose a logical contract by implementation convenience.
- **G12 remains the only narrow implementation-authorization gate.**

**Recommendation for owner disposition:** retain both existing C6→C7 adapters and the C8/C9 bridge as non-canonical prototype/test paths; do not designate either as the canonical adapter. Define the canonical adapter only from the approved full Stage C lineage envelope after G5/G7 reconciliation. Do not delete, merge, refactor or route runtime traffic in this audit.

This is a recommendation, not an owner decision. No code or tests were changed; no runtime, curriculum, registry, learner state, schema, database, SQL/RPC/RLS or Supabase was changed. The existing adapters were inspected read-only.

**Next owner decision required:** confirm whether both existing C6→C7 adapters and the downstream C8/C9 bridge are to remain explicitly non-canonical prototype/test paths, with no path designated canonical at this stage.
