# PacoGO KD6 — SLO-broninventarisatie en kandidaat-crosswalk v0.1

Datum: 24 november 2026
Status: brongebaseerde eerste uitwerking; alle groepsregistraties blijven `unassessed`.

## 1. Actuele kerndoelscope (leidend)

SLO, *Kerndoelen primair onderwijs* (herziene versie 2025), p. 26, beschrijft KD6 als **De leerling toont inzicht in taal als systeem**.

**6A — De leerling beschouwt de relatie tussen vorm en betekenis van taal.** De officiële onderdelen betreffen: letterklanken/klemtoon/intonatie/ritme en betekenis; woordopbouw en betekenisafleiding; woordvolgorde en zinsdelen; woordgebruik, stijlmiddelen en tekstopbouw; functioneel gebruik van taalkundige begrippen en taalbeschouwingsstrategieën bij spelling en grammatica.

**6B — De leerling toont inzicht in regels en procedures voor spelling, formulering en interpunctie.** De officiële onderdelen betreffen: correct formuleren op woord-, zins- en tekstniveau; vorm en betekenis verbinden voor spelling; spellingbewustzijn en spellinggeweten ontwikkelen; reflecteren op woord- en zinskeuzes; hulpmiddelen en bronnen gebruiken en teksten redigeren.

De officiële SLO-kerndoelbeschrijving bevat geen groepsindeling voor deze onderdelen. De groepsclusters hieronder zijn dus geen officiële tussendoelen uit 2025.

## 2. Gevonden PacoGO-documentatie en architectuur

- In de repository is geen eerdere inhoudelijke KD6-leerlijn, KD6-groepsregistratie of KD6-specifiek curriculumdocument aangetroffen.
- De centrale registry bevatte alleen het overzichtsrecord voor KD6 met selectie van 6A en 6B; geen inhoudelijke doelregistraties.
- De bestaande `renderDomainVerticalLearningLine()` is de centrale detailtemplate. KD6 gebruikt dezelfde renderer en compacte kaartstijl als de bestaande verticale leerlijnen; er wordt geen tweede template of renderer toegevoegd.
- De registraties zijn alleen brongebaseerde curriculumdoelen. Er worden geen skills, developments, claims, evidence targets, task models, oefeningen, mastery-regels of Supabase-objecten aangemaakt.

## 3. Bronnen en bronstatus

1. **Actueel en leidend:** SLO, *Kerndoelen primair onderwijs* (2025), p. 26, KD6A en KD6B. Dit bepaalt de inhoudelijke scope.
2. **Ondersteunende fasering:** SLO, *Leerlijn begrippen voor taalbeschouwing* (januari 2024), fasen 1–4 (groep 1–2 t/m 7–8). De tabellen ordenen onder meer woordgroepen/zinnen, woordvorming, woordsoorten, klanken, schriftconventies, betekenis en taalleerproces.
3. **Historische concretisering:** SLO TULE, oud kerndoel 11 — *Taalbeschouwing, waaronder strategieën* (2008), groepen 1–2, 3–4, 5–6 en 7–8. Dit bevat onder meer fonologisch/fonemisch en syntactisch bewustzijn, spellingpatronen, werkwoordspelling, interpunctie, foutcorrectie en hulpmiddelen.
4. **Historische schrijf-/formuleringsopbouw:** SLO, *Inhoudslijn PO Nederlands — Schrijven* (2020), plus TULE oud kerndoel 8. Deze bronnen ondersteunen een kandidaat-opbouw voor formuleren, zinsbouw en revisie; ze zijn niet één-op-één gelijk aan KD6B.

## 4. Afbakening en interpretatie

