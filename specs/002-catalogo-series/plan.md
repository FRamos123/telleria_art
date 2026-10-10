# Plan 002 — Catálogo de obras y series

Spec de referencia: `spec.md` (**borrador de cambio pendiente de aprobación**). Este plan propone generar el catálogo y las páginas de serie como contenido estático, usando exclusivamente entidades visibles según la spec 001. No añade compra, checkout ni disponibilidad de prints. El cambio propuesto permite al artista mantener descripciones SEO globales y localizadas del catálogo; no redacta el contenido.

## Alcance y dependencias

- El contenido se consulta durante el build desde la perspectiva publicada de Sanity y se transforma mediante el mapper existente. No habrá consultas a Sanity ni JavaScript de catálogo en el navegador.
- Se reutilizan los modelos, validadores, consultas de contenido, transformaciones de imagen y etiquetas de disponibilidad existentes. Se propone un schema global de Sanity para descripciones SEO opcionales de catálogo ES/EN; no se cambian tipos públicos del dominio ni criterios de visibilidad.
- Rutas propuestas: catálogo `/obras/` y `/en/works/`; series `/series/<seriesId>/` y `/en/series/<seriesId>/`. Se usan IDs estables existentes para evitar añadir campos de slug.
- La ficha de obra, requerida como destino de navegación y para `VisualArtwork`, también está definida por la Spec 003, que actualmente sigue en borrador. Este plan establece como contrato propuesto `/obra/<artworkId>/` y `/en/work/<artworkId>/`, pero la creación de esas fichas debe coordinarse y quedar cubierta por un plan de Spec 003 aprobado. Es una dependencia para completar RF-5, RF-6, RF-15, RF-16, RF-17 y la evaluación Lighthouse de ficha.
- El catálogo se genera aunque no haya obras visibles; una serie solo genera página y enlaces cuando la spec 001 la considera visible en ese idioma.

## Archivos previstos y responsabilidad

