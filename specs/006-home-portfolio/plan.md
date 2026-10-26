# Plan 006 — Home portfolio
Estado: aprobada

Spec de referencia: `spec.md` (revisión aprobada el 2026-10-26). Este borrador planifica RF-9–RF-13 sin reemplazar los resultados ya completados en T1–T10. La mitigación T10 de CLS sigue intacta y limitada a las homes.

## Alcance y dependencias

- Se reutilizan `loadCatalogContent()` y `mapSanityContent()` para consumir en build solo contenido publicado y ya validado por idioma. No se crea un mapper paralelo ni se consulta Sanity en el navegador.
- Un destino está disponible si su módulo/ruta localizada está incluido en la compilación estática vigente; para rutas fijas, la página determina la presencia del módulo con `import.meta.glob` durante el build; para fichas dinámicas, la disponibilidad se deriva de las mismas obras que alimentan `getStaticPaths`. El enlace a series requiere además que exista el ancla del directorio localizado. La prueba de salida comprueba el HTML final.
- Las reglas de publicación de Spec 001 permanecen vigentes: obras, series y exposiciones requieren español completo; la traducción inglesa completa habilita además su versión EN. Todas las nuevas secciones consumen solo contenido publicado, completo y localizado; nunca usan fallback.
- El detalle de cada obra se genera desde el mismo catálogo mapeado y solo para las traducciones visibles del idioma. El enlace de cada tarjeta usará la ruta localizada ya establecida por las fichas.
- `MEMORY.md` registra que Spec 005 ya tiene aviso final aprobado y la revisión de despliegue completada. Este plan no modifica el aviso ni autoriza cambios legales; antes de publicar se volverá a comprobar que las rutas de contacto están incluidas en el build.
- Se propone añadir dos campos opcionales de presentación ES/EN al documento singleton existente `siteSettings`; no se escribirá contenido en ellos ni se modificará ningún documento de Sanity. Requiere aprobación explícita antes de tocar el schema.
- La nueva composición se documentará en `design/tokens.md` antes de los estilos. No se proponen cambios de valores en `@theme`, dependencias, servicios externos ni JavaScript de cliente. T10 mantiene la precarga local de fuentes y la reserva de espacio de la primera imagen.

### Excepción puntual de contenido aprobada (2026-10-25)

- Para desbloquear la revisión manual de accesibilidad de T9, la persona usuaria aprobó actualizar únicamente `altText` de las traducciones ES/EN de «Centinela Carmesí» en `va9sgl77/development` con estos valores: ES «Rostro parcialmente en sombra, enmarcado por una capucha roja sobre un fondo ocre»; EN “A partially shadowed face framed by a red hood against an ochre background.”
- La edición y publicación se limitan al dataset de desarrollo. No se modifica producción ni ningún otro campo/contenido. Después se comprobarán los valores en la salida estática y en T9.

## Archivos previstos y responsabilidad

