# Ruta de desarrollo — ContentAI-PYME

**Grupo 07 · Aplicaciones Distribuidas**  
**Documento base del proyecto:** [ContentAI-PYME.md](ContentAI-PYME.md)

> Este documento es una propuesta ejecutable, no una descripción de una aplicación ya construida. El plazo, las tecnologías, los roles y los límites numéricos deben validarse con el equipo y el docente antes de comenzar.

## Prioridad inmediata: presentación del lunes

El trabajo se divide ahora en tres hitos. Para la presentación del **lunes 19 de octubre de 2026**, seguir [Entrega 1](entregas/01-LUNES.md), que recorta el alcance del cronograma original a un recorrido funcional mínimo. Después seguir [Entrega 2](entregas/02-GESTION.md) y [Entrega 3](entregas/03-EVALUACION-Y-ENTREGA.md).

Estos hitos no representan tres partes iguales en horas ni acreditan automáticamente un porcentaje académico. El plan original se conserva como referencia del producto completo; no se intenta ejecutar sus ocho semanas antes del lunes.

## 1. Supuestos y decisiones que deben cerrar primero

### 1.1. Plan de referencia

- **Duración:** 8 semanas, con 5 jornadas de planificación por semana; D01–D40 son jornadas relativas, no fechas calendario.
- **Equipo:** 5 integrantes.
- **Dedicación estimada:** 10–12 horas semanales por integrante; aproximadamente 400–480 horas-persona en total.
- **Producto:** una aplicación web funcional, desplegada y demostrable; no solo pantallas ni un prototipo de prompts.
- **Usuarios iniciales:** propietarios de pequeñas empresas; un propietario y una empresa por cuenta en el MVP.
- **Idioma inicial:** español.
- **Generación:** texto mediante un proveedor externo de IA, con una integración real y un proveedor simulado para pruebas.
- **Evaluación:** métricas internas del contenido y resultados comerciales registrados manualmente.

Si el equipo dispone de menos tiempo, recortar alcance siguiendo la sección 17, no eliminar seguridad, persistencia o pruebas del flujo principal.

### 1.2. Decisiones obligatorias de D01

| Decisión | Propuesta inicial | Evidencia para cerrarla |
|---|---|---|
| Fecha de entrega y rúbrica | Solicitar al docente | Fecha y requisitos anotados en `docs/alcance.md` |
| Arquitectura exigida | API + worker independiente + base compartida | Confirmación de si el curso exige microservicios o un broker específico |
| Tecnologías | React + TypeScript, Go y PostgreSQL | Acuerdo del equipo según conocimientos reales |
| Tiempo disponible | 10–12 h/persona/semana | Disponibilidad escrita de los cinco integrantes |
| Proveedor de IA | Elegir uno por calidad en español, precio y disponibilidad | Una llamada real exitosa y presupuesto aprobado |
| Infraestructura | Un servidor con contenedores y HTTPS | Acceso, responsable y costo mensual conocidos |
| Manejo de datos | Datos ficticios para desarrollo y demo | Acuerdo de no cargar datos personales de clientes |

**Puerta de salida:** si la rúbrica exige otra arquitectura o el equipo no maneja Go, ajustar esta ruta en D01–D02. No descubrirlo después de desarrollar la mitad del producto.

## 2. Objetivo verificable

Al terminar, una persona debe poder:

1. Crear una cuenta e iniciar sesión.
2. Registrar su empresa, identidad de marca y público objetivo.
3. Registrar al menos un producto o servicio y una campaña.
4. Solicitar contenido seleccionando esos datos.
5. Ver el estado de generación sin mantener una petición HTTP abierta durante toda la llamada de IA.
6. Obtener texto relacionado con los datos de su empresa.
7. Editar el resultado sin perder la versión original.
8. Aprobarlo o descartarlo.
9. Consultar historial y comparar versiones.
10. Registrar resultados de una publicación y revisar indicadores con sus limitaciones.

**Prueba central:** dos empresas que venden cosas diferentes deben recibir resultados distintos y ninguna debe poder consultar o modificar datos de la otra.

## 3. Alcance cerrado del MVP

### 3.1. Obligatorio

| Módulo | Incluye | No incluye inicialmente |
|---|---|---|
| Autenticación | Registro, login, logout, sesión y protección de rutas | Login social y administración avanzada de usuarios |
| Empresa | Nombre, rubro, descripción, propuesta de valor, ubicación y contactos comerciales públicos | Datos tributarios completos o facturación |
| Marca | Tono, valores, palabras preferidas y prohibidas, restricciones comerciales | Generador de logotipos |
| Audiencias | Segmentos con necesidades, intereses y ubicación | Perfiles de personas identificables |
| Catálogo | Productos y servicios, características, beneficios, precio opcional y moneda | Inventario, pagos o tienda electrónica |
| Campañas | Nombre, objetivo, fechas, canal y público objetivo | Automatizaciones de marketing |
| IA contextual | Constructor de contexto, cola persistente, límites y control de errores | Entrenamiento de modelos y búsqueda vectorial |
| Contenido | Editor de texto, versiones, aprobación, descarte, copia y descarga `.txt` | Publicación automática en redes |
| Evaluación | Indicadores internos y resultados comerciales manuales | Integraciones con APIs de estadísticas |
| Operación | Despliegue, logs, pruebas y backup restaurable | Alta disponibilidad multinodo |

### 3.2. Formatos obligatorios de primera entrega

1. Publicación para redes sociales.
2. Descripción de producto o servicio.
3. Anuncio publicitario.
4. Correo comercial.
5. Llamado a la acción.

Artículos, títulos, mensajes promocionales, textos web, ideas de campaña y texto para landing pages se agregan después de estabilizar estos cinco formatos. Una landing page significa **texto estructurado para la página**, no un constructor de sitios ni HTML ejecutable generado por IA.

### 3.3. Historias de usuario principales

