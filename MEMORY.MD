# MEMORY.md — AF Tellería
Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no
aporte.
## Estado actual
- Spec 000 aprobada; T1–T10 completadas. T2–T7: fundación estática ES/EN y gate `pnpm verify`. T8: Cloudflare Pages conectado a Git, publica solo tras el gate. T9: build fallido (`77900cc`) mantuvo la home activa en HTTP 200; reversión (`460a10e`) desplegó y verificó correctamente (RF-15, RF-16, RF-25). T10: revisión visual/accesible y Lighthouse móvil ES/EN (100 rendimiento, 100 accesibilidad, 100 SEO); layout tablet y nombres accesibles corregidos (RF-21, RF-22; RNF-2, RNF-3, RNF-7).
- Publicación limitada al gate `pnpm verify`, sin rollback por HTTP posterior. RF de publicación: RF-16 y RF-25.
- Diseño Stitch exportado y documentado en `design/tokens.md`.
- Cambio de dirección solicitado el 2026-10-07: el producto ofrecerá compra de originales disponibles y prints mediante pasarela. Brief actualizado; proveedor, tamaños, precios, logística, políticas y reglas de stock siguen pendientes. No implementar hasta aprobar una spec comercial.
## Decisiones (y por qué)
- Astro estático + Sanity (plan gratuito) + Cloudflare Pages: contenido casi estático, SEO
  como prioridad, coste cero.
- Sin backend ni base de datos: el flujo de consultas se resuelve con función serverless +
  email. Evitar sobreingeniería.
