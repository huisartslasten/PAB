import { angleFromPointer, minuteFromAngle, hourFromAngle } from './clock-analog-input.js';

function formatDigitalTime({ hour, minute }) {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function assertRepresentation(representation) {
  if (!['analog', 'digital'].includes(representation)) throw new TypeError('representation must be analog or digital');
}

function createClockLearningInterface({
  mount,
  targetTime = null,
  initialTime = { hour: 12, minute: 0 },
  mode = 'analog_to_digital',
  representation = 'digital',
  onInteraction = () => {}
}) {
  if (!(mount instanceof HTMLElement)) throw new TypeError('mount must be an HTMLElement');
  if (typeof onInteraction !== 'function') throw new TypeError('onInteraction must be a function');
  assertRepresentation(representation);

  let time = { ...initialTime };
  let activeRepresentation = representation;
  let locked = false;
  let activeHand = null;

  const emit = (eventType, payload = {}) => {
    onInteraction({
      event_type: eventType,
      at: new Date().toISOString(),
      payload: { ...payload, time: { ...time }, representation: activeRepresentation, mode }
    });
  };

  mount.innerHTML = `
    <div class="pacogo-clock" data-mode="${mode}" data-representation="${representation}">
      <div class="pacogo-clock__header">
        <div><strong>Klok</strong><span class="pacogo-clock__hint">Koppel de twee voorstellingen van dezelfde tijd.</span></div>
        <div class="pacogo-clock__switch" role="group" aria-label="Kies tijdweergave">
          <button class="pacogo-clock__representation" data-representation="analog" type="button">Analoog</button>
          <button class="pacogo-clock__representation" data-representation="digital" type="button">Digitaal</button>
        </div>
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
          <div class="pacogo-clock__digital-label">Digitale tijd</div>
          <div class="pacogo-clock__digital" aria-live="polite"></div>
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
  const hourInput = mount.querySelector('.pacogo-clock__hour');
  const minuteInput = mount.querySelector('.pacogo-clock__minute');
  const apply = mount.querySelector('.pacogo-clock__apply');
  const mapping = mount.querySelector('.pacogo-clock__mapping');
  const representationButtons = [...mount.querySelectorAll('.pacogo-clock__representation')];
  const handElements = [hourHand, minuteHand];

  const render = () => {
    const minuteAngle = time.minute * 6;
    const hourAngle = (time.hour % 12) * 30 + time.minute * 0.5;
    hourHand.style.transform = `translateX(-50%) rotate(${hourAngle}deg)`;
    minuteHand.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;
    digital.textContent = formatDigitalTime(time);
    hourInput.value = time.hour;
    minuteInput.value = time.minute;
    mapping.textContent = `Analoog ↔ digitaal  ${formatDigitalTime(time)}`;
    face.setAttribute('aria-label', `Analoge klok: ${formatDigitalTime(time)}`);
    root.dataset.representation = activeRepresentation;
    representationButtons.forEach((button) => {
      const selected = button.dataset.representation === activeRepresentation;
      button.setAttribute('aria-pressed', String(selected));
      button.disabled = locked || selected;
    });
  };

  const setTime = ({ hour, minute }, source = 'control') => {
    if (locked) throw new Error('Clock learning interface is locked');
    if (!Number.isInteger(hour) || hour < 0 || hour > 23) throw new RangeError('hour must be an integer from 0 to 23');
    if (!Number.isInteger(minute) || minute < 0 || minute > 59) throw new RangeError('minute must be an integer from 0 to 59');
    time = { hour, minute };
    render();
    emit('time_changed', { source });
  };

  const setRepresentation = (nextRepresentation, source = 'representation_control') => {
    if (locked) throw new Error('Clock learning interface is locked');
    assertRepresentation(nextRepresentation);
    if (nextRepresentation === activeRepresentation) return;
    activeRepresentation = nextRepresentation;
    render();
    emit('representation_changed', { source });
  };

  const setAnalogHand = (hand, angle, source = 'analog_hand') => {
    if (locked) throw new Error('Clock learning interface is locked');
    if (!['hour', 'minute'].includes(hand)) throw new TypeError('hand must be hour or minute');
    const nextTime = hand === 'minute'
      ? { ...time, minute: minuteFromAngle(angle) }
      : { ...time, hour: hourFromAngle(angle, time.hour) };
    setTime(nextTime, source);
  };

  const lock = () => {
    locked = true;
    hourInput.disabled = true;
    minuteInput.disabled = true;
    apply.disabled = true;
    representationButtons.forEach((button) => { button.disabled = true; });
    root.dataset.locked = 'true';
  };

  apply.addEventListener('click', () => {
    try {
      setTime({ hour: Number(hourInput.value), minute: Number(minuteInput.value) }, 'digital_input');
    } catch (error) {
      mapping.textContent = error.message;
    }
  });

  representationButtons.forEach((button) => {
    button.addEventListener('click', () => {
      try { setRepresentation(button.dataset.representation); } catch (error) { mapping.textContent = error.message; }
    });
  });

  handElements.forEach((handElement) => {
    handElement.style.touchAction = 'none';
    handElement.addEventListener('pointerdown', (event) => {
      if (locked) return;
      activeHand = handElement.dataset.hand;
      handElement.setPointerCapture(event.pointerId);
    });
    handElement.addEventListener('pointermove', (event) => {
      if (!activeHand || locked || !handElement.hasPointerCapture(event.pointerId)) return;
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
    getTime: () => ({ ...time }),
    setTime,
    setAnalogHand,
    getRepresentation: () => activeRepresentation,
    setRepresentation,
    lock,
    isLocked: () => locked,
    getTargetTime: () => (targetTime ? { ...targetTime } : null)
  });
}

export { createClockLearningInterface, formatDigitalTime, assertRepresentation };
