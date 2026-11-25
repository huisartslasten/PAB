export const SPACE_WATER_READING_IMAGES = Object.freeze({
  earlyEarth: Object.freeze({
    src: 'https://assets.science.nasa.gov/dynamicimage/assets/science/psd/mars/downloadable_items/3/8/38146_astrobiology-artist-concept-early-earth.jpg',
    alt: 'Artistieke voorstelling van de jonge aarde met vulkanische activiteit.',
    caption: 'Een artistieke voorstelling van de jonge aarde.',
    author: 'NASA',
    sourceUrl: 'https://science.nasa.gov/resource/artist-concept-of-an-early-earth/',
    license: 'NASA media usage guidelines',
    licenseUrl: 'https://www.nasa.gov/nasa-brand-center/images-and-media/',
    fit: 'contain'
  }),
  asteroid: Object.freeze({
    src: 'https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar/2023/07/bennu-mosaic.jpg',
    alt: 'Een gedetailleerd beeld van het oppervlak van asteroïde Bennu.',
    caption: 'Asteroïde Bennu, gefotografeerd door de ruimtesonde OSIRIS-REx.',
    author: 'NASA/Goddard/University of Arizona',
    sourceUrl: 'https://science.nasa.gov/gallery/osiris-rex-full-mission-gallery/',
    license: 'NASA media usage guidelines',
    licenseUrl: 'https://www.nasa.gov/nasa-brand-center/images-and-media/',
    fit: 'contain'
  }),
  comet: Object.freeze({
    src: 'https://media.esa.int/legacy/web/images/esa_multimedia/images/2015/03/comet_on_21_march_2015_navcam/15333813-1-eng-GB/173995/image-thumb__173995__fit_large/Comet_on_21_March_2015_NavCam.a2a48df3.webp',
    alt: 'Komeet 67P, gefotografeerd door de navigatiecamera van de Rosetta-missie.',
    caption: 'Bronvermelding: ESA – European Space Agency (Rosetta/NAVCAM). Ongewijzigd weergegeven.',
    author: 'ESA – European Space Agency (Rosetta/NAVCAM)',
    sourceUrl: 'https://www.esa.int/media/comet-on-21-march-2015-navcam',
    license: 'CC BY-SA 3.0 IGO',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/igo/',
    fit: 'contain'
  }),
  waterCycle: Object.freeze({
    src: 'https://svs.gsfc.nasa.gov/vis/a030000/a030500/a030580/water_cycle.png',
    alt: 'Schema dat laat zien hoe water verdampt, wolken vormt en als neerslag terugvalt.',
    caption: 'Schema van de waterkringloop op aarde.',
    author: 'NASA SVS; ontwerp Deborah McLean; technische ondersteuning Marit Jentoft-Nilsen',
    sourceUrl: 'https://svs.gsfc.nasa.gov/30580',
    license: 'NASA media usage guidelines',
    licenseUrl: 'https://www.nasa.gov/nasa-brand-center/images-and-media/',
    fit: 'contain'
  })
});

