# Tareas — Spec 001

> La implementación se mantiene en esta única spec, aunque el desglose tenga 28 tareas. No iniciar tareas que cambien dependencias, schemas de Sanity o tipos públicos del dominio hasta recibir la aprobación indicada en AGENTS.md.

- [x] **T1. Confirmar aprobaciones y límites de implementación.** RF-1–RF-22
  - Hecho cuando: quedan aprobados explícitamente los cambios de dependencias, schemas y tipos públicos; queda documentado que RF-10 garantiza unicidad del catálogo publicado mediante el control de build descrito en el plan, no unicidad transaccional del Content Lake.
  - Aprobación explícita del usuario: dependencias de Sanity/imagen/Studio (T2), schemas y validaciones Sanity (T12–T17), y tipos públicos/value objects del dominio.
  - Decisión RF-10 confirmada: se garantiza unicidad del catálogo publicado en build; no unicidad transaccional en Content Lake.

- [x] **T2. Crear el esqueleto de Sanity Studio y fijar sus dependencias.** RF-1–RF-22
  - Hecho cuando: `sanity/package.json`, configuración y lockfile permiten arrancar Studio con `pnpm --dir sanity dev`; no hay secretos ni dataset de producción en el repositorio.
  - Decisiones de implementación: se añadió `sanity.cli.ts` porque Sanity 6.18 lo requiere para `dev`/`build`, aunque no figure en la tabla de archivos del plan. El config usa valores locales de reserva (`local-project`/`local`) y admite configuración mediante variables de entorno; no se versionan credenciales ni un ID/dataset de producción.
  - Para que `pnpm verify` no analice bundles generados por Studio, ESLint omite `sanity/dist/` y `sanity/.sanity/`.

- [x] **T3. Implementar `Availability` y `Dimensions` con TDD.** RF-9, RF-12
  - Hecho cuando: Vitest demuestra primero el fallo de los casos de estados permitidos/prohibidos y dimensiones positivas con hasta un decimal; tras implementar, pasan y rechazan valores inválidos.
  - Decisión de implementación (el plan no fija la API): `isAvailability` es un guard de tipo para los cuatro estados y `createDimensions` devuelve dimensiones válidas o `undefined`; los valores de dimensión deben ser números finitos positivos.
  - Verificación TDD: las pruebas fallaron antes de crear los módulos; después pasaron 26 casos para estados y dimensiones.

- [x] **T4. Implementar `InventoryNumber` con TDD.** RF-10
  - Hecho cuando: Vitest falla primero y luego pasa para formato, año 1900–año actual y secuencias 001–999, incluyendo los límites y casos inválidos.
  - Decisión de implementación (el plan no fija la API): `createInventoryNumber(value, currentYear)` devuelve el valor validado con tipo `InventoryNumber` o `undefined`; el año actual se recibe explícitamente para que los límites sean deterministas.
  - Verificación TDD: las pruebas fallaron antes de crear el módulo; después pasaron 15 casos. `pnpm verify` pasó (lint, tipos, build y 45 tests).

- [x] **T5. Implementar validación de fechas de exposición con TDD.** RF-6
  - Hecho cuando: Vitest falla primero y luego pasa para día real de calendario, inicio obligatorio, fin opcional y fin no anterior al inicio.
  - Decisión de implementación (el plan no fija la API): `CalendarDate` es una fecha ISO `YYYY-MM-DD` validada por `createCalendarDate`; `createExhibitionDates` requiere un inicio válido, admite el fin omitido (`undefined`) y rechaza fechas inválidas o un fin anterior al inicio.
  - Verificación TDD: las pruebas fallaron antes de crear el módulo; después pasaron 27 casos.

