# Plan 006 — Home portfolio
Estado: aprobada

Spec de referencia: `spec.md` (**aprobada**, sin dudas abiertas). El plan inicial y la composición de home se aprobaron el 2026-10-25. Tras Lighthouse ES P89, la persona usuaria aprobó actualizar T10 para mitigar CLS con cambios limitados a precargas locales en homes y reserva del espacio intrínseco de la imagen; se mantienen los umbrales originales y se vuelve a auditar ES/EN.

## Alcance y dependencias

- Se reutilizan `loadCatalogContent()` y `mapSanityContent()` para consumir en build solo contenido publicado y ya validado por idioma. No se crea un mapper paralelo ni se consulta Sanity en el navegador.
- Un destino está disponible si su módulo/ruta localizada está incluido en la compilación estática vigente; para rutas fijas, la página determina la presencia del módulo con `import.meta.glob` durante el build; para fichas dinámicas, la disponibilidad se deriva de las mismas obras que alimentan `getStaticPaths`. El enlace a series requiere además que exista el ancla del directorio localizado. La prueba de salida comprueba el HTML final.
- Las reglas de publicación de Spec 001 permanecen vigentes: obras, series y exposiciones requieren español completo; la traducción inglesa completa habilita además su versión EN. La selección consume solo traducciones completas del idioma activo y no cambia las reglas ni schemas editoriales.
- El detalle de cada obra se genera desde el mismo catálogo mapeado y solo para las traducciones visibles del idioma. El enlace de cada tarjeta usará la ruta localizada ya establecida por las fichas.
- `MEMORY.md` registra que Spec 005 ya tiene aviso final aprobado y la revisión de despliegue completada. Este plan no modifica el aviso ni autoriza cambios legales; antes de publicar se volverá a comprobar que las rutas de contacto están incluidas en el build.
- No se cambian schemas de Sanity, tipos públicos de dominio, `@theme`, `design/tokens.md`, dependencias, servicios externos ni JavaScript de cliente. La excepción aprobada de T10 solo precarga fuentes locales en homes y reserva el espacio intrínseco de la primera imagen seleccionada.

### Excepción puntual de contenido aprobada (2026-10-25)

- Para desbloquear la revisión manual de accesibilidad de T9, la persona usuaria aprobó actualizar únicamente `altText` de las traducciones ES/EN de «Centinela Carmesí» en `va9sgl77/development` con estos valores: ES «Rostro parcialmente en sombra, enmarcado por una capucha roja sobre un fondo ocre»; EN “A partially shadowed face framed by a red hood against an ochre background.”
- La edición y publicación se limitan al dataset de desarrollo. No se modifica producción ni ningún otro campo/contenido. Después se comprobarán los valores en la salida estática y en T9.

## Archivos previstos y responsabilidad

