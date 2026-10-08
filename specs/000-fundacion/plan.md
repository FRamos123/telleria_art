# Plan 000 — Fundación

**Spec de referencia:** 000-fundacion, aprobada.

> **Nota de vigencia (2026-10-07):** este plan describe únicamente la fundación ya implementada. La ausencia de comercio en esa entrega no limita fases futuras; las compras de originales y prints requieren una spec comercial propia aprobada.

## Alcance del plan

Publicar una fundación estática y mínima con home ES/EN, layout base, selector, 404 bilingüe y despliegue automático desde la rama principal. No incluye contenido editorial de obras o series, consultas, modelos de dominio ni mappers.

## Archivos y responsabilidades

El repositorio no contiene aún `package.json`, configuración Astro ni `src/`; estos archivos y directorios se crearían dentro de la estructura ya declarada.

| Archivo | Acción | Responsabilidad / cobertura |
|---|---|---|
| `package.json` | Crear | Dependencias fijadas y scripts `lint`, `check`, `test`, `build` y `verify`. `verify` ejecuta una sola secuencia: lint → tipos → build → tests; la comprobación de páginas del build se integra en T7, cuando existan las tres rutas. RF-14, RF-24. |
| `pnpm-lock.yaml` | Crear | Fijar las versiones resueltas para instalaciones repetibles. RF-24. |
| `pnpm-workspace.yaml` | Crear | Configuración de PNPM 11: permitir explícitamente el script de instalación de `esbuild`, requerido por Vite. RF-14, RF-24. |
| `.gitignore` | Crear | Excluir dependencias y artefactos generados (`node_modules/`, `dist/`, `.astro/`). RF-14, RF-24. |
| `astro.config.mjs` | Crear | Configurar generación estática e integración de Tailwind v4 con Vite. RF-14, RF-24. |
| `tsconfig.json` | Crear | Configuración de comprobación de tipos para el proyecto. RF-24. |
| `eslint.config.js` | Crear | Reglas y alcance del lint. RF-24. |
| `vitest.config.ts` | Crear | Configuración de Vitest para pruebas de localización y comportamiento puro. RF-24. |
| `src/env.d.ts` | Crear | Referencias de tipos de Astro para que TypeScript pueda comprobar los archivos fuente desde el inicio. RF-24. |
| `src/styles/global.css` | Crear | Importar Tailwind v4, declarar `@theme` de acuerdo con `design/tokens.md` y aplicar las reglas globales del layout. RF-21, RNF-2, RNF-3. **Modificar `@theme` requiere aprobación previa.** |
| `src/i18n/es.ts`, `src/i18n/en.ts` | Crear | Textos ES/EN para la marca, home, selector y 404; sin contenido inventado. RF-1, RF-18, RF-22, RF-23, RNF-1. |
| `src/i18n/index.ts` | Crear | Tipos y acceso a los mensajes por idioma y por las rutas acordadas. RF-1, RF-17–RF-20. |
| `src/i18n/messages.test.ts` | Crear | Comprobar que ES y EN contienen exactamente las mismas claves y probar la selección de idioma. RF-17–RF-20, RF-24. |
| `src/i18n/build-output.test.ts` | Crear en T7 | Después del build, comprobar que `dist/` contiene la home ES, la home EN y la 404. RF-15. |
| `src/layouts/BaseLayout.astro` | Crear | Documento común, atributo `lang`, metadatos, canonical, hreflang de la home, estilos y composición de cabecera, contenido y pie. RF-18–RF-21, RNF-1–RNF-5. |
| `src/components/SiteHeader.astro` | Crear | Marca del artista y selector; sin enlaces de navegación. RF-19, RF-21, RNF-2, RNF-3. |
| `src/components/LanguageSwitcher.astro` | Crear | Enlaces nativos entre `/` y `/en/`, con idioma actual indicado y nombres accesibles. RF-1, RF-17–RF-19, RNF-1, RNF-2. |
| `src/components/SiteFooter.astro` | Crear | Pie minimalista con la marca, de acuerdo con el patrón estimado, sin texto editorial inventado ni enlaces de navegación. RF-21, RNF-3. |
| `src/pages/index.astro` | Crear | Home española en `/`, con nombre y «Pintor · Vigo, Galicia». RF-1, RF-17, RF-20, RF-22, RNF-4, RNF-5. |
| `src/pages/en/index.astro` | Crear | Home inglesa en `/en/`, con la traducción correspondiente. RF-1, RF-17–RF-20, RF-22, RNF-1, RNF-4, RNF-5. |
| `src/pages/404.astro` | Crear | Página 404 bilingüe, con enlaces a ambas homes y estado HTTP 404. RF-18, RF-23, RNF-2, RNF-5. |
| `MEMORY.md` | Actualizar al cerrar tareas | Registrar tareas completadas, cobertura RF, decisiones vigentes y próximo paso. |

