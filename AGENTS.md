# ContentAI-PYME — Instrucciones para agentes

## Fuentes y decisiones

Consultar según el área del cambio:
- `ContentAI-PYME.md`: propósito y alcance del producto.
- `entregas/REPARTO_PARA_EL_GRUPO.md`: responsabilidades, alcance del avance y contratos propuestos.
- `entregas/ESPECIFICACION_UX_UI_CONTENTAI_PYME.md`: pantallas, estados, navegación y propuestas UX/UI.

Distinguir requisitos acordados, propuestas y comportamiento implementado. Si hay contradicciones, informarlas antes de tomar decisiones estructurales. No duplicar la documentación ni convertir propuestas pendientes en requisitos definitivos.

## Alcance del primer avance

Completar: iniciar sesión → guardar contexto empresarial → registrar un producto o servicio → generar una publicación para redes sociales → persistirla → volver a consultarla.

No incorporar campañas, métricas comerciales, edición, aprobación, descarte, formatos adicionales ni publicación automática. No es una tienda, un chat genérico ni un dashboard analítico.

## Stack y estado real

- Stack previsto: PHP con Laravel, PostgreSQL y React + TypeScript.
- `frontend/` contiene actualmente un maquetado en JavaScript y CSS, con almacenamiento local y generación simulada; no es todavía la aplicación React integrada.
- Al redactar estas instrucciones no existe una implementación Laravel. `backend/AGENTS.md` establece reglas para su desarrollo futuro, no acredita un backend operativo.
- Inspeccionar siempre el estado actual antes de actuar; los archivos pueden evolucionar y la documentación puede quedar desactualizada.
- No crear infraestructura, migrar el maquetado o sustituir tecnologías sin que forme parte del pedido.
- No inventar versiones, dependencias ni comandos; obtenerlos de los manifiestos y comprobarlos cuando corresponda.

## Seguridad y aislamiento empresarial

- Obtener la empresa autorizada desde el usuario autenticado; no confiar en el identificador enviado por el cliente.
- Autorizar cada consulta, recurso y referencia en el servidor, también al procesar trabajos en segundo plano.
- Mantener autenticación con sesión, protección CSRF y contraseñas hasheadas en la implementación real.
- No usar almacenamiento del navegador como sustituto de autorización o sesión segura.
- No guardar contraseñas, tokens, claves API ni datos personales reales en el repositorio.
- Mantener claves del proveedor de IA exclusivamente en el servidor y evitar secretos o contexto sensible en logs.

## Generación y persistencia

- Construir contexto únicamente con información empresarial autorizada y necesaria.
- Conservar snapshot inmutable y versión de plantilla por solicitud.
- Procesar mediante cola/worker con estado consultable, sin bloquear toda la petición HTTP.
- Implementar idempotencia, límites atómicos y protección contra versiones duplicadas.
- Coordinar persistencia del resultado y finalización de la solicitud de forma atómica.
- Definir tiempos límite, reintentos y recuperación acotados, incluido el fallo al encolar.
- No anunciar éxito antes de confirmar la persistencia.
- No prometer ejecución o cobro exactamente una vez del proveedor si este no lo garantiza.
- Instruir a la IA para no inventar precios, descuentos ni garantías; mantener revisión humana.
- Identificar datos ficticios y respuestas simuladas. Una simulación nunca sustituye silenciosamente una generación real fallida.

## Contratos y coordinación

- Las rutas del negocio utilizan el prefijo `/api/v1`; documentar por separado el mecanismo CSRF.
- Revisar consumidores antes de cambiar rutas, cuerpos, validaciones, estados o errores.
- No tratar contratos propuestos como endpoints ya implementados.
- Respetar responsabilidades y coordinaciones del reparto; no asumir la reescritura de módulos ajenos.
- Mantener coherencia entre requisitos, diagramas, contratos y código.

## Verificación y entrega

Priorizar pruebas de acceso cruzado entre empresas, persistencia después de recargar, duplicados, fallos del proveedor, timeout, reinicio y recuperación.

La integración terminada requiere el recorrido completo contra API, PostgreSQL y proveedor real. Los mocks, el almacenamiento local y las maquetas no cuentan como esa integración.

Realizar cambios pequeños y limitados al pedido. Preservar modificaciones existentes; no cambiar ramas, descartar trabajo ni hacer refactorizaciones ajenas sin autorización. Al finalizar, informar cambios, verificaciones ejecutadas y pendientes; no afirmar que pasó una prueba no ejecutada.
