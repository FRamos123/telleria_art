# Spec 004 — Exposiciones y textos críticos
Estado: implementada

## Contexto y objetivo

Definir cómo pueden descubrirse y consultarse las exposiciones y los textos críticos publicados, en páginas de listado y páginas propias en español e inglés cuando exista la versión correspondiente. Las páginas deben facilitar la consulta de relaciones editoriales confirmadas con obras y series, ayudar a encontrar el contenido en buscadores y respetar las reglas de publicación de la spec 001. No se inventará ni se sustituirá contenido del artista.

Esta spec amplía la presentación pública: las fichas de obra conservan el texto crítico completo que ya muestran y añaden acceso a la página propia de ese texto.

## Usuarios

- Visitantes que desean conocer la trayectoria expositiva y los textos críticos publicados.
- Curadores e instituciones que consultan exposiciones, obras, series y textos relacionados.
- Personas que desean leer el contenido en el idioma original o en una traducción publicada.

## Historias de usuario

- **HU-1.** Como visitante, quiero recorrer exposiciones y abrir sus páginas para conocer dónde y cuándo tuvieron lugar y qué obras o series están relacionadas.
- **HU-2.** Como visitante, quiero encontrar y leer textos críticos publicados para consultar su título, cuerpo y autoría.
- **HU-3.** Como visitante, quiero seguir las relaciones editoriales confirmadas entre textos, exposiciones, obras y series sin encontrar enlaces a contenido no disponible.
- **HU-4.** Como visitante, quiero consultar el contenido en español o inglés cuando la versión de ese idioma esté publicada, sin sustituciones por otro idioma.
- **HU-5.** Como curador o visitante, quiero localizar estas páginas mediante buscadores y recorrerlas con tecnologías de asistencia.

## Definiciones

- **Contenido visible en un idioma:** exposición o texto crítico que está publicado y completo en ese idioma conforme a las reglas de la spec 001.
- **Versión de texto crítico:** contenido original en el idioma declarado o traducción completa publicada en el idioma solicitado. La traducción es opcional y no sustituye al original.
- **Relación visible:** asociación editorial confirmada cuyo destino está publicado, completo y visible en el idioma de la página, conforme a las specs 001–003.
- **Página de listado:** índice público de exposiciones o de textos críticos de un idioma.
- **Página propia:** página dedicada a una exposición o a un texto crítico publicado en el idioma solicitado.

## Requisitos funcionales