| ID | Historia | Se considera terminada cuando… |
|---|---|---|
| HU01 | Como propietario, quiero acceder de forma segura | Puedo registrarme, entrar, salir y mi sesión deja de funcionar al salir |
| HU02 | Quiero registrar el contexto de mi empresa | Puedo guardar y recuperar empresa, marca y audiencias |
| HU03 | Quiero administrar lo que comercializo | Puedo crear, editar, listar y archivar productos y servicios |
| HU04 | Quiero organizar una campaña | Puedo vincular objetivo, canal y audiencia con una campaña |
| HU05 | Quiero generar contenido relevante | Selecciono datos de mi empresa y obtengo un resultado trazable |
| HU06 | Quiero revisar y mejorar el resultado | Puedo crear una edición, comparar versiones y aprobar o descartar |
| HU07 | Quiero consultar mis contenidos | Puedo filtrarlos por fecha, formato, campaña y estado |
| HU08 | Quiero evaluar resultados | Puedo registrar resultados manuales y consultar indicadores sin confundirlos con métricas automáticas |

## 4. Distribución propuesta del equipo

Los roles son una propuesta organizativa, no una evaluación de las habilidades de los integrantes. Cada responsable implementa, prueba y documenta su módulo; no se entrega todo el testing a una sola persona.

| Integrante | Responsabilidad principal | Entregables propios | Revisor habitual |
|---|---|---|---|
| Capillo Enrique Diego | Plataforma y seguridad de acceso | Estructura backend, autenticación, sesiones, aislamiento y CI | Franco |
| More Sulca Gonzalo | Datos y contexto empresarial | Modelo relacional, migraciones, empresa, marca, audiencias y catálogo | Enrique |
| Novoa Polo Yoshua Yampier | IA y procesamiento asíncrono | Constructor de contexto, proveedor, worker, reintentos y trazabilidad | Gonzalo |
| Honores Torres Jorge Alberto | Interfaz web e integración visual | Navegación, formularios, generador, editor y estados de interfaz | Yoshua |
| Saldarriaga Guerrero Franco | Contenidos, integración y entrega | API de versiones/campañas/evaluación, coordinación técnica, despliegue y pruebas de extremo a extremo | Jorge |

### Reglas para no crear cuellos de botella

- Jorge define los componentes y la navegación; el resto aporta integración de sus pantallas cuando corresponda.
- Franco integra el producto, pero no debe escribir ni corregir todos los módulos ajenos.
- Enrique deja CI y contenedores base; Franco termina y documenta el entorno de entrega.
- Gonzalo revisa toda migración que toque datos; el autor del módulo sigue siendo responsable de escribirla.
- Yoshua implementa IA detrás de un contrato; los demás trabajan desde D03 con respuestas simuladas.
- Cada módulo debe tener una segunda persona capaz de ejecutarlo y explicarlo.

## 5. Arquitectura propuesta

### 5.1. Stack

| Capa | Elección propuesta | Motivo |
|---|---|---|
| Web | React + TypeScript + Vite | Interfaz separada de la API y formularios tipados |
| API | Go con HTTP y módulos de negocio | Servicio pequeño, explícito y fácil de ejecutar |
| Procesamiento IA | Worker en Go, como proceso independiente | La generación no bloquea el ciclo de la petición web |
| Persistencia | PostgreSQL 17 | Datos relacionales, transacciones y cola persistente |
| Contratos | OpenAPI versionado en el repositorio | Permite frontend y backend en paralelo |
| Entorno | Docker Compose | Reproducir web, API, worker y base de datos |
| Entrada pública | Proxy inverso con HTTPS | Un mismo origen para web y `/api` |
| Automatización | GitHub Actions | Ejecutar controles en cada propuesta de cambio |

Fijar versiones y dependencias en D02; no utilizar imágenes `latest` en la entrega. Las bibliotecas concretas de formularios, rutas, SQL y pruebas se eligen ese día y se conservan salvo un bloqueo real.

### 5.2. Componentes y comunicación

```text
Navegador
    |
    | HTTPS, mismo origen
    v
Proxy inverso
    |-- /       -> archivos de la aplicación web
    |-- /api/*  -> API Go
                     |
                     | transacciones y consultas
                     v
                 PostgreSQL
                     ^
                     | reclama trabajos y guarda resultados
                  Worker Go
                     |
                     | HTTPS con timeout
                     v
                 Proveedor IA
```

- API y worker son procesos desplegables por separado, aunque compartan repositorio y módulos de dominio.
- La cola de generación vive en PostgreSQL; no agregar Redis y un broker adicional sin necesidad.
- Dos workers deben poder competir por trabajos sin guardar dos resultados del mismo intento válido.
- El frontend consulta el estado del trabajo mediante polling; WebSockets y streaming quedan fuera del MVP.
- Esta es una arquitectura distribuida sencilla con base compartida, **no una arquitectura de microservicios independientes**. La aceptación académica depende de la rúbrica del curso.

### 5.3. Estructura inicial del repositorio

```text
contentai-pyme/
├── apps/
│   ├── web/
│   └── backend/
│       ├── cmd/api/
│       ├── cmd/worker/
│       └── internal/
│           ├── auth/
│           ├── company/
│           ├── catalog/
│           ├── campaign/
│           ├── generation/
│           ├── content/
│           ├── analytics/
│           └── platform/
├── db/
│   ├── migrations/
│   └── seeds/
├── contracts/openapi.yaml
├── infra/
├── tests/e2e/
├── docs/
├── compose.yaml
├── .env.example
└── README.md
```

`internal/platform/` concentra conexión a base, configuración, logs y utilidades técnicas; no debe convertirse en un contenedor de toda la lógica de negocio.

## 6. Modelo de datos que deben diseñar antes de los endpoints

### 6.1. Entidades mínimas

