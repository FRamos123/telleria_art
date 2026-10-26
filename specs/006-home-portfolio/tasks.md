# Tareas 006 — Home portfolio
Estado: implementada
T1–T10 documentan la implementación inicial y T11–T20 la primera aproximación editorial. T21–T26 alinean fielmente la maquetación de la home con `design/alejandro_fern_ndez_teller_a_portfolio_oficial_obra_series/` (`screen.png` y `code.html`), aprobadas el 2026-10-26. Cada tarea se estima en 20–30 minutos o menos. Para lógica de dominio, escribir primero las pruebas y confirmar el fallo esperado antes de implementar.

- [x] **T1. Añadir el selector determinista de obras recientes y sus pruebas Vitest (~25 min).** RF-4, RF-8
  - Hecho cuando: `selectRecentHomeArtworks` devuelve una copia ordenada por año descendente e ID con comparación lexicográfica ordinal sensible a mayúsculas y no localizada, limita a tres, conserva listas de cero/una/dos obras y no muta la entrada; las pruebas primero fallan y después pasan con la implementación.

- [x] **T2. Añadir los mensajes ES/EN de navegación y selección de la home (~15 min).** RF-2, RF-4, RNF-1
  - Hecho cuando: ambos diccionarios contienen las mismas claves nuevas, con valores localizados no vacíos, y `messages.test.ts` verifica su paridad.

- [x] **T3. Identificar el directorio existente de series y fijar su contrato (~15 min).** RF-2, RF-3
  - Hecho cuando: `SeriesDirectory.astro` expone el destino estable `series-directory` sin cambiar su presentación y `catalog-components.test.ts` confirma que el destino solo existe cuando se renderiza el directorio.

- [x] **T4. Crear la navegación localizada de la home (~25 min).** RF-2, RF-3, RNF-1, RNF-2, RNF-3
  - Hecho cuando: `HomeNavigation.astro` renderiza solo destinos cuyas rutas/anclas están disponibles en la salida localizada, con enlaces semánticos, foco visible y wrap responsive; el enlace a series apunta al directorio existente, incluido contacto solo si su ruta está emitida. No introduce controles ni JavaScript de cliente; las pruebas cubren hrefs y omisiones.

- [x] **T5. Crear la selección de obras recientes (~20 min).** RF-4–RF-8, RNF-2, RNF-3, RNF-5, RNF-6
  - Hecho cuando: `HomeArtworkSelection.astro` omite el bloque con cero tarjetas y, con tarjetas, reutiliza `ArtworkCard` y `AvailabilityLabel` para los cuatro estados con etiqueta textual. Solo admite obras completas y enlazables; no crea tarjetas parciales, placeholders, filtros ni acciones comerciales. Pruebas de componente fijan ambos comportamientos.

- [x] **T6. Conectar las homes ES y EN con el catálogo publicado (~30 min).** RF-1–RF-8, RNF-1, RNF-4, RNF-5
  - Hecho cuando: ambas páginas usan `loadCatalogContent()` en build, filtran por versión completa, campos requeridos y ficha emitida en el idioma activo, seleccionan como máximo tres obras con T1, generan imágenes/hrefs localizados y muestran solo navegación disponible. Conservan identidad/metadatos existentes y emiten JSON-LD `WebPage` (URL, título, descripción e idioma de esos metadatos); sin fallback ni cambios a `SiteHeader`.

- [x] **T7. Verificar ambas homes en el HTML estático generado (~25 min).** RF-1–RF-8, RNF-1, RNF-4, RNF-5
  - Hecho cuando: `build-output.test.ts` comprueba identidad ES/EN, hrefs localizados sin destinos ausentes, máximo de tres tarjetas completas, omisión del bloque vacío, metadatos únicos, canonical/alternates, `WebPage` JSON-LD válido y presencia de ambas homes en el sitemap.

- [x] **T8. Pasar la verificación automatizada completa de web (~20 min).** RF-1–RF-8, RNF-1, RNF-4–RNF-6
  - Hecho cuando: `pnpm --dir web verify` pasa (lint, tipos, Vitest y build), incluidas las pruebas existentes de mappers/carga y las nuevas pruebas de dominio, componentes e HTML. No modificar contenido de producción en Sanity.

