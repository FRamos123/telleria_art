# Spec 000 — Fundación

Estado: aprobada

> **Nota de vigencia (2026-10-07):** esta spec conserva el alcance histórico de la fundación implementada. RF-13 documenta que esa entrega no tenía comercio; no limita las siguientes fases. El brief de producto actualizado prevé compra de originales y prints, que requiere una spec comercial propia aprobada antes de implementarse.

## Contexto y objetivo

Establecer una primera presencia pública, bilingüe y desplegada del portfolio de Alejandro Fernández Tellería. Esta versión será deliberadamente mínima: debe permitir reconocer el portfolio, navegar entre español e inglés y ofrecer una base visual accesible sobre la que añadir contenido en futuras versiones.

## Usuarios

- Visitantes que llegan al portfolio y quieren identificar al artista.
- Coleccionistas y representantes institucionales que necesitan una presencia pública fiable.
- La persona responsable de publicar cambios en la rama principal del proyecto.

## Historias de usuario

- **HU-1.** Como visitante, quiero reconocer el portfolio y cambiar entre español e inglés para orientarme en mi idioma.
- **HU-2.** Como visitante que llega a una dirección inexistente, quiero entender que la página no está disponible y volver al inicio.
- **HU-3.** Como responsable del proyecto, quiero que una actualización aprobada en la rama principal se publique automáticamente para mantener disponible la versión pública.

## Definiciones

- **Rama principal:** la rama designada como principal para publicar la versión pública.
- **Verificación automática única:** una comprobación agregada formada exactamente por lint, comprobación de tipos, tests y build.
- **Publicación inicial satisfactoria:** después del primer despliegue desde la rama principal, la página principal en español de la URL pública responde con HTTP 200. Esta comprobación es un criterio de finalización, no una condición previa de publicación.
- **Hreflang básico:** indicación de las versiones de idioma equivalentes que realmente están publicadas.

## Requisitos funcionales

- **RF-1. Idioma — heredado del brief.** CUANDO una persona acceda al portfolio, EL SISTEMA mostrará la versión española por defecto y ofrecerá la versión inglesa.
- **RF-13. Sin compra online — heredado del brief.** EL SISTEMA no ofrecerá carrito, checkout ni pago de obras.
- **RF-14. Verificación y publicación.** CUANDO una actualización llegue a la rama principal, EL SISTEMA ejecutará la verificación automática única y la plataforma publicará la actualización solo si el comando de verificación termina con éxito.
- **RF-15. Contenido del build.** CUANDO la verificación evalúe el resultado del build, EL SISTEMA comprobará que contiene la home ES, la home EN y la página 404.
- **RF-16. Fallo de verificación.** SI falla la verificación automática, ENTONCES EL SISTEMA no sustituirá la versión activa.
- **RF-17. Rutas por idioma.** CUANDO una persona solicite la página principal, EL SISTEMA servirá español en la ruta sin prefijo y la versión inglesa bajo `/en/`.
- **RF-18. Páginas de la fundación.** EL SISTEMA ofrecerá en español e inglés todas las páginas incluidas en esta spec; la 404 presentará contenido en ambos idiomas.
- **RF-19. Selector de idioma.** CUANDO una persona use el selector ES/EN, EL SISTEMA la llevará a la página principal equivalente: ruta sin prefijo para español y `/en/` para inglés.
- **RF-20. Hreflang básico.** CUANDO se muestre una página principal, EL SISTEMA indicará mediante `hreflang` las dos versiones publicadas, sin enlazar versiones inexistentes.
- **RF-21. Layout base.** CUANDO se muestre una página de la fundación, EL SISTEMA presentará una cabecera con la marca del artista y el selector ES/EN, y un pie, de acuerdo con los patrones, tokens y referencias visuales aprobados; no mostrará enlaces de navegación.
- **RF-22. Página principal mínima.** CUANDO una persona visite la página principal, EL SISTEMA presentará dentro del layout el nombre «Alejandro Fernández Tellería» y la identificación «Pintor · Vigo, Galicia» en español y su equivalente en inglés, sin requerir contenido de obras, series o exposiciones.
- **RF-23. Página 404.** SI una persona solicita una ruta desconocida o un idioma no admitido, ENTONCES EL SISTEMA responderá con HTTP 404 y mostrará una página 404 bilingüe dentro del layout base, con enlaces a ambas páginas principales.
- **RF-24. Verificación automática única.** CUANDO se ejecute la verificación del proyecto, EL SISTEMA realizará una única comprobación agregada que incluya lint, comprobación de tipos, tests y build, incluida la comprobación de RF-15, e informará de un resultado global satisfactorio o fallido. Los tests comprobarán que las claves de traducción ES y EN son idénticas.
- **RF-25. Fallo del primer despliegue.** SI falla la verificación del primer despliegue, ENTONCES EL SISTEMA no publicará ninguna versión y dejará visible el fallo en el registro del despliegue.

## Requisitos no funcionales