| Acción y archivo | Responsabilidad | RF cubiertos |
|---|---|---|
| **Modificar** `web/src/pages/index.astro` | Conservar la identidad ES; cargar el catálogo en build; preparar navegación disponible y tarjetas elegibles ES; emitir `WebPage` JSON-LD con la URL, título, descripción e idioma localizados existentes, además de los metadatos actuales. | RF-1–RF-8, RNF-1, RNF-4–RNF-5 |
| **Modificar** `web/src/pages/en/index.astro` | Equivalente EN, sin reutilizar texto/alt ES ni enlazar rutas ES; emitir su `WebPage` JSON-LD localizado. | RF-1–RF-8, RNF-1, RNF-4–RNF-5 |
| **Modificar para T10** `web/src/layouts/BaseLayout.astro` | Añadir un opt-in para precargar únicamente Bodoni Moda 400 Latin, Newsreader 400 Latin y Geist Latin en las dos homes; el resto de páginas mantiene la carga actual. | RNF-5 |
| **Crear** `web/src/components/HomeNavigation.astro` | Renderizar navegación semántica localizada a obras, series, exposiciones y contacto; omitir el enlace a series cuando no exista directorio con series visibles en el idioma. No modifica `SiteHeader` ni la navegación global de otras páginas. | RF-2–RF-3, RNF-1–RNF-3 |
| **Crear** `web/src/components/HomeArtworkSelection.astro` | Omitir la sección si recibe cero tarjetas; en otro caso presentar el título funcional localizado y una cuadrícula con `ArtworkCard` existente. No contiene datos ni tarjetas de relleno. | RF-4–RF-8, RNF-2–RNF-3, RNF-5–RNF-6 |
| **Modificar para T10** `web/src/components/ArtworkCard.astro`, `HomeArtworkSelection.astro` | Reservar en el `figure` solo de la primera tarjeta home la proporción intrínseca derivada de sus dimensiones; solicitar `eager` para esa tarjeta y mantener `lazy` en las demás/rutas. No cambia el encuadre ni otras rutas. | RNF-5 |
| **Modificar** `web/src/components/SeriesDirectory.astro` | Añadir un identificador estable (`series-directory`) al bloque ya existente para que la navegación de la home llegue directamente a ese directorio, sin cambiar su presentación. | RF-2–RF-3 |
| **Modificar** `web/src/domain/catalog-presentation.ts` | Añadir una función pura de presentación que ordene una copia de las obras elegibles por año descendente e ID ascendente, y devuelva como máximo tres. No cambia `MappedArtwork`, value objects ni reglas de publicación. | RF-4, RF-8 |
| **Modificar** `web/src/domain/catalog-presentation.test.ts` | Probar orden, desempate lexicográfico por ID, límite de tres, listas de cero/una/dos obras y no mutación de la entrada. | RF-4, RF-8 |
| **Modificar** `web/src/i18n/es.ts`, `web/src/i18n/en.ts` | Añadir etiquetas funcionales localizadas para la navegación de la home y el encabezado de la selección; no añadir contenido editorial del artista. | RF-1–RF-2, RF-4, RNF-1 |
| **Modificar** `web/src/i18n/messages.test.ts` | Comprobar presencia y paridad ES/EN de las nuevas claves y que los textos no estén vacíos. | RF-2, RF-4, RNF-1 |
| **Modificar** `web/src/components/catalog-components.test.ts` | Fijar el contrato estructural de los nuevos componentes: navegación semántica/localizada, enlace condicional al directorio, omisión de selección vacía, uso de `ArtworkCard`, foco y ausencia de controles comerciales. | RF-2–RF-8, RNF-1–RNF-3, RNF-6 |
| **Modificar** `web/src/i18n/build-output.test.ts` | Verificar HTML final de ambas homes: identidad, textos y hrefs localizados, selección completa de hasta tres tarjetas, ausencia de relleno, metadatos/canonical/hreflang, `WebPage` JSON-LD y existencia en sitemap. Contrastar los destinos con las rutas y anclas emitidas en `dist`. | RF-1–RF-8, RNF-1, RNF-4–RNF-5 |

### Reutilizar sin modificar

- `web/src/infrastructure/sanity/catalog-content.ts`, `web/src/infrastructure/sanity/queries.ts` y `web/src/infrastructure/sanity/mappers.ts`: ya cargan contenido publicado, validan las traducciones e imágenes requeridas y entregan las obras/series por idioma. `mappers.test.ts` y `catalog-content.test.ts` se ejecutan para cubrir esa frontera; sus casos existentes incluyen ausencia de traducción o imagen y ausencia de fallback. Solo se ampliarían si la implementación revela un hueco concreto, sin cambiar reglas editoriales de la spec 001.
- `web/src/components/ArtworkCard.astro`, `EditorialImage.astro` y `AvailabilityLabel.astro`: preservan el enlace unitario de tarjeta, el alt localizado, `width`/`height`, `srcset`, WebP responsive y las cuatro etiquetas textuales de disponibilidad. T10 añade una prop opcional de carga; lazy sigue siendo el valor por defecto y solo la primera tarjeta home se solicita eager. La selección no filtra por disponibilidad ni agrega compra/reserva.
- `web/src/infrastructure/sanity/image-url.ts`: genera URLs transformadas WebP y variantes responsive a partir de la proyección Sanity; no se envía el original a tamaño completo.
- `web/src/layouts/BaseLayout.astro`, `web/src/infrastructure/sitemap.ts` y las páginas fijas ES/EN: ya proporcionan metadatos, canonical/hreflang y sitemap con ambas homes. T10 habilita un opt-in de precarga de tres fuentes locales solo en home; las demás rutas mantienen el comportamiento actual.