- [x] **T6. Implementar completitud de obras y texto alternativo con TDD.** RF-1–RF-3, RF-9, RF-11–RF-13, RF-22
  - Hecho cuando: los tests primero fallan y luego verifican campos compartidos/localizados, imagen principal existente, alt no vacío/≤150/distinto del título y campos opcionales omitidos si son inválidos; ningún dato ausente se inventa.
  - Decisión de implementación (el plan no fija la API): `checkArtworkCompleteness(input, currentYear)` valida los datos compartidos y una traducción a la vez, y devuelve `complete`, errores por campo y opcionales normalizados. La imagen se representa mediante un `mainImage.assetId` no vacío; el mapper deberá asegurar que el asset referenciado existe en Sanity. Los IDs de textos críticos inválidos se omiten individualmente; la nota vacía/inválida y una lista inválida se normalizan a ausentes. El límite del alt cuenta puntos de código Unicode.
  - Verificación TDD: los tests fallaron antes de crear `completeness.ts`; después pasaron 23 casos. `pnpm verify` pasó (lint, tipos, build y 95 tests).

- [x] **T7. Implementar completitud de series y exposiciones con TDD.** RF-4–RF-7, RF-11, RF-13, RF-15
  - Hecho cuando: los tests primero fallan y luego verifican español obligatorio, requisitos EN, fechas, asociaciones opcionales e imagen/alt opcionales inválidos normalizados a ausentes.
  - Decisión de implementación (el plan no fija la API): `checkSeriesCompleteness(input)` y `checkExhibitionCompleteness(input)` reciben los campos compartidos y una traducción cada vez. Ambas validan los campos obligatorios de esa traducción; la elegibilidad que exige ES antes de publicar EN queda para T9. El alt de la imagen opcional va en la traducción y solo se conserva junto a un `assetId` no vacío y alt válido; el mapper deberá comprobar la existencia real del asset. Las referencias opcionales inválidas se omiten individualmente y un fin de exposición vacío se normaliza a ausente (RF-13).
  - Verificación TDD: los 33 tests fallaron antes de añadir las funciones; después pasaron 37 casos de T7 (60 junto con T6). `pnpm verify` pasó (lint, tipos, build y 132 tests).

- [x] **T8. Implementar completitud de textos críticos con TDD.** RF-7, RF-8, RF-13, RF-16, RF-22
  - Hecho cuando: los tests primero fallan y luego verifican idioma original ES/EN, título/cuerpo/autor obligatorios, original EN sin traducción ES y traducción opcional omitida si incompleta, sin fallback ni contenido inventado.
  - Decisión de implementación (el plan no fija la API): `checkCriticalTextCompleteness(input)` recibe `originalLanguage: 'es' | 'en'` y traducciones independientes indexadas por idioma; devuelve el original solo si está completo y conserva la traducción secundaria solo si también está completa. Usa cadenas para título/cuerpo/autor, y normaliza las asociaciones opcionales a listas de IDs no vacíos. Si el original es inválido, no emite ninguna traducción ni relación.
  - Verificación TDD: los 19 tests fallaron antes de añadir la función; después pasaron. `pnpm verify` pasó (lint, tipos, build y 151 tests).

- [x] **T9. Implementar elegibilidad de publicación y borradores por idioma con TDD.** RF-14–RF-17, RF-19
  - Hecho cuando: los tests primero fallan y luego prueban publicación explícita, conservación de publicación previa durante edición, ES obligatorio para obra/serie/exposición, EN independiente, crítico publicado desde su idioma original y retirada localizada al despublicar o perder completitud.
  - Decisión de implementación (el plan no fija la API): `transitionPublication(kind, state, action, originalLanguage?)` conserva por idioma contenido publicado y borradores con `complete`/`errors`. `saveDraft` nunca publica; `publish` afecta solo al idioma solicitado y devuelve los errores de una versión incompleta; `reconcile` retira versiones publicadas cuya completitud cambió. Para obra/serie/exposición, EN requiere ES ya publicado; para texto crítico, la traducción requiere el original publicado. Despublicar ES o la versión original retira sus dependientes, sin borrar borradores.
  - Verificación TDD: la suite inicial de 26 tests falló antes de crear `publication.ts`; tras implementar y ampliar los casos, pasan 30. `pnpm verify` pasó (lint, tipos, build y 181 tests).

