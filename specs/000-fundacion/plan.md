# Plan 000 — Fundación

**Spec de referencia:** 000-fundacion, aprobada.

## Alcance del plan

Publicar una fundación estática y mínima con home ES/EN, layout base, selector, 404 bilingüe y despliegue automático desde la rama principal. No incluye contenido editorial de obras o series, consultas, modelos de dominio ni mappers.

## Archivos y responsabilidades

El repositorio no contiene aún `package.json`, configuración Astro ni `src/`; estos archivos y directorios se crearían dentro de la estructura ya declarada.

| Archivo | Acción | Responsabilidad / cobertura |
|---|---|---|
| `package.json` | Crear | Dependencias fijadas y scripts `lint`, `check`, `test`, `build` y `verify`. `verify` ejecuta una sola secuencia: lint → tipos → tests → build. RF-14, RF-24. |
| `pnpm-lock.yaml` | Crear | Fijar las versiones resueltas para instalaciones repetibles. RF-24. |
| `astro.config.mjs` | Crear | Configurar generación estática e integración de Tailwind v4 con Vite. RF-14, RF-24. |
| `tsconfig.json` | Crear | Configuración de comprobación de tipos para el proyecto. RF-24. |
| `eslint.config.js` | Crear | Reglas y alcance del lint. RF-24. |
| `vitest.config.ts` | Crear | Configuración de Vitest para pruebas de localización y comportamiento puro. RF-24. |
| `src/styles/global.css` | Crear | Importar Tailwind v4, declarar `@theme` de acuerdo con `design/tokens.md` y aplicar las reglas globales del layout. RF-21, RNF-2, RNF-3. **Modificar `@theme` requiere aprobación previa.** |
| `src/i18n/es.ts`, `src/i18n/en.ts` | Crear | Textos ES/EN para la marca, home, selector y 404; sin contenido inventado. RF-1, RF-18, RF-22, RF-23, RNF-1. |
| `src/i18n/index.ts` | Crear | Tipos y acceso a los mensajes por idioma y por las rutas acordadas. RF-1, RF-17–RF-20. |
| `src/i18n/messages.test.ts` | Crear | Comprobar que ES y EN contienen exactamente las mismas claves y probar la selección de idioma. RF-17–RF-20, RF-24. |
| `src/layouts/BaseLayout.astro` | Crear | Documento común, atributo `lang`, metadatos, canonical, hreflang de la home, estilos y composición de cabecera, contenido y pie. RF-18–RF-21, RNF-1–RNF-5. |
| `src/components/SiteHeader.astro` | Crear | Marca del artista y selector; sin enlaces de navegación. RF-19, RF-21, RNF-2, RNF-3. |
| `src/components/LanguageSwitcher.astro` | Crear | Enlaces nativos entre `/` y `/en/`, con idioma actual indicado y nombres accesibles. RF-1, RF-17–RF-19, RNF-1, RNF-2. |
| `src/components/SiteFooter.astro` | Crear | Pie minimalista con la marca, de acuerdo con el patrón estimado, sin texto editorial inventado ni enlaces de navegación. RF-21, RNF-3. |
| `src/pages/index.astro` | Crear | Home española en `/`, con nombre y «Pintor · Vigo, Galicia». RF-1, RF-17, RF-20, RF-22, RNF-4, RNF-5. |
| `src/pages/en/index.astro` | Crear | Home inglesa en `/en/`, con la traducción correspondiente. RF-1, RF-17–RF-20, RF-22, RNF-1, RNF-4, RNF-5. |
| `src/pages/404.astro` | Crear | Página 404 bilingüe, con enlaces a ambas homes y estado HTTP 404. RF-18, RF-23, RNF-2, RNF-5. |
| `MEMORY.md` | Actualizar al cerrar esta fase | Registrar que la spec 000 está aprobada, el plan está creado y quedan las aprobaciones técnicas descritas abajo. No cubre RF funcionales. |

### Configuración de publicación externa al repositorio

Configurar Cloudflare Pages para observar la rama principal, ejecutar `pnpm verify` como único comando de gate y publicar el resultado estático de `dist/` en la URL pública. Los registros de build/publicación deben dejar visible el fallo, incluido el primer despliegue. Esto cubre RF-14–RF-16 y RF-25. No se propone añadir un flujo alternativo de GitHub ni un backend.

