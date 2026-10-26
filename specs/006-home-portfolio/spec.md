# Spec 006 — Home portfolio
Estado: implementada
## Contexto y objetivo

La página de inicio actual identifica al artista, pero ofrece poca orientación para explorar su portfolio. La home debe convertirse en una entrada bilingüe que facilite el acceso a las obras, series, exposiciones y contacto, y muestre una selección breve de obras publicadas.

El contenido visible se limita a textos aprobados y contenido real publicado. No se inventarán biografía, citas, manifiestos, datos de obra ni imágenes. La revisión propuesta permite un texto breve y opcional de presentación del artista en el hero cuando exista una versión aprobada para ese idioma; no crea una página independiente «El artista».

**Revisión propuesta (2026-10-26):** alinear fielmente la composición de la home con la referencia visual de `design/alejandro_fern_ndez_teller_a_portfolio_oficial_obra_series/` (`screen.png` y `code.html`): navegación localizada encima del hero, hero tipográfico con nombre en tres líneas y acciones hacia catálogo y contacto, todas las obras seleccionadas (hasta tres) presentadas mediante el bloque curatorial completo de 12 columnas alternando el lado de imagen y ficha entre obras impares y pares, exposiciones seleccionadas en filas de 12 columnas y un bloque editorial de cierre hacia la página de contacto. Se reutilizará solo contenido localizado ya publicado; los bloques sin contenido se omitirán. La referencia no autoriza copiar su HTML sin adaptar ni incluir textos de muestra, filtros interactivos o acciones comerciales.

## Usuarios

- Coleccionistas que quieren descubrir obras y consultar sobre ellas.
- Curadores, instituciones, críticos y otras personas que desean explorar la trayectoria pública del artista.
- Personas visitantes que quieren conocer la identidad del artista y orientarse por el portfolio en español o inglés.

## Historias de usuario

- **HU-1.** Como persona visitante, quiero identificar al artista y entender que estoy en su portfolio para decidir qué contenido explorar.
- **HU-2.** Como coleccionista o representante institucional, quiero encontrar desde la home las obras, series, exposiciones y el contacto para llegar directamente a la sección que necesito.
- **HU-3.** Como persona visitante, quiero ver una selección breve de obras publicadas para descubrir el portfolio sin recorrer primero todo el catálogo.
- **HU-4.** Como persona visitante en inglés, quiero ver solo contenido disponible en inglés para no recibir textos en español como sustituto.

## Definiciones

- **Obra válida para la selección:** obra publicada según las reglas de Spec 001, con versión completa en el idioma activo, título no vacío, año válido, imagen principal válida con dimensiones positivas, texto alternativo descriptivo de esa versión, disponibilidad reconocida y ficha generada en el mismo idioma. Si falta cualquiera de estos datos o destinos, se omite la obra completa en ese idioma; no se muestra una tarjeta parcial.
- **Obra reciente:** obra válida para la selección, ordenada por año de creación descendente; los empates se resuelven por ID mediante comparación lexicográfica ordinal, sensible a mayúsculas y no dependiente del idioma. Se muestran como máximo las tres primeras.
- **Contenido válido para un idioma:** solo se usan campos publicados y completos en ese idioma. No se sustituye una traducción, imagen o texto alternativo ausente por contenido de otro idioma ni por un placeholder. Las reglas de publicación de Spec 001 siguen vigentes: obras, series y exposiciones requieren una versión española completa para publicarse; la versión inglesa solo se publica si también está completa.
- **Destino disponible:** ruta localizada incluida como HTML en la salida estática de la publicación vigente. Para series, el destino también requiere que exista el directorio localizado en la página de obras. La home no enlaza a rutas ni anclas que no estén presentes en esa salida.
- **Presentación breve del artista:** texto editorial opcional y aprobado que aparece en el hero junto a la identidad; no es una biografía completa, texto SEO ni sustituto de `artistIdentification`.
- **Navegación de series:** conduce al directorio de series que ya aparece en la página de obras del mismo idioma; esta versión no define una ruta independiente de índice de series.

## Requisitos funcionales

