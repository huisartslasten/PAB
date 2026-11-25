import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';

export const BEE_READING_IMAGES = Object.freeze({
  pollination: Object.freeze({ src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/Bee_pollinating_flower.png/330px-Bee_pollinating_flower.png?utm_campaign=index&utm_content=thumbnail&utm_source=commons.wikimedia.org', alt: 'Een honingbij verzamelt stuifmeel op een bloem.', caption: 'Een honingbij bezoekt een bloem.', author: 'TylerMascola', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bee_pollinating_flower.png', license: 'CC0 1.0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/' }),
  colony: Object.freeze({ src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cc/Honeybees-27527-1.jpg/960px-Honeybees-27527-1.jpg?utm_campaign=index&utm_content=thumbnail&utm_source=commons.wikimedia.org', alt: 'Een groep honingbijen bij de ingang van hun kolonie.', caption: 'Honingbijen bij de ingang van hun kolonie.', author: 'Ken Thomas', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Honeybees-27527-1.jpg', license: 'Publiek domein', licenseUrl: '' }),
  solitary: Object.freeze({ src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Solitary_bee-1.jpg/330px-Solitary_bee-1.jpg', alt: 'Een solitaire bij op een bloem.', caption: 'Een solitaire bij zoekt voedsel op een bloem.', author: 'Alvesgaspar', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Solitary_bee-1.jpg', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/' }),
  beeHotel: Object.freeze({ src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/13/Megachile_aurifrons_using_bee_hotel.jpg/960px-Megachile_aurifrons_using_bee_hotel.jpg?utm_campaign=index&utm_content=thumbnail&utm_source=commons.wikimedia.org', alt: 'Een solitaire bij gebruikt een buisje in een bijenhotel.', caption: 'Een solitaire bij gebruikt een nestopening in een bijenhotel.', author: 'Heath Hunter', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Megachile_aurifrons_using_bee_hotel.jpg', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' })
});

export const BEE_READING_TEXT = Object.freeze([
  { heading: 'Een wereld die afhankelijk is van kleine insecten', paragraphs: [
    'Op een warme lentedag vliegen duizenden bijen van bloem naar bloem. Ze lijken vooral bezig met het verzamelen van voedsel, maar ondertussen verrichten ze werk waarvan mensen en dieren afhankelijk zijn. Bijen spelen namelijk een belangrijke rol bij de voortplanting van veel plantensoorten. Zonder hun hulp zouden sommige planten veel minder vruchten en zaden produceren.',
    'Toch staan bijen niet altijd in de belangstelling. Veel mensen denken bij bijen vooral aan honing of aan de pijnlijke steek die ze kunnen geven. Maar honing maken is slechts een klein onderdeel van het verhaal. De belangrijkste bijdrage van veel bijensoorten is iets wat je bijna niet ziet: bestuiving.'
  ], images: [BEE_READING_IMAGES.pollination] },
  { heading: 'Hoe een bloem verandert in een vrucht', paragraphs: [
    'Een bloem bevat verschillende onderdelen die nodig zijn voor de voortplanting van een plant. Een daarvan is de stamper. Om zaden te kunnen vormen, moet stuifmeel op de stempel van de stamper terechtkomen.',
    'Wanneer een bij een bloem bezoekt, blijft stuifmeel aan haar harige lichaam kleven. Als ze daarna naar een andere bloem vliegt, kan een deel van dat stuifmeel daar terechtkomen. Dit proces heet bestuiving. Na een geslaagde bestuiving kan bevruchting plaatsvinden en kan de plant zaden vormen. Bij veel planten groeit een deel van de bloem vervolgens uit tot een vrucht.',
    'Dit verklaart waarom bijen ook voor de landbouw belangrijk zijn. Appels, peren, aardbeien en verschillende andere gewassen hebben insecten nodig voor een goede bestuiving of profiteren daarvan. Niet iedere plant heeft daarvoor bijen nodig, maar voor veel voedselgewassen zijn ze belangrijke helpers.'
  ], images: [] },
  { heading: 'Niet iedere bij leeft hetzelfde', paragraphs: [
    'Als mensen aan bijen denken, stellen ze zich vaak een honingbij voor. Honingbijen leven in grote groepen die kolonies worden genoemd. In zo’n kolonie heeft iedere bij een bepaalde functie.',
    'De koningin legt de eitjes. De werksters verzorgen de jonge larven, bouwen en onderhouden de raten en verzamelen voedsel. De mannelijke bijen, de darren, hebben als belangrijkste taak om met een jonge koningin te paren.',
    'Maar er bestaan ook veel verschillende soorten wilde bijen. Veel daarvan leven niet in grote kolonies. Ze leven alleen en worden daarom solitaire bijen genoemd. Sommige graven gangen in de grond, terwijl andere holle plantenstengels of kleine openingen in hout gebruiken als nestplaats.',
    'Dat verschil is belangrijk. Wie alleen honingbijen probeert te beschermen, helpt niet automatisch alle bijensoorten. Verschillende soorten hebben namelijk verschillende leefgebieden en voedselbronnen nodig.'
  ], images: [BEE_READING_IMAGES.colony, BEE_READING_IMAGES.solitary] },
  { heading: 'Een bijzondere manier van communiceren', paragraphs: [
    'Honingbijen kunnen elkaar vertellen waar voedsel te vinden is. Een werkster die een goede plek met bloemen heeft ontdekt, keert terug naar de kolonie. Daar voert ze een beweging uit die de bijendans wordt genoemd.',
    'Door de richting en de duur van deze beweging kunnen andere bijen informatie krijgen over de richting en afstand van de voedselbron. De dans is dus niet zomaar een beweging. Het is een vorm van communicatie waarmee bijen informatie over hun omgeving doorgeven.',
    'Onderzoekers hebben ontdekt dat deze communicatie veel ingewikkelder is dan mensen vroeger dachten. Bijen kunnen informatie verwerken en hun gedrag aanpassen aan de omstandigheden. Hoewel hun hersenen heel klein zijn, kunnen ze dus opvallend ingewikkelde taken uitvoeren.'
  ], images: [] },
  { heading: 'Waarom het steeds moeilijker wordt voor bijen', paragraphs: [
    'Bijen hebben bloemen nodig om voldoende voedsel te verzamelen. Maar op sommige plaatsen verdwijnen bloemrijke gebieden. Weilanden worden bebouwd, bermen worden vaak gemaaid en tuinen bevatten soms vooral planten die weinig voedsel bieden aan insecten.',
    'Ook bestrijdingsmiddelen kunnen een probleem vormen. Sommige middelen zijn schadelijk voor insecten. Daarnaast kunnen ziekten en parasieten bijen verzwakken. Vaak spelen meerdere factoren tegelijk een rol. Daardoor is het niet altijd eenvoudig om één oorzaak aan te wijzen wanneer een bijensoort achteruitgaat.',
    'Het verdwijnen van bijen heeft gevolgen die verder gaan dan alleen de insecten zelf. Wanneer minder bloemen worden bestoven, kunnen sommige planten zich moeilijker voortplanten. Dat kan ook gevolgen hebben voor dieren die afhankelijk zijn van die planten, bijvoorbeeld omdat ze er voedsel of beschutting vinden.'
  ], images: [] },
  { heading: 'Kunnen mensen bijen helpen?', paragraphs: [
    'Gelukkig zijn er manieren om de leefomgeving van bijen te verbeteren. Een tuin met verschillende soorten bloemen biedt bijvoorbeeld gedurende een langere periode voedsel. Vooral planten die op verschillende momenten bloeien, zijn waardevol. Zo is er niet alleen in het voorjaar, maar ook later in het jaar nectar en stuifmeel beschikbaar.',
    'Ook wilde hoekjes in een tuin kunnen helpen. Niet iedere plek hoeft strak gemaaid of opgeruimd te zijn. Sommige wilde bijen hebben kale stukjes grond nodig om een nest te maken. Andere soorten gebruiken holle stengels of kleine openingen in hout.',
    'Een bijenhotel kan voor bepaalde solitaire bijensoorten een geschikte nestplaats bieden. Maar zo’n hotel is geen oplossing voor alle bijen. Het helpt alleen soorten die zulke nestopeningen gebruiken. Bovendien hebben bijen ook voldoende bloemen en een geschikte omgeving nodig.'
  ], images: [BEE_READING_IMAGES.beeHotel] },
  { heading: 'Klein, maar van grote betekenis', paragraphs: [
    'Bijen zijn dus veel meer dan insecten die honing maken of kunnen steken. Ze helpen planten zich voort te planten, ondersteunen de landbouw en dragen bij aan de biodiversiteit: de verscheidenheid aan planten, dieren en andere levensvormen in een gebied.',
    'Hun bescherming vraagt daarom meer dan het plaatsen van een bijenhotel. Er moet voldoende voedsel zijn, er moeten geschikte nestplaatsen bestaan en schadelijke invloeden moeten waar mogelijk worden beperkt.',
    'De volgende keer dat je een bij op een bloem ziet landen, kijk dan eens goed. Terwijl het insect voedsel verzamelt, helpt het tegelijkertijd de natuur om zich te vernieuwen. Een kleine bezoeker kan zo een grote invloed hebben op zijn omgeving.'
  ], images: [] }
].map(section => Object.freeze({ ...section, paragraphs: Object.freeze(section.paragraphs), images: Object.freeze(section.images) })));

export const BEE_READING_QUESTIONS = Object.freeze([
  { id: 'Q1', type: 'multiple_choice', prompt: 'Welke taak heeft een werksterbij in een honingbijenkolonie?', options: [['A','Ze legt de eitjes waaruit nieuwe bijen ontstaan.'],['B','Ze verzorgt larven, onderhoudt de raten en verzamelt voedsel.'],['C','Ze bepaalt waar de kolonie een nieuw nest bouwt.'],['D','Ze paart met de jonge koningin.']], correctOptionId: 'B', evidence: 'De alinea over de koningin, werksters en darren in ‘Niet iedere bij leeft hetzelfde’.', explanation: 'De tekst noemt drie taken van werksters: larven verzorgen, raten onderhouden en voedsel verzamelen.', distractorRationales: [['A','De koningin legt de eitjes.'],['C','Deze taak wordt niet aan werksters toegeschreven in de tekst.'],['D','De belangrijkste taak van darren is paren met een jonge koningin.']] },
  { id: 'Q2', type: 'multiple_choice', prompt: 'Wat betekent het woord ‘solitaire’ in de tekst?', options: [['A','Bijen die in grote groepen samenwerken.'],['B','Bijen die uitsluitend honing verzamelen.'],['C','Bijen die zelfstandig leven.'],['D','Bijen die geen nest bouwen.']], correctOptionId: 'C', evidence: 'De alinea waarin staat dat veel wilde bijen niet in grote kolonies leven, maar alleen.', explanation: 'De tekst legt uit dat solitaire bijen alleen leven en dus niet in grote kolonies wonen.', distractorRationales: [['A','Dat beschrijft juist het leven van honingbijen in kolonies.'],['B','De tekst zegt niet dat solitaire bijen uitsluitend honing verzamelen.'],['D','De tekst noemt verschillende nestplaatsen voor solitaire bijen.']] },
  { id: 'Q3', type: 'multiple_choice', prompt: 'Waarom kan een plant na bestuiving vruchten en zaden vormen?', options: [['A','Omdat de bij stuifmeel verzamelt en daardoor de plant voldoende voedsel krijgt.'],['B','Omdat stuifmeel op de stempel terechtkomt, waarna bevruchting kan plaatsvinden.'],['C','Omdat de bij met haar poten de bloem verandert in een vrucht.'],['D','Omdat de bij de zaden van de ene bloem naar de andere bloem brengt.']], correctOptionId: 'B', evidence: 'De eerste alinea: stuifmeel moet op de stempel van de stamper terechtkomen. De tweede alinea beschrijft bevruchting, zaadvorming en vruchtvorming.', explanation: 'Stuifmeel komt op de stempel terecht. Daarna kan bevruchting plaatsvinden en kan de plant zaden vormen; bij veel planten groeit een deel van de bloem uit tot een vrucht.', distractorRationales: [['A','Stuifmeel verzamelen geeft de plant niet rechtstreeks voedsel.'],['C','De bij verandert de bloem niet met haar poten in een vrucht.'],['D','De tekst beschrijft het verplaatsen van stuifmeel, niet van zaden.']] },
  { id: 'Q4', type: 'multiple_choice', prompt: 'Wat is volgens de tekst een belangrijk verschil tussen honingbijen en solitaire bijen?', options: [['A','Honingbijen verzamelen voedsel, terwijl solitaire bijen alleen planten bestuiven.'],['B','Honingbijen leven in kolonies, terwijl veel solitaire bijen zelfstandig leven.'],['C','Honingbijen bouwen nesten in hout, terwijl solitaire bijen altijd onder de grond leven.'],['D','Honingbijen hebben een koningin, terwijl solitaire bijen geen voedsel verzamelen.']], correctOptionId: 'B', evidence: 'De hele alinea ‘Niet iedere bij leeft hetzelfde’.', explanation: 'De tekst contrasteert honingbijen die in kolonies leven met veel wilde bijen die zelfstandig leven.', distractorRationales: [['A','De tekst zegt niet dat solitaire bijen alleen bestuiven; ook zij verzamelen voedsel.'],['C','De tekst noemt meerdere nestplaatsen voor solitaire bijen en zegt niet dat honingbijen in hout nestelen.'],['D','De tekst zegt niet dat solitaire bijen geen voedsel verzamelen.']] },
  { id: 'Q5', type: 'multiple_choice', prompt: 'Waarom is het plaatsen van een bijenhotel niet voldoende om alle bijensoorten te beschermen?', options: [['A','Omdat bijenhotels alleen geschikt zijn voor honingbijen.'],['B','Omdat bijenhotels geen voedsel bevatten en bijen daarom niet aantrekken.'],['C','Omdat verschillende bijensoorten verschillende nestplaatsen en voedselbronnen nodig hebben.'],['D','Omdat bijen liever in bloemen wonen dan in een bijenhotel.']], correctOptionId: 'C', evidence: 'De alinea’s over solitaire bijen en over de beperkte werking van een bijenhotel.', explanation: 'Verschillende soorten hebben verschillende leefgebieden, voedselbronnen en nestplaatsen nodig. Een bijenhotel helpt alleen soorten die zulke nestopeningen gebruiken.', distractorRationales: [['A','De tekst zegt juist dat een bijenhotel bepaalde solitaire bijensoorten kan helpen.'],['B','De tekst noemt bloemen als voedselbron, maar zegt niet dat een bijenhotel geen bijen aantrekt.'],['D','De tekst zegt niet dat bijen in bloemen wonen.']] },
  { id: 'Q6', type: 'multiple_choice', prompt: 'Welke situatie kan volgens de tekst ontstaan wanneer er steeds minder bloemrijke gebieden zijn?', options: [['A','Bijen krijgen minder mogelijkheden om voedsel te verzamelen.'],['B','Bijen veranderen hun nest automatisch naar een bijenhotel.'],['C','Planten gaan meer vruchten produceren.'],['D','Alle wilde bijen verhuizen naar landbouwgebieden.']], correctOptionId: 'A', evidence: 'De eerste alinea van ‘Waarom het steeds moeilijker wordt voor bijen’ en de uitleg over bloemen als voedselbron.', explanation: 'De tekst zegt dat bijen bloemen nodig hebben om voldoende voedsel te verzamelen. Minder bloemrijke gebieden betekenen dus minder mogelijkheden om voedsel te vinden.', distractorRationales: [['B','De tekst zegt niet dat bijen automatisch naar bijenhotels verhuizen.'],['C','De tekst beschrijft juist dat minder bestuiving de voortplanting van sommige planten moeilijker kan maken.'],['D','De tekst zegt niet dat alle wilde bijen naar landbouwgebieden verhuizen.']] },
  { id: 'Q7', type: 'multiple_choice', prompt: 'Welke uitspraak geeft de hoofdgedachte van de hele tekst het beste weer?', options: [['A','Honingbijen zijn de belangrijkste bijensoort omdat ze honing maken.'],['B','Bijen zijn belangrijk voor planten, landbouw en natuur en hebben bescherming nodig.'],['C','Wilde bijen zijn gevaarlijker dan honingbijen omdat ze op verschillende plaatsen nestelen.'],['D','Mensen moeten vooral bijenhotels plaatsen om de natuur te beschermen.']], correctOptionId: 'B', evidence: 'De gehele tekst, in het bijzonder de eerste en laatste alinea.', explanation: 'Deze uitspraak vat samen waarom bijen belangrijk zijn en waarom hun leefomgeving beschermd moet worden.', distractorRationales: [['A','De tekst benadrukt juist dat honing maken maar een klein deel van het verhaal is.'],['C','De tekst zegt nergens dat wilde bijen gevaarlijker zijn.'],['D','De tekst legt uit dat een bijenhotel alleen niet voldoende is.']] },
  { id: 'Q8', type: 'multiple_choice', prompt: 'Waarom noemt de schrijver in het begin honing en de pijnlijke steek van bijen?', options: [['A','Om te bewijzen dat bijen gevaarlijke insecten zijn.'],['B','Om te laten zien dat honing het belangrijkste product van bijen is.'],['C','Om aan te sluiten bij wat mensen vaak al over bijen weten en vervolgens een minder bekend aspect uit te leggen.'],['D','Om uit te leggen waarom mensen bijen uit hun tuin moeten verwijderen.']], correctOptionId: 'C', evidence: 'De tweede alinea van ‘Een wereld die afhankelijk is van kleine insecten’.', explanation: 'De schrijver begint met bekende ideeën over bijen en gebruikt die als opstap naar de minder zichtbare rol van bestuiving.', distractorRationales: [['A','De tekst wil niet bewijzen dat bijen gevaarlijk zijn.'],['B','De tekst zegt juist dat honing maken maar een klein onderdeel van het verhaal is.'],['D','De tekst moedigt bescherming van bijen aan en zegt niet dat ze uit tuinen moeten verdwijnen.']] },
  { id: 'Q9', type: 'open', prompt: 'Welke drie zaken zijn volgens de tekst belangrijk om bijen te beschermen? Leg bij iedere zaak kort uit waarom deze belangrijk is.', evidence: 'De alinea’s over bedreigingen, bescherming en de slotconclusie.', sampleAnswer: 'Er moeten voldoende bloemen zijn, zodat bijen nectar en stuifmeel kunnen verzamelen. Er moeten geschikte nestplaatsen zijn, omdat verschillende bijensoorten op verschillende plekken nestelen. Ook moeten schadelijke invloeden, zoals schadelijke bestrijdingsmiddelen, ziekten en parasieten, waar mogelijk worden beperkt.', criteria: ['Ik noemde voldoende bloemen of voedselbronnen en legde uit dat bijen nectar en stuifmeel nodig hebben.','Ik noemde geschikte nestplaatsen en legde uit dat verschillende soorten verschillende plekken gebruiken.','Ik noemde het beperken van schadelijke invloeden, zoals bestrijdingsmiddelen, ziekten of parasieten.'] },
  { id: 'Q10', type: 'open', prompt: 'Iemand zegt: “Als we in iedere tuin een bijenhotel plaatsen, hoeven we verder niets meer te doen om bijen te beschermen.” Ben je het eens of oneens met deze uitspraak? Gebruik informatie uit de tekst om je antwoord te onderbouwen.', evidence: 'De alinea over bijenhotels en de slotconclusie.', sampleAnswer: 'Ik ben het oneens met de uitspraak. Een bijenhotel helpt alleen bepaalde solitaire bijensoorten die zulke nestopeningen gebruiken. Bijen hebben daarnaast voldoende bloemen en voedsel nodig, geschikte nestplaatsen en een omgeving waarin schadelijke invloeden zo veel mogelijk worden beperkt.', criteria: ['Ik maakte duidelijk dat ik het eens of oneens ben met de uitspraak.','Ik legde uit dat een bijenhotel maar voor bepaalde bijensoorten geschikt is.','Ik noemde minstens één andere noodzakelijke maatregel, zoals voldoende bloemen, geschikte nestplaatsen of het beperken van schadelijke invloeden.'] }
].map(question => Object.freeze({
  ...question,
  options: question.options ? Object.freeze(question.options.map(([id, text]) => Object.freeze({ id, text }))) : undefined,
  distractorRationales: question.distractorRationales ? Object.freeze(question.distractorRationales.map(([optionId, reason]) => Object.freeze({ optionId, reason }))) : undefined,
  criteria: question.criteria ? Object.freeze(question.criteria) : undefined
})));

function element(documentRef, tag, className = '', text = '') {
  const node = documentRef.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}
function actionButton(documentRef, text, className, onClick) {
  const node = element(documentRef, 'button', className, text);
  node.type = 'button';
  node.addEventListener('click', onClick);
  return node;
}
function imageFigure(documentRef, image) {
  const figure = element(documentRef, 'figure', 'reading-comprehension-figure');
  const img = element(documentRef, 'img');
  img.src = image.src;
  img.alt = image.alt;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.addEventListener('error', () => {
    img.hidden = true;
    figure.classList.add('reading-comprehension-figure--unavailable');
    figure.appendChild(element(documentRef, 'span', 'reading-comprehension-image-fallback', 'Afbeelding tijdelijk niet beschikbaar.'));
  }, { once: true });
  const caption = element(documentRef, 'figcaption', '', image.caption);
  const credit = element(documentRef, 'span', 'reading-comprehension-image-credit', 'Foto: ' + image.author + ' · ');
  const source = element(documentRef, 'a', '', 'bron');
  source.href = image.sourceUrl;
  source.target = '_blank';
  source.rel = 'noopener noreferrer';
  credit.append(source, ' · ');
  if (image.licenseUrl) {
    const license = element(documentRef, 'a', '', image.license);
    license.href = image.licenseUrl;
    license.target = '_blank';
    license.rel = 'noopener noreferrer';
    credit.append(license);
  } else credit.append(image.license);
  caption.appendChild(credit);
  figure.append(img, caption);
  return figure;
}
function renderText(documentRef) {
  const section = element(documentRef, 'section', 'reading-comprehension-card reading-comprehension-text');
  section.id = 'readingText';
  section.append(
    element(documentRef, 'h2', '', 'Bijen: belangrijke werkers van onze natuur'),
    element(documentRef, 'p', 'reading-comprehension-text-intro', 'Lees de tekst rustig door. Je mag tijdens het beantwoorden van de vragen steeds teruglezen.')
  );
  BEE_READING_TEXT.forEach(textSection => {
    const block = element(documentRef, 'section', 'reading-comprehension-text-section');
    block.appendChild(element(documentRef, 'h3', '', textSection.heading));
    textSection.paragraphs.forEach(paragraph => block.appendChild(element(documentRef, 'p', '', paragraph)));
    if (textSection.images.length) {
      const row = element(documentRef, 'div', 'reading-comprehension-image-row');
      textSection.images.forEach(image => row.appendChild(imageFigure(documentRef, image)));
      block.appendChild(row);
    }
    section.appendChild(block);
  });
  return section;
}
function renderProgress(documentRef, host, index, total) {
  host.replaceChildren();
  const label = element(documentRef, 'div', 'reading-comprehension-progress-label');
  label.append(element(documentRef, 'strong', '', 'Vraag ' + (index + 1) + ' van ' + total), element(documentRef, 'span', '', Math.round(((index + 1) / total) * 100) + '%'));
  const track = element(documentRef, 'div', 'reading-comprehension-progress-track');
  const bar = element(documentRef, 'span', 'reading-comprehension-progress-bar');
  bar.style.width = ((index + 1) / total) * 100 + '%';
  track.appendChild(bar);
  host.append(label, track);
}
function distractorDetails(documentRef, question) {
  const details = element(documentRef, 'details', 'reading-comprehension-distractors');
  details.appendChild(element(documentRef, 'summary', '', 'Waarom kloppen de andere antwoorden niet?'));
  const list = element(documentRef, 'ul');
  question.distractorRationales.forEach(item => list.appendChild(element(documentRef, 'li', '', item.optionId + '. ' + item.reason)));
  details.appendChild(list);
  return details;
}

export function createReadingComprehensionRuntime({ templateMount, context = {}, documentRef = document, navigate } = {}) {
  if (!templateMount || typeof navigate !== 'function') throw new TypeError('Reading comprehension runtime requires a template mount and navigation owner.');
  const student = String(context?.student || '');
  const content = element(documentRef, 'div', 'reading-comprehension');
  const intro = element(documentRef, 'section', 'reading-comprehension-card reading-comprehension-intro');
  intro.append(element(documentRef, 'p', 'reading-comprehension-kicker', 'PacoGO · Nederlands · Groep 8'), element(documentRef, 'p', '', 'Lees de tekst en beantwoord daarna de tien vragen. Je kunt de tekst altijd opnieuw bekijken.'));
  const textSection = renderText(documentRef);
  const questionSection = element(documentRef, 'section', 'reading-comprehension-card reading-comprehension-questions');
  questionSection.id = 'readingQuestions';
  const progress = element(documentRef, 'div', 'reading-comprehension-progress');
  const questionHost = element(documentRef, 'div', 'reading-comprehension-question-host');
  questionSection.append(element(documentRef, 'h2', '', 'Vragen'), progress, questionHost);
  const notice = element(documentRef, 'p', 'reading-comprehension-notice', 'Dit is een niet-formele oefening. Je antwoorden worden niet opgeslagen en tellen niet mee voor een toets, formele beoordeling of mastery-beslissing.');
  content.append(intro, textSection, questionSection, notice);

  let currentIndex = 0;
  let multipleChoiceCorrect = 0;
  let openSelfCheckPoints = 0;
  let currentOpenPoints = 0;

  function showCompletion() {
    questionHost.replaceChildren();
    progress.replaceChildren();
    const result = element(documentRef, 'section', 'reading-comprehension-results');
    result.id = 'readingResults';
    result.append(
      element(documentRef, 'h3', '', 'Oefening afgerond'),
      element(documentRef, 'p', '', 'Meerkeuzevragen: ' + multipleChoiceCorrect + ' van 8 goed.'),
      element(documentRef, 'p', '', 'Open vragen: ' + openSelfCheckPoints + ' van 6 punten bij je eigen controle.'),
      element(documentRef, 'p', 'reading-comprehension-results-note', 'De punten bij de open vragen zijn door jou zelf gecontroleerd. Dit overzicht is geen formele toetsuitslag.'),
      actionButton(documentRef, 'Opnieuw oefenen', 'success', reset),
      actionButton(documentRef, 'Terug naar de tekst', 'secondary', () => textSection.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    );
    questionHost.appendChild(result);
  }

  function renderQuestion() {
    if (currentIndex >= BEE_READING_QUESTIONS.length) return showCompletion();
    const question = BEE_READING_QUESTIONS[currentIndex];
    questionHost.replaceChildren();
    renderProgress(documentRef, progress, currentIndex, BEE_READING_QUESTIONS.length);
    const card = element(documentRef, 'article', 'reading-comprehension-question');
    card.dataset.questionId = question.id;
    const meta = element(documentRef, 'p', 'reading-comprehension-question-meta', question.type === 'open' ? 'Open vraag' : 'Meerkeuze');
    const prompt = element(documentRef, 'h3', '', question.prompt);
    card.append(meta, prompt);

    if (question.type === 'multiple_choice') {
      let selected = '';
      const fieldset = element(documentRef, 'fieldset', 'reading-comprehension-options');
      fieldset.appendChild(element(documentRef, 'legend', 'reading-comprehension-visually-hidden', 'Kies één antwoord'));
      question.options.forEach(option => {
        const label = element(documentRef, 'label', 'reading-comprehension-option');
        const input = element(documentRef, 'input');
        input.type = 'radio';
        input.name = 'reading-option';
        input.value = option.id;
        input.addEventListener('change', () => { selected = option.id; });
        label.append(input, element(documentRef, 'span', '', option.id + '. ' + option.text));
        fieldset.appendChild(label);
      });
      const check = actionButton(documentRef, 'Controleren', 'success', () => {
        if (!selected) return;
        const correct = selected === question.correctOptionId;
        if (correct) multipleChoiceCorrect += 1;
        card.replaceChildren(meta, prompt);
        const feedback = element(documentRef, 'section', 'reading-comprehension-feedback ' + (correct ? 'is-correct' : 'is-incorrect'));
        feedback.dataset.feedbackState = correct ? 'correct' : 'incorrect';
        const correctOption = question.options.find(option => option.id === question.correctOptionId);
        feedback.append(
          element(documentRef, 'strong', '', correct ? 'Goed gedaan!' : 'Nog niet goed.'),
          element(documentRef, 'p', '', question.explanation),
          element(documentRef, 'p', 'reading-comprehension-evidence', 'Tekstbewijs: ' + question.evidence),
          element(documentRef, 'p', '', 'Juiste antwoord: ' + correctOption.id + '. ' + correctOption.text),
          distractorDetails(documentRef, question)
        );
        card.appendChild(feedback);
        card.appendChild(actionButton(documentRef, currentIndex === BEE_READING_QUESTIONS.length - 1 ? 'Bekijk resultaat' : 'Volgende vraag', 'success', () => { currentIndex += 1; renderQuestion(); }));
      });
      check.disabled = true;
      fieldset.addEventListener('change', () => { check.disabled = !selected; });
      card.append(fieldset, check, actionButton(documentRef, 'Terug naar tekst', 'secondary', () => textSection.scrollIntoView({ behavior: 'smooth', block: 'start' })));
    } else {
      currentOpenPoints = 0;
      const label = element(documentRef, 'label', 'reading-comprehension-answer-label', 'Schrijf je antwoord');
      const textarea = element(documentRef, 'textarea', 'reading-comprehension-answer');
      textarea.rows = 4;
      textarea.id = 'reading-open-answer';
      label.htmlFor = textarea.id;
      textarea.setAttribute('aria-label', 'Schrijf je antwoord');
      const reveal = actionButton(documentRef, 'Vergelijk met voorbeeldantwoord', 'success', () => {
        card.replaceChildren(meta, prompt, label, textarea);
        const model = element(documentRef, 'section', 'reading-comprehension-model-answer');
        model.append(
          element(documentRef, 'h4', '', 'Voorbeeldantwoord'),
          element(documentRef, 'p', '', question.sampleAnswer),
          element(documentRef, 'p', 'reading-comprehension-self-check-instruction', 'Vergelijk je antwoord met de drie onderdelen. Vink aan welke onderdelen je zelf hebt genoemd.')
        );
        const checklist = element(documentRef, 'div', 'reading-comprehension-self-check');
        question.criteria.forEach(criterion => {
          const criterionLabel = element(documentRef, 'label', 'reading-comprehension-criterion');
          const checkbox = element(documentRef, 'input');
          checkbox.type = 'checkbox';
          checkbox.addEventListener('change', () => {
            currentOpenPoints = card.querySelectorAll('.reading-comprehension-criterion input:checked').length;
          });
          criterionLabel.append(checkbox, element(documentRef, 'span', '', criterion));
          checklist.appendChild(criterionLabel);
        });
        model.append(checklist, element(documentRef, 'p', 'reading-comprehension-self-check-note', 'Een antwoord mag anders geformuleerd zijn dan het voorbeeld, zolang de inhoud klopt.'));
        card.appendChild(model);
        card.appendChild(actionButton(documentRef, currentIndex === BEE_READING_QUESTIONS.length - 1 ? 'Bekijk resultaat' : 'Volgende vraag', 'success', () => {
          openSelfCheckPoints += currentOpenPoints;
          currentOpenPoints = 0;
          currentIndex += 1;
          renderQuestion();
        }));
        card.appendChild(actionButton(documentRef, 'Terug naar tekst', 'secondary', () => textSection.scrollIntoView({ behavior: 'smooth', block: 'start' })));
      });
      reveal.disabled = true;
      textarea.addEventListener('input', () => { reveal.disabled = !textarea.value.trim(); });
      card.append(label, textarea, element(documentRef, 'p', 'reading-comprehension-open-note', 'Je eigen antwoord wordt niet automatisch beoordeeld.'), reveal, actionButton(documentRef, 'Terug naar tekst', 'secondary', () => textSection.scrollIntoView({ behavior: 'smooth', block: 'start' })));
    }
    questionHost.appendChild(card);
  }

  function reset() {
    currentIndex = 0;
    multipleChoiceCorrect = 0;
    openSelfCheckPoints = 0;
    currentOpenPoints = 0;
    renderQuestion();
  }

  const navigation = createPacoNavigation({ student, includeAccount: false, includeManagement: false, navigate });
  mountPacoPageTemplate({
    mount: templateMount,
    greeting: student ? 'Hoi, ' + student + '!' : 'Welkom bij PacoGO',
    navigation,
    title: 'Begrijpend lezen',
    icon: '📖',
    subtitle: 'Groep 8 · Bijen',
    content,
    layoutMode: 'practice'
  });
  renderQuestion();
  return Object.freeze({ reset, get currentIndex() { return currentIndex; }, get score() { return { multipleChoiceCorrect, openSelfCheckPoints }; } });
}
