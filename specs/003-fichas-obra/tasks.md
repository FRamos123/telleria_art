# Tareas — Spec 003: Fichas individuales de obra

Spec de referencia: `spec.md` (aprobada). Plan de referencia: `plan.md`.

## Precondiciones

- Antes de T1, obtener autorización explícita para modificar el schema de Sanity y el tipo público `MappedArtworkTranslation`. Confirmar si `artwork.workshopNote` está redactado en español; si no se confirma, omitir el valor legado. No modificar contenido de Sanity de producción.
- Antes de T12, acordar cómo integrar los sitemaps con las tareas T10–T12 pendientes de Spec 002, para que cada endpoint y su contenido se implementen una sola vez.
- La autorización para redactar estas tareas no autoriza por sí sola los cambios de schema/tipos ni la modificación de contenido.

## Bloque A — Contenido localizado y elegibilidad

- [x] **T1. Fijar con pruebas el contrato de la nota localizada en la query.** RF-3, RF-5–RF-6
- Hecho cuando: `queries.test.ts` comprueba que la proyección devuelve `workshopNote` por traducción y conserva la lectura del campo legado, consultando únicamente documentos publicados.
- Nota: el test del campo localizado queda intencionadamente rojo hasta T3, que implementa la proyección. La perspectiva `published` sigue comprobada por `client.test.ts`; no se adelantó T3 para respetar el alcance de una tarea.

- [x] **T2. Añadir el campo opcional de nota al schema de traducción.** RF-3, RF-6
- Hecho cuando: cada `artworkTranslation` admite una nota opcional sin renombrar, borrar ni migrar el campo legado, y `pnpm --dir studio build` pasa.
- Nota: el campo usa tipo Sanity `text`, igual que el campo legado de `artwork`; queda opcional al no añadir validación de obligatoriedad. El campo legado y los datos de Sanity permanecen intactos. `pnpm --dir studio build` pasa.

- [x] **T3. Proyectar la nota localizada en la query de Sanity.** RF-3, RF-5–RF-6
- Hecho cuando: la query incluye la nota de cada traducción y el campo legado compartido; las pruebas de contrato de T1 pasan.

- [x] **T4. Mapear notas de taller sin fallback lingüístico.** RF-3, RF-14
- Hecho cuando: pruebas primero demuestran el fallo y luego pasan para notas ES/EN independientes, vacías o ausentes y nota legada solo en ES si su idioma fue confirmado; una nota ES nunca aparece en EN y `pnpm --dir web verify` pasa.
- Nota: el idioma del campo legado no pudo confirmarse porque el dataset de desarrollo no contiene obras; se omite del mapeo, conforme al plan. Solo se mapean notas localizadas no vacías. Las pruebas TDD verifican notas ES/EN independientes, ausencia de fallback y omisión de valores vacíos o ausentes.

- [x] **T5. Aplicar en el mapper la elegibilidad de la serie por idioma.** RF-1, RF-5–RF-6, RF-14
- Hecho cuando: pruebas primero fallan y luego pasan para serie ES ausente/incompleta (se excluyen ambos idiomas), serie EN ausente/incompleta (se conserva ES y se excluye EN) y ambas series válidas (se conservan ambos); `pnpm --dir web verify` pasa.
- Nota: se conserva la validación de inventarios duplicados sobre todos los candidatos de obra completos, también los filtrados por la serie, para no alterar el alcance previo de ese bloqueo de build. La prueba de `catalog-content` se ajustó para reflejar que una serie ES sin traducción EN no publica la versión EN de sus obras.

## Bloque B — Fichas estáticas

- [x] **T6. Generar rutas estáticas solo para las versiones elegibles.** RF-5–RF-6, RF-9, RF-12, RNF-1, RNF-5
- Hecho cuando: se generan `/obra/<id>/` para obras elegibles en ES y `/en/work/<id>/` solo cuando también son elegibles en EN; cada ruta recibe datos de su idioma y no se generan IDs o versiones no publicados.
- Nota: ambas rutas consumen `loadCatalogContent` (ya filtrado por idioma/serie), y solo emiten páginas si existen la traducción y la serie localizadas. El dataset `development` no contiene obras, por lo que el build verifica las rutas pero no materializa fichas; la revisión visual corresponde a las tareas de QA posteriores.

