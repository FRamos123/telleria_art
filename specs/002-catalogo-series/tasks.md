# Tareas — Spec 002

> Cada tarea está acotada a 20–30 minutos. T10 se desbloqueó tras aprobarse el plan de Spec 003.
> T17–T19 son una propuesta pendiente de aprobación junto con `spec.md` y `plan.md`; no iniciar implementación hasta aprobarlos.

- [x] **T1. Preparar la carga de contenido visible por idioma.** RF-1, RF-4, RF-6–RF-8, RF-11–RF-12
  - Hecho cuando: el cargador de build reutiliza las consultas y `mapSanityContent`; Vitest comprueba visibilidad por idioma, relaciones conservadas y ausencia de fallback o revalidación en las páginas.
  - Verificación TDD: el test falló inicialmente porque `catalog-content.ts` no existía; tras añadirlo, el test pasó. `pnpm --dir web verify` pasó (lint, tipos, build estático y 219 tests).
  - Decisión no detallada en el plan: `loadCatalogContent` acepta un cliente Sanity y año actual opcionales para hacer pruebas deterministas; por defecto usa el cliente publicado existente y el año actual. No añade dependencias ni revalida el contenido fuera de `mapSanityContent`.

- [x] **T2. Ordenar obras por año e inventario.** RF-2
  - Hecho cuando: Vitest comprueba año descendente, `InventoryNumber` ascendente en empates y orden determinista.
  - Verificación TDD: el test falló inicialmente porque `catalog-presentation.ts` no existía; implementada `sortArtworksForCatalog`, las 3 pruebas enfocadas y `pnpm --dir web verify` pasan (lint, tipos, build y 222 tests).
  - Decisión no detallada en el plan: la función devuelve una copia ordenada para no mutar el catálogo de entrada y conserva el orden original cuando año e inventario empatan, haciendo explícito el comportamiento estable.

- [x] **T3. Completar mensajes i18n del catálogo y estados.** RF-8–RF-10, RF-13, RF-19, RNF-1
  - Hecho cuando: ES y EN tienen mensajes de catálogo vacío y plantilla SEO localizada; Vitest comprueba paridad y etiqueta correcta para los cuatro estados en ambos idiomas.
  - Verificación TDD: el test falló inicialmente porque faltaban `catalogEmpty` y `seriesMetaDescriptionTemplate`; añadidos ambos mensajes para ES/EN y pruebas para sus textos, paridad de claves y las ocho etiquetas de disponibilidad. `pnpm --dir web verify` pasó (lint, tipos, build y 224 tests).
  - Decisión no detallada en el plan: el texto funcional vacío quedó como «No hay obras que mostrar en este idioma.» / “There are no artworks to show in this language.” y las plantillas SEO usan `{seriesName}` y `{artistName}`; son mensajes del sistema, no contenido editorial.

- [x] **T4. Derivar meta descriptions y validar unicidad.** RF-14
  - Hecho cuando: Vitest verifica descripción de serie de hasta 155 caracteres en límite de palabra, plantilla cuando falta descripción editorial y error por títulos o meta descriptions duplicados.
  - Verificación TDD: las pruebas fallaron inicialmente porque no existían `deriveSeriesMetaDescription` ni `assertUniqueSeoMetadata`; implementadas ambas funciones, pasan las 10 pruebas enfocadas y `pnpm --dir web verify` (lint, tipos, build y 231 tests).
  - Decisión no detallada en el plan: si una descripción supera 155 caracteres y no contiene ningún espacio, se corta en 155 puntos de código Unicode para mantener el límite sin romper pares sustitutos. Una descripción editorial vacía o solo con espacios se trata como ausente.

- [x] **T5. Emitir canonical, hreflang y selector equivalentes por página.** RF-8, RF-14, RNF-1, RNF-5
  - Hecho cuando: canonical y alternates usan la ruta actual y solo enlazan versiones publicadas; catálogo ES/EN mantiene su equivalencia incluso vacío.
  - Verificación: `pnpm --dir web verify` pasó (lint, tipos, build y 231 tests). Las homes ES/EN del build tienen canonical, alternates ES/EN y selector equivalentes; la 404 conserva enlaces a ambas homes sin canonical ni hreflang. No se comparó visualmente en Chrome DevTools: no hay MCP/herramienta Chrome disponible en esta sesión y el cambio no altera la composición visual.
  - Alcance pendiente de integración: las rutas del catálogo todavía no existen (T8); al crearlas deben proporcionar ambas rutas para conservar la equivalencia aunque no haya obras visibles.