- **RF-1. Listado de exposiciones.** CUANDO una persona visite el listado de exposiciones (`/exposiciones/` o `/en/exhibitions/`) en español o inglés, EL SISTEMA mostrará una cabecera editorial de 12 columnas con título (`Exposiciones & Trayectoria`), descripción funcional e indicadores reales del número de exposiciones visibles y su rango de años activo, seguida del listado tipo «Archivo Retrospectivo» con las exposiciones visibles según la spec 001 en ese idioma y el bloque de cierre hacia contacto (si la ruta existe). Cada entrada enlazará con su página propia publicada en ese mismo idioma.
- **RF-2. Contenido y orden de exposiciones.** CUANDO EL SISTEMA muestre una exposición en el Archivo Retrospectivo del listado, EL SISTEMA presentará una tarjeta horizontal de 12 columnas sobre `surface-container-low` con: el año de inicio destacado y las fechas localizadas completas en la columna izquierda (3 columnas); el título enlazado, el lugar/sede y los enlaces a obras o series visibles relacionadas (si existen) en la columna central (6 columnas); y la imagen opcional validada (si existe) junto al enlace a la página propia de la exposición en la columna derecha (3 columnas). EL SISTEMA ordenará las entradas desde la fecha de inicio más reciente a la más antigua. SI una exposición no tiene fecha final, ENTONCES EL SISTEMA no inventará ni mostrará una fecha final. EL SISTEMA omitirá filtros por tipología, citas de prensa inventadas, ISBNs, sección de catálogos físicos y protocolos de embalaje/pólizas.
- **RF-3. Página de exposición.** CUANDO una persona visite una exposición visible, EL SISTEMA mostrará su título, lugar y fechas disponibles. EL SISTEMA mostrará su imagen solo si existe y es válida según la spec 001; SI falta o no es válida, ENTONCES EL SISTEMA omitirá la imagen sin bloquear la página.
- **RF-4. Listado de textos críticos.** CUANDO una persona visite el listado de textos críticos en un idioma, EL SISTEMA mostrará solo las versiones visibles según la spec 001 en ese idioma, con título y autor, ordenadas alfabéticamente por título en el idioma presentado. Cada entrada enlazará con la página propia de esa versión. EL SISTEMA no mostrará extractos del cuerpo en el listado.
- **RF-5. Página de texto crítico.** CUANDO una persona visite un texto crítico visible en un idioma, EL SISTEMA mostrará el título, el cuerpo completo y la autoría de la versión publicada en ese idioma. EL SISTEMA no usará como sustitución el contenido de otro idioma.
- **RF-6. Relaciones en páginas propias.** CUANDO una página propia de exposición o texto crítico tenga asociaciones editoriales confirmadas a obras o series, EL SISTEMA enlazará únicamente los destinos visibles en el idioma actual. SI no hay asociaciones o ninguno de sus destinos está visible en ese idioma, ENTONCES EL SISTEMA omitirá la sección de relaciones vacía y mantendrá publicada la página de origen si cumple sus propios requisitos.
- **RF-7. Acceso desde fichas de obra.** CUANDO una ficha de obra muestre un texto crítico asociado y visible en el idioma actual, EL SISTEMA conservará el cuerpo completo que ya presenta según la spec 003 y ofrecerá un enlace identificable a la página propia de ese texto en el mismo idioma. EL SISTEMA no modificará la presentación de las series en esta versión.
- **RF-8. Listados vacíos.** SI no hay exposiciones visibles o no hay textos críticos visibles en el idioma solicitado, ENTONCES EL SISTEMA mantendrá accesible el listado correspondiente y mostrará un mensaje funcional localizado que no se presente como contenido del artista. EL SISTEMA no recurrirá a contenido del otro idioma.
- **RF-9. Versiones lingüísticas.** CUANDO una exposición o un texto crítico tenga versiones publicadas en ambos idiomas, EL SISTEMA permitirá pasar a la versión equivalente y declarará esa relación lingüística. SI no existe una versión publicada en el otro idioma, ENTONCES EL SISTEMA omitirá el enlace y la relación hacia esa versión, sin fallback.
- **RF-10. Páginas no visibles.** SI se solicita una página propia que no está publicada, completa o disponible en el idioma solicitado, o que no existe, ENTONCES EL SISTEMA responderá con la página 404 definida en la spec 000, sin mostrar contenido incompleto ni redirigir a otro idioma.
- **RF-11. Metadatos para buscadores.** CUANDO EL SISTEMA publique un listado o una página propia, EL SISTEMA ofrecerá un título de página único e identificable en el idioma correspondiente. Para los listados, EL SISTEMA usará una descripción funcional localizada del tipo de contenido, no atribuida al artista. Para una exposición, EL SISTEMA formará una descripción específica a partir de su título, lugar y fechas publicados. Para un texto crítico, EL SISTEMA usará el comienzo de su cuerpo publicado, con un máximo de 155 caracteres y terminando en el último límite de palabra que no supere esa longitud. SI el primer término del cuerpo supera por sí solo los 155 caracteres y no existe un límite de palabra admisible, ENTONCES EL SISTEMA omitirá la meta description en vez de cortar el término o exceder el límite. SI falta contenido para el idioma actual, ENTONCES EL SISTEMA no usará contenido del otro idioma ni inventará contenido editorial.
- **RF-12. Datos estructurados.** CUANDO EL SISTEMA publique una página propia, EL SISTEMA proporcionará datos estructurados que representen el tipo de contenido y únicamente los hechos publicados de esa exposición o texto crítico, incluidos los datos lingüísticos y las relaciones visibles aplicables. EL SISTEMA no inferirá datos ausentes ni añadirá afirmaciones comerciales.
- **RF-13. Sitemaps y relaciones de idioma.** CUANDO un listado o una página propia esté visible en un idioma, EL SISTEMA incluirá su dirección pública en el sitemap correspondiente. EL SISTEMA declarará alternates de idioma solo para versiones publicadas. EL SISTEMA incluirá la imagen de una exposición en el sitemap de imágenes únicamente cuando exista y sea válida; no incluirá imágenes ausentes ni contenido no visible.
- **RF-14. Estado de las obras relacionadas.** CUANDO una exposición o texto crítico enlace a una obra visible, EL SISTEMA mantendrá el enlace con independencia de que la disponibilidad del original sea `disponible`, `reservada`, `vendida` o `en colección`. La ficha de la obra seguirá mostrando su estado como texto según la spec 003; esta spec no ofrecerá acciones de adquisición.
- **RF-15. Fidelidad editorial.** EL SISTEMA presentará únicamente contenido publicado y relaciones confirmadas. EL SISTEMA no redactará, inventará, inferirá ni traducirá títulos, fechas, lugares, autorías, cuerpos, imágenes, textos alternativos o asociaciones.