| Tabla | Campos o relaciones principales | Regla esencial |
|---|---|---|
| `users` | id, email, password_hash, created_at | Email normalizado y único |
| `sessions` | token_hash, user_id, expires_at | Token aleatorio; guardar hash, no el token en claro |
| `companies` | id, owner_user_id, nombre, rubro, descripción, propuesta_valor, ubicación, contacto | `owner_user_id` único en el MVP |
| `brand_profiles` | company_id, tono, valores, palabras_preferidas/prohibidas, restricciones | Un perfil por empresa |
| `audiences` | id, company_id, nombre, necesidades, intereses, ubicación | Segmentos, no fichas de personas |
| `catalog_items` | id, company_id, tipo, nombre, descripción, características, beneficios, precio, moneda, archived_at | `tipo`: producto o servicio; precio no negativo |
| `campaigns` | id, company_id, nombre, objetivo, audience_id, canal, fechas, archived_at | Fin no anterior al inicio |
| `contents` | id, company_id, campaign_id, tipo, canal, current_version_id, estado, revision | Estado y versión activa son explícitos |
| `generation_jobs` | id, company_id, content_id, input_hash, idempotency_key, estado, intentos, next_attempt_at, lease_until, attempt_token, error_code | Cola persistente con arrendamiento temporal |
| `generation_contexts` | job_id, company_id, snapshot_json, prompt_template_version, context_hash | Snapshot inmutable construido por el servidor |
| `generation_attempts` | id, job_id, número, proveedor/modelo, request_id, tiempos, tokens, costo_estimado, resultado | Registrar también fallos y datos desconocidos como tales |
| `usage_counters` | company_id, fecha_utc, solicitudes_reservadas | Reserva atómica de cuota; no contar dos veces una clave idempotente |
| `content_versions` | id, company_id, content_id, número, parent_version_id, origen, texto, generation_job_id, autor, created_at | Texto inmutable; origen IA o humano |
| `content_reviews` | id, company_id, content_id, version_id, acción, motivo, user_id, created_at | Aprobación/descarte apunta a una versión concreta |
| `publication_results` | id, company_id, version_id, canal, referencia_publicación, periodo, impresiones, clics, conversiones, notas | Datos manuales; no implican publicación desde la plataforma |
| `audit_events` | id, company_id, actor_user_id, entidad, entidad_id, acción, cambios_permitidos, created_at | Historial de correcciones de resultados; excluir secretos |

### 6.2. Reglas de integridad

1. Todas las entidades del negocio llevan `company_id`; usuarios y sesiones son globales.
2. La empresa autorizada se obtiene de la sesión. No confiar en un `company_id` enviado por el navegador.
3. Las relaciones entre campaña, audiencia, catálogo, contenido y versión deben comprobar la misma empresa; utilizar claves foráneas compuestas donde corresponda.
4. `UNIQUE(content_id, número)` para versiones; asignar número dentro de una transacción con bloqueo del contenido.
5. `UNIQUE(company_id, idempotency_key)` para solicitudes de generación.
6. Un trabajo solo puede producir una versión IA persistida: restricción única sobre `content_versions.generation_job_id` cuando existe.
7. El contexto se conserva aunque luego cambie el producto, la marca o la campaña.
8. Archivar catálogo y campañas en lugar de borrar registros usados en contenido histórico.
9. Fechas en UTC; dinero con decimal y moneda, nunca flotante binario.
10. Migraciones versionadas; probar creación desde cero y actualización de una base de prueba previa.
11. Restricciones para estados válidos, contadores no negativos, campos requeridos y longitudes máximas.
12. Índices por `(company_id, created_at)`, claves de relación y cola por estado/fecha de siguiente intento. Verificar su utilidad con consultas reales.

**Entregable previo al desarrollo de módulos:** diagrama entidad-relación, diccionario de datos y primeras migraciones revisadas por otra persona.

## 7. Contrato HTTP mínimo

### 7.1. Convenciones

- Prefijo: `/api/v1`.
- JSON en peticiones y respuestas; fechas ISO 8601 en UTC e identificadores UUID.
- Listados con `page`, `page_size` y máximo de 100 elementos por página.
- Respuestas de error uniformes con `code`, `message`, `field_errors` opcional y `request_id`.
- `401`: sin sesión válida; `404`: recurso inexistente o ajeno; `409`: conflicto de estado o concurrencia; `422`: datos inválidos; `429`: límite excedido.
- Una clave de idempotencia repetida con otro cuerpo devuelve `409`.
- Validación de permisos y propiedad en cada endpoint, también en trabajos, versiones y estadísticas.
- Todas las operaciones mutables autenticadas requieren protección CSRF, además de cookies adecuadas.

### 7.2. Endpoints

| Área | Método y ruta | Resultado esperado |
|---|---|---|
| Acceso | `POST /auth/register` | Cuenta creada; establecer claramente si también inicia sesión |
| Acceso | `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` | Manejo de sesión |
| Empresa | `POST /company`, `GET /company`, `PATCH /company` | Crear y mantener la empresa propia |
| Marca | `GET /company/brand`, `PUT /company/brand` | Consultar y reemplazar perfil de marca |
| Audiencias | `GET/POST /audiences`, `GET/PATCH /audiences/{id}` | Listar, crear y editar segmentos |
| Catálogo | `GET/POST /catalog`, `GET/PATCH /catalog/{id}` | Productos y servicios; archivar mediante edición |
| Campañas | `GET/POST /campaigns`, `GET/PATCH /campaigns/{id}` | Organización comercial |
| Contexto | `POST /generation-preview` | Vista de contexto empresarial permitido, sin revelar instrucciones internas ni secretos |
| Generación | `POST /generation-jobs` | `202 Accepted`, con `job_id` y `content_id` |
| Trabajo | `GET /generation-jobs/{id}` | Estado y referencia a resultado o error seguro |
| Contenido | `GET /contents`, `GET /contents/{id}` | Biblioteca y detalle |
| Versiones | `GET/POST /contents/{id}/versions` | Historial o nueva versión humana |
| Versión activa | `PATCH /contents/{id}/current-version` | Seleccionar una versión y volver a borrador si corresponde |
| Revisión | `POST /contents/{id}/reviews` | Aprobar o descartar una versión específica |
| Exportación | `GET /contents/{id}/export?version_id=...` | Archivo de texto de una versión propia |
| Resultados | `GET/POST /publication-results`, `PATCH /publication-results/{id}` | Registrar o corregir datos manuales |
| Indicadores | `GET /analytics/summary` | Métricas con filtros y denominadores documentados |
| Operación | `GET /health/live`, `GET /health/ready` | Proceso activo y dependencias necesarias disponibles |

Registrar en OpenAPI cuerpos, ejemplos, enums, validaciones y respuestas de error. La tabla anterior no reemplaza el contrato completo.

### 7.3. Ejemplo de solicitud de generación

