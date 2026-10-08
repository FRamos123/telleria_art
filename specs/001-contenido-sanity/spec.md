# Spec 001 — Gestión editorial de obras, series y exposiciones
Estado: borrador

## Contexto y objetivo

Definir qué información editorial se mantiene para obras, series y exposiciones, cómo se relaciona y bajo qué condiciones puede publicarse en español e inglés. La definición debe permitir presentar información fiel a la aportada por el artista, hacer comprensible la disponibilidad del original y excluir traducciones o páginas incompletas sin inventar contenido.

El modelo parte de un proyecto editorial nuevo, sin contenido ni esquemas existentes que haya que preservar. Esta spec define el comportamiento esperado para la gestión y publicación del contenido; no autoriza cambios en contenido de producción.

## Usuarios

- El artista, que incorpora y revisa el contenido editorial.
- Visitantes que exploran obras, series y exposiciones.
- Coleccionistas y curadores que consultan información catalográfica y editorial.

## Historias de usuario

- **HU-1.** Como artista, quiero registrar los datos obligatorios y opcionales de una obra para publicar una ficha fiel y completa.
- **HU-2.** Como artista, quiero agrupar obras en series y presentar cada serie con título e imagen, sin que una descripción extensa sea obligatoria.
- **HU-3.** Como artista, quiero registrar exposiciones con fechas completas o parciales y una imagen opcional para documentar la trayectoria.
- **HU-4.** Como artista, quiero asociar textos críticos a las obras o series pertinentes sin duplicarlos en cada ficha.
- **HU-5.** Como visitante, quiero consultar únicamente las versiones lingüísticas completas que existan, para no encontrar páginas incompletas ni traducciones inventadas.
- **HU-6.** Como coleccionista o curador, quiero identificar textualmente el estado del original sin que ese estado determine la disponibilidad de prints.

## Definiciones

- **Versión publicada de un idioma:** contenido de una entidad que cumple los campos obligatorios para ese idioma. Los datos catalográficos no lingüísticos pueden compartirse entre versiones; los campos editoriales traducibles no se sustituyen automáticamente por los de otro idioma.
- **Contenido incompleto:** entidad a la que le falta al menos un campo obligatorio para la versión de idioma considerada.
- **Texto crítico:** pieza editorial con identidad propia que puede vincularse a una o varias obras o series.
- **Disponibilidad del original:** uno de estos estados: `disponible`, `reservada`, `vendida` o `en colección`. No expresa ni determina la disponibilidad de prints.
- **Fechas parciales o abiertas:** fechas cuya precisión se limita a año o mes y año, o cuyo fin aún no se conoce porque la exposición continúa.

## Requisitos funcionales

