# Tokens de diseño — AF Tellería

## Changelog

- **2026-10-07:** decisiones acordadas: acento canónico `#c48b3c`, radios `0`, breakpoints mobile-first de `DESIGN.md`, texto siempre sólido, inventario con placa opaca y contraste AA, carmín limitado a bordes/superficies, y estados de obra con etiqueta textual y colores verificados.
- **2026-10-07:** se documentan como estimados los patrones base de cabecera y pie; se explicitan los tres rangos responsive mobile-first, incluido tablet.
- **2026-10-07:** se añade el mapeo normativo a variables `@theme` de Tailwind CSS v4; los nombres semánticos conservan los del export de Stitch y los valores siguen las decisiones vigentes.
- **2026-10-08:** se actualiza la ruta del tema de Tailwind tras separar el repositorio en `web/` y `studio/`.

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

- **Cabecera (estimado a partir de la captura):** franja compacta sobre `surface-lowest`, con marca del artista a un lado y selector ES/EN al otro. Marca y selector usan los tokens tipográficos de etiqueta/título, texto sólido `on-surface` y selección activa `accent`. En móvil pueden ajustarse en varias líneas para evitar desbordamiento. No se deduce de la captura una navegación obligatoria.
- **Pie (estimado a partir de la captura):** cierre de ancho completo sobre `surface-lowest`, separado del contenido por un divisor fino. La referencia sugiere agrupación editorial en columnas en escritorio y apilado en móvil; para la fundación se reduce a la marca del artista, sin inventar texto biográfico ni enlaces de navegación. Tipografía y colores proceden de los tokens de encabezado, etiqueta y texto.
- **Cabecera / navegación:** la captura del portfolio muestra una franja de navegación oscura compacta con nombre/índice y enlaces pequeños en Geist uppercase. El fragmento HTML de portfolio no contiene esa cabecera global, así que su composición exacta queda **estimada solo visualmente**. En páginas de obra aparece una barra de breadcrumb: fondo `surface-lowest`, `gutter`, `space-sm` vertical y Geist técnico uppercase. Texto con token sólido y contraste AA; acciones sobre `surface-low`.
- **Botón primario:** mide `h-11` (44 px), padding horizontal `space-md`, Geist técnico en mayúsculas, fondo `accent #c48b3c` y texto `on-accent #0e0e10` (6.52:1 sobre `#c48b3c`). Hover carmín cambia borde/superficie, no el color del texto; si el fondo pasa a `carmine-surface`, el texto hover es `secondary #ffb3ad` (5.28:1).
- **Botón secundario:** fondo `surface-container` o `surface-low`, texto `on-surface`, Geist uppercase, padding compacto; hover hacia `surface-container-high` o superficie/borde carmín. El texto hover permanece `secondary`, sin opacidad.
- **Filtros por corpus:** banda horizontal sobre `surface-lowest` con `gutter`, etiqueta “Serie activa”, filtro por corpus alineado al lado opuesto, Geist uppercase, estado activo en `accent` y separadores `/` decorativos. En anchura estrecha los controles hacen wrap.
- **Ficha técnica:** bloque en `surface-low` con padding `space-md`; título/índice en Geist; filas etiqueta/valor, etiquetas en `text-muted` sólido y valores en Newsreader cursiva `on-surface`. El HTML del catálogo separa filas con borde inferior; el detalle usa filas alternas sobre `surface-lowest/40`. `DESIGN.md` la llama bloque sin borde y propone valores `0.9375rem`; queda anotada la diferencia. No reducir opacidad de etiquetas.
- **Etiqueta de número de inventario:** sobreimpresa arriba a la derecha de la imagen; fondo **opaco** `#0e0e10`, texto `on-surface #e5e1e4`, borde sólido `carmine-border #ffb3ad` de 1 px, padding horizontal `0.625rem` y vertical `0.25rem`, Geist caption uppercase. La placa opaca desacopla el contraste del contenido de la obra.
- **Bloque de anotación del cuaderno:** panel oscuro (`surface-container` para la anotación del visor; `surface-lowest` para la hoja de cuaderno), padding `space-md` o `space-lg`; cabecera Geist caption/technical y fecha, título Bodoni `headline-sm`, cita Newsreader `body-md` cursiva `on-surface-variant`. El control “Siguiente [+]” permanece como etiqueta Geist pequeña.

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