```json
{
  "catalog_item_id": "uuid-del-producto-o-servicio",
  "audience_id": "uuid-de-la-audiencia",
  "campaign_id": "uuid-de-la-campana",
  "content_type": "social_post",
  "channel": "instagram",
  "objective": "Conseguir solicitudes de información",
  "additional_instructions": "Destacar la atención local",
  "length": "short"
}
```

Enviar `Idempotency-Key` en cabecera. Para regenerar, permitir además `content_id` y `base_version_id` de la misma empresa. El contrato debe precisar qué campos son obligatorios según el formato; una generación genérica puede no tener producto, pero sí necesita empresa y marca completas.

## 8. Flujo exacto de generación contextualizada

### 8.1. Preparación en la API

1. Verificar sesión, cuota y tamaño del cuerpo.
2. Validar formato, canal, instrucciones y referencias de la empresa propia.
3. Verificar información mínima: empresa, rubro, descripción, tono y público seleccionado.
4. Leer empresa, marca, audiencia, producto/servicio y campaña dentro de una transacción con vista consistente.
5. Construir un snapshot con datos permitidos, no con registros completos indiscriminados.
6. Aplicar límites deterministas y excluir campos innecesarios o secretos.
7. Guardar contenido inicial —si es nuevo—, snapshot y trabajo en la misma transacción.
8. Confirmar la transacción y responder `202`. No llamar al proveedor desde esta transacción.

### 8.2. Procesamiento en el worker

1. Reclamar un trabajo elegible con bloqueo de fila y `SKIP LOCKED`.
2. Marcarlo `running`, incrementar intento y asignar `lease_until` y `attempt_token`; confirmar inmediatamente.
3. Construir el prompt usando el snapshot y la versión de plantilla guardada.
4. Llamar al proveedor fuera de la transacción y con timeout.
5. Validar salida: texto presente, longitud permitida y estructura requerida por el formato.
6. Guardar intento, versión y estado `succeeded` en una transacción, comprobando que el token de intento siga vigente.
7. Si un worker perdió su arrendamiento, impedir que sobrescriba el resultado de un intento posterior.
8. Ante error, clasificarlo, registrar el intento y programar reintento o fallo terminal.

### 8.3. Estados

```text
Trabajo:
queued -> running -> succeeded
              |
              +-> retry_wait -> running
              |
              +-> failed

Contenido:
draft -> approved
draft -> discarded
approved/discarded -> draft  (al editar o cambiar la versión activa)
```

- Un trabajo inicial pendiente puede tener contenido sin versiones; la interfaz no muestra un editor vacío como si ya hubiera resultado.
- Una edición siempre crea versión; nunca modifica el texto histórico.
- Una regeneración agrega una versión candidata y no pisa una edición hecha mientras la IA respondía.
- Solo la primera versión puede activarse automáticamente si aún no existe versión activa. Las siguientes requieren selección explícita.
- Aprobar implica aprobar la versión activa actual; usar `revision` para rechazar acciones sobre estados desactualizados con `409`.

### 8.4. Política inicial de límites y fallos

Valores propuestos, ajustables por configuración después de medir:

| Parámetro | Valor inicial |
|---|---|
| Generaciones solicitadas por empresa/día | 30 |
| Trabajos pendientes o en curso por empresa | Máximo 3 |
| Concurrencia del worker | 2 llamadas externas |
| Tamaño máximo del cuerpo HTTP | 64 KiB |
| Instrucciones adicionales | 1 000 caracteres |
| Contexto serializado | Máximo 12 000 caracteres; límite de tokens específico del modelo adicional |
| Timeout de llamada IA | 45 segundos |
| Arrendamiento de trabajo | 90 segundos; superior al timeout y al margen de guardado |
| Reintentos automáticos | Máximo 3 intentos totales, esperas base de 5 y 20 s con jitter |
| Polling web | Cada 2 s al inicio; después 5 s; detener al terminar y pausar con pestaña oculta |
| Presupuesto externo | Monto aprobado en D01, alerta y límite duro del proveedor si está disponible |

- Reintentar `429` y errores transitorios del proveedor según su contrato; respetar `Retry-After` dentro de un máximo configurado.
- Reservar cuota al aceptar un trabajo nuevo, no en cada intento. Una solicitud rechazada no consume cuota; un trabajo aceptado sí, aunque termine fallando. Indicar esta política en la interfaz.
- Errores de credenciales, validación o configuración no deben entrar en un bucle de reintentos.
- Un timeout puede ocurrir después de que el proveedor procese y cobre una solicitud. Si admite idempotencia o consulta por identificador, utilizarla; si no, documentar el riesgo de cobro repetido y limitar reintentos.
- Una cola con arrendamientos ofrece procesamiento al menos una vez; no prometer ejecución externa exactamente una vez.
- La restricción única y el token de intento evitan duplicados persistidos, no garantizan ausencia de llamadas externas duplicadas.
- Tras agotar intentos, mostrar error recuperable y permitir una nueva solicitud explícita con nueva clave.

### 8.5. Reglas del prompt

Separar:

1. Instrucciones del sistema y restricciones.
2. Datos de la empresa tratados como información, no como instrucciones privilegiadas.
3. Formato, canal, longitud y objetivo.
4. Solicitud concreta del usuario.

Indicar expresamente que no se inventen precios, descuentos, certificaciones, testimonios, resultados garantizados ni contactos. Si faltan datos, omitirlos o avisar; no completar con hechos ficticios.

No enviar contraseñas, sesiones, claves API ni datos de clientes. La separación de campos y las instrucciones reducen riesgos de prompt injection, pero no los eliminan: no dar herramientas ni permisos de ejecución al modelo y mantener revisión humana.

## 9. Pantallas y orden de construcción

| Orden | Pantalla | Debe resolver |
|---|---|---|
| 1 | Registro e inicio de sesión | Validación, errores y sesión expirada |
| 2 | Configuración inicial | Empresa, marca, primera audiencia y acceso al catálogo |
| 3 | Empresa y marca | Edición persistente del contexto |
| 4 | Audiencias y catálogo | Listados, formularios, estados vacíos y archivo |
| 5 | Campañas | Objetivo, audiencia, canal y fechas |
| 6 | Generador | Selecciones, contexto visible, cuota y envío idempotente |
| 7 | Estado de generación | En cola, procesando, error, reintento y resultado |
| 8 | Editor e historial | Edición, versión activa, comparación, aprobación y descarte |
| 9 | Biblioteca | Búsqueda y filtros paginados |
| 10 | Resultados y panel | Registro manual, indicadores y etiquetas de procedencia |

