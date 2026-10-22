# Tareas 005 — Consultas de contacto
Estado: aprobado

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

- [x] **T4. Documentar el patrón de formulario con tokens existentes.** RF-1, RF-2, RF-4, RF-9; RNF-2, RNF-6
  - Hecho cuando: `design/tokens.md` describe campos, errores, consentimiento, antispam y confirmación usando solo los tokens existentes, sin cambiar `@theme`.

- [x] **T5. Crear el modelo de entrada y validación pura con Vitest.** RF-2, RF-3, RF-4
  - Hecho cuando: los tests cubren obligatorios, opcionales, espacios externos, email, máximos, teléfono internacional y que validar no muta ni pierde los valores originales.
  - Contrato implementado: `validateContactInquiry(input)` devuelve `inquiry` normalizada solo si es válida y errores neutrales por campo (`required`, `tooLong`, `invalidFormat`); no muta la entrada. Recorta espacios externos y omite opcionales vacíos. No comprueba DNS ni existencia del email/teléfono. El teléfono limita caracteres a dígitos, `+` inicial, espacios, guiones y paréntesis balanceados, además de 7–15 dígitos y 30 caracteres.

- [x] **T6. Añadir mensajes de interfaz ES/EN y pruebas de paridad.** RF-1, RF-2, RF-3, RF-4, RF-6, RF-7, RF-8; RNF-1
  - Hecho cuando: cada etiqueta, instrucción y estado de interfaz necesario tiene traducción no vacía en ambos idiomas y Vitest verifica la paridad; no se inventa el texto legal.
  - Borrador ES/EN del aviso y consentimiento incorporado a i18n por autorización de la persona usuaria, con estado explícito pendiente; no es texto aprobado para producción. T7 lo renderiza solo en builds locales, sin desplegar.

- [x] **T7. Crear las páginas estáticas y el marcado accesible del formulario.** RF-1, RF-2, RF-9; RNF-1–RNF-4
  - Hecho cuando: existen las rutas ES/EN con canonical, descripción y alternates correctos; el HTML incluye campos, etiquetas, consentimiento y estados accesibles, sin depender de JavaScript para mostrar el contenido; queda definido el contrato de respuestas localizables que usarán la interfaz y la Function.
  - Aprobación recibida: se permite mostrar el borrador ES/EN marcado como pendiente en builds locales para revisión. No desplegar las rutas de contacto hasta que el texto se revise y apruebe; mantener los envíos reales cerrados hasta la configuración de T14.
  - Contrato de respuestas acordado para las tareas cliente/Function: `200 { ok: true, code: 'accepted' }`; errores con `{ ok: false, code: 'validation', errors }`, `consentRequired`, `invalidRequest`, `artworkUnavailable`, `spamRejected` o `deliveryUnavailable`. `errors` usa códigos por campo sin textos ni datos personales.
  - Revisión Chrome DevTools: ES/EN a 375 px y 1280 px, sin overflow; árbol accesible con etiquetas, estados y consentimiento asociado al enlace del aviso. El envío permanece deshabilitado en este borrador local.

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

- [x] **T11. Conectar la interacción de cliente con el contrato del formulario.** RF-4, RF-6, RF-7, RF-8
  - Hecho cuando: errores y reintentos conservan los campos y la selección, permiten obtener un token Turnstile nuevo, anuncian el estado accesiblemente y solo limpian el formulario tras aceptación; los estados se prueban con respuestas simuladas conforme al contrato definido en T7.
  - Implementación: valida en cliente sin mutar el formulario, envía solo campos normalizados, asocia errores a controles, mantiene valores/selección ante rechazo o fallo y reinicia Turnstile cuando el token pudo consumirse; solo `accepted` limpia los campos. El botón permanece bloqueado mientras el borrador legal no esté aprobado o falte sitekey.
  - QA Chrome DevTools con `fetch` y token simulados: validación, rechazo antispam y fallo de correo preservan valores/selección; token renovado permite reintentar; aceptación anuncia estado y limpia. La sitekey real aún no está configurada; se verificará con T14/T17.

- [x] **T12. Implementar la recepción server-side, validación y verificación Turnstile.** RF-3, RF-4, RF-6, RF-7, RF-10
  - Hecho cuando: la Function rechaza métodos/configuración inválidos, revalida todos los campos y consentimiento, verifica el token en servidor, consulta el artefacto de la última versión desplegada y devuelve resultados localizables sin incluir datos personales en logs; Vitest cubre éxito y rechazos simulados.
  - Contrato implementado: `CONTACT_RECIPIENT`, `TURNSTILE_SECRET_KEY` y binding `ASSETS`; métodos/configuración inválidos fallan cerrados, se validan campos y consentimiento, el artefacto contiene solo IDs y la respuesta Turnstile se verifica con `fetch` server-side. No se registran datos personales ni tokens.
  - QA: 12 tests con Resend/Turnstile/assets simulados, incluidas validación, consentimiento, obra ausente, error de asset, rechazo de Turnstile y entrada válida. La ruta responde `deliveryUnavailable` tras validación hasta que T13 integre Resend; nunca reporta aceptación prematura.
  - Progreso adelantado para dependencia (T1): el helper puro de pertenencia por idioma y sus pruebas se consumen ahora en la Function.
  - Configuración de servidor prevista: `CONTACT_RECIPIENT`, `TURNSTILE_SECRET_KEY` y el binding `ASSETS`; el placeholder `.invalid` y los valores ausentes fallan de forma cerrada. `invalidRequest` se traduce al mensaje genérico de error; no incluye datos de la consulta.

