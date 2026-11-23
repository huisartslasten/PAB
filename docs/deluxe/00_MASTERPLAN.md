# PacoGO Deluxe — Masterplan v0.1

**Status:** conceptuele basis vastgelegd; uitwerking verantwoordelijkheden volgt  
**Datum:** 23 november 2026  
**Repository:** `huisartslasten/PAB`  
**DEV:** `refactor/professional-v1`  
**LIVE:** `main` — verboden terrein voor wijzigingen.

## 1. Doel

PacoGO Deluxe wordt een modulaire uitbreiding van het bestaande PacoGO-platform. Het platform moet leren, oefenen, toetsen, interactieve opdrachten, games, verhalen, scènes, personages en verschillende leerlingervaringen kunnen ondersteunen.

**PacoGO is het platform en de enginebasis; werelden en ervaringen draaien daarbovenop.**

PacoGO Deluxe vervangt de bestaande applicatie niet. De bestaande leerbasis, curriculumlogica, leerlingidentiteit, resultaten en gegevens blijven behouden. Uitbreiding gebeurt gecontroleerd en stapsgewijs.

## 2. Ontwerpprincipes

1. **Leren blijft de hoofdzaak.** Interactie, verhaal, animatie en spelvormen ondersteunen leren; ze vervangen het niet.
2. **CONTENT != PRESENTATION != ENGINE.** Leerinhoud, presentatie en uitvoeringslogica blijven onderscheiden.
3. **Eén eigenaar per verantwoordelijkheid.** Geen dubbele registries, tweede bron van waarheid of parallelle kernfunctionaliteit.
4. **Hergebruik vóór nieuwbouw.** Bestaande PacoGO-onderdelen en contracten worden eerst geïnspecteerd.
5. **Additief ontwikkelen.** Geen big-bang-vervanging van de bestaande applicatie.
6. **PacoGO groeit mee met de leerling.** De onderliggende leerfunctionaliteit blijft beschikbaar terwijl de presentatie kan veranderen.
7. **Personages zijn uitbreidbaar.** Het Character System moet meer dan één hond/personage kunnen ondersteunen. Paco is het eerste personage; Milo is een mogelijke latere toevoeging.
8. **Geen speculatieve infrastructuur.** De volledige visie wordt ontworpen, maar niet alle toekomstige Engines, tabellen of editors worden direct gebouwd.
9. **Bestaande curriculumregels blijven leidend.** Deluxe maakt geen eigen SLO-, mastery-, evidence- of curriculumlogica.
10. **Testbare grenzen.** Contracten en integraties moeten afzonderlijk te testen zijn.

## 3. Vastgestelde projectvolgorde

De gebruiker heeft de volgende volgorde aangegeven:

1. De totale architectuurstructuur goed vastleggen.
2. De verantwoordelijkheden en grenzen van de onderdelen vaststellen.
3. Daarna het generieke Character System en Paco ontwerpen: uiterlijk, lichaamsbouw, bewegingen, animaties en expressies. Het systeem moet later een ander personage zoals Milo kunnen ondersteunen.
4. Vervolgens de gedeelde visuele identiteit en overige technische uitwerking verder concretiseren.
5. Pas daarna gefaseerd implementeren op basis van de vastgestelde structuur en technologiekeuzes.

Deze volgorde mag niet stilzwijgend worden omgedraaid. Als een afhankelijkheid een andere volgorde noodzakelijk lijkt te maken, eerst uitleggen en overleggen.

## 4. Vaste repo- en kwaliteitsregels

### 4.1 Repo-check aan het begin van iedere chat

Iedere nieuwe chat die aan PacoGO Deluxe werkt, begint met een actuele controle van:
- repository `huisartslasten/PAB`;
- gekozen DEV-branch `refactor/professional-v1`;
- actuele HEAD/commit;
- Git-status/aanwezige wijzigingen voor zover controleerbaar;
- relevante documentatie;
- relevante test- en CI-status.