### Requisitos transversales de interfaz

- Cada pantalla contempla carga, vacío, error y éxito.
- Formularios conservan datos ante errores del servidor.
- Botones de envío deshabilitan doble clic mientras se procesa, sin sustituir la idempotencia del backend.
- Navegación por teclado, etiquetas de campos, foco visible y contraste adecuado.
- Diseño utilizable desde 360 px de ancho; verificar en un teléfono real.
- El texto de la IA se representa como texto seguro; nunca se inserta como HTML sin sanitización.
- Cambios sin guardar se advierten antes de abandonar el editor.
- Mostrar que el resultado requiere revisión humana y no se ha publicado automáticamente.

## 10. Backlog con responsables, dependencias y aceptación

**Leyenda:** E = Enrique; G = Gonzalo; Y = Yoshua; J = Jorge; F = Franco. Un ticket no pasa a terminado sin revisión, pruebas y documentación correspondiente.

| ID | Responsable | Trabajo concreto | Depende de | Criterio de aceptación |
|---|---|---|---|---|
| T01 | F + todos | Cerrar alcance, rúbrica y stack | — | Decisiones de D01 documentadas y aceptadas |
| T02 | E | Crear repositorio, carpetas y controles CI | T01 | Un clon limpio puede ejecutar los controles |
| T03 | G | Diseñar ER y diccionario de datos | T01 | Relaciones y aislamiento revisados por E |
| T04 | E + J | Definir contrato OpenAPI y respuestas simuladas | T01, T03 | Los cinco conocen los cuerpos y códigos de sus rutas |
| T05 | E | Preparar contenedores, configuración y health checks | T02 | API y base arrancan con configuración de ejemplo |
| T06 | G | Escribir migraciones y seed de dos empresas ficticias | T03, T05 | Crear base vacía y cargar datos funciona sin edición manual |
| T07 | E | Registro, sesiones, logout y autorización empresarial | T04, T06 | Pruebas de sesión y acceso cruzado pasan |
| T08 | J | Base web, rutas, layout y cliente HTTP | T02, T04 | Navegación y manejo uniforme de `401` y errores |
| T09 | G | API de empresa y marca | T07 | Guardado y lectura aislados por empresa |
| T10 | J | Pantallas de acceso y configuración inicial | T08, T09 | Flujo real de cuenta a empresa completado |
| T11 | G | API de audiencias y catálogo | T09 | CRUD acordado y archivo, con validaciones |
| T12 | J + G | Formularios de audiencias y catálogo | T10, T11 | Crear producto y servicio sin llamadas manuales |
| T13 | F | API de campañas | T11 | Campaña válida con audiencia propia; referencias ajenas rechazadas |
| T14 | Y | Interfaz de proveedor IA, adaptador real y fake | T04, T05 | Ambos producen el mismo contrato; la clave nunca llega al navegador |
| T15 | Y + G | Constructor de contexto y vista previa | T09, T11, T13 | Snapshot determinista y solo con datos permitidos |
| T16 | F | Persistencia de contenido y versiones | T06, T07 | Crear versión no sobrescribe originales; concurrencia probada |
| T17 | Y | Alta idempotente de trabajos y cuotas | T15, T16 | Misma clave/cuerpo devuelve mismo trabajo; cuerpo distinto da `409` |
| T18 | Y | Worker, arrendamientos y guardado atómico | T14, T17 | Un trabajo termina y dos workers no duplican la versión |
| T19 | J + Y | Pantalla de generación y polling | T12, T17, T18 | Solicitud real pasa de cola a resultado en la web |
| T20 | Y | Reintentos, timeouts y recuperación de trabajos | T18 | Fallo del proveedor y caída del worker tienen desenlace controlado |
| T21 | F | Selección de versión, aprobación y descarte | T16 | Transiciones válidas y rechazo de revisión desactualizada |
| T22 | J + F | Editor, historial y comparación | T19, T21 | Se conserva original y se aprueba una edición concreta |
| T23 | F | Listados, filtros y exportación | T16, T21 | Paginación y descarga solo de contenido propio |
| T24 | J | Biblioteca y pantalla de campañas | T13, T23 | Filtros y formularios consumen API real |
| T25 | F + G | Registro manual de resultados e indicadores | T21 | Fórmulas, periodo y procedencia documentados y probados |
| T26 | J | Panel y formulario de resultados | T25 | Ceros, ausencias de datos y filtros se muestran correctamente |
| T27 | E + Y | Endurecimiento de acceso, cuotas y logs | T07, T20, T23 | Sin secretos en logs; límites y autorización comprobados |
| T28 | F + todos | Pruebas E2E y regresión integrada | T22, T24, T26, T27 | Flujos centrales automáticos y hallazgos priorizados |
| T29 | F + E | Desplegar, HTTPS, backup y restauración | T05, T27 | URL funcional y restauración demostrada en base separada |
| T30 | Y + todos | Evaluar calidad contextual con casos repetibles | T19, T22 | Resultados registrados, sin ocultar fallos |
| T31 | F + todos | Documentación, ensayo y entrega | T28, T29, T30 | Demo repetible y cada integrante explica su módulo |

Los tickets grandes deben dividirse en subtareas de aproximadamente 2–6 horas. Si una tarea supera una jornada disponible, dividirla por contrato, implementación, pruebas e integración; no mantenerla una semana como “80 %”.

## 11. Cronograma de 8 semanas

### Semana 1 — Base y contratos · D01–D05

**Objetivo:** todos pueden trabajar sin bloquearse por falta de acuerdos.

- **D01:** T01; reparto validado, rúbrica, presupuesto y decisión de arquitectura.
- **D02:** T02 y T03; fijar versiones, estructura y modelo de datos.
- **D03:** T04 y T05; contrato inicial y entorno reproducible.
- **D04:** T06, T08 y comienzo de T14; seed, navegación y prueba del proveedor.
- **D05:** revisión cruzada y ejecución desde un clon limpio; corregir bloqueos antes de agregar módulos.

