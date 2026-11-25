export const MARS_LIFE_READING_IMAGES = Object.freeze({
  rover: Object.freeze({
    src: 'https://science.nasa.gov/wp-content/uploads/2024/07/pia26344-perseverance-selfie-at-cheyava.jpg',
    alt: 'De Perseverance-rover op het oppervlak van Mars, met de steen Cheyava Falls in beeld.',
    caption: 'De rover Perseverance onderzoekt de steen Cheyava Falls.',
    author: 'NASA/JPL-Caltech/MSSS',
    sourceUrl: 'https://science.nasa.gov/resource/perseverances-selfie-with-cheyava-falls/',
    license: 'NASA Media Usage Guidelines',
    licenseUrl: 'https://www.nasa.gov/nasa-brand-center/images-and-media/',
    fit: 'contain'
  }),
  rock: Object.freeze({
    src: 'https://science.nasa.gov/wp-content/uploads/2024/07/pia26368-perseverance-finds-a-rock-with-leopard-spots.png',
    alt: 'Close-up van de Marssteen Cheyava Falls met lichte vlekken en donkere randen.',
    caption: 'De steen Cheyava Falls heeft opvallende lichte en donkere vlekken.',
    author: 'NASA/JPL-Caltech',
    sourceUrl: 'https://science.nasa.gov/resource/perseverance-finds-a-rock-with-leopard-spots/',
    license: 'NASA Media Usage Guidelines',
    licenseUrl: 'https://www.nasa.gov/nasa-brand-center/images-and-media/',
    fit: 'contain'
  })
});