- [x] **T6. Aplicar tokens de Availability y reglas de imagen.** RF-10, RF-12, RF-18–RF-19, RNF-2, RNF-6, RNF-8
  - Hecho cuando: cada estado usa su color token y etiqueta textual, no aparece adquisición, y `EditorialImage` conserva alt/dimensiones y admite carga diferida salvo imagen principal visible.
  - Verificación: las pruebas de contrato de componentes fallaron antes del cambio y pasan después. `pnpm --dir web verify` pasó (lint, tipos, build estático y 233 tests). En Chrome DevTools, un fixture temporal se comparó a 375 px y 1280 px con la captura y tokens de `design/`; estados con color y texto, imagen con alt/dimensiones, carga eager de la principal y sin scroll horizontal. Fixture retirado.
  - Decisión no detallada en el plan: `EditorialImage` usa `loading="lazy"` por defecto; las imágenes principales actuales de obra, serie y exposición declaran `loading="eager"`. Las imágenes de tarjeta que se añadan en T7 quedan lazy por defecto.

- [x] **T7. Crear tarjetas y bloque de series visibles.** RF-1–RF-3, RF-5–RF-6, RF-10–RF-12, RF-18–RF-19
  - Hecho cuando: la tarjeta contiene solo imagen, título, año y estado; enlaza a la ficha y no tiene acción comercial; Vitest cubre los cuatro estados × ES/EN comprobando etiqueta correcta y ausencia de adquisición, y el bloque de series enlaza destinos visibles sin filtro.
  - Verificación: los contratos nuevos fallaron antes de crear los componentes y después pasan; 12 pruebas de componentes (incluidas las ocho combinaciones de Availability) y `pnpm --dir web verify` pasan (lint, tipos, build estático y 243 tests). Chrome DevTools comparó fixture temporal con la captura de `design/` a 375×812 y 1280×900: datos visibles, tarjetas en una/ tres columnas, enlaces identificables y sin scroll horizontal; fixture retirado.
  - Decisión aprobada no detallada en el plan: `ArtworkCard` recibe el `href` local como prop en vez de construir la ruta de ficha, para dejar el contrato pendiente de Spec 003 a cargo de su integración; `SeriesDirectory` recibe solo la lista visible del idioma y omite destinos vacíos o no locales. El patrón se registró en `design/tokens.md` sin crear tokens.

- [x] **T8. Generar rutas estáticas de catálogo ES/EN.** RF-1–RF-3, RF-8–RF-9, RF-11, RF-14, RF-16, RF-18–RF-19, RNF-1, RNF-4
  - Hecho cuando: ambas rutas se generan aun sin obras, muestran únicamente obras visibles en orden definido y presentan el estado vacío localizado cuando corresponda.
  - Verificación: las pruebas nuevas fallaron primero porque aún no existían el componente/rutas; tras implementarlos, ambas rutas se generaron desde el dataset de desarrollo y mostraron su estado vacío localizado. `pnpm --dir web verify` pasó (lint, tipos, build y 248 tests). Chrome DevTools revisó ES a 375×812 y EN a 1280×900, comparadas con la captura disponible y los tokens de `design/`: sin overflow, con textos localizados y alternates correctos. El dataset no contiene obras, así que no se repitió la inspección visual de tarjetas ya hecha en T7.
  - Decisión no detallada en el plan: los títulos funcionales quedaron como «Obras — Alejandro Fernández Tellería» / “Works — Alejandro Fernández Tellería”; se declaran en i18n. Se omite la meta description del catálogo porque no hay texto descriptivo aprobado, según RF-14.