- [x] **T9. Revisar interfaz y accesibilidad con Chrome DevTools (~30 min).** RF-1–RF-8, RNF-1–RNF-3, RNF-5–RNF-6
  - Hecho cuando: en preview se revisan ES y EN a 375, 768 y 1280 px, reflujo a 320 px CSS y zoom al 200 %, contrastando con `design/`; se completa la revisión manual de todos los criterios WCAG 2.2 AA aplicables (teclado/foco, semántica/árbol, nombres, alt, contraste y reflow), sin overflow ni contenido perdido. Se comprueba que los destinos cargan y que HTML/imágenes no dependen de JavaScript.
  - Preparación de QA autorizada el 2026-10-25 y aplicada por la persona usuaria en `va9sgl77/development`; el build confirma ambos alt aprobados. No se modificó producción ni otros campos.

- [x] **T10. Mitigar CLS ES y auditar Lighthouse móvil ES/EN (~30 min).** RNF-2, RNF-4, RNF-5
  - Hecho cuando: las homes precargan solo las fuentes WOFF2 locales Bodoni Moda 400 Latin, Newsreader 400 Latin y Geist Latin; la primera tarjeta reserva su proporción a partir de las dimensiones originales y carga eager, mientras las demás imágenes/rutas conservan lazy. Las pruebas fijan el opt-in home-only y que el resto del sitio conserva la carga actual. `pnpm --dir web verify` pasa y Lighthouse 13.5.0 mobile, Chrome 155, 375×812/DPR 1 con throttling simulado alcanza ES/EN Performance ≥90, Accessibility ≥95 y SEO =100; se registra configuración/entorno/resultados. Si falla, detenerse y reportar diagnóstico sin ampliar más el alcance.
  - Diagnóstico inicial (2026-10-25): ES P89/A100/SEO100; EN P99/A100/SEO100. CLS ES 0.208, con dos shifts; Lighthouse señala llegada de la imagen de selección y fuentes locales Bodoni/Geist como causas posibles. FCP 1.1 s, LCP 2.0 s, TBT 0 ms.
  - Mitigación aplicada: precarga opt-in de las tres fuentes locales solo en home; figura de la primera tarjeta reserva aspect ratio desde sus dimensiones y la imagen carga eager. El resto mantiene lazy. Sin cambios de `@theme`, `font-display`, contenido, dependencias o comportamiento de otras rutas.
  - Resultado final (2026-10-25): `pnpm --dir web verify` pasó (423 tests). Lighthouse CLI 13.5.0, Chrome 155, preview Astro local (`127.0.0.1:4322`), navegación mobile 375×812/DPR 1, throttling `simulate`, mismas flags ES/EN: ES P99/A100/SEO100; EN P99/A100/SEO100. CLS=0 en ambas; FCP ES 1.0 s/EN 0.8 s, LCP ES 2.2 s/EN 2.0 s, TBT 0 ms. Lighthouse ejecutado vía `pnpm dlx`, sin cambios a `package.json` ni lockfile.

- [x] **T11. Documentar el nuevo patrón visual de home en tokens.** RF-9–RF-12, RNF-6
  - Hecho cuando: `design/tokens.md` describe el hero tipográfico, la composición asimétrica de obra principal/apoyo y los bloques condicionales, con guía responsive y changelog; reutiliza valores existentes y no cambia `@theme`.
  - Verificación (2026-10-26): añadida la entrada de changelog y el patrón home, con Bodoni Moda/Newsreader/Geist, grid 12/8/1 columnas, patrón de ficha existente y notas/exposiciones condicionales. No cambió `@theme`. `git diff --check` pasó; `pnpm --dir web verify` pasó (18 páginas, 423 tests).

