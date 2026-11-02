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

De fout zat niet in de curriculum engine zelf. De nieuwe A1 vertical test gebruikte:

```text
cycle.longitudinal_state.registry_version
```

terwijl het bestaande, reeds gebruikte persistence/longitudinal contract het veld heet:

```text
cycle.longitudinal_state.curriculum_registry_version
```

Dit contract wordt ook expliciet gebruikt door de bestaande registry-regressietest en sluit aan op de Supabase-persistencekolom `curriculum_registry_version_id`.

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

De browser test controleert onder andere registry-versie, evidence count, masterystatus, interaction events en observation ID.

Dit is technische/prototype-validatie, geen empirische validatie van A1.

## 3. Supabase TEST-regel uitgevoerd

Omdat deze milestone de observation/evidence/longitudinal/decision-trace-keten raakt, is een gerichte smoke test uitgevoerd op Supabase-project **PacoGO TEST**.

Bestaande registryversie gecontroleerd:

`pacogo-curriculum / 0.2.0-seed`

De persistence-keten is synthetisch getest met pseudonieme testdata:

- `student_evidence`
- `student_longitudinal_state`
- `curriculum_decision_trace`
- koppeling aan de exacte `curriculum_registry_versions`-record

Resultaat tijdens test:

- evidence rows: 1
- longitudinal state rows: 1
- decision trace rows: 1
- evidence gekoppeld aan exacte registry version: 1

Daarna zijn alle synthetische records verwijderd en is gecontroleerd:

- evidence rows: 0
- longitudinal state rows: 0
- decision trace rows: 0

Geen schemawijziging uitgevoerd.
MAIN/LIVE is niet aangeraakt.

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

De FR2-browserverticale slice is opgenomen in de bestaande volledige browserregressie en is groen gevalideerd in de volledige CI-regressie.

## 5. C4 — discriminating task set

Na A1 en FR2 is niet nog een derde parallel interactie-framework gebouwd. De volgende stap is verschoven naar de wetenschappelijke vraag: **kunnen kandidaat-ontwikkelingsinterpretaties worden onderscheiden van plausibele alternatieve verklaringen?**

Daarvoor is toegevoegd:

- `docs/curriculum/PacoGO_C4_Discriminating_TaskSet_v0.1.json`
- `pacogo-engine/c4-task-set.test.js`

De C4-taskset is een **candidate/design-only** artefact. Het is geen gevalideerde curriculum-meting en wijzigt de curriculum registry niet.

De set bevat momenteel **19 discriminating tasks over 10 candidate developments** en is gekoppeld aan de bestaande registry-, development-, claim-, task-model- en evidence-target-ID's.

De taakdefinities bevatten expliciet:

- evidence targets;
- relevante task models;
- variation metadata;
- positieve patroonverwachting;
- counter-pattern;
- plausibele alternatieve model families;
- process requirement waar relevant;
- contrastrelaties waar relevant.

De validator controleert bovendien dat iedere bestaande registry development minimaal één C4 discriminating task heeft en dat de evidence targets via de geselecteerde task-model-unie technisch kunnen worden geproduceerd.

Een eerste validatorfout werd ontdekt en uitsluitend in de validator gecorrigeerd: evidence targets mogen afkomstig zijn uit de **unie van de geselecteerde task models**, niet noodzakelijk uit ieder afzonderlijk model. Daarna slaagde de volledige testset.

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

## 6. Wetenschappelijke status

A1, B1 en FR2 blijven representatieve kandidaat-/prototypeconstructen.

De C4-taskset is een onderzoeks- en testinstrument om kandidaatmodellen later te kunnen vergelijken; het is zelf geen empirische validatie.

Deze technische milestones bewijzen NIET dat:

- de skillafbakening empirisch correct is;
- de developmental ordering correct is;
- de masterycriteria optimaal zijn;
- de next-action regels empirisch gevalideerd zijn;
- A1 of FR2 definitieve curriculuminhoud zijn;
- de C4-positieve patronen daadwerkelijk in leerlingdata voorkomen.

De volledige curriculumkaart blijft het uiteindelijke inhoudelijke doel.

## 7. Volgende technische/inhoudelijke stap

De technische architectuur is inmiddels beproefd met twee verschillende interactietypen en C4 heeft een eerste formele discriminatie-laag gekregen.

De volgende stap is daarom inhoudelijk: de C4-taskset koppelen aan het bredere **claim → development → alternative explanation → discriminating evidence**-onderzoek en bepalen welke claims eerst extern/wetenschappelijk onderbouwd moeten worden voordat ze als curriculumstructuur mogen worden vastgezet.

Nieuwe runtime-domeinen worden alleen toegevoegd wanneer ze een duidelijke onderzoeks- of architectuurfunctie hebben; niet om simpelweg meer demo-skills te produceren.

Alle verdere technische uitbreidingen blijven onderworpen aan de Supabase TEST-regel wanneer persistence/dataflow wordt geraakt.
