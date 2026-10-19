# Resumen de la aplicación

**ContentAI-PYME es una aplicación web interna para crear y consultar textos comerciales basados en los datos de un negocio.** El propietario registra su empresa, marca, público y productos o servicios; después solicita un borrador a la IA, lo revisa y lo copia para utilizarlo fuera de la plataforma.

No es una tienda virtual, un chat genérico ni una herramienta de publicación automática en redes.

**Primer avance:**

> Iniciar sesión → guardar datos del negocio → guardar un producto o servicio → generar una publicación → conservarla → volver a consultarla.

**Fuentes analizadas:**
- `ContentAI-PYME.md`: descripción del proyecto y alcance funcional.
- `entregas/REPARTO_PARA_EL_GRUPO.md`: alcance del avance, responsabilidades y contratos propuestos.
- `PROYECTOS_APLICACIONES_DISTRIBUIDAS_I.pdf`: descripción académica, especialmente las páginas 14–15.

No se encontró una carpeta denominada «proyecto content AI» en el workspace; los documentos están en la raíz del proyecto.

**Criterio de esta propuesta:** el alcance procede de esos documentos. Los campos concretos, su obligatoriedad, las rutas de interfaz y las decisiones visuales son **propuestas UX sujetas a validación**, porque todavía no existe un diccionario de datos cerrado.

**Stack previsto:** Laravel, PostgreSQL y React + TypeScript. Este documento especifica la experiencia y el maquetado; no implica implementar la aplicación ni modificar `example.pen`.

# Usuarios y estados principales

## Usuario principal

**Propietario de una PYME**, con conocimiento de su negocio pero sin necesidad de dominar redacción comercial o herramientas de IA.

Necesita:
- Registrar el contexto una vez y actualizarlo.
- Elegir fácilmente qué promocionar.
- Entender qué información utilizará la IA.
- Obtener un texto sin precios, descuentos o garantías inventadas.
- Recuperar sus contenidos sin repetir el trabajo.

**Suposición para el avance:** una cuenta trabaja con una empresa autorizada. No se incluyen selector de empresas, colaboradores ni administración de roles hasta que el equipo defina esas relaciones.

## Estados de la experiencia

| Estado | Qué necesita el usuario | Respuesta de la interfaz |
|---|---|---|
| Sin sesión | Acceder | Inicio de sesión |
| Negocio incompleto | Registrar contexto | Perfil de empresa con indicación de campos pendientes |
| Sin productos o servicios | Registrar qué vende | Catálogo vacío con acción para crear |
| Listo para generar | Elegir contexto y objetivo | Formulario de generación |
| Solicitud enviada | Saber que fue recibida | Confirmación y estado consultable |
| En procesamiento | Comprender que debe esperar | Indicador de actividad y explicación |
| Resultado guardado | Leer y utilizar el borrador | Texto, confirmación de persistencia y acciones |
| Fallo | Entender qué ocurrió y recuperarse | Error específico con siguiente acción |
| Regreso a la aplicación | Recuperar textos anteriores | Historial y detalle |

**No confundir tres conceptos:**
- **Procesamiento:** pendiente, procesando, completado o fallido.
- **Persistencia:** guardado confirmado o no confirmado.
- **Revisión editorial, posterior:** borrador, aprobado o descartado.

Un texto guardado no está necesariamente aprobado ni publicado.

# Mapa de pantallas (lista numerada, con marca de primer avance o posterior)

1. **Inicio de sesión — Primer avance.**
2. **Perfil de la empresa, marca y público — Primer avance.**
3. **Listado de productos y servicios — Primer avance.**
4. **Crear o editar producto/servicio — Primer avance.**
5. **Selección y generación de contenido — Primer avance.**
6. **Resultado de generación — Primer avance.** Incluye procesamiento, éxito, error y ausencia de resultado.
7. **Historial de contenido guardado — Primer avance.**
8. **Detalle de un contenido — Primer avance.**
9. **Revisión, edición y versiones — Posterior.**
10. **Campañas y canales de comunicación — Posterior.**
11. **Registro y consulta de resultados comerciales — Posterior.**

No se propone un dashboard adicional para el avance: no es necesario para completar el recorrido y agregaría trabajo sin resolver una necesidad distinta.

Los demás formatos —correos, anuncios, descripciones, artículos, títulos, CTA, entre otros documentados— se incorporarán posteriormente al generador existente, no como pantallas independientes.

# Detalle por pantalla

**Convenciones:** O = obligatorio; Op = opcional. Los campos y reglas siguientes son propuestas para acordar con el equipo.

## 1. Inicio de sesión

