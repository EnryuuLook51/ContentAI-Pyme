import { loadState, saveState, hasRequirements, createExample, saveVersion } from './data/store.js';
import { shell, validateForm, showFieldError } from './components/ui.js';
import { loadTemplates } from './components/templates.js';
import { showLoginLoader, hideLoginLoader } from './components/login-loader.js';
import { loginView, panelView, companyView, productsView, productView, generatorView, updateGeneratorContext, resultView, historyView, detailView, notFoundView, reviewView, versionView, campaignsView, campaignView, resultsView, updateObservationList } from './pages/views.js';

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
let sceneMotionPaused = false;
let lastRenderedRoute = null;
let lastRenderedHash = '';
let formDirty = false;
const app = document.querySelector('#app');

function updateSceneMotion() {
  const scene = app.querySelector('.auth-shell');
  if (!scene) return;
  scene.classList.toggle('is-motion-paused', sceneMotionPaused);
  const toggle = scene.querySelector('[data-action="motion"]');
  toggle.setAttribute('aria-pressed', String(sceneMotionPaused));
  toggle.textContent = sceneMotionPaused ? 'Reanudar animación' : 'Pausar animación';
}

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
  if (formDirty && location.hash !== lastRenderedHash && !window.confirm('Tienes cambios sin guardar. ¿Quieres salir de esta pantalla y descartarlos?')) {
    history.replaceState(null, '', lastRenderedHash);
    return;
  }
  const [path, query = ''] = location.hash.slice(2).split('?');
  const [route = 'panel', id, versionNumber] = (path || 'panel').split('/');
  const params = new URLSearchParams(query);
  if (!loggedIn && route !== 'login') { navigate('login'); return; }
  if (loggedIn && route === 'login') { navigate('panel'); return; }
  let content;
  let active = route;
  switch (route) {
    case 'login': content = loginView(new URLSearchParams(query).has('expirada')); break;
    case 'panel': content = panelView(state); break;
    case 'empresa': content = companyView(state.company); break;
    case 'productos': content = productsView(state); break;
    case 'producto': {
      active = 'productos';
      const product = state.products.find(p => p.id === id);
      content = id === 'nuevo' || product ? productView(product) : notFoundView('Producto no encontrado', 'Vuelve al catálogo para seleccionar un producto.', 'Volver al catálogo', 'productos');
      break;
    }
    case 'generar': content = generatorView(state, params.get('producto'), params.get('campana'), params.get('formato')); break;
    case 'resultado': active = 'generar'; content = resultView(currentContent, resultStatus); break;
    case 'historial': content = historyView(state, Object.fromEntries(params)); break;
    case 'contenido': active = 'historial'; currentContent = state.contents.find(c => c.id === id); content = detailView(currentContent); break;
    case 'revision': active = 'historial'; currentContent = state.contents.find(c => c.id === id); content = reviewView(currentContent); break;
    case 'version': {
      active = 'historial';
      const original = state.contents.find(c => c.id === id);
      const version = original?.versions.find(item => item.number === Number(versionNumber));
      currentContent = version ? { ...original, text: version.text } : null;
      content = versionView(original, versionNumber);
      break;
    }
    case 'campanas': content = campaignsView(state); break;
    case 'campana': {
      active = 'campanas';
      const campaign = state.campaigns.find(item => item.id === id);
      content = id === 'nueva' || campaign ? campaignView(state, campaign) : notFoundView('Campaña no encontrada', 'Selecciona una campaña del listado.', 'Volver a campañas', 'campanas');
      break;
    }
    case 'resultados': content = resultsView(state, params.get('contenido')); break;
    default: content = notFoundView();
  }
  app.replaceChildren(shell(content, active, state.company, loggedIn));
  if (route === 'login' && lastRenderedRoute !== 'login') {
    // La primera entrada ya inicia la introducción mientras se cargan las plantillas.
    if (lastRenderedRoute !== null) showLoginLoader();
  } else if (route !== 'login') {
    hideLoginLoader();
  }
  lastRenderedRoute = route;
  lastRenderedHash = location.hash;
  formDirty = false;
  updateSceneMotion();
  document.title = `${document.querySelector('h1')?.textContent || 'Inicio'} · ContentAI-PYME`;
  if (!app.inert) document.querySelector('#page-title')?.focus({ preventScroll: true });
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
      currentContent = createExample(lastRequest.company, lastRequest.product, lastRequest.goal, lastRequest.options);
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
  if (form.id === 'library-form') {
    navigate(`historial?${new URLSearchParams(Object.entries(values).filter(([, value]) => value))}`);
    return;
  }
  if (form.id === 'login-form') {
    loggedIn = true;
    try { sessionStorage.setItem('contentai-demo-session', 'active'); } catch { /* Sesión en memoria. */ }
    form.reset();
    navigate('panel');
    return;
  }
  if (form.id === 'company-form') {
    state.company = values;
    const saved = persist();
    if (!saved) return;
    formDirty = false;
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
    if (!persist()) return;
    formDirty = false;
    notify('Producto o servicio guardado en este navegador.');
    navigate(intent === 'generate' ? `generar?producto=${encodeURIComponent(id)}` : 'productos');
  }
  if (form.id === 'generation-form' && hasRequirements(state)) {
    const product = state.products.find(p => p.id === values.product);
    if (!product) return;
    lastRequest = { company: structuredClone(state.company), product: structuredClone(product), goal: values.goal, options: structuredClone({ type: values.contentType, campaign: state.campaigns.find(item => item.id === values.campaign) || null, channel: state.channels.find(item => item.id === values.channel) || null }) };
    startGeneration();
  }
  if (form.id === 'review-form') {
    const content = state.contents.find(item => item.id === form.dataset.id);
    if (!content) return;
    if (intent === 'save-version') {
      if (values.text === content.text) { notify('No hay cambios en el texto para guardar una nueva versión.'); return; }
      saveVersion(content, values.text);
    } else {
      if (values.text !== content.text) { showFieldError(form.elements.text, 'Guarda primero la nueva versión para conservar tus cambios.'); return; }
      if (intent === 'discard' && !window.confirm('¿Descartar este contenido? Se conservarán el texto y todas sus versiones.')) return;
      content.status = intent === 'approve' ? 'Aprobado' : 'Descartado';
    }
    if (!persist()) return;
    formDirty = false;
    notify(intent === 'save-version' ? 'Nueva versión guardada. Estado: Borrador.' : `Estado editorial: ${content.status}. No se ha publicado contenido.`);
    render();
  }
  if (form.id === 'channel-form') {
    if (state.channels.some(item => item.name.toLocaleLowerCase('es') === values.name.toLocaleLowerCase('es'))) { showFieldError(form.elements.name, 'Este canal ya está registrado.'); return; }
    state.channels.push({ id: crypto.randomUUID(), name: values.name });
    if (!persist()) return;
    formDirty = false;
    render();
    notify('Canal de demostración añadido. No se ha conectado ninguna cuenta externa.');
  }
  if (form.id === 'campaign-form') {
    const id = form.dataset.id || crypto.randomUUID();
    const campaign = { ...values, id, channelIds: new FormData(form).getAll('channelIds') };
    const index = state.campaigns.findIndex(item => item.id === id);
    if (index < 0) state.campaigns.push(campaign);
    else state.campaigns[index] = campaign;
    if (!persist()) return;
    formDirty = false;
    notify('Campaña de demostración guardada.');
    navigate(intent === 'generate' ? `generar?campana=${id}` : 'campanas');
  }
  if (form.id === 'observation-form') {
    if (!values.impressions && !values.clicks && !values.notes) { showFieldError(form.elements.notes, 'Introduce al menos una métrica o una observación.'); return; }
    const content = state.contents.find(item => item.id === values.contentId);
    if (!content) return;
    state.observations.push({ ...values, id: crypto.randomUUID(), version: content.versions.length, impressions: values.impressions === '' ? null : Number(values.impressions), clicks: values.clicks === '' ? null : Number(values.clicks) });
    if (!persist()) return;
    formDirty = false;
    notify('Observación manual guardada en este navegador.');
    navigate(`resultados?contenido=${content.id}`);
  }
});

