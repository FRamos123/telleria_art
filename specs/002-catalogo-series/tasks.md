# Tareas — Spec 002

> Cada tarea está acotada a 20–30 minutos. T10 depende de la aprobación de la Spec 003 y su plan; no iniciar esa tarea antes.

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

- [ ] **T10. Integrar rutas de ficha, VisualArtwork y 404 con Spec 003.** RF-5–RF-6, RF-15, RF-17
  - Hecho cuando: tras aprobarse Spec 003 y su plan, los enlaces usan su contrato de rutas, la ficha emite `VisualArtwork` con todos los datos de RF-15 y las rutas de fichas no visibles responden 404 sin redirección. **Bloqueada hasta esa aprobación.**

- [ ] **T11. Generar sitemap de páginas y alternates.** RF-8, RF-14, RF-16
  - Hecho cuando: el XML incluye catálogo, series y fichas visibles por idioma con alternates solo para versiones publicadas y pasa sus comprobaciones.

- [ ] **T12. Generar sitemap de imágenes.** RF-12, RF-16
  - Hecho cuando: aparecen imágenes principales de obras visibles y solo imágenes de serie existentes y válidas; una imagen opcional ausente no causa error.

- [ ] **T13. Conectar el detector de metadatos duplicados al build.** RF-14, RNF-5
  - Hecho cuando: páginas públicas ES/EN registran sus títulos y descripciones y un duplicado detiene el build; los metadatos ausentes se excluyen de la comparación.

- [ ] **T14. Verificar salida estática, JSON-LD, sitemaps y 404.** RF-15–RF-17, RNF-4–RNF-5
  - Hecho cuando: Vitest confirma HTML sin JS, JSON-LD parseable, sitemaps válidos y alternates publicados, exclusión de páginas no visibles y contenido bilingüe en la salida 404; `pnpm --dir web verify` pasa.

- [ ] **T15. Revisar catálogo y tarjetas en Chrome DevTools.** RF-1–RF-3, RF-8–RF-10, RF-18–RF-19, RNF-2–RNF-3, RNF-8
  - Hecho cuando: a 375, 768 y 1280 px, con contenido mínimo y máximo, los cuatro datos de cada tarjeta son visibles sin recorte, solape ni scroll horizontal; enlaces identificables y estados perceptibles sin depender solo del color.

- [ ] **T16. Revisar páginas de serie, navegación y accesibilidad.** RF-4–RF-8, RF-12–RF-13, RF-17, RNF-1–RNF-3
  - Hecho cuando: Chrome confirma contenido localizado sin fallback, omisión de descripción/imagen opcionales, uso por teclado, retorno al catálogo y HTTP 404 sin redirección para rutas ausentes.

- [ ] **T17. Ejecutar Lighthouse y revisar pesos orientativos.** RNF-6–RNF-7
  - Hecho cuando: en móvil y preview de producción, catálogo ES, ficha ES y serie ES alcanzan rendimiento ≥ 90, accesibilidad ≥ 95 y SEO = 100; los pesos se registran como objetivos no bloqueantes.

## Propuesta de división

El desglose verificable requiere 17 tareas, por encima del máximo recomendado de 10. Se propone separar **exploración y páginas de catálogo/serie** (T1–T9) de **fichas, SEO/indexación e integración final** (T10–T17). T10 ya depende de la Spec 003; cualquier división formal requiere actualizar y aprobar los alcances y planes afectados antes de implementar.