| Acción y archivo | Responsabilidad | RF cubiertos |
|---|---|---|
| **Modificar** `web/src/pages/index.astro`, `web/src/pages/en/index.astro` | Cargar catálogo y presentación opcional desde Sanity en build; componer navegación superior, hero en tres líneas con CTAs, selección de obras en bloques curatoriales completos alternados, exposiciones y cierre hacia contacto por idioma; mantener metadatos, JSON-LD `WebPage` y rutas localizadas actuales. | RF-1–RF-13, RNF-1, RNF-4–RNF-6 |
| **Modificar** `studio/schemaTypes/documents/siteSettings.ts` | Añadir `homeIntroductionEs` y `homeIntroductionEn` opcionales para que el artista edite el texto breve del hero por idioma. Los valores iniciales quedan vacíos; no se carga ni publica copy de ejemplo. | RF-13, RNF-1 |
| **Modificar** `web/src/infrastructure/sanity/queries.ts`, `web/src/infrastructure/sanity/catalog-content.ts` | Proyectar y normalizar las presentaciones opcionales junto a los datos publicados del catálogo, sin fallback de idioma y preservando las descripciones SEO globales actuales. | RF-13, RNF-1, RNF-4 |
| **Modificar para T10** `web/src/layouts/BaseLayout.astro` | Añadir un opt-in para precargar únicamente Bodoni Moda 400 Latin, Newsreader 400 Latin y Geist Latin en las dos homes; el resto de páginas mantiene la carga actual. | RNF-5 |
| **Modificar** `web/src/components/HomeNavigation.astro` | Colocar navegación HTML localizada al inicio del `<main>` (encima del hero); incluir textos críticos si existe la ruta y omitir destinos no generados. No modifica `SiteHeader` ni páginas distintas de la home. | RF-2–RF-3, RF-9, RNF-1–RNF-3 |
| **Modificar** `web/src/components/HomeArtworkSelection.astro`, `web/src/components/HomeArtworkFeature.astro`, `web/src/components/ArtworkTechnicalSheet.astro` | Presentar cada una de las hasta tres obras seleccionadas como composición curatorial completa de 12 columnas (7 cols imagen con `InventoryBadge` + 5 cols con serie, título `headline-lg`, autor/año, `ArtworkTechnicalSheet` con `id` único, nota localizada en `blockquote` si existe y enlaces a ficha y consulta contextualizada), alternando el orden horizontal entre impares y pares en escritorio. Sin tarjetas reducidas ni acciones comerciales. | RF-4–RF-8, RF-10, RNF-2–RNF-3, RNF-5–RNF-6 |
| **Modificar** `web/src/components/HomeExhibitions.astro` | Mostrar hasta tres exposiciones completas y enlazables por idioma con cabecera editorial (eyebrow, título y enlace al índice) y filas de 12 columnas con fecha, título y lugar; omitir el bloque si está vacío. | RF-11, RNF-1–RNF-3 |
| **Crear** `web/src/components/HomeContactSection.astro`; **retirar** `web/src/components/HomeWorkshopNotes.astro` | Presentar al final de la home un bloque editorial de cierre en 12 columnas sobre `surface-container` hacia la página localizada de contacto (cuando exista), sin formulario embebido ni JS de cliente; retirar la sección separada de notas porque cada obra ya muestra su propia nota en su bloque curatorial. | RF-5, RF-12, RNF-1–RNF-3 |
| **Modificar para T10** `web/src/components/ArtworkCard.astro`, `HomeArtworkSelection.astro` | Reservar en el `figure` de las obras en home la proporción intrínseca derivada de sus dimensiones; solicitar `eager` solo para la primera obra y mantener `lazy` en las siguientes/rutas. No cambia el encuadre ni otras rutas. | RNF-5 |
| **Modificar** `web/src/components/SeriesDirectory.astro` | Añadir un identificador estable (`series-directory`) al bloque ya existente para que la navegación de la home llegue directamente a ese directorio, sin cambiar su presentación. | RF-2–RF-3 |
| **Modificar** `web/src/domain/catalog-presentation.ts` y su test | Mantener selector determinista de hasta tres obras recientes y hasta tres exposiciones por `startDate` descendente/ID ascendente. | RF-4, RF-8, RF-11 |
| **Modificar** `web/src/i18n/es.ts`, `web/src/i18n/en.ts` y tests | Añadir etiquetas localizadas para los botones del hero, acciones de cada obra, cabecera de exposiciones y bloque de cierre hacia contacto, manteniendo paridad ES/EN. El copy de presentación vive en Sanity, no en i18n. | RF-2, RF-5, RF-9, RF-11–RF-13, RNF-1 |
| **Modificar** `design/tokens.md` | Documentar el patrón home de navegación superior, hero en tres líneas con CTAs, galería de bloques de 12 columnas alternados, filas de exposiciones y cierre hacia contacto con tokens existentes, incluido su changelog; no cambiar valores de `@theme`. | RNF-6 |
| **Modificar** tests de dominio, componentes y salida | Fijar selección/orden, bloques curatoriales alternados, contenido vacío o disponible, traducciones sin fallback, links locales, campos del hero, cierre hacia contacto, JSON-LD y HTML generado. | RF-1–RF-13, RNF-1–RNF-6 |

### Reutilizar o ampliar de forma acotada

