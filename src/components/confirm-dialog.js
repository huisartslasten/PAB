const STYLE_ID = 'paco-confirm-dialog-styles';

function ensureStyles(documentRef) {
  if (documentRef.getElementById(STYLE_ID)) return;

  const style = documentRef.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .paco-confirm-backdrop {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: grid;
      place-items: center;
      padding: 24px;
      background: rgba(16,43,87,.42);
      backdrop-filter: blur(3px);
    }
    .paco-confirm-dialog {
      width: min(100%, 520px);
      padding: 26px;
      border: 2px solid var(--paco-border, #cfe3f3);
      border-radius: 24px;
      background: #fff;
      color: var(--paco-text, #102b57);
      box-shadow: 0 20px 50px rgba(16,43,87,.25);
      font-family: Nunito, system-ui, sans-serif;
    }
    .paco-confirm-dialog h2 {
      margin: 0;
      color: var(--paco-text, #102b57);
      font: 900 27px/1.1 "Baloo 2", Nunito, sans-serif;
    }
    .paco-confirm-dialog p {
      margin: 12px 0 22px;
      color: var(--paco-muted, #667894);
      font-size: 17px;
      font-weight: 700;
      line-height: 1.45;
    }
    .paco-confirm-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      flex-wrap: wrap;
    }
    .paco-confirm-actions button {
      min-height: 46px;
      padding: 9px 18px;
      border: 0;
      border-radius: 14px;
      font: 800 16px/1.1 "Baloo 2", Nunito, sans-serif;
      cursor: pointer;
      transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
    }
    .paco-confirm-cancel {
      background: #edf8ff;
      color: var(--paco-blue-dark, #0d6fd4);
      box-shadow: 0 4px 0 rgba(13,111,212,.10);
    }
    .paco-confirm-cancel:hover { background: #e2f2ff; transform: translateY(-1px); }
    .paco-confirm-danger {
      background: #1787f2;
      color: #fff;
      box-shadow: 0 4px 0 rgba(13,111,212,.20);
    }
    .paco-confirm-danger:hover { background: #0d6fd4; transform: translateY(-1px); }
    .paco-confirm-actions button:focus-visible {
      outline: 0;
      box-shadow: 0 0 0 4px rgba(23,135,242,.20), 0 4px 0 rgba(13,111,212,.12);
    }
  `;
  documentRef.head.appendChild(style);
}

export function confirmPacoAction({
  title = 'Bevestigen',
  message = '',
  confirmLabel = 'OK',
  cancelLabel = 'Annuleren',
  documentRef = document,
  windowRef = window
} = {}) {
  ensureStyles(documentRef);

  return new Promise(resolve => {
    const backdrop = documentRef.createElement('div');
    backdrop.className = 'paco-confirm-backdrop';
    backdrop.setAttribute('role', 'presentation');

    const dialog = documentRef.createElement('section');
    dialog.className = 'paco-confirm-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', 'paco-confirm-title');

    const heading = documentRef.createElement('h2');
    heading.id = 'paco-confirm-title';
    heading.textContent = title;

    const body = documentRef.createElement('p');
    body.textContent = message;

    const actions = documentRef.createElement('div');
    actions.className = 'paco-confirm-actions';

    const cancelButton = documentRef.createElement('button');
    cancelButton.type = 'button';
    cancelButton.className = 'paco-confirm-cancel';
    cancelButton.textContent = cancelLabel;

    const confirmButton = documentRef.createElement('button');
    confirmButton.type = 'button';
    confirmButton.className = 'paco-confirm-danger';
    confirmButton.textContent = confirmLabel;

    actions.append(cancelButton, confirmButton);
    dialog.append(heading, body, actions);
    backdrop.appendChild(dialog);
    documentRef.body.appendChild(backdrop);

    const previousActive = documentRef.activeElement;
    const close = result => {
      windowRef.removeEventListener('keydown', onKeyDown);
      backdrop.remove();
      if (previousActive && typeof previousActive.focus === 'function') previousActive.focus();
      resolve(result);
    };
    const onKeyDown = event => {
      if (event.key === 'Escape') close(false);
    };

    cancelButton.addEventListener('click', () => close(false));
    confirmButton.addEventListener('click', () => close(true));
    backdrop.addEventListener('click', event => {
      if (event.target === backdrop) close(false);
    });
    windowRef.addEventListener('keydown', onKeyDown);
    confirmButton.focus();
  });
}
