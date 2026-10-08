# Product brief — Portfolio AF Tellería

**Estado:** borrador — actualizado el 2026-10-07 para incluir comercio electrónico; decisiones comerciales y técnicas pendientes.
**Alcance:** producto completo. No es una spec de implementación: de aquí salen las specs funcionales que se definan y aprueben.

## Contexto y objetivo

El portfolio debe dar visibilidad a la obra y trayectoria de Alejandro Fernández Tellería, facilitar consultas de coleccionistas e instituciones y permitir comprar la obra original cuando esté disponible o encargar prints en los tamaños que se definan. Los pagos se realizarán mediante una pasarela, todavía por elegir. El contenido debe presentarse en español e inglés sin inventar datos del artista. La definición de productos, precios, logística y políticas precederá a cualquier implementación comercial.

## Usuarios

- Coleccionistas que desean conocer una obra y comprar el original cuando esté disponible o adquirir prints configurados.
- Curadores e instituciones que desean revisar obras, series y exposiciones, o realizar una consulta institucional.
- Visitantes que desean descubrir la obra y trayectoria del artista.
- Personas que desean encargar una reproducción impresa de una obra.

## Historias de usuario

- **HU-1.** Como coleccionista, quiero consultar una ficha completa y el estado de una obra para valorar la compra del original o de un print.
- **HU-2.** Como curador, quiero explorar obras, series y exposiciones para evaluar su interés institucional.
- **HU-3.** Como visitante, quiero consultar el portfolio en español o inglés para comprender la obra y trayectoria en el idioma que elija.
- **HU-4.** Como coleccionista o representante institucional, quiero enviar una consulta para contactar con el artista sobre una obra o exposición.
- **HU-5.** Como comprador, quiero elegir una opción de compra disponible y pagarla mediante una pasarela para recibir el original o el print solicitado.

## Definiciones

| Término | Significado |
|---|---|
| **Disponibilidad del original** | Uno de estos estados de la pieza única: `disponible`, `reservada`, `vendida` o `en colección`. La disponibilidad/stock de sus prints se definirá por separado. |
| **Obra original** | La pieza única descrita por la ficha de obra; su compra depende de su disponibilidad. |
| **Print** | Reproducción de una obra ofrecida como producto independiente; tamaños, precio, edición y disponibilidad están por definir. |
| **Compra** | Pedido de un original disponible o de un print configurado, con pago a través de una pasarela aún por elegir. |
| **Consulta** | Mensaje de contacto sobre una obra, serie, exposición o asunto institucional; es independiente del checkout. |
| **Campos obligatorios de una obra** | Título, serie, imagen con texto alternativo, año, técnica, soporte, dimensiones, número de inventario y disponibilidad. |
| **Campos opcionales de una obra** | Nota del cuaderno de taller y textos críticos asociados. |
| **Campos obligatorios de una exposición** | Título, lugar y fechas. La imagen es opcional. |

## Requisitos funcionales

- **RF-1. Idioma.** **CUANDO** una persona acceda al portfolio, **EL SISTEMA** mostrará la versión española por defecto y ofrecerá la versión inglesa.
- **RF-2. Inicio.** **CUANDO** una persona visite la página principal, **EL SISTEMA** presentará la identidad del artista y enlaces para explorar su obra, series, exposiciones y contacto.
- **RF-3. Series.** **CUANDO** una persona seleccione una serie, **EL SISTEMA** mostrará las obras asociadas y permitirá acceder a la ficha individual de cada obra.
- **RF-4. Fichas públicas.** **CUANDO** una persona consulte una obra publicada, **EL SISTEMA** mostrará sus campos obligatorios (título, serie, imagen con texto alternativo descriptivo, año, técnica, soporte, dimensiones en centímetros, número de inventario y disponibilidad) y, cuando existan, sus campos opcionales (nota del cuaderno de taller y textos críticos asociados).
- **RF-5. Disponibilidad visible.** **EL SISTEMA** mostrará siempre el estado de disponibilidad como texto; nunca lo comunicará únicamente mediante color.
- **RF-6. Compra del original.** **CUANDO** una persona consulte una obra cuyo estado sea `disponible`, **EL SISTEMA** ofrecerá la opción de comprar el original. **MIENTRAS** su estado sea `reservada`, `vendida` o `en colección`, **EL SISTEMA** no ofrecerá comprar el original y mostrará siempre el estado como texto.
- **RF-7. Compra de prints.** **CUANDO** una persona consulte una obra con uno o más prints configurados para la venta, **EL SISTEMA** permitirá seleccionar únicamente las variantes publicadas. Los tamaños y demás variantes disponibles se definirán antes de aprobar la spec comercial; la relación entre disponibilidad del print y estado del original sigue abierta.
- **RF-8. Exposiciones y textos.** **CUANDO** una persona explore el portfolio, **EL SISTEMA** presentará las exposiciones y los textos críticos disponibles, vinculándolos con las obras o series correspondientes cuando esa relación esté definida.
- **RF-9. Consultas.** **CUANDO** una persona envíe una consulta, **EL SISTEMA** solicitará los datos de contacto y el mensaje necesarios para responder y mostrará confirmación solo cuando el envío se haya aceptado.
- **RF-10. Errores del formulario.**
  - **SI** faltan campos obligatorios o algún dato no es válido, **ENTONCES EL SISTEMA** indicará qué debe corregirse y conservará los datos ya introducidos.
  - **SI** el envío falla, **ENTONCES EL SISTEMA** informará del fallo y permitirá volver a intentarlo.
