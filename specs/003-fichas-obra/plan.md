# Plan 003 — Fichas individuales de obra

Spec de referencia: `spec.md` (**aprobada**, sin dudas abiertas). El plan genera fichas estáticas ES/EN solo para versiones completas y publicadas. No incorpora compra, precios, ofertas, checkout ni promesas sobre prints.

## Alcance y dependencias

- Reutilizar Astro estático, el cliente de Sanity de build, `mapSanityContent`, `createResponsiveImage`, el layout, los componentes de imagen/ficha técnica/estado y las etiquetas i18n existentes.
- Rutas acordadas con las tarjetas de Spec 002: `/obra/<artworkId>/` y `/en/work/<artworkId>/`, usando el ID estable de Sanity y codificándolo en el enlace.
- Las fichas y los sitemaps consumirán únicamente resultados publicados y visibles del mapper. Las rutas no generadas quedarán a cargo de la 404 existente de Cloudflare Pages.
- Spec 002 aún tiene pendientes T10–T12: integración de destino de tarjetas/`VisualArtwork`, sitemap de páginas y sitemap de imágenes. Los endpoints de sitemap de este plan deben coordinarse con esas tareas y completarlas una sola vez, no duplicarlas.

## Hallazgos que afectan a la implementación

1. **La relación localizada con la serie no está garantizada actualmente por `mapSanityContent`.** El mapper exige `seriesId`, pero puede conservar una traducción de obra aunque no exista una traducción publicada de su serie en ese idioma. Hay que filtrar/bloquear la ficha ES si falta una serie ES válida y descartar solo la traducción EN si falta la serie EN. Es necesario para RF-1, RF-5 y RF-6.
2. **La nota de taller actual no está localizada.** Sanity la guarda en `artwork.workshopNote`, fuera de `artworkTranslation`; el mapper la coloca como opcional compartida. Mostrarla así en EN incumpliría RF-3. Para ofrecer notas en ambos idiomas sin fallback, el plan añade un campo opcional `workshopNote` a cada documento de traducción, conserva intacto el campo legado compartido y lo presenta solo en ES si se confirma que su contenido es español. No se debe modificar contenido de Sanity de producción.
3. **No existe un campo de descripción SEO de obra en el schema actual.** RF-8 sí se cumple omitiendo la meta description y generando un título identificador único con título e inventario; no se derivará una descripción de la nota ni de textos críticos. Para admitir una descripción SEO escrita por el artista en el futuro haría falta acordar schema y tipo, fuera del plan actual.
4. Lighthouse es medible en Astro/Cloudflare Pages, pero sus umbrales no son una garantía intrínseca de la plataforma: dependen de contenido, imágenes, fuentes y red. La nota de taller inglesa tampoco es publicable hasta que exista el campo localizado aprobado/editorialmente utilizado.

## Archivos previstos y responsabilidad

