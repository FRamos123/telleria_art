# Hoja de ruta de specs — AF Tellería

**Estado:** propuesta de trabajo; no aprobada como spec ni como plan de implementación.

La Spec 000 — Fundación está completada. La instalación/configuración de Chrome DevTools MCP fue una tarea de herramienta, no una spec de producto. Por tanto, la siguiente spec disponible es la **001**.

## Instrucción común para lanzar cada prompt

Pega este bloque antes del texto de la spec elegida:

> Lee `AGENTS.md`, `docs/constitution.md`, `docs/product-brief.md`, `design/tokens.md` y `MEMORY.md`. Redacta únicamente un borrador de `spec.md` en la carpeta y ruta indicadas. No crees `plan.md` ni `tasks.md`, no cambies código y no empieces implementación hasta que apruebe expresamente la spec. Respeta los límites y decisiones ya acordados. No inventes contenido del artista ni completes decisiones abiertas por tu cuenta: enumera las dudas y pregúntamelas antes de cerrar el borrador.

## Orden propuesto

### 001 — Base editorial en Sanity

**Ruta:** `specs/001-contenido-sanity/spec.md`  
**Dependencia:** ninguna; prepara los datos que consumen las páginas públicas.

**Texto para lanzar:**

> Quiero definir la gestión del contenido editorial de obras, series y exposiciones en Sanity y su disponibilidad para el portfolio. Define los datos obligatorios y opcionales, relaciones, campos ES/EN y reglas de contenido incompleto según `docs/product-brief.md`. Incluye imágenes y texto alternativo; contempla los cuatro estados de disponibilidad del original sin inferir de ellos la disponibilidad de prints. No escribas contenido de ejemplo que pueda confundirse con contenido real ni modifiques contenido de producción. Pregúntame qué decisiones sobre el proyecto o dataset de Sanity son imprescindibles y todavía no constan.

### 002 — Catálogo y páginas de series

**Ruta:** `specs/002-catalogo-series/spec.md`  
**Dependencia:** Spec 001 aprobada e implementada.

**Texto para lanzar:**

> Redacta la spec 002 para que visitantes exploren el catálogo de obras y las páginas de series en español e inglés. Define qué información se muestra en listados, cómo se navega entre serie y obra y qué ocurre con traducciones o contenido que no esté publicado. Incluye disponibilidad como texto, SEO y requisitos responsive/accesibles. No inventes obras ni textos; no incluyas compra, checkout ni gestión de pedidos.

### 003 — Fichas públicas de obra

**Ruta:** `specs/003-fichas-obra/spec.md`  
**Dependencia:** Specs 001 y 002 aprobadas e implementadas.

**Texto para lanzar:**

> Redacta la spec 003 para las páginas individuales de obra. Usa los campos obligatorios y opcionales del brief, presenta dimensiones en centímetros y los cuatro estados de disponibilidad con etiqueta textual, y contempla imágenes optimizadas, texto alternativo, versiones ES/EN, metadatos, datos estructurados y sitemap. Define qué se omite o bloquea cuando falte contenido. Hasta aprobar una spec comercial, excluye compra, checkout y promesas de disponibilidad de prints. No inventes información del artista.

### 004 — Exposiciones y textos críticos

**Ruta:** `specs/004-exposiciones-textos-criticos/spec.md`  
**Dependencia:** Spec 001 aprobada e implementada.

**Texto para lanzar:**

> Redacta la spec 004 para presentar exposiciones y textos críticos disponibles, y relacionarlos con obras o series solo cuando esa relación esté confirmada en el contenido. Define campos obligatorios/opcionales, comportamiento cuando falte una traducción o imagen, rutas ES/EN, SEO, datos estructurados y sitemap. No redactes textos en nombre del artista ni inventes exposiciones.

### 005 — Consultas y contacto

**Ruta:** `specs/005-consultas-contacto/spec.md`  
**Dependencia:** las páginas de obra y exposición pueden enlazar al formulario cuando exista.

**Texto para lanzar:**

> Redacta la spec 005 para consultas de coleccionistas e instituciones, independiente del checkout. Define campos, validación, conservación de datos al corregir o reintentar, identificación opcional de una obra, confirmación y protección antispam. Incluye consentimiento y privacidad conforme al brief, pero no inventes textos legales: señala qué debe proporcionarme o revisar una persona responsable. No incorpores pagos ni gestión de pedidos.

### 006 — Home del portfolio y navegación

**Ruta:** `specs/006-home-portfolio/spec.md`  
**Dependencia:** las rutas de catálogo, series, exposiciones y contacto a las que enlace la home deben existir.

**Texto para lanzar:**

> Redacta la spec 006 para evolucionar la home mínima a la entrada del portfolio y añadir la navegación aprobada hacia obras, series, exposiciones y contacto. Usa las referencias de `design/` y exclusivamente patrones y tokens de `design/tokens.md`; define los textos e imágenes solo a partir de contenido real disponible. Incluye versión ES/EN, accesibilidad, responsive, SEO y rendimiento. No añadas secciones o contenido editorial inventado ni enlaces a rutas inexistentes.

### 007 — Comercio electrónico

**Ruta:** `specs/007-comercio/spec.md`  
**Bloqueada hasta resolver las decisiones comerciales abiertas del brief.**

**Texto para lanzar cuando estén resueltas:**

> Redacta la spec 007 para la compra de originales disponibles y prints configurados, usando únicamente las decisiones comerciales que ya haya confirmado. Antes de cerrar el borrador, verifica que están definidos proveedor y flujo de checkout, países y moneda, precios/impuestos/gastos, variantes y edición de prints, stock y su relación con `Availability`, logística, devoluciones/reembolsos, privacidad, datos conservados y emails. Si falta algo, detente y pregúntamelo; no elijas proveedor ni infieras políticas. Prohíbe procesar o almacenar datos sensibles de tarjeta en el proyecto y separa claramente consulta de compra.

**Antes de lanzar esta spec, responder las dudas 118–126 de `docs/product-brief.md`.**

### 008 — Dominio propio

**Ruta:** `specs/008-dominio-propio/spec.md`  
**Dependencia:** compra y configuración del dominio.

**Texto para lanzar cuando tengas el dominio:**

> Redacta la spec 008 para migrar la identidad pública desde `telleria-art.pages.dev` al dominio que te indicaré. Pregúntame primero el dominio y qué comportamiento deseo para las URLs antiguas. Define los requisitos de Cloudflare, canonical, hreflang, redirecciones y comprobaciones SEO; no cambies configuración ni DNS durante la fase de spec.

## Reglas de la hoja de ruta

- Cada prompt inicia una sola spec; la secuencia puede ajustarse si cambian las prioridades.
- Una spec no autoriza su plan ni implementación: cada fase necesita aprobación explícita.
- La spec de comercio no debe redactarse como aprobada mientras queden decisiones comerciales abiertas.
- Esta hoja de ruta no sustituye `docs/product-brief.md` ni amplía por sí sola el alcance aprobado.