- **RNF-1. i18n — heredado del brief.** La navegación y el contenido de la fundación estarán disponibles en español e inglés; el selector y las relaciones de idioma solo apuntarán a versiones existentes.
- **RNF-2. Accesibilidad — heredado del brief.** El layout cumplirá WCAG AA: contraste mínimo de 4.5:1 para texto normal y 3:1 para texto grande. La cabecera, selector y pie serán utilizables con teclado. El indicador de foco tendrá contraste mínimo de 3:1 frente a los colores adyacentes. Los textos usarán tokens de color sólidos, sin opacidad.
- **RNF-3. Diseño — heredado del brief.** La cabecera, el pie, el selector y la página mínima respetarán los patrones, colores, tipografía, espaciados, radios y comportamiento responsive definidos por los tokens aprobados; no introducirán estilos visuales ajenos a ellos.
- **RNF-4. SEO básico.** Las páginas principales ES y EN tendrán el atributo de idioma correspondiente, título y descripción no vacíos y únicos por idioma, canonical a su propia ruta y `hreflang` recíproco.
- **RNF-5. Contenido visible — heredado del brief.** La identificación y el contenido principal de la página mínima y de la página 404 estarán disponibles sin depender de interacciones ejecutadas en el navegador.
- **RNF-7. Rendimiento — heredado del brief.** Lighthouse se ejecutará manualmente, como evaluación separada de la verificación automática, sobre las páginas principales ES y EN en móvil. Cada evaluación obtendrá al menos 90 en rendimiento.

## Casos límite

- La persona visita `/`: se muestra la home española; visita `/en/`: se muestra la home inglesa.
- La persona visita `/es/`, otra ruta desconocida o una ruta con idioma no admitido: recibe HTTP 404 y la página 404 bilingüe.
- Las claves de traducción de ES y EN no coinciden: falla la verificación automática y no se publica la actualización.
- El resultado del build no contiene la home ES, la home EN o la 404: falla la verificación y la versión activa no se sustituye.
- Falla la verificación del primer despliegue: no se publica ninguna versión y el fallo queda visible en el registro del despliegue.
- Falla cualquiera de lint, tipos, tests o build: la plataforma no publica la actualización y la versión activa no se sustituye.
- Después del primer despliegue, la home ES de la URL pública no responde HTTP 200: no se cumple el criterio de finalización. Esta respuesta posterior a la publicación no es una condición previa para desplegar ni implica rollback automático.
- El contenido del portfolio aún no incluye obras, series, exposiciones ni formulario: la fundación sigue mostrando la home mínima y permite cambiar el idioma y volver al inicio desde la 404.

## Fuera de alcance

- Gestión y publicación de contenido editorial por parte del artista.
- Obras, series, exposiciones y sus páginas o fichas.
- Formulario de consultas o adquisiciones.
- Enlaces de navegación de secciones.
- SEO avanzado, incluidos datos estructurados, sitemaps y sitemap de imágenes.
- Bloquear o revertir automáticamente una versión ya publicada por una respuesta HTTP distinta de 200; el HTTP 200 de la home ES se comprueba como criterio de finalización tras el primer despliegue.
- Carrito, checkout y pagos.

## Criterios de finalización

- La plataforma publica una actualización de la rama principal solo si la verificación automática única termina con éxito; si falla, la versión activa no se sustituye.
- La verificación incluye lint, tipos, tests, build y comprobar que el resultado contiene la home ES, la home EN y la 404.
- Tras el primer despliegue desde la rama principal, la home ES pública responde HTTP 200.
- `/` ofrece la home ES y `/en/` la home EN; ambas muestran la cabecera, el selector y el pie. La 404 responde HTTP 404 e incluye contenido en ES y EN.
- La home muestra el nombre del artista y «Pintor · Vigo, Galicia» en español, y su equivalente inglés; no muestra enlaces de navegación.
- El selector conecta las dos rutas y los metadatos de idioma solo las relacionan entre sí. Las claves de traducción ES y EN coinciden exactamente.
- El layout supera WCAG AA para texto y contraste de foco, y permite operar cabecera, selector y pie con teclado.
- La checklist visual se completa en **375 px**, **768 px** y **1280 px o más**:
  - En las tres anchuras aparecen la marca y el selector en la cabecera, y la marca en el pie; no aparecen enlaces de navegación.
  - A 375 px se usa una columna y margen lateral de `1.5rem`; a 768 px, el rango tablet de 8 columnas y gutter de `1.5rem`; a 1280 px o más, el rango escritorio de 12 columnas y gutter de `2rem`.
  - En ninguna anchura hay desbordamiento horizontal; los radios son 0 y los textos usan únicamente tokens sólidos con contraste AA.
- La evaluación manual de Lighthouse se realiza por separado del gate automático en las homes ES y EN en móvil; cada una alcanza rendimiento ≥ 90.

## Decisiones cerradas

- Si falla la verificación del primer despliegue, no se publica ninguna versión y el fallo queda visible en el registro del despliegue.
- La publicación se condiciona al éxito de la verificación, que confirma la home ES, la home EN y la 404 en el build. El HTTP 200 de la home ES se comprueba tras el primer despliegue y no activa bloqueo ni rollback automático.

## Dudas abiertas

- Ninguna.
