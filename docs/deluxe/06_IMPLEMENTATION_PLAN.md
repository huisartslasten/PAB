# PacoGO Deluxe — Implementatieplan v0.1

**Status:** fasering vastgelegd; geen toestemming voor brede implementatie.

## 1. Afgesproken volgorde

### Fase 0 — Repo- en documentatiebasis
- Start iedere chat met de verplichte repo-check.
- Lees de Current Handoff en relevante Deluxe-documentatie.
- Controleer branch, HEAD, werkboom en actuele CI.
- Houd LIVE `main` onaangeraakt.

### Fase 1 — Architectuurstructuur
- De conceptuele architectuurboom is opgesteld en door de gebruiker akkoord bevonden.
- De boom staat in `01_ARCHITECTURE.md`.
- De technische modulegrenzen en fysieke repo-indeling zijn nog niet definitief.

### Fase 2 — Verantwoordelijkheden
- Werk elk onderdeel uit met doel, wel/niet-verantwoordelijkheden, inputs, outputs, afhankelijkheden en tests.
- Identificeer bestaande canonieke owners.
- Voorkom dubbele verantwoordelijkheden.
- Leg onduidelijkheden voor aan de gebruiker.
- Markeer besluiten pas als vastgesteld na akkoord.

### Fase 3 — Character System en Paco
- Ontwerp eerst het generieke Character System.
- Werk Paco als eerste character uit: volledig uiterlijk, lichaamsbouw, aanzichten, lopen, rennen, zwaaien, idle, springen, zitten, opstaan, expressies en reacties.
- Onderzoek daarna geschikte character- en animatietechniek.
- Milo blijft een toekomstige character-toevoeging; ontwerp hem niet vooruit.

### Fase 4 — Design System
- Werk de gedeelde visuele identiteit en bouwstenen uit.
- Onderzoek bestaande design-system-owners.
- Bepaal de migratie van bestaande PacoGO-schermen pas na akkoord.

### Fase 5 — Technische fundering
- Definieer alleen de minimale contracten en modules die nodig zijn.
- Maak een kleine implementatieplanning met expliciete afhankelijkheden en acceptatiecriteria.
- Geen speculatieve directories, engines, tabellen of adapters.

### Fase 6 — Eerste gecontroleerde verticale slice
- Pas na de voorgaande ontwerp- en architectuurgates.
- Gebruik echte Paco-assets zodra het Character System en ontwerp zijn goedgekeurd.
- Koppel via bestaande canonieke leer- en contentowners.
- Test de volledige flow en bestaande PacoGO-regressies.

### Fase 7 — Geleidelijke uitbreiding
- Meer scènes, interacties, verhalen, quests, personages en presentaties alleen wanneer de basis stabiel is en er een concrete behoefte is.

## 2. Verplichte kwaliteitsgates

- Voor iedere bouwstap: eerst repo-check en relevante baseline.
- Bij rood: STOP, isoleren, oorzaak vaststellen, pas daarna bespreken en gericht oplossen.
- Na wijziging: relevante tests opnieuw uitvoeren.
- Geen volgende bouwstap zolang vereiste controles rood zijn.
- Nooit een test aanpassen om een fout alleen maar groen te krijgen.
- Nooit claimen dat tests of regressies groen zijn zonder werkelijk resultaat.

## 3. Geen impliciete implementatietoestemming

Het bestaan van een fase, onderdeel, editor of Engine in dit plan is geen toestemming om die nu te bouwen. De gebruiker geeft per concrete bouwstap akkoord nadat doel, scope, afhankelijkheden en testcriteria duidelijk zijn.
