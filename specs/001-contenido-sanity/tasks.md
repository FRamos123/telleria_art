# Tareas — Spec 001

> La implementación se mantiene en esta única spec, aunque el desglose tenga 28 tareas. No iniciar tareas que cambien dependencias, schemas de Sanity o tipos públicos del dominio hasta recibir la aprobación indicada en AGENTS.md.
> Tras la reorganización, el sitio vive en `web/` y el Studio en `studio/`; los comandos y rutas de esta lista están normalizados al layout actual. Las verificaciones registradas son históricas, salvo que se indique una verificación posterior.

- [x] **T1. Confirmar aprobaciones y límites de implementación.** RF-1–RF-22
  - Hecho cuando: quedan aprobados explícitamente los cambios de dependencias, schemas y tipos públicos; queda documentado que RF-10 garantiza unicidad del catálogo publicado mediante el control de build descrito en el plan, no unicidad transaccional del Content Lake.
  - Aprobación explícita del usuario: dependencias de Sanity/imagen/Studio (T2), schemas y validaciones Sanity (T12–T17), y tipos públicos/value objects del dominio.
  - Decisión RF-10 confirmada: se garantiza unicidad del catálogo publicado en build; no unicidad transaccional en Content Lake.

- [x] **T2. Crear el esqueleto de Sanity Studio y fijar sus dependencias.** RF-1–RF-22
  - Hecho cuando: `studio/package.json`, configuración y lockfile permiten arrancar Studio con `pnpm --dir studio dev`; no hay secretos ni dataset de producción versionados.
  - Decisiones de implementación: se añadió `studio/sanity.cli.ts` porque Sanity 6.18 lo requiere para `dev`/`build`, aunque no figure en la tabla de archivos del plan. El config usa valores locales de reserva (`local-project`/`local`) y admite configuración mediante variables de entorno; no se versionan credenciales ni un ID/dataset de producción.
  - La verificación web corre dentro de `web/` (`pnpm --dir web verify`) y no incluye el paquete Studio; los artefactos del Studio se generan en `studio/dist/`.

- [x] **T3. Implementar `Availability` y `Dimensions` con TDD.** RF-9, RF-12
  - Hecho cuando: Vitest demuestra primero el fallo de los casos de estados permitidos/prohibidos y dimensiones positivas con hasta un decimal; tras implementar, pasan y rechazan valores inválidos.
  - Decisión de implementación (el plan no fija la API): `isAvailability` es un guard de tipo para los cuatro estados y `createDimensions` devuelve dimensiones válidas o `undefined`; los valores de dimensión deben ser números finitos positivos.
  - Verificación TDD: las pruebas fallaron antes de crear los módulos; después pasaron 26 casos para estados y dimensiones.

- [x] **T4. Implementar `InventoryNumber` con TDD.** RF-10
  - Hecho cuando: Vitest falla primero y luego pasa para formato, año 1900–año actual y secuencias 001–999, incluyendo los límites y casos inválidos.
  - Decisión de implementación (el plan no fija la API): `createInventoryNumber(value, currentYear)` devuelve el valor validado con tipo `InventoryNumber` o `undefined`; el año actual se recibe explícitamente para que los límites sean deterministas.
  - Verificación TDD: las pruebas fallaron antes de crear el módulo; después pasaron 15 casos. `pnpm --dir web verify` pasó (lint, tipos, build y 45 tests).

- [x] **T5. Implementar validación de fechas de exposición con TDD.** RF-6
  - Hecho cuando: Vitest falla primero y luego pasa para día real de calendario, inicio obligatorio, fin opcional y fin no anterior al inicio.
  - Decisión de implementación (el plan no fija la API): `CalendarDate` es una fecha ISO `YYYY-MM-DD` validada por `createCalendarDate`; `createExhibitionDates` requiere un inicio válido, admite el fin omitido (`undefined`) y rechaza fechas inválidas o un fin anterior al inicio.
  - Verificación TDD: las pruebas fallaron antes de crear el módulo; después pasaron 27 casos.