**Objetivo:** entrar de forma segura al espacio del negocio.

### Contenido y campos

| Campo | Tipo | Requisito |
|---|---|---|
| Correo electrónico | Email | O |
| Contraseña | Texto protegido | O |

Contenido adicional: nombre de la aplicación, título «Iniciar sesión» y ayuda breve para cuentas sin acceso.

**Suposición:** las cuentas del avance serán provisionadas por el equipo, de acuerdo con las cuentas ficticias mencionadas en el reparto. No se añade registro público ni recuperación de contraseña sin confirmar su alcance.

### Acciones y destinos
- **Iniciar sesión:** entra al destino pendiente autorizado; si no existe, aplica la regla de entrada descrita en Navegación global.
- **Mostrar/ocultar contraseña:** permanece en la pantalla.

### Estados
- **Vacío:** formulario sin completar; no mostrar errores antes de interactuar.
- **Cargando:** «Ingresando…», sin permitir envíos repetidos.
- **Error:** credenciales incorrectas sin revelar si existe la cuenta; conexión fallida con opción de reintentar.
- **Éxito:** acceso y redirección.
- **Sesión expirada:** aviso claro antes de volver a iniciar sesión; no reenviar automáticamente una generación.

## 2. Perfil de la empresa, marca y público

**Objetivo:** guardar el contexto que permitirá redactar contenido relevante.

Una sola pantalla, con tres secciones; no tres módulos separados para el avance.

### Contenido y campos

| Sección | Campo | Tipo | Requisito |
|---|---|---|---|
| Empresa | Nombre comercial | Texto corto | O |
| Empresa | Actividad económica | Texto corto | O |
| Empresa | Descripción del negocio | Texto multilínea | Op |
| Público | Nombre identificador del público | Texto corto | O |
| Público | Descripción del público objetivo | Texto multilínea | O |
| Marca | Tono de comunicación | Texto corto con ayuda | O |
| Marca | Restricciones de comunicación | Texto multilínea | Op |

No se solicitan RUC, dirección, logo ni datos personales: no son necesarios para el flujo documentado.

**Ejemplo ficticio, identificado como “Dato de ejemplo”:**
- Nombre: **TecnoBarrio — dato de ejemplo**.
- Actividad: mantenimiento de computadoras.
- Público: pequeños negocios de la zona.
- Tono: cercano y profesional.
- Restricción: no prometer que los equipos nunca fallarán.

### Acciones y destinos
- **Guardar cambios:** permanece y confirma el guardado.
- **Guardar y continuar:** guarda y lleva al listado de productos y servicios.
- **Cancelar cambios:** recupera la versión guardada; confirmar si hay modificaciones.

### Estados
- **Vacío:** formulario inicial con ayudas, sin datos ficticios insertados como reales.
- **Cargando:** estructura de las secciones y señal de carga.
- **Error:** validaciones junto a los campos y resumen superior; conservar lo escrito.
- **Éxito:** «Datos del negocio guardados».
- **Incompleto:** explicación de qué falta para generar, sin porcentajes artificiales.

## 3. Listado de productos y servicios

**Objetivo:** encontrar y administrar lo que se puede promocionar.

### Contenido
Listado con:
- Nombre: texto.
- Tipo: producto o servicio.
- Descripción breve: texto.
- Acciones por registro.

Los identificadores son internos y no se presentan como información principal.

### Acciones y destinos
- **Añadir producto o servicio:** pantalla 4.
- **Editar:** pantalla 4 con el registro seleccionado.
- **Generar contenido:** pantalla 5 con ese registro preseleccionado.

No incluir compra, carrito, inventario o disponibilidad comercial. Tampoco eliminar registros en el avance: no aparece en los contratos propuestos y podría afectar contenidos históricos.

### Estados
- **Vacío:** «Aún no registraste productos o servicios» + acción para añadir.
- **Cargando:** filas o tarjetas de carga.
- **Error:** mensaje y **Reintentar**.
- **Éxito:** listado disponible; después de crear, destacar brevemente el registro.

## 4. Crear o editar producto/servicio

**Objetivo:** describir con precisión qué se promocionará.

### Contenido y campos

| Campo | Tipo | Requisito |
|---|---|---|
| Tipo | Enumeración: producto / servicio | O |
| Nombre | Texto corto | O |
| Descripción | Texto multilínea | O |
| Características o qué incluye | Texto multilínea | O |
| Beneficios | Texto multilínea | O |
| Restricciones o afirmaciones que deben evitarse | Texto multilínea | Op |

