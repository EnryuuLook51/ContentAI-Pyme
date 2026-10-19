import { cloneTemplate, bindText } from './templates.js';

export function shell(content, active, company, loggedIn) {
  const view = cloneTemplate(loggedIn ? 'app-shell' : 'auth-shell');
  if (loggedIn) {
    bindText(view, { account: `${company.name || 'Mi negocio'} · Datos de ejemplo`, companyName: company.name || 'Mi negocio' });
    for (const item of view.querySelectorAll('[data-route]')) {
      if (item.dataset.route === active) item.setAttribute('aria-current', 'page');
    }
  }
  view.querySelector('main').append(content);
  return view;
}

export function validateForm(form) {
  let first;
  for (const control of form.querySelectorAll('input, textarea, select')) {
    if (control.required && !control.value.trim()) control.setCustomValidity('Este campo es obligatorio.');
    else control.setCustomValidity('');
    const invalid = !control.validity.valid;
    control.setAttribute('aria-invalid', String(invalid));
    const message = form.querySelector(`#${control.id}-error`);
    if (message) {
      message.hidden = !invalid;
      message.textContent = control.validity.valueMissing || control.validity.customError ? 'Este campo es obligatorio.' : control.type === 'number' ? 'Introduce un número entero mayor o igual a cero.' : control.type === 'date' ? 'Introduce una fecha válida.' : 'Introduce un correo electrónico válido.';
    }
    if (invalid && !first) first = control;
  }
  first?.focus();
  return !first;
}

export function showFieldError(control, message) {
  control.setCustomValidity(message);
  control.setAttribute('aria-invalid', 'true');
  const error = document.getElementById(`${control.id}-error`);
  if (error) { error.hidden = false; error.textContent = message; }
  control.focus();
}
