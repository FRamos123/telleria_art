# Product brief — Portfolio AF Tellería

**Estado:** borrador — alcance vigente revisado el 2026-10-23: portfolio/galería informativa y consultas generales, sin comercio activo.
**Alcance:** visión del producto y posibles fases futuras. No es una spec de implementación: cada fase requiere una spec funcional aprobada.

> **Decisión vigente (2026-10-23):** la web actual presenta el portfolio como galería informativa y permite consultas generales/artísticas/institucionales. No hay tienda, ventas mediante consulta, negociación de precios, reservas comerciales, pedidos ni prints activos. Los elementos comerciales de este documento (HU-5 y RF-6, RF-7, RF-13, RF-16 y RF-17) quedan diferidos como posibles ideas futuras, no son requisitos vigentes ni autorizan implementación. Reabrirlos requiere una decisión expresa, revisión profesional de la viabilidad fiscal/legal y una spec comercial aprobada.

## Contexto y objetivo

El portfolio debe dar visibilidad a la obra y trayectoria de Alejandro Fernández Tellería y facilitar consultas generales de coleccionistas, instituciones y visitantes. El contenido debe presentarse en español e inglés sin inventar datos del artista. La compra de originales o prints no forma parte del alcance vigente; cualquier futura comercialización se decidirá y especificará por separado.

## Usuarios

- Coleccionistas que desean descubrir obras y solicitar información general sobre ellas.
- Curadores e instituciones que desean revisar obras, series y exposiciones, o realizar una consulta institucional.
- Visitantes que desean descubrir la obra y trayectoria del artista.
- Personas visitantes que desean recorrer una galería informativa del portfolio.

## Historias de usuario

- **HU-1.** Como coleccionista, quiero consultar una ficha completa y el estado catalográfico de una obra para conocerla, sin que la ficha ofrezca una compra.
- **HU-2.** Como curador, quiero explorar obras, series y exposiciones para evaluar su interés institucional.
- **HU-3.** Como visitante, quiero consultar el portfolio en español o inglés para comprender la obra y trayectoria en el idioma que elija.
- **HU-4.** Como coleccionista o representante institucional, quiero enviar una consulta para contactar con el artista sobre una obra o exposición.
- **HU-5 (futura, no activa).** Como comprador, quiero elegir una opción de compra disponible y pagarla mediante una pasarela para recibir el original o el print solicitado.

## Definiciones

| Término | Significado |
|---|---|
| **Disponibilidad del original** | Dato catalográfico informativo de la pieza única: `disponible`, `reservada`, `vendida` o `en colección`. En el alcance actual no constituye una oferta ni habilita compra. |
| **Obra original** | La pieza única descrita por la ficha de obra; no se ofrece en el alcance actual. Una eventual compra futura dependería de su disponibilidad y de una spec comercial aprobada. |
| **Print (futuro)** | Posible reproducción de una obra como producto independiente; no se ofrece actualmente. |
| **Compra (futuro)** | Posible pedido de un original o print mediante una pasarela; no existe en el alcance vigente. |
| **Consulta** | Mensaje general de contacto sobre una obra, serie, exposición o asunto institucional; no es un canal para precio, negociación, reserva ni compra. |
| **Campos obligatorios de una obra** | Título, serie, imagen con texto alternativo, año, técnica, soporte, dimensiones, número de inventario y disponibilidad. |
| **Campos opcionales de una obra** | Nota del cuaderno de taller y textos críticos asociados. |
| **Campos obligatorios de una exposición** | Título, lugar y fechas. La imagen es opcional. |

## Requisitos funcionales

- **RF-1. Idioma.** **CUANDO** una persona acceda al portfolio, **EL SISTEMA** mostrará la versión española por defecto y ofrecerá la versión inglesa.
- **RF-2. Inicio.** **CUANDO** una persona visite la página principal, **EL SISTEMA** presentará la identidad del artista y enlaces para explorar su obra, series, exposiciones y contacto.
- **RF-3. Series.** **CUANDO** una persona seleccione una serie, **EL SISTEMA** mostrará las obras asociadas y permitirá acceder a la ficha individual de cada obra.
- **RF-4. Fichas públicas.** **CUANDO** una persona consulte una obra publicada, **EL SISTEMA** mostrará sus campos obligatorios (título, serie, imagen con texto alternativo descriptivo, año, técnica, soporte, dimensiones en centímetros, número de inventario y disponibilidad) y, cuando existan, sus campos opcionales (nota del cuaderno de taller y textos críticos asociados).
- **RF-5. Disponibilidad visible.** **EL SISTEMA** mostrará siempre el estado de disponibilidad como texto; nunca lo comunicará únicamente mediante color.
- **RF-6 (futuro, no activo). Compra del original.** **CUANDO** una persona consulte una obra cuyo estado sea `disponible`, **EL SISTEMA** podría ofrecer comprar el original solo tras aprobar una spec comercial. No forma parte del alcance actual.
- **RF-7 (futuro, no activo). Compra de prints.** **CUANDO** exista una spec comercial aprobada, **EL SISTEMA** podría mostrar las variantes de prints que se definan. No forma parte del alcance actual.
- **RF-8. Exposiciones y textos.** **CUANDO** una persona explore el portfolio, **EL SISTEMA** presentará las exposiciones y los textos críticos disponibles, vinculándolos con las obras o series correspondientes cuando esa relación esté definida.
- **RF-9. Consultas.** **CUANDO** una persona envíe una consulta, **EL SISTEMA** solicitará los datos de contacto y el mensaje necesarios para responder y mostrará confirmación solo cuando el envío se haya aceptado.
- **RF-10. Errores del formulario.**
  - **SI** faltan campos obligatorios o algún dato no es válido, **ENTONCES EL SISTEMA** indicará qué debe corregirse y conservará los datos ya introducidos.
  - **SI** el envío falla, **ENTONCES EL SISTEMA** informará del fallo y permitirá volver a intentarlo.
