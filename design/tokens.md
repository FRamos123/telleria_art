# Tokens de diseño — AF Tellería

## Changelog

- **2026-10-07:** decisiones acordadas: acento canónico `#c48b3c`, radios `0`, breakpoints mobile-first de `DESIGN.md`, texto siempre sólido, inventario con placa opaca y contraste AA, carmín limitado a bordes/superficies, y estados de obra con etiqueta textual y colores verificados.
- **2026-10-07:** se documentan como estimados los patrones base de cabecera y pie; se explicitan los tres rangos responsive mobile-first, incluido tablet.
- **2026-10-07:** se añade el mapeo normativo a variables `@theme` de Tailwind CSS v4; los nombres semánticos conservan los del export de Stitch y los valores siguen las decisiones vigentes.
- **2026-10-08:** se actualiza la ruta del tema de Tailwind tras separar el repositorio en `web/` y `studio/`.
- **2026-10-09:** se documenta el patrón aprobado para tarjetas de obra y directorio de series de Spec 002 (T7), sin añadir ni cambiar tokens.
- **2026-10-20:** se documenta el patrón de enlace de salto y la entrega local de Bodoni Moda, Newsreader y Geist en WOFF2 con licencias SIL OFL 1.1; no cambian valores de `@theme`.
- **2026-10-21:** se documenta el patrón compuesto del formulario de contacto de Spec 005 con tokens existentes; no cambian valores de `@theme`.
- **2026-10-21:** se añade el estado de revisión local para el borrador de privacidad: aviso visible de pendiente, formulario sin envío y controles deshabilitados con tokens existentes; no cambia `@theme`.
- **2026-10-21:** se documentan los enlaces localizados de contacto en la ficha de obra y el pie con estilos existentes; no cambian valores de `@theme`.
- **2026-10-23:** actualización aprobada de Spec 005: el patrón de contacto sustituye la casilla obligatoria de consentimiento por aviso informativo y derecho de oposición, manteniendo los tokens existentes y sin cambios en `@theme`.
- **2026-10-26:** se documenta el patrón home editorial asimétrico de la revisión Spec 006; usa tokens y escalas existentes, sin cambios en `@theme`.
- **2026-10-26:** se ajusta el patrón de la home para obedecer fielmente a la maquetación de `design/alejandro_fern_ndez_teller_a_portfolio_oficial_obra_series/` (navegación superior de home, hero en tres líneas con CTAs, todas las obras seleccionadas en bloques curatoriales completos de 12 columnas alternados con `InventoryBadge`, filas de exposiciones en 12 columnas y bloque de cierre hacia contacto), manteniendo exclusivamente tokens existentes sin cambios en `@theme`.
- **2026-10-26:** se actualizan los patrones de Obra y Series (Spec 002) y de Exposiciones (Spec 004) para obedecer fielmente a `design/alejandro_fern_ndez_teller_a_obra_series_cat_logo_razonado/` y `design/alejandro_fern_ndez_teller_a_exposiciones_trayectoria_muse_stica/` (cabecera con resumen real de inventario, barra estática de series, tarjetas de obra enriquecidas, bloque de series de estudio, archivo retrospectivo de exposiciones en 12 columnas y cierre hacia contacto), sin cambios en `@theme`.
- **2026-10-26:** se unifica la navegación superior en una sola barra global (`SiteHeader` con marca `Alex Tellería` + `artistIdentification` a la izquierda, `HomeNavigation` en el centro y `LanguageSwitcher` a la derecha en todas las páginas), eliminando la doble barra de la home y actualizando el nombre artístico público a `Alex Tellería`.
- **2026-10-26:** se propone adaptar la página de consultas a la nueva referencia `design/consultas_alejandro_fernandez_telleria/` con cabecera editorial y composición asimétrica 5/7. Se conservan el formulario, el aviso de privacidad y los mensajes ya aprobados; se omiten elementos comerciales y afirmaciones no verificadas del HTML de referencia. Solo tokens existentes; no cambia `@theme`.
- **2026-10-26:** se documenta el patrón renovado de ficha de obra y el Visor Sala Oscura a pantalla completa (`design/la_fisonom_a_del_silencio_visor_sala_oscura_examen_de_lienzo_a_pantalla_completa/`): barra superior con migas de pan y acciones rápidas («Examinar en Sala Oscura» y «Citar obra»), visor interactivo en ficha y modal Sala Oscura (zoom, desplazamiento pan, minimapa, modos de iluminación Galería/Taller Rasante y retícula milimétrica), historial de exposiciones reales asociadas y bloque «Siguiente pieza en la secuencia» dentro de la misma serie, alimentados exclusivamente con datos reales de Sanity y tokens existentes sin cambios en `@theme`.
- **2026-10-26:** se incorpora el patrón de menú móvil «Sala Oscura · Índice General» (`design/alejandro_menu/`) en `SiteHeader` con selector de idioma `ES / EN` tipo conmutador de archivo siempre visible fuera del menú en la barra superior, disparador táctil `[ ÍNDICE ≡ ]` en móvil (`<768px`) y panel desplegable a pantalla completa con fichas de índice curatorial enriquecidas con conteos reales de Sanity, pieza destacada en custodia y correspondencia directa hacia contacto, sin cambios en `@theme`.

## Fuentes y criterio

- `design/tenebrism_matter/DESIGN.md`: descripción del sistema y valores declarados.
- `code.html` de portfolio, detalle de obra y visor: configuración Tailwind y clases usadas. Los tres repiten la misma configuración de tema.
- Captura legible: `design/alejandro_fern_ndez_teller_a_portfolio_oficial_obra_series/screen.png`. Las capturas `screen.png` de las dos pantallas de detalle no se pudieron leer; las fotos `design/telle1.jpg/screen.png` y `design/telle2.jpg/screen.png` sí se leyeron, pero son reproducciones de obra, no referencia fiable para tokens de interfaz.
- Los hex y medidas siguientes son valores explícitos del export salvo donde se indique «estimado» o «valor por defecto Tailwind». Las descripciones de `DESIGN.md` no siempre coinciden con el HTML: se conserva la discrepancia, sin escoger una fuente como definitiva.