- [x] **T6. Implementar completitud de obras y texto alternativo con TDD.** RF-1–RF-3, RF-9, RF-11–RF-13, RF-22
  - Hecho cuando: los tests primero fallan y luego verifican campos compartidos/localizados, imagen principal existente, alt no vacío/≤150/distinto del título y campos opcionales omitidos si son inválidos; ningún dato ausente se inventa.
  - Decisión de implementación (el plan no fija la API): `checkArtworkCompleteness(input, currentYear)` valida los datos compartidos y una traducción a la vez, y devuelve `complete`, errores por campo y opcionales normalizados. La imagen se representa mediante un `mainImage.assetId` no vacío; el mapper deberá asegurar que el asset referenciado existe en Sanity. Los IDs de textos críticos inválidos se omiten individualmente; la nota vacía/inválida y una lista inválida se normalizan a ausentes. El límite del alt cuenta puntos de código Unicode.
  - Verificación TDD: los tests fallaron antes de crear `completeness.ts`; después pasaron 23 casos. `pnpm --dir web verify` pasó (lint, tipos, build y 95 tests).

- [x] **T7. Implementar completitud de series y exposiciones con TDD.** RF-4–RF-7, RF-11, RF-13, RF-15
  - Hecho cuando: los tests primero fallan y luego verifican español obligatorio, requisitos EN, fechas, asociaciones opcionales e imagen/alt opcionales inválidos normalizados a ausentes.
  - Decisión de implementación (el plan no fija la API): `checkSeriesCompleteness(input)` y `checkExhibitionCompleteness(input)` reciben los campos compartidos y una traducción cada vez. Ambas validan los campos obligatorios de esa traducción; la elegibilidad que exige ES antes de publicar EN queda para T9. El alt de la imagen opcional va en la traducción y solo se conserva junto a un `assetId` no vacío y alt válido; el mapper deberá comprobar la existencia real del asset. Las referencias opcionales inválidas se omiten individualmente y un fin de exposición vacío se normaliza a ausente (RF-13).
  - Verificación TDD: los 33 tests fallaron antes de añadir las funciones; después pasaron 37 casos de T7 (60 junto con T6). `pnpm --dir web verify` pasó (lint, tipos, build y 132 tests).

- [x] **T8. Implementar completitud de textos críticos con TDD.** RF-7, RF-8, RF-13, RF-16, RF-22
  - Hecho cuando: los tests primero fallan y luego verifican idioma original ES/EN, título/cuerpo/autor obligatorios, original EN sin traducción ES y traducción opcional omitida si incompleta, sin fallback ni contenido inventado.
  - Decisión de implementación (el plan no fija la API): `checkCriticalTextCompleteness(input)` recibe `originalLanguage: 'es' | 'en'` y traducciones independientes indexadas por idioma; devuelve el original solo si está completo y conserva la traducción secundaria solo si también está completa. Usa cadenas para título/cuerpo/autor, y normaliza las asociaciones opcionales a listas de IDs no vacíos. Si el original es inválido, no emite ninguna traducción ni relación.
  - Verificación TDD: los 19 tests fallaron antes de añadir la función; después pasaron. `pnpm --dir web verify` pasó (lint, tipos, build y 151 tests).

- [x] **T9. Implementar elegibilidad de publicación y borradores por idioma con TDD.** RF-14–RF-17, RF-19
  - Hecho cuando: los tests primero fallan y luego prueban publicación explícita, conservación de publicación previa durante edición, ES obligatorio para obra/serie/exposición, EN independiente, crítico publicado desde su idioma original y retirada localizada al despublicar o perder completitud.
  - Decisión de implementación (el plan no fija la API): `transitionPublication(kind, state, action, originalLanguage?)` conserva por idioma contenido publicado y borradores con `complete`/`errors`. `saveDraft` nunca publica; `publish` afecta solo al idioma solicitado y devuelve los errores de una versión incompleta; `reconcile` retira versiones publicadas cuya completitud cambió. Para obra/serie/exposición, EN requiere ES ya publicado; para texto crítico, la traducción requiere el original publicado. Despublicar ES o la versión original retira sus dependientes, sin borrar borradores.
  - Verificación TDD: la suite inicial de 26 tests falló antes de crear `publication.ts`; tras implementar y ampliar los casos, pasan 30. `pnpm --dir web verify` pasó (lint, tipos, build y 181 tests).

