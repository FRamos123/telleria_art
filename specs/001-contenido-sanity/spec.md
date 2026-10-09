# Spec 001 — Gestión editorial de obras, series y exposiciones
Estado: aprobada

## Contexto y objetivo

Definir los datos editoriales de obras, series, exposiciones y textos críticos, sus relaciones y las condiciones para publicar y mostrar sus versiones en español e inglés. El contenido debe ser fiel a la información del artista, permitir identificar la disponibilidad del original y no exponer versiones incompletas ni traducciones inexistentes.

El proyecto parte de cero, sin esquemas ni contenido de producción que preservar. Esta spec define requisitos de contenido y publicación; no autoriza cambios en contenido de producción.

## Usuarios

- El artista, que mantiene y publica el contenido editorial.
- Visitantes que exploran obras, series y exposiciones.
- Coleccionistas y curadores que consultan información catalográfica y editorial.

## Historias de usuario

- **HU-1.** Como artista, quiero registrar los datos obligatorios y opcionales de una obra para presentar una ficha completa y fiel.
- **HU-2.** Como artista, quiero agrupar obras en series que solo sean visibles cuando estén publicadas y tengan obras visibles asociadas.
- **HU-3.** Como artista, quiero documentar exposiciones con fechas completas y una imagen opcional.
- **HU-4.** Como artista, quiero gestionar textos críticos independientes y asociarlos con obras o series sin duplicar su contenido.
- **HU-5.** Como visitante, quiero ver solo las versiones que el artista haya publicado y que estén completas en el idioma correspondiente.
- **HU-6.** Como coleccionista o curador, quiero conocer mediante una etiqueta textual el estado del original, independiente de cualquier disponibilidad de prints.

## Definiciones

- **Campo vacío:** campo cuyo contenido queda vacío después de quitar espacios en blanco.
- **Valor inválido:** valor vacío, mal formado o fuera del rango aplicable; se trata como ausente.
- **Versión publicada:** versión completa en un idioma que el editor ha publicado explícitamente.
- **Versión en borrador:** versión nueva o editada aún no publicada; no se muestra en el sitio.
- **Datos compartidos entre idiomas:** año, dimensiones, número de inventario y disponibilidad de la obra. La etiqueta de disponibilidad se presenta en el idioma de la interfaz.
- **Texto crítico:** pieza editorial independiente con idioma original declarado (`ES` o `EN`), título, cuerpo y autor en ese idioma. Las traducciones y asociaciones son opcionales.
- **Obra visible:** obra cuya versión en el idioma considerado está publicada y completa.
- **Disponibilidad del original:** uno de cuatro estados: `disponible`, `reservada`, `vendida` o `en colección`. No establece ni modifica la disponibilidad de prints.

## Requisitos funcionales