| Acción y archivo | Responsabilidad | RF cubiertos |
|---|---|---|
| **Crear** `web/src/pages/obra/[artworkId].astro` | Cargar contenido publicado en build, emitir únicamente rutas ES elegibles, preparar imagen optimizada, metadatos, canonical/alternates y JSON-LD factual. | RF-1–RF-14 |
| **Crear** `web/src/pages/en/work/[artworkId].astro` | Equivalente EN; emitir ruta solo cuando obra, traducción obligatoria, alt y serie estén publicados en EN. Sin fallback ES. | RF-1–RF-14 |
| **Crear** `web/src/components/ArtworkCriticalTexts.astro` | Mostrar título, cuerpo y autor de textos críticos relacionados que tengan traducción publicada en el idioma de la ficha; omitir relaciones/contenido ausente. | RF-3, RF-14; RNF-1, RNF-2, RNF-5 |
| **Crear** `web/src/pages/sitemap.xml.ts` | Emitir XML de páginas públicas existentes (home, catálogo, series y fichas), incluyendo cada versión publicada y relaciones hreflang solo entre equivalentes publicados. Coordinar con Spec 002 para no duplicar su T11. | RF-9, RF-11 |
| **Crear** `web/src/pages/image-sitemap.xml.ts` | Emitir imágenes principales de obras publicadas usando URLs transformadas; coordinar con Spec 002 para incorporar también imágenes públicas de serie y no duplicar su T12. | RF-7, RF-11 |
| **Modificar** `web/src/components/ArtworkContent.astro` | Componer ficha completa: imagen, título, serie localizada, inventario, ficha técnica, nota de taller solo del idioma actual y textos críticos localizados; no presentar acciones comerciales. | RF-1–RF-4, RF-7, RF-13–RF-14; RNF-1–RNF-3, RNF-5–RNF-6 |
| **Modificar** `web/src/infrastructure/sanity/queries.ts` | Proyectar `workshopNote` opcional dentro de cada traducción, manteniendo la consulta del campo legado para conservar compatibilidad ES. | RF-3, RF-5–RF-6 |
| **Modificar** `web/src/infrastructure/sanity/mappers.ts` | Extender `MappedArtworkTranslation` con la nota localizada; mantener el campo legado solo en ES; bloquear obra ES sin serie ES válida y eliminar solo EN cuando su serie EN no esté publicada. Seguir usando los validadores y value objects existentes. | RF-1–RF-6, RF-14 |
| **Modificar** `studio/schemaTypes/documents/artworkTranslation.ts` | Añadir campo de nota de taller opcional por idioma, sin renombrar ni borrar el campo legado de obra. | RF-3, RF-6 |
| **Modificar** `web/src/infrastructure/sanity/mappers.test.ts` | Probar publicación ES/EN según serie localizada, nota en el idioma correcto, falta de fallback y retención/omisión de la nota legada solo para ES. | RF-3, RF-5–RF-6, RF-14 |
| **Modificar** `web/src/infrastructure/sanity/queries.test.ts` | Fijar el contrato de la proyección de notas por traducción y del campo legado; confirmar que las consultas siguen leyendo únicamente publicaciones. | RF-3, RF-5–RF-6 |
| **Modificar** `web/src/i18n/build-output.test.ts` | Comprobar HTML estático ES/EN, metadatos, canonical, alternates, contenido obligatorio, JSON-LD y presencia/exclusión en ambos sitemaps. | RF-1–RF-14; RNF-1, RNF-4–RNF-6 |
| **Reutilizar sin modificar** `web/src/components/ArtworkTechnicalSheet.astro`, `AvailabilityLabel.astro`, `InventoryBadge.astro`, `EditorialImage.astro` | Mostrar dimensiones alto × ancho en cm, los cuatro estados con etiqueta, inventario opaco y la imagen con alt/dimensiones/carga declaradas. | RF-1–RF-2, RF-4, RF-7; RNF-2, RNF-6 |
| **Reutilizar sin modificar** `web/src/layouts/BaseLayout.astro`, `web/src/components/LanguageSwitcher.astro` | Emitir title, description solo si existe, canonical y hreflang desde las rutas suministradas; el selector solo ofrece rutas equivalentes existentes. | RF-8–RF-9; RNF-1, RNF-4 |
| **Reutilizar sin modificar** `web/src/domain/availability.ts`, `dimensions.ts`, `inventory-number.ts`, `completeness.ts`, `web/src/infrastructure/sanity/image-url.ts` | Validar estado, medidas, inventario y completitud; producir transformaciones WebP responsive y dimensiones explícitas. | RF-1–RF-7, RF-14; RNF-2, RNF-6 |
| **Reutilizar sin modificar** `web/src/pages/404.astro` | Servir la página bilingüe cuando la ruta estática no existe; confirmar la respuesta HTTP 404 en preview de Pages. | RF-12 |

No se prevén cambios en `design/tokens.md`, `web/src/styles/global.css`, `web/astro.config.mjs` ni dependencias. Los textos funcionales y etiquetas requeridos ya existen en los diccionarios ES/EN; no se añaden textos que puedan parecer contenido del artista.

