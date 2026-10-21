# Spec 005 — Consultas de contacto
Estado: aprobada

## Contexto y objetivo

Coleccionistas y representantes de instituciones necesitan una forma clara y accesible de contactar con el artista para consultar sobre obras, series, exposiciones o asuntos institucionales. Esta consulta debe funcionar de manera independiente de cualquier compra: enviar un mensaje no inicia una operación comercial ni implica que una obra esté disponible para su adquisición.

La spec define los datos mínimos para responder, cómo corregir y reintentar un envío, la identificación opcional de una obra, la confirmación de recepción y la protección frente al spam. El aviso de privacidad y el consentimiento deben ser veraces y revisados por una persona responsable; no se redactan textos legales por inferencia.

## Usuarios

- Coleccionistas que desean consultar sobre una obra o la trayectoria del artista.
- Curadores, representantes y otras personas de instituciones que desean realizar una consulta institucional.

## Historias de usuario

- **HU-1.** Como coleccionista, quiero enviar una consulta sobre una obra o serie para solicitar información al artista sin tener que iniciar una compra.
- **HU-2.** Como representante de una institución, quiero contactar con el artista sobre sus obras, exposiciones o un posible interés institucional para poder plantear una consulta.
- **HU-3.** Como persona que envía una consulta, quiero entender qué datos se solicitan y para qué se usarán antes de consentir su envío.
- **HU-4.** Como persona que encuentra un error o un fallo al enviar, quiero conservar lo que ya escribí y poder corregirlo o reintentarlo.

## Definiciones

- **Consulta:** mensaje de contacto sobre una obra, serie, exposición o asunto institucional; no es un pedido ni una solicitud de pago.
- **Envío aceptado:** consulta que el servicio de correo confirma haber aceptado para entrega. Esto no confirma que haya llegado a la bandeja del destinatario ni que se haya leído, y no garantiza una respuesta en un plazo determinado.
- **Obra asociada:** referencia opcional a una obra publicada que ayuda a contextualizar el mensaje; no expresa disponibilidad de compra.
- **Buzón dedicado:** cuenta Gmail separada, utilizada únicamente para las consultas del sitio y para las solicitudes de privacidad relacionadas. Cloudflare Email Routing reenviará a ella el alias del dominio; las respuestas se enviarán desde Gmail, no desde el alias.
- **Buzón provisional:** `consultas@example.invalid`, placeholder no enrutable para maquetas. No es una dirección real y debe sustituirse por el buzón oficial antes de habilitar envíos reales.

## Requisitos funcionales