- Se prevé comercio electrónico para originales disponibles y prints. No se ha elegido pasarela ni cerrado las condiciones de venta; no almacenar ni procesar datos sensibles de tarjeta en el proyecto.
- DDD ligero (dominio tipado + mapeo desde Sanity), sin bounded contexts ni agregados.
- El estado de disponibilidad de cada obra lo cambia el artista a mano en Sanity.
- Tailwind CSS v4; `design/tokens.md` es la fuente de verdad y `@theme` debe reflejarlo.
- La publicación se condiciona al éxito de `pnpm verify`, incluida la presencia de homes ES/EN y 404 en el build; el HTTP 200 se comprueba tras el primer despliegue y no causa rollback automático.
- Canonical/hreflang usan temporalmente `https://telleria-art.pages.dev`; actualizar al dominio propio cuando se compre y configure.
- El repo separa los paquetes independientes en `web/` (Astro) y `studio/` (Sanity); cada paquete instala y ejecuta sus comandos con `pnpm --dir <paquete>`.
## Aprendizajes y errores a evitar
- (vacío por ahora)
## Próximos pasos
- Spec 000 completada y conservada como registro de la fundación sin comercio; RF-13 solo describe esa entrega histórica.
- Spec 001 — Gestión editorial: spec, plan y `tasks.md` aprobados para ejecutarse como una única spec (28 tareas). La revisión Chrome de componentes depende de rutas de una spec de páginas; RF-10 se garantiza en el catálogo público mediante build, no por unicidad transaccional de Content Lake.
- T1 de Spec 001 completada: el usuario aprobó explícitamente dependencias de Sanity/imagen/Studio, schemas y validaciones Sanity, y tipos públicos/value objects de dominio para las tareas futuras; no se inició ninguna de ellas.
- T2 de Spec 001 completada: Studio independiente con dependencias y lockfile fijados, configuración sin secretos ni proyecto/dataset de producción y arranque local verificado; `pnpm verify` pasó. La versión Sanity 6.18 requiere `sanity.cli.ts`; lint excluye sus artefactos generados.
- T3 de Spec 001 completada: `Availability` y `Dimensions` implementados con TDD; API elegida y casos cubiertos documentados en `tasks.md` (RF-9, RF-12).
- T4 de Spec 001 completada: `InventoryNumber` implementado con TDD; factoría `createInventoryNumber(value, currentYear)` y validación del formato/rangos documentadas en `tasks.md` (RF-10). `pnpm verify` pasó.
- T5 de Spec 001 completada: fechas de exposición ISO `YYYY-MM-DD` validadas con TDD; `createCalendarDate` valida días reales y `createExhibitionDates` exige inicio y comprueba el fin opcional (RF-6). `pnpm verify` pasó (72 tests).
- T6 de Spec 001 completada: `checkArtworkCompleteness(input, currentYear)` valida datos compartidos y traducción de obra; alt y opcionales se validan/normalizan sin inventar contenido (RF-1–RF-3, RF-9, RF-11–RF-13, RF-22). TDD: 23 tests; `pnpm verify` pasó (95 tests). El contrato y las decisiones quedan anotados en `tasks.md`.
- T7 de Spec 001 completada: validadores de completitud por traducción para series y exposiciones; verifican nombres/títulos/lugares, fechas y normalizan imágenes/relaciones opcionales inválidas (RF-4–RF-7, RF-11, RF-13, RF-15). TDD: 37 tests; `pnpm verify` pasó (132 tests). Elegibilidad ES/EN queda para T9.
- T8 de Spec 001 completada: `checkCriticalTextCompleteness(input)` valida idioma original y sus campos obligatorios; omite traducciones secundarias incompletas sin fallback ni invención (RF-7, RF-8, RF-13, RF-16, RF-22). TDD: 19 tests; `pnpm verify` pasó (151 tests). Contrato documentado en `tasks.md`.
- T9 de Spec 001 completada: `transitionPublication` separa borradores/publicaciones por idioma, exige acciones explícitas y aplica gates/retiros por completitud o despublicación (RF-14–RF-17, RF-19). TDD: 30 tests; `pnpm verify` pasó (181 tests). API y decisiones documentadas en `tasks.md`.
- T10 de Spec 001 completada: `visibility.ts` oculta series sin obras visibles del mismo idioma y filtra relaciones por destinos publicados/visibles sin mutar la fuente; reevaluarlas restablece relaciones automáticamente (RF-5, RF-7, RF-18, RF-19, RF-22). TDD: 5 tests; `pnpm verify` pasó con 186 tests. API y decisión documentadas en `tasks.md`.
- T11 de Spec 001 completada: `catalog-validation.ts` detecta valores de inventario duplicados con todos sus IDs y proporciona `assertUniqueInventoryNumbers` para bloquear el build (RF-10). TDD: 4 tests; `pnpm verify` pasó con 190 tests. API documentada en `tasks.md`.
- T12 de Spec 001 completada: Studio registra tipos compartidos de dimensiones/disponibilidad y exporta builders para referencias e imagen/alt; reusa validadores de dominio (RF-9, RF-11–RF-13). Se ajustó el criterio para que T12 no dependa de schemas de tareas posteriores; T13–T15 serán consumidores. Tests nuevos demostraron primero el fallo y después pasaron; `pnpm --dir sanity build` y `pnpm verify` pasaron (192 tests).
- T13 de Spec 001 completada: schemas base de obra y traducción independiente ES/EN registrados, con imagen, dimensiones, disponibilidad, inventario y nota opcional (RF-1–RF-3, RF-9, RF-10, RF-12, RF-20, RF-22). Por la secuencia aprobada, la relación con series queda en T14 y las asociaciones a textos críticos en T15. `pnpm --dir sanity build` y `pnpm verify` pasaron (192 tests). Chrome DevTools mostró “Project not found” para `local-project`, así que el formulario no pudo revisarse visualmente sin crear proyecto/dataset.
- T14 de Spec 001 completada: schemas compartidos y traducciones de serie/exposición registrados; artwork ahora referencia series, y las imágenes opcionales tienen alt localizado. Exposiciones almacenan fechas y asociaciones opcionales a obras/series (RF-1, RF-4–RF-7, RF-11, RF-13, RF-15, RF-18). `pnpm --dir sanity build` y `pnpm verify` pasaron (192 tests). Chrome DevTools confirmó que `local-project` impide abrir formularios en móvil/escritorio; no se creó proyecto/dataset.
- T15 de Spec 001 completada: schemas independientes de texto crítico y traducción registrados; texto crítico almacena idioma original y asociaciones opcionales a obras/series, y obras pueden asociar textos sin duplicar su contenido (RF-3, RF-7, RF-8, RF-16, RF-18, RF-22). `pnpm --dir sanity build` y `pnpm verify` pasaron (192 tests). Chrome DevTools confirmó “Project not found” para `local-project` a 375 y 1280 px; no se creó proyecto/dataset.
- Comercio: resolver las dudas abiertas de `docs/product-brief.md` antes de redactar/aprobar su spec.
