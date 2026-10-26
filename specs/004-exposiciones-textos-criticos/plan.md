# Plan 004 — Exposiciones y textos críticos

Spec de referencia: `spec.md` (**Estado: implementada**, sin dudas abiertas). Plan aprobado y ejecutado mediante T1–T15 de `tasks.md`.

## Alcance y dependencias

- Generar listados y páginas propias ES/EN a partir del contenido publicado que ya existe en Sanity. No se modificarán schemas, contenido editorial, tipos públicos del dominio ni reglas de publicación.
- Reutilizar `mapSanityContent`, que ya mapea exposiciones/textos críticos y filtra las relaciones por destino visible en el idioma solicitado. El loader actual no consulta todavía esas dos colecciones; se ampliará para proporcionarlas a las páginas y a los sitemaps.
- Reutilizar `ExhibitionContent.astro` y `CriticalTextContent.astro` para las páginas propias. Se reutilizará la ficha de obra existente, añadiendo el enlace requerido a la página propia del texto crítico sin retirar el cuerpo ya visible.
- Rutas propuestas, usando los IDs estables ya disponibles y sin añadir slugs:
  - Exposiciones: `/exposiciones/`, `/en/exhibitions/`; páginas propias `/exposiciones/<exhibitionId>/` y `/en/exhibitions/<exhibitionId>/`.
  - Textos críticos: `/textos-criticos/`, `/en/critical-texts/`; páginas propias `/textos-criticos/<criticalTextId>/` y `/en/critical-texts/<criticalTextId>/`.
- Las páginas de listado existen aunque no tengan entradas. Las páginas propias se generan solo para versiones visibles en su idioma. La navegación global queda fuera de esta spec; los listados serán rastreables desde el sitemap y los textos propios también desde las fichas de obra relacionadas.
- No se propone añadir dependencias, servicios externos, JavaScript en cliente, schemas Sanity ni valores nuevos de `@theme`.

## Archivos previstos y responsabilidad

### Crear

| Archivo | Responsabilidad | RF cubiertos |
|---|---|---|
| `web/src/pages/exposiciones/index.astro` | Listado ES siempre disponible; título/descripción SEO, lista o estado vacío, canonical y alternates publicados. | RF-1, RF-2, RF-8, RF-9, RF-11–RF-13 |
| `web/src/pages/en/exhibitions/index.astro` | Equivalente EN, sin sustituir contenido ausente por ES. | RF-1, RF-2, RF-8, RF-9, RF-11–RF-13 |
| `web/src/pages/exposiciones/[exhibitionId].astro` | Emitir páginas propias ES de exposiciones visibles, con metadatos, relaciones y datos estructurados factuales. | RF-3, RF-6, RF-9, RF-10–RF-13, RF-15 |
| `web/src/pages/en/exhibitions/[exhibitionId].astro` | Equivalente EN, solo si existe la versión inglesa publicada. | RF-3, RF-6, RF-9, RF-10–RF-13, RF-15 |
| `web/src/pages/textos-criticos/index.astro` | Listado ES de textos críticos visibles, título/autor, orden alfabético y estado vacío. | RF-4, RF-8, RF-9, RF-11–RF-13, RF-15 |
| `web/src/pages/en/critical-texts/index.astro` | Equivalente EN, sin fallback al original español cuando no exista versión EN. | RF-4, RF-8, RF-9, RF-11–RF-13, RF-15 |
| `web/src/pages/textos-criticos/[criticalTextId].astro` | Emitir páginas propias ES con contenido completo, asociaciones visibles, metadatos y datos estructurados. | RF-5, RF-6, RF-9–RF-13, RF-15 |
| `web/src/pages/en/critical-texts/[criticalTextId].astro` | Equivalente EN, solo si esa versión está publicada. | RF-5, RF-6, RF-9–RF-13, RF-15 |
| `web/src/components/ExhibitionIndex.astro` | Presentar entradas localizadas con título, lugar y fechas; mensaje funcional cuando no haya entradas. | RF-2, RF-8, RNF-1–RNF-3 |
| `web/src/components/CriticalTextIndex.astro` | Presentar título y autor de cada texto, sin extractos; mensaje funcional cuando no haya entradas. | RF-4, RF-8, RNF-1–RNF-3 |

### Modificar