- [x] **T12. Añadir textos opcionales del hero al schema de configuración global.** RF-13, RNF-1
  - Hecho cuando: `siteSettings` admite `homeIntroductionEs` y `homeIntroductionEn` opcionales, vacíos permitidos y espacios-only inválidos; `pnpm --dir studio build` pasa. No se completa ni publica contenido.
  - Implementación/verificación (2026-10-26): añadidos ambos campos `text` con validación opcional que rechaza solo espacios; `pnpm --dir studio build` pasó. No se editó ni publicó ningún documento de Sanity.

- [x] **T13. Cargar la presentación localizada desde Sanity en build.** RF-13, RNF-1, RNF-4
  - Hecho cuando: query/loader leen ambos campos publicados sin fallback, normalizan valores vacíos a ausentes y conservan sin cambios las descripciones SEO globales; tests cubren ES, EN y ausencia por idioma.
  - Implementación/verificación (2026-10-26): `siteSettingsQuery` proyecta ambos campos; `loadHomeIntroductions()` devuelve solo los idiomas con texto no vacío y recortado. Tests primero fallaron por falta de query/loader; después `pnpm --dir web exec vitest run src/infrastructure/sanity/catalog-content.test.ts src/infrastructure/sanity/queries.test.ts` pasó (19 tests). No se escribió ni publicó contenido.

- [x] **T14. Añadir selectores deterministas para exposiciones y notas de home con TDD.** RF-11–RF-12
  - Hecho cuando: pruebas primero fallan y luego pasan para hasta tres exposiciones por fecha descendente/ID ordinal y hasta dos notas de obras de apoyo, siguiendo el orden reciente; sin mutar entradas ni duplicar la nota de la obra principal.
  - Implementación/verificación (2026-10-26): `selectRecentHomeExhibitions` filtra por locale, ordena por fecha/ID y limita a tres; `selectHomeWorkshopNotes` omite textos vacíos y conserva el orden/límite de dos. Las cuatro pruebas fallaron antes de implementar y después `pnpm --dir web exec vitest run src/domain/catalog-presentation.test.ts` pasó (29 tests). Sin dependencias ni cambios de contenido.

- [x] **T15. Localizar navegación y etiquetas de los nuevos bloques.** RF-2, RF-9, RF-11–RF-12, RNF-1
  - Hecho cuando: ES/EN tienen paridad de claves para el enlace de textos críticos y los encabezados/labels de exposiciones y notas; la navegación solo emite destinos localizados existentes. Tests verifican paridad y hrefs.
  - Verificación (2026-10-26): añadidas las etiquetas i18n ES/EN y la navegación condicional a textos críticos; `messages.test.ts` y `catalog-components.test.ts` pasaron (75 tests) y `build-output.test.ts` pasó después del build (23 tests), con hrefs verificados contra las rutas estáticas.

- [x] **T16. Crear la presentación asimétrica de la obra principal.** RF-5, RF-10, RNF-2–RNF-3, RNF-5–RNF-6
  - Hecho cuando: el componente muestra imagen optimizada con dimensiones/alt, nombre de serie enlazado si está visible, ficha técnica existente y nota localizada de esa obra si existe; las obras de apoyo conservan `ArtworkCard`. Sin contenido ni acciones comerciales nuevos.
  - Implementación/verificación (2026-10-26): creado `HomeArtworkFeature.astro` reutilizando `EditorialImage` y `ArtworkTechnicalSheet`; este último acepta `headingLevel=3` en home y conserva `h2` por defecto en fichas. La nota es opcional, sin duplicar enlaces anidados. `catalog-components.test.ts` pasó (63 tests) y `pnpm --dir web check` pasó. Aún no integrado en las páginas (T18).

- [x] **T17. Crear bloques condicionales de exposiciones y notas.** RF-11–RF-12, RNF-1–RNF-3
  - Hecho cuando: los componentes muestran únicamente datos localizados publicados, con enlaces generados; omiten cada bloque vacío y no duplican la nota de la obra principal. Tests cubren ES/EN y casos vacíos.
  - Implementación/verificación (2026-10-26): creados `HomeExhibitions.astro` y `HomeWorkshopNotes.astro`, con validación de datos/enlaces, fechas localizadas, mensajes i18n y omisión de bloques vacíos. `catalog-components.test.ts` pasó (65 tests) y `pnpm --dir web check` pasó. La selección de notas desde obras de apoyo se integra en T18.