- **RF-1:** EL SISTEMA mantendrá como campos obligatorios de una obra el título, una serie asociada, una única imagen principal existente con texto alternativo, el año, la técnica, el soporte, alto y ancho en centímetros, el número de inventario y la disponibilidad del original.
- **RF-2:** EL SISTEMA mantendrá como traducibles y obligatorios en español el título, la técnica, el soporte y el texto alternativo de la obra; también deberán existir en inglés para publicar la versión inglesa. Año, dimensiones, número de inventario y disponibilidad serán compartidos, sin traducción editorial.
- **RF-3:** EL SISTEMA permitirá como contenido opcional de una obra la nota del cuaderno de taller y asociaciones a cero o más textos críticos. La obra no duplicará el título, cuerpo ni autoría del texto crítico asociado.
- **RF-4:** EL SISTEMA requerirá para una serie un nombre en español y permitirá una imagen opcional. Si se proporciona una imagen inexistente o con texto alternativo inválido, EL SISTEMA la tratará como ausente y no bloqueará la página. El nombre deberá existir también en inglés para publicar esa versión. La descripción editorial será opcional y distinta de cualquier descripción SEO derivada.
- **RF-5:** EL SISTEMA mostrará una serie publicada solo mientras tenga al menos una obra visible asociada en el mismo idioma. La publicación de la obra asociada no dependerá de que su serie esté publicada; mientras la serie no esté publicada y visible, EL SISTEMA no mostrará esa relación.
- **RF-6:** EL SISTEMA requerirá para una exposición título, lugar y fecha de inicio en español. Título y lugar deberán existir también en inglés para publicar la versión inglesa. La fecha de inicio será un día válido del calendario; la fecha de fin será opcional y, si está presente, no será anterior al inicio. La imagen será opcional; si es inexistente o tiene texto alternativo inválido, EL SISTEMA la tratará como ausente y no bloqueará la página.
- **RF-7:** EL SISTEMA permitirá relacionar exposiciones con cero o más obras y series, y textos críticos con cero o más obras y series. La ausencia de asociaciones no impedirá publicar un texto crítico.
- **RF-8:** EL SISTEMA requerirá para un texto crítico idioma original declarado como `ES` o `EN`, título, cuerpo y autor en ese idioma. Publicará la pieza en su idioma original; las traducciones y asociaciones serán opcionales.
- **RF-9:** EL SISTEMA validará que alto y ancho de una obra sean numéricos, mayores que cero y tengan como máximo un decimal. No admitirá profundidad en esta versión.
- **RF-10:** EL SISTEMA validará que el año de una obra sea un entero de cuatro cifras entre 1900 y el año en curso. Validará que el número de inventario siga el formato `AFT-AAAA-NNN`, que `AAAA` esté en ese mismo rango y que `NNN` sea un entero entre 001 y 999. El número de inventario será único en todo el catálogo; no se exigirá correspondencia entre su año y el año de la obra.
- **RF-11:** EL SISTEMA validará para cada texto alternativo que no esté vacío, tenga como máximo 150 caracteres y sea distinto del título correspondiente. En imágenes obligatorias, un texto alternativo inválido hará incompleta la versión. En imágenes opcionales, EL SISTEMA tratará una imagen con texto alternativo inválido como ausente y no bloqueará la página. La valoración de la calidad descriptiva seguirá una guía editorial y no una regla automática.
- **RF-12:** EL SISTEMA admitirá como disponibilidad de una obra únicamente `disponible`, `reservada`, `vendida` o `en colección`; el campo será obligatorio y no tendrá valor por defecto. La etiqueta visible procederá del diccionario de la interfaz. Las cuatro etiquetas deberán existir en español e inglés; SI falta una, ENTONCES la verificación automática de claves lingüísticas fallará.
- **RF-13:** SI un campo obligatorio está vacío después de quitar espacios, o contiene un valor mal formado o fuera de rango, ENTONCES EL SISTEMA considerará incompleta la versión afectada. SI un campo opcional está vacío o es inválido, ENTONCES EL SISTEMA lo tratará como ausente y no lo usará para impedir la publicación.
- **RF-14:** CUANDO el editor edite una entidad publicada, EL SISTEMA mantendrá visible la versión publicada hasta que el editor publique una revisión completa. Las ediciones en curso serán borradores y no se mostrarán. CUANDO el editor solicite publicar, EL SISTEMA publicará únicamente las versiones completas en sus idiomas correspondientes; completar campos no publicará una versión por sí solo. MIENTRAS una versión esté incompleta, EL SISTEMA la mantendrá en borrador e indicará qué requisitos faltan o son inválidos, sin impedir que se publique otra versión completa de la misma entidad.
- **RF-15:** EL SISTEMA exigirá español completo para publicar obras, series y exposiciones. Para publicar sus versiones en inglés, exigirá título, técnica, soporte y texto alternativo de la obra; nombre de la serie; y título y lugar de la exposición en inglés, según corresponda. Los datos compartidos de obra serán iguales en ambas versiones.
- **RF-16:** EL SISTEMA publicará un texto crítico en su idioma original declarado si idioma, título, cuerpo y autor están completos y válidos en ese idioma. No exigirá versión española cuando el idioma original sea inglés. Las traducciones opcionales se mostrarán solo en el idioma en que existan; no se sustituirán por el contenido de otro idioma.
- **RF-17:** SI una obra, serie o exposición publicada deja de cumplir la completitud inglesa, ENTONCES EL SISTEMA retirará del sitio esa versión y sus enlaces de idioma, sin afectar la versión española. SI una de esas entidades pierde la completitud española, ENTONCES EL SISTEMA la retirará del sitio en todos los idiomas. SI un texto crítico deja de cumplir los requisitos de su idioma original, ENTONCES EL SISTEMA lo retirará junto con sus traducciones; si pierde la completitud de una traducción opcional, EL SISTEMA retirará solo esa traducción.
- **RF-18:** CUANDO una entidad relacionada no esté publicada o completa en el idioma de la página, EL SISTEMA conservará la relación pero no la mostrará ni generará un enlace hacia ella. CUANDO el destino vuelva a estar publicado y completo en ese idioma, EL SISTEMA volverá a mostrar automáticamente la relación. Una relación con una serie solo se mostrará mientras esta sea visible, es decir, esté publicada y tenga al menos una obra visible asociada en ese idioma. Si una serie publicada deja de tener obras visibles asociadas, EL SISTEMA dejará de mostrarla y retirará sus enlaces; cuando vuelva a tener al menos una obra visible, EL SISTEMA volverá a mostrarla automáticamente.
- **RF-19:** CUANDO el editor despublique una entidad, EL SISTEMA la retirará del sitio sin crear redirecciones. Las relaciones se conservarán y se mostrarán de nuevo automáticamente si su destino vuelve a estar publicado y completo en el idioma correspondiente.
- **RF-20:** EL SISTEMA mostrará la disponibilidad del original mediante su etiqueta textual localizada y no la utilizará para inferir, establecer o modificar la disponibilidad de prints.
- **RF-21:** EL SISTEMA compondrá la línea catalográfica breve de una obra a partir de su título y datos técnicos existentes, sin exigir ni guardar un texto duplicado con esa función.
- **RF-22:** EL SISTEMA no completará campos ausentes con datos, traducciones, atribuciones, textos alternativos o relaciones inventados.