- **KD6A** gaat niet alleen over traditioneel grammaticaal ontleden. De officiële scope omvat de relatie tussen taalvorm en betekenis op klank-, woord-, zins- en tekstniveau, inclusief stijlmiddelen en functionele taalbeschouwing.
- **KD6B** gaat niet alleen over spellingregels. Het omvat ook correct formuleren op woord-, zins- en tekstniveau, interpunctie, reflectie op keuzes, spellingbewustzijn/-geweten en het doelgericht inzetten van hulpmiddelen en bronnen.
- **Groep 1–2 bij 6B** wordt uitsluitend als voorbereidende schrift- en taalbewustzijnsontwikkeling beschreven. De bronnen ondersteunen geen formeel spelling- of formuleringseindniveau voor deze fase.
- Formuleren en tekstredactie raken ook KD3 (teksten produceren). Binnen deze KD6-uitwerking worden alleen de taalvorm-/correctheidsaspecten en reflectie op woord- en zinskeuzes als kandidaat-relatie opgenomen. De communicatieve schrijfopdracht en tekstproductie als zodanig blijven buiten KD6.
- Taalvariatie/identiteit als primair leerdoel hoort bij KD7. Woordkeuze, register of stijl wordt hier alleen opgenomen voor zover het gaat om het effect van taalvorm en betekenis volgens KD6A.
- De SLO-fasen 1–4 en TULE-groepclusters worden als kandidaat-crosswalk gebruikt, niet als wettelijke of officiële SLO-2025-groepsdoelen.

## 5. Kandidaat-crosswalk per groepcluster

### Groep 1–2 — 6A — Vorm en betekenis beschouwen

- Klank-, rijm- en woordbewustzijn ontwikkelen: zinnen in woorden en woorden in klankgroepen verdelen, rijm herkennen en produceren en klanken in woorden bewust waarnemen.
- De opbouw van woorden en eenvoudige zinnen verkennen; ervaren dat woorddelen, woordkeuze en woordvolgorde betekenis dragen en basale grammaticale patronen herkennen.

### Groep 3–4 — 6A — Vorm en betekenis beschouwen

- Klankstructuur en schriftklankrelaties onderzoeken, waaronder korte en lange klanken, klankgroepen, klinkers en medeklinkers, uitspraak en rijm.
- Woordopbouw en eenvoudige woordsoorten verkennen, waaronder lettergreep, verkleinwoord, enkelvoud en meervoud, zelfstandig naamwoord, werkwoord en lidwoord.
- Zinsdelen en eenvoudige zinsbouw verkennen; de betekenis van zinnen verbinden aan woordvolgorde en zinstype.

### Groep 5–6 — 6A — Vorm en betekenis beschouwen

- Woordvorming en werkwoordsvormen onderzoeken met begrippen als infinitief, stam, woordvorm, grondwoord, woorddeel, samenstelling, voor- en achtervoegsel, tijd en gebiedende wijs.
- Zinsbouw beschouwen met begrippen als onderwerp en persoonsvorm; vertel-, vraag-, bevel- en uitroepzinnen herkennen en onderzoeken hoe zinsdelen betekenis dragen.
- Klemtoon, open en gesloten lettergrepen, stemhebbende en stemloze klanken, begin- en eindrijm en taalkeuzes in context verkennen; betekenisverschillen bespreken.

### Groep 7–8 — 6A — Vorm en betekenis beschouwen

- Complexere woordvorming verkennen, waaronder vervoeging, afleiding, werkwoordsuitgangen, deelwoorden, persoon en leenwoorden.
- Complexere zinsstructuren en woordvolgorde onderzoeken, waaronder hoofd- en bijzinnen, lijdend en meewerkend voorwerp, werkwoordelijk gezegde en bedrijvende en lijdende vorm.
- Intonatie, zinsmelodie en accent verbinden aan betekenis; effecten van woordgebruik, register, stijlmiddelen en tekstopbouw verkennen en taalkundige begrippen functioneel inzetten bij taalbeschouwing.

### Groep 1–2 — 6B — Spelling, formulering en interpunctie

- Voorbereidende schrift- en taalbewustzijnsontwikkeling: letters en tekens herkennen, betekenis geven aan eigen schrijftekens en woorden en eenvoudige zinnen mondeling of met ondersteuning formuleren. Dit is een voorwaardelijke ontwikkeling, geen spellingbeheersingsdoel voor groep 1–2.
- Ervaren dat gesproken woorden in geschreven tekens kunnen worden weergegeven; beginnende schrijfwijzen en eenvoudige formuleringen bespreken zonder formele spellingcorrectheid te veronderstellen.

