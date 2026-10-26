const baseUrl = document.querySelector('meta[name="api-base"]')?.content;
if (!baseUrl) throw new Error('Falta configurar la dirección de la API.');

let csrfToken = '';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (['POST', 'PUT'].includes(method) && csrfToken) headers['X-CSRF-Token'] = csrfToken;

  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      credentials: 'include',
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError('No se pudo conectar con el backend PHP. Comprueba que el servidor esté activo.', 0);
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new ApiError('El backend respondió con un formato inesperado.', response.status);
  }
  if (result.csrf) csrfToken = result.csrf;
  if (!response.ok) throw new ApiError(result.error || 'La solicitud no se pudo completar.', response.status);
  return result;
}

export async function initializeApi() {
  const csrf = await request('/csrf');
  csrfToken = csrf.csrf;
}

export async function getSession() {
  return request('/session');
}

export async function login(email, password) {
  return request('/login', { method: 'POST', body: { email, password } });
}

export async function logout() {
  const result = await request('/logout', { method: 'POST', body: {} });
  csrfToken = '';
  return result;
}

export async function saveCompany(company) {
  return request('/company', { method: 'PUT', body: company });
}

export async function saveProduct(product, id = '') {
  const path = id ? `/products/${encodeURIComponent(id)}` : '/products';
  return request(path, { method: 'POST', body: product });
}

export async function createContent(productId, goal) {
  return request('/contents', { method: 'POST', body: { productId, goal } });
}