**Salida verificable:** repositorio, CI, contrato, ER, contenedores y web mínima; cada integrante puede arrancar el proyecto.

### Semana 2 — Cuenta y contexto empresarial · D06–D10

**Objetivo:** guardar y consultar datos reales con aislamiento.

- E completa T07; G desarrolla T09 y T11.
- J completa T10 y empieza T12.
- Y completa T14 y prepara pruebas del constructor de contexto.
- F prepara T16 y las pruebas de integración del flujo de acceso.
- **D10:** demostración cuenta → empresa → marca → audiencia → catálogo.

**Salida verificable:** dos cuentas con empresas distintas; la cuenta A no puede leer ni editar registros de B.

### Semana 3 — Campañas, snapshots y cola · D11–D15

**Objetivo:** generar trabajos persistentes con un proveedor simulado.

- G y J completan T12; F implementa T13 y termina T16.
- Y completa T15 y T17 y empieza T18.
- E revisa permisos, migraciones y contratos; integra tests en CI.
- J prepara la pantalla T19 contra el contrato y el fake.
- **D15:** demo producto → campaña → snapshot → trabajo → versión fake.

**Salida verificable:** el snapshot corresponde a la empresa seleccionada y el trabajo sobrevive a reiniciar la API.

### Semana 4 — IA real y resiliencia · D16–D20

**Objetivo:** cerrar el recorrido de generación contextualizada real.

- Y completa T18 y T20; J y Y cierran T19.
- F implementa T21; G prueba integridad de snapshots y relaciones.
- E prueba dos workers concurrentes y errores de configuración.
- **D18:** primera generación real visible desde la web.
- **D19:** probar timeout, `429`, caída de worker y recuperación.
- **D20:** demo de dos empresas con contextos diferentes y evidencia de trazabilidad.

**Salida verificable:** no hay secretos en el cliente, la solicitud web no espera toda la llamada IA y los fallos no quedan eternamente “procesando”.

### Semana 5 — Gestión del contenido · D21–D25

**Objetivo:** pasar de generador a herramienta de trabajo.

- F y J completan T22, T23 y T24.
- Y verifica regeneración concurrente con edición humana.
- G revisa historial e integridad; E valida autorización de versiones y descargas.
- **D25:** demo generar → editar → comparar → seleccionar versión → aprobar → filtrar → exportar.

**Salida verificable:** una regeneración no borra una edición y toda aprobación identifica el texto aprobado.

### Semana 6 — Evaluación e integración · D26–D30

**Objetivo:** cerrar el MVP y medir lo que realmente se puede medir.

- F y G completan T25; J completa T26.
- E y Y completan T27; todos comienzan T28 y T30.
- Probar al menos tres negocios ficticios: agrícola, soporte informático y un tercer rubro.
- **D30:** congelar nuevas funcionalidades; registrar pendientes como errores o mejoras futuras.

**Salida verificable:** flujo completo con resultados manuales y panel; no se presentan datos simulados como estadísticas reales de redes.

### Semana 7 — Despliegue y pruebas de entrega · D31–D35

**Objetivo:** convertir el MVP en una entrega reproducible.

- F y E completan T29; todos terminan T28 y T30.
- Restaurar backup en una base distinta, comprobar conteos y abrir contenido histórico.
- Revisar móvil, navegación por teclado y errores de sesión/red.
- Corregir primero exposición de datos, pérdida de información, fallos de arranque y bloqueos del flujo principal.
- **D35:** candidato de entrega desplegado y validado desde un equipo ajeno al desarrollo.

**Salida verificable:** URL con HTTPS, backup restaurable, pruebas principales aprobadas y lista de limitaciones conocidas.

### Semana 8 — Reserva, documentación y sustentación · D36–D40

**Objetivo:** entregar sin cambios estructurales de última hora.

- **D36–D37:** corregir regresiones; no cambiar stack, arquitectura ni esquema sin necesidad crítica.
- **D38:** completar T31 y ensayar la demo con tiempo medido.
- **D39:** repetir instalación, ejecutar tests y verificar credenciales/configuración de entrega.
- **D40:** entregar versión etiquetada, documentación, evidencias y respaldo de la demostración.

**Salida verificable:** un evaluador puede ejecutar el sistema siguiendo el README y el equipo puede explicar decisiones, fallos y limitaciones.

## 12. Precisión de la evaluación

### 12.1. Métricas internas automáticas

- Solicitudes y contenidos generados por formato y campaña.
- Trabajos exitosos y fallidos; tasa de éxito = exitosos / trabajos terminales.
- Tiempo de espera en cola separado del tiempo de llamada al proveedor.
- Cantidad de versiones humanas y de IA.
- Contenidos actualmente aprobados / contenidos que tienen al menos una versión.
- Tokens y costo estimado cuando el proveedor entrega información suficiente; de lo contrario mostrar “no disponible”.

No mezclar cantidad de aprobaciones históricas con cantidad de contenidos actualmente aprobados. No sumar varias versiones de un mismo contenido como si fueran publicaciones independientes.

### 12.2. Resultados comerciales manuales

Cada registro identifica versión, canal, referencia de publicación y periodo. Se permiten correcciones auditables para no obligar al usuario a crear duplicados cuando actualiza resultados acumulados.

- CTR = clics / impresiones × 100.
- Conversión = conversiones / clics × 100, usando una definición de conversión documentada.
- Con denominador cero, mostrar “sin datos suficientes”, no infinito ni un porcentaje inventado.
- Para agregar campañas, sumar numeradores y denominadores compatibles; no promediar porcentajes sin ponderación.
- Evitar sumar periodos superpuestos de la misma publicación. En el MVP, definir un único registro acumulado por referencia y periodo y rechazar duplicados exactos.
- Mostrar tamaño de muestra y origen manual.

**Límite de interpretación:** una versión con mejor CTR observado no demuestra que el prompt o la IA causaran ese resultado. Influyen audiencia, canal, fecha, inversión y tamaño de muestra; el MVP compara observaciones, no ejecuta experimentos causales.

## 13. Matriz mínima de pruebas

