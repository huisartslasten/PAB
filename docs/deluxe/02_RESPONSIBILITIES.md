# PacoGO Deluxe — Verantwoordelijkheden v0.1

**Status:** PACOGO CORE-verantwoordelijkheid door gebruiker akkoord; overige onderdelen nog uit te werken.  
**Belangrijk:** dit document vult geen onbesliste grenzen zelf in.

## 1. Werkwijze

Voor ieder onderdeel leggen we uiteindelijk vast:
1. Doel en verantwoordelijkheid.
2. Wat het onderdeel wel doet.
3. Wat het nadrukkelijk niet doet.
4. Welke gegevens of contracten het gebruikt.
5. Welke onderdelen het aanroept of waarvan het afhankelijk is.
6. Welke resultaten/events het levert.
7. Hoe het afzonderlijk getest kan worden.
8. Welke bestaande PacoGO-owner behouden blijft.

## 2. Bestaande canonieke eigenaars — behouden

De technische Blueprint v0.1 heeft de volgende bestaande owners in de repository geïdentificeerd. Deze mogen niet zonder bewijs en expliciet besluit worden vervangen of gedupliceerd.

| Domein | Bestaande eigenaar | Afspraak |
|---|---|---|
| Applicatiestart, routing en gedeelde runtime | `src/core/` | Bestaande Core hergebruiken |
| Leerlingidentiteit/rooster | `src/core/student-registry.js` en bestaande learner-link service | Geen tweede identiteitssysteem |
| Supabase-clientselectie | `src/services/supabase-client.js` | Bestaande clientselectie behouden |
| Lessen en lesworkflows | `src/features/lessons/` | Bestaande lesowner behouden |
| Learning-material-elementen | `src/features/learning-material/element-registry.js` | Geen parallelle registry |
| Gamecatalogus | `src/services/game-catalog.js` | Canonieke gamecatalogus behouden |
| Practice-facade en vraagcyclus | `src/features/practice/` | Bestaande owners hergebruiken |
| Challenges | `src/features/challenges/challenge-registry.js` | Challenge-domein behouden |
| Curriculumuitvoering, evidence, inference en mastery | `pacogo-engine/` en bestaande services | Niet dupliceren in Deluxe |
| Generieke UI-primitieven | `src/components/design-system.js` | Bestaande UI-primitieven inspecteren en hergebruiken |
| Generieke pagina-shell | `src/components/page-template.js` | Niet verwarren met world-scènes |

Bron: [Technical Blueprint v0.1](PacoGO_Deluxe_Blueprint_v0.1.md), repository-audit en canonical owners.

## 3. PACOGO CORE — verantwoordelijkheid vastgesteld

<badge>Door gebruiker akkoord</badge>

### 3.1 Doel

PACO­GO CORE vormt de overkoepelende platformbasis waarop de bestaande PacoGO-functionaliteit en de latere Deluxe-systemen kunnen functioneren. Core is geen nieuwe monolithische module die bestaande domeinen overneemt.

De bestaande onderdelen behouden hun eigen eigenaarschap. Deluxe sluit aan op die bestaande basis.

### 3.2 Wat Core doet

- De applicatie starten en beheren.
- Gebruikersidentiteit en authenticatie beschikbaar maken via de bestaande voorzieningen.
- Leerlingen en hun bestaande registraties beschikbaar maken.
- Gedeelde applicatiestatus beheren.
- Toegang tot bestaande diensten verzorgen.
- De aansluiting tussen bestaande PacoGO-functionaliteiten en nieuwe Deluxe-onderdelen mogelijk maken.

### 3.3 Wat Core nadrukkelijk niet doet

- Zelf curriculumregels bepalen.
- Zelf mastery of leerprogress berekenen.
- Een tweede leerlingregistratie introduceren.
- Een tweede databaseclient maken.
- Lesinhoud dupliceren.
- Story-, Quest- of Game-logica overnemen.

### 3.4 Bestaande owners

| Verantwoordelijkheid | Bestaande owner |
|---|---|
| Applicatiestart, routing en gedeelde runtime | `src/core/` |
| Leerlingregistratie | `src/core/student-registry.js` en bestaande learner-link service |
| Databaseverbinding en projectselectie | `src/services/supabase-client.js` |
| Lessen en lesworkflows | `src/features/lessons/` |
| Curriculum en leerresultaten | `pacogo-engine/` en bestaande services |
| Algemene paginaopbouw | `src/components/page-template.js` |
| Gedeelde UI-elementen | `src/components/design-system.js` |

Deze lijst benoemt bestaande owners; ze creëert geen nieuwe fysieke Core-module of nieuw technisch contract.

### 3.5 Inputs en outputs — functionele afbakening

