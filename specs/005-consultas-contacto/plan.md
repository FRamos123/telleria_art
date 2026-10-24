# Plan 005 — Consultas de contacto
Estado: aprobado (actualización de base jurídica aprobada por la persona usuaria)

## Alcance y enfoque

Mantener las páginas y el contenido del portfolio informativo como Astro estático. Añadir las páginas de contacto bilingües y una Pages Function para validar y enviar consultas generales/artísticas/institucionales. El formulario no es un canal para ventas, no crea pedidos y no guarda una base de datos de consultas.

La definición aprobada de RF-5 toma la última versión desplegada como fuente de verdad; no requiere frescura instantánea respecto de Sanity. Para RF-11 se aprobó un procedimiento manual en Gmail (revisión diaria y borrado definitivo del hilo a los 90 días desde su última interacción sustantiva), con una excepción limitada aprobada para respaldos cifrados de Google de hasta 6 meses. Cloudflare Email Routing reenviará el alias del dominio a esa cuenta; sus eventos de metadatos se retienen 31 días. Resend retiene sus datos 30 días. El aviso debe describir estas diferencias antes de habilitar envíos reales.

## Archivos que se crean o modifican

| Archivo | Cambio y responsabilidad | RF |
|---|---|---|
| `design/tokens.md` | Actualizar el patrón compuesto para aviso informativo y derecho de oposición, sin casilla de consentimiento obligatoria; campos, errores, antispam y confirmación usan tokens existentes, sin cambiar `@theme`. | RF-1–RF-10, RF-12, RNF-2, RNF-6 |
| `web/src/pages/contacto.astro` | Página estática ES; metadatos localizados, obras publicadas en ES y formulario general en el layout compartido. | RF-1, RF-2, RF-5, RF-9, RF-12; RNF-1, RNF-3, RNF-4 |
| `web/src/pages/en/contact.astro` | Equivalente EN; enlaza mediante `hreflang` solo con la versión ES existente. | RF-1, RF-2, RF-5, RF-9, RF-12; RNF-1, RNF-3, RNF-4 |
| `web/src/components/ContactForm.astro` | Campos etiquetados, aviso informativo y acceso a derechos, errores accesibles, Turnstile y mejora mínima de cliente. No contiene casilla de consentimiento obligatoria; solo permite consultas generales, no cotizaciones, compras ni reservas. El aviso final requiere revisión responsable. | RF-1–RF-4, RF-6–RF-10, RF-12; RNF-1, RNF-2, RNF-5 |
| `web/src/components/ArtworkContent.astro` | Añadir una acción localizada de consulta general que abra el contacto con el ID de esa obra; no enmarca el enlace como compra ni consulta de precio. Es un cambio en la composición de una ficha existente; cambio de layout aprobado por la persona usuaria. | RF-5, RF-12 |
| `web/src/components/SiteFooter.astro` | Añadir un enlace localizado a contacto para que coleccionistas e instituciones puedan encontrar el formulario desde el portfolio; cambio de layout aprobado por la persona usuaria. | RF-1 |
| `web/src/i18n/es.ts`, `web/src/i18n/en.ts` | Localizar etiquetas, ayuda, errores, estados, aviso de privacidad basado en interés legítimo y derecho de oposición. Retirar mensajes de consentimiento obligatorio. El aviso final necesita la evaluación y aprobación responsable. | RF-1–RF-4, RF-6–RF-10, RF-12; RNF-1, RNF-3 |
| `web/src/i18n/messages.test.ts` | Verificar paridad ES/EN y que todas las nuevas etiquetas no estén vacías. | RF-1; RNF-1 |
| `web/src/domain/contact-inquiry.ts` | Modelo ligero de entrada y validación pura: normalización, campos requeridos/opcionales, máximos, formato de email y regla internacional aprobada para teléfono. No incluye persistencia, Turnstile ni correo. | RF-2–RF-4 |
| `web/src/domain/contact-inquiry.test.ts` | Vitest para límites exactos, valores inválidos, campos opcionales y ausencia de mutación/pérdida de la entrada original durante la validación. | RF-2–RF-4 |
| `web/src/pages/contact-artworks.json.ts` | Generar en build una proyección pública de IDs de obras publicadas por idioma, reutilizando el catálogo ya mapeado. La Function puede leer el artefacto incluido en la última versión desplegada; no es una consulta a Sanity en runtime. | RF-5 |
| `web/src/infrastructure/contact-artworks.test.ts` | Probar la proyección localizada de IDs: conserva obras en los cuatro estados y omite una obra sin traducción en el idioma solicitado. | RF-5 |
| `web/functions/api/contact-artwork.ts` | Comprobar que el ID seleccionado está incluido en la lista del idioma correspondiente del artefacto desplegado. Es una comprobación pura de la proyección, sin lectura de Sanity ni estado mutable. | RF-5 |
| `web/functions/api/contact-artwork.test.ts` | Verificar la aceptación de IDs presentes en el artefacto desplegado y el rechazo de IDs ausentes o de otro idioma; la prueba representa la versión desplegada, no un estado más reciente de Sanity. | RF-5 |
| `web/functions/api/contact.ts` | `POST /api/contact`: validar campos, obra y Turnstile; no exigir consentimiento. Enviar por Resend y devolver resultados sin exponer secretos ni registrar datos personales. | RF-3–RF-12 |
| `web/functions/api/contact.test.ts` | Probar validación, obra, Turnstile, Resend y rechazo cerrado; eliminar los casos/contratos que dependían de `consentRequired`. | RF-3–RF-12 |
| `web/tsconfig.json` | Incluir `functions/**/*.ts` (relativo a este archivo) en el chequeo estricto. Usar tipos estructurales mínimos para el contexto de Pages Functions; no añadir tipos de plataforma si no son necesarios. | RF-5–RF-11 |
| `web/vitest.config.ts` | Incluir las pruebas de Pages Functions en Vitest, además de las pruebas bajo `src/`. | RF-5–RF-11 |
| `web/src/infrastructure/sitemap.ts` | Añadir las dos rutas públicas de contacto y su pareja de idioma al sitemap. | RNF-3 |
| `web/src/infrastructure/sitemap.test.ts` | Verificar URLs de contacto, `hreflang` recíproco y ausencia de referencias a rutas inexistentes. | RNF-3 |
| `web/src/i18n/build-output.test.ts` | Verificar HTML estático ES/EN, metadatos, aviso presente sin JavaScript, ausencia de casilla obligatoria de consentimiento y que el borrador legal no habilite envíos reales. | RF-1, RF-9, RF-10; RNF-1, RNF-3 |
| `web/src/components/catalog-components.test.ts` | Verificar el enlace contextual de consulta general y que fichas/contacto no introduzcan CTA de compra, cotización o checkout. | RF-5, RF-12; Fuera de alcance |