- **RF-1. Identidad.** **CUANDO** una persona acceda a la home en español o inglés, **EL SISTEMA** presentará el nombre del artista aprobado (`Alex Tellería`) y la identificación existente y aprobada en el idioma correspondiente, sin inventar ni sustituir esos datos.
- **RF-2. Navegación global en una sola barra.** **CUANDO** una persona acceda a cualquier página del sitio, **EL SISTEMA** ofrecerá en la única barra superior (`SiteHeader`) la marca enlazada al inicio, la navegación localizada hacia obras (`/obras/` o `/en/works/`), series (el directorio de series de esas mismas rutas), exposiciones (`/exposiciones/` o `/en/exhibitions/`) y contacto (`/contacto/` o `/en/contact/`), y el selector de idioma, aplicando la condición de disponibilidad de RF-3 y sin duplicar una segunda barra debajo. El enlace a textos críticos (`/textos-criticos/` o `/en/critical-texts/`) permanece oculto en la navegación pública hasta que se decida reactivar la sección, conservando la infraestructura subyacente. Además, en la fila inferior del hero de la home ofrecerá enlaces de acción directa hacia obras y hacia contacto cuando dichas rutas estén disponibles.
- **RF-3. Destinos existentes.** **SI** la ruta localizada o el ancla de destino no está presente en la salida estática de la publicación vigente, **ENTONCES EL SISTEMA** no presentará un enlace a ese destino. El enlace a series solo aparece si el directorio localizado existe; los enlaces a exposiciones, textos críticos y contacto solo aparecen si sus rutas localizadas están incluidas en la publicación.
- **RF-4. Selección de obras.** **CUANDO** existan obras válidas según la definición de esta spec en el idioma activo, **EL SISTEMA** mostrará hasta tres obras recientes, ordenadas por año de creación descendente y, en caso de empate, por ID mediante comparación lexicográfica ordinal sensible a mayúsculas y no localizada. Cada obra enlazará a su ficha generada en el mismo idioma.
- **RF-5. Contenido de cada obra.** **CUANDO** una obra aparezca en la selección, **EL SISTEMA** mostrará en su bloque curatorial de 12 columnas: su imagen principal con la placa de número de inventario (`InventoryNumber`), el nombre y enlace de su serie visible en ese idioma, su título enlazado a la ficha, la atribución con nombre del artista y año, la ficha técnica completa (`técnica`, `soporte`, `dimensiones`, `año` y etiqueta textual de `disponibilidad`), su nota localizada del cuaderno de taller si existe (presentada como cita editorial con su etiqueta) y dos acciones al pie: enlace hacia la ficha localizada de la obra y enlace de consulta contextualizada hacia la página de contacto (`/contacto/?obra=<id>` o `/en/contact/?artwork=<id>`, si la ruta de contacto existe). EL SISTEMA no añadirá, resumirá ni sustituirá contenido. La selección no filtrará por disponibilidad ni ofrecerá compra, reserva o pago.
- **RF-6. Estados de disponibilidad.** **EL SISTEMA** permitirá mostrar en la selección los cuatro estados `disponible`, `reservada`, `vendida` y `en colección`; cada estado irá acompañado de su etiqueta textual y nunca se comunicará solo mediante color.
- **RF-7. Sin fallback ni contenido inventado.** **SI** falta cualquiera de estos requisitos en el idioma activo: versión completa publicada, título no vacío, año válido, imagen principal válida, texto alternativo descriptivo, disponibilidad reconocida o ficha generada, **ENTONCES EL SISTEMA** omitirá la obra completa de la selección en ese idioma, sin fallback a otra lengua, tarjeta parcial, placeholder de contenido artístico ni imagen inventada.
- **RF-8. Selección vacía o incompleta.** **SI** hay menos de tres obras válidas en el idioma activo, **ENTONCES EL SISTEMA** mostrará solo las disponibles; **SI** no hay ninguna, **ENTONCES EL SISTEMA** omitirá el bloque de selección sin mostrar contenido de relleno.
- **RF-9. Hero y jerarquía editorial.** **CUANDO** una persona acceda a la home, **EL SISTEMA** presentará la navegación localizada al inicio de la página seguida del hero editorial: en la fila superior, el nombre aprobado del artista (`artistName`) dividido en tres líneas (nombre y primer apellido en mayúsculas y segundo apellido en cursiva minúscula) y la identificación aprobada (`artistIdentification`) alineada a la derecha; en la fila inferior, el texto opcional de RF-13 a la izquierda (7 columnas) y los botones de acción hacia el catálogo de obras y hacia contacto a la derecha (5 columnas). No añadirá eyebrow inventado, coordenadas ni botón de dossier comercial.
- **RF-10. Composición alternada de obras.** **CUANDO** haya obras válidas, **EL SISTEMA** presentará cada una de las hasta tres obras seleccionadas mediante el bloque curatorial completo de 12 columnas (7 columnas para la imagen y 5 columnas para la información curatorial en escritorio) con espaciado vertical amplio entre obras, alternando en escritorio el orden horizontal entre obras impares (1.ª y 3.ª: imagen a la izquierda y ficha a la derecha) y pares (2.ª: ficha a la izquierda e imagen a la derecha), y manteniendo la imagen antes que la ficha en móvil y tablet. No habrá tarjetas reducidas debajo, elección manual de obra destacada ni filtros.
- **RF-11. Exposiciones publicadas.** **CUANDO** haya exposiciones completas, publicadas y enlazables en el idioma activo, **EL SISTEMA** mostrará hasta tres, ordenadas por fecha de inicio descendente y, en caso de empate, por ID ordinal ascendente, bajo una cabecera editorial con enlace al índice de exposiciones y dispuestas en filas de 12 columnas que presenten únicamente fecha, título enlazado y lugar de la versión localizada; **SI** no hay ninguna, **ENTONCES** omitirá el bloque.
- **RF-12. Cierre editorial hacia contacto.** **CUANDO** la ruta localizada de contacto esté disponible en la publicación vigente, **EL SISTEMA** presentará al final de la home (antes del pie global) un bloque editorial de cierre en 12 columnas orientado a consultas generales, artísticas e institucionales, con textos localizados de interfaz y un enlace de acción hacia `/contacto/` o `/en/contact/`, sin formulario embebido, sin JavaScript de cliente y sin referencias a adquisición, precios o reservas. **SI** la ruta localizada de contacto no está disponible, **ENTONCES** omitirá el bloque. Las notas de taller no se repetirán en una sección separada, ya que cada obra seleccionada muestra la suya propia dentro de su bloque curatorial según RF-5.
- **RF-13. Presentación breve opcional.** **CUANDO** exista un texto de presentación del artista aprobado para el idioma activo, **EL SISTEMA** lo mostrará como un párrafo dentro de la columna izquierda de la fila inferior del hero. **SI** no existe para ese idioma, **ENTONCES** omitirá el párrafo sin dejar un bloque vacío ni usar el texto de otro idioma. El texto no sustituirá los metadatos SEO ni generará una página independiente.