| Archivo | Responsabilidad | RF cubiertos |
|---|---|---|
| `web/src/infrastructure/sanity/catalog-content.ts` | Consultar durante el build obras, series, exposiciones y textos críticos; pasar los cuatro resultados a `mapSanityContent`; conservar proyecciones de imagen de exposiciones solo cuando coincidan con una imagen aceptada por el mapper. | RF-1–RF-7, RF-14–RF-15 |
| `web/src/infrastructure/sanity/catalog-content.test.ts` | Verificar las cuatro consultas, las colecciones mapeadas y la selección/omisión de proyecciones de imagen opcionales de exposición. | RF-3, RF-6, RF-14–RF-15 |
| `web/src/domain/catalog-presentation.ts` | Añadir orden por inicio descendente para exposiciones, orden alfabético localizado para textos críticos y derivación de sus descripciones. Reutilizar la comprobación de unicidad SEO existente. | RF-2, RF-4, RF-11 |
| `web/src/domain/catalog-presentation.test.ts` | Probar orden, desempates deterministas, derivación de descripciones, límite de 155 caracteres por palabra para textos críticos y rechazo de metadatos repetidos. | RF-2, RF-4, RF-11, RNF-5 |
| `web/src/components/ArtworkContent.astro` | Añadir a cada texto crítico visible una dirección a su página propia en el idioma actual; conservar cuerpo, título y autoría actuales. | RF-7, RF-9, RF-15 |
| `web/src/components/ArtworkCriticalTexts.astro` | Convertir el título ya presentado en enlace identificable y con foco visible, manteniendo cuerpo y autor. | RF-7, RNF-2–RNF-3 |
| `web/src/components/catalog-components.test.ts` | Verificar selección localizada de textos críticos y el enlace a la versión propia sin eliminar el contenido incluido en la ficha. | RF-7, RF-9, RNF-1–RNF-3 |
| `web/src/i18n/es.ts`, `web/src/i18n/en.ts` | Añadir títulos, descripciones funcionales, etiquetas, unidad de centímetros y mensajes de listado vacío en ambos idiomas. | RF-1–RF-5, RF-8–RF-9, RF-11, RNF-1 |
| `web/src/i18n/messages.test.ts` | Comprobar paridad y presencia no vacía de todos los mensajes nuevos en ES/EN. | RF-8–RF-9, RNF-1 |
| `web/src/layouts/BaseLayout.astro` | Añadir un enlace de salto localizado al contenido principal, oculto visualmente hasta recibir foco de teclado. | RNF-2 |
| `web/src/components/ArtworkTechnicalSheet.astro`, `web/src/components/ArtworkContent.astro` | Obtener de i18n la unidad visible `cm`; mantener `CMT` como código técnico de Schema.org. | RNF-1 |
| `web/src/styles/global.css` | Declarar fuentes locales WOFF2 mediante `@font-face` y `font-display: swap` para los nombres ya existentes en `@theme`. | RNF-3, RNF-7 |
| `web/public/fonts/` | Alojar los estilos WOFF2 necesarios de Bodoni Moda, Newsreader y Geist en Latin/Latin-Ext, junto con sus licencias SIL OFL 1.1. | RNF-3, RNF-7 |
| `web/src/infrastructure/sitemap.ts` | Incluir siempre los cuatro listados y solo las páginas propias con traducción publicada, usando alternates solo para versiones generadas. | RF-9, RF-13 |
| `web/src/infrastructure/sitemap.test.ts` | Comprobar listados vacíos, rutas de exposición/texto y alternates solo para idiomas existentes. | RF-9, RF-13 |
| `web/src/infrastructure/image-sitemap.ts` | Añadir la imagen de exposición solo en las versiones lingüísticas cuya traducción conserve una imagen válida, asociando cada entrada a la página donde esa imagen se muestra. | RF-3, RF-13 |
| `web/src/infrastructure/image-sitemap.test.ts` | Comprobar inclusión por idioma solo cuando la traducción correspondiente muestra una imagen válida, y omisión de imagen ausente, asset inválido o transformación fallida. | RF-3, RF-13 |
| `web/src/i18n/build-output.test.ts` | Verificar páginas estáticas ES/EN, contenido, metadatos, datos estructurados, enlaces, sitemaps y ausencia de fallback en la salida generada. | RF-1–RF-15, RNF-1, RNF-4–RNF-7 |

### Reutilizar sin modificar

