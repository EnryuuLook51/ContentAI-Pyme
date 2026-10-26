import { cloneTemplate, bindText, fillForm } from '../components/templates.js';
import { hasRequirements, filterContents, getProfileProgress } from '../data/store.js';

function addOptions(select, items) {
  for (const item of items) select.add(new Option(typeof item === 'string' ? item : item.name, typeof item === 'string' ? item : item.id));
}

const dateLabel = value => new Date(value).toLocaleString('es-PE');

export function loginView(expired = false) {
  const view = cloneTemplate('page-login');
  view.querySelector('[data-state="expired"]').hidden = !expired;
  return view;
}

export function panelView(state) {
  const progress = getProfileProgress(state);
  const view = bindText(cloneTemplate('page-panel'), {
    greeting: `Hola, ${state.company.name || 'bienvenido'}`,
    intro: progress.completed === progress.total ? 'Tu perfil está listo. Crea contenido con el contexto de tu negocio.' : 'Completa el perfil de tu negocio para que la IA escriba con tu voz.',
    progressCount: `${progress.completed} de ${progress.total}`,
  });
  view.querySelector('progress').value = progress.completed;
  for (const link of view.querySelectorAll('[data-profile]')) {
    const complete = progress.sections[link.dataset.profile];
    link.dataset.complete = String(complete);
    link.querySelector('.profile-check').textContent = complete ? '✓' : '○';
    link.querySelector('.profile-status').textContent = complete ? 'Completado' : 'Pendiente';
  }
  for (const link of view.querySelectorAll('[data-format]')) link.href = `#/generar?formato=${encodeURIComponent(link.dataset.format)}`;
  const recent = [...state.contents].sort((a, b) => new Date(b.versions.at(-1).createdAt) - new Date(a.versions.at(-1).createdAt)).slice(0, 3);
  view.querySelector('[data-state="empty"]').hidden = recent.length > 0;
  for (const content of recent) {
    const item = bindText(cloneTemplate('recent-content-item'), { title: content.product.name, type: content.type, status: content.status, version: `v${content.versions.length}` });
    item.querySelector('[data-link="detail"]').href = `#/contenido/${encodeURIComponent(content.id)}`;
    item.querySelector('.badge').dataset.status = content.status;
    view.querySelector('[data-list="recent"]').append(item);
  }
  return view;
}

export function companyView(company) {
  const view = cloneTemplate('page-company');
  fillForm(view.querySelector('form'), company);
  return view;
}

export function productsView(state) {
  const view = cloneTemplate('page-products');
  view.querySelector('[data-state="empty"]').hidden = state.products.length > 0;
  const list = view.querySelector('[data-list="products"]');
  for (const product of state.products) {
    const item = bindText(cloneTemplate('catalog-item'), product);
    item.querySelector('[data-link="edit"]').href = `#/producto/${encodeURIComponent(product.id)}`;
    item.querySelector('[data-link="generate"]').href = `#/generar?producto=${encodeURIComponent(product.id)}`;
    list.append(item);
  }
  return view;
}

export function productView(product) {
  const view = cloneTemplate('page-product');
  const form = view.querySelector('form');
  form.dataset.id = product?.id || '';
  if (product) {
    bindText(view, { title: 'Editar producto o servicio', description: 'Productos y servicios / Editar · Describe con precisión qué se promocionará.' });
    fillForm(form, product);
  }
  return view;
}

export function contextView(company, product) {
  const restrictions = [...new Set([company.restrictions, product.restrictions].filter(Boolean))].join(' · ');
  return bindText(cloneTemplate('context-panel'), {
    company: `${company.name} · ${company.activity}`,
    product: `${product.type} · ${product.name}`,
    benefits: `Beneficio · ${product.benefits}`,
    audience: `Público · ${company.audience}`,
    tone: `Tono · ${company.tone}`,
    restrictions: `Restricciones · ${restrictions || 'Sin restricciones adicionales'}`,
  });
}

