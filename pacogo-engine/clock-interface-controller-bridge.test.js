import test from 'node:test';
import assert from 'node:assert/strict';
import { createClockInterfaceControllerBridge } from './clock-interface-controller-bridge.js';

test('clock bridge sends digital interface time to controller and locks after submit', () => {
  const calls = [];
  let locked = false;
  const interfaceInstance = {
    setTime: () => {},
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

test('clock bridge follows the interface representation when it changes outside the bridge', () => {
  const calls = [];
  let interfaceRepresentation = 'digital';
  const interfaceInstance = {
    setTime: () => {},
    getRepresentation: () => interfaceRepresentation,
    lock: () => {}
  };
  const controller = {
    setAnalogTime: (time) => calls.push(['analog', time]),
    setDigitalTime: (time) => calls.push(['digital', time]),
    submit: () => ({ correct: true })
  };

  const bridge = createClockInterfaceControllerBridge({ interfaceInstance, controller, representation: 'digital' });
  interfaceRepresentation = 'analog';
  bridge.setTime({ hour: 8, minute: 35 });

  assert.equal(bridge.getRepresentation(), 'analog');
  assert.deepEqual(calls, [['analog', { hour: 8, minute: 35 }]]);
});

test('clock bridge supports analog representation when controller provides it', () => {
  let selected = null;
  const interfaceInstance = { setTime: () => {}, lock: () => {} };
  const controller = {
    setAnalogTime: (time) => { selected = time; },
    submit: () => ({ correct: false })
  };

  const bridge = createClockInterfaceControllerBridge({ interfaceInstance, controller, representation: 'analog' });
  bridge.setTime({ hour: 17, minute: 20 });

  assert.deepEqual(selected, { hour: 17, minute: 20 });
});

test('clock bridge rejects unsupported representation', () => {
  assert.throws(
    () => createClockInterfaceControllerBridge({
      interfaceInstance: { setTime: () => {}, lock: () => {} },
      controller: { submit: () => ({}) },
      representation: 'both'
    }),
    /representation must be analog or digital/
  );
});
