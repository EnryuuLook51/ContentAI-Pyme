# Entrega 1 — Corte funcional para el lunes

**Presentación prevista:** lunes 19 de octubre de 2026.  
**Cierre de funcionalidades:** sábado 17, 18:00, hora del equipo.  
**Domingo 18:** integración, pruebas, correcciones y ensayo. No funcionalidades nuevas.

> Esta entrega es el primer hito de tres, no una afirmación de que ya se completó un tercio del esfuerzo total. Validar con el docente si este alcance satisface su requisito de avance. Al crear este documento no hay código de aplicación en la carpeta: todo lo indicado abajo sigue pendiente.

## 1. Qué vamos a mostrar

Un recorrido completo, pequeño y persistente:

```text
Iniciar sesión
    → registrar empresa, tono y audiencia
    → registrar un producto o servicio
    → seleccionarlo y pedir una publicación para redes
    → observar el trabajo en cola/procesando
    → recibir texto generado usando esos datos
    → volver a abrir el contenido guardado
```

**La meta no es tener diez pantallas a medias: es completar este recorrido.**

### Condiciones para que sea creíble

- Los formularios escriben en PostgreSQL; no guardar el negocio solo en memoria o `localStorage`.
- El servidor construye el contexto desde registros propios, no desde un prompt empresarial escrito a mano en el frontend.
- El proveedor real genera al menos una publicación durante las pruebas previas.
- Existe un modo simulado para desarrollar sin costo, siempre rotulado como **SIMULADO**.
- Un reinicio no borra empresa, producto, trabajo o contenido.
- Una segunda cuenta no puede acceder a los registros de la primera.
- Los cinco pueden arrancar el entorno siguiendo las mismas instrucciones.

## 2. Alcance cerrado hasta el lunes

| Incluido | Nivel mínimo aceptable |
|---|---|
| Acceso | Login, logout y sesión; dos cuentas ficticias creadas mediante seed |
| Empresa | Consultar y editar nombre, rubro, descripción y propuesta de valor |
| Identidad | Un perfil de marca editable con tono y restricciones |
| Audiencia | Un segmento inicial editable; conservar la entidad `audiences` del diseño general |
| Catálogo | Crear, listar y editar producto o servicio: nombre, descripción, características y beneficios |
| Generación | Solo `social_post`, un producto/servicio y una audiencia por solicitud |
| Procesamiento | API y worker separados; trabajo persistente con estado, timeout y recuperación por lease |
| Contexto | Snapshot empresarial guardado por solicitud, con versión de plantilla |
| Contenido | Una primera versión IA inmutable por trabajo; listado y detalle para reabrirla |
| Entorno | Ejecución local reproducible y seed ficticio; no requiere todavía servidor público |
| Evidencia | Demo, pruebas básicas y lista honesta de pendientes |

### Expresamente fuera de este corte

- Registro público de cuentas, recuperación de acceso e invitaciones.
- Campañas, múltiples formatos y generación masiva.
- Editor, regeneración, comparación, aprobación y descarte.
- Panel de estadísticas y resultados comerciales.
- Publicación en redes, pagos, archivos adjuntos y generación de imágenes.
- Despliegue público, gráficos y animaciones decorativas.
- Reintentos automáticos complejos: para este corte, timeout/error visible y nueva solicitud explícita. Recuperar trabajos abandonados con un límite de intentos, sin bucles infinitos.

Esto es un **corte interno de desarrollo**, no el MVP completo ni un servicio listo para usuarios reales. Las exclusiones se recuperan en las siguientes entregas.

## 3. Reparto concreto entre los cinco

Estimación orientativa: **15–20 horas por integrante**, unas 75–100 horas-persona en total, suponiendo conocimientos básicos del stack. No confundir trabajo en paralelo con horas disponibles de una sola persona.

| Persona | Paquete | Resultado que entrega | Fecha límite interna |
|---|---|---|---|
| Enrique | Base técnica y acceso | API arrancable, conexión DB, login/logout, sesiones y protección por empresa | Viernes 16, 18:00 |
| Gonzalo | Contexto empresarial | Migraciones de su módulo, seed, empresa, marca, audiencia y catálogo persistentes | Viernes 16, 20:00 |
| Yoshua | Generación | Proveedor fake/real, contexto, jobs, worker y primera versión guardada | Sábado 17, 15:00 |
| Jorge | Interfaz base y negocio | Login, navegación, empresa/marca/audiencia y catálogo conectados | Sábado 17, 12:00 |
| Franco | Corte vertical y entrega | Estructura web inicial, pantalla generadora, biblioteca/detalle, integración y demo | Sábado 17, 18:00 |

**Cambio respecto al reparto general:** Franco implementa las pantallas de generación y biblioteca en este corte. Jorge no debe cargar con toda la interfaz.

### Enrique — Acceso y base técnica

