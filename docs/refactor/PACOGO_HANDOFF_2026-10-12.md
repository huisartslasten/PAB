# PacoGO — Handoff naar volgende chat — 2026-10-12

## 1. Project / veiligheid
- Repository: `huisartslasten/PAB`
- TEST branch: `refactor/professional-v1`
- LIVE branch: `main` — NOOIT wijzigen zonder expliciete opdracht.
- Werk uitsluitend tegen TEST.
- Geen LIVE Supabase-wijzigingen.
- Geen Supabase schemawijzigingen.

## 2. Verplichte architectuurregels
- Geen patches, workarounds, bridges, redirects, fallbacks of dubbele implementaties.
- Legacy `index.html` is geen reparatie-oppervlak.
- Eerst ownership en boundary bewijzen; daarna pas implementeren.
- Elke verantwoordelijkheid heeft één canonieke eigenaar.
- Pages = presentatie/interactie; services/features = data/domeinlogica.
- Als de architectuur niet klopt: STOP, boundary herontwerpen, niet patchen.
- Na betekenisvolle wijzigingen: volledige flow, relevante tests, regressies en TEST-branch controleren.
- Lees bij start ook `docs/engineering/PACOGO_ENGINEERING_STANDARD.md` en `docs/refactor/PACOGO_HANDOFF.md`.

## 3. Actuele TEST-head
- HEAD: `ca79c0107689b74b9857b9ae3308f45d481a7e2d`
- Commit: `fix: preserve unresolved test navigation in practice`
- Branch: `refactor/professional-v1`

## 4. Laatste wijzigingen die echt zijn uitgevoerd
De volgende canonical navigatiepunten zijn op TEST rechtgezet:

### `lesson-choice.html`
- Dashboard → `dashboard.html?student=...`
- Agenda → bestaande Agenda-integratie via `index.html?view=agenda&student=...`
- Toetsen blijft op de bestaande, bewezen testbestemming.

### `oefenen.html`
- Dashboard → `dashboard.html?student=...`
- Agenda → bestaande Agenda-integratie via `index.html?view=agenda&student=...`
- Toetsen is bewust NIET naar Dashboard omgeleid; de bestaande onopgeloste testbestemming is behouden.

### `flashcards-template.html`
- Dashboard → canonical `dashboard.html?student=...`
- Agenda → bestaande Agenda-integratie via `index.html?view=agenda&student=...`
- Bestaande Oefenen/Flashcards-routes behouden.

### `lesson-view.html`
- Dashboard → canonical `dashboard.html?student=...`
- Agenda → bestaande Agenda-integratie via `index.html?view=agenda&student=...`
- Toetsen is niet verplaatst zonder bewezen nieuwe eigenaar.

### `test.html`
- Gecontroleerd: Dashboard, Lessen, Toetsen en Agenda gebruiken al de bestaande canonical/runtime boundaries.

### `management.html`
- Gecontroleerd: Dashboard, Lessen en Toetsgeschiedenis gebruiken canonical bestemmingen.

## 5. Regression-validatie
De laatste navigatiewijzigingen zijn daadwerkelijk volledig getest.

GitHub Actions:
- Run: `38202301760`
- Job: `114658129778`
- Head: `ca79c0107689b74b9857b9ae3308f45d481a7e2d`
- Branch: `refactor/professional-v1`
- Node regression: SUCCESS
- Vitest regression: SUCCESS
- Agenda ownership boundary: SUCCESS
- Professional Player ownership boundary: SUCCESS
- Chromium/browser regression: SUCCESS
- clean-tree verification: SUCCESS

Dus: de huidige TEST-head is op deze punten daadwerkelijk groen.

## 6. Page-template actuele waarheid
`src/components/page-template.js` is de canonieke eigenaar van de TEST-badge.

Actuele bronwaarde:
- `PACOGO_TEST_VERSION = 'V5.13'`

De bestaande `PACOGO_HANDOFF.md` vermeldt nog V5.12; dat is verouderde documentatie. Gebruik voor de actuele codewaarheid `src/components/page-template.js`.