## 1. Colores

| Token semántico | Valor | Uso en las fuentes |
|---|---|---|
| `background` / `surface` / `surface-dim` | `#131315` | Fondo base declarado en el tema; las tres claves comparten valor y se consolidan aquí. |
| `surface-lowest` | `#0e0e10` | Fondo más oscuro: secciones de galería, cabecera de fichas, fondos de formularios y placas sobre imágenes. |
| `surface-low` | `#1b1b1d` | Paneles de ficha técnica, controles, formulario y bloques de contenido. |
| `surface-container` | `#201f21` | Paneles y bloques de anotación; fondo alternativo de sección. |
| `surface-container-high` | `#2a2a2c` | Estados elevados, ayudas y fondos de controles. |
| `surface-variant` / `surface-container-highest` | `#353437` | Separadores y superficies elevadas; ambos alias comparten el mismo hex. |
| `surface-bright` | `#39393b` | Valor declarado en la paleta; no se aprecia un uso concreto en los componentes revisados. |
| `text-primary` (`on-surface`, `on-background`) | `#e5e1e4` | Títulos, valores técnicos y texto principal; aliases consolidados. `DESIGN.md` describe un hueso ligeramente distinto (`#e5e1db`), no usado por el tema HTML. |
| `text-secondary` (`on-surface-variant`) | `#d5c4b2` | Texto editorial, cuerpo y atribuciones. |
| `text-muted` (`on-surface-variant`) | `#d5c4b2` | Texto secundario, etiquetas y metadatos; siempre opaco. |
| `outline` — solo no textual | `#9d8e7e` | Contorno decorativo únicamente. No usar en texto. |
| `outline-variant` | `#504538` | Divisiones y contornos discretos. |
| `accent` (`primary`, `primary-container`) | `#c48b3c` | Acento ocre/sienna canónico: enlaces activos, estado disponible, foco y superficies destacadas. Reemplaza `#faba67` como acento de interfaz. |
| `on-accent` | `#0e0e10` | Texto sólido sobre superficies `accent`. |
| `status-reserved` (`secondary`) | `#ffb3ad` | Color elegido para la etiqueta textual «Reservada» y texto sobre superficie carmín. |
| `status-sold` | `#d5c4b2` | Color elegido para la etiqueta textual «Vendida». |
| `status-collection` | `#e5e1e4` | Color elegido para la etiqueta textual «En colección». |
| `carmine-surface` (`secondary-container`) | `#8c1f20` | Fondo/borde carmín decorativo; no usar para texto. |
| `carmine-border` | `#ffb3ad` | Borde carmín de inventario de 1 px; sólido. |
| Borde claro, `DESIGN.md` | `rgba(229, 225, 219, 0.08)`–`rgba(229, 225, 219, 0.16)` | Rango de divisores decorativos. La transparencia solo se permite en elementos no textuales. |
| Bordes del HTML | `surface-variant` con opacidades `/30` y `/40` | Líneas decorativas de ficha/historial; las transparencias no se aplican al texto. |

La paleta original de HTML también define `#faba67` para `primary`/`surface-tint`; queda como valor legado del export y no como acento canónico de interfaz. Otros colores Material (`error`, `tertiary`, colores `*-fixed`, etc.) no se asignan a estados de obra.

**Estados elegidos (siempre con etiqueta visible):** `disponible` en `accent #c48b3c`; `reservada` en `status-reserved #ffb3ad`; `vendida` en `status-sold #d5c4b2`; `en colección` en `status-collection #e5e1e4`. Se acompañan siempre del texto del estado; el color nunca es el único indicador. Las etiquetas se componen sobre una superficie oscura opaca (`#0e0e10` o `#131315`).

**Unificación de duplicados:** `#131315` agrupa `background`, `surface` y `surface-dim`; `#e5e1e4` agrupa `on-surface` y `on-background`; `#c48b3c` es el único acento vigente; `#353437` agrupa `surface-variant` y `surface-container-highest`.

## 2. Tipografía

Familias enlazadas en los HTML exportados: **Bodoni Moda**, **Newsreader**, **Geist** y **Material Symbols Outlined** (iconografía). No se declara familia de respaldo.

**Entrega tipográfica en web:** Bodoni Moda 400 normal/itálica, Newsreader 400 normal/itálica y Geist 400/500 se autoalojan en WOFF2 con subconjuntos Latin y Latin-Ext bajo `web/public/fonts/`. Se conserva `font-display: swap`; cada familia incluye su licencia SIL OFL 1.1. No se solicitan fuentes a terceros en runtime.

| Estilo / uso | Familia | Tamaño | Peso | Interlineado | Tracking |
|---|---|---:|---:|---:|---:|
| `display-hero` — nombre en hero | Bodoni Moda | `5rem` | 400 | `5.25rem` | `-0.03em` |
| `display-hero-mobile` | Bodoni Moda | `2.75rem` | 400 | `3rem` | `-0.02em` |
| `headline-lg` — títulos de obra y sección | Bodoni Moda | `3.5rem` | 400 | `4rem` | `-0.02em` |
| `headline-lg-mobile` | Bodoni Moda | `2.25rem` | 400 | `2.75rem` | `-0.01em` |
| `headline-md` | Bodoni Moda | `2.25rem` | 400 | `2.75rem` | `-0.01em` |
| `headline-sm` — título de anotación/cuaderno | Bodoni Moda | `1.5rem` | 400 | `2rem` | `0` |
| `body-lg` — hero, cita y ensayo | Newsreader | `1.25rem` | 400 | `1.875rem` | `-0.01em` |
| `body-md` — texto editorial y valores técnicos | Newsreader | `1rem` | 400 | `1.625rem` | `0` |
| `label-technical` — ficha, navegación y botones | Geist | `0.75rem` | 500 | `1rem` | `0.08em` |
| `label-caption` — eyebrow, microetiqueta e inventario | Geist | `0.6875rem` | 400 | `0.875rem` | `0.06em` |

