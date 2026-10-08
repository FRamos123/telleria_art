# Constitución — AF Tellería
Principios innegociables. Toda spec, plan y tarea debe cumplirlos.
1. **Simplicidad primero**: sitio estático siempre que sea posible. Las funciones de compra podrán apoyarse en una pasarela externa y servicios serverless aprobados; no se implementará procesamiento propio de tarjetas ni se almacenarán datos sensibles de pago. Toda dependencia y servicio externo nuevo debe justificarse y aprobarse en su plan.
2. **La spec manda**: nada se implementa si no está en la spec activa. Si falta una decisión, se para y se pregunta.
3. **Dominio separado**: `src/domain/` es TypeScript puro, sin Astro ni Sanity.
4. **El diseño vive en `design/tokens.md` y se refleja en el `@theme` de Tailwind**: estilos solo con tokens; texto siempre en colores sólidos que cumplan WCAG AA.
5. **SEO y rendimiento son requisitos**: toda página pública de contenido debe ofrecer HTML renderizado en build, metadatos únicos, `hreflang` e imágenes optimizadas; JSON-LD y sitemaps acompañan a cada tipo de contenido al publicarse.
6. **Contenido y secretos ajenos a Git**: no se inventa contenido del artista; claves y `.env` fuera del repo. Código en inglés, interfaz en ES/EN.