- [x] **T10. Implementar visibilidad de series y relaciones con TDD.** RF-5, RF-7, RF-18, RF-19, RF-22
  - Hecho cuando: los tests primero fallan y luego verifican serie visible solo con obra visible en el mismo idioma, relación oculta sin enlace a destino no visible, relación conservada y reaparición automática al recuperar visibilidad.
  - Decisión de implementación (el plan no fija la API): `isSeriesVisible` recibe los IDs de series publicadas y las obras visibles por idioma; `filterVisibleRelations` devuelve solo IDs con destino visible en el idioma solicitado, sin mutar las relaciones de origen. El llamador aporta versiones publicadas/completas y vuelve a evaluar tras cambios de visibilidad.
  - Verificación TDD: los tests fallaron antes de crear `visibility.ts`; después pasaron 5 casos. `pnpm --dir web verify` pasó (lint, tipos, build y 186 tests).

- [x] **T11. Implementar comprobación de inventarios duplicados con TDD.** RF-10
  - Hecho cuando: Vitest demuestra primero el fallo y luego pasa para catálogo único y duplicado, indicando los IDs/valores duplicados; la comprobación puede bloquear el build antes de publicar una salida inválida.
  - Decisión de implementación (el plan no fija la API): `findDuplicateInventoryNumbers` devuelve cada número duplicado con todos sus IDs de obra; `assertUniqueInventoryNumbers` lanza un error descriptivo si hay duplicados, para que el gate del build pueda detener la salida.
  - Verificación TDD: los tests fallaron antes de crear `catalog-validation.ts`; después pasaron 4 casos. `pnpm --dir web verify` pasó (lint, tipos, build y 190 tests).

- [x] **T12. Crear campos compartidos reutilizables de Sanity.** RF-9, RF-11–RF-13
  - Hecho cuando: los tipos compartidos de dimensiones y disponibilidad están registrados en Studio; los builders reutilizables de referencias e imagen/alt se exportan para uso en schemas; `pnpm --dir studio build` valida el registro sin depender de documentos de tareas posteriores.
  - Decisión de alcance: T12 prepara y registra los campos compartidos, pero no requiere consumidores de documento. T13–T15 los consumirán al crear sus schemas; exigir ese consumo dentro de T12 invertiría la dependencia entre tareas.
  - Decisión de implementación (el plan no fija la API): `dimensionsType` y `availabilityType` se registran desde `schemaTypes/index.ts`; sus validaciones/options reutilizan `createDimensions`, `isAvailability` y `AVAILABILITY_VALUES` del dominio. `createReferenceField`, `createReferenceListField`, `createEditorialImageField` y `createLocalizedImageAltField` se exportan para los schemas de documentos. El alt opcional inválido produce advertencia, no bloquea publicación; el alt obligatorio reutiliza `isValidAlternativeText`.
  - Verificación TDD: los tests de valores de disponibilidad y validación exportada de alt fallaron antes de implementar; después pasaron. `pnpm --dir studio build` pasó y `pnpm --dir web verify` pasó (lint, tipos, build y 192 tests).

- [x] **T13. Crear schemas base Sanity de obra y traducción.** RF-1–RF-3, RF-9, RF-10, RF-12, RF-20, RF-22 (estructura base; la relación de RF-1 se completa en T14 y las asociaciones de RF-3 en T15)
  - Hecho cuando: el Studio representa datos compartidos de obra, una imagen principal, nota de taller opcional y documentos ES/EN independientes vinculados a la obra; no duplica textos críticos ni la línea catalográfica. La referencia a serie queda para T14 y las asociaciones a textos críticos para T15.
  - Decisión de secuencia aprobada por el usuario: crear primero los tipos destino antes de registrar sus referencias; T14 añadirá la referencia a serie y T15 las asociaciones a textos críticos sobre el schema de obra.
  - Decisión de implementación (el plan no fijaba la localización de la nota): `workshopNote` queda en el documento compartido de obra, de acuerdo con el modelo de dominio y porque la spec no exige traducciones de esa nota. El documento traducido referencia a una obra y requiere un idioma `es` o `en`; no asigna idioma por defecto.
  - Alcance de validación: obra y traducción marcan como requeridos los campos obligatorios; los rangos/formato del año e inventario se completarán en T16 y la unicidad en T17/build.
  - Verificación: `pnpm --dir studio build` pasó; `pnpm --dir web verify` pasó (lint, tipos, build y 192 tests).
  - Preview Chrome: la configuración de reserva `local-project` muestra “Project not found”; no se pudieron inspeccionar formularios a 375 px/escritorio ni comparar con capturas del sitio. No se creó un proyecto/dataset, conforme al plan.

