# PacoGO Curriculum — B10 Complete Curriculum Model

Status: candidate integrated model
Datum: 2026-11-01

## 1. Doel van B10

B10 brengt de eerder ontwikkelde B1–B9-onderdelen samen in één formeel PacoGO-model.

B10 is geen nieuw inhoudelijk curriculumonderzoek. Het is de integratielaag die de bestaande kandidaatarchitectuur formeel samenhangend maakt en voorbereidt op empirische validatie en technische implementatie.

## 2. Centrale keten

```text
CURRICULUMKADER
      ↓
SKILL
      ↓
DEVELOPMENT MODEL
      ↓
DEVELOPMENT
      ↓
DEVELOPMENTAL CLAIM
      ↓
EVIDENCE TARGET
      ↓
TASK MODEL
      ↓
TASK
      ↓
TASK INSTANCE
      ↓
PERFORMANCE / OBSERVATION
      ↓
EVIDENCE
      ↓
EVIDENCE ASSESSMENT
      ↓
DEVELOPMENTAL INFERENCE
      ↓
DEVELOPMENTAL POSITION
      ↓
MASTERY INFERENCE
      ↓
MASTERY STATE
      ↓
DECISION
      ↓
NEXT ACTION
      ↓
NEW EVIDENCE
      ↓
MODEL REVISION
```

De keten is geen bewijs dat iedere stap causaal op de volgende werkt. Het is de formele structuur van het PacoGO-systeem.

## 3. Statische curriculumlaag

### 3.1 Curriculumkader

Bronnen zoals SLO geven het curriculumkader en context.

Curriculumkader → PacoGO-constructen is een ontwerp-/synthesestap, geen één-op-één vertaling.

### 3.2 Skills

De huidige kandidaatarchitectuur bevat 32 content skills:

- A1–A6: getalstructuur/getalbegrip
- B1–B5: bewerkingen
- FR1–FR2: breuken
- VR1–VR5: verhoudingen/percentages
- MG1–MG6: meten
- MGK1–MGK3: meetkunde/ruimtelijk inzicht
- PA1–PA3: patronen/algebraïsch denken
- GK1–GK2: gegevens/data

Deze 32 skills zijn kandidaatconstructen, niet empirisch bewezen natuurlijke categorieën.

### 3.3 Cross-cutting lagen

1. Wiskundig denken en werken
2. Wiskundetaal en gereedschap
3. Attitude en reflectie
4. Toepassing en transfer

Deze lagen zijn geen extra content skills.

## 4. Development model

Iedere skill kan één of meer kandidaat-developments bevatten.

Een development beschrijft een inhoudelijke ontwikkeling in wat de leerling begrijpt, coördineert, redeneert, representeert of toepast.

Belangrijk:

- development ≠ taakniveau;
- development ≠ leeftijd;
- development ≠ score;
- development ≠ automatisch lineaire fase.

De huidige ontwikkelingsmodellen zijn hypothesen die empirisch moeten worden getoetst.

## 5. Developmental claim

Een claim is een expliciete uitspraak over wat een bepaalde ontwikkeling inhoudt en welk observeerbaar gedrag daarbij verwacht kan worden.

Vorm:

`Development D → Claim C`

Een claim moet toetsbaar zijn en mag niet alleen een herformulering van een curriculumdoel zijn.

## 6. Evidence target

Een evidence target beschrijft welk type observeerbare informatie nodig is om een claim geloofwaardig te ondersteunen of te betwisten.

Keten:

`CLAIM → EVIDENCE TARGET → TASK MODEL`

Evidence is altijd claim-relatief.

## 7. Task model

Een task model beschrijft welk type taak nodig is om het gewenste bewijs uit te lokken.

Task model ≠ development.
Task model ≠ concrete taak.
Task model ≠ moeilijkheidsschaal.

Eén task kan meerdere skills activeren, maar één primaire target moet identificeerbaar zijn.

## 8. Complexity model

Complexiteit wordt apart gemodelleerd van development.

Kandidaatdimensies:

1. abstractie
2. afstand tussen representaties
3. aantal elementen
4. afhankelijkheden
5. afstand tussen gegeven en gevraagde
6. ontbrekende informatie
7. representatievariatie
8. aantal mogelijke aanpakken
9. zelfstandige strategiekeuze
10. contextuele belasting
11. multi-skill integratie

Werkende complexiteitsbanden:

1. Direct
2. Connected
3. Reconstructed
4. Strategic
5. Integrated

Deze banden zijn kandidaatmodel en geen ontwikkelingsniveaus.

## 9. Performance en Observation

Een task instance produceert een performance.

Mogelijke observaties:

- antwoord
- juist/onjuist
- gekozen representatie
- strategie
- tussenstappen
- uitleg
- fouten
- hints
- pogingen
- contextgebruik
- eventueel responstijd

Een observatie wordt niet automatisch evidence.

## 10. Evidence assessment

Evidence wordt beoordeeld op onder andere:

- relevantie voor de claim
- kwaliteit
- dekking
- onafhankelijkheid
- variatie
- contradictie
- alternatieve verklaringen

Correctheid alleen is onvoldoende om development of mastery vast te stellen.

## 11. Developmental inference

De developmental inference is een best-ondersteunde interpretatie van het evidenceprofiel binnen expliciete scope.

Mogelijke statussen:

- Observed
- Supported
- Uncertain
- Contradictory
- Insufficient

Developmental position is dus geen enkel totaalcijfer.

## 12. Mastery

Mastery is een tijdgebonden, claim-specifieke en scope-specifieke inferentie dat een ontwikkeling voldoende betrouwbaar wordt beheerst.

Kandidaatvoorwaarden:

M1 relevantie
M2 kwaliteit
M3 coverage
M4 stabiliteit
M5 onafhankelijkheid
M6 variatie
M7 contradictiecontrole

Mogelijke staten:

- MASTERED
- NOT YET MASTERED
- INSUFFICIENT EVIDENCE
- CONTRADICTORY
- NOT ASSESSED

Mastery ≠ hoogste taakniveau.
Mastery ≠ ontwikkelingspositie.
Mastery ≠ percentage correct.

## 13. Decision layer

De Decision Engine gebruikt evidence, developmental inference, mastery en onzekerheid om een volgende actie te kiezen.

Een decision kan bijvoorbeeld zijn:

- meer bewijs verzamelen;
- huidige ontwikkeling verder oefenen;
- taakcomplexiteit aanpassen;
- volgende ontwikkeling onderzoeken;
- transfer onderzoeken;
- instructie geven;
- wachten op aanvullende observaties.

De decision moet herleidbaar zijn tot het beschikbare evidence.

## 14. Next action

De volgende actie is niet automatisch "de moeilijkere taak".

De engine moet kunnen kiezen voor de taak die het meest informatieve volgende bewijs kan opleveren, gegeven:

- huidige claim;
- huidige evidence;
- onzekerheid;
- alternatieve verklaringen;
- complexiteit;
- masterystatus;
- gewenste instructiedoelstelling.

## 15. Cross-skill relations

B9 onderscheidt:

- R1 prerequisite
- R2 supportive
- R3 shared cognitive component
- R4 construct overlap
- R5 transfer
- R6 predictive relation
- R7 causal/instructional relation

Ook "geen relatie aangetoond" blijft altijd mogelijk.

Een sterke associatie is geen bewijs voor de verklaring ervan.

Geen relationeel model mag automatisch als unlock-regel worden geïmplementeerd voordat het empirisch is ondersteund.

## 16. Empirische validatie

Het geïntegreerde model wordt getoetst via:

C1 Pilot design
C2 Student data model
C3 Evidence coding
C4 Development classification
C5 Developmental ordering
C6 Mastery decisions
C7 Longitudinal validation
C8 Model comparison
C9 Bias, context & language
C10 Curriculum revision

De validatiefase moet alternatieve modellen expliciet meenemen.

## 17. Epistemische status

