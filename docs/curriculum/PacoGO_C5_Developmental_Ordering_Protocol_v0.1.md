# PacoGO C5 — Developmental Ordering & Prerequisite Validation Protocol v0.1

Branch: `refactor/professional-v1`
Status: **Candidate protocol / design-only**
Epistemic status: **[O]**

## 1. Doel

C5 onderzoekt of een kandidaatrelatie tussen twee developments werkelijk een **ontwikkelingsordening** of **prerequisite-relatie** beschrijft.

C5 is bewust gescheiden van C4. C4 vraagt of een kandidaat-developmentinterpretatie beter past bij de waargenomen evidence dan plausibele alternatieven. C5 vraagt vervolgens of relaties tussen developments empirisch een bepaalde richting of afhankelijkheid ondersteunen.

De `candidate_order`-velden in de curriculum registry zijn daarom uitsluitend voorlopige hypotheselabels. Ze zijn geen empirisch aangetoonde volgorde. De registry wordt door C5 niet automatisch gewijzigd.

## 2. Wat C5 wel en niet beweert

C5 moet minimaal de volgende relaties uit elkaar houden:

1. **Task order** — de volgorde waarin taken worden aangeboden.
2. **Temporal precedence** — development A wordt gemiddeld eerder waargenomen dan B.
3. **Prediction** — informatie over A voorspelt latere prestaties/ontwikkeling in B.
4. **Prerequisite / necessary condition** — B kan binnen de onderzochte scope niet betrouwbaar worden bereikt zonder A.
5. **Causal/instructional relation** — verandering in A veroorzaakt, geheel of gedeeltelijk, verandering in B onder een passend onderzoeksdesign.
6. **Correlation/shared cause** — A en B hangen samen door een derde factor of gedeelde latent factor.

Een gevonden temporele volgorde is dus niet automatisch een prerequisite. Een voorspellende relatie is niet automatisch causaal. Een correlatie is niet automatisch een ontwikkelingsvolgorde.

## 3. Primaire onderzoekseenheid

De primaire eenheid is de **relationele ontwikkelingsclaim**:

`development A → development B`

Elke claim krijgt een expliciete relation type, scope, voorspelling, evidence target, alternatieve verklaring en vooraf vastgelegde beslisregel.

Voorbeeld:

> Candidate claim: A1.D1 precedeert A1.D2.

Deze formulering mag niet stilzwijgend worden gelezen als:

> A1.D1 is noodzakelijk voor A1.D2.

Daarvoor is sterker bewijs nodig.

## 4. Hypothesevormen

Elke C5-relatie wordt vooraf als één of meer afzonderlijke hypothesen vastgelegd:

### H1 — temporele precedence
A wordt vóór B stabieler of eerder geobserveerd.

### H2 — voorspellende relatie
Een eerdere meting van A voorspelt latere verandering in B bovenop relevante baseline-informatie.

### H3 — prerequisite
Adequate ontwikkeling van B vereist binnen de onderzochte scope voldoende ontwikkeling van A. Dit is een sterkere claim dan voorspelling.

### H4 — causale/instructionele relatie
Een interventie die A verandert, verandert vervolgens B op een manier die past bij de vooraf gespecificeerde causale hypothese.

H1–H4 mogen niet worden samengevoegd tot één algemene "order score".

## 5. Onderzoeksdesigns

### 5.1 Cross-sectioneel
Kan verschillen tussen leerlingen op één moment beschrijven, maar levert op zichzelf onvoldoende bewijs voor temporele precedence of prerequisite-relaties.

### 5.2 Longitudinaal
Heeft de voorkeur voor H1 en H2. Herhaalde metingen moeten voldoende zijn om verandering, stabiliteit en overgang tussen development-states te onderscheiden van meetruis.

### 5.3 Transition/sequence modelling
Waar passend kunnen transition models, state-transition analyses, latent transition models, growth models of vergelijkbare methoden worden gebruikt. De estimator wordt pas gekozen nadat de schaal, meetfrequentie, missingness en steekproefstructuur bekend zijn.

### 5.4 Cross-lagged of vergelijkbare temporele modellen
Kunnen wederkerige relaties onderzoeken, maar mogen niet automatisch als causaal worden geïnterpreteerd. Modelkeuze en interpretatie moeten rekening houden met baseline-stabiliteit en gedeelde oorzaken.