- [x] **T14. Crear schemas Sanity de serie y exposición con traducciones.** RF-1, RF-4–RF-7, RF-11, RF-13, RF-15, RF-18
  - Hecho cuando: los documentos compartidos y traducidos aceptan los campos definidos, fechas/relaciones opcionales donde corresponde e imágenes opcionales sin convertirlas en requisito de publicación.
  - Extensión de T13: incorpora la referencia requerida de obra a serie una vez que el tipo `series` está registrado.
  - Decisión de implementación (el plan no fija todos los nombres del schema): las imágenes opcionales se guardan en los documentos compartidos y cada traducción guarda su `imageAlt`; las asociaciones de exposición usan `artworkIds` y `seriesIds`, alineados con el dominio. `startDate` es obligatorio, `endDate` opcional; la regla de orden de fechas se añade en T16.
  - Verificación: `pnpm --dir studio build` pasó; `pnpm --dir web verify` pasó (lint, tipos, build y 192 tests).
  - Preview Chrome: `local-project` devuelve “Project not found” también en viewport de 375 px y 1280 px; los formularios no se pueden cargar y las capturas `design/` corresponden al sitio público, no al Studio. No se creó un proyecto/dataset conforme al plan.

- [x] **T15. Crear schemas Sanity de textos críticos y asociaciones.** RF-3, RF-7, RF-8, RF-16, RF-18, RF-22
  - Hecho cuando: Studio registra idioma original y asociaciones opcionales, conserva el texto como pieza independiente y permite traducciones independientes sin duplicar su contenido en obras/series.
  - Extensión de T13: incorpora las asociaciones opcionales de obra a textos críticos una vez que el tipo `criticalText` está registrado.
  - Decisión de implementación (el plan no fija los nombres de campo): `criticalText` contiene `originalLanguage`, `artworkIds` y `seriesIds`; `criticalTextTranslation` referencia esa pieza y contiene `language`, `title`, `body` y `author`. `artwork.criticalTextIds` guarda la asociación inversa opcional. No se copia contenido crítico en obras ni series.
  - Decisión de implementación: se registró `structureTool()` estándar en `studio/sanity.config.ts`, sin añadir dependencias, porque el Studio autenticado mostraba “No configured tools”; así se habilita la navegación editorial prevista en el plan.
  - Verificación: `pnpm --dir studio build` pasó; `pnpm --dir web verify` pasó (lint, tipos, build y 192 tests).
  - Chrome DevTools: revisados `criticalText`, `criticalTextTranslation` y el campo `artwork.criticalTextIds` a 375 px y 1280 px. Se ven el idioma original sin valor por defecto, las dos listas de relaciones opcionales, y en la traducción la referencia obligatoria, idioma ES/EN, título, cuerpo y autoría. Sin desbordamiento horizontal; `Publish` permanece deshabilitado en los documentos vacíos. El dataset está vacío, por lo que las listas dicen “No documents of this type” y no se pudo probar la selección de destinos existentes. La incidencia temporal de “Trying to connect…” ya no se reprodujo. No se rellenó, guardó ni publicó contenido. El Studio estándar no usa los tokens del sitio.

