# Frontend — Instrucciones específicas

Aplicar junto con `../AGENTS.md`. Consultar `../entregas/ESPECIFICACION_UX_UI_CONTENTAI_PYME.md` para pantallas, estados, navegación y dirección visual.

## Estado y organización

Este directorio contiene actualmente un prototipo sin React ni TypeScript:
- `src/app.js`: navegación por hash, eventos y coordinación de pantallas.
- `src/pages/views.js`: vistas.
- `src/components/ui.js`: componentes y ayudas compartidas.
- `src/data/store.js`: datos ficticios, almacenamiento local y generación determinista.
- `src/styles/tokens.css` y `src/styles/app.css`: tokens y estilos.
- `scripts/serve.js`: servidor estático de desarrollo.
- `tests/`: pruebas con el runner de Node.js.

Conservar estas convenciones mientras se trabaje sobre el maquetado. La migración prevista a React + TypeScript requiere un pedido explícito; no introducirla como cambio incidental.

## Experiencia y accesibilidad

- Mantener el recorrido del avance y reutilizar componentes y tokens existentes.
- No agregar dashboard, opciones posteriores ni botones de funciones no disponibles.
- Resolver carga, vacío, validación, error y éxito según cada pantalla.
- Conservar lo escrito ante errores y advertir antes de perder cambios sin guardar.
- Usar etiquetas visibles, HTML semántico, foco visible y operación completa con teclado.
- Anunciar cambios de estado de forma accesible; no depender solo del color o del hover.
- Mantener textos comerciales legibles, seleccionables y con sus saltos de párrafo.
- Comprobar el diseño a 390, 834 y 1440 px; indicar si no se realizó validación visual o en dispositivos reales.

## Simulación e integración futura

- Mantener visibles las etiquetas de datos de ejemplo y resultado ilustrativo, no generado por IA.
- `localStorage` y `sessionStorage` pertenecen al prototipo; no representan persistencia del servidor ni autenticación segura.
- No introducir credenciales reales ni claves de IA en código del navegador.
- Al integrar la API, centralizar el cliente HTTP y coordinar cookies, CSRF y sesión expirada con el backend.
- El contexto mostrado para generación debe proceder del servidor autorizado, no ser fuente de autoridad del cliente.
- Diferenciar solicitud aceptada, procesamiento, persistencia confirmada y revisión editorial.
- En la integración real, conservar el identificador de solicitud para consultar su estado al recargar.
- Evitar envíos duplicados y usar idempotencia acordada con el backend. Consultar el estado de una solicitud incierta antes de crear otra.
- Acotar polling, detenerlo en estados terminales y limpiar timers al salir. Un fallo de consulta no implica fallo de generación.
- No anunciar guardado hasta confirmarlo ni dejar indicadores indefinidos sin acción de recuperación.
- Al cerrar sesión real, limpiar datos sensibles del cliente y no reenviar automáticamente generaciones tras volver a entrar.

## Comandos actuales

Desde `frontend/`:
- `npm run dev`: servidor estático, puerto 5173 por defecto; configurable mediante `PORT`.
- `npm test`: pruebas existentes con `node --test`.

Estos comandos están declarados en `package.json`; no implican que hayan sido ejecutados. No hay scripts de build, lint o typecheck definidos actualmente. Revisar el manifiesto si cambia y no inventar resultados ni comandos ausentes.