- [x] **T10. Implementar visibilidad de series y relaciones con TDD.** RF-5, RF-7, RF-18, RF-19, RF-22
  - Hecho cuando: los tests primero fallan y luego verifican serie visible solo con obra visible en el mismo idioma, relación oculta sin enlace a destino no visible, relación conservada y reaparición automática al recuperar visibilidad.
  - Decisión de implementación (el plan no fija la API): `isSeriesVisible` recibe los IDs de series publicadas y las obras visibles por idioma; `filterVisibleRelations` devuelve solo IDs con destino visible en el idioma solicitado, sin mutar las relaciones de origen. El llamador aporta versiones publicadas/completas y vuelve a evaluar tras cambios de visibilidad.
  - Verificación TDD: los tests fallaron antes de crear `visibility.ts`; después pasaron 5 casos. `pnpm verify` pasó (lint, tipos, build y 186 tests).

- [x] **T11. Implementar comprobación de inventarios duplicados con TDD.** RF-10
  - Hecho cuando: Vitest demuestra primero el fallo y luego pasa para catálogo único y duplicado, indicando los IDs/valores duplicados; la comprobación puede bloquear el build antes de publicar una salida inválida.
  - Decisión de implementación (el plan no fija la API): `findDuplicateInventoryNumbers` devuelve cada número duplicado con todos sus IDs de obra; `assertUniqueInventoryNumbers` lanza un error descriptivo si hay duplicados, para que el gate del build pueda detener la salida.
  - Verificación TDD: los tests fallaron antes de crear `catalog-validation.ts`; después pasaron 4 casos. `pnpm verify` pasó (lint, tipos, build y 190 tests).

- [x] **T12. Crear campos compartidos reutilizables de Sanity.** RF-9, RF-11–RF-13
  - Hecho cuando: los tipos compartidos de dimensiones y disponibilidad están registrados en Studio; los builders reutilizables de referencias e imagen/alt se exportan para uso en schemas; `pnpm --dir sanity build` valida el registro sin depender de documentos de tareas posteriores.
  - Decisión de alcance: T12 prepara y registra los campos compartidos, pero no requiere consumidores de documento. T13–T15 los consumirán al crear sus schemas; exigir ese consumo dentro de T12 invertiría la dependencia entre tareas.
  - Decisión de implementación (el plan no fija la API): `dimensionsType` y `availabilityType` se registran desde `schemaTypes/index.ts`; sus validaciones/options reutilizan `createDimensions`, `isAvailability` y `AVAILABILITY_VALUES` del dominio. `createReferenceField`, `createReferenceListField`, `createEditorialImageField` y `createLocalizedImageAltField` se exportan para los schemas de documentos. El alt opcional inválido produce advertencia, no bloquea publicación; el alt obligatorio reutiliza `isValidAlternativeText`.
  - Verificación TDD: los tests de valores de disponibilidad y validación exportada de alt fallaron antes de implementar; después pasaron. `pnpm --dir sanity build` pasó y `pnpm verify` pasó (lint, tipos, build y 192 tests).

