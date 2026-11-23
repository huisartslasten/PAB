# PacoGO Deluxe — Architectuur v0.1

**Status:** conceptuele architectuurboom akkoord door gebruiker; technische grenzen nog uit te werken.  
**Datum:** 23 november 2026.

## 1. Architectuurboom

De onderstaande boom legt de door de gebruiker goedgekeurde conceptuele hoofdstructuur vast. De boom is een ordening van domeinen en systemen, geen opdracht om alle onderdelen direct als mappen, services of databases te implementeren.

```text
PACOGO DELUXE
│
├── 1. PACOGO CORE
│   ├── Students
│   ├── Accounts
│   ├── Subjects
│   ├── Lessons
│   ├── Questions & Answers
│   ├── Tests
│   ├── Results
│   └── Learner Data
│
├── 2. ENGINE LAYER
│   ├── Learning Engine
│   ├── Interaction Engine
│   ├── Story Engine
│   ├── Quest Engine
│   ├── Game Engine
│   ├── Progress Engine
│   ├── Event Engine
│   └── Experience Engine
│
├── 3. CONTENT SYSTEM
│   ├── Lessons
│   ├── Questions
│   ├── Activities
│   ├── Flashcards
│   ├── Tests
│   ├── Games
│   ├── Stories
│   ├── Quests
│   └── Dialogues
│
├── 4. WORLD SYSTEM
│   ├── Worlds
│   ├── Locations
│   ├── Scenes
│   ├── Objects
│   ├── Interactions
│   └── Environment
│
├── 5. CHARACTER SYSTEM
│   ├── Character Profiles
│   │   ├── Identity
│   │   ├── Appearance
│   │   ├── Personality
│   │   └── Attributes
│   ├── Character Models
│   │   ├── Body
│   │   ├── Head
│   │   ├── Face
│   │   ├── Eyes
│   │   ├── Ears
│   │   ├── Legs & Paws
│   │   └── Tail
│   ├── Character Rigging
│   │   ├── Skeleton
│   │   ├── Bones
│   │   └── Controls
│   ├── Animation Library
│   │   ├── Idle
│   │   ├── Walk
│   │   ├── Run
│   │   ├── Jump
│   │   ├── Wave
│   │   ├── Sit
│   │   ├── Stand Up
│   │   └── Reactions
│   ├── Facial Expressions
│   │   ├── Happy
│   │   ├── Sad
│   │   ├── Angry
│   │   ├── Surprised
│   │   └── Thinking
│   ├── Character Behaviour
│   └── Character Audio / Voice
│
├── 6. EXPERIENCE SYSTEM
│   ├── Experience Profiles
│   ├── Visual Themes
│   ├── Interface Complexity
│   ├── Animation Levels
│   ├── Story Presentation
│   └── Personal Preferences
│
├── 7. PACOGO DESIGN SYSTEM
│   ├── Typography
│   ├── Colors
│   ├── UI Components
│   ├── Buttons
│   ├── Cards & Panels
│   ├── Icons
│   ├── Illustrations
│   ├── Animations
│   └── Interaction Patterns
│
├── 8. AUTHORING SYSTEM
│   ├── Scene Editor
│   ├── Object Editor
│   ├── Character Editor
│   ├── Animation Editor
│   ├── Interaction Editor
│   ├── Story Editor
│   └── Assignment Editor
│
└── 9. DATA & INFRASTRUCTURE
    ├── Supabase
    ├── Database
    ├── Storage
    ├── APIs
    ├── Adapters
    └── Shared Data
```

## 2. Belangrijke interpretatieregels

- De boom beschrijft de gewenste functionele ordening. Hij bepaalt nog niet automatisch de uiteindelijke fysieke mappenstructuur.
- De bestaande PacoGO Core, curriculum-engine, lesson-, practice-, game- en challenge-owners blijven leidend waar ze deze verantwoordelijkheden al bezitten.
- De Deluxe-architectuur mag geen tweede leerlingidentiteit, curriculum-engine, gamecatalogus of databaseclient creëren.
- Character System is een generiek systeem voor meerdere personages. Paco is het eerste personage; Milo kan later als afzonderlijk personageprofiel worden toegevoegd.
- Experience System gaat over presentatievoorkeuren en ervaring, niet over curriculumbeheersing of automatische leeftijdsindeling.
- Authoring System is de gewenste familie van editors. Het bestaan van een editor in de boom is geen besluit om die editor nu te bouwen.
- Data & Infrastructure betekent aansluiting op de bestaande infrastructuur. Het is geen toestemming voor een nieuw Supabase-project of een vroege databaseschemawijziging.

## 3. Relatie met de technische Blueprint

De bestaande [Technical Blueprint v0.1](PacoGO_Deluxe_Blueprint_v0.1.md) bevat de eerste repository-audit, bestaande canonieke eigenaars, conceptuele contracten, integratieprincipes en open technische vragen.

Gebruik die Blueprint samen met deze boom. Bij verschil tussen een algemene boomterm en een bestaande technische eigenaar geldt: eerst de bestaande eigenaar en het conflict onderzoeken; niet stilzwijgend een tweede eigenaar creëren.

## 4. Wat nog niet is vastgesteld

- Definitieve modulegrenzen en afhankelijkheden.
- Welke onderdelen zelfstandige engines, services, libraries of featuremodules worden.
- De concrete contracten tussen alle onderdelen.
- De uiteindelijke repositorymapstructuur.
- De definitieve technologie voor rendering, interactie, character rigging en authoring.
- Welke data persistent moet worden opgeslagen en waar.

Deze punten worden uitgewerkt in het verantwoordelijkhedendocument en de Blueprint. Besluiten vereisen overleg en akkoord.