- [ ] Crear estructura backend y configuración de entorno sin secretos.
- [ ] Dejar API + PostgreSQL arrancables y endpoint de salud.
- [ ] Implementar migraciones de usuarios/sesiones y login/logout con contraseñas hasheadas.
- [ ] Asociar sesión → usuario → empresa; usar cookie segura según entorno y protección CSRF.
- [ ] Dejar el helper/middleware de acceso para los demás módulos.
- [ ] Probar login correcto/incorrecto, logout y acceso cruzado.
- [ ] Revisar con Yoshua el ciclo de arranque del worker.

**Entregable:** desde una petición autenticada se obtiene la empresa propia; una petición sin sesión no entra y una sesión cerrada no vuelve a servir.

### Gonzalo — Datos y contexto

- [ ] Entregar ER recortado y migraciones de empresa, marca, audiencia y catálogo.
- [ ] Acordar con Enrique los IDs y relaciones usados en el seed.
- [ ] Crear dos empresas ficticias: agrícola y mantenimiento informático.
- [ ] Implementar lectura/edición de empresa, marca y audiencia inicial.
- [ ] Implementar crear/listar/editar catálogo con aislamiento por empresa.
- [ ] Validar campos requeridos y longitudes en servidor.
- [ ] Apoyar a Jorge con formularios de catálogo después de completar los endpoints.

**Entregable:** guardar, recargar y recuperar registros reales; un producto ajeno no puede consultarse ni utilizarse en una generación.

### Yoshua — Contexto, IA y worker

- [ ] Entregar primero un fake determinista que use nombre, producto y tono del snapshot.
- [ ] Implementar adaptador real con clave solo en el worker y timeout.
- [ ] Construir el contexto desde datos de la empresa autorizada; no aceptar contexto empresarial arbitrario del navegador.
- [ ] Crear migraciones de jobs, snapshots, intentos y reserva de cuota; coordinar las relaciones con Franco.
- [ ] Implementar alta idempotente de trabajo con `202` y consulta de estado.
- [ ] Implementar reclamación con lease y token de intento; no mantener una transacción abierta durante la llamada externa.
- [ ] Persistir versión y éxito atómicamente; índice único por trabajo para evitar resultados duplicados.
- [ ] Registrar fallo seguro y recuperar trabajos abandonados con intentos acotados.
- [ ] Probar que una respuesta tardía de un intento vencido no pisa un intento vigente.

**Entregable:** una publicación real basada en el producto seleccionado, con snapshot y versión guardados; un fallo no queda eternamente “procesando”.

### Jorge — Pantallas de acceso y negocio

- [ ] Definir navegación y componentes mínimos con Franco; nada de diseñar un sistema visual completo.
- [ ] Implementar login/logout y manejo de sesión expirada.
- [ ] Implementar formulario de empresa, marca y audiencia.
- [ ] Implementar listado y formulario de producto/servicio.
- [ ] Conectar todo a la API real, incluyendo CSRF.
- [ ] Resolver estados de carga, vacío, error y guardado.
- [ ] Comprobar el recorrido en pantalla pequeña y con teclado.

**Entregable:** crear y modificar el contexto comercial desde la interfaz sin herramientas manuales de API.

### Franco — Tu trabajo concreto

No te quedes solo coordinando: tu módulo visible es **generador + biblioteca**.

- [ ] Crear la base web y el cliente HTTP compartido con Jorge el primer día.
- [ ] Fijar con el equipo el contrato mínimo; anotar cualquier cambio antes de implementarlo.
- [ ] Crear la pantalla del generador: seleccionar producto/servicio, audiencia y objetivo.
- [ ] Mostrar un resumen del contexto autorizado antes de enviar.
- [ ] Enviar con clave idempotente, consultar estado y mostrar el resultado como texto seguro.
- [ ] Implementar migraciones de `contents` y `content_versions`, y lectura de biblioteca/detalle.
- [ ] No implementar edición ni aprobación todavía; mostrar solo la primera versión IA.
- [ ] Integrar el arranque de web/API/worker/DB con apoyo de Enrique.
- [ ] Ejecutar la lista de pruebas de esta entrega y preparar la demo.

**Entregable:** seleccionar un producto, generar, ver el texto y reabrirlo tras recargar; tú puedes explicar el recorrido completo.

## 4. Acuerdos de las primeras dos horas

Antes de que cada uno escriba código distinto:

1. Confirmar React + TypeScript, Go y PostgreSQL, o cambiar el stack de forma conjunta.
2. Confirmar con el docente qué evidencia acepta como “al menos un tercio”.
3. Crear repositorio y ramas por paquete; integrar a la principal diariamente.
4. Definir API bajo `/api/v1`, cookie de sesión, CSRF y un formato único de error.
5. Cerrar cuerpos y códigos de los endpoints de esta lista:

| Responsable | Rutas mínimas |
|---|---|
| Enrique | `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`, mecanismo de token CSRF |
| Gonzalo | `GET/PATCH /company`, `GET/PUT /company/brand`, `GET/PATCH /audiences/{id}`, `GET /audiences`, `GET/POST /catalog`, `GET/PATCH /catalog/{id}` |
| Yoshua | `POST /generation-preview`, `POST /generation-jobs`, `GET /generation-jobs/{id}` |
| Franco | `GET /contents`, `GET /contents/{id}` |

