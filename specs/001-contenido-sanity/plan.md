# Plan 001 — Gestión editorial de obras, series y exposiciones

Spec aprobada: `spec.md`. Este plan cubre modelo editorial, validación, publicación por idioma, consulta de contenido publicado y componentes de presentación. No crea ni modifica contenido de producción.

## Alcance y límites

- Sanity Studio será la interfaz editorial; Astro consultará Sanity solo durante el build y emitirá HTML estático. No habrá consultas ni JavaScript de Sanity en el navegador.
- Las páginas públicas solo recibirán versiones publicadas y completas. La creación de rutas, sus slugs y el contrato SEO/JSON-LD/sitemap pertenecen a las specs de páginas indicadas en la spec; este plan prepara los datos y componentes, pero no inventa esas decisiones.
- La gestión comercial, disponibilidad de prints, checkout, pagos, envíos y políticas quedan fuera de alcance.
- No se crearán proyectos ni datasets como parte de estas tareas. Para las pruebas de Studio se usará únicamente el dataset de desarrollo preexistente, administrado por el usuario; nunca se modificará contenido de producción.

## Archivos previstos y responsabilidad

| Archivo | Responsabilidad | Requisitos |
|---|---|---|
| `studio/package.json`, `studio/sanity.config.ts` | Studio independiente, configuración del proyecto, herramienta estándar `structureTool()` y registro de esquemas. La conexión usa configuración local/variables de entorno, nunca secretos versionados. | RF-1–RF-22 |
| `studio/schemaTypes/index.ts` | Registro de tipos y objetos de contenido. | RF-1–RF-8 |
| `studio/schemaTypes/documents/artwork.ts` | Datos compartidos obligatorios de obra, imagen principal y nota de taller opcional. La referencia a serie y las asociaciones a textos críticos se incorporan en T14 y T15, respectivamente, cuando los tipos de destino están registrados. | RF-1, RF-3, RF-9, RF-10, RF-12, RF-13, RF-20, RF-22 |
| `studio/schemaTypes/documents/artworkTranslation.ts` | Referencia a la obra y versión ES o EN de título, técnica, soporte y alt; cada idioma es un documento independiente con ciclo de borrador/publicación propio. | RF-2, RF-11, RF-14–RF-17 |
| `studio/schemaTypes/documents/series.ts`, `seriesTranslation.ts` | Datos compartidos e imagen opcional de serie; nombre y descripción editorial por idioma. | RF-4, RF-5, RF-13–RF-18, RNF-2 |
| `studio/schemaTypes/documents/exhibition.ts`, `exhibitionTranslation.ts` | Fechas, imagen y relaciones compartidas; título, lugar y alt por idioma. | RF-6, RF-7, RF-11, RF-13–RF-19 |
| `studio/schemaTypes/documents/criticalText.ts`, `criticalTextTranslation.ts` | Idioma original y asociaciones; título, cuerpo y autor independientes por idioma. La traducción se modela como documento opcional; nunca se copia la pieza original para cubrir otro idioma. | RF-3, RF-7, RF-8, RF-13, RF-16–RF-19 |
| `studio/schemaTypes/fields/*.ts` | Campos reutilizables de dimensiones, disponibilidad, referencias e imágenes localizadas, sin lógica de dominio duplicada. | RF-1, RF-6, RF-9, RF-11–RF-13 |
| `studio/schemaTypes/validation.ts` | Validaciones y mensajes editoriales de Studio; async check del inventario duplicado y referencias existentes. | RF-1, RF-4, RF-6, RF-9–RF-15 |
| `web/src/domain/content.ts` | Tipos puros de obra, serie, exposición, texto crítico, traducciones, relaciones y estados de publicación. No importa Astro ni Sanity. | RF-1–RF-8, RF-12, RF-14–RF-22 |
| `web/src/domain/availability.ts`, `inventory-number.ts`, `dimensions.ts`, `calendar-date.ts` | Value objects y validadores deterministas. El año actual se recibe como argumento para poder probar límites sin depender del reloj. | RF-9–RF-12 |
| `web/src/domain/completeness.ts` | Completitud de entidad/idioma; campos inválidos obligatorios generan errores, y opcionales inválidos se normalizan a ausentes. | RF-1–RF-8, RF-11–RF-17 |
| `web/src/domain/visibility.ts` | Reglas puras de visibilidad por idioma, asociaciones y disponibilidad. | RF-5, RF-17–RF-20 |
| `web/src/domain/catalog-validation.ts` | Comprobación global de unicidad de inventarios para el catálogo recibido durante el build. | RF-10 |
| `web/src/domain/*.test.ts` | Pruebas Vitest de value objects, completitud, visibilidad, relaciones, retirada/reaparición y límites de fechas/años. | RF-1–RF-22 |
| `web/src/infrastructure/sanity/client.ts` | Cliente de lectura para build con perspectiva `published`; configuración mediante variables de entorno. | RF-14–RF-19, RNF-1 |
| `web/src/infrastructure/sanity/queries.ts` | GROQ para documentos publicados, traducciones publicadas, relaciones y assets. Los borradores no entran en las páginas estáticas. | RF-5, RF-7, RF-14–RF-19 |
| `web/src/infrastructure/sanity/mappers.ts` | Mapeo defensivo de GROQ a dominio; verifica invariantes, normaliza opcionales, descarta traducciones incompletas y no inventa datos. | RF-1–RF-22, RNF-4 |
| `web/src/infrastructure/sanity/image-url.ts` | Generación de URL transformada, `srcset` responsive, `width`/`height` explícitos y formato WebP, con ancho servido máximo de 2000 px. | RF-1, RF-4, RF-6, RF-11, RNF-3 |
| `web/src/infrastructure/sanity/*.test.ts` | Fixtures GROQ y pruebas Vitest de mappers, traducciones, relaciones, valores nulos e imágenes opcionales rotas/inválidas. | RF-1–RF-22 |
| `web/src/i18n/es.ts`, `web/src/i18n/en.ts` | Añadir etiquetas localizadas para los cuatro estados de disponibilidad y etiquetas catalográficas utilizadas por componentes. | RF-12, RF-20 |
| `web/src/i18n/messages.test.ts` | Verificar paridad y presencia no vacía de las cuatro claves de disponibilidad en ambos idiomas. | RF-12 |
| `web/src/components/EditorialImage.astro` | Imagen accesible con `srcset`, dimensiones explícitas y alt validado. | RF-1, RF-4, RF-6, RF-11, RNF-3 |
| `web/src/components/ArtworkTechnicalSheet.astro`, `InventoryBadge.astro`, `AvailabilityLabel.astro` | Datos catalográficos, inventario y etiqueta textual localizada del estado del original. No representan ni infieren disponibilidad de prints. | RF-1, RF-9, RF-10, RF-12, RF-20, RF-21 |
| `web/src/components/ArtworkContent.astro` | Título, imagen principal, ficha, nota opcional, asociaciones críticas y relación visible a serie. | RF-1–RF-3, RF-5, RF-7, RF-18, RF-21, RF-22 |
| `web/src/components/SeriesContent.astro` | Nombre/descripción por idioma, imagen opcional y obras visibles; no renderiza una serie sin obras visibles en ese idioma. | RF-4, RF-5, RF-13, RF-18, RF-22 |
| `web/src/components/ExhibitionContent.astro` | Título/lugar traducidos, fechas, imagen y relaciones visibles. | RF-6, RF-7, RF-13, RF-18, RF-22 |
| `web/src/components/CriticalTextContent.astro` | Texto en su idioma original o traducción publicada completa; relaciones opcionales filtradas por idioma. | RF-3, RF-7, RF-8, RF-16–RF-18, RF-22 |
| `web/package.json`, `web/pnpm-lock.yaml`, `studio/package.json`, `studio/pnpm-lock.yaml` | Dependencias fijadas por separado para el sitio Astro y el Studio Sanity. | RF-1–RF-22, RNF-3 |

