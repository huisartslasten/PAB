# PacoGO Curriculum Engineering — Milestone 2026-11-02

Branch: `refactor/professional-v1`
MAIN/LIVE: niet gewijzigd.

## 1. CI-regressie gerepareerd

Onderzochte CI-run: `41440318555`.

Fout in `Run curriculum engine regression`:

```text
AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
+ actual - expected
+ undefined
- '0.2.0-seed'
```

De fout zat niet in de curriculum engine zelf. De nieuwe A1 vertical test gebruikte `cycle.longitudinal_state.registry_version`, terwijl het bestaande canonieke persistence/longitudinal contract het veld `cycle.longitudinal_state.curriculum_registry_version` gebruikt.

### Reparatie

Alleen de foutieve testassertie is aangepast naar het bestaande canonieke contract. Geen engine-, schema- of curriculumlogica gewijzigd.

De volledige rerun van CI-run `41440318555` werd daarna groen:

- curriculum engine regression: PASS
- architecture boundary tests: PASS
- maintained Node regression: PASS
- maintained Vitest regression: PASS
- browser regression: PASS
- working tree clean: PASS

## 2. A1 browser vertical slice

De A1 number-line slice is end-to-end door de bestaande browserregressie bevestigd:

`curriculum registry`
→ `task model`
→ `task instance`
→ `number-line browser interaction`
→ `interaction events`
→ `observation`
→ `evidence assessment`
→ `development inference`
→ `mastery inference`
→ `decision trace`
→ `next action`

Dit is technische/prototype-validatie, geen empirische validatie van A1.

## 3. Supabase TEST-regel uitgevoerd

Omdat deze milestone de observation/evidence/longitudinal/decision-trace-keten raakt, is een gerichte smoke test uitgevoerd op Supabase-project **PacoGO TEST**.

Bestaande registryversie: `pacogo-curriculum / 0.2.0-seed`.

De persistence-keten is synthetisch getest met pseudonieme testdata in:

- `student_evidence`
- `student_longitudinal_state`
- `curriculum_decision_trace`
- gekoppeld aan de exacte `curriculum_registry_versions`-record

Tijdens de test waren 1/1/1 records aanwezig. Daarna zijn alle synthetische records verwijderd en is 0/0/0 geverifieerd. Geen schemawijziging. MAIN/LIVE niet aangeraakt.

## 4. FR2 — tweede domein als herbruikbaarheidstest

Na de stabiele A1 vertical slice is FR2 toegevoegd als tweede technische vertical prototype:

**FR2 — Breukequivalentie herkennen en gebruiken**

Nieuwe technische onderdelen:

- `pacogo-engine/fraction-equivalence.js`
- `pacogo-engine/fraction-equivalence-controller.js`
- `pacogo-engine/fraction-equivalence.test.js`
- `curriculum-fr2-fractions.html`
- `test/browser/curriculum-fr2-fractions.browser.test.js`

FR2 gebruikt dezelfde generieke interaction contracten:

`task → task instance → interaction events → observation → curriculum engine → evidence → mastery → decision trace`

De concrete interactie is anders dan A1: selectie van een equivalente breuk in plaats van plaatsing op een getallenlijn.

## 5. C4 — discriminating task set

De volgende stap is verschoven van nog een parallel interactie-framework naar de wetenschappelijke vraag: **kunnen kandidaat-ontwikkelingsinterpretaties worden onderscheiden van plausibele alternatieve verklaringen?**

Toegevoegd:

- `docs/curriculum/PacoGO_C4_Discriminating_TaskSet_v0.1.json`
- `pacogo-engine/c4-task-set.test.js`

De C4-taskset is **candidate/design-only**. De set bevat 19 discriminating tasks over 10 candidate developments en is gekoppeld aan de bestaande registry-, development-, claim-, task-model- en evidence-target-ID's.

De taakdefinities bevatten evidence targets, relevante task models, variation metadata, positieve patroonverwachting, counter-pattern, plausibele alternatieve model families, process requirements en contrastrelaties waar relevant.

De validator controleert dat iedere registry development minimaal één C4 discriminating task heeft en dat evidence targets via de unie van de geselecteerde task models technisch kunnen worden geproduceerd.

### C4 CI-validatie

Volledige CI-run: `41442702755`.

Resultaat:

- C4 task-set regression: PASS — 19 tasks / 10 developments
- curriculum engine regression: PASS
- architecture boundary tests: PASS
- maintained Node regression: PASS — 503 tests
- maintained Vitest regression: PASS — 21 tests
- browser regression: PASS — 45 tests
- working tree clean: PASS

De browserregressie rapporteerde geen browser errors.

## 6. C5 — developmental ordering en prerequisites