## Requisitos no funcionales

- **RNF-1. i18n:** las versiones públicas de obras, series y exposiciones estarán disponibles en español como idioma base; las versiones inglesas solo estarán disponibles cuando cumplan los requisitos lingüísticos de esta spec. Los textos críticos se publicarán en su idioma original y podrán tener traducciones opcionales.
- **RNF-2. Datos editoriales de origen:** el modelo conservará para cada página el nombre o título, la descripción editorial cuando exista y la imagen principal aplicable como datos fuente para derivar su título y descripción de página en las especificaciones correspondientes. La descripción SEO no será un campo editorial.
- **RNF-3. Imágenes:** las imágenes servidas no superarán 2000 px por su lado mayor y se servirán en formato AVIF o WebP con tamaños responsive.
- **RNF-4. Fidelidad:** ningún dato del artista se inventará para completar una entidad o versión.

## Casos límite

- Una obra carece de un campo obligatorio en español, su imagen principal no existe o un valor obligatorio está vacío o es inválido: su versión queda incompleta y no se publica.
- La imagen principal de una obra tiene texto alternativo vacío, superior a 150 caracteres o igual al título: la versión queda incompleta.
- Una obra carece en inglés de título, técnica, soporte o texto alternativo válido: no se publica su versión inglesa; la española puede publicarse si está completa y el editor solicita publicarla.
- Una serie carece de nombre inglés, o una exposición carece de título o lugar inglés: no se publica la versión inglesa; la española puede seguir publicada.
- Falta alto o ancho, una dimensión no es numérica, es igual o menor que cero o tiene más de un decimal: la obra está incompleta. No se admite profundidad.
- El año de obra es anterior a 1900, posterior al año en curso, no es un entero de cuatro cifras o está mal formado: la obra está incompleta.
- El inventario está mal formado, duplicado, tiene `AAAA` fuera del rango 1900–año en curso o `NNN` fuera de 001–999: la obra está incompleta. El año del inventario puede diferir del año de la obra.
- Falta disponibilidad o su valor no es uno de los cuatro estados permitidos: la obra está incompleta; no se asigna un estado por defecto.
- Falta cualquiera de las cuatro etiquetas de disponibilidad en ES o EN: falla la verificación automática de claves lingüísticas.
- Se completa una entidad o versión sin que el editor solicite publicar: permanece como borrador. Una revisión incompleta no sustituye ni retira la versión previamente publicada.
- Un campo opcional está ausente o inválido: no afecta a la completitud; se omite en los idiomas en que no exista, sin usar el valor de otro idioma.
- Una imagen opcional de serie o exposición no existe, o su texto alternativo es inválido: se omite la imagen y la página puede publicarse.
- Una serie no tiene al menos una obra visible asociada: no se muestra ni se ofrecen enlaces a ella. Si recupera una obra visible, vuelve a mostrarse sin una nueva acción de publicación de la serie.
- Una obra está asociada a una serie no publicada: la obra puede publicarse y mostrarse; la relación con la serie no se muestra hasta que esta esté publicada y visible.
- Un texto crítico tiene idioma original ausente o inválido, o carece de título, cuerpo o autor válido en ese idioma: queda incompleto y en borrador.
- Un texto crítico tiene idioma original inglés y no tiene traducción española: puede publicarse en inglés si cumple sus campos obligatorios.
- Una relación apunta a una entidad no publicada o incompleta en ese idioma: se conserva sin mostrarse ni producir un enlace roto; reaparece cuando el destino vuelve a estar publicado y completo en ese idioma.
- Una fecha no es un día real del calendario, falta el inicio o el fin es anterior al inicio: la exposición está incompleta. Si no hay fecha de fin, se considera en curso.
- Una obra, serie o exposición publicada pierde completitud EN: se retira EN y sus enlaces, sin afectar ES. Si pierde completitud ES, se retira en todos los idiomas.
- Un texto crítico pierde completitud en el idioma original: se retira junto con sus traducciones; si la pierde una traducción opcional, se retira solo esa traducción.
- Una entidad despublicada se retira del sitio y no genera redirecciones; sus relaciones se conservan.
- `disponible`, `reservada`, `vendida` y `en colección` se presentan mediante sus etiquetas textuales localizadas. Ningún estado determina la disponibilidad de prints.