No se modifica `web/src/styles/global.css`: el plan usa los tokens vigentes. Las rutas y `web/src/layouts/BaseLayout.astro` quedan para la spec de páginas/SEO; esta spec excluye decidir slugs, metadatos, JSON-LD y sitemaps.

## Modelo de dominio y mappers

Los schemas se incorporan en orden de disponibilidad de sus tipos de referencia: T13 registra la obra y su traducción; T14 añade la relación con series al schema de obra; T15 añade las asociaciones a textos críticos. Esta secuencia evita registrar referencias a tipos que aún no existen en Studio.

- **`Artwork`**: ID estable, referencia obligatoria a `Series`, una imagen principal, año, dimensiones en cm, `InventoryNumber`, `Availability`, nota de taller opcional y relaciones a textos críticos. La traducción contiene título, técnica, soporte y alt. Año/dimensiones/inventario/disponibilidad son compartidos.
- **`Series`**: ID estable, traducciones con nombre obligatorio y descripción editorial opcional; imagen y alt opcionales. No contiene descripción SEO.
- **`Exhibition`**: ID estable, fechas compartidas, imagen/alt opcionales, referencias a cero o más obras/series; traducciones con título y lugar obligatorios.
- **`CriticalText`**: ID estable, idioma original (`es | en`), asociaciones opcionales a obras/series y traducciones independientes con título, cuerpo y autor. La traducción opcional solo se emite si está completa.
- **Value objects**: `Dimensions` acepta alto/ancho numéricos positivos con hasta un decimal; `InventoryNumber` valida `AFT-AAAA-NNN`, rango de año y secuencia; `Availability` es la unión cerrada de los cuatro estados; fecha de exposición es fecha de calendario real y fin no anterior al inicio.
- **Localización y publicación**: separar documentos de datos compartidos y documentos de traducción permite que cada traducción tenga su propio borrador Sanity y que publicar/despublicar un idioma no reemplace la otra traducción. Las relaciones almacenan referencias estables, no copias de títulos/cuerpo/autor.
- **Mapper**: recibe solo resultados GROQ de perspectiva publicada; convierte referencias a IDs de dominio, crea value objects, valida los campos obligatorios, elimina opcionales vacíos/inválidos y no aplica fallbacks entre idiomas. Imágenes opcionales cuyo asset no exista o cuyo alt no sea válido se normalizan a `undefined`; imagen principal inválida hace incompleta la traducción correspondiente.