Los campos pueden presentarse con lenguaje adaptado al tipo: «Características» para producto y «Qué incluye» para servicio.

No solicitar precio en el avance. La IA no debe inventarlo ni interpretar su ausencia como gratuidad.

### Acciones y destinos
- **Guardar:** listado, con confirmación.
- **Guardar y generar:** pantalla 5, solo después de confirmar persistencia.
- **Cancelar:** listado; advertir si hay cambios sin guardar.

### Estados
- **Vacío:** formulario de creación.
- **Cargando:** al recuperar un registro existente.
- **Error:** conservar valores y mostrar problemas por campo.
- **Éxito:** registro guardado y disponible para seleccionar.
- **No disponible:** registro inexistente o sin autorización, con regreso al listado.

## 5. Selección y generación de contenido

**Objetivo:** definir qué texto necesita y comprobar el contexto antes de solicitarlo.

### Contenido y campos

| Campo | Tipo | Requisito |
|---|---|---|
| Producto o servicio | Selector de registro propio | O |
| Público objetivo | Selector de audiencia propia | O |
| Tipo de contenido | Valor fijo: publicación para redes sociales | O, no editable en el avance |
| Objetivo comercial | Texto corto | O |

**Ejemplo de objetivo, marcado como dato de ejemplo:** «Conseguir consultas sobre el servicio».

Si existe una sola audiencia, aparece preseleccionada y visible. No simular varias opciones.

### Resumen del contexto
Mostrar en lenguaje legible:
- Empresa y actividad.
- Producto o servicio y sus beneficios.
- Público elegido.
- Tono.
- Restricciones.
- Aviso: «No se inventarán precios, descuentos ni garantías».

El resumen utiliza información autorizada del servidor. No muestra el prompt técnico ni claves del proveedor.

### Acciones y destinos
- **Generar publicación:** valida, crea una solicitud y lleva a pantalla 6.
- **Editar negocio:** pantalla 2.
- **Añadir/editar producto o servicio:** pantalla 4.
- **Volver a productos y servicios:** pantalla 3.

### Estados
- **Vacío/sin requisitos:** identificar el dato faltante y ofrecer su destino; no permitir generar.
- **Cargando:** recuperación de selectores y resumen.
- **Error:** validación, contexto desactualizado, conexión o límite de solicitudes; conservar elecciones.
- **Éxito de envío:** solicitud aceptada, sin afirmar todavía que hay contenido.
- **Enviando:** desactivar envíos duplicados.

## 6. Resultado de generación

**Objetivo:** seguir la solicitud, leer el borrador y saber si quedó guardado.

### Contenido
- Título «Resultado de generación».
- Producto/servicio, tipo de contenido y objetivo.
- Estado de la solicitud.
- Texto generado: texto largo, solo lectura en el avance.
- Fecha y confirmación de guardado cuando existan.
- Aviso: «Revisa el texto antes de utilizarlo. La IA puede cometer errores».

### Decisión propuesta sobre el guardado

**Guardar automáticamente cada generación exitosa**, coherentemente con el reparto y el diagrama del proyecto.

El éxito visible será:

> «Publicación generada y guardada en tu historial».

No añadir un botón «Guardar» que duplique un guardado ya realizado. Así se cumple el recorrido de conservar y volver a consultar sin una acción redundante. **El equipo debe ratificar esta interpretación del flujo.**

### Acciones y destinos
- **Copiar texto:** copia el borrador y confirma «Texto copiado».
- **Ver contenido guardado:** pantalla 8.
- **Ir al historial:** pantalla 7.
- **Crear otra publicación:** pantalla 5.
- **Volver a consultar estado:** consulta la misma solicitud si se perdió la conexión.
- **Reintentar generación:** solo ante un fallo confirmado y después de comprobar el estado anterior.

### Estados
- **Sin datos:** no hay solicitud válida o resultado disponible; mostrar explicación y regreso al generador.
- **Pendiente:** «Solicitud recibida».
- **Procesando:** «Estamos preparando tu publicación» con indicador, sin porcentaje ni tiempo inventado.
- **Persistencia pendiente:** todavía no anunciar éxito ni habilitar «Ver contenido guardado».
- **Éxito:** texto y guardado confirmado.
- **Error de generación:** no mostrar un texto de ejemplo como si fuera respuesta real.
- **Error al consultar:** «No pudimos actualizar el estado»; no afirmar que la generación falló.
- **Espera prolongada:** explicar la demora y permitir consultar otra vez; no dejar un indicador indefinido sin salida.

No se ofrece «Cancelar generación» porque esa capacidad no está documentada.

## 7. Historial de contenido guardado

