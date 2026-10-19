// Las estructuras viven en HTML. Se cargan una vez y cada uso obtiene una copia.
export const templateSources = [
  new URL('./templates.html', import.meta.url),
  ...['login', 'panel', 'empresa', 'productos', 'producto', 'generar', 'resultado', 'historial', 'contenido', 'no-encontrado', 'revision', 'campanas', 'resultados']
    .map(page => new URL(`../pages/${page}.html`, import.meta.url)),
];

const templates = new Map();

export async function loadTemplates() {
  const documents = await Promise.all(templateSources.map(async url => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`No se pudo cargar la plantilla: ${url.pathname}`);
    return new DOMParser().parseFromString(await response.text(), 'text/html');
  }));
  const loaded = new Map();
  for (const document of documents) {
    for (const template of document.querySelectorAll('template[id]')) {
      if (loaded.has(template.id)) throw new Error(`Plantilla duplicada: ${template.id}`);
      loaded.set(template.id, template);
    }
  }
  templates.clear();
  for (const [id, template] of loaded) templates.set(id, template);
}

export function cloneTemplate(id) {
  const template = templates.get(id);
  if (!template) throw new Error(`Plantilla no disponible: ${id}`);
  return document.importNode(template.content, true);
}

export function bindText(root, values) {
  for (const node of root.querySelectorAll('[data-bind]')) {
    if (Object.hasOwn(values, node.dataset.bind)) node.textContent = values[node.dataset.bind] ?? '';
  }
  return root;
}

export function fillForm(form, values) {
  for (const control of form.elements) {
    if (!control.name || !Object.hasOwn(values, control.name)) continue;
    const value = values[control.name] ?? '';
    if (!(control instanceof HTMLSelectElement && control.multiple)) control.value = value;
    // Restablecer conserva los datos guardados, no los campos vacíos del HTML.
    if (control instanceof HTMLSelectElement) {
      for (const option of control.options) {
        option.defaultSelected = control.multiple ? value.includes(option.value) : option.value === value;
        option.selected = option.defaultSelected;
      }
    } else {
      control.defaultValue = value;
    }
  }
}