| Acción y archivo | Responsabilidad | RF cubiertos |
|---|---|---|
| **Crear** `web/src/pages/obras/index.astro` | Página ES del catálogo, generada incluso con catálogo vacío; metadatos, enlaces y bloque de series ES. | RF-1–RF-3, RF-8–RF-10, RF-13–RF-14, RF-16, RF-18–RF-19 |
| **Crear** `web/src/pages/en/works/index.astro` | Equivalente EN del catálogo, sin fallback al contenido ES. | RF-1–RF-3, RF-8–RF-10, RF-13–RF-14, RF-16, RF-18–RF-19 |
| **Crear** `web/src/pages/series/[seriesId].astro` | Generar solo las rutas ES de series visibles; mostrar las obras visibles asociadas. | RF-4–RF-8, RF-10–RF-16, RF-18–RF-19 |
| **Crear** `web/src/pages/en/series/[seriesId].astro` | Equivalente EN; omitir la ruta cuando no exista una serie visible en EN. | RF-4–RF-8, RF-10–RF-16, RF-18–RF-19 |
| **Crear** `web/src/infrastructure/sanity/catalog-content.ts` | Cargar las consultas existentes durante el build, invocar `mapSanityContent` y entregar obras/series ya filtradas por visibilidad, por idioma. No repetir validaciones editoriales. | RF-1–RF-8, RF-11–RF-13, RF-16 |
| **Crear** `studio/schemaTypes/documents/siteSettings.ts` | Definir campos opcionales de descripción SEO del catálogo ES y EN en la configuración global, con contenido escrito/aprobado por el artista. | RF-20, RF-14, RNF-1 |
| **Modificar** `studio/schemaTypes/index.ts`, `studio/sanity.config.ts` | Registrar el schema y exponer en Studio un único documento de configuración global. | RF-20 |
| **Modificar** `web/src/infrastructure/sanity/queries.ts`, `catalog-content.ts` | Consultar el documento global publicado mediante su ID singleton y exponer la descripción de cada idioma, sin fallback si falta. | RF-20, RF-14, RNF-1 |
| **Modificar** `web/src/pages/obras/index.astro`, `web/src/pages/en/works/index.astro` | Pasar a `BaseLayout` solo la descripción publicada del idioma actual; si falta, omitir el meta tag. | RF-14, RF-20 |
| **Modificar** `web/src/infrastructure/sanity/queries.test.ts`, `catalog-content.test.ts`, `web/src/i18n/build-output.test.ts` | Comprobar lectura publicada, separación ES/EN, omisión sin fallback y emisión de meta description en el catálogo correspondiente; el gate de T13 detecta duplicados. | RF-14, RF-20, RNF-1, RNF-5 |
| **Crear** `web/src/components/ArtworkCatalog.astro` | Componer el bloque de series encima de la cuadrícula y presentar las tarjetas o el estado vacío localizado. | RF-1–RF-3, RF-8–RF-10, RF-18 |
| **Crear** `web/src/components/SeriesDirectory.astro` | Mostrar un enlace identificable a cada serie visible en el idioma actual. | RF-3, RF-7–RF-8 |
| **Crear** `web/src/components/ArtworkCard.astro` | Presentar únicamente imagen, título, año y disponibilidad textual; enlazar a la ficha publicada, sin acciones de adquisición. Reutilizable en catálogo y página de serie. | RF-1–RF-2, RF-5, RF-10–RF-12, RF-18–RF-19 |
| **Crear** `web/src/domain/catalog-presentation.ts` y `web/src/domain/catalog-presentation.test.ts` | Funciones puras para ordenar obras, derivar descripciones SEO de serie y detectar títulos/descripciones duplicados; sin dependencias de Astro o Sanity. | RF-2, RF-14 |
| **Modificar** `web/src/components/SeriesContent.astro` | Mantener nombre, descripción e imagen opcionales; usar tarjetas para obras; añadir `CollectionPage` con solo las obras visibles en ese idioma. | RF-4–RF-8, RF-10–RF-13, RF-15, RF-18–RF-19 |
| **Modificar** `web/src/components/AvailabilityLabel.astro` | Asignar a cada estado el token de color ya definido y conservar siempre la etiqueta textual localizada. | RF-10, RF-18–RF-19 |
| **Modificar** `web/src/components/EditorialImage.astro` | Mantener alt y dimensiones explícitos; admitir carga diferida y carga inmediata para la imagen principal visible al cargar. | RF-1, RF-4, RF-12, RNF-6 |
| **Modificar** `web/src/layouts/BaseLayout.astro` | Aceptar metadatos y alternates por página; emitir canonical y `hreflang` solo a rutas equivalentes publicadas, en vez de enlazar siempre las homes. | RF-8, RF-14, RNF-1, RNF-4–RNF-5 |
| **Modificar** `web/src/components/LanguageSwitcher.astro` | Navegar a la versión equivalente de la página cuando exista; no enlazar a una traducción ausente. | RF-8, RNF-1 |
| **Modificar** `web/src/components/ArtworkContent.astro` — coordinado con Spec 003 | Emitir `VisualArtwork` con los datos de la obra y mantener el enlace localizado a la serie visible. El detalle completo y sus rutas pertenecen a Spec 003. | RF-5–RF-6, RF-15 |
| **Crear** `web/src/pages/sitemap.xml.ts` | Emitir las páginas visibles de catálogo, series y obras, con alternates de idioma publicados. | RF-8, RF-14, RF-16 |
| **Crear** `web/src/pages/image-sitemap.xml.ts` | Emitir imágenes principales de obras visibles e imágenes de serie existentes y válidas; omitir imágenes de serie ausentes o inválidas. | RF-12, RF-16 |
| **Modificar** `web/src/i18n/es.ts`, `web/src/i18n/en.ts` | Añadir títulos funcionales de secciones, estado vacío y plantillas localizadas de metadatos; las etiquetas de Availability existentes se conservan. | RF-8–RF-10, RF-13, RNF-1 |
| **Modificar** `web/src/i18n/messages.test.ts` | Mantener paridad de claves ES/EN y comprobar etiquetas de los cuatro estados. | RF-8, RF-10, RF-19, RNF-1 |
| **Modificar** `web/src/i18n/build-output.test.ts` | Comprobar que las rutas de catálogo, 404, metadatos, contenido renderizado, alternates, JSON-LD y sitemaps están en la salida estática. | RF-8–RF-9, RF-13–RF-17, RNF-4–RNF-5 |
| **Reutilizar sin modificar** `web/src/pages/404.astro` | Cloudflare Pages servirá la 404 bilingüe existente para rutas estáticas que no se generen. | RF-17 |
| **No modificar** `web/src/infrastructure/sanity/mappers.ts`, `web/src/domain/availability.ts`, `inventory-number.ts` | Ya proveen disponibilidad, números de inventario y visibilidad localizada; no hace falta ampliar tipos públicos ni alterar reglas de dominio para el ajuste SEO global. | RF-1–RF-2, RF-6–RF-12, RF-19 |