**Condición de publicación:** la home ES pública debe responder HTTP 200. Si el gate falla, Cloudflare no debe sustituir la versión activa; si es el primer despliegue, no debe quedar una versión publicada y el fallo debe quedar en el registro. Si una publicación pasa el build pero la URL ES no responde 200, debe conservarse/restaurarse la última publicación satisfactoria.

## Modelo de dominio y mappers

No aplica a esta spec. La fundación no publica obras, series ni datos del artista provenientes de contenido editorial, y no transforma datos externos. Los textos de interfaz son mensajes localizados, no un modelo de dominio. Crear un modelo o mappers aquí ampliaría el alcance sin cubrir ningún RF.

## Algoritmos en pseudocódigo

### Selección de idioma y ruta

```text
si la ruta es "/":
    mostrar home ES
si la ruta es "/en/":
    mostrar home EN
si la ruta es desconocida o usa un idioma no admitido:
    responder HTTP 404 con contenido ES y EN
al usar el selector:
    enlazar a la home del otro idioma
```

### Gate y publicación

```text
al llegar un cambio a la rama principal:
    ejecutar una vez pnpm verify
    si lint, tipos, tests o build falla:
        dejar registro visible del fallo
        si no existe publicación satisfactoria anterior:
            no publicar ninguna versión
        si existe publicación satisfactoria anterior:
            mantenerla activa
        parar
    preparar la publicación
    comprobar que la home ES pública responde HTTP 200
    si responde 200:
        marcar la publicación como satisfactoria
    si no responde 200:
        dejar registro visible del fallo
        mantener/restaurar la última publicación satisfactoria, si existe
```

El gate automatizado se limita a lint, tipos, tests y build. La comprobación de HTTP 200 es una condición de éxito de publicación; Lighthouse sigue siendo una evaluación manual separada.

## Construcción de la interfaz

- **`BaseLayout`:** recibe el idioma y metadatos de la home; define `lang`, título y descripción únicos por idioma, canonical y hreflang recíproco entre `/` y `/en/`. La 404 no se presenta como home ni genera enlaces hreflang a una ruta inexistente.
- **Cabecera:** `SiteHeader` compone marca y `LanguageSwitcher`. No se añade navegación de secciones.
- **Selector:** enlaces HTML convencionales entre las homes; evita JavaScript de cliente y permite navegación por teclado.
- **Home:** muestra únicamente el nombre aprobado y la identificación del artista en ES/EN.
- **Pie:** `SiteFooter` usa la marca sin inventar biografía, contacto ni contenido editorial.
- **404:** conserva el layout, presenta el mensaje en ambos idiomas, enlaza ambas homes y devuelve HTTP 404.
- **Tokens:** fondo `surface-lowest`, texto `on-surface`, estado/selección `primary` y las parejas de texto-superficie aprobadas en `design/tokens.md`. Usar las fuentes Bodoni Moda/Newsreader/Geist y las escalas tipográficas declaradas allí. Radio `0`; gutter/margen responsive mobile-first: móvil `<768px`, tablet `768–1279px`, escritorio `≥1280px`. Sin valores arbitrarios, colores/fuentes hardcodeados ni opacidad en texto.
- **Checklist visual:** revisar a 375, 768 y 1280 px o más: marca, selector y pie visibles; ausencia de enlaces de navegación; márgenes/columnas/gutters según tokens; sin overflow horizontal; radios 0 y texto AA.

## Decisiones técnicas

1. **Generación estática y rutas explícitas.** Astro crea `/` y `/en/` y el 404. Se ajusta a la fundación sin contenido dinámico y a la constitución de contenido disponible en build. Alternativa descartada: resolver idioma o páginas en tiempo de ejecución, innecesario para dos rutas fijas.
2. **Tailwind CSS v4 con `@theme`.** El mapeo fuente es `design/tokens.md`; `src/styles/global.css` refleja sus variables y los cortes mobile-first `tablet` (768 px) y `desktop` (1280 px). Alternativa descartada: CSS con valores aislados, utilidades arbitrarias o los breakpoints predeterminados de Tailwind, porque divergen de los tokens aprobados.
3. **Mensajes separados ES/EN y paridad de claves en Vitest.** Hace verificable que las páginas tengan las mismas claves y evita texto de interfaz hardcodeado en componentes. Alternativa descartada: duplicar textos directamente en las páginas.
4. **Enlaces HTML para el selector.** Las rutas son fijas y no necesitan hidratación. Alternativa descartada: detección automática del idioma del navegador, que contradiría ES por defecto.
5. **Cloudflare Pages conectado a la rama principal.** Aprovecha el hosting ya definido y sus registros de despliegue; el gate único se ejecuta como comando de build. Alternativa descartada: un workflow de publicación separado que duplicaría el gate y añadiría otro sistema de despliegue.
6. **Sin modelo de dominio ni mappers.** No hay contenido de obra que modelar en esta fundación. Alternativa descartada: introducir tipos/transformaciones vacíos que no aportan comportamiento.