- **RF-11. Contenido incompleto.**
  - **SI** una obra o exposición carece de un campo obligatorio (incluida la imagen de una obra) en español, **ENTONCES EL SISTEMA** no publicará ninguna versión hasta que el contenido esté completo.
  - **SI** falta la versión inglesa de una página, **ENTONCES EL SISTEMA** mantendrá publicada la versión española, no publicará la inglesa y no ofrecerá enlaces entre idiomas hacia una versión inexistente.
- **RF-12. Fidelidad del contenido.** **SI** falta información del artista, **ENTONCES EL SISTEMA** no la inventará ni la sustituirá por texto que pueda confundirse con contenido auténtico.
- **RF-13. Comercio.** **CUANDO** una persona elija un original disponible o un print configurado, **EL SISTEMA** permitirá continuar con su compra y el pago mediante una pasarela aprobada. El checkout mostrará el producto, variante, precio y costes aplicables que se hayan definido. No se publicará una opción comprable sin sus datos comerciales obligatorios.
- **RF-14. Privacidad.** **CUANDO** una persona vaya a enviar una consulta, **EL SISTEMA** mostrará un aviso de privacidad que indique la finalidad del tratamiento y el responsable, y exigirá su consentimiento expreso antes de aceptar el envío. **EL SISTEMA** usará los datos de la consulta solo para responderla.
- **RF-15. Protección frente a spam.** **SI** un envío no supera la verificación antispam, **ENTONCES EL SISTEMA** lo rechazará, informará de ello y permitirá reintentarlo conservando los datos ya introducidos.
- **RF-16. Confirmación de pago.** **CUANDO** la pasarela confirme un pago satisfactorio, **EL SISTEMA** informará de que el pedido se ha completado; **SI** el pago se cancela, falla o no puede confirmarse, **ENTONCES EL SISTEMA** no lo presentará como una compra completada y ofrecerá el siguiente paso definido por la spec comercial.
- **RF-17. Datos de pago.** **EL SISTEMA** no almacenará datos sensibles de tarjetas ni los procesará directamente; el tratamiento del pago corresponderá a la pasarela aprobada.

## Requisitos no funcionales

- **RNF-1. i18n.** La navegación y el contenido publicado estarán disponibles en español e inglés, con acceso entre las versiones equivalentes cuando existan.
- **RNF-2. Accesibilidad.** El texto cumplirá WCAG AA, con contraste mínimo de 4.5:1 para texto normal y 3:1 para texto grande. Los estados tendrán etiqueta textual; el texto usará colores sólidos, sin opacidad.
- **RNF-3. Diseño.** La interfaz respetará los patrones y tokens acordados en `design/tokens.md`.
- **RNF-4. SEO.** Las páginas públicas de obras y series tendrán URL propia, título y descripción únicos. El contenido incluirá datos estructurados para artista, obras y exposiciones, relaciones de idioma (solo entre versiones publicadas) y mapas del sitio de páginas e imágenes.
- **RNF-5. Contenido visible.** El contenido principal de cada página estará disponible para los motores de búsqueda y para las personas sin depender de ejecutar interacciones del navegador.
- **RNF-6. Imágenes.** Las imágenes tendrán texto alternativo descriptivo y se mostrarán en tamaños adecuados a la pantalla, sin presentar originales a máxima resolución.
- **RNF-7. Rendimiento.** Lighthouse alcanzará al menos 90 en rendimiento, 95 en accesibilidad y 100 en SEO en las páginas evaluadas.
- **RNF-8. Seguridad de pago.** La integración no expondrá secretos de la pasarela en el cliente ni guardará datos sensibles de pago en el proyecto; los detalles verificables se fijarán en la spec de comercio una vez elegido el proveedor.

## Casos límite