### 5.5 Interventionele designs
Zijn nodig wanneer een causale/instructionele claim wordt gemaakt. Een voor-na-verbetering zonder geschikte vergelijking of controle ondersteunt geen sterke causale conclusie.

## 6. Taak- en meetontwerp

C5 gebruikt bij voorkeur dezelfde evidence-principes als C4, maar voegt expliciet **tijd en overgang** toe.

De meting moet waar mogelijk:

- meerdere observaties per development bevatten;
- relevante task- en representatievariatie bevatten;
- task difficulty onderscheiden van development;
- familiariteit en oefenblootstelling registreren;
- prompt-, taal- en contextinvloeden registreren;
- procesinformatie verzamelen wanneer een correcte uitkomst onvoldoende onderscheidend is;
- dezelfde constructen op meerdere tijdstippen meten;
- voldoende overlap in taken/constructen behouden om verandering te interpreteren;
- ceiling/floor-effecten beperken;
- missingness en uitval expliciet analyseren.

Een reeks moeilijker wordende taken is geen bewijs voor een ontwikkelingsvolgorde wanneer de taken zelf de volgorde afdwingen.

## 7. Alternatieve verklaringen

Iedere ordering-claim moet minimaal worden vergeleken met relevante alternatieven:

- `M0_unordered`: geen specifieke ontwikkelingsvolgorde;
- `M1_task`: verschil verklaard door task demand/difficulty;
- `M2_familiarity`: verschil verklaard door oefening of bekendheid;
- `M3_representation_specific`: verschil beperkt tot een bepaalde representatie/surface;
- `M4_shared_latent`: A en B reflecteren deels dezelfde onderliggende capaciteit;
- `M5_context_language`: taal, instructie, context of culturele/schoolse blootstelling verklaart een deel van het patroon;
- `M6_reciprocal`: A en B beïnvloeden elkaar in plaats van één vaste richting;
- `M7_instruction_exposure`: verschillen volgen uit ongelijke instructieblootstelling.

De relevante alternatieven worden vooraf geselecteerd. Ze mogen na het zien van de uitkomst niet opportunistisch worden toegevoegd of verwijderd zonder versionering en transparante rationale.

## 8. C5-evidence

Sterker bewijs voor temporal precedence vereist ten minste:

1. herhaalde metingen;
2. voldoende betrouwbare development-meting;
3. aantoonbare verandering of overgang;
4. een richting die vooraf is gespecificeerd;
5. vergelijking met plausibele alternatieve verklaringen;
6. robuustheid over relevante taak-/representatievariatie;
7. geen materiële verklaring door alleen taakmoeilijkheid, familiariteit, taal/context of instructieblootstelling.

Sterker bewijs voor prediction vereist daarnaast dat A latere verandering in B voorspelt bovenop relevante baseline-informatie en alternatieve verklaringen.

Sterker bewijs voor prerequisite vereist meer dan prediction: er moet overtuigend bewijs zijn dat B zonder voldoende A binnen de onderzochte scope niet of slechts zeer beperkt kan worden bereikt, met expliciete aandacht voor uitzonderingen en alternatieve routes.

Causale claims vereisen een passend interventioneel of quasi-experimenteel ontwerp; observationele orderingdata zijn daarvoor onvoldoende.

## 9. Confirmatory versus defining observations

Voor iedere claim wordt vooraf vastgelegd welke observaties:

- **defining** zijn voor de hypothese;
- **confirmatory** zijn voor een reeds gespecificeerd patroon;
- **exploratory** zijn en dus niet zelfstandig de claim mogen bevestigen.

Het achteraf herdefiniëren van een onverwachte uitkomst als "de juiste ontwikkeling" telt niet als bevestiging.

## 10. Modelvergelijking

De primaire vergelijking is niet alleen:

`A → B` versus `B → A`.

Minimaal moet waar passend worden onderzocht of de data ook passen bij:

- geen specifieke volgorde;
- een wederkerig model;
- een gedeelde latent-factor model;
- een task/familiarity-model;
- een representation-specific model;
- een instruction-exposure model.

Modelvergelijking mag niet worden gereduceerd tot één statistische fitmaat. Effectgrootte, onzekerheid, reproduceerbaarheid, praktische betekenis en vooraf gespecificeerde beperkingen moeten worden meegenomen.

## 11. Invariance en context

