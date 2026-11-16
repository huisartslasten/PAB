# PacoGO — Design System handoff voor volgende chat

Status: **Phase 1 / item 4 — Design System 🟡 in uitvoering**
Branch: `refactor/professional-v1`
Repository: `PAB`
Project: `PacoGO`

## Lees dit eerst

Je neemt hier het werk over alsof je dezelfde ontwikkelaar bent die hier net mee bezig was.

**Niet opnieuw beginnen. Niet patchen. Niet terugvallen op legacy.**
Lees eerst dit document en `docs/refactor/design-system-migration.md`.

De architectuur-roadmap is:

### Phase 1 — Central Foundation
1. Page Shell / Template ✅
2. Navigation Registry ✅
3. Management Shell ✅
4. Design System 🟡 **HIER ZIJN WE**

### Phase 2 — Content Architecture
5. Central Editor Framework
6. Lesson Element Registry
7. Learning Material Element Registry

### Phase 3 — Practice
8. Game Registry
9. Practice Template
10. Challenge Registry — gekoppeld aan dezelfde catalogus

### Phase 4 — Cleanup
11. Legacy modules verwijderen
12. Oude versioned modules verwijderen
13. Oude editor-tools verwijderen
14. Dubbele tests consolideren

### Phase 5 — Enforcement
15. Architecture tests
16. Ownership tests
17. CI-regels die dubbele ownership voorkomen

**Ga nu niet naar Phase 2. Eerst Phase 1 item 4 degelijk afronden.**

---

## Waar staan we nu binnen Design System?

De Design System-migratie is systematisch uitgevoerd voor de bekende generieke visuele primitives:

| Primitive / verantwoordelijkheid | Status |
|---|---|
| Dropdown | ✅ Gemigreerd |
| Design tokens | ✅ Gemigreerd |
| Generieke buttons | ✅ Gemigreerd |
| Generieke cards | ✅ Gemigreerd |
| Form controls | ✅ Gemigreerd en geverifieerd groen |
| File/remove controls | ✅ Architecture gate afgerond; geen aparte migratie nodig |

Dit betekent **niet** dat ieder visueel element automatisch Design System-owned wordt.

De file/remove gate is bewust gesloten zonder nieuwe primitive: de actieve learning-material editor heeft eigen image-picker en remove/image-placement interactie in `src/features/learning-material/editor-page.js` en `src/features/learning-material/editor.css`. Dat is feature-owned composition en mag niet kunstmatig worden geëxtraheerd naar een generieke file/remove component.

Generieke file-input presentation valt al onder het Design System form-control primitive. Generieke button presentation valt al onder de Design System button primitives. Feature-specifieke upload, image placement en deletion behavior blijven bij de learning-material feature owner.

Dit voorkomt duplicate ownership en een kunstmatige abstraction layer.

---

## PAB Change Intake / Architecture Gate voor het vervolg

Bij ieder volgend onderdeel opnieuw deze flow volgen:

**PAB CHANGE INTAKE → PAB ARCHITECTURE GATE → PAB IMPLEMENTATION PLAN → IMPLEMENTATION → PAB VERIFICATION GATE → FINAL VERIFICATION**

### Architecture Gate — verplicht beantwoorden vóór code

1. Wat is de canonieke owner?
2. Waar zit de huidige implementatie?
3. Welke pagina's/features/modules delen deze verantwoordelijkheid?
4. Waar hoort de wijziging architectonisch?
5. Welke lokale/legacy implementatie moet worden vervangen, verplaatst of verwijderd?
6. Introduceert dit patchwerk, duplicate ownership, fallback, workaround, bridge, redirect, bypass, extra legacy-koppeling of special case?

Als dit niet duidelijk is: **STOP en eerst architectuur analyseren.**

---

## Wat absoluut niet mag

Niet doen:

- patchen;
- workaround bouwen;
- tijdelijke bridge maken;
- fallback toevoegen;
- compatibility re-export toevoegen;
- oude en nieuwe owner naast elkaar laten bestaan;
- dezelfde logica lokaal kopiëren;
- pagina-specifieke uitzondering maken;
- legacy-code opnieuw gebruiken omdat de nieuwe architectuur nog niet klaar is;
- een test aanpassen/verzwakken om een architectuurprobleem te verbergen;
- CI kunstmatig groen maken.

Als de huidige architectuur de gewenste oplossing niet goed ondersteunt: **stop en verbeter eerst de architectuur.**

---

## Volgende concrete stap

Phase 1 item 4 is nog niet als geheel gesloten. De volgende stap is een gerichte **Design System consumer/ownership inventory** van de resterende generieke UI-verantwoordelijkheden, te beginnen met de actuele styling in `src/components/page-template.css` en de concrete consumers daarvan.

Doel:

> Vaststellen welke resterende delen werkelijk generieke Design System primitives zijn en welke delen terecht bij Page Template, concrete components of features blijven.

De eerste concrete kandidaat die zichtbaar blijft in Page Template is de legacy-achtige `button.secondary` / `button.success` styling. Deze mag niet blind worden vervangen: eerst consumers, ownership en overlap met de bestaande `.paco-btn*` primitives vaststellen.

Daarna per gevonden responsibility:

1. Change Intake;
2. Architecture Gate;
3. consumer inventory;
4. Implementation Plan;
5. directe migratie naar één canonical owner;
6. oude ownership verwijderen;
7. tests uitvoeren;
8. volledige CI/regressie controleren;
9. pas daarna verder met het volgende onderdeel.

**Niet alles tegelijk verplaatsen. Niet gokken. Niet vooruitlopen naar Phase 2.**

---

## Definition of Done voor Phase 1 / Design System

Design System kan pas naar ✅ wanneer:

- de relevante generieke visual primitives zijn geïdentificeerd;
- iedere primitive één duidelijke canonical owner heeft;
- Page Template alleen page-shell/composition verantwoordelijkheid houdt;
- concrete components/features hun eigen ownership behouden waar dat architectonisch hoort;
- oude/duplicate implementations zijn verwijderd;
- er geen compatibility bridges/fallbacks/workarounds bestaan;
- consumers rechtstreeks naar de juiste owner wijzen;
- architecture/ownership tests de grens afdwingen;
- volledige regressie/CI daadwerkelijk groen is;
- de oplossing uitbreidbaar is voor toekomstige PacoGO UI zonder opnieuw lokale kopieën te maken.

Daarna pas:

**Phase 1 → compleet → Phase 2 starten.**

---

## Werkafspraak met de gebruiker

De gebruiker verwacht dat de volgende chat hier **precies doorpakt** en niet opnieuw de context gaat uitvinden.

De gebruiker is bijzonder alert op patchwerk. Als iets rood is, moet de oorzaak degelijk worden onderzocht en architectonisch worden opgelost. Niet simpelweg een test omzeilen, een export terugzetten of een extra fallback toevoegen om groen te krijgen.

Bij twijfel over ownership: **STOP — EERST ARCHITECTUUR ANALYSEREN.**
