# Backend PHP + MySQL

Este backend pequeño usa PHP 8+, PDO MySQL y sesiones PHP. No es Laravel y no debe considerarse una integración de producción. La generación es una plantilla determinista local, identificada como simulada; no llama a un proveedor de IA.

## Preparar MySQL

El esquema base es `../BaseDatos/contenAI_bd.sql`. **El script contiene `DROP TABLE` y elimina las tablas de `contentai_pyme`; ejecútalo únicamente para crear la base nueva, nunca sobre una base que ya tenga información.** En una instalación nueva:

```sh
mysql -u root -p < ../BaseDatos/contenAI_bd.sql
mysql -u root -p < ../BaseDatos/demo_data.sql
```

Si la base ya existe, no vuelvas a ejecutar el esquema base: aplica una sola vez `mysql -u root -p < ../BaseDatos/actualizacion_prototipo.sql` y luego importa `demo_data.sql`.

La cuenta ficticia de demostración es `demo@contentai-pyme.local` / `Demo2026!`. Solo sirve para datos locales de ejemplo.

El backend requiere una cuenta MySQL con permisos de lectura y escritura sobre `contentai_pyme`. Un administrador local puede crearla (sustituye la contraseña por una local propia):

```sql
CREATE USER 'contentai_app'@'localhost' IDENTIFIED BY 'choose-a-local-password';
GRANT SELECT, INSERT, UPDATE, DELETE ON contentai_pyme.* TO 'contentai_app'@'localhost';
```

Copia `.env.example` como `.env`, completa los valores locales y expórtalos en la terminal antes de arrancar; el backend lee variables de entorno y no carga archivos `.env` automáticamente. No uses credenciales de producción en el prototipo.

## Ejecutar localmente

Arranca el frontend en `frontend/` con `npm run dev`. En otra terminal, desde `backend/`, exporta `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` y `CORS_ORIGIN` (por ejemplo, `set -a; . ./.env; set +a`), y ejecuta:

```sh
php -S localhost:8000 router.php
```

Comprueba `http://localhost:8000/api/v1/health`; debe responder `{"status":"ok","database":"connected"}`. Usa `http://localhost:5173` para compartir el origen CORS configurado. Para HTTPS, activa `SESSION_SECURE=true`.

## Estructura

`public/index.php` es el front controller: carga el autoload propio y convierte los errores en respuestas JSON. El resto del código vive en `src/`, separado por capas:

- `App.php`: composición de dependencias y tabla de rutas.
- `Http/`: `Request`, `Response`, `Router`, `Cors` y los controladores.
- `Security/`: sesión PHP, token CSRF y autorización por usuario/empresa.
- `Repositories/`: consultas PDO; la conexión se abre en el primer uso.
- `Services/`: validación y reglas de negocio; `Services/Generation/` define la interfaz del generador y su implementación simulada.
- `Support/`: errores de API, validación y conexión a MySQL.

No usa Composer ni frameworks: `src/bootstrap.php` registra un autoload propio para el prefijo `ContentAI\`. El código se apoya en los temas del curso (HTTP, cookies/sesiones, PHP, POO y PDO/MySQL), sin dependencias externas.

## Rutas implementadas

- `GET /api/v1/csrf`, `POST /api/v1/login`, `GET /api/v1/session`, `POST /api/v1/logout`.
- `GET/PUT /api/v1/company`.
- `GET/POST /api/v1/products`, `POST /api/v1/products/{id}`.
- `GET/POST /api/v1/contents`, `GET /api/v1/contents/{id}`.

Las rutas de escritura requieren el encabezado `X-CSRF-Token`; las operaciones empresariales obtienen la empresa desde la sesión y aplican su ID en cada consulta. La propiedad `description` y las restricciones de catálogo, además del origen `simulated` de versiones, se incorporaron al script MySQL base para representar los campos que ya pide el prototipo sin etiquetar una simulación como contenido generado por IA.