**Reutilización sin cambios:** `BaseLayout.astro` ya proporciona `lang`, canonical y alternates; `loadCatalogContent()` y los mappers actuales ya entregan obras publicadas con traducciones por idioma; `Availability` ya define los cuatro estados. No se requiere un nuevo mapper Sanity ni cambios a queries, esquemas, tipos públicos de contenido o `global.css`. Tampoco se prevé una dependencia nueva.

**Configuración fuera del repositorio:** el build de Cloudflare Pages necesita `PUBLIC_TURNSTILE_SITE_KEY`; las Functions necesitan `TURNSTILE_SECRET_KEY`, `TURNSTILE_HOSTNAMES` (allowlist separada por comas, por entorno), `RESEND_API_KEY`, `CONTACT_RECIPIENT` (alias oficial) y `CONTACT_FROM` (remitente verificado). La sitekey se expone al cliente; solo `TURNSTILE_SECRET_KEY` y `RESEND_API_KEY` son credenciales secretas. El resto se guarda como configuración de Pages, nunca en Git ni en el chat. `TURNSTILE_HOSTNAMES` contendrá hostnames exactos servidos por el entorno; Preview compartido y Producción no incluirán `localhost` ni `127.0.0.1`. En una prueba local, ambos pueden usarse solo en la allowlist local. En Cloudflare DNS se configurará Email Routing para reenviar el alias del dominio a la cuenta Gmail dedicada; las respuestas saldrán desde Gmail. Los registros MX/SPF/DKIM deberán coordinarse con Resend al disponer del dominio. La raíz del proyecto Pages debe ser `web/`, con `dist` como salida estática y `web/functions/` en la raíz del proyecto desplegado.

