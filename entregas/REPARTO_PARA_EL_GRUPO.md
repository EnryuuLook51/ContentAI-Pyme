# ContentAI-PYME — Reparto de trabajo

**Equipo:** Diego, Honores, More, Yoshua y Franco.

**Plazo del avance:** miércoles 21 de octubre de 2026.

**Backend:** PHP con Laravel. **Base de datos:** PostgreSQL. **Frontend:** React + TypeScript.

**Descripción principal:** [ContentAI-PYME](../ContentAI-PYME.md).

## Objetivo común

Completar el recorrido: iniciar sesión → registrar contexto empresarial → registrar producto/servicio → solicitar una publicación contextualizada → consultar el resultado guardado.

El avance incluye implementación, requisitos y diagramas. No agregar campañas, varios formatos, edición avanzada, aprobación, métricas ni publicación automática a este corte.

Primero cerrar requisitos, diagramas, responsabilidades y contratos. El repositorio solo contiene documentación; las tareas de implementación se ejecutarán cuando se autorice crear la estructura y empezar el desarrollo. Las ramas existentes no se modifican.

## Diego — Laravel, acceso y permisos

### Implementación

1. Acordar versiones compatibles de PHP/Laravel y configuración del backend.
2. Preparar conexión PostgreSQL, configuración de entorno y comprobación de salud.
3. Implementar login, logout y usuario actual con sesión, CSRF y contraseñas hasheadas.
4. Definir cómo obtener la empresa autorizada desde el usuario autenticado.
5. Proporcionar autorización reutilizable para todos los módulos del negocio.
6. Coordinar cuentas ficticias con More y ejecución del worker con Franco.
7. Probar credenciales incorrectas, sesión vencida, logout, CSRF y acceso cruzado.

### Requisitos y diagramas

- Redactar requisitos funcionales de acceso y no funcionales de seguridad.
- Definir errores y criterios de aceptación del módulo.
- Elaborar el flujo de autenticación con sesión, CSRF y rechazos.

### Coordinar con

- **Honores:** cookies, CSRF, sesión expirada y respuestas de acceso.
- **More:** relación usuario/empresa y datos ficticios.
- **Yoshua y Franco:** protección de contenido y generación.

### Se considera terminado cuando

Un usuario válido entra, una sesión cerrada deja de servir y la empresa A no accede a recursos de B. El backend se ejecuta siguiendo instrucciones comprobadas.

## Honores — Frontend React

### Implementación

1. Preparar una sola aplicación React + TypeScript con componentes y cliente HTTP compartidos.
2. Implementar login/logout y manejo de sesión expirada.
3. Construir formularios de empresa, marca y audiencia inicial.
4. Construir listado, creación y edición de productos/servicios.
5. Implementar generador con selección de producto, audiencia, objetivo y resumen autorizado.
6. Enviar solicitudes idempotentes, consultar estados y mostrar resultado o error.
7. Construir biblioteca y detalle consumiendo contenido guardado.
8. Resolver carga, vacío, validación, error y éxito; probar teclado y pantalla pequeña.

### Requisitos y diagramas

- Definir casos de uso del propietario y requisitos de interfaz.
- Elaborar diagrama de casos de uso y navegación de pantallas.
- Relacionar cada pantalla con sus requisitos y contratos.

### Coordinar con

- **Diego:** acceso, sesión y CSRF.
- **More:** campos, validación y contratos del negocio.
- **Yoshua:** biblioteca y detalle.
- **Franco:** contexto, solicitud, estado y errores de generación.

### Se considera terminado cuando

El recorrido funciona desde el navegador contra API y base reales, se conserva al recargar y no quedan pantallas esperando indefinidamente. Los mocks no cuentan como integración terminada.

## More — PostgreSQL y contexto empresarial

### Implementación

1. Definir el modelo relacional y coordinar migraciones de Laravel con el equipo.
2. Preparar dos empresas ficticias: agrícola y mantenimiento informático.
3. Implementar consulta/edición de empresa, marca y audiencia inicial.
4. Implementar creación, listado y edición de productos/servicios.
5. Validar campos y referencias propias en el servidor.
6. Definir claves foráneas, unicidad y restricciones contra referencias entre empresas.
7. Apoyar la definición de relaciones de contenido y solicitudes de generación.

### Requisitos y diagramas

- Elaborar entidad-relación y diccionario de datos.
- Definir campos, tipos, obligatoriedad, cardinalidades y reglas de integridad.
- Aportar requisitos y aceptación del contexto/catálogo a Yoshua.

### Coordinar con

- **Diego:** usuario, empresa, sesión y seed.
- **Honores:** formularios, validaciones y respuestas.
- **Franco:** campos del contexto y lectura consistente del snapshot.
- **Yoshua:** relaciones de contenido y trazabilidad del modelo.

### Se considera terminado cuando

Se guardan y recuperan datos desde la web y una empresa no consulta ni utiliza productos o audiencias ajenos. El modelo, las migraciones y el diccionario coinciden.

