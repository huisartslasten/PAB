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


## 12. Aanvullende kwaliteitscontrole — begrijpend lezen

Voor oefeningen binnen begrijpend lezen wordt tijdens fase 3 (didactisch ontwerp) en fase 6 (verificatie) ook de centrale **PacoGO Kwaliteitschecklist Begrijpend Lezen v0.1** geraadpleegd: `docs/curriculum/PacoGO_Kwaliteitschecklist_Begrijpend_Lezen_v0.1.md`.

De checklist controleert tekstkwaliteit, leesvaardigheden/taakdekking, vraagkwaliteit en beoordeling. Zij is een PacoGO-ontwerpstandaard, geen officiële Cito-checklist en geen bewijs van Cito-equivalentie, betrouwbaarheid of validiteit. Er wordt geen aparte begrijpend-lezen-bouwmodule of runtime geïntroduceerd. De bestaande centrale paginatemplates, Learning Interfaces en curriculum-/runtimecontracten blijven leidend.

## 13. Bronvermelding en gebruiksrechten van tekst en beeld

Deze regels gelden voor **alle PacoGO-oefeningen, lessen, teksten, afbeeldingen, illustraties, schema's, kaarten, diagrammen, audio en ander extern materiaal**. Broncontrole is een vast onderdeel van het bouwproces en mag niet worden overgeslagen.

### 13.1 Bronnen bij tekstuele inhoud

1. Vermeld externe bronnen bij de relevante tekst of passage, zodat zichtbaar is welke bron welke informatie ondersteunt.
2. Neem daarnaast een overzichtelijke bronnenlijst op bij de oefening of het lesmateriaal. Een bronvermelding onderaan vervangt niet de verwijzing bij een specifieke bewering wanneer die relatie anders onduidelijk wordt.
3. Controleer of de geraadpleegde bron de betreffende bewering daadwerkelijk ondersteunt. Een algemene website of een bron die alleen over het onderwerp gaat, is niet automatisch voldoende.
4. Noteer waar relevant auteur/organisatie, titel, publicatiedatum of actualisatiedatum en een directe, stabiele URL. Vermeld bij dynamische of veranderlijke bronnen ook de raadpleegdatum.
5. Maak onderscheid tussen letterlijk citaat, parafrase, feitelijke informatie en eigen didactische formulering. Gebruik citaten beperkt en respecteer auteursrecht en eventuele licentievoorwaarden.
6. Controleer bij wetenschappelijke, historische, medische of andere feitelijke claims of de bron voldoende gezaghebbend en actueel is. Bij onzekerheid wordt de formulering genuanceerd of wordt eerst aanvullend onderzoek gedaan.
7. Verzin geen bronvermeldingen en presenteer een bron niet als onderbouwing wanneer de inhoud die claim niet ondersteunt.

### 13.2 Afbeeldingen en ander extern materiaal

Controleer **vóór opname** van ieder extern beeld- of mediabestand of PacoGO het materiaal daadwerkelijk mag gebruiken in de beoogde context.

Leg per gebruikt item minimaal vast:
- directe bronpagina en, waar mogelijk, de oorspronkelijke downloadpagina;
- titel of korte omschrijving van het item;
- maker, fotograaf, illustrator of rechthebbende, voor zover vermeld;
- exacte licentie of expliciete gebruikstoestemming;
- de URL naar de licentievoorwaarden;
- de vereiste naamsvermelding en eventuele verplichte formulering;
- of bewerken, bijsnijden, aanpassen of combineren is toegestaan;
- of hergebruik, verspreiding en commercieel gebruik zijn toegestaan;
- welke wijzigingen PacoGO zelf aan het materiaal heeft aangebracht.

Een zoekresultaat, afbeeldingsvoorbeeld, zoekmachinevermelding of het enkele feit dat een afbeelding op een bekende website staat, geldt **niet** als bewijs van gebruiksrecht. Controleer de voorwaarden bij de oorspronkelijke bron en let op materiaal van derden dat van de algemene voorwaarden van de website kan zijn uitgesloten.

### 13.3 Voorkeursvolgorde voor beeldmateriaal

