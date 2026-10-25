# Spec 006 — Home portfolio
Estado: aprobada
## Contexto y objetivo

La página de inicio actual identifica al artista, pero ofrece poca orientación para explorar su portfolio. La home debe convertirse en una entrada bilingüe que facilite el acceso a las obras, series, exposiciones y contacto, y muestre una selección breve de obras publicadas.

El contenido visible se limita a textos ya aprobados y contenido real publicado. No se añadirán biografía, citas, manifiestos, datos de obra ni imágenes inventados.

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
- **Navegación de series:** conduce al directorio de series que ya aparece en la página de obras del mismo idioma; esta versión no define una ruta independiente de índice de series.

## Requisitos funcionales

- **RF-1. Identidad.** **CUANDO** una persona acceda a la home en español o inglés, **EL SISTEMA** presentará el nombre del artista y la identificación existente y aprobada en el idioma correspondiente, sin añadir texto editorial nuevo.
- **RF-2. Navegación de la home.** **CUANDO** una persona acceda a la home, **EL SISTEMA** ofrecerá navegación localizada hacia obras (`/obras/` o `/en/works/`), series (el directorio de series de esas mismas rutas), exposiciones (`/exposiciones/` o `/en/exhibitions/`) y contacto (`/contacto/` o `/en/contact/`), aplicando la condición de disponibilidad de RF-3. La navegación se presenta en la home; esta spec no cambia el encabezado global de las demás páginas.
- **RF-3. Destinos existentes.** **SI** la ruta localizada o el ancla de destino no está presente en la salida estática de la publicación vigente, **ENTONCES EL SISTEMA** no presentará un enlace a ese destino. El enlace a series solo aparece si el directorio localizado existe; el enlace de contacto solo aparece si la ruta de contacto localizada está incluida en la publicación.
- **RF-4. Selección de obras.** **CUANDO** existan obras válidas según la definición de esta spec en el idioma activo, **EL SISTEMA** mostrará hasta tres obras recientes, ordenadas por año de creación descendente y, en caso de empate, por ID mediante comparación lexicográfica ordinal sensible a mayúsculas y no localizada. Cada obra enlazará únicamente a su ficha generada en el mismo idioma.
- **RF-5. Contenido de cada obra.** **CUANDO** una obra aparezca en la selección, **EL SISTEMA** mostrará únicamente sus datos publicados disponibles: imagen, título, año y etiqueta textual de disponibilidad. La selección no filtrará por disponibilidad ni ofrecerá compra, reserva o pago.
- **RF-6. Estados de disponibilidad.** **EL SISTEMA** permitirá mostrar en la selección los cuatro estados `disponible`, `reservada`, `vendida` y `en colección`; cada estado irá acompañado de su etiqueta textual y nunca se comunicará solo mediante color.
- **RF-7. Sin fallback ni contenido inventado.** **SI** falta cualquiera de estos requisitos en el idioma activo: versión completa publicada, título no vacío, año válido, imagen principal válida, texto alternativo descriptivo, disponibilidad reconocida o ficha generada, **ENTONCES EL SISTEMA** omitirá la obra completa de la selección en ese idioma, sin fallback a otra lengua, tarjeta parcial, placeholder de contenido artístico ni imagen inventada.
- **RF-8. Selección vacía o incompleta.** **SI** hay menos de tres obras válidas en el idioma activo, **ENTONCES EL SISTEMA** mostrará solo las disponibles; **SI** no hay ninguna, **ENTONCES EL SISTEMA** omitirá el bloque de selección sin mostrar contenido de relleno.

## Requisitos no funcionales

