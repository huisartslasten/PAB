# PacoGO Curriculum — C7 Next-Action Decision Protocol v0.1

Status: candidate protocol
Datum: 2026-11-02

## 1. Doel

C7 specificeert hoe PacoGO uit expliciet vastgelegde leerstatus, evidence en gevalideerde ontwikkelingsinformatie een kandidaat voor de volgende leeractie kan formuleren.

C7 is geen runtime-instructieregel. Het is een empirisch te toetsen beslisprotocol dat de overgang maakt van **wat weten we over de leerling?** naar **welke volgende ontwikkeling of actie is op basis daarvan verantwoord om te onderzoeken?**

## 2. Fundament

C7 mag alleen informatie gebruiken die expliciet beschikbaar is uit eerdere curriculumlagen:

- curriculumclaim en development-context;
- actuele evidence en evidencekwaliteit;
- C6 mastery-uitkomst;
- C5 ontwikkelingsordening als die empirisch ondersteund is;
- expliciete alternatieve hypotheses;
- scope en tijdvenster;
- bekende beperkingen of contradicties.

C7 mag geen ontbrekende informatie invullen en mag geen ontwikkelingsvolgorde afleiden die niet door de voorafgaande onderzoekslaag wordt ondersteund.

## 3. Kandidaten voor een volgende actie

Een C7-beslissing mag alleen kiezen uit expliciet beschikbare kandidaat-acties, bijvoorbeeld:

- `REASSESS_CURRENT_DEVELOPMENT`
- `PRACTICE_CURRENT_DEVELOPMENT`
- `ASSESS_PREREQUISITE_DEVELOPMENT`
- `ASSESS_NEXT_DEVELOPMENT`
- `PRACTICE_NEXT_DEVELOPMENT`
- `HOLD_FOR_MORE_EVIDENCE`

De lijst is geen universele instructieset. De beschikbare kandidaten worden per curriculumcontext vooraf bepaald.

## 4. Beslisgates

### A1 — State validity

De actuele leerstatus moet volledig en intern consistent zijn.

### A2 — Evidence sufficiency

Er moet voldoende bruikbare evidence zijn om een actie te rechtvaardigen. Onvoldoende evidence mag niet worden omgezet in een schijnbaar zekere actie.

### A3 — Mastery interpretation

De C6-uitkomst moet expliciet worden meegenomen. `MASTERED`, `NOT YET MASTERED`, `INSUFFICIENT EVIDENCE`, `CONTRADICTORY` en `NOT ASSESSED` mogen niet als synoniemen worden behandeld.

### A4 — Developmental ordering support

Een actie die een volgende development of prerequisite veronderstelt mag alleen worden voorgesteld wanneer de relevante ordering-hypothese expliciet voldoende ondersteund is binnen de toepasselijke scope. `NOT_ASSESSED`, `UNCERTAIN` en `NOT_SUPPORTED` blokkeren een actie die deze ordering nodig heeft.

### A5 — Alternative explanation control

Wanneer meerdere verklaringen voor de actuele prestatie plausibel blijven, moet de actie de onzekerheid adresseren in plaats van deze te negeren.

### A6 — Action fit

De kandidaatactie moet passen bij de actuele claim, development, scope en beschikbare evidence.

### A7 — Safety / authorization boundary

C7 mag uitsluitend een kandidaatactie formuleren. Het mag geen daadwerkelijke leerlingstatus, curriculumregistry, masterystatus of runtime-opdracht muteren.

## 5. Beslisvolgorde

