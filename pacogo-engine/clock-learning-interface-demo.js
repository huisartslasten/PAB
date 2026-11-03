import { createClockLearningInterface, formatDigitalTime } from './clock-learning-interface.js';

const mount = document.querySelector('#clock-interface');
const status = document.querySelector('#status');
const trace = document.querySelector('#trace');

const targetTime = { hour: 8, minute: 35 };
const interactions = [];

const clock = createClockLearningInterface({
  mount,
  targetTime,
  initialTime: { hour: 8, minute: 35 },
  mode: 'analog_to_digital',
  onInteraction: (event) => {
    interactions.push(event);
    status.textContent = `Tijd ingesteld op ${formatDigitalTime(event.payload.time)}.`;
    trace.textContent = JSON.stringify({
      interface: 'clock',
      mode: event.payload.mode,
      event_type: event.event_type,
      interaction_count: interactions.length,
      time: event.payload.time
    }, null, 2);
  }
});

document.querySelector('#correct').addEventListener('click', () => {
  const time = clock.getTime();
  const correct = time.hour === targetTime.hour && time.minute === targetTime.minute;
  status.textContent = correct
    ? 'Goed: analoge en digitale tijd geven dezelfde tijd weer.'
    : `Kijk nog eens goed naar de koppeling met de digitale tijd (${formatDigitalTime(targetTime)}).`;
  clock.lock();
});