| Archivo o responsabilidad existente | Uso previsto | RF cubiertos |
|---|---|---|
| `web/src/infrastructure/sanity/queries.ts` | Ya contiene consultas de exposiciones y textos críticos con campos y relaciones necesarios; no se duplica ni se cambia el contrato GROQ salvo que las pruebas del loader descubran una omisión. | RF-1–RF-7, RF-14–RF-15 |
| `web/src/infrastructure/sanity/mappers.ts`, `web/src/domain/completeness.ts`, `web/src/domain/visibility.ts` | Validar contenido publicado, traducciones opcionales y relaciones con destinos visibles por idioma. No se repite la validación en componentes. | RF-1–RF-7, RF-9–RF-10, RF-14–RF-15 |
| `web/src/components/ExhibitionContent.astro` | Mostrar título, lugar, fechas localizadas, imagen opcional y asociaciones visibles; ya omite bloques sin destinos. | RF-3, RF-6, RF-14–RF-15, RNF-1–RNF-3, RNF-6 |
| `web/src/components/CriticalTextContent.astro` | Mostrar título, cuerpo completo, autoría y relaciones visibles del texto. | RF-5–RF-6, RF-14–RF-15, RNF-1–RNF-3 |
| `web/src/components/EditorialImage.astro`, `web/src/infrastructure/sanity/image-url.ts` | Transformaciones WebP responsive y atributos explícitos de tamaño/alt para imagen opcional existente. | RF-3, RF-13, RNF-6 |
| `web/src/layouts/BaseLayout.astro`, `web/src/components/LanguageSwitcher.astro` | Recibir title/description/canonical/alternates desde cada página; enlazar solo equivalentes existentes. | RF-9–RF-11, RNF-1, RNF-5 |
| `web/src/infrastructure/seo-metadata-build-gate.mjs`, `web/src/domain/catalog-presentation.ts` | La puerta ya recorre todas las páginas HTML generadas y detiene el build ante títulos o descripciones repetidos; debe cubrir también las nuevas páginas sin añadir otra integración. | RF-11, RNF-5 |
| `web/src/pages/404.astro` y endpoints estáticos de sitemap | Mantener la 404 existente; los endpoints actuales consumirán las nuevas colecciones a través del loader extendido y los generadores ampliados. | RF-10, RF-13 |

No se prevén cambios en `studio/`, `web/astro.config.mjs`, dependencias ni schemas de Sanity. La tipografía se autoalojará en `web/public/fonts/`; no habrá solicitudes a proveedores de fuentes durante la navegación.

## Modelo de dominio y mappers

- No se crea modelo nuevo. Se reutilizan `MappedExhibition`, `MappedCriticalText`, `MappedArtwork`, `MappedSeries` y los tipos localizados ya presentes en `mappers.ts`.
- `mapSanityContent` ya valida fechas/campos, conserva ES/EN según publicación y filtra `artworkIds`/`seriesIds` por visibilidad en el idioma. Los destinos no visibles no deben recuperarse desde datos crudos ni desde otro idioma.
- `loadCatalogContent` actualmente consulta obra y serie, aunque el resultado mapeado ya tenga las propiedades de exposición/texto crítico. Se amplía a cuatro consultas concurrentes y entrega los resultados completos al mapper.
- La proyección de imagen de exposición se mantiene separada del tipo editorial, igual que la de series: solo se conserva si el ID del asset coincide con una imagen opcional aceptada en una traducción visible. La página transforma esa proyección con el generador de imágenes existente.
- No se cambia `mappers.ts` ni el modelo público: sus pruebas existentes ya cubren publicación crítica original/optativa, fechas, imagen opcional y filtrado de relaciones. Se añadirán casos únicamente si la cobertura actual no verifica la integración del loader con las cuatro colecciones.
- Para las fichas de obra, `ArtworkContent` selecciona únicamente el texto relacionado que ya tenga traducción completa en el idioma de la ficha; el destino se deriva del ID estable y de ese mismo idioma. No habrá enlace si no hay versión propia en ese idioma.

## Algoritmo de generación

