# ContentAI-PYME · Grupo 07

## Organización del avance para el lunes

**Presentación:** lunes 19 de octubre de 2026.

**Objetivo:** demostrar un recorrido funcional: iniciar sesión → configurar empresa, marca y audiencia → registrar producto o servicio → generar una publicación contextualizada con IA → guardar y volver a consultar el contenido.

Este es el primer hito de tres. Su equivalencia con el tercio solicitado debe confirmarse con el docente. El documento asigna trabajo pendiente; no acredita funcionalidades ya implementadas.

### Reparto y fechas internas

- **Enrique:** base backend y acceso. Viernes 16, 18:00.
- **Gonzalo:** datos y contexto empresarial. Viernes 16, 20:00.
- **Yoshua:** generación contextual, IA y worker. Sábado 17, 15:00.
- **Jorge:** pantallas de acceso, empresa y catálogo. Sábado 17, 12:00.
- **Franco:** generador, biblioteca e integración. Sábado 17, 18:00.

Las horas corresponden a la hora local acordada por el equipo. Cada integrante confirma disponibilidad; la estimación inicial es de 15–20 horas de trabajo por persona hasta el cierre.

### Acuerdos comunes

- Stack propuesto: React + TypeScript, Go y PostgreSQL. Confirmarlo antes de iniciar.
- Cuentas y empresas ficticias precargadas; no habrá registro público en este corte.
- API bajo `/api/v1`, errores uniformes, sesión y protección CSRF compartidas.
- Datos persistentes en PostgreSQL; ningún módulo se da por terminado solo con simulaciones.
- Integración diaria: no esperar al domingo para unir los módulos.
- No cambiar cuerpos de API, nombres de campos o migraciones sin avisar al equipo.
- No incluir claves API, contraseñas de demostración ni tokens en documentos o repositorio.

### Calendario de control

- **Miércoles 14:** repositorio, contrato mínimo y entorno base.
- **Jueves 15:** acceso y primera escritura real en la base de datos.
- **Viernes 16:** recorrido completo con generación simulada y resultado persistido.
- **Sábado 17:** conectar IA real y cerrar funcionalidades a las 18:00.
- **Domingo 18:** pruebas, correcciones y ensayo. Sin funciones nuevas.
- **Lunes 19:** presentar la versión probada, sin cambios de último momento.

Fuera de este corte: campañas, múltiples formatos, editor, aprobación, estadísticas, publicación en redes y despliegue público.

---

## Parte 1 · Capillo Enrique Diego

**Responsabilidad:** base backend, autenticación y acceso a la empresa propia.

**Fecha límite:** viernes 16 de octubre, 18:00.

### Qué implementar

1. Crear la estructura backend y configuración de entorno sin secretos.
2. Dejar API y PostgreSQL arrancables, con conexión y endpoint de salud.
3. Crear migraciones de usuarios y sesiones, coordinadas con el seed de Gonzalo.
4. Implementar login y logout con contraseñas hasheadas y sesión persistente.
5. Proteger operaciones con sesión y CSRF; asociar usuario con empresa propia.
6. Proporcionar al resto del backend un mecanismo común para obtener la empresa autorizada.
7. Apoyar el arranque del worker y las comprobaciones de permisos.

### Interfaz que debes entregar

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- Mecanismo documentado para obtener y enviar el token CSRF.
- Endpoint de salud y configuración de ejemplo sin credenciales reales.

### Coordinación

- Con **Gonzalo:** relaciones entre usuario y empresa, migraciones y dos cuentas ficticias.
- Con **Jorge y Franco:** cookie de sesión, CSRF y manejo de sesión expirada.
- Con **Yoshua:** arranque independiente del worker y acceso a configuración.

### Evidencia de terminado

- Un usuario válido inicia sesión; credenciales incorrectas se rechazan.
- Después de cerrar sesión, la sesión anterior ya no permite acceder.
- Una petición sin sesión no accede a información empresarial.
- La cuenta A no puede consultar recursos de la empresa B.
- Otra persona puede arrancar el backend siguiendo tus instrucciones.

### Qué presentar el lunes

Explicar el acceso y la arquitectura base; demostrar una sesión válida y el rechazo de un acceso no autorizado. Tiempo aproximado: 1 minuto.

**No corresponde todavía:** registro público, login social o administración avanzada de usuarios.

---

## Parte 2 · More Sulca Gonzalo

**Responsabilidad:** modelo de datos y API del contexto comercial.

**Fecha límite:** viernes 16 de octubre, 20:00.

### Qué implementar

1. Diseñar el modelo recortado de empresa, marca, audiencia y catálogo.
2. Crear migraciones de tu módulo y coordinar el orden con Enrique, Yoshua y Franco.
3. Preparar datos ficticios de dos empresas: agrícola y mantenimiento informático.
4. Implementar consulta y edición de empresa, perfil de marca y audiencia inicial.
5. Implementar creación, listado y edición de productos y servicios.
6. Validar campos, longitudes y pertenencia de todos los registros a la empresa autorizada.
7. Apoyar la integración de formularios cuando tus endpoints estén listos.