## Modelo de dominio y mappers

- No se añade modelo editorial. Se reutilizan `MappedArtwork`, `MappedSeries`, `Availability` e `InventoryNumber` existentes.
- `mapSanityContent` es la única fuente de elegibilidad para los listados: omite obras inválidas, conserva traducciones completas por idioma y entrega series visibles solo si tienen obras visibles asociadas. Las páginas no ejecutan una segunda validación ni alteran relaciones; si la serie no es visible en un idioma, la obra puede permanecer en el catálogo general sin enlace a esa serie.
- Las proyecciones de imagen de las consultas existentes contienen asset, dimensiones, crop y hotspot. `createResponsiveImage` las transforma en variantes responsive; no se modifican los esquemas de imagen.
- La descripción SEO de serie sigue derivándose de su descripción editorial o de la plantilla localizada de RF-14. La descripción SEO del catálogo es distinta: un texto opcional, global y localizado en `siteSettings`, escrito/aprobado por el artista, no extraído de obras o series. No se añade un campo SEO a `artwork`, `artworkTranslation`, `series` ni `seriesTranslation`.
- La descripción global se conserva en infraestructura de build, separada de `MappedSanityContent`; si falta el documento o el idioma, el catálogo se genera igualmente sin meta description.
- `catalog-presentation.ts` acepta los datos ya mapeados y expone ordenación, derivación de descripción y comprobación de unicidad. Se mantiene TypeScript puro, sin importar Astro, Sanity ni componentes.

## Algoritmo de selección y generación

```text
durante el build:
  consultar obras y series publicadas con el cliente existente
  consultar el documento publicado siteSettings con su ID singleton estable
  mapear los resultados mediante mapSanityContent

  generar siempre el catálogo ES y el catálogo EN:
    seleccionar obras con traducción visible en ese idioma
    ordenar por año descendente y, en empate, InventoryNumber ascendente
    seleccionar las series visibles en ese idioma
    seleccionar solo la descripción SEO global publicada en el idioma actual
    omitir meta description cuando no exista; nunca usar otro idioma
    generar el bloque de enlaces a series encima de la cuadrícula
    si la lista está vacía, renderizar el mensaje funcional localizado

  para cada idioma:
    para cada serie visible:
      seleccionar solo obras visibles asociadas y ordenarlas con el mismo comparador
      derivar title y meta description localizados
      emitir su ruta estática, HTML y CollectionPage

  reunir metadatos de todas las páginas públicas ES/EN: home, catálogo, series y fichas
  excluir la 404 de la comprobación de metadatos SEO indexables
  fallar el build si hay títulos duplicados o meta descriptions duplicadas
  emitir sitemap de páginas con alternates solo para versiones publicadas
  emitir sitemap de imágenes para imágenes de obra visibles e imágenes de serie válidas

  no generar una ruta de contenido no visible
  delegar cualquier solicitud a ruta no generada a la 404 bilingüe existente
```

El orden de la lista de series no está definido en la spec; como decisión de presentación determinista, el plan propone orden alfabético por nombre localizado, con ID estable como desempate. Las tarjetas no incluyen un enlace a la serie; la navegación a series ocurre en el bloque superior y desde la ficha de obra.

## Interfaz y tokens

