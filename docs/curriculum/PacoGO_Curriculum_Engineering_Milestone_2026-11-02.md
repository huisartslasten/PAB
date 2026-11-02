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

## 7. C1-C3 — empirische onderzoekslaag

De voorbereidende empirische infrastructuur is nu als één keten vastgelegd:

- `docs/curriculum/PacoGO_C1_Pilot_Design_v0.1.md`
- `docs/curriculum/PacoGO_C2_Student_Data_Model_v0.1.md`
- `docs/curriculum/PacoGO_C3_Evidence_Coding_Specification_v0.1.md`
- bestaand aanvullend analyseplan: `docs/curriculum/PacoGO_C1_C3_Analysis_Plan_v0.1.md`

C1 definieert de pilotopzet en de scheiding tussen feasibility, discriminating, variation, transfer en repeated observations.

C2 scheidt:

`learner/context → task instance → interaction/observation → evidence assessment → inference → decision`

Raw observations blijven behouden. Missingness, instruction/exposure en provenance worden expliciet vastgelegd.

C3 maakt expliciet onderscheid tussen target match, correctness, process evidence, quality, contradiction, independence/prompting en alternative explanations. Human coding krijgt een reliability-plan.

C1-C3 blijven design-only; er is nog geen leerlingstudie uitgevoerd.

## 8. Eerste empirische pilotmanifest

De volgende stap is nu geconcretiseerd in:

`docs/curriculum/PacoGO_Empirical_Pilot_Manifest_v0.1.json`

Het manifest selecteert voor de **eerste pilot** zes focal claims:

- A1.C1 / A1.D1
- A1.C2 / A1.D2
- B1.C1 / B1.D1
- B1.C2 / B1.D2
- FR2.C1 / FR2.D1
- FR2.C2 / FR2.D2

De hogere ontwikkelingen A1.D3, B1.D3, B1.D4 en FR2.D3 zijn bewust uit de eerste pilot gehouden. Dat is scopebeperking en geen negatieve ontwikkelingsclaim.

Het manifest koppelt per claim concrete pilot-taken, evidence targets, alternatieve verklaringen en vereiste procesinformatie. Het definieert drie onderzoeksfasen:

- W0 feasibility;
- W1 baseline/discrimination;
- W2+ repeated measurement.

Het legt ook vast dat C5-ordering pas kan worden onderzocht wanneer voldoende herhaalde observaties beschikbaar zijn en dat prediction niet automatisch prerequisite-status betekent.

## 9. Wetenschappelijke status

A1, B1 en FR2 blijven representatieve kandidaat-/prototypeconstructen.

C1-C5 zijn onderzoeks- en testinstrumenten/designlagen. Geen van deze lagen is empirische curriculumvalidatie.

Deze milestones bewijzen NIET dat:

- de skillafbakening empirisch correct is;
- de developmental ordering correct is;
- prerequisites daadwerkelijk noodzakelijk zijn;
- de masterycriteria optimaal zijn;
- de next-action regels empirisch gevalideerd zijn;
- A1 of FR2 definitieve curriculuminhoud zijn;
- de C4- of C5-patronen daadwerkelijk in leerlingdata voorkomen.

## 10. CI / branchstatus

Voor de eerdere technische curriculumregressie is CI-run `41442702755` volledig groen bevestigd.

De huidige branch `refactor/professional-v1` staat op commit `5419fd695446f84fb59fff53abaa7963d22c97ca` in de huidige branchgeschiedenis; de nieuwe pilotmanifest- en milestone-commit volgt daar direct op.

Omdat deze branch direct wordt bijgewerkt en de bestaande workflow op PR-context draait, is een **draft PR #17** geopend uitsluitend om CI-validatie mogelijk te maken. De PR is niet gemerged; MAIN/LIVE is daardoor niet gewijzigd.

## 11. Volgende grote stap

De designfase is nu voldoende uitgewerkt om naar een echte empirische voorbereiding te gaan.

De volgende stap is **geen nieuwe runtime-skill**. Eerst moet de pilotmanifest technisch/inhoudelijk uitvoerbaar worden gemaakt: observation-export, coderingsdataset, task-instance registratie en reproduceerbare pilotanalyse. Pas wanneer dat klaar is, kan daadwerkelijke leerlingdata worden verzameld.

Als onderzoeksdata naar Supabase worden geschreven, wordt dat uitsluitend op **PacoGO TEST** gedaan en volgens de bestaande Supabase TEST-regel. MAIN/LIVE blijft buiten deze onderzoeksfase.
