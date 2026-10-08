# MEMORY.md — AF Tellería
Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no
aporte.
## Estado actual
- Spec 000 aprobada; T1–T10 completadas. T2–T7: fundación estática ES/EN y gate `pnpm verify`. T8: Cloudflare Pages conectado a Git, publica solo tras el gate. T9: build fallido (`77900cc`) mantuvo la home activa en HTTP 200; reversión (`460a10e`) desplegó y verificó correctamente (RF-15, RF-16, RF-25). T10: revisión visual/accesible y Lighthouse móvil ES/EN (100 rendimiento, 100 accesibilidad, 100 SEO); layout tablet y nombres accesibles corregidos (RF-21, RF-22; RNF-2, RNF-3, RNF-7).
- Publicación limitada al gate `pnpm verify`, sin rollback por HTTP posterior. RF de publicación: RF-16 y RF-25.
- Diseño Stitch exportado y documentado en `design/tokens.md`.
- Cambio de dirección solicitado el 2026-10-07: el producto ofrecerá compra de originales disponibles y prints mediante pasarela. Brief actualizado; proveedor, tamaños, precios, logística, políticas y reglas de stock siguen pendientes. No implementar hasta aprobar una spec comercial.
## Decisiones (y por qué)
- Astro estático + Sanity (plan gratuito) + Cloudflare Pages: contenido casi estático, SEO
  como prioridad, coste cero.
- Sin backend ni base de datos: el flujo de consultas se resuelve con función serverless +
  email. Evitar sobreingeniería.
- Se prevé comercio electrónico para originales disponibles y prints. No se ha elegido pasarela ni cerrado las condiciones de venta; no almacenar ni procesar datos sensibles de tarjeta en el proyecto.
- DDD ligero (dominio tipado + mapeo desde Sanity), sin bounded contexts ni agregados.
- El estado de disponibilidad de cada obra lo cambia el artista a mano en Sanity.
- Tailwind CSS v4; `design/tokens.md` es la fuente de verdad y `@theme` debe reflejarlo.
- La publicación se condiciona al éxito de `pnpm verify`, incluida la presencia de homes ES/EN y 404 en el build; el HTTP 200 se comprueba tras el primer despliegue y no causa rollback automático.
- Canonical/hreflang usan temporalmente `https://telleria-art.pages.dev`; actualizar al dominio propio cuando se compre y configure.
## Aprendizajes y errores a evitar
- (vacío por ahora)
## Próximos pasos
- Spec 000 completada y conservada como registro de la fundación sin comercio; RF-13 solo describe esa entrega histórica.
- Spec 001 — Gestión editorial de obras, series y exposiciones: borrador creado tras cinco aclaraciones. No se han creado proyectos/datasets ni modificado contenido; faltan decisiones sobre series sin obras, metadatos SEO, precisión de dimensiones y atribución de textos críticos. Revisar y aprobar el borrador antes de iniciar plan/tareas.
- Comercio: resolver las dudas abiertas de `docs/product-brief.md` antes de redactar/aprobar su spec.
