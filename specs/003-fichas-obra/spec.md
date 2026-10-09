# Spec 003 — Fichas individuales de obra
Estado: borrador

## Contexto y objetivo

Definir las páginas públicas individuales de las obras para que coleccionistas, curadores e instituciones puedan consultar fielmente sus datos catalográficos, imagen, contexto editorial y estado del original. Las páginas deben ofrecerse en español y en inglés únicamente cuando el contenido de cada idioma esté completo, y facilitar su descubrimiento en buscadores sin inventar información del artista.

Esta versión es informativa. No ofrece compras ni checkout y no afirma ni sugiere que existan prints disponibles.

## Usuarios

- Coleccionistas que desean conocer una obra y el estado de su original.
- Curadores e instituciones que necesitan consultar los datos catalográficos y el contexto de una obra.
- Visitantes que desean descubrir la obra en español o inglés.

## Historias de usuario

- **HU-1.** Como visitante, quiero consultar los datos y la imagen de una obra para conocerla sin depender de información comercial.
- **HU-2.** Como visitante, quiero leer la ficha en español o inglés cuando esa versión esté completa para comprender la obra en mi idioma.
- **HU-3.** Como coleccionista o curador, quiero identificar claramente si el original está disponible, reservado, vendido o en colección para entender su estado actual.
- **HU-4.** Como visitante, quiero encontrar las fichas mediante buscadores y acceder a su contenido de forma accesible.

## Definiciones

- **Campos obligatorios de obra:** título, serie, imagen principal con texto alternativo descriptivo, año, técnica, soporte, dimensiones, número de inventario y disponibilidad.
- **Campos opcionales de obra:** nota del cuaderno de taller y textos críticos asociados.
- **Versión publicada de un idioma:** ficha cuyos campos obligatorios y contenido localizado necesario están completos en ese idioma.
- **Disponibilidad:** estado del original, con uno de estos valores: `disponible`, `reservada`, `vendida` o `en colección`. No determina la disponibilidad de prints.

## Requisitos funcionales

- **RF-1. Ficha catalográfica.** CUANDO una persona consulte una ficha publicada, EL SISTEMA mostrará el título, la serie, la imagen principal con texto alternativo descriptivo, el año, la técnica, el soporte, las dimensiones, el número de inventario y el estado de disponibilidad.
- **RF-2. Dimensiones.** CUANDO EL SISTEMA muestre las dimensiones de una obra, EL SISTEMA las expresará en centímetros e indicará primero el alto y después el ancho; EL SISTEMA no inferirá ni convertirá medidas que no estén proporcionadas como contenido válido.
- **RF-3. Contenido opcional.** CUANDO exista una nota del cuaderno de taller o un texto crítico asociado que esté publicado en el idioma de la ficha, EL SISTEMA lo mostrará; SI está vacío, no publicado o no disponible en ese idioma, ENTONCES EL SISTEMA omitirá ese contenido sin sustituirlo por texto inventado ni por otra versión lingüística.
- **RF-4. Etiquetas de disponibilidad.** EL SISTEMA mostrará siempre el estado del original mediante una etiqueta textual localizada: «Disponible»/«Available», «Reservada»/«Reserved», «Vendida»/«Sold» o «En colección»/«In collection». EL SISTEMA no comunicará el estado únicamente mediante color.
- **RF-5. Contenido obligatorio incompleto en español.** SI falta o no es válido cualquier campo obligatorio necesario para la versión española, incluida la imagen principal o su texto alternativo descriptivo, ENTONCES EL SISTEMA no publicará la ficha en ningún idioma.
- **RF-6. Contenido obligatorio incompleto en inglés.** SI la ficha española es válida pero falta la traducción inglesa de un campo obligatorio localizado, la traducción publicada de la serie asociada o el texto alternativo en inglés, ENTONCES EL SISTEMA mantendrá publicada la versión española y no publicará la versión inglesa. EL SISTEMA no utilizará texto español como fallback en la ficha inglesa.
- **RF-7. Imagen de obra.** CUANDO EL SISTEMA presente la imagen principal, EL SISTEMA ofrecerá una representación optimizada en formato eficiente (AVIF o WebP), apropiada a la pantalla y con sus dimensiones declaradas, sin servir la imagen original a máxima resolución. EL SISTEMA proporcionará el texto alternativo correspondiente al idioma publicado.
- **RF-8. Metadatos.** CUANDO una ficha esté publicada, EL SISTEMA proporcionará metadatos únicos que identifiquen la obra. SI no existe una descripción SEO redactada por el artista, ENTONCES EL SISTEMA omitirá la meta description y no la generará a partir de otros textos.
- **RF-9. Idiomas relacionados.** CUANDO existan versiones publicadas en ambos idiomas, EL SISTEMA permitirá acceder a la versión equivalente y declarará la relación entre ellas. SI solo está publicada una versión, ENTONCES EL SISTEMA no ofrecerá un enlace a una versión inexistente ni declarará esa relación.
- **RF-10. Datos estructurados.** CUANDO una ficha esté publicada, EL SISTEMA incluirá datos estructurados que describan únicamente información factual disponible de la obra. EL SISTEMA no incluirá ofertas, precios, enlaces de compra, disponibilidad comercial ni afirmaciones sobre prints.
- **RF-11. Sitemap.** CUANDO una ficha o imagen asociada esté publicada, EL SISTEMA la incluirá en los sitemaps de páginas e imágenes que correspondan. SI una versión lingüística no está publicada o una ficha deja de estarlo, ENTONCES EL SISTEMA la excluirá de esos sitemaps y de los datos estructurados públicos.
- **RF-12. Rutas no publicadas.** SI una persona solicita una ficha que no está publicada, ENTONCES EL SISTEMA no expondrá una página pública con contenido incompleto o retirado.
- **RF-13. Sin comercio.** EL SISTEMA no ofrecerá compra del original, checkout, precios, ofertas ni mensajes que inviten a comprar. EL SISTEMA no prometerá disponibilidad, variantes, tamaños ni venta de prints, independientemente del estado del original.
- **RF-14. Fidelidad editorial.** SI falta cualquier dato de la obra o del artista, ENTONCES EL SISTEMA lo omitirá o bloqueará la publicación según las reglas anteriores, sin inventarlo, inferirlo ni sustituirlo por contenido que pueda parecer auténtico.

