export function createPageShell({
  page,
  left,
  center,
  right = null,
  noRight = false
} = {}) {
  if (!page) throw new Error('createPageShell requires a page element');
  if (!center) throw new Error('createPageShell requires a center element');

  const shell = document.createElement('div');
  shell.className = 'page-side-layout' + (noRight ? ' page-side-layout-no-right' : '');

  if (left) {
    left.classList.add('page-side-left');
    shell.appendChild(left);
  }

  center.classList.add('page-side-center');
  shell.appendChild(center);

  if (right && !noRight) {
    right.classList.add('page-side-right');
    shell.appendChild(right);
  }

  return shell;
}

export function moveChildren(from, to) {
  if (!from || !to) return;
  while (from.firstChild) to.appendChild(from.firstChild);
}