- [x] **T9. Generar páginas de serie y CollectionPage.** RF-4–RF-8, RF-10–RF-15, RF-18–RF-19
  - Hecho cuando: solo se emiten series visibles; contenido opcional e imagen ausente se omiten; se muestran sus obras visibles ordenadas, enlace de vuelta y datos `CollectionPage` de esa colección localizada.
  - Verificación TDD: las pruebas de rutas, presentación y proyección de imágenes fallaron primero (faltaban las páginas, el enlace localizado y las proyecciones conservadas); después pasaron las 22 pruebas enfocadas. `pnpm --dir web verify` pasó: lint, tipos, build y 253 tests. El dataset `development` no tiene series visibles, por lo que el build generó correctamente cero páginas de serie. Un fixture temporal se comparó en Chrome DevTools con la captura disponible a 375×812 y 1280×900: sin scroll horizontal, tarjetas en una/tres columnas, datos y estados legibles; el JSON-LD se parseó como `CollectionPage` con `ItemList` localizada. Fixture retirado.
  - Decisión no detallada en el plan: el mapper descarta la proyección de imagen de serie tras validar visibilidad. `loadCatalogContent` ahora conserva en infraestructura las proyecciones solo cuando una serie visible tiene esa imagen publicada; el modelo público y la regla de visibilidad no cambian. Se añadió el mensaje i18n «Volver al catálogo» / “Back to works” para el enlace de retorno.
  - Seguimiento (2026-10-09): con la serie y obra de prueba publicadas en `development`, el build detectó que Astro no cierra `getStaticPaths` sobre `locale` del frontmatter. Se añadió una prueba que fallaba y se declaró `locale` dentro de las dos funciones de ruta de serie; `pnpm --dir web verify` pasó y generó ambas páginas ES/EN. Chrome confirmó 200 y sin overflow a 375×812 y 1280×900.

- [x] **T10. Integrar rutas de ficha, VisualArtwork y 404 con Spec 003.** RF-5–RF-6, RF-15, RF-17
  - Hecho cuando: los enlaces usan el contrato de rutas de Spec 003, la ficha emite `VisualArtwork` con todos los datos de RF-15 y las rutas de fichas no visibles responden 404 sin redirección.
  - Verificación: el test de contrato falló primero al faltar `dateCreated`; añadido, pasaron los tests. La comprobación posterior con la obra publicada en `va9sgl77/development` descubrió que GROQ/mappers pedían `height`/`width` aunque el schema guarda `heightCm`/`widthCm`, y que `getStaticPaths` no puede cerrar sobre `locale` del frontmatter. Tests nuevos demostraron ambos fallos; corregidos, `pnpm --dir web verify` pasó (lint, tipos, build estático y 274 tests) y generó ficha/serie ES/EN. Chrome DevTools verificó fichas ES/EN a 375×812 y 1280×900: HTTP 200, imagen cargada con alt, JSON-LD `VisualArtwork` localizado y sin overflow. El JSON-LD contiene año, dimensiones 48×70 cm e imagen y no contiene datos comerciales. Las rutas no publicadas ES/EN responden HTTP 404 con la página bilingüe y sin redirección.
  - Decisiones/correcciones no detalladas en el plan: `dateCreated` serializa `artwork.year` como cadena (`YYYY`), sin inventar día/mes; GROQ y mapper usan los nombres reales del schema de dimensiones; cada `getStaticPaths` declara su locale constante localmente, requerido por la generación estática de Astro.

- [x] **T11. Generar sitemap de páginas y alternates.** RF-8, RF-14, RF-16
  - Hecho cuando: el XML incluye catálogo, series y fichas visibles por idioma con alternates solo para versiones publicadas y pasa sus comprobaciones.
  - Verificación: TDD: las tres pruebas del serializador fallaron primero por no existir el módulo; tras implementarlo pasan junto con `pnpm --dir web verify` (lint, tipos, build estático y 278 tests). El build de `va9sgl77/development` generó `sitemap.xml` con catálogo ES/EN y la serie/ficha publicada en ambos idiomas; las pruebas cubren versiones sin traducción, alternates solo publicados y escape XML.
  - Decisión de implementación no detallada en el plan: el serializador y sus pruebas viven en `web/src/infrastructure/` porque Astro interpreta cualquier `.ts` de `pages/` como ruta. El sitemap se limita a catálogo, series y fichas conforme al alcance de RF-16 de Spec 002; no añade las homes. Revisar esa decisión durante la coordinación pendiente de sitemap de Spec 003, sin ampliar esta tarea.