| Situación | Comportamiento esperado |
|---|---|
| Falta la imagen principal de una obra | No se publica la obra: la imagen es obligatoria. |
| Falta la imagen de una exposición | Se publica la exposición sin imagen: es opcional. |
| Falta la traducción al inglés de una página | Se mantiene la versión española; la inglesa no se publica y el selector de idioma y `hreflang` solo enlazan versiones existentes. |
| Falta un campo obligatorio en español | No se publica ninguna versión de la página. |
| Hay campos opcionales vacíos | No se inventa contenido; la ficha omite el dato vacío. |
| La obra está reservada, vendida o en colección | Se muestra el estado textual y se oculta la compra del original. |
| La obra está disponible | Se puede ofrecer la compra del original; la disponibilidad de prints se determina por separado. |
| El original no está disponible, pero existen prints publicados | La disponibilidad de compra del print dependerá de una regla comercial aún pendiente; no se inferirá automáticamente del estado del original. |
| No se han definido tamaños, precio, edición, gastos o logística de un print | No se publica ese print como comprable hasta completar los datos obligatorios que se acuerden. |
| El pago falla, se cancela o queda sin confirmar | No se muestra una confirmación de compra completada. |
| El formulario contiene errores o no se puede enviar | Se informa del problema y se permite corregir o reintentar sin perder los datos introducidos. |
| El envío no supera la verificación antispam | Se rechaza, se informa y se permite reintentar sin perder los datos. |
| La persona no da su consentimiento de privacidad para una consulta | No se acepta el envío y se indica que el consentimiento es necesario. |

## Fuera de alcance

- Cuentas de usuario y funciones avanzadas de gestión de pedidos, salvo que una spec posterior las apruebe.
- Audioguías y visitas al taller.
- Boletines por email.
- Visor interactivo de obras (zoom de alta resolución) y búsqueda avanzada: quedan para una versión posterior.
- Analítica y cookies no esenciales. Si se añaden más adelante, será necesario un aviso de cookies.

## Criterios de finalización

- [ ] Se puede recorrer la presentación, las obras, las series, las exposiciones y el contacto en ambos idiomas cuando su contenido esté completo.
- [ ] Cada serie y obra publicada tiene una dirección propia y la información correspondiente aparece en su página.
- [ ] Los cuatro estados de disponibilidad se muestran mediante texto; solo las obras disponibles ofrecen la compra del original.
- [ ] Los originales y prints se pueden comprar mediante la pasarela elegida conforme a variantes, precios, logística y políticas aprobados; un fallo de pago nunca se presenta como pedido completado.
- [ ] El formulario valida los datos, exige consentimiento de privacidad, resiste el spam, identifica la obra cuando corresponde y da mensajes coherentes de éxito o error.
- [ ] Las páginas verificadas alcanzan los objetivos de accesibilidad, SEO y rendimiento indicados.

## Decisiones cerradas

- Campos obligatorios y opcionales de obra y exposición: ver *Definiciones*.
- Si falta solo la traducción EN, se oculta únicamente la versión inglesa; la española sigue publicada.
- Visor interactivo y búsqueda avanzada: fuera de la v1.
- El formulario incluye consentimiento de privacidad y protección antispam.
- Se ofrecerán compra de obra original y prints mediante pasarela; la pasarela y las reglas comerciales aún no están seleccionadas/cerradas.

## Dudas abiertas

- [NECESITA ACLARACIÓN] ¿Qué pasarela de pago se usará y qué flujo de checkout ofrece (alojado/redirect, incrustado u otro)? ¿En qué países se venderá y en qué moneda?
- [NECESITA ACLARACIÓN] ¿Cuál será el precio del original y de cada print, y cómo se mostrarán impuestos y gastos antes de pagar?
- [NECESITA ACLARACIÓN] ¿Qué tamaños de print habrá, serán ediciones limitadas o abiertas, y qué papel/acabados deben describirse?
- [NECESITA ACLARACIÓN] ¿Los prints seguirán disponibles aunque el original esté reservado, vendido o en colección? ¿Cómo se gestionan su stock y el del original, y cuándo se actualiza `Availability` tras una compra?
- [NECESITA ACLARACIÓN] ¿Quién produce, empaqueta y envía los pedidos, a qué destinos, con qué plazos y costes?
- [NECESITA ACLARACIÓN] ¿Qué políticas de cancelación, devolución, reembolso, daños en tránsito y atención posventa se aplican?
- [NECESITA ACLARACIÓN] ¿Qué datos de comprador se recogen, quién es responsable del tratamiento, cuánto se conservan y qué avisos/consentimientos legales hacen falta para consultas y pedidos?
- [NECESITA ACLARACIÓN] ¿Qué emails de confirmación/estado se enviarán y quién los enviará?
- [NECESITA ACLARACIÓN] ¿Quién redacta y revisa los textos legales de privacidad, venta, envío y devoluciones?