- **RF-1:** EL SISTEMA permitirá mantener obras, series, exposiciones y textos críticos con los campos obligatorios y opcionales definidos en esta spec, sin requerir contenido editorial opcional para completar una publicación.
- **RF-2:** EL SISTEMA tratará como obligatorios para una obra: título, serie asociada, imagen principal con texto alternativo descriptivo, año, técnica, soporte, dimensiones en centímetros expresadas como alto × ancho, número de inventario y estado de disponibilidad del original. Título, técnica y soporte serán localizables; año, dimensiones, inventario y disponibilidad serán datos compartidos entre idiomas.
- **RF-3:** EL SISTEMA validará que cada obra tenga una única serie asociada y que su número de inventario sea único y respete el formato `AFT-AAAA-NNN`.
- **RF-4:** EL SISTEMA permitirá registrar para una obra una nota del cuaderno de taller y cero o más textos críticos asociados como contenido opcional y localizable; si no existen, no mostrará campos vacíos ni los completará con contenido inventado.
- **RF-5:** EL SISTEMA compondrá la línea breve catalográfica de una obra a partir de sus campos existentes de título y datos técnicos, sin exigir ni guardar un texto duplicado con esa misma función.
- **RF-6:** EL SISTEMA tratará como obligatorios para una serie su título localizable y una imagen representativa con texto alternativo descriptivo para cada versión publicada; la descripción editorial localizable de la serie será opcional.
- **RF-7:** EL SISTEMA permitirá asociar una serie con sus obras y, cuando exista una relación editorial pertinente, con textos críticos. La ausencia de descripción no impedirá por sí sola la publicación.
- **RF-8:** EL SISTEMA tratará como obligatorios para una exposición su título localizable, lugar y fechas; su imagen será opcional y, cuando exista, tendrá texto alternativo descriptivo para cada versión en que se muestre. El lugar y las fechas serán datos compartidos entre idiomas.
- **RF-9:** EL SISTEMA permitirá fechas de exposición con precisión de día, mes y año, solo año, o mes y año, y permitirá omitir la fecha de cierre mientras la exposición continúe.
- **RF-10:** EL SISTEMA permitirá relacionar una exposición con cero o más obras o series pertinentes. Si no se define una relación, no inventará ni inferirá obras o series participantes.
- **RF-11:** EL SISTEMA gestionará cada texto crítico como pieza editorial independiente, con título y cuerpo textual localizables, y permitirá asociarlo a cero o más obras y series pertinentes. La autoría, fecha y referencia de publicación serán opcionales; si no constan, no se inventarán.
- **RF-12:** CUANDO una entidad tenga los campos obligatorios completos en español, EL SISTEMA publicará su versión española.
- **RF-13:** SI una obra, serie, exposición o texto crítico carece en español de cualquiera de sus campos obligatorios, ENTONCES EL SISTEMA no publicará esa entidad. La imagen de una exposición no será motivo de bloqueo por ser opcional.
- **RF-14:** CUANDO una entidad tenga una versión española publicada pero le falte en inglés algún campo obligatorio para esa versión, incluido el texto alternativo de una imagen obligatoria, EL SISTEMA mantendrá publicada la versión española y no publicará la inglesa.
- **RF-15:** CUANDO exista una versión inglesa completa, EL SISTEMA ofrecerá únicamente enlaces de idioma hacia versiones publicadas; SI una versión no existe o no está completa, ENTONCES EL SISTEMA no ofrecerá un enlace hacia ella.
- **RF-16:** SI falta un campo opcional o su traducción, ENTONCES EL SISTEMA omitirá ese contenido en la versión afectada y no añadirá marcadores, texto de relleno ni traducciones automáticas. Si falta el texto alternativo de una imagen opcional de exposición, omitirá esa imagen en la versión afectada sin bloquear por ello la página.
- **RF-17:** EL SISTEMA mostrará siempre el estado de disponibilidad del original mediante su etiqueta textual correspondiente: `disponible`, `reservada`, `vendida` o `en colección`.
- **RF-18:** EL SISTEMA mantendrá la disponibilidad de prints independiente de la disponibilidad del original; un cambio de estado del original no establecerá, inferirá ni modificará el estado de ningún print.
- **RF-19:** EL SISTEMA no publicará afirmaciones biográficas, curatoriales, catalográficas ni comerciales que no estén respaldadas por datos proporcionados por el artista.
- **RF-20:** EL SISTEMA proporcionará título y descripción únicos para las versiones públicas de obras y series, sin que la descripción editorial opcional de una serie se convierta automáticamente en obligatoria como texto visible.

## Requisitos no funcionales

- **RNF-1. i18n:** los campos editoriales localizables permitirán versiones en español e inglés; cada idioma será publicable según su propia integridad y sin fallback textual no declarado.
- **RNF-2. Accesibilidad:** cada imagen publicada tendrá texto alternativo descriptivo en el idioma de la versión correspondiente. La disponibilidad siempre tendrá etiqueta textual y no dependerá solo del color. El contenido textual público cumplirá WCAG AA, con contraste mínimo de 4.5:1 para texto normal y 3:1 para texto grande.
- **RNF-3. SEO:** las obras y series publicadas tendrán título y descripción únicos; las relaciones entre idiomas solo señalarán versiones publicadas. Las páginas públicas de contenido ofrecerán información indexable y datos estructurados coherentes con la información editorial disponible.
- **RNF-4. Rendimiento:** las imágenes destinadas a publicación se ofrecerán en tamaños adecuados a la pantalla y no se presentarán originales a máxima resolución.
- **RNF-5. Fidelidad:** ningún dato, traducción, atribución, texto alternativo o relación se inventará para completar contenido ausente.