- **Catálogo:** una columna en móvil, ocho columnas en tablet y doce en escritorio, con bloque de series inmediatamente encima de la cuadrícula. Propuesta visual: tarjetas a ancho completo en móvil y ocupando cuatro columnas en tablet/escritorio. Se usa `gutter-mobile`, `gutter`, `margin-mobile` y los breakpoints documentados.
- **Tarjeta:** `ArtworkCard` reutiliza `EditorialImage` y `AvailabilityLabel`. Usa `surface-container-low` para la superficie de imagen, `on-surface` para el título, `on-surface-variant` para metadatos, tipografía `headline-sm`/`body-md`/`label-technical` y `space-sm`/`space-md`/`space-lg`. Solo muestra imagen, título, año y estado.
- **Bloque de series:** enlaces con texto visible, subrayado/foco accesible y tokens `label-technical`, `on-surface`/`accent`, `surface-container-lowest` y espaciado existente. El nombre de la serie es contenido editorial localizado.
- **Página de serie:** reutiliza el contenedor ya presente en `SeriesContent.astro`, `headline-lg`/`headline-lg-mobile`, `body-md`, `label-technical`, `surface-container-low`, `space-*` y la cuadrícula de 8/12 columnas; se sustituye la lista textual de obras por las tarjetas acordadas.
- **Availability:** texto siempre presente y color según `design/tokens.md`: disponible `accent`, reservada `status-reserved`, vendida `status-sold`, en colección `status-collection`, sobre superficie oscura opaca. Todo texto usa tokens sólidos, sin opacidad.
- **Imágenes:** se conservan `width`/`height`, AVIF o WebP, `srcset` y tamaños de Sanity; las imágenes fuera de la primera visible cargan de forma diferida.
- **Sin hidratación:** navegación por enlaces HTML, sin filtros ni acciones de adquisición.
- **Sin cambio de `design/tokens.md` ni de `@theme`** previsto. El patrón visual concreto de tarjeta/cuadrícula no está detallado como patrón en tokens y queda sujeto a la aprobación indicada abajo.

## Decisiones técnicas

| Decisión | Motivo | Alternativa descartada |
|---|---|---|
| Generar rutas estáticas con datos publicados en build. | Cumple HTML presente sin JavaScript, evita exponer borradores y se alinea con Astro estático y las consultas Sanity existentes. | Consultar Sanity desde el navegador o renderizar el catálogo por visita. |
| Usar IDs de serie y obra existentes en las rutas de contenido. | Mantiene unicidad sin añadir slugs a Sanity ni a tipos públicos; las traducciones comparten destino por ID. | Añadir campos de slug traducidos o derivar rutas solo de nombres susceptibles de repetirse/cambiar. |
| Reusar `mapSanityContent` y `createResponsiveImage`. | Sus salidas ya aplican reglas de publicación, visibilidad, `Availability`, inventario y proyección de imágenes. | Revalidar en cada componente o crear un modelo editorial paralelo. |
| Generar XML mediante endpoints estáticos nativos del sitio. | El contenido y las alternates se conocen al build y no requieren servicio externo. | Añadir una dependencia/plugin de sitemap sin necesidad funcional. |
| Derivar SEO de series en funciones puras; gestionar la descripción del catálogo como texto global localizado y aprobado por el artista; verificar unicidad antes de emitir páginas. | Mantiene el resumen ligado a la serie y da al artista control de la descripción de la página general sin adjuntarla a una entidad incorrecta. | Derivar el catálogo de una obra/serie, copiar el texto entre idiomas o mantenerlo obligatoriamente en código. |
| Reutilizar enlaces HTML y etiquetas de disponibilidad existentes, aplicando los tokens asignados. | Evita JavaScript y preserva accesibilidad y coherencia visual. | Filtros en cliente, acciones de adquisición o colores hardcodeados. |

## Puntos de «⚠️ Preguntar antes» de AGENTS.md