- **RF-1. Idioma.** **CUANDO** una persona acceda al formulario en español o inglés, **EL SISTEMA** presentará en ese idioma los campos, instrucciones, errores, mensajes de protección antispam y confirmaciones disponibles.
- **RF-2. Campos.** **EL SISTEMA** solicitará nombre, email y mensaje como campos obligatorios, y ofrecerá institución, teléfono y obra asociada como campos opcionales. No solicitará teléfono como requisito para enviar una consulta.
- **RF-3. Validación.** **CUANDO** una persona envíe el formulario, **EL SISTEMA** eliminará espacios al principio y al final, exigirá que nombre, email y mensaje contengan texto, validará el formato del email y rechazará los valores que superen estos máximos: nombre 100 caracteres, email 254, institución 150, teléfono 30 y mensaje 5.000. Los campos opcionales vacíos se aceptarán como no informados. Si se informa un teléfono, **EL SISTEMA** aceptará entre 7 y 15 dígitos, un `+` opcional solo al principio y espacios, guiones o paréntesis como separadores. No comprobará que el número exista.
- **RF-4. Errores de validación.** **SI** falta un dato obligatorio o un valor no pasa la validación, **ENTONCES EL SISTEMA** indicará qué campo debe corregirse y conservará los valores introducidos y la selección de obra para permitir la corrección sin volver a completar el formulario.
- **RF-5. Obra asociada.** **CUANDO** una persona quiera asociar una obra, **EL SISTEMA** ofrecerá opcionalmente obras incluidas en la última versión desplegada del sitio y con traducción en el idioma de la consulta, y preseleccionará la obra correspondiente si el formulario se abre desde su ficha. La lista incluirá obras en cualquiera de los estados `disponible`, `reservada`, `vendida` y `en colección`; asociar una obra no ofrecerá ni iniciará su compra. Para este requisito, la última versión desplegada es la fuente de verdad: una publicación o despublicación posterior en Sanity no surtirá efecto hasta el siguiente despliegue. **SI** la obra no está incluida en la versión desplegada que atiende el envío, **ENTONCES EL SISTEMA** no expondrá ni enviará sus datos, conservará el resto del formulario e indicará que se debe quitar esa selección o elegir otra obra publicada antes de reintentar.
- **RF-6. Protección antispam.** **SI** un envío no supera la verificación antispam, **ENTONCES EL SISTEMA** lo rechazará, explicará que no se ha aceptado y permitirá reintentarlo conservando los valores del formulario.
- **RF-7. Fallo de envío.** **SI** el servicio de correo no confirma que ha aceptado el mensaje para entrega, **ENTONCES EL SISTEMA** no mostrará una confirmación de recepción, informará del fallo y permitirá reintentar sin borrar los valores introducidos.
- **RF-8. Confirmación.** **CUANDO** la validación sea correcta, exista consentimiento expreso, se supere la verificación antispam y el servicio de correo acepte el mensaje para entrega, **EL SISTEMA** mostrará una confirmación en la página y solo entonces limpiará los campos. La confirmación no prometerá entrega final, lectura, un plazo de respuesta ni un email de confirmación.
- **RF-9. Privacidad y consentimiento.** **ANTES** de aceptar una consulta, **EL SISTEMA** mostrará un aviso de privacidad que indique la finalidad del tratamiento, que la persona responsable es Alejandro Fernández Tellería y cómo contactar con ella, y requerirá consentimiento expreso. **SI** la persona no consiente, **ENTONCES EL SISTEMA** no aceptará el envío e indicará que el consentimiento es necesario. **EL SISTEMA** usará los datos de la consulta únicamente para responderla. El mismo buzón será el canal de contacto para consultas de privacidad y ejercicio de derechos. La exigencia de la casilla de consentimiento proviene del brief y no implica que el consentimiento sea la única base jurídica; la persona responsable determinará la base aplicable y el aviso la describirá con exactitud.
- **RF-10. Destinatario y buzón provisional.** **CUANDO** una consulta sea aceptada, **EL SISTEMA** la dirigirá al buzón oficial de Alejandro Fernández Tellería. **MIENTRAS** la única dirección configurada sea el placeholder `consultas@example.invalid`, **EL SISTEMA** no aceptará envíos reales; la dirección deberá sustituirse antes de habilitar el formulario para consultas reales.
- **RF-11. Conservación provisional.** **MIENTRAS** una consulta permanezca activa, **EL SISTEMA** enviará sus datos únicamente al buzón dedicado y no conservará una copia propia; la persona responsable conservará en el buzón los datos necesarios para responderla y revisará las consultas a diario. **CUANDO** hayan transcurrido 90 días desde la última interacción sustantiva recibida o enviada sobre la consulta, la persona responsable eliminará manualmente y de forma definitiva el hilo completo bajo su control, incluidos los mensajes enviados, adjuntos y elementos de la papelera. Cada nueva interacción sustantiva reiniciará el plazo del hilo. Se exceptúa una obligación o reclamación concreta que justifique conservación restringida.

  La política general publicada por Google indica que el borrado de sus sistemas suele tardar alrededor de 2 meses y que los datos pueden permanecer en respaldos cifrados hasta 6 meses; no es un plazo contractual específico de Gmail. Esta retención limitada del proveedor para continuidad/recuperación queda expresamente aceptada, aunque exceda los 90 días de borrado operativo del buzón. Cloudflare Email Routing no almacena el contenido del correo según su documentación; sus eventos de encaminamiento, que pueden incluir remitente, destinatario, asunto e identificador del mensaje, se conservan hasta 31 días. Resend conserva contenido y metadatos del correo durante 30 días. El aviso aprobado describirá estos plazos y la diferencia entre el borrado del buzón y las copias limitadas de respaldo.

