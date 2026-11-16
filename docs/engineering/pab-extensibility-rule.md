# PAB — Uitbreidbaarheid als architectuurregel

## Verplichte regel

Bij iedere nieuwe functionaliteit, refactor of betekenisvolle wijziging in PAB moet de architectuur vanaf het begin worden ontworpen op gecontroleerde toekomstige uitbreiding en verandering.

We bouwen dus niet alleen voor de huidige requirements, maar zo dat toekomstige toevoegingen en wijzigingen op de juiste architecturale plek kunnen worden aangebracht zonder duplicate ownership, patchwerk, workaround, fallback of pagina-specifieke uitzonderingen.

### Dit betekent concreet

- Iedere verantwoordelijkheid heeft één duidelijke canonieke owner.
- Data wordt gestructureerd gemodelleerd zodat nieuwe eigenschappen en varianten later kunnen worden toegevoegd.
- UI en domeinlogica blijven gescheiden.
- Gedeelde functionaliteit wordt modulair opgebouwd en niet per pagina gekopieerd.
- Nieuwe opties zoals extra editor-elementen, kolommen, fonts, dropdowns of andere varianten moeten later kunnen worden toegevoegd zonder de fundering opnieuw te bouwen.
- Configuratie, elementtypes, validatie en rendering worden waar zinvol via uitbreidbare registries/policies ontworpen in plaats van via verspreide `if/else`-special cases.
- We bouwen vandaag niet automatisch alle toekomstige functies; we zorgen er wel voor dat de gekozen structuur toekomstige functies niet onnodig blokkeert.
- Wanneer de bestaande architectuur uitbreiding niet goed ondersteunt, wordt eerst de architectuur verbeterd en pas daarna de functionaliteit gebouwd.

### Ontwerpvraag vóór implementatie

Bij iedere betekenisvolle wijziging moet expliciet worden bekeken:

> **Kan deze functionaliteit later worden uitgebreid, vervangen of aangepast zonder dat we opnieuw lokale uitzonderingen of dubbele ownership moeten introduceren?**

Als het antwoord nee is, eerst de structuur verbeteren. Niet patchen.