- [x] **T13. Integrar el envío por Resend y el resultado de aceptación.** RF-7, RF-8, RF-10
  - Hecho cuando: Resend se llama solo tras validación y antispam correctos; solo una aceptación para entrega devuelve éxito; errores, timeout y placeholder no aceptan el envío ni exponen secretos; Vitest cubre esos resultados.
  - Implementación: `POST /emails` con `RESEND_API_KEY`, `CONTACT_FROM` y destinatario configurados fuera de Git; `reply_to` usa el email validado. Solo un 2xx con ID de Resend devuelve `accepted`; fallos, timeout, respuestas inválidas y placeholders devuelven `deliveryUnavailable` sin detalles ni secretos.
  - Vitest simula validación→Turnstile→Resend, rechazo, falta de credenciales, fallo HTTP, timeout y respuesta 2xx sin ID. No se hizo envío real.

- [ ] **T14. Configurar buzón real, remitente verificado y secretos de preview.** RF-6, RF-7, RF-10, RF-11
  - Hecho cuando: el alias del dominio reenvía al Gmail dedicado, las respuestas salen desde Gmail, el remitente usa un dominio verificado en Resend, los secretos están solo en la configuración de Pages y están configurados/registrados el procedimiento manual de 90 días y la excepción aprobada de respaldos de Gmail de hasta 6 meses.
  - Bloqueada: el dominio `artelleria.com` está comprado, pero falta activarlo como zona DNS en Cloudflare y crear/verificar el alias y el destino Gmail; también falta el remitente verificado en Resend y las claves de preview. No inventar valores ni compartir secretos en Git/chat. Variables previstas: `PUBLIC_TURNSTILE_SITE_KEY` (pública, de build), `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `CONTACT_RECIPIENT` y `CONTACT_FROM` (Function).

- [ ] **T15. Incorporar el aviso y consentimiento aprobados en ambos idiomas.** RF-9, RF-11; RNF-1, RNF-5
  - Hecho cuando: el texto aportado por la persona autorizada está aprobado por la persona responsable, informa los datos confirmados y comunica el plazo provisional vigente; ningún placeholder legal llega a producción.
  - El borrador preliminar ES/EN está en i18n con estado «pendiente de revisión y aprobación — no publicar»; no satisface esta tarea.

- [ ] **T16. Ejecutar la verificación completa del paquete web.** RF-1–RF-11; RNF-1–RNF-6
  - Hecho cuando: `pnpm --dir web verify` pasa con tests de dominio, proyección de catálogo y Functions incluidos, y el build contiene las páginas y el sitemap esperados.

- [ ] **T17. Probar errores y reintentos en el preview de Pages.** RF-3–RF-7; RNF-1, RNF-2
  - Hecho cuando: Chrome DevTools confirma rechazo por validación, consentimiento ausente, Turnstile fallido y fallo de correo; los datos se conservan, los mensajes son ES/EN y nunca aparece éxito prematuro.

- [ ] **T18. Probar un envío real en preview con Turnstile activo.** RF-6, RF-7, RF-8, RF-10
  - Hecho cuando: una consulta sintética llega al buzón controlado, la interfaz confirma solo después de aceptación de Resend y el placeholder no puede enviar; no se exponen secretos.

- [ ] **T19. Verificar Lighthouse y SEO en la página de contacto.** RNF-3, RNF-4
  - Hecho cuando: Lighthouse móvil alcanza ≥90 rendimiento, ≥95 accesibilidad y 100 SEO; se comprueban metadatos, canonical, alternates e inclusión en sitemap.

- [ ] **T20. Auditar la política efectiva de retención.** RF-11
  - Hecho cuando: se documenta la retención de Resend y del buzón receptor, incluida la regla para respuestas y última interacción sustantiva; cualquier límite no cubierto vuelve a la spec antes de cerrar RF-11.

## Alcance de entrega

La persona usuaria rechazó la división propuesta y aprobó mantener las 20 tareas en esta única entrega. No se crearán specs adicionales. RF-11 queda cubierta por el procedimiento manual aprobado y la excepción limitada de respaldos Google; el aviso legal aprobado y la configuración real siguen siendo requisitos previos a los envíos reales.
