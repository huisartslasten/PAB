# PacoGO Curriculum — Stap 11: A1 Vertical Prototype

Status: candidate vertical prototype
Datum: 2026-11-01
Branch: refactor/professional-v1

## 1. Doel

Dit document is het eerste volledige verticale prototype van het PacoGO Curriculum Engine-model.

Doel is niet om A1 empirisch te valideren. Doel is om te testen of één skill werkelijk door de volledige keten kan lopen:

`SKILL → DEVELOPMENT → CLAIM → EVIDENCE TARGET → TASK MODEL → TASK → TASK INSTANCE → PERFORMANCE/OBSERVATION → EVIDENCE → EVIDENCE ASSESSMENT → DEVELOPMENTAL INFERENCE → MASTERY INFERENCE → DECISION → NEXT ACTION`

De test gebruikt synthetische leerlingperformances. Er wordt dus geen uitspraak gedaan over echte leerlingen.

## 2. Statusregels

- [W] = rechtstreeks wetenschappelijk ondersteund principe
- [S] = PacoGO-synthese / ontwerpinterpretatie op basis van eerder werk
- [O] = ontwerpkeuze
- Candidate = kandidaatmodel
- Supported = binnen de prototype-logica ondersteund
- Validated = empirisch gevalideerd; wordt hier niet geclaimd

A1 blijft een kandidaatconstruct. Het verticale prototype test vooral de samenhang van de engine, niet de waarheid van het A1-ontwikkelingsmodel.

## 3. Skill

### A1 — Getallen representeren en verbinden

[S] Kern:
Een getal herkennen, weergeven en verbinden met andere representaties van hetzelfde getal.

[S] Werkend ontwikkelingsmodel:

- D1 — representatieve betekenis: een getal/hoeveelheid herkennen en betekenisvol representeren.
- D2 — mapping: verschillende representaties van dezelfde numerieke waarde aan elkaar koppelen.
- D3 — coördinatie: meerdere representaties gelijktijdig gebruiken en de relaties ertussen functioneel benutten.

Dit is geen bewezen lineaire ontwikkelingsladder. Alternatieven blijven open.

## 4. Claims

### C-A1-D1
De leerling kan een numerieke hoeveelheid of waarde correct herkennen en in een passende representatie weergeven.

### C-A1-D2
De leerling kan verschillende representaties herkennen als representaties van dezelfde numerieke waarde en tussen deze representaties mappen.

### C-A1-D3
De leerling kan meerdere representaties gelijktijdig coördineren en gebruiken om een numerieke relatie of betekenis te verklaren of te bepalen.

## 5. Evidence Targets

### ET-A1-D1
Observeerbare aanwijzingen dat de leerling de numerieke waarde correct representeert, zonder dat het bewijs uitsluitend afhankelijk is van één specifieke notatie.

### ET-A1-D2
Observeerbare aanwijzingen dat de leerling een representatie kan vertalen naar een andere representatie en equivalentie van betekenis behoudt.

### ET-A1-D3
Observeerbare aanwijzingen dat de leerling twee of meer representaties tegelijk kan gebruiken en de relatie ertussen functioneel inzet.

Belangrijk: correct antwoord is slechts één observatie. Het wordt pas evidence wanneer het relevant is voor de betreffende claim.

## 6. Task Models

### TM-A1.1 — Representeren
Een hoeveelheid/getal wordt aangeboden; leerling geeft dezelfde waarde weer in een gevraagde representatie.

Primaire target: D1.

### TM-A1.2 — Representaties koppelen
Twee of meer representaties worden aangeboden; leerling koppelt, vertaalt of identificeert welke bij dezelfde waarde horen.

Primaire target: D2.

### TM-A1.3 — Representaties coördineren
Meerdere representaties worden tegelijk aangeboden; leerling gebruikt de relaties ertussen om een vraag te beantwoorden of een redenering te onderbouwen.

Primaire target: D3.

## 7. Complexity profile

De prototype-engine slaat complexiteit apart op van development.

Voor A1 worden vooral deze dimensies gevarieerd:

- C1 abstractie
- C2 afstand tussen representaties
- C3 aantal elementen
- C7 representatievariatie
- C8 aantal mogelijke aanpakken
- C9 zelfstandige strategiekeuze
- C11 multi-skill integratie

