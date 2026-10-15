# ContentAI-PYME · Grupo 07

Plataforma web para generar contenido comercial a partir del contexto de una PYME.

**Estado:** estructura inicial y planificación. Todavía no hay frontend, API ni worker implementados. Compose prepara únicamente PostgreSQL; los servicios de aplicación se incorporarán cuando existan ejecutables reales.

## Primera entrega

Presentación: **lunes 19 de octubre de 2026**.

Recorrido objetivo: login → empresa/marca/audiencia → producto o servicio → generación contextual → contenido persistido.

- [Reparto listo para compartir](entregas/REPARTO_PARA_EL_GRUPO.md).
- [Documento general en PDF](entregas/para_enviar/Reparto_ContentAI-PYME.pdf).
- [Plan del lunes](entregas/01-LUNES.md).
- [Descripción del proyecto e integrantes](ContentAI-PYME.md).
- [Ruta completa](RUTA_DESARROLLO.md).

## Estructura

```text
.github/                Plantillas y controles automáticos
apps/web/               Frontend: React + TypeScript, pendiente de inicializar
apps/backend/cmd/api/   Entrada de la API Go
apps/backend/cmd/worker/ Entrada del proceso de generación
apps/backend/internal/  Módulos de negocio y plataforma
contracts/              Contrato HTTP común
db/migrations/          Cambios versionados de la base
db/seeds/               Datos ficticios reproducibles
docs/                   Arquitectura y acuerdos técnicos
entregas/               Planes y documentos para el grupo
infra/                  Configuración futura de despliegue
scripts/                Comprobaciones del repositorio
tests/e2e/              Pruebas del recorrido completo
```

Tecnologías propuestas: React + TypeScript, Go y PostgreSQL 17. El equipo debe confirmar el stack antes de implementar los módulos.

## Ramas y responsables

| Rama | Uso / responsable |
|---|---|
| `main` | Versiones estables para presentar |
| `develop` | Integración del equipo |
| `feat/enrique-auth` | Enrique: base backend y acceso |
| `feat/gonzalo-contexto` | Gonzalo: empresa, marca, audiencias y catálogo |
| `feat/yoshua-ia` | Yoshua: contexto, IA, jobs y worker |
| `feat/jorge-interfaz` | Jorge: pantallas de acceso y negocio |
| `feat/franco-generador` | Franco: generador, biblioteca e integración |

Cada rama de trabajo parte de `develop`. Abrir pull requests hacia `develop`; al cerrar y probar una entrega, abrir un PR de `develop` hacia `main`. No hacer force-push ni mezclar directamente cambios ajenos sin revisión.

```bash
git clone https://github.com/EnryuuLook51/ContentAI-Pyme.git
cd ContentAI-Pyme
git fetch origin
git switch --track origin/feat/franco-generador
```

Cambiar el nombre de la rama por la correspondiente. Si ya existe localmente, usar `git switch nombre-de-rama`. Ver [flujo de trabajo](docs/FLUJO_GIT.md).

## Preparar la base de datos local

Requisitos para esta base: Docker con Compose, Python 3 y Git. Node y Go serán necesarios cuando se inicialicen sus aplicaciones.

```bash
cp .env.example .env
```

Editar `.env`, cambiar la contraseña de ejemplo y luego ejecutar:

```bash
docker compose config --quiet
docker compose up -d db
docker compose ps
```

La base escucha solo en `127.0.0.1:5432`, salvo que se cambie el puerto local. Los datos se conservan en un volumen. No borrar volúmenes para resolver problemas sin revisar antes qué información contienen.

Este paso **no** ejecuta migraciones ni carga seeds; ambos siguen pendientes. No subir `.env`, credenciales o datos reales a Git.

## Comprobar la estructura

```bash
python3 scripts/check_repository.py
```

El control valida estructura y enlaces locales de la documentación. **No sustituye pruebas de aplicación**, porque aún no existe implementación. Las pruebas y compilaciones se agregarán con sus respectivos módulos.

## Reglas mínimas

1. Contrato acordado antes de integrar; ver [contratos](contracts/README.md).
2. Migraciones revisadas y nunca reescritas después de compartirse.
3. Datos de negocio aislados por empresa desde el servidor.
4. Claves de IA solo en backend/worker; no en el frontend.
5. Simulación identificada como tal; ninguna funcionalidad se considera lista solo con mocks.
6. Actualizar documentación y pruebas con cada módulo.

La protección obligatoria de ramas y los permisos de colaboradores se configuran en GitHub; crear las ramas no activa esas restricciones automáticamente.