export const SPACE_WATER_READING_EXERCISE = Object.freeze({
  id: 'space-water-origin-reading-01',
  title: 'De ruimte – Waar komt al het water op aarde vandaan?',
  seriesLabel: 'DE RUIMTE',
  durationLabel: 'KORT',
  subtitle: 'Groep 8 · De ruimte',
  textTitle: 'De ruimte – Waar komt al het water op aarde vandaan?',
  textIntro: 'De lange reis van het water',
  text: Object.freeze([
    Object.freeze({
      heading: 'Een jonge, hete aarde',
      paragraphs: Object.freeze([
        'De aarde is ongeveer 4,6 miljard jaar geleden ontstaan. In het begin was het op aarde extreem heet. Het oppervlak bestond voor een groot deel uit gloeiend heet, vloeibaar gesteente. Er waren nog geen oceanen zoals nu.',
        'De aarde ontstond uit gas, stof en gesteente rond de jonge zon. Een deel van het water zat waarschijnlijk al in het materiaal waaruit de aarde werd opgebouwd. Door de enorme hitte is veel van dat water verdampt.'
      ]),
      images: Object.freeze([SPACE_WATER_READING_IMAGES.earlyEarth]),
      sourceIds: Object.freeze(['early-earth', 'water-origin'])
    }),
    Object.freeze({
      heading: 'Water uit asteroïden',
      paragraphs: Object.freeze([
        'In het jonge zonnestelsel zweefden nog veel stukken gesteente en ijs rond. Sommige daarvan botsten op de jonge aarde. Asteroïden bestaan vooral uit gesteente en metaal. Sommige bevatten ook water, bijvoorbeeld in mineralen of als ijs.',
        'Wanneer een waterrijke asteroïde op de aarde botste, kon dat water aan onze planeet worden toegevoegd. Onderzoekers bestuderen het water in oceanen en vergelijken de kenmerken daarvan met materiaal uit de ruimte. Veel aanwijzingen wijzen erop dat asteroïden een belangrijke bron van het water op aarde zijn.'
      ]),
      images: Object.freeze([SPACE_WATER_READING_IMAGES.asteroid]),
      sourceIds: Object.freeze(['ocean-worlds', 'water-origin'])
    }),
    Object.freeze({
      heading: 'En de kometen?',
      paragraphs: Object.freeze([
        'Kometen zijn anders dan asteroïden. Ze bestaan voor een groot deel uit ijs, met daarnaast stof en gesteente. Als een komeet dichter bij de zon komt, warmt het ijs op en verandert het in gas. Het gas en het stof vormen een wolk rond de komeet. Soms ontstaat ook een lange staart.',
        'Kometen kunnen dus ook water naar de aarde hebben gebracht. In onderzoek naar komeet 67P vonden wetenschappers overeenkomsten tussen het water van die komeet en het water in onze oceanen. Daardoor blijft het mogelijk dat kometen een rol speelden. Hoeveel water zij precies hebben geleverd, is nog niet duidelijk.'
      ]),
      images: Object.freeze([SPACE_WATER_READING_IMAGES.comet]),
      sourceIds: Object.freeze(['comets', 'water-origin'])
    }),
    Object.freeze({
      heading: 'Van waterdamp naar oceanen',
      paragraphs: Object.freeze([
        'Ook vulkanen speelden een rol. Door vulkanische activiteit kwam waterdamp uit het binnenste van de aarde vrij. Toen de aarde langzaam afkoelde, kon die waterdamp veranderen in kleine waterdruppels. Die vielen als regen naar beneden.',
        'Het water verzamelde zich in lage gebieden en vormde uiteindelijk oceanen. Waarschijnlijk is het water op aarde dus niet op één manier aangekomen. Water uit het materiaal waaruit de aarde ontstond, inslagen van asteroïden en mogelijk ook kometen hebben samen bijgedragen.'
      ]),
      images: Object.freeze([]),
      sourceIds: Object.freeze(['water-origin', 'early-earth'])
    }),
    Object.freeze({
      heading: 'Water blijft in beweging',
      paragraphs: Object.freeze([
        'Ook nu is water voortdurend onderweg. Door de warmte van de zon verdampt water uit oceanen, meren en rivieren. De waterdamp stijgt op en koelt hoger in de lucht af. Daardoor ontstaan kleine druppeltjes die samen wolken vormen. Uit wolken valt water later weer naar beneden als regen of sneeuw.',
        'Dit noemen we de waterkringloop. De kringloop laat zien hoe water steeds opnieuw over de aarde wordt verplaatst. Maar hij vertelt niet waar het allereerste water vandaan kwam. Daarvoor kijken wetenschappers ook naar de jonge aarde, asteroïden en kometen.'
      ]),
      images: Object.freeze([SPACE_WATER_READING_IMAGES.waterCycle]),
      sourceIds: Object.freeze(['water-cycle', 'water-cycle-diagram'])
    })
  ]),
  questions: Object.freeze([
    Object.freeze({
      id: 'WATER-Q1',
      type: 'multiple_choice',
      prompt: 'Hoe zag de aarde eruit toen zij ongeveer 4,6 miljard jaar geleden ontstond?',
      options: Object.freeze([
        Object.freeze({ id: 'A', text: 'Er waren al grote oceanen en groene bossen.' }),
        Object.freeze({ id: 'B', text: 'De aarde was zeer heet en het oppervlak bestond voor een groot deel uit vloeibaar gesteente.' }),
        Object.freeze({ id: 'C', text: 'De aarde was al afgekoeld en leek op de aarde van nu.' }),
        Object.freeze({ id: 'D', text: 'De aarde was volledig bedekt met sneeuw en ijs.' })
      ]),
      correctOptionId: 'B',
      evidence: 'De eerste alinea van ‘Een jonge, hete aarde’.',
      explanation: 'In de tekst staat dat het in het begin extreem heet was en dat het oppervlak voor een groot deel uit vloeibaar gesteente bestond.',
      distractorRationales: Object.freeze([
        Object.freeze({ optionId: 'A', reason: 'De tekst zegt juist dat er toen nog geen oceanen waren.' }),
        Object.freeze({ optionId: 'C', reason: 'De aarde was in het begin nog niet afgekoeld.' }),
        Object.freeze({ optionId: 'D', reason: 'De tekst beschrijft een zeer hete aarde, niet een aarde vol sneeuw en ijs.' })
      ])
    }),
    Object.freeze({
      id: 'WATER-Q2',
      type: 'multiple_choice',
      prompt: 'Waardoor kon waterdamp later als regen naar beneden vallen?',
      options: Object.freeze([
        Object.freeze({ id: 'A', text: 'De zon verwarmde de waterdamp steeds sterker.' }),
        Object.freeze({ id: 'B', text: 'De oceanen duwden het water rechtstreeks de lucht in.' }),
        Object.freeze({ id: 'C', text: 'De aarde koelde af, waardoor waterdamp veranderde in kleine waterdruppels.' }),
        Object.freeze({ id: 'D', text: 'Asteroïden veranderden de waterdamp in regen.' })
      ]),
      correctOptionId: 'C',
      evidence: 'De eerste alinea van ‘Van waterdamp naar oceanen’.',
      explanation: 'Toen de aarde afkoelde, kon waterdamp condenseren tot kleine druppels. Die vielen later als regen naar beneden.',
      distractorRationales: Object.freeze([
        Object.freeze({ optionId: 'A', reason: 'De tekst noemt juist het afkoelen van de aarde als oorzaak.' }),
        Object.freeze({ optionId: 'B', reason: 'De tekst beschrijft niet dat oceanen het water rechtstreeks de lucht in duwden.' }),
        Object.freeze({ optionId: 'D', reason: 'Asteroïden worden genoemd als mogelijke bron van water, niet als oorzaak van het ontstaan van regen.' })
      ])
    }),
    Object.freeze({
      id: 'WATER-Q3',
      type: 'multiple_choice',
      prompt: 'Waarom denken wetenschappers dat asteroïden een belangrijke hoeveelheid water naar de aarde hebben gebracht?',
      options: Object.freeze([
        Object.freeze({ id: 'A', text: 'Omdat asteroïden wolken maakten die boven de aarde bleven hangen.' }),
        Object.freeze({ id: 'B', text: 'Omdat sommige asteroïden water bevatten en bij inslagen water aan de aarde konden toevoegen.' }),
        Object.freeze({ id: 'C', text: 'Omdat asteroïden het water uit de oceanen naar de aarde terugduwden.' }),
        Object.freeze({ id: 'D', text: 'Omdat asteroïden de waterkringloop op gang brachten.' })
      ]),
      correctOptionId: 'B',
      evidence: 'De twee alinea’s van ‘Water uit asteroïden’.',
      explanation: 'Sommige asteroïden bevatten water. Bij een inslag kon dat water op de jonge aarde terechtkomen. Onderzoek naar waterkenmerken ondersteunt de belangrijke rol van asteroïden.',
      distractorRationales: Object.freeze([
        Object.freeze({ optionId: 'A', reason: 'De tekst noemt asteroïden niet als makers van wolken.' }),
        Object.freeze({ optionId: 'C', reason: 'De tekst beschrijft water dat door inslagen aan de aarde werd toegevoegd.' }),
        Object.freeze({ optionId: 'D', reason: 'De waterkringloop wordt in een later deel van de tekst uitgelegd en is iets anders dan de oorsprong van het water.' })
      ])
    }),
    Object.freeze({
      id: 'WATER-Q4',
      type: 'multiple_choice',
      prompt: 'Wat weten wetenschappers nog niet precies over de rol van kometen?',
      options: Object.freeze([
        Object.freeze({ id: 'A', text: 'Of kometen ijs, stof en gesteente bevatten.' }),
        Object.freeze({ id: 'B', text: 'Of kometen dichter bij de zon kunnen komen.' }),
        Object.freeze({ id: 'C', text: 'Of er rond een komeet een wolk van gas en stof kan ontstaan.' }),
        Object.freeze({ id: 'D', text: 'Hoeveel water kometen precies aan de aarde hebben geleverd.' })
      ]),
      correctOptionId: 'D',
      evidence: 'De tweede alinea van ‘En de kometen?’.',
      explanation: 'De tekst zegt dat kometen mogelijk water hebben geleverd, maar dat de precieze hoeveelheid nog niet duidelijk is.',
      distractorRationales: Object.freeze([
        Object.freeze({ optionId: 'A', reason: 'De tekst legt juist uit waaruit kometen bestaan.' }),
        Object.freeze({ optionId: 'B', reason: 'De tekst beschrijft dat kometen dichter bij de zon komen.' }),
        Object.freeze({ optionId: 'C', reason: 'De tekst noemt de wolk rond een komeet en legt uit hoe die ontstaat.' })
      ])
    }),
    Object.freeze({
      id: 'WATER-Q5',
      type: 'multiple_choice',
      prompt: 'Welke zin geeft de hoofdgedachte van de hele tekst het beste weer?',
      options: Object.freeze([
        Object.freeze({ id: 'A', text: 'Alle water op aarde is ontstaan doordat vulkanen vroeger waterdamp uitstootten.' }),
        Object.freeze({ id: 'B', text: 'Kometen hebben al het water op aarde gebracht.' }),
        Object.freeze({ id: 'C', text: 'Het water op aarde heeft waarschijnlijk verschillende bronnen; wetenschappers onderzoeken nog hoe groot ieders bijdrage was.' }),
        Object.freeze({ id: 'D', text: 'De waterkringloop verklaart precies hoe het eerste water op aarde is gekomen.' })
      ]),
      correctOptionId: 'C',
      evidence: 'De hele tekst, vooral ‘Van waterdamp naar oceanen’ en ‘Water blijft in beweging’.',
      explanation: 'De tekst beschrijft verschillende mogelijke bronnen van water en benadrukt dat wetenschappers de precieze bijdrage nog onderzoeken.',
      distractorRationales: Object.freeze([
        Object.freeze({ optionId: 'A', reason: 'De tekst noemt naast vulkanen ook water uit het materiaal van de aarde en uit inslagen.' }),
        Object.freeze({ optionId: 'B', reason: 'De tekst zegt dat kometen mogelijk hebben bijgedragen, niet dat zij al het water brachten.' }),
        Object.freeze({ optionId: 'D', reason: 'De waterkringloop beschrijft hoe water nu wordt verplaatst, niet waar het eerste water vandaan kwam.' })
      ])
    })
  ]),
  sources: Object.freeze([
    Object.freeze({ id: 'early-earth', title: 'NASA — What was the Earth like right after it formed?', url: 'https://science.nasa.gov/astrobiology/learning-resources/alp/earth-right-after-it-formed/' }),
    Object.freeze({ id: 'water-origin', title: 'NASA — NASA-Led Team Links Comet Water to Earth’s Oceans (3 december 2024)', url: 'https://science.nasa.gov/solar-system/comets/nasa-led-team-links-comet-water-to-earths-oceans/' }),
    Object.freeze({ id: 'ocean-worlds', title: 'NASA — Ocean Worlds: Water in the Solar System and Beyond', url: 'https://science.nasa.gov/solar-system/ocean-worlds/' }),
    Object.freeze({ id: 'comets', title: 'NASA — 10 Things: What’s That Space Rock? (onderdeel over kometen)', url: 'https://science.nasa.gov/solar-system/10-things-whats-that-space-rock/' }),
    Object.freeze({ id: 'water-cycle', title: 'NASA — The Water Cycle', url: 'https://science.nasa.gov/earth/earth-observatory/the-water-cycle/' }),
    Object.freeze({ id: 'water-cycle-diagram', title: 'NASA Scientific Visualization Studio — The Water Cycle (afbeelding)', url: 'https://svs.gsfc.nasa.gov/30580' })
  ])
});