## Modelo de dominio y mappers

- No se crea un modelo de dominio nuevo. Se reutilizan `MappedArtwork`, `MappedSeries`, `MappedCriticalText`, `Availability`, `Dimensions` e `InventoryNumber`.
- Extensión necesaria del tipo público `MappedArtworkTranslation`: `workshopNote?: string`. `MappedArtwork.optional.criticalTextIds` continúa representando asociaciones; no se convierte en contenido crítico ni se usa para mostrar texto de otro idioma.
- El mapper normaliza la nota localizada de cada traducción. El `artwork.workshopNote` legado no se copia a EN; el plan lo trata como ES únicamente sujeto a confirmar el idioma real del contenido. Si no se confirma, se omite antes que arriesgar una presentación en el idioma equivocado.
- Después de mapear obras y series completas, el mapper aplica el gate relacional por idioma: una obra sin serie ES traducida/publicada no es visible en ningún idioma; una obra ES válida sin serie EN traducida/publicada conserva ES y pierde solo EN. La selección se realiza en el mapper, no en las páginas, para mantener una única regla de publicación.
- Los textos críticos provienen de `MappedCriticalText.translations[locale]`; la página selecciona solo IDs asociados y traducciones presentes, y presenta `title`, `body` y `author` sin traducción automática ni fallback.
- `createResponsiveImage` ya devuelve `src`, `srcSet`, `width` y `height`, con transformaciones WebP y límite de 2000 px. Se reutiliza con el alt localizado de la traducción de obra.
- El inventario ya se valida con `createInventoryNumber` y `assertUniqueInventoryNumbers` durante el mapeo; la unicidad de inventario permite identificar sin ambigüedad las fichas.

## Algoritmo de selección y generación

```text
durante el build:
  consultar solo documentos publicados con loadCatalogContent
  mapear y validar obras, traducciones y series
  bloquear una obra si ES o su serie ES no cumplen publicación/completitud
  para EN, conservar la traducción solo si obra y serie tienen versión EN válida

  para cada obra visible:
    emitir siempre la ruta ES
    emitir la ruta EN únicamente si existe traducción EN elegible
    seleccionar la serie publicada del mismo idioma
    seleccionar nota de taller solo de ese idioma
      la nota legado de artwork solo puede aparecer en ES, tras confirmar su idioma
    seleccionar textos críticos asociados que tengan traducción publicada en ese idioma
    generar URL de imagen WebP responsive; usar alt de ese idioma
    renderizar HTML completo sin JavaScript cliente
    construir title localizado con título + número de inventario + código de idioma + marca
    omitir meta description mientras no exista un campo SEO escrito por el artista
    emitir JSON-LD VisualArtwork con hechos disponibles, sin estado ni oferta comercial

  generar sitemap de páginas con rutas publicadas y alternates existentes
  generar sitemap de imágenes con URLs transformadas de obras publicadas
  excluir toda versión/ruta no elegible de HTML, JSON-LD y sitemaps
  no generar ruta para ID ausente/retirado; Cloudflare Pages devuelve 404
```

El JSON-LD usará `VisualArtwork` con nombre, creador, identificador, técnica/soporte, dimensiones en cm, URL de imagen, idioma y serie si está publicada. No serializará `availability`, `offers`, `price`, `potentialAction`, enlaces de compra ni datos de prints. Los valores se serializan como JSON y no se concatenan como HTML sin escape.

## Interfaz y tokens

