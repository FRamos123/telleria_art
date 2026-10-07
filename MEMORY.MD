# MEMORY.md — AF Tellería
Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no
aporte.
## Estado actual
- Proyecto sin código de aplicación todavía.
- Spec 000 aprobada; `plan.md` y `tasks.md` redactados. Implementación pendiente de las aprobaciones técnicas de T1.
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
## Aprendizajes y errores a evitar
- (vacío por ahora)
## Próximos pasos
- Completar T1: aprobar dependencias, configuración raíz, `@theme` y estrategia de rollback HTTP 200.
- Después, implementar las tareas en orden, una a una.
