function assertFiniteNumber(value, label) {
  if (!Number.isFinite(value)) throw new TypeError(`${label} must be a finite number`);
}

function createNumberLine({ min = 0, max = 10, step = 1, orientation = 'horizontal' } = {}) {
  assertFiniteNumber(min, 'min');
  assertFiniteNumber(max, 'max');
  assertFiniteNumber(step, 'step');
  if (max <= min) throw new RangeError('max must be greater than min');
  if (step <= 0) throw new RangeError('step must be greater than zero');
  if (!['horizontal', 'vertical'].includes(orientation)) throw new RangeError('unsupported orientation');

  const span = max - min;

  return Object.freeze({
    type: 'number_line',
    min,
    max,
    step,
    orientation,
    valueToPosition(value) {
      assertFiniteNumber(value, 'value');
      if (value < min || value > max) throw new RangeError('value is outside number-line range');
      return (value - min) / span;
    },
    positionToValue(position) {
      assertFiniteNumber(position, 'position');
      if (position < 0 || position > 1) throw new RangeError('position must be between 0 and 1');
      return min + position * span;
    },
    snapPosition(position) {
      const raw = this.positionToValue(position);
      const snapped = min + Math.round((raw - min) / step) * step;
      const bounded = Math.max(min, Math.min(max, snapped));
      return Object.freeze({ value: bounded, position: this.valueToPosition(bounded) });
    }
  });
}

function evaluatePlacement({ numberLine, targetValue, submittedPosition, tolerance = 0 }) {
  if (!numberLine) throw new TypeError('numberLine is required');
  assertFiniteNumber(targetValue, 'targetValue');
  assertFiniteNumber(submittedPosition, 'submittedPosition');
  assertFiniteNumber(tolerance, 'tolerance');
  const expectedPosition = numberLine.valueToPosition(targetValue);
  const submittedValue = numberLine.positionToValue(submittedPosition);
  const absoluteError = Math.abs(submittedValue - targetValue);
  const correct = absoluteError <= tolerance;

  return Object.freeze({
    target_value: targetValue,
    expected_position: expectedPosition,
    submitted_position: submittedPosition,
    submitted_value: submittedValue,
    absolute_error: absoluteError,
    tolerance,
    correct
  });
}

export { createNumberLine, evaluatePlacement };
