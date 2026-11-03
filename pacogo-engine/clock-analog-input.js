function normalizeAngle(angle) {
  if (!Number.isFinite(angle)) throw new TypeError('angle must be finite');
  return ((angle % 360) + 360) % 360;
}

function minuteFromAngle(angle) {
  return Math.round(normalizeAngle(angle) / 6) % 60;
}

function hourFromAngle(angle, currentHour = 12) {
  if (!Number.isInteger(currentHour) || currentHour < 0 || currentHour > 23) throw new RangeError('currentHour must be an integer from 0 to 23');
  const hour12 = Math.round(normalizeAngle(angle) / 30) % 12;
  const period = currentHour >= 12 ? 12 : 0;
  return (hour12 + period) % 24;
}

function angleFromPointer({ clientX, clientY, rect }) {
  if (!rect || !Number.isFinite(clientX) || !Number.isFinite(clientY)) throw new TypeError('pointer coordinates and rect are required');
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const angle = Math.atan2(clientY - centerY, clientX - centerX) * 180 / Math.PI + 90;
  return normalizeAngle(angle);
}

export { normalizeAngle, minuteFromAngle, hourFromAngle, angleFromPointer };