Kies bij voorkeur materiaal in deze volgorde:

1. Eigen, door of voor PacoGO gemaakt materiaal waarvan de gebruiksrechten duidelijk bij PacoGO liggen.
2. Materiaal in het publieke domein, mits de status en eventuele uitzonderingen bij de oorspronkelijke bron zijn gecontroleerd.
3. Materiaal onder **CC0**.
4. Materiaal onder een Creative Commons-licentie die het beoogde gebruik toestaat, bij voorkeur **CC BY** wanneer correcte naamsvermelding volstaat.

Omdat PacoGO later commercieel kan worden aangeboden en materiaal mogelijk voor de interface moet worden aangepast, hebben licenties die commercieel gebruik en bewerking toestaan de voorkeur. Controleer daarom expliciet:
- **NC (NonCommercial):** niet gebruiken voor materiaal dat mogelijk onderdeel wordt van een commercieel PacoGO-product, tenzij afzonderlijke toestemming voor dat gebruik is verkregen.
- **ND (NoDerivatives):** vermijden wanneer bijsnijden, aanpassen, vertalen, annoteren of andere bewerkingen nodig kunnen zijn; alleen gebruiken wanneer het materiaal ongewijzigd en volgens de voorwaarden kan worden geplaatst.
- **SA (ShareAlike):** controleer vóór gebruik welke verplichtingen gelden voor aangepaste versies en of die verenigbaar zijn met de beoogde verspreiding van PacoGO.

Een aanduiding als 'gratis', 'free download' of 'voor educatief gebruik' is op zichzelf geen voldoende licentiecontrole. Ook een publiek toegankelijke afbeelding kan rechten of voorwaarden hebben.

### 13.4 Beslisregel bij twijfel

- Is de licentie of toestemming niet duidelijk, niet controleerbaar of niet passend bij het beoogde gebruik? **Gebruik het materiaal dan niet.**
- Zoek een aantoonbaar vrij alternatief of maak eigen materiaal.
- Ga niet uit van toestemming op basis van de naam van een organisatie, zoals NASA, ESA, een museum, universiteit of onderwijswebsite. Controleer steeds de specifieke afbeelding en eventuele uitzonderingen.
- Bewaar de bron- en licentiegegevens bij het oefen-/lesdossier, zodat herkomst en toegestane gebruikswijze later opnieuw controleerbaar zijn.
- Bronvermelding is verplicht waar de bron/licentie dit vereist en blijft daarnaast PacoGO-standaard voor transparantie. Bronvermelding maakt ongeoorloofd gebruik niet alsnog toegestaan.

**Bouwpoort:** een externe afbeelding of tekstbron wordt pas opgenomen nadat de broninhoud en de relevante gebruiksvoorwaarden zijn gecontroleerd. Bij ontbrekende zekerheid wordt het item vervangen of weggelaten. Deze regel geldt ook wanneer het materiaal al in een eerdere conceptversie of chat is voorgesteld.


## 14. Kwantitatieve ondergrens voor doelkoppelingen (25 november 2026)

### 14.1 Ontwerpregel
Een oefening wordt alleen aan een afzonderlijk SLO-tussendoel gekoppeld wanneer **minimaal 30% van de beoordeelde vragen/items** dat specifieke tussendoel daadwerkelijk aanspreekt.

Deze 30%-grens is een voorlopige PacoGO-ontwerpregel voor inhoudelijke curriculumregistratie. Het is geen empirisch gevalideerde norm, geen SLO-norm en geen bewijs van betrouwbaarheid, validiteit, beheersing of volledige dekking.

