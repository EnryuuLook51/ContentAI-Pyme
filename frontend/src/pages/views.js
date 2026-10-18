import { cloneTemplate, bindText, fillForm } from '../components/templates.js';
import { hasRequirements } from '../data/store.js';

export function loginView(expired = false) {
  const view = cloneTemplate('page-login');
  view.querySelector('[data-state="expired"]').hidden = !expired;
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
  const product = state.products.find(p => p.id === productId) || state.products[0];
  const products = view.querySelector('#product');
  for (const item of state.products) products.add(new Option(item.name, item.id));
  products.value = product.id;
  view.querySelector('#audience').add(new Option(state.company.audienceName, state.company.audienceName));
  view.querySelector('#context').append(contextView(state.company, product));
  return view;
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
  view.querySelector('[data-action="save-again"]').hidden = !pending;
  return view;
}

export function historyView(state) {
  const view = cloneTemplate('page-history');
  view.querySelector('[data-state="empty"]').hidden = state.contents.length > 0;
  const list = view.querySelector('[data-list="contents"]');
  for (const content of [...state.contents].reverse()) {
    const item = bindText(cloneTemplate('history-item'), {
      title: `${content.product.name} · ${content.type}`,
      date: new Date(content.createdAt).toLocaleString('es-PE'),
      excerpt: `${content.text.slice(0, 160)}…`,
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
    version: `Versión 1 · ${new Date(content.createdAt).toLocaleString('es-PE')}`,
  });
  view.querySelector('[data-component="reader"]').replaceWith(contentReader(content));
  return view;
}

export function notFoundView(title = 'Página no encontrada', description = 'Esta pantalla no está disponible.', back = 'Volver al generador', route = 'generar') {
  const view = bindText(cloneTemplate('page-not-found'), { title, description, back });
  view.querySelector('[data-link="back"]').href = `#/${route}`;
  return view;
}