Na C4 is een aparte C5-laag toegevoegd. C5 is bewust **niet** als uitbreiding van C4 of als runtime-regel gebouwd.

Toegevoegd:

- `docs/curriculum/PacoGO_C5_Developmental_Ordering_Protocol_v0.1.md`
- `docs/curriculum/PacoGO_C5_Ordering_Hypothesis_Matrix_v0.1.json`
- `pacogo-engine/c5-ordering-matrix.test.js`

C5 maakt expliciet onderscheid tussen task order, temporal precedence, prediction, prerequisite/necessary condition, causal/instructional relation en correlation/shared cause.

De ordering-matrix bevat momenteel 10 candidate relations over de bestaande A1/B1/FR2 developments. De relaties zijn uitsluitend hypotheses. Er wordt bewust geen totale lineaire volgorde afgedwongen: partiële ordening, wederkerigheid, parallelle ontwikkeling en meerdere routes blijven mogelijke empirische uitkomsten.

De bestaande `candidate_order`-velden blijven voorlopig een **hypothese-index**. C5 verandert de registry niet en promoveert geen ordering-claim automatisch.

## 7. C1-C3 — eerste empirische onderzoekslaag

Nu C4 en C5 vooraf gespecificeerde onderzoeksvragen hebben, is de eerste empirische infrastructuurlaag vastgelegd:

- `docs/curriculum/PacoGO_C1_Pilot_Design_v0.1.md`
- `docs/curriculum/PacoGO_C2_Student_Data_Model_v0.1.md`
- `docs/curriculum/PacoGO_C3_Evidence_Coding_Specification_v0.1.md`

### C1 — pilot design

C1 definieert hoe een pilot onderscheid kan maken tussen feasibility, discriminating evidence, variation, transfer en repeated observations. De primaire validatie-eenheid blijft de **claim**.

C1 vereist onder andere vooraf vastgelegde claims/evidence targets, defining versus confirmatory observations, meerdere taakinstanties, relevante variatie, counter-patterns, instructie/exposure metadata en expliciete analyse-gates.

### C2 — student data model

C2 scheidt:

`learner/context → task instance → interaction/observation → evidence assessment → inference → decision`

Raw observations blijven behouden en worden niet overschreven door latere interpretaties. Missingness, instruction/exposure en provenance worden expliciet vastgelegd.

Het model ondersteunt longitudinale analyse maar beweert zelf geen temporal ordering, prediction, prerequisite of causaliteit.

### C3 — evidence coding

C3 maakt expliciet onderscheid tussen:

- target match;
- correctness/performance;
- process evidence;
- evidence quality;
- contradiction;
- independence/prompting;
- alternative explanations.

Human coding krijgt een afzonderlijk reliability-plan. Een correct antwoord wordt niet automatisch als developmental evidence gecodeerd.

### Wetenschappelijke status C1-C3

C1-C3 zijn **design-only**. Er is nog geen leerlingstudie uitgevoerd en er is geen empirische claim ondersteund of gevalideerd.

## 8. Wetenschappelijke status

A1, B1 en FR2 blijven representatieve kandidaat-/prototypeconstructen.

C4 en C5 zijn onderzoeks- en testinstrumenten. C1-C3 zijn de voorbereidende empirische onderzoeksinfrastructuur. Geen van deze lagen is op zichzelf empirische curriculumvalidatie.

Deze technische milestones bewijzen NIET dat:

- de skillafbakening empirisch correct is;
- de developmental ordering correct is;
- prerequisites daadwerkelijk noodzakelijk zijn;
- de masterycriteria optimaal zijn;
- de next-action regels empirisch gevalideerd zijn;
- A1 of FR2 definitieve curriculuminhoud zijn;
- de C4- of C5-patronen daadwerkelijk in leerlingdata voorkomen.

## 9. Volgende stap

De designlaag C1-C5 staat nu. De volgende stap is **niet** een nieuwe runtime-skill bouwen.

De volgende grote inhoudelijke stap is het samenstellen van een eerste **empirische pilotmanifest**: welke concrete A1/B1/FR2 claims worden als eerste onderzocht, welke C4/C5 tasks worden daarvoor gebruikt, welke observations nodig zijn, welke alternatieven worden getoetst en welke data per leerling/wave moeten worden verzameld.

Pas daarna is het zinvol om daadwerkelijke empirische dataverzameling en eventuele Supabase TEST-persistentie voor onderzoeksdata te bouwen. Als persistence wordt geraakt, blijft de bestaande Supabase TEST-regel verplicht.

Nieuwe runtime-domeinen worden alleen toegevoegd wanneer ze een duidelijke onderzoeks- of architectuurfunctie hebben; niet om simpelweg meer demo-skills te produceren.
