let dismissCurrent = null;

export function hideLoginLoader() {
  dismissCurrent?.();
}

export function showLoginLoader() {
  hideLoginLoader();
  const template = document.querySelector('#login-loader');
  const fragment = template.content.cloneNode(true);
  const loader = fragment.querySelector('.login-loader');
  const app = document.querySelector('#app');
  const skipLink = document.querySelector('.skip-link');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let lifetime;
  let exitTimer;
  let leaving = false;

  function dismiss() {
    clearTimeout(lifetime);
    clearTimeout(exitTimer);
    document.removeEventListener('keydown', onKeydown);
    reduceMotion.removeEventListener('change', onMotionChange);
    const restoreFocus = loader.contains(document.activeElement) || document.activeElement === document.body;
    loader.remove();
    app.inert = false;
    if (skipLink) skipLink.inert = false;
    dismissCurrent = null;
    if (restoreFocus) document.querySelector('#page-title')?.focus({ preventScroll: true });
  }

  function finish() {
    if (leaving) return;
    leaving = true;
    clearTimeout(lifetime);
    loader.classList.add('is-leaving');
    exitTimer = setTimeout(dismiss, reduceMotion.matches ? 120 : 180);
  }

  function onKeydown(event) {
    if (event.key === 'Escape') { event.preventDefault(); finish(); }
  }

  function onMotionChange(event) {
    if (event.matches) finish();
  }

  dismissCurrent = dismiss;
  app.inert = true;
  if (skipLink) skipLink.inert = true;
  document.body.append(fragment);
  loader.querySelector('button').addEventListener('click', finish);
  document.addEventListener('keydown', onKeydown);
  reduceMotion.addEventListener('change', onMotionChange);
  // Es una introducción de marca, no un progreso ficticio ni una petición de acceso.
  lifetime = setTimeout(finish, reduceMotion.matches ? 120 : 1400);
  loader.querySelector('button').focus({ preventScroll: true });
}
