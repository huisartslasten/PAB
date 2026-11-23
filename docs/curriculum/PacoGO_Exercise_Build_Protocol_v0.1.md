# PacoGO — Bouwprotocol voor oefeningen v0.1

**Status:** vastgesteld werkprotocol  
**Datum:** 22 november 2026; uitgebreid op 22 november 2026  
**Geldigheid:** alle nieuwe en wezenlijk herontworpen PacoGO-oefeningen  
**Repositorybranch:** `refactor/professional-v1`

## 1. Doel en uitgangspunt

Dit protocol zorgt ervoor dat PacoGO-oefeningen aantoonbaar bijdragen aan bestaande curriculumdoelen, voortbouwen op bestaande taken en Learning Interfaces, en centraal en herbruikbaar worden gebouwd.

De vaste volgorde is:

**eerst doelen → dan dekking → dan didactisch ontwerp → dan technisch ontwerp → dan bouwen → dan verifiëren en registreren.**

Een verzoek van de gebruiker om een oefening te bouwen start altijd bij fase 1. Er wordt niet direct geprogrammeerd.

## 2. Fase 1 — Curriculuminventarisatie

1. Bepaal het primaire SLO-kerndoel en de relevante rekendomeinen.
2. Raadpleeg de bestaande SLO-bronnen en doelinventarisaties in de repository.
3. Identificeer het bestaande tussendoel of de combinatie van tussendoelen die de oefening primair beoogt te ondersteunen.
4. Leg de exacte doelidentiteiten en bronverwijzingen vast.
5. Controleer of de doelrecords voldoende nauwkeurig en inhoudelijk bruikbaar zijn.
6. Onderzoek daarnaast **domeinoverstijgend** welke andere SLO-kerndoelen en tussendoelen mogelijk door dezelfde oefening worden aangesproken. Beperk deze verkenning niet vooraf tot het primaire rekendomein.
7. Maak onderscheid tussen een inhoudelijke doelrelatie en alleen een gedeelde context, woord, notatie of representatie. Een oppervlakkige overeenkomst is geen dekking.

**Resultaat:** een traceerbare inventarisatie van het primaire doel en mogelijke aanvullende doelrelaties. Als bron, formulering of doelidentiteit onvoldoende duidelijk is, wordt die onduidelijkheid eerst onderzocht; er worden geen doelen verzonnen.

## 3. Fase 2 — Bestaande dekking onderzoeken

1. Zoek naar bestaande oefeningen en oefenroutes die met de doelen verband houden.
2. Onderzoek welke bestaande taken, task models, claims en evidence-contracten relevant zijn.
3. Controleer welke centrale Learning Interface(s) al bestaan en geschikt zijn.
4. Bepaal welke dekking al aantoonbaar aanwezig is.
5. Beschrijf de resterende hiaten.
6. Onderzoek mogelijke dekking voor ieder relevant kerndoel en tussendoel afzonderlijk, ook wanneer het buiten het primaire domein valt.

**Resultaat:** een dekkingsanalyse die hergebruik en echte ontbrekende dekking onderscheidt. Een doel wordt niet als gedekt aangemerkt alleen omdat een oefening er globaal over gaat.

## 4. Fase 3 — Didactisch ontwerp

Beschrijf vóór de bouw:

- wat de leerling leert en waarom;
- welk primair tussendoel wordt aangesproken;
- welke mogelijke aanvullende kerndoelen/tussendoelen worden aangesproken;
- welke kennis, strategie of handeling de leerling moet laten zien;
- welke taakvorm en interactie daarvoor nodig zijn;
- welke representatie of visualisatie pedagogisch passend is;
- welke ondersteuning, feedback en eventuele afbouw van hulp nodig is;
- welke instructiemethode, terminologie en notatie de leerling op school gebruikt, voor zover die informatie bevestigd is.

Curriculumdoel, instructiemethode en Learning Interface blijven onderscheiden. Bij onbekende of onzekere schoolmethodes wordt geen school-specifieke werkwijze verzonnen of als afgestemd gepresenteerd.