```text
durante el build:
  consultar obras, series, exposiciones y textos críticos publicados
  mapear una vez cada colección con mapSanityContent
  obtener proyecciones de imagen de exposición solo si el mapper conservó ese asset

  para cada idioma es/en:
    generar siempre el listado de exposiciones y el de textos críticos
    seleccionar solo traducciones presentes en el mapper para ese idioma
    ordenar exposiciones por fecha de inicio descendente
      desempatar por título localizado y luego por ID estable
    ordenar textos críticos por título con colación del idioma
      desempatar por ID estable
    si un listado queda vacío, mostrar su mensaje funcional localizado

    para cada exposición con traducción en el idioma:
      emitir página propia, fecha localizada e imagen responsive si asset/alt son válidos
      filtrar sus asociaciones usando solo las relaciones visibles ya mapeadas
      mostrar enlaces únicamente a obras/series de ese idioma
      crear title, description, canonical y alternates de idiomas existentes
      serializar datos estructurados factuales y escapados

    para cada texto crítico con traducción en el idioma:
      emitir página propia con cuerpo completo, título y autor publicados
      filtrar relaciones y emitir solo enlaces a destinos visibles del mismo idioma
      derivar description de los primeros 155 caracteres del cuerpo,
        cerrando en el último límite de palabra admisible
      si el primer término supera por sí solo 155 caracteres sin límite admisible,
        omitir description en vez de cortar el término o exceder el límite
      crear title, canonical y alternates de versiones existentes
      serializar datos estructurados factuales y escapados

  en la ficha de obra, mantener el cuerpo crítico y añadir su enlace localizado
  incorporar los cuatro listados y páginas propias en el sitemap de páginas
  incorporar cada imagen de exposición válida en el sitemap de su versión lingüística visible
  ejecutar la puerta existente de unicidad para todo el HTML generado
  si hay title o description duplicados, fallar el build; no inventar contenido
  no generar páginas propias sin versión visible; atenderlas con la 404 existente
```

## Interfaz y tokens

- **Páginas propias:** reutilizar sin cambios `ExhibitionContent.astro` y `CriticalTextContent.astro`. Ya implementan jerarquía de títulos, relaciones con secciones etiquetadas, fechas localizadas, adaptación responsive y omisión de imagen/bloques vacíos.
- **Listados (revisión 2026-10-26 para Exposiciones):** `ExhibitionIndex.astro` presenta la cabecera editorial de 12 columnas (`Exposiciones & Trayectoria`) con contadores reales (número de exposiciones y rango de años activo), seguida de las entradas de «Archivo Retrospectivo» en 12 columnas sobre `surface-container-low` (`p-space-lg`): columna izquierda (3 cols) con año en grande (`primary`) y fechas localizadas; columna central (6 cols) con título enlazado (`headline-sm uppercase`), lugar (`label-technical uppercase text-primary`) y enlaces a obras/series visibles relacionadas si existen; columna derecha (3 cols sobre `surface-container-lowest p-space-md`) con imagen opcional validada (`EditorialImage`) si existe y enlace hacia la página propia de la exposición. Cierra la página `HomeContactSection`. `CriticalTextIndex.astro` mantiene título y autor sin extractos.
- **Unidad visible:** el sufijo de centímetros de la ficha técnica procede de i18n en ES/EN; `CMT` permanece como código técnico en Schema.org. Los códigos estándar `ES`/`EN` del selector no se incorporan a i18n.
- **Enlace de salto:** será el primer control del documento, quedará visualmente oculto hasta recibir foco, apuntará a `<main id="main-content">` y usará colores, tipografía y espaciado existentes. Su texto se obtiene de i18n en ES/EN.
- **Fuentes:** autoalojar WOFF2 con subconjuntos Latin/Latin-Ext para Bodoni Moda (400 normal/italic), Newsreader (400 normal/italic) y Geist (400/500). Incluir licencias SIL OFL 1.1, usar `font-display: swap` y no hacer solicitudes a fuentes externas en runtime.
- **Patrón propuesto:** reutilizar la lista de relaciones ya presente en las páginas de exposición/texto y el directorio de series. Separadores decorativos `surface-variant`, texto principal `on-surface`, texto secundario `on-surface-variant`, títulos `headline-sm`/`headline-md`, datos `body-md` y etiquetas `label-technical`/`label-caption`; espaciado `space-sm`, `space-md`, `space-lg`, `gutter-mobile`, `gutter` y márgenes existentes. El lienzo usa `surface-container-lowest`; no se añaden superficies, colores, radios ni tokens.
- **Texto crítico en ficha de obra:** convertir el título existente en enlace con foco visible usando el patrón de enlace ya presente; mantener tipografía y estructura para minimizar el cambio de layout.
- **Responsive:** mobile-first, una columna bajo 768 px, tablet desde 768 px y escritorio desde 1280 px. Títulos y autores largos deben envolver sin recortes ni scroll horizontal. No se añade JavaScript de cliente.
- **Imágenes de exposición:** reutilizar `EditorialImage` y el CDN existente, con AVIF/WebP según capacidad configurada, tamaños responsive, dimensiones explícitas y alt localizado. La imagen principal visible en la página puede cargarse de forma inmediata; imágenes que no sean principales, de forma diferida.
- **Tokens usados:** `surface-container-lowest`, `surface-variant`, `on-surface`, `on-surface-variant`, `headline-lg-mobile`, `headline-lg`, `headline-md`, `headline-sm`, `body-lg`, `body-md`, `label-technical`, `label-caption`, `space-sm/md/lg`, gutters responsive y breakpoints `tablet`/`desktop`. Texto siempre opaco y con contraste AA.

