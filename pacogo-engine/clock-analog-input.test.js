import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeAngle, minuteFromAngle, hourFromAngle, angleFromPointer } from './clock-analog-input.js';

test('clock analog input normalizes angles', () => {
  assert.equal(normalizeAngle(-30), 330);
  assert.equal(normalizeAngle(390), 30);
});

test('clock analog input maps minute hand angles to five-minute increments', () => {
  assert.equal(minuteFromAngle(0), 0);
  assert.equal(minuteFromAngle(90), 15);
  assert.equal(minuteFromAngle(210), 35);
  assert.equal(minuteFromAngle(359), 0);
});

test('clock analog input reads the current hour until the next hour mark', () => {
  assert.equal(hourFromAngle(255, 8), 8);
  assert.equal(hourFromAngle(269.999, 8), 8);
  assert.equal(hourFromAngle(270, 8), 9);
  assert.equal(hourFromAngle(255, 20), 20);
  assert.equal(hourFromAngle(269.999, 20), 20);
  assert.equal(hourFromAngle(270, 20), 21);
  assert.equal(hourFromAngle(359, 8), 11);
  assert.equal(hourFromAngle(0, 8), 0);
  assert.equal(hourFromAngle(0, 20), 12);
});

test('clock analog input converts pointer coordinates to clock angle', () => {
  const rect = { left: 0, top: 0, width: 100, height: 100 };
  assert.equal(angleFromPointer({ clientX: 50, clientY: 0, rect }), 0);
  assert.equal(angleFromPointer({ clientX: 100, clientY: 50, rect }), 90);
  assert.equal(angleFromPointer({ clientX: 50, clientY: 100, rect }), 180);
});
