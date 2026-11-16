function assertElement(element, label) {
  if (!(element instanceof Element)) throw new TypeError(`${label} must be a DOM Element`);
}

function createNumberLineRenderer({ mount, numberLine, onPositionChange = () => {} }) {
  assertElement(mount, 'mount');
  if (!numberLine) throw new TypeError('numberLine is required');

  const root = document.createElement('div');
  root.className = 'pacogo-number-line';
  root.tabIndex = 0;
  root.setAttribute('role', 'application');
  root.setAttribute('aria-label', `Getallenlijn van ${numberLine.min} tot ${numberLine.max}`);

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 1000 180');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '180');
  svg.setAttribute('aria-hidden', 'true');

  const track = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  track.setAttribute('x1', '60');
  track.setAttribute('y1', '90');
  track.setAttribute('x2', '940');
  track.setAttribute('y2', '90');
  track.setAttribute('stroke', 'currentColor');
  track.setAttribute('stroke-width', '8');
  track.setAttribute('stroke-linecap', 'round');
  svg.append(track);

  const ticks = [];
  for (let value = numberLine.min; value <= numberLine.max + numberLine.step / 100; value += numberLine.step) {
    const position = numberLine.valueToPosition(Math.min(value, numberLine.max));
    const x = 60 + position * 880;
    const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    tick.setAttribute('x1', String(x));
    tick.setAttribute('x2', String(x));
    tick.setAttribute('y1', '72');
    tick.setAttribute('y2', '108');
    tick.setAttribute('stroke', 'currentColor');
    tick.setAttribute('stroke-width', '4');
    svg.append(tick);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', String(x));
    label.setAttribute('y', '138');
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('font-size', '24');
    label.setAttribute('font-weight', '800');
    label.textContent = String(Math.round(value * 100) / 100);
    svg.append(label);
    ticks.push({ value, x });
  }

  const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  marker.setAttribute('r', '17');
  marker.setAttribute('cy', '90');
  marker.setAttribute('fill', 'currentColor');
  marker.setAttribute('cx', '60');
  svg.append(marker);

  const valueReadout = document.createElement('output');
  valueReadout.className = 'pacogo-number-line-value';
  valueReadout.textContent = 'Kies een plek op de getallenlijn';
  valueReadout.setAttribute('aria-live', 'polite');

  root.append(svg, valueReadout);
  mount.replaceChildren(root);

  function positionFromPointer(event) {
    const rect = svg.getBoundingClientRect();
    const raw = (event.clientX - rect.left) / rect.width;
    const normalized = Math.max(0, Math.min(1, (raw * rect.width - 60 * rect.width / 1000) / (880 * rect.width / 1000)));
    return Math.max(0, Math.min(1, normalized));
  }

  function setPosition(position, source = 'programmatic') {
    const snapped = numberLine.snapPosition(position);
    const x = 60 + snapped.position * 880;
    marker.setAttribute('cx', String(x));
    valueReadout.textContent = `Gekozen waarde: ${snapped.value}`;
    onPositionChange({ position: snapped.position, value: snapped.value, source });
    return snapped;
  }

  let dragging = false;
  const start = (event) => {
    dragging = true;
    root.setPointerCapture?.(event.pointerId);
    setPosition(positionFromPointer(event), 'pointerdown');
  };
  const move = (event) => {
    if (!dragging) return;
    setPosition(positionFromPointer(event), 'pointermove');
  };
  const end = (event) => {
    if (!dragging) return;
    dragging = false;
    setPosition(positionFromPointer(event), 'pointerup');
  };

  root.addEventListener('pointerdown', start);
  root.addEventListener('pointermove', move);
  root.addEventListener('pointerup', end);
  root.addEventListener('pointercancel', end);

  root.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const current = Number(marker.getAttribute('cx'));
    const currentPosition = (current - 60) / 880;
    const delta = event.key === 'ArrowRight' ? numberLine.step : -numberLine.step;
    const currentValue = numberLine.positionToValue(currentPosition);
    const nextValue = Math.max(numberLine.min, Math.min(numberLine.max, currentValue + delta));
    setPosition(numberLine.valueToPosition(nextValue), 'keyboard');
  });

  return Object.freeze({
    root,
    svg,
    marker,
    setPosition,
    getPosition: () => numberLine.positionToValue((Number(marker.getAttribute('cx')) - 60) / 880)
  });
}

export { createNumberLineRenderer };