- Reusar la composición existente en `ArtworkContent.astro`: una columna en móvil, ocho columnas en tablet y doce en escritorio; imagen a 7 columnas y contenido técnico a 5 en escritorio, como el patrón de ficha técnica documentado en `design/tokens.md`.
- La imagen principal usa `EditorialImage` con `loading="eager"`, `sizes` acorde al ancho de ficha, `srcset`, AVIF/WebP eficiente (el generador actual produce WebP), `width`/`height` y alt localizado. No habrá visor ni zoom interactivo.
- La ficha técnica reutiliza el panel `surface-container-low`, padding `space-md`, divisores `surface-variant`, etiquetas `label-caption`/`on-surface-variant` y valores `body-md`/`on-surface`. Las dimensiones se muestran sin conversión, en orden alto × ancho y con unidad `cm`.
- Título y jerarquía usan `headline-lg-mobile`/`headline-lg` y `headline-sm`; texto editorial usa `body-md`. Nota y textos críticos solo aparecen con contenido localizado no vacío.
- Disponibilidad usa `AvailabilityLabel` con etiqueta visible en ambos idiomas y tokens existentes `accent`, `status-reserved`, `status-sold` y `status-collection`, sobre fondo oscuro opaco. No basta el color para identificar un estado.
- No se añaden patrones, colores, fuentes, espacios, radios ni JavaScript de cliente; no hay botones de compra ni texto que sugiera venta.

## Decisiones técnicas

| Decisión | Justificación | Alternativa descartada |
|---|---|---|
| Generar páginas estáticas mediante `getStaticPaths` y el mapper en build. | El HTML está disponible sin JS, solo se publica contenido validado y las rutas retiradas dejan de generarse. | SSR o consultas a Sanity desde el navegador, que ampliarían superficie y podrían filtrar borradores.
| Usar los IDs estables existentes en `/obra/<id>/` y `/en/work/<id>/`. | Coincide con enlaces emitidos por Spec 002 y evita slugs nuevos o duplicados por idioma. | Añadir slugs/campos editoriales traducidos o derivar rutas de títulos cambiantes.
| Hacer que el mapper aplique elegibilidad de serie por idioma. | RF-5/RF-6 dependen de la serie localizada; centralizarlo evita discrepancias entre ficha, catálogo y sitemap. | Comprobarlo solo en componentes o usar nombre español como fallback inglés.
| Guardar nota opcional en traducción y mantener el campo legado sin exponerlo en EN. | Permite añadir nota inglesa sin fallback y conserva datos/esquema existentes. | Mostrar un campo compartido en ambos idiomas, borrar/renombrar el campo legado o traducirlo automáticamente.
| Omitir meta description si no hay descripción SEO escrita por el artista; incluir inventario y código de idioma en el title. | No inventa ni deriva texto editorial y la combinación de inventario validado e idioma distingue las versiones. | Derivar description de título, nota o texto crítico, o añadir un campo CMS sin aprobación.
| Emitir `VisualArtwork` sin propiedades comerciales ni disponibilidad. | Describe hechos catalográficos disponibles y evita presentar el estado informativo como oferta. | Usar `Product`/`Offer`, incluir `ItemAvailability` o indicar precios/enlaces de compra.
| Reusar Sanity Image CDN y el generador WebP existente. | Ya produce srcset, transformaciones, dimensiones y un máximo de 2000 px sin dependencia nueva. | Servir original o introducir otro servicio/plugin de imágenes.
| Generar sitemaps con endpoints Astro estáticos. | Las rutas e imágenes publicadas se conocen en build; se puede coordinar con T11/T12 de Spec 002 sin servicio ni dependencia. | Añadir plugin/dependencia externa o generar sitemaps en cliente.

## Puntos de «⚠️ Preguntar antes» de AGENTS.md