## Fuera de alcance

- Definir o generar títulos y descripciones SEO, incluido el valor derivado de descripción SEO. La descripción editorial opcional de una serie es contenido distinto y no constituye un campo SEO.
- Definir requisitos de JSON-LD, mapas del sitio, metadatos SEO de páginas o su presentación; corresponden a las especificaciones de páginas y a la spec 006.
- Definir el tratamiento visual de los estados de disponibilidad, que corresponde a la spec 002.
- Imágenes de detalle; esta versión contempla una imagen principal por obra y una imagen opcional por serie o exposición.
- Definir variantes, precios, edición, stock, compra, checkout, pagos, envíos o políticas comerciales de originales y prints.
- Inferir o sincronizar la disponibilidad de prints a partir de la disponibilidad del original.
- Crear, editar o migrar contenido de producción, o redactar contenido del artista en su nombre.
- Visor interactivo de alta resolución, búsqueda avanzada y funciones de usuario o pedido.

## Criterios de finalización

- [ ] Los campos obligatorios y opcionales y su carácter traducible o compartido están definidos para las cuatro entidades.
- [ ] Se puede verificar la completitud con reglas de presencia, formato y rango explícitas.
- [ ] La publicación exige una acción editorial explícita y contenido completo en el idioma correspondiente; las revisiones borrador no sustituyen la versión publicada.
- [ ] La visibilidad de series y relaciones sigue las condiciones de publicación y completitud lingüística.
- [ ] Se especifica la excepción lingüística de los textos críticos y se preserva su independencia editorial.
- [ ] Los cuatro estados del original son válidos, sus etiquetas existen en ES y EN y ninguno determina la disponibilidad de prints.
- [ ] Las reglas de existencia, obligatoriedad, texto alternativo y formato/tamaño de imágenes están delimitadas.
- [ ] No se incluye contenido de ejemplo que pueda confundirse con contenido real ni se altera contenido de producción.

## Decisiones cerradas

- «Distinta» (RF-4 y Fuera de alcance) significa campo y concepto independientes: la descripción editorial es contenido que edita el artista; la descripción SEO es un valor derivado, no editable. Que la SEO se derive de la editorial no contradice esa distinción, según RNF-2.

## Dudas abiertas

- Ninguna pendiente de esta clarificación.