## 7. Professional Player / Agenda
Deze onderdelen zijn CLOSED.

### Player
- Canonieke professional Player-runtime is geïntegreerd.
- Legacy Player is niet langer eigenaar van testuitvoering.
- Canonieke persistence zit in de lessons/player-boundary.

### Agenda
- Canonieke Agenda-feature is geïntegreerd.
- Agenda read/runtime/import boundaries zijn vastgesteld.
- Legacy Agenda-runtime is verwijderd als eigenaar.
- Niet opnieuw aan Agenda-import sleutelen tenzij expliciet gevraagd.

## 8. Test History
Test History heeft één canonieke read-eigenaar:
- `src/features/test-history/test-history-read-service.js`

`createPacoGOApp()` exposeert deze als `app.testHistory`.

De eerdere dubbele `test-attempt-write-service`/runtime-route is verwijderd; Player persistence is de canonieke write-eigenaar.

`test-history.html` gebruikt de bestaande app/service-boundary en respecteert een expliciete `student` URL-filter ook wanneer er geen attempts voor die student zijn.

Dit is daadwerkelijk browser/regression-getest in eerdere groene runs.

## 9. Huidige volgende technische stap
De volgende inhoudelijke refactorstap is de **ownership-analyse van `index.html`**.

Belangrijk:
- `index.html` is nog steeds de grote V4.78-monoliet.
- We gaan hem NIET blind aanpassen.
- Eerst bepalen welke functies/blokken nog werkelijk legacy-eigenaar zijn.
- Daarna per ownershipblok bepalen:
  1. wat de V4.78 bron doet;
  2. welke canonical module/page/service nu eigenaar hoort te zijn;
  3. of die replacement boundary al volledig bewezen is;
  4. welke legacy ownership daarna veilig verwijderd kan worden;
  5. welke focused/browser tests dat moeten bewijzen.
- Geen verwijderen alleen omdat code er oud uitziet.
- Geen nieuwe fallback naar legacy.

De GitHub file viewer kapt de grote `index.html`-inhoud af in de huidige connectorweergave. Daarom is er in deze chat nog GEEN wijziging aan `index.html` gedaan.

## 10. Belangrijke bestaande ownership-feiten
- `src/app/bootstrap.js` is de application composition root.
- `app.testHistory` is de bestaande Test History service boundary.
- `app.agenda` is de bestaande Agenda read boundary.
- `src/components/page-template.js` is de gedeelde page shell/TEST-badge owner.
- `src/core/html.js` is de gedeelde HTML escaping owner.
- `src/core/navigation.js` bestaat; navigation ownership moet worden uitgebreid/verplaatst alleen als de actuele call-sites dat aantoonbaar vereisen.
- `src/components/sidebars.js` is nog niet automatisch een vrij te bedraden replacement voor legacy index navigation; de module bevat nog legacy-handler aannames en mag niet als bypass worden ingezet.

## 11. Wat NIET doen in volgende chat
- Geen `index.html` patchen om een nieuwe pagina werkend te krijgen.
- Geen tweede Agenda/Test History/Player service maken.
- Geen `app-context` uitbreiden als tijdelijke adapter voor een architectuurprobleem.
- Geen `main` aanraken.
- Geen LIVE Supabase aanraken.
- Geen claims als “werkt” zonder runtime/testbewijs.
- Geen test aanpassen om alleen groen te krijgen.

## 12. Startinstructie volgende chat
Begin met:
1. bevestig repo + branch;
2. lees Engineering Standard + basis-handoff + dit actuele handoff-bestand;
3. bevestig HEAD `ca79c010...` en de groene regression-run `38202301760`;
4. bepaal daarna de eerstvolgende concrete `index.html` ownership boundary;
5. voer pas code uit nadat replacement owner + parity contract + verwijderingsscope duidelijk zijn.

## 13. Status bij overdracht
**Geen onafgemaakte codewijziging.**

De laatste TEST-code is volledig regression-gevalideerd. De volgende stap is een gecontroleerde ownership-analyse van de resterende legacy `index.html`-runtime, zonder patchwerk.