- [x] **T16. Añadir validación editorial y feedback de publicación en Studio.** RF-1–RF-15
  - Hecho cuando: una sesión de prueba en dataset no productivo muestra errores de campos obligatorios/formato/rango y evita publicar desde el Studio una versión incompleta sin impedir publicar otra versión completa e independiente.
  - Decisión de implementación: Sanity no mostraba errores fiables para dimensiones parciales al validar solo el objeto; alto y ancho ahora tienen validación obligatoria propia y validan positividad/precisión. Los validadores de campo omiten valores realmente vacíos para que `required()` presente un solo error, mientras que los espacios en blanco siguen siendo inválidos.
  - Verificación Studio (`development`): año 1899, inventario vacío/mal formado, disponibilidad ausente y dimensiones 0/incompletas mostraron errores y bloquearon `Publish`; una traducción crítica incompleta mostró errores en idioma/título/cuerpo/autoría y `Publish` deshabilitado. Se publicó una traducción ES completa mientras había otra traducción incompleta independiente; los documentos de prueba fueron eliminados y ambas listas quedaron vacías.
  - Chrome DevTools: formulario Studio revisado a 375×812 y 1280×900; `scrollWidth` coincidió con el viewport, sin overflow. No se compara con las capturas del portfolio: Studio usa la UI estándar de Sanity y las capturas de `design/` son del sitio público, según el plan.
  - Verificación: `pnpm --dir studio build` pasó; `pnpm --dir web verify` pasó (lint, tipos, build y 192 tests).

- [x] **T17. Añadir validación de unicidad de inventario en Studio.** RF-10
  - Hecho cuando: una prueba en dataset no productivo avisa de un inventario ya usado; queda documentado que la validación asíncrona no es una restricción transaccional y el control de build sigue siendo obligatorio.
  - Decisión de implementación (el plan no fijaba la perspectiva de consulta): la validación consulta `perspective: 'drafts'` para considerar borradores y publicaciones, excluyendo el ID publicado y `drafts.<id>` de la propia obra. Los fallos de formato se resuelven antes de consultar.
  - Verificación: en `va9sgl77/development`, dos borradores temporales con `AFT-2026-998` hicieron que Studio mostrara «Este número de inventario ya está asignado a otra obra.»; ambos borradores se eliminaron tras la prueba. Esta consulta es asíncrona y no impide carreras ni mutaciones directas; `assertUniqueInventoryNumbers` en el gate de build sigue siendo obligatorio.
  - Verificación: `pnpm --dir studio build` y `pnpm --dir web verify` pasaron; web completó lint, tipos, build y 192 tests.

- [x] **T18. Crear cliente Sanity de build y consultas GROQ publicadas.** RF-5, RF-7, RF-14–RF-19, RNF-1
  - Hecho cuando: pruebas/inspección verifican perspectiva `published`, selección de entidades y traducciones publicadas y ausencia de credenciales/datos de borrador en consultas de producción.
  - Implementación: cliente `@sanity/client` 8.9.0 configurado con `perspective: 'published'`, CDN de lectura, API version `2025-02-19` y configuración de build por `SANITY_PROJECT_ID`/`SANITY_DATASET`; sin token. GROQ obtiene obras, series, exposiciones y textos críticos con traducciones enlazadas, IDs estables de relaciones y proyecciones de assets/dimensiones.
  - Decisión de implementación (el plan no fijaba API ni nombres de variables): se exponen `createBuildSanityClient`/`getBuildSanityClient`; el cliente se crea bajo demanda y falla claramente si falta project ID o dataset. La configuración de build usa `SANITY_PROJECT_ID` y `SANITY_DATASET` (no variables `PUBLIC_*`) para evitar exponer configuración de servidor al navegador.
  - Verificación: las pruebas de contrato fallaron inicialmente al faltar los módulos; después pasan. Verifican configuración published sin token, tipos de documento/traducción, referencias/assets y ausencia de selectores de borradores/credenciales. `pnpm --dir web verify` pasó (lint, tipos, build y 200 tests). No se ejecutaron consultas contra Sanity ni se modificó contenido; T18 no crea ni presenta interfaz.

