# Tareas 004 — Exposiciones y textos críticos

La spec está aprobada y no tiene dudas abiertas. La solicitud explícita de generar estas tareas se toma como aprobación del plan para pasar a esta fase. Las tareas están en orden de dependencia; las que cambian una pantalla incluyen la aprobación previa señalada en el plan.

## Propuesta de división

El plan original requiere **12 tareas** para mantener cada unidad dentro de 20–30 minutos. Tras la auditoría, el usuario aprobó añadir tres remediaciones a esta misma spec (15 tareas en total) en vez de abrir una Spec 005; se conserva la propuesta original de división:

- **Exposiciones:** RF-1–RF-3 y sus partes aplicables de RF-6, RF-8–RF-15.
- **Textos críticos:** RF-4–RF-7 y sus partes aplicables de RF-6, RF-8–RF-15.
- La consulta/mapeo compartidos, los helpers SEO/ordenación y la integración común de sitemaps se implementan una sola vez y se asignan a una entrega común; no se duplican.

La división implicaría acordar la organización de las specs y su numeración antes de iniciar la implementación. Mientras tanto, las tareas siguientes describen el alcance combinado de Spec 004.

- [x] **T1. Ampliar la carga de contenido publicado (25 min).** RF-1–RF-7, RF-14–RF-15
- Hecho cuando: el loader consulta las cuatro colecciones publicadas y las pasa al mapper; conserva proyecciones de imagen de exposición solo para assets aceptados; Vitest comprueba consultas, resultados y omisión de imágenes opcionales no válidas. Tests dirigidos: 7/7 pasan. `pnpm --dir web verify`: lint, tipos, build de 9 páginas y 308 tests pasan con `va9sgl77/development`.

- [x] **T2. Añadir ordenación y metadatos derivados (25 min).** RF-2, RF-4, RF-11
- Hecho cuando: Vitest comprueba exposiciones por fecha descendente con desempate determinista, textos críticos por título localizado con desempate estable, descripciones de exposición basadas solo en título/lugar/fechas y descripciones críticas limitadas a 155 caracteres sin cortar palabras; los metadatos duplicados son rechazados por la validación existente. Tests dirigidos: 19/19 pasan; `pnpm --dir web verify`: lint, tipos, build de 9 páginas y 317 tests pasan con `va9sgl77/development`.
- Decisión aprobada por el usuario y aclarada en spec/plan: si el primer término del cuerpo crítico supera por sí solo los 155 caracteres, se omite la meta description en vez de cortarlo o exceder el límite (RF-11).

- [x] **T3. Crear los listados de exposiciones ES/EN (30 min).** RF-1–RF-2, RF-8–RF-9, RF-11, RNF-1–RNF-3
- Hecho cuando: ambos listados muestran título, lugar y fechas en orden acordado; tienen títulos únicos y metadescripciones funcionales localizadas; existen aunque estén vacíos, sin fallback, y enlazan a las páginas propias del mismo idioma. `pnpm --dir web verify` pasa: build de 11 páginas y 322 tests.
- Decisión/aprobación: el usuario aprobó una lista editorial de una columna en todos los breakpoints, con título-enlace y lugar/fechas debajo; sin imágenes ni tarjetas. Se reutilizan los tokens existentes; no cambió `design/tokens.md`.
- Chrome DevTools: revisados ES en 375×812 y 1280×900, y EN en 375×812; `documentWidth` coincide con el viewport. La captura de referencia confirma el lienzo oscuro, la tipografía y los divisores. El dataset `development` no tiene exposiciones visibles, así que se validó visualmente el estado vacío; las filas se cubren con pruebas de componente.
- Dependencia resuelta por T4: las rutas propias ES/EN usan los mismos IDs y patrones de ruta que enlazan los listados. No hay exposiciones visibles en `development`; el estado vacío y las filas/enlaces están cubiertos respectivamente por la salida y las pruebas del componente.
- Chrome DevTools tras T4: ES en 375×812 y 1280×900, EN en 375×812; `documentWidth` coincide con cada viewport, los mensajes vacíos están localizados y no se detectaron errores de consola. La captura de referencia confirma el lienzo oscuro y la tipografía; no se pudo inspeccionar una fila con contenido publicado.