## Requisitos no funcionales

- **RNF-1. i18n.** La ficha y sus etiquetas estarán disponibles en español e inglés únicamente para las versiones publicadas. No habrá fallback entre idiomas; las relaciones de idioma apuntarán solo a versiones existentes.
- **RNF-2. Accesibilidad.** Las páginas cumplirán WCAG 2.2 nivel AA: contraste mínimo de 4.5:1 para texto normal y 3:1 para texto grande. La disponibilidad tendrá etiqueta textual y no dependerá solo del color. El contenido y las imágenes tendrán nombres o alternativas comprensibles en el idioma presentado.
- **RNF-3. Diseño.** La presentación respetará los patrones y tokens acordados, incluido el uso de colores de texto sólidos y etiquetas textuales para los estados.
- **RNF-4. SEO.** Cada versión pública tendrá metadatos únicos, su dirección canónica y datos estructurados acordes con el contenido real. Las relaciones entre idiomas solo referirán versiones publicadas. Los sitemaps reflejarán las páginas e imágenes públicas.
- **RNF-5. Contenido accesible sin interacción.** El contenido principal de la ficha estará disponible en la página para personas y motores de búsqueda sin depender de ejecutar interacciones en el navegador.
- **RNF-6. Imágenes.** Las imágenes se mostrarán en representaciones optimizadas AVIF o WebP y adecuadas a la pantalla, nunca a máxima resolución original; tendrán dimensiones declaradas y texto alternativo descriptivo localizado.
- **RNF-7. Rendimiento.** Las páginas evaluadas alcanzarán al menos 90 en rendimiento, 95 en accesibilidad y 100 en SEO en Lighthouse.

## Casos límite

| Situación | Comportamiento esperado |
|---|---|
| Falta en español cualquier campo obligatorio, la imagen principal o su texto alternativo | No se publica la ficha en ningún idioma; no aparece en sitemaps ni en datos estructurados públicos. |
| La obra está completa en español, pero falta una traducción inglesa obligatoria | Se mantiene ES; se omite EN y no se declara un enlace lingüístico hacia EN. |
| La obra tiene traducción EN, pero la serie no tiene una versión EN publicada | Se mantiene ES; se bloquea EN porque la serie es obligatoria y no se muestra su nombre en español. |
| La imagen existe, pero falta su texto alternativo EN | Se mantiene ES; se bloquea EN, sin reutilizar el texto alternativo ES. |
| Falta una descripción SEO redactada por el artista | Se omite la meta description; no se deriva de la nota de taller ni de los textos críticos. |
| Falta una nota de taller o no hay textos críticos asociados publicados en el idioma | Se omiten esos bloques; no se muestran espacios vacíos ni texto de sustitución. |
| El estado del original es cualquiera de los cuatro valores | Se muestra la etiqueta de estado correspondiente en texto localizado; no se ofrece compra ni se infiere la disponibilidad de prints. |
| Una obra se retira o deja de cumplir los requisitos de publicación | No se expone contenido público de la ficha ni aparece en sitemaps o datos estructurados públicos. |
| La obra tiene el estado «Disponible» | El estado se muestra como dato informativo; no implica oferta de compra ni disponibilidad de prints. |

## Fuera de alcance

- Compra de originales, botones o enlaces de compra, precios, checkout, pagos y gestión de pedidos.
- Publicación de prints como productos, su disponibilidad, tamaños, variantes, precios o cualquier promesa comercial relacionada.
- Definición de reglas comerciales sobre la relación entre el estado del original y los prints.
- Invención, generación automática o traducción no proporcionada de contenido del artista, incluidos textos críticos, notas y descripciones SEO.
- Visor interactivo de alta resolución o zoom de la obra.

## Criterios de finalización

- [ ] Cada ficha publicada muestra todos los campos obligatorios definidos y las dimensiones en centímetros en orden alto × ancho.
- [ ] Los cuatro estados se presentan con sus etiquetas textuales localizadas y nunca solo mediante color.
- [ ] Los campos opcionales aparecen solo cuando tienen contenido publicado en el idioma de la ficha; los campos ausentes no generan contenido sustituto.
- [ ] La falta de cualquier campo obligatorio ES bloquea todas las versiones; la falta de contenido localizado obligatorio EN bloquea solo EN y no activa fallback.
- [ ] Cada versión publicada tiene imagen optimizada, dimensiones declaradas y texto alternativo correspondiente al idioma.
- [ ] Metadatos, relaciones lingüísticas, datos estructurados y sitemaps incluyen solo información y versiones efectivamente publicadas; la meta description se omite si no fue redactada por el artista.
- [ ] Los datos estructurados no contienen ofertas, precios ni disponibilidad comercial de originales o prints.
- [ ] No hay compra, checkout, ni promesas de disponibilidad de prints en ningún estado del original.
- [ ] Las páginas cumplen WCAG 2.2 AA y los umbrales de Lighthouse definidos en RNF-7.

## Dudas abiertas

- Ninguna para el alcance de esta spec. Las decisiones comerciales quedan fuera de alcance y requieren una spec comercial aprobada.
