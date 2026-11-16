# PacoGO — Skills Navigation Contract v0.1

**Status:** learner-facing navigation contract  
**Branch:** `refactor/professional-v1`  
**Scope:** central Skills overview and mathematics topic navigation  
**Authority:** central navigation and page-presentation contract; not a curriculum definition

## 1. Purpose

The Skills entry point should first show the learner the mathematics topics. Selecting **Breuken** opens the fraction-topic overview. The detailed curriculum content is built only from the existing PacoGO-SLO skills and curriculum sources.

The labels in this document organise navigation. They do not create or rename curriculum Skills, Developments, Claims, Evidence Targets, Task Models or prerequisites.

## 2. Navigation hierarchy

### 2.1 Mathematics overview

Display these 18 topics in this order:

1. Splitsen
2. Getallen
3. Erbijsommen
4. Erafssommen
5. Cijferen
6. Delen
7. Vermenigvuldigen
8. Breuken
9. Maten
10. Procenten
11. Klokkijken
12. Geld
13. Grafieken
14. Kommagetallen
15. Rekenmachine
16. Ruimtelijk inzicht
17. Redactiesommen
18. Divers

Only **Breuken** is currently connected to a second navigation level. Other topics remain visible but are not represented as implemented learning routes.

### 2.2 Fraction overview

Display these six topics in this order:

1. Algemeen
2. Optellen
3. Aftrekken
4. Vermenigvuldigen
5. Delen
6. Getallenlijn

These are navigation groupings, not new SLO Skills. Their eventual content and relationships must be derived from the existing curriculum sources. In particular, the missing formal FR1 development/evidence contract remains an explicit source gap and must not be filled by invented identifiers.

## 3. Mandatory PacoGO page architecture

Every page in this navigation hierarchy MUST:

- use the central `mountPacoPageTemplate` page shell;
- use the shared PacoGO navigation component;
- use the shared PacoGO tile component and central tile-grid component;
- preserve selected learner and view-mode context in navigation;
- use a compact, responsive layout consistent with the PacoGO design system;
- keep topic catalogues central rather than embedding separate lists in page files.

No page-specific alternate shell, one-off HTML template or duplicate visual component is permitted.

## 4. Fraction learning and practice boundary

The fraction overview is navigation only. It does not itself implement fraction learning content.

Subsequent fraction topic pages must use the existing SLO curriculum, curriculum registry and traceability sources. They must not invent or silently alter Skills, Developments, Claims, Evidence Targets, Task Models, prerequisites, mastery or next-action contracts.

Every fraction practice page must additionally comply with the central **PacoGO Fraction Practice Interface — Central Design System v0.1**, including the shared Fraction Learning Interface, stacked fraction notation, shared answer inputs, area-model contract and compact layout.

## 5. Current implementation boundary

- The central Skills page displays all 18 mathematics topics.
- Selecting Breuken opens the six-topic fraction overview within the same Skills route and canonical page template.
- Other mathematics topics and the six fraction subtopics are visible but are not yet connected to completed learning content.
- The previous FR2 detail page is no longer offered from the central Skills entry point. Its route and underlying curriculum artifacts are not deleted by this navigation change.
- No curriculum registry, SLO mapping, learner state, persistence, Supabase or assessment contract is changed by this navigation layer.
