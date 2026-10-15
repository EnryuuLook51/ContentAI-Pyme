# Base de datos

**Coordinación:** Gonzalo. Cada autor escribe y prueba las migraciones de su módulo.

- Enrique: usuarios y sesiones.
- Gonzalo: empresa, marca, audiencias y catálogo.
- Yoshua: generación, snapshots, intentos y cuotas.
- Franco: contenidos y versiones.

Antes de agregar SQL, acordar herramienta y orden de migraciones. Usar identificadores únicos, por ejemplo `20261014120000_create_users`; no duplicar números entre ramas. No reescribir migraciones ya compartidas.

Las migraciones deben funcionar desde una base vacía. Los seeds solo usan datos ficticios y no se ejecutan automáticamente en producción.
