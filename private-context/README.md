# private-context/

Notas, apuntes crudos y material de referencia interna que **no** se publica en el sitio de documentación. A diferencia de `content/`, esta carpeta nunca es leída por la app (solo `content/` se escanea para generar páginas, navegación y búsqueda).

## Para qué sirve

Contenido que es útil como insumo para redactar documentación pulida (por ejemplo, dárselo de contexto a una IA para generar o actualizar un documento de `content/`), pero que en sí mismo no queremos exponer:

- Apuntes sueltos, ideas sin ordenar, lluvias de ideas.
- Borradores previos a la versión final de un documento.
- Información sensible o de trabajo interno del equipo que no es para terceros.

## Convención

- Cualquier extensión sirve (`.md`, `.txt`, etc.) — no hay parsing ni front-matter especial, es solo almacenamiento.
- Si un apunte de acá termina consolidado en un documento público, dejalo igual en `private-context/` como registro de la fuente, o borralo si ya no aporta.
- **No** muevas nada de acá a `content/` sin revisarlo: `content/` es lo que ve cualquiera con acceso al sitio.
