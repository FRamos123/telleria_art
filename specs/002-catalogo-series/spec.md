# Spec 002 — Catálogo de obras y series
Estado: borrador

## Contexto y objetivo

Permitir que visitantes exploren las obras y series publicadas, consulten las obras de cada serie y lleguen desde los listados a la ficha pública de una obra. La información se presentará en español e inglés solo cuando esté publicada en el idioma correspondiente. El catálogo debe facilitar el descubrimiento de la obra sin inventar datos o textos del artista ni introducir funciones comerciales.

## Usuarios

- Visitantes que desean explorar las obras y series del artista.
- Coleccionistas, curadores e instituciones que desean localizar obras y consultar su estado.

## Historias de usuario

- **HU-1.** Como visitante, quiero recorrer el catálogo de obras para descubrir piezas publicadas y acceder a sus fichas.
- **HU-2.** Como visitante, quiero abrir una serie y ver sus obras publicadas para comprender qué piezas la componen.
- **HU-3.** Como visitante, quiero leer el catálogo y las series en español o inglés cuando exista esa versión para navegar en mi idioma.
- **HU-4.** Como visitante, quiero identificar el estado del original mediante texto para comprender su disponibilidad sin depender del color.
- **HU-5.** Como artista, quiero mantener por idioma el resumen SEO del catálogo para controlar cómo se describe esa página en los resultados de búsqueda.

## Definiciones

- **Obra visible:** obra declarada publicada y completa en el idioma consultado según la spec 001. Esta spec consume esa condición y no vuelve a validar completitud editorial.
- **Serie visible:** serie publicada en el idioma consultado que tiene al menos una obra visible asociada en ese mismo idioma.
- **Tarjeta de obra:** resumen enlazable de una obra en un listado, con imagen, título, año y disponibilidad textual.
- **Disponibilidad:** estado del original: `disponible`, `reservada`, `vendida` o `en colección`; no determina la disponibilidad de prints.
- **Enlace identificable:** enlace con texto accesible que no se distingue únicamente por su color.
- **Descripción SEO del catálogo:** resumen opcional y aprobado por el artista, independiente para ES y EN y aplicable solo a la página general del catálogo; no es la descripción de una obra ni de una serie.

## Requisitos funcionales

