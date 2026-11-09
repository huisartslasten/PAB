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
