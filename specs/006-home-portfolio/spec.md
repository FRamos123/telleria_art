# Spec 006 — Home portfolio
Estado: borrador

## Contexto y objetivo

La página de inicio actual identifica al artista, pero ofrece poca orientación para explorar su portfolio. La home debe convertirse en una entrada bilingüe que facilite el acceso a las obras, series, exposiciones y contacto, y muestre una selección breve de obras publicadas.

El contenido visible se limita a textos ya aprobados y contenido real publicado. No se añadirán biografía, citas, manifiestos, datos de obra ni imágenes inventados.

## Usuarios

- Coleccionistas que quieren descubrir obras y consultar sobre ellas.
- Curadores, instituciones, críticos y otras personas que desean explorar la trayectoria pública del artista.
- Personas visitantes que quieren conocer la identidad del artista y orientarse por el portfolio en español o inglés.

## Historias de usuario

- **HU-1.** Como persona visitante, quiero identificar al artista y entender que estoy en su portfolio para decidir qué contenido explorar.
- **HU-2.** Como coleccionista o representante institucional, quiero encontrar desde la home las obras, series, exposiciones y el contacto para llegar directamente a la sección que necesito.
- **HU-3.** Como persona visitante, quiero ver una selección breve de obras publicadas para descubrir el portfolio sin recorrer primero todo el catálogo.
- **HU-4.** Como persona visitante en inglés, quiero ver solo contenido disponible en inglés para no recibir textos en español como sustituto.

## Definiciones

- **Obra reciente:** obra publicada y válida para la home del idioma activo, ordenada por año de creación descendente; los empates se resuelven por ID ascendente. Se muestran como máximo las tres primeras.
- **Contenido válido para un idioma:** obra con traducción publicada en ese idioma e imagen válida para mostrar. No se sustituye una traducción o imagen ausente por contenido de otro idioma ni por un placeholder.
- **Destino disponible:** ruta localizada que está incluida en la publicación actual. La home no enlaza a rutas que aún no estén disponibles.
- **Navegación de series:** conduce al directorio de series que ya aparece en la sección de obras del mismo idioma; esta versión no define una ruta independiente de índice de series.

## Requisitos funcionales

- **RF-1. Identidad.** **CUANDO** una persona acceda a la home en español o inglés, **EL SISTEMA** presentará el nombre del artista y la identificación existente y aprobada en el idioma correspondiente, sin añadir texto editorial nuevo.
- **RF-2. Navegación de la home.** **CUANDO** una persona acceda a la home, **EL SISTEMA** ofrecerá navegación localizada hacia obras (`/obras/` o `/en/works/`), series (el directorio de series de esas mismas rutas), exposiciones (`/exposiciones/` o `/en/exhibitions/`) y contacto (`/contacto/` o `/en/contact/`). La navegación se presenta en la home; esta spec no cambia el encabezado global de las demás páginas.
- **RF-3. Destinos existentes.** **SI** la ruta de destino no está disponible en la publicación actual para el idioma activo, **ENTONCES EL SISTEMA** no presentará un enlace a esa ruta. El enlace de contacto solo aparece cuando la ruta de contacto localizada está publicada.
- **RF-4. Selección de obras.** **CUANDO** existan obras válidas en el idioma activo, **EL SISTEMA** mostrará hasta tres obras recientes, ordenadas por año de creación descendente y, en caso de empate, por ID ascendente. Cada obra enlazará únicamente a su ficha publicada en el mismo idioma.
- **RF-5. Contenido de cada obra.** **CUANDO** una obra aparezca en la selección, **EL SISTEMA** mostrará únicamente sus datos publicados disponibles: imagen, título, año y etiqueta textual de disponibilidad. La selección no filtrará por disponibilidad ni ofrecerá compra, reserva o pago.
- **RF-6. Estados de disponibilidad.** **EL SISTEMA** permitirá mostrar en la selección los cuatro estados `disponible`, `reservada`, `vendida` y `en colección`; cada estado irá acompañado de su etiqueta textual y nunca se comunicará solo mediante color.
- **RF-7. Sin fallback ni contenido inventado.** **SI** una obra no tiene traducción publicada o imagen válida en el idioma activo, **ENTONCES EL SISTEMA** la omitirá en ese idioma, sin fallback a otra lengua, placeholder de contenido artístico ni imagen inventada.
- **RF-8. Selección vacía o incompleta.** **SI** hay menos de tres obras válidas en el idioma activo, **ENTONCES EL SISTEMA** mostrará solo las disponibles; **SI** no hay ninguna, **ENTONCES EL SISTEMA** omitirá el bloque de selección sin mostrar contenido de relleno.

## Requisitos no funcionales