- **RF-1. Catálogo de obras.** CUANDO una persona visite el catálogo en un idioma, EL SISTEMA mostrará únicamente las obras visibles en ese idioma según la spec 001, como tarjetas con imagen principal, título, año y etiqueta textual de disponibilidad. EL SISTEMA no volverá a validar ni alterar los criterios de visibilidad definidos allí.
- **RF-2. Orden de obras.** CUANDO EL SISTEMA muestre obras en el catálogo general o en una página de serie, EL SISTEMA las ordenará por año descendente y, dentro del mismo año, por número de inventario ascendente. EL SISTEMA no aplicará un orden editorial manual en esta versión.
- **RF-3. Acceso a series.** CUANDO existan series visibles en el idioma consultado, EL SISTEMA mostrará encima de la cuadrícula un bloque con enlaces a cada una de sus páginas. EL SISTEMA no añadirá un control para filtrar el catálogo general por serie.
- **RF-4. Página de serie.** CUANDO una persona abra una serie visible, EL SISTEMA mostrará el nombre de la serie, la descripción editorial y la imagen opcionales cuando existan y estén publicadas en ese idioma, y las tarjetas de las obras visibles asociadas.
- **RF-5. Navegación entre obras y series.** CUANDO una persona active una tarjeta de obra, EL SISTEMA la llevará a la ficha individual publicada de esa obra. CUANDO una persona active el enlace de una serie, EL SISTEMA mostrará las obras visibles de esa serie. EL SISTEMA ofrecerá acceso de regreso al catálogo desde las páginas de serie y enlaces solo a destinos públicos disponibles en el idioma actual.
- **RF-6. Visibilidad de relaciones.** CUANDO una obra visible esté asociada a una serie visible en el idioma actual, EL SISTEMA ofrecerá desde la ficha de obra un enlace a esa serie. SI la serie asociada no está publicada, completa o visible en ese idioma, ENTONCES EL SISTEMA mostrará la obra en el catálogo general sin enlace a la serie. EL SISTEMA conservará la relación editorial aunque no la muestre.
- **RF-7. Visibilidad de series.** SI una serie no está publicada en el idioma consultado o no tiene al menos una obra visible asociada en ese idioma, ENTONCES EL SISTEMA la omitirá del acceso a series y no expondrá su página pública.
- **RF-8. Idiomas.** EL SISTEMA ofrecerá el catálogo en español e inglés aunque uno de los idiomas no tenga obras visibles. CUANDO una serie tenga versiones publicadas en ambos idiomas, EL SISTEMA permitirá navegar entre ellas y declarará su relación. SI falta o no está publicada una versión de una serie, ENTONCES EL SISTEMA conservará la versión disponible y omitirá el enlace y la relación hacia la versión inexistente, sin mostrar contenido de otro idioma como sustitución.
- **RF-9. Catálogo vacío.** SI no hay obras visibles en el idioma consultado, ENTONCES EL SISTEMA conservará el acceso al catálogo y mostrará un mensaje funcional localizado que no se presente como contenido del artista. EL SISTEMA no recurrirá a obras ni textos de otro idioma.
- **RF-10. Disponibilidad en tarjetas.** EL SISTEMA mostrará siempre el estado del original como texto localizado: «Disponible»/«Available», «Reservada»/«Reserved», «Vendida»/«Sold» o «En colección»/«In collection». EL SISTEMA aplicará a cada estado el tratamiento de color correspondiente definido en `design/tokens.md`; el color no será el único indicador. EL SISTEMA no mostrará acciones de adquisición para ninguno de los cuatro estados en esta versión.
- **RF-11. Visibilidad editorial.** CUANDO EL SISTEMA incluya una obra o serie, utilizará exclusivamente su condición de visibilidad determinada por la spec 001 y no revalidará sus datos. SI el estado, el texto alternativo o la traducción de una obra es inválido según la spec 001, ENTONCES EL SISTEMA no mostrará esa obra como visible en el idioma afectado.
- **RF-12. Imágenes y texto alternativo.** CUANDO EL SISTEMA muestre una obra, utilizará su imagen principal y el texto alternativo asociado al idioma publicado, conforme a las reglas de la spec 001, que esta spec no repite. SI falta una imagen obligatoria de una obra, ENTONCES esa obra no será visible según la spec 001. SI una imagen opcional de serie falta o no es válida según la spec 001, ENTONCES EL SISTEMA omitirá la imagen sin bloquear la serie.
- **RF-13. Contenido editorial ausente.** SI una descripción opcional de serie está vacía o no publicada en el idioma consultado, ENTONCES EL SISTEMA omitirá el bloque editorial sin usar una descripción de otro idioma. EL SISTEMA no inventará títulos, nombres, imágenes, datos ni textos del artista.
- **RF-14. Metadatos y descripciones SEO.** Las meta descriptions son metadatos independientes del contenido editorial, salvo cuando la spec indique su fuente. CUANDO una página de serie esté publicada y exista su descripción editorial, EL SISTEMA derivará su meta description de los primeros 155 caracteres, terminando en el último límite de palabra que no supere esa longitud. SI la descripción editorial no existe, ENTONCES EL SISTEMA generará una meta description localizada mediante una plantilla que contenga el nombre de la serie y el nombre del artista. Para el catálogo, EL SISTEMA usará únicamente la descripción SEO global aprobada y localizada definida en RF-20; si no existe para el idioma actual, la omitirá. EL SISTEMA proporcionará títulos de página únicos, direcciones canónicas y relaciones `hreflang` solo entre versiones publicadas. SI el build detecta títulos o meta descriptions duplicados entre páginas públicas, ENTONCES fallará.
- **RF-15. Datos estructurados.** CUANDO una ficha individual de obra esté publicada, EL SISTEMA incluirá datos estructurados `VisualArtwork` con nombre, imagen, fecha, técnica, soporte, dimensiones, creador e idioma. CUANDO una página de serie esté publicada, EL SISTEMA incluirá datos estructurados `CollectionPage` con la lista de obras visibles de esa serie en ese idioma.
- **RF-16. Sitemap.** CUANDO una página de catálogo, obra o serie esté visible en un idioma, EL SISTEMA la incluirá en el sitemap con sus alternates de idioma publicados. EL SISTEMA incluirá en el sitemap de imágenes la imagen principal de cada obra visible y la imagen de serie solo si existe y es válida; SI la imagen de serie falta o no es válida, ENTONCES la omitirá sin error.
- **RF-17. Rutas no visibles.** SI una persona solicita una dirección de ficha o serie no visible, retirada o inexistente, ENTONCES EL SISTEMA responderá con HTTP 404 y mostrará la página 404 bilingüe definida en la spec 000, sin redireccionar.
- **RF-18. Sin comercio.** EL SISTEMA no ofrecerá acciones de adquisición, compra, checkout, pagos, precios, gestión de pedidos ni promesas de disponibilidad de prints. EL SISTEMA mostrará la disponibilidad del original únicamente como información editorial.
- **RF-19. Verificación de estados.** CUANDO se verifique cada uno de los cuatro estados en cada idioma, EL SISTEMA tendrá una prueba que compruebe la etiqueta localizada correcta y la ausencia de acciones de adquisición, para un total de ocho combinaciones.
- **RF-20. Descripción SEO global del catálogo.** EL SISTEMA permitirá a la persona editora mantener descripciones SEO opcionales e independientes para el catálogo ES y EN desde la configuración global del sitio. CUANDO exista una descripción aprobada y publicada en el idioma actual, EL SISTEMA la incluirá solo en la meta description de la página general del catálogo de ese idioma. SI falta para ese idioma, ENTONCES EL SISTEMA omitirá la meta description sin usar el texto del otro idioma ni derivarla de una obra o serie.