## Modelo de dominio y mappers

- No se introduce un modelo de dominio nuevo ni se modifica el schema de Sanity.
- La entrada de selección es `MappedArtwork[]` de `loadCatalogContent()`. Las reglas de completitud de Spec 001 y `mapSanityContent()` ya validan la versión ES base, las traducciones disponibles, imagen con dimensiones, texto alternativo, título, año y `Availability`; las relaciones por idioma condicionan que la ficha localizada sea generable.
- Antes de ordenar, cada página filtra por `artwork.translations[locale]` y por la existencia del destino de ficha en la salida. Si falta cualquier dato requerido por la definición de obra válida, no se incluye la obra completa. La proyección de imagen y alt proceden de la misma versión/localización; no hay sustitución entre idiomas.
- La función nueva de `catalog-presentation.ts` trabaja sobre datos ya elegibles y no importa Astro, Sanity ni componentes. El desempate compara IDs con `<` / `>` (orden lexicográfico ordinal, sensible a mayúsculas y no localizado).
- Para la navegación, cada página deriva `hasLocalizedSeries` de las series mapeadas. Los hrefs se construyen solo con rutas localizadas emitidas; el enlace al directorio requiere que el HTML del catálogo contenga el ancla `series-directory`. Las pruebas del build bloquean hrefs sin destino.

## Algoritmo durante el build

```text
para locale en [es, en]:
  messages = getMessages(locale)
  catalog = await loadCatalogContent()  // Sanity published + mapSanityContent

  availableFixedRoutes = keys de import.meta.glob para rutas fijas de locale
  localizedSeries = catalog.series donde translations[locale] existe
  navigation = solo destinos fijos con módulo presente en availableFixedRoutes
  si localizedSeries no está vacío:
    añadir enlace a catálogo(locale) + #series-directory solo si el ancla está emitida

  eligibleArtworks = catalog.artworks donde:
    translations[locale] existe
    y título, año, Availability, imagen/dimensiones y alt de locale son válidos
    y existe una ruta dinámica de ficha de esa locale en getStaticPaths

  selected = selectRecentHomeArtworks(eligibleArtworks)
    // copia ordenada por year DESC, luego id ASC; slice(0, 3)

  cards = selected.map(artwork => {
    translation = artwork.translations[locale]
    image = createResponsiveImage(artwork.mainImage.projection, buildConfig)
    href = ruta localizada de ficha(artwork.id)
    return { artwork, image, href }
  })

  render identidad aprobada + HomeNavigation
  si cards.length > 0:
    render HomeArtworkSelection(cards, locale)
  si no:
    no renderizar el bloque de selección

  render JSON-LD WebPage con canonical URL, título, descripción e inLanguage
    tomados de los metadatos localizados existentes
```

La ordenación se ejecuta después del mapeo y filtro de idioma: limitar antes de descartar contenido inválido podría dejar menos de tres obras aunque hubiera otras válidas. No se muta el catálogo compartido.

## Construcción de la interfaz y tokens

- **Identidad:** se conserva la estructura y el contenido aprobado actuales (`artistName`, `artistIdentification`), con `display-hero-mobile`/`display-hero`, `body-lg`, `on-surface` y `on-surface-variant`; contenedor `max-w-7xl`, una columna móvil, ocho columnas tablet y doce escritorio.
- **Navegación de la home:** componente `<nav>` con nombre accesible localizado y enlaces HTML, sin hidratación. Reutiliza el patrón documentado de navegación/directorio: Geist `label-technical`, texto sólido `on-surface`/`primary`, espaciado `space-sm`/`space-md` y gutters existentes; wrap en móvil, foco visible conforme al patrón aprobado y sin color como único indicador.
- **Selección:** `HomeArtworkSelection` usa un encabezado funcional ES/EN y la cuadrícula aprobada de una columna móvil, ocho columnas tablet y doce escritorio. Se reutilizan `ArtworkCard`, `EditorialImage` y `AvailabilityLabel`; por tanto, las tarjetas muestran únicamente imagen, título, año y estado textual, con foco visible, texto sólido y sin acciones comerciales.
- **Tokens:** se mantienen `margin-mobile`, `gutter-mobile`, `gutter`, `space-sm`, `space-md`, `space-lg`, `space-xl`, `max-w-7xl`, `surface-container-lowest`, `surface-container-low`, `on-surface`, `on-surface-variant`, `primary`, `headline-sm`, `body-md` y `label-technical`, además de los breakpoints tablet `768px` y desktop `1280px`. No se admiten valores arbitrarios, colores con alpha en texto, cambios de paleta, radios o tipografía.
- **Composición aprobada:** la persona usuaria aprobó el 2026-10-25 conservar la identidad actual y añadir navegación localizada y selección opcional de hasta tres obras. Se implementa con los patrones existentes, sin añadir un patrón/token ni cambiar `@theme`.
- No se añade una sección editorial: la selección y los enlaces son UI funcionales. No se inventan biografía, citas, manifiestos ni datos artísticos.

