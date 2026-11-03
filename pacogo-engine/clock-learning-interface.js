import { angleFromPointer, minuteFromAngle, hourFromAngle } from './clock-analog-input.js';
import { validateClockTaskDefinition } from './clock-task-contract.js';

function formatDigitalTime({ hour, minute }) {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function assertClockMode(mode) {
  if (!['analog_to_digital', 'digital_to_analog', 'match_representations'].includes(mode)) {
    throw new TypeError('mode must be analog_to_digital, digital_to_analog or match_representations');
  }
}

function responseRepresentationForMode(mode) {
  assertClockMode(mode);
  if (mode === 'analog_to_digital') return 'digital';
  if (mode === 'digital_to_analog') return 'analog';
  return 'choice';
}

function assertTime({ hour, minute }) {
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) throw new RangeError('hour must be an integer from 0 to 23');
  if (!Number.isInteger(minute) || minute < 0 || minute > 59) throw new RangeError('minute must be an integer from 0 to 59');
}

function createClockLearningInterface({
  mount,
  targetTime,
  initialTime = { hour: 12, minute: 0 },
  mode = 'analog_to_digital',
  options = [],
  onInteraction = () => {}
}) {
  if (!(mount instanceof HTMLElement)) throw new TypeError('mount must be an HTMLElement');
  if (!targetTime || typeof targetTime !== 'object') throw new TypeError('targetTime is required');
  if (typeof onInteraction !== 'function') throw new TypeError('onInteraction must be a function');
  assertClockMode(mode);
  assertTime(targetTime);
  if (initialTime !== null) assertTime(initialTime);

  if (mode === 'match_representations') {
    validateClockTaskDefinition({
      task_id: 'CLOCK-INTERFACE-MATCH',
      task_type: 'match_representations',
      target_time: targetTime,
      options
    });
  } else if (options.length) {
    throw new TypeError('options are only accepted for match_representations');
  }

  const target = { ...targetTime };
  const responseRepresentation = responseRepresentationForMode(mode);
  let responseTime = mode === 'digital_to_analog' ? { ...(initialTime || { hour: 12, minute: 0 }) } : null;
  let selectedOptionId = null;
  let locked = false;
  let activeHand = null;

  const emit = (eventType, payload = {}) => {
    onInteraction({
      event_type: eventType,
      at: new Date().toISOString(),
      payload: {
        ...payload,
        time: responseTime ? { ...responseTime } : null,
        target_time: { ...target },
        representation: responseRepresentation,
        mode
      }
    });
  };

  mount.innerHTML = `
    <div class="pacogo-clock" data-mode="${mode}" data-response-representation="${responseRepresentation}">
      <div class="pacogo-clock__header">
        <div><strong>Klok</strong><span class="pacogo-clock__hint"></span></div>
      </div>
      <div class="pacogo-clock__visual">
        <div class="pacogo-clock__face" role="img" aria-label="Analoge klok">
          <span class="pacogo-clock__tick t0"></span><span class="pacogo-clock__tick t1"></span><span class="pacogo-clock__tick t2"></span><span class="pacogo-clock__tick t3"></span>
          <span class="pacogo-clock__number n12">12</span><span class="pacogo-clock__number n3">3</span>
          <span class="pacogo-clock__number n6">6</span><span class="pacogo-clock__number n9">9</span>
          <span class="pacogo-clock__hand pacogo-clock__hand--hour" data-hand="hour" aria-label="Uurwijzer"></span>
          <span class="pacogo-clock__hand pacogo-clock__hand--minute" data-hand="minute" aria-label="Minutenwijzer"></span>
          <span class="pacogo-clock__pin"></span>
        </div>
        <div class="pacogo-clock__digital-card">
          <div class="pacogo-clock__digital-label"></div>
          <div class="pacogo-clock__digital" aria-live="polite"></div>
          <div class="pacogo-clock__options" role="group" aria-label="Kies de bijpassende digitale tijd"></div>
        </div>
      </div>
      <div class="pacogo-clock__controls">
        <label>Uur <input class="pacogo-clock__hour" type="number" min="0" max="23" step="1"></label>
        <span class="pacogo-clock__colon">:</span>
        <label>Minuten <input class="pacogo-clock__minute" type="number" min="0" max="59" step="1"></label>
        <button class="pacogo-clock__apply" type="button">Zet tijd</button>
      </div>
      <div class="pacogo-clock__mapping" aria-live="polite"></div>
    </div>`;

  const root = mount.querySelector('.pacogo-clock');
  const face = mount.querySelector('.pacogo-clock__face');
  const hourHand = mount.querySelector('.pacogo-clock__hand--hour');
  const minuteHand = mount.querySelector('.pacogo-clock__hand--minute');
  const digital = mount.querySelector('.pacogo-clock__digital');
  const digitalLabel = mount.querySelector('.pacogo-clock__digital-label');
  const optionsContainer = mount.querySelector('.pacogo-clock__options');
  const hourInput = mount.querySelector('.pacogo-clock__hour');
  const minuteInput = mount.querySelector('.pacogo-clock__minute');
  const controls = mount.querySelector('.pacogo-clock__controls');
  const apply = mount.querySelector('.pacogo-clock__apply');
  const mapping = mount.querySelector('.pacogo-clock__mapping');
  const hint = mount.querySelector('.pacogo-clock__hint');
  const handElements = [hourHand, minuteHand];

  const getAnalogTime = () => mode === 'digital_to_analog' ? responseTime : target;
  const getDigitalTime = () => mode === 'digital_to_analog' ? target : responseTime;

  const render = () => {
    const analogTime = getAnalogTime();
    const digitalTime = getDigitalTime();
    const minuteAngle = analogTime.minute * 6;
    const hourAngle = (analogTime.hour % 12) * 30 + analogTime.minute * 0.5;

    hourHand.style.transform = `translateX(-50%) rotate(${hourAngle}deg)`;
    minuteHand.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;
    digital.textContent = digitalTime ? formatDigitalTime(digitalTime) : '--:--';
    digital.hidden = mode === 'match_representations';
    digitalLabel.textContent = mode === 'digital_to_analog'
      ? 'Digitale opdracht'
      : mode === 'match_representations' ? 'Kies de passende digitale tijd' : 'Jouw digitale antwoord';
    optionsContainer.hidden = mode !== 'match_representations';
    optionsContainer.replaceChildren();
    if (mode === 'match_representations') {
      for (const option of options) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'pacogo-clock__option';
        button.textContent = formatDigitalTime(option.time);
        button.dataset.optionId = option.option_id;
        button.setAttribute('aria-pressed', String(selectedOptionId === option.option_id));
        button.disabled = locked;
        if (selectedOptionId === option.option_id) button.classList.add('is-selected');
        button.addEventListener('click', () => selectRepresentation(option.option_id));
        optionsContainer.append(button);
      }
    }
    hourInput.value = responseTime ? responseTime.hour : '';
    minuteInput.value = responseTime ? responseTime.minute : '';
    controls.hidden = mode !== 'analog_to_digital';
    face.setAttribute('aria-label', `Analoge klok: ${formatDigitalTime(analogTime)}`);
    face.dataset.interactive = String(mode === 'digital_to_analog');
    hint.textContent = mode === 'analog_to_digital'
      ? 'Lees de analoge klok en voer de digitale tijd in.'
      : mode === 'digital_to_analog'
        ? 'Lees de digitale opdracht en stel de analoge klok in.'
        : 'Bekijk de analoge klok en kies de bijpassende digitale tijd.';
    mapping.textContent = mode === 'analog_to_digital'
      ? 'Bron: analoog  →  Antwoord: digitaal'
      : mode === 'digital_to_analog'
        ? 'Bron: digitaal  →  Antwoord: analoog'
        : 'Herken dezelfde tijd in twee voorstellingen';
  };

  const setTime = ({ hour, minute }, source = 'digital_input') => {
    if (locked) throw new Error('Clock learning interface is locked');
    if (mode !== 'analog_to_digital') throw new Error('Digital input is not the response for this clock task');
    assertTime({ hour, minute });
    responseTime = { hour, minute };
    render();
    emit('time_changed', { source });
  };

  const setAnalogHand = (hand, angle, source = 'analog_hand') => {
    if (locked) throw new Error('Clock learning interface is locked');
    if (mode !== 'digital_to_analog') throw new Error('Analog input is not the response for this clock task');
    if (!['hour', 'minute'].includes(hand)) throw new TypeError('hand must be hour or minute');
    const current = responseTime || { hour: 12, minute: 0 };
    const nextTime = hand === 'minute'
      ? { ...current, minute: minuteFromAngle(angle) }
      : { ...current, hour: hourFromAngle(angle, current.hour) };
    assertTime(nextTime);
    responseTime = nextTime;
    render();
    emit('time_changed', { source, hand });
  };

  const selectRepresentation = (optionId) => {
    if (locked) throw new Error('Clock learning interface is locked');
    if (mode !== 'match_representations') throw new Error('Representation selection is only available for matching tasks');
    const option = options.find((candidate) => candidate.option_id === optionId);
    if (!option) throw new RangeError(`Unknown clock representation option: ${optionId}`);
    selectedOptionId = optionId;
    render();
    emit('representation_selected', { option_id: optionId, selected_time: { ...option.time } });
  };

  const lock = () => {
    locked = true;
    hourInput.disabled = true;
    minuteInput.disabled = true;
    apply.disabled = true;
    root.dataset.locked = 'true';
    optionsContainer.querySelectorAll('button').forEach((button) => { button.disabled = true; });
  };

  apply.addEventListener('click', () => {
    try {
      setTime({ hour: Number(hourInput.value), minute: Number(minuteInput.value) }, 'digital_input');
    } catch (error) {
      mapping.textContent = error.message;
    }
  });

  handElements.forEach((handElement) => {
    handElement.style.touchAction = 'none';
    handElement.addEventListener('pointerdown', (event) => {
      if (locked || mode !== 'digital_to_analog') return;
      activeHand = handElement.dataset.hand;
      handElement.setPointerCapture(event.pointerId);
    });
    handElement.addEventListener('pointermove', (event) => {
      if (!activeHand || locked || mode !== 'digital_to_analog' || !handElement.hasPointerCapture(event.pointerId)) return;
      const angle = angleFromPointer({ clientX: event.clientX, clientY: event.clientY, rect: face.getBoundingClientRect() });
      setAnalogHand(activeHand, angle, 'analog_drag');
    });
    handElement.addEventListener('pointerup', (event) => {
      if (handElement.hasPointerCapture(event.pointerId)) handElement.releasePointerCapture(event.pointerId);
      activeHand = null;
    });
    handElement.addEventListener('pointercancel', () => { activeHand = null; });
  });

  render();

  return Object.freeze({
    getTime: () => (responseTime ? { ...responseTime } : null),
    hasResponse: () => mode === 'match_representations' ? selectedOptionId !== null : responseTime !== null,
    getSelectedOptionId: () => selectedOptionId,
    setTime,
    setAnalogHand,
    selectRepresentation,
    getRepresentation: () => responseRepresentation,
    lock,
    isLocked: () => locked,
    getTargetTime: () => ({ ...target })
  });
}

export { createClockLearningInterface, formatDigitalTime, assertClockMode, responseRepresentationForMode };