- `web/src/infrastructure/sanity/mappers.ts`, `ArtworkTechnicalSheet.astro`, `InventoryBadge.astro`, `EditorialImage.astro` y `AvailabilityLabel.astro`: reutilizar contenido, alt, dimensiones, inventario, WebP responsive y etiquetas ya mapeadas. `ArtworkTechnicalSheet` admite `headingLevel` opcional (`h2` por defecto; `h3` dentro de cada bloque de obra en home) y `headingId` opcional para evitar duplicar `id` cuando hay hasta tres fichas técnicas en la home. T10 conserva `eager` solo en la primera imagen de home y `lazy` para las demás.
- `web/src/infrastructure/sanity/image-url.ts`: genera URLs transformadas WebP y variantes responsive a partir de la proyección Sanity; no se envía el original a tamaño completo.
- `web/src/layouts/BaseLayout.astro` y `web/src/infrastructure/sitemap.ts`: mantienen metadatos, canonical/hreflang, `WebPage` JSON-LD y sitemap ya implementados. T10 sigue precargando las fuentes locales solo en home.

## Modelo de dominio y mappers

- No se introduce un modelo de dominio nuevo. Se amplía el documento singleton existente `siteSettings` con dos textos opcionales `homeIntroductionEs` / `homeIntroductionEn`; se cargan con perspectiva `published` y se normalizan independientemente, sin fallback. Los campos SEO existentes mantienen su uso actual.
- La entrada de selección es `MappedArtwork[]` de `loadCatalogContent()`. Las reglas de completitud de Spec 001 y `mapSanityContent()` ya validan traducciones, imagen/dimensiones, texto alternativo, título, año, `Availability` y serie localizada.
- `selectRecentHomeArtworks` conserva su orden por año/ID y límite 3. Todas las obras seleccionadas se representan mediante `HomeArtworkFeature` alternando el orden horizontal de columnas en escritorio según su índice par/impar. Los datos técnicos y la nota opcional de cada obra proceden de los campos publicados de su traducción.
- `selectRecentHomeExhibitions` opera sobre exposiciones mapeadas con traducción visible en el idioma y ruta de detalle generada; ordena por `startDate` descendente e ID ordinal y limita a tres.
- Cada obra muestra su propia `workshopNote` localizada dentro de su columna curatorial si existe; no se renderiza un bloque adicional de notas al final de la página.
- Para la navegación y los CTAs del hero y del cierre, cada página deriva `hasLocalizedSeries` de las series mapeadas y comprueba en `import.meta.glob` que existan los destinos localizados. El enlace de series requiere el ancla `series-directory`; textos críticos, exposiciones y contacto solo se enlazan si sus rutas están incluidas.

## Algoritmo durante el build

```text
para locale en [es, en]:
  messages = getMessages(locale)
  catalog = await loadCatalogContent()  // Sanity published + mapSanityContent
  homeIntroductions = await loadHomeIntroductions()  // optional published siteSettings texts
  homeIntroduction = homeIntroductions[locale]

  availableFixedRoutes = keys de import.meta.glob para rutas fijas de locale
  localizedSeries = catalog.series donde translations[locale] existe
  navigation = destinos localizados presentes en availableFixedRoutes
  si localizedSeries no está vacío:
    añadir enlace a catálogo(locale) + #series-directory solo si el ancla está emitida

  eligibleArtworks = catalog.artworks donde:
    translations[locale] existe
    y título, año, Availability, imagen/dimensiones y alt de locale son válidos
    y existe una ruta dinámica de ficha de esa locale en getStaticPaths

  selected = selectRecentHomeArtworks(eligibleArtworks)
    // copia ordenada por year DESC, luego id ASC; slice(0, 3)

  homeWorks = selected.map((artwork, index) => {
    translation = artwork.translations[locale]
    image = createResponsiveImage(artwork.mainImage.projection, buildConfig)
    href = ruta localizada de ficha(artwork.id)
    contactHref = si existe ruta contacto -> ruta contacto(locale) + query obra(artwork.id)
    return { artwork, translation, image, href, contactHref, reversed: index % 2 === 1, loading: index === 0 ? 'eager' : 'lazy' }
  })

  exhibitions = selectRecentHomeExhibitions(
    catalog.exhibitions with translation[locale] and generated detail route
  )

  render HomeNavigation (encima del hero)
  render Hero (artistName en 3 líneas + artistIdentification + homeIntroduction opcional + CTAs a obras y contacto)
  si homeWorks.length > 0:
    para cada work en homeWorks:
      render HomeArtworkFeature(work, locale)
  si exhibitions.length > 0: render HomeExhibitions
  si hasContactRoute: render HomeContactSection

  render JSON-LD WebPage con canonical URL, título, descripción e inLanguage
    tomados de los metadatos localizados existentes
```