1. **Layout y patrón visual:** `BaseLayout.astro` y `LanguageSwitcher.astro` son compartidos; cambiar sus alternates afecta páginas existentes. El reajuste de `SeriesContent.astro`, el catálogo, la cuadrícula y las tarjetas tampoco está descrito completamente en `design/tokens.md`. Antes de implementarlos, presentar la composición visual propuesta (incluidos los spans de cuatro columnas) y obtener aprobación; si requiere un patrón o token nuevo, actualizar `design/tokens.md` con su changelog antes del código.
2. **Schema Sanity y tipos públicos:** el cambio propuesto necesita schema y configuración singleton global en Studio; pedir aprobación explícita antes del código. No cambia `MappedArtwork`/`MappedSeries`, reglas de publicación ni contenido de producción. El artista debe proporcionar/aprobar el texto ES/EN y editarlo en el dataset de desarrollo antes del Lighthouse final.
3. **Dependencias:** no se propone ninguna. Si durante el trabajo se decide usar un generador/plugin de sitemap u otra dependencia, pedir aprobación antes.
4. **JavaScript y servicios externos:** no se proponen. Cualquier necesidad posterior de JavaScript cliente o servicio externo requiere aprobación previa.
5. **`@theme` y tokens existentes:** no se modifican valores de tema, paleta ni tipografía; los colores de estado ya tienen tokens. Cualquier cambio a esos valores requeriría aprobación previa.

Los archivos propuestos quedan dentro de las estructuras existentes `studio/schemaTypes/` y `web/src/pages/`, `components/`, `domain/`, `infrastructure/sanity/` e `i18n/`.

## Alcanzabilidad en la plataforma elegida

| Garantía | Evaluación |
|---|---|
| HTML estático de catálogo, series y salida sin JavaScript | **Alcanzable:** `astro.config.mjs` ya usa `output: 'static'`; `getStaticPaths` puede emitir cada versión desde datos publicados de Sanity en build. |
| Consulta de Sanity durante el build | **Alcanzable si Cloudflare Pages tiene `SANITY_PROJECT_ID` y `SANITY_DATASET` configurados:** se consulta sin token contenido publicado y el singleton `siteSettings`; si el ajuste o idioma no existe, solo se omite la meta description del catálogo. |
| Solo contenido publicado/visible y alternates por idioma | **Alcanzable:** el cliente existente usa `perspective: 'published'` y `mapSanityContent` ya filtra traducciones, series y relaciones por idioma. |
| 404 bilingüe, sin redirecciones | **Alcanzable en Cloudflare Pages:** existe `404.astro` bilingüe y el build estático no genera rutas no visibles. Debe verificarse en preview que una URL profunda ausente devuelve HTTP 404 y no una respuesta 200 de fallback. |
| Metadatos, JSON-LD y unicidad con fallo de build | **Alcanzable:** Astro permite emitir HTML/JSON-LD y endpoints estáticos; la validación pura puede ejecutarse durante la generación y arrojar error antes de desplegar. |
| Sitemap con alternates e imágenes | **Alcanzable:** se pueden generar XML estáticos durante el build sin servicio externo. Las imágenes de serie inválidas se filtran antes de serializar. |
| Transformaciones, formatos, dimensiones y tamaños responsive | **Las transformaciones AVIF/WebP, dimensiones y máximo 2000 px son alcanzables con Sanity Image CDN.** El builder actual puede producir menos de tres variantes para assets/crops estrechos, por lo que habrá que ajustar la selección. Se pueden solicitar tres anchuras transformadas, pero la calidad de fuentes originales pequeñas no puede garantizarse: la spec 001 no establece una resolución mínima de subida. |
| Objetivos de peso de tarjeta/ficha | **Revisables, no garantizables:** la spec los declara no bloqueantes; dependen de las imágenes que publique el artista y se comprobarán en DevTools. |
| Lighthouse 90/95/100 | **Medible, no garantizado solo por la plataforma:** Astro estático minimiza trabajo cliente, pero la puntuación final depende de imágenes, fuentes, contenido y red; requiere la evaluación manual especificada. |
| Fichas individuales y VisualArtwork | **Capacidad de plataforma disponible, dependencia funcional pendiente:** Astro/Sanity pueden generar estas páginas y datos, pero RF-5/6/15/16/17 requieren acordar con la Spec 003, que todavía está en borrador. No se deben duplicar sus rutas ni considerar cerrada la integración hasta que esa spec tenga plan aprobado.

## Estrategia de verificación