## Requisitos no funcionales

- **RNF-1. i18n.** Los listados, las páginas propias, las fechas, las unidades visibles de la ficha técnica y los mensajes funcionales estarán localizados en español e inglés. No habrá fallback de contenido; los enlaces entre idiomas solo apuntarán a versiones publicadas.
- **RNF-2. Accesibilidad.** Las páginas cumplirán WCAG 2.2 nivel AA, con contraste mínimo de 4.5:1 para texto normal y 3:1 para texto grande. Las páginas ofrecerán un enlace de salto al contenido principal, visible al recibir foco de teclado. Los listados y relaciones serán navegables mediante teclado y tendrán enlaces identificables; las imágenes tendrán texto alternativo conforme a la spec 001.
- **RNF-3. Diseño y responsive.** La presentación respetará los patrones y tokens de diseño acordados, sin introducir patrones visuales ni tokens nuevos. Las familias tipográficas definidas en `design/tokens.md` estarán disponibles en las páginas públicas sin depender de fuentes instaladas en el dispositivo. El contenido será legible y navegable en móvil, tablet y escritorio, sin solapamientos, recortes ni desplazamiento horizontal.
- **RNF-4. Contenido público.** El contenido principal estará disponible para personas y buscadores sin depender de interacciones del navegador.
- **RNF-5. SEO.** Los títulos, las descripciones, las relaciones de idioma, los datos estructurados y los sitemaps reflejarán únicamente las páginas y versiones publicadas. Las direcciones canónicas y las relaciones lingüísticas corresponderán a la versión actual y a sus equivalentes existentes.
- **RNF-6. Imágenes.** Las imágenes opcionales de exposición se mostrarán en representaciones optimizadas y adecuadas a la pantalla, con dimensiones declaradas y texto alternativo localizado válido; nunca se mostrará el original a máxima resolución.
- **RNF-7. Rendimiento y verificación.** Las páginas evaluadas alcanzarán al menos 90 en rendimiento, 95 en accesibilidad y 100 en SEO en Lighthouse. La revisión responsive comprobará los anchos de 375, 768 y 1280 px.

## Casos límite

