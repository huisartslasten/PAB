# PacoGO Curriculum — Stap 11 A1 Adversarial Test

Status: candidate prototype stress test
Datum: 2026-11-01
Branch: refactor/professional-v1

## Doel

Testen of de A1 vertical slice ongewenste shortcuts maakt.

De test probeert bewust situaties te creëren waarin een simpele score- of moeilijkheidslogica verkeerde conclusies zou trekken.

## Test 1 — Correct antwoord, verkeerde ontwikkeling

Situatie:
Leerling geeft meerdere keren het juiste getalsymbool, maar kan niet uitleggen of koppelen waarom verschillende representaties dezelfde waarde voorstellen.

Verwachte uitkomst:

- D1 kan Supported zijn.
- D2 blijft Insufficient/Uncertain.
- Mastery niet automatisch.

Pass: JA.

Waarom:
Correcte output wordt niet gelijkgesteld aan volledige representatieve coördinatie.

## Test 2 — Moeilijkere taak zonder hogere development

Situatie:
Een leerling lost een zeer grote, visueel complexe taak op maar gebruikt slechts één representatie.
Een andere leerling lost een eenvoudige taak op waarbij twee representaties correct worden gecoördineerd.

Verwachte uitkomst:

- complexiteit wordt apart opgeslagen;
- de complexere taak krijgt niet automatisch een hogere developmental position;
- evidence voor D2/D3 wordt bepaald door het werkelijk geobserveerde gedrag.

Pass: JA.

## Test 3 — Eén succes, premature mastery

Situatie:
Leerling voert één D3-taak perfect uit.

Verwachte uitkomst:

- D3 = Observed of voorlopig Supported;
- mastery = Insufficient Evidence wanneer stabiliteit/variatie ontbreken;
- next action = Variation of Stability Check.

Pass: JA.

## Test 4 — Contradictory evidence

Situatie:
Leerling kan A1-mapping goed uitvoeren met stippen en cijfers, maar faalt bij een alternatieve representatie.

Verwachte uitkomst:

- geen simpele gemiddelde score;
- Contradictory of Uncertain indien de evidence werkelijk strijdig is;
- volgende actie = Contradiction Check / Variation.

Pass: JA.

## Test 5 — Taal als alternatieve verklaring

Situatie:
De numerieke mapping lijkt correct wanneer de leerling alleen symbolen gebruikt, maar niet wanneer een schriftelijk getalwoord moet worden geproduceerd.

Verwachte uitkomst:

- niet automatisch D2 als zwak classificeren;
- taal/productie als mogelijke alternative explanation coderen;
- taakvariant zonder dezelfde taalbelasting inzetten.

Pass: JA.

## Test 6 — Niet gedaan ≠ kan niet

Situatie:
Een leerling heeft D3 nog niet aangeboden gekregen.

Verwachte uitkomst:

- D3 = Not Assessed / Insufficient;
- niet Not Yet Mastered op basis van afwezigheid alleen;
- next action = diagnostische D3-taak.

Pass: JA.

## Test 7 — Hint-afhankelijk succes

Situatie:
Leerling lost D3 correct op nadat een hint de representaties expliciet koppelt.

Verwachte uitkomst:

- antwoord correct registreren;
- hintgebruik registreren als onderdeel van performance;
- independence laag/voorlopig;
- geen volledige masteryclaim;
- mogelijke next action = zelfstandige herhaling.

Pass: JA.

## Test 8 — Zelfde score, andere evidence

Leerling A:
4/5 correct, zelfstandig, verschillende representaties, consistente strategie.

Leerling B:
4/5 correct, veel hints, één representatie, fouten in mapping.

Verwachte uitkomst:

De leerlingen mogen niet automatisch dezelfde developmental inference of mastery state krijgen.

Pass: JA.

## Test 9 — Multi-skill taak

Situatie:
Een taak bevat A1 plus plaatswaarde A4.

Verwachte uitkomst:

- primaire target expliciet vastleggen;
- A4-observaties niet automatisch als onafhankelijk A1-bewijs tellen;
- eventuele tweede claim apart beoordelen.

Pass: JA.

## Test 10 — Simpele score wint van complex model

Situatie:
Na voldoende echte data blijkt dat een eenvoudiger model (bijvoorbeeld stabiele performance zonder aparte D1/D2/D3-classificatie) even goed of beter voorspelt.

Verwachte uitkomst:

PacoGO moet het complexere model kunnen vereenvoudigen of vervangen.

Beslissing:
`SIMPLIFY` is een geldige uitkomst.

Pass: JA.

## Samenvattend oordeel

De adversarial test laat zien dat de verticale architectuur conceptueel bestand is tegen de belangrijkste shortcuts die eerder bewust zijn uitgesloten:

- score = development
- difficulty = development
- correct = mastery
- één succes = mastery
- niet gedaan = kan niet
- hintsucces = zelfstandige beheersing
- complexe taak = hogere ontwikkeling
- context/taalprobleem = automatisch skillprobleem
- multi-skill taak = onafhankelijk bewijs voor iedere skill

Dit is nog geen empirische validatie. Het is een logische stresstest van de architectuur.

## Nieuwe ontwerpconclusie

De kern van de engine is niet een classificatiescore maar een **evidence management loop**:

`wat zagen we? → waarvoor is dat evidence? → hoe sterk is het? → wat weten we nog niet? → welke volgende observatie vermindert die onzekerheid het meest?`

Daarmee wordt automatische next-action een gevolg van het evidence-model in plaats van een losse aanbevelingsfunctie.

## Volgende stap

De A1 vertical slice is nu inhoudelijk en logisch voldoende ver uitgewerkt om over te gaan naar de volgende grote test:

**een tweede skill door exact dezelfde engine halen om te testen of de architectuur werkelijk generiek is.**

Voorkeur voor de tweede skill: **B1 Optellen**, omdat B1 al eerder als frameworktest is gebruikt maar nog niet door de volledige B10/C1-C10-engine is gehaald.