El patrón de listado editorial de una columna fue aprobado en T3 y se reutiliza. El patrón de enlace de salto fue aprobado tras la auditoría y se documentará en `design/tokens.md` con changelog antes de implementarlo; no se crearán valores nuevos de tokens.

## Decisiones técnicas

| Decisión | Justificación | Alternativa descartada |
|---|---|---|
| Páginas estáticas construidas solo con documentos publicados. | Astro ya opera en salida estática; el contenido queda presente en el HTML sin JavaScript y los borradores no se exponen. | SSR por visita o consulta de Sanity desde el navegador. |
| Usar IDs estables en las rutas propuestas. | Las cuatro entidades tienen ID y el proyecto ya los usa para obras/series; no requiere migraciones ni nuevos campos. | Añadir slugs al CMS o construir URLs desde títulos que pueden repetirse/cambiar. |
| Extender `loadCatalogContent` y reutilizar `mapSanityContent`. | El mapper ya soporta los cuatro tipos y el filtrado localizado de relaciones; evita duplicar elegibilidad y reduce cambios de dominio. | Añadir un segundo mapper o revalidar contenido desde cada componente. |
| Ordenación y derivación SEO en funciones puras. | Hace deterministas los desempates y permite probar fechas, colación y límite de palabra sin Astro/Sanity. | Ordenar dentro del markup o duplicar la lógica en las ocho rutas. |
| Omitir la meta description crítica si su primer término excede 155 caracteres sin límite de palabra admisible. | Evita truncar un término editorial o exceder el máximo RF-11; no recurre a fallback ni inventa texto. Esta regla quedó aclarada y aprobada en `spec.md`. | Cortar el término a 155 caracteres o escribir una descripción alternativa. |
| Autoalojar fuentes y no usar Google Fonts en runtime. | Reproduce las familias de diseño sin solicitudes a terceros; las tres familias se distribuyen bajo SIL OFL 1.1 con sus licencias. | Dejar que el dispositivo use cualquier fuente de sistema o añadir un servicio externo en runtime. |
| Enlace de salto oculto hasta foco de teclado. | Permite saltar la cabecera repetida al `<main>` con texto localizado y tokens ya aprobados, sin alterar el layout en reposo. | Hacer la cabecera el único primer bloque navegable en cada página. |
| Reutilizar las páginas de detalle existentes como componentes. | Ya cumplen la presentación y filtros de relaciones especificados; las páginas nuevas se ocupan de rutas y metadatos. | Crear componentes de detalle duplicados o alterar el contenido del artista. |
| Ampliar los generadores de sitemap existentes. | Su contrato es datos más URL y ya maneja alternates, escape XML e imágenes transformadas. | Plugin/dependencia de sitemap o generación en cliente. |
| Datos estructurados: evento factual para exposiciones y artículo factual para textos críticos. | Representan tipo, fechas/lugar o cuerpo/idioma y relaciones visibles sin datos comerciales. El campo actual de autoría es texto libre; no se inferirá si es persona u organización ni se tipará como tal en JSON-LD. | Afirmar `Person`/`Organization` sin dato editorial, o añadir un tipo de autor al CMS sin autorización y sin requisito en la spec. |
| Reusar puerta de unicidad SEO existente. | Recorre todas las páginas generadas y evita publicar salida con títulos/descripciones duplicados. | Crear una segunda validación aislada que pudiera divergir. |
| Mantener las fichas de obra y añadir un enlace junto al título del texto crítico. | Cumple RF-7 sin duplicar contenido nuevo ni retirar el cuerpo aprobado en la spec 003. | Mover el cuerpo a la ficha propia o añadir una sección editorial nueva en series. |

