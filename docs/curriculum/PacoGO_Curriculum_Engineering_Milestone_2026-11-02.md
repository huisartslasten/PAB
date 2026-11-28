# PacoGO Curriculum Engineering — Milestone 2026-11-02

Branch: `refactor/professional-v1`
MAIN/LIVE: niet gewijzigd.

## 1. Wetenschappelijke en technische basis

De curriculum-engineeringlaag is opgebouwd rond een expliciete keten:

`SKILL → DEVELOPMENT → DEVELOPMENTAL CLAIM → EVIDENCE TARGET → TASK MODEL → TASK → PERFORMANCE → EVIDENCE → EVIDENCE QUALITY → DEVELOPMENT INFERENCE → MASTERY → DECISION → NEXT ACTION → NEW EVIDENCE → MODEL REVISION`

De kernregels blijven:

- development ≠ task complexity;
- evidence ≠ score;
- mastery ≠ developmental position;
- correct ≠ automatisch mastery;
- prerequisites blijven hypotheses totdat empirisch ondersteund;
- leeftijd is context, geen direct bewijs van ontwikkeling;
- runtime-performance promoveert geen curriculumclaims automatisch;
- epistemische labels `[W]`, `[S]`, `[O]` en Candidate/Supported/Validated blijven expliciet.

## 2. Technische vertical prototypes

A1 en FR2 zijn technisch als herbruikbare vertical slices bevestigd. De keten is technisch uitvoerbaar van curriculum registry via task/task-instance en interactie naar observation, evidence, inference, mastery, decision trace en next action.

Dit is technische/prototype-validatie en geen empirische curriculumvalidatie.

Een gerichte Supabase TEST smoke test heeft de bestaande persistence-keten synthetisch gevalideerd. Er is geen schemawijziging uitgevoerd en MAIN/LIVE is niet aangeraakt.

## 3. C1-C5 empirische onderzoekslaag

De designlaag bestaat uit:

- C1 pilot design;
- C2 student data model;
- C3 evidence coding en reliability;
- C4 measurement/discriminating task design;
- C5 developmental ordering/prerequisite protocol.

De eerste pilot omvat zes focal claims:

- A1.C1 / A1.D1
- A1.C2 / A1.D2
- B1.C1 / B1.D1
- B1.C2 / B1.D2
- FR2.C1 / FR2.D1
- FR2.C2 / FR2.D2

C1-C5 zijn onderzoeks- en testinstrumenten/designlagen. Er is nog geen leerlingstudie uitgevoerd.

## 4. Pilot technisch uitvoerbaar gemaakt

De pilotdesignlaag is nu doorgetrokken naar een reproduceerbare technische analyseketen.

Toegevoegd:

- `docs/curriculum/PacoGO_Empirical_Pilot_Dataset_Contract_v0.1.json`
- `pacogo-engine/empirical-pilot-dataset.js`
- `pacogo-engine/empirical-pilot-dataset.test.js`
- `pacogo-engine/empirical-pilot-analysis-pipeline.js`
- `pacogo-engine/empirical-pilot-analysis-pipeline.test.js`

De datasetlaag legt de referentiële integriteit vast tussen:

`task instance → raw observation → C3 coding record`

Daarbij worden learner, study, session, wave, task en registry version expliciet gecontroleerd. Onafhankelijke coderingsrecords blijven afzonderlijk behouden; adjudicatie wordt niet vermengd met de oorspronkelijke codes.

De analysepipeline voert deterministisch uit:

`dataset validation → deterministic snapshot → pilot analysis → C3 reliability summary → C4 measurement gate → descriptive report`

De pipeline accepteert coding-reliability als expliciete onderzoeksinput en verzint deze status nooit zelf.

## 5. Wetenschappelijke veiligheidsgrenzen

De technische pipeline kan geen van de volgende zaken automatisch concluderen of wijzigen:

- developmental conclusion;
- developmental ordering;
- prerequisite status;
- mastery rule;
- curriculum promotion.

De C4-gate betekent uitsluitend measurement readiness voor C4; het is geen bewijs dat een developmental claim waar is.

De descriptieve rapportage bewaart observaties en coderingsdistributies, inclusief missingness, variation coverage, target match, process, independence, evidence quality, contradictions en alternative explanations.

## 6. Supabase-regel

De empirische onderzoekslaag vereist op dit moment geen Supabase-schemawijziging.

Als echte onderzoeksdata later persistent worden opgeslagen, gebeurt dit uitsluitend op **PacoGO TEST** volgens `PacoGO_Supabase_Test_Regel.txt`. MAIN/LIVE blijft buiten de onderzoeksfase.

## 7. Status

De registry-ontwikkelingen A1/B1/FR2 blijven Candidate.

De empirische pilot blijft design-only totdat echte onderzoeksdata zijn verzameld en volgens het protocol geanalyseerd.

Een groene technische regressie betekent dus alleen dat de implementatie en contracten intern consistent zijn; het betekent niet dat de curriculumclaims empirisch gevalideerd zijn.

## 8. Volgende grote stap

De volgende stap is geen nieuwe runtime-skill. Eerst wordt de reproduceerbare pilotketen verder gehard rond concrete pilot-executie: gestandaardiseerde task-instance registratie, observation-export, C3 coding input en deterministische onderzoeksrapportage. Daarna kan de daadwerkelijke W0 feasibility-fase worden voorbereid.