La ordenación se ejecuta después del mapeo y filtro de idioma: limitar antes de descartar contenido inválido podría dejar menos de tres obras aunque hubiera otras válidas. No se muta el catálogo compartido.

## Construcción de la interfaz y tokens

- **Navegación superior:** colocar `HomeNavigation` al inicio de `<main>` (encima del hero), con nombre accesible, enlaces HTML localizados en Geist `label-technical` uppercase, foco visible y wrap en móvil. Incluye los destinos aprobados de RF-2; no modifica `SiteHeader` de las otras páginas.
- **Hero:** presentar `artistName` dividido en tres líneas (`Alejandro` / `Fernández` en mayúsculas y `tellería` en cursiva minúscula) en 9 columnas y `artistIdentification` alineado al pie en 3 columnas; en la segunda fila del hero, mostrar el párrafo opcional de RF-13 en 7 columnas a la izquierda y dos botones CTA (`Explorar obras` y `Contacto`) en 5 columnas a la derecha.
- **Obras seleccionadas en bloques alternados:** presentar cada obra de la selección determinista en una composición curatorial de 12 columnas (7 cols imagen con `InventoryBadge` sobreimpreso + 5 cols con serie enlazada, título `headline-lg`, línea `{artistName}, {year}`, `ArtworkTechnicalSheet`, nota de taller en `blockquote` si existe y botones de acción a ficha y consulta contextualizada), alternando el lado de imagen y ficha entre obras impares y pares en escritorio y manteniendo espaciado vertical amplio entre obras.
- **Exposiciones y cierre hacia contacto:** presentar las exposiciones bajo cabecera editorial con enlace al índice y filas de 12 columnas (`fecha` | `título` | `lugar`); cerrar la home antes del pie con `HomeContactSection` sobre `surface-container` en 12 columnas orientado a consultas artísticas, curatoriales e institucionales con botón hacia la ruta localizada de contacto.
- **Tokens:** usar tipografías, paleta, espaciado, grid de 12/8/1 columnas y breakpoints existentes. Actualizar primero `design/tokens.md` y su changelog; no se proponen cambios a `@theme`, colores, fuentes ni radios. Sin valores arbitrarios ni transparencia en texto.
- No se incorpora copy del export para biografía, citas intermedias o bloque poético con porcentajes. No se añaden filtros, zoom/copiar con JS, muestras de pigmento, formularios embebidos, dossier, precios ni acciones comerciales; el contacto permanece como consulta general.

## Decisiones técnicas

