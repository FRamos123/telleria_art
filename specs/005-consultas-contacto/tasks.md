# Tareas 005 — Consultas de contacto
Estado: aprobado (actualización de base jurídica art. 6.1.f)

## Tareas

- [x] **T1. Cerrar la vigencia de la obra asociada (bloqueo RF-5).** RF-5
  - Decisión aprobada: “publicada” significa incluida en la última versión desplegada; los cambios posteriores en Sanity surten efecto en el siguiente despliegue.
  - Hecho cuando: spec, plan y pruebas verificables definen esa fuente de verdad; la comprobación rechaza IDs ausentes de la versión desplegada y no consulta un estado posterior de Sanity.

- [x] **T2. Cerrar la política aplicable a los 90 días (bloqueo RF-11).** RF-11
  - Alternativa aprobada: buzón dedicado con revisión diaria y borrado manual del hilo completo a los 90 días desde la última interacción sustantiva; cada nueva respuesta reinicia el plazo.
  - Proveedores y retenciones documentados: Google Gmail (eliminación desde la cuenta; política general de Google: borrado de sistemas suele tardar 2 meses y datos pueden permanecer en respaldos cifrados hasta 6 meses; excepción limitada aprobada, no es plazo contractual específico de Gmail); Cloudflare Email Routing (metadatos de eventos hasta 31 días, sin almacenamiento de contenido según su documentación); Resend (datos de email hasta 30 días).
  - Hecho cuando: `spec.md` y `plan.md` documentan el procedimiento manual, la retención publicada por cada proveedor y la excepción aprobada; el aviso de privacidad deberá reflejarlo y recibir revisión responsable antes de habilitar envíos reales.

- [x] **T3. Obtener las aprobaciones previas de AGENTS.md.** RF-4, RF-5; RNF-2, RNF-6
  - Hecho cuando: queda registrada la aprobación o el ajuste de alcance para el JavaScript mínimo de cliente, los cambios de layout en ficha/pie y el patrón nuevo de formulario; no se implementa ningún punto rechazado.
  - Aprobaciones expresas recibidas: JavaScript mínimo sí; enlaces en ficha y pie sí; documentar patrón con tokens existentes sí; Cloudflare Email Routing solo como reenvío entrante a Gmail sí. Sin cambios a `@theme`, Workers ni Cloudflare Email Sending.

- [x] **T4. Actualizar el patrón de formulario según el interés legítimo.** RF-1, RF-2, RF-4, RF-9; RNF-2, RNF-6
  - Hecho cuando: `design/tokens.md` describe campos, errores, aviso informativo/derecho de oposición, antispam y confirmación usando solo tokens existentes, sin casilla obligatoria de consentimiento ni cambios a `@theme`.
  - Verificado: patrón documental actualizado en `design/tokens.md`; no se modificaron tokens `@theme`. `pnpm --dir web verify` pasa (405 tests).

- [x] **T5. Crear el modelo de entrada y validación pura con Vitest.** RF-2, RF-3, RF-4
  - Hecho cuando: los tests cubren obligatorios, opcionales, espacios externos, email, máximos, teléfono internacional y que validar no muta ni pierde los valores originales.
  - Contrato implementado: `validateContactInquiry(input)` devuelve `inquiry` normalizada solo si es válida y errores neutrales por campo (`required`, `tooLong`, `invalidFormat`); no muta la entrada. Recorta espacios externos y omite opcionales vacíos. No comprueba DNS ni existencia del email/teléfono. El teléfono limita caracteres a dígitos, `+` inicial, espacios, guiones y paréntesis balanceados, además de 7–15 dígitos y 30 caracteres.

- [x] **T6. Actualizar mensajes ES/EN para interés legítimo y derecho de oposición.** RF-1, RF-2, RF-3, RF-4, RF-6, RF-7, RF-8, RF-9; RNF-1
  - Hecho cuando: etiquetas, instrucciones, aviso, oposición, errores y estados tienen traducción no vacía en ambos idiomas y Vitest verifica paridad; se retiran los mensajes de consentimiento obligatorio sin inventar el contenido legal pendiente.
  - Implementado: mensajes ES/EN actualizados a consultas generales, interés legítimo 6.1.f y derecho de oposición; alias confirmado incorporado al borrador local; transferencias/retenciones y evaluación continúan claramente pendientes. Se retiraron las claves i18n de consentimiento obligatorio.
  - `pnpm --dir web verify` pasa (lint, tipos, build estático de 15 páginas y 406 tests en 26 archivos). El borrador sigue sin aprobar para producción.

