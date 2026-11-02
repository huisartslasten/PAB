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

## 8. Eerste verticale C6 → C7 slice

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

## 9. Belangrijke grens

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

## 10. Empirische vragen

C7 moet later empirisch worden getoetst op onder meer:

- voorspellende waarde van de gekozen next-action;
- foutieve escalatie naar volgende developments;
- gemiste prerequisites;
- effect van onzekerheid en contradicties;
- vergelijking van alternatieve action policies;
- leerlinguitkomsten na de voorgestelde actie.

C7 claimt daarom nog geen optimale pedagogische policy.