Usos complementarios visibles: el autor y citas pueden ir en cursiva; el nombre final del hero también combina cursiva y peso ligero (`font-light`). Los eyebrow suelen estar en mayúsculas y en acento. Los títulos de obra usan Bodoni; el cuerpo y las citas, Newsreader; los datos catalográficos, Geist. **Regla de contraste:** todo texto usa un token sólido a opacidad completa; queda prohibido aplicar `opacity`, colores alpha o transparencias al texto.

**Desajustes tipográficos entre fuentes:** el hero HTML superpone a `display-hero` los tamaños responsivos Tailwind `text-4xl`, `sm:text-6xl`, `md:text-7xl`, `lg:text-[5.5rem]` y `leading-[0.95]`; por ello el tamaño/interlineado efectivo no coincide siempre con el token declarado. `DESIGN.md` especifica para algunos valores de ficha `Newsreader 0.9375rem`, mientras el HTML los representa como `body-md` de `1rem`. El peso 600/700 está disponible en la URL de Google Fonts, pero no es el peso de los tokens de texto anteriores.

## 3. Espaciado, contenedores, radios y bordes

**Escala de espaciado explícita:** `space-xs 0.25rem`, `space-sm 0.5rem`, `space-md 1rem`, `space-lg 2rem`, `space-xl 4rem`; `gutter 2rem` (32 px), `gutter-mobile 1rem` (16 px), `margin 4rem` y `margin-mobile 1.5rem` (24 px). La descripción `DESIGN.md` amplía los huecos de sección hasta 8rem; en HTML aparece `space-y-32` / `py-32` (8rem, valor por defecto Tailwind).

**Anchos:** `max-w-7xl` en las páginas de catálogo equivale a 80rem (1280 px) con la escala por defecto de Tailwind; también aparecen `max-w-5xl` (64rem), `max-w-3xl` (48rem), `max-w-2xl` (42rem), `max-w-xl` (36rem) y `max-w-sm` (24rem). Son clases del export, no variables propias añadidas al tema. La cuadrícula editorial es de 12 columnas; en el catálogo se distribuyen habitualmente obra 7 / ficha 5.

**Radios y bordes:** token vigente `0` en toda la interfaz, según decisión acordada y `DESIGN.md`; los radios distintos que declara el Tailwind original quedan descartados. Bordes de interfaz finos: 1 px en divisores/contornos donde se declara; separadores de ficha mediante líneas horizontales. Inventario: borde `carmine-border` sólido de 1 px. No se establece una sombra de elevación uniforme: los HTML incluyen sombras fuertes en visor/tarjetas pese a que `DESIGN.md` desaconseja sombras estándar.

## 4. Patrones de componente