- **RF-11. Contenido incompleto.**
  - **SI** una obra o exposición carece de un campo obligatorio (incluida la imagen de una obra) en español, **ENTONCES EL SISTEMA** no publicará ninguna versión hasta que el contenido esté completo.
  - **SI** falta la versión inglesa de una página, **ENTONCES EL SISTEMA** mantendrá publicada la versión española, no publicará la inglesa y no ofrecerá enlaces entre idiomas hacia una versión inexistente.
- **RF-12. Fidelidad del contenido.** **SI** falta información del artista, **ENTONCES EL SISTEMA** no la inventará ni la sustituirá por texto que pueda confundirse con contenido auténtico.
- **RF-13 (futuro, no activo). Comercio.** Solo tras reabrir el alcance y aprobar una spec comercial, **EL SISTEMA** podrá permitir compras mediante una pasarela aprobada. No se implementará en la fase actual.
- **RF-14. Privacidad.** **ANTES** de recoger datos para una consulta general, **EL SISTEMA** mostrará un aviso que identifique responsable, finalidad, interés legítimo documentado del artículo 6.1.f RGPD y derecho de oposición. **EL SISTEMA** tratará los datos solo para gestionar y responder a la consulta, sin exigir consentimiento como condición de envío. La persona responsable documentará la evaluación de interés legítimo y confirmará por separado la base/roles aplicables al antispam y a los proveedores antes de publicar el aviso.
- **RF-15. Protección frente a spam.** **SI** un envío no supera la verificación antispam, **ENTONCES EL SISTEMA** lo rechazará, informará de ello y permitirá reintentarlo conservando los datos ya introducidos.
- **RF-16 (futuro, no activo). Confirmación de pago.** Solo se definirá si una futura spec comercial aprueba un checkout.
- **RF-17 (futuro, no activo). Datos de pago.** Si se aprueba una spec comercial futura, el proyecto no almacenará ni procesará directamente datos sensibles de tarjetas y utilizará la pasarela aprobada.

## Requisitos no funcionales

- **RNF-1. i18n.** La navegación y el contenido publicado estarán disponibles en español e inglés, con acceso entre las versiones equivalentes cuando existan.
- **RNF-2. Accesibilidad.** El texto cumplirá WCAG AA, con contraste mínimo de 4.5:1 para texto normal y 3:1 para texto grande. Los estados tendrán etiqueta textual; el texto usará colores sólidos, sin opacidad.
- **RNF-3. Diseño.** La interfaz respetará los patrones y tokens acordados en `design/tokens.md`.
- **RNF-4. SEO.** Las páginas públicas de obras y series tendrán URL propia, título y descripción únicos. El contenido incluirá datos estructurados para artista, obras y exposiciones, relaciones de idioma (solo entre versiones publicadas) y mapas del sitio de páginas e imágenes.
- **RNF-5. Contenido visible.** El contenido principal de cada página estará disponible para los motores de búsqueda y para las personas sin depender de ejecutar interacciones del navegador.
- **RNF-6. Imágenes.** Las imágenes tendrán texto alternativo descriptivo y se mostrarán en tamaños adecuados a la pantalla, sin presentar originales a máxima resolución.
- **RNF-7. Rendimiento.** Lighthouse alcanzará al menos 90 en rendimiento, 95 en accesibilidad y 100 en SEO en las páginas evaluadas.
- **RNF-8 (futuro, no activo). Seguridad de pago.** Si se aprueba una fase comercial, la integración no expondrá secretos de la pasarela en el cliente ni guardará datos sensibles de pago en el proyecto; los detalles verificables se fijarán en la spec de comercio una vez elegido el proveedor.

## Casos límite

