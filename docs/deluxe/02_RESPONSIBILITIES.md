# PacoGO Deluxe — Verantwoordelijkheden v0.1

**Status:** eerste afbakening; volledige verantwoordelijkheden moeten nog met de gebruiker worden uitgewerkt.  
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

## 3. Beoogde Deluxe-onderdelen — verantwoordelijkheden nog uit te werken

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

## 4. Vaste scheidingsgrenzen uit de bestaande Blueprint

- Learning progress (curriculum evidence, inference, mastery en next action) blijft bij de bestaande curriculum-engine.
- Experience progress (bijvoorbeeld bezochte scènes, storypositie en queststatus) is een ander domein en mag niet als academische beheersing worden geïnterpreteerd.
- Een Scene is een plaats/context; een Story is narratieve structuur; een Quest is een missie/objectievenstructuur.
- De Game Engine maakt geen tweede gamecatalogus.
- De Experience Engine verandert de presentatie, niet de leerinhoud, antwoordcorrectheid of masteryregels.
- Een adapter wordt alleen overwogen bij een bewezen contractmismatch, niet uit voorzorg.

## 5. Open uitwerking

De volgende chat werkt de tabel stap voor stap met de gebruiker uit. Begin met de bovenste architectuuronderdelen en leg per onderdeel de verantwoordelijkheid, grenzen, inputs, outputs en relaties vast. Markeer voorstellen als voorstel. Maak niets bindend zonder akkoord.
