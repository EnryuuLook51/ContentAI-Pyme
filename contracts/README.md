# Contratos HTTP

**Coordinación:** Franco; cada responsable valida sus rutas. El archivo `openapi.yaml` se escribirá cuando se acuerden cuerpos y errores; no existe todavía un contrato validado.

Punto de partida: [endpoints del primer corte](../entregas/01-LUNES.md) y [ruta general](../RUTA_DESARROLLO.md).

- Prefijo `/api/v1` y JSON.
- Login y CSRF compartidos; autorización en servidor.
- Error con `code`, `message` y `request_id`.
- Generación con `202`, `job_id` y `content_id`; cabecera `Idempotency-Key`.
- Cambios de contrato coordinados con frontend antes de integrar.

No generar clientes a partir de un OpenAPI incompleto ni llamar terminado a un endpoint que solo devuelve datos simulados.