- [x] **T7. Actualizar el marcado accesible del formulario sin consentimiento obligatorio.** RF-1, RF-2, RF-9, RF-12; RNF-1–RNF-4
  - Hecho cuando: existen las rutas ES/EN con canonical, descripción y alternates correctos; el HTML incluye campos, etiquetas, aviso informativo, acceso a derechos y estados accesibles, sin casilla de consentimiento obligatoria ni dependencia de JavaScript para mostrar el contenido; queda definido el contrato actualizado de respuestas.
  - Aprobación recibida: se permite mostrar el borrador del aviso ES/EN marcado como pendiente en builds locales para revisión. No desplegar las rutas de contacto hasta cerrar T15 y mantener envíos reales cerrados hasta completar la configuración de T14.
  - Contrato propuesto: `200 { ok: true, code: 'accepted' }`; errores con `{ ok: false, code: 'validation', errors }`, `invalidRequest`, `artworkUnavailable`, `spamRejected` o `deliveryUnavailable`. Se elimina `consentRequired`; `errors` usa códigos por campo sin textos ni datos personales.
  - QA Chrome DevTools en `astro preview`: ES/EN a 375×812 y 1280×900, sin overflow; aviso y derechos aparecen en el árbol accesible; Tab recorre skip link, idiomas, campos y pie con foco visible de 2 px. No hay casilla de consentimiento; el botón permanece deshabilitado por el aviso en borrador. Sin errores de consola.
  - Progreso adelantado para dependencia T6, ya cerrada: se retiró el bloque HTML de consentimiento y su atributo; el build comprueba que no se renderiza `name="consent"`.
  - T7 y T11 están cerradas; queda pendiente T12, que retirará la validación de consentimiento del servidor. Mantener envíos cerrados hasta verificar T12 y cerrar T15.

- [x] **T8. Añadir la selección y preselección de obra localizada.** RF-5
  - Hecho cuando: la lista contiene solo obras incluidas en la última versión desplegada con traducción del idioma activo, incluye los cuatro estados de disponibilidad, el enlace desde una ficha preselecciona únicamente un ID válido, el pie ofrece el enlace localizado a contacto y el artefacto estático de IDs queda listo para la comprobación de la Function.
  - Contrato implementado: `contact-artworks.json` expone únicamente `{ es: string[], en: string[] }`; el selector usa título localizado del catálogo de build y no filtra por `Availability`. El enlace de ficha usa `?artwork=<id>`; el cliente solo preselecciona si el ID existe en las opciones del idioma.
  - Verificado con datos `va9sgl77/development`: la obra `fed01a6c-75ff-4c09-a158-f7c01b770b62` se preselecciona en ES/EN, y un ID ausente queda sin selección.

- [x] **T9. Añadir contacto al sitemap y probar sus alternates.** RF-1; RNF-3
  - Hecho cuando: el sitemap incluye las dos rutas de contacto y Vitest confirma `hreflang` solo entre versiones existentes.
  - Las rutas ES/EN se emiten con alternates recíprocos; verificado en pruebas unitarias y HTML/XML del build.

- [x] **T10. Revisar la presentación estática ES/EN en Chrome DevTools.** RF-1, RF-2, RF-5; RNF-1–RNF-3, RNF-6
  - Hecho cuando: a 375, 768 y 1280 px no hay overflow; se comprueban enlace, selector de obra, etiquetas, foco visible y navegación por teclado en ambos idiomas.
  - QA completado: ES/EN a 375, 768 y 1280 px, sin overflow; enlaces a contacto, selector y preselección revisados. La navegación con Tab alcanza el skip link, selector de idioma, campos, consentimiento y footer, con foco visible tokenizado.