**Objetivo:** recuperar publicaciones anteriores.

### Contenido
Lista ordenada por fecha de guardado, de más reciente a más antigua:
- Nombre del producto o servicio.
- Tipo de contenido.
- Fecha.
- Extracto del texto.
- Estado visible «Guardado».

**Propuesta:** utilizar producto/servicio y tipo como etiqueta del registro, sin añadir un campo de título obligatorio.

### Acciones y destinos
- **Ver contenido:** pantalla 8.
- **Generar publicación:** pantalla 5.
- **Cargar más:** si el volumen exige paginación; su contrato debe acordarse.

No incluir filtros editoriales, métricas ni versiones adicionales en el avance.

### Estados
- **Vacío:** «Todavía no tienes publicaciones guardadas» + **Generar publicación**.
- **Cargando:** elementos de carga con estructura similar al listado.
- **Error:** conservar registros ya visibles, si los hay, y permitir reintentar.
- **Éxito:** registros recuperados desde persistencia.

Esta biblioteca muestra contenidos guardados, no un historial de trabajos fallidos. Una bandeja de solicitudes requeriría un alcance y contrato adicionales.

## 8. Detalle de un contenido

**Objetivo:** leer y reutilizar una publicación guardada.

### Contenido
Información de solo lectura:
- Texto completo.
- Empresa y producto/servicio asociados.
- Tipo de contenido.
- Objetivo y público utilizados.
- Fecha.
- Primera versión.
- Tono y restricciones utilizados, si el contrato permite consultar el contexto histórico.

Los datos históricos deben corresponder a la generación, no reemplazarse silenciosamente por el perfil actual.

### Acciones y destinos
- **Copiar texto:** permanece y confirma.
- **Volver al historial:** pantalla 7.
- **Crear otra publicación:** pantalla 5.

No mostrar botones deshabilitados de aprobar o editar en el avance.

### Estados
- **Vacío/no disponible:** contenido inexistente o no accesible; regreso al historial.
- **Cargando:** estructura del lector y metadatos.
- **Error:** consulta fallida con reintento.
- **Éxito:** contenido persistido y legible.
- **Error al copiar:** permitir seleccionar el texto y copiarlo manualmente.

## 9. Revisión, edición y versiones — Posterior

**Objetivo:** ajustar un borrador, aprobarlo o descartarlo sin perder su historia.

### Contenido y campos
- Texto de la versión: texto largo, O para guardar una edición.
- Estado editorial: borrador / aprobado / descartado, administrado mediante acciones.
- Lista de versiones: identificador, fecha y estado, solo lectura.
- Versión seleccionada: texto completo, solo lectura cuando sea histórica.

### Acciones y destinos
- **Guardar nueva versión:** conserva la anterior y presenta la nueva.
- **Aprobar:** cambia el estado editorial, no publica.
- **Descartar:** requiere confirmación; conserva el historial.
- **Consultar versión:** cambia la versión visible.
- **Volver al detalle:** pantalla 8.

### Estados
- **Vacío:** sin contenido seleccionado.
- **Cargando:** recuperación de versiones.
- **Error:** fallo al guardar o cambiar estado; conservar el texto editado.
- **Éxito:** versión o decisión persistida.

**Pendiente:** precisar si aprobación y descarte corresponden al contenido completo o a una versión.

## 10. Campañas y canales de comunicación — Posterior

**Objetivo:** organizar el contexto comercial de campañas y sus canales, sin automatizar publicaciones.

**Propuesta de estructura:** una pantalla con listado y formulario de campaña; registro de canales mediante un formulario breve.

### Campos propuestos

| Entidad | Campo | Tipo | Requisito |
|---|---|---|---|
| Campaña | Nombre | Texto corto | O |
| Campaña | Objetivo | Texto multilínea | O |
| Campaña | Público | Referencia a audiencia | O |
| Campaña | Canales | Lista de referencias | Op |
| Canal | Nombre | Texto corto | O |

La asociación con productos y contenidos debe acordarse antes de maquetar relaciones definitivas.

### Acciones y destinos
- **Crear/editar campaña:** formulario de la misma pantalla.
- **Guardar campaña o canal:** listado actualizado.
- **Generar para esta campaña:** generador ampliado, cuando exista ese vínculo.
- **Cancelar:** regresa al listado sin guardar.

### Estados
- **Vacío:** sin campañas o canales registrados.
- **Cargando:** listado o formulario.
- **Error:** validaciones y persistencia, sin perder entradas.
- **Éxito:** registro guardado.

No incluir calendario, programación de publicaciones, conexión OAuth ni envío automático.