## Modelo de dominio y mapeo

- `ContactInquiry` es una entrada efímera: nombre, email, mensaje, locale y, si existen, institución, teléfono e ID de obra. No contiene una casilla de consentimiento; la base del tratamiento para responder es el interés legítimo documentado.
- La validación de dominio devuelve errores por campo, no textos de interfaz. La capa i18n traduce esos códigos a mensajes ES/EN.
- No se persiste una entidad de consulta ni se introduce un agregado, repositorio genérico o CQRS. La consulta se envía al buzón aprobado.
- **No aplica un mapper Sanity nuevo.** Las páginas reutilizan `MappedArtwork.translations[locale]`; la selección muestra obras publicadas en el idioma solicitado y no filtra por disponibilidad.
- La proyección JSON de IDs usa el catálogo del build. No incluye borradores ni títulos sin traducción en ese idioma. La Function valida la referencia recibida contra el artefacto disponible en la última versión desplegada, no confía en el valor enviado por el navegador. Cambios posteriores en Sanity no afectan la comprobación hasta el siguiente despliegue.

## Algoritmo en pseudocódigo

**Construcción de las páginas y de la selección**

1. Durante el build, cargar el catálogo publicado mediante el flujo actual de Sanity.
2. Para cada idioma, proyectar únicamente obras con traducción publicada en ese idioma; conservar todos los estados de `Availability`.
3. Renderizar las opciones y el formulario en HTML estático. Desde una ficha de obra, el enlace de consulta añade su ID como parámetro no sensible.
4. Al abrir el formulario con ese parámetro, la mejora de cliente selecciona la obra solo si aparece en las opciones localizadas; de lo contrario, deja la selección vacía.

**Recepción y envío de una consulta**

1. Aceptar solo `POST` al endpoint de contacto. Si el destinatario sigue siendo `consultas@example.invalid`, fallar de forma cerrada y no intentar enviar.
2. Normalizar espacios externos y validar obligatorios, longitudes, email y teléfono en el servidor. Ante errores, devolver códigos localizables; el navegador conserva todos los campos y permite corregir. No exigir consentimiento como condición de envío; el contenido del texto libre no se interpreta como oferta, pedido o aceptación de compra.
3. Si hay una obra asociada, leer el índice de obras del artefacto estático incluido en la última versión desplegada. Si el ID no está en la lista de ese idioma, no revelar título/datos, conservar el resto y pedir quitarlo o elegir otra obra. No consultar Sanity para detectar cambios posteriores al despliegue.
4. Rechazar tokens ausentes, vacíos o mayores de 2.048 caracteres, o una allowlist de hostnames ausente. Verificar Turnstile en el servidor con timeout de 10 segundos y aceptar solo `success === true`, acción exacta `contact` y hostname exacto incluido en la allowlist del entorno. Ante token inválido, caducado o reutilizado, acción/hostname ausente o distinto, fallo o timeout de Siteverify, rechazar antes de Resend; conservar los campos y permitir obtener un token nuevo.
5. Enviar la consulta a Resend usando secretos del entorno. No registrar el mensaje, email ni teléfono en logs.
6. Mostrar éxito y limpiar campos únicamente si Resend confirma que aceptó el mensaje para entrega. En cualquier otro resultado, no mostrar éxito y conservar los campos.

## Construcción de la interfaz y tokens