- **Cabecera unificada (todas las pantallas) y menú móvil «Sala Oscura · Índice General» (`design/alejandro_menu/`):** una única franja superior sobre `surface-lowest` con borde inferior `outline-variant`: a la izquierda el enlace a inicio con la marca del artista (`Alex Tellería`, `headline-sm` uppercase `on-surface`) y `artistIdentification` (`label-caption` uppercase `on-surface-variant`); en tablet y escritorio (`≥768px`), la navegación localizada (`HomeNavigation` en Geist `label-technical` uppercase) en el centro; y a la derecha, siempre fuera del menú en todos los tamaños de pantalla, el conmutador `ES / EN` (`LanguageSwitcher` enmarcado sobre `surface-container-low` con borde `outline-variant`, resaltando el idioma activo con `bg-primary text-on-primary` para que su función sea evidente al instante). En móvil (`<768px`), junto al selector `ES / EN` se presenta el disparador `[ ÍNDICE ≡ ]` (`h-11`), que abre mediante Popover API nativa (`popover="auto"`) el panel a pantalla completa sobre `surface-container-lowest`: cabecera con eyebrow `SALA OSCURA · ÍNDICE GENERAL` y botón `[ CERRAR × ]`; índice curatorial con tarjetas en `surface-container-low` (título en Bodoni `headline-md`, subtítulo descriptivo en Newsreader cursiva y metadato real entre corchetes `[ N LIENZOS ]`, `[ N SERIES ]`, `[ AAAA ]`, `[ VIGO ]`); bloque de obra destacada en custodia con `InventoryNumber` y datos reales; y pie de correspondencia directa (`consultas@artelleria.com`) con selector de idioma explícito. Se omite la barra inferior de iconos tipo app para preservar la limpieza museística.
- **Pie (estimado a partir de la captura):** cierre de ancho completo sobre `surface-lowest`, separado del contenido por un divisor fino. La referencia sugiere agrupación editorial en columnas en escritorio y apilado en móvil; para la fundación se reduce a la marca del artista, sin inventar texto biográfico ni enlaces de navegación. Tipografía y colores proceden de los tokens de encabezado, etiqueta y texto.
- **Cabecera / navegación:** la captura del portfolio muestra una franja de navegación oscura compacta con nombre/índice y enlaces pequeños en Geist uppercase. El fragmento HTML de portfolio no contiene esa cabecera global, así que su composición exacta queda **estimada solo visualmente**. En páginas de obra aparece una barra de breadcrumb: fondo `surface-lowest`, `gutter`, `space-sm` vertical y Geist técnico uppercase. Texto con token sólido y contraste AA; acciones sobre `surface-low`.
- **Enlace de salto al contenido:** primer control del documento, oculto visualmente hasta recibir foco de teclado; enlaza al `<main>`. En foco se presenta con superficie `surface-container-lowest`, texto `on-surface`, outline `primary` y padding `space-md`; el patrón usa solo tokens existentes y texto ES/EN de i18n.
- **Botón primario:** mide `h-11` (44 px), padding horizontal `space-md`, Geist técnico en mayúsculas, fondo `accent #c48b3c` y texto `on-accent #0e0e10` (6.52:1 sobre `#c48b3c`). Hover carmín cambia borde/superficie, no el color del texto; si el fondo pasa a `carmine-surface`, el texto hover es `secondary #ffb3ad` (5.28:1).
- **Botón secundario:** fondo `surface-container` o `surface-low`, texto `on-surface`, Geist uppercase, padding compacto; hover hacia `surface-container-high` o superficie/borde carmín. El texto hover permanece `secondary`, sin opacidad.
- **Filtros por corpus:** banda horizontal sobre `surface-lowest` con `gutter`, etiqueta “Serie activa”, filtro por corpus alineado al lado opuesto, Geist uppercase, estado activo en `accent` y separadores `/` decorativos. En anchura estrecha los controles hacen wrap.
- **Ficha técnica:** bloque en `surface-low` con padding `space-md`; título/índice en Geist; filas etiqueta/valor, etiquetas en `text-muted` sólido y valores en Newsreader cursiva `on-surface`. El HTML del catálogo separa filas con borde inferior; el detalle usa filas alternas sobre `surface-lowest/40`. `DESIGN.md` la llama bloque sin borde y propone valores `0.9375rem`; queda anotada la diferencia. No reducir opacidad de etiquetas.
- **Etiqueta de número de inventario:** sobreimpresa arriba a la derecha de la imagen; fondo **opaco** `#0e0e10`, texto `on-surface #e5e1e4`, borde sólido `carmine-border #ffb3ad` de 1 px, padding horizontal `0.625rem` y vertical `0.25rem`, Geist caption uppercase. La placa opaca desacopla el contraste del contenido de la obra.
- **Bloque de anotación del cuaderno:** panel oscuro (`surface-container` para la anotación del visor; `surface-lowest` para la hoja de cuaderno), padding `space-md` o `space-lg`; cabecera Geist caption/technical y fecha, título Bodoni `headline-sm`, cita Newsreader `body-md` cursiva `on-surface-variant`. El control “Siguiente [+]” permanece como etiqueta Geist pequeña.
- **Catálogo de Obra y Series, tarjeta enriquecida y bloque de series (Spec 002, revisión 2026-10-26):**
  - **Cabecera de Obra y Series (`/obras/` y `/en/works/`):** cuadrícula de 12 columnas sobre `surface-container-lowest`. En las 8 columnas izquierdas se muestra un eyebrow en Geist `label-technical` uppercase (`primary`), el `h1` en Bodoni `headline-lg-mobile` / `headline-lg` (`Obra pictórica y series de estudio`, con la conjunción en cursiva `on-surface-variant`) y la descripción SEO global opcional en Newsreader `body-lg` (`on-surface-variant`). En las 4 columnas derechas se sitúa un panel sobre `surface-container-low` (`p-space-md`) con el recuento real calculado en build: total de obras visibles, número de series activas y desglose por estado de disponibilidad.
  - **Barra de navegación por series (`#series-directory`):** banda horizontal sobre `surface-container` con enlaces semánticos (`<a>`) en Geist `label-technical` uppercase: opción «Todas las series» hacia el catálogo general y enlaces a cada serie visible (`/series/[id]/` o `/en/series/[id]/`). La opción activa usa `bg-on-surface text-surface-container-lowest` y las demás `bg-surface-container-high text-on-surface hover:bg-surface-bright`. Se reutiliza también en la página de cada serie para resaltar la serie activa y volver al catálogo general. Sin filtros ni JavaScript de cliente.
  - **Tarjeta de obra enriquecida (`ArtworkCard`):** contenedor en `surface-container-low` con padding `space-md` (una columna en móvil y cuatro de las ocho/doce columnas en tablet/escritorio). La figura usa `surface-container-lowest`, `EditorialImage` (`loading="lazy"` por defecto) y una placa superior izquierda en `surface-container-lowest` (`px-space-sm py-space-xs`) con `AvailabilityLabel`. Bajo la imagen presenta: línea de referencia en `label-technical` (`on-surface-variant`) con nombre de serie (si existe) y `InventoryNumber` junto al año en `label-caption` (`primary`); título enlazado a la ficha en `headline-sm` uppercase (`on-surface`); rejilla compacta de datos reales publicados (`Soporte`, `Técnica`, `Dimensiones`); nota del cuaderno de taller en `body-md` cursiva (`on-surface-variant`) si existe; y pie con enlace identificable hacia la ficha publicada.
  - **Bloque de Series de estudio en `/obras/`:** sección sobre `surface-container` debajo de la cuadrícula de obras que presenta cada serie visible en cuadrícula de 12 columnas con su nombre (`headline-md`), descripción editorial opcional (`body-lg`), imagen opcional validada (`EditorialImage`), número de obras visibles asociadas y botón/enlace hacia su página `/series/[id]/`.
  - **Cierre hacia contacto:** al final de `/obras/` se reutiliza el bloque editorial `HomeContactSection` hacia la ruta localizada de contacto. No se incluyen modales, descargas PDF, filtros JS ni formularios embebidos.