## 11. Registro y consulta de resultados comerciales — Posterior

**Objetivo:** registrar observaciones comerciales manualmente y consultarlas junto al texto utilizado.

### Campos propuestos

| Campo | Tipo | Requisito |
|---|---|---|
| Contenido relacionado | Referencia | O |
| Fecha de observación | Fecha | O |
| Impresiones | Entero ≥ 0 | Op |
| Clics | Entero ≥ 0 | Op |
| Observaciones | Texto multilínea | Op |

**Regla propuesta:** registrar al menos una métrica o una observación. Diferenciar «sin dato» de cero.

### Acciones y destinos
- **Guardar observación:** permanece y confirma.
- **Consultar registros anteriores:** lista de observaciones del contenido.
- **Ver contenido:** pantalla 8.

### Estados
- **Vacío:** contenido sin observaciones.
- **Cargando:** consulta de registros.
- **Error:** validación o guardado.
- **Éxito:** observación guardada y consultable.

Los valores son introducidos por el usuario. No se obtienen automáticamente de redes ni demuestran por sí solos un efecto causal de la IA.

# Navegación global

## Estructura

**Escritorio:**
- Barra lateral:
  1. Generar contenido.
  2. Historial.
  3. Productos y servicios.
  4. Mi empresa.
- Cabecera: título de pantalla, empresa activa y menú de cuenta con **Cerrar sesión**.
- Área principal: contenido de trabajo.

Las opciones posteriores no aparecen en el menú del primer avance, ni siquiera como botones deshabilitados.

**Inicio de sesión:** diseño independiente, sin barra lateral.

## Regla de entrada propuesta

Después de iniciar sesión:
1. Si hay un destino pendiente autorizado, recuperarlo.
2. Si faltan datos esenciales del negocio, abrir **Mi empresa**.
3. Si no existe ningún producto/servicio, abrir su listado vacío.
4. En otro caso, abrir **Generar contenido**.

La biblioteca permanece accesible aunque el perfil tenga datos pendientes: no bloquear la consulta de contenidos existentes.

## Recorridos principales

```text
Inicio de sesión
  → Mi empresa
  → Productos y servicios
  → Crear producto/servicio
  → Generar contenido
  → Resultado guardado
  → Detalle
  → Historial
```

```text
Regreso del usuario
  → Generar contenido
  ↔ Historial
  → Detalle de contenido
  → Copiar texto
```

## Reglas de navegación
- Breadcrumbs solo donde aportan contexto:
  - Productos y servicios / Editar.
  - Historial / Detalle.
  - Generar contenido / Resultado.
- Confirmar salida únicamente cuando existan cambios sin guardar.
- Conservar selecciones al volver desde un formulario de contexto, dentro de la sesión.
- Mantener la referencia de la solicitud para recuperar su estado al recargar.
- Navegar fuera del resultado no debe cancelar una solicitud ya aceptada.
- La salida de sesión limpia datos sensibles del cliente.
- Las URLs no sustituyen la autorización del servidor.

**Rutas de interfaz propuestas:** `/login`, `/empresa`, `/catalogo`, `/catalogo/nuevo`, `/catalogo/:id/editar`, `/generar`, `/generaciones/:id`, `/contenidos`, `/contenidos/:id`. No son cambios a las rutas API documentadas.

# Componentes reutilizables

| Componente | Uso |
|---|---|
| Estructura de aplicación | Cabecera, barra lateral y área principal |
| Cabecera de pantalla | Título, descripción breve y acción principal |
| Campo de formulario | Etiqueta, obligatoriedad, ayuda y error |
| Input, textarea y selector | Datos del negocio, catálogo y generación |
| Sección de formulario | Agrupar empresa, público y marca |
| Resumen de contexto | Información que utilizará la IA |
| Lista adaptable | Catálogo e historial; tabla en escritorio y tarjetas en móvil |
| Tarjeta de contenido | Extracto, fecha y acceso al detalle |
| Lector de texto | Resultado y detalle, con acción de copiar |
| Badge de estado | Procesando, guardado y estados editoriales posteriores |
| Estado vacío | Explicación y siguiente acción |
| Estado de error | Problema y recuperación |
| Indicador de procesamiento | Solicitud pendiente o en curso |
| Skeleton | Carga de datos existentes |
| Notificación breve | Copiado o guardado confirmado |
| Aviso persistente | Fallos importantes, sesión vencida o espera prolongada |
| Modal de confirmación | Salida con cambios; descarte posterior |
| Breadcrumbs | Relaciones padre–detalle |
| Etiqueta «Dato de ejemplo» | Datos ficticios y resultados simulados |