- [x] **T19. Escribir primero tests de mappers Sanity → dominio.** RF-1–RF-22, RNF-4
  - Hecho cuando: Vitest falla con fixtures de documentos válidos, referencias/asset ausentes, idiomas incompletos, opcionales inválidos, relaciones ocultas y valores mal formados; todavía no se añade implementación del mapper en esta tarea.
  - Decisión de contrato (el plan no fijaba API): las pruebas llaman `mapSanityContent({ artworks, series, exhibitions, criticalTexts }, currentYear)` y esperan las colecciones mapeadas con traducciones indexadas por `es`/`en`; asociaciones de exposición y texto crítico quedan filtradas por destinos visibles en el idioma de cada traducción. La implementación sigue pendiente en T20.
  - Verificación TDD: Vitest ejecutó 11 casos y los 11 fallaron porque `mappers.ts` aún no existe; se mantiene rojo intencionadamente, sin añadir implementación. En `pnpm --dir web verify`, lint, tipos y build pasaron; Vitest pasó 200 tests existentes y falló estos 11 nuevos por el mismo motivo.

- [x] **T20. Implementar mappers y gate del catálogo.** RF-1–RF-22, RNF-1, RNF-4
  - Hecho cuando: pasan los tests de T19, los mappers no hacen fallback entre idiomas ni inventan datos y duplicados de inventario impiden generar una salida nueva.
  - Decisión de implementación (el plan no fija el caso de traducciones duplicadas por idioma): se omite un idioma ambiguo en vez de elegir arbitrariamente una traducción; si ES queda ambiguo, la entidad no se emite.
  - Implementación: `mapSanityContent(input, currentYear)` convierte los resultados publicados de las cuatro consultas, aplica validadores de dominio, normaliza opcionales e imágenes no resueltas, exige ES para obra/serie/exposición, conserva textos críticos desde su idioma original y filtra asociaciones por destinos visibles en cada idioma. El mapper ejecuta `assertUniqueInventoryNumbers` antes de devolver el catálogo.
  - Verificación TDD: antes de implementar, las 12 pruebas (11 de T19 y la prueba nueva del gate) fallaron al faltar `mappers.ts`; después pasan 13 casos, incluido el rechazo de inventario duplicado. La prueba de idioma ambiguo también falló al retirar temporalmente su descarte y volvió a pasar al restaurarlo. `pnpm --dir web verify` pasó (lint, tipos, build y 213 tests).

- [x] **T21. Añadir etiquetas i18n y su verificación automática.** RF-12, RF-20
  - Hecho cuando: Vitest confirma igualdad de claves y texto no vacío para disponible, reservada, vendida y en colección en ES y EN.
  - Decisión de implementación (el plan no fijaba los nombres de clave): se añadieron `availabilityAvailable`, `availabilityReserved`, `availabilitySold` y `availabilityInCollection` a ambos diccionarios; el test comprueba que cada etiqueta exista y no esté vacía. El test falló antes del cambio porque faltaban las claves.
  - Verificación: `pnpm --dir web verify` pasó (lint, tipos, build estático y 214 tests).

- [x] **T22. Crear generador de URL de imagen responsive con TDD.** RF-1, RF-4, RF-6, RF-11, RNF-3
  - Hecho cuando: los tests primero fallan y luego verifican WebP, respeto de crop/hotspot, anchos responsive no mayores de 2000 px y dimensiones explícitas derivadas del asset.
  - Decisión de implementación (el plan no fija API, anchos ni tratamiento de proporción): `createResponsiveImage(image, options)` acepta la proyección GROQ de imagen y configuración `projectId`/`dataset`, usa `@sanity/image-url` 2.1.1, y genera variantes de 320/640/960/1280/1600/2000 px limitadas por el recorte, el asset y 2000 px en el lado mayor. `aspectRatio` opcional activa el recorte de presentación con hotspot; `width`/`height` devueltos proceden de las dimensiones fuente del asset.
  - Límite de integración detectado: `mapSanityContent` actualmente descarta dimensiones, crop y hotspot, por lo que su salida no satisface directamente la proyección requerida por el generador. No se amplió T22 modificando el mapper; resolver el contrato antes de integrar el generador en componentes.
  - Verificación TDD: las 4 pruebas fallaron antes del generador; después pasan para WebP, variantes responsive, crop/hotspot, dimensiones y límite de 2000 px.

