export const STORAGE_KEY = 'contentai-pyme-prototype-v1';
export const CONTENT_TYPES = ['Publicación para redes sociales', 'Descripción de producto', 'Descripción de servicio', 'Anuncio publicitario', 'Correo comercial', 'Texto promocional', 'Mensaje para campaña', 'Título', 'Llamado a la acción', 'Artículo', 'Texto para página web', 'Landing page', 'Ideas para campaña'];
export const EDITORIAL_STATES = ['Borrador', 'Aprobado', 'Descartado'];
export const initialState = {
  company: {
    name: 'TecnoBarrio', activity: 'Mantenimiento de computadoras', description: '',
    audienceName: 'Pequeños negocios de la zona', audience: 'Pequeños negocios de la zona',
    tone: 'Cercano y profesional', restrictions: 'No prometer que el equipo nunca fallará',
  },
  products: [{ id: 'mantenimiento', type: 'Servicio', name: 'Mantenimiento preventivo de computadoras',
    description: 'Mantenimiento preventivo para las computadoras de tu negocio.',
    features: 'Limpieza interna y revisión básica', benefits: 'Ayudar a prevenir fallas por acumulación de polvo',
    restrictions: 'No prometer que el equipo nunca fallará' }],
  contents: [],
  campaigns: [],
  channels: [{ id: 'red-social', name: 'Redes sociales' }, { id: 'correo', name: 'Correo electrónico' }],
  observations: [],
};

export function loadState(storage) {
  try {
    const saved = JSON.parse(storage.getItem(STORAGE_KEY));
    if (saved && saved.company && Array.isArray(saved.products) && Array.isArray(saved.contents)) {
      // Compatibilidad con los datos del primer maquetado, sin borrar publicaciones.
      return {
        ...saved,
        campaigns: saved.campaigns || [], channels: saved.channels || structuredClone(initialState.channels), observations: saved.observations || [],
        contents: saved.contents.map(content => ({
          ...content, status: content.status || 'Borrador',
          versions: content.versions?.length ? content.versions : [{ number: 1, text: content.text, createdAt: content.createdAt, source: 'Ejemplo simulado' }],
        })),
      };
    }
  } catch { /* El prototipo puede funcionar sin almacenamiento disponible. */ }
  return structuredClone(initialState);
}

export function saveState(storage, state) {
  try { storage.setItem(STORAGE_KEY, JSON.stringify(state)); return true; }
  catch { return false; }
}

export function hasRequirements(state) {
  return ['name', 'activity', 'audienceName', 'audience', 'tone'].every(key => state.company[key]?.trim()) && state.products.length > 0;
}

export function getProfileProgress(state) {
  const filled = key => Boolean(state.company[key]?.trim());
  const sections = {
    company: filled('name') && filled('activity'),
    products: state.products.length > 0,
    audience: filled('audienceName') && filled('audience'),
    brand: filled('tone'),
  };
  return { sections, completed: Object.values(sections).filter(Boolean).length, total: 4 };
}

// Plantilla determinista de demostración: no llama a un proveedor de IA.
export function createExample(company, product, goal, options = {}) {
  const type = options.type || CONTENT_TYPES[0];
  const base = `En ${company.name} ofrecemos ${product.features.toLocaleLowerCase('es')} para ${product.benefits.charAt(0).toLocaleLowerCase('es') + product.benefits.slice(1)}.`;
  const text = {
    'Publicación para redes sociales': `¿Buscas ${product.name.toLocaleLowerCase('es')}? ${base} Escríbenos para conocer nuestro ${product.type.toLocaleLowerCase('es')}.`,
    'Descripción de producto': `${product.name}\n\n${product.description}\n\nIncluye: ${product.features}.\nBeneficio: ${product.benefits}.`,
    'Descripción de servicio': `${product.name}\n\n${base}\n\nConsulta con nuestro equipo qué incluye el servicio.`,
    'Anuncio publicitario': `${product.name}\n${base}\nSolicita información a ${company.name}.`,
    'Correo comercial': `Asunto: Conoce ${product.name}\n\nHola:\n\n${base}\n\nSi te interesa conocer más, responde a este correo.\n\nEl equipo de ${company.name}`,
    'Texto promocional': `${base} Conoce ${product.name} y consulta los detalles con nuestro equipo.`,
    'Mensaje para campaña': `${options.campaign?.name || 'Conoce nuestra propuesta'}\n\n${base}\nContáctanos para más información.`,
    'Título': `${product.name}: una propuesta de ${company.name}`,
    'Llamado a la acción': `Consulta por ${product.name} con el equipo de ${company.name}.`,
    'Artículo': `${product.name}\n\nQué ofrecemos\n${product.description}\n\nCaracterísticas\n${product.features}\n\nBeneficios\n${product.benefits}\n\nContacta con ${company.name} para conocer más.`,
    'Texto para página web': `${company.name}\n\n${product.name}\n${base}\n\nQué incluye\n${product.features}\n\nSolicita información.`,
    'Landing page': `${product.name}\n\n${base}\n\nNuestra propuesta\n${product.description}\n\nQué incluye\n${product.features}\n\nConversemos: solicita información a ${company.name}.`,
    'Ideas para campaña': `1. Presentar ${product.name}.\n2. Explicar qué incluye: ${product.features}.\n3. Comunicar el beneficio: ${product.benefits}.\n4. Invitar al público a contactar con ${company.name}.`,
  }[type];
  const content = {
    id: crypto.randomUUID(), createdAt: new Date().toISOString(),
    company: structuredClone(company), product: structuredClone(product), goal,
    type, text: text || base, status: 'Borrador',
    campaign: options.campaign ? structuredClone(options.campaign) : null,
    channel: options.channel ? structuredClone(options.channel) : null,
  };
  content.versions = [{ number: 1, text: content.text, createdAt: content.createdAt, source: 'Ejemplo simulado' }];
  return content;
}

export function saveVersion(content, text) {
  content.versions.push({ number: content.versions.length + 1, text, createdAt: new Date().toISOString(), source: 'Edición manual de demostración' });
  content.text = text;
  content.status = 'Borrador';
}

export function filterContents(contents, filters = {}) {
  const query = (filters.search || '').toLocaleLowerCase('es');
  return contents.filter(content =>
    (!query || `${content.product.name} ${content.text} ${content.goal}`.toLocaleLowerCase('es').includes(query)) &&
    (!filters.type || content.type === filters.type) &&
    (!filters.status || content.status === filters.status) &&
    (!filters.campaign || content.campaign?.id === filters.campaign));
}