- **RNF-1. i18n.** La home y su navegación estarán disponibles en español e inglés. Los enlaces, metadatos y textos de interfaz corresponderán al idioma activo, sin fallback entre idiomas.
- **RNF-2. Accesibilidad.** La página cumplirá WCAG 2.2 AA: navegación por teclado, foco visible, estructura semántica, nombres accesibles y textos alternativos descriptivos para las imágenes. Los estados de disponibilidad tendrán etiqueta textual.
- **RNF-3. Responsive.** La página funcionará en móvil (`<768px`), tablet (`768–1279px`) y escritorio (`≥1280px`), sin desbordamiento horizontal ni pérdida de contenido.
- **RNF-4. SEO.** Cada versión tendrá título y descripción únicos y localizados, canonical y alternates solo hacia versiones existentes. Las rutas de inicio seguirán incluidas en el sitemap.
- **RNF-5. Rendimiento e imágenes.** El contenido principal estará presente en el HTML generado sin depender de JavaScript. Las imágenes se servirán optimizadas y responsive, con dimensiones explícitas. Lighthouse móvil alcanzará al menos 90 en rendimiento, 95 en accesibilidad y 100 en SEO.
- **RNF-6. Sistema visual.** La home compondrá únicamente patrones y tokens de diseño ya aprobados; no añadirá tokens, estilos arbitrarios ni secciones editoriales nuevas.

## Casos límite

| Situación | Comportamiento esperado |
|---|---|
| Una obra está publicada en español, pero no tiene traducción inglesa | Aparece solo en la home española. |
| Una obra carece de imagen válida en el idioma activo | Se omite esa obra en la selección de ese idioma. |
| Hay una o dos obras válidas en el idioma activo | Se muestran únicamente esas obras, sin tarjetas de relleno. |
| No hay obras válidas en el idioma activo | Se omite el bloque de selección. |
| Una obra tiene disponibilidad `disponible`, `reservada`, `vendida` o `en colección` | Puede aparecer sin importar su estado; se muestra la etiqueta textual correspondiente. |
| La obra no tiene una ficha publicada en el idioma activo | No se ofrece un enlace a esa ficha. |
| La ruta de contacto todavía no está publicada | Se omite el enlace de contacto, evitando un destino inexistente. |
| La ruta o el texto de interfaz no tiene versión inglesa disponible | No se crea un alternate ni se presenta el texto español como fallback inglés. |
| El contenido de la referencia de diseño no existe como contenido publicado aprobado | Se omite; la referencia visual no autoriza inventar textos, títulos, citas ni datos. |

## Fuera de alcance

- Bloques de citas, manifiestos, biografía ampliada, historia del artista o textos críticos que no hayan sido seleccionados como contenido real publicado.
- Previsualizaciones de series o exposiciones como bloques de contenido; en esta versión solo se añaden sus destinos a la navegación.
- Una obra destacada elegida manualmente, carruseles, filtros o controles de interacción para la selección de obras.
- Nuevas rutas independientes para el índice de series.
- Cambios de navegación global en páginas distintas de la home.
- Compra, reserva, precio, checkout o cualquier acción comercial.
- Modificación de contenido publicado en el CMS.

## Criterios de finalización

- [ ] La home ES y EN presenta la identidad aprobada del artista y la navegación especificada, solo en la propia home.
- [ ] Las rutas de obras, series, exposiciones y contacto apuntan a destinos existentes y localizados; no hay enlaces muertos.
- [ ] La selección muestra como máximo las tres obras publicadas más recientes válidas por idioma, con el orden y desempate definidos.
- [ ] La selección admite los cuatro estados de disponibilidad con etiqueta textual, no filtra por estado y no inicia acciones comerciales.
- [ ] Las obras sin traducción o imagen válida se omiten; con menos de tres se muestran las disponibles y con cero se omite el bloque.
- [ ] No se han añadido textos editoriales, títulos, imágenes ni datos de artista que no existan en contenido publicado aprobado.
- [ ] Las versiones tienen metadatos localizados, canonical y alternates correctos; el contenido estático aparece sin JavaScript.
- [ ] Chrome DevTools confirma el comportamiento en móvil, tablet y escritorio, en ES y EN, sin overflow y con navegación accesible por teclado.
- [ ] `pnpm --dir web verify` pasa; Lighthouse móvil alcanza ≥90 en rendimiento, ≥95 en accesibilidad y 100 en SEO.

## Dudas abiertas

Ninguna tras la ronda de aclaraciones. La revisión legal de la spec 005 y la disponibilidad de la ruta de contacto siguen siendo condiciones para desplegar enlaces a contacto; esta spec no aprueba ni publica el aviso legal pendiente.