| ID | Caso | Resultado esperado |
|---|---|---|
| P01 | Registro y email repetido | Validación clara y sin segunda cuenta duplicada |
| P02 | Login erróneo, sesión vencida y logout | No hay acceso posterior ni exposición de información |
| P03 | Cuenta A consulta IDs de B | `404` en catálogo, campañas, jobs, versiones, exportación e indicadores |
| P04 | A usa audiencia o producto de B en su generación | Rechazo antes de crear trabajo o llamar a IA |
| P05 | Editar empresa después de solicitar contenido | El trabajo conserva el snapshot original |
| P06 | Dos envíos con misma clave y cuerpo | Mismo trabajo y una reserva de cuota |
| P07 | Misma clave con cuerpo distinto | `409`, sin otra llamada externa |
| P08 | Dos workers reclaman la cola | No reclaman simultáneamente el mismo intento vigente |
| P09 | Worker muere antes y después de llamar a IA | Recuperación por lease; riesgo de llamada repetida documentado; una sola versión persistida |
| P10 | Worker antiguo responde tras perder lease | No sobrescribe el intento vigente |
| P11 | Proveedor devuelve `429`, `5xx`, timeout o salida inválida | Reintentos acotados o fallo claro, según clasificación |
| P12 | Usuario edita mientras se regenera | Edición preservada y nueva candidata visible |
| P13 | Aprobar una versión activa desactualizada | `409`; no se aprueba otro texto por accidente |
| P14 | Cadenas con HTML/script y SQL | Texto seguro, consultas parametrizadas, sin ejecución |
| P15 | Cuota diaria y máximo de pendientes | Rechazo atómico incluso con solicitudes concurrentes |
| P16 | CTR con cero impresiones o datos ausentes | Etiqueta correcta y sin división por cero |
| P17 | Archivar producto usado previamente | Historial y contexto antiguo siguen consultables |
| P18 | Reiniciar API y worker con trabajos pendientes | Cola conservada y procesamiento recuperado |
| P19 | Instalar desde cero y aplicar migraciones | Sistema operativo sin cambios manuales en la base |
| P20 | Restaurar backup y usar la web | Empresas, versiones y revisiones recuperadas |
| P21 | Flujo principal en móvil y con teclado | Sin controles inaccesibles ni desbordes que bloqueen tareas |
| P22 | Petición mutable sin token CSRF | Rechazada sin modificar datos |

### Tipos de pruebas

- **Unitarias:** constructor de contexto, validaciones, transiciones, fórmulas y clasificación de errores.
- **Integración con PostgreSQL real:** aislamiento, restricciones, idempotencia, cuotas, concurrencia y migraciones.
- **Contrato:** cuerpos y códigos de respuesta corresponden al OpenAPI.
- **E2E con fake:** flujo completo determinista, ejecutable en CI sin costo de IA.
- **Smoke con IA real:** ejecución controlada fuera de CI en los hitos D18, D20 y antes de entrega; nunca exigir texto idéntico.

### Evaluación de calidad de IA

Preparar al menos 15 casos: 3 negocios × 5 formatos. Registrar entrada, snapshot, plantilla, modelo, resultado y revisión humana.

Evaluar de 1 a 5: relevancia para el negocio, adaptación a audiencia, tono, utilidad y adecuación al formato. Revisar aparte afirmaciones no respaldadas y palabras prohibidas como incumplimientos, no esconderlas detrás de un promedio.

**Objetivo inicial de entrega:** al menos 12 de 15 casos considerados utilizables con edición menor por dos integrantes, y ningún incumplimiento crítico conocido sin corregir. Si no se alcanza, ajustar contexto/plantillas, repetir y conservar ambos resultados.

## 14. Seguridad y operación desde el inicio

- Contraseñas con un algoritmo de hash recomendado para contraseñas y parámetros documentados; nunca texto plano ni cifrado reversible.
- Cookies de sesión `HttpOnly`, `Secure` en HTTPS y `SameSite`; token CSRF en operaciones mutables.
- HTTPS en despliegue y mismo origen para reducir complejidad de cookies y CORS.
- Límites de login, registro y generación; cuotas atómicas por empresa y control global de concurrencia.
- Consultas SQL parametrizadas y validación de tamaños/enums en servidor.
- API key solo en variables o secretos del backend/worker; nunca en frontend, seed o repositorio.
- `.env.example` contiene nombres y valores ficticios; `.env` queda fuera de Git.
- Logs estructurados con `request_id`, `job_id`, tiempos y códigos; no registrar cookies, tokens, contraseñas ni prompts completos por defecto.
- Mensajes públicos sin stack traces ni respuesta cruda del proveedor.
- Health checks no deben llamar al proveedor de pago; readiness comprueba las dependencias que necesita cada proceso.
- Acceso a la base y a sus copias limitado al equipo autorizado; persistencia en volúmenes, no solo dentro del contenedor.
- Backup diario durante uso del servidor y antes de migraciones; retención inicial de 7 días. Guardar al menos una copia fuera del servidor y ensayar restauración.
- Datos de prueba ficticios. Si se habilitan usuarios reales, definir aviso de privacidad, consentimiento para envío a IA, retención y procedimiento de eliminación antes de abrir el registro público.
- El MVP no debe presentarse como servicio público terminado sin recuperación de acceso, verificación de correo y otros controles que la exposición requiera.

## 15. Forma de trabajo y definición de terminado

### Tablero

`Pendiente → Listo para desarrollar → En desarrollo → En revisión → En validación → Terminado`

- Un ticket principal en desarrollo por persona; ayudar a integrar antes de iniciar otro.
- Cada ticket indica responsable, dependencia, aceptación y evidencia.
- Actualización breve diaria en el canal del equipo: hecho, siguiente y bloqueo.
- Dos reuniones semanales de 20–30 minutos y una demo de cierre de semana.
- Un bloqueo de más de una jornada se comunica y se resuelve o se replantea la tarea.

### Git y revisión

- Rama principal siempre ejecutable; ramas cortas por ticket: `feat/T17-generation-jobs`, por ejemplo.
- Propuesta de cambio pequeña, con una revisión de otra persona y controles aprobados.
- Contrato, migración y cambio de código deben llegar coordinados; no romper a quien desarrolla contra la versión anterior sin aviso.
- No modificar una migración ya compartida/aplicada: crear una nueva.
- No subir credenciales, bases con datos personales ni archivos de configuración privados.