- [x] **T11. Actualizar la interacción de cliente al contrato sin consentimiento obligatorio.** RF-4, RF-6, RF-7, RF-8, RF-9
  - Hecho cuando: errores y reintentos conservan campos/selección, permiten obtener un token Turnstile nuevo, anuncian los estados accesiblemente y solo limpian tras aceptación; no se valida ni envía el campo `consent` y no se maneja `consentRequired`.
  - Implementado: cliente omite el campo de consentimiento y sus ramas de error. Mantiene valores/obra ante errores y reinicia Turnstile tras rechazo/posible consumo; solo `accepted` limpia. El botón sigue deshabilitado mientras el aviso esté en borrador o falte sitekey.
  - QA Chrome local con `fetch` y token Turnstile simulados: validación email preserva valor y evita fetch; rechazo spam y fallo delivery preservan campos y reinician token; callback de token nuevo habilita reintento; aceptación limpia solo después del estado aceptado. El cuerpo no incluye `consent`.
  - `pnpm --dir web verify` pasó tras T11/T12 (lint, tipos, build de 15 páginas y 407 tests en 26 archivos). No se probó Resend real ni se desplegó.
- [x] **T12. Actualizar la recepción server-side al tratamiento sin consentimiento obligatorio.** RF-3, RF-4, RF-6, RF-7, RF-9, RF-10, RF-12
  - Hecho cuando: la Function rechaza métodos/configuración inválidos, revalida campos, consulta el artefacto de la última versión desplegada y no requiere ni recibe el campo `consent`. Turnstile conserva las comprobaciones aprobadas (`success`, acción `contact`, hostname, límite del token y timeout); el código no registra datos personales. Vitest cubre éxito y rechazos.
  - Configuración runtime: `CONTACT_RECIPIENT`, `TURNSTILE_SECRET_KEY`, `TURNSTILE_HOSTNAMES` y binding `ASSETS`; el placeholder `.invalid` y valores ausentes siguen fallando cerrados.
  - Verificado: pruebas simuladas de validación, obra, Siteverify, Resend y fallo/aceptación sin el campo de consentimiento; `pnpm --dir web verify` pasa con 407 tests en 26 archivos. No se probó Resend real ni se desplegó.
  - Enmienda Spin aprobada e implementada; la prueba real de token fresco/replay queda para T18 y no se hará ni desplegará mientras T15 siga pendiente.

- [x] **T13. Integrar el envío por Resend y el resultado de aceptación.** RF-7, RF-8, RF-10
  - Hecho cuando: Resend se llama solo tras validación y antispam correctos; solo una aceptación para entrega devuelve éxito; errores, timeout y placeholder no aceptan el envío ni exponen secretos; Vitest cubre esos resultados.
  - Implementación: `POST /emails` con `RESEND_API_KEY`, `CONTACT_FROM` y destinatario configurados fuera de Git; `reply_to` usa el email validado. Solo un 2xx con ID de Resend devuelve `accepted`; fallos, timeout, respuestas inválidas y placeholders devuelven `deliveryUnavailable` sin detalles ni secretos.
  - Vitest simula validación→Turnstile→Resend, rechazo, falta de credenciales, fallo HTTP, timeout y respuesta 2xx sin ID. No se hizo envío real.

- [x] **T14. Configurar buzón real, remitente verificado y secretos de preview.** RF-6, RF-7, RF-10, RF-11
  - Hecho cuando: el alias del dominio reenvía al Gmail dedicado, las respuestas salen desde Gmail, el remitente usa un dominio verificado en Resend, los secretos están solo en la configuración de Pages y están configurados/registrados el procedimiento manual de 90 días y la excepción aprobada de respaldos de Gmail de hasta 6 meses.
  - Cerrada con confirmación de la persona usuaria: `consultas@artelleria.com` reenvía al Gmail dedicado y se comprobó responder desde esa cuenta; `envios.artelleria.com` aparece como Verified en Resend; variables y secretos están guardados en Pages en Preview y Production; la persona usuaria confirmó que aplicará la revisión diaria y el borrado manual a 90 días, con la excepción aprobada de respaldos hasta 6 meses. Widget Turnstile creado, secreto rotado y API key de Resend obtenida; widget permite `telleria-art.pages.dev`, `artelleria.com`, `localhost` y `127.0.0.1`. `TURNSTILE_HOSTNAMES=telleria-art.pages.dev` está configurado en ambos entornos. La comprobación/actualización al hostname exacto del Preview (que puede ser una URL con hash) se traslada a T17, cuando vuelva a desplegar.