## Puntos de «⚠️ Preguntar antes» de AGENTS.md

1. **Composición visual:** la lista de una columna fue aprobada en T3. El usuario aprobó el patrón de enlace de salto descrito en este plan; documentarlo primero en `design/tokens.md` y su changelog. No se añaden valores nuevos de tokens.
2. **Cambio de pantalla existente:** añadir enlace en la ficha de obra cambia su contenido y puede afectar el layout. Aprobar la ubicación visual exacta antes de tocar `ArtworkContent.astro`/`ArtworkCriticalTexts.astro`; no cambiar paleta, tipografía ni estructura sin permiso.
3. **Schemas/tipos públicos:** no se prevé cambiarlos. Si se decide representar tipología de autor en datos estructurados, requeriría un campo/editorial type y aprobación previa; no se infiere ni se añade en este plan.
4. **Dependencias, servicios y JavaScript de cliente:** no se proponen. Cualquier necesidad detectada debe detenerse y consultarse antes.
5. **`@theme`, tokens y estructura:** no se modifican valores ni se crean áreas ajenas a las estructuras descritas. Todo componente/ruta queda dentro de `web/src/pages`, `web/src/components`, `web/src/domain`, `web/src/infrastructure` o `web/src/i18n`.
6. **Contenido Sanity:** no modificar producción. Para QA visual de páginas propias, usar solo contenido publicado ya disponible en `development`; si falta contenido representativo, pedir al usuario que lo proporcione o autorice antes de editar ese dataset.

## Alcanzabilidad en la plataforma elegida

| Garantía | Evaluación |
|---|---|
| RF-1–RF-8: listados, páginas propias, contenido y estados vacíos | **Alcanzable.** Las páginas de índice estáticas siempre se generan; las dinámicas generan solo idiomas presentes. El mapper ya normaliza exposición/texto y permite listas vacías. |
| RF-6–RF-7, RF-14–RF-15: relaciones localizadas, ficha de obra y cuatro estados | **Alcanzable.** El mapper ya intersecta relaciones con destinos visibles por idioma. La disponibilidad no interviene en esa selección; la ficha de obra existente conserva su etiqueta textual y no se añade acción comercial. |
| RF-9–RF-10: alternates y 404 | **Alcanzable.** `BaseLayout` y el selector aceptan solo paths suministrados; Astro estático omite páginas no elegibles y Cloudflare Pages dispone de 404. Verificar respuesta HTTP 404 en preview para URLs profundas. |
| RF-11: metadatos derivados y únicos | **Condicional al contenido.** La puerta global existente detecta duplicados y detiene el build, por lo que una salida con duplicados no se despliega. No puede garantizar que cualquier conjunto editorial produzca metadatos únicos: dos textos pueden compartir los primeros 155 caracteres o dos exposiciones título/lugar/fechas iguales. Como la spec prohíbe inventar sufijos, esos casos requieren que el artista diferencie el contenido publicado; hasta entonces el build queda bloqueado. |
| RF-12: datos estructurados | **Alcanzable para hechos tipados disponibles.** Astro puede serializar datos estructurados seguros en páginas estáticas. El campo `author` de texto crítico es una cadena sin tipo Person/Organization; el plan omite esa clasificación para no inferirla. Si RF-12 se interpreta como obligación de clasificar al autor, el dato actual no basta y hace falta una decisión/cambio de spec o modelo aprobado antes de implementarlo. |
| RF-13: sitemap de páginas e imágenes | **Alcanzable.** Los generadores existentes producen XML estático; se extienden con listados, detalles localizados y proyecciones transformadas de imágenes. No requiere servicio ni dependencia externa. |
| RNF-1–RNF-6: idioma, accesibilidad, diseño, renderizado e imágenes | **Alcanzable y verificable.** Se reutilizan HTML estático, contenido de mappers, diccionarios ES/EN, componentes accesibles, tokens existentes y transformaciones del CDN. |
| RNF-7: Lighthouse ≥90/95/100 | **Medible, no garantizable solo por Astro/Cloudflare.** Depende del volumen del texto crítico, assets, fuentes y red. Se medirá sobre preview; si no llega al umbral, la spec no se da por terminada. |

## Estrategia de verificación

