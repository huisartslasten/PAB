import test from 'node:test';
import assert from 'node:assert/strict';
import { createClockInterfaceControllerBridge } from './clock-interface-controller-bridge.js';

test('clock bridge sends time to the controller using the interface response representation', () => {
  const calls = [];
  let locked = false;
  const interfaceInstance = {
    setTime: () => {},
    getRepresentation: () => 'digital',
    lock: () => { locked = true; }
  };
  const controller = {
    setDigitalTime: (time) => calls.push(['digital', time]),
    submit: () => ({ correct: true, observation: { observation_id: 'obs-1' } })
  };

  const bridge = createClockInterfaceControllerBridge({ interfaceInstance, controller });
  bridge.setTime({ hour: 8, minute: 35 });
  const result = bridge.submit();

  assert.deepEqual(calls, [['digital', { hour: 8, minute: 35 }]]);
  assert.equal(result.correct, true);
  assert.equal(locked, true);
});

test('clock bridge routes analog time to the analog controller boundary', () => {
  const calls = [];
  const interfaceInstance = {
    setTime: () => {},
    getRepresentation: () => 'analog',
    lock: () => {}
  };
  const controller = {
    setAnalogTime: (time) => calls.push(['analog', time]),
    submit: () => ({ correct: true })
  };
  const bridge = createClockInterfaceControllerBridge({ interfaceInstance, controller });
  bridge.setTime({ hour: 8, minute: 35 });
  assert.deepEqual(calls, [['analog', { hour: 8, minute: 35 }]]);
});

test('clock bridge routes a matching option to the controller choice boundary', () => {
  const calls = [];
  const interfaceInstance = {
    setTime: () => {},
    getRepresentation: () => 'choice',
    lock: () => {}
  };
  const controller = {
    selectRepresentation: (optionId) => calls.push(optionId),
    submit: () => ({ correct: true })
  };
  const bridge = createClockInterfaceControllerBridge({ interfaceInstance, controller, representation: 'choice' });
  bridge.selectRepresentation('option-b');
  assert.deepEqual(calls, ['option-b']);
  assert.throws(() => bridge.setTime({ hour: 8, minute: 35 }), /Use selectRepresentation/);
});

test('clock bridge rejects unsupported fallback representation', () => {
  assert.throws(
    () => createClockInterfaceControllerBridge({
      interfaceInstance: { setTime: () => {}, lock: () => {} },
      controller: { submit: () => ({}) },
      representation: 'both'
    }),
    /representation must be analog, digital or choice/
  );
});