## Algoritmo de publicación y visibilidad

```text
para cada documento compartido publicado y sus traducciones publicadas:
  validar campos compartidos con el año actual
  si tipo es obra/serie/exposición y ES no está completo y publicado:
    no emitir esa entidad en ningún idioma
  para cada idioma:
    validar traducción y campos requeridos de ese idioma
    si incompleta: no emitir esa versión
    si completa: emitir versión localizada con los datos compartidos

comprobar unicidad de inventoryNumber sobre las obras que se publicarían
si hay duplicados: fallar el build con IDs y valores duplicados (sin publicar salida nueva)

resolver relaciones solo contra destinos emitidos en el mismo idioma
no emitir relación/enlace a destino ausente, despublicado o incompleto
emitir serie solo si su traducción está publicada y queda al menos una obra visible
emitir exposición/texto crítico sin asociaciones cuando estén completos
para texto crítico: exigir versión original completa; emitir una traducción
  solo si esa traducción está publicada y completa
renderizar etiqueta de disponibilidad desde el diccionario ES/EN; nunca inferir prints
```

La acción de publicación en Studio es explícita. Completar campos no publica. Una edición conserva la versión publicada mientras el borrador permanece separado. Obra, serie y exposición requieren primero una versión ES completa; EN solo se emite si su versión también está completa. Para el texto crítico se exige la versión original declarada, que puede ser EN. Despublicar una traducción o el documento compartido hace que el siguiente build retire su salida y sus enlaces, sin redirecciones.

## Interfaz y tokens

- **Sanity Studio** ofrece campos agrupados por datos compartidos/idioma, validación próxima al campo y estado de referencias. Se mantiene la interfaz estándar de Studio; Tailwind/tokens del sitio no se aplican a esa aplicación externa.
- **Componentes Astro de contenido** son presentacionales y sin hidratación. Los datos llegan desde los mappers. `ArtworkContent` compone `EditorialImage`, `ArtworkTechnicalSheet`, `InventoryBadge`, `AvailabilityLabel` y contenido relacionado. Series, exposiciones y textos críticos usan sus componentes indicados arriba.
- **Tokens**: fondo `surface-container-lowest`; panel de ficha `surface-container-low`; títulos `headline-md`/`headline-sm` con Bodoni Moda; cuerpo `body-md` con Newsreader; etiquetas/datos catalográficos `label-technical`/`label-caption` con Geist; espacios `space-md`/`space-lg`, gutters responsive y breakpoints `tablet` (768 px)/`desktop` (1280 px). Inventario usa placa opaca según el patrón documentado. Texto siempre sólido con combinaciones AA; sin valores arbitrarios, radios nuevos ni cambios de `@theme`.
- La disponibilidad siempre incluye texto localizado. Como la spec asigna el tratamiento visual de estados a spec 002, aquí no se inventa una codificación cromática por estado; se usa texto sólido legible hasta que el patrón de spec 002 esté aprobado.
- El plan no crea rutas ni decide metadatos/JSON-LD/sitemap. La Constitución exige esos elementos para páginas públicas; serán una dependencia obligatoria de las specs de páginas (y de spec 006), no una garantía que esta entrega de contenido pueda cerrar por sí sola.

## Decisiones técnicas