- [x] **T7. Componer los datos catalográficos de la ficha.** RF-1–RF-2, RF-4, RF-7, RF-13–RF-14, RNF-2–RNF-3, RNF-5–RNF-6
- Hecho cuando: `ArtworkContent` muestra los campos obligatorios, dimensiones en cm alto × ancho sin conversión, inventario, los cuatro estados con etiqueta localizada y la imagen optimizada con alt y dimensiones; no presenta acciones ni mensajes comerciales.
- Nota: la serie localizada pasa a ser prop obligatoria y se rechaza si no corresponde a la obra o carece de nombre/enlace, para no omitir un campo catalográfico obligatorio. Se retiró el resumen redundante de título/año/técnica/dimensiones: esos datos aparecen en su jerarquía y en la ficha técnica. Chrome DevTools revisó una fixture temporal (retirada) a 375×812 y 1280×900, sin overflow, cotejada con los tokens y la captura legible del portfolio; las dos capturas específicas del detalle no se pudieron abrir. El dataset `development` no contiene obras, por lo que no se generaron fichas reales en el build.

- [x] **T8. Mostrar la nota de taller solo en su idioma publicado.** RF-3, RF-14, RNF-1, RNF-5
- Hecho cuando: la ficha muestra una nota solo si está publicada, no vacía y localizada para su idioma; el dato legado, si fue confirmado como español, aparece solo en ES, sin espacios vacíos ni fallback.
- Nota: `ArtworkContent` consume únicamente `translation.workshopNote`, lo recorta y omite el bloque si queda vacío; ignora siempre `artwork.optional.workshopNote` porque el idioma del valor legado sigue sin confirmarse (decisión prevista en el plan). Prueba de presentación primero falló y después pasó. Chrome DevTools confirmó notas ES/EN independientes, ausencia del valor legado y sin overflow a 375×812 y 1280×900; las rutas temporales se retiraron.

- [x] **T9. Presentar los textos críticos asociados que estén localizados.** RF-3, RF-14, RNF-1–RNF-2, RNF-5
- Hecho cuando: se muestran título, cuerpo y autor solo para traducciones publicadas en el idioma actual; pruebas o revisión confirman que relaciones sin traducción se omiten y que cero asociaciones es válido.
- Nota: ES/EN pasan `catalog.criticalTexts` a la ficha; `ArtworkContent` selecciona solo IDs asociados con traducción actual completa (título, cuerpo y autor) y `ArtworkCriticalTexts` no renderiza sección vacía. Pruebas de presentación fallaron antes de implementar y después pasaron. Chrome DevTools comprobó contenido ES/EN, omisión de texto ES en EN, relación ausente y cero asociaciones a 375×812 y 1280×900, sin overflow; las fixtures se retiraron. Sin decisiones fuera del plan ni tokens nuevos.

- [x] **T10. Añadir metadatos identificadores a cada versión.** RF-8–RF-9, RNF-1, RNF-4
- Hecho cuando: cada versión emite un title único con título, inventario e idioma, canonical propio y hreflang solo hacia versiones existentes; no genera meta description sin texto SEO autoral.
- Nota: cada ruta pasa a `BaseLayout` un título con título localizado, inventario, código de idioma y marca; define su canonical y alternates solo cuando existe la versión equivalente, sin `description`. Separadores elegidos: ` · ` entre obra/inventario/idioma y ` — ` antes de la marca (el plan no fijaba separadores). Pruebas primero fallaron y después pasaron; Chrome DevTools validó ES/EN, alternates y selector a 375×812 y 1280×900 sin overflow. Las fixtures temporales se retiraron.

- [x] **T11. Emitir JSON-LD factual de obra.** RF-10, RF-13–RF-14, RNF-4
- Hecho cuando: cada ficha genera JSON-LD `VisualArtwork` válido y parseable con hechos disponibles, sin ofertas, precios, disponibilidad comercial, compra ni afirmaciones sobre prints.
- Nota: `ArtworkContent` serializa el `VisualArtwork` con URL canónica, título, creador, inventario, técnica, soporte, imagen transformada, idioma y serie; el fixture temporal se parseó en Chrome y confirmó ausencia de propiedades comerciales. Decisión de mapeo no detallada en el plan: `artMedium` representa técnica, `artworkSurface` soporte y `height`/`width` usan `QuantitativeValue` con `unitCode: CMT` y `unitText: cm`. Se escapan los caracteres `<` antes de insertar JSON en el script; fixture retirada.