- **Archivo Retrospectivo de Exposiciones (Spec 004, revisión 2026-10-26):**
  - **Cabecera de Exposiciones (`/exposiciones/` y `/en/exhibitions/`):** cuadrícula de 12 columnas sobre `surface-container-lowest`: en 8 columnas a la izquierda, eyebrow en Geist `label-technical` uppercase (`primary`) y `h1` en Bodoni `display-hero-mobile` / `display-hero` (`Exposiciones & Trayectoria`); en 4 columnas a la derecha, descripción funcional en `body-md` (`on-surface-variant`) e indicadores reales en `label-technical` (`primary`) con el número de exposiciones visibles y el rango de años activo.
  - **Entrada de Archivo Retrospectivo (12 columnas):** cada exposición visible se presenta como un `<article>` en cuadrícula de 12 columnas sobre `surface-container-low` (`p-space-lg`): columna izquierda (3 columnas) con el año de inicio en `display-hero-mobile` / `headline-lg` (`primary`) y el intervalo de fechas localizadas en `label-technical` uppercase (`on-surface-variant`); columna central (6 columnas) con el título enlazado a su página propia en `headline-sm` uppercase (`on-surface`), lugar/sede en `label-technical` uppercase (`primary`) y enlaces a obras o series visibles relacionadas si existen; columna derecha (3 columnas sobre `surface-container-lowest` con padding `space-md`) con la imagen opcional validada de la exposición (`EditorialImage`) si existe y enlace identificable hacia `/exposiciones/[id]/` (`/en/exhibitions/[id]/`).
  - **Cierre hacia contacto:** al final de `/exposiciones/` se reutiliza `HomeContactSection`. Se omiten filtros por tipología, citas de prensa inventadas, ISBNs, sección de catálogos físicos y bloque de pólizas/embalajes.
- **Página de consultas, revisión propuesta Spec 005 (2026-10-26):** adaptar la composición a la referencia nueva sin copiar sus datos/copy inventados ni ampliar el tratamiento del formulario.
  - **Cabecera editorial:** bajo la cabecera global existente, banda de contenido en 12 columnas: título localizado `Consultas sobre obras` en Bodoni `headline-lg-mobile` / `headline-lg` (`on-surface`) en 8 columnas y `contactIntro` aprobado en Newsreader `body-md` (`on-surface-variant`) en 4 columnas. Divisor inferior `outline-variant`; sin dirección de estudio, cita, horario o promesa nuevos.
  - **Cuerpo 5/7:** en escritorio, columna izquierda de 5 columnas para el canal verificado (`consultas@artelleria.com`, con texto i18n existente) y el aviso de privacidad completo y aprobado antes del formulario; columna derecha de 7 columnas para el formulario actual sobre `surface-container` con padding `space-lg`/`space-xl`. En móvil/tablet ambas columnas se apilan con el aviso antes de los campos. El texto legal se conserva completo y no se sustituye por un resumen.
  - **Campos:** conservar exactamente nombre, email, institución opcional, teléfono opcional, obra asociada opcional, mensaje y Turnstile. Labels en Geist `label-technical`; inputs con fondo transparente, texto Newsreader `body-md`, y solo borde inferior `outline-variant` que pasa a `primary` al foco, usando alturas/espaciado existentes. Mantener errores, resumen, estados live, límites y operación actual sin regresiones.
  - **Cierre:** enlaces localizados a Obras y Series (`/obras/` o `/en/works/`) y Textos Críticos (`/textos-criticos/` o `/en/critical-texts/`) como navegación normal, solo si los destinos existen. No se incorpora FAQ de la referencia porque sus respuestas no están aprobadas como contenido del artista.
  - **Límites de fidelidad:** no incluir motivos comerciales (adquisición, precio, compra), consentimiento/confidencialidad obligatorio, dirección física, horario, aforo, garantías, protocolos de conservación/transporte, citas, ISBN/catálogos, promesas de respuesta de 72 h, claims de cifrado/SSL ni FAQ; la referencia contiene esos datos pero no están aprobados por la Spec 005. No añadir campos, servicios, JS nuevo ni dependencias.
  - **Responsive:** `<768px` una columna, `768–1279px` ocho columnas y `≥1280px` doce columnas; no crear tokens ni variar `@theme`.
  - **Privacidad:** el aviso legal aprobado permanece íntegro y se presenta antes de que los controles recopilen datos, conforme a RF-9.
  - **Interfaz:** mantener el patrón de una columna con superficie base `surface-container-lowest` y bloque de formulario en `surface-low` o `surface-container` como variante ya aprobada; la nueva distribución 5/7 queda pendiente de aprobación explícita antes de implementarse.
  - **Campos:** cada control tiene etiqueta visible en `label-technical`/`on-surface`; instrucciones en `body-md`/`on-surface-variant`; superficie opaca `surface-container-high`, texto `on-surface` y borde no textual `outline`. No se usan valores arbitrarios ni opacidad.
  - **Errores:** mensaje localizado junto al campo, texto explícito en `secondary` sobre superficie oscura, asociado mediante `aria-describedby` y estado inválido del control. El color/borde no es el único indicador. Un aviso general de resultado se anuncia con una región viva accesible.
  - **Aviso y derechos:** bloque informativo localizado, enlazado/relacionado de forma accesible con el aviso completo; presenta la base jurídica y el canal para ejercer derechos. No se muestra una casilla obligatoria de consentimiento para el tratamiento basado en interés legítimo. El texto legal procede de i18n únicamente cuando la persona responsable lo haya confirmado y aprobado.
  - **Protección antispam:** el control Turnstile permanece en el flujo del formulario y tiene instrucciones/errores localizados; el widget no sustituye etiquetas, mensajes de estado ni navegación por teclado.
  - **Acción y confirmación:** botón primario con el patrón existente de 44 px (`h-11`, `primary`/`on-primary`); foco con el patrón existente `focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary`. Los valores se conservan en errores y reintentos; solo la aceptación del envío muestra confirmación y limpia los campos. La confirmación usa texto sólido y se anuncia accesiblemente.
  - **Revisión local pendiente:** mientras el aviso esté en borrador, mostrar el estado pendiente de forma visible, no aceptar envíos y mantener deshabilitada la acción con superficie `surface-container-high` y texto `on-surface-variant` (sin opacidad). Este estado es solo para builds locales de revisión; no se despliega.
  - **Localización:** todas las etiquetas, instrucciones, estados y errores proceden de i18n ES/EN. No se crean tokens de color, tipografía, espaciado, radio o breakpoint para este patrón.