- [x] **T23. Crear componentes `EditorialImage`, `InventoryBadge` y `AvailabilityLabel`.** RF-11, RF-12, RF-20, RNF-3
  - Hecho cuando: Astro genera HTML con alt y dimensiones válidos, placa de inventario opaca y etiqueta textual localizada; los componentes usan tokens existentes y no hidratan JavaScript.
  - Decisiones de implementación (el plan no fija la API de props): `EditorialImage` recibe el resultado de `createResponsiveImage` y el alt por separado; valida alt y dimensiones antes de emitir `<img>`. La proyección GROQ que el mapper descarta sigue pendiente para una integración posterior, sin ampliar T23. `AvailabilityLabel` recibe estado e idioma y usa `text-on-surface-variant`, sin codificación cromática de estados, de acuerdo con el plan. `InventoryBadge` usa `space-sm` horizontal (token disponible más cercano a los 0.625rem descritos en el patrón; no se modifica `@theme`).
  - Verificación visual: preview temporal revisado en Chrome DevTools a 375×812 y 1280×900 frente a la captura legible del portfolio y al HTML de referencia del detalle de obra en `design/` (solo referencia); sin desbordamiento horizontal (375/375 px) ni JavaScript en el HTML. Los `screen.png` del detalle no cargaron en el lector. La ruta temporal se eliminó.
  - Verificación: `pnpm --dir web verify` pasó (lint, tipos, build estático y 218 tests).

- [x] **T24. Crear ficha técnica y componente de obra.** RF-1–RF-3, RF-9–RF-11, RF-18, RF-21, RF-22
  - Hecho cuando: el componente compone campos existentes, muestra nota/asociaciones solo si existen y no muestra una relación a serie no visible; markup accesible, sin datos inventados ni estilos arbitrarios.
  - Decisiones de implementación (el plan no fijaba el contrato de props ni la composición exacta): `ArtworkContent` consume `MappedArtwork`, idioma y `ResponsiveImage`; la página prepara la imagen desde la proyección del mapper y pasa solo relaciones localizadas y visibles (`visibleSeries`, `visibleCriticalTexts`) con sus hrefs, sin decidir rutas aquí. El componente comprueba que la serie corresponda a `seriesId` y que los textos críticos estén asociados por ID. La línea catalográfica se deriva de título, año, técnica y dimensiones; el soporte aparece en la ficha para mantener breve la línea.
  - Resolución del límite anotado en T22/T23: el mapper conserva junto al ID la proyección de imagen requerida por `createResponsiveImage` (dimensiones, crop y hotspot). El test del mapper falló antes del cambio y pasó después.
  - Verificación visual: fixture temporal claramente marcado como QA servido en preview estático; Chrome DevTools revisó 375×812 y 1280×900 frente al HTML de referencia de detalle y los patrones/captura legible de `design/`. Sin overflow (document width 375/1265 frente a viewport 375/1280), cero scripts, alt e intrinsic dimensions presentes. Se retiraron ruta y fixture; no se añadió una ruta de producto.
  - Verificación: `pnpm --dir web verify` pasó (lint, tipos, build estático y 218 tests).

- [x] **T25. Crear componente de serie.** RF-4, RF-5, RF-13, RF-18, RF-22
  - Hecho cuando: presenta traducción, descripción e imagen solo si son válidas y no renderiza serie sin al menos una obra visible asociada en ese idioma.
  - Decisión de implementación (el plan no fijaba el contrato de props): `SeriesContent` recibe `MappedSeries`, locale, imagen responsive opcional asociada por `assetId` y obras ya visibles/localizadas como `{ id, title, href }`. Omite toda la serie sin traducción/nombre u obras con enlaces válidos; descarta descripciones vacías e imágenes sin traducción/alt válido o sin dimensiones y URLs responsive válidas. Se añadió `seriesWorks` en ES/EN para rotular la lista accesible.
  - Verificación visual: preview QA temporal, eliminado tras revisar Chrome DevTools a 375×812 y 1280×900; sin overflow, imagen con alt/dimensiones y links visibles. La serie sin obras no emitió markup y la serie sin imagen renderizó correctamente. La composición reutiliza tokens y distribución editorial existentes; sin rutas permanentes ni datos de artista añadidos.
  - Verificación: `pnpm --dir web verify` pasó tras retirar la ruta temporal: lint, tipos, build estático y 218 tests.

