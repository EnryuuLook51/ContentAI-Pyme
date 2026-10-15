# Flujo Git del equipo

## Ramas

- `main`: estado estable de presentación.
- `develop`: integración; destino normal de pull requests.
- `feat/enrique-auth`, `feat/gonzalo-contexto`, `feat/yoshua-ia`, `feat/jorge-interfaz`, `feat/franco-generador`: trabajo inicial de cada integrante.

Las ramas iniciales apuntan a la misma base. Tener una rama creada no significa que su módulo esté implementado.

## Empezar

```bash
git clone https://github.com/EnryuuLook51/ContentAI-Pyme.git
cd ContentAI-Pyme
git fetch origin
git switch --track origin/feat/enrique-auth
```

Sustituir la rama según el integrante. Si la rama ya existe localmente, `git switch feat/enrique-auth`.

## Actualizar y compartir

Con cambios propios confirmados y el árbol de trabajo limpio:

```bash
git fetch origin
git merge origin/develop
```

Resolver conflictos con el responsable de los archivos afectados. No usar `reset --hard`, `checkout --` o force-push para borrar el trabajo de otros.

Confirmar archivos concretos, revisar el diff y publicar:

```bash
git status
git add ruta/del/archivo
git diff --cached
git commit -m "feat(auth): implementar inicio de sesion"
git push
```

`ruta/del/archivo` es un ejemplo: sustituirlo por los archivos reales. Abrir PR de la rama personal hacia `develop`; pedir una revisión y describir cómo probar.

## Después de integrar

Actualizar la rama con `origin/develop` antes de continuar, o crear una rama corta nueva desde `develop` para la siguiente tarea. No reutilizar una rama eliminada sin recrearla desde la base actual.

## Entregas

1. Integrar módulos en `develop`.
2. Ejecutar controles y pruebas reales de aplicación cuando existan.
3. Abrir PR `develop` → `main` y revisar la demostración.
4. Etiquetar la entrega solo cuando se haya probado.

## Configuración pendiente en GitHub

Un administrador debe invitar a los otros cuatro integrantes con sus nombres de usuario reales y configurar reglas para `main`/`develop`: PR obligatorio, al menos una revisión y controles aprobados, si el plan y la visibilidad del repositorio lo permiten.

El check inicial solo valida estructura/documentación; agregar compilación, pruebas y seguridad con los módulos correspondientes. No representa una validación funcional del sistema.