- **Enlace de consulta desde ficha (Spec 005):** acción de texto situada junto a la información técnica, con etiqueta localizada en `label-technical`, color sólido `primary`, subrayado y foco visible `focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary`. El enlace aporta contexto de consulta y no expresa oferta, disponibilidad ni reserva.
- **Enlace de contacto en el pie (Spec 005):** enlace localizado junto a la marca existente, con `label-technical`, texto sólido `on-surface`, subrayado y el mismo foco visible. No se añaden columnas, texto biográfico ni tokens nuevos.
- **Home editorial asimétrica (revisión Spec 006, 2026-10-26):**
  - **Navegación superior y Hero:** la navegación localizada de la home se ubica al inicio de `<main>` (encima del hero) con enlaces Geist `label-technical` uppercase, subrayado discreto, foco visible y wrap en móvil. El hero se compone sobre `surface-container-lowest` en una cuadrícula de 12 columnas: la fila superior presenta el `h1` en 9 columnas con el nombre partido en tres líneas (`display-hero-mobile` / `display-hero`, nombre y primer apellido en mayúsculas `on-surface`, segundo apellido en cursiva minúscula `font-light on-surface-variant`) y `artistIdentification` alineado al borde inferior derecho en 3 columnas (`label-technical` / `body-lg`, `on-surface`). La fila inferior del hero sitúa la presentación opcional aprobada en 7 columnas (`body-lg`, `on-surface-variant`, `max-w-2xl`) y dos botones de acción en 5 columnas alineados a la derecha en escritorio (botón primario hacia el catálogo de obras y botón secundario hacia contacto).
  - **Obras seleccionadas en bloques curatoriales alternados (12 columnas):** cada una de las hasta tres obras seleccionadas se presenta con el bloque curatorial completo de 12 columnas (`EditorialImage` en 7 columnas sobre `surface-container-lowest` con `InventoryBadge` sobreimpreso arriba a la derecha + columna curatorial en 5 columnas), con espaciado vertical amplio entre obras (`space-xl`). En escritorio (`≥1280px`), las obras impares (1.ª y 3.ª) sitúan la imagen a la izquierda y la columna curatorial a la derecha (`desktop:pl-space-md`), mientras que la obra par (2.ª) invierte las columnas (`desktop:order-1` para la columna curatorial a la izquierda con `desktop:pr-space-md` y `desktop:order-2` para la imagen a la derecha); en móvil y tablet la imagen precede siempre a la ficha. La columna curatorial contiene: enlace de serie en Geist `label-technical` uppercase (`primary`), título de obra en Bodoni `headline-lg-mobile` / `headline-lg` (`on-surface`), línea de autor y año en Newsreader `body-md` cursiva (`on-surface-variant`), `ArtworkTechnicalSheet` sobre `surface-container-low`, nota del cuaderno de taller (si existe en el idioma activo) como microetiqueta `label-caption` uppercase + `blockquote` en `body-lg` cursiva `on-surface-variant` con borde izquierdo `primary`, y pie de acciones con botón primario hacia la ficha de la obra y botón secundario hacia la consulta contextualizada en contacto.
  - **Exposiciones seleccionadas:** sección sobre `surface-container-lowest` con cabecera editorial dividida por borde inferior (`outline-variant`), eyebrow en Geist `label-technical` uppercase (`primary`), título en Bodoni `headline-md` y enlace al índice de exposiciones. Cada exposición se presenta como fila de 12 columnas separada por divisores `outline-variant`: fecha localizada en 2–3 columnas (`label-technical` uppercase `primary`), título enlazado en 5–6 columnas (`headline-sm` `on-surface`) y lugar en 4 columnas alineado a la derecha en escritorio (`label-technical` `on-surface-variant`). El bloque se omite si no hay exposiciones válidas en esa locale.
  - **Cierre hacia contacto:** sección final sobre `surface-container` en cuadrícula de 12 columnas con eyebrow en `label-technical` uppercase (`primary`), título en `headline-md` (`on-surface`), texto informativo localizado en `body-md` (`on-surface-variant`) orientado a consultas artísticas, curatoriales e institucionales, y botón primario hacia la ruta localizada de contacto. No incluye formulario embebido ni JavaScript de cliente.
  - **Límites:** no se muestran textos de muestra, coordenadas, citas intermedias, bloque poético con porcentajes, muestras de pigmento, zoom/copiar con JS, filtros interactivos, dossier, precios ni acciones de adquisición. Se usan únicamente colores, familias, espaciados, breakpoints y focos ya definidos; no se crean valores nuevos ni se cambia `@theme`.