### Un ticket está terminado solo si

- [ ] Cumple todos sus criterios de aceptación.
- [ ] Funciona con la API/base reales cuando corresponda, no solo con un mock.
- [ ] Incluye validación y tratamiento de errores.
- [ ] Incluye pruebas proporcionadas a su riesgo.
- [ ] No permite acceso cruzado entre empresas.
- [ ] Actualiza contrato/documentación/migraciones si aplica.
- [ ] Pasó revisión por otra persona y CI.
- [ ] Existe evidencia reproducible en el ticket o demo.

## 16. Riesgos y respuesta prevista

| Riesgo | Prevención | Respuesta si ocurre |
|---|---|---|
| Rúbrica exige microservicios/broker | Validación en D01 | Rediseñar antes de implementar; actualizar esfuerzo y alcance |
| Stack desconocido | Prueba mínima y acuerdo en D01–D02 | Elegir un stack conocido manteniendo contratos y flujo |
| IA cara o sin acceso | Presupuesto y adaptador fake desde semana 1 | Mantener desarrollo con fake; documentar que la integración real aún no cumple |
| Contenido inventa datos | Contexto acotado, reglas y revisión humana | Ajustar plantilla, registrar caso y repetir evaluación |
| Filtración entre empresas | Scope obligatorio y pruebas negativas | Bloquear entrega y corregir antes de funcionalidades nuevas |
| Worker queda colgado | Timeout, lease, estado y recuperación | Recuperar trabajo y limitar intentos; nunca dejarlo invisible |
| Frontend espera al backend | OpenAPI y respuestas simuladas tempranas | Integrar una pantalla verticalmente y corregir contrato |
| Jorge o Franco se sobrecargan | Repartir integración y revisión desde el inicio | Redistribuir tickets completos, no solo tareas auxiliares |
| Tiempo insuficiente | Congelar funcionalidades en D30 | Aplicar recortes de la sección siguiente |
| Falla internet o proveedor en sustentación | Seed y modo fake claramente etiquetado | Demostrar recuperación y usar grabación de llamada real; no fingir IA real |

## 17. Qué recortar y qué no

### Orden de recorte si el equipo se retrasa

1. Formatos adicionales a los cinco iniciales.
2. Gráficos elaborados, animaciones y personalización visual secundaria.
3. Comparación de versiones lado a lado; mantener acceso al texto de cada versión.
4. Exportaciones distintas de copiar y `.txt`.
5. Filtros avanzados y comparativas comerciales complejas.

Reducir formatos obligatorios o evaluación comercial solo con aprobación explícita del docente. Nunca llamar “terminado” a un requisito omitido.

### No recortar

- Contexto empresarial real construido en el servidor.
- Persistencia de versiones y estados de revisión.
- Aislamiento por empresa, sesiones y protección de secretos.
- Trabajo asíncrono con estados recuperables.
- Integración real con IA para cumplir el objetivo del producto.
- Pruebas del recorrido central, despliegue reproducible y documentación.

## 18. Entregables finales

- [ ] Repositorio con versión etiquetada y código de los cinco integrantes.
- [ ] README de instalación, configuración, migración, seed, ejecución y pruebas.
- [ ] Documento de alcance, requisitos y limitaciones.
- [ ] Arquitectura y diagrama de secuencia de generación.
- [ ] ER y diccionario de datos.
- [ ] OpenAPI actualizado.
- [ ] Matriz de pruebas con resultados y defectos pendientes.
- [ ] Evaluación contextual con los 15 casos y sus revisiones.
- [ ] Aplicación desplegada con HTTPS o entorno exigido por el docente.
- [ ] Seed ficticio y cuentas de demostración; credenciales compartidas por canal privado.
- [ ] Procedimiento de backup y evidencia de restauración.
- [ ] Registro de consumo de IA y estimación de costos conocidos.
- [ ] Manual breve para empresa, catálogo, generación, revisión y resultados.
- [ ] Guion de demo y respaldo en video sin secretos ni datos sensibles.

### Guion de demostración de 8–10 minutos

1. **Enrique:** arquitectura, acceso y aislamiento entre dos cuentas.
2. **Gonzalo:** empresa, marca, audiencia, producto y contexto registrado.
3. **Yoshua:** solicitud real, cola, snapshot y trazabilidad de generación.
4. **Jorge:** revisión en la interfaz, edición, comparación y selección de versión.
5. **Franco:** aprobación, biblioteca, resultados, despliegue y prueba de recuperación.

Preparar un contenido generado previamente para continuar la demo si la llamada real demora. Identificar claramente qué parte se generó en vivo y cuál estaba preparada.

## 19. Primeras acciones, en orden

1. Los cinco revisan alcance, disponibilidad y rúbrica.
2. Confirman o ajustan stack y roles.
3. Franco crea el tablero con T01–T31 y agenda las demos semanales.
4. Enrique crea repositorio, controles y entorno base.
5. Gonzalo entrega el primer ER y diccionario de datos.
6. Enrique y Jorge publican el contrato inicial; cada dueño valida sus rutas.
7. Yoshua prueba el proveedor real y deja el fake con el mismo contrato.
8. Implementan la primera línea vertical: cuenta → empresa → producto → generación fake → versión guardada.
9. Recién después amplían pantallas, formatos y métricas.

**Ruta crítica:** acuerdos → datos/contrato → acceso/contexto → contenido/cola → generación real → edición/revisión → integración/pruebas → despliegue/entrega.

## 20. Referencias técnicas para validar decisiones

- [React: construir una aplicación desde cero](https://react.dev/learn/build-a-react-app-from-scratch).
- [PostgreSQL 17: `SELECT` y bloqueos, incluido `SKIP LOCKED`](https://www.postgresql.org/docs/17/sql-select.html).

Las dependencias concretas y la documentación del proveedor de IA se incorporan al cerrar T01 y T14. No asumir precios, cuotas, nombres de modelos ni garantías de idempotencia sin comprobarlos en el proveedor elegido.
