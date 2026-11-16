import { createClockLearningInterface, formatDigitalTime } from './clock-learning-interface.js';

const mount = document.querySelector('#clock-interface');
const status = document.querySelector('#status');
const trace = document.querySelector('#trace');
const params = new URLSearchParams(window.location.search);
const mode = params.get('mode') === 'digital_to_analog' ? 'digital_to_analog' : 'analog_to_digital';

const targetTime = { hour: 8, minute: 35 };
const interactions = [];

const clock = createClockLearningInterface({
  mount,
  targetTime,
  initialTime: mode === 'digital_to_analog' ? { hour: 8, minute: 0 } : null,
  mode,
  onInteraction: (event) => {
    interactions.push(event);
    const time = event.payload.time;
    status.textContent = time
      ? `Tijd ingesteld op ${formatDigitalTime(time)}.`
      : 'Nog geen antwoord ingesteld.';
    trace.textContent = JSON.stringify({
      interface: 'clock',
      mode: event.payload.mode,
      event_type: event.event_type,
      interaction_count: interactions.length,
      response_representation: event.payload.representation,
      response_time: time
    }, null, 2);
  }
});

document.querySelector('#correct').addEventListener('click', () => {
  const time = clock.getTime();
  if (!time) {
    status.textContent = 'Stel eerst de tijd in.';
    return;
  }
  const correct = time.hour === targetTime.hour && time.minute === targetTime.minute;
  status.textContent = correct
    ? 'Goed: de twee representaties komen overeen.'
    : `Kijk nog eens naar de opdracht: ${formatDigitalTime(targetTime)}.`;
  clock.lock();
});
