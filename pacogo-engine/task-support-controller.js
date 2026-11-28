const SUPPORT_TYPES = new Set(['explanation', 'hint', 'worked_example']);

function assertNonEmptyString(value, label) {
  if (typeof value !== 'string' || !value.trim()) throw new TypeError(label + ' must be a non-empty string');
}

function createTaskSupportController({ taskInstanceId, record, isSubmitted = () => false }) {
  assertNonEmptyString(taskInstanceId, 'taskInstanceId');
  if (typeof record !== 'function') throw new TypeError('record must be a function');
  if (typeof isSubmitted !== 'function') throw new TypeError('isSubmitted must be a function');

  let requestSequence = 0;
  let pendingRequestId = null;
  let closed = false;

  function assertActive() {
    if (closed || isSubmitted()) throw new Error('Task support is closed');
  }

  function requestHelp() {
    assertActive();
    if (pendingRequestId) return pendingRequestId;
    requestSequence += 1;
    pendingRequestId = taskInstanceId + ':help:' + requestSequence;
    record('help_requested', {
      help_request_id: pendingRequestId,
      request_type: 'content_help'
    });
    return pendingRequestId;
  }

  function deliverSupport({ support_type, content_id, content, content_version = '0.1' } = {}) {
    assertActive();
    if (!pendingRequestId) throw new Error('A help request is required before support can be delivered');
    if (!SUPPORT_TYPES.has(support_type)) throw new TypeError('unsupported support_type');
    assertNonEmptyString(content_id, 'content_id');
    assertNonEmptyString(content, 'content');
    assertNonEmptyString(content_version, 'content_version');

    const requestId = pendingRequestId;
    record('support_delivered', {
      help_request_id: requestId,
      support_type,
      content_id,
      content_version,
      content
    });
    pendingRequestId = null;
    return requestId;
  }

  function dismissHelp() {
    assertActive();
    if (!pendingRequestId) return false;
    record('help_request_dismissed', { help_request_id: pendingRequestId });
    pendingRequestId = null;
    return true;
  }

  function finalize() {
    if (closed) return;
    if (pendingRequestId) {
      record('help_request_unresolved', {
        help_request_id: pendingRequestId,
        reason: 'task_submitted_before_support_delivery'
      });
      pendingRequestId = null;
    }
    closed = true;
  }

  return Object.freeze({
    requestHelp,
    deliverSupport,
    dismissHelp,
    finalize,
    hasPendingHelp: () => pendingRequestId !== null,
    isClosed: () => closed
  });
}

export { createTaskSupportController };