Een hogere complexiteit wordt niet geïnterpreteerd als een hogere ontwikkeling.

## 8. Concrete prototype-taken

### T1 — Directe representatie

Vraag:
`Laat 7 zien met stippen.`

Primair:
D1 / ET-A1-D1

Complexiteitsprofiel:
Direct; lage abstractie; één representatie-transformatie.

### T2 — Mapping

Vraag:
`Hier staan 8 stippen. Welk getal hoort erbij? Schrijf ook het getalwoord.`

Primair:
D2 / ET-A1-D2

Complexiteitsprofiel:
Connected; meerdere representaties; expliciete mapping.

### T3 — Coördinatie

Vraag:
`Je ziet 14 stippen. Leg uit hoe je kunt zien dat het getal 14 is zonder alle stippen één voor één te tellen. Schrijf het getal en laat met een andere voorstelling zien hoe je dit weet.`

Primair:
D3 / ET-A1-D3

Complexiteitsprofiel:
Strategic/Integrated; meerdere representaties; strategie- en uitlegcomponent.

## 9. Observation model

Voor iedere Task Instance worden minimaal opgeslagen:

```text
student_id
task_id
task_instance_id
response
correctness
representation_used
strategy_used
intermediate_steps
explanation
hints
attempts
error_type
complexity_profile
observed_at
```

Interpretaties mogen deze observaties niet overschrijven.

## 10. Evidence assessment

Voor iedere relevante claim wordt een afzonderlijke Evidence Assessment gemaakt.

Velden:

```text
claim_id
observation_ids
relevance
quality
coverage_contribution
independence_contribution
variation_contribution
contradiction
alternative_explanations
confidence
```

Belangrijk: één performance mag evidence leveren voor meerdere claims, maar wordt niet automatisch als onafhankelijke evidence voor al die claims geteld.

## 11. Prototype-inferentieregel

De engine gebruikt geen simpele score `goed = hoger development`.

Werkende kandidaatlogica:

1. bepaal welke claim primair wordt getest;
2. verzamel relevante observaties;
3. beoordeel evidencekwaliteit;
4. controleer variatie en onafhankelijkheid;
5. zoek contradicterende evidence;
6. beoordeel alternatieve verklaringen;
7. vergelijk het totale evidenceprofiel met de kandidaatontwikkelingen;
8. geef een status met onzekerheid;
9. bepaal welke onbekendheid het meest informatief kan worden gereduceerd;
10. selecteer de volgende taak die die evidence waarschijnlijk kan leveren.

Deze regels zijn prototype-regels, geen gevalideerde classificatie-algoritmen.

## 12. Developmental inference states

De engine kan voor A1 per development één van deze staten geven:

- OBSERVED
- SUPPORTED
- UNCERTAIN
- CONTRADICTORY
- INSUFFICIENT

Voorbeeld:

```text
D1 = SUPPORTED
D2 = SUPPORTED
D3 = INSUFFICIENT
```

Dit betekent niet dat de leerling "op niveau 2" zit. Het betekent dat de huidige evidence D1 en D2 ondersteunt en dat D3 nog onvoldoende onderzocht is.

## 13. Mastery prototype

Mastery wordt afzonderlijk geïnterpreteerd.

Candidate conditions:

- M1 relevance
- M2 quality
- M3 coverage
- M4 stability
- M5 independence
- M6 variation
- M7 contradiction check

Prototype-regel:

`INSUFFICIENT EVIDENCE` heeft voorrang boven een premature `MASTERED` wanneer coverage, variation of stability onvoldoende zijn.

Een enkele correcte taak kan daarom geen mastery bewijzen.

## 14. Decision Engine

De Decision Engine kiest niet simpelweg de volgende moeilijkere taak.

De primaire regel is:

> Kies de volgende actie die de belangrijkste resterende onzekerheid over de relevante claim of ontwikkeling het meest informatief kan reduceren, binnen de geldende curriculumscope.

Candidate action types:

- PRACTICE — oefenen binnen dezelfde ontwikkeling
- DIAGNOSTIC — onderscheid tussen kandidaatontwikkelingen onderzoeken
- VARIATION — dezelfde claim in andere representatie/context onderzoeken
- CONTRADICTION_CHECK — tegenstrijdige evidence onderzoeken
- STABILITY_CHECK — dezelfde ontwikkeling op later moment opnieuw onderzoeken
- TRANSFER_CHECK — toepassing buiten de oorspronkelijke taakvorm onderzoeken
- ADVANCE — volgende kandidaatontwikkeling onderzoeken
- REVIEW — opnieuw instructie/oefening aanbieden wanneer evidence onvoldoende is
- HOLD — geen ontwikkelingssprong maken zolang evidence onvoldoende is

## 15. Automatische next-action matrix

| Evidence profile | Next action |
|---|---|
| D1 onvoldoende | T1 / PRACTICE of DIAGNOSTIC D1 |
| D1 supported, D2 onvoldoende | T2 / DIAGNOSTIC D2 |
| D2 supported, D3 onvoldoende | T3 / DIAGNOSTIC D3 |
| D3 ondersteund maar weinig variatie | VARIATION |
| hoge correctheid maar zwakke proces-evidence | DIAGNOSTIC |
| tegenstrijdige evidence | CONTRADICTION_CHECK |
| sterke evidence maar onvoldoende stabiliteit | STABILITY_CHECK |
| development ondersteund, mastery onvoldoende | VARIATION of STABILITY_CHECK |
| mastery voldoende binnen scope | ADVANCE / volgende relevante claim |
| sterke alternatieve verklaring | VARIATION met nuisance-factor gecontroleerd |

De matrix is een ontwerpregel en nog niet empirisch gevalideerd.

## 16. Volledige synthetische run A — leerlingprofiel

### Observatie 1 — T1

Leerling maakt 7 stippen correct en benoemt `7`.

Evidence:
- D1 relevant: ja
- kwaliteit: goed
- coverage: laag
- variatie: laag
- contradictie: geen

Inference:
`D1 = OBSERVED/SUPPORTED`, afhankelijk van ingestelde bewijsdrempel.

Mastery:
`INSUFFICIENT EVIDENCE`

Next action:
`T2 / DIAGNOSTIC D2`

### Observatie 2 — T2

Leerling koppelt 8 stippen aan `8` en het juiste getalwoord.

Evidence:
- D1: ondersteunend
- D2: relevant en ondersteunend
- variatie: nog beperkt

Inference:
`D1 = SUPPORTED`
`D2 = SUPPORTED`
`D3 = INSUFFICIENT`

Mastery:
A1 niet volledig mastered; D3 ontbreekt en variation/stability ontbreken.

Next action:
`T3 / DIAGNOSTIC D3`

### Observatie 3 — T3

Leerling gebruikt een groepering van 10 + 4, koppelt dit aan `14`, en verwijst naar de stippen én de numerieke notatie.

Evidence:
- D3 relevant
- meerdere representaties gecoördineerd
- proces-evidence aanwezig
- eerste echte aanwijzing voor D3

Inference:
`D1 = SUPPORTED`
`D2 = SUPPORTED`
`D3 = OBSERVED/SUPPORTED`

Mastery:
Nog steeds `INSUFFICIENT EVIDENCE`, omdat één run geen stabiliteit en voldoende variatie aantoont.

Next action:
`VARIATION` of `STABILITY_CHECK`, niet automatisch een moeilijkere taak.

## 17. Synthetische run B — contradictie

Stel:

- T1 correct
- T2 correct bij stippen → getalsymbool
- T2 fout bij getalsymbool → getalwoord
- T3 correct na hint

De engine mag niet concluderen:
`D2 mastered`.

Wel:

```text
D1 = SUPPORTED
D2 = CONTRADICTORY / UNCERTAIN
D3 = INSUFFICIENT
```

Next action:
`CONTRADICTION_CHECK`

Doel van de volgende taak:
onderscheiden of de moeilijkheid in numerieke mapping, taalbelasting, representatietype of een andere factor zit.

## 18. Synthetische run C — alternative explanation

Stel dat de leerling mondeling de juiste mapping maakt, maar schriftelijk het getalwoord niet kan produceren.