- Usar el layout compartido, con una sección de una columna en móvil y distribución responsive en tablet/escritorio según los cortes existentes: `<768px`, `768–1279px` y `≥1280px`.
- Superficie base `surface-container-lowest`; bloque del formulario `surface-low` o `surface-container`; controles sobre superficie oscura opaca. Texto principal `on-surface`, instrucciones `on-surface-variant`, etiquetas con `label-technical` y cuerpo con `body-md`.
- Título con los estilos existentes `headline-lg-mobile`/`headline-lg`; botón principal con el patrón de 44 px `primary`/`on-primary`; espaciado `margin-mobile`, `gutter-mobile`, `space-md` y `space-lg`; radio `0`.
- Foco visible con el patrón existente de outline `primary`. Los errores tendrán texto explícito y asociado al control; el color/borde no será el único indicador. No usar opacidad ni valores arbitrarios. Ningún valor de `@theme` cambia.
- El aviso, el derecho de oposición y la confirmación deben ser legibles con teclado y lector de pantalla; el patrón no requiere casilla de consentimiento para el interés legítimo elegido. El borrador legal puede mostrarse con marca de pendiente en builds locales de revisión y el envío permanecerá deshabilitado; no se desplegará esa versión. El texto definitivo solo se incorporará tras aprobarlo y documentar la evaluación de interés legítimo.
- No hay una captura de referencia específica del formulario. Antes de código se propone documentar este patrón compuesto en `design/tokens.md` usando exclusivamente tokens existentes.

## Decisiones técnicas justificadas

| Decisión propuesta | Justificación | Alternativa descartada o límite |
|---|---|---|
| Mantener Astro en salida estática y añadir Pages Functions en la raíz `web/functions/`. | Conserva la generación estática, SEO y HTML existente; Cloudflare Pages admite Functions junto con assets estáticos. | Migrar todo Astro a SSR/adaptador Cloudflare: amplía el runtime de todo el sitio sin que las páginas de contenido lo necesiten. |
| Llamar a las APIs de Turnstile y Resend con `fetch` desde la Function. | Ambos servicios ya están declarados; no hace falta un SDK ni una dependencia adicional. Sus secretos permanecen en Cloudflare Pages. | Instalar SDKs o enviar directamente desde el navegador: agrega dependencias y expondría credenciales si se hiciera en cliente. |
| Usar una mejora mínima de cliente para enviar y conservar el DOM ante error. | Permite errores localizados, reintentos y preselección desde una ficha sin poner datos personales en la URL. La persona usuaria aprobó expresamente este alcance mínimo. | Duplicar todo el HTML del formulario en respuestas de la Function sería difícil de mantener con las dos traducciones; redirigir con el mensaje en query string expondría datos personales. |
| Construir el selector y una proyección de IDs desde contenido publicado durante el build. | Respeta el límite de consultas a Sanity en build y evita una API de catálogo para el cliente. `ASSETS` de Pages Functions permite leer assets estáticos. | Consultar Sanity desde la Function en cada envío contraviene la decisión del proyecto de consultar Sanity solo en build. Una fuente mutable en Cloudflare requeriría un servicio/flujo adicional y aprobación. |
| No guardar solicitudes en una base de datos de la aplicación y aplicar una revisión manual del buzón dedicado. | Evita almacenamiento adicional; el responsable revisa a diario y elimina el hilo completo al cumplirse el plazo provisional desde la última interacción sustantiva. | Añadir almacenamiento y borrado programado introduciría un servicio nuevo y datos persistentes. La rutina manual no elimina copias recuperables que controle el proveedor; ese comportamiento debe confirmarse antes de envíos reales. |
| Mantener Resend como transporte y definir la aceptación por respuesta satisfactoria de su API. | Coincide con la spec: confirma aceptación para entrega, no entrega final ni lectura. | Afirmar recepción en bandeja o prometer una respuesta sería una garantía que el endpoint de envío no puede demostrar. |
| Reutilizar tokens y patrones existentes; documentar un patrón de formulario antes del código. | Evita nuevos colores, tipografías, espaciados o radios. | Añadir tokens o copiar Stitch sin adaptación contradice la guía del proyecto. |
| Usar Cloudflare Email Routing solo para reenviar el alias del dominio a Gmail. | Servicio autorizado expresamente por la persona usuaria; evita desplegar una bandeja propia. Cloudflare no almacena el contenido según su documentación y los eventos tienen retención de 31 días. | Email Routing no ofrece una bandeja ni permite responder desde el dominio; las respuestas salen desde Gmail. No se usará Cloudflare Email Sending ni un Worker para este flujo. |
| Mantener las consultas actuales como canal no comercial. | Alinea el portfolio con la decisión vigente de aplazar la tienda; el correo permite responder consultas generales sin crear una operación comercial en el sistema. | Negociar o cerrar ventas manualmente por email seguiría siendo comercio y queda fuera de esta spec; requeriría reactivar el alcance comercial y aprobar otra spec. |

