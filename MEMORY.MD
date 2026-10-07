# MEMORY.md — AF Tellería
Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no
aporte.
## Estado actual
- Spec 000 aprobada; T1–T7 completadas. T2: configuración Astro/Tailwind v4 y gate `pnpm verify` (lint, tipos, build y tests). T3: `src/styles/global.css` refleja los tokens aprobados en `@theme`. T4: diccionarios ES/EN, paridad de claves y selección de idioma por ruta. T5: layout común, cabecera, selector y pie con tokens. T6: homes ES/EN con identificación localizada y metadatos propios, canonical y hreflang recíprocos. T7: 404 bilingüe bajo el layout compartido y prueba del build para homes ES/EN y 404; RF-15, RF-18 y RF-23; RNF-2 y RNF-5. `pnpm verify` OK.
- Publicación limitada al gate `pnpm verify`, sin rollback por HTTP posterior. RF de publicación: RF-16 y RF-25.
- Diseño Stitch exportado y documentado en `design/tokens.md`.
## Decisiones (y por qué)
- Astro estático + Sanity (plan gratuito) + Cloudflare Pages: contenido casi estático, SEO
  como prioridad, coste cero.
- Sin backend ni base de datos: el flujo de consultas se resuelve con función serverless +
  email. Evitar sobreingeniería.
- Sin compra online: obra original de gran formato, se vende mejor por consulta directa.
  Tienda de obra gráfica queda como posible fase 2.
- DDD ligero (dominio tipado + mapeo desde Sanity), sin bounded contexts ni agregados.
- El estado de disponibilidad de cada obra lo cambia el artista a mano en Sanity.
- Tailwind CSS v4; `design/tokens.md` es la fuente de verdad y `@theme` debe reflejarlo.
- La publicación se condiciona al éxito de `pnpm verify`, incluida la presencia de homes ES/EN y 404 en el build; el HTTP 200 se comprueba tras el primer despliegue y no causa rollback automático.
## Aprendizajes y errores a evitar
- (vacío por ahora)
## Próximos pasos
- Próxima tarea: T8, configurar la publicación automática desde la rama principal.
- Continuar las tareas en orden, una a una, solo tras solicitud explícita.
- Spec 001 — Chrome DevTools MCP: T1 completada. Configuración local en `.opencode/opencode.json`; `opencode mcp list` confirmó conexión y `list_pages` abrió Chrome; estadísticas desactivadas. `pnpm verify` pasó. La spec 000 sigue en T6.