app.addEventListener('input', event => {
  const control = event.target;
  if (!control.matches('input, textarea, select')) return;
  if (control.closest('#company-form, #product-form, #review-form, #campaign-form, #channel-form, #observation-form')) formDirty = true;
  control.setCustomValidity('');
  control.removeAttribute('aria-invalid');
  const error = document.getElementById(`${control.id}-error`);
  if (error) error.hidden = true;
});

app.addEventListener('change', event => {
  if (['product', 'campaign', 'channel'].includes(event.target.id)) updateGeneratorContext(app, state, event.target.id === 'campaign');
  if (event.target.id === 'observationContent') updateObservationList(app, state);
});

app.addEventListener('reset', event => {
  if (event.target.id === 'company-form') requestAnimationFrame(() => { render(); notify('Cambios sin guardar cancelados.'); });
});

app.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  const menu = app.querySelector('[data-action="menu"][aria-expanded="true"]');
  if (!menu) return;
  app.querySelector('#navigation').classList.remove('is-open');
  menu.setAttribute('aria-expanded', 'false');
  menu.focus();
});

app.addEventListener('click', async event => {
  const navLink = event.target.closest('#navigation a[href^="#/"]');
  const menu = app.querySelector('[data-action="menu"][aria-expanded="true"]');
  if (navLink && menu) {
    app.querySelector('#navigation').classList.remove('is-open');
    menu.setAttribute('aria-expanded', 'false');
    if (navLink.hash === location.hash) app.querySelector('#page-title')?.focus({ preventScroll: true });
  }
  const target = event.target.closest('[data-action]');
  if (!target) return;
  switch (target.dataset.action) {
    case 'motion':
      sceneMotionPaused = !sceneMotionPaused;
      updateSceneMotion();
      break;
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
      if (formDirty && !window.confirm('Hay cambios sin guardar. ¿Quieres cerrar la sesión de demostración?')) return;
      formDirty = false;
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
      if (persist()) { resultStatus = 'saved'; render(); notify('Contenido guardado en tu historial.'); }
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
    if (!loggedIn) showLoginLoader();
    await loadTemplates();
    window.addEventListener('hashchange', render);
    document.querySelector('#startup-status')?.remove();
    render();
  } catch (error) {
    hideLoginLoader();
    console.error('No se pudo iniciar el prototipo.', error);
    app.replaceChildren(document.querySelector('#startup-error').content.cloneNode(true));
  }
}

start();

window.addEventListener('beforeunload', event => {
  if (!formDirty) return;
  event.preventDefault();
  event.returnValue = '';
});
