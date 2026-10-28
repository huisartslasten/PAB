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

## Wat er in deze chat is gedaan

We zijn bezig met het afronden van het Design System als centrale owner van generieke visuele primitives.

De eerste concrete migratie was de **PacoGO dropdown**.

### Dropdown-migratie — afgerond

De dropdown is rechtstreeks verhuisd naar het Design System:

- `src/components/design-system.js` bevat `createPacoDropdown()`;
- `src/components/design-system.css` bevat de `.paco-dropdown*` styling;
- `src/components/page-template.js` implementeert/exporteert `createPacoDropdown()` niet meer;
- `src/components/page-template.css` bevat de dropdown-styling niet meer en laadt het Design System stylesheet;
- alle bekende runtime-consumers zijn rechtstreeks gemigreerd naar de Design System owner;
- er is een Design System-test voor de dropdown;
- de architecture boundary test controleert dat consumers niet terugvallen op `page-template.js` voor de dropdown.

Belangrijk: er is **geen compatibility re-export, fallback, bridge, duplicate implementation, redirect of pagina-specifieke workaround** toegevoegd.

De dropdown is dus geen tijdelijke migratie-oplossing; de Design System owner is daadwerkelijk de canonieke owner.

## Belangrijke recente CI-les

Tijdens deze migratie was CI eerst rood omdat nog niet alle directe consumers waren gemigreerd. Dat is inhoudelijk onderzocht en opgelost door de echte consumers naar de canonieke owner te migreren.

Er is dus **niet** gekozen voor een re-export vanuit `page-template.js` om de tests snel groen te krijgen.

De huidige status is volgens de laatste verificatie van de gebruiker: **CI groen**.

Als CI later weer rood wordt:

1. bepaal eerst exact welke architectuur- of regressiefout optreedt;
2. zoek de werkelijke owner/consumer/root cause;
3. los het architectonisch correct op;
4. voeg nooit een workaround toe alleen om CI groen te maken;
5. claim geen groene status zonder daadwerkelijke verificatie.

Een groene test is nooit een reden om een ownershipprobleem te maskeren.

---

## Waar staan we nu binnen Design System?

De dropdown is afgerond. **Design System zelf is nog niet afgerond.**

De resterende Design System-verantwoordelijkheden moeten nog systematisch worden geïnventariseerd en, waar ze werkelijk generieke shared primitives zijn, centraal worden gemaakt.

De huidige bekende inventaris is:

| Primitive / verantwoordelijkheid | Status |
|---|---|
| Dropdown | ✅ Gemigreerd |
| Design tokens | 🟡 Nog onderzoeken/migreren |
| Generieke buttons | 🟡 Nog onderzoeken/migreren |
| Generieke cards | 🟡 Nog onderzoeken/migreren |
| Form controls | 🟡 Nog onderzoeken/migreren |
| File/remove controls | 🟡 Nog onderzoeken/migreren |

Dit is **geen opdracht om deze zes dingen blind één voor één te verplaatsen**.

Eerst moet per verantwoordelijkheid worden vastgesteld:

- is dit werkelijk een generieke Design System primitive?
- wie is nu de canonical owner?
- waar wordt het gebruikt?
- welke concrete componenten hebben een eigen ownershipgrens?
- welke bestaande styling/implementatie moet worden vervangen?
- wat is de juiste architecturale bestemming?

Een concreet component zoals een tile, activity card, lesson card, sidebar of dialog wordt niet automatisch Design System-owned omdat het visueel is. Het kan een eigen component owner houden en alleen Design System primitives/tokens consumeren.

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

De volgende chat moet **niet zomaar de volgende primitive gaan verplaatsen**.

Start met een gerichte **Design System consumer/ownership inventory** van de resterende generieke UI-verantwoordelijkheden, te beginnen met de bekende styling in `src/components/page-template.css` en de concrete consumers daarvan.

Doel:

> Vaststellen welke delen werkelijk generieke Design System primitives zijn en welke delen terecht bij Page Template, concrete components of features blijven.

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