### [W]
Rechtstreeks ondersteund door wetenschappelijke literatuur of primaire curriculumbron.

### [S]
PacoGO-synthese op basis van meerdere bronnen.

### [O]
Ontwerpkeuze voor PacoGO.

### Candidate
Kandidaatmodel dat nog empirisch getoetst moet worden.

### Supported
Ondersteund binnen de onderzochte empirische scope.

### Validated
Empirisch gevalideerd binnen expliciet gedefinieerde populatie, taakscope en onderzoekscondities.

PacoGO mag een onderdeel niet als Validated presenteren wanneer alleen [W]-literatuur over algemene onderwijs-/assessmentprincipes bestaat.

## 18. Wat nog NIET vaststaat

De volgende zaken zijn nadrukkelijk open:

- of de 32 skills de beste constructindeling zijn;
- of alle voorgestelde developments werkelijk empirisch onderscheiden kunnen worden;
- of ontwikkelingsroutes lineair, hiërarchisch, multidimensionaal of meervoudig zijn;
- of voorgestelde prerequisites daadwerkelijk noodzakelijk zijn;
- welke evidence-combinaties voldoende zijn voor mastery;
- welke complexiteitsdimensies empirisch relevant zijn;
- welke decisionregels het meest voorspellend en effectief zijn;
- hoe stabiel developmental inference is over tijd, taken en context;
- welke alternatieve modellen beter of eenvoudiger kunnen verklaren;
- welke context-, taal-, representatie- of instructie-effecten optreden.

## 19. Technische vertaling

De toekomstige technische engine kan deze statische en dynamische objecten onderscheiden.

### Statisch

- Curriculum
- Skill
- Development model
- Development
- Claim
- Evidence target
- Task model
- Complexity model
- Task

### Dynamisch

- Student
- Task instance
- Performance
- Observation
- Evidence
- Evidence assessment
- Developmental inference
- Mastery state
- Decision
- Next action

### Runtime

```text
student
→ curriculum
→ task selection
→ task instance
→ performance
→ observation
→ evidence
→ evidence assessment
→ development inference
→ mastery
→ decision
→ next action
→ new task
→ new evidence
```

Frontendlogica mag de wetenschappelijke regels niet dupliceren. De curriculum-/assessmentlogica hoort centraal in de engine.

## 20. 16 vragen van de PacoGO Engine

1. Welke skill?
2. Welke development?
3. Welke claim?
4. Welk evidence target?
5. Welke task?
6. Welke complexity?
7. Wat deed de leerling daadwerkelijk?
8. Welk evidence ontstond?
9. Hoe sterk is dat evidence?
10. Welke alternatieve verklaringen zijn er?
11. Wat zegt het evidence over development?
12. Wat zegt het over mastery?
13. Wat weten we nog niet?
14. Welk volgend evidence is het meest informatief?
15. Welke taak/instructie volgt?
16. Hoe moet het model worden aangepast als nieuwe evidence het huidige model tegenspreekt?

## 21. Overgang naar C

B10 maakt de architectuur formeel geïntegreerd.

De volgende inhoudelijke fase is niet opnieuw ontwerpen, maar empirisch testen:

`C1 → C10`

Daarna kan de best ondersteunde architectuur worden vertaald naar de technische engine.

## 22. Einddoel

PacoGO moet uiteindelijk een wetenschappelijk verdedigbaar en empirisch toetsbaar curriculum- en leerengine worden waarin curriculum, assessment, evidence, development, mastery, decision en instruction één samenhangend systeem vormen.

Het systeem moet niet alleen zeggen of een leerling een antwoord goed heeft, maar proberen te bepalen:

**wat de leerling begrijpt/doet, welk bewijs daarvoor beschikbaar is, hoe zeker die interpretatie is, waar de leerling zich binnen het kandidaatontwikkelingsmodel bevindt, wat al voldoende beheerst lijkt, wat nog onbekend is en welke volgende actie het meest verantwoord is.**

Dat is het uiteindelijke PacoGO Curriculum-doel.
