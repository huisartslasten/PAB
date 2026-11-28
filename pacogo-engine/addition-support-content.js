function createAdditionSupportOptions({ task }) {
  if (!task || typeof task !== 'object') throw new TypeError('task is required');
  if (typeof task.representation !== 'string') throw new TypeError('task.representation is required');

  const hint = task.representation === 'quantity_groups'
    ? 'Bekijk alle groepen. Hoeveel zijn het samen?'
    : 'De getallen geven hoeveelheden aan. Je zoekt het totaal wanneer je ze samenneemt.';

  return Object.freeze([
    Object.freeze({
      support_type: 'explanation',
      content_id: 'b1-addition-meaning-v1',
      content_version: '0.1',
      label: 'Uitleg',
      title: 'Wat betekent optellen?',
      content: 'Bij optellen voeg je hoeveelheden samen. Je zoekt hoeveel het er in totaal zijn.'
    }),
    Object.freeze({
      support_type: 'hint',
      content_id: task.representation === 'quantity_groups'
        ? 'b1-addition-hint-quantity-v1'
        : 'b1-addition-hint-symbolic-v1',
      content_version: '0.1',
      label: 'Hint',
      title: 'Denk even mee',
      content: hint
    }),
    Object.freeze({
      support_type: 'worked_example',
      content_id: 'b1-addition-example-quantity-v1',
      content_version: '0.1',
      label: 'Voorbeeld',
      title: 'Een klein voorbeeld',
      content: 'Voorbeeld: 3 + 2 betekent 3 en nog 2 erbij. Als je ze samenneemt, zijn het 5.'
    })
  ]);
}

export { createAdditionSupportOptions };
