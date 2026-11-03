function formatDigitalTime({ hour, minute }) {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function createClockLearningInterface({
  mount,
  targetTime = null,
  initialTime = { hour: 12, minute: 0 },
  mode = 'analog_to_digital',
  onInteraction = () => {}
}) {
  if (!(mount instanceof HTMLElement)) throw new TypeError('mount must be an HTMLElement');
  if (typeof onInteraction !== 'function') throw new TypeError('onInteraction must be a function');

  let time = { ...initialTime };
  let locked = false;

  const emit = (eventType, payload = {}) => {
    onInteraction({
      event_type: eventType,
      at: new Date().toISOString(),
      payload: { ...payload, time: { ...time }, mode }
    });
  };

  mount.innerHTML = `
    <div class="pacogo-clock" data-mode="${mode}">
      <div class="pacogo-clock__visual">
        <div class="pacogo-clock__face" role="img" aria-label="Analoge klok">
          <span class="pacogo-clock__number n12">12</span><span class="pacogo-clock__number n3">3</span>
          <span class="pacogo-clock__number n6">6</span><span class="pacogo-clock__number n9">9</span>
          <span class="pacogo-clock__hand pacogo-clock__hand--hour"></span>
          <span class="pacogo-clock__hand pacogo-clock__hand--minute"></span>
          <span class="pacogo-clock__pin"></span>
        </div>
        <div class="pacogo-clock__digital" aria-live="polite"></div>
      </div>
      <div class="pacogo-clock__controls">
        <label>Uur <input class="pacogo-clock__hour" type="number" min="0" max="23" step="1"></label>
        <label>Minuten <input class="pacogo-clock__minute" type="number" min="0" max="59" step="1"></label>
        <button class="pacogo-clock__apply" type="button">Zet tijd</button>
      </div>
      <div class="pacogo-clock__mapping" aria-live="polite"></div>
    </div>`;

  const face = mount.querySelector('.pacogo-clock__face');
  const hourHand = mount.querySelector('.pacogo-clock__hand--hour');
  const minuteHand = mount.querySelector('.pacogo-clock__hand--minute');
  const digital = mount.querySelector('.pacogo-clock__digital');
  const hourInput = mount.querySelector('.pacogo-clock__hour');
  const minuteInput = mount.querySelector('.pacogo-clock__minute');
  const apply = mount.querySelector('.pacogo-clock__apply');
  const mapping = mount.querySelector('.pacogo-clock__mapping');

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
  };

  const setTime = ({ hour, minute }, source = 'control') => {
    if (locked) throw new Error('Clock learning interface is locked');
    if (!Number.isInteger(hour) || hour < 0 || hour > 23) throw new RangeError('hour must be an integer from 0 to 23');
    if (!Number.isInteger(minute) || minute < 0 || minute > 59) throw new RangeError('minute must be an integer from 0 to 59');
    time = { hour, minute };
    render();
    emit('time_changed', { source });
  };

  const lock = () => {
    locked = true;
    hourInput.disabled = true;
    minuteInput.disabled = true;
    apply.disabled = true;
    mount.querySelector('.pacogo-clock').dataset.locked = 'true';
  };

  apply.addEventListener('click', () => {
    try {
      setTime({ hour: Number(hourInput.value), minute: Number(minuteInput.value) }, 'digital_input');
    } catch (error) {
      mapping.textContent = error.message;
    }
  });

  render();

  return Object.freeze({
    getTime: () => ({ ...time }),
    setTime,
    lock,
    isLocked: () => locked,
    getTargetTime: () => (targetTime ? { ...targetTime } : null)
  });
}

export { createClockLearningInterface, formatDigitalTime };
