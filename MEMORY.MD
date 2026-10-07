# MEMORY.md — AF Tellería
Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no
aporte.
## Estado actual
- Proyecto sin código todavía. Arquitectura y stack decididos, AGENTS.md creado.
- Diseño base generado en Stitch (pendiente de exportar a `design/`).
## Decisiones (y por qué)
- Astro estático + Sanity (plan gratuito) + Cloudflare Pages: contenido casi estático, SEO
  como prioridad, coste cero.
- Sin backend ni base de datos: el flujo de consultas se resuelve con función serverless +
  email. Evitar sobreingeniería.
- Sin compra online: obra original de gran formato, se vende mejor por consulta directa.
  Tienda de obra gráfica queda como posible fase 2.
- DDD ligero (dominio tipado + mapeo desde Sanity), sin bounded contexts ni agregados.
- El estado de disponibilidad de cada obra lo cambia el artista a mano en Sanity.
## Aprendizajes y errores a evitar
- (vacío por ahora)
## Próximos pasos
- Crear repo y exportar diseño de Stitch a `design/` con tokens.
- Redactar y ejecutar spec 000-fundacion.