## Bloque C — Indexación y verificación

- [ ] **T12. Emitir el sitemap de páginas públicas.** RF-9, RF-11–RF-12
- Hecho cuando: `sitemap.xml` contiene únicamente páginas publicadas y sus alternates existentes, integrado con catálogo y series según el acuerdo con Spec 002, sin duplicar endpoint ni trabajo.

- [ ] **T13. Emitir el sitemap de imágenes públicas.** RF-7, RF-11–RF-12
- Hecho cuando: `image-sitemap.xml` incluye solo imágenes transformadas de obras publicadas y las imágenes públicas de series según el acuerdo con Spec 002; no incluye versiones retiradas o no elegibles.

- [ ] **T14. Verificar con pruebas la salida HTML de las fichas.** RF-1–RF-10, RF-13–RF-14, RNF-1, RNF-4–RNF-6
- Hecho cuando: pruebas de build verifican contenido server-rendered sin JavaScript, campos y estados localizados, ausencia de fallback, metadatos y JSON-LD parseable sin datos comerciales.

- [ ] **T15. Verificar con pruebas los sitemaps y ejecutar la verificación web.** RF-7, RF-9, RF-11–RF-12
- Hecho cuando: pruebas comprueban XML válido, inclusión solo de páginas/imágenes publicadas y alternates existentes; `pnpm --dir web verify` pasa.

- [ ] **T16. Revisar en móvil la ficha española.** RF-1–RF-7, RF-13–RF-14, RNF-2–RNF-3, RNF-5–RNF-6
- Hecho cuando: preview a 375×812 en ES confirma contenido obligatorio, imagen optimizada/alt, estado textual, opcionales presentes o ausentes según contenido y ausencia de overflow; se retira cualquier fixture temporal.

- [ ] **T17. Revisar en móvil la ficha inglesa.** RF-1–RF-7, RF-9, RF-13–RF-14, RNF-1–RNF-3, RNF-5–RNF-6
- Hecho cuando: preview a 375×812 en EN confirma contenido localizado sin fallback, imagen/alt y estado en inglés, opcionales correctos y ausencia de overflow; se retira cualquier fixture temporal.

- [ ] **T18. Revisar la ficha española en tablet y escritorio.** RF-1–RF-4, RF-7, RF-13–RF-14, RNF-2–RNF-3, RNF-6
- Hecho cuando: preview ES a 768 px y 1280×900 no presenta overflow y mantiene legibles la composición, imagen, datos y etiquetas de estado.

- [ ] **T19. Revisar la ficha inglesa en tablet y escritorio.** RF-1–RF-4, RF-7, RF-9, RF-13–RF-14, RNF-1–RNF-3, RNF-6
- Hecho cuando: preview EN a 768 px y 1280×900 no presenta overflow ni fallback y mantiene legibles la composición, imagen, datos y etiquetas localizadas.

- [ ] **T20. Verificar teclado, contraste y rutas no publicadas.** RF-4, RF-11–RF-12, RNF-2
- Hecho cuando: foco y navegación por teclado son operables, los textos cumplen WCAG 2.2 AA y una ruta inexistente o retirada responde HTTP 404 sin redirección ni aparece en los sitemaps.

- [ ] **T21. Medir Lighthouse en las fichas representativas.** RNF-7
- Hecho cuando: Lighthouse manual en preview móvil para fichas ES y EN registra rendimiento ≥90, accesibilidad ≥95 y SEO 100; los resultados quedan anotados y cualquier incumplimiento se resuelve antes de cerrar la spec.

Hay **21 tareas**, por lo que se propone dividir la spec antes de iniciar la implementación en tres entregas coordinadas: **003A, contenido localizado y elegibilidad** (T1–T5); **003B, fichas estáticas y metadatos** (T6–T11); y **003C, sitemaps y validación de publicación** (T12–T21). Es una propuesta de planificación; no cambia por sí sola la spec aprobada ni su alcance.