## Yoshua — Contenidos, requisitos y trazabilidad

### Implementación

1. Definir y crear contenidos y primeras versiones persistentes.
2. Acordar con Franco la relación entre solicitud, contenido y versión.
3. Proporcionar el guardado de versión y finalización consistente del resultado, sin duplicados por solicitud.
4. Implementar biblioteca y detalle mediante API, con autorización empresarial.
5. Dejar el texto original inmutable y recuperable después de reiniciar servicios.
6. Probar persistencia, propiedad, entrega repetida y consultas.

### Requisitos y diagramas

1. Consolidar requisitos funcionales y no funcionales aportados por todos.
2. Registrar ID, prioridad, responsable, reglas, errores y criterios de aceptación.
3. Mantener matriz requisito → módulo → diagrama → prueba → estado.
4. Elaborar actividad del flujo de contenido, incluyendo validación, espera y fallo.
5. Revisar que los diagramas y contratos usen los mismos nombres y estados.

### Coordinar con

- **Franco:** persistencia atómica, duplicados y estados del resultado.
- **Honores:** listado y detalle de biblioteca.
- **More:** claves, relaciones, diccionario y restricciones.
- **Diego:** permisos y sesión; **todos:** revisión de sus requisitos.

### Se considera terminado cuando

Cada generación exitosa deja una sola primera versión, se reabre desde la biblioteca y los requisitos tienen aceptación y pruebas identificadas. No implementar edición o aprobación en este corte.

## Franco — Motor contextual, IA y resiliencia

Esta es la parte de mayor complejidad técnica del reparto. No incluye implementar toda la interfaz ni la biblioteca.

### Implementación

1. Construir contexto autorizado con empresa, marca, audiencia y producto/servicio.
2. Guardar snapshot inmutable y versión de plantilla por solicitud.
3. Crear interfaz de proveedor y adaptadores real/simulado.
4. Implementar alta idempotente, validación y límites atómicos de solicitudes.
5. Integrar trabajos/cola de Laravel y ejecución del worker.
6. Implementar estado consultable sin bloquear toda la llamada HTTP.
7. Configurar timeout del proveedor, timeout del trabajo, intentos y recuperación compatibles.
8. Resolver entregas repetidas, concurrencia y respuestas tardías sin guardar versiones duplicadas.
9. Integrar con Yoshua la persistencia atómica del resultado y la finalización de la solicitud.
10. Evitar que el fallo de encolado deje solicitudes invisibles o atascadas; contemplar recuperación.
11. Probar IA real, errores externos, timeout, reinicio y duplicados.
12. Coordinar integración técnica sin asumir la corrección completa de módulos ajenos.

### Requisitos y diagramas

- Definir requisitos de contexto, procesamiento, idempotencia, límites y recuperación.
- Elaborar componentes: SPA, Laravel, PostgreSQL, cola/worker y proveedor IA.
- Elaborar secuencia: validación → snapshot → encolado → proveedor → persistencia → consulta.
- Incluir caminos de error y límites de confianza.

### Coordinar con

- **Diego:** identidad, configuración, acceso y ejecución del worker.
- **More:** esquema del snapshot y referencias empresariales válidas.
- **Yoshua:** modelo del resultado, guardado, unicidad y transacciones.
- **Honores:** solicitud, vista previa, polling, resultado y errores públicos.

### Se considera terminado cuando

Una generación real utiliza contexto propio, conserva snapshot y resultado, no duplica versiones y se recupera de fallos de forma acotada. No prometer que el proveedor externo ejecutará o cobrará exactamente una vez si no ofrece esa garantía.

## Contratos que deben acordar

Todas las rutas del negocio llevan prefijo `/api/v1`; documentar por separado el mecanismo CSRF del framework.

| Responsable | Rutas |
|---|---|
| Diego | `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` |
| More | `GET/PATCH /company`, `GET/PUT /company/brand`, `GET /audiences`, `GET/PATCH /audiences/{id}` |
| More | `GET/POST /catalog`, `GET/PATCH /catalog/{id}` |
| Yoshua | `GET /contents`, `GET /contents/{id}` |
| Franco | `POST /generation-preview`, `POST /generation-jobs`, `GET /generation-jobs/{id}` |

Definir cuerpos, identificadores, validaciones, estados, errores y ejemplos compartidos. No cambiar contratos sin coordinar con quienes los consumen.

## Entregables comunes

- [ ] Requisitos y reglas de negocio revisados por los responsables.
- [ ] Diagramas coherentes con el alcance y el modelo.
- [ ] Código integrado con API y PostgreSQL reales cuando se implemente.
- [ ] Datos ficticios y migraciones reproducibles.
- [ ] Recorrido completo de acceso, contexto, generación y consulta.
- [ ] Pruebas de acceso cruzado, persistencia, duplicados y fallo de IA.
- [ ] Instrucciones de ejecución comprobadas y pendientes explícitos.

No guardar contraseñas, claves API, tokens ni datos personales reales en documentos o repositorio. Identificar siempre los resultados simulados.
