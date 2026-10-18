export const STORAGE_KEY = 'contentai-pyme-prototype-v1';
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
};

export function loadState(storage) {
  try {
    const saved = JSON.parse(storage.getItem(STORAGE_KEY));
    if (saved && saved.company && Array.isArray(saved.products) && Array.isArray(saved.contents)) return saved;
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

// Plantilla determinista de demostración: no llama a un proveedor de IA.
export function createExample(company, product, goal) {
  return {
    id: crypto.randomUUID(), createdAt: new Date().toISOString(),
    company: structuredClone(company), product: structuredClone(product), goal,
    type: 'Publicación para redes sociales',
    text: `¿Buscas ${product.name.toLocaleLowerCase('es')}? En ${company.name} ofrecemos ${product.features.toLocaleLowerCase('es')} para ${product.benefits.charAt(0).toLocaleLowerCase('es') + product.benefits.slice(1)}. Escríbenos para conocer nuestro ${product.type.toLocaleLowerCase('es')}.`,
  };
}