- [x] **T15. Incorporar el aviso de privacidad aprobado en ambos idiomas y documentar el interés legítimo.** RF-9, RF-11; RNF-1, RNF-5
  - Hecho cuando: la persona responsable documenta una evaluación de interés legítimo para responder consultas voluntarias, el aviso ES/EN describe la base, el interés específico, la oposición, derechos, proveedores/transferencias y retención, y aprueba el texto final sin placeholders antes de cualquier despliegue o envío real.
  - Completada con confirmación de la responsable (2026-10-24): evaluación interna en `docs/legitimate-interest-assessment.md`; interés documentado para responder consultas voluntarias y proteger el formulario frente al abuso; incluye necesidad, expectativas, ponderación, salvaguardas, oposición y condiciones de reevaluación.
  - Aviso final ES/EN en i18n, sin placeholders ni estado de borrador. Se aclaran campos obligatorios/opcionales, interés específico y derecho de oposición, proveedores y transferencias, y retenciones del buzón, Google, Resend, Email Routing, Turnstile y Pages.
  - Se retiró el bloqueo de envío por aviso pendiente; el formulario continúa deshabilitado cuando falta la sitekey o el token Turnstile. No se desplegó este cambio ni se realizó envío real.

- [x] **T16. Ejecutar la verificación completa del paquete web.** RF-1–RF-12; RNF-1–RNF-6
  - Hecho cuando: una instalación limpia de `web` incluye de forma explícita los tipos Node requeridos, `pnpm --dir web verify` pasa (lint, tipos, build y tests) y el build contiene las páginas y el sitemap esperados.
  - Causa del build limpio: `web` no declaraba `@types/node` y `src/env.d.ts` tenía un shim parcial para `node:fs`, que ocultaba exports y firmas reales. Añadido `@types/node` 22.20.5 fijado, incluido `node` en `tsconfig` y retirado el shim. El lockfile pasa `pnpm install --frozen-lockfile`.
  - Verificado: `pnpm --dir web verify` pasa con lint, TypeScript, build estático de 15 páginas y 407 tests en 26 archivos. No se desplegó ni se probó Resend real.

- [x] **T17. Probar errores, alcance no comercial y reintentos en el preview de Pages.** RF-3–RF-7, RF-9, RF-12; RNF-1, RNF-2
  - Hecho cuando: el Preview funciona con `TURNSTILE_HOSTNAMES` igual al hostname exacto de la URL que lo sirve; Chrome DevTools confirma rechazo por validación, Turnstile fallido (incluidos acción/hostname) y fallo de correo; conserva datos; no requiere casilla de consentimiento; el aviso informa la base y el derecho de oposición; el contacto es solo general y sin CTAs de venta; no hay éxito prematuro.
  - Preview estable facilitado por la persona usuaria: `https://spec-005-consultas-contacto.telleria-art.pages.dev/`.
  - QA del Preview final: contacto ES y EN a 375×812, y EN a 1280×900; sin overflow horizontal. Aviso final sin placeholders/borrador, `lang`, títulos y alternates correctos; sin CTA comercial ni campo `consent`. Sitekey configurada y widget Turnstile renderizado; el botón permanece deshabilitado sin token.
  - Pruebas sintéticas seguras en Preview: POST inválido devuelve 400 `validation`; POST con datos sintéticos y token falso devuelve 403 `spamRejected`. Ambos se rechazan antes de Resend. Un fetch simulado de error de entrega en el cliente mostró el mensaje de fallo y conservó los campos; no se hizo envío real.
  - Confirmado por la persona usuaria: Turnstile sí completa en su navegador y `TURNSTILE_HOSTNAMES` de Preview coincide exactamente con `spec-005-consultas-contacto.telleria-art.pages.dev`. El harness de Chrome no obtuvo token por un fallo DNS a `brunhild.challenges.cloudflare.com` y una respuesta 401; se registra como limitación del navegador de QA, no como fallo reproducible por la responsable.
  - Los rechazos de acción/hostname están cubiertos por las pruebas de la Function; no se generaron tokens válidos alternativos en Preview. El fallo de entrega del cliente se simuló con `fetch` controlado y el fallo de Resend está cubierto por pruebas automatizadas. No hubo envío ni llamada a Resend desde el QA manual.