export function generatorView(state, productId) {
  if (!hasRequirements(state)) {
    return bindText(cloneTemplate('page-requirements'), { products: `Producto o servicio: ${state.products.length ? 'registrado.' : 'falta registrar uno.'}` });
  }
  const view = cloneTemplate('page-generator');
  const product = state.products.find(p => String(p.id) === productId) || state.products[0];
  const products = view.querySelector('#product');
  for (const item of state.products) products.add(new Option(item.name, item.id));
  products.value = product.id;
  view.querySelector('#audience').add(new Option(state.company.audienceName, state.company.audienceName));
  updateGeneratorContext(view, state);
  return view;
}

export function updateGeneratorContext(root, state) {
  const product = state.products.find(item => String(item.id) === root.querySelector('#product').value);
  if (!product) return;
  root.querySelector('#context').replaceChildren(contextView(state.company, product));
}

export function contentReader(content) {
  return bindText(cloneTemplate('content-reader'), { text: content.text });
}

export function resultView(content, status = 'saved') {
  if (status === 'processing') return cloneTemplate('page-processing');
  if (status === 'error') return cloneTemplate('page-generation-error');
  if (!content) return cloneTemplate('page-no-result');
  const pending = status === 'pending';
  const view = bindText(cloneTemplate('page-result'), {
    context: `${content.product.type} · ${content.type} · ${content.goal}`,
  });
  if (pending) bindText(view, { description: 'La generación terminó; todavía estamos confirmando el guardado.' });
  view.querySelector('[data-state="saved"]').hidden = pending;
  view.querySelector('[data-state="pending"]').hidden = !pending;
  view.querySelector('[data-component="reader"]').replaceWith(contentReader(content));
  const detail = view.querySelector('[data-link="detail"]');
  detail.href = `#/contenido/${encodeURIComponent(content.id)}`;
  detail.hidden = pending;
  return view;
}

export function historyView(state, filters = {}) {
  const view = cloneTemplate('page-history');
  const contents = filterContents(state.contents, { search: filters.search });
  fillForm(view.querySelector('#library-form'), filters);
  bindText(view, { count: `${contents.length} contenido(s) encontrado(s)` });
  view.querySelector('[data-state="empty"]').hidden = contents.length > 0;
  if (state.contents.length && !contents.length) bindText(view, { emptyTitle: 'No hay coincidencias', emptyDescription: 'Prueba con otros filtros o limpia la búsqueda.' });
  const list = view.querySelector('[data-list="contents"]');
  for (const content of [...contents].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))) {
    const item = bindText(cloneTemplate('history-item'), {
      title: `${content.product.name} · ${content.type}`,
      date: new Date(content.createdAt).toLocaleString('es-PE'),
      excerpt: `${content.text.slice(0, 160)}…`,
      status: content.status,
    });
    item.querySelector('time').dateTime = content.createdAt;
    item.querySelector('[data-link="detail"]').href = `#/contenido/${encodeURIComponent(content.id)}`;
    list.append(item);
  }
  return view;
}

export function detailView(content) {
  if (!content) return notFoundView('Contenido no encontrado', 'El contenido no está disponible en este navegador.', 'Volver al historial', 'historial');
  const view = bindText(cloneTemplate('page-detail'), {
    company: content.company.name, productType: content.product.type, product: content.product.name,
    type: content.type, goal: content.goal,
    version: `Versión ${content.versions.length} · ${dateLabel(content.versions.at(-1).createdAt)}`,
    status: content.status, campaign: content.campaign?.name || 'Sin campaña', channel: content.channel?.name || 'Sin canal específico',
  });
  view.querySelector('[data-component="reader"]').replaceWith(contentReader(content));
  return view;
}

export function reviewView(content) {
  if (!content) return detailView(null);
  const view = bindText(cloneTemplate('page-review'), { context: `${content.product.name} · ${content.type}`, status: `Estado editorial: ${content.status}` });
  const form = view.querySelector('form');
  form.dataset.id = content.id;
  fillForm(form, { text: content.text });
  view.querySelector('[data-link="detail"]').href = `#/contenido/${content.id}`;
  for (const version of [...content.versions].reverse()) {
    const item = bindText(cloneTemplate('version-item'), { title: `Versión ${version.number}${version.number === content.versions.length ? ' · Actual' : ''}`, date: dateLabel(version.createdAt), source: version.source });
    item.querySelector('[data-link="version"]').href = `#/version/${content.id}/${version.number}`;
    view.querySelector('[data-list="versions"]').append(item);
  }
  return view;
}