### Interfaz que debes entregar

- `GET /api/v1/company` y `PATCH /api/v1/company`.
- `GET /api/v1/company/brand` y `PUT /api/v1/company/brand`.
- `GET /api/v1/audiences`, `GET /api/v1/audiences/{id}` y `PATCH /api/v1/audiences/{id}`.
- `GET /api/v1/catalog`, `POST /api/v1/catalog`, `GET /api/v1/catalog/{id}` y `PATCH /api/v1/catalog/{id}`.

### Datos mínimos

- **Empresa:** nombre, rubro, descripción y propuesta de valor.
- **Marca:** tono y restricciones de comunicación.
- **Audiencia:** nombre del segmento y necesidades.
- **Catálogo:** tipo producto/servicio, nombre, descripción, características y beneficios.

### Coordinación

- Con **Enrique:** usuario, empresa y acceso autorizado.
- Con **Jorge:** contrato y validaciones de formularios.
- Con **Yoshua y Franco:** datos usados para generar y mostrar el resumen del contexto.

### Evidencia de terminado

- Guardar y recuperar datos después de recargar y reiniciar la API.
- Crear un producto desde la web y comprobar su persistencia.
- Rechazar lectura, edición o uso de un registro de otra empresa.
- Entregar ER, migraciones y seed reproducibles.

**Exposición:** mostrar datos persistidos y explicar el contexto comercial. Aproximadamente 1 minuto. No implementar campañas ni resultados comerciales todavía.

---

## Parte 3 · Novoa Polo Yoshua Yampier

**Responsabilidad:** generación contextual y procesamiento asíncrono.

**Fecha límite:** sábado 17 de octubre, 15:00.

### Qué implementar

1. Crear un proveedor simulado determinista, claramente identificado como SIMULADO.
2. Integrar un proveedor real con clave solo en el worker y timeout.
3. Construir contexto con empresa, marca, audiencia y producto propios, leídos por el servidor.
4. Guardar un snapshot inmutable del contexto y la versión de plantilla.
5. Implementar alta idempotente de trabajo y consulta de estado.
6. Ejecutar el worker como proceso independiente, con arrendamiento temporal y token de intento.
7. Guardar primera versión y éxito del trabajo en una sola transacción, sin duplicados por trabajo.
8. Gestionar fallo, timeout y recuperación acotada de trabajos abandonados; impedir guardados de intentos vencidos.

### Interfaz que debes entregar

- `POST /api/v1/generation-preview`: resumen autorizado del contexto, sin instrucciones internas ni secretos.
- `POST /api/v1/generation-jobs`: respuesta `202` con `job_id` y `content_id`.
- `GET /api/v1/generation-jobs/{id}`: estado y resultado o error seguro.
- Un solo formato para este corte: `social_post`.

### Coordinación

- Con **Gonzalo:** lectura de contexto y propiedad de registros.
- Con **Franco:** contrato de generación, tablas de contenido/versiones y visualización del estado.
- Con **Enrique:** configuración, arranque y sesiones.

### Evidencia de terminado

- El texto utiliza el producto y el tono registrados, sin inventar descuentos ni certificaciones.
- Existe al menos una generación real, con contexto y resultado persistidos.
- La misma clave de idempotencia no crea dos trabajos.
- Un timeout termina con un estado claro, no con un “procesando” permanente.
- Una respuesta de un intento vencido no sobrescribe el vigente.

**Exposición:** mostrar snapshot, procesamiento y resultado. Aproximadamente 2 minutos. No implementar otros formatos, campañas o regeneración todavía.

---

## Parte 4 · Honores Torres Jorge Alberto

**Responsabilidad:** interfaz de acceso y administración del negocio.

**Fecha límite:** sábado 17 de octubre, 12:00.

### Qué implementar

1. Acordar con Franco navegación, componentes y cliente HTTP compartido.
2. Crear pantalla de login, cierre de sesión y manejo de sesión expirada.
3. Crear formulario de empresa, marca y audiencia inicial.
4. Crear listado y formularios de producto o servicio.
5. Conectar las pantallas a la API real, incluyendo sesión y CSRF.
6. Mostrar estados de carga, vacío, error y guardado.
7. Verificar diseño en pantalla pequeña y navegación básica con teclado.

### Pantallas que debes entregar

- Inicio de sesión.
- Empresa e identidad de marca.
- Audiencia inicial.
- Catálogo con listado, creación y edición.
- Navegación hacia generador y biblioteca, que implementa Franco.

### Coordinación

- Con **Franco:** estructura web, estilos básicos, componentes y rutas; no crear dos bases frontend.
- Con **Enrique:** autenticación, CSRF y respuestas de acceso.
- Con **Gonzalo:** campos de formularios, validaciones y API de negocio.