| Inputs | Outputs |
|---|---|
| Gebruikerssessie | Beschikbare gebruikersidentiteit |
| Bestaande leerlingregistratie | Beschikbare leerlinggegevens |
| Applicatieconfiguratie | Gedeelde applicatiestatus |
| Navigatieverzoeken | Beschikbare applicatieroutes |
| Verzoeken aan bestaande diensten | Toegang tot de bestaande services |

Dit is de goedgekeurde functionele afbakening, geen reeds vastgesteld technisch API-contract.

### 3.6 Afhankelijkheden

Core werkt met de bestaande voorzieningen voor:
- Authentication / Identity;
- Student Registry;
- Existing Services;
- Feature Modules;
- Curriculum Engine;
- Shared UI.

De precieze technische interfaces tussen deze onderdelen en toekomstige Deluxe-modules blijven onderwerp van latere uitwerking.

### 3.7 Testbare contracten

De verantwoordelijkheid moet uiteindelijk aantoonbaar maken dat:
1. Een bestaande gebruiker correct wordt herkend.
2. De bestaande leerlingregistratie behouden blijft.
3. Deluxe dezelfde leerlingidentiteit gebruikt.
4. De bestaande Supabase-client wordt hergebruikt.
5. De bestaande lessen en curriculumfunctionaliteit blijven werken.
6. Deluxe geen tweede bron van waarheid introduceert.

Dit zijn acceptatierichtingen voor de latere technische uitwerking; er is in deze documentatiestap geen nieuwe test of implementatie toegevoegd.

## 4. Beoogde overige Deluxe-onderdelen — verantwoordelijkheden nog uit te werken

Onderstaande omschrijvingen zijn voorlopige domeinrichtingen op basis van de goedgekeurde architectuurboom en de technische Blueprint. Ze zijn geen definitieve implementatiecontracten.

| Onderdeel | Voorlopige focus | Nog vast te stellen |
|---|---|---|
| Learning Engine | Leeractiviteiten starten en verbinden met bestaande leerowners | Exacte facade/contracten en grenzen |
| Interaction Engine | Herbruikbare interactiemechanieken | Lifecycle, triggers, events en ownership |
| Story Engine | Verhaalstructuur en verhaalvoortgang | Story-objecten, state en relatie met World/Quest |
| Quest Engine | Missies en doelvoortgang | Objectives, prerequisites en completion contract |
| Game Engine | Games starten en resultaten teruggeven | Relatie met bestaande gamecatalogus en runtimes |
| Progress Engine | Voortgang binnen de ervaring | Strikte scheiding van academische leerprogress |
| Event Engine | Getypeerde communicatiefeiten tussen domeinen | Event-schema, dispatch en eventuele persistence |
| Experience Engine | Presentatieprofielen en voorkeuren | Profielmodel, selectie en opslag |
| Content System | Herbruikbare leer- en ervaringsinhoud | Relatie Content, Activity, Task en bestaande lesson-modellen |
| World System | Worlds, locations, scenes, objects en environment | Model, runtime en scene state |
| Character System | Herbruikbare basis voor Paco en latere personages | Character profile, model, rigging, animation en audio |
| Authoring System | Editors voor het samenstellen van content en scènes | Welke editors eerst nodig zijn en wie ze gebruikt |
| PacoGO Design System | Gedeelde visuele taal en UI-bouwstenen | Relatie met bestaande design-system-primitieven |
| Data & Infrastructure | Opslag en technische aansluiting | Alleen concrete behoeften; geen speculatieve tabellen |

## 5. Vaste scheidingsgrenzen uit de bestaande Blueprint

- Learning progress (curriculum evidence, inference, mastery en next action) blijft bij de bestaande curriculum-engine.
- Experience progress (bijvoorbeeld bezochte scènes, storypositie en queststatus) is een ander domein en mag niet als academische beheersing worden geïnterpreteerd.
- Een Scene is een plaats/context; een Story is narratieve structuur; een Quest is een missie/objectievenstructuur.
- De Game Engine maakt geen tweede gamecatalogus.
- De Experience Engine verandert de presentatie, niet de leerinhoud, antwoordcorrectheid of masteryregels.
- Een adapter wordt alleen overwogen bij een bewezen contractmismatch, niet uit voorzorg.

## 6. Volgende uitwerking

PACOGO CORE is als eerste verantwoordelijkheid door de gebruiker akkoord bevonden.

Ga vervolgens door met de onderdelen van de goedgekeurde architectuurboom, te beginnen met de Engine Layer en daarbinnen de Learning Engine. Werk steeds één onderdeel uit met doel, wel/niet-verantwoordelijkheden, bestaande canonieke owner, inputs, outputs, afhankelijkheden en testbare contracten. Markeer voorstellen als voorstel. Maak niets bindend zonder akkoord van de gebruiker.