| Decisión | Justificación | Alternativa descartada |
|---|---|---|
| Generar home, navegación y tarjetas en build con Astro estático. | Entrega contenido en HTML sin JavaScript, consistente con SEO y queries a Sanity solo en build. | Fetch de Sanity en el navegador, hidratación o generación por visita. |
| Reutilizar `loadCatalogContent()` / `mapSanityContent()`. | Centraliza publicación, visibilidad, validación de traducción, imagen y relación con series por idioma. | GROQ o mapper de home duplicado con criterios de elegibilidad distintos. |
| Guardar la presentación breve en el singleton `siteSettings`, en dos campos opcionales ES/EN. | Es contenido editorial que el artista debe poder cambiar sin editar código; el mismo documento ya aloja configuración editorial global. | Hardcodearla en los diccionarios i18n o derivarla de la descripción SEO. |
| Ordenar y limitar en una función pura de dominio/presentación después de validar el idioma. | Hace verificable el desempate exacto requerido y evita que candidatos inválidos ocupen uno de los tres puestos. | Confiar en el orden accidental de Sanity, limitar en GROQ antes del mapeo o usar orden por inventario del catálogo. |
| Reutilizar `ArtworkCard`, `EditorialImage` y `AvailabilityLabel`. | Mantiene el patrón ya aprobado, el alt localizado, transformaciones, dimensiones y etiquetas de Availability. | Crear tarjetas visualmente distintas solo para home o filtrar por estado. |
| Mostrar hasta tres exposiciones por fecha y hasta dos notas de obras de apoyo, sin campos nuevos de selección manual. | Es determinista y aprovecha los datos existentes; omite bloques vacíos y evita una migración/schema de orden editorial. La nota de la obra principal se presenta una sola vez. | Añadir flags `featured`/orden manual a Sanity sin necesidad o inventar contenido para llenar la home. |
| Navegar a series mediante el directorio dentro de la ruta de obras. | Coincide con la definición de la spec; el enlace no inventa un índice/ruta de series. | Crear una ruta independiente, carrusel o filtro de series. |
| Dejar la home sin JavaScript de cliente y usar enlaces HTML. | Satisface el alcance de orientación y contenido estático con teclado y lectura sin JS. | Menú interactivo o carrusel hidratado. |
| Resolver disponibilidad de rutas en build, no en el navegador. | `import.meta.glob` detecta módulos de rutas fijas durante la compilación; los destinos dinámicos de obra salen del catálogo usado por `getStaticPaths`. La prueba del HTML valida las URLs finales. | Inspección en runtime, fetch de rutas o renderizar enlaces y confiar solo en que respondan. |
| Mantener metadatos y sitemap existentes. | Las homes ya tienen títulos/descripciones localizados, canonical, alternates y entradas en sitemap; se añade cobertura de salida en tests. | Cambiar `BaseLayout`/sitemap compartidos sin necesidad de la spec. |
| Emitir JSON-LD `WebPage` por home con metadatos localizados existentes. | Cumple la constitución sin inventar biografía ni modelar una entidad artística nueva; Astro puede serializar JSON-LD estático en cada página. | Omitir JSON-LD en la home o derivar un `Person`/contenido artístico que la spec no autoriza. |
| Mitigación T10 aprobada: precargar en home los WOFF2 locales usados above-the-fold, reservar la proporción intrínseca de la primera imagen seleccionada y solicitarla eager. | Lighthouse 13.5.0 / Chrome 155 registró ES CLS 0.208 y dos shifts; los diagnósticos señalan llegada tardía de medios y fuentes locales. Se limita a homes y conserva `font-display`, familias, pesos, `srcset`, dimensiones y aspecto visual final. | Cambiar tipografía/font-display, hacer eager todas las imágenes, añadir dependencias o rediseñar la sección. |

## Puntos de «⚠️ Preguntar antes» de AGENTS.md

1. **Layout de una pantalla existente:** la persona usuaria aprobó el 2026-10-26 una revisión visual amplia de home; esta aprobación no se extiende al encabezado global ni a otras páginas.
2. **Patrón visual y tokens:** se propone documentar primero en `design/tokens.md` el hero/obra asimétrica con tokens existentes; cualquier cambio a valores `@theme` requiere aprobación aparte.
3. **Schema de Sanity:** se propone añadir los dos campos opcionales `homeIntroductionEs`/`homeIntroductionEn` a `siteSettings`. La aprobación de este plan debe confirmar explícitamente el cambio de schema antes de implementarlo. No se cambia contenido de producción.
4. **JavaScript de cliente:** no se propone. Si se considera necesario, pedir aprobación previa; no es necesario para estos RF.
5. **Mitigación T10 ya aprobada:** opt-in de precarga de tres WOFF2 locales en homes, reserva de proporción desde dimensiones de imagen y eager solo en la primera imagen. Se conserva sin cambios.

La revisión legal de Spec 005 está cerrada según el aviso final aprobado y el registro en `MEMORY.md`. RF-3 sigue requiriendo que la ruta localizada de contacto forme parte de la salida estática vigente; este plan no cambia ni vuelve a publicar el aviso.

