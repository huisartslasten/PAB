import test from 'node:test';
import assert from 'node:assert/strict';
import { formatDigitalTime, assertRepresentation } from './clock-learning-interface.js';

test('clock learning interface formats digital time consistently', () => {
  assert.equal(formatDigitalTime({ hour: 8, minute: 5 }), '08:05');
  assert.equal(formatDigitalTime({ hour: 23, minute: 59 }), '23:59');
});

test('clock learning interface accepts both pedagogical representations', () => {
  assert.doesNotThrow(() => assertRepresentation('analog'));
  assert.doesNotThrow(() => assertRepresentation('digital'));
  assert.throws(() => assertRepresentation('text'), /analog or digital/);
});

test('clock bridge exposes a single representation-switch boundary', async () => {
  const module = await import('./clock-interface-controller-bridge.js');
  const calls = [];
  const interfaceInstance = {
    setTime: () => {},
    setRepresentation: (representation) => calls.push(`interface:${representation}`),
    lock: () => calls.push('lock')
  };
  const controller = {
    setAnalogTime: () => calls.push('analog-time'),
    setDigitalTime: () => calls.push('digital-time'),
    submit: () => ({ correct: true, observation: { observation_id: 'CLOCK-O1' } })
  };
  const bridge = module.createClockInterfaceControllerBridge({ interfaceInstance, controller, representation: 'digital' });

  assert.equal(bridge.getRepresentation(), 'digital');
  bridge.setTime({ hour: 8, minute: 35 });
  bridge.setRepresentation('analog');
  bridge.setTime({ hour: 8, minute: 35 });
  const result = bridge.submit();

  assert.equal(result.correct, true);
  assert.deepEqual(calls, ['digital-time', 'interface:analog', 'analog-time', 'lock']);
});
