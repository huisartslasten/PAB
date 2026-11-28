# PacoGO Engine Specification v0.1

Status: candidate technical specification
Datum: 2026-11-01

## 1. Doel

De engine is generieke infrastructuur. Curriculumkennis blijft in machine-readable curriculumconfiguratie.

ENGINE = verwerking van observaties, evidence, inferenties, mastery en decisions.
CURRICULUM = betekenis van skills, developments, claims, evidence targets, task models en regels.

## 2. Runtime contract

`student + curriculum + observation history -> evidence -> inference -> mastery -> decision -> next action`

De engine mag geen hard-coded A1-, B1- of FR2-kennis bevatten.

## 3. Kernfuncties

### assessEvidence(observation, evidenceRule)

Maakt een claim-relative evidence assessment met minimaal:
- relevantie
- kwaliteit
- contradictie
- evidence-status

### inferDevelopment(evidence, developmentRules)

Vergelijkt evidenceprofielen met candidate development rules en retourneert:
- development_id
- status
- supporting evidence
- contradictory evidence
- onzekerheid/coverage-indicatie

### inferMastery(evidence, masteryRule)

Bepaalt een voorlopige mastery state binnen expliciete scope. Onderscheidt:
- MASTERED
- NOT YET MASTERED
- INSUFFICIENT EVIDENCE
- CONTRADICTORY

Prototype-thresholds zijn ontwerpkeuzes en niet empirisch gevalideerd.

### chooseNextAction(state, taskModels)

Zoekt naar het belangrijkste ontbrekende evidence target en selecteert een geschikte task model. De huidige ranking gebruikt alleen expliciet geconfigureerde prioriteiten; `information gain` is nog geen gevalideerde numerieke maat.

### runCycle(...)

Voert één volledige observe → evidence → inference → mastery → decision cyclus uit.

## 4. Objectgrens

Statisch:
- skill
- development
- claim
- evidence target
- task model
- mastery rules
- decision rules

Dynamisch:
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

## 5. Niet in de engine

Niet hard-coden:
- wat een skill betekent;
- welke ontwikkeling hoger is;
- dat correctheid development bewijst;
- dat moeilijkheid development bewijst;
- dat leeftijd development bepaalt;
- dat één succes mastery is;
- dat taalproblemen conceptuele problemen zijn;
- dat een prerequisite noodzakelijk is zonder bewijs.

## 6. Prototypebeperking

De eerste implementatie is bewust klein. Het doel is niet een volledige assessment engine bouwen, maar aantonen dat dezelfde softwarelaag A1, B1 en FR2 kan verwerken via configuratie.

## 7. Wetenschappelijke status

De software-architectuur is een ontwerp/prototype.
Een werkende engine bewijst niet dat de onderliggende developmental claims of masterycriteria empirisch juist zijn.

## 8. Volgende technische uitbreiding

Na de configuratieproef moeten worden toegevoegd:
1. versioned curriculum registry;
2. persistent student evidence store;
3. explicit contradiction/alternative-explanation model;
4. scope-aware mastery state;
5. decision trace;
6. longitudinal state updates;
7. validation hooks voor C1-C10.