### Groep 3–4 — 6B — Spelling, formulering en interpunctie

- Klankzuivere woorden spellen door klanken te analyseren en aan letters te koppelen; veelvoorkomende spellingpatronen, medeklinkerclusters, homofonen en open en gesloten lettergrepen toepassen.
- Basisconventies van schrift en interpunctie toepassen, waaronder hoofdletters, spaties, punt, komma, vraagteken en uitroepteken; eenvoudige spelling- en interpunctiefouten herkennen en verbeteren.
- Korte, begrijpelijke zinnen formuleren en aandacht ontwikkelen voor zinsbouw, woordkeuze en zinsgrenzen; de historische schrijfopbouw laat in deze fase nog eenvoudige zinnen en fouten toe.

### Groep 5–6 — 6B — Spelling, formulering en interpunctie

- Spellingstrategieën bewust toepassen, waaronder fonologische, visuele, analogie-, regel- en hulpstrategie; gelijkvormigheids- en analogieregels, samenstellingen en lange woorden gebruiken.
- Werkwoordspelling toepassen en complexere leestekens gebruiken; grammaticale zinsstructuur betrekken bij interpunctie en spellingkeuzes.
- Eigen spelling- en interpunctiefouten zelfstandig opsporen en verbeteren; spellingkaarten, controleschema's en andere passende hulpmiddelen gebruiken.

### Groep 7–8 — 6B — Spelling, formulering en interpunctie

- Meer complexe spelling toepassen, waaronder leenwoorden, apostrof, trema en koppelteken; spellingkeuzes controleren met woordenboek, spellingchecker of controleschema.
- Formuleringen op woord-, zins- en tekstniveau kritisch herzien; keuzes in woorden en zinnen beoordelen op correctheid en begrijpelijkheid en teksten redigeren. De communicatieve schrijfopdracht zelf blijft bij KD3.

## 6. Registratiestatus

- 21 brongebaseerde kandidaatregistraties: 11 voor 6A en 10 voor 6B.
- Alle registraties hebben `coverage_status: unassessed`, lege skill- en oefenkoppelingen en de status `active`.
- Geen van deze registraties bewijst dat PacoGO de betreffende doelen al dekt of dat een leerling ze beheerst.
- Er is geen officiële 2025-groepsindeling geclaimd.

## 7. Openstaande bron- en afbakeningspunten

1. De historische SLO-bronnen geven een bruikbare kandidaat-opbouw, maar vormen geen empirisch gevalideerde ontwikkelingsvolgorde.
2. De precieze grens tussen KD6B-formuleren/redigeren en KD3-tekstproductie moet bij latere skill- en taskmodellering op claimniveau worden bewaakt.
3. De precieze selectie van grammaticale termen moet bij latere uitwerking worden afgestemd op de volledige SLO-fasen en mag niet worden opgevat als een verplicht traditioneel ontleedprogramma.
4. De actuele kerndoelbeschrijving is leidend; bij publicatie van een nieuwe actuele SLO-leerlijn Nederlands moet deze kandidaat-crosswalk worden herzien.

## 8. Bronnen

- SLO, *Kerndoelen primair onderwijs* (herziene versie 2025), p. 26: https://www.slo.nl/publish/pages/23186/kerndoelen-primair-onderwijs-slo-2025.pdf
- SLO, *Leerlijn begrippen voor taalbeschouwing* (januari 2024): https://www.slo.nl/publish/pages/16957/leerlijn-begrippen-voor-taalbeschouwing.pdf
- SLO, TULE Nederlands, kerndoel 11: https://www.slo.nl/thema/meer/tule/nederlands/kerndoel-11/
- SLO, *Inhoudslijn PO Nederlands — Schrijven* (2020): https://www.slo.nl/publish/pages/15249/inhoudslijnen_po_nederlands_schrijven.pdf
- SLO, TULE Nederlands, kerndoel 8: https://www.slo.nl/thema/meer/tule/nederlands/kerndoel-8/
