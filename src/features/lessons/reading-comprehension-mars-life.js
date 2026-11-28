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
  textIntro: 'Wetenschappers zoeken naar sporen van leven op de rode planeet.',
  text: Object.freeze([
    Object.freeze({
      heading: 'Een planeet met een ander verleden',
      paragraphs: Object.freeze([
        'Mars is een bijzondere planeet. Tegenwoordig is het er erg koud en droog. Er zijn geen rivieren en meren meer zoals op aarde. Maar miljarden jaren geleden zag Mars er waarschijnlijk heel anders uit.',
        'Wetenschappers hebben ontdekt dat er vroeger rivieren en meren op Mars waren. Er stroomde water over de grond. Omdat water belangrijk is voor leven zoals wij dat kennen, vragen wetenschappers zich af of er vroeger kleine levende wezens op Mars hebben geleefd.'
      ]),
      images: Object.freeze([]),
      sourceIds: Object.freeze(['nasa-mars-report', 'nasa-mars-water'])
    }),
    Object.freeze({
      heading: 'Een bijzondere steen',
      paragraphs: Object.freeze([
        'Ruimtewagens onderzoeken daarom de stenen en de grond van Mars. In 2024 ontdekte de ruimtewagen Perseverance een bijzondere steen. In deze steen zaten stoffen die mogelijk iets te maken hebben met vroeger leven.',
        'In september 2025 vertelde NASA dat deze ontdekking mogelijke aanwijzingen bevat voor leven dat vroeger op Mars kan hebben bestaan.'
      ]),
      images: Object.freeze([MARS_LIFE_READING_IMAGES.rover, MARS_LIFE_READING_IMAGES.rock]),
      sourceIds: Object.freeze(['nasa-cheyava-2024', 'nasa-biosignature-2025'])
    }),
    Object.freeze({
      heading: 'Waarom is er nog geen zekerheid?',
      paragraphs: Object.freeze([
        'Toch weten wetenschappers nog niet zeker of er ooit leven is geweest. Dezelfde stoffen kunnen namelijk ook ontstaan zonder dat er levende wezens zijn. Er is dus meer onderzoek nodig.',
        'Mars blijft voorlopig een groot raadsel. We weten dat er vroeger water was, maar we weten nog niet of er ooit leven is geweest. De zoektocht gaat verder.'
      ]),
      images: Object.freeze([]),
      sourceIds: Object.freeze(['nasa-biosignature-2025', 'nature-study'])
    }),
    Object.freeze({
      heading: 'Zou er nu nog leven kunnen zijn?',
      paragraphs: Object.freeze([
        'Aan de buitenkant van Mars is het erg moeilijk om te overleven. Het is er koud en er is gevaarlijke straling. Diep onder de grond is de situatie misschien anders.',
        'Wetenschappers onderzoeken of daar plaatsen zijn waar kleine levende wezens zouden kunnen overleven.'
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
        Object.freeze({ optionId: 'B', reason: 'De tekst zegt niet dat er vroeger geen water op Mars was.' }),
        Object.freeze({ optionId: 'C', reason: 'De tekst zegt niet dat mensen ooit op Mars hebben gewoond.' }),
        Object.freeze({ optionId: 'D', reason: 'De tekst beschrijft Mars juist als een koude planeet.' })
      ])
    }),
    Object.freeze({
      id: 'MARS-Q2',
      type: 'multiple_choice',
      prompt: 'Waarom weten wetenschappers nog niet zeker of er ooit leven op Mars is geweest?',
      options: Object.freeze([
        Object.freeze({ id: 'A', text: 'Omdat de rover de steen niet goed heeft kunnen bekijken.' }),
        Object.freeze({ id: 'B', text: 'Omdat dezelfde stoffen ook kunnen ontstaan zonder dat er levende wezens zijn.' }),
        Object.freeze({ id: 'C', text: 'Omdat er op Mars nooit water is geweest.' }),
        Object.freeze({ id: 'D', text: 'Omdat er op Mars geen water meer aan de oppervlakte is.' })
      ]),
      correctOptionId: 'B',
      evidence: 'De eerste alinea van ‘Waarom is er nog geen zekerheid?’.',
      explanation: 'De tekst noemt een andere mogelijke verklaring: gewone chemische reacties kunnen dezelfde stoffen en patronen veroorzaken.',
      distractorRationales: Object.freeze([
        Object.freeze({ optionId: 'A', reason: 'De tekst zegt niet dat de rover de steen niet goed kon bekijken.' }),
        Object.freeze({ optionId: 'C', reason: 'De tekst zegt juist dat er vroeger water op Mars was.' }),
        Object.freeze({ optionId: 'D', reason: 'De tekst zegt niet dat er geen leven op Mars kan zijn geweest.' })
      ])
    }),
    Object.freeze({
      id: 'MARS-Q3',
      type: 'multiple_choice',
      prompt: 'Lees de zin: “Toch weten wetenschappers nog niet zeker of er ooit leven is geweest.” Het woord ‘toch’ verbindt deze zin met de mogelijke aanwijzingen voor vroeger leven die in de vorige alinea worden genoemd. Welk verband geeft ‘toch’ hier aan?',
      options: Object.freeze([
        Object.freeze({ id: 'A', text: 'Een opsomming: er worden meerdere redenen achter elkaar genoemd.' }),
        Object.freeze({ id: 'B', text: 'Een tegenstelling: ondanks de onzekerheid blijft Mars interessant.' }),
        Object.freeze({ id: 'C', text: 'Een tijdsvolgorde: daarna gebeurde er iets anders.' }),
        Object.freeze({ id: 'D', text: 'Een voorbeeld: er wordt één voorbeeld genoemd.' })
      ]),
      correctOptionId: 'B',
      evidence: 'De overgang tussen het tekstgedeelte over de bijzondere steen en het tekstgedeelte over de onzekerheid.',
      explanation: 'Eerst noemt de tekst mogelijke aanwijzingen voor vroeger leven. Met ‘toch’ laat de schrijver zien dat er ondanks die aanwijzingen nog geen zekerheid is.',
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