| Situación | Comportamiento esperado |
|---|---|
| Falta en español un campo obligatorio de una exposición o no es válido | La exposición no está visible en ningún idioma según la spec 001; no aparece en listados, páginas públicas, datos estructurados ni sitemaps. |
| La exposición está completa en español, pero no tiene título o lugar válidos en inglés | Se mantiene la versión española; se omite la versión inglesa y no se enlaza desde el selector de idioma ni los alternates. |
| La imagen opcional de una exposición falta, no existe o tiene texto alternativo inválido | La exposición sigue visible; se omite la imagen y su entrada del sitemap de imágenes. |
| La exposición no tiene fecha final | Se muestran las fechas proporcionadas sin inventar una fecha final. |
| Un texto crítico original está en inglés y no tiene traducción española | Puede aparecer en el listado y tener página propia en inglés; no aparece ni se sustituye en español. |
| La traducción opcional de un texto crítico está incompleta o no publicada | Se omite únicamente esa versión lingüística; la versión original publicada permanece disponible. |
| Un texto crítico carece de contenido original válido o de título, cuerpo o autoría completos | No tiene página pública en ningún idioma, de acuerdo con la spec 001. |
| Una exposición o un texto crítico no tiene asociaciones, o sus destinos no están visibles en el idioma actual | La página de origen puede permanecer publicada; no se muestran enlaces ni un bloque de relaciones vacío. |
| Una obra relacionada tiene estado `disponible`, `reservada`, `vendida` o `en colección` | La relación se mantiene si la obra está visible en el idioma actual; la ficha de obra comunica el estado mediante su etiqueta textual y no aparece una acción de compra por efecto de esta spec. |
| No hay contenido visible en uno de los listados | El listado permanece accesible y muestra el mensaje funcional localizado; no muestra contenido del otro idioma ni contenido atribuido al artista. |
| Se solicita una página propia inexistente, retirada, incompleta o no publicada en el idioma solicitado | Se muestra la página 404, sin contenido de otro idioma ni redirección. |
| Una meta description de texto crítico supera 155 caracteres | Se conserva el texto hasta el último límite de palabra que no supere 155 caracteres. |
| El primer término de un texto crítico supera 155 caracteres sin un límite de palabra admisible | Se omite la meta description; no se parte el término ni se exceden 155 caracteres. |

## Fuera de alcance

- Crear, editar, traducir, migrar o publicar contenido editorial en nombre del artista, así como cambiar las reglas de completitud y publicación de la spec 001.
- Añadir textos críticos a las páginas de serie o modificar el contenido y la presentación de esas páginas.
- Retirar el cuerpo de los textos críticos de las fichas de obra o cambiar la presentación ya definida en la spec 003; esta versión añade únicamente acceso a la página propia.
- Cambiar la navegación global, la home o sus enlaces; se define en la spec 006.
- Búsqueda avanzada, filtros, orden elegido por el visitante, registro a eventos, venta de entradas, compra, checkout, pagos, pedidos o disponibilidad comercial.
- Modificar los cuatro estados de disponibilidad, inferir disponibilidad de prints o añadir acciones de adquisición.
- Incorporar patrones visuales o tokens nuevos, o rediseñar pantallas existentes.

## Criterios de finalización

- [x] Existen listados públicos de exposiciones y textos críticos en cada idioma; cada listado muestra únicamente las versiones visibles en ese idioma.
- [x] El listado de exposiciones muestra título, lugar y fechas existentes, ordena por fecha de inicio descendente y enlaza a páginas propias visibles.
- [x] El listado de textos críticos muestra título y autor, ordena alfabéticamente por título y no muestra extractos del cuerpo.
- [x] Las páginas propias muestran el contenido publicado completo requerido; las imágenes opcionales ausentes o inválidas no bloquean exposiciones.
- [x] Las relaciones de una página propia enlazan únicamente asociaciones confirmadas con destinos visibles en el mismo idioma; las fichas de obra conservan el texto completo y enlazan a la página propia del texto crítico.
- [x] Listados vacíos y versiones lingüísticas ausentes se comportan según esta spec, sin fallback ni contenido inventado.
- [x] Las páginas no visibles o inexistentes responden con la 404 definida, sin redirección ni contenido parcial.
- [x] Títulos, descripciones, datos estructurados, alternates y sitemaps describen solo contenido publicado y respetan las reglas de esta spec.
- [x] Las imágenes opcionales válidas están optimizadas, tienen dimensiones y texto alternativo localizados, y solo aparecen en el sitemap de imágenes cuando existen.
- [x] Las páginas cumplen WCAG 2.2 AA, ofrecen enlace de salto al contenido principal, usan las familias tipográficas de diseño, se verifican a 375, 768 y 1280 px y alcanzan los umbrales de Lighthouse definidos.
- [x] Las obras relacionadas conservan sus relaciones en los cuatro estados de disponibilidad; no se ofrecen compras ni acciones comerciales.

## Dudas abiertas

- Ninguna. Los criterios de finalización se verificaron con pruebas automatizadas, Chrome DevTools y Lighthouse según el plan.