**Accesibilidad transversal:**
- Etiquetas visibles; no depender del placeholder.
- Operación completa con teclado.
- Foco visible y devolución de foco al cerrar modales.
- Estados anunciados de forma accesible.
- No comunicar estados solo mediante color.
- Los errores importantes permanecen hasta que puedan resolverse.

# Dirección visual

## Concepto

**Herramienta de trabajo clara, sobria y cercana.** Priorizar formularios comprensibles, lectura y confianza sobre efectos visuales.

Evitar grandes degradados, ilustraciones decorativas, estética de chat y bloques promocionales. El protagonismo lo tienen los datos del negocio y el texto generado.

## Paleta propuesta

| Token | Hexadecimal | Aplicación |
|---|---|---|
| Fondo | `#F8FAFC` | Área general |
| Superficie | `#FFFFFF` | Formularios, tarjetas y lector |
| Texto principal | `#0F172A` | Títulos y contenido |
| Texto secundario | `#475569` | Ayudas y metadatos |
| Borde suave | `#E2E8F0` | Separadores y tarjetas |
| Borde de control | `#64748B` | Inputs y controles interactivos |
| Primario | `#1D4ED8` | Acción principal y enlaces |
| Primario activo | `#1E40AF` | Hover y estado presionado |
| Éxito | `#166534` | Guardado confirmado |
| Fondo de éxito | `#F0FDF4` | Avisos de éxito |
| Advertencia | `#92400E` | Demoras y revisión necesaria |
| Fondo de advertencia | `#FFFBEB` | Avisos de advertencia |
| Error | `#B91C1C` | Validaciones y fallos |
| Fondo de error | `#FEF2F2` | Avisos de error |
| Foco | `#2563EB` | Anillo de teclado |

El azul distingue acciones sin darle un tono publicitario. Los neutros facilitan sesiones de trabajo y la lectura prolongada.

## Tipografía
- **Inter**, con alternativa `system-ui, sans-serif`.
- Texto base e inputs: **16 px**.
- Texto generado: **16–18 px**, interlineado **1.6**.
- Título de pantalla: **28 px** en escritorio, **24 px** en móvil.
- Subtítulos: **20 px**.
- Ayudas y metadatos: **14 px**.
- Pesos: 400 para lectura, 500 para etiquetas y 600 para títulos.

## Espaciado y densidad
- Escala: **4, 8, 12, 16, 24, 32 y 48 px**.
- Padding de tarjetas: **24 px**, **16 px** en móvil.
- Separación entre campos: **16–24 px**.
- Separación entre secciones: **32 px**.
- Controles: mínimo **44 px** de altura.
- Radio: **8 px** en controles y **12 px** en tarjetas.
- Ancho de formulario: aproximadamente **720 px**.
- Texto generado: máximo aproximado de **70 caracteres por línea**.

Densidad media: pocos elementos por bloque, sin espacios monumentales ni tablas excesivamente compactas. Una acción primaria dominante por pantalla.

# Responsive

## Escritorio: desde 1200 px
- Barra lateral visible, aproximadamente 240 px.
- Generador con formulario a la izquierda y resumen de contexto a la derecha.
- Catálogo e historial como tablas o listas amplias.
- Lector centrado y limitado en ancho.

## Tablet: 768–1199 px
- Menú lateral plegable.
- Formularios principalmente en una columna.
- Resumen de contexto debajo del formulario cuando no haya ancho suficiente.
- Evitar tablas que obliguen a desplazamiento horizontal.

## Móvil: menos de 768 px
- Cabecera compacta con menú desplegable accesible.
- Contenido en una columna y margen lateral de 16 px.
- Inputs a ancho completo.
- Catálogo e historial convertidos en tarjetas.
- Acciones principales a ancho completo cuando facilite su uso.
- Sin dependencia de hover.

## Formulario de generación
Orden constante:
1. Producto o servicio.
2. Público.
3. Tipo de contenido.
4. Objetivo.
5. Resumen del contexto.
6. Generar publicación.

En móvil, el resumen puede ser desplegable, mostrando siempre producto, público y tono. Si faltan requisitos, la explicación aparece antes de la acción principal.

Evitar una barra fija que tape campos o interfiera con el teclado.

## Lectura de textos
- Mantener saltos de párrafo y selección manual.
- Sin desplazamiento horizontal.
- Botón **Copiar** fuera del cuerpo del texto.
- No encerrar el borrador en un panel de altura fija con scroll interno.
- El estado de procesamiento debe ser visible sin ocupar toda la pantalla.