- [x] **T18. Componer las homes ES/EN con la jerarquía aprobada.** RF-1–RF-13, RNF-1, RNF-4–RNF-6
  - Hecho cuando: ambas páginas presentan hero, intro opcional, navegación al inicio, obra feature/apoyo y secciones condicionales; mantienen metadatos, JSON-LD, canonical/hreflang, sitemap, selección reciente, T10 y cero JS de cliente. Tests verifican la salida estática.
  - Implementación/verificación (2026-10-26): ambas homes cargan la presentación opcional, dividen tipográficamente la identidad aprobada, añaden el enlace a textos críticos y componen feature/apoyo, exposiciones y notas. `pnpm --dir web check`, build de 18 páginas, `build-output.test.ts` (23 tests) y `catalog-components.test.ts` (65 tests) pasaron. No se añadió copy ni se modificó contenido Sanity.

- [x] **T19. Ejecutar build, tipos, lint y suite completa.** RF-1–RF-13, RNF-1, RNF-4–RNF-6
  - Hecho cuando: `pnpm --dir studio build` y `pnpm --dir web verify` pasan con los campos nuevos vacíos y con datos disponibles; ningún test requiere publicar o modificar contenido de producción.
  - Verificación (2026-10-26): `pnpm --dir studio build` pasó; `pnpm --dir web verify` pasó (lint, tipos, build de 18 páginas y 433 tests en 26 archivos). Los campos nuevos están vacíos; no se editó Sanity.

- [x] **T20. Revisar la home rediseñada en Chrome y Lighthouse.** RF-1–RF-13, RNF-1–RNF-6
  - Hecho cuando: ES/EN se revisan a 375×812, 768×900 y 1280×900, además de reflujo a 320 px y zoom 200 %; destinos, teclado/foco, alt, HTML sin JS y bloques vacíos son correctos. Lighthouse móvil con configuración común alcanza Performance ≥90, Accessibility ≥95 y SEO =100; se registran resultados y cualquier limitación.
  - Verificación (2026-10-26): Chrome preview ES/EN revisado a 375×812, 768×900 y 1280×900; reflujo a 320 CSS px y a 640×450 CSS/DPR2, equivalente al viewport CSS de escritorio a zoom 200 %. Sin overflow; contenido localizado, una `main`/`h1`, cero JS cliente (solo JSON-LD), imágenes cargadas con alt y dimensiones, rutas internas HTTP 200 y foco visible de 2 px. Lighthouse CLI 13.5.0 mobile 375×812/DPR1/throttling simulate: ES P97/A100/SEO100 (CLS 0.0009, LCP 2.56 s, TBT 0); EN P99/A100/SEO100 (CLS 0.0009, LCP 2.10 s, TBT 0). Home introduction vacía se omite sin hueco; con los datos actuales aparece una exposición y solo notas publicadas/localizadas.
  - Limitación: Chrome DevTools MCP no expone el zoom UI real; el reflow de zoom se comprobó con viewport efectivo de 640 CSS px a DPR2. No se desplegó a Cloudflare Pages ni se desplegó el Studio; el repo queda listo para el siguiente ciclo de publicación.

- [x] **T21. Actualizar `design/tokens.md` con la composición fiel a la referencia de diseño (~15 min).** RF-2, RF-5, RF-9–RF-12, RNF-6
  - Hecho cuando: `design/tokens.md` documenta la navegación encima del hero, el hero en tres líneas con CTAs, las obras seleccionadas en bloques curatoriales completos de 12 columnas alternados con `InventoryBadge`, las filas de exposiciones de 12 columnas y el bloque de cierre hacia contacto, junto con su entrada de changelog y sin cambios en `@theme`.

- [x] **T22. Añadir las claves i18n ES/EN para CTAs del hero, acciones de obra, cabecera de exposiciones y cierre de contacto (~15 min).** RF-2, RF-5, RF-9, RF-11–RF-12, RNF-1
  - Hecho cuando: `web/src/i18n/es.ts` y `web/src/i18n/en.ts` exponen con paridad las etiquetas para «Explorar obras», «Ver ficha de obra», eyebrow/enlace de exposiciones y textos del bloque de cierre hacia contacto, y `messages.test.ts` pasa.