## Requisitos no funcionales

- **RNF-1. i18n.** La home y su navegación estarán disponibles en español e inglés. Los enlaces, metadatos y textos de interfaz corresponderán al idioma activo, sin fallback entre idiomas.
- **RNF-2. Accesibilidad.** La página cumplirá todos los criterios WCAG 2.2 AA aplicables. La revisión incluirá navegación por teclado, foco visible, estructura y árbol accesibles, nombres accesibles, textos alternativos descriptivos, contraste, ampliación al 200 % y reflujo a 320 px CSS. Los estados de disponibilidad tendrán etiqueta textual; una puntuación de Lighthouse no se considerará por sí sola prueba de conformidad.
- **RNF-3. Responsive.** La página funcionará en móvil (`<768px`), tablet (`768–1279px`) y escritorio (`≥1280px`), sin desbordamiento horizontal ni pérdida de contenido.
- **RNF-4. SEO.** Cada versión tendrá título y descripción únicos frente a todas las páginas públicas indexables, localizados, canonical propio y alternates solo hacia versiones equivalentes existentes. Cada home incluirá JSON-LD válido de tipo `WebPage`, con URL, nombre, descripción e idioma tomados de sus metadatos localizados aprobados. Las rutas de inicio seguirán incluidas en el sitemap.
- **RNF-5. Rendimiento e imágenes.** El contenido principal estará presente en el HTML generado sin depender de JavaScript. Las imágenes se servirán optimizadas y responsive, con dimensiones explícitas. Cada home, ES y EN, alcanzará en Lighthouse móvil al menos 90 en rendimiento, 95 en accesibilidad y 100 en SEO, usando la misma versión y configuración de auditoría; se registrarán versión y configuración.
- **RNF-6. Sistema visual.** La home compondrá patrones y tokens existentes o aprobados/documentados en `design/tokens.md` antes de implementarse; no añadirá valores arbitrarios. Las secciones nuevas se limitan a RF-9–RF-13.

## Casos límite

| Situación | Comportamiento esperado |
|---|---|
| Una obra está publicada en español, pero no tiene traducción inglesa | Aparece solo en la home española. |
| Una obra/serie/exposición tiene versión inglesa, pero no cumple la publicación española base exigida por Spec 001 | No se considera publicada y no aparece en ninguna home. |
| Una obra carece de imagen principal válida o de texto alternativo descriptivo en el idioma activo | Se omite la obra completa en la selección de ese idioma. |
| El título está vacío, el año es inválido, la disponibilidad falta/no pertenece a los cuatro valores permitidos o la ficha localizada no está generada | Se omite la obra completa; no se muestra una tarjeta parcial ni un enlace sin destino. |
| Hay una o dos obras válidas en el idioma activo | Se muestran únicamente esas obras, sin tarjetas de relleno. |
| No hay obras válidas en el idioma activo | Se omite el bloque de selección. |
| Una obra tiene disponibilidad `disponible`, `reservada`, `vendida` o `en colección` | Puede aparecer sin importar su estado; se muestra la etiqueta textual correspondiente. |
| No hay series visibles en el idioma activo | Se omite solo el enlace a su directorio; los demás destinos disponibles permanecen. |
| No hay exposiciones publicadas completas en el idioma activo | Se omite el bloque de exposiciones. |
| No hay notas de taller publicadas para una obra en el idioma activo | Se omite el bloque de nota dentro de la columna curatorial de esa obra; no se usa la nota de otro idioma. |
| No hay presentación del artista aprobada en un idioma | Se omite el párrafo de presentación solo en ese idioma; no se usa fallback. |
| La ruta localizada de obras, exposiciones, textos críticos o contacto no está incluida en la salida estática | Se omite solo el enlace o bloque que dependa de ese destino. |
| La ruta o el texto de interfaz no tiene versión inglesa disponible | No se crea un alternate ni se presenta el texto español como fallback inglés. |
| El contenido de la referencia de diseño no existe como contenido publicado aprobado | Se omite; la referencia visual no autoriza inventar textos, títulos, citas ni datos. |

