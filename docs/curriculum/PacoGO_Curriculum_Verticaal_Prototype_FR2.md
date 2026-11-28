# PacoGO Curriculum — Vertical Prototype FR2

Status: candidate vertical prototype
Datum: 2026-11-01
Skill: FR2 — Breukequivalentie herkennen en gebruiken

## 1. Doel

Dit document test of dezelfde PacoGO-engineketen werkt voor een relationele/conceptuele skill, niet alleen voor getalrepresentatie of een operationele skill.

Keten:
SKILL → DEVELOPMENT → CLAIM → EVIDENCE TARGET → TASK MODEL → TASK → PERFORMANCE → EVIDENCE → DEVELOPMENTAL INFERENCE → MASTERY → DECISION → NEXT ACTION

Dit is een prototype en geen empirische validatie van FR2 als ontwikkelingsmodel.

## 2. Skill

FR2 — Breukequivalentie herkennen en gebruiken.

Kern: de leerling kan herkennen wanneer verschillende breuken dezelfde waarde vertegenwoordigen en deze equivalentie gebruiken.

## 3. Candidate development model

D1 — Equivalentie herkennen
De leerling herkent dat twee verschillende breuken dezelfde hoeveelheid/waarde kunnen representeren.

D2 — Equivalentie verklaren
De leerling kan de equivalentie onderbouwen via een representatie, verhouding tussen teller/noemer of andere betekenisvolle redenering.

D3 — Equivalentie functioneel gebruiken
De leerling gebruikt equivalentie doelgericht om te vergelijken, representeren, rekenen of een probleem eenvoudiger te maken.

Belangrijk: D1→D2→D3 is een kandidaatvolgorde, geen bewezen universele ontwikkelingsvolgorde.

## 4. Developmental claims

C1: De leerling kan equivalentie tussen twee breuken herkennen.
C2: De leerling kan equivalentie betekenisvol onderbouwen.
C3: De leerling kan equivalentie inzetten als hulpmiddel voor een ander doel.

## 5. Evidence targets

ET1 — correcte herkenning van equivalente/niet-equivalente paren.
ET2 — onderscheid tussen equivalentie en oppervlakkige overeenkomst.
ET3 — representatie- of redeneerbewijs dat dezelfde waarde wordt bedoeld.
ET4 — consistent gebruik van equivalentie onder gewijzigde representatie.
ET5 — functioneel gebruik van equivalentie zonder dat de taak expliciet zegt dat equivalentie nodig is.
ET6 — contradictorisch bewijs: correcte uitkomst met foutieve of niet-passende redenering.

## 6. Task models

TM1 — Pair classification
Twee breuken: equivalent / niet equivalent.

TM2 — Representation match
Breuken koppelen aan dezelfde hoeveelheid via bijvoorbeeld stroken, cirkels, getallenlijn of andere representatie.

TM3 — Explanation
Leerling verklaart waarom twee breuken equivalent zijn.

TM4 — Transformation
Leerling maakt een equivalente breuk of verandert een representatie zonder de waarde te veranderen.

TM5 — Hidden-use task
Een probleem waarin equivalentie nuttig is maar niet expliciet wordt genoemd.

TM6 — Contrast task
Breuken die visueel of numeriek op elkaar lijken maar niet equivalent zijn.

## 7. Complexity profile

Relevante kandidaatdimensies:
- abstractieniveau;
- afstand tussen representaties;
- aantal breuken/relaties;
- representatievariatie;
- gegeven-naar-gevraagd afstand;
- mate van zelfstandige strategiekeuze;
- contextuele belasting;
- gelijktijdig gebruik van andere skills.

Complexiteit wordt niet gebruikt als directe proxy voor development.

## 8. Vertical prototype

### Prototype A — directe herkenning
Task: Welke paren vertegenwoordigen dezelfde waarde?
- 1/2 en 2/4
- 2/3 en 3/5
- 3/4 en 6/8

Beoogde observaties:
- antwoord;
- keuze per paar;
- eventuele reden/representatie.

Evidence:
Een correct onderscheid levert E1-resultaatevidence voor C1, maar zonder redeneergegevens nog beperkt bewijs voor C2.

### Prototype B — contrast
Task: 2/4 en 2/3. Zijn deze hetzelfde? Leg uit.

Doel: voorkomen dat alleen dezelfde teller of visuele gelijkenis de taak oplost.

Evidence voor C1 + C2 wordt sterker wanneer de leerling zowel correct onderscheidt als een passende onderbouwing geeft.

### Prototype C — representatievariant
Task: Toon op een passende representatie waarom 3/6 en 1/2 dezelfde waarde hebben.

Doel: nagaan of het begrip overeind blijft wanneer de taak niet alleen symbolisch wordt aangeboden.

Evidence target: ET3 + ET4.

### Prototype D — functioneel gebruik
Task: Een probleem waarin 4/8 en 1/2 voorkomen en de leerling zelf moet bepalen welke representatie handiger is.

Doel: C3 / D3 onderzoeken.

Evidence target: ET5.

## 9. Performance → observation

De engine registreert afzonderlijk:
- gegeven taakvariant;
- antwoord;
- correctheid;
- gekozen representatie;
- redenering/uitleg;
- eventuele tussenstappen;
- hulp/hints;
- pogingnummer;
- taakcomplexiteit;
- relevante contextfactoren.

Interpretaties worden niet in de observation opgeslagen.

## 10. Evidence assessment

