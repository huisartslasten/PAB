export function createPracticeGameHelp({ documentRef = document, title, paragraphs = [], className = '' } = {}) {
  if (!title) throw new TypeError('Practice game help requires a title.');

  const wrapper = documentRef.createElement('div');
  wrapper.className = `practice-game-help ${className}`.trim();

  const button = documentRef.createElement('button');
  button.type = 'button';
  button.className = 'practice-game-help-button';
  button.textContent = '?';
  button.setAttribute('aria-label', `Uitleg: ${title}`);
  button.setAttribute('aria-haspopup', 'dialog');

  const dialog = documentRef.createElement('dialog');
  dialog.className = 'practice-game-help-dialog';
  dialog.setAttribute('aria-labelledby', 'practice-game-help-title');

  const content = documentRef.createElement('div');
  content.className = 'practice-game-help-content';

  const kicker = documentRef.createElement('span');
  kicker.className = 'practice-game-help-kicker';
  kicker.textContent = 'UITLEG';

  const heading = documentRef.createElement('h2');
  heading.id = 'practice-game-help-title';
  heading.textContent = title;
  content.append(kicker, heading);

  paragraphs.forEach(text => {
    const paragraph = documentRef.createElement('p');
    paragraph.textContent = text;
    content.appendChild(paragraph);
  });

  const close = documentRef.createElement('button');
  close.type = 'button';
  close.className = 'secondary';
  close.textContent = 'Begrepen';
  content.appendChild(close);
  dialog.appendChild(content);
  wrapper.append(button, dialog);

  const open = () => dialog.showModal();
  button.addEventListener('click', open);
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });

  return Object.freeze({ element: wrapper, button, dialog, open });
}