| Decisión | Motivo | Alternativa descartada |
|---|---|---|
| Astro estático consulta solo la perspectiva publicada durante build. | Mantiene HTML indexable, evita exposición de borradores y satisface la regla de no consultar Sanity desde cliente. | Fetch de Sanity en navegador o render dinámico por visita. |
| Documentos de traducción independientes de documento compartido, con regla de ES base para obra/serie/exposición. | El borrador/publicación de Sanity es por documento; separar traducciones permite conservar ES publicado mientras EN se edita. La elegibilidad sigue RF-15: EN no crea una entidad pública sin ES completo. | Un documento con objeto `es/en`: una publicación de documento puede publicar conjuntamente cambios de ambos idiomas. |
| Validación duplicada: reglas en Studio y validadores puros/build. | Da feedback editorial y hace que el mapper/site no confíen en datos externos. | Confiar solo en validaciones del formulario o solo en validación visual del sitio. |
| Consultas GROQ hacen elegibilidad de publicación; reglas de visibilidad se verifican además en dominio. | Evita salida incompleta y permite pruebas rápidas sin Sanity. | Resolver las relaciones únicamente en componentes Astro o consultar en navegador. |
| WebP transformado con anchos responsive hasta 2000 px y dimensiones de asset en HTML. | Cumple límite de imagen servida, responsive y layout estable. | Entregar URL original o depender del navegador para transformar el asset. |
| Relación a texto crítico por referencia, nunca duplicar contenido en obra. | Conserva fuente editorial única y permite editar asociaciones sin copiar título/cuerpo/autor. | Campos de texto crítico embebidos/copiados en obras y series. |

### Garantías de Sanity: alcanzabilidad y límites

- **Borradores/publicado independiente por idioma (RF-14–RF-17): alcanzable** con documentos de traducción separados y consultas a perspectiva `published`. Sanity conserva el documento publicado mientras existe el borrador de ese documento.
- **Compleción/formatos (RF-1–RF-9, RF-11–RF-13): alcanzable en flujo editorial de Studio y en contenido publicado del sitio** mediante validaciones custom y revalidación dominio/build. Las reglas de esquema de Sanity se ejecutan en Studio, no son restricciones del Content Lake/API; una mutación directa podría saltárselas. Los mappers filtran contenido incompleto y el pipeline debe impedir que una salida inválida se despliegue.
- **Inventario global único (RF-10): no existe restricción transaccional única nativa de Sanity.** Se hará validación asíncrona en Studio y comprobación de catálogo en build. Esto garantiza que un catálogo duplicado no se despliegue, pero no impide absolutamente que existan documentos publicados duplicados dentro del dataset o una carrera entre editores. Si RF-10 exige unicidad también dentro de Content Lake, Sanity por sí solo no ofrece esa garantía: hace falta aprobar un servicio/flujo de reserva con unicidad transaccional o ajustar el alcance de la garantía.
- **Imágenes (RNF-3): alcanzable para recursos servidos** mediante CDN de imágenes Sanity, URL de transformación WebP, anchos `srcset` limitados a 2000 px y `width`/`height`; no garantiza que el archivo original subido al CMS mida 2000 px o menos, solo que la web no lo sirve por encima del límite.
- **Retirada al perder completitud (RF-17): alcanzable para el sitio estático** si el webhook activa un build correcto y el mapper excluye la versión incompleta. La publicación/despublicación de Sanity no cambia el sitio hasta que Cloudflare Pages termina el rebuild; durante ese intervalo seguirá visible la última versión desplegada.
- **SEO/JSON-LD/sitemap** no los resuelve esta spec: fuera de su alcance explícito, pero requeridos por la Constitución para páginas públicas. No se deben dar por cubiertos por el presente plan; son puerta de salida de las specs de páginas/006.

