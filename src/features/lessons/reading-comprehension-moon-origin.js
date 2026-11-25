export const MOON_ORIGIN_READING_EXERCISE = Object.freeze({
  id: 'moon-origin-reading-01',
  title: 'De ruimte – Hoe is de maan ontstaan?',
  seriesLabel: 'DE RUIMTE',
  durationLabel: 'KORT',
  subtitle: 'Groep 8 · De ruimte',
  textTitle: 'De ruimte – Hoe is de maan ontstaan?',
  textIntro: 'Een botsing met enorme gevolgen',
  text: Object.freeze([
    Object.freeze({
      heading: 'Een botsing in de ruimte',
      paragraphs: Object.freeze([
        'Als je ’s avonds naar de maan kijkt, lijkt het misschien alsof die er altijd al is geweest. Toch is de maan miljarden jaren geleden ontstaan. Wetenschappers denken dat dit gebeurde door een enorme botsing tussen de jonge aarde en een ander hemellichaam.',
        'Ongeveer 4,5 miljard jaar geleden was ons zonnestelsel nog volop in ontwikkeling. De aarde was toen nog jong. Volgens de meest geaccepteerde wetenschappelijke verklaring botste een hemellichaam, ongeveer zo groot als Mars, tegen de jonge aarde. Wetenschappers noemen dit hemellichaam Theia.',
        'Door de enorme kracht van de botsing kwam veel materiaal van de aarde en Theia in de ruimte terecht. Een deel van dat materiaal bleef rond de aarde draaien. Langzaam klonterden de stukken samen. Uiteindelijk ontstond daaruit de maan.'
      ]),
      sourceIds: Object.freeze(['nasa-formation', 'canup-asphaug'])
    }),
    Object.freeze({
      heading: 'Een maan van heet gesteente',
      paragraphs: Object.freeze([
        'De jonge maan zag er heel anders uit dan nu. Door de enorme hitte was een groot deel van de maan gesmolten. Wetenschappers denken dat er een diepe oceaan van magma was: vloeibaar, gloeiend heet gesteente.',
        'Na verloop van lange tijd koelde de maan af. Het gesteente werd steeds harder en vormde een vaste buitenlaag. De maan kreeg zo langzaam het uiterlijk dat we tegenwoordig kennen.'
      ]),
      sourceIds: Object.freeze(['nasa-formation'])
    }),
    Object.freeze({
      heading: 'Hoe weten wetenschappers dit?',
      paragraphs: Object.freeze([
        'Wetenschappers kunnen de botsing zelf natuurlijk niet terugzien. Toch hebben ze belangrijke aanwijzingen gevonden. Tijdens de Apollo-missies brachten astronauten honderden kilo’s maanstenen en maanstof naar de aarde. Onderzoekers ontdekten dat deze materialen aanwijzingen bevatten over de enorme hitte waarmee de maan ooit is ontstaan.',
        'De samenstelling van maanstenen en andere metingen ondersteunen de theorie van de grote botsing. Toch zijn wetenschappers nog niet over alle details eens. Ze onderzoeken bijvoorbeeld hoe de botsing precies verliep en hoe snel het materiaal samenklonterde.'
      ]),
      sourceIds: Object.freeze(['nasa-formation', 'apollo-samples', 'nielsen-isotopes'])
    }),
    Object.freeze({
      heading: 'Een verklaring die nog wordt onderzocht',
      paragraphs: Object.freeze([
        'De grote botsing is op dit moment de belangrijkste wetenschappelijke verklaring voor het ontstaan van de maan. Maar dat betekent niet dat ieder detail al vaststaat. Met nieuwe metingen en computersimulaties proberen onderzoekers steeds beter te begrijpen wat er miljarden jaren geleden gebeurde.'
      ]),
      sourceIds: Object.freeze(['nasa-formation', 'nielsen-isotopes'])
    })
  ]),
  questions: Object.freeze([
    Object.freeze({
      id: 'MOON-Q1',
      type: 'multiple_choice',
      prompt: 'Wat zou waarschijnlijk niet zijn gebeurd als het materiaal niet rond de aarde was blijven draaien?',
      options: Object.freeze([
        Object.freeze({ id: 'A', text: 'Het materiaal had zich niet op deze manier kunnen samenklonteren tot de maan.' }),
        Object.freeze({ id: 'B', text: 'De aarde zou onmiddellijk zijn afgekoeld.' }),
        Object.freeze({ id: 'C', text: 'Theia zou opnieuw tegen de aarde zijn gebotst.' }),
        Object.freeze({ id: 'D', text: 'De maan zou groter zijn geworden.' })
      ]),
      correctOptionId: 'A',
      evidence: 'De laatste twee zinnen van ‘Een botsing in de ruimte’.',
      explanation: 'De tekst legt uit dat materiaal rond de aarde bleef draaien en daarna langzaam samenklonterde. Zonder dat proces had de maan zich niet op deze manier kunnen vormen.',
      distractorRationales: Object.freeze([
        Object.freeze({ optionId: 'B', reason: 'De tekst verbindt het afkoelen van de aarde niet aan het rond de aarde draaien van het materiaal.' }),
        Object.freeze({ optionId: 'C', reason: 'De tekst beschrijft één botsing en zegt niet dat Theia opnieuw botste.' }),
        Object.freeze({ optionId: 'D', reason: 'De tekst zegt niet dat het uitblijven van samenklontering de maan groter zou maken.' })
      ])
    }),
    Object.freeze({
      id: 'MOON-Q2',
      type: 'multiple_choice',
      prompt: 'Waarom zijn de maanstenen die astronauten hebben meegenomen belangrijk voor wetenschappers?',
      options: Object.freeze([
        Object.freeze({ id: 'A', text: 'Ze laten precies zien hoe Theia eruitzag.' }),
        Object.freeze({ id: 'B', text: 'Ze geven aanwijzingen over de omstandigheden waaronder de maan is ontstaan.' }),
        Object.freeze({ id: 'C', text: 'Ze bewijzen dat er vroeger leven op de maan was.' }),
        Object.freeze({ id: 'D', text: 'Ze laten zien dat de maan vroeger groter was dan de aarde.' })
      ]),
      correctOptionId: 'B',
      evidence: 'De twee alinea’s van ‘Hoe weten wetenschappers dit?’.',
      explanation: 'De tekst zegt dat maanstenen aanwijzingen bevatten over de hitte en omstandigheden tijdens het ontstaan van de maan.',
      distractorRationales: Object.freeze([
        Object.freeze({ optionId: 'A', reason: 'De tekst zegt niet dat maanstenen laten zien hoe Theia eruitzag.' }),
        Object.freeze({ optionId: 'C', reason: 'De tekst noemt geen aanwijzingen voor vroeger leven op de maan.' }),
        Object.freeze({ optionId: 'D', reason: 'De tekst vergelijkt de vroegere grootte van de maan en de aarde niet.' })
      ])
    }),
    Object.freeze({
      id: 'MOON-Q3',
      type: 'multiple_choice',
      prompt: 'Een wetenschapper ontdekt nieuwe informatie over de samenstelling van maanstenen. Waarom kan dat belangrijk zijn voor de theorie over het ontstaan van de maan?',
      options: Object.freeze([
        Object.freeze({ id: 'A', text: 'Omdat nieuwe aanwijzingen kunnen helpen om de bestaande verklaring te controleren of aan te passen.' }),
        Object.freeze({ id: 'B', text: 'Omdat de maan daardoor opnieuw kan ontstaan.' }),
        Object.freeze({ id: 'C', text: 'Omdat de aarde dan stopt met draaien.' }),
        Object.freeze({ id: 'D', text: 'Omdat de botsing dan opnieuw kan worden waargenomen.' })
      ]),
      correctOptionId: 'A',
      evidence: 'De alinea’s ‘Hoe weten wetenschappers dit?’ en ‘Een verklaring die nog wordt onderzocht’.',
      explanation: 'De tekst legt uit dat wetenschappers nieuwe metingen gebruiken om de theorie te toetsen en de details beter te begrijpen.',
      distractorRationales: Object.freeze([
        Object.freeze({ optionId: 'B', reason: 'Nieuwe informatie laat de maan niet opnieuw ontstaan.' }),
        Object.freeze({ optionId: 'C', reason: 'De tekst legt geen verband tussen maanstenen en het draaien van de aarde.' }),
        Object.freeze({ optionId: 'D', reason: 'Een nieuwe meting kan de gebeurtenis van miljarden jaren geleden niet opnieuw laten zien.' })
      ])
    }),
    Object.freeze({
      id: 'MOON-Q4',
      type: 'multiple_choice',
      prompt: 'Welke uitspraak geeft de tekst het beste weer?',
      options: Object.freeze([
        Object.freeze({ id: 'A', text: 'De maan is ontstaan doordat astronauten maanstenen naar de aarde brachten.' }),
        Object.freeze({ id: 'B', text: 'Wetenschappers weten precies hoe iedere stap van het ontstaan van de maan verliep.' }),
        Object.freeze({ id: 'C', text: 'De maan is waarschijnlijk ontstaan na een enorme botsing, maar wetenschappers onderzoeken nog hoe dat precies gebeurde.' }),
        Object.freeze({ id: 'D', text: 'De maan is ontstaan uit materiaal van de zon.' })
      ]),
      correctOptionId: 'C',
      evidence: 'De volledige tekst, vooral ‘Een botsing in de ruimte’ en ‘Een verklaring die nog wordt onderzocht’.',
      explanation: 'Deze uitspraak vat de belangrijkste verklaring én de onzekerheid over de precieze details samen.',
      distractorRationales: Object.freeze([
        Object.freeze({ optionId: 'A', reason: 'De maan bestond al miljarden jaren voordat astronauten maanstenen meenamen.' }),
        Object.freeze({ optionId: 'B', reason: 'De tekst zegt juist dat nog niet alle details bekend zijn.' }),
        Object.freeze({ optionId: 'D', reason: 'De tekst beschrijft materiaal van de aarde en Theia, niet materiaal van de zon.' })
      ])
    })
  ]),
  sources: Object.freeze([
    Object.freeze({ id: 'nasa-formation', title: 'NASA — Moon Formation', url: 'https://science.nasa.gov/moon/formation/' }),
    Object.freeze({ id: 'canup-asphaug', title: 'Canup & Asphaug (2001) — Origin of the Moon in a giant impact near the end of the Earth’s formation, Nature 412, 708–712', url: 'https://doi.org/10.1038/35089010' }),
    Object.freeze({ id: 'nielsen-isotopes', title: 'Nielsen, Bekaert & Auro (2021) — Isotopic evidence for the formation of the Moon in a canonical giant impact, Nature Communications 12, 1817', url: 'https://doi.org/10.1038/s41467-021-22155-7' }),
    Object.freeze({ id: 'apollo-samples', title: 'NASA (2025) — NASA’s Apollo Samples Yield New Information about the Moon', url: 'https://science.nasa.gov/science-research/planetary-science/astrobiology/nasas-apollo-samples-yield-new-information-about-the-moon/' })
  ])
});