Niet vertrouwen op een SHA of status uit een oude overdracht. Altijd opnieuw controleren.

### 4.2 LIVE blijft onaangeraakt

- `main` is LIVE.
- Nooit rechtstreeks wijzigen, experimenteren, mergen, resetten of forceren als onderdeel van Deluxe-werk.
- PacoGO Deluxe-ontwikkeling vindt plaats op `refactor/professional-v1`.
- Geen nieuwe Supabase-projecten.

### 4.3 Groen is verplicht

Bij iedere bouwstap moeten de relevante tests en regressiecontroles groen zijn. Rapporteer alleen groen als de controles daadwerkelijk zijn uitgevoerd en de resultaten zijn gecontroleerd.

### 4.4 Rood betekent STOP — eerst isoleren

Als een test of regressie rood is:
1. Stop met verdere wijzigingen.
2. Isoleer de falende test en het betrokken gedrag.
3. Verzamel bewijs en bepaal de feitelijke oorzaak.
4. Leg uit wat de oorzaak is en welke onderdelen geraakt worden.
5. Bespreek de gerichte oplossing waar een keuze nodig is.
6. Pas pas daarna een gerichte wijziging toe.
7. Voer de relevante tests en regressie opnieuw uit.
8. Ga pas verder als de vereiste controles groen zijn.

**Nooit direct patchen op basis van een foutmelding of symptoom.** Geen willekeurige patches, symptoombestrijding of tests aanpassen om een fout groen te laten lijken.

### 4.5 Geen verzonnen besluiten

- Geen architectuur, eisen, functionaliteit, technische keuzes, bestanden of modules verzinnen.
- Geen open punten zelf invullen of als besluit presenteren.
- Maak onderscheid tussen vastgesteld, voorstel, aanname en open vraag.
- Als informatie ontbreekt of een keuze nodig is: stop, leg de vraag en opties uit en overleg eerst.
- Een voorstel wordt pas een projectbesluit na akkoord van de gebruiker.
- Bestaande goedgekeurde documentatie en gebruikersbesluiten zijn leidend.

## 5. Centrale documentatie

De map `docs/deluxe/` is de centrale documentatiebasis:
- `00_MASTERPLAN.md` — visie en vaste projectregels.
- `01_ARCHITECTURE.md` — architectuurboom.
- `02_RESPONSIBILITIES.md` — verantwoordelijkheden en open grenzen.
- `03_CHARACTER_SYSTEM.md` — generiek avatarsysteem, Paco en latere personages.
- `04_DESIGN_SYSTEM.md` — visuele identiteit.
- `05_TECHNOLOGY_DECISIONS.md` — technologie-opties en besluiten.
- `06_IMPLEMENTATION_PLAN.md` — fasering en kwaliteitsgates.
- `07_CHANGELOG.md` — wijzigingshistorie.
- `PacoGO_Deluxe_Handoff_Current.md` — actuele overdracht voor de volgende chat.
- `PacoGO_Deluxe_Blueprint_v0.1.md` — bestaande gedetailleerde technische baseline.

## 6. Huidige status

- De conceptuele architectuurboom is door de gebruiker akkoord bevonden.
- De moduleverantwoordelijkheden zijn nog niet volledig uitgewerkt.
- Het generieke Character System is als richting vastgesteld; de technische methode en het definitieve Paco-ontwerp zijn nog niet gekozen.
- Paco is het eerste personage; Milo is een toekomstige mogelijkheid, geen huidig asset of uitgewerkt karakter.
- Er is nog geen toestemming gegeven om de volledige Deluxe-architectuur te implementeren.
- De volgende inhoudelijke stap is het uitwerken en afstemmen van de verantwoordelijkheden per architectuuronderdeel.

## 7. Belangrijkste toets

PacoGO Deluxe moet één samenhangend platform worden met een betrouwbare bestaande leerbasis, uitbreidbare systemen en verschillende ervaringen. We bouwen alleen wat op dat moment nodig, begrepen, afgesproken en testbaar is.