## Casos límite

- Falta un campo obligatorio de una obra en español: no se publica ninguna versión de esa obra.
- Falta el título, la imagen o el texto alternativo obligatorio de una serie en español: no se publica la serie.
- Falta la descripción opcional de una serie: la serie puede publicarse si cumple los demás requisitos.
- Falta la imagen de una exposición: puede publicarse si título, lugar y fechas están completos.
- La imagen obligatoria de una obra o serie carece de texto alternativo en un idioma: esa versión no se publica hasta contar con texto alternativo descriptivo.
- La imagen opcional de una exposición carece de texto alternativo en un idioma: se omite la imagen en esa versión, sin impedir por ello la publicación de la página.
- Falta un campo obligatorio en inglés: se conserva la versión española publicada y se omite la versión inglesa.
- Un campo opcional está vacío o no tiene traducción: se omite en el idioma afectado sin marcador ni fallback inventado.
- La exposición continúa y todavía no tiene fecha de cierre: se admite la fecha de inicio sin cierre.
- La fecha de una exposición solo se conoce con precisión de año o de mes y año: se admite esa precisión, sin completarla con días supuestos.
- Una obra está `disponible`, `reservada`, `vendida` o `en colección`: se muestra el estado textual exacto; el estado no altera la disponibilidad de prints.
- Una obra no tiene textos críticos asociados, o un texto no tiene atribución, fecha o referencia: se omiten esos datos y no se inventan.
- No se ha definido qué obras pertenecen a una exposición o serie: no se crea una relación por inferencia.

## Fuera de alcance

- Definir variantes, precios, edición, stock, compra, checkout, pagos, envíos o políticas comerciales de originales y prints.
- Inferir o sincronizar la disponibilidad de prints a partir de `Availability` del original.
- Crear, editar o migrar contenido de producción.
- Redactar títulos, descripciones, textos críticos, traducciones o datos de obras en nombre del artista.
- Visor interactivo de alta resolución, búsqueda avanzada y funciones de usuario o pedido.

## Criterios de finalización

- [ ] Las reglas de campos obligatorios y opcionales de obras, series, exposiciones y textos críticos están definidas y son verificables.
- [ ] Las relaciones editoriales están delimitadas sin inferir participación o pertenencia que no haya sido indicada.
- [ ] Las reglas de publicación ES/EN y contenido incompleto distinguen claramente entre campos compartidos, obligatorios y opcionales.
- [ ] Los cuatro estados de disponibilidad del original se conservan y muestran textualmente, sin derivar de ellos disponibilidad de prints.
- [ ] Los requisitos de imágenes incluyen texto alternativo por idioma y contemplan la imagen opcional de exposición.
- [ ] No se incluye contenido de ejemplo que pueda confundirse con contenido real ni se altera contenido de producción.

## Dudas abiertas

- [NECESITA ACLARACIÓN] ¿Una serie requiere al menos una obra publicada asociada para poder publicarse, o bastan su título e imagen aunque todavía no tenga obras vinculadas?
- [NECESITA ACLARACIÓN] El brief requiere descripciones únicas para SEO en obras y series, mientras que la descripción editorial de serie es opcional. ¿Se aceptan descripciones breves de metadatos separadas del texto visible, o se deben derivar solo de datos catalográficos existentes?
- [NECESITA ACLARACIÓN] ¿Qué nivel de precisión deben tener las dimensiones (por ejemplo, unidad y precisión decimal), y cómo se expresan si alguna medida no consta?
- [NECESITA ACLARACIÓN] ¿Qué campos de atribución y procedencia deben ser obligatorios para textos críticos, si los hay? En este borrador se consideran opcionales porque el brief no los define.
- [NECESITA ACLARACIÓN] ¿La descripción opcional de una serie es un único texto breve por idioma o puede contener más de un bloque editorial?