## Requisitos no funcionales

- **RNF-1. i18n.** El catálogo, las páginas de serie, las etiquetas de estado y los mensajes funcionales estarán disponibles en español e inglés. No habrá fallback de contenido; los enlaces y las relaciones lingüísticas solo apuntarán a versiones publicadas.
- **RNF-2. Accesibilidad.** Las páginas cumplirán WCAG 2.2 nivel AA, con contraste mínimo de 4.5:1 para texto normal y 3:1 para texto grande. Los enlaces serán utilizables mediante teclado e identificables según la definición de esta spec. Las imágenes tendrán texto alternativo y la disponibilidad tendrá etiqueta textual, no solo color.
- **RNF-3. Diseño y responsive.** La presentación respetará los tokens y patrones existentes. En móvil (menos de 768 px) usará una columna; en tablet (768–1279 px), ocho columnas; y en escritorio (1280 px o más), doce columnas. EL SISTEMA se verificará a 375, 768 y 1280 px con contenido mínimo y máximo, incluidos títulos y nombres de serie largos. En cada caso se verán los cuatro datos de la tarjeta sin recortes, solapes ni desplazamiento horizontal.
- **RNF-4. Contenido y renderizado.** Las páginas públicas se generarán durante el build y su contenido principal estará presente en el HTML sin ejecutar JavaScript.
- **RNF-5. SEO.** Las páginas públicas tendrán metadatos únicos, canonical, `hreflang` solo entre versiones publicadas, datos estructurados y presencia coherente en los sitemaps de páginas e imágenes.
- **RNF-6. Imágenes.** Las imágenes se servirán en AVIF o WebP, con lado mayor de hasta 2000 px, al menos tres tamaños responsive y atributos `width` y `height` explícitos. Se cargarán de forma diferida salvo la imagen principal visible al cargar la página. Como objetivos de revisión no bloqueantes, las imágenes de tarjeta no superarán 150 KB y la imagen principal de ficha no superará 500 KB. El alt cumplirá las reglas de la spec 001 y esta spec no las repetirá.
- **RNF-7. Verificación.** Se ejecutará Lighthouse manualmente en móvil, sobre el build de producción en preview, para el catálogo ES, una ficha de obra ES y una página de serie ES. Cada página evaluada alcanzará al menos 90 en rendimiento, 95 en accesibilidad y 100 en SEO.
- **RNF-8. Texto sólido.** Todo texto, incluidas etiquetas, descripciones y estados, usará colores sólidos sin opacidad, conforme a los tokens de diseño.

## Casos límite