- [x] **T13. Crear schemas base Sanity de obra y traducción.** RF-1–RF-3, RF-9, RF-10, RF-12, RF-20, RF-22 (estructura base; la relación de RF-1 se completa en T14 y las asociaciones de RF-3 en T15)
  - Hecho cuando: el Studio representa datos compartidos de obra, una imagen principal, nota de taller opcional y documentos ES/EN independientes vinculados a la obra; no duplica textos críticos ni la línea catalográfica. La referencia a serie queda para T14 y las asociaciones a textos críticos para T15.
  - Decisión de secuencia aprobada por el usuario: crear primero los tipos destino antes de registrar sus referencias; T14 añadirá la referencia a serie y T15 las asociaciones a textos críticos sobre el schema de obra.
  - Decisión de implementación (el plan no fijaba la localización de la nota): `workshopNote` queda en el documento compartido de obra, de acuerdo con el modelo de dominio y porque la spec no exige traducciones de esa nota. El documento traducido referencia a una obra y requiere un idioma `es` o `en`; no asigna idioma por defecto.
  - Alcance de validación: obra y traducción marcan como requeridos los campos obligatorios; los rangos/formato del año e inventario se completarán en T16 y la unicidad en T17/build.
  - Verificación: `pnpm --dir sanity build` pasó; `pnpm verify` pasó (lint, tipos, build y 192 tests).
  - Preview Chrome: la configuración de reserva `local-project` muestra “Project not found”; no se pudieron inspeccionar formularios a 375 px/escritorio ni comparar con capturas del sitio. No se creó un proyecto/dataset, conforme al plan.

- [x] **T14. Crear schemas Sanity de serie y exposición con traducciones.** RF-1, RF-4–RF-7, RF-11, RF-13, RF-15, RF-18
  - Hecho cuando: los documentos compartidos y traducidos aceptan los campos definidos, fechas/relaciones opcionales donde corresponde e imágenes opcionales sin convertirlas en requisito de publicación.
  - Extensión de T13: incorpora la referencia requerida de obra a serie una vez que el tipo `series` está registrado.
  - Decisión de implementación (el plan no fija todos los nombres del schema): las imágenes opcionales se guardan en los documentos compartidos y cada traducción guarda su `imageAlt`; las asociaciones de exposición usan `artworkIds` y `seriesIds`, alineados con el dominio. `startDate` es obligatorio, `endDate` opcional; la regla de orden de fechas se añade en T16.
  - Verificación: `pnpm --dir sanity build` pasó; `pnpm verify` pasó (lint, tipos, build y 192 tests).
  - Preview Chrome: `local-project` devuelve “Project not found” también en viewport de 375 px y 1280 px; los formularios no se pueden cargar y las capturas `design/` corresponden al sitio público, no al Studio. No se creó un proyecto/dataset conforme al plan.

- [x] **T15. Crear schemas Sanity de textos críticos y asociaciones.** RF-3, RF-7, RF-8, RF-16, RF-18, RF-22
  - Hecho cuando: Studio registra idioma original y asociaciones opcionales, conserva el texto como pieza independiente y permite traducciones independientes sin duplicar su contenido en obras/series.
  - Extensión de T13: incorpora las asociaciones opcionales de obra a textos críticos una vez que el tipo `criticalText` está registrado.
  - Decisión de implementación (el plan no fija los nombres de campo): `criticalText` contiene `originalLanguage`, `artworkIds` y `seriesIds`; `criticalTextTranslation` referencia esa pieza y contiene `language`, `title`, `body` y `author`. `artwork.criticalTextIds` guarda la asociación inversa opcional. No se copia contenido crítico en obras ni series.
  - Verificación: `pnpm --dir sanity build` pasó; `pnpm verify` pasó (lint, tipos, build y 192 tests).
  - Chrome DevTools: comprobado a 375 × 812 y 1280 × 900; ambos viewports muestran “Project not found” para `local-project`. No se pueden inspeccionar los formularios ni compararlos con capturas del sitio sin proyecto/dataset; no se creó ninguno, conforme al plan. El Studio estándar no usa los tokens del sitio.

- [ ] **T16. Añadir validación editorial y feedback de publicación en Studio.** RF-1–RF-15
  - Hecho cuando: una sesión de prueba en dataset no productivo muestra errores de campos obligatorios/formato/rango y evita publicar desde el Studio una versión incompleta sin impedir publicar otra versión completa e independiente.