**Resultaat:** een didactisch ontwerp met expliciete relatie tussen doel, taak, interactie en observeerbare leerlingprestatie.

## 5. Fase 4 — Technisch ontwerp en centrale hergebruikstoets

Bepaal vóór implementatie:

1. Welke bestaande centrale oefen- of paginatemplate wordt hergebruikt?
2. Welke bestaande Learning Interface is geschikt?
3. Welke centrale componenten, configuraties en interactiepatronen kunnen worden hergebruikt?
4. Hoe worden taakidentiteit, interactie, observatie en evidence via de bestaande runtime- en curriculumcontracten afgehandeld?
5. Welke minimale uitbreiding ontbreekt werkelijk?
6. Hoe krijgt de oefening een **stabiele, domeinoverstijgende PacoGO-oefen-ID** die onafhankelijk is van kerndoel, tussendoel, skill, groep, oefentype of Learning Interface?

**Centrale bouwregel:** bouw zo centraal mogelijk. Maak geen afzonderlijke template, renderer, interface of oefenimplementatie als een bestaande centrale voorziening de behoefte kan dragen. Voor breukenoefeningen wordt de bestaande centrale Fraction Learning Interface gebruikt wanneer die passend is; er wordt niet per oefening een nieuwe breukeninterface gebouwd.

Als een uitbreiding van een centrale voorziening nodig is, ontwerp die als generieke, herbruikbare uitbreiding. Een domeinspecifieke uitzondering vereist een aantoonbare inhoudelijke of technische reden.

**Resultaat:** een compact technisch ontwerp dat expliciet aangeeft wat wordt hergebruikt, wat nieuw moet worden gebouwd en hoe de stabiele oefenidentiteit wordt vastgelegd.

## 6. Fase 5 — Bouwbesluit en implementatie

Voordat code wordt gewijzigd:

1. Controleer de actuele branch en repositorystatus.
2. Controleer de actuele Full Regression.
3. Bij groen: bouw volgens het goedgekeurde ontwerp.
4. Bij rood: stop met bouwen, isoleer de exacte oorzaak, classificeer die (code, test, architectuurcontract, data/schema of CI/environment) en ontwerp eerst de onderliggende correcte oplossing.
5. Patch niet op basis van aannames en wijzig tests niet uitsluitend om een regressie groen te krijgen.

Implementeer daarna de oefening binnen de bestaande architectuur. Wijzig C1–C9, curriculumcontracten, skill/development/claim-structuren, evidence targets, mastery, learner state, bestaande studentdata of Supabase niet zonder aangetoonde noodzaak en expliciete opdracht.

## 7. Fase 6 — Verificatie

Controleer minimaal:

- de oefening werkt volgens het didactisch ontwerp;
- de PacoGO-oefen-ID is stabiel en uniek;
- de juiste taak en taakidentiteit worden gebruikt;
- interacties en observaties voldoen aan de bestaande contracten;
- de geregistreerde evidence is daadwerkelijk relevant voor de beoogde doelen;
- eventuele meerdere doelkoppelingen worden afzonderlijk inhoudelijk gerechtvaardigd;
- onjuiste antwoorden, ontbrekende invoer en relevante randgevallen worden correct afgehandeld;
- bestaande centrale interfaces, templates, oefeningen en routes blijven werken.

Voer na implementatie opnieuw Full Regression uit. Rapporteer uitsluitend een groene status als de workflow daadwerkelijk is afgerond met `completed / success`, met vermelding van de exacte geteste commit en het regressienummer/run-ID.

## 8. Fase 7 — Centrale registratie en traceerbaarheid

Registreer de oefening via de bestaande centrale registratiestructuur en contracten. Leg, voor zover van toepassing, minimaal vast:

- stabiele, unieke PacoGO-oefen-ID;
- versie-/wijzigingsidentiteit, zodat wijzigingen aan de oefening traceerbaar blijven zonder de stabiele oefenidentiteit te vervangen;
- naam, beschrijving en oefentype;
- primair kerndoel, exacte primaire tussendoel-ID's en primaire skill/task-relaties voor zover die contractueel bestaan;
- mogelijke aanvullende kerndoelen en exacte tussendoel-ID's, ook domeinoverstijgend;
- rol van iedere doelrelatie (primair of aanvullend; verdere rangorde indien zinvol);
- bronverwijzing van ieder gekoppeld doel;
- didactisch doel en taakvorm;
- gebruikte centrale Learning Interface en configuratie;
- relevante interactie- en evidence-relaties;
- dekkingsstatus en inhoudelijke onderbouwing per afzonderlijke doelrelatie;
- technische implementatie- en verificatiestatus.

De oefen-ID is de identiteit van de oefening en codeert geen domein, kerndoel, skill, groep, oefentype of interface. Curriculumrelaties kunnen later worden toegevoegd, aangepast of opnieuw beoordeeld zonder de oefen-ID te veranderen.

De registratie maakt onderscheid tussen:
- beoogde dekking;
- mogelijke dekking die nog onderzocht moet worden;
- geïmplementeerde dekking;
- gedeeltelijke dekking;
- inhoudelijk/evidence-matig geverifieerde dekking;
- ondersteunende relatie;
- geen dekking.

De precieze statuswaarden moeten aansluiten op bestaande contracten; dit protocol creëert niet zelfstandig een nieuw runtime- of databaseschema. Alleen inhoudelijk en evidence-matig geverifieerde dekking mag als geverifieerd worden aangeduid. Een doelrelatie of oefen-ID is geen automatische claim van mastery of beheersing.

## 9. Relaties tussen doelen en oefeningen

- Eén oefening mag meerdere kerndoelen en tussendoelen ondersteunen wanneer de taak en de verzamelde evidence die doelen daadwerkelijk aanspreken.
- Eén kerndoel of tussendoel mag door meerdere oefeningen worden ondersteund wanneer die verschillende relevante taakvormen, contexten of bewijsgelegenheden bieden.
- Iedere doelrelatie wordt afzonderlijk onderbouwd; de primaire, secundaire, tertiaire of verdere rol zegt op zichzelf niets over de mate van dekking.
- Een doelkoppeling is geen automatische claim van mastery of beheersing.
- Oefenen, tussentoetsen en toetsen blijven onderscheiden volgens de bestaande PacoGO-contracten; dit protocol verandert de regels voor hulp, beoordeling of mastery niet.

Het uiteindelijke doel is dat de verzamelde stabiele oefen-ID's en afzonderlijk onderbouwde doelrelaties later samen een centraal, domeinoverstijgend oefeningennetwerk kunnen vormen. Daarmee kan PacoGO inzichtelijk maken welke kerndoelen en vooral welke SLO-tussendoelen door bestaande oefeningen volledig, gedeeltelijk, ondersteunend of nog niet worden afgedekt. Dit netwerk wordt niet door dit protocol zelf gebouwd.

## 10. Vaste starttrigger

Wanneer de gebruiker zegt **"we gaan een oefening bouwen"**, start de werkwijze bij **Fase 1 — Curriculuminventarisatie**.

De fases worden in volgorde doorlopen. Een fase wordt niet stilzwijgend overgeslagen. Als informatie ontbreekt, wordt eerst gericht onderzocht of één noodzakelijke verduidelijking gevraagd. Er wordt niet alvast gebouwd terwijl de doeldekking of het ontwerp nog onduidelijk is.

## 11. Afbakening

Dit document is een werkprotocol voor het ontwerpen, bouwen, koppelen en verifiëren van oefeningen. Het introduceert op zichzelf geen nieuwe SLO-doelen, PacoGO-skills, developments, claims, task models, evidence targets, masteryregels, Learning Interfaces, databaseschema's of productfunctionaliteit. Bestaande bron- en architectuurcontracten blijven leidend.

Het protocol verplicht tot het onderzoeken en traceerbaar voorbereiden van mogelijke domeinoverstijgende doelrelaties, maar bouwt nog geen centraal oefeningennetwerk of nieuw technisch registratiesysteem.