- [x] **T26. Crear componente de exposición.** RF-6, RF-7, RF-11, RF-13, RF-18, RF-22
  - Hecho cuando: presenta fechas, traducción e imagen opcional válida y omite asociaciones sin destino publicado/completo en el idioma actual.
  - Decisiones de implementación (el plan no fijaba el contrato de props ni el formato visual de fechas): `ExhibitionContent` recibe la exposición localizada, la imagen responsive opcional y listas de obras/series visibles con `id`, título y `href`; intersecta esas listas con las asociaciones de la traducción y acepta solo enlaces locales. Presenta fechas con `Intl.DateTimeFormat` según el idioma y etiquetas i18n para lugar, fechas y asociaciones. La imagen solo se muestra si coincide su asset, tiene dimensiones/URLs válidas y alt válido respecto al título.
  - Verificación visual: preview temporal con fixture explícitamente `[QA]`, retirado tras revisar Chrome DevTools a 375×812 y 1280×900. Sin overflow (375/375 px y 1265/1280 px); imagen con alt/dimensiones y relación no visible omitida. Se usaron tokens y patrón de composición documentados; la captura legible de `design/` es del portfolio general, no hay captura de detalle de exposición.
  - Verificación: `pnpm --dir web verify` pasó (lint, tipos, build estático y 218 tests).

- [x] **T27. Crear componente de texto crítico.** RF-3, RF-7, RF-8, RF-16–RF-18, RF-22
  - Hecho cuando: presenta el original en su idioma y solo traducciones completas/publicadas; admite cero asociaciones y nunca sustituye una traducción ausente por el original.
  - Decisión de implementación (el plan no fijaba el contrato de props ni la composición exacta): `CriticalTextContent` recibe el texto mapeado y el idioma a renderizar; no aplica fallback y no emite contenido si falta esa traducción o alguno de sus campos obligatorios. Intersecta las asociaciones de la traducción con destinos visibles/locales recibidos por props; las listas son opcionales y vacías no impiden mostrar el texto. El cuerpo usa `body-lg` (patrón de ensayo), el autor `body-md` en cursiva y las etiquetas de asociaciones son i18n ES/EN.
  - Verificación visual: ruta QA temporal marcada `[QA]`, eliminada tras revisar Chrome DevTools a 375×812 y 1280×900 frente a la captura general y patrones de `design/`. Sin overflow; solo se renderizó el original ES al faltar EN y cero asociaciones no ocultaron el texto. El HTML de desarrollo incorpora scripts de HMR; no se añadió JS al componente.
  - Verificación: `pnpm --dir web verify` pasó (lint, tipos, build estático de 3 rutas y 218 tests).

- [ ] **T28. Ejecutar verificación de integración y revisión visual.** RF-1–RF-22, RNF-1–RNF-4
  - Hecho cuando: `pnpm --dir web verify` pasa; Chrome DevTools confirma HTML sin JS, accesibilidad/links correctos y revisión a 375 px y ≥1280 px frente a `design/`.
  - Verificación parcial (2026-10-08): `pnpm --dir web verify` pasó (lint, tipos, build estático de 3 rutas y 218 tests). En el preview estático, Chrome comprobó la home en 375×812 y 1280×900: sin overflow (375/375 y 1280/1280), cero scripts, landmark `main` y enlaces ES/EN accesibles. Esto no valida los componentes editoriales de T23–T27.
  - Bloqueada, no marcar como hecha: el build solo genera `/`, `/en/` y `/404`; no hay página navegable que consuma los componentes editoriales. La tarea ya prohíbe añadir rutas en esta spec y depende de las rutas de una spec de páginas.

## Bloqueo de verificación visual

El plan no crea rutas ni páginas, pero T28 pide revisar los componentes en un preview navegable. Para completar esa verificación hace falta que una spec de páginas provea rutas de preview; no añadir rutas ni cambiar el alcance dentro de estas tareas sin aprobar primero una actualización del plan.
