# Tareas 006 — Home portfolio
Estado: aprobada
Las 10 tareas están ordenadas por dependencias reales y estimadas para completarse en 20–30 minutos o menos cada una. La versión inicial se aprobó el 2026-10-25; la actualización acotada de T10 para mitigar CLS también fue aprobada por la persona usuaria el 2026-10-25. Para lógica de dominio, escribir primero las pruebas y confirmar el fallo esperado antes de implementar.

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