- **Ficha de Obra renovada y Visor Sala Oscura a pantalla completa (Spec 003, revisión 2026-10-26):**
  - **Barra curatorial superior:** banda sobre `surface-container-lowest` con divisor inferior `outline-variant`: a la izquierda, migas de pan (`<nav>`) en Geist `label-technical` uppercase (`on-surface-variant`, enlaces a `/obras/` y `/series/[id]/`, y `on-surface` para el `InventoryNumber`); a la derecha, botones secundarios en `surface-container-low` con texto `on-surface` (`hover:bg-surface-container-high`) para **«Examinar en Sala Oscura»** y **«Citar obra»** (copia referencia catalográfica real al portapapeles con confirmación accesible en región viva).
  - **Visor interactivo en ficha (7 columnas en escritorio) y columna curatorial (5 columnas):** el escenario (`aspect-3/4` sobre `surface-dim` / `surface-container-lowest`) contiene la `EditorialImage` (`loading="eager"`), `InventoryBadge` arriba a la derecha, placa opaca inferior con dimensiones y soporte reales, y superposiciones opcionales de iluminación (`Galería` / `Taller Rasante`) y retícula milimétrica. Debajo del lienzo, barra de controles en `surface-container-low` (`p-space-sm`) para ampliación (`-`, porcentaje, `+`, `Restablecer`), iluminación (`Galería` / `Taller Rasante`) y `Retícula` (estado activo con `bg-primary text-on-primary`, inactivo con `bg-surface-container text-on-surface`). En la columna derecha (5 columnas): eyebrow (`InventoryNumber · Serie`), `h1` en `headline-lg-mobile` / `headline-lg`, enlace de serie y autoría, `ArtworkTechnicalSheet`, acciones hacia contacto contextualizado y Sala Oscura, e **Historial de exposición** real (si la obra participa en exposiciones publicadas en el idioma).
  - **Sección de Análisis Crítico y Cuaderno de Taller:** cuando existen `workshopNote` o textos críticos asociados publicados en el idioma, banda editorial sobre `surface-container-low` (12 columnas) que agrupa los textos críticos y la hoja de cuaderno de taller (`surface-container-lowest`, `p-space-lg`, borde izquierdo `primary`).
  - **Diálogo dentro del ciclo (Siguiente pieza en la secuencia):** al final de la ficha, sección sobre `surface-container-lowest` que enlaza a la serie completa (con el conteo real de obras visibles) y, si la serie cuenta con otra obra publicada en el idioma, presenta su tarjeta horizontal en 12 columnas (`surface-container-low`, imagen en 5 columnas y datos catalográficos reales en 7 columnas con enlace a su ficha).
  - **Modal Visor Sala Oscura a pantalla completa (`role="dialog"`, `aria-modal="true"`):** capa fija (`fixed inset-0 z-50 bg-surface-container-lowest text-on-surface`) activable desde el botón superior, el lienzo o el panel de acciones, y cerrable con el botón `Cerrar Sala Oscura [ESC]` (`bg-secondary-container text-secondary`) o la tecla `Escape`. Incluye cabecera con identificación real de la obra y controles de iluminación (`Galería` / `Taller Rasante`), zoom (`-`, porcentaje, `+`, `1:1 Escala`) y retícula milimétrica; viewport central con zoom, desplazamiento por arrastre (pan) o teclado y **Minimapa (`Minimap Viewport`)** en esquina inferior izquierda con recuadro `border-primary` sincronizado; y pie informativo con los datos reales de Sanity (`Técnica`, `Soporte`, `Dimensiones`, `Nota de taller` opcional, `InventoryNumber`, `Serie`, `Año` y `AvailabilityLabel`). Se omiten hotspots inventados, modo UV, marco simulado, pigmentos, micrografías, PDFs y telemetría de sensor.

## 5. Breakpoints y comportamiento responsive

- Rangos normativos mobile-first según `DESIGN.md`:

  | Rango | Comportamiento y espaciado |
  |---|---|
  | Móvil: `<768px` | Una columna; margen lateral `1.5rem`. |
  | Tablet: `768–1279px` | 8 columnas; gutter `1.5rem`. |
  | Escritorio: `≥1280px` | 12 columnas asimétricas; gutter `2rem`. |
- El HTML original usa variantes Tailwind `sm:`, `md:` y `lg:` sin redefinir `screens`; sus valores por defecto (`640/768/1024px`) no son normativos para esta guía. Para nuevas implementaciones prevalecen los rangos de `DESIGN.md` y se aplican mobile-first.
- Comportamientos explícitos: hero/fichas apilados en móvil, navegación de obra en columna bajo `md`, listas y contenido con wrap; visor de obra con proporción `3/4`; mosaico siguiente pasa a 12 columnas desde `md`; microgalería cambia de 2 a 4 columnas desde `sm`.

## 6. Contraste y problemas detectados

Ratios calculados con la fórmula WCAG 2.x y colores sólidos. AA exige `4.5:1` para texto normal y `3:1` para texto grande. No se admite texto translúcido ni composición alpha. Los textos se limitan a las combinaciones prescritas en esta sección.