Los cuerpos y enums siguen [la ruta general](../RUTA_DESARROLLO.md); para este corte `campaign_id` es opcional y no se usa. La empresa y audiencia iniciales las crea el seed; no construir todavía un onboarding completo.

6. Acordar un error tipo `{ "code": "...", "message": "...", "request_id": "..." }`.
7. Crear respuestas simuladas para que las pantallas avancen mientras llegan los endpoints. **Nada se considera terminado hasta integrarlo con la API y DB reales.**

## 5. Calendario de aquí al lunes

| Día | Trabajo prioritario | Comprobación al cerrar |
|---|---|---|
| Miércoles 14 | Acuerdos, repositorio, contrato, base web/API, ER y prueba de proveedor | Todos arrancan la base; fake disponible y proveedor probado |
| Jueves 15 | Login, DB/seed, empresa/catálogo y pantallas contra contrato | Acceso y al menos una escritura real en DB; generador navegable |
| Viernes 16 | Conectar formularios, snapshot, trabajos y lectura de contenido | Empresa → producto → job → primera versión fake persistida |
| Sábado 17 | Conectar IA real, terminar worker y unir generador/biblioteca | Flujo real completo; cierre de funcionalidades a las 18:00 |
| Domingo 18 | Probar, corregir, repetir arranque y grabar respaldo | Dos recorridos exitosos consecutivos y ensayo de 6–8 minutos |
| Lunes 19 | Presentar la versión congelada | No instalar dependencias ni cambiar esquema antes de exponer |

### Puntos de decisión para no llegar con todo a medias

- **Jueves sin base arrancable:** reunión de desbloqueo; detener ajustes visuales y cerrar entorno/contrato.
- **Viernes sin recorrido fake persistido:** Enrique ayuda a Yoshua y Gonzalo ayuda a Jorge; Franco integra el único recorrido, no agrega funciones.
- **Sábado sin IA real:** usar fake para terminar y probar interfaz, pero registrar la integración real como pendiente. No afirmar que se cumplió el objetivo de generación con IA.
- **Domingo con fallos:** corregir flujo y datos; retirar pantallas incompletas de la navegación y listarlas como pendientes.

## 6. Pruebas obligatorias antes de presentar

- [ ] Login correcto, incorrecto y sesión cerrada.
- [ ] Guardar y volver a consultar empresa, marca, audiencia y producto.
- [ ] Generar a partir de un producto creado/editado desde la web, no solo del seed.
- [ ] Comprobar que el snapshot usa los datos guardados al solicitar, aunque luego se edite el producto.
- [ ] Solicitar dos veces con la misma clave y obtener el mismo trabajo.
- [ ] Reiniciar API/worker y conservar trabajos y contenido.
- [ ] Simular timeout o error externo y mostrar desenlace controlado.
- [ ] Intentar consultar producto, trabajo y contenido de la otra empresa: acceso rechazado.
- [ ] Reabrir un contenido desde la biblioteca después de recargar.
- [ ] No mostrar claves, cookies ni errores internos en navegador, repositorio o captura.
- [ ] Ejecutar el entorno desde otro equipo con el README.

## 7. Guion de presentación de 6–8 minutos

1. **Enrique — 1 min:** arquitectura del corte, acceso y separación de empresas.
2. **Gonzalo — 1 min:** contexto empresarial y producto persistidos.
3. **Jorge — 1 min:** modificar datos desde las pantallas.
4. **Yoshua — 2 min:** contexto, trabajo asíncrono y generación real.
5. **Franco — 1–2 min:** reabrir contenido, explicar trazabilidad, pruebas y próximos hitos.

Tener una generación real previa guardada y una grabación de respaldo. Si el proveedor falla en vivo, mostrar el fallo controlado y abrir el contenido previo; no presentar una simulación como llamada real.

## 8. Qué llevar el lunes

- Aplicación ejecutable con cuentas ficticias.
- README de arranque y variables sin secretos.
- ER del corte y un diagrama API → DB/cola → worker → proveedor.
- Lista de tareas terminadas con evidencia y pendientes separados.
- Resultado de las pruebas de la sección 6.
- Capturas o video del recorrido real.
- [Entrega 2](02-GESTION.md) y [Entrega 3](03-EVALUACION-Y-ENTREGA.md) como continuación.

**Estado actual:** planificación preparada; avance funcional todavía no demostrado. Cambiar este estado únicamente cuando existan código ejecutable y evidencias.

## 9. Si al final avanzas solo tú

Este reparto supone trabajo de los cinco. Si solo Franco programa, no comprometer este alcance completo para el lunes con la misma estimación.

Priorizar un recorrido más pequeño: contexto y producto precargados → selección → generación contextual → resultado persistido → consulta. Declarar que formularios, autenticación y resto de módulos están pendientes, ejecutar solo en entorno local controlado y validar con el docente si ese corte alcanza la evaluación requerida. No sustituir el trabajo faltante con un porcentaje inventado.
