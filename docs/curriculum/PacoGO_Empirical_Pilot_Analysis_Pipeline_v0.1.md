# PacoGO Empirical Pilot Analysis Pipeline v0.1

Status: Candidate  
Epistemic status: [O]  
Purpose: reproduceerbare technische keten van pilotdataset naar C3-betrouwbaarheidslaag, C4-meetgate en descriptief rapport.

## Pipeline

De pipeline voert in vaste volgorde uit:

1. **Dataset-integriteit**
   - valideert task instances, raw observations en C3 coding records;
   - controleert referentiële integriteit en coder-round uniciteit;
   - bouwt een deterministische snapshot zonder de bronarrays te muteren.
2. **Pilot-analyse**
   - koppelt observaties aan de zes vooraf vastgelegde focal claims;
   - berekent alleen protocolgebonden descriptieve readiness-indicatoren;
   - maakt geen mastery-, ontwikkelings-, prerequisite- of curriculum-beslissingen.
3. **C3 betrouwbaarheid**
   - bepaalt per claim de double-coding paren en agreement-maten;
   - behoudt onafhankelijke coderrecords;
   - neemt de formele reliability-status uitsluitend over uit een expliciet aangeleverde review.
4. **C4 measurement gate**
   - combineert pilot-readiness met de expliciete C3 reliability-status;
   - kan alleen `READY_FOR_C4`, `BLOCKED_BY_CODING_RELIABILITY` of `REVISE_PROTOCOL` opleveren.
5. **Descriptief rapport**
   - produceert aantallen, verdelingen, missingness, taak/variatie-dekking en coderbetrouwbaarheid;
   - blijft descriptief en bevat geen automatische ontwikkelings- of curriculumconclusie.

## Belangrijk ontwerpbesluit

De pipeline **inferreert geen coderbetrouwbaarheid**. Een agreement-percentage wordt berekend, maar de formele status (`ACCEPTABLE_FOR_PILOT_CODING`, enz.) moet expliciet door de C3 reviewlaag worden aangeleverd. Daarmee wordt voorkomen dat PacoGO zelf een niet-gevalideerde drempel verzint.

## Uitkomstgrenzen

De pipeline zet altijd expliciet:

- `developmental_conclusion_allowed = false`
- `registry_promotion_allowed = false`
- `mastery_rule_change_allowed = false`
- `developmental_ordering_inference_allowed = false`

Deze pipeline is een reproduceerbare analyseketen voor onderzoek en validatie. Zij is geen runtime mastery-engine en schrijft geen leerlingstatus terug naar de curriculum registry.