Voor elk evidence-item:
- relevantie voor claim;
- kwaliteit;
- bijdrage aan coverage;
- onafhankelijkheid;
- variatie;
- contradictie;
- plausibele alternatieve verklaring.

Voorbeeld:
Correct antwoord op TM1 = sterke uitkomstinformatie voor C1, maar op zichzelf onvoldoende bewijs voor D2 of D3.

## 11. Developmental inference

Candidate inference rules:

D1 ondersteund wanneer herkenning over meerdere relevante taakvarianten consistent is.

D2 ondersteund wanneer de leerling niet alleen correct is maar een passende betekenisvolle verklaring/representatie geeft, en dit overeind blijft bij taakvariatie.

D3 ondersteund wanneer equivalentie zelfstandig functioneel wordt ingezet in een taak waarin de strategie niet expliciet wordt voorgeschreven.

Alternatieve verklaringen moeten worden meegenomen, bijvoorbeeld procedurele regelkennis zonder betekenisvol begrip.

Mogelijke uitkomsten:
- Observed
- Supported
- Uncertain
- Contradictory
- Insufficient evidence

## 12. Mastery inference

FR2 mastery is claim- en scope-specifiek.

Voorlopige voorwaarden:
- relevante evidence;
- voldoende coverage van herkenning, verklaring en/of gebruik afhankelijk van de scope;
- stabiliteit over meerdere observaties;
- variatie in representatie/taskvorm;
- voldoende onafhankelijkheid;
- geen onopgeloste sterke contradictie.

Een leerling kan dus:
- D1 beheersen maar D2 onvoldoende onderbouwen;
- D1+D2 beheersen maar D3 nog niet;
- onvoldoende evidence hebben zonder dat dit gelijkstaat aan niet kunnen.

## 13. Decision layer

Voorbeeldstatussen:

1. D1 onvoldoende evidence → volgende taak: herkenning + contrast.
2. D1 stabiel, D2 onzeker → volgende taak: explanation/representation.
3. D1+D2 ondersteund, D3 onzeker → hidden-use task.
4. D1+D2+D3 voldoende stabiel → onderhoud/transfer/nieuwe gerelateerde skill.
5. Contradictie → eerst diagnostische taak om alternatieve verklaring te onderscheiden.

## 14. Automatic next-action logic

De next action wordt gekozen op basis van het informatietekort, niet simpelweg op basis van foutpercentage.

Prioriteit:
1. eerst onduidelijke development onderscheiden;
2. daarna ontbrekende evidence coverage aanvullen;
3. daarna stabiliteit/variatie testen;
4. daarna functioneel gebruik/transfer onderzoeken;
5. pas daarna mastery bevestigen.

Dit voorkomt dat de engine automatisch alleen meer van dezelfde sommen geeft.

## 15. Adversarial checks

A. Correct antwoord, foutieve verklaring
→ C1 kan ondersteund zijn; C2 niet automatisch.

B. Fout antwoord, goede aanpak maar rekenfout
→ observation bevat beide; evidence voor conceptueel begrip kan mogelijk relevant zijn, maar vraagt beoordeling.

C. Correct door expliciet aangeleerde procedure
→ geen automatische conclusie dat equivalentiebegrip ontwikkeld is.

D. Correct op symbolische taak, fout op representatievariant
→ coverage/variation onvoldoende; development niet automatisch stabiel.

E. Correct op directe taak, niet zelfstandig bij hidden-use task
→ D3 niet automatisch ondersteund.

F. Veel correcte taken van dezelfde vorm
→ herhaling verhoogt niet automatisch evidence coverage.

G. Moeilijkere taak fout
→ fout betekent niet automatisch lagere development.

H. Verbale uitleg zwak, non-verbale representatie sterk
→ taalbelasting als alternatieve verklaring onderzoeken; niet automatisch C2 afwijzen.

I. Eén onverwachte fout na veel stabiele prestaties
→ contradiction check; niet automatisch mastery verwijderen.

J. Leerling heeft FR2 niet geoefend
→ onvoldoende evidence, niet automatisch NOT MASTERED.

## 16. Engine output voorbeeld

Input:
- meerdere taakvarianten;
- prestaties;
- observaties;
- evidence assessments.

Output:
- D1: Supported
- D2: Supported
- D3: Uncertain
- Mastery scope D1+D2: Supported/voorlopig
- Mastery scope D3: Insufficient evidence
- Next action: hidden-use functional task

Dit is een modeluitkomst, geen leerlingdiagnose.

## 17. Wat deze verticale test laat zien

FR2 test een ander type construct dan A1/B1: relationele equivalentie. Dezelfde engine kan de keten behouden terwijl de inhoudelijke evidence targets, task models en inferencevragen veranderen.

Belangrijke generieke regel:
De engine moet niet weten wat een breuk is. De curriculumlaag definieert skill, claims, evidence targets en task models; de engine verwerkt vervolgens observaties en evidence volgens dezelfde algemene architectuur.

## 18. Status

FR2 vertical prototype: Candidate / design-tested.

Niet bewezen:
- dat D1→D2→D3 werkelijk de ontwikkelingsvolgorde is;
- dat de voorgestelde masteryvoorwaarden optimaal zijn;
- dat de gekozen taken voldoende valide zijn;
- dat de engine empirisch betere beslissingen maakt dan eenvoudiger modellen.

Volgende stap na deze prototypefamilie: bepalen welke onderdelen werkelijk generiek zijn en welke ten onrechte skill-specifieke logica bevatten.