- [x] **T18. Probar un envío real en preview con Turnstile activo.** RF-6, RF-7, RF-8, RF-10
  - Hecho cuando: una consulta sintética con token fresco llega al buzón controlado, la interfaz confirma solo después de aceptación de Resend, repetir el mismo token se rechaza y el placeholder no puede enviar; no se exponen secretos. T17 completada y Preview operativo.
  - Intento desde Chrome automation (2026-10-24): el widget se mostró, pero el challenge agotó el tiempo por fallo DNS a `brunhild.challenges.cloudflare.com`; no se eludió ni se reintentó.
  - Envío manual confirmado por la persona usuaria (2026-10-24): completó Turnstile, Resend aceptó el mensaje, la interfaz limpió los campos y la persona confirma recepción en el buzón. El payload confirma destino al alias `consultas@artelleria.com`, remitente `consultas@envios.artelleria.com` y `reply_to` con el email del formulario.
  - Prueba segura de replay añadida a `contact.test.ts`: el mismo token sintético recibe primero aceptación mock de Siteverify y luego `success: false` con `timeout-or-duplicate`; la Function devuelve 403 `spamRejected` y solo hay una llamada a Resend. No se repitió el token real para evitar el riesgo de un correo duplicado. El placeholder también se comprueba en tests. Verificación completa: `pnpm --dir web verify` pasa con 408 tests en 26 archivos.

- [x] **T19. Verificar Lighthouse y SEO en la página de contacto.** RNF-3, RNF-4
  - Hecho cuando: Lighthouse móvil alcanza ≥90 rendimiento, ≥95 accesibilidad y 100 SEO; se comprueban metadatos, canonical, alternates e inclusión en sitemap en un despliegue indexable con el aviso aprobado.
  - Lighthouse móvil de producción ES (2026-10-24): rendimiento 100, accesibilidad 100 y SEO 100. EN: accesibilidad 100 y SEO 100.
  - Producción confirma el aviso final sin borrador/placeholders ni `X-Robots-Tag: noindex`. Verificado en ES/EN: títulos, descripciones y `lang` localizados; canonical y alternates recíprocos a `telleria-art.pages.dev`; ambas rutas aparecen en `sitemap.xml`.
  - Referencia: el Preview conserva correctamente `X-Robots-Tag: noindex`; por ello Lighthouse allí marcó SEO 66, mientras que la auditoría de producción indexable cumple 100.

- [x] **T20. Auditar la política efectiva de retención.** RF-11
  - Hecho cuando: se documenta la retención de Resend y del buzón receptor, incluida la regla para respuestas y última interacción sustantiva; cualquier límite no cubierto vuelve a la spec antes de cerrar RF-11.
  - Cerrada con confirmación de la responsable y documentación en `spec.md`, el aviso ES/EN y `docs/legitimate-interest-assessment.md`: revisión diaria del buzón; borrado manual del hilo completo, enviados, adjuntos y papelera a los 90 días de la última interacción sustantiva; excepción para obligación/reclamación y respaldos Google cifrados hasta 6 meses. Resend: 30 días activo, respaldos 7 días, eliminación hasta 90 días tras cierre. Email Routing: metadatos 31 días, sin contenido. Turnstile: sin plazo fijo publicado; Pages HTTP logs sin retención adicional habilitada. No quedan periodos desconocidos dentro del alcance acordado; revisar de nuevo si cambian servicio, cuenta, política o configuración.

## Alcance de entrega

La persona usuaria rechazó la división propuesta y aprobó mantener las 20 tareas en esta única entrega. No se crearán specs adicionales. El producto actual es portfolio informativo/contacto general; no hay ventas por consulta, checkout, pagos ni pedidos. Cualquier comercio futuro requerirá reabrir el alcance y aprobar su propia spec. RF-11 queda cubierta por el procedimiento manual aprobado y la excepción limitada de respaldos Google; el aviso legal aprobado y la configuración real siguen siendo requisitos previos a los envíos reales.