## Estrategia de verificación y cobertura

| Verificación | Método y criterio | RF/RNF cubiertos |
|---|---|---|
| Gate automático único | `pnpm verify`: lint, tipos, tests y build; no publicar si alguno falla. | RF-14, RF-16, RF-24, RF-25 |
| Paridad y rutas ES/EN | Vitest compara las claves exactas de ambos diccionarios y prueba `/` → ES, `/en/` → EN y rutas desconocidas → 404. | RF-1, RF-17–RF-20, RF-23, RF-24; RNF-1 |
| Salida generada y metadatos | Build y revisión de páginas ES/EN: `lang`, títulos/descripciones únicos, canonical y hreflang recíproco; 404 con contenido bilingüe. | RF-18, RF-20, RF-23; RNF-4, RNF-5 |
| Interfaz | Chrome DevTools a 375, 768 y ≥1280 px; revisar layout frente a referencias, tokens, ausencia de overflow, contraste AA y foco ≥3:1. Operar selector/cabecera/pie con teclado. | RF-19, RF-21, RF-22; RNF-2, RNF-3 |
| Publicación | En la URL pública, confirmar home ES HTTP 200 y que `/en/` responde con la home inglesa. Comprobar registros ante fallo y que la versión anterior siga activa; para el primer fallo, confirmar que no haya publicación activa. | RF-14–RF-18, RF-25 |
| Rendimiento y auditoría manual | Lighthouse, separado de `pnpm verify`, en ambas homes en móvil: rendimiento ≥90. Aplicar además los umbrales manuales de AGENTS.md: accesibilidad ≥95 y SEO 100. | RNF-2, RNF-4, RNF-7 |
| Sin comercio | Revisar ambas homes y layout: no hay enlaces ni elementos de carrito, checkout o pago. | RF-13 |

## Aprobaciones requeridas antes de implementar

- **⚠️ Modificar `@theme`:** cambiar valores en `src/styles/global.css` requiere aprobación previa según AGENTS.md. El plan no propone cambiar los tokens canónicos; el mapeo debe reproducir `design/tokens.md`.
- **⚠️ Añadir dependencias:** el repositorio no tiene manifiesto ni dependencias instaladas. Astro, integración Tailwind v4, TypeScript/check, Vitest y lint requerirán dependencias fijadas; solicitar aprobación antes de añadirlas.
- **⚠️ Crear configuración en la raíz:** `astro.config.mjs`, `tsconfig.json`, `eslint.config.js` y `vitest.config.ts` no están en la estructura enumerada. Confirmar la creación de esos archivos estándar antes de implementarlos.
- **⚠️ Garantía de HTTP 200 y rollback:** la integración Git nativa despliega al pasar el build, pero debe verificarse que Cloudflare Pages puede comprobar el HTTP 200 y conservar/restaurar la versión anterior cuando el build pasa pero la home pública no responde 200. Si se requiere un workflow o API adicional para promoción/rollback, requiere aprobación; podría implicar archivos fuera de la estructura, credenciales y otra dependencia.

## Matriz de cobertura RF

| RF | Partes del plan |
|---|---|
| RF-1 | Mensajes ES/EN, rutas y selector. |
| RF-13 | Home y layout sin funciones de comercio. |
| RF-14 | Gate y publicación desde la rama principal. |
| RF-15 | Comprobación de home ES HTTP 200. |
| RF-16 | Mantener/restaurar última publicación satisfactoria ante fallo. |
| RF-17 | Rutas `/` y `/en/`. |
| RF-18 | Homes localizadas y 404 bilingüe. |
| RF-19 | `LanguageSwitcher` y metadatos hreflang. |
| RF-20 | Canonical/hreflang en `BaseLayout`. |
| RF-21 | Cabecera, selector y pie en el layout base; sin navegación. |
| RF-22 | Contenido mínimo localizado en ambas homes. |
| RF-23 | 404 HTTP bilingüe para rutas desconocidas/idiomas no admitidos. |
| RF-24 | Gate único y test de claves idénticas ES/EN. |
| RF-25 | Primer fallo sin publicación y con registro visible. |