## Alcanzabilidad con la plataforma elegida

| Garantía | Evaluación |
|---|---|
| HTML ES/EN con datos publicados, presente sin ejecutar JS. | **Alcanzable:** Astro tiene `output: 'static'`; las páginas pueden esperar al cliente Sanity durante el build y emitir HTML. Sin credenciales/configuración válida de Sanity el build debe fallar como ya lo hace el resto del catálogo, no servir contenido inventado. |
| Selección localizada, orden por año/ID y máximo tres. | **Alcanzable:** el mapper existente entrega traducciones e imágenes válidas; una función pura aplica el orden y límite después del filtro. Los destinos de ficha están alineados con las rutas estáticas generadas desde el mismo catálogo. |
| Enlace a series solo si existe directorio localizado. | **Alcanzable:** el build conoce las series visibles por idioma; la home omite el enlace cuando la lista está vacía, y el catálogo solo expone el destino si el directorio se renderiza. |
| Omitir enlaces a rutas localizadas ausentes. | **Alcanzable en build:** `import.meta.glob` detecta si existen los módulos Astro de rutas fijas; catálogo y `getStaticPaths` determinan los destinos dinámicos; la salida estática comprueba que los hrefs finales resuelven. No se consulta en cliente ni se publica un enlace sin destino. |
| Canonical, hreflang, metadatos únicos, JSON-LD `WebPage` y sitemap. | **Alcanzable:** `BaseLayout`, el gate SEO, Astro y `sitemap.ts` permiten emitir y verificar estas salidas estáticas. El JSON-LD usa solo URL, título, descripción e idioma ya aprobados/localizados. |
| Presentación de artista opcional y localizada. | **Alcanzable:** un campo ES/EN opcional en `siteSettings` se lee en build; vacío/incompleto se normaliza a ausente y no afecta metadatos ni la home del otro idioma. |
| Imágenes optimizadas, responsive, con dimensiones y texto alternativo. | **Alcanzable:** Sanity Image CDN entrega WebP transformado, `srcset`, `sizes`, `width`/`height` y alt localizado mediante componentes existentes. No se garantiza la calidad de una imagen original de baja resolución, pero la página no entrega el original a resolución máxima. |
| Bloques de exposiciones y notas sin contenido inventado. | **Alcanzable:** ambos se derivan de entidades y traducciones publicadas existentes, se filtran por locale y se omiten cuando no tienen destinos/contenido válido. |
| WCAG 2.2 AA y ausencia de overflow en los tres rangos. | **Implementable:** la revisión cubrirá todos los criterios aplicables mediante DevTools y lista manual, incluyendo teclado, foco, árbol/nombres accesibles, alt, contraste, zoom al 200 % y reflujo a 320 px CSS. Lighthouse no sustituye esa revisión. |
| Lighthouse móvil ≥90/95/100 en cada home. | **Medible, no garantizable solo por Astro:** Performance depende de imágenes, fuentes, red y entorno. Se auditan ES y EN con la misma versión/configuración registrada; si alguna no alcanza los umbrales, la entrega no se da por terminada. |
| Página home con cero obras válidas. | **Alcanzable:** el componente de selección no se renderiza cuando la selección queda vacía; la identidad y navegación permanecen. |

## Estrategia de verificación