- [x] **T4. Crear las páginas propias de exposición ES/EN (30 min).** RF-3, RF-6, RF-9–RF-13, RF-15, RNF-1–RNF-7
- Hecho cuando: solo se generan versiones visibles; se muestra fecha localizada, imagen optimizada solo si es válida y relaciones confirmadas con destinos visibles del idioma; canonical, alternates, metadatos y datos estructurados describen solo contenido publicado; las rutas no generadas reciben la 404 prevista.
- Verificación: `pnpm --dir web verify` pasa con `SANITY_PROJECT_ID=va9sgl77` y `SANITY_DATASET=development` (lint, tipos, build de 11 páginas y 322 tests). El preview devuelve HTTP 404 para una ruta de exposición no generada.
- QA visual pendiente: `development` no tiene exposiciones visibles, por lo que no se generó ninguna página propia para comparar en Chrome a 375 px y escritorio. La ruta de exposición reutiliza `ExhibitionContent`; la comparación del detalle queda pendiente de contenido aprobado y de T11. No se añadió ni modificó contenido Sanity.

- [x] **T5. Crear los listados de textos críticos ES/EN (25 min).** RF-4, RF-8–RF-9, RF-11, RNF-1–RNF-3
- Hecho cuando: ambos listados muestran título y autor en orden alfabético localizado, sin extractos; tienen títulos únicos y metadescripciones funcionales localizadas; el estado vacío está localizado y no usa contenido del otro idioma; cada entrada enlaza a su versión propia publicada.
- Verificación: las pruebas dirigidas primero fallaron sin componente/rutas/mensajes y pasan tras implementarlos; `pnpm --dir web verify` pasa con `va9sgl77/development` (lint, tipos, build de 13 páginas y 327 tests).
- Chrome DevTools: ES revisado a 375×812 y 1280×900; EN a 375×812. `documentWidth` coincide con el viewport y no hay errores de consola; el estado vacío está localizado en ambos idiomas y respeta lienzo oscuro, tipografía y espaciado de los patrones aprobados. `development` no tiene textos críticos visibles, así que no se pudo inspeccionar una fila poblada; la estructura, ausencia de extractos y enlaces están cubiertos por pruebas.

- [x] **T6. Crear las páginas propias de textos críticos ES/EN (30 min).** RF-5–RF-6, RF-9–RF-12, RF-15, RNF-1–RNF-7
- Hecho cuando: cada página muestra título, cuerpo completo y autor de la versión publicada, además de relaciones confirmadas con destinos visibles en el mismo idioma; no hay fallback; las descripciones usan el cuerpo según el límite de 155 caracteres; los datos estructurados son válidos y no infieren el tipo de autor.
- Verificación: pruebas de rutas/relaciones/Article JSON-LD pasan; `pnpm --dir web verify` pasa con `SANITY_PROJECT_ID=va9sgl77` y `SANITY_DATASET=development` (lint, tipos, build de 13 páginas y 332 tests). El preview devuelve HTTP 404 para una ruta de detalle no generada.
- QA visual pendiente: `development` no tiene textos críticos visibles, así que no se generaron detalles para revisar a 375 px y escritorio. Chrome confirmó la 404 a 375×812 y 1280×900; `CriticalTextContent` se reutiliza sin cambios y ya tuvo revisión responsive en T27. La comparación de páginas propias con contenido real queda pendiente de contenido aprobado y T12. No se modificó Sanity.

- [x] **T7. Enlazar los textos críticos desde las fichas de obra (20 min).** RF-7, RF-9, RF-14–RF-15, RNF-2–RNF-3
- Hecho cuando: antes de modificar la ficha existente se aprueba la ubicación del enlace; el título del texto crítico enlaza a su página en el idioma actual, mientras se conserva el cuerpo completo, y las pruebas cubren la ausencia de enlace sin traducción y los cuatro estados de disponibilidad sin acciones comerciales.
- Ubicación aprobada por instrucción del usuario de completar las tareas: el título existente es el enlace, según el plan. Tests dirigidos: 50/50 pasan; cubren rutas localizadas, conservación de cuerpo/autor y los cuatro estados sin acciones de compra. `pnpm --dir web verify`: build de 13 páginas y 333 tests pasa.
- Chrome DevTools: ficha ES revisada a 375×812 y 1280×900; sin overflow ni errores de consola. El dataset no asocia textos críticos a la obra publicada, así que no se pudo ver el enlace en una ficha real; queda pendiente para T12 cuando exista contenido aprobado. No se modificó Sanity.