| Caso | Contraste | Evaluación / propuesta |
|---|---:|---|
| `on-surface #e5e1e4` sobre superficies oscuras `#0e0e10`–`#39393b` | **8.90:1 mínimo** (`#39393b`) | Cumple AA en todas las superficies oscuras declaradas. |
| `text-muted #d5c4b2` sobre superficies oscuras `#0e0e10`–`#39393b` | **6.79:1 mínimo** (`#39393b`) | Cumple AA; opacidad 100%. |
| `accent #c48b3c` para texto de estado sobre `#131315` | **6.28:1** | Cumple AA; el estado «Disponible» lleva además etiqueta visible. No usar acento como texto sobre `#353437`/`#39393b` (4.19:1/3.90:1). |
| Etiquetas de estado sobre `#131315`: disponible `#c48b3c`, reservada `#ffb3ad`, vendida `#d5c4b2`, en colección `#e5e1e4` | **6.28:1 / 10.87:1 / 10.93:1 / 14.33:1** | Todas pasan AA; cada una incluye además su etiqueta textual explícita. |
| `on-accent #0e0e10` sobre fondo `accent #c48b3c` | **6.52:1** | Cumple AA para el botón primario. |
| `secondary #ffb3ad` sobre fondos oscuros hasta `#39393b` | **6.75:1 mínimo** (`#39393b`) | Cumple AA; color de texto permitido en hover carmín. |
| `secondary #ffb3ad` sobre `carmine-surface #8c1f20` | **5.28:1** | Cumple AA para texto de hover sobre la superficie carmín. |
| Placa de inventario: `on-surface #e5e1e4` sobre fondo opaco `#0e0e10` | **14.90:1** | Cumple AA; el borde carmín `#ffb3ad` es sólido y no afecta a la legibilidad del texto. |
| Texto legado `#68010a` sobre oscuro y hover de texto `#8f2222` sobre `#060607` | **1.47:1 / 2.33:1** | No cumplen AA; quedan retirados como colores de texto. El carmín profundo se limita a superficie/borde, y el texto hover usa `secondary`. |

**Resultado:** todas las combinaciones de texto aprobadas y enumeradas arriba cumplen WCAG AA para texto normal, con un mínimo de **5.28:1**. Se excluyen expresamente de texto las combinaciones de bajo contraste y el token decorativo `outline #9d8e7e`; no usar colores de texto sobre superficies no indicadas. La decisión visual de la cabecera sigue siendo una estimación de la captura porque su HTML no está en el export.

## 7. Mapeo a Tailwind CSS v4

Este mapeo es la fuente normativa para `@theme` de `web/src/styles/global.css`. Los nombres semánticos de color y tipografía siguen los del export de Stitch; cuando una decisión posterior cambió un valor, prevalece el valor canónico de este documento. No se deben recrear con utilidades arbitrarias ni valores hardcodeados.

### Colores

| Variable `@theme` | Valor canónico | Notas |
|---|---|---|
| `--color-background`, `--color-surface`, `--color-surface-dim` | `#131315` | Aliases del fondo base. |
| `--color-surface-container-lowest` | `#0e0e10` | Superficie más oscura. |
| `--color-surface-container-low` | `#1b1b1d` | Superficie baja. |
| `--color-surface-container` | `#201f21` | Superficie base de panel. |
| `--color-surface-container-high` | `#2a2a2c` | Superficie alta. |
| `--color-surface-variant`, `--color-surface-container-highest` | `#353437` | Aliases de superficie elevada. |
| `--color-surface-bright` | `#39393b` | Superficie brillante. |
| `--color-on-surface`, `--color-on-background` | `#e5e1e4` | Texto principal. |
| `--color-on-surface-variant` | `#d5c4b2` | Texto secundario y metadatos, sólido. |
| `--color-outline` | `#9d8e7e` | Solo elementos no textuales. |
| `--color-outline-variant` | `#504538` | Solo divisores y contornos decorativos. |
| `--color-primary`, `--color-primary-container` | `#c48b3c` | Acento canónico; sustituye al valor antiguo de Stitch para `primary`. |
| `--color-on-primary` | `#0e0e10` | Texto sobre superficies `primary`. |
| `--color-secondary`, `--color-status-reserved`, `--color-carmine-border` | `#ffb3ad` | Alias para secundario, estado reservado y borde carmín. |
| `--color-secondary-container`, `--color-carmine-surface` | `#8c1f20` | Superficie carmín, nunca texto. |
| `--color-status-sold` | `#d5c4b2` | Estado vendido, siempre con etiqueta textual. |
| `--color-status-collection` | `#e5e1e4` | Estado en colección, siempre con etiqueta textual. |

Los valores antiguos `#faba67` (`primary`) y `#68010a` (`on-secondary`) del export no se usan como tokens canónicos de interfaz ni como colores de texto.

### Tipografía y espaciado

| Variables de familia `@theme` | Familia |
|---|---|
| `--font-display-hero`, `--font-display-hero-mobile`, `--font-headline-lg`, `--font-headline-lg-mobile`, `--font-headline-md`, `--font-headline-sm` | Bodoni Moda |
| `--font-body-lg`, `--font-body-md` | Newsreader |
| `--font-label-technical`, `--font-label-caption` | Geist |

Las variables `--text-*` usan estos mismos nombres de estilo: `display-hero`, `display-hero-mobile`, `headline-lg`, `headline-lg-mobile`, `headline-md`, `headline-sm`, `body-lg`, `body-md`, `label-technical` y `label-caption`. Sus modificadores `--line-height`, `--letter-spacing` y `--font-weight` usan exactamente los valores de la tabla de la sección **2. Tipografía**.

- Variables `--spacing-*`: reflejan exactamente la escala `space-*`, `gutter`, `gutter-mobile`, `margin` y `margin-mobile` de la sección **3. Espaciado, contenedores, radios y bordes**.

### Breakpoints y radio

| Variable `@theme` | Valor | Rango resultante |
|---|---:|---|
| `--breakpoint-tablet` | `48rem` (768 px) | Tablet desde 768 px; hasta antes de escritorio. |
| `--breakpoint-desktop` | `80rem` (1280 px) | Escritorio desde 1280 px. |
| `--radius-interface` | `0px` | Único radio de interfaz; todas las esquinas son rectas. |

Los estilos base son mobile-first por debajo de 768 px; `tablet` y `desktop` redefinen los cortes de Tailwind conforme a `DESIGN.md`. No se usan los breakpoints predeterminados de Tailwind (`sm`, `md`, `lg`, etc.) para definir el diseño. No se admiten radios distintos de `--radius-interface`.