1. **Esquema Sanity y tipo público del dominio:** para localizar la nota de taller hay que añadir un campo opcional a `studio/schemaTypes/documents/artworkTranslation.ts` y ampliar `MappedArtworkTranslation`. Pedir autorización antes de empezar esa implementación (AGENTS.md, líneas 95 y 97). El campo legado no se elimina, renombra ni migra; cualquier migración de datos requeriría acuerdo separado. Confirmar además que el valor legado `artwork.workshopNote` está redactado en español antes de mapearlo a ES; hasta confirmarlo, omitirlo.
2. **Tareas compartidas con Spec 002:** T10–T12 siguen pendientes. Antes de implementarlas, acordar la secuencia/registro para que las fichas y ambos sitemaps se integren en esos entregables aprobados sin duplicar trabajo.
3. **Layout/tokens:** no se prevé alterar el layout ya documentado ni tokens de `@theme`. Si la revisión Chrome evidencia que hace falta cambiar layout, patrón, paleta o tipografía, parar y pedir aprobación; cualquier patrón/token nuevo se documenta primero en `design/tokens.md`.
4. **Dependencias, JavaScript y servicios externos:** no se proponen. Si se juzgan necesarios, pedir aprobación previa. No se cambia configuración comercial ni se incorpora proveedor de pago.

Todos los archivos están bajo `web/src/` o `studio/schemaTypes/`, estructuras existentes. El plan no requiere editar contenido publicado ni secretos.

## Alcanzabilidad de las garantías

| Garantía | Evaluación en la plataforma elegida |
|---|---|
| RF-1–RF-6: contenido obligatorio/opcional, disponibilidad y ausencia de fallback | **Alcanzable**, una vez corregido el gate de serie localizado descrito arriba y localizada la nota de taller; sin esos cambios, RF-3 EN y RF-5/RF-6 no quedan garantizados por el mapper actual.
| RF-7: imagen WebP/AVIF eficiente, responsive, dimensiones y alt | **Alcanzable:** el CDN de Sanity y `createResponsiveImage` actual entregan WebP, `srcset`, dimensiones y cap de 2000 px; `EditorialImage` declara dimensiones/alt. La calidad visual depende de la resolución del asset subido.
| RF-8: metadatos únicos y omisión de descripción ausente | **Alcanzable con el schema actual:** title con inventario validado y código de idioma, más canonical por ruta; meta description omitida. No existe ahora un campo para proporcionar description SEO de obra.
| RF-9: equivalencias y hreflang solo existentes | **Alcanzable:** `BaseLayout` acepta `alternatePaths`; las páginas los construyen solo desde traducciones mapeadas y series válidas.
| RF-10: datos estructurados factuales sin comercio | **Alcanzable:** JSON-LD `VisualArtwork` estático. Se verificará que no contiene propiedades de oferta, precio, compra, disponibilidad comercial ni prints.
| RF-11: sitemap de páginas e imágenes | **Alcanzable:** Astro estático puede emitir ambos XML en build a partir del catálogo publicado. Hay que coordinarlo con tareas T11/T12 pendientes de Spec 002.
| RF-12: fichas no publicadas/retiradas no expuestas | **Alcanzable en build estático:** no se generan sus rutas; verificar HTTP 404 en preview/deployment de Cloudflare Pages para rutas profundas ausentes.
| RF-13–RF-14: sin comercio y fidelidad editorial | **Alcanzable:** componentes sin acciones comerciales; mapper omite contenido incompleto y no deriva/traduce contenido.
| RNF-1–RNF-6: idiomas, AA, diseño, SEO, HTML sin JS e imágenes | **Alcanzable y verificable** con diccionarios existentes, tokens sólidos, HTML estático, alt localizado, JSON-LD y sitemaps.
| RNF-7: Lighthouse ≥90/95/100 | **Medible, no garantizable por Astro/Cloudflare solamente.** Validar en preview con contenido e imágenes representativos; si falla, corregir dentro de tokens y alcance aprobado, o reportar el incumplimiento sin darlo por terminado.

## Estrategia de verificación