- [x] **T8. Ampliar el sitemap de páginas (25 min).** RF-1, RF-4, RF-9, RF-13, RNF-5
- Hecho cuando: Vitest verifica que los cuatro listados aparecen incluso vacíos, que solo se incluyen páginas propias publicadas y que los alternates apuntan exclusivamente a versiones existentes.
- Verificación: `sitemap.test.ts` primero falló para índices/detalles editoriales ausentes y luego pasó (4/4); los índices ES/EN se incluyen siempre y los detalles/alternates solo para traducciones presentes. `pnpm --dir web verify` pasa (13 páginas, 334 tests).

- [x] **T9. Ampliar el sitemap de imágenes (20 min).** RF-3, RF-13, RNF-6
- Hecho cuando: Vitest verifica que cada imagen de exposición válida aparece asociada únicamente a una versión lingüística que la muestra, y que imágenes ausentes, inválidas o no transformables se omiten.
- Verificación: `image-sitemap.test.ts` primero falló para imágenes de exposición y luego pasa (2/2); prueba rutas ES/EN, imagen solo ES, asset ausente/mismatch y transformación fallida. `pnpm --dir web verify` pasa (13 páginas, 334 tests).

- [x] **T10. Verificar contratos de salida y build (30 min).** RF-1–RF-15, RNF-1, RNF-4–RNF-7
- Hecho cuando: las pruebas de salida comprueban rutas, contenido sin JavaScript de cliente, metadatos, datos estructurados parseables, alternates y sitemaps; el gate rechaza metadatos duplicados; `pnpm --dir web verify` pasa.
- Verificación: `pnpm --dir web verify` pasa (lint, tipos, build de 13 páginas, 22 suites y 336 tests). Las pruebas de salida validan los cuatro índices, sitemaps y todas las páginas/datos estructurados emitidos; las pruebas del gate rechazan títulos/descripciones repetidos. El dataset no contiene exposiciones ni textos críticos visibles, por lo que las comprobaciones condicionales de esos detalles no ejecutaron sobre contenido real.

- [x] **T11. Revisar exposiciones en Chrome DevTools y Lighthouse (30 min).** RF-1–RF-3, RF-6, RF-8–RF-15, RNF-1–RNF-7
- Hecho cuando: preview ES/EN se revisa a 375×812, 768×1024 y 1280×900 con listado vacío/poblado, exposición con/sin imagen y relaciones presentes/ausentes; no hay errores de navegación, overflow ni problemas de teclado/contraste; Lighthouse ES de listado y detalle alcanza ≥90 rendimiento, ≥95 accesibilidad y 100 SEO. Si falta contenido de prueba en `development`, se solicita autorización/datos sin modificar Sanity por cuenta propia.
- QA temporal: se crearon 28 documentos `[QA ONLY]` en `va9sgl77/development` para cubrir una exposición bilingüe con imagen/relaciones, otra sin imagen/relaciones y obras relacionadas en los cuatro estados. Se revisaron listados ES/EN a 375×812, 768×1024 y 1280×900; detalles con imagen/relaciones ES/EN a los tres anchos; y detalles sin imagen/sin relaciones ES/EN a 375×812 y 1280×900. Sin overflow; `alt`/dimensiones/`srcset`, relaciones y rutas/sitemaps correctos.
- Lighthouse CLI 13.5.0, móvil ES: listado **100/100/100** y detalle con imagen **99/100/100** (rendimiento/accesibilidad/SEO). Los documentos temporales se eliminaron y se confirmó que no quedan en Sanity ni en el build final; producción no se tocó.

- [x] **T12. Revisar textos críticos y enlaces desde obra en Chrome DevTools y Lighthouse (30 min).** RF-4–RF-7, RF-9–RF-15, RNF-1–RNF-7
- Hecho cuando: preview ES/EN se revisa a 375×812, 768×1024 y 1280×900, incluyendo original EN sin traducción ES, relaciones vacías y enlace desde obra que conserva el texto completo; Lighthouse ES del listado y detalle alcanza ≥90 rendimiento, ≥95 accesibilidad y 100 SEO; cualquier falta de datos representativos en `development` queda bloqueada hasta recibir autorización, sin modificar producción.
- QA temporal: con los documentos `[QA ONLY]` se comprobaron listados ES/EN y detalle bilingüe ES/EN a 375×812, 768×1024 y 1280×900; original EN sin equivalente ES (sin fallback y 404 ES); detalle ES sin relaciones a 375×812 y 1280×900; y enlace desde obra ES/EN, cuerpo conservado y foco visible a los tres anchos. Los cuatro estados se verificaron en fichas ES, sin acciones comerciales ni overflow.
- Lighthouse CLI 13.5.0, móvil ES: listado **100/100/100** y detalle **100/100/100** (rendimiento/accesibilidad/SEO). Se retiraron las 9 fixtures adicionales de layout y las 28 fixtures compartidas; se confirmó que los prefijos QA ya no aparecen en Sanity ni en el build final. Producción no se modificó.