## Decisiones técnicas

| Decisión | Justificación | Alternativa descartada |
|---|---|---|
| Generar home, navegación y tarjetas en build con Astro estático. | Entrega contenido en HTML sin JavaScript, consistente con SEO y queries a Sanity solo en build. | Fetch de Sanity en el navegador, hidratación o generación por visita. |
| Reutilizar `loadCatalogContent()` / `mapSanityContent()`. | Centraliza publicación, visibilidad, validación de traducción, imagen y relación con series por idioma. | GROQ o mapper de home duplicado con criterios de elegibilidad distintos. |
| Ordenar y limitar en una función pura de dominio/presentación después de validar el idioma. | Hace verificable el desempate exacto requerido y evita que candidatos inválidos ocupen uno de los tres puestos. | Confiar en el orden accidental de Sanity, limitar en GROQ antes del mapeo o usar orden por inventario del catálogo. |
| Reutilizar `ArtworkCard`, `EditorialImage` y `AvailabilityLabel`. | Mantiene el patrón ya aprobado, el alt localizado, transformaciones, dimensiones y etiquetas de Availability. | Crear tarjetas visualmente distintas solo para home o filtrar por estado. |
| Navegar a series mediante el directorio dentro de la ruta de obras. | Coincide con la definición de la spec; el enlace no inventa un índice/ruta de series. | Crear una ruta independiente, carrusel o filtro de series. |
| Dejar la home sin JavaScript de cliente y usar enlaces HTML. | Satisface el alcance de orientación y contenido estático con teclado y lectura sin JS. | Menú interactivo o carrusel hidratado. |
| Resolver disponibilidad de rutas en build, no en el navegador. | `import.meta.glob` detecta módulos de rutas fijas durante la compilación; los destinos dinámicos de obra salen del catálogo usado por `getStaticPaths`. La prueba del HTML valida las URLs finales. | Inspección en runtime, fetch de rutas o renderizar enlaces y confiar solo en que respondan. |
| Mantener metadatos y sitemap existentes. | Las homes ya tienen títulos/descripciones localizados, canonical, alternates y entradas en sitemap; se añade cobertura de salida en tests. | Cambiar `BaseLayout`/sitemap compartidos sin necesidad de la spec. |
| Emitir JSON-LD `WebPage` por home con metadatos localizados existentes. | Cumple la constitución sin inventar biografía ni modelar una entidad artística nueva; Astro puede serializar JSON-LD estático en cada página. | Omitir JSON-LD en la home o derivar un `Person`/contenido artístico que la spec no autoriza. |
| Mitigación T10 aprobada: precargar en home los WOFF2 locales usados above-the-fold, reservar la proporción intrínseca de la primera imagen seleccionada y solicitarla eager. | Lighthouse 13.5.0 / Chrome 155 registró ES CLS 0.208 y dos shifts; los diagnósticos señalan llegada tardía de medios y fuentes locales. Se limita a homes y conserva `font-display`, familias, pesos, `srcset`, dimensiones y aspecto visual final. | Cambiar tipografía/font-display, hacer eager todas las imágenes, añadir dependencias o rediseñar la sección. |

## Puntos de «⚠️ Preguntar antes» de AGENTS.md