export const MARS_LIFE_READING_EXERCISE = Object.freeze({
  id: 'exercise-0001',
  title: 'De ruimte – Heeft Mars ooit leven gehad?',
  seriesLabel: 'DE RUIMTE',
  durationLabel: 'KORT',
  subtitle: 'Groep 8 · De ruimte',
  textTitle: 'Heeft Mars ooit leven gehad?',
  textIntro: 'Wetenschappers zoeken naar sporen van heel klein leven',
  text: Object.freeze([
    Object.freeze({
      heading: 'Een planeet met een ander verleden',
      paragraphs: Object.freeze([
        'Mars is nu een koude, droge planeet. Aan het oppervlak zijn geen rivieren en meren zoals op aarde. Maar miljarden jaren geleden zag Mars er waarschijnlijk heel anders uit.',
        'Wetenschappers hebben op Mars sporen gevonden van oude rivierbeddingen en meren. Er stroomde vroeger dus water over het oppervlak. Omdat water belangrijk is voor leven zoals wij dat kennen, onderzoeken wetenschappers of er toen kleine levende wezens op Mars kunnen hebben bestaan.'
      ]),
      images: Object.freeze([]),
      sourceIds: Object.freeze(['nasa-mars-report', 'nasa-mars-water'])
    }),
    Object.freeze({
      heading: 'Een bijzondere steen',
      paragraphs: Object.freeze([
        'De Marswagen Perseverance onderzoekt stenen en grond in een gebied waar vroeger water stroomde. In juli 2024 onderzocht de rover een steen die Cheyava Falls wordt genoemd. In de steen vond hij bijzondere patronen en stoffen die mogelijk iets vertellen over vroegere omstandigheden op Mars.',
        'In september 2025 vertelden wetenschappers dat een monster uit deze steen bijzondere stoffen en patronen bevat. Die zijn misschien door leven ontstaan. Maar ze kunnen ook op een andere manier ontstaan. Daarom weten we nog niet of er vroeger echt leven op Mars was.'
      ]),
      images: Object.freeze([MARS_LIFE_READING_IMAGES.rover, MARS_LIFE_READING_IMAGES.rock]),
      sourceIds: Object.freeze(['nasa-cheyava-2024', 'nasa-biosignature-2025'])
    }),
    Object.freeze({
      heading: 'Waarom is er nog geen zekerheid?',
      paragraphs: Object.freeze([
        'Wetenschappers moeten voorzichtig zijn. Sommige stoffen en patronen kunnen ontstaan door levende wezens, maar ze kunnen ook door gewone chemische reacties ontstaan. Daarom is verder onderzoek nodig voordat onderzoekers kunnen zeggen dat er ooit leven op Mars was.',
        'Toch blijft Mars een interessante plek om te zoeken. De oude rivierbeddingen laten zien dat er vroeger water was, en de bijzondere steen geeft onderzoekers nieuwe aanwijzingen. Samen kunnen die gegevens helpen om het verleden van Mars beter te begrijpen.'
      ]),
      images: Object.freeze([]),
      sourceIds: Object.freeze(['nasa-biosignature-2025', 'nature-study'])
    }),
    Object.freeze({
      heading: 'Zou er nu nog leven kunnen zijn?',
      paragraphs: Object.freeze([
        'Aan het oppervlak is leven moeilijk. Het is er erg koud, er is weinig bescherming tegen gevaarlijke straling en vloeibaar water blijft er niet gemakkelijk bestaan. Diep onder de grond kan de omgeving beter beschermd zijn.',
        'Onderzoekers bestuderen daarom of er onder het oppervlak plaatsen zijn waar micro-organismen zouden kunnen overleven. Er is op dit moment geen leven op Mars gevonden. Of er ooit leven was, of dat er misschien nog ergens leven bestaat, is dus nog een open vraag.'
      ]),
      images: Object.freeze([]),
      sourceIds: Object.freeze(['nasa-mars-report', 'nasa-search-life'])
    })
  ]),
  questions: Object.freeze([
    Object.freeze({
      id: 'MARS-Q1',
      type: 'multiple_choice',
      prompt: 'Waarom onderzoeken wetenschappers of er vroeger leven op Mars kan zijn geweest?',
      options: Object.freeze([
        Object.freeze({ id: 'A', text: 'Omdat er aanwijzingen zijn dat er vroeger water op Mars was.' }),
        Object.freeze({ id: 'B', text: 'Omdat er nu grote bossen op Mars groeien.' }),
        Object.freeze({ id: 'C', text: 'Omdat mensen vroeger op Mars hebben gewoond.' }),
        Object.freeze({ id: 'D', text: 'Omdat Mars warmer is dan de aarde.' })
      ]),
      correctOptionId: 'A',
      evidence: 'De tweede alinea van ‘Een planeet met een ander verleden’.',
      explanation: 'De tekst legt uit dat er vroeger water was. Omdat water belangrijk is voor leven zoals wij dat kennen, onderzoeken wetenschappers of er toen leven kan zijn geweest.',
      distractorRationales: Object.freeze([
        Object.freeze({ optionId: 'B', reason: 'De tekst noemt geen bossen op Mars.' }),
        Object.freeze({ optionId: 'C', reason: 'De tekst zegt niet dat mensen ooit op Mars hebben gewoond.' }),
        Object.freeze({ optionId: 'D', reason: 'De tekst beschrijft Mars juist als een koude planeet.' })
      ])
    }),
    Object.freeze({
      id: 'MARS-Q2',
      type: 'multiple_choice',
      prompt: 'Waarom weten wetenschappers nog niet zeker of er vroeger leven op Mars was?',
      options: Object.freeze([
        Object.freeze({ id: 'A', text: 'Omdat de rover de steen niet goed heeft kunnen bekijken.' }),
        Object.freeze({ id: 'B', text: 'Omdat zulke stoffen en patronen ook zonder levende wezens kunnen ontstaan.' }),
        Object.freeze({ id: 'C', text: 'Omdat er op Mars nooit water is geweest.' }),
        Object.freeze({ id: 'D', text: 'Omdat biosignaturen alleen op aarde voorkomen.' })
      ]),
      correctOptionId: 'B',
      evidence: 'De eerste alinea van ‘Waarom is er nog geen zekerheid?’.',
      explanation: 'De tekst noemt een andere mogelijke verklaring: gewone chemische reacties kunnen dezelfde stoffen en patronen veroorzaken.',
      distractorRationales: Object.freeze([
        Object.freeze({ optionId: 'A', reason: 'De tekst zegt niet dat de rover de steen niet goed kon bekijken.' }),
        Object.freeze({ optionId: 'C', reason: 'De tekst beschrijft juist aanwijzingen voor vroeger water op Mars.' }),
        Object.freeze({ optionId: 'D', reason: 'De tekst zegt niet dat biosignaturen alleen op aarde voorkomen.' })
      ])
    }),
    Object.freeze({
      id: 'MARS-Q3',
      type: 'multiple_choice',
      prompt: 'Lees de zin: “Toch blijft Mars een interessante plek om te zoeken.” Het woord ‘toch’ verbindt deze zin met de uitleg dat de gevonden stoffen en patronen nog geen bewijs voor leven zijn. Welk verband geeft ‘toch’ hier aan?',
      options: Object.freeze([
        Object.freeze({ id: 'A', text: 'Een opsomming: er worden meerdere redenen achter elkaar genoemd.' }),
        Object.freeze({ id: 'B', text: 'Een tegenstelling: ondanks de onzekerheid blijft Mars interessant.' }),
        Object.freeze({ id: 'C', text: 'Een tijdsvolgorde: daarna gebeurde er iets anders.' }),
        Object.freeze({ id: 'D', text: 'Een voorbeeld: er wordt één voorbeeld genoemd.' })
      ]),
      correctOptionId: 'B',
      evidence: 'De overgang tussen de alinea’s in ‘Waarom is er nog geen zekerheid?’.',
      explanation: 'Eerst staat dat de gevonden stoffen en patronen nog geen bewijs voor leven zijn. De zin met ‘toch’ laat zien dat Mars ondanks die onzekerheid interessant blijft om te onderzoeken.',
      distractorRationales: Object.freeze([
        Object.freeze({ optionId: 'A', reason: 'De zin noemt geen reeks verschillende zaken.' }),
        Object.freeze({ optionId: 'C', reason: 'Het woord geeft hier geen volgorde van gebeurtenissen aan.' }),
        Object.freeze({ optionId: 'D', reason: 'Er wordt geen voorbeeld gegeven; de zin geeft een tegenstelling aan.' })
      ])
    }),
    Object.freeze({
      id: 'MARS-Q4',
      type: 'multiple_choice',
      prompt: 'Wat is volgens de tekst het belangrijkste verschil tussen Mars vroeger en Mars nu?',
      options: Object.freeze([
        Object.freeze({ id: 'A', text: 'Vroeger was Mars waarschijnlijk natter, met rivieren en meren; nu is de planeet koud en droog.' }),
        Object.freeze({ id: 'B', text: 'Vroeger was Mars groter; nu is de planeet kleiner.' }),
        Object.freeze({ id: 'C', text: 'Vroeger had Mars geen stenen; nu bestaat de planeet uit stenen.' }),
        Object.freeze({ id: 'D', text: 'Vroeger was Mars dichter bij de zon; nu staat Mars verder weg.' })
      ]),
      correctOptionId: 'A',
      evidence: 'De eerste twee tekstgedeelten: ‘Een planeet met een ander verleden’ en ‘Een bijzondere steen’.',
      explanation: 'De tekst contrasteert het vroegere Mars met water en rivierbeddingen met het huidige koude en droge oppervlak.',
      distractorRationales: Object.freeze([
        Object.freeze({ optionId: 'B', reason: 'De tekst noemt geen verandering in de grootte van Mars.' }),
        Object.freeze({ optionId: 'C', reason: 'De tekst zegt niet dat Mars vroeger geen stenen had.' }),
        Object.freeze({ optionId: 'D', reason: 'De tekst noemt geen verandering van de afstand tot de zon.' })
      ])
    }),
    Object.freeze({
      id: 'MARS-Q5',
      type: 'multiple_choice',
      prompt: 'Waarom onderzoeken wetenschappers ook de bodem diep onder het oppervlak van Mars?',
      options: Object.freeze([
        Object.freeze({ id: 'A', text: 'Omdat daar misschien meer bescherming is tegen kou en straling dan aan het oppervlak.' }),
        Object.freeze({ id: 'B', text: 'Omdat daar zeker grote dieren leven.' }),
        Object.freeze({ id: 'C', text: 'Omdat daar het zonlicht sterker is.' }),
        Object.freeze({ id: 'D', text: 'Omdat daar al bossen en planten zijn gevonden.' })
      ]),
      correctOptionId: 'A',
      evidence: 'De eerste alinea van ‘Zou er nu nog leven kunnen zijn?’.',
      explanation: 'De tekst zegt dat de omgeving diep onder de grond beter beschermd kan zijn. Dat maakt het een plek die wetenschappers willen onderzoeken, maar het is geen bewijs dat daar leven is.',
      distractorRationales: Object.freeze([
        Object.freeze({ optionId: 'B', reason: 'De tekst noemt geen grote dieren op Mars.' }),
        Object.freeze({ optionId: 'C', reason: 'Diep onder de grond komt juist minder zonlicht.' }),
        Object.freeze({ optionId: 'D', reason: 'De tekst zegt niet dat er planten of bossen zijn gevonden.' })
      ])
    })
  ]),
  sources: Object.freeze([
    Object.freeze({ id: 'nasa-mars-report', title: 'NASA — The Mars Report: September 2025 (special edition)', url: 'https://science.nasa.gov/mars/the-mars-report/2025-september-special-edition/' }),
    Object.freeze({ id: 'nasa-mars-water', title: 'NASA — Mars: Water on Mars', url: 'https://science.nasa.gov/mars/facts/' }),
    Object.freeze({ id: 'nasa-cheyava-2024', title: 'NASA — Perseverance Finds a Rock with “Leopard Spots” (25 juli 2024)', url: 'https://science.nasa.gov/resource/perseverance-finds-a-rock-with-leopard-spots/' }),
    Object.freeze({ id: 'nasa-biosignature-2025', title: 'NASA/JPL — NASA Says Mars Rover Discovered Potential Biosignature Last Year (10 september 2025)', url: 'https://www.jpl.nasa.gov/news/nasa-says-mars-rover-discovered-potential-biosignature-last-year/' }),
    Object.freeze({ id: 'nature-study', title: 'Nature — Redox-driven mineral and organic associations in Jezero Crater, Mars (10 september 2025)', url: 'https://www.nature.com/articles/s41586-025-09413-0' }),
    Object.freeze({ id: 'nasa-search-life', title: 'NASA — The Search for Life in the Universe', url: 'https://science.nasa.gov/universe/search-for-life/' })
  ])
});
