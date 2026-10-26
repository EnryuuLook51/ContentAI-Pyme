# ContentAI-PYME · Grupo 07

Plataforma web para generar publicaciones comerciales a partir del contexto de una PYME.

El proyecto construye un perfil digital de la empresa (actividad, marca, público objetivo y catálogo) y usa esa información para generar una publicación para redes sociales, guardarla y volver a consultarla.

## Estado actual

Prototipo funcional del primer avance. El recorrido implementado es:

**iniciar sesión → guardar contexto empresarial → registrar un producto o servicio → generar una publicación → persistirla → consultarla**

La generación es **simulada**: una plantilla local determinista compone el texto con el contexto autorizado. No se llama a ningún proveedor de IA y la interfaz lo indica como resultado ilustrativo.

Fuera de este corte quedan campañas, métricas comerciales, edición avanzada, aprobación, descarte, formatos adicionales y publicación automática.

## Stack

| Capa | Implementación actual |
|---|---|
| Frontend | HTML, CSS y JavaScript nativo, sin build ni framework |
| Backend | PHP 8.1+ nativo con PDO/MySQL, sesiones y CSRF; sin Composer |
| Base de datos | MySQL o MariaDB (`BaseDatos/contenAI_bd.sql`) |

El stack objetivo documentado para producción es Laravel + PostgreSQL + React/TypeScript. El prototipo actual no es esa migración y no debe presentarse como tal.

## Estructura

```text
backend/        API PHP por capas, autoload propio y pruebas manuales del contrato
frontend/       interfaz, navegación por hash y cliente HTTP de la API
BaseDatos/      esquema MySQL, datos de demostración y diccionario de datos
entregas/       reparto de responsabilidades y especificación UX/UI
ContentAI-PYME.md   descripción funcional del producto
```

El backend está separado en `src/Http` (peticiones, respuestas, rutas y controladores), `src/Security` (sesión, CSRF y autorización), `src/Repositories` (PDO), `src/Services` (reglas de negocio) y `src/Support`. La generación se define mediante la interfaz `ContentGenerator` y hoy usa `TemplateContentGenerator`. Ver [`backend/README.md`](backend/README.md).

## Puesta en marcha

Requisitos: PHP con `pdo_mysql`, MySQL o MariaDB y Node.js para el servidor estático del frontend.

### 1. Base de datos

```sh
mysql -u root -p < BaseDatos/contenAI_bd.sql
mysql -u root -p < BaseDatos/demo_data.sql
```

El primer script contiene `DROP TABLE`: úsalo solo para crear la base desde cero. Después crea una cuenta local con permisos de lectura y escritura sobre `contentai_pyme` (los detalles están en `backend/README.md`).

### 2. Backend

```sh
cd backend
cp .env.example .env
# completar DB_USER, DB_PASSWORD y las demás variables locales
set -a; . ./.env; set +a
php -S localhost:8000 router.php
```

Comprobar: `http://localhost:8000/api/v1/health` debe responder `{"status":"ok","database":"connected"}`.

### 3. Frontend

En otra terminal:

```sh
cd frontend
npm run dev
```

Abrir `http://localhost:5173`. El origen CORS configurado por defecto es exactamente ese.

### Cuenta de demostración

- Correo: `demo@contentai-pyme.local`
- Contraseña: `Demo2026!`

Son datos ficticios para uso local.

## API

Prefijo de negocio: `/api/v1`.

| Método | Ruta | Uso |
|---|---|---|
| GET | `/health` | Estado del servicio y de la base |
| GET | `/csrf` | Token CSRF de la sesión |
| POST | `/login` / `/logout` | Inicio y cierre de sesión |
| GET | `/session` | Usuario, empresa, catálogo y publicaciones |
| GET / PUT | `/company` | Contexto empresarial |
| GET / POST | `/products` | Catálogo de productos y servicios |
| POST | `/products/{id}` | Actualización de un producto o servicio |
| GET / POST | `/contents` | Historial y generación de publicaciones |
| GET | `/contents/{id}` | Detalle de una publicación |

Las rutas de escritura requieren `X-CSRF-Token`. La empresa se obtiene siempre del usuario autenticado, nunca de un identificador enviado por el cliente.

## Pruebas

```sh
cd frontend && npm test
```

El contrato HTTP se comprueba con peticiones a la API en ejecución: salud, CSRF, login, empresa, catálogo, generación, persistencia, aislamiento entre empresas, códigos 401/403/404/419/422 y CORS. El recorrido completo se valida en el navegador, incluyendo la recarga de la página de detalle.

## Documentación

- [`ContentAI-PYME.md`](ContentAI-PYME.md): propósito y alcance del producto.
- [`entregas/REPARTO_PARA_EL_GRUPO.md`](entregas/REPARTO_PARA_EL_GRUPO.md): responsabilidades y contratos.
- [`entregas/ESPECIFICACION_UX_UI_CONTENTAI_PYME.md`](entregas/ESPECIFICACION_UX_UI_CONTENTAI_PYME.md): pantallas, estados y navegación.
- [`BaseDatos/Diseño_BD_ContentAI.docx`](BaseDatos/Diseño_BD_ContentAI.docx): diccionario de datos.
- [`backend/README.md`](backend/README.md): configuración detallada de MySQL y del servidor PHP.

## Seguridad y datos

- No se versionan credenciales: `.env` está fuera de Git.
- Las contraseñas se almacenan con `password_hash`.
- La sesión usa cookie `HttpOnly` y `SameSite=Lax`; toda escritura exige CSRF.
- Los datos de demostración son ficticios y la generación está identificada como simulada.