### Configuración de publicación externa al repositorio

Configurar Cloudflare Pages para observar la rama principal, ejecutar `pnpm verify` como comando de build y publicar el resultado estático de `dist/` solo si el comando termina con éxito. La verificación incluye lint, tipos, build, tests posteriores al build y la presencia de las páginas ES, EN y 404. Los registros de build/publicación deben dejar visible el fallo, incluido el primer despliegue. Esto cubre RF-14–RF-16 y RF-25. No se propone añadir un flujo alternativo de GitHub ni un backend.

**Condición de publicación:** solo el éxito de `pnpm verify` condiciona la publicación. Si el gate falla, Cloudflare no debe sustituir la versión activa; si es el primer despliegue, no debe quedar una versión publicada y el fallo debe quedar en el registro. Después del primer despliegue se comprueba que la home ES pública responde HTTP 200 como criterio de finalización; esta comprobación no bloquea la publicación ni activa un rollback automático.

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
    pnpm verify ejecuta lint, tipos, build y tests
    los tests comprueban claves ES/EN y que el build contiene home ES, home EN y 404
    si falla cualquier paso:
        dejar registro visible del fallo
        si no existe publicación satisfactoria anterior:
            no publicar ninguna versión
        si existe publicación satisfactoria anterior:
            mantenerla activa
        parar
    publicar el resultado estático
    después del primer despliegue:
        comprobar manualmente que la home ES pública responde HTTP 200
        si no responde 200, no se cumple el criterio de finalización