1. **Vitest — dominio:** mantener/ejecutar pruebas existentes de `Availability`, `Dimensions`, `InventoryNumber` y completitud; fijar medidas inválidas/ausentes y comprobar que la presentación conserva el orden alto × ancho sin conversiones. Probar que inventarios duplicados rechazan el catálogo.
2. **Vitest — mappers/queries:** ampliar `mappers.test.ts` y `queries.test.ts` con fixtures ES completo + serie ES ausente, EN completo + serie EN ausente, traducción o alt EN ausente, estado inválido, imagen/alt inválidos, nota ES/EN independiente, nota legada solo ES, nota vacía y texto crítico asociado traducido/no traducido. Verificar que el caso ES inválido elimina ambos idiomas y que el caso EN incompleto conserva ES sin fallback.
3. **Vitest — salida build:** ejecutar `pnpm --dir web verify`; inspeccionar la salida `dist` para contenido server-rendered sin JS, title/canonical, ausencia de meta description cuando no hay campo editorial, hreflang bidireccional solo si ambas versiones existen, JSON-LD parseable sin propiedades comerciales y exclusión de rutas/imágenes no publicadas de XML. Ejecutar build con fixtures válidos e inválidos y comprobar que los gates son deterministas.
4. **Chrome DevTools:** revisar preview de producción en 375×812, 768 px y 1280×900; una ficha con título/inventario largos, cada estado, nota/textos críticos opcionales, ES y EN, y una EN ausente. Comprobar imagen `srcset`/formato/dimensiones/alt, HTML sin JS, foco/teclado, contraste, contenido íntegro y ausencia de scroll horizontal. Si el dataset de desarrollo no contiene obras representativas, usar fixture temporal de QA y retirarlo al terminar; nunca editar contenido Sanity de producción.
5. **Rutas e indexación:** solicitar una ficha válida ES/EN y un ID inexistente/retirado en Cloudflare Pages preview; confirmar estado 404 sin redirección. Validar ambos XML y alternates en navegador/XML parser y confirmar que ninguna ruta de traducción ausente figura en HTML, JSON-LD o sitemap.
6. **Lighthouse manual:** en móvil y preview desplegado, ejecutar sobre fichas ES y EN representativas. Criterios: rendimiento ≥90, accesibilidad ≥95 y SEO 100. Registrar resultados; son bloqueantes de finalización según spec, aunque no estén garantizados por la plataforma de antemano.

## Cobertura de requisitos

| Requisito | Cobertura principal |
|---|---|
| RF-1–RF-2 | `ArtworkContent`, `ArtworkTechnicalSheet`, `InventoryBadge` y `EditorialImage`; mappers para campos obligatorios y dimensiones alto × ancho.
| RF-3 | `ArtworkContent`, `ArtworkCriticalTexts`, nota por traducción en Studio/query/mapper; omisión de opcionales vacíos o sin idioma.
| RF-4 | `ArtworkTechnicalSheet` + `AvailabilityLabel` y diccionarios ES/EN.
| RF-5–RF-6 | Mapper con gate de serie ES/EN y rutas estáticas de cada idioma; tests de mappers.
| RF-7 | `EditorialImage` + `createResponsiveImage`; sitemap de imágenes.
| RF-8 | Metadatos de rutas; title incluye título, inventario e idioma; description omitida si no hay texto SEO autoral.
| RF-9 | `BaseLayout` con `alternatePaths` de las traducciones y series publicadas.
| RF-10 | JSON-LD `VisualArtwork` factual emitido por las rutas, sin datos comerciales.
| RF-11 | `sitemap.xml.ts`, `image-sitemap.xml.ts` y pruebas de salida; coordinación con Spec 002 T11–T12.
| RF-12 | Solo `getStaticPaths` elegibles + 404 Cloudflare Pages verificada en preview.
| RF-13 | Revisión de `ArtworkContent`, JSON-LD, sitemap y salida para asegurar que no hay compra/checkout/precio/promesa de prints.
| RF-14 | Validadores/mappers existentes, filtros por idioma y omisión de datos; sin contenido inventado ni inferido.
| RNF-1–RNF-7 | Diccionarios, etiquetas/tokens AA, salida Astro estática, metadatos/hreflang, imágenes y verificación Chrome DevTools/Lighthouse.

La fase siguiente es redactar/revisar `tasks.md` solo tras aprobación explícita de este plan; las tareas de schema/tipo y la interpretación del campo legado requieren además la autorización indicada arriba.