- [ ] **T17. Añadir validación de unicidad de inventario en Studio.** RF-10
  - Hecho cuando: una prueba en dataset no productivo avisa de un inventario ya usado; queda documentado que la validación asíncrona no es una restricción transaccional y el control de build sigue siendo obligatorio.

- [ ] **T18. Crear cliente Sanity de build y consultas GROQ publicadas.** RF-5, RF-7, RF-14–RF-19, RNF-1
  - Hecho cuando: pruebas/inspección verifican perspectiva `published`, selección de entidades y traducciones publicadas y ausencia de credenciales/datos de borrador en consultas de producción.

- [ ] **T19. Escribir primero tests de mappers Sanity → dominio.** RF-1–RF-22, RNF-4
  - Hecho cuando: Vitest falla con fixtures de documentos válidos, referencias/asset ausentes, idiomas incompletos, opcionales inválidos, relaciones ocultas y valores mal formados; todavía no se añade implementación del mapper en esta tarea.

- [ ] **T20. Implementar mappers y gate del catálogo.** RF-1–RF-22, RNF-1, RNF-4
  - Hecho cuando: pasan los tests de T19, los mappers no hacen fallback entre idiomas ni inventan datos y duplicados de inventario impiden generar una salida nueva.

- [ ] **T21. Añadir etiquetas i18n y su verificación automática.** RF-12, RF-20
  - Hecho cuando: Vitest confirma igualdad de claves y texto no vacío para disponible, reservada, vendida y en colección en ES y EN.

- [ ] **T22. Crear generador de URL de imagen responsive con TDD.** RF-1, RF-4, RF-6, RF-11, RNF-3
  - Hecho cuando: los tests primero fallan y luego verifican WebP, respeto de crop/hotspot, anchos responsive no mayores de 2000 px y dimensiones explícitas derivadas del asset.

- [ ] **T23. Crear componentes `EditorialImage`, `InventoryBadge` y `AvailabilityLabel`.** RF-11, RF-12, RF-20, RNF-3
  - Hecho cuando: Astro genera HTML con alt y dimensiones válidos, placa de inventario opaca y etiqueta textual localizada; los componentes usan tokens existentes y no hidratan JavaScript.

- [ ] **T24. Crear ficha técnica y componente de obra.** RF-1–RF-3, RF-9–RF-11, RF-18, RF-21, RF-22
  - Hecho cuando: el componente compone campos existentes, muestra nota/asociaciones solo si existen y no muestra una relación a serie no visible; markup accesible, sin datos inventados ni estilos arbitrarios.

- [ ] **T25. Crear componente de serie.** RF-4, RF-5, RF-13, RF-18, RF-22
  - Hecho cuando: presenta traducción, descripción e imagen solo si son válidas y no renderiza serie sin al menos una obra visible asociada en ese idioma.

- [ ] **T26. Crear componente de exposición.** RF-6, RF-7, RF-11, RF-13, RF-18, RF-22
  - Hecho cuando: presenta fechas, traducción e imagen opcional válida y omite asociaciones sin destino publicado/completo en el idioma actual.

- [ ] **T27. Crear componente de texto crítico.** RF-3, RF-7, RF-8, RF-16–RF-18, RF-22
  - Hecho cuando: presenta el original en su idioma y solo traducciones completas/publicadas; admite cero asociaciones y nunca sustituye una traducción ausente por el original.

- [ ] **T28. Ejecutar verificación de integración y revisión visual.** RF-1–RF-22, RNF-1–RNF-4
  - Hecho cuando: `pnpm verify` pasa; Chrome DevTools confirma HTML sin JS, accesibilidad/links correctos y revisión a 375 px y ≥1280 px frente a `design/`.

## Bloqueo de verificación visual

El plan no crea rutas ni páginas, pero T28 pide revisar los componentes en un preview navegable. Para completar esa verificación hace falta que una spec de páginas provea rutas de preview; no añadir rutas ni cambiar el alcance dentro de estas tareas sin aprobar primero una actualización del plan.