1. **Vitest — dominio y presentación:** ordenar por año descendente e inventario ascendente, incluyendo empates; derivar meta description de hasta 155 caracteres y límite de palabra; plantilla localizada sin descripción editorial; detectar títulos/descripciones duplicados; comprobar que una obra con serie no visible conserva su aparición pero no el enlace.
2. **Sanity y Vitest:** validar en Studio un único `siteSettings` con campos SEO opcionales ES/EN; pruebas de query/build comprueban selección publicada por idioma, ausencia y no-fallback. No hace falta cambiar mappers de dominio.
3. **Build y salida estática:** con texto de catálogo aprobado y publicado en `development`, ejecutar `pnpm --dir web verify`; inspeccionar HTML en `dist` para meta description solo en el catálogo del idioma correspondiente, omisión si falta, unicidad de home/catálogo/series/fichas, canonical, alternates, JSON-LD, XML y exclusión de rutas no visibles. Confirmar que un duplicado hace fallar el build.
4. **Chrome DevTools:** en preview del build de producción verificar catálogo ES/EN, página de serie y, tras aprobarse la dependencia, ficha ES; revisar estado vacío, serie sin imagen, enlaces, foco/teclado, ausencia de acciones comerciales e imágenes `srcset`, `width`/`height` y `loading`.
5. **Responsive:** a 375, 768 y 1280 px, con contenido mínimo y máximo (títulos/nombres largos), comprobar una, ocho y doce columnas según tokens; los cuatro datos de tarjeta deben permanecer visibles sin recortes, solapes ni scroll horizontal.
6. **Lighthouse manual:** móvil, preview del build con texto ES aprobado/publicado: catálogo ES, ficha ES y serie ES. Umbrales: rendimiento ≥ 90, accesibilidad ≥ 95 y SEO = 100. La herramienta seleccionada debe entregar puntuación Performance, además de Accesibilidad y SEO. Verificar aparte los pesos orientativos, sin bloquear por superarlos.
7. **Rutas:** solicitar páginas visibles e inexistentes/retiradas; comprobar que las primeras cargan y las segundas responden HTTP 404 bilingüe, sin redirección.

## Cobertura de requisitos

| Requisito | Cobertura principal |
|---|---|
| RF-1–RF-3 | `ArtworkCatalog`, `SeriesDirectory`, `ArtworkCard` y rutas de catálogo. |
| RF-4–RF-5 | Rutas y `SeriesContent`; tarjetas enlazan a la ficha cuya ruta compartida corresponde a Spec 003. |
| RF-6 | Ficha `ArtworkContent` conserva enlace solo a serie visible; ruta/detail coordinada con Spec 003. |
| RF-7 | Salida de `mapSanityContent` y `getStaticPaths` solo para series visibles con obras visibles en el idioma. |
| RF-8–RF-9 | Rutas permanentes ES/EN, `LanguageSwitcher` y estado vacío i18n. |
| RF-10, RF-18–RF-19 | `AvailabilityLabel`, `ArtworkCard`, diccionarios y pruebas 4×2; ninguna acción de adquisición. |
| RF-11–RF-13 | Mapper existente, `EditorialImage`, `SeriesContent` y omisión de contenido opcional sin fallback. |
| RF-14 | `catalog-presentation.ts`, `BaseLayout` y gate de unicidad en build. |
| RF-20 | Configuración global localizada en Sanity, consulta publicada y meta description del catálogo en el idioma actual, sin fallback. |
| RF-15 | `CollectionPage` en serie; `VisualArtwork` en ficha coordinada con Spec 003. |
| RF-16 | Sitemaps estáticos de páginas/alternates e imágenes. |
| RF-17 | Salidas estáticas solo para rutas visibles y `404.astro` bilingüe existente. |
| RNF-1–RNF-2 | Diccionarios ES/EN, enlaces accesibles por teclado, alt y etiquetas de estado textual. |
| RNF-3 | Cuadrícula responsive con tokens y matriz Chrome DevTools. |
| RNF-4–RNF-5 | Generación Astro estática, metadatos, JSON-LD, canonical, `hreflang` y sitemaps comprobados en build. |
| RNF-6–RNF-7 | `EditorialImage`, Sanity Image CDN, revisión de peso y Lighthouse. |
| RNF-8 | Tokens de texto sólidos y revisión de contrastes en Chrome DevTools. |