Een ordering-claim is niet algemeen geldig als het patroon alleen optreedt onder één specifieke taakvorm, taal, instructiestijl, representatie of populatie zonder dat dit onderdeel van de claim is.

Waar relevant moeten verschillen worden onderzocht naar:

- taaktype;
- representatie;
- taal/instructietaal;
- context;
- instructieblootstelling;
- relevante leerlingkenmerken;
- meetmoment.

Measurement invariance of een inhoudelijk passende equivalentie-analyse is nodig wanneer scores tussen groepen of tijdstippen als dezelfde schaal worden geïnterpreteerd.

## 12. Beslisstatussen

C5 gebruikt minimaal de volgende uitkomsten:

- `NOT_TESTABLE_YET` — ontwerp/data onvoldoende om de relatie te testen;
- `INDETERMINATE` — data onderscheiden de modellen onvoldoende;
- `SUPPORTED_TEMPORAL_PRECEDENCE` — temporele precedence binnen scope ondersteund;
- `SUPPORTED_PREDICTION` — voorspellende richting binnen scope ondersteund;
- `SUPPORTED_PREREQUISITE` — prerequisite-claim binnen expliciete scope ondersteund;
- `SUPPORTED_CAUSAL_RELATION` — causale/instructionele claim binnen expliciete scope ondersteund;
- `CONTRADICTED_WITHIN_SCOPE` — vooraf gespecificeerd patroon wordt tegengesproken;
- `REVISE_CANDIDATE` — de kandidaatrelatie of ontwikkelingsdefinitie moet worden herzien.

Een zwakkere uitkomst mag nooit automatisch worden opgewaardeerd naar een sterkere. Bijvoorbeeld: `SUPPORTED_PREDICTION` betekent niet `SUPPORTED_PREREQUISITE`.

## 13. Ordering mag partieel zijn

PacoGO mag niet vooraf afdwingen dat iedere development-lijn een totale lineaire volgorde heeft.

Mogelijke empirische uitkomsten zijn bijvoorbeeld:

- D1 → D2;
- D1 → D3, terwijl D2 niet noodzakelijk tussen beide ligt;
- D1 en D2 wederzijds gekoppeld;
- D2 en D3 parallelle ontwikkelingen;
- meerdere routes naar D3;
- geen empirisch aantoonbare ordering.

Een registry met `candidate_order: 1,2,3` is dus een werkhypothese en geen bewijs dat de werkelijkheid lineair is.

## 14. Candidate → Supported → Validated

### Candidate → Supported
Een ordering-claim kan alleen naar Supported wanneer vooraf gespecificeerde relationele hypothese, meetmodel, evidence target, relevante alternatieven en scope expliciet zijn; het empirische patroon de claim ondersteunt; meetkwaliteit voldoende is; alternatieven zijn onderzocht; contradicties en beperkingen zijn gerapporteerd; en de uitkomst reproduceerbaar/auditeerbaar is binnen de onderzochte scope.

### Supported → Validated
Hiervoor is sterkere onafhankelijke of gescheiden replicatie nodig, relevante out-of-sample of nieuwe-cohort toetsing waar van toepassing, robuustheid over taken/contexten/groepen, expliciete generaliseerbaarheid en geen materiële onverklaarde contradicties.

## 15. Geen automatische curriculumwijziging

C5-resultaten mogen niet rechtstreeks runtime-regels, mastery thresholds, next-action logic of de registry-volgorde wijzigen.

Curriculumwijzigingen verlopen via een afzonderlijk versioned revision-proces (C10), met:

`claim → evidence → C5 decision → limitation/alternative review → revision proposal → registry version → regression`

## 16. Minimale C5-record

Elke C5-relatie moet minimaal bevatten:

- relation ID;
- source development;
- target development;
- relation type;
- scope;
- candidate claim;
- directional prediction;
- evidence targets;
- required design/data;
- defining observations;
- confirmatory observations;
- relevant alternatives;
- contradiction criteria;
- decision criteria;
- current status;
- epistemic label.

## 17. Huidige status PacoGO

De bestaande A1-, B1- en FR2-developmentvolgordes blijven **Candidate**. De huidige `candidate_order`-velden worden niet verwijderd, maar mogen uitsluitend als hypothese-index worden gebruikt totdat C5 empirisch is uitgevoerd.

Deze protocolversie is een reproduceerbaar onderzoeksontwerp, geen bewijs dat enige development-volgorde correct is.