El maquetado debe comprobarse al menos a **390 px, 834 px y 1440 px**, y posteriormente en dispositivos reales.

# Pendientes y riesgos

| Tema | Riesgo o vacío | Decisión necesaria |
|---|---|---|
| Base de datos | El PDF general prescribe MySQL; los documentos actuales y el encargo indican PostgreSQL | Confirmar aceptación académica; mantener PostgreSQL como stack previsto |
| Cuentas | No se define alta pública ni recuperación | Confirmar cuentas provisionadas para el avance |
| Usuario–empresa | Cardinalidad y roles todavía no cerrados | Definir propiedad y autorización antes de implementar |
| Campos | No hay diccionario definitivo | More y Honores deben validar obligatoriedad, límites y mensajes |
| Público y marca | Se contempla audiencia inicial, pero no su alta completa | Resolver cómo nace y se guarda el contexto inicial |
| Guardado | El flujo verbal puede interpretarse como guardado manual | Ratificar guardado automático y confirmación visible |
| Estados | Frontend y backend podrían usar nombres distintos | Acordar estados, transiciones y errores públicos |
| Reintentos | Doble clic o pérdida de conexión pueden duplicar solicitudes | Consultar la solicitud existente antes de repetir; idempotencia |
| Persistencia | Podría mostrarse éxito antes de guardar | Confirmar resultado y primera versión antes del éxito |
| Espera prolongada | Worker o proveedor caído | Acordar tiempos, recuperación y mensajes sin espera indefinida |
| Reentrada | Recargar podría perder la referencia de la solicitud | Definir recuperación mediante identificador autorizado |
| IA | Puede inventar afirmaciones o incumplir restricciones | Contexto controlado, validación y revisión humana |
| Aislamiento | Riesgo de utilizar datos de otra empresa | Autorizar cada consulta y referencia en backend |
| Datos enviados a IA | Exposición innecesaria de información | Minimizar contexto y explicar su uso |
| Historial | Cambios del negocio podrían alterar la interpretación de textos antiguos | Conservar contexto histórico y definir qué se expone en detalle |
| Simulación | Confundir mocks con funcionamiento real | Rotular datos y resultados simulados; no contarlos como integración |
| Funciones posteriores | Campañas, métricas y versiones pueden desbordar el avance | Mantenerlas fuera del corte inicial |
| Evaluación académica | Experimento y métricas de investigación no están cerrados | Definirlos aparte; no inventar un dashboard analítico |
| Accesibilidad | Formularios y estados asíncronos pueden resultar inaccesibles | Probar teclado, foco, contraste y anuncios de estado |

**Criterio de aceptación central del avance:** una persona inicia sesión, guarda su contexto y un producto/servicio, obtiene una publicación real contextualizada, ve confirmado su guardado y puede recuperarla desde el historial después de recargar. Los fallos no generan éxitos ficticios ni versiones duplicadas.

# Especificación para maquetado (sección final para Luna)

## Alcance y destino

**Ruta de destino:** `example.pen`, en la raíz del proyecto.

Esta sección es una especificación para un maquetado posterior. **No se solicita modificar el archivo en esta etapa.**

Diseñar una **aplicación autenticada**, no una landing. No incluir hero, testimonios, planes, precios, footer promocional, carrito ni publicación automática.

## Pantallas en orden exacto

Los nombres siguientes pueden utilizarse directamente como nombres de frame. Las referencias a componentes corresponden a la sección «Componentes reutilizables».

