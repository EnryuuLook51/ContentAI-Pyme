# Arquitectura base

```text
Web -> API -> PostgreSQL <- Worker -> Proveedor IA
```

API y worker son procesos separados, con módulos compartidos dentro del mismo backend. La cola persistente vive en PostgreSQL. Esto no equivale a microservicios con bases independientes; validar el enfoque con la rúbrica del docente.

La estructura está creada, pero los procesos todavía no están implementados. El Compose inicial contiene solo la base.

Ver [ruta técnica completa](../RUTA_DESARROLLO.md) y [primer corte](../entregas/01-LUNES.md).