1. **Vitest — dominio/presentación:** probar exposición por inicio descendente; desempate determinista; títulos críticos con colación ES/EN y desempate estable; descripción de exposición formada solo con título/lugar/fechas; descripción crítica de 155 caracteres en límite de palabra, incluidos caracteres Unicode; metadatos repetidos rechazados.
2. **Vitest — mapper/loader:** conservar pruebas existentes de `mapSanityContent` para traducción original EN sin ES, traducción incompleta, imagen opcional inválida y relaciones a destinos visibles/no visibles. Ampliar `catalog-content.test.ts` para las cuatro consultas concurrentes, resultados mapeados, asociaciones de exposición/texto y matching de asset de imagen. Comprobar en `queries.test.ts` que las consultas siguen usando perspectiva publicada y no incluyen credenciales/drafts; modificarlo solo si falta una aserción de contrato.
3. **Vitest — interfaz/i18n:** comprobar mensajes de salto y unidad `cm` en ES/EN, paridad de diccionarios y unidad localizada en la ficha/datos estructurados. Los códigos `ES`/`EN` del selector siguen siendo códigos estándar. Usar pruebas de salida para contenido de listado/detail, estado vacío, sin fallback, no renderizar relaciones vacías y no incluir acciones comerciales.
4. **Vitest — metadatos/sitemaps:** comprobar titles/descriptions únicos, descripción crítica truncada, rutas de índice siempre presentes, detalle únicamente con idioma publicado, alternates coherentes, y sitemap de imágenes con solo assets de exposición válidos.
5. **Build y salida:** `pnpm --dir web verify`. Inspeccionar HTML de cada plantilla ES/EN: canonicals, hreflang, metadatos, JSON-LD parseable/escapado, contenido disponible sin JavaScript cliente, sitemaps y ausencia de rutas no visibles. Confirmar fallo del gate ante metadatos duplicados.
6. **Chrome DevTools:** revisar preview en 375×812, 768×1024 y 1280×900. Casos: listados vacíos y poblados; título/autor/lugar largo; exposición con/sin imagen; relación presente y cero relaciones; crítico original EN sin ES; cuatro estados de una obra relacionada; salto al `<main>` y fuentes locales cargadas. Comprobar teclado/foco, etiquetas de enlace, contraste AA, idioma, no overflow, `alt`, dimensiones, `srcset`, contenido completo y 404 HTTP de páginas no generadas. No crear ni publicar contenido Sanity sin autorización.
7. **Lighthouse manual:** evaluar en móvil un listado ES y una página propia ES de cada tipo con contenido representativo disponible; objetivos ≥90 rendimiento, ≥95 accesibilidad y 100 SEO. Si development no contiene datos suficientes, no alterar producción: solicitar contenido/permiso para development o registrar el bloqueo de QA.

## Cobertura de requisitos

| Requisito | Cobertura principal |
|---|---|
| RF-1–RF-2 | Páginas y componente `ExhibitionIndex`; orden/descripciones de listado en `catalog-presentation`; loader con datos del mapper. |
| RF-3 | Rutas de exposición y `ExhibitionContent`; proyección opcional validada y sitemap de imágenes. |
| RF-4 | Páginas y componente `CriticalTextIndex`; orden localizado y pruebas de presentación. |
| RF-5 | Rutas de texto crítico y reutilización de `CriticalTextContent`. |
| RF-6 | `MappedExhibitionTranslation`/`MappedCriticalTextTranslation` ya filtradas; props localizadas a componentes de detalle. |
| RF-7 | `ArtworkContent` + `ArtworkCriticalTexts`; conservar cuerpo y enlazar solo la versión actual. |
| RF-8 | Componentes de índice, mensajes vacíos ES/EN y pruebas. |
| RF-9–RF-10 | `BaseLayout`, selector existente, `getStaticPaths` por traducción y 404 de Cloudflare Pages verificada. |
| RF-11 | `catalog-presentation`, propiedades de página y puerta `assertUniqueSeoMetadata` existente. |
| RF-12 | Datos estructurados factuales en rutas propias y validación JSON parseable en salida; sin inventar el tipo de autor. |
| RF-13 | Generadores existentes de sitemap de página/imagen y sus pruebas ampliadas. |
| RF-14–RF-15 | Relaciones filtradas en mapper, sin filtro por Availability ni contenido comercial/inventado. |
| RNF-1–RNF-7 | Diccionarios, componentes y tokens existentes; salida estática; revisión responsive, accesibilidad, imágenes y Lighthouse. |

Implementación y verificación completadas. Las decisiones y resultados por tarea quedan registrados en `tasks.md`.