### 14.2 Tellen en beoordelen
1. Beoordeel elk tussendoel afzonderlijk; tel geen vragen voor verschillende tussendoelen bij elkaar op om de grens te halen.
2. De noemer is het totale aantal inhoudelijk beoordeelde/scorende vragen of items in de oefening. Niet-beoordeelde tekst, instructies en louter decoratieve onderdelen tellen niet mee.
3. De teller bevat alleen items waarbij de leerling de betreffende vaardigheid nodig heeft om het antwoord te bepalen en waarbij de taak daar observeerbaar bewijs voor vraagt.
4. Een onderwerp, woord, tekstverband of context die alleen in de tekst voorkomt, telt niet als bewijs dat de vraag die vaardigheid aanspreekt.
5. Tel ieder item maximaal één keer per tussendoel. Eén item kan wel voor meer dan één tussendoel relevant zijn als het antwoord aantoonbaar beide vaardigheden vereist.
6. De minimale aantallen worden naar boven afgerond: ceil(0,30 × totaal aantal beoordeelde items).
7. Bij een klein aantal items is de procentuele uitkomst grofmazig. Leg daarom altijd de itemnummers en inhoudelijke motivering vast; het percentage vervangt de inhoudelijke beoordeling niet.

### 14.3 Interpretatie
- Minder dan 30%: geen curriculumkoppeling met dat tussendoel; hoogstens incidentele aandacht.
- 30% of meer: de oefening mag als relevante oefening voor dat tussendoel worden geregistreerd, mits de inhoudelijke itemanalyse dit ondersteunt.
- Een koppeling betekent niet dat het tussendoel volledig wordt gedekt of dat de leerling het beheerst.
- Volledige of brede doeldekking vereist een afzonderlijke inhoudelijke analyse van de breedte van het doel en het bewijs. De 30%-grens alleen is daarvoor nooit voldoende.

### 14.4 Herbeoordeling van bestaande relaties
Bestaande oefenrelaties zijn niet automatisch grandfathered. Beoordeel ze opnieuw aan deze regel voordat ze als inhoudelijk bevestigde koppeling worden behandeld. Verwijder of wijzig bestaande relaties pas na die afzonderlijke itemanalyse en volgens de normale regression-first workflow.


## 15. Verplichte signaalwoorden-vraag bij begrijpend lezen

Iedere PacoGO-oefening begrijpend lezen bevat minimaal **één inhoudelijk beoordeelde vraag over een signaalwoord en het tekstverband dat dit woord in de gekozen context aangeeft**. Deze vraag is een vaste didactische eis en wordt niet overgeslagen.

### 15.1 Vraagopbouw
1. Geef waar nodig een korte, leerlinggerichte uitleg van het betreffende tekstverband (bijvoorbeeld tegenstelling, opsomming, voorbeeld, vergelijking, uitleg/reden, samenvatting of conclusie).
2. Kies een daadwerkelijke zin uit de leestekst waarin een relevant signaalwoord voorkomt.
3. Laat het signaalwoord duidelijk aanwijzen of benoemen.
4. Vraag wat het signaalwoord **in deze zin en context** betekent of welk verband het aangeeft.
5. Maak het verwachte antwoord, de inhoudelijke onderbouwing en eventuele afleiders vooraf expliciet.

### 15.2 Kwaliteitsvoorwaarden
- Toets betekenis en functie in context; niet uitsluitend het herkennen of reproduceren van een los woord.
- Gebruik een signaalwoord dat daadwerkelijk in de leestekst voorkomt. Verzin geen voorbeeldzin die niet tot de tekst behoort.
- De korte uitleg ondersteunt de leerling, maar verklapt niet het antwoord op de vraag.
- Meerkeuze-afleiders zijn inhoudelijk plausibel en vertegenwoordigen waar passend andere tekstverbanden.
- Houd rekening met contextafhankelijkheid: leid het tekstverband af uit de volledige zin en de relatie met de omliggende informatie; ken een woord niet automatisch één vaste functie toe.
- Varieer de behandelde tekstverbanden over de totale verzameling oefeningen. Niet iedere afzonderlijke oefening hoeft alle categorieën te behandelen.
- Controleer dat de vraag geen dubbelzinnige interpretatie heeft en dat het antwoord door de tekstcontext wordt ondersteund.

Deze eis introduceert geen aparte bouwmodule, pagina, Learning Interface, curriculumdoel, skill, claim, evidence target, runtime of masteryregel. De bestaande centrale paginatemplate, begrijpend-lezenruntime, curriculumcontracten en kwaliteitschecklist blijven leidend.