1. **Studio y Sanity:** obtener aprobación explícita para el cambio del schema de `siteSettings`, añadir dos campos opcionales localizados y ejecutar `pnpm --dir studio build`. No completar ni publicar esos campos.
2. **Vitest — dominio:** probar selección de obras recientes, exposiciones por fecha/ID y notas derivadas de las obras seleccionadas; límites, entradas vacías, idiomas y no mutación.
3. **Vitest — mappers y carga:** ejecutar `mappers.test.ts` y `catalog-content.test.ts`; comprobar imágenes/traducciones ausentes, falta de fallback y Availability sin filtros. Añadir casos solo si hay un hueco concreto.
4. **Vitest — componentes, i18n y build:** fijar el contrato de hero, presentación opcional, navegación, obra feature, cards de apoyo, bloques opcionales, foco y omisión de bloques vacíos. Verificar paridad de mensajes, hrefs, metadatos, canonical, hreflang, JSON-LD `WebPage` y sitemap. `pnpm --dir web verify` es el gate completo.
5. **Chrome DevTools — interfaz y accesibilidad:** revisar ES/EN a 375×812, 768×900 y 1280×900, reflujo a 320 px CSS y zoom al 200 %, contrastando con `design/`. Verificar teclado/foco, árbol/nombres, alt, contraste, destinos, contenido sin JS y omisión correcta de exposiciones/notas vacías.
6. **SEO y rendimiento:** conservar títulos/descripciones, canonical, alternates, `/` y `/en/` en sitemap y JSON-LD `WebPage` válido. Lighthouse móvil ES/EN debe alcanzar Performance ≥90, Accessibility ≥95 y SEO =100 con versión/configuración común registrada.

## Cobertura RF/RNF

| Requisito | Cobertura principal |
|---|---|
| RF-1 | Páginas ES/EN conservan `artistName` y `artistIdentification` aprobados desde i18n; build-output test. |
| RF-2 | `HomeNavigation` y hrefs localizados; series apunta al directorio del catálogo, no a una ruta nueva. |
| RF-3 | Destinos de navegación verificados contra rutas/anclas de `dist`; serie solo si existe directorio localizado y contacto solo si su página forma parte del build. |
| RF-4 | Selector puro en `catalog-presentation.ts`, filtro de elegibilidad completa por idioma y tests de orden ordinal/desempate/límite. |
| RF-5 | `HomeArtworkFeature` con imagen, `InventoryBadge`, serie enlazada, título, autor/año, `ArtworkTechnicalSheet`, nota de taller opcional y enlaces a ficha y consulta contextualizada en la misma locale. |
| RF-6 | `AvailabilityLabel` mantiene etiquetas ES/EN de los cuatro estados; no hay filtro de disponibilidad. |
| RF-7 | Completitud de Spec 001 + `mapSanityContent` + filtro locale; se omite la obra completa ante dato/ficha ausente, sin fallback, tarjeta parcial ni placeholder. |
| RF-8 | Selector devuelve solo las obras válidas disponibles; `HomeArtworkSelection` se omite con cero resultados. |
| RF-9 | Navegación localizada encima del hero; hero con nombre en tres líneas, identificación a la derecha, presentación opcional en 7 cols y botones CTA a obras y contacto en 5 cols. |
| RF-10 | Todas las obras seleccionadas (hasta tres) en bloques curatoriales completos de 12 columnas alternados entre impares y pares en escritorio. |
| RF-11 | Hasta tres exposiciones publicadas por idioma en filas de 12 columnas bajo cabecera editorial, ordenadas por fecha/ID y con destino presente. |
| RF-12 | Bloque de cierre editorial hacia contacto sobre `surface-container` cuando la ruta de contacto existe; notas de taller integradas únicamente en cada obra sin sección duplicada. |
| RF-13 | Campos opcionales en `siteSettings`, carga published en build y omisión independiente ES/EN. |
| RNF-1 | Diccionarios ES/EN, navegación, textos de interfaz, metadatos y hrefs localizados; tests de paridad. |
| RNF-2 | WCAG 2.2 AA completo para criterios aplicables; DevTools y revisión manual de teclado, foco, árbol/nombres, alt, contraste, ampliación y reflow; Availability textual. |
| RNF-3 | Tokens/breakpoints mobile-first; Chrome a 375, 768 y 1280 px sin overflow ni pérdida. |
| RNF-4 | BaseLayout, gate SEO, sitemap y JSON-LD `WebPage`; aserciones de unicidad global, canonical/alternates, JSON-LD y sitemap en salida estática. |
| RNF-5 | Astro estático, `createResponsiveImage` y componentes existentes; build sin JS, dimensiones explícitas y Lighthouse móvil ES/EN con configuración común. |
| RNF-6 | Composición con patrones/componentes y tokens documentados; sin contenido editorial nuevo ni valores arbitrarios. |