```

El gate automatizado único incluye lint, tipos, build y tests. La comprobación HTTP 200 posterior al primer despliegue es una evaluación de finalización, no una puerta de publicación ni una garantía de rollback. Lighthouse sigue siendo una evaluación manual separada.

La comprobación de las páginas generadas se incorpora al conjunto de tests en T7, después de crear la 404 y las dos homes. Hasta entonces `pnpm verify` valida los controles disponibles sin exigir páginas que todavía no forman parte del proyecto; una vez añadida, la prueba de salida del build falla si falta cualquiera de las tres páginas.

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
5. **Cloudflare Pages conectado a la rama principal.** Aprovecha el hosting ya definido y sus registros de despliegue; `pnpm verify` es el comando de build y la plataforma publica solo si termina con éxito. No se intenta bloquear ni revertir una publicación mediante una comprobación HTTP posterior, ya que la plataforma no ofrece esa garantía. Alternativa descartada: un workflow de publicación/promoción adicional, que añadiría otro sistema y no forma parte de esta spec.
6. **Sin modelo de dominio ni mappers.** No hay contenido de obra que modelar en esta fundación. Alternativa descartada: introducir tipos/transformaciones vacíos que no aportan comportamiento.

## Estrategia de verificación y cobertura

| Verificación | Método y criterio | RF/RNF cubiertos |
|---|---|---|
| Gate automático único | `pnpm verify`: lint, tipos, build y tests; los tests validan las claves y que el build contiene home ES, home EN y 404. No publicar si falla cualquier parte. | RF-14–RF-16, RF-24, RF-25 |
| Paridad y rutas ES/EN | Vitest compara las claves exactas de ambos diccionarios y prueba `/` → ES, `/en/` → EN y rutas desconocidas → 404. | RF-1, RF-17–RF-20, RF-23, RF-24; RNF-1 |
| Salida generada y metadatos | Build y revisión de páginas ES/EN: `lang`, títulos/descripciones únicos, canonical y hreflang recíproco; 404 con contenido bilingüe. | RF-18, RF-20, RF-23; RNF-4, RNF-5 |
| Interfaz | Chrome DevTools a 375, 768 y ≥1280 px; revisar layout frente a referencias, tokens, ausencia de overflow, contraste AA y foco ≥3:1. Operar selector/cabecera/pie con teclado. | RF-19, RF-21, RF-22; RNF-2, RNF-3 |
| Publicación | Comprobar que un gate fallido no sustituye la versión activa y que un primer fallo no publica versión y deja registro. Tras el primer despliegue, comprobar manualmente que la home ES responde HTTP 200; esta comprobación no bloquea ni revierte la publicación. | RF-14–RF-18, RF-25 |
| Rendimiento y auditoría manual | Lighthouse, separado de `pnpm verify`, en ambas homes en móvil: rendimiento ≥90. Aplicar además los umbrales manuales de AGENTS.md: accesibilidad ≥95 y SEO 100. | RNF-2, RNF-4, RNF-7 |
| Sin comercio | Revisar ambas homes y layout: no hay enlaces ni elementos de carrito, checkout o pago. | RF-13 |

## Aprobaciones técnicas cerradas (T1)

- **Dependencias aprobadas:** Astro para generación estática, `@tailwindcss/vite` para Tailwind CSS v4, TypeScript, Vitest y ESLint. Sus versiones compatibles exactas se fijarán en `package.json` y `pnpm-lock.yaml` al ejecutar T2; no se añaden otras dependencias sin aprobación.
- **Archivos raíz aprobados:** `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.gitignore`, `astro.config.mjs`, `tsconfig.json`, `eslint.config.js` y `vitest.config.ts`.
- **`@theme` aprobado:** crear `src/styles/global.css` reflejando los valores canónicos de `design/tokens.md`, sin cambiar dichos valores.
- **Publicación aprobada:** Cloudflare Pages observará la rama principal y publicará `dist/` únicamente cuando `pnpm verify` termine con éxito. Un fallo no sustituirá la versión activa; el primer fallo no publicará versión y quedará en los registros. La comprobación HTTP 200 posterior al primer despliegue es manual y no bloquea ni activa rollback.
- **Aprobación inicial del usuario:** confirmada el 2026-10-07 para el alcance técnico de T1 descrito arriba.
- **Aprobación adicional durante T2:** se autorizó permitir el script de instalación de `esbuild` mediante `pnpm-workspace.yaml` para completar la instalación y verificación.

## Matriz de cobertura RF

| RF | Partes del plan |
|---|---|
| RF-1 | Mensajes ES/EN, rutas y selector. |
| RF-13 | Home y layout sin funciones de comercio. |
| RF-14 | Gate y publicación desde la rama principal. |
| RF-15 | El build contiene home ES, home EN y 404. |
| RF-16 | Si falla la verificación, la versión activa no se sustituye. |
| RF-17 | Rutas `/` y `/en/`. |
| RF-18 | Homes localizadas y 404 bilingüe. |
| RF-19 | `LanguageSwitcher` y metadatos hreflang. |
| RF-20 | Canonical/hreflang en `BaseLayout`. |
| RF-21 | Cabecera, selector y pie en el layout base; sin navegación. |
| RF-22 | Contenido mínimo localizado en ambas homes. |
| RF-23 | 404 HTTP bilingüe para rutas desconocidas/idiomas no admitidos. |
| RF-24 | Gate único y test de claves idénticas ES/EN. |
| RF-25 | Primer fallo sin publicación y con registro visible. |