De engine mag dit niet automatisch als zwakke numerieke ontwikkeling classificeren.

Candidate alternative explanations:

- taalbelasting
- spelling/schriftelijke productie
- interfacebelasting
- representatiekennis

Next action:
`VARIATION` met dezelfde numerieke claim maar lagere irrelevante taal-/interfacebelasting.

Dit sluit aan bij C9: context, taal, representatie, interface en andere factoren moeten als mogelijke alternatieve verklaringen worden meegenomen.

## 19. Wat de engine nu daadwerkelijk kan

Met deze prototypeketen kan PacoGO conceptueel:

1. een curriculumskill selecteren;
2. een kandidaatontwikkeling selecteren;
3. een claim koppelen;
4. een evidence target kiezen;
5. een task model selecteren;
6. een concrete task instance uitvoeren;
7. een performance opslaan;
8. observaties onderscheiden van interpretaties;
9. evidence claim-relatief beoordelen;
10. development per claim interpreteren;
11. mastery apart beoordelen;
12. onzekerheid expliciet bewaren;
13. tegenstrijdige evidence detecteren;
14. alternatieve verklaringen meenemen;
15. een volgende taak selecteren op informatiewaarde.

## 20. Wat nog NIET bewezen of technisch opgelost is

- A1-D1/D2/D3 zijn niet empirisch gevalideerd.
- De drempels voor evidence zijn niet empirisch bepaald.
- De weging van evidence is niet empirisch bepaald.
- De optimale taakvolgorde is niet empirisch bepaald.
- De next-action matrix is nog ontwerp-logica.
- Masterycriteria zijn nog kandidaatcriteria.
- Geen echte leerlingdata is gebruikt.
- Geen productieschaal of performance-optimalisatie is getest.
- Geen automatische AI-classificatie mag deze regels zelfstandig veranderen.

## 21. Eerste technische objecten

### Curriculum object

```json
{
  "skill_id": "A1",
  "name": "Getallen representeren en verbinden",
  "developments": ["A1-D1", "A1-D2", "A1-D3"]
}
```

### Evidence object

```json
{
  "claim_id": "A1-D2",
  "observation_ids": ["obs-001", "obs-002"],
  "relevance": "high",
  "quality": "good",
  "coverage": "partial",
  "contradiction": false,
  "alternative_explanations": []
}
```

### Inference object

```json
{
  "development_id": "A1-D2",
  "status": "SUPPORTED",
  "scope": "current_A1_assessment_window",
  "confidence": "candidate",
  "supporting_evidence": ["ev-002"],
  "contradicting_evidence": []
}
```

### Decision object

```json
{
  "student_id": "student-001",
  "current_state": {
    "A1-D1": "SUPPORTED",
    "A1-D2": "SUPPORTED",
    "A1-D3": "INSUFFICIENT"
  },
  "decision": "DIAGNOSTIC_D3",
  "reason": "D3 is the most informative unresolved development within current scope",
  "next_task_model": "TM-A1.3"
}
```

## 22. Belangrijkste prototype-uitkomst

Het verticale model werkt conceptueel zonder dat we development, difficulty, score en mastery aan elkaar gelijk hoeven te stellen.

De belangrijkste ontwerpwinst is de scheiding:

`OBSERVATION → EVIDENCE → INFERENCE → DECISION`

Daardoor kan de engine zeggen:

> "We weten nog onvoldoende over deze ontwikkeling; daarom kies ik deze taak om precies die onzekerheid te verminderen."

in plaats van:

> "Je had 80%, dus je mag naar het volgende niveau."

Dat onderscheid is de kern van het PacoGO Curriculum Engine-concept.

## 23. Volgende grote fase

Stap 11 is hiermee als conceptueel vertical slice uitgewerkt.

De volgende fase is niet meteen alle 32 skills bouwen.

Eerst moet dit prototype kritisch worden getest op:

1. falsificatie / adversarial cases;
2. meerdere soorten leerlingresponses;
3. contradicties;
4. alternatieve verklaringen;
5. mastery versus development;
6. automatische next-action;
7. overdraagbaarheid naar een tweede skill.

Pas daarna is het zinvol om de architectuur technisch te implementeren.