1. **Layout de una pantalla existente:** la composición (identidad existente, navegación localizada y selección opcional de obras) fue aprobada explícitamente por la persona usuaria el 2026-10-25. La aprobación no autoriza cambiar paleta, tipografía, tokens ni otras pantallas.
2. **Patrón de navegación:** se reutiliza el patrón documentado de navegación/directorio con tokens existentes. Si durante la implementación se determina que hace falta un patrón visual nuevo o nuevos valores, parar y proponer primero el cambio de `design/tokens.md` con entrada de changelog; cualquier cambio de `@theme` requiere aprobación previa.
3. **Dominio, schemas, dependencias y servicios:** el plan evita modificar tipos públicos, schemas, dependencias, servicios externos y `@theme`. Si la implementación demuestra que alguno es imprescindible, pedir autorización antes de cambiarlo.
4. **JavaScript de cliente:** no se propone. Si se considera necesario, pedir aprobación previa; no es necesario para estos RF.
5. **Mitigación T10 aprobada el 2026-10-25:** opt-in de precarga de tres WOFF2 locales en homes, reserva de proporción desde dimensiones de imagen y eager solo en la primera tarjeta. No cambia `@theme`, familias/pesos/font-display, paleta, contenido, servicios o hidratación.

La revisión legal de Spec 005 está cerrada según el aviso final aprobado y el registro en `MEMORY.md`. RF-3 sigue requiriendo que la ruta localizada de contacto forme parte de la salida estática vigente; este plan no cambia ni vuelve a publicar el aviso.

## Alcanzabilidad con la plataforma elegida

| Garantía | Evaluación |
|---|---|
| HTML ES/EN con datos publicados, presente sin ejecutar JS. | **Alcanzable:** Astro tiene `output: 'static'`; las páginas pueden esperar al cliente Sanity durante el build y emitir HTML. Sin credenciales/configuración válida de Sanity el build debe fallar como ya lo hace el resto del catálogo, no servir contenido inventado. |
| Selección localizada, orden por año/ID y máximo tres. | **Alcanzable:** el mapper existente entrega traducciones e imágenes válidas; una función pura aplica el orden y límite después del filtro. Los destinos de ficha están alineados con las rutas estáticas generadas desde el mismo catálogo. |
| Enlace a series solo si existe directorio localizado. | **Alcanzable:** el build conoce las series visibles por idioma; la home omite el enlace cuando la lista está vacía, y el catálogo solo expone el destino si el directorio se renderiza. |
| Omitir enlaces a rutas localizadas ausentes. | **Alcanzable en build:** `import.meta.glob` detecta si existen los módulos Astro de rutas fijas; catálogo y `getStaticPaths` determinan los destinos dinámicos; la salida estática comprueba que los hrefs finales resuelven. No se consulta en cliente ni se publica un enlace sin destino. |
| Canonical, hreflang, metadatos únicos, JSON-LD `WebPage` y sitemap. | **Alcanzable:** `BaseLayout`, el gate SEO, Astro y `sitemap.ts` permiten emitir y verificar estas salidas estáticas. El JSON-LD usa solo URL, título, descripción e idioma ya aprobados/localizados. |
| Imágenes optimizadas, responsive, con dimensiones y texto alternativo. | **Alcanzable:** Sanity Image CDN entrega WebP transformado, `srcset`, `sizes`, `width`/`height` y alt localizado mediante componentes existentes. No se garantiza la calidad de una imagen original de baja resolución, pero la página no entrega el original a resolución máxima. |
| WCAG 2.2 AA y ausencia de overflow en los tres rangos. | **Implementable:** la revisión cubrirá todos los criterios aplicables mediante DevTools y lista manual, incluyendo teclado, foco, árbol/nombres accesibles, alt, contraste, zoom al 200 % y reflujo a 320 px CSS. Lighthouse no sustituye esa revisión. |
| Lighthouse móvil ≥90/95/100 en cada home. | **Medible, no garantizable solo por Astro:** Performance depende de imágenes, fuentes, red y entorno. Se auditan ES y EN con la misma versión/configuración registrada; si alguna no alcanza los umbrales, la entrega no se da por terminada. |
| Página home con cero obras válidas. | **Alcanzable:** el componente de selección no se renderiza cuando la selección queda vacía; la identidad y navegación permanecen. |

## Estrategia de verificación