export function versionView(content, number) {
  const version = content?.versions.find(item => item.number === Number(number));
  if (!version) return notFoundView('Versión no encontrada', 'Selecciona una versión desde el historial.', 'Volver al historial', 'historial');
  const view = bindText(cloneTemplate('page-version'), { title: `Versión ${version.number}`, date: dateLabel(version.createdAt), source: version.source });
  view.querySelector('[data-component="reader"]').replaceWith(contentReader(version));
  view.querySelector('[data-link="review"]').href = `#/revision/${content.id}`;
  view.querySelector('[data-link="detail"]').href = `#/contenido/${content.id}`;
  return view;
}

export function campaignsView(state) {
  const view = cloneTemplate('page-campaigns');
  view.querySelector('[data-state="empty"]').hidden = state.campaigns.length > 0;
  for (const campaign of state.campaigns) {
    const item = bindText(cloneTemplate('campaign-item'), { ...campaign, audience: `Público: ${campaign.audience}`, channels: `Canales: ${state.channels.filter(channel => campaign.channelIds.includes(channel.id)).map(channel => channel.name).join(', ') || 'Sin canales asociados'}` });
    item.querySelector('[data-link="edit"]').href = `#/campana/${campaign.id}`;
    item.querySelector('[data-link="generate"]').href = `#/generar?campana=${campaign.id}`;
    item.querySelector('[data-link="contents"]').href = `#/historial?campaign=${campaign.id}`;
    view.querySelector('[data-list="campaigns"]').append(item);
  }
  for (const channel of state.channels) {
    const item = document.createElement('li');
    item.textContent = channel.name;
    view.querySelector('[data-list="channels"]').append(item);
  }
  return view;
}

export function campaignView(state, campaign) {
  const view = cloneTemplate('page-campaign');
  const form = view.querySelector('form');
  form.dataset.id = campaign?.id || '';
  addOptions(view.querySelector('#channelIds'), state.channels);
  fillForm(form, campaign || { audience: state.company.audienceName, channelIds: [] });
  if (campaign) bindText(view, { title: 'Editar campaña' });
  return view;
}

export function updateObservationList(root, state) {
  const id = root.querySelector('#observationContent').value;
  const list = root.querySelector('[data-list="observations"]');
  list.replaceChildren();
  const observations = state.observations.filter(item => item.contentId === id);
  root.querySelector('[data-state="empty"]').hidden = observations.length > 0;
  const detail = root.querySelector('[data-link="detail"]');
  detail.href = `#/contenido/${id}`;
  detail.hidden = !id;
  for (const observation of [...observations].reverse()) {
    const content = state.contents.find(item => item.id === id);
    const item = bindText(cloneTemplate('observation-item'), {
      content: `${content.product.name} · ${content.type}`, date: `${observation.date} · Versión ${observation.version}`,
      impressions: observation.impressions ?? 'Sin dato', clicks: observation.clicks ?? 'Sin dato', notes: observation.notes || 'Sin observaciones adicionales',
    });
    item.querySelector('[data-link="detail"]').href = `#/version/${id}/${observation.version}`;
    list.append(item);
  }
}

export function resultsView(state, contentId) {
  const view = cloneTemplate('page-results');
  view.querySelector('[data-state="no-content"]').hidden = state.contents.length > 0;
  view.querySelector('form').hidden = !state.contents.length;
  addOptions(view.querySelector('#observationContent'), state.contents.map(content => ({ id: content.id, name: `${content.product.name} · ${content.type} · ${content.status}` })));
  if (state.contents.some(content => content.id === contentId)) view.querySelector('#observationContent').value = contentId;
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  view.querySelector('#observationDate').value = today.toISOString().slice(0, 10);
  updateObservationList(view, state);
  return view;
}

export function notFoundView(title = 'Página no encontrada', description = 'Esta pantalla no está disponible.', back = 'Volver al generador', route = 'generar') {
  const view = bindText(cloneTemplate('page-not-found'), { title, description, back });
  view.querySelector('[data-link="back"]').href = `#/${route}`;
  return view;
}