| Situación | Comportamiento esperado |
|---|---|
| Falta la imagen principal de una obra | No se publica la obra: la imagen es obligatoria. |
| Falta la imagen de una exposición | Se publica la exposición sin imagen: es opcional. |
| Falta la traducción al inglés de una página | Se mantiene la versión española; la inglesa no se publica y el selector de idioma y `hreflang` solo enlazan versiones existentes. |
| Falta un campo obligatorio en español | No se publica ninguna versión de la página. |
| Hay campos opcionales vacíos | No se inventa contenido; la ficha omite el dato vacío. |
| La obra tiene cualquier estado de disponibilidad | Se muestra como dato catalográfico textual; en el alcance vigente no ofrece ni habilita su compra. |
| Una persona pregunta por precio o compra en el campo libre de contacto | La consulta no crea ni confirma oferta, reserva, pedido ni venta; el sistema no presenta el formulario como canal de compra. |
| Faltan precio, variante, logística u otras condiciones comerciales | No hay productos comprables en la fase vigente. |
| El formulario contiene errores o no se puede enviar | Se informa del problema y se permite corregir o reintentar sin perder los datos introducidos. |
| El envío no supera la verificación antispam | Se rechaza, se informa y se permite reintentar sin perder los datos. |
| La persona se opone al tratamiento de sus datos | Se tramita la oposición; se deja de tratar la consulta para responder salvo una excepción legítima documentada. |

## Fuera de alcance

- Cuentas de usuario y funciones avanzadas de gestión de pedidos, salvo que una spec posterior las apruebe.
- Audioguías y visitas al taller.
- Boletines por email.
- Visor interactivo de obras (zoom de alta resolución) y búsqueda avanzada: quedan para una versión posterior.
- Analítica y cookies no esenciales. Si se añaden más adelante, será necesario un aviso de cookies.
- Tienda, venta por consulta, negociación de precios, reservas comerciales, aceptación de pedidos, pagos y venta de prints; requieren reabrir el alcance y aprobar una spec comercial futura.

## Criterios de finalización

- [ ] Se puede recorrer la presentación, las obras, las series, las exposiciones y el contacto en ambos idiomas cuando su contenido esté completo.
- [ ] Cada serie y obra publicada tiene una dirección propia y la información correspondiente aparece en su página.
- [ ] Los cuatro estados de disponibilidad se muestran mediante texto y se mantienen como metadatos informativos, sin ofertas ni acciones de compra.
- [ ] No hay precios, tienda, CTA comercial ni ventas por consulta en el alcance vigente.
- [ ] El formulario valida los datos, presenta el aviso de privacidad, procesa las consultas generales bajo el interés legítimo documentado, permite ejercer oposición, resiste el spam, identifica la obra cuando corresponde y da mensajes coherentes de éxito o error.
- [ ] Las páginas verificadas alcanzan los objetivos de accesibilidad, SEO y rendimiento indicados.

## Decisiones cerradas

- Campos obligatorios y opcionales de obra y exposición: ver *Definiciones*.
- Si falta solo la traducción EN, se oculta únicamente la versión inglesa; la española sigue publicada.
- Visor interactivo y búsqueda avanzada: fuera de la v1.
- El formulario presenta aviso de privacidad y protección antispam; no exige casilla de consentimiento para responder consultas generales bajo el interés legítimo documentado.
- No hay compra de originales ni prints ni ventas por consulta en la fase actual. La comercialización queda diferida y no está aprobada como requisito activo.

## Dudas abiertas para una futura spec comercial (no bloquean la galería actual)

- [NECESITA ACLARACIÓN] ¿Qué pasarela de pago se usará y qué flujo de checkout ofrece (alojado/redirect, incrustado u otro)? ¿En qué países se venderá y en qué moneda?
- [NECESITA ACLARACIÓN] ¿Cuál será el precio del original y de cada print, y cómo se mostrarán impuestos y gastos antes de pagar?
- [NECESITA ACLARACIÓN] ¿Qué tamaños de print habrá, serán ediciones limitadas o abiertas, y qué papel/acabados deben describirse?
- [NECESITA ACLARACIÓN] ¿Los prints seguirán disponibles aunque el original esté reservado, vendido o en colección? ¿Cómo se gestionan su stock y el del original, y cuándo se actualiza `Availability` tras una compra?
- [NECESITA ACLARACIÓN] ¿Quién produce, empaqueta y envía los pedidos, a qué destinos, con qué plazos y costes?
- [NECESITA ACLARACIÓN] ¿Qué políticas de cancelación, devolución, reembolso, daños en tránsito y atención posventa se aplican?
- [NECESITA ACLARACIÓN FUTURA] Si se reactiva el comercio, ¿qué datos de comprador se recogen, quién es responsable del tratamiento, cuánto se conservan y qué avisos/bases jurídicas se aplican a los pedidos?
- [NECESITA ACLARACIÓN] ¿Qué emails de confirmación/estado se enviarán y quién los enviará?
- [NECESITA ACLARACIÓN] ¿Quién redacta y revisa los textos legales de privacidad, venta, envío y devoluciones?