1. **Vitest — dominio:** en `catalog-presentation.test.ts`, probar orden año descendente, desempate por ID ascendente, máximo tres, 0/1/2/más de 3 y no mutación de entrada.
2. **Vitest — mappers y carga:** ejecutar `mappers.test.ts` y `catalog-content.test.ts` para confirmar que imagen/traducción ausente o inválida no crea tarjetas, que no existe fallback de idioma y que Availability se conserva sin filtrar. Añadir casos a estos tests solo si los existentes no cubren el comportamiento utilizado por la home.
3. **Vitest — componentes, i18n y build:** en `catalog-components.test.ts` fijar el contrato estructural de navegación y selección; comprobar paridad de mensajes; inspeccionar identidad, hrefs localizados, validez y límite de tarjetas, omisión del bloque vacío, metadatos, canonical, hreflang, sitemap y JSON-LD `WebPage` de ambas homes. Confirmar que cada enlace/ancla coincide con una ruta/elemento emitido. Incluir `pnpm --dir web verify` como gate completo.
4. **Chrome DevTools — interfaz y accesibilidad:** revisar preview ES/EN a 375×812, 768×900 y 1280×900, además de reflujo a 320 px CSS y zoom al 200 %; contrastar con `design/`. Ejecutar una revisión manual de todos los criterios WCAG 2.2 AA aplicables, incluyendo teclado/foco, árbol/nombres accesibles, alt, contraste y reflow; comprobar también destinos y etiquetas textuales de disponibilidad.
5. **Chrome DevTools — imágenes y salida:** inspeccionar el HTML sin JavaScript, `srcset`, `sizes`, formato transformado, `width`/`height`, alt de cada idioma y que ninguna tarjeta apunte a una ficha ausente. Verificar que no aparecen placeholders o contenido artístico no publicado.
6. **SEO y rendimiento:** verificar títulos/descripciones únicos frente a las páginas públicas indexables, canonical, alternates, inclusión de `/` y `/en/` en `sitemap.xml` y JSON-LD `WebPage` parseable en ambas homes. Lighthouse móvil ES y EN debe alcanzar Performance ≥90, Accessibility ≥95 y SEO =100 con una versión/configuración común registrada; si falla, no afirmar alcanzado el criterio.

## Cobertura RF/RNF

| Requisito | Cobertura principal |
|---|---|
| RF-1 | Páginas ES/EN conservan `artistName` y `artistIdentification` aprobados desde i18n; build-output test. |
| RF-2 | `HomeNavigation` y hrefs localizados; series apunta al directorio del catálogo, no a una ruta nueva. |
| RF-3 | Destinos de navegación verificados contra rutas/anclas de `dist`; serie solo si existe directorio localizado y contacto solo si su página forma parte del build. |
| RF-4 | Selector puro en `catalog-presentation.ts`, filtro de elegibilidad completa por idioma y tests de orden ordinal/desempate/límite. |
| RF-5 | `ArtworkCard` reutilizada con imagen, título, año y disponibilidad; ruta de ficha de la misma locale. |
| RF-6 | `AvailabilityLabel` mantiene etiquetas ES/EN de los cuatro estados; no hay filtro de disponibilidad. |
| RF-7 | Completitud de Spec 001 + `mapSanityContent` + filtro locale; se omite la obra completa ante dato/ficha ausente, sin fallback, tarjeta parcial ni placeholder. |
| RF-8 | Selector devuelve solo las obras válidas disponibles; `HomeArtworkSelection` se omite con cero resultados. |
| RNF-1 | Diccionarios ES/EN, navegación, textos de interfaz, metadatos y hrefs localizados; tests de paridad. |
| RNF-2 | WCAG 2.2 AA completo para criterios aplicables; DevTools y revisión manual de teclado, foco, árbol/nombres, alt, contraste, ampliación y reflow; Availability textual. |
| RNF-3 | Tokens/breakpoints mobile-first; Chrome a 375, 768 y 1280 px sin overflow ni pérdida. |
| RNF-4 | BaseLayout, gate SEO, sitemap y JSON-LD `WebPage`; aserciones de unicidad global, canonical/alternates, JSON-LD y sitemap en salida estática. |
| RNF-5 | Astro estático, `createResponsiveImage` y componentes existentes; build sin JS, dimensiones explícitas y Lighthouse móvil ES/EN con configuración común. |
| RNF-6 | Composición con patrones/componentes y tokens documentados; sin contenido editorial nuevo ni valores arbitrarios. |