## Cobertura RF

| RF | Parte del plan | Estado de cobertura |
|---|---|---|
| RF-1 | Rutas ES/EN, diccionarios, layout, tests de mensajes y metadatos. | Alcanzable. |
| RF-2 | `ContactForm` y modelo de entrada; obligatorios y opcionales. | Alcanzable. |
| RF-3 | Validador puro y repetición de validación en la Function; pruebas de límites. | Alcanzable. |
| RF-4 | Respuestas de error por campo y mejora mínima de cliente que conserva inputs. | Alcanzable; JavaScript mínimo aprobado expresamente. |
| RF-5 | Opciones del catálogo localizado, enlace contextual y validación del ID contra el asset de la última versión desplegada. | Alcanzable con la definición aprobada: cambios posteriores en Sanity surten efecto tras el siguiente despliegue. |
| RF-6 | Widget declara acción `contact`; verificación server-side exige éxito, acción y hostname permitido, tamaño del token limitado y timeout; rechazo permite nuevo token y conserva datos. | Alcanzable con claves y allowlist de hostnames configuradas por entorno. |
| RF-7 | Errores de validación, Turnstile, API o Resend sin confirmar éxito; conservar datos. | Alcanzable con la mejora mínima de cliente aprobada. |
| RF-8 | Confirmar/limpiar únicamente tras validar, informar y recibir aceptación de Resend; no se requiere casilla de consentimiento. | Alcanzable; no prueba entrega final. |
| RF-9 | Aviso localizado basado en interés legítimo documentado, derecho de oposición, datos usados solo para responder consultas generales. | Alcanzable cuando la evaluación de interés legítimo, proveedores/transferencias y texto estén confirmados y aprobados. |
| RF-10 | Configuración de destinatario y rechazo cerrado mientras siga el placeholder. | Alcanzable. |
| RF-11 | Revisión diaria y borrado manual definitivo del hilo Gmail a los 90 días desde la última interacción sustantiva; cada respuesta reinicia el plazo. | Alcanzable con la excepción limitada aprobada de respaldos cifrados de Google de hasta 6 meses. Cloudflare Routing conserva eventos de metadatos hasta 31 días y Resend conserva datos hasta 30 días. El aviso debe detallar estos plazos antes de los envíos reales. |
| RF-12 | Portfolio/contacto general e institucional; sin canal de venta, precios, cotización, reserva ni pedido; disponibilidad como dato informativo. | Alcanzable con los componentes y las etiquetas de catálogo actuales; verificación estructural y Chrome en T17. |

## Viabilidad de las garantías y bloqueos

1. **RF-5 — fuente de verdad temporal aprobada.** La persona usuaria aprobó que “publicada” signifique incluida en la última versión desplegada. La proyección estática permite rechazar IDs ausentes de esa versión. No detecta cambios posteriores en Sanity hasta el siguiente despliegue; ese límite queda explícito en RF-5 y no se añade otra fuente de estado ni servicio.