## Fuera de alcance

- Biografía completa, página independiente «El artista», manifiestos intermedios (`Dialéctica de la Sombra Atlántica`), bloque poético (`Pintar desde el margen atlántico` / porcentajes de pigmento), citas o extractos de textos críticos en la home. La única excepción es el texto breve, aprobado y opcional del hero descrito en RF-13; los textos críticos solo tienen un enlace en la navegación.
- Previsualizaciones de series como bloques de contenido o sección separada de notas de taller al pie (las notas ya se muestran en cada obra según RF-5).
- Una obra destacada elegida manualmente, carruseles, filtros interactivos (`Serie Activa` / `Filtrar por corpus`), controles de zoom (`Inspeccionar Impasto 1:1`), muestras cromáticas de pigmento o botón de copiar referencia al portapapeles.
- Nuevas rutas independientes para el índice de series.
- Cambios de navegación global en páginas distintas de la home.
- Compra, reserva, precio, dossier de coleccionista, checkout, formulario embebido en la home o cualquier acción comercial.
- Modificación de contenido publicado en producción o de cualquier otro contenido del CMS. Excepción puntual aprobada el 2026-10-25: actualizar solo los textos alternativos ES/EN de la obra «Centinela Carmesí» en el dataset `va9sgl77/development`, con los textos aprobados: ES «Rostro parcialmente en sombra, enmarcado por una capucha roja sobre un fondo ocre» y EN “A partially shadowed face framed by a red hood against an ochre background.” No modificar producción.

## Criterios de finalización

- [x] La home ES y EN presenta la identidad aprobada del artista y la navegación especificada, solo en la propia home.
- [x] Las rutas de obras, series, exposiciones, textos críticos y contacto apuntan a destinos existentes y localizados; no hay enlaces muertos.
- [x] La selección muestra como máximo las tres obras válidas más recientes por idioma, con orden y desempate ordinal por ID definidos; obras incompletas o sin ficha localizada se omiten por completo.
- [x] La selección admite los cuatro estados de disponibilidad con etiqueta textual, no filtra por estado y no inicia acciones comerciales.
- [x] Las obras sin traducción o imagen válida se omiten; con menos de tres se muestran las disponibles y con cero se omite el bloque.
- [x] No se han añadido textos editoriales, títulos, imágenes ni datos de artista que no existan en contenido publicado aprobado.
- [x] Las versiones tienen metadatos localizados y únicos frente a las páginas públicas indexables, canonical y alternates correctos, JSON-LD `WebPage` válido e inclusión en sitemap; el contenido estático aparece sin JavaScript.
- [x] Chrome DevTools y revisión manual confirman los criterios WCAG 2.2 AA aplicables, así como el comportamiento en móvil, tablet y escritorio ES/EN, sin overflow y con navegación por teclado tras la alineación fiel al diseño.
- [x] `pnpm --dir web verify` pasa; cada home, ES y EN, alcanza en Lighthouse móvil ≥90 en rendimiento, ≥95 en accesibilidad y 100 en SEO bajo una configuración común registrada.
- [x] La home obedece fielmente a la composición de `design/alejandro_fern_ndez_teller_a_portfolio_oficial_obra_series/`: navegación superior, hero en tres líneas con CTAs, todas las obras seleccionadas en bloques curatoriales completos de 12 columnas alternados con `InventoryBadge`, filas de exposiciones de 12 columnas y cierre hacia contacto, sin contenido inventado ni acciones comerciales.
- [x] El bloque de exposiciones y las notas integradas en cada obra aparecen únicamente con contenido localizado publicado, destinos válidos y orden/límites definidos; se omiten si están vacíos.
- [x] La presentación breve aparece solo si hay texto aprobado para el idioma activo; su ausencia no deja un bloque vacío ni produce fallback.

## Dudas abiertas

Ninguna. El texto de presentación ES/EN es opcional y no se mostrará hasta que la persona artista aporte y apruebe cada versión. Esta revisión no modifica el aviso legal de Spec 005.