## Requisitos no funcionales

- **RNF-1. i18n.** El formulario y sus mensajes estarán disponibles en español e inglés. El aviso de privacidad y su consentimiento no se publicarán en un idioma sin una versión revisada para ese idioma.
- **RNF-2. Accesibilidad.** El formulario cumplirá WCAG 2.2 AA: controles operables con teclado, etiquetas comprensibles, errores asociados a los campos correspondientes y mensajes que no comuniquen errores únicamente mediante color. El texto normal tendrá contraste mínimo 4.5:1 y el texto grande 3:1.
- **RNF-3. SEO.** La página pública de contacto tendrá título y descripción únicos y localizados. Las relaciones entre idiomas solo se ofrecerán para versiones disponibles.
- **RNF-4. Rendimiento.** En la página de contacto, Lighthouse móvil alcanzará al menos 90 en rendimiento, 95 en accesibilidad y 100 en SEO.
- **RNF-5. Privacidad.** La recogida de datos se limitará a los campos definidos en esta spec. Los datos de contacto y el contenido del mensaje no se reutilizarán para boletines, publicidad ni otros fines distintos de responder a la consulta.
- **RNF-6. Interfaz.** El formulario mantendrá el sistema visual aprobado y el texto conservará contraste accesible en todos sus estados, incluidos errores, foco y confirmación.

## Casos límite

| Situación | Comportamiento esperado |
|---|---|
| Nombre, email o mensaje vacío o compuesto solo por espacios | Se rechaza el envío, se señala el campo y se conservan los demás valores. |
| Email con formato no válido | Se rechaza el envío, se indica la corrección necesaria y se conserva el valor para editarlo. |
| Teléfono opcional vacío | Se acepta como no informado. |
| Teléfono informado | Se acepta si contiene entre 7 y 15 dígitos, con `+` opcional al inicio y espacios, guiones o paréntesis como separadores; no se comprueba su existencia. |
| Institución o teléfono supera su máximo | Se indica el campo que debe corregirse y se conservan los demás valores. |
| Mensaje, nombre o email supera su máximo | Se indica el campo que debe corregirse; no se acepta el envío. |
| No se selecciona ninguna obra | La consulta puede enviarse si los demás requisitos se cumplen. |
| La obra seleccionada figura como disponible, reservada, vendida o en colección | Se permite asociarla; el estado no cambia la posibilidad de enviar una consulta ni implica una compra. |
| La obra no está incluida en la última versión desplegada que atiende el envío | No se expone ni envía información de la obra; se conserva el resto y se pide quitar la selección o elegir otra obra publicada. |
| La obra se despublica en Sanity mientras el siguiente despliegue está pendiente | La versión desplegada sigue siendo la fuente de verdad hasta el siguiente despliegue; la obra puede asociarse mientras siga incluida en esa versión. |
| Obra publicada sin traducción en el idioma del formulario | No se muestra en la lista de ese idioma; la identificación de obra sigue siendo opcional. |
| Llega o se envía una nueva respuesta sustantiva sobre una consulta | La persona responsable actualiza manualmente la fecha de última interacción del hilo; el plazo provisional de 90 días comienza de nuevo. |
| Han pasado 90 días desde la última interacción sustantiva y no hay obligación o reclamación concreta | La persona responsable elimina definitivamente el hilo completo del buzón Gmail, incluidos enviados, adjuntos y papelera. Las copias de respaldo cifradas de Google pueden persistir hasta 6 meses según la excepción aprobada. |
| La consulta se reenvía por Cloudflare Email Routing | Cloudflare no almacena el contenido según su documentación; los eventos de encaminamiento (metadatos) se conservan hasta 31 días. Las respuestas salen desde la cuenta Gmail dedicada. |
| La persona no da su consentimiento | No se acepta el envío y se indica que el consentimiento es necesario. |
| La verificación antispam falla | Se rechaza el envío, se informa del problema y se conservan los valores para reintentar. |
| Ocurre un fallo o no se puede confirmar la recepción | No se muestra éxito; se informa del fallo y se conservan los valores para reintentar. |
| El buzón configurado sigue siendo `consultas@example.invalid` | No se acepta ni intenta un envío real; el placeholder se usa solo en maquetas y debe reemplazarse antes de habilitar envíos. |
| El servicio de correo acepta el mensaje para entrega | Se confirma en la página y se limpian los campos. No se afirma entrega final, lectura ni respuesta inmediata. |