2. **RF-11 — borrado manual y retenciones de proveedores aprobadas.** La persona usuaria aprobó usar una cuenta Gmail dedicada, con Cloudflare Email Routing para el alias del dominio, revisión diaria, reinicio manual del plazo tras cada respuesta sustantiva y borrado permanente del hilo completo a los 90 días. La política general publicada por Google informa que su proceso de borrado suele tardar alrededor de 2 meses y que los datos pueden permanecer en respaldos cifrados hasta 6 meses; no es un plazo contractual específico de Gmail, y esta retención limitada fue aceptada expresamente. Cloudflare informa que no almacena contenido, mientras que sus eventos de encaminamiento pueden incluir metadatos y se conservan hasta 31 días. Resend conserva datos de email durante 30 días. El aviso debe identificar esos proveedores y períodos, y recibir aprobación responsable antes de envíos reales.

3. **Envío real por Resend.** Resend requiere un dominio propio verificado para enviar a destinatarios externos; `resend.dev` es solo para pruebas limitadas a la dirección del titular de la cuenta. El dominio actual `telleria-art.pages.dev` no basta como dominio de remitente verificado. Se necesita un dominio y remitente autorizados, además del buzón receptor real, antes de probar el envío real exigido por AGENTS.md.

4. **Pages Functions y preview.** La estructura prevista es viable si el proyecto Cloudflare Pages tiene raíz `web/`: Cloudflare exige que `functions/` esté en la raíz del proyecto Pages. `astro preview` no prueba por sí solo esas Functions; la integración se prueba con `wrangler pages dev` o, preferiblemente para el envío real, en un preview de Pages. Wrangler no está actualmente en `web/package.json`; no añadirlo como dependencia sin preguntar.

Fuentes oficiales consultadas:

- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/) · [enrutamiento y estructura](https://developers.cloudflare.com/pages/functions/get-started/) · [assets y secretos](https://developers.cloudflare.com/pages/functions/bindings/) · [desarrollo local](https://developers.cloudflare.com/pages/functions/local-development/).
- [Validación server-side de Turnstile](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/): el token debe verificarse en servidor y caduca a los cinco minutos.
- [API de envío de Resend](https://resend.com/docs/api-reference/emails/send-email) · [requisito de dominio verificado](https://resend.com/docs/dashboard/domains/introduction) · [retención de datos de email](https://resend.com/docs/knowledge-base/account-quotas-and-limits).
- [RGPD, artículo 5.1.e y considerando 39](https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=es): el plazo debe responder a la finalidad y fijarlo/revisarlo corresponde a la persona responsable; 90 días es una política provisional del proyecto, no un plazo legal universal.
- [Cloudflare Email Routing](https://developers.cloudflare.com/email-service/reference/postmaster/) · [retención de eventos de encaminamiento](https://developers.cloudflare.com/email-service/observability/metrics-analytics/) (31 días).
- [Gmail: eliminar mensajes](https://support.google.com/mail/answer/7401?hl=en) · [retención general de datos de Google](https://policies.google.com/technologies/retention?hl=en-US) (proceso de borrado y respaldos cifrados de hasta 6 meses).

## Aprobaciones previas de AGENTS.md y límites vigentes

- **JavaScript en cliente:** aprobada expresamente la mejora mínima descrita en este plan. No ampliar ese alcance.
- **Layouts existentes:** aprobados expresamente los enlaces de contacto en la ficha de obra y el pie. No ampliar esos cambios.
- **Patrón nuevo de pantalla:** aprobada su documentación previa en `design/tokens.md`, usando tokens existentes. No se propone cambiar `@theme`; si hiciera falta un token, detenerse y pedir aprobación.
- **Servicios externos:** Cloudflare Email Routing (solo reenvío) y la cuenta Gmail dedicada autorizados expresamente por la persona usuaria; no se autoriza Cloudflare Email Sending ni Workers para correo.
- **Borrador legal y publicación:** autorizado mostrar el borrador ES/EN marcado como pendiente en builds locales de revisión. No desplegar ni publicar las rutas de contacto hasta que el aviso, la evaluación de interés legítimo y los proveedores/transferencias hayan sido revisados y aprobados; no habilitar envíos reales antes de configurar destinatario/remitente y secretos.
- **Servicio o almacenamiento nuevo:** no se añade. Si se elige Cloudflare D1/KV u otra fuente para frescura de obras o retención, pedir aprobación explícita antes; también debe revisarse la consistencia temporal del mecanismo.
- **División de entrega:** la persona usuaria rechazó dividir la spec y aprobó mantener una única entrega de 20 tareas. No se crean specs adicionales.
- **Dependencias:** el plan no añade paquetes. Si la verificación local requiere instalar Wrangler, tipos de Cloudflare o un SDK, preguntar antes.
- **Dominio/remitente:** la integración Resend está prevista por AGENTS.md, pero un dominio propio verificado y la dirección `from` son decisiones/configuración del responsable; no usar el dominio compartido `pages.dev` ni inventar una identidad remitente.
- **Sanity:** no se cambian schemas, tipos públicos ni queries de producción. Cualquier propuesta de lectura de Sanity en runtime requiere resolver primero su conflicto con la decisión build-only.

## Estrategia de verificación

- **Vitest — dominio:** casos límite de nombres/email/mensaje, límites exactos y excedidos, espacios externos y teléfono; verificar que la validación no modifica ni pierde valores. El contrato ya no incluye consentimiento como campo obligatorio.
- **Vitest — integración de Functions:** verificar que un ID presente en el artefacto de la última versión desplegada se acepta aunque Sanity haya cambiado después, y que un ID ausente en ese artefacto se rechaza; simular también Turnstile (token dentro/fuera de límite, allowlist, acción y hostname correctos/incorrectos, fallo y timeout), aceptación/fallo de Resend, placeholder, secretos y métodos. Nunca enviar datos reales en estas pruebas.
- **RF-12 — alcance no comercial:** revisar la salida ES/EN y los componentes de ficha/contacto para confirmar que presentan consultas generales, no contienen precios ni CTA de compra/reserva y no prometen ventas. `Availability` se comprueba como dato catalográfico informativo; el texto libre no se analiza como pedido.
- **Vitest — publicación e i18n:** verificar la proyección ES/EN del catálogo publicado, que no haya fallback de traducción, que se incluyan los cuatro estados, paridad de mensajes y sitemap con alternates correctos. No se añade ni modifica un mapper Sanity existente.
- **`pnpm --dir web verify`:** lint, chequeo TypeScript incluyendo Functions, build estático y Vitest.
- **Chrome DevTools en preview de Pages:** ES y EN a 375, 768 y 1280 px; navegación por teclado; foco y errores; aviso de privacidad y derecho de oposición; preservación tras rechazo Turnstile y fallo de envío; obra contextual y cada estado; confirmación solo en aceptación; sin overflow; contacto solo general/institucional y ausencia de CTA comercial. Comprobar el árbol de accesibilidad, canonical/`hreflang`, HTML generado y sitemap.
- **Prueba real requerida por AGENTS.md:** cuando existan el buzón real, el dominio remitente verificado y secretos de preview, enviar con Turnstile activo a una bandeja controlada. Verificar la aceptación y la recepción real sin exponer secretos. El placeholder `.invalid` solo puede probar el rechazo seguro.
- **Lighthouse manual:** página de contacto móvil: rendimiento ≥90, accesibilidad ≥95 y SEO 100. La carga del widget Turnstile puede afectar rendimiento; medir y ajustar su carga sin eliminar la protección.
- **Retención:** comprobar la rutina manual de revisión diaria y eliminación del hilo completo, así como la política/configuración del proveedor respecto de elementos recuperables y copias posteriores al borrado. Confirmar además con la persona responsable que el aviso describe correctamente la retención de Resend (30 días) y del buzón antes de dar RF-11 por verificado.
