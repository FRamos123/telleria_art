Repositorio con dos paquetes independientes: el sitio estático (Astro, en `web/`) y el panel de edición (Sanity Studio, en `studio/`). Se instalan, verifican y despliegan por separado; el contrato entre ambos es el esquema de contenido, aislado en una capa de mapeo.

- Instalar dependencias: `pnpm --dir web install` y `pnpm --dir studio install`
- Verificar el sitio: `pnpm --dir web verify`
- Ejecutar el Studio: `pnpm --dir studio dev`
