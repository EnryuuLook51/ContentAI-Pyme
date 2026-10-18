import { loadState, saveState, hasRequirements, createExample } from './data/store.js';
import { shell, validateForm } from './components/ui.js';
import { loadTemplates } from './components/templates.js';
import { loginView, companyView, productsView, productView, generatorView, contextView, resultView, historyView, detailView, notFoundView } from './pages/views.js';

// El almacenamiento es únicamente del prototipo; no es una sesión segura de backend.
let storage;
try { storage = window.localStorage; } catch { storage = null; }
let state = loadState(storage);
let loggedIn = false;
try { loggedIn = sessionStorage.getItem('contentai-demo-session') === 'active'; } catch { /* Sesión en memoria. */ }
let currentContent = null;
let resultStatus = 'saved';
let generationTimer;
let lastRequest;
let toastTimer;
const app = document.querySelector('#app');

function notify(message) {
  const region = document.querySelector('#notifications');
  region.textContent = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { region.textContent = ''; }, 6000);
}

function persist() {
  const saved = saveState(storage, state);
  if (!saved) notify('No se pudo guardar en este navegador. Conservamos los datos en esta sesión.');
  return saved;
}

function navigate(route) {
  if (location.hash === `#/${route}`) render();
  else location.hash = `/${route}`;
}

function render() {
  const [path, query = ''] = location.hash.slice(2).split('?');
  const [route = 'generar', id] = (path || 'generar').split('/');
  if (!loggedIn && route !== 'login') { navigate('login'); return; }
  if (loggedIn && route === 'login') { navigate('generar'); return; }
  let content;
  let active = route;
  switch (route) {
    case 'login': content = loginView(new URLSearchParams(query).has('expirada')); break;
    case 'empresa': content = companyView(state.company); break;
    case 'productos': content = productsView(state); break;
    case 'producto': {
      active = 'productos';
      const product = state.products.find(p => p.id === id);
      content = id === 'nuevo' || product ? productView(product) : notFoundView('Producto no encontrado', 'Vuelve al catálogo para seleccionar un producto.', 'Volver al catálogo', 'productos');
      break;
    }
    case 'generar': content = generatorView(state, new URLSearchParams(query).get('producto')); break;
    case 'resultado': active = 'generar'; content = resultView(currentContent, resultStatus); break;
    case 'historial': content = historyView(state); break;
    case 'contenido': active = 'historial'; currentContent = state.contents.find(c => c.id === id); content = detailView(currentContent); break;
    default: content = notFoundView();
  }
  app.replaceChildren(shell(content, active, state.company, loggedIn));
  document.title = `${document.querySelector('h1')?.textContent || 'Inicio'} · ContentAI-PYME`;
  document.querySelector('#page-title')?.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

function startGeneration() {
  if (generationTimer || !lastRequest || !loggedIn) return;
  resultStatus = 'processing';
  currentContent = null;
  navigate('resultado');
  generationTimer = setTimeout(() => {
    generationTimer = null;
    try {
      currentContent = createExample(lastRequest.company, lastRequest.product, lastRequest.goal);
      // No se añade otra entrada al consultar o reintentar el guardado.
      state.contents.push(currentContent);
      resultStatus = persist() ? 'saved' : 'pending';
    } catch {
      resultStatus = 'error';
    }
    if (location.hash === '#/resultado') render();
  }, 1000);
}

app.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.target;
  if (!validateForm(form)) return;
  const values = Object.fromEntries([...new FormData(form)].map(([key, value]) => [key, String(value).trim()]));
  const intent = event.submitter?.value;
  if (form.id === 'login-form') {
    loggedIn = true;
    try { sessionStorage.setItem('contentai-demo-session', 'active'); } catch { /* Sesión en memoria. */ }
    form.reset();
    navigate('generar');
    return;
  }
  if (form.id === 'company-form') {
    state.company = values;
    const saved = persist();
    if (saved) notify('Datos de empresa guardados en este navegador.');
    if (intent === 'continue') navigate('productos');
    else render();
  }
  if (form.id === 'product-form') {
    const id = form.dataset.id || crypto.randomUUID();
    const product = { ...values, id };
    const index = state.products.findIndex(p => p.id === id);
    if (index < 0) state.products.push(product);
    else state.products[index] = product;
    if (persist()) notify('Producto o servicio guardado en este navegador.');
    navigate(intent === 'generate' ? `generar?producto=${encodeURIComponent(id)}` : 'productos');
  }
  if (form.id === 'generation-form' && hasRequirements(state)) {
    const product = state.products.find(p => p.id === values.product);
    if (!product) return;
    lastRequest = { company: structuredClone(state.company), product: structuredClone(product), goal: values.goal };
    startGeneration();
  }
});

app.addEventListener('input', event => {
  const control = event.target;
  if (!control.matches('input, textarea, select')) return;
  control.setCustomValidity('');
  control.removeAttribute('aria-invalid');
  const error = document.getElementById(`${control.id}-error`);
  if (error) error.hidden = true;
});

app.addEventListener('change', event => {
  if (event.target.id !== 'product') return;
  const product = state.products.find(p => p.id === event.target.value);
  if (product) document.querySelector('#context').replaceChildren(contextView(state.company, product));
});

app.addEventListener('reset', event => {
  if (event.target.id === 'company-form') requestAnimationFrame(() => { render(); notify('Cambios sin guardar cancelados.'); });
});

app.addEventListener('click', async event => {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  switch (target.dataset.action) {
    case 'menu': {
      const expanded = target.getAttribute('aria-expanded') !== 'true';
      target.setAttribute('aria-expanded', String(expanded));
      document.querySelector('#navigation').classList.toggle('is-open', expanded);
      break;
    }
    case 'password': {
      const input = document.querySelector('#password');
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      target.textContent = show ? 'Ocultar' : 'Mostrar';
      target.setAttribute('aria-label', show ? 'Ocultar contraseña' : 'Mostrar contraseña');
      target.setAttribute('aria-pressed', String(show));
      break;
    }
    case 'logout':
      clearTimeout(generationTimer);
      generationTimer = null;
      currentContent = null;
      lastRequest = null;
      loggedIn = false;
      try { sessionStorage.removeItem('contentai-demo-session'); } catch { /* Sesión en memoria. */ }
      navigate('login');
      break;
    case 'check': render(); break;
    case 'retry': startGeneration(); break;
    case 'save-again':
      if (persist()) { resultStatus = 'saved'; render(); notify('Publicación guardada en tu historial.'); }
      break;
    case 'copy':
      if (!currentContent) return;
      try {
        await navigator.clipboard.writeText(currentContent.text);
        notify('Texto copiado.');
      } catch {
        const text = document.querySelector('#generated-text');
        const range = document.createRange();
        range.selectNodeContents(text);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        notify('Seleccionamos el texto. Usa Copiar en tu navegador o Ctrl+C.');
      }
      break;
  }
});

async function start() {
  try {
    await loadTemplates();
    window.addEventListener('hashchange', render);
    document.querySelector('#startup-status')?.remove();
    render();
  } catch (error) {
    console.error('No se pudo iniciar el prototipo.', error);
    app.replaceChildren(document.querySelector('#startup-error').content.cloneNode(true));
  }
}

start();