| Situación | Comportamiento esperado |
|---|---|
| No hay obras visibles en ES o EN | El catálogo permanece disponible en ambos idiomas; el idioma sin obras muestra un estado vacío localizado, sin contenido de otro idioma. |
| Una obra tiene estado, alt o traducción inválidos según la spec 001 | No se considera visible en el idioma afectado; esta spec no revalida esos datos. |
| Una obra es visible, pero su serie no lo es en ese idioma | La obra aparece en el catálogo general y no enlaza a la serie; la relación se conserva. |
| Una serie no tiene obras visibles en el idioma | Se omite del bloque de series, de su página pública y del sitemap de ese idioma. |
| Falta o no es válida la imagen principal obligatoria | La obra no es visible según la spec 001 y no aparece en listados ni sitemap. |
| Falta o no es válida la imagen opcional de una serie | Se omite la imagen y su entrada de sitemap; la serie puede seguir visible. |
| Falta la descripción editorial de una serie | La meta description se genera con la plantilla localizada que contiene el nombre de la serie y del artista. |
| Falta la descripción SEO aprobada del catálogo en un idioma | Se omite la meta description en ese catálogo; no hay fallback al otro idioma ni a textos de obras/series. |
| Solo existe descripción SEO del catálogo en un idioma | Se usa únicamente en la página de catálogo de ese idioma; la otra página omite la meta description. |
| La descripción editorial de serie supera 155 caracteres | La meta description termina en el último límite de palabra dentro de los primeros 155 caracteres. |
| Dos páginas públicas tienen el mismo título o meta description | Falla la verificación del build. |
| El estado del original es `disponible` / `available` | Se muestra la etiqueta correcta para el idioma y no hay acción de adquisición. |
| El estado del original es `reservada` / `reserved` | Se muestra la etiqueta correcta para el idioma y no hay acción de adquisición. |
| El estado del original es `vendida` / `sold` | Se muestra la etiqueta correcta para el idioma y no hay acción de adquisición. |
| El estado del original es `en colección` / `in collection` | Se muestra la etiqueta correcta para el idioma y no hay acción de adquisición. |
| Se solicita una ficha o serie no visible, retirada o inexistente | Se responde HTTP 404 con la página bilingüe de la spec 000 y sin redirección. |
| Una imagen supera el objetivo de peso de revisión | El objetivo incumplido se registra como no bloqueante y no invalida por sí solo la publicación. |
| Título o nombre de serie muy largo en móvil, tablet o escritorio | Los cuatro datos de la tarjeta permanecen visibles sin recorte, solape ni desplazamiento horizontal. |

## Fuera de alcance

- Acciones de adquisición, compra, checkout, pagos, precios, gestión de pedidos y promesas de disponibilidad de prints.
- Filtros por serie, búsqueda avanzada, orden editorial manual en la versión 1 y controles de ordenación elegidos por el visitante.
- Información completa de una obra que corresponda a su ficha individual; las tarjetas se limitan a imagen, título, año y estado.
- Redacción, invención o traducción automática de obras, nombres de series, descripciones u otro contenido del artista.
- Rediseño o incorporación de nuevos patrones y tokens visuales no acordados.

## Criterios de finalización

- [ ] El catálogo muestra solo obras visibles en el idioma actual y cada tarjeta incluye imagen, título, año y disponibilidad textual.
- [ ] El catálogo y las páginas de serie ordenan por año descendente y número de inventario ascendente, sin orden editorial manual.
- [ ] El bloque de series visibles aparece sobre la cuadrícula; las tarjetas muestran solo imagen, título, año y estado. La navegación no enlaza a destinos no visibles.
- [ ] Las direcciones de fichas y series no visibles, retiradas o inexistentes responden HTTP 404 con la página bilingüe de la spec 000 y sin redirección.
- [ ] Las series solo aparecen cuando están publicadas y tienen al menos una obra visible en el idioma consultado.
- [ ] El catálogo vacío tiene un mensaje funcional localizado y no muestra contenido de otro idioma.
- [ ] Las cuatro etiquetas de disponibilidad son correctas en ES y EN y usan el tratamiento de color de los tokens; ocho pruebas verifican etiqueta y ausencia de acción de adquisición.
- [ ] Contenido e imágenes ausentes se omiten o bloquean según estas reglas, sin invención ni fallback lingüístico.
- [ ] El catálogo está disponible en ES y EN incluso vacío; las páginas visibles incluyen metadatos únicos y alternates de idioma, y los datos estructurados y sitemaps solo describen contenido visible.
- [ ] Las meta descriptions de serie siguen la regla de 155 caracteres o la plantilla localizada, y el build falla ante duplicados de título o descripción.
- [ ] La descripción SEO global del catálogo solo se usa en su idioma publicado; cuando falta, la página no emite meta description ni utiliza contenido sustituto.
- [ ] Las imágenes cumplen formato, tamaño máximo, variantes responsive, dimensiones y carga especificados; los objetivos de peso se registran como no bloqueantes.
- [ ] Las páginas cumplen WCAG 2.2 AA y la matriz responsive; Lighthouse manual se verifica en las tres páginas ES indicadas en RNF-7 y satisface sus umbrales.
- [ ] No hay compra, checkout, gestión de pedidos ni promesas de disponibilidad de prints.

## Decisiones cerradas

- La meta description y la descripción editorial son conceptos distintos. Para series, la descripción editorial es una fuente para derivar SEO según RNF-2 de la spec 001. La descripción SEO del catálogo es la excepción: texto global opcional por idioma, escrito/aprobado por el artista, no derivado de obra ni serie.

## Dudas abiertas

- [NECESITA ACLARACIÓN] El artista debe proporcionar y aprobar el texto de la descripción SEO del catálogo ES y EN antes de completar la verificación Lighthouse de T19; no se redactará ni traducirá automáticamente.