- [x] **T12. Generar sitemap de imágenes.** RF-12, RF-16
  - Hecho cuando: aparecen imágenes principales de obras visibles y solo imágenes de serie existentes y válidas; una imagen opcional ausente no causa error.
  - Verificación TDD: las pruebas fallaron primero al no existir el generador; implementado `image-sitemap.xml`, pasan las 2 pruebas enfocadas y `pnpm --dir web verify` (lint, tipos, build estático y 281 tests). El build de `va9sgl77/development` emitió la imagen WebP transformada de la obra visible y la imagen válida de serie; las pruebas cubren serie sin imagen, proyección de serie inválida y sitemap vacío.
  - Decisión no detallada en el plan: cada obra/serie añade una única entrada asociada a su ruta española, ya que la misma imagen principal se comparte entre idiomas. Se utiliza la URL WebP mayor de `createResponsiveImage`; cualquier error al transformar una imagen opcional de serie la omite sin bloquear el build.

- [x] **T13. Conectar el detector de metadatos duplicados al build.** RF-14, RNF-5
  - Hecho cuando: páginas públicas ES/EN registran sus títulos y descripciones y un duplicado detiene el build; los metadatos ausentes se excluyen de la comparación.
  - Verificación TDD: las pruebas fallaron primero al faltar la integración; el hook `astro:build:done` ahora lee la salida HTML y delega en `assertUniqueSeoMetadata`. Pruebas del hook confirman fallo para títulos/descripciones duplicados y exclusión de 404 y metadatos ausentes. `pnpm --dir web verify` pasó (lint, tipos, build y 284 tests) con el dataset `va9sgl77/development`.
  - Decisión no detallada en el plan: el registro se obtiene escaneando el HTML estático final en vez de duplicar los metadatos en un registro mutable compartido por rutas; así incluye home, catálogo, series y fichas efectivamente generadas. La integración está en `.mjs` por sus APIs nativas de Node sin tipos instalados, y Vitest amplía su patrón para descubrir esa prueba; no se añadieron dependencias.

- [x] **T14. Verificar salida estática, JSON-LD, sitemaps y 404.** RF-15–RF-17, RNF-4–RNF-5
  - Hecho cuando: Vitest confirma HTML sin JS, JSON-LD parseable, sitemaps válidos y alternates publicados, exclusión de páginas no visibles y contenido bilingüe en la salida 404; `pnpm --dir web verify` pasa.
  - Verificación: `build-output.test.ts` inspecciona home, catálogos y todas las rutas del sitemap en HTML estático; parsea JSON-LD con `JSON.parse`, comprueba XML bien formado, alternates y destinos existentes, omisión de rutas no visibles y salida 404 bilingüe. `pnpm --dir web verify` pasó con `va9sgl77/development` (lint, tipos, build y 286 tests en 22 suites).
  - Decisión no detallada en el plan: para validar XML sin añadir una dependencia, la prueba comprueba declaración, raíz única, anidamiento, atributos, entidades y enlaces del vocabulario sitemap; JSON-LD se valida con el parser JSON nativo.

- [x] **T15. Revisar catálogo y tarjetas en Chrome DevTools.** RF-1–RF-3, RF-8–RF-10, RF-18–RF-19, RNF-2–RNF-3, RNF-8
  - Hecho cuando: a 375, 768 y 1280 px, con contenido mínimo y máximo, los cuatro datos de cada tarjeta son visibles sin recorte, solape ni scroll horizontal; enlaces identificables y estados perceptibles sin depender solo del color.
  - Verificación: Chrome DevTools comparó `/obras/` con los tokens, patrón de tarjeta y captura disponible a 375×812, 768×900 y 1280×900. El contenido real y un fixture DOM temporal de cinco tarjetas con títulos extensos/no espaciados, nombre de serie largo y los cuatro estados mostraron una, dos y tres tarjetas por fila según ancho; sin overflow ni recortes, con título/año/estado visibles y texto de Availability. Enlaces subrayados y nombres accesibles; el foco de teclado muestra contorno accent de 2 px. El fixture se descartó al recargar; no se tocó Sanity. `pnpm --dir web verify` pasó (lint, tipos, build y 286 tests en 22 suites).
  - Decisión de verificación no detallada en el plan: el dataset de desarrollo solo ofrece una obra, por lo que el caso máximo se comprobó clonando tarjetas en el DOM de Chrome sin persistir contenido ni modificar archivos. No hay captura específica del catálogo en `design/`; la comparación visual usó la captura general disponible y los patrones/tokens de `design/tokens.md`.