### Evidencia de terminado

- Iniciar sesión y editar el contexto comercial desde el navegador.
- Crear y editar un producto sin herramientas externas de API.
- Recargar y ver los datos guardados, no solo el estado local de la interfaz.
- Mostrar mensajes útiles cuando falla una validación o vence la sesión.
- Usar el recorrido principal en una pantalla pequeña sin bloqueos visuales.

### Qué presentar el lunes

Modificar un dato de la empresa o producto y comprobar que permanece guardado. Tiempo aproximado: 1 minuto.

**No corresponde todavía:** editor de contenido, campañas, panel de métricas, animaciones ni un sistema visual completo.

---

## Parte 5 · Saldarriaga Guerrero Franco

**Responsabilidad:** generador, biblioteca e integración del recorrido completo.

**Fecha límite:** sábado 17 de octubre, 18:00.

### Qué implementar

1. Crear la base web y el cliente HTTP compartido con Jorge.
2. Coordinar el contrato mínimo y registrar cambios antes de integrarlos.
3. Crear el generador: producto/servicio, audiencia, objetivo y resumen del contexto autorizado.
4. Enviar la solicitud con clave idempotente y consultar el estado hasta resultado o fallo.
5. Mostrar el texto como contenido seguro y distinguir generación real de simulada.
6. Crear migraciones de contenidos y versiones, coordinadas con Yoshua.
7. Implementar listado/detalle y las pantallas de biblioteca para reabrir la primera versión guardada.
8. Integrar web, API, worker y DB con Enrique; ejecutar pruebas y preparar la demo.

### Interfaz que debes entregar

- `GET /api/v1/contents`.
- `GET /api/v1/contents/{id}`.
- Pantalla del generador conectada a los endpoints de Yoshua.
- Biblioteca y detalle con solo la primera versión IA de cada contenido.

### Coordinación

- Con **Jorge:** rutas, cliente HTTP y componentes comunes.
- Con **Yoshua:** claves idempotentes, estados, referencias del resultado y guardado de versiones.
- Con **Gonzalo:** selección del producto y audiencia propios.
- Con **Enrique:** arranque completo, sesión y pruebas de permisos.

### Evidencia de terminado

- Seleccionar un producto, generar y visualizar el contenido.
- Recargar y abrir el mismo resultado desde la biblioteca.
- Mostrar el fallo del trabajo sin bloquear indefinidamente la interfaz.
- Ejecutar el sistema siguiendo el README desde otro equipo.
- Tener pruebas registradas y un respaldo de la demostración real.

**Exposición:** reabrir contenido, explicar persistencia, integración y siguientes hitos. Aproximadamente 1–2 minutos. No implementar edición, aprobación ni estadísticas todavía.

---

## Cierre conjunto · Pruebas y presentación

### Obligatorio antes del domingo por la noche

1. Iniciar sesión, guardar contexto y registrar un producto desde la web.
2. Generar una publicación real usando esos datos y conservar su snapshot.
3. Recargar y abrir el resultado desde la biblioteca.
4. Reiniciar servicios y comprobar que los datos permanecen.
5. Repetir una solicitud con la misma clave sin duplicar el trabajo.
6. Comprobar rechazo de acceso a producto, trabajo y contenido ajenos.
7. Simular un fallo externo y mostrar un desenlace controlado.
8. Ejecutar el entorno desde otro equipo usando el README.
9. Completar dos recorridos exitosos y ensayar la exposición de 6–8 minutos.

### Qué entrega cada integrante

- Código integrado y revisado por otra persona.
- Instrucciones de ejecución y variables de configuración sin secretos.
- Pruebas de su parte y evidencia reproducible.
- Pendientes y limitaciones identificados; una simulación no cuenta como integración real.

### Reglas para resolver bloqueos

- Avisar el mismo día: qué falla, qué se intentó y qué ayuda se necesita.
- Si el viernes no existe el recorrido simulado persistente, priorizar integración y detener mejoras visuales.
- El sábado a las 18:00 se congelan funciones; el domingo solo se corrigen fallos.
- Si falla la IA en vivo, mostrar el error y abrir una generación real previa. Nunca presentar texto simulado como llamada real.

### Material del lunes

- Aplicación local funcional y cuentas ficticias compartidas por canal privado.
- README, modelo de datos y diagrama de arquitectura del corte.
- Lista de pruebas realizadas y pendientes reales.
- Video o capturas de respaldo sin secretos ni datos sensibles.

**Orden de exposición:** Enrique → Gonzalo → Jorge → Yoshua → Franco.

**Siguiente hito:** campañas, múltiples formatos, edición, versiones y aprobación. Después: evaluación, métricas y despliegue final.

La coordinación verifica la integración; cada integrante sigue siendo responsable de implementar, probar y explicar su propio módulo.
