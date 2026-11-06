import assert from 'node:assert/strict';
import test from 'node:test';
import { createTaskSupportController } from './task-support-controller.js';

test('task support records a request separately from delivered support', () => {
  const events = [];
  const support = createTaskSupportController({
    taskInstanceId: 'B1-L01',
    record: (eventType, payload) => events.push({ event_type: eventType, payload }),
    isSubmitted: () => false
  });

  const requestId = support.requestHelp();
  assert.equal(support.requestHelp(), requestId);
  assert.equal(support.hasPendingHelp(), true);
  assert.deepEqual(events.map(event => event.event_type), ['help_requested']);

  support.deliverSupport({
    support_type: 'hint',
    content_id: 'b1-addition-hint-quantity-v1',
    content: 'Bekijk alle groepen. Hoeveel zijn het samen?'
  });

  assert.equal(support.hasPendingHelp(), false);
  assert.deepEqual(events.map(event => event.event_type), ['help_requested', 'support_delivered']);
  assert.equal(events[1].payload.help_request_id, requestId);
  assert.equal(events[1].payload.support_type, 'hint');
  assert.equal(events[1].payload.content, 'Bekijk alle groepen. Hoeveel zijn het samen?');
});

test('task support records an unresolved request when the task is submitted first', () => {
  const events = [];
  const support = createTaskSupportController({
    taskInstanceId: 'B1-L02',
    record: (eventType, payload) => events.push({ event_type: eventType, payload }),
    isSubmitted: () => false
  });

  support.requestHelp();
  support.finalize();

  assert.deepEqual(events.map(event => event.event_type), ['help_requested', 'help_request_unresolved']);
  assert.equal(support.isClosed(), true);
  assert.equal(support.hasPendingHelp(), false);
  assert.throws(() => support.requestHelp(), /Task support is closed/);
});

test('task support records dismissal without treating it as delivered assistance', () => {
  const events = [];
  const support = createTaskSupportController({
    taskInstanceId: 'B1-L03',
    record: (eventType, payload) => events.push({ event_type: eventType, payload }),
    isSubmitted: () => false
  });

  support.requestHelp();
  assert.equal(support.dismissHelp(), true);
  assert.equal(support.dismissHelp(), false);
  assert.deepEqual(events.map(event => event.event_type), ['help_requested', 'help_request_dismissed']);
});

test('task support rejects delivery without a request and unsupported content types', () => {
  const support = createTaskSupportController({
    taskInstanceId: 'B1-L04',
    record() {},
    isSubmitted: () => false
  });

  assert.throws(() => support.deliverSupport({
    support_type: 'hint',
    content_id: 'hint-1',
    content: 'A hint'
  }), /help request is required/);

  support.requestHelp();
  assert.throws(() => support.deliverSupport({
    support_type: 'answer',
    content_id: 'answer-1',
    content: '42'
  }), /unsupported support_type/);
});
