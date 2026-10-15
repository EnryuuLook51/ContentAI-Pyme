# Backend

**Stack propuesto:** Go. **Estado:** pendiente de inicializar el módulo y los ejecutables.

- `cmd/api/`: entrada HTTP; Enrique prepara configuración y acceso.
- `cmd/worker/`: proceso independiente; Yoshua procesa los trabajos de IA.
- `internal/`: módulos de negocio compartidos cuando corresponda.

Enrique define versión de Go, módulo, conexión a PostgreSQL, logs y mecanismo de sesión/empresa. No crear módulos Go separados por persona ni copiar configuración entre API y worker.

La lógica de negocio no se implementa en `cmd/`; las llamadas externas no mantienen transacciones SQL abiertas.