- [x] **T16. Revisar páginas de serie, navegación y accesibilidad.** RF-4–RF-8, RF-12–RF-13, RF-17, RNF-1–RNF-3
  - Hecho cuando: Chrome confirma contenido localizado sin fallback, omisión de descripción/imagen opcionales, uso por teclado, retorno al catálogo y HTTP 404 sin redirección para rutas ausentes.
  - Verificación: Chrome DevTools revisó series ES/EN a 375×812 y 1280×900, cotejadas con la captura disponible y los tokens/patrón de ficha. Textos, enlace de retorno, alternates y alt de imagen corresponden al idioma; no hubo overflow. Por teclado, el foco llega a «Back to works» con outline de 2 px y Enter abre `/en/works/`. Dos rutas de serie inexistentes devolvieron HTTP 404, sin redirección, y contenido ES/EN. `pnpm --dir web verify` pasó (lint, tipos, build y 286 tests en 22 suites).
  - Decisión de verificación no detallada en el plan: como la serie publicada de `development` sí tiene descripción e imagen en ambos idiomas, simulé su ausencia eliminando esos nodos en el DOM EN y ajustando el span del contenedor al caso sin imagen; no se publicó ni modificó contenido. La captura específica de serie no existe en `design/`, por lo que se cotejó con la captura general disponible y el patrón de ficha descrito en tokens.

- [ ] **T17. Añadir los campos globales de descripción SEO del catálogo a Sanity Studio.** RF-20, RNF-1
  - Hecho cuando: Studio presenta un único documento de configuración global con campos opcionales e independientes ES/EN; puede dejarse vacío sin bloquear el build; `pnpm --dir studio build` pasa. No se redacta ni se publica contenido.

- [ ] **T18. Consultar y emitir la descripción SEO global del catálogo por idioma.** RF-14, RF-20, RNF-1, RNF-5
  - Hecho cuando: las pruebas fallan primero y luego pasan para descripción ES/EN independiente, ausencia sin fallback y HTML que solo emite el texto publicado en el idioma actual; `pnpm --dir web verify` pasa.
  - Decisión propuesta no detallada en el plan aprobado: mantener el texto en un único `siteSettings` singleton de Sanity y no dentro de obra/serie; resolver la consulta durante el build, no desde el cliente.

- [ ] **T19. Ejecutar Lighthouse y revisar pesos orientativos.** RNF-6–RNF-7
  - Hecho cuando: con descripciones ES/EN aprobadas y cargadas en `development`, catálogo ES, ficha ES y serie ES en preview móvil alcanzan rendimiento ≥ 90, accesibilidad ≥ 95 y SEO = 100; los pesos se registran como objetivos no bloqueantes.
  - Bloqueo actual (2026-10-09): el catálogo ES obtuvo Accesibilidad 100 y SEO 92 por la meta description ausente, que RF-14 anterior ordena omitir. La recomendación del usuario habilita proponer el setting global, pero falta aprobar estos documentos y disponer del texto SEO ES aprobado/publicado en `development`. El MCP Lighthouse disponible excluye la puntuación Performance y no hay CLI instalada; T19 necesita una herramienta que reporte esa categoría antes de certificar ≥90. No cambiar contenido ni umbrales para forzar un pase.

## Propuesta de división

El desglose propuesto tiene 19 tareas, por encima del máximo recomendado de 10. Se propone separar **exploración y páginas de catálogo/serie** (T1–T9) de **fichas, SEO/indexación e integración final** (T10–T19). T10 ya depende de la Spec 003; esta modificación de alcance sigue pendiente de aprobación antes de implementar T17–T19.
