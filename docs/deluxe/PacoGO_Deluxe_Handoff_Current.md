# PacoGO Deluxe — Current Handoff

**Datum:** 23 november 2026  
**Repository:** `huisartslasten/PAB`  
**DEV-branch:** `refactor/professional-v1`  
**LIVE:** `main` — niet aanraken.

## 1. Lees dit eerst

Deze handoff is het startpunt voor iedere volgende PacoGO Deluxe-chat. Begin niet opnieuw met brainstormen en verander geen eerder goedgekeurde besluiten op eigen initiatief.

Lees in deze volgorde:
1. Dit Current Handoff.
2. `docs/deluxe/00_MASTERPLAN.md`.
3. `docs/deluxe/01_ARCHITECTURE.md`.
4. `docs/deluxe/02_RESPONSIBILITIES.md`.
5. Relevante overige documenten uit `docs/deluxe/`.
6. `docs/deluxe/PacoGO_Deluxe_Blueprint_v0.1.md` voor de bestaande technische repo-audit en architectuurbaseline.

## 2. Verplichte repo-check vóór inhoudelijk of technisch werk

Controleer bij aanvang van iedere nieuwe chat opnieuw:
- dat repository `huisartslasten/PAB` wordt gebruikt;
- dat branch `refactor/professional-v1` bestaat en de actieve DEV-basis is;
- de actuele HEAD/commit SHA;
- de werkboom/Git-status en eventuele bestaande wijzigingen;
- relevante documentatie en bestanden;
- de actuele relevante CI-/regressiestatus.

De SHA uit een vorige handoff is uitsluitend een historische referentie. Controleer altijd de actuele HEAD. Als de repo niet kan worden gecontroleerd, doe geen wijzigingen en meld de beperking.

## 3. Harde projectregels

1. **LIVE nooit aanraken.** `main` is productie. Geen wijzigingen, experimenten, merges, resets of force-pushes als onderdeel van Deluxe-werk.
2. **Alle ontwikkeling op DEV.** Gebruik `refactor/professional-v1`.
3. **Groen is verplicht.** Relevante tests en regressies moeten werkelijk groen zijn voordat we verdergaan.
4. **Rood = STOP.** Eerst probleem isoleren, bewijs verzamelen en oorzaak vaststellen. Niet patchen op basis van symptomen. Daarna pas een gerichte oplossing bespreken en toepassen; vervolgens opnieuw testen.
5. **Geen verzonnen besluiten.** Geen architectuur, requirements, code, technologie of bestanden verzinnen. Onduidelijkheden en keuzes eerst aan de gebruiker voorleggen. Voorstellen zijn pas besluiten na akkoord.
6. **Geen grote sprongen.** Kleine, controleerbare stappen. Na iedere stap rapporteren wat is onderzocht, gewijzigd en getest.
7. **Geen onnodige databasewijzigingen.** Geen nieuw Supabase-project, geen schemawijziging of datamigratie zonder afzonderlijk ontwerp en expliciet akkoord.

## 4. Wat is vastgesteld?

- PacoGO Deluxe wordt een modulaire uitbreiding van PacoGO, geen vervanging.
- Leren blijft de hoofdzaak.
- Content, presentatie en engine-logica moeten gescheiden blijven.
- De conceptuele architectuurboom is door de gebruiker akkoord bevonden en staat in `01_ARCHITECTURE.md`.
- Bestaande PacoGO-owners blijven leidend waar ze de verantwoordelijkheid al bezitten.
- Het Character System wordt generiek opgezet zodat meerdere personages mogelijk zijn.
- Paco is het eerste personage.
- Milo is een mogelijke toekomstige hond/vriend; hij is nog niet ontworpen.
- De gebruiker wil eerst de structuur, daarna verantwoordelijkheden en daarna Paco ontwerpen.
- De verantwoordelijkheid van PACOGO CORE is op 23 november 2026 expliciet door de gebruiker goedgekeurd en vastgelegd in `02_RESPONSIBILITIES.md`.
- De bestaande technische Blueprint v0.1 blijft behouden als gedetailleerde audit/baseline.

## 5. Wat is nog niet besloten of gebouwd?

- Definitieve modulegrenzen en verantwoordelijkheden.
- Definitieve fysieke repo-indeling van toekomstige Deluxe-code.
- Definitieve technologie voor 2D-rendering, interactie, rigging en animatie.
- Definitieve visuele stijl en technische opbouw van Paco.
- Character Editor, Scene Editor en andere authoringtools.
- Concrete persistente Deluxe-data of Supabase-schema.
- Implementatie van de nieuwe Deluxe-engines.

De genoemde technologieën Phaser, PixiJS, Construct 3, H5P, Genially, Ink en Twine zijn referenties/kandidaten uit eerdere research. Geen ervan is definitief gekozen.

## 6. Waar staan we?

- De repository-audit en technische Blueprint v0.1 bestonden al op de DEV-branch.
- De bestaande Deluxe-documentatie bevat de index, Masterplan, architectuurboom, verantwoordelijkhedenregister, Character System-richting, Design System-scope, technologiebesluitenregister, implementatieplan, changelog en deze handoff.
- Op 23 november 2026 is PACOGO CORE als eerste verantwoordelijkheid met de gebruiker uitgewerkt en akkoord bevonden. De volledige afbakening staat in `02_RESPONSIBILITIES.md`; de beslissing staat in `07_CHANGELOG.md`.
- Alleen documentatiebestanden zijn gewijzigd. Er is geen applicatiecode, database, Supabase-schema of LIVE-resource gewijzigd.
- Voor deze documentatiestap zijn geen tests of regressies uitgevoerd. Er wordt geen groene teststatus geclaimd.
- De actuele branch-HEAD moet vóór verder technisch werk opnieuw worden gecontroleerd; gebruik geen SHA uit een eerdere handoff als actuele status.

## 7. Directe volgende stap

**Ga verder met de Engine Layer, te beginnen met de Learning Engine.**

PACOGO CORE is afgerond als eerste goedgekeurde verantwoordelijkheid. Begin niet met programmeren en begin niet met Paco tekenen. Werk de onderdelen uit de architectuurboom systematisch uit:
- doel;
- wat het onderdeel wel doet;
- wat het niet doet;
- bestaande canonieke owner;
- inputs en outputs;
- afhankelijkheden;
- testbare contracten;
- open vragen.

Bespreek onduidelijkheden met de gebruiker. Leg besluiten pas vast na akkoord.

Daarna volgt het generieke Character System en het ontwerp van Paco als eerste character. Milo blijft voor later.

## 8. Communicatiestijl

De gebruiker wil concrete, kleine stappen en geen eindeloze analyse. Leg kort uit wat je gaat doen, voer alleen de afgesproken stap uit, rapporteer precies wat is gebeurd en houd deze handoff actueel.

**Hoofdregel: eerst begrijpen, dan bouwen. Nooit verder op een rode basis.**