- [x] **T23. Mostrar todas las obras seleccionadas en bloques curatoriales alternados de 12 columnas y retirar `HomeWorkshopNotes` (~25 min).** RF-4–RF-8, RF-10, RNF-2–RNF-3, RNF-5–RNF-6
  - Hecho cuando: `ArtworkTechnicalSheet.astro` admite un `headingId` único por obra; `HomeArtworkFeature.astro` incluye `InventoryBadge` sobre la imagen, serie enlazada, título en `headline-lg-mobile`/`headline-lg`, atribución `{artistName}, {year}`, ficha técnica, nota de taller en `blockquote` (si existe) y botones de acción hacia la ficha y hacia contacto con `?obra=`/`?artwork=`, alternando las columnas de imagen (7 cols) y ficha (5 cols) en escritorio cuando `reversed` es verdadero; `HomeArtworkSelection.astro` renderiza todas las obras seleccionadas con `HomeArtworkFeature` (`loading="eager"` en la primera y `"lazy"` en las siguientes) y espaciado vertical amplio, sin `ArtworkCard` ni `HomeWorkshopNotes.astro`.

- [x] **T24. Alinear navegación superior, Hero, Exposiciones seleccionadas y cierre hacia contacto (`HomeContactSection.astro`) (~25 min).** RF-1–RF-3, RF-9, RF-11–RF-13, RNF-1–RNF-3, RNF-6
  - Hecho cuando: `HomeNavigation.astro` se ubica encima del hero en `index.astro` y `en/index.astro`; el hero parte `artistName` en tres líneas (`Alejandro` / `Fernández` / `tellería`), alinea `artistIdentification` a la derecha y sitúa `homeIntroduction` (7 cols) junto a los botones CTA hacia obras y contacto (5 cols); `HomeExhibitions.astro` muestra cabecera editorial con eyebrow/enlace al índice y filas de 12 columnas (`fecha` | `título` | `lugar`); y `HomeContactSection.astro` cierra la página sobre `surface-container` hacia `/contacto/` o `/en/contact/`.

- [x] **T25. Actualizar pruebas de componentes y salida estática y pasar `pnpm --dir web verify` (~20 min).** RF-1–RF-13, RNF-1, RNF-4–RNF-6
  - Hecho cuando: `catalog-components.test.ts` y `build-output.test.ts` verifican los bloques curatoriales completos alternados para todas las obras seleccionadas, `InventoryBadge`, las acciones a ficha y consulta, el hero con CTAs, las filas de exposiciones y el cierre hacia contacto; `pnpm --dir web verify` pasa completo (lint, tipos, tests y build).

- [x] **T26. Verificar en Chrome DevTools (`localhost:4321` / preview) ES y EN en móvil, tablet y escritorio (~20 min).** RF-1–RF-13, RNF-1–RNF-6
  - Hecho cuando: la home ES y EN se revisa en Chrome DevTools a 375×812, 768×900 y 1280×900 comparada con `screen.png`, comprobando la alternancia impar/par de obras en escritorio, el orden imagen→ficha en móvil/tablet, la ausencia de overflow horizontal, el foco visible y Lighthouse móvil ≥90/95/100; se actualizan `tasks.md`, `spec.md` y `MEMORY.md`.
- [x] **T27. Unificar la barra superior con navegación en todas las pantallas y actualizar el nombre artístico a «Alex Tellería» (~20 min).** RF-1–RF-3, RF-9, RNF-1–RNF-3
  - Hecho cuando: `SiteHeader.astro` integra la marca (`Alex Tellería` + `artistIdentification`), `HomeNavigation.astro` y `LanguageSwitcher.astro` en una sola barra superior para todas las páginas; se retira la segunda barra en `index.astro` y `en/index.astro`; los diccionarios ES/EN usan `Alex Tellería` (sin «Fernández»); y `pnpm --dir web verify` junto con Chrome DevTools confirman cero avisos y una única barra superior.