- [x] **T13. Añadir enlace de salto accesible (20 min).** RNF-2
- Hecho cuando: `BaseLayout` ofrece antes de la cabecera un enlace ES/EN a `<main>`; queda oculto en reposo y se ve al recibir foco; el patrón está documentado en `design/tokens.md`, sin valores nuevos, y Vitest/Chrome comprueban foco, nombre accesible y 375/1280 px.
- Verificación: las pruebas dirigidas primero fallaron sin mensajes/markup y luego pasaron; `pnpm --dir web verify` pasa (13 páginas, 22 suites, 338 tests). Chrome DevTools comprobó en ES a 375×812 y 1280×900 que el primer Tab muestra “Saltar al contenido principal”, `:focus-visible` y `href="#main-content"`; Enter lleva al `main`. `documentWidth` coincide con cada viewport.

- [x] **T14. Autoalojar las fuentes definidas por diseño (30 min).** RNF-3, RNF-7
- Hecho cuando: Bodoni Moda 400 normal/itálica, Newsreader 400 normal/itálica y Geist 400/500 cargan desde WOFF2 locales Latin/Latin-Ext con `font-display: swap`; las licencias SIL OFL 1.1 quedan distribuidas; Chrome no solicita fuentes a terceros y usa las familias token en móvil/escritorio; `pnpm --dir web verify` pasa.
- Verificación: pruebas de salida comprobaron las 10 referencias WOFF2 locales y las tres licencias. `pnpm --dir web verify` pasa (13 páginas, 22 suites, 339 tests). Chrome DevTools en ficha de obra a 375×812 y 1280×900 confirmó Bodoni Moda para títulos, Newsreader para cuerpo, carga HTTP 200 desde `/fonts/`, sin peticiones de fuente a terceros y sin overflow (375 móvil; a 1280, `scrollWidth` coincide con `clientWidth`). Los subconjuntos Latin-Ext también se solicitaron correctamente.

- [x] **T15. Localizar la unidad visible de centímetros (15 min).** RNF-1
- Hecho cuando: el sufijo visible `cm` procede de una clave i18n ES/EN en la ficha técnica y en `unitText` de Schema.org; `CMT` se mantiene como código de unidad estructurado; `messages.test.ts` comprueba paridad. Los códigos estándar `ES`/`EN` del selector quedan fuera de esta tarea.
- Verificación: las pruebas dirigidas fallaron antes del cambio y pasaron después (81/81); comprobaron diccionarios, componente y HTML/JSON-LD ES/EN. Chrome DevTools verificó `48 × 70 cm`, `unitText: "cm"` y `unitCode: "CMT"` en ambas páginas; `pnpm --dir web verify` pasa con 13 páginas, 22 suites y 341 tests. Lighthouse móvil tras el autoalojamiento de fuentes: rendimiento 95, accesibilidad 100 y SEO 100.

- [x] **T16. Alinear `/exposiciones/` y `/en/exhibitions/` con el diseño `alejandro_fern_ndez_teller_a_exposiciones_trayectoria_muse_stica/` (~25 min).** RF-1–RF-3, RF-6, RF-8, RF-14–RF-15, RNF-1–RNF-3, RNF-6
- Hecho cuando: `ExhibitionIndex.astro` y las páginas `/exposiciones/index.astro` y `/en/exhibitions/index.astro` muestran la cabecera editorial `Exposiciones & Trayectoria` con indicadores reales de conteo/rango de años, el listado «Archivo Retrospectivo» en bloques de 12 columnas (año + fechas | título + sede + relaciones visibles | imagen opcional validada + enlace a detalle) y el cierre hacia contacto (`HomeContactSection`), omitiendo filtros, citas inventadas, ISBNs, libros y pólizas; `pnpm --dir web verify` y la revisión en Chrome DevTools (375/768/1280 px ES/EN) pasan.
- Verificación (2026-10-26): `pnpm --dir web verify` pasó (20 páginas, 433 tests). Chrome DevTools revisó `/exposiciones/` y `/en/exhibitions/` a 375/768/1280 px sin overflow (`scrollWidth === clientWidth`); Lighthouse móvil `/exposiciones/` A100/SEO100.