- **RNF-1. i18n.** La home y su navegación estarán disponibles en español e inglés. Los enlaces, metadatos y textos de interfaz corresponderán al idioma activo, sin fallback entre idiomas.
- **RNF-2. Accesibilidad.** La página cumplirá todos los criterios WCAG 2.2 AA aplicables. La revisión incluirá navegación por teclado, foco visible, estructura y árbol accesibles, nombres accesibles, textos alternativos descriptivos, contraste, ampliación al 200 % y reflujo a 320 px CSS. Los estados de disponibilidad tendrán etiqueta textual; una puntuación de Lighthouse no se considerará por sí sola prueba de conformidad.
- **RNF-3. Responsive.** La página funcionará en móvil (`<768px`), tablet (`768–1279px`) y escritorio (`≥1280px`), sin desbordamiento horizontal ni pérdida de contenido.
- **RNF-4. SEO.** Cada versión tendrá título y descripción únicos frente a todas las páginas públicas indexables, localizados, canonical propio y alternates solo hacia versiones equivalentes existentes. Cada home incluirá JSON-LD válido de tipo `WebPage`, con URL, nombre, descripción e idioma tomados de sus metadatos localizados aprobados. Las rutas de inicio seguirán incluidas en el sitemap.
- **RNF-5. Rendimiento e imágenes.** El contenido principal estará presente en el HTML generado sin depender de JavaScript. Las imágenes se servirán optimizadas y responsive, con dimensiones explícitas. Cada home, ES y EN, alcanzará en Lighthouse móvil al menos 90 en rendimiento, 95 en accesibilidad y 100 en SEO, usando la misma versión y configuración de auditoría; se registrarán versión y configuración.
- **RNF-6. Sistema visual.** La home compondrá únicamente patrones y tokens de diseño ya aprobados; no añadirá tokens, estilos arbitrarios ni secciones editoriales nuevas.

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
| La ruta localizada de obras, exposiciones o contacto no está incluida en la salida estática | Se omite solo el enlace a ese destino. |
| La ruta o el texto de interfaz no tiene versión inglesa disponible | No se crea un alternate ni se presenta el texto español como fallback inglés. |
| El contenido de la referencia de diseño no existe como contenido publicado aprobado | Se omite; la referencia visual no autoriza inventar textos, títulos, citas ni datos. |

## Fuera de alcance

- Bloques de citas, manifiestos, biografía ampliada, historia del artista o textos críticos que no hayan sido seleccionados como contenido real publicado.
- Previsualizaciones de series o exposiciones como bloques de contenido; en esta versión solo se añaden sus destinos a la navegación.
- Una obra destacada elegida manualmente, carruseles, filtros o controles de interacción para la selección de obras.
- Nuevas rutas independientes para el índice de series.
- Cambios de navegación global en páginas distintas de la home.
- Compra, reserva, precio, checkout o cualquier acción comercial.
- Modificación de contenido publicado en producción o de cualquier otro contenido del CMS. Excepción puntual aprobada el 2026-10-25: actualizar solo los textos alternativos ES/EN de la obra «Centinela Carmesí» en el dataset `va9sgl77/development`, con los textos aprobados: ES «Rostro parcialmente en sombra, enmarcado por una capucha roja sobre un fondo ocre» y EN “A partially shadowed face framed by a red hood against an ochre background.” No modificar producción.

## Criterios de finalización

- [ ] La home ES y EN presenta la identidad aprobada del artista y la navegación especificada, solo en la propia home.
- [ ] Las rutas de obras, series, exposiciones y contacto apuntan a destinos existentes y localizados; no hay enlaces muertos.
- [ ] La selección muestra como máximo las tres obras válidas más recientes por idioma, con orden y desempate ordinal por ID definidos; obras incompletas o sin ficha localizada se omiten por completo.
- [ ] La selección admite los cuatro estados de disponibilidad con etiqueta textual, no filtra por estado y no inicia acciones comerciales.
- [ ] Las obras sin traducción o imagen válida se omiten; con menos de tres se muestran las disponibles y con cero se omite el bloque.
- [ ] No se han añadido textos editoriales, títulos, imágenes ni datos de artista que no existan en contenido publicado aprobado.
- [ ] Las versiones tienen metadatos localizados y únicos frente a las páginas públicas indexables, canonical y alternates correctos, JSON-LD `WebPage` válido e inclusión en sitemap; el contenido estático aparece sin JavaScript.
- [ ] Chrome DevTools y revisión manual confirman los criterios WCAG 2.2 AA aplicables, así como el comportamiento en móvil, tablet y escritorio ES/EN, sin overflow y con navegación por teclado.
- [ ] `pnpm --dir web verify` pasa; cada home, ES y EN, alcanza en Lighthouse móvil ≥90 en rendimiento, ≥95 en accesibilidad y 100 en SEO bajo una configuración común registrada.

## Dudas abiertas

Ninguna. La revisión legal de Spec 005 está cerrada según la aprobación del aviso final. El enlace de contacto continúa condicionado únicamente a que su ruta localizada esté incluida en la publicación vigente; esta spec no modifica el aviso legal.