## Fuera de alcance

- Checkout, pagos, carrito, pedidos, reservas comerciales, cobros y gestión de pedidos.
- Recogida de datos de facturación, envío o pago.
- Boletines, suscripciones de marketing y uso de los datos para fines distintos de responder a la consulta.
- Promesas de disponibilidad, compra o reserva de una obra a partir de una consulta.
- Promesa de un plazo de respuesta o de un email automático de confirmación.
- Redacción automática o publicación de textos legales no proporcionados y revisados por la persona responsable.

## Criterios de finalización

- [ ] El formulario en español e inglés presenta los campos obligatorios y opcionales, con los máximos y validaciones especificados.
- [ ] Los errores de validación, rechazo antispam y fallo de envío conservan los valores introducidos y permiten corregir o reintentar; solo un envío aceptado produce confirmación y limpieza de campos.
- [ ] La obra asociada es opcional, se elige entre obras incluidas en la última versión desplegada y traducidas al idioma correspondiente, y puede tener cualquiera de los cuatro estados de disponibilidad sin implicar una compra.
- [ ] El consentimiento expreso bloquea el envío cuando no se otorga; el aviso publicado identifica la finalidad y al responsable y ha sido revisado en cada idioma.
- [ ] El buzón oficial reemplaza `consultas@example.invalid` antes de habilitar envíos reales; el mismo buzón recibe consultas de privacidad y ejercicio de derechos.
- [ ] El aviso y el consentimiento en español e inglés han sido aprobados por la persona responsable antes de habilitar envíos reales; describen el borrado operativo a 90 días, la excepción de respaldos Gmail hasta 6 meses, y las retenciones de Cloudflare Routing (31 días) y Resend (30 días), además de destinatarios/proveedores y transferencias confirmados.
- [ ] La persona responsable aplica y documenta la revisión diaria y el borrado manual definitivo del hilo completo al cumplirse 90 días desde la última interacción sustantiva, reiniciando el plazo tras cada nueva respuesta; las copias de respaldo cifradas de Gmail hasta 6 meses son la excepción limitada aprobada.
- [ ] La página cumple los requisitos de accesibilidad, SEO y rendimiento establecidos en esta spec.
- [ ] El flujo no inicia compras, pagos ni gestión de pedidos.

## Dependencias previas a envíos reales

- La persona responsable creará el buzón oficial y sustituirá `consultas@example.invalid` antes de habilitar envíos reales. El mismo buzón se usará para consultas de privacidad y ejercicio de derechos. El placeholder solo se usa en maquetas y nunca debe aceptar envíos reales.
- La persona autorizada por Alejandro Fernández Tellería preparará el aviso y el consentimiento en español e inglés. La persona responsable designada los aprobará y confirmará el contacto oficial, la base jurídica, los derechos, los destinatarios/proveedores y las transferencias aplicables antes de publicarlos. No se inventarán textos legales.
- La política provisional aprobada es la revisión diaria y el borrado manual definitivo del hilo completo a los 90 días desde la última interacción sustantiva, con una excepción limitada de copias de respaldo cifradas de Google de hasta 6 meses. El aviso deberá explicar esta diferencia y las retenciones de Cloudflare Email Routing (31 días de metadatos) y Resend (30 días), y recibir aprobación responsable antes de habilitar envíos reales.