| Orden / nombre de frame | Contenido | Componentes | Acciones | Estados que representar |
|---|---|---|---|---|
| **01_Login** | Correo, contraseña y acceso | Formulario de acceso, aviso | Iniciar sesión, mostrar contraseña | Vacío, ingresando, credenciales incorrectas, sesión expirada |
| **02_PerfilEmpresa** | Empresa, público, tono y restricciones | Estructura global, secciones, campos, aviso | Guardar, guardar y continuar, cancelar cambios | Inicial, cargando, validación, guardado |
| **03_ProductosServicios** | Nombre, tipo y descripción de registros | Lista adaptable, badges, estado vacío | Añadir, editar, generar | Vacío, cargando, error, listado |
| **04_FormularioProductoServicio** | Tipo, nombre, descripción, características, beneficios y restricciones | Campos, selector, confirmación de salida | Guardar, guardar y generar, cancelar | Crear, editar, validación, guardando, no disponible |
| **05_GenerarContenido** | Producto/servicio, público, formato fijo, objetivo y contexto | Selectores, campo, resumen de contexto, aviso | Generar, editar datos, volver | Listo, requisitos incompletos, cargando, error, enviando |
| **06_ResultadoGeneracion** | Estado de solicitud, borrador y confirmación de persistencia | Indicador, lector, badges, avisos | Copiar, ver detalle, historial, crear otra, consultar estado o reintentar según corresponda | Sin datos, pendiente, procesando, guardado pendiente, éxito, fallo y conexión perdida |
| **07_HistorialContenido** | Publicaciones guardadas con fecha y extracto | Lista adaptable, tarjeta, estado vacío | Ver contenido, generar publicación | Vacío, cargando, error, listado |
| **08_DetalleContenido** | Texto completo y metadatos históricos | Lector, metadatos, breadcrumbs, notificación | Copiar, volver, crear otra | Cargando, disponible, error, no disponible |
| **09_RevisionVersiones_POSTERIOR** | Editor, estado editorial y versiones | Textarea, lista de versiones, badges, modal | Guardar versión, aprobar, descartar, consultar versión | Sin selección, cargando, cambios, error, éxito |
| **10_CampanasCanales_POSTERIOR** | Listado y formulario de campañas y canales | Lista, formularios, selectores | Crear, editar, guardar, cancelar | Vacío, cargando, validación, éxito |
| **11_ResultadosComerciales_POSTERIOR** | Contenido relacionado, fecha, impresiones, clics y observaciones | Formulario numérico, lista, lector de contexto | Guardar observación, consultar registros, ver contenido | Vacío, cargando, error, éxito |

Las pantallas 09–11 son **conceptuales y posteriores**; no deben aparentar estar disponibles en el menú del primer avance.

## Variantes que deben quedar visibles en el archivo

Después de los frames principales, colocar en este orden:

1. `12_GenerarContenido_SinRequisitos`
2. `13_ResultadoGeneracion_Procesando`
3. `14_ResultadoGeneracion_Error`
4. `15_ResultadoGeneracion_SinDatos`
5. `16_ResultadoGeneracion_GuardadoPendiente`
6. `17_HistorialContenido_Vacio`
7. `18_PerfilEmpresa_Validacion`
8. `19_Login_SesionExpirada`
9. `20_Mobile_GenerarContenido`
10. `21_Mobile_ResultadoGeneracion`
11. `22_Mobile_HistorialContenido`
12. `23_Tablet_GenerarContenido`

Estas variantes reutilizan los campos y acciones del frame correspondiente; no representan funcionalidades nuevas.

## Sistema visual obligatorio
- **Tipografía:** Inter; alternativa system-ui.
- **Colores:** aplicar la paleta hexadecimal definida en «Dirección visual».
- **Texto principal:** `#0F172A`; secundario `#475569`.
- **Fondo/superficie:** `#F8FAFC` / `#FFFFFF`.
- **Acción primaria:** `#1D4ED8`.
- **Estados:** éxito `#166534`, advertencia `#92400E`, error `#B91C1C`.
- **Espaciados:** 4, 8, 12, 16, 24, 32 y 48 px.
- **Controles:** altura mínima de 44 px.
- **Radios:** 8 px en controles; 12 px en tarjetas.
- **Frames:** escritorio 1440 px, tablet 834 px y móvil 390 px; altura según contenido.
- **Lectura:** cuerpo de 16–18 px, interlineado 1.6 y ancho limitado.
- **Menú:** Generar contenido, Historial, Productos y servicios, Mi empresa.

## Contenido de muestra

Utilizar únicamente información ficticia y marcar el conjunto con una etiqueta visible **«Datos de ejemplo»**.

Para el resultado, puede utilizarse este texto bajo la etiqueta **«Resultado ilustrativo; no generado por IA»**:

> ¿Las computadoras de tu negocio necesitan mantenimiento? En TecnoBarrio ofrecemos limpieza interna y revisión básica para ayudarte a prevenir fallas por acumulación de polvo. Escríbenos para conocer nuestro servicio de mantenimiento preventivo.

No añadir precios, descuentos, garantías ni métricas ficticias sin identificarlas.

## Conexiones del prototipo

Conectar el recorrido principal:

**01 → 02 → 03 → 04 → 05 → 13 → 06 → 08 → 07**

Además:
- Desde 03, permitir generar con un registro existente.
- Desde 07, abrir 08.
- Desde 06 y 08, volver a 05.
- Desde 05, abrir la variante sin requisitos.
- Desde el resultado, permitir inspeccionar las variantes de error y ausencia de datos.

**Criterio final:** cada frame debe permitir identificar qué puede hacer el usuario, qué información utiliza la aplicación, qué está ocurriendo y cuál es el siguiente paso.
