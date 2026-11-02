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

De FR2-browserverticale slice is opgenomen in de bestaande volledige browserregressie en de laatste volledige CI-run `41441801539` is groen:

- curriculum engine regression: PASS
- architecture boundary tests: PASS
- maintained Node regression: PASS
- maintained Vitest regression: PASS
- browser regression: PASS
- working tree clean: PASS

## 5. Wetenschappelijke status

A1, B1 en FR2 blijven representatieve kandidaat-/prototypeconstructen.

Deze technische milestone bewijst alleen dat de voorgestelde interaction/engine-architectuur technisch over meerdere domeinen kan worden toegepast.

Het bewijst NIET dat:

- de skillafbakening empirisch correct is;
- de developmental ordering correct is;
- de masterycriteria optimaal zijn;
- de next-action regels empirisch gevalideerd zijn;
- A1 of FR2 definitieve curriculuminhoud zijn.

De volledige curriculumkaart blijft het uiteindelijke inhoudelijke doel.

## 6. Volgende technische stap

De generieke interaction boundary is nu door twee verschillende interactietypen beproefd:

- A1: directe ruimtelijke plaatsing
- FR2: symbolische equivalentieselectie

De volgende uitbreiding moet daarom niet opnieuw een parallel interaction framework bouwen. Nieuwe domeinen moeten dezelfde generieke contracten en enginegrenzen gebruiken, met domeinspecifieke interaction/evaluation adapters waar nodig.

Alle verdere technische uitbreidingen blijven onderworpen aan de Supabase TEST-regel wanneer persistence/dataflow wordt geraakt.