Referencias de plataforma: [documentos y borradores](https://www.sanity.io/docs/content-lake/documents), [validación de Studio y alcance client-side](https://www.sanity.io/docs/content-lake/schema-validation-and-the-content-lake), [perspectiva publicada](https://www.sanity.io/docs/content-lake/presenting-and-previewing-content), [transformaciones de imagen](https://www.sanity.io/docs/apis-and-sdks/image-urls).

## Puntos de «⚠️ Preguntar antes» (AGENTS.md)

Antes de implementación, pedir aprobación explícita para:

1. Añadir dependencias de cliente Sanity, image-url y Studio; fijar versiones e instalar/actualizar lockfiles.
2. Crear schemas en `studio/` y cambiar tipos públicos/value objects de `web/src/domain/`.
3. Añadir componentes/patrones visuales nuevos. Este plan limita su composición a patrones/tokens ya documentados; no modifica `@theme`, paleta, tipografía ni layout existente.
4. Añadir configuración de proyecto/dataset o servicios externos no existentes. Las pruebas usan el dataset de desarrollo existente y administrado por el usuario; no se crean datasets ni se toca producción bajo este plan.

## Estrategia de verificación

1. **Vitest, primero para dominio y mappers:** pruebas de formato/rangos y bordes de año actual; dimensiones con 0/1 decimal y rechazos; fechas reales/fin anterior; alt vacío, >150 e igual al título; opcionales inválidos omitidos; las cuatro disponibilidades; publicaciones por idioma; independencia de borradores/publicados; series sin obras; relaciones ausentes/reaparecidas; crítico EN sin ES; traducción retirada; inventario duplicado; fixtures GROQ con assets/referencias faltantes. No requiere acceso a Sanity.
2. **Studio:** comprobar en dataset local/no productivo los mensajes de validación, asociación entre documentos, borrador que no altera la traducción publicada, publicar/despublicar por idioma y feedback de campo faltante. Verificar manualmente el caso límite de inventario duplicado y documentar la limitación transaccional indicada arriba.
3. **Build:** ejecutar `pnpm --dir studio build` y `pnpm --dir web verify`; inspeccionar que consultas usan `published`, que la salida HTML contiene solo contenido aprobado, que documento/referencia incompletos no producen enlaces y que duplicados de inventario bloquean la nueva salida. Comprobar imágenes emitidas en WebP, todos los anchos `<=2000` y dimensiones explícitas.
4. **Chrome DevTools:** en preview estático revisar cada componente en 375 px y escritorio (≥1280 px), comprobar ausencia de overflow, contenido renderizado sin JavaScript, textos alternativos/etiquetas accesibles y enlaces únicamente a destinos visibles. Validar estilos frente a `design/tokens.md`; no atribuir aquí auditoría SEO/JSON-LD a páginas aún no especificadas.

## Cobertura de requisitos funcionales

| Requisito | Parte del plan |
|---|---|
| RF-1–RF-3 | Esquemas/types/mapper de obra, ficha y asociaciones de textos críticos; tests de campos y ausencia de duplicación. |
| RF-4–RF-5 | Esquemas y componente/visibilidad de serie; filtro por idioma y al menos una obra visible. |
| RF-6–RF-7 | Exposición, fechas/imagen opcional, asociaciones filtradas y pruebas. |
| RF-8 | Modelo de idioma original y publicación sin traducción obligatoria; pruebas ES/EN. |
| RF-9–RF-10 | Value objects de dimensiones/inventario, validación global, Studio y tests de límites/unicidad. |
| RF-11 | Validadores alt, completitud específica de imagen obligatoria/opcional, componentes de imagen y pruebas. |
| RF-12 | Unión Availability, claves ES/EN verificadas por Vitest y etiqueta textual. |
| RF-13 | `completeness.ts`, normalización de opcionales inválidos y pruebas. |
| RF-14–RF-15 | Documentos por idioma, drafts separados, publicación explícita, ES completo como base para obra/serie/exposición y validación de cada versión. |
| RF-16 | Texto crítico independiente en idioma original; traducciones opcionales sin fallback. |
| RF-17 | Query de publicados + filtro de completitud + rebuild; tests de retirada localizada. |
| RF-18 | Resolución de relaciones solo contra destinos visibles del mismo idioma y tests de reaparición. |
| RF-19 | Perspectiva publicada y retirada por despublicación; no se generan redirecciones en el flujo de contenido. |
| RF-20 | `AvailabilityLabel` localizada; no existe mapper/regla que derive disponibilidad de prints. |
| RF-21 | `ArtworkTechnicalSheet` compone la línea desde los campos de dominio, sin campo duplicado. |
| RF-22 | Mapper sin generación/fallback de contenido y pruebas con faltantes, relaciones e idiomas ausentes. |

## Dependencias y condiciones de cierre

- Aprobación previa de dependencias, esquemas/tipos y componentes conforme a la sección anterior.
- La spec 002 debe definir el tratamiento visual final de estados; las specs de páginas/006 deben definir rutas, metadatos y artefactos SEO constitucionales.
- La condición de RF-10 sobre unicidad en Content Lake requiere decisión si el requisito abarca más que el catálogo público generado.
- No se considera completa la implementación hasta que `pnpm --dir studio build`, `pnpm --dir web verify`, la inspección de preview con Chrome DevTools y las comprobaciones de imágenes/datos publicados estén verdes.