```text
ongeldige of inconsistente state
→ HOLD_FOR_MORE_EVIDENCE

onvoldoende / niet-beoordeelde evidence
→ HOLD_FOR_MORE_EVIDENCE

onopgeloste contradictie
→ REASSESS_CURRENT_DEVELOPMENT

mastery niet bereikt + current-development practice passend
→ PRACTICE_CURRENT_DEVELOPMENT

prerequisite onzeker, niet beoordeeld of niet ondersteund
→ ASSESS_PREREQUISITE_DEVELOPMENT of HOLD_FOR_MORE_EVIDENCE,
  afhankelijk van expliciete action policy

next development ordering niet ondersteund, onzeker of niet beoordeeld
→ HOLD_FOR_MORE_EVIDENCE

next development ordering voldoende ondersteund
→ kandidaat voor ASSESS_NEXT_DEVELOPMENT of PRACTICE_NEXT_DEVELOPMENT

geen verantwoordelijke kandidaatactie
→ HOLD_FOR_MORE_EVIDENCE
```

De exacte keuze tussen assessen en oefenen moet door een expliciet aangeleverde action policy worden bepaald; C7 raadt dit niet zelf uit prestatiegegevens.

Elke decision trace moet intern coherent zijn: `candidate_action`, `decision_reason` en `decision_gate` moeten samen een geldige C7-combinatie vormen. Een trace die deze contractuele samenhang niet heeft, mag niet als C7-uitkomst worden teruggegeven.

## 6. C6 → C7 handoff

De C6-uitkomst is de bron voor de mastery-state van C7. C7 mag de mastery-state niet opnieuw berekenen of reconstrueren uit onderliggende scores.

De C6 → C7 adapter mag uitsluitend een gevalideerde C6-uitkomst doorgeven wanneer de C6-safetygrenzen actief blijven:

- `registry_promotion_allowed = false`;
- `runtime_mastery_write_allowed = false`;
- `developmental_ordering_inference_allowed = false`;
- `automatic_next_action_allowed = false`.

Ordering, alternatives, prerequisite-status en action policy blijven expliciete inputs van C7. De adapter mag deze niet uit C6-resultaten afleiden.

## 7. Eerste verticale C6 → C7 slice

De eerste technische verticale slice loopt volledig deterministisch door de twee lagen:

```text
C6 mastery assessment
        ↓
C6 mastery_state_by_claim
        ↓
C6 safety-boundary validation
        ↓
C7 input adapter
        ↓
C7 ordering / alternative / prerequisite gates
        ↓
C7 decision trace
        ↓
candidate next-action
```

Deze slice heeft drie minimale veiligheidsgevallen:

1. **C6 = MASTERED + ordering SUPPORTED** → C7 mag, mits action policy dit toestaat, een next-development kandidaat opleveren.
2. **C6 ≠ MASTERED** → C7 mag geen next-development advancement voorstellen.
3. **ordering = NOT_SUPPORTED** → C7 moet een next-development actie blokkeren.

De verticale slice verandert geen runtime-state en voert geen automatische learner advancement uit. Het doel is uitsluitend aantonen dat de contracten tussen C6 en C7 technisch op elkaar aansluiten.

## 8. Belangrijke grens

C7 is nadrukkelijk niet hetzelfde als een aanbevelingsalgoritme dat zelfstandig nieuwe onderwijsstappen bedenkt.

C7 mag:

- expliciete state combineren;
- expliciete candidate actions vergelijken;
- redenen en gebruikte evidence zichtbaar maken;
- een deterministische kandidaatactie opleveren;
- de interne coherentie van de decision trace controleren.

C7 mag niet:

- een ontbrekende development verzinnen;
- een prerequisite aannemen zonder ordering-support;
- mastery opnieuw berekenen buiten C6;
- een verborgen score of drempel gebruiken;
- automatisch een leerling laten doorgaan;
- runtime-state muteren.

## 9. Empirische vragen

C7 moet later empirisch worden getoetst op onder meer:

- voorspellende waarde van de gekozen next-action;
- foutieve escalatie naar volgende developments;
- gemiste prerequisites;
- effect van onzekerheid en contradicties;
- vergelijking van alternatieve action policies;
- leerlinguitkomsten na de voorgestelde actie.

C7 claimt daarom nog geen optimale pedagogische policy.
