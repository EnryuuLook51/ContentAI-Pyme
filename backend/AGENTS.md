# Backend — Instrucciones para el desarrollo futuro

Aplicar junto con `../AGENTS.md`. Este directorio contiene inicialmente solo instrucciones: no hay todavía una aplicación Laravel ni comandos de backend comprobados.

## Preparación y convenciones

- Crear el backend únicamente cuando se autorice su implementación; este archivo no autoriza scaffolding ni instalación de dependencias.
- Antes de inicializar Laravel, acordar versiones de PHP/Laravel, estructura, autenticación, cola y configuración con el equipo.
- Una vez implementado, seguir las convenciones y organización reales del proyecto; no imponer capas o paquetes innecesarios.
- Obtener comandos de ejecución y pruebas de los manifiestos y documentación existentes. No asumir que Artisan, Composer o el worker están disponibles antes de comprobarlo.

## API y seguridad

- Usar `/api/v1` para rutas de negocio y documentar por separado CSRF.
- Mantener sesión, CSRF, hashing de contraseñas y autorización reutilizable conforme al contrato acordado.
- Validar entradas en el servidor y limitar consultas y referencias a la empresa autenticada.
- Aplicar la misma autorización en preview, creación y consulta de solicitudes, catálogo, contexto y contenido.
- Probar con al menos dos empresas ficticias; una nunca debe consultar o utilizar recursos de la otra.
- Devolver errores públicos consistentes sin revelar secretos, prompts internos ni datos ajenos.

## PostgreSQL y persistencia

- Gestionar cambios de esquema mediante migraciones Laravel reproducibles y revisadas.
- Mantener modelo, migraciones y diccionario de datos alineados; no fijar cardinalidades todavía pendientes sin acordarlas.
- Definir claves foráneas, unicidad y restricciones necesarias para preservar propiedad empresarial e integridad.
- Respaldar la prevención de duplicados con restricciones y transacciones, no solo con comprobaciones previas en código.
- Conservar texto original, primera versión y snapshot histórico inmutables.
- Usar exclusivamente datos ficticios en seeds. No ejecutar migraciones destructivas ni borrar bases existentes sin autorización explícita.

## Motor de generación

- Separar proveedor mediante interfaz y adaptadores real/simulado; identificar inequívocamente el modo simulado.
- Construir y persistir el contexto autorizado y su versión de plantilla antes de procesar la solicitud.
- Implementar alta idempotente, límites atómicos y estados y transiciones acordados con el frontend.
- Ejecutar generación en cola y exponer consulta de estado sin mantener bloqueada la llamada HTTP.
- Coordinar timeout del proveedor, timeout del trabajo, reintentos y recuperación para evitar ejecuciones solapadas indebidas.
- Contemplar fallo de encolado, reinicio del worker, entregas repetidas y respuestas tardías.
- Finalizar la solicitud y guardar contenido/primera versión de forma atómica, sin duplicados.
- No mantener una transacción de base de datos abierta mientras se espera al proveedor externo.
- No prometer cobro o ejecución externa exactamente una vez sin garantía del proveedor.

## Pruebas y entrega

Cubrir autenticación, CSRF, acceso cruzado, referencias ajenas, validación, persistencia, idempotencia concurrente, fallos externos, timeout, entregas repetidas y recuperación.

Mantener pruebas deterministas con un proveedor simulado explícito y verificar por separado la integración real sin guardar claves ni datos sensibles. Documentar ejecución de API y worker cuando existan. Informar qué pruebas se ejecutaron y cuáles siguen pendientes.
